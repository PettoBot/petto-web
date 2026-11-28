import { u as useTranslations } from './ui_C1MR3LHJ.mjs';

function getAllCommands(lang = "en") {
  const t = useTranslations(lang);
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const cat of t.commandsPage.categories) {
    for (const [rawName, , desc] of cat.cmds) {
      const name = rawName.split(" ")[0];
      if (seen.has(name)) continue;
      seen.add(name);
      out.push({ name, category: cat.id, categoryTitle: cat.title, desc });
    }
  }
  return out;
}

export { getAllCommands as g };
