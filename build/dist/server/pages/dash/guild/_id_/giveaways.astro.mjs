import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$VariableHelp } from '../../../../chunks/VariableHelp_CRlEe6IW.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$EmojiPicker } from '../../../../chunks/EmojiPicker_0tfnRmiq.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { p as planLimits, P as PREMIUM_LIMITS, F as FREE_LIMITS } from '../../../../chunks/planLimits_BFQNR8Tb.mjs';
/* empty css                                              */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { o as hasPremiumForGuild } from '../../../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { D as callPettoGiveaway } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashGiveaways = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashGiveaways;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, config, active, ended = [], channels = [], giveawayError = null, giveawayNote = null, presets, roles, embedTemplateNames, premiumActive, saved, section } = Astro2.props;
  const sectionMeta = { settings: dt("Giveaway settings"), presets: dt("Bonus-entry presets"), active: dt("Running giveaways") };
  const selectedSection = sectionMeta[section ?? ""] ? section ?? "" : "settings";
  const selectedTitle = sectionMeta[selectedSection];
  function roleName(id) {
    return roles.find((r) => r.id === id)?.name ?? id;
  }
  function formatDuration(ms) {
    if (!ms) return "";
    const units = [{ suffix: "w", value: 6048e5 }, { suffix: "d", value: 864e5 }, { suffix: "h", value: 36e5 }, { suffix: "m", value: 6e4 }, { suffix: "s", value: 1e3 }];
    const unit = units.find((item) => ms >= item.value) ?? units[units.length - 1];
    return `${Math.round(ms / unit.value)}${unit.suffix}`;
  }
  const giveawayPresetLimit = planLimits(premiumActive).giveawayPresets;
  const giveawayPresetAtLimit = presets.length >= giveawayPresetLimit;
  return renderTemplate(_a || (_a = __template(["", ` <script>
  // A quick duration (1h, 1d...) fills the duration box of its form.
  (function () {
    if (window.__gwQuick) return;
    window.__gwQuick = true;
    document.addEventListener('click', function (event) {
      var chip = event.target && event.target.closest && event.target.closest('[data-gw-dur]');
      if (!chip) return;
      var box = chip.closest('.dfx-field') && chip.closest('.dfx-field').querySelector('input[name="duration"]');
      if (!box) return;
      box.value = chip.getAttribute('data-gw-dur');
      box.dispatchEvent(new Event('input', { bubbles: true }));
      box.focus();
    });
  })();
<\/script> <script>
  // The entries of the running giveaways follow the entries as they come in, every 5 seconds while the page is in view.
  (function () {
    if (window.__gwLive) return;
    window.__gwLive = true;
    var timer = null;
    function tick() {
      var list = document.querySelector('.gw-active-list[data-live-url]');
      if (!list || document.hidden) { timer = setTimeout(tick, 5000); return; }
      fetch(list.getAttribute('data-live-url'), { cache: 'no-store', headers: { Accept: 'application/json' } })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          if (!data || !Array.isArray(data.giveaways)) return;
          var running = {};
          data.giveaways.forEach(function (entry) { running[entry.id] = entry.entries; });
          list.querySelectorAll('.gw-active-row[data-giveaway-id]').forEach(function (row) {
            var id = row.getAttribute('data-giveaway-id');
            var counter = row.querySelector('[data-gw-entries]');
            if (id in running) { if (counter) counter.textContent = String(running[id]); }
            else row.classList.add('gw-row-ended');
          });
        })
        .catch(function () {})
        .then(function () { timer = setTimeout(tick, 5000); });
    }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { clearTimeout(timer); timer = setTimeout(tick, 300); } });
    timer = setTimeout(tick, 5000);
  })();
<\/script> `])), renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": selectedSection === "settings" ? "giveaways" : `giveaways-${selectedSection}`, "pageTitle": selectedTitle, "data-astro-cid-ticee434": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-ticee434": true })} ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-ticee434": true })} ${maybeRenderHead()}<h1 data-astro-cid-ticee434>${selectedTitle}</h1> <div class="gw-discord-note" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "15", "height": "15", "data-astro-cid-ticee434": true })}<span data-astro-cid-ticee434>${dt("Start one here, in Running now, or in Discord with")} <code data-astro-cid-ticee434>${dt("/giveaway start")}</code>${dt(". This page also manages their settings, messages, designs, and presets.")}</span></div> ${selectedSection === "active" && renderTemplate`${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Running now"), value: active.length, tone: "joins" },
    { label: dt("Entries"), value: active.reduce((sum, g) => sum + (g.entries ?? 0), 0), tone: "messages" },
    { label: dt("Ended"), value: ended.length, tone: "invites" }
  ], "data-astro-cid-ticee434": true })}`}${selectedSection === "presets" && renderTemplate`${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Presets"), value: presets.length, tone: "reactions" },
    { label: dt("Roles with bonus"), value: presets.reduce((sum, p) => sum + p.roles.length, 0), tone: "invites" },
    { label: dt("Level steps"), value: presets.reduce((sum, p) => sum + (p.levels ?? []).length, 0), tone: "voice" }
  ], "data-astro-cid-ticee434": true })}`}${saved && renderTemplate`<div class="gw-flash" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-ticee434": true })}${dt("Saved.")}${giveawayNote ? " " : ""}${giveawayNote}</div>`}${giveawayError && renderTemplate`<div class="gw-error" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-ticee434": true })}${giveawayError}</div>`}${selectedSection === "settings" && renderTemplate`${renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "data-astro-cid-ticee434": true })}`}${selectedSection === "settings" && renderTemplate`<form method="POST"${addAttribute(["dfx-form", "gw-form", { "gw-section-hidden": selectedSection !== "settings" }], "class:list")} data-astro-cid-ticee434> <input type="hidden" name="action" value="config" data-astro-cid-ticee434> <section class="dfx-sec gw-first" data-astro-cid-ticee434> <div class="dfx-sec-head" data-astro-cid-ticee434><h2 data-astro-cid-ticee434>${dt("Entry & messages")}</h2><p data-astro-cid-ticee434>${dt("How members enter and what Petto says along the way.")}</p></div> <div class="dfx-field" data-astro-cid-ticee434> <span class="dfx-label" data-astro-cid-ticee434>${dt("Entry method")}</span> <div class="dfx-chips" data-astro-cid-ticee434> <label class="dfx-chip" data-astro-cid-ticee434><input type="radio" name="entry_mode" value="button"${addAttribute(config.entryMode === "button", "checked")} data-astro-cid-ticee434>${dt("Button")}</label> <label class="dfx-chip" data-astro-cid-ticee434><input type="radio" name="entry_mode" value="reaction"${addAttribute(config.entryMode === "reaction", "checked")} data-astro-cid-ticee434>${dt("Reaction")}</label> </div> </div> <div class="dfx-field" data-sx-needs="entry_mode=reaction" data-astro-cid-ticee434> <label data-astro-cid-ticee434>${dt("Reaction emoji")}</label> <input type="text" name="reaction" data-emoji-input${addAttribute(config.reaction, "value")} maxlength="4" data-astro-cid-ticee434> <span class="dfx-hint" data-astro-cid-ticee434>${dt("The emoji members press to enter.")}</span> </div> <div class="dfx-field" data-astro-cid-ticee434> <label data-astro-cid-ticee434>${dt("Default giveaway design")}</label> <select name="embed_template" data-dp-template-only data-astro-cid-ticee434> <option value=""${addAttribute(!config.embedTemplate, "selected")} data-astro-cid-ticee434>${dt("Use Petto default")}</option> ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === config.embedTemplate, "selected")} data-astro-cid-ticee434>${name}</option>`)} </select> <span class="dfx-hint" data-astro-cid-ticee434>${dt("Saved designs come from the Embeds page. A per-giveaway choice can still override this default from Discord.")}</span> </div> </section> <section class="dfx-sec" data-astro-cid-ticee434> <div class="dfx-sec-head" data-astro-cid-ticee434><h2 data-astro-cid-ticee434>${dt("Messages")}</h2><p data-astro-cid-ticee434>${dt("Open one to change it. The ones you changed have a dot.")}</p></div> <div class="gw-accs" data-astro-cid-ticee434> <details class="dfx-acc gw-acc"${addAttribute(Boolean(config.winnerMessage || config.winnerMessageEmbed), "open")} data-astro-cid-ticee434> <summary data-astro-cid-ticee434><span class="dfx-acc-title" data-astro-cid-ticee434><b data-astro-cid-ticee434>${dt("Winner message")}${(config.winnerMessage || config.winnerMessageEmbed) && renderTemplate`<i class="gw-dot"${addAttribute(dt("Changed"), "title")} data-astro-cid-ticee434></i>`}</b><em data-astro-cid-ticee434>${dt("Sent when the giveaway ends with a winner.")}</em></span><svg class="dfx-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-ticee434><path d="m6 9 6 6 6-6" data-astro-cid-ticee434></path></svg></summary> <div class="dfx-acc-body" data-astro-cid-ticee434> <div class="dfx-field" data-astro-cid-ticee434> <textarea class="dgl-autogrow" rows="2" name="winner_message" data-ac data-dp data-count maxlength="200"${addAttribute(dt("{user} won **{gw.prize}**!"), "placeholder")}${addAttribute(dt("Winner message"), "aria-label")} data-astro-cid-ticee434>${config.winnerMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-ticee434": true })} </div> <div class="dfx-field" data-astro-cid-ticee434> <label data-astro-cid-ticee434>${dt("Saved design")}</label> <select name="winner_embed_template" data-tpl-locks="winner_message" data-dp-template-only data-astro-cid-ticee434> <option value=""${addAttribute(!config.winnerMessageEmbed, "selected")} data-astro-cid-ticee434>${dt("Send it as text")}</option> ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === config.winnerMessageEmbed, "selected")} data-astro-cid-ticee434>${name}</option>`)} </select> <span class="dfx-hint" data-astro-cid-ticee434>${dt("Or send a saved design instead of the text above.")}</span> </div> </div> </details> <details class="dfx-acc gw-acc"${addAttribute(Boolean(config.noEntriesMessage || config.noEntriesMessageEmbed), "open")} data-astro-cid-ticee434> <summary data-astro-cid-ticee434><span class="dfx-acc-title" data-astro-cid-ticee434><b data-astro-cid-ticee434>${dt("No-entries message")}${(config.noEntriesMessage || config.noEntriesMessageEmbed) && renderTemplate`<i class="gw-dot"${addAttribute(dt("Changed"), "title")} data-astro-cid-ticee434></i>`}</b><em data-astro-cid-ticee434>${dt("Sent when nobody entered.")}</em></span><svg class="dfx-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-ticee434><path d="m6 9 6 6 6-6" data-astro-cid-ticee434></path></svg></summary> <div class="dfx-acc-body" data-astro-cid-ticee434> <div class="dfx-field" data-astro-cid-ticee434> <textarea class="dgl-autogrow" rows="2" name="no_entries_message" data-ac data-dp data-count maxlength="200"${addAttribute(dt("Nobody entered, no winner this time."), "placeholder")}${addAttribute(dt("No-entries message"), "aria-label")} data-astro-cid-ticee434>${config.noEntriesMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-ticee434": true })} </div> <div class="dfx-field" data-astro-cid-ticee434> <label data-astro-cid-ticee434>${dt("Saved design")}</label> <select name="no_entries_embed_template" data-tpl-locks="no_entries_message" data-dp-template-only data-astro-cid-ticee434> <option value=""${addAttribute(!config.noEntriesMessageEmbed, "selected")} data-astro-cid-ticee434>${dt("Send it as text")}</option> ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === config.noEntriesMessageEmbed, "selected")} data-astro-cid-ticee434>${name}</option>`)} </select> <span class="dfx-hint" data-astro-cid-ticee434>${dt("Or send a saved design instead of the text above.")}</span> </div> </div> </details> <details class="dfx-acc gw-acc"${addAttribute(Boolean(config.denyMessage || config.denyMessageEmbed), "open")} data-astro-cid-ticee434> <summary data-astro-cid-ticee434><span class="dfx-acc-title" data-astro-cid-ticee434><b data-astro-cid-ticee434>${dt("Winner denied prize message")}${(config.denyMessage || config.denyMessageEmbed) && renderTemplate`<i class="gw-dot"${addAttribute(dt("Changed"), "title")} data-astro-cid-ticee434></i>`}</b><em data-astro-cid-ticee434>${dt("Sent when a winner gives up the prize.")}</em></span><svg class="dfx-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-ticee434><path d="m6 9 6 6 6-6" data-astro-cid-ticee434></path></svg></summary> <div class="dfx-acc-body" data-astro-cid-ticee434> <div class="dfx-field" data-astro-cid-ticee434> <textarea class="dgl-autogrow" rows="2" name="deny_message" data-ac data-dp data-count maxlength="200"${addAttribute(dt("{user} gave up their prize, re-rolling..."), "placeholder")}${addAttribute(dt("Winner denied prize message"), "aria-label")} data-astro-cid-ticee434>${config.denyMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-ticee434": true })} </div> <div class="dfx-field" data-astro-cid-ticee434> <label data-astro-cid-ticee434>${dt("Saved design")}</label> <select name="deny_embed_template" data-tpl-locks="deny_message" data-dp-template-only data-astro-cid-ticee434> <option value=""${addAttribute(!config.denyMessageEmbed, "selected")} data-astro-cid-ticee434>${dt("Send it as text")}</option> ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === config.denyMessageEmbed, "selected")} data-astro-cid-ticee434>${name}</option>`)} </select> <span class="dfx-hint" data-astro-cid-ticee434>${dt("Or send a saved design instead of the text above.")}</span> </div> </div> </details> <details class="dfx-acc gw-acc"${addAttribute(Boolean(config.claimTimeMessage || config.claimTimeMessageEmbed), "open")} data-astro-cid-ticee434> <summary data-astro-cid-ticee434><span class="dfx-acc-title" data-astro-cid-ticee434><b data-astro-cid-ticee434>${dt("Claim prompt (when a giveaway needs winners to confirm)")}${(config.claimTimeMessage || config.claimTimeMessageEmbed) && renderTemplate`<i class="gw-dot"${addAttribute(dt("Changed"), "title")} data-astro-cid-ticee434></i>`}</b><em data-astro-cid-ticee434>${dt("Sent to winners who have to confirm the prize.")}</em></span><svg class="dfx-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-ticee434><path d="m6 9 6 6 6-6" data-astro-cid-ticee434></path></svg></summary> <div class="dfx-acc-body" data-astro-cid-ticee434> <div class="dfx-field" data-astro-cid-ticee434> <textarea class="dgl-autogrow" rows="2" name="claim_time_message" data-ac data-dp data-count maxlength="200"${addAttribute(dt("{user}, click to claim **{gw.prize}** within {gw.claim_time}!"), "placeholder")}${addAttribute(dt("Claim prompt (when a giveaway needs winners to confirm)"), "aria-label")} data-astro-cid-ticee434>${config.claimTimeMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-ticee434": true })} </div> <div class="dfx-field" data-astro-cid-ticee434> <label data-astro-cid-ticee434>${dt("Saved design")}</label> <select name="claim_time_embed_template" data-tpl-locks="claim_time_message" data-dp-template-only data-astro-cid-ticee434> <option value=""${addAttribute(!config.claimTimeMessageEmbed, "selected")} data-astro-cid-ticee434>${dt("Send it as text")}</option> ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === config.claimTimeMessageEmbed, "selected")} data-astro-cid-ticee434>${name}</option>`)} </select> <span class="dfx-hint" data-astro-cid-ticee434>${dt("Or send a saved design instead of the text above.")}</span> </div> </div> </details> <details class="dfx-acc gw-acc"${addAttribute(Boolean(config.claimTimeOverMessage || config.claimTimeOverMessageEmbed), "open")} data-astro-cid-ticee434> <summary data-astro-cid-ticee434><span class="dfx-acc-title" data-astro-cid-ticee434><b data-astro-cid-ticee434>${dt("Claim expired message")}${(config.claimTimeOverMessage || config.claimTimeOverMessageEmbed) && renderTemplate`<i class="gw-dot"${addAttribute(dt("Changed"), "title")} data-astro-cid-ticee434></i>`}</b><em data-astro-cid-ticee434>${dt("Sent when a winner does not claim in time.")}</em></span><svg class="dfx-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-ticee434><path d="m6 9 6 6 6-6" data-astro-cid-ticee434></path></svg></summary> <div class="dfx-acc-body" data-astro-cid-ticee434> <div class="dfx-field" data-astro-cid-ticee434> <textarea class="dgl-autogrow" rows="2" name="claim_time_over_message" data-ac data-dp data-count maxlength="200"${addAttribute(dt("{user} didn't claim in time, re-rolling..."), "placeholder")}${addAttribute(dt("Claim expired message"), "aria-label")} data-astro-cid-ticee434>${config.claimTimeOverMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-ticee434": true })} </div> <div class="dfx-field" data-astro-cid-ticee434> <label data-astro-cid-ticee434>${dt("Saved design")}</label> <select name="claim_time_over_embed_template" data-tpl-locks="claim_time_over_message" data-dp-template-only data-astro-cid-ticee434> <option value=""${addAttribute(!config.claimTimeOverMessageEmbed, "selected")} data-astro-cid-ticee434>${dt("Send it as text")}</option> ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === config.claimTimeOverMessageEmbed, "selected")} data-astro-cid-ticee434>${name}</option>`)} </select> <span class="dfx-hint" data-astro-cid-ticee434>${dt("Or send a saved design instead of the text above.")}</span> </div> </div> </details> <details class="dfx-acc gw-acc"${addAttribute(Boolean(config.acceptMessage || config.acceptMessageEmbed), "open")} data-astro-cid-ticee434> <summary data-astro-cid-ticee434><span class="dfx-acc-title" data-astro-cid-ticee434><b data-astro-cid-ticee434>${dt("Claim accepted message")}${(config.acceptMessage || config.acceptMessageEmbed) && renderTemplate`<i class="gw-dot"${addAttribute(dt("Changed"), "title")} data-astro-cid-ticee434></i>`}</b><em data-astro-cid-ticee434>${dt("Sent when a winner claims the prize.")}</em></span><svg class="dfx-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-ticee434><path d="m6 9 6 6 6-6" data-astro-cid-ticee434></path></svg></summary> <div class="dfx-acc-body" data-astro-cid-ticee434> <div class="dfx-field" data-astro-cid-ticee434> <textarea class="dgl-autogrow" rows="2" name="accept_message" data-ac data-dp data-count maxlength="200"${addAttribute(dt("{user} claimed **{gw.prize}**!"), "placeholder")}${addAttribute(dt("Claim accepted message"), "aria-label")} data-astro-cid-ticee434>${config.acceptMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-ticee434": true })} </div> <div class="dfx-field" data-astro-cid-ticee434> <label data-astro-cid-ticee434>${dt("Saved design")}</label> <select name="accept_embed_template" data-tpl-locks="accept_message" data-dp-template-only data-astro-cid-ticee434> <option value=""${addAttribute(!config.acceptMessageEmbed, "selected")} data-astro-cid-ticee434>${dt("Send it as text")}</option> ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === config.acceptMessageEmbed, "selected")} data-astro-cid-ticee434>${name}</option>`)} </select> <span class="dfx-hint" data-astro-cid-ticee434>${dt("Or send a saved design instead of the text above.")}</span> </div> </div> </details> </div> ${renderComponent($$result2, "VariableHelp", $$VariableHelp, { "data-astro-cid-ticee434": true })} </section> <div class="dfx-foot" data-astro-cid-ticee434><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-ticee434>${dt("Save changes")}</button></div> </form>`}${selectedSection === "presets" && renderTemplate`<div class="gwx-page" data-astro-cid-ticee434> <div class="gwx-head" data-astro-cid-ticee434> <h2 data-astro-cid-ticee434>${dt("Bonus-entry presets")} <span class="gwx-count" data-astro-cid-ticee434>${presets.length}/${giveawayPresetLimit}</span>${!premiumActive && renderTemplate`<span class="gw-premium-tag" data-astro-cid-ticee434>Premium: ${PREMIUM_LIMITS.giveawayPresets}</span>`}</h2> <p data-astro-cid-ticee434>${dt("Give certain roles extra entries automatically, and ask for a level or give extra entries by level, when a giveaway uses a preset.")}</p> </div> ${presets.length === 0 && renderTemplate`<p class="gwx-empty" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:star-fill", "width": "18", "height": "18", "data-astro-cid-ticee434": true })}${dt("No presets yet. Add one below.")}</p>`} <div class="gwx-list dgl-stagger" data-astro-cid-ticee434> ${presets.map((p) => renderTemplate`<div class="gwx-item" data-astro-cid-ticee434> <div class="gwx-item-head" data-astro-cid-ticee434> <span class="gwx-icon" aria-hidden="true" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:star-fill", "width": "17", "height": "17", "data-astro-cid-ticee434": true })}</span> <span class="gwx-item-title" data-astro-cid-ticee434> <b data-astro-cid-ticee434>${p.name}</b> <span data-astro-cid-ticee434>${dt("Roles")}: ${p.roles.length} · ${dt("Levels")}: ${(p.levels ?? []).length}</span> </span> <form method="POST" data-no-dirty data-astro-cid-ticee434><input type="hidden" name="action" value="delete_preset" data-astro-cid-ticee434><input type="hidden" name="preset_id"${addAttribute(p.id, "value")} data-astro-cid-ticee434> <button type="submit" class="gw-preset-del gwx-del"${addAttribute(dt("Delete preset"), "title")}${addAttribute(dt("Delete preset"), "aria-label")} data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-ticee434": true })}</button> </form> </div> <details class="dfx-acc"${addAttribute(p.roles.length > 0, "open")} data-astro-cid-ticee434> <summary data-astro-cid-ticee434><span class="dfx-acc-title" data-astro-cid-ticee434><b data-astro-cid-ticee434>${dt("Roles with bonus")}</b><em data-astro-cid-ticee434>${dt("Extra entries for the members who have a role.")}</em></span><span class="gwx-badge" data-astro-cid-ticee434>${p.roles.length}</span>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14", "data-astro-cid-ticee434": true })}</summary> <div class="dfx-acc-body" data-astro-cid-ticee434> ${p.roles.length > 0 && renderTemplate`<div class="gwx-chips" data-astro-cid-ticee434> ${p.roles.map((r) => renderTemplate`<span class="gwx-chip" data-astro-cid-ticee434> <b data-astro-cid-ticee434>${roleName(r.roleId)}</b> <i data-astro-cid-ticee434>${dt("+{a} entries", { a: r.entries })}</i> ${r.claimTimeMs > 0 && renderTemplate`<em${addAttribute(dt("Extra claim time for winners with this role"), "title")} data-astro-cid-ticee434>${dt("+{a} claim time", { a: formatDuration(r.claimTimeMs) })}</em>`} ${r.entriesStack && renderTemplate`<em${addAttribute(dt("Entries stack with other matching roles"), "title")} data-astro-cid-ticee434>${dt("Stacks")}</em>`} ${r.claimTimeStack && renderTemplate`<em${addAttribute(dt("Claim time stacks with other matching roles"), "title")} data-astro-cid-ticee434>${dt("Time stacks")}</em>`} </span>`)} </div>`} <form method="POST" class="gwx-add" data-no-dirty data-astro-cid-ticee434> <input type="hidden" name="action" value="add_preset_role" data-astro-cid-ticee434> <input type="hidden" name="preset_id"${addAttribute(p.id, "value")} data-astro-cid-ticee434> <div class="dfx-grid dfx-grid-3" data-astro-cid-ticee434> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Role")}</label> <select name="role_id" required data-astro-cid-ticee434> <option value="" disabled selected data-astro-cid-ticee434>${dt("Role")}</option> ${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")} data-astro-cid-ticee434>${r.name}</option>`)} </select> </div> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Extra entries")}</label><input type="number" name="entries" min="1" max="100" required data-astro-cid-ticee434></div> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Claim time")} <span class="gw-muted" data-astro-cid-ticee434>${dt("optional")}</span></label><input type="text" name="claim_time"${addAttribute(dt("Claim time, e.g. 5m"), "placeholder")} maxlength="12" data-astro-cid-ticee434></div> </div> <div class="dfx-chips" data-astro-cid-ticee434> <label class="dfx-chip" data-astro-cid-ticee434><input type="checkbox" name="entries_stack" data-astro-cid-ticee434>${dt("Stack entries")}</label> <label class="dfx-chip" data-astro-cid-ticee434><input type="checkbox" name="claim_time_stack" data-astro-cid-ticee434>${dt("Stack claim time")}</label> </div> <div class="dfx-foot" data-astro-cid-ticee434><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-ticee434": true })}${dt("Add")}</button></div> </form> </div> </details> <details class="dfx-acc"${addAttribute((p.levels ?? []).length > 0 || Boolean(p.minLevel) || Boolean(p.minVoiceLevel), "open")} data-astro-cid-ticee434> <summary data-astro-cid-ticee434><span class="dfx-acc-title" data-astro-cid-ticee434><b data-astro-cid-ticee434>${dt("Levels")}</b><em data-astro-cid-ticee434>${dt("A level to take part, and extra entries for each level reached.")}</em></span><span class="gwx-badge" data-astro-cid-ticee434>${(p.levels ?? []).length}</span>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14", "data-astro-cid-ticee434": true })}</summary> <div class="dfx-acc-body" data-astro-cid-ticee434> <form method="POST" class="gwx-add" data-astro-cid-ticee434> <input type="hidden" name="action" value="set_preset_levels" data-astro-cid-ticee434> <input type="hidden" name="preset_id"${addAttribute(p.id, "value")} data-astro-cid-ticee434> <div class="dfx-grid" data-astro-cid-ticee434> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Message level needed")}</label><input type="number" name="min_level"${addAttribute(p.minLevel ?? 0, "value")} min="0" max="10000" data-astro-cid-ticee434></div> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Voice level needed")}</label><input type="number" name="min_voice_level"${addAttribute(p.minVoiceLevel ?? 0, "value")} min="0" max="10000" data-astro-cid-ticee434></div> </div> <div class="dfx-foot" data-astro-cid-ticee434><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-ticee434>${dt("Save")}</button></div> </form> ${(p.levels ?? []).length > 0 && renderTemplate`<div class="gwx-chips" data-astro-cid-ticee434> ${(p.levels ?? []).map((step) => renderTemplate`<form method="POST" class="gwx-chip" data-no-dirty data-astro-cid-ticee434> <input type="hidden" name="action" value="delete_preset_level" data-astro-cid-ticee434> <input type="hidden" name="preset_id"${addAttribute(p.id, "value")} data-astro-cid-ticee434> <input type="hidden" name="source"${addAttribute(step.source, "value")} data-astro-cid-ticee434> <input type="hidden" name="level"${addAttribute(step.level, "value")} data-astro-cid-ticee434> <b data-astro-cid-ticee434>${step.source === "voice" ? dt("Voice level") : dt("Level")} ${step.level}+</b> <i data-astro-cid-ticee434>+${step.entries}</i> <button type="submit" class="gwx-chip-x"${addAttribute(dt("Remove"), "title")}${addAttribute(dt("Remove"), "aria-label")} data-astro-cid-ticee434>×</button> </form>`)} </div>`} <form method="POST" class="gwx-add" data-no-dirty data-astro-cid-ticee434> <input type="hidden" name="action" value="add_preset_level" data-astro-cid-ticee434> <input type="hidden" name="preset_id"${addAttribute(p.id, "value")} data-astro-cid-ticee434> <div class="dfx-field" data-astro-cid-ticee434> <span class="dfx-label" data-astro-cid-ticee434>${dt("Level")}</span> <div class="dfx-chips" data-astro-cid-ticee434> <label class="dfx-chip" data-astro-cid-ticee434><input type="radio" name="source" value="text" checked data-astro-cid-ticee434>${dt("Message level")}</label> <label class="dfx-chip" data-astro-cid-ticee434><input type="radio" name="source" value="voice" data-astro-cid-ticee434>${dt("Voice level")}</label> </div> </div> <div class="dfx-grid" data-astro-cid-ticee434> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("From level")}</label><input type="number" name="level" min="1" max="10000" required data-astro-cid-ticee434></div> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Extra entries")}</label><input type="number" name="entries" min="1" max="1000" required data-astro-cid-ticee434></div> </div> <div class="dfx-foot" data-astro-cid-ticee434><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-ticee434": true })}${dt("Add")}</button></div> </form> </div> </details> </div>`)} </div> ${giveawayPresetAtLimit ? renderTemplate`<div class="gwx-limit" data-astro-cid-ticee434> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-simple-fill", "width": "20", "height": "20", "data-astro-cid-ticee434": true })} <div data-astro-cid-ticee434><strong data-astro-cid-ticee434>${premiumActive ? dt("Preset limit reached") : dt("Free preset limit reached")}</strong><span data-astro-cid-ticee434>${premiumActive ? dt("You are using all {n} available giveaway presets.", { n: giveawayPresetLimit }) : dt("Free includes {a} presets. Premium increases this to {b}.", { a: FREE_LIMITS.giveawayPresets, b: PREMIUM_LIMITS.giveawayPresets })}</span></div> ${!premiumActive && renderTemplate`<a class="btn btn-ghost btn-sm"${addAttribute(`/dash/premium?guild_id=${guildId}`, "href")} data-astro-cid-ticee434>${dt("Unlock Premium")}</a>`} </div>` : renderTemplate`<form method="POST" class="dfx-form gwx-new" data-no-dirty data-astro-cid-ticee434> <input type="hidden" name="action" value="add_preset" data-astro-cid-ticee434> <div class="dfx-sec-head" data-astro-cid-ticee434><h2 data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-ticee434": true })}${dt("Add preset")}</h2></div> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Name")}</label><textarea name="name" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count maxlength="40"${addAttribute(dt("Preset name, e.g. Booster bonus"), "placeholder")} required data-astro-cid-ticee434></textarea></div> <div class="dfx-foot" data-astro-cid-ticee434><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-ticee434": true })}${dt("Add preset")}</button></div> </form>`} </div>`}${selectedSection === "active" && renderTemplate`<div class="gwx-page" data-astro-cid-ticee434> <form method="POST" class="dfx-form gwx-start" data-no-dirty data-astro-cid-ticee434> <input type="hidden" name="action" value="start_giveaway" data-astro-cid-ticee434> <section class="dfx-sec gw-first" data-astro-cid-ticee434> <div class="dfx-sec-head" data-astro-cid-ticee434><h2 data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:rocket-launch-fill", "width": "16", "height": "16", "data-astro-cid-ticee434": true })}${dt("Start a giveaway")}</h2><p data-astro-cid-ticee434>${dt("The prize, how many people win and how long it runs.")}</p></div> <div class="dfx-grid" data-astro-cid-ticee434> <div class="dfx-field dfx-wide" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Prize")}</label><textarea name="prize" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count maxlength="256"${addAttribute(dt("Discord Nitro"), "placeholder")} required data-astro-cid-ticee434></textarea></div> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Winners")}</label><input type="number" name="winners" min="1" max="50" value="1" required data-astro-cid-ticee434></div> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Duration")}</label><input type="text" name="duration" maxlength="30" placeholder="1h, 3d 4h" required data-astro-cid-ticee434> <div class="gwx-quick" role="group"${addAttribute(dt("Duration"), "aria-label")} data-astro-cid-ticee434>${["1h", "6h", "1d", "3d", "1w"].map((d) => renderTemplate`<button type="button" class="gwx-q"${addAttribute(d, "data-gw-dur")} data-astro-cid-ticee434>${d}</button>`)}</div> </div> </div> </section> <section class="dfx-sec" data-astro-cid-ticee434> <div class="dfx-sec-head" data-astro-cid-ticee434><h2 data-astro-cid-ticee434>${dt("Where and how")}</h2><p data-astro-cid-ticee434>${dt("The channel it is posted in and how members enter.")}</p></div> <div class="dfx-grid" data-astro-cid-ticee434> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Channel")}</label> <select name="channel_id" required data-astro-cid-ticee434><option value="" disabled selected data-astro-cid-ticee434>${dt("Choose a channel")}</option>${channels.map((ch) => renderTemplate`<option${addAttribute(ch.id, "value")} data-astro-cid-ticee434>#${ch.name}</option>`)}</select> </div> <div class="dfx-field" data-astro-cid-ticee434> <span class="dfx-label" data-astro-cid-ticee434>${dt("Entry method")}</span> <div class="dfx-chips" data-astro-cid-ticee434> <label class="dfx-chip" data-astro-cid-ticee434><input type="radio" name="entry_mode" value="" checked data-astro-cid-ticee434>${dt("Server default")}</label> <label class="dfx-chip" data-astro-cid-ticee434><input type="radio" name="entry_mode" value="button" data-astro-cid-ticee434>${dt("Button")}</label> <label class="dfx-chip" data-astro-cid-ticee434><input type="radio" name="entry_mode" value="reaction" data-astro-cid-ticee434>${dt("Reaction")}</label> </div> </div> </div> </section> <section class="dfx-sec" data-astro-cid-ticee434> <div class="dfx-sec-head" data-astro-cid-ticee434><h2 data-astro-cid-ticee434>${dt("Extras")}</h2><p data-astro-cid-ticee434>${dt("Everything here is optional.")}</p></div> <div class="dfx-grid dfx-grid-3" data-astro-cid-ticee434> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Claim time")} <span class="gw-muted" data-astro-cid-ticee434>${dt("optional")}</span></label><input type="text" name="claim_time" maxlength="12" placeholder="5m" data-astro-cid-ticee434></div> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Bonus-entry preset")}</label> <select name="preset" data-astro-cid-ticee434><option value="" data-astro-cid-ticee434>${dt("None")}</option>${presets.map((preset) => renderTemplate`<option${addAttribute(preset.name, "value")} data-astro-cid-ticee434>${preset.name}</option>`)}</select> </div> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Design")}</label> <select name="embed_template" data-astro-cid-ticee434><option value="" data-astro-cid-ticee434>${dt("Server default")}</option>${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")} data-astro-cid-ticee434>${name}</option>`)}</select> </div> </div> </section> <div class="dfx-foot" data-astro-cid-ticee434><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:rocket-launch-fill", "width": "13", "height": "13", "data-astro-cid-ticee434": true })}${dt("Start giveaway")}</button></div> </form> <div class="gwx-head" data-astro-cid-ticee434> <h2 data-astro-cid-ticee434>${dt("Running now")} <span class="gwx-count" data-astro-cid-ticee434>${active.length}</span></h2> </div> ${active.length === 0 ? renderTemplate`<p class="gwx-empty" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:timer-fill", "width": "18", "height": "18", "data-astro-cid-ticee434": true })}${dt("Nothing running.")}</p>` : renderTemplate`<div class="gw-active-list gwx-rows dgl-stagger"${addAttribute(`/dash/guild/${guildId}/live?kind=giveaways`, "data-live-url")} data-astro-cid-ticee434> ${active.map((g) => renderTemplate`<div class="gw-active-row gwx-row"${addAttribute(g.id, "data-giveaway-id")} data-astro-cid-ticee434> <span class="gwx-icon gwx-live" aria-hidden="true" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:timer-fill", "width": "17", "height": "17", "data-astro-cid-ticee434": true })}</span> <div class="gwx-row-main" data-astro-cid-ticee434> <b class="gw-active-prize" data-astro-cid-ticee434>${g.prize}</b> <span class="gwx-meta" data-astro-cid-ticee434> <span class="gwx-pill" data-astro-cid-ticee434>${g.winnersCount} ${g.winnersCount === 1 ? dt("winner") : dt("winners")}</span> <span class="gwx-pill" data-astro-cid-ticee434><b data-gw-entries data-astro-cid-ticee434>${g.entries}</b> ${g.entries === 1 ? dt("entry") : dt("entries")}</span> <span class="gwx-ends" data-astro-cid-ticee434>${dt("ends {d}", { d: new Date(g.endsAt).toLocaleString(dashLang) })}</span> </span> </div> <input type="checkbox" class="gw-edit-check"${addAttribute(`gw-edit-${g.id}`, "id")} hidden data-astro-cid-ticee434> <span class="gw-row-actions gwx-actions" data-astro-cid-ticee434> ${g.messageId && g.channelId && renderTemplate`<a class="gw-link"${addAttribute(`https://discord.com/channels/${guildId}/${g.channelId}/${g.messageId}`, "href")} target="_blank" rel="noopener" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-square-out", "width": "13", "height": "13", "data-astro-cid-ticee434": true })}${dt("Open in Discord")}</a>`} <label class="gw-text-btn"${addAttribute(`gw-edit-${g.id}`, "for")} data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "13", "height": "13", "data-astro-cid-ticee434": true })}${dt("Edit")}</label> <form method="POST" data-no-dirty data-astro-cid-ticee434><input type="hidden" name="action" value="end_giveaway" data-astro-cid-ticee434><input type="hidden" name="giveaway_id"${addAttribute(g.id, "value")} data-astro-cid-ticee434><button type="submit" class="gw-text-btn gwx-end"${addAttribute(dt("End this giveaway now and draw the winners?"), "data-confirm")} data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:stop-circle-fill", "width": "13", "height": "13", "data-astro-cid-ticee434": true })}${dt("End now")}</button></form> </span> <div class="gwx-edit" data-astro-cid-ticee434><div class="gwx-edit-in" data-astro-cid-ticee434> <form method="POST" class="gwx-edit-form" data-no-dirty data-astro-cid-ticee434> <input type="hidden" name="action" value="edit_giveaway" data-astro-cid-ticee434> <input type="hidden" name="giveaway_id"${addAttribute(g.id, "value")} data-astro-cid-ticee434> <div class="dfx-grid" data-astro-cid-ticee434> <div class="dfx-field dfx-wide" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Prize")}</label><textarea name="prize" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count maxlength="256" autocomplete="off" data-astro-cid-ticee434>${g.prize}</textarea></div> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("Winners")}</label><input type="number" name="winners"${addAttribute(g.winnersCount, "value")} min="1" max="50" data-astro-cid-ticee434></div> <div class="dfx-field" data-astro-cid-ticee434><label data-astro-cid-ticee434>${dt("New end, counted from now")}</label><input type="text" name="duration"${addAttribute(dt("e.g. 2h or 1d 6h (empty keeps it)"), "placeholder")} maxlength="30" autocomplete="off" data-astro-cid-ticee434></div> </div> <div class="dfx-foot" data-astro-cid-ticee434><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-ticee434": true })}${dt("Save changes")}</button></div> </form> </div></div> </div>`)} </div>`} <div class="gwx-head gwx-gap" data-astro-cid-ticee434> <h2 data-astro-cid-ticee434>${dt("Ended")} <span class="gwx-count" data-astro-cid-ticee434>${ended.length}</span></h2> </div> ${ended.length === 0 ? renderTemplate`<p class="gwx-empty" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trophy-fill", "width": "18", "height": "18", "data-astro-cid-ticee434": true })}${dt("No giveaway has ended yet.")}</p>` : renderTemplate`<div class="gw-active-list gwx-rows dgl-stagger" data-astro-cid-ticee434> ${ended.map((g) => renderTemplate`<div class="gw-active-row gwx-row" data-astro-cid-ticee434> <span class="gwx-icon gwx-done" aria-hidden="true" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trophy-fill", "width": "17", "height": "17", "data-astro-cid-ticee434": true })}</span> <div class="gwx-row-main" data-astro-cid-ticee434> <b class="gw-active-prize" data-astro-cid-ticee434>${g.prize}</b> <span class="gwx-meta" data-astro-cid-ticee434> <span class="gwx-pill" data-astro-cid-ticee434>${g.winnersCount} ${g.winnersCount === 1 ? dt("winner") : dt("winners")}</span> <span class="gwx-ends" data-astro-cid-ticee434>${dt("ended {d}", { d: new Date(g.endsAt).toLocaleString(dashLang) })}</span> </span> </div> <span class="gw-row-actions gwx-actions" data-astro-cid-ticee434> ${g.messageId && renderTemplate`<a class="gw-link"${addAttribute(`https://discord.com/channels/${guildId}/${g.channelId}/${g.messageId}`, "href")} target="_blank" rel="noopener" data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-square-out", "width": "13", "height": "13", "data-astro-cid-ticee434": true })}${dt("Open in Discord")}</a>`} <form method="POST" class="gwx-reroll" data-no-dirty data-astro-cid-ticee434><input type="hidden" name="action" value="reroll_giveaway" data-astro-cid-ticee434><input type="hidden" name="giveaway_id"${addAttribute(g.id, "value")} data-astro-cid-ticee434><div class="dfx-field gwx-mini" data-astro-cid-ticee434><input type="number" name="winners" min="1" max="50"${addAttribute(dt("How many"), "placeholder")}${addAttribute(dt("How many"), "aria-label")} data-astro-cid-ticee434></div><button type="submit" class="gw-text-btn"${addAttribute(dt("Draw new winners for this giveaway?"), "data-confirm")} data-astro-cid-ticee434>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrows-clockwise-fill", "width": "13", "height": "13", "data-astro-cid-ticee434": true })}${dt("Draw again")}</button></form> </span> </div>`)} </div>`} </div>`}${selectedSection === "settings" && renderTemplate`${renderComponent($$result2, "EmojiPicker", $$EmojiPicker, { "customEmojis": [], "data-astro-cid-ticee434": true })}`}` }));
}, "/home/runner/work/petto-web/petto-web/src/components/DashGiveaways.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Giveaways = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Giveaways;
  const dt = makeT(getDashLang(Astro2));
  const { id } = Astro2.params;
  const section = Astro2.url.searchParams.get("section") ?? "settings";
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  const premiumActive = await hasPremiumForGuild(Astro2, session.userId, id);
  const giveawayPresetLimit = planLimits(premiumActive).giveawayPresets;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
  function parseDurationMs(value) {
    if (!value) return 0;
    const match = /^(\d+(?:\.\d+)?)\s*(s|m|h|d|w)$/i.exec(value);
    if (!match) return 0;
    const units = { s: 1e3, m: 6e4, h: 36e5, d: 864e5, w: 6048e5 };
    return Math.max(0, Math.round(Number(match[1]) * units[match[2].toLowerCase()]));
  }
  let saved = false;
  let giveawayError = null;
  let giveawayNote = null;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    if (action === "start_giveaway" || action === "edit_giveaway" || action === "end_giveaway" || action === "reroll_giveaway") {
      const verb = action === "start_giveaway" ? "start" : action === "edit_giveaway" ? "edit" : action === "end_giveaway" ? "end" : "reroll";
      const result = await callPettoGiveaway(Astro2, id, session.userId, verb, {
        id: Number(form.get("giveaway_id") ?? 0),
        prize: String(form.get("prize") ?? ""),
        winners: String(form.get("winners") ?? ""),
        duration: String(form.get("duration") ?? ""),
        claim_time: String(form.get("claim_time") ?? ""),
        channel_id: String(form.get("channel_id") ?? ""),
        preset: String(form.get("preset") ?? ""),
        embed_template: String(form.get("embed_template") ?? ""),
        entry_mode: String(form.get("entry_mode") ?? "")
      });
      if (result.ok) {
        saved = true;
        if (verb === "reroll" && result.winners?.length) giveawayNote = dt("New winner(s): {list}", { list: result.winners.map((winner) => `<@${winner}>`).join(", ") });
      } else {
        giveawayError = result.error === "unknown_action" && verb === "edit" ? dt("The bot has not been updated to change a giveaway yet. Try again in a few minutes.") : result.message ?? dt("The giveaway action failed. Try again.");
      }
    } else if (action === "config") {
      const hasDesignColumns = "winner_embed_template" in ((await (await fetch(`${apiUrl}/rest/v1/giveaway_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders })).json().catch(() => []))[0] ?? {});
      const messageDesign = (key) => {
        const value = String(form.get(`${key}_embed_template`) ?? "").trim().slice(0, 40) || null;
        return hasDesignColumns || value ? { [`${key}_embed_template`]: value } : {};
      };
      const embedTemplate = String(form.get("embed_template") ?? "").trim() || null;
      await fetch(`${apiUrl}/rest/v1/giveaway_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          embed_template: embedTemplate,
          entry_mode: String(form.get("entry_mode") ?? "button"),
          reaction: String(form.get("reaction") ?? "\u{1F389}").trim().slice(0, 4) || "\u{1F389}",
          winner_message: String(form.get("winner_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 200) || null,
          no_entries_message: String(form.get("no_entries_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 200) || null,
          deny_message: String(form.get("deny_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 200) || null,
          claim_time_message: String(form.get("claim_time_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 200) || null,
          claim_time_over_message: String(form.get("claim_time_over_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 200) || null,
          accept_message: String(form.get("accept_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 200) || null,
          ...messageDesign("winner"),
          ...messageDesign("no_entries"),
          ...messageDesign("deny"),
          ...messageDesign("claim_time"),
          ...messageDesign("claim_time_over"),
          ...messageDesign("accept")
        })
      });
      saved = true;
    } else if (action === "add_preset") {
      const name = String(form.get("name") ?? "").trim().slice(0, 40);
      if (name) {
        const countRes = await fetch(`${apiUrl}/rest/v1/giveaway_presets?guild_id=eq.${id}&select=id`, { headers: apiHeaders });
        const current = countRes.ok ? await countRes.json() : null;
        if (current && current.length < giveawayPresetLimit) {
          const res = await fetch(`${apiUrl}/rest/v1/giveaway_presets`, {
            method: "POST",
            headers: { ...apiHeaders, Prefer: "return=minimal" },
            body: JSON.stringify({ guild_id: id, name })
          });
          saved = res.ok;
        }
      }
    } else if (action === "delete_preset") {
      const presetId = encodeURIComponent(String(form.get("preset_id") ?? ""));
      await fetch(`${apiUrl}/rest/v1/giveaway_presets?id=eq.${presetId}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    } else if (action === "set_preset_levels") {
      const presetId = Number(form.get("preset_id") ?? 0);
      const minLevel = Math.max(0, Math.min(1e4, Math.floor(Number(form.get("min_level") ?? 0) || 0)));
      const minVoiceLevel = Math.max(0, Math.min(1e4, Math.floor(Number(form.get("min_voice_level") ?? 0) || 0)));
      if (presetId) {
        const res = await fetch(`${apiUrl}/rest/v1/giveaway_presets?id=eq.${presetId}&guild_id=eq.${id}`, {
          method: "PATCH",
          headers: { ...apiHeaders, Prefer: "return=minimal" },
          body: JSON.stringify({ min_level: minLevel, min_voice_level: minVoiceLevel })
        });
        saved = res.ok;
      }
    } else if (action === "add_preset_level" || action === "delete_preset_level") {
      const presetId = Number(form.get("preset_id") ?? 0);
      const source = String(form.get("source") ?? "text") === "voice" ? "voice" : "text";
      const level = Math.max(1, Math.min(1e4, Math.floor(Number(form.get("level") ?? 0) || 0)));
      const owned = presetId ? await fetch(`${apiUrl}/rest/v1/giveaway_presets?id=eq.${presetId}&guild_id=eq.${id}&select=id`, { headers: apiHeaders }) : null;
      const ownsIt = owned?.ok ? (await owned.json()).length > 0 : false;
      if (ownsIt && action === "delete_preset_level") {
        const res = await fetch(`${apiUrl}/rest/v1/giveaway_preset_levels?preset_id=eq.${presetId}&source=eq.${source}&level=eq.${level}`, { method: "DELETE", headers: apiHeaders });
        saved = res.ok;
      } else if (ownsIt) {
        const entries = Math.max(1, Math.min(1e3, Math.floor(Number(form.get("entries") ?? 1) || 1)));
        const countRes = await fetch(`${apiUrl}/rest/v1/giveaway_preset_levels?preset_id=eq.${presetId}&select=level`, { headers: apiHeaders });
        const existing = countRes.ok ? await countRes.json() : [];
        if (existing.length < 25) {
          const res = await fetch(`${apiUrl}/rest/v1/giveaway_preset_levels?on_conflict=preset_id,source,level`, {
            method: "POST",
            headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify({ preset_id: presetId, source, level, entries })
          });
          saved = res.ok;
        }
      }
    } else if (action === "add_preset_role") {
      const presetId = Number(form.get("preset_id") ?? 0);
      const roleId = String(form.get("role_id") ?? "");
      const entries = Math.max(1, Math.min(100, Number(form.get("entries") ?? 1) || 1));
      const claimTimeMs = parseDurationMs(String(form.get("claim_time") ?? "").trim());
      const entriesStack = form.get("entries_stack") === "on";
      const claimTimeStack = form.get("claim_time_stack") === "on";
      if (presetId && roleId) {
        await fetch(`${apiUrl}/rest/v1/giveaway_preset_roles?on_conflict=preset_id,role_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ preset_id: presetId, role_id: roleId, entries, claim_time_ms: claimTimeMs, entries_stack: entriesStack, claim_time_stack: claimTimeStack })
        });
        saved = true;
      }
    }
  }
  const GIVEAWAY_SECTIONS = ["settings", "presets", "active"];
  const shown = GIVEAWAY_SECTIONS.includes(section) ? section : "settings";
  const needs = (...sections) => sections.includes(shown);
  const [guildInfo, configRes, activeRes, presetsRes, rolesRes, embedTemplatesRes, channelsRes, endedRes] = await Promise.all([
    getGuildInfo(id, botToken),
    needs("settings") ? fetch(`${apiUrl}/rest/v1/giveaway_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }) : null,
    needs("active") ? fetch(`${apiUrl}/rest/v1/giveaways?guild_id=eq.${id}&ended=eq.false&select=id,prize,winners_count,ends_at,host_id,channel_id,message_id&order=ends_at.asc`, { headers: apiHeaders }) : null,
    needs("presets", "active") ? fetch(`${apiUrl}/rest/v1/giveaway_presets?guild_id=eq.${id}&select=id,name,min_level,min_voice_level&order=name.asc`, { headers: apiHeaders }) : null,
    needs("presets") ? getGuildList(Astro2, id, botToken, "roles") : null,
    needs("settings", "active") ? fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders }) : null,
    needs("active") ? getGuildList(Astro2, id, botToken, "channels") : null,
    needs("active") ? fetch(`${apiUrl}/rest/v1/giveaways?guild_id=eq.${id}&ended=eq.true&select=id,prize,winners_count,ends_at,channel_id,message_id&order=ends_at.desc&limit=8`, { headers: apiHeaders }) : null
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const configRows = configRes?.ok ? await configRes.json() : [];
  const c = configRows[0] ?? {};
  const config = {
    embedTemplate: c.embed_template ?? "",
    entryMode: c.entry_mode ?? "button",
    reaction: c.reaction ?? "\u{1F389}",
    winnerMessage: c.winner_message ?? "",
    noEntriesMessage: c.no_entries_message ?? "",
    denyMessage: c.deny_message ?? "",
    claimTimeMessage: c.claim_time_message ?? "",
    claimTimeOverMessage: c.claim_time_over_message ?? "",
    acceptMessage: c.accept_message ?? "",
    winnerMessageEmbed: c.winner_embed_template ?? "",
    noEntriesMessageEmbed: c.no_entries_embed_template ?? "",
    denyMessageEmbed: c.deny_embed_template ?? "",
    claimTimeMessageEmbed: c.claim_time_embed_template ?? "",
    claimTimeOverMessageEmbed: c.claim_time_over_embed_template ?? "",
    acceptMessageEmbed: c.accept_embed_template ?? ""
  };
  const rawActive = activeRes?.ok ? await activeRes.json() : [];
  const active = await Promise.all(
    rawActive.map(async (g) => {
      const countRes = await fetch(`${apiUrl}/rest/v1/giveaway_entries?giveaway_id=eq.${g.id}&select=user_id`, {
        headers: { ...apiHeaders, Prefer: "count=exact" }
      });
      const entries = countRes.ok ? countRes.headers.get("content-range")?.split("/")[1] ?? "0" : "0";
      return { id: g.id, prize: g.prize, winnersCount: g.winners_count, endsAt: g.ends_at, entries: Number(entries), hostId: g.host_id, channelId: g.channel_id, messageId: g.message_id };
    })
  );
  const rawPresets = presetsRes?.ok ? await presetsRes.json() : [];
  const presetIds = rawPresets.map((p) => p.id);
  let rawPresetRoles = [];
  let rawPresetLevels = [];
  if (presetIds.length > 0 && needs("presets")) {
    const presetRolesRes = await fetch(`${apiUrl}/rest/v1/giveaway_preset_roles?preset_id=in.(${presetIds.join(",")})&select=preset_id,role_id,entries,claim_time_ms,entries_stack,claim_time_stack`, { headers: apiHeaders });
    rawPresetRoles = presetRolesRes.ok ? await presetRolesRes.json() : [];
    const presetLevelsRes = await fetch(`${apiUrl}/rest/v1/giveaway_preset_levels?preset_id=in.(${presetIds.join(",")})&select=preset_id,source,level,entries&order=level.asc`, { headers: apiHeaders }).catch(() => null);
    rawPresetLevels = presetLevelsRes?.ok ? await presetLevelsRes.json() : [];
  }
  const presets = rawPresets.map((p) => ({
    id: p.id,
    name: p.name,
    minLevel: Number(p.min_level ?? 0),
    minVoiceLevel: Number(p.min_voice_level ?? 0),
    levels: rawPresetLevels.filter((pl) => pl.preset_id === p.id).map((pl) => ({ source: pl.source === "voice" ? "voice" : "text", level: Number(pl.level), entries: Number(pl.entries) })),
    roles: rawPresetRoles.filter((pr) => pr.preset_id === p.id).map((pr) => ({ roleId: pr.role_id, entries: pr.entries, claimTimeMs: pr.claim_time_ms ?? 0, entriesStack: pr.entries_stack ?? false, claimTimeStack: pr.claim_time_stack ?? false }))
  }));
  const allRoles = rolesRes?.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((r) => r.name !== "@everyone").sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const allChannels = channelsRes?.ok ? await channelsRes.json() : [];
  const channels = (Array.isArray(allChannels) ? allChannels : []).filter((ch) => Number(ch.type) === 0 || Number(ch.type) === 5).sort((a, b) => a.position - b.position).map((ch) => ({ id: ch.id, name: ch.name }));
  const ended = (endedRes?.ok ? await endedRes.json() : []).map((g) => ({ id: g.id, prize: g.prize, winnersCount: g.winners_count, endsAt: g.ends_at, channelId: g.channel_id, messageId: g.message_id }));
  const embedTemplateNames = embedTemplatesRes?.ok ? (await embedTemplatesRes.json()).map((t) => t.name) : [];
  return renderTemplate`${renderComponent($$result, "DashGiveaways", $$DashGiveaways, { "user": session, "channels": channels, "ended": ended, "giveawayError": giveawayError, "giveawayNote": giveawayNote, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "config": config, "active": active, "presets": presets, "roles": roles, "embedTemplateNames": embedTemplateNames, "premiumActive": premiumActive, "saved": saved, "section": section })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/giveaways.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/giveaways.astro";
const $$url = "/dash/guild/[id]/giveaways";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Giveaways,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
