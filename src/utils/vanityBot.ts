import { getEnv } from './env';

// Vanity Tag Bot is a separate bot with its own database. The dashboard talks to it through the API
// described in its docs/DASHBOARD.md. Nothing here runs unless VANITY_BOT_API_URL and
// VANITY_BOT_API_SECRET are set, so the dashboard looks the same without them.

export interface VanityRole { id: string; name: string; color: number; position: number; assignable: boolean; reason?: 'managed' | 'above_bot' }
export interface VanityChannel { id: string; name: string; position: number }
export interface VanityRule {
  id: string; name: string; role_id: string; action: 'add_role' | 'remove_role'; enabled: boolean;
  word?: string; source?: string; comparison?: string; normalization?: { case_fold: boolean; trim_space: boolean; collapse_space: boolean };
  condition?: string; value?: string;
}
export interface VanityNotification { channel_id: string; embed: string; ping: 'user' | 'none' }
export interface VanityOverview {
  guild: { id: string; name: string; icon: string | null };
  rules: { vanity: VanityRule[]; guildtag: VanityRule[] };
  notifications: { vanity: VanityNotification; guildtag: VanityNotification };
  logs: { channel_id: string; events: string[] };
  embeds: string[];
  variables?: { label: string; vars: { tok: string; desc: string }[] }[];
  profile: { nickname: string | null; bio: string | null; sync_status: string };
  roles: VanityRole[];
  channels: VanityChannel[];
  options: { vanity_sources: string[]; comparisons: string[]; conditions: string[]; actions: string[]; log_events: string[]; ping_modes: string[] };
}

export type VanityResult<T> = { ok: true; data: T } | { ok: false; status: number; code: string; message: string };

const CALL_TIMEOUT_MS = 5000;
const GUILDS_TTL_MS = 30_000;
let guildsCache: { ids: Set<string> | null; expiresAt: number } | null = null;

export function vanityConfig(astro: { locals?: any }): { url: string; secret: string } | null {
  const url = getEnv(astro, 'VANITY_BOT_API_URL')?.replace(/\/+$/, '');
  const secret = getEnv(astro, 'VANITY_BOT_API_SECRET');
  return url && secret ? { url, secret } : null;
}

async function call<T>(astro: { locals?: any }, path: string, init: { method?: string; body?: unknown } = {}): Promise<VanityResult<T>> {
  const config = vanityConfig(astro);
  if (!config) return { ok: false, status: 503, code: 'not_configured', message: 'The Vanity bot is not connected to the dashboard.' };
  try {
    const res = await fetch(`${config.url}${path}`, {
      method: init.method ?? 'GET',
      headers: { 'X-Petto-Dashboard-Key': config.secret, Accept: 'application/json', ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
      body: init.body ? JSON.stringify(init.body) : undefined,
      signal: AbortSignal.timeout(CALL_TIMEOUT_MS),
    });
    const payload: any = await res.json().catch(() => null);
    if (res.ok && payload?.ok !== false) return { ok: true, data: payload as T };
    return { ok: false, status: res.status, code: String(payload?.error ?? 'unavailable'), message: String(payload?.message ?? 'The Vanity bot did not answer.') };
  } catch {
    return { ok: false, status: 503, code: 'unavailable', message: 'The Vanity bot did not answer in time.' };
  }
}

/** The servers the Vanity bot is in, or null when it cannot be reached. Kept for 30 seconds as plain data. */
export async function listVanityGuildIds(astro: { locals?: any }): Promise<Set<string> | null> {
  if (!vanityConfig(astro)) return null;
  if (guildsCache && guildsCache.expiresAt > Date.now()) return guildsCache.ids;
  const result = await call<{ guild_ids: string[] }>(astro, '/api/dashboard/guilds');
  const ids = result.ok && Array.isArray(result.data.guild_ids) ? new Set(result.data.guild_ids.map(String)) : null;
  guildsCache = { ids, expiresAt: Date.now() + (ids ? GUILDS_TTL_MS : 10_000) };
  return ids;
}

export function getVanityOverview(astro: { locals?: any }, guildId: string, userId: string) {
  return call<VanityOverview & { ok: true }>(astro, `/api/dashboard/guild/${encodeURIComponent(guildId)}?user_id=${encodeURIComponent(userId)}`);
}

/** One saved message, in the shape the Vanity bot stores it. */
export function getVanityEmbed(astro: { locals?: any }, guildId: string, userId: string, name: string) {
  return call<{ name: string; template: import('./vanityEmbeds').VanityTemplate }>(astro, `/api/dashboard/guild/${encodeURIComponent(guildId)}/embed?name=${encodeURIComponent(name)}&user_id=${encodeURIComponent(userId)}`);
}

export async function vanityAction(astro: { locals?: any }, guildId: string, userId: string, body: Record<string, unknown>) {
  const result = await call<{ note?: string }>(astro, `/api/dashboard/guild/${encodeURIComponent(guildId)}`, { method: 'POST', body: { ...body, user_id: userId } });
  // A change made a moment ago must show up in the list of servers and in the next read.
  if (result.ok) guildsCache = null;
  return result;
}

// Manage Roles, Change Nickname, View Channels, Send Messages, Embed Links, Read Message History, Use External Emojis.
const INVITE_PERMISSIONS = 268435456 + 67108864 + 1024 + 2048 + 16384 + 65536 + 262144;

/** The link that adds the Vanity bot to a server, or null when the bot's application id is not set. */
export function vanityInviteUrl(astro: { locals?: any }, guildId?: string): string | null {
  const clientId = getEnv(astro, 'VANITY_BOT_CLIENT_ID');
  if (!clientId || !/^\d{15,25}$/.test(clientId)) return null;
  const params = new URLSearchParams({ client_id: clientId, scope: 'bot applications.commands', permissions: String(INVITE_PERMISSIONS) });
  if (guildId) { params.set('guild_id', guildId); params.set('disable_guild_select', 'true'); }
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}
