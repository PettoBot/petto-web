export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { callPettoCeramos } from '../../utils/pettoBotApi';
import { isPettoOwner } from '../../utils/premiumAdmin';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' } });

/**
 * Give ceramos (`action=grant`, the owner and the people the owner listed) or change the settings (`action=settings`, only the owner). The bot checks who is asking and what is
 * sent (the person, the amount, the limits); this only passes it on.
 */
export const POST: APIRoute = async (astro) => {
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'forbidden' }, 403);
  const session = await getDashboardSession(astro);
  if (!session) return json({ ok: false, error: 'not_found' }, 404);
  const action = astro.url.searchParams.get('action');
  if (action !== 'grant' && action !== 'settings') return json({ ok: false, error: 'bad_request' }, 400);
  if (action === 'settings' && !isPettoOwner(astro, session.userId)) return json({ ok: false, error: 'not_found' }, 404);
  let body: any = null;
  try { body = await astro.request.json(); } catch { /* the check below answers */ }
  if (!body || typeof body !== 'object') return json({ ok: false, error: 'bad_request' }, 400);
  const done = await callPettoCeramos(astro, session.userId, action === 'grant' ? 'admin/grant' : 'admin/grant-settings', body);
  if (done.down) return json({ ok: false, error: 'down' }, 503);
  const result = done.data?.result ?? done.data;
  return json({ ok: Boolean(done.ok && result?.ok), error: result?.error ?? done.data?.error, max: result?.max, left: result?.left, balance: result?.balance }, done.ok && result?.ok ? 200 : 400);
};
