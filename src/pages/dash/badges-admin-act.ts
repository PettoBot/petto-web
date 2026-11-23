export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { isPettoOwner } from '../../utils/premiumAdmin';
import { callPettoCeramos, sendPettoBadgeImage } from '../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' } });
const MAX_BYTES = 256 * 1024;

/**
 * The editor of badges (/dash/badges-admin): save a badge, take it off sale or put it back, and send its picture. Only the Petto owner; anybody else gets a plain 404 and
 * nothing is sent to the bot. The bot checks the owner again and checks everything that is sent (the picture by its first bytes, the names, the dates, the price).
 */
export const POST: APIRoute = async (astro) => {
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'forbidden' }, 403);
  const session = await getDashboardSession(astro);
  if (!session || !isPettoOwner(astro, session.userId)) return json({ ok: false, error: 'not_found' }, 404);
  const action = astro.url.searchParams.get('action');
  if (action === 'image') {
    const bytes = await astro.request.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > MAX_BYTES) return json({ ok: false, error: bytes.byteLength ? 'image_too_big' : 'image_required' }, 400);
    const done = await sendPettoBadgeImage(astro, session.userId, String(astro.url.searchParams.get('id') ?? ''), bytes);
    if (done.down) return json({ ok: false, error: 'down' }, 503);
    return json({ ok: done.ok, error: done.data?.error ?? done.data?.reason }, done.ok ? 200 : 400);
  }
  let body: any = null;
  try { body = await astro.request.json(); } catch { /* the check below answers */ }
  if (!body || typeof body !== 'object') return json({ ok: false, error: 'bad_request' }, 400);
  if (action !== 'save' && action !== 'active') return json({ ok: false, error: 'bad_request' }, 400);
  const done = await callPettoCeramos(astro, session.userId, action === 'save' ? 'admin/badge' : 'admin/badge-active', body);
  if (done.down) return json({ ok: false, error: 'down' }, 503);
  return json({ ok: done.ok, created: done.data?.created, id: done.data?.id, error: done.data?.error ?? done.data?.reason }, done.ok ? 200 : 400);
};
