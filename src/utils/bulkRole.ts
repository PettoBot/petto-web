// What the Roles page (mass add or remove of a role) knows about a job and about the roles it may hand out. The bot runs the jobs
// (utils/bulkRoleEngine.js there); the page writes a row, reads it back and shows it. Nothing here talks to Discord or the database.

export type JobStatus = 'pending' | 'running' | 'completed' | 'cancelled' | 'failed';

export interface BulkJob {
  id: number;
  action: 'add' | 'remove';
  targetRoleId: string;
  status: JobStatus;
  dryRun: boolean;
  paused: boolean;
  totalMembers: number;
  processedMembers: number;
  successCount: number;
  skippedCount: number;
  errorCount: number;
  errorCode: string | null;
  errorMessage: string | null;
  reason: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string | null;
  source: string;
}

/** The row of `bulk_role_jobs` as the page uses it. */
export function shapeJob(row: any): BulkJob | null {
  if (!row) return null;
  const count = (value: unknown) => Math.max(0, Number(value ?? 0) || 0);
  return {
    id: Number(row.id),
    action: row.action === 'remove' ? 'remove' : 'add',
    targetRoleId: String(row.target_role_id),
    status: row.status,
    dryRun: Boolean(row.dry_run),
    paused: Boolean(row.paused),
    totalMembers: count(row.total_members),
    processedMembers: count(row.processed_members),
    successCount: count(row.success_count),
    skippedCount: count(row.skipped_count),
    errorCount: count(row.error_count),
    errorCode: row.error_code ?? null,
    errorMessage: row.error_message ?? null,
    reason: row.reason ?? null,
    startedAt: row.started_at ?? null,
    finishedAt: row.finished_at ?? null,
    createdAt: row.created_at ?? null,
    source: row.source ?? 'dashboard',
  };
}

/** The permissions that make a role risky to give to a lot of people at once (the same list the bot warns about). */
export const DANGEROUS_PERMISSIONS: [string, bigint][] = [
  ['Administrator', 0x8n],
  ['Manage Server', 0x20n],
  ['Manage Roles', 0x10000000n],
  ['Manage Channels', 0x10n],
  ['Manage Webhooks', 0x20000000n],
  ['Ban Members', 0x4n],
  ['Kick Members', 0x2n],
  ['Moderate Members', 0x10000000000n],
  ['Mention Everyone', 0x20000n],
];

/** The names of the risky permissions in a role's permission bits (a string of digits, as Discord sends them). */
export function dangerousPermissionsOf(bits: unknown): string[] {
  let value = 0n;
  try { value = BigInt(String(bits ?? '0')); } catch { return []; }
  if (value & 0x8n) return ['Administrator'];
  return DANGEROUS_PERMISSIONS.filter(([, flag]) => (value & flag) === flag).map(([name]) => name);
}

export type RoleBlock = 'everyone' | 'managed' | 'above_bot';

/**
 * Why Petto cannot give a role: @everyone, a role an integration owns, or one above its highest role. Where the bot has not marked its own
 * roles yet (`mine`), nothing is claimed about the position, as on the other pickers of roles.
 */
export function roleBlocks(roles: any[], guildId: string): Record<string, RoleBlock> {
  const blocks: Record<string, RoleBlock> = {};
  const botTop = Math.max(-1, ...roles.filter((role) => role.mine === true).map((role) => Number(role.position)));
  for (const role of roles) {
    const id = String(role.id);
    if (id === guildId) blocks[id] = 'everyone';
    else if (role.managed) blocks[id] = 'managed';
    else if (botTop >= 0 && Number(role.position) >= botTop) blocks[id] = 'above_bot';
  }
  return blocks;
}

const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
/** A day typed in a date field (`2025-03-01`): the same text when it is a real day, `null` when empty, `undefined` when it is not valid. */
export function parseDay(value: unknown): string | null | undefined {
  const text = String(value ?? '').trim();
  if (!text) return null;
  const match = DAY.exec(text);
  if (!match) return undefined;
  const stamp = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (stamp.getUTCFullYear() !== Number(match[1]) || stamp.getUTCMonth() !== Number(match[2]) - 1 || stamp.getUTCDate() !== Number(match[3])) return undefined;
  return text;
}

/** A whole number between 0 and 250 from a form field: `null` when empty, `undefined` when it is not a valid one. */
export function parseRoleCount(value: unknown): number | null | undefined {
  const text = String(value ?? '').trim();
  if (!text) return null;
  if (!/^\d{1,3}$/.test(text)) return undefined;
  const number = Number(text);
  return number <= 250 ? number : undefined;
}

/** The time left, in seconds, from what has been checked so far; `null` while there is too little to tell. */
export function etaSeconds(job: Pick<BulkJob, 'startedAt' | 'processedMembers' | 'totalMembers' | 'status'>, now = Date.now()): number | null {
  if (job.status !== 'running' || !job.startedAt) return null;
  const started = new Date(job.startedAt).getTime();
  if (!Number.isFinite(started) || job.processedMembers < 20 || job.totalMembers <= job.processedMembers) return null;
  return Math.max(1, Math.round(((now - started) / job.processedMembers) * (job.totalMembers - job.processedMembers) / 1000));
}

/** `2 min 5 s`-style text for a number of seconds (the words are the same in every language). */
export function shortDuration(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s} s`;
  if (s < 3600) return `${Math.floor(s / 60)} min${s % 60 ? ` ${s % 60} s` : ''}`;
  return `${Math.floor(s / 3600)} h${Math.floor((s % 3600) / 60) ? ` ${Math.floor((s % 3600) / 60)} min` : ''}`;
}
