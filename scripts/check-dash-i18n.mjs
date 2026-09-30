import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../src/', import.meta.url).pathname;
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

const catalog = (name) => {
  const src = readFileSync(join(root, 'i18n', name), 'utf8');
  const keys = new Set();
  for (const m of src.matchAll(/^\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'):/gm)) keys.add(JSON.parse(m[1].startsWith("'") ? `"${m[1].slice(1, -1).replace(/"/g, '\\"')}"` : m[1]));
  return keys;
};

const es = catalog('dash-es.ts');
const pt = catalog('dash-pt.ts');
const used = new Map();
const re = /\b(?:dth?|cdt)\(\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`([^`$]*)`)/g;

const reactRe = /\bt\(\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g;
for (const file of walk(root).filter((f) => /\.(astro|ts|tsx)$/.test(f) && !f.includes('/i18n/'))) {
  const src = readFileSync(file, 'utf8');
  const pattern = file.includes('/react/embeds/') ? reactRe : re;
  for (const m of src.matchAll(pattern)) {
    const raw = m[1] ?? m[2] ?? m[3];
    const key = raw.replace(/\\(['"\\])/g, '$1').replace(/\\n/g, '\n');
    if (!used.has(key)) used.set(key, file.replace(root, 'src/'));
  }
}

const literal = (key) => /^!|\||^Discloud|^\{option\}/.test(key);
let missing = 0;
for (const [key, file] of used) {
  if (literal(key)) continue;
  for (const [lang, set] of [['es', es], ['pt', pt]]) {
    if (!set.has(key)) { console.log(`missing ${lang}: ${JSON.stringify(key)} (${file})`); missing++; }
  }
}
console.log(`${used.size} keys used, ${missing} missing`);
process.exit(missing ? 1 : 0);
