import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../../../utils/dashAuth';
import { callFeedbackCard, currentVote, getPost, setVote, tooMany } from '../../../../utils/feedback';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

/** Like (1) or dislike (-1) a post. Pressing the same one again takes the vote back. */
export const POST: APIRoute = async (context) => {
  const { request, url, params } = context;
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return new Response('Forbidden', { status: 403 });
  const session = await getDashboardSession(context);
  if (!session) return json({ ok: false, error: 'login' }, 401);
  const id = Number(params.id);
  const body: any = await request.json().catch(() => null);
  const value = Number(body?.value);
  if (![1, -1].includes(value)) return json({ ok: false, error: 'invalid' }, 400);
  if (tooMany(session.userId, 'vote')) return json({ ok: false, error: 'rate' }, 429);
  const post = await getPost(context, id);
  if (!post) return json({ ok: false, error: 'not_found' }, 404);

  const before = await currentVote(context, id, session.userId);
  const next = before === value ? 0 : value;
  if (!(await setVote(context, id, session.userId, next))) return json({ ok: false, error: 'unavailable' }, 503);
  const fresh = (await getPost(context, id)) ?? post;
  const refresh = callFeedbackCard(context, { action: 'update', post: fresh });
  const wait = (context.locals as any)?.runtime?.ctx?.waitUntil;
  if (typeof wait === 'function') wait.call((context.locals as any).runtime.ctx, refresh);
  return json({ ok: true, vote: next, up: fresh.votes_up, down: fresh.votes_down });
};
