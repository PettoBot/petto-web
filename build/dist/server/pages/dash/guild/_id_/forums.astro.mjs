import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, F as Fragment, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout, f as forumsReady } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$ColorPicker } from '../../../../chunks/ColorPicker_DwzcbTkv.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                           */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { B as callPettoForums } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { g as getMemberProfiles } from '../../../../chunks/memberNames_skiCoAs8.mjs';
import { w as withinBudget } from '../../../../chunks/liveCall_BSZ7MViH.mjs';
export { renderers } from '../../../../renderers.mjs';

const MAX_SETUPS = 5;
const NAME = /^[a-z0-9][a-z0-9_-]{0,31}$/;
const SNOWFLAKE = /^\d{15,25}$/;
const BUTTON_STYLES = ["primary", "secondary", "success", "danger"];
const LOG_EVENTS = ["opened", "locked", "closed", "solved"];
const STATUSES = ["open", "solved", "locked", "closed"];
const LIMITS = { label: 45, panelTitle: 200, panelText: 2e3, panelFooter: 300, button: 80, firstMessage: 1500, guidelines: 1500, roles: 25, users: 50, tags: 20, extra: 3 };
const QUESTION_KINDS = ["short_text", "long_text", "select"];
const clip = (value, max) => String(value ?? "").replace(/\u0000/g, "").replace(/\r\n?/g, "\n").trim().slice(0, max);
const textOrNull = (value, max) => clip(value, max) || null;
const whole = (value, min, max, fallback) => {
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const oneOf = (value, list, fallback) => list.includes(String(value)) ? String(value) : fallback;
const ids = (value, max) => [...new Set((Array.isArray(value) ? value : []).map(String).filter((id) => SNOWFLAKE.test(id)))].slice(0, max);
const snowflakeOrNull = (value) => SNOWFLAKE.test(String(value ?? "")) ? String(value) : null;
function slugName(value) {
  const slug = String(value ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9_-]+/g, "-").replace(/^[-_]+|[-_]+$/g, "").slice(0, 32);
  return NAME.test(slug) ? slug : "";
}
function hexToInt(value) {
  const text = String(value ?? "").trim();
  return /^#?[0-9a-f]{6}$/i.test(text) ? parseInt(text.replace("#", ""), 16) : null;
}
const intToHex = (value) => Number.isInteger(value) ? `#${Number(value).toString(16).padStart(6, "0")}` : "";
function cleanQuestions(list, askImages) {
  const out = [];
  for (const raw of Array.isArray(list) ? list : []) {
    const type = oneOf(raw?.type, QUESTION_KINDS, "short_text");
    const label = clip(raw?.label, LIMITS.label);
    if (!label) continue;
    const question = { type, label, required: raw?.required !== false };
    if (type === "select") {
      const options = [...new Set(String(Array.isArray(raw?.options) ? raw.options.join("\n") : raw?.options ?? "").split("\n").map((o) => clip(o, 100)).filter(Boolean))].slice(0, 25);
      if (!options.length) continue;
      question.options = options;
    }
    out.push(question);
    if (out.length >= (askImages ? LIMITS.extra - 1 : LIMITS.extra)) break;
  }
  return out;
}
function setupFromForm(form, forumName = "") {
  const text = (name, max) => textOrNull(form.get(name), max);
  const checked = (name) => form.get(name) === "on";
  const askImages = checked("ask_images");
  const questions = [];
  for (let n = 1; n <= LIMITS.extra; n += 1) questions.push({ type: form.get(`q_type_${n}`), label: form.get(`q_label_${n}`), required: checked(`q_required_${n}`), options: form.get(`q_options_${n}`) });
  return {
    name: slugName(form.get("name")) || slugName(forumName) || "forum",
    forum_channel_id: snowflakeOrNull(form.get("forum_channel_id")) ?? "",
    enabled: checked("enabled"),
    panel_channel_id: snowflakeOrNull(form.get("panel_channel_id")),
    panel_template: text("panel_template", 100),
    panel_title: text("panel_title", LIMITS.panelTitle),
    panel_description: text("panel_description", LIMITS.panelText),
    panel_color: hexToInt(form.get("panel_color")),
    panel_image: /^https:\/\/\S+$/i.test(clip(form.get("panel_image"), 500)) ? clip(form.get("panel_image"), 500) : null,
    panel_footer: text("panel_footer", LIMITS.panelFooter),
    button_label: text("button_label", LIMITS.button),
    button_emoji: text("button_emoji", 100),
    button_style: oneOf(form.get("button_style"), BUTTON_STYLES, "success"),
    modal_title: text("modal_title", LIMITS.label),
    title_label: text("title_label", LIMITS.label),
    description_label: text("description_label", LIMITS.label),
    ask_images: askImages,
    extra_fields: cleanQuestions(questions, askImages),
    require_tag: checked("require_tag"),
    tag_ids: ids(form.getAll("tag_ids"), LIMITS.tags),
    max_tags: whole(form.get("max_tags"), 1, 5, 1),
    solved_tag_id: snowflakeOrNull(form.get("solved_tag_id")),
    first_message: text("first_message", LIMITS.firstMessage),
    first_message_style: oneOf(form.get("first_message_style"), ["plain", "card"], "plain"),
    guidelines: text("guidelines", LIMITS.guidelines),
    ping_role_ids: ids(form.getAll("ping_role_ids"), LIMITS.roles),
    slowmode_seconds: whole(form.get("slowmode_seconds"), 0, 21600, 0),
    staff_role_ids: ids(form.getAll("staff_role_ids"), LIMITS.roles),
    required_role_ids: ids(form.getAll("required_role_ids"), LIMITS.roles),
    blocked_role_ids: ids(form.getAll("blocked_role_ids"), LIMITS.roles),
    blocked_user_ids: ids(String(form.get("blocked_user_ids") ?? "").split(/[\s,]+/), LIMITS.users),
    max_open_per_user: whole(form.get("max_open_per_user"), 0, 50, 3),
    cooldown_seconds: whole(form.get("cooldown_seconds"), 0, 86400, 30),
    author_can_close: checked("author_can_close"),
    author_can_solve: checked("author_can_solve"),
    author_can_rename: checked("author_can_rename"),
    inactive_days: whole(form.get("inactive_days"), 0, 365, 0),
    inactive_action: oneOf(form.get("inactive_action"), ["lock", "close"], "close"),
    solved_action: oneOf(form.get("solved_action"), ["none", "lock", "close"], "none"),
    solved_delay_hours: whole(form.get("solved_delay_hours"), 0, 720, 24),
    adopt: checked("adopt"),
    tag_wait_minutes: whole(form.get("tag_wait_minutes"), 1, 1440, 10),
    log_events: form.getAll("log_events").map(String).filter((name) => LOG_EVENTS.includes(name))
  };
}
const NEW_SETUP = {
  name: "",
  forum_channel_id: "",
  enabled: true,
  panel_channel_id: "",
  panel_template: null,
  panel_title: null,
  panel_description: null,
  panel_color: null,
  panel_image: null,
  panel_footer: null,
  button_label: null,
  button_emoji: null,
  button_style: "success",
  modal_title: null,
  title_label: null,
  description_label: null,
  ask_images: false,
  extra_fields: [],
  require_tag: false,
  tag_ids: [],
  max_tags: 1,
  solved_tag_id: null,
  first_message: null,
  first_message_style: "plain",
  guidelines: null,
  ping_role_ids: [],
  slowmode_seconds: 0,
  staff_role_ids: [],
  required_role_ids: [],
  blocked_role_ids: [],
  blocked_user_ids: [],
  max_open_per_user: 3,
  cooldown_seconds: 30,
  author_can_close: true,
  author_can_solve: true,
  author_can_rename: true,
  inactive_days: 0,
  inactive_action: "close",
  solved_action: "none",
  solved_delay_hours: 24,
  adopt: false,
  tag_wait_minutes: 10,
  log_events: [...LOG_EVENTS]
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashForums = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashForums;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, section, ready, setups, forums, botDown, forumsError, posts, roles, channels, templates, editing, statusFilter, setupFilter, maxSetups, message } = Astro2.props;
  const base = `/dash/guild/${guildId}/forums`;
  const isNew = editing === "new";
  const s = isNew ? { ...NEW_SETUP } : editing;
  const titles = { setups: dt("Forums"), posts: dt("Forum posts") };
  const when = (iso) => new Date(iso).toLocaleString(dashLang, { dateStyle: "medium", timeStyle: "short" });
  const forumById = (fid) => forums.find((f) => f.id === fid);
  const forumName = (fid) => forumById(fid)?.name ?? fid;
  const statusNames = { open: dt("Open"), solved: dt("Solved"), locked: dt("Locked"), closed: dt("Closed"), all: dt("All") };
  const styleNames = { primary: dt("Blurple"), secondary: dt("Grey"), success: dt("Green"), danger: dt("Red") };
  const questions = Array.isArray(s?.extra_fields) ? s.extra_fields : [];
  const permissionNames = {
    ViewChannel: dt("View Channel"),
    SendMessages: dt("Send Messages"),
    SendMessagesInThreads: dt("Send Messages in Threads"),
    ManageThreads: dt("Manage Threads"),
    CreatePublicThreads: dt("Create Public Threads"),
    AttachFiles: dt("Attach Files"),
    ManageChannels: dt("Manage Channels")
  };
  const permissionName = (flag) => permissionNames[flag] ?? String(flag).replace(/([a-z])([A-Z])/g, "$1 $2");
  const permissionNote = (f) => f && !f.can_post ? dt("Petto cannot post here: it needs {a}", { a: (f.missing ?? []).map(permissionName).join(", ") }) : "";
  const atLimit = setups.length >= maxSetups;
  const logNames = { opened: dt("Posts opened"), locked: dt("Posts locked"), closed: dt("Posts closed"), solved: dt("Posts solved") };
  const defaultTexts = {
    title: dt("Open A Post"),
    text: dt('Once you have read the guidelines, click "Open post" to create a post in the forum.\n\nYou will be prompted to fill in the post name and description, describe your issue or question as clearly as possible. Then, select the type of inquiry that best represents your issue or question. Image attaching is not supported when filling out the modal, you may do so when the post is open instead.'),
    button: dt("Open post"),
    first: dt("Post opened by {user} - {title}\n\n{description}")
  };
  const pageHref = (over) => {
    const params = new URLSearchParams({ section: "posts", status: statusFilter, ...setupFilter ? { s: setupFilter } : {}, ...over });
    for (const [key, value] of [...params]) if (!value) params.delete(key);
    return `${base}?${params}`;
  };
  const checked = (value) => value !== false && Boolean(value);
  const sampleVars = { "{user}": "@member", "{username}": "member", "{title}": "Cannot log in", "{description}": "It fails with error 42.", "{tag}": "Bug", "{server}": guildName, "{forum}": "#support" };
  const fillSample = (text) => String(text).replace(/\{[a-z]+\}/g, (m) => sampleVars[m] || m);
  const firstTemplate = (s?.first_message ?? "").trim() || defaultTexts.first;
  const firstPreview = fillSample(s?.first_message_style === "card" ? firstTemplate.split("\n")[0] : firstTemplate);
  const selectedNote = s ? permissionNote(forumById(s.forum_channel_id)) : "";
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": section === "posts" ? "forums-posts" : "forums", "pageTitle": titles[section] }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="fo-page"> <h1>', "</h1> ", " ", " ", " ", " ", " ", " ", ` </div> <script>
    // The preview of the panel and of the first message, drawn from the fields. It binds once (the dashboard swaps pages without reloading).
    (function () {
      var root = document.querySelector('[data-forums-editor]');
      if (!root || root.dataset.bound) return;
      root.dataset.bound = '1';
      var pv = document.querySelector('[data-pv-card]');
      var q = function (sel) { return root.querySelector(sel); };
      var vars = { '{user}': '@member', '{username}': 'member', '{title}': 'Cannot log in', '{description}': 'It fails with error 42.', '{tag}': 'Bug', '{server}': (document.title.split('\xB7')[1] || 'Server').trim(), '{forum}': '#support' };
      var fill = function (text) { return String(text).replace(/\\{[a-z]+\\}/g, function (m) { return vars[m] || m; }); };
      var emojiBox = document.querySelector('[data-pv-btn-emoji]');
      function text(sel, fallback) { var el = q(sel); return el && el.value.trim() ? el.value.trim() : fallback; }
      function draw() {
        var d = document.querySelector('[data-pv-heading]'); if (!d) return;
        d.textContent = text('[data-pv-title]', d.dataset.def || d.textContent);
        document.querySelector('[data-pv-body]').textContent = text('[data-pv-text]', document.querySelector('[data-pv-text]').placeholder);
        var img = document.querySelector('[data-pv-img]'); var url = text('[data-pv-image]', '');
        if (/^https:\\/\\//i.test(url)) { img.src = url; img.hidden = false; } else { img.hidden = true; img.removeAttribute('src'); }
        var foot = document.querySelector('[data-pv-foot]'); var f = text('[data-pv-footer]', ''); foot.textContent = f; foot.hidden = !f;
        document.querySelector('[data-pv-btn-label]').textContent = text('[data-pv-button]', document.querySelector('[data-pv-button]').placeholder);
        emojiBox.textContent = text('[data-pv-emoji]', '\u2795');
        document.querySelector('[data-pv-btn]').dataset.style = q('[data-pv-style]').value;
        var color = q('input[name="panel_color"]'); pv.style.borderLeftColor = color && /^#[0-9a-f]{6}$/i.test(color.value) ? color.value : '';
        var first = document.querySelector('[data-pv-first-msg]');
        var cardStyle = q('[data-pv-style-first]').value === 'card';
        var template = text('[data-pv-first]', q('[data-pv-first]').placeholder);
        first.textContent = fill(cardStyle ? template.split('\\n')[0] : template);
      }
      var title = document.querySelector('[data-pv-heading]'); if (title) title.dataset.def = title.textContent;
      root.addEventListener('input', draw); root.addEventListener('change', draw); draw();
      var select = q('[data-forum-select]'); var note = q('[data-forum-note]');
      function forumNote() { var o = select.options[select.selectedIndex]; var n = o && o.dataset.note; note.textContent = n || ''; note.hidden = !n; }
      if (select) { select.addEventListener('change', forumNote); forumNote(); }
      // The buttons with data-confirm ask their question by themselves (DashConfirm.astro).
    })();
  <\/script> `], [" ", '<div class="fo-page"> <h1>', "</h1> ", " ", " ", " ", " ", " ", " ", ` </div> <script>
    // The preview of the panel and of the first message, drawn from the fields. It binds once (the dashboard swaps pages without reloading).
    (function () {
      var root = document.querySelector('[data-forums-editor]');
      if (!root || root.dataset.bound) return;
      root.dataset.bound = '1';
      var pv = document.querySelector('[data-pv-card]');
      var q = function (sel) { return root.querySelector(sel); };
      var vars = { '{user}': '@member', '{username}': 'member', '{title}': 'Cannot log in', '{description}': 'It fails with error 42.', '{tag}': 'Bug', '{server}': (document.title.split('\xB7')[1] || 'Server').trim(), '{forum}': '#support' };
      var fill = function (text) { return String(text).replace(/\\\\{[a-z]+\\\\}/g, function (m) { return vars[m] || m; }); };
      var emojiBox = document.querySelector('[data-pv-btn-emoji]');
      function text(sel, fallback) { var el = q(sel); return el && el.value.trim() ? el.value.trim() : fallback; }
      function draw() {
        var d = document.querySelector('[data-pv-heading]'); if (!d) return;
        d.textContent = text('[data-pv-title]', d.dataset.def || d.textContent);
        document.querySelector('[data-pv-body]').textContent = text('[data-pv-text]', document.querySelector('[data-pv-text]').placeholder);
        var img = document.querySelector('[data-pv-img]'); var url = text('[data-pv-image]', '');
        if (/^https:\\\\/\\\\//i.test(url)) { img.src = url; img.hidden = false; } else { img.hidden = true; img.removeAttribute('src'); }
        var foot = document.querySelector('[data-pv-foot]'); var f = text('[data-pv-footer]', ''); foot.textContent = f; foot.hidden = !f;
        document.querySelector('[data-pv-btn-label]').textContent = text('[data-pv-button]', document.querySelector('[data-pv-button]').placeholder);
        emojiBox.textContent = text('[data-pv-emoji]', '\u2795');
        document.querySelector('[data-pv-btn]').dataset.style = q('[data-pv-style]').value;
        var color = q('input[name="panel_color"]'); pv.style.borderLeftColor = color && /^#[0-9a-f]{6}$/i.test(color.value) ? color.value : '';
        var first = document.querySelector('[data-pv-first-msg]');
        var cardStyle = q('[data-pv-style-first]').value === 'card';
        var template = text('[data-pv-first]', q('[data-pv-first]').placeholder);
        first.textContent = fill(cardStyle ? template.split('\\\\n')[0] : template);
      }
      var title = document.querySelector('[data-pv-heading]'); if (title) title.dataset.def = title.textContent;
      root.addEventListener('input', draw); root.addEventListener('change', draw); draw();
      var select = q('[data-forum-select]'); var note = q('[data-forum-note]');
      function forumNote() { var o = select.options[select.selectedIndex]; var n = o && o.dataset.note; note.textContent = n || ''; note.hidden = !n; }
      if (select) { select.addEventListener('change', forumNote); forumNote(); }
      // The buttons with data-confirm ask their question by themselves (DashConfirm.astro).
    })();
  <\/script> `])), maybeRenderHead(), titles[section], message && renderTemplate`<div${addAttribute(["fo-flash", message.kind], "class:list")}${addAttribute(message.kind === "err" ? "alert" : "status", "role")}>${renderComponent($$result2, "Icon", $$Icon, { "name": message.kind === "ok" ? "ph:check-circle-fill" : "ph:warning-fill", "width": "15", "height": "15" })}${message.text}</div>`, !ready && renderTemplate`<div class="fo-card fo-empty">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "28", "height": "28" })}<p>${dt("This arrives with the next Petto update.")}</p></div>`, ready && botDown && renderTemplate`<div class="fo-flash warn">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15" })}${dt("Petto is not answering right now, so the forum list and the posts may be missing. Try again in a moment.")}</div>`, ready && !botDown && forumsError && renderTemplate`<div class="fo-flash warn">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15" })}${forumsError}</div>`, ready && section === "setups" && !s && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <div class="fo-row"> <span class="fo-hint">${dt("{a} of {b} forum setups", { a: setups.length, b: maxSetups })}</span> ${atLimit ? renderTemplate`<span class="btn btn-ghost btn-sm" aria-disabled="true">${dt("Limit reached")}</span>` : renderTemplate`<a class="btn btn-accent btn-sm"${addAttribute(`${base}?setup=new`, "href")}>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12" })}${dt("New forum setup")}</a>`} </div> ${setups.length === 0 && renderTemplate`<div class="fo-card fo-empty"> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:chats-circle-fill", "width": "28", "height": "28" })} <p>${dt("No forum is set up yet. Pick a forum channel and members will open posts with a button.")}</p> <p class="fo-hint">${dt("In Discord: !forum setup #forum")}</p> </div>`}<div class="fo-grid-cards dgl-stagger"> ${setups.map((x) => {
    const f = forumById(x.forum_channel_id);
    return renderTemplate`<div class="fo-card dgl-card"> <div class="fo-row"><h3><i class="fo-dot"></i>${x.name}</h3><span${addAttribute(["fo-chip", x.enabled ? "open" : "closed"], "class:list")}>${x.enabled ? dt("On") : dt("Off")}</span></div> <p class="fo-hint">#${forumName(x.forum_channel_id)}${f && !f.can_post && renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate` · <span class="fo-warn">${permissionNote(f)}</span>` })}`}${forums.length > 0 && !f && renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate` · <span class="fo-warn">${dt("This forum was deleted or is not a forum any more.")}</span>` })}`}</p> <p class="fo-hint">${dt("Panel")}: ${x.panel_message_id ? renderTemplate`<a${addAttribute(`https://discord.com/channels/${guildId}/${x.panel_channel_id}/${x.panel_message_id}`, "href")} target="_blank" rel="noopener">${dt("Open the panel")}</a>` : dt("not posted yet")} · <a${addAttribute(`${base}?section=posts&s=${x.id}`, "href")}>${dt("Posts")}</a></p> <div class="fo-actions"> <a class="btn btn-ghost btn-sm"${addAttribute(`${base}?setup=${x.id}`, "href")}>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:pencil-simple-bold", "width": "12", "height": "12" })}${dt("Edit")}</a> <form method="POST" data-no-dirty><input type="hidden" name="action" value="toggle_setup"><input type="hidden" name="setup_id"${addAttribute(x.id, "value")}><button type="submit" class="btn btn-ghost btn-sm">${x.enabled ? dt("Turn off") : dt("Turn on")}</button></form> </div> </div>`;
  })} </div> ${setups.length > 0 && renderTemplate`<p class="fo-card fo-cmds">${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "18", "height": "18" })}<span>${dt("In Discord: !forum setup #forum")}</span></p>`}` })}`, ready && section === "setups" && s && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "vars": [{ tok: "{user}", desc: dt("Mention of the member") }, { tok: "{username}", desc: dt("Name of the member") }, { tok: "{title}", desc: dt("Title of the post") }, { tok: "{description}", desc: dt("What the member wrote") }, { tok: "{tag}", desc: dt("The tags picked") }, { tok: "{server}", desc: dt("Name of the server") }, { tok: "{forum}", desc: dt("Mention of the forum") }] })} <a class="fo-back"${addAttribute(base, "href")}>← ${dt("All forum setups")}</a> <div class="fo-editor-wrap"> <form method="POST" class="fo-editor" data-forums-editor> ${!isNew && renderTemplate`<input type="hidden" name="setup_id"${addAttribute(s.id, "value")}>`} <div class="fo-card"> <h2>${dt("Forum")}</h2> <div class="fo-grid"> <label class="fo-field"><span>${dt("Forum channel")}</span> <select name="forum_channel_id" required data-forum-select> <option value="">${dt("Pick a forum")}</option> ${forums.map((f) => renderTemplate`<option${addAttribute(f.id, "value")}${addAttribute(f.id === s.forum_channel_id, "selected")}${addAttribute(JSON.stringify(f.tags), "data-tags")}${addAttribute(permissionNote(f), "data-note")}>#${f.name}${permissionNote(f) ? ` \xB7 ${permissionNote(f)}` : ""}</option>`)} ${s.forum_channel_id && !forumById(s.forum_channel_id) && renderTemplate`<option${addAttribute(s.forum_channel_id, "value")} selected>${s.forum_channel_id}</option>`} </select> <em class="fo-warn" data-forum-note${addAttribute(!selectedNote, "hidden")}>${selectedNote}</em> ${forums.length === 0 && renderTemplate`<em>${dt("Petto sees no forum channel. Make one in Discord first.")}</em>`} </label> <label class="fo-field"><span>${dt("Short name")}</span><input type="text" name="name"${addAttribute(s.name, "value")} maxlength="32"${addAttribute("[A-Za-z0-9][A-Za-z0-9_\\-]{0,31}", "pattern")} autocomplete="off" spellcheck="false"><em>${dt("For commands, like !forum status --setup support. Empty uses the name of the forum.")}</em></label> <label class="fo-check fo-wide"><input type="checkbox" name="enabled"${addAttribute(checked(s.enabled), "checked")}>${dt("Members can open posts with the panel")}</label> </div> </div> <div class="fo-card"> <h2>${dt("Panel")}</h2> <p class="fo-hint">${dt("The message with the button that opens the form. Posting it again edits the message that is there.")}</p> <div class="fo-grid"> <label class="fo-field"><span>${dt("Channel of the panel")}</span><select name="panel_channel_id"><option value="">${dt("Pick a channel")}</option>${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === s.panel_channel_id, "selected")}>#${c.name}</option>`)}</select></label> <label class="fo-field"><span>${dt("Saved design")}</span><select name="panel_template" data-pv-design><option value="">${dt("None: use the card below")}</option>${templates.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === s.panel_template, "selected")}>${n}</option>`)}</select><em>${dt("A saved design replaces the card; the button goes under it.")}</em></label> <label class="fo-field"><span>${dt("Title")}</span><input type="text" autocomplete="off" name="panel_title"${addAttribute(s.panel_title ?? "", "value")}${addAttribute(LIMITS.panelTitle, "maxlength")}${addAttribute(defaultTexts.title, "placeholder")} data-pv-title></label> <div class="fo-field"><span>${dt("Color")}</span>${renderComponent($$result3, "ColorPicker", $$ColorPicker, { "name": "panel_color", "value": intToHex(s.panel_color), "label": dt("Color"), "allowNone": true })}</div> <label class="fo-field fo-wide"><span>${dt("Text")}</span><textarea name="panel_description" rows="4"${addAttribute(LIMITS.panelText, "maxlength")} data-ac data-pv-text${addAttribute(defaultTexts.text, "placeholder")}>${s.panel_description ?? ""}</textarea><em>${dt("Empty uses the usual text, which also says that pictures can only be added once the post is open (unless the form asks for them).")}</em></label> <label class="fo-field"><span>${dt("Picture (https link)")}</span><input type="text" inputmode="url" name="panel_image"${addAttribute(s.panel_image ?? "", "value")} maxlength="500" placeholder="https://…/banner.png" autocomplete="off" spellcheck="false" data-pv-image></label> <label class="fo-field"><span>${dt("Small text under the card")}</span><input type="text" autocomplete="off" name="panel_footer"${addAttribute(s.panel_footer ?? "", "value")}${addAttribute(LIMITS.panelFooter, "maxlength")} data-pv-footer></label> <label class="fo-field"><span>${dt("Button text")}</span><input type="text" autocomplete="off" name="button_label"${addAttribute(s.button_label ?? "", "value")}${addAttribute(LIMITS.button, "maxlength")}${addAttribute(defaultTexts.button, "placeholder")} data-pv-button></label> <label class="fo-field"><span>${dt("Button emoji")}</span><input type="text" name="button_emoji"${addAttribute(s.button_emoji ?? "", "value")} maxlength="100" placeholder="➕" autocomplete="off" data-pv-emoji></label> <label class="fo-field"><span>${dt("Button color")}</span><select name="button_style" data-pv-style>${["success", "primary", "secondary", "danger"].map((b) => renderTemplate`<option${addAttribute(b, "value")}${addAttribute(b === (s.button_style ?? "success"), "selected")}>${styleNames[b]}</option>`)}</select></label> </div> </div> <div class="fo-card"> <h2>${dt("Form")}</h2> <p class="fo-hint">${dt("Members fill in a title and a description, then pick the tag. You can add up to 3 more questions (2 if pictures are asked for).")}</p> <div class="fo-grid"> <label class="fo-field"><span>${dt("Title of the window")}</span><input type="text" autocomplete="off" name="modal_title"${addAttribute(s.modal_title ?? "", "value")}${addAttribute(LIMITS.label, "maxlength")}${addAttribute(dt("Open a post"), "placeholder")}></label> <label class="fo-field"><span>${dt("Label of the title")}</span><input type="text" autocomplete="off" name="title_label"${addAttribute(s.title_label ?? "", "value")}${addAttribute(LIMITS.label, "maxlength")}${addAttribute(dt("Title"), "placeholder")}></label> <label class="fo-field"><span>${dt("Label of the description")}</span><input type="text" autocomplete="off" name="description_label"${addAttribute(s.description_label ?? "", "value")}${addAttribute(LIMITS.label, "maxlength")}${addAttribute(dt("Description"), "placeholder")}></label> <label class="fo-check"><input type="checkbox" name="ask_images"${addAttribute(Boolean(s.ask_images), "checked")}>${dt("Let members add pictures in the form")}</label> </div> ${[1, 2, 3].map((n) => {
    const q = questions[n - 1] ?? {};
    return renderTemplate`<div class="fo-question"> <b>${dt("Question {a}", { a: n })}</b> <div class="fo-grid"> <label class="fo-field"><span>${dt("Question (45 characters)")}</span><input type="text" autocomplete="off"${addAttribute(`q_label_${n}`, "name")}${addAttribute(q.label ?? "", "value")}${addAttribute(LIMITS.label, "maxlength")}></label> <label class="fo-field"><span>${dt("Kind")}</span><select${addAttribute(`q_type_${n}`, "name")}><option value="short_text"${addAttribute((q.type ?? "short_text") === "short_text", "selected")}>${dt("Short text")}</option><option value="long_text"${addAttribute(q.type === "long_text", "selected")}>${dt("Paragraph")}</option><option value="select"${addAttribute(q.type === "select", "selected")}>${dt("Menu of choices")}</option></select></label> <label class="fo-field fo-wide"><span>${dt("Choices, one per line (menu only)")}</span><textarea${addAttribute(`q_options_${n}`, "name")} rows="2">${(q.options ?? []).join("\n")}</textarea></label> <label class="fo-check"><input type="checkbox"${addAttribute(`q_required_${n}`, "name")}${addAttribute(q.required !== false, "checked")}>${dt("Required")}</label> </div> </div>`;
  })} </div> <div class="fo-card"> <h2>${dt("Tags")}</h2> <div class="fo-grid"> <label class="fo-check fo-wide"><input type="checkbox" name="require_tag"${addAttribute(Boolean(s.require_tag), "checked")}>${dt("A tag is required (the step is skipped when the forum has no tags)")}</label> <label class="fo-field"><span>${dt("Tags a post can have")}</span><input type="number" name="max_tags" min="1" max="5"${addAttribute(s.max_tags ?? 1, "value")}></label> <label class="fo-field"><span>${dt("Tag that means solved")}</span> <select name="solved_tag_id" data-solved-select><option value="">${dt("The one called Solved (made if missing)")}</option>${(forumById(s.forum_channel_id)?.tags ?? []).map((tag) => renderTemplate`<option${addAttribute(tag.id, "value")}${addAttribute(tag.id === s.solved_tag_id, "selected")}>${tag.name}</option>`)}</select> </label> <div class="fo-field fo-wide"><span>${dt("Tags members can pick")}</span> <div class="fo-tags" data-tag-list${addAttribute(JSON.stringify(s.tag_ids ?? []), "data-selected")}> ${(forumById(s.forum_channel_id)?.tags ?? []).map((tag) => renderTemplate`<label class="fo-check"><input type="checkbox" name="tag_ids"${addAttribute(tag.id, "value")}${addAttribute((s.tag_ids ?? []).includes(tag.id), "checked")}>${tag.name}${tag.moderated ? ` \xB7 ${dt("staff only")}` : ""}</label>`)} </div> <em>${dt("None checked: members can pick any tag of the forum (never the staff-only ones or the solved one). Pick the forum and save to see its tags.")}</em> </div> </div> </div> <div class="fo-card"> <h2>${dt("The post")}</h2> <p class="fo-hint">${dt("Variables:")} ${["{user}", "{username}", "{title}", "{description}", "{tag}", "{server}", "{forum}"].map((v) => renderTemplate`<code class="fo-var">${v}</code>`)}</p> <div class="fo-grid"> <label class="fo-field"><span>${dt("First message")}</span><select name="first_message_style" data-pv-style-first><option value="plain"${addAttribute(s.first_message_style !== "card", "selected")}>${dt("Plain text with the description")}</option><option value="card"${addAttribute(s.first_message_style === "card", "selected")}>${dt("A line, and the description in a card")}</option></select></label> <label class="fo-field"><span>${dt("Slowmode of the post (seconds)")}</span><input type="number" name="slowmode_seconds" min="0" max="21600"${addAttribute(s.slowmode_seconds ?? 0, "value")}></label> <label class="fo-field fo-wide"><span>${dt("Text of the first message")}</span><textarea name="first_message" rows="3"${addAttribute(LIMITS.firstMessage, "maxlength")} data-ac data-pv-first${addAttribute(defaultTexts.first, "placeholder")}>${s.first_message ?? ""}</textarea></label> <label class="fo-field fo-wide"><span>${dt("Guidelines")}</span><textarea name="guidelines" rows="3"${addAttribute(LIMITS.guidelines, "maxlength")} data-ac data-pv-guidelines>${s.guidelines ?? ""}</textarea><em>${dt("Shown in a card under the first message, with the roles to ping.")}</em></label> <div class="fo-field fo-wide"><span>${dt("Roles to ping")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "ping_role_ids", "options": roles, "selected": s.ping_role_ids ?? [], "placeholder": dt("No roles") })}</div> </div> </div> <div class="fo-card"> <h2>${dt("Who can do what")}</h2> <div class="fo-grid"> <div class="fo-field fo-wide"><span>${dt("Staff roles")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "staff_role_ids", "options": roles, "selected": s.staff_role_ids ?? [], "placeholder": dt("Only members who manage threads") })}<em>${dt("They can lock, close, solve, tag and claim any post of this forum. Members with Manage Threads always can.")}</em></div> <div class="fo-field fo-wide"><span>${dt("Needs one of these roles to open a post")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "required_role_ids", "options": roles, "selected": s.required_role_ids ?? [], "placeholder": dt("Anyone") })}</div> <div class="fo-field fo-wide"><span>${dt("Blocked roles")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "blocked_role_ids", "options": roles, "selected": s.blocked_role_ids ?? [], "placeholder": dt("No roles") })}</div> <label class="fo-field fo-wide"><span>${dt("Blocked members (IDs, one per line or separated by spaces)")}</span><textarea name="blocked_user_ids" rows="2">${(s.blocked_user_ids ?? []).join("\n")}</textarea></label> <label class="fo-field"><span>${dt("Open posts per member")}</span><input type="number" name="max_open_per_user" min="0" max="50"${addAttribute(s.max_open_per_user ?? 3, "value")}><em>${dt("0 is no limit.")}</em></label> <label class="fo-field"><span>${dt("Wait between two posts (seconds)")}</span><input type="number" name="cooldown_seconds" min="0" max="86400"${addAttribute(s.cooldown_seconds ?? 30, "value")}></label> <label class="fo-check"><input type="checkbox" name="author_can_close"${addAttribute(checked(s.author_can_close), "checked")}>${dt("The author can close their post")}</label> <label class="fo-check"><input type="checkbox" name="author_can_solve"${addAttribute(checked(s.author_can_solve), "checked")}>${dt("The author can mark it solved")}</label> <label class="fo-check"><input type="checkbox" name="author_can_rename"${addAttribute(checked(s.author_can_rename), "checked")}>${dt("The author can change the title")}</label> </div> </div> <div class="fo-card"> <h2>${dt("Automation")}</h2> <p class="fo-hint">${dt("One check every minute that only looks at the posts that are due.")}</p> <div class="fo-grid"> <label class="fo-field"><span>${dt("Quiet posts: after how many days (0 is off)")}</span><input type="number" name="inactive_days" min="0" max="365"${addAttribute(s.inactive_days ?? 0, "value")}></label> <label class="fo-field"><span>${dt("Then")}</span><select name="inactive_action"><option value="close"${addAttribute(s.inactive_action !== "lock", "selected")}>${dt("Close the post")}</option><option value="lock"${addAttribute(s.inactive_action === "lock", "selected")}>${dt("Lock the post")}</option></select></label> <label class="fo-field"><span>${dt("Solved posts")}</span><select name="solved_action"><option value="none"${addAttribute((s.solved_action ?? "none") === "none", "selected")}>${dt("Do nothing")}</option><option value="lock"${addAttribute(s.solved_action === "lock", "selected")}>${dt("Lock the post")}</option><option value="close"${addAttribute(s.solved_action === "close", "selected")}>${dt("Close the post")}</option></select></label> <label class="fo-field"><span>${dt("Hours after it was solved")}</span><input type="number" name="solved_delay_hours" min="0" max="720"${addAttribute(s.solved_delay_hours ?? 24, "value")}></label> <label class="fo-check fo-wide"><input type="checkbox" name="adopt"${addAttribute(Boolean(s.adopt), "checked")}>${dt("Also keep the posts made by hand in the forum (they get the guidelines, the tools and the tag rule)")}</label> <label class="fo-field"><span>${dt("Minutes to choose a tag (posts made by hand)")}</span><input type="number" name="tag_wait_minutes" min="1" max="1440"${addAttribute(s.tag_wait_minutes ?? 10, "value")}></label> </div> </div> <div class="fo-card"> <h2>${dt("Log")}</h2> <p class="fo-hint">${dt("The log category Forums (Logging page) chooses the channel. Here you choose what is told.")}</p> <div class="fo-grid"> ${["opened", "locked", "closed", "solved"].map((e) => renderTemplate`<label class="fo-check"><input type="checkbox" name="log_events"${addAttribute(e, "value")}${addAttribute((s.log_events ?? []).includes(e), "checked")}>${logNames[e]}</label>`)} </div> </div> <div class="fo-bar"> <button type="submit" name="action" value="save_setup" class="btn btn-accent">${dt("Save")}</button> <button type="submit" name="action" value="save_and_post" class="btn btn-ghost"${addAttribute(dt("Saves and posts the panel, or edits it if it is already there"), "title")}>${isNew || !s.panel_message_id ? dt("Save and post the panel") : dt("Save and update the panel")}</button> ${!isNew && renderTemplate`<button type="submit" name="action" value="delete_setup" class="btn btn-ghost fo-danger" formnovalidate${addAttribute(dt("Remove this setup? The posts stay in the forum."), "data-confirm")}>${dt("Delete")}</button>`} </div> </form> <aside class="fo-preview-col"> <div class="fo-card"> <h2>${dt("Preview")}</h2> <div class="fo-discord"> <div class="fo-embed" data-pv-card> <img data-pv-img alt="" hidden referrerpolicy="no-referrer"> <b data-pv-heading>${s.panel_title || defaultTexts.title}</b> <span data-pv-body>${s.panel_description || defaultTexts.text}</span> <small data-pv-foot hidden></small> </div> <span class="fo-btn" data-pv-btn${addAttribute(s.button_style ?? "success", "data-style")}><i data-pv-btn-emoji>${s.button_emoji || "\u2795"}</i><span data-pv-btn-label>${s.button_label || defaultTexts.button}</span></span> </div> <p class="fo-hint">${dt("A saved design is drawn by Discord; this is the card.")}</p> </div> <div class="fo-card"> <h2>${dt("First message of a post")}</h2> <div class="fo-discord"><div class="fo-msg" data-pv-first-msg>${firstPreview}</div></div> </div> </aside> </div> ` })}`, ready && section === "posts" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` <div class="fo-row"> <div class="fo-tabs">${["open", "solved", "locked", "closed", "all"].map((st) => renderTemplate`<a${addAttribute(["fo-tab", { on: statusFilter === st }], "class:list")}${addAttribute(pageHref({ status: st, p: "" }), "href")}>${statusNames[st]}</a>`)}</div> ${setups.length > 1 && renderTemplate`<div class="fo-tabs"><a${addAttribute(["fo-tab", { on: !setupFilter }], "class:list")}${addAttribute(pageHref({ s: "", p: "" }), "href")}>${dt("All forums")}</a>${setups.map((x) => renderTemplate`<a${addAttribute(["fo-tab", { on: setupFilter === String(x.id) }], "class:list")}${addAttribute(pageHref({ s: String(x.id), p: "" }), "href")}>${x.name}</a>`)}</div>`} </div> ${(posts && posts.rows.length === 0 || !posts && botDown) && renderTemplate`<div class="fo-card fo-empty">${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:chats-circle-fill", "width": "28", "height": "28" })}<p>${dt("There are no posts to show.")}</p></div>`}${posts && posts.rows.length > 0 && renderTemplate`<div class="fo-card fo-table-card"> <p class="fo-hint">${dt("{a} posts", { a: posts.total })} · ${dt("{a} open", { a: posts.open })}</p> <div class="fo-table"> ${posts.rows.map((p) => renderTemplate`<div class="fo-post"> <div class="fo-post-main"> <a${addAttribute(p.url, "href")} target="_blank" rel="noopener" class="fo-post-title">${p.title}</a> <span class="fo-hint">${p.author.name} · ${when(p.opened_at)}${p.claimed_by ? ` \xB7 ${dt("handled by {a}", { a: p.claimed_name || dt("a staff member") })}` : ""}${p.source !== "panel" ? ` \xB7 ${p.source === "moved" ? dt("moved") : dt("made by hand")}` : ""}</span> </div> <span${addAttribute(["fo-chip", p.status], "class:list")}>${statusNames[p.status] ?? p.status}</span> <div class="fo-actions"> ${[
    ...p.status === "locked" ? [["unlock", dt("Unlock")]] : p.status === "closed" ? [] : [["lock", dt("Lock")]],
    ...p.status === "closed" || p.status === "locked" ? [["reopen", dt("Reopen")]] : [["close", dt("Close")]],
    ...p.solved_at ? [["unsolved", dt("Not solved")]] : [["solved", dt("Solved")]]
  ].map(([act, label]) => renderTemplate`<form method="POST" data-no-dirty><input type="hidden" name="action" value="post_action"><input type="hidden" name="thread_id"${addAttribute(p.thread_id, "value")}><input type="hidden" name="post_action"${addAttribute(act, "value")}><button type="submit" class="btn btn-ghost btn-sm">${label}</button></form>`)} </div> </div>`)} </div> <div class="fo-row fo-pager"> ${posts.page > 0 ? renderTemplate`<a class="btn btn-ghost btn-sm"${addAttribute(pageHref({ p: String(posts.page - 1) }), "href")}>← ${dt("Newer")}</a>` : renderTemplate`<span></span>`} ${(posts.page + 1) * posts.limit < posts.total && renderTemplate`<a class="btn btn-ghost btn-sm"${addAttribute(pageHref({ p: String(posts.page + 1) }), "href")}>${dt("Older")} →</a>`} </div> </div>`}${!posts && !botDown && renderTemplate`<div class="fo-card fo-empty"><p>${dt("The posts could not be read. Try again in a moment.")}</p></div>`}` })}`) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashForums.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Forums = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Forums;
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
  const rest = (path, init = {}) => fetch(`${apiUrl}/rest/v1/${path}`, { ...init, headers: { ...apiHeaders, ...init.headers } });
  const section = Astro2.url.searchParams.get("section") === "posts" ? "posts" : "setups";
  const setupParam = Astro2.url.searchParams.get("setup");
  const statusParam = String(Astro2.url.searchParams.get("status") ?? "open");
  const statusFilter = [...STATUSES, "all"].includes(statusParam) ? statusParam : "open";
  const setupFilter = /^\d{1,15}$/.test(String(Astro2.url.searchParams.get("s") ?? "")) ? String(Astro2.url.searchParams.get("s")) : "";
  const pageNumber = Math.max(0, Math.trunc(Number(Astro2.url.searchParams.get("p"))) || 0);
  const ready = await forumsReady(Astro2, 3e3);
  let message = null;
  let redirectTo = null;
  if (ready && Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    await ensureGuildRow(apiUrl, apiHeaders, id);
    const failed = () => {
      message = { kind: "err", text: dt("It could not be saved, try again.") };
    };
    const setupId = /^\d{1,15}$/.test(String(form.get("setup_id") ?? "")) ? String(form.get("setup_id")) : "";
    const asBot = (result) => result.ok ? { kind: "ok", text: result.message || dt("Done.") } : { kind: "err", text: result.message || dt("The bot could not do it. Try again in a moment.") };
    if (action === "save_setup" || action === "save_and_post") {
      const channelsAnswer = await callPettoForums(Astro2, id, session.userId, "channels", {}, dashLang);
      const known = channelsAnswer.ok ? channelsAnswer.data?.forums ?? [] : [];
      const forumName = known.find((f) => f.id === String(form.get("forum_channel_id")))?.name ?? "";
      const row = setupFromForm(form, forumName);
      if (!row.forum_channel_id) message = { kind: "err", text: dt("Pick the forum channel.") };
      else if (channelsAnswer.ok && !known.some((f) => f.id === row.forum_channel_id)) message = { kind: "err", text: dt("That channel is not a forum.") };
      else {
        let saved = null;
        let conflict = false;
        if (setupId) {
          const res = await rest(`forum_setups?guild_id=eq.${id}&id=eq.${setupId}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ ...row, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
          conflict = res.status === 409;
          saved = res.ok ? (await res.json())[0] : null;
        } else {
          const countRes = await rest(`forum_setups?guild_id=eq.${id}&select=id`);
          const count = countRes.ok ? (await countRes.json()).length : 0;
          if (count >= MAX_SETUPS) message = { kind: "err", text: dt("You reached the limit of forum setups ({a}).", { a: MAX_SETUPS }) };
          else {
            const res = await rest("forum_setups", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ guild_id: id, ...row }) });
            conflict = res.status === 409;
            saved = res.ok ? (await res.json())[0] : null;
          }
        }
        if (conflict) message = { kind: "err", text: dt("Another setup already uses that forum or that name.") };
        else if (saved) {
          if (action === "save_and_post") {
            const panel = await callPettoForums(Astro2, id, session.userId, "panel", { setup_id: saved.id, channel_id: row.panel_channel_id ?? "" }, dashLang);
            message = asBot(panel);
            redirectTo = `?setup=${saved.id}&saved=${panel.ok ? "1" : "warn"}${panel.ok ? "" : `&w=${encodeURIComponent(panel.message || "")}`}`;
          } else redirectTo = `?setup=${saved.id}&saved=1`;
        } else if (!message) failed();
      }
    } else if (action === "toggle_setup" && setupId) {
      const res = await rest(`forum_setups?guild_id=eq.${id}&id=eq.${setupId}&select=enabled`);
      const current = res.ok ? (await res.json())[0] : null;
      if (!current) failed();
      else {
        const done = await rest(`forum_setups?guild_id=eq.${id}&id=eq.${setupId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ enabled: !current.enabled, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
        if (done.ok) await callPettoForums(Astro2, id, session.userId, "panel", { setup_id: setupId, only_if_posted: true }, dashLang).catch(() => null);
        message = done.ok ? { kind: "ok", text: current.enabled ? dt("Setup turned off.") : dt("Setup turned on.") } : { kind: "err", text: dt("It could not be saved, try again.") };
      }
    } else if (action === "delete_setup" && setupId) {
      const res = await rest(`forum_setups?guild_id=eq.${id}&id=eq.${setupId}`, { method: "DELETE" });
      if (res.ok) redirectTo = "?deleted=1";
      else failed();
    } else if (action === "send_panel" && setupId) {
      message = asBot(await callPettoForums(Astro2, id, session.userId, "panel", { setup_id: setupId, channel_id: String(form.get("channel_id") ?? "") }, dashLang));
    } else if (action === "post_action") {
      const thread = String(form.get("thread_id") ?? "");
      message = SNOWFLAKE.test(thread) ? asBot(await callPettoForums(Astro2, id, session.userId, "action", { thread_id: thread, action: String(form.get("post_action") ?? ""), reason: String(form.get("reason") ?? "").slice(0, 300) }, dashLang)) : { kind: "err", text: dt("That is not a post.") };
    }
  }
  if (redirectTo) return Astro2.redirect(`/dash/guild/${id}/forums${redirectTo}`);
  if (Astro2.url.searchParams.get("saved") === "1") message = { kind: "ok", text: dt("Saved.") };
  if (Astro2.url.searchParams.get("saved") === "warn") message = { kind: "warn", text: dt("Saved, but the panel could not be posted: {a}", { a: String(Astro2.url.searchParams.get("w") ?? "").slice(0, 300) }) };
  if (Astro2.url.searchParams.get("deleted") === "1") message = { kind: "ok", text: dt("Setup removed. The posts stay in the forum.") };
  const editing = section === "setups" && setupParam ? setupParam : null;
  const [guildInfo, setupsRes, forumsAnswer, postsAnswer, rolesRes, channelsRes, templatesRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    () => ready ? rest(`forum_setups?guild_id=eq.${id}&select=*&order=id.asc`) : Promise.resolve(null),
    () => ready ? callPettoForums(Astro2, id, session.userId, "channels", {}, dashLang) : Promise.resolve(null),
    () => ready && section === "posts" ? callPettoForums(Astro2, id, session.userId, "posts", { status: statusFilter, setup_id: setupFilter || null, page: pageNumber, limit: 25 }, dashLang) : Promise.resolve(null),
    () => ready && editing ? getGuildList(Astro2, id, botToken, "roles") : Promise.resolve(null),
    () => ready && editing ? getGuildList(Astro2, id, botToken, "channels") : Promise.resolve(null),
    () => ready && editing ? rest(`embed_templates?guild_id=eq.${id}&select=name&order=name.asc`) : Promise.resolve(null)
  ], 5);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const setups = setupsRes?.ok ? await setupsRes.json() : [];
  const forums = forumsAnswer?.ok ? forumsAnswer.data?.forums ?? [] : [];
  const botDown = Boolean(ready && forumsAnswer && !forumsAnswer.ok && forumsAnswer.down);
  const forumsError = ready && forumsAnswer && !forumsAnswer.ok && !forumsAnswer.down ? forumsAnswer.message || dt("The forum list could not be read. Try again in a moment.") : "";
  const postRows = postsAnswer?.ok ? postsAnswer.data.posts ?? [] : [];
  const handlerIds = [...new Set(postRows.map((p) => String(p.claimed_by ?? "")).filter((x) => /^\d{15,25}$/.test(x)))];
  const handlers = handlerIds.length ? (await withinBudget(getMemberProfiles(Astro2, id, handlerIds, botToken, { fallback: "user", userId: session.userId }), 1500))?.value ?? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Map();
  const posts = postsAnswer?.ok ? { rows: postRows.map((p) => ({ ...p, claimed_name: handlers.get(String(p.claimed_by))?.displayName || null })), total: Number(postsAnswer.data.total ?? 0), open: Number(postsAnswer.data.open ?? 0), page: Number(postsAnswer.data.page ?? 0), limit: Number(postsAnswer.data.limit ?? 25) } : null;
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone" && !r.managed).sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const channels = (channelsRes?.ok ? await channelsRes.json() : []).filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  const templates = (templatesRes?.ok ? await templatesRes.json() : []).map((t) => t.name).filter(Boolean);
  const editSetup = editing === "new" ? "new" : editing ? setups.find((s) => String(s.id) === editing) ?? null : null;
  return renderTemplate`${renderComponent($$result, "DashForums", $$DashForums, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "section": section, "ready": ready, "setups": setups, "forums": forums, "botDown": botDown, "forumsError": forumsError, "posts": posts, "roles": roles, "channels": channels, "templates": templates, "editing": editSetup, "statusFilter": statusFilter, "setupFilter": setupFilter, "maxSetups": MAX_SETUPS, "message": message })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/forums.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/forums.astro";
const $$url = "/dash/guild/[id]/forums";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Forums,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
