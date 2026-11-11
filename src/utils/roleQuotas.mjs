// Role quotas ("a member who holds this role must send at least N messages in each period; after M periods in a row below it, the role is taken away").
// The rules are the bot's (petto-bot src/utils/roleQuotas.js and src/db/roleQuotas.js, tables `role_quotas` and `role_quota_members`): keep both equal.
// Plain JavaScript so scripts/check-dash-role-quotas.mjs runs it with node alone.

export const MAX_RULES = 25;
export const MAX_PERIOD_DAYS = 90;
export const MAX_MESSAGES = 100000;
export const MAX_STRIKES = 20;
export const SNOWFLAKE = /^\d{15,25}$/;
/** @type {{ readonly periodDays: number, readonly strikes: number }} */
export const DEFAULTS = Object.freeze({ periodDays: 7, strikes: 3 });

const whole = (value) => {
  const text = String(value ?? '').trim();
  return /^\d{1,7}$/.test(text) ? Number(text) : NaN;
};

/**
 * The same checks as the bot's `rolequota set`. `role` has `id` and `managed` (null when it does not exist in the server), `guildId` is the server and
 * `existingRoleIds` are the roles that already have a quota. Returns `{ ok: true, rule }` or `{ ok: false, error }`.
 * @param {{ role: { id: string, managed: boolean } | null, guildId: string, messages: any, periodDays?: any, strikes?: any, notifyDm?: boolean, reportChannelId?: string | null, existingRoleIds?: string[] }} input
 */
export function validateRule({ role, guildId, messages, periodDays = DEFAULTS.periodDays, strikes = DEFAULTS.strikes, notifyDm = true, reportChannelId = null, existingRoleIds = [] }) {
  if (!role) return { ok: false, error: 'noRole' };
  if (role.id === guildId) return { ok: false, error: 'everyone' };
  if (role.managed) return { ok: false, error: 'managed' };
  const min = whole(messages);
  if (!Number.isInteger(min) || min < 1 || min > MAX_MESSAGES) return { ok: false, error: 'badMessages' };
  const days = whole(periodDays);
  if (!Number.isInteger(days) || days < 1 || days > MAX_PERIOD_DAYS) return { ok: false, error: 'badPeriod' };
  const max = whole(strikes);
  if (!Number.isInteger(max) || max < 1 || max > MAX_STRIKES) return { ok: false, error: 'badStrikes' };
  if (!existingRoleIds.includes(role.id) && existingRoleIds.length >= MAX_RULES) return { ok: false, error: 'tooMany' };
  const channel = reportChannelId ? String(reportChannelId) : null;
  if (channel && !SNOWFLAKE.test(channel)) return { ok: false, error: 'badChannel' };
  return {
    ok: true,
    rule: { role_id: role.id, period_days: days, min_messages: min, max_strikes: max, notify_dm: Boolean(notifyDm), report_channel_id: channel, period_started_at: new Date().toISOString() },
  };
}

/** A row of `role_quotas` as the page shows it. */
export function cleanRule(row) {
  return {
    roleId: String(row?.role_id ?? ''),
    periodDays: Number(row?.period_days) || DEFAULTS.periodDays,
    minMessages: Number(row?.min_messages) || 0,
    maxStrikes: Number(row?.max_strikes) || DEFAULTS.strikes,
    notifyDm: row?.notify_dm !== false,
    reportChannelId: SNOWFLAKE.test(String(row?.report_channel_id ?? '')) ? String(row.report_channel_id) : null,
    startedAt: String(row?.period_started_at ?? ''),
    lastRunAt: row?.last_run_at ? String(row.last_run_at) : null,
    lastMet: Number.isFinite(Number(row?.last_met)) && row?.last_met !== null ? Number(row.last_met) : null,
    lastMissed: Number.isFinite(Number(row?.last_missed)) && row?.last_missed !== null ? Number(row.last_missed) : null,
    lastRemoved: Number.isFinite(Number(row?.last_removed)) && row?.last_removed !== null ? Number(row.last_removed) : null,
  };
}

/** When the running period ends (an ISO time), from when it started. */
export function periodEnd(startedAt, periodDays) {
  const start = new Date(startedAt).getTime();
  return Number.isFinite(start) ? new Date(start + periodDays * 86400000).toISOString() : null;
}

/** Administrator only, the same as the command (a quota takes a role away by itself): the visitor's own permissions in the server, read from Discord, never the cookie. */
export function canEditRoleQuotas(guild) {
  if (!guild) return false;
  if (guild.owner) return true;
  try { return (BigInt(guild.permissions ?? '0') & 0x8n) === 0x8n; } catch { return false; }
}
