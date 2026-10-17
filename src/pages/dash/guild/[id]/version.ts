export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { guildVersion } from '../../../../utils/guildVersion';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** The change stamp of a server (see guildVersion.ts): what an open page asks every 15 seconds when it cannot keep `events` open. */
export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ v: null }, 401);
  return json({ v: await guildVersion(id) });
};
