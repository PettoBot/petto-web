// Every Phosphor icon the site uses must be in the list of icons of astro.config.mjs: an icon that is not there makes the page
// that draws it fail at render time (the whole dashboard did once), and neither the build nor the type check notices.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const config = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
const start = config.indexOf('ph: [');
const listed = new Set([...config.slice(start, config.indexOf(']', start)).matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]));

const used = new Map();
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) { walk(path); continue; }
    if (!/\.(astro|ts|tsx|js|mjs)$/.test(name)) continue;
    for (const match of readFileSync(path, 'utf8').matchAll(/ph:([a-z0-9-]+)/g)) if (!used.has(match[1])) used.set(match[1], path.slice(root.length + 1));
  }
}
walk(join(root, 'src'));

const missing = [...used].filter(([name]) => !listed.has(name));
if (missing.length) {
  console.error(`These icons are used but not in the list of astro.config.mjs:\n${missing.map(([name, file]) => `  ph:${name} (${file})`).join('\n')}`);
  process.exit(1);
}
console.log(`Checked the icons: ${used.size} used, all in the list.`);
