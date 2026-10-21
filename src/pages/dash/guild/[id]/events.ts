export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { guildVersion, onGuildVersion } from '../../../../utils/guildVersion';
import { openLiveStream } from '../../../../utils/liveClients';
import { onTicketSignal } from '../../../../utils/ticketSignals';

// A beat now and then keeps the connection open through Cloudflare (which closes one that says nothing for 100 s) and the proxy. It is an
// event the page sees (a comment line is not), so a page that hears nothing for a while knows the stream is held back and polls instead.
const HEARTBEAT_MS = 25_000;
// Some proxies hold a response back until a few kilobytes have arrived: the first write is padded past that.
const PADDING = `:${' '.repeat(2048)}\n`;
// The stream ends after a while and the browser opens it again by itself: the session is checked again then.
const LIFETIME_MS = 10 * 60_000;

/**
 * The change stamp of a server, pushed as it changes (Server-Sent Events): `event: hello` with the current stamp as soon as the page
 * connects, `event: v` with the stamp each time something the dashboard shows changes, `event: tk` when the bot says the tickets of the
 * server changed (only while someone looks at its live tickets, see ticketSignals.ts), and `event: hb` every 25 seconds. The open page reads itself again only then (see DashGuildLayout.astro). Node build only; the
 * Worker answers 204 and the page asks `version` every 12 seconds instead.
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
      // Said at once, before anything is awaited, so the headers and the first bytes leave now.
      send(`${PADDING}retry: 3000\n\n`);
      const unsubscribe = onGuildVersion(id, push);
      const unsubscribeTickets = onTicketSignal(id, (stamp) => send(`event: tk\ndata: ${stamp}\n\n`));
      const forget = openLiveStream({ id: new URL(astro.request.url).searchParams.get('c'), userId: String(auth.session.userId ?? ''), guildId: id, userAgent: astro.request.headers.get('user-agent') });
      const heartbeat = setInterval(() => send(`event: hb\ndata: ${Date.now()}\n\n`), HEARTBEAT_MS);
      const lifetime = setTimeout(() => { stop(); try { controller.close(); } catch { /* already closed */ } }, LIFETIME_MS);
      stop = () => {
        if (closed) return;
        closed = true;
        unsubscribe();
        unsubscribeTickets();
        forget();
        clearInterval(heartbeat);
        clearTimeout(lifetime);
      };
      astro.request.signal?.addEventListener?.('abort', () => stop());
      const version = await guildVersion(id);
      // `last` may already hold a newer stamp heard while the first one was read.
      if (!last) last = version;
      send(`event: hello\ndata: ${last}\n\n`);
    },
    cancel() { stop(); },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
};
