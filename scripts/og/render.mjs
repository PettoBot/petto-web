// Draws the preview cards of the site (see src/data/ogCards.mjs) into public/assets/og, once per language, and writes src/data/ogManifest.json.
// Run it when a card, the look (scripts/og/template.mjs) or a news post changes: `npm run make:og` (`-- --only home,status` for a few).
// Uses sharp directly (no browser needed), keeping files fast to build and small (1200x630 WebP, < 80 KB).
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CARDS, CARD_PATHS, LANGS, NEWS_PAGES, cardName, postKeyOf, postToneOf } from '../../src/data/ogCards.mjs';
import { PREVIEW } from '../../src/data/previewText.mjs';
import { HEIGHT, WIDTH, renderCardBuffer } from './template.mjs';
import { loadUi } from './load-copy.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const publicDir = path.join(root, 'public');
const outDir = path.join(publicDir, 'assets/og');
const manifestFile = path.join(root, 'src/data/ogManifest.json');
export const QUALITY = 78;

const clip = (text, max) => { const line = String(text).replace(/\s+/g, ' ').trim(); return line.length <= max ? line : `${line.slice(0, max - 1).trimEnd()}…`; };

// Reverse map: card key -> route path (e.g. 'partners' -> '/partners')
const ROUTE_FOR_KEY = Object.fromEntries(Object.entries(CARD_PATHS).map(([route, key]) => [key, route]));

/** Every card that has to exist: the listed ones, the news posts and the pages that have a post of their own, in each language. */
export async function planJobs() {
  const ui = await loadUi();
  const jobs = [];
  const job = (key, lang, card, embed, route, extra) => ({
    name: cardName(key, lang), key, lang, card, route,
    title: card.title[lang], tagline: card.tagline[lang], embed, extra,
  });
  for (const lang of LANGS) {
    for (const [key, card] of Object.entries(CARDS)) {
      const text = PREVIEW[key];
      if (!text) throw new Error(`The card ${key} has no text for its link preview (src/data/previewText.mjs)`);
      jobs.push(job(key, lang, card, { title: text.title[lang], description: text.description[lang] }, ROUTE_FOR_KEY[key] ?? '/'));
    }
    const t = ui.useTranslations(lang);
    for (const item of ui.sortedReleases(lang)) {
      if (!item.href || !item.banner) continue;
      const card = { tone: postToneOf(item.href), art: 'post', title: { [lang]: item.title }, tagline: { [lang]: clip(item.desc, 90) } };
      jobs.push(job(postKeyOf(item.href), lang, card, { title: /Petto/.test(item.title) ? item.title : `${item.title} · Petto`, description: item.desc }, item.href, { post: { banner: item.banner, date: item.date } }));
    }
    for (const page of NEWS_PAGES) {
      const card = { tone: page.tone, art: 'post', title: page.title, tagline: page.tagline };
      jobs.push(job(postKeyOf(page.path), lang, card, { title: page.embedTitle[lang], description: page.description[lang] }, page.path, { post: { banner: page.banner, date: t.newsPosts[page.post].date } }));
    }
  }
  return jobs;
}

export async function specHash(jobs) {
  const hash = createHash('sha1');
  for (const file of ['template.mjs', 'render.mjs']) {
    const raw = (await readFile(path.join(here, file), 'utf8')).replace(/\r\n/g, '\n');
    hash.update(raw);
  }
  hash.update(await readFile(path.join(publicDir, 'assets/petto-emblem.svg')));
  hash.update(JSON.stringify(jobs.map((job) => [job.name, job.card, job.route, job.title, job.tagline, job.embed, job.extra ?? null])));
  return hash.digest('hex').slice(0, 16);
}

async function main() {
  const only = process.argv.includes('--only') ? new Set(String(process.argv[process.argv.indexOf('--only') + 1]).split(',')) : null;
  const pngDir = process.argv.includes('--png') ? process.argv[process.argv.indexOf('--png') + 1] : null;
  const jobs = await planJobs();
  await mkdir(outDir, { recursive: true });
  if (pngDir) await mkdir(pngDir, { recursive: true });
  const files = {};
  const versions = {};
  for (const job of jobs) {
    if (only && !only.has(job.key)) continue;
    const { png, webp } = await renderCardBuffer(job, { publicDir, quality: QUALITY });
    await writeFile(path.join(outDir, `${job.name}.webp`), webp);
    versions[job.name] = createHash('md5').update(webp).digest('hex').slice(0, 10);
    if (pngDir) await writeFile(path.join(pngDir, `${job.name}.png`), png);
    console.log(`${job.name}.webp  ${(webp.length / 1024).toFixed(0)} KB`);
  }
  if (only) return;
  for (const job of jobs) {
    files[job.name] = {
      key: job.key, lang: job.lang, tone: job.card.tone, alt: job.title, tagline: job.tagline,
      embedTitle: job.embed.title, description: job.embed.description, version: versions[job.name],
    };
  }
  const present = new Set(jobs.map((job) => `${job.name}.webp`));
  for (const file of await readdir(outDir)) if (!present.has(file)) await rm(path.join(outDir, file));
  await writeFile(manifestFile, `${JSON.stringify({ width: WIDTH, height: HEIGHT, spec: await specHash(jobs), cards: Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) }, null, 1)}\n`);
  console.log(`${jobs.length} cards drawn`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
