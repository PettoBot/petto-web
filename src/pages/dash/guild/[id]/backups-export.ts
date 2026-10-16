import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { exportPettoVaultBackup } from '../../../../utils/pettoBotApi';
import { backupsUnderMaintenance } from '../../../../utils/maintenance';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const { id } = context.params as { id: string };
  const auth = await getGuildSession(context, id);
  if ('redirect' in auth) return context.redirect(auth.redirect);
  // Backups are paused: the download is refused here too, not only hidden by the page.
  if (backupsUnderMaintenance(context)) return new Response('Backups are under maintenance.', { status: 503 });
  const backupId = context.url.searchParams.get('id');
  if (!backupId) return new Response('Backup id is required.', { status: 400 });
  return exportPettoVaultBackup(context, id, auth.session.userId, backupId);
};
