import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from '../../chunks/dash_CORIPvM-.mjs';
import { l as localePath } from '../../chunks/ui_C1MR3LHJ.mjs';
/* empty css                                      */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashPrivacy = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashPrivacy;
  const { user } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const locale = dashLocale(lang);
  const base = localePath[lang];
  const until = Number.isFinite(user.expiresAt) && user.expiresAt > 0 ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(user.expiresAt)) : null;
  const handle = user.handle && user.handle !== user.username ? user.handle : null;
  const kept = [
    dt("Your Discord ID, name and @username."),
    dt("Your avatar, banner and accent color, and the avatar decoration and nameplate you wear."),
    dt("The access key Discord gave Petto for this login, so it can ask Discord for your servers.")
  ];
  const browser = [
    { icon: "ph:cookie-fill", name: "petto_lang", text: dt("Your dashboard language. A cookie, 1 year.") },
    { icon: "ph:palette-fill", name: "petto-theme", text: dt("Your theme, dark or light. Kept only in this browser.") },
    { icon: "ph:sort-ascending-fill", name: "petto-dash-server-sort", text: dt("How you sort your list of servers. Kept only in this browser.") }
  ];
  const links = [
    { icon: "ph:shield-check-fill", href: `${base}/privacy`, title: dt("Privacy Policy"), text: dt("What Petto stores, why, and your rights to see, correct or delete it."), external: false },
    { icon: "ph:cookie-fill", href: `${base}/cookies`, title: dt("Cookies"), text: dt("Every cookie and browser setting of this site, one by one."), external: false },
    { icon: "ph:clock-counter-clockwise", href: "/dash/history", title: dt("Your name history"), text: dt("See the names Petto saved, delete them, or stop it from saving them."), external: false, sk: "list" },
    { icon: "ph:headset-fill", href: "https://petto.sbs/support", title: dt("Ask for your data to be deleted"), text: dt("Open a ticket in the support server and say what you want removed."), external: true }
  ];
  return renderTemplate`${renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "privacy", "pageTitle": "Privacy and session", "data-astro-cid-35k3ccjg": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<header class="ac-head" data-astro-cid-35k3ccjg> <h1 data-astro-cid-35k3ccjg>${dt("Privacy and session")}</h1> <p data-astro-cid-35k3ccjg>${dt("What Petto keeps about your login, where it is kept, and how to leave.")}</p> </header> <div class="ac-grid" data-astro-cid-35k3ccjg> <section class="ac-card" data-astro-cid-35k3ccjg> <div class="ac-card-head" data-astro-cid-35k3ccjg><h2 data-astro-cid-35k3ccjg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:key-fill", "width": "16", "height": "16", "data-astro-cid-35k3ccjg": true })}${dt("This session")}</h2></div> <dl class="ac-rows" data-astro-cid-35k3ccjg> <div data-astro-cid-35k3ccjg><dt data-astro-cid-35k3ccjg>${dt("Signed in as")}</dt><dd data-astro-cid-35k3ccjg>${user.username}${handle && renderTemplate`<small data-astro-cid-35k3ccjg>@${handle}</small>`}</dd></div> <div data-astro-cid-35k3ccjg><dt data-astro-cid-35k3ccjg>${dt("Discord ID")}</dt><dd data-astro-cid-35k3ccjg><code class="ac-code" data-astro-cid-35k3ccjg>${user.userId}</code></dd></div> ${until && renderTemplate`<div data-astro-cid-35k3ccjg><dt data-astro-cid-35k3ccjg>${dt("Discord access key until")}</dt><dd data-astro-cid-35k3ccjg>${until}<small data-astro-cid-35k3ccjg>${dt("It renews by itself while you visit.")}</small></dd></div>`} <div data-astro-cid-35k3ccjg><dt data-astro-cid-35k3ccjg>${dt("Login cookie")}</dt><dd data-astro-cid-35k3ccjg>petto_session<small data-astro-cid-35k3ccjg>${dt("7 days from its last renewal")}</small></dd></div> </dl> <div class="ac-btns" data-astro-cid-35k3ccjg><a class="btn btn-ghost btn-sm" href="/dash/logout" data-astro-cid-35k3ccjg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sign-out-fill", "width": "13", "height": "13", "data-astro-cid-35k3ccjg": true })}${dt("Log out")}</a></div> </section> <section class="ac-card" data-astro-cid-35k3ccjg> <div class="ac-card-head" data-astro-cid-35k3ccjg><h2 data-astro-cid-35k3ccjg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lock-key-fill", "width": "16", "height": "16", "data-astro-cid-35k3ccjg": true })}${dt("What the login cookie holds")}</h2></div> <ul class="ac-list" data-astro-cid-35k3ccjg> ${kept.map((item) => renderTemplate`<li data-astro-cid-35k3ccjg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-35k3ccjg": true })}<span data-astro-cid-35k3ccjg>${item}</span></li>`)} <li data-astro-cid-35k3ccjg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x-bold", "width": "13", "height": "13", "class": "pv-no", "data-astro-cid-35k3ccjg": true })}<span data-astro-cid-35k3ccjg><b data-astro-cid-35k3ccjg>${dt("Never your email.")}</b> ${dt("It is encrypted, HttpOnly (scripts cannot read it) and only sent over HTTPS.")}</span></li> </ul> <p class="ac-muted pv-note" data-astro-cid-35k3ccjg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "14", "height": "14", "data-astro-cid-35k3ccjg": true })}<span data-astro-cid-35k3ccjg>${dt("Logging out removes the cookie. To also take Petto off your Discord account, remove it in Discord under Settings, Authorized Apps.")}</span></p> </section> <section class="ac-card ac-wide" data-astro-cid-35k3ccjg> <div class="ac-card-head" data-astro-cid-35k3ccjg><h2 data-astro-cid-35k3ccjg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:browser-fill", "width": "16", "height": "16", "data-astro-cid-35k3ccjg": true })}${dt("What this browser remembers")}</h2></div> <ul class="pv-browser" data-astro-cid-35k3ccjg> ${browser.map((item) => renderTemplate`<li data-astro-cid-35k3ccjg>${renderComponent($$result2, "Icon", $$Icon, { "name": item.icon, "width": "18", "height": "18", "data-astro-cid-35k3ccjg": true })}<div data-astro-cid-35k3ccjg><code class="ac-code" data-astro-cid-35k3ccjg>${item.name}</code><span data-astro-cid-35k3ccjg>${item.text}</span></div></li>`)} </ul> <p class="ac-muted pv-note" data-astro-cid-35k3ccjg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "14", "height": "14", "data-astro-cid-35k3ccjg": true })}<span data-astro-cid-35k3ccjg>${dt("No tracking cookies, no analytics, no ads.")}</span></p> </section> <section class="ac-card ac-wide" data-astro-cid-35k3ccjg> <div class="ac-card-head" data-astro-cid-35k3ccjg><h2 data-astro-cid-35k3ccjg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hand-heart-fill", "width": "16", "height": "16", "data-astro-cid-35k3ccjg": true })}${dt("Your data and your choices")}</h2></div> <ul class="pv-links" data-astro-cid-35k3ccjg> ${links.map((l) => renderTemplate`<li data-astro-cid-35k3ccjg> <a${addAttribute(l.href, "href")}${addAttribute(l.external ? "_blank" : void 0, "target")}${addAttribute(l.external ? "noopener" : void 0, "rel")}${addAttribute(l.sk, "data-sk")} data-astro-cid-35k3ccjg> <span class="pv-ic" data-astro-cid-35k3ccjg>${renderComponent($$result2, "Icon", $$Icon, { "name": l.icon, "width": "18", "height": "18", "data-astro-cid-35k3ccjg": true })}</span> <span class="pv-tx" data-astro-cid-35k3ccjg><strong data-astro-cid-35k3ccjg>${l.title}</strong><small data-astro-cid-35k3ccjg>${l.text}</small></span> ${renderComponent($$result2, "Icon", $$Icon, { "name": l.external ? "ph:arrow-up-right-bold" : "ph:caret-right-bold", "width": "13", "height": "13", "class": "pv-go", "data-astro-cid-35k3ccjg": true })} </a> </li>`)} </ul> <p class="ac-muted pv-note" data-astro-cid-35k3ccjg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "14", "height": "14", "data-astro-cid-35k3ccjg": true })}<span data-astro-cid-35k3ccjg>${dt("Do not want your messages counted in statistics? Write !stats privacy in any server and press Do not count me.")}</span></p> </section> </div> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashPrivacy.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Privacy = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Privacy;
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  return renderTemplate`${renderComponent($$result, "DashPrivacy", $$DashPrivacy, { "user": session })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/privacy.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/privacy.astro";
const $$url = "/dash/privacy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Privacy,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
