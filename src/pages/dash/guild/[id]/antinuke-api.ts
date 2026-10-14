export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoAntinukeRestore } from '../../../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** The "Restore" button of the log: the bot puts back what the protection stopped. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, message: 'Sign in again.' }, 401);
  const body: any = await astro.request.json().catch(() => null);
  const event = Number(body?.id);
  if (!Number.isInteger(event) || event < 1) return json({ ok: false, message: 'That is not an event.' }, 400);
  const result = await callPettoAntinukeRestore(astro, id, String(auth.session.userId), event);
  return json(result, result.ok ? 200 : 400);
};
