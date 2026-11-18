// The moderation rules of the dashboard: what a rule can look for (triggers), who and where it applies (conditions) and what it does (effects), and the
// cleaning of what the page saves, so a hand-made request cannot save anything else. This is the same as the first half of utils/modRules.ts of the bot
// (the bot cleans again what it reads); keep the two in step.

export const TRIGGER_TYPES = ['words', 'regex', 'links', 'invites', 'mentions', 'caps', 'emojis', 'repeated', 'rate', 'attachments', 'length', 'zalgo', 'repeated_chars'] as const;
export const CONDITION_TYPES = ['channel', 'category', 'role', 'account_age', 'member_age', 'no_roles'] as const;
export const EFFECT_TYPES = ['delete', 'reply', 'dm', 'warn', 'timeout', 'kick', 'ban', 'add_role', 'remove_role'] as const;
/** The effects that happen on every match; the others wait for the threshold of the rule (a member who does it N times in M minutes). */
export const IMMEDIATE_EFFECTS: readonly string[] = ['delete', 'reply'];

export type TriggerType = (typeof TRIGGER_TYPES)[number];
export type ConditionType = (typeof CONDITION_TYPES)[number];
export type EffectType = (typeof EFFECT_TYPES)[number];

export const LIMITS = { words: 500, domains: 200, ids: 50, triggers: 10, conditions: 10, effects: 8, rulesPerSet: 50, rulesets: 20, lists: 30, text: 500, regex: 200, listName: 60 } as const;

export interface Trigger { type: TriggerType; [key: string]: unknown }
export interface Condition { type: ConditionType; [key: string]: unknown }
export interface Effect { type: EffectType; [key: string]: unknown }

const asObject = (value: unknown): Record<string, unknown> => (value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {});
const int = (value: unknown, min: number, max: number, fallback: number): number => {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : fallback;
};
const SNOWFLAKE = /^\d{15,25}$/;
const ids = (value: unknown): string[] => (Array.isArray(value) ? [...new Set(value.map(String).filter((v) => SNOWFLAKE.test(v)))].slice(0, LIMITS.ids) : []);
const oneOf = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => (allowed.includes(value as T) ? (value as T) : fallback);
const text = (value: unknown, max: number): string => String(value ?? '').replace(/\u0000/g, '').replace(/\r\n?/g, '\n').trim().slice(0, max);

/** Lowercase, no accents, no invisible characters: how a message and the words of a list are compared. */
export function normalizeText(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').replace(/[​-‏⁠-⁤﻿]/g, '').toLowerCase();
}

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A pattern the server wrote: short, valid, and without the shapes that make a regular expression run for ever (a group repeated inside a group). */
export function safeRegex(pattern: unknown): RegExp | null {
  const source = String(pattern ?? '');
  if (!source || source.length > LIMITS.regex) return null;
  if (/\([^)]*[+*][^)]*\)[+*{]/.test(source) || /\\[1-9]/.test(source) || /\(\?[=!<]/.test(source)) return null;
  try { return new RegExp(source, 'iu'); } catch { return null; }
}

/** The words of a list as a function: whether a text has one of them, as part of a word, as a whole word, or is exactly one. */
export function wordMatcher(words: readonly string[], match: 'contains' | 'word' | 'exact'): (content: string) => string | null {
  const clean = [...new Set(words.map((word) => normalizeText(String(word)).trim()).filter(Boolean))].slice(0, LIMITS.words);
  if (!clean.length) return () => null;
  if (match === 'exact') {
    const set = new Set(clean);
    return (content) => { const found = normalizeText(content).trim(); return set.has(found) ? found : null; };
  }
  const body = clean.sort((a, b) => b.length - a.length).map(escapeRegex).join('|');
  const re = match === 'word' ? new RegExp(`(?<![\\p{L}\\p{N}])(?:${body})(?![\\p{L}\\p{N}])`, 'u') : new RegExp(body, 'u');
  return (content) => re.exec(normalizeText(content))?.[0] ?? null;
}

const HOST = /(?:https?:\/\/|www\.)([a-z0-9][a-z0-9.-]*[a-z0-9])(?::\d+)?/gi;
/** The hosts of the links of a text (only links with `http(s)://` or `www.`: a file name is not a link). */
export function linkHosts(content: string): string[] {
  const hosts: string[] = [];
  for (const match of content.matchAll(HOST)) hosts.push(match[1].toLowerCase().replace(/^www\./, ''));
  return hosts;
}
export const hostMatches = (host: string, domain: string): boolean => host === domain || host.endsWith(`.${domain}`);
const cleanDomain = (value: string): string => value.trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').replace(/[/?#].*$/, '').replace(/:\d+$/, '');
export const cleanDomains = (list: unknown): string[] => (Array.isArray(list) ? [...new Set(list.map((item) => cleanDomain(String(item))).filter((d) => /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(d)))].slice(0, LIMITS.domains) : []);
export const cleanWords = (list: unknown): string[] => (Array.isArray(list) ? [...new Set(list.map((item) => text(item, 80)).filter(Boolean))].slice(0, LIMITS.words) : []);

// ---- What the dashboard saves ------------------------------------------------------------------------------------------------------------------------

export function cleanTrigger(raw: unknown): Trigger | null {
  const o = asObject(raw);
  const type = oneOf(o.type, TRIGGER_TYPES, 'words');
  if (!TRIGGER_TYPES.includes(o.type as TriggerType)) return null;
  switch (type) {
    case 'words': return { type, list_id: Number(o.list_id) > 0 ? Number(o.list_id) : null, words: cleanWords(o.words), match: oneOf(o.match, ['contains', 'word', 'exact'] as const, 'word') };
    case 'regex': return safeRegex(o.pattern) ? { type, pattern: String(o.pattern) } : null;
    case 'links': return { type, mode: oneOf(o.mode, ['any', 'deny', 'allow'] as const, 'any'), list_id: Number(o.list_id) > 0 ? Number(o.list_id) : null, domains: cleanDomains(o.domains) };
    case 'invites': return { type };
    case 'mentions': return { type, kind: oneOf(o.kind, ['any', 'users', 'roles', 'everyone'] as const, 'any'), max: int(o.max, 0, 100, 5) };
    case 'caps': return { type, percent: int(o.percent, 30, 100, 70), min_length: int(o.min_length, 5, 500, 12) };
    case 'emojis': return { type, max: int(o.max, 1, 200, 10) };
    case 'repeated': return { type, times: int(o.times, 2, 20, 3), seconds: int(o.seconds, 3, 600, 30) };
    case 'rate': return { type, messages: int(o.messages, 2, 50, 6), seconds: int(o.seconds, 2, 120, 8) };
    case 'attachments': return { type, kind: oneOf(o.kind, ['any', 'images', 'files'] as const, 'any'), max: int(o.max, 0, 20, 0) };
    case 'length': return { type, max_chars: int(o.max_chars, 0, 4000, 0), max_lines: int(o.max_lines, 0, 200, 0) };
    case 'zalgo': return { type, max: int(o.max, 3, 100, 8) };
    case 'repeated_chars': return { type, max: int(o.max, 3, 100, 10) };
  }
  return null;
}

export function cleanCondition(raw: unknown): Condition | null {
  const o = asObject(raw);
  if (!CONDITION_TYPES.includes(o.type as ConditionType)) return null;
  const type = o.type as ConditionType;
  switch (type) {
    case 'channel': case 'category': return { type, mode: oneOf(o.mode, ['in', 'not_in'] as const, 'not_in'), ids: ids(o.ids) };
    case 'role': return { type, mode: oneOf(o.mode, ['has_any', 'has_none'] as const, 'has_none'), ids: ids(o.ids) };
    case 'account_age': case 'member_age': return { type, max_days: int(o.max_days, 1, 3650, 7) };
    case 'no_roles': return { type };
  }
  return null;
}

export function cleanEffect(raw: unknown): Effect | null {
  const o = asObject(raw);
  if (!EFFECT_TYPES.includes(o.type as EffectType)) return null;
  const type = o.type as EffectType;
  switch (type) {
    case 'delete': case 'kick': return { type };
    case 'reply': return { type, text: text(o.text, LIMITS.text), delete_after: int(o.delete_after, 0, 600, 10) };
    case 'dm': return { type, text: text(o.text, LIMITS.text) };
    case 'warn': return { type, reason: text(o.reason, 200) };
    case 'timeout': return { type, minutes: int(o.minutes, 1, 40320, 10) };
    case 'ban': return { type, reason: text(o.reason, 200), delete_days: int(o.delete_days, 0, 7, 0) };
    case 'add_role': case 'remove_role': return SNOWFLAKE.test(String(o.role_id ?? '')) ? { type, role_id: String(o.role_id) } : null;
  }
  return null;
}

const cleanList = <T>(raw: unknown, clean: (item: unknown) => T | null, max: number): T[] => (Array.isArray(raw) ? raw.map(clean).filter((item): item is T => item !== null).slice(0, max) : []);

export interface RuleInput {
  name: string; enabled: boolean; trigger_mode: 'any' | 'all'; triggers: Trigger[]; conditions: Condition[]; effects: Effect[];
  threshold_count: number; threshold_minutes: number; stop: boolean;
}

/** A rule as the dashboard saves it, cleaned. A rule with nothing to look for or nothing to do is refused (`error`). */
export function cleanRule(raw: unknown): { ok: true; rule: RuleInput } | { ok: false; error: string } {
  const o = asObject(raw);
  const name = text(o.name, LIMITS.listName);
  if (!name) return { ok: false, error: 'name' };
  const triggers = cleanList(o.triggers, cleanTrigger, LIMITS.triggers);
  if (!triggers.length) return { ok: false, error: 'triggers' };
  const effects = cleanList(o.effects, cleanEffect, LIMITS.effects);
  if (!effects.length) return { ok: false, error: 'effects' };
  return {
    ok: true,
    rule: {
      name, enabled: o.enabled !== false, trigger_mode: oneOf(o.trigger_mode, ['any', 'all'] as const, 'any'), triggers, effects,
      conditions: cleanList(o.conditions, cleanCondition, LIMITS.conditions),
      threshold_count: int(o.threshold_count, 1, 50, 1), threshold_minutes: int(o.threshold_minutes, 1, 1440, 10), stop: o.stop !== false,
    },
  };
}

export const cleanConditions = (raw: unknown): Condition[] => cleanList(raw, cleanCondition, LIMITS.conditions);
