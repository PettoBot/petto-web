/**
 * A change stamp per server, so an open dashboard knows when what it shows has changed without reading the page again.
 *
 * - Every change made from the dashboard (a form, a button that calls an API, a write straight to the database), every new copy of the
 *   server the bot saves (`petto:snap`) and every change the bot makes to settings the dashboard shows raises it.
 * - With Redis (Node, Discloud) the stamp is the counter `petto:ver:<guildId>` (INCR), and each raise is announced on `petto:ver` as
 *   `<guildId>:<n>`, so every web process and every open page hears it at once. The bot raises the same counter.
 * - Without Redis (or while it is down) the stamp lives in this process: `m<boot>.<n>`. The boot part changes on every restart, so a
 *   copy made before a restart is never taken for a current one.
 *
 * Reading it is a lookup in memory while the messages of `petto:ver` arrive, otherwise one Redis GET kept for a second.
 */

type RedisModule = typeof import('./redisClient');

const redis: Promise<RedisModule | null> | null = __NODE_TARGET__ ? import('./redisClient').catch(() => null) : null;
const KEY = (guildId: string) => `petto:ver:${guildId}`;
const CHANNEL = 'petto:ver';
const KEY_TTL_S = 30 * 24 * 3600;
// While the messages arrive, a value read from Redis is still checked again now and then (a message lost during a reconnection).
const LIVE_RECHECK_MS = 30_000;
const POLL_RECHECK_MS = 1_000;
const SNOWFLAKE = /^\d{5,25}$/;

const BOOT = Math.random().toString(36).slice(2, 8);
const local = new Map<string, number>();
const known = new Map<string, { v: string; at: number }>();
const listeners = new Map<string, Set<(version: string) => void>>();
let subscribed = false;

function counterOf(version: string | undefined): number {
  return version && version.startsWith('r') ? Number(version.slice(1)) || 0 : -1;
}

function remember(guildId: string, version: string): void {
  const before = known.get(guildId)?.v;
  // A raise heard from Redis never goes back to an older number (messages can arrive out of order).
  if (before && before.startsWith('r') && version.startsWith('r') && counterOf(version) < counterOf(before)) {
    known.set(guildId, { v: before, at: Date.now() });
    return;
  }
  if (known.size > 20_000) known.clear();
  known.set(guildId, { v: version, at: Date.now() });
  if (before !== version) {
    for (const listener of listeners.get(guildId) ?? []) {
      try { listener(version); } catch { /* a listener never breaks the others */ }
    }
  }
}

function localBump(guildId: string): string {
  const next = (local.get(guildId) ?? 0) + 1;
  local.set(guildId, next);
  const version = `m${BOOT}.${next}`;
  remember(guildId, version);
  return version;
}

async function usableRedis(): Promise<RedisModule | null> {
  if (!redis) return null;
  const module = await redis;
  if (!module?.redisConfigured()) return null;
  if (!subscribed) {
    subscribed = true;
    module.onRedisMessage(CHANNEL, (message) => {
      const [guildId, count] = String(message).split(':');
      if (SNOWFLAKE.test(guildId ?? '') && /^\d+$/.test(count ?? '')) remember(guildId, `r${count}`);
    });
  }
  return module;
}

/** The current stamp of a server. */
export async function guildVersion(guildId: string): Promise<string> {
  if (!SNOWFLAKE.test(guildId)) return '0';
  const hit = known.get(guildId);
  const module = await usableRedis();
  const live = Boolean(module?.redisSubscribed());
  if (hit && Date.now() - hit.at < (live ? LIVE_RECHECK_MS : POLL_RECHECK_MS)) return hit.v;
  if (module) {
    const raw = await module.redisRun((client) => client.get(KEY(guildId)), undefined as string | null | undefined);
    if (raw !== undefined) {
      remember(guildId, `r${Number(raw) || 0}`);
      return known.get(guildId)!.v;
    }
  }
  if (hit) return hit.v;
  const version = `m${BOOT}.${local.get(guildId) ?? 0}`;
  remember(guildId, version);
  return version;
}

/** Raises the stamp of a server (something it shows changed) and tells every web process. Answers the new stamp. */
export async function bumpGuildVersion(guildId: string): Promise<string> {
  if (!SNOWFLAKE.test(guildId)) return '0';
  const module = await usableRedis();
  if (module) {
    const count = await module.redisRun(async (client) => {
      const value = await client.incr(KEY(guildId));
      await client.expire(KEY(guildId), KEY_TTL_S);
      return value;
    }, null as number | null);
    if (count !== null) {
      remember(guildId, `r${count}`);
      void module.redisPublish(CHANNEL, `${guildId}:${count}`).catch(() => false);
      return known.get(guildId)!.v;
    }
  }
  return localBump(guildId);
}

/** Calls `listener` with each new stamp of a server (this process hears every raise while Redis messages arrive). Returns the stop. */
export function onGuildVersion(guildId: string, listener: (version: string) => void): () => void {
  let set = listeners.get(guildId);
  if (!set) listeners.set(guildId, (set = new Set()));
  set.add(listener);
  void usableRedis();
  return () => {
    set!.delete(listener);
    if (!set!.size) listeners.delete(guildId);
  };
}

/** How many pages listen right now (the health page shows it). */
export function liveListenerCount(): number {
  let total = 0;
  for (const set of listeners.values()) total += set.size;
  return total;
}

/** FNV-1a, enough to tell two strings apart in an ETag (not a secret). */
function fnv(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(36);
}

// Some parts of a page change without a stamp (statistics, the leaderboard, open tickets, Discord's audit log), so a copy is also
// only taken as current within the same minute.
export const PAGE_COPY_WINDOW_MS = 60_000;

/** The ETag of a dashboard page: its stamp, the minute, the address, the visitor, the language, the build and the kind of answer. */
export function dashEtag(parts: { version: string; path: string; userId: string; lang: string; partial: boolean; build: string }): string {
  const minute = Math.floor(Date.now() / PAGE_COPY_WINDOW_MS);
  return `W/"dv.${parts.version}.${minute.toString(36)}.${fnv(`${parts.path}|${parts.userId}|${parts.lang}|${parts.partial ? 'p' : 'f'}|${parts.build}`)}"`;
}
