import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, d as renderComponent, F as Fragment } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import { b as $$InlineIcon } from './Base_Di2YHjFe.mjs';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                          */
import { l as localePath } from './ui_C1MR3LHJ.mjs';
import { u as userCardData } from './dashAuth_uqFK7-ED.mjs';

// The icon of a server that has none: its first letter on a color taken from its name, so the same server always looks the same.
// Plain JavaScript so scripts/check-dash-profile.mjs can run it with node alone.

/** The first letter (or digit) of a server name, upper case, or "?" when there is none. @param {unknown} name */
function guildLetter(name) {
  const text = typeof name === 'string' ? name.trim() : '';
  const match = /[\p{L}\p{N}]/u.exec(text);
  return match ? match[0].toLocaleUpperCase() : '?';
}

/** The same color for the same name: a hue from 0 to 359. @param {unknown} name */
function guildHue(name) {
  const text = typeof name === 'string' ? name : '';
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return hash % 360;
}

/** The inline style of the letter tile (calm, readable white text on it). @param {unknown} name */
function guildLetterStyle(name) {
  const hue = guildHue(name);
  return `background:linear-gradient(135deg,hsl(${hue} 46% 44%),hsl(${(hue + 28) % 360} 46% 34%));color:#fff;`;
}

const $$Astro$4 = createAstro("https://petto.sbs");
const $$DashSideHead = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$DashSideHead;
  const { kind, name, icon, art, premium = false, decoration = null, size = "compact", handle = null } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const tint = art.kind === "color" ? `--sh-tint:${art.color}` : void 0;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["sh", `sh-${kind}`, { "sh-roomy": size === "roomy" }], "class:list")} data-sh data-astro-cid-uhl24oi3> <div${addAttribute(["sh-art", `sh-art-${art.kind}`], "class:list")}${addAttribute(tint, "style")} aria-hidden="true" data-astro-cid-uhl24oi3> ${art.kind === "image" && renderTemplate`<picture data-astro-cid-uhl24oi3> ${art.animated && renderTemplate`<source media="(prefers-reduced-motion: reduce)"${addAttribute(art.still, "srcset")} data-astro-cid-uhl24oi3>`} <img class="sh-art-img"${addAttribute(art.animated ?? art.still, "src")} alt="" width="300" height="88" loading="eager" decoding="sync" referrerpolicy="no-referrer" data-astro-cid-uhl24oi3> </picture>`} ${art.kind === "art" && renderTemplate`<img class="sh-art-img sh-art-petto" src="/assets/banner-default.webp" alt="" width="300" height="88" loading="eager" decoding="sync" draggable="false" data-astro-cid-uhl24oi3>`} </div> <div class="sh-icon" data-astro-cid-uhl24oi3> ${icon ? renderTemplate`<img class="sh-icon-img"${addAttribute(icon, "src")} alt=""${addAttribute(size === "roomy" ? 80 : 56, "width")}${addAttribute(size === "roomy" ? 80 : 56, "height")} loading="eager" decoding="sync" referrerpolicy="no-referrer" data-astro-cid-uhl24oi3>` : kind === "guild" ? renderTemplate`<span class="sh-icon-img sh-icon-fallback sh-letter"${addAttribute(guildLetterStyle(name), "style")} data-astro-cid-uhl24oi3>${guildLetter(name)}</span>` : renderTemplate`<span class="sh-icon-img sh-icon-fallback" data-astro-cid-uhl24oi3>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:user-fill", "width": "22", "height": "22", "data-astro-cid-uhl24oi3": true })}</span>`} ${decoration?.animated && renderTemplate`<picture class="sh-deco" data-astro-cid-uhl24oi3> ${decoration.still && renderTemplate`<source media="(prefers-reduced-motion: reduce)"${addAttribute(decoration.still, "srcset")} data-astro-cid-uhl24oi3>`} <img${addAttribute(decoration.animated, "src")} alt="" width="68" height="68" loading="eager" decoding="sync" data-astro-cid-uhl24oi3> </picture>`} </div> <div class="sh-name" data-astro-cid-uhl24oi3><strong${addAttribute(name, "title")} data-astro-cid-uhl24oi3>${name}</strong>${premium && renderTemplate`<span class="sh-premium" data-astro-cid-uhl24oi3>${renderComponent($$result, "InlineIcon", $$InlineIcon, { "name": "ph:crown-fill", "width": "11", "height": "11", "data-astro-cid-uhl24oi3": true })}Premium</span>`}</div> ${handle && renderTemplate`<div class="sh-handle"${addAttribute(`@${handle}`, "title")} data-astro-cid-uhl24oi3>@${handle}</div>`} <button type="button" class="sh-select" data-sheet-open aria-haspopup="dialog" aria-expanded="false" aria-controls="ds-sheet" data-astro-cid-uhl24oi3> ${renderComponent($$result, "Icon", $$Icon, { "name": "ph:hard-drives-fill", "width": "14", "height": "14", "data-astro-cid-uhl24oi3": true })} <span data-astro-cid-uhl24oi3>${kind === "guild" ? dt("Switch server") : dt("Select a server")}</span> ${renderComponent($$result, "Icon", $$Icon, { "name": "ph:caret-up-down", "width": "13", "height": "13", "data-astro-cid-uhl24oi3": true })} </button> </div>  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashSideHead.astro", void 0);

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$Astro$3 = createAstro("https://petto.sbs");
const $$DashServerRail = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$DashServerRail;
  const { user, guilds, activeGuildId = "" } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const onProfile = !activeGuildId;
  const dashTip = dt("Your dashboard");
  return renderTemplate(_a$2 || (_a$2 = __template$2(["", '<nav class="vx-rail" id="vx-rail"', '> <a href="/dash/me"', "", "", "", '> <i class="vx-rail-pill" aria-hidden="true"></i> ', ' </a> <div class="vx-rail-sep" aria-hidden="true"></div> <div class="vx-rail-list"> ', ' <button type="button" class="vx-rail-item vx-rail-add" data-sheet-open', ' aria-haspopup="dialog" aria-expanded="false" aria-controls="ds-sheet"', "> ", ` </button> </div> </nav> <div class="vx-rail-tip" id="vx-rail-tip" role="tooltip" hidden></div> <script>
  (function () {
    var rail = document.getElementById('vx-rail');
    var tip = document.getElementById('vx-rail-tip');
    if (!rail || !tip || rail.dataset.tipBound) return;
    rail.dataset.tipBound = '1';
    function show(el) {
      var text = el.getAttribute('data-tip');
      if (!text) return;
      var prem = el.getAttribute('data-tip-prem') === '1';
      tip.textContent = '';
      var span = document.createElement('span');
      span.textContent = text;
      tip.appendChild(span);
      if (prem) {
        var badge = document.createElement('em');
        badge.className = 'vx-rail-tip-prem';
        badge.textContent = 'Premium';
        tip.appendChild(badge);
      }
      var r = el.getBoundingClientRect();
      tip.style.left = Math.round(r.right + 12) + 'px';
      tip.style.top = Math.round(r.top + r.height / 2) + 'px';
      tip.hidden = false;
      requestAnimationFrame(function () { tip.classList.add('on'); });
    }
    function hide() {
      tip.classList.remove('on');
      tip.hidden = true;
    }
    rail.addEventListener('pointerover', function (e) {
      var item = e.target && e.target.closest ? e.target.closest('.vx-rail-item[data-tip]') : null;
      if (item) show(item);
    });
    rail.addEventListener('pointerout', function (e) {
      var item = e.target && e.target.closest ? e.target.closest('.vx-rail-item[data-tip]') : null;
      if (item) hide();
    });
    rail.addEventListener('scroll', hide, { passive: true });
  })();
<\/script>`])), maybeRenderHead(), addAttribute(dt("Servers"), "aria-label"), addAttribute(["vx-rail-item vx-rail-me", { active: onProfile }], "class:list"), addAttribute(dashTip, "data-tip"), addAttribute(dashTip, "aria-label"), addAttribute(onProfile ? "page" : void 0, "aria-current"), user.avatar ? renderTemplate`<img${addAttribute(user.avatar, "src")} alt="" width="44" height="44" referrerpolicy="no-referrer" draggable="false">` : renderTemplate`<span class="vx-rail-fallback">${renderComponent($$result, "Icon", $$Icon, { "name": "ph:user-fill", "width": "20", "height": "20" })}</span>`, guilds.map((g) => {
    const isActive = g.id === activeGuildId;
    return renderTemplate`<a${addAttribute(`/dash/guild/${g.id}/overview`, "href")}${addAttribute(["vx-rail-item", { active: isActive }], "class:list")}${addAttribute(g.name, "data-tip")}${addAttribute(g.premium ? "1" : void 0, "data-tip-prem")}${addAttribute(g.name, "aria-label")}${addAttribute(isActive ? "page" : void 0, "aria-current")}> <i class="vx-rail-pill" aria-hidden="true"></i> ${g.icon ? renderTemplate`<img${addAttribute(g.icon, "src")} alt="" width="44" height="44" loading="lazy" referrerpolicy="no-referrer" draggable="false">` : renderTemplate`<span class="vx-rail-letter"${addAttribute(guildLetterStyle(g.name), "style")}>${guildLetter(g.name)}</span>`} </a>`;
  }), addAttribute(dt("Add a server"), "data-tip"), addAttribute(dt("Add a server"), "aria-label"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:plus", "width": "20", "height": "20" }));
}, "/home/runner/work/petto-web/petto-web/src/components/DashServerRail.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$2 = createAstro("https://petto.sbs");
const $$DashTopBar = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$DashTopBar;
  const { kind, contextName, contextIcon, pageLabel, user, menuBtnId, sideId } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const base = localePath[lang];
  const langOptions = [
    { code: "en", label: "English", flag: "/assets/flags/us.svg" },
    { code: "es", label: "Espa\xF1ol", flag: "/assets/flags/es.svg" },
    { code: "pt-BR", label: "Portugu\xEAs (Brasil)", flag: "/assets/flags/br.svg" }
  ];
  const langNow = langOptions.find((o) => o.code === lang) ?? langOptions[0];
  const languageHref = (target) => `/dash/lang?to=${encodeURIComponent(target)}&next=${encodeURIComponent(Astro2.url.pathname + Astro2.url.search)}`;
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<header class="dtb" data-dtb data-astro-cid-734jdita> <div class="dtb-left" data-astro-cid-734jdita> <button type="button" class="dtb-burger dash-menu-btn"', "", ' aria-expanded="false"', " data-astro-cid-734jdita> ", ' </button> <button type="button" class="dtb-ctx" data-sheet-open aria-haspopup="dialog" aria-expanded="false" aria-controls="ds-sheet"', " data-astro-cid-734jdita> <span", " data-astro-cid-734jdita> ", ' </span> <span class="dtb-ctx-name" data-astro-cid-734jdita>', "</span> </button> ", ' <span class="dtb-page"', " data-astro-cid-734jdita>", '</span> </div> <div class="dtb-center" data-astro-cid-734jdita> <button type="button" class="dtb-search" id="dgl-find"', "", "", "", "", ' aria-haspopup="dialog"', " data-astro-cid-734jdita> ", ' <span class="dtb-search-text" data-astro-cid-734jdita>', '</span> <kbd class="dtb-search-kbd" aria-hidden="true" data-astro-cid-734jdita>/</kbd> </button> </div> <div class="dtb-right" data-astro-cid-734jdita> <div class="dtb-pop" data-dtb-pop data-astro-cid-734jdita> <button type="button" class="dtb-lang-btn" data-dtb-trigger aria-haspopup="menu" aria-expanded="false"', ' data-astro-cid-734jdita> <img class="dtb-flag"', ' alt="" width="20" height="14" data-astro-cid-734jdita> <span class="dtb-lang-text" data-astro-cid-734jdita>', "</span> ", ' </button> <div class="dtb-menu dtb-menu-lang" role="menu" data-astro-cid-734jdita> ', ' </div> </div> <div class="dtb-pop" data-dtb-pop data-astro-cid-734jdita> <button type="button" class="dtb-icon-btn" data-dtb-trigger aria-haspopup="menu" aria-expanded="false"', "", " data-astro-cid-734jdita> ", ' </button> <div class="dtb-menu dtb-menu-help" role="menu" data-astro-cid-734jdita> <div class="dtb-menu-head" data-astro-cid-734jdita> <img src="/assets/mascot-icon.webp" alt="" width="22" height="22" data-astro-cid-734jdita> <span data-astro-cid-734jdita>Petto</span> </div> <div class="dtb-sep-line" role="separator" data-astro-cid-734jdita></div> <a role="menuitem" class="dtb-item" href="https://wiki.petto.sbs" target="_blank" rel="noopener" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", "</span></span> ", ' </a> <a role="menuitem" class="dtb-item" href="https://petto.sbs/support" target="_blank" rel="noopener" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", "</span></span> ", ' </a> <a role="menuitem" class="dtb-item"', ' data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> <a role="menuitem" class="dtb-item"', ' data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> <a role="menuitem" class="dtb-item"', ' data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> <span class="dtb-status-dot" aria-hidden="true" data-astro-cid-734jdita></span> </a> <div class="dtb-sep-line" role="separator" data-astro-cid-734jdita></div> <a role="menuitem" class="dtb-item"', ' data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> </div> </div> <button type="button" class="dtb-icon-btn" id="dtbThemeToggle"', "", " data-astro-cid-734jdita> ", " ", ' </button> <div class="dtb-pop" data-dtb-pop data-astro-cid-734jdita> <button type="button" class="dtb-icon-btn" data-dtb-trigger aria-haspopup="menu" aria-expanded="false"', "", " data-astro-cid-734jdita> ", ' </button> <div class="dtb-menu dtb-menu-account" role="menu" data-astro-cid-734jdita> <div class="dtb-acc-head" data-astro-cid-734jdita> <span class="dtb-acc-av" data-astro-cid-734jdita> ', ' </span> <span class="dtb-acc-name"', " data-astro-cid-734jdita>", '</span> </div> <div class="dtb-sep-line" role="separator" data-astro-cid-734jdita></div> <a role="menuitem" class="dtb-item" href="/dash/me" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> <a role="menuitem" class="dtb-item" href="/dash/manage" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> <a role="menuitem" class="dtb-item" href="/dash/premium" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> <a role="menuitem" class="dtb-item" href="/dash/preferences" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> <div class="dtb-sep-line" role="separator" data-astro-cid-734jdita></div> <a role="menuitem" class="dtb-item dtb-item-danger" href="/dash/logout" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", `</span></span> </a> </div> </div> </div> </header> <script>
  (function () {
    if (window.__pettoDashTopBar) return;
    window.__pettoDashTopBar = true;

    var pops = Array.prototype.slice.call(document.querySelectorAll('[data-dtb-pop]'));
    function closeAll(except) {
      pops.forEach(function (pop) {
        if (pop === except) return;
        pop.classList.remove('open');
        var btn = pop.querySelector('[data-dtb-trigger]');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }

    pops.forEach(function (pop) {
      var trigger = pop.querySelector('[data-dtb-trigger]');
      var menu = pop.querySelector('.dtb-menu');
      if (!trigger || !menu) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var next = !pop.classList.contains('open');
        closeAll(next ? pop : null);
        pop.classList.toggle('open', next);
        trigger.setAttribute('aria-expanded', String(next));
      });
      if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
        var timer = 0;
        pop.addEventListener('mouseenter', function () {
          clearTimeout(timer);
          if (pops.some(function (p) { return p !== pop && p.classList.contains('open'); })) {
            closeAll(pop);
            pop.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
        pop.addEventListener('mouseleave', function () {
          clearTimeout(timer);
          timer = setTimeout(function () {
            if (pop.classList.contains('open') && !pop.contains(document.activeElement)) {
              pop.classList.remove('open');
              trigger.setAttribute('aria-expanded', 'false');
            }
          }, 180);
        });
      }
      menu.addEventListener('click', function (e) {
        var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (link) closeAll(null);
      });
    });

    document.addEventListener('click', function (e) {
      if (!(e.target instanceof Element) || !e.target.closest('[data-dtb-pop]')) closeAll(null);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });

    var themeBtn = document.getElementById('dtbThemeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var root = document.documentElement;
        var cur = root.getAttribute('data-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        var next = cur === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('petto-theme', next); } catch (err) {}
      });
    }

    // Account pages (DashMeLayout) do not load DashGuildLayout's palette script: give them the same instant finder over account pages & servers.
    if (!document.body.classList.contains('dash-body')) {
      var trigger = document.getElementById('dgl-find');
      var pal = null;
      var norm = function (t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').trim(); };
      function openMeSearch() {
        if (!trigger) return;
        closeAll(null);
        if (!pal) {
          var veil = document.createElement('div');
          veil.className = 'dtb-pal-veil';
          veil.hidden = true;
          var box = document.createElement('div');
          box.className = 'dtb-pal';
          box.setAttribute('role', 'dialog');
          box.setAttribute('aria-modal', 'true');
          var field = document.createElement('div');
          field.className = 'dtb-pal-field';
          var input = document.createElement('input');
          input.type = 'text';
          input.autocomplete = 'off';
          input.spellcheck = false;
          input.placeholder = trigger.getAttribute('data-placeholder') || '';
          var esc = document.createElement('kbd');
          esc.textContent = 'Esc';
          field.appendChild(input);
          field.appendChild(esc);
          var list = document.createElement('div');
          list.className = 'dtb-pal-list';
          box.appendChild(field);
          box.appendChild(list);
          veil.appendChild(box);
          document.body.appendChild(veil);

          var entries = [];
          Array.prototype.forEach.call(document.querySelectorAll('.dme-link'), function (a) {
            entries.push({ href: a.getAttribute('href'), name: (a.textContent || '').trim(), group: '', active: a.classList.contains('active') });
          });
          Array.prototype.forEach.call(document.querySelectorAll('.ds-sheet a[href*="/dash/guild/"]'), function (a) {
            var strong = a.querySelector('strong');
            if (strong) entries.push({ href: a.getAttribute('href'), name: (strong.textContent || '').trim(), group: 'Server', active: false });
          });

          var shown = [];
          var idx = 0;
          var draw = function () {
            var q = norm(input.value);
            shown = entries.filter(function (it) { return !q || norm(it.name + ' ' + it.group).indexOf(q) !== -1; }).slice(0, 30);
            idx = Math.min(idx, Math.max(0, shown.length - 1));
            list.textContent = '';
            if (!shown.length) {
              var empty = document.createElement('div');
              empty.className = 'dtb-pal-empty';
              empty.textContent = trigger.getAttribute('data-empty') || '';
              list.appendChild(empty);
              return;
            }
            shown.forEach(function (it, i) {
              var row = document.createElement('a');
              row.href = it.href;
              row.className = 'dtb-pal-row' + (i === idx ? ' on' : '');
              var span = document.createElement('span');
              span.textContent = it.name;
              row.appendChild(span);
              if (it.group) {
                var small = document.createElement('small');
                small.textContent = it.group;
                row.appendChild(small);
              }
              list.appendChild(row);
            });
          };
          input.addEventListener('input', function () { idx = 0; draw(); });
          input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              if (!shown.length) return;
              idx = (idx + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length;
              draw();
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (shown[idx]) window.location.href = shown[idx].href;
            } else if (e.key === 'Escape') {
              e.preventDefault();
              veil.hidden = true;
            }
          });
          veil.addEventListener('mousedown', function (e) { if (e.target === veil) veil.hidden = true; });
          pal = { veil: veil, input: input, draw: draw };
        }
        pal.veil.hidden = false;
        pal.input.value = '';
        pal.draw();
        pal.input.focus({ preventScroll: true });
      }
      if (trigger) trigger.addEventListener('click', openMeSearch);
      document.addEventListener('keydown', function (e) {
        var typing = e.target && (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable);
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === 'k' || e.key === 'K')) {
          e.preventDefault();
          if (pal && !pal.veil.hidden) pal.veil.hidden = true; else openMeSearch();
        } else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          openMeSearch();
        }
      });
    }
  })();
<\/script>  `], ["", '<header class="dtb" data-dtb data-astro-cid-734jdita> <div class="dtb-left" data-astro-cid-734jdita> <button type="button" class="dtb-burger dash-menu-btn"', "", ' aria-expanded="false"', " data-astro-cid-734jdita> ", ' </button> <button type="button" class="dtb-ctx" data-sheet-open aria-haspopup="dialog" aria-expanded="false" aria-controls="ds-sheet"', " data-astro-cid-734jdita> <span", " data-astro-cid-734jdita> ", ' </span> <span class="dtb-ctx-name" data-astro-cid-734jdita>', "</span> </button> ", ' <span class="dtb-page"', " data-astro-cid-734jdita>", '</span> </div> <div class="dtb-center" data-astro-cid-734jdita> <button type="button" class="dtb-search" id="dgl-find"', "", "", "", "", ' aria-haspopup="dialog"', " data-astro-cid-734jdita> ", ' <span class="dtb-search-text" data-astro-cid-734jdita>', '</span> <kbd class="dtb-search-kbd" aria-hidden="true" data-astro-cid-734jdita>/</kbd> </button> </div> <div class="dtb-right" data-astro-cid-734jdita> <div class="dtb-pop" data-dtb-pop data-astro-cid-734jdita> <button type="button" class="dtb-lang-btn" data-dtb-trigger aria-haspopup="menu" aria-expanded="false"', ' data-astro-cid-734jdita> <img class="dtb-flag"', ' alt="" width="20" height="14" data-astro-cid-734jdita> <span class="dtb-lang-text" data-astro-cid-734jdita>', "</span> ", ' </button> <div class="dtb-menu dtb-menu-lang" role="menu" data-astro-cid-734jdita> ', ' </div> </div> <div class="dtb-pop" data-dtb-pop data-astro-cid-734jdita> <button type="button" class="dtb-icon-btn" data-dtb-trigger aria-haspopup="menu" aria-expanded="false"', "", " data-astro-cid-734jdita> ", ' </button> <div class="dtb-menu dtb-menu-help" role="menu" data-astro-cid-734jdita> <div class="dtb-menu-head" data-astro-cid-734jdita> <img src="/assets/mascot-icon.webp" alt="" width="22" height="22" data-astro-cid-734jdita> <span data-astro-cid-734jdita>Petto</span> </div> <div class="dtb-sep-line" role="separator" data-astro-cid-734jdita></div> <a role="menuitem" class="dtb-item" href="https://wiki.petto.sbs" target="_blank" rel="noopener" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", "</span></span> ", ' </a> <a role="menuitem" class="dtb-item" href="https://petto.sbs/support" target="_blank" rel="noopener" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", "</span></span> ", ' </a> <a role="menuitem" class="dtb-item"', ' data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> <a role="menuitem" class="dtb-item"', ' data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> <a role="menuitem" class="dtb-item"', ' data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> <span class="dtb-status-dot" aria-hidden="true" data-astro-cid-734jdita></span> </a> <div class="dtb-sep-line" role="separator" data-astro-cid-734jdita></div> <a role="menuitem" class="dtb-item"', ' data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> </div> </div> <button type="button" class="dtb-icon-btn" id="dtbThemeToggle"', "", " data-astro-cid-734jdita> ", " ", ' </button> <div class="dtb-pop" data-dtb-pop data-astro-cid-734jdita> <button type="button" class="dtb-icon-btn" data-dtb-trigger aria-haspopup="menu" aria-expanded="false"', "", " data-astro-cid-734jdita> ", ' </button> <div class="dtb-menu dtb-menu-account" role="menu" data-astro-cid-734jdita> <div class="dtb-acc-head" data-astro-cid-734jdita> <span class="dtb-acc-av" data-astro-cid-734jdita> ', ' </span> <span class="dtb-acc-name"', " data-astro-cid-734jdita>", '</span> </div> <div class="dtb-sep-line" role="separator" data-astro-cid-734jdita></div> <a role="menuitem" class="dtb-item" href="/dash/me" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> <a role="menuitem" class="dtb-item" href="/dash/manage" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> <a role="menuitem" class="dtb-item" href="/dash/premium" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> <a role="menuitem" class="dtb-item" href="/dash/preferences" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", '</span></span> </a> <div class="dtb-sep-line" role="separator" data-astro-cid-734jdita></div> <a role="menuitem" class="dtb-item dtb-item-danger" href="/dash/logout" data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita>', "<span data-astro-cid-734jdita>", `</span></span> </a> </div> </div> </div> </header> <script>
  (function () {
    if (window.__pettoDashTopBar) return;
    window.__pettoDashTopBar = true;

    var pops = Array.prototype.slice.call(document.querySelectorAll('[data-dtb-pop]'));
    function closeAll(except) {
      pops.forEach(function (pop) {
        if (pop === except) return;
        pop.classList.remove('open');
        var btn = pop.querySelector('[data-dtb-trigger]');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }

    pops.forEach(function (pop) {
      var trigger = pop.querySelector('[data-dtb-trigger]');
      var menu = pop.querySelector('.dtb-menu');
      if (!trigger || !menu) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var next = !pop.classList.contains('open');
        closeAll(next ? pop : null);
        pop.classList.toggle('open', next);
        trigger.setAttribute('aria-expanded', String(next));
      });
      if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
        var timer = 0;
        pop.addEventListener('mouseenter', function () {
          clearTimeout(timer);
          if (pops.some(function (p) { return p !== pop && p.classList.contains('open'); })) {
            closeAll(pop);
            pop.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
          }
        });
        pop.addEventListener('mouseleave', function () {
          clearTimeout(timer);
          timer = setTimeout(function () {
            if (pop.classList.contains('open') && !pop.contains(document.activeElement)) {
              pop.classList.remove('open');
              trigger.setAttribute('aria-expanded', 'false');
            }
          }, 180);
        });
      }
      menu.addEventListener('click', function (e) {
        var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (link) closeAll(null);
      });
    });

    document.addEventListener('click', function (e) {
      if (!(e.target instanceof Element) || !e.target.closest('[data-dtb-pop]')) closeAll(null);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });

    var themeBtn = document.getElementById('dtbThemeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var root = document.documentElement;
        var cur = root.getAttribute('data-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        var next = cur === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('petto-theme', next); } catch (err) {}
      });
    }

    // Account pages (DashMeLayout) do not load DashGuildLayout's palette script: give them the same instant finder over account pages & servers.
    if (!document.body.classList.contains('dash-body')) {
      var trigger = document.getElementById('dgl-find');
      var pal = null;
      var norm = function (t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[\\\\u0300-\\\\u036f]/g, '').trim(); };
      function openMeSearch() {
        if (!trigger) return;
        closeAll(null);
        if (!pal) {
          var veil = document.createElement('div');
          veil.className = 'dtb-pal-veil';
          veil.hidden = true;
          var box = document.createElement('div');
          box.className = 'dtb-pal';
          box.setAttribute('role', 'dialog');
          box.setAttribute('aria-modal', 'true');
          var field = document.createElement('div');
          field.className = 'dtb-pal-field';
          var input = document.createElement('input');
          input.type = 'text';
          input.autocomplete = 'off';
          input.spellcheck = false;
          input.placeholder = trigger.getAttribute('data-placeholder') || '';
          var esc = document.createElement('kbd');
          esc.textContent = 'Esc';
          field.appendChild(input);
          field.appendChild(esc);
          var list = document.createElement('div');
          list.className = 'dtb-pal-list';
          box.appendChild(field);
          box.appendChild(list);
          veil.appendChild(box);
          document.body.appendChild(veil);

          var entries = [];
          Array.prototype.forEach.call(document.querySelectorAll('.dme-link'), function (a) {
            entries.push({ href: a.getAttribute('href'), name: (a.textContent || '').trim(), group: '', active: a.classList.contains('active') });
          });
          Array.prototype.forEach.call(document.querySelectorAll('.ds-sheet a[href*="/dash/guild/"]'), function (a) {
            var strong = a.querySelector('strong');
            if (strong) entries.push({ href: a.getAttribute('href'), name: (strong.textContent || '').trim(), group: 'Server', active: false });
          });

          var shown = [];
          var idx = 0;
          var draw = function () {
            var q = norm(input.value);
            shown = entries.filter(function (it) { return !q || norm(it.name + ' ' + it.group).indexOf(q) !== -1; }).slice(0, 30);
            idx = Math.min(idx, Math.max(0, shown.length - 1));
            list.textContent = '';
            if (!shown.length) {
              var empty = document.createElement('div');
              empty.className = 'dtb-pal-empty';
              empty.textContent = trigger.getAttribute('data-empty') || '';
              list.appendChild(empty);
              return;
            }
            shown.forEach(function (it, i) {
              var row = document.createElement('a');
              row.href = it.href;
              row.className = 'dtb-pal-row' + (i === idx ? ' on' : '');
              var span = document.createElement('span');
              span.textContent = it.name;
              row.appendChild(span);
              if (it.group) {
                var small = document.createElement('small');
                small.textContent = it.group;
                row.appendChild(small);
              }
              list.appendChild(row);
            });
          };
          input.addEventListener('input', function () { idx = 0; draw(); });
          input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault();
              if (!shown.length) return;
              idx = (idx + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length;
              draw();
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (shown[idx]) window.location.href = shown[idx].href;
            } else if (e.key === 'Escape') {
              e.preventDefault();
              veil.hidden = true;
            }
          });
          veil.addEventListener('mousedown', function (e) { if (e.target === veil) veil.hidden = true; });
          pal = { veil: veil, input: input, draw: draw };
        }
        pal.veil.hidden = false;
        pal.input.value = '';
        pal.draw();
        pal.input.focus({ preventScroll: true });
      }
      if (trigger) trigger.addEventListener('click', openMeSearch);
      document.addEventListener('keydown', function (e) {
        var typing = e.target && (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable);
        if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === 'k' || e.key === 'K')) {
          e.preventDefault();
          if (pal && !pal.veil.hidden) pal.veil.hidden = true; else openMeSearch();
        } else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          openMeSearch();
        }
      });
    }
  })();
<\/script>  `])), maybeRenderHead(), addAttribute(menuBtnId, "id"), addAttribute(sideId, "aria-controls"), addAttribute(dt("Open the menu"), "aria-label"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:list", "width": "20", "height": "20", "data-astro-cid-734jdita": true }), addAttribute(kind === "guild" ? dt("Switch server") : dt("Select a server"), "title"), addAttribute(["dtb-ctx-av", `is-${kind}`], "class:list"), contextIcon ? renderTemplate`<img${addAttribute(contextIcon, "src")} alt="" width="22" height="22" referrerpolicy="no-referrer" data-astro-cid-734jdita>` : kind === "guild" ? renderTemplate`<span class="dtb-ctx-fallback"${addAttribute(guildLetterStyle(contextName), "style")} data-astro-cid-734jdita>${guildLetter(contextName)}</span>` : renderTemplate`<span class="dtb-ctx-fallback" data-astro-cid-734jdita>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:user-fill", "width": "13", "height": "13", "data-astro-cid-734jdita": true })}</span>`, contextName, renderComponent($$result, "Icon", $$Icon, { "name": "ph:caret-right", "width": "12", "height": "12", "class": "dtb-sep", "data-astro-cid-734jdita": true }), addAttribute(kind === "guild" ? "dgl-menu-label" : "dme-bar-label", "id"), pageLabel, addAttribute(dt("Jump to a page or a setting\u2026"), "data-placeholder"), addAttribute(dt("Nothing matches."), "data-empty"), addAttribute(dt("Pages"), "data-pages-word"), addAttribute(dt("Settings"), "data-settings-word"), addAttribute(kind === "guild" ? "/dash/search-index.json" : void 0, "data-settings-url"), addAttribute(dt("Search"), "aria-label"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:magnifying-glass", "width": "15", "height": "15", "class": "dtb-search-ic", "data-astro-cid-734jdita": true }), dt("Search"), addAttribute(langNow.label, "aria-label"), addAttribute(langNow.flag, "src"), langNow.label, renderComponent($$result, "Icon", $$Icon, { "name": "ph:caret-down", "width": "12", "height": "12", "class": "dtb-caret", "data-astro-cid-734jdita": true }), langOptions.map((o) => renderTemplate`<a role="menuitem"${addAttribute(languageHref(o.code), "href")}${addAttribute(o.code, "data-set-lang")}${addAttribute(o.code, "lang")}${addAttribute(o.code === lang ? "true" : void 0, "aria-current")}${addAttribute(["dtb-item", { active: o.code === lang }], "class:list")} data-astro-cid-734jdita> <span class="dtb-item-main" data-astro-cid-734jdita> <img class="dtb-flag"${addAttribute(o.flag, "src")} alt="" width="22" height="15" data-astro-cid-734jdita> <span data-astro-cid-734jdita>${o.label}</span> </span> ${o.code === lang && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": "ph:check-bold", "width": "14", "height": "14", "class": "dtb-check", "data-astro-cid-734jdita": true })}`} </a>`), addAttribute(dt("Help and resources"), "aria-label"), addAttribute(dt("Help and resources"), "title"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:question-fill", "width": "17", "height": "17", "data-astro-cid-734jdita": true }), renderComponent($$result, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "16", "height": "16", "data-astro-cid-734jdita": true }), dt("Documentation"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:arrow-up-right", "width": "13", "height": "13", "class": "dtb-ext", "data-astro-cid-734jdita": true }), renderComponent($$result, "Icon", $$Icon, { "name": "ph:headset-fill", "width": "16", "height": "16", "data-astro-cid-734jdita": true }), dt("Support server"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:arrow-up-right", "width": "13", "height": "13", "class": "dtb-ext", "data-astro-cid-734jdita": true }), addAttribute(`${base}/commands`, "href"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "16", "height": "16", "data-astro-cid-734jdita": true }), dt("Commands"), addAttribute(`${base}/changelog`, "href"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:newspaper-fill", "width": "16", "height": "16", "data-astro-cid-734jdita": true }), dt("Changelog"), addAttribute(`${base}/status`, "href"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:pulse-fill", "width": "16", "height": "16", "data-astro-cid-734jdita": true }), dt("Status"), addAttribute(`${base}/`, "href"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:globe-fill", "width": "16", "height": "16", "data-astro-cid-734jdita": true }), dt("Back to home"), addAttribute(dt("Toggle theme"), "aria-label"), addAttribute(dt("Toggle theme"), "title"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:sun-fill", "width": "16", "height": "16", "class": "dtb-theme-sun", "data-astro-cid-734jdita": true }), renderComponent($$result, "Icon", $$Icon, { "name": "ph:moon-fill", "width": "16", "height": "16", "class": "dtb-theme-moon", "data-astro-cid-734jdita": true }), addAttribute(dt("Account and settings"), "aria-label"), addAttribute(dt("Account and settings"), "title"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:gear-six-fill", "width": "16", "height": "16", "data-astro-cid-734jdita": true }), user.avatar ? renderTemplate`<img${addAttribute(user.avatar, "src")} alt="" width="28" height="28" referrerpolicy="no-referrer" data-astro-cid-734jdita>` : renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": "ph:user-fill", "width": "15", "height": "15", "data-astro-cid-734jdita": true })}`, addAttribute(user.username, "title"), user.username, renderComponent($$result, "Icon", $$Icon, { "name": "ph:user-circle-fill", "width": "16", "height": "16", "data-astro-cid-734jdita": true }), dt("Your profile"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:squares-four-fill", "width": "16", "height": "16", "data-astro-cid-734jdita": true }), dt("Your servers"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "16", "height": "16", "data-astro-cid-734jdita": true }), dt("Manage premium"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:sliders-horizontal-fill", "width": "16", "height": "16", "data-astro-cid-734jdita": true }), dt("Preferences"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:sign-out-fill", "width": "16", "height": "16", "data-astro-cid-734jdita": true }), dt("Log out"));
}, "/home/runner/work/petto-web/petto-web/src/components/DashTopBar.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashServerSheet = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashServerSheet;
  const { user, profileHref, onProfile = false, currentId = null, servers, invites, owner = false } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  return renderTemplate(_a || (_a = __template(["", '<div class="ds-veil" data-sheet-veil hidden data-astro-cid-hr6fklwh></div> <div class="ds-sheet" id="ds-sheet" role="dialog" aria-modal="true" aria-labelledby="ds-title" tabindex="-1" hidden data-sheet data-astro-cid-hr6fklwh> <div class="ds-top" data-sheet-grab data-astro-cid-hr6fklwh> <span class="ds-grab" aria-hidden="true" data-astro-cid-hr6fklwh></span> <h2 class="ds-title" id="ds-title" data-astro-cid-hr6fklwh>', '</h2> <button type="button" class="ds-close" data-sheet-close', " data-astro-cid-hr6fklwh>", '</button> </div> <div class="ds-body" data-astro-cid-hr6fklwh> <a', "", "", " data-astro-cid-hr6fklwh> ", ' <span class="ds-profile-text" data-astro-cid-hr6fklwh><strong data-astro-cid-hr6fklwh>', "</strong><small data-astro-cid-hr6fklwh>", "</small></span> ", " </a> ", ' <h3 class="ds-head" data-astro-cid-hr6fklwh>', "</h3> ", " ", ` </div> </div> <script>
  // After an invite button was pressed (data-bot-invite), the page asks every few seconds whether Petto joined that server, and opens the dashboard of the server when it did
  // (the list of servers the page shows is kept for minutes, so waiting for it made "manage" appear late). It also looks when the person comes back to this tab.
  (function () {
    if (window.__petto_invite_watch) return;
    window.__petto_invite_watch = true;
    var KEY = 'petto-invite-wait';
    var timer = 0;
    var tries = 0;
    function stop() { if (timer) clearInterval(timer); timer = 0; }
    function check(id) {
      fetch('/dash/manage/bot-status?id=' + encodeURIComponent(id), { headers: { accept: 'application/json' }, credentials: 'same-origin', cache: 'no-store' })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          if (!data || !data.active) return;
          stop();
          try { sessionStorage.removeItem(KEY); } catch (e) { /* the page is leaving anyway */ }
          window.location.assign('/dash/guild/' + id + '/overview');
        })
        .catch(function () { /* the next look tries again */ });
    }
    function start(id) {
      stop();
      tries = 0;
      try { sessionStorage.setItem(KEY, JSON.stringify({ id: id, at: Date.now() })); } catch (e) { /* the page keeps looking without it */ }
      timer = setInterval(function () {
        tries += 1;
        if (tries > 150) { stop(); return; }
        if (!document.hidden) check(id);
      }, 2500);
    }
    function waiting() {
      try {
        var saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
        return saved && saved.id && Date.now() - saved.at < 10 * 60 * 1000 ? saved.id : null;
      } catch (e) { return null; }
    }
    document.addEventListener('click', function (event) {
      var link = event.target && event.target.closest ? event.target.closest('[data-bot-invite]') : null;
      if (link) start(link.getAttribute('data-bot-invite'));
    });
    document.addEventListener('visibilitychange', function () {
      var id = waiting();
      if (!document.hidden && id) check(id);
    });
    var pending = waiting();
    if (pending) start(pending);
  })();
<\/script> <script>
  (function () {
    var sheet = document.getElementById('ds-sheet');
    var veil = document.querySelector('[data-sheet-veil]');
    if (!sheet || !veil || sheet.dataset.bound) return;
    sheet.dataset.bound = '1';
    var openers = Array.prototype.slice.call(document.querySelectorAll('[data-sheet-open]'));
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var returnTo = null;
    var closing = 0;

    function focusables() {
      return Array.prototype.slice.call(sheet.querySelectorAll('a[href], button:not([disabled])')).filter(function (el) { return el.offsetParent !== null; });
    }
    function setOpen(open) {
      var isOpen = !sheet.hidden && sheet.classList.contains('is-open');
      if (open === isOpen) return;
      clearTimeout(closing);
      openers.forEach(function (b) { b.setAttribute('aria-expanded', String(open)); });
      if (open) {
        returnTo = document.activeElement;
        sheet.hidden = false; veil.hidden = false;
        sheet.style.removeProperty('--ds-dy');
        void sheet.offsetWidth;
        sheet.classList.add('is-open'); veil.classList.add('is-open');
        document.documentElement.classList.add('ds-open');
        var current = sheet.querySelector('[aria-current]');
        sheet.focus({ preventScroll: true });
        if (current && current.scrollIntoView) current.scrollIntoView({ block: 'nearest' });
      } else {
        sheet.classList.remove('is-open'); veil.classList.remove('is-open');
        document.documentElement.classList.remove('ds-open');
        var done = function () { sheet.hidden = true; veil.hidden = true; sheet.style.removeProperty('--ds-dy'); };
        if (reduce.matches) done(); else closing = setTimeout(done, 380);
        if (returnTo && returnTo.focus) returnTo.focus({ preventScroll: true });
        returnTo = null;
      }
    }
    openers.forEach(function (b) { b.addEventListener('click', function () { setOpen(true); }); });
    veil.addEventListener('click', function () { setOpen(false); });
    sheet.querySelectorAll('[data-sheet-close]').forEach(function (b) { b.addEventListener('click', function () { setOpen(false); }); });

    // Escape closes only the sheet (the menu drawer under it stays), and Tab stays inside the sheet.
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden || !sheet.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); setOpen(false); return; }
      if (e.key !== 'Tab') return;
      var list = focusables();
      if (!list.length) { e.preventDefault(); return; }
      var first = list[0], last = list[list.length - 1];
      if (!sheet.contains(document.activeElement) || document.activeElement === sheet) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }, true);

    // The owner's part: fetched only when it is opened (the markup exists only for the owner), one page at a time, filtered on the server.
    var own = sheet.querySelector('[data-owner]');
    if (own) {
      var toggle = own.querySelector('[data-owner-toggle]'), panel = own.querySelector('[data-owner-panel]');
      var qInput = own.querySelector('[data-owner-q]'), ul = own.querySelector('[data-owner-list]');
      var skel = own.querySelector('[data-owner-skel]'), msg = own.querySelector('[data-owner-msg]'), more = own.querySelector('[data-owner-more]');
      var ds = own.dataset, token = 0, next = 0, busy = false, timer = 0, started = false;
      var show = function (el, on) { el.hidden = !on; };
      var row = function (g) {
        var li = document.createElement('li'), a = document.createElement('a');
        a.className = 'ds-row' + (g.id === ds.current ? ' current' : '');
        a.href = '/dash/guild/' + encodeURIComponent(g.id) + '/overview';
        if (g.id === ds.current) a.setAttribute('aria-current', 'page');
        var icon;
        if (g.icon && g.icon.indexOf('https://cdn.discordapp.com/') === 0) { icon = document.createElement('img'); icon.src = g.icon; icon.width = 40; icon.height = 40; icon.loading = 'lazy'; icon.referrerPolicy = 'no-referrer'; icon.alt = ''; icon.className = 'ds-icon'; }
        else { icon = document.createElement('span'); icon.className = 'ds-icon ds-icon-fallback'; var nm = String(g.name || ''); var m = /[\\p{L}\\p{N}]/u.exec(nm); icon.textContent = m ? m[0].toLocaleUpperCase() : '?'; var hh = 0; for (var k = 0; k < nm.length; k++) hh = (hh * 31 + nm.charCodeAt(k)) >>> 0; hh = hh % 360; icon.style.background = 'linear-gradient(135deg,hsl(' + hh + ' 46% 44%),hsl(' + ((hh + 28) % 360) + ' 46% 34%))'; icon.style.color = '#fff'; }
        var name = document.createElement('span'); name.className = 'ds-name'; name.textContent = g.name;
        var sub = document.createElement('small'); sub.className = 'ds-owner-sub'; sub.textContent = g.members === null ? '' : ds.members.replace('{n}', g.members.toLocaleString());
        a.appendChild(icon); a.appendChild(name); if (g.members !== null) a.appendChild(sub); li.appendChild(a);
        return li;
      };
      var load = function (reset) {
        if (busy && !reset) return;
        var mine = ++token;
        busy = true;
        if (reset) { next = 0; ul.textContent = ''; }
        show(msg, false); show(more, false); show(skel, true);
        var url = ds.endpoint + '?offset=' + next + '&q=' + encodeURIComponent(qInput.value.trim());
        fetch(url, { credentials: 'same-origin', headers: { accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
          .then(function (data) {
            if (mine !== token) return;
            var firstPage = !ul.children.length;
            data.items.forEach(function (g) { ul.appendChild(row(g)); });
            // The first page of servers is uncovered from the top down (the grey rows above were its placeholder).
            if (firstPage && window.dglLoad) window.dglLoad.reveal(ul);
            next = data.next === null ? 0 : data.next;
            show(more, data.next !== null);
            if (!ul.children.length) { msg.textContent = ds.none; show(msg, true); }
          })
          .catch(function () {
            if (mine !== token) return;
            msg.textContent = ds.failed + ' '; show(msg, true);
            var retry = document.createElement('button'); retry.type = 'button'; retry.className = 'ds-owner-retry'; retry.textContent = ds.retry;
            retry.addEventListener('click', function () { load(reset || !ul.children.length); });
            msg.appendChild(retry);
          })
          .then(function () { if (mine === token) { busy = false; show(skel, false); } });
      };
      toggle.addEventListener('click', function () {
        var open = panel.hidden;
        show(panel, open);
        toggle.setAttribute('aria-expanded', String(open));
        own.classList.toggle('is-open', open);
        if (open && !started) { started = true; load(true); }
        if (open) { qInput.focus({ preventScroll: true }); if (own.scrollIntoView) own.scrollIntoView({ block: 'nearest' }); }
      });
      qInput.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { busy = false; load(true); }, 250); });
      more.addEventListener('click', function () { load(false); });
    }

    // On a phone, a swipe down on the top of the sheet closes it.
    var grab = sheet.querySelector('[data-sheet-grab]');
    var startY = null, delta = 0;
    grab.addEventListener('touchstart', function (e) { startY = e.touches[0].clientY; delta = 0; sheet.style.transition = 'none'; }, { passive: true });
    grab.addEventListener('touchmove', function (e) {
      if (startY === null) return;
      delta = Math.max(0, e.touches[0].clientY - startY);
      sheet.style.setProperty('--ds-dy', delta + 'px');
    }, { passive: true });
    function release() {
      if (startY === null) return;
      startY = null;
      sheet.style.transition = '';
      if (delta > 80) setOpen(false); else sheet.style.removeProperty('--ds-dy');
    }
    grab.addEventListener('touchend', release);
    grab.addEventListener('touchcancel', release);
  })();
<\/script>  `], ["", '<div class="ds-veil" data-sheet-veil hidden data-astro-cid-hr6fklwh></div> <div class="ds-sheet" id="ds-sheet" role="dialog" aria-modal="true" aria-labelledby="ds-title" tabindex="-1" hidden data-sheet data-astro-cid-hr6fklwh> <div class="ds-top" data-sheet-grab data-astro-cid-hr6fklwh> <span class="ds-grab" aria-hidden="true" data-astro-cid-hr6fklwh></span> <h2 class="ds-title" id="ds-title" data-astro-cid-hr6fklwh>', '</h2> <button type="button" class="ds-close" data-sheet-close', " data-astro-cid-hr6fklwh>", '</button> </div> <div class="ds-body" data-astro-cid-hr6fklwh> <a', "", "", " data-astro-cid-hr6fklwh> ", ' <span class="ds-profile-text" data-astro-cid-hr6fklwh><strong data-astro-cid-hr6fklwh>', "</strong><small data-astro-cid-hr6fklwh>", "</small></span> ", " </a> ", ' <h3 class="ds-head" data-astro-cid-hr6fklwh>', "</h3> ", " ", ` </div> </div> <script>
  // After an invite button was pressed (data-bot-invite), the page asks every few seconds whether Petto joined that server, and opens the dashboard of the server when it did
  // (the list of servers the page shows is kept for minutes, so waiting for it made "manage" appear late). It also looks when the person comes back to this tab.
  (function () {
    if (window.__petto_invite_watch) return;
    window.__petto_invite_watch = true;
    var KEY = 'petto-invite-wait';
    var timer = 0;
    var tries = 0;
    function stop() { if (timer) clearInterval(timer); timer = 0; }
    function check(id) {
      fetch('/dash/manage/bot-status?id=' + encodeURIComponent(id), { headers: { accept: 'application/json' }, credentials: 'same-origin', cache: 'no-store' })
        .then(function (res) { return res.ok ? res.json() : null; })
        .then(function (data) {
          if (!data || !data.active) return;
          stop();
          try { sessionStorage.removeItem(KEY); } catch (e) { /* the page is leaving anyway */ }
          window.location.assign('/dash/guild/' + id + '/overview');
        })
        .catch(function () { /* the next look tries again */ });
    }
    function start(id) {
      stop();
      tries = 0;
      try { sessionStorage.setItem(KEY, JSON.stringify({ id: id, at: Date.now() })); } catch (e) { /* the page keeps looking without it */ }
      timer = setInterval(function () {
        tries += 1;
        if (tries > 150) { stop(); return; }
        if (!document.hidden) check(id);
      }, 2500);
    }
    function waiting() {
      try {
        var saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
        return saved && saved.id && Date.now() - saved.at < 10 * 60 * 1000 ? saved.id : null;
      } catch (e) { return null; }
    }
    document.addEventListener('click', function (event) {
      var link = event.target && event.target.closest ? event.target.closest('[data-bot-invite]') : null;
      if (link) start(link.getAttribute('data-bot-invite'));
    });
    document.addEventListener('visibilitychange', function () {
      var id = waiting();
      if (!document.hidden && id) check(id);
    });
    var pending = waiting();
    if (pending) start(pending);
  })();
<\/script> <script>
  (function () {
    var sheet = document.getElementById('ds-sheet');
    var veil = document.querySelector('[data-sheet-veil]');
    if (!sheet || !veil || sheet.dataset.bound) return;
    sheet.dataset.bound = '1';
    var openers = Array.prototype.slice.call(document.querySelectorAll('[data-sheet-open]'));
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var returnTo = null;
    var closing = 0;

    function focusables() {
      return Array.prototype.slice.call(sheet.querySelectorAll('a[href], button:not([disabled])')).filter(function (el) { return el.offsetParent !== null; });
    }
    function setOpen(open) {
      var isOpen = !sheet.hidden && sheet.classList.contains('is-open');
      if (open === isOpen) return;
      clearTimeout(closing);
      openers.forEach(function (b) { b.setAttribute('aria-expanded', String(open)); });
      if (open) {
        returnTo = document.activeElement;
        sheet.hidden = false; veil.hidden = false;
        sheet.style.removeProperty('--ds-dy');
        void sheet.offsetWidth;
        sheet.classList.add('is-open'); veil.classList.add('is-open');
        document.documentElement.classList.add('ds-open');
        var current = sheet.querySelector('[aria-current]');
        sheet.focus({ preventScroll: true });
        if (current && current.scrollIntoView) current.scrollIntoView({ block: 'nearest' });
      } else {
        sheet.classList.remove('is-open'); veil.classList.remove('is-open');
        document.documentElement.classList.remove('ds-open');
        var done = function () { sheet.hidden = true; veil.hidden = true; sheet.style.removeProperty('--ds-dy'); };
        if (reduce.matches) done(); else closing = setTimeout(done, 380);
        if (returnTo && returnTo.focus) returnTo.focus({ preventScroll: true });
        returnTo = null;
      }
    }
    openers.forEach(function (b) { b.addEventListener('click', function () { setOpen(true); }); });
    veil.addEventListener('click', function () { setOpen(false); });
    sheet.querySelectorAll('[data-sheet-close]').forEach(function (b) { b.addEventListener('click', function () { setOpen(false); }); });

    // Escape closes only the sheet (the menu drawer under it stays), and Tab stays inside the sheet.
    document.addEventListener('keydown', function (e) {
      if (sheet.hidden || !sheet.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); setOpen(false); return; }
      if (e.key !== 'Tab') return;
      var list = focusables();
      if (!list.length) { e.preventDefault(); return; }
      var first = list[0], last = list[list.length - 1];
      if (!sheet.contains(document.activeElement) || document.activeElement === sheet) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }, true);

    // The owner's part: fetched only when it is opened (the markup exists only for the owner), one page at a time, filtered on the server.
    var own = sheet.querySelector('[data-owner]');
    if (own) {
      var toggle = own.querySelector('[data-owner-toggle]'), panel = own.querySelector('[data-owner-panel]');
      var qInput = own.querySelector('[data-owner-q]'), ul = own.querySelector('[data-owner-list]');
      var skel = own.querySelector('[data-owner-skel]'), msg = own.querySelector('[data-owner-msg]'), more = own.querySelector('[data-owner-more]');
      var ds = own.dataset, token = 0, next = 0, busy = false, timer = 0, started = false;
      var show = function (el, on) { el.hidden = !on; };
      var row = function (g) {
        var li = document.createElement('li'), a = document.createElement('a');
        a.className = 'ds-row' + (g.id === ds.current ? ' current' : '');
        a.href = '/dash/guild/' + encodeURIComponent(g.id) + '/overview';
        if (g.id === ds.current) a.setAttribute('aria-current', 'page');
        var icon;
        if (g.icon && g.icon.indexOf('https://cdn.discordapp.com/') === 0) { icon = document.createElement('img'); icon.src = g.icon; icon.width = 40; icon.height = 40; icon.loading = 'lazy'; icon.referrerPolicy = 'no-referrer'; icon.alt = ''; icon.className = 'ds-icon'; }
        else { icon = document.createElement('span'); icon.className = 'ds-icon ds-icon-fallback'; var nm = String(g.name || ''); var m = /[\\\\p{L}\\\\p{N}]/u.exec(nm); icon.textContent = m ? m[0].toLocaleUpperCase() : '?'; var hh = 0; for (var k = 0; k < nm.length; k++) hh = (hh * 31 + nm.charCodeAt(k)) >>> 0; hh = hh % 360; icon.style.background = 'linear-gradient(135deg,hsl(' + hh + ' 46% 44%),hsl(' + ((hh + 28) % 360) + ' 46% 34%))'; icon.style.color = '#fff'; }
        var name = document.createElement('span'); name.className = 'ds-name'; name.textContent = g.name;
        var sub = document.createElement('small'); sub.className = 'ds-owner-sub'; sub.textContent = g.members === null ? '' : ds.members.replace('{n}', g.members.toLocaleString());
        a.appendChild(icon); a.appendChild(name); if (g.members !== null) a.appendChild(sub); li.appendChild(a);
        return li;
      };
      var load = function (reset) {
        if (busy && !reset) return;
        var mine = ++token;
        busy = true;
        if (reset) { next = 0; ul.textContent = ''; }
        show(msg, false); show(more, false); show(skel, true);
        var url = ds.endpoint + '?offset=' + next + '&q=' + encodeURIComponent(qInput.value.trim());
        fetch(url, { credentials: 'same-origin', headers: { accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
          .then(function (data) {
            if (mine !== token) return;
            var firstPage = !ul.children.length;
            data.items.forEach(function (g) { ul.appendChild(row(g)); });
            // The first page of servers is uncovered from the top down (the grey rows above were its placeholder).
            if (firstPage && window.dglLoad) window.dglLoad.reveal(ul);
            next = data.next === null ? 0 : data.next;
            show(more, data.next !== null);
            if (!ul.children.length) { msg.textContent = ds.none; show(msg, true); }
          })
          .catch(function () {
            if (mine !== token) return;
            msg.textContent = ds.failed + ' '; show(msg, true);
            var retry = document.createElement('button'); retry.type = 'button'; retry.className = 'ds-owner-retry'; retry.textContent = ds.retry;
            retry.addEventListener('click', function () { load(reset || !ul.children.length); });
            msg.appendChild(retry);
          })
          .then(function () { if (mine === token) { busy = false; show(skel, false); } });
      };
      toggle.addEventListener('click', function () {
        var open = panel.hidden;
        show(panel, open);
        toggle.setAttribute('aria-expanded', String(open));
        own.classList.toggle('is-open', open);
        if (open && !started) { started = true; load(true); }
        if (open) { qInput.focus({ preventScroll: true }); if (own.scrollIntoView) own.scrollIntoView({ block: 'nearest' }); }
      });
      qInput.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(function () { busy = false; load(true); }, 250); });
      more.addEventListener('click', function () { load(false); });
    }

    // On a phone, a swipe down on the top of the sheet closes it.
    var grab = sheet.querySelector('[data-sheet-grab]');
    var startY = null, delta = 0;
    grab.addEventListener('touchstart', function (e) { startY = e.touches[0].clientY; delta = 0; sheet.style.transition = 'none'; }, { passive: true });
    grab.addEventListener('touchmove', function (e) {
      if (startY === null) return;
      delta = Math.max(0, e.touches[0].clientY - startY);
      sheet.style.setProperty('--ds-dy', delta + 'px');
    }, { passive: true });
    function release() {
      if (startY === null) return;
      startY = null;
      sheet.style.transition = '';
      if (delta > 80) setOpen(false); else sheet.style.removeProperty('--ds-dy');
    }
    grab.addEventListener('touchend', release);
    grab.addEventListener('touchcancel', release);
  })();
<\/script>  `])), maybeRenderHead(), dt("Switch server"), addAttribute(dt("Close"), "aria-label"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:x", "width": "16", "height": "16", "data-astro-cid-hr6fklwh": true }), addAttribute(["ds-profile", { current: onProfile }], "class:list"), addAttribute(profileHref, "href"), addAttribute(onProfile ? "page" : void 0, "aria-current"), user.avatar ? renderTemplate`<img${addAttribute(user.avatar, "src")} alt="" width="44" height="44" class="ds-avatar" referrerpolicy="no-referrer" data-astro-cid-hr6fklwh>` : renderTemplate`<span class="ds-avatar ds-avatar-fallback" data-astro-cid-hr6fklwh>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:user-fill", "width": "18", "height": "18", "data-astro-cid-hr6fklwh": true })}</span>`, user.name, dt("See your profile"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:caret-right-bold", "width": "14", "height": "14", "data-astro-cid-hr6fklwh": true }), owner && renderTemplate`<div class="ds-owner" data-owner data-endpoint="/dash/owner-servers"${addAttribute(currentId ?? "", "data-current")}${addAttribute(dt("Show more"), "data-more")}${addAttribute(dt("Could not load the servers."), "data-failed")}${addAttribute(dt("Try again"), "data-retry")}${addAttribute(dt("No servers found."), "data-none")}${addAttribute(dt("{n} members", { n: "{n}" }), "data-members")} data-astro-cid-hr6fklwh> <button type="button" class="ds-owner-toggle" data-owner-toggle aria-expanded="false" aria-controls="ds-owner-panel" data-astro-cid-hr6fklwh> <span class="ds-owner-ico" data-astro-cid-hr6fklwh>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:hard-drives-fill", "width": "16", "height": "16", "data-astro-cid-hr6fklwh": true })}</span> <span class="ds-owner-label" data-astro-cid-hr6fklwh>${dt("All servers (owner)")}</span> ${renderComponent($$result, "Icon", $$Icon, { "name": "ph:caret-down-bold", "width": "14", "height": "14", "class": "ds-owner-caret", "data-astro-cid-hr6fklwh": true })} </button> <div class="ds-owner-panel" id="ds-owner-panel" data-owner-panel hidden data-astro-cid-hr6fklwh> <label class="ds-owner-search" data-astro-cid-hr6fklwh>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:magnifying-glass", "width": "15", "height": "15", "data-astro-cid-hr6fklwh": true })}<input type="search" data-owner-q${addAttribute(dt("Search by name or ID"), "placeholder")}${addAttribute(dt("Search by name or ID"), "aria-label")} autocomplete="off" maxlength="100" data-astro-cid-hr6fklwh></label> <ul class="ds-list" data-owner-list data-astro-cid-hr6fklwh></ul> <ul class="ds-list ds-owner-skel" data-owner-skel aria-hidden="true" hidden data-astro-cid-hr6fklwh> ${[0, 1, 2, 3].map(() => renderTemplate`<li class="ds-row" data-astro-cid-hr6fklwh><span class="ds-icon ds-sk" data-astro-cid-hr6fklwh></span><span class="ds-sk ds-sk-line" data-astro-cid-hr6fklwh></span></li>`)} </ul> <p class="ds-empty" data-owner-msg hidden data-astro-cid-hr6fklwh></p> <button type="button" class="ds-owner-more" data-owner-more hidden data-astro-cid-hr6fklwh>${dt("Show more")}</button> </div> </div>`, dt("Your servers"), servers.length > 0 ? renderTemplate`<ul class="ds-list" data-astro-cid-hr6fklwh> ${servers.map((g) => renderTemplate`<li data-astro-cid-hr6fklwh> <a${addAttribute(["ds-row", { current: g.id === currentId }], "class:list")}${addAttribute(`/dash/guild/${g.id}/overview`, "href")}${addAttribute(g.id === currentId ? "page" : void 0, "aria-current")} data-astro-cid-hr6fklwh> ${g.icon ? renderTemplate`<img${addAttribute(g.icon, "src")} alt="" width="40" height="40" loading="lazy" class="ds-icon" referrerpolicy="no-referrer" data-astro-cid-hr6fklwh>` : renderTemplate`<span class="ds-icon ds-icon-fallback"${addAttribute(guildLetterStyle(g.name), "style")} data-astro-cid-hr6fklwh>${guildLetter(g.name)}</span>`} <span class="ds-name" data-astro-cid-hr6fklwh>${g.name}</span> ${g.premium && renderTemplate`<span class="ds-premium" data-astro-cid-hr6fklwh>${renderComponent($$result, "InlineIcon", $$InlineIcon, { "name": "ph:crown-fill", "width": "11", "height": "11", "data-astro-cid-hr6fklwh": true })}Premium</span>`} ${g.id === currentId && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "16", "height": "16", "class": "ds-check", "data-astro-cid-hr6fklwh": true })}`} </a> </li>`)} </ul>` : renderTemplate`<p class="ds-empty" data-astro-cid-hr6fklwh>${dt("Petto is not in any of your servers yet.")}</p>`, invites.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate` <h3 class="ds-head" data-astro-cid-hr6fklwh>${dt("Invite Petto")}</h3> <ul class="ds-list" data-astro-cid-hr6fklwh> ${invites.map((g) => renderTemplate`<li class="ds-row ds-row-invite" data-astro-cid-hr6fklwh> ${g.icon ? renderTemplate`<img${addAttribute(g.icon, "src")} alt="" width="40" height="40" loading="lazy" class="ds-icon" referrerpolicy="no-referrer" data-astro-cid-hr6fklwh>` : renderTemplate`<span class="ds-icon ds-icon-fallback"${addAttribute(guildLetterStyle(g.name), "style")} data-astro-cid-hr6fklwh>${guildLetter(g.name)}</span>`} <span class="ds-name" data-astro-cid-hr6fklwh>${g.name}</span> <a class="ds-plus"${addAttribute(g.href, "href")} target="_blank" rel="noopener noreferrer"${addAttribute(g.id, "data-bot-invite")}${addAttribute(dt("Add Petto to {a}", { a: g.name }), "aria-label")}${addAttribute(dt("Add Petto"), "title")} data-astro-cid-hr6fklwh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "15", "height": "15", "data-astro-cid-hr6fklwh": true })}</a> </li>`)} </ul> ` })}`);
}, "/home/runner/work/petto-web/petto-web/src/components/DashServerSheet.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const $$DashUserCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashUserCard;
  const { user } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  const card = userCardData(user);
  const name = card.name || user.username;
  const plate = card.nameplate;
  const style = plate ? `--np-from:${plate.from};--np-to:${plate.to};--np-img:url("${plate.still}")` : void 0;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["dgl-user", { "has-plate": Boolean(plate) }], "class:list")}${addAttribute(style, "style")} data-dgl-user data-astro-cid-3zhnopf5> ${plate && renderTemplate`<div class="dgl-user-plate" aria-hidden="true" data-astro-cid-3zhnopf5> <video class="dgl-user-video" muted loop playsinline preload="none" disablepictureinpicture tabindex="-1"${addAttribute(plate.still, "poster")}${addAttribute(plate.video, "data-src")} data-astro-cid-3zhnopf5></video> </div>`} <span class="dgl-user-av" data-astro-cid-3zhnopf5> ${card.avatar ? renderTemplate`<img class="dgl-user-pic"${addAttribute(card.avatar, "src")} alt="" width="40" height="40" data-astro-cid-3zhnopf5>` : renderTemplate`<span class="dgl-user-pic dgl-user-pic-fallback" data-astro-cid-3zhnopf5>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:user-fill", "width": "16", "height": "16", "data-astro-cid-3zhnopf5": true })}</span>`} ${card.decoration && renderTemplate`<picture class="dgl-user-deco" data-astro-cid-3zhnopf5> <source media="(prefers-reduced-motion: reduce)"${addAttribute(card.decoration.still, "srcset")} data-astro-cid-3zhnopf5> <img${addAttribute(card.decoration.animated, "src")}${addAttribute(card.decoration.still, "data-still")} alt="" width="48" height="48" decoding="async" data-astro-cid-3zhnopf5> </picture>`} </span> <span class="dgl-user-text" data-astro-cid-3zhnopf5> <span class="dgl-user-name"${addAttribute(name, "title")} data-astro-cid-3zhnopf5>${name}</span> <a class="dgl-user-out" href="/dash/logout" data-astro-cid-3zhnopf5>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:sign-out-fill", "width": "12", "height": "12", "data-astro-cid-3zhnopf5": true })}${dt("Log out")}</a> </span> </div>  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashUserCard.astro", void 0);

export { $$DashServerRail as $, guildLetter as a, $$DashSideHead as b, $$DashUserCard as c, $$DashTopBar as d, $$DashServerSheet as e, guildLetterStyle as g };
