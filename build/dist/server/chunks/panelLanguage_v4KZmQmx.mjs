import { k as syncPettoLanguage } from './pettoBotApi_B4wpoZhN.mjs';

async function redrawPanelsInServerLanguage(astro, apiUrl, apiHeaders, guildId) {
  try {
    const res = await fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${guildId}&select=language`, { headers: apiHeaders });
    const language = res.ok ? (await res.json())?.[0]?.language : null;
    if (language === "es" || language === "pt-BR") await syncPettoLanguage(astro, guildId, language);
  } catch {
  }
}

export { redrawPanelsInServerLanguage as r };
