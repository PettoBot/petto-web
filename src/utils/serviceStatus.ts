// The real state of the website and the dashboard, measured when someone asks (and kept 15 seconds): each service is asked for something
// small and the time it took says if it is fine, slow or down. Nothing here is a fixed "Operational".
import { getEnv } from './env';
import { buildInfo } from './buildInfo';

export type ServiceState = 'operational' | 'slow' | 'down' | 'unknown';
export interface ServiceReport { id: 'website' | 'dashboard' | 'database' | 'discord' | 'commands'; state: ServiceState; ms: number | null; detail?: string }
export interface StatusReport { checkedAt: string; overall: ServiceState; services: ServiceReport[]; website: { version: string; uptimeSeconds: number } }

const SLOW_MS = 1500;
const KEEP_MS = 15_000;
let kept: { at: number; report: StatusReport } | null = null;
let running: Promise<StatusReport> | null = null;

async function timed(run: () => Promise<boolean | string | void>): Promise<{ state: ServiceState; ms: number; detail?: string }> {
  const started = Date.now();
  try {
    const outcome = await run();
    const ms = Date.now() - started;
    if (outcome === false) return { state: 'down', ms };
    return { state: ms > SLOW_MS ? 'slow' : 'operational', ms, ...(typeof outcome === 'string' ? { detail: outcome } : {}) };
  } catch (error) {
    return { state: 'down', ms: Date.now() - started, detail: String((error as Error)?.message ?? error).slice(0, 80) };
  }
}

const worst = (states: ServiceState[]): ServiceState => (states.includes('down') ? 'down' : states.includes('slow') ? 'slow' : states.every((s) => s === 'unknown') ? 'unknown' : 'operational');

async function measure(context: { locals?: unknown }): Promise<StatusReport> {
  const apiUrl = getEnv(context, 'PETTO_BOT_API_URL');
  const apiKey = getEnv(context, 'PETTO_BOT_API_SECRET');
  const clientReady = Boolean(getEnv(context, 'DISCORD_CLIENT_ID') && getEnv(context, 'DISCORD_CLIENT_SECRET'));
  const headers = apiUrl && apiKey ? { apikey: apiKey, Authorization: `Bearer ${apiKey}`, 'X-Petto-Dashboard-Key': apiKey, Accept: 'application/json' } : null;
  const ask = async (path: string) => {
    const response = await fetch(`${apiUrl}${path}`, { headers: headers!, signal: AbortSignal.timeout(6_000) });
    if (!response.ok) throw new Error(`answered ${response.status}`);
    return response.json();
  };

  const [database, discord, shards] = await Promise.all([
    headers ? timed(async () => { await ask('/rest/v1/bot_host?select=updated_at&limit=1'); }) : Promise.resolve({ state: 'unknown' as ServiceState, ms: 0 }),
    timed(async () => { const response = await fetch('https://discord.com/api/v10/gateway', { signal: AbortSignal.timeout(6_000) }); return response.ok; }),
    headers ? timed(async () => {
      const rows = await ask('/rest/v1/bot_status?select=status,updated_at');
      const fresh = (Array.isArray(rows) ? rows : []).filter((row: any) => Date.now() - new Date(row.updated_at).getTime() < 5 * 60_000 && row.status === 'Ready');
      return fresh.length > 0 ? `${fresh.length}` : false;
    }) : Promise.resolve({ state: 'unknown' as ServiceState, ms: 0 }),
  ]);

  // Signing in and the dashboard pages need Discord, the bot's database and the keys of the login: if one is missing or down, so is the dashboard.
  const dashboard: { state: ServiceState; ms: number } = !clientReady || !headers
    ? { state: 'down', ms: 0 }
    : { state: worst([database.state, discord.state]), ms: Math.max(database.ms, discord.ms) };

  const services: ServiceReport[] = [
    { id: 'website', state: 'operational', ms: 0 },
    { id: 'dashboard', ...dashboard },
    { id: 'database', ...database },
    { id: 'discord', ...discord },
    { id: 'commands', ...shards },
  ];
  return { checkedAt: new Date().toISOString(), overall: worst(services.map((s) => s.state)), services, website: { version: buildInfo.version, uptimeSeconds: Math.round(process.uptime?.() ?? 0) } };
}

/** The report, from memory when it is less than 15 seconds old. Several visitors at once share one measurement. */
export function getServiceStatus(context: { locals?: unknown }): Promise<StatusReport> {
  if (kept && Date.now() - kept.at < KEEP_MS) return Promise.resolve(kept.report);
  if (!running) {
    running = measure(context).then((report) => { kept = { at: Date.now(), report }; return report; }).finally(() => { running = null; });
  }
  return running;
}
