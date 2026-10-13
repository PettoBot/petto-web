export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';
import { callPettoVerification } from '../../../../utils/pettoBotApi';
import { ensureGuildRow } from '../../../../utils/ensureGuild';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const ACTIONS = new Set(['setup', 'panel', 'enable', 'disable']);

/** The buttons of the verification card: set it up, post the panel, switch it. Each one is done by the bot right away. */
export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return json({ ok: false, message: 'Sign in again.' }, 401);
  const body: any = await astro.request.json().catch(() => null);
  const action = String(body?.action ?? '');
  if (!ACTIONS.has(action)) return json({ ok: false, message: 'Unknown action.' }, 400);

  // The channel picked in the form is kept before the panel is posted, so the button uses what is on the screen.
  const channelId = String(body?.channel_id ?? '').trim();
  if (action === 'panel' && /^\d{15,25}$/.test(channelId)) {
    const apiUrl = getEnv(astro, 'PETTO_BOT_API_URL');
    const apiKey = getEnv(astro, 'PETTO_BOT_API_SECRET');
    if (apiUrl && apiKey) {
      const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
      await ensureGuildRow(apiUrl, headers, id);
      await fetch(`${apiUrl}/rest/v1/verification_config?on_conflict=guild_id`, { method: 'POST', headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify({ guild_id: id, panel_channel_id: channelId, updated_at: new Date().toISOString() }) }).catch(() => null);
    }
  }
  const result = await callPettoVerification(astro, id, String(auth.session.userId), action as 'setup' | 'panel' | 'enable' | 'disable');
  return json(result, result.ok ? 200 : 400);
};
