import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, b as addAttribute, u as unescapeHTML, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { h as hiddenChannelSet, g as goneChannelLabel } from '../../../../chunks/channelLabel_899ww5-9.mjs';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from '../../../../chunks/dash_CORIPvM-.mjs';
import { a as agoText } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
/* empty css                                             */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { E as callPettoHoneypot } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { g as getMemberProfiles, m as memberAvatarUrl } from '../../../../chunks/memberNames_skiCoAs8.mjs';
import { w as withinBudget } from '../../../../chunks/liveCall_BSZ7MViH.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashHoneypot = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashHoneypot;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, honeypots, freeChannels, embedNames, catches, ready, message } = Astro2.props;
  const hiddenChannels = await hiddenChannelSet(guildId);
  const goneChannel = (id, goneKey) => goneChannelLabel(dt, hiddenChannels, id, goneKey);
  const punishments = [
    { id: "softban", label: dt("Softban (recommended)"), hint: dt("Removes them and deletes their messages of the last day. They can join again."), text: dt("a softban") },
    { id: "ban", label: dt("Ban"), hint: dt("Removes them for good and deletes their messages of the last day."), text: dt("a ban") },
    { id: "kick", label: dt("Kick"), hint: dt("Removes them. Their messages stay and they can join again."), text: dt("a kick") }
  ];
  const punishmentText = (id) => punishments.find((p) => p.id === id)?.text ?? punishments[0].text;
  const punishmentLabel = (id) => ({ softban: dt("Softban"), ban: dt("Ban"), kick: dt("Kick") })[id] ?? id;
  const docsUrl = `https://wiki.petto.sbs${dashLang === "es" ? "/es" : dashLang === "pt-BR" ? "/pt-br" : ""}/moderation/honeypot`;
  const totalCaught = honeypots.reduce((sum, h) => sum + h.caught, 0);
  const totalTriggers = honeypots.reduce((sum, h) => sum + h.messages, 0);
  const since = (iso) => agoText(dt, iso, { locale: dashLocale(dashLang) });
  const panelWords = {
    title: dt("DO NOT SEND MESSAGES IN THIS CHANNEL"),
    body: dt("This channel is used to catch spam bots. Any messages sent here will result in {punishment}."),
    button: dt("Kicks: {count}"),
    punishments: Object.fromEntries(punishments.map((p) => [p.id, p.text]))
  };
  const when = (iso) => {
    const date = new Date(iso);
    return Number.isFinite(date.getTime()) ? date.toLocaleString(dashLang, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
  };
  const acChannels = [...freeChannels, ...honeypots.filter((h) => h.channelName).map((h) => ({ id: h.channelId, name: h.channelName }))];
  const honeypotVars = JSON.stringify([{ l: dt("Honeypot"), v: [["{honeypot.action}", dt("What happens to who writes there")], ["{honeypot.count}", dt("Members caught")], ["{honeypot.channel}", dt("The bait channel")]] }]).replace(/</g, "\\u003c");
  const modeLabel = (h) => h.mode === "none" ? dt("Nothing posted") : h.mode === "custom" ? h.template ? dt("Saved embed: {name}", { name: h.template }) : dt("Your text") : dt("Petto's normal panel");
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "honeypot", "pageTitle": dt("Honeypot"), "data-astro-cid-iau2qw2f": true }, { "default": async ($$result2) => renderTemplate(_b || (_b = __template([" ", " ", " ", '<div class="hp" data-honeypot', ' data-astro-cid-iau2qw2f> <header class="hp-head" data-astro-cid-iau2qw2f> <h1 data-astro-cid-iau2qw2f>', '</h1> <a class="btn btn-sm hp-docs"', ' target="_blank" rel="noopener" data-astro-cid-iau2qw2f>', "", "</a> </header> ", " ", " ", " ", " ", " ", ' <section class="hp-add" data-astro-cid-iau2qw2f> <h2 data-astro-cid-iau2qw2f>', '</h2> <form method="POST" class="hp-add-form" data-no-dirty data-astro-cid-iau2qw2f> <input type="hidden" name="action" value="add" data-astro-cid-iau2qw2f> <div class="sx-field hp-add-channel" data-astro-cid-iau2qw2f><label for="hp-add-channel" data-astro-cid-iau2qw2f>', '</label> <select id="hp-add-channel" name="channel_id" required data-astro-cid-iau2qw2f> <option value="" data-astro-cid-iau2qw2f>', "</option> ", ' </select> </div> <div class="sx-field" data-astro-cid-iau2qw2f><span class="sx-label" data-astro-cid-iau2qw2f>', '</span> <div class="dfx-chips" data-astro-cid-iau2qw2f>', '</div> </div> <button class="btn btn-accent btn-sm" type="submit"', " data-astro-cid-iau2qw2f>", "", '</button> </form> <p class="hp-hint" data-astro-cid-iau2qw2f>', "</p> </section> ", " ", ' <p class="hp-hint hp-cmd" data-astro-cid-iau2qw2f>', `</p> </div> <script>
      // Runs on every arrival of the page: a full load, a move from the menu (the dashboard swaps the content in and runs the scripts
      // inside it) and every redraw after a save or a live update. What shows and hides (the custom message, the invite back, the
      // previews) is CSS on the checked inputs, so it is right before this runs; this only writes the punishment into the preview,
      // through one listener for the whole document (bound once, so nothing doubles).
      (function () {
        var root = document.querySelector('[data-honeypot]');
        if (!root) return;
        var words = {};
        try { words = JSON.parse(root.getAttribute('data-words') || '{}'); } catch (e) { words = {}; }
        var escape = function (text) { return String(text).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
        var update = function (card) {
          var mode = card.querySelector('[data-hp-mode]:checked');
          var punishment = card.querySelector('[data-hp-punishment]:checked');
          card.setAttribute('data-mode', mode ? mode.value : 'default');
          card.setAttribute('data-punishment', punishment ? punishment.value : 'softban');
          var text = card.querySelector('[data-hp-panel-text]');
          var word = (words.punishments || {})[punishment ? punishment.value : 'softban'] || '';
          if (text) text.innerHTML = escape(words.body || '').replace('{punishment}', '<strong>' + escape(word) + '</strong>');
        };
        window.__hpUpdate = update;
        root.querySelectorAll('[data-hp-card]').forEach(update);
        if (!window.__hpBound) {
          window.__hpBound = true;
          var onChange = function (event) {
            var card = event.target && event.target.closest ? event.target.closest('[data-honeypot] [data-hp-card]') : null;
            if (card && window.__hpUpdate) window.__hpUpdate(card);
          };
          document.addEventListener('change', onChange);
          // Discarding the changes resets the form without change events.
          document.addEventListener('reset', function (event) { setTimeout(function () { onChange(event); }, 0); }, true);
        }
        // The answer of a save says what happened; the live update that follows a moment later (the bot changed the channel) redraws
        // the page without it, so the message is kept on screen for a few seconds.
        var flash = root.querySelector('[data-hp-flash]');
        var kept = window.__hpFlash;
        if (flash) {
          var copy = flash.cloneNode(true);
          copy.removeAttribute('data-hp-flash');
          window.__hpFlash = { path: location.pathname, html: copy.outerHTML, at: Date.now() };
        }
        else if (kept && kept.path === location.pathname && Date.now() - kept.at < 8000) {
          var head = root.querySelector('.hp-head');
          if (head) head.insertAdjacentHTML('afterend', kept.html);
        }
      })();
    <\/script> `])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-iau2qw2f": true }), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-iau2qw2f": true }), maybeRenderHead(), addAttribute(JSON.stringify(panelWords), "data-words"), dt("Honeypot"), addAttribute(docsUrl, "href"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "13", "height": "13", "data-astro-cid-iau2qw2f": true }), dt("Read the docs"), honeypots.length > 0 && renderTemplate(_a || (_a = __template(['<script type="application/json" data-var-groups>', "<\/script>"])), unescapeHTML(honeypotVars)), honeypots.length > 0 && renderTemplate`${renderComponent($$result2, "DashAcData", $$DashAcData, { "channels": acChannels, "data-astro-cid-iau2qw2f": true })}`, message && renderTemplate`<div${addAttribute(["hp-flash", { "hp-flash-err": message.kind === "err" }], "class:list")} role="status" data-hp-flash data-astro-cid-iau2qw2f>${renderComponent($$result2, "Icon", $$Icon, { "name": message.kind === "ok" ? "ph:check-circle-fill" : "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-iau2qw2f": true })}${message.text}</div>`, !ready && renderTemplate`<div class="hp-flash hp-flash-warn" data-astro-cid-iau2qw2f>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15", "data-astro-cid-iau2qw2f": true })}${dt("The honeypot settings could not be read. Try again in a moment.")}</div>`, honeypots.length > 0 && renderTemplate`${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Bait channels"), value: honeypots.length, tone: "invites" },
    { label: dt("Members caught"), value: totalCaught, tone: "leaves" },
    { label: dt("Trap triggers"), value: totalTriggers, tone: "messages" },
    { label: dt("Last catch"), value: 0, text: catches[0] ? since(catches[0].at) : "\u2014", tone: "voice" }
  ], "data-astro-cid-iau2qw2f": true })}`, honeypots.length === 0 && renderTemplate`<section class="hp-empty" data-astro-cid-iau2qw2f> <img src="/assets/petto-honeypot.webp" alt="" width="96" height="92" loading="lazy" data-astro-cid-iau2qw2f> <div data-astro-cid-iau2qw2f> <h2 data-astro-cid-iau2qw2f>${dt("What is a honeypot?")}</h2> <p data-astro-cid-iau2qw2f>${dt('It is a trap for spam bots. You make a channel (for example #do-not-write) and Petto posts a big warning in it: "do not send messages here".')}</p> <ol data-astro-cid-iau2qw2f> <li data-astro-cid-iau2qw2f>${dt("People read the warning and never write there.")}</li> <li data-astro-cid-iau2qw2f>${dt("Spam bots and hacked accounts do not read: they post the same scam link in every channel.")}</li> <li data-astro-cid-iau2qw2f>${dt("The moment one posts in the bait channel, Petto deletes the message and removes the account (softban, ban or kick), and writes a case.")}</li> </ol> </div> </section>`, honeypots.length ? dt("Add a bait channel") : dt("Set up your first honeypot"), dt("Channel"), dt("Choose a channel"), freeChannels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-iau2qw2f>#${c.name}</option>`), dt("What happens to who posts there"), punishments.map((p) => renderTemplate`<label class="dfx-chip"${addAttribute(p.hint, "title")} data-astro-cid-iau2qw2f><input type="radio" name="punishment"${addAttribute(p.id, "value")}${addAttribute(p.id === "softban", "checked")} data-astro-cid-iau2qw2f>${p.label}</label>`), addAttribute(!ready || !freeChannels.length, "disabled"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-iau2qw2f": true }), dt("Add honeypot"), dt("Use an empty channel members can see. Petto needs View Channel, Send Messages, Read Message History and Manage Messages there, and posts the warning at once."), honeypots.map((h) => {
    const href = h.panelMessageId ? `https://discord.com/channels/${guildId}/${h.channelId}/${h.panelMessageId}` : null;
    const exists = Boolean(h.channelName);
    return renderTemplate`<article class="hp-card" data-hp-card${addAttribute(h.mode, "data-mode")}${addAttribute(h.punishment, "data-punishment")}${addAttribute(`hp-${h.channelId}`, "id")} data-astro-cid-iau2qw2f> <header class="hp-card-head" data-astro-cid-iau2qw2f> <div class="hp-card-title" data-astro-cid-iau2qw2f> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hash-bold", "width": "16", "height": "16", "data-astro-cid-iau2qw2f": true })} <b data-astro-cid-iau2qw2f>${h.channelName ?? goneChannel(h.channelId, "Deleted channel")}</b> <span${addAttribute(["hp-tag", `hp-tag-${h.punishment}`], "class:list")} data-astro-cid-iau2qw2f>${punishmentLabel(h.punishment)}</span> </div> <div class="hp-card-meta" data-astro-cid-iau2qw2f> <span class="hp-count" data-astro-cid-iau2qw2f>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:bug-fill", "width": "12", "height": "12", "data-astro-cid-iau2qw2f": true })}<b data-astro-cid-iau2qw2f>${h.caught.toLocaleString(dashLang)}</b> ${h.caught === 1 ? dt("member caught") : dt("members caught")}</span> <span${addAttribute(["hp-state", { "hp-state-off": !h.panelMessageId }], "class:list")} data-astro-cid-iau2qw2f> ${h.mode === "none" ? dt("Nothing posted") : h.panelMessageId ? renderTemplate`<a${addAttribute(href, "href")} target="_blank" rel="noopener" data-astro-cid-iau2qw2f>${modeLabel(h)} ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-square-out-bold", "width": "11", "height": "11", "data-astro-cid-iau2qw2f": true })}</a>` : dt("The message is not posted")} </span> </div> </header> ${!exists && renderTemplate`<p class="hp-gone" data-astro-cid-iau2qw2f>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "14", "height": "14", "data-astro-cid-iau2qw2f": true })}${dt("This channel was deleted in Discord. Remove the honeypot or make it again in another channel.")}</p>`} <div class="hp-body" data-astro-cid-iau2qw2f> <form method="POST" class="hp-form" data-hp-form data-astro-cid-iau2qw2f> <input type="hidden" name="action" value="save" data-astro-cid-iau2qw2f> <input type="hidden" name="channel_id"${addAttribute(h.channelId, "value")} data-astro-cid-iau2qw2f> <input type="hidden" name="member_settings" value="1" data-astro-cid-iau2qw2f> <fieldset class="hp-group" data-astro-cid-iau2qw2f> <legend data-astro-cid-iau2qw2f><span class="hp-step" data-astro-cid-iau2qw2f>1</span>${dt("Punishment")}</legend> <div class="hp-options" data-astro-cid-iau2qw2f> ${punishments.map((p) => renderTemplate`<label class="hp-option" data-astro-cid-iau2qw2f><input type="radio" name="punishment"${addAttribute(p.id, "value")}${addAttribute(p.id === h.punishment, "checked")} data-hp-punishment data-astro-cid-iau2qw2f><span data-astro-cid-iau2qw2f><b data-astro-cid-iau2qw2f>${p.label}</b><em data-astro-cid-iau2qw2f>${p.hint}</em></span></label>`)} </div> </fieldset> <fieldset class="hp-group" data-astro-cid-iau2qw2f> <legend data-astro-cid-iau2qw2f><span class="hp-step" data-astro-cid-iau2qw2f>2</span>${dt("Message in the channel")}</legend> <div class="hp-modes" data-astro-cid-iau2qw2f> <label class="hp-mode" data-astro-cid-iau2qw2f><input type="radio" name="mode" value="default"${addAttribute(h.mode === "default", "checked")} data-hp-mode data-astro-cid-iau2qw2f><span data-astro-cid-iau2qw2f>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-warning-fill", "width": "15", "height": "15", "data-astro-cid-iau2qw2f": true })}<b data-astro-cid-iau2qw2f>${dt("Petto's normal panel")}</b><em data-astro-cid-iau2qw2f>${dt("The warning with the picture and the count.")}</em></span></label> <label class="hp-mode" data-astro-cid-iau2qw2f><input type="radio" name="mode" value="custom"${addAttribute(h.mode === "custom", "checked")} data-hp-mode data-astro-cid-iau2qw2f><span data-astro-cid-iau2qw2f>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-bold", "width": "15", "height": "15", "data-astro-cid-iau2qw2f": true })}<b data-astro-cid-iau2qw2f>${dt("A custom message")}</b><em data-astro-cid-iau2qw2f>${dt("Your own text or a saved embed.")}</em></span></label> <label class="hp-mode" data-astro-cid-iau2qw2f><input type="radio" name="mode" value="none"${addAttribute(h.mode === "none", "checked")} data-hp-mode data-astro-cid-iau2qw2f><span data-astro-cid-iau2qw2f>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:prohibit-fill", "width": "15", "height": "15", "data-astro-cid-iau2qw2f": true })}<b data-astro-cid-iau2qw2f>${dt("Nothing")}</b><em data-astro-cid-iau2qw2f>${dt("The channel stays empty. The trap still works.")}</em></span></label> </div> <div class="hp-custom" data-hp-custom data-astro-cid-iau2qw2f> <label class="hp-field" data-astro-cid-iau2qw2f><span data-astro-cid-iau2qw2f>${dt("Saved embed")}</span> <select name="template" data-astro-cid-iau2qw2f> <option value="" data-astro-cid-iau2qw2f>${dt("No embed: send the text")}</option> ${embedNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === h.template, "selected")} data-astro-cid-iau2qw2f>${name}</option>`)} ${h.template && !embedNames.includes(h.template) && renderTemplate`<option${addAttribute(h.template, "value")} selected data-astro-cid-iau2qw2f>${h.template}</option>`} </select> </label> <div class="hp-field hp-text" data-astro-cid-iau2qw2f> <span data-astro-cid-iau2qw2f>${dt("Text")}</span> <textarea name="text" class="dgl-autogrow" rows="4" maxlength="2000" data-count data-dp data-dp-template="template" data-ac${addAttribute(dt("Do not write in {honeypot.channel}: anyone who does gets {honeypot.action}. Caught so far: {honeypot.count}."), "placeholder")} data-astro-cid-iau2qw2f>${h.text}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-iau2qw2f": true })} </div> <p class="hp-hint" data-astro-cid-iau2qw2f>${dt("Variables: {honeypot.action} (what happens), {honeypot.count} (members caught) and {honeypot.channel}. A saved embed is posted instead of the text; the text is used if the embed is deleted.")}</p> </div> </fieldset> <fieldset class="hp-group" data-astro-cid-iau2qw2f> <legend data-astro-cid-iau2qw2f><span class="hp-step" data-astro-cid-iau2qw2f>3</span>${dt("The member who is caught")}</legend> <div class="hp-switches" data-astro-cid-iau2qw2f> <label class="sx-switch" data-astro-cid-iau2qw2f><input type="checkbox" name="dm" value="1"${addAttribute(h.dm, "checked")} data-hp-dm data-astro-cid-iau2qw2f><span class="sx-switch-text" data-astro-cid-iau2qw2f><b data-astro-cid-iau2qw2f>${dt("Send them a DM")}</b><em data-astro-cid-iau2qw2f>${dt("The server's sanction message, sent before they are removed (with the appeal link when appeals are on).")}</em></span><span class="sx-toggle" data-astro-cid-iau2qw2f></span></label> <label class="sx-switch hp-reinvite" data-astro-cid-iau2qw2f><input type="checkbox" name="reinvite" value="1"${addAttribute(h.reinvite, "checked")} data-hp-reinvite data-astro-cid-iau2qw2f><span class="sx-switch-text" data-astro-cid-iau2qw2f><b data-astro-cid-iau2qw2f>${dt("Add an invite back")}</b><em data-astro-cid-iau2qw2f>${dt("Softban only: a link that works once and lasts 7 days, so a real member whose account was hacked can come back. Petto needs Create Invite in a channel everyone can see.")}</em></span><span class="sx-toggle" data-astro-cid-iau2qw2f></span></label> <p class="hp-hint hp-reinvite-off" data-astro-cid-iau2qw2f>${dt("The invite back is only sent with a softban: a ban keeps them out and a kicked member can join again with any invite.")}</p> </div> </fieldset> <div class="hp-actions" data-astro-cid-iau2qw2f> <button class="btn btn-accent btn-sm" type="submit"${addAttribute(!ready, "disabled")} data-astro-cid-iau2qw2f>${dt("Save")}</button> </div> </form> <aside class="hp-preview"${addAttribute(dt("Preview"), "aria-label")} data-astro-cid-iau2qw2f> <p class="hp-preview-title" data-astro-cid-iau2qw2f>${dt("Preview")}</p> <div class="hp-preview-default" data-hp-default data-astro-cid-iau2qw2f> <div class="dp-msg" data-astro-cid-iau2qw2f> <img class="dp-avatar" src="/assets/mascot-icon.webp" alt="" data-astro-cid-iau2qw2f> <div class="dp-body" data-astro-cid-iau2qw2f> <div class="dp-head" data-astro-cid-iau2qw2f><span class="dp-name" data-astro-cid-iau2qw2f>Petto</span><span class="dp-tag" data-astro-cid-iau2qw2f>APP</span></div> <div class="dp-v2-container noaccent" data-astro-cid-iau2qw2f> <div class="dp-v2-section" data-astro-cid-iau2qw2f> <div class="dp-v2-section-text" data-astro-cid-iau2qw2f> <span class="dp-h2" data-astro-cid-iau2qw2f>${panelWords.title}</span> <p class="hp-panel-text" data-hp-panel-text data-astro-cid-iau2qw2f>${unescapeHTML(panelWords.body.replace("{punishment}", `<strong>${punishmentText(h.punishment)}</strong>`))}</p> </div> <img class="dp-v2-thumb" src="/assets/petto-honeypot.webp" alt="" data-astro-cid-iau2qw2f> </div> <div class="dp-btn-row" data-astro-cid-iau2qw2f><span class="dp-btn" data-astro-cid-iau2qw2f>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:bug-fill", "width": "13", "height": "13", "data-astro-cid-iau2qw2f": true })}${panelWords.button.replace("{count}", String(h.caught))}</span></div> </div> </div> </div> </div> <p class="hp-preview-note hp-preview-none" data-astro-cid-iau2qw2f>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:prohibit-fill", "width": "14", "height": "14", "data-astro-cid-iau2qw2f": true })}${dt("Nothing is posted. The channel looks empty, and anyone who writes there is still caught.")}</p> <p class="hp-preview-note hp-preview-custom" data-astro-cid-iau2qw2f>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-bold", "width": "14", "height": "14", "data-astro-cid-iau2qw2f": true })}${dt("Your message, as members will see it, appears under the text.")}</p> </aside> </div> <footer class="hp-card-foot" data-astro-cid-iau2qw2f> <form method="POST" data-no-dirty data-astro-cid-iau2qw2f> <input type="hidden" name="action" value="post" data-astro-cid-iau2qw2f> <input type="hidden" name="channel_id"${addAttribute(h.channelId, "value")} data-astro-cid-iau2qw2f> <input type="hidden" name="fresh" value="1" data-astro-cid-iau2qw2f> <button class="btn btn-ghost btn-sm" type="submit"${addAttribute(!ready || !exists || h.mode === "none", "disabled")} data-astro-cid-iau2qw2f>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "13", "height": "13", "data-astro-cid-iau2qw2f": true })}${h.panelMessageId ? dt("Post it again") : dt("Post the message")}</button> </form> <form method="POST" data-no-dirty data-astro-cid-iau2qw2f> <input type="hidden" name="action" value="remove" data-astro-cid-iau2qw2f> <input type="hidden" name="channel_id"${addAttribute(h.channelId, "value")} data-astro-cid-iau2qw2f> <button class="btn btn-ghost btn-sm hp-remove" type="submit"${addAttribute(!ready, "disabled")}${addAttribute(dt("Remove this honeypot? Its warning message is deleted and the channel stays."), "data-confirm")} data-astro-cid-iau2qw2f>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-bold", "width": "13", "height": "13", "data-astro-cid-iau2qw2f": true })}${dt("Remove honeypot")}</button> </form> <span class="hp-hint hp-foot-hint" data-astro-cid-iau2qw2f>${dt("Saved changes are posted in the channel right away.")}</span> </footer> </article>`;
  }), honeypots.length > 0 && renderTemplate`<section class="hp-catches" data-astro-cid-iau2qw2f> <h2 data-astro-cid-iau2qw2f>${dt("Recent catches")}</h2> ${catches.length ? renderTemplate`<ul data-astro-cid-iau2qw2f> ${catches.map((c) => renderTemplate`<li data-astro-cid-iau2qw2f> <img${addAttribute(c.avatar, "src")} alt="" width="28" height="28" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-iau2qw2f> <span class="hp-who" data-astro-cid-iau2qw2f><b data-astro-cid-iau2qw2f>${c.name ?? c.userId}</b>${c.username && c.name !== c.username && renderTemplate`<em data-astro-cid-iau2qw2f>@${c.username}</em>`}</span> <span${addAttribute(["hp-tag", `hp-tag-${c.type}`], "class:list")} data-astro-cid-iau2qw2f>${punishmentLabel(c.type)}</span> <a class="hp-case"${addAttribute(`/dash/guild/${guildId}/moderation?section=cases`, "href")} data-astro-cid-iau2qw2f>${dt("Case #{n}", { n: c.caseNumber })}</a> <time${addAttribute(c.at, "datetime")} data-astro-cid-iau2qw2f>${when(c.at)}</time> </li>`)} </ul>` : renderTemplate`<p class="hp-hint" data-astro-cid-iau2qw2f>${dt("Nobody has been caught yet. That is good news: the trap is waiting.")}</p>`} </section>`, dt("With the prefix: !honeypot add, remove, panel, dm and list.")) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashHoneypot.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Honeypot = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Honeypot;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const SNOWFLAKE = /^\d{15,25}$/;
  const PUNISHMENTS = ["softban", "ban", "kick"];
  const snowflake = (value) => SNOWFLAKE.test(String(value ?? "")) ? String(value) : null;
  let message = null;
  let openChannel = null;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const channelId = snowflake(form.get("channel_id"));
    openChannel = channelId;
    const botFailed = dt("Petto did not answer. Try again in a moment.");
    const answer = (result) => {
      if (result.ok) return { kind: "ok", text: result.message || dt("Saved.") };
      if (result.code === "no_access" && !result.message) return { kind: "err", text: dt("Only administrators can change the Honeypot, the same as the command.") };
      return { kind: "err", text: result.message || botFailed };
    };
    if (!channelId) message = { kind: "err", text: dt("Pick a text or announcement channel.") };
    else if (action === "add") {
      const punishment = String(form.get("punishment") ?? "softban");
      message = answer(await callPettoHoneypot(Astro2, id, session.userId, "add", { channel_id: channelId, punishment: PUNISHMENTS.includes(punishment) ? punishment : "softban" }, dashLang));
    } else if (action === "save") {
      const res = await fetch(`${apiUrl}/rest/v1/honeypots?guild_id=eq.${id}&channel_id=eq.${channelId}&select=*`, { headers: apiHeaders }).catch(() => null);
      const current = res?.ok ? (await res.json().catch(() => []))[0] ?? null : null;
      const punishment = String(form.get("punishment") ?? "softban");
      const mode = String(form.get("mode") ?? "default");
      const panel = {
        mode: ["default", "custom", "none"].includes(mode) ? mode : "default",
        // Line breaks stay (as \n: browsers send \r\n, which would count twice against the 2000).
        text: String(form.get("text") ?? "").replace(/\u0000/g, "").replace(/\r\n?/g, "\n").trim().slice(0, 2e3),
        template: String(form.get("template") ?? "").trim().slice(0, 100)
      };
      const punishmentChanged = PUNISHMENTS.includes(punishment) && punishment !== current?.punishment;
      const panelChanged = !current || panel.mode !== (current.panel_mode ?? "default") || panel.text !== String(current.panel_text ?? "") || panel.template !== String(current.panel_template ?? "");
      const member = form.get("member_settings") === "1" ? { dm: form.get("dm") === "1", reinvite: form.get("reinvite") === "1" } : null;
      const memberChanged = Boolean(current && member && (member.dm !== (current.dm_member !== false) || member.reinvite !== (current.reinvite !== false)));
      if (!current) message = { kind: "err", text: dt("That channel is not a honeypot.") };
      else {
        let result = { ok: true, message: dt("Nothing changed.") };
        if (punishmentChanged) result = await callPettoHoneypot(Astro2, id, session.userId, "add", { channel_id: channelId, punishment }, dashLang);
        if (result.ok && panelChanged) result = await callPettoHoneypot(Astro2, id, session.userId, "panel", { channel_id: channelId, ...panel }, dashLang);
        if (result.ok && memberChanged && member) {
          const saved = await callPettoHoneypot(Astro2, id, session.userId, "dm", { channel_id: channelId, ...member }, dashLang);
          if (saved.ok) {
            if (!punishmentChanged && !panelChanged) result = saved;
          } else result = saved.code === "unknown_action" ? { ok: false, message: dt("Petto is being updated: the DM settings can be saved in a few minutes.") } : saved;
        }
        message = answer(result);
      }
    } else if (action === "post") {
      message = answer(await callPettoHoneypot(Astro2, id, session.userId, "post", { channel_id: channelId, fresh: form.get("fresh") === "1" }, dashLang));
    } else if (action === "remove") {
      message = answer(await callPettoHoneypot(Astro2, id, session.userId, "remove", { channel_id: channelId }, dashLang));
      openChannel = null;
    }
  }
  const [guildInfo, rowsRes, channelsRes, embedsRes, casesRes] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/honeypots?guild_id=eq.${id}&select=*&order=created_at.asc`, { headers: apiHeaders }).catch(() => null),
    getGuildList(Astro2, id, botToken, "channels"),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders }).catch(() => null),
    // The honeypot writes a case for each member it catches (the channel is not kept, the member and the action are).
    fetch(`${apiUrl}/rest/v1/mod_actions?guild_id=eq.${id}&source=eq.honeypot&select=case_number,user_id,type,created_at&order=created_at.desc&limit=10`, { headers: apiHeaders }).catch(() => null)
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = Boolean(rowsRes?.ok);
  const rawRows = ready ? await rowsRes.json().catch(() => []) : [];
  const allChannels = channelsRes?.ok ? await channelsRes.json() : [];
  const textChannels = allChannels.filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map((c) => ({ id: String(c.id), name: String(c.name) }));
  const channelName = new Map(allChannels.map((c) => [String(c.id), String(c.name)]));
  const honeypots = rawRows.map((r) => ({
    channelId: String(r.channel_id),
    channelName: channelName.get(String(r.channel_id)) ?? null,
    punishment: PUNISHMENTS.includes(r.punishment) ? String(r.punishment) : "softban",
    caught: Math.max(0, Number(r.caught_count) || 0),
    messages: Math.max(0, Number(r.trigger_count) || 0),
    mode: ["default", "custom", "none"].includes(r.panel_mode) ? String(r.panel_mode) : "default",
    text: String(r.panel_text ?? ""),
    template: r.panel_template ? String(r.panel_template) : "",
    panelMessageId: r.panel_message_id ? String(r.panel_message_id) : null,
    dm: r.dm_member !== false,
    reinvite: r.reinvite !== false
  }));
  const used = new Set(honeypots.map((h) => h.channelId));
  const freeChannels = textChannels.filter((c) => !used.has(c.id));
  const embedNames = embedsRes?.ok ? (await embedsRes.json().catch(() => [])).map((row) => String(row.name)) : [];
  const caseRows = casesRes?.ok ? await casesRes.json().catch(() => []) : [];
  const profiles = caseRows.length ? (await withinBudget(getMemberProfiles(Astro2, id, caseRows.map((row) => String(row.user_id)), botToken, { fallback: "user", userId: session.userId }), 1500))?.value ?? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Map();
  const catches = caseRows.map((row) => {
    const profile = profiles.get(String(row.user_id)) ?? null;
    return {
      caseNumber: Number(row.case_number) || 0,
      userId: String(row.user_id),
      type: String(row.type),
      at: String(row.created_at),
      name: profile ? profile.displayName || profile.username : null,
      username: profile?.username ?? null,
      avatar: memberAvatarUrl(String(row.user_id), profile, 64)
    };
  });
  return renderTemplate`${renderComponent($$result, "DashHoneypot", $$DashHoneypot, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "honeypots": honeypots, "freeChannels": freeChannels, "embedNames": embedNames, "catches": catches, "ready": ready, "message": message, "openChannel": openChannel })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/honeypot.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/honeypot.astro";
const $$url = "/dash/guild/[id]/honeypot";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Honeypot,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
