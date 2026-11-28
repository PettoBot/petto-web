import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { s as sessionAnswer } from '../../chunks/navAccount_CB9ntmtH.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
  let session = null;
  try {
    session = await getDashboardSession(context);
  } catch {
    session = null;
  }
  return new Response(JSON.stringify(sessionAnswer(session)), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", Vary: "Cookie" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
