import { decodeSession, encodeSession, type Session } from './session';
import { canManageGuild } from './discord';
import { getCachedUserGuilds } from './discordCache';
import { getEnv } from './env';
import { getBotIdentity } from './discord';
import { getPremiumSnapshot } from './premium';
import { getCachedBotGuildIds } from './discordCache';
import { isPettoOwner } from './premiumAdmin';
import { markTiming } from './serverTiming';

export type GuildAuth = { session: Session; devView?: boolean } | { redirect: string };

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
  const started = performance.now();
  try {
    return await checkGuildSession(astro, guildId);
  } finally {
    markTiming('auth', started);
  }
}

async function checkGuildSession(astro: any, guildId: string): Promise<GuildAuth> {
  const session = await getDashboardSession(astro);
  if (!session) return { redirect: '/dash' };

  // The layout of every guild page needs the Premium state, the servers of the visitor and of the bot, and the bot's
  // look. Starting those reads now lets them run while the page checks access and loads its own data, and the layout
  // picks up the same answers (they are shared per request) instead of starting after the page is done.
  const botToken = getEnv(astro, 'DISCORD_TOKEN');
  const request = astro.request as Request | undefined;
  const isRead = ['GET', 'HEAD'].includes(String(request?.method ?? 'GET').toUpperCase());
  if (isRead) {
    void getPremiumSnapshot(astro, session.userId).catch(() => {});
    if (botToken) {
      void getCachedBotGuildIds(botToken, request).catch(() => {});
      void getBotIdentity(guildId, botToken, request).catch(() => {});
    }
  }

  let discordGuilds: any[];
  try {
    discordGuilds = await getCachedUserGuilds(session.accessToken, request, { forAccess: true });
  } catch {
    return { redirect: '/dash?error=discord_unavailable' };
  }
  const target = discordGuilds.find((g: any) => g.id === guildId);
  if (!target || !canManageGuild(target)) {
    // The Petto owner can open any server the bot is in, but only to look. Every write
    // (any non-GET request) is refused here, so no dashboard page can change a foreign server.
    if (isPettoOwner(astro, session.userId)) {
      const method = String(astro.request?.method ?? 'GET').toUpperCase();
      if (method !== 'GET' && method !== 'HEAD') return { redirect: `/dash/guild/${guildId}/overview?error=dev_readonly` };
      return { session, devView: true };
    }
    return { redirect: '/dash/manage?error=no_access' };
  }

  return { session };
}
