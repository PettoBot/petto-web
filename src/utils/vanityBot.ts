import { getEnv } from './env';

// Vanity and Server Tag roles are part of Petto. The dashboard reads and writes them through the Petto bot's own API
// (`/api/dashboard/guild/:id/identity`), with the same key as the other pages.

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
  logs: { channel_id: string; events: string[]; embeds: Record<string, string> };
  embeds: string[];
  variables?: { label: string; vars: { tok: string; desc: string }[] }[];
  roles: VanityRole[];
  channels: VanityChannel[];
  options: { vanity_sources: string[]; comparisons: string[]; conditions: string[]; actions: string[]; log_events: string[]; ping_modes: string[] };
}

export type VanityResult<T> = { ok: true; data: T } | { ok: false; status: number; code: string; message: string };

const CALL_TIMEOUT_MS = 8000;

export function vanityConfig(astro: { locals?: any }): { url: string; secret: string } | null {
  const url = getEnv(astro, 'PETTO_BOT_API_URL')?.replace(/\/+$/, '');
  const secret = getEnv(astro, 'PETTO_BOT_API_SECRET');
  return url && secret ? { url, secret } : null;
}

async function call<T>(astro: { locals?: any }, guildId: string, init: { method?: string; body?: unknown; userId: string }): Promise<VanityResult<T>> {
  const config = vanityConfig(astro);
  if (!config) return { ok: false, status: 503, code: 'not_configured', message: 'The dashboard is not connected to the bot.' };
  const query = init.method === 'POST' ? '' : `?user_id=${encodeURIComponent(init.userId)}`;
  try {
    const res = await fetch(`${config.url}/api/dashboard/guild/${encodeURIComponent(guildId)}/identity${query}`, {
      method: init.method ?? 'GET',
      headers: { 'x-petto-dashboard-key': config.secret, Accept: 'application/json', ...(init.body ? { 'Content-Type': 'application/json' } : {}) },
      body: init.body ? JSON.stringify(init.body) : undefined,
      signal: AbortSignal.timeout(CALL_TIMEOUT_MS),
    });
    const payload: any = await res.json().catch(() => null);
    if (res.ok && payload?.ok !== false) return { ok: true, data: payload as T };
    // The bot answers guild_unavailable for a server it is not in.
    const code = payload?.error === 'guild_unavailable' ? 'not_installed' : String(payload?.error ?? 'unavailable');
    return { ok: false, status: res.status, code, message: String(payload?.message ?? 'The bot did not answer.') };
  } catch {
    return { ok: false, status: 503, code: 'unavailable', message: 'The bot did not answer in time.' };
  }
}

export function getVanityOverview(astro: { locals?: any }, guildId: string, userId: string) {
  return call<VanityOverview & { ok: true }>(astro, guildId, { userId });
}

export function vanityAction(astro: { locals?: any }, guildId: string, userId: string, body: Record<string, unknown>) {
  return call<{ note?: string }>(astro, guildId, { method: 'POST', body: { ...body, user_id: userId }, userId });
}
