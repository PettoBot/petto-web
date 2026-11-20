// The geometry of the isometric drawings (HomeLayers, IsoArt): a box is three polygons, and every scene measures its own points so its view box fits it.
// x goes right and down, y goes left and down, z goes up. Nothing here draws: the components do, and the movement is CSS.
export const S = 30;
export type P2 = [number, number];
export const P = (x: number, y: number, z: number): P2 => [(x - y) * 0.866 * S, (x + y) * 0.5 * S - z * S];
export const str = (a: P2[]) => a.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

export interface Faces { top: string; left: string; right: string }

export function scene(pad = 34) {
  const pts: P2[] = [];
  const add = (a: P2[]) => { pts.push(...a); return a; };
  const box = (x: number, y: number, z: number, w: number, d: number, h: number): Faces => {
    const p = (a: number, b: number, c: number) => P(x + a, y + b, z + c);
    return {
      top: str(add([p(0, 0, h), p(w, 0, h), p(w, d, h), p(0, d, h)])),
      right: str(add([p(w, 0, 0), p(w, d, 0), p(w, d, h), p(w, 0, h)])),
      left: str(add([p(0, d, 0), p(w, d, 0), p(w, d, h), p(0, d, h)])),
    };
  };
  /** A line on the plane of a box (used for the "text" lines drawn on a card). */
  const line = (a: P2, b: P2) => ({ x1: a[0].toFixed(1), y1: a[1].toFixed(1), x2: b[0].toFixed(1), y2: b[1].toFixed(1) });
  /** The view box of the drawing, always 4:3 and centered on it. */
  const view = () => {
    const xs = pts.map((q) => q[0]); const ys = pts.map((q) => q[1]);
    let minX = Math.min(...xs) - pad; let maxX = Math.max(...xs) + pad; let minY = Math.min(...ys) - pad; let maxY = Math.max(...ys) + pad;
    const w = maxX - minX; const h = maxY - minY;
    if (w / h > 4 / 3) { const nh = (w * 3) / 4; minY -= (nh - h) / 2; maxY = minY + nh; } else { const nw = (h * 4) / 3; minX -= (nw - w) / 2; maxX = minX + nw; }
    return `${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}`;
  };
  return { box, add, line, view };
}
