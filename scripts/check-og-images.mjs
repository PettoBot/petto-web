// Makes sure every page that shares a picture of its own (src/data/pageImages.mjs) has it: a PNG of 1200x500 that is not heavy, drawn
// from a banner that exists. `node scripts/make-og-images.mjs` makes them.
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGE_IMAGES, pageImage, pageImagePath } from '../src/data/pageImages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAX_BYTES = 400 * 1024;
const problems = [];
let checked = 0;

for (const [page, image] of Object.entries(PAGE_IMAGES)) {
  checked += 1;
  const file = path.join(root, 'public', pageImagePath(image));
  const source = path.join(root, 'public', image.source);
  if (!existsSync(source)) problems.push(`${page}: the banner ${image.source} does not exist`);
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
if (pageImage('/') !== null || pageImage('/commands') !== null) problems.push('a page without its own picture must keep the default one');

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`${checked} page pictures checked, 0 failed`);
