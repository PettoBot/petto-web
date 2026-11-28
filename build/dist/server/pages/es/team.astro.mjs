import { a as createComponent, d as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Team$1 } from '../../chunks/Team_D64b8fB0.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const $$Team = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Team", $$Team$1, { "lang": "es" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/es/team.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/es/team.astro";
const $$url = "/es/team";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Team,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
