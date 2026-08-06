import { getEnv } from './env';

export type PremiumStatus = 'free' | 'pending' | 'active' | 'past_due' | 'canceled' | 'expired';

export interface PremiumEntitlement {
  id: number;
  user_id: string;
  provider: string;
  plan_key: string;
  status: Exclude<PremiumStatus, 'free'>;
  slot_limit: number;
  current_period_end: string | null;
}

export interface PremiumAssignment {
  id: number;
  entitlement_id: number;
  user_id: string;
  guild_id: string;
  status: 'active' | 'released';
  assigned_at: string;
  released_at: string | null;
}

export interface PremiumRequest {
  id: number;
  user_id: string;
  guild_id: string;
  status: 'pending' | 'approved' | 'declined' | 'canceled';
}

export interface PremiumSnapshot {
  status: PremiumStatus;
  entitlement: PremiumEntitlement | null;
  assignments: PremiumAssignment[];
  requests: PremiumRequest[];
  slotsUsed: number;
  slotsTotal: number;
}

const DEFAULT_POLAR_PRODUCTS: Record<string, string> = {
  'premium-1-month': '15621107-ba45-4f62-a648-636f23c0f9e3',
  'premium-1-year': 'da48d960-a600-461a-b251-8cb684b1cb5f',
  'premium-3-month': 'b7636ff3-c73a-4274-9850-3d4446e3df11',
  'premium-3-year': '1dc59fa1-f358-4172-9327-a61069882366',
  'premium-5-month': '1ec97d11-63af-4573-af09-3075567c4cc7',
  'premium-5-year': '5361b1ef-97e2-470d-8fe3-25da2b49aeeb',
};

function config(astro: any): { url: string; key: string } | null {
  const url = getEnv(astro, 'SUPABASE_URL');
  const key = getEnv(astro, 'SUPABASE_SERVICE_ROLE_KEY');
  return url && key ? { url, key } : null;
}

function headers(key: string, extra: Record<string, string> = {}): HeadersInit {
  return { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json', ...extra };
}

async function read<T>(astro: any, table: string, query: string): Promise<T[]> {
  const settings = config(astro);
  if (!settings) return [];
  try {
    const response = await fetch(`${settings.url}/rest/v1/${table}?${query}`, { headers: headers(settings.key) });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data as T[] : [];
  } catch {
    return [];
  }
}

/** Reads the account's Premium state from the primary Supabase database. */
export async function getPremiumSnapshot(astro: any, userId: string): Promise<PremiumSnapshot> {
  const encodedUser = encodeURIComponent(userId);
  const [entitlements, assignments, requests] = await Promise.all([
    read<PremiumEntitlement>(astro, 'premium_entitlements', `user_id=eq.${encodedUser}&status=in.(active,pending,past_due)&select=id,user_id,provider,plan_key,status,slot_limit,current_period_end&order=created_at.desc&limit=1`),
    read<PremiumAssignment>(astro, 'premium_slot_assignments', `user_id=eq.${encodedUser}&select=id,entitlement_id,user_id,guild_id,status,assigned_at,released_at&order=assigned_at.desc`),
    read<PremiumRequest>(astro, 'premium_slot_requests', `user_id=eq.${encodedUser}&status=eq.pending&select=id,user_id,guild_id,status&order=created_at.desc`),
  ]);

  const entitlement = entitlements[0] ?? null;
  const periodValid = !entitlement?.current_period_end || new Date(entitlement.current_period_end).getTime() > Date.now();
  const entitlementIsActive = ['active', 'past_due', 'canceled'].includes(entitlement?.status ?? '') && periodValid;
  const activeAssignments = entitlementIsActive
    ? assignments.filter((assignment) => assignment.status === 'active' && assignment.entitlement_id === entitlement.id)
    : [];
  const status: PremiumStatus = entitlement?.status === 'active' && !periodValid ? 'expired' : entitlement?.status ?? 'free';
  const slotsTotal = entitlementIsActive ? Math.max(0, entitlement.slot_limit) : 0;

  return {
    status,
    entitlement,
    assignments: activeAssignments,
    requests,
    slotsUsed: activeAssignments.length,
    slotsTotal,
  };
}

/** Returns whether this account has an active Premium slot on this guild. */
export async function hasPremiumForGuild(astro: any, userId: string, guildId: string): Promise<boolean> {
  const snapshot = await getPremiumSnapshot(astro, userId);
  return snapshot.assignments.some((assignment) => assignment.guild_id === guildId);
}

/** Creates a short-lived Polar checkout tied to this Discord user. */
export async function createPremiumCheckout(astro: any, userId: string, plan: string): Promise<string | null> {
  const token = getEnv(astro, 'POLAR_ACCESS_TOKEN');
  if (!token || !/^\d{15,22}$/.test(userId)) return null;

  const [slots, interval] = String(plan).split('-').slice(1);
  const planKey = `premium-${slots}-${interval}`;
  const productId = getEnv(astro, `POLAR_PRODUCT_PREMIUM_${slots}_${interval.toUpperCase()}`) || DEFAULT_POLAR_PRODUCTS[planKey];
  if (!productId || !['1', '3', '5'].includes(slots) || !['month', 'year'].includes(interval)) return null;

  const origin = astro.url?.origin || getEnv(astro, 'PUBLIC_SITE_URL') || 'https://petto.sbs';
  const apiBase = (getEnv(astro, 'POLAR_SERVER') || 'production').toLowerCase() === 'sandbox'
    ? 'https://sandbox-api.polar.sh'
    : 'https://api.polar.sh';

  try {
    const response = await fetch(`${apiBase}/v1/checkouts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: [productId],
        external_customer_id: userId,
        metadata: { plan_key: `premium-${slots}`, slot_limit: Number(slots), discord_user_id: userId },
        success_url: `${origin}/dash/premium?checkout_id={CHECKOUT_ID}`,
        return_url: `${origin}/dash/premium`,
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.url === 'string' ? data.url : null;
  } catch {
    return null;
  }
}

export function getPublicPremiumCheckoutLink(astro: any): string | null {
  const link = getEnv(astro, 'POLAR_CHECKOUT_LINK');
  return link?.startsWith('https://buy.polar.sh/') ? link : null;
}

/**
 * Lets a logged-in user save a server preference before billing is connected.
 * It intentionally creates a pending request, never an active Premium grant.
 */
export async function requestPremiumServer(astro: any, userId: string, guildId: string): Promise<boolean> {
  const settings = config(astro);
  if (!settings || !/^\d{15,22}$/.test(userId) || !/^\d{15,22}$/.test(guildId)) return false;

  try {
    const response = await fetch(`${settings.url}/rest/v1/premium_slot_requests`, {
      method: 'POST',
      headers: headers(settings.key, { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ user_id: userId, guild_id: guildId, status: 'pending', updated_at: new Date().toISOString() }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function cancelPremiumServerRequest(astro: any, userId: string, guildId: string): Promise<boolean> {
  const settings = config(astro);
  if (!settings) return false;
  try {
    const response = await fetch(`${settings.url}/rest/v1/premium_slot_requests?user_id=eq.${encodeURIComponent(userId)}&guild_id=eq.${encodeURIComponent(guildId)}&status=eq.pending`, {
      method: 'PATCH',
      headers: headers(settings.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify({ status: 'canceled', updated_at: new Date().toISOString() }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/** Releases an active slot without deleting its history. */
export async function releasePremiumServer(astro: any, userId: string, guildId: string): Promise<boolean> {
  const settings = config(astro);
  if (!settings) return false;
  try {
    const response = await fetch(`${settings.url}/rest/v1/premium_slot_assignments?user_id=eq.${encodeURIComponent(userId)}&guild_id=eq.${encodeURIComponent(guildId)}&status=eq.active`, {
      method: 'PATCH',
      headers: headers(settings.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify({ status: 'released', released_at: new Date().toISOString() }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
