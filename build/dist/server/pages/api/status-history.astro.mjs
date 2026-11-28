import { g as getStatusHistory } from '../../chunks/statusHistory_BHKFqBBT.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ locals }) => {
  const history = await getStatusHistory({ locals });
  return new Response(JSON.stringify(history), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": history.available ? "public, max-age=30, s-maxage=60, stale-while-revalidate=300" : "no-store"
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
