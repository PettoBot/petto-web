// The color picker of the dashboard, for pages that are not inside the dashboard layout (the layout carries its own copy of this code).
// Binds every [data-colorpicker] under `root`: a swatch that opens a saturation/value square, a hue bar, hex and RGB fields and presets.
// Setting a value from outside: dispatch a "cp-set" CustomEvent on the picker element with the hex as detail.
const outsideClosers = [];
const repositioners = [];
document.addEventListener('click', (e) => {
  for (const c of outsideClosers.filter((x) => x.wrap.isConnected)) if (!c.wrap.contains(e.target) && !(c.extra && c.extra.contains(e.target))) c.close();
});
const reposition = () => repositioners.filter((r) => r.wrap.isConnected).forEach((r) => { if (r.isOpen()) r.place(); });
window.addEventListener('resize', reposition);
document.addEventListener('scroll', reposition, true);
function closeOnOutside(wrap, close, extra) { outsideClosers.push({ wrap, close, extra: extra || null }); }
function placeWhileOpen(wrap, isOpen, place) { repositioners.push({ wrap, isOpen, place }); }

// Draws the panel of a picker the first time it is bound, from the data the page left on it (see ColorPicker.astro). The markup is
// the one the component used to write, with its scoped style attribute copied from the panel so it looks the same.
function buildColorPanel(panel) {
  var esc = function (text) { return String(text == null ? '' : text).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var scope = '';
  for (var i = 0; i < panel.attributes.length; i++) if (panel.attributes[i].name.indexOf('data-astro-cid-') === 0) scope += ' ' + panel.attributes[i].name;
  var tag = function (name, attrs, inner) { return '<' + name + ' ' + attrs + scope + '>' + (inner || '') + '</' + name + '>'; };
  var input = function (attrs) { return '<input ' + attrs + scope + ' />'; };
  var field = function (cls, attrs, label) { return tag('div', 'class="dgl-cp-field' + cls + '"', input(attrs) + tag('label', '', esc(label))); };
  var presets = (panel.getAttribute('data-cp-presets') || '').split(',').filter(Boolean);
  var none = panel.getAttribute('data-cp-l-none');
  panel.innerHTML =
    tag('div', 'class="dgl-cp-sv-wrap"', tag('canvas', 'class="dgl-cp-sv" data-cp-sv width="260" height="150"') + tag('div', 'class="dgl-cp-sv-thumb" data-cp-sv-thumb')) +
    tag('div', 'class="dgl-cp-hue-wrap"', tag('canvas', 'class="dgl-cp-hue" data-cp-hue width="260" height="12"') + tag('div', 'class="dgl-cp-hue-thumb" data-cp-hue-thumb')) +
    tag('div', 'class="dgl-cp-fields"',
      field(' dgl-cp-field-hex', 'type="text" data-cp-hex maxlength="7"', panel.getAttribute('data-cp-l-hex') || 'Hex') +
      field('', 'type="number" data-cp-r min="0" max="255"', 'R') +
      field('', 'type="number" data-cp-g min="0" max="255"', 'G') +
      field('', 'type="number" data-cp-b min="0" max="255"', 'B')) +
    tag('div', 'class="dgl-cp-presets"', presets.map(function (p) { return tag('button', 'type="button" class="dgl-cp-preset" style="--sw:' + esc(p) + '" data-cp-preset="' + esc(p) + '" aria-label="' + esc(p) + '"'); }).join('')) +
    tag('div', 'class="dgl-cp-actions"', (none !== null ? tag('button', 'type="button" class="dgl-cp-none" data-cp-none', esc(none)) : '') + tag('button', 'type="button" class="dgl-cp-reset" data-cp-reset', esc(panel.getAttribute('data-cp-l-reset') || 'Reset')));
  panel.removeAttribute('data-cp-build');
}
function bindColorPickers(root) {
  root.querySelectorAll('[data-colorpicker]').forEach(function (wrap) {
    if (wrap.dataset.cpBound) return;
    wrap.dataset.cpBound = '1';
    var lazyPanel = wrap.querySelector('[data-cp-build]');
    if (lazyPanel) buildColorPanel(lazyPanel);

    var trigger = wrap.querySelector('[data-cp-trigger]');
    var valueInput = wrap.querySelector('[data-cp-value]');
    var swatch = wrap.querySelector('[data-cp-swatch]');
    var hexLabel = wrap.querySelector('[data-cp-hexlabel]');
    var panel = wrap.querySelector('[data-cp-panel]');
    var svWrap = wrap.querySelector('.dgl-cp-sv-wrap');
    var svCanvas = wrap.querySelector('[data-cp-sv]');
    var svThumb = wrap.querySelector('[data-cp-sv-thumb]');
    var hueWrap = wrap.querySelector('.dgl-cp-hue-wrap');
    var hueCanvas = wrap.querySelector('[data-cp-hue]');
    var hueThumb = wrap.querySelector('[data-cp-hue-thumb]');
    var hexInput = wrap.querySelector('[data-cp-hex]');
    var rInput = wrap.querySelector('[data-cp-r]');
    var gInput = wrap.querySelector('[data-cp-g]');
    var bInput = wrap.querySelector('[data-cp-b]');
    var resetBtn = wrap.querySelector('[data-cp-reset]');
    var presetBtns = Array.prototype.slice.call(wrap.querySelectorAll('[data-cp-preset]'));
    if (!trigger || !valueInput || !svCanvas || !hueCanvas) return;

    var svCtx = svCanvas.getContext('2d');
    var hueCtx = hueCanvas.getContext('2d');
    var W = svCanvas.width, H = svCanvas.height, HUEW = hueCanvas.width;
    var state = { h: 230, s: 0.5, v: 0.5 };
    var inputQueued = false, dragging = false, dragEndedAt = 0;

    function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }

    function hexToRgb(hex) {
      var m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
      if (!m) return null;
      var n = parseInt(m[1], 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
    function rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(function (c) { return clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0'); }).join('').toUpperCase();
    }
    function rgbToHsv(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
      var h = 0;
      if (d !== 0) {
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
      }
      return { h: h, s: max === 0 ? 0 : d / max, v: max };
    }
    function hsvToRgb(h, s, v) {
      var c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
      var r, g, b;
      if (h < 60) { r = c; g = x; b = 0; }
      else if (h < 120) { r = x; g = c; b = 0; }
      else if (h < 180) { r = 0; g = c; b = x; }
      else if (h < 240) { r = 0; g = x; b = c; }
      else if (h < 300) { r = x; g = 0; b = c; }
      else { r = c; g = 0; b = x; }
      return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
    }

    function drawSV() {
      var hueRgb = hsvToRgb(state.h, 1, 1);
      svCtx.clearRect(0, 0, W, H);
      svCtx.fillStyle = 'rgb(' + Math.round(hueRgb.r) + ',' + Math.round(hueRgb.g) + ',' + Math.round(hueRgb.b) + ')';
      svCtx.fillRect(0, 0, W, H);
      var whiteGrad = svCtx.createLinearGradient(0, 0, W, 0);
      whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
      whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
      svCtx.fillStyle = whiteGrad;
      svCtx.fillRect(0, 0, W, H);
      var blackGrad = svCtx.createLinearGradient(0, 0, 0, H);
      blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
      blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
      svCtx.fillStyle = blackGrad;
      svCtx.fillRect(0, 0, W, H);
    }

    function drawHue() {
      var grad = hueCtx.createLinearGradient(0, 0, HUEW, 0);
      ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'].forEach(function (c, i, arr) {
        grad.addColorStop(i / (arr.length - 1), c);
      });
      hueCtx.fillStyle = grad;
      hueCtx.fillRect(0, 0, HUEW, hueCanvas.height);
    }

    function positionThumbs() {
      svThumb.style.left = (state.s * 100) + '%';
      svThumb.style.top = ((1 - state.v) * 100) + '%';
      hueThumb.style.left = (state.h / 360 * 100) + '%';
    }

    function syncFields(hex, rgb, silent) {
      wrap.classList.remove('is-none');
      hexLabel.textContent = hex;
      swatch.style.setProperty('--sw', hex);
      valueInput.value = hex;
      if (document.activeElement !== hexInput) hexInput.value = hex;
      if (document.activeElement !== rInput) rInput.value = Math.round(rgb.r);
      if (document.activeElement !== gInput) gInput.value = Math.round(rgb.g);
      if (document.activeElement !== bInput) bInput.value = Math.round(rgb.b);
      // Listeners of the page (live previews, the unsaved bar) run once per frame while dragging, not on every pointer event.
      if (!silent && !inputQueued) {
        inputQueued = true;
        requestAnimationFrame(function () { inputQueued = false; valueInput.dispatchEvent(new Event('input', { bubbles: true })); });
      }
      }

      function applyState(redrawHue, silent) {
      var rgb = hsvToRgb(state.h, state.s, state.v);
      var hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      if (redrawHue) drawSV();
      positionThumbs();
      syncFields(hex, rgb, silent);
    }

    function setFromHex(hex, silent) {
      var rgb = hexToRgb(hex);
      if (!rgb) return;
      var hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      state.h = hsv.h; state.s = hsv.s; state.v = hsv.v;
      applyState(true, silent);
    }

    function setFromRgbInputs() {
      var r = clamp(parseInt(rInput.value, 10) || 0, 0, 255);
      var g = clamp(parseInt(gInput.value, 10) || 0, 0, 255);
      var b = clamp(parseInt(bInput.value, 10) || 0, 0, 255);
      var hsv = rgbToHsv(r, g, b);
      state.h = hsv.h; state.s = hsv.s; state.v = hsv.v;
      applyState(true);
    }

    function positionPanel() {
      if (panel.hidden) return;
      var sheet = window.innerWidth < 640;
      // On a phone the picker is a sheet at the bottom of the screen, so it never covers the field being edited nor leaves the screen.
      panel.classList.toggle('dgl-cp-sheet', sheet);
      panel.style.right = ''; panel.style.bottom = '';
      panel.style.width = sheet ? (window.innerWidth - 24) + 'px' : '';
      var panelRect = panel.getBoundingClientRect();
      var left, top;
      if (sheet) {
        left = 12;
        top = Math.max(12, window.innerHeight - panelRect.height - 12);
      } else {
        var triggerRect = trigger.getBoundingClientRect();
        left = Math.min(Math.max(12, triggerRect.left), Math.max(12, window.innerWidth - panelRect.width - 12));
        top = triggerRect.bottom + 8;
        if (top + panelRect.height > window.innerHeight - 12) top = triggerRect.top - panelRect.height - 8;
        if (top < 12) top = 12;
      }
      panel.style.left = left + 'px';
      panel.style.top = top + 'px';
      // An ancestor with a transform or filter becomes the reference of "fixed"; measure where the panel really landed and correct for it.
      var landed = panel.getBoundingClientRect();
      if (Math.abs(landed.left - left) > 1) panel.style.left = (left - (landed.left - left)) + 'px';
      if (Math.abs(landed.top - top) > 1) panel.style.top = (top - (landed.top - top)) + 'px';
    }
    // The panel moves to the body while open: inside the form, a transformed or stacked ancestor would shift it and let fields paint over it.
    function openPanel() { if (panel.parentNode !== document.body) document.body.appendChild(panel); panel.hidden = false; wrap.classList.add('open'); drawSV(); drawHue(); positionThumbs(); positionPanel(); }
    function closePanel() { panel.hidden = true; wrap.classList.remove('open'); if (wrap.isConnected && panel.parentNode !== wrap) wrap.appendChild(panel); }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (panel.hidden) openPanel(); else closePanel();
    });
    // Letting go of a drag outside the panel is not a click outside: it must not close it.
    closeOnOutside(wrap, function () { if (dragging || Date.now() - dragEndedAt < 400) return; closePanel(); }, panel);
    placeWhileOpen(wrap, function () { return !panel.hidden; }, positionPanel);
    wrap.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });

    function svPointer(e) {
      var rect = svCanvas.getBoundingClientRect();
      var x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      var y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
      state.s = x; state.v = 1 - y;
      applyState(false);
    }
    function huePointer(e) {
      var rect = hueCanvas.getBoundingClientRect();
      var x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      state.h = x * 360;
      applyState(true);
    }
    function drag(moveFn, e) {
    dragging = true;
    var target = e.currentTarget;
    try { target.setPointerCapture(e.pointerId); } catch (err) { /* The listeners on the document still follow the pointer. */ }
    function onMove(ev) { ev.preventDefault(); moveFn(ev); }
    function onUp() {
    dragging = false; dragEndedAt = Date.now();
    try { target.releasePointerCapture(e.pointerId); } catch (err) { /* Already released. */ }
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
    document.removeEventListener('pointercancel', onUp);
    }
    document.addEventListener('pointermove', onMove, { passive: false });
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
    }
    svWrap.addEventListener('pointerdown', function (e) { e.preventDefault(); svPointer(e); drag(svPointer, e); });
    hueWrap.addEventListener('pointerdown', function (e) { e.preventDefault(); huePointer(e); drag(huePointer, e); });

    hexInput.addEventListener('change', function () {
      var v = hexInput.value.trim();
      if (!/^#?[0-9a-f]{6}$/i.test(v)) { hexInput.value = valueInput.value; return; }
      setFromHex(v.startsWith('#') ? v : '#' + v);
    });
    [rInput, gInput, bInput].forEach(function (inp) { inp.addEventListener('change', setFromRgbInputs); });

    presetBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { setFromHex(btn.getAttribute('data-cp-preset')); });
    });
    // "No color": the field sends an empty value, which the server reads as no color at all.
    var allowNone = wrap.hasAttribute('data-cp-allownone');
    var noneBtn = wrap.querySelector('[data-cp-none]');
    function setNone(silent) {
      wrap.classList.add('is-none');
      hexLabel.textContent = wrap.getAttribute('data-cp-nonelabel') || '';
      valueInput.value = '';
      if (!silent) valueInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (noneBtn) noneBtn.addEventListener('click', function () { setNone(); closePanel(); });
    // Other scripts set the color through this event; an empty value means no color when the field allows it.
    wrap.addEventListener('cp-set', function (e) {
      var v = e.detail || '';
      if (!v && allowNone) setNone(); else if (hexToRgb(v)) setFromHex(v);
    });
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        var def = wrap.getAttribute('data-cp-default');
        if (allowNone && !def) setNone(); else setFromHex(def || '#8399ff');
      });
    }

    setFromHex(valueInput.value || wrap.getAttribute('data-cp-default') || '#8399ff', true);
    if (allowNone && !wrap.getAttribute('data-cp-default')) setNone(true);
  });
}

// Sets the color of a picker from a script: the hidden field alone would leave the swatch and the square showing the old color.
function setColorPicker(input, hex) {
  var wrap = input && input.closest ? input.closest('[data-colorpicker]') : null;
  if (wrap) wrap.dispatchEvent(new CustomEvent('cp-set', { detail: hex || '' }));
  else if (input) input.value = hex || '';
}

export { bindColorPickers, setColorPicker };
