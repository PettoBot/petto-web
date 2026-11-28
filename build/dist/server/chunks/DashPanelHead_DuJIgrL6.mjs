import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, d as renderComponent, r as renderTemplate, f as renderSlot } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                           */

const $$Astro = createAstro("https://petto.sbs");
const $$DashPanelHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashPanelHead;
  const dt = makeT(getDashLang(Astro2));
  const { title, eyebrow, icon, back = true, backLabel } = Astro2.props;
  const backHref = typeof back === "string" ? back : "/dash/manage";
  const hasActions = Astro2.slots.has("default");
  return renderTemplate`${maybeRenderHead()}<header class="dph" data-astro-cid-gw366em6> ${back !== false && renderTemplate`<a class="dph-back"${addAttribute(backHref, "href")} data-astro-cid-gw366em6>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:arrow-left", "width": "13", "height": "13", "data-astro-cid-gw366em6": true })}${backLabel ?? dt("Back to servers")}</a>`} <div class="dph-row" data-astro-cid-gw366em6> <div class="dph-text" data-astro-cid-gw366em6> ${eyebrow && renderTemplate`<div class="eyebrow dph-eyebrow" data-astro-cid-gw366em6>${icon && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon, "width": "14", "height": "14", "data-astro-cid-gw366em6": true })}`}${eyebrow}</div>`} <h1 class="dph-title" data-astro-cid-gw366em6>${title}${renderSlot($$result, $$slots["badge"])}</h1> </div> ${hasActions && renderTemplate`<div class="dph-actions" data-astro-cid-gw366em6>${renderSlot($$result, $$slots["default"])}</div>`} </div> </header> `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashPanelHead.astro", void 0);

export { $$DashPanelHead as $ };
