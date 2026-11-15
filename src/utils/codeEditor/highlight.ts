// Colors Petto Code for the editor of commands in code. It follows the lexer of the engine: text outside {{ }} is plain,
// and inside an action there are strings, numbers, keywords, functions, fields and variables. Ported from the Petto Code
// Generator. Everything is escaped, so the code can never add HTML to the page.

const KEYWORDS = new Set(['if', 'else', 'end', 'range', 'with', 'define', 'template', 'break', 'continue', 'return', 'true', 'false', 'nil']);
export const esc = (text: unknown) => String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const span = (cls: string, text: string) => `<span class="tk-${cls}">${esc(text)}</span>`;

function action(body: string, functions: Set<string>) {
  let out = '';
  let i = 0;
  while (i < body.length) {
    const rest = body.slice(i);
    let m: RegExpExecArray | string[] | null;
    if ((m = /^\s+/.exec(rest))) out += esc(m[0]);
    else if ((m = /^"(?:[^"\\]|\\.)*"?/.exec(rest))) out += span('s', m[0]);
    else if ((m = /^`[^`]*`?/.exec(rest))) out += span('s', m[0]);
    else if ((m = /^-?\d+(?:\.\d+)?/.exec(rest))) out += span('n', m[0]);
    else if ((m = /^\$[A-Za-z0-9_]*/.exec(rest))) out += span('v', m[0]);
    else if ((m = /^\.[A-Za-z_][A-Za-z0-9_]*/.exec(rest))) out += span('d', m[0]);
    else if ((m = /^[A-Za-z_][A-Za-z0-9_]*/.exec(rest))) out += KEYWORDS.has(m[0]) ? span('k', m[0]) : functions.has(m[0]) ? span('f', m[0]) : span('u', m[0]);
    else { m = [rest[0]]; out += esc(m[0]); }
    i += m[0].length;
  }
  return out;
}

/** The code as HTML with colors. Works on code that is not finished, as it is while someone types. */
export function highlight(source: string, functions: Set<string>) {
  const text = String(source ?? '');
  let out = '';
  let i = 0;
  while (i < text.length) {
    const open = text.indexOf('{{', i);
    if (open === -1) { out += span('t', text.slice(i)); break; }
    if (open > i) out += span('t', text.slice(i, open));
    const commentAt = /^\{\{-?\s*\/\*/.exec(text.slice(open));
    if (commentAt) {
      const end = text.indexOf('*/', open + commentAt[0].length);
      const close = end === -1 ? -1 : text.indexOf('}}', end);
      const stop = close === -1 ? text.length : close + 2;
      out += span('c', text.slice(open, stop));
      i = stop;
      continue;
    }
    // Find the }} that closes the action, skipping the ones inside strings.
    let close = -1;
    let quote: string | null = null;
    for (let j = open + 2; j < text.length; j += 1) {
      const char = text[j];
      if (quote) { if (char === '\\' && quote !== '`') j += 1; else if (char === quote) quote = null; }
      else if (char === '"' || char === '`') quote = char;
      else if (char === '}' && text[j + 1] === '}') { close = j; break; }
    }
    const bodyEnd = close === -1 ? text.length : close;
    let start = open + 2;
    let pre = '{{';
    if (text[start] === '-' && /\s/.test(text[start + 1] ?? '')) { pre += '-'; start += 1; }
    let body = text.slice(start, bodyEnd);
    let post = close === -1 ? '' : '}}';
    if (close !== -1 && body.length > 1 && body.endsWith('-') && /\s/.test(body[body.length - 2])) { body = body.slice(0, -1); post = '-}}'; }
    out += span('b', pre) + action(body, functions) + (post ? span('b', post) : '');
    i = close === -1 ? text.length : close + 2;
  }
  return out;
}

/**
 * Where the caret is, for the suggestions: inside an action ({{ ... }}, not in a string or a comment), and the word being
 * written there. `kind` is 'data' for a path after a dot (.User.Na), 'word' for a function or a keyword, or null.
 */
export function caretContext(text: string, caret: number): { kind: 'data' | 'word'; start: number; parent: string; partial: string } | null {
  const before = text.slice(0, caret);
  const open = before.lastIndexOf('{{');
  if (open === -1) return null;
  const inside = before.slice(open + 2);
  if (/^-?\s*\/\*/.test(inside)) return null;
  // A }} after the {{ closes the action (one inside a string does not).
  let quote: string | null = null;
  for (let j = 0; j < inside.length; j += 1) {
    const char = inside[j];
    if (quote) { if (char === '\\' && quote !== '`') j += 1; else if (char === quote) quote = null; }
    else if (char === '"' || char === '`') quote = char;
    else if (char === '}' && inside[j + 1] === '}') return null;
  }
  if (quote) return null;
  const path = /(^|[\s(|=])\.((?:[A-Za-z_][A-Za-z0-9_]*\.)*)([A-Za-z_][A-Za-z0-9_]*)?$/.exec(inside);
  if (path) {
    const parent = path[2].replace(/\.$/, '');
    const partial = path[3] ?? '';
    return { kind: 'data', start: caret - partial.length, parent, partial };
  }
  const word = /(^|[\s(|=-])([A-Za-z_][A-Za-z0-9_]*)$/.exec(inside);
  if (word && !/^\d/.test(word[2])) return { kind: 'word', start: caret - word[2].length, parent: '', partial: word[2] };
  return null;
}
