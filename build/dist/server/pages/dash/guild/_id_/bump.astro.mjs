import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { r as runOnboardingPage, $ as $$DashOnboarding } from '../../../../chunks/onboardingPage_Cir496yV.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Bump = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Bump;
  const { id } = Astro2.params;
  const result = await runOnboardingPage(Astro2, id);
  if ("redirect" in result) return Astro2.redirect(result.redirect);
  return renderTemplate`${renderComponent($$result, "DashOnboarding", $$DashOnboarding, { ...result.props, "view": "bump" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/bump.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/bump.astro";
const $$url = "/dash/guild/[id]/bump";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Bump,
	file: $$file,
	prerender,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
