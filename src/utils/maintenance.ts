import { getEnv } from './env';

// Parts of the dashboard that are paused for a while: their page says so and does nothing else. Backups stay as they are (the code, the saved
// backups and the schedules). Setting BACKUPS_MAINTENANCE=off brings them back (the bot reads the same switch).
export function backupsUnderMaintenance(astro: any): boolean {
  return String(getEnv(astro, 'BACKUPS_MAINTENANCE') ?? '').toLowerCase() !== 'off';
}
