import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { F as callPettoLockdown } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const POST = async (astro) => {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return json({ ok: false, message: "Sign in again." }, 401);
  const body = await astro.request.json().catch(() => null);
  const op = body?.op === "start" ? "start" : body?.op === "end" ? "end" : "";
  if (!op) return json({ ok: false, message: "That is not something I can do." }, 400);
  const result = await callPettoLockdown(astro, id, String(auth.session.userId), { op, reason: String(body?.reason ?? "").slice(0, 300), minutes: Math.max(0, Math.min(10080, Math.floor(Number(body?.minutes)) || 0)) });
  return json(result, result.ok ? 200 : 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
