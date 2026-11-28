import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, u as unescapeHTML } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { s as sessionAvatar } from './avatarUrl_DW4zxFoS.mjs';
import { $ as $$DashMeLayout } from './DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from './DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashCeramosNote } from './DashCeramosNote_CKmCua4C.mjs';
import { $ as $$DashShopShared } from './DashShopShared_BdnfBusr.mjs';
import { $ as $$CeramosBalance } from './CeramosBalance_BknhqXYc.mjs';
import { g as getDashLang, m as makeT } from './dash_CORIPvM-.mjs';
import { b as userHeaderArt } from './dashAuth_uqFK7-ED.mjs';
/* empty css                           */

const $$Astro = createAstro("https://petto.sbs");
const $$DashShopItems = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashShopItems;
  const { user, kind, catalog, state } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const ready = Boolean(catalog && state);
  const nameOf = (names) => names[lang] ?? names[lang.split("-")[0]] ?? names.en;
  const title = kind === "font" ? dt("Customize name") : dt("Customize profile");
  const items = (catalog?.items ?? []).filter((item) => item.kind === kind && item.hasFile);
  const packs = (catalog?.packs ?? []).filter((pack) => pack.kind === kind && pack.pieces.length > 0);
  const headerArt = userHeaderArt(user);
  const discordBanner = headerArt.kind === "image" ? headerArt.still : null;
  const avatar = sessionAvatar(user, 128);
  const fontCss = kind === "font" ? items.map((item) => `@font-face{font-family:"shop-${item.id}";src:url(/dash/item-file/font/${item.id}?v=${encodeURIComponent(item.version)});font-display:swap}`).join("") : "";
  const ui = {
    buy: dt("Buy for {price}"),
    poor: dt("Not enough ceramos"),
    free: dt("Free"),
    owned: dt("Yours"),
    inUse: dt("In use"),
    putOn: dt("Put it on"),
    takeOff: dt("Take it off"),
    close: dt("Close"),
    buyPack: dt("Buy the whole pack for {price}"),
    takePack: dt("Take the whole pack (free)"),
    oneByOne: dt("Or buy one by one:"),
    packLeft: dt("{n} pieces you do not have"),
    packAll: dt("You have every piece"),
    packPieces: dt("{n} pieces"),
    untilT: dt("Until {date}"),
    planNeeded: dt("Needs the {plan} plan or a better one"),
    closed: dt("Not on sale now"),
    down: dt("Petto did not answer. Try again in a moment."),
    failed: dt("That did not work. Try again in a moment."),
    results: { closed: dt("That is not on sale now."), plan: dt("That is for people with a better plan."), poor: dt("You do not have enough ceramos."), owned: dt("You already have that."), unknown: dt("That is not for sale."), nothing: dt("You already have every piece."), notOwned: dt("You do not have that yet.") },
    plans: { bronze: dt("Bronze"), silver: dt("Silver"), gold: dt("Gold") },
    rarity: { common: dt("Common"), rare: dt("Rare"), epic: dt("Epic"), legendary: dt("Legendary") },
    noMatch: dt("Nothing matches."),
    empty: dt("Nothing in this part of the shop yet.")
  };
  const boot = ready ? JSON.stringify({ lang, kind, catalog: { items, packs }, state, ui, names: Object.fromEntries([...items, ...packs].map((entry) => [entry.id, nameOf(entry.names)])), me: user.username, discordBanner }).replace(/</g, "\\u003c") : "";
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": kind === "font" ? "name" : "banners", "pageTitle": kind === "font" ? "Customize name" : "Customize profile" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopShared", $$DashShopShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": title, "eyebrow": dt("Profile"), "icon": kind === "font" ? "ph:text-aa-fill" : "ph:image-fill", "back": false }, { "default": async ($$result3) => renderTemplate`${ready && state && renderTemplate`${maybeRenderHead()}<div class="bd-wallet">${renderComponent($$result3, "CeramosBalance", $$CeramosBalance, { "balance": state.balance, "id": "si-balance" })}<a class="btn" href="/dash/buy-ceramos">${dt("Get ceramos")}</a></div>`}` })} ${renderComponent($$result2, "DashCeramosNote", $$DashCeramosNote, {})} ${!ready && renderTemplate`<p class="bd-down" role="alert">${ui.down}</p>`}${ready && catalog && state && renderTemplate`<div class="si" id="si"${addAttribute(boot, "data-boot")}> ${fontCss && renderTemplate`<style>${unescapeHTML(fontCss)}</style>`} <div class="si-left"> <aside class="bd-card si-preview"> <div class="bd-card-head"><h2>${dt("Preview")}</h2></div> <div class="si-card" id="si-card"> <div class="si-banner" id="si-banner"></div> <div class="si-shade"></div> <div class="si-top"> ${avatar ? renderTemplate`<img class="si-av"${addAttribute(avatar, "src")} alt="" width="150" height="150">` : renderTemplate`<span class="si-av si-ph"></span>`} <div class="si-id"> <b class="si-name" id="si-name">${user.username}</b> <div class="si-stats"> <span><small>${dt("Level")}</small><b>24</b></span><span><small>${dt("Rank")}</small><b>#3</b></span><span><small>${dt("Messages")}</small><b>4,812</b></span><span><small>${dt("Voice")}</small><b>12 h</b></span> </div> </div> </div> <div class="si-panel"> <small>${dt("Badges")}</small> <div class="si-hexes"><i></i><i></i><i></i><i></i><i></i><i></i></div> </div> </div> <p class="bd-hint" id="si-current"></p> </aside> ${packs.length > 0 && renderTemplate`<div class="bd-card si-packs" id="si-packs" role="region"${addAttribute(dt("Packs"), "aria-label")}> <div class="bd-card-head"><h2>${dt("Packs")}</h2></div> <div class="si-packlist" id="si-packlist"></div> </div>`} </div> <div class="si-main"> <div class="bd-find"> <label class="bd-search"><input type="search" id="si-q"${addAttribute(dt("Search"), "placeholder")} autocomplete="off"></label> <div class="bd-filter" role="group"><button type="button" class="active" data-filter="all">${dt("All")}</button><button type="button" data-filter="owned">${dt("Owned")}</button></div> </div> <div class="si-grid" id="si-grid"></div> <p class="bd-empty" id="si-empty" hidden></p> </div> <dialog class="bd-dialog" id="si-dialog"> <div class="bd-dialog-body"> <div class="si-d-preview" id="si-d-preview"></div> <h3 id="si-d-name"></h3> <p id="si-d-meta"></p> <p class="bd-d-error" id="si-d-error" role="alert" hidden></p> <div class="bd-d-actions" id="si-d-actions"></div> <button type="button" class="btn bd-d-close" id="si-d-close">${ui.close}</button> </div> </dialog> </div>`}` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashShopItems.astro", void 0);

export { $$DashShopItems as $ };
