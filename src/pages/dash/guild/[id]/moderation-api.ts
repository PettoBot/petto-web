export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoLiftSanction } from '../../../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** The "Lift" button of the active sanctions: the bot lifts the ban, the mute or the jail of that case. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, message: 'Sign in again.' }, 401);
  const body: any = await astro.request.json().catch(() => null);
  const caseNumber = Number(body?.case);
  if (!Number.isInteger(caseNumber) || caseNumber < 1) return json({ ok: false, message: 'That is not a case.' }, 400);
  const result = await callPettoLiftSanction(astro, id, String(auth.session.userId), caseNumber, String(body?.reason ?? '').slice(0, 300));
  return json(result, result.ok ? 200 : 400);
};
