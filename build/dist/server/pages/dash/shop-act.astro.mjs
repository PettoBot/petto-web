import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store" } });
const ACTIONS = /* @__PURE__ */ new Set(["buy-item", "buy-pack", "wear"]);
const POST = async (astro) => {
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: "forbidden" }, 403);
  const session = await getDashboardSession(astro);
  if (!session) return json({ ok: false, error: "logged_out" }, 401);
  let body = null;
  try {
    body = await astro.request.json();
  } catch {
  }
  const action = typeof body?.action === "string" ? body.action : "";
  if (!ACTIONS.has(action)) return json({ ok: false, error: "bad_request" }, 400);
  const payload = {};
  if (body.kind === "banner" || body.kind === "font") payload.kind = body.kind;
  if (typeof body.id === "string") payload.id = body.id.slice(0, 40);
  else if (body.id === null) payload.id = null;
  const done = await callPettoCeramos(astro, session.userId, action, payload);
  if (done.down) return json({ ok: false, error: "down" }, 503);
  if (!done.ok) return json({ ok: false, error: done.data?.error ?? "failed" }, done.data?.error === "rate_limited" ? 429 : 502);
  const state = await callPettoCeramos(astro, session.userId, "state");
  return json({ ok: true, result: done.data.result, state: state.ok ? state.data : null });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
