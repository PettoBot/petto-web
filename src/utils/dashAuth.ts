import { decodeSession, type Session } from './session';
import { canManageGuild } from './discord';
import { getCachedUserGuilds } from './discordCache';

export type GuildAuth = { session: Session } | { redirect: string };

/** Confirms the visitor is logged in and can actually manage this specific guild, via a live Discord check (never trusts the cookie alone for authorization). */
export async function getGuildSession(astro: any, guildId: string): Promise<GuildAuth> {
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const cookie = astro.cookies.get('petto_session')?.value;
  const session = cookie && clientSecret ? await decodeSession(cookie, clientSecret) : null;
  if (!session || session.expiresAt < Date.now()) return { redirect: '/dash' };

  const discordGuilds = await getCachedUserGuilds(session.accessToken);
  const target = discordGuilds.find((g: any) => g.id === guildId);
  if (!target || !canManageGuild(target)) return { redirect: '/dash/manage?error=no_access' };

  return { session };
}
