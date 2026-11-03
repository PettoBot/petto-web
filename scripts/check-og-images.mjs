// Makes sure the preview cards of the site (src/data/ogCards.mjs, drawn by `npm run make:og`) are all there and good: every card in every language
// exists as a WebP of 1200x630 that is not heavy, the manifest lists exactly what is in the folder, the files were drawn from the current data and
// look (the hash in the manifest), the pages find their cards, and the link preview of a page fits in what Discord accepts.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARDS, LANGS, cardName, ogCardFor, postKeyOf } from '../src/data/ogCards.mjs';
import { planJobs, specHash } from './og/render.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.join(root, 'public/assets/og');
const manifest = JSON.parse(readFileSync(path.join(root, 'src/data/ogManifest.json'), 'utf8'));
const MAX_BYTES = 150 * 1024;
const problems = [];

const jobs = await planJobs();
for (const job of jobs) {
  const file = path.join(folder, `${job.name}.webp`);
  if (!existsSync(file)) { problems.push(`${job.name}: the file is missing (run npm run make:og)`); continue; }
  if (!manifest.cards[job.name]) problems.push(`${job.name}: it is not in the manifest (run npm run make:og)`);
  const bytes = readFileSync(file);
  if (bytes.subarray(0, 4).toString() !== 'RIFF' || bytes.subarray(8, 12).toString() !== 'WEBP') { problems.push(`${job.name}: it is not a WebP`); continue; }
  // The size is in the header of the first chunk: VP8 (lossy), VP8L or VP8X.
  const kind = bytes.subarray(12, 16).toString();
  let width = 0; let height = 0;
  if (kind === 'VP8 ') { width = bytes.readUInt16LE(26) & 0x3fff; height = bytes.readUInt16LE(28) & 0x3fff; }
  else if (kind === 'VP8X') { width = 1 + bytes.readUIntLE(24, 3); height = 1 + bytes.readUIntLE(27, 3); }
  else if (kind === 'VP8L') { const bits = bytes.readUInt32LE(21); width = 1 + (bits & 0x3fff); height = 1 + ((bits >> 14) & 0x3fff); }
  if (width !== manifest.width || height !== manifest.height) problems.push(`${job.name}: it is ${width}x${height}, it must be ${manifest.width}x${manifest.height}`);
  if (statSync(file).size > MAX_BYTES) problems.push(`${job.name}: it is over ${MAX_BYTES / 1024} KB`);
}
const expected = new Set(jobs.map((job) => `${job.name}.webp`));
for (const file of readdirSync(folder)) if (!expected.has(file)) problems.push(`${file}: no card makes this file (run npm run make:og)`);
for (const name of Object.keys(manifest.cards)) if (!expected.has(`${name}.webp`)) problems.push(`${name}: it is in the manifest and no card makes it`);
if (manifest.spec !== await specHash(jobs)) problems.push('the cards were drawn from other data or another look than the current ones (run npm run make:og)');

// Every language of every card has a headline and a tagline, and the chips are short.
for (const [key, card] of Object.entries(CARDS)) {
  for (const lang of LANGS) {
    if (!card.title?.[lang] || !card.tagline?.[lang]) problems.push(`${key}: the headline or the tagline is missing in ${lang}`);
    if ((card.chips?.[lang] ?? []).some((chip) => chip.length > 18)) problems.push(`${key}: a chip is too long in ${lang}`);
    if (/\bAI\b|\bIA\b/.test(`${card.title?.[lang]} ${card.tagline?.[lang]}`)) problems.push(`${key}: the card names something it should not (${lang})`);
  }
}

// The pages find their cards, with the language prefix and the final slash, and a page nobody listed falls back to its parent and then to the home card.
const has = (key) => Object.values(manifest.cards).some((card) => card.key === key);
const expect = (pathname, key, lang) => { const found = ogCardFor(pathname, has); if (found.key !== key || found.lang !== lang) problems.push(`${pathname} should use ${key} (${lang}), it uses ${found.key} (${found.lang})`); };
expect('/', 'home', 'en');
expect('/es/', 'home', 'es');
expect('/pt-br/features/tickets/', 'feature-tickets', 'pt-BR');
expect('/changelog/0.7.7', 'changelog', 'en');
expect('/feedback/12', 'feedback', 'en');
expect('/lb/some-server', 'leaderboard', 'en');
expect('/blog/kobot-moves-to-petto', postKeyOf('/blog/kobot-moves-to-petto'), 'en');
expect('/es/codegen', 'post-codegen', 'es');
expect('/a-page-nobody-listed', 'home', 'en');
expect('/dash/guild/1/tickets', 'dashboard', 'en');
for (const lang of LANGS) if (!existsSync(path.join(folder, `${cardName('home', lang)}.webp`))) problems.push(`the home card is missing in ${lang}`);

if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`${jobs.length} preview cards checked (${LANGS.length} languages), 0 failed`);
