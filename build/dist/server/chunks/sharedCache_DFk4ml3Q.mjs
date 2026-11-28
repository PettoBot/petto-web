const ORIGIN = "https://edge-cache.petto.internal/";
function store() {
  const caches = globalThis.caches;
  return caches?.default ?? null;
}
async function digest(text) {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function edgeGet(namespace, secret) {
  try {
    const cache = store();
    if (!cache) return null;
    const hit = await cache.match(new Request(`${ORIGIN}${namespace}/${await digest(secret)}`));
    return hit ? await hit.json() : null;
  } catch {
    return null;
  }
}
async function edgePut(namespace, secret, value, ttlSeconds) {
  try {
    const cache = store();
    if (!cache) return;
    await cache.put(
      new Request(`${ORIGIN}${namespace}/${await digest(secret)}`),
      new Response(JSON.stringify(value), { headers: { "Content-Type": "application/json", "Cache-Control": `public, max-age=${ttlSeconds}` } })
    );
  } catch {
  }
}
async function edgeDelete(namespace, secret) {
  try {
    await store()?.delete(new Request(`${ORIGIN}${namespace}/${await digest(secret)}`));
  } catch {
  }
}

const MAX_ENTRIES = 5e3;
const REDIS_PREFIX = "petto:web:";
const memory = /* @__PURE__ */ new Map();
const inflight = /* @__PURE__ */ new Map();
const redis = import('./redisClient_LTb0mKe8.mjs').catch(() => null) ;
function remember(key, entry) {
  memory.delete(key);
  memory.set(key, entry);
  if (memory.size > MAX_ENTRIES) {
    const oldest = memory.keys().next().value;
    if (oldest !== void 0) memory.delete(oldest);
  }
}
async function remoteGet(key) {
  if (redis) {
    const module = await redis;
    if (!module?.redisConfigured()) return null;
    const raw = await module.redisRun((client) => client.get(REDIS_PREFIX + key), null);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return edgeGet("shared-cache", key);
}
async function remoteSet(key, entry) {
  const ttlMs = Math.max(1e3, entry.staleUntil - Date.now());
  const payload = { v: entry.value, f: entry.freshUntil, s: entry.staleUntil };
  if (redis) {
    const module = await redis;
    if (!module?.redisConfigured()) return;
    let text;
    try {
      text = JSON.stringify(payload);
    } catch {
      return;
    }
    await module.redisRun(async (client) => {
      await client.set(REDIS_PREFIX + key, text, { PX: ttlMs });
      return true;
    }, false);
    return;
  }
  await edgePut("shared-cache", key, payload, Math.ceil(ttlMs / 1e3));
}
async function remoteDelete(keys) {
  if (!keys.length) return;
  if (redis) {
    const module = await redis;
    if (!module?.redisConfigured()) return;
    await module.redisRun(async (client) => {
      await client.del(keys.map((key) => REDIS_PREFIX + key));
      return true;
    }, false);
    return;
  }
  await Promise.all(keys.map((key) => edgeDelete("shared-cache", key)));
}
function load(key, loader, options) {
  {
    const running = inflight.get(key);
    if (running) return running;
  }
  const started = Date.now();
  const pending = loader().then((value) => {
    if (!options.keep || options.keep(value)) {
      const entry = { value, freshUntil: started + options.freshMs, staleUntil: started + Math.max(options.freshMs, options.staleMs ?? options.freshMs) };
      remember(key, entry);
      if (options.shared) void remoteSet(key, entry).catch(() => {
      });
    }
    return value;
  });
  {
    inflight.set(key, pending);
    const clear = () => {
      if (inflight.get(key) === pending) inflight.delete(key);
    };
    pending.then(clear, clear);
  }
  return pending;
}
function refreshInBackground(key, loader, options) {
  load(key, loader, options).catch(() => {
  });
}
async function cached(key, loader, options) {
  const now = Date.now();
  const hit = memory.get(key);
  if (hit && hit.freshUntil > now) return hit.value;
  if (hit && options.allowStale && hit.staleUntil > now) {
    refreshInBackground(key, loader, options);
    return hit.value;
  }
  if (options.shared) {
    const remote = await remoteGet(key).catch(() => null);
    if (remote && typeof remote.f === "number" && typeof remote.s === "number") {
      const entry = { value: remote.v, freshUntil: remote.f, staleUntil: remote.s };
      if (entry.freshUntil > Date.now()) {
        remember(key, entry);
        return entry.value;
      }
      if (options.allowStale && entry.staleUntil > Date.now()) {
        remember(key, entry);
        refreshInBackground(key, loader, options);
        return entry.value;
      }
    }
  }
  try {
    return await load(key, loader, options);
  } catch (error) {
    const old = memory.get(key);
    if (old && options.allowStale && old.staleUntil > Date.now()) return old.value;
    throw error;
  }
}
async function peekMany(keys, shared = true) {
  const found = /* @__PURE__ */ new Map();
  const missing = [];
  const now = Date.now();
  for (const key of keys) {
    const hit = memory.get(key);
    if (hit && hit.freshUntil > now) found.set(key, hit.value);
    else missing.push(key);
  }
  if (!shared || !missing.length) return found;
  if (redis) {
    const module = await redis;
    if (!module?.redisConfigured()) return found;
    const raws = await module.redisRun((client) => client.mGet(missing.map((key) => REDIS_PREFIX + key)), []);
    raws.forEach((raw, index) => {
      if (!raw) return;
      try {
        const remote = JSON.parse(raw);
        if (remote.f > Date.now()) {
          remember(missing[index], { value: remote.v, freshUntil: remote.f, staleUntil: remote.s });
          found.set(missing[index], remote.v);
        }
      } catch {
      }
    });
  }
  return found;
}
async function storeMany(entries, freshMs, shared = true) {
  if (!entries.length) return;
  const now = Date.now();
  const made = entries.map(([key, value]) => {
    const entry = { value, freshUntil: now + freshMs, staleUntil: now + freshMs };
    remember(key, entry);
    return [key, entry];
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
async function invalidate(key, shared = true) {
  memory.delete(key);
  if (shared) await remoteDelete([key]).catch(() => {
  });
}
function invalidatePrefix(prefix) {
  for (const key of [...memory.keys()]) if (key.startsWith(prefix)) memory.delete(key);
}
async function digestKey(secret) {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret)));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
function onSharedMessage(channel, handler) {
  if (!redis) return;
  void redis.then((module) => module?.onRedisMessage(channel, handler));
}
async function sharedPublish(channel, message) {
  if (!redis) return;
  const module = await redis;
  if (module?.redisConfigured()) await module.redisPublish(channel, message);
}
async function sharedMessagesLive() {
  if (!redis) return false;
  const module = await redis;
  return Boolean(module?.redisSubscribed());
}
async function sharedGetRaw(key) {
  if (!redis) return null;
  const module = await redis;
  if (!module?.redisConfigured()) return null;
  return module.redisRun((client) => client.get(key), null);
}
function warmShared() {
  if (redis) void redis.then((module) => module?.warmRedis());
}

export { cached, digestKey, invalidate, invalidatePrefix, onSharedMessage, peekMany, sharedGetRaw, sharedMessagesLive, sharedPublish, storeMany, warmShared };
