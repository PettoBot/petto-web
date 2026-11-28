import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Changelog$1 } from '../../chunks/Changelog_BnYHUjdF.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Changelog = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Changelog;
  Astro2.response.headers.set("Cache-Control", "public, max-age=60, s-maxage=60, stale-while-revalidate=300");
  return renderTemplate`${renderComponent($$result, "Changelog", $$Changelog$1, { "lang": "pt-BR" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/pt-br/changelog.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/pt-br/changelog.astro";
const $$url = "/pt-br/changelog";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Changelog,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
