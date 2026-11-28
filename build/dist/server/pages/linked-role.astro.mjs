import { a as createComponent, d as renderComponent, r as renderTemplate } from '../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$LinkedRoles } from '../chunks/LinkedRoles_CmlhXS3g.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$LinkedRole = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "LinkedRoles", $$LinkedRoles, { "lang": "en" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/linked-role.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/linked-role.astro";
const $$url = "/linked-role";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$LinkedRole,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
