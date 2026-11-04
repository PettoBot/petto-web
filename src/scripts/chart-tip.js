// The tooltip of every chart of the dashboard (the overview's two charts, the statistics, the member line of the counters).
//
// A chart opts in with a plot element marked data-ct (position: relative, the SVG inside it) that holds:
//   [data-ct-guide]   the dashed line that follows the point
//   [data-ct-dot]     one dot per line (moved to that line's value at the point)
//   [data-ct-box]     the tooltip; each field of it is an element with data-ct-f="name" (or that id)
//   script[data-ct-data]   JSON: { "points": [ { "x": 0-1, "y": [0-1, ...], "f": { name: text-or-number } } ] }
// x and y are fractions of the plot box. Everything else (touch, mouse, keyboard, the glide, the edges) lives here, once.
//
// The box, the guide and the dots glide to the next point (a transform transition, see DashChartTip.astro, which has the same
// numbers as TIMING below), the box fades in softly and, when the pointer leaves, waits a moment before it fades out, so a brief
// jitter at the edge of the chart does not make it flicker. The pointer is read once per frame and snaps to the nearest point, with a
// little hysteresis around the middle of two points so it does not flip back and forth there. prefers-reduced-motion: all instant.
//
// It binds ONCE to the document (window.__dglChartTips) and looks the chart up from the event, so a chart that a live redraw or the
// dashboard's navigation put on the page is alive without any binding. While the tooltip is open the plot carries data-dash-hold, which
// keeps the live redraw from replacing the chart under the finger or the pointer.
(function () {
  if (window.__dglChartTips) return;

  // The numbers of the motion, in one place. The CSS in DashChartTip.astro (--ct-glide, --ct-in, --ct-out) must say the same;
  // scripts/check-chart-tip.mjs compares them.
  var TIMING = {
    glideMs: 180, // the box, the guide and the dots move to the next point
    fadeInMs: 120, // the box appears
    fadeOutMs: 140, // the box goes away...
    hideDelayMs: 100, // ...this long after the pointer left, so a brief jitter never flickers it
    swapMs: 110, // the numbers in the box change with a very short cross-fade
    hysteresis: 0.22, // share of the gap between two points around their middle where the pointer keeps the point it has
  };

  /** The index of the point nearest to `rel` (0-1) among `xs` (0-1, ascending), 0 when there is none. */
  function nearestIndex(xs, rel) {
    var best = 0;
    var bestD = Infinity;
    for (var i = 0; i < xs.length; i++) {
      var d = Math.abs(xs[i] - rel);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  /**
   * The point the pointer means. It is the nearest one, but it only leaves `current` (the point shown, -1 for none) when the new one is
   * nearer by more than `margin` of the gap between the two, so a pointer resting around the middle of two points does not flip.
   */
  function pickIndex(xs, rel, current, margin) {
    var best = nearestIndex(xs, rel);
    if (current < 0 || current >= xs.length || best === current) return best;
    var gap = Math.abs(xs[best] - xs[current]);
    var advantage = Math.abs(xs[current] - rel) - Math.abs(xs[best] - rel);
    return advantage > (margin == null ? TIMING.hysteresis : margin) * gap ? best : current;
  }

  window.__dglChartTips = { TIMING: TIMING, nearestIndex: nearestIndex, pickIndex: pickIndex };
  var reduced = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function calm() { return Boolean(reduced && reduced.matches); }

  var states = new WeakMap();
  var active = null; // { s: state, mode: 'hover' | 'touch' | 'key' }
  var finger = null; // { id, plot } while a finger is down on a chart
  var hideTimer = 0;
  var frame = 0; // the pointer is read once per animation frame
  var pending = null; // { s, x, mode } the last pointer position of this frame
  var lastType = 'mouse';
  var GAP = 12; // between the guide and the tooltip
  var PAD = 4;

  function plotOf(target) {
    return target && target.closest ? target.closest('[data-ct]') : null;
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function stateOf(plot) {
    var s = states.get(plot);
    if (s) return s;
    var node = plot.querySelector('script[data-ct-data]');
    var pts = null;
    try { pts = JSON.parse(node ? node.textContent : '{}').points; } catch (e) { pts = null; }
    if (!pts || !pts.length) return null;
    var tip = plot.querySelector('[data-ct-box]');
    var fields = {};
    var first = pts[0].f || {};
    Object.keys(first).forEach(function (name) {
      fields[name] = (tip && (tip.querySelector('[data-ct-f="' + name + '"]') || tip.querySelector('[id="' + name + '"]'))) || null;
    });
    s = {
      plot: plot, pts: pts, xs: pts.map(function (p) { return p.x; }), idx: -1, shown: false, tip: tip, fields: fields,
      guide: plot.querySelector('[data-ct-guide]'),
      dots: Array.prototype.slice.call(plot.querySelectorAll('[data-ct-dot]')),
      place: plot.getAttribute('data-ct-place') || 'side',
      live: null,
    };
    states.set(plot, s);
    return s;
  }

  function nearest(s, clientX) {
    var rect = s.plot.getBoundingClientRect();
    if (!rect.width) return 0;
    return pickIndex(s.xs, (clientX - rect.left) / rect.width, s.shown ? s.idx : -1);
  }

  function fill(s, p) {
    var lang = document.documentElement.lang || undefined;
    var changed = [];
    Object.keys(s.fields).forEach(function (name) {
      var el = s.fields[name];
      var v = p.f ? p.f[name] : '';
      if (!el) return;
      var text = typeof v === 'number' ? v.toLocaleString(lang) : String(v == null ? '' : v);
      if (el.textContent !== text) { el.textContent = text; changed.push(el); }
    });
    // A very short cross-fade, so new numbers do not flash in while the box is already moving. Not on the first show.
    if (s.shown && !calm() && changed.length) {
      changed.forEach(function (el) {
        if (el.animate) el.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: TIMING.swapMs, easing: 'ease-out' });
      });
    }
  }

  // Where the tooltip goes (px of the plot): beside the guide on the side that has room, never over the dots being read; on a plot too
  // narrow for that, above or below the dots, and failing that above or below the plot. Always inside the screen.
  function position(s, p, px, w, h) {
    var tw = s.tip.offsetWidth;
    var th = s.tip.offsetHeight;
    var tx;
    var ty;
    if (s.place === 'above') {
      tx = clamp(px - tw / 2, 0, Math.max(0, w - tw));
      ty = -th - 8;
    } else {
      var ys = (p.y || []).map(function (v) { return v * h; });
      var hi = ys.length ? Math.min.apply(null, ys) : h / 2;
      var lo = ys.length ? Math.max.apply(null, ys) : h / 2;
      if (px + GAP + tw <= w - PAD) { tx = px + GAP; ty = clamp(6, 0, Math.max(0, h - th)); }
      else if (px - GAP - tw >= PAD) { tx = px - GAP - tw; ty = clamp(6, 0, Math.max(0, h - th)); }
      else {
        tx = clamp(px - tw / 2, PAD, Math.max(PAD, w - tw - PAD));
        if (hi - GAP - th >= 0) ty = hi - GAP - th;
        else if (lo + GAP + th <= h) ty = lo + GAP;
        else if (s.plot.getBoundingClientRect().top >= th + 12) ty = -th - 8;
        else ty = h + 8;
      }
    }
    // Inside the screen, whatever the plot is doing near its edge.
    var rect = s.plot.getBoundingClientRect();
    var vw = document.documentElement.clientWidth || window.innerWidth;
    tx = Math.max(tx, 6 - rect.left);
    tx = Math.min(tx, vw - 6 - rect.left - tw);
    s.tip.style.transform = 'translate3d(' + Math.round(tx * 10) / 10 + 'px,' + Math.round(ty * 10) / 10 + 'px,0)';
  }

  function render(s, idx, mode, instant) {
    var p = s.pts[idx];
    var w = s.plot.clientWidth;
    var h = s.plot.clientHeight;
    var px = p.x * w;
    var snap = instant || !s.shown;
    // The first placement (and a resize) is not a glide from wherever the tooltip was last: transforms jump, only the fade runs.
    if (snap) s.plot.classList.add('ct-snap');
    if (s.guide) s.guide.style.transform = 'translate3d(' + px + 'px,0,0)';
    s.dots.forEach(function (dot, i) {
      var y = p.y && p.y[i] != null ? p.y[i] * h : null;
      dot.style.visibility = y === null ? 'hidden' : '';
      if (y !== null) dot.style.transform = 'translate3d(' + px + 'px,' + y + 'px,0)';
    });
    if (s.tip) {
      fill(s, p);
      position(s, p, px, w, h);
    }
    if (snap) { void s.plot.offsetWidth; s.plot.classList.remove('ct-snap'); }
    s.plot.classList.add('ct-on');
    s.plot.setAttribute('data-dash-hold', '');
    s.idx = idx;
    s.shown = true;
    if (mode === 'key' && s.tip) {
      if (!s.live) {
        s.live = document.createElement('span');
        s.live.className = 'ct-sr';
        s.live.setAttribute('aria-live', 'polite');
        s.plot.appendChild(s.live);
      }
      s.live.textContent = (s.tip.innerText || s.tip.textContent || '').replace(/\s*\n+\s*/g, ', ').trim();
    }
  }

  function open(s, idx, mode, instant) {
    clearTimeout(hideTimer);
    if (active && active.s !== s) close();
    if (s.shown && s.idx === idx && !instant) { active = { s: s, mode: mode }; s.plot.classList.add('ct-on'); return; }
    render(s, idx, mode, instant);
    active = { s: s, mode: mode };
  }

  function close() {
    clearTimeout(hideTimer);
    if (!active) return;
    var s = active.s;
    s.shown = false;
    s.plot.classList.remove('ct-on');
    s.plot.removeAttribute('data-dash-hold');
    if (s.live) s.live.textContent = '';
    active = null;
  }

  // The pointer left the chart: the box stays a moment and then fades, and coming back before that keeps it (and glides to the new point).
  function closeSoon() {
    if (!active) return;
    if (calm() || !TIMING.hideDelayMs) { close(); return; }
    clearTimeout(hideTimer);
    hideTimer = setTimeout(close, TIMING.hideDelayMs);
  }

  // The pointer is read once per frame: the last position of the frame picks the point, so the box is not placed on every pixel.
  function follow(s, x, mode) {
    pending = { s: s, x: x, mode: mode };
    if (frame) return;
    var run = function () {
      frame = 0;
      var job = pending;
      pending = null;
      if (!job || !job.s.plot.isConnected) return;
      open(job.s, nearest(job.s, job.x), job.mode);
    };
    frame = window.requestAnimationFrame ? window.requestAnimationFrame(run) : (run(), 0);
  }

  function alive() {
    if (active && !active.s.plot.isConnected) active = null;
    if (finger && !finger.plot.isConnected) finger = null;
  }

  // Touch: a tap shows the tooltip at once, a drag along the chart moves it, and it stays until a touch somewhere else. The chart has
  // touch-action: pan-y, so a vertical swipe is the page's scroll (the browser then cancels the pointer) and only the horizontal drag
  // is ours.
  document.addEventListener('pointerdown', function (e) {
    alive();
    lastType = e.pointerType || 'mouse';
    var plot = plotOf(e.target);
    if (active && (!plot || active.s.plot !== plot)) close();
    pending = null;
    if (!plot || (e.pointerType === 'mouse' && e.button !== 0)) return;
    var s = stateOf(plot);
    if (!s) return;
    if (e.pointerType === 'mouse') { open(s, nearest(s, e.clientX), 'hover'); return; }
    finger = { id: e.pointerId, plot: plot };
    open(s, nearest(s, e.clientX), 'touch');
  }, { capture: true, passive: true });

  document.addEventListener('pointermove', function (e) {
    alive();
    if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
      lastType = e.pointerType;
      var plot = plotOf(e.target);
      if (plot) {
        var s = stateOf(plot);
        if (s) follow(s, e.clientX, 'hover');
      } else if (active && active.mode === 'hover') { pending = null; closeSoon(); }
      return;
    }
    if (!finger || finger.id !== e.pointerId) return;
    var t = stateOf(finger.plot);
    if (t) follow(t, e.clientX, 'touch');
  }, { capture: true, passive: true });

  function lift(e) {
    if (!finger || finger.id !== e.pointerId) return;
    finger = null;
    // The browser took the gesture for a scroll of the page: it was not a touch on the chart.
    if (e.type === 'pointercancel' && active && active.mode === 'touch') close();
  }
  document.addEventListener('pointerup', lift, { capture: true, passive: true });
  document.addEventListener('pointercancel', lift, { capture: true, passive: true });
  // The pointer left the window.
  document.addEventListener('pointerout', function (e) {
    if (!e.relatedTarget && e.pointerType !== 'touch' && active && active.mode === 'hover') { pending = null; closeSoon(); }
  }, { passive: true });

  // A long press must not open the system menu or select the text of the chart.
  document.addEventListener('contextmenu', function (e) {
    if (lastType !== 'mouse' && plotOf(e.target)) e.preventDefault();
  });
  document.addEventListener('selectstart', function (e) {
    var node = e.target && e.target.nodeType === 1 ? e.target : e.target && e.target.parentElement;
    if (lastType !== 'mouse' && plotOf(node)) e.preventDefault();
  });

  // Keyboard: focusing the chart shows the latest point, the arrows walk the points, Home and End jump to the first and the last,
  // Escape closes. The values are also said by a polite live region.
  document.addEventListener('focusin', function (e) {
    var plot = plotOf(e.target);
    if (!plot || plot !== e.target) return;
    var focusVisible = true;
    try { focusVisible = plot.matches(':focus-visible'); } catch (err) { focusVisible = true; }
    if (!focusVisible) return;
    var s = stateOf(plot);
    if (s) open(s, s.idx >= 0 ? s.idx : s.pts.length - 1, 'key', true);
  });
  document.addEventListener('focusout', function (e) {
    if (active && active.mode === 'key' && active.s.plot === e.target) close();
  });
  document.addEventListener('keydown', function (e) {
    var plot = plotOf(e.target);
    if (!plot || plot !== e.target) return;
    if (e.key === 'Escape') { close(); return; }
    var s = stateOf(plot);
    if (!s) return;
    var last = s.pts.length - 1;
    var i = s.idx < 0 ? last : s.idx;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') i -= 1;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') i += 1;
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = last;
    else return;
    e.preventDefault();
    open(s, clamp(i, 0, last), 'key');
  });

  // The plot changed size (a turn of the phone, a window resize): the open tooltip is placed again.
  window.addEventListener('resize', function () {
    alive();
    if (active) render(active.s, active.s.idx, active.mode, true);
  }, { passive: true });
})();
