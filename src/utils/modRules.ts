// The moderation rules of the dashboard: what a rule can look for (triggers), who and where it applies (conditions) and what it does (effects), and the
// cleaning of what the page saves, so a hand-made request cannot save anything else. This is the same as the first and last parts of utils/modRules.ts of the
// bot (the bot cleans again what it reads, and it is the one that looks at messages); keep the two in step.

export const TRIGGER_TYPES = [
  'words', 'regex', 'links', 'invites', 'mentions', 'caps', 'emojis', 'repeated', 'rate', 'attachments', 'length', 'zalgo', 'repeated_chars',
  'channel_rate', 'mention_rate', 'attachment_rate', 'link_rate', 'name', 'violations', 'heat',
] as const;
export const CONDITION_TYPES = ['channel', 'category', 'role', 'account_age', 'member_age', 'no_roles', 'author_kind', 'message_kind', 'thread'] as const;
export const EFFECT_TYPES = [
  'delete', 'reply', 'dm', 'warn', 'timeout', 'kick', 'ban', 'add_role', 'remove_role',
  'purge', 'slowmode', 'alert', 'set_nickname', 'temp_role', 'violation', 'reset_violations', 'add_heat', 'reset_heat', 'quarantine', 'lockdown',
] as const;
/** The effects that happen on every match; the others (the sanctions) wait for the threshold of the rule (a member who does it N times in M minutes). */
export const IMMEDIATE_EFFECTS: readonly string[] = ['delete', 'reply', 'violation', 'reset_violations', 'add_heat', 'reset_heat'];

export type TriggerType = (typeof TRIGGER_TYPES)[number];
export type ConditionType = (typeof CONDITION_TYPES)[number];
export type EffectType = (typeof EFFECT_TYPES)[number];

export const LIMITS = { words: 5000, domains: 1000, ids: 50, triggers: 10, conditions: 10, effects: 10, rulesPerSet: 50, rulesets: 20, lists: 30, text: 500, regex: 200, listName: 60, counterName: 40 } as const;

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
const channelOrNone = (value: unknown): string => (SNOWFLAKE.test(String(value ?? '')) ? String(value) : '');
/** The name of a counter of violations: lowercase letters, numbers, dashes and underscores. */
export const counterName = (value: unknown): string => String(value ?? '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, LIMITS.counterName) || 'default';

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
export const cleanWords = (list: unknown): string[] => (Array.isArray(list) ? [...new Set(list.map((item) => text(item, 80).replace(/\n/g, ' ')).filter(Boolean))].slice(0, LIMITS.words) : []);

// ---- What the dashboard saves ------------------------------------------------------------------------------------------------------------------------

export function cleanTrigger(raw: unknown): Trigger | null {
  const o = asObject(raw);
  if (!TRIGGER_TYPES.includes(o.type as TriggerType)) return null;
  const type = o.type as TriggerType;
  const list = Number(o.list_id) > 0 ? Number(o.list_id) : null;
  switch (type) {
    case 'words': return { type, list_id: list, words: cleanWords(o.words), match: oneOf(o.match, ['contains', 'word', 'exact'] as const, 'word') };
    case 'regex': return safeRegex(o.pattern) ? { type, pattern: String(o.pattern) } : null;
    case 'links': return { type, mode: oneOf(o.mode, ['any', 'deny', 'allow'] as const, 'any'), list_id: list, domains: cleanDomains(o.domains) };
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
    case 'channel_rate': return { type, messages: int(o.messages, 3, 200, 20), seconds: int(o.seconds, 2, 300, 10) };
    case 'mention_rate': return { type, mentions: int(o.mentions, 2, 200, 10), seconds: int(o.seconds, 2, 300, 10) };
    case 'attachment_rate': return { type, attachments: int(o.attachments, 2, 100, 6), seconds: int(o.seconds, 2, 300, 30) };
    case 'link_rate': return { type, links: int(o.links, 2, 100, 5), seconds: int(o.seconds, 2, 300, 30) };
    case 'name': {
      const match = oneOf(o.match, ['contains', 'word', 'exact', 'regex'] as const, 'contains');
      if (match === 'regex' && !safeRegex(o.pattern)) return null;
      return { type, where: oneOf(o.where, ['username', 'nickname', 'either'] as const, 'either'), match, list_id: list, words: cleanWords(o.words), pattern: match === 'regex' ? String(o.pattern) : '' };
    }
    case 'violations': return { type, name: counterName(o.name), count: int(o.count, 1, 100, 4), minutes: int(o.minutes, 1, 1440, 60) };
    case 'heat': return { type, at_least: int(o.at_least, 1, 10000, 100) };
  }
  return null;
}

export function cleanCondition(raw: unknown): Condition | null {
  const o = asObject(raw);
  if (!CONDITION_TYPES.includes(o.type as ConditionType)) return null;
  const type = o.type as ConditionType;
  switch (type) {
    case 'channel': case 'category': return { type, mode: oneOf(o.mode, ['in', 'not_in'] as const, 'not_in'), ids: ids(o.ids) };
    case 'role': return { type, mode: oneOf(o.mode, ['has_any', 'has_all', 'has_none'] as const, 'has_none'), ids: ids(o.ids) };
    case 'account_age': case 'member_age': return { type, max_days: int(o.max_days, 1, 3650, 7) };
    case 'no_roles': return { type };
    case 'author_kind': return { type, kind: oneOf(o.kind, ['humans', 'bots'] as const, 'humans') };
    case 'message_kind': return { type, kind: oneOf(o.kind, ['new', 'edited'] as const, 'new') };
    case 'thread': return { type, mode: oneOf(o.mode, ['only', 'ignore'] as const, 'ignore') };
  }
  return null;
}

export function cleanEffect(raw: unknown): Effect | null {
  const o = asObject(raw);
  if (!EFFECT_TYPES.includes(o.type as EffectType)) return null;
  const type = o.type as EffectType;
  switch (type) {
    case 'delete': case 'kick': case 'reset_heat': case 'quarantine': return { type };
    case 'reply': return { type, text: text(o.text, LIMITS.text), delete_after: int(o.delete_after, 0, 600, 10) };
    case 'dm': return { type, text: text(o.text, LIMITS.text) };
    case 'warn': return { type, reason: text(o.reason, 200) };
    case 'timeout': return { type, minutes: int(o.minutes, 1, 40320, 10), multiplier: int(o.multiplier, 1, 10, 1), max_minutes: int(o.max_minutes, 1, 40320, 40320), window_hours: int(o.window_hours, 1, 720, 168) };
    case 'ban': return { type, reason: text(o.reason, 200), delete_days: int(o.delete_days, 0, 7, 0) };
    case 'add_role': case 'remove_role': return SNOWFLAKE.test(String(o.role_id ?? '')) ? { type, role_id: String(o.role_id) } : null;
    case 'purge': return { type, count: int(o.count, 2, 100, 10), minutes: int(o.minutes, 1, 1440, 10) };
    case 'slowmode': return { type, seconds: int(o.seconds, 1, 21600, 10), minutes: int(o.minutes, 1, 1440, 10) };
    case 'alert': return { type, channel_id: channelOrNone(o.channel_id), text: text(o.text, LIMITS.text) };
    case 'set_nickname': return { type, nickname: text(o.nickname, 32) };
    case 'temp_role': return SNOWFLAKE.test(String(o.role_id ?? '')) ? { type, role_id: String(o.role_id), minutes: int(o.minutes, 1, 43200, 60) } : null;
    case 'violation': case 'reset_violations': return { type, name: counterName(o.name) };
    case 'add_heat': return { type, amount: int(o.amount, 1, 1000, 20) };
    case 'lockdown': return { type, minutes: int(o.minutes, 1, 720, 10) };
  }
  return null;
}

const cleanList = <T>(raw: unknown, clean: (item: unknown) => T | null, max: number): T[] => (Array.isArray(raw) ? raw.map(clean).filter((item): item is T => item !== null).slice(0, max) : []);

export interface RuleInput {
  name: string; enabled: boolean; dry_run: boolean; trigger_mode: 'any' | 'all'; triggers: Trigger[]; conditions: Condition[]; effects: Effect[];
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
      name, enabled: o.enabled !== false, dry_run: o.dry_run === true, trigger_mode: oneOf(o.trigger_mode, ['any', 'all'] as const, 'any'), triggers, effects,
      conditions: cleanList(o.conditions, cleanCondition, LIMITS.conditions),
      threshold_count: int(o.threshold_count, 1, 50, 1), threshold_minutes: int(o.threshold_minutes, 1, 1440, 10), stop: o.stop !== false,
    },
  };
}

export const cleanConditions = (raw: unknown): Condition[] => cleanList(raw, cleanCondition, LIMITS.conditions);

// ---- The join gate: what is looked at when somebody joins ----------------------------------------------------------------------------------------------

export const GATE_ACTIONS = ['none', 'alert', 'timeout', 'kick', 'ban', 'quarantine'] as const;
export type GateAction = (typeof GATE_ACTIONS)[number];
export const RAID_ACTIONS = ['alert', 'lockdown', 'kick_new', 'ban_new'] as const;
export type RaidAction = (typeof RAID_ACTIONS)[number];

export interface JoinGate {
  enabled: boolean;
  no_avatar_action: GateAction;
  account_age_days: number; account_age_action: GateAction;
  username_list_id: number | null; username_words: string[]; username_action: GateAction;
  timeout_minutes: number;
  raid_joins: number; raid_seconds: number; raid_action: RaidAction; raid_lockdown_minutes: number; raid_alert_channel_id: string;
}

export const DEFAULT_GATE: JoinGate = {
  enabled: false, no_avatar_action: 'none', account_age_days: 0, account_age_action: 'none', username_list_id: null, username_words: [], username_action: 'none',
  timeout_minutes: 60, raid_joins: 0, raid_seconds: 30, raid_action: 'alert', raid_lockdown_minutes: 10, raid_alert_channel_id: '',
};

export function cleanJoinGate(raw: unknown): JoinGate {
  const o = asObject(raw);
  return {
    enabled: o.enabled === true,
    no_avatar_action: oneOf(o.no_avatar_action, GATE_ACTIONS, 'none'),
    account_age_days: int(o.account_age_days, 0, 365, 0), account_age_action: oneOf(o.account_age_action, GATE_ACTIONS, 'none'),
    username_list_id: Number(o.username_list_id) > 0 ? Number(o.username_list_id) : null, username_words: cleanWords(o.username_words), username_action: oneOf(o.username_action, GATE_ACTIONS, 'none'),
    timeout_minutes: int(o.timeout_minutes, 1, 40320, 60),
    raid_joins: int(o.raid_joins, 0, 500, 0), raid_seconds: int(o.raid_seconds, 5, 600, 30), raid_action: oneOf(o.raid_action, RAID_ACTIONS, 'alert'),
    raid_lockdown_minutes: int(o.raid_lockdown_minutes, 1, 720, 10), raid_alert_channel_id: channelOrNone(o.raid_alert_channel_id),
  };
}
