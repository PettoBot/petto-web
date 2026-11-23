export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { isPettoOwner } from '../../utils/premiumAdmin';
import { callPettoCeramos } from '../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' } });

/**
 * Give a plan of a person or end one (/dash/plans-admin). Only the Petto owner; anybody else gets a plain 404 and nothing is sent to the bot. The bot checks the owner again
 * and checks what is sent (the person, the plan, the days).
 */
export const POST: APIRoute = async (astro) => {
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'forbidden' }, 403);
  const session = await getDashboardSession(astro);
  if (!session || !isPettoOwner(astro, session.userId)) return json({ ok: false, error: 'not_found' }, 404);
  const action = astro.url.searchParams.get('action');
  if (action !== 'grant' && action !== 'end') return json({ ok: false, error: 'bad_request' }, 400);
  let body: any = null;
  try { body = await astro.request.json(); } catch { /* the check below answers */ }
  if (!body || typeof body !== 'object') return json({ ok: false, error: 'bad_request' }, 400);
  const done = await callPettoCeramos(astro, session.userId, action === 'grant' ? 'admin/plan-grant' : 'admin/plan-end', body);
  if (done.down) return json({ ok: false, error: 'down' }, 503);
  return json({ ok: done.ok, error: done.data?.error ?? done.data?.reason }, done.ok ? 200 : 400);
};
