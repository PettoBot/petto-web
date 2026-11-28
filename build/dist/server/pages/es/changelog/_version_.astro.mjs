import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Changelog } from '../../../chunks/Changelog_BnYHUjdF.mjs';
import { c as changelogEntries } from '../../../chunks/changelogFeed_DUjcvSF3.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$version = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$version;
  const { version } = Astro2.params;
  if (!(await changelogEntries("es", Astro2)).some((entry) => entry.version === version)) Astro2.response.status = 404;
  Astro2.response.headers.set("Cache-Control", "public, max-age=60, s-maxage=60, stale-while-revalidate=300");
  return renderTemplate`${renderComponent($$result, "Changelog", $$Changelog, { "lang": "es", "version": version })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/es/changelog/[version].astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/es/changelog/[version].astro";
const $$url = "/es/changelog/[version]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$version,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
