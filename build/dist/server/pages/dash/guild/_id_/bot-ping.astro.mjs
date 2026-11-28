import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { p as pingPettoBot } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const GET = async (astro) => {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return new Response(JSON.stringify({ up: true }), { status: 401, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  return new Response(JSON.stringify({ up: await pingPettoBot(astro) }), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
