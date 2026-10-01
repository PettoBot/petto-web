import { emptyEmbed, validateTemplate, type TemplateData, type EmbedData } from './embedSchema';

// The one-line message code used by several Discord bots: `{embed}$v{title: Hello}$v{description: ...}`.
// Text before `{embed}` is the message content, each `{key: value}` block sets one part of the embed, the
// blocks are joined by `&v` (Petto writes it) or `$v` (other bots write it, both are read), and a block that
// holds several values separates them with `&&`.
//
//   {title: text}               {url: https://...}            {description: text}
//   {color: #8399ff}            {thumbnail: https://...}      {image: https://...}
//   {author: name && icon && url}   {footer: text && icon}    {timestamp}
//   {field: name && value}  or  {field: name && value && inline}
//   {button: link && label && url}  (link buttons only)       {message: text}  (same as text before {embed})
//
// The code is written as one line with the blocks glued together: line breaks in a text are written {newline},
// which the bot turns back into a line break, and the message text is written as {message: ...} so that nothing
// stays outside the blocks. Real line breaks and text before {embed} are still read.

export interface ScriptParse {
  data: TemplateData;
  /** Things in the code that could not be used, in plain words. Empty when everything was read. */
  warnings: string[];
}

const SEPARATORS = ['&v', '$v'];
export type Separator = '&v' | '$v';

/** Splits the code into its top-level `{...}` blocks and the loose text between them. Braces inside a block nest. */
type Item = { block: false; value: string } | { block: true; value: string };

function tokenize(code: string): { items: Item[]; error: string | null } {
  const items: Item[] = [];
  let text = '';
  let depth = 0;
  let current = '';
  const flush = () => { if (text) items.push({ block: false, value: text }); text = ''; };
  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    if (depth === 0) {
      const separator = SEPARATORS.find((candidate) => code.startsWith(candidate, i));
      if (separator) { flush(); i += separator.length - 1; continue; }
      if (char === '{') { flush(); depth = 1; current = ''; continue; }
      if (char === '}') return { items, error: 'There is a closing brace } with no opening one.' };
      text += char;
      continue;
    }
    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) { items.push({ block: true, value: current }); current = ''; continue; }
    }
    current += char;
  }
  flush();
  if (depth !== 0) return { items, error: 'A block is not closed: there is an opening brace { with no closing one.' };
  return { items, error: null };
}

// Blocks that are variables of the bot, such as {user.mention} or {choose:a|b}, stay in the text.
const KNOWN_KEYS = new Set(['embed', 'content', 'message', 'text', 'title', 'url', 'description', 'desc', 'thumbnail', 'image', 'timestamp', 'color', 'colour', 'author', 'footer', 'field', 'button']);
const isTypo = (key: string) => /^[a-z]+$/.test(key) && !['choose', 'range', 'args', 'user', 'server', 'guild', 'channel', 'role', 'newline', 'prefix', 'reactreply', 'level', 'date', 'time'].includes(key);

const NEWLINE = /\{newline\}/gi;
/** {newline} is a line break for the editor, and it is written back as {newline} by toEmbedScript. */
const fromScript = (value: string) => value.replace(NEWLINE, '\n');
const toScript = (value: string) => value.replace(/\r\n|\r|\n/g, '{newline}');
const parts = (value: string) => value.split('&&').map((part) => part.trim());

function parseColor(value: string): number | null {
  const text = value.trim().replace(/^#/, '');
  if (/^[0-9a-f]{6}$/i.test(text)) return parseInt(text, 16);
  if (/^[0-9a-f]{3}$/i.test(text)) return parseInt(text.split('').map((c) => c + c).join(''), 16);
  if (/^\d{1,8}$/.test(text)) { const number = Number(text); return number <= 0xffffff ? number : null; }
  return null;
}

/** Reads a message code. It never throws: what cannot be read is left out and reported in `warnings`. */
export function parseEmbedScript(code: string): ScriptParse {
  const warnings: string[] = [];
  const embed: EmbedData = { ...emptyEmbed(), color: null };
  let content: string;
  let hasEmbed = false;
  const buttons: { label: string; url: string; emoji: string; disabled: boolean }[] = [];

  const tokens = tokenize(code.trim());
  if (tokens.error) warnings.push(tokens.error);
  let loose = '';

  for (const item of tokens.items) {
    if (!item.block) { loose += item.value; continue; }
    const block = item.value;
    const colon = block.indexOf(':');
    const key = (colon === -1 ? block : block.slice(0, colon)).trim().toLowerCase();
    const value = colon === -1 ? '' : block.slice(colon + 1).trim();
    if (!KNOWN_KEYS.has(key) && !(colon !== -1 && isTypo(key))) { loose += `{${block}}`; continue; }
    switch (key) {
      case 'embed': hasEmbed = true; break;
      case 'content': case 'message': case 'text': loose += fromScript(value); break;
      case 'title': hasEmbed = true; embed.title = fromScript(value); break;
      case 'url': hasEmbed = true; embed.url = value; break;
      case 'description': case 'desc': hasEmbed = true; embed.description = fromScript(value); break;
      case 'thumbnail': hasEmbed = true; embed.thumbnail = value; break;
      case 'image': hasEmbed = true; embed.image = value; break;
      case 'timestamp': hasEmbed = true; embed.timestamp = value === '' || !/^(false|no|0)$/i.test(value); break;
      case 'color': case 'colour': {
        hasEmbed = true;
        const color = parseColor(value);
        if (color === null) warnings.push(`The color "${value}" is not a hex color such as #8399ff.`);
        else embed.color = color;
        break;
      }
      case 'author': {
        hasEmbed = true;
        const [name, icon, url] = parts(value);
        embed.author = { name: fromScript(name ?? ''), icon: icon ?? '', url: url ?? '' };
        break;
      }
      case 'footer': {
        hasEmbed = true;
        const [text, icon] = parts(value);
        embed.footer = { text: fromScript(text ?? ''), icon: icon ?? '' };
        break;
      }
      case 'field': {
        hasEmbed = true;
        const [name, fieldValue, inline] = parts(value);
        if (!name || !fieldValue) { warnings.push('A field needs a name and a value: {field: name && value && inline}.'); break; }
        embed.fields.push({ name: fromScript(name), value: fromScript(fieldValue), inline: /^(true|yes|inline|1)$/i.test(inline ?? '') });
        break;
      }
      case 'button': {
        // {button: link && label && url}, or just {button: label && url}. Only link buttons can be saved.
        let [first, ...rest] = parts(value);
        const kind = first?.toLowerCase();
        if (['link', 'blurple', 'green', 'grey', 'gray', 'red', 'primary', 'success', 'secondary', 'danger'].includes(kind ?? '')) {
          if (kind !== 'link') warnings.push(`Only link buttons can be saved, the ${kind} button was turned into a link button.`);
        } else {
          rest = [first ?? '', ...rest];
        }
        const disabled = rest.length > 2 && /^disabled$/i.test(rest[rest.length - 1] ?? '');
        const [label, url] = rest;
        if (!label || !url) { warnings.push('A button needs a label and a link: {button: link && label && https://...}.'); break; }
        buttons.push({ label, url, emoji: '', disabled });
        break;
      }
      default:
        warnings.push(`The block {${key}} is not supported and was ignored.`);
    }
  }

  content = fromScript(loose).trim();
  const data: TemplateData = {
    content,
    embeds: hasEmbed ? [embed] : [],
    buttons: buttons.length ? [buttons.slice(0, 5)] : [],
  };
  if (buttons.length > 5) warnings.push('Only the first 5 buttons fit in one row.');
  return { data, warnings };
}

const hex = (color: number) => `#${color.toString(16).padStart(6, '0')}`;

/**
 * Writes a message as a one-line code with the blocks glued together. Line breaks become {newline}, and the message
 * text goes in a {message: ...} block, because text left outside the blocks would not be read by every bot.
 * Only the first embed fits, the rest are left out.
 */
export function toEmbedScript(raw: TemplateData, separator: Separator = '&v'): string {
  const checked = validateTemplate(raw);
  const data = checked.ok ? checked.data : raw;
  const blocks: string[] = [];
  if (data.content) blocks.push(`{message: ${toScript(data.content)}}`);
  const embed = data.embeds[0];
  if (embed) {
    blocks.push('{embed}');
    if (embed.title) blocks.push(`{title: ${toScript(embed.title)}}`);
    if (embed.url) blocks.push(`{url: ${embed.url}}`);
    if (embed.description) blocks.push(`{description: ${toScript(embed.description)}}`);
    if (embed.color !== null && embed.color !== undefined) blocks.push(`{color: ${hex(embed.color)}}`);
    if (embed.thumbnail) blocks.push(`{thumbnail: ${embed.thumbnail}}`);
    if (embed.image) blocks.push(`{image: ${embed.image}}`);
    if (embed.author.name) blocks.push(`{author: ${[toScript(embed.author.name), embed.author.icon, embed.author.url].filter((p, i, all) => p || all.slice(i + 1).some(Boolean)).join(' && ')}}`);
    if (embed.footer.text) blocks.push(`{footer: ${[toScript(embed.footer.text), embed.footer.icon].filter((p, i, all) => p || all.slice(i + 1).some(Boolean)).join(' && ')}}`);
    for (const field of embed.fields) blocks.push(`{field: ${toScript(field.name)} && ${toScript(field.value)}${field.inline ? ' && inline' : ''}}`);
    if (embed.timestamp) blocks.push('{timestamp}');
  }
  for (const row of data.buttons) for (const button of row) if (button.label && button.url) blocks.push(`{button: link && ${button.label} && ${button.url}${button.disabled ? ' && disabled' : ''}}`);
  return blocks.join(separator);
}
