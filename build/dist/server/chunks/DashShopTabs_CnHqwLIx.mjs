import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                                */

const $$Astro = createAstro("https://petto.sbs");
const $$DashShopTabs = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashShopTabs;
  const { active } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const tabs = [
    { id: "badges", href: "/dash/badges-admin", label: dt("Badges") },
    { id: "builtin", href: "/dash/shop-admin?tab=builtin", label: dt("Badges of the code") },
    { id: "packs", href: "/dash/shop-admin?tab=packs", label: dt("Packs") },
    { id: "banners", href: "/dash/shop-admin?tab=banners", label: dt("Banners") },
    { id: "fonts", href: "/dash/shop-admin?tab=fonts", label: dt("Name fonts") }
  ];
  return renderTemplate`${maybeRenderHead()}<nav class="st"${addAttribute(dt("Editor of the shop"), "aria-label")}> ${tabs.map((tab) => renderTemplate`<a${addAttribute(tab.href, "href")}${addAttribute(tab.id === active ? "is-on" : "", "class")}${addAttribute(tab.id === active ? "page" : void 0, "aria-current")}>${tab.label}</a>`)} </nav> `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashShopTabs.astro", void 0);

export { $$DashShopTabs as $ };
