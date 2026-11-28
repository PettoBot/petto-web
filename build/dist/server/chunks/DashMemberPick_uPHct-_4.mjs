import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import 'clsx';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';
/* empty css                               */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://petto.sbs");
const $$DashMemberPick = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashMemberPick;
  const { guildId, name, placeholder, required = true } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  return renderTemplate(_a || (_a = __template(["", '<div class="mp" data-member-pick', "", "", ' data-astro-cid-sg2vxltg> <input type="hidden"', ' value="" data-mp-value data-astro-cid-sg2vxltg> <div class="mp-chosen" data-mp-chosen hidden data-astro-cid-sg2vxltg></div> <input type="text" class="mp-input" data-mp-input', ' autocomplete="off" maxlength="32"', ` data-astro-cid-sg2vxltg> <div class="mp-results" data-mp-results hidden data-astro-cid-sg2vxltg></div> </div> <script>
  (function () {
    if (window.__mpBound) return;
    window.__mpBound = true;
    var timer = null;
    var seq = 0;
    var esc = function (text) { return String(text == null ? '' : text).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var choose = function (wrap, id, label, avatar) {
      wrap.querySelector('[data-mp-value]').value = id;
      var chosen = wrap.querySelector('[data-mp-chosen]');
      chosen.innerHTML = id ? (avatar ? '<img src="' + esc(avatar) + '" alt="" width="20" height="20" />' : '') + '<b>' + esc(label) + '</b><button type="button" data-mp-clear aria-label="\xD7">\xD7</button>' : '';
      chosen.hidden = !id;
      var input = wrap.querySelector('[data-mp-input]');
      input.hidden = Boolean(id);
      input.value = '';
      wrap.querySelector('[data-mp-results]').hidden = true;
      if (!id) input.focus();
    };
    document.addEventListener('input', function (event) {
      var input = event.target && event.target.closest ? event.target.closest('[data-mp-input]') : null;
      if (!input) return;
      var wrap = input.closest('[data-member-pick]');
      var results = wrap.querySelector('[data-mp-results]');
      var query = input.value.trim();
      clearTimeout(timer);
      if (!query) { results.hidden = true; return; }
      // A pasted ID is taken as it is.
      if (/^\\d{15,25}$/.test(query)) { choose(wrap, query, query, ''); return; }
      timer = setTimeout(function () {
        var mine = ++seq;
        // If the search takes more than a moment the list waits with grey rows (shared placeholder) and the people are uncovered from the top down.
        var mpWait = setTimeout(function () {
          if (mine !== seq || !window.dglLoad) return;
          results.innerHTML = ''; results.appendChild(window.dglLoad.shape('rows', 3)); results.hidden = false;
        }, 150);
        fetch(wrap.getAttribute('data-search-url') + '?q=' + encodeURIComponent(query), { credentials: 'same-origin', headers: { Accept: 'application/json' } })
          .then(function (res) { return res.ok ? res.json() : { members: [] }; })
          .then(function (data) {
            clearTimeout(mpWait);
            if (mine !== seq) return;
            var mpHadWait = !!results.querySelector('.dgl-wait');
            var members = (data && data.members) || [];
            results.innerHTML = members.length ? members.slice(0, 8).map(function (m) {
              var label = m.displayName || m.username || m.id;
              return '<button type="button" class="mp-person" data-mp-id="' + esc(m.id) + '" data-mp-label="' + esc(label) + '" data-mp-avatar="' + esc(m.avatar || '') + '">' + (m.avatar ? '<img src="' + esc(m.avatar) + '" alt="" width="22" height="22" />' : '') + '<span>' + esc(label) + (m.username && m.username !== label ? ' <small>@' + esc(m.username) + '</small>' : '') + '</span></button>';
            }).join('') : '<p class="mp-none">' + esc(wrap.getAttribute('data-none')) + '</p>';
            results.hidden = false;
            if (mpHadWait && window.dglLoad) window.dglLoad.reveal(results);
          })
          .catch(function () { clearTimeout(mpWait); results.hidden = true; });
      }, 250);
    });
    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target : null;
      if (!target) return;
      var pick = target.closest('[data-mp-id]');
      if (pick) { choose(pick.closest('[data-member-pick]'), pick.getAttribute('data-mp-id'), pick.getAttribute('data-mp-label'), pick.getAttribute('data-mp-avatar')); return; }
      var clear = target.closest('[data-mp-clear]');
      if (clear) { choose(clear.closest('[data-member-pick]'), '', '', ''); return; }
      document.querySelectorAll('[data-mp-results]').forEach(function (box) { if (!box.closest('[data-member-pick]').contains(target)) box.hidden = true; });
    });
    // A form is not sent without the member it needs: the search box asks for one instead.
    document.addEventListener('submit', function (event) {
      var form = event.target;
      if (!form || !form.querySelector) return;
      var wrap = form.querySelector('[data-member-pick]');
      if (wrap && !wrap.hasAttribute('data-mp-optional') && !wrap.querySelector('[data-mp-value]').value) {
        event.preventDefault();
        event.stopImmediatePropagation();
        wrap.querySelector('[data-mp-input]').focus();
      }
    }, true);
  })();
<\/script> `], ["", '<div class="mp" data-member-pick', "", "", ' data-astro-cid-sg2vxltg> <input type="hidden"', ' value="" data-mp-value data-astro-cid-sg2vxltg> <div class="mp-chosen" data-mp-chosen hidden data-astro-cid-sg2vxltg></div> <input type="text" class="mp-input" data-mp-input', ' autocomplete="off" maxlength="32"', ` data-astro-cid-sg2vxltg> <div class="mp-results" data-mp-results hidden data-astro-cid-sg2vxltg></div> </div> <script>
  (function () {
    if (window.__mpBound) return;
    window.__mpBound = true;
    var timer = null;
    var seq = 0;
    var esc = function (text) { return String(text == null ? '' : text).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var choose = function (wrap, id, label, avatar) {
      wrap.querySelector('[data-mp-value]').value = id;
      var chosen = wrap.querySelector('[data-mp-chosen]');
      chosen.innerHTML = id ? (avatar ? '<img src="' + esc(avatar) + '" alt="" width="20" height="20" />' : '') + '<b>' + esc(label) + '</b><button type="button" data-mp-clear aria-label="\xD7">\xD7</button>' : '';
      chosen.hidden = !id;
      var input = wrap.querySelector('[data-mp-input]');
      input.hidden = Boolean(id);
      input.value = '';
      wrap.querySelector('[data-mp-results]').hidden = true;
      if (!id) input.focus();
    };
    document.addEventListener('input', function (event) {
      var input = event.target && event.target.closest ? event.target.closest('[data-mp-input]') : null;
      if (!input) return;
      var wrap = input.closest('[data-member-pick]');
      var results = wrap.querySelector('[data-mp-results]');
      var query = input.value.trim();
      clearTimeout(timer);
      if (!query) { results.hidden = true; return; }
      // A pasted ID is taken as it is.
      if (/^\\\\d{15,25}$/.test(query)) { choose(wrap, query, query, ''); return; }
      timer = setTimeout(function () {
        var mine = ++seq;
        // If the search takes more than a moment the list waits with grey rows (shared placeholder) and the people are uncovered from the top down.
        var mpWait = setTimeout(function () {
          if (mine !== seq || !window.dglLoad) return;
          results.innerHTML = ''; results.appendChild(window.dglLoad.shape('rows', 3)); results.hidden = false;
        }, 150);
        fetch(wrap.getAttribute('data-search-url') + '?q=' + encodeURIComponent(query), { credentials: 'same-origin', headers: { Accept: 'application/json' } })
          .then(function (res) { return res.ok ? res.json() : { members: [] }; })
          .then(function (data) {
            clearTimeout(mpWait);
            if (mine !== seq) return;
            var mpHadWait = !!results.querySelector('.dgl-wait');
            var members = (data && data.members) || [];
            results.innerHTML = members.length ? members.slice(0, 8).map(function (m) {
              var label = m.displayName || m.username || m.id;
              return '<button type="button" class="mp-person" data-mp-id="' + esc(m.id) + '" data-mp-label="' + esc(label) + '" data-mp-avatar="' + esc(m.avatar || '') + '">' + (m.avatar ? '<img src="' + esc(m.avatar) + '" alt="" width="22" height="22" />' : '') + '<span>' + esc(label) + (m.username && m.username !== label ? ' <small>@' + esc(m.username) + '</small>' : '') + '</span></button>';
            }).join('') : '<p class="mp-none">' + esc(wrap.getAttribute('data-none')) + '</p>';
            results.hidden = false;
            if (mpHadWait && window.dglLoad) window.dglLoad.reveal(results);
          })
          .catch(function () { clearTimeout(mpWait); results.hidden = true; });
      }, 250);
    });
    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target : null;
      if (!target) return;
      var pick = target.closest('[data-mp-id]');
      if (pick) { choose(pick.closest('[data-member-pick]'), pick.getAttribute('data-mp-id'), pick.getAttribute('data-mp-label'), pick.getAttribute('data-mp-avatar')); return; }
      var clear = target.closest('[data-mp-clear]');
      if (clear) { choose(clear.closest('[data-member-pick]'), '', '', ''); return; }
      document.querySelectorAll('[data-mp-results]').forEach(function (box) { if (!box.closest('[data-member-pick]').contains(target)) box.hidden = true; });
    });
    // A form is not sent without the member it needs: the search box asks for one instead.
    document.addEventListener('submit', function (event) {
      var form = event.target;
      if (!form || !form.querySelector) return;
      var wrap = form.querySelector('[data-member-pick]');
      if (wrap && !wrap.hasAttribute('data-mp-optional') && !wrap.querySelector('[data-mp-value]').value) {
        event.preventDefault();
        event.stopImmediatePropagation();
        wrap.querySelector('[data-mp-input]').focus();
      }
    }, true);
  })();
<\/script> `])), maybeRenderHead(), addAttribute(required ? void 0 : "", "data-mp-optional"), addAttribute(`/dash/guild/${guildId}/members-search`, "data-search-url"), addAttribute(dt("Nobody with that name."), "data-none"), addAttribute(name, "name"), addAttribute(placeholder ?? dt("Type a name to search"), "placeholder"), addAttribute(placeholder ?? dt("Type a name to search"), "aria-label"));
}, "/home/runner/work/petto-web/petto-web/src/components/DashMemberPick.astro", void 0);

export { $$DashMemberPick as $ };
