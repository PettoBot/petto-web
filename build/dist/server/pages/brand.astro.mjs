import { a as createComponent, d as renderComponent, r as renderTemplate } from '../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Brand$1 } from '../chunks/Brand_BB3Xmrq0.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Brand = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Brand", $$Brand$1, { "lang": "en" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/brand.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/brand.astro";
const $$url = "/brand";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Brand,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
