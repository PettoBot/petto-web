const r4 = (v) => Math.round(v * 1e4) / 1e4;
function chartTipJson(points) {
  return JSON.stringify({ points: points.map((p) => ({ x: r4(p.x), y: p.y.map(r4), f: p.f })) }).replace(/</g, "\\u003c");
}

export { chartTipJson as c };
