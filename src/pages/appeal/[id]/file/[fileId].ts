export const prerender = false;
import type { APIRoute } from 'astro';
import { loadSite } from '../../../../utils/appealSite';
import { callPettoAppealFile } from '../../../../utils/pettoBotApi';

// A file of the member (one they added to an answer, or sent with an appeal): only they can read it, the bot checks it again.
export const GET: APIRoute = async (astro) => {
  const site = await loadSite(astro);
  if ('redirect' in site || 'status' in site) return new Response('Not found', { status: 404 });
  if (!site.session) return new Response('Unauthorized', { status: 401 });
  const fileId = String(astro.params.fileId ?? '');
  if (!/^[0-9a-f-]{36}$/i.test(fileId)) return new Response('Not found', { status: 404 });
  const response = await callPettoAppealFile(astro, site.id, String(site.session.userId), { fileId });
  if (!response || !response.ok) return new Response('Not found', { status: response?.status === 404 ? 404 : 502 });
  // The bot has already put the safe headers (type, nosniff, sandbox); they are kept as they come.
  return new Response(await response.arrayBuffer(), { headers: {
    'Content-Type': response.headers.get('Content-Type') ?? 'application/octet-stream',
    'Content-Disposition': response.headers.get('Content-Disposition') ?? 'attachment',
    'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox", 'Cache-Control': 'private, no-store',
  } });
};
