import { c as createAstro, a as createComponent, r as renderTemplate, u as unescapeHTML } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { g as getDashLang, d as dashCatalog } from './dash_CORIPvM-.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://petto.sbs");
const $$DashReactWords = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashReactWords;
  const lang = getDashLang(Astro2);
  const json = lang === "en" ? "" : JSON.stringify(dashCatalog(lang)).replace(/</g, "\\u003c");
  return renderTemplate`${json && renderTemplate(_a || (_a = __template(['<script type="application/json" id="dash-react-words">', "<\/script>"])), unescapeHTML(json))}`;
}, "/home/runner/work/petto-web/petto-web/src/components/DashReactWords.astro", void 0);

export { $$DashReactWords as $ };
