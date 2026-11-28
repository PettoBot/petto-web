import { c as createAstro, a as createComponent, r as renderTemplate, u as unescapeHTML, b as addAttribute } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://petto.sbs");
const $$MultiSelectOptions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MultiSelectOptions;
  const { name, options } = Astro2.props;
  const json = JSON.stringify(options.map((o) => ({ id: o.id, name: o.name }))).replace(/</g, "\\u003c");
  return renderTemplate(_a || (_a = __template(['<script type="application/json"', ">", "<\/script>"])), addAttribute(name, "data-ms-options"), unescapeHTML(json));
}, "/home/runner/work/petto-web/petto-web/src/components/MultiSelectOptions.astro", void 0);

export { $$MultiSelectOptions as $ };
