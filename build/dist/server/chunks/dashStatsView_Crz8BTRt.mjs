import { s as summarize } from './statsCore_h_kq9w3r.mjs';

const SERIES_KEYS = ["messages", "reactions", "voice", "joins", "leaves", "invited", "sanctions", "net", "members"];
const FIRST_OF = { messages: "activity", reactions: "activity", voice: "activity", joins: "flow", leaves: "flow", invited: "flow", net: "flow", members: "flow", sanctions: null };
const EDGE_OF = { messages: "messages", reactions: "reactions", voice: "voiceSeconds", joins: "joins", leaves: "leaves", invited: "invited" };
function buildSeries(stats, analysis, memberTotal) {
  const days = stats.days;
  const lastIndex = days.length - 1;
  const net = stats.daily.joins.map((joins, i) => joins - stats.daily.leaves[i]);
  const raw = {
    messages: stats.daily.messages,
    reactions: stats.daily.reactions,
    voice: stats.daily.voice,
    joins: stats.daily.joins,
    leaves: stats.daily.leaves,
    invited: stats.daily.invited,
    sanctions: stats.sanctions.daily,
    net,
    members: []
  };
  if (memberTotal !== null && memberTotal > 0 && days.length) {
    const members = Array(days.length).fill(0);
    members[lastIndex] = memberTotal;
    for (let i = lastIndex; i > 0; i -= 1) members[i - 1] = members[i] - net[i];
    raw.members = members;
  }
  const out = {};
  for (const key of SERIES_KEYS) {
    const level = key === "members";
    const values = raw[key];
    const family = FIRST_OF[key];
    const first = family ? analysis.counted[family] : days[0];
    let start = first === null || !values.length ? days.length : days.findIndex((day) => day >= first);
    if (start < 0) start = days.length;
    const slice = days.slice(start).map((day, i) => ({ day, value: values[start + i] }));
    const broken = level && slice.some((point) => point.value < 1);
    const points = broken ? [] : slice;
    if (!level && points.length && start + points.length - 1 === lastIndex) points[points.length - 1].partial = true;
    const edgeKey = EDGE_OF[key];
    const before = first !== null && start === 0 && first < days[0];
    const edge = !before ? null : edgeKey ? analysis.edge[edgeKey] : key === "net" ? analysis.edge.joins - analysis.edge.leaves : null;
    out[key] = { key, points: level && broken ? [] : points, edge, level };
  }
  return out;
}
function pointChanges(series) {
  return series.points.map((point, i) => {
    if (point.partial) return null;
    if (i === 0) return series.edge === null ? null : point.value - series.edge;
    return point.value - series.points[i - 1].value;
  });
}
function dayRows(all, keys) {
  const byDay = /* @__PURE__ */ new Map();
  for (const key of keys) {
    const series = all[key];
    const changes = pointChanges(series);
    series.points.forEach((point, i) => {
      const row = byDay.get(point.day) ?? { day: point.day, today: false, cells: {} };
      row.cells[key] = { value: point.value, change: changes[i] };
      if (point.partial) row.today = true;
      byDay.set(point.day, row);
    });
  }
  return [...byDay.values()].sort((a, b) => a.day < b.day ? 1 : -1);
}
function seriesSummary(series) {
  const sum = summarize(series.points, series.level ? "level" : "flow");
  return { average: sum.average, high: sum.high, low: sum.low, fullDays: sum.fullDays };
}
function changeChip(value, inverse, locale, newText) {
  if (value === null) return { text: newText, tone: "flat", arrow: "" };
  if (value === 0) return { text: "0%", tone: "flat", arrow: "" };
  const good = value > 0 !== inverse;
  return { text: `${Math.abs(value).toLocaleString(locale)}%`, tone: good ? "good" : "bad", arrow: value > 0 ? "▲" : "▼" };
}

export { buildSeries as b, changeChip as c, dayRows as d, seriesSummary as s };
