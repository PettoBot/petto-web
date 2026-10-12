// Draws an advanced image card in the browser, with the same steps as the bot's renderer (src/imgutils/cardRenderer.js
// in petto-bot), so a layer follows the pointer while it is dragged instead of waiting for the bot to draw again.
// The saved card is still drawn by the bot when a message is sent. Keep the two in step when one changes.
import type { AvatarLayer, BarLayer, CardData, ImageLayer, Layer, ShapeLayer, TextLayer } from './cardTypes';
import { findSample, tokenValues, type TokenContext } from '../../utils/variableSamples';

const MAX_TEXT_LINES = 12;
const FONT_BASE = '/fonts/cards/';

export interface CardEnv {
  context: TokenContext;
  /** Pictures a variable stands for, and the address of an uploaded picture by its id. */
  avatarUrl: string;
  serverIconUrl: string;
  assetUrl: (id: string) => string;
}

// ---- fonts ----

const loadedFonts = new Map<string, Promise<void>>();
const slugOf = (family: string) => family.toLowerCase().replace(/\s+/g, '-');

/** The weights of every font, as the bot has them. A weight a font lacks falls back to the nearest one it has. */
const WEIGHTS: Record<string, number[]> = {
  Poppins: [400, 700, 800], Inter: [400, 700, 800], Montserrat: [400, 700, 800], 'Bebas Neue': [400],
  Oswald: [400, 700], 'Playfair Display': [400, 700], 'Roboto Mono': [400, 700], Fredoka: [400, 700], Caveat: [400, 700],
  Anton: [400], Pacifico: [400], Lobster: [400], Righteous: [400], Bangers: [400], 'Permanent Marker': [400], 'Press Start 2P': [400],
};
const DEFAULT_FONT = 'Poppins';

function realFont(family: string, weight: number): { family: string; weight: number } {
  const name = WEIGHTS[family] ? family : DEFAULT_FONT;
  const weight_ = WEIGHTS[name].reduce((best, candidate) => (Math.abs(candidate - weight) < Math.abs(best - weight) ? candidate : best), WEIGHTS[name][0]);
  return { family: name, weight: weight_ };
}

function loadFont(family: string, weight: number): Promise<void> {
  const font = realFont(family, weight);
  const key = `${font.family} ${font.weight}`;
  let pending = loadedFonts.get(key);
  if (!pending) {
    const face = new FontFace(key, `url(${FONT_BASE}${slugOf(font.family)}-${font.weight}.woff2) format("woff2")`);
    pending = face.load().then((loaded) => { document.fonts.add(loaded); }).catch(() => { loadedFonts.delete(key); });
    loadedFonts.set(key, pending);
  }
  return pending;
}

function canvasFont(family: string, weight: number, size: number): string {
  const font = realFont(family, weight);
  return `${size}px "${font.family} ${font.weight}"`;
}

// ---- pictures ----

const pictures = new Map<string, Promise<HTMLImageElement | null>>();

function loadPicture(url: string): Promise<HTMLImageElement | null> {
  let pending = pictures.get(url);
  if (!pending) {
    pending = new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = url;
    });
    pictures.set(url, pending);
  }
  return pending;
}

function resolveText(text: string, env: CardEnv): string {
  const values = tokenValues(env.context);
  return text.replace(/\{\s*([a-zA-Z0-9_.:|-]+)\s*\}/g, (match, token) => findSample(values, token)?.text ?? match);
}

/** The picture for a layer or background source: an uploaded file, a variable such as {user.avatar}, or a link. */
async function loadSource(src: string, env: CardEnv): Promise<HTMLImageElement | null> {
  const token = src.trim();
  if (token === '{user.avatar}' || token === '{user_avatar}' || token === '{user.display_avatar}') return loadPicture(env.avatarUrl);
  if (token === '{guild.icon}' || token === '{server_icon}') return loadPicture(env.serverIconUrl);
  const value = resolveText(src, env).trim();
  if (!value) return null;
  const asset = /^asset:(\d{1,18})$/.exec(value);
  if (asset) return loadPicture(env.assetUrl(asset[1]));
  return /^https:\/\//i.test(value) ? loadPicture(value) : null;
}

// ---- drawing ----

type Ctx = CanvasRenderingContext2D;

function setShadow(ctx: Ctx, shadow: { color: string; blur: number; x: number; y: number } | null) {
  if (!shadow) return;
  ctx.shadowColor = shadow.color;
  ctx.shadowBlur = shadow.blur;
  ctx.shadowOffsetX = shadow.x;
  ctx.shadowOffsetY = shadow.y;
}

function clearShadow(ctx: Ctx) {
  ctx.shadowColor = 'rgba(0,0,0,0)';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function roundedPath(ctx: Ctx, x: number, y: number, w: number, h: number, radius: number) {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function fitRect(iw: number, ih: number, bx: number, by: number, bw: number, bh: number, fit: string) {
  if (fit === 'stretch') return { x: bx, y: by, w: bw, h: bh };
  const scale = fit === 'contain' ? Math.min(bw / iw, bh / ih) : Math.max(bw / iw, bh / ih);
  const w = iw * scale;
  const h = ih * scale;
  return { x: bx + (bw - w) / 2, y: by + (bh - h) / 2, w, h };
}

async function drawBackground(ctx: Ctx, card: CardData, env: CardEnv) {
  const { background, width, height } = card;
  ctx.fillStyle = background.color;
  ctx.fillRect(0, 0, width, height);
  if (background.gradient) {
    const angle = (background.gradient.angle * Math.PI) / 180;
    const dx = (Math.sin(angle) * width) / 2;
    const dy = (-Math.cos(angle) * height) / 2;
    const gradient = ctx.createLinearGradient(width / 2 - dx, height / 2 - dy, width / 2 + dx, height / 2 + dy);
    gradient.addColorStop(0, background.gradient.from);
    gradient.addColorStop(1, background.gradient.to);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  if (background.image) {
    const image = await loadSource(background.image.src, env);
    if (image) {
      const box = fitRect(image.naturalWidth, image.naturalHeight, 0, 0, width, height, background.image.fit);
      ctx.save();
      if (background.image.blur > 0) ctx.filter = `blur(${background.image.blur}px)`;
      ctx.drawImage(image, box.x, box.y, box.w, box.h);
      ctx.restore();
    }
  }
  if (background.overlay) {
    ctx.save();
    ctx.globalAlpha = background.overlay.opacity;
    ctx.fillStyle = background.overlay.color;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}

function drawShape(ctx: Ctx, layer: ShapeLayer) {
  setShadow(ctx, layer.shadow);
  ctx.fillStyle = layer.fill;
  if (layer.shape === 'circle') {
    ctx.beginPath();
    ctx.ellipse(0, 0, layer.w / 2, layer.h / 2, 0, 0, Math.PI * 2);
  } else {
    roundedPath(ctx, -layer.w / 2, -layer.h / 2, layer.w, layer.h, layer.radius);
  }
  ctx.fill();
  clearShadow(ctx);
  if (layer.stroke) {
    ctx.strokeStyle = layer.stroke.color;
    ctx.lineWidth = layer.stroke.width;
    ctx.stroke();
  }
}

async function drawImage(ctx: Ctx, layer: ImageLayer, env: CardEnv) {
  if (!layer.src) return;
  const image = await loadSource(layer.src, env);
  if (!image) return;
  setShadow(ctx, layer.shadow);
  if (layer.shadow) {
    roundedPath(ctx, -layer.w / 2, -layer.h / 2, layer.w, layer.h, layer.radius);
    ctx.fillStyle = '#000000';
    ctx.fill();
    clearShadow(ctx);
  }
  ctx.save();
  roundedPath(ctx, -layer.w / 2, -layer.h / 2, layer.w, layer.h, layer.radius);
  ctx.clip();
  const box = fitRect(image.naturalWidth, image.naturalHeight, -layer.w / 2, -layer.h / 2, layer.w, layer.h, layer.fit);
  ctx.drawImage(image, box.x, box.y, box.w, box.h);
  ctx.restore();
}

function drawBar(ctx: Ctx, layer: BarLayer, env: CardEnv) {
  const parsed = parseFloat(resolveText(layer.value ?? '', env).replace(',', '.'));
  const percent = Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 0;
  const left = -layer.w / 2;
  const top = -layer.h / 2;
  setShadow(ctx, layer.shadow);
  ctx.save();
  ctx.globalAlpha *= layer.trackOpacity;
  ctx.fillStyle = layer.track;
  roundedPath(ctx, left, top, layer.w, layer.h, layer.radius);
  ctx.fill();
  ctx.restore();
  clearShadow(ctx);
  const filled = (layer.w * percent) / 100;
  if (filled <= 0) return;
  ctx.save();
  roundedPath(ctx, left, top, layer.w, layer.h, layer.radius);
  ctx.clip();
  if (layer.fill2) {
    const gradient = ctx.createLinearGradient(left, 0, left + layer.w, 0);
    gradient.addColorStop(0, layer.fill);
    gradient.addColorStop(1, layer.fill2);
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = layer.fill;
  }
  roundedPath(ctx, left, top, filled, layer.h, Math.min(layer.radius, filled / 2));
  ctx.fill();
  ctx.restore();
}

function avatarPath(ctx: Ctx, layer: AvatarLayer) {
  const half = layer.size / 2;
  if (layer.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(0, 0, half, 0, Math.PI * 2);
  } else {
    roundedPath(ctx, -half, -half, layer.size, layer.size, layer.shape === 'rounded' ? layer.size * 0.22 : 0);
  }
}

function drawAvatar(ctx: Ctx, layer: AvatarLayer, image: HTMLImageElement | null) {
  if (layer.shadow) {
    setShadow(ctx, layer.shadow);
    avatarPath(ctx, layer);
    ctx.fillStyle = '#000000';
    ctx.fill();
    clearShadow(ctx);
  }
  ctx.save();
  avatarPath(ctx, layer);
  ctx.clip();
  if (image) {
    ctx.drawImage(image, -layer.size / 2, -layer.size / 2, layer.size, layer.size);
  } else {
    ctx.fillStyle = '#4e5058';
    ctx.fillRect(-layer.size / 2, -layer.size / 2, layer.size, layer.size);
  }
  ctx.restore();
  if (layer.border) {
    ctx.save();
    ctx.strokeStyle = layer.border.color;
    ctx.lineWidth = layer.border.width * 2;
    // Only the half of the line that falls outside the avatar is kept, so the border grows outward.
    ctx.beginPath();
    ctx.rect(-layer.size, -layer.size, layer.size * 2, layer.size * 2);
    avatarPath(ctx, layer);
    ctx.clip('evenodd');
    avatarPath(ctx, layer);
    ctx.stroke();
    ctx.restore();
  }
}

function wrapLines(ctx: Ctx, value: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const paragraph of value.split('\n')) {
    if (!maxWidth) { lines.push(paragraph); continue; }
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const attempt = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(attempt).width > maxWidth) { lines.push(line); line = word; } else { line = attempt; }
    }
    lines.push(line);
  }
  return lines.slice(0, MAX_TEXT_LINES);
}

function drawText(ctx: Ctx, layer: TextLayer, env: CardEnv) {
  let value = resolveText(layer.text, env);
  if (layer.upper) value = value.toUpperCase();
  if (!value) return;
  ctx.font = canvasFont(layer.font, layer.weight, layer.size);
  ctx.textAlign = layer.align;
  ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) (ctx as Ctx & { letterSpacing: string }).letterSpacing = `${layer.spacing}px`;
  const lines = wrapLines(ctx, value.replace(/\r/g, ''), layer.w);
  const lineHeight = layer.size * layer.lineHeight;
  const top = -((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    const y = top + index * lineHeight;
    if (layer.stroke) {
      ctx.lineJoin = 'round';
      ctx.strokeStyle = layer.stroke.color;
      ctx.lineWidth = layer.stroke.width * 2;
      ctx.strokeText(line, 0, y);
    }
    setShadow(ctx, layer.shadow);
    ctx.fillStyle = layer.color;
    ctx.fillText(line, 0, y);
    clearShadow(ctx);
  });
}

/** Draws the card into `target`. Everything is drawn off screen first and copied in one step, so the picture never shows half a card. */
export async function drawCard(target: HTMLCanvasElement, card: CardData, env: CardEnv, isCurrent: () => boolean): Promise<void> {
  // Fonts and pictures come first, so the drawing itself has nothing left to wait for.
  const fonts = card.layers.filter((l): l is TextLayer => l.type === 'text').map((l) => loadFont(l.font, l.weight));
  await Promise.all(fonts);
  if (!isCurrent()) return;

  const canvas = document.createElement('canvas');
  canvas.width = card.width;
  canvas.height = card.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  await drawBackground(ctx, card, env);
  for (const layer of card.layers as Layer[]) {
    ctx.save();
    try {
      ctx.globalAlpha = layer.opacity;
      ctx.translate(layer.x, layer.y);
      if (layer.rotation) ctx.rotate((layer.rotation * Math.PI) / 180);
      if (layer.type === 'shape') drawShape(ctx, layer);
      else if (layer.type === 'image') await drawImage(ctx, layer, env);
      else if (layer.type === 'bar') drawBar(ctx, layer, env);
      else if (layer.type === 'avatar') drawAvatar(ctx, layer, await loadPicture(layer.source === 'server' ? env.serverIconUrl : env.avatarUrl));
      else drawText(ctx, layer, env);
    } finally {
      ctx.restore();
    }
  }
  if (!isCurrent()) return;
  if (target.width !== card.width) target.width = card.width;
  if (target.height !== card.height) target.height = card.height;
  const out = target.getContext('2d');
  out?.clearRect(0, 0, card.width, card.height);
  out?.drawImage(canvas, 0, 0);
}
