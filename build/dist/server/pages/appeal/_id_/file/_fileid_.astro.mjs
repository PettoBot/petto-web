import { l as loadSite } from '../../../../chunks/appealSite_SuoN-UBP.mjs';
import { b as callPettoAppealFile } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const GET = async (astro) => {
  const site = await loadSite(astro);
  if ("redirect" in site || "status" in site) return new Response("Not found", { status: 404 });
  if (!site.session) return new Response("Unauthorized", { status: 401 });
  const fileId = String(astro.params.fileId ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(fileId)) return new Response("Not found", { status: 404 });
  const response = await callPettoAppealFile(astro, site.id, String(site.session.userId), { fileId });
  if (!response || !response.ok) return new Response("Not found", { status: response?.status === 404 ? 404 : 502 });
  return new Response(await response.arrayBuffer(), { headers: {
    "Content-Type": response.headers.get("Content-Type") ?? "application/octet-stream",
    "Content-Disposition": response.headers.get("Content-Disposition") ?? "attachment",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; sandbox",
    "Cache-Control": "private, no-store"
  } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
