// Makes sure every page that shares a picture of its own (src/data/pageImages.mjs) has it: a PNG of 1200x500 that is not heavy, drawn
// from a banner that exists. `node scripts/make-og-images.mjs` makes them.
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGE_IMAGES, TITLE_PAGES, pageImage, pageImagePath, titleCardName } from '../src/data/pageImages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAX_BYTES = 400 * 1024;
const problems = [];
let checked = 0;

// A page with a banner is checked with its banner; a title page is checked in the three languages (it has no banner).
const everything = Object.entries(PAGE_IMAGES).map(([page, image]) => [page, image]);
for (const [page, found] of Object.entries(TITLE_PAGES)) {
  for (const lang of ['en', 'es', 'pt-BR']) everything.push([`${page} (${lang})`, { name: titleCardName(found.slug, lang), source: '', alt: found.title[lang] }]);
}
for (const [page, image] of everything) {
  checked += 1;
  const file = path.join(root, 'public', pageImagePath(image));
  const source = path.join(root, 'public', image.source);
  if (image.source && !existsSync(source)) problems.push(`${page}: the banner ${image.source} does not exist`);
  if (!existsSync(file)) { problems.push(`${page}: ${pageImagePath(image)} is missing (run node scripts/make-og-images.mjs)`); continue; }
  const bytes = readFileSync(file);
  const isPng = bytes.length > 24 && bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';
  if (!isPng) { problems.push(`${page}: ${pageImagePath(image)} is not a PNG`); continue; }
  const width = bytes.readUInt32BE(16); const height = bytes.readUInt32BE(20);
  if (width !== 1200 || height !== 500) problems.push(`${page}: ${pageImagePath(image)} is ${width}x${height}, it must be 1200x500`);
  if (statSync(file).size > MAX_BYTES) problems.push(`${page}: ${pageImagePath(image)} is over ${MAX_BYTES / 1024} KB`);
  if (!image.alt.trim()) problems.push(`${page}: no alt text`);
}
// The language prefixes and the final slash find the same picture.
for (const [a, b] of [['/blog/online-without-the-dot', '/es/blog/online-without-the-dot/'], ['/codegen', '/pt-br/codegen']]) {
  if (pageImage(a)?.name !== pageImage(b)?.name || !pageImage(a)) problems.push(`${b} does not find the picture of ${a}`);
}
if (pageImage('/') !== null || pageImage('/dash') !== null) problems.push('the home and the dashboard must keep the default picture');
if (pageImage('/es/commands/')?.name !== 'commands-es' && pageImage('/es/commands/')?.name !== 't-commands-es') problems.push('a title page does not find its card in Spanish');
if (pageImage('/changelog/0.7.7')?.name !== 't-changelog-en' || pageImage('/feedback/12')?.name !== 't-feedback-en') problems.push('a page under a title page must use its card');

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`${checked} page pictures checked, 0 failed`);
