import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { m as makeT, g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                            */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { j as getGuildInfo } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashEconomy = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashEconomy;
  const dt = makeT(getDashLang(Astro2));
  const { user, guildId, guildName, guildIcon } = Astro2.props;
  const coins = [
    { id: "bronze", name: dt("Bronze coin"), line: dt("The coin of every day.") },
    { id: "silver", name: dt("Silver coin"), line: dt("200 bronze coins make one.") },
    { id: "gold", name: dt("Gold coin"), line: dt("100 silver coins make one.") },
    { id: "mithril", name: dt("Mithril coin"), line: dt("50 gold coins make one. The magic metal of the fantasy stories.") }
  ];
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "economy", "pageTitle": "Economy" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="ec-hero"> <div class="ec-hero-text"> <span class="ec-soon">${dt("Soon")}</span> <h2>${dt("Economy")}</h2> <p>${dt("This is a preview. Nothing on this page works or is saved yet, but this is how it will look when it is ready.")}</p> </div> <div class="ec-hero-coins" aria-hidden="true"> ${["bronze", "silver", "gold", "mithril"].map((id) => renderTemplate`<img${addAttribute(`/assets/economy/${id}.webp`, "src")} alt="" width="256" height="256">`)} </div> </section> <h3 class="ec-h">${dt("The four coins of the global economy")}</h3> <div class="ec-coins"> ${coins.map((coin) => renderTemplate`<article class="ec-coin"> <img${addAttribute(`/assets/economy/${coin.id}.webp`, "src")} alt="" width="256" height="256" loading="lazy"> <h4>${coin.name}</h4> <p>${coin.line}</p> </article>`)} </div> <div class="ec-chain"${addAttribute(dt("How the coins change"), "aria-label")}> ${[["bronze", 200, "silver", 1], ["silver", 100, "gold", 1], ["gold", 50, "mithril", 1], ["mithril", 100, "", 1]].map(([from, n, to, m]) => renderTemplate`<div class="ec-step"> <span class="ec-chip"><img${addAttribute(`/assets/economy/${from}.webp`, "src")} alt="" width="32" height="32"><b>${n}</b></span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "width": "18", "height": "18" })} <span class="ec-chip">${to ? renderTemplate`<img${addAttribute(`/assets/economy/${to}.webp`, "src")} alt="" width="32" height="32">` : renderTemplate`<i class="bd-coin"></i>`}<b>${m}${to ? "" : ` ${dt("ceramo")}`}</b></span> </div>`)} </div> <p class="ec-note">${dt("A person can change coins into ceramos and ceramos into coins, so ceramos can also be earned by playing and not only bought. Ceramos are used for the badges, banners and fonts of the profile.")}</p> <div class="ec-two"> <article class="ec-card"> <header><h3>${dt("Global economy")}</h3><span class="ec-pill">${dt("Soon")}</span></header> <p>${dt("The four coins are the same in every server that uses it, and the streaks of a person go with them everywhere.")}</p> <p class="ec-switch"><span class="ec-knob"></span>${dt("Use the global economy in this server")}</p> <p class="ec-small">${dt("If you turn it off, the members of your server keep their coins and their streaks everywhere else.")}</p> </article> <article class="ec-card"> <header><h3>${dt("Economy of your server")}</h3><span class="ec-pill">${dt("Soon")}</span></header> <p>${dt("Create your own system: your coin, jobs, a shop with your roles and rewards for your members, like the economy bots, but part of Petto.")}</p> <p class="ec-switch"><span class="ec-knob"></span>${dt("Use the economy of this server")}</p> <p class="ec-small">${dt("We are still designing it. Tell us what you would want in the feedback page.")}</p> </article> </div> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashEconomy.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Economy = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Economy;
  const { id } = Astro2.params;
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const guildInfo = botToken ? await getGuildInfo(id, botToken) : null;
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=server_not_configured");
  return renderTemplate`${renderComponent($$result, "DashEconomy", $$DashEconomy, { "user": auth.session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp" })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/economy.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/economy.astro";
const $$url = "/dash/guild/[id]/economy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Economy,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
