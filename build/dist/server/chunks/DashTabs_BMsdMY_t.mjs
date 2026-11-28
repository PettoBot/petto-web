import { a as createComponent, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                           */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$DashTabs = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template([`<script>
  (function () {
    document.querySelectorAll('[data-tabs]').forEach(function (root) {
      if (root.dataset.tabsBound) return;
      root.dataset.tabsBound = '1';
      var key = 'tab:' + root.getAttribute('data-tabs');
      var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-tab]'));
      var panels = Array.prototype.slice.call(root.querySelectorAll('[data-panel]'));
      if (!tabs.length || !panels.length) return;
      function has(name) { return panels.some(function (p) { return p.getAttribute('data-panel') === name; }); }
      function remembered() { try { return sessionStorage.getItem(key); } catch (e) { return null; } }
      function show(name, animate) {
        if (!has(name)) name = tabs[0].getAttribute('data-tab');
        tabs.forEach(function (t) {
          var on = t.getAttribute('data-tab') === name;
          t.classList.toggle('on', on);
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
        });
        var swap = function () {
          panels.forEach(function (p) {
            var on = p.getAttribute('data-panel') === name;
            p.hidden = !on;
            if (on && animate) { p.classList.remove('tab-in'); void p.offsetWidth; p.classList.add('tab-in'); }
          });
        };
        // The panel that was open fades out quickly first (window.dglMotion), then the new one comes in.
        var leaving = animate && window.dglMotion ? panels.filter(function (p) { return !p.hidden && p.getAttribute('data-panel') !== name; })[0] : null;
        if (leaving) window.dglMotion.leave(leaving, swap, 'tab-out'); else swap();
        try { sessionStorage.setItem(key, name); } catch (e) { /* private window */ }
        if (history.replaceState) history.replaceState(history.state, '', '#' + name);
      }
      tabs.forEach(function (t, i) {
        t.addEventListener('click', function () { show(t.getAttribute('data-tab'), true); });
        t.addEventListener('keydown', function (e) {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
          var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
          next.focus(); show(next.getAttribute('data-tab'), true);
        });
      });
      function changedIn(panel) {
        return Array.prototype.some.call(panel.querySelectorAll('select, input, textarea'), function (el) {
          if (el.tagName === 'SELECT') return Array.prototype.some.call(el.options, function (o) { return o.selected !== o.defaultSelected; });
          if (el.type === 'checkbox' || el.type === 'radio') return el.checked !== el.defaultChecked;
          return el.value !== el.defaultValue;
        });
      }
      // A dot on the tabs whose panels hold something changed.
      root.__tabDots = function (forms) {
        tabs.forEach(function (t) {
          var panel = root.querySelector('[data-panel="' + t.getAttribute('data-tab') + '"]');
          t.classList.toggle('dirty', !!panel && forms.some(function (f) {
            if (panel.contains(f)) return true;
            // A form that holds several panels: only the panel with a field that differs from what was saved gets the dot.
            return f.contains(panel) && changedIn(panel);
          }));
        });
      };
      var hash = (location.hash || '').replace('#', '');
      show(has(hash) ? hash : (remembered() || tabs[0].getAttribute('data-tab')), false);
    });
    if (!window.__tabsDirty) {
      window.__tabsDirty = true;
      document.addEventListener('dgl:dirty', function (e) {
        document.querySelectorAll('[data-tabs]').forEach(function (root) { if (root.__tabDots) root.__tabDots(e.detail.forms); });
      });
    }
  })();
<\/script> `])));
}, "/home/runner/work/petto-web/petto-web/src/components/DashTabs.astro", void 0);

export { $$DashTabs as $ };
