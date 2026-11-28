import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';

const $$Astro = createAstro("https://petto.sbs");
const $$CeramosBalance = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CeramosBalance;
  const { balance, id } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  return renderTemplate`${maybeRenderHead()}<span class="bd-bal"><small>${dt("Your balance")}</small><span class="bd-bal-n"><i class="bd-coin"></i><b${addAttribute(id, "id")}>${balance}</b></span></span>`;
}, "/home/runner/work/petto-web/petto-web/src/components/CeramosBalance.astro", void 0);

export { $$CeramosBalance as $ };
