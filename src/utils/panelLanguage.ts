import { syncPettoLanguage } from './pettoBotApi';

/**
 * The dashboard posts some panels itself (VoiceMaster, tickets) with the English words it has. When the server speaks another
 * language, this asks the bot to redraw the panels it keeps in that server in it, the same way as when the language is changed.
 * It never fails the save: an older bot without the route leaves the panel as it was posted.
 */
export async function redrawPanelsInServerLanguage(astro: any, apiUrl: string, apiHeaders: Record<string, string>, guildId: string): Promise<void> {
  try {
    const res = await fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${guildId}&select=language`, { headers: apiHeaders });
    const language = res.ok ? (await res.json())?.[0]?.language : null;
    if (language === 'es' || language === 'pt-BR') await syncPettoLanguage(astro, guildId, language);
  } catch { /* the panel stays as it was posted */ }
}
