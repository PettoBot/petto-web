import { getEnv } from './env';
import { resetGuildPremiumCustomization } from './premium';

const SUBSCRIPTION_EVENTS = new Set([
  'subscription.created',
  'subscription.active',
  'subscription.updated',
  'subscription.uncanceled',
  'subscription.past_due',
  'subscription.paused',
  'subscription.resumed',
  'subscription.canceled',
  'subscription.revoked',
]);

function settings(astro: any): { url: string; key: string } | null {
  const url = getEnv(astro, 'SUPABASE_URL');
  const key = getEnv(astro, 'SUPABASE_SERVICE_ROLE_KEY');
  return url && key ? { url, key } : null;
}

function supabaseHeaders(key: string, extra: Record<string, string> = {}): HeadersInit {
  return { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json', ...extra };
}

function decodeBase64(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function sameBytes(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left[index] ^ right[index];
  return result === 0;
}

/** Validates Polar's Standard Webhooks signature against the untouched body. */
export async function verifyPolarWebhook(body: string, headers: Headers, secret: string): Promise<boolean> {
  const webhookId = headers.get('webhook-id');
  const timestampHeader = headers.get('webhook-timestamp');
  const signatureHeader = headers.get('webhook-signature');
  if (!webhookId || !timestampHeader || !signatureHeader || !secret) return false;

  const timestamp = Number(timestampHeader);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isInteger(timestamp) || Math.abs(now - timestamp) > 300) return false;

  try {
    const encodedSecret = secret.startsWith('whsec_') ? secret.slice(6) : secret;
    const key = await crypto.subtle.importKey(
      'raw',
      decodeBase64(encodedSecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const signed = new TextEncoder().encode(`${webhookId}.${timestamp}.${body}`);
    const expected = new Uint8Array(await crypto.subtle.sign('HMAC', key, signed));
    return signatureHeader.split(' ').some((candidate) => {
      const [version, value] = candidate.split(',', 2);
      if (version !== 'v1' || !value) return false;
      try { return sameBytes(expected, decodeBase64(value)); } catch { return false; }
    });
  } catch {
    return false;
  }
}

function iso(value: unknown): string | null {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function userIdFrom(subscription: any, metadata: Record<string, any>): string | null {
  const value = subscription.customer?.external_id
    ?? metadata.discord_user_id
    ?? metadata.discordUserId
    ?? metadata.user_id;
  const id = String(value ?? '').trim();
  return /^\d{15,22}$/.test(id) ? id : null;
}

function statusFor(type: string, status: string | undefined): 'pending' | 'active' | 'past_due' | 'canceled' | 'expired' {
  if (type === 'subscription.revoked') return 'expired';
  if (type === 'subscription.canceled' || type === 'subscription.paused') return 'canceled';
  if (type === 'subscription.past_due') return 'past_due';
  if (type === 'subscription.active' || type === 'subscription.uncanceled' || type === 'subscription.resumed') return 'active';
  if (status === 'active' || status === 'trialing') return 'active';
  if (status === 'past_due') return 'past_due';
  if (status === 'canceled' || status === 'unpaid' || status === 'paused') return 'canceled';
  if (status === 'incomplete_expired') return 'expired';
  return 'pending';
}

async function fulfillPending(astro: any, entitlementId: number, userId: string, slotLimit: number): Promise<void> {
  const config = settings(astro);
  if (!config) return;
  const activeUrl = `${config.url}/rest/v1/premium_slot_assignments?entitlement_id=eq.${entitlementId}&status=eq.active&select=guild_id`;
  const pendingUrl = `${config.url}/rest/v1/premium_slot_requests?user_id=eq.${encodeURIComponent(userId)}&status=eq.pending&select=id,guild_id&order=created_at.asc`;
  const [activeResponse, pendingResponse] = await Promise.all([
    fetch(activeUrl, { headers: supabaseHeaders(config.key) }),
    fetch(pendingUrl, { headers: supabaseHeaders(config.key) }),
  ]);
  if (!activeResponse.ok || !pendingResponse.ok) return;
  const active = await activeResponse.json() as Array<{ guild_id: string }>;
  const pending = await pendingResponse.json() as Array<{ id: number; guild_id: string }>;
  let remaining = Math.max(0, slotLimit - active.length);

  for (const request of pending) {
    if (!remaining) break;
    const assignmentResponse = await fetch(`${config.url}/rest/v1/premium_slot_assignments?on_conflict=entitlement_id,guild_id`, {
      method: 'POST',
      headers: supabaseHeaders(config.key, { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ entitlement_id: entitlementId, user_id: userId, guild_id: request.guild_id, status: 'active', released_at: null }),
    });
    if (!assignmentResponse.ok) continue;
    await fetch(`${config.url}/rest/v1/premium_slot_requests?id=eq.${request.id}`, {
      method: 'PATCH',
      headers: supabaseHeaders(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify({ status: 'approved', updated_at: new Date().toISOString() }),
    });
    remaining -= 1;
  }
}

export async function syncPolarSubscription(astro: any, event: any): Promise<boolean> {
  if (!event || !SUBSCRIPTION_EVENTS.has(event.type)) return false;
  const config = settings(astro);
  if (!config) throw new Error('Supabase Premium configuration is missing.');

  const subscription = event.data ?? {};
  const metadata = { ...(subscription.product?.metadata ?? {}), ...(subscription.metadata ?? {}) };
  const userId = userIdFrom(subscription, metadata);
  if (!userId || !subscription.id) return true;
  const slotValue = Number(metadata.slot_limit ?? metadata.slotLimit ?? 1);
  const slotLimit = Number.isInteger(slotValue) && slotValue > 0 ? slotValue : 1;
  const periodEnd = iso(subscription.current_period_end ?? subscription.ends_at);
  const status = statusFor(event.type, subscription.status);
  const periodValid = !periodEnd || new Date(periodEnd).getTime() > Date.now();
  const row = {
    user_id: userId,
    provider: 'polar',
    provider_subscription_id: String(subscription.id),
    plan_key: String(metadata.plan_key ?? metadata.planKey ?? `premium-${slotLimit}`),
    status,
    slot_limit: slotLimit,
    current_period_end: periodEnd,
    metadata: { polar_event: event.type, product_id: subscription.product_id ?? null, checkout_id: subscription.checkout_id ?? null, polar: event.data },
    updated_at: new Date().toISOString(),
  };

  const upsertResponse = await fetch(`${config.url}/rest/v1/premium_entitlements?on_conflict=provider_subscription_id`, {
    method: 'POST',
    headers: supabaseHeaders(config.key, { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=representation' }),
    body: JSON.stringify(row),
  });
  if (!upsertResponse.ok) throw new Error(`Supabase Premium upsert failed with HTTP ${upsertResponse.status}.`);
  const saved = await upsertResponse.json() as Array<{ id: number }>;
  const entitlementId = saved[0]?.id;
  if (!entitlementId) throw new Error('Supabase Premium upsert returned no entitlement ID.');

  // Release paid slots as soon as the entitlement is not active. The dashboard
  // also fails closed, but keeping assignments active here could make them
  // reappear after a stale cache or let pending requests be fulfilled while a
  // subscription is past due, paused, canceled, or expired.
  if (status !== 'active' || !periodValid) {
    const activeAssignmentsResponse = await fetch(`${config.url}/rest/v1/premium_slot_assignments?entitlement_id=eq.${entitlementId}&status=eq.active&select=guild_id`, {
      headers: supabaseHeaders(config.key),
    });
    const activeAssignments = activeAssignmentsResponse.ok
      ? await activeAssignmentsResponse.json() as Array<{ guild_id: string }>
      : [];

    // Revert every currently assigned server before releasing its slot. This
    // makes expiry/cancellation restore the Free profile even when nobody
    // opens the Customize page afterward.
    await Promise.all(activeAssignments.map(({ guild_id }) => resetGuildPremiumCustomization(astro, guild_id)));
    await fetch(`${config.url}/rest/v1/premium_slot_assignments?entitlement_id=eq.${entitlementId}&status=eq.active`, {
      method: 'PATCH',
      headers: supabaseHeaders(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify({ status: 'released', released_at: new Date().toISOString() }),
    });
  } else if (status === 'active') {
    await fulfillPending(astro, entitlementId, userId, slotLimit);
  }
  return true;
}
