import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { G as callPettoMemberSearch } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { m as memberAvatarUrl } from '../../../../chunks/memberNames_skiCoAs8.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const GET = async (astro) => {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return json({ members: [] }, 401);
  const query = String(new URL(astro.request.url).searchParams.get("q") ?? "").slice(0, 32);
  const found = await callPettoMemberSearch(astro, id, String(auth.session.userId), query);
  return json({ members: found.map((member) => ({ id: member.id, username: member.username, displayName: member.displayName, avatar: memberAvatarUrl(member.id, member, 32) })) });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
