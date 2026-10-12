import { getEnv } from './env';

/**
 * Server-Timing for dashboard pages: how long the request spent checking the session (auth), reading tables (db: the bot's
 * PostgREST API or the direct database), asking Discord (discord), calling the bot's other routes (bot), and in all until the
 * page started to be sent (render). Each figure is wall time: requests that ran at the same time count once. Browsers show it
 * in the network panel; scripts/load-check.mjs prints it.
 *
 * The per-request split needs AsyncLocalStorage, so it is measured on Node (Discloud); the Worker build reports render only.
 */

type Span = [number, number];
type Timing = { spans: Map<string, Span[]> };

type Storage = { run<R>(store: Timing, callback: () => R): R; getStore(): Timing | undefined };
let storage: Storage | null = null;
const loading = __NODE_TARGET__
  ? import('node:async_hooks').then((module) => { storage = new module.AsyncLocalStorage<Timing>(); }).catch(() => {})
  : null;

let installed = false;
let apiBase = '';

function category(url: string): string | null {
  if (url.startsWith('https://discord.com/')) return 'discord';
  if (apiBase && url.startsWith(`${apiBase}/rest/v1/`)) return 'db';
  if (apiBase && url.startsWith(`${apiBase}/`)) return 'bot';
  return null;
}

/** Records a span of work for the current request (no-op outside a measured request). */
export function markTiming(name: string, started: number, ended = performance.now()): void {
  const store = storage?.getStore();
  if (!store) return;
  let list = store.spans.get(name);
  if (!list) store.spans.set(name, (list = []));
  list.push([started, ended]);
}

function installFetchTiming(): void {
  if (installed || !storage) return;
  installed = true;
  const original = globalThis.fetch.bind(globalThis);
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const name = storage?.getStore() ? category(url) : null;
    if (!name) return original(input, init);
    const started = performance.now();
    try {
      return await original(input, init);
    } finally {
      markTiming(name, started);
    }
  }) as typeof fetch;
}

function wall(spans: Span[]): number {
  const sorted = [...spans].sort((a, b) => a[0] - b[0]);
  let total = 0;
  let [start, end] = sorted[0] ?? [0, 0];
  for (const [s, e] of sorted.slice(1)) {
    if (s > end) { total += end - start; start = s; end = e; } else if (e > end) end = e;
  }
  return total + (end - start);
}

function header(timing: Timing | null, renderMs: number): string {
  const parts: string[] = [];
  for (const name of ['auth', 'db', 'discord', 'bot']) {
    const spans = timing?.spans.get(name);
    if (timing) parts.push(`${name};dur=${(spans?.length ? wall(spans) : 0).toFixed(1)}`);
  }
  parts.push(`render;dur=${renderMs.toFixed(1)}`);
  return parts.join(', ');
}

function withHeader(response: Response, value: string): Response {
  if (response.headers.has('server-timing')) return response;
  try {
    response.headers.set('Server-Timing', value);
    return response;
  } catch {
    const headers = new Headers(response.headers);
    headers.set('Server-Timing', value);
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
}

/** Runs one request with its timings measured, and adds the Server-Timing header to the answer. */
export async function timed(astro: { locals?: any }, handle: () => Promise<Response>): Promise<Response> {
  await loading;
  apiBase = getEnv(astro, 'PETTO_BOT_API_URL') ?? '';
  installFetchTiming();
  const started = performance.now();
  if (!storage) return withHeader(await handle(), header(null, performance.now() - started));
  const timing: Timing = { spans: new Map() };
  const response = await storage.run(timing, handle);
  return withHeader(response, header(timing, performance.now() - started));
}
