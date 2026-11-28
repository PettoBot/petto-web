import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { i as isPettoOwner } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { _ as sendPettoShopFile, e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store" } });
const MAX_BYTES = 768 * 1024;
const ACTIONS = { pack: "admin/pack", "pack-active": "admin/pack-active", item: "admin/item", "item-active": "admin/item-active", override: "admin/override", "override-reset": "admin/override-reset" };
const POST = async (astro) => {
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: "forbidden" }, 403);
  const session = await getDashboardSession(astro);
  if (!session || !isPettoOwner(astro, session.userId)) return json({ ok: false, error: "not_found" }, 404);
  const action = astro.url.searchParams.get("action") ?? "";
  if (action === "item-file" || action === "override-image") {
    const bytes = await astro.request.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > MAX_BYTES) return json({ ok: false, error: bytes.byteLength ? "file_too_big" : "file_required" }, 400);
    const id = String(astro.url.searchParams.get("id") ?? "");
    const query = { id };
    if (action === "item-file") query.kind = String(astro.url.searchParams.get("kind") ?? "");
    const done2 = await sendPettoShopFile(astro, session.userId, action === "item-file" ? "admin/item-file" : "admin/override-image", query, bytes);
    if (done2.down) return json({ ok: false, error: "down" }, 503);
    return json({ ok: done2.ok, error: done2.data?.error ?? done2.data?.reason }, done2.ok ? 200 : 400);
  }
  const route = ACTIONS[action];
  if (!route) return json({ ok: false, error: "bad_request" }, 400);
  let body = null;
  try {
    body = await astro.request.json();
  } catch {
  }
  if (!body || typeof body !== "object") return json({ ok: false, error: "bad_request" }, 400);
  const done = await callPettoCeramos(astro, session.userId, route, body);
  if (done.down) return json({ ok: false, error: "down" }, 503);
  return json({ ok: done.ok, created: done.data?.created, id: done.data?.id, error: done.data?.error ?? done.data?.reason }, done.ok ? 200 : 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
