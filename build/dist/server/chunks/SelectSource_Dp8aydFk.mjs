import { c as createAstro, a as createComponent, r as renderTemplate, e as defineScriptVars, u as unescapeHTML, b as addAttribute } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://petto.sbs");
const $$SelectSource = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SelectSource;
  const { name, items, prefix = "" } = Astro2.props;
  const groups = [];
  const byCategory = /* @__PURE__ */ new Map();
  for (const item of items) {
    const key = item.category ?? "";
    let list = byCategory.get(key);
    if (!list) {
      list = [];
      byCategory.set(key, list);
      groups.push([key, list]);
    }
    list.push(item.note ? [item.id, prefix + item.name, item.note] : [item.id, prefix + item.name]);
  }
  const json = JSON.stringify(groups).replace(/</g, "\\u003c");
  return renderTemplate(_a || (_a = __template(['<script type="application/json"', ">", "<\/script> <script>(function(){", `
  (function () {
    var holder = document.querySelector('script[data-fill-src="' + name + '"]');
    var groups;
    try { groups = JSON.parse(holder.textContent || '[]'); } catch (e) { return; }
    document.querySelectorAll('select[data-fill="' + name + '"]').forEach(function (select) {
      var chosen = select.value;
      Array.prototype.slice.call(select.querySelectorAll('[data-fill-item]')).forEach(function (o) { o.remove(); });
      var fragment = document.createDocumentFragment();
      groups.forEach(function (group) {
        var parent = fragment;
        if (group[0]) { parent = document.createElement('optgroup'); parent.label = group[0]; fragment.appendChild(parent); }
        group[1].forEach(function (item) {
          var option = document.createElement('option');
          option.value = item[0];
          option.textContent = item[1];
          if (item[2]) option.setAttribute('data-note', item[2]);
          if (item[0] === chosen && chosen) option.defaultSelected = true;
          parent.appendChild(option);
        });
      });
      select.appendChild(fragment);
      if (chosen) select.value = chosen;
      select.removeAttribute('data-fill');
    });
  })();
})();<\/script>`])), addAttribute(name, "data-fill-src"), unescapeHTML(json), defineScriptVars({ name }));
}, "/home/runner/work/petto-web/petto-web/src/components/SelectSource.astro", void 0);

export { $$SelectSource as $ };
