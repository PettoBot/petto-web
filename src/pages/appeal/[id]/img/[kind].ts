export const prerender = false;
import type { APIRoute } from 'astro';
import { resolveGuildId, UPLOAD_KINDS } from '../../../../utils/appeals';
import { callPettoAppealImage } from '../../../../utils/pettoBotApi';

// A picture an appeal page uploaded (banner, icon or the picture of the link preview), served to the public.
export const GET: APIRoute = async (context) => {
  const kind = String(context.params.kind ?? '');
  if (!(UPLOAD_KINDS as readonly string[]).includes(kind)) return new Response('Not found', { status: 404 });
  const id = await resolveGuildId(context, String(context.params.id ?? '').toLowerCase());
  if (!id) return new Response('Not found', { status: 404 });
  const response = await callPettoAppealImage(context as any, id, kind);
  if (!response || !response.ok) return new Response('Not found', { status: response?.status === 404 ? 404 : 502 });
  return new Response(await response.arrayBuffer(), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' },
  });
};
