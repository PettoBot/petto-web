import { decodeSession, encodeSession, type Session } from './session';
import { canManageGuild } from './discord';
import { getCachedUserGuilds } from './discordCache';
import { getEnv } from './env';

export type GuildAuth = { session: Session } | { redirect: string };

async function refreshSession(session: Session, clientId: string, clientSecret: string): Promise<Session | null> {
  if (!session.refreshToken) return null;

  try {
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: session.refreshToken,
      }),
    });
    if (!response.ok) return null;

    const token = await response.json();
    if (!token.access_token) return null;

    return {
      ...session,
      accessToken: token.access_token,
      refreshToken: token.refresh_token ?? session.refreshToken,
      expiresAt: Date.now() + Number(token.expires_in ?? 3600) * 1000,
    };
  } catch {
    return null;
  }
}

async function persistSessionCookie(astro: any, session: Session, clientSecret: string): Promise<void> {
  const encoded = await encodeSession(session, clientSecret);
  astro.cookies.set('petto_session', encoded, {
    httpOnly: true,
    secure: astro.url.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

/** Reads the dashboard session and silently renews Discord OAuth tokens near expiry. */
export async function getDashboardSession(astro: any): Promise<Session | null> {
  const clientId = getEnv(astro, 'DISCORD_CLIENT_ID');
  const clientSecret = getEnv(astro, 'DISCORD_CLIENT_SECRET');
  const cookie = astro.cookies.get('petto_session')?.value;
  const session = cookie && clientSecret ? await decodeSession(cookie, clientSecret) : null;
  if (!session) return null;

  const needsRefresh = session.expiresAt <= Date.now() + 60_000;
  if (!needsRefresh || !clientId || !clientSecret) {
    if (session.expiresAt <= Date.now()) return null;
    if (cookie && !cookie.startsWith('v1.') && clientSecret) await persistSessionCookie(astro, session, clientSecret);
    return session;
  }

  const refreshed = await refreshSession(session, clientId, clientSecret);
  if (!refreshed) return null;

  await persistSessionCookie(astro, refreshed, clientSecret);
  return refreshed;
}

/** Confirms the visitor is logged in and can actually manage this specific guild, via a live Discord check (never trusts the cookie alone for authorization). */
export async function getGuildSession(astro: any, guildId: string): Promise<GuildAuth> {
  const session = await getDashboardSession(astro);
  if (!session) return { redirect: '/dash' };

  let discordGuilds: any[];
  try {
    discordGuilds = await getCachedUserGuilds(session.accessToken);
  } catch {
    return { redirect: '/dash?error=discord_unavailable' };
  }
  const target = discordGuilds.find((g: any) => g.id === guildId);
  if (!target || !canManageGuild(target)) return { redirect: '/dash/manage?error=no_access' };

  return { session };
}
