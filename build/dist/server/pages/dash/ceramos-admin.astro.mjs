import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopAdminShared } from '../../chunks/DashShopAdminShared_DyqGJdSO.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
import { $ as $$StaffProblem, s as staffProblem } from '../../chunks/staffProblem__taxH1e2.mjs';
/* empty css                                            */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { i as isPettoOwner } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashCeramosAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashCeramosAdmin;
  const { user, data, problem } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const number = new Intl.NumberFormat(lang);
  const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const ui = {
    saved: dt("Saved."),
    saving: dt("Saving\u2026"),
    down: dt("Petto did not answer. Try again in a moment."),
    given: dt("Done: the new balance is {balance}."),
    errors: {
      forbidden: dt("You cannot give ceramos right now."),
      bad_person: dt("The id of the person is 15 to 25 digits."),
      bad_amount: dt("The amount is a whole number from 1."),
      too_much: dt("That is more than the most you can give in one gift ({max})."),
      daily_limit: dt("That is more than what you can still give today ({left})."),
      failed: dt("It could not be done. Try again in a moment.")
    }
  };
  const boot = JSON.stringify({ ui }).replace(/</g, "\\u003c");
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "staff-grant", "pageTitle": "Give ceramos" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopAdminShared", $$DashShopAdminShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Give ceramos"), "eyebrow": dt("Staff"), "icon": "ph:coins-fill", "back": false })} ${!data && renderTemplate`${renderComponent($$result2, "StaffProblem", $$StaffProblem, { "problem": problem })}`}${data && renderTemplate`${maybeRenderHead()}<div class="be" id="be"${addAttribute(boot, "data-boot")}> <p class="be-intro"> ${dt("Give ceramos to a person. They arrive at once and show in their movements as a gift from the team.")} ${data.leftToday !== null ? " " + dt("In one gift you can give up to {max}, and you can still give {left} today.", { max: number.format(data.maxPerGrant), left: number.format(data.leftToday) }) : " " + dt("You are the owner: you only have the limit of one gift ({max}).", { max: number.format(data.maxPerGrant) })} </p> <form class="be-form" id="be-form" autocomplete="off"> <h2>${dt("Give ceramos")}</h2> <div class="be-grid"> <label>${dt("Id of the person (Discord)")}<input name="person" required inputmode="numeric" pattern="[0-9]{15,25}" placeholder="293504726505357312"></label> <label>${dt("How many ceramos")}<input name="amount" type="number" required min="1"${addAttribute(data.maxPerGrant, "max")} step="1" value="100"></label> <label class="be-wide">${dt("Why (written in the movements)")}<input name="note" maxlength="60"></label> </div> <p class="be-msg" id="be-msg" role="status" hidden></p> <div class="be-buttons"><button type="submit" class="btn be-save" id="be-save">${dt("Give ceramos")}</button></div> </form> <div class="be-list" role="group"${addAttribute(dt("Last gifts"), "aria-label")}> <h2>${dt("Last gifts")}</h2> ${data.recent.length === 0 && renderTemplate`<p class="be-empty">${dt("Nobody has been given ceramos yet.")}</p>`} ${data.recent.map((gift) => renderTemplate`<article class="be-row"> <div class="be-info"> <strong>+${number.format(gift.amount)} → ${gift.userId}</strong> <span class="be-meta"><span>${date.format(new Date(gift.createdAt))}</span>${gift.byUser && renderTemplate`<span>${dt("by {id}", { id: gift.byUser })}</span>`}${gift.note && renderTemplate`<span>${gift.note}</span>`}</span> </div> </article>`)} </div> ${data.isOwner && data.settings && renderTemplate`<form class="be-form" id="be-settings" autocomplete="off"> <h2>${dt("Who can give, and how much")}</h2> <p class="be-intro">${dt("You can always give. The people on this list can give inside these limits. Put one Discord id on each line.")}</p> <div class="be-grid"> <label class="be-check"><input type="checkbox" name="enabled"${addAttribute(data.settings.enabled, "checked")}> ${dt("Let the people on the list give ceramos")}</label> <label>${dt("Most in one gift")}<input name="maxPerGrant" type="number" min="1" max="100000" step="1"${addAttribute(data.settings.maxPerGrant, "value")}></label> <label>${dt("Most a day for each person")}<input name="maxPerDay" type="number" min="1" max="1000000" step="1"${addAttribute(data.settings.maxPerDay, "value")}></label> <label class="be-wide">${dt("People who can give (Discord ids)")}<textarea name="people" rows="4" placeholder="293504726505357312">${data.settings.people.join("\n")}</textarea></label> </div> <p class="be-msg" id="be-smsg" role="status" hidden></p> <div class="be-buttons"><button type="submit" class="btn be-save" id="be-ssave">${dt("Save")}</button></div> </form>`} </div>`}` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashCeramosAdmin.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$CeramosAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$CeramosAdmin;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const state = await callPettoCeramos(Astro2, session.userId, "admin/grant");
  const owner = isPettoOwner(Astro2, session.userId);
  if (state.ok && state.data && state.data.allowed === false && !owner) return new Response("Not found", { status: 404 });
  const mismatch = owner && state.ok && state.data && state.data.allowed === false;
  const problem = mismatch ? "forbidden" : staffProblem(state);
  return renderTemplate`${renderComponent($$result, "DashCeramosAdmin", $$DashCeramosAdmin, { "user": session, "data": state.ok && !mismatch ? state.data : null, "problem": problem ?? void 0 })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/ceramos-admin.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/ceramos-admin.astro";
const $$url = "/dash/ceramos-admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$CeramosAdmin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
