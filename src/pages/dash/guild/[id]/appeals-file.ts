export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { callPettoAppealFile } from '../../../../utils/pettoBotApi';

// A file attached to an appeal, for the staff of the server (the person has to manage it; the bot checks it again).
export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const auth = await getGuildSession(astro, id);
  if ('redirect' in auth) return new Response('Unauthorized', { status: 401 });
  const fileId = String(astro.url.searchParams.get('f') ?? '');
  if (!/^[0-9a-f-]{36}$/i.test(fileId)) return new Response('Not found', { status: 404 });
  const response = await callPettoAppealFile(astro, id, String(auth.session.userId), { fileId, staff: true });
  if (!response || !response.ok) return new Response('Not found', { status: response?.status === 403 ? 403 : response?.status === 404 ? 404 : 502 });
  return new Response(await response.arrayBuffer(), { headers: {
    'Content-Type': response.headers.get('Content-Type') ?? 'application/octet-stream',
    'Content-Disposition': response.headers.get('Content-Disposition') ?? 'attachment',
    'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; sandbox", 'Cache-Control': 'private, no-store',
  } });
};
