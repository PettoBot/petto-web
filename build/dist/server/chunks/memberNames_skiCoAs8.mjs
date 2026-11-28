import { g as getEnv } from './env_WnBvzCjc.mjs';
import { peekMany, storeMany } from './sharedCache_DFk4ml3Q.mjs';

const NAME_TTL_MS = 10 * 6e4;
const ROUTE_RETRY_MS = 10 * 6e4;
const CHUNK = 100;
const FALLBACK_CONCURRENCY = 5;
const ID = /^\d{15,25}$/;
let routeMissingUntil = 0;
const key = (guildId, userId) => `member:${guildId}:${userId}`;
function memberAvatarUrl(userId, profile, size = 64) {
  const avatar = profile?.avatar ?? null;
  if (avatar && /^https?:\/\//.test(avatar)) return avatar;
  if (avatar) return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png?size=${size}`;
  return `https://cdn.discordapp.com/embed/avatars/${Number(userId || 0) % 6}.png`;
}
function fromBot(id, raw) {
  if (!raw || typeof raw !== "object") return null;
  const username = String(raw.username ?? "");
  const globalName = raw.globalName ?? raw.global_name ?? null;
  return { id, username, globalName, displayName: String(raw.displayName ?? raw.display_name ?? globalName ?? username ?? ""), avatar: raw.avatar ?? null, bot: Boolean(raw.bot) };
}
function fromDiscordMember(id, member) {
  const user = member?.user;
  if (!user) return null;
  return { id, username: String(user.username ?? ""), globalName: user.global_name ?? null, displayName: String(member.nick || user.global_name || user.username || ""), avatar: user.avatar ?? null, bot: Boolean(user.bot) };
}
function fromDiscordUser(id, user) {
  if (!user?.id) return null;
  return { id, username: String(user.username ?? ""), globalName: user.global_name ?? null, displayName: String(user.global_name || user.username || ""), avatar: user.avatar ?? null, bot: Boolean(user.bot) };
}
async function askBot(astro, guildId, ids, userId) {
  const apiUrl = getEnv(astro, "PETTO_BOT_API_URL");
  const secret = getEnv(astro, "PETTO_BOT_API_SECRET");
  if (!apiUrl || !secret || !userId || Date.now() < routeMissingUntil) return null;
  const found = /* @__PURE__ */ new Map();
  for (let start = 0; start < ids.length; start += CHUNK) {
    const chunk = ids.slice(start, start + CHUNK);
    let res;
    try {
      res = await fetch(`${apiUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/members`, {
        method: "POST",
        signal: AbortSignal.timeout(4e3),
        headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
        // The bot checks that the person looking can manage the server, like its other dashboard routes.
        body: JSON.stringify({ ids: chunk, user_id: userId })
      });
    } catch {
      return found.size ? found : null;
    }
    if (res.status === 404) {
      routeMissingUntil = Date.now() + ROUTE_RETRY_MS;
      return found.size ? found : null;
    }
    if (!res.ok) return found.size ? found : null;
    const payload = await res.json().catch(() => null);
    const members = payload?.members;
    if (payload?.ok === false || !members || typeof members !== "object") return found.size ? found : null;
    for (const id of chunk) found.set(id, fromBot(id, members[id]));
  }
  return found;
}
async function inBatches(items, size, run) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) await run(items[next++]);
  }));
}
async function getMemberProfiles(astro, guildId, ids, botToken, options = {}) {
  const wanted = [...new Set(ids.map(String).filter((id) => ID.test(id)))];
  const result = /* @__PURE__ */ new Map();
  if (!wanted.length) return result;
  const kept = await peekMany(wanted.map((id) => key(guildId, id)));
  const missing = [];
  for (const id of wanted) {
    const k = key(guildId, id);
    if (kept.has(k)) result.set(id, kept.get(k) ?? null);
    else missing.push(id);
  }
  if (!missing.length) return result;
  const learned = [];
  const fromApi = await askBot(astro, guildId, missing, options.userId);
  let left = missing;
  if (fromApi) {
    left = [];
    for (const id of missing) {
      const profile = fromApi.has(id) ? fromApi.get(id) ?? null : void 0;
      if (profile === void 0) {
        left.push(id);
        continue;
      }
      if (profile || options.fallback !== "user") {
        result.set(id, profile);
        learned.push([key(guildId, id), profile]);
      } else left.push(id);
    }
  }
  if (left.length && botToken) {
    const viaUser = options.fallback === "user";
    await inBatches(left, FALLBACK_CONCURRENCY, async (id) => {
      try {
        const url = viaUser ? `https://discord.com/api/users/${id}` : `https://discord.com/api/guilds/${guildId}/members/${id}`;
        const res = await fetch(url, { headers: { Authorization: `Bot ${botToken}` } });
        if (res.status === 429 || res.status >= 500) {
          result.set(id, null);
          return;
        }
        const body = res.ok ? await res.json() : null;
        const profile = res.ok ? viaUser ? fromDiscordUser(id, body) : fromDiscordMember(id, body) : null;
        result.set(id, profile);
        learned.push([key(guildId, id), profile]);
      } catch {
        result.set(id, null);
      }
    });
  }
  for (const id of left) if (!result.has(id)) result.set(id, null);
  await storeMany(learned, NAME_TTL_MS).catch(() => {
  });
  return result;
}

export { getMemberProfiles as g, memberAvatarUrl as m };
