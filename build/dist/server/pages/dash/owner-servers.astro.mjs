import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { a as getBotGuildList } from '../../chunks/discordCache_CnRINZ-g.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { i as isPettoOwner } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { p as pageOwnerServers } from '../../chunks/dashSwitcher_BIhzOPcN.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "private, no-store" } });
const GET = async (astro) => {
  const session = await getDashboardSession(astro);
  if (!session || !isPettoOwner(astro, session.userId)) return json({ error: "not_found" }, 404);
  const botToken = getEnv(astro, "DISCORD_TOKEN");
  if (!botToken) return json({ error: "unavailable" }, 503);
  let list;
  try {
    list = await getBotGuildList(botToken);
  } catch {
    return json({ error: "unavailable" }, 503);
  }
  const params = astro.url.searchParams;
  return json(pageOwnerServers(list, { q: params.get("q"), offset: params.get("offset"), limit: params.get("limit") }));
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
