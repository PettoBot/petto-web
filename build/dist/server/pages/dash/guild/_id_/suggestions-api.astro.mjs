import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { R as callPettoSuggestionVotes, S as callPettoSuggestionAnswer } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const STATUSES = /* @__PURE__ */ new Set(["pending", "approved", "denied", "considering", "implemented"]);
const POST = async (astro) => {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return json({ ok: false, message: "Sign in again." }, 401);
  const body = await astro.request.json().catch(() => null);
  const suggestion = String(body?.id ?? "").trim().toLowerCase();
  const status = String(body?.status ?? "");
  if (body?.action === "votes") {
    if (!/^[a-z0-9]{5}-[a-z0-9]{5}$/.test(suggestion)) return json({ ok: false, message: "That is not a suggestion." }, 400);
    const votes = await callPettoSuggestionVotes(astro, id, String(auth.session.userId), suggestion);
    return json(votes, votes.ok ? 200 : 400);
  }
  if (!/^[a-z0-9]{5}-[a-z0-9]{5}$/.test(suggestion) || !STATUSES.has(status)) return json({ ok: false, message: "That is not a suggestion or a status." }, 400);
  const result = await callPettoSuggestionAnswer(astro, id, String(auth.session.userId), suggestion, status, String(body?.reason ?? "").slice(0, 1e3));
  return json(result, result.ok ? 200 : 400);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
