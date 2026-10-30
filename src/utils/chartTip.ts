/** The data of a chart's tooltip (scripts/chart-tip.js): x and y are fractions (0-1) of the plot, f the fields of the tooltip. */
export interface ChartTipPoint { x: number; y: number[]; f: Record<string, string | number> }
const r4 = (v: number) => Math.round(v * 10000) / 10000;
export function chartTipJson(points: ChartTipPoint[]): string {
  return JSON.stringify({ points: points.map((p) => ({ x: r4(p.x), y: p.y.map(r4), f: p.f })) }).replace(/</g, '\\u003c');
}
