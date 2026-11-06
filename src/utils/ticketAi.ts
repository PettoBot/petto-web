// The AI assistant of the tickets (beta), server side: its settings in the bot's database, the monthly counter, the Groq client, the
// limits (one request at a time, requests per hour) and the actions of the page's API route. The prompt itself is put together in
// ticketAiPrompt.mjs. The Groq key (GROQ_API_KEY) is only read here, never sent to the browser, never logged, never put in a message.
import { formatDuration } from './formatDuration';
import { getEnv } from './env';
import { TICKET_AI_CONFIG as CFG } from '../data/ticketAiConfig';
import {
  LIMITS, normalizeSettings, buildTicketTurn, buildHelperTurn, checkMessage, detectHandoff, defuseMentions, parseHelperReply,
  parseMessageLinks,
} from './ticketAiPrompt.mjs';

export interface TicketAiSettings {
  enabled: boolean;
  categoryIds: string[];
  instructions: string;
  knowledge: string;
  handoff: string;
  replyStyle: string;
  /** links of Discord messages of the server that the bot reads live (at most 10) */
  messageLinks: string[];
  /** the assistant knows the channels the ticket user can see */
  channelGuide: boolean;
  tone: string;
  languageMode: string;
  maxReplies: number;
  updatedAt: string | null;
}
/** ok: read; pending: the table is not in the database yet (the bot update brings it); error: the database did not answer. */
export type TableState = 'ok' | 'pending' | 'error';

export const DEFAULT_SETTINGS: TicketAiSettings = {
  enabled: false, categoryIds: [], instructions: '', knowledge: '', handoff: '', replyStyle: '', messageLinks: [], channelGuide: true, tone: 'friendly', languageMode: 'auto', maxReplies: LIMITS.maxRepliesDefault, updatedAt: null,
};

type Db = { url: string; headers: Record<string, string> };

export function ticketAiDb(astro: any): Db | null {
  const url = getEnv(astro, 'PETTO_BOT_API_URL');
  const key = getEnv(astro, 'PETTO_BOT_API_SECRET');
  if (!url || !key) return null;
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' } };
}

/** Whether an answer of the database means "this table does not exist yet". */
async function tableMissing(res: Response): Promise<boolean> {
  if (res.status === 404) return true;
  const body: any = await res.clone().json().catch(() => null);
  return ['PGRST205', '42P01'].includes(String(body?.code ?? ''));
}

function log(event: string, details: Record<string, unknown> = {}) {
  console.log(JSON.stringify({ scope: 'ticket-ai', event, ...details }));
}

function fromRow(row: any): TicketAiSettings {
  const s = normalizeSettings({ instructions: row.instructions, knowledge: row.knowledge, handoff: row.handoff, reply_style: row.reply_style, tone: row.tone, language_mode: row.language_mode, max_replies: row.max_replies });
  return {
    enabled: row.enabled === true,
    categoryIds: Array.isArray(row.category_ids) ? row.category_ids.map(String).filter((id: string) => /^\d{1,25}$/.test(id)) : [],
    instructions: s.instructions, knowledge: s.knowledge, handoff: s.handoff, replyStyle: s.reply_style,
    messageLinks: Array.isArray(row.message_links) ? row.message_links.map(String).slice(0, LIMITS.discordMessages) : [], channelGuide: row.channel_guide !== false,
    tone: s.tone, languageMode: s.language_mode, maxReplies: s.max_replies,
    updatedAt: row.updated_at ?? null,
  };
}

export async function readTicketAiSettings(db: Db, guildId: string): Promise<{ state: TableState; settings: TicketAiSettings }> {
  try {
    const res = await fetch(`${db.url}/rest/v1/ticket_ai_settings?guild_id=eq.${guildId}&select=*`, { headers: db.headers, signal: AbortSignal.timeout(6000) });
    if (!res.ok) return { state: (await tableMissing(res)) ? 'pending' : 'error', settings: DEFAULT_SETTINGS };
    const rows = await res.json();
    return { state: 'ok', settings: Array.isArray(rows) && rows[0] ? fromRow(rows[0]) : DEFAULT_SETTINGS };
  } catch {
    return { state: 'error', settings: DEFAULT_SETTINGS };
  }
}

/** The month of the usage counter, in UTC: "2026-10". */
export const usageMonth = (date = new Date()) => date.toISOString().slice(0, 7);

export async function readTicketAiUsage(db: Db, guildId: string): Promise<{ state: TableState; replies: number }> {
  try {
    const res = await fetch(`${db.url}/rest/v1/ticket_ai_usage?guild_id=eq.${guildId}&month=eq.${usageMonth()}&select=replies`, { headers: db.headers, signal: AbortSignal.timeout(6000) });
    if (!res.ok) return { state: (await tableMissing(res)) ? 'pending' : 'error', replies: 0 };
    const rows = await res.json();
    const replies = Number(Array.isArray(rows) ? rows[0]?.replies : 0);
    return { state: 'ok', replies: Number.isFinite(replies) && replies > 0 ? Math.floor(replies) : 0 };
  } catch {
    return { state: 'error', replies: 0 };
  }
}

export type SaveInput = { enabled: boolean; categoryIds: string[]; instructions: string; knowledge: string; handoff: string; replyStyle: string; messageLinks: string[]; channelGuide: boolean; tone: string; languageMode: string; maxReplies: number };

/** Checks what the page sent. Texts over their cap are refused (the fields have the same maxlength, so this only catches a forged post). */
export function checkSaveInput(form: FormData, knownCategoryIds: Set<string> | null, guildId?: string): { ok: true; value: SaveInput } | { ok: false; errors: string[] } {
  const s = normalizeSettings({
    instructions: form.get('instructions'), knowledge: form.get('knowledge'), handoff: form.get('handoff'), reply_style: form.get('reply_style'),
    tone: String(form.get('tone') ?? ''), language_mode: String(form.get('language_mode') ?? ''), max_replies: form.get('max_replies'),
  }, { strict: true });
  if (s.errors.length) return { ok: false, errors: s.errors };
  const messageLinks = parseMessageLinks(String(form.get('message_links') ?? ''), guildId);
  if (!messageLinks) return { ok: false, errors: ['links'] };
  const scope = form.get('scope') === 'some' ? 'some' : 'all';
  const categoryIds = scope === 'all' ? [] : [...new Set(form.getAll('category_ids').map(String).filter((id) => /^\d{1,25}$/.test(id) && (!knownCategoryIds || knownCategoryIds.has(id))))].slice(0, 100);
  if (scope === 'some' && !categoryIds.length) return { ok: false, errors: ['scope'] };
  return { ok: true, value: { enabled: form.get('enabled') === 'on', categoryIds, instructions: s.instructions, knowledge: s.knowledge, handoff: s.handoff, replyStyle: s.reply_style, messageLinks, channelGuide: form.get('channel_guide') === 'on', tone: s.tone, languageMode: s.language_mode, maxReplies: s.max_replies } };
}

export async function saveTicketAiSettings(db: Db, guildId: string, userId: string, value: SaveInput): Promise<{ ok: boolean; pending: boolean }> {
  try {
    const res = await fetch(`${db.url}/rest/v1/ticket_ai_settings?on_conflict=guild_id`, {
      method: 'POST',
      headers: { ...db.headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        guild_id: guildId, enabled: value.enabled, category_ids: value.categoryIds, instructions: value.instructions, knowledge: value.knowledge,
        handoff: value.handoff, reply_style: value.replyStyle, message_links: value.messageLinks, channel_guide: value.channelGuide, tone: value.tone, max_replies: value.maxReplies, language_mode: value.languageMode,
        updated_at: new Date().toISOString(), updated_by: userId,
      }),
    });
    if (res.ok) return { ok: true, pending: false };
    const pending = await tableMissing(res);
    log('save-failed', { guildId, status: res.status, pending });
    return { ok: false, pending };
  } catch {
    log('save-failed', { guildId, status: 0 });
    return { ok: false, pending: false };
  }
}

// ---- Groq

export type ChatMessage = { role: string; content: string };
export type ChatResult = { ok: true; content: string } | { ok: false; code: 'timeout' | 'busy' | 'model' | 'upstream' | 'empty' };
export type ChatFn = (messages: ChatMessage[], maxTokens: number) => Promise<ChatResult>;

let modelCache: { model: string; until: number } | null = null;

/** The model: GROQ_MODEL, or the first of the preferred ones that Groq lists now (kept for a few hours), or the first preferred one. */
async function resolveModel(astro: any, key: string): Promise<string> {
  const forced = String(getEnv(astro, 'GROQ_MODEL') ?? '').trim();
  if (forced) return forced;
  if (modelCache && modelCache.until > Date.now()) return modelCache.model;
  const fallback = CFG.modelPreference[0];
  try {
    const res = await fetch(`${CFG.groqBase}/models`, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(CFG.modelsTimeoutMs) });
    if (!res.ok) throw new Error(String(res.status));
    const body: any = await res.json();
    const listed = new Set<string>((Array.isArray(body?.data) ? body.data : []).filter((m: any) => m?.active !== false).map((m: any) => String(m?.id ?? '')));
    const model = CFG.modelPreference.find((id) => listed.has(id)) ?? fallback;
    modelCache = { model, until: Date.now() + CFG.modelsCacheMs };
    return model;
  } catch (error) {
    log('models-unavailable', { status: (error as Error)?.name === 'TimeoutError' ? 'timeout' : String((error as Error)?.message ?? '').slice(0, 12) });
    modelCache = { model: fallback, until: Date.now() + CFG.modelsRetryMs };
    return fallback;
  }
}

/** The Groq chat for this request, or null when GROQ_API_KEY is not set. */
export function groqChat(astro: any): ChatFn | null {
  const key = String(getEnv(astro, 'GROQ_API_KEY') ?? '').trim();
  if (!key) return null;
  return async (messages, maxTokens) => {
    const model = await resolveModel(astro, key);
    // The GPT-OSS models think before answering: a little thinking, kept out of the answer.
    const reasoning = model.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low', include_reasoning: false } : {};
    try {
      const res = await fetch(`${CFG.groqBase}/chat/completions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(CFG.timeoutMs),
        body: JSON.stringify({ model, messages, temperature: CFG.temperature, max_completion_tokens: maxTokens, stream: false, ...reasoning }),
      });
      if (!res.ok) {
        // Only the status is kept: the body of an error is never logged or shown.
        log('upstream-error', { status: res.status, model });
        if (res.status === 429 || res.status === 503) return { ok: false, code: 'busy' };
        if (res.status === 404 || res.status === 400) {
          if (!getEnv(astro, 'GROQ_MODEL')) modelCache = null;
          return { ok: false, code: res.status === 404 ? 'model' : 'upstream' };
        }
        return { ok: false, code: 'upstream' };
      }
      const body: any = await res.json().catch(() => null);
      const content = body?.choices?.[0]?.message?.content;
      return typeof content === 'string' && content.trim() ? { ok: true, content } : { ok: false, code: 'empty' };
    } catch (error) {
      const timeout = (error as Error)?.name === 'TimeoutError' || (error as Error)?.name === 'AbortError';
      log(timeout ? 'upstream-timeout' : 'upstream-unreachable', { model });
      return { ok: false, code: timeout ? 'timeout' : 'upstream' };
    }
  };
}

// ---- limits: one request in flight per server and per person, and requests per hour. Kept in this process (on Discloud there is one;
// on Cloudflare each isolate keeps its own count, so the hourly limit is per isolate there).

const inFlight = new Set<string>();
const hits = new Map<string, number[]>();

function recent(key: string, now: number): number[] {
  const list = (hits.get(key) ?? []).filter((at) => now - at < CFG.rateWindowMs);
  if (list.length) hits.set(key, list); else hits.delete(key);
  return list;
}

/** Takes the slot for one model call, or says why not. `release` must be called when the call ends. */
export function takeSlot(guildId: string, userId: string): { ok: true; release: () => void } | { ok: false; code: 'in_flight' | 'rate_limited'; retryMinutes?: number } {
  const g = `g:${guildId}`;
  const u = `u:${userId}`;
  if (inFlight.has(g) || inFlight.has(u)) return { ok: false, code: 'in_flight' };
  const now = Date.now();
  const gHits = recent(g, now);
  const uHits = recent(u, now);
  if (gHits.length >= CFG.rateLimitPerServer || uHits.length >= CFG.rateLimitPerUser) {
    const oldest = Math.min(gHits.length >= CFG.rateLimitPerServer ? gHits[0] : Infinity, uHits.length >= CFG.rateLimitPerUser ? uHits[0] : Infinity);
    return { ok: false, code: 'rate_limited', retryMinutes: Math.max(1, Math.ceil((oldest + CFG.rateWindowMs - now) / 60000)) };
  }
  hits.set(g, [...gHits, now]);
  hits.set(u, [...uHits, now]);
  if (hits.size > 5000) hits.delete(hits.keys().next().value as string);
  inFlight.add(g);
  inFlight.add(u);
  let done = false;
  return { ok: true, release: () => { if (done) return; done = true; inFlight.delete(g); inFlight.delete(u); } };
}

// ---- the actions of /dash/guild/[id]/ai-assistant-api

type Dt = (key: string, vars?: Record<string, unknown>) => string;
export interface ActionContext {
  guildId: string;
  userId: string;
  lang: string;
  dt: Dt;
  body: any;
  chat: ChatFn | null;
  loadSaved: () => Promise<{ state: TableState; settings: TicketAiSettings }>;
  loadUsage: () => Promise<{ state: TableState; replies: number }>;
}
type ActionResult = { status: number; body: Record<string, unknown> };

/** Short, friendly words for each problem (never the upstream error itself). */
export function problemText(dt: Dt, code: string, extra: { minutes?: number } = {}): string {
  const words: Record<string, string> = {
    not_configured: dt('The AI is not configured on this Petto yet.'),
    timeout: dt('The AI took too long to answer. Try again.'),
    busy: dt('The AI is busy right now. Try again in a minute.'),
    model: dt('The AI model is not available right now. Try again later.'),
    upstream: dt('The AI could not answer right now. Try again in a moment.'),
    empty: dt('The AI gave an empty answer. Try again or say it in another way.'),
    in_flight: dt('Wait for the answer that is on its way.'),
    rate_limited: dt('Too many AI requests on this server. Try again in {a}.', { a: formatDuration((extra.minutes ?? 60) * 60) }),
    too_long: dt('That message is too long (at most {n} characters).', { n: LIMITS.message }),
    empty_message: dt('Write a message first.'),
    pending: dt('The database update for the AI assistant is pending.'),
    read: dt("Couldn't read the saved settings. Try again."),
    invalid: dt('That request is not valid.'),
  };
  return words[code] ?? words.upstream;
}

const fail = (ctx: ActionContext, status: number, code: string, extra: { minutes?: number } = {}): ActionResult => ({ status, body: { ok: false, code, message: problemText(ctx.dt, code, extra) } });

async function askModel(ctx: ActionContext, messages: ChatMessage[], maxTokens: number): Promise<ChatResult | ActionResult> {
  if (!ctx.chat) return fail(ctx, 503, 'not_configured');
  const slot = takeSlot(ctx.guildId, ctx.userId);
  if (!slot.ok) return fail(ctx, 429, slot.code, { minutes: slot.retryMinutes });
  try {
    return await ctx.chat(messages, maxTokens);
  } finally {
    slot.release();
  }
}

export async function handleTicketAiAction(ctx: ActionContext): Promise<ActionResult> {
  const action = String(ctx.body?.action ?? '');
  if (action === 'usage') {
    const usage = await ctx.loadUsage();
    return { status: 200, body: { ok: true, replies: usage.replies, pending: usage.state === 'pending' } };
  }
  if (action !== 'test' && action !== 'helper') return fail(ctx, 400, 'invalid');

  const message = checkMessage(ctx.body?.message);
  if (!message.ok) return fail(ctx, 400, message.code === 'too_long' ? 'too_long' : 'empty_message');

  if (action === 'test') {
    let settings: any = ctx.body?.draft ?? {};
    if (ctx.body?.source === 'saved') {
      const saved = await ctx.loadSaved();
      if (saved.state !== 'ok') return fail(ctx, 409, saved.state === 'pending' ? 'pending' : 'read');
      const s = saved.settings;
      settings = { instructions: s.instructions, knowledge: s.knowledge, handoff: s.handoff, reply_style: s.replyStyle, tone: s.tone, language_mode: s.languageMode, max_replies: s.maxReplies };
    }
    const turn = buildTicketTurn({ settings, history: ctx.body?.history, message: message.text });
    if (turn.kind === 'handoff') {
      return { status: 200, body: { ok: true, reply: '', handoff: { reason: turn.reason, keyword: turn.keyword ?? null }, aiReplies: turn.aiReplies, maxReplies: turn.maxReplies } };
    }
    const answer = await askModel(ctx, turn.messages, CFG.maxTokensTest);
    if ('status' in answer) return answer;
    if (!answer.ok) return fail(ctx, 502, answer.code);
    const result = detectHandoff(answer.content);
    if (!result.text && !result.handoff) return fail(ctx, 502, 'empty');
    const aiReplies = turn.aiReplies + 1;
    return { status: 200, body: { ok: true, reply: defuseMentions(result.text), handoff: result.handoff ? { reason: 'model', keyword: null } : null, aiReplies, maxReplies: turn.maxReplies } };
  }

  const messages = buildHelperTurn({ current: ctx.body?.current ?? {}, history: ctx.body?.history, message: message.text, lang: ctx.lang });
  const answer = await askModel(ctx, messages, CFG.maxTokensHelper);
  if ('status' in answer) return answer;
  if (!answer.ok) return fail(ctx, 502, answer.code);
  const parsed = parseHelperReply(answer.content);
  if (!parsed.text && !parsed.draft) return fail(ctx, 502, parsed.error ? 'upstream' : 'empty');
  return {
    status: 200,
    body: {
      ok: true,
      reply: defuseMentions(parsed.text || ctx.dt('Here is a draft. Check it, apply it to the fields and press Save.')),
      draft: parsed.draft,
      draftError: parsed.error ? ctx.dt('The AI wrote a draft in a wrong shape, so it was left out. Ask it to write the draft again.') : null,
    },
  };
}
