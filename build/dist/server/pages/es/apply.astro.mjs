import { a as createComponent, d as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Apply$1 } from '../../chunks/Apply_3xJa7U5m.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const $$Apply = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Apply", $$Apply$1, { "lang": "es" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/es/apply.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/es/apply.astro";
const $$url = "/es/apply";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Apply,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
