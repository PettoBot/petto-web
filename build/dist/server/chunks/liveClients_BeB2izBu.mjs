const POLL_SEEN_MS = 45e3;
const MAX_POLLERS = 5e3;
const streams = /* @__PURE__ */ new Set();
const pollers = /* @__PURE__ */ new Map();
function shortAgent(userAgent) {
  const ua = String(userAgent ?? "");
  const system = /Android/i.test(ua) ? "Android" : /iPhone|iPad|iOS/i.test(ua) ? "iOS" : /Windows/i.test(ua) ? "Windows" : /Mac OS X|Macintosh/i.test(ua) ? "macOS" : /Linux/i.test(ua) ? "Linux" : "other";
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\/|Opera/.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chromium" : /Safari\//.test(ua) ? "Safari" : "other";
  return `${browser} · ${system}`;
}
const cleanId = (id) => /^[\w-]{4,40}$/.test(String(id ?? "")) ? String(id) : "";
const cleanReason = (reason) => /^[a-z_]{1,20}$/.test(String(reason ?? "")) ? String(reason) : "";
function openLiveStream(info) {
  const now = Date.now();
  const client = { id: cleanId(info.id), mode: "sse", reason: "", userId: info.userId, guildId: info.guildId, agent: shortAgent(info.userAgent), since: now, at: now };
  streams.add(client);
  if (client.id) pollers.delete(client.id);
  return () => {
    streams.delete(client);
  };
}
function notePoll(info) {
  const id = cleanId(info.id);
  if (!id) return;
  const now = Date.now();
  const before = pollers.get(id);
  if (!before && pollers.size >= MAX_POLLERS) prunePollers(now);
  if (!before && pollers.size >= MAX_POLLERS) return;
  pollers.set(id, { id, mode: "poll", reason: cleanReason(info.reason) || before?.reason || "", userId: info.userId, guildId: info.guildId, agent: shortAgent(info.userAgent), since: before?.since ?? now, at: now });
}
function prunePollers(now) {
  for (const [id, client] of pollers) if (now - client.at > POLL_SEEN_MS) pollers.delete(id);
}
function liveClientStats() {
  const now = Date.now();
  prunePollers(now);
  const reasons = {};
  for (const client of pollers.values()) reasons[client.reason || "unknown"] = (reasons[client.reason || "unknown"] ?? 0) + 1;
  return { sse: streams.size, polling: pollers.size, reasons, clients: [...streams, ...pollers.values()].sort((a, b) => b.at - a.at) };
}

export { liveClientStats as l, notePoll as n, openLiveStream as o };
