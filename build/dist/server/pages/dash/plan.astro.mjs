import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, F as Fragment, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopShared } from '../../chunks/DashShopShared_BdnfBusr.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                   */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashMyPlan = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashMyPlan;
  const { user, state, plans } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric" });
  const names = { bronze: dt("Bronze"), silver: dt("Silver"), gold: dt("Gold") };
  const info = state?.planInfo ?? null;
  const key = info?.active ? info.plan : "free";
  const perks = plans?.[key] ?? null;
  const gives = perks ? [
    { text: dt("{n} ceramos a day", { n: perks.ceramosPerDay }), live: true },
    { text: dt("Places in the showcase of your profile: {n}", { n: perks.showcaseSlots }), live: true },
    { text: dt("Uses of the AI a day: {n}", { n: perks.aiPerDay }), live: true },
    { text: dt("Badges of your own: {n}", { n: perks.ownBadges }), live: true },
    { text: dt("Streak freezes in each streak: {n}", { n: perks.streakFreezes }), live: true },
    ...perks.ownBackground === "still" ? [{ text: dt("Your own picture as the background of your rank card"), live: true }] : [],
    ...perks.ownBackground === "animated" ? [{ text: dt("An animated background (GIF) on your rank card"), live: true }] : [],
    { text: dt("More reminders waiting at once: +{n}%", { n: perks.limitsBonus }), live: true }
  ] : [];
  const active = Boolean(info?.active);
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "plan", "pageTitle": "My plan" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopShared", $$DashShopShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("My plan"), "eyebrow": dt("Subscriptions"), "icon": "ph:identification-badge-fill", "back": false })} ${!state && renderTemplate`${maybeRenderHead()}<p class="bd-down" role="alert">${dt("Petto did not answer. Try again in a moment.")}</p>`}${state && renderTemplate`<div class="mp"> <section class="bd-card mp-plan"> ${active && info ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <img${addAttribute(`/assets/badges/plan-${info.plan}.png`, "src")} alt="" width="56" height="56"> <div> <h2>${dt("{plan} plan", { plan: names[info.plan] ?? info.plan })}</h2> <p>${plans?.[info.plan] ? `$${plans[info.plan].price.toFixed(2)} ${dt("a month")}` : ""}${info.endsAt ? ` \xB7 ${dt("active until {date}", { date: date.format(new Date(info.endsAt)) })}` : ` \xB7 ${dt("no end date")}`}${info.source === "team" ? ` \xB7 ${dt("given by the team")}` : ""}</p> </div> <div class="mp-actions"> <a class="btn" href="/dash/plans">${dt("Change plan")}</a> ${info.source === "payment" && renderTemplate`<a class="btn" href="/plans/portal" rel="noopener">${dt("Payments and cancel")}</a>`} </div> ` })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <div> <h2>${dt("You have no plan")}</h2> <p>${dt("With no plan you get {n} ceramos a day and one place in the showcase of your profile.", { n: state.daily.amount })}</p> </div> <a class="btn mp-go" href="/dash/plans">${dt("See plans")}</a> ` })}`} </section> <div class="mp-stats"> <div class="bd-card"><span>${dt("Ceramos")}</span><b><i class="bd-coin"></i> ${state.balance}</b><small>${dt("+{n} a day with your plan", { n: state.daily.amount })}</small></div> <div class="bd-card"><span>${dt("Places in the showcase")}</span><b>${state.slots} / 6</b><small><a href="/dash/badges">${dt("Choose your badges")}</a></small></div> </div> ${gives.length > 0 && renderTemplate`<section class="bd-card mp-gives"> <span class="mp-label">${dt("What your plan gives")}</span> <ul>${gives.map((line) => renderTemplate`<li${addAttribute({ "is-soon": !line.live }, "class:list")}>${line.text}${!line.live && renderTemplate`<i>${dt("Soon")}</i>`}</li>`)}</ul> </section>`} <p class="mp-note">${dt("If you cancel, the plan stays active until the end of the paid period and does not renew. Payments are not refunded, except duplicated charges, charges made by mistake or never activated.")}</p> </div>`}` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashMyPlan.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Plan = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Plan;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const [catalog, state] = await Promise.all([callPettoCeramos(Astro2, session.userId, "catalog"), callPettoCeramos(Astro2, session.userId, "state")]);
  return renderTemplate`${renderComponent($$result, "DashMyPlan", $$DashMyPlan, { "user": session, "state": state.ok ? state.data : null, "plans": catalog.ok ? catalog.data.plans : null })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/plan.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/plan.astro";
const $$url = "/dash/plan";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Plan,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
