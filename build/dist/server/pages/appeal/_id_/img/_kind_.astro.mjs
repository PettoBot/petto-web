import { U as UPLOAD_KINDS, r as resolveGuildId } from '../../../../chunks/appeals_OSuSBkCm.mjs';
import { d as callPettoAppealImage } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
  const kind = String(context.params.kind ?? "");
  if (!UPLOAD_KINDS.includes(kind)) return new Response("Not found", { status: 404 });
  const id = await resolveGuildId(context, String(context.params.id ?? "").toLowerCase());
  if (!id) return new Response("Not found", { status: 404 });
  const response = await callPettoAppealImage(context, id, kind);
  if (!response || !response.ok) return new Response("Not found", { status: response?.status === 404 ? 404 : 502 });
  return new Response(await response.arrayBuffer(), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=300", "X-Content-Type-Options": "nosniff" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
