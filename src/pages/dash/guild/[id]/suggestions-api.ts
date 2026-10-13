export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoSuggestionAnswer } from '../../../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const STATUSES = new Set(['pending', 'approved', 'denied', 'considering', 'implemented']);

/** The buttons of the list of suggestions: approve, deny, consider, implement or reopen one, with a reason. The bot does it right away. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, message: 'Sign in again.' }, 401);
  const body: any = await astro.request.json().catch(() => null);
  const suggestion = String(body?.id ?? '').trim().toLowerCase();
  const status = String(body?.status ?? '');
  if (!/^[a-z0-9]{5}-[a-z0-9]{5}$/.test(suggestion) || !STATUSES.has(status)) return json({ ok: false, message: 'That is not a suggestion or a status.' }, 400);
  const result = await callPettoSuggestionAnswer(astro, id, String(auth.session.userId), suggestion, status, String(body?.reason ?? '').slice(0, 1000));
  return json(result, result.ok ? 200 : 400);
};
