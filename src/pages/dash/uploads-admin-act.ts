export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { isPettoOwner } from '../../utils/premiumAdmin';
import { callPettoCeramos, fetchPettoPendingUpload } from '../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' } });

/** The review of the own pictures. Only the owner; anybody else gets a plain 404. POST: approve, reject, take down, block or unblock. GET `?file=<id>`: the picture waiting for review. */
export const POST: APIRoute = async (astro) => {
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'forbidden' }, 403);
  const session = await getDashboardSession(astro);
  if (!session || !isPettoOwner(astro, session.userId)) return json({ ok: false, error: 'not_found' }, 404);
  let body: any = null;
  try { body = await astro.request.json(); } catch { /* the check below answers */ }
  if (!body || typeof body !== 'object') return json({ ok: false, error: 'bad_request' }, 400);
  const done = await callPettoCeramos(astro, session.userId, 'admin/upload-review', body);
  if (done.down) return json({ ok: false, error: 'down' }, 503);
  return json({ ok: done.ok, error: done.data?.error }, done.ok ? 200 : 400);
};

export const GET: APIRoute = async (astro) => {
  const session = await getDashboardSession(astro);
  if (!session || !isPettoOwner(astro, session.userId)) return new Response('Not found', { status: 404 });
  const file = await fetchPettoPendingUpload(astro, session.userId, astro.url.searchParams.get('file') ?? '');
  if (!file) return new Response('Not found', { status: 404 });
  return new Response(file.bytes, { headers: { 'content-type': file.type, 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff' } });
};
