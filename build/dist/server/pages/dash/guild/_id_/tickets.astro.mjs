import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, d as renderComponent, r as renderTemplate, u as unescapeHTML, F as Fragment } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { r as redrawPanelsInServerLanguage } from '../../../../chunks/panelLanguage_v4KZmQmx.mjs';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$EmojiPicker } from '../../../../chunks/EmojiPicker_0tfnRmiq.mjs';
import { $ as $$ColorPicker } from '../../../../chunks/ColorPicker_DwzcbTkv.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$SelectSource } from '../../../../chunks/SelectSource_Dp8aydFk.mjs';
import { $ as $$SelectChosen } from '../../../../chunks/SelectChosen_B0lELVHS.mjs';
import { m as makeT, g as getDashLang, a as dashLocale } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                            */
import 'clsx';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$DurationScript } from '../../../../chunks/DurationScript_BO_8qKfV.mjs';
import { r as rangeDays, b as botDay } from '../../../../chunks/activityStats_DxqJGP6E.mjs';
import { f as formatDuration } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
import { p as planLimits, P as PREMIUM_LIMITS, F as FREE_LIMITS } from '../../../../chunks/planLimits_BFQNR8Tb.mjs';
import { a as getGuildSession, p as pageDecision } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getGuildEmojis } from '../../../../chunks/guildEmojis_CIHVnrpZ.mjs';
import { n as noteGuildWrite, j as getGuildInfo, k as getGuildDetails, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
import { o as hasPremiumForGuild } from '../../../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { g as getMemberProfiles, m as memberAvatarUrl } from '../../../../chunks/memberNames_skiCoAs8.mjs';
import { w as withinBudget } from '../../../../chunks/liveCall_BSZ7MViH.mjs';
export { renderers } from '../../../../renderers.mjs';

const TICKET_FIELD_TYPES = ["short_text", "long_text", "select", "radio", "checkboxes", "check", "file", "user", "role", "channel", "display"];
const TICKET_FORM_LIMITS = { questions: 5, label: 45, description: 100, placeholder: 100, menuPlaceholder: 150, option: 100, content: 1e3, id: 40, files: 5, picks: 25 };
const TICKET_OPTION_RANGE = { select: [1, 25], radio: [2, 10], checkboxes: [1, 10] };
const isType = (value) => TICKET_FIELD_TYPES.includes(String(value));
const clip = (value, max) => String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);
const whole = (value, min, max, fallback) => {
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
function ticketOptions(value) {
  const rows = Array.isArray(value) ? value : String(value ?? "").split(/\r?\n/);
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const row of rows) {
    const text = clip(row && typeof row === "object" ? row.label ?? row.value : row, TICKET_FORM_LIMITS.option);
    if (!text || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
  }
  return out;
}
function cleanField(raw, index) {
  if (!raw || typeof raw !== "object" || !isType(raw.type)) return "type";
  const type = raw.type;
  const id = String(raw.id ?? raw.label ?? `field_${index + 1}`).trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_").slice(0, TICKET_FORM_LIMITS.id) || `field_${index + 1}`;
  if (type === "display") {
    const content = clip(raw.content ?? raw.label, TICKET_FORM_LIMITS.content);
    return content ? { id, type, label: clip(content.replace(/\s+/g, " "), TICKET_FORM_LIMITS.label), content } : "text";
  }
  const label = clip(raw.label, TICKET_FORM_LIMITS.label);
  if (!label) return "label";
  const out = { id, type, label };
  const description = clip(raw.description, TICKET_FORM_LIMITS.description);
  if (description) out.description = description;
  if (type === "short_text" || type === "long_text") {
    out.placeholder = clip(raw.placeholder, TICKET_FORM_LIMITS.placeholder) || void 0;
    out.required = raw.required !== false;
    return out;
  }
  if (type === "check") {
    if (raw.required === true) out.required = true;
    return out;
  }
  out.required = raw.required !== false;
  const placeholder = clip(raw.placeholder, TICKET_FORM_LIMITS.menuPlaceholder);
  if (type === "select" || type === "radio" || type === "checkboxes") {
    const [min, max] = TICKET_OPTION_RANGE[type];
    const options = ticketOptions(raw.options);
    if (options.length < min || options.length > max) return "options";
    out.options = options;
    if (type === "select") {
      out.max = whole(raw.max, 1, options.length, 1);
      if (placeholder) out.placeholder = placeholder;
    }
    if (type === "checkboxes") out.max = whole(raw.max, 1, options.length, options.length);
    return out;
  }
  if (type === "file") {
    out.accept = raw.accept === "images" ? "images" : "any";
    out.max = whole(raw.max, 1, TICKET_FORM_LIMITS.files, 1);
    return out;
  }
  out.max = whole(raw.max, 1, TICKET_FORM_LIMITS.picks, 1);
  if (placeholder) out.placeholder = placeholder;
  return out;
}
function cleanTicketFields(input) {
  if (!Array.isArray(input) || input.length < 1 || input.length > TICKET_FORM_LIMITS.questions) return { error: "count" };
  const used = /* @__PURE__ */ new Set();
  const fields = [];
  for (const [index, raw] of input.entries()) {
    const clean = cleanField(raw, index);
    if (typeof clean === "string") return { error: clean };
    let id = clean.id;
    for (let n = 2; used.has(id); n += 1) id = `${clean.id.slice(0, TICKET_FORM_LIMITS.id - 3)}_${n}`;
    used.add(id);
    fields.push({ ...clean, id });
  }
  if (!fields.some((field) => field.type !== "display")) return { error: "input" };
  return { fields };
}
function editorFields(input) {
  if (!Array.isArray(input)) return [];
  const out = [];
  const used = /* @__PURE__ */ new Set();
  for (const [index, raw] of input.entries()) {
    if (out.length >= TICKET_FORM_LIMITS.questions) break;
    const clean = cleanField(raw, index);
    if (typeof clean === "string") continue;
    let id = clean.id;
    for (let n = 2; used.has(id); n += 1) id = `${clean.id.slice(0, TICKET_FORM_LIMITS.id - 3)}_${n}`;
    used.add(id);
    out.push({ ...clean, id });
  }
  return out;
}

const $$Astro$7 = createAstro("https://petto.sbs");
const $$TicketFieldRow = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$TicketFieldRow;
  const dt = makeT(getDashLang(Astro2));
  const { f } = Astro2.props;
  const CHOICE_TYPES = ["select", "radio", "checkboxes"];
  const PICKERS = ["user", "role", "channel"];
  const SHOWS = {
    desc: ["short_text", "long_text", "select", "radio", "checkboxes", "check", "file", "user", "role", "channel"],
    hint: ["short_text", "long_text", "select", "user", "role", "channel"],
    options: CHOICE_TYPES,
    multi: ["select"],
    file: ["file"],
    picks: PICKERS,
    content: ["display"],
    required: ["short_text", "long_text", "select", "radio", "checkboxes", "check", "file", "user", "role", "channel"],
    label: ["short_text", "long_text", "select", "radio", "checkboxes", "check", "file", "user", "role", "channel"],
    more: ["short_text", "long_text", "select", "radio", "checkboxes", "check", "file", "user", "role", "channel"]
  };
  const isHidden = (part, type) => !SHOWS[part].includes(type);
  return renderTemplate`${maybeRenderHead()}<div class="ff-row" data-ff-row${addAttribute(f.id, "data-id")}${addAttribute(f.type, "data-type")}> <div class="ff-top"> <select data-ff-type${addAttribute(dt("Type"), "aria-label")}> <optgroup${addAttribute(dt("Text"), "label")}> <option value="short_text"${addAttribute(f.type === "short_text", "selected")}>${dt("Short answer")}</option> <option value="long_text"${addAttribute(f.type === "long_text", "selected")}>${dt("Paragraph")}</option> </optgroup> <optgroup${addAttribute(dt("Choices"), "label")}> <option value="select"${addAttribute(f.type === "select", "selected")}>${dt("Dropdown menu")}</option> <option value="radio"${addAttribute(f.type === "radio", "selected")}>${dt("Radio buttons")}</option> <option value="checkboxes"${addAttribute(f.type === "checkboxes", "selected")}>${dt("Checkboxes")}</option> <option value="check"${addAttribute(f.type === "check", "selected")}>${dt("One checkbox")}</option> </optgroup> <optgroup${addAttribute(dt("Pictures and files"), "label")}> <option value="file"${addAttribute(f.type === "file", "selected")}>${dt("File upload")}</option> </optgroup> <optgroup${addAttribute(dt("Pickers"), "label")}> <option value="user"${addAttribute(f.type === "user", "selected")}>${dt("Member picker")}</option> <option value="role"${addAttribute(f.type === "role", "selected")}>${dt("Role picker")}</option> <option value="channel"${addAttribute(f.type === "channel", "selected")}>${dt("Channel picker")}</option> </optgroup> <optgroup${addAttribute(dt("Other"), "label")}> <option value="display"${addAttribute(f.type === "display", "selected")}>${dt("Text only (no answer)")}</option> </optgroup> </select> <span class="ff-move"> <button type="button" class="ff-icon" data-ff-up${addAttribute(dt("Move up"), "aria-label")}${addAttribute(dt("Move up"), "title")}>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:caret-up-bold", "width": "13", "height": "13" })}</button> <button type="button" class="ff-icon" data-ff-down${addAttribute(dt("Move down"), "aria-label")}${addAttribute(dt("Move down"), "title")}>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:caret-down-bold", "width": "13", "height": "13" })}</button> <button type="button" class="ff-icon ff-del" data-ff-del${addAttribute(dt("Remove"), "aria-label")}${addAttribute(dt("Remove"), "title")}>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:x-bold", "width": "13", "height": "13" })}</button> </span> </div> <div class="ff-body"> <div class="dfx-field" data-part="label"${addAttribute(isHidden("label", f.type), "hidden")}> <label>${dt("Question")}</label> <textarea class="dgl-autogrow dfx-one" rows="1" autocomplete="off" data-one-line data-count data-ff-label${addAttribute(dt("Question"), "placeholder")}${addAttribute(TICKET_FORM_LIMITS.label, "maxlength")}>${f.type === "display" ? "" : f.label}</textarea> </div> <div class="dfx-field" data-part="content"${addAttribute(isHidden("content", f.type), "hidden")}> <label>${dt("Text members read (Markdown works)")}</label> <textarea class="dgl-autogrow" rows="3" data-count data-ff-content${addAttribute(TICKET_FORM_LIMITS.content, "maxlength")}>${f.content ?? ""}</textarea> </div> <div class="dfx-field" data-part="options"${addAttribute(isHidden("options", f.type), "hidden")}> <label>${dt("Choices")}</label> <textarea class="dgl-autogrow" rows="4" data-ff-options${addAttribute(dt("One choice per line"), "placeholder")}>${(f.options ?? []).join("\n")}</textarea> <span class="ff-count" data-ff-count></span> </div> <label class="dfx-switch" data-part="multi"${addAttribute(isHidden("multi", f.type), "hidden")}><span><b>${dt("Members can pick more than one choice")}</b></span><input type="checkbox" class="dfx-t" data-ff-multi${addAttribute(f.type === "select" && (f.max ?? 1) > 1, "checked")}></label> <div class="dfx-grid ff-pair" data-part="file"${addAttribute(isHidden("file", f.type), "hidden")}> <div class="dfx-field"><label>${dt("Members can upload")}</label> <select data-ff-accept> <option value="images"${addAttribute(f.accept === "images", "selected")}>${dt("Pictures only (PNG, JPG, GIF, WebP)")}</option> <option value="any"${addAttribute(f.accept !== "images", "selected")}>${dt("Any file")}</option> </select> </div> <div class="dfx-field"><label>${dt("How many files")}</label> <select data-ff-files> ${[1, 2, 3, 4, 5].map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute((f.max ?? 1) === n, "selected")}>${n}</option>`)} </select> </div> </div> <div class="dfx-field ff-picks" data-part="picks"${addAttribute(isHidden("picks", f.type), "hidden")}> <label>${dt("Members can pick up to")}</label> <input type="number" min="1"${addAttribute(TICKET_FORM_LIMITS.picks, "max")} data-ff-picks${addAttribute(PICKERS.includes(f.type) ? f.max ?? 1 : 1, "value")}> </div> <label class="dfx-switch" data-part="required"${addAttribute(isHidden("required", f.type), "hidden")}><span><b data-ff-req-text>${f.type === "check" ? dt("Must be ticked") : dt("Required")}</b></span><input type="checkbox" class="dfx-t" data-ff-required${addAttribute(f.type === "check" ? f.required === true : f.required !== false, "checked")}></label> <details class="dfx-acc ff-more" data-part="more"${addAttribute(isHidden("more", f.type), "hidden")}${addAttribute(Boolean(f.description || f.placeholder), "open")}> <summary><span class="dfx-acc-title"><b>${dt("More options")}</b></span>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14" })}</summary> <div class="dfx-acc-body"> <div class="dfx-field" data-part="desc"${addAttribute(isHidden("desc", f.type), "hidden")}> <label>${dt("Help text under the question (optional)")}</label> <textarea class="dgl-autogrow dfx-one" rows="1" autocomplete="off" data-one-line data-count data-ff-desc${addAttribute(TICKET_FORM_LIMITS.description, "maxlength")}>${f.description ?? ""}</textarea> </div> <div class="dfx-field" data-part="hint"${addAttribute(isHidden("hint", f.type), "hidden")}> <label>${dt("Hint text (optional)")}</label> <textarea class="dgl-autogrow dfx-one" rows="1" autocomplete="off" data-one-line data-count data-ff-hint${addAttribute(TICKET_FORM_LIMITS.placeholder, "maxlength")}>${f.placeholder ?? ""}</textarea> </div> </div> </details> <p class="ff-warn" data-ff-warn hidden role="status"></p> </div> </div>`;
}, "/home/runner/work/petto-web/petto-web/src/components/TicketFieldRow.astro", void 0);

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(raw || cooked.slice()) }));
var _a$2;
const $$Astro$6 = createAstro("https://petto.sbs");
const $$TicketFieldsBuilder = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$TicketFieldsBuilder;
  const dt = makeT(getDashLang(Astro2));
  const { fields } = Astro2.props;
  const saved = editorFields(fields ?? []);
  const rows = saved.length ? saved : [{ id: "", type: "long_text", label: "", required: true }];
  const blank = { id: "", type: "short_text", label: "", required: true };
  const words = {
    required: dt("Required"),
    tick: dt("Must be ticked"),
    empty: dt("Add a question to see the form."),
    select: dt("Select an option"),
    user: dt("Select a member"),
    role: dt("Select a role"),
    channel: dt("Select a channel"),
    file: dt("Upload a file"),
    images: dt("Pictures only"),
    anyFile: dt("Any file"),
    upTo: dt("Up to {a}", { a: "{a}" }),
    textOnly: dt("Text only, members just read it"),
    needChoices: dt("Add one choice on each line."),
    needTwo: dt("Radio buttons need at least 2 choices."),
    tooMany: dt("Too many choices for this kind of question."),
    needText: dt("Write the text members will read."),
    needLabel: dt("Write the question."),
    title: dt("Ticket details")
  };
  return renderTemplate(_a$2 || (_a$2 = __template$2(["", '<div class="ff" data-ff', "", '> <input type="hidden" name="form_fields_json"', ' data-ff-json> <div class="ff-edit"> <div class="ff-list" data-ff-list> ', " </div> <template data-ff-tpl>", '</template> <button type="button" class="btn btn-ghost btn-sm ff-add" data-ff-add>', "", '</button> <span class="ff-note">', '</span> </div> <details class="ff-preview" data-ff-previewbox open> <summary>', '</summary> <div class="ff-modal" data-ff-preview aria-live="polite"></div> <p class="ff-note">', `</p> </details> </div>  <script>
  if (!window.__ffBound) {
    window.__ffBound = true;
    var NS = {
      label: ['short_text', 'long_text', 'select', 'radio', 'checkboxes', 'check', 'file', 'user', 'role', 'channel'],
      desc: ['short_text', 'long_text', 'select', 'radio', 'checkboxes', 'check', 'file', 'user', 'role', 'channel'],
      hint: ['short_text', 'long_text', 'select', 'user', 'role', 'channel'],
      options: ['select', 'radio', 'checkboxes'],
      multi: ['select'],
      file: ['file'],
      picks: ['user', 'role', 'channel'],
      content: ['display'],
      more: ['short_text', 'long_text', 'select', 'radio', 'checkboxes', 'check', 'file', 'user', 'role', 'channel'],
      required: ['short_text', 'long_text', 'select', 'radio', 'checkboxes', 'check', 'file', 'user', 'role', 'channel']
    };
    var OPTION_RANGE = { select: [1, 25], radio: [2, 10], checkboxes: [1, 10] };
    var text = function (box, key) { try { return JSON.parse(box.getAttribute('data-t') || '{}')[key] || ''; } catch (e) { return ''; } };
    var clean = function (v) { return String(v || '').replace(/\\u0000/g, '').trim(); };
    var lines = function (v) {
      var seen = {}; var out = [];
      String(v || '').split(/\\r?\\n/).forEach(function (line) { var o = clean(line).slice(0, 100); if (o && !seen[o]) { seen[o] = 1; out.push(o); } });
      return out;
    };
    var el = function (tag, cls, content) { var n = document.createElement(tag); if (cls) n.className = cls; if (content != null) n.textContent = content; return n; };

    // One row of the editor as the question the bot stores.
    var readRow = function (row) {
      var type = row.querySelector('[data-ff-type]').value;
      var q = { type: type, id: row.getAttribute('data-id') || '' };
      if (type === 'display') { q.content = clean(row.querySelector('[data-ff-content]').value).slice(0, 1000); return q; }
      q.label = clean(row.querySelector('[data-ff-label]').value).slice(0, 45);
      var desc = clean(row.querySelector('[data-ff-desc]').value).slice(0, 100);
      if (desc) q.description = desc;
      var req = row.querySelector('[data-ff-required]').checked;
      if (type === 'short_text' || type === 'long_text') {
        q.placeholder = clean(row.querySelector('[data-ff-hint]').value).slice(0, 100) || undefined;
        q.required = req;
        return q;
      }
      if (type === 'check') { if (req) q.required = true; return q; }
      q.required = req;
      var hint = clean(row.querySelector('[data-ff-hint]').value).slice(0, 150);
      if (OPTION_RANGE[type]) {
        q.options = lines(row.querySelector('[data-ff-options]').value);
        if (type === 'select') { q.max = row.querySelector('[data-ff-multi]').checked ? Math.max(1, Math.min(25, q.options.length)) : 1; if (hint) q.placeholder = hint; }
        if (type === 'checkboxes') q.max = Math.max(1, q.options.length);
      } else if (type === 'file') {
        q.accept = row.querySelector('[data-ff-accept]').value === 'images' ? 'images' : 'any';
        q.max = Math.max(1, Math.min(5, Number(row.querySelector('[data-ff-files]').value) || 1));
      } else {
        q.max = Math.max(1, Math.min(25, Math.trunc(Number(row.querySelector('[data-ff-picks]').value)) || 1));
        if (hint) q.placeholder = hint;
      }
      return q;
    };

    // The parts of a row that its type uses; the rest are hidden.
    var shape = function (row) {
      var type = row.querySelector('[data-ff-type]').value;
      row.setAttribute('data-type', type);
      Object.keys(NS).forEach(function (part) {
        var node = row.querySelector('[data-part="' + part + '"]');
        if (node) node.hidden = NS[part].indexOf(type) < 0;
      });
      var reqText = row.querySelector('[data-ff-req-text]');
      var box = row.closest('[data-ff]');
      if (reqText && box) reqText.textContent = text(box, type === 'check' ? 'tick' : 'required');
    };

    // What is wrong with a row, said under it ('' when nothing).
    var problem = function (box, q) {
      if (q.type === 'display') return q.content ? '' : text(box, 'needText');
      if (!q.label) return (q.description || q.placeholder || (q.options || []).length) ? text(box, 'needLabel') : '';
      var range = OPTION_RANGE[q.type];
      if (range) {
        var n = (q.options || []).length;
        if (n > range[1]) return text(box, 'tooMany');
        if (n < range[0]) return q.type === 'radio' ? text(box, 'needTwo') : text(box, 'needChoices');
      }
      return '';
    };

    var previewOf = function (box, questions) {
      var host = box.querySelector('[data-ff-preview]');
      if (!host) return;
      host.textContent = '';
      var form = box.closest('form');
      var titleInput = form && form.querySelector('[name="form_title"]');
      host.appendChild(el('h4', null, (titleInput && clean(titleInput.value)) || text(box, 'title')));
      var shown = 0;
      questions.forEach(function (q) {
        if (q.type === 'display') {
          if (!q.content) return;
          shown += 1;
          host.appendChild(el('div', 'ff-pv-info', q.content));
          return;
        }
        if (!q.label) return;
        shown += 1;
        var part = el('div');
        var label = el('span', 'ff-pv-label', q.label);
        var asked = q.type === 'check' ? q.required === true : q.required !== false;
        if (asked) { label.appendChild(document.createTextNode(' ')); label.appendChild(el('i', null, '*')); }
        if (q.type !== 'check') part.appendChild(label);
        if (q.description) part.appendChild(el('div', 'ff-pv-desc', q.description));
        var t = q.type;
        if (t === 'short_text' || t === 'long_text') {
          part.appendChild(el('div', 'ff-pv-box' + (t === 'long_text' ? ' tall' : ''), q.placeholder || ''));
        } else if (t === 'select') {
          var menu = el('div', 'ff-pv-box');
          menu.appendChild(el('span', null, q.placeholder || (q.max > 1 ? text(box, 'upTo').replace('{a}', String(q.max)) : text(box, 'select'))));
          menu.appendChild(el('span', null, '\u2304'));
          part.appendChild(menu);
        } else if (t === 'radio' || t === 'checkboxes') {
          (q.options || []).forEach(function (o) { part.appendChild(el('div', 'ff-pv-opt' + (t === 'checkboxes' ? ' sq' : ''), o)); });
        } else if (t === 'check') {
          var one = el('div', 'ff-pv-opt sq', q.label);
          if (asked) { one.appendChild(document.createTextNode(' ')); one.appendChild(el('i', null, '*')); one.lastChild.style.color = '#f23f42'; one.lastChild.style.fontStyle = 'normal'; }
          part.appendChild(one);
        } else if (t === 'file') {
          var drop = el('div', 'ff-pv-file', text(box, 'file'));
          drop.appendChild(el('small', null, (q.accept === 'images' ? text(box, 'images') : text(box, 'anyFile')) + ' \xB7 ' + text(box, 'upTo').replace('{a}', String(q.max || 1))));
          part.appendChild(drop);
        } else {
          var pick = el('div', 'ff-pv-box');
          pick.appendChild(el('span', null, q.placeholder || text(box, t)));
          pick.appendChild(el('span', null, '\u2304'));
          part.appendChild(pick);
        }
        host.appendChild(part);
      });
      if (!shown) host.appendChild(el('div', 'ff-pv-empty', text(box, 'empty')));
    };

    var sync = function (box) {
      // A builder still being put in the page (the dashboard swaps its content in piece by piece) is drawn once it is complete.
      if (!box.querySelector('[data-ff-json]') || !box.querySelector('[data-ff-add]') || !box.querySelector('[data-ff-preview]')) return;
      var rows = box.querySelectorAll('[data-ff-row]');
      var used = {};
      var list = [];
      rows.forEach(function (row, i) {
        if (!row.querySelector('[data-ff-hint]') || !row.querySelector('[data-ff-picks]')) return;
        shape(row);
        var q = readRow(row);
        var id = row.getAttribute('data-id') || '';
        if (!id || used[id]) { id = 'field_' + (i + 1); while (used[id]) id += 'x'; }
        used[id] = 1;
        row.setAttribute('data-id', id);
        q.id = id;
        var warn = row.querySelector('[data-ff-warn]');
        var said = problem(box, q);
        if (warn) { warn.textContent = said; warn.hidden = !said; }
        var count = row.querySelector('[data-ff-count]');
        if (count) { var range = OPTION_RANGE[q.type]; count.textContent = range ? (q.options || []).length + ' / ' + range[1] : ''; }
        var up = row.querySelector('[data-ff-up]'); var down = row.querySelector('[data-ff-down]');
        if (up) up.disabled = i === 0;
        if (down) down.disabled = i === rows.length - 1;
        list.push(q);
      });
      // A row with nothing written yet is not sent (as before: a form with no question is refused by the page).
      var sent = list.filter(function (q) { return q.type === 'display' ? q.content : q.label; });
      box.querySelector('[data-ff-json]').value = JSON.stringify(sent.slice(0, Number(box.getAttribute('data-max')) || 5));
      var add = box.querySelector('[data-ff-add]');
      if (add) add.style.display = rows.length >= (Number(box.getAttribute('data-max')) || 5) ? 'none' : '';
      previewOf(box, list);
    };
    var syncAll = function () { document.querySelectorAll('[data-ff]').forEach(sync); };
    document.addEventListener('input', function (e) {
      var b = e.target.closest && e.target.closest('[data-ff]');
      if (b) { sync(b); return; }
      // The title of the window is in the form around the builder and is part of the preview.
      if (e.target.name === 'form_title') { var f = e.target.closest('form'); var inside = f && f.querySelector('[data-ff]'); if (inside) sync(inside); }
    });
    document.addEventListener('change', function (e) { var b = e.target.closest && e.target.closest('[data-ff]'); if (b) sync(b); });
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-ff-add],[data-ff-del],[data-ff-up],[data-ff-down]');
      if (!t) return;
      var box = t.closest('[data-ff]');
      var list = box.querySelector('[data-ff-list]');
      var max = Number(box.getAttribute('data-max')) || 5;
      if (t.hasAttribute('data-ff-add')) {
        var rows = list.querySelectorAll('[data-ff-row]');
        if (rows.length >= max) return;
        // A new row is a fresh copy of the one kept in the <template>, so its boxes, counters and numbers are set up like the others.
        var tpl = box.querySelector('template[data-ff-tpl]');
        var copy = tpl && tpl.content.firstElementChild ? tpl.content.firstElementChild.cloneNode(true) : null;
        if (!copy) return;
        list.appendChild(copy);
        if (window.__dfxKit) window.__dfxKit();
        sync(box);
        copy.querySelector('[data-ff-label]').focus();
        return;
      }
      var row = t.closest('[data-ff-row]');
      if (t.hasAttribute('data-ff-up') && row.previousElementSibling) list.insertBefore(row, row.previousElementSibling);
      else if (t.hasAttribute('data-ff-down') && row.nextElementSibling) list.insertBefore(row.nextElementSibling, row);
      else if (t.hasAttribute('data-ff-del')) {
        var all = list.querySelectorAll('[data-ff-row]');
        if (all.length <= 1) {
          ['[data-ff-label]', '[data-ff-desc]', '[data-ff-hint]', '[data-ff-content]', '[data-ff-options]'].forEach(function (s) { var n = row.querySelector(s); if (n) n.value = ''; });
        } else row.remove();
      }
      // Changing the order or removing a row is a change the page has to see (it keeps track of unsaved changes).
      box.dispatchEvent(new Event('input', { bubbles: true }));
      sync(box);
    });
    document.addEventListener('submit', function (e) { var b = e.target.querySelector && e.target.querySelector('[data-ff]'); if (b) sync(b); }, true);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncAll); else syncAll();
    // The dashboard swaps its content in after a save or a change of section; the new builders are filled in as they appear.
    if (window.MutationObserver) {
      new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i += 1) {
          for (var j = 0; j < records[i].addedNodes.length; j += 1) {
            var node = records[i].addedNodes[j];
            if (node.nodeType !== 1) continue;
            if (node.matches && node.matches('[data-ff]')) setTimeout(function (n) { return function () { sync(n); }; }(node), 0);
            else if (node.querySelectorAll) node.querySelectorAll('[data-ff]').forEach(function (n) { setTimeout(function () { sync(n); }, 0); });
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  }
<\/script>`], ["", '<div class="ff" data-ff', "", '> <input type="hidden" name="form_fields_json"', ' data-ff-json> <div class="ff-edit"> <div class="ff-list" data-ff-list> ', " </div> <template data-ff-tpl>", '</template> <button type="button" class="btn btn-ghost btn-sm ff-add" data-ff-add>', "", '</button> <span class="ff-note">', '</span> </div> <details class="ff-preview" data-ff-previewbox open> <summary>', '</summary> <div class="ff-modal" data-ff-preview aria-live="polite"></div> <p class="ff-note">', `</p> </details> </div>  <script>
  if (!window.__ffBound) {
    window.__ffBound = true;
    var NS = {
      label: ['short_text', 'long_text', 'select', 'radio', 'checkboxes', 'check', 'file', 'user', 'role', 'channel'],
      desc: ['short_text', 'long_text', 'select', 'radio', 'checkboxes', 'check', 'file', 'user', 'role', 'channel'],
      hint: ['short_text', 'long_text', 'select', 'user', 'role', 'channel'],
      options: ['select', 'radio', 'checkboxes'],
      multi: ['select'],
      file: ['file'],
      picks: ['user', 'role', 'channel'],
      content: ['display'],
      more: ['short_text', 'long_text', 'select', 'radio', 'checkboxes', 'check', 'file', 'user', 'role', 'channel'],
      required: ['short_text', 'long_text', 'select', 'radio', 'checkboxes', 'check', 'file', 'user', 'role', 'channel']
    };
    var OPTION_RANGE = { select: [1, 25], radio: [2, 10], checkboxes: [1, 10] };
    var text = function (box, key) { try { return JSON.parse(box.getAttribute('data-t') || '{}')[key] || ''; } catch (e) { return ''; } };
    var clean = function (v) { return String(v || '').replace(/\\\\u0000/g, '').trim(); };
    var lines = function (v) {
      var seen = {}; var out = [];
      String(v || '').split(/\\\\r?\\\\n/).forEach(function (line) { var o = clean(line).slice(0, 100); if (o && !seen[o]) { seen[o] = 1; out.push(o); } });
      return out;
    };
    var el = function (tag, cls, content) { var n = document.createElement(tag); if (cls) n.className = cls; if (content != null) n.textContent = content; return n; };

    // One row of the editor as the question the bot stores.
    var readRow = function (row) {
      var type = row.querySelector('[data-ff-type]').value;
      var q = { type: type, id: row.getAttribute('data-id') || '' };
      if (type === 'display') { q.content = clean(row.querySelector('[data-ff-content]').value).slice(0, 1000); return q; }
      q.label = clean(row.querySelector('[data-ff-label]').value).slice(0, 45);
      var desc = clean(row.querySelector('[data-ff-desc]').value).slice(0, 100);
      if (desc) q.description = desc;
      var req = row.querySelector('[data-ff-required]').checked;
      if (type === 'short_text' || type === 'long_text') {
        q.placeholder = clean(row.querySelector('[data-ff-hint]').value).slice(0, 100) || undefined;
        q.required = req;
        return q;
      }
      if (type === 'check') { if (req) q.required = true; return q; }
      q.required = req;
      var hint = clean(row.querySelector('[data-ff-hint]').value).slice(0, 150);
      if (OPTION_RANGE[type]) {
        q.options = lines(row.querySelector('[data-ff-options]').value);
        if (type === 'select') { q.max = row.querySelector('[data-ff-multi]').checked ? Math.max(1, Math.min(25, q.options.length)) : 1; if (hint) q.placeholder = hint; }
        if (type === 'checkboxes') q.max = Math.max(1, q.options.length);
      } else if (type === 'file') {
        q.accept = row.querySelector('[data-ff-accept]').value === 'images' ? 'images' : 'any';
        q.max = Math.max(1, Math.min(5, Number(row.querySelector('[data-ff-files]').value) || 1));
      } else {
        q.max = Math.max(1, Math.min(25, Math.trunc(Number(row.querySelector('[data-ff-picks]').value)) || 1));
        if (hint) q.placeholder = hint;
      }
      return q;
    };

    // The parts of a row that its type uses; the rest are hidden.
    var shape = function (row) {
      var type = row.querySelector('[data-ff-type]').value;
      row.setAttribute('data-type', type);
      Object.keys(NS).forEach(function (part) {
        var node = row.querySelector('[data-part="' + part + '"]');
        if (node) node.hidden = NS[part].indexOf(type) < 0;
      });
      var reqText = row.querySelector('[data-ff-req-text]');
      var box = row.closest('[data-ff]');
      if (reqText && box) reqText.textContent = text(box, type === 'check' ? 'tick' : 'required');
    };

    // What is wrong with a row, said under it ('' when nothing).
    var problem = function (box, q) {
      if (q.type === 'display') return q.content ? '' : text(box, 'needText');
      if (!q.label) return (q.description || q.placeholder || (q.options || []).length) ? text(box, 'needLabel') : '';
      var range = OPTION_RANGE[q.type];
      if (range) {
        var n = (q.options || []).length;
        if (n > range[1]) return text(box, 'tooMany');
        if (n < range[0]) return q.type === 'radio' ? text(box, 'needTwo') : text(box, 'needChoices');
      }
      return '';
    };

    var previewOf = function (box, questions) {
      var host = box.querySelector('[data-ff-preview]');
      if (!host) return;
      host.textContent = '';
      var form = box.closest('form');
      var titleInput = form && form.querySelector('[name="form_title"]');
      host.appendChild(el('h4', null, (titleInput && clean(titleInput.value)) || text(box, 'title')));
      var shown = 0;
      questions.forEach(function (q) {
        if (q.type === 'display') {
          if (!q.content) return;
          shown += 1;
          host.appendChild(el('div', 'ff-pv-info', q.content));
          return;
        }
        if (!q.label) return;
        shown += 1;
        var part = el('div');
        var label = el('span', 'ff-pv-label', q.label);
        var asked = q.type === 'check' ? q.required === true : q.required !== false;
        if (asked) { label.appendChild(document.createTextNode(' ')); label.appendChild(el('i', null, '*')); }
        if (q.type !== 'check') part.appendChild(label);
        if (q.description) part.appendChild(el('div', 'ff-pv-desc', q.description));
        var t = q.type;
        if (t === 'short_text' || t === 'long_text') {
          part.appendChild(el('div', 'ff-pv-box' + (t === 'long_text' ? ' tall' : ''), q.placeholder || ''));
        } else if (t === 'select') {
          var menu = el('div', 'ff-pv-box');
          menu.appendChild(el('span', null, q.placeholder || (q.max > 1 ? text(box, 'upTo').replace('{a}', String(q.max)) : text(box, 'select'))));
          menu.appendChild(el('span', null, '\u2304'));
          part.appendChild(menu);
        } else if (t === 'radio' || t === 'checkboxes') {
          (q.options || []).forEach(function (o) { part.appendChild(el('div', 'ff-pv-opt' + (t === 'checkboxes' ? ' sq' : ''), o)); });
        } else if (t === 'check') {
          var one = el('div', 'ff-pv-opt sq', q.label);
          if (asked) { one.appendChild(document.createTextNode(' ')); one.appendChild(el('i', null, '*')); one.lastChild.style.color = '#f23f42'; one.lastChild.style.fontStyle = 'normal'; }
          part.appendChild(one);
        } else if (t === 'file') {
          var drop = el('div', 'ff-pv-file', text(box, 'file'));
          drop.appendChild(el('small', null, (q.accept === 'images' ? text(box, 'images') : text(box, 'anyFile')) + ' \xB7 ' + text(box, 'upTo').replace('{a}', String(q.max || 1))));
          part.appendChild(drop);
        } else {
          var pick = el('div', 'ff-pv-box');
          pick.appendChild(el('span', null, q.placeholder || text(box, t)));
          pick.appendChild(el('span', null, '\u2304'));
          part.appendChild(pick);
        }
        host.appendChild(part);
      });
      if (!shown) host.appendChild(el('div', 'ff-pv-empty', text(box, 'empty')));
    };

    var sync = function (box) {
      // A builder still being put in the page (the dashboard swaps its content in piece by piece) is drawn once it is complete.
      if (!box.querySelector('[data-ff-json]') || !box.querySelector('[data-ff-add]') || !box.querySelector('[data-ff-preview]')) return;
      var rows = box.querySelectorAll('[data-ff-row]');
      var used = {};
      var list = [];
      rows.forEach(function (row, i) {
        if (!row.querySelector('[data-ff-hint]') || !row.querySelector('[data-ff-picks]')) return;
        shape(row);
        var q = readRow(row);
        var id = row.getAttribute('data-id') || '';
        if (!id || used[id]) { id = 'field_' + (i + 1); while (used[id]) id += 'x'; }
        used[id] = 1;
        row.setAttribute('data-id', id);
        q.id = id;
        var warn = row.querySelector('[data-ff-warn]');
        var said = problem(box, q);
        if (warn) { warn.textContent = said; warn.hidden = !said; }
        var count = row.querySelector('[data-ff-count]');
        if (count) { var range = OPTION_RANGE[q.type]; count.textContent = range ? (q.options || []).length + ' / ' + range[1] : ''; }
        var up = row.querySelector('[data-ff-up]'); var down = row.querySelector('[data-ff-down]');
        if (up) up.disabled = i === 0;
        if (down) down.disabled = i === rows.length - 1;
        list.push(q);
      });
      // A row with nothing written yet is not sent (as before: a form with no question is refused by the page).
      var sent = list.filter(function (q) { return q.type === 'display' ? q.content : q.label; });
      box.querySelector('[data-ff-json]').value = JSON.stringify(sent.slice(0, Number(box.getAttribute('data-max')) || 5));
      var add = box.querySelector('[data-ff-add]');
      if (add) add.style.display = rows.length >= (Number(box.getAttribute('data-max')) || 5) ? 'none' : '';
      previewOf(box, list);
    };
    var syncAll = function () { document.querySelectorAll('[data-ff]').forEach(sync); };
    document.addEventListener('input', function (e) {
      var b = e.target.closest && e.target.closest('[data-ff]');
      if (b) { sync(b); return; }
      // The title of the window is in the form around the builder and is part of the preview.
      if (e.target.name === 'form_title') { var f = e.target.closest('form'); var inside = f && f.querySelector('[data-ff]'); if (inside) sync(inside); }
    });
    document.addEventListener('change', function (e) { var b = e.target.closest && e.target.closest('[data-ff]'); if (b) sync(b); });
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-ff-add],[data-ff-del],[data-ff-up],[data-ff-down]');
      if (!t) return;
      var box = t.closest('[data-ff]');
      var list = box.querySelector('[data-ff-list]');
      var max = Number(box.getAttribute('data-max')) || 5;
      if (t.hasAttribute('data-ff-add')) {
        var rows = list.querySelectorAll('[data-ff-row]');
        if (rows.length >= max) return;
        // A new row is a fresh copy of the one kept in the <template>, so its boxes, counters and numbers are set up like the others.
        var tpl = box.querySelector('template[data-ff-tpl]');
        var copy = tpl && tpl.content.firstElementChild ? tpl.content.firstElementChild.cloneNode(true) : null;
        if (!copy) return;
        list.appendChild(copy);
        if (window.__dfxKit) window.__dfxKit();
        sync(box);
        copy.querySelector('[data-ff-label]').focus();
        return;
      }
      var row = t.closest('[data-ff-row]');
      if (t.hasAttribute('data-ff-up') && row.previousElementSibling) list.insertBefore(row, row.previousElementSibling);
      else if (t.hasAttribute('data-ff-down') && row.nextElementSibling) list.insertBefore(row.nextElementSibling, row);
      else if (t.hasAttribute('data-ff-del')) {
        var all = list.querySelectorAll('[data-ff-row]');
        if (all.length <= 1) {
          ['[data-ff-label]', '[data-ff-desc]', '[data-ff-hint]', '[data-ff-content]', '[data-ff-options]'].forEach(function (s) { var n = row.querySelector(s); if (n) n.value = ''; });
        } else row.remove();
      }
      // Changing the order or removing a row is a change the page has to see (it keeps track of unsaved changes).
      box.dispatchEvent(new Event('input', { bubbles: true }));
      sync(box);
    });
    document.addEventListener('submit', function (e) { var b = e.target.querySelector && e.target.querySelector('[data-ff]'); if (b) sync(b); }, true);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncAll); else syncAll();
    // The dashboard swaps its content in after a save or a change of section; the new builders are filled in as they appear.
    if (window.MutationObserver) {
      new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i += 1) {
          for (var j = 0; j < records[i].addedNodes.length; j += 1) {
            var node = records[i].addedNodes[j];
            if (node.nodeType !== 1) continue;
            if (node.matches && node.matches('[data-ff]')) setTimeout(function (n) { return function () { sync(n); }; }(node), 0);
            else if (node.querySelectorAll) node.querySelectorAll('[data-ff]').forEach(function (n) { setTimeout(function () { sync(n); }, 0); });
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  }
<\/script>`])), maybeRenderHead(), addAttribute(TICKET_FORM_LIMITS.questions, "data-max"), addAttribute(JSON.stringify(words), "data-t"), addAttribute(JSON.stringify(saved), "value"), rows.map((f) => renderTemplate`${renderComponent($$result, "TicketFieldRow", $$TicketFieldRow, { "f": f })}`), renderComponent($$result, "TicketFieldRow", $$TicketFieldRow, { "f": blank }), renderComponent($$result, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "13", "height": "13" }), dt("Add question"), dt("Up to 5 parts in a form (Discord's limit), and at least one that members answer."), dt("Preview of the form"), dt("How the window looks in Discord. Members fill it in when they press the panel button."));
}, "/home/runner/work/petto-web/petto-web/src/components/TicketFieldsBuilder.astro", void 0);

const $$Astro$5 = createAstro("https://petto.sbs");
const $$TicketEmoji = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$TicketEmoji;
  const { emoji, fallback = "\u{1F3AB}", size = 18 } = Astro2.props;
  const custom = /^<(a?):(\w+):(\d+)>$/.exec(String(emoji ?? "").trim());
  const url = custom ? `https://cdn.discordapp.com/emojis/${custom[3]}.${custom[1] ? "gif" : "png"}?size=${size > 24 ? 64 : 48}` : null;
  const text = String(emoji ?? "").trim() || fallback;
  return renderTemplate`${url ? renderTemplate`${maybeRenderHead()}<img class="tk-em"${addAttribute(url, "src")}${addAttribute(custom[2], "alt")}${addAttribute(size, "width")}${addAttribute(size, "height")} loading="lazy" decoding="async" referrerpolicy="no-referrer" data-astro-cid-p5klunq3>` : renderTemplate`<span class="tk-em-text"${addAttribute(`font-size:${size - 3}px`, "style")} data-astro-cid-p5klunq3>${text}</span>`}`;
}, "/home/runner/work/petto-web/petto-web/src/components/TicketEmoji.astro", void 0);

const $$Astro$4 = createAstro("https://petto.sbs");
const $$TicketGuide = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$TicketGuide;
  const dt = makeT(getDashLang(Astro2));
  const { guildId, section, typeCount, panelCount, postedCount } = Astro2.props;
  const base = `/dash/guild/${guildId}/tickets`;
  const steps = [
    { n: 1, id: "types", done: typeCount > 0, title: dt("Create a support type"), text: dt("It is what the member picks: Support, Report a player, Purchases... Each one has its own staff, channel name and welcome text."), href: `${base}?section=types`, cta: dt("Support types") },
    { n: 2, id: "panels", done: panelCount > 0, title: dt("Create the panel"), text: dt("The message with buttons or a dropdown, in a channel. Here the member opens their ticket. Pick a ready design or make your own."), href: `${base}?section=panels`, cta: dt("Panels") },
    { n: 3, id: "post", done: postedCount > 0, title: dt("Post it and try it"), text: dt("Saving posts the panel in Discord. Open a ticket yourself to see it as a member does."), href: `${base}?section=panels`, cta: dt("Panels") }
  ];
  const next = steps.find((s) => !s.done)?.n ?? 0;
  return renderTemplate`${maybeRenderHead()}<section class="tg"${addAttribute(dt("How to set up tickets"), "aria-label")} data-astro-cid-cbplozd6> <div class="tg-head" data-astro-cid-cbplozd6> <strong data-astro-cid-cbplozd6>${dt("How to set up tickets")}</strong> <span data-astro-cid-cbplozd6>${next === 0 ? dt("Everything is ready. You can still adjust closing, ratings and hours in Ticket Settings.") : dt("Three steps, in this order.")}</span> </div> <ol class="tg-steps" data-astro-cid-cbplozd6> ${steps.map((s) => renderTemplate`<li${addAttribute(["tg-step", { "tg-done": s.done, "tg-next": s.n === next }], "class:list")} data-astro-cid-cbplozd6> <span class="tg-n" data-astro-cid-cbplozd6>${s.done ? renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-cbplozd6": true })}` : s.n}</span> <div data-astro-cid-cbplozd6> <b data-astro-cid-cbplozd6>${s.title}</b> <p data-astro-cid-cbplozd6>${s.text}</p> ${s.id !== section && !s.done && renderTemplate`<a${addAttribute(s.href, "href")} data-astro-cid-cbplozd6>${s.cta} →</a>`} </div> </li>`)} </ol> </section> `;
}, "/home/runner/work/petto-web/petto-web/src/components/TicketGuide.astro", void 0);

const $$Astro$3 = createAstro("https://petto.sbs");
const $$TicketPanelPreview = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$TicketPanelPreview;
  const dt = makeT(getDashLang(Astro2));
  const { title = "", description = "", color = "", imageUrl = "", footer = "", style = "button", placeholder = "", types = [], design = null } = Astro2.props;
  const stripe = /^#[0-9a-f]{6}$/i.test(color) ? color : "#a5ea7a";
  const text = description || (types.length ? dt("Click a button below to open a ticket.") : "");
  const styleOf = (s) => ["secondary", "success", "danger"].includes(s ?? "") ? s : "primary";
  return renderTemplate`${maybeRenderHead()}<div class="pv" data-panel-preview${addAttribute(style, "data-style")}${addAttribute(types.length ? "1" : "", "data-has-types")} data-astro-cid-tz6zcuv3> <div class="pv-label" data-astro-cid-tz6zcuv3>${dt("Preview")}</div> <div class="pv-msg" data-astro-cid-tz6zcuv3> <div class="pv-who" data-astro-cid-tz6zcuv3><img src="/assets/mascot-icon.webp" alt="" width="24" height="24" data-astro-cid-tz6zcuv3><b data-astro-cid-tz6zcuv3>Petto</b><span class="pv-app" data-astro-cid-tz6zcuv3>APP</span></div> <div class="pv-card"${addAttribute(`--pv-color:${stripe}`, "style")} data-pv-card data-astro-cid-tz6zcuv3> <img class="pv-banner" data-pv-image${addAttribute(imageUrl || void 0, "src")} alt=""${addAttribute(!imageUrl, "hidden")} referrerpolicy="no-referrer" data-astro-cid-tz6zcuv3> <p class="pv-title" data-pv-title data-astro-cid-tz6zcuv3>${title}</p> <p class="pv-desc" data-pv-desc data-astro-cid-tz6zcuv3>${text}</p> <p class="pv-foot" data-pv-foot${addAttribute(!footer, "hidden")} data-astro-cid-tz6zcuv3>${footer}</p> </div> ${design && renderTemplate`<p class="pv-note" data-astro-cid-tz6zcuv3>${dt('The saved design "{name}" decides how the message looks. This preview shows only the simple panel.', { name: design })}</p>`} <div class="pv-buttons" data-pv-buttons data-astro-cid-tz6zcuv3> ${types.length ? types.slice(0, 5).map((t) => renderTemplate`<span${addAttribute(`pv-btn pv-${styleOf(t.buttonStyle)}`, "class")} data-astro-cid-tz6zcuv3>${renderComponent($$result, "TicketEmoji", $$TicketEmoji, { "emoji": t.emoji, "size": 16, "data-astro-cid-tz6zcuv3": true })} ${t.label}</span>`) : renderTemplate`<span class="pv-none" data-astro-cid-tz6zcuv3>${dt("No types yet, so there is nothing to click. Add one in Support types.")}</span>`} </div> <div class="pv-select" data-pv-select data-astro-cid-tz6zcuv3> <span data-pv-placeholder data-astro-cid-tz6zcuv3>${placeholder || dt("Select a ticket category...")}</span><span class="pv-caret" data-astro-cid-tz6zcuv3>⌄</span> </div> ${types.length > 0 && renderTemplate`<div class="pv-options" data-pv-options data-astro-cid-tz6zcuv3> ${types.slice(0, 25).map((t) => renderTemplate`<div class="pv-opt" data-astro-cid-tz6zcuv3>${renderComponent($$result, "TicketEmoji", $$TicketEmoji, { "emoji": t.emoji, "size": 18, "data-astro-cid-tz6zcuv3": true })}<span data-astro-cid-tz6zcuv3><b data-astro-cid-tz6zcuv3>${t.label}</b>${t.description && renderTemplate`<small data-astro-cid-tz6zcuv3>${t.description}</small>`}</span></div>`)} </div>`} </div> </div> `;
}, "/home/runner/work/petto-web/petto-web/src/components/TicketPanelPreview.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$2 = createAstro("https://petto.sbs");
const $$TicketLive = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$TicketLive;
  const { guildId, openCount, viewOnly, me } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const text = {
    waiting: dt("Waiting for staff"),
    answered: dt("Answered"),
    unclaimed: dt("Unclaimed"),
    claimedBy: dt("Claimed by {name}"),
    opened: dt("Opened {time}"),
    lastMessage: dt("Last message {time}"),
    noMessages: dt("No messages yet"),
    unread: dt("New messages"),
    updated: dt("Updated {time}"),
    offline: dt("Could not reach Petto. Trying again\u2026"),
    empty: dt("No open tickets right now. New ones appear here by themselves."),
    emptyFilter: dt("No ticket matches this filter."),
    more: dt("Showing the {n} newest open tickets."),
    pick: dt("Pick a ticket to read it here."),
    loading: dt("Loading\u2026"),
    channelGone: dt("The channel of this ticket no longer exists."),
    closedNote: dt("This ticket is closed."),
    noAccess: dt("You can read this ticket but not act on it: only its staff (a support role of its type) or a manager can."),
    viewOnly: dt("Your role can look at tickets here but not answer them."),
    openDiscord: dt("Open in Discord"),
    claim: dt("Claim"),
    unclaim: dt("Unclaim"),
    addMember: dt("Add a member"),
    addPlaceholder: dt("Member ID or mention"),
    add: dt("Add"),
    remove: dt("Remove {name} from the ticket"),
    close: dt("Close ticket"),
    closeReason: dt("Reason (shown in the log and the transcript)"),
    closeReasonRequired: dt("Reason (this server requires one)"),
    closeConfirm: dt("Close it"),
    closeHint: dt("The transcript is made and sent like when it is closed in Discord."),
    cancel: dt("Cancel"),
    replyPlaceholder: dt("Write a reply\u2026"),
    send: dt("Send"),
    sending: dt("Sending\u2026"),
    replyNote: dt("Sent as Petto with your name on top, so the member knows who answered. Nobody is pinged."),
    back: dt("All tickets"),
    members: dt("Added members"),
    attachment: dt("Attachment"),
    card: dt("Card from Petto"),
    fields: dt("{n} fields"),
    edited: dt("(edited)"),
    failed: dt("That could not be done. Try again."),
    staff: dt("Staff"),
    priority: dt("Priority: {p}"),
    stale: dt("Showing the last copy: Discord is slow to answer."),
    ago: dt("{a} ago"),
    inTime: dt("in {a}"),
    justNow: dt("just now")
  };
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", " ", '<div class="tkl" role="region" data-tkl', "", "", "", "", '> <script type="application/json" data-tkl-text>', '<\/script> <div class="tkl-bar"> <span class="tkl-live" data-tkl-status><i aria-hidden="true"></i><span data-tkl-status-text>', '</span></span> <div class="tkl-filters" role="tablist"', '> <button type="button" class="tkl-filter on" data-tkl-filter="all" role="tab" aria-selected="true">', ' <em data-tkl-count="all">', '</em></button> <button type="button" class="tkl-filter" data-tkl-filter="waiting" role="tab" aria-selected="false">', ' <em data-tkl-count="waiting"></em></button> <button type="button" class="tkl-filter" data-tkl-filter="unclaimed" role="tab" aria-selected="false">', ' <em data-tkl-count="unclaimed"></em></button> <button type="button" class="tkl-filter" data-tkl-filter="mine" role="tab" aria-selected="false">', ' <em data-tkl-count="mine"></em></button> </div> <input type="search" class="tkl-search" data-tkl-search', "", ' autocomplete="off"> </div> <div class="tkl-body" data-tkl-body> <div class="tkl-list" data-tkl-list aria-live="polite"> ', ' </div> <div class="tkl-pane" data-tkl-pane> <div class="tkl-pick">', "<p>", `</p></div> </div> </div> </div> <script>
  (function () {
    var root = document.querySelector('#dgl-content [data-tkl]');
    if (!root || root.dataset.bound) return;
    root.dataset.bound = '1';
    // A previous copy of this view (the page was drawn again or reached again from the menu) stops: one view runs at a time.
    if (window.__tklStop) { try { window.__tklStop(); } catch (e) { /* already gone */ } }
    var T = {};
    try { T = JSON.parse(root.querySelector('[data-tkl-text]').textContent || '{}'); } catch (e) { T = {}; }
    var guild = root.getAttribute('data-guild');
    var lang = root.getAttribute('data-lang') || 'en';
    var viewOnly = root.hasAttribute('data-view-only');
    var base = '/dash/guild/' + guild + '/tickets-live';
    var listEl = root.querySelector('[data-tkl-list]');
    var pane = root.querySelector('[data-tkl-pane]');
    var body = root.querySelector('[data-tkl-body]');
    var statusEl = root.querySelector('[data-tkl-status]');
    var statusText = root.querySelector('[data-tkl-status-text]');
    var search = root.querySelector('[data-tkl-search]');
    var me = null;
    var tickets = [];
    var filter = 'all';
    var openNumber = null;
    var openData = null;
    var drawnIds = '';
    var listShown = false;
    var lastSignal = 0;
    var listAt = 0;
    var timers = [];
    var stopped = false;
    var SEEN_KEY = 'tkl:seen:' + guild;
    var seen = {};
    try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}') || {}; } catch (e) { seen = {}; }
    function saveSeen() { try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) { /* private window */ } }
    function say(key, vars) {
      var s = T[key] || key;
      if (vars) s = s.replace(/\\{(\\w+)\\}/g, function (w, k) { return k in vars ? String(vars[k]) : w; });
      return s;
    }
    // The age of a moment in the short form of the dashboard: 5m ago, 1h 5m ago, in 2d.
    function ago(iso) {
      if (!iso) return '';
      var s = Math.round((Date.parse(iso) - Date.now()) / 1000);
      var abs = Math.abs(s);
      if (abs < 45) return say('justNow');
      var short = window.dglDuration(abs, { locale: lang });
      return s < 0 ? say('ago', { a: short }) : say('inTime', { a: short });
    }
    function clock(iso) {
      try { return new Date(iso).toLocaleString(lang, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }); } catch (e) { return iso; }
    }
    function h(tag, attrs, kids) {
      var el = document.createElement(tag);
      if (attrs) for (var k in attrs) {
        if (attrs[k] == null || attrs[k] === false) continue;
        if (k === 'class') el.className = attrs[k];
        else if (k === 'text') el.textContent = attrs[k];
        else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]);
        else el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
      }
      (kids || []).forEach(function (kid) { if (kid != null && kid !== false) el.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid); });
      return el;
    }
    function avatarOf(person, size) {
      var id = person && person.id ? String(person.id) : '0';
      var src = person && person.avatar ? person.avatar : 'https://cdn.discordapp.com/embed/avatars/' + (Number(id.slice(-3)) % 6) + '.png';
      return h('img', { class: 'tkl-av', src: src, alt: '', width: size || 28, height: size || 28, loading: 'lazy', referrerpolicy: 'no-referrer' });
    }
    // Text with its line breaks, and its web links as links. Never HTML from the message.
    // Discord's headings (# text) are drawn bold and its small lines (-# text) small, as Discord shows them.
    function richText(value) {
      var wrap = h('div', { class: 'tkl-text' });
      String(value || '').split('\\n').forEach(function (line, n) {
        if (n) wrap.appendChild(document.createTextNode('\\n'));
        var target = wrap;
        var small = /^-#\\s+/.exec(line);
        var head = !small && /^#{1,3}\\s+/.exec(line);
        if (small || head) { target = h('span', { class: small ? 'tkl-small' : 'tkl-h' }); wrap.appendChild(target); line = line.slice((small || head)[0].length); }
        line.split(/(https?:\\/\\/[^\\s<>"]+)/g).forEach(function (part, i) {
          if (i % 2) target.appendChild(h('a', { href: part, target: '_blank', rel: 'noopener noreferrer nofollow', text: part.length > 80 ? part.slice(0, 77) + '\u2026' : part }));
          else if (part) target.appendChild(document.createTextNode(part));
        });
      });
      return wrap;
    }
    function api(url, init) {
      var options = Object.assign({ credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' } }, init || {});
      // A call that never answers ends after 30 s, so a button is never left saying "Sending...".
      if (!options.signal && window.AbortSignal && AbortSignal.timeout) options.signal = AbortSignal.timeout(30000);
      return fetch(url, options).then(function (res) {
        return res.json().catch(function () { return null; }).then(function (data) { return { ok: res.ok && data && data.ok, status: res.status, data: data || {} }; });
      });
    }
    function setStatus(ok) {
      statusEl.classList.toggle('off', !ok);
      statusText.textContent = ok ? say('updated', { time: ago(new Date().toISOString()) }) : say('offline');
    }
    function isUnread(t) {
      if (!t.lastMessageAt) return false;
      if (t.lastAuthor && t.lastAuthor.staffReply && t.lastAuthor.id) return false;
      var at = seen[t.number];
      return !at ? Boolean(t.waiting) : Date.parse(t.lastMessageAt) > at;
    }
    function matches(t) {
      if (filter === 'waiting' && !t.waiting) return false;
      if (filter === 'unclaimed' && t.claimedBy) return false;
      if (filter === 'mine' && !(t.claimedBy && me && t.claimedBy.id === me)) return false;
      var q = (search.value || '').trim().toLowerCase().replace(/^#/, '');
      if (!q) return true;
      return String(t.number).indexOf(q) === 0 || [t.opener && t.opener.name, t.opener && t.opener.username, t.category && t.category.label, t.channelName].some(function (v) { return v && String(v).toLowerCase().indexOf(q) !== -1; });
    }
    function counts() {
      var c = { all: tickets.length, waiting: 0, unclaimed: 0, mine: 0 };
      tickets.forEach(function (t) { if (t.waiting) c.waiting++; if (!t.claimedBy) c.unclaimed++; if (me && t.claimedBy && t.claimedBy.id === me) c.mine++; });
      root.querySelectorAll('[data-tkl-count]').forEach(function (el) { var n = c[el.getAttribute('data-tkl-count')]; el.textContent = n ? String(n) : (el.getAttribute('data-tkl-count') === 'all' ? '0' : ''); });
    }
    function drawList(total, limit) {
      counts();
      // The most recent conversation on top, as in a chat.
      var when = function (t) { return Date.parse(t.lastMessageAt || t.openedAt || 0) || 0; };
      var shown = tickets.filter(matches).sort(function (a, b) { return when(b) - when(a); });
      listEl.textContent = '';
      if (!tickets.length) { listEl.appendChild(h('div', { class: 'tkl-empty' }, [h('p', { text: say('empty') })])); return; }
      if (!shown.length) { listEl.appendChild(h('div', { class: 'tkl-empty' }, [h('p', { text: say('emptyFilter') })])); return; }
      var first = !listShown;
      listShown = true;
      shown.forEach(function (t, n) {
        var unread = isUnread(t) && t.number !== openNumber;
        var row = h('button', { type: 'button', class: 'tkl-row' + (t.number === openNumber ? ' on' : '') + (unread ? ' unread' : ''), 'data-number': t.number, 'aria-current': t.number === openNumber ? 'true' : null, onclick: function () { openTicket(t.number); } }, [
          avatarOf(t.opener, 34),
          h('div', { class: 'tkl-row-main' }, [
            h('div', { class: 'tkl-row-top' }, [
              h('b', { class: 'tkl-num', text: '#' + String(t.number).padStart(4, '0') }),
              h('span', { class: 'tkl-cat', text: ((t.category && t.category.emoji && t.category.emoji.length <= 8 ? t.category.emoji + ' ' : '') + ((t.category && t.category.label) || '\u2014')) }),
              unread ? h('i', { class: 'tkl-dot', title: say('unread'), 'aria-label': say('unread') }) : null,
              h('time', { class: 'tkl-age', datetime: t.lastMessageAt || t.openedAt, title: say('opened', { time: ago(t.openedAt) }), text: ago(t.lastMessageAt || t.openedAt) }),
            ]),
            h('div', { class: 'tkl-row-who', text: (t.opener && t.opener.name) || '' }),
            h('div', { class: 'tkl-row-tags' }, [
              t.waiting === true ? h('span', { class: 'tkl-tag wait', text: say('waiting') }) : t.waiting === false ? h('span', { class: 'tkl-tag ok', text: say('answered') }) : null,
              t.claimedBy ? h('span', { class: 'tkl-tag claim' }, [avatarOf(t.claimedBy, 14), say('claimedBy', { name: t.claimedBy.name })]) : h('span', { class: 'tkl-tag', text: say('unclaimed') }),
              t.priority && t.priority !== 'normal' ? h('span', { class: 'tkl-tag prio-' + t.priority, text: say('priority', { p: t.priority }) }) : null,
            ]),
          ]),
        ]);
        if (first) { row.classList.add('tkl-in'); row.style.animationDelay = Math.min(n, 8) * 35 + 'ms'; }
        listEl.appendChild(row);
      });
      if (total > shown.length && total >= limit) listEl.appendChild(h('p', { class: 'tkl-more', text: say('more', { n: limit }) }));
    }
    function loadList() {
      if (stopped) return Promise.resolve();
      listAt = Date.now();
      return api(base).then(function (r) {
        if (stopped) return;
        if (!r.ok) { setStatus(false); return; }
        setStatus(true);
        if (r.data.viewer) root.classList.toggle('tkl-manager', Boolean(r.data.viewer.manager));
        tickets = r.data.tickets || [];
        drawList(r.data.total || tickets.length, r.data.limit || 100);
        // The ticket that was open left the list (closed elsewhere): its pane is read once more to show it closed.
        if (openNumber && !tickets.some(function (t) { return t.number === openNumber; })) loadTicket(true);
      }).catch(function () { setStatus(false); });
    }

    // \u2500\u2500 one ticket
    function messageEl(m) {
      var kids = [];
      if (m.content) kids.push(richText(m.content));
      if (m.card) kids.push(h('div', { class: 'tkl-card', title: say('card') }, [richText(m.card)]));
      (m.embeds || []).forEach(function (e) {
        kids.push(h('div', { class: 'tkl-embed', style: e.color != null ? '--ec:#' + Number(e.color).toString(16).padStart(6, '0') : null }, [
          e.title ? h('b', { text: e.title }) : null,
          e.description ? richText(e.description) : null,
          e.fields ? h('small', { text: say('fields', { n: e.fields }) }) : null,
        ]));
      });
      (m.attachments || []).forEach(function (a) {
        kids.push(h('a', { class: 'tkl-file', href: a.url, target: '_blank', rel: 'noopener noreferrer nofollow' }, [h('span', { text: (a.image ? '\u{1F5BC} ' : '\u{1F4CE} ') + a.name }), a.size ? h('small', { text: Math.max(1, Math.round(a.size / 1024)) + ' KB' }) : null]));
      });
      (m.stickers || []).forEach(function (s) { kids.push(h('span', { class: 'tkl-tag', text: s })); });
      var staffish = m.author && m.author.bot;
      return h('div', { class: 'tkl-msg' + (staffish ? ' bot' : '') + (openData && m.author && m.author.id === openData.opener.id ? ' opener' : ''), 'data-id': m.id }, [
        avatarOf(m.author, 32),
        h('div', { class: 'tkl-msg-body' }, [
          h('div', { class: 'tkl-msg-head' }, [h('b', { text: (m.author && m.author.name) || '?' }), m.author && m.author.bot ? h('span', { class: 'tkl-badge', text: 'BOT' }) : null, h('time', { datetime: m.createdAt, text: clock(m.createdAt) }), m.edited ? h('small', { text: say('edited') }) : null]),
        ].concat(kids)),
      ]);
    }
    function hold(on) {
      // While a ticket is open the page is not drawn again under the person (a change of the server's settings waits until it is closed).
      if (on) root.setAttribute('data-dash-hold', ''); else root.removeAttribute('data-dash-hold');
    }
    function act(action, extra, button) {
      if (!openNumber) return Promise.resolve(null);
      if (button) { button.disabled = true; button.classList.add('dgl-busy'); }
      return api(base, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.assign({ action: action, ticket: openNumber }, extra || {})) })
        .then(function (r) {
          toast(r.data.message || (r.ok ? '' : say('failed')), !r.ok);
          if (r.ok) { loadTicket(true); loadList(); }
          return r;
        })
        .catch(function () { toast(say('failed'), true); return null; })
        .finally(function () { if (button) { button.disabled = false; button.classList.remove('dgl-busy'); } });
    }
    var toastTimer = 0;
    function toast(message, bad) {
      if (!message) return;
      // The shared toast of the dashboard (inside the margins, above the save bar, read by screen readers); the line in the pane without it.
      if (window.dglToast) { window.dglToast(message, { kind: bad ? 'error' : 'ok' }); return; }
      var el = pane.querySelector('[data-tkl-toast]');
      if (!el) return;
      if (window.dglMotion) window.dglMotion.stay(el);
      el.textContent = message;
      el.className = 'tkl-toast' + (bad ? ' bad' : '');
      el.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { if (window.dglMotion) window.dglMotion.hide(el); else el.hidden = true; }, 4000);
    }
    function drawPane(data, stale) {
      var t = data.ticket;
      openData = t;
      var list = pane.querySelector('[data-tkl-msgs]');
      var composer = pane.querySelector('[data-tkl-reply]');
      // The frame of the ticket is drawn once; later reads only add the new messages (the box being typed in stays as it is).
      if (!list || pane.getAttribute('data-number') !== String(t.number)) {
        pane.textContent = '';
        pane.setAttribute('data-number', String(t.number));
        list = h('div', { class: 'tkl-msgs', 'data-tkl-msgs': '', role: 'log', 'aria-live': 'polite' });
        pane.appendChild(h('header', { class: 'tkl-head', 'data-tkl-head': '' }));
        pane.appendChild(h('div', { class: 'tkl-actions', 'data-tkl-actions': '' }));
        pane.appendChild(list);
        pane.appendChild(h('div', { class: 'tkl-toast', 'data-tkl-toast': '', hidden: true, role: 'status' }));
        composer = h('div', { class: 'tkl-reply', 'data-tkl-reply': '' });
        pane.appendChild(composer);
        drawComposer(composer, t);
      }
      drawHead(pane.querySelector('[data-tkl-head]'), t);
      drawActions(pane.querySelector('[data-tkl-actions]'), t);
      composer.hidden = !(t.canAct && t.status === 'open' && !viewOnly);
      var note = pane.querySelector('[data-tkl-note]');
      var noteText = t.status !== 'open' ? say('closedNote') : t.channelGone ? say('channelGone') : viewOnly ? say('viewOnly') : !t.canAct ? say('noAccess') : stale ? say('stale') : '';
      if (noteText) {
        if (!note) { note = h('p', { class: 'tkl-note', 'data-tkl-note': '' }); pane.insertBefore(note, list); }
        note.textContent = noteText;
      } else if (note) note.remove();
      var atBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 60;
      var have = {};
      list.querySelectorAll('[data-id]').forEach(function (el) { have[el.getAttribute('data-id')] = el; });
      var wanted = (data.messages || []).map(function (m) { return m.id; }).join(',');
      if (wanted !== drawnIds) {
        var fresh = {};
        (data.messages || []).forEach(function (m) { fresh[m.id] = true; });
        Object.keys(have).forEach(function (id) { if (!fresh[id]) have[id].remove(); });
        (data.messages || []).forEach(function (m) {
          var el = have[m.id];
          if (el) { list.appendChild(el); return; }
          var made = messageEl(m);
          if (drawnIds) made.classList.add('tkl-new');
          list.appendChild(made);
        });
        if (!data.messages || !data.messages.length) list.appendChild(h('p', { class: 'tkl-empty-msgs', text: say('noMessages') }));
        else { var empty = list.querySelector('.tkl-empty-msgs'); if (empty) empty.remove(); }
        if (atBottom || !drawnIds) list.scrollTop = list.scrollHeight;
        drawnIds = wanted;
      }
      if (t.lastMessageAt) { seen[t.number] = Date.parse(t.lastMessageAt); saveSeen(); }
    }
    function drawHead(head, t) {
      head.textContent = '';
      head.appendChild(h('button', { type: 'button', class: 'tkl-back', onclick: closePane, 'aria-label': say('back') }, ['\u2190 ' + say('back')]));
      head.appendChild(h('div', { class: 'tkl-head-main' }, [
        avatarOf(t.opener, 40),
        h('div', null, [
          h('div', { class: 'tkl-head-title' }, [h('b', { text: '#' + String(t.number).padStart(4, '0') }), h('span', { text: (t.category && t.category.label) || '' }), t.channelName ? h('code', { text: '#' + t.channelName }) : null]),
          h('div', { class: 'tkl-head-sub', text: [(t.opener && t.opener.name) + (t.opener && t.opener.username ? ' (@' + t.opener.username + ')' : ''), say('opened', { time: ago(t.openedAt) })].join(' \xB7 ') }),
        ]),
        t.channelId && !t.channelGone ? h('a', { class: 'btn btn-ghost btn-sm tkl-discord', href: 'https://discord.com/channels/' + guild + '/' + t.channelId, target: '_blank', rel: 'noopener' }, [say('openDiscord') + ' \u2197']) : null,
      ]));
    }
    function drawActions(box, t) {
      // Rebuilt only when something it shows changed, so a reason or a member ID being typed is kept.
      var key = [t.status, t.canAct, t.claimedBy && t.claimedBy.id, (t.members || []).map(function (m) { return m.id; }).join('.'), viewOnly].join('|');
      if (box.getAttribute('data-key') === key) return;
      if (box.contains(document.activeElement) && box.getAttribute('data-key')) return;
      box.setAttribute('data-key', key);
      box.textContent = '';
      var can = t.canAct && t.status === 'open' && !viewOnly;
      box.appendChild(h('div', { class: 'tkl-claim' }, [
        t.claimedBy ? h('span', { class: 'tkl-tag claim' }, [avatarOf(t.claimedBy, 16), say('claimedBy', { name: t.claimedBy.name })]) : h('span', { class: 'tkl-tag', text: say('unclaimed') }),
        can ? (t.claimedBy
          ? h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function (e) { act('unclaim', null, e.currentTarget); } }, [say('unclaim')])
          : h('button', { type: 'button', class: 'btn btn-accent btn-sm', onclick: function (e) { act('claim', null, e.currentTarget); } }, [say('claim')])) : null,
      ]));
      var members = h('div', { class: 'tkl-members' }, [(t.members || []).length ? h('span', { class: 'tkl-members-label', text: say('members') }) : null]);
      (t.members || []).forEach(function (m) {
        members.appendChild(h('span', { class: 'tkl-chip' }, [avatarOf(m, 16), m.name, can ? h('button', { type: 'button', class: 'tkl-x', title: say('remove', { name: m.name }), 'aria-label': say('remove', { name: m.name }), onclick: function (e) { act('remove', { target: m.id }, e.currentTarget); } }, ['\xD7']) : null]));
      });
      box.appendChild(members);
      if (!can) return;
      var addInput = h('input', { type: 'text', placeholder: say('addPlaceholder'), 'aria-label': say('addMember'), maxlength: 40, inputmode: 'text', autocomplete: 'off' });
      var addForm = h('details', { class: 'tkl-more-act' }, [
        h('summary', { text: say('addMember') }),
        h('div', { class: 'tkl-inline' }, [addInput, h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function (e) { var v = addInput.value.trim(); if (!v) { addInput.focus(); return; } act('add', { target: v }, e.currentTarget).then(function (r) { if (r && r.ok) addInput.value = ''; }); } }, [say('add')])]),
      ]);
      var reason = h('input', { type: 'text', placeholder: t.closeRequiresReason ? say('closeReasonRequired') : say('closeReason'), 'aria-label': say('closeReason'), maxlength: 500, required: t.closeRequiresReason ? true : null });
      var closeForm = h('details', { class: 'tkl-more-act tkl-close' }, [
        h('summary', { text: say('close') }),
        h('div', { class: 'tkl-inline' }, [reason, h('button', { type: 'button', class: 'btn btn-danger btn-sm', onclick: function (e) { if (t.closeRequiresReason && !reason.value.trim()) { reason.focus(); return; } act('close', { reason: reason.value }, e.currentTarget); } }, [say('closeConfirm')])]),
        h('small', { text: say('closeHint') }),
      ]);
      box.appendChild(h('div', { class: 'tkl-act-row' }, [addForm, closeForm]));
    }
    function drawComposer(box, t) {
      var area = h('textarea', { rows: 2, 'data-fixed-size': '', maxlength: 1800, 'data-ac': 'roles,channels,emojis', placeholder: say('replyPlaceholder'), 'aria-label': say('replyPlaceholder') });
      var counter = h('small', { class: 'tkl-counter', text: '0/1800' });
      var button = h('button', { type: 'button', class: 'btn btn-accent btn-sm' }, [say('send')]);
      function send() {
        var content = area.value.trim();
        if (!content || button.disabled) return;
        button.disabled = true;
        button.style.minWidth = button.offsetWidth + 'px';
        button.textContent = say('sending');
        button.classList.add('dgl-busy');
        act('reply', { content: content }).then(function (r) {
          if (r && r.ok) { area.value = ''; counter.textContent = '0/1800'; }
        }).finally(function () { button.disabled = false; button.classList.remove('dgl-busy'); button.textContent = say('send'); button.style.minWidth = ''; area.focus(); });
      }
      area.addEventListener('input', function () { counter.textContent = area.value.length + '/1800'; area.style.height = 'auto'; area.style.height = Math.min(area.scrollHeight, 180) + 'px'; });
      area.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); } });
      button.addEventListener('click', send);
      box.appendChild(area);
      box.appendChild(h('div', { class: 'tkl-reply-foot' }, [h('small', { text: say('replyNote') }), counter, button]));
    }
    var loadingTicket = false;
    function loadTicket(force) {
      if (!openNumber || stopped || (loadingTicket && !force)) return Promise.resolve();
      loadingTicket = true;
      var number = openNumber;
      return api(base + '?ticket=' + number).then(function (r) {
        if (stopped || number !== openNumber) return;
        if (!r.ok) { if (!pane.querySelector('[data-tkl-msgs]')) { pane.textContent = ''; pane.appendChild(h('p', { class: 'tkl-note', text: r.data.message || say('failed') })); } return; }
        drawPane(r.data, r.data.stale);
      }).catch(function () {}).finally(function () { loadingTicket = false; });
    }
    // While a ticket is read for the first time its place shows the shape of it (the same moving highlight as the rest of the dashboard).
    function paneSkeleton() {
      var bar = function (cls) { return h('span', { class: 'sk ' + cls }); };
      var msg = function () { return h('div', { class: 'tkl-sk-msg' }, [bar('tkl-sk-av'), h('div', { class: 'tkl-sk-lines' }, [bar('tkl-sk-l1'), bar('tkl-sk-l2')])]); };
      var box = h('div', { class: 'tkl-sk', 'aria-hidden': 'true' }, [h('div', { class: 'tkl-sk-head' }, [bar('tkl-sk-av big'), h('div', { class: 'tkl-sk-lines' }, [bar('tkl-sk-l1'), bar('tkl-sk-l2')])]), msg(), msg(), msg()]);
      var wrap = h('div', { role: 'status', 'aria-label': say('loading') }, [box]);
      return wrap;
    }
    function openTicket(number) {
      if (openNumber === number) return;
      openNumber = number;
      drawnIds = '';
      hold(true);
      body.classList.add('has-open');
      pane.removeAttribute('data-number');
      pane.textContent = '';
      pane.appendChild(paneSkeleton());
      listEl.querySelectorAll('.tkl-row').forEach(function (row) { var on = row.getAttribute('data-number') === String(number); row.classList.toggle('on', on); if (on) { row.classList.remove('unread'); var dot = row.querySelector('.tkl-dot'); if (dot) dot.remove(); } });
      try { history.replaceState(history.state, '', location.pathname + location.search.replace(/([?&])ticket=\\d+&?/, '$1').replace(/[?&]$/, '') + '#ticket-' + number); } catch (e) { /* fine */ }
      loadTicket(true).then(function () { if (window.matchMedia('(max-width: 900px)').matches) root.scrollIntoView({ block: 'start' }); });
    }
    function closePane() {
      openNumber = null; openData = null; drawnIds = '';
      hold(false);
      body.classList.remove('has-open');
      pane.removeAttribute('data-number');
      pane.textContent = '';
      pane.appendChild(h('div', { class: 'tkl-pick' }, [h('p', { text: say('pick') })]));
      try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) { /* fine */ }
      drawList(tickets.length, 100);
    }

    // \u2500\u2500 controls
    root.querySelectorAll('[data-tkl-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        filter = b.getAttribute('data-tkl-filter');
        root.querySelectorAll('[data-tkl-filter]').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on ? 'true' : 'false'); });
        drawList(tickets.length, 100);
      });
    });
    search.addEventListener('input', function () { drawList(tickets.length, 100); });

    // \u2500\u2500 keeping it current: the bot's signal at once, otherwise every few seconds (less often while the signals arrive)
    var signalTimer = 0;
    function onSignal() {
      if (stopped) return;
      lastSignal = Date.now();
      clearTimeout(signalTimer);
      signalTimer = setTimeout(function () { loadList(); if (openNumber) loadTicket(); }, 250);
    }
    document.addEventListener('dgl:tickets', onSignal);
    function tick() {
      if (stopped) return;
      if (!document.body.contains(root)) { stop(); return; }
      if (document.hidden) return;
      var every = Date.now() - lastSignal < 120000 ? 20000 : 8000;
      if (Date.now() - listAt >= every) loadList();
      if (openNumber) loadTicket();
      if (statusEl && !statusEl.classList.contains('off') && listAt) statusText.textContent = say('updated', { time: ago(new Date(listAt).toISOString()) });
    }
    timers.push(setInterval(tick, 4000));
    function onVisible() { if (!document.hidden && !stopped) { loadList(); if (openNumber) loadTicket(); } }
    document.addEventListener('visibilitychange', onVisible);
    function stop() {
      stopped = true;
      timers.forEach(clearInterval);
      clearTimeout(signalTimer);
      document.removeEventListener('dgl:tickets', onSignal);
      document.removeEventListener('visibilitychange', onVisible);
      if (window.__tklStop === stop) window.__tklStop = null;
    }
    window.__tklStop = stop;
    // Who is looking, for "Mine" (the tickets they claimed).
    me = root.getAttribute('data-me');
    loadList().then(function () {
      var m = /#ticket-(\\d+)/.exec(location.hash || '');
      if (m) openTicket(Number(m[1]));
    });
  })();
<\/script> `], ["", " ", '<div class="tkl" role="region" data-tkl', "", "", "", "", '> <script type="application/json" data-tkl-text>', '<\/script> <div class="tkl-bar"> <span class="tkl-live" data-tkl-status><i aria-hidden="true"></i><span data-tkl-status-text>', '</span></span> <div class="tkl-filters" role="tablist"', '> <button type="button" class="tkl-filter on" data-tkl-filter="all" role="tab" aria-selected="true">', ' <em data-tkl-count="all">', '</em></button> <button type="button" class="tkl-filter" data-tkl-filter="waiting" role="tab" aria-selected="false">', ' <em data-tkl-count="waiting"></em></button> <button type="button" class="tkl-filter" data-tkl-filter="unclaimed" role="tab" aria-selected="false">', ' <em data-tkl-count="unclaimed"></em></button> <button type="button" class="tkl-filter" data-tkl-filter="mine" role="tab" aria-selected="false">', ' <em data-tkl-count="mine"></em></button> </div> <input type="search" class="tkl-search" data-tkl-search', "", ' autocomplete="off"> </div> <div class="tkl-body" data-tkl-body> <div class="tkl-list" data-tkl-list aria-live="polite"> ', ' </div> <div class="tkl-pane" data-tkl-pane> <div class="tkl-pick">', "<p>", `</p></div> </div> </div> </div> <script>
  (function () {
    var root = document.querySelector('#dgl-content [data-tkl]');
    if (!root || root.dataset.bound) return;
    root.dataset.bound = '1';
    // A previous copy of this view (the page was drawn again or reached again from the menu) stops: one view runs at a time.
    if (window.__tklStop) { try { window.__tklStop(); } catch (e) { /* already gone */ } }
    var T = {};
    try { T = JSON.parse(root.querySelector('[data-tkl-text]').textContent || '{}'); } catch (e) { T = {}; }
    var guild = root.getAttribute('data-guild');
    var lang = root.getAttribute('data-lang') || 'en';
    var viewOnly = root.hasAttribute('data-view-only');
    var base = '/dash/guild/' + guild + '/tickets-live';
    var listEl = root.querySelector('[data-tkl-list]');
    var pane = root.querySelector('[data-tkl-pane]');
    var body = root.querySelector('[data-tkl-body]');
    var statusEl = root.querySelector('[data-tkl-status]');
    var statusText = root.querySelector('[data-tkl-status-text]');
    var search = root.querySelector('[data-tkl-search]');
    var me = null;
    var tickets = [];
    var filter = 'all';
    var openNumber = null;
    var openData = null;
    var drawnIds = '';
    var listShown = false;
    var lastSignal = 0;
    var listAt = 0;
    var timers = [];
    var stopped = false;
    var SEEN_KEY = 'tkl:seen:' + guild;
    var seen = {};
    try { seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}') || {}; } catch (e) { seen = {}; }
    function saveSeen() { try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch (e) { /* private window */ } }
    function say(key, vars) {
      var s = T[key] || key;
      if (vars) s = s.replace(/\\\\{(\\\\w+)\\\\}/g, function (w, k) { return k in vars ? String(vars[k]) : w; });
      return s;
    }
    // The age of a moment in the short form of the dashboard: 5m ago, 1h 5m ago, in 2d.
    function ago(iso) {
      if (!iso) return '';
      var s = Math.round((Date.parse(iso) - Date.now()) / 1000);
      var abs = Math.abs(s);
      if (abs < 45) return say('justNow');
      var short = window.dglDuration(abs, { locale: lang });
      return s < 0 ? say('ago', { a: short }) : say('inTime', { a: short });
    }
    function clock(iso) {
      try { return new Date(iso).toLocaleString(lang, { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }); } catch (e) { return iso; }
    }
    function h(tag, attrs, kids) {
      var el = document.createElement(tag);
      if (attrs) for (var k in attrs) {
        if (attrs[k] == null || attrs[k] === false) continue;
        if (k === 'class') el.className = attrs[k];
        else if (k === 'text') el.textContent = attrs[k];
        else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]);
        else el.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
      }
      (kids || []).forEach(function (kid) { if (kid != null && kid !== false) el.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid); });
      return el;
    }
    function avatarOf(person, size) {
      var id = person && person.id ? String(person.id) : '0';
      var src = person && person.avatar ? person.avatar : 'https://cdn.discordapp.com/embed/avatars/' + (Number(id.slice(-3)) % 6) + '.png';
      return h('img', { class: 'tkl-av', src: src, alt: '', width: size || 28, height: size || 28, loading: 'lazy', referrerpolicy: 'no-referrer' });
    }
    // Text with its line breaks, and its web links as links. Never HTML from the message.
    // Discord's headings (# text) are drawn bold and its small lines (-# text) small, as Discord shows them.
    function richText(value) {
      var wrap = h('div', { class: 'tkl-text' });
      String(value || '').split('\\\\n').forEach(function (line, n) {
        if (n) wrap.appendChild(document.createTextNode('\\\\n'));
        var target = wrap;
        var small = /^-#\\\\s+/.exec(line);
        var head = !small && /^#{1,3}\\\\s+/.exec(line);
        if (small || head) { target = h('span', { class: small ? 'tkl-small' : 'tkl-h' }); wrap.appendChild(target); line = line.slice((small || head)[0].length); }
        line.split(/(https?:\\\\/\\\\/[^\\\\s<>"]+)/g).forEach(function (part, i) {
          if (i % 2) target.appendChild(h('a', { href: part, target: '_blank', rel: 'noopener noreferrer nofollow', text: part.length > 80 ? part.slice(0, 77) + '\u2026' : part }));
          else if (part) target.appendChild(document.createTextNode(part));
        });
      });
      return wrap;
    }
    function api(url, init) {
      var options = Object.assign({ credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' } }, init || {});
      // A call that never answers ends after 30 s, so a button is never left saying "Sending...".
      if (!options.signal && window.AbortSignal && AbortSignal.timeout) options.signal = AbortSignal.timeout(30000);
      return fetch(url, options).then(function (res) {
        return res.json().catch(function () { return null; }).then(function (data) { return { ok: res.ok && data && data.ok, status: res.status, data: data || {} }; });
      });
    }
    function setStatus(ok) {
      statusEl.classList.toggle('off', !ok);
      statusText.textContent = ok ? say('updated', { time: ago(new Date().toISOString()) }) : say('offline');
    }
    function isUnread(t) {
      if (!t.lastMessageAt) return false;
      if (t.lastAuthor && t.lastAuthor.staffReply && t.lastAuthor.id) return false;
      var at = seen[t.number];
      return !at ? Boolean(t.waiting) : Date.parse(t.lastMessageAt) > at;
    }
    function matches(t) {
      if (filter === 'waiting' && !t.waiting) return false;
      if (filter === 'unclaimed' && t.claimedBy) return false;
      if (filter === 'mine' && !(t.claimedBy && me && t.claimedBy.id === me)) return false;
      var q = (search.value || '').trim().toLowerCase().replace(/^#/, '');
      if (!q) return true;
      return String(t.number).indexOf(q) === 0 || [t.opener && t.opener.name, t.opener && t.opener.username, t.category && t.category.label, t.channelName].some(function (v) { return v && String(v).toLowerCase().indexOf(q) !== -1; });
    }
    function counts() {
      var c = { all: tickets.length, waiting: 0, unclaimed: 0, mine: 0 };
      tickets.forEach(function (t) { if (t.waiting) c.waiting++; if (!t.claimedBy) c.unclaimed++; if (me && t.claimedBy && t.claimedBy.id === me) c.mine++; });
      root.querySelectorAll('[data-tkl-count]').forEach(function (el) { var n = c[el.getAttribute('data-tkl-count')]; el.textContent = n ? String(n) : (el.getAttribute('data-tkl-count') === 'all' ? '0' : ''); });
    }
    function drawList(total, limit) {
      counts();
      // The most recent conversation on top, as in a chat.
      var when = function (t) { return Date.parse(t.lastMessageAt || t.openedAt || 0) || 0; };
      var shown = tickets.filter(matches).sort(function (a, b) { return when(b) - when(a); });
      listEl.textContent = '';
      if (!tickets.length) { listEl.appendChild(h('div', { class: 'tkl-empty' }, [h('p', { text: say('empty') })])); return; }
      if (!shown.length) { listEl.appendChild(h('div', { class: 'tkl-empty' }, [h('p', { text: say('emptyFilter') })])); return; }
      var first = !listShown;
      listShown = true;
      shown.forEach(function (t, n) {
        var unread = isUnread(t) && t.number !== openNumber;
        var row = h('button', { type: 'button', class: 'tkl-row' + (t.number === openNumber ? ' on' : '') + (unread ? ' unread' : ''), 'data-number': t.number, 'aria-current': t.number === openNumber ? 'true' : null, onclick: function () { openTicket(t.number); } }, [
          avatarOf(t.opener, 34),
          h('div', { class: 'tkl-row-main' }, [
            h('div', { class: 'tkl-row-top' }, [
              h('b', { class: 'tkl-num', text: '#' + String(t.number).padStart(4, '0') }),
              h('span', { class: 'tkl-cat', text: ((t.category && t.category.emoji && t.category.emoji.length <= 8 ? t.category.emoji + ' ' : '') + ((t.category && t.category.label) || '\u2014')) }),
              unread ? h('i', { class: 'tkl-dot', title: say('unread'), 'aria-label': say('unread') }) : null,
              h('time', { class: 'tkl-age', datetime: t.lastMessageAt || t.openedAt, title: say('opened', { time: ago(t.openedAt) }), text: ago(t.lastMessageAt || t.openedAt) }),
            ]),
            h('div', { class: 'tkl-row-who', text: (t.opener && t.opener.name) || '' }),
            h('div', { class: 'tkl-row-tags' }, [
              t.waiting === true ? h('span', { class: 'tkl-tag wait', text: say('waiting') }) : t.waiting === false ? h('span', { class: 'tkl-tag ok', text: say('answered') }) : null,
              t.claimedBy ? h('span', { class: 'tkl-tag claim' }, [avatarOf(t.claimedBy, 14), say('claimedBy', { name: t.claimedBy.name })]) : h('span', { class: 'tkl-tag', text: say('unclaimed') }),
              t.priority && t.priority !== 'normal' ? h('span', { class: 'tkl-tag prio-' + t.priority, text: say('priority', { p: t.priority }) }) : null,
            ]),
          ]),
        ]);
        if (first) { row.classList.add('tkl-in'); row.style.animationDelay = Math.min(n, 8) * 35 + 'ms'; }
        listEl.appendChild(row);
      });
      if (total > shown.length && total >= limit) listEl.appendChild(h('p', { class: 'tkl-more', text: say('more', { n: limit }) }));
    }
    function loadList() {
      if (stopped) return Promise.resolve();
      listAt = Date.now();
      return api(base).then(function (r) {
        if (stopped) return;
        if (!r.ok) { setStatus(false); return; }
        setStatus(true);
        if (r.data.viewer) root.classList.toggle('tkl-manager', Boolean(r.data.viewer.manager));
        tickets = r.data.tickets || [];
        drawList(r.data.total || tickets.length, r.data.limit || 100);
        // The ticket that was open left the list (closed elsewhere): its pane is read once more to show it closed.
        if (openNumber && !tickets.some(function (t) { return t.number === openNumber; })) loadTicket(true);
      }).catch(function () { setStatus(false); });
    }

    // \u2500\u2500 one ticket
    function messageEl(m) {
      var kids = [];
      if (m.content) kids.push(richText(m.content));
      if (m.card) kids.push(h('div', { class: 'tkl-card', title: say('card') }, [richText(m.card)]));
      (m.embeds || []).forEach(function (e) {
        kids.push(h('div', { class: 'tkl-embed', style: e.color != null ? '--ec:#' + Number(e.color).toString(16).padStart(6, '0') : null }, [
          e.title ? h('b', { text: e.title }) : null,
          e.description ? richText(e.description) : null,
          e.fields ? h('small', { text: say('fields', { n: e.fields }) }) : null,
        ]));
      });
      (m.attachments || []).forEach(function (a) {
        kids.push(h('a', { class: 'tkl-file', href: a.url, target: '_blank', rel: 'noopener noreferrer nofollow' }, [h('span', { text: (a.image ? '\u{1F5BC} ' : '\u{1F4CE} ') + a.name }), a.size ? h('small', { text: Math.max(1, Math.round(a.size / 1024)) + ' KB' }) : null]));
      });
      (m.stickers || []).forEach(function (s) { kids.push(h('span', { class: 'tkl-tag', text: s })); });
      var staffish = m.author && m.author.bot;
      return h('div', { class: 'tkl-msg' + (staffish ? ' bot' : '') + (openData && m.author && m.author.id === openData.opener.id ? ' opener' : ''), 'data-id': m.id }, [
        avatarOf(m.author, 32),
        h('div', { class: 'tkl-msg-body' }, [
          h('div', { class: 'tkl-msg-head' }, [h('b', { text: (m.author && m.author.name) || '?' }), m.author && m.author.bot ? h('span', { class: 'tkl-badge', text: 'BOT' }) : null, h('time', { datetime: m.createdAt, text: clock(m.createdAt) }), m.edited ? h('small', { text: say('edited') }) : null]),
        ].concat(kids)),
      ]);
    }
    function hold(on) {
      // While a ticket is open the page is not drawn again under the person (a change of the server's settings waits until it is closed).
      if (on) root.setAttribute('data-dash-hold', ''); else root.removeAttribute('data-dash-hold');
    }
    function act(action, extra, button) {
      if (!openNumber) return Promise.resolve(null);
      if (button) { button.disabled = true; button.classList.add('dgl-busy'); }
      return api(base, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.assign({ action: action, ticket: openNumber }, extra || {})) })
        .then(function (r) {
          toast(r.data.message || (r.ok ? '' : say('failed')), !r.ok);
          if (r.ok) { loadTicket(true); loadList(); }
          return r;
        })
        .catch(function () { toast(say('failed'), true); return null; })
        .finally(function () { if (button) { button.disabled = false; button.classList.remove('dgl-busy'); } });
    }
    var toastTimer = 0;
    function toast(message, bad) {
      if (!message) return;
      // The shared toast of the dashboard (inside the margins, above the save bar, read by screen readers); the line in the pane without it.
      if (window.dglToast) { window.dglToast(message, { kind: bad ? 'error' : 'ok' }); return; }
      var el = pane.querySelector('[data-tkl-toast]');
      if (!el) return;
      if (window.dglMotion) window.dglMotion.stay(el);
      el.textContent = message;
      el.className = 'tkl-toast' + (bad ? ' bad' : '');
      el.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { if (window.dglMotion) window.dglMotion.hide(el); else el.hidden = true; }, 4000);
    }
    function drawPane(data, stale) {
      var t = data.ticket;
      openData = t;
      var list = pane.querySelector('[data-tkl-msgs]');
      var composer = pane.querySelector('[data-tkl-reply]');
      // The frame of the ticket is drawn once; later reads only add the new messages (the box being typed in stays as it is).
      if (!list || pane.getAttribute('data-number') !== String(t.number)) {
        pane.textContent = '';
        pane.setAttribute('data-number', String(t.number));
        list = h('div', { class: 'tkl-msgs', 'data-tkl-msgs': '', role: 'log', 'aria-live': 'polite' });
        pane.appendChild(h('header', { class: 'tkl-head', 'data-tkl-head': '' }));
        pane.appendChild(h('div', { class: 'tkl-actions', 'data-tkl-actions': '' }));
        pane.appendChild(list);
        pane.appendChild(h('div', { class: 'tkl-toast', 'data-tkl-toast': '', hidden: true, role: 'status' }));
        composer = h('div', { class: 'tkl-reply', 'data-tkl-reply': '' });
        pane.appendChild(composer);
        drawComposer(composer, t);
      }
      drawHead(pane.querySelector('[data-tkl-head]'), t);
      drawActions(pane.querySelector('[data-tkl-actions]'), t);
      composer.hidden = !(t.canAct && t.status === 'open' && !viewOnly);
      var note = pane.querySelector('[data-tkl-note]');
      var noteText = t.status !== 'open' ? say('closedNote') : t.channelGone ? say('channelGone') : viewOnly ? say('viewOnly') : !t.canAct ? say('noAccess') : stale ? say('stale') : '';
      if (noteText) {
        if (!note) { note = h('p', { class: 'tkl-note', 'data-tkl-note': '' }); pane.insertBefore(note, list); }
        note.textContent = noteText;
      } else if (note) note.remove();
      var atBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 60;
      var have = {};
      list.querySelectorAll('[data-id]').forEach(function (el) { have[el.getAttribute('data-id')] = el; });
      var wanted = (data.messages || []).map(function (m) { return m.id; }).join(',');
      if (wanted !== drawnIds) {
        var fresh = {};
        (data.messages || []).forEach(function (m) { fresh[m.id] = true; });
        Object.keys(have).forEach(function (id) { if (!fresh[id]) have[id].remove(); });
        (data.messages || []).forEach(function (m) {
          var el = have[m.id];
          if (el) { list.appendChild(el); return; }
          var made = messageEl(m);
          if (drawnIds) made.classList.add('tkl-new');
          list.appendChild(made);
        });
        if (!data.messages || !data.messages.length) list.appendChild(h('p', { class: 'tkl-empty-msgs', text: say('noMessages') }));
        else { var empty = list.querySelector('.tkl-empty-msgs'); if (empty) empty.remove(); }
        if (atBottom || !drawnIds) list.scrollTop = list.scrollHeight;
        drawnIds = wanted;
      }
      if (t.lastMessageAt) { seen[t.number] = Date.parse(t.lastMessageAt); saveSeen(); }
    }
    function drawHead(head, t) {
      head.textContent = '';
      head.appendChild(h('button', { type: 'button', class: 'tkl-back', onclick: closePane, 'aria-label': say('back') }, ['\u2190 ' + say('back')]));
      head.appendChild(h('div', { class: 'tkl-head-main' }, [
        avatarOf(t.opener, 40),
        h('div', null, [
          h('div', { class: 'tkl-head-title' }, [h('b', { text: '#' + String(t.number).padStart(4, '0') }), h('span', { text: (t.category && t.category.label) || '' }), t.channelName ? h('code', { text: '#' + t.channelName }) : null]),
          h('div', { class: 'tkl-head-sub', text: [(t.opener && t.opener.name) + (t.opener && t.opener.username ? ' (@' + t.opener.username + ')' : ''), say('opened', { time: ago(t.openedAt) })].join(' \xB7 ') }),
        ]),
        t.channelId && !t.channelGone ? h('a', { class: 'btn btn-ghost btn-sm tkl-discord', href: 'https://discord.com/channels/' + guild + '/' + t.channelId, target: '_blank', rel: 'noopener' }, [say('openDiscord') + ' \u2197']) : null,
      ]));
    }
    function drawActions(box, t) {
      // Rebuilt only when something it shows changed, so a reason or a member ID being typed is kept.
      var key = [t.status, t.canAct, t.claimedBy && t.claimedBy.id, (t.members || []).map(function (m) { return m.id; }).join('.'), viewOnly].join('|');
      if (box.getAttribute('data-key') === key) return;
      if (box.contains(document.activeElement) && box.getAttribute('data-key')) return;
      box.setAttribute('data-key', key);
      box.textContent = '';
      var can = t.canAct && t.status === 'open' && !viewOnly;
      box.appendChild(h('div', { class: 'tkl-claim' }, [
        t.claimedBy ? h('span', { class: 'tkl-tag claim' }, [avatarOf(t.claimedBy, 16), say('claimedBy', { name: t.claimedBy.name })]) : h('span', { class: 'tkl-tag', text: say('unclaimed') }),
        can ? (t.claimedBy
          ? h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function (e) { act('unclaim', null, e.currentTarget); } }, [say('unclaim')])
          : h('button', { type: 'button', class: 'btn btn-accent btn-sm', onclick: function (e) { act('claim', null, e.currentTarget); } }, [say('claim')])) : null,
      ]));
      var members = h('div', { class: 'tkl-members' }, [(t.members || []).length ? h('span', { class: 'tkl-members-label', text: say('members') }) : null]);
      (t.members || []).forEach(function (m) {
        members.appendChild(h('span', { class: 'tkl-chip' }, [avatarOf(m, 16), m.name, can ? h('button', { type: 'button', class: 'tkl-x', title: say('remove', { name: m.name }), 'aria-label': say('remove', { name: m.name }), onclick: function (e) { act('remove', { target: m.id }, e.currentTarget); } }, ['\xD7']) : null]));
      });
      box.appendChild(members);
      if (!can) return;
      var addInput = h('input', { type: 'text', placeholder: say('addPlaceholder'), 'aria-label': say('addMember'), maxlength: 40, inputmode: 'text', autocomplete: 'off' });
      var addForm = h('details', { class: 'tkl-more-act' }, [
        h('summary', { text: say('addMember') }),
        h('div', { class: 'tkl-inline' }, [addInput, h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onclick: function (e) { var v = addInput.value.trim(); if (!v) { addInput.focus(); return; } act('add', { target: v }, e.currentTarget).then(function (r) { if (r && r.ok) addInput.value = ''; }); } }, [say('add')])]),
      ]);
      var reason = h('input', { type: 'text', placeholder: t.closeRequiresReason ? say('closeReasonRequired') : say('closeReason'), 'aria-label': say('closeReason'), maxlength: 500, required: t.closeRequiresReason ? true : null });
      var closeForm = h('details', { class: 'tkl-more-act tkl-close' }, [
        h('summary', { text: say('close') }),
        h('div', { class: 'tkl-inline' }, [reason, h('button', { type: 'button', class: 'btn btn-danger btn-sm', onclick: function (e) { if (t.closeRequiresReason && !reason.value.trim()) { reason.focus(); return; } act('close', { reason: reason.value }, e.currentTarget); } }, [say('closeConfirm')])]),
        h('small', { text: say('closeHint') }),
      ]);
      box.appendChild(h('div', { class: 'tkl-act-row' }, [addForm, closeForm]));
    }
    function drawComposer(box, t) {
      var area = h('textarea', { rows: 2, 'data-fixed-size': '', maxlength: 1800, 'data-ac': 'roles,channels,emojis', placeholder: say('replyPlaceholder'), 'aria-label': say('replyPlaceholder') });
      var counter = h('small', { class: 'tkl-counter', text: '0/1800' });
      var button = h('button', { type: 'button', class: 'btn btn-accent btn-sm' }, [say('send')]);
      function send() {
        var content = area.value.trim();
        if (!content || button.disabled) return;
        button.disabled = true;
        button.style.minWidth = button.offsetWidth + 'px';
        button.textContent = say('sending');
        button.classList.add('dgl-busy');
        act('reply', { content: content }).then(function (r) {
          if (r && r.ok) { area.value = ''; counter.textContent = '0/1800'; }
        }).finally(function () { button.disabled = false; button.classList.remove('dgl-busy'); button.textContent = say('send'); button.style.minWidth = ''; area.focus(); });
      }
      area.addEventListener('input', function () { counter.textContent = area.value.length + '/1800'; area.style.height = 'auto'; area.style.height = Math.min(area.scrollHeight, 180) + 'px'; });
      area.addEventListener('keydown', function (e) { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); } });
      button.addEventListener('click', send);
      box.appendChild(area);
      box.appendChild(h('div', { class: 'tkl-reply-foot' }, [h('small', { text: say('replyNote') }), counter, button]));
    }
    var loadingTicket = false;
    function loadTicket(force) {
      if (!openNumber || stopped || (loadingTicket && !force)) return Promise.resolve();
      loadingTicket = true;
      var number = openNumber;
      return api(base + '?ticket=' + number).then(function (r) {
        if (stopped || number !== openNumber) return;
        if (!r.ok) { if (!pane.querySelector('[data-tkl-msgs]')) { pane.textContent = ''; pane.appendChild(h('p', { class: 'tkl-note', text: r.data.message || say('failed') })); } return; }
        drawPane(r.data, r.data.stale);
      }).catch(function () {}).finally(function () { loadingTicket = false; });
    }
    // While a ticket is read for the first time its place shows the shape of it (the same moving highlight as the rest of the dashboard).
    function paneSkeleton() {
      var bar = function (cls) { return h('span', { class: 'sk ' + cls }); };
      var msg = function () { return h('div', { class: 'tkl-sk-msg' }, [bar('tkl-sk-av'), h('div', { class: 'tkl-sk-lines' }, [bar('tkl-sk-l1'), bar('tkl-sk-l2')])]); };
      var box = h('div', { class: 'tkl-sk', 'aria-hidden': 'true' }, [h('div', { class: 'tkl-sk-head' }, [bar('tkl-sk-av big'), h('div', { class: 'tkl-sk-lines' }, [bar('tkl-sk-l1'), bar('tkl-sk-l2')])]), msg(), msg(), msg()]);
      var wrap = h('div', { role: 'status', 'aria-label': say('loading') }, [box]);
      return wrap;
    }
    function openTicket(number) {
      if (openNumber === number) return;
      openNumber = number;
      drawnIds = '';
      hold(true);
      body.classList.add('has-open');
      pane.removeAttribute('data-number');
      pane.textContent = '';
      pane.appendChild(paneSkeleton());
      listEl.querySelectorAll('.tkl-row').forEach(function (row) { var on = row.getAttribute('data-number') === String(number); row.classList.toggle('on', on); if (on) { row.classList.remove('unread'); var dot = row.querySelector('.tkl-dot'); if (dot) dot.remove(); } });
      try { history.replaceState(history.state, '', location.pathname + location.search.replace(/([?&])ticket=\\\\d+&?/, '$1').replace(/[?&]$/, '') + '#ticket-' + number); } catch (e) { /* fine */ }
      loadTicket(true).then(function () { if (window.matchMedia('(max-width: 900px)').matches) root.scrollIntoView({ block: 'start' }); });
    }
    function closePane() {
      openNumber = null; openData = null; drawnIds = '';
      hold(false);
      body.classList.remove('has-open');
      pane.removeAttribute('data-number');
      pane.textContent = '';
      pane.appendChild(h('div', { class: 'tkl-pick' }, [h('p', { text: say('pick') })]));
      try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) { /* fine */ }
      drawList(tickets.length, 100);
    }

    // \u2500\u2500 controls
    root.querySelectorAll('[data-tkl-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        filter = b.getAttribute('data-tkl-filter');
        root.querySelectorAll('[data-tkl-filter]').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on ? 'true' : 'false'); });
        drawList(tickets.length, 100);
      });
    });
    search.addEventListener('input', function () { drawList(tickets.length, 100); });

    // \u2500\u2500 keeping it current: the bot's signal at once, otherwise every few seconds (less often while the signals arrive)
    var signalTimer = 0;
    function onSignal() {
      if (stopped) return;
      lastSignal = Date.now();
      clearTimeout(signalTimer);
      signalTimer = setTimeout(function () { loadList(); if (openNumber) loadTicket(); }, 250);
    }
    document.addEventListener('dgl:tickets', onSignal);
    function tick() {
      if (stopped) return;
      if (!document.body.contains(root)) { stop(); return; }
      if (document.hidden) return;
      var every = Date.now() - lastSignal < 120000 ? 20000 : 8000;
      if (Date.now() - listAt >= every) loadList();
      if (openNumber) loadTicket();
      if (statusEl && !statusEl.classList.contains('off') && listAt) statusText.textContent = say('updated', { time: ago(new Date(listAt).toISOString()) });
    }
    timers.push(setInterval(tick, 4000));
    function onVisible() { if (!document.hidden && !stopped) { loadList(); if (openNumber) loadTicket(); } }
    document.addEventListener('visibilitychange', onVisible);
    function stop() {
      stopped = true;
      timers.forEach(clearInterval);
      clearTimeout(signalTimer);
      document.removeEventListener('dgl:tickets', onSignal);
      document.removeEventListener('visibilitychange', onVisible);
      if (window.__tklStop === stop) window.__tklStop = null;
    }
    window.__tklStop = stop;
    // Who is looking, for "Mine" (the tickets they claimed).
    me = root.getAttribute('data-me');
    loadList().then(function () {
      var m = /#ticket-(\\\\d+)/.exec(location.hash || '');
      if (m) openTicket(Number(m[1]));
    });
  })();
<\/script> `])), renderComponent($$result, "DurationScript", $$DurationScript, {}), maybeRenderHead(), addAttribute(guildId, "data-guild"), addAttribute(me, "data-me"), addAttribute(lang, "data-lang"), addAttribute(viewOnly ? "1" : void 0, "data-view-only"), addAttribute(dt("Live tickets"), "aria-label"), unescapeHTML(JSON.stringify(text).replace(/</g, "\\u003c")), dt("Live"), addAttribute(dt("Filter the tickets"), "aria-label"), dt("All"), openCount, dt("Waiting"), dt("Unclaimed"), dt("Mine"), addAttribute(dt("Search by number or name"), "placeholder"), addAttribute(dt("Search by number or name"), "aria-label"), openCount === 0 ? renderTemplate`<div class="tkl-empty">${renderComponent($$result, "Icon", $$Icon, { "name": "ph:ticket", "width": "26", "height": "26" })}<p>${text.empty}</p></div>` : Array.from({ length: Math.min(openCount, 4) }).map(() => renderTemplate`<div class="tkl-skel" aria-hidden="true"><i></i><span></span></div>`), renderComponent($$result, "Icon", $$Icon, { "name": "ph:chat-circle-text-fill", "width": "28", "height": "28" }), text.pick);
}, "/home/runner/work/petto-web/petto-web/src/components/TicketLive.astro", void 0);

const DAY = 864e5;
const percent = (now, before) => !before ? now ? null : 0 : Math.round((now - before) / before * 1e3) / 10;
function summarizeTickets(tickets, ratings, now = Date.now()) {
  const open = tickets.filter((t) => t.status === "open");
  const within = (iso, days) => Boolean(iso) && new Date(iso).getTime() >= now - days * DAY;
  const closedWaits = tickets.filter((t) => t.status === "closed" && t.closed_at).map((t) => new Date(t.closed_at).getTime() - new Date(t.created_at).getTime()).filter((ms) => ms > 0);
  const between = (iso, from, to) => Boolean(iso) && new Date(iso).getTime() >= now - to * DAY && new Date(iso).getTime() < now - from * DAY;
  const opened7 = tickets.filter((t) => within(t.created_at, 7)).length;
  const closed7 = tickets.filter((t) => t.status === "closed" && within(t.closed_at, 7)).length;
  const stars = ratings.map((r) => Number(r.rating)).filter((n) => n >= 1 && n <= 5);
  return {
    total: tickets.length,
    open: open.length,
    unclaimed: open.filter((t) => !t.claimed_by).length,
    opened7,
    closed7,
    opened7Change: percent(opened7, tickets.filter((t) => between(t.created_at, 7, 14)).length),
    closed7Change: percent(closed7, tickets.filter((t) => t.status === "closed" && between(t.closed_at, 7, 14)).length),
    opened30: tickets.filter((t) => within(t.created_at, 30)).length,
    closed30: tickets.filter((t) => t.status === "closed" && within(t.closed_at, 30)).length,
    averageMinutesOpen: closedWaits.length ? Math.round(closedWaits.reduce((a, b) => a + b, 0) / closedWaits.length / 6e4) : null,
    averageRating: stars.length ? Math.round(stars.reduce((a, b) => a + b, 0) / stars.length * 10) / 10 : null,
    ratingCount: stars.length,
    days: lastDays(tickets, now, 14)
  };
}
function lastDays(tickets, now, count) {
  const day = (ms) => botDay(ms);
  const out = rangeDays(new Date(now), count).map((key) => ({ key, label: key.slice(5), opened: 0, closed: 0 }));
  const byKey = new Map(out.map((d) => [d.key, d]));
  for (const t of tickets) {
    const a = byKey.get(day(new Date(t.created_at).getTime()));
    if (a) a.opened += 1;
    if (t.status === "closed" && t.closed_at) {
      const b = byKey.get(day(new Date(t.closed_at).getTime()));
      if (b) b.closed += 1;
    }
  }
  return out.map(({ label, opened, closed }) => ({ label, opened, closed }));
}
function minutesText(minutes, locale) {
  if (minutes === null) return "-";
  return formatDuration(minutes * 60, { locale });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashTickets = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashTickets;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const dth = makeT(dashLang, true);
  const { user, guildId, guildName, guildIcon, customEmojis = [], categories, panels, settings, roles, channelCategories, textChannels, embedTemplateNames, forms, blacklist, openTickets, closedTickets = [], quickReplies = [], stats = null, saved, error, warnings = [], premiumActive, section, viewOnly = false, me = "" } = Astro2.props;
  const sectionMeta = { panels: dt("Ticket panels"), types: dt("Support types"), forms: dt("Ticket forms"), access: dt("Ticket access"), settings: dt("Ticket settings"), replies: dt("Quick replies"), open: dt("Live tickets") };
  const selectedSection = sectionMeta[section ?? ""] ? section ?? "" : "panels";
  const selectedTitle = sectionMeta[selectedSection];
  function channelName(id) {
    return textChannels.find((c) => c.id === id)?.name ?? id;
  }
  const ticketCategoryLimit = planLimits(premiumActive).ticketCategories;
  const ticketCategoryAtLimit = categories.length >= ticketCategoryLimit;
  const postedCount = panels.filter((p) => p.messageId).length;
  const showGuide = ["panels", "types", "settings"].includes(selectedSection);
  const buttonStyles = [
    { value: "primary", label: dt("Blue (main)"), color: "#5865f2" },
    { value: "secondary", label: dt("Gray"), color: "#80848e" },
    { value: "success", label: dt("Green"), color: "#23a559" },
    { value: "danger", label: dt("Red"), color: "#f23f43" }
  ];
  const presets = [
    { id: "classic", name: dt("Classic support"), icon: "ph:ticket-fill", color: "#a5ea7a", style: "button", title: dt("Support"), description: dt("Press a button to open a ticket. Our team will answer you as soon as possible."), footer: dt("One ticket per topic, please."), placeholder: "" },
    { id: "help", name: dt("Help center (dropdown)"), icon: "ph:list-bullets-fill", color: "#ffb86c", style: "select", title: dt("Help center"), description: dt("Choose a category from the menu and a private channel opens with the staff."), footer: dt("Replies can take a few minutes."), placeholder: dt("Choose the type of ticket...") },
    { id: "reports", name: dt("Reports"), icon: "ph:flag-fill", color: "#ff6b6b", style: "button", title: dt("Report a problem"), description: dt("Tell us about a member, a bug or something that is not right. Include proof if you have it."), footer: dt("Only the staff can see your ticket."), placeholder: "" },
    { id: "apply", name: dt("Applications"), icon: "ph:hand-waving-fill", color: "#f78fb3", style: "button", title: dt("Join the team"), description: dt("Want to help? Open a ticket and answer a few questions so we can get to know you."), footer: dt("We read every application."), placeholder: "" },
    { id: "minimal", name: dt("Minimal"), icon: "ph:minus-circle-fill", color: "#ffd563", style: "button", title: dt("Tickets"), description: dt("Press a button to talk to the staff."), footer: "", placeholder: "" }
  ];
  const ticketVars = {
    types: [{ tok: "{number}", desc: dt("Number of the ticket") }, { tok: "{username}", desc: dt("Name of the member") }, { tok: "{userid}", desc: dt("ID of the member") }, { tok: "{category}", desc: dt("Type of the ticket") }],
    settings: [{ tok: "{start}", desc: dt("When the staff hours start") }, { tok: "{end}", desc: dt("When the staff hours end") }, { tok: "{timezone}", desc: dt("Time zone of the staff hours") }],
    replies: [{ tok: "{username}", desc: dt("Name of the member") }, { tok: "{category}", desc: dt("Type of the ticket") }, { tok: "{server}", desc: dt("Name of the server") }, { tok: "{number}", desc: dt("Number of the ticket") }]
  };
  const hourDays = [
    { n: 1, label: dt("Mon") },
    { n: 2, label: dt("Tue") },
    { n: 3, label: dt("Wed") },
    { n: 4, label: dt("Thu") },
    { n: 5, label: dt("Fri") },
    { n: 6, label: dt("Sat") },
    { n: 0, label: dt("Sun") }
  ];
  const timezones = ["America/Bogota", "America/Mexico_City", "America/Lima", "America/Argentina/Buenos_Aires", "America/Santiago", "America/Sao_Paulo", "America/New_York", "America/Los_Angeles", "Europe/Madrid", "Europe/London", "UTC"];
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": selectedSection === "panels" ? "tickets" : `tickets-${selectedSection}`, "pageTitle": selectedTitle, "data-astro-cid-vusoyo76": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", "<h1 data-astro-cid-vusoyo76>", "", "</h1> ", "", " ", " ", " ", "", "", "", "", "", "", "", "", "", "", "", "", "", " <script>\n    // A variable chip puts its text where the cursor is in the text box of its reply (the box keeps its place while the chip is pressed).\n    (function () {\n      if (window.__tkVars) return;\n      window.__tkVars = true;\n      document.addEventListener('click', function (event) {\n        var chip = event.target && event.target.closest && event.target.closest('[data-tk-var]');\n        if (!chip) return;\n        var area = chip.closest('.dfx-field') && chip.closest('.dfx-field').querySelector('textarea');\n        if (!area || area.readOnly) return;\n        var start = area.selectionStart == null ? area.value.length : area.selectionStart;\n        var end = area.selectionEnd == null ? start : area.selectionEnd;\n        area.setRangeText(chip.getAttribute('data-tk-var'), start, end, 'end');\n        area.focus();\n        area.dispatchEvent(new Event('input', { bubbles: true }));\n      });\n    })();\n  <\/script> <span hidden", ` data-astro-cid-vusoyo76></span> <script>
    (function () {
      var holder = document.querySelector('#dgl-content [data-tk-text]');
      var T = {};
      try { T = JSON.parse(holder ? holder.getAttribute('data-tk-text') : '{}') || {}; } catch (e) { T = {}; }
      window.__tkText = T;
      // The transcript of a closed ticket opens in a new tab; the bot gives the signed link.
      if (!window.__tkTranscriptBound) {
        window.__tkTranscriptBound = true;
        document.addEventListener('click', function (event) {
          var btn = event.target.closest && event.target.closest('[data-transcript]');
          if (!btn) return;
          var failed = (window.__tkText && window.__tkText.transcriptFailed) || 'The transcript could not be opened.';
          var say = function (text) { if (window.dglToast) window.dglToast(text, { kind: 'error' }); };
          var guild = location.pathname.split('/dash/guild/')[1].split('/')[0];
          var win = window.open('', '_blank');
          btn.disabled = true; btn.classList.add('dgl-busy');
          fetch('/dash/guild/' + guild + '/tickets-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'transcript', number: Number(btn.getAttribute('data-transcript')) }) })
            .then(function (r) { return r.json(); })
            .then(function (data) {
              if (data && data.ok && data.link) { if (win) win.location = data.link; else location.href = data.link; }
              else { if (win) win.close(); say((data && data.message) || failed); }
            })
            .catch(function () { if (win) win.close(); say(failed); })
            .finally(function () { btn.disabled = false; btn.classList.remove('dgl-busy'); });
        });
      }
      // The closing dates of the closed tickets, said as "3d ago".
      try {
        document.querySelectorAll('#dgl-content [data-tk-ago]').forEach(function (el) {
          var a = Math.abs((Date.parse(el.getAttribute('datetime')) - Date.now()) / 1000);
          el.textContent = a < 45 ? el.getAttribute('data-now') : el.getAttribute('data-ago').replace('{a}', window.dglDuration(a, { locale: document.documentElement.lang }));
          el.title = new Date(el.getAttribute('datetime')).toLocaleString();
        });
      } catch (e) { /* the date stays as it is */ }
    })();
  <\/script> <script>
    // The preview of a panel follows what is typed (no need to save to see it), the ready designs fill the new-panel form,
    // and the color picker and the hex box stay in step.
    (function () {
      var HEX = /^#[0-9a-fA-F]{6}$/;
      function refresh(form) {
        var preview = form.parentElement && form.parentElement.querySelector('[data-panel-preview]');
        if (!preview) preview = form.querySelector('[data-panel-preview]');
        if (!preview && form.hasAttribute('data-new-panel')) preview = document.querySelector('#dgl-content .tk-new-preview [data-panel-preview]');
        var val = function (name) { var el = form.querySelector('[name="' + name + '"]'); return el ? el.value : ''; };
        var style = val('style') === 'select' ? 'select' : 'button';
        form.querySelectorAll('[data-only-select]').forEach(function (row) { row.hidden = style !== 'select'; });
        if (!preview) return;
        preview.setAttribute('data-style', style);
        var set = function (selector, text) { var el = preview.querySelector(selector); if (el) el.textContent = text; };
        set('[data-pv-title]', val('title'));
        var hasTypes = preview.getAttribute('data-has-types') === '1';
        set('[data-pv-desc]', val('description') || (hasTypes ? ((window.__tkText && window.__tkText.clickHint) || '') : ''));
        var footer = preview.querySelector('[data-pv-foot]');
        if (footer) { footer.textContent = val('footer'); footer.hidden = !val('footer'); }
        var image = preview.querySelector('[data-pv-image]');
        if (image) { var url = val('image_url'); if (/^https:\\/\\//i.test(url)) { image.src = url; image.hidden = false; } else { image.hidden = true; } }
        var card = preview.querySelector('[data-pv-card]');
        if (card) card.style.setProperty('--pv-color', HEX.test(val('color')) ? val('color') : '#a5ea7a');
        var ph = preview.querySelector('[data-pv-placeholder]');
        if (ph && val('placeholder')) ph.textContent = val('placeholder');
      }
      if (!window.__tkPanelBound) {
        window.__tkPanelBound = true;
        document.addEventListener('input', function (event) {
          var form = event.target && event.target.closest && event.target.closest('[data-panel-form]');
          if (form) refresh(form);
        });
        document.addEventListener('change', function (event) {
          var form = event.target && event.target.closest && event.target.closest('[data-panel-form]');
          if (form) refresh(form);
        });
        document.addEventListener('click', function (event) {
          var button = event.target && event.target.closest && event.target.closest('[data-preset]');
          if (!button) return;
          var form = document.querySelector('#dgl-content [data-new-panel]');
          if (!form) return;
          var put = function (name, value) { var el = form.querySelector('[name="' + name + '"]'); if (el) el.value = value; };
          put('title', button.getAttribute('data-title') || '');
          put('description', button.getAttribute('data-description') || '');
          put('color', button.getAttribute('data-color') || '');
          put('style', button.getAttribute('data-style') || 'button');
          put('footer', button.getAttribute('data-footer') || '');
          put('placeholder', button.getAttribute('data-placeholder') || '');
          var colorField = form.querySelector('[name="color"]'); var colorBox = colorField && colorField.closest('[data-colorpicker]'); if (colorBox) colorBox.dispatchEvent(new CustomEvent('cp-set', { detail: button.getAttribute('data-color') || '' }));
          document.querySelectorAll('#dgl-content [data-preset]').forEach(function (b) { b.classList.toggle('on', b === button); });
          refresh(form);
          form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
      // Every time the page is drawn (also after a save or from the menu): the previews and the rows that depend on the style.
      document.querySelectorAll('#dgl-content [data-panel-form]').forEach(refresh);
    })();
  <\/script> `], [" ", "<h1 data-astro-cid-vusoyo76>", "", "</h1> ", "", " ", " ", " ", "", "", "", "", "", "", "", "", "", "", "", "", "", " <script>\n    // A variable chip puts its text where the cursor is in the text box of its reply (the box keeps its place while the chip is pressed).\n    (function () {\n      if (window.__tkVars) return;\n      window.__tkVars = true;\n      document.addEventListener('click', function (event) {\n        var chip = event.target && event.target.closest && event.target.closest('[data-tk-var]');\n        if (!chip) return;\n        var area = chip.closest('.dfx-field') && chip.closest('.dfx-field').querySelector('textarea');\n        if (!area || area.readOnly) return;\n        var start = area.selectionStart == null ? area.value.length : area.selectionStart;\n        var end = area.selectionEnd == null ? start : area.selectionEnd;\n        area.setRangeText(chip.getAttribute('data-tk-var'), start, end, 'end');\n        area.focus();\n        area.dispatchEvent(new Event('input', { bubbles: true }));\n      });\n    })();\n  <\/script> <span hidden", ` data-astro-cid-vusoyo76></span> <script>
    (function () {
      var holder = document.querySelector('#dgl-content [data-tk-text]');
      var T = {};
      try { T = JSON.parse(holder ? holder.getAttribute('data-tk-text') : '{}') || {}; } catch (e) { T = {}; }
      window.__tkText = T;
      // The transcript of a closed ticket opens in a new tab; the bot gives the signed link.
      if (!window.__tkTranscriptBound) {
        window.__tkTranscriptBound = true;
        document.addEventListener('click', function (event) {
          var btn = event.target.closest && event.target.closest('[data-transcript]');
          if (!btn) return;
          var failed = (window.__tkText && window.__tkText.transcriptFailed) || 'The transcript could not be opened.';
          var say = function (text) { if (window.dglToast) window.dglToast(text, { kind: 'error' }); };
          var guild = location.pathname.split('/dash/guild/')[1].split('/')[0];
          var win = window.open('', '_blank');
          btn.disabled = true; btn.classList.add('dgl-busy');
          fetch('/dash/guild/' + guild + '/tickets-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'transcript', number: Number(btn.getAttribute('data-transcript')) }) })
            .then(function (r) { return r.json(); })
            .then(function (data) {
              if (data && data.ok && data.link) { if (win) win.location = data.link; else location.href = data.link; }
              else { if (win) win.close(); say((data && data.message) || failed); }
            })
            .catch(function () { if (win) win.close(); say(failed); })
            .finally(function () { btn.disabled = false; btn.classList.remove('dgl-busy'); });
        });
      }
      // The closing dates of the closed tickets, said as "3d ago".
      try {
        document.querySelectorAll('#dgl-content [data-tk-ago]').forEach(function (el) {
          var a = Math.abs((Date.parse(el.getAttribute('datetime')) - Date.now()) / 1000);
          el.textContent = a < 45 ? el.getAttribute('data-now') : el.getAttribute('data-ago').replace('{a}', window.dglDuration(a, { locale: document.documentElement.lang }));
          el.title = new Date(el.getAttribute('datetime')).toLocaleString();
        });
      } catch (e) { /* the date stays as it is */ }
    })();
  <\/script> <script>
    // The preview of a panel follows what is typed (no need to save to see it), the ready designs fill the new-panel form,
    // and the color picker and the hex box stay in step.
    (function () {
      var HEX = /^#[0-9a-fA-F]{6}$/;
      function refresh(form) {
        var preview = form.parentElement && form.parentElement.querySelector('[data-panel-preview]');
        if (!preview) preview = form.querySelector('[data-panel-preview]');
        if (!preview && form.hasAttribute('data-new-panel')) preview = document.querySelector('#dgl-content .tk-new-preview [data-panel-preview]');
        var val = function (name) { var el = form.querySelector('[name="' + name + '"]'); return el ? el.value : ''; };
        var style = val('style') === 'select' ? 'select' : 'button';
        form.querySelectorAll('[data-only-select]').forEach(function (row) { row.hidden = style !== 'select'; });
        if (!preview) return;
        preview.setAttribute('data-style', style);
        var set = function (selector, text) { var el = preview.querySelector(selector); if (el) el.textContent = text; };
        set('[data-pv-title]', val('title'));
        var hasTypes = preview.getAttribute('data-has-types') === '1';
        set('[data-pv-desc]', val('description') || (hasTypes ? ((window.__tkText && window.__tkText.clickHint) || '') : ''));
        var footer = preview.querySelector('[data-pv-foot]');
        if (footer) { footer.textContent = val('footer'); footer.hidden = !val('footer'); }
        var image = preview.querySelector('[data-pv-image]');
        if (image) { var url = val('image_url'); if (/^https:\\\\/\\\\//i.test(url)) { image.src = url; image.hidden = false; } else { image.hidden = true; } }
        var card = preview.querySelector('[data-pv-card]');
        if (card) card.style.setProperty('--pv-color', HEX.test(val('color')) ? val('color') : '#a5ea7a');
        var ph = preview.querySelector('[data-pv-placeholder]');
        if (ph && val('placeholder')) ph.textContent = val('placeholder');
      }
      if (!window.__tkPanelBound) {
        window.__tkPanelBound = true;
        document.addEventListener('input', function (event) {
          var form = event.target && event.target.closest && event.target.closest('[data-panel-form]');
          if (form) refresh(form);
        });
        document.addEventListener('change', function (event) {
          var form = event.target && event.target.closest && event.target.closest('[data-panel-form]');
          if (form) refresh(form);
        });
        document.addEventListener('click', function (event) {
          var button = event.target && event.target.closest && event.target.closest('[data-preset]');
          if (!button) return;
          var form = document.querySelector('#dgl-content [data-new-panel]');
          if (!form) return;
          var put = function (name, value) { var el = form.querySelector('[name="' + name + '"]'); if (el) el.value = value; };
          put('title', button.getAttribute('data-title') || '');
          put('description', button.getAttribute('data-description') || '');
          put('color', button.getAttribute('data-color') || '');
          put('style', button.getAttribute('data-style') || 'button');
          put('footer', button.getAttribute('data-footer') || '');
          put('placeholder', button.getAttribute('data-placeholder') || '');
          var colorField = form.querySelector('[name="color"]'); var colorBox = colorField && colorField.closest('[data-colorpicker]'); if (colorBox) colorBox.dispatchEvent(new CustomEvent('cp-set', { detail: button.getAttribute('data-color') || '' }));
          document.querySelectorAll('#dgl-content [data-preset]').forEach(function (b) { b.classList.toggle('on', b === button); });
          refresh(form);
          form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
      // Every time the page is drawn (also after a save or from the menu): the previews and the rows that depend on the style.
      document.querySelectorAll('#dgl-content [data-panel-form]').forEach(refresh);
    })();
  <\/script> `])), maybeRenderHead(), selectedTitle, selectedSection === "open" && renderTemplate`<span class="tk-live-badge" data-astro-cid-vusoyo76><i aria-hidden="true" data-astro-cid-vusoyo76></i>${dt("Live")}</span>`, ["panels", "types", "settings", "replies", "open"].includes(selectedSection) && renderTemplate`${renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": textChannels, "emojis": customEmojis, "vars": ticketVars[selectedSection], "data-astro-cid-vusoyo76": true })}`, renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-vusoyo76": true }), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-vusoyo76": true }), renderComponent($$result2, "DurationScript", $$DurationScript, { "data-astro-cid-vusoyo76": true }), selectedSection === "panels" && renderTemplate`${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Panels"), value: panels.length, tone: "messages" },
    { label: dt("Posted"), value: postedCount, tone: "joins" },
    { label: dt("Support types"), value: categories.length, tone: "invites" },
    { label: dt("Open tickets"), value: openTickets.length, tone: "voice" }
  ], "data-astro-cid-vusoyo76": true })}`, showGuide && renderTemplate`${renderComponent($$result2, "TicketGuide", $$TicketGuide, { "guildId": guildId, "section": selectedSection, "typeCount": categories.length, "panelCount": panels.length, "postedCount": postedCount, "data-astro-cid-vusoyo76": true })}`, saved && renderTemplate`<div class="tk-flash tk-flash-ok" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-vusoyo76": true })}${dt("Saved.")}</div>`, warnings.map((w) => renderTemplate`<div class="tk-flash tk-flash-warn" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "15", "height": "15", "data-astro-cid-vusoyo76": true })}${w}</div>`), error && renderTemplate`<div class="tk-flash tk-flash-err" role="alert" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-vusoyo76": true })}${error}</div>`, selectedSection === "panels" && renderTemplate`<div${addAttribute(["tk-section", { "tk-section-hidden": selectedSection !== "panels" }], "class:list")} data-astro-cid-vusoyo76> <h2 data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:squares-four-fill", "width": "15", "height": "15", "data-astro-cid-vusoyo76": true })}${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth('Panels <span class="tk-count">{a}</span>', { a: panels.length }))}` })}</h2> <p class="tk-section-note" data-astro-cid-vusoyo76>${dt("The message members use to open a ticket: a card with buttons or a dropdown. Saving posts it or updates it in the same place; moving posts a new one in the new channel.")}</p> ${panels.length === 0 && renderTemplate`<p class="tk-empty-note" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:squares-four-fill", "width": "15", "height": "15", "data-astro-cid-vusoyo76": true })}${dt("No panels yet. Pick a ready design below to start.")}</p>`} <div class="tk-panel-grid dgl-stagger" data-astro-cid-vusoyo76> ${panels.map((p) => renderTemplate`<div class="tk-panel-card" data-astro-cid-vusoyo76> <form method="POST" class="tk-panel-form" data-panel-form data-astro-cid-vusoyo76> <input type="hidden" name="action" value="update_panel" data-astro-cid-vusoyo76> <input type="hidden" name="panel_id"${addAttribute(p.id, "value")} data-astro-cid-vusoyo76> <div class="tk-panel-head" data-astro-cid-vusoyo76> <span class="tk-panel-chan" data-astro-cid-vusoyo76>#${channelName(p.channelId)}</span> ${p.messageId ? renderTemplate`<a class="tk-chip tk-chip-ok"${addAttribute(`https://discord.com/channels/${guildId}/${p.channelId}/${p.messageId}`, "href")} target="_blank" rel="noopener" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "12", "height": "12", "data-astro-cid-vusoyo76": true })}${dt("Posted")} · ${dt("Open in Discord")}</a>` : renderTemplate`<span class="tk-chip tk-chip-warn" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:power-bold", "width": "12", "height": "12", "data-astro-cid-vusoyo76": true })}${dt("Off: the message is not in Discord. Turn it on to post it.")}</span>`} ${p.embedTemplate && renderTemplate`<span class="tk-chip" data-astro-cid-vusoyo76>${dt("Design")}: ${p.embedTemplate}</span>`} </div> <div class="tk-panel-body" data-astro-cid-vusoyo76> <div class="tk-fields" data-astro-cid-vusoyo76> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Title")}</label><textarea name="title" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-ac="vars,emojis" maxlength="100"${addAttribute(dt("Panel title"), "placeholder")} data-astro-cid-vusoyo76>${p.title ?? ""}</textarea></div> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Description")}</label><textarea name="description" class="dgl-autogrow" data-count data-ac rows="3" maxlength="500"${addAttribute(dt("Panel description"), "placeholder")} data-astro-cid-vusoyo76>${p.description ?? ""}</textarea></div> <div class="tk-two" data-astro-cid-vusoyo76> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Style")}</label> <select name="style" data-astro-cid-vusoyo76> <option value="button"${addAttribute(p.style === "button", "selected")} data-astro-cid-vusoyo76>${dt("Buttons (max 5 types)")}</option> <option value="select"${addAttribute(p.style === "select", "selected")} data-astro-cid-vusoyo76>${dt("Dropdown (up to 25 types)")}</option> </select> </div> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Card color")}</label> ${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "color", "value": p.color || "", "label": dt("Card color"), "allowNone": true, "data-astro-cid-vusoyo76": true })} </div> </div> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Picture on top")}</label><input type="url" name="image_url"${addAttribute(p.imageUrl, "value")} maxlength="500" placeholder="https://..." data-astro-cid-vusoyo76><p class="tk-row-hint" data-astro-cid-vusoyo76>${dt("A banner. The link has to start with https.")}</p></div> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Small text under the panel")}</label><textarea name="footer" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-ac="vars,emojis" maxlength="300"${addAttribute(dt("Optional"), "placeholder")} data-astro-cid-vusoyo76>${p.footer}</textarea></div> <div class="tk-cat-row dfx-field" data-only-select data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Text of the dropdown")}</label><input type="text" name="placeholder" data-ac="vars,emojis"${addAttribute(p.placeholder, "value")} maxlength="150"${addAttribute(dt("Select a ticket category..."), "placeholder")} data-astro-cid-vusoyo76></div> ${embedTemplateNames.length > 0 && renderTemplate`<div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Saved design")}</label> <select name="embed_template" data-dp-template-only data-astro-cid-vusoyo76> <option value="" data-astro-cid-vusoyo76>${dt("None: use the fields above")}</option> ${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === p.embedTemplate, "selected")} data-astro-cid-vusoyo76>${n}</option>`)} </select> <p class="tk-row-hint" data-astro-cid-vusoyo76>${dt("A design made in Embeds replaces the card above.")}</p> </div>`} </div> ${renderComponent($$result2, "TicketPanelPreview", $$TicketPanelPreview, { "title": p.title, "description": p.description, "color": p.color, "imageUrl": p.imageUrl, "footer": p.footer, "style": p.style, "placeholder": p.placeholder, "types": p.types, "design": p.embedTemplate, "data-astro-cid-vusoyo76": true })} </div> <p${addAttribute(["tk-panel-cats", { "tk-panel-cats-empty": p.categoryCount === 0 }], "class:list")} data-astro-cid-vusoyo76>${p.categoryCount === 0 ? dt("No types on this panel yet. Add one in Support types and pick this panel.") : dt("{n} types on this panel", { n: p.categoryCount })}</p> <div class="tk-panel-actions" data-astro-cid-vusoyo76> <button type="submit" name="action" value="update_panel" class="btn btn-accent btn-sm" data-astro-cid-vusoyo76>${dt("Save and update the message")}</button> </div> </form> <div class="tk-pbar" data-astro-cid-vusoyo76> <div class="tk-pbar-row" data-astro-cid-vusoyo76> ${p.messageId ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-vusoyo76": true }, { "default": ($$result3) => renderTemplate` <form method="POST" data-no-dirty data-astro-cid-vusoyo76><input type="hidden" name="action" value="unpost_panel" data-astro-cid-vusoyo76><input type="hidden" name="panel_id"${addAttribute(p.id, "value")} data-astro-cid-vusoyo76><button type="submit" name="action" value="unpost_panel" class="btn btn-ghost btn-sm" formnovalidate${addAttribute(dt("Takes the message down from Discord. The panel and its settings stay here, and nobody can open a ticket from it until you turn it on."), "title")}${addAttribute(dt("Turn this panel off? Its message is deleted from Discord, so nobody can open a ticket from it. The panel stays here and you can turn it on again."), "data-confirm")} data-confirm-tone="neutral"${addAttribute(dt("Turn off"), "data-confirm-yes")} data-astro-cid-vusoyo76>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:power-bold", "width": "14", "height": "14", "data-astro-cid-vusoyo76": true })}${dt("Turn off")}</button></form> <form method="POST" data-no-dirty data-astro-cid-vusoyo76><input type="hidden" name="action" value="resend_panel" data-astro-cid-vusoyo76><input type="hidden" name="panel_id"${addAttribute(p.id, "value")} data-astro-cid-vusoyo76><button type="submit" name="action" value="resend_panel" class="btn btn-ghost btn-sm"${addAttribute(dt("Resend this panel? The message in Discord is deleted and posted again."), "data-confirm")} data-astro-cid-vusoyo76>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrows-clockwise-bold", "width": "14", "height": "14", "data-astro-cid-vusoyo76": true })}${dt("Resend")}</button></form> ` })}` : renderTemplate`<form method="POST" data-no-dirty data-astro-cid-vusoyo76><input type="hidden" name="action" value="resend_panel" data-astro-cid-vusoyo76><input type="hidden" name="panel_id"${addAttribute(p.id, "value")} data-astro-cid-vusoyo76><button type="submit" name="action" value="resend_panel" class="btn btn-accent btn-sm"${addAttribute(dt("Posts the message in Discord again."), "title")} data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:power-bold", "width": "14", "height": "14", "data-astro-cid-vusoyo76": true })}${dt("Turn on")}</button></form>`} <form method="POST" data-no-dirty class="tk-pbar-end" data-astro-cid-vusoyo76><input type="hidden" name="action" value="delete_panel" data-astro-cid-vusoyo76><input type="hidden" name="panel_id"${addAttribute(p.id, "value")} data-astro-cid-vusoyo76><button type="submit" name="action" value="delete_panel" class="btn btn-sm tk-del-btn"${addAttribute(dt("Delete this panel"), "title")}${addAttribute(dt("Delete this panel? Its message in Discord is deleted too. Ticket types stay, but are no longer on a panel."), "data-confirm")} formnovalidate data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "14", "height": "14", "data-astro-cid-vusoyo76": true })}${dt("Delete panel")}</button></form> </div> <form method="POST" class="tk-panel-move" data-no-dirty data-astro-cid-vusoyo76> <input type="hidden" name="action" value="move_panel" data-astro-cid-vusoyo76> <input type="hidden" name="panel_id"${addAttribute(p.id, "value")} data-astro-cid-vusoyo76> <label class="tk-move-label" data-astro-cid-vusoyo76>${dt("Move to another channel")}</label> <select name="channel_id" data-fill="tk-ch" data-astro-cid-vusoyo76> ${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": textChannels, "selected": p.channelId, "prefix": "#", "data-astro-cid-vusoyo76": true })} </select> <button type="submit" name="action" value="move_panel" class="btn btn-ghost btn-sm" data-astro-cid-vusoyo76>${dt("Move")}</button> </form> </div> </div>`)} </div> <div class="tk-new-panel" data-astro-cid-vusoyo76> <h2 data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "15", "height": "15", "data-astro-cid-vusoyo76": true })}${dt("New panel")}</h2> <p class="tk-section-note" data-astro-cid-vusoyo76>${dt("Pick a ready design. It fills the form: you can change anything before posting.")}</p> <div class="tk-presets" data-presets data-astro-cid-vusoyo76> ${presets.map((pr) => renderTemplate`<button type="button" class="tk-preset"${addAttribute(pr.id, "data-preset")}${addAttribute(pr.title, "data-title")}${addAttribute(pr.description, "data-description")}${addAttribute(pr.color, "data-color")}${addAttribute(pr.style, "data-style")}${addAttribute(pr.footer, "data-footer")}${addAttribute(pr.placeholder, "data-placeholder")}${addAttribute(`--pc:${pr.color}`, "style")} data-astro-cid-vusoyo76> ${renderComponent($$result2, "Icon", $$Icon, { "name": pr.icon, "width": "16", "height": "16", "data-astro-cid-vusoyo76": true })}<span data-astro-cid-vusoyo76>${pr.name}</span> </button>`)} </div> <div class="tk-new-grid" data-astro-cid-vusoyo76> <form method="POST" class="tk-panel-form tk-new-form" data-panel-form data-new-panel data-no-dirty data-astro-cid-vusoyo76> <input type="hidden" name="action" value="create_panel" data-astro-cid-vusoyo76> <div class="tk-fields" data-astro-cid-vusoyo76> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Channel")}</label> <select name="channel_id" required data-fill="tk-ch" data-astro-cid-vusoyo76> <option value="" disabled selected data-astro-cid-vusoyo76>${dt("Choose where to post it")}</option> </select> </div> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Title")}</label><textarea name="title" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-ac="vars,emojis" maxlength="100"${addAttribute(dt("Panel title"), "placeholder")} data-astro-cid-vusoyo76></textarea></div> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Description")}</label><textarea name="description" class="dgl-autogrow" data-count data-ac rows="3" maxlength="500"${addAttribute(dt("Panel description"), "placeholder")} data-astro-cid-vusoyo76></textarea></div> <div class="tk-two" data-astro-cid-vusoyo76> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Style")}</label> <select name="style" data-astro-cid-vusoyo76><option value="button" data-astro-cid-vusoyo76>${dt("Buttons (max 5 types)")}</option><option value="select" data-astro-cid-vusoyo76>${dt("Dropdown (up to 25 types)")}</option></select> </div> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Card color")}</label> ${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "color", "value": "", "label": dt("Card color"), "allowNone": true, "data-astro-cid-vusoyo76": true })} </div> </div> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Picture on top")}</label><input type="url" name="image_url" maxlength="500" placeholder="https://..." data-astro-cid-vusoyo76></div> <div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Small text under the panel")}</label><textarea name="footer" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-ac="vars,emojis" maxlength="300"${addAttribute(dt("Optional"), "placeholder")} data-astro-cid-vusoyo76></textarea></div> <div class="tk-cat-row dfx-field" data-only-select data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Text of the dropdown")}</label><input type="text" name="placeholder" data-ac="vars,emojis" maxlength="150"${addAttribute(dt("Select a ticket category..."), "placeholder")} data-astro-cid-vusoyo76></div> ${embedTemplateNames.length > 0 && renderTemplate`<div class="tk-cat-row dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Saved design")}</label> <select name="embed_template" data-dp-template-only data-astro-cid-vusoyo76> <option value="" data-astro-cid-vusoyo76>${dt("None: use the fields above")}</option> ${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")} data-astro-cid-vusoyo76>${n}</option>`)} </select> </div>`} </div> <div class="tk-panel-actions" data-astro-cid-vusoyo76><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "13", "height": "13", "data-astro-cid-vusoyo76": true })}${dt("Create and post the panel")}</button></div> </form> <div class="tk-new-preview" data-astro-cid-vusoyo76>${renderComponent($$result2, "TicketPanelPreview", $$TicketPanelPreview, { "title": "", "description": "", "style": "button", "types": categories.filter((c) => !c.panelId).slice(0, 5).map((c) => ({ label: c.label, emoji: c.emoji, description: c.description, buttonStyle: c.buttonStyle })), "data-astro-cid-vusoyo76": true })}</div> </div> ${embedTemplateNames.length > 0 && renderTemplate`<p class="tk-row-hint" data-astro-cid-vusoyo76>${dt("A template's own title/description/color/image win over the fields above. Only server-wide variables resolve here ({a}, {b}, etc), not per-member ones, since no one specific opens a panel.", { a: "{server_name}", b: "{guild.icon}" })}</p>`} </div> </div>`, selectedSection === "types" && renderTemplate`<div class="tkx-page" data-astro-cid-vusoyo76> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Support types"), value: categories.length, tone: "invites" },
    { label: dt("On a panel"), value: categories.filter((c) => c.panelId).length, tone: "joins" },
    { label: dt("With a form"), value: categories.filter((c) => c.formId).length, tone: "messages" }
  ], "data-astro-cid-vusoyo76": true })} <div class="tkx-head" data-astro-cid-vusoyo76> <h2 data-astro-cid-vusoyo76>${dt("Support types")} <span class="tkx-count" data-astro-cid-vusoyo76>${categories.length}/${ticketCategoryLimit}</span>${!premiumActive && renderTemplate`<span class="tk-premium-tag" data-astro-cid-vusoyo76>Premium: ${PREMIUM_LIMITS.ticketCategories}</span>`}</h2> <p data-astro-cid-vusoyo76>${dt("A support type is a reason to open a ticket: Support, Report a player, Purchases... Each one appears as a button or option on a panel, and has its own staff and rules.")}</p> </div> ${categories.length === 0 && renderTemplate`<p class="tkx-empty" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:ticket", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}${dt("No ticket types yet, add the first one below.")}</p>`} <div class="tkx-list dgl-stagger" data-astro-cid-vusoyo76> ${categories.map((cat) => {
    const panel = panels.find((p) => p.id === cat.panelId);
    return renderTemplate`<form method="POST" class="tkx-item" data-astro-cid-vusoyo76> <input type="hidden" name="category_id"${addAttribute(cat.id, "value")} data-astro-cid-vusoyo76>  <button type="submit" name="action" value="update" class="tk-default-submit" tabindex="-1" aria-hidden="true" data-astro-cid-vusoyo76></button> <div class="tkx-item-head" data-astro-cid-vusoyo76> <span class="tk-cat-emoji-chip" data-astro-cid-vusoyo76>${renderComponent($$result2, "TicketEmoji", $$TicketEmoji, { "emoji": cat.emoji, "size": 20, "data-astro-cid-vusoyo76": true })}</span> <div class="dfx-field tkx-name" data-astro-cid-vusoyo76><textarea name="label" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count maxlength="40"${addAttribute(dt("Name of the type"), "aria-label")} data-astro-cid-vusoyo76>${cat.label}</textarea></div> ${panel && renderTemplate`<button type="submit" name="action" value="disable" class="btn btn-ghost btn-sm tkx-off"${addAttribute(dt("Take it off its panel: nobody can open it, and its tickets and history stay. To turn it on again, pick a panel for it."), "title")} formnovalidate${addAttribute(dt("Turn this type off? It leaves its panel, so nobody can open it. Its tickets and history stay, and you can turn it on again by picking a panel."), "data-confirm")} data-confirm-tone="neutral"${addAttribute(dt("Turn off"), "data-confirm-yes")} data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:power-bold", "width": "13", "height": "13", "data-astro-cid-vusoyo76": true })}${dt("Turn off")}</button>`} <button type="submit" name="action" value="delete" class="tk-cat-del"${addAttribute(dt("Delete this type"), "title")}${addAttribute(dt("Delete this type"), "aria-label")}${addAttribute(dt("Delete this support type? Members can no longer open tickets with it. This cannot be undone."), "data-confirm")} formnovalidate data-astro-cid-vusoyo76> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-vusoyo76": true })} </button> </div> ${panel ? renderTemplate`<span class="tkx-pill tkx-pill-ok" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "13", "height": "13", "data-astro-cid-vusoyo76": true })}${dt("On the panel: {name}", { name: panel.title || `#${channelName(panel.channelId)}` })}</span>` : renderTemplate`<span class="tkx-pill tkx-pill-warn" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "13", "height": "13", "data-astro-cid-vusoyo76": true })}${dt("Turned off: it is not on any panel, so nobody can open it. Pick a panel below to turn it on.")}</span>`} <details class="dfx-acc" open data-astro-cid-vusoyo76> <summary data-astro-cid-vusoyo76><span class="dfx-acc-title" data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("How it looks on the panel")}</b></span>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14", "data-astro-cid-vusoyo76": true })}</summary> <div class="dfx-acc-body" data-astro-cid-vusoyo76> <div class="dfx-grid" data-astro-cid-vusoyo76> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Panel where it appears")}</label> <select name="panel_id" data-astro-cid-vusoyo76> <option value="" data-astro-cid-vusoyo76>${dt("None (not on any panel)")}</option> ${panels.map((p) => renderTemplate`<option${addAttribute(p.id, "value")}${addAttribute(p.id === cat.panelId, "selected")} data-astro-cid-vusoyo76>${p.title || `#${channelName(p.channelId)}`}</option>`)} </select> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <span class="dfx-label" data-astro-cid-vusoyo76>${dt("Button color")}</span> <div class="dfx-chips" data-astro-cid-vusoyo76> ${buttonStyles.map((b) => renderTemplate`<label class="dfx-chip" data-astro-cid-vusoyo76><input type="radio" name="button_style"${addAttribute(b.value, "value")}${addAttribute(b.value === cat.buttonStyle, "checked")} data-astro-cid-vusoyo76><i class="tkx-dot"${addAttribute(`--c:${b.color}`, "style")} data-astro-cid-vusoyo76></i>${b.label}</label>`)} </div> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Emoji")}</label> <input type="text" name="emoji" data-emoji-input${addAttribute(cat.emoji ?? "", "value")} maxlength="64" autocomplete="off" placeholder="🎫" data-astro-cid-vusoyo76> <span class="dfx-hint" data-astro-cid-vusoyo76>${dt("Pick one with the button on the right. Server emojis work too.")}</span> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Short description")}</label> <textarea name="description" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-ac="vars,emojis" maxlength="100"${addAttribute(dt("Shown under the name in the dropdown"), "placeholder")} data-astro-cid-vusoyo76>${cat.description ?? ""}</textarea> </div> </div> </div> </details> <details class="dfx-acc" data-astro-cid-vusoyo76> <summary data-astro-cid-vusoyo76><span class="dfx-acc-title" data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("When the ticket opens")}</b></span>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14", "data-astro-cid-vusoyo76": true })}</summary> <div class="dfx-acc-body" data-astro-cid-vusoyo76> <div class="dfx-grid" data-astro-cid-vusoyo76> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Channel name")}</label> <textarea name="naming_pattern" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-ac="vars,emojis" maxlength="50" placeholder="ticket-{number}" data-astro-cid-vusoyo76>${cat.namingPattern}</textarea> <span class="dfx-hint" data-astro-cid-vusoyo76>${dt("You can use {number}, {username}, {userid} and {category}.")}</span> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Discord category where the channel is made")}</label> <select name="parent_channel_id" data-astro-cid-vusoyo76> <option value="" data-astro-cid-vusoyo76>${dt("Server default")}</option> ${channelCategories.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === cat.parentChannelId, "selected")} data-astro-cid-vusoyo76>${c.name}</option>`)} </select> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Intake form")}</label> <select name="form_id" data-astro-cid-vusoyo76> <option value="" data-astro-cid-vusoyo76>${dt("No form")}</option> ${forms.map((form) => renderTemplate`<option${addAttribute(form.id, "value")}${addAttribute(String(form.id) === String(cat.formId), "selected")} data-astro-cid-vusoyo76>${form.name} · ${form.title}</option>`)} </select> </div> ${cat.welcomeSupported && renderTemplate`<div class="dfx-field dfx-wide" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Welcome text")}</label> <input type="hidden" name="welcome_supported" value="1" data-astro-cid-vusoyo76> <textarea name="welcome_message" class="dgl-autogrow" data-count data-ac rows="3" maxlength="1000"${addAttribute(dt("Hi {user}! Tell us what you need and staff will answer soon."), "placeholder")} data-astro-cid-vusoyo76>${cat.welcomeMessage ?? ""}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-vusoyo76": true })} <span class="dfx-hint" data-astro-cid-vusoyo76>${dt("Shown inside the ticket. You can use {user}, {username}, {category}, {server} and {number}. A saved embed set for this type is used instead.")}</span> </div>`} </div> </div> </details> <details class="dfx-acc" data-astro-cid-vusoyo76> <summary data-astro-cid-vusoyo76><span class="dfx-acc-title" data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("Who answers and who can open it")}</b></span>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14", "data-astro-cid-vusoyo76": true })}</summary> <div class="dfx-acc-body" data-astro-cid-vusoyo76> <div class="dfx-grid" data-astro-cid-vusoyo76> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Support roles")}</label> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "support_role_ids", "options": roles, "selected": cat.supportRoleIds, "placeholder": dt("Search roles..."), "data-astro-cid-vusoyo76": true })} <span class="dfx-hint" data-astro-cid-vusoyo76>${dt("They can see and answer these tickets.")}</span> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Ping on open")}</label> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "ping_role_ids", "options": roles, "selected": cat.pingRoleIds, "placeholder": dt("Search roles..."), "data-astro-cid-vusoyo76": true })} </div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Required roles")}</label> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "required_role_ids", "options": roles, "selected": cat.requiredRoleIds, "placeholder": dt("Search roles..."), "data-astro-cid-vusoyo76": true })} <span class="dfx-hint" data-astro-cid-vusoyo76>${dt("Only members with all of them can open this type. Empty for everyone.")}</span> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Max open per member")}</label> <input type="number" name="max_open_per_user"${addAttribute(cat.maxOpenPerUser, "value")} min="1" max="10" data-astro-cid-vusoyo76> </div> </div> </div> </details> <div class="dfx-foot" data-astro-cid-vusoyo76><button type="submit" name="action" value="update" class="btn btn-accent btn-sm" data-astro-cid-vusoyo76>${dt("Save this type")}</button></div> </form>`;
  })} </div> <div class="dfx-form tkx-add" data-tk-new-type data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-vusoyo76": true })}${dt("Add a support type")}</h2></div> ${!ticketCategoryAtLimit && categories.length < 4 && renderTemplate`<form method="POST" class="tkx-starter" data-no-dirty data-astro-cid-vusoyo76> <input type="hidden" name="action" value="add_starter_types" data-astro-cid-vusoyo76> <span class="tkx-starter-icon" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magic-wand-fill", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}</span> <div class="tkx-starter-text" data-astro-cid-vusoyo76><strong data-astro-cid-vusoyo76>${dt("Start with a ready set")}</strong><span data-astro-cid-vusoyo76>${dt("Adds Support, Report a player, Purchases and Appeals (as many as your plan allows). You can rename or delete them.")}</span></div> <div class="tkx-starter-do" data-astro-cid-vusoyo76> <select name="panel_id"${addAttribute(dt("Panel where it appears"), "aria-label")} data-astro-cid-vusoyo76><option value="" data-astro-cid-vusoyo76>${dt("No panel yet")}</option>${panels.map((p) => renderTemplate`<option${addAttribute(p.id, "value")} data-astro-cid-vusoyo76>${p.title || `#${channelName(p.channelId)}`}</option>`)}</select> <button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "13", "height": "13", "data-astro-cid-vusoyo76": true })}${dt("Add the ready types")}</button> </div> </form>`} ${ticketCategoryAtLimit ? renderTemplate`<div class="tkx-limit" data-astro-cid-vusoyo76> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-simple-fill", "width": "20", "height": "20", "data-astro-cid-vusoyo76": true })} <div data-astro-cid-vusoyo76><strong data-astro-cid-vusoyo76>${premiumActive ? dt("Ticket type limit reached") : dt("Free ticket type limit reached")}</strong><span data-astro-cid-vusoyo76>${premiumActive ? dt("You are using all {n} available ticket types.", { n: ticketCategoryLimit }) : dt("Free includes {a} ticket types. Premium increases this to {b}.", { a: FREE_LIMITS.ticketCategories, b: PREMIUM_LIMITS.ticketCategories })}</span></div> ${!premiumActive && renderTemplate`<a class="btn btn-ghost btn-sm"${addAttribute(`/dash/premium?guild_id=${guildId}`, "href")} data-astro-cid-vusoyo76>${dt("Unlock Premium")}</a>`} </div>` : renderTemplate`<form method="POST" class="tkx-addform" data-no-dirty data-astro-cid-vusoyo76> <input type="hidden" name="action" value="create" data-astro-cid-vusoyo76> <div class="dfx-grid" data-astro-cid-vusoyo76> <div class="dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Name of the type")}</label><textarea name="label" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count${addAttribute(dt("e.g. Report a player"), "placeholder")} maxlength="40" required data-astro-cid-vusoyo76></textarea></div> <div class="dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Emoji")}</label><input type="text" name="emoji" data-emoji-input placeholder="🎫" maxlength="64" autocomplete="off" data-astro-cid-vusoyo76></div> <div class="dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Panel where it appears")}</label> <select name="panel_id" data-astro-cid-vusoyo76> <option value="" data-astro-cid-vusoyo76>${dt("No panel yet")}</option> ${panels.map((p) => renderTemplate`<option${addAttribute(p.id, "value")} data-astro-cid-vusoyo76>${p.title || `#${channelName(p.channelId)}`}</option>`)} </select> </div> <div class="dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Discord category where the channel is made")}</label> <select name="parent_channel_id" data-astro-cid-vusoyo76> <option value="" data-astro-cid-vusoyo76>${dt("Server default category")}</option> ${channelCategories.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-vusoyo76>${c.name}</option>`)} </select> </div> </div> <div class="dfx-foot" data-astro-cid-vusoyo76><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "13", "height": "13", "data-astro-cid-vusoyo76": true })}${dt("Add")}</button></div> </form>`} ${forms.length === 0 && renderTemplate`<p class="dfx-hint" data-astro-cid-vusoyo76>${dt("Want questions before a ticket opens?")} <a${addAttribute(`/dash/guild/${guildId}/tickets?section=forms`, "href")} class="dfx-link" data-astro-cid-vusoyo76>${dt("Create a ticket form")} →</a></p>`} </div> </div>`, selectedSection === "forms" && renderTemplate`<div class="tkx-page" data-astro-cid-vusoyo76> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Ticket forms"), value: forms.length, tone: "messages" },
    { label: dt("Questions"), value: forms.reduce((sum, f) => sum + f.fields.length, 0), tone: "voice" }
  ], "data-astro-cid-vusoyo76": true })} <div class="tkx-head" data-astro-cid-vusoyo76> <h2 data-astro-cid-vusoyo76>${dt("Ticket forms")} <span class="tkx-count" data-astro-cid-vusoyo76>${forms.length}</span></h2> <p data-astro-cid-vusoyo76>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("Reusable intake forms shown before a form-backed ticket opens. Add the questions below: short and long answers, choices, checkboxes, member, role and channel pickers, texts and file uploads (pictures are shown in the ticket and kept in it). In Discord the same questions use <code>type|id|label|placeholder|required|extra;...</code>."))}` })}</p> </div> ${forms.length === 0 && renderTemplate`<p class="tkx-empty" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clipboard-text-fill", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}${dt("No forms yet. Create one here, then assign it to a support type.")}</p>`} <div class="tkx-list dgl-stagger" data-astro-cid-vusoyo76> ${forms.map((form) => renderTemplate`<form method="POST" class="tkx-item" data-astro-cid-vusoyo76> <input type="hidden" name="form_id"${addAttribute(form.id, "value")} data-astro-cid-vusoyo76> <input type="hidden" name="form_name"${addAttribute(form.name, "value")} data-astro-cid-vusoyo76> <input type="hidden" name="action" value="update_ticket_form" data-astro-cid-vusoyo76> <div class="tkx-item-head tkx-item-center" data-astro-cid-vusoyo76> <span class="tk-cat-emoji-chip tkx-icon" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clipboard-text-fill", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}</span> <div class="tkx-item-title" data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${form.name}</b><span class="dfx-hint" data-astro-cid-vusoyo76>${dt("{a} questions", { a: form.fields.length })}</span></div> </div> <div class="dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Modal title")}</label><textarea name="form_title" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count maxlength="45" required data-astro-cid-vusoyo76>${form.title}</textarea></div> <div class="dfx-field" data-astro-cid-vusoyo76><span class="dfx-label" data-astro-cid-vusoyo76>${dt("Fields")}</span>${renderComponent($$result2, "TicketFieldsBuilder", $$TicketFieldsBuilder, { "fields": form.fields, "data-astro-cid-vusoyo76": true })}</div> <div class="dfx-foot" data-astro-cid-vusoyo76> <button type="submit" class="btn btn-accent btn-sm" data-astro-cid-vusoyo76>${dt("Save form")}</button> <button type="submit"${addAttribute(`tk-form-del-${form.id}`, "form")} class="tk-cat-del tk-del-text"${addAttribute(dt("Delete this form? Support types that use it open without a form."), "data-confirm")} formnovalidate data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-vusoyo76": true })}${dt("Delete form")}</button> </div> </form>`)} </div> ${forms.map((form) => renderTemplate`<form method="POST"${addAttribute(`tk-form-del-${form.id}`, "id")} hidden data-no-dirty data-astro-cid-vusoyo76><input type="hidden" name="action" value="delete_ticket_form" data-astro-cid-vusoyo76><input type="hidden" name="form_id"${addAttribute(form.id, "value")} data-astro-cid-vusoyo76></form>`)} <form method="POST" class="dfx-form tkx-add" data-no-dirty data-astro-cid-vusoyo76> <input type="hidden" name="action" value="create_ticket_form" data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-vusoyo76": true })}${dt("New form")}</h2></div> <div class="dfx-grid" data-astro-cid-vusoyo76> <div class="dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Form name")}</label><textarea name="form_name" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count autocomplete="off" maxlength="50" required data-astro-cid-vusoyo76></textarea></div> <div class="dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Modal title")}</label><textarea name="form_title" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count autocomplete="off" maxlength="45" required data-astro-cid-vusoyo76>${dt("Ticket details")}</textarea></div> </div> <div class="dfx-field" data-astro-cid-vusoyo76><span class="dfx-label" data-astro-cid-vusoyo76>${dt("Fields")}</span>${renderComponent($$result2, "TicketFieldsBuilder", $$TicketFieldsBuilder, { "data-astro-cid-vusoyo76": true })}</div> <div class="dfx-foot" data-astro-cid-vusoyo76><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "13", "height": "13", "data-astro-cid-vusoyo76": true })}${dt("Create form")}</button></div> </form> </div>`, selectedSection === "access" && renderTemplate`<div class="tkx-page" data-astro-cid-vusoyo76> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Members blocked"), value: blacklist.filter((e) => e.target_type !== "role").length, tone: "leaves" },
    { label: dt("Roles blocked"), value: blacklist.filter((e) => e.target_type === "role").length, tone: "reactions" }
  ], "data-astro-cid-vusoyo76": true })} <div class="tkx-head" data-astro-cid-vusoyo76> <h2 data-astro-cid-vusoyo76>${dt("Ticket access")} <span class="tkx-count" data-astro-cid-vusoyo76>${blacklist.length}</span></h2> <p data-astro-cid-vusoyo76>${dt("Block a user or role from opening tickets. Role entries apply to every member with that role.")}</p> </div> ${blacklist.length === 0 ? renderTemplate`<p class="tkx-empty" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}${dt("Nobody is blocked. Everyone who can see a panel can open a ticket.")}</p>` : renderTemplate`<div class="tkx-rows dgl-stagger" data-astro-cid-vusoyo76> ${blacklist.map((entry) => renderTemplate`<div class="tkx-row" data-astro-cid-vusoyo76> ${entry.target_type === "role" ? renderTemplate`<span class="tk-block-icon" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-fill", "width": "16", "height": "16", "data-astro-cid-vusoyo76": true })}</span>` : renderTemplate`<img class="tk-block-av"${addAttribute(entry.avatar ?? `https://cdn.discordapp.com/embed/avatars/${Number(entry.target_id.slice(-3)) % 6}.png`, "src")} alt="" width="34" height="34" loading="lazy" data-astro-cid-vusoyo76>`} <div class="tkx-row-main" data-astro-cid-vusoyo76> <b data-astro-cid-vusoyo76>${entry.target_type === "role" ? `@${entry.name ?? entry.target_id}` : entry.name ?? entry.target_id}</b> <span class="tkx-row-sub" data-astro-cid-vusoyo76><span${addAttribute(["tkx-tag", { "tkx-tag-role": entry.target_type === "role" }], "class:list")} data-astro-cid-vusoyo76>${entry.target_type === "role" ? dt("Role") : dt("Member")}</span><code data-astro-cid-vusoyo76>${entry.target_id}</code></span> ${entry.reason && renderTemplate`<span class="tkx-row-reason" data-astro-cid-vusoyo76>${entry.reason}</span>`} </div> <form method="POST" data-no-dirty data-astro-cid-vusoyo76><input type="hidden" name="action" value="remove_ticket_blacklist" data-astro-cid-vusoyo76><input type="hidden" name="target_type"${addAttribute(entry.target_type, "value")} data-astro-cid-vusoyo76><input type="hidden" name="target_id"${addAttribute(entry.target_id, "value")} data-astro-cid-vusoyo76><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-vusoyo76>${dt("Unblock")}</button></form> </div>`)} </div>`} <form method="POST" class="dfx-form tkx-add" data-no-dirty data-astro-cid-vusoyo76> <input type="hidden" name="action" value="add_ticket_blacklist" data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-vusoyo76": true })}${dt("Block a member or role")}</h2><p data-astro-cid-vusoyo76>${dt("Pick who it is, paste its ID and say why if you want to remember it.")}</p></div> <div class="dfx-field" data-astro-cid-vusoyo76> <span class="dfx-label" data-astro-cid-vusoyo76>${dt("Who")}</span> <div class="dfx-chips" data-astro-cid-vusoyo76> <label class="dfx-chip" data-astro-cid-vusoyo76><input type="radio" name="target_type" value="user" checked data-astro-cid-vusoyo76>${dt("Member")}</label> <label class="dfx-chip" data-astro-cid-vusoyo76><input type="radio" name="target_type" value="role" data-astro-cid-vusoyo76>${dt("Role")}</label> </div> </div> <div class="dfx-grid" data-astro-cid-vusoyo76> <div class="dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Discord ID")}</label><input type="text" name="target_id" placeholder="123456789012345678" inputmode="numeric" pattern="[0-9]{5,25}" required data-astro-cid-vusoyo76><span class="dfx-hint" data-astro-cid-vusoyo76>${dt("In Discord, turn on Developer Mode, right-click the member or the role and copy its ID.")}</span></div> <div class="dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Reason (optional)")}</label><textarea name="reason" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count maxlength="300" data-astro-cid-vusoyo76></textarea></div> </div> <div class="dfx-foot" data-astro-cid-vusoyo76><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "13", "height": "13", "data-astro-cid-vusoyo76": true })}${dt("Block")}</button></div> </form> </div>`, selectedSection === "settings" && renderTemplate`<div class="tkx-page" data-astro-cid-vusoyo76> <form method="POST" class="dfx-form tkx-settings" data-astro-cid-vusoyo76> <input type="hidden" name="action" value="save_settings" data-astro-cid-vusoyo76> <section class="dfx-sec tkx-first" data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${dt("Claiming")}</h2><p data-astro-cid-vusoyo76>${dt("A claim says which staff member is taking care of a ticket.")}</p></div> <div class="sx-choices" data-astro-cid-vusoyo76> <label class="sx-choice" data-astro-cid-vusoyo76><input type="radio" name="claim_mode" value="shared"${addAttribute(settings.claimMode !== "exclusive", "checked")} data-astro-cid-vusoyo76><span class="sx-choice-body" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-fill", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}<b data-astro-cid-vusoyo76>${dt("Shared")}</b><em data-astro-cid-vusoyo76>${dt("Any staff can still act on a claimed ticket.")}</em></span></label> <label class="sx-choice" data-astro-cid-vusoyo76><input type="radio" name="claim_mode" value="exclusive"${addAttribute(settings.claimMode === "exclusive", "checked")} data-astro-cid-vusoyo76><span class="sx-choice-body" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lock-simple-fill", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}<b data-astro-cid-vusoyo76>${dt("Exclusive")}</b><em data-astro-cid-vusoyo76>${dt("Only the claimer (or an admin) can act on it.")}</em></span></label> </div> <label class="dfx-switch" data-astro-cid-vusoyo76><span data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("Ping the ticket opener when claimed")}</b><em data-astro-cid-vusoyo76>${dt("They get a mention in the ticket when a staff member takes it.")}</em></span><input type="checkbox" class="dfx-t" name="ping_on_claim"${addAttribute(settings.pingOnClaim, "checked")} data-astro-cid-vusoyo76></label> <div class="dfx-grid" data-astro-cid-vusoyo76> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Remind the staff if nobody claims it (minutes)")}</label> <input type="number" name="unclaimed_reminder_minutes"${addAttribute(settings.unclaimedReminderMinutes, "value")} min="0" max="10080" data-astro-cid-vusoyo76> <span class="dfx-hint" data-astro-cid-vusoyo76>${dt("The support roles of the type are pinged once in the ticket. 0 for no reminder.")}</span> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Roles to add on claim")}</label> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "roles_to_add_on_claim", "options": roles, "selected": settings.rolesToAddOnClaim, "placeholder": dt("Search roles..."), "data-astro-cid-vusoyo76": true })} </div> </div> </section> <section class="dfx-sec" data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${dt("Closing")}</h2><p data-astro-cid-vusoyo76>${dt("Who can close a ticket, what they have to say and what happens after.")}</p></div> <div class="dfx-switches" data-astro-cid-vusoyo76> <label class="dfx-switch" data-astro-cid-vusoyo76><span data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("Only support roles can close (not the opener)")}</b><em data-astro-cid-vusoyo76>${dt("The member who opened it cannot close it.")}</em></span><input type="checkbox" class="dfx-t" name="close_requires_support_role"${addAttribute(settings.closeRequiresSupportRole, "checked")} data-astro-cid-vusoyo76></label> <label class="dfx-switch" data-astro-cid-vusoyo76><span data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("Require a reason to close")}</b><em data-astro-cid-vusoyo76>${dt("Whoever closes a ticket has to say why.")}</em></span><input type="checkbox" class="dfx-t" name="close_requires_reason"${addAttribute(settings.closeRequiresReason, "checked")} data-astro-cid-vusoyo76></label> <label class="dfx-switch" data-astro-cid-vusoyo76><span data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("Hide who closed it from the opener")}</b><em data-astro-cid-vusoyo76>${dt("The opener is not told which staff member closed it.")}</em></span><input type="checkbox" class="dfx-t" name="hide_closing_user"${addAttribute(settings.hideClosingUser, "checked")} data-astro-cid-vusoyo76></label> <label class="dfx-switch" data-astro-cid-vusoyo76><span data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("DM the opener with the transcript on close")}</b><em data-astro-cid-vusoyo76>${dt("A copy of the conversation goes to their DMs.")}</em></span><input type="checkbox" class="dfx-t" name="dm_user_on_close"${addAttribute(settings.dmUserOnClose, "checked")} data-astro-cid-vusoyo76></label> <label class="dfx-switch" data-astro-cid-vusoyo76><span data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("Log staff reply counts in the closed-ticket log")}</b><em data-astro-cid-vusoyo76>${dt("Shows how many times each staff member replied.")}</em></span><input type="checkbox" class="dfx-t" name="log_staff_message_counts"${addAttribute(settings.logStaffMessageCounts, "checked")} data-astro-cid-vusoyo76></label> </div> <div class="dfx-grid" data-astro-cid-vusoyo76> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Delete the channel of a closed ticket after (hours)")}</label> <input type="number" name="auto_delete_closed_hours"${addAttribute(settings.autoDeleteClosedHours, "value")} min="0" max="720" data-astro-cid-vusoyo76> <span class="dfx-hint" data-astro-cid-vusoyo76>${dt("The transcript is kept. 0 to keep the channels until someone deletes them.")}</span> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Default close reason")}</label> <textarea name="default_close_reason" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-ac="emojis" maxlength="300"${addAttribute(dt("Used when no reason is given"), "placeholder")} data-astro-cid-vusoyo76>${settings.defaultCloseReason}</textarea> </div> </div> </section> <section class="dfx-sec" data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${dt("Transcripts")}</h2><p data-astro-cid-vusoyo76>${dt("A transcript is the saved conversation of a ticket. It is made when the ticket closes or when staff press the transcript button.")}</p></div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Transcripts channel")}</label> <select name="transcript_channel_id" data-fill="tk-ch" data-astro-cid-vusoyo76> <option value="" data-astro-cid-vusoyo76>${dt("None")}</option> ${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": textChannels, "selected": settings.transcriptChannelId, "prefix": "#", "data-astro-cid-vusoyo76": true })} </select> <span class="dfx-hint" data-astro-cid-vusoyo76>${dt("Every transcript is also sent here, apart from the logs. Leave it empty to not use it.")}</span> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <span class="dfx-label" data-astro-cid-vusoyo76>${dt("How it is sent")}</span> <div class="sx-choices" data-astro-cid-vusoyo76> <label class="sx-choice" data-astro-cid-vusoyo76><input type="radio" name="transcript_mode" value="auto"${addAttribute(!["link", "file", "both"].includes(settings.transcriptMode), "checked")} data-astro-cid-vusoyo76><span class="sx-choice-body" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magic-wand-fill", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}<b data-astro-cid-vusoyo76>${dt("Automatic")}</b><em data-astro-cid-vusoyo76>${dt("A link, or the file if there is no link.")}</em></span></label> <label class="sx-choice" data-astro-cid-vusoyo76><input type="radio" name="transcript_mode" value="link"${addAttribute(settings.transcriptMode === "link", "checked")} data-astro-cid-vusoyo76><span class="sx-choice-body" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:link-bold", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}<b data-astro-cid-vusoyo76>${dt("Link")}</b><em data-astro-cid-vusoyo76>${dt("Link to read it online")}</em></span></label> <label class="sx-choice" data-astro-cid-vusoyo76><input type="radio" name="transcript_mode" value="file"${addAttribute(settings.transcriptMode === "file", "checked")} data-astro-cid-vusoyo76><span class="sx-choice-body" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:file-text-bold", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}<b data-astro-cid-vusoyo76>${dt("File")}</b><em data-astro-cid-vusoyo76>${dt("HTML file to download")}</em></span></label> <label class="sx-choice" data-astro-cid-vusoyo76><input type="radio" name="transcript_mode" value="both"${addAttribute(settings.transcriptMode === "both", "checked")} data-astro-cid-vusoyo76><span class="sx-choice-body" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:stack-fill", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}<b data-astro-cid-vusoyo76>${dt("Link and file")}</b><em data-astro-cid-vusoyo76>${dt("Both, one after the other.")}</em></span></label> </div> <span class="dfx-hint" data-astro-cid-vusoyo76>${dt("Applies to the logs, the transcripts channel and the message to the opener. The opener only gets it if the option to send it on close is on.")}</span> </div> </section> <section class="dfx-sec" data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${dt("Autoclose")}</h2><p data-astro-cid-vusoyo76>${dt("Tickets that close by themselves.")}</p></div> <div class="dfx-switches" data-astro-cid-vusoyo76> <label class="dfx-switch" data-astro-cid-vusoyo76><span data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("Close a member's tickets when they leave")}</b><em data-astro-cid-vusoyo76>${dt("No ticket stays open for someone who is gone.")}</em></span><input type="checkbox" class="dfx-t" name="autoclose_leave"${addAttribute(settings.autocloseLeave, "checked")} data-astro-cid-vusoyo76></label> <label class="dfx-switch" data-astro-cid-vusoyo76><span data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("Close tickets after a period of inactivity")}</b><em data-astro-cid-vusoyo76>${dt("A ticket nobody writes in is closed by itself.")}</em></span><input type="checkbox" class="dfx-t" name="autoclose_inactivity_enabled"${addAttribute(settings.autocloseInactivityEnabled, "checked")} data-astro-cid-vusoyo76></label> </div> <div class="dfx-field tkx-narrow" data-sx-needs="autoclose_inactivity_enabled" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Inactivity period (hours)")}</label> <input type="number" name="autoclose_inactivity_hours"${addAttribute(settings.autocloseInactivityHours, "value")} min="1" max="720" data-astro-cid-vusoyo76> </div> </section> <section class="dfx-sec" data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${dt("Ratings")}</h2><p data-astro-cid-vusoyo76>${dt("Let members say how the help was when the ticket closes.")}</p></div> <label class="dfx-switch" data-astro-cid-vusoyo76><span data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("Let members rate a ticket after it closes")}</b><em data-astro-cid-vusoyo76>${dt("They rate the help with stars.")}</em></span><input type="checkbox" class="dfx-t" name="rating_enabled"${addAttribute(settings.ratingEnabled, "checked")} data-astro-cid-vusoyo76></label> <div class="dfx-grid" data-sx-needs="rating_enabled" data-astro-cid-vusoyo76> <div class="dfx-field" data-astro-cid-vusoyo76> <span class="dfx-label" data-astro-cid-vusoyo76>${dt("Rating mode")}</span> <div class="dfx-chips" data-astro-cid-vusoyo76> <label class="dfx-chip" data-astro-cid-vusoyo76><input type="radio" name="rating_mode" value="rating_only"${addAttribute(settings.ratingMode !== "rating_comment", "checked")} data-astro-cid-vusoyo76>${dt("Stars only")}</label> <label class="dfx-chip" data-astro-cid-vusoyo76><input type="radio" name="rating_mode" value="rating_comment"${addAttribute(settings.ratingMode === "rating_comment", "checked")} data-astro-cid-vusoyo76>${dt("Stars + optional comment")}</label> </div> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Rating log channel")}</label> <select name="rating_log_channel_id" data-fill="tk-ch" data-astro-cid-vusoyo76> <option value="" data-astro-cid-vusoyo76>${dt("None")}</option> ${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": textChannels, "selected": settings.ratingLogChannelId, "prefix": "#", "data-astro-cid-vusoyo76": true })} </select> </div> </div> </section> <section class="dfx-sec" data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${dt("Logging")}</h2><p data-astro-cid-vusoyo76>${dt("Where Petto writes when a ticket opens and when it closes.")}</p></div> <div class="dfx-grid" data-astro-cid-vusoyo76> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Opened tickets log channel")}</label> <select name="opened_log_channel_id" data-fill="tk-ch" data-astro-cid-vusoyo76> <option value="" data-astro-cid-vusoyo76>${dt("None")}</option> ${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": textChannels, "selected": settings.openedLogChannelId, "prefix": "#", "data-astro-cid-vusoyo76": true })} </select> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Closed tickets log channel")}</label> <select name="closed_log_channel_id" data-fill="tk-ch" data-astro-cid-vusoyo76> <option value="" data-astro-cid-vusoyo76>${dt("None")}</option> ${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": textChannels, "selected": settings.closedLogChannelId, "prefix": "#", "data-astro-cid-vusoyo76": true })} </select> </div> </div> <span class="dfx-hint" data-astro-cid-vusoyo76>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("Separate from the Logging page's <b>Tickets</b> route, which can run alongside these dedicated channels."))}` })}</span> </section> <section class="dfx-sec" data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${dt("Limits")}</h2><p data-astro-cid-vusoyo76>${dt("How many tickets a member can have open at once.")}</p></div> <div class="dfx-field tkx-narrow" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Open tickets at the same time per member")}</label> <input type="number" name="global_limit"${addAttribute(settings.globalLimit, "value")} min="0" max="50" data-astro-cid-vusoyo76> <span class="dfx-hint" data-astro-cid-vusoyo76>${dt("In the whole server, whatever the type. 0 for no limit. Each type has its own limit too.")}</span> </div> </section> <section class="dfx-sec" data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${dt("Staff hours")}</h2><p data-astro-cid-vusoyo76>${dt("Say when the staff answers, and what members are told outside those hours.")}</p></div> <label class="dfx-master" data-astro-cid-vusoyo76><span data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("Tell members when the staff answers")}</b><em data-astro-cid-vusoyo76>${dt("The hours are shown to the member who opens a ticket.")}</em></span><input type="checkbox" class="dfx-t" name="hours_enabled"${addAttribute(settings.hoursEnabled, "checked")} data-astro-cid-vusoyo76></label> <div class="tkx-hours" data-sx-needs="hours_enabled" data-astro-cid-vusoyo76> <div class="dfx-grid dfx-grid-3" data-astro-cid-vusoyo76> <div class="dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("From")}</label><input type="time" name="hours_start"${addAttribute(settings.hoursStart, "value")} data-astro-cid-vusoyo76></div> <div class="dfx-field" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Until")}</label><input type="time" name="hours_end"${addAttribute(settings.hoursEnd, "value")} data-astro-cid-vusoyo76></div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Timezone")}</label> <select name="hours_timezone" data-astro-cid-vusoyo76> ${[.../* @__PURE__ */ new Set([settings.hoursTimezone, ...timezones])].map((tz) => renderTemplate`<option${addAttribute(tz, "value")}${addAttribute(tz === settings.hoursTimezone, "selected")} data-astro-cid-vusoyo76>${tz}</option>`)} </select> </div> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <span class="dfx-label" data-astro-cid-vusoyo76>${dt("Days")}</span> <div class="dfx-chips" data-astro-cid-vusoyo76> ${hourDays.map((d) => renderTemplate`<label class="dfx-chip" data-astro-cid-vusoyo76><input type="checkbox" name="hours_days"${addAttribute(d.n, "value")}${addAttribute(settings.hoursDays.includes(d.n), "checked")} data-astro-cid-vusoyo76>${d.label}</label>`)} </div> </div> <label class="dfx-switch" data-astro-cid-vusoyo76><span data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("Do not let tickets open outside these hours")}</b><em data-astro-cid-vusoyo76>${dt("Nobody can open a ticket outside the hours.")}</em></span><input type="checkbox" class="dfx-t" name="hours_block"${addAttribute(settings.hoursBlock, "checked")} data-astro-cid-vusoyo76></label> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Message outside the hours")}</label> <textarea name="hours_message" class="dgl-autogrow" data-count data-ac rows="3" maxlength="500"${addAttribute(dt("Our staff is away right now. They answer between {start} and {end} ({timezone}). Your ticket is open and someone will reply when they are back."), "placeholder")} data-astro-cid-vusoyo76>${settings.hoursMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-vusoyo76": true })} <span class="dfx-hint" data-astro-cid-vusoyo76>${dt("You can use {start}, {end} and {timezone}. Empty uses the message above.")}</span> </div> </div> </section> <section class="dfx-sec" data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${dt("Blocked roles")}</h2><p data-astro-cid-vusoyo76>${dt("Can't open new tickets. Doesn't affect tickets they already have.")}</p></div> <div class="dfx-field" data-astro-cid-vusoyo76> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "blocked_role_ids", "options": roles, "selected": settings.blockedRoleIds, "placeholder": dt("Search roles..."), "data-astro-cid-vusoyo76": true })} </div> </section> <div class="dfx-foot" data-astro-cid-vusoyo76><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-vusoyo76>${dt("Save settings")}</button></div> </form> </div>`, selectedSection === "replies" && renderTemplate`<div class="tkx-page" data-astro-cid-vusoyo76> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Quick replies"), value: quickReplies.length, tone: "messages" },
    { label: dt("Characters"), value: quickReplies.reduce((sum, r) => sum + r.content.length, 0), tone: "voice" }
  ], "data-astro-cid-vusoyo76": true })} <div class="tkx-head" data-astro-cid-vusoyo76> <h2 data-astro-cid-vusoyo76>${dt("Quick replies")} <span class="tkx-count" data-astro-cid-vusoyo76>${quickReplies.length}</span></h2> <p data-astro-cid-vusoyo76>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("Texts the staff send inside a ticket with one command: <code>!quickreply send name</code> (or <code>!qr send name</code>). Good for the questions that come up again and again."))}` })}</p> </div> ${quickReplies.length === 0 && renderTemplate`<p class="tkx-empty" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chat-circle-text-fill", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}${dt("No quick replies yet. Add the first one below.")}</p>`} <div class="tkx-list tkx-list-2 dgl-stagger" data-astro-cid-vusoyo76> ${quickReplies.map((r) => renderTemplate`<form method="POST" class="tkx-item tk-reply-item" data-astro-cid-vusoyo76> <input type="hidden" name="reply_name"${addAttribute(r.name, "value")} data-astro-cid-vusoyo76> <div class="tkx-item-head tkx-item-center" data-astro-cid-vusoyo76> <span class="tk-cat-emoji-chip tkx-icon" aria-hidden="true" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chat-circle-text-fill", "width": "17", "height": "17", "data-astro-cid-vusoyo76": true })}</span> <span class="tk-reply-title" data-astro-cid-vusoyo76><code class="tk-reply-name" data-astro-cid-vusoyo76>${r.name}</code><span class="tk-row-hint" data-astro-cid-vusoyo76>!qr send ${r.name}</span></span> <button type="submit" name="action" value="delete_reply" class="tk-cat-del tk-reply-del"${addAttribute(dt("Delete"), "title")}${addAttribute(dt("Delete"), "aria-label")}${addAttribute(dt("Delete this quick reply?"), "data-confirm")} formnovalidate data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-vusoyo76": true })}</button> </div> <div class="dfx-field" data-astro-cid-vusoyo76> <div class="tkx-vars" role="group"${addAttribute(dt("Add a variable"), "aria-label")} data-astro-cid-vusoyo76>${["{user}", "{username}", "{category}", "{server}", "{number}"].map((v) => renderTemplate`<button type="button" class="tkx-var"${addAttribute(v, "data-tk-var")} data-astro-cid-vusoyo76>${v}</button>`)}</div> <textarea name="reply_content" class="dgl-autogrow" data-count data-ac rows="4" maxlength="1500" data-astro-cid-vusoyo76>${r.content}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-vusoyo76": true })} </div> <div class="tk-panel-actions" data-astro-cid-vusoyo76> <button type="submit" name="action" value="save_reply" class="btn btn-accent btn-sm" data-astro-cid-vusoyo76>${dt("Save")}</button> </div> </form>`)} </div> <form method="POST" class="dfx-form tkx-add" data-no-dirty data-astro-cid-vusoyo76> <input type="hidden" name="action" value="save_reply" data-astro-cid-vusoyo76> <div class="dfx-sec-head" data-astro-cid-vusoyo76><h2 data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-vusoyo76": true })}${dt("New quick reply")}</h2></div> <div class="dfx-field tkx-narrow" data-astro-cid-vusoyo76><label data-astro-cid-vusoyo76>${dt("Name")}</label><input type="text" name="reply_name" maxlength="30" pattern="[a-zA-Z0-9][a-zA-Z0-9_\-]{0,29}" placeholder="rules" required data-astro-cid-vusoyo76></div> <div class="dfx-field" data-astro-cid-vusoyo76> <label data-astro-cid-vusoyo76>${dt("Text")}</label> <div class="tkx-vars" role="group"${addAttribute(dt("Add a variable"), "aria-label")} data-astro-cid-vusoyo76>${["{user}", "{username}", "{category}", "{server}", "{number}"].map((v) => renderTemplate`<button type="button" class="tkx-var"${addAttribute(v, "data-tk-var")} data-astro-cid-vusoyo76>${v}</button>`)}</div> <textarea name="reply_content" class="dgl-autogrow" data-count data-ac rows="4" maxlength="1500"${addAttribute(dt("Hi {user}! Please read the rules and tell us what you need."), "placeholder")} required data-astro-cid-vusoyo76></textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-vusoyo76": true })} <span class="dfx-hint" data-astro-cid-vusoyo76>${dt("You can use {user}, {username}, {category}, {server} and {number}.")}</span> </div> <div class="dfx-foot" data-astro-cid-vusoyo76><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "13", "height": "13", "data-astro-cid-vusoyo76": true })}${dt("Save quick reply")}</button></div> </form> </div>`, selectedSection === "open" && renderTemplate`<div class="tkx-page tkx-open" data-astro-cid-vusoyo76> ${stats && renderTemplate`${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "against": dt("vs before"), "tiles": [
    { label: dt("Open now"), value: stats.open, tone: "joins" },
    { label: dt("Without a claimer"), value: stats.unclaimed, tone: "reactions" },
    { label: dt("Opened in 7 days"), value: stats.opened7, tone: "messages", change: stats.opened7Change },
    { label: dt("Closed in 7 days"), value: stats.closed7, tone: "invites", change: stats.closed7Change },
    { label: dt("Average time open"), value: stats.averageMinutesOpen ?? 0, text: minutesText(stats.averageMinutesOpen, dashLocale(dashLang)), tone: "voice" },
    { label: `${dt("Rating")}${stats.ratingCount ? ` (${stats.ratingCount})` : ""}`, value: stats.averageRating ?? 0, text: stats.averageRating === null ? "-" : `${stats.averageRating} / 5`, tone: "leaves" }
  ], "data-astro-cid-vusoyo76": true })}`} <div class="tkx-head" data-astro-cid-vusoyo76> <h2 data-astro-cid-vusoyo76>${dt("Open tickets")} <span class="tkx-count" data-astro-cid-vusoyo76>${openTickets.length}</span></h2> <p data-astro-cid-vusoyo76>${dt("The list updates by itself while this page is open. Pick a ticket to read it and answer from here.")}</p> </div> ${renderComponent($$result2, "TicketLive", $$TicketLive, { "guildId": guildId, "openCount": openTickets.length, "viewOnly": viewOnly, "me": me, "data-astro-cid-vusoyo76": true })} <div class="tkx-split" data-astro-cid-vusoyo76> <div class="tkx-closed" data-astro-cid-vusoyo76> <div class="tkx-head" data-astro-cid-vusoyo76> <h2 data-astro-cid-vusoyo76>${dt("Closed, with transcript")} <span class="tkx-count" data-astro-cid-vusoyo76>${closedTickets.length}</span></h2> </div> ${closedTickets.length === 0 ? renderTemplate`<p class="tkx-empty" data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:archive-fill", "width": "18", "height": "18", "data-astro-cid-vusoyo76": true })}${dt("No closed ticket with a saved transcript yet.")}</p>` : renderTemplate`<div class="tkx-rows dgl-stagger" data-closed-list data-astro-cid-vusoyo76> ${closedTickets.map((t) => renderTemplate`<div class="tkx-row" data-astro-cid-vusoyo76> <img class="tk-block-av"${addAttribute(t.openerAvatar ?? `https://cdn.discordapp.com/embed/avatars/${Number(String(t.openerId).slice(-3)) % 6}.png`, "src")} alt="" width="36" height="36" loading="lazy" data-astro-cid-vusoyo76> <div class="tkx-row-main" data-astro-cid-vusoyo76> <b data-astro-cid-vusoyo76><span class="tk-open-num" data-astro-cid-vusoyo76>#${String(t.number).padStart(4, "0")}</span> ${t.categoryLabel}</b> <span class="tkx-row-reason" data-astro-cid-vusoyo76>${t.openerName ?? t.openerId}${t.closedAt && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` · <time${addAttribute(t.closedAt, "datetime")} data-tk-ago${addAttribute(dt("{a} ago"), "data-ago")}${addAttribute(dt("just now"), "data-now")} data-astro-cid-vusoyo76>${new Date(t.closedAt).toISOString().slice(0, 10)}</time>` })}`}${t.reason && ` \xB7 ${t.reason.slice(0, 80)}`}</span> </div> <button type="button" class="btn btn-ghost btn-sm"${addAttribute(t.number, "data-transcript")} data-astro-cid-vusoyo76>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:scroll-fill", "width": "13", "height": "13", "data-astro-cid-vusoyo76": true })}${dt("Transcript")}</button> </div>`)} </div>`} </div> ${stats && renderTemplate`<div class="tkx-chart" role="img"${addAttribute(dt("Tickets opened and closed in the last 14 days"), "aria-label")} data-astro-cid-vusoyo76> <div class="tkx-chart-head" data-astro-cid-vusoyo76><b data-astro-cid-vusoyo76>${dt("Last 14 days")}</b><span class="tk-key tk-key-open" data-astro-cid-vusoyo76>${dt("Opened")}</span><span class="tk-key tk-key-closed" data-astro-cid-vusoyo76>${dt("Closed")}</span></div> <div class="tkx-chart-bars" data-astro-cid-vusoyo76> ${(() => {
    const max = Math.max(1, ...stats.days.map((d) => Math.max(d.opened, d.closed)));
    return stats.days.map((d, i) => renderTemplate`<div class="tkx-bar"${addAttribute(`--i:${i}`, "style")}${addAttribute(`${d.label}: ${d.opened} / ${d.closed}`, "title")} data-astro-cid-vusoyo76> <div class="tkx-bar-cols" data-astro-cid-vusoyo76><i class="tk-col-open"${addAttribute(`height:${Math.round(d.opened / max * 100)}%`, "style")} data-astro-cid-vusoyo76></i><i class="tk-col-closed"${addAttribute(`height:${Math.round(d.closed / max * 100)}%`, "style")} data-astro-cid-vusoyo76></i></div> <span data-astro-cid-vusoyo76>${d.label.slice(3)}</span> </div>`);
  })()} </div> </div>`} </div> </div>`, ["panels", "settings"].includes(selectedSection) && renderTemplate`${renderComponent($$result2, "SelectSource", $$SelectSource, { "name": "tk-ch", "items": textChannels.map((c) => ({ id: c.id, name: c.name })), "prefix": "#", "data-astro-cid-vusoyo76": true })}`, renderComponent($$result2, "EmojiPicker", $$EmojiPicker, { "customEmojis": customEmojis, "data-astro-cid-vusoyo76": true }), addAttribute(JSON.stringify({ transcriptFailed: dt("The transcript could not be opened."), clickHint: dt("Click a button below to open a ticket.") }), "data-tk-text")) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashTickets.astro", void 0);

const BUTTON_STYLE = { primary: 1, secondary: 2, success: 3, danger: 4 };
function parseEmoji(raw) {
  if (!raw) return void 0;
  const custom = raw.match(/^<(a?):(\w+):(\d+)>$/);
  if (custom) return { name: custom[2], id: custom[3], animated: custom[1] === "a" };
  return { name: raw };
}
function buildCategoryRow(style, categories, placeholder) {
  if (categories.length === 0) return null;
  if (style === "select") {
    return {
      type: 1,
      components: [
        {
          type: 3,
          custom_id: "tk_open_select",
          placeholder: (placeholder || "Select a ticket category...").slice(0, 150),
          options: categories.slice(0, 25).map((c) => ({
            label: c.label.slice(0, 100),
            value: c.key,
            description: c.description ? c.description.slice(0, 100) : void 0,
            emoji: parseEmoji(c.emoji)
          }))
        }
      ]
    };
  }
  return {
    type: 1,
    components: categories.slice(0, 5).map((c) => ({
      type: 2,
      style: BUTTON_STYLE[c.buttonStyle] ?? 1,
      label: c.label.slice(0, 80),
      custom_id: `tk_open::${c.key}`,
      emoji: parseEmoji(c.emoji)
    }))
  };
}
function resolveGuildVariables(text, g, channelId) {
  if (!text) return text;
  const created = new Date(g.createdTimestamp);
  const channel = channelId ? g.channels[channelId] : void 0;
  const channelCreated = channel ? new Date(channel.createdTimestamp) : null;
  const boostRequired = [0, 2, 7, 14][Math.min(Math.max(g.boostTier + 1, 0), 3)] ?? 14;
  const nextBoostLevel = Math.min(g.boostTier + 1, 3);
  const boostUntil = Math.max(0, boostRequired - g.boostCount);
  const unavailable = "N/A";
  const map = {
    "{server_name}": g.name,
    "{server_id}": g.id,
    "{server_prefix}": g.prefix,
    "{server_membercount}": String(g.memberCount),
    "{server_membercount_ordinal}": ordinal(g.memberCount),
    "{server_membercount_nobots}": unavailable,
    "{server_membercount_nobots_ordinal}": unavailable,
    "{server_botcount}": unavailable,
    "{server_botcount_ordinal}": unavailable,
    "{server_icon}": g.iconUrl ?? "",
    "{server_rolecount}": String(g.roleCount),
    "{server_channelcount}": String(g.channelCount),
    "{server_randommember}": unavailable,
    "{server_randommember_tag}": unavailable,
    "{server_randommember_nobots}": unavailable,
    "{server_owner}": `<@${g.ownerId}>`,
    "{server_owner_id}": g.ownerId,
    "{server_createdate}": created.toLocaleDateString("en-US"),
    "{server_boostlevel}": String(g.boostTier),
    "{server_boostcount}": String(g.boostCount),
    "{server_nextboostlevel}": String(nextBoostLevel),
    "{server_nextboostlevel_required}": String(boostRequired),
    "{server_nextboostlevel_until_required}": String(boostUntil),
    "{guild.name}": g.name,
    "{guild.id}": g.id,
    "{guild.count}": String(g.memberCount),
    "{guild.icon}": g.iconUrl ?? "N/A",
    "{guild.banner}": g.bannerUrl ?? "N/A",
    "{guild.owner_id}": g.ownerId,
    "{guild.created_at}": created.toLocaleDateString("en-US"),
    "{guild.created_at_timestamp}": String(Math.floor(g.createdTimestamp / 1e3)),
    "{guild.emoji_count}": String(g.emojiCount),
    "{guild.role_count}": String(g.roleCount),
    "{guild.boost_count}": String(g.boostCount),
    "{guild.boost_tier}": g.boostTier > 0 ? `Level ${g.boostTier}` : "No Level",
    "{guild.channels_count}": String(g.channelCount),
    "{guild.vanity}": g.vanityCode ? `discord.gg/${g.vanityCode}` : "N/A",
    "{guild.region}": g.preferredLocale,
    "{guild.max_members}": String(g.maxMembers),
    "{channel}": channel ? `<#${channel.id}>` : unavailable,
    "{channel.mention}": channel ? `<#${channel.id}>` : unavailable,
    "{channel.name}": channel?.name ?? unavailable,
    "{channel.id}": channel?.id ?? unavailable,
    "{channel.topic}": channel?.topic ?? unavailable,
    "{channel_name}": channel?.name ?? unavailable,
    "{channel_createdate}": channelCreated ? channelCreated.toLocaleDateString("en-US") : unavailable,
    "{newline}": "\n",
    "{separator}": "──────────────────────"
  };
  let out = text;
  for (const [token, value] of Object.entries(map)) out = out.split(token).join(value);
  return out;
}
function ordinal(n) {
  const suffix = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return `${n}${suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0]}`;
}
function normalizeTemplateData(data) {
  if (Array.isArray(data?.embeds)) return { content: data.content ?? "", embeds: data.embeds, buttons: data.buttons ?? [] };
  const looksLikeEmbed = data?.title || data?.description || data?.author?.name || data?.footer?.text || data?.fields?.length || data?.image || data?.thumbnail || data?.color != null;
  return { content: "", embeds: looksLikeEmbed ? [data] : [], buttons: [] };
}
function buildEmbedFromData(e, g, channelId) {
  const r = (s) => s ? resolveGuildVariables(s, g, channelId) : void 0;
  const embed = {};
  if (e.title) embed.title = r(e.title);
  if (e.description) embed.description = r(e.description);
  if (e.color != null) embed.color = e.color;
  if (e.url) embed.url = r(e.url);
  if (e.thumbnail) embed.thumbnail = { url: r(e.thumbnail) };
  if (e.image) embed.image = { url: r(e.image) };
  if (e.timestamp) embed.timestamp = (/* @__PURE__ */ new Date()).toISOString();
  if (e.author?.name) embed.author = { name: r(e.author.name), icon_url: e.author.icon ? r(e.author.icon) : void 0, url: e.author.url ?? void 0 };
  if (e.footer?.text) embed.footer = { text: r(e.footer.text), icon_url: e.footer.icon ? r(e.footer.icon) : void 0 };
  if (e.fields?.length) embed.fields = e.fields.map((f) => ({ name: r(f.name), value: r(f.value), inline: f.inline ?? false }));
  return embed;
}
function buildLinkButtonRows(buttons) {
  return (buttons ?? []).map((row) => {
    const btns = (row ?? []).filter((b) => b?.label?.trim() && b?.url);
    if (!btns.length) return null;
    return { type: 1, components: btns.map((b) => ({ type: 2, style: 5, label: b.label, url: b.url, disabled: Boolean(b.disabled) })) };
  }).filter(Boolean);
}
function resolveV2(node, g, channelId) {
  if (Array.isArray(node)) return node.map((item) => resolveV2(item, g, channelId));
  if (!node || typeof node !== "object") return node;
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === "string" && ["content", "label", "description", "placeholder", "title"].includes(key)) out[key] = resolveGuildVariables(value, g, channelId);
    else out[key] = resolveV2(value, g, channelId);
  }
  return out;
}
const COMPONENTS_V2 = 1 << 15;
const DEFAULT_PANEL_COLOR = 10873466;
function buildDefaultPanelCard(panel, hasTypes) {
  const children = [];
  if (panel.image_url && /^https:\/\//i.test(panel.image_url)) children.push({ type: 12, items: [{ media: { url: panel.image_url } }] });
  const text = panel.description || (hasTypes ? "Click a button below to open a ticket." : "No ticket types configured yet.");
  children.push({ type: 10, content: `${panel.title ? `### ${panel.title}
` : ""}${text}` });
  if (panel.footer) children.push({ type: 14, divider: true, spacing: 1 }, { type: 10, content: `-# ${panel.footer.slice(0, 300)}` });
  return { type: 17, accent_color: Number.isInteger(panel.color) ? panel.color : DEFAULT_PANEL_COLOR, components: children };
}
function buildPanelPayload(panel, style, categories, templateData, guildVars) {
  const categoryRow = buildCategoryRow(style, categories, panel.placeholder);
  if (templateData && guildVars && Array.isArray(templateData.v2?.components) && templateData.v2.components.length) {
    const components = [...resolveV2(templateData.v2.components, guildVars, panel.channel_id ?? ""), ...categoryRow ? [categoryRow] : []];
    return { flags: COMPONENTS_V2, components };
  }
  if (templateData && guildVars) {
    const { content, embeds, buttons } = normalizeTemplateData(templateData);
    const templateRows = buildLinkButtonRows(buttons);
    const rows = [...templateRows, ...categoryRow ? [categoryRow] : []].slice(0, 5);
    const resolvedContent = content ? resolveGuildVariables(content, guildVars, panel.channel_id) : void 0;
    const resolvedEmbeds = embeds.slice(0, 10).map((e) => buildEmbedFromData(e, guildVars, panel.channel_id ?? "")).filter((e) => Object.keys(e).length > 0);
    if (resolvedContent?.trim() || resolvedEmbeds.length) return { content: resolvedContent, embeds: resolvedEmbeds, components: rows };
  }
  return { flags: COMPONENTS_V2, components: [buildDefaultPanelCard(panel, categories.length > 0), ...categoryRow ? [categoryRow] : []] };
}
function panelWarnings(categories, templateName, templateData) {
  const out = [];
  if (categories.length === 0) out.push("no_types");
  if (templateName && !templateData) out.push("template_missing");
  else if (templateData) {
    const v2 = Array.isArray(templateData.v2?.components) && templateData.v2.components.length > 0;
    const { content, embeds } = normalizeTemplateData(templateData);
    if (!v2 && !content.trim() && !embeds.some((e) => Object.keys(e ?? {}).length > 0)) out.push("template_empty");
  }
  return out;
}
const panelPostIssue = { detail: "", code: 0, status: 0 };
async function readDiscordIssue(res) {
  const text = await res.text().catch(() => "");
  panelPostIssue.status = res.status;
  try {
    const body = JSON.parse(text);
    panelPostIssue.code = Number(body?.code) || 0;
    const nested = body?.errors ? JSON.stringify(body.errors).slice(0, 160) : "";
    return `Discord said: ${String(body?.message ?? res.status)}${body?.code ? ` (${body.code})` : ""}${nested ? ` ${nested}` : ""}`;
  } catch {
    return `Discord answered ${res.status}.`;
  }
}
async function postOrRefreshPanelMessage(botToken, channelId, existingMessageId, payload) {
  const headers = { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" };
  panelPostIssue.detail = "";
  panelPostIssue.code = 0;
  panelPostIssue.status = 0;
  const isV2 = Boolean((payload.flags ?? 0) & COMPONENTS_V2);
  if (existingMessageId) {
    const editRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${existingMessageId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload)
    });
    if (editRes.ok) return existingMessageId;
    console.warn("[ticket-panel] Discord message edit failed", { channelId, messageId: existingMessageId, status: editRes.status });
    if (editRes.status === 400) {
      const old = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${existingMessageId}`, { headers });
      const oldBody = old.ok ? await old.json().catch(() => null) : null;
      const oldIsV2 = Boolean((oldBody?.flags ?? 0) & COMPONENTS_V2);
      if (oldBody && oldIsV2 !== isV2) await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${existingMessageId}`, { method: "DELETE", headers: { Authorization: headers.Authorization } }).catch(() => null);
    }
  }
  const createRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  if (!createRes.ok) {
    panelPostIssue.detail = await readDiscordIssue(createRes);
    console.error("[ticket-panel] Discord message create failed", { channelId, status: createRes.status, detail: panelPostIssue.detail });
    return null;
  }
  const message = await createRes.json();
  return message.id ?? null;
}
async function deletePanelMessage(botToken, channelId, messageId) {
  if (!messageId) return true;
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    method: "DELETE",
    headers: { Authorization: `Bot ${botToken}` }
  }).catch(() => null);
  const ok = Boolean(res && (res.ok || res.status === 404));
  if (!ok) console.error("[ticket-panel] Discord message delete failed", { channelId, messageId, status: res?.status ?? "network-error" });
  return ok;
}

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Tickets = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Tickets;
  const dt = makeT(getDashLang(Astro2));
  function normalizeKey(key) {
    return key.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  }
  function multiline(value) {
    return String(value ?? "").replace(/\r\n?/g, "\n").trim();
  }
  function parseTicketEmoji(raw) {
    const text = raw.trim();
    if (!text) return { value: null, invalid: false };
    const custom = /^<a?:\w{2,32}:\d{15,25}>$/.test(text);
    const unicode = /^(?:\p{Extended_Pictographic}(?:[\u{FE0F}\u{1F3FB}-\u{1F3FF}]|\u{200D}\p{Extended_Pictographic})*|[0-9#*]\u{FE0F}?\u{20E3}|\p{Regional_Indicator}{2})$/u.test(text);
    return custom || unicode ? { value: text.slice(0, 64), invalid: false } : { value: null, invalid: true };
  }
  function ticketFieldsMessage(code) {
    if (code === "count") return dt("A form needs 1 to 5 questions.");
    if (code === "input") return dt("A form needs at least one question that members answer, not only texts.");
    if (code === "label") return dt("Every question needs its text.");
    if (code === "text") return dt("A text that only informs needs its text.");
    if (code === "options") return dt("Check the choices: a dropdown takes 1 to 25, radio buttons 2 to 10 and checkboxes 1 to 10.");
    return dt("A question has a type that is not known.");
  }
  function parseTicketFormFields(spec) {
    const plain = spec.trim();
    if (plain && !plain.includes("|") && !plain.includes(";")) {
      return [{ type: "long_text", id: "field_1", label: plain.slice(0, 45), placeholder: "", required: true }];
    }
    const fields = spec.split(";").map((part) => part.trim()).filter(Boolean).map((part, index) => {
      const [type, fieldId, label, placeholder, required] = part.split("|").map((value) => value?.trim());
      return { type: type || "short_text", id: fieldId || `field_${index + 1}`, label: label || "", placeholder: placeholder || "", required: required !== "optional" && required !== "false" };
    });
    if (fields.length < 1 || fields.length > 5 || fields.some((field) => !["short_text", "long_text"].includes(field.type) || !field.id || !field.label)) return null;
    return fields;
  }
  const { id } = Astro2.params;
  const section = Astro2.url.searchParams.get("section") ?? "panels";
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  const viewOnly = Boolean(auth.devView) || Boolean(auth.access && !pageDecision(auth.access, "tickets").canEdit);
  const premiumActive = await hasPremiumForGuild(Astro2, session.userId, id);
  const ticketCategoryLimit = planLimits(premiumActive).ticketCategories;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
  function logTicketPanel(event, details = {}) {
    console.log(JSON.stringify({ scope: "ticket-panel", event, guildId: id, ...details }));
  }
  let cachedGuildVars;
  async function getGuildVars() {
    if (cachedGuildVars !== void 0) return cachedGuildVars;
    const [g, channelsRes2, prefixRes] = await Promise.all([
      getGuildDetails(id, botToken),
      getGuildList(Astro2, id, botToken, "channels"),
      fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${id}&select=prefix`, { headers: apiHeaders })
    ]);
    if (!g) {
      cachedGuildVars = null;
      return null;
    }
    const channels = channelsRes2?.ok ? await channelsRes2.json() : [];
    const prefixRows = prefixRes.ok ? await prefixRes.json() : [];
    const channelVars = Object.fromEntries(channels.map((channel) => [channel.id, {
      id: channel.id,
      name: channel.name ?? "",
      topic: channel.topic ?? null,
      createdTimestamp: Number((BigInt(channel.id) >> 22n) + 1420070400000n)
    }]));
    cachedGuildVars = {
      id: g.id,
      name: g.name,
      iconUrl: g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=512` : null,
      bannerUrl: g.banner ? `https://cdn.discordapp.com/banners/${g.id}/${g.banner}.png?size=1024` : null,
      ownerId: g.owner_id,
      createdTimestamp: Number((BigInt(g.id) >> 22n) + 1420070400000n),
      memberCount: g.approximate_member_count ?? 0,
      roleCount: (g.roles ?? []).length,
      channelCount: channels.length,
      emojiCount: (g.emojis ?? []).length,
      boostTier: g.premium_tier ?? 0,
      boostCount: g.premium_subscription_count ?? 0,
      vanityCode: g.vanity_url_code ?? null,
      preferredLocale: g.preferred_locale ?? "en-US",
      maxMembers: g.max_members ?? 0,
      prefix: prefixRows[0]?.prefix ?? "/",
      channels: channelVars
    };
    return cachedGuildVars;
  }
  async function getTemplateData(name) {
    if (!name) return null;
    const res = await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}&select=data`, { headers: apiHeaders });
    if (!res.ok) return null;
    const [row] = await res.json();
    return row?.data ?? null;
  }
  let saved = false;
  let error = null;
  const warnings = [];
  function panelReason() {
    const code = panelPostIssue.code;
    const reasons = {
      50013: dt("I'm missing permissions in that channel. I need View Channel, Send Messages and Embed Links."),
      50001: dt("I can't see that channel. Give me View Channel there."),
      10003: dt("That channel no longer exists. Move the panel to another one."),
      50006: dt("The message would be empty. Add a title or a description, or pick a design that has content."),
      50035: dt("Discord refused the content of the panel. Check the title, the description and the design.")
    };
    if (reasons[code]) return reasons[code];
    if (panelPostIssue.status === 403) return reasons[50013];
    return panelPostIssue.detail || dt("Discord did not accept the panel. Try again in a moment.");
  }
  const panelFailure = (lead) => `${lead} ${panelReason()}`;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const sentActions = form.getAll("action").map(String).filter(Boolean);
    const action = sentActions[sentActions.length - 1] ?? (form.get("category_id") ? "update" : "");
    logTicketPanel("request", { action: action || "(empty)", method: Astro2.request.method });
    if (action === "create") {
      const label = String(form.get("label") ?? "").trim().slice(0, 40);
      const { value: emoji, invalid: emojiInvalid } = parseTicketEmoji(String(form.get("emoji") ?? ""));
      const parentChannelId = String(form.get("parent_channel_id") ?? "").trim() || null;
      const panelId = String(form.get("panel_id") ?? "").trim() || null;
      if (emojiInvalid) {
        error = dt("That is not an emoji Discord accepts on a button. Use a normal emoji, or a custom one pasted as <:name:123456789012345678>.");
      } else if (label) {
        const countRes = await fetch(`${apiUrl}/rest/v1/ticket_categories?guild_id=eq.${id}&select=id`, { headers: apiHeaders });
        const current = countRes.ok ? await countRes.json() : null;
        if (!current) {
          error = dt("Couldn't check the ticket type limit, try again.");
        } else if (current.length >= ticketCategoryLimit) {
          error = premiumActive ? dt("You have reached the {n} ticket type limit.", { n: ticketCategoryLimit }) : dt("The Free plan includes {a} ticket types. Premium unlocks up to {b}.", { a: FREE_LIMITS.ticketCategories, b: PREMIUM_LIMITS.ticketCategories });
        } else {
          const key = `${normalizeKey(label)}-${Date.now().toString(36)}`;
          const res = await fetch(`${apiUrl}/rest/v1/ticket_categories`, {
            method: "POST",
            headers: { ...apiHeaders, Prefer: "return=minimal" },
            body: JSON.stringify({ guild_id: id, key, label, emoji, parent_channel_id: parentChannelId, panel_id: panelId })
          });
          if (res.ok) {
            saved = true;
            if (panelId) await refreshPanelById(panelId);
          } else error = dt("Couldn't add that ticket type, try again.");
        }
      }
    } else if (action === "update") {
      const categoryId = encodeURIComponent(String(form.get("category_id") ?? ""));
      const label = String(form.get("label") ?? "").trim().slice(0, 40);
      const { value: emoji, invalid: emojiInvalid } = parseTicketEmoji(String(form.get("emoji") ?? ""));
      const description = String(form.get("description") ?? "").trim().slice(0, 100) || null;
      const buttonStyle = String(form.get("button_style") ?? "primary");
      const namingPattern = String(form.get("naming_pattern") ?? "").trim().slice(0, 50) || "ticket-{number}";
      const parentChannelId = String(form.get("parent_channel_id") ?? "").trim() || null;
      const welcomeSupported = form.get("welcome_supported") === "1";
      const welcomeMessage = multiline(form.get("welcome_message")).slice(0, 1e3) || null;
      const supportRoleIds = form.getAll("support_role_ids").map(String);
      const pingRoleIds = form.getAll("ping_role_ids").map(String);
      const requiredRoleIds = form.getAll("required_role_ids").map(String);
      const formIdRaw = String(form.get("form_id") ?? "").trim();
      const formId = formIdRaw ? Number(formIdRaw) : null;
      const maxOpenPerUser = Math.max(1, Math.min(10, Number(form.get("max_open_per_user") ?? 1) || 1));
      const panelId = String(form.get("panel_id") ?? "").trim() || null;
      const beforeRes = await fetch(`${apiUrl}/rest/v1/ticket_categories?id=eq.${categoryId}&guild_id=eq.${id}&select=panel_id`, { headers: apiHeaders }).catch(() => null);
      const [before] = beforeRes?.ok ? await beforeRes.json().catch(() => []) : [];
      const res = await fetch(`${apiUrl}/rest/v1/ticket_categories?id=eq.${categoryId}&guild_id=eq.${id}`, {
        method: "PATCH",
        headers: { ...apiHeaders, Prefer: "return=minimal" },
        body: JSON.stringify({
          label,
          ...emojiInvalid ? {} : { emoji },
          description,
          button_style: buttonStyle,
          naming_pattern: namingPattern,
          parent_channel_id: parentChannelId,
          support_role_ids: supportRoleIds,
          ping_role_ids: pingRoleIds,
          // Only sent when the database has the column (the field is only shown then), so saving keeps working before it is added.
          ...welcomeSupported ? { welcome_message: welcomeMessage } : {},
          max_open_per_user: maxOpenPerUser,
          panel_id: panelId,
          form_id: Number.isFinite(formId) ? formId : null,
          required_role_ids: requiredRoleIds
        })
      });
      if (res.ok) {
        saved = true;
        if (panelId) await refreshPanelById(panelId);
        if (before?.panel_id && String(before.panel_id) !== String(panelId ?? "")) await refreshPanelById(String(before.panel_id));
      } else error = dt("Couldn't save that ticket type, try again.");
      if (emojiInvalid && res.ok) error = dt("That is not an emoji Discord accepts on a button. Use a normal emoji, or a custom one pasted as <:name:123456789012345678>. The rest was saved and the emoji did not change.");
    } else if (action === "create_ticket_form" || action === "update_ticket_form") {
      const name = String(form.get("form_name") ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-").slice(0, 50);
      const title = String(form.get("form_title") ?? dt("Ticket details")).trim().slice(0, 45) || dt("Ticket details");
      let fields = null;
      let fieldsError = null;
      const json = String(form.get("form_fields_json") ?? "").trim();
      if (json) {
        let parsed = null;
        try {
          parsed = JSON.parse(json);
        } catch {
          parsed = null;
        }
        const checked = cleanTicketFields(parsed);
        if ("fields" in checked) fields = checked.fields;
        else fieldsError = ticketFieldsMessage(checked.error);
      } else {
        fields = parseTicketFormFields(String(form.get("form_fields") ?? ""));
      }
      if (!name || !fields) {
        error = fieldsError ?? dt("Use 1 to 5 questions, and at least one that members answer.");
      } else {
        const formPayload = { guild_id: id, name, title, fields };
        const endpoint = action === "create_ticket_form" ? `${apiUrl}/rest/v1/ticket_forms` : `${apiUrl}/rest/v1/ticket_forms?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}`;
        const res = await fetch(endpoint, { method: action === "create_ticket_form" ? "POST" : "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify(action === "create_ticket_form" ? formPayload : { title, fields, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
        if (res.ok) saved = true;
        else error = dt("Couldn't save that ticket form, try again.");
      }
    } else if (action === "delete_ticket_form") {
      const formId = String(form.get("form_id") ?? "").trim();
      const res = await fetch(`${apiUrl}/rest/v1/ticket_forms?id=eq.${encodeURIComponent(formId)}&guild_id=eq.${id}`, { method: "DELETE", headers: { ...apiHeaders, Prefer: "return=minimal" } });
      if (res.ok) saved = true;
      else error = dt("Couldn't delete that ticket form.");
    } else if (action === "add_ticket_blacklist" || action === "remove_ticket_blacklist") {
      const targetType = form.get("target_type") === "role" ? "role" : "user";
      const targetId = String(form.get("target_id") ?? "").trim();
      if (!/^\d{5,25}$/.test(targetId)) {
        error = dt("Enter a valid Discord user or role ID.");
      } else if (action === "add_ticket_blacklist") {
        const res = await fetch(`${apiUrl}/rest/v1/ticket_blacklist?on_conflict=guild_id,target_type,target_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, target_type: targetType, target_id: targetId, reason: String(form.get("reason") ?? "").trim().slice(0, 300) || null }) });
        if (res.ok) saved = true;
        else error = dt("Couldn't add that ticket blacklist entry.");
      } else {
        const res = await fetch(`${apiUrl}/rest/v1/ticket_blacklist?guild_id=eq.${id}&target_type=eq.${targetType}&target_id=eq.${targetId}`, { method: "DELETE", headers: { ...apiHeaders, Prefer: "return=minimal" } });
        if (res.ok) saved = true;
        else error = dt("Couldn't remove that ticket blacklist entry.");
      }
    } else if (action === "disable") {
      const categoryId = encodeURIComponent(String(form.get("category_id") ?? "").trim());
      const beforeRes = await fetch(`${apiUrl}/rest/v1/ticket_categories?id=eq.${categoryId}&guild_id=eq.${id}&select=panel_id`, { headers: apiHeaders }).catch(() => null);
      const [before] = beforeRes?.ok ? await beforeRes.json().catch(() => []) : [];
      const res = await fetch(`${apiUrl}/rest/v1/ticket_categories?id=eq.${categoryId}&guild_id=eq.${id}`, {
        method: "PATCH",
        headers: { ...apiHeaders, Prefer: "return=minimal" },
        body: JSON.stringify({ panel_id: null })
      });
      if (res.ok) {
        saved = true;
        if (before?.panel_id) await refreshPanelById(String(before.panel_id));
      } else error = dt("Couldn't turn that ticket type off, try again.");
    } else if (action === "delete") {
      const rawCategoryId = String(form.get("category_id") ?? "").trim();
      const categoryId = encodeURIComponent(rawCategoryId);
      const usedRes = await fetch(`${apiUrl}/rest/v1/tickets?category_id=eq.${categoryId}&guild_id=eq.${id}&select=id&limit=1`, { headers: apiHeaders });
      const used = usedRes.ok ? await usedRes.json().catch(() => null) : null;
      if (!Array.isArray(used)) {
        error = dt("Couldn't check whether this type has tickets, so it was not deleted. Try again.");
      } else if (used.length > 0) {
        error = dt("This type has tickets saved. Deleting it would also erase their history and transcripts, so it was not deleted. Use Turn off instead: nobody can open it, and the history stays.");
      } else {
        const categoryRes = await fetch(`${apiUrl}/rest/v1/ticket_categories?id=eq.${categoryId}&guild_id=eq.${id}&select=panel_id`, { headers: apiHeaders });
        const [category] = categoryRes.ok ? await categoryRes.json() : [];
        const res = await fetch(`${apiUrl}/rest/v1/ticket_categories?id=eq.${categoryId}&guild_id=eq.${id}`, {
          method: "DELETE",
          headers: { ...apiHeaders, Prefer: "return=representation" }
        });
        if (res.ok) {
          const deleted = await res.json().catch(() => []);
          if (Array.isArray(deleted) && deleted.length > 0) {
            saved = true;
            if (category?.panel_id) await refreshPanelById(String(category.panel_id));
          } else {
            error = dt("That ticket type was not found or was already deleted.");
          }
        } else {
          error = dt("Couldn't delete that ticket type. It may still be referenced by existing tickets.");
        }
      }
    } else if (action === "create_panel") {
      const channelId = String(form.get("channel_id") ?? "").trim();
      const title = String(form.get("title") ?? "").trim().slice(0, 100) || null;
      const description = multiline(form.get("description")).slice(0, 500) || null;
      const style = form.get("style") === "select" ? "select" : "button";
      const embedTemplate = String(form.get("embed_template") ?? "").trim() || null;
      if (channelId) {
        const createRes = await fetch(`${apiUrl}/rest/v1/ticket_panels`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "return=representation" },
          body: JSON.stringify({ guild_id: id, channel_id: channelId, title, description, style, embed_template: embedTemplate, ...panelLook(form) })
        });
        if (createRes.ok) {
          const [panel] = await createRes.json();
          const ok = await refreshPanelById(String(panel.id), true);
          saved = ok;
          if (!ok) error = panelFailure(dt("The panel was created but could not be posted."));
        } else {
          error = dt("Couldn't create the panel, try again.");
        }
      }
    } else if (action === "update_panel") {
      const panelId = String(form.get("panel_id") ?? "").trim();
      const title = String(form.get("title") ?? "").trim().slice(0, 100) || null;
      const description = multiline(form.get("description")).slice(0, 500) || null;
      const style = form.get("style") === "select" ? "select" : "button";
      const embedTemplate = String(form.get("embed_template") ?? "").trim() || null;
      const updateRes = await fetch(`${apiUrl}/rest/v1/ticket_panels?id=eq.${panelId}&guild_id=eq.${id}`, {
        method: "PATCH",
        headers: { ...apiHeaders, Prefer: "return=representation" },
        body: JSON.stringify({ title, description, style, embed_template: embedTemplate, ...panelLook(form) })
      });
      logTicketPanel("update-panel-database", { panelId, status: updateRes.status, ok: updateRes.ok });
      if (!updateRes.ok) {
        error = dt("Couldn't save that panel.");
      } else {
        const ok = await refreshPanelById(panelId);
        saved = ok;
        if (!ok) error = panelFailure(dt("The panel was saved but the message could not be updated."));
      }
    } else if (action === "move_panel") {
      const panelId = String(form.get("panel_id") ?? "").trim();
      const newChannelId = String(form.get("channel_id") ?? "").trim();
      if (panelId && newChannelId) {
        const panelRes = await fetch(`${apiUrl}/rest/v1/ticket_panels?id=eq.${panelId}&guild_id=eq.${id}&select=*`, { headers: apiHeaders });
        const [panel] = panelRes.ok ? await panelRes.json() : [];
        logTicketPanel("move-panel-load", { panelId, status: panelRes.status, found: Boolean(panel) });
        const oldMessageDeleted = panel ? await removePanelMessage(panel.channel_id, panel.message_id) : false;
        if (!panel) {
          error = dt("That panel was not found.");
        } else if (!oldMessageDeleted) {
          error = dt("Couldn't remove the old panel message, so it was not moved.");
        } else {
          const moveRes = await fetch(`${apiUrl}/rest/v1/ticket_panels?id=eq.${panelId}&guild_id=eq.${id}`, {
            method: "PATCH",
            headers: { ...apiHeaders, Prefer: "return=representation" },
            body: JSON.stringify({ channel_id: newChannelId, message_id: null })
          });
          logTicketPanel("move-panel-database", { panelId, newChannelId, status: moveRes.status, ok: moveRes.ok });
          if (!moveRes.ok) {
            error = dt("Couldn't move that panel.");
          } else {
            const ok = panel.message_id ? await refreshPanelById(panelId, true) : true;
            saved = ok;
            if (!ok) error = panelFailure(dt("The panel was moved but could not be posted there."));
          }
        }
      }
    } else if (action === "resend_panel") {
      const panelId = String(form.get("panel_id") ?? "").trim();
      const panelRes = await fetch(`${apiUrl}/rest/v1/ticket_panels?id=eq.${panelId}&guild_id=eq.${id}&select=*`, { headers: apiHeaders });
      const [panel] = panelRes.ok ? await panelRes.json() : [];
      logTicketPanel("resend-panel-load", { panelId, status: panelRes.status, found: Boolean(panel), messageId: panel?.message_id ?? null });
      if (panel) {
        const oldMessageDeleted = await removePanelMessage(panel.channel_id, panel.message_id);
        logTicketPanel("resend-panel-discord-delete", { panelId, ok: oldMessageDeleted });
        if (!oldMessageDeleted) {
          error = dt("Couldn't remove the old panel message, so it was not resent.");
        } else {
          const clearRes = await fetch(`${apiUrl}/rest/v1/ticket_panels?id=eq.${panelId}&guild_id=eq.${id}`, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=representation" }, body: JSON.stringify({ message_id: null }) });
          logTicketPanel("resend-panel-clear-message-id", { panelId, status: clearRes.status, ok: clearRes.ok });
          if (!clearRes.ok) {
            error = dt("Couldn't prepare the panel for resend.");
          } else {
            const ok = await refreshPanelById(panelId, true);
            saved = ok;
            if (!ok) error = panelFailure(dt("Couldn't resend the panel."));
          }
        }
      }
    } else if (action === "unpost_panel") {
      const panelId = String(form.get("panel_id") ?? "").trim();
      const panelRes = await fetch(`${apiUrl}/rest/v1/ticket_panels?id=eq.${panelId}&guild_id=eq.${id}&select=*`, { headers: apiHeaders });
      const [panel] = panelRes.ok ? await panelRes.json() : [];
      if (!panel) {
        error = dt("That panel was not found.");
      } else if (!await removePanelMessage(panel.channel_id, panel.message_id)) {
        error = dt("Couldn't remove the panel message from Discord, so it was not turned off.");
      } else {
        const clearRes = await fetch(`${apiUrl}/rest/v1/ticket_panels?id=eq.${panelId}&guild_id=eq.${id}`, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ message_id: null }) });
        logTicketPanel("unpost-panel", { panelId, status: clearRes.status, ok: clearRes.ok });
        if (clearRes.ok) saved = true;
        else error = dt("Couldn't turn that panel off, try again.");
      }
    } else if (action === "delete_panel") {
      const panelId = String(form.get("panel_id") ?? "").trim();
      const panelRes = await fetch(`${apiUrl}/rest/v1/ticket_panels?id=eq.${panelId}&guild_id=eq.${id}&select=*`, { headers: apiHeaders });
      const [panel] = panelRes.ok ? await panelRes.json() : [];
      logTicketPanel("delete-panel-load", { panelId, status: panelRes.status, found: Boolean(panel), messageId: panel?.message_id ?? null });
      if (panel) await removePanelMessage(panel.channel_id, panel.message_id);
      const deleteRes = await fetch(`${apiUrl}/rest/v1/ticket_panels?id=eq.${panelId}&guild_id=eq.${id}`, {
        method: "DELETE",
        headers: { ...apiHeaders, Prefer: "return=representation" }
      });
      logTicketPanel("delete-panel-database", { panelId, status: deleteRes.status, ok: deleteRes.ok });
      if (deleteRes.ok) {
        const verifyRes = await fetch(`${apiUrl}/rest/v1/ticket_panels?id=eq.${panelId}&guild_id=eq.${id}&select=id`, { headers: apiHeaders });
        const [remaining] = verifyRes.ok ? await verifyRes.json().catch(() => []) : [];
        logTicketPanel("delete-panel-verify", { panelId, status: verifyRes.status, stillPresent: Boolean(remaining) });
        if (!remaining) saved = true;
        else error = dt("The panel delete was accepted but the panel is still present. Check Cloudflare logs.");
      } else {
        error = dt("Couldn't delete that panel. Try again or check the dashboard logs.");
      }
    } else if (action === "save_reply") {
      const name = String(form.get("reply_name") ?? "").trim().toLowerCase();
      const content = multiline(form.get("reply_content")).slice(0, 1500);
      if (!/^[a-z0-9][a-z0-9_-]{0,29}$/.test(name) || !content) {
        error = dt("Use a short name (letters, numbers, - and _) and write the text.");
      } else {
        await ensureGuildRow(apiUrl, apiHeaders, id);
        const res = await fetch(`${apiUrl}/rest/v1/ticket_replies?on_conflict=guild_id,name`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, name, content, created_by: String(session.userId), updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
        saved = res.ok;
        if (!res.ok) error = dt("Couldn't save that quick reply, try again.");
      }
    } else if (action === "delete_reply") {
      const name = String(form.get("reply_name") ?? "").trim().toLowerCase();
      const res = await fetch(`${apiUrl}/rest/v1/ticket_replies?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}`, { method: "DELETE", headers: { ...apiHeaders, Prefer: "return=minimal" } });
      saved = res.ok;
      if (!res.ok) error = dt("Couldn't delete that quick reply, try again.");
    } else if (action === "add_starter_types") {
      const panelId = String(form.get("panel_id") ?? "").trim() || null;
      const starters = [
        { label: dt("Support"), emoji: "\u{1F3AB}", style: "primary" },
        { label: dt("Report a player"), emoji: "\u{1F6A9}", style: "danger" },
        { label: dt("Purchases"), emoji: "\u{1F6D2}", style: "success" },
        { label: dt("Appeals"), emoji: "\u{1F4E8}", style: "secondary" }
      ];
      const countRes = await fetch(`${apiUrl}/rest/v1/ticket_categories?guild_id=eq.${id}&select=id`, { headers: apiHeaders });
      const current = countRes.ok ? await countRes.json() : null;
      if (!current) {
        error = dt("Couldn't check the ticket type limit, try again.");
      } else {
        const room = Math.max(0, ticketCategoryLimit - current.length);
        let made = 0;
        for (const starter of starters.slice(0, room)) {
          const res = await fetch(`${apiUrl}/rest/v1/ticket_categories`, { method: "POST", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ guild_id: id, key: `${normalizeKey(starter.label)}-${Date.now().toString(36)}${made}`, label: starter.label, emoji: starter.emoji, button_style: starter.style, panel_id: panelId }) });
          if (res.ok) made += 1;
        }
        saved = made > 0;
        if (made === 0) error = room === 0 ? dt("You have reached the {n} ticket type limit.", { n: ticketCategoryLimit }) : dt("Couldn't add those ticket types, try again.");
        else if (panelId) await refreshPanelById(panelId);
      }
    } else if (action === "save_settings") {
      const roleIds = (name) => form.getAll(name).map(String);
      const clampHours = Math.max(1, Math.min(720, Number(form.get("autoclose_inactivity_hours") ?? 168) || 168));
      await fetch(`${apiUrl}/rest/v1/ticket_settings?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          claim_mode: form.get("claim_mode") === "exclusive" ? "exclusive" : "shared",
          ping_on_claim: form.get("ping_on_claim") === "on",
          roles_to_add_on_claim: roleIds("roles_to_add_on_claim"),
          close_requires_support_role: form.get("close_requires_support_role") === "on",
          close_requires_reason: form.get("close_requires_reason") === "on",
          hide_closing_user: form.get("hide_closing_user") === "on",
          dm_user_on_close: form.get("dm_user_on_close") === "on",
          default_close_reason: String(form.get("default_close_reason") ?? "").trim().slice(0, 300) || null,
          log_staff_message_counts: form.get("log_staff_message_counts") === "on",
          autoclose_leave: form.get("autoclose_leave") === "on",
          autoclose_inactivity_enabled: form.get("autoclose_inactivity_enabled") === "on",
          autoclose_inactivity_hours: clampHours,
          rating_enabled: form.get("rating_enabled") === "on",
          rating_mode: form.get("rating_mode") === "rating_comment" ? "rating_comment" : "rating_only",
          rating_log_channel_id: String(form.get("rating_log_channel_id") ?? "").trim() || null,
          opened_log_channel_id: String(form.get("opened_log_channel_id") ?? "").trim() || null,
          closed_log_channel_id: String(form.get("closed_log_channel_id") ?? "").trim() || null,
          blocked_role_ids: roleIds("blocked_role_ids"),
          auto_delete_closed_hours: Math.max(0, Math.min(720, Math.floor(Number(form.get("auto_delete_closed_hours") ?? 0)) || 0)),
          unclaimed_reminder_minutes: Math.max(0, Math.min(10080, Math.floor(Number(form.get("unclaimed_reminder_minutes") ?? 0)) || 0)),
          global_limit: Math.max(0, Math.min(50, Math.floor(Number(form.get("global_limit") ?? 0)) || 0)),
          transcript_channel_id: String(form.get("transcript_channel_id") ?? "").trim() || null,
          transcript_mode: ["auto", "link", "file", "both"].includes(String(form.get("transcript_mode"))) ? String(form.get("transcript_mode")) : "auto",
          hours_enabled: form.get("hours_enabled") === "on",
          hours_timezone: validTimezone(String(form.get("hours_timezone") ?? "")) ? String(form.get("hours_timezone")) : "America/Bogota",
          hours_start: /^([01]\d|2[0-3]):[0-5]\d$/.test(String(form.get("hours_start") ?? "")) ? String(form.get("hours_start")) : "09:00",
          hours_end: /^([01]\d|2[0-3]):[0-5]\d$/.test(String(form.get("hours_end") ?? "")) ? String(form.get("hours_end")) : "21:00",
          hours_days: form.getAll("hours_days").map((d) => Number(d)).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6),
          hours_block: form.get("hours_block") === "on",
          hours_message: multiline(form.get("hours_message")).slice(0, 500) || null,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      saved = true;
    }
  }
  function validTimezone(tz) {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: tz });
      return Boolean(tz);
    } catch {
      return false;
    }
  }
  function panelLook(form) {
    const hex = /^#?([0-9a-f]{6})$/i.exec(String(form.get("color") ?? "").trim());
    const image = String(form.get("image_url") ?? "").trim();
    return {
      color: hex ? parseInt(hex[1], 16) : null,
      image_url: /^https:\/\/\S+$/i.test(image) ? image.slice(0, 500) : null,
      footer: String(form.get("footer") ?? "").trim().slice(0, 300) || null,
      placeholder: String(form.get("placeholder") ?? "").trim().slice(0, 150) || null
    };
  }
  async function removePanelMessage(channelId, messageId) {
    const removed = await deletePanelMessage(botToken, channelId, messageId);
    noteGuildWrite(id);
    return removed;
  }
  async function refreshPanelById(panelId, post = false) {
    const panelRes = await fetch(`${apiUrl}/rest/v1/ticket_panels?id=eq.${panelId}&guild_id=eq.${id}&select=*`, { headers: apiHeaders });
    const [panel] = panelRes.ok ? await panelRes.json() : [];
    if (!panel) return false;
    if (!panel.message_id && !post) return true;
    const categoriesRes2 = await fetch(`${apiUrl}/rest/v1/ticket_categories?guild_id=eq.${id}&panel_id=eq.${panelId}&select=key,label,emoji,description,button_style&order=id.asc`, { headers: apiHeaders });
    const cats = (categoriesRes2?.ok ? await categoriesRes2.json() : []).map((c) => ({ key: c.key, label: c.label, emoji: c.emoji, description: c.description, buttonStyle: c.button_style ?? "primary" }));
    const templateData = await getTemplateData(panel.embed_template);
    const guildVars = templateData ? await getGuildVars() : null;
    const messageId = await postOrRefreshPanelMessage(botToken, panel.channel_id, panel.message_id, buildPanelPayload(panel, panel.style, cats, templateData, guildVars));
    noteGuildWrite(id);
    if (!messageId) return false;
    for (const note of panelWarnings(cats, panel.embed_template, templateData)) {
      if (note === "no_types") warnings.push(dt("The panel is posted, but it has no ticket types yet, so nobody can open a ticket from it. Add a type to this panel."));
      else if (note === "template_missing") warnings.push(dt("The design you picked no longer exists, so the plain panel was posted."));
      else warnings.push(dt("The design you picked has nothing in it, so the plain panel was posted."));
    }
    if (messageId !== panel.message_id) {
      await fetch(`${apiUrl}/rest/v1/ticket_panels?id=eq.${panelId}&guild_id=eq.${id}`, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ message_id: messageId }) });
    }
    await redrawPanelsInServerLanguage(Astro2, apiUrl, apiHeaders, id);
    return true;
  }
  const TICKET_SECTIONS = ["panels", "types", "forms", "access", "settings", "replies", "open"];
  const shown = section === "live" ? "open" : TICKET_SECTIONS.includes(section) ? section : "panels";
  const needs = (...sections) => sections.includes(shown);
  const when = (sections, load) => () => needs(...sections) ? load() : Promise.resolve(null);
  const customEmojisPromise = needs("types") ? getGuildEmojis(id, botToken) : Promise.resolve([]);
  const [guildInfo, categoriesRes, openTicketsRes, rolesRes, channelsRes, panelsRes, settingsRes, embedTemplatesRes, ticketFormsRes, ticketBlacklistRes, repliesRes, statsTicketsRes, statsRatingsRes, closedTicketsRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    when(["panels", "types", "settings"], () => fetch(`${apiUrl}/rest/v1/ticket_categories?guild_id=eq.${id}&select=*&order=id.asc`, { headers: apiHeaders })),
    when(["open"], () => fetch(`${apiUrl}/rest/v1/tickets?guild_id=eq.${id}&status=eq.open&select=id,ticket_number,opener_id,claimed_by,channel_id,ticket_categories(label)&order=created_at.desc&limit=100`, { headers: apiHeaders })),
    when(["types", "settings", "access"], () => getGuildList(Astro2, id, botToken, "roles")),
    when(["panels", "types", "settings"], () => getGuildList(Astro2, id, botToken, "channels")),
    when(["panels", "types", "settings"], () => fetch(`${apiUrl}/rest/v1/ticket_panels?guild_id=eq.${id}&select=*&order=id.asc`, { headers: apiHeaders })),
    when(["settings"], () => fetch(`${apiUrl}/rest/v1/ticket_settings?guild_id=eq.${id}&select=*`, { headers: apiHeaders })),
    when(["panels"], () => fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders })),
    when(["types", "forms"], () => fetch(`${apiUrl}/rest/v1/ticket_forms?guild_id=eq.${id}&select=id,name,title,fields&order=name.asc`, { headers: apiHeaders })),
    when(["access"], () => fetch(`${apiUrl}/rest/v1/ticket_blacklist?guild_id=eq.${id}&select=id,target_type,target_id,reason&order=id.asc`, { headers: apiHeaders })),
    when(["replies"], () => fetch(`${apiUrl}/rest/v1/ticket_replies?guild_id=eq.${id}&select=name,content&order=name.asc&limit=60`, { headers: apiHeaders })),
    when(["open"], () => fetch(`${apiUrl}/rest/v1/tickets?guild_id=eq.${id}&select=status,claimed_by,created_at,closed_at&order=created_at.desc&limit=2000`, { headers: apiHeaders })),
    when(["open"], () => fetch(`${apiUrl}/rest/v1/ticket_ratings?guild_id=eq.${id}&select=rating&limit=2000`, { headers: apiHeaders })),
    when(["open"], () => fetch(`${apiUrl}/rest/v1/tickets?guild_id=eq.${id}&status=eq.closed&transcript_html=not.is.null&select=ticket_number,opener_id,closed_at,close_reason,ticket_categories(label)&order=closed_at.desc&limit=25`, { headers: apiHeaders }))
  ], 6);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const rawCategories = categoriesRes?.ok ? await categoriesRes.json() : [];
  const categories = rawCategories.map((c) => ({
    id: c.id,
    panelId: c.panel_id,
    key: c.key,
    label: c.label,
    emoji: c.emoji,
    description: c.description,
    buttonStyle: c.button_style ?? "primary",
    namingPattern: c.naming_pattern ?? "ticket-{number}",
    welcomeMessage: c.welcome_message ?? "",
    welcomeSupported: "welcome_message" in c,
    parentChannelId: c.parent_channel_id,
    supportRoleIds: c.support_role_ids ?? [],
    pingRoleIds: c.ping_role_ids ?? [],
    maxOpenPerUser: c.max_open_per_user ?? 1,
    formId: c.form_id ?? null,
    requiredRoleIds: c.required_role_ids ?? []
  }));
  const rawOpenTickets = openTicketsRes?.ok ? await openTicketsRes.json() : [];
  const openTickets = rawOpenTickets.map((t) => ({
    id: t.id,
    ticketNumber: t.ticket_number,
    categoryLabel: t.ticket_categories?.label ?? dt("Deleted type"),
    openerId: t.opener_id,
    claimedBy: t.claimed_by,
    channelId: t.channel_id
  }));
  const allRoles = rolesRes?.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((r) => r.name !== "@everyone").sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const allChannels = channelsRes?.ok ? await channelsRes.json() : [];
  const channelCategories = allChannels.filter((c) => c.type === 4).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  const textChannels = allChannels.filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  const rawPanels = panelsRes?.ok ? await panelsRes.json() : [];
  const panels = rawPanels.map((p) => ({
    id: p.id,
    channelId: p.channel_id,
    messageId: p.message_id,
    title: p.title,
    description: p.description,
    style: p.style ?? "button",
    embedTemplate: p.embed_template,
    color: typeof p.color === "number" ? `#${p.color.toString(16).padStart(6, "0")}` : "",
    imageUrl: p.image_url ?? "",
    footer: p.footer ?? "",
    placeholder: p.placeholder ?? "",
    categoryCount: categories.filter((c) => c.panelId === p.id).length,
    types: categories.filter((c) => c.panelId === p.id).map((c) => ({ label: c.label, emoji: c.emoji }))
  }));
  const embedTemplateNames = embedTemplatesRes?.ok ? (await embedTemplatesRes.json()).map((t) => t.name) : [];
  const forms = ticketFormsRes?.ok ? (await ticketFormsRes.json()).map((f) => ({ id: f.id, name: f.name, title: f.title ?? dt("Ticket details"), fields: editorFields(f.fields) })) : [];
  const rawBlacklist = ticketBlacklistRes?.ok ? await ticketBlacklistRes.json() : [];
  const settingsRows = settingsRes?.ok ? await settingsRes.json() : [];
  const s = settingsRows[0] ?? {};
  const settings = {
    claimMode: s.claim_mode ?? "shared",
    pingOnClaim: s.ping_on_claim ?? false,
    rolesToAddOnClaim: s.roles_to_add_on_claim ?? [],
    closeRequiresSupportRole: s.close_requires_support_role ?? false,
    closeRequiresReason: s.close_requires_reason ?? false,
    hideClosingUser: s.hide_closing_user ?? false,
    dmUserOnClose: s.dm_user_on_close ?? true,
    defaultCloseReason: s.default_close_reason ?? "",
    logStaffMessageCounts: s.log_staff_message_counts ?? false,
    autocloseLeave: s.autoclose_leave ?? false,
    autocloseInactivityEnabled: s.autoclose_inactivity_enabled ?? false,
    autocloseInactivityHours: s.autoclose_inactivity_hours ?? 168,
    ratingEnabled: s.rating_enabled ?? false,
    ratingMode: s.rating_mode ?? "rating_only",
    ratingLogChannelId: s.rating_log_channel_id ?? "",
    openedLogChannelId: s.opened_log_channel_id ?? "",
    closedLogChannelId: s.closed_log_channel_id ?? "",
    transcriptChannelId: s.transcript_channel_id ?? "",
    transcriptMode: s.transcript_mode ?? "auto",
    blockedRoleIds: s.blocked_role_ids ?? [],
    unclaimedReminderMinutes: s.unclaimed_reminder_minutes ?? 0,
    autoDeleteClosedHours: s.auto_delete_closed_hours ?? 0,
    globalLimit: s.global_limit ?? 0,
    hoursEnabled: s.hours_enabled ?? false,
    hoursTimezone: s.hours_timezone ?? "America/Bogota",
    hoursStart: s.hours_start ?? "09:00",
    hoursEnd: s.hours_end ?? "21:00",
    hoursDays: s.hours_days ?? [1, 2, 3, 4, 5],
    hoursBlock: s.hours_block ?? false,
    hoursMessage: s.hours_message ?? ""
  };
  const closedRows = closedTicketsRes?.ok ? await closedTicketsRes.json() : [];
  const profileIds = [...closedRows.map((t) => String(t.opener_id)), ...rawBlacklist.filter((e) => e.target_type !== "role").map((e) => String(e.target_id))];
  const profiles = profileIds.length ? (await withinBudget(getMemberProfiles(Astro2, id, profileIds, botToken, { fallback: "user", userId: session.userId }), 1200))?.value ?? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Map();
  const closedTickets = closedRows.map((t) => {
    const profile = profiles.get(String(t.opener_id)) ?? null;
    return { number: t.ticket_number, openerId: t.opener_id, openerName: profile ? profile.displayName || profile.username : null, openerAvatar: profile ? memberAvatarUrl(String(t.opener_id), profile, 64) : null, closedAt: t.closed_at, reason: t.close_reason ?? "", categoryLabel: t.ticket_categories?.label ?? "" };
  });
  const roleNames = new Map(roles.map((r) => [String(r.id), String(r.name)]));
  const blacklist = rawBlacklist.map((e) => {
    const profile = e.target_type === "role" ? null : profiles.get(String(e.target_id)) ?? null;
    return { ...e, name: e.target_type === "role" ? roleNames.get(String(e.target_id)) ?? null : profile ? profile.displayName || profile.username : null, avatar: profile ? memberAvatarUrl(String(e.target_id), profile, 64) : null };
  });
  const quickReplies = repliesRes?.ok ? await repliesRes.json() : [];
  const ticketStats = needs("open") ? summarizeTickets(statsTicketsRes?.ok ? await statsTicketsRes.json() : [], statsRatingsRes?.ok ? await statsRatingsRes.json() : []) : null;
  const customEmojis = await customEmojisPromise;
  return renderTemplate`${renderComponent($$result, "DashTickets", $$DashTickets, { "customEmojis": customEmojis, "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "categories": categories, "panels": panels, "settings": settings, "roles": roles, "channelCategories": channelCategories, "textChannels": textChannels, "embedTemplateNames": embedTemplateNames, "forms": forms, "blacklist": blacklist, "openTickets": openTickets, "quickReplies": quickReplies, "closedTickets": closedTickets, "stats": ticketStats, "saved": saved, "error": error, "warnings": warnings, "premiumActive": premiumActive, "section": shown, "viewOnly": viewOnly, "me": String(session.userId) })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/tickets.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/tickets.astro";
const $$url = "/dash/guild/[id]/tickets";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tickets,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
