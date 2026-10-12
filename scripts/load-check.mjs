const target = process.env.LOAD_TEST_URL ?? 'https://petto.sbs/';
const confirmation = process.env.LOAD_TEST_CONFIRM ?? '';
const requestedRps = Number(process.env.LOAD_TEST_RPS ?? 5);
const requestedSeconds = Number(process.env.LOAD_TEST_SECONDS ?? 30);

const allowedHosts = new Set(['petto.sbs', 'localhost', '127.0.0.1']);
const url = new URL(target);

if (!allowedHosts.has(url.hostname)) {
  throw new Error(`Host no permitido para esta prueba: ${url.hostname}`);
}

if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) {
  throw new Error('La prueba debe usar HTTPS fuera de localhost.');
}

if (confirmation !== url.hostname) {
  throw new Error(`Para confirmar el destino, define LOAD_TEST_CONFIRM=${url.hostname}`);
}

// Optional: a dashboard session and several pages. LOAD_TEST_COOKIE is the value of petto_session (or a whole Cookie header),
// LOAD_TEST_PATHS a comma-separated list of paths on the same host (e.g. /dash/guild/<id>/overview,/dash/guild/<id>/leveling).
// Each round requests every path; the summary is per path, with the Server-Timing the dashboard sends (auth, db, discord...).
const rawCookie = (process.env.LOAD_TEST_COOKIE ?? '').trim();
const cookie = rawCookie && !rawCookie.includes('=') ? `petto_session=${rawCookie}` : rawCookie;
const targets = (process.env.LOAD_TEST_PATHS ?? '').split(',').map((path) => path.trim()).filter(Boolean).map((path) => new URL(path, url));
if (!targets.length) targets.push(url);
for (const target of targets) if (target.hostname !== url.hostname) throw new Error(`Host no permitido para esta prueba: ${target.hostname}`);

const rps = Math.min(Math.max(Number.isFinite(requestedRps) ? requestedRps : 5, 1), 20);
const seconds = Math.min(Math.max(Number.isFinite(requestedSeconds) ? requestedSeconds : 30, 5), 60);
const timeoutMs = 10_000;
const total = { sent: 0, failures: 0, statuses: new Map(), latencies: [] };
const perPath = new Map(targets.map((target) => [target.href, { latencies: [], failures: 0, timings: new Map() }]));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(target) {
  const started = performance.now();
  const stats = perPath.get(target.href);
  try {
    const response = await fetch(target, { signal: AbortSignal.timeout(timeoutMs), redirect: 'manual', headers: cookie ? { cookie } : {} });
    await response.arrayBuffer();
    const latency = performance.now() - started;
    total.latencies.push(latency);
    stats.latencies.push(latency);
    total.statuses.set(response.status, (total.statuses.get(response.status) ?? 0) + 1);
    for (const part of (response.headers.get('server-timing') ?? '').split(',')) {
      const match = /^\s*([\w-]+)\s*;\s*dur=([\d.]+)/.exec(part);
      if (!match) continue;
      const list = stats.timings.get(match[1]) ?? [];
      list.push(Number(match[2]));
      stats.timings.set(match[1], list);
    }
  } catch {
    total.failures += 1;
    stats.failures += 1;
  }
}

console.log(`Prueba controlada: ${targets.map((target) => target.href).join(', ')}${cookie ? ' (con sesión)' : ''}`);
console.log(`Límite aplicado: ${rps} solicitudes/segundo durante ${seconds} segundos.`);
console.log('Esto no es un DDoS y no debe convertirse en una prueba distribuida.');

const deadline = Date.now() + seconds * 1000;
while (Date.now() < deadline) {
  const batchStarted = Date.now();
  // The pages share the rate: rps requests per second in all, spread over the paths in turn.
  total.sent += rps;
  await Promise.all(Array.from({ length: rps }, (_, index) => request(targets[(total.sent + index) % targets.length])));
  await sleep(Math.max(0, 1000 - (Date.now() - batchStarted)));
}

const sorted = [...total.latencies].sort((a, b) => a - b);
const percentile = (value) => sorted.length ? Math.round(sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * value))]) : 0;
const statuses = [...total.statuses.entries()].sort(([a], [b]) => a - b).map(([status, count]) => `${status}: ${count}`).join(', ') || 'ninguna';

console.log(`Enviadas: ${total.sent}`);
console.log(`Respuestas: ${total.latencies.length}; fallos/timeouts: ${total.failures}`);
console.log(`HTTP: ${statuses}`);
console.log(`Latencia ms: p50=${percentile(0.50)}, p95=${percentile(0.95)}, p99=${percentile(0.99)}`);

const median = (values) => {
  const list = [...values].sort((a, b) => a - b);
  return list.length ? list[Math.floor(list.length / 2)] : 0;
};
if (targets.length > 1 || cookie) {
  for (const [href, stats] of perPath) {
    const list = [...stats.latencies].sort((a, b) => a - b);
    const p = (value) => (list.length ? Math.round(list[Math.min(list.length - 1, Math.floor(list.length * value))]) : 0);
    const timing = [...stats.timings.entries()].map(([name, values]) => `${name}=${median(values).toFixed(0)}`).join(' ');
    console.log(`${new URL(href).pathname}${new URL(href).search}: n=${list.length} fallos=${stats.failures} p50=${p(0.5)} p95=${p(0.95)}${timing ? ` server-timing(mediana ms) ${timing}` : ''}`);
  }
}
