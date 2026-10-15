export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const id = String(context.params.id ?? '');
  context.cookies.delete('petto_session', { path: '/' });
  return context.redirect(/^[a-z0-9-]{3,32}$/.test(id.toLowerCase()) ? `/appeal/${id.toLowerCase()}` : '/');
};
