import { g as getServiceStatus } from '../../chunks/serviceStatus_CQG8Q7f5.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ locals }) => {
  const report = await getServiceStatus({ locals });
  return new Response(JSON.stringify(report), { headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
