import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                             */

const $$Astro = createAstro("https://petto.sbs");
const $$UserChip = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$UserChip;
  const { id, person = null } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<span class="uc" data-astro-cid-gug7z6xp> ${person && renderTemplate`<img${addAttribute(person.avatar, "src")} alt="" width="22" height="22" loading="lazy" data-astro-cid-gug7z6xp>`} <span class="uc-text" data-astro-cid-gug7z6xp><b data-astro-cid-gug7z6xp>${person?.name ?? id}</b>${person && renderTemplate`<code data-astro-cid-gug7z6xp>${id}</code>`}</span> </span> `;
}, "/home/runner/work/petto-web/petto-web/src/components/UserChip.astro", void 0);

export { $$UserChip as $ };
