import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { m as exportPettoVaultBackup } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { b as backupsUnderMaintenance } from '../../../../chunks/maintenance_ZyU-NXSZ.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const GET = async (context) => {
  const { id } = context.params;
  const auth = await getGuildSession(context, id);
  if ("redirect" in auth) return context.redirect(auth.redirect);
  if (backupsUnderMaintenance(context, auth.session.userId)) return new Response("Backups are under maintenance.", { status: 503 });
  const backupId = context.url.searchParams.get("id");
  if (!backupId) return new Response("Backup id is required.", { status: 400 });
  return exportPettoVaultBackup(context, id, auth.session.userId, backupId);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
