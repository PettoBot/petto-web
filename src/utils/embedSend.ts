import type { TemplateData } from './embedSchema';
import { tokenValues } from './variableSamples';
import type { TokenContext } from './variableSamples';

const API = 'https://discord.com/api/v10';

/** Fills the bot's {variable} tokens with the given user and server. Unknown tokens stay as written. */
export function fillTokens(text: string, ctx: TokenContext): string {
  const values = tokenValues(ctx);
  return text.replace(/\{([a-zA-Z0-9_.:|-]+)\}/g, (match, token) => {
    const value = values[token];
    if (!value) return match;
    return value.mention ? `<@${ctx.userId}>` : value.text;
  });
}

const AVATAR_TOKENS = new Set(['{user.avatar}', '{user_avatar}', '{user.display_avatar}', '{guild.icon}', '{server_icon}']);

/** Turns a saved template into the body Discord's message endpoint expects, with tokens filled in. */
export function buildDiscordMessage(data: TemplateData, ctx: TokenContext, images: { userAvatar: string | null; serverIcon: string | null }) {
  const fill = (text: string) => fillTokens(text, ctx);
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

export type SendResult = { ok: true } | { ok: false; error: string };

/** Sends a test message to a channel, or to the person's direct messages when no channel is given. */
export async function sendTestMessage(botToken: string, message: ReturnType<typeof buildDiscordMessage>, target: { channelId: string } | { dmUserId: string }): Promise<SendResult> {
  const headers = { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' };
  let channelId: string;
  if ('channelId' in target) {
    channelId = target.channelId;
  } else {
    const dm = await fetch(`${API}/users/@me/channels`, { method: 'POST', headers, body: JSON.stringify({ recipient_id: target.dmUserId }) });
    if (!dm.ok) return { ok: false, error: 'Petto could not open a direct message with you. Check that your DMs allow messages from server members.' };
    channelId = (await dm.json()).id;
  }
  if (!message.content && message.embeds.length === 0) return { ok: false, error: 'This template is empty, add some text or an embed first.' };
  const res = await fetch(`${API}/channels/${encodeURIComponent(channelId)}/messages`, { method: 'POST', headers, body: JSON.stringify(message) });
  if (res.ok) return { ok: true };
  if (res.status === 403) return { ok: false, error: 'Petto cannot send messages in that channel. Check its permissions there.' };
  if (res.status === 404) return { ok: false, error: 'That channel does not exist anymore.' };
  return { ok: false, error: 'Discord rejected the message. Check the links and image addresses in the template.' };
}
