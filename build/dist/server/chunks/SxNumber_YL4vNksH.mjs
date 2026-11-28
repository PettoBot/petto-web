import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, s as spreadAttributes, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'clsx';

const $$Astro = createAstro("https://petto.sbs");
const $$SxNumber = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SxNumber;
  const { name, value, min, max, step = 1, class: extra, ...rest } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<span${addAttribute(["sx-stepper", extra], "class:list")}> <button type="button" class="sx-step" data-sx-step="-1" tabindex="-1" aria-label="−"><svg viewBox="0 0 256 256" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8Z"></path></svg></button> <input type="number"${addAttribute(name, "name")}${addAttribute(value, "value")}${addAttribute(min, "min")}${addAttribute(max, "max")}${addAttribute(step, "step")} inputmode="numeric"${spreadAttributes(rest)}> <button type="button" class="sx-step" data-sx-step="1" tabindex="-1" aria-label="+"><svg viewBox="0 0 256 256" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M224 128a8 8 0 0 1-8 8h-88v88a8 8 0 0 1-16 0v-88H32a8 8 0 0 1 0-16h88V32a8 8 0 0 1 16 0v88h88a8 8 0 0 1 8 8Z"></path></svg></button> </span>`;
}, "/home/runner/work/petto-web/petto-web/src/components/SxNumber.astro", void 0);

export { $$SxNumber as $ };
