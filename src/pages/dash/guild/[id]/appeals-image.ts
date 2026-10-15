export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoAppealImage } from '../../../../utils/pettoBotApi';
import { UPLOAD_KINDS } from '../../../../utils/appeals';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const MAX_UPLOAD = 5 * 1024 * 1024;

async function check(astro: any) {
  const { id } = astro.params as { id: string };
  const result = await getGuildSession(astro, id);
  const kind = new URL(astro.request.url).searchParams.get('kind') ?? '';
  if ('redirect' in result) return { error: json({ ok: false, error: 'unauthorized' }, 401) };
  if (!(UPLOAD_KINDS as readonly string[]).includes(kind)) return { error: json({ ok: false, error: 'unknown_kind' }, 404) };
  return { id, kind, userId: String(result.session.userId) };
}
async function relay(response: Response | null) {
  if (!response) return json({ ok: false, error: 'not_configured' }, 503);
  return new Response(await response.text(), { status: response.status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

// The dashboard uploads a picture of the appeal page (the person has to manage the server) and removes it.
export const POST: APIRoute = async (astro) => {
  const checked = await check(astro);
  if ('error' in checked) return checked.error;
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'invalid' }, 403);
  if (Number(astro.request.headers.get('content-length') ?? 0) > MAX_UPLOAD) return json({ ok: false, error: 'file_too_big' }, 413);
  const bytes = await astro.request.arrayBuffer();
  if (bytes.byteLength > MAX_UPLOAD) return json({ ok: false, error: 'file_too_big' }, 413);
  return relay(await callPettoAppealImage(astro, checked.id, checked.kind, { method: 'POST', body: bytes, contentType: astro.request.headers.get('content-type') ?? 'application/octet-stream', userId: checked.userId }));
};

export const DELETE: APIRoute = async (astro) => {
  const checked = await check(astro);
  if ('error' in checked) return checked.error;
  const origin = astro.request.headers.get('origin');
  if (origin && origin !== astro.url.origin) return json({ ok: false, error: 'invalid' }, 403);
  return relay(await callPettoAppealImage(astro, checked.id, checked.kind, { method: 'DELETE', userId: checked.userId }));
};
