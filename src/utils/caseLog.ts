/**
 * The case log of the moderation page: which kinds of case it can filter by, and the filters of the mod_actions read for a kind and a
 * search. The read goes to the bot's API (or straight to the database, directDb.ts), which understand a simpler `or=(...)` than
 * PostgREST: its alternatives are split at every comma, an `in.(...)` inside it does not work, and `ilike` takes `%` (not `*`).
 */

/** Every kind of case the bot writes (mod_actions.type, see the bot's schema.sql). */
export const CASE_TYPES = ['ban', 'tempban', 'hardban', 'softban', 'kick', 'mute', 'tempmute', 'warn', 'jail', 'unban', 'unmute', 'unjail'] as const;

/** The filter buttons, in order. A button can hold several kinds: "mute" is also a tempmute, "ban" is also a tempban and a hardban. */
export const CASE_FILTERS: Record<string, readonly string[]> = {
  ban: ['ban', 'tempban', 'hardban'],
  softban: ['softban'],
  kick: ['kick'],
  mute: ['mute', 'tempmute'],
  warn: ['warn'],
  jail: ['jail'],
  unban: ['unban'],
  unmute: ['unmute'],
  unjail: ['unjail'],
};

/** The kinds a `type` from the address stands for: a button (ban, mute...), one exact kind (tempban), or nothing (every case). */
export function caseTypesFor(type: string): readonly string[] | null {
  if (CASE_FILTERS[type]) return CASE_FILTERS[type];
  return (CASE_TYPES as readonly string[]).includes(type) ? [type] : null;
}

/** The button a `type` lights up: its own, or the button that holds that exact kind. */
export function caseFilterOf(type: string): string {
  if (CASE_FILTERS[type]) return type;
  return Object.keys(CASE_FILTERS).find((key) => CASE_FILTERS[key].includes(type)) ?? '';
}

/** What a search looks for: a case number, a Discord id (the member or the moderator), or words (the reason and people's names). */
export type CaseSearch =
  | { kind: 'none' }
  | { kind: 'number'; number: number; exact: boolean }
  | { kind: 'id'; id: string }
  | { kind: 'text'; text: string };

export function readCaseSearch(raw: string): CaseSearch {
  const text = raw.replace(/\s+/g, ' ').trim().slice(0, 100);
  if (!text) return { kind: 'none' };
  const number = /^#?(\d{1,9})$/.exec(text);
  // "#12" is that case; "12" is also any reason with 12 in it.
  if (number) return { kind: 'number', number: Number(number[1]), exact: text.startsWith('#') };
  const id = /^<@!?(\d{15,25})>$|^(\d{15,25})$/.exec(text);
  if (id) return { kind: 'id', id: id[1] ?? id[2] };
  return { kind: 'text', text };
}

/** Words for `ilike`: the wildcards of LIKE are written as themselves, and a comma (which would split the `or`) matches any text. */
function likePattern(text: string): string {
  return `%${text.replace(/[\\%_]/g, (c) => `\\${c}`).replace(/,/g, '%')}%`;
}

/**
 * The query string (without guild, order and limit) of the mod_actions read for a kind, a search and a page (cases older than
 * `before`). `peopleIds` are the people whose name matches the words searched, found by the caller.
 */
export function caseLogFilters(options: { type: string; search: CaseSearch; before: number | null; peopleIds?: string[] }): string {
  const parts: string[] = [];
  const types = caseTypesFor(options.type);
  if (types) parts.push(types.length === 1 ? `type=eq.${types[0]}` : `type=in.(${types.join(',')})`);
  if (options.before && options.before > 0) parts.push(`case_number=lt.${Math.trunc(options.before)}`);
  const search = options.search;
  const alternatives: string[] = [];
  if (search.kind === 'number') {
    alternatives.push(`case_number.eq.${search.number}`);
    if (!search.exact) alternatives.push(`reason.ilike.${likePattern(String(search.number))}`);
  } else if (search.kind === 'id') {
    alternatives.push(`user_id.eq.${search.id}`, `moderator_id.eq.${search.id}`);
  } else if (search.kind === 'text') {
    alternatives.push(`reason.ilike.${likePattern(search.text)}`);
    for (const id of [...new Set(options.peopleIds ?? [])].filter((value) => /^\d{15,25}$/.test(value)).slice(0, 20)) {
      alternatives.push(`user_id.eq.${id}`, `moderator_id.eq.${id}`);
    }
  }
  if (alternatives.length) parts.push(`or=${encodeURIComponent(`(${alternatives.join(',')})`)}`);
  return parts.join('&');
}

/** The address of the case log with these filters; empty values are left out, so the links stay short. */
export function caseLogHref(params: { type?: string; q?: string; before?: number | null; size?: number; edit?: number }): string {
  const search = new URLSearchParams({ section: 'cases' });
  if (params.type) search.set('type', params.type);
  if (params.q) search.set('q', params.q);
  if (params.size && params.size !== 25) search.set('cases', String(params.size));
  if (params.before) search.set('before', String(params.before));
  if (params.edit) search.set('edit', String(params.edit));
  return `?${search.toString()}`;
}
