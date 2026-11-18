import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../../../utils/dashAuth';
import { callFeedbackCard, deleteComment, getPost, isStaff } from '../../../../utils/feedback';

export const prerender = false;

/** The team deletes a comment of a post. Only the team (the same people who can change the state and delete a post), and only a comment of this post. */
export const POST: APIRoute = async (context) => {
  const { request, url, params, redirect } = context;
  const origin = request.headers.get('origin');
  if (origin && origin !== url.origin) return new Response('Forbidden', { status: 403 });
  const id = Number(params.id);
  const session = await getDashboardSession(context);
  if (!session) return redirect(`/feedback/login?next=/feedback/${id}`, 303);
  if (!(await isStaff(context, session.userId))) return new Response('Forbidden', { status: 403 });
  const post = await getPost(context, id);
  if (!post) return redirect('/feedback', 303);
  const form = await request.formData();
  const deleted = await deleteComment(context, id, Number(form.get('comment_id')));
  if (!deleted) return redirect(`/feedback/${id}?error=unavailable#comments`, 303);
  // The card of the post in Discord shows the number of comments: it is drawn again.
  const refresh = callFeedbackCard(context, { action: 'update', post: (await getPost(context, id)) ?? post });
  const wait = (context.locals as any)?.runtime?.ctx?.waitUntil;
  if (typeof wait === 'function') wait.call((context.locals as any).runtime.ctx, refresh); else await refresh;
  return redirect(`/feedback/${id}?commentDeleted=1#comments`, 303);
};
