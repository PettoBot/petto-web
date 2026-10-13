import type { TemplateData, V2Node } from './embedSchema';
import { findSample, tokenValues } from './variableSamples';
import type { TokenContext } from './variableSamples';

const API = 'https://discord.com/api/v10';

/** Fills the bot's {variable} tokens with the given user and server. Unknown tokens stay as written. */
export function fillTokens(text: string, ctx: TokenContext): string {
  const values = tokenValues(ctx);
  return text.replace(/\{\s*([a-zA-Z0-9_.:|-]+)\s*\}/g, (match, token) => {
    // {imgcard:name} is a picture the bot draws, so a message sent from here cannot hold it.
    if (/^imgcard:/i.test(token)) return '';
    const value = findSample(values, token);
    if (!value) return match;
    return value.mention ? `<@${ctx.userId}>` : value.text;
  });
}

const AVATAR_TOKENS = new Set(['{user.avatar}', '{user_avatar}', '{user.display_avatar}', '{guild.icon}', '{server_icon}']);

/** Turns a saved template into the body Discord's message endpoint expects, with tokens filled in. */
export function buildDiscordMessage(data: TemplateData, ctx: TokenContext, images: { userAvatar: string | null; serverIcon: string | null }) {
  const fill = (text: string) => fillTokens(text, ctx);
  if (data.v2) return buildV2Message(data.v2.components, fill, images, ctx.userId);
  const url = (value?: string) => {
    if (!value) return undefined;
    if (AVATAR_TOKENS.has(value.trim())) return (value.includes('guild') || value.includes('server') ? images.serverIcon : images.userAvatar) ?? undefined;
    return value;
  };
  const embeds = data.embeds.map((e) => ({
    title: e.title ? fill(e.title) : undefined,
    description: e.description ? fill(e.description) : undefined,
    url: url(e.url),
    color: e.color ?? undefined,
    timestamp: e.timestamp ? new Date().toISOString() : undefined,
    thumbnail: url(e.thumbnail) ? { url: url(e.thumbnail) } : undefined,
    image: url(e.image) ? { url: url(e.image) } : undefined,
    author: e.author.name ? { name: fill(e.author.name), icon_url: url(e.author.icon), url: url(e.author.url) } : undefined,
    footer: e.footer.text ? { text: fill(e.footer.text), icon_url: url(e.footer.icon) } : undefined,
    fields: e.fields.filter((f) => f.name && f.value).map((f) => ({ name: fill(f.name), value: fill(f.value), inline: f.inline })),
  }));
  const components = data.buttons
    .map((row) => row.filter((b) => b.label && /^https?:\/\//i.test(b.url)))
    .filter((row) => row.length > 0)
    .map((row) => ({
      type: 1,
      components: row.map((b) => ({ type: 2, style: 5, label: fill(b.label), url: b.url, disabled: b.disabled, ...(b.emoji ? { emoji: { name: b.emoji } } : {}) })),
    }));
  return {
    content: data.content ? fill(data.content) : undefined,
    embeds,
    components,
    // A test message may mention the person who sent it, and nobody else.
    allowed_mentions: { parse: [], users: [ctx.userId] },
  };
}

const V2_FLAG = 32768;

/** A V2 design as a message: the same components with the variables filled in. Texts and pictures that end up empty are left out. */
function buildV2Message(nodes: V2Node[], fill: (text: string) => string, images: { userAvatar: string | null; serverIcon: string | null }, userId: string) {
  const picture = (value?: string) => {
    const raw = (value ?? '').trim();
    if (AVATAR_TOKENS.has(raw)) return (raw.includes('guild') || raw.includes('server') ? images.serverIcon : images.userAvatar) ?? '';
    const filled = fill(raw);
    return /^https?:\/\/\S+$/i.test(filled) ? filled : '';
  };
  const text = (value: string) => fill(value).trim();
  const walk = (node: any): any => {
    switch (node.type) {
      case 10: { const content = text(node.content ?? ''); return content ? { type: 10, content } : null; }
      case 14: return { type: 14, divider: node.divider !== false, spacing: node.spacing === 2 ? 2 : 1 };
      case 12: { const items = (node.items ?? []).map((item: any) => ({ url: picture(item.media?.url), item })).filter((x: any) => x.url).map(({ url, item }: any) => ({ media: { url }, ...(item.description ? { description: text(item.description) } : {}), spoiler: Boolean(item.spoiler) })); return items.length ? { type: 12, items } : null; }
      case 9: {
        const texts = (node.components ?? []).map(walk).filter(Boolean);
        if (!texts.length) return null;
        let accessory: any = null;
        if (node.accessory?.type === 11) { const url = picture(node.accessory.media?.url); if (url) accessory = { type: 11, media: { url }, spoiler: Boolean(node.accessory.spoiler) }; }
        else if (node.accessory?.type === 2) accessory = walk(node.accessory);
        return accessory ? { type: 9, components: texts, accessory } : texts;
      }
      case 2: { const label = text(node.label ?? ''); const url = picture(node.url); return url && (label || node.emoji?.name) ? { type: 2, style: 5, ...(label ? { label: label.slice(0, 80) } : {}), url, ...(node.emoji?.name ? { emoji: node.emoji.id ? node.emoji : { name: node.emoji.name } } : {}), ...(node.disabled ? { disabled: true } : {}) } : null; }
      case 1: { const buttons = (node.components ?? []).map(walk).filter(Boolean); return buttons.length ? { type: 1, components: buttons } : null; }
      case 17: {
        const children = (node.components ?? []).flatMap((child: any) => { const built = walk(child); return Array.isArray(built) ? built : built ? [built] : []; });
        return children.length ? { type: 17, ...(typeof node.accent_color === 'number' ? { accent_color: node.accent_color } : {}), ...(node.spoiler ? { spoiler: true } : {}), components: children } : null;
      }
      default: return null;
    }
  };
  const components = nodes.flatMap((node) => { const built = walk(node); return Array.isArray(built) ? built : built ? [built] : []; });
  return { content: undefined as string | undefined, embeds: [] as any[], components, flags: V2_FLAG, allowed_mentions: { parse: [], users: [userId] } };
}

export type SendResult = { ok: true } | { ok: false; error: string };

/** Sends a test message to a channel, or to the person's direct messages when no channel is given. */
export async function sendTestMessage(botToken: string, message: ReturnType<typeof buildDiscordMessage> | ReturnType<typeof buildV2Message>, target: { channelId: string } | { dmUserId: string }, file?: { name: string; bytes: ArrayBuffer }): Promise<SendResult> {
  const headers = { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' };
  let channelId: string;
  if ('channelId' in target) {
    channelId = target.channelId;
  } else {
    const dm = await fetch(`${API}/users/@me/channels`, { method: 'POST', headers, body: JSON.stringify({ recipient_id: target.dmUserId }) });
    if (!dm.ok) return { ok: false, error: 'Petto could not open a direct message with you. Check that your DMs allow messages from server members.' };
    channelId = (await dm.json()).id;
  }
  if (!message.content && message.embeds.length === 0 && !file && !(message as any).flags) return { ok: false, error: 'This template is empty, add some text or an embed first.' };
  let res: Response;
  if (file) {
    // A card goes up as a file next to the message, the same way the bot attaches it.
    const form = new FormData();
    form.append('payload_json', JSON.stringify({ ...message, attachments: [{ id: 0, filename: file.name }] }));
    form.append('files[0]', new Blob([file.bytes], { type: 'image/png' }), file.name);
    res = await fetch(`${API}/channels/${encodeURIComponent(channelId)}/messages`, { method: 'POST', headers: { Authorization: headers.Authorization }, body: form });
  } else {
    res = await fetch(`${API}/channels/${encodeURIComponent(channelId)}/messages`, { method: 'POST', headers, body: JSON.stringify(message) });
  }
  if (res.ok) return { ok: true };
  if (res.status === 403) return { ok: false, error: 'Petto cannot send messages in that channel. Check its permissions there.' };
  if (res.status === 404) return { ok: false, error: 'That channel does not exist anymore.' };
  return { ok: false, error: 'Discord rejected the message. Check the links and image addresses in the template.' };
}
