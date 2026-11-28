import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { I as callPettoLiftSanction } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const POST = async (astro) => {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return json({ ok: false, message: "Sign in again." }, 401);
  const body = await astro.request.json().catch(() => null);
  const caseNumber = Number(body?.case);
  if (!Number.isInteger(caseNumber) || caseNumber < 1) return json({ ok: false, message: "That is not a case." }, 400);
  const result = await callPettoLiftSanction(astro, id, String(auth.session.userId), caseNumber, String(body?.reason ?? "").slice(0, 300));
  return json(result, result.ok ? 200 : 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
