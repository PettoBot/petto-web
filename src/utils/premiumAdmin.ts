import { getEnv } from './env';
import { resetGuildPremiumCustomization } from './premium';

export const PETTO_OWNER_ID = '293504726505357312';

type Settings = { url: string; key: string };

export interface ManualPremiumGrant {
  id: number;
  user_id: string;
  provider_subscription_id: string | null;
  plan_key: string;
  status: string;
  slot_limit: number;
  current_period_end: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  assignments: Array<{ guild_id: string; status: string }>;
}

function settings(astro: any): Settings | null {
  const url = getEnv(astro, 'PETTO_BOT_API_URL');
  const key = getEnv(astro, 'PETTO_BOT_API_SECRET');
  return url && key ? { url, key } : null;
}

function headers(key: string, extra: Record<string, string> = {}): HeadersInit {
  return { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json', ...extra };
}

function validDiscordId(value: string): boolean {
  return /^\d{15,22}$/.test(value);
}

function ownerId(astro: any): string {
  return getEnv(astro, 'PETTO_OWNER_ID') || PETTO_OWNER_ID;
}

export function isPettoOwner(astro: any, userId: string): boolean {
  return validDiscordId(userId) && userId === ownerId(astro);
}

async function read<T>(astro: any, table: string, query: string): Promise<T[]> {
  const config = settings(astro);
  if (!config) return [];
  try {
    const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, { headers: headers(config.key) });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data as T[] : [];
  } catch {
    return [];
  }
}

function grantKey(targetType: 'user' | 'server', targetId: string): string {
  return `manual:${targetType}:${targetId}`;
}

function isLiveEntitlement(entitlement: { status: string; current_period_end: string | null } | undefined): boolean {
  if (!entitlement || entitlement.status !== 'active') return false;
  if (!entitlement.current_period_end) return true;
  const periodEnd = new Date(entitlement.current_period_end).getTime();
  return Number.isFinite(periodEnd) && periodEnd > Date.now();
}

export async function listManualPremium(astro: any): Promise<ManualPremiumGrant[]> {
  const entitlements = await read<ManualPremiumGrant>(
    astro,
    'premium_entitlements',
    'provider=eq.manual&select=id,user_id,provider_subscription_id,plan_key,status,slot_limit,current_period_end,metadata,created_at&order=updated_at.desc',
  );
  if (!entitlements.length) return [];

  const assignments = await read<{ entitlement_id: number; guild_id: string; status: string }>(
    astro,
    'premium_slot_assignments',
    'select=entitlement_id,guild_id,status&order=assigned_at.desc',
  );
  const byEntitlement = new Map<number, Array<{ guild_id: string; status: string }>>();
  for (const assignment of assignments) {
    const list = byEntitlement.get(assignment.entitlement_id) ?? [];
    list.push({ guild_id: assignment.guild_id, status: assignment.status });
    byEntitlement.set(assignment.entitlement_id, list);
  }
  return entitlements.map((grant) => ({ ...grant, assignments: byEntitlement.get(grant.id) ?? [] }));
}

export type GrantResult =
  | { ok: true }
  | { ok: false; code: 'invalid' | 'database' | 'slot_conflict' | 'server_taken' };

export async function grantManualPremium(
  astro: any,
  actorId: string,
  input: { targetType: string; userId: string; guildId: string; slotLimit: number },
): Promise<GrantResult> {
  if (!isPettoOwner(astro, actorId)) return { ok: false, code: 'invalid' };

  const targetType = input.targetType === 'server' ? 'server' : input.targetType === 'user' ? 'user' : null;
  const userId = input.userId.trim() || actorId;
  const guildId = input.guildId.trim();
  const slotLimit = Number(input.slotLimit);
  if (!targetType || !validDiscordId(userId) || !Number.isInteger(slotLimit) || slotLimit < 1 || slotLimit > 1000) {
    return { ok: false, code: 'invalid' };
  }
  if (targetType === 'user' && !validDiscordId(input.userId.trim())) return { ok: false, code: 'invalid' };
  if (targetType === 'server' && !validDiscordId(guildId)) return { ok: false, code: 'invalid' };

  const config = settings(astro);
  if (!config) return { ok: false, code: 'database' };
  const key = grantKey(targetType, targetType === 'user' ? userId : guildId);
  const existing = await read<{ id: number }>(astro, 'premium_entitlements', `provider_subscription_id=eq.${encodeURIComponent(key)}&select=id&limit=1`);

  if (targetType === 'server') {
    const activeElsewhere = await read<{ id: number; entitlement_id: number }>(
      astro,
      'premium_slot_assignments',
      `guild_id=eq.${encodeURIComponent(guildId)}&status=eq.active&select=id,entitlement_id&limit=1`,
    );
    if (activeElsewhere[0] && activeElsewhere[0].entitlement_id !== existing[0]?.id) {
      const assignedEntitlement = await read<{ status: string; current_period_end: string | null }>(
        astro,
        'premium_entitlements',
        `id=eq.${activeElsewhere[0].entitlement_id}&select=status,current_period_end&limit=1`,
      );
      if (isLiveEntitlement(assignedEntitlement[0])) return { ok: false, code: 'server_taken' };

      const released = await fetch(`${config.url}/rest/v1/premium_slot_assignments?id=eq.${activeElsewhere[0].id}&status=eq.active`, {
        method: 'PATCH',
        headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify({ status: 'released', released_at: new Date().toISOString() }),
      });
      if (!released.ok) return { ok: false, code: 'database' };
    }
  }

  if (existing[0]) {
    const assigned = await read<{ id: number }>(astro, 'premium_slot_assignments', `entitlement_id=eq.${existing[0].id}&status=eq.active&select=id`);
    if (assigned.length > slotLimit) return { ok: false, code: 'slot_conflict' };
  }

  const now = new Date().toISOString();
  const metadata = {
    permanent: true,
    granted_by: actorId,
    target_type: targetType,
    target_user_id: targetType === 'user' ? userId : null,
    target_guild_id: targetType === 'server' ? guildId : null,
    granted_at: now,
  };
  const response = await fetch(`${config.url}/rest/v1/premium_entitlements?on_conflict=provider_subscription_id`, {
    method: 'POST',
    headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=representation' }),
    body: JSON.stringify({
      user_id: userId,
      provider: 'manual',
      provider_subscription_id: key,
      plan_key: `premium-manual-${slotLimit}`,
      status: 'active',
      slot_limit: slotLimit,
      current_period_end: null,
      metadata,
      updated_at: now,
    }),
  });
  if (!response.ok) return { ok: false, code: 'database' };

  if (targetType !== 'server') return { ok: true };
  const row = await response.json();
  const entitlementId = Array.isArray(row) ? row[0]?.id : null;
  const persistedEntitlementId = entitlementId
    ?? (await read<{ id: number }>(astro, 'premium_entitlements', `provider_subscription_id=eq.${encodeURIComponent(key)}&select=id&limit=1`))[0]?.id;
  if (!persistedEntitlementId) return { ok: false, code: 'database' };

  const assignment = await read<{ id: number }>(astro, 'premium_slot_assignments', `entitlement_id=eq.${persistedEntitlementId}&guild_id=eq.${encodeURIComponent(guildId)}&select=id&limit=1`);
  const assignmentResponse = assignment[0]
    ? await fetch(`${config.url}/rest/v1/premium_slot_assignments?id=eq.${assignment[0].id}`, {
        method: 'PATCH',
        headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify({ user_id: userId, status: 'active', released_at: null }),
      })
    : await fetch(`${config.url}/rest/v1/premium_slot_assignments`, {
        method: 'POST',
        headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify({ entitlement_id: persistedEntitlementId, user_id: userId, guild_id: guildId, status: 'active' }),
      });
  return assignmentResponse.ok ? { ok: true } : { ok: false, code: 'database' };
}

export async function revokeManualPremium(astro: any, actorId: string, entitlementId: number): Promise<boolean> {
  if (!isPettoOwner(astro, actorId) || !Number.isInteger(entitlementId)) return false;
  const config = settings(astro);
  if (!config) return false;
  const now = new Date().toISOString();
  const assignments = await read<{ guild_id: string }>(astro, 'premium_slot_assignments', `entitlement_id=eq.${entitlementId}&status=eq.active&select=guild_id`);
  await Promise.all(assignments.map((assignment) => resetGuildPremiumCustomization(astro, assignment.guild_id)));
  const entitlementResponse = await fetch(`${config.url}/rest/v1/premium_entitlements?id=eq.${entitlementId}&provider=eq.manual`, {
    method: 'PATCH',
    headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify({ status: 'expired', current_period_end: now, updated_at: now, metadata: { revoked_by: actorId, revoked_at: now } }),
  });
  if (!entitlementResponse.ok) return false;
  const assignmentResponse = await fetch(`${config.url}/rest/v1/premium_slot_assignments?entitlement_id=eq.${entitlementId}&status=eq.active`, {
    method: 'PATCH',
    headers: headers(config.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify({ status: 'released', released_at: now }),
  });
  return assignmentResponse.ok;
}
