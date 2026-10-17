// Forms (applications): the same rules as the bot (petto-bot src/utils/forms.js), so what the dashboard saves is what the bot asks.
// The forms are saved straight in the database; reviewing a submission and posting a panel go through the bot.

export const QUESTION_TYPES = ['short', 'paragraph', 'number', 'yesno', 'choice', 'multi'] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];
export const CHOICE_TYPES: readonly string[] = ['choice', 'multi'];
export const STATUSES = ['pending', 'accepted', 'denied', 'cancelled'] as const;
export const BUTTON_STYLES = ['primary', 'secondary', 'success', 'danger'] as const;
// Discord's limits: 45 characters for a form title and a field label, 100 for a description and a placeholder, 25 options of 100
// characters, 4000 characters in a text field, and five fields in a form.
export const LIMITS = {
  title: 45, label: 45, help: 100, placeholder: 100, option: 100, options: 25, description: 1000,
  short: 1000, paragraph: 4000, pageSize: 5, questions: 25, reason: 1000, message: 2000, buttonLabel: 80, roles: 25,
};
// One limit for every server, the same numbers as the bot (petto-bot src/utils/forms.js FORM_LIMITS). Forms are not a Premium module.
export const FORM_PLAN = { forms: 25, questions: 25, submissions: 2000 };
const DEFAULT_MAX: Record<string, number> = { short: 200, paragraph: 1000 };
const SNOWFLAKE = /^\d{15,25}$/;
export const NAME = /^[a-z0-9][a-z0-9_-]{0,31}$/;
// The id in the web address of a form (petto.sbs/f/<public id>): 12 random letters and digits, the same as the bot's
// (petto-bot src/utils/forms.js). Numbers never open a form on the web, so the forms cannot be walked through one by one.
export const PUBLIC_ID = /^[0-9A-Za-z]{12}$/;
const PUBLIC_ID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/** A new random id for the web address of a form, like `x7Kp9QzA2mVt` (unbiased: bytes of 248 or more are drawn again). */
export function newPublicId(): string {
  let id = '';
  while (id.length < 12) {
    for (const byte of crypto.getRandomValues(new Uint8Array(16))) {
      if (byte < 248 && id.length < 12) id += PUBLIC_ID_ALPHABET[byte % 62];
    }
  }
  return id;
}

/** The path of a form on the website, or null when it has no public id yet. */
export const formWebPath = (form: { public_id?: string | null }) => (PUBLIC_ID.test(String(form?.public_id ?? '')) ? `/f/${form.public_id}` : null);

export interface Question {
  id: string; type: QuestionType; label: string; help: string | null; placeholder: string | null; required: boolean;
  min_length?: number; max_length?: number; min_value?: number | null; max_value?: number | null; options?: string[]; max_choices?: number;
}
export interface MessageSetting { text?: string; template?: string }
export interface FormRow {
  id?: number | string; public_id?: string; name: string; title: string; description: string | null; color: number | null; status: 'open' | 'closed'; questions: Question[];
  review_channel_id: string | null; reviewer_role_ids: string[]; ping_role_ids: string[]; auto_thread: boolean;
  required_role_ids: string[]; blocked_role_ids: string[]; min_account_days: number; min_member_days: number; one_pending: boolean;
  deny_cooldown_hours: number; max_per_user: number; max_total: number; closes_at: string | null;
  accept_add_role_ids: string[]; accept_remove_role_ids: string[]; deny_add_role_ids: string[]; deny_remove_role_ids: string[];
  dm_results: boolean; messages: { submitted?: MessageSetting; accepted?: MessageSetting; denied?: MessageSetting };
  button_label: string | null; button_emoji: string | null; button_style: (typeof BUTTON_STYLES)[number];
  web_enabled: boolean;
}

const clip = (value: unknown, max: number) => String(value ?? '').replace(/\u0000/g, '').trim().slice(0, max);
const whole = (value: unknown, min: number, max: number, fallback: number) => {
  if (value === null || value === undefined || value === '') return fallback;
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const finite = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};
const ids = (list: unknown, max = LIMITS.roles) => [...new Set((Array.isArray(list) ? list : []).map(String).filter((id) => SNOWFLAKE.test(id)))].slice(0, max);

/** A name for commands: `Staff Apps!` -> `staff-apps`. */
export function slugName(value: unknown): string {
  return String(value ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9_-]+/g, '-').replace(/^[-_]+|-+$/g, '').slice(0, 32);
}

export function normalizeQuestion(input: any, index = 0, seen = new Set<string>()): Question | null {
  const type = (QUESTION_TYPES as readonly string[]).includes(input?.type) ? (input.type as QuestionType) : 'short';
  const label = clip(input?.label, LIMITS.label);
  if (!label) return null;
  let id = /^[a-z0-9_-]{1,20}$/i.test(String(input?.id ?? '')) ? String(input.id) : `q${index + 1}`;
  while (seen.has(id)) id = `${id.slice(0, 18)}${seen.size}`;
  seen.add(id);
  const question: Question = { id, type, label, help: clip(input?.help, LIMITS.help) || null, placeholder: clip(input?.placeholder, LIMITS.placeholder) || null, required: input?.required !== false };
  if (type === 'short' || type === 'paragraph') {
    const cap = LIMITS[type];
    const max = whole(input?.max_length, 1, cap, DEFAULT_MAX[type]);
    question.max_length = max;
    question.min_length = Math.min(whole(input?.min_length, 0, cap, 0), max);
  }
  if (type === 'number') {
    let min = finite(input?.min_value);
    let max = finite(input?.max_value);
    if (min !== null && max !== null && min > max) [min, max] = [max, min];
    question.min_value = min;
    question.max_value = max;
  }
  if (CHOICE_TYPES.includes(type)) {
    const raw = Array.isArray(input?.options) ? input.options : String(input?.options ?? '').split(/\r?\n|\|/);
    const options = [...new Set(raw.map((o: unknown) => clip(o, LIMITS.option)).filter(Boolean))].slice(0, LIMITS.options) as string[];
    if (options.length < 2) return null;
    question.options = options;
    if (type === 'multi') question.max_choices = whole(input?.max_choices, 1, options.length, options.length);
  }
  return question;
}

export function normalizeQuestions(list: unknown, max = LIMITS.questions): Question[] {
  const seen = new Set<string>();
  return (Array.isArray(list) ? list : []).map((q, i) => normalizeQuestion(q, i, seen)).filter((q): q is Question => Boolean(q)).slice(0, max);
}

const cleanMessage = (input: any): MessageSetting => {
  const out: MessageSetting = {};
  const text = clip(input?.text, LIMITS.message);
  const template = clip(input?.template, 100);
  if (text) out.text = text;
  if (template) out.template = template;
  return out;
};

export function normalizeForm(input: any, { maxQuestions = LIMITS.questions } = {}): FormRow {
  const color = finite(input?.color);
  const closes = input?.closes_at ? new Date(input.closes_at) : null;
  return {
    name: slugName(input?.name) || 'form',
    title: clip(input?.title, LIMITS.title) || clip(input?.name, LIMITS.title) || 'Form',
    description: clip(input?.description, LIMITS.description) || null,
    color: color !== null && color >= 0 && color <= 0xffffff ? Math.trunc(color) : null,
    status: input?.status === 'open' ? 'open' : 'closed',
    questions: normalizeQuestions(input?.questions, maxQuestions),
    review_channel_id: SNOWFLAKE.test(String(input?.review_channel_id ?? '')) ? String(input.review_channel_id) : null,
    reviewer_role_ids: ids(input?.reviewer_role_ids),
    ping_role_ids: ids(input?.ping_role_ids, 5),
    auto_thread: input?.auto_thread === true,
    required_role_ids: ids(input?.required_role_ids),
    blocked_role_ids: ids(input?.blocked_role_ids),
    min_account_days: whole(input?.min_account_days, 0, 3650, 0),
    min_member_days: whole(input?.min_member_days, 0, 3650, 0),
    one_pending: input?.one_pending !== false,
    deny_cooldown_hours: whole(input?.deny_cooldown_hours, 0, 8760, 0),
    max_per_user: whole(input?.max_per_user, 0, 1000, 0),
    max_total: whole(input?.max_total, 0, 100000, 0),
    closes_at: closes && !Number.isNaN(closes.getTime()) ? closes.toISOString() : null,
    accept_add_role_ids: ids(input?.accept_add_role_ids),
    accept_remove_role_ids: ids(input?.accept_remove_role_ids),
    deny_add_role_ids: ids(input?.deny_add_role_ids),
    deny_remove_role_ids: ids(input?.deny_remove_role_ids),
    dm_results: input?.dm_results !== false,
    messages: { submitted: cleanMessage(input?.messages?.submitted), accepted: cleanMessage(input?.messages?.accepted), denied: cleanMessage(input?.messages?.denied) },
    button_label: clip(input?.button_label, LIMITS.buttonLabel) || null,
    button_emoji: clip(input?.button_emoji, 64) || null,
    button_style: (BUTTON_STYLES as readonly string[]).includes(input?.button_style) ? input.button_style : 'primary',
    web_enabled: input?.web_enabled !== false,
  };
}

/** An answer as people read it: lists one per line, yes/no in words. */
export function answerText(answer: { type?: string; value?: unknown }, yes: string, no: string): string {
  const value = answer?.value;
  if (Array.isArray(value)) return value.map((v) => `• ${v}`).join('\n');
  if (answer?.type === 'yesno') return value === 'yes' ? yes : value === 'no' ? no : '';
  return String(value ?? '');
}

export const hexColor = (n: number | null | undefined) => (typeof n === 'number' ? `#${n.toString(16).padStart(6, '0')}` : '');
