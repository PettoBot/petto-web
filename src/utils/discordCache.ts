// Every guild dashboard page needs the user's full Discord guild list at least once (to verify
// they can actually manage this server), and the sidebar's server-switcher needs the exact same
// list again on the exact same page load. Without this, that's two identical Discord API calls
// per request. A short in-memory TTL cache
// collapses that back down to one real fetch, and also covers rapid dashboard nagivation.
import { edgeDelete, edgeGet, edgePut } from './edgeCache';
import { memoPerRequest } from './requestMemo';
import { forgetGuildSnapshots, iconUrl, readBotGuildSnapshots } from './guildSnapshots';

const TTL_MS = 20_000;
const EDGE_TTL_S = 45;
const cache = new Map<string, { data: any[]; expiresAt: number }>();

// Only finished results are cached. A Worker cannot wait on a fetch that another request started
// (it can hang forever), so every request that finds no fresh copy makes its own call.
// `request` is the page's request: the page and its layout then share one read instead of two.
export function getCachedUserGuilds(accessToken: string, request?: Request): Promise<any[]> {
  const hit = cache.get(accessToken);
  if (hit && hit.expiresAt > Date.now()) return Promise.resolve(hit.data);
  return memoPerRequest(request, 'user-guilds', async () => {
    const shared = await edgeGet<any[]>('user-guilds', accessToken);
    if (shared) {
      cache.set(accessToken, { data: shared, expiresAt: Date.now() + TTL_MS });
      return shared;
    }
    return fetchUserGuilds(accessToken);
  });
}

async function fetchUserGuilds(accessToken: string): Promise<any[]> {
  const hit = cache.get(accessToken);

  try {
    const res = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Discord guild list failed with ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Discord guild list was not an array');
    cache.set(accessToken, { data, expiresAt: Date.now() + TTL_MS });
    void edgePut('user-guilds', accessToken, data, EDGE_TTL_S);
    return data;
  } catch (error) {
    // A transient Discord/API failure must never look like a real empty server list.
    // Keep a recently successful response useful during a short outage, otherwise let
    // the caller render a retryable error instead of sending the user to a wrong page.
    if (hit?.data && Date.now() - (hit.expiresAt - TTL_MS) < 60_000) return hit.data;
    throw error;
  }
}

// Which guilds the bot is *currently* in. The `guilds` API table is not a substitute for this:
// it's a config-row cache created the first time a guild is touched and never cleaned up on
// guildDelete, so it still lists servers a bot was removed from. The bot's `discord_guild_snapshots`
// table is: the bot removes a server from it when it leaves. When that table is empty or
// unreadable (a bot that does not save it yet), Discord is asked, as before.
const botGuildsCache = new Map<string, { ids: Set<string>; expiresAt: number }>();

export function getCachedBotGuildIds(botToken: string, request?: Request): Promise<Set<string>> {
  const hit = botGuildsCache.get(botToken);
  if (hit && hit.expiresAt > Date.now()) return Promise.resolve(hit.ids);
  return memoPerRequest(request, 'bot-guild-ids', async () => {
    // The bot's own saved list of its servers (cleaned when it leaves one) answers before Discord is asked.
    const saved = await readBotGuildSnapshots();
    if (saved) {
      const ids = new Set<string>(saved.map((guild) => guild.id));
      botGuildsCache.set(botToken, { ids, expiresAt: Date.now() + TTL_MS });
      return ids;
    }
    const shared = await edgeGet<string[]>('bot-guild-ids', botToken);
    if (shared) {
      const ids = new Set<string>(shared);
      botGuildsCache.set(botToken, { ids, expiresAt: Date.now() + TTL_MS });
      return ids;
    }
    return fetchBotGuildIds(botToken);
  });
}

/** Discord's answer names the cause (401 = wrong or missing DISCORD_TOKEN, 429 or an HTML page = the host IP is rate limited). It never contains the token. */
async function logDiscordFailure(what: string, res: Response): Promise<void> {
  const detail = (await res.clone().text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
  console.error(`[discord] ${what} failed: ${res.status} ${detail}`);
}

async function fetchBotGuildIds(botToken: string): Promise<Set<string>> {
  const res = await fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: { Authorization: `Bot ${botToken}` },
  });
  if (!res.ok) await logDiscordFailure('bot guild ids', res);
  const data = res.ok ? await res.json() : [];
  const ids = new Set<string>(Array.isArray(data) ? data.map((g: any) => g.id) : []);
  botGuildsCache.set(botToken, { ids, expiresAt: Date.now() + TTL_MS });
  if (res.ok) void edgePut('bot-guild-ids', botToken, [...ids], EDGE_TTL_S);
  return ids;
}

export interface BotGuild { id: string; name: string; icon: string | null; memberCount: number | null }

const botGuildListCache = new Map<string, { guilds: BotGuild[]; expiresAt: number }>();

/** Every server the bot is in, with name, icon and approximate member count, straight from Discord (paginated, 200 per page). */
export async function getBotGuildList(botToken: string): Promise<BotGuild[]> {
  const hit = botGuildListCache.get(botToken);
  if (hit && hit.expiresAt > Date.now()) return hit.guilds;

  const saved = await readBotGuildSnapshots();
  if (saved) {
    const fromTable = saved.map((guild) => ({ id: guild.id, name: guild.name, icon: iconUrl(guild.id, guild.icon), memberCount: guild.memberCount }));
    botGuildListCache.set(botToken, { guilds: fromTable, expiresAt: Date.now() + TTL_MS });
    return fromTable;
  }

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
  botGuildListCache.set(botToken, { guilds, expiresAt: Date.now() + TTL_MS });
  return guilds;
}

/** Forget cached bot guild lists, used right after the bot joins or leaves a server. */
export function invalidateBotGuildCaches(botToken: string): void {
  botGuildListCache.delete(botToken);
  botGuildsCache.delete(botToken);
  forgetGuildSnapshots();
  void edgeDelete('bot-guild-ids', botToken);
}
