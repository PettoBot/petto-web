// The simulated screenshots of the site, by name. Both files are written by scripts/make-shots.mjs from the bot's own code:
// the lookups (integrations.json) and the main systems (core.json).
import type { Shot } from '../components/DiscordShot.astro';
import type { Locale } from '../i18n/ui';
import integrations from './shots/integrations.json';
import core from './shots/core.json';

const all = { ...integrations, ...core } as Record<string, Record<string, Shot>>;
// The files name the Portuguese of Brazil as written in the bot.
const key = (lang: Locale) => (lang === 'pt-BR' ? 'pt-BR' : lang);

export function getShot(id: string, lang: Locale): Shot {
  const shot = all[id]?.[key(lang)];
  if (!shot) throw new Error(`Unknown screenshot: ${id}`);
  return shot;
}
export const shotIds = Object.keys(all);
