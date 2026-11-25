export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../../utils/dashAuth';
import { canManageGuild } from '../../../utils/discord';
import { getCachedBotGuildIds, getCachedUserGuilds, invalidateBotGuildCaches } from '../../../utils/discordCache';
import { getEnv } from '../../../utils/env';

// "Did Petto join the server I just invited it to?", asked every few seconds by the invite buttons of the dashboard (DashServerSheet.astro) after one was pressed.
// It asks Discord itself (the bot is a member of the server or not) instead of waiting for the saved list of servers, which is kept for minutes; when the bot is
// there it drops those lists, so the page of the server opens at once. Only for a server the person manages.
const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const GET: APIRoute = async (context) => {
  const session = await getDashboardSession(context);
  if (!session) return json({ error: 'login' }, 401);
  const id = String(new URL(context.request.url).searchParams.get('id') ?? '');
  if (!/^\d{15,25}$/.test(id)) return json({ error: 'id' }, 400);
  const botToken = getEnv(context, 'DISCORD_TOKEN');
  if (!botToken) return json({ error: 'not configured' }, 503);

  const guilds = await getCachedUserGuilds(session.accessToken, context.request, { forAccess: true }).catch(() => null);
  const mine = (guilds ?? []).find((guild: any) => String(guild.id) === id);
  if (!mine || !canManageGuild(mine)) return json({ error: 'forbidden' }, 403);

  const response = await fetch(`https://discord.com/api/v10/guilds/${id}`, { headers: { Authorization: `Bot ${botToken}` }, signal: AbortSignal.timeout(5000) }).catch(() => null);
  if (!response?.ok) return json({ joined: false, active: false });

  // Joined. The bot saves its copy of the server a few seconds later, and the dashboard opens the server from that copy: active is true only when it is there.
  invalidateBotGuildCaches(botToken);
  const ids = await getCachedBotGuildIds(botToken).catch(() => null);
  return json({ joined: true, active: Boolean(ids?.has(id)) });
};
