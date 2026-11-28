import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$EmojiPicker } from '../../../../chunks/EmojiPicker_0tfnRmiq.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$SelectSource } from '../../../../chunks/SelectSource_Dp8aydFk.mjs';
import { $ as $$SelectChosen } from '../../../../chunks/SelectChosen_B0lELVHS.mjs';
import { $ as $$UserChip } from '../../../../chunks/UserChip_Bm_uT4Mw.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { P as PREMIUM_LIMITS, F as FREE_LIMITS, p as planLimits } from '../../../../chunks/planLimits_BFQNR8Tb.mjs';
/* empty css                                             */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getGuildEmojis } from '../../../../chunks/guildEmojis_CIHVnrpZ.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { i as isV2Data } from '../../../../chunks/embedSchema_Bj4vwR3q.mjs';
import { g as guildHasPremium } from '../../../../chunks/guildPremium_CRr06_t0.mjs';
import { d as describeTeam } from '../../../../chunks/team_C2OWrCGw.mjs';
import { c as periodStartInstant } from '../../../../chunks/dashDays_BDYG_Ap4.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashPartners = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashPartners;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, customEmojis = [], config, channels, roles, embedTemplates, blacklist, stats, people = {}, channelLimit, ready, saved, notice } = Astro2.props;
  const replies = [
    ["completed", "Partnership completed", "{partner.manager} thanks for the partnership with **{partner.name}**! You have {partner.count_total} in total ({partner.count_week} this week)."],
    ["cooldown", "Partner cooldown", "{user.mention} you partnered with **{partner.name}** recently. You can do it again {partner.cooldown_ends}."],
    ["invalid_invite", "Invalid invite", "{user.mention} that invite is not valid or has expired."],
    ["member_requirement", "Member requirement", "{user.mention} **{partner.name}** has {partner.members} members and at least {partner.min_members} are needed."],
    ["blacklisted", "Partner blacklist", "{user.mention} that server is not allowed as a partner."],
    ["self_partner", "Self partner", "{user.mention} that invite is for this same server."],
    ["age_requirement", "Partner age requirement", "{user.mention} **{partner.name}** is too new: it has to be at least {partner.min_age_days} days old."],
    ["nsfw_blocked", "NSFW server", "{user.mention} **{partner.name}** is marked as an NSFW server, so it can not be a partner."],
    ["keyword_blocked", "Blocked keyword", "{user.mention} **{partner.name}** is not allowed as a partner: it has a word this server does not accept."],
    ["manager_welcome", "Partner Manager welcome", "Welcome to the team, {user.mention}! Post the invite of a partner server in a partner channel and I will count it."]
  ];
  const partnerVars = [
    { tok: "{partner.name}", desc: dt("Name of the partner server") },
    { tok: "{partner.members}", desc: dt("Members of the partner server") },
    { tok: "{partner.manager}", desc: dt("The Partner Manager who posted it") },
    { tok: "{partner.count_week}", desc: dt("Partnerships of the manager this week") },
    { tok: "{partner.count_total}", desc: dt("Partnerships of the manager in total") },
    { tok: "{partner.rank_week}", desc: dt("Rank of the manager this week") },
    { tok: "{partner.top_week}", desc: dt("Top manager of the week") },
    { tok: "{partner.server_week}", desc: dt("Partnerships of the server this week") },
    { tok: "{partner.cooldown_ends}", desc: dt("When it can partner again") },
    { tok: "{partner.min_members}", desc: dt("Members needed") },
    { tok: "{partner.min_age_days}", desc: dt("Days old the server must be") }
  ];
  const changed = (key) => Boolean(config.messages[key]?.text || config.messages[key]?.template);
  return renderTemplate(_a || (_a = __template(["", ` <script>
  (function () {
    if (window.__ptTools) return;
    window.__ptTools = true;
    var count = function (box) {
      var area = box.querySelector('textarea[name^="text_"]'); var out = box.querySelector('[data-pt-count]');
      if (area && out) out.textContent = area.value.length + ' / ' + (area.maxLength > 0 ? area.maxLength : 2000);
    };
    var all = function () { Array.prototype.forEach.call(document.querySelectorAll('.pt-reply'), count); };
    all();
    // A role, a channel or a variable goes where the cursor is in the text of the reply.
    document.addEventListener('change', function (event) {
      var select = event.target && event.target.closest && event.target.closest('select[data-pt-insert]');
      if (!select || !select.value) return;
      var box = select.closest('.pt-reply'); var area = box && box.querySelector('textarea[name^="text_"]');
      var kind = select.getAttribute('data-pt-insert');
      var text = kind === 'role' ? '<@&' + select.value + '>' : kind === 'channel' ? '<#' + select.value + '>' : select.value;
      select.value = '';
      if (!area || area.getAttribute('data-tpl-locked') === '1') return;
      var start = area.selectionStart == null ? area.value.length : area.selectionStart; var end = area.selectionEnd == null ? start : area.selectionEnd;
      area.setRangeText(text, start, end, 'end');
      area.focus();
      area.dispatchEvent(new Event('input', { bubbles: true }));
    });
    document.addEventListener('input', function (event) {
      var area = event.target && event.target.matches && event.target.matches('.pt-reply textarea') ? event.target : null;
      if (area) count(area.closest('.pt-reply'));
    });
    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target : null; if (!target) return;
      var reset = target.closest('[data-pt-reset]');
      if (reset) {
        var box = reset.closest('.pt-reply');
        var area = box.querySelector('textarea[name^="text_"]'); var tpl = box.querySelector('select[name^="tpl_"]');
        if (area) { area.value = ''; area.dispatchEvent(new Event('input', { bubbles: true })); }
        if (tpl) { tpl.value = ''; tpl.dispatchEvent(new Event('input', { bubbles: true })); }
        return;
      }
      var bulk = target.closest('[data-pt-bulk]');
      if (bulk) Array.prototype.forEach.call(document.querySelectorAll('.pt-reply'), function (d) { d.open = bulk.getAttribute('data-pt-bulk') === 'open'; });
    });
  })();
<\/script> `])), renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "partners", "pageTitle": "Partners", "data-astro-cid-vd6fafgt": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 data-astro-cid-vd6fafgt>${dt("Partners")}</h1> ${renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "emojis": customEmojis, "vars": partnerVars, "data-astro-cid-vd6fafgt": true })} ${saved && renderTemplate`<div class="pt-flash" data-astro-cid-vd6fafgt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-vd6fafgt": true })}${dt("Saved.")}</div>`}${notice === "bad_cooldown" && renderTemplate`<div class="pt-flash pt-flash-warn" data-astro-cid-vd6fafgt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-vd6fafgt": true })}${dt("The cooldown is written like 3d 4h, 12h or 30m, up to a year. The one that was saved stays.")}</div>`}${notice === "channel_limit" && renderTemplate`<div class="pt-flash pt-flash-warn" data-astro-cid-vd6fafgt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-vd6fafgt": true })}${dt("Only the first {a} channels were kept. Premium raises the limit.", { a: channelLimit })}</div>`}${notice === "bad_server" && renderTemplate`<div class="pt-flash pt-flash-warn" data-astro-cid-vd6fafgt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-vd6fafgt": true })}${dt("Give the ID of the server, a number of 17 to 20 digits.")}</div>`}${!ready && renderTemplate`<div class="pt-flash pt-flash-warn" data-astro-cid-vd6fafgt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-vd6fafgt": true })}${dt("This arrives with the next Petto update.")}</div>`}${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "against": dt("vs before"), "tiles": [
    { label: dt("Today"), value: stats.today, tone: "messages", change: stats.todayChange },
    { label: dt("This week"), value: stats.week, tone: "joins", change: stats.weekChange },
    { label: dt("All time"), value: stats.total, tone: "invites" }
  ], "data-astro-cid-vd6fafgt": true })} <form method="POST" class="pt-form" data-astro-cid-vd6fafgt> <input type="hidden" name="action" value="save" data-astro-cid-vd6fafgt> <label class="pt-check" data-astro-cid-vd6fafgt><input type="checkbox" name="enabled"${addAttribute(config.enabled, "checked")} data-astro-cid-vd6fafgt>${dt("Count partnerships")}</label> <div class="pt-grid" data-astro-cid-vd6fafgt> <div class="pt-field pt-wide" data-astro-cid-vd6fafgt><label data-astro-cid-vd6fafgt>${dt("Partner channels")}</label> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "channel_ids", "options": channels.map((ch) => ({ id: ch.id, name: `#${ch.name}` })), "selected": config.channelIds, "placeholder": dt("Search channels..."), "data-astro-cid-vd6fafgt": true })} <span class="pt-hint" data-astro-cid-vd6fafgt>${dt("Free servers can have {a}, Premium {b}.", { a: FREE_LIMITS.partnerChannels, b: PREMIUM_LIMITS.partnerChannels })}</span> </div> <div class="pt-field" data-astro-cid-vd6fafgt><label data-astro-cid-vd6fafgt>${dt("Partner Manager role")}</label> <select name="manager_role_id" data-fill="pt-roles" data-astro-cid-vd6fafgt><option value="" data-astro-cid-vd6fafgt>${dt("Anyone")}</option>${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": roles, "selected": config.managerRoleId, "data-astro-cid-vd6fafgt": true })}</select> <span class="pt-hint" data-astro-cid-vd6fafgt>${dt("Only the members with this role are counted. Empty counts anyone who posts in a partner channel.")}</span> </div> <div class="pt-field" data-astro-cid-vd6fafgt><label data-astro-cid-vd6fafgt>${dt("Welcome channel")}</label> <select name="welcome_channel_id" data-fill="pt-ch" data-astro-cid-vd6fafgt><option value="" data-astro-cid-vd6fafgt>${dt("None")}</option>${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": channels, "selected": config.welcomeChannelId, "prefix": "#", "data-astro-cid-vd6fafgt": true })}</select> <span class="pt-hint" data-astro-cid-vd6fafgt>${dt("Where a new Partner Manager is welcomed when they are given the role. Empty welcomes only with the command.")}</span> </div> </div> <section class="pt-sec" data-astro-cid-vd6fafgt> <h2 data-astro-cid-vd6fafgt>${dt("Requirements")}</h2> <div class="pt-grid pt-grid-3" data-astro-cid-vd6fafgt> <div class="pt-field" data-astro-cid-vd6fafgt><label data-astro-cid-vd6fafgt>${dt("Minimum members")}</label><input type="number" name="min_members" min="0" max="10000000"${addAttribute(config.minMembers, "value")} data-astro-cid-vd6fafgt></div> <div class="pt-field" data-astro-cid-vd6fafgt><label data-astro-cid-vd6fafgt>${dt("Minimum age (days)")}</label><input type="number" name="min_age_days" min="0" max="3650"${addAttribute(config.minAgeDays, "value")} data-astro-cid-vd6fafgt></div> <div class="pt-field" data-astro-cid-vd6fafgt><label data-astro-cid-vd6fafgt>${dt("Cooldown")}</label><input type="text" name="cooldown"${addAttribute(config.cooldown, "value")} maxlength="30" placeholder="3d 4h" data-astro-cid-vd6fafgt></div> </div> <span class="pt-hint" data-astro-cid-vd6fafgt>${dt("0 means no requirement. The cooldown is how long before the same server can partner again, written like 3d 4h, 12h or 30m. Empty is no cooldown.")}</span> <div class="pt-switches" data-astro-cid-vd6fafgt> <label class="pt-switch" data-astro-cid-vd6fafgt><input type="checkbox" name="block_nsfw"${addAttribute(config.blockNsfw, "checked")} data-astro-cid-vd6fafgt><span data-astro-cid-vd6fafgt><b data-astro-cid-vd6fafgt>${dt("Refuse servers that Discord marks as NSFW")}</b></span></label> <label class="pt-switch" data-astro-cid-vd6fafgt><input type="checkbox" name="keep_original"${addAttribute(config.keepOriginal, "checked")} data-astro-cid-vd6fafgt><span data-astro-cid-vd6fafgt><b data-astro-cid-vd6fafgt>${dt("Keep the message when a partnership is refused")}</b></span></label> </div> <div class="pt-grid" data-astro-cid-vd6fafgt> <div class="pt-field pt-wide" data-astro-cid-vd6fafgt><label data-astro-cid-vd6fafgt>${dt("Blocked words")}</label> <textarea name="blocked_keywords" class="dgl-autogrow pt-one" rows="1" maxlength="400"${addAttribute(dt("18+, nsfw, gambling"), "placeholder")} data-astro-cid-vd6fafgt>${config.blockedKeywords}</textarea> <span class="pt-hint" data-astro-cid-vd6fafgt>${dt("Servers with one of these words in their name or description are refused. Separated by commas, up to 10.")}</span> </div> <div class="pt-field" data-astro-cid-vd6fafgt><label data-astro-cid-vd6fafgt>${dt("Reaction when it counts")}</label><input type="text" name="react_emoji" data-emoji-input${addAttribute(config.reactEmoji, "value")} maxlength="64" placeholder="🤝" data-astro-cid-vd6fafgt></div> </div> </section> <section class="pt-sec" data-astro-cid-vd6fafgt> <div class="pt-sec-head" data-astro-cid-vd6fafgt> <h2 data-astro-cid-vd6fafgt>${dt("Replies")}</h2> <span class="pt-bulk" data-astro-cid-vd6fafgt><button type="button" class="btn btn-ghost btn-sm" data-pt-bulk="open" data-astro-cid-vd6fafgt>${dt("Expand all")}</button><button type="button" class="btn btn-ghost btn-sm" data-pt-bulk="close" data-astro-cid-vd6fafgt>${dt("Collapse all")}</button></span> </div> <span class="pt-hint" data-astro-cid-vd6fafgt>${dt("Each reply can be a text or one of your saved embeds. Empty uses the default. Variables: {partner.name}, {partner.members}, {partner.manager}, {partner.count_week}, {partner.count_total}, {partner.rank_week}, {partner.top_week}, {partner.server_week} and the usual ones like {user.mention}.")}</span> <span class="pt-hint" data-astro-cid-vd6fafgt>${dt("Pick a role, a channel or a variable and it goes where the cursor is in the text.")}</span> ${replies.map(([key, label, fallback]) => renderTemplate`<details class="pt-reply"${addAttribute(changed(key), "open")} data-astro-cid-vd6fafgt> <summary data-astro-cid-vd6fafgt><span class="pt-reply-title" data-astro-cid-vd6fafgt>${dt(label)}</span>${changed(key) && renderTemplate`<span class="pt-dot"${addAttribute(dt("Changed"), "title")} data-astro-cid-vd6fafgt></span>`}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "pt-caret", "width": "13", "height": "13", "data-astro-cid-vd6fafgt": true })}</summary> <div class="pt-reply-body" data-astro-cid-vd6fafgt> <div class="pt-tools" data-astro-cid-vd6fafgt> <select class="pt-ins" data-pt-insert="role" data-fill="pt-roles"${addAttribute(dt("Mention a role"), "aria-label")} data-astro-cid-vd6fafgt><option value="" data-astro-cid-vd6fafgt>${dt("Mention a role")}</option></select> <select class="pt-ins" data-pt-insert="channel" data-fill="pt-ch"${addAttribute(dt("Mention a channel"), "aria-label")} data-astro-cid-vd6fafgt><option value="" data-astro-cid-vd6fafgt>${dt("Mention a channel")}</option></select> <select class="pt-ins" data-pt-insert="var"${addAttribute(dt("Add a variable"), "aria-label")} data-astro-cid-vd6fafgt><option value="" data-astro-cid-vd6fafgt>${dt("Add a variable")}</option>${partnerVars.map((v) => renderTemplate`<option${addAttribute(v.tok, "value")} data-astro-cid-vd6fafgt>${v.tok}</option>`)}</select> </div> <textarea${addAttribute(`text_${key}`, "name")} data-ac class="dgl-autogrow" rows="4" maxlength="2000"${addAttribute(fallback, "placeholder")} data-astro-cid-vd6fafgt>${config.messages[key]?.text ?? ""}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-vd6fafgt": true })} <div class="pt-reply-foot" data-astro-cid-vd6fafgt> <select${addAttribute(`tpl_${key}`, "name")}${addAttribute(`text_${key}`, "data-tpl-locks")} data-astro-cid-vd6fafgt><option value="" data-astro-cid-vd6fafgt>${dt("No saved embed")}</option>${embedTemplates.map((tpl) => renderTemplate`<option${addAttribute(tpl.name, "value")}${addAttribute(tpl.name === config.messages[key]?.template, "selected")} data-astro-cid-vd6fafgt>${tpl.name}${tpl.v2 ? " (V2)" : ""}</option>`)}</select> <span class="pt-count" data-pt-count data-astro-cid-vd6fafgt>0 / 2000</span> <button type="button" class="btn btn-ghost btn-sm pt-reset" data-pt-reset data-astro-cid-vd6fafgt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-counter-clockwise-bold", "width": "13", "height": "13", "data-astro-cid-vd6fafgt": true })}${dt("Restore default")}</button> </div> </div> </details>`)} </section> <div class="pt-foot" data-astro-cid-vd6fafgt> <button type="submit" class="btn btn-accent btn-sm"${addAttribute(!ready, "disabled")} data-astro-cid-vd6fafgt>${dt("Save changes")}</button> <span class="pt-hint" data-astro-cid-vd6fafgt>${dt("Commands: !partner stats, !partner leaderboard and !partnerconfig.")}</span> </div> </form> <div class="pt-cards" data-astro-cid-vd6fafgt> <section class="pt-card" data-astro-cid-vd6fafgt> <h2 data-astro-cid-vd6fafgt>${dt("This week")}</h2> ${stats.weekBoard.length ? renderTemplate`<ol data-astro-cid-vd6fafgt>${stats.weekBoard.map((entry) => renderTemplate`<li data-astro-cid-vd6fafgt>${renderComponent($$result2, "UserChip", $$UserChip, { "id": entry.managerId, "person": people[entry.managerId], "data-astro-cid-vd6fafgt": true })}<b data-astro-cid-vd6fafgt>${entry.count}</b></li>`)}</ol>` : renderTemplate`<p class="pt-hint" data-astro-cid-vd6fafgt>${dt("Nobody has a partnership in this period.")}</p>`} </section> <section class="pt-card" data-astro-cid-vd6fafgt> <h2 data-astro-cid-vd6fafgt>${dt("All time")}</h2> ${stats.allBoard.length ? renderTemplate`<ol data-astro-cid-vd6fafgt>${stats.allBoard.map((entry) => renderTemplate`<li data-astro-cid-vd6fafgt>${renderComponent($$result2, "UserChip", $$UserChip, { "id": entry.managerId, "person": people[entry.managerId], "data-astro-cid-vd6fafgt": true })}<b data-astro-cid-vd6fafgt>${entry.count}</b></li>`)}</ol>` : renderTemplate`<p class="pt-hint" data-astro-cid-vd6fafgt>${dt("Nobody has a partnership in this period.")}</p>`} </section> <section class="pt-card" data-astro-cid-vd6fafgt> <h2 data-astro-cid-vd6fafgt>${dt("Blacklist")}</h2> <p class="pt-hint" data-astro-cid-vd6fafgt>${dt("Servers that can never be a partner.")}</p> ${blacklist.length > 0 && renderTemplate`<ul data-astro-cid-vd6fafgt>${blacklist.map((row) => renderTemplate`<li data-astro-cid-vd6fafgt><span data-astro-cid-vd6fafgt><code data-astro-cid-vd6fafgt>${row.server}</code>${row.note && renderTemplate`<small data-astro-cid-vd6fafgt>${row.note}</small>`}</span> <form method="POST" data-no-dirty data-astro-cid-vd6fafgt><input type="hidden" name="action" value="remove_blacklist" data-astro-cid-vd6fafgt><input type="hidden" name="server"${addAttribute(row.server, "value")} data-astro-cid-vd6fafgt><button type="submit" class="pt-x"${addAttribute(dt("Remove"), "aria-label")} data-astro-cid-vd6fafgt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x", "width": "13", "height": "13", "data-astro-cid-vd6fafgt": true })}</button></form></li>`)}</ul>`} <form method="POST" class="pt-add" data-no-dirty data-astro-cid-vd6fafgt> <input type="hidden" name="action" value="add_blacklist" data-astro-cid-vd6fafgt> <input type="text" name="server"${addAttribute(dt("ID of the server"), "placeholder")} inputmode="numeric" maxlength="25" required data-astro-cid-vd6fafgt> <textarea name="note" class="dgl-autogrow" rows="2"${addAttribute(dt("Why (optional)"), "placeholder")}${addAttribute(dt("Why (optional)"), "aria-label")} maxlength="200" data-astro-cid-vd6fafgt></textarea> <button type="submit" class="btn btn-ghost btn-sm"${addAttribute(!ready, "disabled")} data-astro-cid-vd6fafgt>${dt("Add")}</button> </form> </section> </div> ${renderComponent($$result2, "SelectSource", $$SelectSource, { "name": "pt-ch", "items": channels.map((c) => ({ id: c.id, name: c.name })), "prefix": "#", "data-astro-cid-vd6fafgt": true })} ${renderComponent($$result2, "SelectSource", $$SelectSource, { "name": "pt-roles", "items": roles.map((r) => ({ id: r.id, name: r.name })), "data-astro-cid-vd6fafgt": true })} ${renderComponent($$result2, "EmojiPicker", $$EmojiPicker, { "customEmojis": customEmojis, "data-astro-cid-vd6fafgt": true })} ` }));
}, "/home/runner/work/petto-web/petto-web/src/components/DashPartners.astro", void 0);

const UNITS = { w: 10080, d: 1440, h: 60, m: 1 };
const MAX_SPAN_MINUTES = 365 * 24 * 60;
function parseSpan(text) {
  const value = text.trim().toLowerCase();
  if (/^(0|none|off|no)$/.test(value)) return 0;
  if (!value || !/^(?:\d+\s*[wdhm]\s*)+$/.test(value)) return null;
  let minutes = 0;
  for (const match of value.matchAll(/(\d+)\s*([wdhm])/g)) minutes += Number(match[1]) * UNITS[match[2]];
  return minutes > 0 && minutes <= MAX_SPAN_MINUTES ? minutes : null;
}
function formatSpan(minutes) {
  if (!minutes) return "";
  const parts = [];
  let left = minutes;
  for (const [unit, size] of [["w", 10080], ["d", 1440], ["h", 60], ["m", 1]]) {
    const count = Math.floor(left / size);
    if (count) {
      parts.push(`${count}${unit}`);
      left -= count * size;
    }
  }
  return parts.join(" ");
}

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Partners = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Partners;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const RESPONSE_KEYS = ["completed", "cooldown", "invalid_invite", "member_requirement", "blacklisted", "self_partner", "age_requirement", "nsfw_blocked", "keyword_blocked", "manager_welcome"];
  const premium = await guildHasPremium(apiUrl, apiHeaders, id);
  const channelLimit = planLimits(premium).partnerChannels;
  const snowflake = /^\d{15,25}$/;
  const idOrNull = (value) => snowflake.test(String(value ?? "")) ? String(value) : null;
  const int = (value, max) => Math.max(0, Math.min(max, Math.floor(Number(value ?? 0)) || 0));
  let saved = false;
  let notice = "";
  let tableMissing = false;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "save");
    if (action === "add_blacklist" || action === "remove_blacklist") {
      const server = String(form.get("server") ?? "").trim();
      if (!snowflake.test(server)) {
        notice = "bad_server";
      } else if (action === "add_blacklist") {
        await ensureGuildRow(apiUrl, apiHeaders, id);
        const res = await fetch(`${apiUrl}/rest/v1/partner_blacklist?on_conflict=guild_id,partner_guild_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, partner_guild_id: server, note: String(form.get("note") ?? "").replace(/\r\n?/g, "\n").trim().slice(0, 200) || null }) });
        saved = res.ok;
      } else {
        const res = await fetch(`${apiUrl}/rest/v1/partner_blacklist?guild_id=eq.${id}&partner_guild_id=eq.${server}`, { method: "DELETE", headers: apiHeaders });
        saved = res.ok;
      }
    } else {
      const messages = {};
      for (const key of RESPONSE_KEYS) {
        const text = String(form.get(`text_${key}`) ?? "").replace(/\r\n?/g, "\n").trim().slice(0, 2e3);
        const template = String(form.get(`tpl_${key}`) ?? "").trim().slice(0, 100);
        if (text || template) messages[key] = { ...text ? { text } : {}, ...template ? { template } : {} };
      }
      const wanted = [...new Set(form.getAll("channel_ids").map(String).filter((value) => snowflake.test(value)))];
      if (wanted.length > channelLimit) notice = "channel_limit";
      const reaction = String(form.get("react_emoji") ?? "").trim();
      const cooldownText = String(form.get("cooldown") ?? "").trim();
      const cooldownMinutes = cooldownText ? parseSpan(cooldownText) : 0;
      if (cooldownMinutes === null) notice = "bad_cooldown";
      const words = [...new Set(String(form.get("blocked_keywords") ?? "").replace(/\r?\n/g, ",").split(",").map((word) => word.trim().toLowerCase()).filter((word) => word && word.length <= 40))].slice(0, 10);
      await ensureGuildRow(apiUrl, apiHeaders, id);
      const res = await fetch(`${apiUrl}/rest/v1/partner_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          enabled: form.get("enabled") === "on",
          channel_ids: wanted.slice(0, channelLimit),
          manager_role_id: snowflake.test(String(form.get("manager_role_id") ?? "")) ? String(form.get("manager_role_id")) : null,
          min_members: int(form.get("min_members"), 1e7),
          min_age_days: int(form.get("min_age_days"), 3650),
          ...cooldownMinutes === null ? {} : { cooldown_minutes: cooldownMinutes, cooldown_days: 0 },
          block_nsfw: form.get("block_nsfw") === "on",
          blocked_keywords: words,
          welcome_channel_id: idOrNull(form.get("welcome_channel_id")),
          keep_original: form.get("keep_original") === "on",
          react_emoji: reaction && reaction.length <= 64 && !/\s/.test(reaction) ? reaction : null,
          messages,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      saved = res.ok;
      tableMissing = !res.ok;
    }
  }
  const customEmojisPromise = getGuildEmojis(id, botToken);
  const [guildInfo, configRes, channelsRes, rolesRes, templatesRes, blacklistRes, logRes] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/partner_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    getGuildList(Astro2, id, botToken, "channels"),
    getGuildList(Astro2, id, botToken, "roles"),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name,data&order=name.asc`, { headers: apiHeaders }),
    fetch(`${apiUrl}/rest/v1/partner_blacklist?guild_id=eq.${id}&select=partner_guild_id,note&order=created_at.desc&limit=100`, { headers: apiHeaders }),
    fetch(`${apiUrl}/rest/v1/partner_log?guild_id=eq.${id}&select=manager_id,partner_name,created_at&order=created_at.desc&limit=5000`, { headers: apiHeaders })
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = configRes.ok && !tableMissing;
  const c = (ready ? (await configRes.json())[0] : null) ?? {};
  const config = {
    enabled: c.enabled ?? false,
    channelIds: c.channel_ids ?? [],
    managerRoleId: c.manager_role_id ?? "",
    minMembers: c.min_members ?? 0,
    minAgeDays: c.min_age_days ?? 0,
    cooldown: formatSpan(c.cooldown_minutes > 0 ? c.cooldown_minutes : (c.cooldown_days ?? 0) * 1440),
    blockNsfw: c.block_nsfw ?? false,
    blockedKeywords: (c.blocked_keywords ?? []).join(", "),
    welcomeChannelId: c.welcome_channel_id ?? "",
    keepOriginal: c.keep_original ?? true,
    reactEmoji: c.react_emoji ?? "",
    messages: c.messages ?? {}
  };
  const channels = (channelsRes.ok ? await channelsRes.json() : []).filter((ch) => ch.type === 0 || ch.type === 5).sort((a, b) => a.position - b.position).map((ch) => ({ id: ch.id, name: ch.name }));
  const roles = (rolesRes.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone").sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const embedTemplates = (templatesRes.ok ? await templatesRes.json() : []).map((row) => ({ name: row.name, v2: isV2Data(row.data) }));
  const blacklist = (blacklistRes.ok ? await blacklistRes.json() : []).map((row) => ({ server: row.partner_guild_id, note: row.note ?? "" }));
  const rows = logRes.ok ? await logRes.json() : [];
  const day = periodStartInstant("day");
  const weekStart = periodStartInstant("week");
  const board = (since) => {
    const byManager = /* @__PURE__ */ new Map();
    for (const row of rows) if (new Date(row.created_at).getTime() >= since) byManager.set(row.manager_id, (byManager.get(row.manager_id) ?? 0) + 1);
    return [...byManager.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([managerId, count]) => ({ managerId, count }));
  };
  const between = (from, to) => rows.filter((row) => {
    const at = new Date(row.created_at).getTime();
    return at >= from && at < to;
  }).length;
  const change = (now, before) => before === 0 ? now === 0 ? 0 : null : Math.round((now - before) / before * 100);
  const todayCount = rows.filter((row) => new Date(row.created_at).getTime() >= day).length;
  const weekCount = rows.filter((row) => new Date(row.created_at).getTime() >= weekStart).length;
  const stats = {
    today: todayCount,
    week: weekCount,
    todayChange: change(todayCount, between(day - 864e5, day)),
    weekChange: change(weekCount, between(weekStart - 7 * 864e5, weekStart)),
    total: rows.length,
    weekBoard: board(weekStart),
    allBoard: board(0),
    recent: rows.slice(0, 5).map((row) => ({ name: row.partner_name ?? "", at: row.created_at }))
  };
  const managerIds = [...new Set([...stats.weekBoard, ...stats.allBoard].map((entry) => entry.managerId))].filter((value) => /^\d{15,25}$/.test(value));
  const managerMap = await describeTeam(botToken, managerIds);
  const people = Object.fromEntries([...managerMap].map(([userId, person]) => [userId, { name: person.displayName, avatar: person.avatarUrl }]));
  const customEmojis = await customEmojisPromise;
  return renderTemplate`${renderComponent($$result, "DashPartners", $$DashPartners, { "customEmojis": customEmojis, "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "config": config, "channels": channels, "roles": roles, "embedTemplates": embedTemplates, "blacklist": blacklist, "stats": stats, "people": people, "channelLimit": channelLimit, "premium": premium, "ready": ready, "saved": saved, "notice": notice })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/partners.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/partners.astro";
const $$url = "/dash/guild/[id]/partners";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Partners,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
