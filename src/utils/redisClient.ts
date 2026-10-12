import { createClient } from 'redis';

/**
 * The optional Redis of the site, Node (Discloud) build only: REDIS_URL or DISCLOUD_REDIS_URL, the same Redis the bot uses.
 * Everything here may say "nothing": with no Redis configured, while it connects, while it is down or slow, every call answers
 * at once with its fallback, so a page never waits on it. A command that takes longer than 150 ms counts as a failure and Redis
 * is then left alone for a while (longer after each failure in a row).
 */

type Client = ReturnType<typeof createClient>;

const TIMEOUT_MS = Math.max(50, Number(process.env.PETTO_REDIS_TIMEOUT_MS) || 150);
const BACKOFFS_MS = [2_000, 5_000, 15_000, 60_000];

let client: Client | null = null;
let subscriber: Client | null = null;
let ready = false;
let subscribed = false;
let failures = 0;
let downUntil = 0;
let lastWarnAt = 0;
const listeners = new Map<string, Set<(message: string) => void>>();

function url(): string {
  return String(process.env.DISCLOUD_REDIS_URL || process.env.REDIS_URL || '').trim();
}

function warn(message: string): void {
  if (Date.now() - lastWarnAt < 10 * 60_000) return;
  lastWarnAt = Date.now();
  console.warn(`[redis] ${message}`);
}

function start(): Client | null {
  if (client) return client;
  const address = url();
  if (!address) return null;
  const socket = { connectTimeout: 3_000, reconnectStrategy: (attempt: number) => Math.min(500 * (attempt + 1), 10_000) };
  client = createClient({ url: address, socket });
  client.on('ready', () => { ready = true; failures = 0; downUntil = 0; });
  client.on('end', () => { ready = false; });
  client.on('error', (error: Error) => { ready = false; warn(`connection problem: ${error?.message ?? error}`); });
  client.connect().catch((error: Error) => warn(`could not connect: ${error?.message ?? error}`));

  // Messages need a connection of their own. The bot publishes on them when its copies change.
  subscriber = client.duplicate();
  subscriber.on('error', (error: Error) => { subscribed = false; warn(`subscriber problem: ${error?.message ?? error}`); });
  subscriber.on('end', () => { subscribed = false; });
  subscriber.on('ready', () => { subscribed = true; });
  subscriber.connect()
    .then(() => Promise.all([...listeners.keys()].map((channel) => listen(channel))))
    .catch((error: Error) => warn(`could not subscribe: ${error?.message ?? error}`));
  return client;
}

async function listen(channel: string): Promise<void> {
  if (!subscriber?.isOpen) return;
  await subscriber.subscribe(channel, (message: string) => {
    for (const handler of listeners.get(channel) ?? []) {
      try { handler(message); } catch { /* a handler never breaks the others */ }
    }
  });
}

/** True when Redis is configured at all (it may still be connecting). */
export function redisConfigured(): boolean {
  return Boolean(url());
}

/** True while the messages of the bot arrive, so copies kept here are dropped as soon as they change. */
export function redisSubscribed(): boolean {
  start();
  return subscribed;
}

/** Runs one command with the time limit, or answers the fallback right away when Redis is not usable now. */
export async function redisRun<T>(action: (redis: Client) => Promise<T>, fallback: T): Promise<T> {
  const redis = start();
  if (!redis || !ready || Date.now() < downUntil) return fallback;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const result = await Promise.race([
      action(redis),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error(`timed out after ${TIMEOUT_MS} ms`)), TIMEOUT_MS); }),
    ]);
    failures = 0;
    return result;
  } catch (error) {
    const wait = BACKOFFS_MS[Math.min(failures, BACKOFFS_MS.length - 1)];
    failures += 1;
    downUntil = Date.now() + wait;
    warn(`a command failed (${(error as Error)?.message ?? error}); not used for ${wait / 1000}s.`);
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

/** Calls `handler` with every message published on `channel`. */
export function onRedisMessage(channel: string, handler: (message: string) => void): void {
  if (!redisConfigured()) return;
  let set = listeners.get(channel);
  if (!set) {
    listeners.set(channel, (set = new Set()));
    start();
    listen(channel).catch(() => {});
  }
  set.add(handler);
}

export function redisPublish(channel: string, message: string): Promise<boolean> {
  return redisRun(async (redis) => { await redis.publish(channel, message); return true; }, false);
}

/** Connects at boot, so the first page does not pay for it. */
export function warmRedis(): void {
  start();
}
