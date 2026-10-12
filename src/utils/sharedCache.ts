import { edgeDelete, edgeGet, edgePut } from './edgeCache';

/**
 * One cache for the answers the dashboard asks for again and again (the servers of a visitor, Premium, the bot's copy of a
 * server, member names...). It looks in this process first, then in a shared store, and only then loads:
 *
 * - Node (Discloud): the shared store is Redis (REDIS_URL or DISCLOUD_REDIS_URL, keys under `petto:web:`). Without it, or while it
 *   is slow or down, only this process remembers, exactly as before.
 * - Cloudflare: the shared store is the data center cache (caches.default), as edgeCache.ts did.
 *
 * A value is fresh for `freshMs`. After that, a caller that accepts it (`allowStale`) gets the old value at once while one refresh
 * runs in the background, until `staleMs`. On Node, callers that want the same missing value wait for the same load (single
 * flight). A Worker cannot wait on work another request started, so there each request loads on its own.
 */

type Entry = { value: unknown; freshUntil: number; staleUntil: number };
type Remote = { v: unknown; f: number; s: number };

export interface CacheOptions<T> {
  /** How long the value is good as it is. */
  freshMs: number;
  /** How long an old value may still be served while it is refreshed (from when it was loaded). Defaults to `freshMs`. */
  staleMs?: number;
  /** Serve an old value (up to `staleMs`) while one refresh runs. Only for reads. */
  allowStale?: boolean;
  /** Keep the value in the shared store too (Redis or the edge cache), not only in this process. */
  shared?: boolean;
  /** Values for which this answers false are returned but not kept (an error page, an empty answer that means "try again"). */
  keep?: (value: T) => boolean;
}

const MAX_ENTRIES = 5_000;
const REDIS_PREFIX = 'petto:web:';
const memory = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

const redis = __NODE_TARGET__ ? import('./redisClient').catch(() => null) : null;

function remember(key: string, entry: Entry): void {
  memory.delete(key);
  memory.set(key, entry);
  if (memory.size > MAX_ENTRIES) {
    const oldest = memory.keys().next().value;
    if (oldest !== undefined) memory.delete(oldest);
  }
}

async function remoteGet(key: string): Promise<Remote | null> {
  if (redis) {
    const module = await redis;
    if (!module?.redisConfigured()) return null;
    const raw = await module.redisRun((client) => client.get(REDIS_PREFIX + key), null);
    if (!raw) return null;
    try { return JSON.parse(raw) as Remote; } catch { return null; }
  }
  return edgeGet<Remote>('shared-cache', key);
}

async function remoteSet(key: string, entry: Entry): Promise<void> {
  const ttlMs = Math.max(1_000, entry.staleUntil - Date.now());
  const payload: Remote = { v: entry.value, f: entry.freshUntil, s: entry.staleUntil };
  if (redis) {
    const module = await redis;
    if (!module?.redisConfigured()) return;
    let text: string;
    try { text = JSON.stringify(payload); } catch { return; }
    await module.redisRun(async (client) => { await client.set(REDIS_PREFIX + key, text, { PX: ttlMs }); return true; }, false);
    return;
  }
  await edgePut('shared-cache', key, payload, Math.ceil(ttlMs / 1000));
}

async function remoteDelete(keys: string[]): Promise<void> {
  if (!keys.length) return;
  if (redis) {
    const module = await redis;
    if (!module?.redisConfigured()) return;
    await module.redisRun(async (client) => { await client.del(keys.map((key) => REDIS_PREFIX + key)); return true; }, false);
    return;
  }
  await Promise.all(keys.map((key) => edgeDelete('shared-cache', key)));
}

function load<T>(key: string, loader: () => Promise<T>, options: CacheOptions<T>): Promise<T> {
  // Only Node can share one load between requests (see above).
  if (__NODE_TARGET__) {
    const running = inflight.get(key) as Promise<T> | undefined;
    if (running) return running;
  }
  const started = Date.now();
  const pending = loader().then((value) => {
    if (!options.keep || options.keep(value)) {
      const entry = { value, freshUntil: started + options.freshMs, staleUntil: started + Math.max(options.freshMs, options.staleMs ?? options.freshMs) };
      remember(key, entry);
      if (options.shared) void remoteSet(key, entry).catch(() => {});
    }
    return value;
  });
  if (__NODE_TARGET__) {
    inflight.set(key, pending);
    const clear = () => { if (inflight.get(key) === pending) inflight.delete(key); };
    pending.then(clear, clear);
  }
  return pending;
}

function refreshInBackground<T>(key: string, loader: () => Promise<T>, options: CacheOptions<T>): void {
  load(key, loader, options).catch(() => { /* the old value stays until it runs out */ });
}

/** The value under `key`, loaded with `loader` when no usable copy is kept. */
export async function cached<T>(key: string, loader: () => Promise<T>, options: CacheOptions<T>): Promise<T> {
  const now = Date.now();
  const hit = memory.get(key);
  if (hit && hit.freshUntil > now) return hit.value as T;
  if (hit && options.allowStale && hit.staleUntil > now) {
    refreshInBackground(key, loader, options);
    return hit.value as T;
  }

  if (options.shared) {
    const remote = await remoteGet(key).catch(() => null);
    if (remote && typeof remote.f === 'number' && typeof remote.s === 'number') {
      const entry = { value: remote.v, freshUntil: remote.f, staleUntil: remote.s };
      if (entry.freshUntil > Date.now()) {
        remember(key, entry);
        return entry.value as T;
      }
      if (options.allowStale && entry.staleUntil > Date.now()) {
        remember(key, entry);
        refreshInBackground(key, loader, options);
        return entry.value as T;
      }
    }
  }

  try {
    return await load(key, loader, options);
  } catch (error) {
    // A failed load can still be answered by an old copy when the caller accepts one.
    const old = memory.get(key);
    if (old && options.allowStale && old.staleUntil > Date.now()) return old.value as T;
    throw error;
  }
}

/** A kept value that is still fresh, without loading anything. */
export function peek<T>(key: string): T | undefined {
  const hit = memory.get(key);
  return hit && hit.freshUntil > Date.now() ? hit.value as T : undefined;
}

/** Several fresh values at once (this process first, then one round trip to Redis for the rest). */
export async function peekMany<T>(keys: string[], shared = true): Promise<Map<string, T>> {
  const found = new Map<string, T>();
  const missing: string[] = [];
  const now = Date.now();
  for (const key of keys) {
    const hit = memory.get(key);
    if (hit && hit.freshUntil > now) found.set(key, hit.value as T);
    else missing.push(key);
  }
  if (!shared || !missing.length) return found;
  if (redis) {
    const module = await redis;
    if (!module?.redisConfigured()) return found;
    const raws = await module.redisRun((client) => client.mGet(missing.map((key) => REDIS_PREFIX + key)), [] as (string | null)[]);
    raws.forEach((raw, index) => {
      if (!raw) return;
      try {
        const remote = JSON.parse(raw) as Remote;
        if (remote.f > Date.now()) {
          remember(missing[index], { value: remote.v, freshUntil: remote.f, staleUntil: remote.s });
          found.set(missing[index], remote.v as T);
        }
      } catch { /* unreadable, loaded again */ }
    });
  }
  return found;
}

/** Keeps several values at once. */
export async function storeMany(entries: Array<[string, unknown]>, freshMs: number, shared = true): Promise<void> {
  if (!entries.length) return;
  const now = Date.now();
  const made = entries.map(([key, value]) => {
    const entry = { value, freshUntil: now + freshMs, staleUntil: now + freshMs };
    remember(key, entry);
    return [key, entry] as const;
  });
  if (!shared) return;
  if (redis) {
    const module = await redis;
    if (!module?.redisConfigured()) return;
    await module.redisRun(async (client) => {
      const batch = client.multi();
      for (const [key, entry] of made) batch.set(REDIS_PREFIX + key, JSON.stringify({ v: entry.value, f: entry.freshUntil, s: entry.staleUntil }), { PX: freshMs });
      await batch.exec();
      return true;
    }, false);
  }
}

/** Forgets one key everywhere (this process and the shared store). */
export async function invalidate(key: string, shared = true): Promise<void> {
  memory.delete(key);
  if (shared) await remoteDelete([key]).catch(() => {});
}

/** Forgets every key that starts with `prefix`, in this process only. */
export function invalidatePrefix(prefix: string): void {
  for (const key of [...memory.keys()]) if (key.startsWith(prefix)) memory.delete(key);
}

/** A short, fixed form of a secret (a token) for a key; the secret itself never goes into a cache key. */
export async function digestKey(secret: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret)));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/** Calls `handler` with each message the bot publishes on `channel` (Node with Redis only; nothing happens otherwise). */
export function onSharedMessage(channel: string, handler: (message: string) => void): void {
  if (!redis) return;
  void redis.then((module) => module?.onRedisMessage(channel, handler));
}

export async function sharedPublish(channel: string, message: string): Promise<void> {
  if (!redis) return;
  const module = await redis;
  if (module?.redisConfigured()) await module.redisPublish(channel, message);
}

/** True while the bot's messages arrive here, so a copy can be kept longer: it is dropped as soon as the bot says it changed. */
export async function sharedMessagesLive(): Promise<boolean> {
  if (!redis) return false;
  const module = await redis;
  return Boolean(module?.redisSubscribed());
}

/** A raw key of the bot (outside the web prefix), such as `petto:snap:<guildId>`. */
export async function sharedGetRaw(key: string): Promise<string | null> {
  if (!redis) return null;
  const module = await redis;
  if (!module?.redisConfigured()) return null;
  return module.redisRun((client) => client.get(key), null);
}

export function warmShared(): void {
  if (redis) void redis.then((module) => module?.warmRedis());
}
