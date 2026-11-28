import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store" } });
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
  const action = body?.action;
  if (action === "save") {
    const done = await callPettoCeramos(astro, session.userId, "rank-card-save", { settings: body.settings ?? {} });
    if (done.down) return json({ ok: false, error: "down" }, 503);
    if (!done.ok) return json({ ok: false, error: done.data?.error ?? "failed" }, done.data?.error === "rate_limited" ? 429 : 502);
    const state = await callPettoCeramos(astro, session.userId, "rank-card");
    return json({ ok: true, result: done.data.result, state: state.ok ? state.data : null });
  }
  if (action === "reset") {
    const done = await callPettoCeramos(astro, session.userId, "rank-card-reset");
    if (done.down) return json({ ok: false, error: "down" }, 503);
    if (!done.ok) return json({ ok: false, error: "failed" }, 502);
    const state = await callPettoCeramos(astro, session.userId, "rank-card");
    return json({ ok: true, state: state.ok ? state.data : null });
  }
  if (action === "claim" && typeof body.id === "string") {
    const done = await callPettoCeramos(astro, session.userId, "buy-item", { kind: "banner", id: body.id.slice(0, 40) });
    if (done.down) return json({ ok: false, error: "down" }, 503);
    return json({ ok: done.ok, result: done.data?.result ?? null });
  }
  return json({ ok: false, error: "bad_request" }, 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
