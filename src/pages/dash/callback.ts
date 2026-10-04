export const prerender = false;
import type { APIRoute } from 'astro';
import { encodeSession } from '../../utils/session';
import { getEnv } from '../../utils/env';

export const GET: APIRoute = async ({ url, redirect, cookies, locals }) => {
  const clientId = getEnv({ locals }, 'DISCORD_CLIENT_ID');
  const clientSecret = getEnv({ locals }, 'DISCORD_CLIENT_SECRET');
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
    if (!tokenRes.ok) {
      // Discord's answer names the cause (invalid_client = wrong secret or app, invalid_grant = redirect_uri or an expired code,
      // 429 = rate limit). It never contains the secret, so it is safe to keep in the host logs.
      const detail = (await tokenRes.text().catch(() => '')).slice(0, 300);
      console.error(`[oauth] token exchange failed: ${tokenRes.status} redirect_uri=${redirectUri} ${detail}`);
      return redirect('/dash?error=token_exchange_failed');
    }
    const token = await tokenRes.json();

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!userRes.ok) {
      console.error(`[oauth] user fetch failed: ${userRes.status}`);
      return redirect('/dash?error=user_fetch_failed');
    }
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

    const afterLogin = cookies.get('petto_after_login')?.value;
    cookies.delete('petto_after_login', { path: '/' });
    // Only places of this site that need a signed-in member: the dashboard, and the checkout that opens from the Premium page.
    const returnTo = afterLogin && /^\/(?:dash(?:\/|$)|premium\/checkout\?plan=premium-[135]-(?:month|year)&terms=1$)/.test(afterLogin) ? afterLogin : '/dash/manage';
    return redirect(returnTo);
  } catch {
    return redirect('/dash?error=login_failed');
  }
};
