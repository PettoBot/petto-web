// Shared by the public appeal site (petto.sbs/appeal/<server id>) and the dashboard pages of appeals.
import { getEnv } from './env';

export type Ctx = { locals?: any };
export const SNOWFLAKE = /^\d{15,25}$/;

export interface AppealConfig {
  guild_id: string; slug: string | null; enabled: boolean; greeting: string | null; language: 'en' | 'es' | 'pt-BR';
  rejoin_invite_code: string | null; auto_invite: boolean; allow_server_id: boolean;
  punishment_types: string[]; punishment_details: string[]; punishment_source: 'petto' | 'discord' | 'both'; warns_max_age_days: number;
  anonymous_messages: boolean; allow_replies: boolean; store_days: number;
  submission_channel_id: string | null; log_channel_id: string | null; auto_thread: boolean; thread_name: string; ping_role_ids: string[];
  messages: Record<string, string>; brand: Brand; embed: EmbedMeta;
}
export interface Brand { name?: string; tagline?: string; banner_url?: string; icon_url?: string; theme?: string; accent?: string; }
export interface EmbedMeta { title?: string; description?: string; image_url?: string; color?: string; thumbnail?: boolean; }
export type QuestionType = 'short' | 'paragraph' | 'choice' | 'multi' | 'yesno' | 'number' | 'dropdown' | 'scale' | 'date' | 'link' | 'file' | 'confirm';
/** A file question says what it takes (`accept`) and how many files (`max_files`); a scale goes from 1 to `max`. */
export interface Question { id: string; type: QuestionType; label: string; help: string | null; required: boolean; options: string[]; max?: number; accept?: FileAccept; max_files?: number; }
export type FileAccept = 'images' | 'pdf' | 'images_pdf' | 'documents';
export interface AnswerFile { id: string; name: string; mime: string; size: number; }
export interface Section { id: string; title: string; description: string | null; questions: Question[]; }
export interface AppealForm {
  id: number; guild_id: string; name: string; icon: string | null; short_description: string | null; description: string | null;
  status: 'draft' | 'live'; position: number; requirement_types: string[]; block_on_reject: string; generate_invite: boolean; sections: Section[]; messages: Record<string, string>;
}
export interface Submission {
  id: string; guild_id: string; form_id: number | null; form_name: string; user_id: string; username: string; avatar_url: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'; answers: { id: string; label: string; type: string; value: string | string[] | AnswerFile[]; max?: number }[];
  punishments: { source: string; type: string; reason?: string | null; until?: string | null; moderator?: string | null }[];
  channel_id: string | null; message_id: string | null; thread_id: string | null; resolved_by: string | null; resolved_at: string | null; resolution_reason: string | null; created_at: string;
}
export interface AppealMessage { id: number; submission_id: string; author_type: 'user' | 'staff' | 'system'; author_name: string | null; content: string; anonymous: boolean; created_at: string; }
export interface PunishmentView { source: string; type: string; reason?: string | null; until?: string | null; moderator?: string | null; at?: string | null; }

export const CONFIG_DEFAULTS: Omit<AppealConfig, 'guild_id'> = {
  slug: null, enabled: false, greeting: null, language: 'en', rejoin_invite_code: null, auto_invite: false, allow_server_id: true,
  punishment_types: ['ban', 'mute'], punishment_details: ['reason', 'duration'], punishment_source: 'both', warns_max_age_days: 30,
  anonymous_messages: false, allow_replies: true, store_days: 7, submission_channel_id: null, log_channel_id: null, auto_thread: false,
  thread_name: 'Appeal by {username}', ping_role_ids: [], messages: {}, brand: {}, embed: {},
};

// The accent a server can pick for its appeal site; the rest of the look is always Petto's.
export const THEMES: Record<string, { label: string; accent: string }> = {
  peach: { label: 'Peach', accent: '#f0a88f' },
  rose: { label: 'Rose', accent: '#f78fb3' },
  amber: { label: 'Amber', accent: '#fed53c' },
  mint: { label: 'Mint', accent: '#7ee0a8' },
  sky: { label: 'Sky', accent: '#6ec6ff' },
  lilac: { label: 'Lilac', accent: '#b9a3ff' },
  slate: { label: 'Slate', accent: '#b4bcd0' },
};

export const hexColor = (value: unknown): string | null => (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim().toLowerCase() : null);
/** Why a link cannot be used for a picture, or null when it can. Allowed: https:// links of a public site, up to 500 characters. */
export function linkProblem(value: unknown): 'format' | 'https' | 'host' | null {
  const raw = String(value ?? '').trim();
  if (!raw || raw.length > 500) return 'format';
  let url: URL;
  try { url = new URL(raw); } catch { return 'format'; }
  if (url.protocol !== 'https:') return 'https';
  const host = url.hostname.toLowerCase();
  // Not a private place: localhost, an address of numbers, or a name that is only inside a network.
  if (host === 'localhost' || host.endsWith('.local') || host.endsWith('.internal') || !host.includes('.') || /^[\d.]+$/.test(host) || host.includes(':')) return 'host';
  return null;
}
export const safeUrl = (value: unknown): string | null => {
  if (typeof value !== 'string' || linkProblem(value)) return null;
  try { return new URL(value.trim()).toString(); } catch { return null; }
};

/** The pictures a server can upload from its device for the appeal page. In the settings they are saved as `upload:<kind>`. */
export const UPLOAD_KINDS = ['banner', 'icon', 'embed'] as const;
export type UploadKind = (typeof UPLOAD_KINDS)[number];
export const uploadMark = (kind: UploadKind) => `upload:${kind}`;
/** The address of a picture: a link as it is, or the page of the site that serves the uploaded one. `where` is how the page was reached. */
export function pictureUrl(value: unknown, kind: UploadKind, where?: { path: string; origin: string }): string | null {
  if (value === uploadMark(kind)) return where ? `${where.origin}/appeal/${where.path}/img/${kind}` : null;
  return safeUrl(value);
}

/** The accent of a server's site: the palette it picked, or its own color on top. */
export function themeFor(brand: Brand | undefined) {
  const base = THEMES[brand?.theme ?? 'peach'] ?? THEMES.peach;
  return { ...base, accent: hexColor(brand?.accent) ?? base.accent };
}

function rest(ctx: Ctx) {
  const apiUrl = getEnv(ctx, 'PETTO_BOT_API_URL');
  const apiKey = getEnv(ctx, 'PETTO_BOT_API_SECRET');
  return apiUrl && apiKey ? { apiUrl, headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } as Record<string, string> } : null;
}

async function select<T>(ctx: Ctx, table: string, query: string): Promise<T[] | null> {
  const conn = rest(ctx);
  if (!conn) return null;
  try {
    const res = await fetch(`${conn.apiUrl}/rest/v1/${table}?${query}`, { headers: conn.headers, signal: AbortSignal.timeout(8000) });
    return res.ok ? ((await res.json()) as T[]) : null;
  } catch { return null; }
}

/** The server an appeal link names: its id, the short name it holds, or a name it changed away from (reserved for it, so the old link leads to the new address). */
export async function resolveAddress(ctx: Ctx, param: string): Promise<{ id: string; reserved: boolean } | null> {
  if (SNOWFLAKE.test(param)) return { id: param, reserved: false };
  if (!/^[a-z0-9-]{3,32}$/.test(param)) return null;
  const rows = await select<{ guild_id: string }>(ctx, 'appeal_config', `slug=eq.${encodeURIComponent(param)}&select=guild_id&limit=1`);
  if (rows?.[0]) return { id: rows[0].guild_id, reserved: false };
  const kept = await select<{ guild_id: string }>(ctx, 'appeal_name_reservations', `slug=eq.${encodeURIComponent(param)}&reserved_until=gt.${encodeURIComponent(new Date().toISOString())}&select=guild_id&limit=1`);
  return kept?.[0] ? { id: kept[0].guild_id, reserved: true } : null;
}
export async function resolveGuildId(ctx: Ctx, param: string): Promise<string | null> {
  return (await resolveAddress(ctx, param))?.id ?? null;
}

export async function loadConfig(ctx: Ctx, guildId: string): Promise<AppealConfig | null> {
  const rows = await select<Partial<AppealConfig>>(ctx, 'appeal_config', `guild_id=eq.${guildId}&select=*`);
  if (!rows) return null;
  return { ...CONFIG_DEFAULTS, ...(rows[0] ?? {}), guild_id: guildId } as AppealConfig;
}
export const loadLiveForms = (ctx: Ctx, guildId: string) => select<AppealForm>(ctx, 'appeal_forms', `guild_id=eq.${guildId}&status=eq.live&select=*&order=position.asc,id.asc`);
export const loadForm = async (ctx: Ctx, guildId: string, formId: number) => (await select<AppealForm>(ctx, 'appeal_forms', `guild_id=eq.${guildId}&id=eq.${formId}&select=*`))?.[0] ?? null;
export const loadSubmission = async (ctx: Ctx, guildId: string, id: string) => (/^[0-9a-f-]{36}$/i.test(id) ? (await select<Submission>(ctx, 'appeal_submissions', `guild_id=eq.${guildId}&id=eq.${id}&select=*`))?.[0] ?? null : null);
export const loadUserSubmissions = (ctx: Ctx, guildId: string, userId: string) => select<Submission>(ctx, 'appeal_submissions', `guild_id=eq.${guildId}&user_id=eq.${userId}&select=id,form_name,status,created_at,resolved_at&order=created_at.desc&limit=20`);
export const loadMessages = (ctx: Ctx, submissionId: string) => select<AppealMessage>(ctx, 'appeal_messages', `submission_id=eq.${submissionId}&select=*&order=created_at.asc&limit=200`);

/** The bot's side of appeals: what only Discord knows and the actions that touch Discord. */
export async function callBot(ctx: Ctx, guildId: string, route: string, options: { method?: 'GET' | 'POST'; userId?: string; body?: Record<string, unknown> } = {}) {
  const baseUrl = getEnv(ctx, 'PETTO_BOT_API_URL');
  const secret = getEnv(ctx, 'PETTO_BOT_API_SECRET');
  if (!baseUrl || !secret) return { ok: false, status: 503, payload: { ok: false, error: 'not_configured' } as any };
  const method = options.method ?? 'GET';
  const query = method === 'GET' && options.userId ? `?user_id=${encodeURIComponent(options.userId)}` : '';
  try {
    const response = await fetch(`${baseUrl}/api/appeals/${encodeURIComponent(guildId)}/${route}${query}`, {
      method, signal: AbortSignal.timeout(15_000),
      headers: { 'X-Petto-Dashboard-Key': secret, Accept: 'application/json', ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}) },
      ...(method === 'POST' ? { body: JSON.stringify({ ...options.body, user_id: options.userId }) } : {}),
    });
    let payload: any = null;
    try { payload = await response.json(); } catch { /* keep the status */ }
    return { ok: response.ok && payload?.ok !== false, status: response.status, payload };
  } catch {
    return { ok: false, status: 502, payload: { ok: false, error: 'bot_unavailable' } as any };
  }
}

/** The tags the link preview of Discord (and other apps) reads, from what the server set in Brand. */
export function linkPreview(config: AppealConfig, guild: { name: string; icon: string | null }, lang: 'en' | 'es' | 'pt-BR', where?: { path: string; origin: string }) {
  const defaults = {
    en: { title: `Appeal your punishment in ${guild.name}`, description: `Sign in with Discord and send an appeal to the staff of ${guild.name}.` },
    es: { title: `Apela tu sanción en ${guild.name}`, description: `Entra con Discord y envía una apelación al staff de ${guild.name}.` },
    'pt-BR': { title: `Apele sua punição em ${guild.name}`, description: `Entre com o Discord e envie uma apelação para a equipe de ${guild.name}.` },
  }[lang];
  const theme = themeFor(config.brand);
  const image = pictureUrl(config.embed?.image_url, 'embed', where) ?? pictureUrl(config.brand?.banner_url, 'banner', where) ?? pictureUrl(config.brand?.icon_url, 'icon', where) ?? guild.icon;
  return {
    title: (config.embed?.title || '').trim().slice(0, 90) || defaults.title,
    description: (config.embed?.description || '').trim().slice(0, 240) || defaults.description,
    image: image ?? null,
    small: Boolean(config.embed?.thumbnail),
    color: hexColor(config.embed?.color) ?? theme.accent,
    siteName: (config.brand?.name || guild.name).slice(0, 60),
  };
}

export function timeAgo(iso: string | null | undefined, lang: string): string {
  if (!iso) return '';
  const diff = Date.now() - Date.parse(iso);
  const rtf = new Intl.RelativeTimeFormat(lang === 'pt-BR' ? 'pt' : lang, { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [['day', 86_400_000], ['hour', 3_600_000], ['minute', 60_000]];
  for (const [unit, ms] of units) if (Math.abs(diff) >= ms) return rtf.format(-Math.round(diff / ms), unit);
  return rtf.format(0, 'second');
}

// ── Forms as the dashboard saves them (the bot cuts a form down the same way; keep the limits in step with src/utils/appeals.js of the bot) ──
export const FORM_ICONS = ['scales', 'gavel', 'hammer', 'prohibit', 'speaker-slash', 'chat-circle', 'envelope-simple', 'shield-check', 'flag', 'warning', 'question', 'heart', 'star', 'bell', 'megaphone', 'user'];

export const LIMITS = { forms: 10, sections: 6, questions: 12, options: 20, label: 200, help: 300 };
export const QUESTION_TYPES = ['short', 'paragraph', 'choice', 'multi', 'yesno', 'number', 'dropdown', 'scale', 'date', 'link', 'file', 'confirm'] as const;
export const LIST_TYPES = ['choice', 'multi', 'dropdown'] as const;
export const FILE_ACCEPTS = ['images', 'pdf', 'images_pdf', 'documents'] as const;
/** The limits of a file answer (the bot keeps the same numbers). */
export const FILE_LIMITS = { bytes: 5 * 1024 * 1024, maxFiles: 5 };
export const PUNISHMENT_TYPES = ['ban', 'mute', 'warn', 'kick'] as const;
export const BLOCKS = ['none', 'day', 'week', 'month', 'forever'] as const;
const clip = (value: unknown, max: number) => String(value ?? '').replace(/\u0000/g, '').trim().slice(0, max);

export function normalizeForm(input: any) {
  const form = {
    name: clip(input?.name, 80) || 'Untitled form',
    icon: FORM_ICONS.includes(String(input?.icon ?? '')) ? String(input.icon) : null,
    short_description: clip(input?.short_description, 160) || null,
    description: clip(input?.description, 1500) || null,
    status: input?.status === 'live' ? 'live' : 'draft',
    requirement_types: [...new Set((Array.isArray(input?.requirement_types) ? input.requirement_types : []).filter((t: string) => (PUNISHMENT_TYPES as readonly string[]).includes(t)))] as string[],
    block_on_reject: (BLOCKS as readonly string[]).includes(input?.block_on_reject) ? (input.block_on_reject as string) : 'none',
    generate_invite: input?.generate_invite === true,
    messages: {} as Record<string, string>,
    sections: [] as Section[],
  };
  for (const key of ['submitted', 'accepted', 'rejected']) {
    const text = clip(input?.messages?.[key], 1000);
    if (text) form.messages[key] = text;
  }
  const seen = new Set<string>();
  const unique = (raw: unknown, prefix: string, index: number) => {
    let value = /^[a-z0-9_-]{1,24}$/i.test(String(raw ?? '')) ? String(raw) : `${prefix}${index + 1}`;
    while (seen.has(value)) value = `${value}x`;
    seen.add(value);
    return value;
  };
  for (const [si, section] of (Array.isArray(input?.sections) ? input.sections : []).slice(0, LIMITS.sections).entries()) {
    const clean: Section = { id: unique(section?.id, 's', si), title: clip(section?.title, 100) || `Section ${si + 1}`, description: clip(section?.description, 500) || null, questions: [] };
    for (const [qi, question] of (Array.isArray(section?.questions) ? section.questions : []).slice(0, LIMITS.questions).entries()) {
      const type = (QUESTION_TYPES as readonly string[]).includes(question?.type) ? (question.type as QuestionType) : 'short';
      const label = clip(question?.label, LIMITS.label);
      if (!label) continue;
      const options = (LIST_TYPES as readonly string[]).includes(type) ? [...new Set((Array.isArray(question?.options) ? question.options : []).map((o: unknown) => clip(o, 100)).filter(Boolean))].slice(0, LIMITS.options) as string[] : [];
      if ((LIST_TYPES as readonly string[]).includes(type) && options.length < 2) continue;
      const num = (value: unknown, min: number, max: number, fallback: number) => { const n = Math.trunc(Number(value)); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback; };
      clean.questions.push({
        id: unique(question?.id, 'q', qi), type, label, help: clip(question?.help, LIMITS.help) || null, required: question?.required !== false, options,
        ...(type === 'scale' ? { max: num(question?.max, 3, 10, 5) } : {}),
        ...(type === 'file' ? { accept: (FILE_ACCEPTS as readonly string[]).includes(question?.accept) ? (question.accept as FileAccept) : 'images', max_files: num(question?.max_files, 1, FILE_LIMITS.maxFiles, 3) } : {}),
      });
    }
    form.sections.push(clean);
  }
  return form;
}

/** How an answer is shown: plain text, or the files it holds. A scale reads `3 / 5`. */
export function answerView(answer: Submission['answers'][number]): { kind: 'text'; text: string } | { kind: 'files'; files: AnswerFile[] } {
  if (answer.type === 'file') return { kind: 'files', files: (Array.isArray(answer.value) ? answer.value : []).filter((f): f is AnswerFile => typeof f === 'object' && f !== null && 'id' in f) };
  if (answer.type === 'scale') return { kind: 'text', text: `${String(answer.value)} / ${answer.max ?? 5}` };
  return { kind: 'text', text: Array.isArray(answer.value) ? (answer.value as string[]).join(', ') : String(answer.value) };
}
