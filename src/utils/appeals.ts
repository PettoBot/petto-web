// Shared by the public appeal site (petto.sbs/appeal/<server id>) and the dashboard pages of appeals.
import { getEnv } from './env';

export type Ctx = { locals?: any };
export const SNOWFLAKE = /^\d{15,25}$/;

export interface AppealConfig {
  guild_id: string; enabled: boolean; greeting: string | null; language: 'en' | 'es' | 'pt-BR';
  rejoin_invite_code: string | null; auto_invite: boolean; allow_server_id: boolean;
  punishment_types: string[]; punishment_details: string[]; punishment_source: 'petto' | 'discord' | 'both'; warns_max_age_days: number;
  anonymous_messages: boolean; allow_replies: boolean; store_days: number;
  submission_channel_id: string | null; log_channel_id: string | null; auto_thread: boolean; thread_name: string; ping_role_ids: string[];
  messages: Record<string, string>; brand: Brand; embed: EmbedMeta;
}
export interface Brand { name?: string; tagline?: string; banner_url?: string; icon_url?: string; theme?: string; accent?: string; }
export interface EmbedMeta { title?: string; description?: string; image_url?: string; color?: string; }
export interface Question { id: string; type: 'short' | 'paragraph' | 'choice' | 'multi' | 'yesno' | 'number'; label: string; help: string | null; required: boolean; options: string[]; }
export interface Section { id: string; title: string; description: string | null; questions: Question[]; }
export interface AppealForm {
  id: number; guild_id: string; name: string; icon: string | null; short_description: string | null; description: string | null;
  status: 'draft' | 'live'; position: number; requirement_types: string[]; block_on_reject: string; generate_invite: boolean; sections: Section[]; messages: Record<string, string>;
}
export interface Submission {
  id: string; guild_id: string; form_id: number | null; form_name: string; user_id: string; username: string; avatar_url: string | null;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'; answers: { id: string; label: string; type: string; value: string | string[] }[];
  punishments: { source: string; type: string; reason?: string | null; until?: string | null; moderator?: string | null }[];
  channel_id: string | null; message_id: string | null; thread_id: string | null; resolved_by: string | null; resolved_at: string | null; resolution_reason: string | null; created_at: string;
}
export interface AppealMessage { id: number; submission_id: string; author_type: 'user' | 'staff' | 'system'; author_name: string | null; content: string; anonymous: boolean; created_at: string; }
export interface PunishmentView { source: string; type: string; reason?: string | null; until?: string | null; moderator?: string | null; at?: string | null; }

export const CONFIG_DEFAULTS: Omit<AppealConfig, 'guild_id'> = {
  enabled: false, greeting: null, language: 'en', rejoin_invite_code: null, auto_invite: false, allow_server_id: true,
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
export const safeUrl = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  try { const url = new URL(value.trim()); return url.protocol === 'https:' ? url.toString() : null; } catch { return null; }
};

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
export function linkPreview(config: AppealConfig, guild: { name: string; icon: string | null }, lang: 'en' | 'es' | 'pt-BR') {
  const defaults = {
    en: { title: `Appeal your punishment in ${guild.name}`, description: `Sign in with Discord and send an appeal to the staff of ${guild.name}.` },
    es: { title: `Apela tu sanción en ${guild.name}`, description: `Entra con Discord y envía una apelación al staff de ${guild.name}.` },
    'pt-BR': { title: `Apele sua punição em ${guild.name}`, description: `Entre com o Discord e envie uma apelação para a equipe de ${guild.name}.` },
  }[lang];
  const theme = themeFor(config.brand);
  const image = safeUrl(config.embed?.image_url) ?? safeUrl(config.brand?.banner_url) ?? guild.icon;
  return {
    title: (config.embed?.title || '').trim().slice(0, 90) || defaults.title,
    description: (config.embed?.description || '').trim().slice(0, 240) || defaults.description,
    image: image ?? null,
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
