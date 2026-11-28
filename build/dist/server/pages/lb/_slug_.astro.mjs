import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Leaderboard } from '../../chunks/Leaderboard_Cg6ANHX0.mjs';
import { l as loadLeaderboard } from '../../chunks/leaderboard_DVUxK20u.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const data = await loadLeaderboard(Astro2, slug);
  if (data.status === "missing") Astro2.response.status = 404;
  if (data.status === "down") Astro2.response.status = 503;
  return renderTemplate`${renderComponent($$result, "Leaderboard", $$Leaderboard, { "lang": "en", "slug": slug, "data": data })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/lb/[slug].astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/lb/[slug].astro";
const $$url = "/lb/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$slug,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
