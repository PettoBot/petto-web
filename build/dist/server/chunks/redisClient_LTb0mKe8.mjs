import { createClient } from 'redis';

const TIMEOUT_MS = Math.max(50, Number(process.env.PETTO_REDIS_TIMEOUT_MS) || 150);
const BACKOFFS_MS = [2e3, 5e3, 15e3, 6e4];
let client = null;
let subscriber = null;
let ready = false;
let subscribed = false;
let failures = 0;
let downUntil = 0;
let lastWarnAt = 0;
const listeners = /* @__PURE__ */ new Map();
function url() {
  return String(process.env.DISCLOUD_REDIS_URL || process.env.REDIS_URL || "").trim();
}
function warn(message) {
  if (Date.now() - lastWarnAt < 10 * 6e4) return;
  lastWarnAt = Date.now();
  console.warn(`[redis] ${message}`);
}
function start() {
  if (client) return client;
  const address = url();
  if (!address) return null;
  const socket = { connectTimeout: 3e3, reconnectStrategy: (attempt) => Math.min(500 * (attempt + 1), 1e4) };
  client = createClient({ url: address, socket });
  client.on("ready", () => {
    ready = true;
    failures = 0;
    downUntil = 0;
  });
  client.on("end", () => {
    ready = false;
  });
  client.on("error", (error) => {
    ready = false;
    warn(`connection problem: ${error?.message ?? error}`);
  });
  client.connect().catch((error) => warn(`could not connect: ${error?.message ?? error}`));
  subscriber = client.duplicate();
  subscriber.on("error", (error) => {
    subscribed = false;
    warn(`subscriber problem: ${error?.message ?? error}`);
  });
  subscriber.on("end", () => {
    subscribed = false;
  });
  subscriber.on("ready", () => {
    subscribed = true;
  });
  subscriber.connect().then(() => Promise.all([...listeners.keys()].map((channel) => listen(channel)))).catch((error) => warn(`could not subscribe: ${error?.message ?? error}`));
  return client;
}
const listening = /* @__PURE__ */ new Set();
async function listen(channel) {
  if (!subscriber?.isOpen || listening.has(channel)) return;
  listening.add(channel);
  await subscriber.subscribe(channel, (message) => {
    for (const handler of listeners.get(channel) ?? []) {
      try {
        handler(message);
      } catch {
      }
    }
  }).catch((error) => {
    listening.delete(channel);
    throw error;
  });
}
function redisConfigured() {
  return Boolean(url());
}
function redisSubscribed() {
  start();
  return subscribed;
}
async function redisRun(action, fallback) {
  const redis = start();
  if (!redis || !ready || Date.now() < downUntil) return fallback;
  let timer;
  try {
    const result = await Promise.race([
      action(redis),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`timed out after ${TIMEOUT_MS} ms`)), TIMEOUT_MS);
      })
    ]);
    failures = 0;
    return result;
  } catch (error) {
    const wait = BACKOFFS_MS[Math.min(failures, BACKOFFS_MS.length - 1)];
    failures += 1;
    downUntil = Date.now() + wait;
    warn(`a command failed (${error?.message ?? error}); not used for ${wait / 1e3}s.`);
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}
function onRedisMessage(channel, handler) {
  if (!redisConfigured()) return;
  let set = listeners.get(channel);
  if (!set) {
    listeners.set(channel, set = /* @__PURE__ */ new Set());
    start();
    listen(channel).catch(() => {
    });
  }
  set.add(handler);
}
function redisPublish(channel, message) {
  return redisRun(async (redis) => {
    await redis.publish(channel, message);
    return true;
  }, false);
}
function warmRedis() {
  start();
}

export { onRedisMessage, redisConfigured, redisPublish, redisRun, redisSubscribed, warmRedis };
