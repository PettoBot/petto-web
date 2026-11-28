import { a as createComponent, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$DashSettingsKit = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template([`<script>
  (function () {
    // The dashboard swaps a page's content in without a reload and runs this script again: the listeners are not added twice, but the blocks of the new page are checked.
    if (window.__sxKit) { window.__sxKit(); return; }
    window.__sxKit = function () {};
    var clamp = function (input, value) {
      var min = input.min === '' ? -Infinity : Number(input.min); var max = input.max === '' ? Infinity : Number(input.max);
      return Math.min(max, Math.max(min, value));
    };
    var bump = function (button) {
      var input = button.parentElement.querySelector('input'); if (!input || input.disabled || input.readOnly) return;
      var step = Number(input.step) || 1; var now = input.value === '' ? (input.min === '' ? 0 : Number(input.min)) : Number(input.value);
      var next = clamp(input, Math.round((now + step * Number(button.getAttribute('data-sx-step'))) * 1000) / 1000);
      if (String(next) === input.value) return;
      input.value = String(next);
      input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    var timer = 0; var repeat = 0;
    var stop = function () { clearTimeout(timer); clearInterval(repeat); };
    document.addEventListener('pointerdown', function (event) {
      var button = event.target.closest && event.target.closest('[data-sx-step]'); if (!button || event.button > 0) return;
      event.preventDefault(); bump(button); stop();
      timer = setTimeout(function () { repeat = setInterval(function () { bump(button); }, 70); }, 420);
    });
    ['pointerup', 'pointerleave', 'pointercancel', 'blur'].forEach(function (name) { document.addEventListener(name, stop, true); });
    document.addEventListener('keydown', function (event) {
      var button = event.target.closest && event.target.closest('[data-sx-step]'); if (button && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); bump(button); }
    });
    // A value typed past the limits settles on the nearest one when the field is left.
    document.addEventListener('change', function (event) {
      var input = event.target; if (!input || !input.matches || !input.matches('.sx-stepper input') || input.value === '') return;
      var fixed = clamp(input, Number(input.value)); if (String(fixed) !== input.value) input.value = String(fixed);
    });
    var needsMet = function (scope, rule) {
      var parts = rule.split('='); var name = parts[0]; var wanted = parts.length > 1 ? parts.slice(1).join('=') : null;
      var fields = (scope.closest('form') || document).querySelectorAll('[name="' + name.replace(/"/g, '') + '"]'); if (!fields.length) return true;
      var met = false;
      Array.prototype.forEach.call(fields, function (field) {
        if (field.type === 'checkbox' || field.type === 'radio') { if (field.checked && (wanted === null || field.value === wanted)) met = true; }
        else if (wanted === null ? field.value !== '' : field.value === wanted) met = true;
      });
      return met;
    };
    var refresh = function () {
      document.querySelectorAll('[data-sx-needs]').forEach(function (block) {
        var off = !needsMet(block, block.getAttribute('data-sx-needs'));
        if (block.hasAttribute('data-sx-off') === off) return;
        if (off) { block.setAttribute('data-sx-off', ''); try { block.inert = true; } catch (e) { /* dimmed is enough */ } }
        else { block.removeAttribute('data-sx-off'); try { block.inert = false; } catch (e) { /* nothing to undo */ } }
      });
    };
    window.__sxKit = refresh;
    document.addEventListener('change', refresh); document.addEventListener('input', refresh);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh); else refresh();
  })();
<\/script> `])));
}, "/home/runner/work/petto-web/petto-web/src/components/DashSettingsKit.astro", void 0);

export { $$DashSettingsKit as $ };
