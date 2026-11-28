import { l as loadGlobalHistory } from '../../chunks/globalStatsHistory_B1qMHU20.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ locals }) => {
  const history = await loadGlobalHistory({ locals });
  return new Response(JSON.stringify(history), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": history.source === "none" ? "no-store" : "public, max-age=60, s-maxage=300" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
