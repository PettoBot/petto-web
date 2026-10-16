import { getEnv } from './env';
import { isPettoOwner } from './premiumAdmin';

function list(astro: any, name: string): string[] {
  return String(getEnv(astro, name) ?? '').split(/[\s,]+/).filter((id) => /^\d{15,22}$/.test(id));
}

/** Whether the person is part of the team of Petto: its owner or one of its developers. */
export function isPettoTeam(astro: any, userId: string | undefined): boolean {
  if (!userId) return false;
  return isPettoOwner(astro, userId) || list(astro, 'PETTO_DEVELOPER_IDS').includes(userId);
}

// Parts of the dashboard that are paused for a while: their page says so and does nothing else. Backups stay as they are (the code, the saved
// backups and the schedules). Only the owner and the developers can still use them. Setting BACKUPS_MAINTENANCE=off brings them back for
// everyone (the bot reads the same switch).
export function backupsPaused(astro: any): boolean {
  return String(getEnv(astro, 'BACKUPS_MAINTENANCE') ?? '').toLowerCase() !== 'off';
}

/** Whether backups are closed for this person: they are paused and the person is not part of the team. */
export function backupsUnderMaintenance(astro: any, userId: string | undefined): boolean {
  return backupsPaused(astro) && !isPettoTeam(astro, userId);
}
