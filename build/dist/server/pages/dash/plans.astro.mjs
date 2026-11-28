import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, F as Fragment, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopShared } from '../../chunks/DashShopShared_BdnfBusr.mjs';
import { $ as $$CheckoutConsent } from '../../chunks/CheckoutConsent_BhJLEx7I.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                    */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { i as isPettoOwner, v as planCheckoutReady } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashPlans = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashPlans;
  const { user, plans, current, checkout = {}, failed = false, blocked = false, why = "" } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric" });
  const names = { bronze: dt("Bronze"), silver: dt("Silver"), gold: dt("Gold") };
  const mine = current?.active ? current.plan : null;
  const lines = (key, perks) => [
    { text: dt("{n} ceramos a day", { n: perks.ceramosPerDay }), live: true },
    { text: dt("Places in the showcase of your profile: {n}", { n: perks.showcaseSlots }), live: true },
    { text: dt("Uses of the AI a day: {n}", { n: perks.aiPerDay }), live: true },
    { text: dt("Badges of your own: {n}", { n: perks.ownBadges }), live: true },
    { text: dt("Streak freezes in each streak: {n}", { n: perks.streakFreezes }), live: true },
    ...perks.ownBackground === "still" ? [{ text: dt("Your own picture as the background of your rank card"), live: true }] : [],
    ...perks.ownBackground === "animated" ? [{ text: dt("An animated background (GIF) on your rank card"), live: true }] : [],
    { text: dt("More reminders waiting at once: +{n}%", { n: perks.limitsBonus }), live: true }
  ];
  const ui = { down: dt("Petto did not answer. Try again in a moment.") };
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "plans", "pageTitle": "Plans" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopShared", $$DashShopShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Plans"), "eyebrow": dt("Subscriptions"), "icon": "ph:star-fill", "back": false })} ${failed && renderTemplate`${maybeRenderHead()}<p class="pl-fail" role="alert">${dt("The payment page could not be opened. Try again in a moment.")}${why && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`<br><small>${dt("Only you see this: {why}", { why })}</small>` })}`}</p>`}${blocked && renderTemplate`<p class="pl-fail" role="alert">${dt("You already have a plan. To change it, cancel it first and buy the new one when it ends.")}</p>`}${!plans && renderTemplate`<p class="bd-down" role="alert">${ui.down}</p>`}${plans && renderTemplate`<div class="pl"> <p class="pl-intro">${dt("Monthly plans for you, outside the servers. Cancel whenever you want: it stays active until the end of the paid period. The Premium of a server is separate.")}</p> ${mine && renderTemplate`<p class="pl-have-note"> ${current?.endsAt ? dt("You have the {plan} plan until {date}. You can have one plan at a time: to change it, cancel it and buy the new one when it ends.", { plan: names[mine], date: date.format(new Date(current.endsAt)) }) : dt("You have the {plan} plan. You can have one plan at a time: to change it, the team has to end it first.", { plan: names[mine] })} ${current?.endsAt && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <a href="/plans/portal">${dt("Open the billing portal")}</a>` })}`} </p>`} <div class="pl-grid"> ${["bronze", "silver", "gold"].map((key) => renderTemplate`<article${addAttribute(["bd-card", "pl-card", { "is-mine": mine === key, "is-best": key === "gold" }], "class:list")}> <header> <img${addAttribute(`/assets/badges/plan-${key}.png`, "src")} alt="" width="44" height="44"> <div><h2>${names[key]}</h2>${key === "gold" && renderTemplate`<span class="pl-best">${dt("Most complete")}</span>`}</div> </header> <p class="pl-price"><b>$${plans[key].price.toFixed(2)}</b> <span>${dt("/ month")}</span></p> ${key !== "bronze" && renderTemplate`<p class="pl-more">${dt("Everything in the plan before, and also:")}</p>`} <ul> ${lines(key, plans[key]).map((line) => renderTemplate`<li${addAttribute({ "is-soon": !line.live }, "class:list")}>${line.text}${!line.live && renderTemplate`<i class="pl-soon">${dt("Soon")}</i>`}</li>`)} </ul> <div class="pl-roles"> <b>${dt("Roles you get in the Petto Discord server")}</b> <span class="pl-chips"><i>${names[key]}</i><i>Supporter</i><i>Priority Support</i></span> <small>${dt("They are given to you by themselves, a couple of minutes after the payment, if you are in the server.")}</small> </div> ${mine === key ? renderTemplate`<span class="btn pl-have">${dt("Your plan")}${current?.endsAt && ` \xB7 ${dt("until {date}", { date: date.format(new Date(current.endsAt)) })}`}</span>` : mine ? renderTemplate`<span class="btn pl-ask pl-off" aria-disabled="true">${dt("You already have a plan")}</span>` : checkout[key] ? renderTemplate`<a class="btn pl-ask pl-buy"${addAttribute(`/dash/plans?buy=${key}`, "href")}>${dt("Choose {plan}", { plan: names[key] })}</a>` : renderTemplate`<a class="btn pl-ask" href="/support" rel="noopener">${dt("Ask the team for it")}</a>`} </article>`)} </div> <p class="pl-note">${dt("Payments are not refunded, except a charge that was duplicated, made by mistake or never activated. The Premium of a server is separate.")}</p> </div>
    ${renderComponent($$result2, "CheckoutConsent", $$CheckoutConsent, { "lang": lang })}`}` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashPlans.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Plans = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Plans;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const [catalog, state] = await Promise.all([callPettoCeramos(Astro2, session.userId, "catalog"), callPettoCeramos(Astro2, session.userId, "state")]);
  const why = isPettoOwner(Astro2, session.userId) ? (Astro2.url.searchParams.get("why") ?? "").slice(0, 220) : "";
  const plans = catalog.ok ? catalog.data.plans : null;
  return renderTemplate`${renderComponent($$result, "DashPlans", $$DashPlans, { "user": session, "plans": plans ? { bronze: plans.bronze, silver: plans.silver, gold: plans.gold } : null, "current": state.ok ? state.data.planInfo : null, "checkout": planCheckoutReady(Astro2), "failed": Astro2.url.searchParams.get("error") === "checkout_unavailable", "blocked": Astro2.url.searchParams.get("error") === "has_plan", "why": why })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/plans.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/plans.astro";
const $$url = "/dash/plans";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Plans,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
