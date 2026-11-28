import { c as createAstro, a as createComponent, m as maybeRenderHead, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';

const $$Astro = createAstro("https://petto.sbs");
const $$SkeletonBlocks = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SkeletonBlocks;
  const { variant = "page" } = Astro2.props;
  return renderTemplate`${variant === "editor" ? renderTemplate`${maybeRenderHead()}<div class="sk-wrap sk-editor" aria-hidden="true"><div class="sk-col"><span class="sk sk-line"></span><span class="sk sk-field"></span><span class="sk sk-field"></span><span class="sk sk-field tall"></span><span class="sk sk-field"></span></div><div class="sk-col"><span class="sk sk-card tall"></span></div></div>` : renderTemplate`<div class="sk-wrap" aria-hidden="true"><span class="sk sk-title"></span><span class="sk sk-line"></span><span class="sk sk-line short"></span><div class="sk-grid"><span class="sk sk-card"></span><span class="sk sk-card"></span><span class="sk sk-card"></span><span class="sk sk-card"></span></div></div>`}`;
}, "/home/runner/work/petto-web/petto-web/src/components/SkeletonBlocks.astro", void 0);

export { $$SkeletonBlocks as $ };
