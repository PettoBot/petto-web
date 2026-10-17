// Every guild dashboard page needs the user's full Discord guild list at least once (to verify
// they can actually manage this server), and the sidebar's server-switcher needs the exact same
// list again on the exact same page load. These answers are kept in the shared cache (this
// process, then Redis on Node or the data center cache on Cloudflare), and a page and its layout
// share one read per request.
import { memoPerRequest } from './requestMemo';
import { forgetGuildSnapshots, iconUrl, readBotGuildSnapshots } from './guildSnapshots';
import { cached, digestKey, invalidate, onSharedMessage, sharedMessagesLive } from './sharedCache';

// The servers of a visitor: fresh for a minute. A page (a read) may show a list up to an hour old (so someone who lost access can still read a page for that hour at most, never save) while a new one is
// fetched in the background; a save (a write, which also checks access) always uses one at most a minute old. The list is kept in
// Redis too, so it survives a restart: someone who comes back after a while, or right after a deploy, does not wait for Discord.
const USER_GUILDS_FRESH_MS = 60_000;
const USER_GUILDS_STALE_MS = 3600_000;
// Discord sometimes takes seconds (or holds a rate-limited call): a page never waits longer than this for the list.
const USER_GUILDS_TIMEOUT_MS = 6_000;
// The servers of the bot: while the bot's messages arrive (`petto:guilds` on join or leave) the list is kept longer.
const BOT_GUILDS_FRESH_MS = 20_000;
const BOT_GUILDS_FRESH_LIVE_MS = 5 * 60_000;
// A page read shows the switcher from a list up to this old while a new one is read (joins and leaves drop it at once, `petto:guilds`).
const BOT_GUILDS_STALE_MS = 10 * 60_000;

const isRead = (request?: Request) => ['GET', 'HEAD'].includes(String(request?.method ?? 'GET').toUpperCase());

/**
 * The servers of a visitor. A write (`forAccess` on a POST) always uses a list at most a minute old. A page read takes a list up to six
 * hours old at once while a new one is fetched in the background, so the read after it already uses the new list: waiting for Discord
 * (often 150-400 ms, sometimes seconds, and rate limited) on the first page of a visit was the slowest part of opening the dashboard. A
 * visitor who lost Manage Server can at most look at (never change) a server for that one more page.
 */
export function getCachedUserGuilds(accessToken: string, request?: Request, options: { forAccess?: boolean } = {}): Promise<any[]> {
  return memoPerRequest(request, options.forAccess ? 'user-guilds:access' : 'user-guilds', async () => {
    const key = `user-guilds:${await digestKey(accessToken)}`;
    return cached(key, () => fetchUserGuilds(accessToken), { freshMs: USER_GUILDS_FRESH_MS, staleMs: USER_GUILDS_STALE_MS, allowStale: isRead(request), shared: true });
  });
}

async function fetchUserGuilds(accessToken: string): Promise<any[]> {
  const res = await fetch('https://discord.com/api/users/@me/guilds', {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(USER_GUILDS_TIMEOUT_MS),
  });
  // A transient Discord/API failure must never look like a real empty server list. A recent list answers it when there is
  // one (see the shared cache); otherwise the caller renders a retryable error instead of sending the user to a wrong page.
  if (!res.ok) throw new Error(`Discord guild list failed with ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Discord guild list was not an array');
  return data;
}

// Which guilds the bot is *currently* in. The `guilds` API table is not a substitute for this:
// it's a config-row cache created the first time a guild is touched and never cleaned up on
// guildDelete, so it still lists servers a bot was removed from. The bot's `discord_guild_snapshots`
// table is: the bot removes a server from it when it leaves. When that table is empty or
// unreadable (a bot that does not save it yet), Discord is asked, as before.
const botKeys = new Set<string>();
const botGuildsKey = (botToken: string) => `bot-guild-ids:${botToken.split('.')[0]}`;

export function getCachedBotGuildIds(botToken: string, request?: Request): Promise<Set<string>> {
  return memoPerRequest(request, 'bot-guild-ids', async () => {
    const key = botGuildsKey(botToken);
    botKeys.add(key);
    const live = await sharedMessagesLive().catch(() => false);
    const ids = await cached(key, () => loadBotGuildIds(botToken), { freshMs: live ? BOT_GUILDS_FRESH_LIVE_MS : BOT_GUILDS_FRESH_MS, staleMs: BOT_GUILDS_STALE_MS, allowStale: isRead(request), shared: true, keep: (list) => list !== null })
      .catch(() => null);
    return new Set<string>(ids ?? []);
  });
}

async function loadBotGuildIds(botToken: string): Promise<string[] | null> {
  // The bot's own saved list of its servers (cleaned when it leaves one) answers before Discord is asked.
  const saved = await readBotGuildSnapshots();
  if (saved) return saved.map((guild) => guild.id);
  const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: { Authorization: `Bot ${botToken}` },
  });
  if (!res.ok) {
    await logDiscordFailure('bot guild ids', res);
    return null;
  }
  const data = await res.json();
  return Array.isArray(data) ? data.map((g: any) => String(g.id)) : [];
}

/** Discord's answer names the cause (401 = wrong or missing DISCORD_TOKEN, 429 or an HTML page = the host IP is rate limited). It never contains the token. */
async function logDiscordFailure(what: string, res: Response): Promise<void> {
  const detail = (await res.clone().text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
  console.error(`[discord] ${what} failed: ${res.status} ${detail}`);
}

export interface BotGuild { id: string; name: string; icon: string | null; memberCount: number | null }

const botGuildListKey = (botToken: string) => `bot-guild-list:${botToken.split('.')[0]}`;
// The servers of the bot with their member counts (the order of the server list): fresh for a minute, shown up to ten minutes old while a
// new copy is read, and kept in Redis so a restart does not make the first visitor wait for it. Joins and leaves drop it at once.
const BOT_GUILD_LIST_FRESH_MS = 60_000;
const BOT_GUILD_LIST_STALE_MS = 10 * 60_000;

/** Every server the bot is in, with name, icon and approximate member count: the bot's saved copies, or Discord (200 per page) without them. */
export async function getBotGuildList(botToken: string): Promise<BotGuild[]> {
  const key = botGuildListKey(botToken);
  botKeys.add(key);
  return cached(key, () => loadBotGuildList(botToken), { freshMs: BOT_GUILD_LIST_FRESH_MS, staleMs: BOT_GUILD_LIST_STALE_MS, allowStale: true, shared: true });
}

async function loadBotGuildList(botToken: string): Promise<BotGuild[]> {
  const saved = await readBotGuildSnapshots();
  if (saved) return saved.map((guild) => ({ id: guild.id, name: guild.name, icon: iconUrl(guild.id, guild.icon), memberCount: guild.memberCount }));

  const guilds: BotGuild[] = [];
  let after = '';
  for (let page = 0; page < 50; page += 1) {
    const res = await fetch(`https://discord.com/api/v10/users/@me/guilds?limit=200&with_counts=true${after ? `&after=${after}` : ''}`, {
      headers: { Authorization: `Bot ${botToken}` },
    });
    if (!res.ok) {
      await logDiscordFailure('bot guild list', res);
      throw new Error(`Discord bot guild list failed with ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) break;
    for (const g of data) {
      guilds.push({
        id: String(g.id),
        name: String(g.name ?? g.id),
        icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64` : null,
        memberCount: Number.isFinite(Number(g.approximate_member_count)) ? Number(g.approximate_member_count) : null,
      });
    }
    if (data.length < 200) break;
    after = String(data[data.length - 1].id);
  }
  return guilds;
}

function forgetBotGuilds(): void {
  forgetGuildSnapshots();
  for (const key of botKeys) void invalidate(key).catch(() => {});
}

// The bot publishes on `petto:guilds` when it joins or leaves a server.
onSharedMessage('petto:guilds', () => forgetBotGuilds());

/** Forget cached bot guild lists, used right after the bot joins or leaves a server. */
export function invalidateBotGuildCaches(botToken: string): void {
  botKeys.add(botGuildsKey(botToken));
  botKeys.add(botGuildListKey(botToken));
  forgetBotGuilds();
}
