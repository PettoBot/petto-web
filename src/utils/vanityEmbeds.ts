import { normalizeTemplateData, validateTemplate, type TemplateData } from './embedSchema';

/** A message as the Vanity bot stores it: one embed, flat, with link buttons that have no emoji. */
export interface VanityTemplate {
  content?: string;
  title?: string;
  description?: string;
  color?: number;
  url?: string;
  thumbnail?: string;
  image?: string;
  timestamp?: boolean;
  author?: { name: string; icon?: string; url?: string };
  footer?: { text: string; icon?: string };
  fields?: { name: string; value: string; inline: boolean }[];
  buttons?: { label: string; url: string; disabled?: boolean }[][];
}

/** Reads a message from the Vanity bot into the shape the dashboard editor works with. */
export function fromVanityTemplate(raw: VanityTemplate | null | undefined): TemplateData {
  const source = raw ?? {};
  const hasEmbed = Boolean(source.title || source.description || source.author?.name || source.footer?.text || source.fields?.length || source.image || source.thumbnail || source.url || source.color || source.timestamp);
  return normalizeTemplateData({
    content: source.content ?? '',
    embeds: hasEmbed
      ? [{
          title: source.title ?? '',
          description: source.description ?? '',
          color: source.color ? source.color : null,
          url: source.url ?? '',
          thumbnail: source.thumbnail ?? '',
          image: source.image ?? '',
          timestamp: Boolean(source.timestamp),
          author: { name: source.author?.name ?? '', icon: source.author?.icon ?? '', url: source.author?.url ?? '' },
          footer: { text: source.footer?.text ?? '', icon: source.footer?.icon ?? '' },
          fields: (source.fields ?? []).map((f) => ({ name: f.name, value: f.value, inline: Boolean(f.inline) })),
        }]
      : [],
    buttons: (source.buttons ?? []).map((row) => row.map((b) => ({ label: b.label, url: b.url, emoji: '', disabled: Boolean(b.disabled) }))),
  });
}

/** Turns the editor's message into what the Vanity bot stores. The bot sends one embed, so only the first is kept. */
export function toVanityTemplate(data: TemplateData): VanityTemplate {
  const checked = validateTemplate(data);
  const clean = checked.ok ? checked.data : data;
  const embed = clean.embeds[0];
  const template: VanityTemplate = { content: clean.content };
  if (embed) {
    template.title = embed.title;
    template.description = embed.description;
    if (embed.color) template.color = embed.color;
    template.url = embed.url;
    template.thumbnail = embed.thumbnail;
    template.image = embed.image;
    template.timestamp = embed.timestamp;
    if (embed.author.name) template.author = { name: embed.author.name, icon: embed.author.icon || undefined, url: embed.author.url || undefined };
    if (embed.footer.text) template.footer = { text: embed.footer.text, icon: embed.footer.icon || undefined };
    if (embed.fields.length) template.fields = embed.fields;
  }
  const buttons = clean.buttons
    .map((row) => row.filter((b) => b.label && b.url).map((b) => ({ label: b.label, url: b.url, disabled: b.disabled || undefined })))
    .filter((row) => row.length > 0);
  if (buttons.length) template.buttons = buttons;
  return template;
}
