import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, d as renderComponent, r as renderTemplate, f as renderSlot, F as Fragment } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { m as makeT, g as getDashLang, a as dashLocale } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                            */
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { a as agoText, f as formatDuration } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { j as getGuildInfo } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { o as callPettoVault } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { b as backupsUnderMaintenance, a as backupsPaused } from '../../../../chunks/maintenance_ZyU-NXSZ.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$2 = createAstro("https://petto.sbs");
const $$MaintenanceGate = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$MaintenanceGate;
  const dt = makeT(getDashLang(Astro2));
  const { active, title, description } = Astro2.props;
  return renderTemplate`${active ? renderTemplate`${maybeRenderHead()}<div class="maint-note" role="note"${addAttribute(dt("Maintenance"), "aria-label")} data-astro-cid-n2hqfrdr><span class="maint-gate-icon" data-astro-cid-n2hqfrdr>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:wrench-fill", "width": "18", "height": "18", "data-astro-cid-n2hqfrdr": true })}</span><div data-astro-cid-n2hqfrdr><span class="maint-gate-kicker" data-astro-cid-n2hqfrdr>${dt("Maintenance")}</span><h2 data-astro-cid-n2hqfrdr>${title}</h2><p data-astro-cid-n2hqfrdr>${description}</p></div></div>` : renderTemplate`${renderSlot($$result, $$slots["default"])}`}`;
}, "/home/runner/work/petto-web/petto-web/src/components/MaintenanceGate.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashBackups = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashBackups;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, backups, audit, schedule, connected, message, error, maintenance = false, teamNotice = false, restoreJob = null, premium = true } = Astro2.props;
  function date(value) {
    return new Date(value).toLocaleString(dashLocale(dashLang), { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
  }
  const ago = (value) => agoText(dt, value, { locale: dashLocale(dashLang) });
  function inTime(value) {
    const ms = new Date(value).getTime() - Date.now();
    if (!Number.isFinite(ms) || ms <= 6e4) return dt("any moment now");
    return dt("in {a}", { a: formatDuration(ms / 1e3, { locale: dashLocale(dashLang) }) });
  }
  function sourceLabel(source) {
    return source === "scheduled" ? dt("Automatic") : dt("Manual");
  }
  function actionLabel(action) {
    return { backup_created: dt("Backup created"), backup_exported: dt("Backup exported"), backup_restored: dt("Backup restored"), schedule_updated: dt("Schedule updated"), schedule_disabled: dt("Schedule disabled") }[action] ?? action;
  }
  const restoreText = {
    deleteTitle: dt("Delete a backup"),
    deleteOne: dt("Delete backup #{a}? This cannot be undone."),
    progressDelete: dt("Deleting backup\u2026|Removing the saved files\u2026|Almost done\u2026"),
    progressDeleteTitle: dt("Deleting backup"),
    progressDeleteAll: dt("Deleting backups\u2026|Removing every saved file\u2026|Turning off the automatic backups\u2026|Almost done\u2026"),
    progressDeleteAllTitle: dt("Deleting backups"),
    deleteAllTitle: dt("Delete all backups"),
    deleteAll: dt("Delete all {a} backups of this server and turn off the automatic backups? This cannot be undone."),
    delete: dt("Delete"),
    title: dt("Restore a backup"),
    close: dt("Close"),
    cancel: dt("Cancel"),
    back: dt("Back"),
    loading: dt("Loading..."),
    mergeTitle: dt("Merge (safe)"),
    mergeBody: dt("Creates what is missing and updates what exists. Deletes nothing."),
    replaceTitle: dt("Replace"),
    replaceBody: dt("Makes the server match the backup: it also deletes the channels and roles that are not in it."),
    review: dt("Review what will change"),
    continue: dt("Continue"),
    partsTitle: dt("What to bring back"),
    partsHint: dt("Untick what should stay as it is now. Replace only deletes in the parts you bring back."),
    partsNone: dt("Pick at least one part."),
    parts: { roles: dt("Roles"), channels: dt("Channels, categories and permissions"), settings: dt("Server settings"), emojis: dt("Emojis"), stickers: dt("Stickers"), automod: dt("AutoMod rules") },
    contents: dt("This backup holds {a} roles, {b} categories, {c} channels with {d} permission overwrites, {e} emojis, {f} stickers and {g} AutoMod rules."),
    partsOnly: dt("Only: {a}"),
    roles: dt("Roles"),
    channels: dt("Channels"),
    emojis: dt("Emojis"),
    plan: dt("{a} to create \xB7 {b} to update"),
    deleting: dt("It will delete {a} channels and {b} roles that are not in this backup:"),
    deletingNothing: dt("Nothing will be deleted."),
    safety: dt("A safety backup of the server as it is now is saved first, so you can go back."),
    checkTitle: dt("Prove you are a person"),
    letters: dt("Type the letters of the picture."),
    serverName: dt("Type the exact name of this server: {a}"),
    placeholder: dt("Your answer"),
    newPicture: dt("New picture"),
    start: dt("Start restore"),
    progress: dt("Restoring backup #{a}"),
    step: dt("Step {a} of {b}"),
    stop: dt("Stop restore"),
    stopping: dt("Stopping after the current step..."),
    hint: dt("You can stop it. What was already restored stays, and nothing else is deleted."),
    phases: { stickers: dt("Restoring stickers..."), automod: dt("Restoring AutoMod rules..."), safety: dt("Saving a safety backup..."), roles: dt("Restoring roles..."), channels: dt("Restoring channels..."), settings: dt("Restoring server settings..."), emojis: dt("Restoring emojis..."), cleanup: dt("Deleting what is not in the backup...") },
    done: dt("Restore finished."),
    stopped: dt("Restore stopped. What was already restored stays, and nothing more was deleted."),
    failed: dt("The restore failed: {a}"),
    safetyKept: dt("Safety backup #{a} has the server as it was before."),
    skipped: dt("Some roles or channels could not be created, so nothing was deleted."),
    summary: dt("Created {a} \xB7 updated {b} \xB7 deleted {c}"),
    warnings: dt("Finished with warnings:"),
    errors: {
      generic: dt("Something went wrong. Try again."),
      bot_unavailable: dt("Petto could not be reached. Try again in a moment."),
      administrator_required: dt("Only server administrators can restore backups."),
      restore_running: dt("A restore is already running in this server."),
      captcha_expired: dt("That check expired. Get a new picture."),
      captcha_wrong: dt("That is not right. Get a new picture and try again."),
      captcha_locked: dt("Too many wrong answers. Try again in 10 minutes."),
      backup_not_found: dt("That backup no longer exists."),
      maintenance: dt("Backups are under maintenance")
    }
  };
  const backupCount = backups.length;
  const restoreRunning = restoreJob && ["running", "cancelling"].includes(restoreJob.status);
  const titleOf = (backup) => backup.label || (backup.source === "scheduled" ? dt("Automatic backup") : dt("Manual backup"));
  const autoCount = backups.filter((backup) => backup.source === "scheduled").length;
  const manualCount = backupCount - autoCount;
  const lastAt = backups.reduce((latest, backup) => Math.max(latest, new Date(backup.created_at).getTime() || 0), 0);
  const lastText = lastAt ? ago(new Date(lastAt).toISOString()) : "\u2013";
  const everyOptions = [[6, dt("6 hours")], [12, dt("12 hours")], [24, dt("24 hours")], [48, dt("48 hours")], [168, dt("7 days")]];
  const keepOptions = [[3, dt("3 copies")], [7, dt("7 copies")], [14, dt("14 copies")], [30, dt("30 copies")]];
  const everyNow = everyOptions.some(([n]) => n === schedule?.interval_hours) ? schedule?.interval_hours : 24;
  const keepNow = keepOptions.some(([n]) => n === schedule?.retention_count) ? schedule?.retention_count : 7;
  const keptShare = schedule && schedule.retention_count > 0 ? Math.min(100, Math.round(autoCount / schedule.retention_count * 100)) : 0;
  const AUDIT_ICON = { backup_created: "ph:plus-circle-fill", backup_exported: "ph:download-simple-bold", backup_restored: "ph:arrow-counter-clockwise-bold", schedule_updated: "ph:clock-fill", schedule_disabled: "ph:prohibit-fill" };
  const AUDIT_COLOR = { backup_created: "#86b894", backup_exported: "#9bd0f5", backup_restored: "#f5c26b", schedule_updated: "#c6a8f5", schedule_disabled: "#c98791" };
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "backups", "pageTitle": "Backups", "premiumRequired": premium ? "" : dt("Backups"), "data-astro-cid-5snkfmy5": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-5snkfmy5": true })} ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-5snkfmy5": true })} ${maybeRenderHead()}<div class="vb-page" data-astro-cid-5snkfmy5> ${teamNotice && renderTemplate`<div class="vb-team-note" data-astro-cid-5snkfmy5>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:wrench-fill", "width": "14", "height": "14", "data-astro-cid-5snkfmy5": true })}${dt("Backups are under maintenance for everyone else. You can use them because you are part of the Petto team.")}</div>`} <div class="vb-heading" data-astro-cid-5snkfmy5> <div data-astro-cid-5snkfmy5> <div class="vb-eyebrow" data-astro-cid-5snkfmy5>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:archive-fill", "width": "14", "height": "14", "data-astro-cid-5snkfmy5": true })}${dt("Petto Vault")}</div> <h1 data-astro-cid-5snkfmy5>${dt("Backups")}</h1> </div> <span${addAttribute(["vb-status", { online: connected }], "class:list")} data-astro-cid-5snkfmy5><i data-astro-cid-5snkfmy5></i>${connected ? dt("Vault connected") : dt("Vault unavailable")}</span> </div> <div${addAttribute(["vb-wall", { "vb-blur": !premium }], "class:list")} data-astro-cid-5snkfmy5> ${renderComponent($$result2, "MaintenanceGate", $$MaintenanceGate, { "active": maintenance, "title": dt("Backups are under maintenance"), "description": dt("Backups are paused for now and cannot be used, here or with the commands. Your saved backups and schedules are kept as they are, and they will come back later."), "data-astro-cid-5snkfmy5": true }, { "default": ($$result3) => renderTemplate`${message && renderTemplate`<div class="sx-flash" data-astro-cid-5snkfmy5>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-5snkfmy5": true })}${message}</div>`}${error && renderTemplate`<div class="sx-flash sx-flash-bad" data-astro-cid-5snkfmy5>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-5snkfmy5": true })}${error}</div>`}${!connected ? renderTemplate`<section class="vb-empty" data-astro-cid-5snkfmy5> ${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:cloud-slash-fill", "width": "26", "height": "26", "data-astro-cid-5snkfmy5": true })} <div data-astro-cid-5snkfmy5><strong data-astro-cid-5snkfmy5>${dt("Vault is not connected to the dashboard yet.")}</strong><p data-astro-cid-5snkfmy5>${dt("The bot needs its private Vault database and the shared dashboard secret configured before this page can manage backups.")}</p></div> </section>` : renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-5snkfmy5": true }, { "default": ($$result4) => renderTemplate(_a || (_a = __template([" ", ' <div class="vb-layout" data-astro-cid-5snkfmy5> <div class="vb-col vb-col-main" data-astro-cid-5snkfmy5> <section class="sx-panel vb-saved" data-vb-saved data-astro-cid-5snkfmy5> <div class="sx-panel-head" data-astro-cid-5snkfmy5> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-5snkfmy5>', "</span> <h2 data-astro-cid-5snkfmy5>", '</h2> <span class="sx-tag" data-vb-count data-astro-cid-5snkfmy5>', "</span> </div> ", " ", " ", ' <p class="sx-empty vb-none" hidden data-astro-cid-5snkfmy5>', "", '</p> </section> <section class="sx-panel vb-activity" data-astro-cid-5snkfmy5> <div class="sx-panel-head" data-astro-cid-5snkfmy5> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-5snkfmy5>', "</span> <h2 data-astro-cid-5snkfmy5>", "</h2> ", " </div> ", ' </section> </div> <div class="vb-col vb-col-side" data-astro-cid-5snkfmy5> <section class="sx-panel vb-create" data-astro-cid-5snkfmy5> <div class="sx-panel-head" data-astro-cid-5snkfmy5> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-5snkfmy5>', "</span> <h2 data-astro-cid-5snkfmy5>", '</h2> </div> <p class="sx-lead" data-astro-cid-5snkfmy5>', '</p> <form method="POST" enctype="multipart/form-data" class="vb-form" data-no-dirty', "", ' data-astro-cid-5snkfmy5> <input type="hidden" name="action" value="create" data-astro-cid-5snkfmy5> <div class="dfx-field" data-astro-cid-5snkfmy5><label for="vb-label" data-astro-cid-5snkfmy5>', '</label><textarea id="vb-label" name="label" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count maxlength="80"', ' data-astro-cid-5snkfmy5></textarea></div> <div class="sx-foot" data-astro-cid-5snkfmy5><button class="btn btn-accent btn-sm" type="submit" data-astro-cid-5snkfmy5> ', "", '</button></div> </form> </section> <section class="sx-panel vb-schedule" data-astro-cid-5snkfmy5> <div class="sx-panel-head" data-astro-cid-5snkfmy5> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-5snkfmy5>', "</span> <h2 data-astro-cid-5snkfmy5>", "</h2> <span", " data-astro-cid-5snkfmy5>", '</span> </div> <p class="sx-lead" data-astro-cid-5snkfmy5>', "", '</p> <form method="POST" enctype="multipart/form-data" class="vb-form vb-schedule-form"', "", ' data-astro-cid-5snkfmy5> <input type="hidden" name="action" value="schedule" data-astro-cid-5snkfmy5> <div class="dfx-field" data-astro-cid-5snkfmy5><span class="dfx-label" data-astro-cid-5snkfmy5>', '</span> <div class="dfx-chips vb-chips" data-astro-cid-5snkfmy5> ', ' </div> </div> <div class="dfx-field" data-astro-cid-5snkfmy5><span class="dfx-label" data-astro-cid-5snkfmy5>', '</span> <div class="dfx-chips vb-chips" data-astro-cid-5snkfmy5> ', ' </div> </div> <div class="sx-foot" data-astro-cid-5snkfmy5><button class="btn btn-accent btn-sm" type="submit" data-astro-cid-5snkfmy5> ', "</button></div> </form> ", ' </section> <section class="sx-panel vb-data" data-astro-cid-5snkfmy5> <div class="sx-panel-head" data-astro-cid-5snkfmy5> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-5snkfmy5>', "</span> <h2 data-astro-cid-5snkfmy5>", '</h2> </div> <p class="sx-lead" data-astro-cid-5snkfmy5>', '</p> <div class="vb-data-actions" data-astro-cid-5snkfmy5> ', " ", " ", ' </div> </section> </div> </div> <form method="POST" enctype="multipart/form-data" id="vb-delete-form" hidden data-no-dirty data-astro-cid-5snkfmy5><input type="hidden" name="action" value="delete" data-astro-cid-5snkfmy5><input type="hidden" name="backup_id" value="" data-astro-cid-5snkfmy5></form> <dialog class="vb-dialog" id="vb-restore"', "", "", ' data-astro-cid-5snkfmy5> <div class="vb-dlg-head" data-astro-cid-5snkfmy5><h2 data-r="title" data-astro-cid-5snkfmy5></h2><button type="button" class="vb-dlg-x" data-r="x"', " data-astro-cid-5snkfmy5>", `</button></div> <div class="vb-dlg-body" data-r="body" data-astro-cid-5snkfmy5></div> <div class="vb-dlg-foot" data-r="foot" data-astro-cid-5snkfmy5></div> </dialog> <script>
        (function () {
          var dlg = document.getElementById('vb-restore');
          if (!dlg) return;
          var T = JSON.parse(dlg.dataset.text);
          var base = '/dash/guild/' + dlg.dataset.guild + '/backups-restore';
          var ALL_PARTS = ['roles', 'channels', 'settings', 'emojis', 'stickers', 'automod'];
          var S = { number: 0, label: '', mode: 'merge', parts: ALL_PARTS.slice(), challenge: null, timer: 0, view: '', refs: null };
          var body = dlg.querySelector('[data-r=body]'), foot = dlg.querySelector('[data-r=foot]');
          dlg.querySelector('[data-r=title]').textContent = T.title;
          function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
          function fill(text, map) { return String(text).replace(/\\{(\\w+)\\}/g, function (_, k) { return map[k] != null ? map[k] : ''; }); }
          function api(step, opts) {
            opts = opts || {};
            var post = Boolean(opts.post);
            return fetch(base + '?step=' + step + (opts.query ? '&' + opts.query : ''), {
              method: post ? 'POST' : 'GET', cache: 'no-store',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-Petto-Dash': '1' },
              body: post ? JSON.stringify(opts.body || {}) : undefined,
            }).then(function (r) { return r.json().catch(function () { return { ok: false, error: 'generic' }; }); }).catch(function () { return { ok: false, error: 'bot_unavailable' }; });
          }
          function say(code) { return T.errors[code] || T.errors.generic; }
          function button(label, cls, onClick, disabled) { var b = el('button', 'btn btn-sm ' + cls, label); b.type = 'button'; if (disabled) b.disabled = true; b.addEventListener('click', onClick); return b; }
          function setFoot() { foot.replaceChildren.apply(foot, arguments); }
          function note(text, kind) { return el('div', 'vb-note ' + (kind || ''), text); }
          // What the box waits with (grey rows, the shared placeholder) and how the answer comes in (uncovered from the top down).
          function waitBody() { body.replaceChildren(window.dglLoad ? window.dglLoad.shape('rows', 3) : note(T.loading)); }
          function drawNodes(nodes) { body.replaceChildren.apply(body, nodes); if (window.dglLoad) window.dglLoad.reveal(body); }
          function stopPoll() { if (S.timer) { clearInterval(S.timer); S.timer = 0; } }
          function close() { stopPoll(); if (dlg.open) dlg.close(); if (S.view === 'end') location.reload(); }
          dlg.querySelector('[data-r=x]').addEventListener('click', close);
          // A press on the dimmed area around the box (it started there too) closes it, like the X.
          var downOutside = false;
          var outside = function (e) { var r = dlg.getBoundingClientRect(); return e.target === dlg && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom); };
          dlg.addEventListener('pointerdown', function (e) { downOutside = outside(e); });
          dlg.addEventListener('click', function (e) { if (downOutside && outside(e)) close(); downOutside = false; });
          dlg.addEventListener('cancel', function () { stopPoll(); if (S.view === 'end') setTimeout(function () { location.reload(); }, 0); });

          function showMode() {
            S.view = 'mode'; stopPoll();
            var wrap = el('div', 'vb-modes');
            [['merge', T.mergeTitle, T.mergeBody], ['replace', T.replaceTitle, T.replaceBody]].forEach(function (m) {
              var label = el('label', 'vb-mode' + (m[0] === 'replace' ? ' danger' : '') + (S.mode === m[0] ? ' on' : ''));
              var input = el('input'); input.type = 'radio'; input.name = 'vb-mode'; input.value = m[0]; input.checked = S.mode === m[0];
              input.addEventListener('change', function () { S.mode = m[0]; wrap.querySelectorAll('.vb-mode').forEach(function (n) { n.classList.toggle('on', n === label); }); });
              var text = el('span'); text.append(el('strong', null, m[1]), el('small', null, m[2]));
              label.append(input, text); wrap.append(label);
            });
            // Selective restore: only some parts of the backup (the bot leaves the rest, and Replace only deletes in the parts chosen).
            var parts = el('fieldset', 'vb-parts');
            parts.append(el('legend', null, T.partsTitle));
            var review = button(T.review, 'btn-accent', showPreview, !S.parts.length);
            ALL_PARTS.forEach(function (part) {
              var label = el('label', 'vb-part');
              var box = el('input'); box.type = 'checkbox'; box.value = part; box.checked = S.parts.indexOf(part) !== -1;
              box.addEventListener('change', function () {
                S.parts = ALL_PARTS.filter(function (p) { var b = parts.querySelector('input[value="' + p + '"]'); return b && b.checked; });
                review.disabled = !S.parts.length; hint.textContent = S.parts.length ? T.partsHint : T.partsNone;
              });
              label.append(box, el('span', null, T.parts[part]));
              parts.append(label);
            });
            var hint = el('small', 'vb-parts-hint', S.parts.length ? T.partsHint : T.partsNone);
            parts.append(hint);
            body.replaceChildren(el('p', 'vb-dlg-sub', '#' + S.number + ' \xB7 ' + S.label), wrap, parts);
            setFoot(button(T.cancel, 'btn-ghost', close), review);
          }
          function row(name, plan) { var r = el('div', 'vb-plan-row'); r.append(el('strong', null, name), el('span', null, fill(T.plan, { a: plan[0], b: plan[1] }))); return r; }
          function showPreview() {
            S.view = 'preview';
            waitBody(); setFoot(button(T.back, 'btn-ghost', showMode));
            api('preview', { query: 'backup_id=' + S.number + '&mode=' + S.mode + '&parts=' + encodeURIComponent(S.parts.join(',')) }).then(function (r) {
              if (!r.ok) { body.replaceChildren(note(say(r.error), 'bad')); return; }
              var p = r.plan, nodes = [];
              var c = r.contents;
              if (c) nodes.push(el('p', 'vb-contents', fill(T.contents, { a: c.roles, b: c.categories, c: c.channels, d: c.overwrites, e: c.emojis, f: c.stickers, g: c.automod })));
              if (S.parts.length < ALL_PARTS.length) nodes.push(note(fill(T.partsOnly, { a: S.parts.map(function (part) { return T.parts[part]; }).join(', ') })));
              if (S.parts.indexOf('roles') !== -1) nodes.push(row(T.roles, [p.roles.create, p.roles.update]));
              if (S.parts.indexOf('channels') !== -1) nodes.push(row(T.channels, [p.channels.create, p.channels.update]));
              if (S.parts.indexOf('emojis') !== -1) nodes.push(row(T.emojis, [p.emojis.create, p.emojis.update]));
              if (S.mode === 'replace') {
                if (p.deleteChannelCount || p.deleteRoleCount) {
                  var box = note(fill(T.deleting, { a: p.deleteChannelCount, b: p.deleteRoleCount }), 'bad');
                  if (p.deleteChannels.length) box.append(el('small', null, T.channels + ': ' + p.deleteChannels.join(', ')));
                  if (p.deleteRoles.length) box.append(el('small', null, T.roles + ': ' + p.deleteRoles.join(', ')));
                  nodes.push(box);
                } else nodes.push(note(T.deletingNothing));
              }
              nodes.push(note(T.safety));
              drawNodes(nodes);
              setFoot(button(T.back, 'btn-ghost', showMode), button(T.continue, S.mode === 'replace' ? 'btn-danger' : 'btn-accent', showCheck, Boolean(r.running)));
            });
          }
          function showCheck() {
            S.view = 'check';
            waitBody(); setFoot(button(T.back, 'btn-ghost', showPreview));
            api('challenge', { post: true }).then(function (r) {
              if (!r.ok) { body.replaceChildren(note(say(r.error), 'bad')); return; }
              S.challenge = r.challenge;
              var nodes = [el('p', 'vb-dlg-sub', T.checkTitle)];
              if (r.challenge.kind === 'letters') { var img = el('img', 'vb-captcha'); img.src = r.challenge.image; img.alt = ''; nodes.push(img, el('p', 'vb-dlg-sub', T.letters)); }
              else nodes.push(el('p', 'vb-dlg-sub', fill(T.serverName, { a: r.challenge.name })));
              var input = el('input', 'vb-answer'); input.type = 'text'; input.autocomplete = 'off'; input.autocapitalize = 'characters'; input.maxLength = 100; input.placeholder = T.placeholder;
              var message = el('div', 'vb-msg');
              nodes.push(input, message);
              drawNodes(nodes);
              var go = button(T.start, S.mode === 'replace' ? 'btn-danger' : 'btn-accent', function () {
                go.disabled = true;
                api('start', { post: true, body: { backup_id: S.number, mode: S.mode, parts: S.parts.join(','), challenge_id: S.challenge.id, answer: input.value } }).then(function (res) {
                  if (res.ok && res.job) { showProgress(res.job); poll(); return; }
                  message.textContent = say(res.error); message.className = 'vb-msg bad'; go.disabled = res.error === 'captcha_locked';
                  if (['captcha_wrong', 'captcha_expired'].indexOf(res.error) >= 0) go.disabled = true;
                });
              }, true);
              input.addEventListener('input', function () { go.disabled = !input.value.trim(); });
              input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !go.disabled) go.click(); });
              setFoot(button(T.back, 'btn-ghost', showPreview), button(T.newPicture, 'btn-ghost', showCheck), go);
              input.focus();
            });
          }
          function showProgress(job) {
            if (S.view !== 'progress') {
              S.view = 'progress';
              var title = el('p', 'vb-dlg-sub'), track = el('div', 'vb-bar'), fillBar = el('i'), line = el('div', 'vb-bar-line'), phase = el('div', 'vb-phase'), hint = note(T.hint);
              track.append(fillBar);
              body.replaceChildren(title, track, line, phase, hint);
              var stop = button(T.stop, 'btn-danger', function () { stop.disabled = true; api('cancel', { post: true }); });
              setFoot(stop);
              S.refs = { title: title, fill: fillBar, line: line, phase: phase, hint: hint, stop: stop };
            }
            var f = S.refs;
            f.title.textContent = fill(T.progress, { a: job.number });
            f.fill.style.width = job.percent + '%';
            f.line.textContent = job.percent + '% \xB7 ' + fill(T.step, { a: job.done, b: job.total });
            f.phase.textContent = T.phases[job.phase] || T.phases.roles;
            f.hint.textContent = job.status === 'cancelling' ? T.stopping : T.hint;
            f.stop.disabled = job.status === 'cancelling';
          }
          function showEnd(job) {
            S.view = 'end'; stopPoll();
            var r = job.result, nodes = [], bad = job.status === 'failed';
            nodes.push(note(bad ? fill(T.failed, { a: job.error || '' }) : job.status === 'cancelled' ? T.stopped : T.done, bad ? 'bad' : job.status === 'cancelled' ? '' : 'good'));
            if (r) {
              var made = (r.roles.created || 0) + (r.channels.created || 0) + (r.emojis.created || 0), changed = (r.roles.updated || 0) + (r.channels.updated || 0) + (r.emojis.updated || 0);
              nodes.push(el('p', 'vb-dlg-sub', fill(T.summary, { a: made, b: changed, c: (r.deleted.channels || 0) + (r.deleted.roles || 0) })));
              if (r.deletionSkipped) nodes.push(note(T.skipped, 'bad'));
              if (r.errors && r.errors.length) { var box = note(T.warnings); r.errors.forEach(function (e) { box.append(el('small', null, e)); }); nodes.push(box); }
            }
            if (job.safetyNumber) nodes.push(note(fill(T.safetyKept, { a: job.safetyNumber })));
            drawNodes(nodes);
            setFoot(button(T.close, 'btn-accent', close));
          }
          function poll() {
            stopPoll();
            S.timer = setInterval(function () {
              if (!document.body.contains(dlg)) { stopPoll(); return; }
              api('status').then(function (r) {
                if (!r.ok || !r.job) return;
                if (['done', 'cancelled', 'failed'].indexOf(r.job.status) >= 0) showEnd(r.job); else showProgress(r.job);
              });
            }, 2000);
          }
          function open(number, label) {
            S.number = number; S.label = label; S.mode = 'merge'; S.parts = ALL_PARTS.slice(); S.view = '';
            dlg.querySelector('[data-r=title]').textContent = T.title;
            waitBody(); setFoot();
            if (!dlg.open) dlg.showModal();
            api('status').then(function (r) {
              if (r.ok && r.job && ['running', 'cancelling'].indexOf(r.job.status) >= 0) { showProgress(r.job); poll(); } else showMode();
            });
          }

          function showDelete(target) {
            S.view = 'delete';
            var all = target === 'all';
            dlg.querySelector('[data-r=title]').textContent = all ? T.deleteAllTitle : T.deleteTitle;
            body.replaceChildren(note(all ? fill(T.deleteAll, { a: S.count }) : fill(T.deleteOne, { a: target }), 'bad'));
            setFoot(button(T.cancel, 'btn-ghost', close), button(T.delete, 'btn-danger', function () {
              var form = document.getElementById('vb-delete-form');
              form.querySelector('[name=action]').value = all ? 'delete_all' : 'delete';
              form.querySelector('[name=backup_id]').value = all ? '' : target;
              form.setAttribute('data-progress', all ? T.progressDeleteAll : T.progressDelete);
              form.setAttribute('data-progress-title', all ? T.progressDeleteAllTitle : T.progressDeleteTitle);
              dlg.close();
              form.requestSubmit();
            }));
          }
          function openDelete(target, count) {
            S.count = count || 0; stopPoll();
            if (!dlg.open) dlg.showModal();
            showDelete(target);
          }
          document.querySelectorAll('[data-vb-delete]').forEach(function (b) { b.addEventListener('click', function () { openDelete(b.getAttribute('data-vb-delete'), 0); }); });
          document.querySelectorAll('[data-vb-delete-all]').forEach(function (b) { b.addEventListener('click', function () { openDelete('all', Number(b.getAttribute('data-vb-delete-all'))); }); });
          document.querySelectorAll('[data-vb-restore]').forEach(function (b) {
            b.addEventListener('click', function () { open(Number(b.getAttribute('data-vb-restore')), b.getAttribute('data-vb-label') || ''); });
          });
          if (dlg.dataset.running) {
            api('status').then(function (r) {
              if (r.ok && r.job && ['running', 'cancelling'].indexOf(r.job.status) >= 0) { S.number = r.job.number; if (!dlg.open) dlg.showModal(); showProgress(r.job); poll(); }
            });
          }
        })();
      <\/script> <script>
        // The chips of the saved backups (all, manual, automatic) hide the rows of the other kind. Works again when the dashboard swaps the page in.
        (function () {
          var root = document.querySelector('[data-vb-saved]:not([data-bound])');
          if (!root) return;
          root.setAttribute('data-bound', '1');
          var rows = Array.prototype.slice.call(root.querySelectorAll('.vb-row'));
          var count = root.querySelector('[data-vb-count]');
          var none = root.querySelector('.vb-none');
          var apply = function () {
            var on = root.querySelector('input[name="vb-source"]:checked');
            var kind = on ? on.value : '';
            var shown = 0;
            rows.forEach(function (row) { var ok = !kind || row.getAttribute('data-vb-source') === kind; row.hidden = !ok; if (ok) shown++; });
            if (count) count.textContent = String(shown);
            if (none) none.hidden = shown > 0;
          };
          root.querySelectorAll('input[name="vb-source"]').forEach(function (radio) { radio.addEventListener('change', apply); });
        })();
      <\/script> `], [" ", ' <div class="vb-layout" data-astro-cid-5snkfmy5> <div class="vb-col vb-col-main" data-astro-cid-5snkfmy5> <section class="sx-panel vb-saved" data-vb-saved data-astro-cid-5snkfmy5> <div class="sx-panel-head" data-astro-cid-5snkfmy5> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-5snkfmy5>', "</span> <h2 data-astro-cid-5snkfmy5>", '</h2> <span class="sx-tag" data-vb-count data-astro-cid-5snkfmy5>', "</span> </div> ", " ", " ", ' <p class="sx-empty vb-none" hidden data-astro-cid-5snkfmy5>', "", '</p> </section> <section class="sx-panel vb-activity" data-astro-cid-5snkfmy5> <div class="sx-panel-head" data-astro-cid-5snkfmy5> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-5snkfmy5>', "</span> <h2 data-astro-cid-5snkfmy5>", "</h2> ", " </div> ", ' </section> </div> <div class="vb-col vb-col-side" data-astro-cid-5snkfmy5> <section class="sx-panel vb-create" data-astro-cid-5snkfmy5> <div class="sx-panel-head" data-astro-cid-5snkfmy5> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-5snkfmy5>', "</span> <h2 data-astro-cid-5snkfmy5>", '</h2> </div> <p class="sx-lead" data-astro-cid-5snkfmy5>', '</p> <form method="POST" enctype="multipart/form-data" class="vb-form" data-no-dirty', "", ' data-astro-cid-5snkfmy5> <input type="hidden" name="action" value="create" data-astro-cid-5snkfmy5> <div class="dfx-field" data-astro-cid-5snkfmy5><label for="vb-label" data-astro-cid-5snkfmy5>', '</label><textarea id="vb-label" name="label" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count maxlength="80"', ' data-astro-cid-5snkfmy5></textarea></div> <div class="sx-foot" data-astro-cid-5snkfmy5><button class="btn btn-accent btn-sm" type="submit" data-astro-cid-5snkfmy5> ', "", '</button></div> </form> </section> <section class="sx-panel vb-schedule" data-astro-cid-5snkfmy5> <div class="sx-panel-head" data-astro-cid-5snkfmy5> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-5snkfmy5>', "</span> <h2 data-astro-cid-5snkfmy5>", "</h2> <span", " data-astro-cid-5snkfmy5>", '</span> </div> <p class="sx-lead" data-astro-cid-5snkfmy5>', "", '</p> <form method="POST" enctype="multipart/form-data" class="vb-form vb-schedule-form"', "", ' data-astro-cid-5snkfmy5> <input type="hidden" name="action" value="schedule" data-astro-cid-5snkfmy5> <div class="dfx-field" data-astro-cid-5snkfmy5><span class="dfx-label" data-astro-cid-5snkfmy5>', '</span> <div class="dfx-chips vb-chips" data-astro-cid-5snkfmy5> ', ' </div> </div> <div class="dfx-field" data-astro-cid-5snkfmy5><span class="dfx-label" data-astro-cid-5snkfmy5>', '</span> <div class="dfx-chips vb-chips" data-astro-cid-5snkfmy5> ', ' </div> </div> <div class="sx-foot" data-astro-cid-5snkfmy5><button class="btn btn-accent btn-sm" type="submit" data-astro-cid-5snkfmy5> ', "</button></div> </form> ", ' </section> <section class="sx-panel vb-data" data-astro-cid-5snkfmy5> <div class="sx-panel-head" data-astro-cid-5snkfmy5> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-5snkfmy5>', "</span> <h2 data-astro-cid-5snkfmy5>", '</h2> </div> <p class="sx-lead" data-astro-cid-5snkfmy5>', '</p> <div class="vb-data-actions" data-astro-cid-5snkfmy5> ', " ", " ", ' </div> </section> </div> </div> <form method="POST" enctype="multipart/form-data" id="vb-delete-form" hidden data-no-dirty data-astro-cid-5snkfmy5><input type="hidden" name="action" value="delete" data-astro-cid-5snkfmy5><input type="hidden" name="backup_id" value="" data-astro-cid-5snkfmy5></form> <dialog class="vb-dialog" id="vb-restore"', "", "", ' data-astro-cid-5snkfmy5> <div class="vb-dlg-head" data-astro-cid-5snkfmy5><h2 data-r="title" data-astro-cid-5snkfmy5></h2><button type="button" class="vb-dlg-x" data-r="x"', " data-astro-cid-5snkfmy5>", `</button></div> <div class="vb-dlg-body" data-r="body" data-astro-cid-5snkfmy5></div> <div class="vb-dlg-foot" data-r="foot" data-astro-cid-5snkfmy5></div> </dialog> <script>
        (function () {
          var dlg = document.getElementById('vb-restore');
          if (!dlg) return;
          var T = JSON.parse(dlg.dataset.text);
          var base = '/dash/guild/' + dlg.dataset.guild + '/backups-restore';
          var ALL_PARTS = ['roles', 'channels', 'settings', 'emojis', 'stickers', 'automod'];
          var S = { number: 0, label: '', mode: 'merge', parts: ALL_PARTS.slice(), challenge: null, timer: 0, view: '', refs: null };
          var body = dlg.querySelector('[data-r=body]'), foot = dlg.querySelector('[data-r=foot]');
          dlg.querySelector('[data-r=title]').textContent = T.title;
          function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
          function fill(text, map) { return String(text).replace(/\\\\{(\\\\w+)\\\\}/g, function (_, k) { return map[k] != null ? map[k] : ''; }); }
          function api(step, opts) {
            opts = opts || {};
            var post = Boolean(opts.post);
            return fetch(base + '?step=' + step + (opts.query ? '&' + opts.query : ''), {
              method: post ? 'POST' : 'GET', cache: 'no-store',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-Petto-Dash': '1' },
              body: post ? JSON.stringify(opts.body || {}) : undefined,
            }).then(function (r) { return r.json().catch(function () { return { ok: false, error: 'generic' }; }); }).catch(function () { return { ok: false, error: 'bot_unavailable' }; });
          }
          function say(code) { return T.errors[code] || T.errors.generic; }
          function button(label, cls, onClick, disabled) { var b = el('button', 'btn btn-sm ' + cls, label); b.type = 'button'; if (disabled) b.disabled = true; b.addEventListener('click', onClick); return b; }
          function setFoot() { foot.replaceChildren.apply(foot, arguments); }
          function note(text, kind) { return el('div', 'vb-note ' + (kind || ''), text); }
          // What the box waits with (grey rows, the shared placeholder) and how the answer comes in (uncovered from the top down).
          function waitBody() { body.replaceChildren(window.dglLoad ? window.dglLoad.shape('rows', 3) : note(T.loading)); }
          function drawNodes(nodes) { body.replaceChildren.apply(body, nodes); if (window.dglLoad) window.dglLoad.reveal(body); }
          function stopPoll() { if (S.timer) { clearInterval(S.timer); S.timer = 0; } }
          function close() { stopPoll(); if (dlg.open) dlg.close(); if (S.view === 'end') location.reload(); }
          dlg.querySelector('[data-r=x]').addEventListener('click', close);
          // A press on the dimmed area around the box (it started there too) closes it, like the X.
          var downOutside = false;
          var outside = function (e) { var r = dlg.getBoundingClientRect(); return e.target === dlg && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom); };
          dlg.addEventListener('pointerdown', function (e) { downOutside = outside(e); });
          dlg.addEventListener('click', function (e) { if (downOutside && outside(e)) close(); downOutside = false; });
          dlg.addEventListener('cancel', function () { stopPoll(); if (S.view === 'end') setTimeout(function () { location.reload(); }, 0); });

          function showMode() {
            S.view = 'mode'; stopPoll();
            var wrap = el('div', 'vb-modes');
            [['merge', T.mergeTitle, T.mergeBody], ['replace', T.replaceTitle, T.replaceBody]].forEach(function (m) {
              var label = el('label', 'vb-mode' + (m[0] === 'replace' ? ' danger' : '') + (S.mode === m[0] ? ' on' : ''));
              var input = el('input'); input.type = 'radio'; input.name = 'vb-mode'; input.value = m[0]; input.checked = S.mode === m[0];
              input.addEventListener('change', function () { S.mode = m[0]; wrap.querySelectorAll('.vb-mode').forEach(function (n) { n.classList.toggle('on', n === label); }); });
              var text = el('span'); text.append(el('strong', null, m[1]), el('small', null, m[2]));
              label.append(input, text); wrap.append(label);
            });
            // Selective restore: only some parts of the backup (the bot leaves the rest, and Replace only deletes in the parts chosen).
            var parts = el('fieldset', 'vb-parts');
            parts.append(el('legend', null, T.partsTitle));
            var review = button(T.review, 'btn-accent', showPreview, !S.parts.length);
            ALL_PARTS.forEach(function (part) {
              var label = el('label', 'vb-part');
              var box = el('input'); box.type = 'checkbox'; box.value = part; box.checked = S.parts.indexOf(part) !== -1;
              box.addEventListener('change', function () {
                S.parts = ALL_PARTS.filter(function (p) { var b = parts.querySelector('input[value="' + p + '"]'); return b && b.checked; });
                review.disabled = !S.parts.length; hint.textContent = S.parts.length ? T.partsHint : T.partsNone;
              });
              label.append(box, el('span', null, T.parts[part]));
              parts.append(label);
            });
            var hint = el('small', 'vb-parts-hint', S.parts.length ? T.partsHint : T.partsNone);
            parts.append(hint);
            body.replaceChildren(el('p', 'vb-dlg-sub', '#' + S.number + ' \xB7 ' + S.label), wrap, parts);
            setFoot(button(T.cancel, 'btn-ghost', close), review);
          }
          function row(name, plan) { var r = el('div', 'vb-plan-row'); r.append(el('strong', null, name), el('span', null, fill(T.plan, { a: plan[0], b: plan[1] }))); return r; }
          function showPreview() {
            S.view = 'preview';
            waitBody(); setFoot(button(T.back, 'btn-ghost', showMode));
            api('preview', { query: 'backup_id=' + S.number + '&mode=' + S.mode + '&parts=' + encodeURIComponent(S.parts.join(',')) }).then(function (r) {
              if (!r.ok) { body.replaceChildren(note(say(r.error), 'bad')); return; }
              var p = r.plan, nodes = [];
              var c = r.contents;
              if (c) nodes.push(el('p', 'vb-contents', fill(T.contents, { a: c.roles, b: c.categories, c: c.channels, d: c.overwrites, e: c.emojis, f: c.stickers, g: c.automod })));
              if (S.parts.length < ALL_PARTS.length) nodes.push(note(fill(T.partsOnly, { a: S.parts.map(function (part) { return T.parts[part]; }).join(', ') })));
              if (S.parts.indexOf('roles') !== -1) nodes.push(row(T.roles, [p.roles.create, p.roles.update]));
              if (S.parts.indexOf('channels') !== -1) nodes.push(row(T.channels, [p.channels.create, p.channels.update]));
              if (S.parts.indexOf('emojis') !== -1) nodes.push(row(T.emojis, [p.emojis.create, p.emojis.update]));
              if (S.mode === 'replace') {
                if (p.deleteChannelCount || p.deleteRoleCount) {
                  var box = note(fill(T.deleting, { a: p.deleteChannelCount, b: p.deleteRoleCount }), 'bad');
                  if (p.deleteChannels.length) box.append(el('small', null, T.channels + ': ' + p.deleteChannels.join(', ')));
                  if (p.deleteRoles.length) box.append(el('small', null, T.roles + ': ' + p.deleteRoles.join(', ')));
                  nodes.push(box);
                } else nodes.push(note(T.deletingNothing));
              }
              nodes.push(note(T.safety));
              drawNodes(nodes);
              setFoot(button(T.back, 'btn-ghost', showMode), button(T.continue, S.mode === 'replace' ? 'btn-danger' : 'btn-accent', showCheck, Boolean(r.running)));
            });
          }
          function showCheck() {
            S.view = 'check';
            waitBody(); setFoot(button(T.back, 'btn-ghost', showPreview));
            api('challenge', { post: true }).then(function (r) {
              if (!r.ok) { body.replaceChildren(note(say(r.error), 'bad')); return; }
              S.challenge = r.challenge;
              var nodes = [el('p', 'vb-dlg-sub', T.checkTitle)];
              if (r.challenge.kind === 'letters') { var img = el('img', 'vb-captcha'); img.src = r.challenge.image; img.alt = ''; nodes.push(img, el('p', 'vb-dlg-sub', T.letters)); }
              else nodes.push(el('p', 'vb-dlg-sub', fill(T.serverName, { a: r.challenge.name })));
              var input = el('input', 'vb-answer'); input.type = 'text'; input.autocomplete = 'off'; input.autocapitalize = 'characters'; input.maxLength = 100; input.placeholder = T.placeholder;
              var message = el('div', 'vb-msg');
              nodes.push(input, message);
              drawNodes(nodes);
              var go = button(T.start, S.mode === 'replace' ? 'btn-danger' : 'btn-accent', function () {
                go.disabled = true;
                api('start', { post: true, body: { backup_id: S.number, mode: S.mode, parts: S.parts.join(','), challenge_id: S.challenge.id, answer: input.value } }).then(function (res) {
                  if (res.ok && res.job) { showProgress(res.job); poll(); return; }
                  message.textContent = say(res.error); message.className = 'vb-msg bad'; go.disabled = res.error === 'captcha_locked';
                  if (['captcha_wrong', 'captcha_expired'].indexOf(res.error) >= 0) go.disabled = true;
                });
              }, true);
              input.addEventListener('input', function () { go.disabled = !input.value.trim(); });
              input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !go.disabled) go.click(); });
              setFoot(button(T.back, 'btn-ghost', showPreview), button(T.newPicture, 'btn-ghost', showCheck), go);
              input.focus();
            });
          }
          function showProgress(job) {
            if (S.view !== 'progress') {
              S.view = 'progress';
              var title = el('p', 'vb-dlg-sub'), track = el('div', 'vb-bar'), fillBar = el('i'), line = el('div', 'vb-bar-line'), phase = el('div', 'vb-phase'), hint = note(T.hint);
              track.append(fillBar);
              body.replaceChildren(title, track, line, phase, hint);
              var stop = button(T.stop, 'btn-danger', function () { stop.disabled = true; api('cancel', { post: true }); });
              setFoot(stop);
              S.refs = { title: title, fill: fillBar, line: line, phase: phase, hint: hint, stop: stop };
            }
            var f = S.refs;
            f.title.textContent = fill(T.progress, { a: job.number });
            f.fill.style.width = job.percent + '%';
            f.line.textContent = job.percent + '% \xB7 ' + fill(T.step, { a: job.done, b: job.total });
            f.phase.textContent = T.phases[job.phase] || T.phases.roles;
            f.hint.textContent = job.status === 'cancelling' ? T.stopping : T.hint;
            f.stop.disabled = job.status === 'cancelling';
          }
          function showEnd(job) {
            S.view = 'end'; stopPoll();
            var r = job.result, nodes = [], bad = job.status === 'failed';
            nodes.push(note(bad ? fill(T.failed, { a: job.error || '' }) : job.status === 'cancelled' ? T.stopped : T.done, bad ? 'bad' : job.status === 'cancelled' ? '' : 'good'));
            if (r) {
              var made = (r.roles.created || 0) + (r.channels.created || 0) + (r.emojis.created || 0), changed = (r.roles.updated || 0) + (r.channels.updated || 0) + (r.emojis.updated || 0);
              nodes.push(el('p', 'vb-dlg-sub', fill(T.summary, { a: made, b: changed, c: (r.deleted.channels || 0) + (r.deleted.roles || 0) })));
              if (r.deletionSkipped) nodes.push(note(T.skipped, 'bad'));
              if (r.errors && r.errors.length) { var box = note(T.warnings); r.errors.forEach(function (e) { box.append(el('small', null, e)); }); nodes.push(box); }
            }
            if (job.safetyNumber) nodes.push(note(fill(T.safetyKept, { a: job.safetyNumber })));
            drawNodes(nodes);
            setFoot(button(T.close, 'btn-accent', close));
          }
          function poll() {
            stopPoll();
            S.timer = setInterval(function () {
              if (!document.body.contains(dlg)) { stopPoll(); return; }
              api('status').then(function (r) {
                if (!r.ok || !r.job) return;
                if (['done', 'cancelled', 'failed'].indexOf(r.job.status) >= 0) showEnd(r.job); else showProgress(r.job);
              });
            }, 2000);
          }
          function open(number, label) {
            S.number = number; S.label = label; S.mode = 'merge'; S.parts = ALL_PARTS.slice(); S.view = '';
            dlg.querySelector('[data-r=title]').textContent = T.title;
            waitBody(); setFoot();
            if (!dlg.open) dlg.showModal();
            api('status').then(function (r) {
              if (r.ok && r.job && ['running', 'cancelling'].indexOf(r.job.status) >= 0) { showProgress(r.job); poll(); } else showMode();
            });
          }

          function showDelete(target) {
            S.view = 'delete';
            var all = target === 'all';
            dlg.querySelector('[data-r=title]').textContent = all ? T.deleteAllTitle : T.deleteTitle;
            body.replaceChildren(note(all ? fill(T.deleteAll, { a: S.count }) : fill(T.deleteOne, { a: target }), 'bad'));
            setFoot(button(T.cancel, 'btn-ghost', close), button(T.delete, 'btn-danger', function () {
              var form = document.getElementById('vb-delete-form');
              form.querySelector('[name=action]').value = all ? 'delete_all' : 'delete';
              form.querySelector('[name=backup_id]').value = all ? '' : target;
              form.setAttribute('data-progress', all ? T.progressDeleteAll : T.progressDelete);
              form.setAttribute('data-progress-title', all ? T.progressDeleteAllTitle : T.progressDeleteTitle);
              dlg.close();
              form.requestSubmit();
            }));
          }
          function openDelete(target, count) {
            S.count = count || 0; stopPoll();
            if (!dlg.open) dlg.showModal();
            showDelete(target);
          }
          document.querySelectorAll('[data-vb-delete]').forEach(function (b) { b.addEventListener('click', function () { openDelete(b.getAttribute('data-vb-delete'), 0); }); });
          document.querySelectorAll('[data-vb-delete-all]').forEach(function (b) { b.addEventListener('click', function () { openDelete('all', Number(b.getAttribute('data-vb-delete-all'))); }); });
          document.querySelectorAll('[data-vb-restore]').forEach(function (b) {
            b.addEventListener('click', function () { open(Number(b.getAttribute('data-vb-restore')), b.getAttribute('data-vb-label') || ''); });
          });
          if (dlg.dataset.running) {
            api('status').then(function (r) {
              if (r.ok && r.job && ['running', 'cancelling'].indexOf(r.job.status) >= 0) { S.number = r.job.number; if (!dlg.open) dlg.showModal(); showProgress(r.job); poll(); }
            });
          }
        })();
      <\/script> <script>
        // The chips of the saved backups (all, manual, automatic) hide the rows of the other kind. Works again when the dashboard swaps the page in.
        (function () {
          var root = document.querySelector('[data-vb-saved]:not([data-bound])');
          if (!root) return;
          root.setAttribute('data-bound', '1');
          var rows = Array.prototype.slice.call(root.querySelectorAll('.vb-row'));
          var count = root.querySelector('[data-vb-count]');
          var none = root.querySelector('.vb-none');
          var apply = function () {
            var on = root.querySelector('input[name="vb-source"]:checked');
            var kind = on ? on.value : '';
            var shown = 0;
            rows.forEach(function (row) { var ok = !kind || row.getAttribute('data-vb-source') === kind; row.hidden = !ok; if (ok) shown++; });
            if (count) count.textContent = String(shown);
            if (none) none.hidden = shown > 0;
          };
          root.querySelectorAll('input[name="vb-source"]').forEach(function (radio) { radio.addEventListener('change', apply); });
        })();
      <\/script> `])), renderComponent($$result4, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Saved backups"), value: backupCount, tone: "invites" },
    { label: dt("Manual"), value: manualCount, tone: "messages" },
    { label: dt("Automatic"), value: autoCount, tone: "voice" },
    { label: dt("Last backup"), value: 0, text: lastText, tone: "joins" }
  ], "data-astro-cid-5snkfmy5": true }), renderComponent($$result4, "Icon", $$Icon, { "name": "ph:stack-fill", "width": "17", "height": "17", "data-astro-cid-5snkfmy5": true }), dt("Saved backups"), backupCount, schedule && renderTemplate`<div class="vb-keep" data-astro-cid-5snkfmy5> <span data-astro-cid-5snkfmy5>${dt("{a} of {b} automatic copies kept", { a: autoCount, b: schedule.retention_count })}</span> <span class="vb-keep-bar" data-astro-cid-5snkfmy5><i${addAttribute(`width:${keptShare}%`, "style")} data-astro-cid-5snkfmy5></i></span> </div>`, backups.length > 0 && renderTemplate`<div class="dfx-chips vb-chips" role="radiogroup"${addAttribute(dt("Filter"), "aria-label")} data-astro-cid-5snkfmy5> <label class="dfx-chip vb-chip" data-astro-cid-5snkfmy5><input type="radio" name="vb-source" value="" checked data-astro-cid-5snkfmy5>${dt("All")}<b data-astro-cid-5snkfmy5>${backupCount}</b></label> <label class="dfx-chip vb-chip" data-astro-cid-5snkfmy5><input type="radio" name="vb-source" value="manual"${addAttribute(manualCount === 0, "disabled")} data-astro-cid-5snkfmy5>${dt("Manual")}<b data-astro-cid-5snkfmy5>${manualCount}</b></label> <label class="dfx-chip vb-chip" data-astro-cid-5snkfmy5><input type="radio" name="vb-source" value="scheduled"${addAttribute(autoCount === 0, "disabled")} data-astro-cid-5snkfmy5>${dt("Automatic")}<b data-astro-cid-5snkfmy5>${autoCount}</b></label> </div>`, backups.length ? renderTemplate`<div class="vb-list dgl-stagger" data-astro-cid-5snkfmy5> ${backups.map((backup) => renderTemplate`<div${addAttribute(["vb-row", { auto: backup.source === "scheduled" }], "class:list")}${addAttribute(backup.source === "scheduled" ? "scheduled" : "manual", "data-vb-source")} data-astro-cid-5snkfmy5> <span class="vb-row-icon" data-astro-cid-5snkfmy5>${renderComponent($$result4, "Icon", $$Icon, { "name": backup.source === "scheduled" ? "ph:clock-fill" : "ph:archive-fill", "width": "16", "height": "16", "data-astro-cid-5snkfmy5": true })}</span> <div class="vb-row-main" data-astro-cid-5snkfmy5> <div class="vb-row-title" data-astro-cid-5snkfmy5><strong data-astro-cid-5snkfmy5>${titleOf(backup)}</strong><em data-astro-cid-5snkfmy5>${ago(backup.created_at)}</em></div> <span data-astro-cid-5snkfmy5>#${backup.backup_number} · ${sourceLabel(backup.source)} · ${date(backup.created_at)}</span> </div> <div class="vb-row-actions" data-astro-cid-5snkfmy5> <button class="btn btn-ghost btn-sm" type="button"${addAttribute(String(backup.backup_number), "data-vb-restore")}${addAttribute(titleOf(backup), "data-vb-label")} data-astro-cid-5snkfmy5>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:arrow-counter-clockwise-bold", "width": "14", "height": "14", "data-astro-cid-5snkfmy5": true })}${dt("Restore")}</button> <a class="btn btn-ghost btn-sm vb-icon-btn"${addAttribute(`/dash/guild/${guildId}/backups-export?id=${encodeURIComponent(String(backup.backup_number))}`, "href")} download${addAttribute(dt("Export"), "aria-label")}${addAttribute(dt("Export"), "title")} data-astro-cid-5snkfmy5>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:download-simple-bold", "width": "14", "height": "14", "data-astro-cid-5snkfmy5": true })}</a> <button class="btn btn-ghost btn-sm vb-del vb-icon-btn" type="button"${addAttribute(String(backup.backup_number), "data-vb-delete")}${addAttribute(dt("Delete"), "aria-label")}${addAttribute(dt("Delete"), "title")} data-astro-cid-5snkfmy5>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "14", "height": "14", "data-astro-cid-5snkfmy5": true })}</button> </div> </div>`)} </div>` : renderTemplate`<div class="vb-empty-inline" data-astro-cid-5snkfmy5>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:archive-fill", "width": "24", "height": "24", "data-astro-cid-5snkfmy5": true })}<p data-astro-cid-5snkfmy5>${dt("No backups yet. Create the first one.")}</p></div>`, renderComponent($$result4, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "16", "height": "16", "data-astro-cid-5snkfmy5": true }), dt("No backup matches that."), renderComponent($$result4, "Icon", $$Icon, { "name": "ph:list-dashes-fill", "width": "17", "height": "17", "data-astro-cid-5snkfmy5": true }), dt("Activity history"), audit.length > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-5snkfmy5>${audit.length}</span>`, audit.length ? renderTemplate`<div class="vb-audit-list dgl-stagger" data-astro-cid-5snkfmy5> ${audit.map((entry) => renderTemplate`<div class="vb-audit-row" data-astro-cid-5snkfmy5> <span class="vb-audit-icon"${addAttribute(`--c:${AUDIT_COLOR[entry.action] ?? "#94a3b8"}`, "style")} data-astro-cid-5snkfmy5>${renderComponent($$result4, "Icon", $$Icon, { "name": AUDIT_ICON[entry.action] ?? "ph:clock-fill", "width": "14", "height": "14", "data-astro-cid-5snkfmy5": true })}</span> <div data-astro-cid-5snkfmy5> <strong data-astro-cid-5snkfmy5>${actionLabel(entry.action)}${entry.backup_number ? renderTemplate`<span class="vb-audit-num" data-astro-cid-5snkfmy5> #${entry.backup_number}</span>` : null}</strong> <span data-astro-cid-5snkfmy5>${dt("User {a}", { a: entry.actor_id })} · ${date(entry.created_at)}</span> </div> <em data-astro-cid-5snkfmy5>${ago(entry.created_at)}</em> </div>`)} </div>` : renderTemplate`<div class="vb-empty-inline" data-astro-cid-5snkfmy5>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:list-dashes-fill", "width": "24", "height": "24", "data-astro-cid-5snkfmy5": true })}<p data-astro-cid-5snkfmy5>${dt("No Vault activity recorded yet.")}</p></div>`, renderComponent($$result4, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "17", "height": "17", "data-astro-cid-5snkfmy5": true }), dt("Create a backup"), dt("Save the current roles, channels, permissions, emojis, and server settings."), addAttribute(dt("Creating backup\u2026|Saving roles and channels\u2026|Saving permissions and settings\u2026|Almost done\u2026"), "data-progress"), addAttribute(dt("Creating backup"), "data-progress-title"), dt("Backup name"), addAttribute(dt("Before changing roles"), "placeholder"), renderComponent($$result4, "Icon", $$Icon, { "name": "ph:archive-fill", "width": "14", "height": "14", "data-astro-cid-5snkfmy5": true }), dt("Create backup"), renderComponent($$result4, "Icon", $$Icon, { "name": "ph:clock-fill", "width": "17", "height": "17", "data-astro-cid-5snkfmy5": true }), dt("Automatic backups"), addAttribute(["sx-pill-state", { on: Boolean(schedule) }], "class:list"), schedule ? dt("On") : dt("Off"), schedule ? dt("Every {a} \xB7 keeps {b}", { a: formatDuration(schedule.interval_hours * 3600, { locale: dashLocale(dashLang) }), b: schedule.retention_count }) : dt("No schedule is active for this server."), schedule?.next_run_at ? ` \xB7 ${dt("Next one {a}", { a: inTime(schedule.next_run_at) })}` : "", addAttribute(dt("Saving the schedule\u2026|Setting the next backup\u2026|Almost done\u2026"), "data-progress"), addAttribute(dt("Saving the schedule"), "data-progress-title"), dt("Every"), everyOptions.map(([n, label]) => renderTemplate`<label class="dfx-chip vb-chip" data-astro-cid-5snkfmy5><input type="radio" name="hours"${addAttribute(n, "value")}${addAttribute(n === everyNow, "checked")} data-astro-cid-5snkfmy5>${label}</label>`), dt("Keep"), keepOptions.map(([n, label]) => renderTemplate`<label class="dfx-chip vb-chip" data-astro-cid-5snkfmy5><input type="radio" name="retention"${addAttribute(n, "value")}${addAttribute(n === keepNow, "checked")} data-astro-cid-5snkfmy5>${label}</label>`), dt("Save schedule"), schedule && renderTemplate`<form method="POST" enctype="multipart/form-data" class="vb-unschedule" data-no-dirty${addAttribute(dt("Turning off the automatic backups\u2026|Almost done\u2026"), "data-progress")}${addAttribute(dt("Turning off backups"), "data-progress-title")} data-astro-cid-5snkfmy5><input type="hidden" name="action" value="unschedule" data-astro-cid-5snkfmy5><button type="submit" data-astro-cid-5snkfmy5>${dt("Disable schedule")}</button></form>`, renderComponent($$result4, "Icon", $$Icon, { "name": "ph:lock-key-fill", "width": "17", "height": "17", "data-astro-cid-5snkfmy5": true }), dt("Your data"), dt("A backup keeps names, permissions and settings: no messages and no member list. Backups of a server Petto has left are deleted after 30 days."), schedule && renderTemplate`<form method="POST" enctype="multipart/form-data" class="vb-inline-form" data-no-dirty${addAttribute(dt("Turning off the automatic backups\u2026|Almost done\u2026"), "data-progress")}${addAttribute(dt("Turning off backups"), "data-progress-title")} data-astro-cid-5snkfmy5><input type="hidden" name="action" value="unschedule" data-astro-cid-5snkfmy5><button class="btn btn-ghost btn-sm" type="submit" data-astro-cid-5snkfmy5>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:clock-fill", "width": "14", "height": "14", "data-astro-cid-5snkfmy5": true })}${dt("Disable automatic backups")}</button></form>`, backupCount > 0 && renderTemplate`<button class="btn btn-ghost btn-sm vb-del" type="button"${addAttribute(String(backupCount), "data-vb-delete-all")} data-astro-cid-5snkfmy5>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "14", "height": "14", "data-astro-cid-5snkfmy5": true })}${dt("Delete all backups")}</button>`, !schedule && backupCount === 0 && renderTemplate`<span class="vb-data-ok" data-astro-cid-5snkfmy5>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "14", "height": "14", "data-astro-cid-5snkfmy5": true })}${dt("Nothing is being kept for this server.")}</span>`, addAttribute(guildId, "data-guild"), addAttribute(restoreRunning ? "1" : "", "data-running"), addAttribute(JSON.stringify(restoreText), "data-text"), addAttribute(dt("Close"), "aria-label"), renderComponent($$result4, "Icon", $$Icon, { "name": "ph:x-bold", "width": "14", "height": "14", "data-astro-cid-5snkfmy5": true })) })}`}` })} </div> </div> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashBackups.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Backups = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Backups;
  const dt = makeT(getDashLang(Astro2));
  const { id } = Astro2.params;
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  if (!botToken) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const guildInfo = await getGuildInfo(id, botToken);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const maintenance = backupsUnderMaintenance(Astro2, session.userId);
  const teamNotice = !maintenance && backupsPaused(Astro2);
  const DONE = {
    create: dt("Backup created."),
    delete: dt("Backup deleted."),
    delete_all: dt("All backups were deleted and automatic backups are off."),
    schedule: dt("Automatic backup schedule saved."),
    unschedule: dt("Automatic backups disabled.")
  };
  const FAILED = {
    administrator_required: dt("Only server administrators can delete or restore backups."),
    backup_not_found: dt("That backup no longer exists."),
    premium_required: dt("Making and scheduling backups needs Premium on this server."),
    not_configured: dt("Vault is not connected to the dashboard yet."),
    failed: dt("Petto could not complete that Vault action.")
  };
  const here = `/dash/guild/${id}/backups`;
  if (!maintenance && Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const body = { user_id: session.userId, action };
    if (action === "create") body.label = String(form.get("label") ?? "").trim();
    if (action === "delete") body.backup_id = Number(form.get("backup_id"));
    if (action === "schedule") {
      body.hours = Number(form.get("hours"));
      body.retention = Number(form.get("retention"));
    }
    const done = await callPettoVault(Astro2, id, session.userId, { method: "POST", body: JSON.stringify(body) });
    if (done.ok && DONE[action]) return Astro2.redirect(`${here}?done=${encodeURIComponent(action)}`, 303);
    return Astro2.redirect(`${here}?error=${encodeURIComponent(done.error && FAILED[done.error] ? done.error : "failed")}`, 303);
  }
  const doneKey = Astro2.url.searchParams.get("done") ?? "";
  const errorKey = Astro2.url.searchParams.get("error") ?? "";
  let message = DONE[doneKey] ?? null;
  let error = FAILED[errorKey] ?? null;
  const result = maintenance ? null : await callPettoVault(Astro2, id, session.userId);
  const vault = result?.ok ? result.payload : null;
  if (result && !result.ok && !error) error = result.error === "not_configured" ? dt("Vault is not connected to the dashboard yet.") : null;
  return renderTemplate`${renderComponent($$result, "DashBackups", $$DashBackups, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "backups": vault?.backups ?? [], "audit": vault?.audit ?? [], "schedule": vault?.schedule ?? null, "connected": Boolean(vault), "maintenance": maintenance, "restoreJob": vault?.restoreJob ?? null, "teamNotice": teamNotice, "premium": vault?.premium !== false, "message": message, "error": error })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/backups.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/backups.astro";
const $$url = "/dash/guild/[id]/backups";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Backups,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
