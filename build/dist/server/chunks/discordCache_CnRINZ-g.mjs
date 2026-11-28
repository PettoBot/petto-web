import { f as forgetGuildSnapshots, m as memoPerRequest, r as readBotGuildSnapshots, i as iconUrl } from './discord_CxeBz2tv.mjs';
import { onSharedMessage, invalidate, digestKey, cached, sharedMessagesLive } from './sharedCache_DFk4ml3Q.mjs';

const USER_GUILDS_FRESH_MS = 6e4;
const USER_GUILDS_STALE_MS = 36e5;
const USER_GUILDS_TIMEOUT_MS = 6e3;
const BOT_GUILDS_FRESH_MS = 2e4;
const BOT_GUILDS_FRESH_LIVE_MS = 5 * 6e4;
const BOT_GUILDS_STALE_MS = 10 * 6e4;
const isRead = (request) => ["GET", "HEAD"].includes(String(request?.method ?? "GET").toUpperCase());
function getCachedUserGuilds(accessToken, request, options = {}) {
  return memoPerRequest(request, options.forAccess ? "user-guilds:access" : "user-guilds", async () => {
    const key = `user-guilds:${await digestKey(accessToken)}`;
    return cached(key, () => fetchUserGuilds(accessToken), { freshMs: USER_GUILDS_FRESH_MS, staleMs: USER_GUILDS_STALE_MS, allowStale: isRead(request), shared: true });
  });
}
async function fetchUserGuilds(accessToken) {
  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(USER_GUILDS_TIMEOUT_MS)
  });
  if (!res.ok) throw new Error(`Discord guild list failed with ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Discord guild list was not an array");
  return data;
}
const botKeys = /* @__PURE__ */ new Set();
const botGuildsKey = (botToken) => `bot-guild-ids:${botToken.split(".")[0]}`;
function getCachedBotGuildIds(botToken, request) {
  return memoPerRequest(request, "bot-guild-ids", async () => {
    const key = botGuildsKey(botToken);
    botKeys.add(key);
    const live = await sharedMessagesLive().catch(() => false);
    const ids = await cached(key, () => loadBotGuildIds(botToken), { freshMs: live ? BOT_GUILDS_FRESH_LIVE_MS : BOT_GUILDS_FRESH_MS, staleMs: BOT_GUILDS_STALE_MS, allowStale: isRead(request), shared: true, keep: (list) => list !== null }).catch(() => null);
    return new Set(ids ?? []);
  });
}
async function loadBotGuildIds(botToken) {
  const saved = await readBotGuildSnapshots();
  if (saved) return saved.map((guild) => guild.id);
  const res = await fetch("https://discord.com/api/v10/users/@me/guilds", {
    headers: { Authorization: `Bot ${botToken}` }
  });
  if (!res.ok) {
    await logDiscordFailure("bot guild ids", res);
    return null;
  }
  const data = await res.json();
  return Array.isArray(data) ? data.map((g) => String(g.id)) : [];
}
async function logDiscordFailure(what, res) {
  const detail = (await res.clone().text().catch(() => "")).replace(/\s+/g, " ").slice(0, 200);
  console.error(`[discord] ${what} failed: ${res.status} ${detail}`);
}
const botGuildListKey = (botToken) => `bot-guild-list:${botToken.split(".")[0]}`;
const BOT_GUILD_LIST_FRESH_MS = 6e4;
const BOT_GUILD_LIST_STALE_MS = 10 * 6e4;
async function getBotGuildList(botToken) {
  const key = botGuildListKey(botToken);
  botKeys.add(key);
  return cached(key, () => loadBotGuildList(botToken), { freshMs: BOT_GUILD_LIST_FRESH_MS, staleMs: BOT_GUILD_LIST_STALE_MS, allowStale: true, shared: true });
}
async function loadBotGuildList(botToken) {
  const saved = await readBotGuildSnapshots();
  if (saved) return saved.map((guild) => ({ id: guild.id, name: guild.name, icon: iconUrl(guild.id, guild.icon), memberCount: guild.memberCount }));
  const guilds = [];
  let after = "";
  for (let page = 0; page < 50; page += 1) {
    const res = await fetch(`https://discord.com/api/v10/users/@me/guilds?limit=200&with_counts=true${after ? `&after=${after}` : ""}`, {
      headers: { Authorization: `Bot ${botToken}` }
    });
    if (!res.ok) {
      await logDiscordFailure("bot guild list", res);
      throw new Error(`Discord bot guild list failed with ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data)) break;
    for (const g of data) {
      guilds.push({
        id: String(g.id),
        name: String(g.name ?? g.id),
        icon: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64` : null,
        memberCount: Number.isFinite(Number(g.approximate_member_count)) ? Number(g.approximate_member_count) : null
      });
    }
    if (data.length < 200) break;
    after = String(data[data.length - 1].id);
  }
  return guilds;
}
function forgetBotGuilds() {
  forgetGuildSnapshots();
  for (const key of botKeys) void invalidate(key).catch(() => {
  });
}
onSharedMessage("petto:guilds", () => forgetBotGuilds());
function invalidateBotGuildCaches(botToken) {
  botKeys.add(botGuildsKey(botToken));
  botKeys.add(botGuildListKey(botToken));
  forgetBotGuilds();
}

export { getBotGuildList as a, getCachedUserGuilds as b, getCachedBotGuildIds as g, invalidateBotGuildCaches as i };
