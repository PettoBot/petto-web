export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoFeeds, type FeedsRoute } from '../../../../utils/pettoBotApi';
import { getDashLang } from '../../../../i18n/dash';
import { canUseFeeds } from '../../../../utils/feedsAccess';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
const ROUTES: FeedsRoute[] = ['resolve', 'search', 'create', 'update', 'delete', 'test', 'preview'];

/** What the Feeds page asks while it is open: look up an account, follow it, change or stop a feed, a test notice and the card preview. The bot does the real checks. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!canUseFeeds(astro, auth.session.userId)) return json({ ok: false, error: 'no_access' }, 403);
  const body = await astro.request.json().catch(() => null);
  const route = String(body?.action ?? '') as FeedsRoute;
  if (!body || !ROUTES.includes(route)) return json({ ok: false, error: 'unknown_action' }, 400);
  const { action: _action, user_id: _user, ...rest } = body as Record<string, unknown>;
  const answer = await callPettoFeeds(astro, id, auth.session.userId, route, rest, getDashLang(astro));
  if (!answer.data) return json({ ok: false, error: 'bot_unavailable', message: '' }, 502);
  // A word with several meanings (a feed of pictures: `rosa` is a flower, a color or a mountain). resolve and create answer 409, update 400: the page
  // always gets 409 with the choices to show, and sends the one picked again as the account (create) or `every` (update).
  if (answer.data.error === 'ambiguous') {
    const choices = (Array.isArray(answer.data.choices) ? answer.data.choices : [])
      .filter((choice: any) => choice && typeof choice.account === 'string' && choice.account.trim())
      .slice(0, 10)
      .map((choice: any) => ({ key: String(choice.key ?? '').slice(0, 40), label: String(choice.label || choice.account).slice(0, 100), account: String(choice.account).slice(0, 200) }));
    return json({ ok: false, error: 'ambiguous', word: String(answer.data.word ?? '').slice(0, 40), choices, message: typeof answer.data.message === 'string' ? answer.data.message : '' }, 409);
  }
  return json(answer.data, answer.status || (answer.ok ? 200 : 502));
};
