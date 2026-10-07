export const prerender = false;
import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';

/** Sends the visitor to log in with Discord and brings them back to the page of the board they came from. */
export const GET: APIRoute = async ({ url, redirect, cookies, locals }) => {
  const clientId = getEnv({ locals }, 'DISCORD_CLIENT_ID');
  if (!clientId) return redirect('/feedback?error=unavailable');
  const next = url.searchParams.get('next') ?? '/feedback';
  const safe = /^\/feedback(?:\/(?:new|\d{1,12}))?$/.test(next) ? next : '/feedback';
  cookies.set('petto_after_login', safe, { httpOnly: true, secure: url.protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 600 });
  const redirectUri = `${url.origin}/dash/callback`;
  return redirect(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify`);
};
