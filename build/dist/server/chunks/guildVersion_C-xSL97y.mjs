const redis = import('./redisClient_LTb0mKe8.mjs').catch(() => null) ;
const KEY = (guildId) => `petto:ver:${guildId}`;
const CHANNEL = "petto:ver";
const KEY_TTL_S = 30 * 24 * 3600;
const LIVE_RECHECK_MS = 3e4;
const POLL_RECHECK_MS = 1e3;
const SNOWFLAKE = /^\d{5,25}$/;
const BOOT = Math.random().toString(36).slice(2, 8);
const local = /* @__PURE__ */ new Map();
const known = /* @__PURE__ */ new Map();
const listeners = /* @__PURE__ */ new Map();
let subscribed = false;
function counterOf(version) {
  return version && version.startsWith("r") ? Number(version.slice(1)) || 0 : -1;
}
function remember(guildId, version) {
  const before = known.get(guildId)?.v;
  if (before && before.startsWith("r") && version.startsWith("r") && counterOf(version) < counterOf(before)) {
    known.set(guildId, { v: before, at: Date.now() });
    return;
  }
  if (known.size > 2e4) known.clear();
  known.set(guildId, { v: version, at: Date.now() });
  if (before !== version) {
    for (const listener of listeners.get(guildId) ?? []) {
      try {
        listener(version);
      } catch {
      }
    }
  }
}
function localBump(guildId) {
  const next = (local.get(guildId) ?? 0) + 1;
  local.set(guildId, next);
  const version = `m${BOOT}.${next}`;
  remember(guildId, version);
  return version;
}
async function usableRedis() {
  if (!redis) return null;
  const module = await redis;
  if (!module?.redisConfigured()) return null;
  if (!subscribed) {
    subscribed = true;
    module.onRedisMessage(CHANNEL, (message) => {
      const [guildId, count] = String(message).split(":");
      if (SNOWFLAKE.test(guildId ?? "") && /^\d+$/.test(count ?? "")) remember(guildId, `r${count}`);
    });
  }
  return module;
}
async function guildVersion(guildId) {
  if (!SNOWFLAKE.test(guildId)) return "0";
  const hit = known.get(guildId);
  const module = await usableRedis();
  const live = Boolean(module?.redisSubscribed());
  if (hit && Date.now() - hit.at < (live ? LIVE_RECHECK_MS : POLL_RECHECK_MS)) return hit.v;
  if (module) {
    const raw = await module.redisRun((client) => client.get(KEY(guildId)), void 0);
    if (raw !== void 0) {
      remember(guildId, `r${Number(raw) || 0}`);
      return known.get(guildId).v;
    }
  }
  if (hit) return hit.v;
  const version = `m${BOOT}.${local.get(guildId) ?? 0}`;
  remember(guildId, version);
  return version;
}
async function bumpGuildVersion(guildId) {
  if (!SNOWFLAKE.test(guildId)) return "0";
  const module = await usableRedis();
  if (module) {
    const count = await module.redisRun(async (client) => {
      const value = await client.incr(KEY(guildId));
      await client.expire(KEY(guildId), KEY_TTL_S);
      return value;
    }, null);
    if (count !== null) {
      remember(guildId, `r${count}`);
      void module.redisPublish(CHANNEL, `${guildId}:${count}`).catch(() => false);
      return known.get(guildId).v;
    }
  }
  return localBump(guildId);
}
function onGuildVersion(guildId, listener) {
  let set = listeners.get(guildId);
  if (!set) listeners.set(guildId, set = /* @__PURE__ */ new Set());
  set.add(listener);
  void usableRedis();
  return () => {
    set.delete(listener);
    if (!set.size) listeners.delete(guildId);
  };
}
function liveListenerCount() {
  let total = 0;
  for (const set of listeners.values()) total += set.size;
  return total;
}
function fnv(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(36);
}
const PAGE_COPY_WINDOW_MS = 6e4;
function dashEtag(parts) {
  const minute = Math.floor(Date.now() / PAGE_COPY_WINDOW_MS);
  return `W/"dv.${parts.version}.${minute.toString(36)}.${fnv(`${parts.path}|${parts.userId}|${parts.lang}|${parts.partial ? "p" : "f"}|${parts.build}`)}"`;
}

export { PAGE_COPY_WINDOW_MS, bumpGuildVersion, dashEtag, guildVersion, liveListenerCount, onGuildVersion };
