import { c as createAstro, a as createComponent, m as maybeRenderHead, r as renderTemplate, u as unescapeHTML } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { g as getDashLang, m as makeT } from './dash_CORIPvM-.mjs';
import { v as variableGroupsJson } from './DashAcData_BviQOYRU.mjs';
import { f as firstInRequest } from './oncePerRequest_kWGr_b-C.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://petto.sbs");
const $$VariableHelp = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$VariableHelp;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const first = firstInRequest(Astro2.request, "variables");
  const json = first ? await variableGroupsJson(Astro2, dt) : "";
  return renderTemplate`${maybeRenderHead()}<div class="dgl-varmenu-wrap" data-varmenu> <button type="button" class="dgl-varbtn" data-varmenu-toggle> <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V5a1 1 0 0 1 1-1h2M20 7V5a1 1 0 0 1-1-1h-2M4 17v2a1 1 0 0 0 1 1h2M20 17v2a1 1 0 0 1-1 1h-2"></path><path d="M9 9l1.5 6M15 9l-1.5 6"></path></svg> ${dt("Variables")} <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="dgl-varbtn-caret"><path d="m6 9 6 6 6-6"></path></svg> </button> <div class="dgl-varmenu" data-varmenu-panel data-varmenu-lazy hidden> <p class="dgl-varmenu-hint">${dt("Click one to copy it, then paste it wherever you want it to appear.")}</p> <p class="dgl-varmenu-hint">${dt("Silent mention: write ! right before a mention (!@everyone, !@Role, !{user.mention}) and it shows without notifying anyone.")}</p> </div> ${first && renderTemplate(_a || (_a = __template(['<script type="application/json" data-var-groups>', "<\/script>"])), unescapeHTML(json))} </div>`;
}, "/home/runner/work/petto-web/petto-web/src/components/VariableHelp.astro", void 0);

export { $$VariableHelp as $ };
