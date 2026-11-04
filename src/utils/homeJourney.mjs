// The pure parts of the drawing that winds down the home page (src/components/HomeJourney.astro): which of the three drawings (caterpillar, chrysalis,
// butterfly) is shown at a point of the journey, and the route itself, worked out from the measured sections of the page. Plain JavaScript with no DOM
// so scripts/check-home-journey.mjs can check it with node alone.

/** Where the journey changes: the caterpillar until about 40 percent, the chrysalis until about 60 percent, then the butterfly. */
export const CHRYSALIS_FROM = 0.4;
export const BUTTERFLY_FROM = 0.6;
/** How much of the journey one cross-fade takes (half before the edge, half after it). */
export const BLEND = 0.05;
/** The distance between two dots of the dotted trail. */
export const DOT_GAP = 14;
/** The last part of the scroll walks the last stretch of the path (the flight to the end), whatever its height on the page. */
export const FINAL_SHARE = 0.1;
/** Half of the width of the widest drawing (the butterfly) and half of its height, in drawing units. */
export const HALF_W = 62;
export const HALF_H = 56;

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const smooth = (t) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };
const lerp = (a, b, t) => a + (b - a) * t;
const edge = (p, at) => smooth((p - (at - BLEND / 2)) / BLEND);

/**
 * Which drawing is shown at a progress of the journey (0 at the start of the path, 1 at its end). Every drawing has an opacity from 0 to 1 and a scale, so the
 * change is a cross-fade with a small pop, not a cut. With reduced motion there is only the finished picture: the butterfly.
 * @param {number} progress
 * @param {boolean} [reduced]
 * @returns {{ name: 'caterpillar' | 'chrysalis' | 'butterfly', caterpillar: number, chrysalis: number, butterfly: number, scale: { caterpillar: number, chrysalis: number, butterfly: number } }}
 */
export function journeyState(progress, reduced = false) {
  if (reduced) return { name: 'butterfly', caterpillar: 0, chrysalis: 0, butterfly: 1, scale: { caterpillar: 0.6, chrysalis: 0.6, butterfly: 1 } };
  const p = clamp(Number.isFinite(progress) ? progress : 0, 0, 1);
  const toChrysalis = edge(p, CHRYSALIS_FROM);
  const toButterfly = edge(p, BUTTERFLY_FROM);
  const caterpillar = 1 - toChrysalis;
  const chrysalis = toChrysalis * (1 - toButterfly);
  const butterfly = toButterfly;
  const name = p < CHRYSALIS_FROM ? 'caterpillar' : p < BUTTERFLY_FROM ? 'chrysalis' : 'butterfly';
  const pop = (o) => 0.6 + 0.4 * o;
  return { name, caterpillar, chrysalis, butterfly, scale: { caterpillar: pop(caterpillar), chrysalis: pop(chrysalis), butterfly: pop(butterfly) } };
}

/** How many dots of the trail are drawn once the drawing has walked a length of the path (the first dot is at the very start). @param {number} length */
export const dotsFor = (length) => Math.max(0, Math.floor(length / DOT_GAP) + 1);

/**
 * With reduced motion the page shows the whole story as a still picture: the caterpillar where the path starts, the chrysalis halfway and the butterfly at
 * the end (progress is the fraction of the way down the path).
 */
export const STATIC_SCENE = [
  { name: 'caterpillar', at: 0.02 },
  { name: 'chrysalis', at: 0.5 },
  { name: 'butterfly', at: 1 },
];

/**
 * @typedef {{ top: number, bottom: number, padTop: number, padBottom: number, left: number, right: number }} SectionBox
 *   A section of the page, measured from the top of the wrapper: where it starts and ends, how much padding it has above and below its content, and
 *   where its content starts and ends on the sides.
 * @typedef {{ x: number, y: number, k: number }} RoutePoint  A point of the route and the scale of the drawing there.
 */

const STEP = 16;
const MIN_CROSSING_GAP = 100;

/**
 * The route of the path: down the margin on the side of the page, crossing from one side to the other through the empty gap between two sections, and a
 * loop at the end. It never goes inside the content of a section: on the sides it stays in the margin (its wave is a fraction of the margin) and the
 * crossings stay in the gap between the content of two sections.
 * @param {{ width: number, sections: SectionBox[] }} layout
 * @returns {{ points: RoutePoint[], start: RoutePoint, end: RoutePoint, bottom: number, finalY: number, margin: number } | null}
 */
export function buildRoute({ width, sections }) {
  const secs = sections.filter((s) => s.bottom - s.top > 40 && s.right > s.left);
  if (!secs.length || width < 120) return null;
  const contentTop = (s) => s.top + s.padTop;
  const contentBottom = (s) => s.bottom - s.padBottom;
  const gl = Math.max(0, Math.min(...secs.map((s) => s.left)));
  const gr = Math.max(0, Math.min(...secs.map((s) => width - s.right)));
  const margin = Math.min(gl, gr);
  // A lane per side: its center, how far it waves and the scale of the drawing that fits in it.
  const lanes = {
    L: { x: gl / 2, wave: gl * 0.14, phase: 0, k: clamp((gl / 2 - gl * 0.14 - 2) / HALF_W, 0.22, 1) },
    R: { x: width - gr / 2, wave: gr * 0.14, phase: Math.PI, k: clamp((gr / 2 - gr * 0.14 - 2) / HALF_W, 0.22, 1) },
  };
  const WAVE_LENGTH = 340;
  const laneX = (side, y) => lanes[side].x + lanes[side].wave * Math.sin((y / WAVE_LENGTH) * Math.PI * 2 + lanes[side].phase);

  /** @type {RoutePoint[]} */
  const points = [];
  const push = (x, y, k) => points.push({ x, y, k });
  const lane = (side, from, to) => { for (let y = from; y < to; y += STEP) push(laneX(side, y), y, lanes[side].k); };

  const yStart = Math.min(contentTop(secs[0]) + 96, secs[0].bottom - 24);
  let side = 'L';
  let cursor = yStart;
  for (let i = 0; i < secs.length - 1; i += 1) {
    const gapTop = contentBottom(secs[i]);
    const gapBottom = contentTop(secs[i + 1]);
    const gap = gapBottom - gapTop;
    if (gap < MIN_CROSSING_GAP || gapTop <= cursor) continue; // too narrow to cross: keep going down the same margin
    const ya = gapTop + gap * 0.14;
    const yb = gapBottom - gap * 0.14;
    const other = side === 'L' ? 'R' : 'L';
    lane(side, cursor, ya);
    // The crossing: it leaves the margin going down, ripples across the gap and arrives in the other margin going down.
    const h = yb - ya;
    const kMid = Math.max(lanes[side].k, lanes[other].k, Math.min(1, (h * 0.9) / (2 * HALF_H)));
    const xa = laneX(side, ya);
    const xb = laneX(other, yb);
    const steps = Math.max(24, Math.ceil(Math.abs(xb - xa) / 28));
    for (let s = 0; s < steps; s += 1) {
      const u = s / steps;
      const e = smooth(smooth(u));
      const ripple = h * 0.13 * Math.sin(u * Math.PI * 4) * Math.sin(u * Math.PI);
      const base = lerp(lanes[side].k, lanes[other].k, e);
      push(lerp(xa, xb, e), ya + h * u + ripple, base + (kMid - base) * Math.pow(Math.sin(u * Math.PI), 0.8));
    }
    side = other;
    cursor = yb;
  }

  // The end: down the last margin, then out along the empty band under the last section, where the butterfly flies off toward the middle of the page in a
  // loop and gets smaller as it goes. (A section with no room under its content ends with a loop in the margin instead.)
  const last = secs[secs.length - 1];
  const yA = contentBottom(last) + 8;
  const yB = last.bottom - 12;
  const band = yB - yA;
  let finalY = yA;
  if (band >= 44) {
    const r = clamp(band * 0.2, 6, 20);
    const kEnd = clamp((band * 0.68) / (2 * HALF_H), 0.28, 1);
    const dir = side === 'L' ? 1 : -1;
    const yMid = yA + band * 0.66;
    const xa = laneX(side, yA);
    const xb = width / 2 - dir * r * 4;
    lane(side, cursor, yA);
    const steps = Math.max(24, Math.ceil(Math.abs(xb - xa) / 24));
    for (let s = 0; s < steps; s += 1) {
      const u = s / steps;
      const e = smooth(u);
      const ripple = band * 0.1 * Math.sin(u * Math.PI * 3) * Math.sin(u * Math.PI);
      push(lerp(xa, xb, e), lerp(yA, yMid, smooth(Math.min(1, u * 1.4))) + ripple, lerp(lanes[side].k, kEnd, e));
    }
    const turns = 1;
    const arc = 40;
    for (let s = 0; s <= arc; s += 1) {
      const a = (s / arc) * turns * Math.PI * 2;
      push(xb + dir * r * Math.sin(a) * 1.15 + dir * (s / arc) * r * 3, yMid - r * (1 - Math.cos(a)), kEnd);
    }
  } else {
    const loopR = clamp(lanes[side].x * 0.28, 4, 30);
    const yLoop = Math.max(cursor + 40, Math.min(contentBottom(last) - 18, last.bottom - 24) - 4 * loopR - 56);
    finalY = yLoop;
    lane(side, cursor, yLoop);
    const x0 = laneX(side, yLoop);
    const dir = side === 'L' ? -1 : 1;
    for (let s = 0; s <= 40; s += 1) {
      const a = (s / 40) * 1.12 * Math.PI * 2;
      push(x0 + dir * loopR * (1 - Math.cos(a)), yLoop + loopR * Math.sin(a) * 1.05 + (a / (Math.PI * 2)) * loopR * 0.9, lanes[side].k);
    }
  }
  for (const p of points) p.x = clamp(p.x, 2, width - 2);
  return { points, start: points[0], end: points[points.length - 1], bottom: Math.max(...points.map((p) => p.y)), finalY, margin };
}
