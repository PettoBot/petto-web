export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoFeeds, type FeedsRoute } from '../../../../utils/pettoBotApi';
import { getDashLang } from '../../../../i18n/dash';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const ROUTES: FeedsRoute[] = ['resolve', 'create', 'update', 'delete', 'test', 'preview'];

/** What the Feeds page asks while it is open: look up an account, follow it, change or stop a feed, a test notice and the card preview. The bot does the real checks. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, error: 'unauthorized' }, 401);
  const body = await astro.request.json().catch(() => null);
  const route = String(body?.action ?? '') as FeedsRoute;
  if (!body || !ROUTES.includes(route)) return json({ ok: false, error: 'unknown_action' }, 400);
  const { action: _action, user_id: _user, ...rest } = body as Record<string, unknown>;
  const answer = await callPettoFeeds(astro, id, auth.session.userId, route, rest, getDashLang(astro));
  if (!answer.data) return json({ ok: false, error: 'bot_unavailable', message: '' }, 502);
  return json(answer.data, answer.status || (answer.ok ? 200 : 502));
};
