import { a as createComponent, d as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$GlobalStats } from '../../chunks/GlobalStats_D6tmIPW5.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const $$Stats = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "GlobalStats", $$GlobalStats, { "lang": "es" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/es/stats.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/es/stats.astro";
const $$url = "/es/stats";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Stats,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
