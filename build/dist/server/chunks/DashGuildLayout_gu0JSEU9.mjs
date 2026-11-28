import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, e as defineScriptVars, u as unescapeHTML, d as renderComponent, g as renderHead, f as renderSlot, F as Fragment } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { i as isStillNew, $ as $$Base, b as $$InlineIcon, a as $$DashClientI18N, c as $$DashMotion, d as $$DashToast, e as $$DashConfirm, f as $$DashLoading, g as $$DashSelectMenu } from './Base_Di2YHjFe.mjs';
import { c as buildLabel, a as buildTitle } from './buildInfo_Bw1TupFW.mjs';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import 'clsx';
import { u as userCardData, h as loadDashLayoutData, p as pageDecision, i as pageOf, j as guildHeaderArt, s as supportPolicyFor, k as supportPageOf, m as supportLabels } from './dashAuth_uqFK7-ED.mjs';
/* empty css                          */
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
import { g as getAllCommands } from './commandList_CyjlbWar.mjs';
import { e as $$DashServerSheet, d as $$DashTopBar, c as $$DashUserCard, b as $$DashSideHead, $ as $$DashServerRail } from './DashUserCard_BiWYM-Hw.mjs';
import { u as useTranslations } from './ui_C1MR3LHJ.mjs';
import { j as getGuildInfo, e as getGuildList, c as canManageGuild, d as guildIconUrl } from './discord_CxeBz2tv.mjs';
import { g as getEnv } from './env_WnBvzCjc.mjs';
import { s as splitServers, b as botInviteUrl } from './dashSwitcher_BIhzOPcN.mjs';
import { i as isPettoOwner } from './premiumAdmin_C4HUbWtx.mjs';
import { c as canUseFeeds } from './feedsAccess_J9XGccQ9.mjs';
import { F as FEED_PLATFORMS } from './feeds_CoTT4ZQR.mjs';
import { c as canUseCodeCommands } from './codeAccess_BCmrm43i.mjs';
import { b as backupsUnderMaintenance } from './maintenance_ZyU-NXSZ.mjs';

const $$Astro$5 = createAstro("https://petto.sbs");
const $$DashPreviews = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$DashPreviews;
  const { user, guildName, guildIcon } = Astro2.props;
  const look = userCardData(user);
  return renderTemplate`${maybeRenderHead()}<span hidden data-dp-me${addAttribute(user.username, "data-name")}${addAttribute(user.avatar ?? "/assets/mascot-icon.webp", "data-avatar")}${addAttribute(look.decoration?.still?.replace("size=96", "size=256") ?? "", "data-decoration")}${addAttribute(look.nameplate?.still ?? "", "data-nameplate")}${addAttribute(guildName, "data-server")}${addAttribute(guildIcon, "data-server-icon")}></span>  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashPreviews.astro", void 0);

var __freeze$5 = Object.freeze;
var __defProp$5 = Object.defineProperty;
var __template$5 = (cooked, raw) => __freeze$5(__defProp$5(cooked, "raw", { value: __freeze$5(raw || cooked.slice()) }));
var _a$5;
const $$DashKeepPlace = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$5 || (_a$5 = __template$5([`<script>
  (function () {
    if (window.__dglKeepPlace) return;
    window.__dglKeepPlace = true;
    var PREFIX = 'petto-place:';
    var MAX_AGE_MS = 6 * 60 * 60 * 1000;
    var kind = 'navigate';
    try { var entry = performance.getEntriesByType('navigation')[0]; if (entry && entry.type) kind = entry.type; } catch (e) { /* unknown */ }
    var address = function () { return PREFIX + location.pathname + location.search; };
    var read = function () { try { return JSON.parse(sessionStorage.getItem(address()) || 'null') || { y: 0, f: {}, t: 0 }; } catch (e) { return { y: 0, f: {}, t: 0 }; } };
    var write = function (state) { try { state.t = Date.now(); sessionStorage.setItem(address(), JSON.stringify(state)); } catch (e) { /* storage full or blocked */ } };
    // A field is told apart by its form, its name and its place among the fields with that name.
    var keyOf = function (el) {
      if (!el || !el.name || el.disabled) return null;
      var type = String(el.type || '').toLowerCase();
      if (type === 'password' || type === 'file' || type === 'hidden' || type === 'submit' || type === 'button') return null;
      if (el.closest('[data-no-draft]')) return null;
      var scope = el.form || document;
      var same = scope.querySelectorAll('[name="' + String(el.name).replace(/"/g, '\\\\"') + '"]');
      var index = Array.prototype.indexOf.call(same, el);
      var form = el.form ? (el.form.getAttribute('action') || '') + '#' + (el.form.id || '') : '';
      return form + '|' + el.name + '|' + index;
    };
    var valueOf = function (el) { return el.type === 'checkbox' || el.type === 'radio' ? el.checked : el.value; };
    var defaultOf = function (el) { return el.type === 'checkbox' || el.type === 'radio' ? el.defaultChecked : (el.tagName === 'SELECT' ? (Array.prototype.filter.call(el.options, function (o) { return o.defaultSelected; })[0] || el.options[0] || { value: '' }).value : el.defaultValue); };

    var scrollTimer = 0;
    // On a wide screen the page scrolls inside its panel (#dgl-content), on a phone the window does: both places are kept.
    document.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var state = read();
        var panel = document.getElementById('dgl-content');
        state.y = Math.round(window.scrollY);
        state.c = panel ? Math.round(panel.scrollTop) : 0;
        write(state);
      }, 250);
    }, { passive: true, capture: true });

    var typeTimer = 0;
    document.addEventListener('input', function (event) {
      var el = event.target;
      clearTimeout(typeTimer);
      typeTimer = setTimeout(function () {
        var key = keyOf(el);
        if (!key) return;
        var state = read();
        if (valueOf(el) === defaultOf(el)) delete state.f[key]; else state.f[key] = valueOf(el);
        write(state);
      }, 400);
    }, true);

    // Saved: nothing is left to bring back.
    var clearDrafts = function () { var state = read(); state.f = {}; write(state); };
    document.addEventListener('submit', clearDrafts, true);
    document.addEventListener('dgl:dirty', function (event) { if (event.detail && event.detail.forms && !event.detail.forms.length) clearDrafts(); });

    if (kind !== 'reload' && kind !== 'back_forward') return;
    var restore = function () {
      var state = read();
      if (!state.t || Date.now() - state.t > MAX_AGE_MS) return;
      var keys = Object.keys(state.f || {});
      if (keys.length) {
        var fields = {};
        document.querySelectorAll('input[name], textarea[name], select[name]').forEach(function (el) { var key = keyOf(el); if (key) fields[key] = el; });
        keys.forEach(function (key) {
          var el = fields[key];
          // Only a field that still shows what the page gave it.
          if (!el || valueOf(el) !== defaultOf(el)) return;
          if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!state.f[key]; else el.value = state.f[key];
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      if (state.y > 0 && window.scrollY < 5) window.scrollTo(0, state.y);
      var panel = document.getElementById('dgl-content');
      if (state.c > 0 && panel && panel.scrollTop < 5) panel.scrollTop = state.c;
    };
    // The page draws its own parts when it loads: wait for them, then once more for the slow ones.
    window.addEventListener('load', function () { setTimeout(restore, 350); setTimeout(restore, 1500); });
  })();
<\/script>`], [`<script>
  (function () {
    if (window.__dglKeepPlace) return;
    window.__dglKeepPlace = true;
    var PREFIX = 'petto-place:';
    var MAX_AGE_MS = 6 * 60 * 60 * 1000;
    var kind = 'navigate';
    try { var entry = performance.getEntriesByType('navigation')[0]; if (entry && entry.type) kind = entry.type; } catch (e) { /* unknown */ }
    var address = function () { return PREFIX + location.pathname + location.search; };
    var read = function () { try { return JSON.parse(sessionStorage.getItem(address()) || 'null') || { y: 0, f: {}, t: 0 }; } catch (e) { return { y: 0, f: {}, t: 0 }; } };
    var write = function (state) { try { state.t = Date.now(); sessionStorage.setItem(address(), JSON.stringify(state)); } catch (e) { /* storage full or blocked */ } };
    // A field is told apart by its form, its name and its place among the fields with that name.
    var keyOf = function (el) {
      if (!el || !el.name || el.disabled) return null;
      var type = String(el.type || '').toLowerCase();
      if (type === 'password' || type === 'file' || type === 'hidden' || type === 'submit' || type === 'button') return null;
      if (el.closest('[data-no-draft]')) return null;
      var scope = el.form || document;
      var same = scope.querySelectorAll('[name="' + String(el.name).replace(/"/g, '\\\\\\\\"') + '"]');
      var index = Array.prototype.indexOf.call(same, el);
      var form = el.form ? (el.form.getAttribute('action') || '') + '#' + (el.form.id || '') : '';
      return form + '|' + el.name + '|' + index;
    };
    var valueOf = function (el) { return el.type === 'checkbox' || el.type === 'radio' ? el.checked : el.value; };
    var defaultOf = function (el) { return el.type === 'checkbox' || el.type === 'radio' ? el.defaultChecked : (el.tagName === 'SELECT' ? (Array.prototype.filter.call(el.options, function (o) { return o.defaultSelected; })[0] || el.options[0] || { value: '' }).value : el.defaultValue); };

    var scrollTimer = 0;
    // On a wide screen the page scrolls inside its panel (#dgl-content), on a phone the window does: both places are kept.
    document.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var state = read();
        var panel = document.getElementById('dgl-content');
        state.y = Math.round(window.scrollY);
        state.c = panel ? Math.round(panel.scrollTop) : 0;
        write(state);
      }, 250);
    }, { passive: true, capture: true });

    var typeTimer = 0;
    document.addEventListener('input', function (event) {
      var el = event.target;
      clearTimeout(typeTimer);
      typeTimer = setTimeout(function () {
        var key = keyOf(el);
        if (!key) return;
        var state = read();
        if (valueOf(el) === defaultOf(el)) delete state.f[key]; else state.f[key] = valueOf(el);
        write(state);
      }, 400);
    }, true);

    // Saved: nothing is left to bring back.
    var clearDrafts = function () { var state = read(); state.f = {}; write(state); };
    document.addEventListener('submit', clearDrafts, true);
    document.addEventListener('dgl:dirty', function (event) { if (event.detail && event.detail.forms && !event.detail.forms.length) clearDrafts(); });

    if (kind !== 'reload' && kind !== 'back_forward') return;
    var restore = function () {
      var state = read();
      if (!state.t || Date.now() - state.t > MAX_AGE_MS) return;
      var keys = Object.keys(state.f || {});
      if (keys.length) {
        var fields = {};
        document.querySelectorAll('input[name], textarea[name], select[name]').forEach(function (el) { var key = keyOf(el); if (key) fields[key] = el; });
        keys.forEach(function (key) {
          var el = fields[key];
          // Only a field that still shows what the page gave it.
          if (!el || valueOf(el) !== defaultOf(el)) return;
          if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!state.f[key]; else el.value = state.f[key];
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      if (state.y > 0 && window.scrollY < 5) window.scrollTo(0, state.y);
      var panel = document.getElementById('dgl-content');
      if (state.c > 0 && panel && panel.scrollTop < 5) panel.scrollTop = state.c;
    };
    // The page draws its own parts when it loads: wait for them, then once more for the slow ones.
    window.addEventListener('load', function () { setTimeout(restore, 350); setTimeout(restore, 1500); });
  })();
<\/script>`])));
}, "/home/runner/work/petto-web/petto-web/src/components/DashKeepPlace.astro", void 0);

var __freeze$4 = Object.freeze;
var __defProp$4 = Object.defineProperty;
var __template$4 = (cooked, raw) => __freeze$4(__defProp$4(cooked, "raw", { value: __freeze$4(raw || cooked.slice()) }));
var _a$4;
const $$Astro$4 = createAstro("https://petto.sbs");
const $$DashTemplateLock = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$DashTemplateLock;
  const dt = makeT(getDashLang(Astro2));
  const note = dt("A saved embed is picked, so this text is not used. Take the embed off to write it.");
  return renderTemplate(_a$4 || (_a$4 = __template$4(["<script>(function(){", `
  (function () {
    if (window.__dglTplLock) return;
    window.__dglTplLock = true;
    var NAME = /template|^tpl_|^embed(_|$)/;
    function isChoice(el) {
      return el && el.tagName === 'SELECT' && !el.multiple && !el.hasAttribute('data-tpl-ignore') && (!el.hasAttribute('data-dp-template-only') || el.hasAttribute('data-tpl-locks')) && NAME.test(el.name || '')
        && Array.prototype.some.call(el.options, function (o) { return o.value === ''; });
    }
    function sameForm(select, el) { return !select.form || el.form === select.form || !el.form; }
    function targetsOf(select) {
      var out = [];
      var explicit = select.getAttribute('data-tpl-locks');
      if (explicit) {
        explicit.split(/[\\s,]+/).filter(Boolean).forEach(function (name) {
          (select.form || document).querySelectorAll('[name="' + name.replace(/"/g, '') + '"]').forEach(function (el) { out.push(el); });
        });
      }
      document.querySelectorAll('[data-dp-template]').forEach(function (el) { if (el.getAttribute('data-dp-template') === select.name && sameForm(select, el)) out.push(el); });
      if (out.length) return out;
      var node = select.parentElement;
      for (var depth = 0; node && depth < 3; depth++, node = node.parentElement) {
        if (node.matches('form, .dgl-content, body, main')) break;
        var areas = Array.prototype.filter.call(node.querySelectorAll('textarea'), function (a) { return !a.closest('[data-tpl-keep]'); });
        if (!areas.length) continue;
        var choices = Array.prototype.filter.call(node.querySelectorAll('select'), isChoice);
        return choices.length === 1 && areas.length <= 2 ? areas : [];
      }
      return [];
    }
    function setLocked(el, locked) {
      var was = el.getAttribute('data-tpl-locked') === '1';
      if (locked === was) return;
      if (locked) {
        el.setAttribute('data-tpl-locked', '1');
        el.readOnly = true;
        el.setAttribute('tabindex', '-1');
        el.setAttribute('aria-disabled', 'true');
        try { el.inert = true; } catch (e) { /* the read-only flag is enough */ }
        var hint = document.createElement('small');
        hint.className = 'dgl-tpl-note';
        hint.textContent = note;
        el.parentNode.insertBefore(hint, el);
        el._tplNote = hint;
      } else {
        el.removeAttribute('data-tpl-locked');
        el.readOnly = false;
        el.removeAttribute('tabindex');
        el.removeAttribute('aria-disabled');
        try { el.inert = false; } catch (e) { /* nothing to undo */ }
        if (el._tplNote) { el._tplNote.remove(); el._tplNote = null; }
      }
    }
    function refresh(select) {
      if (!isChoice(select)) return;
      var locked = select.value !== '';
      targetsOf(select).forEach(function (el) { setLocked(el, locked); });
    }
    function all() { document.querySelectorAll('select').forEach(refresh); }
    document.addEventListener('change', function (e) { if (e.target && e.target.tagName === 'SELECT') refresh(e.target); });
    document.addEventListener('input', function (e) { if (e.target && e.target.tagName === 'SELECT') refresh(e.target); });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', all); else all();
    // A form the page opens later (the edit form of a row) is checked when it arrives, once per frame at most.
    var queued = false;
    new MutationObserver(function (records) {
      if (queued) return;
      for (var i = 0; i < records.length; i++) {
        for (var j = 0; j < records[i].addedNodes.length; j++) {
          var node = records[i].addedNodes[j];
          if (node.nodeType === 1 && (node.matches('select, textarea') || node.querySelector('select'))) { queued = true; requestAnimationFrame(function () { queued = false; all(); }); return; }
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  })();
})();<\/script> `], ["<script>(function(){", `
  (function () {
    if (window.__dglTplLock) return;
    window.__dglTplLock = true;
    var NAME = /template|^tpl_|^embed(_|$)/;
    function isChoice(el) {
      return el && el.tagName === 'SELECT' && !el.multiple && !el.hasAttribute('data-tpl-ignore') && (!el.hasAttribute('data-dp-template-only') || el.hasAttribute('data-tpl-locks')) && NAME.test(el.name || '')
        && Array.prototype.some.call(el.options, function (o) { return o.value === ''; });
    }
    function sameForm(select, el) { return !select.form || el.form === select.form || !el.form; }
    function targetsOf(select) {
      var out = [];
      var explicit = select.getAttribute('data-tpl-locks');
      if (explicit) {
        explicit.split(/[\\\\s,]+/).filter(Boolean).forEach(function (name) {
          (select.form || document).querySelectorAll('[name="' + name.replace(/"/g, '') + '"]').forEach(function (el) { out.push(el); });
        });
      }
      document.querySelectorAll('[data-dp-template]').forEach(function (el) { if (el.getAttribute('data-dp-template') === select.name && sameForm(select, el)) out.push(el); });
      if (out.length) return out;
      var node = select.parentElement;
      for (var depth = 0; node && depth < 3; depth++, node = node.parentElement) {
        if (node.matches('form, .dgl-content, body, main')) break;
        var areas = Array.prototype.filter.call(node.querySelectorAll('textarea'), function (a) { return !a.closest('[data-tpl-keep]'); });
        if (!areas.length) continue;
        var choices = Array.prototype.filter.call(node.querySelectorAll('select'), isChoice);
        return choices.length === 1 && areas.length <= 2 ? areas : [];
      }
      return [];
    }
    function setLocked(el, locked) {
      var was = el.getAttribute('data-tpl-locked') === '1';
      if (locked === was) return;
      if (locked) {
        el.setAttribute('data-tpl-locked', '1');
        el.readOnly = true;
        el.setAttribute('tabindex', '-1');
        el.setAttribute('aria-disabled', 'true');
        try { el.inert = true; } catch (e) { /* the read-only flag is enough */ }
        var hint = document.createElement('small');
        hint.className = 'dgl-tpl-note';
        hint.textContent = note;
        el.parentNode.insertBefore(hint, el);
        el._tplNote = hint;
      } else {
        el.removeAttribute('data-tpl-locked');
        el.readOnly = false;
        el.removeAttribute('tabindex');
        el.removeAttribute('aria-disabled');
        try { el.inert = false; } catch (e) { /* nothing to undo */ }
        if (el._tplNote) { el._tplNote.remove(); el._tplNote = null; }
      }
    }
    function refresh(select) {
      if (!isChoice(select)) return;
      var locked = select.value !== '';
      targetsOf(select).forEach(function (el) { setLocked(el, locked); });
    }
    function all() { document.querySelectorAll('select').forEach(refresh); }
    document.addEventListener('change', function (e) { if (e.target && e.target.tagName === 'SELECT') refresh(e.target); });
    document.addEventListener('input', function (e) { if (e.target && e.target.tagName === 'SELECT') refresh(e.target); });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', all); else all();
    // A form the page opens later (the edit form of a row) is checked when it arrives, once per frame at most.
    var queued = false;
    new MutationObserver(function (records) {
      if (queued) return;
      for (var i = 0; i < records.length; i++) {
        for (var j = 0; j < records[i].addedNodes.length; j++) {
          var node = records[i].addedNodes[j];
          if (node.nodeType === 1 && (node.matches('select, textarea') || node.querySelector('select'))) { queued = true; requestAnimationFrame(function () { queued = false; all(); }); return; }
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  })();
})();<\/script> `])), defineScriptVars({ note }));
}, "/home/runner/work/petto-web/petto-web/src/components/DashTemplateLock.astro", void 0);

var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", { value: __freeze$3(cooked.slice()) }));
var _a$3;
const $$Astro$3 = createAstro("https://petto.sbs");
const $$PremiumRequiredModal = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$PremiumRequiredModal;
  const { open = false, feature = "", cancelHref = "", premiumHref } = Astro2.props;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const refundsHref = `${dashLang === "es" ? "/es" : dashLang === "pt-BR" ? "/pt-br" : ""}/refunds`;
  const words = { named: dt("{feature} requires the Premium of the server.", { feature: "{feature}" }) };
  return renderTemplate(_a$3 || (_a$3 = __template$3(["", '<div class="prm" id="prm" role="dialog" aria-modal="true" aria-labelledby="prm-title"', "", "", '> <div class="prm-card"> <div class="prm-art" aria-hidden="true"><img src="/assets/premium-required-sky.webp" alt="" width="900" height="288" loading="eager" decoding="sync" draggable="false"></div> <div class="prm-body"> <header><h2 id="prm-title">', '</h2><button type="button" class="prm-x" data-prm-close', '>\xD7</button></header> <p class="prm-lead" id="prm-lead">', '</p> <ul class="prm-perks"> <li><i></i><div><b>', "</b><span>", "</span></div></li> <li><i></i><div><b>", "</b><span>", "</span></div></li> <li><i></i><div><b>", "</b><span>", "</span></div></li> <li><i></i><div><b>", "</b><span>", '</span></div></li> </ul> <p class="prm-terms">', " <a", ' target="_blank" rel="noopener">', '</a></p> <div class="prm-acts"> <button type="button" class="prm-cancel" data-prm-close>', '</button> <a class="prm-get"', ">", "</a> </div> </div> </div> </div>  <script>\n  (function () {\n    var root = document.getElementById('prm');\n    if (!root || root.dataset.bound) return;\n    root.dataset.bound = '1';\n    var lead = document.getElementById('prm-lead');\n    var back = null;\n    function show(feature) {\n      if (feature && lead && root.dataset.named) lead.textContent = root.dataset.named.replace('{feature}', feature);\n      back = document.activeElement;\n      // On a phone the menu is a drawer above the page: it slides to its side so the card can be seen without closing it by hand.\n      document.dispatchEvent(new Event('dgl:close-drawer'));\n      root.hidden = false;\n      var cancel = root.querySelector('.prm-cancel'); if (cancel) cancel.focus();\n    }\n    function hide() {\n      // A page that is itself the locked one sends Cancel back to a free page; a menu link just closes the card.\n      if (root.dataset.cancel) { location.href = root.dataset.cancel; return; }\n      root.hidden = true;\n      if (back && back.focus) back.focus();\n    }\n    root.addEventListener('click', function (event) {\n      var target = event.target;\n      if (target === root || (target.closest && target.closest('[data-prm-close]'))) hide();\n    });\n    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !root.hidden) hide(); });\n    // A menu link of a page that needs Premium: it opens the card instead of the page (capture phase, before the dashboard's own navigation).\n    document.addEventListener('click', function (event) {\n      var link = event.target && event.target.closest ? event.target.closest('[data-premium-lock]') : null;\n      if (!link) return;\n      event.preventDefault(); event.stopImmediatePropagation();\n      show(link.getAttribute('data-premium-lock'));\n    }, true);\n    window.dglPremiumRequired = show;\n  })();\n<\/script>"])), maybeRenderHead(), addAttribute(!open, "hidden"), addAttribute(cancelHref || void 0, "data-cancel"), addAttribute(words.named, "data-named"), dt("Premium is required"), addAttribute(dt("Close"), "aria-label"), feature ? dt("{feature} requires the Premium of the server.", { feature }) : dt("This requires the Premium of the server."), dt("Cancel whenever you want"), dt("It stays active until the end of the period you already paid and does not renew."), dt("Charges by mistake are returned"), dt("A duplicated charge, one made by mistake or never activated is refunded: open a ticket with the receipt."), dt("No refund for the paid period"), dt("What is already paid and the renewals are not returned. Read it before you buy."), dt("More Premium features"), dt("Unlocks more tools for your server."), dt("Terms:"), addAttribute(refundsHref, "href"), dt("Purchases and refunds"), dt("Cancel"), addAttribute(premiumHref, "href"), dt("Get Premium"));
}, "/home/runner/work/petto-web/petto-web/src/components/PremiumRequiredModal.astro", void 0);

const botWaitCode = "// Waiting for Petto: one place for every dashboard action that goes through the bot (window.__dglBotWait, bound once to the document, so the\n// pages that the dashboard's navigation swaps in can use it without any binding). Included by DashBotWait.astro, which also gives the look.\n//\n//   __dglBotWait.request(url, payload, options)  -> a promise of { ok, status, data, message, unreachable } (it never rejects), with .cancel()\n//   __dglBotWait.ui(host, { skeleton })          -> the waiting state alone: skeleton + ONE line of status, { status(text), clear(), fail(again) }\n//   __dglBotWait.watch()                         -> a progress line for a page the browser posts itself (a form): { stop() }\n//   __dglBotWait.text('notAnswering')            -> the words of the final error, in the dashboard's language\n//\n// While a request is out, `host` shows a skeleton (shape: 'rows', 'card' or 'lines') and one line that says what is really happening. Every\n// line comes from something that happened: the request was sent, a retry started, a number of seconds went by with no answer:\n//   \"Asking Petto…\"                                    at the start\n//   \"Petto is asking Reddit…\"                          the request is a look-up or a follow (`service`) and the connection is not refused 0.7 s later\n//   \"Petto is taking longer than usual, trying again…\" a retry really started\n//   \"Reddit is slow to answer…\"                        3 s with no answer\n//   \"Still waiting…\"                                   6 s with no answer\n// A bot that is away (no answer, a refused connection, 502 or 503 `bot_unavailable`) is asked again by itself at about 1 s, 2.5 s and 4.2 s,\n// but only when the server says asking again cannot do it twice (`retry`), and the wait ends by 6 s with the error and a Try again button\n// (`again`). A bot that answers but slowly is not given up on: after 4.3 s with no answer the page asks the server whether the bot is there at\n// all (bot-ping). If it is, the wait goes on until the action's own limit (`limit`); if it is not, the wait ends. An answer of the bot with a\n// message (a 4xx, \"Reddit is refusing Petto's requests\") is handed back as it is, at once.\n//\n// options: host (the element that shows the wait), skeleton, ui (a state made with __dglBotWait.ui, shared by several requests of one action),\n// onStatus (a function that gets each line instead of host showing it), hold (the element that gets data-dash-hold while waiting, host by default),\n// method ('GET' for a read, POST by default), service (the name of the platform that Petto is asking), idempotent (asking again is harmless: a look-up), limit (ms), again (the Try again action).\n(function () {\n  if (window.__dglBotWait) return;\n\n  var RETRY_AT = [1000, 2500, 4200]; // ms after the start at which each automatic retry begins\n  var BUDGET = 6000; // the most the page waits when the bot is not answering\n  var SERVICE_AFTER = 700; // a connection that is still open this long was not refused: the bot is asking the platform\n  var SLOW_AFTER = 3000;\n  var PING_AT = 4300;\n  var PING_MAX = 2000;\n\n  var KEYS = {\n    asking: 'Asking Petto…',\n    service: 'Petto is asking {name}…',\n    retrying: 'Petto is taking longer than usual, trying again…',\n    slowService: '{name} is slow to answer…',\n    slow: 'Petto is slow to answer…',\n    waiting: 'Still waiting for the answer. This can take a little longer…',\n    notAnswering: 'Petto is not answering. It may be restarting after an update. Try again in a few seconds.',\n    again: 'Try again',\n  };\n  function text(key, vars) {\n    var k = KEYS[key] || key;\n    if (window.cdt) return window.cdt(k, vars);\n    var s = k;\n    if (vars) for (var n in vars) s = s.split('{' + n + '}').join(String(vars[n]));\n    return s;\n  }\n\n  function el(tag, cls, content) {\n    var node = document.createElement(tag);\n    if (cls) node.className = cls;\n    if (content !== undefined) node.textContent = content;\n    return node;\n  }\n  function bars(n) { var out = []; for (var i = 0; i < n; i++) out.push(el('i', 'bw-bar')); return out; }\n\n  // The placeholders: the shape of what is coming.\n  var SHAPES = {\n    rows: function () {\n      var box = el('div', 'bw-skel bw-rows');\n      for (var i = 0; i < 3; i++) { var row = el('div', 'bw-row'); var t = el('div', 'bw-txt'); t.append.apply(t, bars(2)); row.append(el('i', 'bw-pic'), t); box.append(row); }\n      return box;\n    },\n    card: function () {\n      var box = el('div', 'bw-skel bw-card');\n      var t = el('div', 'bw-txt'); t.append.apply(t, bars(2));\n      box.append(el('i', 'bw-pic bw-pic-big'), t);\n      return box;\n    },\n    lines: function () { var box = el('div', 'bw-skel bw-lines'); box.append.apply(box, bars(2)); return box; },\n  };\n\n  // data-dash-hold keeps the dashboard's live redraw from replacing the page under a request that is out (it counts, since several can overlap).\n  function hold(target) {\n    if (!target) return function () {};\n    target.__bwHold = (target.__bwHold || 0) + 1;\n    target.setAttribute('data-dash-hold', '');\n    var released = false;\n    return function () {\n      if (released) return;\n      released = true;\n      target.__bwHold -= 1;\n      if (target.__bwHold <= 0) target.removeAttribute('data-dash-hold');\n    };\n  }\n\n  function ui(host, o) {\n    o = o || {};\n    var release = hold(o.hold === undefined ? host : o.hold);\n    var root = el('div', 'bw' + (o.skeleton === 'none' ? ' bw-flat' : ''));\n    root.setAttribute('aria-busy', 'true');\n    var line = el('p', 'bw-line');\n    line.setAttribute('role', 'status');\n    var dots = el('span', 'bw-dots');\n    dots.setAttribute('aria-hidden', 'true');\n    dots.append.apply(dots, bars(3).map(function (b) { b.className = ''; return b; }));\n    var label = el('span', 'bw-text', text('asking'));\n    line.append(dots, label);\n    root.append(line);\n    var shape = SHAPES[o.skeleton === undefined ? 'lines' : o.skeleton];\n    if (shape) root.append(shape());\n    host.replaceChildren(root);\n    var shown = root; // what is in the host now (the wait, or its error)\n    return {\n      status: function (words) { if (words && label.textContent !== words) label.textContent = words; },\n      clear: function () { release(); if (shown.parentNode === host) shown.remove(); },\n      // The wait is over and the bot did not answer: the error, and the button that does the same action again.\n      fail: function (again) {\n        release();\n        var box = el('div', 'bw-err');\n        box.setAttribute('role', 'alert');\n        box.append(el('p', 'bw-err-text', text('notAnswering')));\n        if (again) {\n          var button = el('button', 'btn btn-ghost btn-sm', text('again'));\n          button.type = 'button';\n          button.addEventListener('click', function (event) {\n            event.preventDefault();\n            button.disabled = true;\n            if (shown === box && box.parentNode === host) box.remove();\n            again();\n          });\n          box.append(button);\n        }\n        if (shown.parentNode === host) { host.replaceChildren(box); shown = box; }\n      },\n    };\n  }\n\n  function pingUrl(url) { return String(url).replace(/\\/[^\\/?#]*(?:[?#].*)?$/, '/bot-ping'); }\n\n  function request(url, payload, o) {\n    o = o || {};\n    var own = !o.ui;\n    var view = o.ui || (o.onStatus ? { status: o.onStatus, clear: function () {}, fail: function () {} } : o.host ? ui(o.host, o) : null);\n    var start = Date.now();\n    var attempt = 0;\n    var current = null; // the attempt that is out now (null between attempts)\n    var settled = false;\n    var timers = [];\n    var done;\n    var limit = o.limit || 14000;\n\n    var promise = new Promise(function (resolve) { done = resolve; });\n    function later(ms, fn) { timers.push(setTimeout(fn, ms)); }\n    function say(key, vars) { if (view && !settled) view.status(text(key, vars)); }\n    function end(result) {\n      if (settled) return;\n      settled = true;\n      timers.forEach(clearTimeout);\n      if (current) { try { current.abort(); } catch (e) { /* already over */ } current = null; }\n      if (view) { if (result.unreachable) view.fail(o.again); else if (own) view.clear(); }\n      done(result);\n    }\n    var gone = function (status, data) { return { ok: false, status: status || 0, data: data || null, message: '', unreachable: true }; };\n\n    function retryOrEnd(canRetry, status, data) {\n      var at = RETRY_AT[attempt - 1];\n      var elapsed = Date.now() - start;\n      if (!canRetry || at === undefined || elapsed > BUDGET - 900) { end(gone(status, data)); return; }\n      later(Math.max(0, at - elapsed), function () { if (settled) return; say('retrying'); send(); });\n    }\n    function answered(status, data) {\n      // 502 and 503 are \"the bot is not there\" only when they carry no message of the bot's own.\n      var away = (status === 502 || status === 503 || status === 504) && (!data || data.error === 'bot_unavailable');\n      if (!away) {\n        end({ ok: Boolean(status >= 200 && status < 300 && !(data && data.ok === false)), status: status, data: data, message: data && typeof data.message === 'string' ? data.message : '', unreachable: false });\n        return;\n      }\n      retryOrEnd(data && typeof data.retry === 'boolean' ? data.retry : Boolean(o.idempotent), status, data);\n    }\n    function send() {\n      attempt += 1;\n      var mine = new AbortController();\n      current = mine;\n      var number = attempt;\n      if (o.service) later(SERVICE_AFTER, function () { if (!settled && current === mine && number === attempt) say('service', { name: o.service }); });\n      var get = o.method === 'GET';\n      fetch(url, {\n        method: get ? 'GET' : 'POST', credentials: 'same-origin', signal: mine.signal, cache: 'no-store',\n        headers: get ? { Accept: 'application/json' } : { 'Content-Type': 'application/json', Accept: 'application/json' },\n        body: get ? undefined : JSON.stringify(payload || {}),\n      })\n        .then(function (res) { return res.json().catch(function () { return null; }).then(function (data) { return { status: res.status, data: data }; }); })\n        .then(function (r) { if (settled || current !== mine) return; current = null; answered(r.status, r.data); })\n        .catch(function () { if (settled || current !== mine) return; current = null; retryOrEnd(Boolean(o.idempotent), 0, null); });\n    }\n\n    // Elapsed time, only while an attempt is out.\n    later(SLOW_AFTER, function () { if (current) say(o.service ? 'slowService' : 'slow', { name: o.service }); });\n    later(BUDGET, function () { if (current) say('waiting'); });\n    later(PING_AT, function () {\n      if (settled || !current) return;\n      var control = new AbortController();\n      later(PING_MAX, function () { control.abort(); });\n      fetch(o.pingUrl || pingUrl(url), { credentials: 'same-origin', cache: 'no-store', signal: control.signal, headers: { Accept: 'application/json' } })\n        .then(function (res) { return res.json(); })\n        // Only a clear \"the bot is not there\" ends the wait; a ping that fails or is late tells nothing, so the wait goes on.\n        .then(function (data) { if (data && data.up === false) end(gone(0, null)); })\n        .catch(function () {});\n    });\n    later(limit, function () { end(gone(0, null)); });\n\n    send();\n    promise.cancel = function () {\n      if (settled) return;\n      settled = true;\n      timers.forEach(clearTimeout);\n      if (current) { try { current.abort(); } catch (e) { /* already over */ } current = null; }\n      if (view && own) view.clear();\n      done({ ok: false, status: 0, data: null, message: '', unreachable: false, cancelled: true });\n    };\n    return promise;\n  }\n\n  // A page that the browser posts itself (a form of the dashboard whose answer is the page again): there is nothing to retry from here (the server\n  // waits for a restarting bot, pettoBotApi.ts), so this only says what is going on, in a small line over the page, until the answer comes.\n  function watch() {\n    var host = el('div', 'bw-pill');\n    document.body.append(host);\n    var view = ui(host, { skeleton: 'none', hold: null });\n    var timers = [setTimeout(function () { view.status(text('slow')); }, SLOW_AFTER), setTimeout(function () { view.status(text('waiting')); }, BUDGET)];\n    return { stop: function () { timers.forEach(clearTimeout); view.clear(); host.remove(); } };\n  }\n\n  window.__dglBotWait = { request: request, ui: ui, watch: watch, text: text };\n})();\n";

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$DashBotWait = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$2 || (_a$2 = __template$2(["<script>", "<\/script> "])), unescapeHTML(botWaitCode));
}, "/home/runner/work/petto-web/petto-web/src/components/DashBotWait.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Astro$2 = createAstro("https://petto.sbs");
const $$DashAutocomplete = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$DashAutocomplete;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const commands = JSON.stringify(getAllCommands(lang).map((command) => [command.name, command.desc.length > 90 ? `${command.desc.slice(0, 88).trimEnd()}\u2026` : command.desc])).replace(/</g, "\\u003c");
  const words = JSON.stringify({
    roles: dt("Roles & Members"),
    channels: dt("Channels"),
    vars: dt("Variables"),
    commands: dt("Commands"),
    emojis: dt("Emojis"),
    everyone: dt("Notifies everyone in the server"),
    here: dt("Notifies everyone who is online"),
    none: dt("No matches."),
    hint: dt("\u2191\u2193 to move, Enter to pick, Esc to close"),
    voice: dt("Voice"),
    category: dt("Category"),
    forum: dt("Forum"),
    news: dt("Announcement"),
    serverEmojis: dt("Server"),
    defaultEmojis: dt("Default"),
    member: dt("Member"),
    noRoles: dt("This page has no roles to suggest.")
  }).replace(/</g, "\\u003c");
  return renderTemplate(_a$1 || (_a$1 = __template$1(['<script type="application/json" id="dgl-ac-commands">', '<\/script> <script type="application/json" id="dgl-ac-words">', "<\/script>  "])), unescapeHTML(commands), unescapeHTML(words));
}, "/home/runner/work/petto-web/petto-web/src/components/DashAutocomplete.astro", void 0);

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashGuildFooter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashGuildFooter;
  const { guildId } = Astro2.props;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const wikiBase = `https://wiki.petto.sbs${dashLang === "es" ? "/es" : dashLang === "pt-BR" ? "/pt-br" : ""}`;
  return renderTemplate`${maybeRenderHead()}<aside class="dgf" aria-labelledby="dgf-title" data-astro-cid-kgqft5qx> <div class="dgf-head" data-astro-cid-kgqft5qx> ${renderComponent($$result, "Icon", $$Icon, { "name": "ph:info-fill", "width": "15", "height": "15", "data-astro-cid-kgqft5qx": true })} <h2 id="dgf-title" data-astro-cid-kgqft5qx>${dt("YOUR SETTINGS AND YOUR DATA")}</h2> </div> <div class="dgf-grid" data-astro-cid-kgqft5qx> <p data-astro-cid-kgqft5qx>${dt("Petto keeps what you set here for as long as it is in your server. If you remove Petto, all of it is deleted within 5 minutes, backups included, and it cannot be brought back.")}</p> <p data-astro-cid-kgqft5qx>${dt("Want a copy first? Make a backup of your server in Backups, or export your settings as a file in Config Management. Both are yours to keep.")}</p> </div> <div class="dgf-links" data-astro-cid-kgqft5qx> <a${addAttribute(`/dash/guild/${guildId}/backups`, "href")} data-astro-cid-kgqft5qx>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:archive-fill", "width": "14", "height": "14", "data-astro-cid-kgqft5qx": true })}${dt("Backups")}</a> <a${addAttribute(`/dash/guild/${guildId}/general?section=management`, "href")} data-astro-cid-kgqft5qx>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:file-code-fill", "width": "14", "height": "14", "data-astro-cid-kgqft5qx": true })}${dt("Config Management")}</a> <a${addAttribute(wikiBase, "href")} target="_blank" rel="noopener" data-astro-cid-kgqft5qx>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "14", "height": "14", "data-astro-cid-kgqft5qx": true })}${dt("Read the docs")}</a> <a href="https://petto.sbs/support" target="_blank" rel="noopener" data-astro-cid-kgqft5qx>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:chat-circle-dots-fill", "width": "14", "height": "14", "data-astro-cid-kgqft5qx": true })}${dt("Support server")}</a> <a href="/privacy" target="_blank" rel="noopener" data-astro-cid-kgqft5qx>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "14", "height": "14", "data-astro-cid-kgqft5qx": true })}${dt("Privacy Policy")}</a> </div> </aside> `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashGuildFooter.astro", void 0);

const CALL_TIMEOUT_MS = 8e3;
function vanityConfig(astro) {
  const url = getEnv(astro, "PETTO_BOT_API_URL")?.replace(/\/+$/, "");
  const secret = getEnv(astro, "PETTO_BOT_API_SECRET");
  return url && secret ? { url, secret } : null;
}
async function call(astro, guildId, body) {
  const config = vanityConfig(astro);
  if (!config) return { ok: false, status: 503, code: "not_configured", message: "The dashboard is not connected to the bot." };
  try {
    const res = await fetch(`${config.url}/api/dashboard/guild/${encodeURIComponent(guildId)}/identity`, {
      method: "POST",
      headers: { "x-petto-dashboard-key": config.secret, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(CALL_TIMEOUT_MS)
    });
    const payload = await res.json().catch(() => null);
    if (res.ok && payload?.ok !== false) return { ok: true, data: payload };
    const code = payload?.error === "guild_unavailable" ? "not_installed" : String(payload?.error ?? "unavailable");
    return { ok: false, status: res.status, code, message: String(payload?.message ?? "The bot did not answer.") };
  } catch {
    return { ok: false, status: 503, code: "unavailable", message: "The bot did not answer in time." };
  }
}
const SOURCES = ["custom_status", "username", "global_name", "guild_nickname", "display_name"];
const COMPARISONS = ["equals", "contains", "starts_with", "ends_with", "regex"];
const CONDITIONS = ["is_guild_id", "is_not_guild_id", "identity_enabled", "identity_disabled", "tag_equals", "tag_not_equals"];
const LOG_EVENTS = ["vanity_add", "vanity_remove", "tag_add", "tag_remove", "error"];
async function getVanityOverview(astro, guildId, _userId) {
  const config = vanityConfig(astro);
  const botToken = getEnv(astro, "DISCORD_TOKEN");
  if (!config || !botToken) return { ok: false, status: 503, code: "not_configured", message: "The dashboard is not connected to the bot." };
  const headers = { apikey: config.secret, Authorization: `Bearer ${config.secret}`, Accept: "application/json" };
  const table = async (path) => {
    const res = await fetch(`${config.url}/rest/v1/${path}`, { headers, signal: AbortSignal.timeout(CALL_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`table ${res.status}`);
    const rows = await res.json();
    return Array.isArray(rows) ? rows : [];
  };
  try {
    const guild = await getGuildInfo(guildId, botToken);
    if (!guild) return { ok: false, status: 404, code: "not_installed", message: "Petto is not in this server." };
    const where = `guild_id=eq.${encodeURIComponent(guildId)}`;
    const [rolesRes, channelsRes, vanity, guildtag, notifications, logs, embeds, settings] = await Promise.all([
      getGuildList(astro, guildId, botToken, "roles"),
      getGuildList(astro, guildId, botToken, "channels"),
      table(`vanity_rules?${where}&deleted_at=is.null&select=id,name,word,source,comparison,role_id,action,enabled,normalization&order=name.asc`),
      table(`guildtag_rules?${where}&deleted_at=is.null&select=id,name,condition,value,role_id,action,enabled&order=name.asc`),
      table(`identity_notifications?${where}&select=source_type,channel_id,embed_name,ping`),
      table(`identity_logs?${where}&select=channel_id,events,embeds`),
      table(`embed_templates?${where}&select=name&order=name.asc`),
      // A bot that has not got the table yet (its schema is applied later) just means the default (take the role away).
      table(`identity_settings?${where}&select=offline_mode`).catch(() => [])
    ]);
    if (!rolesRes.ok || !channelsRes.ok) return { ok: false, status: 503, code: "unavailable", message: "Discord did not answer." };
    const rawRoles = await rolesRes.json();
    const rawChannels = await channelsRes.json();
    const botTop = Math.max(-1, ...rawRoles.filter((role) => role.mine === true).map((role) => Number(role.position)));
    const roles = rawRoles.filter((role) => role.id !== guildId).sort((a, b) => b.position - a.position).map((role) => {
      const reason = role.managed ? "managed" : botTop >= 0 && Number(role.position) >= botTop ? "above_bot" : void 0;
      return { id: String(role.id), name: String(role.name), color: Number(role.color ?? 0), position: Number(role.position ?? 0), assignable: !reason, ...reason ? { reason } : {} };
    });
    const channels = rawChannels.filter((channel) => channel.type === 0 || channel.type === 5).sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0)).map((channel) => ({ id: String(channel.id), name: String(channel.name), position: Number(channel.position ?? 0) }));
    const notification = (source) => {
      const row = notifications.find((entry) => entry.source_type === source);
      return { channel_id: row?.channel_id ?? "", embed: row?.embed_name ?? "", ping: row?.ping === "none" ? "none" : "user" };
    };
    const log = logs[0];
    return {
      ok: true,
      data: {
        ok: true,
        guild: { id: guildId, name: guild.name, icon: iconHash(guild.icon) },
        rules: { vanity, guildtag },
        notifications: { vanity: notification("vanity"), guildtag: notification("guildtag") },
        settings: { offline_mode: settings[0]?.offline_mode === "keep" ? "keep" : "remove" },
        logs: { channel_id: log?.channel_id ?? "", events: LOG_EVENTS.filter((event) => log?.events?.[event]), embeds: log?.embeds ?? {} },
        embeds: embeds.map((row) => String(row.name)),
        roles,
        channels,
        options: { vanity_sources: SOURCES, comparisons: COMPARISONS, conditions: CONDITIONS, actions: ["add_role", "remove_role"], log_events: LOG_EVENTS, ping_modes: ["user", "none"] }
      }
    };
  } catch {
    return { ok: false, status: 503, code: "unavailable", message: "The data did not answer in time." };
  }
}
function iconHash(url) {
  const match = url ? /\/icons\/\d+\/([^./?]+)/.exec(url) : null;
  return match ? match[1] : null;
}
function vanityAction(astro, guildId, userId, body) {
  return call(astro, guildId, { ...body, user_id: userId });
}

function list$1(astro, name) {
  return String(getEnv(astro, name) ?? "").split(/[\s,]+/).filter((id) => /^\d{15,22}$/.test(id));
}
function canUseQuests(astro, userId) {
  if (getEnv(astro, "QUESTS_PUBLIC") !== "false") return true;
  if (!userId) return false;
  return isPettoOwner(astro, userId) || list$1(astro, "PETTO_DEVELOPER_IDS").includes(userId) || list$1(astro, "QUESTS_TESTER_IDS").includes(userId);
}

function list(astro, name) {
  return String(getEnv(astro, name) ?? "").split(/[\s,]+/).filter((id) => /^\d{15,22}$/.test(id));
}
function canUseRollouts(astro, userId) {
  if (getEnv(astro, "ROLLOUTS_PUBLIC") !== "false") return true;
  if (!userId) return false;
  return isPettoOwner(astro, userId) || list(astro, "PETTO_DEVELOPER_IDS").includes(userId) || list(astro, "ROLLOUTS_TESTER_IDS").includes(userId);
}

const YES_MS = 5 * 6e4;
const NO_MS = 2e4;
const MAX_KEPT = 500;
const kept = /* @__PURE__ */ new Map();
const asking = /* @__PURE__ */ new Map();
async function ask(context) {
  const apiUrl = getEnv(context, "PETTO_BOT_API_URL");
  const apiKey = getEnv(context, "PETTO_BOT_API_SECRET");
  if (!apiUrl || !apiKey) return false;
  try {
    const res = await fetch(`${apiUrl}/rest/v1/forum_setups?select=id&limit=1`, { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` }, signal: AbortSignal.timeout(4e3) });
    return res.ok;
  } catch {
    return null;
  }
}
async function forumsReady(context, waitMs = 600) {
  const key = "forum_setups";
  const hit = kept.get(key);
  if (hit && hit.until > Date.now()) return hit.ready;
  let pending = asking.get(key);
  if (!pending) {
    pending = ask(context).then((answer) => {
      const ready = answer ?? hit?.ready ?? false;
      if (kept.size > MAX_KEPT) kept.clear();
      kept.set(key, { ready, until: Date.now() + (ready ? answer === null ? NO_MS : YES_MS : NO_MS) });
      return ready;
    }).finally(() => {
      asking.delete(key);
    });
    asking.set(key, pending);
  }
  return Promise.race([pending, new Promise((resolve) => setTimeout(() => resolve(false), waitMs))]);
}

const BY_ID = {
  // Moderation
  moderation: ["automod"],
  "automod-templates": ["automod"],
  antinuke: ["security"],
  honeypot: ["honeypot"],
  "role-triggers": ["role-triggers"],
  "role-quotas": ["role-quotas"],
  "mod-rules": ["mod-rules"],
  // Security and join
  "welcome-messages": ["welcome"],
  verification: ["verification"],
  "join-roles": ["joinroles"],
  "aged-roles": ["aged-roles"],
  "message-roles": ["message-roles"],
  "voice-247": ["stay-voice"],
  security: ["security"],
  logging: ["logging"],
  // Design
  embeds: ["embeds"],
  cards: ["cards"],
  // Automation
  "custom-commands": ["commands"],
  code: ["commands"],
  autoresponders: ["autoresponders"],
  "reaction-roles": ["reactionroles"],
  webhooks: ["webhooks"],
  // Community
  tickets: ["tickets"],
  giveaways: ["giveaways"],
  birthdays: ["birthdays"],
  suggestions: ["suggestions"],
  confessions: ["confessions"],
  counting: ["counting"],
  "activity-boards": ["activity-boards"],
  boards: ["starboard"],
  forms: ["forms"],
  counters: ["counters"]
};
const PREFIXES = [
  ["leveling", ["leveling"]],
  ["tickets-", ["tickets"]],
  ["giveaways-", ["giveaways"]],
  ["forms-", ["forms"]]
];
function navModulesOf(itemId) {
  if (BY_ID[itemId]) return BY_ID[itemId];
  for (const [prefix, modules] of PREFIXES) if (itemId.startsWith(prefix)) return modules;
  return [];
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a, _b, _c;
const $$Astro = createAstro("https://petto.sbs");
const $$DashGuildLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashGuildLayout;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { guildId, guildName, guildIcon, user, active, pageTitle: rawPageTitle, premiumActive = false, premiumRequired = "" } = Astro2.props;
  const cssString = (value) => `"${(value.length > 26 ? `${value.slice(0, 25).trimEnd()}\u2026` : value).replace(/[\\"]/g, "\\$&").replace(/[\r\n]/g, " ")}"`;
  const pageTitle = dt(rawPageTitle);
  const { discordGuilds, botGuildIds: activeBotGuildIds, botIdentity, premiumGuildIds, memberCounts, isManager, roleAccess } = await loadDashLayoutData(Astro2, guildId, user);
  const resolvedPremiumActive = premiumGuildIds.has(guildId);
  const pageAccess = roleAccess ? pageDecision(roleAccess, pageOf(Astro2.url.pathname, guildId)) : null;
  const accessNotice = { no_section: dt("Your role does not open that part of the dashboard."), view_only: dt("Your role can look at that part but not change it."), dev_readonly: dt("Support mode: this setting is not editable on other servers") }[Astro2.url.searchParams.get("error") ?? ""] ?? null;
  const roleBlockLabels = JSON.stringify({ everyone: dt("everyone"), managed: dt("managed"), above_bot: dt("above the bot") });
  const clientId = getEnv(Astro2, "DISCORD_CLIENT_ID");
  const { mine: switcherGuilds, invite: inviteGuilds } = splitServers(discordGuilds, activeBotGuildIds, { canManage: canManageGuild, iconOf: (g) => guildIconUrl(g), memberCounts, premiumIds: premiumGuildIds });
  const switcherInvites = clientId ? inviteGuilds.map((g) => ({ ...g, href: botInviteUrl(clientId, g.id) })) : [];
  const headerArt = guildHeaderArt({ id: guildId, banner: discordGuilds?.find((g) => g.id === guildId)?.banner });
  let devView = false;
  if (discordGuilds) {
    devView = Boolean(user.userId) && isPettoOwner(Astro2, user.userId) && !discordGuilds.filter(canManageGuild).some((g) => g.id === guildId);
  }
  const supportPolicy = devView ? supportPolicyFor(supportPageOf(Astro2.url.pathname, guildId)) : null;
  const supportEditable = Boolean(supportPolicy && supportPolicy.groups.length);
  const supportParts = devView ? supportLabels().map((label) => dt(label)).join(", ") : "";
  const supportJson = JSON.stringify({ ...supportPolicy ?? {}, denied: dt("Support mode: this setting is not editable on other servers") }).replace(/</g, "\\u003c");
  const t = useTranslations("en");
  const categories = t.commandsPage.categories.filter((c) => c.id !== "info");
  const catById = Object.fromEntries(categories.map((c) => [c.id, c]));
  const catIcon = {
    moderation: "ph:shield-check-fill",
    // Keep this on the base Phosphor ticket glyph: it is present in every icon
    // bundle variant and avoids an empty icon if the filled alias is pruned.
    tickets: "ph:ticket",
    leveling: "ph:chart-line-up-fill",
    giveaways: "ph:gift-fill",
    automation: "ph:robot",
    community: "ph:users-three-fill",
    onboarding: "ph:hand-waving-fill",
    logging: "ph:clipboard-text-fill",
    setup: "ph:gear-fill"
  };
  const catLabel = { setup: dt("General"), onboarding: dt("Join Gate"), leveling: dt("Level Rewards") };
  const forumsOn = await forumsReady(Astro2);
  const allGroups = [
    {
      label: dt("Dashboard"),
      icon: "ph:squares-four-fill",
      important: true,
      items: [
        { id: "overview", href: `/dash/guild/${guildId}/overview`, icon: "ph:squares-four-fill", label: dt("Overview") },
        { id: "quick-setup", href: `/dash/guild/${guildId}/quick-setup`, icon: "ph:rocket-launch-fill", label: dt("Quick Setup"), isNew: isStillNew("2026-11-18") },
        { id: "migrate", href: `/dash/guild/${guildId}/migrate`, icon: "ph:arrows-left-right-fill", label: dt("Migrate from another bot"), beta: true },
        { id: "modules", href: `/dash/guild/${guildId}/modules`, icon: "ph:puzzle-piece-fill", label: dt("Modules") },
        { id: "stats", href: `/dash/guild/${guildId}/stats`, icon: "ph:chart-bar-fill", label: dt("Statistics") },
        { id: "setup", href: `/dash/guild/${guildId}/general?section=settings`, icon: catIcon.setup, label: dt("Settings") },
        { id: "general-management", href: `/dash/guild/${guildId}/general?section=management`, icon: "ph:file-code-fill", label: dt("Config Management") },
        { id: "customize", href: `/dash/guild/${guildId}/customize`, icon: "ph:sparkle-fill", label: dt("Customize") },
        { id: "backups", href: `/dash/guild/${guildId}/backups`, icon: "ph:archive-fill", label: dt("Backups"), premium: true, lock: true, maintenance: backupsUnderMaintenance(Astro2, user.userId) }
      ]
    },
    {
      label: dt("Design"),
      icon: "ph:paint-brush-broad-fill",
      items: [
        { id: "embeds", href: `/dash/guild/${guildId}/embeds`, icon: "ph:chat-circle-dots-fill", label: dt("Embeds") },
        { id: "cards", href: `/dash/guild/${guildId}/cards`, icon: "ph:image-fill", label: dt("Image cards") }
      ]
    },
    {
      label: dt("Moderation"),
      icon: "ph:shield-check-fill",
      important: true,
      items: [
        ...["moderation"].filter((id) => catById[id]).map((id) => ({
          id,
          href: `/dash/guild/${guildId}/${id}`,
          icon: catIcon[id],
          label: catLabel[id] ?? catById[id].title
        })),
        { id: "antinuke", href: `/dash/guild/${guildId}/antinuke`, icon: "ph:siren-fill", label: dt("Anti-raid & nuke") },
        { id: "antiscam", href: `/dash/guild/${guildId}/antiscam`, icon: "ph:shield-warning-fill", label: dt("Anti scam") },
        { id: "honeypot", href: `/dash/guild/${guildId}/honeypot`, icon: "ph:jar-label-fill", label: dt("Honeypot") },
        { id: "mod-rules", href: `/dash/guild/${guildId}/rules`, icon: "ph:list-checks-fill", label: dt("Moderation rules"), isNew: isStillNew("2026-11-18") },
        ...isManager ? [{ id: "staff-roles", href: `/dash/guild/${guildId}/staff-roles`, icon: "ph:user-gear-fill", label: dt("Staff roles"), isNew: isStillNew("2026-11-18") }] : [],
        { id: "automod-templates", href: `/dash/guild/${guildId}/automod`, icon: "ph:funnel-fill", label: dt("AutoMod templates") },
        { id: "silent-channels", href: `/dash/guild/${guildId}/moderation?section=silent-channels`, icon: "ph:speaker-slash-fill", label: dt("Silent Channels") },
        { id: "warn-escalation", href: `/dash/guild/${guildId}/moderation?section=warn-escalation`, icon: "ph:warning-fill", label: dt("Warn Escalation") },
        { id: "sanction-messages", href: `/dash/guild/${guildId}/moderation?section=sanction-messages`, icon: "ph:chat-text-fill", label: dt("Sanction Messages") },
        { id: "active-sanctions", href: `/dash/guild/${guildId}/moderation?section=active`, icon: "ph:gavel-fill", label: dt("Active sanctions") },
        { id: "mod-stats", href: `/dash/guild/${guildId}/moderation?section=stats`, icon: "ph:chart-line-up-fill", label: dt("Moderator stats") },
        { id: "cases", href: `/dash/guild/${guildId}/moderation?section=cases`, icon: "ph:clipboard-text-fill", label: dt("Case Log") }
      ]
    },
    {
      label: dt("Appeals"),
      icon: "ph:scales-fill",
      items: [
        { id: "appeals-overview", href: `/dash/guild/${guildId}/appeals?section=overview`, icon: "ph:scales-fill", label: dt("Appeals") },
        { id: "appeals-forms", href: `/dash/guild/${guildId}/appeals?section=forms`, icon: "ph:list-checks-fill", label: dt("Appeal forms") },
        { id: "appeals-submissions", href: `/dash/guild/${guildId}/appeals?section=submissions`, icon: "ph:tray-fill", label: dt("Appeal submissions") },
        { id: "appeals-settings", href: `/dash/guild/${guildId}/appeals?section=settings`, icon: "ph:gear-six-fill", label: dt("Appeal settings") },
        { id: "appeals-brand", href: `/dash/guild/${guildId}/appeals?section=brand`, icon: "ph:paint-brush-broad-fill", label: dt("Appeal brand") },
        { id: "appeals-messages", href: `/dash/guild/${guildId}/appeals?section=messages`, icon: "ph:chat-teardrop-text-fill", label: dt("Appeal messages") }
      ]
    },
    {
      label: dt("Security"),
      icon: "ph:lock-key-fill",
      important: true,
      items: [
        { id: "verification", href: `/dash/guild/${guildId}/onboarding`, icon: "ph:seal-check-fill", label: dt("Verification") },
        { id: "security", href: `/dash/guild/${guildId}/security`, icon: "ph:shield-warning-fill", label: dt("Security") },
        { id: "security-unrestricted", href: `/dash/guild/${guildId}/security?section=unrestricted`, icon: "ph:keyhole-fill", label: dt("Command Coverage"), isUpdated: true },
        { id: "permissions", href: `/dash/guild/${guildId}/permissions`, icon: "ph:key-fill", label: dt("Permissions"), isUpdated: true },
        ...isManager ? [{ id: "access", href: `/dash/guild/${guildId}/access`, icon: "ph:user-gear-fill", label: dt("Dashboard access") }] : [],
        { id: "audit", href: `/dash/guild/${guildId}/audit`, icon: "ph:clock-counter-clockwise-fill", label: dt("Audit Log") },
        { id: "logging", href: `/dash/guild/${guildId}/logging`, icon: catIcon.logging, label: dt("Logging") }
      ]
    },
    {
      label: dt("Welcome"),
      icon: "ph:hand-waving-fill",
      items: [
        { id: "welcome-messages", href: `/dash/guild/${guildId}/welcome`, icon: "ph:hand-waving-fill", label: dt("Welcome messages") },
        { id: "welcome-dm", href: `/dash/guild/${guildId}/welcome?section=dm`, icon: "ph:envelope-simple-fill", label: dt("DM on join") },
        { id: "welcome-ping", href: `/dash/guild/${guildId}/welcome?section=ping`, icon: "ph:bell-ringing-fill", label: dt("Ping on join") }
      ]
    },
    {
      label: dt("Roles"),
      icon: "ph:tag-fill",
      items: [
        { id: "join-roles", href: `/dash/guild/${guildId}/join-roles`, icon: "ph:user-plus-fill", label: dt("Join roles") },
        { id: "aged-roles", href: `/dash/guild/${guildId}/aged-roles`, icon: "ph:hourglass-medium-fill", label: dt("Aged roles"), isNew: isStillNew("2026-11-18") },
        { id: "message-roles", href: `/dash/guild/${guildId}/message-roles`, icon: "ph:chat-circle-text-fill", label: dt("Message roles"), isNew: isStillNew("2026-11-19") },
        { id: "reaction-roles", href: `/dash/guild/${guildId}/automation?section=reaction-roles`, icon: "ph:smiley-fill", label: dt("Reaction Roles") },
        { id: "sticky-roles", href: `/dash/guild/${guildId}/automation?section=sticky-roles`, icon: "ph:arrow-counter-clockwise-fill", label: dt("Sticky roles") },
        { id: "bulk-role", href: `/dash/guild/${guildId}/bulk-role`, icon: "ph:users-three-fill", label: dt("Bulk roles") },
        { id: "role-triggers", href: `/dash/guild/${guildId}/role-triggers`, icon: "ph:lightning-fill", label: dt("Role triggers"), isNew: isStillNew("2026-11-05") },
        { id: "role-quotas", href: `/dash/guild/${guildId}/role-quotas`, icon: "ph:chart-bar-fill", label: dt("Role quotas"), isNew: isStillNew("2026-11-10") },
        { id: "community-boosters", href: `/dash/guild/${guildId}/community?section=boosters`, icon: "ph:sparkle-fill", label: dt("Booster Roles") },
        ...vanityConfig(Astro2) ? [
          { id: "vanity", href: `/dash/guild/${guildId}/vanity?section=rules`, icon: "ph:sparkle-fill", label: dt("Vanity rules") },
          { id: "vanity-tags", href: `/dash/guild/${guildId}/vanity?section=tags`, icon: "ph:tag-fill", label: dt("Server Tag rules") },
          { id: "vanity-messages", href: `/dash/guild/${guildId}/vanity?section=messages`, icon: "ph:chat-circle-dots-fill", label: dt("Thank-you messages") },
          { id: "vanity-logs", href: `/dash/guild/${guildId}/vanity?section=logs`, icon: "ph:clipboard-text-fill", label: dt("Vanity logs") }
        ] : []
      ]
    },
    {
      label: dt("Leveling"),
      icon: "ph:chart-line-up-fill",
      items: [
        { id: "leveling", href: `/dash/guild/${guildId}/leveling?section=settings`, icon: "ph:chart-line-up-fill", label: dt("Leveling") },
        { id: "streaks", href: `/dash/guild/${guildId}/streaks`, icon: "ph:fire-fill", label: dt("Streaks"), isNew: isStillNew("2026-11-24") },
        { id: "leveling-voice", href: `/dash/guild/${guildId}/leveling?section=voice`, icon: "ph:headphones-fill", label: dt("Voice leveling") },
        { id: "leveling-rank", href: `/dash/guild/${guildId}/leveling?section=rank`, icon: "ph:identification-badge-fill", label: dt("Rank card") },
        { id: "leveling-rules", href: `/dash/guild/${guildId}/leveling?section=rules`, icon: "ph:shield-check-fill", label: dt("Rules and events") },
        { id: "leveling-multipliers", href: `/dash/guild/${guildId}/leveling?section=multipliers`, icon: "ph:rocket-launch-fill", label: dt("Multipliers") },
        { id: "leveling-rewards", href: `/dash/guild/${guildId}/leveling?section=rewards`, icon: "ph:trophy-fill", label: dt("Level Rewards") },
        { id: "leveling-leaderboard", href: `/dash/guild/${guildId}/leveling?section=leaderboard`, icon: "ph:ranking-fill", label: dt("Leaderboard") },
        { id: "leveling-leaderboard-voice", href: `/dash/guild/${guildId}/leveling?section=leaderboard-voice`, icon: "ph:ranking-fill", label: dt("Voice leaderboard") }
      ]
    },
    {
      label: dt("Economy"),
      icon: "ph:coins-fill",
      items: [
        { id: "economy", href: `/dash/guild/${guildId}/economy`, icon: "ph:coins-fill", label: dt("Economy"), soon: true }
      ]
    },
    {
      label: dt("Automation"),
      icon: "ph:robot-fill",
      items: [
        { id: "automation-overview", href: `/dash/guild/${guildId}/automation?section=overview`, icon: "ph:squares-four-fill", label: dt("Automation") },
        { id: "custom-commands", href: `/dash/guild/${guildId}/automation?section=custom-commands`, icon: "ph:terminal-window-fill", label: dt("Custom commands") },
        ...canUseCodeCommands(Astro2, user.userId) ? [{ id: "code", href: `/dash/guild/${guildId}/code`, icon: "ph:code-fill", label: dt("Commands in code"), full: true }] : [],
        { id: "autoresponders", href: `/dash/guild/${guildId}/automation?section=autoresponders`, icon: "ph:robot-fill", label: dt("Autoresponders") },
        { id: "sticky-messages", href: `/dash/guild/${guildId}/automation?section=sticky-messages`, icon: "ph:push-pin-fill", label: dt("Sticky Messages") },
        { id: "reaction-messages", href: `/dash/guild/${guildId}/automation?section=reaction-messages`, icon: "ph:chat-circle-dots-fill", label: dt("Message Reactions") },
        { id: "reaction-triggers", href: `/dash/guild/${guildId}/automation?section=reaction-triggers`, icon: "ph:smiley-fill", label: dt("Reaction Triggers") },
        { id: "auto-threads", href: `/dash/guild/${guildId}/automation?section=auto-threads`, icon: "ph:chats-circle-fill", label: "Auto-threading" },
        { id: "timers", href: `/dash/guild/${guildId}/automation?section=timers`, icon: "ph:timer-fill", label: dt("Timers") },
        { id: "aliases", href: `/dash/guild/${guildId}/automation?section=aliases`, icon: "ph:command-fill", label: dt("Command Aliases") },
        { id: "disabled-commands", href: `/dash/guild/${guildId}/automation?section=disabled-commands`, icon: "ph:prohibit-fill", label: dt("Disabled Commands") }
      ]
    },
    {
      label: dt("Community"),
      icon: "ph:users-three-fill",
      items: [
        { id: "tickets", href: `/dash/guild/${guildId}/tickets?section=panels`, icon: catIcon.tickets, label: dt("Tickets") },
        { id: "tickets-types", href: `/dash/guild/${guildId}/tickets?section=types`, icon: "ph:ticket", label: dt("Support Types") },
        { id: "tickets-forms", href: `/dash/guild/${guildId}/tickets?section=forms`, icon: "ph:clipboard-text-fill", label: dt("Ticket Forms") },
        { id: "tickets-access", href: `/dash/guild/${guildId}/tickets?section=access`, icon: "ph:prohibit-fill", label: dt("Ticket Access") },
        { id: "tickets-settings", href: `/dash/guild/${guildId}/tickets?section=settings`, icon: "ph:gear-six-fill", label: dt("Ticket Settings") },
        { id: "tickets-replies", href: `/dash/guild/${guildId}/tickets?section=replies`, icon: "ph:chat-circle-text-fill", label: dt("Quick replies") },
        { id: "tickets-open", href: `/dash/guild/${guildId}/tickets?section=open`, icon: "ph:broadcast-fill", label: dt("Live tickets") },
        ...forumsOn ? [
          { id: "forums", href: `/dash/guild/${guildId}/forums`, icon: "ph:chats-circle-fill", label: dt("Forums") },
          { id: "forums-posts", href: `/dash/guild/${guildId}/forums?section=posts`, icon: "ph:list-bullets-fill", label: dt("Forum posts") }
        ] : [],
        { id: "giveaways", href: `/dash/guild/${guildId}/giveaways?section=settings`, icon: catIcon.giveaways, label: dt("Giveaways") },
        { id: "giveaways-presets", href: `/dash/guild/${guildId}/giveaways?section=presets`, icon: "ph:star-fill", label: dt("Giveaway Presets") },
        { id: "giveaways-active", href: `/dash/guild/${guildId}/giveaways?section=active`, icon: "ph:timer-fill", label: dt("Running Giveaways") },
        { id: "community", href: `/dash/guild/${guildId}/community?section=settings`, icon: catIcon.community, label: dt("Community Settings") },
        { id: "community-reputation", href: `/dash/guild/${guildId}/community?section=reputation`, icon: "ph:medal-fill", label: dt("Reputation") },
        { id: "responders", href: `/dash/guild/${guildId}/responders`, icon: "ph:list-checks-fill", label: dt("Buttons and panels") },
        { id: "senders", href: `/dash/guild/${guildId}/senders`, icon: "ph:user-circle-fill", label: dt("Message look") },
        { id: "uploads", href: `/dash/guild/${guildId}/tools?section=uploads`, icon: "ph:upload-simple-bold", label: dt("Uploads") },
        { id: "requests", href: `/dash/guild/${guildId}/tools?section=requests`, icon: "ph:ticket", label: dt("Requests") },
        { id: "reviews", href: `/dash/guild/${guildId}/tools?section=reviews`, icon: "ph:star-fill", label: dt("Reviews and profiles") },
        { id: "partners", href: `/dash/guild/${guildId}/partners`, icon: "ph:handshake-fill", label: dt("Partners") },
        { id: "birthdays", href: `/dash/guild/${guildId}/birthdays`, icon: "ph:cake-fill", label: dt("Birthdays") },
        { id: "suggestions", href: `/dash/guild/${guildId}/suggestions`, icon: "ph:lightbulb-fill", label: dt("Suggestions") },
        { id: "confessions", href: `/dash/guild/${guildId}/confessions`, icon: "ph:chat-circle-text-fill", label: dt("Confessions") },
        { id: "counting", href: `/dash/guild/${guildId}/counting`, icon: "ph:hash-fill", label: dt("Counting") },
        { id: "bump", href: `/dash/guild/${guildId}/bump`, icon: "ph:arrow-fat-lines-up-fill", label: dt("Bump") },
        { id: "activity-boards", href: `/dash/guild/${guildId}/activity-boards`, icon: "ph:trophy-fill", label: dt("Activity leaderboards"), isNew: isStillNew("2026-11-12") },
        { id: "voice-247", href: `/dash/guild/${guildId}/voice-247`, icon: "ph:microphone-fill", label: dt("Stay in voice"), isNew: isStillNew("2026-11-20") },
        { id: "media", href: `/dash/guild/${guildId}/media`, icon: "ph:image-fill", label: dt("Media channels") },
        { id: "community-polls", href: `/dash/guild/${guildId}/community?section=polls`, icon: "ph:chart-bar-fill", label: dt("Polls") },
        { id: "boards", href: `/dash/guild/${guildId}/boards`, icon: "ph:star-fill", label: dt("Boards") },
        { id: "voicemaster", href: `/dash/guild/${guildId}/automation?section=voicemaster`, icon: "ph:headphones-fill", label: dt("VoiceMaster") }
      ]
    },
    {
      label: dt("Forms"),
      icon: "ph:list-checks-fill",
      items: [
        { id: "forms", href: `/dash/guild/${guildId}/forms`, icon: "ph:clipboard-text-fill", label: dt("Forms") },
        { id: "forms-submissions", href: `/dash/guild/${guildId}/forms?section=submissions`, icon: "ph:tray-fill", label: dt("Form submissions") },
        { id: "forms-panels", href: `/dash/guild/${guildId}/forms?section=panels`, icon: "ph:cursor-click-fill", label: dt("Form panels") }
      ]
    },
    ...canUseQuests(Astro2, user.userId) || canUseRollouts(Astro2, user.userId) ? [{
      label: dt("Quests and Rollouts"),
      icon: "ph:flag-fill",
      items: [
        ...canUseQuests(Astro2, user.userId) ? [{ id: "quests", href: `/dash/guild/${guildId}/quests`, icon: "ph:trophy-fill", label: dt("Quest alerts") }] : [],
        ...canUseRollouts(Astro2, user.userId) ? [{ id: "rollouts", href: `/dash/guild/${guildId}/rollouts`, icon: "ph:flask-fill", label: dt("Rollout alerts") }] : []
      ]
    }] : [],
    ...canUseFeeds(Astro2, user.userId) ? [{
      label: dt("Feeds"),
      icon: "ph:bell-ringing-fill",
      items: [
        { id: "feeds-overview", href: `/dash/guild/${guildId}/feeds`, icon: "ph:bell-ringing-fill", label: dt("All feeds") },
        ...FEED_PLATFORMS.filter((p) => !p.hidden).map((p) => ({ id: `feeds-${p.id}`, href: `/dash/guild/${guildId}/feeds?platform=${p.id}`, icon: p.icon, label: p.name, color: p.color }))
      ]
    }] : [],
    {
      label: dt("Integrations"),
      icon: "ph:plugs-connected-fill",
      items: [
        { id: "counters", href: `/dash/guild/${guildId}/counters`, icon: "ph:chart-line-up-fill", label: dt("Counters") },
        { id: "webhooks", href: `/dash/guild/${guildId}/automation?section=webhooks`, icon: "ph:webhooks-logo-fill", label: dt("Webhooks") }
      ]
    }
  ];
  const groups = roleAccess ? allGroups.map((group) => ({ ...group, items: group.items.filter((item) => pageDecision(roleAccess, pageOf(item.href.split("?")[0], guildId)).allowed) })).filter((group) => group.items.length > 0) : allGroups;
  const stableInlineItems = /* @__PURE__ */ new Set([
    "customize",
    "community-boosters",
    "leveling",
    "leveling-voice",
    "leveling-leaderboard",
    "leveling-leaderboard-voice",
    "vanity",
    "vanity-tags",
    "vanity-messages",
    "vanity-logs"
  ]);
  const activeNavItem = groups.flatMap((g) => g.items).find((item) => item.id === active);
  const skeletonOf = {
    overview: "stats",
    stats: "stats",
    "mod-stats": "stats",
    modules: "grid",
    "quick-setup": "list",
    migrate: "list",
    "mod-rules": "list",
    "automation-overview": "grid",
    "automod-templates": "grid",
    "disabled-commands": "grid",
    embeds: "editor",
    cards: "editor",
    code: "editor",
    audit: "list",
    cases: "list",
    "active-sanctions": "list",
    "appeals-submissions": "list",
    "forms-submissions": "list",
    "tickets-open": "list",
    "giveaways-active": "list",
    "vanity-logs": "list",
    "leveling-leaderboard": "list",
    "leveling-leaderboard-voice": "list",
    backups: "list",
    feeds: "list",
    "feeds-overview": "list",
    "feeds-youtube": "list",
    "feeds-twitch": "list",
    "feeds-kick": "list",
    "feeds-bluesky": "list",
    "feeds-reddit": "list",
    "feeds-steam": "list",
    "feeds-github": "list",
    "feeds-modrinth": "list",
    "feeds-npm": "list",
    "feeds-pypi": "list",
    "feeds-anilist": "list",
    "feeds-pinterest": "list",
    "feeds-rss": "list",
    "feeds-wikipedia": "list",
    "feeds-chess": "list",
    "feeds-pokemon": "list",
    responders: "cards",
    autoresponders: "cards",
    "custom-commands": "cards",
    timers: "cards",
    "sticky-messages": "cards",
    counters: "cards",
    "security-unrestricted": "cards",
    "role-triggers": "list",
    "role-quotas": "list",
    "activity-boards": "list"
  };
  const sectionOf = (label) => {
    if ([dt("Dashboard"), dt("Design")].includes(label)) return dt("Essentials");
    if ([dt("Moderation"), dt("Appeals"), dt("Security")].includes(label)) return dt("Protection");
    if ([dt("Feeds"), dt("Integrations")].includes(label)) return dt("Connections");
    return dt("Engagement");
  };
  const partial = Boolean(Astro2.request.headers.get("x-dash-partial"));
  const dashVersion = String(Astro2.locals.dashVersion ?? "");
  const dashPending = Boolean(Astro2.locals.dashPending);
  const dashEtag = dashPending ? "" : String(Astro2.locals.dashPartialEtag ?? "");
  return renderTemplate`${partial ? renderTemplate`<html${addAttribute(dashLang, "lang")} data-astro-cid-w5hitrrz><head><meta charset="utf-8"><title>${`${pageTitle} \xB7 ${guildName} \xB7 Petto`}</title>${renderHead()}</head><body data-astro-cid-w5hitrrz><div class="dgl-content reveal" id="dgl-content"${addAttribute(dashVersion, "data-dash-v")}${addAttribute(dashEtag || void 0, "data-dash-etag")}${addAttribute(dashPending ? "" : void 0, "data-dash-fill")}${addAttribute(`--dgl-guild:${cssString(guildName)}`, "style")} data-astro-cid-w5hitrrz>${botIdentity && renderTemplate`<span hidden data-dp-bot${addAttribute(botIdentity.name, "data-name")}${addAttribute(botIdentity.icon ?? "", "data-icon")} data-astro-cid-w5hitrrz></span>`}${accessNotice && renderTemplate`<div class="dgl-dev-banner" data-astro-cid-w5hitrrz><div class="dgl-dev-text" data-astro-cid-w5hitrrz>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "16", "height": "16", "data-astro-cid-w5hitrrz": true })}<div data-astro-cid-w5hitrrz><strong data-astro-cid-w5hitrrz>${accessNotice}</strong></div></div></div>`}${roleAccess && pageAccess && pageAccess.allowed && !pageAccess.canEdit && renderTemplate`<div class="dgl-dev-banner" data-view-only data-astro-cid-w5hitrrz><div class="dgl-dev-text" data-astro-cid-w5hitrrz>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "16", "height": "16", "data-astro-cid-w5hitrrz": true })}<div data-astro-cid-w5hitrrz><strong data-astro-cid-w5hitrrz>${dt("View only")}</strong><span data-astro-cid-w5hitrrz>${dt("Your role can look at this part of the dashboard but not change it.")}</span></div></div></div>`}${devView && renderTemplate(_a || (_a = __template(['<div class="dgl-dev-banner dgl-support" data-dev-view data-support-mode', ' data-astro-cid-w5hitrrz><div class="dgl-dev-text" data-astro-cid-w5hitrrz>', "<div data-astro-cid-w5hitrrz><strong data-astro-cid-w5hitrrz>", "</strong><span data-astro-cid-w5hitrrz>", "</span><span data-astro-cid-w5hitrrz>", "</span><span data-astro-cid-w5hitrrz>", '</span></div></div><script type="application/json" data-support-policy>', '<\/script><div class="dgl-dev-actions" data-astro-cid-w5hitrrz><a class="btn btn-ghost btn-sm" href="/dash/admin/servers" data-astro-cid-w5hitrrz>', "", '</a><form method="POST" action="/dash/admin/servers" data-dev-leave', "", ' data-astro-cid-w5hitrrz><input type="hidden" name="action" value="leave" data-astro-cid-w5hitrrz><input type="hidden" name="guild_id"', ' data-astro-cid-w5hitrrz><button class="btn btn-danger btn-sm" type="submit" data-astro-cid-w5hitrrz>', "", "</button></form></div></div>"])), addAttribute(supportEditable ? "1" : "0", "data-support-editable"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:wrench-fill", "width": "16", "height": "16", "data-astro-cid-w5hitrrz": true }), dt("Support mode"), dt("You are looking at a server you do not manage. You can change the settings that fix errors (channels, messages and delays). Everything else is read-only, and every change you make is recorded for the admins of the server."), supportEditable ? dt("You can save the editable parts of this page.") : dt("This page is read-only in Support mode."), dt("Editable in Support mode: {list}.", { list: supportParts }), unescapeHTML(supportJson), renderComponent($$result, "Icon", $$Icon, { "name": "ph:hard-drives-fill", "width": "13", "height": "13", "data-astro-cid-w5hitrrz": true }), dt("All servers"), addAttribute(guildName, "data-guild-name"), addAttribute(dt("Remove Petto from {name}? The bot will leave the server.", { name: guildName }), "data-confirm"), addAttribute(guildId, "value"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:sign-out-fill", "width": "13", "height": "13", "data-astro-cid-w5hitrrz": true }), dt("Remove Petto"))}${renderSlot($$result, $$slots["default"])}</div></body></html>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${renderComponent($$result2, "Base", $$Base, { "title": `${pageTitle} \xB7 ${guildName} \xB7 Petto`, "active": "dash", "appShell": true, "hideNav": true, "data-astro-cid-w5hitrrz": true }, { "default": async ($$result3) => renderTemplate(_c || (_c = __template(['<main data-astro-cid-w5hitrrz><section class="dgl-sec" data-astro-cid-w5hitrrz><div class="wrap dgl-wrap" data-astro-cid-w5hitrrz><div class="dgl-layout" data-astro-cid-w5hitrrz><script type="application/json" id="dgl-role-labels">', '<\/script><div class="dgl-backdrop" id="dgl-backdrop" hidden data-astro-cid-w5hitrrz></div>', '<aside class="dgl-side" id="dgl-side" data-astro-cid-w5hitrrz><div class="dgl-drawer-head" data-astro-cid-w5hitrrz><button type="button" class="dgl-side-close" id="dgl-side-close"', " data-astro-cid-w5hitrrz>", "</button></div>", '<button type="button" class="dgl-resync" id="dgl-resync"', "", "", "", "", " data-astro-cid-w5hitrrz>", "<span data-astro-cid-w5hitrrz>", '</span></button><button type="button" class="dgl-mobile-toggle" id="dgl-mobile-toggle" aria-expanded="false" data-astro-cid-w5hitrrz><span data-astro-cid-w5hitrrz>', "", "</span>", '</button><nav class="dgl-nav" id="dgl-sidenav"', "", "", " data-astro-cid-w5hitrrz>", `</nav><script>
              // Which modules are on: a page of the menu whose module is off is drawn grey, one whose module is on has a green dot, and a section is grey when none of
              // its modules is on. The answer comes after the page is drawn (it takes a few small reads) and is kept for this tab, so the next page is drawn with the
              // last known state at once. A page with no on or off (Audit log, Permissions...) is not touched. A save asks again (the module may have changed).
              (function () {
                var nav = document.getElementById('dgl-sidenav');
                if (!nav) return;
                var url = nav.getAttribute('data-states-url');
                var KEY = 'dgl-module-states:' + url;
                var apply = function (states) {
                  var links = nav.querySelectorAll('a.dgl-link[data-modules]');
                  Array.prototype.forEach.call(nav.querySelectorAll('.dgl-group'), function (group) {
                    // The first page of a module in its section carries the dot; its other pages (voice leveling, ticket types...) only turn grey or not.
                    var seen = {};
                    Array.prototype.forEach.call(group.querySelectorAll('a.dgl-link[data-modules]'), function (link) {
                      var mods = link.getAttribute('data-modules').split(' ');
                      var fresh = mods.some(function (m) { return !seen[m]; });
                      mods.forEach(function (m) { seen[m] = true; });
                      if (fresh) link.setAttribute('data-main', ''); else link.removeAttribute('data-main');
                    });
                  });
                  Array.prototype.forEach.call(links, function (link) {
                    var known = link.getAttribute('data-modules').split(' ').filter(function (m) { return states[m]; });
                    if (!known.length) { link.removeAttribute('data-state'); return; }
                    link.setAttribute('data-state', known.some(function (m) { return states[m] === 'on'; }) ? 'on' : 'off');
                  });
                  Array.prototype.forEach.call(nav.querySelectorAll('.dgl-group'), function (group) {
                    var mine = group.querySelectorAll('a.dgl-link[data-state]');
                    if (!mine.length) { group.removeAttribute('data-state'); return; }
                    group.setAttribute('data-state', group.querySelector('a.dgl-link[data-state="on"]') ? 'on' : 'off');
                  });
                  nav.setAttribute('data-states', '1');
                };
                try { var saved = sessionStorage.getItem(KEY); if (saved) apply(JSON.parse(saved)); } catch (e) {}
                var load = function (fresh) {
                  fetch(url + (fresh ? '?fresh=1' : ''), { credentials: 'same-origin', headers: { Accept: 'application/json' } })
                    .then(function (res) { return res.ok ? res.json() : null; })
                    .then(function (data) {
                      if (!data || !data.states || !Object.keys(data.states).length) return;
                      apply(data.states);
                      try { sessionStorage.setItem(KEY, JSON.stringify(data.states)); } catch (e) {}
                    })
                    .catch(function () {});
                };
                load(false);
                var timer = 0;
                document.addEventListener('dgl:module-state', function () { clearTimeout(timer); timer = setTimeout(function () { load(true); }, 500); });
              })();
            <\/script><script>
              // Every part of the menu folds: all of it open is a very long list. What the person opens or folds is kept per server while they
              // stay in it (moving between its pages, a reload, the back button). Coming into a server (from the list of servers, another
              // server or a link from outside) starts with the first two parts unfolded (the everyday ones) and the part of the open page, so one
              // server's menu never shapes another's. This runs before the first paint, so nothing jumps.
              (function () {
                var nav = document.getElementById('dgl-sidenav');
                if (!nav) return;
                var guildOf = function (path) { var m = /^\\/(?:(?:es|pt-br)\\/)?dash\\/guild\\/(\\d+)(?:\\/|$)/.exec(path || ''); return m ? m[1] : ''; };
                var guild = guildOf(location.pathname);
                var KEY = 'dgl-nav-open:' + guild;
                var groups = Array.prototype.slice.call(nav.querySelectorAll('.dgl-group'));
                var inside = false;
                try {
                  var entry = performance.getEntriesByType('navigation')[0];
                  var kept = entry && (entry.type === 'reload' || entry.type === 'back_forward');
                  var from = document.referrer ? new URL(document.referrer) : null;
                  inside = kept || Boolean(from && from.origin === location.origin && guild && guildOf(from.pathname) === guild);
                } catch (e) { inside = false; }
                var saved = null;
                try {
                  sessionStorage.removeItem('dgl-nav-open');
                  if (!inside) sessionStorage.removeItem(KEY);
                  saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
                } catch (e) { saved = null; }
                var apply = function (group, open) {
                  group.classList.toggle('closed', !open);
                  var head = group.querySelector('.dgl-label');
                  if (head) head.setAttribute('aria-expanded', String(open));
                  var inner = group.querySelector('.dgl-items-inner');
                  if (inner) inner.inert = !open;
                };
                groups.forEach(function (group, index) {
                  var name = group.getAttribute('data-group');
                  var open = Array.isArray(saved) ? saved.indexOf(name) !== -1 : index < 2;
                  apply(group, open || group.classList.contains('has-active'));
                });
                var store = function () {
                  var open = groups.filter(function (g) { return !g.classList.contains('closed') && !g.classList.contains('folding'); }).map(function (g) { return g.getAttribute('data-group'); });
                  try { sessionStorage.setItem(KEY, JSON.stringify(open)); } catch (e) {}
                };
                if (!Array.isArray(saved)) store();
                // The first layout has no transition; the folding animates from then on.
                requestAnimationFrame(function () { requestAnimationFrame(function () { nav.classList.add('ready'); }); });
                // Opening or folding a part: its links come in (or fade out) and the parts under it slide to their new place, all with
                // opacity and transforms (dglMotion.flip), so the menu never animates its height.
                var toggle = function (group, open) {
                  var motion = window.dglMotion;
                  if (group._fold) { clearTimeout(group._fold); group._fold = 0; group.classList.remove('folding'); }
                  if (!motion || motion.reduced() || !nav.classList.contains('ready')) { apply(group, open); return; }
                  if (open) {
                    motion.flip(group, function () { apply(group, true); }, nav);
                    group.classList.remove('unfolding'); void group.offsetWidth; group.classList.add('unfolding');
                    clearTimeout(group._unfold);
                    group._unfold = setTimeout(function () { group.classList.remove('unfolding'); }, 600);
                  } else {
                    group.classList.remove('unfolding');
                    group.classList.add('folding');
                    group._fold = setTimeout(function () { group._fold = 0; group.classList.remove('folding'); motion.flip(group, function () { apply(group, false); }, nav); }, 130);
                  }
                };
                nav.addEventListener('click', function (event) {
                  var head = event.target.closest && event.target.closest('.dgl-label');
                  if (!head) return;
                  var group = head.closest('.dgl-group');
                  toggle(group, group.classList.contains('closed') || group.classList.contains('folding'));
                  store();
                });
                // Moving to a section by the menu (the page is not reloaded) opens the part it lives in.
                window.dglOpenGroupOf = function (link) {
                  var group = link && link.closest('.dgl-group');
                  if (!group) return;
                  groups.forEach(function (g) { g.classList.toggle('has-active', g === group); });
                  if (group.classList.contains('closed')) { toggle(group, true); store(); }
                };
              })();
            <\/script><script>
              // The side menu keeps where it was scrolled while the person stays in the same server: a reload, a tab that wakes up after a
              // while or the back button must not throw it to the top. Coming into a server (from the list of servers, another server, a link
              // from outside) starts it at the top. The position is kept per server, so one server's never moves another's menu.
              (function () {
                var nav = document.getElementById('dgl-sidenav');
                if (!nav) return;
                var KEY = 'dgl-sidenav-scroll';
                var guildOf = function (path) { var m = /^\\/(?:(?:es|pt-br)\\/)?dash\\/guild\\/(\\d+)(?:\\/|$)/.exec(path || ''); return m ? m[1] : ''; };
                var guild = guildOf(location.pathname);
                var fresh = true;
                try {
                  var entry = performance.getEntriesByType('navigation')[0];
                  var again = entry && (entry.type === 'reload' || entry.type === 'back_forward');
                  var from = document.referrer ? new URL(document.referrer) : null;
                  fresh = !again && !(from && from.origin === location.origin && guild && guildOf(from.pathname) === guild);
                } catch (e) { fresh = true; }
                var read = function () {
                  try {
                    var v = JSON.parse(sessionStorage.getItem(KEY) || 'null');
                    return v && v.g === guild && typeof v.y === 'number' ? v.y : null;
                  } catch (e) { return null; }
                };
                var save = function () { try { sessionStorage.setItem(KEY, JSON.stringify({ g: guild, y: nav.scrollTop })); } catch (e) {} };
                if (fresh) { try { sessionStorage.removeItem(KEY); } catch (e) {} }
                var showActive = function () {
                  var link = nav.querySelector('.dgl-link.active');
                  if (!link) return;
                  var box = nav.getBoundingClientRect();
                  var rect = link.getBoundingClientRect();
                  if (rect.top < box.top || rect.bottom > box.bottom) nav.scrollTop += (rect.top - box.top) - (box.height - rect.height) / 2;
                };
                var touched = false;
                // Nothing saved: a server just entered starts at the top; otherwise (the memory of the tab was lost) the open section is shown.
                var restore = function () { var saved = read(); if (saved !== null && !isNaN(saved)) nav.scrollTop = saved; else if (fresh) nav.scrollTop = 0; else showActive(); };
                restore();
                // The menu only has its final height once the page is laid out (before that it is as tall as its list and cannot scroll), so
                // the position is put back again while the page settles, until the person scrolls the menu themselves.
                // It stops as soon as the menu is where it was left (a few frames at most), and is not needed on a phone, where the menu is a
                // drawer that is closed while the page loads (the position is put back when the page has loaded).
                var tries = 0;
                var settled = 0;
                var settle = function () {
                  if (touched || tries++ > 12) return;
                  var saved = read();
                  if (saved === null || isNaN(saved)) return;
                  if (Math.abs(nav.scrollTop - Math.min(saved, nav.scrollHeight - nav.clientHeight)) > 1) { settled = 0; restore(); }
                  else if (++settled >= 2) return;
                  requestAnimationFrame(settle);
                };
                if (window.matchMedia && window.matchMedia('(min-width: 881px)').matches) requestAnimationFrame(settle);
                window.addEventListener('load', restore);
                ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (name) { nav.addEventListener(name, function () { touched = true; }, { passive: true }); });
                var timer = null;
                nav.addEventListener('scroll', function () { clearTimeout(timer); timer = setTimeout(save, 120); }, { passive: true });
                window.addEventListener('pagehide', save);
                document.addEventListener('visibilitychange', function () { if (document.hidden) save(); });
                window.addEventListener('pageshow', function (event) { if (event.persisted) restore(); });
              })();
            <\/script>`, '<div class="dgl-side-version"', " data-astro-cid-w5hitrrz>", '</div></aside><div class="dgl-main-col" data-astro-cid-w5hitrrz>', '<div class="dgl-content reveal" id="dgl-content"', "", "", "", " data-astro-cid-w5hitrrz>", "", "", "", "", "", "</div></div></div></div></section></main>", '<div class="dgl-progress" id="dgl-progress" data-astro-cid-w5hitrrz></div><div class="dgl-savebar" id="dgl-savebar" role="status" aria-live="polite" data-astro-cid-w5hitrrz>', '<span class="dgl-savebar-spin" aria-hidden="true" data-astro-cid-w5hitrrz></span>', "", '<span class="dgl-savebar-text" data-astro-cid-w5hitrrz>', '</span><div class="dgl-savebar-actions" data-astro-cid-w5hitrrz><button type="button" class="dgl-savebar-discard" data-savebar-discard data-astro-cid-w5hitrrz>', '</button><button type="button" class="dgl-savebar-save" data-savebar-save data-astro-cid-w5hitrrz>', '<kbd class="dgl-savebar-kbd" aria-hidden="true" data-astro-cid-w5hitrrz>Ctrl S</kbd></button></div></div>'], ['<main data-astro-cid-w5hitrrz><section class="dgl-sec" data-astro-cid-w5hitrrz><div class="wrap dgl-wrap" data-astro-cid-w5hitrrz><div class="dgl-layout" data-astro-cid-w5hitrrz><script type="application/json" id="dgl-role-labels">', '<\/script><div class="dgl-backdrop" id="dgl-backdrop" hidden data-astro-cid-w5hitrrz></div>', '<aside class="dgl-side" id="dgl-side" data-astro-cid-w5hitrrz><div class="dgl-drawer-head" data-astro-cid-w5hitrrz><button type="button" class="dgl-side-close" id="dgl-side-close"', " data-astro-cid-w5hitrrz>", "</button></div>", '<button type="button" class="dgl-resync" id="dgl-resync"', "", "", "", "", " data-astro-cid-w5hitrrz>", "<span data-astro-cid-w5hitrrz>", '</span></button><button type="button" class="dgl-mobile-toggle" id="dgl-mobile-toggle" aria-expanded="false" data-astro-cid-w5hitrrz><span data-astro-cid-w5hitrrz>', "", "</span>", '</button><nav class="dgl-nav" id="dgl-sidenav"', "", "", " data-astro-cid-w5hitrrz>", `</nav><script>
              // Which modules are on: a page of the menu whose module is off is drawn grey, one whose module is on has a green dot, and a section is grey when none of
              // its modules is on. The answer comes after the page is drawn (it takes a few small reads) and is kept for this tab, so the next page is drawn with the
              // last known state at once. A page with no on or off (Audit log, Permissions...) is not touched. A save asks again (the module may have changed).
              (function () {
                var nav = document.getElementById('dgl-sidenav');
                if (!nav) return;
                var url = nav.getAttribute('data-states-url');
                var KEY = 'dgl-module-states:' + url;
                var apply = function (states) {
                  var links = nav.querySelectorAll('a.dgl-link[data-modules]');
                  Array.prototype.forEach.call(nav.querySelectorAll('.dgl-group'), function (group) {
                    // The first page of a module in its section carries the dot; its other pages (voice leveling, ticket types...) only turn grey or not.
                    var seen = {};
                    Array.prototype.forEach.call(group.querySelectorAll('a.dgl-link[data-modules]'), function (link) {
                      var mods = link.getAttribute('data-modules').split(' ');
                      var fresh = mods.some(function (m) { return !seen[m]; });
                      mods.forEach(function (m) { seen[m] = true; });
                      if (fresh) link.setAttribute('data-main', ''); else link.removeAttribute('data-main');
                    });
                  });
                  Array.prototype.forEach.call(links, function (link) {
                    var known = link.getAttribute('data-modules').split(' ').filter(function (m) { return states[m]; });
                    if (!known.length) { link.removeAttribute('data-state'); return; }
                    link.setAttribute('data-state', known.some(function (m) { return states[m] === 'on'; }) ? 'on' : 'off');
                  });
                  Array.prototype.forEach.call(nav.querySelectorAll('.dgl-group'), function (group) {
                    var mine = group.querySelectorAll('a.dgl-link[data-state]');
                    if (!mine.length) { group.removeAttribute('data-state'); return; }
                    group.setAttribute('data-state', group.querySelector('a.dgl-link[data-state="on"]') ? 'on' : 'off');
                  });
                  nav.setAttribute('data-states', '1');
                };
                try { var saved = sessionStorage.getItem(KEY); if (saved) apply(JSON.parse(saved)); } catch (e) {}
                var load = function (fresh) {
                  fetch(url + (fresh ? '?fresh=1' : ''), { credentials: 'same-origin', headers: { Accept: 'application/json' } })
                    .then(function (res) { return res.ok ? res.json() : null; })
                    .then(function (data) {
                      if (!data || !data.states || !Object.keys(data.states).length) return;
                      apply(data.states);
                      try { sessionStorage.setItem(KEY, JSON.stringify(data.states)); } catch (e) {}
                    })
                    .catch(function () {});
                };
                load(false);
                var timer = 0;
                document.addEventListener('dgl:module-state', function () { clearTimeout(timer); timer = setTimeout(function () { load(true); }, 500); });
              })();
            <\/script><script>
              // Every part of the menu folds: all of it open is a very long list. What the person opens or folds is kept per server while they
              // stay in it (moving between its pages, a reload, the back button). Coming into a server (from the list of servers, another
              // server or a link from outside) starts with the first two parts unfolded (the everyday ones) and the part of the open page, so one
              // server's menu never shapes another's. This runs before the first paint, so nothing jumps.
              (function () {
                var nav = document.getElementById('dgl-sidenav');
                if (!nav) return;
                var guildOf = function (path) { var m = /^\\\\/(?:(?:es|pt-br)\\\\/)?dash\\\\/guild\\\\/(\\\\d+)(?:\\\\/|$)/.exec(path || ''); return m ? m[1] : ''; };
                var guild = guildOf(location.pathname);
                var KEY = 'dgl-nav-open:' + guild;
                var groups = Array.prototype.slice.call(nav.querySelectorAll('.dgl-group'));
                var inside = false;
                try {
                  var entry = performance.getEntriesByType('navigation')[0];
                  var kept = entry && (entry.type === 'reload' || entry.type === 'back_forward');
                  var from = document.referrer ? new URL(document.referrer) : null;
                  inside = kept || Boolean(from && from.origin === location.origin && guild && guildOf(from.pathname) === guild);
                } catch (e) { inside = false; }
                var saved = null;
                try {
                  sessionStorage.removeItem('dgl-nav-open');
                  if (!inside) sessionStorage.removeItem(KEY);
                  saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
                } catch (e) { saved = null; }
                var apply = function (group, open) {
                  group.classList.toggle('closed', !open);
                  var head = group.querySelector('.dgl-label');
                  if (head) head.setAttribute('aria-expanded', String(open));
                  var inner = group.querySelector('.dgl-items-inner');
                  if (inner) inner.inert = !open;
                };
                groups.forEach(function (group, index) {
                  var name = group.getAttribute('data-group');
                  var open = Array.isArray(saved) ? saved.indexOf(name) !== -1 : index < 2;
                  apply(group, open || group.classList.contains('has-active'));
                });
                var store = function () {
                  var open = groups.filter(function (g) { return !g.classList.contains('closed') && !g.classList.contains('folding'); }).map(function (g) { return g.getAttribute('data-group'); });
                  try { sessionStorage.setItem(KEY, JSON.stringify(open)); } catch (e) {}
                };
                if (!Array.isArray(saved)) store();
                // The first layout has no transition; the folding animates from then on.
                requestAnimationFrame(function () { requestAnimationFrame(function () { nav.classList.add('ready'); }); });
                // Opening or folding a part: its links come in (or fade out) and the parts under it slide to their new place, all with
                // opacity and transforms (dglMotion.flip), so the menu never animates its height.
                var toggle = function (group, open) {
                  var motion = window.dglMotion;
                  if (group._fold) { clearTimeout(group._fold); group._fold = 0; group.classList.remove('folding'); }
                  if (!motion || motion.reduced() || !nav.classList.contains('ready')) { apply(group, open); return; }
                  if (open) {
                    motion.flip(group, function () { apply(group, true); }, nav);
                    group.classList.remove('unfolding'); void group.offsetWidth; group.classList.add('unfolding');
                    clearTimeout(group._unfold);
                    group._unfold = setTimeout(function () { group.classList.remove('unfolding'); }, 600);
                  } else {
                    group.classList.remove('unfolding');
                    group.classList.add('folding');
                    group._fold = setTimeout(function () { group._fold = 0; group.classList.remove('folding'); motion.flip(group, function () { apply(group, false); }, nav); }, 130);
                  }
                };
                nav.addEventListener('click', function (event) {
                  var head = event.target.closest && event.target.closest('.dgl-label');
                  if (!head) return;
                  var group = head.closest('.dgl-group');
                  toggle(group, group.classList.contains('closed') || group.classList.contains('folding'));
                  store();
                });
                // Moving to a section by the menu (the page is not reloaded) opens the part it lives in.
                window.dglOpenGroupOf = function (link) {
                  var group = link && link.closest('.dgl-group');
                  if (!group) return;
                  groups.forEach(function (g) { g.classList.toggle('has-active', g === group); });
                  if (group.classList.contains('closed')) { toggle(group, true); store(); }
                };
              })();
            <\/script><script>
              // The side menu keeps where it was scrolled while the person stays in the same server: a reload, a tab that wakes up after a
              // while or the back button must not throw it to the top. Coming into a server (from the list of servers, another server, a link
              // from outside) starts it at the top. The position is kept per server, so one server's never moves another's menu.
              (function () {
                var nav = document.getElementById('dgl-sidenav');
                if (!nav) return;
                var KEY = 'dgl-sidenav-scroll';
                var guildOf = function (path) { var m = /^\\\\/(?:(?:es|pt-br)\\\\/)?dash\\\\/guild\\\\/(\\\\d+)(?:\\\\/|$)/.exec(path || ''); return m ? m[1] : ''; };
                var guild = guildOf(location.pathname);
                var fresh = true;
                try {
                  var entry = performance.getEntriesByType('navigation')[0];
                  var again = entry && (entry.type === 'reload' || entry.type === 'back_forward');
                  var from = document.referrer ? new URL(document.referrer) : null;
                  fresh = !again && !(from && from.origin === location.origin && guild && guildOf(from.pathname) === guild);
                } catch (e) { fresh = true; }
                var read = function () {
                  try {
                    var v = JSON.parse(sessionStorage.getItem(KEY) || 'null');
                    return v && v.g === guild && typeof v.y === 'number' ? v.y : null;
                  } catch (e) { return null; }
                };
                var save = function () { try { sessionStorage.setItem(KEY, JSON.stringify({ g: guild, y: nav.scrollTop })); } catch (e) {} };
                if (fresh) { try { sessionStorage.removeItem(KEY); } catch (e) {} }
                var showActive = function () {
                  var link = nav.querySelector('.dgl-link.active');
                  if (!link) return;
                  var box = nav.getBoundingClientRect();
                  var rect = link.getBoundingClientRect();
                  if (rect.top < box.top || rect.bottom > box.bottom) nav.scrollTop += (rect.top - box.top) - (box.height - rect.height) / 2;
                };
                var touched = false;
                // Nothing saved: a server just entered starts at the top; otherwise (the memory of the tab was lost) the open section is shown.
                var restore = function () { var saved = read(); if (saved !== null && !isNaN(saved)) nav.scrollTop = saved; else if (fresh) nav.scrollTop = 0; else showActive(); };
                restore();
                // The menu only has its final height once the page is laid out (before that it is as tall as its list and cannot scroll), so
                // the position is put back again while the page settles, until the person scrolls the menu themselves.
                // It stops as soon as the menu is where it was left (a few frames at most), and is not needed on a phone, where the menu is a
                // drawer that is closed while the page loads (the position is put back when the page has loaded).
                var tries = 0;
                var settled = 0;
                var settle = function () {
                  if (touched || tries++ > 12) return;
                  var saved = read();
                  if (saved === null || isNaN(saved)) return;
                  if (Math.abs(nav.scrollTop - Math.min(saved, nav.scrollHeight - nav.clientHeight)) > 1) { settled = 0; restore(); }
                  else if (++settled >= 2) return;
                  requestAnimationFrame(settle);
                };
                if (window.matchMedia && window.matchMedia('(min-width: 881px)').matches) requestAnimationFrame(settle);
                window.addEventListener('load', restore);
                ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (name) { nav.addEventListener(name, function () { touched = true; }, { passive: true }); });
                var timer = null;
                nav.addEventListener('scroll', function () { clearTimeout(timer); timer = setTimeout(save, 120); }, { passive: true });
                window.addEventListener('pagehide', save);
                document.addEventListener('visibilitychange', function () { if (document.hidden) save(); });
                window.addEventListener('pageshow', function (event) { if (event.persisted) restore(); });
              })();
            <\/script>`, '<div class="dgl-side-version"', " data-astro-cid-w5hitrrz>", '</div></aside><div class="dgl-main-col" data-astro-cid-w5hitrrz>', '<div class="dgl-content reveal" id="dgl-content"', "", "", "", " data-astro-cid-w5hitrrz>", "", "", "", "", "", "</div></div></div></div></section></main>", '<div class="dgl-progress" id="dgl-progress" data-astro-cid-w5hitrrz></div><div class="dgl-savebar" id="dgl-savebar" role="status" aria-live="polite" data-astro-cid-w5hitrrz>', '<span class="dgl-savebar-spin" aria-hidden="true" data-astro-cid-w5hitrrz></span>', "", '<span class="dgl-savebar-text" data-astro-cid-w5hitrrz>', '</span><div class="dgl-savebar-actions" data-astro-cid-w5hitrrz><button type="button" class="dgl-savebar-discard" data-savebar-discard data-astro-cid-w5hitrrz>', '</button><button type="button" class="dgl-savebar-save" data-savebar-save data-astro-cid-w5hitrrz>', '<kbd class="dgl-savebar-kbd" aria-hidden="true" data-astro-cid-w5hitrrz>Ctrl S</kbd></button></div></div>'])), unescapeHTML(roleBlockLabels), renderComponent($$result3, "DashServerRail", $$DashServerRail, { "user": user, "guilds": switcherGuilds, "activeGuildId": guildId, "data-astro-cid-w5hitrrz": true }), addAttribute(dt("Close the menu"), "aria-label"), renderComponent($$result3, "Icon", $$Icon, { "name": "ph:x", "width": "16", "height": "16", "data-astro-cid-w5hitrrz": true }), renderComponent($$result3, "DashSideHead", $$DashSideHead, { "kind": "guild", "name": guildName, "icon": guildIcon && !guildIcon.includes("/assets/mascot-icon") ? guildIcon : null, "art": headerArt, "premium": resolvedPremiumActive, "data-astro-cid-w5hitrrz": true }), addAttribute(`/dash/guild/${guildId}/resync-api`, "data-url"), addAttribute(dt("Syncing\u2026"), "data-busy"), addAttribute(dt("Synced"), "data-done"), addAttribute(dt("Could not sync. Try again."), "data-failed"), addAttribute(dt("Reload the roles, channels and server data from Discord"), "title"), renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrows-clockwise-fill", "width": "14", "height": "14", "data-astro-cid-w5hitrrz": true }), dt("Sync server data"), stableInlineItems.has(activeNavItem?.id ?? "") ? renderTemplate`${renderComponent($$result3, "InlineIcon", $$InlineIcon, { "name": activeNavItem?.icon ?? "ph:squares-four-fill", "width": "15", "height": "15", "data-astro-cid-w5hitrrz": true })}` : renderTemplate`${renderComponent($$result3, "Icon", $$Icon, { "name": activeNavItem?.icon ?? "ph:squares-four-fill", "width": "15", "height": "15", "data-astro-cid-w5hitrrz": true })}`, activeNavItem?.label ?? pageTitle, renderComponent($$result3, "Icon", $$Icon, { "name": "ph:caret-down", "width": "14", "height": "14", "class": "dgl-mobile-toggle-caret", "data-astro-cid-w5hitrrz": true }), addAttribute(`/dash/guild/${guildId}/module-states`, "data-states-url"), addAttribute(dt("On"), "data-on-label"), addAttribute(dt("Off"), "data-off-label"), groups.map((group, index) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate`${(index === 0 || sectionOf(groups[index - 1].label) !== sectionOf(group.label)) && renderTemplate`<div class="dgl-section-title" data-astro-cid-w5hitrrz>${sectionOf(group.label)}</div>`}<div${addAttribute(["dgl-group", { "has-active": group.items.some((item) => item.id === active) }], "class:list")}${addAttribute(group.label, "data-group")}${addAttribute(group.important ? "" : void 0, "data-important")} data-astro-cid-w5hitrrz><button type="button" class="dgl-label" aria-expanded="true" data-astro-cid-w5hitrrz><span class="dgl-label-tile" data-astro-cid-w5hitrrz>${renderComponent($$result4, "Icon", $$Icon, { "name": group.icon, "width": "14", "height": "14", "class": "dgl-label-icon", "data-astro-cid-w5hitrrz": true })}</span><span data-astro-cid-w5hitrrz>${group.label}</span><i class="dgl-state dgl-group-state" aria-hidden="true" data-astro-cid-w5hitrrz></i>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:caret-down", "width": "12", "height": "12", "class": "dgl-label-caret", "data-astro-cid-w5hitrrz": true })}</button><div class="dgl-items" data-astro-cid-w5hitrrz><div class="dgl-items-inner" data-astro-cid-w5hitrrz>${group.items.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(item.color ? `--nav-c:${item.color}` : void 0, "style")}${addAttribute(item.full ? "" : void 0, "data-full")}${addAttribute(item.label, "data-label")}${addAttribute(navModulesOf(item.id).join(" ") || void 0, "data-modules")}${addAttribute(skeletonOf[item.id] ?? "form", "data-sk")}${addAttribute(["dgl-link", { active: active === item.id, "dgl-feature": Boolean(item.isNew || item.beta) }], "class:list")}${addAttribute(active === item.id ? "page" : void 0, "aria-current")}${addAttribute(item.premium && !resolvedPremiumActive ? `${item.label}, Premium required` : void 0, "aria-label")}${addAttribute(item.lock && !resolvedPremiumActive ? item.label : void 0, "data-premium-lock")} data-astro-cid-w5hitrrz>${stableInlineItems.has(item.id) ? renderTemplate`${renderComponent($$result4, "InlineIcon", $$InlineIcon, { "name": item.icon, "width": "15", "height": "15", "data-astro-cid-w5hitrrz": true })}` : renderTemplate`${renderComponent($$result4, "Icon", $$Icon, { "name": item.icon, "width": "15", "height": "15", "data-astro-cid-w5hitrrz": true })}`}<span class="dgl-link-text" data-astro-cid-w5hitrrz>${item.label}</span>${item.isNew && renderTemplate`<span class="vx-duck-pill vx-duck-new"${addAttribute(dt("New"), "title")} data-astro-cid-w5hitrrz><img src="/assets/petto-emblem.svg" alt="" class="vx-duck-ico" draggable="false" data-astro-cid-w5hitrrz><span class="vx-duck-label" data-astro-cid-w5hitrrz>${dt("New")}</span></span>`}${item.beta && renderTemplate`<span class="vx-duck-pill vx-duck-beta"${addAttribute(dt("Beta"), "title")} data-astro-cid-w5hitrrz><img src="/assets/petto-emblem.svg" alt="" class="vx-duck-ico" draggable="false" data-astro-cid-w5hitrrz><span class="vx-duck-label" data-astro-cid-w5hitrrz>${dt("Beta")}</span></span>`}${item.isUpdated && renderTemplate`<span class="vx-duck-pill vx-duck-upd"${addAttribute(dt("Updated"), "title")} data-astro-cid-w5hitrrz><img src="/assets/petto-emblem.svg" alt="" class="vx-duck-ico" draggable="false" data-astro-cid-w5hitrrz><span class="vx-duck-label" data-astro-cid-w5hitrrz>${dt("Updated")}</span></span>`}${item.soon && renderTemplate`<em class="dgl-new dgl-soon"${addAttribute(dt("Soon"), "title")} data-astro-cid-w5hitrrz>${dt("Soon")}</em>`}${item.maintenance && renderTemplate`<em class="dgl-new dgl-soon dgl-badge-icon"${addAttribute(dt("Maintenance"), "title")}${addAttribute(dt("Maintenance"), "aria-label")} role="img" data-astro-cid-w5hitrrz>${renderComponent($$result4, "Icon", $$Icon, { "name": "ph:wrench-fill", "width": "11", "height": "11", "data-astro-cid-w5hitrrz": true })}</em>`}${item.premium && renderTemplate`<span class="vx-duck-pill vx-duck-prem" title="Premium" data-astro-cid-w5hitrrz><img src="/assets/petto-emblem.svg" alt="" class="vx-duck-ico" draggable="false" data-astro-cid-w5hitrrz><span class="vx-duck-label" data-astro-cid-w5hitrrz>Premium</span></span>`}${navModulesOf(item.id).length > 0 && renderTemplate`<i class="dgl-state" aria-hidden="true" data-astro-cid-w5hitrrz></i>`}</a>`)}</div></div></div>` })}`), renderComponent($$result3, "DashUserCard", $$DashUserCard, { "user": user, "data-astro-cid-w5hitrrz": true }), addAttribute(buildTitle(), "title"), buildLabel(), renderComponent($$result3, "DashTopBar", $$DashTopBar, { "kind": "guild", "contextName": guildName, "contextIcon": guildIcon && !guildIcon.includes("/assets/mascot-icon") ? guildIcon : null, "pageLabel": dt(activeNavItem?.label ?? pageTitle), "user": { username: user.username, avatar: user.avatar }, "menuBtnId": "dgl-menu-btn", "sideId": "dgl-side", "data-astro-cid-w5hitrrz": true }), addAttribute(dashVersion, "data-dash-v"), addAttribute(dashEtag || void 0, "data-dash-etag"), addAttribute(dashPending ? "" : void 0, "data-dash-fill"), addAttribute(`--dgl-guild:${cssString(guildName)}`, "style"), botIdentity && renderTemplate`<span hidden data-dp-bot${addAttribute(botIdentity.name, "data-name")}${addAttribute(botIdentity.icon ?? "", "data-icon")} data-astro-cid-w5hitrrz></span>`, accessNotice && renderTemplate`<div class="dgl-dev-banner" data-astro-cid-w5hitrrz><div class="dgl-dev-text" data-astro-cid-w5hitrrz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "16", "height": "16", "data-astro-cid-w5hitrrz": true })}<div data-astro-cid-w5hitrrz><strong data-astro-cid-w5hitrrz>${accessNotice}</strong></div></div></div>`, roleAccess && pageAccess && pageAccess.allowed && !pageAccess.canEdit && renderTemplate`<div class="dgl-dev-banner" data-view-only data-astro-cid-w5hitrrz><div class="dgl-dev-text" data-astro-cid-w5hitrrz>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "16", "height": "16", "data-astro-cid-w5hitrrz": true })}<div data-astro-cid-w5hitrrz><strong data-astro-cid-w5hitrrz>${dt("View only")}</strong><span data-astro-cid-w5hitrrz>${dt("Your role can look at this part of the dashboard but not change it.")}</span></div></div></div>`, devView && renderTemplate(_b || (_b = __template(['<div class="dgl-dev-banner dgl-support" data-dev-view data-support-mode', ' data-astro-cid-w5hitrrz><div class="dgl-dev-text" data-astro-cid-w5hitrrz>', "<div data-astro-cid-w5hitrrz><strong data-astro-cid-w5hitrrz>", "</strong><span data-astro-cid-w5hitrrz>", "</span><span data-astro-cid-w5hitrrz>", "</span><span data-astro-cid-w5hitrrz>", '</span></div></div><script type="application/json" data-support-policy>', '<\/script><div class="dgl-dev-actions" data-astro-cid-w5hitrrz><a class="btn btn-ghost btn-sm" href="/dash/admin/servers" data-astro-cid-w5hitrrz>', "", '</a><form method="POST" action="/dash/admin/servers" data-dev-leave', "", ' data-astro-cid-w5hitrrz><input type="hidden" name="action" value="leave" data-astro-cid-w5hitrrz><input type="hidden" name="guild_id"', ' data-astro-cid-w5hitrrz><button class="btn btn-danger btn-sm" type="submit" data-astro-cid-w5hitrrz>', "", "</button></form></div></div>"])), addAttribute(supportEditable ? "1" : "0", "data-support-editable"), renderComponent($$result3, "Icon", $$Icon, { "name": "ph:wrench-fill", "width": "16", "height": "16", "data-astro-cid-w5hitrrz": true }), dt("Support mode"), dt("You are looking at a server you do not manage. You can change the settings that fix errors (channels, messages and delays). Everything else is read-only, and every change you make is recorded for the admins of the server."), supportEditable ? dt("You can save the editable parts of this page.") : dt("This page is read-only in Support mode."), dt("Editable in Support mode: {list}.", { list: supportParts }), unescapeHTML(supportJson), renderComponent($$result3, "Icon", $$Icon, { "name": "ph:hard-drives-fill", "width": "13", "height": "13", "data-astro-cid-w5hitrrz": true }), dt("All servers"), addAttribute(guildName, "data-guild-name"), addAttribute(dt("Remove Petto from {name}? The bot will leave the server.", { name: guildName }), "data-confirm"), addAttribute(guildId, "value"), renderComponent($$result3, "Icon", $$Icon, { "name": "ph:sign-out-fill", "width": "13", "height": "13", "data-astro-cid-w5hitrrz": true }), dt("Remove Petto")), renderSlot($$result3, $$slots["default"]), renderComponent($$result3, "DashGuildFooter", $$DashGuildFooter, { "guildId": guildId, "data-astro-cid-w5hitrrz": true }), renderComponent($$result3, "DashServerSheet", $$DashServerSheet, { "user": { name: user.username, avatar: user.avatar }, "profileHref": "/dash/me", "currentId": guildId, "servers": switcherGuilds, "invites": switcherInvites, "owner": Boolean(user.userId) && isPettoOwner(Astro2, user.userId), "data-astro-cid-w5hitrrz": true }), renderComponent($$result3, "Icon", $$Icon, { "name": "ph:floppy-disk-fill", "width": "20", "height": "20", "class": "dgl-savebar-icon", "data-astro-cid-w5hitrrz": true }), renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "20", "height": "20", "class": "dgl-savebar-done", "data-astro-cid-w5hitrrz": true }), renderComponent($$result3, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "20", "height": "20", "class": "dgl-savebar-err", "data-astro-cid-w5hitrrz": true }), dt("You have unsaved changes"), dt("Discard"), dt("Save changes")) })}${renderComponent($$result2, "DashClientI18n", $$DashClientI18N, { "data-astro-cid-w5hitrrz": true })}${renderComponent($$result2, "DashMotion", $$DashMotion, { "data-astro-cid-w5hitrrz": true })}${renderComponent($$result2, "DashTemplateLock", $$DashTemplateLock, { "data-astro-cid-w5hitrrz": true })}${renderComponent($$result2, "DashToast", $$DashToast, { "data-astro-cid-w5hitrrz": true })}${renderComponent($$result2, "DashConfirm", $$DashConfirm, { "data-astro-cid-w5hitrrz": true })}${renderComponent($$result2, "PremiumRequiredModal", $$PremiumRequiredModal, { "open": Boolean(premiumRequired), "feature": premiumRequired, "cancelHref": premiumRequired ? `/dash/guild/${guildId}/overview` : "", "premiumHref": `/dash/premium?guild_id=${guildId}`, "data-astro-cid-w5hitrrz": true })}${renderComponent($$result2, "DashLoading", $$DashLoading, { "data-astro-cid-w5hitrrz": true })}${renderComponent($$result2, "DashBotWait", $$DashBotWait, { "data-astro-cid-w5hitrrz": true })}${renderComponent($$result2, "DashAutocomplete", $$DashAutocomplete, { "data-astro-cid-w5hitrrz": true })}${renderComponent($$result2, "DashPreviews", $$DashPreviews, { "user": user, "guildName": guildName, "guildIcon": guildIcon, "data-astro-cid-w5hitrrz": true })}${renderComponent($$result2, "DashSelectMenu", $$DashSelectMenu, { "data-astro-cid-w5hitrrz": true })}${renderComponent($$result2, "DashKeepPlace", $$DashKeepPlace, { "data-astro-cid-w5hitrrz": true })}` })}`}`;
}, "/home/runner/work/petto-web/petto-web/src/components/DashGuildLayout.astro", void 0);

export { $$DashGuildLayout as $, $$DashBotWait as a, canUseRollouts as b, canUseQuests as c, vanityAction as d, forumsReady as f, getVanityOverview as g, vanityConfig as v };
