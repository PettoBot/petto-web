import { getVariableGroups, peekVariableGroups } from './variableRegistry';
import { getDashLang } from '../i18n/dash';
import variables from '../data/variables.generated.json';

type Dt = (key: string, vars?: Record<string, unknown>) => string;

// The built-in list the menus show when the bot cannot answer: a copy of the bot's own registry, in the three languages, written by
// scripts/sync-variables.mjs (`npm run sync:variables -- <path to petto-bot>`). It has every section, not a hand-kept subset.
interface VarDef { tok: string; desc: string; }
interface VarGroup { label: string; vars: VarDef[]; }
const generated = variables as unknown as Record<string, { id: string; label: string; vars: VarDef[] }[]>;
const fallbackGroups = (lang: string): VarGroup[] => (generated[lang] ?? generated.en).map((group) => ({ label: group.label, vars: group.vars }));

/**
 * The variables of the dashboard's menus (the Variables button and the typed autocomplete), as the compact JSON both read:
 * [{ l: label, v: [[token, description]] }]. The bot says which variables it understands; this built-in list is only used when it
 * cannot answer.
 */
export async function variableGroupsJson(astro: { locals?: any }, dt: Dt, options: { ask?: boolean } = {}): Promise<string> {
  // `ask: false` never calls the bot: the copy it gave lately, or the built-in list.
  const registry = options.ask === false ? peekVariableGroups() : await getVariableGroups(astro);
  const fallback = fallbackGroups(getDashLang(astro as any));
  const english = getDashLang(astro as any) === 'en';
  // The bot writes its descriptions in English. One the dashboard cannot translate (its wording is not in the catalog) takes the translated
  // description the built-in list has for the same variable, so a Spanish or Portuguese menu is not half in English.
  const known = new Map(fallback.flatMap((group) => group.vars.map((variable) => [variable.tok, variable.desc] as [string, string])));
  const describe = (tok: string, desc: string) => {
    const translated = dt(desc);
    return english || translated !== desc || !known.has(tok) ? translated : (known.get(tok) as string);
  };
  const groups: VarGroup[] = registry
    ? registry.map((group) => ({ label: dt(group.label), vars: group.vars.map((variable) => ({ tok: variable.tok, desc: describe(variable.tok, variable.desc) })) }))
    : fallback;
  return JSON.stringify(groups.map((g) => ({ l: g.label, v: g.vars.map((v) => [v.tok, v.desc]) }))).replace(/</g, '\\u003c');
}
