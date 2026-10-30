// The text of a Discord message as HTML, for the simulated screenshots of the site. It reads what Petto's cards use: **bold**, *italic*, `code`,
// [links](url), ### headings, -# small text, - lists, code blocks, mentions, custom emoji and timestamps. Everything is escaped first, so a fixture can
// never put a tag in the page.

import { silentMentions } from './silentMention';

const esc = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** A timestamp as Discord shows it, from a fixed "now" so that "3 minutes ago" does not drift as the site ages. */
function timestamp(seconds: number, style: string, now: number, locale: string): string {
  const date = new Date(seconds * 1000);
  if (style === 'R') {
    const diff = (seconds * 1000 - now) / 1000;
    const units: [Intl.RelativeTimeFormatUnit, number][] = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]];
    const [unit, size] = units.find(([, s]) => Math.abs(diff) >= s) ?? units[units.length - 1];
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(Math.round(diff / size), unit);
  }
  const options: Intl.DateTimeFormatOptions = style === 'F' ? { dateStyle: 'full', timeStyle: 'short' } : style === 'f' ? { dateStyle: 'long', timeStyle: 'short' } : style === 't' ? { timeStyle: 'short' } : style === 'T' ? { timeStyle: 'medium' } : style === 'd' ? { dateStyle: 'short' } : { dateStyle: 'long' };
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'America/Bogota' }).format(date);
}

export interface MarkdownContext { now?: number; locale?: string; names?: Record<string, string> }

/** The picture of a custom emoji of Discord: a file of the site, which scripts/make-shots.mjs downloads for each emoji a screenshot uses. */
export const emojiUrl = (id: string, animated = false) => `/assets/shots/emoji/${id}.${animated ? 'gif' : 'png'}`;

/** One line of text with its inline marks. */
function inline(text: string, context: MarkdownContext): string {
  const { now = Date.now(), locale = 'en', names = {} } = context;
  let html = esc(text);
  // The marks that hold other text come first and are put away so that what is inside them is not read again.
  const kept: string[] = [];
  const keep = (value: string) => `\u0000${kept.push(value) - 1}\u0000`;
  html = html.replace(/`([^`]+)`/g, (_, code) => keep(`<code>${code}</code>`));
  html = html.replace(/&lt;t:(\d+)(?::([a-zA-Z]))?&gt;/g, (_, seconds, style) => keep(`<span class="ds-time">${esc(timestamp(Number(seconds), style ?? 'f', now, locale))}</span>`));
  html = html.replace(/&lt;(a?):([\w]+):(\d+)&gt;/g, (_, animated, name, id) => keep(`<img class="ds-emoji" src="${emojiUrl(id, animated === 'a')}" alt=":${name}:" title=":${name}:" loading="lazy" />`));
  // A silent mention (`!@everyone`, `!@Role`, `!<@id>`) is the normal pill without the `!`; `\!@everyone` stays as text.
  html = silentMentions(html, {
    pill: (label) => keep(`<span class="ds-mention">${label}</span>`),
    id: (kind, id) => esc(names[id] ?? (kind === 'channel' ? 'channel' : kind === 'role' ? 'role' : 'member')),
  });
  html = html.replace(/&lt;@(?:!|&amp;)?(\d+)&gt;/g, (_, id) => keep(`<span class="ds-mention">@${esc(names[id] ?? 'member')}</span>`));
  html = html.replace(/&lt;#(\d+)&gt;/g, (_, id) => keep(`<span class="ds-mention">#${esc(names[id] ?? 'channel')}</span>`));
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, (_, label, url) => keep(`<a class="ds-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`));
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>').replace(/__(.+?)__/g, '<u>$1</u>');
  return html.replace(/\u0000(\d+)\u0000/g, (_, index) => kept[Number(index)]);
}

/** A block of text: headings (`###`), small text (`-#`), lists and code blocks, one paragraph per line. */
export function markdown(text: string, context: MarkdownContext = {}): string {
  const out: string[] = [];
  const lines = String(text ?? '').split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const code: string[] = [];
      for (i += 1; i < lines.length && !lines[i].startsWith('```'); i += 1) code.push(lines[i]);
      out.push(`<pre class="ds-pre">${esc(code.join('\n'))}</pre>`);
      continue;
    }
    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) { out.push(`<div class="ds-h ds-h${heading[1].length}">${inline(heading[2], context)}</div>`); continue; }
    const small = /^-#\s+(.*)$/.exec(line);
    if (small) { out.push(`<div class="ds-small">${inline(small[1], context)}</div>`); continue; }
    const item = /^[-*]\s+(.*)$/.exec(line);
    if (item) { out.push(`<div class="ds-li">${inline(item[1], context)}</div>`); continue; }
    out.push(line.trim() ? `<div class="ds-p">${inline(line, context)}</div>` : '<div class="ds-gap"></div>');
  }
  return out.join('');
}
