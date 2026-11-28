import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashCeramosNote } from '../../chunks/DashCeramosNote_CKmCua4C.mjs';
import { $ as $$DashShopShared } from '../../chunks/DashShopShared_BdnfBusr.mjs';
import { m as makeT, g as getDashLang } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                    */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashDaily = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashDaily;
  const { user, state, plans = null, movements = null } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const when = new Intl.DateTimeFormat(getDashLang(Astro2), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const reasons = {
    daily: dt("Daily reward"),
    badge: dt("Badge bought"),
    frame: dt("Frame bought"),
    banner: dt("Banner bought"),
    font: dt("Name font bought"),
    pack: dt("Pack bought"),
    purchase: dt("Pack of ceramos bought"),
    mission: dt("Mission"),
    grant: dt("Gift from the team"),
    take: dt("Adjusted by the team"),
    refund: dt("Refund")
  };
  const names = { free: dt("No plan"), bronze: dt("Bronze"), silver: dt("Silver"), gold: dt("Gold") };
  const mine = state?.plan ?? "free";
  const recent = (movements ?? []).slice(0, 5);
  const boot = state ? JSON.stringify({ state, ui: { claim: dt("Claim {n} ceramos"), claimed: dt("You claimed {n} ceramos."), next: dt("Next daily in {time}"), hours: dt("{h}h {m}m"), minutes: dt("{m}m"), down: dt("Petto did not answer. Try again in a moment.") } }).replace(/</g, "\\u003c") : "";
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "daily", "pageTitle": "Daily reward" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopShared", $$DashShopShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Daily reward"), "eyebrow": dt("Main"), "icon": "ph:gift-fill", "back": false })} ${renderComponent($$result2, "DashCeramosNote", $$DashCeramosNote, {})} ${!state && renderTemplate`${maybeRenderHead()}<p class="bd-down" role="alert">${dt("Petto did not answer. Try again in a moment.")}</p>`}${state && renderTemplate`<div class="dd" id="dd"${addAttribute(boot, "data-boot")}> <section class="bd-card dd-card"> <span class="dd-label">${dt("Your ceramos")}</span> <b class="dd-bal"><i class="bd-coin"></i> <span id="dd-balance">${state.balance}</span></b> <button type="button" class="btn dd-claim" id="dd-claim"${addAttribute(!state.daily.canClaim, "hidden")}></button> <p class="dd-next" id="dd-next"${addAttribute(state.daily.canClaim, "hidden")}></p> <p class="dd-msg" id="dd-msg" role="status" hidden></p> <p class="dd-hint">${dt("The day changes at 00:00 UTC, the same for everybody. A plan gives more ceramos a day.")} <a href="/dash/plans">${dt("See plans")}</a></p> </section> ${plans && renderTemplate`<section class="bd-card dd-plans"> <span class="dd-label">${dt("Ceramos a day by plan")}</span> <ul> ${["free", "bronze", "silver", "gold"].filter((key) => plans[key]).map((key) => renderTemplate`<li${addAttribute({ "is-mine": mine === key }, "class:list")}><span>${names[key]}${mine === key && renderTemplate`<i>${dt("Your plan")}</i>`}</span><b><i class="bd-coin"></i> ${plans[key].ceramosPerDay}</b></li>`)} </ul> </section>`} ${recent.length > 0 && renderTemplate`<section class="bd-card dd-recent"> <div class="dd-recent-head"><span class="dd-label">${dt("Latest movements")}</span><a href="/dash/ceramos">${dt("See all")}</a></div> <ul> ${recent.map((move) => renderTemplate`<li> <div><strong>${reasons[move.reason] ?? move.reason}</strong>${move.ref && renderTemplate`<span>${move.ref.split(":")[0]}</span>`}</div> <time${addAttribute(move.at, "datetime")}>${when.format(new Date(move.at))}</time> <b${addAttribute(["dd-amount", { "is-in": move.delta > 0 }], "class:list")}>${move.delta > 0 ? "+" : "\u2212"}${Math.abs(move.delta)}</b> </li>`)} </ul> </section>`} </div>`}` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashDaily.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Daily = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Daily;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const [state, catalog, ledger] = await Promise.all([callPettoCeramos(Astro2, session.userId, "state"), callPettoCeramos(Astro2, session.userId, "catalog"), callPettoCeramos(Astro2, session.userId, "ledger")]);
  return renderTemplate`${renderComponent($$result, "DashDaily", $$DashDaily, { "user": session, "state": state.ok ? state.data : null, "plans": catalog.ok ? catalog.data.plans : null, "movements": ledger.ok ? ledger.data.movements : null })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/daily.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/daily.astro";
const $$url = "/dash/daily";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Daily,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
