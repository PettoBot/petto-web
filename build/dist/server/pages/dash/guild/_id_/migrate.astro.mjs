import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { B as BOTS, C as CHECKLISTS, M as MOVE_STEPS, F as FEATURE_PAGES } from '../../../../chunks/botMigration_D82Gx4id.mjs';
/* empty css                                            */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo } from '../../../../chunks/discord_CxeBz2tv.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashMigrate = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashMigrate;
  const { user, guildId, guildName, guildIcon, canRun } = Astro2.props;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const docsUrl = `https://wiki.petto.sbs${dashLang === "es" ? "/es" : dashLang === "pt-BR" ? "/pt-br" : ""}/guides/migrating-from-another-bot`;
  const base = `/dash/guild/${guildId}`;
  const STEP_TEXT = {
    "keep-both": { title: dt("Add Petto and keep the old bot on"), text: dt("Never switch the old one off first: for a few days both run, so the server is never left without moderation.") },
    "write-down": { title: dt("Write down what matters"), text: dt("Open the dashboard of the old bot and copy your texts, role menus, commands and channels. Petto cannot read the settings of another bot.") },
    "quick-setup": { title: dt("Run Quick Setup"), text: dt("It makes the log, auto moderation, welcome, auto role, tickets and verification in seven steps, and nothing changes until the last one."), page: "quick-setup" },
    "messages": { title: dt("Convert your messages"), text: dt("Paste each welcome, goodbye or custom text in the converter above and copy the result into its Petto page.") },
    "features": { title: dt("Rebuild the rest, one by one"), text: dt("Each row below is something the old bot does, with the page of Petto where it lives now.") },
    "test": { title: dt("Test each thing once"), text: dt("Send a test welcome, open a test ticket, trigger a test autoresponder. When it all works, remove the old bot.") },
    "remove-old": { title: dt("Remove the old bot"), text: dt("Only when everything works. Its history stays with it: Petto starts its own from the day you add it.") }
  };
  const FEATURE_TEXT = {
    "welcome": dt("Welcome and goodbye messages"),
    "reaction-roles": dt("Reaction roles"),
    "levels": dt("XP and levels"),
    "custom-commands": dt("Custom commands"),
    "autoresponders": dt("Autoresponders and automations"),
    "polls": dt("Polls"),
    "giveaways": dt("Giveaways"),
    "feeds": dt("Social alerts and feeds"),
    "birthdays": dt("Birthday messages"),
    "boards": dt("Starboard"),
    "timers": dt("Timers, reminders and automessages"),
    "voicemaster": dt("Temporary voice channels"),
    "moderation": dt("Moderation and case log"),
    "sticky-roles": dt("Sticky roles"),
    "automod": dt("Auto moderation"),
    "logging": dt("Logging"),
    "suggestions": dt("Suggestions"),
    "permissions": dt("Command permissions"),
    "sticky-messages": dt("Sticky messages"),
    "tickets": dt("Tickets"),
    "forms": dt("Forms"),
    "join-roles": dt("Roles for new members"),
    "prefix": dt("Custom prefix"),
    "embeds": dt("Embeds")
  };
  const NOT_MOVING = {
    mee6: [dt("MEE6 has an Economy plugin and Petto has no economy system. If your server runs on it, keep MEE6 for that."), dt("The XP of your members does not move by itself.")],
    carl: [dt("TagScript tags do not run in Petto: each tag has to be rewritten with Petto variables or Petto Code."), dt("The infractions and modlogs of the old bot stay there. Petto starts its own case log.")],
    dyno: [dt("Dyno commands and autoresponders have their own syntax: copy the text and rebuild the trigger in Petto."), dt("Autodelete and autopurge are Dyno modules: check Moderation rules and Timers before you switch them off.")],
    probot: [dt("Colors, Temp Links, Anti-Raid and VIP Protection of ProBot are not in this list: check the Security pages of Petto and rebuild them by hand."), dt("The XP of your members does not move by itself.")],
    nekotina: [dt("Only the welcome, the custom commands and the autoroles of Nekotina are in this list: the rest of the bot is not checked yet.")]
  };
  const HINTS = {
    "hash": dt("Discord image hashes have no equivalent. Use the variables with the full picture address (user avatar, server icon)."),
    "math": dt("Messages in Petto have no calculations. Write the result yourself."),
    "bot-joined": dt("Petto has no variable for the day the bot joined the server."),
    "mention-name": dt("Petto mentions by ID: write <@ and the ID of the person, then >."),
    "role-name": dt("Petto mentions a role by ID: write <@& and the ID of the role, then >."),
    "channel-name": dt("Petto links a channel by ID: write <# and the ID of the channel, then >, or use the variable of the current channel."),
    "no-equivalent": dt("Petto has no variable that gives this."),
    "command-argument": dt("The arguments of a Nekotina command are read in Petto with the variables of custom commands: look them up with !variables."),
    "unknown": dt("Petto does not know this variable. Look it up with !variables or leave it out.")
  };
  const AI_MODES = [
    { id: "rewrite", label: dt("Rewrite for Petto"), hint: dt("Paste a command, tag or autoresponder of the old bot and the AI rewrites it for Petto.") },
    { id: "plan", label: dt("What to set up"), hint: dt("Say what you had in the old bot (its modules, commands, roles) and the AI proposes what to set up in Petto.") },
    { id: "ask", label: dt("Ask a question"), hint: dt("Ask anything about moving to Petto.") }
  ];
  const bots = BOTS.map((bot) => ({ ...bot, checklist: CHECKLISTS[bot.id] }));
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "migrate", "pageTitle": dt("Migrate from another bot"), "data-astro-cid-6tqan2qr": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-6tqan2qr": true })} ${maybeRenderHead()}<div class="sx-page mg" data-migrate${addAttribute(guildId, "data-guild")}${addAttribute(dt("Copy the result"), "data-l-copy")}${addAttribute(dt("Copied"), "data-l-copied")} data-astro-cid-6tqan2qr> <div class="mg-head" data-astro-cid-6tqan2qr> <h1 data-astro-cid-6tqan2qr>${dt("Migrate from another bot")} <em class="mg-beta-tag" data-astro-cid-6tqan2qr>${dt("Beta")}</em></h1> <a class="btn btn-ghost btn-sm"${addAttribute(docsUrl, "href")} target="_blank" rel="noopener" data-astro-cid-6tqan2qr>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "13", "height": "13", "data-astro-cid-6tqan2qr": true })}${dt("Read the docs")}</a> </div> <p class="sx-lead" data-astro-cid-6tqan2qr>${dt("Move your server without a gap. A bot cannot read the settings of another one (Discord does not allow it), so Petto rewrites your messages here and keeps the list of what is left to rebuild.")}</p> <p class="mg-beta-note" data-astro-cid-6tqan2qr>${dt("This page is a beta: it is not finished. More variables and more help from the AI are coming.")}</p> <div class="mg-bots" role="tablist"${addAttribute(dt("Bot you come from"), "aria-label")} data-astro-cid-6tqan2qr> ${bots.map((bot, i) => renderTemplate`<button type="button" class="mg-bot" role="tab"${addAttribute(bot.id, "data-bot")}${addAttribute(i === 0 ? "true" : "false", "aria-selected")} data-astro-cid-6tqan2qr>${bot.name}</button>`)} </div> <div class="mg-unverified" data-unverified hidden data-astro-cid-6tqan2qr> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "15", "height": "15", "data-astro-cid-6tqan2qr": true })} <span data-astro-cid-6tqan2qr>${dt("The variables of this bot are not checked yet (its website does not let its documentation be read), so Petto does not guess: your text comes back exactly as you wrote it.")}</span> </div> <section class="sx-panel mg-box" data-astro-cid-6tqan2qr> <div class="sx-panel-head" data-astro-cid-6tqan2qr><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-6tqan2qr>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrows-left-right-fill", "width": "17", "height": "17", "data-astro-cid-6tqan2qr": true })}</span><h2 data-astro-cid-6tqan2qr>${dt("Convert a message")}</h2></div> <div class="mg-cols" data-astro-cid-6tqan2qr> <div class="sx-field" data-astro-cid-6tqan2qr> <div class="mg-lab" data-astro-cid-6tqan2qr><label for="mg-in" data-astro-cid-6tqan2qr>${dt("Message from the old bot")}</label></div> <textarea id="mg-in" class="dgl-autogrow" rows="4" spellcheck="false" data-in data-astro-cid-6tqan2qr></textarea> </div> <div class="sx-field" data-astro-cid-6tqan2qr> <div class="mg-lab" data-astro-cid-6tqan2qr> <label for="mg-out" data-astro-cid-6tqan2qr>${dt("Message for Petto")}</label> <button type="button" class="btn btn-ghost btn-sm mg-copy" data-copy data-astro-cid-6tqan2qr>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:copy-bold", "width": "13", "height": "13", "data-astro-cid-6tqan2qr": true })}<span data-copy-label data-astro-cid-6tqan2qr>${dt("Copy the result")}</span></button> </div> <textarea id="mg-out" class="dgl-autogrow" rows="4" spellcheck="false" readonly data-out data-astro-cid-6tqan2qr></textarea> </div> </div> <div class="mg-result" data-result hidden data-astro-cid-6tqan2qr> <div class="mg-block" data-changes-box hidden data-astro-cid-6tqan2qr> <h3 data-astro-cid-6tqan2qr>${dt("What changed")}</h3> <ul class="mg-changes" data-changes data-astro-cid-6tqan2qr></ul> </div> <div class="mg-block mg-bad" data-unsupported-box hidden data-astro-cid-6tqan2qr> <h3 data-astro-cid-6tqan2qr>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "14", "height": "14", "data-astro-cid-6tqan2qr": true })}${dt("Could not be converted")}</h3> <ul class="mg-unsupported" data-unsupported data-astro-cid-6tqan2qr></ul> </div> <div class="mg-block" data-preview-box hidden data-astro-cid-6tqan2qr> <h3 data-astro-cid-6tqan2qr>${dt("How it reads")}</h3> <p class="mg-preview" data-preview data-astro-cid-6tqan2qr></p> </div> </div> <div hidden data-astro-cid-6tqan2qr>${Object.entries(HINTS).map(([code, text]) => renderTemplate`<span${addAttribute(code, "data-hint")} data-astro-cid-6tqan2qr>${text}</span>`)}</div> </section> <section class="sx-panel mg-box" data-ai${addAttribute(canRun ? "1" : "0", "data-can-run")}${addAttribute(dt("Thinking\u2026"), "data-l-busy")}${addAttribute(dt("Copy"), "data-l-copy")}${addAttribute(dt("Copied"), "data-l-copied")}${addAttribute(dt("Could not reach Petto. Try again in a moment."), "data-l-failed")}${addAttribute(dt("The AI used variables Petto does not have. Check them before you paste:"), "data-l-unknown")} data-astro-cid-6tqan2qr> <div class="sx-panel-head" data-astro-cid-6tqan2qr><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-6tqan2qr>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sparkle-fill", "width": "17", "height": "17", "data-astro-cid-6tqan2qr": true })}</span><h2 data-astro-cid-6tqan2qr>${dt("AI helper")}</h2></div> ${!canRun && renderTemplate`<div class="mg-unverified" data-astro-cid-6tqan2qr>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "15", "height": "15", "data-astro-cid-6tqan2qr": true })}<span data-astro-cid-6tqan2qr>${dt("Only people with Manage Server can use the AI helper.")}</span></div>`} <div class="mg-bots" role="tablist"${addAttribute(dt("What should the AI do?"), "aria-label")} data-astro-cid-6tqan2qr> ${AI_MODES.map((mode, i) => renderTemplate`<button type="button" class="mg-bot" role="tab"${addAttribute(mode.id, "data-ai-mode")}${addAttribute(mode.hint, "data-hint")}${addAttribute(i === 0 ? "true" : "false", "aria-selected")} data-astro-cid-6tqan2qr>${mode.label}</button>`)} </div> <div class="sx-field" data-astro-cid-6tqan2qr> <label for="mg-ai-in" data-ai-hint data-astro-cid-6tqan2qr>${AI_MODES[0].hint}</label> <textarea id="mg-ai-in" class="dgl-autogrow" rows="4" maxlength="1500" spellcheck="false" data-ai-in${addAttribute(!canRun, "disabled")} data-astro-cid-6tqan2qr></textarea> </div> <div class="mg-ai-row" data-astro-cid-6tqan2qr> <button type="button" class="btn btn-accent" data-ai-send${addAttribute(!canRun, "disabled")} data-astro-cid-6tqan2qr>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sparkle-fill", "width": "13", "height": "13", "data-astro-cid-6tqan2qr": true })}${dt("Ask the AI")}</button> <span class="mg-ai-note" data-astro-cid-6tqan2qr>${dt("The AI only proposes: it never changes your server. It can be wrong, so read it before you use it. Your text is sent to an AI service (Groq) to get the answer and Petto does not store it.")}</span> </div> <p class="mg-ai-error" data-ai-error role="alert" hidden data-astro-cid-6tqan2qr></p> <div class="mg-block mg-bad" data-ai-unknown hidden data-astro-cid-6tqan2qr><h3 data-astro-cid-6tqan2qr>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "14", "height": "14", "data-astro-cid-6tqan2qr": true })}<span data-ai-unknown-title data-astro-cid-6tqan2qr></span></h3><ul class="mg-unsupported" data-ai-unknown-list data-astro-cid-6tqan2qr></ul></div> <div class="mg-answer" data-ai-answer hidden data-astro-cid-6tqan2qr></div> </section> <section class="sx-panel mg-box" data-astro-cid-6tqan2qr> <div class="sx-panel-head" data-astro-cid-6tqan2qr><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-6tqan2qr>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-6tqan2qr": true })}</span><h2 data-astro-cid-6tqan2qr>${dt("Checklist")}</h2><span class="sx-tag" data-progress data-astro-cid-6tqan2qr></span></div> ${bots.map((bot, i) => renderTemplate`<div class="mg-list"${addAttribute(bot.id, "data-list")}${addAttribute(i !== 0, "hidden")} data-astro-cid-6tqan2qr> <ol class="mg-items" data-astro-cid-6tqan2qr> ${MOVE_STEPS.filter((step) => step !== "features" || bot.checklist.length > 0).map((step) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-6tqan2qr": true }, { "default": async ($$result3) => renderTemplate` <li class="mg-item" data-astro-cid-6tqan2qr> <label class="mg-check" data-astro-cid-6tqan2qr><input type="checkbox"${addAttribute(`${bot.id}:${step}`, "data-item")} data-astro-cid-6tqan2qr><span class="mg-box-icon" data-astro-cid-6tqan2qr>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "18", "height": "18", "data-astro-cid-6tqan2qr": true })}</span> <span class="mg-text" data-astro-cid-6tqan2qr><b data-astro-cid-6tqan2qr>${STEP_TEXT[step].title}</b><em data-astro-cid-6tqan2qr>${STEP_TEXT[step].text}</em></span> </label> ${STEP_TEXT[step].page && renderTemplate`<a class="mg-go"${addAttribute(`${base}/${STEP_TEXT[step].page}`, "href")} data-astro-cid-6tqan2qr>${dt("Open")}</a>`} </li> ${step === "features" && bot.checklist.map((feature) => renderTemplate`<li class="mg-item mg-sub" data-astro-cid-6tqan2qr> <label class="mg-check" data-astro-cid-6tqan2qr><input type="checkbox"${addAttribute(`${bot.id}:f:${feature}`, "data-item")} data-astro-cid-6tqan2qr><span class="mg-box-icon" data-astro-cid-6tqan2qr>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "18", "height": "18", "data-astro-cid-6tqan2qr": true })}</span> <span class="mg-text" data-astro-cid-6tqan2qr><b data-astro-cid-6tqan2qr>${FEATURE_TEXT[feature]}</b></span> </label> <a class="mg-go"${addAttribute(`${base}/${FEATURE_PAGES[feature]}`, "href")} data-astro-cid-6tqan2qr>${dt("Open")}</a> </li>`)}` })}`)} </ol> ${(NOT_MOVING[bot.id] ?? []).length > 0 && renderTemplate`<div class="mg-block" data-astro-cid-6tqan2qr> <h3 data-astro-cid-6tqan2qr>${dt("What does not move")}</h3> <ul class="mg-notes" data-astro-cid-6tqan2qr>${NOT_MOVING[bot.id].map((text) => renderTemplate`<li data-astro-cid-6tqan2qr>${text}</li>`)}</ul> </div>`} </div>`)} </section> </div> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashMigrate.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Migrate = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Migrate;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const guildInfo = await getGuildInfo(id, botToken);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const canRun = !auth.devView && !auth.access;
  return renderTemplate`${renderComponent($$result, "DashMigrate", $$DashMigrate, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "canRun": canRun })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/migrate.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/migrate.astro";
const $$url = "/dash/guild/[id]/migrate";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Migrate,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
