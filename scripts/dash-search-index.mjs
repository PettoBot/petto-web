// The index behind the dashboard finder (Ctrl+K) that lets it find a single SETTING, not only a page: for each page of a server's dashboard, the names
// of what is on it (fields, switches, sections). It is read from the pages themselves, so nobody writes it by hand: every text that goes through
// dt('...') in the markup of the page (and of the Dash component it shows) and looks like a name (short, not a sentence, not a button word) is one entry.
// The browser asks /dash/search-index.json for it in its language (the same dt keys, so a translated page is searched in its own words).
//
// Regenerate with:  npm run gen:search-index     (npm run check fails while src/data/dashSearchIndex.json is out of date)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = path.join(root, 'src', 'pages', 'dash', 'guild', '[id]');
const COMPONENTS = path.join(root, 'src', 'components');

// Components that every page carries or that hold the shared pieces: their texts are not settings of a page.
const SKIP_COMPONENTS = new Set(['DashGuildLayout', 'DashAcData', 'DashMotion', 'DashTemplateLock', 'DashStatTiles', 'DashSelectMenu', 'DashToast', 'DashClientI18n', 'DashChartTip', 'DashPreviews', 'DashPanelKit', 'DashFormKit', 'DashSettingsKit', 'DashLoader', 'DashReactWords', 'DashKeepPlace', 'DashBoardMock']);
// Words of a button or a state, not the name of a setting.
const GENERIC = new Set(['save', 'save changes', 'add', 'remove', 'delete', 'cancel', 'close', 'none', 'off', 'on', 'yes', 'no', 'edit', 'back', 'copy', 'open', 'reset', 'discard', 'enable', 'disable', 'enabled', 'disabled', 'more', 'less', 'new', 'saved', 'loading', 'send', 'test', 'confirm', 'apply', 'clear', 'search', 'name', 'value', 'status', 'type', 'details', 'preview', 'default', 'optional', 'learn more', 'show more', 'show less', 'select all', 'any', 'all', 'never', 'always', 'today', 'this week', 'all time', 'day', 'week', 'month', 'year', 'user', 'users', 'help']);
const MAX_LENGTH = 64;

const templateOf = (source) => {
  const parts = source.split(/^---\s*$/m);
  const body = parts.length >= 3 ? parts.slice(2).join('---') : source;
  return body.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
};

const DT = /\bdth?\(\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")\s*[,)]/g;
const labelsOf = (source) => {
  const found = new Set();
  for (const match of templateOf(source).matchAll(DT)) {
    const label = (match[1] ?? match[2]).replace(/\\(['"\\])/g, '$1').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (label.length < 3 || label.length > MAX_LENGTH) continue;
    if (/[.!?…]$/.test(label) || label.includes('...') || /\{[a-z_.]+\}/i.test(label)) continue; // a sentence, a placeholder or a hint
    if (GENERIC.has(label.toLowerCase())) continue;
    if (!/^[\p{L}]/u.test(label)) continue; // starts with a number or a symbol: a value or a decoration, not a name
    found.add(label);
  }
  return found;
};

export function buildIndex() {
  const pages = {};
  for (const file of fs.readdirSync(PAGES).filter((name) => name.endsWith('.astro')).sort()) {
    const slug = file.replace(/\.astro$/, '');
    const source = fs.readFileSync(path.join(PAGES, file), 'utf8');
    const labels = new Set(labelsOf(source));
    for (const match of source.matchAll(/import\s+(\w+)\s+from\s+'([^']*\/components\/([^']+)\.astro)'/g)) {
      const [, name, , rel] = match;
      if (SKIP_COMPONENTS.has(name) || !new RegExp(`<${name}[\\s/>]`).test(source)) continue;
      const component = path.join(COMPONENTS, `${rel}.astro`);
      if (!fs.existsSync(component)) continue;
      for (const label of labelsOf(fs.readFileSync(component, 'utf8'))) labels.add(label);
    }
    if (labels.size) pages[slug] = [...labels].sort((a, b) => a.localeCompare(b));
  }
  return { pages };
}

export const INDEX_FILE = path.join(root, 'src', 'data', 'dashSearchIndex.json');
export const serialize = (index) => `${JSON.stringify(index, null, 1)}\n`;

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const index = buildIndex();
  fs.writeFileSync(INDEX_FILE, serialize(index));
  console.log(`Wrote ${Object.keys(index.pages).length} pages and ${Object.values(index.pages).reduce((n, list) => n + list.length, 0)} names to src/data/dashSearchIndex.json`);
}
