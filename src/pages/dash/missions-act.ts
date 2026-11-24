export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { callPettoCeramos } from '../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' } });

/** Claim one mission (`id`) or every finished one. The bot counts the progress itself and pays once for each period; the page only asks. */
export const POST: APIRoute = async (astro) => {
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'forbidden' }, 403);
  const session = await getDashboardSession(astro);
  if (!session) return json({ ok: false, error: 'not_found' }, 404);
  let body: any = {};
  try { body = await astro.request.json(); } catch { /* claim everything */ }
  const id = typeof body?.id === 'string' ? body.id : undefined;
  const done = await callPettoCeramos(astro, session.userId, 'missions-claim', id ? { id } : {});
  if (done.down) return json({ ok: false, error: 'down' }, 503);
  return json({ ok: done.ok, error: done.data?.error, total: done.data?.total, balance: done.data?.balance }, done.ok ? 200 : 400);
};
