import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, u as unescapeHTML } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { f as firstInRequest } from './oncePerRequest_kWGr_b-C.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://petto.sbs");
const $$MultiSelect = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MultiSelect;
  const { name, options, selected, placeholder = "Search...", giveRole = false, lazy = false } = Astro2.props;
  let source = Astro2.props.source;
  let sharedJson = "";
  if (!source && lazy) {
    let hash = 2166136261;
    for (const o of options) {
      const text = o.id + "" + o.name + "";
      for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
    }
    source = `ms-${(hash >>> 0).toString(36)}-${options.length}`;
    if (firstInRequest(Astro2.request, source)) sharedJson = JSON.stringify(options.map((o) => ({ id: o.id, name: o.name }))).replace(/</g, "\\u003c");
  }
  const rendered = source ? options.filter((o) => selected.includes(o.id)) : options;
  return renderTemplate`${maybeRenderHead()}<div class="dgl-ms" data-multiselect${addAttribute(giveRole ? "" : void 0, "data-give-role")}${addAttribute(source, "data-ms-source")}${addAttribute(source ? name : void 0, "data-ms-name")}> <div class="dgl-ms-chips" data-ms-chips></div> <div class="dgl-ms-control" data-ms-control> <input type="text" class="dgl-ms-input"${addAttribute(placeholder, "placeholder")} data-ms-input data-no-label autocomplete="off"> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="dgl-ms-caret"><path d="m6 9 6 6 6-6"></path></svg> </div> <div class="dgl-ms-dropdown" data-ms-dropdown hidden> ${rendered.map((o) => renderTemplate`<label class="dgl-ms-option" data-ms-option> <input type="checkbox"${addAttribute(name, "name")}${addAttribute(o.id, "value")}${addAttribute(selected.includes(o.id), "checked")} hidden> <span>${o.name}</span> </label>`)} </div> ${sharedJson && renderTemplate(_a || (_a = __template(['<script type="application/json"', ">", "<\/script>"])), addAttribute(source, "data-ms-options"), unescapeHTML(sharedJson))} </div>`;
}, "/home/runner/work/petto-web/petto-web/src/components/MultiSelect.astro", void 0);

export { $$MultiSelect as $ };
