// Finds dashboard text that is not translated: words written straight into the markup of the dashboard's components (not through dt()),
// in text between tags and in the placeholder, title, aria-label and alt attributes, and in the React editors outside their t().
// check-dash-i18n.mjs checks that every dt('...') key has es and pt; this one finds the text that never reaches dt() at all.
// It is a heuristic: it reports, it does not fail the build (exit code 0), unless --strict is given.
// Run: node scripts/check-dash-hardcoded.mjs [--strict] [--list]
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const root = new URL('../src/', import.meta.url).pathname;
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const strict = process.argv.includes('--strict');
const list = process.argv.includes('--list');

// The dashboard's components: every Dash*.astro and the helpers its pages use. The public site has its own copy objects per language.
const DASH_HELPERS = new Set(['MultiSelect.astro', 'MultiSelectOptions.astro', 'EmojiPicker.astro', 'VariableHelp.astro', 'ColorPicker.astro', 'SkeletonBlocks.astro', 'PremiumGate.astro', 'PremiumPlanCard.astro', 'PartnerIcon.astro', 'TicketLive.astro', 'TicketFieldsBuilder.astro', 'TicketPanelPreview.astro', 'TicketGuide.astro', 'TicketEmoji.astro', 'SelectSource.astro', 'SelectChosen.astro', 'LiveTextPreview.astro', 'UserChip.astro', 'MemberPick.astro', 'ChannelOptions.astro']);
// Words that are the same in every language (names, units, code) are not reported.
const SAME = /^(?:Petto|Premium|Discord|Polar|Discloud|Imgur|GitHub|YouTube|Twitch|Spotify|Last\.fm|VoiceMaster|Starboard|Monkeyboard|AutoMod|Webhook|Webhooks|Embed|Embeds|ID|URL|JSON|YAML|SSE|API|OK|Ctrl\s?[A-Z]|Esc|Enter|Tab|UTC|GMT[-+]?\d*|APP|BOT|\$?[\d.,]+%?|[A-Z]{1,4}|v\d[\w.]*)$/;

function stripAstro(src) {
  let s = src.replace(/^---[\s\S]*?\n---/, '');
  s = s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  // Expressions in braces (balanced) are code, not text.
  let out = '';
  let depth = 0;
  for (const ch of s) {
    if (ch === '{') { depth += 1; out += ' '; continue; }
    if (ch === '}') { depth = Math.max(0, depth - 1); out += ' '; continue; }
    out += depth ? (ch === '\n' ? '\n' : ' ') : ch;
  }
  return out;
}
const looksEnglish = (text) => {
  const t = text.replace(/&[a-z]+;|&#\d+;/g, ' ').replace(/\s+/g, ' ').trim();
  if (!t || SAME.test(t)) return false;
  // Addresses, channel names, commands, colors, ids and example values are the same in every language.
  if (/^(?:https?:\/\/|www\.|#|!|\/|<|\{|@|:)/.test(t) || /^[\w.-]+(?:[-_][\w.-]+)+$/.test(t)) return false;
  // Code that a crude parse of JSX took for text.
  if (/[=;(){}]|=>|\?\.|&&|\|\|/.test(t)) return false;
  return /[A-Za-z]{2,}/.test(t) && !/^[\W\d_]+$/.test(t);
};
const lineOf = (src, index) => src.slice(0, index).split('\n').length;

const findings = [];
for (const file of walk(root)) {
  const name = basename(file);
  const rel = file.replace(root, 'src/');
  if (rel.includes('/pages/previewtmp/') || rel.includes('/i18n/')) continue;
  if (file.endsWith('.astro') && (name.startsWith('Dash') || DASH_HELPERS.has(name))) {
    const src = readFileSync(file, 'utf8');
    const body = stripAstro(src);
    for (const m of body.matchAll(/>([^<>]+)</g)) {
      if (looksEnglish(m[1])) findings.push({ file: rel, line: lineOf(body, m.index), kind: 'text', text: m[1].replace(/\s+/g, ' ').trim() });
    }
    for (const m of body.matchAll(/\s(placeholder|title|aria-label|alt|data-placeholder|data-empty)="([^"]*)"/g)) {
      if (looksEnglish(m[2])) findings.push({ file: rel, line: lineOf(body, m.index), kind: m[1], text: m[2] });
    }
  } else if (/\/react\/.*\.tsx$/.test(file)) {
    const src = readFileSync(file, 'utf8');
    // JSX text between tags that is not an expression, and literal attributes.
    const body = src.replace(/\{[^{}]*\}/g, (x) => ' '.repeat(x.length));
    for (const m of body.matchAll(/>\s*([A-Za-z][^<>{}]*?)\s*</g)) {
      if (looksEnglish(m[1]) && /\s/.test(m[1].trim())) findings.push({ file: rel, line: lineOf(body, m.index), kind: 'jsx', text: m[1].trim() });
    }
    for (const m of src.matchAll(/\s(placeholder|title|aria-label|alt)="([^"]*)"/g)) {
      if (looksEnglish(m[2])) findings.push({ file: rel, line: lineOf(src, m.index), kind: m[1], text: m[2] });
    }
  }
}

// Strings that browser scripts translate with cdt('...') must be sent to the browser by DashClientI18n.astro, or they stay in English.
const clientSrc = readFileSync(join(root, 'components', 'DashClientI18n.astro'), 'utf8');
const clientKeys = new Set([...clientSrc.slice(clientSrc.indexOf('CLIENT_KEYS'), clientSrc.indexOf('];')).matchAll(/^\s*(['"])((?:\\.|(?!\1).)*)\1,?\s*$/gm)].map((m) => m[2].replace(/\\(['"\\])/g, '$1')));
for (const file of walk(root)) {
  if (!/\.(astro|ts|tsx|js|mjs)$/.test(file) || file.includes('/i18n/') || file.includes('/previewtmp/')) continue;
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/\bcdt\(\s*(['"])((?:\\.|(?!\1).)*)\1/g)) {
    const key = m[2].replace(/\\(['"\\])/g, '$1');
    if (!clientKeys.has(key)) findings.push({ file: file.replace(root, 'src/'), line: lineOf(src, m.index), kind: 'cdt not sent', text: key });
  }
}

const byFile = new Map();
for (const f of findings) byFile.set(f.file, (byFile.get(f.file) ?? 0) + 1);
if (list) for (const f of findings) console.log(`${f.file}:${f.line} [${f.kind}] ${JSON.stringify(f.text).slice(0, 120)}`);
else for (const [file, n] of [...byFile].sort((a, b) => b[1] - a[1])) console.log(`${String(n).padStart(4)}  ${file}`);
console.log(`${findings.length} possible untranslated texts in ${byFile.size} files${list ? '' : ' (--list shows each one)'}`);
process.exit(strict && findings.length ? 1 : 0);
