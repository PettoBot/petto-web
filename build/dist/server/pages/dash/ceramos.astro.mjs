import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { $ as $$DashCeramosNote } from '../../chunks/DashCeramosNote_CKmCua4C.mjs';
import { $ as $$DashShopShared } from '../../chunks/DashShopShared_BdnfBusr.mjs';
import { $ as $$CeramosBalance } from '../../chunks/CeramosBalance_BknhqXYc.mjs';
import { g as getDashLang, m as makeT } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                      */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { e as callPettoCeramos } from '../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashCeramosLog = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashCeramosLog;
  const { user, balance, movements } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const when = new Intl.DateTimeFormat(lang, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const reasons = {
    daily: dt("Daily reward"),
    badge: dt("Badge bought"),
    frame: dt("Frame bought"),
    banner: dt("Banner bought"),
    font: dt("Name font bought"),
    pack: dt("Pack bought"),
    purchase: dt("Pack of ceramos bought"),
    mission: dt("Mission"),
    grant: dt("Gift from the team"),
    take: dt("Adjusted by the team"),
    refund: dt("Refund")
  };
  const what = (move) => move.ref ? move.ref.split(":")[0] : "";
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "movements", "pageTitle": "Ceramos movements" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashShopShared", $$DashShopShared, {})} ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Ceramos movements"), "eyebrow": dt("Ceramos"), "icon": "ph:list-bullets-fill", "back": false }, { "default": ($$result3) => renderTemplate`${balance !== null && renderTemplate`${maybeRenderHead()}<div class="bd-wallet">${renderComponent($$result3, "CeramosBalance", $$CeramosBalance, { "balance": balance })}</div>`}` })} ${renderComponent($$result2, "DashCeramosNote", $$DashCeramosNote, {})} ${!movements && renderTemplate`<p class="bd-down" role="alert">${dt("Petto did not answer. Try again in a moment.")}</p>`}${movements && movements.length === 0 && renderTemplate`<p class="bd-empty">${dt("No movements yet. Claim your daily reward to start.")} <a href="/dash/daily">${dt("Daily reward")}</a></p>`}${movements && movements.length > 0 && renderTemplate`<ul class="cl"> ${movements.map((move) => renderTemplate`<li class="bd-card cl-row"> <div><strong>${reasons[move.reason] ?? move.reason}</strong>${what(move) && renderTemplate`<span>${what(move)}</span>`}</div> <time${addAttribute(move.at, "datetime")}>${when.format(new Date(move.at))}</time> <b${addAttribute(["cl-amount", { "is-in": move.delta > 0 }], "class:list")}>${move.delta > 0 ? "+" : "\u2212"}${Math.abs(move.delta)}</b> </li>`)} </ul>`}` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashCeramosLog.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Ceramos = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Ceramos;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const [ledger, state] = await Promise.all([callPettoCeramos(Astro2, session.userId, "ledger"), callPettoCeramos(Astro2, session.userId, "state")]);
  return renderTemplate`${renderComponent($$result, "DashCeramosLog", $$DashCeramosLog, { "user": session, "balance": state.ok ? state.data.balance : null, "movements": ledger.ok ? ledger.data.movements : null })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/ceramos.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/ceramos.astro";
const $$url = "/dash/ceramos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Ceramos,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
