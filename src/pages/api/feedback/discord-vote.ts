import type { APIRoute } from 'astro';
import { getEnv } from '../../../utils/env';
import { currentVote, getPost, setVote, tooMany } from '../../../utils/feedback';

export const prerender = false;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

// Constant-time comparison so the secret cannot be guessed from how long the answer takes.
function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * A like or dislike button pressed in the Petto server, sent by the feedback bot. It counts as the vote of that person, the same one
 * they would give on the website. Pressing the same button again takes the vote back, and the other button changes it. `value` 0 takes
 * the vote back (older versions of the bot sent it when a reaction was removed).
 */
export const POST: APIRoute = async (context) => {
  const secret = getEnv(context, 'FEEDBACK_BOT_SECRET');
  const given = context.request.headers.get('x-feedback-secret') ?? '';
  if (!secret || !same(given, secret)) return json({ ok: false, error: 'unauthorized' }, 401);
  const body: any = await context.request.json().catch(() => null);
  const postId = Number(body?.postId);
  const userId = String(body?.userId ?? '');
  const value = Number(body?.value);
  if (!/^\d{15,25}$/.test(userId) || ![1, -1, 0].includes(value) || !Number.isSafeInteger(postId)) return json({ ok: false, error: 'invalid' }, 400);
  if (tooMany(userId, 'vote')) return json({ ok: false, error: 'rate' }, 429);
  const post = await getPost(context, postId);
  if (!post) return json({ ok: false, error: 'not_found' }, 404);
  const before = await currentVote(context, postId, userId);
  let vote = value;
  if (body?.toggle === true && value === before) vote = 0;
  // Taking a reaction back only removes the vote if it is the same kind (taking back a like does not erase a dislike).
  if (value === 0 && body?.toggle !== true) {
    const was = Number(body?.was);
    if (![1, -1].includes(was) || before !== was) return json({ ok: true, up: post.votes_up, down: post.votes_down, vote: before, post });
  }
  if (!(await setVote(context, postId, userId, vote))) return json({ ok: false, error: 'unavailable' }, 503);
  const fresh = (await getPost(context, postId)) ?? post;
  return json({ ok: true, up: fresh.votes_up, down: fresh.votes_down, vote, post: fresh });
};
