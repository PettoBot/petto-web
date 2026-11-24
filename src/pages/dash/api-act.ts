export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { callPettoCeramos } from '../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' } });

/** Make (`action=create`) or remove (`action=remove`) a key of the read-only API. A person only touches their own keys; the bot checks it. A new key is returned once. */
export const POST: APIRoute = async (astro) => {
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'forbidden' }, 403);
  const session = await getDashboardSession(astro);
  if (!session) return json({ ok: false, error: 'not_found' }, 404);
  const action = astro.url.searchParams.get('action');
  if (action !== 'create' && action !== 'remove') return json({ ok: false, error: 'bad_request' }, 400);
  let body: any = null;
  try { body = await astro.request.json(); } catch { /* the check below answers */ }
  if (!body || typeof body !== 'object') return json({ ok: false, error: 'bad_request' }, 400);
  const done = await callPettoCeramos(astro, session.userId, action === 'create' ? 'api-key-create' : 'api-key-remove', body);
  if (done.down) return json({ ok: false, error: 'down' }, 503);
  return json({ ok: done.ok, error: done.data?.error, key: done.data?.key }, done.ok ? 200 : 400);
};
