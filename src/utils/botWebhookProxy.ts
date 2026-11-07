import { getEnv } from './env';

// The bot's web server is only on the private network of the host (it has no public address of its own), so the votes of the lists
// (omniplex.gg, top.gg) reach the website and the website hands them to the bot. The bytes of the body are passed on untouched (the
// lists sign the raw body) together with the headers that carry the signature, and the answer of the bot goes back to the list as it is.
const FORWARDED_HEADERS = ['content-type', 'x-webhook-protocol', 'x-webhook-signature', 'authorization', 'x-topgg-signature'];
const MAX_BODY_BYTES = 100 * 1024;
const ANSWER_TIMEOUT_MS = 8_000;

export async function forwardToBot(context: { request: Request; locals?: unknown }, path: '/webhooks/omniplex' | '/webhooks/topgg'): Promise<Response> {
  const base = getEnv(context as { locals?: never }, 'PETTO_BOT_API_URL');
  if (!base) return new Response('The bot cannot be reached from here.', { status: 503 });

  const body = new Uint8Array(await context.request.arrayBuffer());
  if (body.byteLength > MAX_BODY_BYTES) return new Response('The body is too large.', { status: 413 });

  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = context.request.headers.get(name);
    if (value) headers.set(name, value);
  }
  headers.set('user-agent', 'petto-web-webhook-forward');

  try {
    const answer = await fetch(`${base}${path}`, { method: 'POST', headers, body, signal: AbortSignal.timeout(ANSWER_TIMEOUT_MS) });
    return new Response(await answer.arrayBuffer(), { status: answer.status, headers: { 'content-type': answer.headers.get('content-type') ?? 'text/plain' } });
  } catch {
    return new Response('The bot did not answer.', { status: 502 });
  }
}
