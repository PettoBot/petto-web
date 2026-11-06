import { getGuildInfo } from './discord';
import { runBatched } from './concurrency';
import { GUILD_COLUMNS, SECTIONS, columnsOf, renderConfigYaml, type ModuleData, type ModuleDef } from './configYamlRender';

/**
 * The full "current configuration" YAML shown on the Config Management page: every module's settings, not just one page's. It needs
 * about a hundred reads of the private API, so it is fetched lazily by the page (and by the download) instead of blocking the render.
 * What it holds and how it is written lives in configYamlRender.ts; this file only reads the rows.
 */
export async function buildConfigYaml(id: string, botToken: string, apiUrl: string, apiKey: string): Promise<string | null> {
  const guildInfo = await getGuildInfo(id, botToken);
  if (!guildInfo) return null;

  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, Prefer: 'count=exact' };
  const base = `${apiUrl}/rest/v1`;

  /** One read. The listed columns first; when the table does not know one of them yet, everything, so one new column never hides a whole module. */
  async function read(table: string, columns: string[], filter: string, order: string, limit: number): Promise<ModuleData> {
    // The last way leaves out the order too: a column it names may not exist yet either.
    for (const [select, sorted] of [[columns.join(','), true], ['*', true], ['*', false]] as const) {
      try {
        const res = await fetch(`${base}/${table}?guild_id=eq.${id}&select=${select}${filter}${sorted ? order : ''}&limit=${limit}`, { headers });
        if (!res.ok) continue;
        const rows = await res.json();
        if (!Array.isArray(rows)) continue;
        const range = Number(res.headers.get('content-range')?.split('/')[1]);
        return { rows, total: Number.isFinite(range) ? range : rows.length };
      } catch { /* try the next way, or give up on this module */ }
    }
    return { rows: null, total: null };
  }

  const pairs: Array<{ key: string; mod: ModuleDef }> = [];
  for (const section of SECTIONS) for (const mod of section.modules) pairs.push({ key: `${section.key}.${mod.key}`, mod });

  const tasks = [
    () => read('guilds', GUILD_COLUMNS, '', '', 1),
    ...pairs.map(({ mod }) => () => {
      const columns = mod.mode === 'count' ? ['guild_id'] : columnsOf(mod).map(([name]) => name);
      const order = mod.order && mod.mode === 'many' ? `&order=${mod.order}` : '';
      return read(mod.table, columns, mod.filter ? `&${mod.filter}` : '', order, mod.mode === 'many' ? mod.limit ?? 100 : 1);
    }),
  ];
  const results = await runBatched(tasks, 6);

  const data: Record<string, ModuleData> = {};
  pairs.forEach(({ key }, i) => { data[key] = results[i + 1]; });
  const guildRows = results[0].rows;
  return renderConfigYaml({ guildId: id, guildName: guildInfo.name, guild: guildRows ? guildRows[0] ?? {} : null, data });
}
