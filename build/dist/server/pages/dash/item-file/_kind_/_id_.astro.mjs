import { g as getDashboardSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { W as fetchPettoItemFile } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const GET = async (astro) => {
  const session = await getDashboardSession(astro);
  if (!session) return new Response("Not found", { status: 404 });
  const file = await fetchPettoItemFile(astro, String(astro.params.kind ?? ""), String(astro.params.id ?? ""));
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(file.bytes, { headers: { "content-type": file.type, "cache-control": "private, max-age=300", "x-content-type-options": "nosniff" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
