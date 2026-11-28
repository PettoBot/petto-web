import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, d as renderComponent, m as maybeRenderHead, F as Fragment, s as spreadAttributes, u as unescapeHTML } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashChartTip } from '../../../../chunks/DashChartTip_Ddh1J1_O.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { m as makeT, g as getDashLang, a as dashLocale } from '../../../../chunks/dash_CORIPvM-.mjs';
import { C as CATEGORIES, M as MODULES } from '../../../../chunks/dashModules_DtUifSkd.mjs';
/* empty css                                             */
import { c as chartTipJson } from '../../../../chunks/chartTip_6MOPUAs2.mjs';
import { B as BOT_TIME_LABEL, a as BOT_TIME_ZONE } from '../../../../chunks/activityStats_DxqJGP6E.mjs';
import { f as formatDuration } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { k as getGuildDetails, e as getGuildList, d as guildIconUrl } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
import { l as loadModuleStatuses } from '../../../../chunks/moduleStatuses_a5libdxg.mjs';
import { d as directQuery } from '../../../../chunks/directQuery_DHNRMYtJ.mjs';
import { p as parseOverviewRange, o as overviewDays, d as dayStartInstant, f as fillAxis, b as bucketSums, r as rowDay, a as bucketKey } from '../../../../chunks/dashDays_BDYG_Ap4.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$3 = createAstro("https://petto.sbs");
const $$DashQuickAccess = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$DashQuickAccess;
  const { guildId, quick } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const base = `/dash/guild/${guildId}`;
  const SAVES = {
    verification: { kind: "verify", url: `${base}/verification-api` },
    leveling: { kind: "form", url: `${base}/leveling?section=settings` },
    birthdays: { kind: "form", url: `${base}/birthdays` },
    suggestions: { kind: "form", url: `${base}/suggestions` },
    counting: { kind: "form", url: `${base}/counting` },
    confessions: { kind: "form", url: `${base}/confessions` }
  };
  const ALWAYS = [
    { id: "overview", title: dt("Overview"), icon: "ph:squares-four-fill", color: "#9bd0f5", href: `${base}/overview` },
    { id: "general", title: dt("Server settings"), icon: "ph:gear-six-fill", color: "#b4bcd0", href: `${base}/general?section=settings` },
    { id: "commands", title: dt("Commands"), icon: "ph:terminal-window-fill", color: "#8399ff", href: `${base}/permissions` }
  ];
  const pageOf = (href) => new URL(href, "https://x.invalid").pathname.split("/").filter(Boolean).pop() ?? "";
  const rows = (category) => MODULES.filter((m) => m.category === category).map((m) => {
    const sw = quick.switches[m.id];
    const status = quick.statuses[m.id]?.state;
    const href = m.href(guildId);
    if (sw && SAVES[m.id]) {
      const warn = sw.enabled && sw.needsChannel && !sw.hasChannel;
      return { id: m.id, title: dt(m.title), icon: m.icon, color: m.color, href, mode: "switch", on: sw.enabled, label: warn ? dt("Missing a channel") : sw.enabled ? dt("On") : dt("Off"), tone: warn ? "warn" : sw.enabled ? "on" : "off", needsChannel: sw.needsChannel, hasChannel: sw.hasChannel };
    }
    return { id: m.id, title: dt(m.title), icon: m.icon, color: m.color, href, mode: "plain", on: status === "on", label: status === "on" ? dt("On") : status === "todo" ? dt("Not set up") : "", tone: status === "on" ? "on" : status === "todo" ? "off" : "none", needsChannel: false, hasChannel: true };
  });
  const groups = [
    { id: "essentials", label: dt("Essentials"), rows: ALWAYS.map((a) => ({ ...a, mode: "always", on: true, label: dt("Always on"), tone: "on", needsChannel: false, hasChannel: true })) },
    ...CATEGORIES.map((c) => ({ id: c.id, label: dt(c.label), rows: rows(c.id) })).filter((g) => g.rows.length)
  ];
  const words = { on: dt("On"), off: dt("Off"), saved: dt("Saved."), failed: dt("It could not be saved, try again."), channel: dt("Missing a channel"), channelNeeded: dt("To turn this on you need to pick a channel first."), busy: dt("Saving...") };
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="qa" data-qa-root', "", " data-astro-cid-pdsc3c5t> ", ' <div class="qa-head" data-astro-cid-pdsc3c5t> <h2 class="qa-title" data-astro-cid-pdsc3c5t>', "</h2> <p data-astro-cid-pdsc3c5t>", '</p> </div> <div class="qa-groups" data-astro-cid-pdsc3c5t> ', ` </div> </div> <script>
  // The switches of the quick access. Bound once for the whole document (the dashboard swaps pages in without a reload).
  // - verification: its own route (\`{ action: 'enable' | 'disable' }\`, the bot does it, as the buttons of its page do);
  // - the other modules: the page that holds their settings is read, only the switch is changed and the whole form is sent back to the same address
  //   with the same method as its Save button, then the answer is read: it only counts as saved when the page now shows the switch as it was asked for;
  // - if anything fails, the switch goes back and the toast says so. Nothing is written for a switch that cannot be saved safely: that module has no switch.
  if (!window.__qaBound) {
    window.__qaBound = true;
    var qaToast = function (text, ok) { if (window.dglToast) window.dglToast(text, { kind: ok ? 'ok' : 'error' }); };
    var qaWords = function (el) { try { return JSON.parse((el.closest('[data-qa-root]') || document.querySelector('[data-qa-root]')).getAttribute('data-words') || '{}'); } catch (e) { return {}; } };
    var qaForm = function (doc) {
      var forms = Array.prototype.slice.call(doc.querySelectorAll('form'));
      return forms.filter(function (f) { return f.querySelector('input[name="enabled"][type="checkbox"]'); })[0] || null;
    };
    var qaPaint = function (card, on, words) {
      card.classList.toggle('on', on); card.classList.toggle('off', !on); card.classList.remove('warn');
      var state = card.querySelector('[data-qa-state]');
      if (state) { state.textContent = on ? words.on : words.off; state.className = 'qa-state ' + (on ? 'on' : 'off'); state.setAttribute('data-qa-state', ''); }
      var group = card.closest('[data-qa-group]');
      if (group) {
        var count = group.querySelector('[data-qa-count]');
        var total = group.querySelectorAll('[data-qa]').length; var active = group.querySelectorAll('[data-qa].on').length;
        if (count) count.textContent = count.textContent.replace(/\\d+(?=\\D+\\d+)/, String(active));
        void total;
      }
    };
    document.addEventListener('change', function (event) {
      var input = event.target && event.target.closest ? event.target.closest('[data-qa] [data-qa-switch]') : null;
      if (!input) return;
      var card = input.closest('[data-qa]'); var want = input.checked; var words = qaWords(card);
      var link = card.querySelector('[data-find-page]');
      if (link && link.getAttribute('aria-disabled') === 'true') { input.checked = !want; return; }
      var note = card.querySelector('.qa-note'); if (note) note.remove();
      if (want && card.getAttribute('data-needs-channel') === '1' && card.getAttribute('data-has-channel') !== '1') {
        input.checked = false;
        // A warning, not a plain line (the Configure button of the card is the way to the page where the channel is set).
        var hint = document.createElement('div'); hint.className = 'qa-note'; hint.setAttribute('role', 'alert');
        var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); icon.setAttribute('viewBox', '0 0 256 256'); icon.setAttribute('width', '15'); icon.setAttribute('height', '15'); icon.setAttribute('fill', 'currentColor'); icon.setAttribute('aria-hidden', 'true');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', 'M236.8 188.09 149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19 23.51 23.51 0 0 0 .02-23.72ZM120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z'); icon.appendChild(path);
        var message = document.createElement('span'); message.textContent = words.channelNeeded || words.channel;
        hint.append(icon, message);
        card.appendChild(hint);
        return;
      }
      var kind = card.getAttribute('data-kind'); var url = card.getAttribute('data-url');
      // The switch answers at once (it is painted as asked, nothing greys out or is disabled) and goes back only if the save fails.
      if (card.getAttribute('data-qa-busy') === '1') { input.checked = !want; return; }
      card.setAttribute('data-qa-busy', '1');
      var wasOn = card.classList.contains('on');
      qaPaint(card, want, words);
      var save;
      if (kind === 'verify') {
        save = fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: want ? 'enable' : 'disable' }) })
          .then(function (res) { return res.json().catch(function () { return {}; }).then(function (data) { if (!res.ok || data.ok === false) throw new Error(data && data.message ? data.message : words.failed); }); });
      } else {
        save = fetch(url, { credentials: 'same-origin', headers: { 'X-Dash-Partial': '1' } })
          .then(function (res) { if (!res.ok) throw new Error(words.failed); return res.text(); })
          .then(function (html) {
            var form = qaForm(new DOMParser().parseFromString(html, 'text/html'));
            if (!form) throw new Error(words.failed);
            var data = new FormData(form);
            data.delete('enabled'); if (want) data.set('enabled', 'on');
            return fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'X-Dash-Partial': '1' }, body: data });
          })
          .then(function (res) { if (!res.ok) throw new Error(words.failed); return res.text(); })
          .then(function (html) {
            var form = qaForm(new DOMParser().parseFromString(html, 'text/html'));
            var box = form && form.querySelector('input[name="enabled"][type="checkbox"]');
            if (!box || box.checked !== want) throw new Error(words.failed);
          });
      }
      save.then(function () { qaToast(words.saved, true); })
        .catch(function (error) { input.checked = !want; qaPaint(card, wasOn, words); qaToast(error && error.message ? error.message : words.failed, false); })
        .then(function () { card.removeAttribute('data-qa-busy'); });
    });
  }
<\/script> `], ["", '<div class="qa" data-qa-root', "", " data-astro-cid-pdsc3c5t> ", ' <div class="qa-head" data-astro-cid-pdsc3c5t> <h2 class="qa-title" data-astro-cid-pdsc3c5t>', "</h2> <p data-astro-cid-pdsc3c5t>", '</p> </div> <div class="qa-groups" data-astro-cid-pdsc3c5t> ', ` </div> </div> <script>
  // The switches of the quick access. Bound once for the whole document (the dashboard swaps pages in without a reload).
  // - verification: its own route (\\\`{ action: 'enable' | 'disable' }\\\`, the bot does it, as the buttons of its page do);
  // - the other modules: the page that holds their settings is read, only the switch is changed and the whole form is sent back to the same address
  //   with the same method as its Save button, then the answer is read: it only counts as saved when the page now shows the switch as it was asked for;
  // - if anything fails, the switch goes back and the toast says so. Nothing is written for a switch that cannot be saved safely: that module has no switch.
  if (!window.__qaBound) {
    window.__qaBound = true;
    var qaToast = function (text, ok) { if (window.dglToast) window.dglToast(text, { kind: ok ? 'ok' : 'error' }); };
    var qaWords = function (el) { try { return JSON.parse((el.closest('[data-qa-root]') || document.querySelector('[data-qa-root]')).getAttribute('data-words') || '{}'); } catch (e) { return {}; } };
    var qaForm = function (doc) {
      var forms = Array.prototype.slice.call(doc.querySelectorAll('form'));
      return forms.filter(function (f) { return f.querySelector('input[name="enabled"][type="checkbox"]'); })[0] || null;
    };
    var qaPaint = function (card, on, words) {
      card.classList.toggle('on', on); card.classList.toggle('off', !on); card.classList.remove('warn');
      var state = card.querySelector('[data-qa-state]');
      if (state) { state.textContent = on ? words.on : words.off; state.className = 'qa-state ' + (on ? 'on' : 'off'); state.setAttribute('data-qa-state', ''); }
      var group = card.closest('[data-qa-group]');
      if (group) {
        var count = group.querySelector('[data-qa-count]');
        var total = group.querySelectorAll('[data-qa]').length; var active = group.querySelectorAll('[data-qa].on').length;
        if (count) count.textContent = count.textContent.replace(/\\\\d+(?=\\\\D+\\\\d+)/, String(active));
        void total;
      }
    };
    document.addEventListener('change', function (event) {
      var input = event.target && event.target.closest ? event.target.closest('[data-qa] [data-qa-switch]') : null;
      if (!input) return;
      var card = input.closest('[data-qa]'); var want = input.checked; var words = qaWords(card);
      var link = card.querySelector('[data-find-page]');
      if (link && link.getAttribute('aria-disabled') === 'true') { input.checked = !want; return; }
      var note = card.querySelector('.qa-note'); if (note) note.remove();
      if (want && card.getAttribute('data-needs-channel') === '1' && card.getAttribute('data-has-channel') !== '1') {
        input.checked = false;
        // A warning, not a plain line (the Configure button of the card is the way to the page where the channel is set).
        var hint = document.createElement('div'); hint.className = 'qa-note'; hint.setAttribute('role', 'alert');
        var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); icon.setAttribute('viewBox', '0 0 256 256'); icon.setAttribute('width', '15'); icon.setAttribute('height', '15'); icon.setAttribute('fill', 'currentColor'); icon.setAttribute('aria-hidden', 'true');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', 'M236.8 188.09 149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19 23.51 23.51 0 0 0 .02-23.72ZM120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12 12 12 0 0 1-12 12Z'); icon.appendChild(path);
        var message = document.createElement('span'); message.textContent = words.channelNeeded || words.channel;
        hint.append(icon, message);
        card.appendChild(hint);
        return;
      }
      var kind = card.getAttribute('data-kind'); var url = card.getAttribute('data-url');
      // The switch answers at once (it is painted as asked, nothing greys out or is disabled) and goes back only if the save fails.
      if (card.getAttribute('data-qa-busy') === '1') { input.checked = !want; return; }
      card.setAttribute('data-qa-busy', '1');
      var wasOn = card.classList.contains('on');
      qaPaint(card, want, words);
      var save;
      if (kind === 'verify') {
        save = fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: want ? 'enable' : 'disable' }) })
          .then(function (res) { return res.json().catch(function () { return {}; }).then(function (data) { if (!res.ok || data.ok === false) throw new Error(data && data.message ? data.message : words.failed); }); });
      } else {
        save = fetch(url, { credentials: 'same-origin', headers: { 'X-Dash-Partial': '1' } })
          .then(function (res) { if (!res.ok) throw new Error(words.failed); return res.text(); })
          .then(function (html) {
            var form = qaForm(new DOMParser().parseFromString(html, 'text/html'));
            if (!form) throw new Error(words.failed);
            var data = new FormData(form);
            data.delete('enabled'); if (want) data.set('enabled', 'on');
            return fetch(url, { method: 'POST', credentials: 'same-origin', headers: { 'X-Dash-Partial': '1' }, body: data });
          })
          .then(function (res) { if (!res.ok) throw new Error(words.failed); return res.text(); })
          .then(function (html) {
            var form = qaForm(new DOMParser().parseFromString(html, 'text/html'));
            var box = form && form.querySelector('input[name="enabled"][type="checkbox"]');
            if (!box || box.checked !== want) throw new Error(words.failed);
          });
      }
      save.then(function () { qaToast(words.saved, true); })
        .catch(function (error) { input.checked = !want; qaPaint(card, wasOn, words); qaToast(error && error.message ? error.message : words.failed, false); })
        .then(function () { card.removeAttribute('data-qa-busy'); });
    });
  }
<\/script> `])), maybeRenderHead(), addAttribute(JSON.stringify(words), "data-words"), addAttribute(dt("Quick access"), "aria-label"), renderComponent($$result, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-pdsc3c5t": true }), dt("Quick access"), dt("Turn a module on or off from here, or open its settings."), groups.map((group) => renderTemplate`<div class="qa-group" data-qa-group data-astro-cid-pdsc3c5t> <div class="qa-group-head" data-astro-cid-pdsc3c5t> <h3 data-astro-cid-pdsc3c5t>${group.label}</h3>  ${group.rows.some((r) => r.tone !== "none") && renderTemplate`<span class="qa-count" data-qa-count data-astro-cid-pdsc3c5t>${dt("{n} of {m} on", { n: group.rows.filter((r) => r.tone !== "none" && r.on).length, m: group.rows.filter((r) => r.tone !== "none").length })}</span>`} </div> <div class="qa-list dgl-stagger" data-astro-cid-pdsc3c5t> ${group.rows.map((row) => renderTemplate`<div${addAttribute(["qa-mod", row.tone === "on" ? "on" : row.tone === "warn" ? "warn" : row.tone === "none" ? "none" : "off", { "qa-always": row.mode === "always" }], "class:list")} data-qa${addAttribute(row.id, "data-module")}${addAttribute(row.mode === "switch" ? SAVES[row.id].kind : void 0, "data-kind")}${addAttribute(row.mode === "switch" ? SAVES[row.id].url : void 0, "data-url")}${addAttribute(row.needsChannel ? "1" : void 0, "data-needs-channel")}${addAttribute(row.hasChannel ? "1" : void 0, "data-has-channel")} data-astro-cid-pdsc3c5t> <span class="qa-icon"${addAttribute(`--c:${row.color}`, "style")} data-astro-cid-pdsc3c5t>${renderComponent($$result, "Icon", $$Icon, { "name": row.icon, "width": "17", "height": "17", "data-astro-cid-pdsc3c5t": true })}</span> <span class="qa-text" data-astro-cid-pdsc3c5t><b data-astro-cid-pdsc3c5t>${row.title}</b>${row.label && renderTemplate`<em${addAttribute(["qa-state", row.tone], "class:list")} data-qa-state data-astro-cid-pdsc3c5t>${row.mode === "always" && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": "ph:lock-simple-fill", "width": "11", "height": "11", "data-astro-cid-pdsc3c5t": true })}`}${row.label}</em>`}</span> ${row.mode === "always" && renderTemplate`<span class="sx-switch qa-sw qa-locked"${addAttribute(dt("Always on"), "title")} data-astro-cid-pdsc3c5t><input type="checkbox" checked disabled${addAttribute(`${row.title}: ${dt("Always on")}`, "aria-label")} data-astro-cid-pdsc3c5t><span class="sx-toggle" data-astro-cid-pdsc3c5t></span></span>`} ${row.mode === "switch" && renderTemplate`<label class="sx-switch qa-sw" data-astro-cid-pdsc3c5t><input type="checkbox" role="switch"${addAttribute(row.on, "checked")}${addAttribute(row.title, "aria-label")} data-qa-switch data-astro-cid-pdsc3c5t><span class="sx-toggle" data-astro-cid-pdsc3c5t></span></label>`} ${row.id !== "overview" && renderTemplate`<a class="btn btn-ghost btn-sm qa-config"${addAttribute(row.href, "href")}${addAttribute(pageOf(row.href), "data-find-page")}${addAttribute(`${dt("Configure")}: ${row.title}`, "aria-label")}${addAttribute(dt("Configure"), "title")} data-astro-cid-pdsc3c5t><span class="qa-config-text" data-astro-cid-pdsc3c5t>${dt("Configure")}</span>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:arrow-right", "width": "14", "height": "14", "data-astro-cid-pdsc3c5t": true })}</a>`} </div>`)} </div> </div>`));
}, "/home/runner/work/petto-web/petto-web/src/components/DashQuickAccess.astro", void 0);

const $$Astro$2 = createAstro("https://petto.sbs");
const $$DashPermissionAlerts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$DashPermissionAlerts;
  const dt = makeT(getDashLang(Astro2));
  const { guildId } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="dpa" data-dpa${addAttribute(guildId, "data-guild")} hidden aria-live="polite"${addAttribute(dt("Happened once."), "data-t-seen-one")}${addAttribute(dt("Happened {n} times."), "data-t-seen-many")}${addAttribute(dt("Last time: {when}"), "data-t-last")}${addAttribute(dt("Checking\u2026"), "data-t-checking")}${addAttribute(dt("Dismiss"), "data-t-dismiss")} data-astro-cid-yu54ayac> <div class="dpa-head" data-astro-cid-yu54ayac> <span class="dpa-ico" aria-hidden="true" data-astro-cid-yu54ayac>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "18", "height": "18", "data-astro-cid-yu54ayac": true })}</span> <div class="dpa-title" data-astro-cid-yu54ayac> <strong data-astro-cid-yu54ayac>${dt("Petto is missing permissions")}</strong> <p data-astro-cid-yu54ayac>${dt("Something Petto tried to do here failed because of a permission. Fix what is named below and it goes away by itself. The log channel gets this notice once a day while it lasts.")}</p> </div> <button type="button" class="dpa-btn" data-dpa-recheck data-astro-cid-yu54ayac>${dt("Check again")}</button> </div> <ul class="dpa-list" data-dpa-list data-astro-cid-yu54ayac></ul> </section>  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashPermissionAlerts.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a, _b, _c;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashGuildOverview = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashGuildOverview;
  const dashLang = getDashLang(Astro2);
  const numLocale = dashLocale(dashLang);
  const dt = makeT(dashLang);
  const dth = makeT(dashLang, true);
  const { user, guildId, guildName, guildIcon, stats, modules, quick, activity, moderation } = Astro2.props;
  const CHART_W = 760;
  const CHART_H = 180;
  const maxVal = Math.max(1, ...activity.points.map((p) => Math.max(p.messages, p.reactions)));
  const singlePoint = activity.points.length === 1;
  function smoothPath(pts) {
    if (pts.length < 2) return "";
    if (pts.length === 2) return `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)} L${pts[1].x.toFixed(1)},${pts[1].y.toFixed(1)}`;
    let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
      let c1x = p1.x + (p2.x - p0.x) / 6;
      let c1y = p1.y + (p2.y - p0.y) / 6;
      let c2x = p2.x - (p3.x - p1.x) / 6;
      let c2y = p2.y - (p3.y - p1.y) / 6;
      const yLo = Math.min(p1.y, p2.y);
      const yHi = Math.max(p1.y, p2.y);
      c1y = Math.max(yLo, Math.min(yHi, c1y));
      c2y = Math.max(yLo, Math.min(yHi, c2y));
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  }
  function pointsFor(key) {
    const n2 = activity.points.length;
    return activity.points.map((p, i) => {
      const x = n2 === 1 ? CHART_W / 2 : i / (n2 - 1) * CHART_W;
      const y = CHART_H - p[key] / maxVal * (CHART_H - 10) - 5;
      return { x, y };
    });
  }
  function pathFor(key) {
    return smoothPath(pointsFor(key));
  }
  function areaFor(key) {
    const pts = pointsFor(key);
    if (pts.length < 2) return "";
    return `${smoothPath(pts)} L${pts[pts.length - 1].x.toFixed(1)},${CHART_H} L${pts[0].x.toFixed(1)},${CHART_H} Z`;
  }
  const messagesPath = pathFor("messages");
  const reactionsPath = pathFor("reactions");
  const messagesArea = areaFor("messages");
  const reactionsArea = areaFor("reactions");
  const messagesPts = pointsFor("messages");
  const reactionsPts = pointsFor("reactions");
  const messagesDot = singlePoint ? messagesPts[0] : null;
  const reactionsDot = singlePoint ? reactionsPts[0] : null;
  function formatLabel(iso) {
    return (/* @__PURE__ */ new Date(`${iso}T00:00:00Z`)).toLocaleDateString(dashLang === "en" ? "en-US" : dashLang, { month: "short", day: "numeric", timeZone: "UTC" });
  }
  const yFrac = (v, max) => (CHART_H - v / max * (CHART_H - 10) - 5) / CHART_H;
  const tipData = chartTipJson(activity.points.map((p, i) => ({ x: activity.points.length > 1 ? i / (activity.points.length - 1) : 0.5, y: [yFrac(p.messages, maxVal), yFrac(p.reactions, maxVal)], f: { "dgo-tt-date": formatLabel(p.label), "dgo-tt-messages": p.messages, "dgo-tt-reactions": p.reactions } })));
  const AXIS_LABEL_COUNT = 20;
  const n = activity.points.length;
  const axisLabelCount = Math.min(AXIS_LABEL_COUNT, n);
  const axisLabels = axisLabelCount > 1 ? [...new Set(Array.from({ length: axisLabelCount }, (_, i) => Math.round(i * (n - 1) / (axisLabelCount - 1))))].map((i) => ({
    pct: i / (n - 1) * 100,
    text: formatLabel(activity.points[i].label)
  })) : [];
  const tickValues = (max) => [1, 0.75, 0.5, 0.25, 0].map((f) => max >= 20 || Number.isInteger(max * f) ? Math.round(max * f) : null);
  const yTicks = tickValues(maxVal);
  const modMaxVal = Math.max(1, ...moderation.points.map((p) => Math.max(p.bans, p.other)));
  const modSinglePoint = moderation.points.length === 1;
  function modPointsFor(key) {
    const n2 = moderation.points.length;
    return moderation.points.map((p, i) => {
      const x = n2 === 1 ? CHART_W / 2 : i / (n2 - 1) * CHART_W;
      const y = CHART_H - p[key] / modMaxVal * (CHART_H - 10) - 5;
      return { x, y };
    });
  }
  function modPathFor(key) {
    return smoothPath(modPointsFor(key));
  }
  function modAreaFor(key) {
    const pts = modPointsFor(key);
    if (pts.length < 2) return "";
    return `${smoothPath(pts)} L${pts[pts.length - 1].x.toFixed(1)},${CHART_H} L${pts[0].x.toFixed(1)},${CHART_H} Z`;
  }
  const bansPath = modPathFor("bans");
  const otherPath = modPathFor("other");
  const bansArea = modAreaFor("bans");
  const otherArea = modAreaFor("other");
  const bansPts = modPointsFor("bans");
  const otherPts = modPointsFor("other");
  const bansDot = modSinglePoint ? bansPts[0] : null;
  const otherDot = modSinglePoint ? otherPts[0] : null;
  const modTipData = chartTipJson(moderation.points.map((p, i) => ({ x: moderation.points.length > 1 ? i / (moderation.points.length - 1) : 0.5, y: [yFrac(p.bans, modMaxVal), yFrac(p.other, modMaxVal)], f: { "dgo-mod-tt-date": formatLabel(p.label), "dgo-mod-tt-bans": p.bans, "dgo-mod-tt-other": p.other } })));
  const modN = moderation.points.length;
  const modAxisLabelCount = Math.min(AXIS_LABEL_COUNT, modN);
  const modAxisLabels = modAxisLabelCount > 1 ? [...new Set(Array.from({ length: modAxisLabelCount }, (_, i) => Math.round(i * (modN - 1) / (modAxisLabelCount - 1))))].map((i) => ({
    pct: i / (modN - 1) * 100,
    text: formatLabel(moderation.points[i].label)
  })) : [];
  const modYTicks = tickValues(modMaxVal);
  const totalEngagement = activity.totalMessages + activity.totalReactions;
  const prevEngagement = activity.messagesDeltaPct !== null || activity.reactionsDeltaPct !== null ? Math.round(activity.totalMessages / (1 + (activity.messagesDeltaPct ?? 0) / 100)) + Math.round(activity.totalReactions / (1 + (activity.reactionsDeltaPct ?? 0) / 100)) : null;
  const engagementDeltaPct = prevEngagement && prevEngagement > 0 ? (totalEngagement - prevEngagement) / prevEngagement * 100 : null;
  const setUp = modules.filter((m) => m.items.some((it) => it.ok));
  const toSetUp = modules.filter((m) => !m.items.some((it) => it.ok));
  const setUpPct = modules.length ? Math.round(setUp.length / modules.length * 100) : 0;
  const base = `/dash/guild/${guildId}`;
  const shortcuts = [
    { slug: "moderation", icon: "ph:shield-check-fill", label: dt("Moderation"), color: "#c98791" },
    { slug: "leveling", icon: "ph:chart-line-up-fill", label: dt("Leveling"), color: "#86b894" },
    { slug: "tickets", icon: "ph:ticket", label: dt("Tickets"), color: "#9bd0f5" },
    { slug: "giveaways", icon: "ph:gift-fill", label: dt("Giveaways"), color: "#f5c26b" },
    { slug: "automation", icon: "ph:robot", label: dt("Automation"), color: "#c6a8f5" },
    { slug: "embeds", icon: "ph:chat-circle-dots-fill", label: dt("Embeds"), color: "#c9d0db" },
    { slug: "welcome", icon: "ph:hand-waving-fill", label: dt("Welcome"), color: "#86b894" },
    { slug: "stats", icon: "ph:chart-bar-fill", label: dt("Statistics"), color: "#9bd0f5" }
  ];
  const num = (index) => stats[index]?.n ?? 0;
  const serverTiles = [
    { label: stats[0]?.label ?? dt("Members"), value: num(0), tone: "voice" },
    { label: stats[2]?.label ?? dt("Channels"), value: num(2), tone: "joins" },
    { label: stats[1]?.label ?? dt("Roles"), value: num(1), tone: "invites" },
    { label: stats[6]?.label ?? dt("Emojis"), value: num(6), tone: "reactions" },
    { label: stats[7]?.label ?? dt("Boosts"), value: num(7), tone: "messages" },
    { label: stats[8]?.label ?? dt("Boost level"), value: num(8), tone: "leaves" }
  ];
  const roundPct = (pct) => pct === null ? null : Math.round(pct);
  const activityTiles = [
    { label: dt("Messages"), value: activity.totalMessages, tone: "messages", change: roundPct(activity.messagesDeltaPct) },
    { label: dt("Reactions"), value: activity.totalReactions, tone: "reactions", change: roundPct(activity.reactionsDeltaPct) },
    { label: dt("Voice hours"), value: 0, text: formatDuration(activity.totalVoiceSeconds, { locale: numLocale, max: "h" }), hint: activity.totalVoiceSeconds >= 86400 ? dt("Equal to {a} of voice in a row", { a: formatDuration(activity.totalVoiceSeconds, { locale: numLocale }) }) : void 0, tone: "voice" },
    { label: dt("Active channels"), value: activity.activeChannels, tone: "invites" }
  ];
  function fmtDelta(pct) {
    if (pct === null) return null;
    const sign = pct >= 0 ? "+" : "";
    return `${sign}${pct.toFixed(0)}%`;
  }
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "overview", "pageTitle": "Overview", "data-astro-cid-del4q7zi": true }, { "default": ($$result2) => renderTemplate(_c || (_c = __template([" ", '<div class="dgo-head" data-astro-cid-del4q7zi> <h1 data-astro-cid-del4q7zi>', '</h1> <div class="dgo-controls" data-astro-cid-del4q7zi> <span class="dgo-tz"', " data-astro-cid-del4q7zi>", "", '</span> <div class="dgo-range" data-astro-cid-del4q7zi> <a href="?range=day"', " data-astro-cid-del4q7zi>", '</a> <a href="?range=week"', " data-astro-cid-del4q7zi>", '</a> <a href="?range=month"', " data-astro-cid-del4q7zi>", '</a> <a href="?range=year"', " data-astro-cid-del4q7zi>", "</a> </div> </div> </div> ", ' <div class="dgo-top-stack dgl-stagger" data-astro-cid-del4q7zi> <section', "", ' data-astro-cid-del4q7zi> <div class="dgo-ring"', ' role="img"', ' data-astro-cid-del4q7zi> <svg viewBox="0 0 36 36" aria-hidden="true" data-astro-cid-del4q7zi><circle cx="18" cy="18" r="15.9155" pathLength="100" class="dgo-ring-bg" data-astro-cid-del4q7zi></circle><circle cx="18" cy="18" r="15.9155" pathLength="100" class="dgo-ring-fg" data-astro-cid-del4q7zi></circle></svg> <b data-astro-cid-del4q7zi><span class="dgo-num-clip" data-astro-cid-del4q7zi><span class="dgo-num" data-astro-cid-del4q7zi>', '<small data-astro-cid-del4q7zi>%</small></span></span></b> </div> <div class="dgo-setup-body" data-astro-cid-del4q7zi> <strong data-astro-cid-del4q7zi>', "</strong> ", " ", ' </div> </section> <section class="dgo-shortcuts"', " data-astro-cid-del4q7zi> ", " </section> <div data-astro-cid-del4q7zi> ", ' <p class="dgo-facts" data-astro-cid-del4q7zi>', "</p> </div> </div> ", "", " <script>\n    // A shortcut or a chip the member cannot open (the menu does not list its page) is not shown: the menu is the list of what this member can use.\n    (function () {\n      var open = {};\n      document.querySelectorAll('.dgl-link').forEach(function (a) {\n        try { var parts = new URL(a.getAttribute('href'), location.href).pathname.split('/').filter(Boolean); open[parts[parts.length - 1]] = true; } catch (e) { /* not a page */ }\n      });\n      if (!Object.keys(open).length) return;\n      document.querySelectorAll('[data-sc]').forEach(function (el) { if (!open[el.getAttribute('data-sc')]) el.remove(); });\n      document.querySelectorAll('[data-find-page]').forEach(function (el) { if (!open[el.getAttribute('data-find-page')]) el.setAttribute('aria-disabled', 'true'); });\n    })();\n  <\/script> "])), maybeRenderHead(), dt("Hello, {a}", { a: user.username }), addAttribute(dt("All times are {a}.", { a: "GMT-5 (Colombia)" }), "title"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-fill", "width": "12", "height": "12", "data-astro-cid-del4q7zi": true }), BOT_TIME_LABEL, addAttribute({ active: activity.range === "day" }, "class:list"), dt("Day"), addAttribute({ active: activity.range === "week" }, "class:list"), dt("Week"), addAttribute({ active: activity.range === "month" }, "class:list"), dt("Month"), addAttribute({ active: activity.range === "year" }, "class:list"), dt("Year"), renderComponent($$result2, "DashPermissionAlerts", $$DashPermissionAlerts, { "guildId": guildId, "data-astro-cid-del4q7zi": true }), addAttribute(["dgo-setup", { done: toSetUp.length === 0 }], "class:list"), addAttribute(dt("Setup"), "aria-label"), addAttribute(`--p:${setUpPct}`, "style"), addAttribute(`${setUpPct}%`, "aria-label"), setUpPct, toSetUp.length === 0 ? dt("Everything is set up. Nice work.") : dt("{a} of {b} areas set up", { a: setUp.length, b: modules.length }), toSetUp.length > 0 && renderTemplate`<p data-astro-cid-del4q7zi>${dt("Still to set up")}</p>`, toSetUp.length > 0 && renderTemplate`<div class="dgo-todo" data-astro-cid-del4q7zi> ${toSetUp.map((m) => renderTemplate`<a${addAttribute(m.href, "href")} class="dgo-chip"${addAttribute(m.href.split("/").pop(), "data-find-page")} data-astro-cid-del4q7zi>${m.title}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right", "width": "11", "height": "11", "data-astro-cid-del4q7zi": true })}</a>`)} </div>`, addAttribute(dt("Shortcuts"), "aria-label"), shortcuts.map((sc) => renderTemplate`<a${addAttribute(`${base}/${sc.slug}`, "href")} class="dgo-shortcut"${addAttribute(sc.slug, "data-sc")}${addAttribute(`--c:${sc.color}`, "style")} data-astro-cid-del4q7zi> <span class="dgo-shortcut-icon" data-astro-cid-del4q7zi>${renderComponent($$result2, "Icon", $$Icon, { "name": sc.icon, "width": "17", "height": "17", "data-astro-cid-del4q7zi": true })}</span> <span class="dgo-shortcut-name" data-astro-cid-del4q7zi>${sc.label}</span> </a>`), renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": serverTiles, "data-astro-cid-del4q7zi": true }), dt("{a} text \xB7 {b} voice \xB7 {c} categories", { a: stats[3]?.n ?? 0, b: stats[4]?.n ?? 0, c: stats[5]?.n ?? 0 }), !activity.hasData ? renderTemplate`<div class="dgo-empty" data-astro-cid-del4q7zi> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chart-line-fill", "width": "20", "height": "20", "data-astro-cid-del4q7zi": true })} <div data-astro-cid-del4q7zi> <div class="dgo-empty-t" data-astro-cid-del4q7zi>${dt("No activity tracked yet")}</div> <p data-astro-cid-del4q7zi>${dt("Petto started counting messages, reactions and voice time recently, come back once there's been some activity to chart.")}</p> </div> </div>` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-del4q7zi": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "DashStatTiles", $$DashStatTiles, { "tiles": activityTiles, "data-astro-cid-del4q7zi": true })} <div class="dgo-chart-card" data-astro-cid-del4q7zi> <div class="dgo-chart-head" data-astro-cid-del4q7zi> <div class="dgo-chart-eyebrow" data-astro-cid-del4q7zi>${dt("Total engagement")}</div> <div class="dgo-chart-big" data-astro-cid-del4q7zi><span class="dgo-num-clip" data-astro-cid-del4q7zi><span class="dgo-num" data-astro-cid-del4q7zi>${totalEngagement.toLocaleString(numLocale)}</span></span></div> ${fmtDelta(engagementDeltaPct) && renderTemplate`<div${addAttribute(["dgo-metric-delta", { down: (engagementDeltaPct ?? 0) < 0 }], "class:list")} data-astro-cid-del4q7zi>${dt("{a} vs previous period", { a: fmtDelta(engagementDeltaPct) })}</div>`} </div> <div class="dgo-chart-row" data-astro-cid-del4q7zi> <div class="dgo-chart-axis" data-astro-cid-del4q7zi> ${yTicks.map((v) => renderTemplate`<span data-astro-cid-del4q7zi>${v === null ? "\xA0" : v.toLocaleString(numLocale)}</span>`)} </div> <div class="dgo-chart-wrap" id="dgo-chart-wrap"${spreadAttributes(singlePoint ? {} : { "data-ct": "", tabindex: 0, role: "group", "aria-label": dt("Total engagement") })} data-astro-cid-del4q7zi> <svg${addAttribute(`0 0 ${CHART_W} ${CHART_H}`, "viewBox")} preserveAspectRatio="none" class="dgo-chart" id="dgo-chart-svg" data-astro-cid-del4q7zi> <defs data-astro-cid-del4q7zi> <linearGradient id="dgo-grad-messages" x1="0" y1="0" x2="0" y2="1" data-astro-cid-del4q7zi> <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.32" data-astro-cid-del4q7zi></stop> <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" data-astro-cid-del4q7zi></stop> </linearGradient> <linearGradient id="dgo-grad-reactions" x1="0" y1="0" x2="0" y2="1" data-astro-cid-del4q7zi> <stop offset="0%" stop-color="#f78fb3" stop-opacity="0.28" data-astro-cid-del4q7zi></stop> <stop offset="100%" stop-color="#f78fb3" stop-opacity="0" data-astro-cid-del4q7zi></stop> </linearGradient> </defs> ${[0.25, 0.5, 0.75].map((f) => renderTemplate`<line x1="0"${addAttribute(CHART_W, "x2")}${addAttribute(CHART_H * f, "y1")}${addAttribute(CHART_H * f, "y2")} class="dgo-gridline" data-astro-cid-del4q7zi></line>`)} <path${addAttribute(messagesArea, "d")} fill="url(#dgo-grad-messages)" stroke="none" class="dgo-area" data-astro-cid-del4q7zi></path> <path${addAttribute(reactionsArea, "d")} fill="url(#dgo-grad-reactions)" stroke="none" class="dgo-area" data-astro-cid-del4q7zi></path> <path${addAttribute(messagesPath, "d")} class="dgo-line dgo-line-messages" data-astro-cid-del4q7zi></path> <path${addAttribute(reactionsPath, "d")} class="dgo-line dgo-line-reactions" style="animation-delay:0.14s" data-astro-cid-del4q7zi></path> </svg> ${messagesDot && renderTemplate`<div class="dgo-hdot dgo-hdot-messages"${addAttribute(`left:${messagesDot.x / CHART_W * 100}%;top:${messagesDot.y / CHART_H * 100}%`, "style")} data-astro-cid-del4q7zi></div>`} ${reactionsDot && renderTemplate`<div class="dgo-hdot dgo-hdot-reactions"${addAttribute(`left:${reactionsDot.x / CHART_W * 100}%;top:${reactionsDot.y / CHART_H * 100}%`, "style")} data-astro-cid-del4q7zi></div>`} ${!singlePoint && messagesPts.length > 1 && renderTemplate`<div class="dgo-hdot dgo-hdot-end dgo-hdot-messages"${addAttribute(`left:${messagesPts[messagesPts.length - 1].x / CHART_W * 100}%;top:${messagesPts[messagesPts.length - 1].y / CHART_H * 100}%;--md:760ms`, "style")} data-astro-cid-del4q7zi></div>`} ${!singlePoint && reactionsPts.length > 1 && renderTemplate`<div class="dgo-hdot dgo-hdot-end dgo-hdot-reactions"${addAttribute(`left:${reactionsPts[reactionsPts.length - 1].x / CHART_W * 100}%;top:${reactionsPts[reactionsPts.length - 1].y / CHART_H * 100}%;--md:900ms`, "style")} data-astro-cid-del4q7zi></div>`} ${!singlePoint && renderTemplate`<i class="ct-guide" data-ct-guide data-astro-cid-del4q7zi></i>
              <i class="ct-dot" data-ct-dot style="--ct-c:var(--accent)" data-astro-cid-del4q7zi></i>
              <i class="ct-dot" data-ct-dot style="--ct-c:#f78fb3" data-astro-cid-del4q7zi></i>
              <div class="ct-tip" data-ct-box data-astro-cid-del4q7zi> <div class="dgo-tt-date" id="dgo-tt-date" data-astro-cid-del4q7zi></div> <div class="dgo-tt-row" data-astro-cid-del4q7zi>${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate`${unescapeHTML(dth('<i class="dgo-dot dgo-dot-messages"></i><span id="dgo-tt-messages"></span> messages'))}` })}</div> <div class="dgo-tt-row" data-astro-cid-del4q7zi>${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate`${unescapeHTML(dth('<i class="dgo-dot dgo-dot-reactions"></i><span id="dgo-tt-reactions"></span> reactions'))}` })}</div> </div>`} ${!singlePoint && renderTemplate(_a || (_a = __template(['<script type="application/json" data-ct-data>', "<\/script>"])), unescapeHTML(tipData))} </div> </div> ${!singlePoint && renderTemplate`<div class="dgo-chart-dates" data-astro-cid-del4q7zi> ${axisLabels.map((l, i) => renderTemplate`<span${addAttribute({ first: i === 0, last: i === axisLabels.length - 1 }, "class:list")}${addAttribute(i > 0 && i < axisLabels.length - 1 ? `left:${l.pct}%` : void 0, "style")} data-astro-cid-del4q7zi> ${l.text} </span>`)} </div>`} ${singlePoint && renderTemplate`<p class="dgo-chart-note" data-astro-cid-del4q7zi>${dt("Just one day tracked so far, the line fills in as more days come in.")}</p>`} <div class="dgo-legend" data-astro-cid-del4q7zi> <span data-astro-cid-del4q7zi><i class="dgo-dot dgo-dot-messages" data-astro-cid-del4q7zi></i>${dt("Messages")}</span> <span data-astro-cid-del4q7zi><i class="dgo-dot dgo-dot-reactions" data-astro-cid-del4q7zi></i>${dt("Reactions")}</span> </div> </div> ${moderation.hasData && renderTemplate`<div class="dgo-chart-card" data-astro-cid-del4q7zi> <div class="dgo-chart-head" data-astro-cid-del4q7zi> <div class="dgo-chart-eyebrow" data-astro-cid-del4q7zi>${dt("Moderation actions")}</div> <div class="dgo-chart-big" data-astro-cid-del4q7zi><span class="dgo-num-clip" data-astro-cid-del4q7zi><span class="dgo-num" data-astro-cid-del4q7zi>${moderation.totalActions.toLocaleString(numLocale)}</span></span></div> ${fmtDelta(moderation.deltaPct) && renderTemplate`<div${addAttribute(["dgo-metric-delta", { down: (moderation.deltaPct ?? 0) < 0 }], "class:list")} data-astro-cid-del4q7zi>${dt("{a} vs previous period", { a: fmtDelta(moderation.deltaPct) })}</div>`} </div> <div class="dgo-chart-row" data-astro-cid-del4q7zi> <div class="dgo-chart-axis" data-astro-cid-del4q7zi> ${modYTicks.map((v) => renderTemplate`<span data-astro-cid-del4q7zi>${v === null ? "\xA0" : v.toLocaleString(numLocale)}</span>`)} </div> <div class="dgo-chart-wrap" id="dgo-mod-chart-wrap"${spreadAttributes(modSinglePoint ? {} : { "data-ct": "", tabindex: 0, role: "group", "aria-label": dt("Moderation actions") })} data-astro-cid-del4q7zi> <svg${addAttribute(`0 0 ${CHART_W} ${CHART_H}`, "viewBox")} preserveAspectRatio="none" class="dgo-chart" id="dgo-mod-chart-svg" data-astro-cid-del4q7zi> <defs data-astro-cid-del4q7zi> <linearGradient id="dgo-grad-bans" x1="0" y1="0" x2="0" y2="1" data-astro-cid-del4q7zi> <stop offset="0%" stop-color="var(--chart-red)" stop-opacity="0.32" data-astro-cid-del4q7zi></stop> <stop offset="100%" stop-color="var(--chart-red)" stop-opacity="0" data-astro-cid-del4q7zi></stop> </linearGradient> <linearGradient id="dgo-grad-other" x1="0" y1="0" x2="0" y2="1" data-astro-cid-del4q7zi> <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.28" data-astro-cid-del4q7zi></stop> <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" data-astro-cid-del4q7zi></stop> </linearGradient> </defs> ${[0.25, 0.5, 0.75].map((f) => renderTemplate`<line x1="0"${addAttribute(CHART_W, "x2")}${addAttribute(CHART_H * f, "y1")}${addAttribute(CHART_H * f, "y2")} class="dgo-gridline" data-astro-cid-del4q7zi></line>`)} <path${addAttribute(bansArea, "d")} fill="url(#dgo-grad-bans)" stroke="none" class="dgo-area" data-astro-cid-del4q7zi></path> <path${addAttribute(otherArea, "d")} fill="url(#dgo-grad-other)" stroke="none" class="dgo-area" data-astro-cid-del4q7zi></path> <path${addAttribute(bansPath, "d")} class="dgo-line dgo-line-bans" data-astro-cid-del4q7zi></path> <path${addAttribute(otherPath, "d")} class="dgo-line dgo-line-other" style="animation-delay:0.14s" data-astro-cid-del4q7zi></path> </svg> ${bansDot && renderTemplate`<div class="dgo-hdot dgo-hdot-bans"${addAttribute(`left:${bansDot.x / CHART_W * 100}%;top:${bansDot.y / CHART_H * 100}%`, "style")} data-astro-cid-del4q7zi></div>`} ${otherDot && renderTemplate`<div class="dgo-hdot dgo-hdot-other"${addAttribute(`left:${otherDot.x / CHART_W * 100}%;top:${otherDot.y / CHART_H * 100}%`, "style")} data-astro-cid-del4q7zi></div>`} ${!modSinglePoint && bansPts.length > 1 && renderTemplate`<div class="dgo-hdot dgo-hdot-end dgo-hdot-bans"${addAttribute(`left:${bansPts[bansPts.length - 1].x / CHART_W * 100}%;top:${bansPts[bansPts.length - 1].y / CHART_H * 100}%;--md:760ms`, "style")} data-astro-cid-del4q7zi></div>`} ${!modSinglePoint && otherPts.length > 1 && renderTemplate`<div class="dgo-hdot dgo-hdot-end dgo-hdot-other"${addAttribute(`left:${otherPts[otherPts.length - 1].x / CHART_W * 100}%;top:${otherPts[otherPts.length - 1].y / CHART_H * 100}%;--md:900ms`, "style")} data-astro-cid-del4q7zi></div>`} ${!modSinglePoint && renderTemplate`<i class="ct-guide" data-ct-guide data-astro-cid-del4q7zi></i>
                <i class="ct-dot" data-ct-dot style="--ct-c:var(--chart-red)" data-astro-cid-del4q7zi></i>
                <i class="ct-dot" data-ct-dot style="--ct-c:var(--accent)" data-astro-cid-del4q7zi></i>
                <div class="ct-tip" data-ct-box data-astro-cid-del4q7zi> <div class="dgo-tt-date" id="dgo-mod-tt-date" data-astro-cid-del4q7zi></div> <div class="dgo-tt-row" data-astro-cid-del4q7zi>${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate`${unescapeHTML(dth('<i class="dgo-dot dgo-dot-bans"></i><span id="dgo-mod-tt-bans"></span> bans'))}` })}</div> <div class="dgo-tt-row" data-astro-cid-del4q7zi>${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate`${unescapeHTML(dth('<i class="dgo-dot dgo-dot-other"></i><span id="dgo-mod-tt-other"></span> other actions'))}` })}</div> </div>`} ${!modSinglePoint && renderTemplate(_b || (_b = __template(['<script type="application/json" data-ct-data>', "<\/script>"])), unescapeHTML(modTipData))} </div> </div> ${!modSinglePoint && renderTemplate`<div class="dgo-chart-dates" data-astro-cid-del4q7zi> ${modAxisLabels.map((l, i) => renderTemplate`<span${addAttribute({ first: i === 0, last: i === modAxisLabels.length - 1 }, "class:list")}${addAttribute(i > 0 && i < modAxisLabels.length - 1 ? `left:${l.pct}%` : void 0, "style")} data-astro-cid-del4q7zi> ${l.text} </span>`)} </div>`} ${modSinglePoint && renderTemplate`<p class="dgo-chart-note" data-astro-cid-del4q7zi>${dt("Just one day tracked so far, the line fills in as more days come in.")}</p>`} <div class="dgo-legend" data-astro-cid-del4q7zi> <span data-astro-cid-del4q7zi><i class="dgo-dot dgo-dot-bans" data-astro-cid-del4q7zi></i>${dt("Bans")}</span> <span data-astro-cid-del4q7zi><i class="dgo-dot dgo-dot-other" data-astro-cid-del4q7zi></i>${dt("Other actions (kicks, mutes, warns)")}</span> </div> </div>`}${renderComponent($$result3, "DashChartTip", $$DashChartTip, { "data-astro-cid-del4q7zi": true })} <div class="dgo-top-grid" data-astro-cid-del4q7zi> <div class="dgo-top" data-astro-cid-del4q7zi> <div class="dgo-top-head" data-astro-cid-del4q7zi>${dt("Top message channels")}</div> <div class="dgo-top-cols" data-astro-cid-del4q7zi> <span data-astro-cid-del4q7zi>${dt("Channel")}</span><span data-astro-cid-del4q7zi>${dt("Messages")}</span><span data-astro-cid-del4q7zi>${dt("% of activity")}</span><span data-astro-cid-del4q7zi>${dt("Change")}</span> </div> ${activity.topMessageChannels.map((c) => renderTemplate`<div class="dgo-top-row" data-astro-cid-del4q7zi> <span class="dgo-top-name" data-astro-cid-del4q7zi><span class="dgo-ch-pill" data-astro-cid-del4q7zi><span class="dgo-ch-hash" data-astro-cid-del4q7zi>#</span>${c.name}</span></span> <span class="dgo-top-count" data-astro-cid-del4q7zi>${c.count.toLocaleString(numLocale)}</span> <span class="dgo-top-pct" data-astro-cid-del4q7zi>${c.pct.toFixed(0)}%</span> <span${addAttribute(["dgo-top-delta", { down: (c.deltaPct ?? 0) < 0, flat: c.deltaPct === null }], "class:list")} data-astro-cid-del4q7zi>${fmtDelta(c.deltaPct) ?? dt("new")}</span> </div>`)} </div> <div class="dgo-top" data-astro-cid-del4q7zi> <div class="dgo-top-head" data-astro-cid-del4q7zi>${dt("Top reaction channels")}</div> <div class="dgo-top-cols" data-astro-cid-del4q7zi> <span data-astro-cid-del4q7zi>${dt("Channel")}</span><span data-astro-cid-del4q7zi>${dt("Reactions")}</span><span data-astro-cid-del4q7zi>${dt("% of activity")}</span><span data-astro-cid-del4q7zi>${dt("Change")}</span> </div> ${activity.topReactionChannels.map((c) => renderTemplate`<div class="dgo-top-row" data-astro-cid-del4q7zi> <span class="dgo-top-name" data-astro-cid-del4q7zi><span class="dgo-ch-pill" data-astro-cid-del4q7zi><span class="dgo-ch-hash" data-astro-cid-del4q7zi>#</span>${c.name}</span></span> <span class="dgo-top-count" data-astro-cid-del4q7zi>${c.count.toLocaleString(numLocale)}</span> <span class="dgo-top-pct" data-astro-cid-del4q7zi>${c.pct.toFixed(0)}%</span> <span${addAttribute(["dgo-top-delta", { down: (c.deltaPct ?? 0) < 0, flat: c.deltaPct === null }], "class:list")} data-astro-cid-del4q7zi>${fmtDelta(c.deltaPct) ?? dt("new")}</span> </div>`)} </div> </div> ` })}`, renderComponent($$result2, "DashQuickAccess", $$DashQuickAccess, { "guildId": guildId, "quick": quick, "data-astro-cid-del4q7zi": true })) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashGuildOverview.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Overview = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Overview;
  const dt = makeT(getDashLang(Astro2));
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  let pageError = null;
  let guild = null;
  let stats = [];
  let modules = [];
  let quick = { statuses: {}, switches: {} };
  let activity = null;
  let moderation = { hasData: false, points: [], totals: { bans: 0, other: 0 }, totalActions: 0, deltaPct: null };
  try {
    let count = function(res) {
      return Number(res.headers.get("content-range")?.split("/")[1] ?? "0");
    }, countValue = function(value) {
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    }, sum = function(rows, key) {
      return rows.reduce((a, r) => a + r[key], 0);
    }, channelName = function(channelId) {
      return channels.find((c) => c.id === channelId)?.name ?? channelId;
    }, channelColor = function(channelId) {
      let hash = 0;
      for (let i = 0; i < channelId.length; i++) hash = hash * 31 + channelId.charCodeAt(i) >>> 0;
      return CHANNEL_COLORS[hash % CHANNEL_COLORS.length];
    }, topChannels = function(key, total) {
      const byChannel = /* @__PURE__ */ new Map();
      for (const r of currentRows) byChannel.set(r.channel_id, (byChannel.get(r.channel_id) ?? 0) + r[key]);
      const byChannelPrev = /* @__PURE__ */ new Map();
      for (const r of previousRows) byChannelPrev.set(r.channel_id, (byChannelPrev.get(r.channel_id) ?? 0) + r[key]);
      return [...byChannel.entries()].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([channelId, v]) => {
        const prev = byChannelPrev.get(channelId) ?? 0;
        return {
          name: channelName(channelId),
          color: channelColor(channelId),
          count: v,
          pct: total > 0 ? v / total * 100 : 0,
          deltaPct: prev > 0 ? (v - prev) / prev * 100 : null
        };
      });
    }, kindFor = function(t) {
      return t === "ban" || t === "tempban" ? "bans" : "other";
    }, modTotal = function(rows, kind) {
      return rows.reduce((a, r) => a + (kindFor(r.type) === kind ? r.n : 0), 0);
    };
    const [guildData, channelsRes] = await Promise.all([
      getGuildDetails(id, botToken),
      getGuildList(Astro2, id, botToken, "channels")
    ]);
    if (!guildData) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
    guild = guildData;
    const quickPromise = loadModuleStatuses(apiUrl, apiKey, id).catch(() => ({ statuses: {}, switches: {} }));
    const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}` };
    const countHeaders = { ...apiHeaders, Prefer: "count=exact" };
    async function readRows(res, resource) {
      if (!res.ok) {
        console.error(`[dashboard] ${resource} request failed for guild ${id}: ${res.status} ${res.statusText}`);
        return [];
      }
      try {
        const payload = await res.json();
        return Array.isArray(payload) ? payload : [];
      } catch (error) {
        console.error(`[dashboard] ${resource} returned invalid JSON for guild ${id}:`, error);
        return [];
      }
    }
    const range = parseOverviewRange(Astro2.url.searchParams.get("range"));
    const { days, currentCutoff, previousCutoff, keys: expectedKeys } = overviewDays(/* @__PURE__ */ new Date(), range);
    const [
      guildsRes,
      automodRes,
      antinukeRes,
      levelRes,
      ticketCatRes,
      giveawayActiveRes,
      logEntriesRes,
      commandsRes,
      respondersRes,
      reportRes,
      welcomeRes,
      verificationRes,
      activityRes,
      modActionsRes
    ] = await runBatched([
      () => fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${id}&select=prefix,mute_role_id`, { headers: apiHeaders }),
      () => fetch(`${apiUrl}/rest/v1/automod_config?guild_id=eq.${id}&select=word_filter_enabled,anti_spam_enabled,anti_raid_enabled,anti_alt_enabled`, { headers: apiHeaders }),
      () => fetch(`${apiUrl}/rest/v1/antinuke_config?guild_id=eq.${id}&select=enabled`, { headers: apiHeaders }),
      () => fetch(`${apiUrl}/rest/v1/level_config?guild_id=eq.${id}&select=enabled`, { headers: apiHeaders }),
      () => fetch(`${apiUrl}/rest/v1/ticket_categories?guild_id=eq.${id}&select=id`, { headers: countHeaders }),
      () => fetch(`${apiUrl}/rest/v1/giveaways?guild_id=eq.${id}&ended=eq.false&select=id`, { headers: countHeaders }),
      () => fetch(`${apiUrl}/rest/v1/log_entries?guild_id=eq.${id}&select=event`, { headers: countHeaders }),
      () => fetch(`${apiUrl}/rest/v1/custom_commands?guild_id=eq.${id}&select=id`, { headers: countHeaders }),
      () => fetch(`${apiUrl}/rest/v1/auto_responders?guild_id=eq.${id}&select=id`, { headers: countHeaders }),
      () => fetch(`${apiUrl}/rest/v1/report_config?guild_id=eq.${id}&select=enabled`, { headers: apiHeaders }),
      () => fetch(`${apiUrl}/rest/v1/member_events_config?guild_id=eq.${id}&select=welcome_channel_id`, { headers: apiHeaders }),
      () => fetch(`${apiUrl}/rest/v1/verification_config?guild_id=eq.${id}&select=enabled`, { headers: apiHeaders }),
      () => fetch(`${apiUrl}/rest/v1/activity_stats?guild_id=eq.${id}&day=gte.${previousCutoff}&select=channel_id,day,messages,reactions,voice_seconds`, { headers: apiHeaders }),
      // The case history is counted by the database when the site can reach it (one row per day and type instead of one per case).
      () => (directQuery ? directQuery(`SELECT "type", to_char("created_at" AT TIME ZONE $3, 'YYYY-MM-DD') AS "day", COUNT(*)::int AS "n" FROM "public"."mod_actions" WHERE "guild_id" = $1 AND "created_at" >= $2 GROUP BY 1, 2`, [id, dayStartInstant(previousCutoff), BOT_TIME_ZONE]) : Promise.resolve(null)).then((rows) => rows ?? fetch(`${apiUrl}/rest/v1/mod_actions?guild_id=eq.${id}&created_at=gte.${dayStartInstant(previousCutoff)}&select=type,created_at`, { headers: apiHeaders }))
    ], 6);
    const channels = channelsRes.ok ? await channelsRes.json() : [];
    const textChannels = channels.filter((c) => c.type === 0).length;
    const voiceChannels = channels.filter((c) => c.type === 2).length;
    const categories = channels.filter((c) => c.type === 4).length;
    stats = [
      { icon: "ph:users-three-fill", label: dt("Members"), value: (guild.approximate_member_count ?? 0).toLocaleString(), n: Number(guild.approximate_member_count ?? 0), color: "#8399ff" },
      { icon: "ph:shield-fill", label: dt("Roles"), value: String(guild.roles?.length ?? 0), n: Number(guild.roles?.length ?? 0), color: "#c792ea" },
      { icon: "ph:hash", label: dt("Channels"), value: String(channels.length), n: channels.length, color: "#5eead4" },
      { icon: "ph:chat-circle-text-fill", label: dt("Text channels"), value: String(textChannels), n: textChannels, color: "#7dd3fc" },
      { icon: "ph:speaker-high-fill", label: dt("Voice channels"), value: String(voiceChannels), n: voiceChannels, color: "#f78fb3" },
      { icon: "ph:folder-fill", label: dt("Categories"), value: String(categories), n: categories, color: "#ffb86c" },
      { icon: "ph:smiley-fill", label: dt("Emojis"), value: String(guild.emojis?.length ?? 0), n: Number(guild.emojis?.length ?? 0), color: "#fed53c" },
      { icon: "ph:sparkle-fill", label: dt("Boosts"), value: String(guild.premium_subscription_count ?? 0), n: Number(guild.premium_subscription_count ?? 0), color: "#fe6465" },
      { icon: "ph:trophy-fill", label: dt("Boost level"), value: dt("Level {a}", { a: guild.premium_tier ?? 0 }), n: Number(guild.premium_tier ?? 0), color: "#a5ea7a" }
    ];
    const g = (await readRows(guildsRes, "guilds"))[0] ?? {};
    const am = (await readRows(automodRes, "automod_config"))[0] ?? {};
    const an = (await readRows(antinukeRes, "antinuke_config"))[0] ?? {};
    const lv = (await readRows(levelRes, "level_config"))[0] ?? {};
    const rp = (await readRows(reportRes, "report_config"))[0] ?? {};
    const we = (await readRows(welcomeRes, "member_events_config"))[0] ?? {};
    const vf = (await readRows(verificationRes, "verification_config"))[0] ?? {};
    const automodOn = Boolean(am.word_filter_enabled || am.anti_spam_enabled || am.anti_raid_enabled || am.anti_alt_enabled);
    const ticketTypes = count(ticketCatRes);
    const giveawaysActive = count(giveawayActiveRes);
    const logRoutes = count(logEntriesRes);
    const commandCount = count(commandsRes);
    const responderCount = count(respondersRes);
    modules = [
      {
        title: dt("General"),
        href: `/dash/guild/${id}/general`,
        items: [
          { label: dt("Prefix"), value: g.prefix ?? "!", ok: true },
          { label: dt("Mute role"), value: g.mute_role_id ? dt("set") : dt("off"), ok: Boolean(g.mute_role_id) }
        ]
      },
      {
        title: dt("Moderation"),
        href: `/dash/guild/${id}/moderation`,
        items: [
          { label: dt("Automod"), value: automodOn ? dt("on") : dt("off"), ok: automodOn },
          { label: dt("Anti-nuke"), value: an.enabled ? dt("on") : dt("off"), ok: Boolean(an.enabled) }
        ]
      },
      {
        title: dt("Leveling"),
        href: `/dash/guild/${id}/leveling`,
        items: [{ label: dt("Status"), value: lv.enabled ? dt("on") : dt("off"), ok: Boolean(lv.enabled) }]
      },
      {
        title: dt("Tickets"),
        href: `/dash/guild/${id}/tickets`,
        items: [{ label: dt("Support types"), value: String(ticketTypes), ok: ticketTypes > 0 }]
      },
      {
        title: dt("Giveaways"),
        href: `/dash/guild/${id}/giveaways`,
        items: [{ label: dt("Running now"), value: String(giveawaysActive), ok: giveawaysActive > 0 }]
      },
      {
        title: dt("Automation"),
        href: `/dash/guild/${id}/automation`,
        items: [
          { label: dt("Custom commands"), value: String(commandCount), ok: commandCount > 0 },
          { label: dt("Autoresponders"), value: String(responderCount), ok: responderCount > 0 }
        ]
      },
      {
        title: dt("Logging"),
        href: `/dash/guild/${id}/logging`,
        items: [{ label: dt("Routed events"), value: String(logRoutes), ok: logRoutes > 0 }]
      },
      {
        title: dt("Community"),
        href: `/dash/guild/${id}/community`,
        items: [{ label: dt("Reports"), value: rp.enabled ? dt("on") : dt("off"), ok: Boolean(rp.enabled) }]
      },
      {
        title: dt("Onboarding"),
        href: `/dash/guild/${id}/welcome`,
        items: [
          { label: dt("Welcome"), value: we.welcome_channel_id ? dt("on") : dt("off"), ok: Boolean(we.welcome_channel_id) },
          { label: dt("Verification"), value: vf.enabled ? dt("on") : dt("off"), ok: Boolean(vf.enabled) }
        ]
      }
    ];
    const activityRows = (await readRows(activityRes, "activity_stats")).map((row) => ({
      channel_id: String(row.channel_id ?? ""),
      day: String(row.day ?? "").slice(0, 10),
      messages: countValue(row.messages),
      reactions: countValue(row.reactions),
      voice_seconds: countValue(row.voice_seconds)
    })).filter((row) => row.channel_id.length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(row.day));
    const currentRows = activityRows.filter((r) => r.day >= currentCutoff);
    const previousRows = activityRows.filter((r) => r.day < currentCutoff);
    const totalMessages = sum(currentRows, "messages");
    const totalReactions = sum(currentRows, "reactions");
    const totalVoiceSeconds = Math.round(sum(currentRows, "voice_seconds"));
    const activeChannels = new Set(currentRows.filter((r) => r.messages > 0 || r.reactions > 0).map((r) => r.channel_id)).size;
    const hasData = totalMessages > 0 || totalReactions > 0 || sum(currentRows, "voice_seconds") > 0;
    const prevMessages = sum(previousRows, "messages");
    const prevReactions = sum(previousRows, "reactions");
    const messagesDeltaPct = prevMessages > 0 ? (totalMessages - prevMessages) / prevMessages * 100 : null;
    const reactionsDeltaPct = prevReactions > 0 ? (totalReactions - prevReactions) / prevReactions * 100 : null;
    const series = ["messages", "reactions", "voice_seconds"];
    const bucketList = fillAxis(expectedKeys, bucketSums(currentRows, range, series), series);
    const points = bucketList.map(({ label, messages, reactions }) => ({ label, messages, reactions }));
    const messagesSpark = bucketList.map((b) => b.messages);
    const reactionsSpark = bucketList.map((b) => b.reactions);
    const voiceSpark = bucketList.map((b) => b.voice_seconds);
    const CHANNEL_COLORS = ["#8399ff", "#f78fb3", "#5eead4", "#ffb86c", "#c792ea", "#7dd3fc", "#fed53c", "#fe6465", "#a5ea7a"];
    activity = {
      range,
      hasData,
      points,
      messagesSpark,
      reactionsSpark,
      voiceSpark,
      totalMessages,
      totalReactions,
      totalVoiceSeconds,
      activeChannels,
      messagesDeltaPct,
      reactionsDeltaPct,
      topMessageChannels: topChannels("messages", totalMessages),
      topReactionChannels: topChannels("reactions", totalReactions)
    };
    const modSource = Array.isArray(modActionsRes) ? modActionsRes.map((row) => ({ type: row.type, day: row.day, n: row.n })) : await readRows(modActionsRes, "mod_actions");
    const modRows = modSource.map((row) => ({
      type: String(row.type ?? ""),
      day: rowDay(row),
      // How many cases the row stands for: one per case, or the count of a day when the database counted them.
      n: Number("n" in row ? row.n : 1) || 0
    })).filter((row) => row.type.length > 0 && /^\d{4}-\d{2}-\d{2}$/.test(row.day));
    const modCurrentRows = modRows.filter((r) => r.day >= currentCutoff);
    const modPreviousRows = modRows.filter((r) => r.day < currentCutoff);
    const modBuckets = /* @__PURE__ */ new Map();
    for (const r of modCurrentRows) {
      const kind = kindFor(r.type);
      const key = bucketKey(r.day, range);
      const b = modBuckets.get(key) ?? { bans: 0, other: 0 };
      b[kind] += r.n;
      modBuckets.set(key, b);
    }
    const modPoints = [...modBuckets.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([label, v]) => ({ label, ...v }));
    const modTotals = { bans: modTotal(modCurrentRows, "bans"), other: modTotal(modCurrentRows, "other") };
    const modPrevTotals = { bans: modTotal(modPreviousRows, "bans"), other: modTotal(modPreviousRows, "other") };
    const modTotalActions = modTotals.bans + modTotals.other;
    const modPrevTotalActions = modPrevTotals.bans + modPrevTotals.other;
    const modDeltaPct = modPrevTotalActions > 0 ? (modTotalActions - modPrevTotalActions) / modPrevTotalActions * 100 : null;
    moderation = {
      hasData: modTotalActions > 0,
      points: modPoints,
      totals: modTotals,
      totalActions: modTotalActions,
      deltaPct: modDeltaPct
    };
    quick = await quickPromise;
  } catch (err) {
    pageError = err?.stack || err?.message || String(err);
    console.error("overview.astro failed for guild", id, err);
  }
  return renderTemplate`${pageError ? renderTemplate`${maybeRenderHead()}<pre style="white-space:pre-wrap;padding:2rem;color:#f88;background:#111;font-size:12px;line-height:1.5;">${pageError}</pre>` : renderTemplate`${renderComponent($$result, "DashGuildOverview", $$DashGuildOverview, { "user": session, "guildId": id, "guildName": guild.name, "guildIcon": guildIconUrl(guild) ?? "/assets/mascot-icon.webp", "stats": stats, "modules": modules, "quick": quick, "activity": activity, "moderation": moderation })}`}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/overview.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/overview.astro";
const $$url = "/dash/guild/[id]/overview";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Overview,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
