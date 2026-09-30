export interface EmbedField { name: string; value: string; inline: boolean }
export interface EmbedAuthor { name: string; icon?: string; url?: string }
export interface EmbedFooter { text: string; icon?: string }
export interface EmbedData {
  title: string; description: string; color: number | null; url: string;
  thumbnail: string; image: string; timestamp: boolean;
  author: EmbedAuthor; footer: EmbedFooter; fields: EmbedField[];
}
export interface LinkButton { label: string; url: string; emoji: string; disabled: boolean }
export interface TemplateData { content: string; embeds: EmbedData[]; buttons: LinkButton[][] }

export function emptyEmbed(): EmbedData {
  return { title: '', description: '', color: 0x8399ff, url: '', thumbnail: '', image: '', timestamp: false, author: { name: '' }, footer: { text: '' }, fields: [] };
}
export function emptyButton(): LinkButton {
  return { label: '', url: '', emoji: '', disabled: false };
}
export function emptyTemplate(): TemplateData {
  return { content: '', embeds: [], buttons: [] };
}

/** Reads either the dashboard's own {content, embeds, buttons} shape or the older /embed
 * command's flat single-embed shape, so nothing saved before this builder existed breaks. */
export function normalizeTemplateData(raw: any): TemplateData {
  if (raw && Array.isArray(raw.embeds)) {
    return {
      content: raw.content ?? '',
      embeds: raw.embeds.map((e: any) => ({ ...emptyEmbed(), ...e, author: { ...emptyEmbed().author, ...(e.author ?? {}) }, footer: { ...emptyEmbed().footer, ...(e.footer ?? {}) }, fields: e.fields ?? [] })),
      buttons: raw.buttons ?? [],
    };
  }
  const looksLikeEmbed = raw && (raw.title || raw.description || raw.author?.name || raw.footer?.text || raw.fields?.length || raw.image || raw.thumbnail || raw.color != null);
  if (looksLikeEmbed) {
    return { content: '', embeds: [{ ...emptyEmbed(), ...raw, author: { ...emptyEmbed().author, ...(raw.author ?? {}) }, footer: { ...emptyEmbed().footer, ...(raw.footer ?? {}) }, fields: raw.fields ?? [] }], buttons: [] };
  }
  return emptyTemplate();
}

export const EMBED_LIMITS = {
  content: 2000, embeds: 10, title: 256, description: 4096, fields: 25, fieldName: 256, fieldValue: 1024,
  footer: 2048, authorName: 256, url: 512, buttonRows: 5, buttonsPerRow: 5, buttonLabel: 80, totalChars: 6000,
} as const;

const trim = (value: unknown, max: number) => String(value ?? '').slice(0, max);
// Image and link fields accept web addresses, or one of the avatar tokens the bot fills in.
const TOKEN_URLS = new Set(['{user.avatar}', '{user_avatar}', '{user.display_avatar}', '{guild.icon}', '{server_icon}']);
const cleanUrl = (value: unknown) => {
  const text = trim(value, EMBED_LIMITS.url).trim();
  return text === '' || TOKEN_URLS.has(text) || /^https?:\/\/\S+$/i.test(text) ? text : '';
};

export type TemplateCheck = { ok: true; data: TemplateData } | { ok: false; error: string };

/** Cleans a template to Discord's limits and drops anything that is not a real value.
 * Rejects it only when the whole message would be too large for Discord to accept. */
export function validateTemplate(raw: unknown): TemplateCheck {
  const source = normalizeTemplateData(raw);
  const data: TemplateData = {
    content: trim(source.content, EMBED_LIMITS.content),
    embeds: source.embeds.slice(0, EMBED_LIMITS.embeds).map((e) => ({
      title: trim(e.title, EMBED_LIMITS.title),
      description: trim(e.description, EMBED_LIMITS.description),
      color: typeof e.color === 'number' && e.color >= 0 && e.color <= 0xffffff ? Math.floor(e.color) : null,
      url: cleanUrl(e.url),
      thumbnail: cleanUrl(e.thumbnail),
      image: cleanUrl(e.image),
      timestamp: Boolean(e.timestamp),
      author: { name: trim(e.author?.name, EMBED_LIMITS.authorName), icon: cleanUrl(e.author?.icon), url: cleanUrl(e.author?.url) },
      footer: { text: trim(e.footer?.text, EMBED_LIMITS.footer), icon: cleanUrl(e.footer?.icon) },
      fields: (e.fields ?? []).slice(0, EMBED_LIMITS.fields).map((f) => ({ name: trim(f.name, EMBED_LIMITS.fieldName), value: trim(f.value, EMBED_LIMITS.fieldValue), inline: Boolean(f.inline) })),
    })),
    buttons: (source.buttons ?? []).slice(0, EMBED_LIMITS.buttonRows).map((row) => row.slice(0, EMBED_LIMITS.buttonsPerRow).map((b) => ({
      label: trim(b.label, EMBED_LIMITS.buttonLabel), url: cleanUrl(b.url), emoji: trim(b.emoji, 8), disabled: Boolean(b.disabled),
    }))).filter((row) => row.length > 0),
  };
  const total = data.content.length + data.embeds.reduce((sum, e) => sum + e.title.length + e.description.length + e.author.name.length + e.footer.text.length + e.fields.reduce((s, f) => s + f.name.length + f.value.length, 0), 0);
  if (total > EMBED_LIMITS.totalChars) return { ok: false, error: `This message is ${total} characters long, Discord accepts at most ${EMBED_LIMITS.totalChars} across the text and embeds.` };
  return { ok: true, data };
}

const CODE_PREFIX = 'p1.';

const toBase64Url = (bytes: Uint8Array) => {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const fromBase64Url = (text: string) => {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text.length + 3) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
};

/** A message as a short text code, for moving it between the Embed Generator and the dashboard. */
export function encodeShareCode(data: TemplateData): string {
  return CODE_PREFIX + toBase64Url(new TextEncoder().encode(JSON.stringify(data)));
}

/** Reads a share code back into a clean template. Returns null for anything that is not a valid code. */
export function decodeShareCode(code: string): TemplateData | null {
  const text = code.trim();
  if (!text.startsWith(CODE_PREFIX) || text.length > 16000) return null;
  try {
    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(text.slice(CODE_PREFIX.length))));
    const checked = validateTemplate(parsed);
    return checked.ok ? checked.data : null;
  } catch {
    return null;
  }
}
