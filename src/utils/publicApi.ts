// The read-only API (/api/v1/...): the key comes in `Authorization: Bearer petto_...`, the answer is JSON and never cached. Only reads; the keys are made in /dash/api.
import { callPettoPublic } from './pettoBotApi';

const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'access-control-allow-origin': '*', 'x-content-type-options': 'nosniff' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

/** The key of the request, or null. */
export function keyOf(request: Request): string | null {
  const match = /^Bearer\s+(petto_[A-Za-z0-9_-]{43})$/.exec(request.headers.get('authorization') ?? '');
  return match ? match[1] : null;
}

/** Answers a read that needs a key: `me` or `movements`. */
export async function answerWithKey(context: { request: Request; locals?: any }, what: 'me' | 'movements'): Promise<Response> {
  const key = keyOf(context.request);
  if (!key) return json({ ok: false, error: 'missing_or_bad_key' }, 401);
  const done = await callPettoPublic(context, what, key);
  if (done.down) return json({ ok: false, error: 'unavailable' }, 503);
  if (done.ok) { const { ok: _ok, ...rest } = done.data; return json({ ok: true, ...rest }); }
  const error = done.data?.error;
  if (error === 'rate_limited') return json({ ok: false, error }, 429);
  if (error === 'bad_key') return json({ ok: false, error: 'missing_or_bad_key' }, 401);
  return json({ ok: false, error: 'failed' }, 500);
}

export async function answerInfo(context: { request: Request; locals?: any }): Promise<Response> {
  const done = await callPettoPublic(context, 'info');
  if (done.down) return json({ ok: false, error: 'unavailable' }, 503);
  if (!done.ok) return json({ ok: false, error: 'failed' }, 500);
  const { ok: _ok, ...rest } = done.data;
  return json({ ok: true, ...rest });
}
