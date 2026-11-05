export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { getBotGuildList } from '../../utils/discordCache';
import { getEnv } from '../../utils/env';
import { isPettoOwner } from '../../utils/premiumAdmin';
import { pageOwnerServers } from '../../utils/dashSwitcher.mjs';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' } });

/**
 * For the Petto owner only (the "All servers (owner)" part of the server sheet): the servers the bot is in, one page at a time, optionally
 * filtered by `q` (name or ID). Reads the same cached list as /dash/admin/servers. Anyone else gets a plain 404, with nothing read.
 */
export const GET: APIRoute = async (astro) => {
  const session = await getDashboardSession(astro);
  if (!session || !isPettoOwner(astro, session.userId)) return json({ error: 'not_found' }, 404);
  const botToken = getEnv(astro, 'DISCORD_TOKEN');
  if (!botToken) return json({ error: 'unavailable' }, 503);
  let list: Awaited<ReturnType<typeof getBotGuildList>>;
  try {
    list = await getBotGuildList(botToken);
  } catch {
    return json({ error: 'unavailable' }, 503);
  }
  const params = astro.url.searchParams;
  return json(pageOwnerServers(list, { q: params.get('q'), offset: params.get('offset'), limit: params.get('limit') }));
};
