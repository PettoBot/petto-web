export const prerender = false;
import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';

/** Sends the visitor to log in with Discord (only their identity is asked for) and brings them back to the form. */
export const GET: APIRoute = async ({ url, redirect, cookies, locals }) => {
  const clientId = getEnv({ locals }, 'DISCORD_CLIENT_ID');
  const next = url.searchParams.get('next') ?? '';
  const safe = /^\/f\/\d{1,15}$/.test(next) ? next : '/';
  if (!clientId) return redirect(safe);
  cookies.set('petto_after_login', safe, { httpOnly: true, secure: url.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 600 });
  const redirectUri = `${url.origin}/dash/callback`;
  return redirect(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`);
};
