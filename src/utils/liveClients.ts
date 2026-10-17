/**
 * Which way each open dashboard page hears about changes, for the owner's /dash/health page: a live stream (`events`, Server-Sent Events)
 * or asking `version` every few seconds (when a proxy holds the stream back, or the browser has none). Kept in this process's memory only.
 *
 * - A stream counts while it is open here. A proxy that buffers it still keeps it open, so a page that gave up on its stream also says so
 *   when it polls (`reason`), and the health page shows both.
 * - A page that polls counts for POLL_SEEN_MS after its last ask.
 */

export type LiveMode = 'sse' | 'poll';
export type LiveClient = { id: string; mode: LiveMode; reason: string; userId: string; guildId: string; agent: string; since: number; at: number };

const POLL_SEEN_MS = 45_000;
const MAX_POLLERS = 5_000;
const streams = new Set<LiveClient>();
const pollers = new Map<string, LiveClient>();

/** A short name of the browser and system, enough for the owner to recognise their phone. */
export function shortAgent(userAgent: string | null | undefined): string {
  const ua = String(userAgent ?? '');
  const system = /Android/i.test(ua) ? 'Android' : /iPhone|iPad|iOS/i.test(ua) ? 'iOS' : /Windows/i.test(ua) ? 'Windows' : /Mac OS X|Macintosh/i.test(ua) ? 'macOS' : /Linux/i.test(ua) ? 'Linux' : 'other';
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chromium' : /Safari\//.test(ua) ? 'Safari' : 'other';
  return `${browser} · ${system}`;
}

const cleanId = (id: string | null | undefined) => (/^[\w-]{4,40}$/.test(String(id ?? '')) ? String(id) : '');
const cleanReason = (reason: string | null | undefined) => (/^[a-z_]{1,20}$/.test(String(reason ?? '')) ? String(reason) : '');

/** A stream was opened; the answer closes it. */
export function openLiveStream(info: { id?: string | null; userId: string; guildId: string; userAgent?: string | null }): () => void {
  const now = Date.now();
  const client: LiveClient = { id: cleanId(info.id), mode: 'sse', reason: '', userId: info.userId, guildId: info.guildId, agent: shortAgent(info.userAgent), since: now, at: now };
  streams.add(client);
  // A page that streams again is no longer a polling one.
  if (client.id) pollers.delete(client.id);
  return () => { streams.delete(client); };
}

/** A page asked `version` because it polls. */
export function notePoll(info: { id?: string | null; reason?: string | null; userId: string; guildId: string; userAgent?: string | null }): void {
  const id = cleanId(info.id);
  if (!id) return;
  const now = Date.now();
  const before = pollers.get(id);
  if (!before && pollers.size >= MAX_POLLERS) prunePollers(now);
  if (!before && pollers.size >= MAX_POLLERS) return;
  pollers.set(id, { id, mode: 'poll', reason: cleanReason(info.reason) || before?.reason || '', userId: info.userId, guildId: info.guildId, agent: shortAgent(info.userAgent), since: before?.since ?? now, at: now });
}

function prunePollers(now: number) {
  for (const [id, client] of pollers) if (now - client.at > POLL_SEEN_MS) pollers.delete(id);
}

/** The live pages right now: how many stream, how many poll (and why), and every one of them for the owner's list. */
export function liveClientStats(): { sse: number; polling: number; reasons: Record<string, number>; clients: LiveClient[] } {
  const now = Date.now();
  prunePollers(now);
  const reasons: Record<string, number> = {};
  for (const client of pollers.values()) reasons[client.reason || 'unknown'] = (reasons[client.reason || 'unknown'] ?? 0) + 1;
  return { sse: streams.size, polling: pollers.size, reasons, clients: [...streams, ...pollers.values()].sort((a, b) => b.at - a.at) };
}
