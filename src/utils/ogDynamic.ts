// Dynamic 1200x630 OpenGraph card renderer for public server leaderboards and individual partners.
// Runs on Node (Discloud) using sharp; returns null on edge runtimes so callers can redirect to the static WebP card.
import type { Locale } from '../i18n/ui';

const WIDTH = 1200;
const HEIGHT = 630;

const esc = (text: unknown) => String(text ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function wrapLines(text: string, maxChars: number, maxLines: number): string[] {
  const words = String(text ?? '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
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
  const used = lines.join(' ').split(' ').filter(Boolean).length;
  const rest = words.slice(used).join(' ');
  if (rest) {
    lines.push(rest.length > maxChars + 4 ? `${rest.slice(0, maxChars + 1).trimEnd()}…` : rest);
  }
  return lines.slice(0, maxLines);
}

async function fetchRemoteBuffer(url: string): Promise<Buffer | null> {
  if (!/^https:\/\/[a-z0-9.-]+/i.test(url)) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2_500) });
    if (!res.ok) return null;
    const len = Number(res.headers.get('content-length') ?? 0);
    if (len > 4 * 1024 * 1024) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

async function loadNodeTools() {
  if (typeof process === 'undefined' || !process.versions?.node) return null;
  try {
    const [{ default: sharp }, pathMod, fsMod] = await Promise.all([
      import('sharp'),
      import('node:path'),
      import('node:fs'),
    ]);
    const cwd = process.cwd();
    const candidates = [
      pathMod.join(cwd, 'public'),
      pathMod.join(cwd, 'build/client'),
      pathMod.join(cwd, 'dist/client'),
    ];
    const publicDir = candidates.find((dir) => fsMod.existsSync(pathMod.join(dir, 'assets/petto-emblem.svg'))) ?? candidates[0];
    return { sharp, path: pathMod, fs: fsMod, publicDir };
  } catch {
    return null;
  }
}

async function whiteDuckPng(sharp: any, pathMod: any, publicDir: string, w: number, h: number): Promise<Buffer> {
  const raw = await sharp(pathMod.join(publicDir, 'assets/petto-emblem.svg'))
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
  return sharp(raw.data, { raw: raw.info }).png().toBuffer();
}

export async function renderLeaderboardOg(opts: {
  lang: Locale;
  name: string;
  iconUrl?: string | null;
  bannerUrl?: string | null;
  memberCount?: number | null;
}): Promise<Buffer | null> {
  const tools = await loadNodeTools();
  if (!tools) return null;
  const { sharp, path: pathMod, publicDir } = tools;

  const copy = {
    en: { pill: 'LEADERBOARD', sub: 'Top members · Messages, Voice & Levels live', stat1Label: 'RANKING', stat1Val: 'Top 100', stat2Label: 'ACTIVITY', stat2Val: 'Text · Voice · XP', membersLabel: 'MEMBERS' },
    es: { pill: 'LEADERBOARD', sub: 'Top miembros · Mensajes, Voz y Niveles en vivo', stat1Label: 'RANKING', stat1Val: 'Top 100', stat2Label: 'ACTIVIDAD', stat2Val: 'Texto · Voz · XP', membersLabel: 'MIEMBROS' },
    'pt-BR': { pill: 'LEADERBOARD', sub: 'Top membros · Mensagens, Voz e Níveis ao vivo', stat1Label: 'RANKING', stat1Val: 'Top 100', stat2Label: 'ATIVIDADE', stat2Val: 'Texto · Voz · XP', membersLabel: 'MEMBROS' },
  }[opts.lang];

  const remoteBanner = opts.bannerUrl ? await fetchRemoteBuffer(opts.bannerUrl) : null;
  const bg = await sharp(remoteBanner ?? pathMod.join(publicDir, 'assets/home-hero-sky.webp'))
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .blur(remoteBanner ? 2.5 : 3)
    .modulate({ brightness: 0.72, saturation: 1.06 })
    .png()
    .toBuffer();

  const remoteIcon = opts.iconUrl ? await fetchRemoteBuffer(opts.iconUrl) : null;
  let iconBuf: Buffer | null = null;
  if (remoteIcon) {
    try {
      iconBuf = await sharp(remoteIcon)
        .resize(138, 138, { fit: 'cover' })
        .composite([{
          input: Buffer.from('<svg width="138" height="138"><rect x="0" y="0" width="138" height="138" rx="34" fill="#fff"/></svg>'),
          blend: 'dest-in',
        }])
        .png()
        .toBuffer();
    } catch {
      iconBuf = null;
    }
  }

  const smallDuck = await whiteDuckPng(sharp, pathMod, publicDir, 38, 42);
  const titleStr = opts.name.trim() || 'Discord Server';
  const titleSize = titleStr.length > 26 ? 44 : titleStr.length > 18 ? 56 : 68;
  const displayTitle = titleStr.length > 34 ? `${titleStr.slice(0, 32).trimEnd()}…` : titleStr;
  const initial = (titleStr[0] ?? 'S').toUpperCase();

  const stat1Label = opts.memberCount ? copy.membersLabel : copy.stat1Label;
  const stat1Val = opts.memberCount
    ? new Intl.NumberFormat(opts.lang === 'en' ? 'en-US' : opts.lang).format(opts.memberCount)
    : copy.stat1Val;

  // Brand lockup bottom-right: DUCK ICON FIRST (at x=914), THEN "Petto" (at x=964)
  const svg = Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ov" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#070d1a" stop-opacity="0.44"/>
        <stop offset="100%" stop-color="#060910" stop-opacity="0.88"/>
      </linearGradient>
      <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#030712" flood-opacity="0.72"/>
      </filter>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#ov)"/>
    <rect x="86" y="88" width="1028" height="454" rx="28" fill="rgba(16,20,30,0.68)" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>
    <rect x="148" y="164" width="150" height="150" rx="38" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
    ${!iconBuf ? `<text x="223" y="264" text-anchor="middle" fill="#eaf0fc" font-family="Georgia, serif" font-size="72" font-weight="700">${esc(initial)}</text>` : ''}
    <rect x="334" y="168" width="184" height="34" rx="17" fill="rgba(110,231,161,0.16)" stroke="rgba(110,231,161,0.42)" stroke-width="1"/>
    <text x="426" y="191" text-anchor="middle" fill="#6ee7a1" font-family="Consolas, monospace" font-size="14" font-weight="700">${esc(copy.pill)}</text>
    <text x="334" y="274" fill="#ffffff" font-family="Georgia, serif" font-size="${titleSize}" font-weight="700" letter-spacing="-1.5" filter="url(#sh)">${esc(displayTitle)}</text>
    <text x="334" y="324" fill="#c7d5ec" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="500">${esc(copy.sub)}</text>
    <line x1="148" y1="382" x2="1052" y2="382" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <rect x="148" y="416" width="188" height="58" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)"/>
    <text x="172" y="440" fill="#94a3b8" font-family="Consolas, monospace" font-size="12">${esc(stat1Label)}</text>
    <text x="172" y="463" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="700">${esc(stat1Val)}</text>
    <rect x="354" y="416" width="224" height="58" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)"/>
    <text x="378" y="440" fill="#94a3b8" font-family="Consolas, monospace" font-size="12">${esc(copy.stat2Label)}</text>
    <text x="378" y="463" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="700">${esc(copy.stat2Val)}</text>
    <text x="964" y="456" fill="#eef3fc" font-family="Georgia, serif" font-size="31" font-weight="700" letter-spacing="-0.6">Petto</text>
  </svg>`);

  const layers: any[] = [{ input: svg, top: 0, left: 0 }];
  if (iconBuf) layers.push({ input: iconBuf, top: 170, left: 154 });
  layers.push({ input: smallDuck, top: 423, left: 916 });

  return sharp(bg)
    .composite(layers)
    .webp({ quality: 80, effort: 4, smartSubsample: true })
    .toBuffer();
}

export async function renderPartnerOg(opts: {
  lang: Locale;
  name: string;
  description: string;
  isPrimary?: boolean;
  logoUrl?: string | null;
}): Promise<Buffer | null> {
  const tools = await loadNodeTools();
  if (!tools) return null;
  const { sharp, path: pathMod, fs: fsMod, publicDir } = tools;

  const badge = opts.isPrimary
    ? (opts.lang === 'es' ? 'PARTNER PRINCIPAL' : opts.lang === 'pt-BR' ? 'PARCEIRO PRINCIPAL' : 'PRIMARY PARTNER')
    : (opts.lang === 'pt-BR' ? 'PARCEIRO PETTO' : 'PETTO PARTNER');

  const bg = await sharp(pathMod.join(publicDir, 'assets/hero-art-4.webp'))
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
    .blur(2.5)
    .modulate({ brightness: 0.74, saturation: 1.08 })
    .png()
    .toBuffer();

  let logoBuf: Buffer | null = null;
  if (opts.logoUrl) {
    let rawLogo: Buffer | null = null;
    if (opts.logoUrl.startsWith('/assets/')) {
      const localPath = pathMod.join(publicDir, opts.logoUrl.slice(1));
      if (fsMod.existsSync(localPath)) rawLogo = fsMod.readFileSync(localPath);
    } else if (/^https:\/\//.test(opts.logoUrl)) {
      rawLogo = await fetchRemoteBuffer(opts.logoUrl);
    }
    if (rawLogo) {
      try {
        logoBuf = await sharp(rawLogo)
          .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer();
      } catch {
        logoBuf = null;
      }
    }
  }

  const smallDuck = await whiteDuckPng(sharp, pathMod, publicDir, 38, 42);
  const titleStr = opts.name.trim() || 'Partner';
  const titleSize = titleStr.length > 24 ? 46 : titleStr.length > 16 ? 58 : 68;
  const displayTitle = titleStr.length > 32 ? `${titleStr.slice(0, 30).trimEnd()}…` : titleStr;
  const initial = (titleStr[0] ?? 'P').toUpperCase();
  const descLines = wrapLines(opts.description, 46, 3);
  const descSvg = descLines.map((line, i) =>
    `<text x="334" y="${324 + i * 32}" fill="#c7d5ec" font-family="Segoe UI, Arial, sans-serif" font-size="23" font-weight="500">${esc(line)}</text>`
  ).join('');
  const badgeW = Math.max(180, badge.length * 10 + 44);

  // Brand lockup bottom-right: DUCK ICON FIRST (at x=916), THEN "Petto" (at x=964)
  const svg = Buffer.from(`<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ov" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#070d1a" stop-opacity="0.44"/>
        <stop offset="100%" stop-color="#060910" stop-opacity="0.88"/>
      </linearGradient>
      <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#030712" flood-opacity="0.72"/>
      </filter>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#ov)"/>
    <rect x="86" y="88" width="1028" height="454" rx="28" fill="rgba(16,20,30,0.68)" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>
    <rect x="148" y="164" width="150" height="150" rx="38" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
    ${!logoBuf ? `<text x="223" y="264" text-anchor="middle" fill="#eaf0fc" font-family="Georgia, serif" font-size="72" font-weight="700">${esc(initial)}</text>` : ''}
    <rect x="334" y="168" width="${badgeW}" height="34" rx="17" fill="rgba(201,208,219,0.14)" stroke="rgba(201,208,219,0.38)" stroke-width="1"/>
    <text x="${334 + Math.round(badgeW / 2)}" y="191" text-anchor="middle" fill="#dce4f2" font-family="Consolas, monospace" font-size="14" font-weight="700">${esc(badge)}</text>
    <text x="334" y="274" fill="#ffffff" font-family="Georgia, serif" font-size="${titleSize}" font-weight="700" letter-spacing="-1.5" filter="url(#sh)">${esc(displayTitle)}</text>
    ${descSvg}
    <line x1="148" y1="414" x2="1052" y2="414" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
    <text x="148" y="468" fill="#94a3b8" font-family="Consolas, monospace" font-size="17" font-weight="600">petto.sbs/partners</text>
    <text x="964" y="472" fill="#eef3fc" font-family="Georgia, serif" font-size="31" font-weight="700" letter-spacing="-0.6">Petto</text>
  </svg>`);

  const layers: any[] = [{ input: svg, top: 0, left: 0 }];
  if (logoBuf) layers.push({ input: logoBuf, top: 175, left: 159 });
  layers.push({ input: smallDuck, top: 439, left: 916 });

  return sharp(bg)
    .composite(layers)
    .webp({ quality: 80, effort: 4, smartSubsample: true })
    .toBuffer();
}
