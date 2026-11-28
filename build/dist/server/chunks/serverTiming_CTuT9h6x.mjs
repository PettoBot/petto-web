import { g as getEnv } from './env_WnBvzCjc.mjs';

let storage = null;
const loading = import('node:async_hooks').then((module) => {
  storage = new module.AsyncLocalStorage();
}).catch(() => {
}) ;
let installed = false;
let apiBase = "";
function category(url) {
  if (url.startsWith("https://discord.com/")) return "discord";
  if (apiBase && url.startsWith(`${apiBase}/rest/v1/`)) return "db";
  if (apiBase && url.startsWith(`${apiBase}/`)) return "bot";
  return null;
}
function markTiming(name, started, ended = performance.now()) {
  const store = storage?.getStore();
  if (!store) return;
  let list = store.spans.get(name);
  if (!list) store.spans.set(name, list = []);
  list.push([started, ended]);
}
const GUILD_IN_BODY = /"guild_id"\s*:\s*"?(\d{5,25})/;
const GUILD_IN_FILTER = /[?&]guild_id=eq\.(\d{5,25})(?:&|$)/;
const GUILD_IN_DISCORD_PATH = /^https:\/\/discord\.com\/api(?:\/v\d+)?\/guilds\/(\d{5,25})(?:\/|$|\?)/;
function guildOfWrite(url, init) {
  if (url.startsWith("https://discord.com/")) return GUILD_IN_DISCORD_PATH.exec(url)?.[1] ?? null;
  if (!apiBase || !url.startsWith(`${apiBase}/rest/v1/`)) return null;
  const body = typeof init?.body === "string" ? init.body.slice(0, 2e3) : "";
  return GUILD_IN_BODY.exec(body)?.[1] ?? GUILD_IN_FILTER.exec(url)?.[1] ?? null;
}
function deferGuildChange(guildId) {
  const store = storage?.getStore();
  if (!store) return false;
  store.writes.add(guildId);
  return true;
}
function requestGuildChanges() {
  return [...storage?.getStore()?.writes ?? []];
}
function installFetchTiming() {
  if (installed || !storage) return;
  installed = true;
  const original = globalThis.fetch.bind(globalThis);
  globalThis.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const store = storage?.getStore();
    const name = store ? category(url) : null;
    if (!name) return original(input, init);
    const method = String(init?.method ?? (typeof input === "object" && "method" in input ? input.method : "GET")).toUpperCase();
    if (method !== "GET" && method !== "HEAD") {
      const guildId = guildOfWrite(url, init);
      if (guildId) store.writes.add(guildId);
    }
    const started = performance.now();
    try {
      return await original(input, init);
    } finally {
      markTiming(name, started);
    }
  };
}
function wall(spans) {
  const sorted = [...spans].sort((a, b) => a[0] - b[0]);
  let total = 0;
  let [start, end] = sorted[0] ?? [0, 0];
  for (const [s, e] of sorted.slice(1)) {
    if (s > end) {
      total += end - start;
      start = s;
      end = e;
    } else if (e > end) end = e;
  }
  return total + (end - start);
}
function header(timing, renderMs) {
  const parts = [];
  for (const name of ["auth", "db", "discord", "bot", "layout"]) {
    const spans = timing?.spans.get(name);
    if (timing) parts.push(`${name};dur=${(spans?.length ? wall(spans) : 0).toFixed(1)}`);
  }
  parts.push(`render;dur=${renderMs.toFixed(1)}`);
  return parts.join(", ");
}
function withHeader(response, value) {
  if (response.headers.has("server-timing")) return response;
  try {
    response.headers.set("Server-Timing", value);
    return response;
  } catch {
    const headers = new Headers(response.headers);
    headers.set("Server-Timing", value);
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
}
async function timed(astro, handle) {
  await loading;
  apiBase = getEnv(astro, "PETTO_BOT_API_URL") ?? "";
  installFetchTiming();
  const started = performance.now();
  if (!storage) return withHeader(await handle(), header(null, performance.now() - started));
  const timing = { spans: /* @__PURE__ */ new Map(), writes: /* @__PURE__ */ new Set() };
  const response = await storage.run(timing, handle);
  return withHeader(response, header(timing, performance.now() - started));
}

export { deferGuildChange, markTiming, requestGuildChanges, timed };
