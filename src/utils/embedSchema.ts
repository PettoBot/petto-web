export interface EmbedField { name: string; value: string; inline: boolean }
export interface EmbedAuthor { name: string; icon?: string; url?: string }
export interface EmbedFooter { text: string; icon?: string }
export interface EmbedData {
  title: string; description: string; color: number | null; url: string;
  thumbnail: string; image: string; timestamp: boolean;
  author: EmbedAuthor; footer: EmbedFooter; fields: EmbedField[];
}
export interface LinkButton { label: string; url: string; emoji: string; disabled: boolean }
export type CardPlacement = 'default' | 'embed' | 'attachment';
/** An image card (made in the Image cards editor) sent with the message. */
export interface CardRef { name: string; placement: CardPlacement }
export interface TemplateData { content: string; embeds: EmbedData[]; buttons: LinkButton[][]; card?: CardRef; v2?: V2Doc; reactions?: string[] }

// A Components V2 message: containers, text, pictures, sections, dividers and rows of link buttons. It follows Discord's
// own component JSON, so the bot and the Embed Builder read it as it is. It has no message text and no embeds.
export interface V2Emoji { name: string; id?: string; animated?: boolean }
export interface V2Button { type: 2; style: 1 | 2 | 3 | 4 | 5; label: string; url?: string; custom_id?: string; emoji?: V2Emoji; disabled?: boolean }
export interface V2Text { type: 10; content: string }
export interface V2Separator { type: 14; divider: boolean; spacing: 1 | 2 }
export interface V2Thumbnail { type: 11; media: { url: string }; description?: string; spoiler?: boolean }
export interface V2Section { type: 9; components: V2Text[]; accessory?: V2Thumbnail | V2Button }
export interface V2GalleryItem { media: { url: string }; description?: string; spoiler?: boolean }
export interface V2Gallery { type: 12; items: V2GalleryItem[] }
export interface V2Row { type: 1; components: V2Button[] }
export type V2Child = V2Text | V2Separator | V2Section | V2Gallery | V2Row;
export interface V2Container { type: 17; accent_color: number | null; spoiler?: boolean; components: V2Child[] }
export type V2Node = V2Container | V2Child;
export interface V2Doc { components: V2Node[] }

export const V2_LIMITS = { components: 40, text: 4000, buttonLabel: 80, url: 512, galleryItems: 10, rowButtons: 5, sectionTexts: 3, description: 1024 } as const;

export function emptyEmbed(): EmbedData {
  return { title: '', description: '', color: 0x8399ff, url: '', thumbnail: '', image: '', timestamp: false, author: { name: '' }, footer: { text: '' }, fields: [] };
}
export function emptyButton(): LinkButton {
  return { label: '', url: '', emoji: '', disabled: false };
}
export function emptyTemplate(): TemplateData {
  return { content: '', embeds: [], buttons: [] };
}
export function emptyV2(): V2Doc {
  return { components: [{ type: 17, accent_color: 0x8399ff, components: [{ type: 10, content: '# Hello {user}' }] }] };
}
export const isV2Data = (data: { v2?: V2Doc } | null | undefined): boolean => Boolean(data && Array.isArray(data.v2?.components));

function readCard(raw: any): CardRef | undefined {
  if (!raw || typeof raw !== 'object' || typeof raw.name !== 'string') return undefined;
  const name = raw.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_').slice(0, 40);
  if (!name) return undefined;
  return { name, placement: raw.placement === 'embed' || raw.placement === 'attachment' ? raw.placement : 'default' };
}

export const MAX_REACTIONS = 5;

/** The emojis a message is sent with (up to five): text without spaces, such as 🌸 or <:name:123>. */
export function readReactions(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const clean = raw.map((item) => String(item ?? '').trim()).filter((item) => item && item.length <= 64 && !/\s/.test(item));
  return [...new Set(clean)].slice(0, MAX_REACTIONS);
}

/** Reads either the dashboard's own {content, embeds, buttons} shape or the older /embed
 * command's flat single-embed shape, so nothing saved before this builder existed breaks. */
export function normalizeTemplateData(raw: any): TemplateData {
  const reactions = readReactions(raw?.reactions);
  const withReactions = (data: TemplateData): TemplateData => (reactions.length ? { ...data, reactions } : data);
  const card = readCard(raw?.card);
  if (raw && typeof raw === 'object' && Array.isArray(raw.v2?.components)) return withReactions({ content: '', embeds: [], buttons: [], v2: cleanV2(raw.v2), ...(card ? { card } : {}) });
  const withCard = (data: TemplateData): TemplateData => withReactions(card ? { ...data, card } : data);
  if (raw && Array.isArray(raw.embeds)) {
    return withCard({
      content: raw.content ?? '',
      embeds: raw.embeds.map((e: any) => ({ ...emptyEmbed(), ...e, author: { ...emptyEmbed().author, ...(e.author ?? {}) }, footer: { ...emptyEmbed().footer, ...(e.footer ?? {}) }, fields: e.fields ?? [] })),
      buttons: raw.buttons ?? [],
    });
  }
  const looksLikeEmbed = raw && (raw.title || raw.description || raw.author?.name || raw.footer?.text || raw.fields?.length || raw.image || raw.thumbnail || raw.color != null);
  if (looksLikeEmbed) {
    return withCard({ content: '', embeds: [{ ...emptyEmbed(), ...raw, author: { ...emptyEmbed().author, ...(raw.author ?? {}) }, footer: { ...emptyEmbed().footer, ...(raw.footer ?? {}) }, fields: raw.fields ?? [] }], buttons: [] });
  }
  return withCard(emptyTemplate());
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
  const reactions = readReactions(source.reactions);
  if (source.v2) return { ok: true, data: { content: '', embeds: [], buttons: [], v2: source.v2, ...(source.card ? { card: source.card } : {}), ...(reactions.length ? { reactions } : {}) } };
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
    ...(source.card ? { card: source.card } : {}),
    ...(reactions.length ? { reactions } : {}),
  };
  const total = data.content.length + data.embeds.reduce((sum, e) => sum + e.title.length + e.description.length + e.author.name.length + e.footer.text.length + e.fields.reduce((s, f) => s + f.name.length + f.value.length, 0), 0);
  if (total > EMBED_LIMITS.totalChars) return { ok: false, error: `This message is ${total} characters long, Discord accepts at most ${EMBED_LIMITS.totalChars} across the text and embeds.` };
  return { ok: true, data };
}

const CODE_PREFIX = 'p1.';
const V2_CODE_PREFIX = 'p2.';

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
  if (data.v2) return V2_CODE_PREFIX + toBase64Url(new TextEncoder().encode(JSON.stringify({ components: cleanV2(data.v2).components })));
  return CODE_PREFIX + toBase64Url(new TextEncoder().encode(JSON.stringify(data)));
}

/** Reads a share code back into a clean template. Returns null for anything that is not a valid code. */
export function decodeShareCode(code: string): TemplateData | null {
  const text = code.trim();
  if (text.startsWith(V2_CODE_PREFIX) && text.length <= 40000) {
    try {
      const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(text.slice(V2_CODE_PREFIX.length))));
      return Array.isArray(parsed?.components) ? { content: '', embeds: [], buttons: [], v2: cleanV2(parsed) } : null;
    } catch {
      return null;
    }
  }
  if (!text.startsWith(CODE_PREFIX) || text.length > 16000) return null;
  try {
    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(text.slice(CODE_PREFIX.length))));
    const checked = validateTemplate(parsed);
    return checked.ok ? checked.data : null;
  } catch {
    return null;
  }
}

// ---- Components V2 -------------------------------------------------------------------------------------------------

const clip = (value: unknown, max: number) => String(value ?? '').slice(0, max);
const cleanV2Url = (value: unknown) => {
  const text = clip(value, V2_LIMITS.url).trim();
  return text === '' || /^\{[a-z_.]+\}$/i.test(text) || /^https?:\/\/\S+$/i.test(text) ? text : '';
};
const cleanEmoji = (raw: any): V2Emoji | undefined => {
  const name = clip(raw?.name, 64);
  if (!name) return undefined;
  return /^\d{15,25}$/.test(String(raw?.id ?? '')) ? { name, id: String(raw.id), animated: Boolean(raw.animated) } : { name };
};
function cleanButton(raw: any): V2Button | null {
  if (!raw || raw.type !== 2) return null;
  const emoji = cleanEmoji(raw.emoji);
  // A button that is not a link only shows something (such as the change of a rollout in its label): it does nothing when pressed (the bot answers
  // it without a message), so it looks active. Its label and its emoji can hold variables.
  const style = Number(raw.style);
  if ([1, 2, 3, 4].includes(style)) return { type: 2, style: style as 1 | 2 | 3 | 4, label: clip(raw.label, V2_LIMITS.buttonLabel), custom_id: clip(raw.custom_id, 100) || 'display', ...(emoji ? { emoji } : {}) };
  return { type: 2, style: 5, label: clip(raw.label, V2_LIMITS.buttonLabel), url: cleanV2Url(raw.url), ...(emoji ? { emoji } : {}), ...(raw.disabled ? { disabled: true } : {}) };
}
function cleanThumbnail(raw: any): V2Thumbnail | null {
  if (!raw || raw.type !== 11) return null;
  return { type: 11, media: { url: cleanV2Url(raw.media?.url) }, ...(raw.description ? { description: clip(raw.description, V2_LIMITS.description) } : {}), ...(raw.spoiler ? { spoiler: true } : {}) };
}

/** Counts what Discord counts in a V2 message: every component, nested ones too, and the characters of text. */
export function countV2(doc: V2Doc): { components: number; chars: number } {
  let components = 0;
  let chars = 0;
  const visit = (node: any) => {
    components += 1;
    if (typeof node.content === 'string') chars += node.content.length;
    for (const child of node.components ?? []) visit(child);
    if (node.accessory) visit(node.accessory);
  };
  for (const node of doc.components) visit(node);
  return { components, chars };
}

function cleanChild(raw: any): V2Child | null {
  switch (raw?.type) {
    case 10: return { type: 10, content: clip(raw.content, V2_LIMITS.text) };
    case 14: return { type: 14, divider: raw.divider !== false, spacing: raw.spacing === 2 ? 2 : 1 };
    case 12: return { type: 12, items: (Array.isArray(raw.items) ? raw.items : []).slice(0, V2_LIMITS.galleryItems).map((item: any) => ({ media: { url: cleanV2Url(item?.media?.url) }, ...(item?.description ? { description: clip(item.description, V2_LIMITS.description) } : {}), ...(item?.spoiler ? { spoiler: true } : {}) })) };
    case 9: {
      const texts = (Array.isArray(raw.components) ? raw.components : []).filter((t: any) => t?.type === 10).slice(0, V2_LIMITS.sectionTexts).map((t: any) => ({ type: 10 as const, content: clip(t.content, V2_LIMITS.text) }));
      const accessory = raw.accessory?.type === 11 ? cleanThumbnail(raw.accessory) : raw.accessory?.type === 2 ? cleanButton(raw.accessory) : null;
      return { type: 9, components: texts.length ? texts : [{ type: 10, content: '' }], ...(accessory ? { accessory } : {}) };
    }
    case 1: return { type: 1, components: (Array.isArray(raw.components) ? raw.components : []).slice(0, V2_LIMITS.rowButtons).map(cleanButton).filter(Boolean) as V2Button[] };
    default: return null;
  }
}

/** Cleans anything that claims to be a V2 message into one of the allowed shapes, within Discord's limits. */
export function cleanV2(raw: any): V2Doc {
  const doc: V2Doc = { components: [] };
  for (const node of Array.isArray(raw?.components) ? raw.components : []) {
    if (node?.type === 17) {
      const accent = Number.isInteger(node.accent_color) && node.accent_color >= 0 && node.accent_color <= 0xffffff ? node.accent_color : null;
      const children = (Array.isArray(node.components) ? node.components : []).map(cleanChild).filter(Boolean) as V2Child[];
      doc.components.push({ type: 17, accent_color: accent, ...(node.spoiler ? { spoiler: true } : {}), components: children });
    } else {
      const child = cleanChild(node);
      if (child) doc.components.push(child);
    }
  }
  // Drop the last nodes while the message is over what Discord accepts, so a saved message is always sendable.
  while (doc.components.length > 1 && (countV2(doc).components > V2_LIMITS.components || countV2(doc).chars > V2_LIMITS.text)) doc.components.pop();
  return doc;
}
