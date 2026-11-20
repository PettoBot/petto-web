export const prerender = false;
import type { APIRoute } from 'astro';
import { getDashboardSession } from '../../utils/dashAuth';
import { isPettoOwner } from '../../utils/premiumAdmin';
import { getEnv } from '../../utils/env';
import { buildInfo } from '../../utils/buildInfo';
import { readGuildSnapshot } from '../../utils/guildSnapshots';
import { latencyReport, type LatencyGroup, type LatencyReport, type RecentRequest } from '../../utils/latencyStats';
import { liveListenerCount } from '../../utils/guildVersion';
import { liveClientStats, type LiveClient } from '../../utils/liveClients';
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
  // How the open pages hear about changes: a live stream, or asking every few seconds (and why). The owner's own pages are listed, so
  // opening this page on the phone says which way that phone is using.
  const live = liveClientStats();
  const mine = live.clients.filter((client) => client.userId === String(session.userId));
  report.live = { streams: live.sse, polling: live.polling, pollingReasons: live.reasons, yours: mine.map(({ userId: _user, id: _id, ...rest }) => rest) };
  const wantsJson = new URL(astro.request.url).searchParams.get('format') === 'json' || !/text\/html/i.test(astro.request.headers.get('accept') ?? '');
  if (wantsJson) return new Response(JSON.stringify(report, null, 2), { headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
  return new Response(healthPage(report, latency, getDashLang(astro), mine), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
};

const WORDS: Record<string, Record<string, string>> = {
  es: {
    'Build': 'Versión publicada', 'This server was built at': 'Este servidor se compiló el', 'Page': 'Página', 'Built at': 'Compilada el', 'State': 'Estado',
    'Current': 'Al día', 'Old copy': 'Copia vieja', 'Checking…': 'Comprobando…', 'Could not read': 'No se pudo leer',
    'What a visitor gets from each static page right now (including the copy Cloudflare keeps). An old copy refreshes itself in the visitor\'s browser once it sees the new build.': 'Lo que recibe ahora un visitante de cada página estática (también la copia que guarda Cloudflare). Una copia vieja se actualiza sola en el navegador del visitante en cuanto ve la nueva versión.',
    'Live updates': 'Cambios en vivo', 'Live stream (SSE)': 'Conexión en vivo (SSE)', 'Polling': 'Consultando cada pocos segundos', 'Your open pages': 'Tus páginas abiertas',
    'None of your pages is open on a server right now.': 'Ahora no tienes ninguna página de un servidor abierta.', 'Mode': 'Modo', 'Why': 'Por qué', 'Browser': 'Navegador', 'Server': 'Servidor', 'Last seen': 'Visto hace',
    'stream': 'en vivo', 'polling': 'consultando', 'silent': 'el proxy retiene la conexión', 'error': 'la conexión falló', 'unsupported': 'el navegador no la admite',
    'Open pages hear about changes through a live stream, or ask every 12 seconds when it is held back (a proxy that buffers it) or fails.': 'Las páginas abiertas se enteran de los cambios por una conexión en vivo, o preguntan cada 12 segundos cuando esta se retiene (un proxy que la acumula) o falla.',
    'Dashboard health': 'Estado del panel', 'Latency': 'Latencia', 'Last {n} dashboard requests, measured on this server from the first byte in to the last byte out.': 'Últimas {n} peticiones del panel, medidas en este servidor desde el primer byte que entra hasta el último que sale.',
    'Saves and changes (newest first)': 'Guardados y cambios (lo más nuevo primero)', 'Every request that is not a plain page read, with the address as it was asked. A save that never shows here did not reach this server.': 'Toda petición que no es solo leer una página, con la dirección tal como se pidió. Un guardado que no sale aquí no llegó a este servidor.', 'Failed requests (4xx and 5xx)': 'Peticiones que fallaron (4xx y 5xx)', 'When': 'Cuándo', 'Body (KB)': 'Cuerpo (KB)', 'Method': 'Método', 'Status': 'Estado', 'Nothing yet.': 'Todavía nada.', 'Requests': 'Peticiones', 'Average': 'Media', 'Slowest': 'Máximo', 'Not modified (304)': 'Sin cambios (304)', 'Open live pages': 'Páginas abiertas en vivo',
    'Average of each part (ms)': 'Media de cada parte (ms)', 'The 10 slowest paths': 'Las 10 rutas más lentas', 'Every page': 'Todas las páginas', 'Path': 'Ruta',
    'Nothing measured yet.': 'Aún no hay medidas.', 'Measured only on the Node server (Discloud).': 'Solo se mide en el servidor Node (Discloud).', 'Since': 'Desde',
    'Checks': 'Comprobaciones', 'Everything as JSON': 'Todo en JSON', 'auth: session and access check · db: tables · discord: Discord API · bot: bot API · layout: menu data · render: until the page starts': 'auth: sesión y acceso · db: tablas · discord: API de Discord · bot: API del bot · layout: datos del menú · render: hasta que empieza la página',
  },
  'pt-BR': {
    'Build': 'Versão publicada', 'This server was built at': 'Este servidor foi compilado em', 'Page': 'Página', 'Built at': 'Compilada em', 'State': 'Estado',
    'Current': 'Em dia', 'Old copy': 'Cópia antiga', 'Checking…': 'Verificando…', 'Could not read': 'Não foi possível ler',
    'What a visitor gets from each static page right now (including the copy Cloudflare keeps). An old copy refreshes itself in the visitor\'s browser once it sees the new build.': 'O que um visitante recebe agora de cada página estática (inclusive a cópia que o Cloudflare guarda). Uma cópia antiga se atualiza sozinha no navegador do visitante assim que vê a nova versão.',
    'Live updates': 'Mudanças ao vivo', 'Live stream (SSE)': 'Conexão ao vivo (SSE)', 'Polling': 'Consultando a cada poucos segundos', 'Your open pages': 'Suas páginas abertas',
    'None of your pages is open on a server right now.': 'Nenhuma página sua de um servidor está aberta agora.', 'Mode': 'Modo', 'Why': 'Por quê', 'Browser': 'Navegador', 'Server': 'Servidor', 'Last seen': 'Visto há',
    'stream': 'ao vivo', 'polling': 'consultando', 'silent': 'o proxy segura a conexão', 'error': 'a conexão falhou', 'unsupported': 'o navegador não suporta',
    'Open pages hear about changes through a live stream, or ask every 12 seconds when it is held back (a proxy that buffers it) or fails.': 'As páginas abertas ficam sabendo das mudanças por uma conexão ao vivo, ou perguntam a cada 12 segundos quando ela é segurada (um proxy que a acumula) ou falha.',
    'Dashboard health': 'Saúde do painel', 'Latency': 'Latência', 'Last {n} dashboard requests, measured on this server from the first byte in to the last byte out.': 'Últimas {n} requisições do painel, medidas neste servidor do primeiro byte que entra ao último que sai.',
    'Saves and changes (newest first)': 'Salvamentos e mudanças (mais novo primeiro)', 'Every request that is not a plain page read, with the address as it was asked. A save that never shows here did not reach this server.': 'Toda requisição que não é só ler uma página, com o endereço como foi pedido. Um salvamento que não aparece aqui não chegou a este servidor.', 'Failed requests (4xx and 5xx)': 'Requisições que falharam (4xx e 5xx)', 'When': 'Quando', 'Body (KB)': 'Corpo (KB)', 'Method': 'Método', 'Status': 'Status', 'Nothing yet.': 'Ainda nada.', 'Requests': 'Requisições', 'Average': 'Média', 'Slowest': 'Máximo', 'Not modified (304)': 'Sem mudanças (304)', 'Open live pages': 'Páginas abertas ao vivo',
    'Average of each part (ms)': 'Média de cada parte (ms)', 'The 10 slowest paths': 'As 10 rotas mais lentas', 'Every page': 'Todas as páginas', 'Path': 'Rota',
    'Nothing measured yet.': 'Nada medido ainda.', 'Measured only on the Node server (Discloud).': 'Medido só no servidor Node (Discloud).', 'Since': 'Desde',
    'Checks': 'Verificações', 'Everything as JSON': 'Tudo em JSON', 'auth: session and access check · db: tables · discord: Discord API · bot: bot API · layout: menu data · render: until the page starts': 'auth: sessão e acesso · db: tabelas · discord: API do Discord · bot: API do bot · layout: dados do menu · render: até a página começar',
  },
};

const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

// The pages whose build is compared with the server's on the health page: /version.json (what the static pages compare themselves with),
// and the static pages people open the most, in every language.
const BUILD_PAGES = ['/version.json', '/', '/premium', '/es/premium', '/pt-br/premium', '/commands'];

function healthPage(report: Record<string, unknown>, latency: LatencyReport, lang: string, mine: LiveClient[]): string {
  const t = (text: string, values: Record<string, unknown> = {}) => (WORDS[lang]?.[text] ?? text).replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
  const ms = (value: number) => `${value} ms`;
  const row = (entry: LatencyGroup) => `<tr><td class="path">${escape(entry.path)}</td><td>${entry.count}</td><td>${entry.avg}</td><td>${entry.p50}</td><td>${entry.p95}</td><td>${entry.max}</td>${latency.partNames.map((name) => `<td class="part">${entry.parts[name] ?? 0}</td>`).join('')}</tr>`;
  const recentTable = (list: RecentRequest[]) => list.length
    ? `<div class="scroll"><table><tr><th>${t('When')}</th><th>${t('Method')}</th><th>${t('Status')}</th><th>${t('Path')}</th><th>ms</th><th>${t('Body (KB)')}</th></tr>${list.map((entry) => `<tr><td>${escape(new Date(entry.at).toISOString().replace('T', ' ').slice(0, 19))}</td><td>${escape(entry.method)}</td><td>${entry.status}</td><td class="path">${escape(entry.path)}</td><td>${entry.ms}</td><td>${entry.bytes < 0 ? '–' : Math.round(entry.bytes / 102.4) / 10}</td></tr>`).join('')}</table></div>`
    : `<p class="muted">${t('Nothing yet.')}</p>`;
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
</div>
<h3>${t('Average of each part (ms)')}</h3>
<div class="cards">${latency.partNames.map((name) => `<div class="card"><span>${name}</span><b>${overall.parts[name] ?? 0}</b></div>`).join('')}</div>
<p class="muted small">${t('auth: session and access check · db: tables · discord: Discord API · bot: bot API · layout: menu data · render: until the page starts')}</p>
<h3>${t('The 10 slowest paths')}</h3>
<div class="scroll"><table>${head}${latency.slowest.map(row).join('')}</table></div>
<h3>${t('Every page')}</h3>
<div class="scroll"><table>${head}${latency.pages.map(row).join('')}</table></div>
<h3>${t('Saves and changes (newest first)')}</h3>
<p class="muted small">${t('Every request that is not a plain page read, with the address as it was asked. A save that never shows here did not reach this server.')}</p>
${recentTable(latency.changes)}
<h3>${t('Failed requests (4xx and 5xx)')}</h3>
${recentTable(latency.failures)}`;
  const live = report.live as { streams: number; polling: number; pollingReasons: Record<string, number> };
  const reasons = Object.entries(live.pollingReasons).map(([reason, count]) => `${escape(t(reason))}: ${count}`).join(' · ');
  const ago = (at: number) => `${Math.max(0, Math.round((Date.now() - at) / 1000))} s`;
  const liveBody = `<p class="muted small">${t('Open pages hear about changes through a live stream, or ask every 12 seconds when it is held back (a proxy that buffers it) or fails.')}</p>
<div class="cards">
  <div class="card"><span>${t('Live stream (SSE)')}</span><b data-live-sse>${live.streams}</b></div>
  <div class="card"><span>${t('Polling')}</span><b data-live-poll>${live.polling}</b>${reasons ? `<span>${reasons}</span>` : ''}</div>
</div>
<h3>${t('Your open pages')}</h3>
${mine.length
    ? `<div class="scroll"><table><tr><th>${t('Mode')}</th><th>${t('Why')}</th><th>${t('Browser')}</th><th>${t('Server')}</th><th>${t('Last seen')}</th></tr>${mine.map((client) => `<tr data-live-mine="${client.mode}"><td class="path">${t(client.mode === 'sse' ? 'stream' : 'polling')}</td><td>${escape(client.reason ? t(client.reason) : '')}</td><td>${escape(client.agent)}</td><td>${escape(client.guildId)}</td><td>${ago(client.mode === 'sse' ? Date.now() : client.at)}</td></tr>`).join('')}</table></div>`
    : `<p class="muted">${t('None of your pages is open on a server right now.')}</p>`}`;
  const checks = { ...report };
  delete checks.latency;
  delete checks.live;
  return `<!doctype html><html lang="${escape(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${t('Dashboard health')} · Petto</title>
<style>
:root{color-scheme:light dark;--bg:#f6f6f8;--fg:#20242b;--muted:#66707d;--card:#fff;--line:#e3e6eb;--accent:#bd5136}
@media (prefers-color-scheme:dark){:root{--bg:#111113;--fg:#d6d3cc;--muted:#9b978f;--card:#1c1c20;--line:#34373e;--accent:#f0a88f}}
body{margin:0 auto;max-width:1120px;padding:20px 16px 48px;background:var(--bg);color:var(--fg);font:15px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
h1{font-family:Georgia,'Times New Roman',serif;font-size:26px;margin:0 0 4px}h2{display:flex;align-items:center;gap:8px;font-size:12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin:28px 0 8px}h3{font-size:15px;margin:18px 0 6px}
.muted{color:var(--muted)}.small{font-size:12.5px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px 12px}.card span{display:block;font-size:12px;color:var(--muted)}.card b{font-size:18px;font-variant-numeric:tabular-nums}
.scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--line);border-radius:14px;background:var(--card)}
table{border-collapse:collapse;width:100%;font-size:13px;font-variant-numeric:tabular-nums}th,td{padding:6px 8px;text-align:right;white-space:nowrap;border-bottom:1px solid var(--line)}
th:first-child,td.path{text-align:left;max-width:52vw;overflow:hidden;text-overflow:ellipsis}td.part,th.part{color:var(--muted)}
pre{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;overflow-x:auto;font-size:12px}
a{color:var(--accent)}
tr:last-child td{border-bottom:0}
td.ok{color:#4d8f2b;font-weight:600}td.bad{color:#c23c3d;font-weight:600}@media (prefers-color-scheme:dark){td.ok{color:#a5ea7a}td.bad{color:#fe6465}}
</style></head><body>
<h1>${t('Dashboard health')}</h1>
<p class="muted small">${escape((report.build as any)?.version ? `v${(report.build as any).version}` : '')} · <a href="?format=json">${t('Everything as JSON')}</a></p>
<h2>${t('Build')}</h2>
<p class="muted small">${t('This server was built at')} <b data-build-server>${escape(buildInfo.builtAt.replace('T', ' ').slice(0, 19))} UTC</b>${buildInfo.commit ? ` · ${escape(buildInfo.commit)}` : ''}</p>
<p class="muted small">${t('What a visitor gets from each static page right now (including the copy Cloudflare keeps). An old copy refreshes itself in the visitor\'s browser once it sees the new build.')}</p>
<div class="scroll"><table><tr><th>${t('Page')}</th><th>${t('Built at')}</th><th>${t('State')}</th></tr>${BUILD_PAGES.map((path) => `<tr data-build-page="${path}"><td class="path">${path}</td><td>…</td><td class="muted">${t('Checking…')}</td></tr>`).join('')}</table></div>
<script>(function(){var server=${JSON.stringify(buildInfo.builtAt)};var w=${JSON.stringify({ ok: t('Current'), old: t('Old copy'), fail: t('Could not read') })};
document.querySelectorAll('[data-build-page]').forEach(function(row){var path=row.getAttribute('data-build-page');var cells=row.querySelectorAll('td');
var read=path==='/version.json'?fetch(path,{cache:'no-store'}).then(function(r){return r.json()}).then(function(j){return j.builtAt}):fetch(path,{cache:'no-store',credentials:'omit'}).then(function(r){return r.text()}).then(function(h){var m=/pageVersion\\s*=\\s*"([^"]+)"/.exec(h);return m?m[1]:null});
read.then(function(at){if(!at)throw 0;cells[1].textContent=at.replace('T',' ').slice(0,19)+' UTC';var ok=at===server;cells[2].textContent=ok?w.ok:w.old;cells[2].className=ok?'ok':'bad';}).catch(function(){cells[2].textContent=w.fail;cells[2].className='bad';});});})();</script>
<h2>${t('Live updates')}</h2>
${liveBody}
<h2>${t('Latency')}</h2>
${body}
<h2>${t('Checks')}</h2>
<pre>${escape(JSON.stringify(checks, null, 2))}</pre>
</body></html>`;
}

