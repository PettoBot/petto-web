import { c as createAstro, a as createComponent, r as renderTemplate, u as unescapeHTML, d as renderComponent, m as maybeRenderHead, b as addAttribute } from '../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashMeLayout } from '../../chunks/DashMeLayout_Dnw5sav5.mjs';
import { $ as $$DashPanelHead } from '../../chunks/DashPanelHead_DuJIgrL6.mjs';
import { m as makeT, g as getDashLang } from '../../chunks/dash_CORIPvM-.mjs';
/* empty css                                              */
import { g as getDashboardSession } from '../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../chunks/env_WnBvzCjc.mjs';
import { d as canEditChangelog, r as readRows, v as validateDraft, s as saveRow, V as VERSION, e as deleteRow, f as codeEntries, i as isoFromEnglish, g as cleanLang, h as compareVersions, j as validDate, k as draftFromCode } from '../../chunks/changelogFeed_DUjcvSF3.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashChangelogAdmin = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashChangelogAdmin;
  const { user, rows, draft, isNew = false, inDb = false, inCode = false, error, saved = false, deleted = false, unavailable = false } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const kinds = [
    { value: "security", label: dt("Security notice") },
    { value: "warning", label: dt("Warning") },
    { value: "breaking", label: dt("Change that breaks something") },
    { value: "info", label: dt("Information") }
  ];
  const tabs = [{ key: "en", label: "English" }, { key: "es", label: "Espa\xF1ol" }, { key: "pt", label: "Portugu\xEAs" }];
  return renderTemplate(_a || (_a = __template(["", ' <script type="application/json" id="ce-draft">', '<\/script> <script type="application/json" id="ce-labels">', "<\/script>  "])), renderComponent($$result, "DashMeLayout", $$DashMeLayout, { "user": user, "active": "staff-changelog", "pageTitle": "Changelog" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="ce-wrap" data-ce> ${renderComponent($$result2, "DashPanelHead", $$DashPanelHead, { "title": dt("Changelog"), "eyebrow": dt("Staff"), "icon": "ph:clock-counter-clockwise-fill", "back": false }, { "default": ($$result3) => renderTemplate` <a class="btn btn-ghost btn-sm" href="/changelog" target="_blank" rel="noopener">${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrow-square-out", "width": "14", "height": "14" })} ${dt("See the page")}</a> ` })} ${error && renderTemplate`<div class="ce-alert error">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17" })} ${error}</div>`} ${saved && !error && renderTemplate`<div class="ce-alert success">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17" })} ${dt("Saved.")}</div>`} ${deleted && !error && renderTemplate`<div class="ce-alert success">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17" })} ${dt("Removed from the database.")}</div>`} ${unavailable && renderTemplate`<div class="ce-alert error">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "17", "height": "17" })} ${dt("The database could not be read, so only the versions written in the code are listed. Saving may not work.")}</div>`} <div class="ce-versions"> ${rows.map((row) => renderTemplate`<a${addAttribute(`/dash/changelog-admin?v=${encodeURIComponent(row.version)}`, "href")}${addAttribute(["ce-version", { "is-current": !isNew && row.version === draft.version }], "class:list")}> <b>v${row.version}</b>${row.name && renderTemplate`<span> “${row.name}”</span>`} <small>${row.date}</small> ${row.notices > 0 && renderTemplate`<i class="ce-pill ce-pill-red">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-warning-fill", "width": "11", "height": "11" })} ${row.notices}</i>`} ${!row.published && renderTemplate`<i class="ce-pill">${dt("Draft")}</i>`} ${row.source === "code" && renderTemplate`<i class="ce-pill">${dt("In the code")}</i>`} </a>`)} <a href="/dash/changelog-admin?new=1"${addAttribute(["ce-version", "ce-new", { "is-current": isNew }], "class:list")}>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "13", "height": "13" })} ${dt("New version")}</a> </div> <p class="ce-origin"> ${isNew ? dt("A new version. It is not shown on the site until you save it as published.") : inDb ? dt("Saved in the database. Published versions show on the changelog and in its RSS feed within a minute.") : dt("Written in the code of the website. Saving it here replaces it on the site with what you write.")} </p> <form method="POST" class="ce-grid" data-no-dirty> <input type="hidden" name="action" value="save"> <input type="hidden" name="draft" value="" data-ce-json> <section class="ce-editor"> <div class="ce-card"> <div class="ce-fields"> <label>${dt("Version")}<input data-ce-field="version"${addAttribute(draft.version, "value")} placeholder="0.7.12" maxlength="20"${addAttribute(!isNew, "readonly")} required></label> <label>${dt("Code name")}<input data-ce-field="name"${addAttribute(draft.name, "value")} placeholder="Brownie" maxlength="40"></label> <label>${dt("Date")}<input data-ce-field="date" type="date"${addAttribute(draft.date, "value")}></label> <label class="ce-check"><input data-ce-field="published" type="checkbox"${addAttribute(draft.published, "checked")}> ${dt("Published")}</label> </div> </div> <div class="ce-tabs" role="tablist"> ${tabs.map((tab, index) => renderTemplate`<button type="button" role="tab"${addAttribute(["ce-tab", { "is-on": index === 0 }], "class:list")}${addAttribute(tab.key, "data-ce-tab")}>${tab.label}</button>`)} </div> <div class="ce-card"> <div class="ce-head"><h2>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-warning-fill", "width": "16", "height": "16" })} ${dt("Notices")}</h2><button type="button" class="btn btn-ghost btn-sm" data-ce-add="notice">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12" })} ${dt("Add a notice")}</button></div> <p class="ce-hint">${dt("A block that stands out above the list: a security breach, a warning, a change that breaks something, or plain information.")}</p> <div data-ce-notices></div> </div> <div class="ce-card"> <div class="ce-head"><h2>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-bullets-fill", "width": "16", "height": "16" })} ${dt("Changes")}</h2><button type="button" class="btn btn-ghost btn-sm" data-ce-add="item">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12" })} ${dt("Add a change")}</button></div> <p class="ce-hint">${dt("One line for each change. Markdown: `code` and [links](https://petto.sbs).")}</p> <div data-ce-items></div> </div> <div class="ce-actions"> <button class="btn btn-primary" type="submit">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:floppy-disk-fill", "width": "15", "height": "15" })} ${dt("Save")}</button> <button class="btn btn-ghost" type="button" data-ce-copy-from>${dt("Copy the English text to the other languages")}</button> </div> </section> <aside class="ce-preview"> <div class="ce-preview-head">${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "14", "height": "14" })} ${dt("Preview")} <span data-ce-preview-lang>English</span></div> <div class="win cl-win"> <div class="win-bar"> <span class="chip" style="background:var(--red)"></span><span class="chip" style="background:var(--yellow)"></span><span class="chip" style="background:var(--green)"></span> <span class="win-chan">#changelog</span> </div> <div class="win-body"> <div class="wmsg"> <div class="wav bot"><img src="/assets/mascot-icon.webp" alt=""></div> <div class="cl-body"> <div class="wmeta"><b>Petto</b><span class="wtag">${dt("Latest")}</span><span class="cl-date" data-ce-p-date></span></div> <div class="cl-version"><span data-ce-p-title></span></div> <div data-ce-p-notices></div> <ul class="cl-list" data-ce-p-items></ul> </div> </div> </div> </div> </aside> </form> ${inDb && renderTemplate`<form method="POST" class="ce-delete" data-no-dirty> <input type="hidden" name="action" value="delete"> <input type="hidden" name="version"${addAttribute(draft.version, "value")}> <button class="btn btn-ghost btn-sm" type="submit"${addAttribute(inCode ? dt("Remove this version from the database? The one written in the code shows again.") : dt("Remove this version from the database? It disappears from the site."), "data-confirm")}>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-bold", "width": "13", "height": "13" })} ${dt("Remove from the database")}</button> </form>`} </div> ` }), unescapeHTML(JSON.stringify(draft)), unescapeHTML(JSON.stringify({ kindLabels: Object.fromEntries(kinds.map((kind) => [kind.value, kind.label])), langNames: { en: "English", es: "Espa\xF1ol", pt: "Portugu\xEAs" }, labels: { remove: dt("Remove"), up: dt("Move up"), down: dt("Move down"), title: dt("Title"), text: dt("Text (Markdown)"), change: dt("Change"), none: dt("Nothing yet. Add the first one."), copied: dt("Copied.") } })));
}, "/home/runner/work/petto-web/petto-web/src/components/DashChangelogAdmin.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$ChangelogAdmin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ChangelogAdmin;
  const dt = makeT(getDashLang(Astro2));
  const session = await getDashboardSession(Astro2);
  if (!session) return Astro2.redirect("/dash");
  if (!await canEditChangelog(Astro2, session.userId)) return Astro2.redirect("/dash/manage?error=forbidden");
  if (!getEnv(Astro2, "PETTO_BOT_API_URL")) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const errors = {
    invalid: dt("That request was not valid."),
    version: dt("The version has to look like 0.7.12 (or 0.7.12-1 for a patch)."),
    date: dt("Choose a real date."),
    empty: dt("Write at least one change or one notice in English: the other languages show it when they have nothing of their own."),
    database: dt("The database did not accept the change. Try again."),
    not_configured: dt("The dashboard is not connected to the bot database.")
  };
  let error;
  let override = null;
  const rows = await readRows(Astro2);
  if (Astro2.request.method.toUpperCase() === "POST") {
    const origin = Astro2.request.headers.get("origin");
    if (origin && origin !== Astro2.url.origin) return Astro2.redirect("/dash/changelog-admin?error=invalid");
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    if (action === "save") {
      let parsed = null;
      const text = String(form.get("draft") ?? "");
      if (text.length <= 2e5) {
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = null;
        }
      }
      const checked = validateDraft(parsed);
      if (!checked.ok) {
        error = checked.error;
        override = parsed;
      } else {
        const result = await saveRow(Astro2, checked.row, session.userId);
        if (result.ok) return Astro2.redirect(`/dash/changelog-admin?v=${encodeURIComponent(checked.row.version)}&saved=1`);
        error = "error" in result ? result.error : "database";
        override = parsed;
      }
    } else if (action === "delete") {
      const version = String(form.get("version") ?? "");
      if (!VERSION.test(version)) return Astro2.redirect("/dash/changelog-admin?error=invalid");
      const result = await deleteRow(Astro2, version);
      return Astro2.redirect(result.ok ? `/dash/changelog-admin?deleted=1` : `/dash/changelog-admin?v=${encodeURIComponent(version)}&error=${"error" in result ? result.error : "database"}`);
    } else return Astro2.redirect("/dash/changelog-admin?error=invalid");
  }
  error ??= Astro2.url.searchParams.get("error") ?? void 0;
  const code = { en: codeEntries("en"), es: codeEntries("es"), pt: codeEntries("pt-BR") };
  const codeFor = (version) => ({ en: code.en.find((e) => e.version === version), es: code.es.find((e) => e.version === version), pt: code.pt.find((e) => e.version === version) });
  const byVersion = /* @__PURE__ */ new Map();
  for (const entry of code.en) byVersion.set(entry.version, { version: entry.version, name: entry.name ?? "", date: isoFromEnglish(entry.date) ?? entry.date, published: true, notices: entry.notices?.length ?? 0, source: "code" });
  for (const row2 of rows ?? []) byVersion.set(row2.version, { version: row2.version, name: row2.name, date: String(row2.release_date).slice(0, 10), published: row2.published, notices: cleanLang(row2.content?.en).notices.length, source: "db" });
  const list = [...byVersion.values()].sort((a, b) => compareVersions(b.version, a.version));
  const isNew = Astro2.url.searchParams.get("new") === "1" || override && !byVersion.has(String(override.version));
  const wanted = Astro2.url.searchParams.get("v") ?? String(override?.version ?? "");
  const current = byVersion.get(wanted) ?? (isNew ? void 0 : list[0]);
  const row = current ? (rows ?? []).find((r) => r.version === current.version) : void 0;
  const inCode = Boolean(current && code.en.some((e) => e.version === current.version));
  let draft;
  if (override) draft = { version: String(override.version ?? ""), name: String(override.name ?? ""), date: validDate(override.date) ?? "", published: override.published === true, langs: { en: cleanLang(override.langs?.en), es: cleanLang(override.langs?.es), pt: cleanLang(override.langs?.pt) } };
  else if (row) draft = { version: row.version, name: row.name, date: String(row.release_date).slice(0, 10), published: row.published, langs: { en: cleanLang(row.content?.en), es: cleanLang(row.content?.es), pt: cleanLang(row.content?.pt) } };
  else if (current) {
    const found = codeFor(current.version);
    draft = draftFromCode(current.date, current.name, current.version, { en: found.en, es: found.es, pt: found.pt });
  } else {
    draft = { version: "", name: "", date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), published: false, langs: { en: { notices: [], items: [] }, es: { notices: [], items: [] }, pt: { notices: [], items: [] } } };
  }
  const saved = Astro2.url.searchParams.get("saved") === "1";
  const deleted = Astro2.url.searchParams.get("deleted") === "1";
  return renderTemplate`${renderComponent($$result, "DashChangelogAdmin", $$DashChangelogAdmin, { "user": session, "rows": list, "draft": draft, "isNew": Boolean(isNew), "inDb": Boolean(row), "inCode": inCode, "error": error ? errors[error] ?? errors.invalid : void 0, "saved": saved, "deleted": deleted, "unavailable": rows === null })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/changelog-admin.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/changelog-admin.astro";
const $$url = "/dash/changelog-admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ChangelogAdmin,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
