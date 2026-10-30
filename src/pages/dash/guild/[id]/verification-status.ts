export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoVerificationJob } from '../../../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/**
 * How far the verification job of the server is (set it up, post the panel, switch it on), asked by the verification card every
 * moment while one runs, and whether members can get a verification link. The bot keeps it in memory, so this answers at once.
 */
export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, error: 'unauthorized' }, 401);
  const result = await callPettoVerificationJob(astro, id, String(auth.session.userId));
  if (result.down) return json({ ok: false, error: 'bot_unavailable', message: '', retry: true }, 502);
  return json(result, result.ok ? 200 : 502);
};
