export const prerender = false;
import type { APIRoute } from 'astro';
import { SNOWFLAKE } from '../../../utils/appeals';

export const GET: APIRoute = async (context) => {
  const id = String(context.params.id ?? '');
  context.cookies.delete('petto_session', { path: '/' });
  return context.redirect(SNOWFLAKE.test(id) ? `/appeal/${id}` : '/');
};
