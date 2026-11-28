import { c as createAstro, a as createComponent, m as maybeRenderHead, r as renderTemplate, b as addAttribute } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';

const $$Astro = createAstro("https://petto.sbs");
const $$ChannelOptions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ChannelOptions;
  const { channels, selected = "", create = false } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const groups = /* @__PURE__ */ new Map();
  for (const channel of channels) {
    const key = channel.category ?? "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(channel);
  }
  return renderTemplate`${create && renderTemplate`${maybeRenderHead()}<option value="__new__">${dt("Create a new channel")}</option>`}${[...groups].map(([category, list]) => category ? renderTemplate`<optgroup${addAttribute(category, "label")}>${list.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === selected, "selected")}>#${c.name}</option>`)}</optgroup>` : list.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === selected, "selected")}>#${c.name}</option>`))}`;
}, "/home/runner/work/petto-web/petto-web/src/components/ChannelOptions.astro", void 0);

export { $$ChannelOptions as $ };
