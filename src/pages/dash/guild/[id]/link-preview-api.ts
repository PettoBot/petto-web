export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { previewImage } from '../../../../utils/linkPreview';

// The picture of a link for the previews of the dashboard (see utils/linkPreview.ts): only for someone who can manage the server.
export const GET: APIRoute = async (astro) => {
  const { id } = astro.params as { id: string };
  const result = await getGuildSession(astro, id);
  if ('redirect' in result) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  const link = new URL(astro.request.url).searchParams.get('url') ?? '';
  const image = link.length <= 500 ? await previewImage(link) : null;
  return new Response(JSON.stringify({ image }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, max-age=300' } });
};
