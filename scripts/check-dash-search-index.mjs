// The finder of the dashboard (Ctrl+K) searches settings through src/data/dashSearchIndex.json, made by scripts/dash-search-index.mjs from the texts
// of the pages. This fails when the file is out of date (a page changed its texts: run `npm run gen:search-index`) and checks its shape.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { buildIndex, serialize, INDEX_FILE } from './dash-search-index.mjs';

const fresh = serialize(buildIndex());
const saved = fs.existsSync(INDEX_FILE) ? fs.readFileSync(INDEX_FILE, 'utf8') : '';
assert.equal(saved, fresh, 'src/data/dashSearchIndex.json is out of date: run npm run gen:search-index and commit it');

const { pages } = JSON.parse(saved);
const slugs = Object.keys(pages);
assert.ok(slugs.length >= 30, `the index covers the pages of the dashboard (${slugs.length})`);
for (const slug of slugs) {
  assert.ok(fs.existsSync(path.join('src', 'pages', 'dash', 'guild', '[id]', `${slug}.astro`)), `${slug} is a page of the dashboard`);
  assert.ok(Array.isArray(pages[slug]) && pages[slug].length > 0, `${slug} has names`);
  for (const label of pages[slug]) assert.ok(label.length >= 3 && label.length <= 64 && !/[.!?…]$/.test(label), `${slug}: "${label}" is a name, not a sentence`);
}
// The route that serves it and the finder that reads it.
assert.ok(fs.existsSync('src/pages/dash/search-index.json.ts'), 'the route /dash/search-index.json exists');
assert.match(fs.readFileSync('src/components/DashGuildLayout.astro', 'utf8'), /\/dash\/search-index\.json/, 'the finder of the dashboard reads the index');
console.log(`check-dash-search-index: ${slugs.length} pages, ${Object.values(pages).reduce((n, list) => n + list.length, 0)} names, up to date`);
