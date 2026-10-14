export const prerender = false;
import type { APIRoute } from 'astro';
import { loginUrl } from '../../../utils/appealSite';
import { SNOWFLAKE } from '../../../utils/appeals';

// Sends the member to Discord to sign in and brings them back to the appeal site.
export const GET: APIRoute = async (context) => {
  const id = String(context.params.id ?? '');
  if (!SNOWFLAKE.test(id)) return new Response('Not found', { status: 404 });
  const back = String(context.url.searchParams.get('back') ?? '');
  const target = /^\/appeal\/\d{15,25}(?:\/(?:form\/\d{1,12}|status\/[0-9a-f-]{36}))?$/.test(back) ? back : `/appeal/${id}`;
  const url = loginUrl(context, target);
  if (!url) return context.redirect(`/appeal/${id}`);
  context.cookies.set('petto_after_login', target, { path: '/', maxAge: 600, sameSite: 'lax', httpOnly: true, secure: context.url.protocol === 'https:' });
  return context.redirect(url);
};
