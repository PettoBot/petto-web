import { a as createComponent, d as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Partners$1 } from '../../chunks/Partners_D8QusuSO.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const $$Partners = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Partners", $$Partners$1, { "lang": "pt-BR" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/pt-br/partners.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/pt-br/partners.astro";
const $$url = "/pt-br/partners";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Partners,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
