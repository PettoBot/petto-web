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
  /** The address of one of the designs that come with Petto, by its id. */
  designUrl: (id: string) => string;
}

// ---- fonts ----

const loadedFonts = new Map<string, Promise<void>>();
const slugOf = (family: string) => family.toLowerCase().replace(/\s+/g, '-');

/** The weights of every font, as the bot has them. A weight a font lacks falls back to the nearest one it has. */
const WEIGHTS: Record<string, number[]> = {
  Poppins: [400, 700, 800], Inter: [400, 700, 800], Montserrat: [400, 700, 800], 'Bebas Neue': [400],
  Oswald: [400, 700], 'Playfair Display': [400, 700], 'Roboto Mono': [400, 700], Fredoka: [400, 700], Caveat: [400, 700],
  Anton: [400], Pacifico: [400], Lobster: [400], Righteous: [400], Bangers: [400], 'Permanent Marker': [400], 'Press Start 2P': [400],
  'Nunito': [400, 700, 800], 'Quicksand': [400, 700], 'Space Grotesk': [400, 700], 'Orbitron': [400, 700, 800], 'Dancing Script': [400, 700], 'Comfortaa': [400, 700], 'Rubik': [400, 700, 800], 'Russo One': [400], 'Cinzel': [400, 700, 800], 'Abril Fatface': [400], 'Satisfy': [400], 'Shadows Into Light': [400], 'VT323': [400], 'Audiowide': [400], 'Baloo 2': [400, 700, 800], 'Bungee': [400], 'Chewy': [400], 'Creepster': [400], 'Special Elite': [400], 'Great Vibes': [400], 'Kanit': [400, 700, 800], 'Archivo Black': [400], 'Lilita One': [400], 'Staatliches': [400],
};
const DEFAULT_FONT = 'Poppins';

function realFont(family: string, weight: number): { family: string; weight: number } {
  const name = WEIGHTS[family] ? family : DEFAULT_FONT;
  const weight_ = WEIGHTS[name].reduce((best, candidate) => (Math.abs(candidate - weight) < Math.abs(best - weight) ? candidate : best), WEIGHTS[name][0]);
  return { family: name, weight: weight_ };
}

const fontsReady = new Set<string>();

/** Starts a font (once) and says whether it is already there; the promise is for whoever wants to wait for it. */
function loadFont(family: string, weight: number): Promise<void> {
  const font = realFont(family, weight);
  const key = `${font.family} ${font.weight}`;
  let pending = loadedFonts.get(key);
  if (!pending) {
    const face = new FontFace(key, `url(${FONT_BASE}${slugOf(font.family)}-${font.weight}.woff2) format("woff2")`);
    pending = face.load().then((loaded) => { document.fonts.add(loaded); fontsReady.add(key); }).catch(() => { loadedFonts.delete(key); });
    loadedFonts.set(key, pending);
  }
  return pending;
}

function fontIsReady(family: string, weight: number): boolean {
  const font = realFont(family, weight);
  return fontsReady.has(`${font.family} ${font.weight}`);
}

function canvasFont(family: string, weight: number, size: number): string {
  const font = realFont(family, weight);
  return `${size}px "${font.family} ${font.weight}"`;
}

// ---- pictures ----

const pictures = new Map<string, Promise<HTMLImageElement | null>>();
/** The pictures that have arrived (null: it could not be read), so a drawing can use them without waiting. */
const arrived = new Map<string, HTMLImageElement | null>();

function loadPicture(url: string): Promise<HTMLImageElement | null> {
  let pending = pictures.get(url);
  if (!pending) {
    pending = new Promise((resolve) => {
      const image = new Image();
      image.onload = () => { arrived.set(url, image); resolve(image); };
      // A picture that failed is left out for half a minute (so the drawing does not ask again at once) and then it may be tried again.
      image.onerror = () => {
        arrived.set(url, null);
        setTimeout(() => { arrived.delete(url); pictures.delete(url); }, 30000);
        resolve(null);
      };
      image.src = url;
    });
    pictures.set(url, pending);
  }
  return pending;
}

/** What a drawing is still waiting for: the pictures and fonts it asked for that were not there yet. */
type Needs = Promise<unknown>[];

/** The picture if it is already here; otherwise it starts coming, the drawing goes on without it, and `needs` says so. */
function peekPicture(url: string, needs: Needs): HTMLImageElement | null {
  if (!url) return null;
  if (arrived.has(url)) return arrived.get(url) ?? null;
  needs.push(loadPicture(url));
  return null;
}

function resolveText(text: string, env: CardEnv): string {
  const values = tokenValues(env.context);
  return text.replace(/\{\s*([a-zA-Z0-9_.:|-]+)\s*\}/g, (match, token) => findSample(values, token)?.text ?? match);
}

/** The picture for a layer or background source: an uploaded file, a variable such as {user.avatar}, or a link. */
function loadSource(src: string, env: CardEnv, needs: Needs): HTMLImageElement | null {
  const token = src.trim();
  if (token === '{user.avatar}' || token === '{user_avatar}' || token === '{user.display_avatar}') return peekPicture(env.avatarUrl, needs);
  if (token === '{guild.icon}' || token === '{server_icon}') return peekPicture(env.serverIconUrl, needs);
  const value = resolveText(src, env).trim();
  if (!value) return null;
  const asset = /^asset:(\d{1,18})$/.exec(value);
  if (asset) return peekPicture(env.assetUrl(asset[1]), needs);
  // One of the pictures that come with Petto.
  const own = /^petto:([a-z0-9-]{3,30})$/.exec(value);
  if (own) return peekPicture(env.designUrl(own[1]), needs);
  return /^https:\/\//i.test(value) ? peekPicture(value, needs) : null;
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

function drawBackground(ctx: Ctx, card: CardData, env: CardEnv, needs: Needs) {
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
    const image = loadSource(background.image.src, env, needs);
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

/** A hexagon with its point up that fills `w` by `h`, with its corners rounded by `radius` (as the bot draws it). */
function hexagonPath(ctx: Ctx, w: number, h: number, radius: number) {
  const points: [number, number][] = [];
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    points.push([Math.cos(angle) * (w / 2), Math.sin(angle) * (h / 2)]);
  }
  const r = Math.max(0, Math.min(radius, Math.min(w, h) / 4));
  const toward = (a: [number, number], b: [number, number], d: number): [number, number] => { const dx = b[0] - a[0]; const dy = b[1] - a[1]; const len = Math.hypot(dx, dy) || 1; return [a[0] + (dx / len) * d, a[1] + (dy / len) * d]; };
  ctx.beginPath();
  points.forEach((point, i) => {
    const start = toward(point, points[(i + 5) % 6], r);
    const end = toward(point, points[(i + 1) % 6], r);
    if (i === 0) ctx.moveTo(start[0], start[1]); else ctx.lineTo(start[0], start[1]);
    ctx.quadraticCurveTo(point[0], point[1], end[0], end[1]);
  });
  ctx.closePath();
}

function drawShape(ctx: Ctx, layer: ShapeLayer) {
  setShadow(ctx, layer.shadow);
  ctx.fillStyle = layer.fill;
  if (layer.shape === 'circle') {
    ctx.beginPath();
    ctx.ellipse(0, 0, layer.w / 2, layer.h / 2, 0, 0, Math.PI * 2);
  } else if (layer.shape === 'hexagon') {
    hexagonPath(ctx, layer.w, layer.h, layer.radius);
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

function drawImage(ctx: Ctx, layer: ImageLayer, env: CardEnv, needs: Needs) {
  if (!layer.src) return;
  const image = loadSource(layer.src, env, needs);
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

const FIT_MIN = 0.55;
/** The first `max` lines, with the last one shortened (and an ellipsis at its end) so that it fits `maxWidth`. */
function ellipsize(ctx: Ctx, lines: string[], max: number, maxWidth: number): string[] {
  const kept = lines.slice(0, max);
  let last = `${kept[max - 1]}…`;
  while (maxWidth && last.length > 1 && ctx.measureText(last).width > maxWidth) last = `${last.slice(0, -2).trimEnd()}…`;
  kept[max - 1] = last;
  return kept;
}

/** The size and lines a text takes: a text with `fit` gets smaller, down to 55%, until it fits its width in the lines it may use; one that still does not fit is cut with an ellipsis. */
function layOut(ctx: Ctx, layer: TextLayer, value: string): { size: number; lines: string[] } {
  const wrapped = (size: number) => {
    ctx.font = canvasFont(layer.font, layer.weight, size);
    if ('letterSpacing' in ctx) (ctx as Ctx & { letterSpacing: string }).letterSpacing = `${(layer.spacing * size) / layer.size}px`;
    return wrapLines(ctx, value, layer.w);
  };
  let size = layer.size;
  let lines = wrapped(size);
  const maxLines = layer.maxLines ?? 0;
  if (layer.fit && layer.w > 0) {
    const allowed = maxLines > 0 ? maxLines : MAX_TEXT_LINES;
    while (lines.length > allowed && size > layer.size * FIT_MIN) { size = Math.max(layer.size * FIT_MIN, size * 0.93); lines = wrapped(size); }
  }
  if (maxLines > 0 && lines.length > maxLines) lines = ellipsize(ctx, lines, maxLines, layer.w);
  return { size, lines };
}

/** Draws a text and gives back the width of its widest line, or null when there was nothing to draw. */
function drawText(ctx: Ctx, layer: TextLayer, env: CardEnv): number | null {
  let value = resolveText(layer.text, env);
  if (layer.upper) value = value.toUpperCase();
  if (!value) return null;
  ctx.textAlign = layer.align;
  ctx.textBaseline = 'middle';
  const { size, lines } = layOut(ctx, layer, value.replace(/\r/g, ''));
  const lineHeight = size * layer.lineHeight;
  const top = -((lines.length - 1) * lineHeight) / 2;
  const width = Math.max(...lines.map((line) => ctx.measureText(line).width));
  if (layer.pill) {
    const { padX, padY } = layer.pill;
    const boxW = width + padX * 2;
    const boxH = lines.length * lineHeight + padY * 2 - (lineHeight - size);
    const left = layer.align === 'center' ? -boxW / 2 : layer.align === 'right' ? -width - padX : -padX;
    ctx.save();
    ctx.globalAlpha *= layer.pill.opacity;
    ctx.fillStyle = layer.pill.color;
    roundedPath(ctx, left, -boxH / 2, boxW, boxH, layer.pill.radius);
    ctx.fill();
    ctx.restore();
  }
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
  return width;
}

/**
 * The layers of a basic card come from its layout without the settings the bot fills in when it saves a card (line height, no stroke, no shadow...): this gives them,
 * so the same layer draws the same here and there. A layer that already has them is left as it is.
 */
export function withDefaults(layers: Layer[]): Layer[] {
  return layers.map((raw) => {
    const layer = { rotation: 0, opacity: 1, showIf: '', follow: '', gap: 12, ...raw } as Layer & Record<string, unknown>;
    const shadow = (layer as { shadow?: unknown }).shadow;
    (layer as { shadow?: unknown }).shadow = shadow && typeof shadow === 'object' ? shadow : null;
    if (layer.type === 'text') Object.assign(layer, { lineHeight: layer.lineHeight ?? 1.15, spacing: layer.spacing ?? 0, upper: layer.upper === true, stroke: layer.stroke ?? null, w: layer.w ?? 0, pill: layer.pill ?? null });
    if (layer.type === 'shape') Object.assign(layer, { stroke: layer.stroke ?? null, radius: layer.radius ?? 0 });
    if (layer.type === 'avatar') Object.assign(layer, { border: layer.border ?? null });
    if (layer.type === 'image') Object.assign(layer, { radius: layer.radius ?? 0 });
    return layer as Layer;
  });
}

/** How far a layer reaches to the left of its x, so a layer that follows another one starts after it. */
function leftReach(layer: Layer): number {
  if (layer.type === 'shape' || layer.type === 'image' || layer.type === 'bar') return layer.w / 2;
  if (layer.type === 'avatar') return layer.size / 2;
  return layer.type === 'text' && layer.align === 'left' && layer.pill ? layer.pill.padX : 0;
}
/** How far a text of `width` reaches to the right of its x (with the padding of its pill). */
function rightReach(layer: TextLayer, width: number): number {
  const pad = layer.pill ? layer.pill.padX : 0;
  if (layer.align === 'center') return width / 2 + pad;
  if (layer.align === 'right') return pad;
  return width + pad;
}

/** Draws the card into `target`. Everything is drawn off screen first and copied in one step, so the picture never shows half a card. */
/** One pass of the drawing, from what is here now. Whatever is not here yet (a font, a picture) is left out and listed in `needs`. */
function paintCard(target: HTMLCanvasElement, card: CardData, env: CardEnv, needs: Needs) {
  for (const layer of card.layers) {
    if (layer.type === 'text' && !fontIsReady(layer.font, layer.weight)) needs.push(loadFont(layer.font, layer.weight));
  }
  const canvas = document.createElement('canvas');
  canvas.width = card.width;
  canvas.height = card.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawBackground(ctx, card, env, needs);
  // The right edge of every layer that was drawn, by id, for the layers that follow one.
  const edges = new Map<string, number>();
  for (const layer of card.layers as Layer[]) {
    // A layer with `showIf` is only drawn when that text is not empty: a variable this preview cannot give (the decoration of the avatar, the nameplate) stays as it
    // was written, and counts as empty here.
    if (layer.showIf) {
      const shown = resolveText(layer.showIf, env).trim();
      if (!shown || shown === layer.showIf.trim()) continue;
    }
    let x = layer.x;
    const anchor = layer.follow ? layer.follow.split(',').find((id) => edges.has(id)) : null;
    if (anchor) x = (edges.get(anchor) as number) + (layer.gap ?? 12) + leftReach(layer);
    ctx.save();
    try {
      ctx.globalAlpha = layer.opacity;
      ctx.translate(x, layer.y);
      if (layer.rotation) ctx.rotate((layer.rotation * Math.PI) / 180);
      let right: number | null = null;
      if (layer.type === 'shape') { drawShape(ctx, layer); right = x + layer.w / 2; }
      else if (layer.type === 'image') { drawImage(ctx, layer, env, needs); right = x + layer.w / 2; }
      else if (layer.type === 'bar') { drawBar(ctx, layer, env); right = x + layer.w / 2; }
      else if (layer.type === 'avatar') { drawAvatar(ctx, layer, peekPicture(layer.source === 'server' ? env.serverIconUrl : env.avatarUrl, needs)); right = x + layer.size / 2; }
      else { const width = drawText(ctx, layer, env); if (width !== null) right = x + rightReach(layer, width); }
      if (right !== null) edges.set(layer.id, right);
    } finally {
      ctx.restore();
    }
  }
  if (target.width !== card.width) target.width = card.width;
  if (target.height !== card.height) target.height = card.height;
  const out = target.getContext('2d');
  out?.clearRect(0, 0, card.width, card.height);
  out?.drawImage(canvas, 0, 0);
}

/**
 * Draws the card at once with what is already here, and draws it again each time a font or a picture it needed arrives, so a slow picture (a big design coming
 * through the bot) never leaves the preview empty: the colors, shapes and texts show first and the picture joins when it comes.
 */
export async function drawCard(target: HTMLCanvasElement, card: CardData, env: CardEnv, isCurrent: () => boolean, onPainted?: () => void): Promise<void> {
  for (let pass = 0; pass < 60; pass += 1) {
    if (!isCurrent()) return;
    const needs: Needs = [];
    paintCard(target, card, env, needs);
    onPainted?.();
    if (!needs.length) return;
    await Promise.race(needs);
  }
}
