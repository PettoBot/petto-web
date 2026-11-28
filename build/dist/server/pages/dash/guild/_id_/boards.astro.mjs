import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, d as renderComponent, u as unescapeHTML, F as Fragment } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$EmojiPicker } from '../../../../chunks/EmojiPicker_0tfnRmiq.mjs';
import { $ as $$Modal } from '../../../../chunks/Modal_-nOZLo0Z.mjs';
import { $ as $$ColorPicker } from '../../../../chunks/ColorPicker_DwzcbTkv.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$SxNumber } from '../../../../chunks/SxNumber_YL4vNksH.mjs';
import { m as makeT, g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                           */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { g as getGuildEmojis } from '../../../../chunks/guildEmojis_CIHVnrpZ.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
export { renderers } from '../../../../renderers.mjs';

const BOARD_KINDS = [
  { id: "star", table: "starboards", entries: "starboard_entries", name: "Starboard", emoji: "⭐", color: 16761095, icon: "ph:star-fill", variable: "star" },
  { id: "monkey", table: "monkeyboards", entries: "monkeyboard_entries", name: "Monkeyboard", emoji: "🐒", color: 9132587, icon: "ph:smiley-fill", variable: "monkey" },
  { id: "clown", table: "clownboards", entries: "clownboard_entries", name: "Clownboard", emoji: "🤡", color: 15227215, icon: "ph:smiley-wink-fill", variable: "clown" }
];
const MAX_EXTRA_EMOJIS = 4;
function boardFromRow(kind, row) {
  return {
    kind: kind.id,
    channelId: row.channel_id ?? "",
    threshold: Number(row.threshold) || 3,
    emoji: row.emoji || kind.emoji,
    extraEmojis: Array.isArray(row.extra_emojis) ? row.extra_emojis.map(String).slice(0, MAX_EXTRA_EMOJIS) : [],
    color: Number.isInteger(row.color) ? row.color : kind.color,
    selfstar: row.selfstar === true,
    timestamp: row.timestamp !== false,
    jumpurl: row.jumpurl !== false,
    attachments: row.attachments !== false,
    template: row.embed_template ?? "",
    ignoredChannelIds: row.ignored_channel_ids ?? [],
    ignoredRoleIds: row.ignored_role_ids ?? [],
    ignoredUserIds: row.ignored_user_ids ?? []
  };
}
const blankBoard = (kind) => boardFromRow(kind, {});
const SNOWFLAKE = /^\d{15,25}$/;
function rowFromForm(kind, guildId, form) {
  const emojis = [String(form.get("emoji") ?? ""), ...form.getAll("extra_emoji").map(String)].map((e) => e.trim().slice(0, 100)).filter(Boolean);
  const unique = [...new Set(emojis)];
  const colorHex = String(form.get("color") ?? "").trim();
  const template = String(form.get("embed_template") ?? "").trim().slice(0, 40);
  return {
    guild_id: guildId,
    channel_id: SNOWFLAKE.test(String(form.get("channel_id") ?? "").trim()) ? String(form.get("channel_id")).trim() : null,
    threshold: Math.max(1, Math.min(100, Math.floor(Number(form.get("threshold") ?? 3)) || 3)),
    emoji: unique[0] ?? kind.emoji,
    extra_emojis: unique.slice(1, 1 + MAX_EXTRA_EMOJIS),
    color: /^#[0-9a-f]{6}$/i.test(colorHex) ? parseInt(colorHex.slice(1), 16) : kind.color,
    selfstar: form.get("selfstar") === "on",
    timestamp: form.get("timestamp") === "on",
    jumpurl: form.get("jumpurl") === "on",
    attachments: form.get("attachments") === "on",
    embed_template: template || null,
    ignored_channel_ids: form.getAll("ignored_channel_ids").map(String).filter((id) => SNOWFLAKE.test(id)).slice(0, 100),
    ignored_role_ids: form.getAll("ignored_role_ids").map(String).filter((id) => SNOWFLAKE.test(id)).slice(0, 100),
    ignored_user_ids: String(form.get("ignored_user_ids") ?? "").split(/[\s,]+/).filter((v) => SNOWFLAKE.test(v)).slice(0, 100),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}

const $$Astro$2 = createAstro("https://petto.sbs");
const $$BoardFields = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$BoardFields;
  const dt = makeT(getDashLang(Astro2));
  const { kind, board, channels, roles, templates, uid } = Astro2.props;
  const extras = [...board.extraEmojis, ...Array(MAX_EXTRA_EMOJIS).fill("")].slice(0, MAX_EXTRA_EMOJIS);
  return renderTemplate`${maybeRenderHead()}<div class="bf-grid" data-astro-cid-lea3f62g> <div class="sx-field" data-astro-cid-lea3f62g><label data-astro-cid-lea3f62g>${dt("Channel")}</label> <select name="channel_id" required data-astro-cid-lea3f62g> <option value="" data-astro-cid-lea3f62g>${dt("Choose a channel")}</option> ${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === board.channelId, "selected")} data-astro-cid-lea3f62g>#${c.name}</option>`)} </select> </div> <div class="sx-field" data-astro-cid-lea3f62g><label data-astro-cid-lea3f62g>${dt("Reactions needed")}</label>${renderComponent($$result, "SxNumber", $$SxNumber, { "name": "threshold", "min": "1", "max": "100", "value": board.threshold, "required": true, "data-astro-cid-lea3f62g": true })}</div> </div> <div class="sx-field" data-astro-cid-lea3f62g> <span class="sx-label" data-astro-cid-lea3f62g>${dt("Emojis")}</span> <div class="bf-emojis" data-astro-cid-lea3f62g> <input type="text" name="emoji" data-emoji-input maxlength="100"${addAttribute(board.emoji, "value")}${addAttribute(dt("Emoji"), "placeholder")} required${addAttribute(dt("Main emoji"), "aria-label")} data-astro-cid-lea3f62g> ${extras.map((e) => renderTemplate`<input type="text" name="extra_emoji" data-emoji-input maxlength="100"${addAttribute(e, "value")}${addAttribute(dt("Another"), "placeholder")}${addAttribute(dt("Another emoji"), "aria-label")} data-astro-cid-lea3f62g>`)} </div> <span class="sx-hint" data-astro-cid-lea3f62g>${dt("The first is the main one, the others are optional. Any of them counts, and whoever reacts with several counts once.")}</span> </div> ${renderComponent($$result, "ColorPicker", $$ColorPicker, { "name": "color", "value": `#${board.color.toString(16).padStart(6, "0")}`, "label": dt("Color of the repost"), "data-astro-cid-lea3f62g": true })} <div class="sx-switches" data-astro-cid-lea3f62g> <label class="sx-switch" data-astro-cid-lea3f62g><input type="checkbox" name="selfstar"${addAttribute(board.selfstar, "checked")} data-astro-cid-lea3f62g><span class="sx-switch-text" data-astro-cid-lea3f62g><b data-astro-cid-lea3f62g>${dt("Count the message author's own reaction")}</b></span><i class="sx-toggle" data-astro-cid-lea3f62g></i></label> <label class="sx-switch" data-astro-cid-lea3f62g><input type="checkbox" name="timestamp"${addAttribute(board.timestamp, "checked")} data-astro-cid-lea3f62g><span class="sx-switch-text" data-astro-cid-lea3f62g><b data-astro-cid-lea3f62g>${dt("Show the original timestamp")}</b></span><i class="sx-toggle" data-astro-cid-lea3f62g></i></label> <label class="sx-switch" data-astro-cid-lea3f62g><input type="checkbox" name="jumpurl"${addAttribute(board.jumpurl, "checked")} data-astro-cid-lea3f62g><span class="sx-switch-text" data-astro-cid-lea3f62g><b data-astro-cid-lea3f62g>${dt("Add an Original Message button")}</b></span><i class="sx-toggle" data-astro-cid-lea3f62g></i></label> <label class="sx-switch" data-astro-cid-lea3f62g><input type="checkbox" name="attachments"${addAttribute(board.attachments, "checked")} data-astro-cid-lea3f62g><span class="sx-switch-text" data-astro-cid-lea3f62g><b data-astro-cid-lea3f62g>${dt("Include attachments and images")}</b></span><i class="sx-toggle" data-astro-cid-lea3f62g></i></label> </div> <div class="sx-field" data-astro-cid-lea3f62g><label data-astro-cid-lea3f62g>${dt("Repost design")}</label> <select name="embed_template" data-astro-cid-lea3f62g> <option value=""${addAttribute(!board.template, "selected")} data-astro-cid-lea3f62g>${dt("Use Petto default")}</option> ${templates.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === board.template, "selected")} data-astro-cid-lea3f62g>${name}</option>`)} </select> <span class="sx-hint" data-astro-cid-lea3f62g>${dt("A saved design from the Embeds page. It can use the variables of this board, like {star.count} or {star.link}.").replaceAll("star", kind.variable)}</span> </div> <div class="sx-field" data-astro-cid-lea3f62g><span class="sx-label" data-astro-cid-lea3f62g>${dt("Ignored channels")}</span>${renderComponent($$result, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "ignored_channel_ids", "options": channels, "selected": board.ignoredChannelIds, "placeholder": dt("Search channels..."), "data-astro-cid-lea3f62g": true })}</div> <div class="sx-field" data-astro-cid-lea3f62g><span class="sx-label" data-astro-cid-lea3f62g>${dt("Ignored roles")}</span>${renderComponent($$result, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "ignored_role_ids", "options": roles, "selected": board.ignoredRoleIds, "placeholder": dt("Search roles..."), "data-astro-cid-lea3f62g": true })}</div> <div class="sx-field" data-astro-cid-lea3f62g><label data-astro-cid-lea3f62g>${dt("Ignored members")}</label><textarea name="ignored_user_ids" class="dgl-autogrow sx-one" rows="1" maxlength="2700"${addAttribute(dt("Ignored member IDs, comma-separated"), "placeholder")} data-astro-cid-lea3f62g>${board.ignoredUserIds.join(", ")}</textarea></div> `;
}, "/home/runner/work/petto-web/petto-web/src/components/BoardFields.astro", void 0);

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashBoards = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashBoards;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, boards, entryCounts, channels, roles, templates, customEmojis, ready, saved, failed } = Astro2.props;
  const names = new Map(channels.map((c) => [c.id, c.name]));
  const byKind = new Map(boards.map((b) => [b.kind, b]));
  const free = BOARD_KINDS.filter((k, i) => !byKind.has(k.id) && ready[i]);
  const kindNames = { star: dt("Starboard"), monkey: dt("Monkeyboard"), clown: dt("Clownboard") };
  const savedText = { saved: dt("Saved."), removed: dt("Board removed.") };
  const errors = { board: dt("Choose a board from the list."), save: dt("It could not be saved. Try again in a moment.") };
  const allReady = ready.every(Boolean);
  const hex = (n) => `#${n.toString(16).padStart(6, "0")}`;
  const blurb = {
    star: dt("What the server loves: the messages with enough reactions are reposted in its own channel."),
    monkey: dt("The opposite of the starboard: the messages that deserve a facepalm."),
    clown: dt("The messages that make the server laugh at someone.")
  };
  const kindIndex = new Map(BOARD_KINDS.map((k, i) => [k.id, i]));
  const reposted = boards.map((b) => entryCounts[kindIndex.get(b.kind) ?? 0]);
  const repostedKnown = reposted.length > 0 && reposted.every((n) => n !== null);
  const repostedTotal = reposted.reduce((sum, n) => sum + (n ?? 0), 0);
  const emojiTotal = boards.reduce((sum, b) => sum + 1 + b.extraEmojis.length, 0);
  const ignoredOf = (b) => b.ignoredChannelIds.length + b.ignoredRoleIds.length + b.ignoredUserIds.length;
  const ignoredTotal = boards.reduce((sum, b) => sum + ignoredOf(b), 0);
  const emojiHtml = (e) => {
    const m = /^<(a?):\w+:(\d+)>$/.exec(e);
    return m ? `<img src="https://cdn.discordapp.com/emojis/${m[2]}.${m[1] ? "gif" : "png"}?size=32" alt="" width="18" height="18">` : e;
  };
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "boards", "pageTitle": dt("Boards"), "data-astro-cid-aj7edp3r": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-aj7edp3r": true })} ${maybeRenderHead()}<div class="sx-page bd" data-astro-cid-aj7edp3r> <div class="bd-top" data-astro-cid-aj7edp3r> <div data-astro-cid-aj7edp3r> <h1 data-astro-cid-aj7edp3r>${dt("Boards")}</h1> <p class="bd-lead" data-astro-cid-aj7edp3r>${dt("Messages that get enough reactions are reposted in a channel of their own.")}</p> </div> <button type="button" class="btn btn-accent btn-sm" data-modal-open="bd-new"${addAttribute(!free.length, "disabled")} data-astro-cid-aj7edp3r>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "14", "height": "14", "data-astro-cid-aj7edp3r": true })}${dt("Add board")}</button> </div> ${saved && renderTemplate`<div class="sx-flash" data-astro-cid-aj7edp3r>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-aj7edp3r": true })}${savedText[saved] ?? savedText.saved}</div>`} ${failed && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-aj7edp3r>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-aj7edp3r": true })}${errors[failed] ?? errors.save}</div>`} ${!allReady && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-aj7edp3r>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-aj7edp3r": true })}${dt("Some boards arrive with the next Petto update.")}</div>`} ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Active boards"), value: boards.length, tone: "joins" },
    ...repostedKnown ? [{ label: dt("Messages reposted"), value: repostedTotal, tone: "messages" }] : [],
    { label: dt("Emojis watched"), value: emojiTotal, tone: "reactions" },
    { label: dt("Ignored"), value: ignoredTotal, tone: "leaves" }
  ], "data-astro-cid-aj7edp3r": true })} <div class="bd-grid dgl-stagger" data-astro-cid-aj7edp3r> ${BOARD_KINDS.map((kind, i) => {
    const b = byKind.get(kind.id);
    const color = hex(b?.color ?? kind.color);
    const count = entryCounts[i];
    return renderTemplate`<article${addAttribute(`sx-panel bd-board${b ? "" : " bd-board-off"}`, "class")}${addAttribute(`--c:${color}`, "style")} data-astro-cid-aj7edp3r> <header class="bd-head" data-astro-cid-aj7edp3r> <span class="bd-ico" data-astro-cid-aj7edp3r>${renderComponent($$result2, "Icon", $$Icon, { "name": kind.icon, "width": "18", "height": "18", "data-astro-cid-aj7edp3r": true })}</span> <div class="bd-main" data-astro-cid-aj7edp3r> <b data-astro-cid-aj7edp3r>${kindNames[kind.id]}</b> <span data-astro-cid-aj7edp3r>${b ? `${b.channelId ? `#${names.get(b.channelId) ?? b.channelId}` : dt("No channel")} \xB7 ${dt("{n} reactions", { n: b.threshold })}` : blurb[kind.id]}</span> </div> </header> <div class="bd-preview"${addAttribute(dt("Preview"), "aria-label")} data-astro-cid-aj7edp3r> <p class="bd-pv-line" data-astro-cid-aj7edp3r><span data-astro-cid-aj7edp3r>${unescapeHTML(emojiHtml(b?.emoji ?? kind.emoji))}</span> <b data-astro-cid-aj7edp3r>${b?.threshold ?? 3}</b> <i data-astro-cid-aj7edp3r>${b?.channelId ? `#${names.get(b.channelId) ?? ""}` : "#memes"}</i></p> ${b?.template ? renderTemplate`<p class="bd-pv-design" data-astro-cid-aj7edp3r>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paint-brush-fill", "width": "14", "height": "14", "data-astro-cid-aj7edp3r": true })}${dt("Uses the saved design {name}.", { name: b.template })}</p>` : renderTemplate`<div class="bd-pv-embed" data-astro-cid-aj7edp3r> <div class="bd-pv-author" data-astro-cid-aj7edp3r><span class="bd-pv-av" data-astro-cid-aj7edp3r>L</span><b data-astro-cid-aj7edp3r>Liam</b></div> <p class="bd-pv-text" data-astro-cid-aj7edp3r>${dt("this is the best meme")}</p> <img class="bd-pv-img"${addAttribute(`/assets/memes/${kind.id}.jpg`, "src")} alt="" width="320" height="180" loading="lazy" decoding="async" data-astro-cid-aj7edp3r> ${(b?.jumpurl ?? true) && renderTemplate`<span class="bd-pv-btn" data-astro-cid-aj7edp3r>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-square-out-bold", "width": "12", "height": "12", "data-astro-cid-aj7edp3r": true })}${dt("Original message")}</span>`} </div>`} </div> ${b ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-aj7edp3r": true }, { "default": ($$result3) => renderTemplate` <ul class="bd-flags" data-astro-cid-aj7edp3r> ${[[dt("Timestamp"), b.timestamp], [dt("Original message"), b.jumpurl], [dt("Attachments"), b.attachments], [dt("Own reaction"), b.selfstar]].map(([label, on]) => renderTemplate`<li${addAttribute({ on }, "class:list")} data-astro-cid-aj7edp3r>${renderComponent($$result3, "Icon", $$Icon, { "name": on ? "ph:check-circle-fill" : "ph:minus-circle-fill", "width": "14", "height": "14", "data-astro-cid-aj7edp3r": true })}${label}</li>`)} </ul> <div class="bd-tags" data-astro-cid-aj7edp3r> <span class="sx-tag bd-tag-on" data-astro-cid-aj7edp3r>${dt("Active")}</span> ${count !== null && renderTemplate`<span class="sx-tag" data-astro-cid-aj7edp3r>${dt("Reposted: {n}", { n: count.toLocaleString(dashLang) })}</span>`} ${ignoredOf(b) > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-aj7edp3r>${dt("Ignores {n}", { n: ignoredOf(b) })}</span>`} </div> <div class="bd-foot" data-astro-cid-aj7edp3r> <span class="bd-emojis" data-astro-cid-aj7edp3r>${unescapeHTML([b.emoji, ...b.extraEmojis].map(emojiHtml).join(" "))}</span> <div class="bd-acts" data-astro-cid-aj7edp3r> <button type="button" class="bd-act"${addAttribute(`bd-${b.kind}`, "data-modal-open")}${addAttribute(dt("Edit"), "aria-label")}${addAttribute(dt("Edit"), "title")} data-astro-cid-aj7edp3r>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "15", "height": "15", "data-astro-cid-aj7edp3r": true })}</button> <form method="POST" data-no-dirty data-astro-cid-aj7edp3r> <input type="hidden" name="action" value="disable" data-astro-cid-aj7edp3r><input type="hidden" name="board"${addAttribute(b.kind, "value")} data-astro-cid-aj7edp3r> <button type="submit" class="bd-act bd-del"${addAttribute(dt("Remove board"), "aria-label")}${addAttribute(dt("Remove board"), "title")}${addAttribute(dt("Remove this board? Its reposts are forgotten, the messages already posted stay in the channel."), "data-confirm")} data-astro-cid-aj7edp3r>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-aj7edp3r": true })}</button> </form> </div> </div> ` })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-aj7edp3r": true }, { "default": ($$result3) => renderTemplate` <div class="bd-tags" data-astro-cid-aj7edp3r><span class="sx-tag" data-astro-cid-aj7edp3r>${dt("Not set up")}</span></div> <div class="bd-foot" data-astro-cid-aj7edp3r> <span class="bd-emojis" data-astro-cid-aj7edp3r>${kind.emoji}</span> <button type="button" class="btn btn-accent btn-sm" data-modal-open="bd-new"${addAttribute(kind.id, "data-board-pick")}${addAttribute(!ready[i], "disabled")} data-astro-cid-aj7edp3r>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "14", "height": "14", "data-astro-cid-aj7edp3r": true })}${dt("Set up")}</button> </div> ` })}`} </article>`;
  })} </div> <div class="sx-duo bd-help" data-astro-cid-aj7edp3r> <section class="sx-panel" data-astro-cid-aj7edp3r> <div class="sx-panel-head" data-astro-cid-aj7edp3r><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-aj7edp3r>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:star-fill", "width": "17", "height": "17", "data-astro-cid-aj7edp3r": true })}</span><h2 data-astro-cid-aj7edp3r>${dt("How reactions count")}</h2></div> <p class="sx-lead" data-astro-cid-aj7edp3r>${dt("The first is the main one, the others are optional. Any of them counts, and whoever reacts with several counts once.")}</p> </section> <section class="sx-panel" data-astro-cid-aj7edp3r> <div class="sx-panel-head" data-astro-cid-aj7edp3r><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-aj7edp3r>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "17", "height": "17", "data-astro-cid-aj7edp3r": true })}</span><h2 data-astro-cid-aj7edp3r>${dt("Commands")}</h2></div> <p class="sx-lead" data-astro-cid-aj7edp3r>${dt("With the prefix: !starboard, !monkeyboard and !clownboard, for example !starboard emoji \u2B50 \u{1F34C}.")}</p> </section> </div> </div> ${renderComponent($$result2, "Modal", $$Modal, { "id": "bd-new", "title": dt("New board"), "icon": "ph:star-fill", "data-astro-cid-aj7edp3r": true }, { "default": ($$result3) => renderTemplate` <form method="POST" class="bd-form" data-no-dirty data-board-add data-astro-cid-aj7edp3r> <input type="hidden" name="action" value="save" data-astro-cid-aj7edp3r> <div class="bd-kinds" role="radiogroup"${addAttribute(dt("Which board"), "aria-label")} data-astro-cid-aj7edp3r> ${free.map((k, i) => renderTemplate`<label class="bd-kind" data-astro-cid-aj7edp3r><input type="radio" name="board"${addAttribute(k.id, "value")}${addAttribute(i === 0, "checked")}${addAttribute(k.emoji, "data-kind-emoji")} data-astro-cid-aj7edp3r><span data-astro-cid-aj7edp3r>${renderComponent($$result3, "Icon", $$Icon, { "name": k.icon, "width": "15", "height": "15", "data-astro-cid-aj7edp3r": true })}${kindNames[k.id]} <em data-astro-cid-aj7edp3r>${k.emoji}</em></span></label>`)} </div> ${free[0] && renderTemplate`${renderComponent($$result3, "BoardFields", $$BoardFields, { "kind": free[0], "board": blankBoard(free[0]), "channels": channels, "roles": roles, "templates": templates, "uid": "new", "data-astro-cid-aj7edp3r": true })}`} <footer data-astro-cid-aj7edp3r><button type="button" class="btn btn-ghost btn-sm" data-modal-close data-astro-cid-aj7edp3r>${dt("Cancel")}</button><button type="submit" class="btn btn-accent btn-sm" data-keep data-astro-cid-aj7edp3r>${dt("Create")}</button></footer> </form> ` })} ${boards.map((b) => {
    const kind = BOARD_KINDS.find((k) => k.id === b.kind);
    return renderTemplate`${renderComponent($$result2, "Modal", $$Modal, { "id": `bd-${b.kind}`, "title": kindNames[b.kind], "icon": kind.icon, "data-astro-cid-aj7edp3r": true }, { "default": ($$result3) => renderTemplate` <form method="POST" class="bd-form" data-no-dirty data-astro-cid-aj7edp3r> <input type="hidden" name="action" value="save" data-astro-cid-aj7edp3r><input type="hidden" name="board"${addAttribute(b.kind, "value")} data-astro-cid-aj7edp3r> ${renderComponent($$result3, "BoardFields", $$BoardFields, { "kind": kind, "board": b, "channels": channels, "roles": roles, "templates": templates, "uid": b.kind, "data-astro-cid-aj7edp3r": true })} <footer data-astro-cid-aj7edp3r><button type="button" class="btn btn-ghost btn-sm" data-modal-close data-astro-cid-aj7edp3r>${dt("Cancel")}</button><button type="submit" class="btn btn-accent btn-sm" data-keep data-astro-cid-aj7edp3r>${dt("Save")}</button></footer> </form> ` })}`;
  })}${renderComponent($$result2, "EmojiPicker", $$EmojiPicker, { "customEmojis": customEmojis, "data-astro-cid-aj7edp3r": true })} ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashBoards.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Boards = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Boards;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  let saved = "";
  let failed = "";
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const kind = BOARD_KINDS.find((k) => k.id === String(form.get("board") ?? ""));
    if (!kind) failed = "board";
    else if (action === "disable") {
      const entries = await fetch(`${apiUrl}/rest/v1/${kind.entries}?guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders }).catch(() => null);
      const res = await fetch(`${apiUrl}/rest/v1/${kind.table}?guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders }).catch(() => null);
      if (entries?.ok && res?.ok) saved = "removed";
      else failed = "save";
    } else if (action === "save") {
      await ensureGuildRow(apiUrl, apiHeaders, id);
      const res = await fetch(`${apiUrl}/rest/v1/${kind.table}?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(rowFromForm(kind, id, form))
      }).catch(() => null);
      if (res?.ok) saved = "saved";
      else failed = "save";
    } else failed = "board";
  }
  const [guildInfo, channelsRes, rolesRes, templatesRes, customEmojis, ...boardAndCountRes] = await Promise.all([
    getGuildInfo(id, botToken),
    getGuildList(Astro2, id, botToken, "channels"),
    getGuildList(Astro2, id, botToken, "roles"),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders }).catch(() => null),
    getGuildEmojis(id, botToken),
    ...BOARD_KINDS.map((k) => fetch(`${apiUrl}/rest/v1/${k.table}?guild_id=eq.${id}&select=*`, { headers: apiHeaders }).catch(() => null)),
    // How many messages each board has reposted: only the total of its entries is asked for (one row and the count in the header), never the rows.
    ...BOARD_KINDS.map((k) => fetch(`${apiUrl}/rest/v1/${k.entries}?guild_id=eq.${id}&select=guild_id`, { headers: { ...apiHeaders, Prefer: "count=exact", Range: "0-0" } }).catch(() => null))
  ]);
  const boardRes = boardAndCountRes.slice(0, BOARD_KINDS.length);
  const entryCounts = await Promise.all(boardAndCountRes.slice(BOARD_KINDS.length).map(async (res) => {
    await res?.body?.cancel().catch(() => {
    });
    if (res?.status === 416) return 0;
    const total = Number(res?.headers.get("content-range")?.split("/")[1]);
    return res?.ok && Number.isFinite(total) ? total : null;
  }));
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const channels = (channelsRes?.ok ? await channelsRes.json() : []).filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone" && !r.managed).sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const templates = templatesRes?.ok ? (await templatesRes.json()).map((t) => t.name) : [];
  const ready = boardRes.map((r) => Boolean(r?.ok));
  const boards = [];
  for (let i = 0; i < BOARD_KINDS.length; i++) {
    const rows = ready[i] ? await boardRes[i].json() : [];
    if (rows[0]) boards.push(boardFromRow(BOARD_KINDS[i], rows[0]));
  }
  return renderTemplate`${renderComponent($$result, "DashBoards", $$DashBoards, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "boards": boards, "entryCounts": entryCounts, "channels": channels, "roles": roles, "templates": templates, "customEmojis": customEmojis, "ready": ready, "saved": saved, "failed": failed })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/boards.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/boards.astro";
const $$url = "/dash/guild/[id]/boards";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Boards,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
