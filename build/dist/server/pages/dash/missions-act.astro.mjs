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
  let body = {};
  try {
    body = await astro.request.json();
  } catch {
  }
  const id = typeof body?.id === "string" ? body.id : void 0;
  const done = await callPettoCeramos(astro, session.userId, "missions-claim", id ? { id } : {});
  if (done.down) return json({ ok: false, error: "down" }, 503);
  return json({ ok: done.ok, error: done.data?.error, total: done.data?.total, balance: done.data?.balance }, done.ok ? 200 : 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
