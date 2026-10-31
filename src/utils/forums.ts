// Forum support on the dashboard: what a setup may hold and how a saved form is cleaned. The same rules as the bot (petto-bot
// src/utils/forumConfig.js and the checks of the `forum_setups` columns): the website saves the row straight in the database, so every value
// is put in its range here before it is sent, and the database refuses what is still out of range.
export const MAX_SETUPS = 5;
export const NAME = /^[a-z0-9][a-z0-9_-]{0,31}$/;
export const SNOWFLAKE = /^\d{15,25}$/;
export const BUTTON_STYLES = ['primary', 'secondary', 'success', 'danger'] as const;
export const LOG_EVENTS = ['opened', 'locked', 'closed', 'solved'] as const;
export const STATUSES = ['open', 'solved', 'locked', 'closed'] as const;
export const LIMITS = { label: 45, panelTitle: 200, panelText: 2000, panelFooter: 300, button: 80, firstMessage: 1500, guidelines: 1500, roles: 25, users: 50, tags: 20, extra: 3 };
export const QUESTION_KINDS = ['short_text', 'long_text', 'select'] as const;

const clip = (value: unknown, max: number) => String(value ?? '').replace(/\u0000/g, '').replace(/\r\n?/g, '\n').trim().slice(0, max);
const textOrNull = (value: unknown, max: number) => clip(value, max) || null;
const whole = (value: unknown, min: number, max: number, fallback: number) => {
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const oneOf = <T extends string>(value: unknown, list: readonly T[], fallback: T): T => (list.includes(String(value) as T) ? (String(value) as T) : fallback);
const ids = (value: unknown, max: number) => [...new Set((Array.isArray(value) ? value : []).map(String).filter((id) => SNOWFLAKE.test(id)))].slice(0, max);
const snowflakeOrNull = (value: unknown) => (SNOWFLAKE.test(String(value ?? '')) ? String(value) : null);

export function slugName(value: unknown): string {
  const slug = String(value ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9_-]+/g, '-').replace(/^[-_]+|[-_]+$/g, '').slice(0, 32);
  return NAME.test(slug) ? slug : '';
}

export function hexToInt(value: unknown): number | null {
  const text = String(value ?? '').trim();
  return /^#?[0-9a-f]{6}$/i.test(text) ? parseInt(text.replace('#', ''), 16) : null;
}
export const intToHex = (value: unknown): string => (Number.isInteger(value) ? `#${Number(value).toString(16).padStart(6, '0')}` : '');

export interface Question { type: (typeof QUESTION_KINDS)[number]; label: string; required: boolean; options?: string[] }

/** The extra questions of the form: up to three (two when pictures are asked for), each short, long or a menu of choices. */
export function cleanQuestions(list: unknown, askImages: boolean): Question[] {
  const out: Question[] = [];
  for (const raw of Array.isArray(list) ? list : []) {
    const type = oneOf(raw?.type, QUESTION_KINDS, 'short_text');
    const label = clip(raw?.label, LIMITS.label);
    if (!label) continue;
    const question: Question = { type, label, required: raw?.required !== false };
    if (type === 'select') {
      const options = [...new Set(String(Array.isArray(raw?.options) ? raw.options.join('\n') : raw?.options ?? '').split('\n').map((o) => clip(o, 100)).filter(Boolean))].slice(0, 25);
      if (!options.length) continue;
      question.options = options;
    }
    out.push(question);
    if (out.length >= (askImages ? LIMITS.extra - 1 : LIMITS.extra)) break;
  }
  return out;
}

/** What the form of the page sends, as the columns of `forum_setups`. `get` and `getAll` read the form data. */
export function setupFromForm(form: { get(name: string): FormDataEntryValue | null; getAll(name: string): FormDataEntryValue[] }, forumName = ''): Record<string, unknown> {
  const text = (name: string, max: number) => textOrNull(form.get(name), max);
  const checked = (name: string) => form.get(name) === 'on';
  const askImages = checked('ask_images');
  const questions: unknown[] = [];
  for (let n = 1; n <= LIMITS.extra; n += 1) questions.push({ type: form.get(`q_type_${n}`), label: form.get(`q_label_${n}`), required: checked(`q_required_${n}`), options: form.get(`q_options_${n}`) });
  return {
    name: slugName(form.get('name')) || slugName(forumName) || 'forum',
    forum_channel_id: snowflakeOrNull(form.get('forum_channel_id')) ?? '',
    enabled: checked('enabled'),
    panel_channel_id: snowflakeOrNull(form.get('panel_channel_id')),
    panel_template: text('panel_template', 100),
    panel_title: text('panel_title', LIMITS.panelTitle),
    panel_description: text('panel_description', LIMITS.panelText),
    panel_color: hexToInt(form.get('panel_color')),
    panel_image: /^https:\/\/\S+$/i.test(clip(form.get('panel_image'), 500)) ? clip(form.get('panel_image'), 500) : null,
    panel_footer: text('panel_footer', LIMITS.panelFooter),
    button_label: text('button_label', LIMITS.button),
    button_emoji: text('button_emoji', 100),
    button_style: oneOf(form.get('button_style'), BUTTON_STYLES, 'success'),
    modal_title: text('modal_title', LIMITS.label),
    title_label: text('title_label', LIMITS.label),
    description_label: text('description_label', LIMITS.label),
    ask_images: askImages,
    extra_fields: cleanQuestions(questions, askImages),
    require_tag: checked('require_tag'),
    tag_ids: ids(form.getAll('tag_ids'), LIMITS.tags),
    max_tags: whole(form.get('max_tags'), 1, 5, 1),
    solved_tag_id: snowflakeOrNull(form.get('solved_tag_id')),
    first_message: text('first_message', LIMITS.firstMessage),
    first_message_style: oneOf(form.get('first_message_style'), ['plain', 'card'] as const, 'plain'),
    guidelines: text('guidelines', LIMITS.guidelines),
    ping_role_ids: ids(form.getAll('ping_role_ids'), LIMITS.roles),
    slowmode_seconds: whole(form.get('slowmode_seconds'), 0, 21600, 0),
    staff_role_ids: ids(form.getAll('staff_role_ids'), LIMITS.roles),
    required_role_ids: ids(form.getAll('required_role_ids'), LIMITS.roles),
    blocked_role_ids: ids(form.getAll('blocked_role_ids'), LIMITS.roles),
    blocked_user_ids: ids(String(form.get('blocked_user_ids') ?? '').split(/[\s,]+/), LIMITS.users),
    max_open_per_user: whole(form.get('max_open_per_user'), 0, 50, 3),
    cooldown_seconds: whole(form.get('cooldown_seconds'), 0, 86400, 30),
    author_can_close: checked('author_can_close'),
    author_can_solve: checked('author_can_solve'),
    author_can_rename: checked('author_can_rename'),
    inactive_days: whole(form.get('inactive_days'), 0, 365, 0),
    inactive_action: oneOf(form.get('inactive_action'), ['lock', 'close'] as const, 'close'),
    solved_action: oneOf(form.get('solved_action'), ['none', 'lock', 'close'] as const, 'none'),
    solved_delay_hours: whole(form.get('solved_delay_hours'), 0, 720, 24),
    adopt: checked('adopt'),
    tag_wait_minutes: whole(form.get('tag_wait_minutes'), 1, 1440, 10),
    log_events: form.getAll('log_events').map(String).filter((name) => (LOG_EVENTS as readonly string[]).includes(name)),
  };
}

/** The defaults of a setup that is not saved yet (the same as the columns). */
export const NEW_SETUP: Record<string, any> = {
  name: '', forum_channel_id: '', enabled: true, panel_channel_id: '', panel_template: null, panel_title: null, panel_description: null, panel_color: null, panel_image: null, panel_footer: null,
  button_label: null, button_emoji: null, button_style: 'success', modal_title: null, title_label: null, description_label: null, ask_images: false, extra_fields: [], require_tag: false, tag_ids: [], max_tags: 1,
  solved_tag_id: null, first_message: null, first_message_style: 'plain', guidelines: null, ping_role_ids: [], slowmode_seconds: 0, staff_role_ids: [], required_role_ids: [], blocked_role_ids: [], blocked_user_ids: [],
  max_open_per_user: 3, cooldown_seconds: 30, author_can_close: true, author_can_solve: true, author_can_rename: true, inactive_days: 0, inactive_action: 'close', solved_action: 'none', solved_delay_hours: 24,
  adopt: false, tag_wait_minutes: 10, log_events: [...LOG_EVENTS],
};
