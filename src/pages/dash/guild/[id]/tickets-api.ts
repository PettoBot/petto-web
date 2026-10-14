export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoTicketTranscript } from '../../../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** The "Transcript" button of the closed tickets: asks the bot for the signed link of that ticket. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, message: 'Sign in again.' }, 401);
  const body: any = await astro.request.json().catch(() => null);
  const number = Number(body?.number);
  if (body?.action !== 'transcript' || !Number.isInteger(number) || number < 1) return json({ ok: false, message: 'That is not a ticket.' }, 400);
  const result = await callPettoTicketTranscript(astro, id, String(auth.session.userId), number);
  return json(result, result.ok ? 200 : 400);
};
