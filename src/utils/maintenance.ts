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

// Backups are open for every member of a server. They can still be paused for a while (their page says so and does nothing else; the code,
// the saved backups and the schedules stay as they are, and only the owner and the developers can still use them): set BACKUPS_MAINTENANCE=on.
// The bot reads the same switch.
export function backupsPaused(astro: any): boolean {
  return String(getEnv(astro, 'BACKUPS_MAINTENANCE') ?? '').toLowerCase() === 'on';
}

/** Whether backups are closed for this person: they are paused and the person is not part of the team. */
export function backupsUnderMaintenance(astro: any, userId: string | undefined): boolean {
  return backupsPaused(astro) && !isPettoTeam(astro, userId);
}
