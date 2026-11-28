import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$EmojiPicker } from '../../../../chunks/EmojiPicker_0tfnRmiq.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { F as FREE_LIMITS, p as planLimits } from '../../../../chunks/planLimits_BFQNR8Tb.mjs';
/* empty css                                               */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getGuildEmojis } from '../../../../chunks/guildEmojis_CIHVnrpZ.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { i as isV2Data } from '../../../../chunks/embedSchema_Bj4vwR3q.mjs';
import { g as guildHasPremium } from '../../../../chunks/guildPremium_CRr06_t0.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashResponders = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashResponders;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, customEmojis = [], responders, panels, roles, channels, embedTemplates, limits, premium, ready, saved, notice } = Astro2.props;
  const styles = [["primary", "Blue"], ["secondary", "Grey"], ["success", "Green"], ["danger", "Red"]];
  const styleColors = { primary: "#5865f2", secondary: "#8b8fa3", success: "#2dd4a7", danger: "#fe6465" };
  const blank = { name: "", label: "", emoji: "", style: "secondary", reply: "", replyTemplate: "", give: [], remove: [], required: [], toggle: false, deleteMessage: false, reactEmoji: "", sendChannelId: "" };
  const blankPanel = { name: "", kind: "buttons", content: "", embedTemplate: "", responders: [], placeholder: "", exclusive: false};
  const roleNames = (ids) => ids.map((id) => roles.find((role) => role.id === id)?.name ?? id).join(", ");
  const channelName = (id) => channels.find((ch) => ch.id === id)?.name ?? id;
  function responderSummary(r) {
    const parts = [];
    if (r.give.length) parts.push(dt("Gives {a}", { a: roleNames(r.give) }));
    if (r.remove.length) parts.push(dt("Takes {a}", { a: roleNames(r.remove) }));
    if (r.required.length) parts.push(dt("Needs {a}", { a: roleNames(r.required) }));
    if (!parts.length) parts.push(r.reply || r.replyTemplate ? dt("Only answers") : dt("Does nothing yet"));
    parts.push(r.sendChannelId ? `#${channelName(r.sendChannelId)}` : dt("Answers in private"));
    return parts.join(" \xB7 ");
  }
  const respondersByName = new Map(responders.map((r) => [r.name, r]));
  const inPanels = panels.reduce((sum, p) => sum + p.responders.length, 0);
  return renderTemplate(_a || (_a = __template(["", " <script>\n  (function () {\n    if (window.__brForm) return;\n    window.__brForm = true;\n    // The button preview follows what is typed: text, emoji and color.\n    function paint(form) {\n      var pv = form.querySelector('[data-br-pv]'); if (!pv) return;\n      var label = form.querySelector('[data-br-label]'); var name = form.querySelector('[data-br-name]'); var emoji = form.querySelector('[data-br-emoji]'); var style = form.querySelector('[data-br-style]:checked');\n      var text = (label && label.value.trim()) || (name && name.value.trim()) || '';\n      var em = emoji ? emoji.value.trim() : '';\n      pv.className = 'br-pv-btn br-pv-' + (style ? style.value : 'secondary');\n      pv.innerHTML = '';\n      if (em) { var e = document.createElement('span'); e.textContent = /^<a?:\\w+:\\d+>$/.test(em) ? '' : em; if (e.textContent) pv.appendChild(e); }\n      var t = document.createElement('span'); t.textContent = text || pv.getAttribute('data-empty') || 'Button'; pv.appendChild(t);\n    }\n    function init() { document.querySelectorAll('[data-br-form]').forEach(function (form) { paint(form); }); }\n    document.addEventListener('input', function (e) { var f = e.target.closest && e.target.closest('[data-br-form]'); if (f) paint(f); });\n    document.addEventListener('change', function (e) { var f = e.target.closest && e.target.closest('[data-br-form]'); if (f) paint(f); });\n    // A required field inside a card that is closed would stop the save without a word: the card opens.\n    document.addEventListener('invalid', function (e) { var d = e.target.closest && e.target.closest('details'); if (d) d.open = true; }, true);\n    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();\n  })();\n<\/script> "], ["", " <script>\n  (function () {\n    if (window.__brForm) return;\n    window.__brForm = true;\n    // The button preview follows what is typed: text, emoji and color.\n    function paint(form) {\n      var pv = form.querySelector('[data-br-pv]'); if (!pv) return;\n      var label = form.querySelector('[data-br-label]'); var name = form.querySelector('[data-br-name]'); var emoji = form.querySelector('[data-br-emoji]'); var style = form.querySelector('[data-br-style]:checked');\n      var text = (label && label.value.trim()) || (name && name.value.trim()) || '';\n      var em = emoji ? emoji.value.trim() : '';\n      pv.className = 'br-pv-btn br-pv-' + (style ? style.value : 'secondary');\n      pv.innerHTML = '';\n      if (em) { var e = document.createElement('span'); e.textContent = /^<a?:\\\\w+:\\\\d+>$/.test(em) ? '' : em; if (e.textContent) pv.appendChild(e); }\n      var t = document.createElement('span'); t.textContent = text || pv.getAttribute('data-empty') || 'Button'; pv.appendChild(t);\n    }\n    function init() { document.querySelectorAll('[data-br-form]').forEach(function (form) { paint(form); }); }\n    document.addEventListener('input', function (e) { var f = e.target.closest && e.target.closest('[data-br-form]'); if (f) paint(f); });\n    document.addEventListener('change', function (e) { var f = e.target.closest && e.target.closest('[data-br-form]'); if (f) paint(f); });\n    // A required field inside a card that is closed would stop the save without a word: the card opens.\n    document.addEventListener('invalid', function (e) { var d = e.target.closest && e.target.closest('details'); if (d) d.open = true; }, true);\n    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();\n  })();\n<\/script> "])), renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "responders", "pageTitle": "Buttons and panels", "data-astro-cid-ls3x3q4s": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-ls3x3q4s": true })} ${maybeRenderHead()}<div class="br-page" data-astro-cid-ls3x3q4s> <h1 data-astro-cid-ls3x3q4s>${dt("Buttons and panels")}</h1> ${saved && renderTemplate`<div class="br-flash" data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-ls3x3q4s": true })}${dt("Saved.")}</div>`} ${notice === "bad_name" && renderTemplate`<div class="br-flash br-flash-warn" data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-ls3x3q4s": true })}${dt("The name can have letters, numbers, dashes and underscores, up to 60.")}</div>`} ${notice === "responder_limit" && renderTemplate`<div class="br-flash br-flash-warn" data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-ls3x3q4s": true })}${dt("This server already has {a} button responders. Premium raises the limit.", { a: limits.responders })}</div>`} ${notice === "panel_limit" && renderTemplate`<div class="br-flash br-flash-warn" data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-ls3x3q4s": true })}${dt("This server already has {a} panels. Premium raises the limit.", { a: limits.panels })}</div>`} ${!ready && renderTemplate`<div class="br-flash br-flash-warn" data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-ls3x3q4s": true })}${dt("This arrives with the next Petto update.")}</div>`} ${renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "emojis": customEmojis, "data-astro-cid-ls3x3q4s": true })} ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Button responders"), value: responders.length, tone: "messages" },
    { label: dt("Panels"), value: panels.length, tone: "joins" },
    { label: dt("Buttons in panels"), value: inPanels, tone: "invites" }
  ], "data-astro-cid-ls3x3q4s": true })} <div class="br-head" data-astro-cid-ls3x3q4s> <div data-astro-cid-ls3x3q4s><h2 class="br-h2" data-astro-cid-ls3x3q4s>${dt("Button responders")} <span class="br-count" data-astro-cid-ls3x3q4s>${responders.length} / ${limits.responders}</span></h2><p class="br-lead" data-astro-cid-ls3x3q4s>${dt("A button that gives or takes roles and answers. Open one to edit it.")}</p></div> </div> <div class="br-grid dgl-stagger" data-astro-cid-ls3x3q4s> ${[...responders, null].map((r) => {
    const item = r ?? blank;
    return renderTemplate`<details${addAttribute(["br-card dgl-rc", { "br-card-new": !r }], "class:list")}${addAttribute(!r && responders.length === 0, "open")}${addAttribute(`--c:${styleColors[item.style] ?? styleColors.secondary}`, "style")} data-astro-cid-ls3x3q4s> ${r ? renderTemplate`<summary class="br-card-sum" data-astro-cid-ls3x3q4s> <span class="br-card-head" data-astro-cid-ls3x3q4s> <span class="br-card-icon" aria-hidden="true" data-astro-cid-ls3x3q4s>${item.emoji ? renderTemplate`<span class="br-card-emoji" data-astro-cid-ls3x3q4s>${item.emoji}</span>` : renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:cursor-click-fill", "width": "17", "height": "17", "data-astro-cid-ls3x3q4s": true })}`}</span> <span class="br-card-name" data-astro-cid-ls3x3q4s><b data-astro-cid-ls3x3q4s>${item.label || item.name}</b><code data-astro-cid-ls3x3q4s>${item.name}</code></span> <span class="br-card-acts" data-astro-cid-ls3x3q4s> <span class="br-act"${addAttribute(dt("Edit"), "title")} data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "13", "height": "13", "data-astro-cid-ls3x3q4s": true })}<span class="br-act-text" data-astro-cid-ls3x3q4s><span class="br-t-edit" data-astro-cid-ls3x3q4s>${dt("Edit")}</span><span class="br-t-close" data-astro-cid-ls3x3q4s>${dt("Close")}</span></span></span> <button type="submit"${addAttribute(`br-del-${item.name}`, "form")} class="br-act br-act-del"${addAttribute(dt("Delete"), "title")}${addAttribute(dt("Delete"), "aria-label")}${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-ls3x3q4s": true })}</button> </span> </span> <span class="br-card-line" data-astro-cid-ls3x3q4s>${responderSummary(item)}</span> </summary>` : renderTemplate`<summary class="br-card-sum br-card-add" data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "14", "height": "14", "data-astro-cid-ls3x3q4s": true })}${dt("New button responder")}</summary>`} <form method="POST" class="br-form" data-br-form${addAttribute(r ? void 0 : "", "data-no-dirty")} data-astro-cid-ls3x3q4s> <input type="hidden" name="action" value="save_responder" data-astro-cid-ls3x3q4s> <div class="br-pv-row" data-astro-cid-ls3x3q4s> <span class="br-pv-label" data-astro-cid-ls3x3q4s>${dt("Preview")}</span> <span${addAttribute(`br-pv-btn br-pv-${item.style}`, "class")} data-br-pv data-astro-cid-ls3x3q4s>${item.emoji && renderTemplate`<span data-br-pv-emoji data-astro-cid-ls3x3q4s>${item.emoji}</span>`}<span data-br-pv-text data-astro-cid-ls3x3q4s>${item.label || item.name || dt("Button text")}</span></span> </div> <div class="br-block" data-astro-cid-ls3x3q4s> <div class="br-block-head" data-astro-cid-ls3x3q4s><h3 data-astro-cid-ls3x3q4s>${dt("The button")}</h3></div> <div class="dfx-grid" data-astro-cid-ls3x3q4s> <div class="dfx-field" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Name")}</label><input type="text" name="name"${addAttribute(item.name, "value")} maxlength="60" required${addAttribute(Boolean(r), "readonly")} placeholder="vip-role" data-br-name data-astro-cid-ls3x3q4s></div> <div class="dfx-field" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Button text")}</label><textarea name="label" data-one-line data-br-label class="dfx-one dgl-autogrow" rows="1" maxlength="80" data-astro-cid-ls3x3q4s>${item.label}</textarea></div> <div class="dfx-field" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Emoji")}</label><input type="text" name="emoji" data-emoji-input data-br-emoji${addAttribute(item.emoji, "value")} maxlength="64" placeholder="🌸" data-astro-cid-ls3x3q4s></div> <div class="dfx-field" data-astro-cid-ls3x3q4s><span class="dfx-label" data-astro-cid-ls3x3q4s>${dt("Color")}</span> <div class="dfx-chips br-colors" role="radiogroup"${addAttribute(dt("Color"), "aria-label")} data-astro-cid-ls3x3q4s> ${styles.map(([value, label]) => renderTemplate`<label class="dfx-chip" data-astro-cid-ls3x3q4s><input type="radio" name="style"${addAttribute(value, "value")}${addAttribute(value === item.style, "checked")} data-br-style data-astro-cid-ls3x3q4s>${renderTemplate`<i class="br-dot"${addAttribute(`background:${styleColors[value]}`, "style")} data-astro-cid-ls3x3q4s></i>`}${dt(label)}</label>`)} </div> </div> </div> </div> <div class="br-block" data-astro-cid-ls3x3q4s> <div class="br-block-head" data-astro-cid-ls3x3q4s><h3 data-astro-cid-ls3x3q4s>${dt("Roles")}</h3><p data-astro-cid-ls3x3q4s>${dt("What it gives, what it takes and who can use it.")}</p></div> <div class="dfx-grid" data-astro-cid-ls3x3q4s> <div class="dfx-field" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Roles to give")}</label>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "give_role_ids", "options": roles, "selected": item.give, "placeholder": dt("Search roles..."), "data-astro-cid-ls3x3q4s": true })}</div> <div class="dfx-field" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Roles to take")}</label>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "remove_role_ids", "options": roles, "selected": item.remove, "placeholder": dt("Search roles..."), "data-astro-cid-ls3x3q4s": true })}</div> <div class="dfx-field dfx-wide" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Roles needed to use it")}</label>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "required_role_ids", "options": roles, "selected": item.required, "placeholder": dt("Everyone"), "data-astro-cid-ls3x3q4s": true })}</div> </div> <div class="dfx-switches" data-astro-cid-ls3x3q4s> <label class="dfx-switch" data-astro-cid-ls3x3q4s><span data-astro-cid-ls3x3q4s><b data-astro-cid-ls3x3q4s>${dt("Take the roles back when it is clicked again")}</b></span><input type="checkbox" class="dfx-t" name="toggle"${addAttribute(item.toggle, "checked")} data-astro-cid-ls3x3q4s></label> <label class="dfx-switch" data-astro-cid-ls3x3q4s><span data-astro-cid-ls3x3q4s><b data-astro-cid-ls3x3q4s>${dt("Delete the message the button is on after it is used")}</b></span><input type="checkbox" class="dfx-t" name="delete_message"${addAttribute(item.deleteMessage, "checked")} data-astro-cid-ls3x3q4s></label> </div> </div> <div class="br-block" data-astro-cid-ls3x3q4s> <div class="br-block-head" data-astro-cid-ls3x3q4s><h3 data-astro-cid-ls3x3q4s>${dt("The answer")}</h3><p data-astro-cid-ls3x3q4s>${dt("What the member sees after pressing it.")}</p></div> <div class="dfx-grid" data-astro-cid-ls3x3q4s> <div class="dfx-field" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Send the answer in a channel")}</label><select name="send_channel_id" data-astro-cid-ls3x3q4s><option value="" data-astro-cid-ls3x3q4s>${dt("No, answer in private")}</option>${channels.map((ch) => renderTemplate`<option${addAttribute(ch.id, "value")}${addAttribute(ch.id === item.sendChannelId, "selected")} data-astro-cid-ls3x3q4s>#${ch.name}</option>`)}</select></div> <div class="dfx-field" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("React to that message with")}</label><input type="text" name="react_emoji" data-emoji-input${addAttribute(item.reactEmoji, "value")} maxlength="64" placeholder="👍" data-astro-cid-ls3x3q4s></div> <div class="dfx-field dfx-wide" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Private reply")}</label><textarea class="dgl-autogrow" name="reply" data-ac data-count rows="3" maxlength="2000"${addAttribute(dt("Empty says what changed. Variables like {user.mention} work."), "placeholder")} data-astro-cid-ls3x3q4s>${item.reply}</textarea></div> <div class="dfx-field dfx-wide" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Or a saved embed as the reply")}</label><select name="reply_template" data-tpl-locks="reply" data-astro-cid-ls3x3q4s><option value="" data-astro-cid-ls3x3q4s>${dt("No saved embed")}</option>${embedTemplates.map((tpl) => renderTemplate`<option${addAttribute(tpl.name, "value")}${addAttribute(tpl.name === item.replyTemplate, "selected")} data-astro-cid-ls3x3q4s>${tpl.name}${tpl.v2 ? " (V2)" : ""}</option>`)}</select></div> </div> </div> <div class="br-actions" data-astro-cid-ls3x3q4s> ${r ? renderTemplate`<button type="submit" class="btn btn-accent btn-sm"${addAttribute(!ready, "disabled")} data-astro-cid-ls3x3q4s>${dt("Save changes")}</button>` : renderTemplate`<button type="submit" class="btn btn-accent btn-sm"${addAttribute(!ready, "disabled")} data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-ls3x3q4s": true })}${dt("Create")}</button>`} </div> </form> ${r && renderTemplate`<form method="POST"${addAttribute(`br-del-${item.name}`, "id")} data-no-dirty data-astro-cid-ls3x3q4s><input type="hidden" name="action" value="delete_responder" data-astro-cid-ls3x3q4s><input type="hidden" name="name"${addAttribute(item.name, "value")} data-astro-cid-ls3x3q4s></form>`} </details>`;
  })} </div> <div class="br-head" data-astro-cid-ls3x3q4s> <div data-astro-cid-ls3x3q4s><h2 class="br-h2" data-astro-cid-ls3x3q4s>${dt("Panels")} <span class="br-count" data-astro-cid-ls3x3q4s>${panels.length} / ${limits.panels}</span></h2><p class="br-lead" data-astro-cid-ls3x3q4s>${dt("To post a panel in a channel, or update the one already there, use")} <code data-astro-cid-ls3x3q4s>!panel send ${"<name>"} #channel</code></p></div> </div> <div class="br-grid dgl-stagger" data-astro-cid-ls3x3q4s> ${[...panels, null].map((p) => {
    const item = p ?? blankPanel;
    const shown = item.responders.map((name) => respondersByName.get(name)).filter((r) => Boolean(r));
    return renderTemplate`<details${addAttribute(["br-card dgl-rc", { "br-card-new": !p }], "class:list")} style="--c:var(--accent)" data-astro-cid-ls3x3q4s> ${p ? renderTemplate`<summary class="br-card-sum" data-astro-cid-ls3x3q4s> <span class="br-card-head" data-astro-cid-ls3x3q4s> <span class="br-card-icon" aria-hidden="true" data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": item.kind === "select" ? "ph:list-bullets-fill" : "ph:squares-four-fill", "width": "17", "height": "17", "data-astro-cid-ls3x3q4s": true })}</span> <span class="br-card-name" data-astro-cid-ls3x3q4s><b data-astro-cid-ls3x3q4s>${item.name}</b><code data-astro-cid-ls3x3q4s>${item.kind === "select" ? dt("Menu") : dt("Buttons")} · ${item.responders.length}</code></span> <span class="br-card-acts" data-astro-cid-ls3x3q4s> <span class="br-act"${addAttribute(dt("Edit"), "title")} data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "13", "height": "13", "data-astro-cid-ls3x3q4s": true })}<span class="br-act-text" data-astro-cid-ls3x3q4s><span class="br-t-edit" data-astro-cid-ls3x3q4s>${dt("Edit")}</span><span class="br-t-close" data-astro-cid-ls3x3q4s>${dt("Close")}</span></span></span> <button type="submit"${addAttribute(`brp-del-${item.name}`, "form")} class="br-act br-act-del"${addAttribute(dt("Delete"), "title")}${addAttribute(dt("Delete"), "aria-label")}${addAttribute(dt("Delete this? This cannot be undone."), "data-confirm")} data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-ls3x3q4s": true })}</button> </span> </span> ${shown.length > 0 ? renderTemplate`<span class="br-card-chips" data-astro-cid-ls3x3q4s>${shown.slice(0, 4).map((r) => renderTemplate`<span${addAttribute(`br-chip br-${r.style}`, "class")} data-astro-cid-ls3x3q4s>${r.emoji} ${r.label || r.name}</span>`)}${shown.length > 4 && renderTemplate`<span class="br-chip" data-astro-cid-ls3x3q4s>+${shown.length - 4}</span>`}</span>` : renderTemplate`<span class="br-card-line" data-astro-cid-ls3x3q4s>${dt("No buttons in it yet")}</span>`} </summary>` : renderTemplate`<summary class="br-card-sum br-card-add" data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "14", "height": "14", "data-astro-cid-ls3x3q4s": true })}${dt("New panel")}</summary>`} <form method="POST" class="br-form"${addAttribute(p ? void 0 : "", "data-no-dirty")} data-astro-cid-ls3x3q4s> <input type="hidden" name="action" value="save_panel" data-astro-cid-ls3x3q4s> <div class="br-block" data-astro-cid-ls3x3q4s> <div class="br-block-head" data-astro-cid-ls3x3q4s><h3 data-astro-cid-ls3x3q4s>${dt("The panel")}</h3></div> <div class="dfx-grid" data-astro-cid-ls3x3q4s> <div class="dfx-field" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Name")}</label><input type="text" name="name"${addAttribute(item.name, "value")} maxlength="60" required${addAttribute(Boolean(p), "readonly")} placeholder="roles" data-astro-cid-ls3x3q4s></div> <div class="dfx-field" data-astro-cid-ls3x3q4s><span class="dfx-label" data-astro-cid-ls3x3q4s>${dt("Shown as")}</span> <div class="dfx-chips" role="radiogroup"${addAttribute(dt("Shown as"), "aria-label")} data-astro-cid-ls3x3q4s> <label class="dfx-chip" data-astro-cid-ls3x3q4s><input type="radio" name="kind" value="buttons"${addAttribute(item.kind !== "select", "checked")} data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:squares-four-fill", "width": "14", "height": "14", "data-astro-cid-ls3x3q4s": true })}${dt("Buttons")}</label> <label class="dfx-chip" data-astro-cid-ls3x3q4s><input type="radio" name="kind" value="select"${addAttribute(item.kind === "select", "checked")} data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-bullets-fill", "width": "14", "height": "14", "data-astro-cid-ls3x3q4s": true })}${dt("A menu")}</label> </div> </div> <div class="dfx-field dfx-wide" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Text above")}</label><textarea class="dgl-autogrow" name="content" data-ac data-count rows="3" maxlength="2000" data-astro-cid-ls3x3q4s>${item.content}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-ls3x3q4s": true })}</div> <div class="dfx-field dfx-wide" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Or a saved embed")}</label><select name="embed_template" data-tpl-locks="content" data-astro-cid-ls3x3q4s><option value="" data-astro-cid-ls3x3q4s>${dt("No saved embed")}</option>${embedTemplates.map((tpl) => renderTemplate`<option${addAttribute(tpl.name, "value")}${addAttribute(tpl.name === item.embedTemplate, "selected")} data-astro-cid-ls3x3q4s>${tpl.name}${tpl.v2 ? " (V2)" : ""}</option>`)}</select></div> <div class="dfx-field dfx-wide" data-astro-cid-ls3x3q4s><label data-astro-cid-ls3x3q4s>${dt("Menu text before choosing")}</label><textarea name="placeholder" data-one-line data-count class="dfx-one dgl-autogrow" rows="1" maxlength="100" data-astro-cid-ls3x3q4s>${item.placeholder}</textarea></div> </div> <div class="dfx-switches" data-astro-cid-ls3x3q4s> <label class="dfx-switch" data-astro-cid-ls3x3q4s><span data-astro-cid-ls3x3q4s><b data-astro-cid-ls3x3q4s>${dt("In a menu, choosing one takes back the roles the others give")}</b></span><input type="checkbox" class="dfx-t" name="exclusive"${addAttribute(item.exclusive, "checked")} data-astro-cid-ls3x3q4s></label> </div> </div> <div class="br-block" data-astro-cid-ls3x3q4s> <div class="br-block-head" data-astro-cid-ls3x3q4s><h3 data-astro-cid-ls3x3q4s>${dt("Shows these responders")}</h3></div> ${responders.length === 0 && renderTemplate`<span class="br-lead" data-astro-cid-ls3x3q4s>${dt("Make a button responder first.")}</span>`} <div class="dfx-chips" data-astro-cid-ls3x3q4s> ${responders.map((r) => renderTemplate`<label class="dfx-chip" data-astro-cid-ls3x3q4s><input type="checkbox" name="responders"${addAttribute(r.name, "value")}${addAttribute(item.responders.includes(r.name), "checked")} data-astro-cid-ls3x3q4s>${r.emoji} ${r.label || r.name}</label>`)} </div> </div> <div class="br-actions" data-astro-cid-ls3x3q4s> ${p ? renderTemplate`<button type="submit" class="btn btn-accent btn-sm"${addAttribute(!ready, "disabled")} data-astro-cid-ls3x3q4s>${dt("Save changes")}</button>` : renderTemplate`<button type="submit" class="btn btn-accent btn-sm"${addAttribute(!ready, "disabled")} data-astro-cid-ls3x3q4s>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-ls3x3q4s": true })}${dt("Create")}</button>`} </div> </form> ${p && renderTemplate`<form method="POST"${addAttribute(`brp-del-${item.name}`, "id")} data-no-dirty data-astro-cid-ls3x3q4s><input type="hidden" name="action" value="delete_panel" data-astro-cid-ls3x3q4s><input type="hidden" name="name"${addAttribute(item.name, "value")} data-astro-cid-ls3x3q4s></form>`} </details>`;
  })} </div> <p class="br-note" data-astro-cid-ls3x3q4s>${dt("Commands: !responder, !panel.")}${premium ? "" : ` ${dt("Free servers can have {a} responders and {b} panels.", { a: FREE_LIMITS.buttonResponders, b: FREE_LIMITS.componentPanels })}`}</p> </div> ${renderComponent($$result2, "EmojiPicker", $$EmojiPicker, { "customEmojis": customEmojis, "data-astro-cid-ls3x3q4s": true })} ` }));
}, "/home/runner/work/petto-web/petto-web/src/components/DashResponders.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Responders = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Responders;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const premium = await guildHasPremium(apiUrl, apiHeaders, id);
  const responderLimit = planLimits(premium).buttonResponders;
  const panelLimit = planLimits(premium).componentPanels;
  const snowflake = /^\d{15,25}$/;
  const NAME = /^[a-z0-9_-]{1,60}$/;
  const STYLES = ["primary", "secondary", "success", "danger"];
  const cleanName = (value) => String(value ?? "").trim().toLowerCase().replace(/\s+/g, "-");
  const roleList = (form, field) => [...new Set(form.getAll(field).map(String).filter((value) => snowflake.test(value)))].slice(0, 10);
  const count = async (table) => Number((await fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}&select=id`, { headers: { ...apiHeaders, Prefer: "count=exact", Range: "0-0" } })).headers.get("content-range")?.split("/")[1] ?? 0);
  const upsert = (table, body) => fetch(`${apiUrl}/rest/v1/${table}?on_conflict=guild_id,name`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(body) });
  let notice = "";
  let saved = false;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const name = cleanName(form.get("name"));
    await ensureGuildRow(apiUrl, apiHeaders, id);
    if (action === "delete_responder" || action === "delete_panel") {
      const table = action === "delete_responder" ? "button_responders" : "component_panels";
      saved = (await fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}`, { method: "DELETE", headers: apiHeaders })).ok;
    } else if (!NAME.test(name)) {
      notice = "bad_name";
    } else if (action === "save_responder") {
      const exists = (await (await fetch(`${apiUrl}/rest/v1/button_responders?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}&select=id`, { headers: apiHeaders })).json()).length > 0;
      if (!exists && await count("button_responders") >= responderLimit) {
        notice = "responder_limit";
      } else {
        const style = String(form.get("style") ?? "secondary");
        const emoji = String(form.get("emoji") ?? "").trim();
        saved = (await upsert("button_responders", {
          guild_id: id,
          name,
          label: String(form.get("label") ?? "").trim().slice(0, 80),
          emoji: emoji && emoji.length <= 64 && !/\s/.test(emoji) ? emoji : null,
          style: STYLES.includes(style) ? style : "secondary",
          reply: String(form.get("reply") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 2e3),
          reply_template: String(form.get("reply_template") ?? "").trim().slice(0, 100) || null,
          give_role_ids: roleList(form, "give_role_ids"),
          remove_role_ids: roleList(form, "remove_role_ids"),
          required_role_ids: roleList(form, "required_role_ids"),
          toggle: form.get("toggle") === "on",
          delete_message: form.get("delete_message") === "on",
          react_emoji: ((value) => value && value.length <= 64 && !/\s/.test(value) ? value : null)(String(form.get("react_emoji") ?? "").trim()),
          send_channel_id: /^\d{15,25}$/.test(String(form.get("send_channel_id") ?? "")) ? String(form.get("send_channel_id")) : null,
          created_by: session.userId
        })).ok;
      }
    } else if (action === "save_panel") {
      const exists = (await (await fetch(`${apiUrl}/rest/v1/component_panels?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}&select=id`, { headers: apiHeaders })).json()).length > 0;
      if (!exists && await count("component_panels") >= panelLimit) {
        notice = "panel_limit";
      } else {
        const kind = String(form.get("kind") ?? "buttons") === "select" ? "select" : "buttons";
        const items = [...new Set(form.getAll("responders").map((value) => cleanName(value)).filter((value) => NAME.test(value)))].slice(0, 25);
        const body = {
          guild_id: id,
          name,
          kind,
          content: String(form.get("content") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 2e3),
          embed_template: String(form.get("embed_template") ?? "").trim().slice(0, 100) || null,
          responders: items,
          placeholder: String(form.get("placeholder") ?? "").trim().slice(0, 100),
          exclusive: form.get("exclusive") === "on"
        };
        saved = (await upsert("component_panels", body)).ok;
      }
    }
  }
  const customEmojisPromise = getGuildEmojis(id, botToken);
  const [guildInfo, respondersRes, panelsRes, rolesRes, templatesRes, channelsRes] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/button_responders?guild_id=eq.${id}&select=*&order=name.asc&limit=600`, { headers: apiHeaders }),
    fetch(`${apiUrl}/rest/v1/component_panels?guild_id=eq.${id}&select=*&order=name.asc&limit=150`, { headers: apiHeaders }),
    getGuildList(Astro2, id, botToken, "roles"),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name,data&order=name.asc`, { headers: apiHeaders }),
    getGuildList(Astro2, id, botToken, "channels")
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = respondersRes.ok && panelsRes.ok;
  const responders = ready ? (await respondersRes.json()).map((row) => ({
    name: row.name,
    label: row.label,
    emoji: row.emoji ?? "",
    style: row.style,
    reply: row.reply,
    replyTemplate: row.reply_template ?? "",
    give: row.give_role_ids ?? [],
    remove: row.remove_role_ids ?? [],
    required: row.required_role_ids ?? [],
    toggle: Boolean(row.toggle),
    deleteMessage: Boolean(row.delete_message),
    reactEmoji: row.react_emoji ?? "",
    sendChannelId: row.send_channel_id ?? ""
  })) : [];
  const panels = ready ? (await panelsRes.json()).map((row) => ({
    name: row.name,
    kind: row.kind,
    content: row.content,
    embedTemplate: row.embed_template ?? "",
    responders: row.responders ?? [],
    placeholder: row.placeholder,
    exclusive: Boolean(row.exclusive),
    channelId: row.channel_id ?? ""
  })) : [];
  const roles = (rolesRes.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone" && !r.managed).sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const channels = (channelsRes.ok ? await channelsRes.json() : []).filter((ch) => [0, 5, 10, 11, 12].includes(ch.type)).sort((a, b) => a.position - b.position).map((ch) => ({ id: ch.id, name: ch.name }));
  const embedTemplates = (templatesRes.ok ? await templatesRes.json() : []).map((row) => ({ name: row.name, v2: isV2Data(row.data) }));
  const customEmojis = await customEmojisPromise;
  return renderTemplate`${renderComponent($$result, "DashResponders", $$DashResponders, { "customEmojis": customEmojis, "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "responders": responders, "panels": panels, "roles": roles, "channels": channels, "embedTemplates": embedTemplates, "limits": { responders: responderLimit, panels: panelLimit }, "premium": premium, "ready": ready, "saved": saved, "notice": notice })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/responders.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/responders.astro";
const $$url = "/dash/guild/[id]/responders";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Responders,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
