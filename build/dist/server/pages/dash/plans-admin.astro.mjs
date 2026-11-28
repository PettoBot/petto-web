import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopAdminShared } from '../../chunks/DashShopAdminShared_DyqGJdSO.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
import { $ as $$StaffProblem, s as staffProblem } from '../../chunks/staffProblem__taxH1e2.mjs';
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { i as isPettoOwner } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashPlansAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashPlansAdmin;
  const { user, plans, problem } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "short", year: "numeric" });
  const names = { bronze: dt("Bronze"), silver: dt("Silver"), gold: dt("Gold") };
  const ui = {
    saved: dt("Saved."),
    saving: dt("Saving\u2026"),
    down: dt("Petto did not answer. Try again in a moment."),
    errors: { bad_person: dt("The id of the person is 15 to 25 digits."), bad_plan: dt("That plan does not exist."), bad_days: dt("The days are a whole number from 1 to 3650, or empty for no end."), not_found: dt("That person has no active plan."), forbidden: dt("Only the owner can do this."), failed: dt("That did not work. Try again in a moment.") }
  };
  const boot = JSON.stringify({ ui }).replace(/</g, "\\u003c");
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "staff-plans", "pageTitle": "User plans" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopAdminShared", $$DashShopAdminShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("User plans"), "eyebrow": dt("Staff"), "icon": "ph:star-fill", "back": false })} ${!plans && renderTemplate`${renderComponent($$result2, "StaffProblem", $$StaffProblem, { "problem": problem })}`}${plans && renderTemplate`${maybeRenderHead()}<div class="be" id="be"${addAttribute(boot, "data-boot")}> <p class="be-intro">${dt("Give a plan to a person until the payment is connected. The person gets the places in the showcase and the daily ceramos of the plan at once.")}</p> <div class="be-list"> ${plans.length === 0 && renderTemplate`<p class="be-empty">${dt("Nobody has a plan yet.")}</p>`} ${plans.map((row) => renderTemplate`<article class="be-row"> <span class="be-hex be-bare"><img${addAttribute(`/assets/badges/plan-${row.plan}.png`, "src")} alt="" width="40" height="40"></span> <div class="be-info"> <strong>${row.userId}</strong> <span class="be-meta"><i class="be-chip be-live">${names[row.plan] ?? row.plan}</i><span>${row.endsAt ? dt("Until {date}", { date: date.format(new Date(row.endsAt)) }) : dt("No end date")}</span>${row.note && renderTemplate`<span>${row.note}</span>`}</span> </div> <div class="be-actions"><button type="button" class="btn be-off"${addAttribute(row.userId, "data-end")}>${dt("End plan")}</button></div> </article>`)} </div> <form class="be-form" id="be-form" autocomplete="off"> <h2>${dt("Give a plan")}</h2> <div class="be-grid"> <label>${dt("Id of the person (Discord)")}<input name="person" required inputmode="numeric" pattern="[0-9]{15,25}" placeholder="293504726505357312"></label> <label>${dt("Plan")}<select name="plan"><option value="bronze">${dt("Bronze")}</option><option value="silver">${dt("Silver")}</option><option value="gold">${dt("Gold")}</option></select></label> <label>${dt("Days (empty: no end)")}<input name="days" type="number" min="1" max="3650" step="1" value="30"></label> <label>${dt("Note (only the team sees it)")}<input name="note" maxlength="200"></label> </div> <p class="be-msg" id="be-msg" role="status" hidden></p> <div class="be-buttons"><button type="submit" class="btn be-save" id="be-save">${dt("Give plan")}</button></div> </form> </div>`}` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashPlansAdmin.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$PlansAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$PlansAdmin;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  if (!isPettoOwner(Astro2, session.userId)) return new Response("Not found", { status: 404 });
  const list = await callPettoCeramos(Astro2, session.userId, "admin/plans");
  return renderTemplate`${renderComponent($$result, "DashPlansAdmin", $$DashPlansAdmin, { "user": session, "problem": staffProblem(list) ?? void 0, "plans": list.ok ? list.data.plans : null })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/plans-admin.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/plans-admin.astro";
const $$url = "/dash/plans-admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PlansAdmin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
