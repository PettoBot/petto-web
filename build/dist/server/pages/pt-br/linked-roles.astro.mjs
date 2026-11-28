import { a as createComponent, d as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$LinkedRoles$1 } from '../../chunks/LinkedRoles_CmlhXS3g.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const $$LinkedRoles = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "LinkedRoles", $$LinkedRoles$1, { "lang": "pt-BR" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/pt-br/linked-roles.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/pt-br/linked-roles.astro";
const $$url = "/pt-br/linked-roles";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$LinkedRoles,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
