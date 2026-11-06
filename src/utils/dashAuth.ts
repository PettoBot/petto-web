import { decodeAnySession, encodeSession, isCurrentSession, type Session } from './session';
import { canManageGuild } from './discord';
import { getCachedUserGuilds } from './discordCache';
import { getEnv } from './env';
import { loadDashLayoutData } from './dashLayoutData';
import { memoPerRequest } from './requestMemo';
import { isPettoOwner } from './premiumAdmin';
import { markTiming } from './serverTiming';
import { getRoleAccess, pageDecision, pageOf, type RoleAccess } from './dashAccess';
import { supportGate } from './supportEdit';
import { cosmeticsFromUser } from './discordCosmetics.mjs';
import { profileFromUser } from './dashProfile.mjs';

export type GuildAuth = { session: Session; devView?: boolean; access?: RoleAccess } | { redirect: string };

// Discord gives a refresh token for one use only. A page asks the server for several things at once (the page, the events, a save), and
// when the token is about to expire each of those requests used to refresh it on its own: the first one worked, the others were told the
// token was already used and the visitor saw "your session ended" even though they were logged in.
// Requests that carry the same refresh token now share one refresh, and its answer is kept for a short while for the ones that were
// already on their way with the old cookie.
const REFRESH_SHARE_MS = 2 * 60_000;
const sharedRefreshes = new Map<string, { at: number; result: Promise<Session | null> }>();

async function refreshSession(session: Session, clientId: string, clientSecret: string): Promise<Session | null> {
  if (!session.refreshToken) return null;
  const now = Date.now();
  for (const [key, entry] of sharedRefreshes) if (now - entry.at > REFRESH_SHARE_MS) sharedRefreshes.delete(key);
  const shared = sharedRefreshes.get(session.refreshToken);
  if (shared) return shared.result.then((done) => (done ? { ...session, accessToken: done.accessToken, refreshToken: done.refreshToken, expiresAt: done.expiresAt } : null));
  const result = refreshSessionNow(session, clientId, clientSecret);
  sharedRefreshes.set(session.refreshToken, { at: now, result });
  // A refresh that failed is not kept: the next request tries again.
  void result.then((done) => { if (!done) sharedRefreshes.delete(session.refreshToken); });
  return result;
}

async function refreshSessionNow(session: Session, clientId: string, clientSecret: string): Promise<Session | null> {

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

/**
 * A session made before the user card kept the avatar decoration and the nameplate (or before the menu header kept the banner, the accent
 * color and the @username) reads them once from Discord (best effort: a slow or
 * failed answer leaves the session as it was and the card shows the plain avatar). Only for a page read, never for an API call or a write.
 */
async function withCosmetics(astro: any, session: Session, clientSecret: string): Promise<Session> {
  if (session.decoration !== undefined && session.nameplate !== undefined && session.handle !== undefined && session.banner !== undefined && session.accentColor !== undefined) return session;
  const request = astro.request as Request | undefined;
  const method = String(request?.method ?? 'GET').toUpperCase();
  if ((method !== 'GET' && method !== 'HEAD') || !/text\/html/i.test(request?.headers.get('accept') ?? '')) return session;
  const next = await memoPerRequest(request, `dash-cosmetics:${session.userId}`, async () => {
    try {
      const res = await fetch('https://discord.com/api/v10/users/@me', { headers: { Authorization: `Bearer ${session.accessToken}` }, signal: AbortSignal.timeout(2000) });
      if (!res.ok) return null;
      const user = await res.json();
      const updated: Session = { ...session, ...cosmeticsFromUser(user), ...profileFromUser(user) };
      await persistSessionCookie(astro, updated, clientSecret);
      return updated;
    } catch {
      return null;
    }
  });
  return next ?? session;
}

/** Reads the dashboard session and silently renews Discord OAuth tokens near expiry. */
export async function getDashboardSession(astro: any): Promise<Session | null> {
  const clientId = getEnv(astro, 'DISCORD_CLIENT_ID');
  const clientSecret = getEnv(astro, 'DISCORD_CLIENT_SECRET');
  const cookie = astro.cookies.get('petto_session')?.value;
  const session = cookie && clientSecret ? await decodeAnySession(cookie, clientSecret) : null;
  if (!session) return null;
  if (!isCurrentSession(session)) {
    // Made before the current SESSION_VERSION: logged out. The cookie goes, and the middleware sends the visitor to the login card with a notice.
    try { astro.cookies.delete('petto_session', { path: '/' }); } catch { /* the cookie is rejected on every read anyway */ }
    if (astro.locals) astro.locals.sessionStale = true;
    return null;
  }

  const needsRefresh = session.expiresAt <= Date.now() + 60_000;
  if (!needsRefresh || !clientId || !clientSecret) {
    if (session.expiresAt <= Date.now()) return null;
    if (cookie && !cookie.startsWith('v1.') && clientSecret) await persistSessionCookie(astro, session, clientSecret);
    return clientSecret ? withCosmetics(astro, session, clientSecret) : session;
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
    // The middleware checks the session before it answers "not modified", and the page checks it again: one check per request (reads only).
    return await memoPerRequest(astro.request, `guild-session:${guildId}`, () => checkGuildSession(astro, guildId));
  } finally {
    markTiming('auth', started);
  }
}

async function checkGuildSession(astro: any, guildId: string): Promise<GuildAuth> {
  const session = await getDashboardSession(astro);
  if (!session) return { redirect: '/dash' };

  // The layout of every guild page needs the visitor's servers, the bot's servers and look, Premium and role access. Starting those
  // reads now lets them run while the page checks access and loads its own data; the layout picks up the same answer (one per request).
  const request = astro.request as Request | undefined;
  const isRead = ['GET', 'HEAD'].includes(String(request?.method ?? 'GET').toUpperCase());
  // Only for a page (a JSON or event route has no menu).
  const wantsPage = /text\/html/i.test(request?.headers.get('accept') ?? '') || Boolean(request?.headers.get('x-dash-partial'));
  if (isRead && wantsPage) void loadDashLayoutData(astro, guildId, session).catch(() => {});

  let discordGuilds: any[];
  try {
    discordGuilds = await getCachedUserGuilds(session.accessToken, request, { forAccess: true });
  } catch {
    return { redirect: '/dash?error=discord_unavailable' };
  }
  const target = discordGuilds.find((g: any) => g.id === guildId);
  if (target && !canManageGuild(target)) {
    // Not a manager, but the server may let the members of one of their roles into some parts of the dashboard.
    const access = await getRoleAccess(astro, guildId, session.userId);
    if (access) {
      const decision = pageDecision(access, pageOf(String(astro.url?.pathname ?? ''), guildId));
      if (!decision.allowed) return { redirect: `/dash/guild/${guildId}/overview?error=no_section` };
      const method = String(request?.method ?? 'GET').toUpperCase();
      if (method !== 'GET' && method !== 'HEAD' && !decision.canEdit) return { redirect: `/dash/guild/${guildId}/overview?error=view_only` };
      return { session, access };
    }
  }
  if (!target || !canManageGuild(target)) {
    // The Petto owner can open any server the bot is in, to look and, in Support mode, to change the few settings that fix errors. Every
    // write (any non-GET request) goes through supportEdit.ts, the one list of what may be changed: a page, a route or an action that is not
    // in it is refused here, so no dashboard page can change an essential setting of a foreign server, even with a forged form.
    if (isPettoOwner(astro, session.userId)) {
      const method = String(astro.request?.method ?? 'GET').toUpperCase();
      if (method !== 'GET' && method !== 'HEAD') {
        const decision = await supportGate(astro, guildId, String(session.userId));
        if (!decision.allowed) return { redirect: `/dash/guild/${guildId}/overview?error=dev_readonly` };
      }
      return { session, devView: true };
    }
    return { redirect: '/dash/manage?error=no_access' };
  }

  return { session };
}
