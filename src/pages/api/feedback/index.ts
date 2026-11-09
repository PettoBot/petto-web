import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../../utils/dashAuth';
import { callFeedbackCard, createPost, readPost, saveDiscordMessage, tooMany } from '../../../utils/feedback';

export const prerender = false;

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

/** A new post of the board. The person has to be logged in with Discord. */
export const POST: APIRoute = async (context) => {
  const { request, url, redirect } = context;
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return new Response('Forbidden', { status: 403 });
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const form = await request.formData();
  const back = (query: string) => redirect(`/feedback/new?${query}`, 303);
  const fail = (code: string, status: number, errors?: Record<string, string>) => (wantsJson ? json({ ok: false, error: code, errors }, status) : back(`error=${code}`));

  const session = await getDashboardSession(context);
  if (!session) return wantsJson ? json({ ok: false, error: 'login' }, 401) : redirect('/feedback/login?next=/feedback/new', 303);
  // A hidden field that only automated form fillers fill in.
  if (String(form.get('website') ?? '') !== '') return wantsJson ? json({ ok: true }) : redirect('/feedback', 303);
  const parsed = readPost(form);
  if (!parsed.ok) return fail('invalid', 422, parsed.errors);
  if (tooMany(session.userId, 'post')) return fail('rate', 429);

  const post = await createPost(context, { userId: session.userId, username: session.username, avatar: session.avatar }, parsed.post);
  if (!post) return fail('unavailable', 503);

  // The post is also published in the Petto server. If the feedback bot is not there, the board still works.
  const publish = callFeedbackCard(context, { action: 'publish', post }).then((sent) => (sent ? saveDiscordMessage(context, post.id, sent.channelId, sent.messageId) : undefined));
  const wait = (context.locals as any)?.runtime?.ctx?.waitUntil;
  if (typeof wait === 'function') wait.call((context.locals as any).runtime.ctx, publish); else await publish;
  return wantsJson ? json({ ok: true, id: post.id }) : redirect(`/feedback/${post.id}?new=1`, 303);
};
