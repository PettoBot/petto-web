export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../../utils/dashAuth';
import { fetchPettoBadgeArt } from '../../../utils/pettoBotApi';

/** The picture of a badge made in the editor, for the pages of badges: the bot has it in its database; this hands it to a logged-in person with a short cache. */
export const GET: APIRoute = async (astro) => {
  const session = await getDashboardSession(astro);
  if (!session) return new Response('Not found', { status: 404 });
  const art = await fetchPettoBadgeArt(astro, String(astro.params.id ?? ''));
  if (!art) return new Response('Not found', { status: 404 });
  return new Response(art.bytes, { headers: { 'content-type': art.type, 'cache-control': 'private, max-age=300', 'x-content-type-options': 'nosniff' } });
};
