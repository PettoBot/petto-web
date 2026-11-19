// The rule of a message role as the dashboard saves it (the same limits as the bot: db/messageRoles.ts of the bot, `/messagerole`). Pure, so the page and the check agree.
export const MAX_MESSAGE_RULES = 25;
export const MAX_MESSAGES = 10_000_000;
export const MAX_PERIOD_DAYS = 365;
const SNOWFLAKE = /^\d{15,25}$/;

export type MessageRuleInput = { roleId: unknown; messages: unknown; mode: unknown; periodDays: unknown; removeBelow: boolean };
export type MessageRule = { roleId: string; messages: number; mode: 'total' | 'period'; periodDays: number; removeBelow: boolean };
/** `ok` with the rule, or not `ok` with the `reason` (and the largest number allowed, for the two numbers). A plain shape: the pages are not in strict mode, where a union would not narrow. */
export interface MessageRuleCheck { ok: boolean; rule?: MessageRule; reason?: 'role' | 'messages' | 'period'; max?: number }

/** The rule to save, or what is wrong with it. A `total` rule never takes the role away (the count only goes up). */
export function checkMessageRule(input: MessageRuleInput): MessageRuleCheck {
  const roleId = String(input.roleId ?? '').trim();
  if (!SNOWFLAKE.test(roleId)) return { ok: false, reason: 'role' };
  const messages = Number(input.messages);
  if (!Number.isInteger(messages) || messages < 1 || messages > MAX_MESSAGES) return { ok: false, reason: 'messages', max: MAX_MESSAGES };
  if (String(input.mode) !== 'period') return { ok: true, rule: { roleId, messages, mode: 'total', periodDays: 0, removeBelow: false } };
  const periodDays = Number(input.periodDays);
  if (!Number.isInteger(periodDays) || periodDays < 1 || periodDays > MAX_PERIOD_DAYS) return { ok: false, reason: 'period', max: MAX_PERIOD_DAYS };
  return { ok: true, rule: { roleId, messages, mode: 'period', periodDays, removeBelow: input.removeBelow === true } };
}
