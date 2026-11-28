import { a as createComponent, d as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Status$1 } from '../../chunks/Status_DgAuMj28.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const $$Status = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Status", $$Status$1, { "lang": "pt-BR" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/pt-br/status.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/pt-br/status.astro";
const $$url = "/pt-br/status";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Status,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
