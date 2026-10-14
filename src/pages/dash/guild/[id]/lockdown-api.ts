export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoLockdown } from '../../../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** The buttons of the lockdown tab: the bot starts or ends the lockdown (administrators only, the bot checks it). */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, message: 'Sign in again.' }, 401);
  const body: any = await astro.request.json().catch(() => null);
  const op = body?.op === 'start' ? 'start' : body?.op === 'end' ? 'end' : '';
  if (!op) return json({ ok: false, message: 'That is not something I can do.' }, 400);
  const result = await callPettoLockdown(astro, id, String(auth.session.userId), { op, reason: String(body?.reason ?? '').slice(0, 300), minutes: Math.max(0, Math.min(10080, Math.floor(Number(body?.minutes)) || 0)) });
  return json(result, result.ok ? 200 : 400);
};
