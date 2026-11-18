// A small, safe reader of the markdown the AI helper writes: **bold**, *italic*, `code`, ``` blocks, # titles and - / 1. lists. It does not make HTML: it gives a list of
// blocks that the page turns into elements with textContent, so nothing the AI (or the person) wrote can ever become markup.
// Underscores are never read as formatting: Petto's variables are full of them ({server_name}).

export type Inline = { t: 'text' | 'bold' | 'italic' | 'code'; v: string };
export type Block =
  | { t: 'p'; inline: Inline[] }
  | { t: 'h'; inline: Inline[] }
  | { t: 'list'; ordered: boolean; start: number; level: 0 | 1; items: Inline[][] }
  | { t: 'code'; v: string };

// `code` first, so what is inside it is never read; then **bold**, then *italic* (the star must touch the text: "2 * 3" is not italic).
const INLINE = /`([^`\n]+)`|\*\*([^*\n]+?)\*\*|\*([^*\s](?:[^*\n]*[^*\s])?)\*/g;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const at = match.index ?? 0;
    if (at > last) out.push({ t: 'text', v: text.slice(last, at) });
    if (match[1] !== undefined) out.push({ t: 'code', v: match[1] });
    else if (match[2] !== undefined) out.push({ t: 'bold', v: match[2] });
    else out.push({ t: 'italic', v: match[3] });
    last = at + match[0].length;
  }
  if (last < text.length) out.push({ t: 'text', v: text.slice(last) });
  return out;
}

const HEADING = /^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$/;
const BULLET = /^(\s*)[-*•]\s+(.*)$/;
const ORDERED = /^(\s*)(\d{1,3})[.)]\s+(.*)$/;

/** The text of an answer as blocks. Whatever is between ``` fences is a code block (an unclosed fence runs to the end). */
export function parseMarkdown(answer: string): Block[] {
  const blocks: Block[] = [];
  answer.replace(/\r\n/g, '\n').split(/```[^\n]*\n?/).forEach((part, index) => {
    if (index % 2 === 1) {
      const code = part.replace(/^\n+|\n+$/g, '');
      if (code) blocks.push({ t: 'code', v: code });
      return;
    }
    let paragraph: string[] = [];
    const flush = () => { if (paragraph.length) blocks.push({ t: 'p', inline: parseInline(paragraph.join('\n')) }); paragraph = []; };
    for (const line of part.split('\n')) {
      if (!line.trim()) { flush(); continue; }
      const heading = HEADING.exec(line);
      const ordered = ORDERED.exec(line);
      const bullet = ordered ? null : BULLET.exec(line);
      if (heading) { flush(); blocks.push({ t: 'h', inline: parseInline(heading[1]) }); continue; }
      if (ordered || bullet) {
        flush();
        const isOrdered = Boolean(ordered);
        const indent = (ordered ? ordered[1] : bullet![1]).length;
        const level: 0 | 1 = indent >= 2 ? 1 : 0;
        const item = parseInline(ordered ? ordered[3] : bullet![2]);
        const before = blocks[blocks.length - 1];
        if (before && before.t === 'list' && before.ordered === isOrdered && before.level === level) before.items.push(item);
        else blocks.push({ t: 'list', ordered: isOrdered, start: ordered ? Number(ordered[2]) : 1, level, items: [item] });
        continue;
      }
      paragraph.push(line);
    }
    flush();
  });
  return blocks;
}
