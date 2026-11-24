import { getEnv } from './env';
import { setBotNameStyle, setBotGuildProfile, getGuildLookOverrides } from './discord';
import { cached, invalidatePrefix } from './sharedCache';

export type PremiumStatus = 'free' | 'pending' | 'active' | 'past_due' | 'canceled' | 'expired';

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
  const url = getEnv(astro, 'PETTO_BOT_API_URL');
  const key = getEnv(astro, 'PETTO_BOT_API_SECRET');
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

export async function read<T>(astro: any, table: string, query: string): Promise<T[]> {
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

function isActiveEntitlement(entitlement: PremiumEntitlement): boolean {
  if (entitlement.status !== 'active') return false;
  if (!entitlement.current_period_end) return true;
  const periodEnd = new Date(entitlement.current_period_end).getTime();
  return Number.isFinite(periodEnd) && periodEnd > Date.now();
}

/** Reads the account's Premium state from Discloud through the private bot API. */
// A page and its layout both need the snapshot in the same GET request, so the second call reuses the first one's result, and
// pages that follow within a minute reuse it too (kept in this process). Writes (POST) always read fresh data, and every change
// to Premium made here or by Polar's webhook forgets the kept copies (forgetPremiumSnapshots).
const PREMIUM_TTL_MS = 60_000;
const requestSnapshots = new WeakMap<object, Map<string, Promise<PremiumSnapshot>>>();

export function forgetPremiumSnapshots(userId?: string): void {
  invalidatePrefix(userId ? `premium:${userId}` : 'premium:');
  // Whether each server has Premium (guildPremium.ts) is not kept per visitor.
  if (userId) invalidatePrefix('premium:guild:');
}

export function getPremiumSnapshot(astro: any, userId: string): Promise<PremiumSnapshot> {
  const request = astro?.request as Request | undefined;
  const method = String(request?.method ?? 'GET').toUpperCase();
  const key = `premium:${userId}`;
  const keepIt = () => cached(key, () => loadPremiumSnapshot(astro, userId), { freshMs: PREMIUM_TTL_MS });
  if (!request || (method !== 'GET' && method !== 'HEAD')) {
    forgetPremiumSnapshots(userId);
    return keepIt();
  }
  let byUser = requestSnapshots.get(request);
  if (!byUser) requestSnapshots.set(request, (byUser = new Map()));
  let pending = byUser.get(userId);
  if (!pending) {
    pending = keepIt();
    byUser.set(userId, pending);
    pending.catch(() => byUser?.delete(userId));
  }
  return pending;
}

async function loadPremiumSnapshot(astro: any, userId: string): Promise<PremiumSnapshot> {
  const encodedUser = encodeURIComponent(userId);
  const [entitlements, assignments, requests] = await Promise.all([
    read<PremiumEntitlement>(astro, 'premium_entitlements', `user_id=eq.${encodedUser}&status=in.(active,pending,past_due,canceled,expired)&select=id,user_id,provider,plan_key,status,slot_limit,current_period_end,created_at,updated_at,metadata&order=created_at.desc&limit=25`),
    read<PremiumAssignment>(astro, 'premium_slot_assignments', `user_id=eq.${encodedUser}&select=id,entitlement_id,user_id,guild_id,status,assigned_at,released_at&order=assigned_at.desc`),
    read<PremiumRequest>(astro, 'premium_slot_requests', `user_id=eq.${encodedUser}&status=eq.pending&select=id,user_id,guild_id,status&order=created_at.desc`),
  ]);

  const activeEntitlements = entitlements.filter(isActiveEntitlement);
  const activeEntitlementIds = new Set(activeEntitlements.map((candidate) => candidate.id));
  const latest = entitlements[0] ?? null;
  const entitlement = activeEntitlements.find((candidate) => assignments.some((assignment) => assignment.status === 'active' && assignment.entitlement_id === candidate.id))
    ?? activeEntitlements[0]
    ?? null;
  const activeAssignments = assignments.filter((assignment) => assignment.status === 'active' && activeEntitlementIds.has(assignment.entitlement_id));
  const status: PremiumStatus = entitlement
    ? 'active'
    : latest?.status === 'active' && latest.current_period_end && !isActiveEntitlement(latest)
      ? 'expired'
      : latest?.status ?? 'free';
  const slotsTotal = activeEntitlements.reduce((total, candidate) => total + Math.max(0, candidate.slot_limit), 0);

  const staleEntitlements = entitlements.filter((candidate) => candidate.status === 'active' && !activeEntitlementIds.has(candidate.id));
  await Promise.all(staleEntitlements.map((candidate) => releaseExpiredEntitlement(
    astro,
    candidate.id,
    assignments.filter((assignment) => assignment.status === 'active' && assignment.entitlement_id === candidate.id),
  )));

  return {
    status,
    entitlement,
    assignments: activeAssignments,
    requests,
    slotsUsed: activeAssignments.length,
    slotsTotal,
    history: entitlements,
  };
}

/**
 * The servers (out of `guildIds`) that have Premium, whoever gave it. Premium belongs to the server: an admin who did not buy the
 * plan sees the server as Premium too. A server counts when it has an active slot on an entitlement that is still valid.
 */
export function getPremiumGuildIds(astro: any, userId: string, guildIds: string[]): Promise<Set<string>> {
  const ids = [...new Set(guildIds.filter((id) => /^\d{15,25}$/.test(id)))].sort();
  if (!ids.length) return Promise.resolve(new Set());
  const key = `premium:${userId}:guilds:${ids.join(',')}`.slice(0, 480);
  // A page read takes the answer up to an hour old while a new one is read, so the first page of a visit does not wait for it (a change
  // made on the Premium page or by Polar's webhook forgets it at once); a write always reads one at most 30 seconds old.
  const method = String(astro?.request?.method ?? 'GET').toUpperCase();
  return cached(key, () => loadPremiumGuildIds(astro, ids), { freshMs: 30_000, staleMs: 3600_000, allowStale: method === 'GET' || method === 'HEAD', keep: () => true });
}

async function loadPremiumGuildIds(astro: any, ids: string[]): Promise<Set<string>> {
  const found = new Set<string>();
  const slots = await read<{ guild_id: string; entitlement_id: number }>(astro, 'premium_slot_assignments', `guild_id=in.(${ids.join(',')})&status=eq.active&select=guild_id,entitlement_id`);
  if (!slots.length) return found;
  const entitlementIds = [...new Set(slots.map((slot) => slot.entitlement_id))];
  const entitlements = await read<PremiumEntitlement>(astro, 'premium_entitlements', `id=in.(${entitlementIds.join(',')})&select=id,user_id,provider,plan_key,status,slot_limit,current_period_end`);
  const valid = new Set(entitlements.filter(isActiveEntitlement).map((entitlement) => entitlement.id));
  for (const slot of slots) if (valid.has(slot.entitlement_id)) found.add(slot.guild_id);
  return found;
}

/** Returns whether this server has Premium, no matter which of its admins gave it. */
export async function hasPremiumForGuild(astro: any, userId: string, guildId: string): Promise<boolean> {
  return (await getPremiumGuildIds(astro, userId, [guildId])).has(guildId);
}

/** Creates a short-lived Polar checkout tied to this Discord user. */
export async function createPremiumCheckout(astro: any, userId: string, plan: string, termsAcceptedAt?: string): Promise<string | null> {
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
        metadata: { plan_key: `premium-${slots}`, slot_limit: Number(slots), discord_user_id: userId, ...(termsAcceptedAt ? { terms_accepted_at: termsAcceptedAt } : {}) },
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

/** The Polar product of a plan of a person (Bronze, Silver or Gold): `POLAR_PRODUCT_PLAN_BRONZE`, `..._SILVER` and `..._GOLD`. */
export function planProductId(astro: any, plan: string): string | null {
  if (!['bronze', 'silver', 'gold'].includes(plan)) return null;
  return getEnv(astro, `POLAR_PRODUCT_PLAN_${plan.toUpperCase()}`) || null;
}

/** Which plans of a person can be bought now: the access token of Polar is set and the product of the plan is too. */
export function planCheckoutReady(astro: any): Record<'bronze' | 'silver' | 'gold', boolean> {
  const token = Boolean(getEnv(astro, 'POLAR_ACCESS_TOKEN'));
  return { bronze: token && Boolean(planProductId(astro, 'bronze')), silver: token && Boolean(planProductId(astro, 'silver')), gold: token && Boolean(planProductId(astro, 'gold')) };
}

/** Creates a short-lived Polar checkout of a plan of a person (Bronze, Silver or Gold), tied to this Discord user. */
export async function createPlanCheckout(astro: any, userId: string, plan: string, termsAcceptedAt?: string): Promise<string | null> {
  const token = getEnv(astro, 'POLAR_ACCESS_TOKEN');
  const productId = planProductId(astro, plan);
  if (!token || !productId || !/^\d{15,22}$/.test(userId)) return null;
  const origin = astro.url?.origin || getEnv(astro, 'PUBLIC_SITE_URL') || 'https://petto.sbs';
  try {
    const response = await fetch(`${polarApiBase(astro)}/v1/checkouts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: [productId],
        external_customer_id: userId,
        metadata: { kind: 'user_plan', plan, discord_user_id: userId, ...(termsAcceptedAt ? { terms_accepted_at: termsAcceptedAt } : {}) },
        success_url: `${origin}/dash/plan?checkout_id={CHECKOUT_ID}`,
        return_url: `${origin}/dash/plans`,
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.url === 'string' ? data.url : null;
  } catch {
    return null;
  }
}

/** Creates a short-lived hosted Polar Customer Portal session for this Discord user. */
export async function createPremiumCustomerPortalSession(astro: any, userId: string): Promise<string | null> {
  const token = getEnv(astro, 'POLAR_ACCESS_TOKEN');
  if (!token || !/^\d{15,22}$/.test(userId)) return null;

  const origin = astro.url?.origin || getEnv(astro, 'PUBLIC_SITE_URL') || 'https://petto.sbs';
  try {
    const customerResponse = await fetch(`${polarApiBase(astro)}/v1/customers/external/${encodeURIComponent(userId)}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!customerResponse.ok) return null;
    const customer = await customerResponse.json();
    if (typeof customer?.id !== 'string') return null;

    const response = await fetch(`${polarApiBase(astro)}/v1/customer-sessions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: customer.id, return_url: `${origin}/dash/premium` }),
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

/**
 * Lets a logged-in user save a server preference before billing is connected.
 * It intentionally creates a pending request, never an active Premium grant.
 */
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

    // An active entitlement is authoritative for both paid and manual grants.
    // Selecting a server after activation should take effect immediately; only
    // selections made before billing is confirmed remain pending.
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

      // Move an old assignment from a previous entitlement onto the current
      // one instead of leaving the server attached to stale billing data.
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

    // Paid accounts may have selected servers before Polar confirms the
    // subscription. Explicitly target the unique key so a canceled request is
    // reopened instead of failing with a duplicate-key error.
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
    if (!response.ok) return false;
    // Removing a slot is also an explicit return to Free for that server.
    await resetGuildPremiumCustomization(astro, guildId);
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes only the Premium server profile. Nicknames are a free identity aid,
 * so they remain in the shared config and in Discord when Premium ends.
 */
// A server found without Premium customization is not checked again for a while (the Customize page used to read it twice, one read after
// the other, before every visit). Polar's webhook resets it right away on a cancellation; this is only the fallback for a missed one.
const CLEAN_CHECK_MS = 10 * 60_000;
const checkedClean = new Map<string, number>();

/** resetGuildPremiumCustomization, at most once every ten minutes per server while it stays clean. */
export async function resetGuildPremiumCustomizationIfStale(astro: any, guildId: string): Promise<void> {
  const until = checkedClean.get(guildId);
  if (until && until > Date.now()) return;
  const settings = config(astro);
  const guildResponse = settings ? await fetch(`${settings.url}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(guildId)}&select=bot_avatar_url,bot_banner_url,bot_description,bot_name_style`, { headers: headers(settings.key) }).catch(() => null) : null;
  const rows = guildResponse?.ok ? ((await guildResponse.json().catch(() => null)) as any[] | null) : null;
  const row = Array.isArray(rows) ? (rows[0] ?? {}) : null;
  if (row && !row.bot_avatar_url && !row.bot_banner_url && !row.bot_description && !row.bot_name_style) {
    // Nothing is saved here, but a picture that was uploaded (not linked) is saved nowhere: only Discord knows it is still on.
    const botToken = getEnv(astro, 'DISCORD_TOKEN');
    const overrides = botToken ? await getGuildLookOverrides(guildId, botToken) : null;
    if (!overrides?.avatar && !overrides?.banner) {
      if (checkedClean.size > 5000) checkedClean.clear();
      checkedClean.set(guildId, Date.now() + CLEAN_CHECK_MS);
      return;
    }
  }
  await resetGuildPremiumCustomization(astro, guildId);
}

export async function resetGuildPremiumCustomization(astro: any, guildId: string): Promise<boolean> {
  const settings = config(astro);
  if (!settings || !/^\d{15,22}$/.test(String(guildId))) return false;
  const botToken = getEnv(astro, 'DISCORD_TOKEN');

  // The database and Discord are asked together: the saved link of the picture (none when it was uploaded) and the pictures Discord has on.
  const [guildResponse, overrides] = await Promise.all([
    fetch(`${settings.url}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(guildId)}&select=bot_nickname,bot_avatar_url,bot_banner_url,bot_description`, {
      headers: headers(settings.key),
    }).catch(() => null),
    botToken ? getGuildLookOverrides(guildId, botToken) : Promise.resolve(null),
  ]);
  if (!guildResponse?.ok) return false;
  const guildRows = await guildResponse.json() as Array<Record<string, string | null>>;
  const hasPremiumCustomization = Boolean(guildRows[0]?.bot_avatar_url || guildRows[0]?.bot_banner_url || guildRows[0]?.bot_description);
  // An uploaded avatar or banner leaves no link in the database, so what Discord says counts as much as what was saved.
  const discordHasLook = Boolean(overrides?.avatar || overrides?.banner);

  const databaseReset = !hasPremiumCustomization || await fetch(`${settings.url}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(guildId)}`, {
    method: 'PATCH',
    headers: headers(settings.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
    body: JSON.stringify({ bot_avatar_url: null, bot_banner_url: null, bot_description: null, updated_at: new Date().toISOString() }),
  }).then((response) => response.ok).catch(() => false);

  await resetNameStyle(settings, botToken, guildId);
  if (!botToken) return databaseReset;

  if (!hasPremiumCustomization && !discordHasLook) return databaseReset;

  // Through setBotGuildProfile, so that the copies of the bot's look kept by the dashboard are forgotten and the page shows the real one.
  const discordReset = await setBotGuildProfile(guildId, botToken, { avatarDataUri: null, bannerDataUri: null, bio: null });
  return databaseReset && discordReset;
}

/**
 * Clears the Premium name style of a server in the database and in Discord. Read apart from the rest of the profile and
 * never fatal: a database without the `bot_name_style` column just has nothing to clear.
 */
async function resetNameStyle(settings: { url: string; key: string }, botToken: string | undefined, guildId: string): Promise<void> {
  try {
    const response = await fetch(`${settings.url}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(guildId)}&select=bot_name_style`, { headers: headers(settings.key) });
    if (!response.ok) return;
    const rows = await response.json() as Array<{ bot_name_style: unknown }>;
    if (!rows[0]?.bot_name_style) return;
    await fetch(`${settings.url}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(guildId)}`, {
      method: 'PATCH',
      headers: headers(settings.key, { 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify({ bot_name_style: null, updated_at: new Date().toISOString() }),
    });
    if (botToken) await setBotNameStyle(guildId, botToken, null);
  } catch { /* A name style that cannot be cleared now is cleared the next time the page opens. */ }
}

/** The id of the Polar product of a pack of ceramos (`POLAR_PRODUCT_COINS_PILE`, `..._SMALL_BAG`, `..._BIG_BAG`, `..._CHEST`), or null. */
export function coinPackProductId(astro: any, packId: string): string | null {
  if (!/^[a-z0-9][a-z0-9-]{2,30}$/.test(packId)) return null;
  return getEnv(astro, `POLAR_PRODUCT_COINS_${packId.toUpperCase().replace(/-/g, '_')}`) || null;
}

/** Which packs of ceramos can be bought now: the access token of Polar is set and the product of the pack is too. */
export function coinCheckoutReady(astro: any, packIds: string[]): Record<string, boolean> {
  const token = Boolean(getEnv(astro, 'POLAR_ACCESS_TOKEN'));
  return Object.fromEntries(packIds.map((id) => [id, token && Boolean(coinPackProductId(astro, id))]));
}

/** Creates a short-lived Polar checkout of a pack of ceramos, tied to this Discord user (the ceramos arrive when the webhook says the order is paid). */
export async function createCoinCheckout(astro: any, userId: string, packId: string, termsAcceptedAt?: string): Promise<string | null> {
  const token = getEnv(astro, 'POLAR_ACCESS_TOKEN');
  const productId = coinPackProductId(astro, packId);
  if (!token || !productId || !/^\d{15,22}$/.test(userId)) return null;
  const origin = astro.url?.origin || getEnv(astro, 'PUBLIC_SITE_URL') || 'https://petto.sbs';
  try {
    const response = await fetch(`${polarApiBase(astro)}/v1/checkouts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: [productId],
        external_customer_id: userId,
        metadata: { kind: 'ceramos_pack', pack: packId, discord_user_id: userId, ...(termsAcceptedAt ? { terms_accepted_at: termsAcceptedAt } : {}) },
        success_url: `${origin}/dash/buy-ceramos?paid=1`,
        return_url: `${origin}/dash/buy-ceramos`,
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.url === 'string' ? data.url : null;
  } catch {
    return null;
  }
}
