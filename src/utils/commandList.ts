import { useTranslations } from '../i18n/ui';

export interface CommandInfo {
  name: string;
  category: string;
  categoryTitle: string;
  desc: string;
}

export function getAllCommands(): CommandInfo[] {
  const t = useTranslations('en');
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
