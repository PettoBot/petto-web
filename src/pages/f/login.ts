export const prerender = false;
import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';
import { PUBLIC_ID, formPagePath } from '../../utils/forms';

/**
 * Sends the visitor to log in with Discord (only their identity is asked for) and brings them back to the form:
 * /f/login?form=<public id>&lang=es comes back to /es/form#<public id>. The id travels in the OAuth state too, and the page keeps it in
 * the tab, so the hash comes back even when the browser drops the cookie.
 */
export const GET: APIRoute = async ({ url, redirect, cookies, locals }) => {
  const clientId = getEnv({ locals }, 'DISCORD_CLIENT_ID');
  const form = url.searchParams.get('form') ?? '';
  const lang = url.searchParams.get('lang') ?? 'en';
  const legacy = /^\/f\/([0-9A-Za-z]{12})$/.exec(url.searchParams.get('next') ?? '')?.[1] ?? '';
  const id = PUBLIC_ID.test(form) ? form : legacy;
  const safe = id ? `${formPagePath(lang)}#${id}` : '/';
  if (!clientId) return redirect(safe);
  cookies.set('petto_after_login', safe, { httpOnly: true, secure: url.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 600 });
  const redirectUri = `${url.origin}/dash/callback`;
  const state = id ? `&state=${encodeURIComponent(`form.${id}.${lang === 'es' ? 'es' : lang === 'pt-BR' || lang === 'pt' ? 'pt' : 'en'}`)}` : '';
  return redirect(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify${state}`);
};
