import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate } from '../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$WebFormPage } from '../../../chunks/WebFormPage_BhVKmkQv.mjs';
import { l as loadFormLook } from '../../../chunks/formPreview_CE8NaVcg.mjs';
import { P as PUBLIC_ID } from '../../../chunks/forms_B4RRKoSS.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const id = String(Astro2.params.id ?? "");
  if (!PUBLIC_ID.test(id)) return new Response("Not found", { status: 404 });
  const { status, look } = await loadFormLook(Astro2, id, "pt-BR");
  if (status === 404) {
    Astro2.response.status = 404;
    Astro2.response.headers.set("X-Astro-Reroute", "no");
  }
  Astro2.response.headers.set("Cache-Control", look ? "public, max-age=60, s-maxage=60, stale-while-revalidate=300" : "no-store");
  return renderTemplate`${renderComponent($$result, "WebFormPage", $$WebFormPage, { "lang": "pt-BR", "id": id, "look": look, "status": status })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/pt-br/form/[id].astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/pt-br/form/[id].astro";
const $$url = "/pt-br/form/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$id,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
