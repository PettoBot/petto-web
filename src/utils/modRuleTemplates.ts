// Ready-made rules of the Moderation rules page ("Add from a template"): each one is a rule as the page saves it (the bot reads it like any other), with its words and domains
// written in the rule itself, so adding one does not make a list. What each one is called and says is in DashRules.astro (it is translated there).
import type { Condition, Effect, Trigger } from './modRules';

export interface RuleTemplate {
  id: string;
  rule: { name: string; trigger_mode?: 'any' | 'all'; triggers: Trigger[]; conditions?: Condition[]; effects: Effect[]; threshold_count?: number; threshold_minutes?: number; stop?: boolean };
}

const t = (trigger: Record<string, unknown>) => trigger as Trigger;
const e = (effect: Record<string, unknown>) => effect as Effect;
const c = (condition: Record<string, unknown>) => condition as Condition;

// Domains that are known only for scams of fake gifts and Nitro (and look like the real ones). A server can add its own in a list.
const SCAM_DOMAINS = ['discord-nitro.gift', 'discordnitro.gift', 'discord-gift.com', 'discordgift.site', 'discord-giveaway.com', 'dlscord.gift', 'dicsord.gift', 'discorcl.gift', 'steamcommunlty.com', 'steamcornmunity.com', 'steam-gift.ru'];

export const RULE_TEMPLATES: RuleTemplate[] = [
  { id: 'flood', rule: { name: 'Message flood', triggers: [t({ type: 'rate', messages: 6, seconds: 8 })], effects: [e({ type: 'delete' }), e({ type: 'timeout', minutes: 10, multiplier: 3, max_minutes: 1440, window_hours: 24 })], stop: true } },
  { id: 'repeat', rule: { name: 'The same message again', triggers: [t({ type: 'repeated', times: 3, seconds: 30 })], effects: [e({ type: 'delete' }), e({ type: 'warn', reason: 'Repeating the same message' })], threshold_count: 2, threshold_minutes: 10 } },
  { id: 'invites-new', rule: { name: 'No invites from new accounts', triggers: [t({ type: 'invites' })], conditions: [c({ type: 'account_age', max_days: 7 })], effects: [e({ type: 'delete' }), e({ type: 'reply', text: '{user}, new accounts cannot share invites.', delete_after: 10 }), e({ type: 'timeout', minutes: 60, multiplier: 1, max_minutes: 60, window_hours: 24 })] } },
  { id: 'scam-links', rule: { name: 'Scam links', triggers: [t({ type: 'links', mode: 'deny', domains: SCAM_DOMAINS }), t({ type: 'words', match: 'contains', words: ['free nitro', 'nitro gift', 'steam gift', 'claim your gift'] })], effects: [e({ type: 'delete' }), e({ type: 'timeout', minutes: 1440, multiplier: 1, max_minutes: 1440, window_hours: 24 }), e({ type: 'alert', channel_id: '', text: '{rule}: {user} in {channel}' })] } },
  { id: 'mass-mentions', rule: { name: 'Mass mentions', triggers: [t({ type: 'mentions', kind: 'any', max: 5 })], effects: [e({ type: 'delete' }), e({ type: 'timeout', minutes: 30, multiplier: 2, max_minutes: 1440, window_hours: 24 })] } },
  { id: 'mention-rate', rule: { name: 'Mentions too fast', triggers: [t({ type: 'mention_rate', mentions: 10, seconds: 10 })], effects: [e({ type: 'delete' }), e({ type: 'purge', count: 20, minutes: 5 }), e({ type: 'timeout', minutes: 60, multiplier: 1, max_minutes: 60, window_hours: 24 })] } },
  { id: 'caps', rule: { name: 'Shouting', triggers: [t({ type: 'caps', percent: 70, min_length: 15 })], effects: [e({ type: 'delete' }), e({ type: 'reply', text: '{user}, please do not shout.', delete_after: 8 })] } },
  { id: 'emoji-wall', rule: { name: 'Emoji spam', triggers: [t({ type: 'emojis', max: 12 })], effects: [e({ type: 'delete' })] } },
  { id: 'wall-of-text', rule: { name: 'Walls of text', triggers: [t({ type: 'length', max_chars: 1500, max_lines: 15 })], effects: [e({ type: 'delete' }), e({ type: 'reply', text: '{user}, that message is too long.', delete_after: 8 })] } },
  { id: 'zalgo', rule: { name: 'Zalgo and repeated characters', triggers: [t({ type: 'zalgo', max: 8 }), t({ type: 'repeated_chars', max: 12 })], effects: [e({ type: 'delete' })] } },
  { id: 'link-flood', rule: { name: 'Link flood from new members', triggers: [t({ type: 'link_rate', links: 5, seconds: 30 })], conditions: [c({ type: 'member_age', max_days: 3 })], effects: [e({ type: 'delete' }), e({ type: 'purge', count: 20, minutes: 5 }), e({ type: 'timeout', minutes: 120, multiplier: 1, max_minutes: 120, window_hours: 24 })] } },
  { id: 'strikes', rule: { name: 'Three strikes: timeout', triggers: [t({ type: 'violations', name: 'strikes', count: 3, minutes: 60 })], effects: [e({ type: 'timeout', minutes: 30, multiplier: 2, max_minutes: 1440, window_hours: 24 }), e({ type: 'reset_violations', name: 'strikes' })] } },
  { id: 'heat', rule: { name: 'Heat from fast messages', triggers: [t({ type: 'rate', messages: 4, seconds: 6 })], effects: [e({ type: 'add_heat', amount: 25 })], stop: false } },
  { id: 'heat-act', rule: { name: 'Too hot: timeout', triggers: [t({ type: 'heat', at_least: 100 })], effects: [e({ type: 'timeout', minutes: 15, multiplier: 2, max_minutes: 1440, window_hours: 24 }), e({ type: 'reset_heat' })] } },
];
