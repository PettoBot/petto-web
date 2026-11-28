import { a as createComponent, d as renderComponent, r as renderTemplate } from '../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Credits$1 } from '../chunks/Credits_BdhgoPL_.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Credits = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Credits", $$Credits$1, { "lang": "en" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/credits.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/credits.astro";
const $$url = "/credits";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Credits,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
