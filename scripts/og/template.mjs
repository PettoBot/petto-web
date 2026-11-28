// Renders Petto's 1200x630 OpenGraph preview cards using sharp + crisp SVG overlays (Vetox-style dark atmospheric look).
// Zero browser/Playwright runtime required: fast, deterministic, and lightweight WebP output.
import path from 'node:path';
import sharp from 'sharp';
import { TONES } from '../../src/data/ogCards.mjs';

export const WIDTH = 1200;
export const HEIGHT = 630;

export const ART_NAMES = [
  'home', 'moderation', 'protection', 'tickets', 'levels', 'giveaways', 'plug', 'feeds', 'community',
  'stats', 'code', 'commands', 'premium', 'dashboard', 'status', 'podium', 'partners', 'team',
  'roadmap', 'changelog', 'faq', 'feedback', 'news', 'credits', 'brand', 'clock', 'snowflake',
  'chain', 'doc', 'lock', 'cookie', 'receipt', 'post',
];

const esc = (text) => String(text ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/** Wraps plain text into at most `maxLines` lines of roughly `maxChars` characters each. */
function wrapLines(text, maxChars, maxLines) {
  const words = String(text ?? '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxChars || !cur) {
      cur = next;
    } else {
      lines.push(cur);
      cur = w;
      if (lines.length === maxLines - 1) break;
    }
  }
  const usedWords = lines.join(' ').split(' ').filter(Boolean).length;
  const rest = words.slice(usedWords).join(' ');
  if (rest) {
    lines.push(rest.length > maxChars + 4 ? `${rest.slice(0, maxChars + 1).trimEnd()}…` : rest);
  }
  return lines.slice(0, maxLines);
}

const duckCache = new Map();
/** Loads public/assets/petto-emblem.svg recolored to crisp pure white at the requested size. */
async function whiteDuckPng(publicDir, w, h) {
  const key = `${publicDir}:${w}x${h}`;
  if (duckCache.has(key)) return duckCache.get(key);
  const raw = await sharp(path.join(publicDir, 'assets/petto-emblem.svg'))
    .resize(w, h, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < raw.data.length; i += 4) {
    if (raw.data[i + 3] > 0) {
      raw.data[i] = 255;
      raw.data[i + 1] = 255;
      raw.data[i + 2] = 255;
    }
  }
  const buf = await sharp(raw.data, { raw: raw.info }).png().toBuffer();
  duckCache.set(key, buf);
  return buf;
}

const bgCache = new Map();
/** Loads and caches a 1200x630 atmospheric sky background buffer. */
async function skyBgPng(publicDir, filename) {
  const key = `${publicDir}:${filename}`;
  if (bgCache.has(key)) return bgCache.get(key);
  const buf = await sharp(path.join(publicDir, 'assets', filename))
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .modulate({ brightness: 0.85, saturation: 1.08 })
    .png()
    .toBuffer();
  bgCache.set(key, buf);
  return buf;
}

function skyFileFor(job) {
  if (job.key === 'home') return 'home-hero-sky.webp';
  if (job.key === 'premium') return 'premium-sky.webp';
  if (job.key === 'partners') return 'hero-art-4.webp';
  const tone = TONES[job.card?.tone] ?? TONES.butter;
  return tone.sky ?? 'home-hero-sky.webp';
}

function pillTextFor(job) {
  const prefix = job.lang === 'es' ? '/es' : job.lang === 'pt-BR' ? '/pt-br' : '';
  if (job.extra?.post?.date) return `petto.sbs${prefix} · ${job.extra.post.date}`;
  const route = job.route && job.route !== '/' ? job.route : '';
  return `petto.sbs${prefix}${route}`;
}

/**
 * Renders one 1200x630 card into a PNG buffer and WebP buffer.
 */
export async function renderCardBuffer(job, { publicDir, quality = 80 } = {}) {
  const isHome = job.key === 'home';
  const bg = await skyBgPng(publicDir, skyFileFor(job));
  const pillText = pillTextFor(job);
  const pillW = Math.min(680, Math.max(168, pillText.length * 11 + 52));
  const pillX = Math.round((WIDTH - pillW) / 2);

  if (isHome) {
    const duck = await whiteDuckPng(publicDir, 126, 136);
    const tagLines = wrapLines(job.tagline, 58, 2);
    const tagSvg = tagLines.map((line, i) =>
      `<text x="600" y="${434 + i * 36}" text-anchor="middle" fill="#d8e3f6" font-family="Segoe UI, Arial, sans-serif" font-size="27" font-weight="500" opacity="0.95">${esc(line)}</text>`
    ).join('');
    const pillY = tagLines.length > 1 ? 506 : 482;

    const svg = Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="vig" cx="50%" cy="46%" r="68%">
          <stop offset="0%" stop-color="#09152a" stop-opacity="0.24"/>
          <stop offset="100%" stop-color="#050912" stop-opacity="0.82"/>
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="46%" r="36%">
          <stop offset="0%" stop-color="#a6c8ff" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="#a6c8ff" stop-opacity="0"/>
        </radialGradient>
        <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#030712" flood-opacity="0.72"/>
        </filter>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vig)"/>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
      <g stroke="#ffffff" stroke-opacity="0.08" fill="none" stroke-width="1.5">
        <circle cx="600" cy="315" r="290"/>
        <circle cx="600" cy="315" r="450"/>
      </g>
      <text x="532" y="346" fill="#ffffff" font-family="Georgia, serif" font-size="128" font-weight="700" letter-spacing="-3" filter="url(#sh)">Petto</text>
      ${tagSvg}
      <rect x="${pillX}" y="${pillY}" width="${pillW}" height="38" rx="19" fill="rgba(10,16,28,0.60)" stroke="rgba(255,255,255,0.22)" stroke-width="1.2"/>
      <text x="600" y="${pillY + 25}" text-anchor="middle" fill="#eaf0fc" font-family="Consolas, monospace" font-size="17" font-weight="600">${esc(pillText)}</text>
    </svg>`);

    const png = await sharp(bg)
      .composite([
        { input: svg, top: 0, left: 0 },
        { input: duck, top: 226, left: 378 },
      ])
      .png()
      .toBuffer();
    const webp = await sharp(png).webp({ quality, effort: 5, smartSubsample: true }).toBuffer();
    return { png, webp };
  }

  // Subpages & blog posts: Vetox-style centered night-sky lockup (white duck + Petto on top, serif headline, tagline, URL pill)
  const duck = await whiteDuckPng(publicDir, 76, 82);
  const titleStr = String(job.title ?? 'Petto').trim();
  const titleLines = wrapLines(titleStr, titleStr.length > 34 ? 28 : 22, 2);
  const longestTitle = Math.max(...titleLines.map((l) => l.length), 1);
  const titleSize = titleLines.length > 1
    ? (longestTitle > 24 ? 54 : 64)
    : (longestTitle > 24 ? 62 : longestTitle > 16 ? 74 : 84);
  const titleStartY = titleLines.length > 1 ? 314 : 344;
  const titleStep = Math.round(titleSize * 1.14);

  const titleSvg = titleLines.map((line, i) =>
    `<text x="600" y="${titleStartY + i * titleStep}" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="${titleSize}" font-weight="700" letter-spacing="-1.8" filter="url(#sh)">${esc(line)}</text>`
  ).join('');

  const tagLines = wrapLines(job.tagline, 60, 2);
  const tagStartY = titleLines.length > 1 ? 436 : 418;
  const tagSvg = tagLines.map((line, i) =>
    `<text x="600" y="${tagStartY + i * 34}" text-anchor="middle" fill="#d8e3f6" font-family="Segoe UI, Arial, sans-serif" font-size="25" font-weight="500" opacity="0.94">${esc(line)}</text>`
  ).join('');

  const pillY = tagLines.length > 1 ? 516 : 486;

  const svg = Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="vig" cx="50%" cy="46%" r="68%">
        <stop offset="0%" stop-color="#0a1324" stop-opacity="0.30"/>
        <stop offset="100%" stop-color="#050811" stop-opacity="0.84"/>
      </radialGradient>
      <radialGradient id="glow" cx="50%" cy="42%" r="38%">
        <stop offset="0%" stop-color="#a6c8ff" stop-opacity="0.16"/>
        <stop offset="100%" stop-color="#a6c8ff" stop-opacity="0"/>
      </radialGradient>
      <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#030712" flood-opacity="0.72"/>
      </filter>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vig)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
    <g stroke="#ffffff" stroke-opacity="0.08" fill="none" stroke-width="1.5">
      <circle cx="600" cy="315" r="290"/>
      <circle cx="600" cy="315" r="450"/>
    </g>
    <text x="564" y="216" fill="#ffffff" font-family="Georgia, serif" font-size="58" font-weight="700" letter-spacing="-1.5" filter="url(#sh)">Petto</text>
    ${titleSvg}
    ${tagSvg}
    <rect x="${pillX}" y="${pillY}" width="${pillW}" height="38" rx="19" fill="rgba(10,16,28,0.62)" stroke="rgba(255,255,255,0.22)" stroke-width="1.2"/>
    <text x="600" y="${pillY + 25}" text-anchor="middle" fill="#eaf0fc" font-family="Consolas, monospace" font-size="16" font-weight="600">${esc(pillText)}</text>
  </svg>`);

  const png = await sharp(bg)
    .composite([
      { input: svg, top: 0, left: 0 },
      { input: duck, top: 148, left: 472 },
    ])
    .png()
    .toBuffer();
  const webp = await sharp(png).webp({ quality, effort: 5, smartSubsample: true }).toBuffer();
  return { png, webp };
}

/** Kept for compatibility with any caller expecting cardHtml. */
export function cardHtml(job) {
  const tone = TONES[job.card?.tone] ?? TONES.butter;
  return `<!doctype html><html lang="${esc(job.lang)}"><body style="background: ${tone.bg}">${esc(job.title)}</body></html>`;
}
