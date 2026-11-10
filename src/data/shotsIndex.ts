// The simulated screenshots of the site, by name. The files are written from the bot's own code: scripts/make-shots.mjs writes the lookups
// (integrations.json) and the main systems (core.json); scripts/make-verify-shots.mjs writes the verification (verification.json).
import type { Shot } from '../components/DiscordShot.astro';
import type { Locale } from '../i18n/ui';
import integrations from './shots/integrations.json';
import core from './shots/core.json';
import verification from './shots/verification.json';

const all = { ...integrations, ...core, ...verification } as Record<string, Record<string, Shot>>;
// The files name the Portuguese of Brazil as written in the bot.
const key = (lang: Locale) => (lang === 'pt-BR' ? 'pt-BR' : lang);

export function getShot(id: string, lang: Locale): Shot {
  const shot = all[id]?.[key(lang)];
  if (!shot) throw new Error(`Unknown screenshot: ${id}`);
  return shot;
}
export const shotIds = Object.keys(all);
