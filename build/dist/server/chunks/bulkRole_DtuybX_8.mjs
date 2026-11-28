import { f as formatDuration } from './formatDuration_w2_MFD16.mjs';

function shapeJob(row) {
  if (!row) return null;
  const count = (value) => Math.max(0, Number(value ?? 0) || 0);
  return {
    id: Number(row.id),
    action: row.action === "remove" ? "remove" : "add",
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
    source: row.source ?? "dashboard"
  };
}
const DANGEROUS_PERMISSIONS = [
  ["Administrator", 0x8n],
  ["Manage Server", 0x20n],
  ["Manage Roles", 0x10000000n],
  ["Manage Channels", 0x10n],
  ["Manage Webhooks", 0x20000000n],
  ["Ban Members", 0x4n],
  ["Kick Members", 0x2n],
  ["Moderate Members", 0x10000000000n],
  ["Mention Everyone", 0x20000n]
];
function dangerousPermissionsOf(bits) {
  let value = 0n;
  try {
    value = BigInt(String(bits ?? "0"));
  } catch {
    return [];
  }
  if (value & 0x8n) return ["Administrator"];
  return DANGEROUS_PERMISSIONS.filter(([, flag]) => (value & flag) === flag).map(([name]) => name);
}
function roleBlocks(roles, guildId) {
  const blocks = {};
  const botTop = Math.max(-1, ...roles.filter((role) => role.mine === true).map((role) => Number(role.position)));
  for (const role of roles) {
    const id = String(role.id);
    if (id === guildId) blocks[id] = "everyone";
    else if (role.managed) blocks[id] = "managed";
    else if (botTop >= 0 && Number(role.position) >= botTop) blocks[id] = "above_bot";
  }
  return blocks;
}
const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
function parseDay(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const match = DAY.exec(text);
  if (!match) return void 0;
  const stamp = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (stamp.getUTCFullYear() !== Number(match[1]) || stamp.getUTCMonth() !== Number(match[2]) - 1 || stamp.getUTCDate() !== Number(match[3])) return void 0;
  return text;
}
function parseRoleCount(value) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  if (!/^\d{1,3}$/.test(text)) return void 0;
  const number = Number(text);
  return number <= 250 ? number : void 0;
}
function etaSeconds(job, now = Date.now()) {
  if (job.status !== "running" || !job.startedAt) return null;
  const started = new Date(job.startedAt).getTime();
  if (!Number.isFinite(started) || job.processedMembers < 20 || job.totalMembers <= job.processedMembers) return null;
  return Math.max(1, Math.round((now - started) / job.processedMembers * (job.totalMembers - job.processedMembers) / 1e3));
}
function shortDuration(seconds) {
  return formatDuration(Math.max(0, seconds));
}

export { shortDuration as a, parseRoleCount as b, dangerousPermissionsOf as d, etaSeconds as e, parseDay as p, roleBlocks as r, shapeJob as s };
