import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { i as isPettoOwner } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store" } });
const POST = async (astro) => {
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: "forbidden" }, 403);
  const session = await getDashboardSession(astro);
  if (!session) return json({ ok: false, error: "not_found" }, 404);
  const action = astro.url.searchParams.get("action");
  if (action !== "grant" && action !== "settings") return json({ ok: false, error: "bad_request" }, 400);
  if (action === "settings" && !isPettoOwner(astro, session.userId)) return json({ ok: false, error: "not_found" }, 404);
  let body = null;
  try {
    body = await astro.request.json();
  } catch {
  }
  if (!body || typeof body !== "object") return json({ ok: false, error: "bad_request" }, 400);
  const done = await callPettoCeramos(astro, session.userId, action === "grant" ? "admin/grant" : "admin/grant-settings", body);
  if (done.down) return json({ ok: false, error: "down" }, 503);
  const result = done.data?.result ?? done.data;
  return json({ ok: Boolean(done.ok && result?.ok), error: result?.error ?? done.data?.error, max: result?.max, left: result?.left, balance: result?.balance }, done.ok && result?.ok ? 200 : 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
