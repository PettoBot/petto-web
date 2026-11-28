import { l as loadSite } from '../../../../../chunks/appealSite_SuoN-UBP.mjs';
import { F as FILE_LIMITS } from '../../../../../chunks/appeals_OSuSBkCm.mjs';
import { b as callPettoAppealFile } from '../../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" } });
async function open(astro) {
  const site = await loadSite(astro);
  if ("redirect" in site || "status" in site) return { error: json({ ok: false, error: "not_found" }, 404) };
  if (!site.session) return { error: json({ ok: false, error: "unauthorized" }, 401) };
  const formId = Number(astro.params.fid);
  if (!Number.isInteger(formId)) return { error: json({ ok: false, error: "not_found" }, 404) };
  const origin = astro.request.headers.get("origin");
  if (origin && origin !== astro.url.origin) return { error: json({ ok: false, error: "invalid" }, 403) };
  return { site, formId, userId: String(site.session.userId) };
}
const POST = async (astro) => {
  const found = await open(astro);
  if ("error" in found) return found.error;
  const { site, formId, userId } = found;
  const question = String(astro.url.searchParams.get("q") ?? "");
  if (!/^[a-z0-9_-]{1,24}$/i.test(question)) return json({ ok: false, error: "unknown_question" }, 400);
  if (Number(astro.request.headers.get("content-length") ?? 0) > FILE_LIMITS.bytes + 1024) return json({ ok: false, error: "too_big" }, 413);
  const bytes = await astro.request.arrayBuffer();
  if (bytes.byteLength > FILE_LIMITS.bytes) return json({ ok: false, error: "too_big" }, 413);
  const response = await callPettoAppealFile(astro, site.id, userId, { method: "POST", query: { form_id: formId, question_id: question, name: String(astro.url.searchParams.get("name") ?? "file").slice(0, 120) }, body: bytes });
  if (!response) return json({ ok: false, error: "bot_unavailable" }, 503);
  return new Response(await response.text(), { status: response.status, headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" } });
};
const DELETE = async (astro) => {
  const found = await open(astro);
  if ("error" in found) return found.error;
  const { site, userId } = found;
  const fileId = String(astro.url.searchParams.get("file") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(fileId)) return json({ ok: false, error: "not_found" }, 404);
  const response = await callPettoAppealFile(astro, site.id, userId, { method: "DELETE", fileId });
  if (!response) return json({ ok: false, error: "bot_unavailable" }, 503);
  return new Response(await response.text(), { status: response.status, headers: { "Content-Type": "application/json", "Cache-Control": "private, no-store" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
