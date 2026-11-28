import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                           */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://petto.sbs");
const $$DashServerSort = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashServerSort;
  const { targets, compact = false } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  return renderTemplate(_a || (_a = __template(["", "<div", ' role="group"', "", "> ", ' <button type="button" class="dss-btn" data-sort="members" aria-pressed="true">', '</button> <button type="button" class="dss-btn" data-sort="name" aria-pressed="false">', "</button> </div> <script>\n  (function () {\n    var KEY = 'petto-dash-server-sort';\n    function apply(root, how) {\n      var lists = document.querySelectorAll(root.getAttribute('data-dss'));\n      lists.forEach(function (list) {\n        var items = Array.prototype.slice.call(list.children).filter(function (el) { return el.hasAttribute('data-name'); });\n        items.sort(function (a, b) {\n          if (how === 'name') return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));\n          var x = a.getAttribute('data-members'), y = b.getAttribute('data-members');\n          var nx = x === '' || x === null ? -1 : Number(x), ny = y === '' || y === null ? -1 : Number(y);\n          return ny - nx || a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));\n        });\n        items.forEach(function (el) { list.appendChild(el); });\n      });\n      root.querySelectorAll('.dss-btn').forEach(function (btn) { btn.setAttribute('aria-pressed', String(btn.getAttribute('data-sort') === how)); });\n    }\n    document.querySelectorAll('[data-dss]').forEach(function (root) {\n      if (root.dataset.dssBound) return;\n      root.dataset.dssBound = '1';\n      var saved = null;\n      try { saved = localStorage.getItem(KEY); } catch (e) { saved = null; }\n      // The page is drawn by members already; only another saved choice reorders it.\n      if (saved === 'name') apply(root, 'name');\n      root.addEventListener('click', function (event) {\n        var btn = event.target.closest && event.target.closest('.dss-btn');\n        if (!btn) return;\n        var how = btn.getAttribute('data-sort');\n        apply(root, how);\n        try { localStorage.setItem(KEY, how); } catch (e) { /* private window: the choice lasts for this page */ }\n        // Other switches on the page (the menu and the list) follow.\n        document.querySelectorAll('[data-dss]').forEach(function (other) { if (other !== root) apply(other, how); });\n      });\n    });\n  })();\n<\/script> "])), maybeRenderHead(), addAttribute(["dss", { "dss-compact": compact }], "class:list"), addAttribute(dt("Sort servers"), "aria-label"), addAttribute(targets, "data-dss"), !compact && renderTemplate`<span class="dss-label">${dt("Sort")}</span>`, dt("Members"), dt("Name"));
}, "/home/runner/work/petto-web/petto-web/src/components/DashServerSort.astro", void 0);

export { $$DashServerSort as $ };
