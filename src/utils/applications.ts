export type ApplicationRole = 'developer' | 'manager' | 'partner' | 'staff';

export type FieldKind = 'text' | 'textarea' | 'select' | 'url' | 'number' | 'checkbox';

export interface ApplicationField {
  key: string;
  kind: FieldKind;
  required: boolean;
  max: number;
  section: string;
  options?: string[];
}

const f = (section: string, key: string, kind: FieldKind, required: boolean, max: number, options?: string[]): ApplicationField => ({ section, key, kind, required, max, options });

const hours = ['h1', 'h2', 'h3', 'h4'];
const years = ['y0', 'y1', 'y2', 'y3'];
const level = ['l0', 'l1', 'l2', 'l3'];
const teamSize = ['t0', 't1', 't2', 't3'];

export const applicationRoles: Record<ApplicationRole, { color: number; fields: ApplicationField[] }> = {
  developer: {
    color: 0x5eead4,
    fields: [
      f('about', 'discord', 'text', true, 64),
      f('about', 'timezone', 'text', true, 40),
      f('about', 'languages', 'text', true, 100),
      f('about', 'hours', 'select', true, 8, hours),
      f('about', 'schedule', 'text', false, 200),
      f('skills', 'focus', 'select', true, 12, ['backend', 'frontend', 'fullstack', 'bots', 'data', 'devops']),
      f('skills', 'years', 'select', true, 8, years),
      f('skills', 'stack', 'text', true, 200),
      f('skills', 'djs', 'select', true, 8, level),
      f('skills', 'sql', 'select', true, 8, level),
      f('work', 'experience', 'textarea', true, 1000),
      f('work', 'projects', 'textarea', true, 1000),
      f('work', 'links', 'text', false, 300),
      f('work', 'opensource', 'textarea', false, 800),
      f('work', 'teamwork', 'textarea', true, 800),
      f('technical', 'qDesign', 'textarea', true, 1000),
      f('technical', 'qSecurity', 'textarea', true, 1000),
      f('technical', 'qDebug', 'textarea', true, 1000),
      f('technical', 'qReview', 'textarea', true, 800),
      f('motivation', 'interest', 'textarea', true, 800),
      f('motivation', 'first30', 'textarea', true, 800),
      f('confirm', 'confirm', 'checkbox', true, 3),
    ],
  },
  manager: {
    color: 0xffb86c,
    fields: [
      f('about', 'discord', 'text', true, 64),
      f('about', 'timezone', 'text', true, 40),
      f('about', 'languages', 'text', true, 100),
      f('about', 'hours', 'select', true, 8, hours),
      f('about', 'schedule', 'text', false, 200),
      f('experience', 'years', 'select', true, 8, years),
      f('experience', 'teamsize', 'select', true, 8, teamSize),
      f('experience', 'communities', 'textarea', true, 800),
      f('experience', 'experience', 'textarea', true, 1000),
      f('experience', 'tools', 'text', true, 200),
      f('experience', 'events', 'textarea', true, 800),
      f('scenarios', 'qConflict', 'textarea', true, 1000),
      f('scenarios', 'qCrisis', 'textarea', true, 1000),
      f('scenarios', 'qInactive', 'textarea', true, 1000),
      f('scenarios', 'qPolicy', 'textarea', true, 1000),
      f('vision', 'metrics', 'textarea', true, 800),
      f('vision', 'ideas', 'textarea', true, 800),
      f('vision', 'first30', 'textarea', true, 800),
      f('vision', 'qDelegate', 'textarea', true, 800),
      f('confirm', 'confirm', 'checkbox', true, 3),
    ],
  },
  partner: {
    color: 0x8399ff,
    fields: [
      f('project', 'discord', 'text', true, 64),
      f('project', 'project', 'text', true, 100),
      f('project', 'kind', 'select', true, 8, ['server', 'bot', 'website', 'other']),
      f('project', 'link', 'url', true, 300),
      f('project', 'members', 'number', false, 9),
      f('project', 'proposal', 'textarea', true, 1000),
      f('project', 'offer', 'textarea', false, 800),
      f('confirm', 'confirm', 'checkbox', true, 3),
    ],
  },
  staff: {
    color: 0xf78fb3,
    fields: [
      f('about', 'discord', 'text', true, 64),
      f('about', 'timezone', 'text', false, 40),
      f('about', 'position', 'select', true, 12, ['moderator', 'support', 'either']),
      f('about', 'hours', 'select', true, 8, hours),
      f('about', 'experience', 'textarea', true, 800),
      f('about', 'why', 'textarea', true, 600),
      f('confirm', 'confirm', 'checkbox', true, 3),
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
    if (field.kind === 'checkbox') {
      if (form.get(field.key) === null) {
        if (field.required) return { error: 'missing' };
        continue;
      }
      answers[field.key] = 'yes';
      continue;
    }
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

const EMBED_BUDGET = 5000;

/** Splits the answers into embeds that stay under Discord's per-message size limits. */
function chunkFields(fields: { name: string; value: string; inline: boolean }[]) {
  const chunks: { name: string; value: string; inline: boolean }[][] = [];
  let current: typeof fields = [];
  let size = 0;
  for (const field of fields) {
    const cost = field.name.length + field.value.length;
    if (current.length > 0 && (size + cost > EMBED_BUDGET || current.length >= 25)) {
      chunks.push(current);
      current = [];
      size = 0;
    }
    current.push(field);
    size += cost;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

export async function sendApplication(
  webhookUrl: string,
  role: ApplicationRole,
  answers: Record<string, string>,
  applicant: { verifiedId: string | null; username: string | null; labels: Record<string, string>; title: string; verifiedLabel: string; unverifiedLabel: string },
): Promise<boolean> {
  const fields = applicationRoles[role].fields
    .filter((f) => answers[f.key] && f.kind !== 'checkbox')
    .map((f) => ({ name: (applicant.labels[f.key] ?? f.key).slice(0, 256), value: answers[f.key].slice(0, 1024), inline: f.kind !== 'textarea' }));

  const identity = applicant.verifiedId
    ? `${applicant.verifiedLabel}: <@${applicant.verifiedId}> (${applicant.verifiedId})${applicant.username ? `, ${applicant.username}` : ''}`
    : applicant.unverifiedLabel;

  const chunks = chunkFields(fields);
  for (let index = 0; index < chunks.length; index += 1) {
    const suffix = chunks.length > 1 ? ` (${index + 1}/${chunks.length})` : '';
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'Petto Applications',
          allowed_mentions: { parse: [] },
          embeds: [{
            title: `${applicant.title}${suffix}`.slice(0, 256),
            description: index === 0 ? identity.slice(0, 2000) : undefined,
            color: applicationRoles[role].color,
            fields: chunks[index],
            timestamp: new Date().toISOString(),
          }],
        }),
      });
      if (!response.ok) {
        console.error('[apply] webhook answered', response.status);
        return false;
      }
    } catch (error) {
      console.error('[apply] webhook request failed', error);
      return false;
    }
  }
  return chunks.length > 0;
}
