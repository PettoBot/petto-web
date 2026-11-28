import { a as createComponent, d as renderComponent, r as renderTemplate } from '../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$History$1 } from '../chunks/History_xRvlpJe3.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$History = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "History", $$History$1, { "lang": "en" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/history.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/history.astro";
const $$url = "/history";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$History,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
