import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://petto.sbs");
const $$SelectChosen = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SelectChosen;
  const { items, selected, prefix = "" } = Astro2.props;
  const item = selected ? items.find((i) => i.id === selected) : void 0;
  return renderTemplate`${item && renderTemplate`${maybeRenderHead()}<option${addAttribute(item.id, "value")} selected data-fill-item${addAttribute(item.note || void 0, "data-note")}>${prefix}${item.name}</option>`}`;
}, "/home/runner/work/petto-web/petto-web/src/components/SelectChosen.astro", void 0);

export { $$SelectChosen as $ };
