export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoCards } from '../../../../utils/pettoBotApi';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const MAX_UPLOAD = 5 * 1024 * 1024;

async function session(astro: any, id: string) {
  const result = await getGuildSession(astro, id);
  return 'redirect' in result ? null : result.session;
}

/** Hands the bot's answer back as it is: JSON stays JSON and a picture stays a picture. */
async function relay(response: Response | null) {
  if (!response) return json({ ok: false, error: 'not_configured' }, 503);
  const type = response.headers.get('content-type') ?? 'application/json';
  const headers: Record<string, string> = { 'Content-Type': type, 'Cache-Control': response.headers.get('cache-control') ?? 'no-store' };
  const problems = response.headers.get('x-card-problems');
  if (problems) headers['X-Card-Problems'] = problems;
  const look = response.headers.get('x-card-look');
  if (look) headers['X-Card-Look'] = look;
  return new Response(await response.arrayBuffer(), { status: response.status, headers });
}

export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const user = await session(astro, id);
  if (!user) return json({ ok: false, error: 'unauthorized' }, 401);
  const asset = new URL(astro.request.url).searchParams.get('asset');
  if (asset) {
    if (!/^\d{1,18}$/.test(asset)) return json({ ok: false, error: 'not_found' }, 404);
    return relay(await callPettoCards(astro, id, String(user.userId), `/assets/${asset}`));
  }
  return relay(await callPettoCards(astro, id, String(user.userId), ''));
};

export const POST: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const user = await session(astro, id);
  if (!user) return json({ ok: false, error: 'unauthorized' }, 401);
  const url = new URL(astro.request.url);
  const userId = String(user.userId);

  if (url.searchParams.get('upload') !== null) {
    const length = Number(astro.request.headers.get('content-length') ?? 0);
    if (length > MAX_UPLOAD) return json({ ok: false, error: 'file_too_big' }, 413);
    const type = astro.request.headers.get('content-type') ?? '';
    const bytes = await astro.request.arrayBuffer();
    if (bytes.byteLength > MAX_UPLOAD) return json({ ok: false, error: 'file_too_big' }, 413);
    return relay(await callPettoCards(astro, id, userId, `/assets?name=${encodeURIComponent(url.searchParams.get('name') ?? 'image')}`, { method: 'POST', body: bytes, contentType: type }));
  }

  const body = await astro.request.json().catch(() => null);
  if (!body || typeof body !== 'object') return json({ ok: false, error: 'bad_request' }, 400);
  if ((body as any).action === 'preview') return relay(await callPettoCards(astro, id, userId, '/preview', { method: 'POST', body: JSON.stringify({ data: (body as any).data }) }));
  if ((body as any).action === 'normalize') return relay(await callPettoCards(astro, id, userId, '/normalize', { method: 'POST', body: JSON.stringify({ data: (body as any).data }) }));
  if ((body as any).action === 'delete_asset') {
    const asset = String((body as any).id ?? '');
    if (!/^\d{1,18}$/.test(asset)) return json({ ok: false, error: 'not_found' }, 404);
    return relay(await callPettoCards(astro, id, userId, `/assets/${asset}`, { method: 'DELETE' }));
  }
  return relay(await callPettoCards(astro, id, userId, '', { method: 'POST', body: JSON.stringify(body) }));
};
