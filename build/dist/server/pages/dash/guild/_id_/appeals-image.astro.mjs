import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { d as callPettoAppealImage } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { U as UPLOAD_KINDS } from '../../../../chunks/appeals_OSuSBkCm.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const MAX_UPLOAD = 5 * 1024 * 1024;
async function check(astro) {
  const { id } = astro.params;
  const result = await getGuildSession(astro, id);
  const kind = new URL(astro.request.url).searchParams.get("kind") ?? "";
  if ("redirect" in result) return { error: json({ ok: false, error: "unauthorized" }, 401) };
  if (!UPLOAD_KINDS.includes(kind)) return { error: json({ ok: false, error: "unknown_kind" }, 404) };
  return { id, kind, userId: String(result.session.userId) };
}
async function relay(response) {
  if (!response) return json({ ok: false, error: "not_configured" }, 503);
  return new Response(await response.text(), { status: response.status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
}
const POST = async (astro) => {
  const checked = await check(astro);
  if ("error" in checked) return checked.error;
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: "invalid" }, 403);
  if (Number(astro.request.headers.get("content-length") ?? 0) > MAX_UPLOAD) return json({ ok: false, error: "file_too_big" }, 413);
  const bytes = await astro.request.arrayBuffer();
  if (bytes.byteLength > MAX_UPLOAD) return json({ ok: false, error: "file_too_big" }, 413);
  return relay(await callPettoAppealImage(astro, checked.id, checked.kind, { method: "POST", body: bytes, contentType: astro.request.headers.get("content-type") ?? "application/octet-stream", userId: checked.userId }));
};
const DELETE = async (astro) => {
  const checked = await check(astro);
  if ("error" in checked) return checked.error;
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: "invalid" }, 403);
  return relay(await callPettoAppealImage(astro, checked.id, checked.kind, { method: "DELETE", userId: checked.userId }));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
