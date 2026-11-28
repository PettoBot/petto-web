import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, d as renderComponent, f as renderSlot, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                          */

const $$Astro = createAstro("https://petto.sbs");
const $$Modal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Modal;
  const dt = makeT(getDashLang(Astro2));
  const { id, title, icon = "ph:image-fill" } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="mdl"${addAttribute(id, "id")} hidden role="dialog" aria-modal="true"${addAttribute(`${id}-title`, "aria-labelledby")}> <div class="mdl-box"> <header class="mdl-head"><span class="mdl-ico">${renderComponent($$result, "Icon", $$Icon, { "name": icon, "width": "18", "height": "18" })}</span><h2${addAttribute(`${id}-title`, "id")}>${title}</h2><button type="button" class="mdl-x" data-modal-close${addAttribute(dt("Close"), "aria-label")}>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:x-bold", "width": "14", "height": "14" })}</button></header> ${renderSlot($$result, $$slots["default"])} </div> </div>  `;
}, "/home/runner/work/petto-web/petto-web/src/components/Modal.astro", void 0);

export { $$Modal as $ };
