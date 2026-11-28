import { g as getEnv } from './env_WnBvzCjc.mjs';
import { a as getGuildSession, p as pageDecision } from './dashAuth_uqFK7-ED.mjs';

async function roleGrant(context, guildId, page, write) {
  try {
    const auth = await getGuildSession(context, guildId);
    if (!auth || !("access" in auth) || !auth.access) return {};
    const decision = pageDecision(auth.access, page);
    if (!decision.allowed || write && !decision.canEdit) return {};
    return { "X-Petto-Dashboard-Grant": `${page}:${write ? "edit" : "view"}` };
  } catch {
    return {};
  }
}
const NEVER_REACHED = /* @__PURE__ */ new Set(["ECONNREFUSED", "ENOTFOUND", "EAI_AGAIN", "EHOSTUNREACH", "ENETUNREACH"]);
function neverReached(error) {
  const codes = [error?.code, error?.cause?.code, ...Array.isArray(error?.cause?.errors) ? error.cause.errors.map((e) => e?.code) : []];
  return codes.some((code) => typeof code === "string" && NEVER_REACHED.has(code));
}
const isTimeout = (error) => error?.name === "TimeoutError" || error?.name === "AbortError";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const PATIENT_RETRY = [1e3, 1500, 1700];
async function botFetch(url, init, opts) {
  const started = Date.now();
  const pauses = opts.retryAt ?? [250];
  for (let tries = 1; ; tries++) {
    const tryStarted = Date.now();
    let call;
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(Math.max(1e3, opts.timeoutMs - (tryStarted - started))) });
      const data = await response.json().catch(() => null);
      const proxyDown = data === null && [502, 503, 530].includes(response.status);
      const unreadable = data === null && (response.ok || proxyDown || response.status === 504);
      call = { response, data, down: unreadable, retrySafe: unreadable && (opts.mode === "read" || proxyDown), tries };
    } catch (error) {
      call = { response: null, data: null, down: true, retrySafe: opts.mode === "read" || !isTimeout(error) && neverReached(error), tries };
      if (isTimeout(error)) return call;
    }
    const pause = pauses[tries - 1];
    if (!call.down || !call.retrySafe || pause === void 0 || Date.now() - tryStarted > 2e3 || Date.now() - started + pause >= opts.timeoutMs) return call;
    await sleep(pause);
  }
}
async function pingPettoBot(context) {
  const { baseUrl } = apiConfig(context);
  if (!baseUrl) return false;
  try {
    const response = await fetch(`${baseUrl}/`, { method: "HEAD", signal: AbortSignal.timeout(1100) });
    return response.status < 500;
  } catch {
    return false;
  }
}
function apiConfig(context) {
  const baseUrl = getEnv(context, "PETTO_BOT_API_URL")?.replace(/\/$/, "");
  const secret = getEnv(context, "PETTO_BOT_API_SECRET");
  return { baseUrl, secret };
}
async function syncPettoPrefix(context, guildId, prefixes) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, error: "not_configured", payload: null };
  const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/prefix`, {
    method: "POST",
    headers: {
      "X-Petto-Dashboard-Key": secret,
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(Array.isArray(prefixes) ? { prefixes } : { prefix: prefixes })
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch {
  }
  return { ok: response.ok && payload?.ok !== false, error: payload?.error ?? null, payload };
}
async function syncPettoLanguage(context, guildId, language) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, error: "not_configured", payload: null };
  const response = await fetch(`${baseUrl}/internal/guild-language`, {
    method: "POST",
    headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ guildId, language }),
    signal: AbortSignal.timeout(5e3)
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch {
  }
  return { ok: response.ok && payload?.ok !== false, error: payload?.error ?? null, payload };
}
async function callPettoCode(context, guildId, userId, route, body) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, status: 503, payload: { ok: false, error: "not_configured" } };
  const url = `${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/code/${route}${body ? "" : `?user_id=${encodeURIComponent(userId)}`}`;
  try {
    const response = await fetch(url, {
      method: body ? "POST" : "GET",
      // A bot that does not answer must not leave the editor waiting for ever.
      signal: AbortSignal.timeout(12e3),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", ...body ? { "Content-Type": "application/json" } : {} },
      ...body ? { body: JSON.stringify({ ...body, user_id: userId }) } : {}
    });
    let payload = null;
    try {
      payload = await response.json();
    } catch {
    }
    return { ok: response.ok, status: response.status, payload };
  } catch {
    return { ok: false, status: 502, payload: { ok: false, error: "bot_unavailable" } };
  }
}
async function callPettoVault(context, guildId, userId, init = {}) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, error: "not_configured", payload: null };
  const headers = new Headers(init.headers);
  headers.set("X-Petto-Dashboard-Key", secret);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  const query = init.method === "GET" || !init.method ? `?user_id=${encodeURIComponent(userId)}` : "";
  const response = await fetch(`${baseUrl}/api/dashboard/vault/${encodeURIComponent(guildId)}${query}`, { ...init, headers });
  let payload = null;
  try {
    payload = await response.json();
  } catch {
  }
  return { ok: response.ok && payload?.ok !== false, error: payload?.error ?? null, payload };
}
async function callPettoVaultRestore(context, guildId, userId, step, init = {}) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, status: 503, payload: { ok: false, error: "not_configured" } };
  const method = init.method ?? "GET";
  const query = new URLSearchParams({ ...init.query ?? {}, ...method === "GET" ? { user_id: userId } : {} });
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/vault/${encodeURIComponent(guildId)}/restore/${encodeURIComponent(step)}${query.size ? `?${query}` : ""}`, {
      method,
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", ...method === "POST" ? { "Content-Type": "application/json" } : {} },
      ...method === "POST" ? { body: JSON.stringify({ ...init.body ?? {}, user_id: userId }) } : {},
      signal: AbortSignal.timeout(2e4)
    });
    let payload = null;
    try {
      payload = await response.json();
    } catch {
    }
    return { ok: response.ok && payload?.ok !== false, status: response.status, payload };
  } catch {
    return { ok: false, status: 502, payload: { ok: false, error: "bot_unavailable" } };
  }
}
async function exportPettoVaultBackup(context, guildId, userId, backupId) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return new Response("Petto Vault is not configured.", { status: 503 });
  const response = await fetch(`${baseUrl}/api/dashboard/vault/${encodeURIComponent(guildId)}/export/${encodeURIComponent(backupId)}?user_id=${encodeURIComponent(userId)}`, {
    headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json" }
  });
  return new Response(await response.text(), {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
      "Content-Disposition": response.headers.get("content-disposition") ?? `attachment; filename="petto-backup-${guildId}-${backupId}.json"`
    }
  });
}
async function callPettoCards(context, guildId, userId, path, init = {}) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return null;
  const { contentType, ...rest } = init;
  const headers = new Headers(rest.headers);
  headers.set("X-Petto-Dashboard-Key", secret);
  if (rest.body) headers.set("Content-Type", contentType ?? "application/json");
  const separator = path.includes("?") ? "&" : "?";
  return fetch(`${baseUrl}/api/dashboard/cards/${encodeURIComponent(guildId)}${path}${separator}user_id=${encodeURIComponent(userId)}`, { ...rest, headers });
}
async function renderPollMessage(context, guildId, poll, counts, voters) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return null;
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/poll-message`, {
      method: "POST",
      signal: AbortSignal.timeout(6e3),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ poll, counts, voters })
    });
    const payload = await response.json().catch(() => null);
    const message = payload?.payload;
    return response.ok && payload?.ok && Array.isArray(message?.components) ? message : null;
  } catch {
    return null;
  }
}
async function callPettoGiveaway(context, guildId, userId, action, body) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, error: "not_configured", message: "The dashboard is not connected to the bot." };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/giveaway/${action}`, {
      method: "POST",
      signal: AbortSignal.timeout(15e3),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: userId })
    });
    const payload = await response.json().catch(() => null);
    if (response.ok && payload?.ok) return payload;
    return { ok: false, error: String(payload?.error ?? "unavailable"), message: typeof payload?.message === "string" ? payload.message : void 0 };
  } catch {
    return { ok: false, error: "unavailable", message: "The bot did not answer in time." };
  }
}
async function callPettoStreakBoard(context, guildId, kind) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return null;
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/streak-board?kind=${kind}`, { headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json" }, signal: AbortSignal.timeout(1e4) });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.ok || !Array.isArray(payload.entries)) return null;
    return payload.entries.map((entry) => ({ id: String(entry.userId), name: entry.name ?? null, avatar: entry.avatar ?? null, current: Number(entry.current), best: Number(entry.best) }));
  } catch {
    return null;
  }
}
async function callPettoQuestMethod(context, guildId, userId, questId) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "The dashboard is not connected to the bot." };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/quests/method`, {
      method: "POST",
      signal: AbortSignal.timeout(15e3),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ quest_id: questId || void 0, user_id: userId })
    });
    const payload = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === "string" ? payload.message : response.ok ? "Sent." : "The bot could not send it." };
  } catch {
    return { ok: false, message: "The bot did not answer in time." };
  }
}
async function callPettoVerification(context, guildId, userId, action) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "The dashboard is not connected to the bot." };
  const call = await botFetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/verification/${action}`, {
    method: "POST",
    headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId })
  }, { timeoutMs: 8e3, mode: "change" }).catch(() => null);
  if (!call || !call.response || call.down) return { ok: false, message: "The bot did not answer in time.", down: true, retrySafe: call?.retrySafe ?? false };
  const payload = call.data;
  return {
    ok: Boolean(call.response.ok && payload?.ok),
    message: typeof payload?.message === "string" ? payload.message : call.response.ok ? "Done." : "The bot could not do it.",
    status: typeof payload?.status === "string" ? payload.status : void 0,
    job: payload?.job ?? null
  };
}
async function callPettoVerificationJob(context, guildId, userId) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, job: null, link: null };
  const call = await botFetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/verification/job?user_id=${encodeURIComponent(userId)}`, {
    headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json" }
  }, { timeoutMs: 5e3, mode: "read" }).catch(() => null);
  if (!call || !call.response || call.down) return { ok: false, job: null, link: null, down: true };
  const payload = call.data;
  return { ok: Boolean(call.response.ok && payload?.ok), job: payload?.job ?? null, link: payload?.link ?? null };
}
async function callPettoConfessionPanel(context, guildId, userId, channelId) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "The dashboard is not connected to the bot." };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/confessions/panel`, {
      method: "POST",
      signal: AbortSignal.timeout(25e3),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, channel_id: channelId })
    });
    const payload = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === "string" ? payload.message : response.ok ? "Done." : "The bot could not do it." };
  } catch {
    return { ok: false, message: "The bot did not answer in time." };
  }
}
async function callPettoSuggestionAnswer(context, guildId, userId, id, status, reason) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "The dashboard is not connected to the bot." };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/suggestions/answer`, {
      method: "POST",
      signal: AbortSignal.timeout(25e3),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, id, status, reason })
    });
    const payload = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === "string" ? payload.message : response.ok ? "Done." : "The bot could not do it.", ...typeof payload?.warning === "string" && payload.warning ? { warning: payload.warning.slice(0, 400) } : {} };
  } catch {
    return { ok: false, message: "The bot did not answer in time." };
  }
}
async function callPettoSuggestionVotes(context, guildId, userId, id) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "The dashboard is not connected to the bot." };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/suggestions/votes`, {
      method: "POST",
      signal: AbortSignal.timeout(25e3),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, id })
    });
    const payload = await response.json().catch(() => null);
    return response.ok && payload?.ok ? payload : { ok: false, message: typeof payload?.message === "string" ? payload.message : "The bot could not do it." };
  } catch {
    return { ok: false, message: "The bot did not answer in time." };
  }
}
async function callPettoTicketTranscript(context, guildId, userId, number) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "The dashboard is not connected to the bot." };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/tickets/transcript`, {
      method: "POST",
      signal: AbortSignal.timeout(25e3),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, number })
    });
    const payload = await response.json().catch(() => null);
    return response.ok && payload?.ok ? payload : { ok: false, message: typeof payload?.message === "string" ? payload.message : "The bot could not do it." };
  } catch {
    return { ok: false, message: "The bot did not answer in time." };
  }
}
async function callPettoSupportJoin(context, userId, accessToken) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return false;
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/support/join`, {
      method: "POST",
      signal: AbortSignal.timeout(8e3),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, access_token: accessToken })
    });
    const payload = await response.json().catch(() => null);
    return response.ok && Boolean(payload?.ok);
  } catch {
    return false;
  }
}
async function callPettoAntinukeRestore(context, guildId, userId, id) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "The dashboard is not connected to the bot." };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/antinuke/restore`, {
      method: "POST",
      signal: AbortSignal.timeout(4e4),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, id })
    });
    const payload = await response.json().catch(() => null);
    return payload && typeof payload === "object" && "ok" in payload ? { ok: Boolean(payload.ok), message: typeof payload.message === "string" ? payload.message : void 0, done: payload.done, failed: payload.failed } : { ok: false, message: "The bot could not do it." };
  } catch {
    return { ok: false, message: "The bot did not answer in time." };
  }
}
async function callPettoNativeAutomod(context, guildId, userId, body) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "The dashboard is not connected to the bot." };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/automod/native`, {
      method: "POST",
      signal: AbortSignal.timeout(3e4),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: userId })
    });
    const payload = await response.json().catch(() => null);
    return response.ok && payload?.ok ? payload : { ok: false, message: typeof payload?.message === "string" ? payload.message : "The bot could not do it." };
  } catch {
    return { ok: false, message: "The bot did not answer in time." };
  }
}
async function callPettoLiftSanction(context, guildId, userId, caseNumber, reason) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "The dashboard is not connected to the bot." };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/moderation/lift`, {
      method: "POST",
      signal: AbortSignal.timeout(3e4),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, case: caseNumber, reason })
    });
    const payload = await response.json().catch(() => null);
    return response.ok && payload?.ok ? { ok: true } : { ok: false, message: typeof payload?.message === "string" ? payload.message : "The bot could not do it." };
  } catch {
    return { ok: false, message: "The bot did not answer in time." };
  }
}
async function callPettoLockdown(context, guildId, userId, body) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "The dashboard is not connected to the bot." };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/lockdown`, {
      method: "POST",
      signal: AbortSignal.timeout(6e4),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: userId })
    });
    const payload = await response.json().catch(() => null);
    return response.ok && payload?.ok ? payload : { ok: false, message: typeof payload?.message === "string" ? payload.message : "The bot could not do it." };
  } catch {
    return { ok: false, message: "The bot did not answer in time." };
  }
}
async function callPettoAppeals(context, guildId, userId, route, body) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, status: 503, payload: { ok: false, message: "not_configured" } };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/appeals/${route}`, {
      method: "POST",
      signal: AbortSignal.timeout(2e4),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: userId })
    });
    let payload = null;
    try {
      payload = await response.json();
    } catch {
    }
    return { ok: response.ok && payload?.ok !== false, status: response.status, payload };
  } catch {
    return { ok: false, status: 502, payload: { ok: false, message: "bot_unavailable" } };
  }
}
async function callPettoAppealImage(context, guildId, kind, init = {}) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return null;
  const { contentType, userId, ...rest } = init;
  const headers = new Headers(rest.headers);
  headers.set("X-Petto-Dashboard-Key", secret);
  if (rest.body && contentType) headers.set("Content-Type", contentType);
  const path = userId ? `/api/dashboard/guild/${encodeURIComponent(guildId)}/appeals/image/${encodeURIComponent(kind)}?user_id=${encodeURIComponent(userId)}` : `/api/appeals/${encodeURIComponent(guildId)}/image/${encodeURIComponent(kind)}`;
  try {
    return await fetch(`${baseUrl}${path}`, { ...rest, headers, signal: AbortSignal.timeout(2e4) });
  } catch {
    return null;
  }
}
async function callPettoAppealFile(context, guildId, userId, init = {}) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return null;
  const params = new URLSearchParams({ user_id: userId });
  for (const [key, value] of Object.entries(init.query ?? {})) params.set(key, String(value));
  const base = init.staff ? `/api/dashboard/guild/${encodeURIComponent(guildId)}/appeals/files` : `/api/appeals/${encodeURIComponent(guildId)}/files`;
  const path = `${base}${init.fileId ? `/${encodeURIComponent(init.fileId)}` : ""}?${params}`;
  const headers = { "X-Petto-Dashboard-Key": secret, Accept: "*/*" };
  if (init.body) headers["Content-Type"] = init.contentType ?? "application/octet-stream";
  try {
    return await fetch(`${baseUrl}${path}`, { method: init.method ?? "GET", headers, body: init.body, signal: AbortSignal.timeout(3e4) });
  } catch {
    return null;
  }
}
async function callPettoResync(context, guildId, userId) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "The dashboard is not connected to the bot." };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/resync`, {
      method: "POST",
      signal: AbortSignal.timeout(2e4),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    });
    const payload = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === "string" ? payload.message : void 0 };
  } catch {
    return { ok: false, message: "The bot did not answer in time." };
  }
}
async function callPettoMemberSearch(context, guildId, userId, query) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret || query.trim().length < 2) return [];
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/members/search`, {
      method: "POST",
      signal: AbortSignal.timeout(12e3),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ query, user_id: userId })
    });
    const payload = await response.json().catch(() => null);
    return response.ok && payload?.ok && Array.isArray(payload.members) ? payload.members : [];
  } catch {
    return [];
  }
}
async function callPettoForms(context, guildId, userId, route, body, lang = "en") {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "" };
  try {
    const grant = await roleGrant(context, guildId, "forms", route !== "submissions");
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/forms/${route}`, {
      method: "POST",
      signal: AbortSignal.timeout(25e3),
      headers: { ...grant, "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: userId })
    });
    const payload = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === "string" ? payload.message : "", url: payload?.url ?? null, data: payload };
  } catch {
    return { ok: false, message: "" };
  }
}
async function callPettoForums(context, guildId, userId, route, body = {}, lang = "en") {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "" };
  try {
    const write = route === "panel" || route === "action";
    const grant = await roleGrant(context, guildId, "forums", write);
    const call = await botFetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/forums/${route}`, {
      method: "POST",
      headers: { ...grant, "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: userId })
    }, { timeoutMs: write ? 25e3 : 6e3, mode: write ? "change" : "read", retryAt: write ? PATIENT_RETRY : void 0 });
    if (!call.response || call.down) return { ok: false, message: "", down: true };
    const payload = call.data;
    return { ok: Boolean(call.response.ok && payload?.ok), message: typeof payload?.message === "string" ? payload.message : "", url: payload?.url ?? null, data: payload };
  } catch {
    return { ok: false, message: "", down: true };
  }
}
async function callPettoCounters(context, guildId, userId, route, body = {}, lang = "en") {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "" };
  try {
    const grant = await roleGrant(context, guildId, "counters", route !== "preview");
    const call = await botFetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/counters/${route}`, {
      method: "POST",
      headers: { ...grant, "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: userId })
    }, { timeoutMs: route === "preview" ? 6e3 : 25e3, mode: route === "preview" || route === "refresh" ? "read" : "change", retryAt: route === "preview" ? void 0 : PATIENT_RETRY });
    if (!call.response || call.down) return { ok: false, message: "", down: true };
    const payload = call.data;
    return { ok: Boolean(call.response.ok && payload?.ok), message: typeof payload?.message === "string" ? payload.message : "", data: payload };
  } catch {
    return { ok: false, message: "", down: true };
  }
}
async function callPettoFeeds(context, guildId, userId, route, body = {}, lang = "en") {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, status: 503, message: "", data: null };
  try {
    const grant = await roleGrant(context, guildId, "feeds", route !== "resolve" && route !== "search" && route !== "preview");
    const call = await botFetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/feeds/${route}`, {
      method: "POST",
      headers: { ...grant, "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: userId })
    }, { timeoutMs: route === "create" || route === "test" ? 25e3 : 12e3, mode: route === "resolve" || route === "search" || route === "preview" ? "read" : "change" });
    if (!call.response || call.down) return { ok: false, status: 502, message: "", data: null, down: true, retrySafe: call.retrySafe };
    const data = call.data;
    return { ok: Boolean(call.response.ok && data?.ok), status: call.response.status, message: typeof data?.message === "string" ? data.message : "", data };
  } catch {
    return { ok: false, status: 502, message: "", data: null, down: true, retrySafe: false };
  }
}
async function callPettoWebForm(context, formId, userId, route, body = {}, lang = "en") {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, status: 503, data: null };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/form/${encodeURIComponent(formId)}/${route}`, {
      method: "POST",
      signal: AbortSignal.timeout(route === "submit" ? 25e3 : route === "look" ? 5e3 : 8e3),
      headers: { "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(route === "look" ? body : { ...body, user_id: userId })
    });
    const data = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && data?.ok), status: response.status, data };
  } catch {
    return { ok: false, status: 502, data: null };
  }
}
async function callPettoHoneypot(context, guildId, userId, action, body, lang = "en") {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "" };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/honeypot/${action}`, {
      method: "POST",
      signal: AbortSignal.timeout(25e3),
      headers: { "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: userId })
    });
    const payload = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === "string" ? payload.message : "", code: typeof payload?.code === "string" ? payload.code : payload?.error, honeypot: payload?.honeypot };
  } catch {
    return { ok: false, message: "" };
  }
}
async function callPettoInvites(context, guildId, userId, action, body, lang = "en") {
  return callPettoAction(context, guildId, userId, "stats", `invites/${action}`, body, lang);
}
async function callPettoTimerRun(context, guildId, userId, timerId, lang = "en") {
  return callPettoAction(context, guildId, userId, "automation", `timers/${encodeURIComponent(timerId)}/run`, {}, lang);
}
async function callPettoCases(context, guildId, userId, action, body, lang = "en") {
  return callPettoAction(context, guildId, userId, "moderation", `cases/${action}`, body, lang);
}
async function callPettoPagination(context, guildId, userId, action, body, lang = "en") {
  return callPettoAction(context, guildId, userId, "embeds", `pagination/${action}`, body, lang);
}
async function callPettoAction(context, guildId, userId, page, route, body, lang) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "" };
  try {
    const grant = await roleGrant(context, guildId, page, true);
    const call = await botFetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/${route}`, {
      method: "POST",
      headers: { ...grant, "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: userId })
    }, { timeoutMs: 2e4, mode: "change", retryAt: PATIENT_RETRY });
    if (!call.response || call.down) return { ok: false, message: "", down: true };
    const payload = call.data;
    return { ok: Boolean(call.response.ok && payload?.ok), message: typeof payload?.message === "string" ? payload.message : "", code: typeof payload?.code === "string" ? payload.code : payload?.error };
  } catch {
    return { ok: false, message: "", down: true };
  }
}
async function callPettoBoosterRoles(context, guildId, userId, action, body = {}, lang = "en") {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "" };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/boosterroles/${action}`, {
      method: "POST",
      signal: AbortSignal.timeout(action === "list" ? 8e3 : 25e3),
      headers: { "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: userId })
    });
    const payload = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === "string" ? payload.message : "", code: typeof payload?.code === "string" ? payload.code : payload?.error, data: payload };
  } catch {
    return { ok: false, message: "" };
  }
}
async function callPettoTicketLive(context, guildId, userId, route, body = {}, lang = "en") {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, status: 503, data: { ok: false, code: "not_configured" } };
  const write = route !== "list" && route !== "messages";
  try {
    const grant = await roleGrant(context, guildId, "tickets", write);
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/tickets/live/${route}`, {
      method: "POST",
      signal: AbortSignal.timeout(write ? 12e3 : 4e3),
      headers: { ...grant, "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, user_id: userId })
    });
    const data = await response.json().catch(() => null);
    return { ok: Boolean(response.ok && data?.ok), status: response.status, data: data ?? { ok: false } };
  } catch {
    return { ok: false, status: 504, data: { ok: false, code: "bot_unavailable" } };
  }
}
async function callPettoQuickSetup(context, guildId, userId, setup, lang = "en") {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, message: "", results: [] };
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/quick-setup`, {
      method: "POST",
      signal: AbortSignal.timeout(6e4),
      headers: { "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ setup, user_id: userId })
    });
    const payload = await response.json().catch(() => null);
    const results = Array.isArray(payload?.results) ? payload.results.map((row) => ({ module: String(row?.module ?? ""), ok: Boolean(row?.ok), message: String(row?.message ?? "") })) : [];
    return { ok: Boolean(response.ok && payload?.ok), message: typeof payload?.message === "string" ? payload.message : "", results };
  } catch {
    return { ok: false, message: "", results: [] };
  }
}
async function callPettoMigrateAi(context, guildId, userId, input, lang = "en") {
  const { baseUrl, secret } = apiConfig(context);
  const none = { ok: false, status: 504, answer: "", unknown: [], message: "", retryAfter: null };
  if (!baseUrl || !secret) return none;
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/migrate-ai`, {
      method: "POST",
      signal: AbortSignal.timeout(3e4),
      headers: { "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, user_id: userId })
    });
    const payload = await response.json().catch(() => null);
    return {
      ok: Boolean(response.ok && payload?.ok),
      status: response.status,
      answer: typeof payload?.answer === "string" ? payload.answer : "",
      unknown: Array.isArray(payload?.unknown) ? payload.unknown.map(String).slice(0, 20) : [],
      message: typeof payload?.message === "string" ? payload.message : "",
      retryAfter: Number.isFinite(payload?.retryAfter) ? Number(payload.retryAfter) : null
    };
  } catch {
    return none;
  }
}
async function callPettoPermissionAlerts(context, guildId, userId, action, key = "", lang = "en") {
  const { baseUrl, secret } = apiConfig(context);
  const none = { ok: false, alerts: [], message: "", down: true };
  if (!baseUrl || !secret) return none;
  try {
    const base = `${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/permission-alerts`;
    const headers = { "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json" };
    const response = action === "list" ? await fetch(`${base}?user_id=${encodeURIComponent(userId)}`, { method: "GET", headers, signal: AbortSignal.timeout(1e4) }) : await fetch(`${base}/dismiss`, { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ key, user_id: userId }), signal: AbortSignal.timeout(1e4) });
    const payload = await response.json().catch(() => null);
    const alerts = Array.isArray(payload?.alerts) ? payload.alerts.slice(0, 40).map((row) => ({
      key: String(row?.key ?? ""),
      feature: String(row?.feature ?? ""),
      kind: row?.kind === "hierarchy" ? "hierarchy" : "missing",
      lines: Array.isArray(row?.lines) ? row.lines.map(String).slice(0, 8) : [],
      occurrences: Number(row?.occurrences) || 1,
      firstSeen: String(row?.firstSeen ?? ""),
      lastSeen: String(row?.lastSeen ?? ""),
      notifiedAt: row?.notifiedAt ? String(row.notifiedAt) : null
    })).filter((row) => row.key) : [];
    return { ok: Boolean(response.ok && payload?.ok), alerts, message: typeof payload?.message === "string" ? payload.message : "", down: payload === null && response.status >= 500 };
  } catch {
    return none;
  }
}
async function callPettoRuleTest(context, guildId, userId, rule, sample, lang = "en") {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return null;
  try {
    const grant = await roleGrant(context, guildId, "rules", false);
    const response = await fetch(`${baseUrl}/api/dashboard/guild/${encodeURIComponent(guildId)}/rules/test`, {
      method: "POST",
      signal: AbortSignal.timeout(1e4),
      headers: { ...grant, "X-Petto-Dashboard-Key": secret, "X-Petto-Language": lang, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ rule, sample, user_id: userId })
    });
    const payload = await response.json().catch(() => null);
    return payload && typeof payload === "object" ? payload : null;
  } catch {
    return null;
  }
}
async function callPettoCeramos(context, userId, route, body) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, data: null, down: true };
  const read = route === "catalog" || route === "state" || route === "rank-card" || route === "ledger" || route === "admin/badges" || route === "admin/shop" || route === "admin/plans" || route === "upload-state" || route === "admin/uploads" || route === "own-badge-state" || route === "admin/own-badges" || route === "missions" || route === "summary" || route === "api-keys" || route === "admin/grant" && !body;
  const headers = { "X-Petto-Dashboard-Key": secret, Accept: "application/json", ...read ? {} : { "Content-Type": "application/json" } };
  const url = `${baseUrl}/api/dashboard/ceramos/${route}${read ? `?user_id=${encodeURIComponent(userId)}` : ""}`;
  const call = await botFetch(url, read ? { headers } : { method: "POST", headers, body: JSON.stringify({ ...body ?? {}, user_id: userId }) }, { timeoutMs: 8e3, mode: read ? "read" : "change" });
  return { ok: Boolean(call.response?.ok && call.data?.ok), data: call.data, down: call.down };
}
async function sendPettoUpload(context, userId, bytes) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, data: null, down: true };
  const url = `${baseUrl}/api/dashboard/ceramos/upload-submit?user_id=${encodeURIComponent(userId)}`;
  const call = await botFetch(url, { method: "POST", headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/octet-stream" }, body: bytes }, { timeoutMs: 15e3, mode: "change" });
  return { ok: Boolean(call.response?.ok && call.data?.ok), data: call.data, down: call.down };
}
async function sendPettoOwnBadge(context, userId, slot, name, bytes) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, data: null, down: true };
  const url = `${baseUrl}/api/dashboard/ceramos/own-badge-submit?user_id=${encodeURIComponent(userId)}&slot=${encodeURIComponent(slot)}&name=${encodeURIComponent(name)}`;
  const call = await botFetch(url, { method: "POST", headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/octet-stream" }, body: bytes }, { timeoutMs: 15e3, mode: "change" });
  return { ok: Boolean(call.response?.ok && call.data?.ok), data: call.data, down: call.down };
}
async function fetchPettoPendingBadge(context, ownerId, person, slot) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret || !/^\d{15,25}$/.test(person) || !/^[1-4]$/.test(slot)) return null;
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/ceramos/admin/own-badge-file?user_id=${encodeURIComponent(ownerId)}&person=${encodeURIComponent(person)}&slot=${slot}`, { headers: { "X-Petto-Dashboard-Key": secret }, signal: AbortSignal.timeout(8e3) });
    if (!response.ok) return null;
    return { bytes: await response.arrayBuffer(), type: response.headers.get("content-type") ?? "image/png" };
  } catch {
    return null;
  }
}
async function fetchPettoPendingUpload(context, ownerId, person) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret || !/^\d{15,25}$/.test(person)) return null;
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/ceramos/admin/upload-file?user_id=${encodeURIComponent(ownerId)}&person=${encodeURIComponent(person)}`, { headers: { "X-Petto-Dashboard-Key": secret }, signal: AbortSignal.timeout(8e3) });
    if (!response.ok) return null;
    return { bytes: await response.arrayBuffer(), type: response.headers.get("content-type") ?? "image/webp" };
  } catch {
    return null;
  }
}
async function callPettoPublic(context, what, key) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, data: null, down: true };
  const url = `${baseUrl}/api/dashboard/ceramos/public/${what}`;
  const call = await botFetch(url, what === "info" ? { headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json" } } : { method: "POST", headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ key }) }, { timeoutMs: 8e3, mode: what === "info" ? "read" : "change" });
  return { ok: Boolean(call.response?.ok && call.data?.ok), data: call.data, down: call.down };
}
async function fetchPettoDesignFile(context, id, size) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret || !/^[a-z0-9-]{3,30}$/.test(id) || !/^(thumb|full)$/.test(size)) return null;
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/ceramos/design-file/${id}/${size}`, { headers: { "X-Petto-Dashboard-Key": secret }, signal: AbortSignal.timeout(8e3) });
    if (!response.ok) return null;
    return { bytes: await response.arrayBuffer(), type: response.headers.get("content-type") ?? "image/webp" };
  } catch {
    return null;
  }
}
async function sendPettoBadgeImage(context, userId, badgeId, bytes) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, data: null, down: true };
  const url = `${baseUrl}/api/dashboard/ceramos/admin/badge-image?user_id=${encodeURIComponent(userId)}&id=${encodeURIComponent(badgeId)}`;
  const call = await botFetch(url, { method: "POST", headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/octet-stream" }, body: bytes }, { timeoutMs: 12e3, mode: "change" });
  return { ok: Boolean(call.response?.ok && call.data?.ok), data: call.data, down: call.down };
}
async function fetchPettoBadgeArt(context, badgeId) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret || !/^[a-z0-9-]{1,40}$/.test(badgeId)) return null;
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/ceramos/badge-art/${badgeId}`, { headers: { "X-Petto-Dashboard-Key": secret }, signal: AbortSignal.timeout(8e3) });
    if (!response.ok) return null;
    return { bytes: await response.arrayBuffer(), type: response.headers.get("content-type") ?? "image/png" };
  } catch {
    return null;
  }
}
async function sendPettoShopFile(context, userId, route, query, bytes) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret) return { ok: false, data: null, down: true };
  const params = new URLSearchParams({ user_id: userId, ...query });
  const call = await botFetch(`${baseUrl}/api/dashboard/ceramos/${route}?${params}`, { method: "POST", headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", "Content-Type": "application/octet-stream" }, body: bytes }, { timeoutMs: 15e3, mode: "change" });
  return { ok: Boolean(call.response?.ok && call.data?.ok), data: call.data, down: call.down };
}
async function fetchPettoItemFile(context, kind, id) {
  const { baseUrl, secret } = apiConfig(context);
  if (!baseUrl || !secret || !/^(banner|font)$/.test(kind) || !/^[a-z0-9-]{1,40}$/.test(id)) return null;
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/ceramos/item-file/${kind}/${id}`, { headers: { "X-Petto-Dashboard-Key": secret }, signal: AbortSignal.timeout(8e3) });
    if (!response.ok) return null;
    return { bytes: await response.arrayBuffer(), type: response.headers.get("content-type") ?? "application/octet-stream" };
  } catch {
    return null;
  }
}

export { fetchPettoPendingBadge as $, callPettoForms as A, callPettoForums as B, syncPettoPrefix as C, callPettoGiveaway as D, callPettoHoneypot as E, callPettoLockdown as F, callPettoMemberSearch as G, callPettoMigrateAi as H, callPettoLiftSanction as I, callPettoCases as J, callPettoPermissionAlerts as K, callPettoQuestMethod as L, callPettoQuickSetup as M, callPettoResync as N, callPettoRuleTest as O, callPettoInvites as P, callPettoStreakBoard as Q, callPettoSuggestionVotes as R, callPettoSuggestionAnswer as S, callPettoTicketTranscript as T, callPettoTicketLive as U, callPettoVerificationJob as V, fetchPettoItemFile as W, sendPettoOwnBadge as X, sendPettoUpload as Y, fetchPettoDesignFile as Z, sendPettoShopFile as _, callPettoPublic as a, fetchPettoPendingUpload as a0, callPettoAppealFile as b, callPettoWebForm as c, callPettoAppealImage as d, callPettoCeramos as e, fetchPettoBadgeArt as f, callPettoSupportJoin as g, callPettoAntinukeRestore as h, callPettoAppeals as i, callPettoTimerRun as j, syncPettoLanguage as k, callPettoNativeAutomod as l, exportPettoVaultBackup as m, callPettoVaultRestore as n, callPettoVault as o, pingPettoBot as p, callPettoVerification as q, callPettoCards as r, sendPettoBadgeImage as s, callPettoCode as t, callPettoBoosterRoles as u, renderPollMessage as v, callPettoConfessionPanel as w, callPettoCounters as x, callPettoPagination as y, callPettoFeeds as z };
