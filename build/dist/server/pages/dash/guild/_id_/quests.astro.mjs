import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout, c as canUseQuests } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                           */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { L as callPettoQuestMethod } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { v as validateTemplate, i as isV2Data } from '../../../../chunks/embedSchema_Bj4vwR3q.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashQuests = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashQuests;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, config, channels, roles, embedTemplates, ready, saved, methodResult } = Astro2.props;
  const archiveChoices = [[60, "1 hour"], [1440, "1 day"], [4320, "3 days"], [10080, "1 week"]];
  const rewardKinds = [["orbs", "Orbs"], ["decoration", "Collectibles (decorations, effects)"], ["code", "Codes"], ["ingame", "In-game items"], ["nitro", "Nitro"]];
  const taskKinds = [["video", "Watch a video"], ["play", "Play a game"], ["stream", "Stream"], ["activity", "Activities"]];
  const sections = [["image", "Picture"], ["rewards", "Rewards"], ["tasks", "Tasks"], ["platforms", "Platforms"], ["limits", "Region and age limits"]];
  const sample = { name: "Watch the trailer", reward: "200 Orbs | 240", task: "Watch a video (2:14)", platforms: "Desktop, Mobile", limits: "Users residing in United States \u{1F1FA}\u{1F1F8}" };
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "quests", "pageTitle": "Quests", "data-astro-cid-on44tawe": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-on44tawe": true })} ${maybeRenderHead()}<h1 data-astro-cid-on44tawe>${dt("Quest alerts")}</h1> ${renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "vars": [{ tok: "{quest.name}", desc: dt("Name of the quest") }, { tok: "{quest.game}", desc: dt("Game of the quest") }, { tok: "{quest.task}", desc: dt("Task of the quest") }, { tok: "{quest.reward}", desc: dt("Reward of the quest") }, { tok: "{quest.expires}", desc: dt("When the quest ends") }], "data-astro-cid-on44tawe": true })} ${saved && renderTemplate`<div class="dfx-flash" data-astro-cid-on44tawe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-on44tawe": true })}${dt("Saved.")}</div>`}${methodResult && renderTemplate`<div${addAttribute(`dfx-flash${methodResult.ok ? "" : " dfx-warn"}`, "class")} data-astro-cid-on44tawe>${renderComponent($$result2, "Icon", $$Icon, { "name": methodResult.ok ? "ph:check-circle-fill" : "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-on44tawe": true })}${methodResult.ok ? dt("The method was sent.") : dt("The method could not be sent.")} ${methodResult.message}</div>`}${!ready && renderTemplate`<div class="dfx-flash dfx-warn" data-astro-cid-on44tawe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-on44tawe": true })}${dt("This arrives with the next Petto update.")}</div>`}<div class="qa-page" data-astro-cid-on44tawe> <form method="POST" class="dfx-form qa-form" data-astro-cid-on44tawe> <label class="dfx-master" data-astro-cid-on44tawe><span data-astro-cid-on44tawe><b data-astro-cid-on44tawe>${dt("Send alerts")}</b><em data-astro-cid-on44tawe>${dt("Petto posts each new Discord quest in the channel.")}</em></span><input type="checkbox" class="dfx-t" name="enabled"${addAttribute(config.enabled, "checked")} data-astro-cid-on44tawe></label> <section class="dfx-sec" data-astro-cid-on44tawe> <div class="dfx-sec-head" data-astro-cid-on44tawe><h2 data-astro-cid-on44tawe>${dt("Where it goes")}</h2><p data-astro-cid-on44tawe>${dt("The channel of the alerts, who is pinged and when a last call is sent.")}</p></div> <div class="dfx-grid dfx-grid-3" data-astro-cid-on44tawe> <div class="dfx-field" data-astro-cid-on44tawe><label data-astro-cid-on44tawe>${dt("Channel")}</label><select name="channel_id" data-astro-cid-on44tawe><option value="" data-astro-cid-on44tawe>${dt("None")}</option>${channels.map((ch) => renderTemplate`<option${addAttribute(ch.id, "value")}${addAttribute(ch.id === config.channelId, "selected")} data-astro-cid-on44tawe>#${ch.name}</option>`)}</select></div> <div class="dfx-field" data-astro-cid-on44tawe><label data-astro-cid-on44tawe>${dt("Role to ping")}</label><select name="role_id" data-astro-cid-on44tawe><option value="" data-astro-cid-on44tawe>${dt("None")}</option>${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.id === config.roleId, "selected")} data-astro-cid-on44tawe>${r.name}</option>`)}</select></div> <div class="dfx-field" data-astro-cid-on44tawe><label data-astro-cid-on44tawe>${dt("Also alert before a quest ends (hours, 0 is off)")}</label><input type="number" name="expiring_hours" min="0" max="168"${addAttribute(config.expiringHours, "value")} data-astro-cid-on44tawe></div> </div> </section> <section class="dfx-sec" data-astro-cid-on44tawe> <div class="dfx-sec-head" data-astro-cid-on44tawe><h2 data-astro-cid-on44tawe>${dt("The alert")}</h2><p data-astro-cid-on44tawe>${dt("Use the Petto card or one of your saved embeds. The preview is a rough one.")}</p></div> <div class="qa-msg" data-astro-cid-on44tawe> <div class="qa-msg-fields" data-astro-cid-on44tawe> <div class="dfx-field" data-astro-cid-on44tawe><label data-astro-cid-on44tawe>${dt("Message style")}</label> <select name="style" id="qa-style" data-astro-cid-on44tawe><option value="card"${addAttribute(config.style !== "template", "selected")} data-astro-cid-on44tawe>${dt("Petto card")}</option><option value="template"${addAttribute(config.style === "template", "selected")} data-astro-cid-on44tawe>${dt("A saved embed")}</option></select> </div> <div class="dfx-field" id="qa-template-field" data-astro-cid-on44tawe><label data-astro-cid-on44tawe>${dt("Saved embed")}</label> <select name="embed_template" data-dp-template-only data-astro-cid-on44tawe><option value="" data-astro-cid-on44tawe>${dt("None")}</option>${embedTemplates.map((tpl) => renderTemplate`<option${addAttribute(tpl.name, "value")}${addAttribute(tpl.name === config.embedTemplate, "selected")} data-astro-cid-on44tawe>${tpl.name}${tpl.v2 ? " (V2)" : ""}</option>`)}</select> <span class="dfx-hint" data-astro-cid-on44tawe>${dt("It can use the quest variables, such as {quest.name}, {quest.reward} and {quest.expires}. If it is missing, the card is sent.")}</span> ${config.embedTemplate && renderTemplate`<a class="dfx-link"${addAttribute(`/dash/guild/${guildId}/embeds?name=${encodeURIComponent(config.embedTemplate)}`, "href")} data-astro-cid-on44tawe>${dt("Edit this design")}</a>`} <button type="submit" form="qa-design-form" class="btn btn-ghost btn-sm qa-make"${addAttribute(!ready, "disabled")} data-astro-cid-on44tawe>${dt("Make a V2 design from the Petto card")}</button> </div> <div class="qa-card-options" id="qa-card-options" data-astro-cid-on44tawe> <div class="dfx-field" data-astro-cid-on44tawe><span class="dfx-label" data-astro-cid-on44tawe>${dt("What the card hides")}</span> <div class="dfx-chips" data-astro-cid-on44tawe> ${sections.map(([value, label]) => renderTemplate`<label class="dfx-chip" data-astro-cid-on44tawe><input type="checkbox"${addAttribute(`hide_${value}`, "name")}${addAttribute(value, "data-hide")}${addAttribute(config.hideSections.includes(value), "checked")} data-astro-cid-on44tawe>${dt(label)}</label>`)} </div> </div> <div class="dfx-field" data-astro-cid-on44tawe><label for="qa-color" data-astro-cid-on44tawe>${dt("Card color")}</label> <div class="qa-colorbox" data-astro-cid-on44tawe><i class="qa-swatch" id="qa-swatch" aria-hidden="true" data-astro-cid-on44tawe></i><input type="text" name="accent_color" id="qa-color"${addAttribute(config.accentColor, "value")} placeholder="#ff91c2" maxlength="7" data-astro-cid-on44tawe></div> <span class="dfx-hint" data-astro-cid-on44tawe>${dt("Empty uses the color of each quest.")}</span> </div> </div> </div> <aside class="qa-preview"${addAttribute(dt("Preview"), "aria-label")} data-astro-cid-on44tawe> <div class="qa-card" id="qa-card"${addAttribute(`--qa-accent:${config.accentColor || "#4752c4"}`, "style")} data-astro-cid-on44tawe> <div class="qa-title" data-astro-cid-on44tawe><span class="qa-badge" aria-hidden="true" data-astro-cid-on44tawe>◆</span> <a data-astro-cid-on44tawe>${sample.name}</a></div> <div class="qa-hero" data-part="image" aria-hidden="true" data-astro-cid-on44tawe></div> <hr data-astro-cid-on44tawe> <div class="qa-lines" data-astro-cid-on44tawe> <div data-astro-cid-on44tawe>⏰ <b data-astro-cid-on44tawe>${dt("Starts")}:</b> ${dt("1 day ago")} | <b data-astro-cid-on44tawe>${dt("Ends")}:</b> ${dt("in 5 days")}</div> <div data-part="platforms" data-astro-cid-on44tawe>💿 <b data-astro-cid-on44tawe>${dt("Platforms")}:</b> ${sample.platforms}</div> <div data-part="tasks" data-astro-cid-on44tawe>🧫 <b data-astro-cid-on44tawe>${dt("Task")}:</b> ${sample.task}</div> </div> <div data-part="rewards" data-astro-cid-on44tawe><hr data-astro-cid-on44tawe> <div class="qa-h2" data-astro-cid-on44tawe>🎁 ${dt("Rewards")}</div> <div class="qa-lines" data-astro-cid-on44tawe><div data-astro-cid-on44tawe>🥇 <b data-astro-cid-on44tawe>${dt("Type")}:</b> ${dt("Virtual currency")}</div><div data-astro-cid-on44tawe>💸 <b data-astro-cid-on44tawe>${dt("Amount")}:</b> ${sample.reward}</div></div> </div> <div data-part="limits" data-astro-cid-on44tawe><hr data-astro-cid-on44tawe> <div class="qa-h2" data-astro-cid-on44tawe>⚠️ ${dt("Limitations")}</div> <div class="qa-lines" data-astro-cid-on44tawe><div data-astro-cid-on44tawe>• ${sample.limits}</div></div> </div> <hr data-astro-cid-on44tawe> </div> <div class="qa-buttons" data-astro-cid-on44tawe><span data-astro-cid-on44tawe>${dt("Accept Quest")} ↗</span><span data-astro-cid-on44tawe>${dt("Game page")} ↗</span></div> </aside> </div> </section> <section class="dfx-sec" data-astro-cid-on44tawe> <div class="dfx-sec-head" data-astro-cid-on44tawe><h2 data-astro-cid-on44tawe>${dt("What gets an alert")}</h2><p data-astro-cid-on44tawe>${dt("Pick the kinds you want. With nothing picked, every quest is sent.")}</p></div> <div class="dfx-field" data-astro-cid-on44tawe><span class="dfx-label" data-astro-cid-on44tawe>${dt("Only these rewards")}</span> <div class="dfx-chips" data-astro-cid-on44tawe>${rewardKinds.map(([value, label]) => renderTemplate`<label class="dfx-chip" data-astro-cid-on44tawe><input type="checkbox" name="reward_kinds"${addAttribute(value, "value")}${addAttribute(config.rewardKinds.includes(value), "checked")} data-astro-cid-on44tawe>${dt(label)}</label>`)}</div> <span class="dfx-hint" data-astro-cid-on44tawe>${dt("Leave all empty for every reward.")}</span> </div> <div class="dfx-field" data-astro-cid-on44tawe><span class="dfx-label" data-astro-cid-on44tawe>${dt("Only these tasks")}</span> <div class="dfx-chips" data-astro-cid-on44tawe>${taskKinds.map(([value, label]) => renderTemplate`<label class="dfx-chip" data-astro-cid-on44tawe><input type="checkbox" name="task_kinds"${addAttribute(value, "value")}${addAttribute(config.taskKinds.includes(value), "checked")} data-astro-cid-on44tawe>${dt(label)}</label>`)}</div> <span class="dfx-hint" data-astro-cid-on44tawe>${dt("Leave all empty for every task.")}</span> </div> </section> <section class="dfx-sec" data-astro-cid-on44tawe> <div class="dfx-sec-head" data-astro-cid-on44tawe><h2 data-astro-cid-on44tawe>${dt("More options")}</h2><p data-astro-cid-on44tawe>${dt("Open the ones you need.")}</p></div> <details class="dfx-acc"${addAttribute(Object.values(config.typeTemplates).some(Boolean) || Object.values(config.methodTypeTemplates).some(Boolean), "open")} data-astro-cid-on44tawe> <summary data-astro-cid-on44tawe><span class="dfx-acc-title" data-astro-cid-on44tawe><b data-astro-cid-on44tawe>${dt("A different design for each reward")}</b><em data-astro-cid-on44tawe>${dt("Orbs, collectibles, codes and more can each look different.")}</em></span>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14", "data-astro-cid-on44tawe": true })}</summary> <div class="dfx-acc-body" data-astro-cid-on44tawe> <span class="dfx-hint" data-astro-cid-on44tawe>${dt("Choose a saved embed (normal or V2) for the kinds of reward you want to look different, such as Orbs or avatar decorations. A quest uses the one of its reward; if there is none, the general design above.")}</span> <div class="qa-types" data-astro-cid-on44tawe> <div class="qa-types-head" aria-hidden="true" data-astro-cid-on44tawe><span data-astro-cid-on44tawe></span><span data-astro-cid-on44tawe>${dt("Alert")}</span><span data-astro-cid-on44tawe>${dt("Method")}</span></div> ${rewardKinds.map(([value, label]) => renderTemplate`<div class="dfx-field qa-type" data-astro-cid-on44tawe> <label data-astro-cid-on44tawe>${dt(label)}</label> <select${addAttribute(`type_template_${value}`, "name")}${addAttribute(dt("Alert"), "aria-label")} data-astro-cid-on44tawe><option value="" data-astro-cid-on44tawe>${dt("The general design")}</option>${embedTemplates.map((tpl) => renderTemplate`<option${addAttribute(tpl.name, "value")}${addAttribute(tpl.name === config.typeTemplates[value], "selected")} data-astro-cid-on44tawe>${tpl.name}${tpl.v2 ? " (V2)" : ""}</option>`)}</select> <select${addAttribute(`method_type_template_${value}`, "name")}${addAttribute(dt("Method"), "aria-label")} data-astro-cid-on44tawe><option value="" data-astro-cid-on44tawe>${dt("The general method")}</option>${embedTemplates.map((tpl) => renderTemplate`<option${addAttribute(tpl.name, "value")}${addAttribute(tpl.name === config.methodTypeTemplates[value], "selected")} data-astro-cid-on44tawe>${tpl.name}${tpl.v2 ? " (V2)" : ""}</option>`)}</select> </div>`)} </div> <span class="dfx-hint" data-astro-cid-on44tawe>${dt("The first list is the alert, the second one is the method.")}</span> </div> </details> <details class="dfx-acc"${addAttribute(config.autoThread, "open")} data-astro-cid-on44tawe> <summary data-astro-cid-on44tawe><span class="dfx-acc-title" data-astro-cid-on44tawe><b data-astro-cid-on44tawe>${dt("Thread")}</b><em data-astro-cid-on44tawe>${dt("A thread under each alert to talk about the quest.")}</em></span>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14", "data-astro-cid-on44tawe": true })}</summary> <div class="dfx-acc-body" data-astro-cid-on44tawe> <label class="dfx-switch" data-astro-cid-on44tawe><span data-astro-cid-on44tawe><b data-astro-cid-on44tawe>${dt("Open a thread under each alert")}</b></span><input type="checkbox" class="dfx-t" name="auto_thread"${addAttribute(config.autoThread, "checked")} data-astro-cid-on44tawe></label> <div class="dfx-field" data-astro-cid-on44tawe><label data-astro-cid-on44tawe>${dt("Thread name")}</label><textarea name="thread_name" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-ac="vars,emojis" placeholder="{quest.name}" maxlength="100" data-astro-cid-on44tawe>${config.threadName}</textarea><span class="dfx-hint" data-astro-cid-on44tawe>${dt("Quest variables such as {quest.name} and {quest.game} work. Empty uses the name of the quest.")}</span></div> <label class="dfx-switch" data-astro-cid-on44tawe><span data-astro-cid-on44tawe><b data-astro-cid-on44tawe>${dt("Ping the role inside the thread (its members are added to it)")}</b></span><input type="checkbox" class="dfx-t" name="thread_ping"${addAttribute(config.threadPing, "checked")} data-astro-cid-on44tawe></label> <div class="dfx-field" data-astro-cid-on44tawe><label data-astro-cid-on44tawe>${dt("Hide an idle thread after")}</label><select name="thread_archive" data-astro-cid-on44tawe>${archiveChoices.map(([value, label]) => renderTemplate`<option${addAttribute(value, "value")}${addAttribute(value === config.threadArchive, "selected")} data-astro-cid-on44tawe>${dt(label)}</option>`)}</select></div> <span class="dfx-hint" data-astro-cid-on44tawe>${dt("Petto needs the Create Public Threads permission in the alert channel.")}</span> </div> </details> <details class="dfx-acc"${addAttribute(config.methodEnabled, "open")} data-astro-cid-on44tawe> <summary data-astro-cid-on44tawe><span class="dfx-acc-title" data-astro-cid-on44tawe><b data-astro-cid-on44tawe>${dt("How to complete it (the method)")}</b><em data-astro-cid-on44tawe>${dt("A message with the steps, sent with each new quest.")}</em></span>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14", "data-astro-cid-on44tawe": true })}</summary> <div class="dfx-acc-body" data-astro-cid-on44tawe> <span class="dfx-hint" data-astro-cid-on44tawe>${dt("A message that tells how to complete the quests, written once and sent with each new quest. It can have several texts, pictures and buttons if you make it as a saved embed.")}</span> <label class="dfx-switch" data-astro-cid-on44tawe><span data-astro-cid-on44tawe><b data-astro-cid-on44tawe>${dt("Send the method with each new quest")}</b></span><input type="checkbox" class="dfx-t" name="method_enabled"${addAttribute(config.methodEnabled, "checked")} data-astro-cid-on44tawe></label> <div class="dfx-field" data-astro-cid-on44tawe><label data-astro-cid-on44tawe>${dt("Saved embed")}</label> <select name="method_template" data-tpl-locks="method_text" data-astro-cid-on44tawe><option value="" data-astro-cid-on44tawe>${dt("None")}</option>${embedTemplates.map((tpl) => renderTemplate`<option${addAttribute(tpl.name, "value")}${addAttribute(tpl.name === config.methodTemplate, "selected")} data-astro-cid-on44tawe>${tpl.name}${tpl.v2 ? " (V2)" : ""}</option>`)}</select> ${config.methodTemplate && renderTemplate`<a class="dfx-link"${addAttribute(`/dash/guild/${guildId}/embeds?name=${encodeURIComponent(config.methodTemplate)}`, "href")} data-astro-cid-on44tawe>${dt("Edit this design")}</a>`} </div> <div class="dfx-field" data-astro-cid-on44tawe><label data-astro-cid-on44tawe>${dt("Or a plain text")}</label><textarea name="method_text" class="dgl-autogrow" data-ac data-count rows="6" maxlength="2000"${addAttribute(dt("Step 1: ..."), "placeholder")} data-astro-cid-on44tawe>${config.methodText}</textarea><span class="dfx-hint" data-astro-cid-on44tawe>${dt("Used when there is no saved embed, or when it is missing. The quest variables work, such as {quest.name} and {quest.task}.")}</span></div> <div class="dfx-grid" data-astro-cid-on44tawe> <div class="dfx-field" data-astro-cid-on44tawe><label data-astro-cid-on44tawe>${dt("Where it goes")}</label> <select name="method_target" data-astro-cid-on44tawe><option value="thread"${addAttribute(config.methodTarget !== "channel", "selected")} data-astro-cid-on44tawe>${dt("In the thread of the alert")}</option><option value="channel"${addAttribute(config.methodTarget === "channel", "selected")} data-astro-cid-on44tawe>${dt("In a channel")}</option></select> </div> <div class="dfx-field" data-astro-cid-on44tawe><label data-astro-cid-on44tawe>${dt("Channel for the method")}</label><select name="method_channel_id" data-astro-cid-on44tawe><option value="" data-astro-cid-on44tawe>${dt("The alert channel")}</option>${channels.map((ch) => renderTemplate`<option${addAttribute(ch.id, "value")}${addAttribute(ch.id === config.methodChannelId, "selected")} data-astro-cid-on44tawe>#${ch.name}</option>`)}</select></div> </div> <label class="dfx-switch" data-astro-cid-on44tawe><span data-astro-cid-on44tawe><b data-astro-cid-on44tawe>${dt("Ping the role with the method")}</b></span><input type="checkbox" class="dfx-t" name="method_ping"${addAttribute(config.methodPing, "checked")} data-astro-cid-on44tawe></label> <div class="dfx-foot" data-astro-cid-on44tawe> <button type="submit" form="qa-method-form" class="btn btn-ghost btn-sm qa-make"${addAttribute(!ready, "disabled")} data-astro-cid-on44tawe>${dt("Send the method now")}</button> <span class="dfx-hint" data-astro-cid-on44tawe>${dt("Sends it for the newest active quest, in its thread or in the channel above. Save your changes first.")}</span> </div> </div> </details> </section> <div class="dfx-foot" data-astro-cid-on44tawe><button type="submit" class="btn btn-accent btn-sm"${addAttribute(!ready, "disabled")} data-astro-cid-on44tawe>${dt("Save changes")}</button></div> </form> <form method="POST" id="qa-method-form" data-no-dirty data-astro-cid-on44tawe><input type="hidden" name="action" value="send_method" data-astro-cid-on44tawe></form> <form method="POST" id="qa-design-form" data-no-dirty data-astro-cid-on44tawe><input type="hidden" name="action" value="create_design" data-astro-cid-on44tawe></form> </div> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashQuests.astro", void 0);

function questStarterV2() {
  return {
    components: [{
      type: 17,
      accent_color: 5793266,
      components: [
        { type: 10, content: "-# {quest.status}\n# <:pe_Quest_Badge1:1555687372430123018> [{quest.name}]({quest.url})" },
        { type: 12, items: [{ media: { url: "{quest.image}" } }] },
        { type: 14, divider: true, spacing: 1 },
        { type: 10, content: "- `⏰` **Starts:** {quest.starts} | **Ends:** {quest.expires}\n- `💿` **Platforms:** {quest.platforms}\n- `🧫` **Task:** {quest.tasks}" },
        { type: 14, divider: true, spacing: 1 },
        { type: 9, components: [{ type: 10, content: "## 🎁 Rewards\n* `🥇` **Type:** {quest.reward_type}\n* `💸` **Reward:** {quest.reward}" }], accessory: { type: 11, media: { url: "{quest.reward_image}" } } },
        { type: 14, divider: true, spacing: 1 },
        { type: 10, content: "## <:pe_Alert:1555688656876867726> Limitations\n* {quest.limits}" }
      ]
    }, {
      type: 1,
      components: [
        { type: 2, style: 5, label: "Accept Quest", url: "{quest.url}" },
        { type: 2, style: 5, label: "Game page", url: "{quest.link}" }
      ]
    }]
  };
}

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Quests = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Quests;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!canUseQuests(Astro2, session.userId)) return Astro2.redirect(`/dash/guild/${id}/overview`);
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const REWARD_KINDS = ["orbs", "decoration", "code", "ingame", "nitro"];
  const TASK_KINDS = ["video", "play", "stream", "activity"];
  const SECTIONS = ["image", "rewards", "tasks", "platforms", "limits"];
  let saved = false;
  let methodResult = null;
  const ARCHIVE_MINUTES = [60, 1440, 4320, 10080];
  const snowflake = (value) => /^\d{15,25}$/.test(String(value ?? "").trim()) ? String(value).trim() : null;
  let tableMissing = false;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    if (String(form.get("action") ?? "") === "create_design") {
      const taken = new Set((await (await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name`, { headers: apiHeaders })).json().catch(() => [])).map((row) => row.name));
      let name = "quest-alert";
      for (let n = 2; taken.has(name) && n < 50; n += 1) name = `quest-alert-${n}`;
      const checked = validateTemplate({ v2: questStarterV2() });
      if (checked.ok) {
        const created = await fetch(`${apiUrl}/rest/v1/embed_templates`, { method: "POST", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ guild_id: id, name, data: checked.data }) });
        if (created.ok) {
          await fetch(`${apiUrl}/rest/v1/quest_config?on_conflict=guild_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, style: "template", embed_template: name, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
          return Astro2.redirect(`/dash/guild/${id}/embeds?name=${encodeURIComponent(name)}`);
        }
      }
      return Astro2.redirect(`/dash/guild/${id}/quests`);
    }
    if (String(form.get("action") ?? "") === "send_method") {
      methodResult = await callPettoQuestMethod(Astro2, id, session.userId, String(form.get("quest_id") ?? "").trim() || void 0);
    } else {
      const typeMap = (prefix) => Object.fromEntries(REWARD_KINDS.map((kind) => [kind, String(form.get(`${prefix}${kind}`) ?? "").trim().slice(0, 40)]).filter(([, name]) => name));
      const pick = (name, allowed) => form.getAll(name).map(String).filter((value) => allowed.includes(value));
      const hex = String(form.get("accent_color") ?? "").trim().replace(/^#/, "");
      const style = String(form.get("style") ?? "card") === "template" ? "template" : "card";
      const res = await fetch(`${apiUrl}/rest/v1/quest_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          enabled: form.get("enabled") === "on",
          channel_id: String(form.get("channel_id") ?? "").trim() || null,
          role_id: String(form.get("role_id") ?? "").trim() || null,
          style,
          embed_template: String(form.get("embed_template") ?? "").trim().slice(0, 40) || null,
          reward_kinds: pick("reward_kinds", REWARD_KINDS),
          task_kinds: pick("task_kinds", TASK_KINDS),
          hide_sections: SECTIONS.filter((section) => form.get(`hide_${section}`) === "on"),
          accent_color: /^[0-9a-f]{6}$/i.test(hex) ? parseInt(hex, 16) : null,
          expiring_hours: Math.max(0, Math.min(168, Number(form.get("expiring_hours") ?? 0) || 0)),
          auto_thread: form.get("auto_thread") === "on",
          thread_name: String(form.get("thread_name") ?? "").trim().slice(0, 100) || null,
          thread_ping: form.get("thread_ping") === "on",
          thread_archive: ARCHIVE_MINUTES.includes(Number(form.get("thread_archive"))) ? Number(form.get("thread_archive")) : 1440,
          method_enabled: form.get("method_enabled") === "on",
          method_template: String(form.get("method_template") ?? "").trim().slice(0, 40) || null,
          method_text: String(form.get("method_text") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 2e3) || null,
          method_target: String(form.get("method_target") ?? "thread") === "channel" ? "channel" : "thread",
          method_channel_id: snowflake(form.get("method_channel_id")),
          method_ping: form.get("method_ping") === "on",
          type_templates: typeMap("type_template_"),
          method_type_templates: typeMap("method_type_template_"),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      saved = res.ok;
      tableMissing = !res.ok;
    }
  }
  const [guildInfo, configRes, channelsRes, rolesRes, templatesRes] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/quest_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    getGuildList(Astro2, id, botToken, "channels"),
    getGuildList(Astro2, id, botToken, "roles"),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name,data&order=name.asc`, { headers: apiHeaders })
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = configRes.ok && !tableMissing;
  const c = (ready ? (await configRes.json())[0] : null) ?? {};
  const config = {
    enabled: c.enabled ?? false,
    channelId: c.channel_id ?? "",
    roleId: c.role_id ?? "",
    style: c.style ?? "card",
    embedTemplate: c.embed_template ?? "",
    rewardKinds: c.reward_kinds ?? [],
    taskKinds: c.task_kinds ?? [],
    hideSections: c.hide_sections ?? [],
    accentColor: Number.isInteger(c.accent_color) ? `#${c.accent_color.toString(16).padStart(6, "0")}` : "",
    expiringHours: c.expiring_hours ?? 0,
    autoThread: c.auto_thread ?? false,
    threadName: c.thread_name ?? "",
    threadPing: c.thread_ping ?? false,
    threadArchive: c.thread_archive ?? 1440,
    methodEnabled: c.method_enabled ?? false,
    methodTemplate: c.method_template ?? "",
    methodText: c.method_text ?? "",
    methodTarget: c.method_target === "channel" ? "channel" : "thread",
    methodChannelId: c.method_channel_id ?? "",
    methodPing: c.method_ping ?? false,
    typeTemplates: c.type_templates && typeof c.type_templates === "object" ? c.type_templates : {},
    methodTypeTemplates: c.method_type_templates && typeof c.method_type_templates === "object" ? c.method_type_templates : {}
  };
  const channels = (channelsRes.ok ? await channelsRes.json() : []).filter((ch) => ch.type === 0 || ch.type === 5).sort((a, b) => a.position - b.position).map((ch) => ({ id: ch.id, name: ch.name }));
  const roles = (rolesRes.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone").sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const embedTemplates = (templatesRes.ok ? await templatesRes.json() : []).map((row) => ({ name: row.name, v2: isV2Data(row.data) }));
  return renderTemplate`${renderComponent($$result, "DashQuests", $$DashQuests, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "config": config, "channels": channels, "roles": roles, "embedTemplates": embedTemplates, "ready": ready, "saved": saved, "methodResult": methodResult })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/quests.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/quests.astro";
const $$url = "/dash/guild/[id]/quests";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Quests,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
