// Makes the pictures that a link to a page shows when it is shared (Discord, X, Telegram...): they cannot be SVG, so each banner is drawn
// to a 1200x500 PNG (the size of the default one) in public/assets/og. Run it when a banner changes: `node scripts/make-og-images.mjs`.
// The pages without a banner get a card with their title (TITLE_PAGES), once per language, drawn on Petto's background with the site's fonts.
// It needs Playwright (to draw the SVG banners the way a browser does) and sharp (to keep the files small).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { PAGE_IMAGES, TITLE_PAGES, titleCardName } from '../src/data/pageImages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'public/assets/og');
await mkdir(out, { recursive: true });

let chromium;
try { ({ chromium } = await import('playwright')); } catch { console.error('Playwright is needed to draw the SVG banners (npm i -D playwright).'); process.exit(1); }

const sources = new Map();
for (const image of Object.values(PAGE_IMAGES)) sources.set(image.name, image.source);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 500 } });
for (const [name, source] of sources) {
  const file = path.join(root, 'public', source);
  let buffer;
  if (source.endsWith('.svg')) {
    const svg = (await readFile(file)).toString('base64');
    await page.setContent(`<html><body style="margin:0"><img id="b" style="display:block;width:1200px;height:500px;object-fit:cover" src="data:image/svg+xml;base64,${svg}"></body></html>`);
    await page.waitForFunction(() => document.getElementById('b').complete);
    buffer = await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } });
  } else {
    buffer = await readFile(file);
  }
  const png = await sharp(buffer).resize(1200, 500, { fit: 'cover' }).png({ palette: true, quality: 92, compressionLevel: 9 }).toBuffer();
  await writeFile(path.join(out, `${name}.png`), png);
  console.log(`${name}.png  ${(png.length / 1024).toFixed(0)} KB  (from ${source})`);
}

// The cards with a title.
const fontDir = path.join(root, 'public/fonts/dash');
const mascot = (await readFile(path.join(root, 'public/assets/mascot-icon.png'))).toString('base64');
const cardHtml = (title) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Fraunces Variable'; src: url('file://${fontDir}/fraunces-latin-wght-normal.woff2') format('woff2-variations'); font-weight: 100 900; }
@font-face { font-family: 'Jakarta Variable'; src: url('file://${fontDir}/plus-jakarta-sans-latin-wght-normal.woff2') format('woff2-variations'); font-weight: 200 800; }
html, body { margin: 0; width: 1200px; height: 500px; overflow: hidden; }
body { position: relative; background: linear-gradient(135deg, #1b1c20, #2a1f24); font-family: 'Jakarta Variable', sans-serif; color: #f2f1ed; }
.dots { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(242,241,237,.08) 1.2px, transparent 1.4px); background-size: 20px 20px; }
.glow { position: absolute; left: 640px; top: 40px; width: 720px; height: 460px; border-radius: 50%; background: radial-gradient(closest-side, rgba(240,169,196,.30), transparent); }
.glow2 { position: absolute; left: 80px; top: 300px; width: 520px; height: 300px; border-radius: 50%; background: radial-gradient(closest-side, rgba(240,168,143,.16), transparent); }
.brand { position: absolute; left: 88px; top: 74px; font: 600 22px 'Jakarta Variable'; letter-spacing: .22em; text-transform: uppercase; color: #f0a88f; }
.title { position: absolute; left: 88px; top: 120px; width: 700px; height: 280px; display: flex; align-items: center; font: 600 92px/1.04 'Fraunces Variable', serif; letter-spacing: -.01em; }
.title.long { font-size: 74px; }
.foot { position: absolute; left: 88px; bottom: 62px; font: 500 24px 'Jakarta Variable'; color: #9a9ca3; }
.ring { position: absolute; right: 118px; top: 112px; width: 276px; height: 276px; border-radius: 50%; background: #f3e5dd; border: 3px solid #f0a88f; box-shadow: 0 24px 60px rgba(0,0,0,.5); display: grid; place-items: center; }
.ring img { width: 200px; height: 200px; border-radius: 50%; }
.s { position: absolute; width: 22px; height: 22px; background: #f0a9c4; clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%); }
</style></head><body><div class="dots"></div><div class="glow"></div><div class="glow2"></div>
<div class="brand">Petto</div><div class="title${title.length > 22 ? ' long' : ''}">${title.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</div><div class="foot">petto.sbs</div>
<div class="ring"><img src="data:image/png;base64,${mascot}"></div>
<span class="s" style="right:88px;top:84px;opacity:.8"></span><span class="s" style="right:420px;top:410px;opacity:.5;transform:scale(.7)"></span><span class="s" style="right:70px;top:400px;opacity:.7;background:#f0a88f"></span>
</body></html>`;
const tmp = path.join(os.tmpdir(), 'petto-og-card.html');
for (const found of Object.values(TITLE_PAGES)) {
  for (const lang of ['en', 'es', 'pt-BR']) {
    await writeFile(tmp, cardHtml(found.title[lang]));
    await page.goto(`file://${tmp}`);
    await page.evaluate(() => document.fonts.ready);
    const png = await sharp(await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 500 } })).png({ palette: true, quality: 92, compressionLevel: 9 }).toBuffer();
    const name = titleCardName(found.slug, lang);
    await writeFile(path.join(out, `${name}.png`), png);
    console.log(`${name}.png  ${(png.length / 1024).toFixed(0)} KB  (${found.title[lang]})`);
  }
}
await browser.close();
