import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, u as unescapeHTML, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                                */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashQuickSetup = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashQuickSetup;
  const { user, guildId, guildName, guildIcon, channels, roles, canRun } = Astro2.props;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const docsUrl = `https://wiki.petto.sbs${dashLang === "es" ? "/es" : dashLang === "pt-BR" ? "/pt-br" : ""}/setup/quick-setup`;
  const MODULES = [
    { id: "moderation", icon: "ph:shield-check-fill", name: dt("Moderation"), text: dt("A private log of every sanction and change, so your team sees who did what.") },
    { id: "automod", icon: "ph:funnel-fill", name: dt("Auto moderation"), text: dt("Petto removes spam, scam links and invites before anyone has to.") },
    { id: "welcome", icon: "ph:hand-waving-fill", name: dt("Welcome messages"), text: dt("Greet new members in a channel, and say goodbye if you want.") },
    { id: "autorole", icon: "ph:user-plus-fill", name: dt("Auto role"), text: dt("Every new member gets a role by itself.") },
    { id: "tickets", icon: "ph:ticket-fill", name: dt("Tickets"), text: dt("A panel where members open a private ticket for your staff.") },
    { id: "verification", icon: "ph:seal-check-fill", name: dt("Verification"), text: dt("New members prove they are real before they see the server.") }
  ];
  const STEPS = [dt("Modules"), dt("Moderation"), dt("Auto moderation"), dt("Welcome messages"), dt("Auto role and verification"), dt("Tickets"), dt("Review")];
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "quick-setup", "pageTitle": dt("Quick Setup") }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", " ", '<div class="qs" data-qs', "", '> <header class="qs-head"> <h1>', '</h1> <a class="btn btn-sm"', ' target="_blank" rel="noopener">', "", "</a> </header> ", ' <div class="qs-layout"> <section class="qs-card"> <div class="qs-progress" aria-hidden="true"><span data-qs-bar></span></div> <p class="qs-step-label"><span data-qs-n>1</span> / 7 \xB7 <b data-qs-title>', '</b></p> <div class="qs-panel" data-step="1"> <h2>', '</h2> <p class="qs-lead">', '</p> <div class="qs-modules"> ', ' </div> </div> <div class="qs-panel" data-step="2" hidden> <h2>', '</h2> <p class="qs-off" data-off="moderation">', '</p> <div data-on="moderation"> <p class="qs-lead">', '</p> <label class="qs-field"><span>', '</span> <select data-field="moderation.log_channel"> <option value="new">', "</option> ", ' </select> </label> <p class="qs-hint">', '</p> </div> </div> <div class="qs-panel" data-step="3" hidden> <h2>', '</h2> <p class="qs-off" data-off="automod">', '</p> <div data-on="automod" class="qs-checks"> <label class="sx-switch"><input type="checkbox" data-field="automod.spam" checked><span class="sx-switch-text"><b>', "</b><em>", '</em></span><span class="sx-toggle" aria-hidden="true"></span></label> <label class="sx-switch"><input type="checkbox" data-field="automod.invites" checked><span class="sx-switch-text"><b>', "</b><em>", '</em></span><span class="sx-toggle" aria-hidden="true"></span></label> <label class="sx-switch"><input type="checkbox" data-field="automod.scam" checked><span class="sx-switch-text"><b>', "</b><em>", '</em></span><span class="sx-toggle" aria-hidden="true"></span></label> <label class="sx-switch"><input type="checkbox" data-field="automod.links"><span class="sx-switch-text"><b>', "</b><em>", '</em></span><span class="sx-toggle" aria-hidden="true"></span></label> </div> </div> <div class="qs-panel" data-step="4" hidden> <h2>', '</h2> <p class="qs-off" data-off="welcome">', '</p> <div data-on="welcome"> <label class="qs-field"><span>', '</span> <select data-field="welcome.channel"> <option value="new">', "</option> ", ' </select> </label> <label class="qs-field"><span>', '</span> <textarea data-field="welcome.message" rows="4" maxlength="1800"', '></textarea> </label> <p class="qs-hint">', '</p> <label class="sx-switch"><input type="checkbox" data-field="welcome.goodbye"><span class="sx-switch-text"><b>', "</b><em>", '</em></span><span class="sx-toggle" aria-hidden="true"></span></label> </div> </div> <div class="qs-panel" data-step="5" hidden> <h2>', '</h2> <p class="qs-off" data-off="autorole">', '</p> <div data-on="autorole"> <label class="qs-field"><span>', '</span> <select data-field="autorole.role"> <option value="new">', "</option> ", ' </select> </label> <p class="qs-hint">', '</p> </div> <p class="qs-off" data-off="verification">', '</p> <p class="qs-note" data-on="verification">', " ", '</p> </div> <div class="qs-panel" data-step="6" hidden> <h2>', '</h2> <p class="qs-off" data-off="tickets">', '</p> <div data-on="tickets"> <label class="qs-field"><span>', '</span> <select data-field="tickets.channel"> <option value="new">', "</option> ", ' </select> </label> <label class="qs-field"><span>', '</span> <select data-field="tickets.support_role"> <option value="new">', "</option> ", ' </select> </label> <p class="qs-hint">', '</p> </div> </div> <div class="qs-panel" data-step="7" hidden> <h2>', '</h2> <p class="qs-lead">', '</p> <ul class="qs-review" data-qs-review></ul> <div class="qs-results" data-qs-results hidden></div> </div> <footer class="qs-nav"> <button class="btn btn-ghost" type="button" data-qs-back disabled>', '</button> <span class="qs-nav-right"> <button class="btn btn-ghost" type="button" data-qs-skip>', '</button> <button class="btn btn-accent" type="button" data-qs-next>', '</button> <button class="btn btn-accent" type="button" data-qs-apply hidden', ">", " ", '</button> </span> </footer> </section> <aside class="qs-side"> <div class="qs-side-card"> <h3>', '</h3> <ul class="qs-summary" data-qs-summary> ', ' </ul> </div> <div class="qs-side-card"> <p>', " ", "</p> <p>", " ", "</p> <p>", " ", "</p> <p>", " <a", ' target="_blank" rel="noopener">', '</a></p> </div> </aside> </div> <script type="application/json" data-qs-i18n>', "<\/script> </div> "])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, {}), renderComponent($$result2, "DashFormKit", $$DashFormKit, {}), maybeRenderHead(), addAttribute(guildId, "data-guild"), addAttribute(canRun ? "1" : "0", "data-can-run"), dt("Quick Setup"), addAttribute(docsUrl, "href"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "13", "height": "13" }), dt("Read the docs"), !canRun && renderTemplate`<div class="qs-flash qs-flash-warn">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "15", "height": "15" })}${dt("Only people with Manage Server can run Quick Setup. You can look at the steps.")}</div>`, STEPS[0], dt("Choose what to set up"), dt("Turn on the modules you want. Each one has its own step with a few questions, and you can change all of it later from its page."), MODULES.map((m) => renderTemplate`<label class="sx-switch qs-module"> <input type="checkbox"${addAttribute(m.id, "data-module")}> <span class="sx-switch-text"><b>${renderComponent($$result2, "Icon", $$Icon, { "name": m.icon, "width": "15", "height": "15" })} ${m.name}</b><em>${m.text}</em></span> <span class="sx-toggle" aria-hidden="true"></span></label>`), dt("Moderation"), dt("This module is off. Turn it on in the first step, or go on to the next one."), dt("Petto writes sanctions, auto moderation hits and changes of members, roles, channels and the server in one log channel."), dt("Log channel"), dt("Create a new private channel (#mod-log)"), channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}>#${c.name}</option>`), dt("A new channel is hidden from everyone but Petto and the people who can see all channels. Add your moderators to it afterwards."), dt("Auto moderation"), dt("This module is off. Turn it on in the first step, or go on to the next one."), dt("Spam"), dt("The same message again and again, too many mentions, shouting and invites."), dt("Invites to other servers"), dt("Petto deletes them."), dt("Scam text"), dt("Fake gifts and Nitro, wallet phrases and the like. Petto deletes them."), dt("All links"), dt("Off by default: it also deletes good links. You can allow some domains later."), dt("Welcome messages"), dt("This module is off. Turn it on in the first step, or go on to the next one."), dt("Welcome channel"), dt("Create a new channel (#welcome)"), channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}>#${c.name}</option>`), dt("Message"), addAttribute(dt("Welcome {user.mention} to {server.name}!"), "placeholder"), dt("You can use variables like {user.mention}, {user.name} and {server.name}. Leave it empty for the default message."), dt("Also say goodbye"), dt("A message in the same channel when someone leaves."), dt("Auto role and verification"), dt("Auto role is off. Turn it on in the first step, or go on to the next one."), dt("Role for new members"), dt("Create a new role (Member)"), roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}>@${r.name}</option>`), dt("Petto can only give roles that are below its own highest role. If it cannot, the review tells you."), dt("Verification is off. Turn it on in the first step if you want it."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:seal-check-fill", "width": "15", "height": "15" }), dt("Verification will make its roles, its channel and its panel for you. It edits the channels of the server, so it can take a moment and it keeps working after Quick Setup ends."), dt("Tickets"), dt("This module is off. Turn it on in the first step, or go on to the next one."), dt("Channel for the ticket panel"), dt("Create a new channel (#open-a-ticket)"), channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}>#${c.name}</option>`), dt("Role of your staff"), dt("Create a new role (Support)"), roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}>@${r.name}</option>`), dt("Members press a button on the panel and Petto opens a private channel for them and this role. Questions, forms and more types are in the Tickets page."), dt("Review and apply"), dt("Nothing has changed in your server yet. This is what Petto will do when you press the button."), dt("Back"), dt("Skip for now"), dt("Next"), addAttribute(!canRun, "disabled"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13" }), dt("Apply Quick Setup"), dt("Your setup"), MODULES.map((m) => renderTemplate`<li${addAttribute(m.id, "data-sum")}>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:circle-dashed", "width": "14", "height": "14" })}<span>${m.name}</span></li>`), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-fill", "width": "14", "height": "14" }), dt("Takes about a minute."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lock-simple-fill", "width": "14", "height": "14" }), dt("Nothing changes in your server until the last step."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-counter-clockwise-fill", "width": "14", "height": "14" }), dt("You can run it again any time from the sidebar."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "14", "height": "14" }), addAttribute(docsUrl, "href"), dt("Read the docs"), unescapeHTML(JSON.stringify({
    steps: STEPS,
    on: dt("On"),
    off: dt("Off"),
    working: dt("Setting up\u2026"),
    failed: dt("Petto did not answer. Try again in a moment."),
    done: dt("Done. Everything that worked is already in your server."),
    partial: dt("Some steps did not work. The rest is done."),
    modules: Object.fromEntries(MODULES.map((m) => [m.id, m.name])),
    review: {
      moderation: dt("Moderation log in {channel}."),
      automod: dt("Auto moderation: {list}."),
      welcome: dt("Welcome messages in {channel}{goodbye}."),
      goodbye: dt(" and goodbye messages"),
      autorole: dt("New members get {role}."),
      tickets: dt("Tickets: the panel in {channel}, answered by {role}."),
      verification: dt("Verification with its own roles, channel and panel."),
      newChannel: dt("a new channel"),
      newRole: dt("a new role"),
      spam: dt("spam"),
      invites: dt("invites"),
      scam: dt("scam text"),
      links: dt("all links"),
      none: dt("Turn on at least one module in the first step.")
    }
  }))) })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashQuickSetup.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$QuickSetup = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$QuickSetup;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const [guildInfo, rolesRes, channelsRes] = await Promise.all([getGuildInfo(id, botToken), getGuildList(Astro2, id, botToken, "roles"), getGuildList(Astro2, id, botToken, "channels")]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const allRoles = rolesRes.ok ? await rolesRes.json().catch(() => []) : [];
  const allChannels = channelsRes.ok ? await channelsRes.json().catch(() => []) : [];
  const channels = allChannels.filter((c) => c.type === 0 || c.type === 5).sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0)).map((c) => ({ id: String(c.id), name: String(c.name) }));
  const roles = allRoles.filter((r) => String(r.id) !== id && !r.managed).sort((a, b) => Number(b.position ?? 0) - Number(a.position ?? 0)).map((r) => ({ id: String(r.id), name: String(r.name) }));
  const canRun = !auth.devView && !auth.access;
  return renderTemplate`${renderComponent($$result, "DashQuickSetup", $$DashQuickSetup, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "channels": channels, "roles": roles, "canRun": canRun })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/quick-setup.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/quick-setup.astro";
const $$url = "/dash/guild/[id]/quick-setup";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$QuickSetup,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
