export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { isPettoOwner } from '../../utils/premiumAdmin';
import { callPettoCeramos, sendPettoShopFile } from '../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'private, no-store' } });
const MAX_BYTES = 768 * 1024;
const ACTIONS = { pack: 'admin/pack', 'pack-active': 'admin/pack-active', item: 'admin/item', 'item-active': 'admin/item-active', override: 'admin/override', 'override-reset': 'admin/override-reset' } as const;

/**
 * The editor of the shop (/dash/shop-admin): save a pack, a banner or a name font, change a badge of the code (its words, colour, price, picture), take things off sale
 * or put them back, and send the files. Only the Petto owner; anybody else gets a plain 404 and nothing is sent to the bot. The bot checks the owner again and checks
 * everything that is sent (the files by their first bytes, the words, the dates, the prices).
 */
export const POST: APIRoute = async (astro) => {
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'forbidden' }, 403);
  const session = await getDashboardSession(astro);
  if (!session || !isPettoOwner(astro, session.userId)) return json({ ok: false, error: 'not_found' }, 404);
  const action = astro.url.searchParams.get('action') ?? '';
  if (action === 'item-file' || action === 'override-image') {
    const bytes = await astro.request.arrayBuffer();
    if (!bytes.byteLength || bytes.byteLength > MAX_BYTES) return json({ ok: false, error: bytes.byteLength ? 'file_too_big' : 'file_required' }, 400);
    const id = String(astro.url.searchParams.get('id') ?? '');
    const query: Record<string, string> = { id };
    if (action === 'item-file') query.kind = String(astro.url.searchParams.get('kind') ?? '');
    const done = await sendPettoShopFile(astro, session.userId, action === 'item-file' ? 'admin/item-file' : 'admin/override-image', query, bytes);
    if (done.down) return json({ ok: false, error: 'down' }, 503);
    return json({ ok: done.ok, error: done.data?.error ?? done.data?.reason }, done.ok ? 200 : 400);
  }
  const route = (ACTIONS as Record<string, string>)[action];
  if (!route) return json({ ok: false, error: 'bad_request' }, 400);
  let body: any = null;
  try { body = await astro.request.json(); } catch { /* the check below answers */ }
  if (!body || typeof body !== 'object') return json({ ok: false, error: 'bad_request' }, 400);
  const done = await callPettoCeramos(astro, session.userId, route as Parameters<typeof callPettoCeramos>[2], body);
  if (done.down) return json({ ok: false, error: 'down' }, 503);
  return json({ ok: done.ok, created: done.data?.created, id: done.data?.id, error: done.data?.error ?? done.data?.reason }, done.ok ? 200 : 400);
};
