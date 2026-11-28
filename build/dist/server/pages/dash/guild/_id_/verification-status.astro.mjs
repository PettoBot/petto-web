import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { V as callPettoVerificationJob } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const GET = async (astro) => {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return json({ ok: false, error: "unauthorized" }, 401);
  const result = await callPettoVerificationJob(astro, id, String(auth.session.userId));
  if (result.down) return json({ ok: false, error: "bot_unavailable", message: "", retry: true }, 502);
  return json(result, result.ok ? 200 : 502);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
