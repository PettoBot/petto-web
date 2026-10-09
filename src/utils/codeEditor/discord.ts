// Draws what a test of a command in code would do the way Discord shows it: markdown, mentions, timestamps, embeds,
// buttons, menus, reactions, forms and direct messages. Ported from the Petto Code Generator. Everything that comes from
// the code is escaped first, so the code under test cannot add HTML to the dashboard.
import { esc } from './highlight';

const SAFE_URL = /^https?:\/\/[^\s"'<>]+$/i;
const safe = (url: unknown) => (SAFE_URL.test(String(url ?? '')) ? String(url) : '');

const svg = (path: string) => `<svg class="dc-i" viewBox="0 0 256 256" width="14" height="14" aria-hidden="true" fill="currentColor"><path d="${path}"/></svg>`;
const ICONS = {
  eye: svg('M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z'),
  caret: svg('M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z'),
  link: svg('M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z'),
  mail: svg('M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z'),
  arrow: svg('M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z'),
  clock: svg('M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z'),
};

export interface RenderContext { locale: string }

/** Formats a Discord timestamp <t:unix:style> in the language of the page. */
export function formatTimestamp(seconds: number | string, style: string | undefined, locale: string) {
  const date = new Date(Number(seconds) * 1000);
  if (Number.isNaN(date.getTime())) return String(seconds);
  const fmt = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, opts).format(date);
  switch (style) {
    case 't': return fmt({ hour: 'numeric', minute: '2-digit' });
    case 'T': return fmt({ hour: 'numeric', minute: '2-digit', second: '2-digit' });
    case 'd': return fmt({ day: 'numeric', month: 'numeric', year: 'numeric' });
    case 'D': return fmt({ day: 'numeric', month: 'long', year: 'numeric' });
    case 'F': return fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    case 'R': {
      const diff = (date.getTime() - Date.now()) / 1000;
      const units: [Intl.RelativeTimeFormatUnit, number][] = [['year', 31_536_000], ['month', 2_592_000], ['day', 86_400], ['hour', 3600], ['minute', 60], ['second', 1]];
      const [unit, size] = units.find(([, s]) => Math.abs(diff) >= s) ?? ['second', 1];
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(Math.round(diff / size), unit);
    }
    default: return fmt({ day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  }
}

function inline(text: string) {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '<b><i>$1</i></b>')
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/__(.+?)__/g, '<u>$1</u>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<i>$2</i>')
    .replace(/(^|[^\w])_(?!\s)(.+?)_(?!\w)/g, '$1<i>$2</i>')
    .replace(/~~(.+?)~~/g, '<s>$1</s>')
    .replace(/\|\|(.+?)\|\|/g, '<span class="dc-spoiler">$1</span>');
}

/** Discord markdown as HTML. Everything is escaped first; the pieces made here are kept aside and put back at the end. */
export function markdown(text: unknown, ctx: RenderContext) {
  const slots: string[] = [];
  const keep = (html: string) => `\u0000${slots.push(html) - 1}\u0000`;
  let src = String(text ?? '').replace(/\u0000/g, '');
  // Code first, so nothing inside it is formatted.
  src = src.replace(/```(?:([a-z0-9_+-]{1,20})\n)?([\s\S]*?)```/gi, (_, _lang, body: string) => keep(`<pre><code>${esc(body.replace(/^\n/, ''))}</code></pre>`));
  src = src.replace(/`([^`\n]+)`/g, (_, body: string) => keep(`<code>${esc(body)}</code>`));
  // Mentions, timestamps and custom emojis.
  src = src.replace(/<@!?(\d{15,22})>/g, (_, id: string) => keep(`<span class="dc-mention">@user-${esc(id.slice(-4))}</span>`));
  src = src.replace(/<@&(\d{15,22})>/g, (_, id: string) => keep(`<span class="dc-mention">@role-${esc(id.slice(-4))}</span>`));
  src = src.replace(/<#(\d{15,22})>/g, (_, id: string) => keep(`<span class="dc-mention">#channel-${esc(id.slice(-4))}</span>`));
  src = src.replace(/@(everyone|here)\b/g, (_, who: string) => keep(`<span class="dc-mention">@${who}</span>`));
  src = src.replace(/<t:(-?\d{1,13})(?::([tTdDfFR]))?>/g, (_, s: string, style: string) => keep(`<span class="dc-ts">${esc(formatTimestamp(s, style, ctx.locale))}</span>`));
  src = src.replace(/<(a?):([A-Za-z0-9_]{2,32}):(\d{15,22})>/g, (_, animated: string, name: string, id: string) => keep(`<img class="dc-emoji" alt=":${esc(name)}:" title=":${esc(name)}:" src="https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'webp'}?size=48">`));
  src = src.replace(/\[([^\]\n]{1,200})\]\((https?:\/\/[^\s)]+)\)/g, (_, label: string, url: string) => keep(`<a href="${esc(url)}" target="_blank" rel="noopener nofollow">${inline(esc(label))}</a>`));
  src = src.replace(/https?:\/\/[^\s<>()]+[^\s<>().,!?;:'"]/g, (url: string) => keep(`<a href="${esc(url)}" target="_blank" rel="noopener nofollow">${esc(url)}</a>`));

  const out: string[] = [];
  let quote: string[] = [];
  const flushQuote = () => { if (quote.length) { out.push(`<blockquote>${quote.join('<br>')}</blockquote>`); quote = []; } };
  for (const line of esc(src).split('\n')) {
    let m: RegExpExecArray | null;
    if ((m = /^&gt;\s?(.*)$/.exec(line))) { quote.push(inline(m[1])); continue; }
    flushQuote();
    if ((m = /^(#{1,3})\s+(.+)$/.exec(line))) out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`);
    else if ((m = /^-#\s+(.+)$/.exec(line))) out.push(`<span class="dc-sub">${inline(m[1])}</span>`);
    else if ((m = /^\s*[-*]\s+(.+)$/.exec(line))) out.push(`• ${inline(m[1])}`);
    else out.push(inline(line));
  }
  flushQuote();
  let html = out.join('\n').replace(/<\/(h\d|blockquote)>\n/g, '</$1>').replace(/\n(<h\d|<blockquote)/g, '$1');
  html = html.replace(/\u0000(\d+)\u0000/g, (_, n: string) => slots[Number(n)] ?? '');
  return html;
}

const colorOf = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) ? `#${Math.max(0, Math.min(0xffffff, Math.trunc(n))).toString(16).padStart(6, '0')}` : '');
const img = (cls: string, url: string) => `<img class="${cls}" src="${esc(url)}" alt="" loading="lazy" referrerpolicy="no-referrer">`;

export function renderEmbed(embed: any, ctx: RenderContext) {
  if (!embed || typeof embed !== 'object') return '';
  const parts: string[] = [];
  const thumb = safe(embed.thumbnail?.url);
  if (embed.author?.name) {
    const icon = safe(embed.author.icon_url);
    const url = safe(embed.author.url);
    const name = esc(embed.author.name);
    parts.push(`<div class="dc-e-author">${icon ? img('', icon) : ''}${url ? `<a href="${esc(url)}" target="_blank" rel="noopener nofollow">${name}</a>` : name}</div>`);
  }
  if (embed.title) {
    const url = safe(embed.url);
    parts.push(`<div class="dc-e-title">${url ? `<a href="${esc(url)}" target="_blank" rel="noopener nofollow">${markdown(embed.title, ctx)}</a>` : markdown(embed.title, ctx)}</div>`);
  }
  if (embed.description) parts.push(`<div class="dc-e-desc dc-text">${markdown(embed.description, ctx)}</div>`);
  if (Array.isArray(embed.fields) && embed.fields.length) {
    parts.push(`<div class="dc-e-fields">${embed.fields.map((f: any) => `<div class="dc-e-field${f?.inline ? ' inline' : ''}"><b>${markdown(f?.name, ctx)}</b><div class="dc-text">${markdown(f?.value, ctx)}</div></div>`).join('')}</div>`);
  }
  const image = safe(embed.image?.url);
  if (image) parts.push(img('dc-e-image', image));
  if (embed.footer?.text || embed.timestamp) {
    const icon = safe(embed.footer?.icon_url);
    const time = embed.timestamp ? new Date(embed.timestamp).getTime() : NaN;
    const when = Number.isNaN(time) ? '' : formatTimestamp(Math.floor(time / 1000), 'f', ctx.locale);
    const text = String(embed.footer?.text ?? '');
    parts.push(`<div class="dc-e-foot">${icon ? img('', icon) : ''}<span>${esc(text)}${text && when ? ' • ' : ''}${esc(when)}</span></div>`);
  }
  const color = colorOf(embed.color);
  return `<div class="dc-embed"${color ? ` style="border-left-color:${color}"` : ''}>${thumb ? img('dc-e-thumb', thumb) : ''}${parts.join('')}</div>`;
}

const emojiHtml = (emoji: unknown) => {
  const value = typeof emoji === 'object' && emoji ? ((emoji as any).id ? `<${(emoji as any).animated ? 'a' : ''}:${(emoji as any).name}:${(emoji as any).id}>` : (emoji as any).name) : emoji;
  const custom = /^<(a?):([A-Za-z0-9_]{2,32}):(\d{15,22})>$/.exec(String(value ?? ''));
  if (custom) return `<img class="dc-emoji" alt=":${esc(custom[2])}:" src="https://cdn.discordapp.com/emojis/${custom[3]}.${custom[1] ? 'gif' : 'webp'}?size=32">`;
  return esc(value ?? '');
};

const BUTTON_STYLE: Record<string, number> = { primary: 1, secondary: 2, success: 3, danger: 4, link: 5 };

/** Buttons and menus, drawn only: in the test nothing can be pressed. */
export function renderComponents(rows: any) {
  if (!Array.isArray(rows) || !rows.length) return '';
  const items = (row: any): any[] => (Array.isArray(row) ? row : Array.isArray(row?.items) ? row.items : Array.isArray(row?.components) ? row.components : []);
  return `<div class="dc-rows">${rows.map((row) => `<div class="dc-row">${items(row).map((item) => {
    if (item?.type === 'select' || Array.isArray(item?.options)) {
      const options = Array.isArray(item.options) ? item.options : [];
      return `<div class="dc-select" title="${esc(options.map((o: any) => o?.label).join(' · '))}"><span>${esc(item.placeholder || options[0]?.label || '…')}</span>${ICONS.caret}</div>`;
    }
    const style = typeof item?.style === 'number' ? item.style : BUTTON_STYLE[String(item?.style ?? '').toLowerCase()] ?? 2;
    const inner = `${item?.emoji ? `<span>${emojiHtml(item.emoji)}</span>` : ''}${item?.label ? `<span>${esc(item.label)}</span>` : ''}`;
    const link = item?.url || style === 5;
    return `<span class="dc-btn s${link ? 5 : Math.min(4, Math.max(1, style))}${item?.disabled ? ' off' : ''}">${inner}${link ? `<span class="dc-ext">${ICONS.link}</span>` : ''}</span>`;
  }).join('')}</div>`).join('')}</div>`;
}

export function renderReactions(reactions: unknown[]) {
  if (!Array.isArray(reactions) || !reactions.length) return '';
  return `<div class="dc-reacts">${reactions.map((emoji) => `<span class="dc-react">${emojiHtml(emoji)}<b>1</b></span>`).join('')}</div>`;
}

export interface PreviewTexts {
  onlyYou: string; dmTo: string; otherChannel: string; after: string; updated: string; deletedAfter: string;
  form: string; submit: string; cancel: string; usedButton: string; usedMenu: string; deleted: string; nothing: string;
  /** execCC: "Runs {name}" and "Runs {name} after {s} s". */
  execRuns?: string; execRunsAfter?: string;
}
export interface PreviewOptions {
  ctx: RenderContext;
  t: PreviewTexts;
  user: { name: string; avatar: string };
  bot: { name: string; avatar: string };
  /** What the person typed (a command), or the id of the button or menu used. */
  trigger: { mode: string; text: string };
  /** The prefix of the server, to show the commands that execCC runs as someone would type them. */
  prefix?: string;
}

interface Message { author: 'user' | 'bot'; content?: string; embed?: any; components?: any; reactions?: unknown[]; ephemeral?: boolean; notes?: string[]; deleted?: boolean; head?: string; dm?: boolean }

const fill = (text: string, vars: Record<string, unknown>) => text.replace(/\{(\w+)\}/g, (whole, name: string) => (name in vars ? String(vars[name]) : whole));

function renderMessage(msg: Message, o: PreviewOptions) {
  const who = msg.author === 'bot' ? o.bot : o.user;
  const time = new Intl.DateTimeFormat(o.ctx.locale, { hour: 'numeric', minute: '2-digit' }).format(new Date());
  const head = `<div class="dc-head"><span class="dc-name">${esc(who.name)}</span>${msg.author === 'bot' ? '<span class="dc-bot">BOT</span>' : ''}<span class="dc-time">${esc(time)}</span></div>`;
  const body = `${msg.content ? `<div class="dc-text">${markdown(msg.content, o.ctx)}</div>` : ''}${renderEmbed(msg.embed, o.ctx)}${renderComponents(msg.components)}${renderReactions(msg.reactions ?? [])}`;
  const ephemeral = msg.ephemeral ? `<div class="dc-ephemeral">${ICONS.eye}${esc(o.t.onlyYou)}</div>` : '';
  const notes = msg.notes?.length ? `<div class="dc-notes">${msg.notes.map((n) => `<span>${esc(n)}</span>`).join('')}</div>` : '';
  const top = msg.head ? `<div class="dc-reply">${ICONS.arrow}<span>${esc(msg.head)}</span></div>` : '';
  const inner = `${top}<img class="dc-av" src="${esc(who.avatar)}" alt="" loading="lazy" referrerpolicy="no-referrer"><div class="dc-body">${head}${body}${ephemeral}${notes}</div>`;
  if (msg.dm) return `<div class="dc-dm"><div class="dc-dm-label">${ICONS.mail}${esc(fill(o.t.dmTo, { name: o.user.name }))}</div><div class="dc-msg">${inner}</div></div>`;
  return `<div class="dc-msg${msg.ephemeral ? ' ephemeral' : ''}${msg.deleted ? ' deleted' : ''}">${inner}</div>`;
}

function renderModal(modal: any, o: PreviewOptions) {
  const fields = Array.isArray(modal?.fields) ? modal.fields : [];
  return `<div class="dc-modal" role="group" aria-label="${esc(o.t.form)}"><div class="dc-modal-title">${esc(modal?.title ?? o.t.form)}</div><div class="dc-modal-body">${fields.map((f: any) => `<div class="dc-modal-field"><span>${esc(f?.label ?? '')}${f?.required === false ? '' : ' <i>*</i>'}</span><div class="dc-modal-input${f?.style === 2 || f?.style === 'paragraph' ? ' tall' : ''}">${esc(f?.value ?? f?.placeholder ?? '')}</div></div>`).join('')}</div><div class="dc-modal-foot"><span>${esc(o.t.cancel)}</span><span class="go">${esc(o.t.submit)}</span></div></div>`;
}

/**
 * The test as a Discord channel: the message that started it, what the code printed, and every message, answer, direct
 * message and form of `effects`. Roles and the like are not drawn here: the list of what it would do says them.
 */
export function renderPreview(output: string, effects: any[], o: PreviewOptions) {
  const list = Array.isArray(effects) ? effects.filter((e) => e && typeof e === 'object') : [];
  const parts: string[] = [];
  const seconds = (n: unknown) => Math.max(0, Math.round(Number(n) || 0));
  // What started it: the message of the command (with the reactions the code adds), or a button or a menu used.
  if (o.trigger.mode === 'command') {
    const reactions = list.filter((e) => e.type === 'reaction').map((e) => e.emoji);
    const del = list.find((e) => e.type === 'deleteTrigger');
    const notes = del ? [del.delay ? fill(o.t.deletedAfter, { s: seconds(del.delay) }) : o.t.deleted] : [];
    parts.push(renderMessage({ author: 'user', content: o.trigger.text, reactions, notes, deleted: Boolean(del && !del.delay) }, o));
  } else {
    parts.push(`<div class="dc-sys">${ICONS.arrow}<span>${esc(fill(o.trigger.mode === 'select' ? o.t.usedMenu : o.t.usedButton, { name: o.user.name, id: o.trigger.text || '…' }))}</span></div>`);
  }
  const later = list.find((e) => e.type === 'deleteResponse');
  if (output.trim()) {
    parts.push(renderMessage({ author: 'bot', content: output, notes: later ? [fill(o.t.deletedAfter, { s: seconds(later.delay) })] : [] }, o));
  }
  for (const e of list) {
    const notes: string[] = [];
    if (e.delay && e.type !== 'deleteTrigger' && e.type !== 'deleteResponse') notes.push(fill(o.t.after, { s: seconds(e.delay) }));
    const base = { content: typeof e.content === 'string' ? e.content : e.content == null ? '' : String(e.content), embed: e.embed, components: e.components, notes };
    switch (e.type) {
      case 'message':
        if (e.channelId) notes.unshift(fill(o.t.otherChannel, { channel: `#channel-${String(e.channelId).slice(-4)}` }));
        parts.push(renderMessage({ author: 'bot', ...base, reactions: e.reactions }, o));
        break;
      case 'dm': parts.push(renderMessage({ author: 'bot', ...base, dm: true }, o)); break;
      case 'respond': parts.push(renderMessage({ author: 'bot', ...base, ephemeral: Boolean(e.ephemeral) }, o)); break;
      case 'update': parts.push(renderMessage({ author: 'bot', ...base, head: o.t.updated }, o)); break;
      case 'modal': parts.push(renderModal(e.modal ?? e, o)); break;
      case 'execCC': {
        // Another command with code runs after this one: a line in the channel, like a button that was used.
        const name = `${o.prefix ?? ''}${String(e.name ?? '').trim().replace(/^[^A-Za-z0-9_-]+/, '').toLowerCase() || '…'}`;
        const text = e.delay ? fill(o.t.execRunsAfter ?? 'Runs {name} after {s} s', { name, s: seconds(e.delay) }) : fill(o.t.execRuns ?? 'Runs {name}', { name });
        parts.push(`<div class="dc-sys">${ICONS.arrow}<span>${esc(text)}</span></div>`);
        break;
      }
      default: break;
    }
  }
  if (parts.length === 1 && o.trigger.mode !== 'command') parts.push(`<div class="dc-sys"><span>${esc(o.t.nothing)}</span></div>`);
  return `<div class="dc">${parts.join('')}</div>`;
}
