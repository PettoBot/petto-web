// Makes the pictures that a link to a page shows when it is shared (Discord, X, Telegram...): they cannot be SVG, so each banner is drawn
// to a 1200x500 PNG (the size of the default one) in public/assets/og. Run it when a banner changes: `node scripts/make-og-images.mjs`.
// It needs Playwright (to draw the SVG banners the way a browser does) and sharp (to keep the files small).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { PAGE_IMAGES } from '../src/data/pageImages.mjs';

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
await browser.close();
