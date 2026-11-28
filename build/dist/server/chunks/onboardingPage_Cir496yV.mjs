import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, b as addAttribute, m as maybeRenderHead, F as Fragment, u as unescapeHTML } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$SilentMentionHint } from './SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout, a as $$DashBotWait } from './DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$VariableHelp } from './VariableHelp_CRlEe6IW.mjs';
import { $ as $$SelectSource } from './SelectSource_Dp8aydFk.mjs';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                        */
import { $ as $$SelectChosen } from './SelectChosen_B0lELVHS.mjs';
import { $ as $$DashAcData } from './DashAcData_BviQOYRU.mjs';
import { $ as $$DashSettingsKit } from './DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from './DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from './DashStatTiles_C8IRuvbo.mjs';
import { w as withPostNotes, p as postableChannel } from './channelPost_BevYrtSt.mjs';
import { a as getGuildSession } from './dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from './env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from './discord_CxeBz2tv.mjs';
import { r as runBatched } from './concurrency_PoJGtmqS.mjs';
import { q as callPettoVerification } from './pettoBotApi_B4wpoZhN.mjs';

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$ObMoreMessages = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ObMoreMessages;
  const { kind, rows, templates, max } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const words = { remove: dt("Remove this message"), full: dt("There is no room for more messages here.") };
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="mm"', "", "", ' data-astro-cid-jjtezegs> <div class="mm-head" data-astro-cid-jjtezegs> <b data-astro-cid-jjtezegs>', '</b> <span class="sx-tag" data-mm-count data-astro-cid-jjtezegs>', '</span> </div> <p class="sx-hint" data-astro-cid-jjtezegs>', '</p> <input type="hidden"', ' value="0" data-mm-touch data-astro-cid-jjtezegs> <div class="mm-list" data-mm-list data-astro-cid-jjtezegs> ', ' </div> <template data-mm-template data-astro-cid-jjtezegs> <div class="mm-row" data-mm-row data-astro-cid-jjtezegs> <textarea class="dgl-autogrow" rows="2"', ' maxlength="300"', "", " data-astro-cid-jjtezegs></textarea> ", ' <button type="button" class="sx-iconbtn" data-mm-remove', "", " data-astro-cid-jjtezegs>", '</button> </div> </template> <button type="button" class="btn btn-ghost btn-sm mm-add" data-mm-add data-astro-cid-jjtezegs>', "", "</button> </div> <script>\n  // Adds and removes rows. Bound once for the whole document. A counter field changes with every add or remove, so the page notices that the form has changed (a removed row\n  // leaves no field behind to compare).\n  if (!window.__mmBound) {\n    window.__mmBound = true;\n    var mmUpdate = function (box) {\n      var rows = box.querySelectorAll('[data-mm-list] [data-mm-row]').length;\n      var max = Number(box.getAttribute('data-mm-max')) || 24;\n      var count = box.querySelector('[data-mm-count]');\n      if (count) count.textContent = count.textContent.replace(/\\d+ of \\d+/, (rows + 1) + ' of ' + (max + 1));\n      var add = box.querySelector('[data-mm-add]');\n      if (add) add.disabled = rows >= max;\n      var touch = box.querySelector('[data-mm-touch]');\n      if (touch) { touch.value = String(Number(touch.value) + 1); touch.dispatchEvent(new Event('input', { bubbles: true })); touch.dispatchEvent(new Event('change', { bubbles: true })); }\n    };\n    document.addEventListener('click', function (event) {\n      var target = event.target && event.target.closest ? event.target : null;\n      var add = target && target.closest('[data-mm-add]');\n      var remove = target && target.closest('[data-mm-remove]');\n      if (!add && !remove) return;\n      var box = (add || remove).closest('[data-mm]');\n      if (!box) return;\n      if (add) {\n        if (add.disabled) return;\n        var template = box.querySelector('[data-mm-template]');\n        var list = box.querySelector('[data-mm-list]');\n        if (!template || !list) return;\n        var row = template.content.firstElementChild.cloneNode(true);\n        list.appendChild(row);\n        mmUpdate(box);\n        var field = row.querySelector('textarea'); if (field) field.focus({ preventScroll: false });\n      } else {\n        var row2 = remove.closest('[data-mm-row]'); if (row2) row2.remove();\n        mmUpdate(box);\n      }\n    });\n  }\n<\/script> "], ["", '<div class="mm"', "", "", ' data-astro-cid-jjtezegs> <div class="mm-head" data-astro-cid-jjtezegs> <b data-astro-cid-jjtezegs>', '</b> <span class="sx-tag" data-mm-count data-astro-cid-jjtezegs>', '</span> </div> <p class="sx-hint" data-astro-cid-jjtezegs>', '</p> <input type="hidden"', ' value="0" data-mm-touch data-astro-cid-jjtezegs> <div class="mm-list" data-mm-list data-astro-cid-jjtezegs> ', ' </div> <template data-mm-template data-astro-cid-jjtezegs> <div class="mm-row" data-mm-row data-astro-cid-jjtezegs> <textarea class="dgl-autogrow" rows="2"', ' maxlength="300"', "", " data-astro-cid-jjtezegs></textarea> ", ' <button type="button" class="sx-iconbtn" data-mm-remove', "", " data-astro-cid-jjtezegs>", '</button> </div> </template> <button type="button" class="btn btn-ghost btn-sm mm-add" data-mm-add data-astro-cid-jjtezegs>', "", "</button> </div> <script>\n  // Adds and removes rows. Bound once for the whole document. A counter field changes with every add or remove, so the page notices that the form has changed (a removed row\n  // leaves no field behind to compare).\n  if (!window.__mmBound) {\n    window.__mmBound = true;\n    var mmUpdate = function (box) {\n      var rows = box.querySelectorAll('[data-mm-list] [data-mm-row]').length;\n      var max = Number(box.getAttribute('data-mm-max')) || 24;\n      var count = box.querySelector('[data-mm-count]');\n      if (count) count.textContent = count.textContent.replace(/\\\\d+ of \\\\d+/, (rows + 1) + ' of ' + (max + 1));\n      var add = box.querySelector('[data-mm-add]');\n      if (add) add.disabled = rows >= max;\n      var touch = box.querySelector('[data-mm-touch]');\n      if (touch) { touch.value = String(Number(touch.value) + 1); touch.dispatchEvent(new Event('input', { bubbles: true })); touch.dispatchEvent(new Event('change', { bubbles: true })); }\n    };\n    document.addEventListener('click', function (event) {\n      var target = event.target && event.target.closest ? event.target : null;\n      var add = target && target.closest('[data-mm-add]');\n      var remove = target && target.closest('[data-mm-remove]');\n      if (!add && !remove) return;\n      var box = (add || remove).closest('[data-mm]');\n      if (!box) return;\n      if (add) {\n        if (add.disabled) return;\n        var template = box.querySelector('[data-mm-template]');\n        var list = box.querySelector('[data-mm-list]');\n        if (!template || !list) return;\n        var row = template.content.firstElementChild.cloneNode(true);\n        list.appendChild(row);\n        mmUpdate(box);\n        var field = row.querySelector('textarea'); if (field) field.focus({ preventScroll: false });\n      } else {\n        var row2 = remove.closest('[data-mm-row]'); if (row2) row2.remove();\n        mmUpdate(box);\n      }\n    });\n  }\n<\/script> "])), maybeRenderHead(), addAttribute(kind, "data-mm"), addAttribute(max, "data-mm-max"), addAttribute(JSON.stringify(words), "data-mm-words"), dt("More messages"), dt("{n} of {m}", { n: rows.length + 1, m: max + 1 }), dt("Add more and Petto picks one of them at random each time, never the same twice in a row."), addAttribute(`variants_touch_${kind}`, "name"), rows.map((row) => renderTemplate`<div class="mm-row" data-mm-row data-astro-cid-jjtezegs> <textarea class="dgl-autogrow" rows="2"${addAttribute(`variant_${kind}_message`, "name")} maxlength="300"${addAttribute(dt("Another message"), "placeholder")}${addAttribute(dt("Another message"), "aria-label")} data-astro-cid-jjtezegs>${row.message}</textarea> ${templates.length > 0 && renderTemplate`<select${addAttribute(`variant_${kind}_embed`, "name")}${addAttribute(dt("Or use an embed template"), "aria-label")} data-astro-cid-jjtezegs> <option value="" data-astro-cid-jjtezegs>${dt("No template, use message text above")}</option> ${templates.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === row.template, "selected")} data-astro-cid-jjtezegs>${name}</option>`)} </select>`} <button type="button" class="sx-iconbtn" data-mm-remove${addAttribute(dt("Remove this message"), "aria-label")}${addAttribute(dt("Remove this message"), "title")} data-astro-cid-jjtezegs>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-jjtezegs": true })}</button> </div>`), addAttribute(`variant_${kind}_message`, "name"), addAttribute(dt("Another message"), "placeholder"), addAttribute(dt("Another message"), "aria-label"), templates.length > 0 && renderTemplate`<select${addAttribute(`variant_${kind}_embed`, "name")}${addAttribute(dt("Or use an embed template"), "aria-label")} data-astro-cid-jjtezegs> <option value="" data-astro-cid-jjtezegs>${dt("No template, use message text above")}</option> ${templates.map((name) => renderTemplate`<option${addAttribute(name, "value")} data-astro-cid-jjtezegs>${name}</option>`)} </select>`, addAttribute(dt("Remove this message"), "aria-label"), addAttribute(dt("Remove this message"), "title"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-jjtezegs": true }), renderComponent($$result, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-jjtezegs": true }), dt("Add another message"));
}, "/home/runner/work/petto-web/petto-web/src/components/ObMoreMessages.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b;
const $$Astro = createAstro("https://petto.sbs");
const $$DashOnboarding = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashOnboarding;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const dth = makeT(dashLang, true);
  const { user, guildId, guildName, guildIcon, memberEvents, verification, bump, dmJoin, pingOnJoin, joinRoles, roles, embedTemplateNames, saved, problem, view = "messages", variants = { welcome: [], leave: [], boost: [] }, variantsReady = false } = Astro2.props;
  const MAX_MORE = 24;
  const VIEWS = {
    messages: { active: "welcome-messages", title: "Welcome messages" },
    dm: { active: "welcome-dm", title: "DM on join" },
    ping: { active: "welcome-ping", title: "Ping on join" },
    verification: { active: "verification", title: "Verification" },
    "join-roles": { active: "join-roles", title: "Join roles" },
    bump: { active: "bump", title: "Bump" }
  };
  const meta = VIEWS[view] ?? VIEWS.messages;
  const channels = withPostNotes(dt, Astro2.props.channels);
  const closedPings = channels.filter((c) => c.note && pingOnJoin.channelIds.includes(c.id));
  function roleName(id) {
    return roles.find((r) => r.id === id)?.name ?? id;
  }
  const pingRowsJson = JSON.stringify(channels.map((c) => [c.id, c.name, pingOnJoin.channelIds.includes(c.id) ? 1 : 0, pingOnJoin.delaysSeconds[c.id] ?? 5, c.note ?? ""])).replace(/</g, "\\u003c");
  function targetLabel(target) {
    return target === "humans" ? dt("Humans only") : target === "bots" ? dt("Bots only") : dt("Everyone");
  }
  const hasTemplates = embedTemplateNames.length > 0;
  const messagesOn = [
    Boolean(memberEvents.welcomeChannelId),
    Boolean(memberEvents.secondEnabled && memberEvents.secondChannelId),
    Boolean(memberEvents.leaveChannelId),
    Boolean(memberEvents.boostChannelId),
    Boolean(dmJoin.message || dmJoin.embedTemplate)
  ].filter(Boolean).length;
  Boolean(bump.channelId);
  const checklist = [
    { done: Boolean(verification.unverifiedRoleId), label: dt("A role while unverified") },
    { done: Boolean(verification.verifiedRoleId), label: dt("A role once verified") },
    { done: Boolean(verification.panelChannelId), label: dt("A verification channel") },
    { done: verification.enabled, label: dt("Verification turned on") }
  ];
  const checklistDone = checklist.filter((item) => item.done).length;
  const methods = [
    ["turnstile", dt("Cloudflare check"), dt("The usual one"), "ph:shield-check-fill"],
    ["letters", dt("Letters in a picture"), dt("Type the letters of a picture"), "ph:image-fill"],
    ["both", dt("Both checks"), dt("The two, one after the other"), "ph:seal-check-fill"],
    ["discord", dt("Letters inside Discord (no link)"), dt("A button in the DM, no link"), "ph:chat-circle-dots-fill"],
    ["email", dt("Email code (no captcha)"), dt("A code sent to their email"), "ph:envelope-simple-fill"]
  ];
  const checkModes = [["off", dt("Off")], ["warn", dt("Tell the staff")], ["block", dt("Block")]];
  const checkRows = [
    ["tor", "ph:detective-fill", dt("Tor network"), dt("Members connecting through the Tor network."), verification.checks.tor],
    ["alt", "ph:users-three-fill", dt("Alt accounts"), dt("The same connection or email as another member, or as a banned one. Only coded fingerprints are kept, for 90 days."), verification.checks.alt]
  ];
  const targets = [["all", dt("Everyone")], ["humans", dt("Humans only")], ["bots", dt("Bots only")]];
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": meta.active, "pageTitle": meta.title, "data-astro-cid-xclon3ey": true }, { "default": ($$result2) => renderTemplate(_b || (_b = __template([" ", " ", '<div class="sx-page ob" data-astro-cid-xclon3ey> <h1 data-astro-cid-xclon3ey>', "</h1> ", " ", " ", " ", " ", ' <div class="ob-panels" id="ob-panels" data-astro-cid-xclon3ey> ', " ", " ", " ", " ", " ", " </div> ", " ", " </div> ", ` <script>
    // The verification card: set it up, post the panel and switch it on or off right away, without the Save button. The bot answers within
    // a moment; a long one (setting it up edits every channel of the server) comes back running, and the card shows how far it is by
    // asking verification-status every moment until it ends, then says the result and draws the page again. Leaving the page stops asking;
    // coming back to it while the setup still runs picks it up again (the job is remembered for this tab).
    (function () {
      var msg = document.getElementById('ob-vf-msg');
      if (!msg) return;
      var guild = location.pathname.replace(/^\\/(es|pt-br)(?=\\/)/i, '').split('/')[3];
      var progress = document.getElementById('ob-vf-progress');
      var bar = progress ? progress.querySelector('.ob-vf-bar') : null;
      var fill = bar ? bar.querySelector('span') : null;
      var step = progress ? progress.querySelector('.ob-vf-step') : null;
      var warn = document.getElementById('ob-vf-warn');
      var toggle = document.querySelector('[data-vf-switch]');
      var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-vf-action]'));
      var words = { working: msg.getAttribute('data-working') || '', failed: msg.getAttribute('data-failed') || '', lost: msg.getAttribute('data-lost') || '' };
      var KEY = 'ob-vf-job:' + guild;
      var following = null;
      function remember(id) { try { if (id) sessionStorage.setItem(KEY, id); else sessionStorage.removeItem(KEY); } catch (e) {} }
      function remembered() { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } }
      function say(text, ok) { msg.hidden = false; msg.textContent = text; msg.className = 'ob-vf-msg ' + (ok ? 'ok' : 'bad'); }
      function busy(on) {
        buttons.forEach(function (button) { button.disabled = on || button.hasAttribute('data-vf-off'); button.classList.toggle('ob-busy', on); });
        if (toggle) toggle.disabled = on;
      }
      function stepText(job) {
        if (!progress) return '';
        if (job.phase === 'channels' && job.total) return (progress.getAttribute('data-channels') || '').replace('{done}', job.done).replace('{total}', job.total);
        return progress.getAttribute('data-' + (job.phase === 'roles' || job.phase === 'panel' ? job.phase : 'starting')) || '';
      }
      function showJob(job) {
        if (!progress) return;
        progress.hidden = false;
        var percent = Math.max(job.status === 'running' ? 4 : 100, Math.min(100, Number(job.percent) || 0));
        if (fill) fill.style.width = percent + '%';
        if (bar) bar.setAttribute('aria-valuenow', String(percent));
        if (step) step.textContent = job.status === 'running' ? stepText(job) : '';
        msg.hidden = true;
      }
      // The bot can be away for some seconds after an update: the shared wait (scripts/bot-wait.js) asks again by itself before this gives up.
      function status() {
        return window.__dglBotWait.request('/dash/guild/' + guild + '/verification-status', null, { method: 'GET', idempotent: true, limit: 9000 })
          .then(function (r) { return r.data && !r.unreachable ? r.data : { ok: false }; });
      }
      function showLink(link) {
        if (!warn || !link) return;
        if (link.ok) { warn.hidden = true; return; }
        var text = warn.getAttribute('data-' + (link.problem || 'missing')) || warn.getAttribute('data-missing') || '';
        if (link.lettersInstead) text += ' ' + (warn.getAttribute('data-letters') || '');
        warn.textContent = text; warn.hidden = false;
      }
      function finish(job, action) {
        following = null; remember(null);
        if (job) showJob(job);
        busy(false);
        setTimeout(function () { if (progress && !following) progress.hidden = true; }, 900);
        say((job && job.message) || (job ? words.failed : words.lost), !!(job && job.ok));
        if (toggle && action === 'enable' && !(job && job.ok)) toggle.checked = false;
        // The roles, the channel and the switch changed: the page is read again (only the content, as the menu does).
        if (job && job.ok && (action === 'setup' || action === 'enable')) setTimeout(function () { if (window.dglRefreshPage) window.dglRefreshPage(true); else location.reload(); }, 900);
      }
      function follow(job) {
        if (!job) return;
        remember(job.id);
        showJob(job);
        busy(true);
        if (following) return;
        following = job.id;
        var misses = 0;
        var action = job.action;
        function tick() {
          // Another page was opened from the menu: this card is gone, stop asking.
          if (!msg.isConnected) { following = null; return; }
          status().then(function (data) {
            if (!msg.isConnected) { following = null; return; }
            if (data && data.link) showLink(data.link);
            var current = data && data.job;
            if (!data || !data.ok) { misses += 1; if (misses > 6) finish(null, action); else setTimeout(tick, 2500); return; }
            misses = 0;
            if (!current || (current.id !== following && current.status !== 'running')) { finish(null, action); return; }
            action = current.action || action;
            if (current.status === 'running') { showJob(current); setTimeout(tick, 1200); return; }
            finish(current, action);
          });
        }
        setTimeout(tick, 1000);
      }
      // The line of the card says what is going on while Petto answers (and that it is trying again); a bot that stays away says so, with Try again.
      function call(action, extra) {
        return window.__dglBotWait.request('/dash/guild/' + guild + '/verification-api', Object.assign({ action: action }, extra || {}), { onStatus: function (words) { say(words, true); }, limit: 12000 })
          .then(function (r) { return r.unreachable ? { ok: false, unreachable: true } : r.data && typeof r.data === 'object' ? r.data : { ok: false, message: words.failed }; });
      }
      function answer(result, action, again) {
        if (result && result.ok && result.status === 'running' && result.job) { follow(result.job); return; }
        busy(false);
        if (result && result.unreachable) {
          if (toggle && action === 'enable') toggle.checked = false;
          if (toggle && action === 'disable') toggle.checked = true;
          say(window.__dglBotWait.text('notAnswering'), false);
          var retry = document.createElement('button');
          retry.type = 'button'; retry.className = 'btn btn-ghost btn-sm'; retry.style.marginLeft = '10px';
          retry.textContent = window.__dglBotWait.text('again');
          retry.addEventListener('click', again);
          msg.append(retry);
          return;
        }
        if (toggle && action === 'enable' && !result.ok) toggle.checked = false;
        if (toggle && action === 'disable' && !result.ok) toggle.checked = true;
        say(result.message || words.failed, !!result.ok);
        if (result.ok && (action === 'setup' || action === 'enable')) setTimeout(function () { if (window.dglRefreshPage) window.dglRefreshPage(true); else location.reload(); }, 900);
      }
      buttons.forEach(function (button) {
        if (button.disabled) button.setAttribute('data-vf-off', '');
        button.addEventListener('click', function () {
          if (following) return;
          var action = button.getAttribute('data-vf-action');
          var select = document.querySelector('select[name="panel_channel_id"]');
          var image = document.querySelector('input[name="panel_image_url"]');
          var run = function () {
            busy(true); say(words.working, true);
            call(action, action === 'panel' && select ? Object.assign({ channel_id: select.value }, image && !image.disabled ? { panel_image_url: image.value } : {}) : {}).then(function (result) { answer(result, action, run); });
          };
          run();
        });
      });
      // The switch acts at once (it does not wait for Save), so it is kept out of the form's unsaved changes.
      if (toggle) toggle.addEventListener('input', function (e) { e.stopPropagation(); });
      if (toggle) toggle.addEventListener('change', function (e) {
        e.stopPropagation();
        if (following) return;
        var on = toggle.checked;
        var run = function () {
          toggle.checked = on;
          busy(true); say(words.working, true);
          call(on ? 'enable' : 'disable').then(function (result) { answer(result, on ? 'enable' : 'disable', run); });
        };
        run();
      });
      // Once per visit of the card: a setup still running (started before leaving the page) and whether members can get a link.
      var checked = false;
      function check() {
        if (checked) return;
        checked = true;
        status().then(function (data) {
          if (!data || !msg.isConnected) return;
          showLink(data.link);
          if (data.job && data.job.status === 'running') follow(data.job);
          else if (remembered()) {
            // It ended while the page was not open: its result is said once.
            var id = remembered();
            remember(null);
            if (data.job && data.job.id === id) finish(data.job, data.job.action);
          }
        });
      }
      var panel = document.querySelector('[data-ob-panel="verification"]');
      if (remembered()) check();
      else setTimeout(function () { if (panel && !panel.hidden) check(); }, 0);
      var tab = document.querySelector('[data-ob-tab="verification"]');
      if (tab) tab.addEventListener('click', check);
    })();
  <\/script> <script>
    // The method "Email code": its warnings show only while it is chosen. The DM when someone joins can be turned off only with a channel for the panel.
    (function () {
      var radios = Array.prototype.slice.call(document.querySelectorAll('input[name="method"]'));
      var notes = [document.getElementById('ob-email-note'), document.getElementById('ob-email-forced')];
      function method() { var on = radios.filter(function (r) { return r.checked; })[0]; return on ? on.value : ''; }
      function showNotes() { var on = method() === 'email'; notes.forEach(function (n) { if (n) n.hidden = !on; }); }
      radios.forEach(function (r) { r.addEventListener('change', showNotes); });
      var select = document.querySelector('select[name="panel_channel_id"]');
      var dm = document.querySelector('[data-vf-dm]');
      var dmReady = document.querySelector('input[name="dm_ready"]');
      function dmState() { if (!select || !dm || !dmReady) return; dm.disabled = !select.value; if (!select.value) dm.checked = true; }
      if (select) select.addEventListener('change', dmState);
      dmState();
    })();
  <\/script> <script>
    // "Send the welcome": only the line of the chosen way is shown.
    (function () {
      var select = document.querySelector('[data-ob-wait]');
      if (!select) return;
      function show() {
        Array.prototype.forEach.call(document.querySelectorAll('[data-ob-wait-note]'), function (note) { note.hidden = note.getAttribute('data-ob-wait-note') !== select.value; });
      }
      select.addEventListener('change', show);
    })();
  <\/script> <script>
    // Each part of the onboarding has a page of its own now (the welcome, the verification, the join roles, the bump). A link from before (\`onboarding#messages\`, \`#arrival\`, a
    // bookmark) is sent to the page that has it, so nothing it pointed at is lost.
    (function () {
      var root = document.getElementById('ob-panels');
      if (!root) return;
      var hash = (location.hash || '').replace('#', '');
      if (!hash) return;
      var MOVED = { messages: 'welcome?section=messages', dm: 'welcome?section=dm', ping: 'welcome?section=ping', arrival: 'join-roles', bump: 'bump', verification: 'onboarding' };
      if (!MOVED[hash] || root.querySelector('[data-ob-panel="' + hash + '"]')) return;
      var match = /^(.*\\/dash\\/guild\\/\\d+\\/)([^/?#]*)/.exec(location.pathname);
      if (!match) return;
      var target = match[1] + MOVED[hash];
      if (target !== match[1] + match[2] + location.search) location.replace(target);
    })();
  <\/script> `, " "], [" ", " ", '<div class="sx-page ob" data-astro-cid-xclon3ey> <h1 data-astro-cid-xclon3ey>', "</h1> ", " ", " ", " ", " ", ' <div class="ob-panels" id="ob-panels" data-astro-cid-xclon3ey> ', " ", " ", " ", " ", " ", " </div> ", " ", " </div> ", ` <script>
    // The verification card: set it up, post the panel and switch it on or off right away, without the Save button. The bot answers within
    // a moment; a long one (setting it up edits every channel of the server) comes back running, and the card shows how far it is by
    // asking verification-status every moment until it ends, then says the result and draws the page again. Leaving the page stops asking;
    // coming back to it while the setup still runs picks it up again (the job is remembered for this tab).
    (function () {
      var msg = document.getElementById('ob-vf-msg');
      if (!msg) return;
      var guild = location.pathname.replace(/^\\\\/(es|pt-br)(?=\\\\/)/i, '').split('/')[3];
      var progress = document.getElementById('ob-vf-progress');
      var bar = progress ? progress.querySelector('.ob-vf-bar') : null;
      var fill = bar ? bar.querySelector('span') : null;
      var step = progress ? progress.querySelector('.ob-vf-step') : null;
      var warn = document.getElementById('ob-vf-warn');
      var toggle = document.querySelector('[data-vf-switch]');
      var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-vf-action]'));
      var words = { working: msg.getAttribute('data-working') || '', failed: msg.getAttribute('data-failed') || '', lost: msg.getAttribute('data-lost') || '' };
      var KEY = 'ob-vf-job:' + guild;
      var following = null;
      function remember(id) { try { if (id) sessionStorage.setItem(KEY, id); else sessionStorage.removeItem(KEY); } catch (e) {} }
      function remembered() { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } }
      function say(text, ok) { msg.hidden = false; msg.textContent = text; msg.className = 'ob-vf-msg ' + (ok ? 'ok' : 'bad'); }
      function busy(on) {
        buttons.forEach(function (button) { button.disabled = on || button.hasAttribute('data-vf-off'); button.classList.toggle('ob-busy', on); });
        if (toggle) toggle.disabled = on;
      }
      function stepText(job) {
        if (!progress) return '';
        if (job.phase === 'channels' && job.total) return (progress.getAttribute('data-channels') || '').replace('{done}', job.done).replace('{total}', job.total);
        return progress.getAttribute('data-' + (job.phase === 'roles' || job.phase === 'panel' ? job.phase : 'starting')) || '';
      }
      function showJob(job) {
        if (!progress) return;
        progress.hidden = false;
        var percent = Math.max(job.status === 'running' ? 4 : 100, Math.min(100, Number(job.percent) || 0));
        if (fill) fill.style.width = percent + '%';
        if (bar) bar.setAttribute('aria-valuenow', String(percent));
        if (step) step.textContent = job.status === 'running' ? stepText(job) : '';
        msg.hidden = true;
      }
      // The bot can be away for some seconds after an update: the shared wait (scripts/bot-wait.js) asks again by itself before this gives up.
      function status() {
        return window.__dglBotWait.request('/dash/guild/' + guild + '/verification-status', null, { method: 'GET', idempotent: true, limit: 9000 })
          .then(function (r) { return r.data && !r.unreachable ? r.data : { ok: false }; });
      }
      function showLink(link) {
        if (!warn || !link) return;
        if (link.ok) { warn.hidden = true; return; }
        var text = warn.getAttribute('data-' + (link.problem || 'missing')) || warn.getAttribute('data-missing') || '';
        if (link.lettersInstead) text += ' ' + (warn.getAttribute('data-letters') || '');
        warn.textContent = text; warn.hidden = false;
      }
      function finish(job, action) {
        following = null; remember(null);
        if (job) showJob(job);
        busy(false);
        setTimeout(function () { if (progress && !following) progress.hidden = true; }, 900);
        say((job && job.message) || (job ? words.failed : words.lost), !!(job && job.ok));
        if (toggle && action === 'enable' && !(job && job.ok)) toggle.checked = false;
        // The roles, the channel and the switch changed: the page is read again (only the content, as the menu does).
        if (job && job.ok && (action === 'setup' || action === 'enable')) setTimeout(function () { if (window.dglRefreshPage) window.dglRefreshPage(true); else location.reload(); }, 900);
      }
      function follow(job) {
        if (!job) return;
        remember(job.id);
        showJob(job);
        busy(true);
        if (following) return;
        following = job.id;
        var misses = 0;
        var action = job.action;
        function tick() {
          // Another page was opened from the menu: this card is gone, stop asking.
          if (!msg.isConnected) { following = null; return; }
          status().then(function (data) {
            if (!msg.isConnected) { following = null; return; }
            if (data && data.link) showLink(data.link);
            var current = data && data.job;
            if (!data || !data.ok) { misses += 1; if (misses > 6) finish(null, action); else setTimeout(tick, 2500); return; }
            misses = 0;
            if (!current || (current.id !== following && current.status !== 'running')) { finish(null, action); return; }
            action = current.action || action;
            if (current.status === 'running') { showJob(current); setTimeout(tick, 1200); return; }
            finish(current, action);
          });
        }
        setTimeout(tick, 1000);
      }
      // The line of the card says what is going on while Petto answers (and that it is trying again); a bot that stays away says so, with Try again.
      function call(action, extra) {
        return window.__dglBotWait.request('/dash/guild/' + guild + '/verification-api', Object.assign({ action: action }, extra || {}), { onStatus: function (words) { say(words, true); }, limit: 12000 })
          .then(function (r) { return r.unreachable ? { ok: false, unreachable: true } : r.data && typeof r.data === 'object' ? r.data : { ok: false, message: words.failed }; });
      }
      function answer(result, action, again) {
        if (result && result.ok && result.status === 'running' && result.job) { follow(result.job); return; }
        busy(false);
        if (result && result.unreachable) {
          if (toggle && action === 'enable') toggle.checked = false;
          if (toggle && action === 'disable') toggle.checked = true;
          say(window.__dglBotWait.text('notAnswering'), false);
          var retry = document.createElement('button');
          retry.type = 'button'; retry.className = 'btn btn-ghost btn-sm'; retry.style.marginLeft = '10px';
          retry.textContent = window.__dglBotWait.text('again');
          retry.addEventListener('click', again);
          msg.append(retry);
          return;
        }
        if (toggle && action === 'enable' && !result.ok) toggle.checked = false;
        if (toggle && action === 'disable' && !result.ok) toggle.checked = true;
        say(result.message || words.failed, !!result.ok);
        if (result.ok && (action === 'setup' || action === 'enable')) setTimeout(function () { if (window.dglRefreshPage) window.dglRefreshPage(true); else location.reload(); }, 900);
      }
      buttons.forEach(function (button) {
        if (button.disabled) button.setAttribute('data-vf-off', '');
        button.addEventListener('click', function () {
          if (following) return;
          var action = button.getAttribute('data-vf-action');
          var select = document.querySelector('select[name="panel_channel_id"]');
          var image = document.querySelector('input[name="panel_image_url"]');
          var run = function () {
            busy(true); say(words.working, true);
            call(action, action === 'panel' && select ? Object.assign({ channel_id: select.value }, image && !image.disabled ? { panel_image_url: image.value } : {}) : {}).then(function (result) { answer(result, action, run); });
          };
          run();
        });
      });
      // The switch acts at once (it does not wait for Save), so it is kept out of the form's unsaved changes.
      if (toggle) toggle.addEventListener('input', function (e) { e.stopPropagation(); });
      if (toggle) toggle.addEventListener('change', function (e) {
        e.stopPropagation();
        if (following) return;
        var on = toggle.checked;
        var run = function () {
          toggle.checked = on;
          busy(true); say(words.working, true);
          call(on ? 'enable' : 'disable').then(function (result) { answer(result, on ? 'enable' : 'disable', run); });
        };
        run();
      });
      // Once per visit of the card: a setup still running (started before leaving the page) and whether members can get a link.
      var checked = false;
      function check() {
        if (checked) return;
        checked = true;
        status().then(function (data) {
          if (!data || !msg.isConnected) return;
          showLink(data.link);
          if (data.job && data.job.status === 'running') follow(data.job);
          else if (remembered()) {
            // It ended while the page was not open: its result is said once.
            var id = remembered();
            remember(null);
            if (data.job && data.job.id === id) finish(data.job, data.job.action);
          }
        });
      }
      var panel = document.querySelector('[data-ob-panel="verification"]');
      if (remembered()) check();
      else setTimeout(function () { if (panel && !panel.hidden) check(); }, 0);
      var tab = document.querySelector('[data-ob-tab="verification"]');
      if (tab) tab.addEventListener('click', check);
    })();
  <\/script> <script>
    // The method "Email code": its warnings show only while it is chosen. The DM when someone joins can be turned off only with a channel for the panel.
    (function () {
      var radios = Array.prototype.slice.call(document.querySelectorAll('input[name="method"]'));
      var notes = [document.getElementById('ob-email-note'), document.getElementById('ob-email-forced')];
      function method() { var on = radios.filter(function (r) { return r.checked; })[0]; return on ? on.value : ''; }
      function showNotes() { var on = method() === 'email'; notes.forEach(function (n) { if (n) n.hidden = !on; }); }
      radios.forEach(function (r) { r.addEventListener('change', showNotes); });
      var select = document.querySelector('select[name="panel_channel_id"]');
      var dm = document.querySelector('[data-vf-dm]');
      var dmReady = document.querySelector('input[name="dm_ready"]');
      function dmState() { if (!select || !dm || !dmReady) return; dm.disabled = !select.value; if (!select.value) dm.checked = true; }
      if (select) select.addEventListener('change', dmState);
      dmState();
    })();
  <\/script> <script>
    // "Send the welcome": only the line of the chosen way is shown.
    (function () {
      var select = document.querySelector('[data-ob-wait]');
      if (!select) return;
      function show() {
        Array.prototype.forEach.call(document.querySelectorAll('[data-ob-wait-note]'), function (note) { note.hidden = note.getAttribute('data-ob-wait-note') !== select.value; });
      }
      select.addEventListener('change', show);
    })();
  <\/script> <script>
    // Each part of the onboarding has a page of its own now (the welcome, the verification, the join roles, the bump). A link from before (\\\`onboarding#messages\\\`, \\\`#arrival\\\`, a
    // bookmark) is sent to the page that has it, so nothing it pointed at is lost.
    (function () {
      var root = document.getElementById('ob-panels');
      if (!root) return;
      var hash = (location.hash || '').replace('#', '');
      if (!hash) return;
      var MOVED = { messages: 'welcome?section=messages', dm: 'welcome?section=dm', ping: 'welcome?section=ping', arrival: 'join-roles', bump: 'bump', verification: 'onboarding' };
      if (!MOVED[hash] || root.querySelector('[data-ob-panel="' + hash + '"]')) return;
      var match = /^(.*\\\\/dash\\\\/guild\\\\/\\\\d+\\\\/)([^/?#]*)/.exec(location.pathname);
      if (!match) return;
      var target = match[1] + MOVED[hash];
      if (target !== match[1] + match[2] + location.search) location.replace(target);
    })();
  <\/script> `, " "])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-xclon3ey": true }), maybeRenderHead(), dt(meta.title), renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels.map((c) => ({ id: c.id, name: c.name })), "data-astro-cid-xclon3ey": true }), saved && renderTemplate`<div class="sx-flash" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-xclon3ey": true })}${dt("Saved.")}</div>`, problem && renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-xclon3ey": true })}${problem}</div>`, view === "messages" && renderTemplate`${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Messages on"), value: messagesOn, tone: "messages" },
    { label: dt("More messages"), value: variants.welcome.length + variants.leave.length + variants.boost.length, tone: "joins" }
  ], "data-astro-cid-xclon3ey": true })}`, view === "verification" && renderTemplate`${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Verification"), value: 0, text: verification.enabled ? dt("On") : dt("Off"), tone: "joins" },
    { label: dt("Set up"), value: checklistDone, text: `${checklistDone}/${checklist.length}`, tone: "messages" }
  ], "data-astro-cid-xclon3ey": true })}`, view === "messages" && renderTemplate`<section class="ob-panel" data-ob-panel="messages" data-astro-cid-xclon3ey> <form method="POST" class="ob-form" data-astro-cid-xclon3ey> <input type="hidden" name="action" value="events" data-astro-cid-xclon3ey> ${variantsReady && renderTemplate`<input type="hidden" name="variants_ready" value="1" data-astro-cid-xclon3ey>`} <div class="ob-cols" data-astro-cid-xclon3ey> <div class="ob-col" data-astro-cid-xclon3ey> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hand-waving-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("Welcome")}</h2></div> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-w-ch" data-astro-cid-xclon3ey>${dt("Channel")}</label><select id="ob-w-ch" name="welcome_channel_id" data-fill="ob-ch" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("Off")}</option>${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": channels, "selected": memberEvents.welcomeChannelId, "prefix": "#", "data-astro-cid-xclon3ey": true })}</select></div> <div class="sx-field ob-row" data-astro-cid-xclon3ey><label for="ob-w-msg" data-astro-cid-xclon3ey>${dt("Message")}</label><textarea id="ob-w-msg" class="dgl-autogrow" rows="2" name="welcome_message" data-ac data-dp data-dp-template="welcome_embed_template" data-count maxlength="300"${addAttribute(dt("Welcome {user} to {server_name}!"), "placeholder")} data-astro-cid-xclon3ey>${memberEvents.welcomeMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-xclon3ey": true })}</div> ${hasTemplates && renderTemplate`<div class="sx-field" data-astro-cid-xclon3ey><label for="ob-w-tpl" data-astro-cid-xclon3ey>${dt("Or use an embed template")}</label><select id="ob-w-tpl" name="welcome_embed_template" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("No template, use message text above")}</option>${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === memberEvents.welcomeEmbedTemplate, "selected")} data-astro-cid-xclon3ey>${n}</option>`)}</select></div>`} ${variantsReady && renderTemplate`${renderComponent($$result2, "ObMoreMessages", $$ObMoreMessages, { "kind": "welcome", "rows": variants.welcome, "templates": embedTemplateNames, "max": MAX_MORE, "data-astro-cid-xclon3ey": true })}`} ${memberEvents.waitReady && renderTemplate`<div class="sx-field" data-astro-cid-xclon3ey> <input type="hidden" name="wait_ready" value="1" data-astro-cid-xclon3ey> <label for="ob-w-wait" data-astro-cid-xclon3ey>${dt("Send the welcome")}</label> <select id="ob-w-wait" name="welcome_wait" data-ob-wait data-astro-cid-xclon3ey> <option value="off"${addAttribute(memberEvents.welcomeWait === "off", "selected")} data-astro-cid-xclon3ey>${dt("As soon as the member joins")}</option> <option value="rules"${addAttribute(memberEvents.welcomeWait === "rules", "selected")} data-astro-cid-xclon3ey>${dt("After the member accepts the rules")}</option> <option value="rules_onboarding"${addAttribute(memberEvents.welcomeWait === "rules_onboarding", "selected")} data-astro-cid-xclon3ey>${dt("After the rules and the onboarding")}</option> </select> <span class="sx-hint ob-wait-note" data-ob-wait-note="off"${addAttribute(memberEvents.welcomeWait !== "off", "hidden")} data-astro-cid-xclon3ey>${dt("The welcome goes out the moment the member joins, as it always did.")}</span> <span class="sx-hint ob-wait-note" data-ob-wait-note="rules"${addAttribute(memberEvents.welcomeWait !== "rules", "hidden")} data-astro-cid-xclon3ey>${dt("It waits until the member accepts the server rules (Membership Screening). A member who never accepts them is never welcomed.")}</span> <span class="sx-hint ob-wait-note" data-ob-wait-note="rules_onboarding"${addAttribute(memberEvents.welcomeWait !== "rules_onboarding", "hidden")} data-astro-cid-xclon3ey>${dt("It also waits until the member finishes Discord onboarding, but goes out anyway 10 minutes after the rules were accepted (30 minutes after joining when the server has no rules), because members can skip the onboarding.")}</span> <span class="sx-hint ob-wait-note" data-astro-cid-xclon3ey>${dt("Needs Membership Screening or Onboarding turned on in Discord. The second welcome waits the same way. The DM and the ping on join always go out at once.")}</span> </div>`} </section> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chats-circle-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("Second welcome")}</h2> <label class="sx-toggle-only" data-astro-cid-xclon3ey><input type="checkbox" name="welcome_second_enabled"${addAttribute(memberEvents.secondEnabled, "checked")}${addAttribute(dt("Second welcome"), "aria-label")} data-astro-cid-xclon3ey><i class="sx-toggle" data-astro-cid-xclon3ey></i></label> </div> <p class="sx-lead" data-astro-cid-xclon3ey>${dt("A second welcome in another channel, for example the general chat. It is sent right after the first one.")}</p> <div class="ob-body" data-sx-needs="welcome_second_enabled" data-astro-cid-xclon3ey> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-s-ch" data-astro-cid-xclon3ey>${dt("Channel")}</label><select id="ob-s-ch" name="welcome_second_channel_id" data-fill="ob-ch" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("Off")}</option>${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": channels, "selected": memberEvents.secondChannelId, "prefix": "#", "data-astro-cid-xclon3ey": true })}</select></div> <div class="sx-field ob-row" data-astro-cid-xclon3ey><label for="ob-s-msg" data-astro-cid-xclon3ey>${dt("Message")}</label><textarea id="ob-s-msg" class="dgl-autogrow" rows="2" name="welcome_second_message" data-ac data-dp data-dp-template="welcome_second_embed_template" data-count maxlength="300"${addAttribute(dt("Say hi to {user}!"), "placeholder")} data-astro-cid-xclon3ey>${memberEvents.secondMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-xclon3ey": true })}</div> ${hasTemplates && renderTemplate`<div class="sx-field" data-astro-cid-xclon3ey><label for="ob-s-tpl" data-astro-cid-xclon3ey>${dt("Or use an embed template")}</label><select id="ob-s-tpl" name="welcome_second_embed_template" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("No template, use message text above")}</option>${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === memberEvents.secondEmbedTemplate, "selected")} data-astro-cid-xclon3ey>${n}</option>`)}</select></div>`} </div> </section> </div> <div class="ob-col" data-astro-cid-xclon3ey> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:door-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("Leave")}</h2></div> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-l-ch" data-astro-cid-xclon3ey>${dt("Channel")}</label><select id="ob-l-ch" name="leave_channel_id" data-fill="ob-ch" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("Off")}</option>${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": channels, "selected": memberEvents.leaveChannelId, "prefix": "#", "data-astro-cid-xclon3ey": true })}</select></div> <div class="sx-field ob-row" data-astro-cid-xclon3ey><label for="ob-l-msg" data-astro-cid-xclon3ey>${dt("Message")}</label><textarea id="ob-l-msg" class="dgl-autogrow" rows="2" name="leave_message" data-ac data-dp data-dp-template="leave_embed_template" data-count maxlength="300"${addAttribute(dt("{user} left the server."), "placeholder")} data-astro-cid-xclon3ey>${memberEvents.leaveMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-xclon3ey": true })}</div> ${hasTemplates && renderTemplate`<div class="sx-field" data-astro-cid-xclon3ey><label for="ob-l-tpl" data-astro-cid-xclon3ey>${dt("Or use an embed template")}</label><select id="ob-l-tpl" name="leave_embed_template" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("No template, use message text above")}</option>${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === memberEvents.leaveEmbedTemplate, "selected")} data-astro-cid-xclon3ey>${n}</option>`)}</select></div>`} ${variantsReady && renderTemplate`${renderComponent($$result2, "ObMoreMessages", $$ObMoreMessages, { "kind": "leave", "rows": variants.leave, "templates": embedTemplateNames, "max": MAX_MORE, "data-astro-cid-xclon3ey": true })}`} </section> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sparkle-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("Boost")}</h2></div> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-b-ch" data-astro-cid-xclon3ey>${dt("Channel")}</label><select id="ob-b-ch" name="boost_channel_id" data-fill="ob-ch" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("Off")}</option>${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": channels, "selected": memberEvents.boostChannelId, "prefix": "#", "data-astro-cid-xclon3ey": true })}</select></div> <div class="sx-field ob-row" data-astro-cid-xclon3ey><label for="ob-b-msg" data-astro-cid-xclon3ey>${dt("Message")}</label><textarea id="ob-b-msg" class="dgl-autogrow" rows="2" name="boost_message" data-ac data-dp data-dp-template="boost_embed_template" data-count maxlength="300"${addAttribute(dt("{user} just boosted the server!"), "placeholder")} data-astro-cid-xclon3ey>${memberEvents.boostMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-xclon3ey": true })}</div> ${hasTemplates && renderTemplate`<div class="sx-field" data-astro-cid-xclon3ey><label for="ob-b-tpl" data-astro-cid-xclon3ey>${dt("Or use an embed template")}</label><select id="ob-b-tpl" name="boost_embed_template" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("No template, use message text above")}</option>${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === memberEvents.boostEmbedTemplate, "selected")} data-astro-cid-xclon3ey>${n}</option>`)}</select></div>`} ${variantsReady && renderTemplate`${renderComponent($$result2, "ObMoreMessages", $$ObMoreMessages, { "kind": "boost", "rows": variants.boost, "templates": embedTemplateNames, "max": MAX_MORE, "data-astro-cid-xclon3ey": true })}`} <div class="sx-field ob-row" data-astro-cid-xclon3ey><label for="ob-b-lvl" data-astro-cid-xclon3ey>${dt("Boost tier reached message")}</label><textarea id="ob-b-lvl" class="dgl-autogrow" rows="2" name="boost_level_message" data-ac data-dp data-dp-template="boost_level_embed_template" data-count maxlength="300"${addAttribute(dt("{server_name} just reached a new boost tier!"), "placeholder")} data-astro-cid-xclon3ey>${memberEvents.boostLevelMessage}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-xclon3ey": true })}</div> ${hasTemplates && renderTemplate`<div class="sx-field" data-astro-cid-xclon3ey><label for="ob-b-ltpl" data-astro-cid-xclon3ey>${dt("Or use an embed template")}</label><select id="ob-b-ltpl" name="boost_level_embed_template" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("No template, use message text above")}</option>${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === memberEvents.boostLevelEmbedTemplate, "selected")} data-astro-cid-xclon3ey>${n}</option>`)}</select></div>`} </section> </div> </div> <div class="ob-tools" data-astro-cid-xclon3ey> <div class="sx-foot ob-save" data-astro-cid-xclon3ey><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-xclon3ey>${dt("Save")}</button></div> ${hasTemplates && renderTemplate`<p class="sx-hint" data-astro-cid-xclon3ey>${dt("Templates are managed on the Embeds page.")}</p>`} ${renderComponent($$result2, "VariableHelp", $$VariableHelp, { "data-astro-cid-xclon3ey": true })} </div> </form> </section>`, view === "verification" && renderTemplate`<section class="ob-panel" data-ob-panel="verification" data-astro-cid-xclon3ey> <form method="POST" class="ob-form ob-vf" data-astro-cid-xclon3ey> <input type="hidden" name="action" value="verification" data-astro-cid-xclon3ey> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:seal-check-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span> <h2 data-astro-cid-xclon3ey>${dt("Verification")}</h2> <label class="sx-toggle-only" data-astro-cid-xclon3ey><input type="checkbox" name="enabled"${addAttribute(verification.enabled, "checked")} data-vf-switch data-no-dirty${addAttribute(dt("Verification"), "aria-label")} data-astro-cid-xclon3ey><i class="sx-toggle" data-astro-cid-xclon3ey></i></label> </div> <p class="sx-lead" data-astro-cid-xclon3ey>${dt("A Cloudflare Turnstile captcha gate, new members must pass it to get in.")}</p> <div class="ob-auto" data-astro-cid-xclon3ey><div data-astro-cid-xclon3ey><strong data-astro-cid-xclon3ey>${dt("Set it up for me")}</strong><span data-astro-cid-xclon3ey>${dt("Makes the roles and a #verify channel, posts the panel and turns verification on. What you already chose is kept.")}</span></div><button type="button" class="btn btn-accent btn-sm" data-vf-action="setup" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magic-wand-fill", "width": "14", "height": "14", "data-astro-cid-xclon3ey": true })} ${dt("Set it up")}</button></div> <p class="ob-vf-msg" id="ob-vf-msg" role="status" hidden${addAttribute(dt("Working on it\u2026"), "data-working")}${addAttribute(dt("It could not be done. Try again."), "data-failed")}${addAttribute(dt("Petto stopped answering about the setup. Check the server and try again."), "data-lost")} data-astro-cid-xclon3ey></p> <div class="ob-vf-progress" id="ob-vf-progress" hidden${addAttribute(dt("Starting\u2026"), "data-starting")}${addAttribute(dt("Making the roles\u2026"), "data-roles")}${addAttribute(dt("Setting up\u2026 {done}/{total} channels"), "data-channels")}${addAttribute(dt("Posting the panel\u2026"), "data-panel")} data-astro-cid-xclon3ey> <div class="ob-vf-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" data-astro-cid-xclon3ey><span data-astro-cid-xclon3ey></span></div> <span class="ob-vf-step" aria-live="polite" data-astro-cid-xclon3ey></span> </div> <p class="ob-vf-warn" id="ob-vf-warn" hidden${addAttribute(dt("Members cannot get a verification link right now: Petto's VERIFY_BASE_URL is not set."), "data-missing")}${addAttribute(dt("Members cannot get a verification link right now: Petto's VERIFY_TOKEN_SECRET is not set."), "data-secret")}${addAttribute(dt("Members cannot get a verification link right now: Petto's VERIFY_BASE_URL is not a web address."), "data-invalid")}${addAttribute(dt("Members cannot get a verification link right now: Petto's VERIFY_BASE_URL points to localhost, which only opens on the bot's computer."), "data-local")}${addAttribute(dt("Until it is fixed, the panel offers the letters inside Discord instead."), "data-letters")} data-astro-cid-xclon3ey></p> </section> <div class="ob-cols" data-astro-cid-xclon3ey> <div class="ob-col" data-astro-cid-xclon3ey> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-plus-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("Roles")}</h2></div> <div class="sx-grid" data-astro-cid-xclon3ey> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-v-un" data-astro-cid-xclon3ey>${dt("Role while unverified")}</label><select id="ob-v-un" name="unverified_role_id" data-give-role data-fill="ob-roles" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("None")}</option>${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": roles, "selected": verification.unverifiedRoleId, "data-astro-cid-xclon3ey": true })}</select></div> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-v-ok" data-astro-cid-xclon3ey>${dt("Role once verified")}</label><select id="ob-v-ok" name="verified_role_id" data-give-role data-fill="ob-roles" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("None")}</option>${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": roles, "selected": verification.verifiedRoleId, "data-astro-cid-xclon3ey": true })}</select></div> </div> </section> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 id="ob-method-h" data-astro-cid-xclon3ey>${dt("How members verify")}</h2></div> <div class="sx-choices ob-methods" role="radiogroup" aria-labelledby="ob-method-h" data-astro-cid-xclon3ey> ${methods.map(([value, label, hint, icon]) => renderTemplate`<label class="sx-choice" data-astro-cid-xclon3ey><input type="radio" name="method"${addAttribute(value, "value")}${addAttribute(verification.method === value, "checked")}${addAttribute(!verification.methodReady, "disabled")} data-astro-cid-xclon3ey><span class="sx-choice-body" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": icon, "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}<b data-astro-cid-xclon3ey>${label}</b><em data-astro-cid-xclon3ey>${hint}</em></span></label>`)} </div> ${verification.methodReady && renderTemplate`<input type="hidden" name="method_ready" value="1" data-astro-cid-xclon3ey>`} <p class="sx-hint" data-astro-cid-xclon3ey>${dt("The Cloudflare check is the usual one. With letters, members type the letters of a picture (the link page needs no Cloudflare), on the page or with a button in the DM. With both, they do the two. Inside Discord, they only press a button in the DM and type the letters there, with no link at all.")}</p> <p class="sx-hint ob-email-note" id="ob-email-note"${addAttribute(verification.method !== "email", "hidden")} data-astro-cid-xclon3ey>${dt("The email code proves that the member has an inbox, not that they are a person. A captcha plus the email (the Email code of Extra checks) is the strongest. It needs the verification link and a way to send the email.")}</p> </section> <section class="sx-panel ob-box" data-vf-checks data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:detective-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("Extra checks")}</h2></div> <p class="sx-hint" data-astro-cid-xclon3ey>${dt('On top of the captcha. "Tell the staff" lets the member in and writes it in the verification log. "Block" stops them and tells them why.')}</p> <div class="ob-chk-list" data-astro-cid-xclon3ey> ${checkRows.map(([key, icon, title, hint, current]) => renderTemplate`<div class="ob-chk" data-astro-cid-xclon3ey> <span class="ob-chk-icon" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": icon, "width": "18", "height": "18", "data-astro-cid-xclon3ey": true })}</span> <div class="ob-chk-text" data-astro-cid-xclon3ey><b data-astro-cid-xclon3ey>${title}</b><em data-astro-cid-xclon3ey>${hint}</em></div> <div class="ob-seg" role="radiogroup"${addAttribute(title, "aria-label")} data-astro-cid-xclon3ey> ${checkModes.map(([value, label]) => renderTemplate`<label data-astro-cid-xclon3ey><input type="radio"${addAttribute(`chk_${key}`, "name")}${addAttribute(value, "value")}${addAttribute(current === value, "checked")}${addAttribute(!verification.checksReady, "disabled")} data-astro-cid-xclon3ey><span data-astro-cid-xclon3ey>${label}</span></label>`)} </div> </div>`)} <div class="ob-chk ob-chk-wide" data-astro-cid-xclon3ey> <span class="ob-chk-icon" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:identification-card-fill", "width": "18", "height": "18", "data-astro-cid-xclon3ey": true })}</span> <div class="ob-chk-text" data-astro-cid-xclon3ey><b data-astro-cid-xclon3ey>${dt("Discord account")}</b><em data-astro-cid-xclon3ey>${dt("Accounts that are too new, have no avatar or are flagged by Discord.")}</em></div> <div class="ob-seg" role="radiogroup"${addAttribute(dt("Discord account"), "aria-label")} data-astro-cid-xclon3ey> ${checkModes.map(([value, label]) => renderTemplate`<label data-astro-cid-xclon3ey><input type="radio" name="chk_account"${addAttribute(value, "value")}${addAttribute(verification.checks.account.mode === value, "checked")}${addAttribute(!verification.checksReady, "disabled")} data-astro-cid-xclon3ey><span data-astro-cid-xclon3ey>${label}</span></label>`)} </div> <div class="ob-chk-more" data-astro-cid-xclon3ey> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-chk-age" data-astro-cid-xclon3ey>${dt("Minimum age (days)")}</label><input id="ob-chk-age" type="number" name="chk_account_age" min="0" max="365"${addAttribute(verification.checks.account.min_age_days, "value")}${addAttribute(!verification.checksReady, "disabled")} data-astro-cid-xclon3ey></div> <div class="sx-chips" data-astro-cid-xclon3ey> <label class="sx-chip" data-astro-cid-xclon3ey><input type="checkbox" name="chk_account_avatar"${addAttribute(verification.checks.account.no_avatar, "checked")}${addAttribute(!verification.checksReady, "disabled")} data-astro-cid-xclon3ey><span data-astro-cid-xclon3ey>${dt("Needs an avatar")}</span></label> <label class="sx-chip" data-astro-cid-xclon3ey><input type="checkbox" name="chk_account_flagged"${addAttribute(verification.checks.account.flagged, "checked")}${addAttribute(!verification.checksReady, "disabled")} data-astro-cid-xclon3ey><span data-astro-cid-xclon3ey>${dt("Refuse accounts flagged by Discord")}</span></label> </div> </div> </div> <div class="ob-chk ob-chk-wide" data-astro-cid-xclon3ey> <span class="ob-chk-icon" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:envelope-simple-fill", "width": "18", "height": "18", "data-astro-cid-xclon3ey": true })}</span> <div class="ob-chk-text" data-astro-cid-xclon3ey><b data-astro-cid-xclon3ey>${dt("Email code")}</b><em data-astro-cid-xclon3ey>${dt("Members type a 6-digit code sent to their email. Petto does not keep the email.")}</em></div> <label class="sx-toggle-only" data-astro-cid-xclon3ey><input type="checkbox" name="chk_email"${addAttribute(verification.checks.email.required, "checked")}${addAttribute(!verification.checksReady, "disabled")}${addAttribute(dt("Email code"), "aria-label")} data-astro-cid-xclon3ey><i class="sx-toggle" data-astro-cid-xclon3ey></i></label> <div class="ob-chk-more" data-astro-cid-xclon3ey> <div class="sx-chips" data-astro-cid-xclon3ey> <label class="sx-chip" data-astro-cid-xclon3ey><input type="checkbox" name="chk_email_common"${addAttribute(verification.checks.email.common_only, "checked")}${addAttribute(!verification.checksReady, "disabled")} data-astro-cid-xclon3ey><span data-astro-cid-xclon3ey>${dt("Only well-known providers")}</span></label> <label class="sx-chip" data-astro-cid-xclon3ey><input type="checkbox" name="chk_email_disposable"${addAttribute(verification.checks.email.block_disposable, "checked")}${addAttribute(!verification.checksReady, "disabled")} data-astro-cid-xclon3ey><span data-astro-cid-xclon3ey>${dt("Refuse throwaway emails")}</span></label> </div> <div class="sx-grid" data-astro-cid-xclon3ey> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-chk-allow" data-astro-cid-xclon3ey>${dt("Only these domains")}</label><input id="ob-chk-allow" type="text" name="chk_email_allow"${addAttribute(verification.checks.email.allowed_domains.join(", "), "value")} placeholder="school.edu, company.com" maxlength="900"${addAttribute(!verification.checksReady, "disabled")} data-astro-cid-xclon3ey></div> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-chk-deny" data-astro-cid-xclon3ey>${dt("Never these domains")}</label><input id="ob-chk-deny" type="text" name="chk_email_deny"${addAttribute(verification.checks.email.blocked_domains.join(", "), "value")} placeholder="example.com" maxlength="900"${addAttribute(!verification.checksReady, "disabled")} data-astro-cid-xclon3ey></div> </div> <p class="sx-hint" data-astro-cid-xclon3ey>${dt('Well-known providers are Gmail, Outlook, Hotmail, Yahoo, iCloud, Proton and similar: addresses of a personal or company domain are refused. Fill "Only these domains" to accept your own (a school, a company) instead. Addresses with a + sign are never accepted.')}</p> <p class="sx-hint ob-email-note" id="ob-email-forced"${addAttribute(verification.method !== "email", "hidden")} data-astro-cid-xclon3ey>${dt("With the Email code method, the code is always asked, whatever this switch says.")}</p> </div> </div> </div> ${verification.checksReady && renderTemplate`<input type="hidden" name="checks_ready" value="1" data-astro-cid-xclon3ey>`} <p class="sx-hint" data-astro-cid-xclon3ey>${dt('Tor, alt accounts and the email code need the verification page, so they do not work with "Letters inside Discord (no link)". The Discord account check works everywhere.')}</p> </section> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:envelope-simple-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("Messages members get")}</h2></div> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-v-prompt" data-astro-cid-xclon3ey>${dt("Verification DM design")}</label><select id="ob-v-prompt" name="prompt_embed_template" data-dp-template-only data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("Usual message")}</option>${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === verification.promptTemplate, "selected")} data-astro-cid-xclon3ey>${n}</option>`)}</select></div> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-v-done" data-astro-cid-xclon3ey>${dt("Verified DM design")}</label><select id="ob-v-done" name="verified_embed_template" data-dp-template-only data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("Usual message")}</option>${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === verification.verifiedTemplate, "selected")} data-astro-cid-xclon3ey>${n}</option>`)}</select></div> ${verification.designReady && renderTemplate`<input type="hidden" name="design_ready" value="1" data-astro-cid-xclon3ey>`} <p class="sx-hint" data-astro-cid-xclon3ey>${dt("A saved design for the DM with the link. Put {verify.link} where the link goes.")}</p> </section> </div> <div class="ob-col" data-astro-cid-xclon3ey> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("Setup")}</h2><span${addAttribute(["sx-tag", { "sx-tag-accent": checklistDone === checklist.length }], "class:list")} data-astro-cid-xclon3ey>${dt("{n} of {max}", { n: checklistDone, max: checklist.length })}</span></div> <ul class="ob-checks" data-astro-cid-xclon3ey> ${checklist.map((item) => renderTemplate`<li${addAttribute({ done: item.done }, "class:list")} data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": item.done ? "ph:check-circle-fill" : "ph:circle", "width": "18", "height": "18", "data-astro-cid-xclon3ey": true })}<span data-astro-cid-xclon3ey>${item.label}</span></li>`)} </ul> </section> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hash-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("Panel")}</h2></div> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-v-ch" data-astro-cid-xclon3ey>${dt("Verification channel")}</label><select id="ob-v-ch" name="panel_channel_id"${addAttribute(!verification.panelReady, "disabled")} data-fill="ob-ch" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("Off")}</option>${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": channels, "selected": verification.panelChannelId, "prefix": "#", "data-astro-cid-xclon3ey": true })}</select></div> ${verification.panelReady && renderTemplate`<input type="hidden" name="panel_ready" value="1" data-astro-cid-xclon3ey>`} <div class="ob-panel-actions" data-astro-cid-xclon3ey><button type="button" class="btn btn-ghost btn-sm" data-vf-action="panel"${addAttribute(!verification.panelReady, "disabled")} data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "14", "height": "14", "data-astro-cid-xclon3ey": true })} ${dt("Send the panel now")}</button></div> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-v-img" data-astro-cid-xclon3ey>${dt("Panel picture")}</label><input id="ob-v-img" type="url" name="panel_image_url"${addAttribute(verification.panelImage, "value")} maxlength="500" placeholder="https://..."${addAttribute(!verification.imageReady, "disabled")} data-count data-astro-cid-xclon3ey></div> ${verification.imageReady && renderTemplate`<input type="hidden" name="panel_image_ready" value="1" data-astro-cid-xclon3ey>`} <p class="sx-hint" data-astro-cid-xclon3ey>${dt("An optional picture at the top of the panel. The link has to start with https. Save, then press Send the panel now to change a panel that is already posted.")}</p> <div class="sx-chips" data-astro-cid-xclon3ey><label class="sx-chip" data-astro-cid-xclon3ey><input type="checkbox" name="panel_repost" data-astro-cid-xclon3ey><span data-astro-cid-xclon3ey>${dt("Post the panel again when I save")}</span></label></div> <p class="sx-hint" data-astro-cid-xclon3ey>${dt("Petto posts a panel there with the verify buttons, so members can verify in the server and not only by DM. Only the member who presses a button sees the picture. Changing the method? Post the panel again.")}</p> <div class="sx-chips" data-astro-cid-xclon3ey><label class="sx-chip" data-astro-cid-xclon3ey><input type="checkbox" name="dm_on_join"${addAttribute(verification.dmOnJoin, "checked")}${addAttribute(!verification.dmReady || !verification.panelChannelId, "disabled")} data-vf-dm data-astro-cid-xclon3ey><span data-astro-cid-xclon3ey>${dt("Send the DM when someone joins")}</span></label></div> ${verification.dmReady && renderTemplate`<input type="hidden" name="dm_ready" value="1" data-astro-cid-xclon3ey>`} <p class="sx-hint" data-astro-cid-xclon3ey>${dt("When it is off, members verify from the panel of the channel. It only turns off when a channel is chosen for the panel.")}</p> </section> </div> </div> <div class="ob-tools" data-astro-cid-xclon3ey><div class="sx-foot ob-save" data-astro-cid-xclon3ey><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-xclon3ey>${dt("Save")}</button></div></div> </form> </section>`, view === "join-roles" && renderTemplate`<section class="ob-panel" data-ob-panel="join-roles" data-astro-cid-xclon3ey> <div class="ob-cols ob-cols-one" data-astro-cid-xclon3ey> <div class="ob-col" data-astro-cid-xclon3ey> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-plus-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("Join roles")}</h2>${joinRoles.length > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-xclon3ey>${joinRoles.length}</span>`}</div> <p class="sx-lead" data-astro-cid-xclon3ey>${dt("Roles given automatically the moment someone joins.")}</p> ${joinRoles.length > 0 && renderTemplate`<div class="sx-list ob-jr-list dgl-stagger" data-astro-cid-xclon3ey> ${joinRoles.map((jr) => renderTemplate`<div class="sx-row ob-jr-row" data-astro-cid-xclon3ey> <span class="ob-jr-role" data-astro-cid-xclon3ey>${roleName(jr.roleId)}</span> <span class="sx-tag ob-jr-target" data-astro-cid-xclon3ey>${targetLabel(jr.target)}</span> <form method="POST" data-no-dirty class="ob-jr-del" data-astro-cid-xclon3ey><input type="hidden" name="action" value="remove_join_role" data-astro-cid-xclon3ey><input type="hidden" name="role_id"${addAttribute(jr.roleId, "value")} data-astro-cid-xclon3ey> <button type="submit" class="sx-iconbtn"${addAttribute(dt("Remove"), "aria-label")}${addAttribute(dt("Remove"), "title")} data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-xclon3ey": true })}</button> </form> </div>`)} </div>`} ${joinRoles.length === 0 && renderTemplate`<p class="ob-empty" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-plus-fill", "width": "22", "height": "22", "data-astro-cid-xclon3ey": true })}${dt("No join roles yet. Pick one below.")}</p>`} <form method="POST" class="ob-jr-add sx-sub" data-no-dirty data-astro-cid-xclon3ey> <input type="hidden" name="action" value="add_join_role" data-astro-cid-xclon3ey> <h3 data-astro-cid-xclon3ey>${dt("Add")}</h3> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-jr-role" data-astro-cid-xclon3ey>${dt("Role")}</label> <select id="ob-jr-role" name="role_id" required data-give-role data-fill="ob-roles" data-astro-cid-xclon3ey> <option value="" disabled selected data-astro-cid-xclon3ey>${dt("Role")}</option> </select> </div> <div class="sx-field" data-astro-cid-xclon3ey><span class="sx-label" id="ob-jr-target-l" data-astro-cid-xclon3ey>${dt("Who gets it")}</span> <div class="dfx-chips" role="radiogroup" aria-labelledby="ob-jr-target-l" data-astro-cid-xclon3ey>${targets.map(([value, label]) => renderTemplate`<label class="dfx-chip" data-astro-cid-xclon3ey><input type="radio" name="target"${addAttribute(value, "value")}${addAttribute(value === "all", "checked")} data-astro-cid-xclon3ey>${label}</label>`)}</div> </div> <div class="sx-foot" data-astro-cid-xclon3ey><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-xclon3ey": true })}${dt("Add")}</button></div> </form> </section> </div> </div> </section>`, view === "dm" && renderTemplate`<section class="ob-panel" data-ob-panel="dm" data-astro-cid-xclon3ey> <div class="ob-cols ob-cols-one" data-astro-cid-xclon3ey> <div class="ob-col" data-astro-cid-xclon3ey> <form method="POST" class="sx-panel ob-box" data-astro-cid-xclon3ey> <input type="hidden" name="action" value="dm_join" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:envelope-simple-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("DM on join")}</h2></div> <p class="sx-lead" data-astro-cid-xclon3ey>${dt("A direct message sent to new members, separate from the channel welcome. Leave empty to turn off.")}</p> <div class="sx-field ob-row" data-astro-cid-xclon3ey><label for="ob-dm-msg" data-astro-cid-xclon3ey>${dt("Message")}</label><textarea id="ob-dm-msg" class="dgl-autogrow" rows="2" name="dm_join_message" data-ac data-dp data-dp-template="dm_join_embed_template" data-count maxlength="300"${addAttribute(dt("Welcome to {server_name}! Check out #rules to get started."), "placeholder")} data-astro-cid-xclon3ey>${dmJoin.message}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-xclon3ey": true })}</div> ${hasTemplates && renderTemplate`<div class="sx-field" data-astro-cid-xclon3ey><label for="ob-dm-tpl" data-astro-cid-xclon3ey>${dt("Or use an embed template")}</label><select id="ob-dm-tpl" name="dm_join_embed_template" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("No template, use message text above")}</option>${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === dmJoin.embedTemplate, "selected")} data-astro-cid-xclon3ey>${n}</option>`)}</select></div>`} ${renderComponent($$result2, "VariableHelp", $$VariableHelp, { "data-astro-cid-xclon3ey": true })} <div class="sx-foot ob-save" data-astro-cid-xclon3ey><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-xclon3ey>${dt("Save")}</button></div> </form> </div> </div> </section>`, view === "ping" && renderTemplate(_a || (_a = __template(['<section class="ob-panel" data-ob-panel="ping" data-astro-cid-xclon3ey> <form method="POST" class="ob-form" data-astro-cid-xclon3ey> <input type="hidden" name="action" value="ping_on_join" data-astro-cid-xclon3ey> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-xclon3ey>', "</span> <h2 data-astro-cid-xclon3ey>", '</h2> <label class="sx-toggle-only" data-astro-cid-xclon3ey><input type="checkbox" name="enabled"', "", ' data-astro-cid-xclon3ey><i class="sx-toggle" data-astro-cid-xclon3ey></i></label> </div> <p class="sx-lead" data-astro-cid-xclon3ey>', "</p> ", ' <div class="ob-row dfx-field ob-pick" data-filterable data-sx-needs="enabled" data-astro-cid-xclon3ey> <label data-astro-cid-xclon3ey>', '</label> <input type="text" class="dgl-filter-input"', ' data-filter-input data-astro-cid-xclon3ey>  <div class="ob-role-list" data-filter-list', ' data-astro-cid-xclon3ey></div> <script type="application/json" data-poj-rows>', `<\/script> <script>
            (function () {
              var holder = document.currentScript.previousElementSibling;
              var list = holder && holder.previousElementSibling;
              if (!list || !list.hasAttribute('data-poj-labels') || list.childElementCount) return;
              var rows, labels;
              try { rows = JSON.parse(holder.textContent || '[]'); labels = JSON.parse(list.getAttribute('data-poj-labels')); } catch (e) { return; }
              var scope = [];
              for (var i = 0; i < list.attributes.length; i++) if (list.attributes[i].name.indexOf('data-astro-cid-') === 0) scope.push(list.attributes[i].name);
              var make = function (tag, cls, text) {
                var el = document.createElement(tag);
                if (cls) el.className = cls;
                scope.forEach(function (name) { el.setAttribute(name, ''); });
                if (text != null) el.textContent = text;
                return el;
              };
              var fragment = document.createDocumentFragment();
              rows.forEach(function (row) {
                var item = make('label', 'ob-poj-item');
                var top = make('span', 'ob-poj-top');
                var box = make('input', 'ob-poj-check');
                box.type = 'checkbox'; box.name = 'channel_ids'; box.value = row[0]; box.defaultChecked = !!row[2];
                top.appendChild(box);
                // The name wraps and, when Petto cannot post there, says why under it.
                var text = make('span', 'ob-poj-text');
                text.appendChild(make('span', 'ob-poj-name', '#' + row[1]));
                if (row[4]) text.appendChild(make('span', 'ob-poj-note', row[4]));
                top.appendChild(text);
                var bottom = make('span', 'ob-poj-bottom');
                bottom.appendChild(make('span', 'ob-poj-delay-label', labels[0]));
                var delay = make('input', 'ob-poj-delay');
                delay.type = 'number'; delay.name = 'delay_' + row[0]; delay.min = '1'; delay.max = '300'; delay.defaultValue = String(row[3]); delay.title = labels[1];
                bottom.appendChild(delay);
                bottom.appendChild(make('span', 'ob-poj-unit', 's'));
                item.appendChild(top);
                item.appendChild(bottom);
                fragment.appendChild(item);
              });
              list.appendChild(fragment);
            })();
          <\/script> </div> </section> <div class="ob-tools" data-astro-cid-xclon3ey><div class="sx-foot ob-save" data-astro-cid-xclon3ey><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-xclon3ey>`, "</button></div></div> </form> </section>"])), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:bell-ringing-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true }), dt("Ping on join"), addAttribute(pingOnJoin.enabled, "checked"), addAttribute(dt("Ping on join"), "aria-label"), dt("Mentions new members in these channels, then cleans the ping up after the delay below (default 5s)."), closedPings.length > 0 && renderTemplate`<div class="ob-warn" role="alert" data-astro-cid-xclon3ey> <strong data-astro-cid-xclon3ey>${dt("The ping will not arrive in these channels:")}</strong> <ul class="ob-warn-list" data-astro-cid-xclon3ey>${closedPings.map((c) => renderTemplate`<li data-astro-cid-xclon3ey><span class="ob-warn-name" data-astro-cid-xclon3ey>#${c.name}</span> <span class="ob-warn-why" data-astro-cid-xclon3ey>${c.note}</span></li>`)}</ul> <span data-astro-cid-xclon3ey>${dt("Give Petto View Channel and Send Messages in them, or pick other channels.")}</span> </div>`, dt("Channels"), addAttribute(dt("Search channels..."), "placeholder"), addAttribute(JSON.stringify([dt("Delay"), dt("Seconds before the ping message is deleted")]), "data-poj-labels"), unescapeHTML(pingRowsJson), dt("Save")), view === "bump" && renderTemplate`<section class="ob-panel" data-ob-panel="bump" data-astro-cid-xclon3ey> <form method="POST" class="ob-form" data-astro-cid-xclon3ey> <input type="hidden" name="action" value="bump" data-astro-cid-xclon3ey> <div class="ob-cols" data-astro-cid-xclon3ey> <div class="ob-col" data-astro-cid-xclon3ey> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-fat-lines-up-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("Bump reminder")}</h2></div> <p class="sx-lead" data-astro-cid-xclon3ey>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("Reminds the server to <code>/bump</code> on Disboard once the cooldown ends."))}` })}</p> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-bp-ch" data-astro-cid-xclon3ey>${dt("Channel")}</label><select id="ob-bp-ch" name="channel_id" data-fill="ob-ch" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("Off")}</option>${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": channels, "selected": bump.channelId, "prefix": "#", "data-astro-cid-xclon3ey": true })}</select></div> <div class="sx-field ob-row" data-astro-cid-xclon3ey><label for="ob-bp-msg" data-astro-cid-xclon3ey>${dt("Reminder message")}</label><textarea id="ob-bp-msg" class="dgl-autogrow" rows="2" name="message" data-ac data-dp data-count maxlength="300"${addAttribute(dt("It's time to /bump the server!"), "placeholder")} data-astro-cid-xclon3ey>${bump.message}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-xclon3ey": true })}</div> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-bp-rtpl" data-astro-cid-xclon3ey>${dt("Reminder design")}</label><select id="ob-bp-rtpl" name="reminder_embed_template" data-tpl-locks="message" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("Usual message")}</option>${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === bump.reminderTemplate, "selected")} data-astro-cid-xclon3ey>${n}</option>`)}</select></div> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-bp-thx" data-astro-cid-xclon3ey>${dt("Thank-you message")}</label><textarea id="ob-bp-thx" class="dgl-autogrow" rows="2" name="thankyou" data-ac data-count maxlength="300"${addAttribute(dt("{user.mention} successfully bumped! Bump again {nextBump}."), "placeholder")} data-astro-cid-xclon3ey>${bump.thankyou}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-xclon3ey": true })}</div> <div class="sx-field" data-astro-cid-xclon3ey><label for="ob-bp-ttpl" data-astro-cid-xclon3ey>${dt("Thank-you design")}</label><select id="ob-bp-ttpl" name="thankyou_embed_template" data-tpl-locks="thankyou" data-astro-cid-xclon3ey><option value="" data-astro-cid-xclon3ey>${dt("Usual message")}</option>${embedTemplateNames.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === bump.thankyouTemplate, "selected")} data-astro-cid-xclon3ey>${n}</option>`)}</select></div> ${bump.designReady && renderTemplate`<input type="hidden" name="design_ready" value="1" data-astro-cid-xclon3ey>`} </section> </div> <div class="ob-col" data-astro-cid-xclon3ey> <section class="sx-panel ob-box" data-astro-cid-xclon3ey> <div class="sx-panel-head" data-astro-cid-xclon3ey><span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-xclon3ey>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:broom-fill", "width": "17", "height": "17", "data-astro-cid-xclon3ey": true })}</span><h2 data-astro-cid-xclon3ey>${dt("While it waits")}</h2></div> <div class="ob-toggles" data-astro-cid-xclon3ey> <label class="sx-switch" data-astro-cid-xclon3ey><input type="checkbox" name="pingable"${addAttribute(bump.pingable, "checked")} data-astro-cid-xclon3ey><span class="sx-switch-text" data-astro-cid-xclon3ey><b data-astro-cid-xclon3ey>${dt("Ping everyone when due")}</b></span><i class="sx-toggle" data-astro-cid-xclon3ey></i></label> <label class="sx-switch" data-astro-cid-xclon3ey><input type="checkbox" name="autolock"${addAttribute(bump.autolock, "checked")} data-astro-cid-xclon3ey><span class="sx-switch-text" data-astro-cid-xclon3ey><b data-astro-cid-xclon3ey>${dt("Lock channel between bumps")}</b></span><i class="sx-toggle" data-astro-cid-xclon3ey></i></label> <label class="sx-switch" data-astro-cid-xclon3ey><input type="checkbox" name="autoclean"${addAttribute(bump.autoclean, "checked")} data-astro-cid-xclon3ey><span class="sx-switch-text" data-astro-cid-xclon3ey><b data-astro-cid-xclon3ey>${dt("Auto-delete chatter")}</b></span><i class="sx-toggle" data-astro-cid-xclon3ey></i></label> </div> </section> </div> </div> <div class="ob-tools" data-astro-cid-xclon3ey> <div class="sx-foot ob-save" data-astro-cid-xclon3ey><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-xclon3ey>${dt("Save")}</button></div> ${renderComponent($$result2, "VariableHelp", $$VariableHelp, { "data-astro-cid-xclon3ey": true })} </div> </form> </section>`, renderComponent($$result2, "SelectSource", $$SelectSource, { "name": "ob-ch", "items": channels.map((c) => ({ id: c.id, name: c.name, note: c.note })), "prefix": "#", "data-astro-cid-xclon3ey": true }), renderComponent($$result2, "SelectSource", $$SelectSource, { "name": "ob-roles", "items": roles.map((r) => ({ id: r.id, name: r.name })), "data-astro-cid-xclon3ey": true }), renderComponent($$result2, "DashBotWait", $$DashBotWait, { "data-astro-cid-xclon3ey": true }), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-xclon3ey": true })) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashOnboarding.astro", void 0);

const MODES = ["off", "warn", "block"];
const DOMAIN_RE = /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
const MAX_DOMAINS = 50;
const mode = (value) => MODES.includes(value) ? value : "off";
function domainList(value) {
  const parts = Array.isArray(value) ? value : String(value ?? "").split(/[\s,;]+/);
  const out = [];
  for (const part of parts) {
    const domain = String(part ?? "").trim().toLowerCase().replace(/^@/, "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (DOMAIN_RE.test(domain) && !out.includes(domain)) out.push(domain);
    if (out.length >= MAX_DOMAINS) break;
  }
  return out;
}
function normalizeChecks(raw) {
  const source = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  const account = source.account && typeof source.account === "object" ? source.account : {};
  const email = source.email && typeof source.email === "object" ? source.email : {};
  const days = Math.floor(Number(account.min_age_days));
  return {
    tor: mode(source.tor),
    alt: mode(source.alt),
    account: { mode: mode(account.mode), min_age_days: Number.isFinite(days) ? Math.min(365, Math.max(0, days)) : 0, no_avatar: account.no_avatar === true, flagged: account.flagged !== false },
    email: { required: email.required === true, common_only: email.common_only !== false, block_disposable: email.block_disposable !== false, allowed_domains: domainList(email.allowed_domains), blocked_domains: domainList(email.blocked_domains) }
  };
}
function checksFromForm(form) {
  return normalizeChecks({
    tor: form.get("chk_tor"),
    alt: form.get("chk_alt"),
    account: { mode: form.get("chk_account"), min_age_days: form.get("chk_account_age"), no_avatar: form.get("chk_account_avatar") === "on", flagged: form.get("chk_account_flagged") === "on" },
    email: { required: form.get("chk_email") === "on", common_only: form.get("chk_email_common") === "on", block_disposable: form.get("chk_email_disposable") === "on", allowed_domains: form.get("chk_email_allow"), blocked_domains: form.get("chk_email_deny") }
  });
}

async function runOnboardingPage(Astro, id) {
  const dt = makeT(getDashLang(Astro));
  const botToken = getEnv(Astro, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro, id);
  if ("redirect" in auth) return { redirect: auth.redirect };
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return { redirect: "/dash/manage?error=server_not_configured" };
  const apiHeaders = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
  let saved = false;
  let problem = null;
  function designFields(form, keys) {
    const out = {};
    for (const key of keys) {
      const value = String(form.get(`${key}_embed_template`) ?? "").trim().slice(0, 40) || null;
      if (form.get("design_ready") || value) out[`${key}_embed_template`] = value;
    }
    return out;
  }
  if (Astro.request.method === "POST") {
    const form = await Astro.request.formData();
    const action = String(form.get("action") ?? "");
    if (action === "events") {
      await fetch(`${apiUrl}/rest/v1/member_events_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          welcome_channel_id: String(form.get("welcome_channel_id") ?? "").trim() || null,
          welcome_message: String(form.get("welcome_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 300) || null,
          welcome_embed_template: String(form.get("welcome_embed_template") ?? "").trim() || null,
          leave_channel_id: String(form.get("leave_channel_id") ?? "").trim() || null,
          leave_message: String(form.get("leave_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 300) || null,
          leave_embed_template: String(form.get("leave_embed_template") ?? "").trim() || null,
          boost_channel_id: String(form.get("boost_channel_id") ?? "").trim() || null,
          boost_message: String(form.get("boost_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 300) || null,
          boost_embed_template: String(form.get("boost_embed_template") ?? "").trim() || null,
          boost_level_message: String(form.get("boost_level_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 300) || null,
          boost_level_embed_template: String(form.get("boost_level_embed_template") ?? "").trim() || null,
          // The second welcome and the way the welcome waits are only sent when the bot's tables have them (an older bot would refuse the whole save).
          ...form.get("wait_ready") ? {
            welcome_wait: ["off", "rules", "rules_onboarding"].includes(String(form.get("welcome_wait"))) ? String(form.get("welcome_wait")) : "off",
            welcome_second_enabled: form.get("welcome_second_enabled") === "on",
            welcome_second_channel_id: String(form.get("welcome_second_channel_id") ?? "").trim() || null,
            welcome_second_message: String(form.get("welcome_second_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 300) || null,
            welcome_second_embed_template: String(form.get("welcome_second_embed_template") ?? "").trim() || null
          } : {},
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      if (form.get("variants_ready")) {
        for (const kind of ["welcome", "leave", "boost"]) {
          const messages = form.getAll(`variant_${kind}_message`).map((value) => String(value).replace(/\r\n/g, "\n").trim().slice(0, 300));
          const templates = form.getAll(`variant_${kind}_embed`).map((value) => String(value).trim().slice(0, 100));
          const rows = messages.map((message, index) => ({ message: message || null, embed_template: templates[index] || null })).filter((row) => row.message || row.embed_template).slice(0, 24).map((row, index) => ({ guild_id: id, kind, position: index + 1, ...row }));
          await fetch(`${apiUrl}/rest/v1/member_event_variants?guild_id=eq.${id}&kind=eq.${kind}`, { method: "DELETE", headers: apiHeaders });
          if (rows.length) await fetch(`${apiUrl}/rest/v1/member_event_variants`, { method: "POST", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify(rows) });
        }
      }
      saved = true;
    } else if (action === "verification") {
      const saveResponse = await fetch(`${apiUrl}/rest/v1/verification_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          enabled: form.get("enabled") === "on",
          unverified_role_id: String(form.get("unverified_role_id") ?? "").trim() || null,
          verified_role_id: String(form.get("verified_role_id") ?? "").trim() || null,
          ...designFields(form, ["prompt", "verified"]),
          // The check is only sent when the bot's tables have it (an older bot would refuse the whole save).
          // The panel channel is only sent when the bot's tables have it. A new channel (or "post it again") makes the bot post the panel within minutes.
          ...form.get("panel_ready") ? { panel_channel_id: String(form.get("panel_channel_id") ?? "").trim() || null, ...form.get("panel_repost") === "on" ? { panel_message_id: null } : {} } : {},
          // The picture of the panel is only sent when the bot's tables have it; it has to be an https link (or empty for none).
          ...form.get("panel_image_ready") ? { panel_image_url: /^https:\/\/\S+$/i.test(String(form.get("panel_image_url") ?? "").trim()) ? String(form.get("panel_image_url")).trim().slice(0, 500) : null } : {},
          ...form.get("method_ready") && ["turnstile", "letters", "both", "discord", "email"].includes(String(form.get("method"))) ? { method: String(form.get("method")) } : {},
          // The extra checks (Tor, alt accounts, the Discord account, the email code) are only sent when the bot's tables have them.
          ...form.get("checks_ready") ? { checks: checksFromForm(form) } : {},
          // The DM when someone joins is only sent when the bot's tables have it. It can be off only with a channel for the panel (the bot checks it too).
          ...form.get("dm_ready") ? { dm_on_join: form.get("dm_on_join") === "on" || !String(form.get("panel_channel_id") ?? "").trim() } : {},
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      }).catch((error) => {
        console.error(`[onboarding] saving the verification of ${id}: the bot could not be reached:`, error?.message);
        return null;
      });
      if (!saveResponse || !saveResponse.ok) {
        if (saveResponse) console.error(`[onboarding] saving the verification of ${id}: the bot answered ${saveResponse.status} ${(await saveResponse.text().catch(() => "")).slice(0, 300)}`);
        problem = dt("The verification settings could not be saved. Try again in a moment.");
      } else {
        saved = true;
        if (form.get("panel_ready") && form.get("panel_repost") === "on" && String(form.get("panel_channel_id") ?? "").trim()) {
          const posted = await callPettoVerification(Astro, id, String(session.userId), "panel");
          if (!posted.ok) {
            console.error(`[onboarding] posting the verification panel of ${id} again: ${posted.down ? "the bot did not answer" : posted.message}`);
            problem = `${dt("The settings were saved, but the panel could not be posted:")} ${posted.down ? dt('Petto did not answer. Press "Send the panel now" in a moment.') : posted.message}`;
          }
        }
      }
    } else if (action === "bump") {
      await fetch(`${apiUrl}/rest/v1/bump_reminders?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          channel_id: String(form.get("channel_id") ?? "").trim() || null,
          message: String(form.get("message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 300) || dt("It's time to **/bump** the server!"),
          thankyou: String(form.get("thankyou") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 300) || "{user.mention} successfully bumped! Bump again {nextBump}.",
          pingable: form.get("pingable") === "on",
          autolock: form.get("autolock") === "on",
          autoclean: form.get("autoclean") === "on",
          ...designFields(form, ["thankyou", "reminder"]),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      saved = true;
    } else if (action === "dm_join") {
      await fetch(`${apiUrl}/rest/v1/member_events_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          dm_join_message: String(form.get("dm_join_message") ?? "").replace(/\r\n/g, "\n").trim().slice(0, 300) || null,
          dm_join_embed_template: String(form.get("dm_join_embed_template") ?? "").trim() || null,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      saved = true;
    } else if (action === "ping_on_join") {
      const channelIds = form.getAll("channel_ids").map(String);
      await fetch(`${apiUrl}/rest/v1/poj_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ guild_id: id, enabled: form.get("enabled") === "on" })
      });
      await fetch(`${apiUrl}/rest/v1/poj_channels?guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      if (channelIds.length > 0) {
        await fetch(`${apiUrl}/rest/v1/poj_channels`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "return=minimal" },
          body: JSON.stringify(channelIds.map((channelId) => {
            const seconds = Math.max(1, Math.min(300, Number(form.get(`delay_${channelId}`)) || 5));
            return { guild_id: id, channel_id: channelId, delete_after_ms: seconds * 1e3 };
          }))
        });
      }
      saved = true;
    } else if (action === "add_join_role") {
      const roleId = String(form.get("role_id") ?? "").trim();
      const target = String(form.get("target") ?? "all");
      if (roleId) {
        await fetch(`${apiUrl}/rest/v1/join_roles?on_conflict=guild_id,role_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, role_id: roleId, target })
        });
        saved = true;
      }
    } else if (action === "remove_join_role") {
      await fetch(`${apiUrl}/rest/v1/join_roles?guild_id=eq.${id}&role_id=eq.${encodeURIComponent(String(form.get("role_id") ?? ""))}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    }
  }
  const [guildInfo, eventsRes, verificationRes, bumpRes, pojConfigRes, pojChannelsRes, joinRolesRes, rolesRes, channelsRes, embedTemplatesRes, variantsRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    () => fetch(`${apiUrl}/rest/v1/member_events_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/verification_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/bump_reminders?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/poj_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/poj_channels?guild_id=eq.${id}&select=channel_id,delete_after_ms`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/join_roles?guild_id=eq.${id}&select=role_id,target`, { headers: apiHeaders }),
    () => getGuildList(Astro, id, botToken, "roles"),
    () => getGuildList(Astro, id, botToken, "channels"),
    () => fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/member_event_variants?guild_id=eq.${id}&select=kind,message,embed_template&order=position.asc,id.asc`, { headers: apiHeaders })
  ], 6);
  const fallbackInfo = Astro.request.method === "POST" && !guildInfo ? { name: dt("Server"), icon: null } : null;
  if (fallbackInfo) console.error(`[onboarding] the name of the server ${id} could not be read after a save; showing the page with a plain name`);
  if (!guildInfo && !fallbackInfo) return { redirect: "/dash/manage?error=bot_not_in_guild" };
  const serverInfo = guildInfo ?? fallbackInfo;
  const eventsRows = eventsRes.ok ? await eventsRes.json() : [];
  const e = eventsRows[0] ?? {};
  const memberEvents = {
    welcomeChannelId: e.welcome_channel_id ?? null,
    welcomeMessage: e.welcome_message ?? "",
    welcomeEmbedTemplate: e.welcome_embed_template ?? "",
    leaveChannelId: e.leave_channel_id ?? null,
    leaveMessage: e.leave_message ?? "",
    leaveEmbedTemplate: e.leave_embed_template ?? "",
    boostChannelId: e.boost_channel_id ?? null,
    boostMessage: e.boost_message ?? "",
    boostEmbedTemplate: e.boost_embed_template ?? "",
    boostLevelMessage: e.boost_level_message ?? "",
    boostLevelEmbedTemplate: e.boost_level_embed_template ?? "",
    // The way the welcome waits and the second welcome exist once the bot that added them runs (a server with no saved row is asked, below).
    waitReady: "welcome_wait" in e,
    welcomeWait: ["off", "rules", "rules_onboarding"].includes(e.welcome_wait) ? e.welcome_wait : "off",
    secondEnabled: e.welcome_second_enabled ?? false,
    secondChannelId: e.welcome_second_channel_id ?? null,
    secondMessage: e.welcome_second_message ?? "",
    secondEmbedTemplate: e.welcome_second_embed_template ?? ""
  };
  if (!memberEvents.waitReady && eventsRows.length === 0) {
    const probe = await fetch(`${apiUrl}/rest/v1/member_events_config?select=welcome_wait&limit=1`, { headers: apiHeaders }).catch(() => null);
    memberEvents.waitReady = Boolean(probe?.ok);
  }
  const variantsRows = variantsRes.ok ? await variantsRes.json() : [];
  const variantsReady = variantsRes.ok;
  const variants = { welcome: [], leave: [], boost: [] };
  for (const row of variantsRows) if (row.kind in variants) variants[row.kind].push({ message: row.message ?? "", template: row.embed_template ?? "" });
  const embedTemplateNames = embedTemplatesRes.ok ? (await embedTemplatesRes.json()).map((t) => t.name) : [];
  const verificationRows = verificationRes.ok ? await verificationRes.json() : [];
  const v = verificationRows[0] ?? {};
  const verification = { dmReady: "dm_on_join" in v, dmOnJoin: v.dm_on_join !== false, checksReady: "checks" in v, checks: normalizeChecks(v.checks), methodReady: "method" in v, method: v.method ?? "turnstile", designReady: "prompt_embed_template" in v, promptTemplate: v.prompt_embed_template ?? "", verifiedTemplate: v.verified_embed_template ?? "", enabled: v.enabled ?? false, unverifiedRoleId: v.unverified_role_id ?? null, verifiedRoleId: v.verified_role_id ?? null, panelReady: "panel_channel_id" in v, panelChannelId: v.panel_channel_id ?? null, imageReady: "panel_image_url" in v, panelImage: v.panel_image_url ?? "" };
  const bumpRows = bumpRes.ok ? await bumpRes.json() : [];
  const bmp = bumpRows[0] ?? {};
  const bump = {
    designReady: "thankyou_embed_template" in bmp,
    thankyouTemplate: bmp.thankyou_embed_template ?? "",
    reminderTemplate: bmp.reminder_embed_template ?? "",
    channelId: bmp.channel_id ?? null,
    message: bmp.message ?? "",
    thankyou: bmp.thankyou ?? "",
    pingable: bmp.pingable ?? false,
    autolock: bmp.autolock ?? false,
    autoclean: bmp.autoclean ?? false
  };
  const dmJoin = { message: e.dm_join_message ?? "", embedTemplate: e.dm_join_embed_template ?? "" };
  const pojConfigRows = pojConfigRes.ok ? await pojConfigRes.json() : [];
  const pojChannelsRows = pojChannelsRes.ok ? await pojChannelsRes.json() : [];
  const pingOnJoin = {
    enabled: pojConfigRows[0]?.enabled ?? false,
    channelIds: pojChannelsRows.map((row) => row.channel_id),
    delaysSeconds: Object.fromEntries(pojChannelsRows.map((row) => [row.channel_id, Math.round((row.delete_after_ms ?? 5e3) / 1e3)]))
  };
  const joinRolesRows = joinRolesRes.ok ? await joinRolesRes.json() : [];
  const joinRoles = joinRolesRows.map((row) => ({ roleId: row.role_id, target: row.target }));
  const allRoles = rolesRes.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((r) => r.name !== "@everyone").sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const allChannels = channelsRes.ok ? await channelsRes.json() : [];
  const channels = allChannels.filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map(postableChannel);
  return { props: {
    user: session,
    guildId: id,
    guildName: serverInfo.name,
    guildIcon: serverInfo.icon ?? "/assets/mascot-icon.webp",
    memberEvents,
    verification,
    bump,
    dmJoin,
    pingOnJoin,
    joinRoles,
    roles,
    channels,
    embedTemplateNames,
    saved,
    problem,
    variants,
    variantsReady
  } };
}

export { $$DashOnboarding as $, runOnboardingPage as r };
