/**
 * The time of the last dashboard requests, for the owner's /dash/health page. server.mjs records each one (path without ids, status,
 * total time from the first byte in to the last byte out, its Server-Timing header) in memory; this file adds them up, and keeps a copy
 * in Redis (`petto:web:latency`, written at most once a minute, never per request) so a restart does not wipe them.
 * The Worker build and `astro dev` have no server.mjs, so there is nothing to show there.
 */

export interface LatencyEntry { p: string; u?: string; cl?: number; m: string; s: number; t: number; st: string; at: number }
interface Store { entries: LatencyEntry[]; max: number; total: number; restored?: boolean }

const REDIS_KEY = 'petto:web:latency';
const SAVE_EVERY_MS = 60_000;
const KEEP_DAYS_S = 7 * 24 * 3600;
const PARTS = ['auth', 'db', 'discord', 'bot', 'layout', 'render'] as const;

function store(): Store | null {
  return ((globalThis as any).__pettoLatency as Store | undefined) ?? null;
}

let started = false;
let savedTotal = -1;

/** Restores the copy kept in Redis (once) and saves the current one every minute when something new came in. Node build only. */
export function startLatencyKeeping(): void {
  if (started || !__NODE_TARGET__) return;
  started = true;
  const kept = store();
  if (!kept) return;
  const redis = __NODE_TARGET__ ? import('./redisClient').catch(() => null) : Promise.resolve(null);
  void redis.then(async (module) => {
    if (!module?.redisConfigured()) return;
    // Redis connects at boot; give it a moment before the first read.
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    const raw = await module.redisRun((client) => client.get(REDIS_KEY), null);
    if (raw && !kept.restored) {
      try {
        const old = JSON.parse(raw) as LatencyEntry[];
        if (Array.isArray(old)) {
          kept.entries.unshift(...old.filter((entry) => entry && typeof entry.t === 'number').slice(-kept.max));
          if (kept.entries.length > kept.max) kept.entries.splice(0, kept.entries.length - kept.max);
        }
      } catch { /* a broken copy is ignored */ }
    }
    kept.restored = true;
    const timer = setInterval(() => {
      if (kept.total === savedTotal) return;
      savedTotal = kept.total;
      const text = JSON.stringify(kept.entries.slice(-kept.max));
      void module.redisRun(async (client) => { await client.set(REDIS_KEY, text, { EX: KEEP_DAYS_S }); return true; }, false);
    }, SAVE_EVERY_MS);
    (timer as any).unref?.();
  });
}

function parts(header: string): Record<string, number> {
  const found: Record<string, number> = {};
  for (const part of header.split(',')) {
    const match = /^\s*([\w-]+)\s*;.*?dur=([\d.]+)/.exec(part);
    if (match) found[match[1]] = Number(match[2]);
  }
  return found;
}

function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1))];
}

export interface LatencyGroup { path: string; count: number; avg: number; p50: number; p95: number; max: number; notModified: number; parts: Record<string, number> }
export interface RecentRequest { at: number; method: string; status: number; path: string; ms: number; bytes: number }
export interface LatencyReport { available: boolean; count: number; since: number | null; overall: LatencyGroup | null; slowest: LatencyGroup[]; pages: LatencyGroup[]; partNames: readonly string[]; failures: RecentRequest[]; changes: RecentRequest[] }

function group(path: string, entries: LatencyEntry[]): LatencyGroup {
  const times = entries.map((entry) => entry.t).sort((a, b) => a - b);
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    for (const [name, value] of Object.entries(parts(entry.st))) {
      sums[name] = (sums[name] ?? 0) + value;
      counts[name] = (counts[name] ?? 0) + 1;
    }
  }
  const averages: Record<string, number> = {};
  for (const name of PARTS) averages[name] = counts[name] ? Math.round((sums[name] / counts[name]) * 10) / 10 : 0;
  return {
    path,
    count: entries.length,
    avg: Math.round(times.reduce((sum, value) => sum + value, 0) / Math.max(1, times.length)),
    p50: percentile(times, 50),
    p95: percentile(times, 95),
    max: times[times.length - 1] ?? 0,
    notModified: entries.filter((entry) => entry.s === 304).length,
    parts: averages,
  };
}

/** The numbers of the health page: all requests together, the ten slowest paths (by p95) and every path. */
export function latencyReport(): LatencyReport {
  const kept = store();
  if (!kept) return { available: false, count: 0, since: null, overall: null, slowest: [], pages: [], partNames: PARTS, failures: [], changes: [] };
  const entries = kept.entries.slice();
  const byPath = new Map<string, LatencyEntry[]>();
  for (const entry of entries) {
    const list = byPath.get(entry.p);
    if (list) list.push(entry);
    else byPath.set(entry.p, [entry]);
  }
  const pages = [...byPath].map(([path, list]) => group(path, list)).sort((a, b) => b.count - a.count);
  const slowest = [...pages].sort((a, b) => b.p95 - a.p95 || b.avg - a.avg).slice(0, 10);
  // The last requests that failed (4xx, 5xx) and the last that changed something (a save), with the address as it was asked (the language
  // prefix and the server id are kept: that is what tells a failure of /es apart from one of the address without prefix).
  const recent = (entry: LatencyEntry): RecentRequest => ({ at: entry.at, method: entry.m, status: entry.s, path: entry.u ?? entry.p, ms: entry.t, bytes: entry.cl ?? -1 });
  const failures = entries.filter((entry) => entry.s >= 400).slice(-40).reverse().map(recent);
  const changes = entries.filter((entry) => !['GET', 'HEAD'].includes(entry.m)).slice(-25).reverse().map(recent);
  return { available: true, count: entries.length, since: entries[0]?.at ?? null, overall: entries.length ? group('*', entries) : null, slowest, pages, partNames: PARTS, failures, changes };
}
