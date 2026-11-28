import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { r as runOnboardingPage, $ as $$DashOnboarding } from '../../../../chunks/onboardingPage_Cir496yV.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Welcome = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Welcome;
  const { id } = Astro2.params;
  const result = await runOnboardingPage(Astro2, id);
  if ("redirect" in result) return Astro2.redirect(result.redirect);
  const section = Astro2.url.searchParams.get("section");
  const view = section === "dm" || section === "ping" ? section : "messages";
  return renderTemplate`${renderComponent($$result, "DashOnboarding", $$DashOnboarding, { ...result.props, "view": view })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/welcome.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/welcome.astro";
const $$url = "/dash/guild/[id]/welcome";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Welcome,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
