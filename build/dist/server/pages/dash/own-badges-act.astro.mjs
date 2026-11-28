import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos, X as sendPettoOwnBadge } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store" } });
const POST = async (astro) => {
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: "forbidden" }, 403);
  const session = await getDashboardSession(astro);
  if (!session) return json({ ok: false, error: "not_found" }, 404);
  const action = astro.url.searchParams.get("action");
  if (action === "policy") {
    const done = await callPettoCeramos(astro, session.userId, "upload-policy", {});
    return done.down ? json({ ok: false, error: "down" }, 503) : json({ ok: done.ok, error: done.data?.error }, done.ok ? 200 : 400);
  }
  if (action === "submit") {
    const declared = Number(astro.request.headers.get("content-length") ?? 0);
    if (declared > 524288 + 1024) return json({ ok: false, error: "too_big" }, 413);
    const bytes = await astro.request.arrayBuffer();
    if (bytes.byteLength > 524288) return json({ ok: false, error: "too_big" }, 413);
    const done = await sendPettoOwnBadge(astro, session.userId, astro.url.searchParams.get("slot") ?? "", astro.url.searchParams.get("name") ?? "", bytes);
    if (done.down) return json({ ok: false, error: "down" }, 503);
    return json({ ok: done.ok, error: done.data?.error, reasons: done.data?.reasons }, done.ok ? 200 : 400);
  }
  if (action === "remove") {
    const done = await callPettoCeramos(astro, session.userId, "own-badge-remove", { slot: Number(astro.url.searchParams.get("slot")) });
    return done.down ? json({ ok: false, error: "down" }, 503) : json({ ok: done.ok, error: done.data?.error }, done.ok ? 200 : 400);
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
