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
