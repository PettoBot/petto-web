export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { guildVersion, onGuildVersion } from '../../../../utils/guildVersion';

// A comment line now and then keeps the connection open through Cloudflare (which closes one that says nothing for 100 s) and the proxy.
const HEARTBEAT_MS = 25_000;
// The stream ends after a while and the browser opens it again by itself: the session is checked again then.
const LIFETIME_MS = 10 * 60_000;

/**
 * The change stamp of a server, pushed as it changes (Server-Sent Events): `event: v` with the stamp when the page connects and each time
 * something the dashboard shows changes. The open page reads itself again only then (see DashGuildLayout.astro). Node build only; the
 * Worker answers 204 and the page asks `version` every 15 seconds instead.
 */
export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return new Response(null, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  if (!__NODE_TARGET__) return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });

  const encoder = new TextEncoder();
  let stop = () => {};
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      let last = '';
      const send = (text: string) => {
        if (closed) return;
        try { controller.enqueue(encoder.encode(text)); } catch { stop(); }
      };
      const push = (version: string) => {
        if (version === last) return;
        last = version;
        send(`event: v\ndata: ${version}\n\n`);
      };
      const unsubscribe = onGuildVersion(id, push);
      const heartbeat = setInterval(() => send(': hb\n\n'), HEARTBEAT_MS);
      const lifetime = setTimeout(() => { stop(); try { controller.close(); } catch { /* already closed */ } }, LIFETIME_MS);
      stop = () => {
        if (closed) return;
        closed = true;
        unsubscribe();
        clearInterval(heartbeat);
        clearTimeout(lifetime);
      };
      astro.request.signal?.addEventListener?.('abort', () => stop());
      send('retry: 3000\n\n');
      push(await guildVersion(id));
    },
    cancel() { stop(); },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
};
