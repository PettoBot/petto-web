export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoResync } from '../../../../utils/pettoBotApi';
import { forgetGuildSnapshot, noteGuildWrite } from '../../../../utils/guildSnapshots';
import { deferGuildChange } from '../../../../utils/serverTiming';
import { bumpGuildVersion } from '../../../../utils/guildVersion';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** The "Sync server data" button: the bot saves its copy of the server now and the lists are read again from Discord for a moment, so a new role or channel shows up. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, message: 'Sign in again.' }, 401);
  const result = await callPettoResync(astro, id, String(auth.session.userId));
  // The bot saved its copy: the next page reads that one. Only when it could not (an older bot) are the lists read from Discord for a
  // moment (every page read from Discord is slow and counts against its rate limit, so that is not done when it is not needed).
  if (result.ok) forgetGuildSnapshot(id);
  else noteGuildWrite(id);
  // The open pages of the server (this one too) read themselves again: the stamp is raised when this answer goes out.
  if (!deferGuildChange(id)) await bumpGuildVersion(id).catch(() => '');
  return json({ ok: true, saved: result.ok }, 200);
};
