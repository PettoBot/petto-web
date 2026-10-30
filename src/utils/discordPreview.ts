// Renders Discord-style messages and embeds as HTML for the dashboard's live previews.
// It follows the same markdown subset and layout as the Embed Builder, and fills the bot's
// {variable} tokens with sample values so a preview reads like the message members will see.

import { findSample, sampleContext, tokenValues } from './variableSamples';
import { silentMentions } from './silentMention';

export interface PreviewEmbed {
  title?: string;
  description?: string;
  color?: number | string | null;
  url?: string;
  thumbnail?: string;
  image?: string;
  timestamp?: boolean;
  author?: { name?: string; icon?: string; url?: string };
  footer?: { text?: string; icon?: string };
  fields?: { name: string; value: string; inline?: boolean }[];
}

export interface PreviewMessage {
  content?: string;
  embeds?: PreviewEmbed[];
  buttons?: { label?: string; emoji?: string; style?: string }[][];
}

export interface PreviewContext {
  /** Extra sample values, for the variables only one bot has. */
  samples?: Record<string, import('./variableSamples').TokenValue>;
  userName: string;
  serverName: string;
  botName: string;
  botIcon: string;
  userAvatar: string;
  serverIcon: string;
  /** Translates the few fixed labels, defaults to English. */
  t?: (key: string) => string;
}

export const defaultContext: PreviewContext = {
  userName: 'Liam',
  serverName: 'Petto Support',
  botName: 'Petto',
  botIcon: '/assets/mascot-icon.webp',
  userAvatar: '/assets/mascot-icon.webp',
  serverIcon: '/assets/mascot-icon.webp',
};

const tr = (ctx: PreviewContext, key: string) => (ctx.t ? ctx.t(key) : key);
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const safeUrl = (value: string) => (/^(https?:\/\/|blob:)/i.test(value.trim()) || value.trim().startsWith('/') ? escapeHtml(value.trim()) : '');

/** Inline formatting on text that is already HTML-escaped. */
function inline(html: string, ctx: PreviewContext): string {
  // Links are set aside first so their address is not touched by the formatting rules below.
  const links: { url: string; label: string | null }[] = [];
  const keep = (url: string, label: string | null) => `\u0000${links.push({ url, label }) - 1}\u0000`;
  html = html.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label, url) => keep(url, label));
  html = html.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, (_m, lead, url) => `${lead}${keep(url, null)}`);
  const restore = (text: string) => text.replace(/\u0000(\d+)\u0000/g, (_m, index) => {
    const { url, label } = links[Number(index)];
    // The label of a [text](link) can carry formatting or variables too.
    return `<a class="dp-link" href="${url}" target="_blank" rel="noopener noreferrer">${label === null ? url : inline(label, ctx)}</a>`;
  });
  const samples = { ...tokenValues({ userId: sampleContext.userId, userName: ctx.userName, serverName: ctx.serverName, memberCount: sampleContext.memberCount }), ...(ctx.samples ?? {}) };
  let out = html;
  out = out.replace(/`([^`\n]+)`/g, (_m, code) => `<code class="dp-code">${code}</code>`);
  // A silent mention (`!@everyone`, `!@Role`, `!<@&id>`, `!{user.mention}`) is drawn as the normal pill, without the `!`; `\!@everyone` shows the text.
  out = silentMentions(out, {
    pill: (label) => `<span class="dp-mention">${label}</span>`,
    id: (kind) => (kind === 'channel' ? 'channel' : kind === 'role' ? 'role' : 'user'),
    variable: (token) => { const sample = findSample(samples, token); return sample?.mention ? `<span class="dp-mention">${sample.text}</span>` : null; },
  });
  out = out.replace(/\{\s*([a-zA-Z0-9_.:|-]+)\s*\}/g, (m, token) => {
    if (token.toLowerCase() === 'newline') return '<br>';
    // {imgcard:name}: the bot draws that image card in the message, so the preview shows a marker where it goes.
    const card = /^imgcard:\s*([a-z0-9][a-z0-9 _-]*)/i.exec(token);
    if (card) return `<span class="dp-mention">🖼 ${card[1].trim()}</span>`;
    const sample = findSample(samples, token);
    if (!sample) return `<span class="dp-var">${m}</span>`;
    return sample.mention ? `<span class="dp-mention">${sample.text}</span>` : sample.text;
  });
  out = out.replace(/&lt;a?:(\w+):(\d+)&gt;/g, (m, name, id) => `<img class="dp-emoji" src="https://cdn.discordapp.com/emojis/${id}.${m.startsWith('&lt;a:') ? 'gif' : 'png'}?size=32" alt=":${name}:">`);
  out = out.replace(/&lt;@!?(\d+)&gt;/g, '<span class="dp-mention">@user</span>');
  out = out.replace(/&lt;@&amp;(\d+)&gt;/g, '<span class="dp-mention">@role</span>');
  out = out.replace(/&lt;#(\d+)&gt;/g, '<span class="dp-mention">#channel</span>');
  // </name:id> is a clickable command, shown as the chip Discord draws.
  out = out.replace(/&lt;\/([\w-]+(?: [\w-]+){0,2}):(\d+)&gt;/g, (_m, name) => `<span class="dp-mention">/${name}</span>`);
  out = out.replace(/&lt;t:(\d+)(?::[a-zA-Z])?&gt;/g, '<span class="dp-mention">Today at 12:00 PM</span>');
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/__(.+?)__/g, '<u>$1</u>');
  out = out.replace(/~~(.+?)~~/g, '<s>$1</s>');
  out = out.replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<em>$2</em>');
  out = out.replace(/(^|[\s(])_(?!\s)([^_\n]+?)_(?=$|[\s).,!?:;])/g, '$1<em>$2</em>');
  out = out.replace(/\|\|(.+?)\|\|/g, '<span class="dp-spoiler">$1</span>');
  return restore(out);
}

/** Block level markdown: code blocks, headings, quotes, then the inline rules. */
export function renderMarkdown(text: string, ctx: PreviewContext = defaultContext): string {
  if (!text) return '';
  const parts: string[] = [];
  const codeBlock = /```([\s\S]*?)```/g;
  let last = 0;
  let match: RegExpExecArray | null;
  const lines = (chunk: string) => chunk.split('\n').map((line) => {
    const escaped = escapeHtml(line).replace(/^(\s*)[-*]\s+(?=\S)/, '$1• ');
    const heading = escaped.match(/^(#{1,3})\s+(.*)$/);
    if (heading) return `<span class="dp-h${heading[1].length}">${inline(heading[2], ctx)}</span>`;
    const small = escaped.match(/^-#\s+(.*)$/);
    if (small) return `<span class="dp-sub">${inline(small[1], ctx)}</span>`;
    const quote = escaped.match(/^&gt;\s?(.*)$/);
    if (quote) return `<span class="dp-quote">${inline(quote[1], ctx)}</span>`;
    return inline(escaped, ctx);
  }).join('<br>');
  while ((match = codeBlock.exec(text))) {
    if (match.index > last) parts.push(lines(text.slice(last, match.index)));
    parts.push(`<pre class="dp-codeblock">${escapeHtml(match[1].replace(/^\w*\n/, ''))}</pre>`);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(lines(text.slice(last)));
  return parts.join('');
}

function embedColor(color: PreviewEmbed['color']): string {
  if (typeof color === 'number') return `#${color.toString(16).padStart(6, '0')}`;
  if (typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color)) return color;
  return '#4f545c';
}

function renderEmbed(e: PreviewEmbed, ctx: PreviewContext): string {
  const icon = (value?: string) => {
    if (!value) return '';
    const map: Record<string, string> = { '{user.avatar}': ctx.userAvatar, '{user_avatar}': ctx.userAvatar, '{user.display_avatar}': ctx.userAvatar, '{guild.icon}': ctx.serverIcon, '{server_icon}': ctx.serverIcon };
    return safeUrl(map[value.trim()] ?? value);
  };
  const author = e.author?.name
    ? `<div class="dp-embed-author">${icon(e.author.icon) ? `<img src="${icon(e.author.icon)}" alt="" referrerpolicy="no-referrer">` : ''}<span>${renderMarkdown(e.author.name, ctx)}</span></div>`
    : '';
  const title = e.title
    ? (e.url && safeUrl(e.url) ? `<a class="dp-embed-title dp-link" href="${safeUrl(e.url)}" target="_blank" rel="noopener noreferrer">${renderMarkdown(e.title, ctx)}</a>` : `<div class="dp-embed-title">${renderMarkdown(e.title, ctx)}</div>`)
    : '';
  const description = e.description ? `<div class="dp-embed-desc">${renderMarkdown(e.description, ctx)}</div>` : '';
  const fields = e.fields?.length
    ? `<div class="dp-embed-fields">${e.fields.map((f) => `<div class="dp-embed-field${f.inline ? ' inline' : ''}"><div class="dp-embed-field-name">${renderMarkdown(f.name, ctx)}</div><div class="dp-embed-field-value">${renderMarkdown(f.value, ctx)}</div></div>`).join('')}</div>`
    : '';
  const thumb = icon(e.thumbnail) ? `<img class="dp-embed-thumb" src="${icon(e.thumbnail)}" alt="" referrerpolicy="no-referrer">` : '';
  const image = icon(e.image) ? `<img class="dp-embed-image" src="${icon(e.image)}" alt="" referrerpolicy="no-referrer">` : '';
  const footerText = [e.footer?.text ? renderMarkdown(e.footer.text, ctx) : '', e.timestamp ? tr(ctx, 'Today at 12:00 PM') : ''].filter(Boolean).join(' • ');
  const footer = footerText ? `<div class="dp-embed-footer">${icon(e.footer?.icon) ? `<img src="${icon(e.footer?.icon)}" alt="" referrerpolicy="no-referrer">` : ''}<span>${footerText}</span></div>` : '';
  return `<div class="dp-embed" style="--dp-c:${embedColor(e.color)}">${author}<div class="dp-embed-body"><div class="dp-embed-main">${title}${description}${fields}</div>${thumb}</div>${image}${footer}</div>`;
}

/** A whole message: bot header, text, embeds and link buttons, as the channel would show it. */
export function renderMessage(message: PreviewMessage, ctx: PreviewContext = defaultContext): string {
  const content = message.content ? `<div class="dp-content">${renderMarkdown(message.content, ctx)}</div>` : '';
  const embeds = (message.embeds ?? []).map((e) => renderEmbed(e, ctx)).join('');
  const buttons = (message.buttons ?? []).map((row) => row.filter((b) => b.label)).filter((row) => row.length)
    .map((row) => `<div class="dp-btn-row">${row.map((b) => `<span class="dp-btn${b.style ? ` dp-btn-${escapeHtml(b.style)}` : ''}">${b.emoji ? `<span>${escapeHtml(b.emoji)}</span> ` : ''}${escapeHtml(b.label ?? '')}</span>`).join('')}</div>`).join('');
  const empty = !content && !embeds && !buttons ? `<div class="dp-empty">${escapeHtml(tr(ctx, 'Nothing set yet.'))}</div>` : '';
  return `<div class="dp-msg"><img class="dp-avatar" src="${safeUrl(ctx.botIcon)}" alt=""><div class="dp-body"><div class="dp-head"><span class="dp-name">${escapeHtml(ctx.botName)}</span><span class="dp-tag">${escapeHtml(tr(ctx, 'APP'))}</span><span class="dp-time">${escapeHtml(tr(ctx, 'Today at 12:00 PM'))}</span></div>${content}${embeds}${buttons}${empty}</div></div>`;
}

// ---- Components V2 -------------------------------------------------------------------------------------------------

type V2PreviewNode = { type: number; content?: string; divider?: boolean; spacing?: number; accent_color?: number | null; spoiler?: boolean; media?: { url?: string }; description?: string; items?: { media?: { url?: string }; description?: string }[]; components?: V2PreviewNode[]; accessory?: V2PreviewNode; label?: string; url?: string; style?: number; actions?: unknown[]; emoji?: { name?: string; id?: string; animated?: boolean } };

function previewImage(value: string | undefined, ctx: PreviewContext): string {
  const raw = (value ?? '').trim();
  const map: Record<string, string> = { '{user.avatar}': ctx.userAvatar, '{user_avatar}': ctx.userAvatar, '{user.display_avatar}': ctx.userAvatar, '{guild.icon}': ctx.serverIcon, '{server_icon}': ctx.serverIcon };
  const filled = map[raw] ?? raw;
  const sample = filled.match(/^\{([a-zA-Z0-9_.:|-]+)\}$/);
  const withSample = sample ? (ctx.samples?.[sample[1]]?.text ?? '') : filled;
  return safeUrl(withSample);
}

function renderV2Button(node: V2PreviewNode, ctx: PreviewContext): string {
  const label = node.label ? renderMarkdown(node.label, ctx).replace(/<br>/g, ' ') : '';
  const emoji = node.emoji?.id ? `<img class="dp-emoji" src="https://cdn.discordapp.com/emojis/${escapeHtml(node.emoji.id)}.${node.emoji.animated ? 'gif' : 'png'}?size=32" alt="">` : node.emoji?.name ? `<span>${escapeHtml(node.emoji.name)}</span>` : '';
  // Buttons with actions and plain display buttons have a colour; only the ones with a link carry the arrow.
  const colour = ({ 1: 'blurple', 2: 'grey', 3: 'green', 4: 'red' } as Record<number, string>)[node.style ?? 5];
  const isLink = !colour;
  return `<span class="dp-btn${colour ? ` dp-btn-${colour}` : ''}">${emoji}${emoji && label ? ' ' : ''}${label}${isLink ? '<span class="dp-v2-link" aria-hidden="true">↗</span>' : ''}</span>`;
}

function renderV2Node(node: V2PreviewNode, ctx: PreviewContext): string {
  switch (node.type) {
    case 10: return node.content?.trim() ? `<div class="dp-v2-text">${renderMarkdown(node.content, ctx)}</div>` : '';
    case 14: return `<div class="dp-v2-sep${node.divider === false ? ' nodivider' : ''}${node.spacing === 2 ? ' large' : ''}"></div>`;
    case 12: {
      const items = (node.items ?? []).map((item) => previewImage(item.media?.url, ctx)).filter(Boolean);
      return items.length ? `<div class="dp-v2-gallery n${Math.min(items.length, 4)}">${items.slice(0, 10).map((src) => `<img src="${src}" alt="" referrerpolicy="no-referrer">`).join('')}</div>` : '';
    }
    case 9: {
      const text = (node.components ?? []).map((child) => renderV2Node(child, ctx)).join('');
      const accessory = node.accessory?.type === 11 ? previewImage(node.accessory.media?.url, ctx) : '';
      const button = node.accessory?.type === 2 ? renderV2Button(node.accessory, ctx) : '';
      if (!text && !accessory && !button) return '';
      return `<div class="dp-v2-section"><div class="dp-v2-section-text">${text}</div>${accessory ? `<img class="dp-v2-thumb" src="${accessory}" alt="" referrerpolicy="no-referrer">` : ''}${button}</div>`;
    }
    case 1: {
      const buttons = (node.components ?? []).filter((b) => b.type === 2 && (b.label || b.emoji?.name)).map((b) => renderV2Button(b, ctx)).join('');
      return buttons ? `<div class="dp-btn-row">${buttons}</div>` : '';
    }
    case 17: {
      const body = (node.components ?? []).map((child) => renderV2Node(child, ctx)).join('');
      const accent = typeof node.accent_color === 'number' ? `#${node.accent_color.toString(16).padStart(6, '0')}` : '';
      return `<div class="dp-v2-container${accent ? '' : ' noaccent'}" style="${accent ? `--dp-c:${accent}` : ''}">${body || `<div class="dp-empty">${escapeHtml(tr(ctx, 'Nothing set yet.'))}</div>`}</div>`;
    }
    default: return '';
  }
}

/** A Components V2 message as the channel would show it: the bot header, then the components one after the other. */
export function renderV2Message(doc: { components?: V2PreviewNode[] }, ctx: PreviewContext = defaultContext): string {
  const body = (doc.components ?? []).map((node) => renderV2Node(node, ctx)).join('');
  const empty = body ? '' : `<div class="dp-empty">${escapeHtml(tr(ctx, 'Nothing set yet.'))}</div>`;
  return `<div class="dp-msg"><img class="dp-avatar" src="${safeUrl(ctx.botIcon)}" alt=""><div class="dp-body"><div class="dp-head"><span class="dp-name">${escapeHtml(ctx.botName)}</span><span class="dp-tag">${escapeHtml(tr(ctx, 'APP'))}</span><span class="dp-time">${escapeHtml(tr(ctx, 'Today at 12:00 PM'))}</span></div>${body}${empty}</div></div>`;
}
