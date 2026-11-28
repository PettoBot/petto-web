import { g as getDashboardSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getPost, r as readComment, t as tooMany, a as addComment, i as isStaff, c as callFeedbackCard } from '../../../../chunks/feedback_CYIQ_tXr.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const POST = async (context) => {
  const { request, url, params, redirect } = context;
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return new Response("Forbidden", { status: 403 });
  const id = Number(params.id);
  const session = await getDashboardSession(context);
  if (!session) return redirect(`/feedback/login?next=/feedback/${id}`, 303);
  const form = await request.formData();
  const back = (query = "") => redirect(`/feedback/${id}${query}#comments`, 303);
  const post = await getPost(context, id);
  if (!post) return redirect("/feedback", 303);
  if (String(form.get("website") ?? "") !== "") return back();
  const body = readComment(form.get("body"));
  if (!body) return back("?error=empty");
  if (tooMany(session.userId, "comment")) return back("?error=rate");
  const created = await addComment(context, id, { userId: session.userId, username: session.username, avatar: session.avatar }, body, await isStaff(context, session.userId));
  if (!created) return back("?error=unavailable");
  const fresh = await getPost(context, id) ?? post;
  const refresh = callFeedbackCard(context, { action: "update", post: fresh });
  const wait = context.locals?.runtime?.ctx?.waitUntil;
  if (typeof wait === "function") wait.call(context.locals.runtime.ctx, refresh);
  return back("?commented=1");
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
