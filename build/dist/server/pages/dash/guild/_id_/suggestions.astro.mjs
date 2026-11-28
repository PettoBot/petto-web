import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, b as addAttribute, F as Fragment, m as maybeRenderHead, e as defineScriptVars } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$EmojiPicker } from '../../../../chunks/EmojiPicker_0tfnRmiq.mjs';
import { $ as $$ColorPicker } from '../../../../chunks/ColorPicker_DwzcbTkv.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { m as makeT, g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
import { $ as $$DashMemberPick } from '../../../../chunks/DashMemberPick_uPHct-_4.mjs';
/* empty css                                                */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { g as getGuildEmojis } from '../../../../chunks/guildEmojis_CIHVnrpZ.mjs';
import { g as getMemberProfiles, m as memberAvatarUrl } from '../../../../chunks/memberNames_skiCoAs8.mjs';
import { w as withinBudget } from '../../../../chunks/liveCall_BSZ7MViH.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$2 = createAstro("https://petto.sbs");
const $$DashBlockedMembers = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$DashBlockedMembers;
  const { guildId, title, text, empty, blocked, result = null, disabled = false } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const messages = {
    blocked: dt("The member is blocked."),
    unblocked: dt("The member can use it again."),
    failed: dt("It could not be saved. Try again in a moment.")
  };
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<section class="bm" id="blocked" data-astro-cid-tpl3yu5i> <div class="bm-head" data-astro-cid-tpl3yu5i> <h2 data-astro-cid-tpl3yu5i>', "", ' <span class="bm-count" data-astro-cid-tpl3yu5i>', "</span></h2> <p data-astro-cid-tpl3yu5i>", "</p> </div> ", " ", ' <form method="POST" class="bm-add" data-no-dirty data-astro-cid-tpl3yu5i> <div class="bm-pick" data-astro-cid-tpl3yu5i>', '</div> <button type="submit" name="action" value="block_member" class="btn btn-ghost btn-sm"', " data-astro-cid-tpl3yu5i>", "", "</button> </form> <script>\n    document.querySelectorAll('time[data-bm-time]').forEach(function (t) { var d = new Date(t.getAttribute('datetime')); if (!isNaN(d.getTime())) t.textContent = d.toLocaleDateString(); });\n  <\/script> </section> "])), maybeRenderHead(), renderComponent($$result, "Icon", $$Icon, { "name": "ph:prohibit-fill", "width": "15", "height": "15", "data-astro-cid-tpl3yu5i": true }), title, blocked.length, text, result && renderTemplate`<div${addAttribute(["bm-flash", { "bm-flash-err": result === "failed" }], "class:list")}${addAttribute(result === "failed" ? "alert" : "status", "role")} data-astro-cid-tpl3yu5i>${messages[result]}</div>`, blocked.length ? renderTemplate`<ul class="bm-list" data-astro-cid-tpl3yu5i> ${blocked.map((member) => renderTemplate`<li data-astro-cid-tpl3yu5i> <img${addAttribute(member.avatar, "src")} alt="" width="26" height="26" loading="lazy" data-astro-cid-tpl3yu5i> <span class="bm-who" data-astro-cid-tpl3yu5i><b data-astro-cid-tpl3yu5i>${member.name ?? member.id}</b><small data-astro-cid-tpl3yu5i>${member.byName || member.by ? dt("Blocked by {a}", { a: member.byName ?? member.by }) : ""}${member.at ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-tpl3yu5i": true }, { "default": ($$result2) => renderTemplate` · <time${addAttribute(member.at, "datetime")} data-bm-time data-astro-cid-tpl3yu5i>${member.at.slice(0, 10)}</time>` })}` : null}</small></span> <form method="POST" data-no-dirty data-astro-cid-tpl3yu5i> <input type="hidden" name="member_id"${addAttribute(member.id, "value")} data-astro-cid-tpl3yu5i> <button type="submit" name="action" value="unblock_member" class="btn btn-ghost btn-sm"${addAttribute(disabled, "disabled")} data-astro-cid-tpl3yu5i>${dt("Unblock")}</button> </form> </li>`)} </ul>` : renderTemplate`<p class="bm-empty" data-astro-cid-tpl3yu5i>${empty}</p>`, renderComponent($$result, "DashMemberPick", $$DashMemberPick, { "guildId": guildId, "name": "member_id", "placeholder": dt("Type a name to block someone"), "data-astro-cid-tpl3yu5i": true }), addAttribute(disabled, "disabled"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:prohibit-fill", "width": "12", "height": "12", "data-astro-cid-tpl3yu5i": true }), dt("Block"));
}, "/home/runner/work/petto-web/petto-web/src/components/DashBlockedMembers.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashSuggestions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashSuggestions;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, config, channels, roles, templates, customEmojis = [], total, counts, recent, ready, saved, failed, blocked = [], blockResult = null } = Astro2.props;
  const errors = {
    channel: dt("Choose a channel from the list."),
    role: dt("Choose a role from the list."),
    save: dt("It could not be saved. Try again in a moment.")
  };
  const statuses = [
    { id: "pending", label: dt("Pending") },
    { id: "approved", label: dt("Approved") },
    { id: "denied", label: dt("Denied") },
    { id: "considering", label: dt("Considering") },
    { id: "implemented", label: dt("Implemented") }
  ];
  const suggestionVars = [
    { tok: "{suggestion.id}", desc: dt("ID of the suggestion") },
    { tok: "{suggestion.number}", desc: dt("Number of the suggestion") },
    { tok: "{suggestion.content}", desc: dt("Text of the suggestion") },
    { tok: "{suggestion.status}", desc: dt("Status of the suggestion") },
    { tok: "{suggestion.reason}", desc: dt("Reason the staff wrote") },
    { tok: "{suggestion.up}", desc: dt("Votes in favour") },
    { tok: "{suggestion.down}", desc: dt("Votes against") },
    { tok: "{suggestion.author}", desc: dt("Who suggested it") }
  ];
  const tones = { pending: "reactions", approved: "joins", denied: "leaves", considering: "voice", implemented: "invites" };
  const switches = [
    { name: "allow_command", on: config.allowCommand, label: dt("Members can use the suggest command"), hint: dt("Like !suggest <text>.") },
    { name: "listen_channel", on: config.listenChannel, label: dt("Every message in the channel is a suggestion"), hint: dt("Petto turns what they write into a suggestion and removes the original.") },
    { name: "thread", on: config.thread, label: dt("Open a thread for each suggestion"), hint: dt("To talk about it without filling the channel.") },
    { name: "self_vote", on: config.selfVote, label: dt("The author can vote on their own suggestion"), hint: "" },
    { name: "dm_author", on: config.dmAuthor, label: dt("Send a DM to the author when the staff answers"), hint: "" },
    { name: "status_colors", on: config.statusColors, label: dt("Color each suggestion by its status"), hint: dt("The message takes the color of its status. Pick the colors below.") },
    { name: "anonymous", on: config.anonymous, label: dt("Hide who made each suggestion"), hint: dt("The staff still sees it in the list below.") }
  ];
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "suggestions", "pageTitle": dt("Suggestions"), "data-astro-cid-6hgp5pvt": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", " ", "<h1 data-astro-cid-6hgp5pvt>", "</h1> ", " ", "", "", '<div class="sg-page" data-astro-cid-6hgp5pvt> ', ' <form method="POST" class="dfx-form" data-astro-cid-6hgp5pvt> <label class="dfx-master" data-astro-cid-6hgp5pvt><span data-astro-cid-6hgp5pvt><b data-astro-cid-6hgp5pvt>', "</b><em data-astro-cid-6hgp5pvt>", '</em></span><input type="checkbox" class="dfx-t" name="enabled"', ' data-astro-cid-6hgp5pvt></label> <section class="dfx-sec" data-astro-cid-6hgp5pvt> <div class="dfx-sec-head" data-astro-cid-6hgp5pvt><h2 data-astro-cid-6hgp5pvt>', "</h2><p data-astro-cid-6hgp5pvt>", '</p></div> <div class="dfx-grid" data-astro-cid-6hgp5pvt> <div class="dfx-field" data-astro-cid-6hgp5pvt><label data-astro-cid-6hgp5pvt>', '</label> <select name="channel_id" data-astro-cid-6hgp5pvt> <option value="" data-astro-cid-6hgp5pvt>', "</option> ", ' </select> <span class="dfx-hint" data-astro-cid-6hgp5pvt>', '</span> </div> <div class="dfx-field" data-astro-cid-6hgp5pvt><label data-astro-cid-6hgp5pvt>', '</label> <select name="staff_role_id" data-astro-cid-6hgp5pvt> <option value="" data-astro-cid-6hgp5pvt>', "</option> ", ' </select> <span class="dfx-hint" data-astro-cid-6hgp5pvt>', '</span> </div> </div> <div class="dfx-switches" data-astro-cid-6hgp5pvt> ', ' </div> </section> <section class="dfx-sec" data-astro-cid-6hgp5pvt> <div class="dfx-sec-head" data-astro-cid-6hgp5pvt><h2 data-astro-cid-6hgp5pvt>', "</h2><p data-astro-cid-6hgp5pvt>", '</p></div> <div class="dfx-grid" data-astro-cid-6hgp5pvt> <div class="dfx-field dfx-wide" data-astro-cid-6hgp5pvt><label data-astro-cid-6hgp5pvt>', '</label> <select name="embed_template" data-astro-cid-6hgp5pvt> <option value="" data-astro-cid-6hgp5pvt>', "</option> ", ' </select> <span class="dfx-hint" data-astro-cid-6hgp5pvt>', '</span> </div> </div> <div class="dfx-emoji-row" data-astro-cid-6hgp5pvt> <div class="dfx-field" data-astro-cid-6hgp5pvt><label data-astro-cid-6hgp5pvt>', '</label><input type="text" name="up_emoji" data-emoji-input', ' maxlength="64" placeholder="\u2705" data-astro-cid-6hgp5pvt></div> <div class="dfx-field" data-astro-cid-6hgp5pvt><label data-astro-cid-6hgp5pvt>', '</label><input type="text" name="down_emoji" data-emoji-input', ' maxlength="64" placeholder="\u274C" data-astro-cid-6hgp5pvt></div> </div> <div class="dfx-switches" data-astro-cid-6hgp5pvt> ', ' </div> <div class="sg-colors" data-sx-needs="status_colors" data-astro-cid-6hgp5pvt> <div class="dfx-label" data-astro-cid-6hgp5pvt>', '</div> <div class="sg-color-row" data-astro-cid-6hgp5pvt> ', ' </div> </div> </section> <section class="dfx-sec" data-astro-cid-6hgp5pvt> <div class="dfx-sec-head" data-astro-cid-6hgp5pvt><h2 data-astro-cid-6hgp5pvt>', "</h2><p data-astro-cid-6hgp5pvt>", "</p></div> ", ' <div class="dfx-field" data-sx-needs="thread" data-astro-cid-6hgp5pvt><label data-astro-cid-6hgp5pvt>', '</label> <textarea name="thread_name" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-ac="vars,emojis" maxlength="100" data-astro-cid-6hgp5pvt>', '</textarea> <span class="dfx-hint" data-astro-cid-6hgp5pvt>', '</span> </div> </section> <div class="dfx-foot" data-astro-cid-6hgp5pvt> <button class="btn btn-accent btn-sm" type="submit"', " data-astro-cid-6hgp5pvt>", '</button> <span class="dfx-hint" data-astro-cid-6hgp5pvt>', '</span> </div> </form> <section class="sg-list" data-astro-cid-6hgp5pvt> <h2 data-astro-cid-6hgp5pvt>', "</h2> ", " ", " </section> ", " </div> ", " <script>(function(){", "\n    (function () {\n      var guild = location.pathname.replace(/^\\/(es|pt-br)(?=\\/)/i, '').split('/')[3];\n      document.querySelectorAll('[data-sg-status-to]').forEach(function (button) {\n        button.addEventListener('click', function () {\n          var box = button.closest('[data-sg-id]');\n          var msg = box.querySelector('[data-sg-msg]');\n          var status = button.getAttribute('data-sg-status-to');\n          var all = box.querySelectorAll('button');\n          var before = button.innerHTML;\n          all.forEach(function (b) { b.disabled = true; });\n          // The pressed button says it is saving (same width); the answer is a toast (the line under the buttons only without it).\n          button.style.minWidth = button.offsetWidth + 'px';\n          button.textContent = working;\n          if (msg) msg.hidden = true;\n          fetch('/dash/guild/' + guild + '/suggestions-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: box.getAttribute('data-sg-id'), status: status, reason: box.querySelector('.sg-reason').value }), signal: window.AbortSignal && AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined })\n            .then(function (r) { return r.json().catch(function () { return { ok: false, message: failed }; }); })\n            .catch(function () { return { ok: false, message: failed }; })\n            .then(function (result) {\n              all.forEach(function (b) { b.disabled = false; });\n              button.innerHTML = before; button.style.minWidth = '';\n              var said = result.ok ? (labels[status] || '') : (result.message || failed);\n              // An answer that was saved but could not redraw the message (it was deleted from the channel) says so, in a notice that stays a little longer.\n              if (result.ok && result.warning) said = (said ? said + '. ' : '') + result.warning;\n              if (window.dglToast) { if (said) window.dglToast(said, { kind: result.ok ? (result.warning ? 'info' : 'ok') : 'error', ms: result.warning ? 9000 : undefined }); }\n              else if (msg) { msg.hidden = false; msg.className = 'sg-msg ' + (result.ok ? 'ok' : 'bad'); msg.textContent = said; }\n              if (result.ok) { var label = box.parentElement.querySelector('[data-sg-status]'); if (label) label.textContent = labels[status] || status; }\n            });\n        });\n      });\n    })();\n    (function () {\n      var guild = location.pathname.replace(/^\\/(es|pt-br)(?=\\/)/i, '').split('/')[3];\n      document.querySelectorAll('[data-sg-votes]').forEach(function (button) {\n        button.addEventListener('click', function () {\n          var box = button.closest('[data-sg-id]');\n          var out = box.querySelector('[data-sg-votes-box]');\n          if (!out.hidden && !out.classList.contains('dgl-leave')) { if (window.dglMotion) window.dglMotion.hide(out); else out.hidden = true; return; }\n          if (window.dglMotion) window.dglMotion.stay(out);\n          out.hidden = false; out.textContent = working;\n          fetch('/dash/guild/' + guild + '/suggestions-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'votes', id: box.getAttribute('data-sg-id') }) })\n            .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })\n            .catch(function () { return { ok: false }; })\n            .then(function (result) {\n              out.textContent = '';\n              if (!result.ok) { out.textContent = result.message || failed; return; }\n              [['up', votesWords.up, result.upTotal], ['down', votesWords.down, result.downTotal]].forEach(function (group) {\n                var line = document.createElement('p');\n                var names = (result[group[0]] || []).map(function (v) { return v.name; });\n                line.textContent = group[1] + ' (' + group[2] + '): ' + (names.length ? names.join(', ') : votesWords.nobody);\n                out.appendChild(line);\n              });\n            });\n        });\n      });\n    })();\n  })();<\/script> "], [" ", " ", " ", "<h1 data-astro-cid-6hgp5pvt>", "</h1> ", " ", "", "", '<div class="sg-page" data-astro-cid-6hgp5pvt> ', ' <form method="POST" class="dfx-form" data-astro-cid-6hgp5pvt> <label class="dfx-master" data-astro-cid-6hgp5pvt><span data-astro-cid-6hgp5pvt><b data-astro-cid-6hgp5pvt>', "</b><em data-astro-cid-6hgp5pvt>", '</em></span><input type="checkbox" class="dfx-t" name="enabled"', ' data-astro-cid-6hgp5pvt></label> <section class="dfx-sec" data-astro-cid-6hgp5pvt> <div class="dfx-sec-head" data-astro-cid-6hgp5pvt><h2 data-astro-cid-6hgp5pvt>', "</h2><p data-astro-cid-6hgp5pvt>", '</p></div> <div class="dfx-grid" data-astro-cid-6hgp5pvt> <div class="dfx-field" data-astro-cid-6hgp5pvt><label data-astro-cid-6hgp5pvt>', '</label> <select name="channel_id" data-astro-cid-6hgp5pvt> <option value="" data-astro-cid-6hgp5pvt>', "</option> ", ' </select> <span class="dfx-hint" data-astro-cid-6hgp5pvt>', '</span> </div> <div class="dfx-field" data-astro-cid-6hgp5pvt><label data-astro-cid-6hgp5pvt>', '</label> <select name="staff_role_id" data-astro-cid-6hgp5pvt> <option value="" data-astro-cid-6hgp5pvt>', "</option> ", ' </select> <span class="dfx-hint" data-astro-cid-6hgp5pvt>', '</span> </div> </div> <div class="dfx-switches" data-astro-cid-6hgp5pvt> ', ' </div> </section> <section class="dfx-sec" data-astro-cid-6hgp5pvt> <div class="dfx-sec-head" data-astro-cid-6hgp5pvt><h2 data-astro-cid-6hgp5pvt>', "</h2><p data-astro-cid-6hgp5pvt>", '</p></div> <div class="dfx-grid" data-astro-cid-6hgp5pvt> <div class="dfx-field dfx-wide" data-astro-cid-6hgp5pvt><label data-astro-cid-6hgp5pvt>', '</label> <select name="embed_template" data-astro-cid-6hgp5pvt> <option value="" data-astro-cid-6hgp5pvt>', "</option> ", ' </select> <span class="dfx-hint" data-astro-cid-6hgp5pvt>', '</span> </div> </div> <div class="dfx-emoji-row" data-astro-cid-6hgp5pvt> <div class="dfx-field" data-astro-cid-6hgp5pvt><label data-astro-cid-6hgp5pvt>', '</label><input type="text" name="up_emoji" data-emoji-input', ' maxlength="64" placeholder="\u2705" data-astro-cid-6hgp5pvt></div> <div class="dfx-field" data-astro-cid-6hgp5pvt><label data-astro-cid-6hgp5pvt>', '</label><input type="text" name="down_emoji" data-emoji-input', ' maxlength="64" placeholder="\u274C" data-astro-cid-6hgp5pvt></div> </div> <div class="dfx-switches" data-astro-cid-6hgp5pvt> ', ' </div> <div class="sg-colors" data-sx-needs="status_colors" data-astro-cid-6hgp5pvt> <div class="dfx-label" data-astro-cid-6hgp5pvt>', '</div> <div class="sg-color-row" data-astro-cid-6hgp5pvt> ', ' </div> </div> </section> <section class="dfx-sec" data-astro-cid-6hgp5pvt> <div class="dfx-sec-head" data-astro-cid-6hgp5pvt><h2 data-astro-cid-6hgp5pvt>', "</h2><p data-astro-cid-6hgp5pvt>", "</p></div> ", ' <div class="dfx-field" data-sx-needs="thread" data-astro-cid-6hgp5pvt><label data-astro-cid-6hgp5pvt>', '</label> <textarea name="thread_name" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-ac="vars,emojis" maxlength="100" data-astro-cid-6hgp5pvt>', '</textarea> <span class="dfx-hint" data-astro-cid-6hgp5pvt>', '</span> </div> </section> <div class="dfx-foot" data-astro-cid-6hgp5pvt> <button class="btn btn-accent btn-sm" type="submit"', " data-astro-cid-6hgp5pvt>", '</button> <span class="dfx-hint" data-astro-cid-6hgp5pvt>', '</span> </div> </form> <section class="sg-list" data-astro-cid-6hgp5pvt> <h2 data-astro-cid-6hgp5pvt>', "</h2> ", " ", " </section> ", " </div> ", " <script>(function(){", "\n    (function () {\n      var guild = location.pathname.replace(/^\\\\/(es|pt-br)(?=\\\\/)/i, '').split('/')[3];\n      document.querySelectorAll('[data-sg-status-to]').forEach(function (button) {\n        button.addEventListener('click', function () {\n          var box = button.closest('[data-sg-id]');\n          var msg = box.querySelector('[data-sg-msg]');\n          var status = button.getAttribute('data-sg-status-to');\n          var all = box.querySelectorAll('button');\n          var before = button.innerHTML;\n          all.forEach(function (b) { b.disabled = true; });\n          // The pressed button says it is saving (same width); the answer is a toast (the line under the buttons only without it).\n          button.style.minWidth = button.offsetWidth + 'px';\n          button.textContent = working;\n          if (msg) msg.hidden = true;\n          fetch('/dash/guild/' + guild + '/suggestions-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: box.getAttribute('data-sg-id'), status: status, reason: box.querySelector('.sg-reason').value }), signal: window.AbortSignal && AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined })\n            .then(function (r) { return r.json().catch(function () { return { ok: false, message: failed }; }); })\n            .catch(function () { return { ok: false, message: failed }; })\n            .then(function (result) {\n              all.forEach(function (b) { b.disabled = false; });\n              button.innerHTML = before; button.style.minWidth = '';\n              var said = result.ok ? (labels[status] || '') : (result.message || failed);\n              // An answer that was saved but could not redraw the message (it was deleted from the channel) says so, in a notice that stays a little longer.\n              if (result.ok && result.warning) said = (said ? said + '. ' : '') + result.warning;\n              if (window.dglToast) { if (said) window.dglToast(said, { kind: result.ok ? (result.warning ? 'info' : 'ok') : 'error', ms: result.warning ? 9000 : undefined }); }\n              else if (msg) { msg.hidden = false; msg.className = 'sg-msg ' + (result.ok ? 'ok' : 'bad'); msg.textContent = said; }\n              if (result.ok) { var label = box.parentElement.querySelector('[data-sg-status]'); if (label) label.textContent = labels[status] || status; }\n            });\n        });\n      });\n    })();\n    (function () {\n      var guild = location.pathname.replace(/^\\\\/(es|pt-br)(?=\\\\/)/i, '').split('/')[3];\n      document.querySelectorAll('[data-sg-votes]').forEach(function (button) {\n        button.addEventListener('click', function () {\n          var box = button.closest('[data-sg-id]');\n          var out = box.querySelector('[data-sg-votes-box]');\n          if (!out.hidden && !out.classList.contains('dgl-leave')) { if (window.dglMotion) window.dglMotion.hide(out); else out.hidden = true; return; }\n          if (window.dglMotion) window.dglMotion.stay(out);\n          out.hidden = false; out.textContent = working;\n          fetch('/dash/guild/' + guild + '/suggestions-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'votes', id: box.getAttribute('data-sg-id') }) })\n            .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })\n            .catch(function () { return { ok: false }; })\n            .then(function (result) {\n              out.textContent = '';\n              if (!result.ok) { out.textContent = result.message || failed; return; }\n              [['up', votesWords.up, result.upTotal], ['down', votesWords.down, result.downTotal]].forEach(function (group) {\n                var line = document.createElement('p');\n                var names = (result[group[0]] || []).map(function (v) { return v.name; });\n                line.textContent = group[1] + ' (' + group[2] + '): ' + (names.length ? names.join(', ') : votesWords.nobody);\n                out.appendChild(line);\n              });\n            });\n        });\n      });\n    })();\n  })();<\/script> "])), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-6hgp5pvt": true }), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-6hgp5pvt": true }), maybeRenderHead(), dt("Suggestions"), renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "emojis": customEmojis, "vars": suggestionVars, "data-astro-cid-6hgp5pvt": true }), saved && renderTemplate`<div class="dfx-flash" data-astro-cid-6hgp5pvt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-6hgp5pvt": true })}${dt("Saved.")}</div>`, failed && renderTemplate`<div class="dfx-flash dfx-warn" data-astro-cid-6hgp5pvt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-6hgp5pvt": true })}${errors[failed] ?? errors.save}</div>`, !ready && renderTemplate`<div class="dfx-flash dfx-warn" data-astro-cid-6hgp5pvt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-6hgp5pvt": true })}${dt("This arrives with the next Petto update.")}</div>`, renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Suggestions"), value: total, tone: "messages" },
    ...statuses.map((s) => ({ label: s.label, value: counts[s.id] ?? 0, tone: tones[s.id] }))
  ], "data-astro-cid-6hgp5pvt": true }), dt("Suggestions are on in this server"), dt("Members suggest, the server votes and the staff answers."), addAttribute(config.enabled, "checked"), dt("Where it goes"), dt("The channel of the suggestions and who answers them."), dt("Channel"), dt("Choose a channel"), channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === config.channelId, "selected")} data-astro-cid-6hgp5pvt>#${c.name}</option>`), dt("The suggestions are posted here."), dt("Staff role"), dt("Only who has Manage Server"), roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.id === config.staffRoleId, "selected")} data-astro-cid-6hgp5pvt>${r.name}</option>`), dt("Can answer, delete and block."), switches.filter((x) => ["allow_command", "listen_channel"].includes(x.name)).map((x) => renderTemplate`<label class="dfx-switch" data-astro-cid-6hgp5pvt><span data-astro-cid-6hgp5pvt><b data-astro-cid-6hgp5pvt>${x.label}</b>${x.hint && renderTemplate`<em data-astro-cid-6hgp5pvt>${x.hint}</em>`}</span><input type="checkbox" class="dfx-t"${addAttribute(x.name, "name")}${addAttribute(x.on, "checked")} data-astro-cid-6hgp5pvt></label>`), dt("How a suggestion looks"), dt("The design of the message, the voting buttons and the colors."), dt("Design"), dt("The usual design"), templates.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === config.embedTemplate, "selected")} data-astro-cid-6hgp5pvt>${name}</option>`), dt("A design from Embeds (it can be Components V2). Variables: {suggestion.id}, {suggestion.number}, {suggestion.content}, {suggestion.status}, {suggestion.reason}, {suggestion.up}, {suggestion.down}, {suggestion.author} and the usual ones."), dt("Vote in favor"), addAttribute(config.upEmoji, "value"), dt("Vote against"), addAttribute(config.downEmoji, "value"), switches.filter((x) => ["self_vote", "anonymous", "dm_author", "status_colors"].includes(x.name)).map((x) => renderTemplate`<label class="dfx-switch" data-astro-cid-6hgp5pvt><span data-astro-cid-6hgp5pvt><b data-astro-cid-6hgp5pvt>${x.label}</b>${x.hint && renderTemplate`<em data-astro-cid-6hgp5pvt>${x.hint}</em>`}</span><input type="checkbox" class="dfx-t"${addAttribute(x.name, "name")}${addAttribute(x.on, "checked")} data-astro-cid-6hgp5pvt></label>`), dt("Color of each status"), statuses.map((s) => renderTemplate`${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": `color_${s.id}`, "value": config.colors[s.id], "label": s.label, "data-astro-cid-6hgp5pvt": true })}`), dt("Threads"), dt("To talk about each suggestion without filling the channel."), switches.filter((x) => x.name === "thread").map((x) => renderTemplate`<label class="dfx-switch" data-astro-cid-6hgp5pvt><span data-astro-cid-6hgp5pvt><b data-astro-cid-6hgp5pvt>${x.label}</b>${x.hint && renderTemplate`<em data-astro-cid-6hgp5pvt>${x.hint}</em>`}</span><input type="checkbox" class="dfx-t"${addAttribute(x.name, "name")}${addAttribute(x.on, "checked")} data-astro-cid-6hgp5pvt></label>`), dt("Thread name"), config.threadName, dt("The suggestion variables work here too, like {suggestion.number}."), addAttribute(!ready, "disabled"), dt("Save"), dt("To post a button that opens the form, use !suggestion panel in the channel you want."), dt("Latest suggestions"), recent.length === 0 && renderTemplate`<p class="dfx-empty" data-astro-cid-6hgp5pvt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lightbulb-fill", "width": "16", "height": "16", "data-astro-cid-6hgp5pvt": true })}${dt("There are no suggestions yet.")}</p>`, recent.length > 0 && renderTemplate`<div class="sg-items dgl-stagger" data-astro-cid-6hgp5pvt> ${recent.map((s) => renderTemplate`<article class="sg-item"${addAttribute(`--st:${config.colors[s.status] ?? "#888"}`, "style")} data-astro-cid-6hgp5pvt> <div class="sg-head" data-astro-cid-6hgp5pvt> <span class="sg-num" data-astro-cid-6hgp5pvt>#${s.number}</span> <span class="sg-pill" data-sg-status data-astro-cid-6hgp5pvt>${statuses.find((x) => x.id === s.status)?.label ?? s.status}</span> <code class="sg-id" data-astro-cid-6hgp5pvt>${s.id}</code> <span class="sg-user" data-astro-cid-6hgp5pvt>${s.authorId}</span> </div> <p class="sg-text" data-astro-cid-6hgp5pvt>${s.content}</p> <div class="sg-answer"${addAttribute(s.id, "data-sg-id")} data-astro-cid-6hgp5pvt> <textarea class="sg-reason dgl-autogrow" rows="2" data-ac="roles,channels,emojis" maxlength="1000"${addAttribute(dt("Reason (optional)"), "placeholder")}${addAttribute(dt("Reason (optional)"), "aria-label")} data-astro-cid-6hgp5pvt></textarea> <div class="sg-buttons" data-astro-cid-6hgp5pvt> <button type="button" class="btn btn-ghost btn-sm sg-b-ok" data-sg-status-to="approved"${addAttribute(!ready, "disabled")} data-astro-cid-6hgp5pvt>${dt("Approve")}</button> <button type="button" class="btn btn-ghost btn-sm sg-b-no" data-sg-status-to="denied"${addAttribute(!ready, "disabled")} data-astro-cid-6hgp5pvt>${dt("Deny")}</button> <button type="button" class="btn btn-ghost btn-sm" data-sg-status-to="considering"${addAttribute(!ready, "disabled")} data-astro-cid-6hgp5pvt>${dt("Consider")}</button> <button type="button" class="btn btn-ghost btn-sm" data-sg-status-to="implemented"${addAttribute(!ready, "disabled")} data-astro-cid-6hgp5pvt>${dt("Implemented")}</button> <button type="button" class="btn btn-ghost btn-sm" data-sg-status-to="pending"${addAttribute(!ready, "disabled")} data-astro-cid-6hgp5pvt>${dt("Reopen")}</button> </div> <span class="sg-msg" data-sg-msg hidden data-astro-cid-6hgp5pvt></span> <button type="button" class="sg-votes-btn" data-sg-votes${addAttribute(!ready, "disabled")} data-astro-cid-6hgp5pvt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-fill", "width": "12", "height": "12", "data-astro-cid-6hgp5pvt": true })}${dt("Who voted")}</button> <div class="sg-votes" data-sg-votes-box hidden data-astro-cid-6hgp5pvt></div> </div> </article>`)} </div>`, renderComponent($$result2, "DashBlockedMembers", $$DashBlockedMembers, { "guildId": guildId, "title": dt("Blocked from suggesting"), "text": dt("A blocked member cannot make suggestions, the same as when the staff blocks them in Discord. Unblock them here at any time."), "empty": dt("Nobody is blocked. Block someone who keeps spamming suggestions or posts them in bad faith."), "blocked": blocked, "result": blockResult, "disabled": !ready, "data-astro-cid-6hgp5pvt": true }), renderComponent($$result2, "EmojiPicker", $$EmojiPicker, { "customEmojis": customEmojis, "data-astro-cid-6hgp5pvt": true }), defineScriptVars({ labels: { approved: dt("Approved"), denied: dt("Denied"), considering: dt("Under consideration"), implemented: dt("Implemented"), pending: dt("Pending") }, working: dt("Saving..."), votesWords: { up: dt("In favor"), down: dt("Against"), nobody: dt("nobody") }, failed: dt("It could not be saved. Try again in a moment.") })) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashSuggestions.astro", void 0);

const SNOWFLAKE = /^\d{15,25}$/;
async function changeBlock(apiUrl, apiHeaders, table, guildId, form, byUserId) {
  const action = String(form.get("action") ?? "");
  if (action !== "block_member" && action !== "unblock_member") return null;
  const memberId = String(form.get("member_id") ?? "");
  if (!SNOWFLAKE.test(memberId)) return "failed";
  if (action === "unblock_member") {
    const res2 = await fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${guildId}&user_id=eq.${memberId}`, { method: "DELETE", headers: { ...apiHeaders, Prefer: "return=minimal" } }).catch(() => null);
    return res2?.ok ? "unblocked" : "failed";
  }
  await ensureGuildRow(apiUrl, apiHeaders, guildId);
  const res = await fetch(`${apiUrl}/rest/v1/${table}?on_conflict=guild_id,user_id`, {
    method: "POST",
    headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ guild_id: guildId, user_id: memberId, blocked_by: byUserId })
  }).catch(() => null);
  return res?.ok ? "blocked" : "failed";
}
async function loadBlocked(astro, apiUrl, apiHeaders, table, guildId, botToken, viewerId) {
  const res = await fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${guildId}&select=user_id,blocked_by,created_at&order=created_at.desc&limit=200`, { headers: apiHeaders }).catch(() => null);
  const rows = res?.ok ? await res.json().catch(() => []) : [];
  if (!rows.length) return [];
  const ids = rows.flatMap((row) => [String(row.user_id), row.blocked_by ? String(row.blocked_by) : ""]).filter(Boolean);
  const profiles = (await withinBudget(getMemberProfiles(astro, guildId, ids, botToken, { fallback: "user", userId: viewerId }), 1500))?.value ?? /* @__PURE__ */ new Map();
  const nameOf = (id) => {
    const p = profiles.get(id);
    return p ? p.displayName || p.username : null;
  };
  return rows.map((row) => ({
    id: String(row.user_id),
    name: nameOf(String(row.user_id)),
    avatar: memberAvatarUrl(String(row.user_id), profiles.get(String(row.user_id)), 64),
    by: row.blocked_by ? String(row.blocked_by) : null,
    byName: row.blocked_by ? nameOf(String(row.blocked_by)) : null,
    at: String(row.created_at ?? "")
  }));
}

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Suggestions = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Suggestions;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const SNOWFLAKE = /^\d{15,25}$/;
  const STATUSES = ["pending", "approved", "denied", "considering", "implemented"];
  const toInt = (hex2, fallback) => /^#[0-9a-f]{6}$/i.test(hex2) ? parseInt(hex2.slice(1), 16) : fallback;
  let saved = false;
  let blockResult = null;
  let failed = "";
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    blockResult = await changeBlock(apiUrl, apiHeaders, "suggestion_blocks", id, form, session.userId);
    if (blockResult === null) {
      const text = (key, max) => String(form.get(key) ?? "").trim().slice(0, max);
      const channelId = text("channel_id", 30);
      const roleId = text("staff_role_id", 30);
      const design = text("embed_template", 60).toLowerCase().replace(/[^a-z0-9_-]/g, "_");
      const up = text("up_emoji", 64) || "\u2705";
      const down = text("down_emoji", 64) || "\u274C";
      if (channelId && !SNOWFLAKE.test(channelId)) failed = "channel";
      else if (roleId && !SNOWFLAKE.test(roleId)) failed = "role";
      else {
        const colors = {};
        const defaults = { pending: 16766307, approved: 10873466, denied: 16739179, considering: 16758892, implemented: 8624639 };
        for (const status of STATUSES) colors[`color_${status}`] = toInt(text(`color_${status}`, 7), defaults[status]);
        await ensureGuildRow(apiUrl, apiHeaders, id);
        const res = await fetch(`${apiUrl}/rest/v1/suggestion_config?on_conflict=guild_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({
            guild_id: id,
            enabled: form.get("enabled") === "on",
            channel_id: channelId || null,
            staff_role_id: roleId || null,
            embed_template: design || null,
            listen_channel: form.get("listen_channel") === "on",
            allow_command: form.get("allow_command") === "on",
            thread: form.get("thread") === "on",
            thread_name: text("thread_name", 100) || "Thread for suggestion {suggestion.id}",
            self_vote: form.get("self_vote") === "on",
            dm_author: form.get("dm_author") === "on",
            anonymous: form.get("anonymous") === "on",
            status_colors: form.get("status_colors") === "on",
            up_emoji: up,
            down_emoji: down,
            ...colors,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          })
        });
        saved = res.ok;
        if (!res.ok) failed = "save";
      }
    }
  }
  const [guildInfo, configRes, listRes, rolesRes, channelsRes, templatesRes, customEmojis, blocked] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/suggestion_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }).catch(() => null),
    fetch(`${apiUrl}/rest/v1/suggestions?guild_id=eq.${id}&select=id,number,author_id,content,status,created_at&order=number.desc&limit=200`, { headers: apiHeaders }).catch(() => null),
    getGuildList(Astro2, id, botToken, "roles"),
    getGuildList(Astro2, id, botToken, "channels"),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders }).catch(() => null),
    getGuildEmojis(id, botToken),
    loadBlocked(Astro2, apiUrl, apiHeaders, "suggestion_blocks", id, botToken, session.userId).catch(() => [])
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = Boolean(configRes?.ok);
  const row = ready ? (await configRes.json())[0] ?? {} : {};
  const list = listRes?.ok ? await listRes.json() : [];
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone" && !r.managed).sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const channels = (channelsRes?.ok ? await channelsRes.json() : []).filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  const templates = (templatesRes?.ok ? await templatesRes.json() : []).map((t) => t.name).filter(Boolean);
  const hex = (n, fallback) => typeof n === "number" ? `#${n.toString(16).padStart(6, "0")}` : fallback;
  const config = {
    enabled: row.enabled ?? false,
    channelId: row.channel_id ?? "",
    staffRoleId: row.staff_role_id ?? "",
    embedTemplate: row.embed_template ?? "",
    listenChannel: row.listen_channel ?? false,
    allowCommand: row.allow_command ?? true,
    thread: row.thread ?? true,
    threadName: row.thread_name ?? "Thread for suggestion {suggestion.id}",
    selfVote: row.self_vote ?? true,
    dmAuthor: row.dm_author ?? true,
    anonymous: row.anonymous ?? false,
    statusColors: row.status_colors ?? true,
    upEmoji: row.up_emoji ?? "\u2705",
    downEmoji: row.down_emoji ?? "\u274C",
    colors: {
      pending: hex(row.color_pending, "#ffd863"),
      approved: hex(row.color_approved, "#a5ea7a"),
      denied: hex(row.color_denied, "#ff6b6b"),
      considering: hex(row.color_considering, "#ffb86c"),
      implemented: hex(row.color_implemented, "#f78fb3")
    }
  };
  const counts = {};
  for (const s of list) counts[s.status] = (counts[s.status] ?? 0) + 1;
  const recent = list.slice(0, 15).map((s) => ({ id: s.id, number: s.number, authorId: s.author_id, content: String(s.content).slice(0, 160), status: s.status }));
  return renderTemplate`${renderComponent($$result, "DashSuggestions", $$DashSuggestions, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "config": config, "channels": channels, "roles": roles, "templates": templates, "customEmojis": customEmojis, "total": list.length, "counts": counts, "recent": recent, "ready": ready, "saved": saved, "failed": failed, "blocked": blocked, "blockResult": blockResult })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/suggestions.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/suggestions.astro";
const $$url = "/dash/guild/[id]/suggestions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Suggestions,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
