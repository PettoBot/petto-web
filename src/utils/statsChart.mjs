// The charts of the statistics, as markup: the smooth line with a zoomed vertical axis (messages, hours in voice, members...) and the
// bars (joins, leaves, hours of the day...), with the guide, the dots and the tooltip box that scripts/chart-tip.js moves. The public page
// (/stats, drawn in the browser) and the dashboard (per server, drawn on the server) call the same builders, so a chart looks and
// behaves the same in both. Pure: the words, the number formats and the day names come in as options; the look is in StatsChartStyle.astro.
import { LONG_RANGE_DAYS, monthTicks, nextDay, runsOf, smoothPath, isApprox, zoomScale } from './statsCore.mjs';

export const esc = (text) => String(text).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const r4 = (value) => Math.round(value * 10000) / 10000;
const DAY_MS = 86_400_000;

/**
 * The text of the ticks of the vertical axis: whole numbers (or one decimal for hours), and from 10,000 on the compact form
 * ("12K") with as few digits as keep every label different. `num` and `num1` format with 0 and 1 decimals.
 */
export function tickLabels(ticks, { locale, num, num1, fractional = false }) {
  const plain = ticks.map((value) => (fractional ? num1.format(value) : (Number.isInteger(value) ? num.format(value) : '')));
  if (Math.max(...ticks.map(Math.abs)) < 10_000) return fractional ? ticks.map((value) => (Number.isInteger(value) ? num.format(value) : num1.format(value))) : plain;
  for (let digits = 0; digits <= 2; digits += 1) {
    const formatter = new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: digits });
    const labels = ticks.map((value) => formatter.format(value));
    if (new Set(labels).size === labels.length) return labels;
  }
  return plain;
}

/**
 * Which points of a chart named by days get a label on the horizontal axis: the newest, then one every `gap` points going back, as many
 * as fit in `plotW` (`wide` when the newest label is the long "Today, so far"). Returns the indexes, oldest first.
 */
export function dayTickIndexes(count, plotW, wide) {
  if (count <= 1) return [0];
  const slots = Math.max(2, Math.min(count, Math.floor(plotW / (wide ? 140 : 84)) + 1));
  const gap = Math.max(1, Math.ceil((count - 1) / (slots - 1)));
  const picks = new Set();
  for (let index = count - 1; index >= 0; index -= gap) picks.add(index);
  return [...picks].sort((a, b) => a - b);
}

/** The markup around the SVG of every chart: the plot box the tooltip script binds to, the guide, the dot(s), the box and its data. */
function plotHtml({ svg, tipPoints, color, dots = 1, aria, fluid, height, extraClass = '', extra = '' }) {
  const tipJson = JSON.stringify({ points: tipPoints }).replace(/</g, '\\u003c');
  const dotMarks = Array.from({ length: dots }, () => `<i class="ct-dot" data-ct-dot style="--ct-c:${color}"></i>`).join('');
  return `<div class="sc-plot${fluid ? ' sc-fluid' : ''}${extraClass ? ` ${extraClass}` : ''}" data-ct data-ct-place="side" tabindex="0" role="group" aria-label="${esc(aria)}" style="--c:${color}${fluid ? '' : `;height:${height}px`}">`
    + svg
    + extra
    + `<i class="ct-guide" data-ct-guide></i>${dotMarks}`
    + '<div class="ct-tip ct-rich" data-ct-box><b data-ct-f="label"></b><small data-ct-f="tag"></small><span data-ct-f="value"></span><em data-ct-f="delta"></em></div>'
    + `<script type="application/json" data-ct-data>${tipJson}<\/script>`
    + '</div>';
}

function svgOpen({ W, H, fluid, animate, label }) {
  return `<svg ${fluid ? '' : `width="${W}" height="${H}" `}viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}" class="${animate ? 'sc-draw' : ''}">`;
}

/**
 * The movable window under a chart of days (`brush`: { kind: 'flow' | 'level', fmt, locale, text }), for DashChartRange.astro to run: a strip with
 * a small copy of the chart and a window that is dragged or stretched, the numbers of the days inside it (they count up and down as it moves) and a
 * shade over the rest of the chart. `edges` are the left and right limit of each day over the plot (0-1 of its width), `box` the plot area in the SVG.
 * Returns what plotHtml needs (`extra`, the shade) and a function that wraps the finished plot with the readout and the strip.
 */
function brushParts({ brush, points, edges, box, layout, color }) {
  const values = points.map((p) => p.value);
  const lo = Math.min(0, ...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const n = points.length;
  const yOf = (value) => r4(30 - ((value - lo) / span) * 26 - 1);
  let spark;
  if (layout === 'slots') {
    const w = 100 / n;
    spark = values.map((value, i) => `<rect x="${r4(i * w + w * 0.16)}" y="${yOf(Math.max(value, 0))}" width="${r4(w * 0.68)}" height="${r4(Math.max(0.6, Math.abs(yOf(value) - yOf(0))))}" class="cr-spark-bar"/>`).join('');
  } else {
    const xs = values.map((_, i) => r4(n > 1 ? (i / (n - 1)) * 100 : 50));
    const path = values.map((value, i) => `${i ? 'L' : 'M'}${xs[i]},${yOf(value)}`).join(' ');
    spark = `<path d="${path} L100,31 L0,31 Z" class="cr-spark-area"/><path d="${path}" class="cr-spark-line"/>`;
  }
  const data = {
    kind: brush.kind, layout, fmt: brush.fmt, locale: brush.locale,
    v: values.map(r4), p: points.map((p) => (p.partial ? 1 : 0)), d: points.map((p) => p.day),
    e: edges.map(([l, r]) => [r4(l), r4(r)]), box: box.map(r4),
  };
  const b = brush.text;
  const cells = brush.kind === 'level'
    ? [['end', b.end], ['change', b.change], ['high', b.high]]
    : [['total', b.total], ['avg', b.avg], ['versus', b.versus]];
  const readout = '<div class="cr-read" data-cr-read>'
    + `<div class="cr-head"><span class="cr-when" data-cr-when></span><button type="button" class="cr-all" data-cr-all>${esc(b.all)}</button></div>`
    + '<dl class="cr-cells">'
    + cells.map(([role, label]) => `<div class="cr-cell"><dt>${esc(label)}</dt><dd><span data-cr-n="${role}">–</span>${role === 'change' ? '<small data-cr-n="share"></small>' : ''}</dd></div>`).join('')
    + '</dl></div>';
  const strip = `<div class="cr-nav" data-cr-nav><svg viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true" class="cr-spark">${spark}</svg>`
    + '<i class="cr-shade cr-shade-l"></i><i class="cr-shade cr-shade-r"></i>'
    + `<div class="cr-win" data-cr-win tabindex="0" role="slider" aria-label="${esc(b.label)}" aria-valuemin="0" aria-valuemax="${n - 1}"><i class="cr-h cr-h-l" data-cr-h="left"></i><i class="cr-h cr-h-r" data-cr-h="right"></i></div></div>`;
  return {
    extra: '<i class="cr-dim cr-dim-l" data-cr-dim="l"></i><i class="cr-dim cr-dim-r" data-cr-dim="r"></i>',
    wrap: (plot) => `<div class="cr" data-cr style="--c:${color}">${readout}${plot}${strip}<script type="application/json" data-cr-data>${JSON.stringify(data).replace(/</g, '\\u003c')}<\/script></div>`,
  };
}

/** A window is only worth drawing for a stretch of days with room to move in. */
const BRUSH_MIN_POINTS = 8;

/**
 * A line chart of `points` (`{ day, value, partial?, estimated? }`, oldest first; a day missing between two points is a gap, never a joined line).
 * The vertical axis is zoomed to the data with round ticks; a stretch that is not a plain measurement (today so far, or days rebuilt afterwards)
 * is dashed, and today so far ends in an open dot and is named "Today, so far" on the axis and in the tooltip.
 *
 * Options: `points`, `W`, `H`, `color` (a CSS color), `format(value)` (the tooltip's number), `tickLabels(ticks)` (the axis text),
 * `dayText(day, Intl options)`, `signed(change)` (a change as text), `text: { todaySoFar, estimatedTag, changeVsPrev }`, `aria` (the plot's name),
 * `svgLabel`, `brush` (the movable window under the chart, see brushParts), `single` (one point only: a shorter chart and a two-tick axis), `floorZero` (default true), `fluid` (no fixed pixel size:
 * the SVG fills its box, which is how the dashboard scales it), `animate`.
 */
export function lineChart(o) {
  const { points, W, H, color, single = false, fluid = false, animate = false, floorZero = true, format, dayText, signed, text } = o;
  const shortDay = (day) => dayText(day, { month: 'short', day: 'numeric' });
  const scale = zoomScale(points.map((p) => p.value), single ? 2 : 4, floorZero);
  const labels = o.tickLabels(scale.ticks);
  const left = Math.min(70, Math.ceil(Math.max(...labels.map((l) => l.length)) * 6.6) + 14);
  const right = 14, top = 12, bottom = 28;
  const plotW = W - left - right, plotH = H - top - bottom;
  const first = Date.parse(`${points[0].day}T00:00:00Z`);
  const span = Date.parse(`${points[points.length - 1].day}T00:00:00Z`) - first;
  const xOf = (day) => left + (span ? ((Date.parse(`${day}T00:00:00Z`) - first) / span) * plotW : plotW / 2);
  const yOf = (value) => top + plotH - ((value - scale.min) / (scale.max - scale.min)) * plotH;
  const coords = points.map((p) => ({ x: xOf(p.day), y: yOf(p.value) }));
  const base = top + plotH;
  const lastIndex = points.length - 1;

  // The line is drawn in runs of consecutive days (a day without a number is a gap, never a joined line). Inside a run, a stretch
  // that is not a plain measurement (today so far, or days rebuilt afterwards) is dashed.
  let areas = '', lines = '', dots = '';
  const runs = runsOf(points);
  runs.forEach((run, runIndex) => {
    const rc = run.map((index) => coords[index]);
    // One area for the whole run (the line below is cut in stretches, but two translucent areas side by side leave a seam).
    if (run.length > 1) areas += `<path d="${smoothPath(rc, 0, rc.length - 1)} L${rc[rc.length - 1].x},${base} L${rc[0].x},${base} Z" class="sc-area"/>`;
    if (run.length === 1) {
      const point = points[run[0]];
      if (run[0] !== lastIndex) dots += `<circle cx="${rc[0].x}" cy="${rc[0].y}" r="3.4" class="sc-dot${point.partial ? ' sc-hollow' : ''}"/>`;
      return;
    }
    const flags = rc.slice(1).map((_, k) => isApprox(points[run[k]], points[run[k + 1]]));
    let a = 0;
    for (let k = 1; k <= flags.length; k += 1) {
      if (k < flags.length && flags[k] === flags[a]) continue;
      const piece = smoothPath(rc, a, k);
      lines += flags[a] ? `<path d="${piece}" class="sc-line sc-line-dash"/>` : `<path d="${piece}" pathLength="100" class="sc-line"/>`;
      a = k;
    }
    // The two ends of a run that touches a gap get a small dot, so the line is seen to stop there.
    if (runIndex > 0) dots += `<circle cx="${rc[0].x}" cy="${rc[0].y}" r="3.2" class="sc-dot"/>`;
    if (runIndex < runs.length - 1) dots += `<circle cx="${rc[rc.length - 1].x}" cy="${rc[rc.length - 1].y}" r="3.2" class="sc-dot"/>`;
  });
  const lastPoint = coords[lastIndex];
  const endMark = `<circle cx="${lastPoint.x}" cy="${lastPoint.y}" r="${points[lastIndex].partial ? 5.2 : 4.5}" class="sc-end${points[lastIndex].partial ? ' sc-hollow' : ''}"/>`;

  const grid = scale.ticks.map((tick, i) => `<line x1="${left}" x2="${left + plotW}" y1="${yOf(tick)}" y2="${yOf(tick)}" class="sc-grid"/><text x="${left - 8}" y="${yOf(tick) + 4}" text-anchor="end" class="sc-axis">${esc(labels[i])}</text>`).join('');
  // The labels of the axis. A short chart names days; one longer than LONG_RANGE_DAYS names months (the first of each, thinned so
  // they never touch, with the year on January and on the oldest). The last label of a short per-day chart reads "Today, so far",
  // which is longer, so those labels are further apart.
  const partialLast = Boolean(points[lastIndex].partial);
  let xticks = '';
  if ((span / DAY_MS) > LONG_RANGE_DAYS) {
    const ticks = monthTicks(points[0].day, points[lastIndex].day, Math.max(2, Math.floor(plotW / 70)));
    xticks = ticks.map((tick) => {
      const x = xOf(tick.day);
      const anchor = x < left + 26 ? 'start' : x > W - right - 26 ? 'end' : 'middle';
      return `<text x="${x}" y="${H - 8}" text-anchor="${anchor}" class="sc-axis">${esc(dayText(tick.day, tick.year ? { month: 'short', year: 'numeric' } : { month: 'short' }))}</text>`;
    }).join('');
  } else {
    const ordered = dayTickIndexes(points.length, plotW, partialLast);
    xticks = ordered.map((index, order, list) => {
      const anchor = list.length === 1 ? 'middle' : index === 0 ? 'start' : order === list.length - 1 ? 'end' : 'middle';
      const label = points[index].partial ? text.todaySoFar : shortDay(points[index].day);
      return `<text x="${coords[index].x}" y="${H - 8}" text-anchor="${anchor}" class="sc-axis${points[index].partial ? ' sc-axis-today' : ''}">${esc(label)}</text>`;
    }).join('');
  }

  const tip = points.map((p, i) => {
    const adjacent = i > 0 && nextDay(points[i - 1].day) === p.day;
    return {
      x: r4(coords[i].x / W),
      y: [r4(coords[i].y / H)],
      f: {
        label: dayText(p.day, { weekday: 'short', month: 'short', day: 'numeric' }),
        tag: p.partial ? text.todaySoFar : p.estimated ? text.estimatedTag : '',
        value: format(p.value),
        // Today so far is not compared with a whole day: it would read as a fall.
        delta: adjacent && !p.partial ? `${signed(p.value - points[i - 1].value)} ${text.changeVsPrev}` : '',
      },
    };
  });
  const svg = `${svgOpen({ W, H, fluid, animate, label: o.svgLabel })}${grid}${xticks}${areas}${lines}${dots}${endMark}</svg>`;
  const part = o.brush && !single && points.length >= BRUSH_MIN_POINTS
    ? brushParts({ brush: o.brush, points, layout: 'points', color, edges: coords.map((c) => [c.x / W, c.x / W]), box: [left / W, (left + plotW) / W, top / H, (top + plotH) / H] })
    : null;
  const plot = plotHtml({ svg, tipPoints: tip, color, aria: o.aria, fluid, height: H, extra: part?.extra });
  return { html: part ? part.wrap(plot) : plot, scale, coords };
}

/**
 * A bar chart. `items` are `{ day?, label?, title, value, partial?, lit?, dim? }`: bars named by `day` (a chart of days; the axis names
 * some of them, and the day in progress is drawn as a lighter dashed bar called "Today, so far") or by `label` (a chart of kinds, hours or
 * weekdays; an empty label is left blank). The scale starts at zero (a bar is its length), with round ticks; a negative value hangs from
 * the zero line in red. `lit` paints the busiest bar in the accent color and `dim` the others lighter.
 * Options: `items`, `W`, `H`, `color`, `format(value)`, `tickLabels(ticks)`, `dayText`, `signed`, `text`, `aria`, `svgLabel`, `fluid`, `animate`.
 */
export function barChart(o) {
  const { items, W, H, color, fluid = false, animate = false, format, text } = o;
  const byDay = items.length > 0 && items.every((item) => item.day);
  const values = items.map((item) => item.value);
  const hasNegative = values.some((value) => value < 0);
  const scale = zoomScale([0, ...values], 4, !hasNegative);
  const labels = o.tickLabels(scale.ticks);
  const left = Math.min(62, Math.ceil(Math.max(...labels.map((l) => l.length)) * 6.6) + 14);
  const right = 8, top = 10, bottom = 28;
  const plotW = W - left - right, plotH = H - top - bottom;
  const yOf = (value) => top + plotH - ((value - scale.min) / (scale.max - scale.min)) * plotH;
  const zero = yOf(0);
  const slot = plotW / Math.max(1, items.length);
  const barW = Math.max(2, Math.min(34, slot * 0.68));
  const rx = barW >= 10 ? 5 : barW >= 5 ? 3 : 1.5;
  const lastIndex = items.length - 1;
  const partialLast = Boolean(items[lastIndex]?.partial);
  const xCenter = (i) => left + slot * i + slot / 2;

  const grid = scale.ticks.map((tick, i) => `<line x1="${left}" x2="${left + plotW}" y1="${yOf(tick)}" y2="${yOf(tick)}" class="sc-grid${tick === 0 ? ' sc-grid-zero' : ''}"/><text x="${left - 8}" y="${yOf(tick) + 4}" text-anchor="end" class="sc-axis">${esc(labels[i])}</text>`).join('');
  const bars = items.map((item, i) => {
    const y = yOf(Math.max(item.value, 0));
    const h = Math.abs(yOf(item.value) - zero);
    const cls = ['sc-bar', item.value < 0 ? 'sc-bar-neg' : '', item.lit ? 'sc-bar-lit' : '', item.dim ? 'sc-bar-dim' : '', item.partial ? 'sc-bar-partial' : ''].filter(Boolean).join(' ');
    const delay = Math.min(i * 10, 180);
    return `<rect x="${r4(xCenter(i) - barW / 2)}" y="${r4(item.value < 0 ? zero : y)}" width="${r4(barW)}" height="${r4(h)}" rx="${rx}" class="${cls}" style="--d:${delay}ms"/>`;
  }).join('');

  let xticks = '';
  if (byDay) {
    const picks = dayTickIndexes(items.length, plotW, partialLast);
    xticks = picks.map((index, order, list) => {
      const anchor = list.length === 1 ? 'middle' : index === 0 ? 'start' : order === list.length - 1 ? 'end' : 'middle';
      const label = items[index].partial ? text.todaySoFar : o.dayText(items[index].day, { month: 'short', day: 'numeric' });
      const x = anchor === 'start' ? left : anchor === 'end' ? left + plotW : xCenter(index);
      return `<text x="${r4(x)}" y="${H - 8}" text-anchor="${anchor}" class="sc-axis${items[index].partial ? ' sc-axis-today' : ''}">${esc(label)}</text>`;
    }).join('');
  } else {
    // Labels that would touch the one before are left out (the tooltip still names every bar).
    let lastRight = -Infinity;
    xticks = items.map((item, i) => {
      if (!item.label) return '';
      const half = (item.label.length * 6.6) / 2;
      if (xCenter(i) - half < lastRight + 6) return '';
      lastRight = xCenter(i) + half;
      return `<text x="${r4(xCenter(i))}" y="${H - 8}" text-anchor="middle" class="sc-axis">${esc(item.label)}</text>`;
    }).join('');
  }

  const tip = items.map((item, i) => {
    const adjacent = byDay && i > 0 && nextDay(items[i - 1].day) === item.day;
    return {
      x: r4(xCenter(i) / W),
      y: [r4(yOf(item.value) / H)],
      f: {
        label: item.title ?? (byDay ? o.dayText(item.day, { weekday: 'short', month: 'short', day: 'numeric' }) : item.label),
        tag: item.partial ? text.todaySoFar : '',
        value: format(item.value),
        delta: adjacent && !item.partial && o.signed ? `${o.signed(item.value - items[i - 1].value)} ${text.changeVsPrev}` : '',
      },
    };
  });
  const svg = `${svgOpen({ W, H, fluid, animate, label: o.svgLabel })}${grid}${bars}${xticks}</svg>`;
  const part = o.brush && byDay && items.length >= BRUSH_MIN_POINTS
    ? brushParts({ brush: o.brush, points: items, layout: 'slots', color, edges: items.map((_, i) => [(left + slot * i) / W, (left + slot * (i + 1)) / W]), box: [left / W, (left + plotW) / W, top / H, (top + plotH) / H] })
    : null;
  const plot = plotHtml({ svg, tipPoints: tip, color, aria: o.aria, fluid, height: H, extra: part?.extra });
  return { html: part ? part.wrap(plot) : plot, scale };
}
