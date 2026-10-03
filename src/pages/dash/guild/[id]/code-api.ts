export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';
import { callPettoCode } from '../../../../utils/pettoBotApi';
import { canUseCodeCommands } from '../../../../utils/codeAccess';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

async function who(astro: any, id: string) {
  const result = await getGuildSession(astro, id);
  if ('redirect' in result) return null;
  return canUseCodeCommands(astro, result.session.userId) ? result.session : null;
}

/** What the editor of commands in code asks for. The bot does the real checks, this only passes them on for a person who manages the server. */
export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const session = await who(astro, id);
  if (!session) return json({ ok: false, error: 'unauthorized' }, 401);
  const answer = await callPettoCode(astro, id, session.userId, 'meta');
  return json(answer.payload ?? { ok: false, error: 'bot_unavailable' }, answer.ok ? 200 : answer.status);
};

export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const session = await who(astro, id);
  if (!session) return json({ ok: false, error: 'unauthorized' }, 401);
  const body = await astro.request.json().catch(() => ({}));
  const action = String(body.action ?? '');

  if (action === 'delete') {
    const apiUrl = getEnv(astro, 'PETTO_BOT_API_URL');
    const apiKey = getEnv(astro, 'PETTO_BOT_API_SECRET');
    const name = String(body.name ?? '').toLowerCase();
    if (!apiUrl || !apiKey || !/^[a-z0-9_-]{1,32}$/.test(name)) return json({ ok: false, error: 'invalid' }, 400);
    const res = await fetch(`${apiUrl}/rest/v1/custom_commands?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}`, { method: 'DELETE', headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}`, Prefer: 'return=minimal' } });
    return json({ ok: res.ok }, res.ok ? 200 : 502);
  }

  if (!['check', 'test', 'save', 'trigger'].includes(action)) return json({ ok: false, error: 'unknown_action' }, 400);
  const { action: _ignored, user_id: _user, ...rest } = body;
  const answer = await callPettoCode(astro, id, session.userId, action as any, rest);
  return json(answer.payload ?? { ok: false, error: 'bot_unavailable' }, answer.status || 502);
};
