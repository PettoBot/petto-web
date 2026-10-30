// The questions of a ticket form, as the dashboard saves them in the `fields` column of ticket_forms and as Petto reads them (the bot has its own
// copy of these rules in src/utils/ticketFormFields.js: keep the two in step). A question keeps `id`, `type`, `label` and `required`; the rest depends on the type:
//   short_text, long_text   hint (stored as `placeholder`)
//   select                  options (1-25 texts), max (how many can be picked), placeholder
//   radio                   options (2-10 texts)
//   checkboxes              options (1-10 texts), max
//   check                   one box; `required: true` means it has to be ticked
//   file                    accept ("images" or "any"), max (1-5 files)
//   user, role, channel     max (1-25), placeholder
//   display                 content: a text that only informs
// A form with text questions only is stored exactly as it always was: { id, type, label, placeholder, required }.

export const TICKET_FIELD_TYPES = ['short_text', 'long_text', 'select', 'radio', 'checkboxes', 'check', 'file', 'user', 'role', 'channel', 'display'] as const;
export type TicketFieldType = (typeof TICKET_FIELD_TYPES)[number];

export interface TicketField {
  id: string;
  type: TicketFieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  max?: number;
  accept?: 'images' | 'any';
  content?: string;
}

export const TICKET_FORM_LIMITS = { questions: 5, label: 45, description: 100, placeholder: 100, menuPlaceholder: 150, option: 100, content: 1000, id: 40, files: 5, picks: 25 };
export const TICKET_OPTION_RANGE: Record<'select' | 'radio' | 'checkboxes', [number, number]> = { select: [1, 25], radio: [2, 10], checkboxes: [1, 10] };

export type TicketFieldsError = 'count' | 'input' | 'type' | 'label' | 'text' | 'options';

const isType = (value: unknown): value is TicketFieldType => (TICKET_FIELD_TYPES as readonly string[]).includes(String(value));
const clip = (value: unknown, max: number): string => String(value ?? '').replace(/\u0000/g, '').trim().slice(0, max);
const whole = (value: unknown, min: number, max: number, fallback: number): number => {
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

/** The choices of a question from a list or from lines of text: up to 100 characters each, none empty, none twice. */
export function ticketOptions(value: unknown): string[] {
  const rows = Array.isArray(value) ? value : String(value ?? '').split(/\r?\n/);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const row of rows) {
    const text = clip(row && typeof row === 'object' ? ((row as any).label ?? (row as any).value) : row, TICKET_FORM_LIMITS.option);
    if (!text || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
  }
  return out;
}

function cleanField(raw: any, index: number): TicketField | TicketFieldsError {
  if (!raw || typeof raw !== 'object' || !isType(raw.type)) return 'type';
  const type: TicketFieldType = raw.type;
  const id = String(raw.id ?? raw.label ?? `field_${index + 1}`).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '_').slice(0, TICKET_FORM_LIMITS.id) || `field_${index + 1}`;
  if (type === 'display') {
    const content = clip(raw.content ?? raw.label, TICKET_FORM_LIMITS.content);
    return content ? { id, type, label: clip(content.replace(/\s+/g, ' '), TICKET_FORM_LIMITS.label), content } : 'text';
  }
  const label = clip(raw.label, TICKET_FORM_LIMITS.label);
  if (!label) return 'label';
  const out: TicketField = { id, type, label };
  const description = clip(raw.description, TICKET_FORM_LIMITS.description);
  if (description) out.description = description;
  if (type === 'short_text' || type === 'long_text') {
    out.placeholder = clip(raw.placeholder, TICKET_FORM_LIMITS.placeholder) || undefined;
    out.required = raw.required !== false;
    return out;
  }
  if (type === 'check') {
    if (raw.required === true) out.required = true;
    return out;
  }
  out.required = raw.required !== false;
  const placeholder = clip(raw.placeholder, TICKET_FORM_LIMITS.menuPlaceholder);
  if (type === 'select' || type === 'radio' || type === 'checkboxes') {
    const [min, max] = TICKET_OPTION_RANGE[type];
    const options = ticketOptions(raw.options);
    if (options.length < min || options.length > max) return 'options';
    out.options = options;
    if (type === 'select') {
      out.max = whole(raw.max, 1, options.length, 1);
      if (placeholder) out.placeholder = placeholder;
    }
    if (type === 'checkboxes') out.max = whole(raw.max, 1, options.length, options.length);
    return out;
  }
  if (type === 'file') {
    out.accept = raw.accept === 'images' ? 'images' : 'any';
    out.max = whole(raw.max, 1, TICKET_FORM_LIMITS.files, 1);
    return out;
  }
  out.max = whole(raw.max, 1, TICKET_FORM_LIMITS.picks, 1);
  if (placeholder) out.placeholder = placeholder;
  return out;
}

/**
 * The questions as the dashboard sends them (a list), checked and cut down to what Discord takes: 1 to 5 parts, at least one that members
 * answer, the choices and limits of each type. Two questions never share an id. Returns `{ fields }`, or `{ error }` saying what is wrong.
 */
export function cleanTicketFields(input: unknown): { fields: TicketField[] } | { error: TicketFieldsError } {
  if (!Array.isArray(input) || input.length < 1 || input.length > TICKET_FORM_LIMITS.questions) return { error: 'count' };
  const used = new Set<string>();
  const fields: TicketField[] = [];
  for (const [index, raw] of input.entries()) {
    const clean = cleanField(raw, index);
    if (typeof clean === 'string') return { error: clean };
    let id = clean.id;
    for (let n = 2; used.has(id); n += 1) id = `${clean.id.slice(0, TICKET_FORM_LIMITS.id - 3)}_${n}`;
    used.add(id);
    fields.push({ ...clean, id });
  }
  if (!fields.some((field) => field.type !== 'display')) return { error: 'input' };
  return { fields };
}

/** The questions of a form already saved, to show in the editor: what cannot be used is left out, and it never throws. */
export function editorFields(input: unknown): TicketField[] {
  if (!Array.isArray(input)) return [];
  const out: TicketField[] = [];
  const used = new Set<string>();
  for (const [index, raw] of input.entries()) {
    if (out.length >= TICKET_FORM_LIMITS.questions) break;
    const clean = cleanField(raw, index);
    if (typeof clean === 'string') continue;
    let id = clean.id;
    for (let n = 2; used.has(id); n += 1) id = `${clean.id.slice(0, TICKET_FORM_LIMITS.id - 3)}_${n}`;
    used.add(id);
    out.push({ ...clean, id });
  }
  return out;
}
