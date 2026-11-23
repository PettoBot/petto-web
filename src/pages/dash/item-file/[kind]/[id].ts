export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../../../utils/dashAuth';
import { fetchPettoItemFile } from '../../../../utils/pettoBotApi';

/**
 * The file of a banner or a name font of the shop, for the pages that show them (the shop and the editor): the bot has it in its database; this hands it to a logged-in
 * person with a short cache. A font is served with its own kind so the page can draw a sample with it.
 */
export const GET: APIRoute = async (astro) => {
  const session = await getDashboardSession(astro);
  if (!session) return new Response('Not found', { status: 404 });
  const file = await fetchPettoItemFile(astro, String(astro.params.kind ?? ''), String(astro.params.id ?? ''));
  if (!file) return new Response('Not found', { status: 404 });
  return new Response(file.bytes, { headers: { 'content-type': file.type, 'cache-control': 'private, max-age=300', 'x-content-type-options': 'nosniff' } });
};
