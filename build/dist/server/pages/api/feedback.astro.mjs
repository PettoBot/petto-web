import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { j as readPost, t as tooMany, k as createPost, c as callFeedbackCard, l as saveDiscordMessage } from '../../chunks/feedback_CYIQ_tXr.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
const POST = async (context) => {
  const { request, url, redirect } = context;
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return new Response("Forbidden", { status: 403 });
  const wantsJson = (request.headers.get("accept") ?? "").includes("application/json");
  const form = await request.formData();
  const back = (query) => redirect(`/feedback/new?${query}`, 303);
  const fail = (code, status, errors) => wantsJson ? json({ ok: false, error: code, errors }, status) : back(`error=${code}`);
  const session = await getDashboardSession(context);
  if (!session) return wantsJson ? json({ ok: false, error: "login" }, 401) : redirect("/feedback/login?next=/feedback/new", 303);
  if (String(form.get("website") ?? "") !== "") return wantsJson ? json({ ok: true }) : redirect("/feedback", 303);
  const parsed = readPost(form);
  if (!parsed.ok) return fail("invalid", 422, parsed.errors);
  if (tooMany(session.userId, "post")) return fail("rate", 429);
  const post = await createPost(context, { userId: session.userId, username: session.username, avatar: session.avatar }, parsed.post);
  if (!post) return fail("unavailable", 503);
  const publish = callFeedbackCard(context, { action: "publish", post }).then((sent) => sent ? saveDiscordMessage(context, post.id, sent.channelId, sent.messageId) : void 0);
  const wait = context.locals?.runtime?.ctx?.waitUntil;
  if (typeof wait === "function") wait.call(context.locals.runtime.ctx, publish);
  else await publish;
  return wantsJson ? json({ ok: true, id: post.id }) : redirect(`/feedback/${post.id}?new=1`, 303);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
