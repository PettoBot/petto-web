import { g as getDashboardSession } from '../../../chunks/dashAuth_uqFK7-ED.mjs';
import { f as fetchPettoBadgeArt } from '../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async (astro) => {
  const session = await getDashboardSession(astro);
  if (!session) return new Response("Not found", { status: 404 });
  const art = await fetchPettoBadgeArt(astro, String(astro.params.id ?? ""));
  if (!art) return new Response("Not found", { status: 404 });
  return new Response(art.bytes, { headers: { "content-type": art.type, "cache-control": "private, max-age=300", "x-content-type-options": "nosniff" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
