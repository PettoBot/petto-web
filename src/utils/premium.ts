import { getEnv } from './env';

export type PremiumStatus = 'free' | 'pending' | 'active' | 'past_due' | 'canceled' | 'expired';
export type PremiumDataState = 'available' | 'not_configured' | 'unavailable';

export interface PremiumEntitlement {
  id: number;
  user_id: string;
  provider: string;
  plan_key: string;
  status: Exclude<PremiumStatus, 'free'>;
  slot_limit: number;
  current_period_end: string | null;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
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
  dataState: PremiumDataState;
  status: PremiumStatus;
  entitlement: PremiumEntitlement | null;
  assignments: PremiumAssignment[];
  requests: PremiumRequest[];
  slotsUsed: number;
  slotsTotal: number;
  history: PremiumEntitlement[];
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

function polarApiBase(astro: any): string {
  return (getEnv(astro, 'POLAR_SERVER') || 'production').toLowerCase() === 'sandbox'
    ? 'https://sandbox-api.polar.sh'
    : 'https://api.polar.sh';
}

async function readResult<T>(astro: any, table: string, query: string): Promise<{ rows: T[]; ok: boolean }> {
  const settings = config(astro);
  if (!settings) return { rows: [], ok: false };
  try {
    const response = await fetch(`${settings.url}/rest/v1/${table}?${query}`, { headers: headers(settings.key) });
    if (!response.ok) return { rows: [], ok: false };
    const data = await response.json();
    return Array.isArray(data) ? { rows: data as T[], ok: true } : { rows: [], ok: false };
  } catch {
    return { rows: [], ok: false };
  }
}

async function read<T>(astro: any, table: string, query: string): Promise<T[]> {
  return (await readResult<T>(astro, table, query)).rows;
}

function emptySnapshot(dataState: PremiumDataState): PremiumSnapshot {
  return {
    dataState,
    status: 'free',
    entitlement: null,
    assignments: [],
    requests: [],
    slotsUsed: 0,
    slotsTotal: 0,
    history: [],
  };
}

async function releaseExpiredEntitlement(astro: any, entitlementId: number, assignments: PremiumAssignment[]): Promise<void> {
  const settings = config(astro);
  if (!settings || !assignments.length) return;
  await Promise.all(assignments.map(async (assignment) => {
    await resetGuildPremiumCustomization(astro, assignment.guild_id);
    await fetch(`${settings.url}/rest/v1/premium_slot_assignments?id=eq.${assignment.id}&status=eq.active`, {
      method: 'PATCH',
      headers: headers(settings.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify({ status: 'released', released_at: new Date().toISOString() }),
    }).catch(() => null);
  }));
}

export async function getPremiumSnapshot(astro: any, userId: string): Promise<PremiumSnapshot> {
  if (!config(astro)) return emptySnapshot('not_configured');

  const encodedUser = encodeURIComponent(userId);
  const [entitlementsResult, assignmentsResult, requestsResult] = await Promise.all([
    readResult<PremiumEntitlement>(astro, 'premium_entitlements', `user_id=eq.${encodedUser}&status=in.(active,pending,past_due,canceled,expired)&select=id,user_id,provider,plan_key,status,slot_limit,current_period_end,created_at,updated_at,metadata&order=created_at.desc&limit=25`),
    readResult<PremiumAssignment>(astro, 'premium_slot_assignments', `user_id=eq.${encodedUser}&select=id,entitlement_id,user_id,guild_id,status,assigned_at,released_at&order=assigned_at.desc`),
    readResult<PremiumRequest>(astro, 'premium_slot_requests', `user_id=eq.${encodedUser}&status=eq.pending&select=id,user_id,guild_id,status&order=created_at.desc`),
  ]);
  const entitlements = entitlementsResult.rows;
  const assignments = assignmentsResult.rows;
  const requests = requestsResult.rows;
  const dataState: PremiumDataState = entitlementsResult.ok && assignmentsResult.ok && requestsResult.ok ? 'available' : 'unavailable';

  const entitlement = entitlements[0] ?? null;
  const periodValid = !entitlement?.current_period_end || new Date(entitlement.current_period_end).getTime() > Date.now();
  const entitlementIsActive = entitlement?.status === 'active' && periodValid;
  const activeAssignments = entitlementIsActive
    ? assignments.filter((assignment) => assignment.status === 'active' && assignment.entitlement_id === entitlement.id)
    : [];
  const status: PremiumStatus = entitlement?.status === 'active' && !periodValid ? 'expired' : entitlement?.status ?? 'free';
  const slotsTotal = entitlementIsActive ? Math.max(0, entitlement.slot_limit) : 0;

  if (entitlement?.status === 'active' && !periodValid) {
    const staleAssignments = assignments.filter((assignment) => assignment.status === 'active' && assignment.entitlement_id === entitlement.id);
    await releaseExpiredEntitlement(astro, entitlement.id, staleAssignments);
  }

  return {
    dataState,
    status,
    entitlement,
    assignments: activeAssignments,
    requests,
    slotsUsed: activeAssignments.length,
    slotsTotal,
    history: entitlements,
  };
}

export async function hasPremiumForGuild(astro: any, userId: string, guildId: string): Promise<boolean> {
  const snapshot = await getPremiumSnapshot(astro, userId);
  return snapshot.assignments.some((assignment) => assignment.guild_id === guildId);
}

export async function createPremiumCheckout(astro: any, userId: string, plan: string): Promise<string | null> {
  const token = getEnv(astro, 'POLAR_ACCESS_TOKEN');
  if (!token || !/^\d{15,22}$/.test(userId)) return null;

  const [slots, interval] = String(plan).split('-').slice(1);
  const planKey = `premium-${slots}-${interval}`;
  const productId = getEnv(astro, `POLAR_PRODUCT_PREMIUM_${slots}_${interval.toUpperCase()}`) || DEFAULT_POLAR_PRODUCTS[planKey];
  if (!productId || !['1', '3', '5'].includes(slots) || !['month', 'year'].includes(interval)) return null;

  const origin = astro.url?.origin || getEnv(astro, 'PUBLIC_SITE_URL') || 'https://petto.sbs';
  const apiBase = polarApiBase(astro);

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

export async function createPremiumCustomerPortalSession(astro: any, userId: string): Promise<string | null> {
  const token = getEnv(astro, 'POLAR_ACCESS_TOKEN');
  if (!token || !/^\d{15,22}$/.test(userId)) return null;

  const origin = astro.url?.origin || getEnv(astro, 'PUBLIC_SITE_URL') || 'https://petto.sbs';
  try {
    const response = await fetch(`${polarApiBase(astro)}/v1/customer-sessions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ external_customer_id: userId, return_url: `${origin}/dash/premium` }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.customer_portal_url === 'string' ? data.customer_portal_url : null;
  } catch {
    return null;
  }
}

export function getPublicPremiumCheckoutLink(astro: any): string | null {
  const link = getEnv(astro, 'POLAR_CHECKOUT_LINK');
  return link?.startsWith('https://buy.polar.sh/') ? link : null;
}

export async function requestPremiumServer(astro: any, userId: string, guildId: string): Promise<boolean> {
  const settings = config(astro);
  if (!settings || !/^\d{15,22}$/.test(userId) || !/^\d{15,22}$/.test(guildId)) return false;

  try {
    const entitlements = await read<Pick<PremiumEntitlement, 'id' | 'provider' | 'slot_limit' | 'current_period_end'>>(
      astro,
      'premium_entitlements',
      `user_id=eq.${encodeURIComponent(userId)}&status=eq.active&select=id,provider,slot_limit,current_period_end&order=updated_at.desc&limit=1`,
    );
    const entitlement = entitlements[0];
    const entitlementIsActive = Boolean(entitlement && (!entitlement.current_period_end || new Date(entitlement.current_period_end).getTime() > Date.now()));

    if (entitlementIsActive && entitlement) {
      const activeAssignments = await read<{ id: number; user_id: string; guild_id: string }>(
        astro,
        'premium_slot_assignments',
        `entitlement_id=eq.${entitlement.id}&status=eq.active&select=id,user_id,guild_id`,
      );
      if (activeAssignments.some((assignment) => assignment.guild_id === guildId)) return true;

      const serverAssignments = await read<{ id: number; user_id: string }>(
        astro,
        'premium_slot_assignments',
        `guild_id=eq.${encodeURIComponent(guildId)}&status=eq.active&select=id,user_id`,
      );
      if (serverAssignments.some((assignment) => assignment.user_id !== userId)) return false;
      if (activeAssignments.length >= Math.max(0, entitlement.slot_limit)) return false;

      const previousAssignmentResponse = await fetch(`${settings.url}/rest/v1/premium_slot_assignments?user_id=eq.${encodeURIComponent(userId)}&guild_id=eq.${encodeURIComponent(guildId)}&status=eq.active`, {
        method: 'PATCH',
        headers: headers(settings.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
        body: JSON.stringify({ status: 'released', released_at: new Date().toISOString() }),
      });
      if (!previousAssignmentResponse.ok) return false;

      const assignmentResponse = await fetch(`${settings.url}/rest/v1/premium_slot_assignments?on_conflict=entitlement_id,guild_id`, {
        method: 'POST',
        headers: headers(settings.key, { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify({ entitlement_id: entitlement.id, user_id: userId, guild_id: guildId, status: 'active', released_at: null }),
      });
      if (assignmentResponse.ok) {
        await fetch(`${settings.url}/rest/v1/premium_slot_requests?user_id=eq.${encodeURIComponent(userId)}&guild_id=eq.${encodeURIComponent(guildId)}&status=eq.pending`, {
          method: 'PATCH',
          headers: headers(settings.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
          body: JSON.stringify({ status: 'approved', updated_at: new Date().toISOString() }),
        }).catch(() => null);
      }
      return assignmentResponse.ok;
    }

    const response = await fetch(`${settings.url}/rest/v1/premium_slot_requests?on_conflict=user_id,guild_id`, {
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

export async function releasePremiumServer(astro: any, userId: string, guildId: string): Promise<boolean> {
  const settings = config(astro);
  if (!settings) return false;
  try {
    const response = await fetch(`${settings.url}/rest/v1/premium_slot_assignments?user_id=eq.${encodeURIComponent(userId)}&guild_id=eq.${encodeURIComponent(guildId)}&status=eq.active`, {
      method: 'PATCH',
      headers: headers(settings.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify({ status: 'released', released_at: new Date().toISOString() }),
    });
    if (!response.ok) return false;
    await resetGuildPremiumCustomization(astro, guildId);
    return true;
  } catch {
    return false;
  }
}

export async function resetGuildPremiumCustomization(astro: any, guildId: string): Promise<boolean> {
  const settings = config(astro);
  if (!settings || !/^\d{15,22}$/.test(String(guildId))) return false;

  const guildResponse = await fetch(`${settings.url}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(guildId)}&select=bot_nickname,bot_avatar_url,bot_banner_url,bot_description`, {
    headers: headers(settings.key),
  }).catch(() => null);
  if (!guildResponse?.ok) return false;
  const guildRows = guildResponse?.ok ? await guildResponse.json() as Array<Record<string, string | null>> : [];
  const hasCustomization = Boolean(guildRows[0]?.bot_nickname || guildRows[0]?.bot_avatar_url || guildRows[0]?.bot_banner_url || guildRows[0]?.bot_description);

  const databaseReset = !hasCustomization || await fetch(`${settings.url}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(guildId)}`, {
    method: 'PATCH',
    headers: headers(settings.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify({
      bot_nickname: null,
      bot_avatar_url: null,
      bot_banner_url: null,
      bot_description: null,
      updated_at: new Date().toISOString(),
    }),
  }).then((response) => response.ok).catch(() => false);

  const botToken = getEnv(astro, 'DISCORD_TOKEN');
  if (!botToken) return databaseReset;

  if (!hasCustomization) return databaseReset;

  const discordReset = await fetch(`https://discord.com/api/guilds/${guildId}/members/@me`, {
    method: 'PATCH',
    headers: { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ nick: null, avatar: null, banner: null, bio: null }),
  }).then((response) => response.ok).catch(() => false);

  return databaseReset && discordReset;
}
