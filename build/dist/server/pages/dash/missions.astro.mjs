import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopShared } from '../../chunks/DashShopShared_BdnfBusr.mjs';
import { $ as $$CeramosBalance } from '../../chunks/CeramosBalance_BknhqXYc.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                       */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashMissions = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashMissions;
  const { user, data, balance } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const number = new Intl.NumberFormat(lang);
  const when = new Intl.DateTimeFormat(lang, { weekday: "short", hour: "2-digit", minute: "2-digit" });
  const groups = data ? [["day", dt("Today"), data.resets.day], ["week", dt("This week"), data.resets.week]] : [];
  const ready = data ? data.missions.filter((mission) => mission.complete && !mission.claimed) : [];
  const boot = JSON.stringify({ ui: { working: dt("Working\u2026"), down: dt("Petto did not answer. Try again in a moment."), failed: dt("It could not be done. Try again in a moment."), nothing: dt("No mission is ready to claim yet.") } }).replace(/</g, "\\u003c");
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "missions", "pageTitle": "Missions" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopShared", $$DashShopShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Missions"), "eyebrow": dt("Ceramos"), "icon": "ph:target-fill", "back": false }, { "default": async ($$result3) => renderTemplate`${balance !== null && renderTemplate`${maybeRenderHead()}<div class="bd-wallet">${renderComponent($$result3, "CeramosBalance", $$CeramosBalance, { "balance": balance })}</div>`}` })} ${!data && renderTemplate`<p class="bd-down" role="alert">${dt("Petto did not answer. Try again in a moment.")}</p>`}${data && renderTemplate`<div class="ms" id="ms"${addAttribute(boot, "data-boot")}> <p class="ms-lead">${dt("Chat and join voice channels to fill your missions and earn ceramos. The count is the activity of every server where Petto counts it.")}</p> <p class="ms-msg" id="ms-msg" role="status" hidden></p> <div class="ms-top"><button type="button" class="btn ms-claim" id="ms-claim"${addAttribute(ready.length, "data-ready")}${addAttribute(ready.length === 0, "disabled")}>${ready.length ? dt("Claim {n} ready", { n: String(ready.length) }) : dt("Nothing to claim yet")}</button></div> <div class="ms-groups"> ${groups.map(([period, title, resets]) => renderTemplate`<section class="bd-card ms-card"${addAttribute(title, "aria-label")}> <header><h2>${title}</h2><span>${dt("Resets {when}", { when: when.format(new Date(resets)) })}</span></header> ${data.missions.filter((mission) => mission.period === period).map((mission) => renderTemplate`<article${addAttribute(["ms-row", { "is-done": mission.claimed }], "class:list")}> <div class="ms-info"> <strong>${mission.kind === "messages" ? dt("Send {n} messages", { n: number.format(mission.target) }) : dt("Spend {n} minutes in voice", { n: number.format(mission.target) })}</strong> <div class="ms-bar" role="progressbar" aria-valuemin="0"${addAttribute(mission.target, "aria-valuemax")}${addAttribute(mission.progress, "aria-valuenow")}><i${addAttribute(`width:${Math.round(mission.progress / mission.target * 100)}%`, "style")}></i></div> <span class="ms-count">${number.format(mission.progress)} / ${number.format(mission.target)}</span> </div> <div class="ms-reward"><i class="bd-coin"></i><b>+${mission.reward}</b></div> ${mission.claimed ? renderTemplate`<span class="ms-state">${dt("Claimed")}</span>` : renderTemplate`<button type="button" class="btn ms-one"${addAttribute(mission.id, "data-id")}${addAttribute(!mission.complete, "disabled")}>${mission.complete ? dt("Claim") : dt("In progress")}</button>`} </article>`)} </section>`)} </div> </div>`}` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashMissions.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Missions = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Missions;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const [list, state] = await Promise.all([callPettoCeramos(Astro2, session.userId, "missions"), callPettoCeramos(Astro2, session.userId, "state")]);
  return renderTemplate`${renderComponent($$result, "DashMissions", $$DashMissions, { "user": session, "data": list.ok ? list.data : null, "balance": state.ok ? state.data.balance : null })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/missions.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/missions.astro";
const $$url = "/dash/missions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Missions,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
