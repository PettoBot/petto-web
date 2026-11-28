import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { i as isPettoOwner } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { $ as fetchPettoPendingBadge, a0 as fetchPettoPendingUpload, e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store" } });
const POST = async (astro) => {
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: "forbidden" }, 403);
  const session = await getDashboardSession(astro);
  if (!session || !isPettoOwner(astro, session.userId)) return json({ ok: false, error: "not_found" }, 404);
  let body = null;
  try {
    body = await astro.request.json();
  } catch {
  }
  if (!body || typeof body !== "object") return json({ ok: false, error: "bad_request" }, 400);
  const done = await callPettoCeramos(astro, session.userId, body.kind === "badge" ? "admin/own-badge-review" : "admin/upload-review", body);
  if (done.down) return json({ ok: false, error: "down" }, 503);
  return json({ ok: done.ok, error: done.data?.error }, done.ok ? 200 : 400);
};
const GET = async (astro) => {
  const session = await getDashboardSession(astro);
  if (!session || !isPettoOwner(astro, session.userId)) return new Response("Not found", { status: 404 });
  const badge = astro.url.searchParams.get("badge");
  const file = badge ? await fetchPettoPendingBadge(astro, session.userId, badge, astro.url.searchParams.get("slot") ?? "") : await fetchPettoPendingUpload(astro, session.userId, astro.url.searchParams.get("file") ?? "");
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(file.bytes, { headers: { "content-type": file.type, "cache-control": "private, no-store", "x-content-type-options": "nosniff" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
