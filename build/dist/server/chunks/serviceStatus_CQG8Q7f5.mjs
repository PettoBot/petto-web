import { g as getEnv } from './env_WnBvzCjc.mjs';
import { b as buildInfo } from './buildInfo_Bw1TupFW.mjs';

const SLOW_MS = 1500;
const KEEP_MS = 15e3;
let kept = null;
let running = null;
async function timed(run) {
  const started = Date.now();
  try {
    const outcome = await run();
    const ms = Date.now() - started;
    if (outcome === false) return { state: "down", ms };
    return { state: ms > SLOW_MS ? "slow" : "operational", ms, ...typeof outcome === "string" ? { detail: outcome } : {} };
  } catch (error) {
    return { state: "down", ms: Date.now() - started, detail: String(error?.message ?? error).slice(0, 80) };
  }
}
const worst = (states) => states.includes("down") ? "down" : states.includes("slow") ? "slow" : states.every((s) => s === "unknown") ? "unknown" : "operational";
async function measure(context) {
  const apiUrl = getEnv(context, "PETTO_BOT_API_URL");
  const apiKey = getEnv(context, "PETTO_BOT_API_SECRET");
  const clientReady = Boolean(getEnv(context, "DISCORD_CLIENT_ID") && getEnv(context, "DISCORD_CLIENT_SECRET"));
  const headers = apiUrl && apiKey ? { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "X-Petto-Dashboard-Key": apiKey, Accept: "application/json" } : null;
  const ask = async (path) => {
    const response = await fetch(`${apiUrl}${path}`, { headers, signal: AbortSignal.timeout(6e3) });
    if (!response.ok) throw new Error(`answered ${response.status}`);
    return response.json();
  };
  const [database, discord, shards] = await Promise.all([
    headers ? timed(async () => {
      await ask("/rest/v1/bot_host?select=updated_at&limit=1");
    }) : Promise.resolve({ state: "unknown", ms: 0 }),
    timed(async () => {
      const response = await fetch("https://discord.com/api/v10/gateway", { signal: AbortSignal.timeout(6e3) });
      return response.ok;
    }),
    headers ? timed(async () => {
      const rows = await ask("/rest/v1/bot_status?select=status,updated_at");
      const fresh = (Array.isArray(rows) ? rows : []).filter((row) => Date.now() - new Date(row.updated_at).getTime() < 5 * 6e4 && row.status === "Ready");
      return fresh.length > 0 ? `${fresh.length}` : false;
    }) : Promise.resolve({ state: "unknown", ms: 0 })
  ]);
  const dashboard = !clientReady || !headers ? { state: "down", ms: 0 } : { state: worst([database.state, discord.state]), ms: Math.max(database.ms, discord.ms) };
  const services = [
    { id: "website", state: "operational", ms: 0 },
    { id: "dashboard", ...dashboard },
    { id: "database", ...database },
    { id: "discord", ...discord },
    { id: "commands", ...shards }
  ];
  return { checkedAt: (/* @__PURE__ */ new Date()).toISOString(), overall: worst(services.map((s) => s.state)), services, website: { version: buildInfo.version, uptimeSeconds: Math.round(process.uptime?.() ?? 0) } };
}
function getServiceStatus(context) {
  if (kept && Date.now() - kept.at < KEEP_MS) return Promise.resolve(kept.report);
  if (!running) {
    running = measure(context).then((report) => {
      kept = { at: Date.now(), report };
      return report;
    }).finally(() => {
      running = null;
    });
  }
  return running;
}

export { getServiceStatus as g };
