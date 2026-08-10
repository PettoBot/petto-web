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

const rps = Math.min(Math.max(Number.isFinite(requestedRps) ? requestedRps : 5, 1), 20);
const seconds = Math.min(Math.max(Number.isFinite(requestedSeconds) ? requestedSeconds : 30, 5), 60);
const timeoutMs = 10_000;
const total = { sent: 0, failures: 0, statuses: new Map(), latencies: [] };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request() {
  const started = performance.now();
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    const latency = performance.now() - started;
    total.latencies.push(latency);
    total.statuses.set(response.status, (total.statuses.get(response.status) ?? 0) + 1);
  } catch {
    total.failures += 1;
  }
}

console.log(`Prueba controlada: ${url.href}`);
console.log(`Límite aplicado: ${rps} solicitudes/segundo durante ${seconds} segundos.`);
console.log('Esto no es un DDoS y no debe convertirse en una prueba distribuida.');

const deadline = Date.now() + seconds * 1000;
while (Date.now() < deadline) {
  const batchStarted = Date.now();
  total.sent += rps;
  await Promise.all(Array.from({ length: rps }, request));
  await sleep(Math.max(0, 1000 - (Date.now() - batchStarted)));
}

const sorted = [...total.latencies].sort((a, b) => a - b);
const percentile = (value) => sorted.length ? Math.round(sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * value))]) : 0;
const statuses = [...total.statuses.entries()].sort(([a], [b]) => a - b).map(([status, count]) => `${status}: ${count}`).join(', ') || 'ninguna';

console.log(`Enviadas: ${total.sent}`);
console.log(`Respuestas: ${total.latencies.length}; fallos/timeouts: ${total.failures}`);
console.log(`HTTP: ${statuses}`);
console.log(`Latencia ms: p50=${percentile(0.50)}, p95=${percentile(0.95)}, p99=${percentile(0.99)}`);
