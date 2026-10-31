// What the Invites tab of Statistics works out from rows it reads from the database itself (no call to the bot): the total of invites,
// the leaderboard of a period, the codes of a member. The total is the same formula as the bot's (joins, minus the leaves when the server
// counts them, plus the bonus), and the period starts on Monday or the 1st in GMT-5, the bot's time.
import { BOT_OFFSET_MS } from './activityStats';

export type InvitePeriod = 'all' | 'week' | 'month';
export const INVITE_PERIODS: InvitePeriod[] = ['all', 'week', 'month'];

export interface InviteCounts { joins: number; leaves: number; fake: number; bonus: number }
export interface InviterRow extends InviteCounts { id: string; net: number }
export interface InviteSettingsValues { fakeDays: number; quickLeaveMinutes: number; ignoreBots: boolean; subtractLeaves: boolean }

export const DEFAULT_INVITE_SETTINGS: InviteSettingsValues = { fakeDays: 3, quickLeaveMinutes: 0, ignoreBots: false, subtractLeaves: true };

const num = (value: unknown) => Math.trunc(Number(value)) || 0;

export const parseInvitePeriod = (value: unknown): InvitePeriod => (INVITE_PERIODS as string[]).includes(String(value)) ? (String(value) as InvitePeriod) : 'all';

/** The total of invites of one person. */
export function inviteTotal(counts: Partial<InviteCounts>, subtractLeaves = true): number {
  return num(counts.joins) - (subtractLeaves ? num(counts.leaves) : 0) + num(counts.bonus);
}

/** The settings of a server from its row of invite_config (a server with no row, or a bot that is older than this page, has the defaults). */
export function readInviteSettings(row: Record<string, unknown> | undefined | null): InviteSettingsValues {
  if (!row) return { ...DEFAULT_INVITE_SETTINGS };
  return {
    fakeDays: row.fake_days === undefined || row.fake_days === null ? DEFAULT_INVITE_SETTINGS.fakeDays : Math.max(0, num(row.fake_days)),
    quickLeaveMinutes: Math.max(0, num(row.quick_leave_minutes)),
    ignoreBots: row.ignore_bots === true,
    subtractLeaves: row.subtract_leaves === undefined || row.subtract_leaves === null ? true : row.subtract_leaves !== false,
  };
}

/** The start of this week (Monday) or month in GMT-5, as an ISO instant. */
export function periodStart(period: Exclude<InvitePeriod, 'all'>, now = new Date()): string {
  const local = new Date(now.getTime() + BOT_OFFSET_MS);
  const day = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const start = period === 'month' ? Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), 1) : day - ((local.getUTCDay() + 6) % 7) * 86_400_000;
  return new Date(start - BOT_OFFSET_MS).toISOString();
}

const byRank = (a: InviterRow, b: InviterRow) => b.net - a.net || b.joins - a.joins;

/** The leaderboard of all time, from the rows of invite_uses. */
export function rankInviters(rows: Record<string, unknown>[], subtractLeaves: boolean, limit = 10): InviterRow[] {
  return rows
    .map((row) => ({ id: String(row.inviter_id), joins: num(row.joins), leaves: num(row.leaves), fake: num(row.fake), bonus: num(row.bonus) }))
    .filter((row) => row.joins || row.leaves || row.bonus)
    .map((row) => ({ ...row, net: inviteTotal(row, subtractLeaves) }))
    .sort(byRank)
    .slice(0, limit);
}

/** The members brought in during a period (rows of member_invites: inviter_id, left_at; fake joins already left out) counted per inviter. */
export function groupPeriod(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  const byInviter = new Map<string, { inviter_id: string; joins: number; leaves: number }>();
  for (const row of rows) {
    if (!row.inviter_id) continue;
    const id = String(row.inviter_id);
    const entry = byInviter.get(id) ?? { inviter_id: id, joins: 0, leaves: 0 };
    entry.joins += 1;
    if (row.left_at) entry.leaves += 1;
    byInviter.set(id, entry);
  }
  return [...byInviter.values()];
}

/** The leaderboard of a week or month, from the counts per inviter (the bonus is not part of a period, as in the bot). */
export function rankPeriod(grouped: Record<string, unknown>[], subtractLeaves: boolean, limit = 10): InviterRow[] {
  return grouped
    .map((row) => ({ id: String(row.inviter_id), joins: num(row.joins), leaves: num(row.leaves), fake: 0, bonus: 0 }))
    .map((row) => ({ ...row, net: inviteTotal(row, subtractLeaves) }))
    .sort(byRank)
    .slice(0, limit);
}

export interface CodeRow { code: string; joins: number; left: number; fake: number }

/** Rows of member_invites of one inviter (invite_code, fake, left_at) counted per code. */
export function groupCodes(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  const byCode = new Map<string, CodeRow>();
  for (const row of rows) {
    if (!row.invite_code) continue;
    const code = String(row.invite_code);
    const entry = byCode.get(code) ?? { code, joins: 0, left: 0, fake: 0 };
    if (row.fake) entry.fake += 1;
    else { entry.joins += 1; if (row.left_at) entry.left += 1; }
    byCode.set(code, entry);
  }
  return [...byCode.values()];
}

/** The codes a member brought people in with, most used first (from the counts per code). */
export function codeStats(grouped: Record<string, unknown>[], limit = 8): CodeRow[] {
  return grouped
    .map((row) => ({ code: String(row.code), joins: num(row.joins), left: num(row.left), fake: num(row.fake) }))
    .sort((a, b) => b.joins + b.fake - (a.joins + a.fake) || a.code.localeCompare(b.code))
    .slice(0, limit);
}
