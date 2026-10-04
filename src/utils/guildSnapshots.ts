import { getEnv } from './env';

/**
 * The bot saves a copy of every server it is in (name, icon, members, channels, roles) in the `discord_guild_snapshots`
 * table, shaped like Discord's own answers. Reading it is one database read instead of a call to Discord, which is what
 * makes the dashboard fast. Everything here returns null when the copy is missing or the read fails, and the caller then
 * asks Discord exactly as it did before, so this can only make pages faster, never different.
 */

type Source = { url: string; key: string };
let source: Source | null = null;

/** Called by the middleware on every request: the address and key of the bot API, wherever the host keeps them. */
export function configureSnapshots(astro: { locals?: any }): void {
  const url = getEnv(astro, 'PETTO_BOT_API_URL');
  const key = getEnv(astro, 'PETTO_BOT_API_SECRET');
  source = url && key ? { url, key } : null;
}

export interface GuildSnapshot {
  id: string;
  name: string;
  icon: string | null;
  ownerId: string | null;
  memberCount: number | null;
  channels: any[];
  roles: any[];
}

const GUILD_TTL_MS = 5_000;
const LIST_TTL_MS = 20_000;
const WRITE_WINDOW_MS = 15_000;
const guildCache = new Map<string, { value: GuildSnapshot | null; expiresAt: number }>();
let listCache: { value: Array<{ id: string; name: string; icon: string | null; memberCount: number | null }>; expiresAt: number } | null = null;
const writes = new Map<string, number>();

/** After a change made from the dashboard the page that follows must show it, and the bot saves its copy a few seconds later, so Discord answers until then. */
export function noteGuildWrite(guildId: string): void {
  writes.set(guildId, Date.now());
  guildCache.delete(guildId);
}

export function recentlyWritten(guildId: string): boolean {
  const at = writes.get(guildId);
  if (at === undefined) return false;
  if (Date.now() - at < WRITE_WINDOW_MS) return true;
  writes.delete(guildId);
  return false;
}

function headers(key: string): Record<string, string> {
  return { apikey: key, Authorization: `Bearer ${key}`, 'X-Petto-Dashboard-Key': key, Accept: 'application/json' };
}

export function iconUrl(guildId: string, hash: string | null | undefined, size = 64): string | null {
  return hash ? `https://cdn.discordapp.com/icons/${guildId}/${hash}.png?size=${size}` : null;
}

export async function readGuildSnapshot(guildId: string): Promise<GuildSnapshot | null> {
  if (!source || !/^\d{5,25}$/.test(guildId) || recentlyWritten(guildId)) return null;
  const hit = guildCache.get(guildId);
  if (hit && hit.expiresAt > Date.now()) return hit.value;
  try {
    const res = await fetch(`${source.url}/rest/v1/discord_guild_snapshots?guild_id=eq.${guildId}&select=guild_id,name,icon,owner_id,member_count,channels,roles`, { headers: headers(source.key) });
    if (!res.ok) return null;
    const rows = await res.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    const value: GuildSnapshot | null = row && Array.isArray(row.channels) && Array.isArray(row.roles)
      ? { id: String(row.guild_id), name: String(row.name), icon: row.icon ?? null, ownerId: row.owner_id ?? null, memberCount: Number.isFinite(Number(row.member_count)) ? Number(row.member_count) : null, channels: row.channels, roles: row.roles }
      : null;
    guildCache.set(guildId, { value, expiresAt: Date.now() + GUILD_TTL_MS });
    return value;
  } catch {
    return null;
  }
}

/** Every server the bot is in, or null when the table is empty or unreadable (a bot that does not save them yet). */
export async function readBotGuildSnapshots(): Promise<Array<{ id: string; name: string; icon: string | null; memberCount: number | null }> | null> {
  if (!source) return null;
  if (listCache && listCache.expiresAt > Date.now()) return listCache.value;
  try {
    const res = await fetch(`${source.url}/rest/v1/discord_guild_snapshots?select=guild_id,name,icon,member_count`, { headers: headers(source.key) });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows) || !rows.length) return null;
    const value = rows.map((row: any) => ({ id: String(row.guild_id), name: String(row.name), icon: row.icon ?? null, memberCount: Number.isFinite(Number(row.member_count)) ? Number(row.member_count) : null }));
    listCache = { value, expiresAt: Date.now() + LIST_TTL_MS };
    return value;
  } catch {
    return null;
  }
}

export function forgetGuildSnapshots(): void {
  guildCache.clear();
  listCache = null;
}
