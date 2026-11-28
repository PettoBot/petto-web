import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$ColorPicker } from '../../../../chunks/ColorPicker_DwzcbTkv.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { f as formWebPath, p as pageLook, l as linkEmbed, n as normalizeQuestions, h as hexColor, L as LIMITS, Q as QUESTION_TYPES, a as PAGE_BACKGROUNDS, b as PREMIUM_PAGE_BACKGROUNDS, B as BUTTON_STYLES, c as answerText, e as normalizeForm, u as usesPremiumLook, N as NAME, F as FORM_PLAN, g as newPublicId, s as slugName, S as STATUSES, E as EMBED_COLUMNS, j as NEWER_PAGE_COLUMNS } from '../../../../chunks/forms_B4RRKoSS.mjs';
/* empty css                                          */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { A as callPettoForms } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { s as sharedCall, w as withinBudget, m as markPending, l as lastAnswer, r as rememberAnswer } from '../../../../chunks/liveCall_BSZ7MViH.mjs';
import { o as hasPremiumForGuild } from '../../../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashForms = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashForms;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, section, forms, pending, submissions, panels, roles, channels, templates, editing, storage, statusFilter, formFilter, search, plan, ready, message, premiumActive = false } = Astro2.props;
  const base = `/dash/guild/${guildId}/forms`;
  const titles = { forms: dt("Forms"), submissions: dt("Form submissions"), panels: dt("Form panels") };
  const statusNames = { pending: dt("Pending"), accepted: dt("Accepted"), denied: dt("Denied"), cancelled: dt("Cancelled"), all: dt("All") };
  const typeNames = { short: dt("Short text"), paragraph: dt("Paragraph"), number: dt("Number"), yesno: dt("Yes or no"), choice: dt("One choice"), multi: dt("Several choices") };
  const styleNames = { primary: dt("Blurple"), secondary: dt("Grey"), success: dt("Green"), danger: dt("Red") };
  const when = (iso) => new Date(iso).toLocaleString(dashLang, { dateStyle: "medium", timeStyle: "short" });
  const atLimit = forms.length >= plan.forms;
  const isNew = editing === "new";
  const f = isNew ? { name: "", title: "", description: "", color: null, status: "closed", questions: [], review_channel_id: "", reviewer_role_ids: [], ping_role_ids: [], auto_thread: false, required_role_ids: [], blocked_role_ids: [], min_account_days: 0, min_member_days: 0, one_pending: true, deny_cooldown_hours: 0, max_per_user: 0, max_total: 0, closes_at: null, accept_add_role_ids: [], accept_remove_role_ids: [], deny_add_role_ids: [], deny_remove_role_ids: [], dm_results: true, messages: {}, button_label: "", button_emoji: "", button_style: "primary", web_enabled: true, page_banner: null, page_background: "default", page_show_icon: true, page_show_name: true, page_hide_branding: false, embed_title: null, embed_description: null, embed_image: null, embed_color: null, embed_thumbnail: false } : editing;
  const webPath = !isNew && f ? formWebPath(f, dashLang) : null;
  const look = pageLook(f);
  const embed = linkEmbed(f);
  const embedDefaults = { title: `${f?.title || dt("The title")} \xB7 ${guildName}`, description: (f?.description ?? "").replace(/\s+/g, " ").trim().slice(0, 200) || dt("Fill in this form of {a} with your Discord account.", { a: guildName }) };
  const embedImage = embed.image ?? look.banner ?? null;
  const backgroundNames = { default: dt("Petto's (dark or light)"), solid: dt("A tint of the color"), gradient: dt("A gradient of the color"), aurora: dt("Aurora, animated"), waves: dt("Waves, animated") };
  const premiumMark = (b) => PREMIUM_PAGE_BACKGROUNDS.includes(b) ? ` \xB7 Premium` : "";
  const closesLocal = f?.closes_at ? new Date(f.closes_at).toISOString().slice(0, 16) : "";
  const builderText = {
    more: dt("More options"),
    question: dt("Question"),
    add: dt("Add a question"),
    remove: dt("Remove"),
    up: dt("Move up"),
    down: dt("Move down"),
    drag: dt("Drag to reorder"),
    label: dt("Question (45 characters)"),
    help: dt("Help line (optional)"),
    description: dt("Description (optional)"),
    descriptionHint: dt("Shown under the question on the web: up to 1000 characters, with line breaks, **bold**, *italics* and [links](https://petto.sbs). Discord shows the help line, or the start of the description."),
    image: dt("Image URL (optional)"),
    imageHint: dt("Shown over the question on the web, not in Discord. An https link to a .png, .jpg, .gif or .webp picture."),
    imageBad: dt("That link cannot be used: it must start with https:// and end in .png, .jpg, .gif or .webp."),
    web: dt("On the web"),
    placeholder: dt("Placeholder (optional)"),
    required: dt("Required"),
    minLength: dt("Least characters"),
    maxLength: dt("Most characters"),
    minValue: dt("Lowest number"),
    maxValue: dt("Highest number"),
    options: dt("Options, one per line (2 to 25)"),
    maxChoices: dt("How many can be picked"),
    empty: dt("No questions yet. Add the first one."),
    limit: dt("Limit reached"),
    types: typeNames,
    page: dt("Page"),
    yes: dt("Yes"),
    no: dt("No"),
    pick: dt("Pick one"),
    pickMany: dt("Pick one or more"),
    number: dt("A number"),
    next: dt("Next"),
    submit: dt("Submit"),
    apply: dt("Apply"),
    pages: dt("{a} questions in {b} pages")
  };
  const variableChips = ["{user}", "{form}", "{reason}", "{number}", "{server}"];
  const formVars = [
    { tok: "{form}", desc: dt("Name of the form") },
    { tok: "{reason}", desc: dt("Reason the staff wrote") },
    { tok: "{number}", desc: dt("Number of the answers") },
    { tok: "{server}", desc: dt("Name of the server") }
  ];
  const defaultMessages = {
    submitted: dt("Your answers to {form} were sent (#{number}). The staff will look at them and you will get a DM with the result."),
    accepted: dt("Your answers to {form} in {server} were accepted."),
    denied: dt("Your answers to {form} in {server} were denied.")
  };
  const formOptions = forms.map((x) => ({ id: String(x.id), name: x.title }));
  const formName = (id) => forms.find((x) => String(x.id) === String(id))?.title;
  const yesWord = dt("Yes");
  const noWord = dt("No");
  const pendingTotal = Object.values(pending).reduce((sum, n) => sum + Number(n || 0), 0);
  const filterHref = (over) => {
    const params = new URLSearchParams({ section: "submissions", status: statusFilter, ...formFilter ? { f: formFilter } : {}, ...search ? { q: search } : {}, ...over });
    for (const [key, value] of [...params]) if (!value) params.delete(key);
    return `${base}?${params}`;
  };
  return renderTemplate(_a || (_a = __template(["", ` <script>
  (function () {
    if (window.__fmFolds) return;
    window.__fmFolds = true;
    // Numbers get a minus and a plus (the same input, with the same name and limits; DashSettingsKit does the pressing).
    var plusSvg = '<svg viewBox="0 0 256 256" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M224 128a8 8 0 0 1-8 8h-88v88a8 8 0 0 1-16 0v-88H32a8 8 0 0 1 0-16h88V32a8 8 0 0 1 16 0v88h88a8 8 0 0 1 8 8Z"/></svg>';
    var minusSvg = '<svg viewBox="0 0 256 256" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8Z"/></svg>';
    function steppers(root) {
      (root || document).querySelectorAll('.fm-editor .fm-field input[type="number"]').forEach(function (input) {
        if (input.closest('.sx-stepper')) return;
        var wrap = document.createElement('span'); wrap.className = 'sx-stepper';
        input.parentNode.insertBefore(wrap, input);
        wrap.innerHTML = '<button type="button" class="sx-step" data-sx-step="-1" tabindex="-1" aria-label="\u2212">' + minusSvg + '</button>';
        wrap.appendChild(input);
        wrap.insertAdjacentHTML('beforeend', '<button type="button" class="sx-step" data-sx-step="1" tabindex="-1" aria-label="+">' + plusSvg + '</button>');
      });
    }
    // A required field inside a section that is closed, or a link to a section, opens it.
    document.addEventListener('invalid', function (e) { var d = e.target.closest && e.target.closest('details'); if (d) d.open = true; }, true);
    function openHash() { var id = location.hash.slice(1); var el = id ? document.getElementById(id) : null; if (el && el.matches('details')) el.open = true; }
    window.addEventListener('hashchange', openHash);
    document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href^="#fm-"]'); if (a) { var el = document.getElementById(a.getAttribute('href').slice(1)); if (el && el.matches('details')) el.open = true; } });
    function init() { steppers(); openHash(); var q = document.querySelector('[data-q-builder]'); if (q) new MutationObserver(function () { steppers(q); }).observe(q, { childList: true, subtree: true }); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  })();
<\/script>   `])), renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": section === "forms" ? "forms" : `forms-${section}`, "pageTitle": titles[section], "data-astro-cid-pq47sjvz": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="fm-page" data-astro-cid-pq47sjvz> ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-pq47sjvz": true })} ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-pq47sjvz": true })} <h1 data-astro-cid-pq47sjvz>${titles[section]}</h1> ${(section === "forms" && f || section !== "forms") && renderTemplate`${renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "vars": section === "forms" ? formVars : [], "data-astro-cid-pq47sjvz": true })}`} ${message && renderTemplate`<div${addAttribute(["fm-flash", message.kind], "class:list")}${addAttribute(message.kind === "err" ? "alert" : "status", "role")} data-astro-cid-pq47sjvz>${renderComponent($$result2, "Icon", $$Icon, { "name": message.kind === "ok" ? "ph:check-circle-fill" : "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-pq47sjvz": true })}${message.text}</div>`} ${!ready && renderTemplate`<div class="fm-flash warn" data-astro-cid-pq47sjvz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-pq47sjvz": true })}${dt("This arrives with the next Petto update.")}</div>`} ${section === "forms" && !f && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-pq47sjvz": true }, { "default": ($$result3) => renderTemplate`${forms.length > 0 && renderTemplate`${renderComponent($$result3, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Forms"), value: forms.length, tone: "messages" },
    { label: dt("Open forms"), value: forms.filter((x) => x.status === "open").length, tone: "joins" },
    { label: dt("Pending"), value: Object.values(pending).reduce((sum, n) => sum + Number(n || 0), 0), tone: "reactions" }
  ], "data-astro-cid-pq47sjvz": true })}`}<div class="fm-row" data-astro-cid-pq47sjvz> <span class="fm-hint" data-astro-cid-pq47sjvz>${dt("{a} of {b} forms", { a: forms.length, b: plan.forms })} · ${dt("Up to {a} questions per form", { a: plan.questions })}</span> ${atLimit ? renderTemplate`<span class="btn btn-ghost btn-sm" aria-disabled="true" data-astro-cid-pq47sjvz>${dt("Limit reached")}</span>` : renderTemplate`<a class="btn btn-accent btn-sm"${addAttribute(`${base}?section=forms&form=new`, "href")} data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-pq47sjvz": true })}${dt("New form")}</a>`} </div> ${forms.length === 0 && renderTemplate`<div class="fm-card fm-empty fm-fill" data-astro-cid-pq47sjvz> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:clipboard-text-fill", "width": "28", "height": "28", "data-astro-cid-pq47sjvz": true })} <p data-astro-cid-pq47sjvz>${dt("No forms yet. Make one for staff applications, partner requests or sign-ups.")}</p> <p class="fm-hint" data-astro-cid-pq47sjvz>${dt("In Discord: !form create staff Staff application")}</p> </div>`}<div class="fm-grid-cards dgl-stagger" data-astro-cid-pq47sjvz> ${forms.map((x) => {
    const count = normalizeQuestions(x.questions).length;
    const waiting = pending[String(x.id)] ?? 0;
    return renderTemplate`<div class="fm-card fm-formcard dgl-card" data-astro-cid-pq47sjvz> <div class="fm-row" data-astro-cid-pq47sjvz><h3${addAttribute(x.color !== null && x.color !== void 0 ? `--fc:${hexColor(x.color)}` : "", "style")} data-astro-cid-pq47sjvz><i class="fm-dot" data-astro-cid-pq47sjvz></i>${x.title}</h3><span${addAttribute(["fm-chip", x.status], "class:list")} data-astro-cid-pq47sjvz>${x.status === "open" ? dt("Open") : dt("Closed")}</span></div> <p class="fm-hint" data-astro-cid-pq47sjvz><code data-astro-cid-pq47sjvz>${x.name}</code>${x.number ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-pq47sjvz": true }, { "default": ($$result4) => renderTemplate` · #${x.number}` })}` : null} · ${dt("{a} questions", { a: count })} · <a${addAttribute(`${base}?section=submissions&f=${x.id}`, "href")} data-astro-cid-pq47sjvz>${dt("{a} pending", { a: waiting })}</a>${x.web_enabled !== false && formWebPath(x, dashLang) && renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-pq47sjvz": true }, { "default": ($$result4) => renderTemplate` · <a${addAttribute(formWebPath(x, dashLang), "href")} target="_blank" rel="noopener" data-astro-cid-pq47sjvz>${dt("Open on the web")}</a>` })}`}</p> ${x.description && renderTemplate`<p class="fm-desc" data-astro-cid-pq47sjvz>${x.description}</p>`} <div class="fm-actions" data-astro-cid-pq47sjvz> <a class="btn btn-ghost btn-sm"${addAttribute(`${base}?section=forms&form=${x.id}`, "href")} data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:pencil-simple-bold", "width": "12", "height": "12", "data-astro-cid-pq47sjvz": true })}${dt("Edit")}</a> <form method="POST" data-no-dirty data-astro-cid-pq47sjvz><input type="hidden" name="action" value="toggle_form" data-astro-cid-pq47sjvz><input type="hidden" name="form_id"${addAttribute(x.id, "value")} data-astro-cid-pq47sjvz><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-pq47sjvz>${x.status === "open" ? dt("Close") : dt("Open")}</button></form> ${!atLimit && renderTemplate`<form method="POST" data-no-dirty data-astro-cid-pq47sjvz><input type="hidden" name="action" value="duplicate_form" data-astro-cid-pq47sjvz><input type="hidden" name="form_id"${addAttribute(x.id, "value")} data-astro-cid-pq47sjvz><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-pq47sjvz>${dt("Duplicate")}</button></form>`} </div> </div>`;
  })} </div> ${forms.length > 0 && renderTemplate`<div class="fm-next" data-astro-cid-pq47sjvz> <a class="fm-card fm-tile"${addAttribute(`${base}?section=submissions`, "href")} data-astro-cid-pq47sjvz> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:tray-fill", "width": "24", "height": "24", "data-astro-cid-pq47sjvz": true })} <b data-astro-cid-pq47sjvz>${dt("Form submissions")}</b> ${storage.known && renderTemplate`<span class="fm-hint" data-astro-cid-pq47sjvz>${dt("{a} pending", { a: Object.values(pending).reduce((sum, n) => sum + Number(n || 0), 0) })}</span>`} </a> <a class="fm-card fm-tile"${addAttribute(`${base}?section=panels`, "href")} data-astro-cid-pq47sjvz> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:cursor-click-fill", "width": "24", "height": "24", "data-astro-cid-pq47sjvz": true })} <b data-astro-cid-pq47sjvz>${dt("Form panels")}</b> <span class="fm-hint" data-astro-cid-pq47sjvz>${dt("Post a panel")}</span> </a> </div>`}` })}`} ${section === "forms" && f && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-pq47sjvz": true }, { "default": ($$result3) => renderTemplate` <a class="fm-back"${addAttribute(`${base}?section=forms`, "href")} data-astro-cid-pq47sjvz>← ${dt("All forms")}</a> <div class="fm-editor-wrap" data-astro-cid-pq47sjvz> <form method="POST" class="fm-editor" data-forms-editor data-astro-cid-pq47sjvz> <input type="hidden" name="action" value="save_form" data-astro-cid-pq47sjvz> ${!isNew && renderTemplate`<input type="hidden" name="form_id"${addAttribute(f.id, "value")} data-astro-cid-pq47sjvz>`} <details class="fm-fold" data-fm-fold open data-astro-cid-pq47sjvz> <summary data-astro-cid-pq47sjvz><span class="fm-fold-icon" aria-hidden="true" data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:text-aa-bold", "width": "16", "height": "16", "data-astro-cid-pq47sjvz": true })}</span><span class="fm-fold-title" data-astro-cid-pq47sjvz><h2 data-astro-cid-pq47sjvz>${dt("Basics")}</h2><em data-astro-cid-pq47sjvz>${dt("The title, the short name and the color.")}</em></span>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "fm-fold-caret", "width": "14", "height": "14", "data-astro-cid-pq47sjvz": true })}</summary> <div class="fm-fold-body" data-astro-cid-pq47sjvz> <div class="fm-grid" data-astro-cid-pq47sjvz> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Title")}</span><input type="text" name="title"${addAttribute(f.title, "value")}${addAttribute(LIMITS.title, "maxlength")} required data-preview-title data-astro-cid-pq47sjvz><em data-astro-cid-pq47sjvz>${dt("Shown on top of the Discord form (45 characters).")}</em></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Short name")}</span><input type="text" name="name"${addAttribute(f.name, "value")} maxlength="32" required${addAttribute("[A-Za-z0-9][A-Za-z0-9_\\-]{0,31}", "pattern")} autocomplete="off" spellcheck="false" data-astro-cid-pq47sjvz><em data-astro-cid-pq47sjvz>${dt("For commands, like !form info staff.")}</em></label> <label class="fm-field fm-wide" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Description")}</span><textarea class="dgl-autogrow" data-count name="description"${addAttribute(LIMITS.description, "maxlength")} rows="2" data-ac data-preview-desc data-astro-cid-pq47sjvz>${f.description ?? ""}</textarea><em data-astro-cid-pq47sjvz>${dt("Shown on the panel.")}</em></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Status")}</span><select name="status" data-astro-cid-pq47sjvz><option value="closed"${addAttribute(f.status !== "open", "selected")} data-astro-cid-pq47sjvz>${dt("Closed: nobody can send it")}</option><option value="open"${addAttribute(f.status === "open", "selected")} data-astro-cid-pq47sjvz>${dt("Open: members can send it")}</option></select></label> <div class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Color")}</span>${renderComponent($$result3, "ColorPicker", $$ColorPicker, { "name": "color", "value": hexColor(f.color), "label": dt("Color"), "allowNone": true, "data-astro-cid-pq47sjvz": true })}</div> </div> </div> </details> <details class="fm-fold" data-fm-fold open data-astro-cid-pq47sjvz> <summary data-astro-cid-pq47sjvz><span class="fm-fold-icon" aria-hidden="true" data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:list-checks-bold", "width": "16", "height": "16", "data-astro-cid-pq47sjvz": true })}</span><span class="fm-fold-title" data-astro-cid-pq47sjvz><h2 data-astro-cid-pq47sjvz>${dt("Questions")}</h2><em data-astro-cid-pq47sjvz>${dt("What members are asked.")}</em></span><span class="fm-hint" data-q-count data-astro-cid-pq47sjvz></span>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "fm-fold-caret", "width": "14", "height": "14", "data-astro-cid-pq47sjvz": true })}</summary> <div class="fm-fold-body" data-astro-cid-pq47sjvz> <p class="fm-hint" data-astro-cid-pq47sjvz>${dt("Members see them in Discord forms of 5 questions, with a Next button between pages. Drag a question to change its place.")}</p> <div data-q-builder${addAttribute(JSON.stringify(normalizeQuestions(f.questions)), "data-initial")}${addAttribute(JSON.stringify(builderText), "data-text")}${addAttribute(plan.questions, "data-limit")}${addAttribute(JSON.stringify(LIMITS), "data-limits")}${addAttribute(JSON.stringify(QUESTION_TYPES), "data-types")} data-astro-cid-pq47sjvz></div> <input type="hidden" name="questions_json" data-q-output data-astro-cid-pq47sjvz> </div> </details> <details class="fm-fold" data-fm-fold open data-astro-cid-pq47sjvz> <summary data-astro-cid-pq47sjvz><span class="fm-fold-icon" aria-hidden="true" data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:eye-bold", "width": "16", "height": "16", "data-astro-cid-pq47sjvz": true })}</span><span class="fm-fold-title" data-astro-cid-pq47sjvz><h2 data-astro-cid-pq47sjvz>${dt("Review")}</h2><em data-astro-cid-pq47sjvz>${dt("Where the answers arrive and who reviews them.")}</em></span>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "fm-fold-caret", "width": "14", "height": "14", "data-astro-cid-pq47sjvz": true })}</summary> <div class="fm-fold-body" data-astro-cid-pq47sjvz> <div class="fm-grid" data-astro-cid-pq47sjvz> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Review channel")}</span><select name="review_channel_id" data-astro-cid-pq47sjvz><option value="" data-astro-cid-pq47sjvz>${dt("Pick a channel")}</option>${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === f.review_channel_id, "selected")} data-astro-cid-pq47sjvz>#${c.name}</option>`)}</select><em data-astro-cid-pq47sjvz>${dt("Where the cards with the answers arrive.")}</em></label> <label class="fm-check fm-center" data-astro-cid-pq47sjvz><input type="checkbox" name="auto_thread"${addAttribute(f.auto_thread, "checked")} data-astro-cid-pq47sjvz>${dt("Open a thread under each card")}</label> <div class="fm-field fm-wide" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Reviewer roles")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "reviewer_role_ids", "options": roles, "selected": f.reviewer_role_ids ?? [], "placeholder": dt("Only who manages the server"), "data-astro-cid-pq47sjvz": true })}<em data-astro-cid-pq47sjvz>${dt("Who can accept and deny. Who manages the server always can.")}</em></div> <div class="fm-field fm-wide" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Roles to ping")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "ping_role_ids", "options": roles, "selected": f.ping_role_ids ?? [], "placeholder": dt("No roles"), "data-astro-cid-pq47sjvz": true })}</div> </div> </div> </details> <details class="fm-fold" data-fm-fold data-astro-cid-pq47sjvz> <summary data-astro-cid-pq47sjvz><span class="fm-fold-icon" aria-hidden="true" data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:users-three-bold", "width": "16", "height": "16", "data-astro-cid-pq47sjvz": true })}</span><span class="fm-fold-title" data-astro-cid-pq47sjvz><h2 data-astro-cid-pq47sjvz>${dt("Who can send it")}</h2><em data-astro-cid-pq47sjvz>${dt("Roles, account age and limits.")}</em></span>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "fm-fold-caret", "width": "14", "height": "14", "data-astro-cid-pq47sjvz": true })}</summary> <div class="fm-fold-body" data-astro-cid-pq47sjvz> <div class="fm-grid" data-astro-cid-pq47sjvz> <div class="fm-field fm-wide" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Needs one of these roles")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "required_role_ids", "options": roles, "selected": f.required_role_ids ?? [], "placeholder": dt("Anyone"), "data-astro-cid-pq47sjvz": true })}</div> <div class="fm-field fm-wide" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Blocked roles")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "blocked_role_ids", "options": roles, "selected": f.blocked_role_ids ?? [], "placeholder": dt("No roles"), "data-astro-cid-pq47sjvz": true })}</div> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Account age (days)")}</span><input type="number" name="min_account_days" min="0" max="3650"${addAttribute(f.min_account_days, "value")} data-astro-cid-pq47sjvz></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Time in the server (days)")}</span><input type="number" name="min_member_days" min="0" max="3650"${addAttribute(f.min_member_days, "value")} data-astro-cid-pq47sjvz></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Wait after a denial (hours)")}</span><input type="number" name="deny_cooldown_hours" min="0" max="8760"${addAttribute(f.deny_cooldown_hours, "value")} data-astro-cid-pq47sjvz></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Times each member can send it")}</span><input type="number" name="max_per_user" min="0" max="1000"${addAttribute(f.max_per_user, "value")} data-astro-cid-pq47sjvz><em data-astro-cid-pq47sjvz>${dt("0 is no limit.")}</em></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Answers in all")}</span><input type="number" name="max_total" min="0" max="100000"${addAttribute(f.max_total, "value")} data-astro-cid-pq47sjvz><em data-astro-cid-pq47sjvz>${dt("0 is no limit.")}</em></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Closes on (UTC)")}</span><input type="datetime-local" name="closes_at"${addAttribute(closesLocal, "value")} data-astro-cid-pq47sjvz></label> <label class="fm-check fm-wide" data-astro-cid-pq47sjvz><input type="checkbox" name="one_pending"${addAttribute(f.one_pending, "checked")} data-astro-cid-pq47sjvz>${dt("One pending answer per member")}</label> </div> </div> </details> <details class="fm-fold" data-fm-fold data-astro-cid-pq47sjvz> <summary data-astro-cid-pq47sjvz><span class="fm-fold-icon" aria-hidden="true" data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:chat-teardrop-text-bold", "width": "16", "height": "16", "data-astro-cid-pq47sjvz": true })}</span><span class="fm-fold-title" data-astro-cid-pq47sjvz><h2 data-astro-cid-pq47sjvz>${dt("After the review")}</h2><em data-astro-cid-pq47sjvz>${dt("Roles given and the messages members get.")}</em></span>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "fm-fold-caret", "width": "14", "height": "14", "data-astro-cid-pq47sjvz": true })}</summary> <div class="fm-fold-body" data-astro-cid-pq47sjvz> <div class="fm-grid" data-astro-cid-pq47sjvz> <div class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Accepted: give roles")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "giveRole": true, "name": "accept_add_role_ids", "options": roles, "selected": f.accept_add_role_ids ?? [], "placeholder": dt("No roles"), "data-astro-cid-pq47sjvz": true })}</div> <div class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Accepted: take roles")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "accept_remove_role_ids", "options": roles, "selected": f.accept_remove_role_ids ?? [], "placeholder": dt("No roles"), "data-astro-cid-pq47sjvz": true })}</div> <div class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Denied: give roles")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "giveRole": true, "name": "deny_add_role_ids", "options": roles, "selected": f.deny_add_role_ids ?? [], "placeholder": dt("No roles"), "data-astro-cid-pq47sjvz": true })}</div> <div class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Denied: take roles")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "deny_remove_role_ids", "options": roles, "selected": f.deny_remove_role_ids ?? [], "placeholder": dt("No roles"), "data-astro-cid-pq47sjvz": true })}</div> <label class="fm-check fm-wide" data-astro-cid-pq47sjvz><input type="checkbox" name="dm_results"${addAttribute(f.dm_results, "checked")} data-astro-cid-pq47sjvz>${dt("Send the member a DM with the result")}</label> </div> <p class="fm-hint" data-astro-cid-pq47sjvz>${dt("Variables:")} ${variableChips.map((v) => renderTemplate`<code class="fm-var" data-astro-cid-pq47sjvz>${v}</code>`)} ${dt("and the usual ones.")}</p> <div class="fm-grid" data-astro-cid-pq47sjvz> <label class="fm-field fm-wide" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("When it is sent")}</span><textarea class="dgl-autogrow" data-count name="msg_submitted" data-ac rows="2"${addAttribute(LIMITS.message, "maxlength")}${addAttribute(defaultMessages.submitted, "placeholder")} data-astro-cid-pq47sjvz>${f.messages?.submitted?.text ?? ""}</textarea></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("When it is accepted")}</span><textarea class="dgl-autogrow" data-count name="msg_accepted" data-ac rows="3"${addAttribute(LIMITS.message, "maxlength")}${addAttribute(defaultMessages.accepted, "placeholder")} data-astro-cid-pq47sjvz>${f.messages?.accepted?.text ?? ""}</textarea></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("When it is denied")}</span><textarea class="dgl-autogrow" data-count name="msg_denied" data-ac rows="3"${addAttribute(LIMITS.message, "maxlength")}${addAttribute(defaultMessages.denied, "placeholder")} data-astro-cid-pq47sjvz>${f.messages?.denied?.text ?? ""}</textarea></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Saved embed when accepted")}</span><select name="tpl_accepted" data-tpl-locks="msg_accepted" data-astro-cid-pq47sjvz><option value="" data-astro-cid-pq47sjvz>${dt("None: use the text")}</option>${templates.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === f.messages?.accepted?.template, "selected")} data-astro-cid-pq47sjvz>${n}</option>`)}</select></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Saved embed when denied")}</span><select name="tpl_denied" data-tpl-locks="msg_denied" data-astro-cid-pq47sjvz><option value="" data-astro-cid-pq47sjvz>${dt("None: use the text")}</option>${templates.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === f.messages?.denied?.template, "selected")} data-astro-cid-pq47sjvz>${n}</option>`)}</select></label> </div> </div> </details> <details class="fm-fold" id="fm-web-page" data-fm-fold data-astro-cid-pq47sjvz> <summary data-astro-cid-pq47sjvz><span class="fm-fold-icon" aria-hidden="true" data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:browser-bold", "width": "16", "height": "16", "data-astro-cid-pq47sjvz": true })}</span><span class="fm-fold-title" data-astro-cid-pq47sjvz><h2 data-astro-cid-pq47sjvz>${dt("Web page")}</h2><em data-astro-cid-pq47sjvz>${dt("How the page of the form looks on petto.sbs.")}</em></span>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "fm-fold-caret", "width": "14", "height": "14", "data-astro-cid-pq47sjvz": true })}</summary> <div class="fm-fold-body" data-astro-cid-pq47sjvz> <p class="fm-hint" data-astro-cid-pq47sjvz>${dt("How the page of the form looks on petto.sbs. The color of the form (in Basics) is its accent; the tab shows the icon of the server, and its title is the form and the server.")}</p> <div class="fm-grid" data-astro-cid-pq47sjvz> <label class="fm-check fm-wide" data-astro-cid-pq47sjvz><input type="checkbox" name="web_enabled"${addAttribute(f.web_enabled !== false, "checked")} data-astro-cid-pq47sjvz>${dt("Allow filling on the web")}</label> ${!isNew && f.web_enabled !== false && webPath && renderTemplate`<div class="fm-weblink fm-wide" data-astro-cid-pq47sjvz> <span class="fm-weblink-label" data-astro-cid-pq47sjvz>${dt("Link of the form:")}</span> <div class="fm-weblink-row" data-astro-cid-pq47sjvz> <a class="fm-weblink-url"${addAttribute(webPath, "href")} target="_blank" rel="noopener" data-astro-cid-pq47sjvz><span class="fm-weblink-host" data-astro-cid-pq47sjvz>${`petto.sbs${webPath.slice(0, -12)}`}</span><b data-astro-cid-pq47sjvz>${f.public_id}</b></a> <button type="button" class="btn btn-ghost btn-sm"${addAttribute(`https://petto.sbs${webPath}`, "data-fm-copy")}${addAttribute(dt("Copied"), "data-done")} data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:copy-simple-bold", "width": "13", "height": "13", "data-astro-cid-pq47sjvz": true })}<span data-astro-cid-pq47sjvz>${dt("Copy")}</span></button> <button type="submit" class="btn btn-ghost btn-sm" form="fm-relink" formnovalidate data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrows-clockwise-bold", "width": "13", "height": "13", "data-astro-cid-pq47sjvz": true })}${dt("New link")}</button> </div> <em class="fm-hint" data-astro-cid-pq47sjvz>${dt("Anyone in the server with this link can open the form. Pasted in Discord, it shows the link preview below. A new link stops the old one at once; panels already posted keep the old one.")}</em> </div>`} <label class="fm-field fm-wide" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Banner image")}</span><input type="text" inputmode="url" name="page_banner"${addAttribute(look.banner ?? "", "value")}${addAttribute(LIMITS.image, "maxlength")} placeholder="https://…/banner.png" autocomplete="off" spellcheck="false" data-page-banner data-astro-cid-pq47sjvz><em data-astro-cid-pq47sjvz>${dt("A wide picture on top of the page: an https link to a .png, .jpg, .gif or .webp picture. Empty: no banner.")}</em><em class="fm-bad" data-page-banner-bad hidden data-astro-cid-pq47sjvz>${dt("That link cannot be used: it must start with https:// and end in .png, .jpg, .gif or .webp.")}</em></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Background")}</span><select name="page_background" data-page-background data-astro-cid-pq47sjvz>${PAGE_BACKGROUNDS.map((b) => renderTemplate`<option${addAttribute(b, "value")}${addAttribute(b === look.background, "selected")}${addAttribute(!premiumActive && PREMIUM_PAGE_BACKGROUNDS.includes(b) && b !== look.background, "disabled")} data-astro-cid-pq47sjvz>${backgroundNames[b]}${premiumMark(b)}</option>`)}</select></label> <div class="fm-field fm-center" data-astro-cid-pq47sjvz> <label class="fm-check" data-astro-cid-pq47sjvz><input type="checkbox" name="page_show_icon"${addAttribute(look.show_icon, "checked")} data-page-show-icon data-astro-cid-pq47sjvz>${dt("Show the server icon")}</label> <label class="fm-check" data-astro-cid-pq47sjvz><input type="checkbox" name="page_show_name"${addAttribute(look.show_name, "checked")} data-page-show-name data-astro-cid-pq47sjvz>${dt("Show the server name")}</label> <label class="fm-check"${addAttribute(premiumActive ? void 0 : dt("A Premium touch"), "title")} data-astro-cid-pq47sjvz><input type="checkbox" name="page_hide_branding"${addAttribute(look.hide_branding, "checked")}${addAttribute(!premiumActive && !look.hide_branding, "disabled")} data-astro-cid-pq47sjvz>${dt('Hide the "Forms by Petto" line')}${!premiumActive && renderTemplate`<span class="fm-premium-tag" data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "11", "height": "11", "data-astro-cid-pq47sjvz": true })}Premium</span>`}</label> </div> <div class="fm-field fm-wide" data-astro-cid-pq47sjvz> <span data-astro-cid-pq47sjvz>${dt("Preview of the page")}</span> <div${addAttribute(["fm-page-pv", `bg-${look.background}`], "class:list")} data-page-pv${addAttribute(f.color != null ? `--wf:${hexColor(f.color)}` : void 0, "style")} aria-hidden="true" data-astro-cid-pq47sjvz> <div class="fm-page-pv-head" data-astro-cid-pq47sjvz> <div class="fm-page-pv-banner" data-page-pv-banner${addAttribute(!look.banner, "hidden")} data-astro-cid-pq47sjvz><img${addAttribute(look.banner ?? void 0, "src")} alt="" referrerpolicy="no-referrer" data-page-pv-banner-img data-astro-cid-pq47sjvz></div> <div class="fm-page-pv-server" data-astro-cid-pq47sjvz> <img${addAttribute(guildIcon, "src")} alt="" width="22" height="22" data-page-pv-icon${addAttribute(!look.show_icon, "hidden")} data-astro-cid-pq47sjvz> <span data-page-pv-name${addAttribute(!look.show_name, "hidden")} data-astro-cid-pq47sjvz>${guildName}</span> <code data-astro-cid-pq47sjvz>~/form/${f.public_id || "x7Kp9QzA2mVt"}</code> </div> <b data-page-pv-title data-astro-cid-pq47sjvz>${f.title || dt("The title")}</b> <span class="fm-page-pv-desc" data-page-pv-desc${addAttribute(!f.description, "hidden")} data-astro-cid-pq47sjvz>${f.description ?? ""}</span> </div> <div class="fm-page-pv-q" data-astro-cid-pq47sjvz><span class="fm-page-pv-n" data-astro-cid-pq47sjvz>1</span><i data-astro-cid-pq47sjvz></i><i class="short" data-astro-cid-pq47sjvz></i><span class="fm-page-pv-btn" data-astro-cid-pq47sjvz>${dt("Send")}</span></div> </div> <em data-astro-cid-pq47sjvz>${dt("The tab of the browser:")} <span class="fm-page-pv-tab" data-astro-cid-pq47sjvz><img${addAttribute(guildIcon, "src")} alt="" width="14" height="14" data-astro-cid-pq47sjvz><span data-page-pv-tab data-astro-cid-pq47sjvz>${`${f.title || dt("The title")} \xB7 ${guildName}`}</span></span></em> </div> </div> </div> </details> <details class="fm-fold" id="fm-link-preview" data-fm-fold data-astro-cid-pq47sjvz> <summary data-astro-cid-pq47sjvz><span class="fm-fold-icon" aria-hidden="true" data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:link-simple-bold", "width": "16", "height": "16", "data-astro-cid-pq47sjvz": true })}</span><span class="fm-fold-title" data-astro-cid-pq47sjvz><h2 data-astro-cid-pq47sjvz>${dt("Link preview")}</h2><em data-astro-cid-pq47sjvz>${dt("How the link looks when it is pasted in Discord.")}</em></span>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "fm-fold-caret", "width": "14", "height": "14", "data-astro-cid-pq47sjvz": true })}</summary> <div class="fm-fold-body" data-astro-cid-pq47sjvz> <p class="fm-hint" data-astro-cid-pq47sjvz>${dt("How the link of the form looks when someone pastes it in Discord (and other chats). Empty fields use the title, the description, the banner and the color of the form.")}</p> <div class="fm-grid" data-astro-cid-pq47sjvz> <label class="fm-field fm-wide" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Title")}</span><input type="text" name="embed_title"${addAttribute(embed.title ?? "", "value")}${addAttribute(LIMITS.embedTitle, "maxlength")}${addAttribute(embedDefaults.title, "placeholder")} data-embed-title data-astro-cid-pq47sjvz></label> <label class="fm-field fm-wide" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Description")}</span><textarea class="dgl-autogrow" data-count data-ac name="embed_description" rows="2"${addAttribute(LIMITS.embedDescription, "maxlength")}${addAttribute(embedDefaults.description, "placeholder")} data-embed-desc data-astro-cid-pq47sjvz>${embed.description ?? ""}</textarea></label> <label class="fm-field fm-wide" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Image")}</span><input type="text" inputmode="url" name="embed_image"${addAttribute(embed.image ?? "", "value")}${addAttribute(LIMITS.image, "maxlength")} placeholder="https://…/preview.png" autocomplete="off" spellcheck="false" data-embed-image data-astro-cid-pq47sjvz><em data-astro-cid-pq47sjvz>${dt("An https link to a .png, .jpg, .gif or .webp picture. Empty uses the banner, then the icon of the server.")}</em><em class="fm-bad" data-embed-image-bad hidden data-astro-cid-pq47sjvz>${dt("That link cannot be used: it must start with https:// and end in .png, .jpg, .gif or .webp.")}</em></label> <div class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Side color")}</span>${renderComponent($$result3, "ColorPicker", $$ColorPicker, { "name": "embed_color", "value": hexColor(embed.color), "label": dt("Side color"), "allowNone": true, "data-astro-cid-pq47sjvz": true })}</div> <label class="fm-check fm-center" data-astro-cid-pq47sjvz><input type="checkbox" name="embed_thumbnail"${addAttribute(embed.thumbnail, "checked")} data-embed-thumb data-astro-cid-pq47sjvz>${dt("Show the image small, as a thumbnail")}</label> <div class="fm-field fm-wide" data-astro-cid-pq47sjvz> <span data-astro-cid-pq47sjvz>${dt("Preview in Discord")}</span> <div${addAttribute(["fm-embed", { thumb: embed.thumbnail || !embed.image && !look.banner }], "class:list")} data-embed-pv${addAttribute(guildIcon, "data-icon")}${addAttribute(guildName, "data-site")}${addAttribute(`--bar:${hexColor(embed.color ?? f.color) || "#f0a88f"}`, "style")} aria-hidden="true" data-astro-cid-pq47sjvz> <small data-embed-pv-site data-astro-cid-pq47sjvz>${guildName}</small> <b data-embed-pv-title${addAttribute(embedDefaults.title, "data-default")} data-astro-cid-pq47sjvz>${embed.title || embedDefaults.title}</b> <span data-embed-pv-desc${addAttribute(embedDefaults.description, "data-default")} data-astro-cid-pq47sjvz>${embed.description || embedDefaults.description}</span> <div class="fm-embed-img" data-embed-pv-img${addAttribute(`background-image:url(${JSON.stringify(embedImage ?? guildIcon)})`, "style")} data-astro-cid-pq47sjvz></div> </div> <em data-astro-cid-pq47sjvz>${dt("Discord keeps a preview for a while: a link pasted before a change can show the old one.")}</em> </div> </div> </div> </details> <details class="fm-fold" data-fm-fold data-astro-cid-pq47sjvz> <summary data-astro-cid-pq47sjvz><span class="fm-fold-icon" aria-hidden="true" data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:cursor-click-bold", "width": "16", "height": "16", "data-astro-cid-pq47sjvz": true })}</span><span class="fm-fold-title" data-astro-cid-pq47sjvz><h2 data-astro-cid-pq47sjvz>${dt("Panel button")}</h2><em data-astro-cid-pq47sjvz>${dt("The button that opens the form in a panel.")}</em></span>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "fm-fold-caret", "width": "14", "height": "14", "data-astro-cid-pq47sjvz": true })}</summary> <div class="fm-fold-body" data-astro-cid-pq47sjvz> <div class="fm-grid" data-astro-cid-pq47sjvz> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Button text")}</span><input type="text" name="button_label" data-ac="vars,emojis"${addAttribute(f.button_label ?? "", "value")}${addAttribute(LIMITS.buttonLabel, "maxlength")}${addAttribute(f.title || dt("The title"), "placeholder")} data-preview-button data-astro-cid-pq47sjvz></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Button emoji")}</span><input type="text" name="button_emoji"${addAttribute(f.button_emoji ?? "", "value")} maxlength="64" placeholder="📝" data-astro-cid-pq47sjvz></label> <label class="fm-field" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz>${dt("Button color")}</span><select name="button_style" data-preview-style data-astro-cid-pq47sjvz>${BUTTON_STYLES.map((s) => renderTemplate`<option${addAttribute(s, "value")}${addAttribute(s === f.button_style, "selected")} data-astro-cid-pq47sjvz>${styleNames[s]}</option>`)}</select></label> </div> </div> </details> <div class="fm-actions" data-astro-cid-pq47sjvz><button type="submit" class="btn btn-accent" data-astro-cid-pq47sjvz>${dt("Save form")}</button></div> </form> <aside class="fm-preview"${addAttribute(dt("Preview"), "aria-label")} data-astro-cid-pq47sjvz> <h3 data-astro-cid-pq47sjvz>${dt("Preview")}</h3> <div class="fm-dpanel" data-astro-cid-pq47sjvz><b data-pv-title data-astro-cid-pq47sjvz>${f.title || dt("The title")}</b><span data-pv-desc data-astro-cid-pq47sjvz>${f.description || ""}</span><span${addAttribute(["fm-dbtn", f.button_style], "class:list")} data-pv-button data-astro-cid-pq47sjvz>${f.button_label || f.title || dt("Apply")}</span></div> <div data-pv-pages data-astro-cid-pq47sjvz></div> </aside> </div> ${!isNew && webPath && renderTemplate`<form method="POST" id="fm-relink" hidden data-no-dirty${addAttribute(dt("Make a new link? The old link stops working at once, and panels already posted keep the old one."), "data-confirm")} data-confirm-tone="neutral" data-astro-cid-pq47sjvz> <input type="hidden" name="action" value="relink_form" data-astro-cid-pq47sjvz><input type="hidden" name="form_id"${addAttribute(f.id, "value")} data-astro-cid-pq47sjvz> </form>`}${!isNew && renderTemplate`<form method="POST" class="fm-danger" data-no-dirty${addAttribute(dt("Delete this form? What members already sent is kept."), "data-confirm")} data-astro-cid-pq47sjvz> <input type="hidden" name="action" value="delete_form" data-astro-cid-pq47sjvz><input type="hidden" name="form_id"${addAttribute(f.id, "value")} data-astro-cid-pq47sjvz> <button type="submit" class="fm-del" data-astro-cid-pq47sjvz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:trash-bold", "width": "13", "height": "13", "data-astro-cid-pq47sjvz": true })}${dt("Delete form")}</button> </form>`}` })}`} ${section === "submissions" && renderTemplate`<div class="fms-page" data-astro-cid-pq47sjvz> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Pending"), value: pendingTotal, tone: "reactions" },
    ...storage.known ? [{ label: dt("Stored"), value: storage.stored, tone: "voice" }] : [],
    { label: dt("Forms"), value: forms.length, tone: "messages" }
  ], "data-astro-cid-pq47sjvz": true })} <nav class="fms-tabs" role="tablist"${addAttribute(dt("Form submissions"), "aria-label")} data-astro-cid-pq47sjvz> ${["pending", "accepted", "denied", "cancelled", "all"].map((s) => renderTemplate`<a role="tab"${addAttribute(statusFilter === s ? "true" : "false", "aria-selected")}${addAttribute(filterHref({ status: s }), "href")}${addAttribute(["fms-tab", { on: statusFilter === s }], "class:list")} data-astro-cid-pq47sjvz>${statusNames[s]}${s === "pending" && pendingTotal > 0 && renderTemplate`<em data-astro-cid-pq47sjvz>${pendingTotal}</em>`}</a>`)} </nav> <form method="GET" class="fms-filters" data-no-dirty data-astro-cid-pq47sjvz> <input type="hidden" name="section" value="submissions" data-astro-cid-pq47sjvz><input type="hidden" name="status"${addAttribute(statusFilter, "value")} data-astro-cid-pq47sjvz> <div class="dfx-field fms-f-form" data-astro-cid-pq47sjvz><select name="f"${addAttribute(dt("Form"), "aria-label")} data-astro-cid-pq47sjvz><option value="" data-astro-cid-pq47sjvz>${dt("All forms")}</option>${forms.map((x) => renderTemplate`<option${addAttribute(x.id, "value")}${addAttribute(String(x.id) === formFilter, "selected")} data-astro-cid-pq47sjvz>${x.title}</option>`)}</select></div> <div class="dfx-field fms-f-search" data-astro-cid-pq47sjvz><input type="search" name="q"${addAttribute(search, "value")}${addAttribute(dt("Name, user ID or #number"), "placeholder")}${addAttribute(dt("Search"), "aria-label")} data-astro-cid-pq47sjvz></div> <button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-pq47sjvz>${dt("Filter")}</button> </form> ${submissions.length === 0 && renderTemplate`<p class="fms-empty" data-astro-cid-pq47sjvz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:tray-fill", "width": "20", "height": "20", "data-astro-cid-pq47sjvz": true })}${dt("Nothing here.")}</p>`} <div class="fms-list dgl-stagger" data-astro-cid-pq47sjvz> ${submissions.map((s) => renderTemplate`<details class="dfx-acc fms-sub"${addAttribute(submissions.length === 1, "open")} data-astro-cid-pq47sjvz> <summary data-astro-cid-pq47sjvz> <span class="fms-who" data-astro-cid-pq47sjvz>${s.avatar_url ? renderTemplate`<img${addAttribute(s.avatar_url, "src")} alt="" width="36" height="36" loading="lazy" data-astro-cid-pq47sjvz>` : renderTemplate`<span class="fms-av" aria-hidden="true" data-astro-cid-pq47sjvz>${String(s.username ?? "?").slice(0, 1).toUpperCase()}</span>`}</span> <span class="dfx-acc-title" data-astro-cid-pq47sjvz><b class="fms-name" data-astro-cid-pq47sjvz>#${s.number} · ${s.username}</b><em data-astro-cid-pq47sjvz>${s.form_title || formName(s.form_id) || s.form_name} · ${when(s.created_at)}</em></span> <span${addAttribute(["fms-chip", s.status], "class:list")} data-astro-cid-pq47sjvz>${statusNames[s.status] ?? s.status}</span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14", "data-astro-cid-pq47sjvz": true })} </summary> <div class="dfx-acc-body" data-astro-cid-pq47sjvz> <p class="fms-links" data-astro-cid-pq47sjvz><code data-astro-cid-pq47sjvz>${s.user_id}</code>${s.channel_id && s.message_id && renderTemplate`<a${addAttribute(`https://discord.com/channels/${guildId}/${s.channel_id}/${s.message_id}`, "href")} target="_blank" rel="noopener" data-astro-cid-pq47sjvz>${dt("Card in Discord")}</a>`}${s.thread_id && renderTemplate`<a${addAttribute(`https://discord.com/channels/${guildId}/${s.thread_id}`, "href")} target="_blank" rel="noopener" data-astro-cid-pq47sjvz>${dt("Thread")}</a>`}</p> ${s.compacted ? renderTemplate`<p class="dfx-hint" data-astro-cid-pq47sjvz>${dt("The answers were removed after the retention time.")}</p>` : renderTemplate`<dl class="fms-answers" data-astro-cid-pq47sjvz>${(s.answers ?? []).map((a) => renderTemplate`<div class="fms-qa" data-astro-cid-pq47sjvz><dt data-astro-cid-pq47sjvz>${a.label}</dt><dd data-astro-cid-pq47sjvz>${answerText(a, yesWord, noWord) || renderTemplate`<em data-astro-cid-pq47sjvz>${dt("No answer")}</em>`}</dd></div>`)}</dl>`} ${s.status !== "pending" && s.reviewer_id && renderTemplate`<p class="fms-reviewed" data-astro-cid-pq47sjvz>${s.status === "accepted" ? dt("Accepted by {a}", { a: s.reviewer_name || s.reviewer_id }) : s.status === "denied" ? dt("Denied by {a}", { a: s.reviewer_name || s.reviewer_id }) : ""}${s.reviewed_at ? ` \xB7 ${when(s.reviewed_at)}` : ""}${s.reason && renderTemplate`<span class="fm-reason" data-astro-cid-pq47sjvz> · ${s.reason}</span>`}</p>`} ${s.status === "pending" && renderTemplate`<form method="POST" class="fms-review" data-no-dirty data-astro-cid-pq47sjvz> <input type="hidden" name="action" value="review" data-astro-cid-pq47sjvz><input type="hidden" name="number"${addAttribute(s.number, "value")} data-astro-cid-pq47sjvz> <div class="dfx-field" data-astro-cid-pq47sjvz><label data-astro-cid-pq47sjvz>${dt("Reason")}</label><textarea name="reason" class="dgl-autogrow" rows="2" data-count data-ac="emojis" maxlength="1000"${addAttribute(dt("Reason (the member reads it)"), "placeholder")} data-astro-cid-pq47sjvz></textarea></div> <div class="fms-review-btns" data-astro-cid-pq47sjvz> <button type="submit" name="status" value="accepted" class="btn btn-accent btn-sm" data-astro-cid-pq47sjvz>${dt("Accept")}</button> <button type="submit" name="status" value="denied" class="fms-deny" data-astro-cid-pq47sjvz>${dt("Deny")}</button> </div> </form>`} </div> </details>`)} </div> <form method="POST" class="dfx-form fms-storage" data-no-dirty data-astro-cid-pq47sjvz> <input type="hidden" name="action" value="save_retention" data-astro-cid-pq47sjvz> <div class="dfx-sec-head" data-astro-cid-pq47sjvz><h2 data-astro-cid-pq47sjvz>${dt("Storage")}</h2>${storage.known && renderTemplate`<p data-astro-cid-pq47sjvz>${dt("{a} of {b} submissions stored. When it is full, the oldest reviewed ones make room; pending ones are never deleted.", { a: storage.stored, b: storage.cap })}</p>`}</div> ${storage.known && renderTemplate`<div class="fms-meter" role="img"${addAttribute(`${storage.stored} / ${storage.cap}`, "aria-label")} data-astro-cid-pq47sjvz><i${addAttribute(`width:${Math.min(100, Math.round(storage.stored / Math.max(1, storage.cap) * 100))}%`, "style")} data-astro-cid-pq47sjvz></i></div>`} <div class="dfx-field fms-narrow" data-astro-cid-pq47sjvz> <label data-astro-cid-pq47sjvz>${dt("Keep the answers of reviewed submissions for (days)")}</label> <input type="number" name="retention_days" min="1" max="365"${addAttribute(storage.retention, "value")} data-astro-cid-pq47sjvz> <span class="dfx-hint" data-astro-cid-pq47sjvz>${dt("After that only a small record stays: form, member, state, reviewer, dates and the link to the card.")}</span> </div> <div class="dfx-foot" data-astro-cid-pq47sjvz><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-pq47sjvz>${dt("Save")}</button></div> </form> </div>`} ${section === "panels" && renderTemplate`<div class="fms-page" data-astro-cid-pq47sjvz> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Posted panels"), value: panels.length, tone: "invites" },
    { label: dt("Forms"), value: forms.length, tone: "messages" },
    { label: dt("Open forms"), value: forms.filter((x) => x.status === "open").length, tone: "joins" }
  ], "data-astro-cid-pq47sjvz": true })} ${forms.length === 0 ? renderTemplate`<div class="dfx-form fms-form-first" data-astro-cid-pq47sjvz><p class="fms-empty" data-astro-cid-pq47sjvz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clipboard-text-fill", "width": "20", "height": "20", "data-astro-cid-pq47sjvz": true })}<span data-astro-cid-pq47sjvz>${dt("Make a form first.")} <a${addAttribute(`${base}?section=forms&form=new`, "href")} data-astro-cid-pq47sjvz>${dt("New form")}</a></span></p></div>` : renderTemplate`<form method="POST" class="dfx-form fms-post" data-no-dirty data-astro-cid-pq47sjvz> <input type="hidden" name="action" value="post_panel" data-astro-cid-pq47sjvz> <section class="dfx-sec fms-first" data-astro-cid-pq47sjvz> <div class="dfx-sec-head" data-astro-cid-pq47sjvz><h2 data-astro-cid-pq47sjvz>${dt("Post a panel")}</h2><p data-astro-cid-pq47sjvz>${dt("The message members press to fill a form. Pick where it goes and which forms it opens.")}</p></div> <div class="dfx-grid" data-astro-cid-pq47sjvz> <div class="dfx-field" data-astro-cid-pq47sjvz><label data-astro-cid-pq47sjvz>${dt("Channel")}</label><select name="channel_id" required data-astro-cid-pq47sjvz><option value="" data-astro-cid-pq47sjvz>${dt("Pick a channel")}</option>${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-pq47sjvz>#${c.name}</option>`)}</select></div> <div class="dfx-field" data-astro-cid-pq47sjvz> <span class="dfx-label" data-astro-cid-pq47sjvz>${dt("Style")}</span> <div class="dfx-chips" data-astro-cid-pq47sjvz> <label class="dfx-chip" data-astro-cid-pq47sjvz><input type="radio" name="style" value="buttons" checked data-astro-cid-pq47sjvz>${dt("Buttons")}</label> <label class="dfx-chip" data-astro-cid-pq47sjvz><input type="radio" name="style" value="select" data-astro-cid-pq47sjvz>${dt("A menu")}</label> </div> </div> <div class="dfx-field dfx-wide" data-astro-cid-pq47sjvz><label data-astro-cid-pq47sjvz>${dt("Forms it opens")}</label>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "form_ids", "options": formOptions, "selected": formOptions.length === 1 ? [formOptions[0].id] : [], "placeholder": dt("Pick forms"), "data-astro-cid-pq47sjvz": true })}</div> </div> </section> <section class="dfx-sec" data-astro-cid-pq47sjvz> <div class="dfx-sec-head" data-astro-cid-pq47sjvz><h2 data-astro-cid-pq47sjvz>${dt("The card")}</h2><p data-astro-cid-pq47sjvz>${dt("What the message says. Write it here or choose a design from the Embeds page.")}</p></div> <div class="dfx-grid" data-astro-cid-pq47sjvz> <div class="dfx-field" data-astro-cid-pq47sjvz><label data-astro-cid-pq47sjvz>${dt("Saved embed (optional)")}</label><select name="template" data-tpl-locks="panel_title panel_description" data-astro-cid-pq47sjvz><option value="" data-astro-cid-pq47sjvz>${dt("None: Petto makes the card")}</option>${templates.map((n) => renderTemplate`<option${addAttribute(n, "value")} data-astro-cid-pq47sjvz>${n}</option>`)}</select></div> <div class="dfx-field" data-astro-cid-pq47sjvz><label data-astro-cid-pq47sjvz>${dt("Color")}</label>${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "panel_color", "value": "", "label": dt("Color"), "allowNone": true, "data-astro-cid-pq47sjvz": true })}</div> <div class="dfx-field dfx-wide" data-astro-cid-pq47sjvz><label data-astro-cid-pq47sjvz>${dt("Title (optional)")}</label><textarea name="panel_title" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-ac="emojis" maxlength="200"${addAttribute(dt("Applications"), "placeholder")} data-astro-cid-pq47sjvz></textarea></div> <div class="dfx-field dfx-wide" data-astro-cid-pq47sjvz><label data-astro-cid-pq47sjvz>${dt("Text (optional)")}</label><textarea name="panel_description" class="dgl-autogrow" data-count data-ac rows="3" maxlength="2000" data-astro-cid-pq47sjvz></textarea></div> </div> <label class="dfx-switch" data-astro-cid-pq47sjvz><span data-astro-cid-pq47sjvz><b data-astro-cid-pq47sjvz>${dt('Add a "Fill on the web" link button')}</b><em data-astro-cid-pq47sjvz>${dt("Members can also fill the form on the web, from a link button.")}</em></span><input type="checkbox" class="dfx-t" name="panel_web" data-astro-cid-pq47sjvz></label> </section> <div class="dfx-foot" data-astro-cid-pq47sjvz><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-pq47sjvz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "13", "height": "13", "data-astro-cid-pq47sjvz": true })}${dt("Post panel")}</button><span class="dfx-hint" data-astro-cid-pq47sjvz>${dt("Closed forms answer that they are closed when pressed.")}</span></div> </form>`} <div class="fms-posted" data-astro-cid-pq47sjvz> <div class="fms-head" data-astro-cid-pq47sjvz><h2 data-astro-cid-pq47sjvz>${dt("Posted panels")} <span class="fms-count" data-astro-cid-pq47sjvz>${panels.length}</span></h2></div> ${panels.length === 0 && renderTemplate`<p class="fms-empty" data-astro-cid-pq47sjvz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:cursor-click-fill", "width": "20", "height": "20", "data-astro-cid-pq47sjvz": true })}${dt("No panels yet.")}</p>`} <div class="fms-rows dgl-stagger" data-astro-cid-pq47sjvz> ${panels.map((p) => renderTemplate`<div class="fms-row" data-astro-cid-pq47sjvz> <span class="fms-row-icon" data-astro-cid-pq47sjvz>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:cursor-click-fill", "width": "17", "height": "17", "data-astro-cid-pq47sjvz": true })}</span> <div class="fms-row-main" data-astro-cid-pq47sjvz> <b data-astro-cid-pq47sjvz>#${channels.find((c) => c.id === p.channel_id)?.name ?? p.channel_id}</b> <span class="dfx-hint" data-astro-cid-pq47sjvz>${(p.form_ids ?? []).map((id) => formName(id) ?? dt("Deleted form")).join(", ")} · ${p.style === "select" ? dt("A menu") : dt("Buttons")} · ${when(p.created_at)}</span> </div> ${p.message_id && renderTemplate`<a class="btn btn-ghost btn-sm"${addAttribute(`https://discord.com/channels/${guildId}/${p.channel_id}/${p.message_id}`, "href")} target="_blank" rel="noopener" data-astro-cid-pq47sjvz>${dt("Open in Discord")}</a>`} </div>`)} </div> </div> </div>`} </div> ` }));
}, "/home/runner/work/petto-web/petto-web/src/components/DashForms.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Forms = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Forms;
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
  const SECTIONS = ["forms", "submissions", "panels"];
  const section = SECTIONS.includes(String(Astro2.url.searchParams.get("section"))) ? String(Astro2.url.searchParams.get("section")) : "forms";
  const formParam = Astro2.url.searchParams.get("form");
  const statusParam = String(Astro2.url.searchParams.get("status") ?? "pending");
  const statusFilter = [...STATUSES, "all"].includes(statusParam) ? statusParam : "pending";
  const formFilter = /^\d{1,15}$/.test(String(Astro2.url.searchParams.get("f") ?? "")) ? String(Astro2.url.searchParams.get("f")) : "";
  const search = String(Astro2.url.searchParams.get("q") ?? "").trim().slice(0, 60);
  const rest = (path, init = {}) => fetch(`${apiUrl}/rest/v1/${path}`, { ...init, headers: { ...apiHeaders, ...init.headers } });
  const lines = (value) => String(value ?? "").replace(/\r\n?/g, "\n");
  const text = (value, max) => lines(value).replace(/\u0000/g, "").trim().slice(0, max);
  const plan = FORM_PLAN;
  const missingEmbedColumns = async (res) => /embed_(?:title|description|image|color|thumbnail)|page_hide_branding/.test(await res.clone().text().catch(() => ""));
  const LATER_COLUMNS = [...EMBED_COLUMNS, ...NEWER_PAGE_COLUMNS];
  const withoutEmbed = (row) => Object.fromEntries(Object.entries(row).filter(([key]) => !LATER_COLUMNS.includes(key)));
  const premiumActive = await hasPremiumForGuild(Astro2, session.userId, id);
  let message = null;
  let redirectTo = null;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    await ensureGuildRow(apiUrl, apiHeaders, id);
    const failed = () => {
      message = { kind: "err", text: dt("It could not be saved, try again.") };
    };
    const formId = /^\d{1,15}$/.test(String(form.get("form_id") ?? "")) ? String(form.get("form_id")) : "";
    if (action === "save_form") {
      let questions = [];
      try {
        questions = JSON.parse(String(form.get("questions_json") ?? "[]"));
      } catch {
      }
      const closes = text(form.get("closes_at"), 40);
      const clean = normalizeForm({
        name: form.get("name"),
        title: form.get("title"),
        description: lines(form.get("description")),
        color: /^#[0-9a-f]{6}$/i.test(text(form.get("color"), 7)) ? parseInt(text(form.get("color"), 7).slice(1), 16) : null,
        status: form.get("status"),
        questions,
        review_channel_id: form.get("review_channel_id"),
        reviewer_role_ids: form.getAll("reviewer_role_ids"),
        ping_role_ids: form.getAll("ping_role_ids"),
        auto_thread: form.get("auto_thread") === "on",
        required_role_ids: form.getAll("required_role_ids"),
        blocked_role_ids: form.getAll("blocked_role_ids"),
        min_account_days: form.get("min_account_days"),
        min_member_days: form.get("min_member_days"),
        one_pending: form.get("one_pending") === "on",
        deny_cooldown_hours: form.get("deny_cooldown_hours"),
        max_per_user: form.get("max_per_user"),
        max_total: form.get("max_total"),
        closes_at: closes ? `${closes}${closes.length === 16 ? ":00" : ""}Z` : null,
        accept_add_role_ids: form.getAll("accept_add_role_ids"),
        accept_remove_role_ids: form.getAll("accept_remove_role_ids"),
        deny_add_role_ids: form.getAll("deny_add_role_ids"),
        deny_remove_role_ids: form.getAll("deny_remove_role_ids"),
        dm_results: form.get("dm_results") === "on",
        web_enabled: form.get("web_enabled") === "on",
        page_banner: form.get("page_banner"),
        page_background: form.get("page_background"),
        page_show_icon: form.get("page_show_icon") === "on",
        page_show_name: form.get("page_show_name") === "on",
        embed_title: form.get("embed_title"),
        embed_description: lines(form.get("embed_description")),
        embed_image: form.get("embed_image"),
        embed_thumbnail: form.get("embed_thumbnail") === "on",
        embed_color: /^#[0-9a-f]{6}$/i.test(text(form.get("embed_color"), 7)) ? parseInt(text(form.get("embed_color"), 7).slice(1), 16) : null,
        messages: {
          submitted: { text: lines(form.get("msg_submitted")) },
          accepted: { text: lines(form.get("msg_accepted")), template: form.get("tpl_accepted") },
          denied: { text: lines(form.get("msg_denied")), template: form.get("tpl_denied") }
        },
        button_label: form.get("button_label"),
        button_emoji: form.get("button_emoji"),
        button_style: form.get("button_style")
      }, { maxQuestions: plan.questions });
      let premiumWarn = "";
      if (!premiumActive && usesPremiumLook(clean)) {
        const storedRes = formId ? await rest(`forms?guild_id=eq.${id}&id=eq.${formId}&select=page_background,page_hide_branding`) : null;
        const stored = storedRes?.ok ? (await storedRes.json().catch(() => []))[0] ?? {} : {};
        let changed = false;
        if ((clean.page_background === "aurora" || clean.page_background === "waves") && stored.page_background !== clean.page_background) {
          clean.page_background = "gradient";
          changed = true;
        }
        if (clean.page_hide_branding && stored.page_hide_branding !== true) {
          clean.page_hide_branding = false;
          changed = true;
        }
        if (changed) premiumWarn = dt('Saved, but the animated backgrounds and hiding the "Forms by Petto" line are Premium touches, so the plain gradient and the line were kept.');
      }
      const asked = Array.isArray(questions) ? questions.length : 0;
      let warn = "";
      if (clean.status === "open" && (!clean.questions.length || !clean.review_channel_id)) {
        clean.status = "closed";
        warn = dt("Saved, but kept closed: it needs at least one question and a review channel.");
      } else if (premiumWarn) warn = premiumWarn;
      else if (asked > clean.questions.length) warn = dt("Saved. Questions without a text, choices with fewer than 2 options and the ones over the limit were left out.");
      else if (text(form.get("page_banner"), 600) && !clean.page_banner) warn = dt("Saved, but the banner was left out: use an https link to a .png, .jpg, .gif or .webp picture.");
      else if (text(form.get("embed_image"), 600) && !clean.embed_image) warn = dt("Saved, but the image of the link preview was left out: use an https link to a .png, .jpg, .gif or .webp picture.");
      if (!NAME.test(clean.name)) message = { kind: "err", text: dt("Use a short name with letters, numbers, - or _.") };
      else if (formId) {
        let res = await rest(`forms?guild_id=eq.${id}&id=eq.${formId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ ...clean, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
        if (res.status === 400 && await missingEmbedColumns(res)) {
          res = await rest(`forms?guild_id=eq.${id}&id=eq.${formId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ ...withoutEmbed(clean), updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
          if (res.ok) warn = dt("Saved, but the link preview could not be saved yet: Petto is being updated. Try again in a few minutes.");
        }
        if (res.status === 409) message = { kind: "err", text: dt("Another form already has that name.") };
        else if (!res.ok) failed();
        else redirectTo = `?section=forms&form=${formId}&saved=${warn ? "warn" : "1"}${warn ? `&w=${encodeURIComponent(warn)}` : ""}`;
      } else {
        const countRes = await rest(`forms?guild_id=eq.${id}&select=id`);
        const count = countRes.ok ? (await countRes.json()).length : 0;
        if (count >= plan.forms) message = { kind: "err", text: dt("You reached the limit of forms ({a}).", { a: plan.forms }) };
        else {
          let res = await rest("forms", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ guild_id: id, ...clean }) });
          if (res.status === 400 && await missingEmbedColumns(res)) {
            res = await rest("forms", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ guild_id: id, ...withoutEmbed(clean) }) });
            if (res.ok) warn = dt("Saved, but the link preview could not be saved yet: Petto is being updated. Try again in a few minutes.");
          }
          const row = res.ok ? (await res.json())[0] : null;
          if (res.status === 409) message = { kind: "err", text: dt("Another form already has that name.") };
          else if (row) redirectTo = `?section=forms&form=${row.id}&saved=${warn ? "warn" : "1"}${warn ? `&w=${encodeURIComponent(warn)}` : ""}`;
          else failed();
        }
      }
    } else if (action === "toggle_form" && formId) {
      const res = await rest(`forms?guild_id=eq.${id}&id=eq.${formId}&select=status,questions,review_channel_id`);
      const row = res.ok ? (await res.json())[0] : null;
      if (!row) failed();
      else if (row.status !== "open" && (!normalizeQuestions(row.questions).length || !row.review_channel_id)) message = { kind: "err", text: dt("A form needs at least one question and a review channel before it opens.") };
      else {
        const done = await rest(`forms?guild_id=eq.${id}&id=eq.${formId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: row.status === "open" ? "closed" : "open", updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
        message = done.ok ? { kind: "ok", text: row.status === "open" ? dt("Form closed.") : dt("Form opened.") } : { kind: "err", text: dt("It could not be saved, try again.") };
      }
    } else if (action === "relink_form" && formId) {
      const res = await rest(`forms?guild_id=eq.${id}&id=eq.${formId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ public_id: newPublicId(), updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
      if (res.ok) redirectTo = `?section=forms&form=${formId}&relinked=1`;
      else failed();
    } else if (action === "delete_form" && formId) {
      const res = await rest(`forms?guild_id=eq.${id}&id=eq.${formId}`, { method: "DELETE" });
      if (res.ok) redirectTo = "?section=forms&deleted=1";
      else failed();
    } else if (action === "duplicate_form" && formId) {
      const [orig, all] = await Promise.all([rest(`forms?guild_id=eq.${id}&id=eq.${formId}&select=*`), rest(`forms?guild_id=eq.${id}&select=name`)]);
      const original = orig.ok ? (await orig.json())[0] : null;
      const names = new Set((all.ok ? await all.json() : []).map((r) => r.name));
      if (!original) failed();
      else if (names.size >= plan.forms) message = { kind: "err", text: dt("You reached the limit of forms ({a}).", { a: plan.forms }) };
      else {
        let name = slugName(`${String(original.name).slice(0, 27)}-copy`);
        for (let n = 2; names.has(name); n += 1) name = slugName(`${String(original.name).slice(0, 26)}-copy${n}`);
        const { id: _drop, number: _n, public_id: _p, created_at: _c, updated_at: _u, guild_id: _g, ...copy } = original;
        const res = await rest("forms", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ guild_id: id, ...copy, name, status: "closed" }) });
        const row = res.ok ? (await res.json())[0] : null;
        if (row) redirectTo = `?section=forms&form=${row.id}`;
        else failed();
      }
    } else if (action === "review") {
      const status = String(form.get("status") ?? "");
      const result = await callPettoForms(Astro2, id, session.userId, "review", { number: Number(form.get("number")), status, reason: text(form.get("reason"), 1e3) }, dashLang);
      message = result.ok ? { kind: "ok", text: result.message || dt("Done.") } : { kind: "err", text: result.message || dt("The bot could not do it. Try again in a moment.") };
    } else if (action === "save_retention") {
      const days = Math.min(365, Math.max(1, Math.trunc(Number(form.get("retention_days"))) || 30));
      const res = await rest("form_config?on_conflict=guild_id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, retention_days: days, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
      message = res.ok ? { kind: "ok", text: dt("Saved.") } : { kind: "err", text: dt("It could not be saved, try again.") };
    } else if (action === "post_panel") {
      const color = text(form.get("panel_color"), 7);
      const result = await callPettoForms(Astro2, id, session.userId, "panel", {
        channel_id: text(form.get("channel_id"), 30),
        form_ids: form.getAll("form_ids").map(String).slice(0, 25),
        style: form.get("style") === "select" ? "select" : "buttons",
        template: text(form.get("template"), 100) || null,
        title: text(form.get("panel_title"), 200) || null,
        description: text(form.get("panel_description"), 2e3) || null,
        color: /^#[0-9a-f]{6}$/i.test(color) ? color : null,
        web: form.get("panel_web") === "on"
      }, dashLang);
      message = result.ok ? { kind: "ok", text: result.message || dt("Panel posted.") } : { kind: "err", text: result.message || dt("The bot could not do it. Try again in a moment.") };
    }
  }
  if (redirectTo) return Astro2.redirect(`/dash/guild/${id}/forms${redirectTo}`);
  const savedParam = Astro2.url.searchParams.get("saved");
  if (savedParam === "1") message = { kind: "ok", text: dt("Saved.") };
  if (savedParam === "warn") message = { kind: "warn", text: text(Astro2.url.searchParams.get("w"), 300) || dt("Saved.") };
  if (Astro2.url.searchParams.get("relinked") === "1") message = { kind: "ok", text: dt("New link made. The old one no longer works.") };
  if (Astro2.url.searchParams.get("deleted") === "1") message = { kind: "ok", text: dt("Form deleted. What members already sent is kept.") };
  const editing = section === "forms" && formParam ? formParam : null;
  const needsLists = Boolean(editing) || section === "panels";
  const SUMMARY_BUDGET_MS = Astro2.request.method === "POST" ? 3e4 : 300;
  const subsArgs = { status: statusFilter, form_id: formFilter || null, q: section === "submissions" ? search : "", limit: section === "submissions" ? 50 : 1 };
  const summaryStamp = Astro2.request.method === "POST" ? `post-${Date.now()}-${Math.random()}` : String(Astro2.locals.dashVersion ?? "");
  const summaryCall = section === "submissions" ? null : sharedCall(`forms-summary:${id}:${session.userId}:${summaryStamp}:${statusFilter}:${formFilter}`, () => callPettoForms(Astro2, id, session.userId, "submissions", subsArgs, dashLang), (result) => result.ok ? 6e4 : 3e3);
  const [guildInfo, formsRes, subsResult, panelsRes, rolesRes, channelsRes, templatesRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    () => rest(`forms?guild_id=eq.${id}&select=*&order=id.asc`),
    () => summaryCall ? withinBudget(summaryCall, SUMMARY_BUDGET_MS).then((ready2) => ready2?.value ?? null) : callPettoForms(Astro2, id, session.userId, "submissions", subsArgs, dashLang),
    () => section === "panels" ? rest(`form_panels?guild_id=eq.${id}&select=*&order=id.desc&limit=20`) : Promise.resolve(null),
    () => needsLists || section === "submissions" ? getGuildList(Astro2, id, botToken, "roles") : Promise.resolve(null),
    () => needsLists ? getGuildList(Astro2, id, botToken, "channels") : Promise.resolve(null),
    () => needsLists ? rest(`embed_templates?guild_id=eq.${id}&select=name&order=name.asc`) : Promise.resolve(null)
  ], 5);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = Boolean(formsRes?.ok);
  const forms = ready ? await formsRes.json() : [];
  const summaryKey = `forms-summary:${id}:${session.userId}`;
  if (summaryCall && !subsResult) markPending(Astro2);
  const subsData = subsResult?.ok ? subsResult.data : summaryCall && !subsResult ? lastAnswer(summaryKey) ?? null : null;
  if (summaryCall && subsResult?.ok) rememberAnswer(summaryKey, subsResult.data);
  const pending = subsData?.pending ?? {};
  const submissions = section === "submissions" ? subsData?.submissions ?? [] : [];
  const storage = { stored: Number(subsData?.stored ?? 0), cap: Number(subsData?.cap ?? plan.submissions), retention: Number(subsData?.retention_days ?? 30), known: Boolean(subsData) };
  const panels = panelsRes?.ok ? await panelsRes.json() : [];
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone" && !r.managed).sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const channels = (channelsRes?.ok ? await channelsRes.json() : []).filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  const templates = (templatesRes?.ok ? await templatesRes.json() : []).map((t) => t.name).filter(Boolean);
  const editForm = editing === "new" ? "new" : editing ? forms.find((f) => String(f.id) === editing) ?? null : null;
  return renderTemplate`${renderComponent($$result, "DashForms", $$DashForms, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "section": section, "forms": forms, "pending": pending, "submissions": submissions, "panels": panels, "roles": roles, "channels": channels, "templates": templates, "editing": editForm, "storage": storage, "statusFilter": statusFilter, "formFilter": formFilter, "search": search, "plan": plan, "ready": ready, "message": message, "premiumActive": premiumActive })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/forms.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/forms.astro";
const $$url = "/dash/guild/[id]/forms";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Forms,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
