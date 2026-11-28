import { g as getEnv } from './env_WnBvzCjc.mjs';

const SNOWFLAKE = /^\d{15,25}$/;
const CONFIG_DEFAULTS = {
  slug: null,
  enabled: false,
  greeting: null,
  language: "en",
  rejoin_invite_code: null,
  auto_invite: false,
  allow_server_id: true,
  punishment_types: ["ban", "mute"],
  punishment_details: ["reason", "duration"],
  punishment_source: "both",
  warns_max_age_days: 30,
  anonymous_messages: false,
  allow_replies: true,
  store_days: 7,
  submission_channel_id: null,
  log_channel_id: null,
  auto_thread: false,
  thread_name: "Appeal by {username}",
  ping_role_ids: [],
  messages: {},
  brand: {},
  embed: {},
  dm_link_mode: "always",
  dm_link_types: ["ban", "tempban", "softban", "kick", "timeout", "warn"],
  dm_note: null,
  min_wait_hours: 0
};
const THEMES = {
  peach: { label: "Peach", accent: "#f0a88f" },
  rose: { label: "Rose", accent: "#f78fb3" },
  amber: { label: "Amber", accent: "#fed53c" },
  mint: { label: "Mint", accent: "#7ee0a8" },
  sky: { label: "Sky", accent: "#6ec6ff" },
  lilac: { label: "Lilac", accent: "#b9a3ff" },
  slate: { label: "Slate", accent: "#b4bcd0" }
};
const hexColor = (value) => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim().toLowerCase() : null;
function linkProblem(value) {
  const raw = String(value ?? "").trim();
  if (!raw || raw.length > 500) return "format";
  let url;
  try {
    url = new URL(raw);
  } catch {
    return "format";
  }
  if (url.protocol !== "https:") return "https";
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal") || !host.includes(".") || /^[\d.]+$/.test(host) || host.includes(":")) return "host";
  return null;
}
const safeUrl = (value) => {
  if (typeof value !== "string" || linkProblem(value)) return null;
  try {
    return new URL(value.trim()).toString();
  } catch {
    return null;
  }
};
const UPLOAD_KINDS = ["banner", "icon", "embed"];
const uploadMark = (kind) => `upload:${kind}`;
function pictureUrl(value, kind, where) {
  if (value === uploadMark(kind)) return where ? `${where.origin}/appeal/${where.path}/img/${kind}` : null;
  return safeUrl(value);
}
function themeFor(brand) {
  const base = THEMES[brand?.theme ?? "peach"] ?? THEMES.peach;
  return { ...base, accent: hexColor(brand?.accent) ?? base.accent };
}
function rest(ctx) {
  const apiUrl = getEnv(ctx, "PETTO_BOT_API_URL");
  const apiKey = getEnv(ctx, "PETTO_BOT_API_SECRET");
  return apiUrl && apiKey ? { apiUrl, headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" } } : null;
}
async function select(ctx, table, query) {
  const conn = rest(ctx);
  if (!conn) return null;
  try {
    const res = await fetch(`${conn.apiUrl}/rest/v1/${table}?${query}`, { headers: conn.headers, signal: AbortSignal.timeout(8e3) });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
async function resolveAddress(ctx, param) {
  if (SNOWFLAKE.test(param)) return { id: param, reserved: false };
  if (!/^[a-z0-9-]{3,32}$/.test(param)) return null;
  const rows = await select(ctx, "appeal_config", `slug=eq.${encodeURIComponent(param)}&select=guild_id&limit=1`);
  if (rows?.[0]) return { id: rows[0].guild_id, reserved: false };
  const kept = await select(ctx, "appeal_name_reservations", `slug=eq.${encodeURIComponent(param)}&reserved_until=gt.${encodeURIComponent((/* @__PURE__ */ new Date()).toISOString())}&select=guild_id&limit=1`);
  return kept?.[0] ? { id: kept[0].guild_id, reserved: true } : null;
}
async function resolveGuildId(ctx, param) {
  return (await resolveAddress(ctx, param))?.id ?? null;
}
async function loadConfig(ctx, guildId) {
  const rows = await select(ctx, "appeal_config", `guild_id=eq.${guildId}&select=*`);
  if (!rows) return null;
  return { ...CONFIG_DEFAULTS, ...rows[0] ?? {}, guild_id: guildId };
}
const loadLiveForms = (ctx, guildId) => select(ctx, "appeal_forms", `guild_id=eq.${guildId}&status=eq.live&select=*&order=position.asc,id.asc`);
const loadForm = async (ctx, guildId, formId) => (await select(ctx, "appeal_forms", `guild_id=eq.${guildId}&id=eq.${formId}&select=*`))?.[0] ?? null;
const loadSubmission = async (ctx, guildId, id) => /^[0-9a-f-]{36}$/i.test(id) ? (await select(ctx, "appeal_submissions", `guild_id=eq.${guildId}&id=eq.${id}&select=*`))?.[0] ?? null : null;
const loadUserSubmissions = (ctx, guildId, userId) => select(ctx, "appeal_submissions", `guild_id=eq.${guildId}&user_id=eq.${userId}&select=id,form_name,status,created_at,resolved_at&order=created_at.desc&limit=20`);
const loadMessages = (ctx, submissionId) => select(ctx, "appeal_messages", `submission_id=eq.${submissionId}&select=*&order=created_at.asc&limit=200`);
async function callBot(ctx, guildId, route, options = {}) {
  const baseUrl = getEnv(ctx, "PETTO_BOT_API_URL");
  const secret = getEnv(ctx, "PETTO_BOT_API_SECRET");
  if (!baseUrl || !secret) return { ok: false, status: 503, payload: { ok: false, error: "not_configured" } };
  const method = options.method ?? "GET";
  const query = method === "GET" && options.userId ? `?user_id=${encodeURIComponent(options.userId)}` : "";
  try {
    const response = await fetch(`${baseUrl}/api/appeals/${encodeURIComponent(guildId)}/${route}${query}`, {
      method,
      signal: AbortSignal.timeout(15e3),
      headers: { "X-Petto-Dashboard-Key": secret, Accept: "application/json", ...method === "POST" ? { "Content-Type": "application/json" } : {} },
      ...method === "POST" ? { body: JSON.stringify({ ...options.body, user_id: options.userId }) } : {}
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
function linkPreview(config, guild, lang, where) {
  const defaults = {
    en: { title: `Appeal your punishment in ${guild.name}`, description: `Sign in with Discord and send an appeal to the staff of ${guild.name}.` },
    es: { title: `Apela tu sanción en ${guild.name}`, description: `Entra con Discord y envía una apelación al staff de ${guild.name}.` },
    "pt-BR": { title: `Apele sua punição em ${guild.name}`, description: `Entre com o Discord e envie uma apelação para a equipe de ${guild.name}.` }
  }[lang];
  const theme = themeFor(config.brand);
  const image = pictureUrl(config.embed?.image_url, "embed", where) ?? pictureUrl(config.brand?.banner_url, "banner", where) ?? pictureUrl(config.brand?.icon_url, "icon", where) ?? guild.icon;
  return {
    title: (config.embed?.title || "").trim().slice(0, 90) || defaults.title,
    description: (config.embed?.description || "").trim().slice(0, 240) || defaults.description,
    image: image ?? null,
    small: Boolean(config.embed?.thumbnail),
    color: hexColor(config.embed?.color) ?? theme.accent,
    siteName: (config.brand?.name || guild.name).slice(0, 60)
  };
}
function timeAgo(iso, lang) {
  if (!iso) return "";
  const diff = Date.now() - Date.parse(iso);
  const rtf = new Intl.RelativeTimeFormat(lang === "pt-BR" ? "pt" : lang, { numeric: "auto" });
  const units = [["day", 864e5], ["hour", 36e5], ["minute", 6e4]];
  for (const [unit, ms] of units) if (Math.abs(diff) >= ms) return rtf.format(-Math.round(diff / ms), unit);
  return rtf.format(0, "second");
}
const FORM_ICONS = ["scales", "gavel", "hammer", "prohibit", "speaker-slash", "chat-circle", "envelope-simple", "shield-check", "flag", "warning", "question", "heart", "star", "bell", "megaphone", "user"];
const LIMITS = { forms: 10, sections: 6, questions: 12, options: 20, label: 200, help: 300 };
const QUESTION_TYPES = ["short", "paragraph", "choice", "multi", "yesno", "number", "dropdown", "scale", "date", "link", "file", "confirm"];
const LIST_TYPES = ["choice", "multi", "dropdown"];
const FILE_ACCEPTS = ["images", "pdf", "images_pdf", "documents"];
const FILE_LIMITS = { bytes: 5 * 1024 * 1024, maxFiles: 5 };
const PUNISHMENT_TYPES = ["ban", "mute", "warn", "kick", "softban"];
const DM_LINK_TYPES = ["ban", "tempban", "softban", "kick", "timeout", "warn"];
const DM_LINK_MODES = ["always", "never", "types"];
const APPEAL_SETTING_LIMITS = { dmNote: 300, minWaitHours: 720 };
const BLOCKS = ["none", "day", "week", "month", "forever"];
const clip = (value, max) => String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);
function normalizeForm(input) {
  const form = {
    name: clip(input?.name, 80) || "Untitled form",
    icon: FORM_ICONS.includes(String(input?.icon ?? "")) ? String(input.icon) : null,
    short_description: clip(input?.short_description, 160) || null,
    description: clip(input?.description, 1500) || null,
    status: input?.status === "live" ? "live" : "draft",
    requirement_types: [...new Set((Array.isArray(input?.requirement_types) ? input.requirement_types : []).filter((t) => PUNISHMENT_TYPES.includes(t)))],
    block_on_reject: BLOCKS.includes(input?.block_on_reject) ? input.block_on_reject : "none",
    generate_invite: input?.generate_invite === true,
    messages: {},
    sections: []
  };
  for (const key of ["submitted", "accepted", "rejected"]) {
    const text = clip(input?.messages?.[key], 1e3);
    if (text) form.messages[key] = text;
  }
  const seen = /* @__PURE__ */ new Set();
  const unique = (raw, prefix, index) => {
    let value = /^[a-z0-9_-]{1,24}$/i.test(String(raw ?? "")) ? String(raw) : `${prefix}${index + 1}`;
    while (seen.has(value)) value = `${value}x`;
    seen.add(value);
    return value;
  };
  for (const [si, section] of (Array.isArray(input?.sections) ? input.sections : []).slice(0, LIMITS.sections).entries()) {
    const clean = { id: unique(section?.id, "s", si), title: clip(section?.title, 100) || `Section ${si + 1}`, description: clip(section?.description, 500) || null, questions: [] };
    for (const [qi, question] of (Array.isArray(section?.questions) ? section.questions : []).slice(0, LIMITS.questions).entries()) {
      const type = QUESTION_TYPES.includes(question?.type) ? question.type : "short";
      const label = clip(question?.label, LIMITS.label);
      if (!label) continue;
      const options = LIST_TYPES.includes(type) ? [...new Set((Array.isArray(question?.options) ? question.options : []).map((o) => clip(o, 100)).filter(Boolean))].slice(0, LIMITS.options) : [];
      if (LIST_TYPES.includes(type) && options.length < 2) continue;
      const num = (value, min, max, fallback) => {
        const n = Math.trunc(Number(value));
        return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
      };
      clean.questions.push({
        id: unique(question?.id, "q", qi),
        type,
        label,
        help: clip(question?.help, LIMITS.help) || null,
        required: question?.required !== false,
        options,
        ...type === "scale" ? { max: num(question?.max, 3, 10, 5) } : {},
        ...type === "file" ? { accept: FILE_ACCEPTS.includes(question?.accept) ? question.accept : "images", max_files: num(question?.max_files, 1, FILE_LIMITS.maxFiles, 3) } : {}
      });
    }
    form.sections.push(clean);
  }
  return form;
}
function answerView(answer) {
  if (answer.type === "file") return { kind: "files", files: (Array.isArray(answer.value) ? answer.value : []).filter((f) => typeof f === "object" && f !== null && "id" in f) };
  if (answer.type === "scale") return { kind: "text", text: `${String(answer.value)} / ${answer.max ?? 5}` };
  return { kind: "text", text: Array.isArray(answer.value) ? answer.value.join(", ") : String(answer.value) };
}

export { APPEAL_SETTING_LIMITS as A, BLOCKS as B, CONFIG_DEFAULTS as C, DM_LINK_TYPES as D, FILE_LIMITS as F, LIMITS as L, PUNISHMENT_TYPES as P, QUESTION_TYPES as Q, THEMES as T, UPLOAD_KINDS as U, loadForm as a, resolveAddress as b, callBot as c, loadConfig as d, timeAgo as e, loadLiveForms as f, loadUserSubmissions as g, loadMessages as h, loadSubmission as i, answerView as j, FORM_ICONS as k, linkPreview as l, hexColor as m, DM_LINK_MODES as n, normalizeForm as o, pictureUrl as p, linkProblem as q, resolveGuildId as r, safeUrl as s, themeFor as t, uploadMark as u };
