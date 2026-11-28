import { g as getDashboardSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { i as isStaff, g as getPost, d as deleteComment, c as callFeedbackCard } from '../../../../chunks/feedback_CYIQ_tXr.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const POST = async (context) => {
  const { request, url, params, redirect } = context;
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return new Response("Forbidden", { status: 403 });
  const id = Number(params.id);
  const session = await getDashboardSession(context);
  if (!session) return redirect(`/feedback/login?next=/feedback/${id}`, 303);
  if (!await isStaff(context, session.userId)) return new Response("Forbidden", { status: 403 });
  const post = await getPost(context, id);
  if (!post) return redirect("/feedback", 303);
  const form = await request.formData();
  const deleted = await deleteComment(context, id, Number(form.get("comment_id")));
  if (!deleted) return redirect(`/feedback/${id}?error=unavailable#comments`, 303);
  const refresh = callFeedbackCard(context, { action: "update", post: await getPost(context, id) ?? post });
  const wait = context.locals?.runtime?.ctx?.waitUntil;
  if (typeof wait === "function") wait.call(context.locals.runtime.ctx, refresh);
  else await refresh;
  return redirect(`/feedback/${id}?commentDeleted=1#comments`, 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
