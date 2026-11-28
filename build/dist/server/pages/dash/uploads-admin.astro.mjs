import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopAdminShared } from '../../chunks/DashShopAdminShared_DyqGJdSO.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
import { $ as $$StaffProblem, s as staffProblem } from '../../chunks/staffProblem__taxH1e2.mjs';
/* empty css                                            */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { i as isPettoOwner, t as read } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashUploadsAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashUploadsAdmin;
  const { user, data, problem, contacts = {} } = Astro2.props;
  const mail = (id) => contacts[id] ?? null;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const reasons = [["sexual", dt("Sexual content")], ["minor", dt("Content with minors (blocks at once)")], ["violence", dt("Violent content")], ["hate", dt("Hate")], ["illegal", dt("Illegal content")], ["private", dt("Private data of someone")], ["copyright", dt("Copyright claim")], ["quality", dt("Quality of the picture")], ["other", dt("Other rule")]];
  const boot = JSON.stringify({ ui: { down: dt("Petto did not answer. Try again in a moment."), failed: dt("It could not be done. Try again in a moment.") } }).replace(/</g, "\\u003c");
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "staff-uploads", "pageTitle": "Own pictures" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopAdminShared", $$DashShopAdminShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Own pictures"), "eyebrow": dt("Staff"), "icon": "ph:image-square-fill", "back": false })} ${!data && renderTemplate`${renderComponent($$result2, "StaffProblem", $$StaffProblem, { "problem": problem })}`}${data && renderTemplate`${maybeRenderHead()}<div class="be" id="be"${addAttribute(boot, "data-boot")}> <p class="be-intro">${dt("Nobody sees a picture until you approve it. A picture with a minor is removed and blocks the person at once: you have to report it as the law asks.")}</p> <div class="be-list"> <h2 class="un-h">${dt("Waiting for review")}</h2> ${data.pending.length === 0 && renderTemplate`<p class="be-empty">${dt("Nothing is waiting.")}</p>`} ${data.pending.map((row) => renderTemplate`<article class="be-row un-row"${addAttribute(row.userId, "data-person")}> <img class="un-img"${addAttribute(`/dash/uploads-admin-act?file=${row.userId}`, "src")} alt="" width="320" height="100" loading="lazy"> <div class="be-info"><strong>${row.userId}</strong><span class="be-meta">${mail(row.userId) && renderTemplate`<a${addAttribute(`mailto:${mail(row.userId)}`, "href")}>${mail(row.userId)}</a>`}<span>${date.format(new Date(row.pendingAt))}</span><span>${row.screened ? dt("Checked by the detector") : dt("Not checked by the detector")}</span></span></div> <div class="un-controls"> <select class="un-reason"${addAttribute(dt("Reason"), "aria-label")}>${reasons.map(([id, label]) => renderTemplate`<option${addAttribute(id, "value")}>${label}</option>`)}</select> <label class="un-block"><input type="checkbox" class="un-blockbox"> ${dt("Block this person")}</label> <div class="be-actions"><button type="button" class="btn be-save" data-act="approve">${dt("Approve")}</button><button type="button" class="btn be-off" data-act="reject">${dt("Reject")}</button></div> </div> </article>`)} </div> <div class="be-list"> <h2 class="un-h">${dt("Own badges waiting for review")}</h2> ${(data.badges ?? []).length === 0 && renderTemplate`<p class="be-empty">${dt("Nothing is waiting.")}</p>`} ${(data.badges ?? []).map((row) => renderTemplate`<article class="be-row un-row un-badge"${addAttribute(row.userId, "data-person")}${addAttribute(row.slot, "data-slot")} data-kind="badge"> <img class="un-bimg"${addAttribute(`/dash/uploads-admin-act?badge=${row.userId}&slot=${row.slot}`, "src")} alt="" width="96" height="96" loading="lazy"> <div class="be-info"><strong>${row.name}</strong><span class="be-meta"><span>${row.userId}</span>${mail(row.userId) && renderTemplate`<a${addAttribute(`mailto:${mail(row.userId)}`, "href")}>${mail(row.userId)}</a>`}<span>${dt("Slot {n}", { n: String(row.slot) })}</span><span>${date.format(new Date(row.submittedAt))}</span><span>${row.screened ? dt("Checked by the detector") : dt("Not checked by the detector")}</span></span></div> <div class="un-controls"> <select class="un-reason"${addAttribute(dt("Reason"), "aria-label")}>${reasons.map(([id, label]) => renderTemplate`<option${addAttribute(id, "value")}>${label}</option>`)}</select> <label class="un-block"><input type="checkbox" class="un-blockbox"> ${dt("Block this person")}</label> <div class="be-actions"><button type="button" class="btn be-save" data-act="approve">${dt("Approve")}</button><button type="button" class="btn be-off" data-act="reject">${dt("Reject")}</button></div> </div> </article>`)} </div> <form class="be-form" id="un-takedown" autocomplete="off"> <h2>${dt("Take down a picture")}</h2> <div class="be-grid"> <label>${dt("Id of the person (Discord)")}<input name="person" required inputmode="numeric" pattern="[0-9]{15,25}"></label> <label>${dt("Reason")}<select name="reason">${reasons.map(([id, label]) => renderTemplate`<option${addAttribute(id, "value")}>${label}</option>`)}</select></label> <label class="un-block"><input type="checkbox" name="block"> ${dt("Block this person")}</label> </div> <p class="be-msg" id="be-msg" role="status" hidden></p> <div class="be-buttons"><button type="submit" class="btn be-off">${dt("Take down")}</button></div> </form> <div class="be-list"> <h2 class="un-h">${dt("Blocked people")}</h2> ${data.blocked.length === 0 && renderTemplate`<p class="be-empty">${dt("Nobody is blocked.")}</p>`} ${data.blocked.map((row) => renderTemplate`<article class="be-row"><div class="be-info"><strong>${row.userId}</strong><span class="be-meta">${mail(row.userId) && renderTemplate`<a${addAttribute(`mailto:${mail(row.userId)}`, "href")}>${mail(row.userId)}</a>`}<span>${row.reason || "\u2014"}</span><span>${date.format(new Date(row.createdAt))}</span></span></div><div class="be-actions"><button type="button" class="btn be-save"${addAttribute(row.userId, "data-unblock")}>${dt("Unblock")}</button></div></article>`)} </div> </div>`}` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashUploadsAdmin.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$UploadsAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$UploadsAdmin;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  if (!isPettoOwner(Astro2, session.userId)) return new Response("Not found", { status: 404 });
  const [queue, badgeQueue] = await Promise.all([callPettoCeramos(Astro2, session.userId, "admin/uploads"), callPettoCeramos(Astro2, session.userId, "admin/own-badges")]);
  const ids = [...new Set([...queue.ok ? queue.data.pending : [], ...queue.ok ? queue.data.blocked : [], ...badgeQueue.ok ? badgeQueue.data.pending : []].map((row) => row.userId).filter((id) => /^\d{15,25}$/.test(id)))];
  const contacts = {};
  if (ids.length) for (const row of await read(Astro2, "user_contact", `user_id=in.(${ids.join(",")})&select=user_id,email`)) contacts[row.user_id] = row.email;
  return renderTemplate`${renderComponent($$result, "DashUploadsAdmin", $$DashUploadsAdmin, { "user": session, "problem": staffProblem(queue) ?? void 0, "data": queue.ok ? { ...queue.data, badges: badgeQueue.ok ? badgeQueue.data.pending : [] } : null, "contacts": contacts })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/uploads-admin.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/uploads-admin.astro";
const $$url = "/dash/uploads-admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$UploadsAdmin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
