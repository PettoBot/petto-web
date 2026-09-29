export type ApplicationRole = 'developer' | 'manager' | 'partner' | 'staff';

export type FieldKind = 'text' | 'textarea' | 'select' | 'url' | 'number';

export interface ApplicationField {
  key: string;
  kind: FieldKind;
  required: boolean;
  max: number;
  options?: string[];
}

const hours = ['h1', 'h2', 'h3', 'h4'];

const common: ApplicationField[] = [
  { key: 'discord', kind: 'text', required: true, max: 64 },
  { key: 'timezone', kind: 'text', required: false, max: 40 },
  { key: 'languages', kind: 'text', required: true, max: 100 },
];

export const applicationRoles: Record<ApplicationRole, { color: number; fields: ApplicationField[] }> = {
  developer: {
    color: 0x5eead4,
    fields: [
      ...common,
      { key: 'stack', kind: 'text', required: true, max: 200 },
      { key: 'links', kind: 'text', required: false, max: 300 },
      { key: 'experience', kind: 'textarea', required: true, max: 1000 },
      { key: 'interest', kind: 'textarea', required: true, max: 800 },
      { key: 'hours', kind: 'select', required: true, max: 8, options: hours },
    ],
  },
  manager: {
    color: 0xffb86c,
    fields: [
      ...common,
      { key: 'communities', kind: 'textarea', required: true, max: 800 },
      { key: 'experience', kind: 'textarea', required: true, max: 1000 },
      { key: 'ideas', kind: 'textarea', required: true, max: 800 },
      { key: 'hours', kind: 'select', required: true, max: 8, options: hours },
    ],
  },
  partner: {
    color: 0x8399ff,
    fields: [
      { key: 'discord', kind: 'text', required: true, max: 64 },
      { key: 'project', kind: 'text', required: true, max: 100 },
      { key: 'kind', kind: 'select', required: true, max: 8, options: ['server', 'bot', 'website', 'other'] },
      { key: 'link', kind: 'url', required: true, max: 300 },
      { key: 'members', kind: 'number', required: false, max: 9 },
      { key: 'proposal', kind: 'textarea', required: true, max: 1000 },
      { key: 'offer', kind: 'textarea', required: false, max: 800 },
    ],
  },
  staff: {
    color: 0xf78fb3,
    fields: [
      ...common,
      { key: 'position', kind: 'select', required: true, max: 12, options: ['moderator', 'support', 'either'] },
      { key: 'experience', kind: 'textarea', required: true, max: 1000 },
      { key: 'why', kind: 'textarea', required: true, max: 800 },
      { key: 'scenario', kind: 'textarea', required: true, max: 800 },
      { key: 'hours', kind: 'select', required: true, max: 8, options: hours },
    ],
  },
};

export const applicationRoleList = Object.keys(applicationRoles) as ApplicationRole[];

export function isApplicationRole(value: unknown): value is ApplicationRole {
  return typeof value === 'string' && value in applicationRoles;
}

export type ApplicationError = 'missing' | 'invalid';

function clean(value: FormDataEntryValue | null, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').replace(/\r\n/g, '\n').trim().slice(0, max);
}

/** Reads and validates the submitted answers for a role. Returns the cleaned answers or the first problem found. */
export function readAnswers(role: ApplicationRole, form: FormData): { answers: Record<string, string> } | { error: ApplicationError } {
  const answers: Record<string, string> = {};
  for (const field of applicationRoles[role].fields) {
    const raw = clean(form.get(field.key), field.max);
    if (!raw) {
      if (field.required) return { error: 'missing' };
      continue;
    }
    if (field.kind === 'select' && !field.options?.includes(raw)) return { error: 'invalid' };
    if (field.kind === 'number' && !/^\d{1,9}$/.test(raw)) return { error: 'invalid' };
    if (field.kind === 'url') {
      try {
        const url = new URL(raw);
        if (url.protocol !== 'https:' && url.protocol !== 'http:') return { error: 'invalid' };
      } catch {
        return { error: 'invalid' };
      }
    }
    answers[field.key] = raw;
  }
  return { answers };
}

const attempts = new Map<string, number[]>();
const WINDOW_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 3;

/** Best-effort per-visitor limit. Worker isolates do not share memory, so this only slows down casual spam. */
export function tooManyAttempts(visitor: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(visitor) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) {
    attempts.set(visitor, recent);
    return true;
  }
  recent.push(now);
  attempts.set(visitor, recent);
  if (attempts.size > 5000) for (const [key, times] of attempts) if (times.every((t) => now - t >= WINDOW_MS)) attempts.delete(key);
  return false;
}

export async function sendApplication(
  webhookUrl: string,
  role: ApplicationRole,
  answers: Record<string, string>,
  applicant: { verifiedId: string | null; username: string | null; labels: Record<string, string>; title: string; verifiedLabel: string; unverifiedLabel: string },
): Promise<boolean> {
  const fields = applicationRoles[role].fields
    .filter((f) => answers[f.key])
    .map((f) => ({ name: (applicant.labels[f.key] ?? f.key).slice(0, 256), value: answers[f.key].slice(0, 1024), inline: f.kind !== 'textarea' }));

  const identity = applicant.verifiedId
    ? `${applicant.verifiedLabel}: <@${applicant.verifiedId}> (${applicant.verifiedId})${applicant.username ? `, ${applicant.username}` : ''}`
    : applicant.unverifiedLabel;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Petto Applications',
        allowed_mentions: { parse: [] },
        embeds: [{
          title: applicant.title.slice(0, 256),
          description: identity.slice(0, 2000),
          color: applicationRoles[role].color,
          fields,
          timestamp: new Date().toISOString(),
        }],
      }),
    });
    if (!response.ok) console.error('[apply] webhook answered', response.status);
    return response.ok;
  } catch (error) {
    console.error('[apply] webhook request failed', error);
    return false;
  }
}
