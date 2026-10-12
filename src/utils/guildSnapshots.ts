import { getEnv } from './env';
import { invalidate, onSharedMessage, sharedGetRaw, sharedMessagesLive } from './sharedCache';

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
  banner: string | null;
  emojiCount: number;
  premiumTier: number;
  boostCount: number;
  botNick: string | null;
  botAvatar: string | null;
  channels: any[];
  roles: any[];
}

// The copy kept in this process. While the bot's messages arrive (Redis `petto:snap`), it is dropped the moment the bot saves a
// new one, so it can be kept longer; without them it is kept only a few seconds, as before.
const GUILD_TTL_MS = 5_000;
const GUILD_TTL_SUBSCRIBED_MS = 60_000;
const WRITE_WINDOW_MS = 15_000;
const LIST_TTL_MS = 20_000;
let listCache: { value: Array<{ id: string; name: string; icon: string | null; memberCount: number | null }>; expiresAt: number } | null = null;
const guildCache = new Map<string, { value: GuildSnapshot | null; expiresAt: number }>();
const writes = new Map<string, number>();
const epochs = new Map<string, number>();
let subscribedNow = false;

/** Changes every time the copy of this server is dropped, so caches built on it (name and icon) know to read it again. */
export function snapshotEpoch(guildId: string): number {
  return epochs.get(guildId) ?? 0;
}

function dropGuild(guildId: string): void {
  guildCache.delete(guildId);
  epochs.set(guildId, snapshotEpoch(guildId) + 1);
  void invalidate(`emojis:${guildId}`).catch(() => {});
}

// The bot publishes the id of a server on `petto:snap` each time it saves its copy (and keeps the row in `petto:snap:<id>`).
onSharedMessage('petto:snap', (message) => {
  const guildId = String(message).trim();
  if (/^\d{5,25}$/.test(guildId)) dropGuild(guildId);
});

/** After a change made from the dashboard the page that follows must show it, and the bot saves its copy a few seconds later, so Discord answers until then. */
export function noteGuildWrite(guildId: string): void {
  writes.set(guildId, Date.now());
  dropGuild(guildId);
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

function fromRow(row: any): GuildSnapshot | null {
  return row && Array.isArray(row.channels) && Array.isArray(row.roles)
    ? { id: String(row.guild_id), name: String(row.name), icon: row.icon ?? null, ownerId: row.owner_id ?? null, memberCount: Number.isFinite(Number(row.member_count)) ? Number(row.member_count) : null, banner: row.banner ?? null, emojiCount: Number(row.emoji_count) || 0, premiumTier: Number(row.premium_tier) || 0, boostCount: Number(row.boost_count) || 0, botNick: row.bot_nick ?? null, botAvatar: row.bot_avatar ?? null, channels: row.channels, roles: row.roles }
    : null;
}

/** The row the bot keeps in Redis (`petto:snap:<id>`, ten minutes) right after saving it: no database read at all. */
async function readFromRedis(guildId: string): Promise<{ snapshot: GuildSnapshot; emojis: unknown } | null> {
  const raw = await sharedGetRaw(`petto:snap:${guildId}`).catch(() => null);
  if (!raw) return null;
  try {
    const row = JSON.parse(raw);
    const snapshot = fromRow(row);
    return snapshot && snapshot.id === guildId ? { snapshot, emojis: row.emojis } : null;
  } catch {
    return null;
  }
}

export async function readGuildSnapshot(guildId: string): Promise<GuildSnapshot | null> {
  if (!source || !/^\d{5,25}$/.test(guildId) || recentlyWritten(guildId)) return null;
  const hit = guildCache.get(guildId);
  if (hit && hit.expiresAt > Date.now()) return hit.value;
  const epoch = snapshotEpoch(guildId);
  const keep = (value: GuildSnapshot | null) => {
    // A copy that was dropped while it was being read is not kept.
    if (snapshotEpoch(guildId) !== epoch) return;
    guildCache.set(guildId, { value, expiresAt: Date.now() + (subscribedNow ? GUILD_TTL_SUBSCRIBED_MS : GUILD_TTL_MS) });
  };
  subscribedNow = await sharedMessagesLive().catch(() => false);
  const fromRedis = await readFromRedis(guildId);
  if (fromRedis) {
    keep(fromRedis.snapshot);
    return fromRedis.snapshot;
  }
  try {
    const res = await fetch(`${source.url}/rest/v1/discord_guild_snapshots?guild_id=eq.${guildId}&select=guild_id,name,icon,owner_id,member_count,banner,emoji_count,premium_tier,boost_count,bot_nick,bot_avatar,channels,roles`, { headers: headers(source.key) });
    if (!res.ok) return null;
    const rows = await res.json();
    const value = fromRow(Array.isArray(rows) ? rows[0] : null);
    keep(value);
    return value;
  } catch {
    return null;
  }
}

// A bot that does not save the emojis yet has no `emojis` column, and asking for it is refused; it is asked again after a while.
const EMOJI_COLUMN_RETRY_MS = 10 * 60_000;
let emojiColumnMissingUntil = 0;

// An empty list cannot be told apart from a row saved before the bot kept emojis, so it counts as unknown and Discord is asked
// (that answer is kept a few minutes too).
function emojiList(raw: unknown): Array<{ id: string; name: string; animated: boolean }> | null {
  if (!Array.isArray(raw) || !raw.length) return null;
  return raw.filter((emoji: any) => emoji?.id).map((emoji: any) => ({ id: String(emoji.id), name: String(emoji.name ?? ''), animated: Boolean(emoji.animated) }));
}

/** The custom emojis in the bot's saved copy of a server, or null when the copy does not have them (Discord is asked then). */
export async function readSnapshotEmojis(guildId: string): Promise<Array<{ id: string; name: string; animated: boolean }> | null> {
  if (!source || !/^\d{5,25}$/.test(guildId)) return null;
  const fromRedis = await readFromRedis(guildId);
  const kept = fromRedis ? emojiList(fromRedis.emojis) : null;
  if (kept) return kept;
  if (Date.now() < emojiColumnMissingUntil) return null;
  try {
    const res = await fetch(`${source.url}/rest/v1/discord_guild_snapshots?guild_id=eq.${guildId}&select=emojis`, { headers: headers(source.key) });
    if (!res.ok) {
      emojiColumnMissingUntil = Date.now() + (res.status >= 500 ? 60_000 : EMOJI_COLUMN_RETRY_MS);
      return null;
    }
    const rows = await res.json();
    return emojiList(Array.isArray(rows) ? rows[0]?.emojis : null);
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
