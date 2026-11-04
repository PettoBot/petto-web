import { getEnv } from './env';

/**
 * The address that starts the dashboard login with Discord (identify and guilds), or null when the app has no client id.
 * Discord sends the visitor back to /dash/callback, which opens the list of servers unless a page asked to come back to it.
 */
export function dashAuthorizeUrl(astro: { locals?: any; url: URL }): string | null {
  const clientId = getEnv(astro, 'DISCORD_CLIENT_ID');
  if (!clientId) return null;
  const redirectUri = `${astro.url.origin}/dash/callback`;
  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('identify guilds')}`;
}
