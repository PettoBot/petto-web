import { g as getDashboardSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { t as tooMany, g as getPost, f as currentVote, h as setVote, c as callFeedbackCard } from '../../../../chunks/feedback_CYIQ_tXr.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
const POST = async (context) => {
  const { request, url, params } = context;
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return new Response("Forbidden", { status: 403 });
  const session = await getDashboardSession(context);
  if (!session) return json({ ok: false, error: "login" }, 401);
  const id = Number(params.id);
  const body = await request.json().catch(() => null);
  const value = Number(body?.value);
  if (![1, -1].includes(value)) return json({ ok: false, error: "invalid" }, 400);
  if (tooMany(session.userId, "vote")) return json({ ok: false, error: "rate" }, 429);
  const post = await getPost(context, id);
  if (!post) return json({ ok: false, error: "not_found" }, 404);
  const before = await currentVote(context, id, session.userId);
  const next = before === value ? 0 : value;
  if (!await setVote(context, id, session.userId, next)) return json({ ok: false, error: "unavailable" }, 503);
  const fresh = await getPost(context, id) ?? post;
  const refresh = callFeedbackCard(context, { action: "update", post: fresh });
  const wait = context.locals?.runtime?.ctx?.waitUntil;
  if (typeof wait === "function") wait.call(context.locals.runtime.ctx, refresh);
  return json({ ok: true, vote: next, up: fresh.votes_up, down: fresh.votes_down });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
