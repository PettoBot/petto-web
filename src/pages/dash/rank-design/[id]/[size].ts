export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../../../utils/dashAuth';
import { fetchPettoDesignFile } from '../../../../utils/pettoBotApi';

/** The picture of one of the designs that come with Petto (a background of the rank card), small or full, for the page "Rank card": the bot has the files; this hands them to a logged-in person. */
export const GET: APIRoute = async (astro) => {
  const session = await getDashboardSession(astro);
  if (!session) return new Response('Not found', { status: 404 });
  const file = await fetchPettoDesignFile(astro, String(astro.params.id ?? ''), String(astro.params.size ?? ''));
  if (!file) return new Response('Not found', { status: 404 });
  return new Response(file.bytes, { headers: { 'content-type': file.type, 'cache-control': 'private, max-age=3600', 'x-content-type-options': 'nosniff' } });
};
