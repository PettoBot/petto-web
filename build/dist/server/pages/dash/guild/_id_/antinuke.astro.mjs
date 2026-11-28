import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$SxNumber } from '../../../../chunks/SxNumber_YL4vNksH.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from '../../../../chunks/dash_CORIPvM-.mjs';
import { f as formatDuration, a as agoText } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
/* empty css                                             */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, k as getGuildDetails, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
export { renderers } from '../../../../renderers.mjs';

const RULES = [
  { id: "ban", legacy: true, threshold: 3, window: 10, icon: "ph:gavel-fill" },
  { id: "kick", legacy: true, threshold: 3, window: 10, icon: "ph:sign-out-fill" },
  { id: "bot_add", legacy: false, threshold: 1, window: 60, icon: "ph:robot-fill" },
  { id: "webhook", legacy: true, threshold: 3, window: 10, icon: "ph:link-fill" },
  { id: "channel_create", legacy: true, threshold: 4, window: 10, icon: "ph:plus-circle-fill" },
  { id: "channel_delete", legacy: true, threshold: 2, window: 10, icon: "ph:trash-fill" },
  { id: "role_create", legacy: true, threshold: 4, window: 10, icon: "ph:plus-circle-fill" },
  { id: "role_delete", legacy: true, threshold: 2, window: 10, icon: "ph:trash-fill" },
  { id: "role_assign", legacy: false, threshold: 1, window: 10, icon: "ph:key-fill" },
  { id: "unban", legacy: false, threshold: 5, window: 10, icon: "ph:gavel-fill" },
  { id: "emoji_delete", legacy: true, threshold: 5, window: 10, icon: "ph:mask-happy-fill" },
  { id: "emoji_create", legacy: true, threshold: 8, window: 10, icon: "ph:mask-happy-fill" },
  { id: "guild_update", legacy: false, threshold: 3, window: 60, icon: "ph:gear-six-fill" },
  { id: "role_update", legacy: false, threshold: 3, window: 10, icon: "ph:shield-warning-fill" },
  { id: "channel_update", legacy: false, threshold: 4, window: 10, icon: "ph:hash-fill" },
  { id: "mention_everyone", legacy: false, threshold: 2, window: 30, icon: "ph:megaphone-fill" },
  { id: "webhook_spam", legacy: false, threshold: 8, window: 10, icon: "ph:webhooks-logo-fill" },
  { id: "prune", legacy: false, threshold: 1, window: 60, icon: "ph:user-minus-fill" }
];
const ACTIONS = ["alert", "quarantine", "kick", "ban"];
function guardSettings(config) {
  return {
    panicEnabled: Boolean(config?.panic_enabled),
    panicThreshold: config?.panic_threshold ?? 2,
    panicWindow: config?.panic_window_minutes ?? 10,
    panicMinutes: config?.panic_lockdown_minutes ?? 30,
    panicOnRaid: config?.panic_on_raid !== false,
    dmOwner: config?.dm_owner !== false,
    ownerOnly: Boolean(config?.owner_only),
    adminIds: config?.admin_ids ?? []
  };
}
function mayChangeAntinuke(config, userId, ownerId) {
  if (ownerId && userId === ownerId) return true;
  if ((config?.admin_ids ?? []).includes(userId)) return true;
  return !config?.owner_only;
}
function resolveRule(config, rows, meta) {
  const row = rows.find((r) => r.rule === meta.id);
  if (row) {
    return { id: meta.id, enabled: row.enabled, saved: true, threshold: row.threshold, window: row.window_seconds, action: row.action, alertChannelId: row.alert_channel_id ?? "", whitelistIds: row.whitelist_ids ?? [], whitelistRoleIds: row.whitelist_role_ids ?? [], followsOldSwitch: false };
  }
  if (meta.legacy && config?.enabled) {
    return { id: meta.id, enabled: true, saved: false, threshold: config.action_threshold ?? meta.threshold, window: config.window_seconds ?? meta.window, action: "quarantine", alertChannelId: "", whitelistIds: [], whitelistRoleIds: [], followsOldSwitch: true };
  }
  return { id: meta.id, enabled: false, saved: false, threshold: meta.threshold, window: meta.window, action: "quarantine", alertChannelId: "", whitelistIds: [], whitelistRoleIds: [], followsOldSwitch: false };
}
const SNOWFLAKE = /^\d{15,25}$/;

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashAntiNuke = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashAntiNuke;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, section, protections, join, shared, guard, viewerIsOwner, blocked, events, eventsWeek, lockdownConfig, lockdownActive, roles, channels, saved, failed } = Astro2.props;
  const names = {
    ban: { label: dt("Anti Ban"), text: dt("Punishes mass bans in a row.") },
    kick: { label: dt("Anti Kick"), text: dt("Punishes mass kicks in a row.") },
    bot_add: { label: dt("Anti Bots"), text: dt("Removes bots added without permission and punishes who added them.") },
    webhook: { label: dt("Anti Webhooks"), text: dt("Detects the mass creation of webhooks.") },
    channel_create: { label: dt("Anti Create Channels"), text: dt("Stops the mass creation of channels, and can delete them.") },
    channel_delete: { label: dt("Anti Delete Channels"), text: dt("Stops the mass deletion of channels, and can rebuild them.") },
    role_create: { label: dt("Anti Create Roles"), text: dt("Stops the mass creation of roles, and can delete them.") },
    role_delete: { label: dt("Anti Delete Roles"), text: dt("Stops the mass deletion of roles, and can rebuild them.") },
    role_assign: { label: dt("Anti Assign Roles"), text: dt("Takes back roles with dangerous permissions given to someone.") },
    unban: { label: dt("Anti Unban"), text: dt("Detects mass unbans, and can ban them again.") },
    emoji_delete: { label: dt("Anti Delete Emojis"), text: dt("Detects the mass deletion of emojis.") },
    emoji_create: { label: dt("Anti Create Emojis"), text: dt("Detects the mass creation of emojis.") },
    guild_update: { label: dt("Anti Server Changes"), text: dt("Watches who changes the name, the icon or the vanity again and again, and puts the name and the icon back.") },
    role_update: { label: dt("Anti Role Changes"), text: dt("Roles edited in a row. A role given Administrator or another dangerous permission answers at once, and the roles go back to how they were.") },
    channel_update: { label: dt("Anti Channel Changes"), text: dt("Channels renamed or their permissions changed in a row. A channel opened to @everyone with a dangerous permission answers at once, and the channels go back to how they were.") },
    mention_everyone: { label: dt("Anti Mass Mention"), text: dt("Pinging @everyone or @here again and again. The pings are deleted; bots are left alone.") },
    webhook_spam: { label: dt("Anti Webhook Spam"), text: dt("A webhook made by a person flooding messages: the webhook is deleted. Webhooks of bots and apps are left alone.") },
    prune: { label: dt("Anti Prune"), text: dt("Pruning members, a mass kick in one go.") }
  };
  const actionNames = {
    alert: dt("Only alert"),
    quarantine: dt("Take all their roles"),
    kick: dt("Kick"),
    ban: dt("Ban")
  };
  const active = protections.filter((p) => p.enabled).length;
  const tabs = [
    { id: "rules", label: dt("Protections") },
    { id: "lockdown", label: dt("Lockdown") },
    { id: "shared", label: dt("Shared settings") },
    { id: "guard", label: dt("Panic & owner") },
    { id: "log", label: dt("Log") }
  ];
  const ago = (iso) => new Date(iso).toLocaleString(dashLang, { dateStyle: "medium", timeStyle: "short" });
  const since = (iso) => agoText(dt, iso, { locale: dashLocale(dashLang) });
  const protection = (id) => protections.find((p) => p.id === id);
  const ruleIcon = (id) => RULES.find((r) => r.id === id)?.icon ?? "ph:shield-warning-fill";
  const channelName = (id) => channels.find((c) => c.id === id)?.name ?? id;
  const tileChannel = (id) => {
    const name = channelName(id);
    return `#${name.length > 11 ? `${name.slice(0, 10)}\u2026` : name}`;
  };
  const groups = [
    { id: "joins", title: dt("Joins"), hint: dt("Raids, accounts that are too new and bots that come in."), items: ["raid", "bot_add"] },
    { id: "members", title: dt("Members"), hint: dt("Mass bans, kicks, unbans and prunes."), items: ["ban", "kick", "unban", "prune"] },
    { id: "channels", title: dt("Channels"), hint: dt("Channels created, deleted or changed in a row."), items: ["channel_create", "channel_delete", "channel_update"] },
    { id: "roles", title: dt("Roles"), hint: dt("Roles created, deleted or changed, and dangerous roles handed out."), items: ["role_create", "role_delete", "role_update", "role_assign"] },
    { id: "server", title: dt("Server and messages"), hint: dt("The server itself, emojis, webhooks and mass pings."), items: ["guild_update", "emoji_create", "emoji_delete", "webhook", "webhook_spam", "mention_everyone"] }
  ];
  const isOn = (id) => id === "raid" ? join.raidEnabled : protection(id).enabled;
  const byRule = Object.entries(events.reduce((all, e) => ({ ...all, [e.rule]: (all[e.rule] ?? 0) + 1 }), {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const byPerson = Object.values(events.reduce((all, e) => ({ ...all, [e.executor_id]: { id: e.executor_id, name: e.executor_name ?? e.executor_id, n: (all[e.executor_id]?.n ?? 0) + 1 } }), {})).sort((a, b) => b.n - a.n).slice(0, 5);
  const restored = events.filter((e) => e.restored_at).length;
  const canRestore = events.filter((e) => !e.restored_at && (e.restorable.length > 0 || e.previous_roles.length > 0)).length;
  const lastWindow = events.filter((e) => Date.now() - new Date(e.created_at).getTime() < guard.panicWindow * 6e4).length;
  const ownTrust = (p) => p.whitelistRoleIds.length + p.whitelistIds.length;
  const withOwnTrust = protections.filter((p) => ownTrust(p) > 0).length;
  const sharedAccounts = shared.whitelistIds.split(/[\s,]+/).filter(Boolean).length;
  return renderTemplate(_a || (_a = __template(["", ` <script>
  // The rows open and close by themselves; the switch of a row saves it right away.
  // What a button did, in the toast of the dashboard (a plain alert without it).
  var anSay = function (text, ok, ms) { if (window.dglToast) window.dglToast(text, { kind: ok ? 'ok' : 'error', ms: ms }); };
  if (!window.__anBound) {
    window.__anBound = true;
    document.addEventListener('click', function (event) {
      var tab = event.target.closest && event.target.closest('[data-an-tab]');
      if (tab) {
        // The tabs change what is shown without loading the page again, so the menu on the side keeps its place and its animation.
        event.preventDefault();
        var wanted = tab.getAttribute('data-an-tab');
        document.querySelectorAll('[data-an-tab]').forEach(function (t) { t.classList.toggle('on', t === tab); });
        document.querySelectorAll('[data-an-panel]').forEach(function (panel) { panel.hidden = panel.getAttribute('data-an-panel') !== wanted; });
        try { history.replaceState(history.state, '', '?section=' + wanted); } catch (e) {}
        // A tab that was not read with the page is read now, only that part: the page itself is not loaded again.
        var panelEl = document.querySelector('[data-an-panel="' + wanted + '"]');
        if (panelEl && panelEl.hasAttribute('data-lazy') && !panelEl.hasAttribute('data-loading')) {
          panelEl.setAttribute('data-loading', '');
          // The panel is empty until it is read: it waits with grey blocks (shared placeholder) and is uncovered from the top down.
          var waiting = window.dglLoad ? window.dglLoad.wait(panelEl, { shape: 'rows', count: 8, delay: 0, min: 300 }) : null;
          if (!waiting) panelEl.classList.add('an-panel-loading');
          fetch('?section=' + wanted, { method: 'GET' })
            .then(function (r) { return r.text(); })
            .then(function (html) {
              var doc = new DOMParser().parseFromString(html, 'text/html');
              var fresh = doc.querySelector('[data-an-panel="' + wanted + '"]');
              if (!fresh) throw new Error('missing');
              var draw = function () {
                panelEl.innerHTML = fresh.innerHTML;
                panelEl.removeAttribute('data-lazy');
                panelEl.removeAttribute('data-loading');
                panelEl.classList.remove('an-panel-loading');
                panelEl.hidden = !document.querySelector('[data-an-tab="' + wanted + '"].on');
                if (window.dglInitContent) window.dglInitContent(panelEl);
              };
              if (waiting) waiting.done(draw); else draw();
            })
            .catch(function () { if (waiting) waiting.cancel(); location.href = '?section=' + wanted; });
        }
        return;
      }
      var open = event.target.closest && event.target.closest('[data-an-open]');
      var close = event.target.closest && event.target.closest('[data-an-close]');
      var restore = event.target.closest && event.target.closest('[data-an-restore]');
      var lock = event.target.closest && event.target.closest('[data-lockdown]');
      if (lock) {
        var guildId = location.pathname.replace(/^\\/(es|pt-br)(?=\\/)/i, '').split('/')[3];
        var starting = lock.getAttribute('data-lockdown') === 'start';
        // The question was asked by the button itself (data-confirm, DashConfirm.astro).
        var lockFailed = lock.getAttribute('data-failed') || 'It could not be done.';
        var reasonEl = document.querySelector('[data-lockdown-reason]');
        var minutesEl = document.querySelector('[data-lockdown-minutes]');
        lock.disabled = true;
        fetch('/dash/guild/' + guildId + '/lockdown-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: starting ? 'start' : 'end', reason: reasonEl ? reasonEl.value : '', minutes: minutesEl ? Number(minutesEl.value) : 0 }) })
          .then(function (r) { return r.json(); })
          .then(function (data) { if (data && data.ok) location.reload(); else { anSay((data && data.message) || lockFailed, false); lock.disabled = false; } })
          .catch(function () { anSay(lockFailed, false); lock.disabled = false; });
        return;
      }

      if (open || close) {
        var row = (open || close).closest('[data-an-row]');
        var body = row.querySelector('.an-body');
        var show = open ? body.hidden : false;
        body.hidden = !show;
        row.classList.toggle('open', show);
        var btn = row.querySelector('[data-an-open]');
        if (btn) btn.setAttribute('aria-expanded', show ? 'true' : 'false');
      }
      if (restore) {
        var restoreFailed = restore.getAttribute('data-failed') || 'It could not be restored.';
        var guild = location.pathname.replace(/^\\/(es|pt-br)(?=\\/)/i, '').split('/')[3];
        restore.disabled = true;
        fetch('/dash/guild/' + guild + '/antinuke-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: Number(restore.getAttribute('data-an-restore')) }) })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var lines = [].concat(data.done || [], data.failed || []);
            anSay(data.ok ? (lines.join(' \xB7 ') || restore.getAttribute('data-done') || 'Done.') : (data.message || lines.join(' \xB7 ') || restoreFailed), data.ok, 9000);
            // Read again in place, so the toast with what was put back stays on screen.
            if (data.ok) { if (window.dglRefreshPage) window.dglRefreshPage(true); else location.reload(); } else restore.disabled = false;
          })
          .catch(function () { anSay(restoreFailed, false); restore.disabled = false; });
      }
    });
    // The switch of a protection saves by itself, in the background, and the page stays as it is (nothing is read again or redrawn, no "unsaved changes" bar):
    // the switch has already moved, a small ring turns on its knob while it is saved, and it goes back with a toast only if the save fails.
    // A fast hand on many switches never sends a save twice at once for the same protection (each form is saved one change after the other), and never more
    // than three at a time in all, each one with the form as it is when its turn comes.
    var anTails = new WeakMap(); var anActive = 0; var anWaiting = [];
    var anPump = function () {
      while (anActive < 3 && anWaiting.length) {
        var job = anWaiting.shift(); anActive += 1;
        job().then(function () { anActive -= 1; anPump(); });
      }
    };
    var anRun = function (form, job) {
      var next = (anTails.get(form) || Promise.resolve()).then(function () { return new Promise(function (resolve) { anWaiting.push(function () { return job().then(resolve, resolve); }); anPump(); }); });
      anTails.set(form, next);
      return next;
    };
    var anWords = function () { var box = document.querySelector('[data-an-words]'); return { saved: (box && box.getAttribute('data-saved')) || 'Saved.', failed: (box && box.getAttribute('data-failed')) || 'It could not be saved, try again.' }; };
    var anRecount = function () {
      var count = document.querySelector('.an-count');
      if (!count) return;
      var on = document.querySelectorAll('[data-an-row] input[name="enabled"][data-an-auto]:checked').length;
      count.textContent = count.textContent.replace(/\\d+/, String(on));
    };
    document.addEventListener('change', function (event) {
      var input = event.target.closest && event.target.closest('[data-an-auto]');
      if (!input || !input.form) return;
      var form = input.form; var want = input.checked; var wrap = input.closest('.sx-switch'); var words = anWords();
      if (wrap) { wrap.setAttribute('data-anx-pending', String((Number(wrap.getAttribute('data-anx-pending')) || 0) + 1)); wrap.setAttribute('data-anx-busy', '1'); }
      anRecount();
      anRun(form, function () {
        return fetch(location.pathname + location.search, { method: 'POST', credentials: 'same-origin', headers: { 'X-Dash-Partial': '1' }, body: new FormData(form) })
          .then(function (res) {
            if (!res.ok) throw new Error(words.failed);
            return res.text();
          })
          .then(function (html) {
            // A refusal comes back as the page with a red line (the same sign the page uses for it).
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var bad = doc.querySelector('#dgl-content .sx-flash-bad');
            if (!doc.querySelector('#dgl-content') || bad) throw new Error((bad && bad.textContent.trim()) || words.failed);
          })
          .then(function () { if (window.dglToast) window.dglToast(words.saved, { kind: 'ok', ms: 1400 }); })
          .catch(function (error) {
            input.checked = !want;
            anRecount();
            anSay(error && error.message ? error.message : words.failed, false);
          })
          .then(function () {
            if (!wrap) return;
            var left = (Number(wrap.getAttribute('data-anx-pending')) || 1) - 1;
            wrap.setAttribute('data-anx-pending', String(left));
            if (left <= 0) wrap.removeAttribute('data-anx-busy');
          });
      });
    });
  }
<\/script> `], ["", ` <script>
  // The rows open and close by themselves; the switch of a row saves it right away.
  // What a button did, in the toast of the dashboard (a plain alert without it).
  var anSay = function (text, ok, ms) { if (window.dglToast) window.dglToast(text, { kind: ok ? 'ok' : 'error', ms: ms }); };
  if (!window.__anBound) {
    window.__anBound = true;
    document.addEventListener('click', function (event) {
      var tab = event.target.closest && event.target.closest('[data-an-tab]');
      if (tab) {
        // The tabs change what is shown without loading the page again, so the menu on the side keeps its place and its animation.
        event.preventDefault();
        var wanted = tab.getAttribute('data-an-tab');
        document.querySelectorAll('[data-an-tab]').forEach(function (t) { t.classList.toggle('on', t === tab); });
        document.querySelectorAll('[data-an-panel]').forEach(function (panel) { panel.hidden = panel.getAttribute('data-an-panel') !== wanted; });
        try { history.replaceState(history.state, '', '?section=' + wanted); } catch (e) {}
        // A tab that was not read with the page is read now, only that part: the page itself is not loaded again.
        var panelEl = document.querySelector('[data-an-panel="' + wanted + '"]');
        if (panelEl && panelEl.hasAttribute('data-lazy') && !panelEl.hasAttribute('data-loading')) {
          panelEl.setAttribute('data-loading', '');
          // The panel is empty until it is read: it waits with grey blocks (shared placeholder) and is uncovered from the top down.
          var waiting = window.dglLoad ? window.dglLoad.wait(panelEl, { shape: 'rows', count: 8, delay: 0, min: 300 }) : null;
          if (!waiting) panelEl.classList.add('an-panel-loading');
          fetch('?section=' + wanted, { method: 'GET' })
            .then(function (r) { return r.text(); })
            .then(function (html) {
              var doc = new DOMParser().parseFromString(html, 'text/html');
              var fresh = doc.querySelector('[data-an-panel="' + wanted + '"]');
              if (!fresh) throw new Error('missing');
              var draw = function () {
                panelEl.innerHTML = fresh.innerHTML;
                panelEl.removeAttribute('data-lazy');
                panelEl.removeAttribute('data-loading');
                panelEl.classList.remove('an-panel-loading');
                panelEl.hidden = !document.querySelector('[data-an-tab="' + wanted + '"].on');
                if (window.dglInitContent) window.dglInitContent(panelEl);
              };
              if (waiting) waiting.done(draw); else draw();
            })
            .catch(function () { if (waiting) waiting.cancel(); location.href = '?section=' + wanted; });
        }
        return;
      }
      var open = event.target.closest && event.target.closest('[data-an-open]');
      var close = event.target.closest && event.target.closest('[data-an-close]');
      var restore = event.target.closest && event.target.closest('[data-an-restore]');
      var lock = event.target.closest && event.target.closest('[data-lockdown]');
      if (lock) {
        var guildId = location.pathname.replace(/^\\\\/(es|pt-br)(?=\\\\/)/i, '').split('/')[3];
        var starting = lock.getAttribute('data-lockdown') === 'start';
        // The question was asked by the button itself (data-confirm, DashConfirm.astro).
        var lockFailed = lock.getAttribute('data-failed') || 'It could not be done.';
        var reasonEl = document.querySelector('[data-lockdown-reason]');
        var minutesEl = document.querySelector('[data-lockdown-minutes]');
        lock.disabled = true;
        fetch('/dash/guild/' + guildId + '/lockdown-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: starting ? 'start' : 'end', reason: reasonEl ? reasonEl.value : '', minutes: minutesEl ? Number(minutesEl.value) : 0 }) })
          .then(function (r) { return r.json(); })
          .then(function (data) { if (data && data.ok) location.reload(); else { anSay((data && data.message) || lockFailed, false); lock.disabled = false; } })
          .catch(function () { anSay(lockFailed, false); lock.disabled = false; });
        return;
      }

      if (open || close) {
        var row = (open || close).closest('[data-an-row]');
        var body = row.querySelector('.an-body');
        var show = open ? body.hidden : false;
        body.hidden = !show;
        row.classList.toggle('open', show);
        var btn = row.querySelector('[data-an-open]');
        if (btn) btn.setAttribute('aria-expanded', show ? 'true' : 'false');
      }
      if (restore) {
        var restoreFailed = restore.getAttribute('data-failed') || 'It could not be restored.';
        var guild = location.pathname.replace(/^\\\\/(es|pt-br)(?=\\\\/)/i, '').split('/')[3];
        restore.disabled = true;
        fetch('/dash/guild/' + guild + '/antinuke-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: Number(restore.getAttribute('data-an-restore')) }) })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var lines = [].concat(data.done || [], data.failed || []);
            anSay(data.ok ? (lines.join(' \xB7 ') || restore.getAttribute('data-done') || 'Done.') : (data.message || lines.join(' \xB7 ') || restoreFailed), data.ok, 9000);
            // Read again in place, so the toast with what was put back stays on screen.
            if (data.ok) { if (window.dglRefreshPage) window.dglRefreshPage(true); else location.reload(); } else restore.disabled = false;
          })
          .catch(function () { anSay(restoreFailed, false); restore.disabled = false; });
      }
    });
    // The switch of a protection saves by itself, in the background, and the page stays as it is (nothing is read again or redrawn, no "unsaved changes" bar):
    // the switch has already moved, a small ring turns on its knob while it is saved, and it goes back with a toast only if the save fails.
    // A fast hand on many switches never sends a save twice at once for the same protection (each form is saved one change after the other), and never more
    // than three at a time in all, each one with the form as it is when its turn comes.
    var anTails = new WeakMap(); var anActive = 0; var anWaiting = [];
    var anPump = function () {
      while (anActive < 3 && anWaiting.length) {
        var job = anWaiting.shift(); anActive += 1;
        job().then(function () { anActive -= 1; anPump(); });
      }
    };
    var anRun = function (form, job) {
      var next = (anTails.get(form) || Promise.resolve()).then(function () { return new Promise(function (resolve) { anWaiting.push(function () { return job().then(resolve, resolve); }); anPump(); }); });
      anTails.set(form, next);
      return next;
    };
    var anWords = function () { var box = document.querySelector('[data-an-words]'); return { saved: (box && box.getAttribute('data-saved')) || 'Saved.', failed: (box && box.getAttribute('data-failed')) || 'It could not be saved, try again.' }; };
    var anRecount = function () {
      var count = document.querySelector('.an-count');
      if (!count) return;
      var on = document.querySelectorAll('[data-an-row] input[name="enabled"][data-an-auto]:checked').length;
      count.textContent = count.textContent.replace(/\\\\d+/, String(on));
    };
    document.addEventListener('change', function (event) {
      var input = event.target.closest && event.target.closest('[data-an-auto]');
      if (!input || !input.form) return;
      var form = input.form; var want = input.checked; var wrap = input.closest('.sx-switch'); var words = anWords();
      if (wrap) { wrap.setAttribute('data-anx-pending', String((Number(wrap.getAttribute('data-anx-pending')) || 0) + 1)); wrap.setAttribute('data-anx-busy', '1'); }
      anRecount();
      anRun(form, function () {
        return fetch(location.pathname + location.search, { method: 'POST', credentials: 'same-origin', headers: { 'X-Dash-Partial': '1' }, body: new FormData(form) })
          .then(function (res) {
            if (!res.ok) throw new Error(words.failed);
            return res.text();
          })
          .then(function (html) {
            // A refusal comes back as the page with a red line (the same sign the page uses for it).
            var doc = new DOMParser().parseFromString(html, 'text/html');
            var bad = doc.querySelector('#dgl-content .sx-flash-bad');
            if (!doc.querySelector('#dgl-content') || bad) throw new Error((bad && bad.textContent.trim()) || words.failed);
          })
          .then(function () { if (window.dglToast) window.dglToast(words.saved, { kind: 'ok', ms: 1400 }); })
          .catch(function (error) {
            input.checked = !want;
            anRecount();
            anSay(error && error.message ? error.message : words.failed, false);
          })
          .then(function () {
            if (!wrap) return;
            var left = (Number(wrap.getAttribute('data-anx-pending')) || 1) - 1;
            wrap.setAttribute('data-anx-pending', String(left));
            if (left <= 0) wrap.removeAttribute('data-anx-busy');
          });
      });
    });
  }
<\/script> `])), renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "antinuke", "pageTitle": dt("Anti-raid & nuke"), "data-astro-cid-fenzbdkn": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-fenzbdkn": true })} ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-fenzbdkn": true })} ${maybeRenderHead()}<div class="anx-page" data-an-words${addAttribute(dt("Saved."), "data-saved")}${addAttribute(dt("It could not be saved, try again."), "data-failed")} data-astro-cid-fenzbdkn> <h1 data-astro-cid-fenzbdkn>${dt("Anti-raid & nuke")} <span class="an-count" data-astro-cid-fenzbdkn>${dt("{n} of {total} active", { n: active, total: protections.length })}</span></h1> ${renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "data-astro-cid-fenzbdkn": true })} ${saved && renderTemplate`<div class="sx-flash" data-astro-cid-fenzbdkn>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-fenzbdkn": true })}${dt("Saved.")}</div>`} ${failed && renderTemplate`<div class="sx-flash sx-flash-bad" data-astro-cid-fenzbdkn>${dt("It could not be saved, try again.")}</div>`} ${blocked && renderTemplate`<div class="sx-flash sx-flash-bad" data-astro-cid-fenzbdkn>${dt("Owner only is on: only the server owner and the trusted admins can change the anti-nuke.")}</div>`} <nav class="an-tabs" data-astro-cid-fenzbdkn> ${tabs.map((t) => renderTemplate`<a${addAttribute(`?section=${t.id}`, "href")}${addAttribute(["an-tab", { on: section === t.id }], "class:list")}${addAttribute(t.id, "data-an-tab")} data-astro-cid-fenzbdkn>${t.label}</a>`)} </nav> <div class="an-panel" data-an-panel="rules"${addAttribute(section !== "rules" ? "" : void 0, "data-lazy")}${addAttribute(section !== "rules", "hidden")} data-astro-cid-fenzbdkn> ${section === "rules" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Protections on"), value: active, tone: "joins" },
    { label: dt("Acted this week"), value: eventsWeek, tone: "leaves" },
    { label: dt("Anti Raid"), value: 0, text: join.raidEnabled ? dt("{n} in {a}", { n: join.raidThreshold, a: formatDuration(join.raidWindow) }) : dt("Off"), tone: "voice" },
    { label: dt("Anti Alt, minimum age"), value: 0, text: join.altEnabled ? formatDuration(join.altDays * 86400) : dt("Off"), tone: "invites" }
  ], "data-astro-cid-fenzbdkn": true })} ${groups.map((group) => renderTemplate`<div class="anx-group" data-astro-cid-fenzbdkn> <div class="anx-head" data-astro-cid-fenzbdkn> <h2 data-astro-cid-fenzbdkn>${group.title} <span class="anx-count" data-astro-cid-fenzbdkn>${dt("{n} of {total} on", { n: group.items.filter(isOn).length, total: group.items.length })}</span></h2> <p data-astro-cid-fenzbdkn>${group.hint}</p> </div> <div class="an-list dgl-stagger" data-astro-cid-fenzbdkn> ${group.items.map((id) => {
    if (id === "raid") return renderTemplate`<form method="POST" class="an-row" data-an-row data-astro-cid-fenzbdkn> <input type="hidden" name="action" value="save_join" data-astro-cid-fenzbdkn> <div class="an-head" data-astro-cid-fenzbdkn> <button type="button" class="an-open" data-an-open aria-expanded="false" data-astro-cid-fenzbdkn> <span class="an-ico" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "16", "height": "16", "data-astro-cid-fenzbdkn": true })}</span> <span class="an-text" data-astro-cid-fenzbdkn><b data-astro-cid-fenzbdkn>${dt("Anti Raid")}</b><em data-astro-cid-fenzbdkn>${dt("Reacts when many accounts join in a few seconds.")}</em></span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "an-caret", "width": "13", "height": "13", "data-astro-cid-fenzbdkn": true })} </button> <label class="sx-switch anx-sw" data-astro-cid-fenzbdkn><input type="checkbox" name="anti_raid_enabled"${addAttribute(join.raidEnabled, "checked")} data-an-auto data-no-dirty${addAttribute(dt("Anti Raid"), "aria-label")} data-astro-cid-fenzbdkn><span class="sx-toggle" data-astro-cid-fenzbdkn></span></label> </div> <div class="an-body" hidden data-astro-cid-fenzbdkn> <div class="sx-grid" data-astro-cid-fenzbdkn> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-raid-n" data-astro-cid-fenzbdkn>${dt("Joins that count as a raid")}</label>${renderComponent($$result3, "SxNumber", $$SxNumber, { "id": "an-raid-n", "name": "raid_join_threshold", "value": join.raidThreshold, "min": 2, "max": 50, "data-astro-cid-fenzbdkn": true })}</div> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-raid-s" data-astro-cid-fenzbdkn>${dt("In how many seconds")}</label>${renderComponent($$result3, "SxNumber", $$SxNumber, { "id": "an-raid-s", "name": "raid_window_seconds", "value": join.raidWindow, "min": 5, "max": 120, "data-astro-cid-fenzbdkn": true })}</div> </div> <div class="sx-field" data-astro-cid-fenzbdkn><span class="sx-label" data-astro-cid-fenzbdkn>${dt("What to do")}</span> <div class="dfx-chips" data-astro-cid-fenzbdkn> <label class="dfx-chip" data-astro-cid-fenzbdkn><input type="radio" name="raid_action" value="alert"${addAttribute(join.raidAction === "alert", "checked")} data-astro-cid-fenzbdkn>${dt("Only alert")}</label> <label class="dfx-chip" data-astro-cid-fenzbdkn><input type="radio" name="raid_action" value="kick"${addAttribute(join.raidAction === "kick", "checked")} data-astro-cid-fenzbdkn>${dt("Kick")}</label> <label class="dfx-chip" data-astro-cid-fenzbdkn><input type="radio" name="raid_action" value="lockdown"${addAttribute(join.raidAction === "lockdown", "checked")} data-astro-cid-fenzbdkn>${dt("Start a lockdown")}</label> </div> </div> <div class="sx-sub" data-astro-cid-fenzbdkn> <label class="sx-switch" data-astro-cid-fenzbdkn><input type="checkbox" name="anti_alt_enabled"${addAttribute(join.altEnabled, "checked")} data-astro-cid-fenzbdkn><span class="sx-switch-text" data-astro-cid-fenzbdkn><b data-astro-cid-fenzbdkn>${dt("Anti Alt: catch accounts that are too new when they join")}</b></span><span class="sx-toggle" data-astro-cid-fenzbdkn></span></label> <div class="anx-needs" data-sx-needs="anti_alt_enabled" data-astro-cid-fenzbdkn> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-alt-d" data-astro-cid-fenzbdkn>${dt("Minimum account age (days)")}</label>${renderComponent($$result3, "SxNumber", $$SxNumber, { "id": "an-alt-d", "name": "anti_alt_min_age_days", "value": join.altDays, "min": 1, "max": 365, "data-astro-cid-fenzbdkn": true })}</div> <div class="sx-field" data-astro-cid-fenzbdkn><span class="sx-label" data-astro-cid-fenzbdkn>${dt("What to do")}</span> <div class="dfx-chips" data-astro-cid-fenzbdkn> <label class="dfx-chip" data-astro-cid-fenzbdkn><input type="radio" name="anti_alt_action" value="kick"${addAttribute(join.altAction === "kick", "checked")} data-astro-cid-fenzbdkn>${dt("Kick")}</label> <label class="dfx-chip" data-astro-cid-fenzbdkn><input type="radio" name="anti_alt_action" value="flag"${addAttribute(join.altAction === "flag", "checked")} data-astro-cid-fenzbdkn>${dt("Only flag")}</label> </div> </div> </div> </div> <div class="an-foot" data-astro-cid-fenzbdkn><button type="button" class="btn btn-ghost btn-sm" data-an-close data-astro-cid-fenzbdkn>${dt("Close")}</button><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-fenzbdkn": true })}${dt("Save")}</button></div> </div> </form>`;
    const meta = RULES.find((r) => r.id === id);
    const p = protection(id);
    const info = names[id];
    return renderTemplate`<form method="POST" class="an-row" data-an-row data-astro-cid-fenzbdkn> <input type="hidden" name="action" value="save_rule" data-astro-cid-fenzbdkn> <input type="hidden" name="rule"${addAttribute(meta.id, "value")} data-astro-cid-fenzbdkn> <div class="an-head" data-astro-cid-fenzbdkn> <button type="button" class="an-open" data-an-open aria-expanded="false" data-astro-cid-fenzbdkn> <span class="an-ico" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": meta.icon, "width": "16", "height": "16", "data-astro-cid-fenzbdkn": true })}</span> <span class="an-text" data-astro-cid-fenzbdkn><b data-astro-cid-fenzbdkn>${info.label}</b><em data-astro-cid-fenzbdkn>${info.text}</em></span> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "an-caret", "width": "13", "height": "13", "data-astro-cid-fenzbdkn": true })} </button> ${p.followsOldSwitch && renderTemplate`<span class="anx-old"${addAttribute(dt("It follows the old single switch. Save it to tune it on its own."), "title")} data-astro-cid-fenzbdkn>${dt("Old switch")}</span>`} <label class="sx-switch anx-sw" data-astro-cid-fenzbdkn><input type="checkbox" name="enabled"${addAttribute(p.enabled, "checked")} data-an-auto data-no-dirty${addAttribute(info.label, "aria-label")} data-astro-cid-fenzbdkn><span class="sx-toggle" data-astro-cid-fenzbdkn></span></label> </div> <div class="an-body" hidden data-astro-cid-fenzbdkn> <div class="sx-grid" data-astro-cid-fenzbdkn> <div class="sx-field" data-astro-cid-fenzbdkn><label${addAttribute(`an-${id}-n`, "for")} data-astro-cid-fenzbdkn>${dt("Actions that count as an attack")}</label>${renderComponent($$result3, "SxNumber", $$SxNumber, { "id": `an-${id}-n`, "name": "threshold", "value": p.threshold, "min": 1, "max": 50, "data-astro-cid-fenzbdkn": true })}</div> <div class="sx-field" data-astro-cid-fenzbdkn><label${addAttribute(`an-${id}-s`, "for")} data-astro-cid-fenzbdkn>${dt("In how many seconds")}</label>${renderComponent($$result3, "SxNumber", $$SxNumber, { "id": `an-${id}-s`, "name": "window_seconds", "value": p.window, "min": 2, "max": 600, "data-astro-cid-fenzbdkn": true })}</div> </div> <div class="sx-field" data-astro-cid-fenzbdkn><span class="sx-label" data-astro-cid-fenzbdkn>${dt("What to do to the account")}</span> <div class="dfx-chips" data-astro-cid-fenzbdkn>${ACTIONS.map((a) => renderTemplate`<label class="dfx-chip" data-astro-cid-fenzbdkn><input type="radio" name="rule_action"${addAttribute(a, "value")}${addAttribute(p.action === a, "checked")} data-astro-cid-fenzbdkn>${actionNames[a]}</label>`)}</div> </div> <div class="sx-field" data-astro-cid-fenzbdkn><label${addAttribute(`an-${id}-ch`, "for")} data-astro-cid-fenzbdkn>${dt("Alert channel")}</label> <select${addAttribute(`an-${id}-ch`, "id")} name="alert_channel_id" data-astro-cid-fenzbdkn><option value="" data-astro-cid-fenzbdkn>${dt("The automod log (or the shared channel)")}</option>${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === p.alertChannelId, "selected")} data-astro-cid-fenzbdkn>#${c.name}</option>`)}</select> </div> <div class="sx-field" data-astro-cid-fenzbdkn><span class="sx-label" data-astro-cid-fenzbdkn>${dt("Trusted roles for this protection")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "name": "whitelist_role_ids", "options": roles, "selected": p.whitelistRoleIds, "placeholder": dt("Search roles..."), "data-astro-cid-fenzbdkn": true })}</div> <div class="sx-field" data-astro-cid-fenzbdkn><label${addAttribute(`an-${id}-ids`, "for")} data-astro-cid-fenzbdkn>${dt("Trusted accounts for this protection (IDs)")}</label><textarea${addAttribute(`an-${id}-ids`, "id")} name="whitelist_ids" class="dgl-autogrow sx-one" rows="1" data-one-line${addAttribute(dt("Paste user IDs, separated by commas"), "placeholder")} data-astro-cid-fenzbdkn>${p.whitelistIds.join(", ")}</textarea></div> <p class="sx-hint" data-astro-cid-fenzbdkn>${dt("Whoever is in the shared settings is trusted here too. A bot doing the attack is banned, whatever you pick.")}</p> <div class="an-foot" data-astro-cid-fenzbdkn><button type="button" class="btn btn-ghost btn-sm" data-an-close data-astro-cid-fenzbdkn>${dt("Close")}</button><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-fenzbdkn": true })}${dt("Save")}</button></div> </div> </form>`;
  })} </div> </div>`)}` })}`} </div> <div class="an-panel" data-an-panel="lockdown"${addAttribute(section !== "lockdown" ? "" : void 0, "data-lazy")}${addAttribute(section !== "lockdown", "hidden")} data-astro-cid-fenzbdkn> ${section === "lockdown" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Lockdown"), value: 0, text: lockdownActive ? dt("On") : dt("Off"), tone: lockdownActive ? "leaves" : "joins" },
    { label: dt("Channels it closes"), value: lockdownConfig.channelIds.length, text: lockdownConfig.channelIds.length ? void 0 : dt("Every text channel"), tone: "messages" },
    { label: dt("Ends by itself"), value: 0, text: lockdownConfig.autoEndMinutes ? formatDuration(lockdownConfig.autoEndMinutes * 60) : dt("Never"), tone: "voice" },
    { label: dt("Notice"), value: 0, text: lockdownConfig.announceChannelId ? tileChannel(lockdownConfig.announceChannelId) : dt("No notice"), tone: "invites" }
  ], "data-astro-cid-fenzbdkn": true })} <div class="sx-duo anx-duo" data-astro-cid-fenzbdkn> <div class="sx-stack" data-astro-cid-fenzbdkn> <div class="sx-panel" data-astro-cid-fenzbdkn> <div class="sx-panel-head" data-astro-cid-fenzbdkn> <span class="sx-panel-icon"${addAttribute(`--c:${lockdownActive ? "var(--red, #ff6b6b)" : "var(--green)"}`, "style")} data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": lockdownActive ? "ph:lock-fill" : "ph:lock-simple-open-fill", "width": "17", "height": "17", "data-astro-cid-fenzbdkn": true })}</span> <h2 data-astro-cid-fenzbdkn>${lockdownActive ? dt("Lockdown is ON") : dt("Lockdown is off")}</h2> <span${addAttribute(["sx-pill-state", { on: !lockdownActive }], "class:list")} data-astro-cid-fenzbdkn>${lockdownActive ? dt("On") : dt("Off")}</span> </div> <p class="sx-lead" data-astro-cid-fenzbdkn>${dt("A lockdown closes the channels so nobody can write, pauses the invites and can raise the verification, and puts everything back when it ends. Use it while a raid lasts. Anti Raid can start it by itself.")}</p> ${lockdownActive ? renderTemplate`<div class="anx-live" data-astro-cid-fenzbdkn> <div class="sx-row" data-astro-cid-fenzbdkn><span class="anx-k" data-astro-cid-fenzbdkn>${dt("Since")}</span><b data-astro-cid-fenzbdkn>${ago(lockdownActive.startedAt)}</b></div> <div class="sx-row" data-astro-cid-fenzbdkn><span class="anx-k" data-astro-cid-fenzbdkn>${dt("Ends")}</span><b data-astro-cid-fenzbdkn>${lockdownActive.endsAt ? ago(lockdownActive.endsAt) : dt("It stays until you end it.")}</b></div> <div class="sx-row" data-astro-cid-fenzbdkn><span class="anx-k" data-astro-cid-fenzbdkn>${dt("Channels closed")}</span><b data-astro-cid-fenzbdkn>${lockdownActive.channels}</b></div> ${lockdownActive.reason && renderTemplate`<p class="sx-hint" data-astro-cid-fenzbdkn>${lockdownActive.reason}</p>`} <div class="an-foot" data-astro-cid-fenzbdkn><button type="button" class="btn btn-accent btn-sm" data-lockdown="end"${addAttribute(dt("End the lockdown and reopen everything?"), "data-confirm")} data-confirm-tone="neutral"${addAttribute(dt("It could not be done."), "data-failed")} data-astro-cid-fenzbdkn>${dt("End the lockdown")}</button></div> </div>` : renderTemplate`<div class="anx-start" data-astro-cid-fenzbdkn> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-lock-reason" data-astro-cid-fenzbdkn>${dt("Reason (optional)")}</label><textarea id="an-lock-reason" class="dgl-autogrow sx-one" rows="1" data-one-line data-count data-lockdown-reason maxlength="300" data-astro-cid-fenzbdkn></textarea></div> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-lock-min" data-astro-cid-fenzbdkn>${dt("Minutes until it ends (0 uses the setting below)")}</label>${renderComponent($$result3, "SxNumber", $$SxNumber, { "id": "an-lock-min", "data-lockdown-minutes": true, "value": 0, "min": 0, "max": 10080, "data-astro-cid-fenzbdkn": true })}</div> <div data-astro-cid-fenzbdkn><button type="button" class="btn btn-accent btn-sm an-danger" data-lockdown="start"${addAttribute(dt("Start a lockdown now? The channels will be closed."), "data-confirm")}${addAttribute(dt("It could not be done."), "data-failed")} data-astro-cid-fenzbdkn>${dt("Start a lockdown now")}</button></div> </div>`} </div> <div class="sx-panel" data-astro-cid-fenzbdkn> <div class="sx-panel-head" data-astro-cid-fenzbdkn> <span class="sx-panel-icon" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-fenzbdkn": true })}</span> <h2 data-astro-cid-fenzbdkn>${dt("What it will do now")}</h2> </div> <div class="anx-facts" data-astro-cid-fenzbdkn> <div class="sx-row" data-astro-cid-fenzbdkn><span class="anx-k" data-astro-cid-fenzbdkn>${dt("Channels closed")}</span><b data-astro-cid-fenzbdkn>${lockdownConfig.channelIds.length ? dt("{n} channel(s)", { n: lockdownConfig.channelIds.length }) : dt("Every text channel")}</b></div> <div class="sx-row" data-astro-cid-fenzbdkn><span class="anx-k" data-astro-cid-fenzbdkn>${dt("Invites")}</span><b data-astro-cid-fenzbdkn>${lockdownConfig.pauseInvites ? dt("Deleted and blocked") : dt("Left alone")}</b></div> <div class="sx-row" data-astro-cid-fenzbdkn><span class="anx-k" data-astro-cid-fenzbdkn>${dt("Verification level")}</span><b data-astro-cid-fenzbdkn>${lockdownConfig.raiseVerification ? dt("Raised to High") : dt("Not changed")}</b></div> <div class="sx-row" data-astro-cid-fenzbdkn><span class="anx-k" data-astro-cid-fenzbdkn>${dt("It ends")}</span><b data-astro-cid-fenzbdkn>${lockdownConfig.autoEndMinutes ? dt("After {a}", { a: formatDuration(lockdownConfig.autoEndMinutes * 60) }) : dt("When you end it")}</b></div> <div class="sx-row" data-astro-cid-fenzbdkn><span class="anx-k" data-astro-cid-fenzbdkn>${dt("Notice")}</span><b data-astro-cid-fenzbdkn>${lockdownConfig.announceChannelId ? `#${channelName(lockdownConfig.announceChannelId)}` : dt("No notice")}</b></div> </div> </div> </div> <form method="POST" class="sx-panel anx-lock-form" data-astro-cid-fenzbdkn> <input type="hidden" name="action" value="save_lockdown" data-astro-cid-fenzbdkn> <div class="sx-panel-head" data-astro-cid-fenzbdkn> <span class="sx-panel-icon" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:sliders-fill", "width": "17", "height": "17", "data-astro-cid-fenzbdkn": true })}</span> <h2 data-astro-cid-fenzbdkn>${dt("What a lockdown does")}</h2> </div> <div class="sx-field" data-astro-cid-fenzbdkn><span class="sx-label" data-astro-cid-fenzbdkn>${dt("Channels it closes (none chosen means every text channel)")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "name": "channel_ids", "options": channels, "selected": lockdownConfig.channelIds, "placeholder": dt("Search channels..."), "data-astro-cid-fenzbdkn": true })}</div> <div class="sx-switches anx-one-col" data-astro-cid-fenzbdkn> <label class="sx-switch" data-astro-cid-fenzbdkn><input type="checkbox" name="pause_invites"${addAttribute(lockdownConfig.pauseInvites, "checked")} data-astro-cid-fenzbdkn><span class="sx-switch-text" data-astro-cid-fenzbdkn><b data-astro-cid-fenzbdkn>${dt("Delete the invites and block new ones")}</b></span><span class="sx-toggle" data-astro-cid-fenzbdkn></span></label> <label class="sx-switch" data-astro-cid-fenzbdkn><input type="checkbox" name="raise_verification"${addAttribute(lockdownConfig.raiseVerification, "checked")} data-astro-cid-fenzbdkn><span class="sx-switch-text" data-astro-cid-fenzbdkn><b data-astro-cid-fenzbdkn>${dt("Raise the verification level of the server to High while it lasts")}</b></span><span class="sx-toggle" data-astro-cid-fenzbdkn></span></label> </div> <div class="sx-grid" data-astro-cid-fenzbdkn> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-lock-auto" data-astro-cid-fenzbdkn>${dt("Ends by itself after (minutes, 0 for never)")}</label>${renderComponent($$result3, "SxNumber", $$SxNumber, { "id": "an-lock-auto", "name": "auto_end_minutes", "value": lockdownConfig.autoEndMinutes, "min": 0, "max": 10080, "data-astro-cid-fenzbdkn": true })}</div> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-lock-ann" data-astro-cid-fenzbdkn>${dt("Channel for the notice")}</label> <select id="an-lock-ann" name="announce_channel_id" data-astro-cid-fenzbdkn><option value="" data-astro-cid-fenzbdkn>${dt("No notice")}</option>${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === lockdownConfig.announceChannelId, "selected")} data-astro-cid-fenzbdkn>#${c.name}</option>`)}</select> </div> </div> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-lock-msg" data-astro-cid-fenzbdkn>${dt("The notice")}</label><textarea id="an-lock-msg" name="message" class="dgl-autogrow" rows="2" maxlength="500" data-count${addAttribute(dt("This server is in lockdown for a moment. The staff is working on it, thank you for waiting."), "placeholder")} data-ac="roles,channels,commands,emojis" data-astro-cid-fenzbdkn>${lockdownConfig.message}</textarea>${renderComponent($$result3, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-fenzbdkn": true })}</div> <div class="an-foot" data-astro-cid-fenzbdkn><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-fenzbdkn": true })}${dt("Save")}</button></div> </form> </div> ` })}`} </div> <div class="an-panel" data-an-panel="shared"${addAttribute(section !== "shared" ? "" : void 0, "data-lazy")}${addAttribute(section !== "shared", "hidden")} data-astro-cid-fenzbdkn> ${section === "shared" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Trusted roles"), value: shared.whitelistRoleIds.length, tone: "joins" },
    { label: dt("Trusted accounts"), value: sharedAccounts, tone: "voice" },
    { label: dt("With own list"), value: withOwnTrust, tone: "invites" },
    { label: dt("Alert channel"), value: 0, text: shared.alertChannelId ? tileChannel(shared.alertChannelId) : dt("Automod log"), tone: "messages" }
  ], "data-astro-cid-fenzbdkn": true })} <form method="POST" class="sx-panel anx-shared-form" data-astro-cid-fenzbdkn> <input type="hidden" name="action" value="save_shared" data-astro-cid-fenzbdkn> <div class="sx-panel-head" data-astro-cid-fenzbdkn> <span class="sx-panel-icon" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "17", "height": "17", "data-astro-cid-fenzbdkn": true })}</span> <h2 data-astro-cid-fenzbdkn>${dt("Trusted by every protection")}</h2> </div> <div class="sx-grid" data-astro-cid-fenzbdkn> <div class="sx-field" data-astro-cid-fenzbdkn><span class="sx-label" data-astro-cid-fenzbdkn>${dt("Trusted roles")}</span>${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "name": "whitelist_role_ids", "options": roles, "selected": shared.whitelistRoleIds, "placeholder": dt("Search roles..."), "data-astro-cid-fenzbdkn": true })}</div> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-sh-ids" data-astro-cid-fenzbdkn>${dt("Trusted accounts and bots (IDs)")}</label><textarea id="an-sh-ids" name="whitelist_ids" class="dgl-autogrow" rows="2"${addAttribute(dt("Paste user IDs, separated by commas"), "placeholder")} data-astro-cid-fenzbdkn>${shared.whitelistIds}</textarea></div> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-sh-ch" data-astro-cid-fenzbdkn>${dt("Alert channel for every protection")}</label> <select id="an-sh-ch" name="alert_channel_id" data-astro-cid-fenzbdkn><option value="" data-astro-cid-fenzbdkn>${dt("The automod log")}</option>${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === shared.alertChannelId, "selected")} data-astro-cid-fenzbdkn>#${c.name}</option>`)}</select> <p class="sx-hint" data-astro-cid-fenzbdkn>${dt("The server owner and Petto are always trusted.")}</p> </div> ${shared.oldSwitch && renderTemplate`<div class="anx-old-box sx-wide" data-astro-cid-fenzbdkn> <input type="hidden" name="old_switch_present" value="1" data-astro-cid-fenzbdkn> <label class="sx-switch" data-astro-cid-fenzbdkn><input type="checkbox" name="old_switch" checked data-astro-cid-fenzbdkn><span class="sx-switch-text" data-astro-cid-fenzbdkn><b data-astro-cid-fenzbdkn>${dt("Old single switch is on")}</b><em data-astro-cid-fenzbdkn>${dt("The protections you have not tuned yet follow this switch (ban, kick, channels, roles, webhooks and emojis, counted together). Turn it off after tuning each one.")}</em></span><span class="sx-toggle" data-astro-cid-fenzbdkn></span></label> </div>`} </div> <div class="an-foot" data-astro-cid-fenzbdkn><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-fenzbdkn": true })}${dt("Save")}</button></div> </form> <div class="sx-panel" data-astro-cid-fenzbdkn> <div class="sx-panel-head" data-astro-cid-fenzbdkn> <span class="sx-panel-icon" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-fenzbdkn": true })}</span> <h2 data-astro-cid-fenzbdkn>${dt("Trust in each protection")}</h2> </div> <p class="sx-lead" data-astro-cid-fenzbdkn>${dt("Every protection trusts the shared list. A protection can also have a list of its own.")}</p> <div class="anx-trust anx-trust-2" data-astro-cid-fenzbdkn> ${RULES.map((meta) => {
    const p = protection(meta.id);
    return renderTemplate`<div class="anx-trust-row" data-astro-cid-fenzbdkn> <span class="an-ico anx-mini" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": meta.icon, "width": "14", "height": "14", "data-astro-cid-fenzbdkn": true })}</span> <span class="anx-trust-name" data-astro-cid-fenzbdkn>${names[meta.id].label}</span> ${ownTrust(p) > 0 ? renderTemplate`<span class="sx-tag sx-tag-accent" data-astro-cid-fenzbdkn>${dt("Own list: {n}", { n: ownTrust(p) })}</span>` : renderTemplate`<span class="sx-tag" data-astro-cid-fenzbdkn>${dt("Shared list only")}</span>`} </div>`;
  })} </div> </div> ` })}`} </div> <div class="an-panel" data-an-panel="guard"${addAttribute(section !== "guard" ? "" : void 0, "data-lazy")}${addAttribute(section !== "guard", "hidden")} data-astro-cid-fenzbdkn> ${section === "guard" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Panic mode"), value: 0, text: guard.panicEnabled ? dt("On") : dt("Off"), tone: guard.panicEnabled ? "joins" : "leaves" },
    { label: dt("Starts at"), value: 0, text: dt("{n} in {a}", { n: guard.panicThreshold, a: formatDuration(guard.panicWindow * 60) }), tone: "voice" },
    { label: dt("Lockdown lasts"), value: 0, text: formatDuration(guard.panicMinutes * 60), tone: "messages" },
    { label: dt("Owner only"), value: 0, text: guard.ownerOnly ? dt("On") : dt("Off"), tone: "invites" },
    { label: dt("Trusted admins"), value: guard.adminIds.length, tone: "reactions" }
  ], "data-astro-cid-fenzbdkn": true })} <form method="POST" class="anx-guard" data-astro-cid-fenzbdkn> <input type="hidden" name="action" value="save_guard" data-astro-cid-fenzbdkn> <div class="sx-duo anx-duo" data-astro-cid-fenzbdkn> <div class="sx-panel" data-astro-cid-fenzbdkn> <div class="sx-panel-head" data-astro-cid-fenzbdkn> <span class="sx-panel-icon" style="--c:var(--red, #ff6b6b)" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:siren-fill", "width": "17", "height": "17", "data-astro-cid-fenzbdkn": true })}</span> <h2 data-astro-cid-fenzbdkn>${dt("Panic mode")}</h2> </div> <p class="sx-lead" data-astro-cid-fenzbdkn>${dt("When several protections act in a few minutes, or Anti Raid sees a raid, the server is locked down at once: the channels close and the invites are deleted and paused. It ends by itself after the minutes below, or earlier from the Lockdown tab.")}</p> <label class="sx-switch" data-astro-cid-fenzbdkn><input type="checkbox" name="panic_enabled"${addAttribute(guard.panicEnabled, "checked")} data-astro-cid-fenzbdkn><span class="sx-switch-text" data-astro-cid-fenzbdkn><b data-astro-cid-fenzbdkn>${dt("Turn panic mode on")}</b></span><span class="sx-toggle" data-astro-cid-fenzbdkn></span></label> <div class="anx-needs" data-sx-needs="panic_enabled" data-astro-cid-fenzbdkn> <div class="sx-grid" data-astro-cid-fenzbdkn> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-pn-t" data-astro-cid-fenzbdkn>${dt("Protections acting that start it")}</label>${renderComponent($$result3, "SxNumber", $$SxNumber, { "id": "an-pn-t", "name": "panic_threshold", "value": guard.panicThreshold, "min": 1, "max": 20, "data-astro-cid-fenzbdkn": true })}</div> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-pn-w" data-astro-cid-fenzbdkn>${dt("Within how many minutes")}</label>${renderComponent($$result3, "SxNumber", $$SxNumber, { "id": "an-pn-w", "name": "panic_window_minutes", "value": guard.panicWindow, "min": 1, "max": 120, "data-astro-cid-fenzbdkn": true })}</div> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-pn-m" data-astro-cid-fenzbdkn>${dt("Lockdown ends by itself after (minutes)")}</label>${renderComponent($$result3, "SxNumber", $$SxNumber, { "id": "an-pn-m", "name": "panic_lockdown_minutes", "value": guard.panicMinutes, "min": 1, "max": 1440, "data-astro-cid-fenzbdkn": true })}</div> </div> <label class="sx-switch" data-astro-cid-fenzbdkn><input type="checkbox" name="panic_on_raid"${addAttribute(guard.panicOnRaid, "checked")} data-astro-cid-fenzbdkn><span class="sx-switch-text" data-astro-cid-fenzbdkn><b data-astro-cid-fenzbdkn>${dt("Also when Anti Raid sees a raid")}</b></span><span class="sx-toggle" data-astro-cid-fenzbdkn></span></label> </div> </div> <div class="sx-panel" data-astro-cid-fenzbdkn> <div class="sx-panel-head" data-astro-cid-fenzbdkn> <span class="sx-panel-icon" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "17", "height": "17", "data-astro-cid-fenzbdkn": true })}</span> <h2 data-astro-cid-fenzbdkn>${dt("Owner")}</h2> </div> <label class="sx-switch" data-astro-cid-fenzbdkn><input type="checkbox" name="dm_owner"${addAttribute(guard.dmOwner, "checked")} data-astro-cid-fenzbdkn><span class="sx-switch-text" data-astro-cid-fenzbdkn><b data-astro-cid-fenzbdkn>${dt("Send the owner a DM when a protection acts")}</b></span><span class="sx-toggle" data-astro-cid-fenzbdkn></span></label> <label class="sx-switch" data-astro-cid-fenzbdkn><input type="checkbox" name="owner_only"${addAttribute(guard.ownerOnly, "checked")}${addAttribute(!viewerIsOwner, "disabled")} data-astro-cid-fenzbdkn><span class="sx-switch-text" data-astro-cid-fenzbdkn><b data-astro-cid-fenzbdkn>${dt("Owner only: only the owner and the trusted admins can change the anti-nuke and restore")}</b></span><span class="sx-toggle" data-astro-cid-fenzbdkn></span></label> <div class="sx-field" data-astro-cid-fenzbdkn><label for="an-admins" data-astro-cid-fenzbdkn>${dt("Trusted admins (IDs): they can change the anti-nuke and the protections never touch them")}</label><textarea id="an-admins" name="admin_ids" class="dgl-autogrow" rows="2"${addAttribute(!viewerIsOwner, "disabled")}${addAttribute(dt("Paste user IDs, separated by commas"), "placeholder")} data-astro-cid-fenzbdkn>${guard.adminIds.join(", ")}</textarea></div> ${!viewerIsOwner && renderTemplate`<p class="sx-hint" data-astro-cid-fenzbdkn>${dt("Only the server owner can change owner only and the trusted admins.")}</p>`} <p class="sx-hint" data-astro-cid-fenzbdkn>${dt("The protections never act on the owner, on Petto or on an account whose role is at or above Petto's.")}</p> </div> </div> <div class="an-foot" data-astro-cid-fenzbdkn><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-fenzbdkn": true })}${dt("Save")}</button></div> </form> <div class="sx-panel" data-astro-cid-fenzbdkn> <div class="sx-panel-head" data-astro-cid-fenzbdkn> <span class="sx-panel-icon" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise-fill", "width": "17", "height": "17", "data-astro-cid-fenzbdkn": true })}</span> <h2 data-astro-cid-fenzbdkn>${dt("Latest actions")}</h2> <span class="anx-count" data-astro-cid-fenzbdkn>${dt("{n} in the last {a}", { n: lastWindow, a: formatDuration(guard.panicWindow * 60) })}</span> </div> ${events.length === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "18", "height": "18", "data-astro-cid-fenzbdkn": true })}${dt("No protection has acted yet.")}</p>` : renderTemplate`<div class="anx-trust" data-astro-cid-fenzbdkn> ${events.slice(0, 5).map((e) => renderTemplate`<div class="anx-trust-row" data-astro-cid-fenzbdkn> <span class="an-ico anx-mini" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": ruleIcon(e.rule), "width": "14", "height": "14", "data-astro-cid-fenzbdkn": true })}</span> <span class="anx-trust-name" data-astro-cid-fenzbdkn><b data-astro-cid-fenzbdkn>${names[e.rule]?.label ?? e.rule}</b> · ${e.executor_name ?? e.executor_id}</span> <span${addAttribute(`sx-tag anx-act-${e.action}`, "class")} data-astro-cid-fenzbdkn>${actionNames[e.action] ?? e.action}</span> <time class="anx-when"${addAttribute(e.created_at, "datetime")} data-astro-cid-fenzbdkn>${since(e.created_at)}</time> </div>`)} </div>`} </div> ` })}`} </div> <div class="an-panel" data-an-panel="log"${addAttribute(section !== "log" ? "" : void 0, "data-lazy")}${addAttribute(section !== "log", "hidden")} data-astro-cid-fenzbdkn> ${section === "log" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Actions shown"), value: events.length, tone: "messages" },
    { label: dt("Restored"), value: restored, tone: "joins" },
    { label: dt("Can be restored"), value: canRestore, tone: "invites" },
    { label: dt("Last action"), value: 0, text: events.length ? since(events[0].created_at) : dt("None"), tone: "voice" }
  ], "data-astro-cid-fenzbdkn": true })} ${events.length === 0 ? renderTemplate`<div class="anx-empty" data-astro-cid-fenzbdkn> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "28", "height": "28", "data-astro-cid-fenzbdkn": true })} <b data-astro-cid-fenzbdkn>${dt("No protection has acted yet.")}</b> <p data-astro-cid-fenzbdkn>${dt("When a protection acts, it shows up here, and you can put back what it stopped.")}</p> </div>` : renderTemplate`<div class="anx-split" data-astro-cid-fenzbdkn> <div class="sx-panel" data-astro-cid-fenzbdkn> <div class="sx-panel-head" data-astro-cid-fenzbdkn> <span class="sx-panel-icon" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise-fill", "width": "17", "height": "17", "data-astro-cid-fenzbdkn": true })}</span> <h2 data-astro-cid-fenzbdkn>${dt("What the protections did")}</h2> </div> <div class="anx-events dgl-stagger" data-astro-cid-fenzbdkn> ${events.map((e) => renderTemplate`<div class="anx-event" data-astro-cid-fenzbdkn> <span class="an-ico" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": ruleIcon(e.rule), "width": "16", "height": "16", "data-astro-cid-fenzbdkn": true })}</span> <div class="anx-event-main" data-astro-cid-fenzbdkn> <b data-astro-cid-fenzbdkn>#${e.id} · ${names[e.rule]?.label ?? e.rule}</b> <span data-astro-cid-fenzbdkn>${e.executor_name ?? e.executor_id} <code data-astro-cid-fenzbdkn>${e.executor_id}</code> · ${e.action_count}× ${e.detail ?? ""}</span> <em data-astro-cid-fenzbdkn>${ago(e.created_at)}</em> </div> <div class="anx-event-side" data-astro-cid-fenzbdkn> <span${addAttribute(`sx-tag anx-act-${e.action}`, "class")} data-astro-cid-fenzbdkn>${actionNames[e.action] ?? e.action}</span> ${e.restored_at ? renderTemplate`<span class="sx-pill-state on" data-astro-cid-fenzbdkn>${dt("Restored")}</span>` : e.restorable.length > 0 || e.previous_roles.length > 0 ? renderTemplate`<button type="button" class="btn btn-ghost btn-sm"${addAttribute(e.id, "data-an-restore")}${addAttribute(dt("Put back what this protection stopped?"), "data-confirm")} data-confirm-tone="neutral"${addAttribute(dt("Done."), "data-done")}${addAttribute(dt("It could not be restored."), "data-failed")} data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrow-counter-clockwise-bold", "width": "13", "height": "13", "data-astro-cid-fenzbdkn": true })}${dt("Restore")}</button>` : null} </div> </div>`)} </div> <p class="sx-hint" data-astro-cid-fenzbdkn>${dt("Restore rebuilds deleted channels and roles (not their messages), lifts mass bans and gives the roles back. The owner, the trusted admins and (unless owner only is on) the administrators can do it.")}</p> </div> <div class="sx-stack" data-astro-cid-fenzbdkn> <div class="sx-panel" data-astro-cid-fenzbdkn> <div class="sx-panel-head" data-astro-cid-fenzbdkn> <span class="sx-panel-icon" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:chart-bar-fill", "width": "17", "height": "17", "data-astro-cid-fenzbdkn": true })}</span> <h2 data-astro-cid-fenzbdkn>${dt("By protection")}</h2> </div> <div class="anx-bars" data-astro-cid-fenzbdkn> ${byRule.map(([rule, n], i) => renderTemplate`<div class="anx-bar"${addAttribute(`--i:${i}`, "style")} data-astro-cid-fenzbdkn> <span class="anx-bar-name" data-astro-cid-fenzbdkn>${names[rule]?.label ?? rule}</span> <span class="anx-track" data-astro-cid-fenzbdkn><i${addAttribute(`width:${Math.round(n / byRule[0][1] * 100)}%`, "style")} data-astro-cid-fenzbdkn></i></span> <b data-astro-cid-fenzbdkn>${n}</b> </div>`)} </div> </div> <div class="sx-panel" data-astro-cid-fenzbdkn> <div class="sx-panel-head" data-astro-cid-fenzbdkn> <span class="sx-panel-icon" data-astro-cid-fenzbdkn>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "17", "height": "17", "data-astro-cid-fenzbdkn": true })}</span> <h2 data-astro-cid-fenzbdkn>${dt("Who set them off")}</h2> </div> <div class="anx-bars" data-astro-cid-fenzbdkn> ${byPerson.map((who, i) => renderTemplate`<div class="anx-bar"${addAttribute(`--i:${i}`, "style")} data-astro-cid-fenzbdkn> <span class="anx-bar-name" data-astro-cid-fenzbdkn>${who.name}</span> <span class="anx-track" data-astro-cid-fenzbdkn><i${addAttribute(`width:${Math.round(who.n / byPerson[0].n * 100)}%`, "style")} data-astro-cid-fenzbdkn></i></span> <b data-astro-cid-fenzbdkn>${who.n}</b> </div>`)} </div> <p class="sx-hint" data-astro-cid-fenzbdkn>${dt("Counted over the actions shown.")}</p> </div> </div> </div>`}` })}`} </div> </div> ` }));
}, "/home/runner/work/petto-web/petto-web/src/components/DashAntiNuke.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Antinuke = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Antinuke;
  const { id } = Astro2.params;
  const section = ["rules", "lockdown", "shared", "guard", "log"].includes(Astro2.url.searchParams.get("section") ?? "") ? Astro2.url.searchParams.get("section") : "rules";
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const whole = (value, min, max, fallback) => {
    const n = Math.floor(Number(value));
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };
  const idList = (text) => [...new Set(text.split(/[\s,]+/).filter((v) => SNOWFLAKE.test(v)))].slice(0, 50);
  const snowflake = (value) => {
    const v = String(value ?? "").trim();
    return SNOWFLAKE.test(v) ? v : null;
  };
  const post = (table, conflict, body) => fetch(`${apiUrl}/rest/v1/${table}?on_conflict=${conflict}`, {
    method: "POST",
    headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(body)
  });
  let saved = false;
  let failed = false;
  let blocked = false;
  const userId = String(session.userId ?? "");
  const ownerOf = async () => String((await getGuildDetails(id, botToken).catch(() => null))?.owner_id ?? "") || null;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    let action = String(form.get("action") ?? "");
    await ensureGuildRow(apiUrl, apiHeaders, id);
    if (["save_rule", "save_shared", "save_guard"].includes(action)) {
      const currentRes = await fetch(`${apiUrl}/rest/v1/antinuke_config?guild_id=eq.${id}&select=owner_only,admin_ids`, { headers: apiHeaders });
      const current = (currentRes.ok ? (await currentRes.json())[0] : null) ?? {};
      const ownerId = current.owner_only || action === "save_guard" ? await ownerOf() : null;
      if (!mayChangeAntinuke(current, userId, ownerId)) {
        blocked = true;
        action = "";
      } else if (action === "save_guard") {
        const isOwner = Boolean(ownerId) && userId === ownerId;
        const res = await post("antinuke_config", "guild_id", {
          guild_id: id,
          panic_enabled: form.get("panic_enabled") === "on",
          panic_threshold: whole(form.get("panic_threshold"), 1, 20, 2),
          panic_window_minutes: whole(form.get("panic_window_minutes"), 1, 120, 10),
          panic_lockdown_minutes: whole(form.get("panic_lockdown_minutes"), 1, 1440, 30),
          panic_on_raid: form.get("panic_on_raid") === "on",
          dm_owner: form.get("dm_owner") === "on",
          // Only the owner chooses the trusted admins and turns "owner only" on or off.
          ...isOwner ? { owner_only: form.get("owner_only") === "on", admin_ids: idList(String(form.get("admin_ids") ?? "")).slice(0, 25) } : {},
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        saved = res.ok;
        failed = !res.ok;
      }
    }
    if (action === "save_rule") {
      const rule = RULES.find((r) => r.id === String(form.get("rule")));
      if (rule) {
        const chosen = String(form.get("rule_action") ?? "quarantine");
        const res = await post("antinuke_rules", "guild_id,rule", {
          guild_id: id,
          rule: rule.id,
          enabled: form.get("enabled") === "on",
          threshold: whole(form.get("threshold"), 1, 50, rule.threshold),
          window_seconds: whole(form.get("window_seconds"), 2, 600, rule.window),
          action: ACTIONS.includes(chosen) ? chosen : "quarantine",
          alert_channel_id: snowflake(form.get("alert_channel_id")),
          whitelist_ids: idList(String(form.get("whitelist_ids") ?? "")),
          whitelist_role_ids: form.getAll("whitelist_role_ids").map(String).filter((v) => SNOWFLAKE.test(v)).slice(0, 50),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        saved = res.ok;
        failed = !res.ok;
      }
    } else if (action === "save_join") {
      const res = await post("automod_config", "guild_id", {
        guild_id: id,
        anti_raid_enabled: form.get("anti_raid_enabled") === "on",
        raid_join_threshold: whole(form.get("raid_join_threshold"), 2, 50, 6),
        raid_window_seconds: whole(form.get("raid_window_seconds"), 5, 120, 10),
        raid_action: ["kick", "lockdown"].includes(String(form.get("raid_action"))) ? String(form.get("raid_action")) : "alert",
        anti_alt_enabled: form.get("anti_alt_enabled") === "on",
        anti_alt_min_age_days: whole(form.get("anti_alt_min_age_days"), 1, 365, 7),
        anti_alt_action: form.get("anti_alt_action") === "flag" ? "flag" : "kick",
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      saved = res.ok;
      failed = !res.ok;
    } else if (action === "save_lockdown") {
      const res = await post("lockdown_config", "guild_id", {
        guild_id: id,
        channel_ids: form.getAll("channel_ids").map(String).filter((v) => SNOWFLAKE.test(v)).slice(0, 100),
        pause_invites: form.get("pause_invites") === "on",
        raise_verification: form.get("raise_verification") === "on",
        auto_end_minutes: whole(form.get("auto_end_minutes"), 0, 10080, 0),
        announce_channel_id: snowflake(form.get("announce_channel_id")),
        message: String(form.get("message") ?? "").replace(/\r\n?/g, "\n").trim().slice(0, 500) || null,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      saved = res.ok;
      failed = !res.ok;
    } else if (action === "save_shared") {
      const res = await post("antinuke_config", "guild_id", {
        guild_id: id,
        whitelist_ids: idList(String(form.get("whitelist_ids") ?? "")),
        whitelist_role_ids: form.getAll("whitelist_role_ids").map(String).filter((v) => SNOWFLAKE.test(v)).slice(0, 50),
        alert_channel_id: snowflake(form.get("alert_channel_id")),
        ...form.get("old_switch_present") === "1" ? { enabled: form.get("old_switch") === "on" } : {},
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      saved = res.ok;
      failed = !res.ok;
    }
  }
  const needs = (...sections) => sections.includes(section);
  const when = (sections, load) => () => needs(...sections) ? load() : Promise.resolve(null);
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
  const [guildInfo, configRes, rulesRes, eventsRes, automodRes, rolesRes, channelsRes, lockConfigRes, lockActiveRes, weekRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    () => fetch(`${apiUrl}/rest/v1/antinuke_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    when(["rules", "shared"], () => fetch(`${apiUrl}/rest/v1/antinuke_rules?guild_id=eq.${id}&select=*`, { headers: apiHeaders })),
    when(["log", "guard"], () => fetch(`${apiUrl}/rest/v1/antinuke_events?guild_id=eq.${id}&select=*&order=created_at.desc&limit=30`, { headers: apiHeaders })),
    when(["rules"], () => fetch(`${apiUrl}/rest/v1/automod_config?guild_id=eq.${id}&select=anti_raid_enabled,raid_join_threshold,raid_window_seconds,raid_action,anti_alt_enabled,anti_alt_min_age_days,anti_alt_action`, { headers: apiHeaders })),
    when(["rules", "shared"], () => getGuildList(Astro2, id, botToken, "roles")),
    when(["rules", "shared", "lockdown"], () => getGuildList(Astro2, id, botToken, "channels")),
    when(["lockdown"], () => fetch(`${apiUrl}/rest/v1/lockdown_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders })),
    when(["lockdown"], () => fetch(`${apiUrl}/rest/v1/lockdowns?guild_id=eq.${id}&select=started_by,reason,started_at,ends_at,locked`, { headers: apiHeaders })),
    when(["rules"], () => fetch(`${apiUrl}/rest/v1/antinuke_events?guild_id=eq.${id}&created_at=gte.${weekAgo}&select=id&limit=500`, { headers: apiHeaders }))
  ], 4);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const config = (configRes?.ok ? (await configRes.json())[0] : null) ?? {};
  const guard = guardSettings(config);
  const viewerIsOwner = section === "guard" ? userId === await ownerOf() : false;
  const rows = rulesRes?.ok ? await rulesRes.json() : [];
  const protections = RULES.map((meta) => resolveRule(config, rows, meta));
  const events = eventsRes?.ok ? await eventsRes.json() : [];
  const eventsWeek = weekRes?.ok ? (await weekRes.json()).length : 0;
  const join = (automodRes?.ok ? (await automodRes.json())[0] : null) ?? {};
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone").map((r) => ({ id: r.id, name: r.name }));
  const channels = (channelsRes?.ok ? await channelsRes.json() : []).filter((c) => c.type === 0 || c.type === 5).map((c) => ({ id: c.id, name: c.name }));
  const lc = (lockConfigRes?.ok ? (await lockConfigRes.json())[0] : null) ?? {};
  const lockdownConfig = { channelIds: lc.channel_ids ?? [], pauseInvites: lc.pause_invites ?? true, raiseVerification: lc.raise_verification ?? false, autoEndMinutes: lc.auto_end_minutes ?? 0, announceChannelId: lc.announce_channel_id ?? "", message: lc.message ?? "" };
  const la = lockActiveRes?.ok ? (await lockActiveRes.json())[0] : null;
  const lockdownActive = la ? { startedBy: la.started_by, reason: la.reason ?? "", startedAt: la.started_at, endsAt: la.ends_at ?? "", channels: Array.isArray(la.locked) ? la.locked.length : 0 } : null;
  return renderTemplate`${renderComponent($$result, "DashAntiNuke", $$DashAntiNuke, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "section": section, "protections": protections, "join": {
    raidEnabled: Boolean(join.anti_raid_enabled),
    raidThreshold: join.raid_join_threshold ?? 6,
    raidWindow: join.raid_window_seconds ?? 10,
    raidAction: join.raid_action ?? "alert",
    altEnabled: Boolean(join.anti_alt_enabled),
    altDays: join.anti_alt_min_age_days ?? 7,
    altAction: join.anti_alt_action ?? "kick"
  }, "guard": guard, "viewerIsOwner": viewerIsOwner, "blocked": blocked, "shared": { whitelistIds: (config.whitelist_ids ?? []).join(", "), whitelistRoleIds: config.whitelist_role_ids ?? [], alertChannelId: config.alert_channel_id ?? "", oldSwitch: Boolean(config.enabled) }, "events": events, "eventsWeek": eventsWeek, "lockdownConfig": lockdownConfig, "lockdownActive": lockdownActive, "roles": roles, "channels": channels, "saved": saved, "failed": failed })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/antinuke.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/antinuke.astro";
const $$url = "/dash/guild/[id]/antinuke";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Antinuke,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
