import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopTabs } from '../../chunks/DashShopTabs_CnHqwLIx.mjs';
import { $ as $$DashShopAdminShared } from '../../chunks/DashShopAdminShared_DyqGJdSO.mjs';
import { $ as $$ColorPicker } from '../../chunks/ColorPicker_DwzcbTkv.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
import { $ as $$StaffProblem, s as staffProblem } from '../../chunks/staffProblem__taxH1e2.mjs';
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { i as isPettoOwner } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashBadgesAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashBadgesAdmin;
  const { user, badges, problem, packs = [] } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "short", year: "numeric" });
  const statusLabel = { live: dt("On sale"), scheduled: dt("Planned"), ended: dt("Sale ended"), retired: dt("Off sale"), rule: dt("Automatic") };
  const ui = {
    saved: dt("Saved."),
    saving: dt("Saving\u2026"),
    down: dt("Petto did not answer. Try again in a moment."),
    errors: {
      bad_id: dt("The id is 3 to 40 letters, numbers or dashes, and it cannot start like a country or a language."),
      bad_name: dt("The English name is needed (40 characters at most)."),
      bad_price: dt("The price is a whole number from 0 to 100000."),
      bad_date: dt("One of the dates is not a date."),
      bad_dates: dt("The sale has to end after it starts."),
      bad_pack: dt("That pack does not exist."),
      bad_plan: dt("That plan does not exist."),
      bad_rule: dt("That rule does not exist."),
      rule_and_price: dt("A badge that is given by itself has no price."),
      image_too_big: dt("The picture is over 256 KB."),
      bad_image: dt("The picture has to be a PNG, JPEG, GIF or WebP."),
      image_required: dt("Choose a picture."),
      forbidden: dt("Only the owner can do this."),
      failed: dt("That did not work. Try again in a moment.")
    },
    noImage: dt("The badge was saved, but it has no picture yet."),
    idTaken: dt("There is already a badge with that id. Use a different id (for example, among-us-orange) or click Edit on the existing badge.")
  };
  const boot = JSON.stringify({ ui, badges: badges ?? [] }).replace(/</g, "\\u003c");
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "staff-badges", "pageTitle": "Shop editor" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Editor of the shop"), "eyebrow": dt("Staff"), "icon": "ph:medal-fill", "back": false })} ${renderComponent($$result2, "DashShopAdminShared", $$DashShopAdminShared, {})} ${renderComponent($$result2, "DashShopTabs", $$DashShopTabs, { "active": "badges" })} ${!badges && renderTemplate`${renderComponent($$result2, "StaffProblem", $$StaffProblem, { "problem": problem })}`}${badges && renderTemplate`${maybeRenderHead()}<div class="be" id="be"${addAttribute(boot, "data-boot")}> <p class="be-intro">${dt("Make badges for the shop: free or paid, for a plan, given by themselves, or for a season. When a sale ends, the people who have the badge keep it for good; the rest can never get it again.")}</p> <div class="be-list" id="be-list"> ${badges.length === 0 && renderTemplate`<p class="be-empty">${dt("No badge made yet. Make the first one below.")}</p>`} ${badges.map((row) => renderTemplate`<article class="be-row"${addAttribute(row.id, "data-id")}> <span${addAttribute(["be-hex", { "be-nobg": row.color === "none" || row.color === "transparent" }], "class:list")}${addAttribute(`--c:${row.color === "none" || row.color === "transparent" ? "transparent" : row.color}`, "style")}>${row.hasImage ? renderTemplate`<img${addAttribute(`/dash/badge-art/${row.id}?v=${encodeURIComponent(row.updatedAt)}`, "src")} alt="" width="52" height="52">` : renderTemplate`<b>?</b>`}</span> <div class="be-info"> <strong>${row.names.en}</strong> <span class="be-meta"> <i${addAttribute(`be-chip be-${row.status}`, "class")}>${statusLabel[row.status]}</i> <span>${row.grantRule ? dt("Given by itself") : row.price === 0 ? dt("Free") : `${row.price} ${dt("ceramos")}`}</span> ${row.packId && renderTemplate`<span>${dt("Pack")}: ${packs.find((p) => p.id === row.packId)?.names[lang] ?? packs.find((p) => p.id === row.packId)?.names.en ?? row.packId}</span>`} <span>${dt("{n} people have it", { n: row.owners })}</span> ${row.saleFrom && renderTemplate`<span>${dt("From {date}", { date: date.format(new Date(row.saleFrom)) })}</span>`} ${row.saleUntil && renderTemplate`<span>${dt("Until {date}", { date: date.format(new Date(row.saleUntil)) })}</span>`} ${!row.hasImage && renderTemplate`<span class="be-warn">${dt("No picture")}</span>`} </span> </div> <div class="be-actions"> <button type="button" class="btn"${addAttribute(row.id, "data-edit")}>${dt("Edit")}</button> ${row.active ? renderTemplate`<button type="button" class="btn be-off"${addAttribute(row.id, "data-active")} data-value="false">${dt("Take off sale")}</button>` : renderTemplate`<button type="button" class="btn be-on"${addAttribute(row.id, "data-active")} data-value="true">${dt("Put back on sale")}</button>`} </div> </article>`)} </div> <form class="be-form" id="be-form" autocomplete="off"> <h2 id="be-title">${dt("New badge")}</h2> <div class="be-grid"> <label>${dt("Id (letters, numbers, dashes)")}<input name="id" required minlength="3" maxlength="40" pattern="[a-z0-9][a-z0-9\-]{2,39}" placeholder="christmas-2026"></label> <label>${dt("Name in English")}<input name="name_en" required maxlength="40"></label> <label>${dt("Name in Spanish")}<input name="name_es" maxlength="40"></label> <label>${dt("Name in Portuguese")}<input name="name_pt" maxlength="40"></label> <label id="be-cat-wrap">${dt("Tab")} <select name="category"><option value="special">${dt("Special")}</option><option value="status">${dt("Status")}</option><option value="fablo">${dt("Fablo pack")}</option><option value="country">${dt("Countries")}</option><option value="language">${dt("Languages")}</option></select> </label> <label>${dt("Rarity")} <select name="rarity"><option value="common">${dt("Common")}</option><option value="rare">${dt("Rare")}</option><option value="epic">${dt("Epic")}</option><option value="legendary">${dt("Legendary")}</option></select> </label> <label>${dt("Price in ceramos (0 is free)")}<input name="price" type="number" min="0" max="100000" step="1" value="20"></label> <div class="be-pickfield" id="be-color-wrap"><span>${dt("Colour behind the picture")}</span>${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "color", "value": "#8f7bd6", "label": "" })}</div> <label class="be-check"><input type="checkbox" name="noBg"> ${dt("No background colour (transparent)")}</label> <label>${dt("Pack")}<select name="packId"><option value="">${dt("No pack")}</option>${packs.map((pack) => renderTemplate`<option${addAttribute(pack.id, "value")}>${pack.names[lang] ?? pack.names.en}</option>`)}</select></label> <label>${dt("On sale from")}<input name="saleFrom" type="datetime-local"></label> <label>${dt("On sale until")}<input name="saleUntil" type="datetime-local"></label> <label>${dt("Only for this plan or a better one")} <select name="planMin"><option value="">${dt("Everybody")}</option><option value="bronze">${dt("Bronze")}</option><option value="silver">${dt("Silver")}</option><option value="gold">${dt("Gold")}</option></select> </label> <label>${dt("Given by itself when the person is\u2026")} <select name="grantRule"><option value="">${dt("Nothing: it is bought")}</option><option value="voter">${dt("A voter (voted in the last 30 days)")}</option><option value="booster">${dt("A booster of the support server")}</option><option value="partner" disabled>${dt("A partner (not connected yet)")}</option><option value="server_boost" disabled>${dt("A server booster (not connected yet)")}</option></select> </label> <label class="be-file">${dt("Picture (PNG, JPEG, GIF or WebP, 256 KB at most)")}<input name="image" type="file" accept="image/png,image/jpeg,image/gif,image/webp"></label> </div> <p class="be-msg" id="be-msg" role="status" hidden></p> <div class="be-buttons"> <button type="button" class="btn" id="be-reset">${dt("Clear the form")}</button> <button type="submit" class="btn be-save" id="be-save">${dt("Save badge")}</button> </div> </form> </div>`}` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashBadgesAdmin.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$BadgesAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BadgesAdmin;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  if (!isPettoOwner(Astro2, session.userId)) return new Response("Not found", { status: 404 });
  const shop = await callPettoCeramos(Astro2, session.userId, "admin/shop");
  return renderTemplate`${renderComponent($$result, "DashBadgesAdmin", $$DashBadgesAdmin, { "user": session, "problem": staffProblem(shop) ?? void 0, "badges": shop.ok ? shop.data.badges : null, "packs": shop.ok ? shop.data.packs.filter((pack) => pack.kind === "badge") : [] })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/badges-admin.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/badges-admin.astro";
const $$url = "/dash/badges-admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BadgesAdmin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
