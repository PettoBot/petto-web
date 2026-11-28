import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$Base } from '../chunks/Base_Di2YHjFe.mjs';
import { g as getDashLang, m as makeT } from '../chunks/dash_CORIPvM-.mjs';
import { a as LOGIN_HREF, h as homeHref, l as loginNotice, i as isDiscordNotice, b as landingPath, c as loginInfo } from '../chunks/dashLogin_BrhWPYc0.mjs';
/* empty css                                 */
import { g as getDashboardSession } from '../chunks/dashAuth_uqFK7-ED.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashLogin = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashLogin;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { error, info = null } = Astro2.props;
  const errorMessages = {
    missing_code: dt("Discord didn't send back a login code, try again."),
    token_exchange_failed: dt("Discord rejected the login exchange, try again."),
    user_fetch_failed: dt("Couldn't load your Discord profile, try again."),
    login_failed: dt("Something went wrong logging in, try again."),
    server_not_configured: dt("Login isn't configured on this environment yet."),
    no_access: dt("You don't have permission to manage that server."),
    bot_not_in_guild: dt("Petto isn't in that server."),
    discord_unavailable: dt("Discord didn't respond in time. Petto is still running; wait a few seconds and try again."),
    unknown: dt("Something went wrong, try again.")
  };
  const infoMessages = {
    relogin: dt("The Petto dashboard has been refreshed. Log in with Discord to continue.")
  };
  const infoText = info ? infoMessages[info] ?? null : null;
  const notice = loginNotice(error);
  const fromDiscord = isDiscordNotice(error);
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": `${dt("Login required")} \xB7 Petto`, "active": "dash", "showFooter": true, "noindex": true, "preloadImages": ["/assets/home-hero-sky.webp"], "data-astro-cid-pykcgiiz": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="dl-main" data-astro-cid-pykcgiiz> <div class="dl-bg" aria-hidden="true" data-astro-cid-pykcgiiz> <img src="/assets/home-hero-sky.webp" alt="" loading="eager" decoding="sync" fetchpriority="high" draggable="false" data-astro-cid-pykcgiiz> <div class="dl-bg-fade" data-astro-cid-pykcgiiz></div> </div> <section class="dl-card" aria-labelledby="dl-title" data-astro-cid-pykcgiiz> <img class="dl-mascot" src="/assets/favicon-3d.png" width="56" height="56" alt="" loading="eager" decoding="sync" draggable="false" data-astro-cid-pykcgiiz> <h1 id="dl-title" class="dl-title" data-astro-cid-pykcgiiz>${dt("Login required")}</h1> ${infoText && renderTemplate`<p class="dl-info" role="status" data-dl-info data-astro-cid-pykcgiiz> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "16", "height": "16", "class": "dl-info-icon", "data-astro-cid-pykcgiiz": true })} <span data-astro-cid-pykcgiiz>${infoText}</span> <button type="button" class="dl-info-x" data-dl-info-close${addAttribute(dt("Close"), "aria-label")} data-astro-cid-pykcgiiz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x", "width": "13", "height": "13", "data-astro-cid-pykcgiiz": true })}</button> </p>`} <p class="dl-line" data-astro-cid-pykcgiiz>${dt("Log in with Discord to manage your servers.")}</p> ${notice && renderTemplate`<p${addAttribute(["dl-notice", { "dl-notice-discord": fromDiscord }], "class:list")} role="alert" data-astro-cid-pykcgiiz> ${renderComponent($$result2, "Icon", $$Icon, { "name": fromDiscord ? "simple-icons:discord" : "ph:warning-fill", "width": "15", "height": "15", "class": "dl-notice-icon", "data-astro-cid-pykcgiiz": true })} <span data-astro-cid-pykcgiiz>${errorMessages[notice]}</span> </p>`} <a class="btn dl-login"${addAttribute(LOGIN_HREF, "href")} data-dl-login data-astro-cid-pykcgiiz> ${renderComponent($$result2, "Icon", $$Icon, { "name": "simple-icons:discord", "width": "17", "height": "17", "data-astro-cid-pykcgiiz": true })} ${dt("Log in with Discord")} </a> <a class="dl-back"${addAttribute(homeHref(dashLang), "href")} data-astro-cid-pykcgiiz>${dt("Back to home")}</a> </section> </main> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashLogin.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const errorParam = Astro2.url.searchParams.get("error");
  const noticeParam = Astro2.url.searchParams.get("notice");
  const session = await getDashboardSession(Astro2);
  if (session) {
    return Astro2.redirect(landingPath());
  }
  return renderTemplate`${renderComponent($$result, "DashLogin", $$DashLogin, { "error": errorParam, "info": loginInfo(noticeParam) ?? (Astro2.locals.sessionStale ? "relogin" : null) })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/index.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/index.astro";
const $$url = "/dash";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
