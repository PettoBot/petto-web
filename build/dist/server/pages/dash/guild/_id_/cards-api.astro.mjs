import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { r as callPettoCards } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const MAX_UPLOAD = 5 * 1024 * 1024;
async function session(astro, id) {
  const result = await getGuildSession(astro, id);
  return "redirect" in result ? null : result.session;
}
async function relay(response) {
  if (!response) return json({ ok: false, error: "not_configured" }, 503);
  const type = response.headers.get("content-type") ?? "application/json";
  const headers = { "Content-Type": type, "Cache-Control": response.headers.get("cache-control") ?? "no-store" };
  const problems = response.headers.get("x-card-problems");
  if (problems) headers["X-Card-Problems"] = problems;
  const look = response.headers.get("x-card-look");
  if (look) headers["X-Card-Look"] = look;
  return new Response(await response.arrayBuffer(), { status: response.status, headers });
}
const GET = async (astro) => {
  const { id } = astro.params;
  const user = await session(astro, id);
  if (!user) return json({ ok: false, error: "unauthorized" }, 401);
  const params = new URL(astro.request.url).searchParams;
  if (params.has("designs")) return relay(await callPettoCards(astro, id, String(user.userId), "/designs"));
  const design = params.get("design");
  if (design) {
    const size = params.get("size") === "full" ? "full" : "thumb";
    if (!/^[a-z0-9-]{3,30}$/.test(design)) return json({ ok: false, error: "not_found" }, 404);
    return relay(await callPettoCards(astro, id, String(user.userId), `/designs/${design}/${size}`));
  }
  const asset = params.get("asset");
  if (asset) {
    if (!/^\d{1,18}$/.test(asset)) return json({ ok: false, error: "not_found" }, 404);
    return relay(await callPettoCards(astro, id, String(user.userId), `/assets/${asset}`));
  }
  return relay(await callPettoCards(astro, id, String(user.userId), ""));
};
const POST = async (astro) => {
  const { id } = astro.params;
  const user = await session(astro, id);
  if (!user) return json({ ok: false, error: "unauthorized" }, 401);
  const url = new URL(astro.request.url);
  const userId = String(user.userId);
  if (url.searchParams.get("upload") !== null) {
    const length = Number(astro.request.headers.get("content-length") ?? 0);
    if (length > MAX_UPLOAD) return json({ ok: false, error: "file_too_big" }, 413);
    const type = astro.request.headers.get("content-type") ?? "";
    const bytes = await astro.request.arrayBuffer();
    if (bytes.byteLength > MAX_UPLOAD) return json({ ok: false, error: "file_too_big" }, 413);
    return relay(await callPettoCards(astro, id, userId, `/assets?name=${encodeURIComponent(url.searchParams.get("name") ?? "image")}`, { method: "POST", body: bytes, contentType: type }));
  }
  const body = await astro.request.json().catch(() => null);
  if (!body || typeof body !== "object") return json({ ok: false, error: "bad_request" }, 400);
  if (body.action === "preview") return relay(await callPettoCards(astro, id, userId, "/preview", { method: "POST", body: JSON.stringify({ data: body.data }) }));
  if (body.action === "normalize") return relay(await callPettoCards(astro, id, userId, "/normalize", { method: "POST", body: JSON.stringify({ data: body.data }) }));
  if (body.action === "delete_asset") {
    const asset = String(body.id ?? "");
    if (!/^\d{1,18}$/.test(asset)) return json({ ok: false, error: "not_found" }, 404);
    return relay(await callPettoCards(astro, id, userId, `/assets/${asset}`, { method: "DELETE" }));
  }
  return relay(await callPettoCards(astro, id, userId, "", { method: "POST", body: JSON.stringify(body) }));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
