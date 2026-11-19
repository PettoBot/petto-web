import { parseDocument } from 'yaml';
import { CONFIG_SCHEMA } from './configYamlSchema';
import { SECTIONS, GUILD_COLUMNS } from './configYamlRender';
import { checkPrefixList, prefixesFromRows } from './guildPrefixes';
import { automodNumber } from './automodLimits';
import {
  readConfigForm, readVoiceForm, readRankForm, readRulesForm,
  configFormEntries, voiceFormEntries, rankFormEntries, rulesFormEntries,
  storedConfig, storedVoice, storedRank, storedRules,
} from './levelingForm';

// Import of the configuration file of Config Management (the YAML the page downloads). Everything here is pure: it takes the text of the file
// and the rows the server has now, and gives back a plan (what would change, what is wrong, what is left out and why). The route
// (general-config-import.ts) reads the rows, asks for the plan to show it, and asks for it again to apply it, so what is written is always
// what a fresh check of the file says, never what a browser sent back.
//
// What is imported (version 1): only plain settings of modules whose page saves them by writing the module's own row of settings, with the
// same limits the page applies (the leveling forms and the prefixes are the very functions the pages use; the AutoMod numbers come from
// automodLimits.ts, which the page uses too). Lists of items (commands, rewards, panels, embeds...), anything that has to be done in Discord
// (the bot's name and picture, webhooks, messages) and anything that holds state or secrets are left out and said so.

export const MAX_FILE_BYTES = 256 * 1024;
const MAX_DEPTH = 8;
const MAX_NODES = 20000;
const SNOWFLAKE = /^\d{15,25}$/;

export interface Msg { key: string; vars?: Record<string, string | number> }
export interface PlanChange { setting: string; from: unknown; to: unknown; note?: Msg }
export interface PlanProblem { setting: string; value: unknown; reason: Msg }
export interface PlanModule {
  id: string;
  /** The title of the module (an English key of the dashboard catalog). */
  title: string;
  /** Where its settings are in the file. */
  path: string;
  changes: PlanChange[];
  unchanged: number;
  /** Settings that cannot be imported as they are (skipped; the rest of the module still applies). */
  invalid: PlanProblem[];
  /** Settings that were applied partly (an id that is not in the server was taken out of a list). */
  warnings: PlanProblem[];
  /** The module could not be checked (its current settings could not be read). */
  unreadable?: boolean;
}
export interface PlanIgnored { path: string; reason: Msg }
export interface WritePart { row: Record<string, unknown>; after?: 'prefix' | 'language' }
export interface PlanWrite { id: string; table: string; parts: WritePart[] }
export interface PlanOk {
  ok: true;
  guildId: string;
  modules: PlanModule[];
  ignored: PlanIgnored[];
  unknown: string[];
  totals: { changes: number; unchanged: number; invalid: number; ignored: number; unknown: number };
  /** What the apply step writes (never sent to the browser). */
  writes: PlanWrite[];
}
export interface PlanFail { ok: false; error: Msg }
export type Plan = PlanOk | PlanFail;
export type Row = Record<string, unknown>;
export interface ImportInput {
  yaml: string;
  guildId: string;
  /** The current row of each table (null: no row yet; undefined: it could not be read). */
  rows: Record<string, Row | null | undefined>;
  /** Ids that exist in the server, to refuse the others; null when they are not known. */
  known?: { roles: Set<string> | null; channels: Set<string> | null };
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Reading the file

const fail = (key: string, vars?: Msg['vars']): PlanFail => ({ ok: false, error: { key, vars } });

/** The file as plain data, or why it cannot be used. Aliases, tags and merge keys are refused: a settings file does not need them. */
export function parseConfigFile(text: string): { ok: true; data: Record<string, unknown> } | PlanFail {
  if (typeof text !== 'string' || !text.trim()) return fail('The file is empty.');
  if (new TextEncoder().encode(text).length > MAX_FILE_BYTES) return fail('The file is too big (at most {n} KB).', { n: MAX_FILE_BYTES / 1024 });
  if (text.includes('\u0000')) return fail('This is not a configuration file.');
  let doc;
  try {
    doc = parseDocument(text, { maxAliasCount: 0, merge: false, uniqueKeys: true, schema: 'core', version: '1.2', prettyErrors: false, strict: true });
  } catch {
    return fail('This is not valid YAML.');
  }
  if (doc.errors.length || doc.warnings.length) {
    const first = (doc.errors[0] ?? doc.warnings[0]) as { linePos?: { line: number }[]; code?: string };
    const line = first.linePos?.[0]?.line;
    return fail('This is not valid YAML (line {n}).', { n: line ?? 1 });
  }
  let data: unknown;
  try { data = doc.toJS({ maxAliasCount: 0 }); } catch { return fail('This is not valid YAML.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return fail('This is not a configuration file: it must be a list of settings.');
  let nodes = 0;
  const tooBig = (value: unknown, depth: number): boolean => {
    if (depth > MAX_DEPTH) return true;
    if (++nodes > MAX_NODES) return true;
    if (Array.isArray(value)) return value.some((item) => tooBig(item, depth + 1));
    if (value && typeof value === 'object') return Object.values(value as Row).some((item) => tooBig(item, depth + 1));
    return false;
  };
  if (tooBig(data, 0)) return fail('The file is too complex to read.');
  return { ok: true, data: data as Record<string, unknown> };
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Rules for one setting. A rule says what a value must be; it gives back the value to store (brought into range the way the page does it,
// and said so) or why it cannot be used.

type Known = { roles: Set<string> | null; channels: Set<string> | null };
interface RuleContext { known: Known }
type Checked = { ok: true; value: unknown; note?: Msg; warn?: Msg } | { ok: false; reason: Msg };
type Rule = (value: unknown, ctx: RuleContext) => Checked;

const bad = (key: string, vars?: Msg['vars']): Checked => ({ ok: false, reason: { key, vars } });
const good = (value: unknown, note?: Msg): Checked => ({ ok: true, value, note });
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

const bool: Rule = (value) => (typeof value === 'boolean' ? good(value) : bad('Use true or false.'));
const oneOf = (values: readonly string[]): Rule => (value) => (typeof value === 'string' && values.includes(value) ? good(value) : bad('Use one of: {list}.', { list: values.join(', ') }));
/** A number the page brings into range with `clamp`: the stored value is the clamped one and the preview says when it was changed. */
const clamped = (clamp: (n: number) => number): Rule => (value) => {
  if (!isNumber(value)) return bad('Use a number.');
  const out = clamp(value);
  return good(out, out === value ? undefined : { key: 'Brought into the allowed range: {n}.', vars: { n: out } });
};
/** A number the page refuses when it is out of range (a birthday hour, a time zone). */
const strictInt = (min: number, max: number): Rule => (value) => (isNumber(value) && Number.isInteger(value) && value >= min && value <= max ? good(value) : bad('Use a whole number from {a} to {b}.', { a: min, b: max }));
const pageWhole = (min: number, max: number, fallback: number) => clamped((n) => { const w = Math.floor(n); return Number.isFinite(w) ? Math.min(max, Math.max(min, w)) : fallback; });
const idKnown = (id: string, kind: 'role' | 'channel' | 'user', known: Known): boolean => {
  // The members of a server are not listed here: a member id is taken as it is.
  if (kind === 'user') return true;
  const set = kind === 'role' ? known.roles : known.channels;
  return !set || set.has(id);
};
/** A role or channel id, or nothing (null, or empty text). Ids go between quotes: a long number loses its last digits. */
const id = (kind: 'role' | 'channel'): Rule => (value, ctx) => {
  if (value === null || value === '') return good(null);
  if (typeof value !== 'string' || !SNOWFLAKE.test(value)) return bad('Write the id between quotes (a long number loses its last digits).');
  if (idKnown(value, kind, ctx.known)) return good(value);
  return kind === 'role' ? bad('That role is not in this server.') : bad('That channel is not in this server.');
};
const ids = (kind: 'role' | 'channel' | 'user', max: number): Rule => (value, ctx) => {
  if (value === null) return good([]);
  if (!Array.isArray(value)) return bad('Use a list of ids between quotes.');
  const out: string[] = [];
  let missing = 0;
  for (const item of value) {
    if (typeof item !== 'string' || !SNOWFLAKE.test(item)) return bad('Write each id between quotes (a long number loses its last digits).');
    if (!idKnown(item, kind, ctx.known)) { missing += 1; continue; }
    if (!out.includes(item)) out.push(item);
  }
  const kept = out.slice(0, max);
  const warn: Msg | undefined = !missing ? undefined : kind === 'role' ? { key: '{n} roles that are not in this server were left out.', vars: { n: missing } } : { key: '{n} channels that are not in this server were left out.', vars: { n: missing } };
  const note = out.length > kept.length ? { key: 'Only the first {n} are kept.', vars: { n: max } } : undefined;
  return { ok: true, value: kept, note, warn };
};
interface TextOptions { max: number; /** What an empty text becomes: null, a default text, or nothing is allowed. */ empty: 'null' | { text: string }; clean?: (text: string) => string }
const text = (options: TextOptions): Rule => (value) => {
  if (value !== null && typeof value !== 'string') return bad('Use text.');
  let out = String(value ?? '').replace(/\r\n?/g, '\n').trim();
  if (options.clean) out = options.clean(out);
  const long = out.length > options.max;
  out = out.slice(0, options.max);
  if (!out) return good(options.empty === 'null' ? null : options.empty.text);
  return good(out, long ? { key: 'The text was cut to {n} characters.', vars: { n: options.max } } : undefined);
};
const name = (max: number) => (raw: string) => raw.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, max);
/** A list of words as the page keeps them: trimmed, without empty ones. */
const words = (maxItems: number, maxLength: number): Rule => (value) => {
  if (value === null) return good([]);
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string' && typeof item !== 'number')) return bad('Use a list of words.');
  const list = value.map((item) => String(item).trim()).filter(Boolean);
  if (list.length > maxItems) return bad('Too many items (at most {n}).', { n: maxItems });
  if (list.some((item) => item.length > maxLength)) return bad('An item is longer than {n} characters.', { n: maxLength });
  return good(list);
};
/** Invite codes as the AutoMod page keeps them: only the code, lowercase, up to 50. */
const inviteCodes: Rule = (value) => {
  if (value === null) return good([]);
  if (!Array.isArray(value)) return bad('Use a list of invite codes.');
  const out = new Set<string>();
  for (const raw of value) {
    const code = String(raw).trim().replace(/^(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord(?:app)?\.com\/invite)\//i, '').replace(/[?#].*$/, '').replace(/\/+$/, '').toLowerCase();
    if (!/^[a-z0-9-]{2,32}$/.test(code)) return bad('{x} is not an invite code.', { x: String(raw).slice(0, 40) });
    out.add(code);
  }
  if (out.size > 50) return bad('Too many items (at most {n}).', { n: 50 });
  return good([...out]);
};

// ---------------------------------------------------------------------------------------------------------------------------------
// The modules that are imported

interface ModuleSpec {
  id: string;
  title: string;
  /** Where the settings are in the file: [] is the top of the file, [section] a flat section, [section, module] a module of a section. */
  path: string[];
  table: string;
  /** The settings of the file this import understands, and how each is checked (modules that go through a page's own form use `forms`). */
  rules: Record<string, Rule>;
  /** Why the other settings of the same table are left out. */
  leftOut?: string[];
}

const automod = (column: string): Rule => clamped((n) => automodNumber(column, n));
const AUTOMOD_RULES: Record<string, Rule> = {
  word_filter_enabled: bool, word_filter_action: oneOf(['warn', 'mute', 'kick', 'delete']), banned_words: words(1000, 100),
  anti_spam_enabled: bool, max_mentions: automod('max_mentions'),
  anti_raid_enabled: bool, raid_join_threshold: automod('raid_join_threshold'), raid_window_seconds: automod('raid_window_seconds'), raid_action: oneOf(['alert', 'kick', 'lockdown']),
  anti_alt_enabled: bool, anti_alt_min_age_days: automod('anti_alt_min_age_days'), anti_alt_action: oneOf(['kick', 'flag']),
  immune_role_ids: ids('role', 250), allowed_invite_codes: inviteCodes,
  repeat_threshold: automod('repeat_threshold'), repeat_window_seconds: automod('repeat_window_seconds'),
  caps_percent: automod('caps_percent'), caps_min_length: automod('caps_min_length'),
  max_message_length: automod('max_message_length'), max_lines: automod('max_lines'),
  exempt_channel_ids: ids('channel', 50),
  spam_repeat: bool, spam_mentions: bool, spam_invites: bool, spam_caps: bool,
  strike_limit: automod('strike_limit'), strike_window_minutes: automod('strike_window_minutes'), strike_mute_minutes: automod('strike_mute_minutes'),
};

const emoji: Rule = text({ max: 64, empty: { text: '' } });
const COUNTING_RULES: Record<string, Rule> = {
  enabled: bool, channel_id: id('channel'), allow_double: bool, math: bool, reset_on_wrong: bool, delete_wrong: bool, announce_edits: bool,
  react_ok: (v, c) => (v === null || v === '' ? good('✅') : emoji(v, c)),
  react_bad: (v, c) => (v === null || v === '' ? good('❌') : emoji(v, c)),
  react_record: (v, c) => (v === null || v === '' ? good('🏆') : emoji(v, c)),
  saves_max: pageWhole(0, 5, 0), save_every: pageWhole(10, 10000, 100), milestone_every: pageWhole(0, 100000, 100), record_every: pageWhole(0, 100000, 100),
  start_number: pageWhole(0, 1000000, 0), wrong_role_id: id('role'), wrong_role_minutes: pageWhole(0, 10080, 60), alert_seconds: pageWhole(0, 3600, 30),
};

const BIRTHDAY_MESSAGE = '{EMOJI} Happy birthday {user}! Have a great day!';
const BIRTHDAY_RULES: Record<string, Rule> = {
  enabled: bool, channel_id: id('channel'), role_id: id('role'),
  message: text({ max: 1500, empty: { text: BIRTHDAY_MESSAGE } }),
  embed_template: text({ max: 60, empty: 'null', clean: name(60) }),
  hour: strictInt(0, 23), utc_offset_minutes: strictInt(-720, 840),
};

/** The Leveling pages save through four forms; each is read by the page's own function from the form data it would post. */
interface LevelingForm {
  columns: Record<string, string>;
  entries: (row: Row) => [string, string][];
  read: (form: FormData) => Row;
}
const identity = (...columns: string[]) => Object.fromEntries(columns.map((column) => [column, column]));
const LEVELING_FORMS: LevelingForm[] = [
  {
    columns: identity('enabled', 'xp_min', 'xp_max', 'cooldown_seconds', 'xp_per_vc_minute', 'role_mode', 'notify_mode', 'notify_channel_id', 'notify_message', 'notify_embed', 'notify_embed_template', 'notify_every', 'ignored_channel_ids', 'ignored_category_ids', 'notify_reply', 'notify_ping', 'notify_delete_after', 'join_xp', 'join_level', 'curve_a', 'curve_b', 'curve_c', 'difficulty', 'rounding', 'max_level'),
    entries: (row) => configFormEntries(storedConfig(row)),
    read: (form) => readConfigForm(form),
  },
  {
    columns: identity('voice_enabled', 'voice_curve_a', 'voice_curve_b', 'voice_curve_c', 'voice_difficulty', 'voice_rounding', 'voice_max_level', 'voice_notify_mode', 'voice_notify_channel_id', 'voice_notify_message', 'voice_notify_embed', 'voice_notify_embed_template', 'voice_notify_every', 'voice_role_mode', 'voice_ignored_channel_ids', 'voice_ignored_category_ids', 'voice_notify_ping', 'voice_notify_delete_after'),
    entries: (row) => voiceFormEntries(storedVoice(row, storedConfig(row))),
    read: (form) => readVoiceForm(form),
  },
  {
    columns: identity('rank_style', 'rank_card', 'notify_card', 'voice_notify_card'),
    entries: (row) => rankFormEntries(storedRank(row)),
    read: (form) => readRankForm(form),
  },
  {
    columns: { ...identity('min_message_chars', 'anti_repeat', 'voice_min_members', 'voice_ignore_muted', 'daily_bonus_xp', 'streak_bonus_xp', 'streak_max_days', 'xp_multiplier', 'multiplier_mode', 'multiplier_cap', 'keep_xp', 'restore_roles', 'no_xp_role_ids', 'only_xp_role_ids', 'no_xp_user_ids', 'daily_xp_cap', 'voice_alone_percent'), vote_boost_enabled: 'vote_boost' },
    entries: (row) => rulesFormEntries(storedRules(row)),
    read: (form) => { const { row, newest } = readRulesForm(form); return { ...row, ...newest, vote_boost_enabled: newest.vote_boost_enabled }; },
  },
];
const LEVELING_FLOATS = new Set(['curve_a', 'curve_b', 'curve_c', 'difficulty', 'voice_curve_a', 'voice_curve_b', 'voice_curve_c', 'voice_difficulty', 'xp_multiplier', 'multiplier_cap']);
const LEVELING_ENUMS: Record<string, readonly string[]> = {
  role_mode: ['highest', 'all'], voice_role_mode: ['highest', 'all'],
  notify_mode: ['off', 'reply', 'channel', 'dm'], voice_notify_mode: ['off', 'reply', 'channel', 'dm'],
  rank_style: ['card', 'embed', 'both'], multiplier_mode: ['highest', 'stack', 'sum'],
};
const LEVELING_IDS: Record<string, ['role' | 'channel' | 'user', number | null]> = {
  notify_channel_id: ['channel', null], voice_notify_channel_id: ['channel', null],
  ignored_channel_ids: ['channel', 100], ignored_category_ids: ['channel', 100], voice_ignored_channel_ids: ['channel', 100], voice_ignored_category_ids: ['channel', 100],
  no_xp_role_ids: ['role', 100], only_xp_role_ids: ['role', 100], no_xp_user_ids: ['user', 100],
};
const LEVELING_COLUMNS = new Set(LEVELING_FORMS.flatMap((form) => Object.keys(form.columns)));

const SPECS: ModuleSpec[] = [
  { id: 'automod', title: 'Word filter, spam, raids and new accounts', path: ['moderation', 'automod'], table: 'automod_config', rules: AUTOMOD_RULES },
  { id: 'counting', title: 'Counting game', path: ['community', 'counting'], table: 'counting_config', rules: COUNTING_RULES },
  { id: 'birthdays', title: 'Birthdays', path: ['community', 'birthdays'], table: 'birthday_config', rules: BIRTHDAY_RULES },
];

// ---------------------------------------------------------------------------------------------------------------------------------
// Comparing

/** The value the file shows for a setting of a row: the saved one, or the default the file writes for a column that was never set. */
export function shown(table: string, row: Row | null | undefined, column: string): unknown {
  const value = row?.[column];
  if (value !== undefined && value !== null) return value;
  const spec = (CONFIG_SCHEMA[table] ?? []).find((item) => item[0] === column);
  return spec ? spec[2] ?? null : null;
}
export function same(a: unknown, b: unknown): boolean {
  if (Array.isArray(a) || Array.isArray(b)) {
    const x = Array.isArray(a) ? a : a === null || a === undefined ? [] : [a];
    const y = Array.isArray(b) ? b : b === null || b === undefined ? [] : [b];
    return x.length === y.length && x.every((item, index) => String(item) === String(y[index]));
  }
  if (a === null || a === undefined) return b === null || b === undefined || b === '';
  if (typeof a === 'number' || typeof b === 'number') return Number(a) === Number(b);
  return a === b;
}

/**
 * The file shortens long texts (200 characters, ending in an ellipsis) and long lists (200 items, items of 120 characters), so a value of
 * the file can be only the beginning of what is saved. Such a value is never written back: it would cut the saved text.
 */
export function isShortenedCopy(fileValue: unknown, current: unknown): boolean {
  if (typeof fileValue === 'string' && typeof current === 'string') {
    return fileValue.endsWith('\u2026') && current.length >= fileValue.length && current.startsWith(fileValue.slice(0, -1));
  }
  if (Array.isArray(fileValue) && Array.isArray(current) && fileValue.length <= current.length) {
    const cut = fileValue.length === 200 && current.length > 200;
    const itemsCut = fileValue.some((item, index) => isShortenedCopy(item, current[index]));
    if (!cut && !itemsCut) return false;
    return fileValue.every((item, index) => String(item) === String(current[index]) || isShortenedCopy(item, current[index]));
  }
  return false;
}

// ---------------------------------------------------------------------------------------------------------------------------------
// The plan

interface Work { change: PlanChange[]; unchanged: number; invalid: PlanProblem[]; warnings: PlanProblem[]; row: Row }
const newWork = (): Work => ({ change: [], unchanged: 0, invalid: [], warnings: [], row: {} });

function checkWithRules(spec: ModuleSpec, input: Row, row: Row | null | undefined, ctx: RuleContext): Work {
  const work = newWork();
  for (const [column, rule] of Object.entries(spec.rules)) {
    if (!(column in input)) continue;
    if (isShortenedCopy(input[column], shown(spec.table, row, column))) { work.unchanged += 1; continue; }
    const result = rule(input[column], ctx);
    if (!result.ok) { work.invalid.push({ setting: column, value: input[column], reason: result.reason }); continue; }
    if (result.warn) work.warnings.push({ setting: column, value: input[column], reason: result.warn });
    const from = shown(spec.table, row, column);
    if (same(from, result.value)) work.unchanged += 1;
    else { work.change.push({ setting: column, from, to: result.value, note: result.note }); work.row[column] = result.value; }
  }
  return work;
}

/** The leveling settings go through the four forms of the pages: the file's values are put into the form data the page would post, and what the page would save is read back. */
function checkLeveling(input: Row, row: Row | null | undefined, ctx: RuleContext): Work {
  const work = newWork();
  const current = row ?? {};
  for (const form of LEVELING_FORMS) {
    const given = Object.keys(form.columns).filter((column) => column in input);
    if (!given.length) continue;
    const data = new FormData();
    for (const [key, value] of form.entries(current)) data.append(key, value);
    const set = (field: string, value: unknown) => {
      data.delete(field);
      if (typeof value === 'boolean') { if (value) data.append(field, 'on'); return; }
      if (Array.isArray(value)) { for (const item of value) data.append(field, String(item)); return; }
      data.append(field, value === null || value === undefined ? '' : String(value));
    };
    const accepted: { column: string; value: unknown; note?: Msg }[] = [];
    for (const column of given) {
      const value = input[column];
      if (isShortenedCopy(value, shown('level_config', row, column))) { work.unchanged += 1; continue; }
      const columnSpec = CONFIG_SCHEMA.level_config.find((item) => item[0] === column);
      const kind = columnSpec ? columnSpec[1] : 'text';
      let checked: Checked;
      if (LEVELING_ENUMS[column]) checked = oneOf(LEVELING_ENUMS[column])(value, ctx);
      else if (LEVELING_IDS[column]) {
        const [type, max] = LEVELING_IDS[column];
        checked = max === null ? id(type as 'role' | 'channel')(value, ctx) : ids(type, max)(value, ctx);
      } else if (kind === 'bool') checked = bool(value, ctx);
      else if (kind === 'num') checked = !isNumber(value) ? bad('Use a number.') : LEVELING_FLOATS.has(column) || Number.isInteger(value) ? good(value) : bad('Use a whole number.');
      else checked = value === null || typeof value === 'string' ? good(value) : bad('Use text.');
      if (!checked.ok) { work.invalid.push({ setting: column, value, reason: checked.reason }); continue; }
      if (checked.warn) work.warnings.push({ setting: column, value, reason: checked.warn });
      set(form.columns[column], checked.value);
      accepted.push({ column, value: checked.value, note: checked.note });
    }
    if (!accepted.length) continue;
    const saved = form.read(data);
    for (const item of accepted) {
      const stored = saved[item.column];
      const from = shown('level_config', row, item.column);
      if (same(from, stored)) { work.unchanged += 1; continue; }
      const adjusted = !same(stored, item.value) && !LEVELING_ENUMS[item.column];
      work.change.push({ setting: item.column, from, to: stored, note: item.note ?? (adjusted ? { key: 'Brought into the allowed range: {n}.', vars: { n: Array.isArray(stored) ? stored.join(', ') : String(stored) } } : undefined) });
      work.row[item.column] = stored;
    }
  }
  return work;
}

/** The server's own settings: prefixes, language and the mute role, with the rules of the General page. */
function checkGuild(data: Row, row: Row | null | undefined, ctx: RuleContext): { work: Work; parts: WritePart[] } {
  const work = newWork();
  const parts: WritePart[] = [];
  if ('prefixes' in data && data.prefixes !== null) {
    const checked = checkPrefixList(Array.isArray(data.prefixes) ? data.prefixes.map((item) => (typeof item === 'string' || typeof item === 'number' ? String(item) : item)) : null);
    if (checked.problem) work.invalid.push({ setting: 'prefixes', value: data.prefixes, reason: { key: checked.problem.key, vars: checked.problem.vars } });
    else {
      const from = prefixesFromRows(row?.prefixes, row?.prefix);
      if (same(from, checked.prefixes)) work.unchanged += 1;
      else { work.change.push({ setting: 'prefixes', from, to: checked.prefixes }); parts.push({ row: { prefix: checked.prefixes[0], prefixes: checked.prefixes }, after: 'prefix' }); }
    }
  }
  if ('language' in data) {
    const checked = oneOf(['en', 'es', 'pt-BR'])(data.language, ctx);
    if (!checked.ok) work.invalid.push({ setting: 'language', value: data.language, reason: checked.reason });
    else {
      const from = shown('guilds', row, 'language');
      if (same(from, checked.value)) work.unchanged += 1;
      else { work.change.push({ setting: 'language', from, to: checked.value }); parts.push({ row: { language: checked.value }, after: 'language' }); }
    }
  }
  if ('mute_role_id' in data) {
    const checked = id('role')(data.mute_role_id, ctx);
    if (!checked.ok) work.invalid.push({ setting: 'mute_role_id', value: data.mute_role_id, reason: checked.reason });
    else {
      const from = shown('guilds', row, 'mute_role_id');
      if (same(from, checked.value)) work.unchanged += 1;
      else { work.change.push({ setting: 'mute_role_id', from, to: checked.value }); parts.push({ row: { mute_role_id: checked.value } }); }
    }
  }
  return { work, parts };
}

const IGNORED_ONE: Msg = { key: 'Set from its own page of the dashboard.' };
const IGNORED_MANY: Msg = { key: 'Lists are not imported yet.' };
const IGNORED_GUILD_COLUMNS: Record<string, Msg> = {
  prefix: { key: 'It follows the first of the prefixes.' },
  bot_nickname: { key: 'Set from the Customize page (it changes Discord).' },
  bot_avatar_url: { key: 'Set from the Customize page (it changes Discord).' },
  bot_banner_url: { key: 'Set from the Customize page (it changes Discord).' },
  bot_description: { key: 'Set from the Customize page (it changes Discord).' },
  bot_name_style: { key: 'Set from the Customize page (it changes Discord).' },
};

const isMap = (value: unknown): value is Row => !!value && typeof value === 'object' && !Array.isArray(value);
const GUILD_KEYS = new Set<string>(GUILD_COLUMNS as readonly string[]);
const HEADER_KEYS = new Set(['guild_id', 'updated_at', 'exported_at']);

export function buildImportPlan(input: ImportInput): Plan {
  const parsed = parseConfigFile(input.yaml);
  if (!parsed.ok) return parsed;
  const data = parsed.data;
  if ('guild_id' in data && String(data.guild_id) !== input.guildId) return fail('This file is from another server, so it cannot be imported here.');
  const ctx: RuleContext = { known: input.known ?? { roles: null, channels: null } };

  const modules: PlanModule[] = [];
  const ignored: PlanIgnored[] = [];
  const unknown: string[] = [];
  const writes: PlanWrite[] = [];
  const noteUnknown = (path: string) => { if (unknown.length < 50) unknown.push(path); };
  const finish = (id: string, title: string, path: string, table: string, work: Work, parts?: WritePart[]) => {
    modules.push({ id, title, path, changes: work.change, unchanged: work.unchanged, invalid: work.invalid, warnings: work.warnings });
    if (parts?.length) writes.push({ id, table, parts });
    else if (Object.keys(work.row).length) writes.push({ id, table, parts: [{ row: work.row }] });
  };
  const unreadable = (id: string, title: string, path: string) => modules.push({ id, title, path, changes: [], unchanged: 0, invalid: [], warnings: [], unreadable: true });

  // The server's own settings, at the top of the file.
  const guildData: Row = {};
  for (const key of ['prefixes', 'language', 'mute_role_id']) if (key in data) guildData[key] = data[key];
  if (Object.keys(guildData).length) {
    if (input.rows.guilds === undefined) unreadable('guild', 'Server settings', '');
    else { const { work, parts } = checkGuild(guildData, input.rows.guilds, ctx); finish('guild', 'Server settings', '', 'guilds', work, parts); }
  }
  for (const key of Object.keys(data)) {
    if (HEADER_KEYS.has(key) || key in guildData) continue;
    if (key === 'bot_profile') { ignored.push({ path: key, reason: IGNORED_GUILD_COLUMNS.bot_nickname }); continue; }
    if (GUILD_KEYS.has(key)) { ignored.push({ path: key, reason: IGNORED_GUILD_COLUMNS[key] ?? IGNORED_ONE }); continue; }
    if (SECTIONS.some((section) => section.key === key)) continue;
    noteUnknown(key);
  }

  // The sections, in the order of the menu.
  for (const section of SECTIONS) {
    if (!(section.key in data)) continue;
    const body = data[section.key];
    if (!isMap(body)) { noteUnknown(section.key); continue; }
    const levelingHere = section.key === 'leveling';
    const levelingInput: Row = {};
    for (const [key, value] of Object.entries(body)) {
      const path = `${section.key}.${key}`;
      if (key.endsWith('_count')) continue;
      const spec = SPECS.find((item) => item.path[0] === section.key && item.path[1] === key);
      if (spec) {
        if (!isMap(value)) { noteUnknown(path); continue; }
        if (input.rows[spec.table] === undefined) { unreadable(spec.id, spec.title, path); continue; }
        const work = checkWithRules(spec, value, input.rows[spec.table], ctx);
        for (const left of Object.keys(value)) if (!(left in spec.rules) && !left.endsWith('_count')) {
          const known = (CONFIG_SCHEMA[spec.table] ?? []).some((item) => item[0] === left);
          if (known) ignored.push({ path: `${path}.${left}`, reason: IGNORED_ONE }); else noteUnknown(`${path}.${left}`);
        }
        finish(spec.id, spec.title, path, spec.table, work);
        continue;
      }
      if (levelingHere && LEVELING_COLUMNS.has(key)) { levelingInput[key] = value; continue; }
      const mod = section.modules.find((item) => item.key === key);
      if (mod) { ignored.push({ path, reason: mod.mode === 'one' ? IGNORED_ONE : IGNORED_MANY }); continue; }
      // A module whose settings sit straight under the section: one line for the whole module, or one per setting where part of it is imported.
      const flatModule = section.modules.find((item) => item.flat && (CONFIG_SCHEMA[item.table] ?? []).some((column) => column[0] === key));
      if (flatModule) {
        const flatPath = levelingHere ? path : `${section.key}.${flatModule.key}`;
        if (!ignored.some((item) => item.path === flatPath)) ignored.push({ path: flatPath, reason: IGNORED_ONE });
        continue;
      }
      noteUnknown(path);
    }
    if (levelingHere && Object.keys(levelingInput).length) {
      if (input.rows.level_config === undefined) unreadable('leveling', 'Leveling settings', 'leveling');
      else finish('leveling', 'Leveling settings', 'leveling', 'level_config', checkLeveling(levelingInput, input.rows.level_config, ctx));
    }
  }

  const totals = {
    changes: modules.reduce((n, m) => n + m.changes.length, 0),
    unchanged: modules.reduce((n, m) => n + m.unchanged, 0),
    invalid: modules.reduce((n, m) => n + m.invalid.length, 0),
    ignored: ignored.length,
    unknown: unknown.length,
  };
  return { ok: true, guildId: input.guildId, modules, ignored, unknown, totals, writes };
}

/** The plan without what only the server needs (the rows it would write). */
export function publicPlan(plan: PlanOk): Omit<PlanOk, 'writes'> {
  const { writes: _writes, ...rest } = plan;
  return rest;
}

/** The tables the plan needs to read. */
export const IMPORT_TABLES = ['guilds', 'automod_config', 'level_config', 'counting_config', 'birthday_config'] as const;
