import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, F as Fragment, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashShopShared } from '../../chunks/DashShopShared_BdnfBusr.mjs';
import { $ as $$CeramosBalance } from '../../chunks/CeramosBalance_BknhqXYc.mjs';
import { $ as $$CheckoutConsent } from '../../chunks/CheckoutConsent_BhJLEx7I.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                          */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { i as isPettoOwner, n as coinCheckoutReady } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashBuyCeramos = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashBuyCeramos;
  const { user, packs, ready, balance, paid, failed, why = "" } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const names = { pile: dt("Pile of coins"), "small-bag": dt("Small bag"), "big-bag": dt("Big bag"), chest: dt("Treasure chest") };
  const number = new Intl.NumberFormat(lang);
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "buy", "pageTitle": "Buy ceramos" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopShared", $$DashShopShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Buy ceramos"), "eyebrow": dt("Ceramos"), "icon": "ph:coins-fill", "back": false }, { "default": ($$result3) => renderTemplate`${balance !== null && renderTemplate`${maybeRenderHead()}<div class="bd-wallet">${renderComponent($$result3, "CeramosBalance", $$CeramosBalance, { "balance": balance })}</div>`}` })} <p class="bc-lead">${dt("Ceramos are for banners, name fonts, packs and badges. Buy them whenever you want: the ceramos arrive a few seconds after the payment and never expire.")}</p> ${paid && renderTemplate`<p class="bc-msg" role="status">${dt("Thank you! Your payment was received. Your ceramos arrive in a few seconds: refresh the page to see them.")}</p>`}${failed && renderTemplate`<p class="bc-msg is-bad" role="alert">${dt("The payment page could not be opened. Try again in a moment.")}${why && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`<br><small>${dt("Only you see this: {why}", { why })}</small>` })}`}</p>`}${!packs && renderTemplate`<p class="bd-down" role="alert">${dt("Petto did not answer. Try again in a moment.")}</p>`}${packs && renderTemplate`<div class="bc-grid"> ${packs.map((pack) => renderTemplate`<article class="bd-card bc-card"> <img${addAttribute(`/assets/ceramos/${pack.id}.webp`, "src")} alt="" width="512" height="512" loading="lazy"> <h2>${names[pack.id] ?? pack.id}</h2> <p class="bc-coins"><i class="bd-coin"></i> <b>${number.format(pack.coins)}</b> <span>${dt("ceramos")}</span></p> <p class="bc-price">$${pack.price.toFixed(2)}</p> ${ready[pack.id] ? renderTemplate`<a class="btn bc-buy"${addAttribute(`/dash/buy-ceramos?buy=${pack.id}`, "href")}>${dt("Buy")}</a>` : renderTemplate`<button type="button" class="btn bc-buy" disabled>${dt("Not available yet")}</button>`} </article>`)} </div>`}<p class="bc-note">${dt("You pay in Polar. Payments are not refunded, except a charge that was duplicated, made by mistake or never delivered.")}</p> ${renderComponent($$result2, "CheckoutConsent", $$CheckoutConsent, { "lang": lang })} ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashBuyCeramos.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$BuyCeramos = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BuyCeramos;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const [catalog, state] = await Promise.all([callPettoCeramos(Astro2, session.userId, "catalog"), callPettoCeramos(Astro2, session.userId, "state")]);
  const packs = catalog.ok ? catalog.data.coinPacks : null;
  const why = isPettoOwner(Astro2, session.userId) ? (Astro2.url.searchParams.get("why") ?? "").slice(0, 220) : "";
  const ready = coinCheckoutReady(Astro2, (packs ?? []).map((pack) => pack.id));
  return renderTemplate`${renderComponent($$result, "DashBuyCeramos", $$DashBuyCeramos, { "user": session, "packs": packs, "ready": ready, "balance": state.ok ? state.data.balance : null, "paid": Astro2.url.searchParams.get("paid") === "1", "failed": Astro2.url.searchParams.get("error") === "checkout_unavailable", "why": why })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/buy-ceramos.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/buy-ceramos.astro";
const $$url = "/dash/buy-ceramos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BuyCeramos,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
