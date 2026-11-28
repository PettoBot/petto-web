import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, b as addAttribute, m as maybeRenderHead, F as Fragment, u as unescapeHTML } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { m as makeT, g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                            */
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$Modal } from '../../../../chunks/Modal_-nOZLo0Z.mjs';
import { M as MAX_PREFIXES, a as MAX_PREFIX_LENGTH, D as DEFAULT_PREFIXES, c as checkPrefixList, p as prefixesFromRows } from '../../../../chunks/guildPrefixes_MsnzaZTo.mjs';
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { n as noteGuildWrite, j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { k as syncPettoLanguage, C as syncPettoPrefix } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(raw || cooked.slice()) }));
var _a$2;
const $$Astro$3 = createAstro("https://petto.sbs");
const $$DashConfigImport = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$DashConfigImport;
  const { guildId } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const words = {
    choose: dt("Choose a .yaml or .yml file."),
    tooBig: dt("The file is too big (at most {n} KB)."),
    checking: dt("Checking the file..."),
    network: dt("Could not reach Petto. Try again."),
    fileOf: dt("{name} ({n} KB)"),
    toChange: dt("To change"),
    same: dt("Already the same"),
    skipped: dt("Skipped"),
    leftOut: dt("Left out"),
    unknown: dt("Not recognized"),
    nothing: dt("Nothing to change: the file matches this server."),
    skippedHead: dt("Skipped: these values cannot be used as they are"),
    warnHead: dt("Applied only in part"),
    leftOutHead: dt("Left out of the import"),
    unknownHead: dt("Not recognized in the file"),
    unreadable: dt("The current settings of this part could not be read, so it was not checked."),
    apply: dt("Apply {n} changes"),
    applyOne: dt("Apply 1 change"),
    applying: dt("Applying..."),
    progress: dt("Checking the file again\u2026|Saving the settings\u2026|Updating the server\u2026"),
    progressTitle: dt("Applying the file"),
    cancel: dt("Cancel"),
    ask: dt("Apply {n} changes to this server? The settings are saved now, and each one can be changed back from its own page, but this cannot be undone in one step."),
    yes: dt("Apply"),
    done: dt("Done: {n} settings changed."),
    doneSome: dt("Some parts could not be saved. Check the list and try again."),
    saved: dt("Saved"),
    notSaved: dt("Could not be saved"),
    toast: dt("Imported {n} settings."),
    toastFail: dt("Some settings could not be imported."),
    on: dt("on"),
    off: dt("off"),
    empty: dt("empty"),
    more: dt("+{n} more"),
    again: dt("Check another file")
  };
  return renderTemplate(_a$2 || (_a$2 = __template$2(["", '<section class="sx-panel cm-import" aria-labelledby="cm-imp-h" data-cm-import', "", '> <div class="sx-panel-head"> <span class="sx-panel-icon" style="--c:var(--accent)">', '</span> <h2 id="cm-imp-h">', '</h2> </div> <p class="sx-lead">', '</p> <p class="sx-hint cm-imp-scope">', "<span>", '</span></p> <div class="cm-imp-drop" data-cm-drop> ', " <strong>", "</strong> <span>", '</span> <button type="button" class="btn btn-ghost btn-sm" data-cm-pick>', '</button> <input type="file" class="cm-imp-file" accept=".yaml,.yml,text/yaml,text/x-yaml,text/plain" data-cm-file tabindex="-1"', '> <em class="cm-imp-name" data-cm-name hidden></em> </div> <details class="dfx-acc cm-imp-paste"> <summary><span class="dfx-acc-title"><b>', "</b></span>", '</summary> <div class="dfx-acc-body"> <textarea class="dgl-autogrow cm-imp-text" rows="4" spellcheck="false" autocomplete="off" data-cm-text', "", '></textarea> </div> </details> <div class="cm-imp-actions"> <button type="button" class="btn btn-accent btn-sm" data-cm-check disabled>', "", `</button> </div> <p class="cm-imp-error" role="alert" data-cm-error hidden></p> <div class="cm-imp-out" data-cm-out aria-live="polite" hidden></div> </section> <script>
  (function () {
    var root = document.querySelector('[data-cm-import]');
    if (!root || root.dataset.bound) return;
    root.dataset.bound = '1';
    var W = {};
    try { W = JSON.parse(root.getAttribute('data-words') || '{}'); } catch (e) { /* the texts stay empty */ }
    var MAX_KB = 256;
    var q = function (s) { return root.querySelector(s); };
    var dropEl = q('[data-cm-drop]'), fileEl = q('[data-cm-file]'), pickBtn = q('[data-cm-pick]'), nameEl = q('[data-cm-name]');
    var textEl = q('[data-cm-text]'), checkBtn = q('[data-cm-check]'), errEl = q('[data-cm-error]'), outEl = q('[data-cm-out]');
    var fill = function (s, vars) { return String(s).replace(/\\{(\\w+)\\}/g, function (m, k) { return vars && vars[k] != null ? vars[k] : m; }); };
    var el = function (tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
    var reduced = function () { return !!(window.dglMotion && window.dglMotion.reduced && window.dglMotion.reduced()); };
    var fileText = '';
    var busy = false;
    var checked = '';

    function showError(text) { errEl.textContent = text || ''; errEl.hidden = !text; }
    function source() { return fileText || textEl.value; }
    function refreshCheck() { checkBtn.disabled = busy || !source().trim(); }
    function clearOut() { outEl.hidden = true; outEl.replaceChildren(); checked = ''; }
    function uncover(node) {
      if (reduced()) return;
      node.classList.add('dgl-reveal-down');
      node.addEventListener('animationend', function done(e) { if (e.target !== node) return; node.classList.remove('dgl-reveal-down'); node.removeEventListener('animationend', done); });
    }
    function skeleton() {
      var s = el('div', 'cm-skel'); s.setAttribute('aria-hidden', 'true');
      [62, 38, 74, 50, 30, 66, 44].forEach(function (w) { var span = el('span'); span.style.width = w + '%'; s.appendChild(span); });
      return s;
    }

    // The file, chosen or dropped.
    function takeFile(file) {
      showError('');
      clearOut();
      if (!file) return;
      if (!/\\.(ya?ml|txt)$/i.test(file.name) && file.type && !/yaml|text/.test(file.type)) { showError(W.choose); return; }
      if (file.size > MAX_KB * 1024) { showError(fill(W.tooBig, { n: MAX_KB })); return; }
      file.text().then(function (text) {
        fileText = text; textEl.value = '';
        nameEl.textContent = fill(W.fileOf, { name: file.name, n: Math.max(1, Math.round(file.size / 1024)) });
        nameEl.hidden = false;
        refreshCheck();
      }).catch(function () { showError(W.choose); });
    }
    pickBtn.addEventListener('click', function () { fileEl.click(); });
    fileEl.addEventListener('change', function () { takeFile(fileEl.files && fileEl.files[0]); fileEl.value = ''; });
    ['dragenter', 'dragover'].forEach(function (type) { dropEl.addEventListener(type, function (e) { e.preventDefault(); dropEl.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (type) { dropEl.addEventListener(type, function (e) { e.preventDefault(); dropEl.classList.remove('over'); }); });
    dropEl.addEventListener('drop', function (e) { takeFile(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]); });
    textEl.addEventListener('input', function () { fileText = ''; nameEl.hidden = true; clearOut(); showError(''); refreshCheck(); });

    function post(action) {
      return fetch(root.getAttribute('data-src'), { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ action: action, yaml: source() }) })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (data) { return { ok: res.ok, data: data }; }); });
    }

    // How a value reads in the list.
    function show(value) {
      if (value === null || value === undefined || value === '') return W.empty;
      if (value === true) return W.on;
      if (value === false) return W.off;
      if (Array.isArray(value)) {
        if (!value.length) return W.empty;
        var head = value.slice(0, 5).join(', ');
        return value.length > 5 ? head + ' ' + fill(W.more, { n: value.length - 5 }) : head;
      }
      var text = String(value);
      return text.length > 90 ? text.slice(0, 89) + '\u2026' : text;
    }
    function group(title, count, tone, open) {
      var d = el('details', 'dfx-acc cm-imp-group ' + (tone || ''));
      if (open) d.open = true;
      var s = el('summary');
      var t = el('span', 'dfx-acc-title'); t.appendChild(el('b', null, title));
      s.append(t, el('span', 'cm-imp-count', String(count)));
      var caret = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); caret.setAttribute('viewBox', '0 0 256 256'); caret.setAttribute('width', '14'); caret.setAttribute('height', '14'); caret.setAttribute('class', 'dfx-caret'); caret.setAttribute('aria-hidden', 'true');
      caret.innerHTML = '<path fill="currentColor" d="M213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32Z"/>';
      s.appendChild(caret);
      var body = el('div', 'dfx-acc-body');
      d.append(s, body);
      return { node: d, body: body };
    }
    function row(setting) { var r = el('div', 'cm-imp-row'); r.appendChild(el('code', 'cm-imp-key', setting)); return r; }

    function drawPlan(plan) {
      outEl.replaceChildren();
      var t = plan.totals;
      var chips = el('div', 'cm-imp-sum');
      [[t.changes, W.toChange, 'go'], [t.unchanged, W.same, ''], [t.invalid, W.skipped, t.invalid ? 'bad' : ''], [t.ignored, W.leftOut, ''], [t.unknown, W.unknown, t.unknown ? 'warn' : '']].forEach(function (c) {
        var chip = el('span', 'cm-imp-chip ' + c[2]); chip.appendChild(el('b', null, String(c[0]))); chip.appendChild(document.createTextNode(' ' + c[1])); chips.appendChild(chip);
      });
      outEl.appendChild(chips);
      if (!t.changes) outEl.appendChild(el('p', 'cm-imp-nothing', W.nothing));
      plan.modules.forEach(function (m) {
        if (m.unreadable) { var u = el('p', 'cm-imp-warn', m.title + ': ' + W.unreadable); outEl.appendChild(u); }
      });
      var mods = plan.modules.filter(function (m) { return m.changes.length; });
      mods.forEach(function (m) {
        var g = group(m.title, m.changes.length, 'go', true);
        m.changes.forEach(function (c) {
          var r = row(c.setting);
          var vals = el('span', 'cm-imp-vals');
          vals.append(el('span', 'cm-imp-from', show(c.from)), el('span', 'cm-imp-arrow', '\u2192'), el('span', 'cm-imp-to', show(c.to)));
          r.appendChild(vals);
          if (c.note) r.appendChild(el('span', 'cm-imp-note', c.note));
          g.body.appendChild(r);
        });
        outEl.appendChild(g.node);
      });
      var bad = [], warn = [];
      plan.modules.forEach(function (m) { m.invalid.forEach(function (i) { bad.push([m, i]); }); m.warnings.forEach(function (i) { warn.push([m, i]); }); });
      if (bad.length) {
        var gb = group(W.skippedHead, bad.length, 'bad', true);
        bad.forEach(function (p) { var r = row(p[1].setting); r.appendChild(el('span', 'cm-imp-note bad', p[1].reason)); gb.body.appendChild(r); });
        outEl.appendChild(gb.node);
      }
      if (warn.length) {
        var gw = group(W.warnHead, warn.length, 'warn', true);
        warn.forEach(function (p) { var r = row(p[1].setting); r.appendChild(el('span', 'cm-imp-note warn', p[1].reason)); gw.body.appendChild(r); });
        outEl.appendChild(gw.node);
      }
      if (plan.ignored.length) {
        var gi = group(W.leftOutHead, plan.ignored.length, '', false);
        plan.ignored.forEach(function (i) { var r = row(i.path); r.appendChild(el('span', 'cm-imp-note', i.reason)); gi.body.appendChild(r); });
        outEl.appendChild(gi.node);
      }
      if (plan.unknown.length) {
        var gu = group(W.unknownHead, plan.unknown.length, 'warn', false);
        plan.unknown.forEach(function (p) { gu.body.appendChild(row(p)); });
        outEl.appendChild(gu.node);
      }
      var bar = el('div', 'cm-imp-actions');
      var apply = el('button', 'btn btn-accent btn-sm', t.changes === 1 ? W.applyOne : fill(W.apply, { n: t.changes })); apply.type = 'button';
      if (!t.changes) apply.disabled = true;
      var cancel = el('button', 'btn btn-ghost btn-sm', W.cancel); cancel.type = 'button';
      bar.append(apply, cancel);
      outEl.appendChild(bar);
      cancel.addEventListener('click', function () { clearOut(); });
      apply.addEventListener('click', function () { confirmApply(plan, apply, cancel); });
      outEl.hidden = false;
      uncover(outEl);
    }

    function confirmApply(plan, applyBtn, cancelBtn) {
      if (busy) return;
      var ask = window.dglConfirm ? window.dglConfirm(fill(W.ask, { n: plan.totals.changes }), { confirm: W.yes, tone: 'danger' }) : Promise.resolve(true);
      ask.then(function (yes) {
        if (!yes) return;
        busy = true; refreshCheck();
        applyBtn.disabled = true; cancelBtn.disabled = true; applyBtn.textContent = W.applying; applyBtn.classList.add('dgl-busy');
        outEl.appendChild(skeleton());
        var work = window.dglProgress ? window.dglProgress(W.progress, { title: W.progressTitle }) : null;
        post('apply').then(function (answer) {
          if (work) work.close();
          busy = false; refreshCheck();
          var data = answer.data || {};
          if (!data.plan) { applyBtn.disabled = false; cancelBtn.disabled = false; applyBtn.classList.remove('dgl-busy'); applyBtn.textContent = fill(W.apply, { n: plan.totals.changes }); outEl.querySelectorAll('.cm-skel').forEach(function (s) { s.remove(); }); showError(data.error || W.network); toast(data.error || W.network, false); return; }
          drawResult(data);
        }).catch(function () {
          if (work) work.close();
          busy = false; refreshCheck();
          applyBtn.disabled = false; cancelBtn.disabled = false; applyBtn.classList.remove('dgl-busy'); applyBtn.textContent = fill(W.apply, { n: plan.totals.changes });
          outEl.querySelectorAll('.cm-skel').forEach(function (s) { s.remove(); });
          showError(W.network); toast(W.network, false);
        });
      });
    }

    function toast(text, ok) { if (window.dglToast) window.dglToast(text, { kind: ok ? 'ok' : 'error' }); }

    function drawResult(data) {
      outEl.replaceChildren();
      var results = data.results || [];
      var changed = 0;
      var failedAny = false;
      var list = el('div', 'cm-imp-result');
      results.forEach(function (r) {
        var mod = (data.plan.modules || []).filter(function (m) { return m.id === r.id; })[0];
        var line = el('div', 'cm-imp-res ' + (r.ok ? 'ok' : 'bad'));
        line.appendChild(el('b', null, mod ? mod.title : r.id));
        line.appendChild(el('span', null, r.ok ? W.saved + ' (' + r.changes + ')' : W.notSaved));
        list.appendChild(line);
        if (r.ok) changed += r.changes; else failedAny = true;
      });
      outEl.appendChild(el('p', failedAny ? 'cm-imp-warn' : 'cm-imp-done', failedAny ? W.doneSome : fill(W.done, { n: changed })));
      outEl.appendChild(list);
      var bar = el('div', 'cm-imp-actions');
      var again = el('button', 'btn btn-ghost btn-sm', W.again); again.type = 'button';
      again.addEventListener('click', function () { fileText = ''; textEl.value = ''; nameEl.hidden = true; clearOut(); refreshCheck(); });
      bar.appendChild(again);
      outEl.appendChild(bar);
      uncover(outEl);
      toast(failedAny ? W.toastFail : fill(W.toast, { n: changed }), !failedAny);
      // The file shown above is read again in place: the page does not reload.
      var viewer = document.querySelector('[data-cm]');
      if (viewer) viewer.dispatchEvent(new CustomEvent('cm:reload'));
    }

    checkBtn.addEventListener('click', function () {
      if (busy || !source().trim()) return;
      showError(''); clearOut();
      busy = true; refreshCheck();
      var wait = el('div', 'cm-imp-wait'); wait.append(el('p', 'cm-imp-nothing', W.checking), skeleton());
      outEl.replaceChildren(wait); outEl.hidden = false;
      var started = Date.now();
      post('preview').then(function (answer) {
        // A check that answers at once still shows its placeholder for a moment, so the list does not flash in.
        var wait = Math.max(0, 260 - (Date.now() - started));
        setTimeout(function () {
          busy = false; refreshCheck();
          var data = answer.data || {};
          if (!answer.ok || !data.plan) { outEl.hidden = true; outEl.replaceChildren(); showError(data.error || W.network); return; }
          checked = source();
          drawPlan(data.plan);
        }, wait);
      }).catch(function () { busy = false; refreshCheck(); outEl.hidden = true; outEl.replaceChildren(); showError(W.network); });
    });
    refreshCheck();
  })();
<\/script> `], ["", '<section class="sx-panel cm-import" aria-labelledby="cm-imp-h" data-cm-import', "", '> <div class="sx-panel-head"> <span class="sx-panel-icon" style="--c:var(--accent)">', '</span> <h2 id="cm-imp-h">', '</h2> </div> <p class="sx-lead">', '</p> <p class="sx-hint cm-imp-scope">', "<span>", '</span></p> <div class="cm-imp-drop" data-cm-drop> ', " <strong>", "</strong> <span>", '</span> <button type="button" class="btn btn-ghost btn-sm" data-cm-pick>', '</button> <input type="file" class="cm-imp-file" accept=".yaml,.yml,text/yaml,text/x-yaml,text/plain" data-cm-file tabindex="-1"', '> <em class="cm-imp-name" data-cm-name hidden></em> </div> <details class="dfx-acc cm-imp-paste"> <summary><span class="dfx-acc-title"><b>', "</b></span>", '</summary> <div class="dfx-acc-body"> <textarea class="dgl-autogrow cm-imp-text" rows="4" spellcheck="false" autocomplete="off" data-cm-text', "", '></textarea> </div> </details> <div class="cm-imp-actions"> <button type="button" class="btn btn-accent btn-sm" data-cm-check disabled>', "", `</button> </div> <p class="cm-imp-error" role="alert" data-cm-error hidden></p> <div class="cm-imp-out" data-cm-out aria-live="polite" hidden></div> </section> <script>
  (function () {
    var root = document.querySelector('[data-cm-import]');
    if (!root || root.dataset.bound) return;
    root.dataset.bound = '1';
    var W = {};
    try { W = JSON.parse(root.getAttribute('data-words') || '{}'); } catch (e) { /* the texts stay empty */ }
    var MAX_KB = 256;
    var q = function (s) { return root.querySelector(s); };
    var dropEl = q('[data-cm-drop]'), fileEl = q('[data-cm-file]'), pickBtn = q('[data-cm-pick]'), nameEl = q('[data-cm-name]');
    var textEl = q('[data-cm-text]'), checkBtn = q('[data-cm-check]'), errEl = q('[data-cm-error]'), outEl = q('[data-cm-out]');
    var fill = function (s, vars) { return String(s).replace(/\\\\{(\\\\w+)\\\\}/g, function (m, k) { return vars && vars[k] != null ? vars[k] : m; }); };
    var el = function (tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
    var reduced = function () { return !!(window.dglMotion && window.dglMotion.reduced && window.dglMotion.reduced()); };
    var fileText = '';
    var busy = false;
    var checked = '';

    function showError(text) { errEl.textContent = text || ''; errEl.hidden = !text; }
    function source() { return fileText || textEl.value; }
    function refreshCheck() { checkBtn.disabled = busy || !source().trim(); }
    function clearOut() { outEl.hidden = true; outEl.replaceChildren(); checked = ''; }
    function uncover(node) {
      if (reduced()) return;
      node.classList.add('dgl-reveal-down');
      node.addEventListener('animationend', function done(e) { if (e.target !== node) return; node.classList.remove('dgl-reveal-down'); node.removeEventListener('animationend', done); });
    }
    function skeleton() {
      var s = el('div', 'cm-skel'); s.setAttribute('aria-hidden', 'true');
      [62, 38, 74, 50, 30, 66, 44].forEach(function (w) { var span = el('span'); span.style.width = w + '%'; s.appendChild(span); });
      return s;
    }

    // The file, chosen or dropped.
    function takeFile(file) {
      showError('');
      clearOut();
      if (!file) return;
      if (!/\\\\.(ya?ml|txt)$/i.test(file.name) && file.type && !/yaml|text/.test(file.type)) { showError(W.choose); return; }
      if (file.size > MAX_KB * 1024) { showError(fill(W.tooBig, { n: MAX_KB })); return; }
      file.text().then(function (text) {
        fileText = text; textEl.value = '';
        nameEl.textContent = fill(W.fileOf, { name: file.name, n: Math.max(1, Math.round(file.size / 1024)) });
        nameEl.hidden = false;
        refreshCheck();
      }).catch(function () { showError(W.choose); });
    }
    pickBtn.addEventListener('click', function () { fileEl.click(); });
    fileEl.addEventListener('change', function () { takeFile(fileEl.files && fileEl.files[0]); fileEl.value = ''; });
    ['dragenter', 'dragover'].forEach(function (type) { dropEl.addEventListener(type, function (e) { e.preventDefault(); dropEl.classList.add('over'); }); });
    ['dragleave', 'drop'].forEach(function (type) { dropEl.addEventListener(type, function (e) { e.preventDefault(); dropEl.classList.remove('over'); }); });
    dropEl.addEventListener('drop', function (e) { takeFile(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]); });
    textEl.addEventListener('input', function () { fileText = ''; nameEl.hidden = true; clearOut(); showError(''); refreshCheck(); });

    function post(action) {
      return fetch(root.getAttribute('data-src'), { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ action: action, yaml: source() }) })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (data) { return { ok: res.ok, data: data }; }); });
    }

    // How a value reads in the list.
    function show(value) {
      if (value === null || value === undefined || value === '') return W.empty;
      if (value === true) return W.on;
      if (value === false) return W.off;
      if (Array.isArray(value)) {
        if (!value.length) return W.empty;
        var head = value.slice(0, 5).join(', ');
        return value.length > 5 ? head + ' ' + fill(W.more, { n: value.length - 5 }) : head;
      }
      var text = String(value);
      return text.length > 90 ? text.slice(0, 89) + '\u2026' : text;
    }
    function group(title, count, tone, open) {
      var d = el('details', 'dfx-acc cm-imp-group ' + (tone || ''));
      if (open) d.open = true;
      var s = el('summary');
      var t = el('span', 'dfx-acc-title'); t.appendChild(el('b', null, title));
      s.append(t, el('span', 'cm-imp-count', String(count)));
      var caret = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); caret.setAttribute('viewBox', '0 0 256 256'); caret.setAttribute('width', '14'); caret.setAttribute('height', '14'); caret.setAttribute('class', 'dfx-caret'); caret.setAttribute('aria-hidden', 'true');
      caret.innerHTML = '<path fill="currentColor" d="M213.66 101.66l-80 80a8 8 0 0 1-11.32 0l-80-80a8 8 0 0 1 11.32-11.32L128 164.69l74.34-74.35a8 8 0 0 1 11.32 11.32Z"/>';
      s.appendChild(caret);
      var body = el('div', 'dfx-acc-body');
      d.append(s, body);
      return { node: d, body: body };
    }
    function row(setting) { var r = el('div', 'cm-imp-row'); r.appendChild(el('code', 'cm-imp-key', setting)); return r; }

    function drawPlan(plan) {
      outEl.replaceChildren();
      var t = plan.totals;
      var chips = el('div', 'cm-imp-sum');
      [[t.changes, W.toChange, 'go'], [t.unchanged, W.same, ''], [t.invalid, W.skipped, t.invalid ? 'bad' : ''], [t.ignored, W.leftOut, ''], [t.unknown, W.unknown, t.unknown ? 'warn' : '']].forEach(function (c) {
        var chip = el('span', 'cm-imp-chip ' + c[2]); chip.appendChild(el('b', null, String(c[0]))); chip.appendChild(document.createTextNode(' ' + c[1])); chips.appendChild(chip);
      });
      outEl.appendChild(chips);
      if (!t.changes) outEl.appendChild(el('p', 'cm-imp-nothing', W.nothing));
      plan.modules.forEach(function (m) {
        if (m.unreadable) { var u = el('p', 'cm-imp-warn', m.title + ': ' + W.unreadable); outEl.appendChild(u); }
      });
      var mods = plan.modules.filter(function (m) { return m.changes.length; });
      mods.forEach(function (m) {
        var g = group(m.title, m.changes.length, 'go', true);
        m.changes.forEach(function (c) {
          var r = row(c.setting);
          var vals = el('span', 'cm-imp-vals');
          vals.append(el('span', 'cm-imp-from', show(c.from)), el('span', 'cm-imp-arrow', '\u2192'), el('span', 'cm-imp-to', show(c.to)));
          r.appendChild(vals);
          if (c.note) r.appendChild(el('span', 'cm-imp-note', c.note));
          g.body.appendChild(r);
        });
        outEl.appendChild(g.node);
      });
      var bad = [], warn = [];
      plan.modules.forEach(function (m) { m.invalid.forEach(function (i) { bad.push([m, i]); }); m.warnings.forEach(function (i) { warn.push([m, i]); }); });
      if (bad.length) {
        var gb = group(W.skippedHead, bad.length, 'bad', true);
        bad.forEach(function (p) { var r = row(p[1].setting); r.appendChild(el('span', 'cm-imp-note bad', p[1].reason)); gb.body.appendChild(r); });
        outEl.appendChild(gb.node);
      }
      if (warn.length) {
        var gw = group(W.warnHead, warn.length, 'warn', true);
        warn.forEach(function (p) { var r = row(p[1].setting); r.appendChild(el('span', 'cm-imp-note warn', p[1].reason)); gw.body.appendChild(r); });
        outEl.appendChild(gw.node);
      }
      if (plan.ignored.length) {
        var gi = group(W.leftOutHead, plan.ignored.length, '', false);
        plan.ignored.forEach(function (i) { var r = row(i.path); r.appendChild(el('span', 'cm-imp-note', i.reason)); gi.body.appendChild(r); });
        outEl.appendChild(gi.node);
      }
      if (plan.unknown.length) {
        var gu = group(W.unknownHead, plan.unknown.length, 'warn', false);
        plan.unknown.forEach(function (p) { gu.body.appendChild(row(p)); });
        outEl.appendChild(gu.node);
      }
      var bar = el('div', 'cm-imp-actions');
      var apply = el('button', 'btn btn-accent btn-sm', t.changes === 1 ? W.applyOne : fill(W.apply, { n: t.changes })); apply.type = 'button';
      if (!t.changes) apply.disabled = true;
      var cancel = el('button', 'btn btn-ghost btn-sm', W.cancel); cancel.type = 'button';
      bar.append(apply, cancel);
      outEl.appendChild(bar);
      cancel.addEventListener('click', function () { clearOut(); });
      apply.addEventListener('click', function () { confirmApply(plan, apply, cancel); });
      outEl.hidden = false;
      uncover(outEl);
    }

    function confirmApply(plan, applyBtn, cancelBtn) {
      if (busy) return;
      var ask = window.dglConfirm ? window.dglConfirm(fill(W.ask, { n: plan.totals.changes }), { confirm: W.yes, tone: 'danger' }) : Promise.resolve(true);
      ask.then(function (yes) {
        if (!yes) return;
        busy = true; refreshCheck();
        applyBtn.disabled = true; cancelBtn.disabled = true; applyBtn.textContent = W.applying; applyBtn.classList.add('dgl-busy');
        outEl.appendChild(skeleton());
        var work = window.dglProgress ? window.dglProgress(W.progress, { title: W.progressTitle }) : null;
        post('apply').then(function (answer) {
          if (work) work.close();
          busy = false; refreshCheck();
          var data = answer.data || {};
          if (!data.plan) { applyBtn.disabled = false; cancelBtn.disabled = false; applyBtn.classList.remove('dgl-busy'); applyBtn.textContent = fill(W.apply, { n: plan.totals.changes }); outEl.querySelectorAll('.cm-skel').forEach(function (s) { s.remove(); }); showError(data.error || W.network); toast(data.error || W.network, false); return; }
          drawResult(data);
        }).catch(function () {
          if (work) work.close();
          busy = false; refreshCheck();
          applyBtn.disabled = false; cancelBtn.disabled = false; applyBtn.classList.remove('dgl-busy'); applyBtn.textContent = fill(W.apply, { n: plan.totals.changes });
          outEl.querySelectorAll('.cm-skel').forEach(function (s) { s.remove(); });
          showError(W.network); toast(W.network, false);
        });
      });
    }

    function toast(text, ok) { if (window.dglToast) window.dglToast(text, { kind: ok ? 'ok' : 'error' }); }

    function drawResult(data) {
      outEl.replaceChildren();
      var results = data.results || [];
      var changed = 0;
      var failedAny = false;
      var list = el('div', 'cm-imp-result');
      results.forEach(function (r) {
        var mod = (data.plan.modules || []).filter(function (m) { return m.id === r.id; })[0];
        var line = el('div', 'cm-imp-res ' + (r.ok ? 'ok' : 'bad'));
        line.appendChild(el('b', null, mod ? mod.title : r.id));
        line.appendChild(el('span', null, r.ok ? W.saved + ' (' + r.changes + ')' : W.notSaved));
        list.appendChild(line);
        if (r.ok) changed += r.changes; else failedAny = true;
      });
      outEl.appendChild(el('p', failedAny ? 'cm-imp-warn' : 'cm-imp-done', failedAny ? W.doneSome : fill(W.done, { n: changed })));
      outEl.appendChild(list);
      var bar = el('div', 'cm-imp-actions');
      var again = el('button', 'btn btn-ghost btn-sm', W.again); again.type = 'button';
      again.addEventListener('click', function () { fileText = ''; textEl.value = ''; nameEl.hidden = true; clearOut(); refreshCheck(); });
      bar.appendChild(again);
      outEl.appendChild(bar);
      uncover(outEl);
      toast(failedAny ? W.toastFail : fill(W.toast, { n: changed }), !failedAny);
      // The file shown above is read again in place: the page does not reload.
      var viewer = document.querySelector('[data-cm]');
      if (viewer) viewer.dispatchEvent(new CustomEvent('cm:reload'));
    }

    checkBtn.addEventListener('click', function () {
      if (busy || !source().trim()) return;
      showError(''); clearOut();
      busy = true; refreshCheck();
      var wait = el('div', 'cm-imp-wait'); wait.append(el('p', 'cm-imp-nothing', W.checking), skeleton());
      outEl.replaceChildren(wait); outEl.hidden = false;
      var started = Date.now();
      post('preview').then(function (answer) {
        // A check that answers at once still shows its placeholder for a moment, so the list does not flash in.
        var wait = Math.max(0, 260 - (Date.now() - started));
        setTimeout(function () {
          busy = false; refreshCheck();
          var data = answer.data || {};
          if (!answer.ok || !data.plan) { outEl.hidden = true; outEl.replaceChildren(); showError(data.error || W.network); return; }
          checked = source();
          drawPlan(data.plan);
        }, wait);
      }).catch(function () { busy = false; refreshCheck(); outEl.hidden = true; outEl.replaceChildren(); showError(W.network); });
    });
    refreshCheck();
  })();
<\/script> `])), maybeRenderHead(), addAttribute(`/dash/guild/${guildId}/general-config-import`, "data-src"), addAttribute(JSON.stringify(words), "data-words"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:upload-simple-bold", "width": "17", "height": "17" }), dt("Import"), dt("Bring back a configuration file like the YAML above (the one you downloaded). Petto shows what would change first, and nothing is saved until you confirm."), renderComponent($$result, "Icon", $$Icon, { "name": "ph:info-fill", "width": "15", "height": "15" }), dt("Imported: the prefixes, language and mute role of the server, AutoMod, Leveling, Counting and Birthdays. Lists (commands, rewards, panels...), settings that have their own page and anything that changes Discord are left out, and listed after you check the file."), renderComponent($$result, "Icon", $$Icon, { "name": "ph:file-arrow-up-fill", "width": "26", "height": "26" }), dt("Drop a YAML file here"), dt("or"), dt("Choose a file"), addAttribute(dt("Choose a file"), "aria-label"), dt("Or paste the text"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14" }), addAttribute(dt("Paste the YAML here"), "placeholder"), addAttribute(dt("Paste the YAML here"), "aria-label"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "14", "height": "14" }), dt("Check file"));
}, "/home/runner/work/petto-web/petto-web/src/components/DashConfigImport.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$2 = createAstro("https://petto.sbs");
const $$DashConfigManagement = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$DashConfigManagement;
  const { guildId } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const tiles = [
    { id: "protections", jump: "moderation", module: dt("Moderation"), label: dt("Protections on") },
    { id: "welcome", jump: "onboarding", module: dt("Onboarding"), label: dt("Welcome, leave and boost channels") },
    { id: "custom_commands", jump: "automation", module: dt("Automation"), label: dt("Custom commands") },
    { id: "autoresponders", jump: "automation", module: dt("Automation"), label: dt("Autoresponders") },
    { id: "reaction_roles", jump: "automation", module: dt("Automation"), label: dt("Reaction roles") },
    { id: "timers", jump: "automation", module: dt("Automation"), label: dt("Timers") },
    { id: "feeds", jump: "automation", module: dt("Automation"), label: dt("Feeds") },
    { id: "log_routes", jump: "logging", module: dt("Logging"), label: dt("Log channels set") },
    { id: "ticket_types", jump: "tickets", module: dt("Tickets"), label: dt("Ticket categories") },
    { id: "level_rewards", jump: "leveling", module: dt("Leveling"), label: dt("Level rewards") },
    { id: "embed_templates", jump: "design", module: dt("Design"), label: dt("Saved embeds") },
    { id: "image_cards", jump: "design", module: dt("Design"), label: dt("Image cards") }
  ];
  const texts = {
    loading: dt("Loading..."),
    failed: dt("Couldn't load the preview, try refreshing."),
    retry: dt("Try again"),
    lines: dt("{n} lines"),
    copy: dt("Copy"),
    copied: dt("Copied"),
    matches: dt("{n} matches"),
    noMatches: dt("No matches."),
    moreBefore: dt("Previous lines"),
    moreAfter: dt("Next lines"),
    partBefore: dt("Previous part: {name}"),
    partAfter: dt("Next part: {name}"),
    server: dt("Server"),
    sections: {
      bot_profile: dt("Bot profile"),
      permissions: dt("Permissions"),
      moderation: dt("Moderation"),
      appeals: dt("Appeals"),
      leveling: dt("Leveling"),
      tickets: dt("Tickets"),
      giveaways: dt("Giveaways"),
      automation: dt("Automation"),
      design: dt("Design"),
      logging: dt("Logging"),
      community: dt("Community"),
      boards: dt("Boards"),
      vanity: dt("Vanity roles"),
      forms: dt("Forms"),
      onboarding: dt("Onboarding")
    }
  };
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="cm sx-stack" data-cm', "", "", '> <p class="sx-lead cm-intro">', '</p> <section class="sx-panel cm-summary" aria-labelledby="cm-sum-h"> <div class="sx-panel-head"> <span class="sx-panel-icon" style="--c:var(--green)">', '</span> <h2 id="cm-sum-h">', '</h2> </div> <p class="sx-lead">', '</p> <div class="cm-tiles"> ', ' </div> </section> <section class="sx-panel cm-viewer" aria-labelledby="cm-view-h"> <div class="sx-panel-head cm-vhead"> <span class="sx-panel-icon" style="--c:var(--green)">', '</span> <h2 id="cm-view-h">', '</h2> <span class="sx-tag cm-lines" data-cm-lines></span> <div class="cm-vbtns"> <button type="button" class="btn btn-ghost btn-sm" data-cm-copy>', "<span data-cm-copy-l>", '</span></button> <button type="button" class="btn btn-ghost btn-sm" data-cm-yaml>', "", '</button> </div> </div> <p class="sx-lead">', '</p> <div class="cm-toolbar"> <label class="cm-search"> ', ' <input type="search" data-cm-q', "", ' autocomplete="off" spellcheck="false"> <span class="cm-count" data-cm-count aria-live="polite"></span> </label> <label class="dfx-chip"><input type="checkbox" data-cm-only>', '</label> </div> <div class="cm-body"> <nav class="cm-nav" data-cm-nav', '></nav> <div class="cm-codebox"> <div class="cm-code" data-cm-code tabindex="0" role="region"', '> <div class="cm-skel" aria-hidden="true"> ', ' </div> </div> </div> </div> </section> <div class="sx-duo cm-duo"> <section class="sx-panel cm-download" aria-labelledby="cm-dl-h"> <div class="sx-panel-head"> <span class="sx-panel-icon" style="--c:var(--accent)">', '</span> <h2 id="cm-dl-h">', '</h2> </div> <p class="sx-lead">', '</p> <div class="cm-actions"> <a', ' download class="btn btn-accent btn-sm"> ', " ", ' </a> <span class="cm-file">petto-', '-config.json</span> </div> <p class="sx-hint cm-backups">', "<span>", " <a", ">", '</a>.</span></p> </section> <section class="sx-panel cm-danger" aria-labelledby="cm-danger-h"> <div class="sx-panel-head"> <span class="sx-panel-icon" style="--c:var(--red)">', '</span> <h2 id="cm-danger-h">', '</h2> </div> <p class="sx-lead">', '</p> <ul class="cm-list"> <li>', "</li> <li>", "</li> <li>", '</li> </ul> <p class="sx-hint">', '</p> <form method="POST" class="dg-reset-form cm-reset" data-no-dirty', "", '> <input type="hidden" name="action" value="reset"> <button type="submit" class="btn btn-danger btn-sm"', "> ", " ", " </button> </form> </section> </div> ", ' <section class="sx-panel cm-scope" aria-labelledby="cm-scope-h"> <div class="sx-panel-head"> <span class="sx-panel-icon" style="--c:var(--blue)">', '</span> <h2 id="cm-scope-h">', '</h2> </div> <div class="cm-folds"> <details class="dfx-acc cm-yes" open> <summary>', '<span class="dfx-acc-title"><b>', "</b></span>", '</summary> <div class="dfx-acc-body"> <ul class="cm-list"> <li>', "</li> <li>", "</li> <li>", '</li> </ul> </div> </details> <details class="dfx-acc cm-no" open> <summary>', '<span class="dfx-acc-title"><b>', "</b></span>", '</summary> <div class="dfx-acc-body"> <ul class="cm-list"> <li>', "</li> <li>", "</li> <li>", "</li> <li>", "</li> <li>", `</li> </ul> </div> </details> </div> </section> <script>
    (function () {
      var root = document.querySelector('[data-cm]');
      if (!root || root.dataset.cmBound) return;
      root.dataset.cmBound = '1';
      var T = JSON.parse(root.dataset.text);
      var codeEl = root.querySelector('[data-cm-code]');
      var navEl = root.querySelector('[data-cm-nav]');
      var qEl = root.querySelector('[data-cm-q]');
      var countEl = root.querySelector('[data-cm-count]');
      var linesEl = root.querySelector('[data-cm-lines]');
      var onlyEl = root.querySelector('[data-cm-only]');
      var copyBtn = root.querySelector('[data-cm-copy]');
      var copyLabel = root.querySelector('[data-cm-copy-l]');
      var yamlBtn = root.querySelector('[data-cm-yaml]');
      var text = '';
      var lines = [];
      var sections = [];
      var vals = {};
      // The part chosen from the list or a tile stays marked while the file settles there, even when it is too near the end to reach the top.

      function fill(s, n) { return String(s).replace('{n}', n); }
      function el(tag, cls, t) { var n = document.createElement(tag); if (cls) n.className = cls; if (t != null) n.textContent = t; return n; }

      // The values of the file as "path.to.key" -> text (the file is ours: two spaces per level, one key per line).
      function parse() {
        vals = {};
        var stack = [];
        lines.forEach(function (l) {
          var m = /^( *)([A-Za-z0-9_]+):(?: +(.*))?$/.exec(l);
          if (!m) return;
          var d = m[1].length / 2;
          stack.length = d; stack[d] = m[2];
          var v = m[3];
          if (v != null && v.trim() && v.trim().charAt(0) !== '#') vals[stack.slice(0, d + 1).join('.')] = v.replace(/\\s+#.*$/, '').trim();
        });
      }
      function num(k) { var n = Number(vals[k]); return isFinite(n) ? n : 0; }
      function on(k) { return vals[k] === 'true'; }
      function set(k) { return vals[k] != null && vals[k] !== 'null'; }

      function tileValues() {
        var protections = ['moderation.automod.word_filter_enabled', 'moderation.automod.anti_spam_enabled', 'moderation.automod.anti_raid_enabled', 'moderation.automod.anti_alt_enabled', 'moderation.antinuke.enabled'].filter(on).length;
        var welcome = ['onboarding.welcome_channel_id', 'onboarding.leave_channel_id', 'onboarding.boost_channel_id'].filter(set).length;
        return {
          protections: protections + '/5',
          welcome: welcome + '/3',
          custom_commands: num('automation.custom_commands_count'),
          autoresponders: num('automation.autoresponders_count'),
          reaction_roles: num('automation.reaction_roles_count'),
          timers: num('automation.timers_count'),
          feeds: num('automation.feeds_count'),
          log_routes: num('logging.routed_events_count'),
          ticket_types: num('tickets.support_types_count'),
          level_rewards: num('leveling.rewards_count'),
          embed_templates: num('design.embed_templates_count'),
          image_cards: num('design.image_cards_count'),
        };
      }
      function drawTiles() {
        var v = tileValues();
        root.querySelectorAll('[data-tile]').forEach(function (tile) {
          var x = v[tile.dataset.tile];
          tile.querySelector('[data-v]').textContent = x == null ? '-' : x;
          tile.classList.toggle('zero', x === 0 || x === '0/5' || x === '0/3');
        });
      }

      // A YAML line as [class, text] pieces: key, comment, quoted text, numbers, true/false, null.
      function pieces(line) {
        var out = [];
        var m = /^( *)(- )?([A-Za-z0-9_]+)(:)(.*)$/.exec(line);
        var rest = line;
        if (/^\\s*#/.test(line)) return [['c', line]];
        if (m) { if (m[1]) out.push(['', m[1]]); if (m[2]) out.push(['p', m[2]]); out.push(['k', m[3]], ['p', m[4]]); rest = m[5]; }
        var re = /('(?:[^']|'')*')|("(?:[^"\\\\]|\\\\.)*")|(-?\\b\\d+(?:\\.\\d+)?\\b)|(\\btrue\\b|\\bfalse\\b)|(\\bnull\\b)|(#.*$)/g;
        var last = 0, t;
        while ((t = re.exec(rest))) {
          if (t.index > last) out.push(['', rest.slice(last, t.index)]);
          out.push([t[1] || t[2] ? 's' : t[3] ? 'n' : t[4] ? 'b' : t[5] ? 'z' : 'c', t[0]]);
          last = t.index + t[0].length;
        }
        if (last < rest.length) out.push(['', rest.slice(last)]);
        return out;
      }

      // ---- The viewer shows ONE part of the file at a time (Moderation, Automation...), in pieces of about 1,500 px of height at most, with the
      // ---- long lines wrapped. The box used to be the whole file: 700 lines, 1,600 px wide, 12,500 px tall, and a phone (which draws the pixels
      // ---- three times over) could not keep that in its graphics memory: the browser stopped working when a button was pressed. The chips and
      // ---- tiles change the part that is shown, and a part longer than a piece has a row at each end to go to the lines before or after.
      var ROW = 20;      // the height of a line, in pixels (also the line-height of the box)
      var GUT = 52;      // the room on the left for the number of the line
      var tokens = [];   // the pieces of each line, made when the line is first needed
      var htmlCache = [];// the markup of each line for the current search
      var lowLines = []; // the lines in lowercase (made at the first search)
      var hitList = [];  // every match of the search: { line, k } (k: which match of that line)
      var hitLine = [];  // 1 for each line that has a match
      var secOf = [];    // the part each line belongs to
      var q = '';        // the search, lowercase
      var win = null;    // the box of the lines that are shown
      var secIdx = 0, lineList = [], chunks = [], chunkIdx = 0, rowEls = [];
      var charW = 7.2, cpl = 40, budget = 1500, boxW = 0;
      var curMark = null, searchTimer = 0, flashTimer = 0, cur = -1;
      var reduceMedia = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

      var AMP = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
      function esc(str) { return str.replace(/[&<>]/g, function (c) { return AMP[c]; }); }
      function markHtml(str) {
        var low = str.toLowerCase(), at = 0, i, out = '';
        while ((i = low.indexOf(q, at)) !== -1) {
          out += esc(str.slice(at, i)) + '<mark class="cm-hit">' + esc(str.slice(i, i + q.length)) + '</mark>';
          at = i + q.length;
        }
        return out + esc(str.slice(at));
      }
      function lineHtml(i) {
        var h = htmlCache[i];
        if (h !== undefined) return h;
        var p = tokens[i] || (tokens[i] = pieces(lines[i]));
        var out = '';
        for (var k = 0; k < p.length; k++) {
          var inner = q ? markHtml(p[k][1]) : esc(p[k][1]);
          out += p[k][0] ? '<span class="y-' + p[k][0] + '">' + inner + '</span>' : inner;
        }
        return (htmlCache[i] = out || ' ');
      }
      function paintCur(row, hit) {
        var m = row.getElementsByClassName('cm-hit')[hit.k];
        if (m) { if (curMark && curMark !== m) curMark.classList.remove('cur'); m.classList.add('cur'); curMark = m; }
      }

      // How wide a letter is and how many fit on a line of the box: the pieces are cut so each is about as tall as the budget (and the box
      // never has more to carry than that).
      function measure() {
        var probe = el('span');
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:inherit';
        probe.textContent = '0000000000000000000000000000000000000000';
        codeEl.appendChild(probe);
        charW = probe.getBoundingClientRect().width / 40 || 7.2;
        probe.remove();
        boxW = codeEl.clientWidth;
        cpl = Math.max(12, Math.floor((boxW - GUT - 18) / charW));
        budget = Math.max(900, Math.min(1600, Math.floor(480000 / Math.max(240, boxW))));
      }
      function chunkify(list) {
        var out = [], from = 0, h = 0;
        for (var k = 0; k < list.length; k++) {
          var lh = Math.max(1, Math.ceil(lines[list[k]].length / cpl)) * ROW;
          if (h + lh > budget && k - from >= 20) { out.push([from, k]); from = k; h = 0; }
          h += lh;
        }
        out.push([from, list.length]);
        return out;
      }

      function buildBox() {
        win = el('div', 'cm-win');
        codeEl.replaceChildren(win);
        rowEls = []; curMark = null;
        measure();
        win.addEventListener('click', function (e) {
          var b = e.target.closest ? e.target.closest('[data-more]') : null;
          if (!b) return;
          var act = b.getAttribute('data-more');
          if (act === 'chunk-prev') { chunkIdx -= 1; drawChunk(true); }
          else if (act === 'chunk-next') { chunkIdx += 1; drawChunk(true); }
          else if (act === 'sec-prev') showSection(secIdx - 1, null, false, 'end');
          else if (act === 'sec-next') showSection(secIdx + 1, null, false);
        });
      }

      function moreRow(act, text) { return '<button type="button" class="cm-more" data-more="' + act + '">' + esc(text) + '</button>'; }
      // Draws the piece that is shown: its lines (as one block of markup, so the browser lays it out once), and the rows at its ends.
      function drawChunk(toTop) {
        if (!win) return;
        curMark = null;
        var c = chunks[chunkIdx] || [0, 0];
        var html = '';
        if (chunkIdx > 0) html += moreRow('chunk-prev', T.moreBefore);
        else if (secIdx > 0 && !onlyOn()) html += moreRow('sec-prev', fill2(T.partBefore, sections[secIdx - 1].label));
        for (var k = c[0]; k < c[1]; k++) { var i = lineList[k]; html += '<div class="cm-line" data-n="' + (i + 1) + '">' + lineHtml(i) + '</div>'; }
        if (c[0] === c[1]) html += '<p class="cm-none">' + esc(T.noMatches) + '</p>';
        if (chunkIdx < chunks.length - 1) html += moreRow('chunk-next', T.moreAfter);
        else if (secIdx < sections.length - 1 && !onlyOn()) html += moreRow('sec-next', fill2(T.partAfter, sections[secIdx + 1].label));
        win.innerHTML = html;
        rowEls = Array.prototype.slice.call(win.getElementsByClassName('cm-line'));
        if (cur >= 0 && hitList[cur]) { var r = rowFor(hitList[cur].line); if (r) paintCur(r, hitList[cur]); }
        if (toTop) codeEl.scrollTop = 0;
      }
      function fill2(str, name) { return String(str).replace('{name}', name); }
      function onlyOn() { return Boolean(onlyEl.checked && q); }
      function rowFor(line) {
        var n = String(line + 1);
        for (var k = 0; k < rowEls.length; k++) if (rowEls[k].getAttribute('data-n') === n) return rowEls[k];
        return null;
      }

      // Shows a part of the file (from the first line of its piece, or from the piece that holds \`focusLine\`).
      function showSection(idx, focusLine, light, where) {
        if (idx < 0 || idx >= sections.length) return;
        secIdx = idx;
        var s = sections[idx], from = idx === 0 ? 0 : s.line, to = s.end, only = onlyOn();
        lineList = [];
        for (var i = from; i < to; i++) if (!only || hitLine[i]) lineList.push(i);
        chunks = chunkify(lineList);
        chunkIdx = where === 'end' ? chunks.length - 1 : 0;
        if (focusLine != null) {
          var pos = lineList.indexOf(focusLine);
          for (var c = 0; c < chunks.length && pos >= 0; c++) if (pos >= chunks[c][0] && pos < chunks[c][1]) { chunkIdx = c; break; }
        }
        drawChunk(true);
        markChip(s);
        if (light) lightFirstLines();
      }
      // The first lines of the part light up for a moment (the class goes on after the lines are drawn, so nothing is measured in between).
      function lightFirstLines() {
        clearTimeout(flashTimer);
        rowEls.forEach(function (r) { r.classList.remove('flash'); });
        if (reduceMedia && reduceMedia.matches) return;
        var mine = rowEls.slice(0, 3);
        requestAnimationFrame(function () { mine.forEach(function (r) { r.classList.add('flash'); }); });
        flashTimer = setTimeout(function () { mine.forEach(function (r) { r.classList.remove('flash'); }); }, 1500);
      }
      function markChip(found) {
        sections.forEach(function (s) { s.btn.classList.toggle('on', s === found); });
        // The chip of the part that is shown is in view in the strip of chips (the strip scrolls sideways on a phone).
        if (found.btn.scrollIntoView && navEl.scrollWidth > navEl.clientWidth + 2) navEl.scrollTo({ left: Math.max(0, found.btn.offsetLeft - 12), behavior: 'auto' });
      }

      // The search runs on the text of the lines (never on what is on screen), a moment after the person stops typing, and over the whole file:
      // each chip says how many matches its part has, and Enter goes from one to the next, changing the part that is shown when it has to.
      function runSearch() {
        clearTimeout(searchTimer); searchTimer = 0;
        q = qEl.value.trim().toLowerCase();
        htmlCache = []; hitList = []; hitLine = []; cur = -1; curMark = null;
        var perSec = sections.map(function () { return 0; });
        if (q) {
          if (!lowLines.length) for (var z = 0; z < lines.length; z++) lowLines.push(lines[z].toLowerCase());
          for (var i = 0; i < lines.length; i++) {
            // Most lines do not hold the search at all: they are skipped before their pieces are looked at.
            if (lowLines[i].indexOf(q) === -1) continue;
            var p = tokens[i] || (tokens[i] = pieces(lines[i]));
            var found = 0;
            for (var k = 0; k < p.length; k++) {
              var low = p[k][1].toLowerCase(), at = 0, x;
              while ((x = low.indexOf(q, at)) !== -1) { hitList.push({ line: i, k: found++ }); at = x + q.length; }
            }
            if (found) { hitLine[i] = 1; perSec[secOf[i]] += found; }
          }
        }
        sections.forEach(function (s, i) {
          var n = s.btn.querySelector('.cm-nav-n');
          n.textContent = q ? String(perSec[i]) : String(s.line + 1);
          s.btn.classList.toggle('has', Boolean(q) && perSec[i] > 0);
          s.btn.classList.toggle('none', Boolean(q) && perSec[i] === 0);
        });
        countEl.textContent = q ? (hitList.length ? fill(T.matches, hitList.length) : T.noMatches) : '';
        countEl.classList.toggle('none', Boolean(q) && !hitList.length);
        // The part that is shown is drawn again (the search marks and, with "only matching lines", the lines change), at the first match.
        if (q && hitList.length) { showSection(secOf[hitList[0].line], hitList[0].line, false); step(1); }
        else showSection(secIdx, null, false);
      }
      // Enter goes to the next match, Shift+Enter to the one before.
      function step(dir) {
        if (searchTimer) runSearch();
        if (!hitList.length) return;
        cur = (cur + dir + hitList.length) % hitList.length;
        var hit = hitList[cur];
        var row = secOf[hit.line] === secIdx ? rowFor(hit.line) : null;
        if (!row) { showSection(secOf[hit.line], hit.line, false); row = rowFor(hit.line); }
        else if (curMark) { curMark.classList.remove('cur'); curMark = null; }
        if (!row) return;
        paintCur(row, hit);
        var y = row.offsetTop, box = codeEl.clientHeight;
        if (y < codeEl.scrollTop + 8 || y > codeEl.scrollTop + box - 60) codeEl.scrollTo({ top: Math.max(0, y - box / 3), behavior: 'auto' });
      }

      function buildSections() {
        sections = [];
        lines.forEach(function (l, i) {
          if (/^guild_id:/.test(l)) sections.push({ key: 'server', label: T.server, line: i });
          var m = /^([a-z_]+):\\s*(#.*)?$/.exec(l);
          if (m) sections.push({ key: m[1], label: T.sections[m[1]] || m[1], line: i });
        });
        sections.forEach(function (s, i) { s.end = i + 1 < sections.length ? sections[i + 1].line : lines.length; });
        secOf = new Array(lines.length);
        sections.forEach(function (s, i) { for (var k = (i === 0 ? 0 : s.line); k < s.end; k++) secOf[k] = i; });
        navEl.replaceChildren();
        sections.forEach(function (s, i) {
          var b = el('button', 'cm-nav-i');
          b.type = 'button'; b.dataset.key = s.key;
          b.append(el('span', 'cm-nav-l', s.label), el('span', 'cm-nav-n', String(s.line + 1)));
          b.addEventListener('click', function () { jump(s.key); });
          navEl.appendChild(b);
          s.btn = b;
        });
      }
      // A chip or a tile: the part is shown from its top, and its first lines light up. A search that left lines out is shown whole again.
      function jump(key) {
        var idx = -1; sections.forEach(function (x, i) { if (x.key === key) idx = i; });
        if (idx < 0) return;
        if (onlyEl.checked) { onlyEl.checked = false; }
        showSection(idx, null, true);
        // The keyboard follows the file (arrows scroll it) when there is a keyboard; on a phone nothing needs the focus and moving it costs a frame.
        if (!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches)) codeEl.focus({ preventScroll: true });
      }
      // When the box changes width (a phone turned around) the pieces are cut again, and the one that was shown stays where it was.
      if (window.ResizeObserver) new ResizeObserver(function () {
        if (!win || !lines.length || Math.abs(codeEl.clientWidth - boxW) < 24) return;
        var keep = lineList[(chunks[chunkIdx] || [0])[0]];
        measure(); showSection(secIdx, keep == null ? null : keep, false);
      }).observe(codeEl);

      qEl.addEventListener('input', function () { clearTimeout(searchTimer); searchTimer = setTimeout(runSearch, 120); });
      qEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); step(e.shiftKey ? -1 : 1); }
        else if (e.key === 'Escape' && qEl.value) { e.preventDefault(); qEl.value = ''; runSearch(); }
      });
      onlyEl.addEventListener('change', function () { runSearch(); });
      root.querySelectorAll('[data-jump]').forEach(function (b) { b.addEventListener('click', function () { if (text) jump(b.dataset.jump); }); });

      function copyText(s) {
        if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(s);
        return new Promise(function (resolve, reject) {
          var ta = el('textarea'); ta.value = s; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
          document.body.appendChild(ta); ta.select();
          var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
          ta.remove(); ok ? resolve() : reject();
        });
      }
      var copyTimer = 0;
      copyBtn.addEventListener('click', function () {
        if (!text) return;
        copyText(text).then(function () {
          copyLabel.textContent = T.copied; copyBtn.classList.add('done');
          clearTimeout(copyTimer);
          copyTimer = setTimeout(function () { copyLabel.textContent = T.copy; copyBtn.classList.remove('done'); }, 1800);
        }).catch(function () {});
      });
      yamlBtn.addEventListener('click', function () {
        if (!text) return;
        var url = URL.createObjectURL(new Blob([text], { type: 'text/yaml;charset=utf-8' }));
        var a = document.createElement('a');
        a.href = url; a.download = 'petto-' + root.dataset.guild + '-config.yaml';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      });

      function failed() {
        var box = el('div', 'cm-fail');
        var retry = el('button', 'btn btn-ghost btn-sm', T.retry); retry.type = 'button';
        retry.addEventListener('click', load);
        box.append(el('span', null, T.failed), retry);
        codeEl.replaceChildren(box);
      }
      function load() {
        var skel = el('div', 'cm-skel'); skel.setAttribute('aria-hidden', 'true');
        [62, 38, 74, 50, 30, 66, 44, 58, 36, 70, 48, 28].forEach(function (w) { var s = el('span'); s.style.width = w + '%'; skel.appendChild(s); });
        codeEl.replaceChildren(skel);
        fetch(root.dataset.src, { credentials: 'same-origin' })
          .then(function (res) { return res.ok ? res.text() : Promise.reject(); })
          .then(function (body) {
            text = body.replace(/\\n$/, '');
            lines = text.split('\\n');
            linesEl.textContent = fill(T.lines, lines.length);
            parse(); drawTiles(); buildSections(); tokens = []; htmlCache = []; lowLines = []; hitList = []; hitLine = []; cur = -1; secIdx = 0;
            buildBox(); runSearch();
            // Open past the banner, on the first setting; the banner is still there above.
            if (sections.length) { var g = rowFor(sections[0].line); if (g) codeEl.scrollTop = Math.max(0, g.offsetTop - 8); }
          })
          .catch(failed);
      }
      load();
      // The import panel asks for the file to be read again after it applies a file (no page reload).
      root.addEventListener('cm:reload', function () { load(); });
    })();
  <\/script> </div> `], ["", '<div class="cm sx-stack" data-cm', "", "", '> <p class="sx-lead cm-intro">', '</p> <section class="sx-panel cm-summary" aria-labelledby="cm-sum-h"> <div class="sx-panel-head"> <span class="sx-panel-icon" style="--c:var(--green)">', '</span> <h2 id="cm-sum-h">', '</h2> </div> <p class="sx-lead">', '</p> <div class="cm-tiles"> ', ' </div> </section> <section class="sx-panel cm-viewer" aria-labelledby="cm-view-h"> <div class="sx-panel-head cm-vhead"> <span class="sx-panel-icon" style="--c:var(--green)">', '</span> <h2 id="cm-view-h">', '</h2> <span class="sx-tag cm-lines" data-cm-lines></span> <div class="cm-vbtns"> <button type="button" class="btn btn-ghost btn-sm" data-cm-copy>', "<span data-cm-copy-l>", '</span></button> <button type="button" class="btn btn-ghost btn-sm" data-cm-yaml>', "", '</button> </div> </div> <p class="sx-lead">', '</p> <div class="cm-toolbar"> <label class="cm-search"> ', ' <input type="search" data-cm-q', "", ' autocomplete="off" spellcheck="false"> <span class="cm-count" data-cm-count aria-live="polite"></span> </label> <label class="dfx-chip"><input type="checkbox" data-cm-only>', '</label> </div> <div class="cm-body"> <nav class="cm-nav" data-cm-nav', '></nav> <div class="cm-codebox"> <div class="cm-code" data-cm-code tabindex="0" role="region"', '> <div class="cm-skel" aria-hidden="true"> ', ' </div> </div> </div> </div> </section> <div class="sx-duo cm-duo"> <section class="sx-panel cm-download" aria-labelledby="cm-dl-h"> <div class="sx-panel-head"> <span class="sx-panel-icon" style="--c:var(--accent)">', '</span> <h2 id="cm-dl-h">', '</h2> </div> <p class="sx-lead">', '</p> <div class="cm-actions"> <a', ' download class="btn btn-accent btn-sm"> ', " ", ' </a> <span class="cm-file">petto-', '-config.json</span> </div> <p class="sx-hint cm-backups">', "<span>", " <a", ">", '</a>.</span></p> </section> <section class="sx-panel cm-danger" aria-labelledby="cm-danger-h"> <div class="sx-panel-head"> <span class="sx-panel-icon" style="--c:var(--red)">', '</span> <h2 id="cm-danger-h">', '</h2> </div> <p class="sx-lead">', '</p> <ul class="cm-list"> <li>', "</li> <li>", "</li> <li>", '</li> </ul> <p class="sx-hint">', '</p> <form method="POST" class="dg-reset-form cm-reset" data-no-dirty', "", '> <input type="hidden" name="action" value="reset"> <button type="submit" class="btn btn-danger btn-sm"', "> ", " ", " </button> </form> </section> </div> ", ' <section class="sx-panel cm-scope" aria-labelledby="cm-scope-h"> <div class="sx-panel-head"> <span class="sx-panel-icon" style="--c:var(--blue)">', '</span> <h2 id="cm-scope-h">', '</h2> </div> <div class="cm-folds"> <details class="dfx-acc cm-yes" open> <summary>', '<span class="dfx-acc-title"><b>', "</b></span>", '</summary> <div class="dfx-acc-body"> <ul class="cm-list"> <li>', "</li> <li>", "</li> <li>", '</li> </ul> </div> </details> <details class="dfx-acc cm-no" open> <summary>', '<span class="dfx-acc-title"><b>', "</b></span>", '</summary> <div class="dfx-acc-body"> <ul class="cm-list"> <li>', "</li> <li>", "</li> <li>", "</li> <li>", "</li> <li>", `</li> </ul> </div> </details> </div> </section> <script>
    (function () {
      var root = document.querySelector('[data-cm]');
      if (!root || root.dataset.cmBound) return;
      root.dataset.cmBound = '1';
      var T = JSON.parse(root.dataset.text);
      var codeEl = root.querySelector('[data-cm-code]');
      var navEl = root.querySelector('[data-cm-nav]');
      var qEl = root.querySelector('[data-cm-q]');
      var countEl = root.querySelector('[data-cm-count]');
      var linesEl = root.querySelector('[data-cm-lines]');
      var onlyEl = root.querySelector('[data-cm-only]');
      var copyBtn = root.querySelector('[data-cm-copy]');
      var copyLabel = root.querySelector('[data-cm-copy-l]');
      var yamlBtn = root.querySelector('[data-cm-yaml]');
      var text = '';
      var lines = [];
      var sections = [];
      var vals = {};
      // The part chosen from the list or a tile stays marked while the file settles there, even when it is too near the end to reach the top.

      function fill(s, n) { return String(s).replace('{n}', n); }
      function el(tag, cls, t) { var n = document.createElement(tag); if (cls) n.className = cls; if (t != null) n.textContent = t; return n; }

      // The values of the file as "path.to.key" -> text (the file is ours: two spaces per level, one key per line).
      function parse() {
        vals = {};
        var stack = [];
        lines.forEach(function (l) {
          var m = /^( *)([A-Za-z0-9_]+):(?: +(.*))?$/.exec(l);
          if (!m) return;
          var d = m[1].length / 2;
          stack.length = d; stack[d] = m[2];
          var v = m[3];
          if (v != null && v.trim() && v.trim().charAt(0) !== '#') vals[stack.slice(0, d + 1).join('.')] = v.replace(/\\\\s+#.*$/, '').trim();
        });
      }
      function num(k) { var n = Number(vals[k]); return isFinite(n) ? n : 0; }
      function on(k) { return vals[k] === 'true'; }
      function set(k) { return vals[k] != null && vals[k] !== 'null'; }

      function tileValues() {
        var protections = ['moderation.automod.word_filter_enabled', 'moderation.automod.anti_spam_enabled', 'moderation.automod.anti_raid_enabled', 'moderation.automod.anti_alt_enabled', 'moderation.antinuke.enabled'].filter(on).length;
        var welcome = ['onboarding.welcome_channel_id', 'onboarding.leave_channel_id', 'onboarding.boost_channel_id'].filter(set).length;
        return {
          protections: protections + '/5',
          welcome: welcome + '/3',
          custom_commands: num('automation.custom_commands_count'),
          autoresponders: num('automation.autoresponders_count'),
          reaction_roles: num('automation.reaction_roles_count'),
          timers: num('automation.timers_count'),
          feeds: num('automation.feeds_count'),
          log_routes: num('logging.routed_events_count'),
          ticket_types: num('tickets.support_types_count'),
          level_rewards: num('leveling.rewards_count'),
          embed_templates: num('design.embed_templates_count'),
          image_cards: num('design.image_cards_count'),
        };
      }
      function drawTiles() {
        var v = tileValues();
        root.querySelectorAll('[data-tile]').forEach(function (tile) {
          var x = v[tile.dataset.tile];
          tile.querySelector('[data-v]').textContent = x == null ? '-' : x;
          tile.classList.toggle('zero', x === 0 || x === '0/5' || x === '0/3');
        });
      }

      // A YAML line as [class, text] pieces: key, comment, quoted text, numbers, true/false, null.
      function pieces(line) {
        var out = [];
        var m = /^( *)(- )?([A-Za-z0-9_]+)(:)(.*)$/.exec(line);
        var rest = line;
        if (/^\\\\s*#/.test(line)) return [['c', line]];
        if (m) { if (m[1]) out.push(['', m[1]]); if (m[2]) out.push(['p', m[2]]); out.push(['k', m[3]], ['p', m[4]]); rest = m[5]; }
        var re = /('(?:[^']|'')*')|("(?:[^"\\\\\\\\]|\\\\\\\\.)*")|(-?\\\\b\\\\d+(?:\\\\.\\\\d+)?\\\\b)|(\\\\btrue\\\\b|\\\\bfalse\\\\b)|(\\\\bnull\\\\b)|(#.*$)/g;
        var last = 0, t;
        while ((t = re.exec(rest))) {
          if (t.index > last) out.push(['', rest.slice(last, t.index)]);
          out.push([t[1] || t[2] ? 's' : t[3] ? 'n' : t[4] ? 'b' : t[5] ? 'z' : 'c', t[0]]);
          last = t.index + t[0].length;
        }
        if (last < rest.length) out.push(['', rest.slice(last)]);
        return out;
      }

      // ---- The viewer shows ONE part of the file at a time (Moderation, Automation...), in pieces of about 1,500 px of height at most, with the
      // ---- long lines wrapped. The box used to be the whole file: 700 lines, 1,600 px wide, 12,500 px tall, and a phone (which draws the pixels
      // ---- three times over) could not keep that in its graphics memory: the browser stopped working when a button was pressed. The chips and
      // ---- tiles change the part that is shown, and a part longer than a piece has a row at each end to go to the lines before or after.
      var ROW = 20;      // the height of a line, in pixels (also the line-height of the box)
      var GUT = 52;      // the room on the left for the number of the line
      var tokens = [];   // the pieces of each line, made when the line is first needed
      var htmlCache = [];// the markup of each line for the current search
      var lowLines = []; // the lines in lowercase (made at the first search)
      var hitList = [];  // every match of the search: { line, k } (k: which match of that line)
      var hitLine = [];  // 1 for each line that has a match
      var secOf = [];    // the part each line belongs to
      var q = '';        // the search, lowercase
      var win = null;    // the box of the lines that are shown
      var secIdx = 0, lineList = [], chunks = [], chunkIdx = 0, rowEls = [];
      var charW = 7.2, cpl = 40, budget = 1500, boxW = 0;
      var curMark = null, searchTimer = 0, flashTimer = 0, cur = -1;
      var reduceMedia = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

      var AMP = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
      function esc(str) { return str.replace(/[&<>]/g, function (c) { return AMP[c]; }); }
      function markHtml(str) {
        var low = str.toLowerCase(), at = 0, i, out = '';
        while ((i = low.indexOf(q, at)) !== -1) {
          out += esc(str.slice(at, i)) + '<mark class="cm-hit">' + esc(str.slice(i, i + q.length)) + '</mark>';
          at = i + q.length;
        }
        return out + esc(str.slice(at));
      }
      function lineHtml(i) {
        var h = htmlCache[i];
        if (h !== undefined) return h;
        var p = tokens[i] || (tokens[i] = pieces(lines[i]));
        var out = '';
        for (var k = 0; k < p.length; k++) {
          var inner = q ? markHtml(p[k][1]) : esc(p[k][1]);
          out += p[k][0] ? '<span class="y-' + p[k][0] + '">' + inner + '</span>' : inner;
        }
        return (htmlCache[i] = out || ' ');
      }
      function paintCur(row, hit) {
        var m = row.getElementsByClassName('cm-hit')[hit.k];
        if (m) { if (curMark && curMark !== m) curMark.classList.remove('cur'); m.classList.add('cur'); curMark = m; }
      }

      // How wide a letter is and how many fit on a line of the box: the pieces are cut so each is about as tall as the budget (and the box
      // never has more to carry than that).
      function measure() {
        var probe = el('span');
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;font:inherit';
        probe.textContent = '0000000000000000000000000000000000000000';
        codeEl.appendChild(probe);
        charW = probe.getBoundingClientRect().width / 40 || 7.2;
        probe.remove();
        boxW = codeEl.clientWidth;
        cpl = Math.max(12, Math.floor((boxW - GUT - 18) / charW));
        budget = Math.max(900, Math.min(1600, Math.floor(480000 / Math.max(240, boxW))));
      }
      function chunkify(list) {
        var out = [], from = 0, h = 0;
        for (var k = 0; k < list.length; k++) {
          var lh = Math.max(1, Math.ceil(lines[list[k]].length / cpl)) * ROW;
          if (h + lh > budget && k - from >= 20) { out.push([from, k]); from = k; h = 0; }
          h += lh;
        }
        out.push([from, list.length]);
        return out;
      }

      function buildBox() {
        win = el('div', 'cm-win');
        codeEl.replaceChildren(win);
        rowEls = []; curMark = null;
        measure();
        win.addEventListener('click', function (e) {
          var b = e.target.closest ? e.target.closest('[data-more]') : null;
          if (!b) return;
          var act = b.getAttribute('data-more');
          if (act === 'chunk-prev') { chunkIdx -= 1; drawChunk(true); }
          else if (act === 'chunk-next') { chunkIdx += 1; drawChunk(true); }
          else if (act === 'sec-prev') showSection(secIdx - 1, null, false, 'end');
          else if (act === 'sec-next') showSection(secIdx + 1, null, false);
        });
      }

      function moreRow(act, text) { return '<button type="button" class="cm-more" data-more="' + act + '">' + esc(text) + '</button>'; }
      // Draws the piece that is shown: its lines (as one block of markup, so the browser lays it out once), and the rows at its ends.
      function drawChunk(toTop) {
        if (!win) return;
        curMark = null;
        var c = chunks[chunkIdx] || [0, 0];
        var html = '';
        if (chunkIdx > 0) html += moreRow('chunk-prev', T.moreBefore);
        else if (secIdx > 0 && !onlyOn()) html += moreRow('sec-prev', fill2(T.partBefore, sections[secIdx - 1].label));
        for (var k = c[0]; k < c[1]; k++) { var i = lineList[k]; html += '<div class="cm-line" data-n="' + (i + 1) + '">' + lineHtml(i) + '</div>'; }
        if (c[0] === c[1]) html += '<p class="cm-none">' + esc(T.noMatches) + '</p>';
        if (chunkIdx < chunks.length - 1) html += moreRow('chunk-next', T.moreAfter);
        else if (secIdx < sections.length - 1 && !onlyOn()) html += moreRow('sec-next', fill2(T.partAfter, sections[secIdx + 1].label));
        win.innerHTML = html;
        rowEls = Array.prototype.slice.call(win.getElementsByClassName('cm-line'));
        if (cur >= 0 && hitList[cur]) { var r = rowFor(hitList[cur].line); if (r) paintCur(r, hitList[cur]); }
        if (toTop) codeEl.scrollTop = 0;
      }
      function fill2(str, name) { return String(str).replace('{name}', name); }
      function onlyOn() { return Boolean(onlyEl.checked && q); }
      function rowFor(line) {
        var n = String(line + 1);
        for (var k = 0; k < rowEls.length; k++) if (rowEls[k].getAttribute('data-n') === n) return rowEls[k];
        return null;
      }

      // Shows a part of the file (from the first line of its piece, or from the piece that holds \\\`focusLine\\\`).
      function showSection(idx, focusLine, light, where) {
        if (idx < 0 || idx >= sections.length) return;
        secIdx = idx;
        var s = sections[idx], from = idx === 0 ? 0 : s.line, to = s.end, only = onlyOn();
        lineList = [];
        for (var i = from; i < to; i++) if (!only || hitLine[i]) lineList.push(i);
        chunks = chunkify(lineList);
        chunkIdx = where === 'end' ? chunks.length - 1 : 0;
        if (focusLine != null) {
          var pos = lineList.indexOf(focusLine);
          for (var c = 0; c < chunks.length && pos >= 0; c++) if (pos >= chunks[c][0] && pos < chunks[c][1]) { chunkIdx = c; break; }
        }
        drawChunk(true);
        markChip(s);
        if (light) lightFirstLines();
      }
      // The first lines of the part light up for a moment (the class goes on after the lines are drawn, so nothing is measured in between).
      function lightFirstLines() {
        clearTimeout(flashTimer);
        rowEls.forEach(function (r) { r.classList.remove('flash'); });
        if (reduceMedia && reduceMedia.matches) return;
        var mine = rowEls.slice(0, 3);
        requestAnimationFrame(function () { mine.forEach(function (r) { r.classList.add('flash'); }); });
        flashTimer = setTimeout(function () { mine.forEach(function (r) { r.classList.remove('flash'); }); }, 1500);
      }
      function markChip(found) {
        sections.forEach(function (s) { s.btn.classList.toggle('on', s === found); });
        // The chip of the part that is shown is in view in the strip of chips (the strip scrolls sideways on a phone).
        if (found.btn.scrollIntoView && navEl.scrollWidth > navEl.clientWidth + 2) navEl.scrollTo({ left: Math.max(0, found.btn.offsetLeft - 12), behavior: 'auto' });
      }

      // The search runs on the text of the lines (never on what is on screen), a moment after the person stops typing, and over the whole file:
      // each chip says how many matches its part has, and Enter goes from one to the next, changing the part that is shown when it has to.
      function runSearch() {
        clearTimeout(searchTimer); searchTimer = 0;
        q = qEl.value.trim().toLowerCase();
        htmlCache = []; hitList = []; hitLine = []; cur = -1; curMark = null;
        var perSec = sections.map(function () { return 0; });
        if (q) {
          if (!lowLines.length) for (var z = 0; z < lines.length; z++) lowLines.push(lines[z].toLowerCase());
          for (var i = 0; i < lines.length; i++) {
            // Most lines do not hold the search at all: they are skipped before their pieces are looked at.
            if (lowLines[i].indexOf(q) === -1) continue;
            var p = tokens[i] || (tokens[i] = pieces(lines[i]));
            var found = 0;
            for (var k = 0; k < p.length; k++) {
              var low = p[k][1].toLowerCase(), at = 0, x;
              while ((x = low.indexOf(q, at)) !== -1) { hitList.push({ line: i, k: found++ }); at = x + q.length; }
            }
            if (found) { hitLine[i] = 1; perSec[secOf[i]] += found; }
          }
        }
        sections.forEach(function (s, i) {
          var n = s.btn.querySelector('.cm-nav-n');
          n.textContent = q ? String(perSec[i]) : String(s.line + 1);
          s.btn.classList.toggle('has', Boolean(q) && perSec[i] > 0);
          s.btn.classList.toggle('none', Boolean(q) && perSec[i] === 0);
        });
        countEl.textContent = q ? (hitList.length ? fill(T.matches, hitList.length) : T.noMatches) : '';
        countEl.classList.toggle('none', Boolean(q) && !hitList.length);
        // The part that is shown is drawn again (the search marks and, with "only matching lines", the lines change), at the first match.
        if (q && hitList.length) { showSection(secOf[hitList[0].line], hitList[0].line, false); step(1); }
        else showSection(secIdx, null, false);
      }
      // Enter goes to the next match, Shift+Enter to the one before.
      function step(dir) {
        if (searchTimer) runSearch();
        if (!hitList.length) return;
        cur = (cur + dir + hitList.length) % hitList.length;
        var hit = hitList[cur];
        var row = secOf[hit.line] === secIdx ? rowFor(hit.line) : null;
        if (!row) { showSection(secOf[hit.line], hit.line, false); row = rowFor(hit.line); }
        else if (curMark) { curMark.classList.remove('cur'); curMark = null; }
        if (!row) return;
        paintCur(row, hit);
        var y = row.offsetTop, box = codeEl.clientHeight;
        if (y < codeEl.scrollTop + 8 || y > codeEl.scrollTop + box - 60) codeEl.scrollTo({ top: Math.max(0, y - box / 3), behavior: 'auto' });
      }

      function buildSections() {
        sections = [];
        lines.forEach(function (l, i) {
          if (/^guild_id:/.test(l)) sections.push({ key: 'server', label: T.server, line: i });
          var m = /^([a-z_]+):\\\\s*(#.*)?$/.exec(l);
          if (m) sections.push({ key: m[1], label: T.sections[m[1]] || m[1], line: i });
        });
        sections.forEach(function (s, i) { s.end = i + 1 < sections.length ? sections[i + 1].line : lines.length; });
        secOf = new Array(lines.length);
        sections.forEach(function (s, i) { for (var k = (i === 0 ? 0 : s.line); k < s.end; k++) secOf[k] = i; });
        navEl.replaceChildren();
        sections.forEach(function (s, i) {
          var b = el('button', 'cm-nav-i');
          b.type = 'button'; b.dataset.key = s.key;
          b.append(el('span', 'cm-nav-l', s.label), el('span', 'cm-nav-n', String(s.line + 1)));
          b.addEventListener('click', function () { jump(s.key); });
          navEl.appendChild(b);
          s.btn = b;
        });
      }
      // A chip or a tile: the part is shown from its top, and its first lines light up. A search that left lines out is shown whole again.
      function jump(key) {
        var idx = -1; sections.forEach(function (x, i) { if (x.key === key) idx = i; });
        if (idx < 0) return;
        if (onlyEl.checked) { onlyEl.checked = false; }
        showSection(idx, null, true);
        // The keyboard follows the file (arrows scroll it) when there is a keyboard; on a phone nothing needs the focus and moving it costs a frame.
        if (!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches)) codeEl.focus({ preventScroll: true });
      }
      // When the box changes width (a phone turned around) the pieces are cut again, and the one that was shown stays where it was.
      if (window.ResizeObserver) new ResizeObserver(function () {
        if (!win || !lines.length || Math.abs(codeEl.clientWidth - boxW) < 24) return;
        var keep = lineList[(chunks[chunkIdx] || [0])[0]];
        measure(); showSection(secIdx, keep == null ? null : keep, false);
      }).observe(codeEl);

      qEl.addEventListener('input', function () { clearTimeout(searchTimer); searchTimer = setTimeout(runSearch, 120); });
      qEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); step(e.shiftKey ? -1 : 1); }
        else if (e.key === 'Escape' && qEl.value) { e.preventDefault(); qEl.value = ''; runSearch(); }
      });
      onlyEl.addEventListener('change', function () { runSearch(); });
      root.querySelectorAll('[data-jump]').forEach(function (b) { b.addEventListener('click', function () { if (text) jump(b.dataset.jump); }); });

      function copyText(s) {
        if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(s);
        return new Promise(function (resolve, reject) {
          var ta = el('textarea'); ta.value = s; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
          document.body.appendChild(ta); ta.select();
          var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
          ta.remove(); ok ? resolve() : reject();
        });
      }
      var copyTimer = 0;
      copyBtn.addEventListener('click', function () {
        if (!text) return;
        copyText(text).then(function () {
          copyLabel.textContent = T.copied; copyBtn.classList.add('done');
          clearTimeout(copyTimer);
          copyTimer = setTimeout(function () { copyLabel.textContent = T.copy; copyBtn.classList.remove('done'); }, 1800);
        }).catch(function () {});
      });
      yamlBtn.addEventListener('click', function () {
        if (!text) return;
        var url = URL.createObjectURL(new Blob([text], { type: 'text/yaml;charset=utf-8' }));
        var a = document.createElement('a');
        a.href = url; a.download = 'petto-' + root.dataset.guild + '-config.yaml';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      });

      function failed() {
        var box = el('div', 'cm-fail');
        var retry = el('button', 'btn btn-ghost btn-sm', T.retry); retry.type = 'button';
        retry.addEventListener('click', load);
        box.append(el('span', null, T.failed), retry);
        codeEl.replaceChildren(box);
      }
      function load() {
        var skel = el('div', 'cm-skel'); skel.setAttribute('aria-hidden', 'true');
        [62, 38, 74, 50, 30, 66, 44, 58, 36, 70, 48, 28].forEach(function (w) { var s = el('span'); s.style.width = w + '%'; skel.appendChild(s); });
        codeEl.replaceChildren(skel);
        fetch(root.dataset.src, { credentials: 'same-origin' })
          .then(function (res) { return res.ok ? res.text() : Promise.reject(); })
          .then(function (body) {
            text = body.replace(/\\\\n$/, '');
            lines = text.split('\\\\n');
            linesEl.textContent = fill(T.lines, lines.length);
            parse(); drawTiles(); buildSections(); tokens = []; htmlCache = []; lowLines = []; hitList = []; hitLine = []; cur = -1; secIdx = 0;
            buildBox(); runSearch();
            // Open past the banner, on the first setting; the banner is still there above.
            if (sections.length) { var g = rowFor(sections[0].line); if (g) codeEl.scrollTop = Math.max(0, g.offsetTop - 8); }
          })
          .catch(failed);
      }
      load();
      // The import panel asks for the file to be read again after it applies a file (no page reload).
      root.addEventListener('cm:reload', function () { load(); });
    })();
  <\/script> </div> `])), maybeRenderHead(), addAttribute(guildId, "data-guild"), addAttribute(`/dash/guild/${guildId}/general-config-preview`, "data-src"), addAttribute(JSON.stringify(texts), "data-text"), dt("Back up or reset what's on this page and Petto's look in this server."), renderComponent($$result, "Icon", $$Icon, { "name": "ph:list-dashes-fill", "width": "17", "height": "17" }), dt("What your snapshot holds"), dt("The numbers are read from the snapshot below. Press one to see where it comes from."), tiles.map((t) => renderTemplate`<button type="button"${addAttribute(`sx-tile cm-tile cm-m-${t.jump}`, "class")}${addAttribute(t.id, "data-tile")}${addAttribute(t.jump, "data-jump")}> <span class="sx-tile-label">${t.module}</span> <b data-v>-</b> <span class="cm-tile-l">${t.label}</span> </button>`), renderComponent($$result, "Icon", $$Icon, { "name": "ph:file-code-fill", "width": "17", "height": "17" }), dt("Current configuration (YAML)"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:copy-bold", "width": "14", "height": "14" }), dt("Copy"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:download-simple-bold", "width": "14", "height": "14" }), dt("Download YAML"), dt("Read-only, a snapshot of what's saved. Change it from its own page of the dashboard, not by editing this."), renderComponent($$result, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "14", "height": "14" }), addAttribute(dt("Search the snapshot"), "placeholder"), addAttribute(dt("Search the snapshot"), "aria-label"), dt("Only matching lines"), addAttribute(dt("Jump to a part of the file"), "aria-label"), addAttribute(dt("Current configuration (YAML)"), "aria-label"), [62, 38, 74, 50, 30, 66, 44, 58, 36, 70, 48, 28].map((w) => renderTemplate`<span${addAttribute(`width:${w}%`, "style")}></span>`), renderComponent($$result, "Icon", $$Icon, { "name": "ph:download-simple-bold", "width": "17", "height": "17" }), dt("Download"), dt("A JSON file with the settings of these modules, row by row. Keep it as a copy or to compare two servers. Petto cannot import this one back: to bring settings back, import the YAML file."), addAttribute(`/dash/guild/${guildId}/general-export`, "href"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:download-simple-bold", "width": "14", "height": "14" }), dt("Download config"), guildId, renderComponent($$result, "Icon", $$Icon, { "name": "ph:archive-fill", "width": "15", "height": "15" }), dt("To bring back the server itself (roles, channels, emojis), use"), addAttribute(`/dash/guild/${guildId}/backups`, "href"), dt("Backups"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "17", "height": "17" }), dt("Danger zone"), dt("Reset config puts these back to their defaults:"), dt("The command prefix goes back to !."), dt("The mute role is cleared, so Petto uses Discord's native timeout."), dt("The bot's nickname, picture, banner and about me in this server (on Discord too)."), dt("Nothing else changes: AutoMod, levels, automation and the other modules, and the members' data, stay as they are. This can't be undone."), addAttribute(dt("Resetting the configuration\u2026|Putting the defaults back\u2026|Almost done\u2026"), "data-progress"), addAttribute(dt("Resetting the configuration"), "data-progress-title"), addAttribute(dt("Reset the prefix, mute role, and the bot's nickname/avatar/banner/description in this server back to default? This can't be undone."), "data-confirm"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:arrow-counter-clockwise-bold", "width": "14", "height": "14" }), dt("Reset config"), renderComponent($$result, "DashConfigImport", $$DashConfigImport, { "guildId": guildId }), renderComponent($$result, "Icon", $$Icon, { "name": "ph:info-fill", "width": "17", "height": "17" }), dt("What is in a snapshot"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "17", "height": "17", "class": "cm-fold-ico" }), dt("Included"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14" }), dt("The prefix, the mute role and the bot's look (nickname, picture, banner, about me)."), dt("The settings of AutoMod, anti-nuke, levels, giveaways, reports, booster roles, welcome, leave and boost messages, verification, bump reminders and ping on join."), dt("How many custom commands, autoresponders, sticky messages, reaction roles, timers, feeds, counters, log channels, ticket categories, level rewards, saved embeds and image cards the server has. The JSON file has each one, row by row."), renderComponent($$result, "Icon", $$Icon, { "name": "ph:x-circle-fill", "width": "17", "height": "17", "class": "cm-fold-ico" }), dt("Not included"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14" }), dt("Members' data: XP and levels, warnings, cases, notes and tickets."), dt("Messages, and the pictures and files you uploaded."), dt("Tokens, keys and passwords."), dt("Premium, billing and dashboard access."), dt("The settings of pages not listed above, such as suggestions, forms, birthdays and permissions."));
}, "/home/runner/work/petto-web/petto-web/src/components/DashConfigManagement.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashGeneral = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashGeneral;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const dth = makeT(dashLang, true);
  const { user, guildId, guildName, guildIcon, prefix, prefixes = [prefix], prefixError = "", muteRoleId, globalStatsVisible = true, language = "en", roles, saved, reset, section } = Astro2.props;
  const sectionMeta = { settings: dt("Server settings"), management: dt("Configuration management") };
  const selectedSection = sectionMeta[section ?? ""] ? section ?? "" : "settings";
  const selectedTitle = sectionMeta[selectedSection];
  const languages = [
    { value: "en", label: "English", short: "English" },
    { value: "es", label: "Espa\xF1ol", short: "Espa\xF1ol" },
    { value: "pt-BR", label: "Portugu\xEAs (Brasil)", short: "Portugu\xEAs" }
  ];
  const currentLanguage = languages.find((item) => item.value === language) ?? languages[0];
  const spaced = /^[a-z0-9]/i.test(prefix);
  const examples = ["ban", "mute", "language"].map((command) => `${prefix}${spaced ? " " : ""}${command}`);
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": selectedSection === "settings" ? "setup" : "general-management", "pageTitle": selectedTitle, "data-astro-cid-7ttpmiod": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["", " ", " ", '<div class="sx-page gn-page" data-astro-cid-7ttpmiod> <h1 data-astro-cid-7ttpmiod>', "</h1> ", " ", " ", " ", " </div> ", " <script>\n    // The Manage prefixes window: bound once to the document, so it keeps working after the page content is swapped.\n    if (!window.__pfBound) {\n      window.__pfBound = true;\n      var pfScope = function (el) { return el && el.closest ? el.closest('[data-pf-form]') : null; };\n      var pfList = function (form) {\n        return Array.prototype.map.call(form.querySelectorAll('[data-pf-chips] .pf-chip'), function (c) { return c.getAttribute('data-p'); });\n      };\n      var pfError = function (form, text) {\n        var box = form.querySelector('[data-pf-error]');\n        if (!box) return;\n        box.textContent = text || '';\n        box.hidden = !text;\n      };\n      var pfRender = function (form, list) {\n        var holder = form.querySelector('[data-pf-chips]');\n        holder.textContent = '';\n        list.forEach(function (p, i) {\n          var chip = document.createElement('span');\n          chip.className = 'pf-chip' + (i === 0 ? ' main' : '');\n          chip.setAttribute('data-p', p);\n          if (i === 0) chip.title = form.getAttribute('data-l-main') || '';\n          var code = document.createElement('code');\n          code.textContent = p;\n          var x = document.createElement('button');\n          x.type = 'button';\n          x.className = 'pf-x';\n          x.setAttribute('data-pf-remove', '');\n          x.setAttribute('aria-label', (form.getAttribute('data-l-remove') || 'Remove {p}').replace('{p}', p));\n          x.textContent = '\\u00d7';\n          chip.appendChild(code);\n          chip.appendChild(x);\n          holder.appendChild(chip);\n        });\n        form.querySelector('[data-pf-value]').value = JSON.stringify(list);\n      };\n      var pfAdd = function (form) {\n        var input = form.querySelector('[data-pf-input]');\n        var value = (input.value || '').trim();\n        var list = pfList(form);\n        var max = Number(form.getAttribute('data-max')) || 10;\n        var len = Number(form.getAttribute('data-len')) || 12;\n        var problem = '';\n        if (!value) problem = form.getAttribute('data-e-empty');\n        else if (value.length > len) problem = form.getAttribute('data-e-long');\n        else if (/\\s/.test(value)) problem = form.getAttribute('data-e-space');\n        else if (value.indexOf('@') !== -1 || value.indexOf('`') !== -1) problem = form.getAttribute('data-e-chars');\n        else if (list.some(function (p) { return p.toLowerCase() === value.toLowerCase(); })) problem = (form.getAttribute('data-e-dup') || '').replace('{p}', value);\n        else if (list.length >= max) problem = form.getAttribute('data-e-max');\n        pfError(form, problem);\n        if (problem) { input.focus(); return; }\n        list.push(value);\n        pfRender(form, list);\n        input.value = '';\n        input.focus();\n      };\n      document.addEventListener('click', function (event) {\n        var t = event.target;\n        if (!t || !t.closest) return;\n        var opener = t.closest('[data-pf-open]');\n        if (opener) {\n          // Opening again starts from what is saved: a window closed with Cancel leaves nothing behind.\n          document.querySelectorAll('[data-pf-form]').forEach(function (form) {\n            try { pfRender(form, JSON.parse(form.getAttribute('data-saved') || '[]')); } catch (e) {}\n            pfError(form, '');\n            var input = form.querySelector('[data-pf-input]');\n            if (input) input.value = '';\n          });\n          return;\n        }\n        var add = t.closest('[data-pf-add]');\n        if (add) { var f = pfScope(add); if (f) pfAdd(f); return; }\n        var rm = t.closest('[data-pf-remove]');\n        if (rm) {\n          var form = pfScope(rm);\n          if (!form) return;\n          var chip = rm.closest('.pf-chip');\n          var list = pfList(form).filter(function (p) { return p !== chip.getAttribute('data-p'); });\n          pfError(form, '');\n          pfRender(form, list);\n        }\n      });\n      document.addEventListener('keydown', function (event) {\n        var t = event.target;\n        if (event.key !== 'Enter' || !t || !t.hasAttribute || !t.hasAttribute('data-pf-input')) return;\n        event.preventDefault();\n        var form = pfScope(t);\n        if (form) pfAdd(form);\n      });\n      // Capture phase, before the dashboard's own saving: a list that is not valid is never sent.\n      document.addEventListener('submit', function (event) {\n        var form = event.target;\n        if (!form || !form.hasAttribute || !form.hasAttribute('data-pf-form')) return;\n        var list = pfList(form);\n        var max = Number(form.getAttribute('data-max')) || 10;\n        var problem = !list.length ? form.getAttribute('data-e-none') : list.length > max ? form.getAttribute('data-e-max') : '';\n        if (problem) {\n          event.preventDefault();\n          event.stopImmediatePropagation();\n          pfError(form, problem);\n          return;\n        }\n        form.querySelector('[data-pf-value]').value = JSON.stringify(list);\n        // The window closes now; the page shows the answer when the save is done.\n        var win = form.closest('.mdl');\n        if (win) { win.hidden = true; document.body.classList.remove('mdl-lock'); }\n      }, true);\n    }\n  <\/script> "], ["", " ", " ", '<div class="sx-page gn-page" data-astro-cid-7ttpmiod> <h1 data-astro-cid-7ttpmiod>', "</h1> ", " ", " ", " ", " </div> ", " <script>\n    // The Manage prefixes window: bound once to the document, so it keeps working after the page content is swapped.\n    if (!window.__pfBound) {\n      window.__pfBound = true;\n      var pfScope = function (el) { return el && el.closest ? el.closest('[data-pf-form]') : null; };\n      var pfList = function (form) {\n        return Array.prototype.map.call(form.querySelectorAll('[data-pf-chips] .pf-chip'), function (c) { return c.getAttribute('data-p'); });\n      };\n      var pfError = function (form, text) {\n        var box = form.querySelector('[data-pf-error]');\n        if (!box) return;\n        box.textContent = text || '';\n        box.hidden = !text;\n      };\n      var pfRender = function (form, list) {\n        var holder = form.querySelector('[data-pf-chips]');\n        holder.textContent = '';\n        list.forEach(function (p, i) {\n          var chip = document.createElement('span');\n          chip.className = 'pf-chip' + (i === 0 ? ' main' : '');\n          chip.setAttribute('data-p', p);\n          if (i === 0) chip.title = form.getAttribute('data-l-main') || '';\n          var code = document.createElement('code');\n          code.textContent = p;\n          var x = document.createElement('button');\n          x.type = 'button';\n          x.className = 'pf-x';\n          x.setAttribute('data-pf-remove', '');\n          x.setAttribute('aria-label', (form.getAttribute('data-l-remove') || 'Remove {p}').replace('{p}', p));\n          x.textContent = '\\\\u00d7';\n          chip.appendChild(code);\n          chip.appendChild(x);\n          holder.appendChild(chip);\n        });\n        form.querySelector('[data-pf-value]').value = JSON.stringify(list);\n      };\n      var pfAdd = function (form) {\n        var input = form.querySelector('[data-pf-input]');\n        var value = (input.value || '').trim();\n        var list = pfList(form);\n        var max = Number(form.getAttribute('data-max')) || 10;\n        var len = Number(form.getAttribute('data-len')) || 12;\n        var problem = '';\n        if (!value) problem = form.getAttribute('data-e-empty');\n        else if (value.length > len) problem = form.getAttribute('data-e-long');\n        else if (/\\\\s/.test(value)) problem = form.getAttribute('data-e-space');\n        else if (value.indexOf('@') !== -1 || value.indexOf('\\`') !== -1) problem = form.getAttribute('data-e-chars');\n        else if (list.some(function (p) { return p.toLowerCase() === value.toLowerCase(); })) problem = (form.getAttribute('data-e-dup') || '').replace('{p}', value);\n        else if (list.length >= max) problem = form.getAttribute('data-e-max');\n        pfError(form, problem);\n        if (problem) { input.focus(); return; }\n        list.push(value);\n        pfRender(form, list);\n        input.value = '';\n        input.focus();\n      };\n      document.addEventListener('click', function (event) {\n        var t = event.target;\n        if (!t || !t.closest) return;\n        var opener = t.closest('[data-pf-open]');\n        if (opener) {\n          // Opening again starts from what is saved: a window closed with Cancel leaves nothing behind.\n          document.querySelectorAll('[data-pf-form]').forEach(function (form) {\n            try { pfRender(form, JSON.parse(form.getAttribute('data-saved') || '[]')); } catch (e) {}\n            pfError(form, '');\n            var input = form.querySelector('[data-pf-input]');\n            if (input) input.value = '';\n          });\n          return;\n        }\n        var add = t.closest('[data-pf-add]');\n        if (add) { var f = pfScope(add); if (f) pfAdd(f); return; }\n        var rm = t.closest('[data-pf-remove]');\n        if (rm) {\n          var form = pfScope(rm);\n          if (!form) return;\n          var chip = rm.closest('.pf-chip');\n          var list = pfList(form).filter(function (p) { return p !== chip.getAttribute('data-p'); });\n          pfError(form, '');\n          pfRender(form, list);\n        }\n      });\n      document.addEventListener('keydown', function (event) {\n        var t = event.target;\n        if (event.key !== 'Enter' || !t || !t.hasAttribute || !t.hasAttribute('data-pf-input')) return;\n        event.preventDefault();\n        var form = pfScope(t);\n        if (form) pfAdd(form);\n      });\n      // Capture phase, before the dashboard's own saving: a list that is not valid is never sent.\n      document.addEventListener('submit', function (event) {\n        var form = event.target;\n        if (!form || !form.hasAttribute || !form.hasAttribute('data-pf-form')) return;\n        var list = pfList(form);\n        var max = Number(form.getAttribute('data-max')) || 10;\n        var problem = !list.length ? form.getAttribute('data-e-none') : list.length > max ? form.getAttribute('data-e-max') : '';\n        if (problem) {\n          event.preventDefault();\n          event.stopImmediatePropagation();\n          pfError(form, problem);\n          return;\n        }\n        form.querySelector('[data-pf-value]').value = JSON.stringify(list);\n        // The window closes now; the page shows the answer when the save is done.\n        var win = form.closest('.mdl');\n        if (win) { win.hidden = true; document.body.classList.remove('mdl-lock'); }\n      }, true);\n    }\n  <\/script> "])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-7ttpmiod": true }), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-7ttpmiod": true }), maybeRenderHead(), selectedTitle, saved && renderTemplate`<div class="sx-flash" data-astro-cid-7ttpmiod> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-7ttpmiod": true })} ${dt("Saved. Petto picks this up right away, no restart needed.")} </div>`, prefixError && renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-7ttpmiod> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-7ttpmiod": true })} ${prefixError} </div>`, reset && renderTemplate`<div class="sx-flash" data-astro-cid-7ttpmiod> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-7ttpmiod": true })} ${dt("Reset. Prefix, mute role, and the bot's look in this server are back to default.")} </div>`, selectedSection === "management" ? renderTemplate`${renderComponent($$result2, "DashConfigManagement", $$DashConfigManagement, { "guildId": guildId, "data-astro-cid-7ttpmiod": true })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Prefixes"), value: prefixes.length, tone: "messages" },
    { label: dt("Language"), value: 0, text: currentLanguage.short, tone: "voice" },
    { label: dt("Mute with"), value: 0, text: muteRoleId ? dt("A role") : dt("Timeout"), tone: "reactions" },
    { label: dt("Public ranking"), value: 0, text: globalStatsVisible ? dt("Visible") : dt("Hidden"), tone: "joins" }
  ], "data-astro-cid-7ttpmiod": true })} <form method="POST" class="sx-stack gn-form" data-astro-cid-7ttpmiod> <input type="hidden" name="action" value="save" data-astro-cid-7ttpmiod> <section class="sx-panel gn-panel" data-astro-cid-7ttpmiod> <div class="sx-panel-head" data-astro-cid-7ttpmiod> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-7ttpmiod>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "17", "height": "17", "data-astro-cid-7ttpmiod": true })}</span> <h2 data-astro-cid-7ttpmiod>${dt("Command Prefixes")}</h2> </div> <p class="sx-lead" data-astro-cid-7ttpmiod>${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate`${unescapeHTML(dth("Used for text commands, e.g. <code>{a}ban</code>. Slash commands work no matter what this is set to.", { a: prefix }))}` })}</p> <div class="gn-prefix-grid" data-astro-cid-7ttpmiod> <div class="gn-prefix-list" data-astro-cid-7ttpmiod> <span class="sx-label" data-astro-cid-7ttpmiod>${dt("Petto answers to")}</span> <div class="gn-prefix-row" data-astro-cid-7ttpmiod> <div class="pf-view" data-astro-cid-7ttpmiod> ${prefixes.map((p, i) => renderTemplate`<code${addAttribute(["pf-view-chip", { main: i === 0 }], "class:list")}${addAttribute(i === 0 ? dt("Main prefix") : void 0, "title")} data-astro-cid-7ttpmiod>${p}</code>`)} </div> <button type="button" class="btn btn-ghost btn-sm gn-manage" data-modal-open="pf-modal" data-pf-open data-astro-cid-7ttpmiod>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "13", "height": "13", "data-astro-cid-7ttpmiod": true })} ${dt("Manage prefixes")}</button> </div> <span class="sx-hint" data-astro-cid-7ttpmiod>${dt("The first one is the main one, the one shown in its messages.")}</span> </div> <div class="gn-try" data-astro-cid-7ttpmiod> <span class="sx-label" data-astro-cid-7ttpmiod>${dt("Try it in a channel")}</span> <div class="gn-try-list" data-astro-cid-7ttpmiod> ${examples.map((example) => renderTemplate`<code data-astro-cid-7ttpmiod>${example}</code>`)} </div> </div> </div> </section> <div class="gn-duo" data-astro-cid-7ttpmiod> <section class="sx-panel gn-panel" data-astro-cid-7ttpmiod> <div class="sx-panel-head" data-astro-cid-7ttpmiod> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-7ttpmiod>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:translate-fill", "width": "17", "height": "17", "data-astro-cid-7ttpmiod": true })}</span> <h2 id="gn-lang-h" data-astro-cid-7ttpmiod>${dt("Server language")}</h2> </div> <p class="sx-lead" data-astro-cid-7ttpmiod>${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate`${unescapeHTML(dth(`The language of Petto's messages in this server. Members can also use <code>{a}language</code>. Help us translate: <a href="/apply?role=translator">apply as a translator</a>.`, { a: prefix }))}` })}</p> <div class="dfx-chips" role="radiogroup" aria-labelledby="gn-lang-h" data-astro-cid-7ttpmiod> ${languages.map((item) => renderTemplate`<label class="dfx-chip" data-astro-cid-7ttpmiod><input type="radio" name="language"${addAttribute(item.value, "value")}${addAttribute(language === item.value, "checked")} data-astro-cid-7ttpmiod>${item.label}</label>`)} </div> </section> <section class="sx-panel gn-panel" data-astro-cid-7ttpmiod> <div class="sx-panel-head" data-astro-cid-7ttpmiod> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-7ttpmiod>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:speaker-slash-fill", "width": "17", "height": "17", "data-astro-cid-7ttpmiod": true })}</span> <h2 id="gn-mute-h" data-astro-cid-7ttpmiod>${dt("Mute role")}</h2> </div> <p class="sx-lead" data-astro-cid-7ttpmiod>${renderComponent($$result3, "Fragment", Fragment, {}, { "default": ($$result4) => renderTemplate`${unescapeHTML(dth("The role <code>{p}mute</code> applies when set. Leave unset to use Discord's built-in timeout instead.", { p: prefix }))}` })}</p> <div class="sx-field" data-astro-cid-7ttpmiod> <select id="mute_role_id" name="mute_role_id" data-give-role aria-labelledby="gn-mute-h" data-astro-cid-7ttpmiod> <option value="" data-astro-cid-7ttpmiod>${dt("None, use Discord's native timeout")}</option> ${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.id === muteRoleId, "selected")} data-astro-cid-7ttpmiod>${r.name}</option>`)} </select> </div> </section> </div> <section class="sx-panel gn-panel" data-astro-cid-7ttpmiod> <div class="sx-panel-head" data-astro-cid-7ttpmiod> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-7ttpmiod>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:trophy-fill", "width": "17", "height": "17", "data-astro-cid-7ttpmiod": true })}</span> <h2 data-astro-cid-7ttpmiod>${dt("Public ranking")}</h2> </div> <label class="sx-switch" data-astro-cid-7ttpmiod> <input id="global_stats_visible" type="checkbox" name="global_stats_visible"${addAttribute(globalStatsVisible, "checked")} data-astro-cid-7ttpmiod> <span class="sx-switch-text" data-astro-cid-7ttpmiod><b data-astro-cid-7ttpmiod>${dt("Show this server in the public ranking")}</b><em data-astro-cid-7ttpmiod>${dt("Turned off, this server is only counted in the global totals, without its name, and it is not in the carousel of the home page.")}</em></span> <i class="sx-toggle" data-astro-cid-7ttpmiod></i> </label> </section> <div class="sx-foot gn-foot" data-astro-cid-7ttpmiod><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-7ttpmiod>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-7ttpmiod": true })}${dt("Save changes")}</button></div> </form> <section class="gn-more" aria-labelledby="gn-more-h" data-astro-cid-7ttpmiod> <div class="dfx-sec-head" data-astro-cid-7ttpmiod><h2 id="gn-more-h" data-astro-cid-7ttpmiod>${dt("More settings of the server")}</h2><p data-astro-cid-7ttpmiod>${dt("Petto's look, a copy of these settings and the backups of the server.")}</p></div> <div class="gn-links" data-astro-cid-7ttpmiod> <a class="gn-link"${addAttribute(`/dash/guild/${guildId}/customize`, "href")} data-astro-cid-7ttpmiod> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-7ttpmiod>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:paint-brush-broad-fill", "width": "17", "height": "17", "data-astro-cid-7ttpmiod": true })}</span> <span class="gn-link-text" data-astro-cid-7ttpmiod><b data-astro-cid-7ttpmiod>${dt("Customize")}</b><em data-astro-cid-7ttpmiod>${dt("Petto's nickname, picture and banner in this server.")}</em></span> </a> <a class="gn-link"${addAttribute(`/dash/guild/${guildId}/general?section=management`, "href")} data-astro-cid-7ttpmiod> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-7ttpmiod>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:file-code-fill", "width": "17", "height": "17", "data-astro-cid-7ttpmiod": true })}</span> <span class="gn-link-text" data-astro-cid-7ttpmiod><b data-astro-cid-7ttpmiod>${dt("Configuration management")}</b><em data-astro-cid-7ttpmiod>${dt("Download a copy of these settings, or reset them.")}</em></span> </a> <a class="gn-link"${addAttribute(`/dash/guild/${guildId}/backups`, "href")} data-astro-cid-7ttpmiod> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-7ttpmiod>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:archive-fill", "width": "17", "height": "17", "data-astro-cid-7ttpmiod": true })}</span> <span class="gn-link-text" data-astro-cid-7ttpmiod><b data-astro-cid-7ttpmiod>${dt("Backups")}</b><em data-astro-cid-7ttpmiod>${dt("Bring back the roles, channels and emojis of the server.")}</em></span> </a> </div> </section> ` })}`, renderComponent($$result2, "Modal", $$Modal, { "id": "pf-modal", "title": dt("Manage Command Prefixes"), "icon": "ph:terminal-window-fill", "data-astro-cid-7ttpmiod": true }, { "default": ($$result3) => renderTemplate` <form method="POST" class="pf-form" data-no-dirty data-pf-form${addAttribute(JSON.stringify(prefixes), "data-saved")}${addAttribute(MAX_PREFIXES, "data-max")}${addAttribute(MAX_PREFIX_LENGTH, "data-len")}${addAttribute(dt("Write a prefix first."), "data-e-empty")}${addAttribute(dt("A prefix has at most {n} characters.", { n: MAX_PREFIX_LENGTH }), "data-e-long")}${addAttribute(dt("A prefix cannot have spaces."), "data-e-space")}${addAttribute(dt("A prefix cannot have @ or backticks."), "data-e-chars")}${addAttribute(dt("{p} is already in the list."), "data-e-dup")}${addAttribute(dt("A server can have up to {n} prefixes.", { n: MAX_PREFIXES }), "data-e-max")}${addAttribute(dt("Keep at least one prefix."), "data-e-none")}${addAttribute(dt("Remove {p}"), "data-l-remove")}${addAttribute(dt("Main prefix"), "data-l-main")} data-astro-cid-7ttpmiod> <input type="hidden" name="action" value="prefixes" data-astro-cid-7ttpmiod> <input type="hidden" name="prefixes"${addAttribute(JSON.stringify(prefixes), "value")} data-pf-value data-astro-cid-7ttpmiod> <p class="pf-lede" data-astro-cid-7ttpmiod>${dt("Petto answers to every prefix in this list. The first one is the main one, the one shown in its messages.")}</p> <div class="pf-add" data-astro-cid-7ttpmiod> <input type="text" class="pf-input" data-pf-input maxlength="40" autocomplete="off" autocapitalize="off" spellcheck="false"${addAttribute(dt("Add a prefix"), "placeholder")}${addAttribute(dt("Add a prefix"), "aria-label")} data-astro-cid-7ttpmiod> <button type="button" class="btn btn-accent btn-sm pf-plus" data-pf-add${addAttribute(dt("Add prefix"), "aria-label")}${addAttribute(dt("Add prefix"), "title")} data-astro-cid-7ttpmiod>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "16", "height": "16", "data-astro-cid-7ttpmiod": true })}</button> </div> <p class="pf-error" role="alert" data-pf-error hidden data-astro-cid-7ttpmiod></p> <div class="pf-chips" data-pf-chips aria-live="polite" data-astro-cid-7ttpmiod> ${prefixes.map((p, i) => renderTemplate`<span${addAttribute(["pf-chip", { main: i === 0 }], "class:list")}${addAttribute(p, "data-p")} data-astro-cid-7ttpmiod><code data-astro-cid-7ttpmiod>${p}</code><button type="button" class="pf-x" data-pf-remove${addAttribute(dt("Remove {p}", { p }), "aria-label")} data-astro-cid-7ttpmiod>×</button></span>`)} </div> <p class="pf-hint" data-astro-cid-7ttpmiod>${dt("A symbol is typed attached to the command (!help). A word like petto is not case sensitive and needs a space (petto help). Up to {n} prefixes of {m} characters, no spaces, no @ or backticks.", { n: MAX_PREFIXES, m: MAX_PREFIX_LENGTH })}</p> <footer data-astro-cid-7ttpmiod><button type="button" class="btn btn-ghost btn-sm" data-modal-close data-astro-cid-7ttpmiod>${dt("Cancel")}</button><button type="submit" class="btn btn-accent btn-sm" data-keep data-astro-cid-7ttpmiod>${dt("Save")}</button></footer> </form> ` })) })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashGeneral.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$General = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$General;
  const { id } = Astro2.params;
  const section = Astro2.url.searchParams.get("section") ?? "settings";
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
  let reset = false;
  let prefixError = "";
  const dt = makeT(getDashLang(Astro2));
  async function syncPrefix(prefixes2) {
    try {
      const result = await syncPettoPrefix(Astro2, id, prefixes2);
      if (!result.ok) console.warn(`Could not sync prefix with Petto bot for guild ${id}: ${result.error ?? "unknown_error"}`);
    } catch (err) {
      console.warn(`Could not sync prefix with Petto bot for guild ${id}:`, err);
    }
  }
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "save");
    if (action === "reset") {
      await fetch(`${apiUrl}/rest/v1/guilds?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          prefix: DEFAULT_PREFIXES[0],
          mute_role_id: null,
          bot_nickname: null,
          bot_avatar_url: null,
          bot_banner_url: null,
          bot_description: null,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      await fetch(`${apiUrl}/rest/v1/guilds?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ guild_id: id, prefixes: DEFAULT_PREFIXES })
      }).catch(() => {
      });
      await syncPrefix(DEFAULT_PREFIXES);
      if (botToken) {
        await fetch(`https://discord.com/api/guilds/${id}/members/@me`, {
          method: "PATCH",
          headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({ nick: null, avatar: null, banner: null, bio: null })
        }).catch(() => {
        });
        noteGuildWrite(id);
      }
      reset = true;
    } else if (action === "prefixes") {
      let raw = null;
      try {
        raw = JSON.parse(String(form.get("prefixes") ?? "[]"));
      } catch {
      }
      const checked = checkPrefixList(raw);
      if (checked.problem) {
        prefixError = dt(checked.problem.key, checked.problem.vars);
      } else {
        const list = checked.prefixes;
        const res = await fetch(`${apiUrl}/rest/v1/guilds?on_conflict=guild_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, prefix: list[0], prefixes: list, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
        }).catch(() => null);
        await syncPrefix(list);
        if (res && res.ok) saved = true;
        else prefixError = dt("Could not save the prefixes, try again.");
      }
    } else {
      const muteRoleId = String(form.get("mute_role_id") ?? "").trim() || null;
      await fetch(`${apiUrl}/rest/v1/guilds?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ guild_id: id, mute_role_id: muteRoleId, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
      });
      await fetch(`${apiUrl}/rest/v1/guilds?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ guild_id: id, global_stats_hidden: form.get("global_stats_visible") !== "on" })
      }).catch(() => {
      });
      const language2 = String(form.get("language") ?? "");
      if (["en", "es", "pt-BR"].includes(language2)) {
        await fetch(`${apiUrl}/rest/v1/guilds?on_conflict=guild_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, language: language2 })
        }).catch(() => {
        });
        await syncPettoLanguage(Astro2, id, language2).catch(() => {
        });
      }
      saved = true;
    }
  }
  const optional = (column) => fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${id}&select=${column}`, { headers: apiHeaders }).then(async (res) => res.ok ? (await res.json())?.[0] : void 0).catch(() => void 0);
  const [guildInfo, rolesRes, guildsRes, visibleRow, languageRow, prefixesRow] = await Promise.all([
    getGuildInfo(id, botToken),
    getGuildList(Astro2, id, botToken, "roles"),
    fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${id}&select=prefix,mute_role_id`, { headers: apiHeaders }),
    optional("global_stats_hidden"),
    optional("language"),
    optional("prefixes")
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const globalStatsVisible = visibleRow?.global_stats_hidden !== true;
  const languageValue = languageRow?.language;
  const language = languageValue === "es" || languageValue === "pt-BR" ? languageValue : "en";
  const allRoles = rolesRes.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((r) => r.name !== "@everyone").sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const guildsRows = guildsRes.ok ? await guildsRes.json() : [];
  const g = guildsRows[0] ?? {};
  const prefixes = prefixesFromRows(prefixesRow?.prefixes, g.prefix);
  const config = { prefix: prefixes[0], mute_role_id: g.mute_role_id ?? null };
  return renderTemplate`${renderComponent($$result, "DashGeneral", $$DashGeneral, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "prefix": config.prefix, "prefixes": prefixes, "prefixError": prefixError, "muteRoleId": config.mute_role_id, "globalStatsVisible": globalStatsVisible, "language": language, "roles": roles, "saved": saved, "reset": reset, "section": section })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/general.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/general.astro";
const $$url = "/dash/guild/[id]/general";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$General,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
