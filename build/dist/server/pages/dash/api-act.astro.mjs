import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store" } });
const POST = async (astro) => {
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: "forbidden" }, 403);
  const session = await getDashboardSession(astro);
  if (!session) return json({ ok: false, error: "not_found" }, 404);
  const action = astro.url.searchParams.get("action");
  if (action !== "create" && action !== "remove") return json({ ok: false, error: "bad_request" }, 400);
  let body = null;
  try {
    body = await astro.request.json();
  } catch {
  }
  if (!body || typeof body !== "object") return json({ ok: false, error: "bad_request" }, 400);
  const done = await callPettoCeramos(astro, session.userId, action === "create" ? "api-key-create" : "api-key-remove", body);
  if (done.down) return json({ ok: false, error: "down" }, 503);
  return json({ ok: done.ok, error: done.data?.error, key: done.data?.key }, done.ok ? 200 : 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
