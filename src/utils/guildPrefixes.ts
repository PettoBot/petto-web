// The command prefixes of a server (the same rules as the bot's src/utils/guildPrefixes.js): up to 10, each 1 to 12 characters, no
// spaces, no "@" and no backticks, no repeats (the case does not count). The first one is the main prefix.
export const DEFAULT_PREFIXES = ['!', 'petto'];
export const MAX_PREFIXES = 10;
export const MAX_PREFIX_LENGTH = 12;

/** The English text of what is wrong (the key of the dashboard catalog) and its variables, or null when the list is fine. */
export type PrefixProblem = { key: string; vars?: Record<string, string | number> };

export function checkPrefixList(input: unknown): { prefixes: string[]; problem: null } | { prefixes: null; problem: PrefixProblem } {
  if (!Array.isArray(input)) return { prefixes: null, problem: { key: 'Keep at least one prefix.' } };
  const list: string[] = [];
  for (const item of input) {
    const value = String(item ?? '').trim();
    if (!value) return { prefixes: null, problem: { key: 'Write a prefix first.' } };
    if (value.length > MAX_PREFIX_LENGTH) return { prefixes: null, problem: { key: 'A prefix has at most {n} characters.', vars: { n: MAX_PREFIX_LENGTH } } };
    if (/\s/.test(value)) return { prefixes: null, problem: { key: 'A prefix cannot have spaces.' } };
    if (value.includes('@') || value.includes('`')) return { prefixes: null, problem: { key: 'A prefix cannot have @ or backticks.' } };
    if (list.some((p) => p.toLowerCase() === value.toLowerCase())) return { prefixes: null, problem: { key: '{p} is already in the list.', vars: { p: value } } };
    list.push(value);
  }
  if (!list.length) return { prefixes: null, problem: { key: 'Keep at least one prefix.' } };
  if (list.length > MAX_PREFIXES) return { prefixes: null, problem: { key: 'A server can have up to {n} prefixes.', vars: { n: MAX_PREFIXES } } };
  return { prefixes: list, problem: null };
}

/** The prefixes of a server from its row: the saved list, or the old single prefix, or `!`. */
export function prefixesFromRows(prefixes: unknown, prefix: unknown): string[] {
  const saved = Array.isArray(prefixes) ? prefixes.map((p) => String(p ?? '').trim()).filter(Boolean) : [];
  if (saved.length) return saved;
  const old = typeof prefix === 'string' ? prefix.trim() : '';
  return [old || '!'];
}
