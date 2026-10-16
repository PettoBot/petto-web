import { getEnv } from './env';
import { getGuildInfo, getGuildList } from './discord';

// Vanity and Server Tag roles are part of Petto's own data. The dashboard reads them straight from the tables (like every other
// page) and sends changes to the bot (`/api/dashboard/guild/:id/identity`), which checks the role, the person and the pattern before saving.

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
  /** What to do with a role when its member goes offline: `remove` (the default, also without a saved choice) or `keep`. */
  settings: { offline_mode: 'keep' | 'remove' };
  logs: { channel_id: string; events: string[]; embeds: Record<string, string> };
  embeds: string[];
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

async function call<T>(astro: { locals?: any }, guildId: string, body: unknown): Promise<VanityResult<T>> {
  const config = vanityConfig(astro);
  if (!config) return { ok: false, status: 503, code: 'not_configured', message: 'The dashboard is not connected to the bot.' };
  try {
    const res = await fetch(`${config.url}/api/dashboard/guild/${encodeURIComponent(guildId)}/identity`, {
      method: 'POST',
      headers: { 'x-petto-dashboard-key': config.secret, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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

const SOURCES = ['custom_status', 'username', 'global_name', 'guild_nickname', 'display_name'];
const COMPARISONS = ['equals', 'contains', 'starts_with', 'ends_with', 'regex'];
const CONDITIONS = ['is_guild_id', 'is_not_guild_id', 'identity_enabled', 'identity_disabled', 'tag_equals', 'tag_not_equals'];
const LOG_EVENTS = ['vanity_add', 'vanity_remove', 'tag_add', 'tag_remove', 'error'];

/**
 * Everything the Vanity page shows, read from the data itself (the rules, thank-you messages, log and saved embeds are tables of
 * Petto's own database; roles and channels come from the bot's saved copy of the server), not from the bot's API. Only changes go
 * to the bot, because it checks them (the role, who may use it, the pattern) before saving.
 */
export async function getVanityOverview(astro: { locals?: any }, guildId: string, _userId: string): Promise<VanityResult<VanityOverview & { ok: true }>> {
  const config = vanityConfig(astro);
  const botToken = getEnv(astro, 'DISCORD_TOKEN');
  if (!config || !botToken) return { ok: false, status: 503, code: 'not_configured', message: 'The dashboard is not connected to the bot.' };
  const headers = { apikey: config.secret, Authorization: `Bearer ${config.secret}`, Accept: 'application/json' };
  const table = async (path: string): Promise<any[]> => {
    const res = await fetch(`${config.url}/rest/v1/${path}`, { headers, signal: AbortSignal.timeout(CALL_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`table ${res.status}`);
    const rows = await res.json();
    return Array.isArray(rows) ? rows : [];
  };
  try {
    const guild = await getGuildInfo(guildId, botToken);
    if (!guild) return { ok: false, status: 404, code: 'not_installed', message: 'Petto is not in this server.' };
    const where = `guild_id=eq.${encodeURIComponent(guildId)}`;
    const [rolesRes, channelsRes, vanity, guildtag, notifications, logs, embeds, settings] = await Promise.all([
      getGuildList(astro as any, guildId, botToken, 'roles'),
      getGuildList(astro as any, guildId, botToken, 'channels'),
      table(`vanity_rules?${where}&deleted_at=is.null&select=id,name,word,source,comparison,role_id,action,enabled,normalization&order=name.asc`),
      table(`guildtag_rules?${where}&deleted_at=is.null&select=id,name,condition,value,role_id,action,enabled&order=name.asc`),
      table(`identity_notifications?${where}&select=source_type,channel_id,embed_name,ping`),
      table(`identity_logs?${where}&select=channel_id,events,embeds`),
      table(`embed_templates?${where}&select=name&order=name.asc`),
      // A bot that has not got the table yet (its schema is applied later) just means the default (take the role away).
      table(`identity_settings?${where}&select=offline_mode`).catch(() => [] as any[]),
    ]);
    if (!rolesRes.ok || !channelsRes.ok) return { ok: false, status: 503, code: 'unavailable', message: 'Discord did not answer.' };
    const rawRoles: any[] = await rolesRes.json();
    const rawChannels: any[] = await channelsRes.json();

    // The roles the bot can hand out: not an integration's role and below the highest role the bot itself has. The bot marks the
    // roles it has (`mine`) in its saved copy of the server. Until it does, nothing is claimed about the position, because the role
    // Discord makes for a bot is often not the highest one it has, and the bot checks the role again when a rule is saved.
    const botTop = Math.max(-1, ...rawRoles.filter((role) => role.mine === true).map((role) => Number(role.position)));
    const roles: VanityRole[] = rawRoles
      .filter((role) => role.id !== guildId)
      .sort((a, b) => b.position - a.position)
      .map((role) => {
        const reason = role.managed ? 'managed' : botTop >= 0 && Number(role.position) >= botTop ? 'above_bot' : undefined;
        return { id: String(role.id), name: String(role.name), color: Number(role.color ?? 0), position: Number(role.position ?? 0), assignable: !reason, ...(reason ? { reason } : {}) } as VanityRole;
      });
    const channels: VanityChannel[] = rawChannels
      .filter((channel) => channel.type === 0 || channel.type === 5)
      .sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0))
      .map((channel) => ({ id: String(channel.id), name: String(channel.name), position: Number(channel.position ?? 0) }));

    const notification = (source: string): VanityNotification => {
      const row = notifications.find((entry) => entry.source_type === source);
      return { channel_id: row?.channel_id ?? '', embed: row?.embed_name ?? '', ping: row?.ping === 'none' ? 'none' : 'user' };
    };
    const log = logs[0];
    return {
      ok: true,
      data: {
        ok: true,
        guild: { id: guildId, name: guild.name, icon: iconHash(guild.icon) },
        rules: { vanity: vanity as VanityRule[], guildtag: guildtag as VanityRule[] },
        notifications: { vanity: notification('vanity'), guildtag: notification('guildtag') },
        settings: { offline_mode: settings[0]?.offline_mode === 'keep' ? 'keep' : 'remove' },
        logs: { channel_id: log?.channel_id ?? '', events: LOG_EVENTS.filter((event) => log?.events?.[event]), embeds: log?.embeds ?? {} },
        embeds: embeds.map((row) => String(row.name)),
        roles,
        channels,
        options: { vanity_sources: SOURCES, comparisons: COMPARISONS, conditions: CONDITIONS, actions: ['add_role', 'remove_role'], log_events: LOG_EVENTS, ping_modes: ['user', 'none'] },
      },
    };
  } catch {
    return { ok: false, status: 503, code: 'unavailable', message: 'The data did not answer in time.' };
  }
}

/** getGuildInfo gives the icon as a URL; the page builds its own from the hash. */
function iconHash(url: string | null): string | null {
  const match = url ? /\/icons\/\d+\/([^./?]+)/.exec(url) : null;
  return match ? match[1] : null;
}

export function vanityAction(astro: { locals?: any }, guildId: string, userId: string, body: Record<string, unknown>) {
  return call<{ note?: string }>(astro, guildId, { ...body, user_id: userId });
}
