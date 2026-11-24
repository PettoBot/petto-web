export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { callPettoCeramos, sendPettoUpload } from '../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' } });

/**
 * Own picture of the rank card: `action=policy` (accept the policy), `action=submit` (send a picture: the body is the file, 1 MB at most) and `action=use` (put it as the
 * background of the rank card). The bot checks the plan, the policy, the block and the picture; nothing is drawn until the team approves it.
 */
export const POST: APIRoute = async (astro) => {
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'forbidden' }, 403);
  const session = await getDashboardSession(astro);
  if (!session) return json({ ok: false, error: 'not_found' }, 404);
  const action = astro.url.searchParams.get('action');
  if (action === 'policy') {
    const done = await callPettoCeramos(astro, session.userId, 'upload-policy', {});
    return done.down ? json({ ok: false, error: 'down' }, 503) : json({ ok: done.ok, error: done.data?.error }, done.ok ? 200 : 400);
  }
  if (action === 'submit') {
    const declared = Number(astro.request.headers.get('content-length') ?? 0);
    if (declared > 1_048_576 + 1024) return json({ ok: false, error: 'too_big' }, 413);
    const bytes = await astro.request.arrayBuffer();
    if (bytes.byteLength > 1_048_576) return json({ ok: false, error: 'too_big' }, 413);
    const done = await sendPettoUpload(astro, session.userId, bytes);
    if (done.down) return json({ ok: false, error: 'down' }, 503);
    return json({ ok: done.ok, error: done.data?.error, reasons: done.data?.reasons }, done.ok ? 200 : 400);
  }
  if (action === 'use') {
    const state = await callPettoCeramos(astro, session.userId, 'rank-card');
    if (!state.ok) return json({ ok: false, error: state.down ? 'down' : 'failed' }, state.down ? 503 : 502);
    const done = await callPettoCeramos(astro, session.userId, 'rank-card-save', { settings: { ...(state.data.settings ?? {}), background: 'upload:own' } });
    return done.down ? json({ ok: false, error: 'down' }, 503) : json({ ok: done.ok, error: done.data?.error }, done.ok ? 200 : 400);
  }
  return json({ ok: false, error: 'bad_request' }, 400);
};
