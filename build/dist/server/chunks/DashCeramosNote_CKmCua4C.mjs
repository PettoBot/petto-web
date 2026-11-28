import { c as createAstro, a as createComponent, m as maybeRenderHead, d as renderComponent, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                          */

const $$Astro = createAstro("https://petto.sbs");
const $$DashCeramosNote = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashCeramosNote;
  const dt = makeT(getDashLang(Astro2));
  return renderTemplate`${maybeRenderHead()}<div class="cn-note" role="note"> ${renderComponent($$result, "Icon", $$Icon, { "name": "ph:hammer-fill", "width": "18", "height": "18" })} <p><b>${dt("We are working on new ways to get ceramos.")}</b> ${dt("For now you get them with the daily reward, with a plan or by buying a pack. A new way to earn them is on its way.")}</p> </div> `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashCeramosNote.astro", void 0);

export { $$DashCeramosNote as $ };
