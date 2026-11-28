import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, b as addAttribute, F as Fragment, u as unescapeHTML, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { a as automodNumber } from '../../../../chunks/automodLimits_o4rqLaIq.mjs';
import { f as findKnownUsers, d as describeTeam } from '../../../../chunks/team_C2OWrCGw.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$SxNumber } from '../../../../chunks/SxNumber_YL4vNksH.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { f as formatDuration } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
/* empty css                                               */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
import { J as callPettoCases, G as callPettoMemberSearch } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { b as botDay, r as rangeDays } from '../../../../chunks/activityStats_DxqJGP6E.mjs';
export { renderers } from '../../../../renderers.mjs';

const CASE_TYPES = ["ban", "tempban", "hardban", "softban", "kick", "mute", "tempmute", "warn", "jail", "unban", "unmute", "unjail"];
const CASE_FILTERS = {
  ban: ["ban", "tempban", "hardban"],
  softban: ["softban"],
  kick: ["kick"],
  mute: ["mute", "tempmute"],
  warn: ["warn"],
  jail: ["jail"],
  unban: ["unban"],
  unmute: ["unmute"],
  unjail: ["unjail"]
};
function caseTypesFor(type) {
  if (CASE_FILTERS[type]) return CASE_FILTERS[type];
  return CASE_TYPES.includes(type) ? [type] : null;
}
function caseFilterOf(type) {
  if (CASE_FILTERS[type]) return type;
  return Object.keys(CASE_FILTERS).find((key) => CASE_FILTERS[key].includes(type)) ?? "";
}
function readCaseSearch(raw) {
  const text = raw.replace(/\s+/g, " ").trim().slice(0, 100);
  if (!text) return { kind: "none" };
  const number = /^#?(\d{1,9})$/.exec(text);
  if (number) return { kind: "number", number: Number(number[1]), exact: text.startsWith("#") };
  const id = /^<@!?(\d{15,25})>$|^(\d{15,25})$/.exec(text);
  if (id) return { kind: "id", id: id[1] ?? id[2] };
  return { kind: "text", text };
}
function likePattern(text) {
  return `%${text.replace(/[\\%_]/g, (c) => `\\${c}`).replace(/,/g, "%")}%`;
}
function caseLogFilters(options) {
  const parts = [];
  const types = caseTypesFor(options.type);
  if (types) parts.push(types.length === 1 ? `type=eq.${types[0]}` : `type=in.(${types.join(",")})`);
  if (options.before && options.before > 0) parts.push(`case_number=lt.${Math.trunc(options.before)}`);
  const search = options.search;
  const alternatives = [];
  if (search.kind === "number") {
    alternatives.push(`case_number.eq.${search.number}`);
    if (!search.exact) alternatives.push(`reason.ilike.${likePattern(String(search.number))}`);
  } else if (search.kind === "id") {
    alternatives.push(`user_id.eq.${search.id}`, `moderator_id.eq.${search.id}`);
  } else if (search.kind === "text") {
    alternatives.push(`reason.ilike.${likePattern(search.text)}`);
    for (const id of [...new Set(options.peopleIds ?? [])].filter((value) => /^\d{15,25}$/.test(value)).slice(0, 20)) {
      alternatives.push(`user_id.eq.${id}`, `moderator_id.eq.${id}`);
    }
  }
  if (alternatives.length) parts.push(`or=${encodeURIComponent(`(${alternatives.join(",")})`)}`);
  return parts.join("&");
}
function caseLogHref(params) {
  const search = new URLSearchParams({ section: "cases" });
  if (params.type) search.set("type", params.type);
  if (params.q) search.set("q", params.q);
  if (params.size && params.size !== 25) search.set("cases", String(params.size));
  if (params.before) search.set("before", String(params.before));
  if (params.edit) search.set("edit", String(params.edit));
  return `?${search.toString()}`;
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashModeration = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashModeration;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const dth = makeT(dashLang, true);
  const { user, guildId, guildName, guildIcon, automod, antinuke, stickyRolesEnabled, cases, activeSanctions = [], modStats = { total: 0, automatic: 0, byType: [], moderators: [], days: [] }, people = {}, casesLimit = 25, caseLog = { type: "", filter: "", q: "", before: null, older: false, failed: false, edit: null }, silentChannels, escalationRules, sanctionTemplates, sanctionMessagesReady, embedTemplateNames, roles, channels, saved, badInvites = [], tooManyInvites = false, caseMessage = null, section, prefix = "!" } = Astro2.props;
  const typeColor = {
    ban: "#fe6465",
    tempban: "#fe6465",
    kick: "#ff9f5a",
    warn: "#fed53c",
    mute: "#c792ea",
    tempmute: "#c792ea",
    unban: "#a5ea7a",
    unmute: "#a5ea7a",
    hardban: "#fe6465",
    softban: "#ff7a7a",
    jail: "#7aa2f7",
    unjail: "#a5ea7a"
  };
  const caseFiltered = Boolean(caseLog.type || caseLog.q || caseLog.before);
  const nextCasesLimit = casesLimit === 25 ? 50 : 100;
  const lastCaseNumber = cases.length ? cases[cases.length - 1].caseNumber : null;
  const editCase = caseMessage?.kind === "err" ? caseMessage.number : caseMessage?.kind === "ok" ? null : caseLog.edit;
  const sectionMeta = { protection: dt("Protection"), "silent-channels": dt("Silent channels"), "warn-escalation": dt("Warn escalation"), "sanction-messages": dt("Sanction messages"), cases: dt("Case log"), active: dt("Active sanctions"), stats: dt("Moderator stats") };
  const selectedSection = sectionMeta[section ?? ""] ? section ?? "" : "protection";
  const selectedTitle = sectionMeta[selectedSection];
  const wordActions = [["warn", dt("Warn"), "ph:warning-fill"], ["mute", dt("Mute"), "ph:speaker-slash-fill"], ["kick", dt("Kick"), "ph:sign-out-fill"], ["delete", dt("Delete the message"), "ph:trash-fill"]];
  const raidActions = [["alert", dt("Alert"), "ph:bell-ringing-fill"], ["kick", dt("Kick"), "ph:sign-out-fill"], ["lockdown", dt("Lockdown"), "ph:lock-fill"]];
  const altActions = [["kick", dt("Kick"), "ph:sign-out-fill"], ["flag", dt("Flag"), "ph:flag-fill"]];
  const protectionsOn = [automod.wordFilterEnabled, automod.antiSpamEnabled, automod.antiRaidEnabled, automod.antiAltEnabled, stickyRolesEnabled].filter(Boolean).length;
  const messageKinds = ["default", "ban", "tempban", "softban", "unban", "kick", "mute", "tempmute", "unmute", "warn", "jail", "unjail"];
  const messageSlots = ["dm", "reply", "log"];
  const showSection = (id) => selectedSection === id ? "" : "md-section-hidden";
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": selectedSection === "protection" ? "moderation" : selectedSection === "stats" ? "mod-stats" : selectedSection === "active" ? "active-sanctions" : selectedSection, "pageTitle": selectedTitle, "data-astro-cid-lxxh75qm": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", " ", "<h1 data-astro-cid-lxxh75qm>", "</h1> ", "", "", "", "", "", "", "", "", "", "<script>\n    // Inside the content, so it also runs when the page is reached from the menu (the dashboard runs the scripts of the content it\n    // draws; a script after the layout only ran on a full load, and then the Lift button and the case search did nothing).\n    // The listeners are on the document and bound once; what depends on the drawn page runs on every draw.\n    (function () {\n      if (!window.__mdCasesBound) {\n        window.__mdCasesBound = true;\n        // Typing filters the cases already on the page at once; Enter (or Search) asks the server, which searches every case.\n        var filterRows = function (input) {\n          var log = input.closest('[data-case-log]');\n          if (!log) return;\n          var q = (input.value || '').trim().toLowerCase();\n          var local = q !== (input.defaultValue || '').trim().toLowerCase();\n          var shown = 0;\n          log.querySelectorAll('[data-case-list] .md-case-row').forEach(function (row) {\n            var ok = !local || !q || (row.getAttribute('data-search') || '').indexOf(q) !== -1;\n            row.hidden = !ok;\n            if (ok) shown += 1;\n          });\n          var none = log.querySelector('[data-case-none]');\n          if (none) none.hidden = shown !== 0;\n          var hint = log.querySelector('[data-case-hint]');\n          if (hint) hint.hidden = !local || !q;\n        };\n        document.addEventListener('input', function (event) {\n          var target = event.target;\n          if (target && target.matches && target.matches('[data-case-search]')) filterRows(target);\n        });\n        document.addEventListener('submit', function (event) {\n          var form = event.target;\n          if (!form || !form.matches || !form.matches('[data-case-tools]') || !window.dglNavigate) return;\n          event.preventDefault();\n          var params = new URLSearchParams(new FormData(form));\n          if (!String(params.get('q') || '').trim()) params.delete('q');\n          window.dglNavigate('?' + params.toString());\n        });\n        // The edit form of a case, put in its row from the template (one form on the page at a time). While it is open the\n        // dashboard does not redraw the page for a live update (data-dash-hold), so what is typed stays.\n        var closeEditor = function (form) {\n          var row = form.closest('.md-case-row');\n          var link = row && row.querySelector('[data-case-edit]');\n          if (link) { link.classList.remove('on'); link.setAttribute('aria-expanded', 'false'); }\n          form.remove();\n        };\n        var openEditor = function (row) {\n          var log = row.closest('[data-case-log]');\n          var template = log && log.querySelector('template[data-case-form-template]');\n          if (!template) return false;\n          log.querySelectorAll('[data-case-list] [data-case-form]').forEach(closeEditor);\n          var number = row.getAttribute('data-case');\n          var form = template.content.firstElementChild.cloneNode(true);\n          form.querySelector('input[name=case]').value = number;\n          var label = form.querySelector('[data-case-label]');\n          label.textContent = label.getAttribute('data-case-label').replace('{n}', number);\n          var area = form.querySelector('textarea');\n          area.defaultValue = row.getAttribute('data-reason') || '';\n          var del = form.querySelector('[data-case-confirm]');\n          del.setAttribute('data-confirm', del.getAttribute('data-case-confirm').replace('{n}', number));\n          row.appendChild(form);\n          var link = row.querySelector('[data-case-edit]');\n          if (link) { link.classList.add('on'); link.setAttribute('aria-expanded', 'true'); }\n          if (window.dglInitContent) window.dglInitContent(row);\n          if (window.__dfxKit) window.__dfxKit();\n          area.focus();\n          area.setSelectionRange(area.value.length, area.value.length);\n          return true;\n        };\n        // Capture: these run before the dashboard's own handling of the links (which would load the page).\n        document.addEventListener('click', function (event) {\n          var target = event.target;\n          if (!target || !target.closest || !target.closest('#dgl-content [data-case-log]')) return;\n          var edit = target.closest('[data-case-edit]');\n          if (edit) {\n            var row = edit.closest('.md-case-row');\n            var open = row && row.querySelector('[data-case-form]');\n            if (open) { event.preventDefault(); event.stopPropagation(); closeEditor(open); return; }\n            if (row && openEditor(row)) { event.preventDefault(); event.stopPropagation(); }\n            return;\n          }\n          var close = target.closest('[data-case-edit-close]');\n          if (close) {\n            var form = close.closest('[data-case-form]');\n            if (form) { event.preventDefault(); event.stopPropagation(); closeEditor(form); }\n            return;\n          }\n          // A kind chosen while words are typed but not searched yet: the words go with it.\n          var pill = target.closest('[data-case-pill]');\n          if (pill) {\n            var input = document.querySelector('#dgl-content [data-case-search]');\n            if (input && input.value !== input.defaultValue) {\n              var url = new URL(pill.getAttribute('href'), window.location.href);\n              if (input.value.trim()) url.searchParams.set('q', input.value.trim()); else url.searchParams.delete('q');\n              pill.setAttribute('href', url.search);\n            }\n          }\n        }, true);\n        document.addEventListener('click', function (event) {\n          var target = event.target;\n          // The Lift button of the active sanctions: the bot lifts it and the page is read again.\n          var btn = target && target.closest ? target.closest('[data-lift]') : null;\n          if (!btn) return;\n          var guild = window.location.pathname.split('/dash/guild/')[1].split('/')[0];\n          var failed = btn.getAttribute('data-lift-error') || 'It could not be lifted.';\n          var say = function (text) { if (window.dglToast) window.dglToast(text, { kind: 'error' }); };\n          btn.disabled = true; btn.classList.add('dgl-busy');\n          fetch('/dash/guild/' + guild + '/moderation-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ case: Number(btn.getAttribute('data-lift')) }) })\n            .then(function (r) { return r.json(); })\n            .then(function (data) {\n              if (data && data.ok) { if (window.dglRefreshPage) window.dglRefreshPage(true); else window.location.reload(); }\n              else { say((data && data.message) || failed); btn.disabled = false; btn.classList.remove('dgl-busy'); }\n            })\n            .catch(function () { say(failed); btn.disabled = false; btn.classList.remove('dgl-busy'); });\n        });\n      }\n      document.querySelectorAll('#dgl-content time[data-local-time]').forEach(function (t) {\n        var d = new Date(t.getAttribute('datetime'));\n        if (!isNaN(d.getTime())) t.textContent = d.toLocaleString();\n      });\n    })();\n  <\/script> "])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-lxxh75qm": true }), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-lxxh75qm": true }), maybeRenderHead(), selectedTitle, saved && renderTemplate`<div class="md-flash" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-lxxh75qm": true })}${dt("Saved.")}</div>`, badInvites.length > 0 && renderTemplate`<div class="md-flash md-flash-warn" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-lxxh75qm": true })}${dt("These invites were not valid and were skipped: {a}", { a: badInvites.join(", ") })}</div>`, tooManyInvites && renderTemplate`<div class="md-flash md-flash-warn" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-lxxh75qm": true })}${dt("Only the first {a} invites were kept.", { a: 50 })}</div>`, selectedSection === "protection" && renderTemplate`<div class="sx-page" data-astro-cid-lxxh75qm> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Protections on"), value: protectionsOn, tone: "joins" },
    { label: dt("Banned words"), value: automod.bannedWords.length, tone: "leaves" },
    { label: dt("Ignored roles"), value: automod.immuneRoleIds.length, tone: "voice" },
    { label: dt("Ignored channels"), value: automod.exemptChannelIds.length, tone: "invites" }
  ], "data-astro-cid-lxxh75qm": true })} <form method="POST" class="sx-stack mp-form" id="mdForm" data-astro-cid-lxxh75qm> <input type="hidden" name="action" value="config" data-astro-cid-lxxh75qm> <section class="sx-panel mp-block" data-astro-cid-lxxh75qm> <div class="sx-panel-head" data-astro-cid-lxxh75qm> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:funnel-fill", "width": "17", "height": "17", "data-astro-cid-lxxh75qm": true })}</span> <h2 data-astro-cid-lxxh75qm>${dt("Word filter")}</h2> <label class="sx-toggle-only" data-astro-cid-lxxh75qm><input type="checkbox" name="word_filter_enabled"${addAttribute(automod.wordFilterEnabled, "checked")}${addAttribute(dt("Word filter"), "aria-label")} data-astro-cid-lxxh75qm><i class="sx-toggle" data-astro-cid-lxxh75qm></i></label> </div> <p class="sx-lead" data-astro-cid-lxxh75qm>${dt("Blocks messages containing banned words or phrases.")}</p> <div class="mp-body" data-sx-needs="word_filter_enabled" data-astro-cid-lxxh75qm> <div class="sx-field" data-astro-cid-lxxh75qm><span class="sx-label" data-astro-cid-lxxh75qm>${dt("Action")}</span> <div class="sx-choices" data-astro-cid-lxxh75qm> ${wordActions.map(([value, label, icon]) => renderTemplate`<label class="sx-choice" data-astro-cid-lxxh75qm><input type="radio" name="word_filter_action"${addAttribute(value, "value")}${addAttribute(automod.wordFilterAction === value, "checked")} data-astro-cid-lxxh75qm><span class="sx-choice-body" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": icon, "width": "17", "height": "17", "data-astro-cid-lxxh75qm": true })}<b data-astro-cid-lxxh75qm>${label}</b></span></label>`)} </div> </div> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-words" data-astro-cid-lxxh75qm>${dt("Banned words")}</label> <textarea id="mp-words" name="banned_words" class="dgl-autogrow" rows="3"${addAttribute(dt("comma, separated, words"), "placeholder")} data-astro-cid-lxxh75qm>${automod.bannedWords.join(", ")}</textarea> <span class="sx-hint" data-astro-cid-lxxh75qm>${dt("Roles and channels the automod never checks are set under Anti-spam.")}</span> </div> </div> </section> <section class="sx-panel mp-block" id="anti-spam" data-astro-cid-lxxh75qm> <div class="sx-panel-head" data-astro-cid-lxxh75qm> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chats-fill", "width": "17", "height": "17", "data-astro-cid-lxxh75qm": true })}</span> <h2 data-astro-cid-lxxh75qm>${dt("Anti-spam")}</h2> <label class="sx-toggle-only" data-astro-cid-lxxh75qm><input type="checkbox" name="anti_spam_enabled"${addAttribute(automod.antiSpamEnabled, "checked")}${addAttribute(dt("Anti-spam"), "aria-label")} data-astro-cid-lxxh75qm><i class="sx-toggle" data-astro-cid-lxxh75qm></i></label> </div> <p class="sx-lead" data-astro-cid-lxxh75qm>${dt("Stops floods of repeated messages, mass mentions, invites and shouting (too many capital letters).")} <a${addAttribute(`/dash/guild/${guildId}/automod`, "href")} data-astro-cid-lxxh75qm>${dt("Discord has its own spam and mention rules too: they are in AutoMod templates.")}</a></p> <div class="mp-subs" data-astro-cid-lxxh75qm> <div class="sx-sub" data-astro-cid-lxxh75qm> <h3 data-astro-cid-lxxh75qm>${dt("Mentions")}</h3> <div class="sx-grid" data-astro-cid-lxxh75qm> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-mentions" data-astro-cid-lxxh75qm>${dt("Max mentions per message")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-mentions", "name": "max_mentions", "value": automod.maxMentions, "min": "1", "max": "50", "data-astro-cid-lxxh75qm": true })}</div> </div> <label class="sx-switch" data-astro-cid-lxxh75qm><input type="checkbox" name="spam_mentions"${addAttribute(automod.spamMentions, "checked")} data-astro-cid-lxxh75qm><span class="sx-switch-text" data-astro-cid-lxxh75qm><b data-astro-cid-lxxh75qm>${dt("Catch mass mentions")}</b></span><i class="sx-toggle" data-astro-cid-lxxh75qm></i></label> </div> <div class="sx-sub" data-astro-cid-lxxh75qm> <h3 data-astro-cid-lxxh75qm>${dt("Repeated messages")}</h3> <label class="sx-switch" data-astro-cid-lxxh75qm><input type="checkbox" name="spam_repeat"${addAttribute(automod.spamRepeat, "checked")} data-astro-cid-lxxh75qm><span class="sx-switch-text" data-astro-cid-lxxh75qm><b data-astro-cid-lxxh75qm>${dt("Catch the same message again and again")}</b></span><i class="sx-toggle" data-astro-cid-lxxh75qm></i></label> <div class="sx-grid" data-sx-needs="spam_repeat" data-astro-cid-lxxh75qm> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-rep" data-astro-cid-lxxh75qm>${dt("Copies that count as a flood")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-rep", "name": "repeat_threshold", "value": automod.repeatThreshold, "min": "2", "max": "20", "data-astro-cid-lxxh75qm": true })}</div> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-repw" data-astro-cid-lxxh75qm>${dt("In how many seconds")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-repw", "name": "repeat_window_seconds", "value": automod.repeatWindow, "min": "3", "max": "120", "data-astro-cid-lxxh75qm": true })}</div> </div> </div> <div class="sx-sub" data-astro-cid-lxxh75qm> <h3 data-astro-cid-lxxh75qm>${dt("Capital letters")}</h3> <label class="sx-switch" data-astro-cid-lxxh75qm><input type="checkbox" name="spam_caps"${addAttribute(automod.spamCaps, "checked")} data-astro-cid-lxxh75qm><span class="sx-switch-text" data-astro-cid-lxxh75qm><b data-astro-cid-lxxh75qm>${dt("Catch shouting (capital letters)")}</b></span><i class="sx-toggle" data-astro-cid-lxxh75qm></i></label> <div class="sx-grid" data-sx-needs="spam_caps" data-astro-cid-lxxh75qm> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-caps" data-astro-cid-lxxh75qm>${dt("Percent in capitals")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-caps", "name": "caps_percent", "value": automod.capsPercent, "min": "30", "max": "100", "data-astro-cid-lxxh75qm": true })}</div> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-capsm" data-astro-cid-lxxh75qm>${dt("Shortest message checked")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-capsm", "name": "caps_min_length", "value": automod.capsMinLength, "min": "4", "max": "200", "data-astro-cid-lxxh75qm": true })}</div> </div> </div> <div class="sx-sub" data-astro-cid-lxxh75qm> <h3 data-astro-cid-lxxh75qm>${dt("Long messages")}</h3> <div class="sx-grid" data-astro-cid-lxxh75qm> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-len" data-astro-cid-lxxh75qm>${dt("Delete messages longer than (characters)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-len", "name": "max_message_length", "value": automod.maxMessageLength, "min": "0", "max": "2000", "data-astro-cid-lxxh75qm": true })}</div> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-lines" data-astro-cid-lxxh75qm>${dt("Delete messages with more lines than")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-lines", "name": "max_lines", "value": automod.maxLines, "min": "0", "max": "100", "data-astro-cid-lxxh75qm": true })}</div> </div> <span class="sx-hint" data-astro-cid-lxxh75qm>${dt("0 turns a limit off. Long messages are only deleted, nobody is punished for them.")}</span> </div> <div class="sx-sub mp-wide" data-astro-cid-lxxh75qm> <h3 data-astro-cid-lxxh75qm>${dt("Invites")}</h3> <label class="sx-switch" data-astro-cid-lxxh75qm><input type="checkbox" name="spam_invites"${addAttribute(automod.spamInvites, "checked")} data-astro-cid-lxxh75qm><span class="sx-switch-text" data-astro-cid-lxxh75qm><b data-astro-cid-lxxh75qm>${dt("Catch invites that are not on the allow-list")}</b></span><i class="sx-toggle" data-astro-cid-lxxh75qm></i></label> <div class="sx-field" data-sx-needs="spam_invites" data-astro-cid-lxxh75qm><label for="md-allowed-invites" data-astro-cid-lxxh75qm>${dt("Allowed invites")}</label> <textarea id="md-allowed-invites" name="allowed_invite_codes" class="dgl-autogrow sx-mono" rows="3"${addAttribute(dt("discord.gg/petto, one per line"), "placeholder")} data-astro-cid-lxxh75qm>${automod.allowedInviteCodes.join("\n")}</textarea> <span class="sx-hint" data-astro-cid-lxxh75qm>${dt("Discord invites that members may post. Paste the full link or only the code. Other web links are filtered in the AutoMod filters page.")} <a${addAttribute(`/dash/guild/${guildId}/automod`, "href")} data-astro-cid-lxxh75qm>${dt("Open the AutoMod filters")}</a> ${dt("The web domains that the All links filter lets through are set there too.")}</span> </div> </div> <div class="sx-sub mp-wide" data-astro-cid-lxxh75qm> <h3 data-astro-cid-lxxh75qm>${dt("Exceptions")}</h3> <div class="sx-field" data-astro-cid-lxxh75qm><span class="sx-label" data-astro-cid-lxxh75qm>${dt("Ignored roles")}</span> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "immune_role_ids", "options": roles, "selected": automod.immuneRoleIds, "placeholder": dt("Search roles..."), "data-astro-cid-lxxh75qm": true })} <span class="sx-hint" data-astro-cid-lxxh75qm>${dt("Members with these roles are never checked by the word filter, anti-spam or the Petto filters.")}</span> </div> <div class="sx-field" data-astro-cid-lxxh75qm><span class="sx-label" data-astro-cid-lxxh75qm>${dt("Ignored channels")}</span> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "exempt_channel_ids", "options": channels, "selected": automod.exemptChannelIds, "placeholder": dt("Search channels..."), "data-astro-cid-lxxh75qm": true })} <span class="sx-hint" data-astro-cid-lxxh75qm>${dt("Nothing is checked in these channels.")}</span> </div> </div> </div> </section> <section class="sx-panel mp-block" id="strikes" data-astro-cid-lxxh75qm> <div class="sx-panel-head" data-astro-cid-lxxh75qm> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17", "data-astro-cid-lxxh75qm": true })}</span> <h2 data-astro-cid-lxxh75qm>${dt("Strikes")}</h2> </div> <p class="sx-lead" data-astro-cid-lxxh75qm>${dt("Mutes a member who breaks the automod again and again (for example, with several messages in a row), on top of what each rule does.")}</p> <div class="sx-grid sx-grid-3" data-astro-cid-lxxh75qm> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-sl" data-astro-cid-lxxh75qm>${dt("Violations that trigger the mute (0 for off)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-sl", "name": "strike_limit", "value": automod.strikeLimit, "min": "0", "max": "20", "data-astro-cid-lxxh75qm": true })}</div> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-sw" data-astro-cid-lxxh75qm>${dt("In how many minutes")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-sw", "name": "strike_window_minutes", "value": automod.strikeWindow, "min": "1", "max": "1440", "data-astro-cid-lxxh75qm": true })}</div> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-sm" data-astro-cid-lxxh75qm>${dt("Minutes of mute")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-sm", "name": "strike_mute_minutes", "value": automod.strikeMute, "min": "1", "max": "40320", "data-astro-cid-lxxh75qm": true })}</div> </div> </section> <div class="sx-duo" data-astro-cid-lxxh75qm> <section class="sx-panel mp-block" data-astro-cid-lxxh75qm> <div class="sx-panel-head" data-astro-cid-lxxh75qm> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "17", "height": "17", "data-astro-cid-lxxh75qm": true })}</span> <h2 data-astro-cid-lxxh75qm>${dt("Anti-raid")}</h2> <label class="sx-toggle-only" data-astro-cid-lxxh75qm><input type="checkbox" name="anti_raid_enabled"${addAttribute(automod.antiRaidEnabled, "checked")}${addAttribute(dt("Anti-raid"), "aria-label")} data-astro-cid-lxxh75qm><i class="sx-toggle" data-astro-cid-lxxh75qm></i></label> </div> <p class="sx-lead" data-astro-cid-lxxh75qm>${dt("Reacts when too many members join in a short burst.")}</p> <div class="mp-body" data-sx-needs="anti_raid_enabled" data-astro-cid-lxxh75qm> <div class="sx-grid" data-astro-cid-lxxh75qm> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-rj" data-astro-cid-lxxh75qm>${dt("Join threshold")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-rj", "name": "raid_join_threshold", "value": automod.raidJoinThreshold, "min": "2", "max": "50", "data-astro-cid-lxxh75qm": true })}</div> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-rw" data-astro-cid-lxxh75qm>${dt("Window (seconds)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-rw", "name": "raid_window_seconds", "value": automod.raidWindowSeconds, "min": "5", "max": "120", "data-astro-cid-lxxh75qm": true })}</div> </div> <div class="sx-field" data-astro-cid-lxxh75qm><span class="sx-label" data-astro-cid-lxxh75qm>${dt("Action")}</span> <div class="sx-choices mp-choices-sm" data-astro-cid-lxxh75qm> ${raidActions.map(([value, label, icon]) => renderTemplate`<label class="sx-choice" data-astro-cid-lxxh75qm><input type="radio" name="raid_action"${addAttribute(value, "value")}${addAttribute(automod.raidAction === value, "checked")} data-astro-cid-lxxh75qm><span class="sx-choice-body" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": icon, "width": "17", "height": "17", "data-astro-cid-lxxh75qm": true })}<b data-astro-cid-lxxh75qm>${label}</b></span></label>`)} </div> </div> </div> </section> <section class="sx-panel mp-block" data-astro-cid-lxxh75qm> <div class="sx-panel-head" data-astro-cid-lxxh75qm> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:identification-badge-fill", "width": "17", "height": "17", "data-astro-cid-lxxh75qm": true })}</span> <h2 data-astro-cid-lxxh75qm>${dt("Anti-alt")}</h2> <label class="sx-toggle-only" data-astro-cid-lxxh75qm><input type="checkbox" name="anti_alt_enabled"${addAttribute(automod.antiAltEnabled, "checked")}${addAttribute(dt("Anti-alt"), "aria-label")} data-astro-cid-lxxh75qm><i class="sx-toggle" data-astro-cid-lxxh75qm></i></label> </div> <p class="sx-lead" data-astro-cid-lxxh75qm>${dt("Flags accounts newer than a minimum age on join.")}</p> <div class="mp-body" data-sx-needs="anti_alt_enabled" data-astro-cid-lxxh75qm> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mp-aa" data-astro-cid-lxxh75qm>${dt("Minimum account age (days)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mp-aa", "name": "anti_alt_min_age_days", "value": automod.antiAltMinAgeDays, "min": "0", "max": "365", "data-astro-cid-lxxh75qm": true })}</div> <div class="sx-field" data-astro-cid-lxxh75qm><span class="sx-label" data-astro-cid-lxxh75qm>${dt("Action")}</span> <div class="sx-choices mp-choices-sm" data-astro-cid-lxxh75qm> ${altActions.map(([value, label, icon]) => renderTemplate`<label class="sx-choice" data-astro-cid-lxxh75qm><input type="radio" name="anti_alt_action"${addAttribute(value, "value")}${addAttribute(automod.antiAltAction === value, "checked")} data-astro-cid-lxxh75qm><span class="sx-choice-body" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": icon, "width": "17", "height": "17", "data-astro-cid-lxxh75qm": true })}<b data-astro-cid-lxxh75qm>${label}</b></span></label>`)} </div> </div> </div> </section> </div> <label class="sx-switch" data-astro-cid-lxxh75qm><input type="checkbox" name="sticky_roles_enabled"${addAttribute(stickyRolesEnabled, "checked")} data-astro-cid-lxxh75qm><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:link-fill", "width": "17", "height": "17", "data-astro-cid-lxxh75qm": true })}</span><span class="sx-switch-text" data-astro-cid-lxxh75qm><b data-astro-cid-lxxh75qm>${dt("Sticky roles")}</b><em data-astro-cid-lxxh75qm>${dt("If a member leaves and rejoins within 90 days, their roles (except managed ones, e.g. booster/bot roles) are automatically restored.")}</em></span><i class="sx-toggle" data-astro-cid-lxxh75qm></i></label> <div class="sx-foot mp-foot" data-astro-cid-lxxh75qm><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-lxxh75qm>${dt("Save changes")}</button></div> </form> <h2 class="mp-related-title" data-astro-cid-lxxh75qm>${dt("More protection")}</h2> <div class="mp-links dgl-stagger" data-astro-cid-lxxh75qm> <a class="mp-link"${addAttribute(`/dash/guild/${guildId}/antinuke`, "href")} data-astro-cid-lxxh75qm> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:siren-fill", "width": "17", "height": "17", "data-astro-cid-lxxh75qm": true })}</span> <span class="mp-link-text" data-astro-cid-lxxh75qm><b data-astro-cid-lxxh75qm>${dt("Anti-raid & nuke")}</b><em data-astro-cid-lxxh75qm>${dt("Each protection (bans, channels, roles, bots, webhooks...) now has its own page with its own limit, action, trusted accounts and a log to restore what was stopped.")}</em></span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "class": "mp-link-go", "width": "14", "height": "14", "data-astro-cid-lxxh75qm": true })} </a> <a class="mp-link"${addAttribute(`/dash/guild/${guildId}/antiscam`, "href")} data-astro-cid-lxxh75qm> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-warning-fill", "width": "17", "height": "17", "data-astro-cid-lxxh75qm": true })}</span> <span class="mp-link-text" data-astro-cid-lxxh75qm><b data-astro-cid-lxxh75qm>${dt("Anti scam")}</b><em data-astro-cid-lxxh75qm>${dt("Catches hijacked accounts that spam the MrBeast giveaway scam, fake withdrawals and casino promos.")}</em></span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "class": "mp-link-go", "width": "14", "height": "14", "data-astro-cid-lxxh75qm": true })} </a> <a class="mp-link"${addAttribute(`/dash/guild/${guildId}/automod`, "href")} data-astro-cid-lxxh75qm> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:funnel-fill", "width": "17", "height": "17", "data-astro-cid-lxxh75qm": true })}</span> <span class="mp-link-text" data-astro-cid-lxxh75qm><b data-astro-cid-lxxh75qm>${dt("AutoMod templates")}</b><em data-astro-cid-lxxh75qm>${dt("Ready filters for links, invites, emojis, zalgo, scams and more, in Discord AutoMod or in Petto, with packs.")}</em></span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "class": "mp-link-go", "width": "14", "height": "14", "data-astro-cid-lxxh75qm": true })} </a> </div> </div>`, selectedSection === "silent-channels" && renderTemplate`<div${addAttribute(["mdx-page", showSection("silent-channels")], "class:list")} data-astro-cid-lxxh75qm> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Silent channels"), value: silentChannels.length, tone: "invites" },
    { label: dt("Warn"), value: silentChannels.filter((s) => s.action === "warn").length, tone: "reactions" },
    { label: dt("Mute"), value: silentChannels.filter((s) => s.action === "mute").length, tone: "voice" },
    { label: dt("Kick"), value: silentChannels.filter((s) => s.action === "kick").length, tone: "messages" }
  ], "data-astro-cid-lxxh75qm": true })} <div class="mdx-head" data-astro-cid-lxxh75qm> <h2 data-astro-cid-lxxh75qm>${dt("Silent channels")} <span class="mdx-count" data-astro-cid-lxxh75qm>${silentChannels.length}</span></h2> <p data-astro-cid-lxxh75qm>${dt("Any message here counts as a violation, independent of the word filter or anti-spam toggles.")}</p> </div> ${silentChannels.length === 0 && renderTemplate`<p class="mdx-empty" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:speaker-slash-fill", "width": "18", "height": "18", "data-astro-cid-lxxh75qm": true })}${dt("No silent channels yet. Add one below.")}</p>`} <div class="mdx-list dgl-stagger" data-astro-cid-lxxh75qm> ${silentChannels.map((s) => renderTemplate`<form method="POST" class="mdx-item md-list-row" data-no-dirty data-astro-cid-lxxh75qm> <input type="hidden" name="action" value="delete_silent_channel" data-astro-cid-lxxh75qm> <input type="hidden" name="channel_id"${addAttribute(s.channelId, "value")} data-astro-cid-lxxh75qm> <span class="mdx-icon" style="--c:var(--blue)" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:speaker-slash-fill", "width": "16", "height": "16", "data-astro-cid-lxxh75qm": true })}</span> <span class="mdx-item-main" data-astro-cid-lxxh75qm><b data-astro-cid-lxxh75qm>#${s.name}</b></span> <span class="mdx-pill"${addAttribute(`--c:${typeColor[s.action] ?? "#94a3b8"}`, "style")} data-astro-cid-lxxh75qm>${s.action}</span> <button type="submit" class="mdx-del"${addAttribute(dt("Remove"), "aria-label")}${addAttribute(dt("Remove"), "title")} data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-lxxh75qm": true })}</button> </form>`)} </div> <form method="POST" class="mdx-add" data-no-dirty data-astro-cid-lxxh75qm> <input type="hidden" name="action" value="add_silent_channel" data-astro-cid-lxxh75qm> <div class="mdx-add-title" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-lxxh75qm": true })}${dt("Add")}</div> <div class="sx-grid" data-astro-cid-lxxh75qm> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mdx-silent-channel" data-astro-cid-lxxh75qm>${dt("Channel")}</label> <select id="mdx-silent-channel" name="channel_id" required data-astro-cid-lxxh75qm> <option value="" disabled selected data-astro-cid-lxxh75qm>${dt("Channel")}</option> ${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-lxxh75qm>#${c.name}</option>`)} </select> </div> <div class="sx-field" data-astro-cid-lxxh75qm> <span class="sx-label" id="mdx-silent-action" data-astro-cid-lxxh75qm>${dt("Action")}</span> <div class="dfx-chips" role="radiogroup" aria-labelledby="mdx-silent-action" data-astro-cid-lxxh75qm> ${["warn", "mute", "kick"].map((act, i) => renderTemplate`<label class="dfx-chip" data-astro-cid-lxxh75qm><input type="radio" name="silent_action"${addAttribute(act, "value")}${addAttribute(i === 0, "checked")} data-astro-cid-lxxh75qm><i class="mdx-dot"${addAttribute(`--c:${typeColor[act]}`, "style")} data-astro-cid-lxxh75qm></i>${act}</label>`)} </div> </div> </div> <div class="mdx-foot" data-astro-cid-lxxh75qm><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-lxxh75qm": true })}${dt("Add")}</button></div> </form> </div>`, selectedSection === "warn-escalation" && renderTemplate`<div${addAttribute(["mdx-page", showSection("warn-escalation")], "class:list")} data-astro-cid-lxxh75qm> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Steps"), value: escalationRules.length, tone: "invites" },
    { label: dt("First step"), value: escalationRules[0]?.warnCount ?? 0, text: escalationRules.length ? dt("Warn #{a}", { a: escalationRules[0].warnCount }) : "-", tone: "reactions" },
    { label: dt("Last step"), value: escalationRules[escalationRules.length - 1]?.warnCount ?? 0, text: escalationRules.length ? dt("Warn #{a}", { a: escalationRules[escalationRules.length - 1].warnCount }) : "-", tone: "leaves" }
  ], "data-astro-cid-lxxh75qm": true })} <div class="mdx-head" data-astro-cid-lxxh75qm> <h2 data-astro-cid-lxxh75qm>${dt("Warn escalation")} <span class="mdx-count" data-astro-cid-lxxh75qm>${escalationRules.length}</span></h2> <p data-astro-cid-lxxh75qm>${dt("At warning #N, automatically take an action, checked against the member's live active-warn count.")}</p> </div> ${escalationRules.length === 0 && renderTemplate`<p class="mdx-empty" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "18", "height": "18", "data-astro-cid-lxxh75qm": true })}${dt("No steps yet. Add the first one below.")}</p>`} <div class="mdx-ladder dgl-stagger" data-astro-cid-lxxh75qm> ${escalationRules.map((r) => renderTemplate`<form method="POST" class="mdx-item mdx-step md-list-row" data-no-dirty data-astro-cid-lxxh75qm> <input type="hidden" name="action" value="delete_escalation" data-astro-cid-lxxh75qm> <input type="hidden" name="warn_count"${addAttribute(r.warnCount, "value")} data-astro-cid-lxxh75qm> <span class="mdx-badge"${addAttribute(`--c:${typeColor[r.action] ?? "#94a3b8"}`, "style")} aria-hidden="true" data-astro-cid-lxxh75qm>${r.warnCount}</span> <span class="mdx-item-main" data-astro-cid-lxxh75qm><b data-astro-cid-lxxh75qm>${dt("Warn #{a}", { a: r.warnCount })}</b></span> <span class="mdx-pill"${addAttribute(`--c:${typeColor[r.action] ?? "#94a3b8"}`, "style")} data-astro-cid-lxxh75qm>${r.action}${r.durationMinutes ? ` \xB7 ${formatDuration(r.durationMinutes * 60)}` : ""}</span> <button type="submit" class="mdx-del"${addAttribute(dt("Remove"), "aria-label")}${addAttribute(dt("Remove"), "title")} data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-lxxh75qm": true })}</button> </form>`)} </div> <form method="POST" class="mdx-add" data-no-dirty data-astro-cid-lxxh75qm> <input type="hidden" name="action" value="add_escalation" data-astro-cid-lxxh75qm> <div class="mdx-add-title" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "16", "height": "16", "data-astro-cid-lxxh75qm": true })}${dt("Add")}</div> <div class="sx-grid" data-astro-cid-lxxh75qm> <div class="sx-field" data-astro-cid-lxxh75qm><label for="mdx-warn-count" data-astro-cid-lxxh75qm>${dt("Warn #")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mdx-warn-count", "name": "warn_count", "value": Math.min(50, (escalationRules[escalationRules.length - 1]?.warnCount ?? 2) + 1), "min": "1", "max": "50", "required": true, "data-astro-cid-lxxh75qm": true })}</div> <div class="sx-field" data-astro-cid-lxxh75qm> <span class="sx-label" id="mdx-esc-action" data-astro-cid-lxxh75qm>${dt("Action")}</span> <div class="dfx-chips" role="radiogroup" aria-labelledby="mdx-esc-action" data-astro-cid-lxxh75qm> ${["mute", "tempmute", "kick", "ban"].map((act, i) => renderTemplate`<label class="dfx-chip" data-astro-cid-lxxh75qm><input type="radio" name="esc_action"${addAttribute(act, "value")}${addAttribute(i === 0, "checked")} data-astro-cid-lxxh75qm><i class="mdx-dot"${addAttribute(`--c:${typeColor[act]}`, "style")} data-astro-cid-lxxh75qm></i>${act}</label>`)} </div> </div> <div class="sx-field" data-sx-needs="esc_action=tempmute" data-astro-cid-lxxh75qm><label for="mdx-esc-minutes" data-astro-cid-lxxh75qm>${dt("Minutes (temp only)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "mdx-esc-minutes", "name": "duration_minutes", "value": "0", "min": "0", "data-astro-cid-lxxh75qm": true })}</div> </div> <div class="mdx-foot" data-astro-cid-lxxh75qm><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-lxxh75qm": true })}${dt("Add")}</button></div> </form> </div>`, selectedSection === "sanction-messages" && renderTemplate`<div${addAttribute(["mdx-page", showSection("sanction-messages")], "class:list")} data-astro-cid-lxxh75qm> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Saved designs"), value: embedTemplateNames.length, tone: "invites" },
    { label: dt("Kinds with a design"), value: messageKinds.filter((type) => messageSlots.some((slot) => sanctionTemplates[type]?.[slot])).length, tone: "joins" },
    { label: dt("Messages with a design"), value: messageKinds.reduce((sum, type) => sum + messageSlots.filter((slot) => sanctionTemplates[type]?.[slot]).length, 0), tone: "messages" }
  ], "data-astro-cid-lxxh75qm": true })} <div class="mdx-head" data-astro-cid-lxxh75qm> <h2 data-astro-cid-lxxh75qm>${dt("Sanction messages")}</h2> <p data-astro-cid-lxxh75qm>${dt("Use a saved design from the Embeds page for what a member receives, what is posted where the command was used, and the log entry. A type without its own design uses the Default row. Variables start with {case.\u2026}, for example {case.reason} and {case.moderator}.")}</p> </div> ${!sanctionMessagesReady && renderTemplate`<p class="mdx-empty" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hourglass-medium-fill", "width": "18", "height": "18", "data-astro-cid-lxxh75qm": true })}${dt("This arrives with the next Petto update.")}</p>`} ${sanctionMessagesReady && renderTemplate`<form method="POST" class="md-msg-form mdx-msgs" data-astro-cid-lxxh75qm> <input type="hidden" name="action" value="save_sanction_messages" data-astro-cid-lxxh75qm> <div class="mdx-accs" data-astro-cid-lxxh75qm> ${messageKinds.map((type) => {
    const used = messageSlots.filter((slot) => sanctionTemplates[type]?.[slot]).length;
    return renderTemplate`<details class="dfx-acc mdx-acc"${addAttribute(type === "default" || used > 0, "open")}${addAttribute(`--c:${typeColor[type] ?? "var(--accent)"}`, "style")} data-astro-cid-lxxh75qm> <summary data-astro-cid-lxxh75qm> <span class="mdx-kind" data-astro-cid-lxxh75qm>${type === "default" ? dt("Default") : type}</span> <span class="dfx-acc-title" data-astro-cid-lxxh75qm><em data-astro-cid-lxxh75qm>${used > 0 ? dt("{a} of 3 with a design", { a: used }) : type === "default" ? dt("Usual messages") : dt("Same as default")}</em></span> ${used > 0 && renderTemplate`<i class="mdx-changed"${addAttribute(dt("Changed"), "title")} data-astro-cid-lxxh75qm></i>`} ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14", "data-astro-cid-lxxh75qm": true })} </summary> <div class="dfx-acc-body" data-astro-cid-lxxh75qm> <div class="sx-grid sx-grid-3" data-astro-cid-lxxh75qm> ${messageSlots.map((slot) => renderTemplate`<div class="sx-field" data-astro-cid-lxxh75qm> <label${addAttribute(`mdx-${type}-${slot}`, "for")} data-astro-cid-lxxh75qm>${slot === "dm" ? dt("DM to the member") : slot === "reply" ? dt("Reply in the channel") : dt("Sanctions log")}</label> <select${addAttribute(`mdx-${type}-${slot}`, "id")}${addAttribute(`${type}__${slot}`, "name")}${addAttribute(`${type} ${slot}`, "aria-label")} data-astro-cid-lxxh75qm> <option value=""${addAttribute(!sanctionTemplates[type]?.[slot], "selected")} data-astro-cid-lxxh75qm>${type === "default" ? dt("Usual message") : dt("Same as default")}</option> ${embedTemplateNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === sanctionTemplates[type]?.[slot], "selected")} data-astro-cid-lxxh75qm>${name}</option>`)} </select> </div>`)} </div> </div> </details>`;
  })} </div> <div class="mdx-foot" data-astro-cid-lxxh75qm><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-lxxh75qm>${dt("Save changes")}</button></div> </form>`} </div>`, selectedSection === "active" && renderTemplate`<div${addAttribute(["mdx-page", showSection("active")], "class:list")} data-astro-cid-lxxh75qm> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Active sanctions"), value: activeSanctions.length, tone: "invites" },
    { label: dt("Ban"), value: activeSanctions.filter((c) => ["ban", "tempban", "hardban"].includes(c.type)).length, tone: "leaves" },
    { label: dt("Mute"), value: activeSanctions.filter((c) => ["mute", "tempmute"].includes(c.type)).length, tone: "voice" },
    { label: dt("Jail"), value: activeSanctions.filter((c) => c.type === "jail").length, tone: "messages" }
  ], "data-astro-cid-lxxh75qm": true })} <div class="mdx-head" data-astro-cid-lxxh75qm> <h2 data-astro-cid-lxxh75qm>${dt("Active sanctions")} <span class="mdx-count" data-astro-cid-lxxh75qm>${activeSanctions.length}</span></h2> </div> ${activeSanctions.length === 0 ? renderTemplate`<p class="mdx-empty" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "18", "height": "18", "data-astro-cid-lxxh75qm": true })}${dt("Nothing is active right now.")}</p>` : renderTemplate`<div class="mdx-sanctions dgl-stagger" data-astro-cid-lxxh75qm> ${activeSanctions.map((c) => {
    const left = c.expiresAt ? Math.min(1, Math.max(0, (new Date(c.expiresAt).getTime() - Date.now()) / Math.max(1, new Date(c.expiresAt).getTime() - new Date(c.createdAt).getTime()))) : null;
    return renderTemplate`<div class="mdx-sanction"${addAttribute(`--c:${typeColor[c.type] ?? "#94a3b8"}`, "style")} data-astro-cid-lxxh75qm> <div class="mdx-sanction-top" data-astro-cid-lxxh75qm> <span class="mdx-case-num" data-astro-cid-lxxh75qm>#${c.caseNumber}</span> <span class="mdx-pill" data-astro-cid-lxxh75qm>${c.type}</span> ${c.type === "hardban" ? renderTemplate`<span class="md-case-inactive" data-astro-cid-lxxh75qm>${dt("Only the owner can lift it")}</span>` : renderTemplate`<button type="button" class="btn btn-ghost btn-sm md-lift"${addAttribute(c.caseNumber, "data-lift")}${addAttribute(dt("Lift this sanction now?"), "data-confirm")}${addAttribute(dt("It could not be lifted."), "data-lift-error")} data-astro-cid-lxxh75qm>${dt("Lift")}</button>`} </div> <div class="mdx-person" data-astro-cid-lxxh75qm> ${people[c.userId] ? renderTemplate`<img${addAttribute(people[c.userId].avatar, "src")} alt="" width="36" height="36" loading="lazy" data-astro-cid-lxxh75qm>` : renderTemplate`<span class="mdx-av" aria-hidden="true" data-astro-cid-lxxh75qm></span>`} <span data-astro-cid-lxxh75qm><b data-astro-cid-lxxh75qm>${people[c.userId]?.name ?? c.userId}</b><code data-astro-cid-lxxh75qm>${c.userId}</code></span> </div> ${c.reason && renderTemplate`<p class="mdx-reason" data-astro-cid-lxxh75qm>${c.reason}</p>`} <div class="mdx-sanction-foot" data-astro-cid-lxxh75qm> <span class="mdx-by" data-astro-cid-lxxh75qm>${dt("by")} ${people[c.moderatorId]?.name ?? c.moderatorId}</span> ${c.expiresAt ? renderTemplate`<time class="mdx-when"${addAttribute(c.expiresAt, "datetime")} data-local-time data-astro-cid-lxxh75qm>${c.expiresAt}</time>` : renderTemplate`<span class="mdx-when" data-astro-cid-lxxh75qm>${dt("No end")}</span>`} </div> ${left !== null && renderTemplate`<div class="mdx-left" role="img"${addAttribute(dt("Time left"), "aria-label")} data-astro-cid-lxxh75qm><i${addAttribute(`width:${Math.round(left * 100)}%`, "style")} data-astro-cid-lxxh75qm></i></div>`} </div>`;
  })} </div>`} </div>`, selectedSection === "stats" && renderTemplate`<div${addAttribute(["mdx-page", showSection("stats")], "class:list")} data-astro-cid-lxxh75qm> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Cases"), value: modStats.total, tone: "invites" },
    { label: dt("By moderators"), value: modStats.total - modStats.automatic, tone: "joins" },
    { label: dt("By the bot (automatic)"), value: modStats.automatic, tone: "voice" }
  ], "data-astro-cid-lxxh75qm": true })} <div class="mdx-head" data-astro-cid-lxxh75qm> <h2 data-astro-cid-lxxh75qm>${dt("Moderator stats")} <span class="mdx-count" data-astro-cid-lxxh75qm>${dt("last 30 days")}</span></h2> </div> <div class="mdx-panel mdx-chart-panel" data-astro-cid-lxxh75qm> <div class="mdx-panel-title" data-astro-cid-lxxh75qm>${dt("Cases in the last 14 days")}</div> <div class="mdx-chart md-bars"${addAttribute(dt("Cases in the last 14 days"), "aria-label")} data-astro-cid-lxxh75qm> ${modStats.days.map((d, i) => {
    const top = Math.max(1, ...modStats.days.map((x) => x.count));
    return renderTemplate`<div${addAttribute(["md-bar", { "mdx-bar-top": d.count > 0 && d.count === top }], "class:list")}${addAttribute(`--i:${i}`, "style")}${addAttribute(`${d.label}: ${d.count}`, "title")} data-astro-cid-lxxh75qm> <em data-astro-cid-lxxh75qm>${d.count || ""}</em> <i${addAttribute(`height:${Math.max(4, d.count / top * 100)}%`, "style")} data-astro-cid-lxxh75qm></i> <span data-astro-cid-lxxh75qm>${d.label.slice(3)}</span> </div>`;
  })} </div> </div> <div class="mdx-cols" data-astro-cid-lxxh75qm> <div class="mdx-panel" data-astro-cid-lxxh75qm> <div class="mdx-panel-title" data-astro-cid-lxxh75qm>${dt("By kind")}</div> ${modStats.byType.length === 0 ? renderTemplate`<p class="mdx-empty-line" data-astro-cid-lxxh75qm>${dt("Nothing yet.")}</p>` : modStats.byType.map(([type, count], i) => renderTemplate`<div class="mdx-stat-row"${addAttribute(`--c:${typeColor[type] ?? "#94a3b8"};--i:${Math.min(i, 9)}`, "style")} data-astro-cid-lxxh75qm> <span class="mdx-pill" data-astro-cid-lxxh75qm>${type}</span> <span class="mdx-track" data-astro-cid-lxxh75qm><i${addAttribute(`width:${Math.round(count / Math.max(1, modStats.byType[0][1]) * 100)}%`, "style")} data-astro-cid-lxxh75qm></i></span> <b data-astro-cid-lxxh75qm>${count}</b> </div>`)} </div> <div class="mdx-panel" data-astro-cid-lxxh75qm> <div class="mdx-panel-title" data-astro-cid-lxxh75qm>${dt("Moderators")}</div> ${modStats.moderators.length === 0 ? renderTemplate`<p class="mdx-empty-line" data-astro-cid-lxxh75qm>${dt("Nothing yet.")}</p>` : modStats.moderators.map((m, i) => renderTemplate`<div class="mdx-stat-row"${addAttribute(`--c:var(--accent);--i:${Math.min(i, 9)}`, "style")} data-astro-cid-lxxh75qm> <span class="mdx-mod" data-astro-cid-lxxh75qm>${i < 3 ? renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:medal-fill", "width": "18", "height": "18", "class": `mdx-medal mdx-medal-${i + 1}`, "data-astro-cid-lxxh75qm": true })}` : renderTemplate`<span class="mdx-rank" data-astro-cid-lxxh75qm>${i + 1}</span>`}${people[m.userId] ? renderTemplate`<img${addAttribute(people[m.userId].avatar, "src")} alt="" width="24" height="24" loading="lazy" data-astro-cid-lxxh75qm>` : null}<b data-astro-cid-lxxh75qm>${people[m.userId]?.name ?? m.userId}</b></span> <span class="mdx-track" data-astro-cid-lxxh75qm><i${addAttribute(`width:${Math.round(m.count / Math.max(1, modStats.moderators[0].count) * 100)}%`, "style")} data-astro-cid-lxxh75qm></i></span> <b data-astro-cid-lxxh75qm>${m.count}</b> </div>`)} </div> </div> </div>`, selectedSection === "cases" && renderTemplate`<div${addAttribute(["mdx-page", showSection("cases")], "class:list")} data-case-log data-astro-cid-lxxh75qm> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Cases shown"), value: cases.length, tone: "invites" },
    { label: dt("Still active"), value: cases.filter((c) => c.active).length, tone: "joins" },
    { label: dt("With proof"), value: cases.filter((c) => (c.evidence ?? []).length > 0).length, tone: "reactions" }
  ], "data-astro-cid-lxxh75qm": true })} <div class="mdx-head" data-astro-cid-lxxh75qm><h2 data-astro-cid-lxxh75qm>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(caseFiltered ? dth('Cases found <span class="md-count">{a}</span>', { a: cases.length + (caseLog.older ? "+" : "") }) : dth('Recent cases <span class="md-count">{a}</span>', { a: cases.length + (caseLog.older ? "+" : "") }))}` })}</h2></div> ${caseMessage && renderTemplate`<div${addAttribute(["md-case-flash", { "md-case-flash-err": caseMessage.kind === "err" }], "class:list")}${addAttribute(caseMessage.kind === "err" ? "alert" : "status", "role")} data-astro-cid-lxxh75qm>${caseMessage.text}</div>`} ${cases.length === 0 && !caseFiltered && !caseLog.failed ? renderTemplate`<div class="md-case-empty" data-astro-cid-lxxh75qm> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clipboard-text-fill", "width": "22", "height": "22", "data-astro-cid-lxxh75qm": true })} <div data-astro-cid-lxxh75qm> <p class="md-empty-note" data-astro-cid-lxxh75qm>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("No cases yet. They show up here the moment a mod uses <code>{p}ban</code>, <code>{p}kick</code>, <code>{p}mute</code> or <code>{p}warn</code>.", { p: prefix }))}` })}</p> <p class="md-case-empty-more" data-astro-cid-lxxh75qm>${dt("Each case gets a number. Here you can search them, fix the reason of one or delete one that was a mistake; the change is written to the sanctions log.")}</p> </div> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-lxxh75qm": true }, { "default": ($$result3) => renderTemplate`<form method="GET" class="md-case-tools" data-case-tools data-no-dirty role="search" data-astro-cid-lxxh75qm> <input type="hidden" name="section" value="cases" data-astro-cid-lxxh75qm> ${caseLog.type && renderTemplate`<input type="hidden" name="type"${addAttribute(caseLog.type, "value")} data-astro-cid-lxxh75qm>`} ${casesLimit !== 25 && renderTemplate`<input type="hidden" name="cases"${addAttribute(casesLimit, "value")} data-astro-cid-lxxh75qm>`} <div class="md-case-search-row" data-astro-cid-lxxh75qm> <input type="search" name="q"${addAttribute(caseLog.q, "value")} maxlength="100" class="md-case-search"${addAttribute(dt("Search by member, moderator, reason or case number"), "placeholder")}${addAttribute(dt("Search cases"), "aria-label")} autocomplete="off" data-case-search data-dash-hold data-astro-cid-lxxh75qm> <button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-lxxh75qm>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "12", "height": "12", "data-astro-cid-lxxh75qm": true })}${dt("Search")}</button> </div> <p class="md-case-hint" data-case-hint hidden data-astro-cid-lxxh75qm>${dt("Only the cases on this page are filtered as you type. Press Enter to search every case.")}</p> <nav class="md-case-types"${addAttribute(dt("Kind of case"), "aria-label")} data-astro-cid-lxxh75qm> <a${addAttribute(caseLogHref({ q: caseLog.q, size: casesLimit }), "href")}${addAttribute(["md-case-pill", { on: !caseLog.filter }], "class:list")}${addAttribute(!caseLog.filter ? "page" : void 0, "aria-current")} data-case-pill data-astro-cid-lxxh75qm>${dt("All")}</a> ${Object.keys(CASE_FILTERS).map((key) => renderTemplate`<a${addAttribute(caseLogHref({ type: key, q: caseLog.q, size: casesLimit }), "href")}${addAttribute(["md-case-pill", { on: caseLog.filter === key }], "class:list")}${addAttribute(caseLog.filter === key ? "page" : void 0, "aria-current")}${addAttribute(`--c:${typeColor[key] ?? "#94a3b8"}`, "style")}${addAttribute(CASE_FILTERS[key].join(", "), "title")} data-case-pill data-astro-cid-lxxh75qm>${key}</a>`)} </nav> ${caseLog.type && caseLog.type !== caseLog.filter && renderTemplate`<p class="md-case-hint" data-astro-cid-lxxh75qm>${dt("Only {a} cases.", { a: caseLog.type })}</p>`} </form> ${caseLog.failed && renderTemplate`<p class="md-case-flash md-case-flash-err" role="alert" data-astro-cid-lxxh75qm>${dt("The cases could not be read. Try again in a moment.")}</p>`}${cases.length > 0 && renderTemplate`<div class="md-case-list" data-case-list data-astro-cid-lxxh75qm> ${cases.map((c) => renderTemplate`<div class="md-case-row"${addAttribute(c.type, "data-type")}${addAttribute(c.caseNumber, "data-case")}${addAttribute(c.reason ?? "", "data-reason")}${addAttribute(`${c.caseNumber} #${c.caseNumber} ${c.type} ${c.userId} ${c.moderatorId} ${people[c.userId]?.name ?? ""} ${people[c.moderatorId]?.name ?? ""} ${c.reason ?? ""}`.toLowerCase(), "data-search")} data-astro-cid-lxxh75qm> <span class="md-case-num" data-astro-cid-lxxh75qm>#${c.caseNumber}</span> <span class="md-case-type"${addAttribute(`--c:${typeColor[c.type] ?? "#94a3b8"}`, "style")} data-astro-cid-lxxh75qm>${c.type}</span> <span class="md-case-person" data-astro-cid-lxxh75qm> ${people[c.userId] ? renderTemplate`<img${addAttribute(people[c.userId].avatar, "src")} alt="" width="20" height="20" loading="lazy" decoding="async" data-astro-cid-lxxh75qm>` : null} <span data-astro-cid-lxxh75qm><b data-astro-cid-lxxh75qm>${people[c.userId]?.name ?? c.userId}</b><code data-astro-cid-lxxh75qm>${c.userId}</code></span> </span> <span class="md-case-by" data-astro-cid-lxxh75qm>${dt("by")} ${people[c.moderatorId]?.name ?? c.moderatorId}</span> <time class="md-case-when"${addAttribute(c.createdAt, "datetime")} data-local-time data-astro-cid-lxxh75qm>${c.createdAt}</time> ${c.reason && renderTemplate`<span class="md-case-reason" data-astro-cid-lxxh75qm>${c.reason}</span>`} ${((c.evidence ?? []).length > 0 || !c.active) && renderTemplate`<div class="md-case-foot" data-astro-cid-lxxh75qm> ${(c.evidence ?? []).length > 0 && renderTemplate`<span class="md-case-evidence" data-astro-cid-lxxh75qm>${dt("Proof")}: ${(c.evidence ?? []).map((url, i) => renderTemplate`<a${addAttribute(url, "href")} target="_blank" rel="noopener noreferrer" data-astro-cid-lxxh75qm>${i + 1}</a>`)}</span>`} ${!c.active && renderTemplate`<span class="md-case-inactive" data-astro-cid-lxxh75qm>${dt("expired")}</span>`} </div>`}  <a${addAttribute(["md-case-edit", { on: editCase === c.caseNumber }], "class:list")}${addAttribute(caseLogHref({ type: caseLog.type, q: caseLog.q, size: casesLimit, before: caseLog.before, edit: c.caseNumber }), "href")}${addAttribute(c.caseNumber, "data-case-edit")}${addAttribute(editCase === c.caseNumber ? "true" : "false", "aria-expanded")} data-astro-cid-lxxh75qm>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "12", "height": "12", "data-astro-cid-lxxh75qm": true })}${dt("Edit")}</a> ${editCase === c.caseNumber && renderTemplate`<form method="POST" class="md-case-form" data-no-dirty data-dash-hold data-case-form data-astro-cid-lxxh75qm> <input type="hidden" name="case"${addAttribute(c.caseNumber, "value")} data-astro-cid-lxxh75qm> <label data-astro-cid-lxxh75qm><span data-astro-cid-lxxh75qm>${dt("Reason of case #{a}", { a: c.caseNumber })}</span> <textarea name="reason" class="dgl-autogrow" rows="2" data-count maxlength="1000" required${addAttribute(dt("Why this sanction was given"), "placeholder")} data-astro-cid-lxxh75qm>${c.reason ?? ""}</textarea> </label> <div class="md-case-form-actions" data-astro-cid-lxxh75qm> <button type="submit" name="action" value="case_edit" class="btn btn-accent btn-sm" data-astro-cid-lxxh75qm>${dt("Save reason")}</button> <button type="submit" name="action" value="case_delete" class="btn btn-ghost btn-sm md-case-delete" formnovalidate${addAttribute(dt("Delete case #{a}? It disappears from the history of the member, and a deleted warning stops counting for warn escalation. The sanction itself is not lifted.", { a: c.caseNumber }), "data-confirm")} data-astro-cid-lxxh75qm>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "12", "height": "12", "data-astro-cid-lxxh75qm": true })}${dt("Delete case")}</button> <a class="btn btn-ghost btn-sm"${addAttribute(caseLogHref({ type: caseLog.type, q: caseLog.q, size: casesLimit, before: caseLog.before }), "href")} data-case-edit-close data-astro-cid-lxxh75qm>${dt("Cancel")}</a> </div> </form>`} </div>`)} </div>`}${cases.length > 0 && renderTemplate`<template data-case-form-template data-astro-cid-lxxh75qm> <form method="POST" class="md-case-form" data-no-dirty data-dash-hold data-case-form data-astro-cid-lxxh75qm> <input type="hidden" name="case" value="" data-astro-cid-lxxh75qm> <label data-astro-cid-lxxh75qm><span${addAttribute(dt("Reason of case #{a}", { a: "{n}" }), "data-case-label")} data-astro-cid-lxxh75qm></span> <textarea name="reason" class="dgl-autogrow" rows="2" data-count maxlength="1000" required${addAttribute(dt("Why this sanction was given"), "placeholder")} data-astro-cid-lxxh75qm></textarea> </label> <div class="md-case-form-actions" data-astro-cid-lxxh75qm> <button type="submit" name="action" value="case_edit" class="btn btn-accent btn-sm" data-astro-cid-lxxh75qm>${dt("Save reason")}</button> <button type="submit" name="action" value="case_delete" class="btn btn-ghost btn-sm md-case-delete" formnovalidate${addAttribute(dt("Delete case #{a}? It disappears from the history of the member, and a deleted warning stops counting for warn escalation. The sanction itself is not lifted.", { a: "{n}" }), "data-case-confirm")} data-astro-cid-lxxh75qm>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "12", "height": "12", "data-astro-cid-lxxh75qm": true })}${dt("Delete case")}</button> <button type="button" class="btn btn-ghost btn-sm" data-case-edit-close data-astro-cid-lxxh75qm>${dt("Cancel")}</button> </div> </form> </template>`}<p class="md-case-none" data-case-none${addAttribute(cases.length > 0 || caseLog.failed, "hidden")} data-astro-cid-lxxh75qm>${dt("No case matches that.")}${caseFiltered && renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-lxxh75qm": true }, { "default": ($$result4) => renderTemplate` <a${addAttribute(caseLogHref({ size: casesLimit }), "href")} data-astro-cid-lxxh75qm>${dt("Show every case")}</a>` })}`}</p> ${(caseLog.before || caseLog.older) && renderTemplate`<div class="md-case-pager" data-astro-cid-lxxh75qm> ${caseLog.before && renderTemplate`<a class="btn btn-ghost btn-sm"${addAttribute(caseLogHref({ type: caseLog.type, q: caseLog.q, size: casesLimit }), "href")} data-astro-cid-lxxh75qm>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrow-left-bold", "width": "12", "height": "12", "data-astro-cid-lxxh75qm": true })}${dt("Newest cases")}</a>`} ${caseLog.older && casesLimit < 100 && renderTemplate`<a class="btn btn-ghost btn-sm"${addAttribute(caseLogHref({ type: caseLog.type, q: caseLog.q, size: nextCasesLimit, before: caseLog.before }), "href")} data-astro-cid-lxxh75qm>${dt("Show more cases")}</a>`} ${caseLog.older && lastCaseNumber && renderTemplate`<a class="btn btn-ghost btn-sm"${addAttribute(caseLogHref({ type: caseLog.type, q: caseLog.q, size: casesLimit, before: lastCaseNumber }), "href")} data-astro-cid-lxxh75qm>${dt("Older cases")}${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "width": "12", "height": "12", "data-astro-cid-lxxh75qm": true })}</a>`} </div>`}` })}`} </div>`) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashModeration.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Moderation = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Moderation;
  const { id } = Astro2.params;
  const section = Astro2.url.searchParams.get("section") ?? "protection";
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
  let saved = false;
  let badInvites = [];
  let tooManyInvites = false;
  const MAX_ALLOWED_INVITES = 50;
  let caseMessage = null;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "config");
    if (action === "case_edit" || action === "case_delete") {
      const dashLang = getDashLang(Astro2);
      const dt = makeT(dashLang);
      const number = Math.trunc(Number(form.get("case") ?? 0));
      const result = action === "case_edit" ? await callPettoCases(Astro2, id, session.userId, "edit", { case: number, reason: String(form.get("reason") ?? "").replace(/\r\n?/g, "\n").trim().slice(0, 1e3) }, dashLang) : await callPettoCases(Astro2, id, session.userId, "delete", { case: number }, dashLang);
      caseMessage = { kind: result.ok ? "ok" : "err", number, text: result.message || (result.ok ? dt("Saved.") : dt("Petto did not answer. Try again in a moment.")) };
    }
    if (action === "config") {
      const bannedWords = String(form.get("banned_words") ?? "").split(",").map((w) => w.trim()).filter(Boolean);
      const immuneRoleIds = form.getAll("immune_role_ids").map(String).filter((v) => /^\d{15,25}$/.test(v)).slice(0, 250);
      const allowedInvites = /* @__PURE__ */ new Set();
      for (const raw of String(form.get("allowed_invite_codes") ?? "").split(/[\s,;]+/).map((x) => x.trim()).filter(Boolean)) {
        const code = raw.replace(/^(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord(?:app)?\.com\/invite)\//i, "").replace(/[?#].*$/, "").replace(/\/+$/, "").toLowerCase();
        if (!/^[a-z0-9-]{2,32}$/.test(code)) {
          if (badInvites.length < 5) badInvites.push(raw.slice(0, 40));
          continue;
        }
        if (allowedInvites.size >= MAX_ALLOWED_INVITES) {
          tooManyInvites = true;
          continue;
        }
        allowedInvites.add(code);
      }
      await Promise.all([
        fetch(`${apiUrl}/rest/v1/automod_config?on_conflict=guild_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({
            guild_id: id,
            word_filter_enabled: form.get("word_filter_enabled") === "on",
            word_filter_action: String(form.get("word_filter_action") ?? "warn"),
            banned_words: bannedWords,
            anti_spam_enabled: form.get("anti_spam_enabled") === "on",
            max_mentions: automodNumber("max_mentions", form.get("max_mentions")),
            anti_raid_enabled: form.get("anti_raid_enabled") === "on",
            raid_join_threshold: automodNumber("raid_join_threshold", form.get("raid_join_threshold")),
            raid_window_seconds: automodNumber("raid_window_seconds", form.get("raid_window_seconds")),
            raid_action: String(form.get("raid_action") ?? "alert"),
            anti_alt_enabled: form.get("anti_alt_enabled") === "on",
            anti_alt_min_age_days: automodNumber("anti_alt_min_age_days", form.get("anti_alt_min_age_days")),
            anti_alt_action: String(form.get("anti_alt_action") ?? "kick"),
            immune_role_ids: immuneRoleIds,
            allowed_invite_codes: [...allowedInvites],
            repeat_threshold: automodNumber("repeat_threshold", form.get("repeat_threshold")),
            repeat_window_seconds: automodNumber("repeat_window_seconds", form.get("repeat_window_seconds")),
            caps_percent: automodNumber("caps_percent", form.get("caps_percent")),
            caps_min_length: automodNumber("caps_min_length", form.get("caps_min_length")),
            max_message_length: automodNumber("max_message_length", form.get("max_message_length")),
            max_lines: automodNumber("max_lines", form.get("max_lines")),
            exempt_channel_ids: form.getAll("exempt_channel_ids").map(String).filter((v) => /^\d{15,25}$/.test(v)).slice(0, 50),
            spam_repeat: form.get("spam_repeat") === "on",
            spam_mentions: form.get("spam_mentions") === "on",
            spam_invites: form.get("spam_invites") === "on",
            spam_caps: form.get("spam_caps") === "on",
            strike_limit: automodNumber("strike_limit", form.get("strike_limit")),
            strike_window_minutes: automodNumber("strike_window_minutes", form.get("strike_window_minutes")),
            strike_mute_minutes: automodNumber("strike_mute_minutes", form.get("strike_mute_minutes")),
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          })
        }),
        fetch(`${apiUrl}/rest/v1/sticky_roles_config?on_conflict=guild_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, enabled: form.get("sticky_roles_enabled") === "on" })
        })
      ]);
      saved = true;
    } else if (action === "save_sanction_messages") {
      const types = ["default", "ban", "tempban", "softban", "unban", "kick", "mute", "tempmute", "unmute", "warn", "jail", "unjail"];
      const pick = (type, slot) => String(form.get(`${type}__${slot}`) ?? "").trim().slice(0, 40) || null;
      const rows = types.map((type) => ({ guild_id: id, type, dm_template: pick(type, "dm"), reply_template: pick(type, "reply"), log_template: pick(type, "log") }));
      const filled = rows.filter((row) => row.dm_template || row.reply_template || row.log_template);
      const empty = rows.filter((row) => !filled.includes(row));
      if (filled.length) {
        await fetch(`${apiUrl}/rest/v1/sanction_templates?on_conflict=guild_id,type`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify(filled) });
      }
      if (empty.length) {
        await fetch(`${apiUrl}/rest/v1/sanction_templates?guild_id=eq.${id}&type=in.(${empty.map((row) => row.type).join(",")})`, { method: "DELETE", headers: apiHeaders });
      }
      saved = true;
    } else if (action === "add_silent_channel") {
      const channelId = String(form.get("channel_id") ?? "").trim();
      const silentAction = String(form.get("silent_action") ?? "warn");
      if (channelId) {
        await fetch(`${apiUrl}/rest/v1/automod_silent_channels?on_conflict=guild_id,channel_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, channel_id: channelId, action: silentAction })
        });
        saved = true;
      }
    } else if (action === "delete_silent_channel") {
      const channelId = encodeURIComponent(String(form.get("channel_id") ?? ""));
      await fetch(`${apiUrl}/rest/v1/automod_silent_channels?guild_id=eq.${id}&channel_id=eq.${channelId}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    } else if (action === "add_escalation") {
      const warnCount = Math.max(1, Number(form.get("warn_count") ?? 0) || 0);
      const escAction = String(form.get("esc_action") ?? "mute");
      const durationMinutes = Number(form.get("duration_minutes") ?? 0) || 0;
      if (warnCount > 0) {
        await fetch(`${apiUrl}/rest/v1/warn_escalation_rules?on_conflict=guild_id,warn_count`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({
            guild_id: id,
            warn_count: warnCount,
            action: escAction,
            duration_ms: durationMinutes > 0 ? durationMinutes * 6e4 : null
          })
        });
        saved = true;
      }
    } else if (action === "delete_escalation") {
      const warnCount = Number(form.get("warn_count") ?? 0) || 0;
      await fetch(`${apiUrl}/rest/v1/warn_escalation_rules?guild_id=eq.${id}&warn_count=eq.${warnCount}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    }
  }
  const casesLimit = Math.min(100, [25, 50, 100, 200].includes(Number(Astro2.url.searchParams.get("cases"))) ? Number(Astro2.url.searchParams.get("cases")) : 25);
  const caseTypeParam = String(Astro2.url.searchParams.get("type") ?? "").trim().toLowerCase();
  const caseType = caseTypesFor(caseTypeParam) ? caseTypeParam : "";
  const caseQuery = String(Astro2.url.searchParams.get("q") ?? "").replace(/\s+/g, " ").trim().slice(0, 100);
  const caseBefore = Math.max(0, Math.trunc(Number(Astro2.url.searchParams.get("before") ?? 0)) || 0) || null;
  const caseEdit = Math.max(0, Math.trunc(Number(Astro2.url.searchParams.get("edit") ?? 0)) || 0) || null;
  const caseSearch = readCaseSearch(caseQuery);
  const casePeopleIds = section === "cases" && caseSearch.kind === "text" ? [.../* @__PURE__ */ new Set([...findKnownUsers(caseSearch.text), ...(await Promise.race([
    callPettoMemberSearch(Astro2, id, session.userId, caseSearch.text).catch(() => []),
    new Promise((resolve) => setTimeout(() => resolve([]), 3500))
  ])).map((member) => member.id)])] : [];
  const caseFilters = caseLogFilters({ type: caseType, search: caseSearch, before: caseBefore, peopleIds: casePeopleIds });
  const MODERATION_SECTIONS = ["protection", "silent-channels", "warn-escalation", "sanction-messages", "cases", "active", "stats"];
  const shown = MODERATION_SECTIONS.includes(section) ? section : "protection";
  const needs = (...sections) => sections.includes(shown);
  const when = (sections, load) => () => needs(...sections) ? load() : Promise.resolve(null);
  const [guildInfo, automodRes, antinukeRes, casesRes, silentRes, escalationRes, rolesRes, channelsRes, stickyRolesRes, sanctionTemplatesRes, embedTemplatesRes, activeRes, statsRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    when(["protection"], () => fetch(`${apiUrl}/rest/v1/automod_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders })),
    when(["protection"], () => fetch(`${apiUrl}/rest/v1/antinuke_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders })),
    when(["cases"], () => fetch(`${apiUrl}/rest/v1/mod_actions?guild_id=eq.${id}&select=case_number,type,user_id,moderator_id,reason,active,created_at,evidence${caseFilters ? `&${caseFilters}` : ""}&order=case_number.desc&limit=${casesLimit + 1}`, { headers: apiHeaders })),
    when(["silent-channels"], () => fetch(`${apiUrl}/rest/v1/automod_silent_channels?guild_id=eq.${id}&select=channel_id,action`, { headers: apiHeaders })),
    when(["warn-escalation"], () => fetch(`${apiUrl}/rest/v1/warn_escalation_rules?guild_id=eq.${id}&select=warn_count,action,duration_ms&order=warn_count.asc`, { headers: apiHeaders })),
    when(["protection"], () => getGuildList(Astro2, id, botToken, "roles")),
    when(["protection", "silent-channels"], () => getGuildList(Astro2, id, botToken, "channels")),
    when(["protection"], () => fetch(`${apiUrl}/rest/v1/sticky_roles_config?guild_id=eq.${id}&select=enabled`, { headers: apiHeaders })),
    when(["sanction-messages"], () => fetch(`${apiUrl}/rest/v1/sanction_templates?guild_id=eq.${id}&select=type,dm_template,reply_template,log_template`, { headers: apiHeaders })),
    when(["sanction-messages"], () => fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders })),
    when(["active"], () => fetch(`${apiUrl}/rest/v1/mod_actions?guild_id=eq.${id}&active=eq.true&type=in.(ban,tempban,hardban,mute,tempmute,jail)&select=case_number,type,user_id,moderator_id,reason,created_at,expires_at&order=created_at.desc&limit=100`, { headers: apiHeaders })),
    when(["stats"], () => fetch(`${apiUrl}/rest/v1/mod_actions?guild_id=eq.${id}&created_at=gte.${new Date(Date.now() - 30 * 864e5).toISOString()}&select=type,source,moderator_id,created_at&order=created_at.desc&limit=10000`, { headers: apiHeaders }))
  ], 6);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const automodRows = automodRes?.ok ? await automodRes.json() : [];
  const a = automodRows[0] ?? {};
  const automod = {
    wordFilterEnabled: a.word_filter_enabled ?? false,
    wordFilterAction: a.word_filter_action ?? "warn",
    bannedWords: a.banned_words ?? [],
    antiSpamEnabled: a.anti_spam_enabled ?? false,
    maxMentions: a.max_mentions ?? 5,
    antiRaidEnabled: a.anti_raid_enabled ?? false,
    raidJoinThreshold: a.raid_join_threshold ?? 6,
    raidWindowSeconds: a.raid_window_seconds ?? 10,
    raidAction: a.raid_action ?? "alert",
    antiAltEnabled: a.anti_alt_enabled ?? false,
    antiAltMinAgeDays: a.anti_alt_min_age_days ?? 7,
    antiAltAction: a.anti_alt_action ?? "kick",
    immuneRoleIds: a.immune_role_ids ?? [],
    repeatThreshold: a.repeat_threshold ?? 3,
    repeatWindow: a.repeat_window_seconds ?? 10,
    capsPercent: a.caps_percent ?? 70,
    capsMinLength: a.caps_min_length ?? 12,
    maxMessageLength: a.max_message_length ?? 0,
    maxLines: a.max_lines ?? 0,
    exemptChannelIds: a.exempt_channel_ids ?? [],
    allowedInviteCodes: a.allowed_invite_codes ?? [],
    spamRepeat: a.spam_repeat ?? true,
    spamMentions: a.spam_mentions ?? true,
    spamInvites: a.spam_invites ?? true,
    spamCaps: a.spam_caps ?? true,
    strikeLimit: a.strike_limit ?? 0,
    strikeWindow: a.strike_window_minutes ?? 10,
    strikeMute: a.strike_mute_minutes ?? 10
  };
  const antinukeRows = antinukeRes?.ok ? await antinukeRes.json() : [];
  const n = antinukeRows[0] ?? {};
  const antinuke = {
    enabled: n.enabled ?? false,
    actionThreshold: n.action_threshold ?? 5,
    windowSeconds: n.window_seconds ?? 10,
    whitelistIds: (n.whitelist_ids ?? []).join(", ")
  };
  const stickyRolesRows = stickyRolesRes?.ok ? await stickyRolesRes.json() : [];
  const stickyRolesEnabled = stickyRolesRows[0]?.enabled ?? false;
  const rawCasePage = casesRes?.ok ? await casesRes.json() : [];
  const olderCases = rawCasePage.length > casesLimit;
  const rawCases = rawCasePage.slice(0, casesLimit);
  const casesFailed = Boolean(casesRes && !casesRes.ok);
  const cases = rawCases.map((c) => ({
    caseNumber: c.case_number,
    type: c.type,
    userId: c.user_id,
    moderatorId: c.moderator_id,
    reason: c.reason,
    active: c.active,
    createdAt: c.created_at,
    evidence: c.evidence ?? []
  }));
  const rawActive = activeRes?.ok ? await activeRes.json() : [];
  const activeSanctions = rawActive.map((c) => ({ caseNumber: c.case_number, type: c.type, userId: c.user_id, moderatorId: c.moderator_id, reason: c.reason, createdAt: c.created_at, expiresAt: c.expires_at }));
  const rawStats = statsRes?.ok ? await statsRes.json() : [];
  const moderatorTotals = /* @__PURE__ */ new Map();
  const typeTotals = {};
  const dayTotals = {};
  let automaticTotal = 0;
  for (const row of rawStats) {
    typeTotals[row.type] = (typeTotals[row.type] ?? 0) + 1;
    const day = botDay(row.created_at);
    dayTotals[day] = (dayTotals[day] ?? 0) + 1;
    if (row.source && row.source !== "moderator") {
      automaticTotal += 1;
      continue;
    }
    moderatorTotals.set(row.moderator_id, (moderatorTotals.get(row.moderator_id) ?? 0) + 1);
  }
  const modStats = {
    total: rawStats.length,
    automatic: automaticTotal,
    byType: Object.entries(typeTotals).sort((x, y) => y[1] - x[1]),
    moderators: [...moderatorTotals.entries()].sort((x, y) => y[1] - x[1]).slice(0, 10).map(([userId, count]) => ({ userId, count })),
    days: rangeDays(/* @__PURE__ */ new Date(), 14).map((d) => ({ label: d.slice(5), count: dayTotals[d] ?? 0 }))
  };
  const caseUserIds = [...new Set([...cases, ...activeSanctions, ...modStats.moderators.map((m) => ({ userId: m.userId, moderatorId: m.userId }))].flatMap((c) => [c.userId, c.moderatorId]).filter((value) => /^\d{15,25}$/.test(value)))];
  const peopleMap = caseUserIds.length ? await describeTeam(botToken, caseUserIds.slice(0, 120)) : /* @__PURE__ */ new Map();
  const people = Object.fromEntries([...peopleMap].map(([userId, person]) => [userId, { name: person.displayName, avatar: person.avatarUrl.replace(/\?size=128$/, "?size=32") }]));
  const allRoles = rolesRes?.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((r) => r.name !== "@everyone").sort((a2, b) => b.position - a2.position).map((r) => ({ id: r.id, name: r.name }));
  const allChannels = channelsRes?.ok ? await channelsRes.json() : [];
  const channels = allChannels.filter((c) => c.type === 0 || c.type === 5).sort((a2, b) => a2.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  function channelName(channelId) {
    return channels.find((c) => c.id === channelId)?.name ?? channelId;
  }
  const rawSilent = silentRes?.ok ? await silentRes.json() : [];
  const silentChannels = rawSilent.map((s) => ({ channelId: s.channel_id, name: channelName(s.channel_id), action: s.action }));
  const sanctionMessagesReady = Boolean(sanctionTemplatesRes?.ok);
  const sanctionTemplates = {};
  for (const row of sanctionMessagesReady && sanctionTemplatesRes ? await sanctionTemplatesRes.json() : []) {
    sanctionTemplates[row.type] = { dm: row.dm_template ?? "", reply: row.reply_template ?? "", log: row.log_template ?? "" };
  }
  const embedTemplateNames = embedTemplatesRes?.ok ? (await embedTemplatesRes.json()).map((t) => t.name) : [];
  const prefixRes = await fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${id}&select=prefix`, { headers: apiHeaders }).catch(() => null);
  const prefix = String((prefixRes?.ok ? await prefixRes.json().catch(() => []) : [])[0]?.prefix || "!");
  const rawEscalation = escalationRes?.ok ? await escalationRes.json() : [];
  const escalationRules = rawEscalation.map((e) => ({
    warnCount: e.warn_count,
    action: e.action,
    durationMinutes: e.duration_ms ? Math.round(e.duration_ms / 6e4) : null
  }));
  return renderTemplate`${renderComponent($$result, "DashModeration", $$DashModeration, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "automod": automod, "antinuke": antinuke, "stickyRolesEnabled": stickyRolesEnabled, "cases": cases, "activeSanctions": activeSanctions, "modStats": modStats, "people": people, "casesLimit": casesLimit, "caseLog": { type: caseType, filter: caseFilterOf(caseType), q: caseQuery, before: caseBefore, older: olderCases, failed: casesFailed, edit: caseEdit }, "silentChannels": silentChannels, "escalationRules": escalationRules, "sanctionTemplates": sanctionTemplates, "sanctionMessagesReady": sanctionMessagesReady, "embedTemplateNames": embedTemplateNames, "roles": roles, "channels": channels, "saved": saved, "badInvites": badInvites, "tooManyInvites": tooManyInvites, "caseMessage": caseMessage, "section": section, "prefix": prefix })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/moderation.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/moderation.astro";
const $$url = "/dash/guild/[id]/moderation";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Moderation,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
