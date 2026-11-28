import { c as createAstro, a as createComponent } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { f as formLinkRedirect } from '../../chunks/formPreview_CE8NaVcg.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$id = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  return formLinkRedirect(Astro2);
}, "/home/runner/work/petto-web/petto-web/src/pages/f/[id].astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/f/[id].astro";
const $$url = "/f/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$id,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
