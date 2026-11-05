// Role triggers ("a member who is given this role, or holds it when they finish Discord's onboarding, gets this action"). The rules are the
// bot's (petto-bot src/utils/roleTriggers.js and src/db/roleTriggers.js, table `role_triggers`): keep both equal. Plain JavaScript so
// scripts/check-dash-role-triggers.mjs runs it with node alone.

export const ACTIONS = Object.freeze(['warn', 'mute', 'jail', 'kick', 'ban', 'remove_role']);
export const TRIGGERS = Object.freeze(['role_added', 'onboarding', 'either']);
export const DURATION_ACTIONS = Object.freeze(['mute', 'jail', 'ban']);
export const MAX_RULES = 25;
export const MAX_REASON = 200;
export const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000;
export const SNOWFLAKE = /^\d{15,25}$/;

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Every way of writing a unit, as the bot reads them (English, Spanish and Portuguese).
const UNITS = new Map();
for (const [names, value] of [
  [['ms', 'msec', 'millisecond', 'milliseconds', 'milisegundo', 'milisegundos'], 1],
  [['s', 'sec', 'secs', 'second', 'seconds', 'seg', 'segs', 'segundo', 'segundos'], SECOND],
  [['m', 'min', 'mins', 'minute', 'minutes', 'minuto', 'minutos'], MINUTE],
  [['h', 'hr', 'hrs', 'hour', 'hours', 'hora', 'horas'], HOUR],
  [['d', 'day', 'days', 'dia', 'dias', 'día', 'días'], DAY],
  [['w', 'wk', 'wks', 'week', 'weeks', 'sem', 'semana', 'semanas'], 7 * DAY],
  [['mo', 'month', 'months', 'mes', 'meses', 'mês'], 30 * DAY],
  [['y', 'yr', 'yrs', 'year', 'years', 'año', 'años', 'ano', 'anos'], 365 * DAY],
]) for (const name of names) UNITS.set(name, value);

const PIECE = /(\d+(?:[.,]\d+)?)\s*([a-záéíóúñêç]+)/giy;
const GLUE = /^[\s,]*(?:and|y|e)?[\s,]*/i;

/**
 * A length of time as people write it ("10m", "2h", "7d", "3d 4h", "1h30m", "1 hour 30 minutes") in milliseconds, or null when it is not valid
 * or not positive. The bot also falls back on the `ms` library for a bare number; here a number without a unit is refused (it is ambiguous).
 * @param {unknown} input
 * @returns {number | null}
 */
export function parseDuration(input) {
  const text = String(input ?? '').trim().toLowerCase();
  if (!text || text.length > 64) return null;
  let total = 0;
  let index = 0;
  let pieces = 0;
  while (index < text.length) {
    index += (GLUE.exec(text.slice(index)) ?? [''])[0].length;
    if (index >= text.length) break;
    PIECE.lastIndex = index;
    const match = PIECE.exec(text);
    if (!match) return null;
    const unit = UNITS.get(match[2]);
    if (!unit) return null;
    total += Number(match[1].replace(',', '.')) * unit;
    index = PIECE.lastIndex;
    pieces += 1;
  }
  return pieces > 0 && Number.isFinite(total) && total > 0 ? Math.round(total) : null;
}

/**
 * A length of time in the short form of the form's own units ("1d 2h", "30m", "45s"): the same letters the field accepts.
 * @param {unknown} ms
 * @returns {string}
 */
export function shortDuration(ms) {
  let left = Math.round(Number(ms));
  if (!Number.isFinite(left) || left <= 0) return '';
  if (left < SECOND) return `${left}ms`;
  const parts = [];
  for (const [unit, size] of [['d', DAY], ['h', HOUR], ['m', MINUTE], ['s', SECOND]]) {
    const n = Math.floor(left / size);
    if (n > 0) { parts.push(`${n}${unit}`); left -= n * size; }
  }
  return parts.slice(0, 3).join(' ');
}

/**
 * The same checks as the bot's `validateRule`. `role` has `id` and `managed` (null when the role is not in the server); `existingRoleIds` are the
 * roles that already have a rule. Returns `{ ok: true, rule }` (`rule` is what is saved: `role_id`, `action`, `duration_ms`, `reason`, `on_event`)
 * or `{ ok: false, error }` (the same words as the bot's `automation.roletrigger.error.<error>`).
 * @param {{ role: { id: string, managed?: boolean } | null, guildId: string, action: unknown, duration?: unknown, reason?: unknown, on?: unknown, existingRoleIds?: string[] }} input
 */
export function validateRule({ role, guildId, action, duration = null, reason = null, on = 'role_added', existingRoleIds = [] }) {
  if (!role) return { ok: false, error: 'noRole' };
  if (role.id === guildId) return { ok: false, error: 'everyone' };
  if (role.managed) return { ok: false, error: 'managed' };
  if (!ACTIONS.includes(/** @type {string} */ (action))) return { ok: false, error: 'badAction' };
  if (!TRIGGERS.includes(/** @type {string} */ (on))) return { ok: false, error: 'badOn' };
  if (!existingRoleIds.includes(role.id) && existingRoleIds.length >= MAX_RULES) return { ok: false, error: 'tooMany' };
  let durationMs = null;
  if (duration) {
    if (!DURATION_ACTIONS.includes(/** @type {string} */ (action))) return { ok: false, error: 'noDuration' };
    durationMs = parseDuration(duration);
    if (!durationMs) return { ok: false, error: 'badDuration' };
    if (action === 'mute' && durationMs > MAX_TIMEOUT_MS) return { ok: false, error: 'timeoutCap' };
  }
  const text = reason ? String(reason).trim() : '';
  if (text.length > MAX_REASON) return { ok: false, error: 'reasonLong' };
  return { ok: true, rule: { role_id: role.id, action, duration_ms: durationMs, reason: text || null, on_event: on } };
}

/**
 * A row of `role_triggers` made safe to draw: unknown actions and triggers are shown as they are never (they fall back), numbers are numbers.
 * @param {any} row
 */
export function cleanRule(row) {
  return {
    roleId: String(row?.role_id ?? ''),
    action: ACTIONS.includes(row?.action) ? String(row.action) : 'warn',
    durationMs: Number(row?.duration_ms) > 0 ? Number(row.duration_ms) : 0,
    reason: row?.reason ? String(row.reason).slice(0, MAX_REASON) : '',
    on: TRIGGERS.includes(row?.on_event) ? String(row.on_event) : 'role_added',
  };
}

/**
 * Whether the visitor may change role triggers: the bot asks for Administrator (the server owner has it too). `permissions` is the number Discord
 * gives for the visitor in the server (the list of their servers).
 * @param {{ owner?: boolean, permissions?: string } | null | undefined} guild
 */
export function canEditRoleTriggers(guild) {
  if (!guild) return false;
  if (guild.owner) return true;
  try { return (BigInt(guild.permissions ?? '0') & 0x8n) === 0x8n; } catch { return false; }
}


// ---- The safety stop (the circuit breaker): how many actions a minute before the rules of the server pause. The same numbers as the bot (utils/roleTriggers.js).
export const MIN_LIMIT = 1;
export const MAX_LIMIT = 500;
export const BREAKER_PAUSE_MINUTES = 10;

/** What a server gets when it did not choose: it grows with the size of the server. */
export function defaultLimit(memberCount) {
  const count = Number(memberCount) || 0;
  if (count >= 25_000) return 40;
  if (count >= 5_000) return 20;
  if (count >= 1_000) return 10;
  return 5;
}

/** The number a person typed, or null when it is not a whole number from MIN_LIMIT to MAX_LIMIT. */
export function parseLimit(input) {
  const text = String(input ?? '').trim();
  if (!/^\d{1,3}$/.test(text)) return null;
  const value = Number(text);
  return value >= MIN_LIMIT && value <= MAX_LIMIT ? value : null;
}
