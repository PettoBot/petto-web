// Draws the preview cards of the site (see src/data/ogCards.mjs) into public/assets/og, once per language, and writes src/data/ogManifest.json.
// Run it when a card, the look (scripts/og/template.mjs) or a news post changes: `npm run make:og` (`-- --only home,status` for a few).
// It needs Playwright (a browser, only to draw: the deployed server never runs this) and sharp (to keep the files small, WebP, about 1200x630).
// The cards are flat pastel illustrations (Balsamiq Sans and our own SVG stickers). The files are committed, so the build and the server stay light. `scripts/check-og-images.mjs` (part of `npm run check`) says when they are stale.
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { CARDS, LANGS, NEWS_PAGES, cardName, postKeyOf, postToneOf } from '../../src/data/ogCards.mjs';
import { PREVIEW } from '../../src/data/previewText.mjs';
import { cardHtml, HEIGHT, WIDTH } from './template.mjs';
import { loadUi } from './load-copy.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const publicDir = path.join(root, 'public');
const assetsDir = path.join(here, 'assets');
const outDir = path.join(publicDir, 'assets/og');
const manifestFile = path.join(root, 'src/data/ogManifest.json');
export const QUALITY = 82;

/** Playwright is only needed here: it comes from the project, from NODE_PATH, or from the tools folder of the machine. */
function loadPlaywright() {
  for (const base of [path.join(root, 'package.json'), '/opt/node-tools/package.json', ...(process.env.NODE_PATH ?? '').split(path.delimiter).filter(Boolean).map((dir) => path.join(dir, 'x.json'))]) {
    try { return createRequire(base)('playwright'); } catch { /* try the next place */ }
  }
  throw new Error('Playwright is needed to draw the cards (npm i -D playwright, or run it where it is installed).');
}

const clip = (text, max) => { const line = String(text).replace(/\s+/g, ' ').trim(); return line.length <= max ? line : `${line.slice(0, max - 1).trimEnd()}…`; };
const fileUrl = (assetPath) => `file://${publicDir}${assetPath}`;

/** Every card that has to exist: the listed ones, the news posts and the pages that have a post of their own, in each language. */
export async function planJobs() {
  const ui = await loadUi();
  const jobs = [];
  const job = (key, lang, card, embed, extra) => ({ name: cardName(key, lang), key, lang, card, title: card.title[lang], tagline: card.tagline[lang], embed, extra });
  for (const lang of LANGS) {
    for (const [key, card] of Object.entries(CARDS)) {
      const text = PREVIEW[key];
      if (!text) throw new Error(`The card ${key} has no text for its link preview (src/data/previewText.mjs)`);
      jobs.push(job(key, lang, card, { title: text.title[lang], description: text.description[lang] }));
    }
    const t = ui.useTranslations(lang);
    // A post of the news: its own title is the headline (smaller, up to 4 lines) with the date in a chip, and its own banner on the card.
    for (const item of ui.sortedReleases(lang)) {
      if (!item.href || !item.banner) continue;
      const card = { tone: postToneOf(item.href), art: 'post', title: { [lang]: item.title }, tagline: { [lang]: clip(item.desc, 90) } };
      // The title of a post is its own plus the brand when it does not say it already; the description is the one of the post.
      jobs.push(job(postKeyOf(item.href), lang, card, { title: /Petto/.test(item.title) ? item.title : `${item.title} · Petto`, description: item.desc }, { post: { banner: fileUrl(item.banner), date: item.date } }));
    }
    for (const page of NEWS_PAGES) {
      const card = { tone: page.tone, art: 'post', title: page.title, tagline: page.tagline };
      jobs.push(job(postKeyOf(page.path), lang, card, { title: page.embedTitle[lang], description: page.description[lang] }, { post: { banner: fileUrl(page.banner), date: t.newsPosts[page.post].date } }));
    }
  }
  return jobs;
}

export async function specHash(jobs) {
  const hash = createHash('sha1');
  for (const file of ['template.mjs', 'render.mjs']) hash.update(await readFile(path.join(here, file)));
  hash.update(await readFile(path.join(publicDir, 'assets/duck-plain.png')));
  // The banners of the posts are written as absolute file addresses: the folder of the checkout is not part of the look, so the hash does not depend on where the project is.
  hash.update(JSON.stringify(jobs.map((job) => [job.name, job.card, job.title, job.tagline, job.embed, job.extra ?? null])).split(`file://${publicDir}`).join('file://public'));
  return hash.digest('hex').slice(0, 16);
}

/** Draws one job with an open page and returns the WebP. */
async function draw(page, job, tmp) {
  await writeFile(tmp, cardHtml({ card: job.card, lang: job.lang, title: job.title, tagline: job.tagline, extra: job.extra, assetsDir, publicDir }));
  await page.goto(`file://${tmp}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  await page.waitForFunction(() => [...document.images].every((img) => img.complete));
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
  return { png, webp: await sharp(png).webp({ quality: QUALITY, effort: 6, smartSubsample: true }).toBuffer() };
}

async function main() {
  const only = process.argv.includes('--only') ? new Set(String(process.argv[process.argv.indexOf('--only') + 1]).split(',')) : null;
  const pngDir = process.argv.includes('--png') ? process.argv[process.argv.indexOf('--png') + 1] : null;
  const jobs = await planJobs();
  const { chromium } = loadPlaywright();
  await mkdir(outDir, { recursive: true });
  if (pngDir) await mkdir(pngDir, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
  const tmp = path.join(os.tmpdir(), `petto-og-${process.pid}.html`);
  const files = {};
  for (const job of jobs) {
    if (only && !only.has(job.key)) { continue; }
    const { png, webp } = await draw(page, job, tmp);
    await writeFile(path.join(outDir, `${job.name}.webp`), webp);
    if (pngDir) await writeFile(path.join(pngDir, `${job.name}.png`), png);
    console.log(`${job.name}.webp  ${(webp.length / 1024).toFixed(0)} KB`);
  }
  await browser.close();
  await rm(tmp, { force: true });
  if (only) return; // a partial run leaves the manifest and the rest of the folder alone
  // The manifest: what exists, so the layout never points at a card that was not drawn; and a hash of what the cards were made from.
  for (const job of jobs) files[job.name] = { key: job.key, lang: job.lang, tone: job.card.tone, alt: job.title, tagline: job.tagline, embedTitle: job.embed.title, description: job.embed.description };
  const present = new Set(jobs.map((job) => `${job.name}.webp`));
  for (const file of await readdir(outDir)) if (!present.has(file)) await rm(path.join(outDir, file));
  await writeFile(manifestFile, `${JSON.stringify({ width: WIDTH, height: HEIGHT, spec: await specHash(jobs), cards: Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) }, null, 1)}\n`);
  console.log(`${jobs.length} cards drawn`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
