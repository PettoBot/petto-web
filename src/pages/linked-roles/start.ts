import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';

export const prerender = false;

export const GET: APIRoute = async ({ url, redirect, cookies, locals }) => {
  const clientId = getEnv({ locals }, 'DISCORD_CLIENT_ID');
  const clientSecret = getEnv({ locals }, 'DISCORD_CLIENT_SECRET');
  if (!clientId || !clientSecret) return redirect('/linked-roles?error=missing_config');

  const state = crypto.randomUUID();
  const redirectUri = `${url.origin}/linked-roles/callback`;
  const authorize = new URL('https://discord.com/oauth2/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', redirectUri);
  authorize.searchParams.set('response_type', 'code');
  authorize.searchParams.set('scope', 'identify role_connections.write');
  authorize.searchParams.set('state', state);

  cookies.set('petto_linked_roles_state', state, {
    httpOnly: true,
    secure: url.protocol === 'https:',
    sameSite: 'lax',
    path: '/linked-roles',
    maxAge: 60 * 10,
  });

  return redirect(authorize.toString());
};
