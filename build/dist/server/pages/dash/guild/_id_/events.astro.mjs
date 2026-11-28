import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { onGuildVersion, guildVersion } from '../../../../chunks/guildVersion_C-xSL97y.mjs';
import { o as openLiveStream } from '../../../../chunks/liveClients_BeB2izBu.mjs';
export { renderers } from '../../../../renderers.mjs';

const redis = import('../../../../chunks/redisClient_LTb0mKe8.mjs').catch(() => null) ;
const CHANNEL = "petto:tk";
const SNOWFLAKE = /^\d{5,25}$/;
const listeners = /* @__PURE__ */ new Map();
let subscribed = false;
async function subscribe() {
  if (subscribed || !redis) return;
  const module = await redis;
  if (!module?.redisConfigured()) return;
  subscribed = true;
  module.onRedisMessage(CHANNEL, (message) => {
    const [guildId, stamp] = String(message).split(":");
    if (!SNOWFLAKE.test(guildId ?? "")) return;
    for (const listener of listeners.get(guildId) ?? []) {
      try {
        listener(stamp || String(Date.now()));
      } catch {
      }
    }
  });
}
function onTicketSignal(guildId, listener) {
  let set = listeners.get(guildId);
  if (!set) listeners.set(guildId, set = /* @__PURE__ */ new Set());
  set.add(listener);
  void subscribe();
  return () => {
    set.delete(listener);
    if (!set.size) listeners.delete(guildId);
  };
}

const prerender = false;
const HEARTBEAT_MS = 25e3;
const PADDING = `:${" ".repeat(2048)}
`;
const LIFETIME_MS = 10 * 6e4;
const GET = async (astro) => {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return new Response(null, { status: 401, headers: { "Cache-Control": "no-store" } });
  const encoder = new TextEncoder();
  let stop = () => {
  };
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      let last = "";
      const send = (text) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(text));
        } catch {
          stop();
        }
      };
      const push = (version2) => {
        if (version2 === last) return;
        last = version2;
        send(`event: v
data: ${version2}

`);
      };
      send(`${PADDING}retry: 3000

`);
      const unsubscribe = onGuildVersion(id, push);
      const unsubscribeTickets = onTicketSignal(id, (stamp) => send(`event: tk
data: ${stamp}

`));
      const forget = openLiveStream({ id: new URL(astro.request.url).searchParams.get("c"), userId: String(auth.session.userId ?? ""), guildId: id, userAgent: astro.request.headers.get("user-agent") });
      const heartbeat = setInterval(() => send(`event: hb
data: ${Date.now()}

`), HEARTBEAT_MS);
      const lifetime = setTimeout(() => {
        stop();
        try {
          controller.close();
        } catch {
        }
      }, LIFETIME_MS);
      stop = () => {
        if (closed) return;
        closed = true;
        unsubscribe();
        unsubscribeTickets();
        forget();
        clearInterval(heartbeat);
        clearTimeout(lifetime);
      };
      astro.request.signal?.addEventListener?.("abort", () => stop());
      const version = await guildVersion(id);
      if (!last) last = version;
      send(`event: hello
data: ${last}

`);
    },
    cancel() {
      stop();
    }
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-store, no-transform",
      "X-Accel-Buffering": "no"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
