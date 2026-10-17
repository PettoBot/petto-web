export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { guildVersion } from '../../../../utils/guildVersion';
import { notePoll } from '../../../../utils/liveClients';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/**
 * The change stamp of a server (see guildVersion.ts): what an open page asks every few seconds when it cannot use `events` (`?m=poll`,
 * with its id `c` and why `r`, which the owner's health page counts), and once when a hidden tab comes back.
 */
export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ v: null }, 401);
  const query = new URL(astro.request.url).searchParams;
  if (query.get('m') === 'poll') notePoll({ id: query.get('c'), reason: query.get('r'), userId: String(auth.session.userId ?? ''), guildId: id, userAgent: astro.request.headers.get('user-agent') });
  return json({ v: await guildVersion(id) });
};
