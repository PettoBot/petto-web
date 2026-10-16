export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoResync } from '../../../../utils/pettoBotApi';
import { noteGuildWrite } from '../../../../utils/guildSnapshots';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** The "Sync server data" button: the bot saves its copy of the server now and the lists are read again from Discord for a moment, so a new role or channel shows up. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, message: 'Sign in again.' }, 401);
  // Even if the bot cannot save its copy (an older bot), the next page reads the lists from Discord itself.
  noteGuildWrite(id);
  const result = await callPettoResync(astro, id, String(auth.session.userId));
  noteGuildWrite(id);
  return json({ ok: true, saved: result.ok }, 200);
};
