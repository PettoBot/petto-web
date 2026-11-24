export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { callPettoCeramos, sendPettoOwnBadge } from '../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' } });

/**
 * Own badges: `action=policy` (accept the user policy), `action=submit&slot=<1-4>&name=<name>` (the body is the picture, 512 KB at most) and `action=remove&slot=<1-4>`.
 * The bot checks the plan, the policy, the block, the name and the picture; nothing is shown until the team approves it.
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
    if (declared > 524_288 + 1024) return json({ ok: false, error: 'too_big' }, 413);
    const bytes = await astro.request.arrayBuffer();
    if (bytes.byteLength > 524_288) return json({ ok: false, error: 'too_big' }, 413);
    const done = await sendPettoOwnBadge(astro, session.userId, astro.url.searchParams.get('slot') ?? '', astro.url.searchParams.get('name') ?? '', bytes);
    if (done.down) return json({ ok: false, error: 'down' }, 503);
    return json({ ok: done.ok, error: done.data?.error, reasons: done.data?.reasons }, done.ok ? 200 : 400);
  }
  if (action === 'remove') {
    const done = await callPettoCeramos(astro, session.userId, 'own-badge-remove', { slot: Number(astro.url.searchParams.get('slot')) });
    return done.down ? json({ ok: false, error: 'down' }, 503) : json({ ok: done.ok, error: done.data?.error }, done.ok ? 200 : 400);
  }
  return json({ ok: false, error: 'bad_request' }, 400);
};
