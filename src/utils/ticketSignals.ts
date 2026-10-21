/**
 * The bot's signal that the tickets of a server changed: a message in a ticket, a ticket opened, claimed or closed (petto-bot
 * src/utils/ticketLive.js). The bot sends it on Redis (`petto:tk`, `<guildId>:<time>`) only while someone looks at the live tickets of
 * that server, at most once every 1.5 seconds, and the stream of the open pages passes it on (`event: tk`, see events.ts) so the live
 * view reads its list at once. It is not the change stamp of the server (guildVersion.ts): no other page reads itself again for it.
 * Node build only; without Redis the live view asks every few seconds instead.
 */
type RedisModule = typeof import('./redisClient');

const redis: Promise<RedisModule | null> | null = __NODE_TARGET__ ? import('./redisClient').catch(() => null) : null;
const CHANNEL = 'petto:tk';
const SNOWFLAKE = /^\d{5,25}$/;
const listeners = new Map<string, Set<(stamp: string) => void>>();
let subscribed = false;

async function subscribe(): Promise<void> {
  if (subscribed || !redis) return;
  const module = await redis;
  if (!module?.redisConfigured()) return;
  subscribed = true;
  module.onRedisMessage(CHANNEL, (message) => {
    const [guildId, stamp] = String(message).split(':');
    if (!SNOWFLAKE.test(guildId ?? '')) return;
    for (const listener of listeners.get(guildId) ?? []) {
      try { listener(stamp || String(Date.now())); } catch { /* a listener never breaks the others */ }
    }
  });
}

/** Calls `listener` each time the bot says the tickets of a server changed. Returns the stop. */
export function onTicketSignal(guildId: string, listener: (stamp: string) => void): () => void {
  let set = listeners.get(guildId);
  if (!set) listeners.set(guildId, (set = new Set()));
  set.add(listener);
  void subscribe();
  return () => {
    set!.delete(listener);
    if (!set!.size) listeners.delete(guildId);
  };
}
