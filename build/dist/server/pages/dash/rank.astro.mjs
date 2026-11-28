import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { s as sessionAvatar } from '../../chunks/avatarUrl_DW4zxFoS.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashCeramosNote } from '../../chunks/DashCeramosNote_CKmCua4C.mjs';
import { $ as $$DashShopShared } from '../../chunks/DashShopShared_BdnfBusr.mjs';
import { $ as $$CeramosBalance } from '../../chunks/CeramosBalance_BknhqXYc.mjs';
import { $ as $$ColorPicker } from '../../chunks/ColorPicker_DwzcbTkv.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                   */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const GRADIENT_PRICE = 40;
const BAR_COLORS = ["#ffb199", "#a5ea7a", "#7cb7ff", "#c4a5ff", "#ffd23f", "#ff6b8a"];
const TEXT_COLORS = ["#ffffff", "#ffd6e0", "#bfe3ff", "#b8f5a0", "#ffe9a8"];

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashRankCard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashRankCard;
  const { user, rank, catalog, state } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const ready = Boolean(rank && catalog && state);
  const nameOf = (names) => names[lang] ?? names[lang.split("-")[0]] ?? names.en;
  const freePieces = new Set((catalog?.packs ?? []).filter((pack) => pack.free).flatMap((pack) => pack.pieces));
  const banners = (catalog?.items ?? []).filter((item) => item.kind === "banner" && item.hasFile).map((item) => ({
    id: item.id,
    name: nameOf(item.names),
    price: item.price,
    version: item.version,
    credit: item.credit,
    free: item.price === 0 || freePieces.has(`banner:${item.id}`),
    onSale: item.onSale,
    rarity: item.rarity
  }));
  const designs = (rank?.designs?.designs ?? []).map((design) => ({ id: design.id, family: design.family, name: design.names?.[lang] ?? design.names?.[lang.split("-")[0]] ?? design.names?.en ?? design.id }));
  const families = (rank?.designs?.families ?? []).map((family) => ({ id: family.id, name: family.names?.[lang] ?? family.names?.[lang.split("-")[0]] ?? family.names?.en ?? family.id }));
  const avatar = sessionAvatar(user, 256) ?? "";
  const ui = {
    free: dt("Free"),
    owned: dt("Yours"),
    inUse: dt("In use"),
    paid: dt("Costs ceramos"),
    total: dt("Total to pay when you save:"),
    have: dt("you have"),
    ceramos: dt("ceramos"),
    saved: dt("Saved. Your card is ready in every server."),
    nothing: dt("Nothing to pay"),
    poor: dt("You do not have enough ceramos for the two-color bar."),
    down: dt("Petto did not answer. Try again in a moment."),
    failed: dt("That did not work. Try again in a moment."),
    locked: dt("That background costs {price} ceramos. Get it in Customize profile and it will be here."),
    lockedLink: dt("Open Customize profile"),
    claimFail: dt("That background could not be taken. Try again."),
    noBanner: dt("You have no banner on in your profile yet."),
    defaultName: dt("Default"),
    profileBanner: dt("My profile banner"),
    resetDone: dt("Your card is back to the default one."),
    working: dt("Saving..."),
    saveLabel: dt("Save"),
    removeGradient: dt("Remove"),
    useGradient: dt("Use it"),
    activate: dt("Activate")
  };
  const boot = ready ? JSON.stringify({
    lang,
    ui,
    me: user.username,
    avatar,
    rank: { settings: rank.settings, gradientPaid: rank.gradientPaid, balance: rank.balance, fonts: rank.fonts, hasBanner: rank.hasBanner },
    banners,
    designs,
    families,
    owned: state.items.filter((row) => row.kind === "banner").map((row) => row.id),
    activeBanner: state.active.banner,
    barColors: BAR_COLORS,
    textColors: TEXT_COLORS,
    gradientPrice: GRADIENT_PRICE
  }).replace(/</g, "\\u003c") : "";
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "rank", "pageTitle": "Rank card" }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopShared", $$DashShopShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Rank card"), "eyebrow": dt("Profile"), "icon": "ph:identification-card-fill", "back": false }, { "default": async ($$result3) => renderTemplate`${ready && state && renderTemplate`${maybeRenderHead()}<div class="bd-wallet">${renderComponent($$result3, "CeramosBalance", $$CeramosBalance, { "balance": rank.balance, "id": "rk-balance" })}<a class="btn" href="/dash/buy-ceramos">${dt("Get ceramos")}</a></div>`}` })} ${renderComponent($$result2, "DashCeramosNote", $$DashCeramosNote, {})} <p class="rk-lead">${dt("It is the card every server shows for you when it has not designed its own. The basics are free; the two-color bar costs ceramos once.")}</p> ${!ready && renderTemplate`<p class="bd-down" role="alert">${ui.down}</p>`}${ready && renderTemplate`<div class="rk" id="rk"${addAttribute(boot, "data-boot")}> <div class="bd-card rk-preview"> <canvas id="rk-canvas" width="1024" height="320"${addAttribute(dt("Preview of your rank card"), "aria-label")}></canvas> <p class="bd-hint">${dt("Live preview. What costs ceramos is charged when you save.")}</p> </div> <div class="rk-tabs" role="tablist"> <button type="button" role="tab" class="bd-tab active" data-tab="bg" aria-selected="true">${dt("Backgrounds")}</button> <button type="button" role="tab" class="bd-tab" data-tab="bar" aria-selected="false">${dt("Bar and text")}</button> <button type="button" role="tab" class="bd-tab" data-tab="look" aria-selected="false">${dt("Theme and layout")}</button> </div> <div class="rk-panel" data-panel="bg" id="rk-bg"${addAttribute(dt("Game backgrounds \xB7 free for everybody"), "data-free-title")}${addAttribute(dt("Paid backgrounds \xB7 with ceramos"), "data-paid-title")}${addAttribute(dt("Pictures of their owners and of their photographers or artists, used without profit and with credit. Petto is not affiliated with or endorsed by them."), "data-credits")}></div> <div class="rk-panel" data-panel="bar" hidden> <div class="bd-card rk-grid2"> <div> <h3>${dt("Progress bar")}</h3> <div class="rk-row"><div><b>${dt("Solid color")}</b><small>${dt("Pick a color")}</small></div><div class="rk-sw"><span class="rk-dots" id="rk-bar-sw"></span>${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "id": "rk-bar-cp", "name": "rk-bar-cp", "value": "#ffffff", "label": "" })}</div></div> <div class="rk-row"><div><b>${dt("Own gradient")}</b><small>${dt("A second color for the end of the bar. Paid once, yours for good.")}</small></div> <div class="rk-actions"><span class="bd-price" id="rk-grad-price"><i class="bd-coin"></i>${GRADIENT_PRICE}</span><button type="button" class="btn" id="rk-grad-toggle"></button></div></div> <div class="rk-row" id="rk-grad-row" hidden><div><b>${dt("Second color")}</b></div><div class="rk-sw"><span class="rk-dots" id="rk-bar2-sw"></span>${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "id": "rk-bar2-cp", "name": "rk-bar2-cp", "value": "#ffffff", "label": "" })}</div></div> <div class="rk-gradbar" id="rk-gradbar" hidden></div> </div> <div> <h3>${dt("Text")}</h3> <div class="rk-row rk-col"><div><b>${dt("Font")}</b></div><div class="rk-fonts" id="rk-fonts"></div></div> <div class="rk-row"><div><b>${dt("Text color")}</b><small>${dt("Of the name and the numbers")}</small></div><div class="rk-sw"><span class="rk-dots" id="rk-text-sw"></span>${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "id": "rk-text-cp", "name": "rk-text-cp", "value": "#ffffff", "label": "" })}</div></div> </div> </div> </div> <div class="rk-panel" data-panel="look" hidden> <div class="bd-card rk-grid2"> <div> <h3>${dt("Theme")}</h3> <div class="rk-seg" id="rk-theme" role="group"><button type="button" data-v="dark">${dt("Dark")}</button><button type="button" data-v="light">${dt("Light")}</button></div> <h3 class="rk-gap">${dt("Layout")}</h3> <div class="rk-seg" id="rk-layout" role="group"><button type="button" data-v="side">${dt("Name beside the avatar")}</button><button type="button" data-v="below">${dt("Bar across the card")}</button></div> </div> <div> <h3>${dt("Avatar shape")}</h3> <div class="rk-seg" id="rk-shape" role="group"><button type="button" data-v="circle">${dt("Circle")}</button><button type="button" data-v="rounded">${dt("Rounded")}</button><button type="button" data-v="square">${dt("Square")}</button></div> </div> </div> </div> <p class="rk-msg" id="rk-msg" role="status" hidden></p> <div class="bd-card rk-foot"> <div class="rk-total" id="rk-total"></div> <div class="rk-foot-actions"> <button type="button" class="btn" id="rk-reset">${dt("Back to default")}</button> <button type="button" class="btn" id="rk-discard">${dt("Discard")}</button> <button type="button" class="btn rk-save" id="rk-save">${dt("Save")}</button> </div> </div> </div>`}` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashRankCard.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Rank = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Rank;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const [rank, catalog, state] = await Promise.all([callPettoCeramos(Astro2, session.userId, "rank-card"), callPettoCeramos(Astro2, session.userId, "catalog"), callPettoCeramos(Astro2, session.userId, "state")]);
  const ok = rank.ok && catalog.ok && state.ok;
  return renderTemplate`${renderComponent($$result, "DashRankCard", $$DashRankCard, { "user": session, "rank": ok ? rank.data : null, "catalog": ok ? catalog.data : null, "state": ok ? state.data : null })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/rank.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/rank.astro";
const $$url = "/dash/rank";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Rank,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
