import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { guildVersion } from '../../../../chunks/guildVersion_C-xSL97y.mjs';
import { n as notePoll } from '../../../../chunks/liveClients_BeB2izBu.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const GET = async (astro) => {
  const { id } = astro.params;
  const auth = await getGuildSession(astro, id);
  if ("redirect" in auth) return json({ v: null }, 401);
  const query = new URL(astro.request.url).searchParams;
  if (query.get("m") === "poll") notePoll({ id: query.get("c"), reason: query.get("r"), userId: String(auth.session.userId ?? ""), guildId: id, userAgent: astro.request.headers.get("user-agent") });
  return json({ v: await guildVersion(id) });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
