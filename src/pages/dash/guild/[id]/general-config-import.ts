export const prerender = false;
import type { APIRoute } from 'astro';
import { getGuildSession } from '../../../../utils/dashAuth';
import { getEnv } from '../../../../utils/env';
import { ensureGuildRow } from '../../../../utils/ensureGuild';
import { getGuildList } from '../../../../utils/discord';
import { syncPettoLanguage, syncPettoPrefix } from '../../../../utils/pettoBotApi';
import { deferGuildChange } from '../../../../utils/serverTiming';
import { bumpGuildVersion } from '../../../../utils/guildVersion';
import { getDashLang, makeT } from '../../../../i18n/dash';
import { buildImportPlan, publicPlan, IMPORT_TABLES, MAX_FILE_BYTES, type Msg, type PlanOk, type Row } from '../../../../utils/configYamlImport';

// Import of the configuration file of Config Management. Two steps, one route: `preview` checks the file and says what would change;
// `apply` checks it again (the file is read and validated from scratch on the server, nothing that came back from the preview is trusted)
// and writes only what that check says, one request per module, the same way the pages of each module write their own settings.
// Only a manager of the server can use it: not Support mode, not a member who has access to some pages only.

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async (context) => {
  const { id } = context.params as { id: string };
  // Only this site's own page sends a file to import: a page of another site cannot do it as the person.
  const origin = context.request.headers.get('origin');
  if (!origin || origin !== context.url.origin) return json({ ok: false, error: 'origin' }, 403);
  const auth = await getGuildSession(context, id);
  if ('redirect' in auth) return json({ ok: false, error: 'signin' }, 401);
  const dt = makeT(getDashLang(context));
  if (auth.devView || auth.access) return json({ ok: false, error: dt('Only the people who manage this server can import a file.') }, 403);

  const botToken = getEnv(context, 'DISCORD_TOKEN');
  const apiUrl = getEnv(context, 'PETTO_BOT_API_URL');
  const apiKey = getEnv(context, 'PETTO_BOT_API_SECRET');
  if (!botToken || !apiUrl || !apiKey) return json({ ok: false, error: dt('Petto is not set up here yet.') }, 500);

  const length = Number(context.request.headers.get('content-length') ?? 0);
  if (length > MAX_FILE_BYTES + 16 * 1024) return json({ ok: false, error: dt('The file is too big (at most {n} KB).', { n: MAX_FILE_BYTES / 1024 }) }, 413);
  const body: any = await context.request.json().catch(() => null);
  const action = String(body?.action ?? '');
  if (!body || (action !== 'preview' && action !== 'apply') || typeof body.yaml !== 'string') return json({ ok: false, error: dt('This is not a configuration file.') }, 400);

  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
  const [rowEntries, roles, channels] = await Promise.all([
    Promise.all(IMPORT_TABLES.map(async (table) => {
      try {
        const res = await fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}&select=*`, { headers });
        if (!res.ok) return [table, undefined] as const;
        const list = await res.json();
        return [table, (Array.isArray(list) ? list[0] : null) ?? null] as const;
      } catch { return [table, undefined] as const; }
    })),
    idsOf(context, id, botToken, 'roles'),
    idsOf(context, id, botToken, 'channels'),
  ]);
  const rows = Object.fromEntries(rowEntries) as Record<string, Row | null | undefined>;
  const plan = buildImportPlan({ yaml: body.yaml, guildId: id, rows, known: { roles, channels } });
  if (!plan.ok) return json({ ok: false, error: say(dt, plan.error) }, 400);

  if (action === 'preview') return json({ ok: true, plan: translate(plan, dt) });

  // Apply: what the fresh check says, per module. Every part is one upsert on the module's row, like the page's own Save.
  await ensureGuildRow(apiUrl, headers, id);
  const results: { id: string; ok: boolean; changes: number }[] = [];
  let wrote = false;
  for (const write of plan.writes) {
    const module = plan.modules.find((item) => item.id === write.id);
    let allOk = true;
    for (const part of write.parts) {
      const row: Row = { guild_id: id, ...part.row };
      if (!('language' in part.row)) row.updated_at = new Date().toISOString();
      const res = await fetch(`${apiUrl}/rest/v1/${write.table}?on_conflict=guild_id`, {
        method: 'POST',
        headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(row),
      }).catch(() => null);
      if (!res || !res.ok) { allOk = false; continue; }
      wrote = true;
      // The bot keeps its own copy of the prefixes and the language for a few minutes: it is told, as the General page does.
      if (part.after === 'prefix') await syncPettoPrefix(context, id, part.row.prefixes as string[]).catch(() => {});
      if (part.after === 'language') await syncPettoLanguage(context, id, String(part.row.language)).catch(() => {});
    }
    results.push({ id: write.id, ok: allOk, changes: module?.changes.length ?? 0 });
  }
  // The open pages of the server read themselves again (this one too): the stamp is raised when this answer goes out.
  if (wrote && !deferGuildChange(id)) await bumpGuildVersion(id).catch(() => '');
  return json({ ok: results.every((item) => item.ok), results, plan: translate(plan, dt) });
};

async function idsOf(context: any, guildId: string, botToken: string, kind: 'roles' | 'channels'): Promise<Set<string> | null> {
  try {
    const res = await getGuildList(context, guildId, botToken, kind);
    if (!res.ok) return null;
    const list = await res.json();
    if (!Array.isArray(list)) return null;
    return new Set(list.map((item: any) => String(item?.id ?? '')).filter(Boolean));
  } catch { return null; }
}

type Say = ReturnType<typeof makeT>;
const say = (dt: Say, msg: Msg): string => dt(msg.key, msg.vars);

/** The plan for the browser: texts already in the language of the dashboard, and nothing the server alone needs. */
function translate(plan: PlanOk, dt: Say) {
  const open = publicPlan(plan);
  return {
    ...open,
    modules: open.modules.map((module) => ({
      ...module,
      title: dt(module.title),
      changes: module.changes.map((change) => ({ setting: change.setting, from: change.from, to: change.to, note: change.note ? say(dt, change.note) : undefined })),
      invalid: module.invalid.map((item) => ({ setting: item.setting, value: item.value, reason: say(dt, item.reason) })),
      warnings: module.warnings.map((item) => ({ setting: item.setting, value: item.value, reason: say(dt, item.reason) })),
    })),
    ignored: open.ignored.map((item) => ({ path: item.path, reason: say(dt, item.reason) })),
  };
}
