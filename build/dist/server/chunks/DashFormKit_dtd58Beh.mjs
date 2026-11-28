import { c as createAstro, a as createComponent, r as renderTemplate, e as defineScriptVars } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                              */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://petto.sbs");
const $$DashFormKit = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashFormKit;
  const dt = makeT(getDashLang(Astro2));
  const less = dt("Less");
  const more = dt("More");
  return renderTemplate(_a || (_a = __template(["<script>(function(){", `
  (function () {
    // The dashboard swaps a page's content in without a reload and runs this script again: the work is not set up twice, but the fields of the new page are.
    if (window.__dfxKit) { window.__dfxKit(); return; }
    window.__dfxKit = function () {};
    // Numbers: [-] value [+]
    function enhanceNumber(input) {
      if (input.getAttribute('data-dfx') || input.closest('.dfx-num') || input.type !== 'number') return;
      input.setAttribute('data-dfx', '1');
      var wrap = document.createElement('span');
      wrap.className = 'dfx-num';
      input.parentNode.insertBefore(wrap, input);
      var minus = document.createElement('button');
      minus.type = 'button'; minus.className = 'dfx-step'; minus.textContent = '\u2212'; minus.setAttribute('aria-label', less); minus.tabIndex = -1;
      var plus = document.createElement('button');
      plus.type = 'button'; plus.className = 'dfx-step'; plus.textContent = '+'; plus.setAttribute('aria-label', more); plus.tabIndex = -1;
      wrap.appendChild(minus); wrap.appendChild(input); wrap.appendChild(plus);
      function state() {
        var v = input.value === '' ? NaN : Number(input.value);
        minus.disabled = input.disabled || (input.min !== '' && !isNaN(v) && v <= Number(input.min));
        plus.disabled = input.disabled || (input.max !== '' && !isNaN(v) && v >= Number(input.max));
      }
      function move(dir) {
        try { if (input.value === '') input.value = input.min !== '' ? input.min : '0'; else if (dir > 0) input.stepUp(); else input.stepDown(); }
        catch (e) { var s = Number(input.step) || 1; input.value = String(Number(input.value || 0) + dir * s); }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        state();
      }
      [[minus, -1], [plus, 1]].forEach(function (pair) {
        var timer = 0, repeat = 0;
        function stop() { clearTimeout(timer); clearInterval(repeat); }
        pair[0].addEventListener('pointerdown', function (e) {
          if (pair[0].disabled) return;
          e.preventDefault(); move(pair[1]);
          timer = setTimeout(function () { repeat = setInterval(function () { move(pair[1]); }, 70); }, 380);
        });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (name) { pair[0].addEventListener(name, stop); });
        pair[0].addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); move(pair[1]); } });
      });
      input.addEventListener('input', state); input.addEventListener('change', state);
      state();
    }
    // A one line text in a box that grows.
    function oneLine(area) {
      if (area.getAttribute('data-dfx-one')) return;
      area.setAttribute('data-dfx-one', '1');
      area.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });
      area.addEventListener('input', function () {
        if (/[\\r\\n]/.test(area.value)) { var at = area.selectionStart; area.value = area.value.replace(/\\s*[\\r\\n]+\\s*/g, ' '); try { area.setSelectionRange(at, at); } catch (e) { /* no caret to keep */ } }
      });
    }
    // How much of the limit is used.
    function counter(field) {
      if (field.getAttribute('data-dfx-count')) return;
      field.setAttribute('data-dfx-count', '1');
      var out = document.createElement('span');
      out.className = 'dfx-count';
      field.insertAdjacentElement('afterend', out);
      function paint() { out.textContent = field.value.length + ' / ' + (field.maxLength > 0 ? field.maxLength : ''); out.classList.toggle('dfx-count-near', field.maxLength > 0 && field.value.length > field.maxLength * 0.9); }
      field.addEventListener('input', paint); paint();
    }
    function all(root) {
      (root || document).querySelectorAll('.dfx-field input[type="number"]').forEach(enhanceNumber);
      (root || document).querySelectorAll('textarea[data-one-line]').forEach(oneLine);
      (root || document).querySelectorAll('textarea[data-count], input[data-count]').forEach(counter);
    }
    window.__dfxKit = function () { all(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { all(); }); else all();
  })();
})();<\/script> `], ["<script>(function(){", `
  (function () {
    // The dashboard swaps a page's content in without a reload and runs this script again: the work is not set up twice, but the fields of the new page are.
    if (window.__dfxKit) { window.__dfxKit(); return; }
    window.__dfxKit = function () {};
    // Numbers: [-] value [+]
    function enhanceNumber(input) {
      if (input.getAttribute('data-dfx') || input.closest('.dfx-num') || input.type !== 'number') return;
      input.setAttribute('data-dfx', '1');
      var wrap = document.createElement('span');
      wrap.className = 'dfx-num';
      input.parentNode.insertBefore(wrap, input);
      var minus = document.createElement('button');
      minus.type = 'button'; minus.className = 'dfx-step'; minus.textContent = '\u2212'; minus.setAttribute('aria-label', less); minus.tabIndex = -1;
      var plus = document.createElement('button');
      plus.type = 'button'; plus.className = 'dfx-step'; plus.textContent = '+'; plus.setAttribute('aria-label', more); plus.tabIndex = -1;
      wrap.appendChild(minus); wrap.appendChild(input); wrap.appendChild(plus);
      function state() {
        var v = input.value === '' ? NaN : Number(input.value);
        minus.disabled = input.disabled || (input.min !== '' && !isNaN(v) && v <= Number(input.min));
        plus.disabled = input.disabled || (input.max !== '' && !isNaN(v) && v >= Number(input.max));
      }
      function move(dir) {
        try { if (input.value === '') input.value = input.min !== '' ? input.min : '0'; else if (dir > 0) input.stepUp(); else input.stepDown(); }
        catch (e) { var s = Number(input.step) || 1; input.value = String(Number(input.value || 0) + dir * s); }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        state();
      }
      [[minus, -1], [plus, 1]].forEach(function (pair) {
        var timer = 0, repeat = 0;
        function stop() { clearTimeout(timer); clearInterval(repeat); }
        pair[0].addEventListener('pointerdown', function (e) {
          if (pair[0].disabled) return;
          e.preventDefault(); move(pair[1]);
          timer = setTimeout(function () { repeat = setInterval(function () { move(pair[1]); }, 70); }, 380);
        });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (name) { pair[0].addEventListener(name, stop); });
        pair[0].addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); move(pair[1]); } });
      });
      input.addEventListener('input', state); input.addEventListener('change', state);
      state();
    }
    // A one line text in a box that grows.
    function oneLine(area) {
      if (area.getAttribute('data-dfx-one')) return;
      area.setAttribute('data-dfx-one', '1');
      area.addEventListener('keydown', function (e) { if (e.key === 'Enter') e.preventDefault(); });
      area.addEventListener('input', function () {
        if (/[\\\\r\\\\n]/.test(area.value)) { var at = area.selectionStart; area.value = area.value.replace(/\\\\s*[\\\\r\\\\n]+\\\\s*/g, ' '); try { area.setSelectionRange(at, at); } catch (e) { /* no caret to keep */ } }
      });
    }
    // How much of the limit is used.
    function counter(field) {
      if (field.getAttribute('data-dfx-count')) return;
      field.setAttribute('data-dfx-count', '1');
      var out = document.createElement('span');
      out.className = 'dfx-count';
      field.insertAdjacentElement('afterend', out);
      function paint() { out.textContent = field.value.length + ' / ' + (field.maxLength > 0 ? field.maxLength : ''); out.classList.toggle('dfx-count-near', field.maxLength > 0 && field.value.length > field.maxLength * 0.9); }
      field.addEventListener('input', paint); paint();
    }
    function all(root) {
      (root || document).querySelectorAll('.dfx-field input[type="number"]').forEach(enhanceNumber);
      (root || document).querySelectorAll('textarea[data-one-line]').forEach(oneLine);
      (root || document).querySelectorAll('textarea[data-count], input[data-count]').forEach(counter);
    }
    window.__dfxKit = function () { all(); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { all(); }); else all();
  })();
})();<\/script> `])), defineScriptVars({ less, more }));
}, "/home/runner/work/petto-web/petto-web/src/components/DashFormKit.astro", void 0);

export { $$DashFormKit as $ };
