/** The AutoMod templates, what the dashboard needs to show and check them. The expressions live in the bot (src/utils/automodTemplates.js). */
export interface TemplateOption { key: string; type: 'boolean' | 'number'; min?: number; max?: number; default: boolean | number; }
export interface TemplateMeta { id: string; group: 'links' | 'text' | 'safety'; icon: string; options: TemplateOption[]; }

export const TEMPLATES: TemplateMeta[] = [
  { id: 'links', group: 'links', icon: 'ph:link-fill', options: [{ key: 'nonClickable', type: 'boolean', default: false }] },
  { id: 'invites', group: 'links', icon: 'ph:paper-plane-tilt-fill', options: [{ key: 'thirdParty', type: 'boolean', default: false }] },
  { id: 'inline_links', group: 'links', icon: 'ph:link-simple', options: [{ key: 'disguisedOnly', type: 'boolean', default: false }] },
  { id: 'emails', group: 'links', icon: 'ph:paper-plane-tilt-fill', options: [] },
  { id: 'scam', group: 'safety', icon: 'ph:warning-fill', options: [] },
  { id: 'fake_pings', group: 'safety', icon: 'ph:siren-fill', options: [] },
  { id: 'ip_addresses', group: 'safety', icon: 'ph:shield-warning-fill', options: [] },
  { id: 'phone_numbers', group: 'safety', icon: 'ph:shield-warning-fill', options: [] },
  { id: 'emojis', group: 'text', icon: 'ph:mask-happy-fill', options: [{ key: 'max', type: 'number', min: 0, max: 12, default: 6 }] },
  { id: 'zalgo', group: 'text', icon: 'ph:text-t', options: [{ key: 'filterAccents', type: 'boolean', default: false }] },
  { id: 'headings', group: 'text', icon: 'ph:list-bullets-fill', options: [{ key: 'level', type: 'number', min: 1, max: 3, default: 3 }] },
  { id: 'subtext', group: 'text', icon: 'ph:text-t', options: [] },
  { id: 'caps', group: 'text', icon: 'ph:text-t', options: [{ key: 'words', type: 'number', min: 3, max: 20, default: 6 }] },
  { id: 'repeated_characters', group: 'text', icon: 'ph:text-t', options: [{ key: 'times', type: 'number', min: 6, max: 30, default: 10 }] },
  { id: 'spoilers', group: 'text', icon: 'ph:eye-slash-fill', options: [{ key: 'max', type: 'number', min: 1, max: 10, default: 3 }] },
  { id: 'invisible_text', group: 'text', icon: 'ph:eye-slash-fill', options: [] },
];

export const PACKS = ['basic', 'clean_chat', 'anti_scam', 'strict'] as const;
export const PETTO_ACTIONS = ['delete', 'warn', 'mute', 'kick'] as const;

/** The options a template knows, clamped, from whatever came in. */
export function cleanOptions(id: string, raw: any): Record<string, boolean | number> | null {
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) return null;
  const out: Record<string, boolean | number> = {};
  for (const opt of template.options) {
    const value = raw?.[opt.key];
    if (opt.type === 'boolean') out[opt.key] = value === undefined ? (opt.default as boolean) : value === true || value === 'true' || value === 'on';
    else {
      const n = Math.floor(Number(value ?? opt.default));
      out[opt.key] = Number.isFinite(n) ? Math.max(opt.min!, Math.min(opt.max!, n)) : (opt.default as number);
    }
  }
  return out;
}
