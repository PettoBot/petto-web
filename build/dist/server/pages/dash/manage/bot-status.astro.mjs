import { g as getDashboardSession } from '../../../chunks/dashAuth_uqFK7-ED.mjs';
import { c as canManageGuild } from '../../../chunks/discord_CxeBz2tv.mjs';
import { b as getCachedUserGuilds, i as invalidateBotGuildCaches, g as getCachedBotGuildIds } from '../../../chunks/discordCache_CnRINZ-g.mjs';
import { g as getEnv } from '../../../chunks/env_WnBvzCjc.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const GET = async (context) => {
  const session = await getDashboardSession(context);
  if (!session) return json({ error: "login" }, 401);
  const id = String(new URL(context.request.url).searchParams.get("id") ?? "");
  if (!/^\d{15,25}$/.test(id)) return json({ error: "id" }, 400);
  const botToken = getEnv(context, "DISCORD_TOKEN");
  if (!botToken) return json({ error: "not configured" }, 503);
  const guilds = await getCachedUserGuilds(session.accessToken, context.request, { forAccess: true }).catch(() => null);
  const mine = (guilds ?? []).find((guild) => String(guild.id) === id);
  if (!mine || !canManageGuild(mine)) return json({ error: "forbidden" }, 403);
  const response = await fetch(`https://discord.com/api/v10/guilds/${id}`, { headers: { Authorization: `Bot ${botToken}` }, signal: AbortSignal.timeout(5e3) }).catch(() => null);
  if (!response?.ok) return json({ joined: false, active: false });
  invalidateBotGuildCaches(botToken);
  const ids = await getCachedBotGuildIds(botToken).catch(() => null);
  return json({ joined: true, active: Boolean(ids?.has(id)) });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
