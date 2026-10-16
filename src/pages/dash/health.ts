export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { isPettoOwner } from '../../utils/premiumAdmin';
import { getEnv } from '../../utils/env';
import { buildInfo } from '../../utils/buildInfo';
import { readGuildSnapshot } from '../../utils/guildSnapshots';
import { latencyReport, type LatencyGroup, type LatencyReport } from '../../utils/latencyStats';
import { liveListenerCount } from '../../utils/guildVersion';
import { getDashLang } from '../../i18n/dash';

/**
 * For the owner only: where the time goes and why. Which build is running, whether the database is reachable from this host and how fast,
 * whether the bot's saved copy of the servers is there (and has its columns), and how fast the bot API and Discord answer.
 * Never prints a secret, only whether it is set. Open `/dash/health?guild=<server id>` to also see what is saved for one server.
 *
 * In a browser it is a page that reads well on a phone, starting with how long the last 500 dashboard requests took here (all of them,
 * the slowest paths, every path, and the Server-Timing parts); `?format=json` (or any client that does not ask for HTML) gets the JSON.
 */
export const GET: APIRoute = async (astro) => {
  const session = await getDashboardSession(astro);
  if (!session || !isPettoOwner(astro, session.userId)) return new Response('Not found', { status: 404 });

  const apiUrl = getEnv(astro, 'PETTO_BOT_API_URL');
  const apiKey = getEnv(astro, 'PETTO_BOT_API_SECRET');
  const botToken = getEnv(astro, 'DISCORD_TOKEN');
  const timed = async (run: () => Promise<Record<string, unknown>>) => {
    const started = Date.now();
    try {
      const result = await run();
      return { ...result, ms: Date.now() - started };
    } catch (error) {
      return { ok: false, ms: Date.now() - started, error: String((error as Error)?.message ?? error).slice(0, 200) };
    }
  };

  const report: Record<string, unknown> = {
    build: buildInfo,
    environment: {
      PETTO_BOT_API_URL: Boolean(apiUrl),
      PETTO_BOT_API_SECRET: Boolean(apiKey),
      DISCORD_TOKEN: Boolean(botToken),
      DISCORD_CLIENT_ID: Boolean(getEnv(astro, 'DISCORD_CLIENT_ID')),
      DISCORD_CLIENT_SECRET: Boolean(getEnv(astro, 'DISCORD_CLIENT_SECRET')),
      PETTO_DATABASE_URL: Boolean(getEnv(astro, 'PETTO_DATABASE_URL')),
    },
  };

  report.directDatabase = __DIRECT_DB__
    ? await (await import('../../utils/directDb')).checkDirectDatabase()
    : { configured: false, note: 'This is the Cloudflare build, it never reads the database directly.' };

  const headers = apiKey ? { apikey: apiKey, Authorization: `Bearer ${apiKey}`, 'X-Petto-Dashboard-Key': apiKey } : {};
  report.savedServersThroughTheWebPath = apiUrl && apiKey
    ? await timed(async () => {
        const res = await fetch(`${apiUrl}/rest/v1/discord_guild_snapshots?select=guild_id&limit=1`, { headers });
        return { ok: res.ok, status: res.status, answeredBy: res.headers.get('x-petto-source') === 'database' ? 'database (direct)' : 'bot API' };
      })
    : { ok: false, error: 'PETTO_BOT_API_URL or PETTO_BOT_API_SECRET is not set' };
  report.botApi = apiUrl && apiKey
    ? await timed(async () => {
        const res = await fetch(`${apiUrl}/api/dashboard/variables`, { headers: { 'X-Petto-Dashboard-Key': apiKey, Accept: 'application/json' }, signal: AbortSignal.timeout(4000) });
        return { ok: res.ok, status: res.status };
      })
    : { ok: false, error: 'not configured' };
  report.discordBotToken = botToken
    ? await timed(async () => {
        const res = await fetch('https://discord.com/api/v10/users/@me', { headers: { Authorization: `Bot ${botToken}` }, signal: AbortSignal.timeout(4000) });
        return { ok: res.ok, status: res.status, ...(res.ok ? {} : { answer: (await res.text()).replace(/\s+/g, ' ').slice(0, 120) }) };
      })
    : { ok: false, error: 'DISCORD_TOKEN is not set' };

  const guildId = new URL(astro.request.url).searchParams.get('guild');
  if (guildId) {
    const copy = await readGuildSnapshot(guildId);
    report.savedServer = copy
      ? { found: true, name: copy.name, members: copy.memberCount, channels: copy.channels.length, roles: copy.roles.length, emojis: copy.emojiCount, boosts: copy.boostCount, botNick: copy.botNick }
      : { found: false, note: 'Nothing saved for this server (or it could not be read): pages then ask Discord.' };
  }

  const latency = latencyReport();
  report.latency = { ...latency, liveDashboards: liveListenerCount() };
  const wantsJson = new URL(astro.request.url).searchParams.get('format') === 'json' || !/text\/html/i.test(astro.request.headers.get('accept') ?? '');
  if (wantsJson) return new Response(JSON.stringify(report, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
  return new Response(healthPage(report, latency, getDashLang(astro)), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
};

const WORDS: Record<string, Record<string, string>> = {
  es: {
    'Dashboard health': 'Estado del panel', 'Latency': 'Latencia', 'Last {n} dashboard requests, measured on this server from the first byte in to the last byte out.': 'Últimas {n} peticiones del panel, medidas en este servidor desde el primer byte que entra hasta el último que sale.',
    'Requests': 'Peticiones', 'Average': 'Media', 'Slowest': 'Máximo', 'Not modified (304)': 'Sin cambios (304)', 'Open live pages': 'Páginas abiertas en vivo',
    'Average of each part (ms)': 'Media de cada parte (ms)', 'The 10 slowest paths': 'Las 10 rutas más lentas', 'Every page': 'Todas las páginas', 'Path': 'Ruta',
    'Nothing measured yet.': 'Aún no hay medidas.', 'Measured only on the Node server (Discloud).': 'Solo se mide en el servidor Node (Discloud).', 'Since': 'Desde',
    'Checks': 'Comprobaciones', 'Everything as JSON': 'Todo en JSON', 'auth: session and access check · db: tables · discord: Discord API · bot: bot API · layout: menu data · render: until the page starts': 'auth: sesión y acceso · db: tablas · discord: API de Discord · bot: API del bot · layout: datos del menú · render: hasta que empieza la página',
  },
  'pt-BR': {
    'Dashboard health': 'Saúde do painel', 'Latency': 'Latência', 'Last {n} dashboard requests, measured on this server from the first byte in to the last byte out.': 'Últimas {n} requisições do painel, medidas neste servidor do primeiro byte que entra ao último que sai.',
    'Requests': 'Requisições', 'Average': 'Média', 'Slowest': 'Máximo', 'Not modified (304)': 'Sem mudanças (304)', 'Open live pages': 'Páginas abertas ao vivo',
    'Average of each part (ms)': 'Média de cada parte (ms)', 'The 10 slowest paths': 'As 10 rotas mais lentas', 'Every page': 'Todas as páginas', 'Path': 'Rota',
    'Nothing measured yet.': 'Nada medido ainda.', 'Measured only on the Node server (Discloud).': 'Medido só no servidor Node (Discloud).', 'Since': 'Desde',
    'Checks': 'Verificações', 'Everything as JSON': 'Tudo em JSON', 'auth: session and access check · db: tables · discord: Discord API · bot: bot API · layout: menu data · render: until the page starts': 'auth: sessão e acesso · db: tabelas · discord: API do Discord · bot: API do bot · layout: dados do menu · render: até a página começar',
  },
};

const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

function healthPage(report: Record<string, unknown>, latency: LatencyReport, lang: string): string {
  const t = (text: string, values: Record<string, unknown> = {}) => (WORDS[lang]?.[text] ?? text).replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
  const ms = (value: number) => `${value} ms`;
  const row = (entry: LatencyGroup) => `<tr><td class="path">${escape(entry.path)}</td><td>${entry.count}</td><td>${entry.avg}</td><td>${entry.p50}</td><td>${entry.p95}</td><td>${entry.max}</td>${latency.partNames.map((name) => `<td class="part">${entry.parts[name] ?? 0}</td>`).join('')}</tr>`;
  const head = `<tr><th>${t('Path')}</th><th>n</th><th>avg</th><th>p50</th><th>p95</th><th>max</th>${latency.partNames.map((name) => `<th class="part">${name}</th>`).join('')}</tr>`;
  const overall = latency.overall;
  const body = !latency.available
    ? `<p class="muted">${t('Measured only on the Node server (Discloud).')}</p>`
    : !overall
      ? `<p class="muted">${t('Nothing measured yet.')}</p>`
      : `<p class="muted">${t('Last {n} dashboard requests, measured on this server from the first byte in to the last byte out.', { n: overall.count })} ${latency.since ? `${t('Since')} ${escape(new Date(latency.since).toISOString().replace('T', ' ').slice(0, 16))} UTC.` : ''}</p>
<div class="cards">
  <div class="card"><span>${t('Requests')}</span><b>${overall.count}</b></div>
  <div class="card"><span>${t('Average')}</span><b>${ms(overall.avg)}</b></div>
  <div class="card"><span>p50</span><b>${ms(overall.p50)}</b></div>
  <div class="card"><span>p95</span><b>${ms(overall.p95)}</b></div>
  <div class="card"><span>${t('Slowest')}</span><b>${ms(overall.max)}</b></div>
  <div class="card"><span>${t('Not modified (304)')}</span><b>${overall.notModified}</b></div>
  <div class="card"><span>${t('Open live pages')}</span><b>${escape((report.latency as any)?.liveDashboards ?? 0)}</b></div>
</div>
<h3>${t('Average of each part (ms)')}</h3>
<div class="cards">${latency.partNames.map((name) => `<div class="card"><span>${name}</span><b>${overall.parts[name] ?? 0}</b></div>`).join('')}</div>
<p class="muted small">${t('auth: session and access check · db: tables · discord: Discord API · bot: bot API · layout: menu data · render: until the page starts')}</p>
<h3>${t('The 10 slowest paths')}</h3>
<div class="scroll"><table>${head}${latency.slowest.map(row).join('')}</table></div>
<h3>${t('Every page')}</h3>
<div class="scroll"><table>${head}${latency.pages.map(row).join('')}</table></div>`;
  const checks = { ...report };
  delete checks.latency;
  return `<!doctype html><html lang="${escape(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${t('Dashboard health')} · Petto</title>
<style>
:root{color-scheme:light dark;--bg:#f6f6f8;--fg:#17171c;--muted:#6b6b76;--card:#fff;--line:#e3e3ea}
@media (prefers-color-scheme:dark){:root{--bg:#111116;--fg:#ececf1;--muted:#9a9aa6;--card:#1b1b22;--line:#2b2b35}}
body{margin:0;padding:16px;background:var(--bg);color:var(--fg);font:15px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
h1{font-size:20px;margin:0 0 4px}h2{font-size:17px;margin:22px 0 6px}h3{font-size:15px;margin:18px 0 6px}
.muted{color:var(--muted)}.small{font-size:12.5px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px}.card span{display:block;font-size:12px;color:var(--muted)}.card b{font-size:17px}
.scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--line);border-radius:12px;background:var(--card)}
table{border-collapse:collapse;width:100%;font-size:13px;font-variant-numeric:tabular-nums}th,td{padding:6px 8px;text-align:right;white-space:nowrap;border-bottom:1px solid var(--line)}
th:first-child,td.path{text-align:left;max-width:52vw;overflow:hidden;text-overflow:ellipsis}td.part,th.part{color:var(--muted)}
pre{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px;overflow-x:auto;font-size:12px}
a{color:inherit}
</style></head><body>
<h1>${t('Dashboard health')}</h1>
<p class="muted small">${escape((report.build as any)?.version ? `v${(report.build as any).version}` : '')} · <a href="?format=json">${t('Everything as JSON')}</a></p>
<h2>${t('Latency')}</h2>
${body}
<h2>${t('Checks')}</h2>
<pre>${escape(JSON.stringify(checks, null, 2))}</pre>
</body></html>`;
}

