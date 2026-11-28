import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                          */

const $$Astro = createAstro("https://petto.sbs");
const $$ColorPicker = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ColorPicker;
  const DEFAULT_PRESETS = ["#2dd4a7", "#3ba776", "#5b8def", "#a78bfa", "#e0568c", "#f5c945", "#f2994a", "#ef5b5b", "#7c8a94", "#4b5b63", "#0f1115", "#ffffff"];
  const { name, value = "#8399ff", label = "Color", presets = DEFAULT_PRESETS, allowNone = false, id, lang } = Astro2.props;
  const dt = makeT(lang ?? getDashLang(Astro2));
  const isNone = allowNone && value === "";
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["dgl-cp", { "is-none": isNone }], "class:list")} data-colorpicker${addAttribute(value, "data-cp-default")}${addAttribute(allowNone ? "" : void 0, "data-cp-allownone")}${addAttribute(dt("No color"), "data-cp-nonelabel")} data-astro-cid-lc6of2cq> <button type="button" class="dgl-cp-trigger" data-cp-trigger data-astro-cid-lc6of2cq> <span class="dgl-cp-swatch" data-cp-swatch${addAttribute(`--sw:${value || "#8399ff"}`, "style")} data-astro-cid-lc6of2cq></span> <span class="dgl-cp-hexlabel" data-cp-hexlabel data-astro-cid-lc6of2cq>${isNone ? dt("No color") : value}</span> <span class="dgl-cp-fieldlabel" data-astro-cid-lc6of2cq>${label}</span> </button> <input type="hidden"${addAttribute(id, "id")}${addAttribute(name, "name")}${addAttribute(value, "value")} data-cp-value data-astro-cid-lc6of2cq>  <div class="dgl-cp-panel" data-cp-panel hidden data-cp-build${addAttribute(presets.join(","), "data-cp-presets")}${addAttribute(dt("Hex"), "data-cp-l-hex")}${addAttribute(allowNone ? dt("No color") : void 0, "data-cp-l-none")}${addAttribute(dt("Reset"), "data-cp-l-reset")} data-astro-cid-lc6of2cq></div> </div> `;
}, "/home/runner/work/petto-web/petto-web/src/components/ColorPicker.astro", void 0);

export { $$ColorPicker as $ };
