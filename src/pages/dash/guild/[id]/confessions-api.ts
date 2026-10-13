export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoConfessionPanel } from '../../../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** The button of the confessions page: the bot posts (or updates) the panel with the "Confess" button in the channel now. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, message: 'Sign in again.' }, 401);
  const body: any = await astro.request.json().catch(() => null);
  const channelId = String(body?.channel_id ?? '').trim();
  const result = await callPettoConfessionPanel(astro, id, String(auth.session.userId), /^\d{15,25}$/.test(channelId) ? channelId : null);
  return json(result, result.ok ? 200 : 400);
};
