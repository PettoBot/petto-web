import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                          */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getPersonalSettings } from '../../chunks/dashPersonal_Do7ta8qg.mjs';
import { t as read } from '../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashPreferences = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashPreferences;
  const { user, prefix, reputation, historyOff, contactEmail = null, contactMessage = null } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const locale = dashLocale(lang);
  const langs = [
    { code: "en", label: "English", flag: "/assets/flags/us.svg" },
    { code: "es", label: "Espa\xF1ol", flag: "/assets/flags/es.svg" },
    { code: "pt-BR", label: "Portugu\xEAs (Brasil)", flag: "/assets/flags/br.svg" }
  ];
  const themes = [
    { id: "dark", icon: "ph:moon-fill", label: dt("Dark") },
    { id: "light", icon: "ph:sun-fill", label: dt("Light") },
    { id: "system", icon: "ph:desktop-fill", label: dt("Same as my device") }
  ];
  return renderTemplate(_a || (_a = __template(["", " <script>\n  (function () {\n    var root = document.documentElement;\n    var box = document.querySelector('[data-pf-themes]');\n    if (!box) return;\n    var buttons = Array.prototype.slice.call(box.querySelectorAll('[data-theme-pick]'));\n    function stored() { try { return localStorage.getItem('petto-theme'); } catch (e) { return null; } }\n    function mark() {\n      var s = stored();\n      var now = s === 'dark' || s === 'light' ? s : 'system';\n      buttons.forEach(function (b) {\n        var on = b.getAttribute('data-theme-pick') === now;\n        b.classList.toggle('on', on);\n        b.setAttribute('aria-pressed', String(on));\n      });\n    }\n    buttons.forEach(function (b) {\n      b.addEventListener('click', function () {\n        var pick = b.getAttribute('data-theme-pick');\n        try { if (pick === 'system') localStorage.removeItem('petto-theme'); else localStorage.setItem('petto-theme', pick); } catch (e) {}\n        if (pick === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', pick);\n        mark();\n      });\n    });\n    var reset = document.querySelector('[data-pf-reset]');\n    if (reset) reset.addEventListener('click', function () {\n      try { localStorage.removeItem('petto-theme'); localStorage.removeItem('petto-dash-server-sort'); } catch (e) {}\n      root.removeAttribute('data-theme');\n      mark();\n      var label = reset.querySelector('span');\n      if (label) label.textContent = reset.getAttribute('data-done');\n      reset.disabled = true;\n    });\n    // The top bar toggle changes the same setting: keep the buttons in step with it.\n    new MutationObserver(mark).observe(root, { attributes: true, attributeFilter: ['data-theme'] });\n    mark();\n  })();\n<\/script> "])), renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "preferences", "pageTitle": "Preferences", "data-astro-cid-ex6yybm3": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<header class="ac-head" data-astro-cid-ex6yybm3> <h1 data-astro-cid-ex6yybm3>${dt("Preferences")}</h1> <p data-astro-cid-ex6yybm3>${dt("Your own choices for the dashboard. They follow you, not a server.")}</p> </header> <div class="ac-grid" data-astro-cid-ex6yybm3> <section class="ac-card ac-wide" data-astro-cid-ex6yybm3> <div class="ac-card-head" data-astro-cid-ex6yybm3><h2 data-astro-cid-ex6yybm3>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:translate-fill", "width": "16", "height": "16", "data-astro-cid-ex6yybm3": true })}${dt("Dashboard language")}</h2></div> <p class="ac-lead" data-astro-cid-ex6yybm3>${dt("It is saved in this browser and also changes the language of the dashboard menus and messages.")}</p> <div class="pf-langs" role="group"${addAttribute(dt("Dashboard language"), "aria-label")} data-astro-cid-ex6yybm3> ${langs.map((l) => renderTemplate`<a${addAttribute(["pf-opt", { on: l.code === lang }], "class:list")}${addAttribute(`/dash/lang?to=${encodeURIComponent(l.code)}&next=${encodeURIComponent("/dash/preferences")}`, "href")}${addAttribute(l.code, "lang")}${addAttribute(l.code === lang ? "true" : void 0, "aria-current")} data-astro-cid-ex6yybm3> <img${addAttribute(l.flag, "src")} alt="" width="26" height="18" data-astro-cid-ex6yybm3> <span data-astro-cid-ex6yybm3>${l.label}</span> ${l.code === lang && renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17", "class": "pf-check", "data-astro-cid-ex6yybm3": true })}`} </a>`)} </div> </section> <section class="ac-card" data-astro-cid-ex6yybm3> <div class="ac-card-head" data-astro-cid-ex6yybm3><h2 data-astro-cid-ex6yybm3>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:palette-fill", "width": "16", "height": "16", "data-astro-cid-ex6yybm3": true })}${dt("Theme")}</h2></div> <p class="ac-lead" data-astro-cid-ex6yybm3>${dt("Dark, light, or the same as your device. The top bar toggle changes the same setting.")}</p> <div class="pf-themes" role="group"${addAttribute(dt("Theme"), "aria-label")} data-pf-themes data-astro-cid-ex6yybm3> ${themes.map((th) => renderTemplate`<button type="button" class="pf-opt pf-theme"${addAttribute(th.id, "data-theme-pick")} aria-pressed="false" data-astro-cid-ex6yybm3> ${renderComponent($$result2, "Icon", $$Icon, { "name": th.icon, "width": "18", "height": "18", "data-astro-cid-ex6yybm3": true })} <span data-astro-cid-ex6yybm3>${th.label}</span> </button>`)} </div> </section> <section class="ac-card" data-astro-cid-ex6yybm3> <div class="ac-card-head" data-astro-cid-ex6yybm3><h2 data-astro-cid-ex6yybm3>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-circle-fill", "width": "16", "height": "16", "data-astro-cid-ex6yybm3": true })}${dt("Your Petto profile")}</h2></div> <dl class="ac-rows" data-astro-cid-ex6yybm3> <div data-astro-cid-ex6yybm3><dt data-astro-cid-ex6yybm3>${dt("Personal prefix")}</dt><dd data-astro-cid-ex6yybm3>${prefix ? renderTemplate`<code class="ac-code" data-astro-cid-ex6yybm3>${prefix}</code>` : renderTemplate`<span class="pf-dim" data-astro-cid-ex6yybm3>${dt("Not set")}</span>`}</dd></div> <div data-astro-cid-ex6yybm3><dt data-astro-cid-ex6yybm3>${dt("Reputation")}</dt><dd data-astro-cid-ex6yybm3>${reputation ? reputation.points.toLocaleString(locale) : renderTemplate`<span class="pf-dim" data-astro-cid-ex6yybm3>${dt("None yet")}</span>`}${reputation && renderTemplate`<small data-astro-cid-ex6yybm3>${reputation.servers === 1 ? dt("In 1 server") : dt("In {a} servers", { a: reputation.servers })}</small>`}</dd></div> </dl> <p class="ac-muted pf-hint" data-astro-cid-ex6yybm3>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "14", "height": "14", "data-astro-cid-ex6yybm3": true })}<span data-astro-cid-ex6yybm3>${prefix ? dt("Change or remove your prefix in Discord with /myprefix.") : dt("Set your own prefix in Discord with /myprefix.")}</span></p> </section> <section class="ac-card" data-astro-cid-ex6yybm3> <div class="ac-card-head" data-astro-cid-ex6yybm3><h2 data-astro-cid-ex6yybm3>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise", "width": "16", "height": "16", "data-astro-cid-ex6yybm3": true })}${dt("Name history")}</h2><span${addAttribute(["ac-pill", { "is-active": !historyOff }], "class:list")} data-astro-cid-ex6yybm3>${historyOff ? dt("Not saving") : dt("Saving")}</span></div> <p class="ac-lead" data-astro-cid-ex6yybm3>${historyOff ? dt("Petto does not save your names, and nobody else can see your history.") : dt("Petto saves the names you use, and you can see them on the History page.")}</p> <div class="ac-btns" data-astro-cid-ex6yybm3><a class="btn btn-ghost btn-sm" href="/dash/history" data-sk="list" data-astro-cid-ex6yybm3>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise", "width": "13", "height": "13", "data-astro-cid-ex6yybm3": true })}${dt("Open history")}</a></div> </section> <section class="ac-card" data-astro-cid-ex6yybm3> <div class="ac-card-head" data-astro-cid-ex6yybm3><h2 data-astro-cid-ex6yybm3>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:envelope-simple-fill", "width": "16", "height": "16", "data-astro-cid-ex6yybm3": true })}${dt("Contact email")}</h2><span${addAttribute(["ac-pill", { "is-active": Boolean(contactEmail) }], "class:list")} data-astro-cid-ex6yybm3>${contactEmail ? dt("Saved") : dt("Not set")}</span></div> <p class="ac-lead" data-astro-cid-ex6yybm3>${dt("Optional. Petto may write to it about the policies and about what you asked to delete. Nobody else sees it, and you can delete it here at any time.")}</p> ${contactMessage && renderTemplate`<p${addAttribute(["pf-msg", { "is-bad": !contactMessage.ok }], "class:list")} role="status" data-astro-cid-ex6yybm3>${contactMessage.text}</p>`} <form method="POST" class="pf-contact" data-astro-cid-ex6yybm3> <input type="hidden" name="action" value="contact_save" data-astro-cid-ex6yybm3> <input type="email" name="email"${addAttribute(contactEmail ?? "", "value")} placeholder="you@example.com" maxlength="254" autocomplete="email" required${addAttribute(dt("Contact email"), "aria-label")} data-astro-cid-ex6yybm3> <button type="submit" class="btn btn-sm pf-save" data-astro-cid-ex6yybm3>${dt("Save")}</button> </form> ${user.discordEmail && user.discordEmail !== contactEmail && renderTemplate`<form method="POST" class="pf-contact-discord" data-astro-cid-ex6yybm3><input type="hidden" name="action" value="contact_discord" data-astro-cid-ex6yybm3><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-ex6yybm3>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:discord-logo-fill", "width": "13", "height": "13", "data-astro-cid-ex6yybm3": true })}${dt("Use the email of my Discord account")}</button><span class="pf-hint" data-astro-cid-ex6yybm3>${user.discordEmail}</span></form>`} ${contactEmail && renderTemplate`<form method="POST" class="pf-contact-remove" data-astro-cid-ex6yybm3><input type="hidden" name="action" value="contact_remove" data-astro-cid-ex6yybm3><button type="submit" class="btn btn-ghost btn-sm"${addAttribute(dt("Delete your contact email?"), "data-confirm")} data-astro-cid-ex6yybm3>${dt("Delete my email")}</button></form>`} </section> <section class="ac-card" data-astro-cid-ex6yybm3> <div class="ac-card-head" data-astro-cid-ex6yybm3><h2 data-astro-cid-ex6yybm3>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:browser-fill", "width": "16", "height": "16", "data-astro-cid-ex6yybm3": true })}${dt("This browser")}</h2></div> <p class="ac-lead" data-astro-cid-ex6yybm3>${dt("Your theme and how you sort your servers are kept only in this browser. You can forget them here.")}</p> <div class="ac-btns" data-astro-cid-ex6yybm3><button type="button" class="btn btn-ghost btn-sm" data-pf-reset${addAttribute(dt("Forgotten"), "data-done")} data-astro-cid-ex6yybm3>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-counter-clockwise-bold", "width": "13", "height": "13", "data-astro-cid-ex6yybm3": true })}<span data-astro-cid-ex6yybm3>${dt("Forget saved choices")}</span></button></div> </section> </div> ` }));
}, "/home/runner/work/petto-web/petto-web/src/components/DashPreferences.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Preferences = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Preferences;
  const dt = makeT(getDashLang(Astro2));
  const session = await getDashboardSession(Astro2);
  if (!session) {
    Astro2.cookies.set("petto_after_login", `${Astro2.url.pathname}${Astro2.url.search}`, { httpOnly: true, secure: Astro2.url.protocol === "https:", sameSite: "lax", path: "/", maxAge: 10 * 60 });
    return Astro2.redirect("/dash");
  }
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const EMAIL = /^[^\s@<>()\[\]\\,;:"]{1,64}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
  let contactMessage = null;
  if (Astro2.request.method === "POST" && apiUrl && apiKey) {
    const origin = Astro2.request.headers.get("origin");
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
    if (origin && origin !== Astro2.url.origin) contactMessage = { ok: false, text: dt("That could not be done. Try again in a moment.") };
    else if (action === "contact_save") {
      const email = String(form.get("email") ?? "").trim().toLowerCase();
      if (email.length < 5 || email.length > 254 || !EMAIL.test(email)) contactMessage = { ok: false, text: dt("That does not look like an email address.") };
      else {
        const res = await fetch(`${apiUrl}/rest/v1/user_contact?on_conflict=user_id`, { method: "POST", headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ user_id: session.userId, email, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) }).catch(() => null);
        contactMessage = res?.ok ? { ok: true, text: dt("Saved.") } : { ok: false, text: dt("That could not be done. Try again in a moment.") };
      }
    } else if (action === "contact_discord") {
      const email = session.discordEmail ?? "";
      if (!email || !EMAIL.test(email)) contactMessage = { ok: false, text: dt("Discord did not give a verified email. Type one instead.") };
      else {
        const res = await fetch(`${apiUrl}/rest/v1/user_contact?on_conflict=user_id`, { method: "POST", headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ user_id: session.userId, email, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) }).catch(() => null);
        contactMessage = res?.ok ? { ok: true, text: dt("Saved.") } : { ok: false, text: dt("That could not be done. Try again in a moment.") };
      }
    } else if (action === "contact_remove") {
      const res = await fetch(`${apiUrl}/rest/v1/user_contact?user_id=eq.${session.userId}`, { method: "DELETE", headers }).catch(() => null);
      contactMessage = res?.ok ? { ok: true, text: dt("Your email was deleted.") } : { ok: false, text: dt("That could not be done. Try again in a moment.") };
    }
  }
  const [personal, optout, contact] = await Promise.all([
    getPersonalSettings(Astro2, session.userId).catch(() => ({ prefix: null, reputation: null })),
    // Whether the account asked Petto not to save its name history (the switch of the History page).
    read(Astro2, "identity_history_optout", `user_id=eq.${session.userId}&select=user_id`),
    read(Astro2, "user_contact", `user_id=eq.${session.userId}&select=email`)
  ]);
  return renderTemplate`${renderComponent($$result, "DashPreferences", $$DashPreferences, { "user": session, "prefix": personal.prefix, "reputation": personal.reputation, "historyOff": optout.length > 0, "contactEmail": contact[0]?.email ?? null, "contactMessage": contactMessage })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/preferences.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/preferences.astro";
const $$url = "/dash/preferences";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Preferences,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
