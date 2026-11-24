export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { callPettoCeramos } from '../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' } });
const ACTIONS = new Set(['buy-item', 'buy-pack', 'wear']);

/**
 * The actions of the pages of name fonts and banners: buy one, buy a whole pack, put one on or take it off. The person is the one of the login (never one the page names);
 * the bot decides and does it with the same code as its commands, and the answer carries the new state so the page redraws. A request from another site is refused.
 */
export const POST: APIRoute = async (astro) => {
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'forbidden' }, 403);
  const session = await getDashboardSession(astro);
  if (!session) return json({ ok: false, error: 'logged_out' }, 401);
  let body: any = null;
  try { body = await astro.request.json(); } catch { /* the check below answers */ }
  const action = typeof body?.action === 'string' ? body.action : '';
  if (!ACTIONS.has(action)) return json({ ok: false, error: 'bad_request' }, 400);
  const payload: Record<string, unknown> = {};
  if (body.kind === 'banner' || body.kind === 'font') payload.kind = body.kind;
  if (typeof body.id === 'string') payload.id = body.id.slice(0, 40);
  else if (body.id === null) payload.id = null;
  const done = await callPettoCeramos(astro, session.userId, action as 'wear', payload);
  if (done.down) return json({ ok: false, error: 'down' }, 503);
  if (!done.ok) return json({ ok: false, error: done.data?.error ?? 'failed' }, done.data?.error === 'rate_limited' ? 429 : 502);
  const state = await callPettoCeramos(astro, session.userId, 'state');
  return json({ ok: true, result: done.data.result, state: state.ok ? state.data : null });
};
