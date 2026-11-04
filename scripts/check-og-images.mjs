// Makes sure the preview cards of the site (src/data/ogCards.mjs, drawn by `npm run make:og`) are all there and good: every card in every language
// exists as a WebP of 1200x630 that is not heavy, the manifest lists exactly what is in the folder, the files were drawn from the current data and
// look (the hash in the manifest), the pages find their cards, every card has its tone, its artwork and a headline that ends in a period, and the preview of every page
// has a descriptive title with the brand, a description, four buttons and a bar of the color of its picture, with nothing about how many servers or members Petto has.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARDS, CARD_PATHS, LANGS, TONES, accentNumber, cardName, ogCardFor, postKeyOf } from '../src/data/ogCards.mjs';
import { PREVIEW } from '../src/data/previewText.mjs';
import { ART_NAMES, cardHtml } from './og/template.mjs';
import { loadTs } from './og/load-copy.mjs';
import { planJobs, specHash } from './og/render.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const folder = path.join(root, 'public/assets/og');
const manifest = JSON.parse(readFileSync(path.join(root, 'src/data/ogManifest.json'), 'utf8'));
const MAX_BYTES = 80 * 1024;
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

// Every card has a tone and artwork that exist, and in every language a short headline that ends in a period (or a question mark) and a tagline for two lines.
for (const [key, card] of Object.entries(CARDS)) {
  if (!TONES[card.tone]) problems.push(`${key}: the tone ${card.tone} does not exist`);
  if (!ART_NAMES.includes(card.art)) problems.push(`${key}: the artwork ${card.art} does not exist`);
  for (const lang of LANGS) {
    const title = card.title?.[lang]; const tagline = card.tagline?.[lang];
    if (!title || !tagline) { problems.push(`${key}: the headline or the tagline is missing in ${lang}`); continue; }
    if (!/[.?]$/.test(title)) problems.push(`${key}: the headline must end in a period in ${lang}`);
    if (tagline.length > 80) problems.push(`${key}: the tagline is over 80 characters in ${lang}`);
    if (/\bAI\b|\bIA\b/.test(`${title} ${tagline}`)) problems.push(`${key}: the card names something it should not (${lang})`);
  }
}
// What every preview says (src/data/previewText.mjs, and the posts): a title that says what the page is and carries the brand (never a bare word), a description of
// a sentence or two, and nothing about how many servers or members Petto has, in any language, in the title, the description or the picture's words.
const SIZE_OF_THE_BOT = /\d[\d.,]*\s*(?:servers?|servidores?|members?|miembros?|membros?|guilds?|users?|usuarios?|usuários?)\b|looking after|looked after|cuidando\b|cuidar d[eo]\b|bien cuidado|bem cuidado/i;
const BANNED = /\bAI\b|\bIA\b/;
for (const key of Object.keys(CARDS)) if (!PREVIEW[key]) problems.push(`${key}: it has no text for its link preview (src/data/previewText.mjs)`);
for (const key of Object.keys(PREVIEW)) if (!CARDS[key]) problems.push(`${key}: it has text for a link preview and no card`);
for (const [name, card] of Object.entries(manifest.cards)) {
  const { embedTitle: title, description, tagline, alt, tone } = card;
  if (!TONES[tone]) problems.push(`${name}: the tone ${tone} does not exist`);
  if (typeof title !== 'string' || typeof description !== 'string') { problems.push(`${name}: it has no title or description for its preview in the manifest`); continue; }
  if (!/Petto/.test(title)) problems.push(`${name}: the title of the preview does not carry the brand: ${title}`);
  if (title.trim().split(/\s+/).length < 3) problems.push(`${name}: the title of the preview is a bare word: ${title}`);
  // About 70 characters keeps it on two lines in Discord; a post keeps its own title (with the brand) and may be a little longer.
  if (title.length > (name.startsWith('post-') ? 90 : 72)) problems.push(`${name}: the title of the preview is too long (${title.length} characters): ${title}`);
  if (description.length < 40 || description.length > 260) problems.push(`${name}: the description of the preview must be a sentence or two (${description.length} characters)`);
  for (const [what, text] of [['title', title], ['description', description], ['headline', alt], ['tagline', tagline]]) {
    if (SIZE_OF_THE_BOT.test(text)) problems.push(`${name}: the ${what} counts servers or members: ${text}`);
    if (BANNED.test(text)) problems.push(`${name}: the ${what} names something it should not`);
  }
}

// The Discord card of every page, built the way the layout builds it: four link buttons with an emoji, in the size Discord accepts, and a bar on its left that is the
// SAME color as the background of the picture of the page (the table of tones is the one source: the picture is drawn with it and the bar is read from it).
const { pageImage, pageImagePath } = await loadTs('src/data/pageImages.ts');
const { discordEmbedJson, DOCS_URL, SUPPORT_URL, EMOJI } = await loadTs('src/data/discordEmbed.ts');
const jobsByName = new Map(jobs.map((job) => [job.name, job]));
for (const pageKey of Object.keys(CARD_PATHS)) {
  const base = pageKey === '/lb' ? '/lb/a-server' : pageKey;
  for (const [prefix, lang] of [['', 'en'], ['/es', 'es'], ['/pt-br', 'pt-BR']]) {
    const pagePath = `${prefix}${base}`;
    const picture = pageImage(pagePath);
    const job = jobsByName.get(picture.name);
    if (!job) { problems.push(`${pagePath}: its picture ${picture.name} is not a card`); continue; }
    const json = discordEmbedJson(lang, { title: picture.embedTitle, description: picture.description, url: `https://petto.sbs${pagePath}`, image: { url: `https://petto.sbs${pageImagePath(picture)}`, alt: picture.alt }, accent: picture.accent });
    const embed = JSON.parse(json.replace(/\\u003c/g, '<')).component;
    const wanted = parseInt(TONES[job.card.tone].bg.slice(1), 16);
    if (embed.accent_color !== wanted || picture.accent !== wanted || accentNumber(job.card.tone) !== wanted) problems.push(`${pagePath}: the bar of the card is not the background color of its picture`);
    if (!cardHtml({ card: job.card, lang, title: job.title, tagline: job.tagline, extra: job.extra, assetsDir: path.join(root, 'scripts/og/assets'), publicDir: path.join(root, 'public') }).includes(`background: ${TONES[job.card.tone].bg}`)) problems.push(`${pagePath}: its picture is not drawn on the background of its tone`);
    const row = embed.components.find((part) => part.type === 1)?.components ?? [];
    const urls = [`https://petto.sbs/invite`, `https://petto.sbs/dash`, DOCS_URL[lang], SUPPORT_URL];
    const emoji = [EMOJI.invite, EMOJI.dashboard, EMOJI.docs, EMOJI.support];
    if (row.length !== 4 || row.some((button, i) => button.type !== 2 || button.style !== 5 || button.url !== urls[i] || button.emoji?.id !== emoji[i].id || !button.label)) problems.push(`${pagePath}: the card does not have its four link buttons with their emoji`);
    if (new TextEncoder().encode(json).length > 3000) problems.push(`${pagePath}: the card is over 3,000 bytes`);
    if (SIZE_OF_THE_BOT.test(json)) problems.push(`${pagePath}: the card counts servers or members`);
    if (!/Petto/.test(embed.components.find((part) => part.type === 10).content.split('\n')[0])) problems.push(`${pagePath}: the title of the card does not carry the brand`);
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
