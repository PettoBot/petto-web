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
type Timing = { spans: Map<string, Span[]>; writes: Set<string> };

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

const GUILD_IN_BODY = /"guild_id"\s*:\s*"?(\d{5,25})/;
const GUILD_IN_FILTER = /[?&]guild_id=eq\.(\d{5,25})(?:&|$)/;
const GUILD_IN_DISCORD_PATH = /^https:\/\/discord\.com\/api(?:\/v\d+)?\/guilds\/(\d{5,25})(?:\/|$|\?)/;

/** The server a write sent upstream changes (a table row of that server, or the server on Discord), if it can be told. */
function guildOfWrite(url: string, init?: RequestInit): string | null {
  if (url.startsWith('https://discord.com/')) return GUILD_IN_DISCORD_PATH.exec(url)?.[1] ?? null;
  if (!apiBase || !url.startsWith(`${apiBase}/rest/v1/`)) return null;
  const body = typeof init?.body === 'string' ? init.body.slice(0, 2000) : '';
  return GUILD_IN_BODY.exec(body)?.[1] ?? GUILD_IN_FILTER.exec(url)?.[1] ?? null;
}

/**
 * A change to a server made during a measured request is kept until the request is answered (the middleware raises the server's stamp
 * once, then). Answers false outside one, and the caller raises the stamp itself.
 */
export function deferGuildChange(guildId: string): boolean {
  const store = storage?.getStore();
  if (!store) return false;
  store.writes.add(guildId);
  return true;
}

/** The servers changed so far by the current request. */
export function requestGuildChanges(): string[] {
  return [...(storage?.getStore()?.writes ?? [])];
}

function installFetchTiming(): void {
  if (installed || !storage) return;
  installed = true;
  const original = globalThis.fetch.bind(globalThis);
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const store = storage?.getStore();
    const name = store ? category(url) : null;
    if (!name) return original(input, init);
    const method = String(init?.method ?? (typeof input === 'object' && 'method' in input ? input.method : 'GET')).toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') {
      const guildId = guildOfWrite(url, init);
      if (guildId) store!.writes.add(guildId);
    }
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
  for (const name of ['auth', 'db', 'discord', 'bot', 'layout']) {
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
  const timing: Timing = { spans: new Map(), writes: new Set() };
  const response = await storage.run(timing, handle);
  return withHeader(response, header(timing, performance.now() - started));
}
