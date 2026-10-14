// What every page of the public appeal site needs first: the server, its settings, the language and who is signed in.
import { getDashboardSession } from './dashAuth';
import { getEnv } from './env';
import { callBot, loadConfig, SNOWFLAKE, type AppealConfig } from './appeals';
import { asAppealLang, type AppealLang } from '../i18n/appeal';

export interface Site {
  id: string; lang: AppealLang; config: AppealConfig; guild: { id: string; name: string; icon: string | null; members?: number | null };
  session: Awaited<ReturnType<typeof getDashboardSession>>;
}

/** Loads the site, or answers with the status the page must send: 404 for an id that is not a server of Petto, 503 when the bot cannot be reached. */
export async function loadSite(astro: any): Promise<Site | { status: 404 | 503 }> {
  const id = String(astro.params?.id ?? '');
  if (!SNOWFLAKE.test(id)) return { status: 404 };
  const [config, guildRes, session] = await Promise.all([loadConfig(astro, id), callBot(astro, id, 'guild'), getDashboardSession(astro)]);
  if (guildRes.status === 404) return { status: 404 };
  if (!config || !guildRes.payload?.guild) return { status: 503 };
  const asked = astro.url.searchParams.get('lang');
  const lang = asked ? asAppealLang(asked) : asAppealLang(astro.cookies.get('ap_lang')?.value ?? config.language);
  if (asked) astro.cookies.set('ap_lang', lang, { path: '/appeal', maxAge: 60 * 60 * 24 * 180, sameSite: 'lax' });
  return { id, lang, config, guild: guildRes.payload.guild, session };
}

/** The Discord login with the way back to the same page. */
export function loginUrl(astro: any, back: string): string | null {
  const clientId = getEnv(astro, 'DISCORD_CLIENT_ID');
  if (!clientId) return null;
  const redirectUri = `${astro.url.origin}/dash/callback`;
  return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('identify guilds')}`;
}
