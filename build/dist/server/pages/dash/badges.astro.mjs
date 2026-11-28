import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, u as unescapeHTML } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { s as sessionAvatar } from '../../chunks/avatarUrl_DW4zxFoS.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashCeramosNote } from '../../chunks/DashCeramosNote_CKmCua4C.mjs';
import { $ as $$DashShopShared } from '../../chunks/DashShopShared_BdnfBusr.mjs';
import { $ as $$CeramosBalance } from '../../chunks/CeramosBalance_BknhqXYc.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                     */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const TABS = ["country", "language", "fablo", "special", "status"];
const ART = { "bufi-normal": "bufi-normal.png", "bufi-silver": "bufi-silver.png", "bufi-girl": "bufi-girl.png", "bufi-boy": "bufi-boy.png", "bufi-bu": "bufi-bu.png", "bufi-black-friday": "bufi-black-friday.png", "plan-bronze": "plan-bronze.png", "plan-silver": "plan-silver.png", "plan-gold": "plan-gold.png", furro: "furro.png", boykisser: "boykisser.png", hetero: "hetero.png", femboy: "femboy.png" };
const esc = (value) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
function artUrl(badge) {
  if (badge.custom || badge.dbArt) return badge.hasArt && /^[a-z0-9-]{1,40}$/.test(badge.id) ? `/dash/badge-art/${badge.id}?v=${encodeURIComponent(badge.version ?? "")}` : null;
  if (badge.region && /^[A-Z]{2}$/.test(badge.region)) return `/assets/country-flags/${badge.region.toLowerCase()}.svg`;
  if (badge.flag && /^[A-Z]{2}$/.test(badge.flag)) return `/assets/country-flags/${badge.flag.toLowerCase()}.svg`;
  return ART[badge.id] ? `/assets/badges/${ART[badge.id]}` : null;
}
const codeOf = (badge) => (badge.region ?? badge.language ?? "").toUpperCase();
function hexHtml(badge, frame = "normal", size = "md") {
  const url = artUrl(badge);
  const inner = url ? `<img src="${esc(url)}" alt="" loading="lazy" decoding="async" width="64" height="64">` : `<b>${esc(codeOf(badge))}</b>`;
  const bare = badge.category === "plan" || badge.unlock === "plan" ? " bd-bare" : "";
  const noBg = badge.color === "none" || badge.color === "transparent";
  const style = noBg ? "--c:transparent" : `--c:${esc(badge.color)}`;
  return `<span class="bd-hex${bare}${noBg ? " bd-nobg" : ""} bd-${size} bd-f-${esc(frame)}" style="${style}"><span class="bd-hex-in">${inner}</span></span>`;
}
function badgePacksOf(catalog, state) {
  const have = new Set(state.owned.map((row) => row.id));
  return (catalog.packs ?? []).filter((pack) => {
    if (pack.kind !== "badge" || pack.id === "fablo") return false;
    const members = catalog.badges.filter((badge) => badge.pack === pack.id);
    if (!members.length) return false;
    const anyOwned = members.some((badge) => have.has(badge.id));
    if (anyOwned) return true;
    return pack.onSale && !pack.retired && members.some((badge) => !badge.retired && (badge.onSale || !badge.custom));
  });
}
function tilesFor(catalog, state, words, opts) {
  const have = new Map(state.owned.map((row) => [row.id, row.frame]));
  const shown = new Set(state.showcase);
  const q = opts.query.trim().toLowerCase();
  const isPackTab = opts.tab.startsWith("pack:");
  const packId = isPackTab ? opts.tab.slice(5) : null;
  const list = [];
  for (const badge of catalog.badges) {
    if (isPackTab) {
      if (badge.pack !== packId) continue;
    } else {
      if (badge.pack && badge.pack !== "fablo" && (catalog.packs ?? []).some((p) => p.id === badge.pack && p.kind === "badge")) continue;
      if ((badge.category === "plan" ? "status" : badge.category) !== opts.tab) continue;
    }
    const name = words.name(badge);
    if (q && !name.toLowerCase().includes(q) && !badge.id.includes(q)) continue;
    const owned = have.has(badge.id);
    if (badge.custom && badge.unlock === "shop" && !owned && !badge.onSale) continue;
    if (badge.custom && badge.retired && !owned) continue;
    if (opts.owned && !owned) continue;
    list.push({ badge, name, owned, frame: have.get(badge.id) ?? "normal", shown: shown.has(badge.id) });
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
}
function tileHtml(tile, words) {
  const { badge } = tile;
  const price = tile.owned ? `<span class="bd-owned">${esc(words.owned)}</span>` : badge.grantRule ? `<span class="bd-price">${esc(words.auto)}</span>` : badge.unlock === "plan" ? "" : badge.price ? `<span class="bd-price"><i class="bd-coin"></i>${badge.price}</span>` : `<span class="bd-price">${esc(words.free)}</span>`;
  const until = !tile.owned && badge.custom && badge.onSale && badge.saleUntil ? `<span class="bd-until">${esc(words.until(badge.saleUntil))}</span>` : "";
  const rarity = badge.rarity ? `<span class="bd-rar bd-r-${badge.rarity}">${esc(words.rarity[badge.rarity])}</span>` : "";
  return `<button type="button" class="bd-tile${tile.owned ? " is-owned" : ""}${tile.shown ? " is-shown" : ""}" data-id="${esc(badge.id)}">${hexHtml(badge, tile.frame, "md")}<span class="bd-name">${esc(tile.name)}</span><span class="bd-meta">${price}${rarity}</span>${until}</button>`;
}
function slotsHtml(catalog, state, badgeOf, frameOf) {
  const out = [];
  for (let i = 0; i < 6; i += 1) {
    const id = state.showcase[i];
    const badge = id ? badgeOf(id) : void 0;
    if (badge) out.push(`<button type="button" class="bd-slot is-full" data-slot="${i}" data-id="${esc(badge.id)}">${hexHtml(badge, frameOf(badge.id), "sm")}</button>`);
    else if (i < state.slots) out.push(`<span class="bd-slot is-empty" data-slot="${i}"><span class="bd-hex bd-sm bd-f-normal"><span class="bd-hex-in bd-plus">+</span></span></span>`);
    else out.push(`<span class="bd-slot is-locked" data-slot="${i}"><span class="bd-hex bd-sm bd-f-normal"><span class="bd-hex-in bd-lock" aria-hidden="true"></span></span></span>`);
  }
  return out.join("");
}

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashBadges = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashBadges;
  const { user, catalog, state } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
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
  const FIXED = {
    "plan-bronze": dt("Bronze plan"),
    "plan-silver": dt("Silver plan"),
    "plan-gold": dt("Gold plan"),
    furro: dt("Furry"),
    boykisser: dt("Boykisser"),
    hetero: dt("Straight"),
    femboy: dt("Femboy")
  };
  const nameOf = (badge) => (badge.names ? badge.names[lang] ?? badge.names.en : null) ?? (badge.region ? regions?.of(badge.region) : badge.language ? languages?.of(badge.language) : null) ?? FIXED[badge.id] ?? badge.id;
  const dateText = new Intl.DateTimeFormat(lang, { day: "numeric", month: "short" });
  const words = {
    name: nameOf,
    rarity: { common: dt("Common"), rare: dt("Rare"), epic: dt("Epic"), legendary: dt("Legendary") },
    owned: dt("Yours"),
    free: dt("Free"),
    until: (iso) => dt("Until {date}", { date: dateText.format(new Date(iso)) }),
    auto: dt("Automatic")
  };
  const tabLabel = { country: dt("Countries"), language: dt("Languages"), fablo: dt("Fablo pack"), special: dt("Special"), status: dt("Status"), plan: dt("Status") };
  const ui = {
    places: dt("{n} of {m} places"),
    ownedCount: dt("{n} of {m} owned"),
    buy: dt("Buy for {price}"),
    poor: dt("Not enough ceramos"),
    show: dt("Show in the showcase"),
    hide: dt("Take out of the showcase"),
    full: dt("The showcase is full"),
    buyPack: dt("Buy the whole pack for {price}"),
    takePack: dt("Take the whole pack (free)"),
    packLeft: dt("{n} pieces you do not have"),
    packAll: dt("You have every piece"),
    upgrade: dt("Frame {frame}: {cost}"),
    on: dt("Turn on"),
    off: dt("Turn off"),
    close: dt("Close"),
    frame: { normal: dt("Normal"), bright: dt("Golden"), divine: dt("Divine") },
    chooseFrame: dt("Frame it shows"),
    claim: dt("Claim {n} ceramos"),
    next: dt("Next daily in {time}"),
    claimed: dt("You claimed {n} ceramos."),
    down: dt("Petto did not answer. Try again in a moment."),
    failed: dt("That did not work. Try again in a moment."),
    results: { closed: dt("That badge is not on sale now."), plan: dt("That badge is for people with a better plan."), poor: dt("You do not have enough ceramos."), owned: dt("You already have that badge."), unknown: dt("That badge is not for sale."), nothing: dt("You already have every piece."), max: dt("It already has the best frame."), notYours: dt("That badge is not one you can turn on yourself."), notYet: dt("That frame is not unlocked yet."), noFrame: dt("That badge has no frames.") },
    untilT: dt("Until {date}"),
    auto: dt("Automatic"),
    closed: dt("Not on sale now"),
    planNeeded: dt("Needs the {plan} plan or a better one"),
    autoHint: dt("Given by itself while you are what it says."),
    plans: { bronze: dt("Bronze"), silver: dt("Silver"), gold: dt("Gold") },
    statusEmpty: dt("The badges that follow what you are (partner, voter, booster, server boost) are coming soon."),
    noMatch: dt("No badge matches."),
    hours: dt("{h}h {m}m"),
    minutes: dt("{m}m")
  };
  const ready = Boolean(catalog && state);
  const badgeOf = (id) => catalog?.badges.find((badge) => badge.id === id);
  const frameOf = (id) => state?.owned.find((row) => row.id === id)?.frame ?? "normal";
  const badgePacks = catalog && state ? badgePacksOf(catalog, state) : [];
  const packNameOf = (names) => names[lang] ?? names[lang.split("-")[0]] ?? names.en;
  const allTabs = [
    ...TABS.slice(0, 3).map((tab) => ({ key: tab, label: tabLabel[tab] })),
    ...badgePacks.map((pack) => ({ key: `pack:${pack.id}`, label: packNameOf(pack.names), color: pack.color })),
    ...TABS.slice(3).map((tab) => ({ key: tab, label: tabLabel[tab] }))
  ];
  const total = (tab) => catalog && state ? tilesFor(catalog, state, words, { tab, query: "", owned: false }).length : 0;
  const ownedIn = (tab) => catalog && state ? tilesFor(catalog, state, words, { tab, query: "", owned: true }).length : 0;
  const firstTiles = catalog && state ? tilesFor(catalog, state, words, { tab: "country", query: "", owned: false }) : [];
  const name = user.username;
  const avatar = sessionAvatar(user, 128);
  const boot = ready ? JSON.stringify({ lang, catalog, state, ui, tabs: Object.fromEntries(allTabs.map((tab) => [tab.key, tab.label])), packNames: Object.fromEntries(badgePacks.map((pack) => [pack.id, packNameOf(pack.names)])), words: { rarity: words.rarity, owned: words.owned, free: words.free, auto: words.auto }, names: Object.fromEntries(catalog.badges.map((badge) => [badge.id, nameOf(badge)])) }).replace(/</g, "\\u003c") : "";
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "badges", "pageTitle": "Badges" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopShared", $$DashShopShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Badges"), "eyebrow": dt("Profile"), "icon": "ph:medal-fill", "back": false }, { "default": async ($$result3) => renderTemplate`${ready && state && renderTemplate`${maybeRenderHead()}<div class="bd-wallet"> ${renderComponent($$result3, "CeramosBalance", $$CeramosBalance, { "balance": state.balance, "id": "bd-balance" })} <button type="button" class="btn bd-daily" id="bd-daily"${addAttribute(!state.daily.canClaim, "hidden")}>${ui.claim.replace("{n}", String(state.daily.amount))}</button> <span class="bd-next" id="bd-next"${addAttribute(state.daily.canClaim, "hidden")}>${ui.next.replace("{time}", ui.hours.replace("{h}", String(Math.max(0, Math.floor((new Date(state.daily.nextAt).getTime() - Date.now()) / 36e5)))).replace("{m}", String(Math.max(0, Math.ceil((new Date(state.daily.nextAt).getTime() - Date.now()) % 36e5 / 6e4)))))}</span> </div>`}` })} ${renderComponent($$result2, "DashCeramosNote", $$DashCeramosNote, {})} ${!ready && renderTemplate`<p class="bd-down" role="alert">${ui.down}</p>`}${ready && catalog && state && renderTemplate`<div class="bd" id="bd"${addAttribute(boot, "data-boot")}> <aside class="bd-card bd-show"> <div class="bd-card-head"><h2>${dt("Showcase")}</h2><span id="bd-places">${ui.places.replace("{n}", String(state.showcase.length)).replace("{m}", String(state.slots))}</span></div> <div class="bd-preview"> <div class="bd-me"> ${avatar ? renderTemplate`<img${addAttribute(avatar, "src")} alt="" width="56" height="56">` : renderTemplate`<span class="bd-me-ph"></span>`} <b>${name}</b> </div> <div class="bd-slots" id="bd-slots">${unescapeHTML(slotsHtml(catalog, state, badgeOf, frameOf))}</div> </div> <p class="bd-hint">${dt("Click a badge you own to show it, or click one in the showcase to take it out.")}</p> </aside> <div class="bd-main"> <div class="bd-banner" id="bd-banner"${addAttribute(state.slots >= 6, "hidden")}> <div><b>${dt("More places with a plan")}</b><span>${dt("Bronze gives 2 places, Silver 4 and Gold all six.")}</span></div> <a class="btn" href="/dash/premium">${dt("See plans")}</a> </div> <div class="bd-tools"> <div class="bd-tabs" role="tablist"> ${allTabs.map((tab, index) => renderTemplate`<button type="button" role="tab"${addAttribute(["bd-tab", { active: index === 0, "bd-tab-pack": Boolean(tab.color) }], "class:list")}${addAttribute(tab.key, "data-tab")}${addAttribute(index === 0, "aria-selected")}${addAttribute(tab.color ? `--pc:${tab.color}` : void 0, "style")}>${tab.label}<i>${ownedIn(tab.key)}</i></button>`)} </div> </div> <div class="bd-packbar" id="bd-packbar" hidden></div> <div class="bd-find"> <label class="bd-search"><input type="search" id="bd-q"${addAttribute(dt("Search badges"), "placeholder")} autocomplete="off"></label> <div class="bd-filter" role="group"> <button type="button" class="active" data-filter="all">${dt("All")}</button> <button type="button" data-filter="owned">${dt("Owned")}</button> </div> </div> <div class="bd-progress"><span id="bd-count">${ui.ownedCount.replace("{n}", String(ownedIn("country"))).replace("{m}", String(total("country")))}</span><div class="bd-bar"><i id="bd-fill"${addAttribute(`width:${total("country") ? Math.round(ownedIn("country") / total("country") * 100) : 0}%`, "style")}></i></div></div> <div class="bd-grid" id="bd-grid">${unescapeHTML(firstTiles.map((tile) => tileHtml(tile, words)).join(""))}</div> <p class="bd-empty" id="bd-empty" hidden></p> </div> <dialog class="bd-dialog" id="bd-dialog"> <div class="bd-dialog-body"> <div id="bd-d-hex"></div> <h3 id="bd-d-name"></h3> <p id="bd-d-meta"></p> <p class="bd-d-error" id="bd-d-error" role="alert" hidden></p> <div class="bd-d-actions" id="bd-d-actions"></div> <button type="button" class="btn bd-d-close" id="bd-d-close">${ui.close}</button> </div> </dialog> </div>`}` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashBadges.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Badges = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Badges;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const [catalog, state] = await Promise.all([callPettoCeramos(Astro2, session.userId, "catalog"), callPettoCeramos(Astro2, session.userId, "state")]);
  const ok = catalog.ok && state.ok;
  return renderTemplate`${renderComponent($$result, "DashBadges", $$DashBadges, { "user": session, "catalog": ok ? catalog.data : null, "state": ok ? state.data : null, "unavailable": !ok })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/badges.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/badges.astro";
const $$url = "/dash/badges";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Badges,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
