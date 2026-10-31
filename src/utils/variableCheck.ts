// Tells which {variables} written in a text the bot does not know, so an editor can say it instead of leaving a typo to show up in the message.
// The names come from the bot's own registry (variables.generated.json, made by scripts/sync-variables.mjs) and the other names a variable answers to.
import generated from '../data/variables.generated.json';
import aliasNames from '../data/variableAliases.generated.json';

const squash = (name: string) => name.replace(/[._-]/g, '').toLowerCase();
const names = new Map<string, string>();
for (const group of (generated as unknown as { en: { vars: { tok: string }[] }[] }).en) for (const variable of group.vars) names.set(variable.tok.slice(1, -1).toLowerCase(), variable.tok);
for (const alias of aliasNames as string[]) names.set(alias.toLowerCase(), `{${alias}}`);
// What the bot reads by a pattern: {choose:a|b}, {range:1-6}, {arg1}, {args_from:2}, {timestamp:tomorrow}, {imgcard:name}, {quest.*}.
const PATTERN = /^(choose\d*:|range:|arg\d{1,2}$|args_from:|timestamp:|imgcard:|quest\.|newline$|separator$)/i;
const bySquash = new Map<string, Set<string>>();
for (const [lower, tok] of names) { const key = squash(lower); if (!bySquash.has(key)) bySquash.set(key, new Set()); bySquash.get(key)!.add(tok); }

export interface UnknownVariable { token: string; suggestion?: string }

/** The variables of `text` that Petto does not know, each with the one it most likely meant when the spelling is only off by case, dots or underscores. */
export function unknownVariables(text: string): UnknownVariable[] {
  const found: UnknownVariable[] = [];
  const seen = new Set<string>();
  for (const match of text.matchAll(/\{\s*([A-Za-z0-9_.:|\-]+)\s*\}/g)) {
    const name = match[1];
    const lower = name.toLowerCase();
    if (names.has(lower) || PATTERN.test(lower) || seen.has(lower)) continue;
    seen.add(lower);
    const close = bySquash.get(squash(lower));
    found.push({ token: `{${name}}`, suggestion: close && close.size === 1 ? [...close][0] : undefined });
  }
  return found;
}
