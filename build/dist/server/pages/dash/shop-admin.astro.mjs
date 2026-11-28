import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, u as unescapeHTML, F as Fragment } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopTabs } from '../../chunks/DashShopTabs_CnHqwLIx.mjs';
import { $ as $$DashShopAdminShared } from '../../chunks/DashShopAdminShared_DyqGJdSO.mjs';
import { $ as $$ColorPicker } from '../../chunks/ColorPicker_DwzcbTkv.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
import { $ as $$StaffProblem, s as staffProblem } from '../../chunks/staffProblem__taxH1e2.mjs';
/* empty css                                         */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { i as isPettoOwner } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashShopAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashShopAdmin;
  const { user, data, tab, problem } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const date = new Intl.DateTimeFormat(lang, { day: "numeric", month: "short", year: "numeric" });
  const regions = (() => {
    try {
      return new Intl.DisplayNames([lang], { type: "region" });
    } catch {
      return null;
    }
  })();
  const languages = (() => {
    try {
      return new Intl.DisplayNames([lang], { type: "language" });
    } catch {
      return null;
    }
  })();
  const nameOf = (badge) => (badge.names ? badge.names[lang] ?? badge.names.en : null) ?? (badge.region ? regions?.of(badge.region) : badge.language ? languages?.of(badge.language) : null) ?? FIXED[badge.id] ?? badge.id;
  const FIXED = { furro: dt("Furry"), boykisser: dt("Boykisser"), hetero: dt("Straight"), femboy: dt("Femboy") };
  const packName = (pack) => pack.names[lang] ?? pack.names.en;
  const statusLabel = { live: dt("On sale"), scheduled: dt("Planned"), ended: dt("Sale ended"), retired: dt("Off sale") };
  const kindLabel = { badge: dt("Badges"), banner: dt("Banners"), font: dt("Name fonts") };
  const rarityLabel = { common: dt("Common"), rare: dt("Rare"), epic: dt("Epic"), legendary: dt("Legendary") };
  const artOf = (badge) => badge.hasImage ? `/dash/badge-art/${badge.id}` : badge.region ? `/assets/country-flags/${badge.region.toLowerCase()}.svg` : badge.flag ? `/assets/country-flags/${badge.flag.toLowerCase()}.svg` : ["furro", "boykisser", "hetero", "femboy"].includes(badge.id) ? `/assets/badges/${badge.id}.png` : null;
  const items = (kind) => (data?.items ?? []).filter((item) => item.kind === kind);
  const packsOf = (kind) => (data?.packs ?? []).filter((pack) => pack.kind === kind);
  const countIn = (packId) => (data?.items ?? []).filter((item) => item.packId === packId).length + (data?.builtIn ?? []).filter((badge) => badge.pack === packId).length + (data?.badges ?? []).filter((badge) => badge.packId === packId).length;
  const ui = {
    saved: dt("Saved."),
    saving: dt("Saving\u2026"),
    down: dt("Petto did not answer. Try again in a moment."),
    newPack: dt("New pack"),
    newBanner: dt("New banner"),
    newFont: dt("New name font"),
    reset: dt("Back to the code?"),
    errors: {
      bad_id: dt("The id is 3 to 40 letters, numbers or dashes."),
      bad_kind: dt("Choose what it is."),
      bad_name: dt("The English name is needed (40 characters at most)."),
      bad_price: dt("The price is a whole number from 0 up."),
      free_and_price: dt("A free pack has no price."),
      bad_date: dt("One of the dates is not a date."),
      bad_dates: dt("The sale has to end after it starts."),
      bad_plan: dt("That plan does not exist."),
      bad_pack: dt("That pack does not exist or is not of this kind."),
      bad_rarity: dt("That rarity does not exist."),
      bad_color: dt("The colour has to look like #aabbcc."),
      kind_locked: dt("That id is used by a pack of another kind."),
      file_too_big: dt("The file is over 768 KB."),
      file_required: dt("Choose a file."),
      bad_file: dt("That file is not one of the kinds that are accepted."),
      not_found: dt("That does not exist yet: save it first."),
      forbidden: dt("Only the owner can do this."),
      failed: dt("That did not work. Try again in a moment."),
      file_too_small: dt("The picture is too small: it needs to be at least 800 x 200."),
      image_too_big: dt("The picture is over 256 KB."),
      bad_image: dt("The picture has to be a PNG, JPEG, GIF or WebP."),
      down: dt("Petto did not answer. Try again in a moment.")
    },
    noFile: dt("Saved, but it has no file yet: it is not in the shop until it has one.")
  };
  const boot = JSON.stringify({ ui, tab, packs: data?.packs ?? [], items: data?.items ?? [], builtIn: (data?.builtIn ?? []).map((badge) => ({ ...badge, label: nameOf(badge) })) }).replace(/</g, "\\u003c");
  const fontCss = items("font").filter((item) => item.hasFile).map((item) => `@font-face{font-family:"shop-${item.id}";src:url(/dash/item-file/font/${item.id}?v=${encodeURIComponent(item.updatedAt)});font-display:swap}`).join("");
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "staff-badges", "pageTitle": "Shop editor" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Editor of the shop"), "eyebrow": dt("Staff"), "icon": "ph:medal-fill", "back": false })} ${renderComponent($$result2, "DashShopAdminShared", $$DashShopAdminShared, {})} ${renderComponent($$result2, "DashShopTabs", $$DashShopTabs, { "active": tab === "builtin" ? "builtin" : tab === "packs" ? "packs" : tab === "banners" ? "banners" : "fonts" })} ${!data && renderTemplate`${renderComponent($$result2, "StaffProblem", $$StaffProblem, { "problem": problem })}`}${data && renderTemplate`${maybeRenderHead()}<div class="be" id="be"${addAttribute(boot, "data-boot")}> ${fontCss && renderTemplate`<style>${unescapeHTML(fontCss)}</style>`} ${tab === "builtin" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <p class="be-intro">${dt("The badges that come with the bot: change their words, colour, rarity, price, picture or pack. What you leave empty stays as the code has it, and the stars of the plans never change.")}</p> <input class="be-search" id="be-search" type="search"${addAttribute(dt("Search badges"), "placeholder")}${addAttribute(dt("Search badges"), "aria-label")}> <div class="be-list be-compact" id="be-list"> ${data.builtIn.map((badge) => {
    const art = artOf(badge);
    return renderTemplate`<article class="be-row"${addAttribute(badge.id, "data-id")}${addAttribute(`${nameOf(badge)} ${badge.id}`.toLowerCase(), "data-name")}> <span class="be-hex"${addAttribute(`--c:${badge.color}`, "style")}>${art ? renderTemplate`<img${addAttribute(art, "src")} alt="" width="40" height="40" loading="lazy" decoding="async">` : renderTemplate`<b>${(badge.language ?? "").toUpperCase()}</b>`}</span> <div class="be-info"> <strong>${nameOf(badge)}</strong> <span class="be-meta"> ${badge.changed && renderTemplate`<i class="be-chip be-scheduled">${dt("Changed")}</i>`} ${badge.retired && renderTemplate`<i class="be-chip be-retired">${dt("Off sale")}</i>`} ${badge.unlock === "shop" ? renderTemplate`<span>${badge.price === 0 ? dt("Free") : `${badge.price} ${dt("ceramos")}`}</span>` : renderTemplate`<span>${dt("Free to turn on")}</span>`} ${badge.pack && renderTemplate`<span>${dt("Pack")}: ${badge.pack}</span>`} ${badge.owners > 0 && renderTemplate`<span>${dt("{n} people have it", { n: badge.owners })}</span>`} </span> </div> <button type="button" class="btn"${addAttribute(badge.id, "data-edit")}>${dt("Edit")}</button> </article>`;
  })} </div> <form class="be-form" id="be-form" data-form="builtin" autocomplete="off" hidden> <h2 id="be-title">${dt("Change a badge")}</h2> <div class="be-grid"> <label>${dt("Id")}<input name="id" readonly></label> <label>${dt("Name in English")}<input name="name_en" maxlength="40"></label> <label>${dt("Name in Spanish")}<input name="name_es" maxlength="40"></label> <label>${dt("Name in Portuguese")}<input name="name_pt" maxlength="40"></label> <label>${dt("Rarity")}<select name="rarity"><option value="">${dt("As the code has it")}</option><option value="common">${dt("Common")}</option><option value="rare">${dt("Rare")}</option><option value="epic">${dt("Epic")}</option><option value="legendary">${dt("Legendary")}</option></select></label> <label>${dt("Price in ceramos (empty: as the code has it)")}<input name="price" type="number" min="0" max="100000" step="1"></label> <div class="be-pickfield"><span>${dt("Colour behind the picture")}</span><span class="be-colorrow">${renderComponent($$result3, "ColorPicker", $$ColorPicker, { "name": "color", "value": "#8f7bd6", "label": "" })}<button type="button" class="btn" id="be-nocolor">${dt("As the code has it")}</button></span></div> <label>${dt("Pack")}<select name="packId"><option value="">${dt("As the code has it")}</option>${packsOf("badge").map((pack) => renderTemplate`<option${addAttribute(pack.id, "value")}>${packName(pack)}</option>`)}</select></label> <label class="be-check"><input name="active" type="checkbox" checked> ${dt("On sale")}</label> <label class="be-file">${dt("Picture (PNG, JPEG, GIF or WebP, 256 KB at most)")}<input name="file" type="file" accept="image/png,image/jpeg,image/gif,image/webp"></label> </div> <p class="be-msg" id="be-msg" role="status" hidden></p> <div class="be-buttons"><button type="button" class="btn be-off" id="be-back">${dt("Back to the code")}</button><button type="button" class="btn" id="be-close">${dt("Close")}</button><button type="submit" class="btn be-save" id="be-save">${dt("Save changes")}</button></div> </form> ` })}`} ${tab === "packs" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <p class="be-intro">${dt("A pack groups badges, banners or name fonts under a name. It can be free, for a plan, for some days only, or sold whole for one price (never dearer than the pieces). Its days and its plan count for every piece inside.")}</p> <div class="be-list" id="be-list"> ${data.packs.length === 0 && renderTemplate`<p class="be-empty">${dt("No pack yet.")}</p>`} ${data.packs.map((pack) => renderTemplate`<article class="be-row"${addAttribute(pack.id, "data-id")}> <span class="be-hex"${addAttribute(`--c:${pack.color}`, "style")}><b>${kindLabel[pack.kind].slice(0, 1)}</b></span> <div class="be-info"> <strong>${packName(pack)}</strong> <span class="be-meta"> <i${addAttribute(`be-chip be-${pack.status === "live" ? "live" : pack.status}`, "class")}>${statusLabel[pack.status]}</i> <span>${kindLabel[pack.kind]}</span> <span>${pack.free ? dt("Free") : pack.price === null ? dt("Price of the pieces") : `${pack.price} ${dt("ceramos")}`}</span> <span>${dt("{n} pieces", { n: countIn(pack.id) })}</span> ${pack.planMin && renderTemplate`<span>${dt("Needs a plan")}</span>`} ${pack.saleFrom && renderTemplate`<span>${dt("From {date}", { date: date.format(new Date(pack.saleFrom)) })}</span>`} ${pack.saleUntil && renderTemplate`<span>${dt("Until {date}", { date: date.format(new Date(pack.saleUntil)) })}</span>`} </span> </div> <div class="be-actions"> <button type="button" class="btn"${addAttribute(pack.id, "data-edit")}>${dt("Edit")}</button> ${pack.active ? renderTemplate`<button type="button" class="btn be-off"${addAttribute(pack.id, "data-active")} data-value="false">${dt("Take off sale")}</button>` : renderTemplate`<button type="button" class="btn be-on"${addAttribute(pack.id, "data-active")} data-value="true">${dt("Put back on sale")}</button>`} </div> </article>`)} </div> <form class="be-form" id="be-form" data-form="pack" autocomplete="off"> <h2 id="be-title">${ui.newPack}</h2> <div class="be-grid"> <label>${dt("Id (letters, numbers, dashes)")}<input name="id" required minlength="3" maxlength="40" pattern="[a-z0-9][a-z0-9\-]{2,39}" placeholder="winter-pack"></label> <label>${dt("What it holds")}<select name="kind"><option value="badge">${dt("Badges")}</option><option value="banner">${dt("Banners")}</option><option value="font">${dt("Name fonts")}</option></select></label> <label>${dt("Name in English")}<input name="name_en" required maxlength="40"></label> <label>${dt("Name in Spanish")}<input name="name_es" maxlength="40"></label> <label>${dt("Name in Portuguese")}<input name="name_pt" maxlength="40"></label> <div class="be-pickfield"><span>${dt("Colour of the pack")}</span>${renderComponent($$result3, "ColorPicker", $$ColorPicker, { "name": "color", "value": "#8f7bd6", "label": "" })}</div> <label>${dt("Price of the whole pack (empty: the sum of the pieces)")}<input name="price" type="number" min="0" max="1000000" step="1"></label> <label class="be-check"><input name="free" type="checkbox"> ${dt("Free: every piece costs nothing")}</label> <label>${dt("On sale from")}<input name="saleFrom" type="datetime-local"></label> <label>${dt("On sale until")}<input name="saleUntil" type="datetime-local"></label> <label>${dt("Only for this plan or a better one")}<select name="planMin"><option value="">${dt("Everybody")}</option><option value="bronze">${dt("Bronze")}</option><option value="silver">${dt("Silver")}</option><option value="gold">${dt("Gold")}</option></select></label> </div> <p class="be-msg" id="be-msg" role="status" hidden></p> <div class="be-buttons"><button type="button" class="btn" id="be-reset">${dt("Clear the form")}</button><button type="submit" class="btn be-save" id="be-save">${dt("Save pack")}</button></div> </form> ` })}`} ${(tab === "banners" || tab === "fonts") && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <p class="be-intro">${tab === "banners" ? dt("Banners are the picture behind the profile picture and the rank card. Every banner is cut to 1024 x 320 (the middle of the picture, never stretched). A person buys one with ceramos, keeps it for good and puts it on with /profile banner or from Customize profile.") : dt("Name fonts change how the name is drawn on the profile picture. The shop starts with the fonts of Vetox; add your own (TTF, OTF or WOFF2).")}</p> <div class="be-list" id="be-list"> ${items(tab === "banners" ? "banner" : "font").length === 0 && renderTemplate`<p class="be-empty">${dt("Nothing yet.")}</p>`} ${items(tab === "banners" ? "banner" : "font").map((item) => renderTemplate`<article class="be-row"${addAttribute(item.id, "data-id")}> ${item.kind === "banner" ? renderTemplate`<span class="be-banner">${item.hasFile ? renderTemplate`<img${addAttribute(`/dash/item-file/banner/${item.id}?v=${encodeURIComponent(item.updatedAt)}`, "src")} alt="" width="120" height="50" loading="lazy" decoding="async">` : renderTemplate`<b>?</b>`}</span>` : renderTemplate`<span class="be-sample"${addAttribute(item.hasFile ? `font-family:'shop-${item.id}',sans-serif` : "", "style")}>${item.hasFile ? "liam" : "?"}</span>`} <div class="be-info"> <strong>${item.names[lang] ?? item.names.en}</strong> <span class="be-meta"> <i${addAttribute(`be-chip be-${item.status}`, "class")}>${statusLabel[item.status]}</i> <span>${item.price === null ? rarityLabel[item.rarity] : item.price === 0 ? dt("Free") : `${item.price} ${dt("ceramos")}`}</span> <span>${dt("{n} people have it", { n: item.owners })}</span> ${item.packId && renderTemplate`<span>${dt("Pack")}: ${item.packId}</span>`} ${!item.hasFile && renderTemplate`<span class="be-warn">${dt("No file")}</span>`} </span> </div> <div class="be-actions"> <button type="button" class="btn"${addAttribute(item.id, "data-edit")}>${dt("Edit")}</button> ${item.active ? renderTemplate`<button type="button" class="btn be-off"${addAttribute(item.id, "data-active")} data-value="false">${dt("Take off sale")}</button>` : renderTemplate`<button type="button" class="btn be-on"${addAttribute(item.id, "data-active")} data-value="true">${dt("Put back on sale")}</button>`} </div> </article>`)} </div> <form class="be-form" id="be-form" data-form="item"${addAttribute(tab === "banners" ? "banner" : "font", "data-kind")} autocomplete="off"> <h2 id="be-title">${tab === "banners" ? ui.newBanner : ui.newFont}</h2> <div class="be-grid"> <label>${dt("Id (letters, numbers, dashes)")}<input name="id" required minlength="3" maxlength="40" pattern="[a-z0-9][a-z0-9\-]{2,39}"></label> <label>${dt("Name in English")}<input name="name_en" required maxlength="40"></label> <label>${dt("Name in Spanish")}<input name="name_es" maxlength="40"></label> <label>${dt("Name in Portuguese")}<input name="name_pt" maxlength="40"></label> <label>${dt("Rarity")}<select name="rarity"><option value="common">${dt("Common")}</option><option value="rare">${dt("Rare")}</option><option value="epic">${dt("Epic")}</option><option value="legendary">${dt("Legendary")}</option></select></label> <label>${dt("Price in ceramos (empty: the one of its rarity)")}<input name="price" type="number" min="0" max="100000" step="1"></label> <label>${dt("Pack")}<select name="packId"><option value="">${dt("No pack")}</option>${packsOf(tab === "banners" ? "banner" : "font").map((pack) => renderTemplate`<option${addAttribute(pack.id, "value")}>${packName(pack)}</option>`)}</select></label> <label>${dt("On sale from")}<input name="saleFrom" type="datetime-local"></label> <label>${dt("On sale until")}<input name="saleUntil" type="datetime-local"></label> <label>${dt("Only for this plan or a better one")}<select name="planMin"><option value="">${dt("Everybody")}</option><option value="bronze">${dt("Bronze")}</option><option value="silver">${dt("Silver")}</option><option value="gold">${dt("Gold")}</option></select></label> <label class="be-file">${tab === "banners" ? dt("Banner (PNG, JPEG or WebP, 768 KB at most; it is cut to 1024 x 320, so use a picture that wide)") : dt("Font file (TTF, OTF or WOFF2, 768 KB at most)")}<input name="file" type="file"${addAttribute(tab === "banners" ? "image/png,image/jpeg,image/webp" : ".ttf,.otf,.woff2,font/ttf,font/otf,font/woff2", "accept")}></label> </div> <p class="be-msg" id="be-msg" role="status" hidden></p> <div class="be-buttons"><button type="button" class="btn" id="be-reset">${dt("Clear the form")}</button><button type="submit" class="btn be-save" id="be-save">${tab === "banners" ? dt("Save banner") : dt("Save font")}</button></div> </form> ` })}`} </div>`}` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashShopAdmin.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$ShopAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ShopAdmin;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  if (!isPettoOwner(Astro2, session.userId)) return new Response("Not found", { status: 404 });
  const asked = Astro2.url.searchParams.get("tab");
  const tab = asked === "packs" || asked === "banners" || asked === "fonts" ? asked : "builtin";
  const shop = await callPettoCeramos(Astro2, session.userId, "admin/shop");
  return renderTemplate`${renderComponent($$result, "DashShopAdmin", $$DashShopAdmin, { "user": session, "problem": staffProblem(shop) ?? void 0, "data": shop.ok ? { packs: shop.data.packs, items: shop.data.items, builtIn: shop.data.builtIn, badges: shop.data.badges ?? [] } : null, "tab": tab })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/shop-admin.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/shop-admin.astro";
const $$url = "/dash/shop-admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ShopAdmin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
