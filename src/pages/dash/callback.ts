export const prerender = false;
import type { APIRoute } from 'astro';
import { encodeSession } from '../../utils/session';

export const GET: APIRoute = async ({ url, redirect, cookies }) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!clientId || !clientSecret) return redirect('/dash?error=server_not_configured');

  const code = url.searchParams.get('code');
  if (!code) return redirect('/dash?error=missing_code');

  const redirectUri = `${url.origin}/dash/callback`;

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
    if (!tokenRes.ok) return redirect('/dash?error=token_exchange_failed');
    const token = await tokenRes.json();

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!userRes.ok) return redirect('/dash?error=user_fetch_failed');
    const user = await userRes.json();

    const session = {
      userId: user.id,
      username: user.global_name || user.username,
      avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : null,
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      expiresAt: Date.now() + token.expires_in * 1000,
    };
    const encoded = await encodeSession(session, clientSecret);

    cookies.set('petto_session', encoded, {
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return redirect('/dash/manage');
  } catch {
    return redirect('/dash?error=login_failed');
  }
};
