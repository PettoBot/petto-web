import { useTranslations, type Locale } from '../i18n/ui';

export interface CommandInfo {
  name: string;
  category: string;
  categoryTitle: string;
  desc: string;
}

// Flattened from the same English commandsPage data the /commands page renders, so this list
// (e.g. "ticket panel"), the interaction dispatcher only ever sees the top-level command name
// Discord sent (e.g. "ticket"), so that's what's used as the id here, deduped to one node.
/** `lang` gives the descriptions and category titles in that language (the names and the order are the same in every language). */
export function getAllCommands(lang: Locale = 'en'): CommandInfo[] {
  const t = useTranslations(lang);
  const seen = new Set<string>();
  const out: CommandInfo[] = [];
  for (const cat of t.commandsPage.categories) {
    for (const [rawName, , desc] of cat.cmds) {
      const name = rawName.split(' ')[0];
      if (seen.has(name)) continue;
      seen.add(name);
      out.push({ name, category: cat.id, categoryTitle: cat.title, desc });
    }
  }
  return out;
}
