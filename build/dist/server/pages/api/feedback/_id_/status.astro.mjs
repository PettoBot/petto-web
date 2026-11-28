import { g as getDashboardSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getPost, i as isStaff, c as callFeedbackCard, b as deletePost, e as isStatus, s as setStatus, a as addComment } from '../../../../chunks/feedback_CYIQ_tXr.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const POST = async (context) => {
  const { request, url, params, redirect } = context;
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return new Response("Forbidden", { status: 403 });
  const id = Number(params.id);
  const session = await getDashboardSession(context);
  if (!session) return redirect(`/feedback/login?next=/feedback/${id}`, 303);
  const post = await getPost(context, id);
  if (!post) return redirect("/feedback", 303);
  const form = await request.formData();
  const staff = await isStaff(context, session.userId);
  const action = String(form.get("action") ?? "status");
  if (action === "delete") {
    if (!staff && post.user_id !== session.userId) return new Response("Forbidden", { status: 403 });
    await callFeedbackCard(context, { action: "remove", post });
    await deletePost(context, id);
    return redirect("/feedback?deleted=1", 303);
  }
  if (!staff) return new Response("Forbidden", { status: 403 });
  const status = String(form.get("status") ?? "");
  if (!isStatus(status)) return redirect(`/feedback/${id}?error=invalid`, 303);
  const note = String(form.get("note") ?? "");
  const changed = await setStatus(context, id, status, note);
  if (!changed) return redirect(`/feedback/${id}?error=unavailable`, 303);
  if (note.trim()) await addComment(context, id, { userId: session.userId, username: session.username, avatar: session.avatar }, `Status: ${status.replace("_", " ")}. ${note.trim()}`.slice(0, 1e3), true);
  const refresh = callFeedbackCard(context, { action: "update", post: await getPost(context, id) ?? changed });
  const wait = context.locals?.runtime?.ctx?.waitUntil;
  if (typeof wait === "function") wait.call(context.locals.runtime.ctx, refresh);
  else await refresh;
  return redirect(`/feedback/${id}?updated=1`, 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
