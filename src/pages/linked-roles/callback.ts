import type { APIRoute } from 'astro';
import { getEnv } from '../../utils/env';

export const prerender = false;

export const GET: APIRoute = async ({ url, redirect, cookies, locals }) => {
  const clientId = getEnv({ locals }, 'DISCORD_CLIENT_ID');
  const clientSecret = getEnv({ locals }, 'DISCORD_CLIENT_SECRET');
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = cookies.get('petto_linked_roles_state')?.value;
  cookies.delete('petto_linked_roles_state', { path: '/linked-roles' });

  if (!clientId || !clientSecret) return redirect('/linked-roles?error=missing_config');
  if (url.searchParams.get('error') === 'access_denied') return redirect('/linked-roles?error=access_denied');
  if (!code || !state || !savedState || state !== savedState) return redirect('/linked-roles?error=invalid_state');

  const redirectUri = `${url.origin}/linked-roles/callback`;

  try {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });
    if (!tokenRes.ok) return redirect('/linked-roles?error=token_exchange_failed');
    const token = await tokenRes.json();
    if (!token.access_token) return redirect('/linked-roles?error=token_exchange_failed');

    const userRes = await fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!userRes.ok) return redirect('/linked-roles?error=user_fetch_failed');
    const user = await userRes.json();

    const connectionRes = await fetch(`https://discord.com/api/v10/users/@me/applications/${clientId}/role-connection`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        platform_name: 'Petto',
        platform_username: user.global_name || user.username || user.id,
        metadata: { petto_verified: '1' },
      }),
    });
    if (!connectionRes.ok) return redirect('/linked-roles?error=connection_update_failed');

    return redirect('/linked-roles?status=connected');
  } catch {
    return redirect('/linked-roles?error=generic');
  }
};
