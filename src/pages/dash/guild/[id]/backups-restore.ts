import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoVaultRestore } from '../../../../utils/pettoBotApi';
import { backupsUnderMaintenance } from '../../../../utils/maintenance';

export const prerender = false;

// The steps of a restore, asked by the backups page: `?step=status|preview` (GET) and `?step=challenge|start|cancel` (POST).
// The bot decides everything (who may, the human check, one restore at a time); this only carries the question and the answer.
const GET_STEPS = new Set(['status', 'preview']);
const POST_STEPS = new Set(['challenge', 'start', 'cancel']);
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

async function handle(context: Parameters<APIRoute>[0], method: 'GET' | 'POST') {
  const { id } = context.params as { id: string };
  const step = context.url.searchParams.get('step') ?? '';
  if (!(method === 'GET' ? GET_STEPS : POST_STEPS).has(step)) return json({ ok: false, error: 'unknown_step' }, 400);
  // A page of this site is the only one that can ask: the header cannot be sent from another site without being allowed first.
  if (method === 'POST' && context.request.headers.get('x-petto-dash') !== '1') return json({ ok: false, error: 'forbidden' }, 403);
  const auth = await getGuildSession(context, id);
  if ('redirect' in auth) return json({ ok: false, error: 'unauthorized' }, 401);
  if (backupsUnderMaintenance(context, auth.session.userId)) return json({ ok: false, error: 'maintenance' }, 503);

  let body: Record<string, unknown> = {};
  if (method === 'POST') {
    try { body = await context.request.json(); } catch { body = {}; }
  }
  const query: Record<string, string> = {};
  for (const key of ['backup_id', 'mode', 'parts']) { const value = context.url.searchParams.get(key); if (value) query[key] = value; }
  const allowed = step === 'start'
    ? { backup_id: Number(body.backup_id), mode: String(body.mode ?? 'merge'), parts: String(body.parts ?? '').slice(0, 100), challenge_id: String(body.challenge_id ?? ''), answer: String(body.answer ?? '') }
    : {};
  const result = await callPettoVaultRestore(context, id, auth.session.userId, step, { method, query, body: allowed });
  return json(result.payload ?? { ok: false, error: 'bot_unavailable' }, result.ok ? 200 : (result.status >= 400 ? result.status : 502));
}

export const GET: APIRoute = (context) => handle(context, 'GET');
export const POST: APIRoute = (context) => handle(context, 'POST');
