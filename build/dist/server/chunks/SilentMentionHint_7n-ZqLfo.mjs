import { c as createAstro, a as createComponent, m as maybeRenderHead, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                            */

const $$Astro = createAstro("https://petto.sbs");
const $$SilentMentionHint = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$SilentMentionHint;
  const dt = makeT(getDashLang(Astro2));
  const parts = dt("Tip: put `!` before a mention (`!@everyone`, `!@Role`) to show it without notifying anyone.").split("`");
  return renderTemplate`${maybeRenderHead()}<span class="dgl-silent-hint">${parts.map((part, index) => index % 2 ? renderTemplate`<code>${part}</code>` : part)}</span> `;
}, "/home/runner/work/petto-web/petto-web/src/components/SilentMentionHint.astro", void 0);

export { $$SilentMentionHint as $ };
