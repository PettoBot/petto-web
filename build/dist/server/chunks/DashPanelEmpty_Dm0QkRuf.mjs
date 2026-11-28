import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, d as renderComponent, f as renderSlot, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
/* empty css                           */

const $$Astro = createAstro("https://petto.sbs");
const $$DashPanelEmpty = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashPanelEmpty;
  const { text, icon = "ph:sparkle-fill", id, hidden = false, tone = "muted" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["dpe", { "dpe-error": tone === "error" }], "class:list")}${addAttribute(id, "id")}${addAttribute(hidden, "hidden")} data-astro-cid-rjamatdn> <span class="dpe-icon" aria-hidden="true" data-astro-cid-rjamatdn>${renderComponent($$result, "Icon", $$Icon, { "name": icon, "width": "18", "height": "18", "data-astro-cid-rjamatdn": true })}</span> <p data-astro-cid-rjamatdn>${text}</p> ${Astro2.slots.has("default") && renderTemplate`<div class="dpe-actions" data-astro-cid-rjamatdn>${renderSlot($$result, $$slots["default"])}</div>`} </div> `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashPanelEmpty.astro", void 0);

export { $$DashPanelEmpty as $ };
