import { g as getEnv } from './env_WnBvzCjc.mjs';
import { i as isPettoOwner } from './premiumAdmin_C4HUbWtx.mjs';

function list(astro, name) {
  return String(getEnv(astro, name) ?? "").split(/[\s,]+/).filter((id) => /^\d{15,22}$/.test(id));
}
function isPettoTeam(astro, userId) {
  if (!userId) return false;
  return isPettoOwner(astro, userId) || list(astro, "PETTO_DEVELOPER_IDS").includes(userId);
}
function backupsPaused(astro) {
  return String(getEnv(astro, "BACKUPS_MAINTENANCE") ?? "").toLowerCase() === "on";
}
function backupsUnderMaintenance(astro, userId) {
  return backupsPaused(astro) && !isPettoTeam(astro, userId);
}

export { backupsPaused as a, backupsUnderMaintenance as b, isPettoTeam as i };
