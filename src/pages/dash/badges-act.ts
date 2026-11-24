export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { callPettoCeramos } from '../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' } });
const ACTIONS = new Set(['daily', 'buy', 'upgrade', 'identity', 'showcase']);

/**
 * The actions of the page of badges (/dash/badges): claim the daily ceramos, buy a badge, give it a better frame, turn a free badge on or off, save the showcase.
 * The person is the one of the login (never one the page names); the bot decides and does it with the same code as its commands, and the answer carries the new
 * state so the page redraws. A request that comes from another site is refused.
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
  if (typeof body.badge === 'string') payload.badge = body.badge.slice(0, 40);
  if (typeof body.enabled === 'boolean') payload.enabled = body.enabled;
  if (Array.isArray(body.badges)) payload.badges = body.badges.filter((id: unknown) => typeof id === 'string').slice(0, 6);
  const done = await callPettoCeramos(astro, session.userId, action as 'daily', payload);
  if (done.down) return json({ ok: false, error: 'down' }, 503);
  if (!done.ok) return json({ ok: false, error: done.data?.error ?? 'failed' }, done.data?.error === 'rate_limited' ? 429 : 502);
  const state = await callPettoCeramos(astro, session.userId, 'state');
  return json({ ok: true, result: done.data.result, state: state.ok ? state.data : null });
};
