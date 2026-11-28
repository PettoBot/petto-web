import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$SxNumber } from '../../../../chunks/SxNumber_YL4vNksH.mjs';
import { P as PACKS, M as MAX_ALLOWED_DOMAINS, T as TEMPLATES } from '../../../../chunks/automodTemplates_DK-cTfY2.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { f as formatDuration } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
/* empty css                                            */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashAutomodTemplates = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashAutomodTemplates;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, filters, roles, channels, linkDomains = [], linkDomainsSupported = true } = Astro2.props;
  const textChannels = channels.filter((c) => !c.category);
  const info = {
    links: { name: dt("All links"), text: dt("Blocks every link, even the ones written with spaces or odd symbols to get past filters."), sample: "https://example.com" },
    invites: { name: dt("Invite links"), text: dt("Blocks Discord invites and server pages."), sample: "discord.gg/abc123" },
    inline_links: { name: dt("Inline links"), text: dt("Blocks links hidden behind a text, like a button that says one thing and goes somewhere else."), sample: "[click here](https://example.com)" },
    emails: { name: dt("Email addresses"), text: dt("Stops email addresses from being sent."), sample: "name@example.com" },
    scam: { name: dt("Scam text"), text: dt("Catches the usual lines of scams: free Nitro, gifts, Robux, airdrops, wallets."), sample: "FREE NITRO click here" },
    fake_pings: { name: dt("Fake pings"), text: dt("Blocks the text @everyone and @here, even from people who cannot ping."), sample: "@everyone" },
    ip_addresses: { name: dt("IP addresses"), text: dt("Blocks IP addresses."), sample: "192.168.1.20" },
    phone_numbers: { name: dt("Phone numbers"), text: dt("Blocks phone numbers."), sample: "+57 300 123 4567" },
    emojis: { name: dt("Emoji spam"), text: dt("Limits how many emojis fit in one message."), sample: "\u{1F600}\u{1F600}\u{1F600}\u{1F600}\u{1F600}\u{1F600}\u{1F600}" },
    zalgo: { name: dt("Zalgo text"), text: dt("Blocks text with stacked marks that looks glitchy."), sample: "h\u0337\u0322\u0360o\u0338\u0321\u035El\u0335\u0328\u0360a\u0334" },
    headings: { name: dt("Headings"), text: dt("Blocks big heading text made with #."), sample: "# TITLE" },
    subtext: { name: dt("Subtext"), text: dt("Blocks small text that can be used to fake official notices."), sample: "-# small text" },
    caps: { name: dt("Shouting"), text: dt("Blocks messages written in capital letters."), sample: "THIS IS A VERY LONG SHOUT" },
    repeated_characters: { name: dt("Repeated characters"), text: dt("Blocks letters or symbols repeated again and again."), sample: "holaaaaaaaaaaaa!!!!!!!!!!" },
    spoilers: { name: dt("Spoiler spam"), text: dt("Blocks many spoilers in one message."), sample: "||a|| ||b|| ||c|| ||d||" },
    invisible_text: { name: dt("Invisible text"), text: dt("Blocks zero-width characters used to hide or break words."), sample: "(nothing you can see)" }
  };
  const optionLabels = {
    nonClickable: dt("Also links without https (can block normal text like a.b)"),
    thirdParty: dt("Also invites from other sites (dsc.gg and similar)"),
    disguisedOnly: dt("Only when the text looks like a web address"),
    max: dt("Most allowed"),
    filterAccents: dt("Also block normal accents"),
    level: dt("Biggest heading allowed to block (1 to 3)"),
    words: dt("Words in capitals to block"),
    times: dt("Repetitions to block")
  };
  const packInfo = {
    basic: { name: dt("Basic"), text: dt("Invites, zalgo, subtext and fake pings. A good start for any server.") },
    clean_chat: { name: dt("Clean chat"), text: dt("Shouting, repeated characters, emoji and spoiler spam and invisible text.") },
    anti_scam: { name: dt("Anti scam"), text: dt("Scam text, links, hidden links and fake pings.") },
    strict: { name: dt("Strict"), text: dt("All links, all invites, emails, zalgo, headings and subtext.") }
  };
  const groups = [
    { id: "links", label: dt("Links and addresses") },
    { id: "safety", label: dt("Safety") },
    { id: "text", label: dt("Text and noise") }
  ];
  const actionNames = { delete: dt("Delete the message"), warn: dt("Warn"), mute: dt("Mute"), kick: dt("Kick") };
  const jump = [
    { id: "am-packs", label: dt("Packs") },
    ...groups.map((g) => ({ id: `am-g-${g.id}`, label: g.label })),
    { id: "am-discord-own", label: dt("What Discord does by itself") },
    { id: "am-active-discord", label: dt("Active in Discord") },
    { id: "am-active-petto", label: dt("Active in Petto") }
  ];
  const ruleName = (r) => info[r.template]?.name ?? r.name;
  return renderTemplate(_a || (_a = __template(["", ` <script>
  (function () {
    var guildOf = function () { return location.pathname.replace(/^\\/(es|pt-br)(?=\\/)/i, '').split('/')[3]; };
    var renderNative = function (data) {
      var list = document.querySelector('[data-native-list]');
      var empty = document.querySelector('[data-native-empty]');
      var count = document.querySelector('[data-native-count]');
      var warn = document.querySelector('[data-native-warn]');
      if (!list) return;
      if (!data || !data.ok) { list.hidden = true; list.removeAttribute('aria-busy'); if (warn) warn.hidden = false; if (count) count.textContent = '\u2013'; return; }
      if (count) count.textContent = ((data.used && data.used.keyword) || 0) + '/' + ((data.limits && data.limits.keyword) || 6);
      list.textContent = '';
      var rules = data.rules || [];
      list.hidden = rules.length === 0;
      if (empty) empty.hidden = rules.length !== 0;
      rules.forEach(function (r) {
        var item = document.createElement('div'); item.className = 'am-item';
        var main = document.createElement('div'); main.className = 'am-item-main';
        var name = document.createElement('b'); name.textContent = r.name; main.appendChild(name);
        if (r.official) { var tag = document.createElement('span'); tag.className = 'am-tag'; tag.textContent = cdt('Petto Official'); main.appendChild(tag); }
        if (r.patterns > 0) { var em = document.createElement('em'); em.textContent = cdt('{n} pattern(s)', { n: r.patterns }); main.appendChild(em); }
        item.appendChild(main);
        if (r.mine) {
          var sw = document.createElement('label'); sw.className = 'am-switch';
          var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = r.enabled; cb.setAttribute('data-native-toggle', r.id);
          sw.appendChild(cb); sw.appendChild(document.createElement('span')); item.appendChild(sw);
          var del = document.createElement('button'); del.type = 'button'; del.className = 'am-del'; del.setAttribute('data-native-delete', r.id); del.title = cdt('Remove'); del.textContent = '\u2715'; item.appendChild(del);
        } else { var st = document.createElement('span'); st.className = 'am-tag'; st.textContent = r.enabled ? cdt('Active') : cdt('Inactive'); item.appendChild(st); }
        list.appendChild(item);
      });
      list.removeAttribute('aria-busy');
      if (window.dglLoad) window.dglLoad.reveal(list);
    };
    var loadNative = function () {
      var list = document.querySelector('[data-native-list]');
      if (!list) return;
      var g = guildOf();
      if (!g) { renderNative(null); return; }
      fetch('/dash/guild/' + g + '/automod-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'native_list' }) })
        .then(function (r) { return r.json(); }).then(renderNative).catch(function () { renderNative(null); });
    };
    loadNative();

    if (window.__amBound) return;
    window.__amBound = true;
    // The answer is a toast at the bottom (the page is long, the button pressed may be far from the top); without it, the box at the top.
    var msg = function (text, ok) {
      if (window.dglToast) { window.dglToast(text, { kind: ok ? 'ok' : 'error' }); return; }
      var box = document.querySelector('[data-am-msg]');
      if (!box) return;
      box.hidden = false; box.textContent = text; box.className = 'am-msg ' + (ok ? 'ok' : 'bad');
      box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };
    var send = function (body, button, okText) {
      if (button) button.disabled = true;
      return fetch('/dash/guild/' + guildOf() + '/automod-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.ok) { msg(okText || cdt('Done.'), true); setTimeout(function () { location.reload(); }, 900); }
          else { msg((data && data.message) || cdt('It could not be done.'), false); if (button) button.disabled = false; }
        })
        .catch(function () { msg(cdt('It could not be done.'), false); if (button) button.disabled = false; });
    };
    var settings = function () {
      var root = document.querySelector('[data-am-settings]');
      var val = function (k) { var el = root.querySelector('[data-s="' + k + '"]'); return el ? el.value : ''; };
      var checked = function (name) { return Array.prototype.map.call(root.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; }); };
      return { alertChannelId: val('alert'), timeoutMinutes: Number(val('timeout')) || 0, customMessage: val('message'), action: val('action'), muteMinutes: Number(val('mute')) || 10, exemptRoleIds: checked('am_exempt_roles'), exemptChannelIds: checked('am_exempt_channels') };
    };
    var options = function (tile) {
      var out = {};
      tile.querySelectorAll('[data-opt]').forEach(function (el) { out[el.getAttribute('data-opt')] = el.type === 'checkbox' ? el.checked : Number(el.value); });
      return out;
    };
    var saveDomains = function (btn) {
      var box = document.querySelector('[data-am-domains]');
      var area = box.querySelector('[data-domains]');
      var bad = box.querySelector('[data-domains-bad]');
      btn.disabled = true;
      fetch('/dash/guild/' + guildOf() + '/automod-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'link_domains_save', domains: area.value }) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          btn.disabled = false;
          if (data && data.ok) {
            area.value = data.domains.join('\\n');
            var parts = [];
            if (data.invalid.length) parts.push(cdt('These were not valid domains and were skipped: {a}', { a: data.invalid.join(', ') }));
            if (data.overflow) parts.push(cdt('Only the first {a} domains were kept.', { a: data.domains.length }));
            bad.textContent = parts.join(' '); bad.hidden = parts.length === 0;
            msg(cdt('Domains saved.'), true);
          } else if (data && data.unsupported) {
            area.disabled = true; btn.disabled = true;
            box.querySelector('[data-domains-note]').hidden = false;
          } else msg((data && data.message) || cdt('It could not be done.'), false);
        })
        .catch(function () { btn.disabled = false; msg(cdt('It could not be done.'), false); });
    };
    document.addEventListener('click', function (event) {
      var t = event.target;
      var btn = t.closest && t.closest('button');
      if (!btn) return;
      if (btn.hasAttribute('data-save-domains')) { saveDomains(btn); return; }
      var tile = btn.closest('.am-tile');
      var s = settings();
      var native = btn.getAttribute('data-add-native');
      var pack = btn.getAttribute('data-add-native-pack');
      var filter = btn.getAttribute('data-add-filter');
      var kind = btn.getAttribute('data-add-kind');
      if (native) send(Object.assign({ op: 'native_add', template: native, options: options(tile) }, s), btn, cdt('Rule added to Discord.'));
      else if (pack) send(Object.assign({ op: 'native_add', pack: pack }, s), btn, cdt('Pack added to Discord.'));
      else if (kind) {
        var extra = kind === 'mentions' ? { mentionLimit: Number(tile.querySelector('[data-limit]').value) } : kind === 'presets' ? { presets: Array.prototype.map.call(tile.querySelectorAll('[data-preset]:checked'), function (i) { return i.getAttribute('data-preset'); }) } : {};
        send(Object.assign({ op: 'native_add', kind: kind }, extra, s), btn, cdt('Rule added to Discord.'));
      } else if (filter) send({ op: 'filter_add', template: filter, options: options(tile), action: s.action, muteMinutes: s.muteMinutes, exemptRoleIds: s.exemptRoleIds, exemptChannelIds: s.exemptChannelIds }, btn, cdt('Filter added to Petto.'));
      else if (btn.hasAttribute('data-native-delete')) { window.dglConfirm(cdt('Remove this rule from Discord?'), { confirm: cdt('Remove') }).then(function (ok) { if (ok) send({ op: 'native_delete', id: btn.getAttribute('data-native-delete') }, btn, cdt('Rule removed.')); }); }
      else if (btn.hasAttribute('data-filter-delete')) { window.dglConfirm(cdt('Remove this filter?'), { confirm: cdt('Remove') }).then(function (ok) { if (ok) send({ op: 'filter_delete', id: Number(btn.getAttribute('data-filter-delete')) }, btn, cdt('Filter removed.')); }); }
    });
    document.addEventListener('change', function (event) {
      var el = event.target;
      if (el.hasAttribute && el.hasAttribute('data-native-toggle')) send({ op: 'native_toggle', id: el.getAttribute('data-native-toggle'), enabled: el.checked }, el, el.checked ? cdt('Rule on.') : cdt('Rule off.'));
      else if (el.hasAttribute && el.hasAttribute('data-filter-toggle')) send({ op: 'filter_toggle', id: Number(el.getAttribute('data-filter-toggle')), enabled: el.checked }, el, el.checked ? cdt('Filter on.') : cdt('Filter off.'));
    });
  })();
<\/script> <script>
  // The shortcuts scroll to a part of the long page, and the search hides the filters that do not match (and the headings left empty).
  (function () {
    if (window.__amNav) return;
    window.__amNav = true;
    document.addEventListener('click', function (event) {
      var button = event.target.closest && event.target.closest('[data-am-jump]'); if (!button) return;
      var id = button.getAttribute('data-am-jump');
      var target = id ? document.getElementById(id) : null;
      if (!target) return;
      if (target.hidden) {
        var filter = document.querySelector('[data-am-filter]');
        if (filter) { filter.value = ''; filter.dispatchEvent(new Event('input', { bubbles: true })); }
      }
      document.querySelectorAll('.am-jump-btn').forEach(function (b) { b.classList.toggle('is-on', b === button); });
      var behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      var scroller = document.getElementById('dgl-content');
      if (scroller && scroller.scrollHeight > scroller.clientHeight + 2) {
        var top = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 16;
        scroller.scrollTo({ top: Math.max(0, top), behavior: behavior });
      } else {
        target.scrollIntoView({ behavior: behavior, block: 'start' });
      }
    });
    document.addEventListener('input', function (event) {
      var box = event.target; if (!box.matches || !box.matches('[data-am-filter]')) return;
      var q = box.value.trim().toLowerCase();
      document.querySelectorAll('.am-tile').forEach(function (tile) { tile.hidden = !!q && (tile.getAttribute('data-am-search') || '').indexOf(q) === -1; });
      document.querySelectorAll('[data-am-heading]').forEach(function (heading) {
        var grid = heading.nextElementSibling; if (!grid || !grid.classList.contains('am-tiles')) return;
        var any = grid.querySelectorAll('.am-tile:not([hidden])').length > 0;
        heading.hidden = !any; grid.hidden = !any;
      });
    });
  })();
<\/script> `], ["", ` <script>
  (function () {
    var guildOf = function () { return location.pathname.replace(/^\\\\/(es|pt-br)(?=\\\\/)/i, '').split('/')[3]; };
    var renderNative = function (data) {
      var list = document.querySelector('[data-native-list]');
      var empty = document.querySelector('[data-native-empty]');
      var count = document.querySelector('[data-native-count]');
      var warn = document.querySelector('[data-native-warn]');
      if (!list) return;
      if (!data || !data.ok) { list.hidden = true; list.removeAttribute('aria-busy'); if (warn) warn.hidden = false; if (count) count.textContent = '\u2013'; return; }
      if (count) count.textContent = ((data.used && data.used.keyword) || 0) + '/' + ((data.limits && data.limits.keyword) || 6);
      list.textContent = '';
      var rules = data.rules || [];
      list.hidden = rules.length === 0;
      if (empty) empty.hidden = rules.length !== 0;
      rules.forEach(function (r) {
        var item = document.createElement('div'); item.className = 'am-item';
        var main = document.createElement('div'); main.className = 'am-item-main';
        var name = document.createElement('b'); name.textContent = r.name; main.appendChild(name);
        if (r.official) { var tag = document.createElement('span'); tag.className = 'am-tag'; tag.textContent = cdt('Petto Official'); main.appendChild(tag); }
        if (r.patterns > 0) { var em = document.createElement('em'); em.textContent = cdt('{n} pattern(s)', { n: r.patterns }); main.appendChild(em); }
        item.appendChild(main);
        if (r.mine) {
          var sw = document.createElement('label'); sw.className = 'am-switch';
          var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = r.enabled; cb.setAttribute('data-native-toggle', r.id);
          sw.appendChild(cb); sw.appendChild(document.createElement('span')); item.appendChild(sw);
          var del = document.createElement('button'); del.type = 'button'; del.className = 'am-del'; del.setAttribute('data-native-delete', r.id); del.title = cdt('Remove'); del.textContent = '\u2715'; item.appendChild(del);
        } else { var st = document.createElement('span'); st.className = 'am-tag'; st.textContent = r.enabled ? cdt('Active') : cdt('Inactive'); item.appendChild(st); }
        list.appendChild(item);
      });
      list.removeAttribute('aria-busy');
      if (window.dglLoad) window.dglLoad.reveal(list);
    };
    var loadNative = function () {
      var list = document.querySelector('[data-native-list]');
      if (!list) return;
      var g = guildOf();
      if (!g) { renderNative(null); return; }
      fetch('/dash/guild/' + g + '/automod-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'native_list' }) })
        .then(function (r) { return r.json(); }).then(renderNative).catch(function () { renderNative(null); });
    };
    loadNative();

    if (window.__amBound) return;
    window.__amBound = true;
    // The answer is a toast at the bottom (the page is long, the button pressed may be far from the top); without it, the box at the top.
    var msg = function (text, ok) {
      if (window.dglToast) { window.dglToast(text, { kind: ok ? 'ok' : 'error' }); return; }
      var box = document.querySelector('[data-am-msg]');
      if (!box) return;
      box.hidden = false; box.textContent = text; box.className = 'am-msg ' + (ok ? 'ok' : 'bad');
      box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    };
    var send = function (body, button, okText) {
      if (button) button.disabled = true;
      return fetch('/dash/guild/' + guildOf() + '/automod-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data && data.ok) { msg(okText || cdt('Done.'), true); setTimeout(function () { location.reload(); }, 900); }
          else { msg((data && data.message) || cdt('It could not be done.'), false); if (button) button.disabled = false; }
        })
        .catch(function () { msg(cdt('It could not be done.'), false); if (button) button.disabled = false; });
    };
    var settings = function () {
      var root = document.querySelector('[data-am-settings]');
      var val = function (k) { var el = root.querySelector('[data-s="' + k + '"]'); return el ? el.value : ''; };
      var checked = function (name) { return Array.prototype.map.call(root.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; }); };
      return { alertChannelId: val('alert'), timeoutMinutes: Number(val('timeout')) || 0, customMessage: val('message'), action: val('action'), muteMinutes: Number(val('mute')) || 10, exemptRoleIds: checked('am_exempt_roles'), exemptChannelIds: checked('am_exempt_channels') };
    };
    var options = function (tile) {
      var out = {};
      tile.querySelectorAll('[data-opt]').forEach(function (el) { out[el.getAttribute('data-opt')] = el.type === 'checkbox' ? el.checked : Number(el.value); });
      return out;
    };
    var saveDomains = function (btn) {
      var box = document.querySelector('[data-am-domains]');
      var area = box.querySelector('[data-domains]');
      var bad = box.querySelector('[data-domains-bad]');
      btn.disabled = true;
      fetch('/dash/guild/' + guildOf() + '/automod-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'link_domains_save', domains: area.value }) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          btn.disabled = false;
          if (data && data.ok) {
            area.value = data.domains.join('\\\\n');
            var parts = [];
            if (data.invalid.length) parts.push(cdt('These were not valid domains and were skipped: {a}', { a: data.invalid.join(', ') }));
            if (data.overflow) parts.push(cdt('Only the first {a} domains were kept.', { a: data.domains.length }));
            bad.textContent = parts.join(' '); bad.hidden = parts.length === 0;
            msg(cdt('Domains saved.'), true);
          } else if (data && data.unsupported) {
            area.disabled = true; btn.disabled = true;
            box.querySelector('[data-domains-note]').hidden = false;
          } else msg((data && data.message) || cdt('It could not be done.'), false);
        })
        .catch(function () { btn.disabled = false; msg(cdt('It could not be done.'), false); });
    };
    document.addEventListener('click', function (event) {
      var t = event.target;
      var btn = t.closest && t.closest('button');
      if (!btn) return;
      if (btn.hasAttribute('data-save-domains')) { saveDomains(btn); return; }
      var tile = btn.closest('.am-tile');
      var s = settings();
      var native = btn.getAttribute('data-add-native');
      var pack = btn.getAttribute('data-add-native-pack');
      var filter = btn.getAttribute('data-add-filter');
      var kind = btn.getAttribute('data-add-kind');
      if (native) send(Object.assign({ op: 'native_add', template: native, options: options(tile) }, s), btn, cdt('Rule added to Discord.'));
      else if (pack) send(Object.assign({ op: 'native_add', pack: pack }, s), btn, cdt('Pack added to Discord.'));
      else if (kind) {
        var extra = kind === 'mentions' ? { mentionLimit: Number(tile.querySelector('[data-limit]').value) } : kind === 'presets' ? { presets: Array.prototype.map.call(tile.querySelectorAll('[data-preset]:checked'), function (i) { return i.getAttribute('data-preset'); }) } : {};
        send(Object.assign({ op: 'native_add', kind: kind }, extra, s), btn, cdt('Rule added to Discord.'));
      } else if (filter) send({ op: 'filter_add', template: filter, options: options(tile), action: s.action, muteMinutes: s.muteMinutes, exemptRoleIds: s.exemptRoleIds, exemptChannelIds: s.exemptChannelIds }, btn, cdt('Filter added to Petto.'));
      else if (btn.hasAttribute('data-native-delete')) { window.dglConfirm(cdt('Remove this rule from Discord?'), { confirm: cdt('Remove') }).then(function (ok) { if (ok) send({ op: 'native_delete', id: btn.getAttribute('data-native-delete') }, btn, cdt('Rule removed.')); }); }
      else if (btn.hasAttribute('data-filter-delete')) { window.dglConfirm(cdt('Remove this filter?'), { confirm: cdt('Remove') }).then(function (ok) { if (ok) send({ op: 'filter_delete', id: Number(btn.getAttribute('data-filter-delete')) }, btn, cdt('Filter removed.')); }); }
    });
    document.addEventListener('change', function (event) {
      var el = event.target;
      if (el.hasAttribute && el.hasAttribute('data-native-toggle')) send({ op: 'native_toggle', id: el.getAttribute('data-native-toggle'), enabled: el.checked }, el, el.checked ? cdt('Rule on.') : cdt('Rule off.'));
      else if (el.hasAttribute && el.hasAttribute('data-filter-toggle')) send({ op: 'filter_toggle', id: Number(el.getAttribute('data-filter-toggle')), enabled: el.checked }, el, el.checked ? cdt('Filter on.') : cdt('Filter off.'));
    });
  })();
<\/script> <script>
  // The shortcuts scroll to a part of the long page, and the search hides the filters that do not match (and the headings left empty).
  (function () {
    if (window.__amNav) return;
    window.__amNav = true;
    document.addEventListener('click', function (event) {
      var button = event.target.closest && event.target.closest('[data-am-jump]'); if (!button) return;
      var id = button.getAttribute('data-am-jump');
      var target = id ? document.getElementById(id) : null;
      if (!target) return;
      if (target.hidden) {
        var filter = document.querySelector('[data-am-filter]');
        if (filter) { filter.value = ''; filter.dispatchEvent(new Event('input', { bubbles: true })); }
      }
      document.querySelectorAll('.am-jump-btn').forEach(function (b) { b.classList.toggle('is-on', b === button); });
      var behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      var scroller = document.getElementById('dgl-content');
      if (scroller && scroller.scrollHeight > scroller.clientHeight + 2) {
        var top = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 16;
        scroller.scrollTo({ top: Math.max(0, top), behavior: behavior });
      } else {
        target.scrollIntoView({ behavior: behavior, block: 'start' });
      }
    });
    document.addEventListener('input', function (event) {
      var box = event.target; if (!box.matches || !box.matches('[data-am-filter]')) return;
      var q = box.value.trim().toLowerCase();
      document.querySelectorAll('.am-tile').forEach(function (tile) { tile.hidden = !!q && (tile.getAttribute('data-am-search') || '').indexOf(q) === -1; });
      document.querySelectorAll('[data-am-heading]').forEach(function (heading) {
        var grid = heading.nextElementSibling; if (!grid || !grid.classList.contains('am-tiles')) return;
        var any = grid.querySelectorAll('.am-tile:not([hidden])').length > 0;
        heading.hidden = !any; grid.hidden = !any;
      });
    });
  })();
<\/script> `])), renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "automod-templates", "pageTitle": dt("AutoMod templates"), "data-astro-cid-riiul46j": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-riiul46j": true })} ${maybeRenderHead()}<div class="sx-page" data-astro-cid-riiul46j> <h1 data-astro-cid-riiul46j>${dt("AutoMod templates")}</h1> <a class="am-where"${addAttribute(`/dash/guild/${guildId}/moderation#anti-spam`, "href")} data-astro-cid-riiul46j> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chats-fill", "width": "18", "height": "18", "data-astro-cid-riiul46j": true })} <span data-astro-cid-riiul46j><b data-astro-cid-riiul46j>${dt("Looking for the spam, shouting or mute settings?")}</b><em data-astro-cid-riiul46j>${dt("Petto's own Anti-spam (repeated messages, mentions, invites and capital letters) and the Strikes that mute a member are in Moderation. These templates are filters that you add in Discord or in Petto.")}</em></span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "width": "14", "height": "14", "data-astro-cid-riiul46j": true })} </a> <div class="am-msg" data-am-msg hidden data-astro-cid-riiul46j></div> <div class="sx-tiles am-slots" data-astro-cid-riiul46j> <div class="sx-tile" data-astro-cid-riiul46j><span class="sx-tile-label" data-astro-cid-riiul46j>${dt("Keyword rules of Discord")}</span><b data-native-count data-astro-cid-riiul46j>–</b></div> <div class="sx-tile" data-astro-cid-riiul46j><span class="sx-tile-label" data-astro-cid-riiul46j>${dt("Petto filters")}</span><b data-astro-cid-riiul46j>${filters.length}/40</b></div> </div> <p class="am-warn" data-native-warn hidden data-astro-cid-riiul46j>${dt("Discord AutoMod could not be read right now.")} ${dt("The Petto filters work anyway.")}</p> <section class="sx-panel am-settings" data-am-settings data-astro-cid-riiul46j> <div class="sx-panel-head" data-astro-cid-riiul46j><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-riiul46j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:funnel-fill", "width": "17", "height": "17", "data-astro-cid-riiul46j": true })}</span><h2 data-astro-cid-riiul46j>${dt("Settings for what you add")}</h2></div> <div class="sx-grid" data-astro-cid-riiul46j> <div class="sx-field" data-astro-cid-riiul46j><label for="am-s-alert" data-astro-cid-riiul46j>${dt("Discord: alert channel")}</label> <select id="am-s-alert" data-s="alert" data-astro-cid-riiul46j><option value="" data-astro-cid-riiul46j>${dt("No alert")}</option>${textChannels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-riiul46j>#${c.name}</option>`)}</select> </div> <div class="sx-field" data-astro-cid-riiul46j><label for="am-s-timeout" data-astro-cid-riiul46j>${dt("Discord: also mute the member (minutes, 0 for no)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "am-s-timeout", "data-s": "timeout", "value": "0", "min": "0", "max": "40320", "data-astro-cid-riiul46j": true })}</div> <div class="sx-field sx-wide" data-astro-cid-riiul46j><label for="am-s-message" data-astro-cid-riiul46j>${dt("Discord: text the member sees when blocked")}</label><textarea id="am-s-message" class="dgl-autogrow sx-one" rows="1" data-s="message" maxlength="150"${addAttribute(dt("Optional"), "placeholder")} data-astro-cid-riiul46j></textarea></div> <div class="sx-field" data-astro-cid-riiul46j><label for="am-s-action" data-astro-cid-riiul46j>${dt("Petto: what happens")}</label> <select id="am-s-action" data-s="action" data-astro-cid-riiul46j>${Object.entries(actionNames).map(([k, v]) => renderTemplate`<option${addAttribute(k, "value")} data-astro-cid-riiul46j>${v}</option>`)}</select> </div> <div class="sx-field" data-astro-cid-riiul46j><label for="am-s-mute" data-astro-cid-riiul46j>${dt("Petto: minutes of mute")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "am-s-mute", "data-s": "mute", "value": "10", "min": "1", "max": "40320", "data-astro-cid-riiul46j": true })}</div> <div class="sx-field sx-wide" data-astro-cid-riiul46j><span class="sx-label" data-astro-cid-riiul46j>${dt("Roles that are never checked")}</span>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "am_exempt_roles", "options": roles, "selected": [], "placeholder": dt("Search roles..."), "data-astro-cid-riiul46j": true })}</div> <div class="sx-field sx-wide" data-astro-cid-riiul46j><span class="sx-label" data-astro-cid-riiul46j>${dt("Channels that are never checked")}</span>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "am_exempt_channels", "options": channels, "selected": [], "placeholder": dt("Search channels..."), "data-astro-cid-riiul46j": true })}</div> </div> <p class="sx-hint" data-astro-cid-riiul46j>${dt("Staff with Manage Messages and the immune roles are never checked by the Petto filters.")}</p> </section> <section class="sx-panel am-domains" data-am-domains data-astro-cid-riiul46j> <div class="sx-panel-head" data-astro-cid-riiul46j><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-riiul46j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:link-simple-bold", "width": "17", "height": "17", "data-astro-cid-riiul46j": true })}</span><h2 data-astro-cid-riiul46j>${dt("Allowed domains")}</h2></div> <p class="sx-lead" data-astro-cid-riiul46j>${dt('The "All links" filter of Petto lets a message through when every link in it is on this list (or a subdomain of one). Write one domain per line, like youtube.com.')}</p> <div class="sx-field" data-astro-cid-riiul46j><textarea id="am-allowed-domains" class="dgl-autogrow sx-mono" data-domains rows="4" maxlength="4000"${addAttribute(dt("Allowed domains"), "aria-label")}${addAttribute(dt("youtube.com, one per line"), "placeholder")}${addAttribute(!linkDomainsSupported, "disabled")} data-astro-cid-riiul46j>${linkDomains.join("\n")}</textarea></div> <div class="sx-foot" data-astro-cid-riiul46j> <button type="button" class="btn btn-accent btn-sm" data-save-domains${addAttribute(!linkDomainsSupported, "disabled")} data-astro-cid-riiul46j>${dt("Save domains")}</button> <span class="sx-hint" data-astro-cid-riiul46j>${dt("Up to {n} domains. Links to anything else are still caught, and Discord rules are not changed by this list.", { n: MAX_ALLOWED_DOMAINS })}</span> </div> <p class="am-note" data-domains-note${addAttribute(linkDomainsSupported, "hidden")} data-astro-cid-riiul46j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-riiul46j": true })}${dt("This setting is not available yet: Petto has not been updated on the server for it. Try again later.")}</p> <p class="am-note" data-domains-bad hidden data-astro-cid-riiul46j></p> </section> <div class="am-toolbar" data-astro-cid-riiul46j> <nav class="am-jump"${addAttribute(dt("AutoMod templates"), "aria-label")} data-astro-cid-riiul46j> ${jump.map((j) => renderTemplate`<button type="button" class="am-jump-btn"${addAttribute(j.id, "data-am-jump")} data-astro-cid-riiul46j>${j.label}</button>`)} </nav> <input type="search" class="am-search" data-am-filter${addAttribute(dt("Search filters..."), "placeholder")}${addAttribute(dt("Search filters..."), "aria-label")} data-astro-cid-riiul46j> </div> <h2 class="am-h" id="am-packs" data-am-heading data-astro-cid-riiul46j>${dt("Packs")}<span class="am-h-n" data-astro-cid-riiul46j>${PACKS.length}</span></h2> <div class="am-tiles dgl-stagger" data-astro-cid-riiul46j> ${PACKS.map((pack) => renderTemplate`<div class="am-tile"${addAttribute(pack, "data-pack")}${addAttribute(`${packInfo[pack].name} ${packInfo[pack].text}`.toLowerCase(), "data-am-search")} data-astro-cid-riiul46j> <div class="am-tile-head" data-astro-cid-riiul46j><span class="am-tile-icon" data-astro-cid-riiul46j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "17", "height": "17", "data-astro-cid-riiul46j": true })}</span><b data-astro-cid-riiul46j>${packInfo[pack].name}</b></div> <p data-astro-cid-riiul46j>${packInfo[pack].text}</p> <div class="am-btns" data-astro-cid-riiul46j><button type="button" class="btn btn-accent btn-sm"${addAttribute(pack, "data-add-native-pack")} data-astro-cid-riiul46j>${dt("Add to Discord (one rule)")}</button></div> </div>`)} </div> ${groups.map((group) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-riiul46j": true }, { "default": ($$result3) => renderTemplate` <h2 class="am-h"${addAttribute(`am-g-${group.id}`, "id")} data-am-heading data-astro-cid-riiul46j>${group.label}<span class="am-h-n" data-astro-cid-riiul46j>${TEMPLATES.filter((t) => t.group === group.id).length}</span></h2> <div class="am-tiles dgl-stagger" data-astro-cid-riiul46j> ${TEMPLATES.filter((t) => t.group === group.id).map((t) => renderTemplate`<div class="am-tile"${addAttribute(t.id, "data-template")}${addAttribute(`${info[t.id].name} ${info[t.id].text}`.toLowerCase(), "data-am-search")} data-astro-cid-riiul46j> <div class="am-tile-head" data-astro-cid-riiul46j><span class="am-tile-icon" data-astro-cid-riiul46j>${renderComponent($$result3, "Icon", $$Icon, { "name": t.icon, "width": "17", "height": "17", "data-astro-cid-riiul46j": true })}</span><b data-astro-cid-riiul46j>${info[t.id].name}</b></div> <p data-astro-cid-riiul46j>${info[t.id].text}</p> <code class="am-sample" data-astro-cid-riiul46j>${info[t.id].sample}</code> ${t.options.length > 0 && renderTemplate`<div class="am-opts" data-astro-cid-riiul46j> ${t.options.map((o) => o.type === "boolean" ? renderTemplate`<label class="sx-switch am-opt" data-astro-cid-riiul46j><input type="checkbox"${addAttribute(o.key, "data-opt")}${addAttribute(Boolean(o.default), "checked")} data-astro-cid-riiul46j><span class="sx-switch-text" data-astro-cid-riiul46j><b data-astro-cid-riiul46j>${optionLabels[o.key]}</b></span><i class="sx-toggle" data-astro-cid-riiul46j></i></label>` : renderTemplate`<div class="am-opt am-opt-num" data-astro-cid-riiul46j><span data-astro-cid-riiul46j>${optionLabels[o.key]}</span>${renderComponent($$result3, "SxNumber", $$SxNumber, { "data-opt": o.key, "value": Number(o.default), "min": o.min, "max": o.max, "data-astro-cid-riiul46j": true })}</div>`)} </div>`} <div class="am-btns" data-astro-cid-riiul46j> <button type="button" class="btn btn-accent btn-sm"${addAttribute(t.id, "data-add-native")} data-astro-cid-riiul46j>${dt("Add to Discord")}</button> <button type="button" class="btn btn-ghost btn-sm"${addAttribute(t.id, "data-add-filter")} data-astro-cid-riiul46j>${dt("Add to Petto")}</button> </div> </div>`)} </div> ` })}`)} <h2 class="am-h" id="am-discord-own" data-am-heading data-astro-cid-riiul46j>${dt("What Discord does by itself")}<span class="am-h-n" data-astro-cid-riiul46j>3</span></h2> <div class="am-tiles dgl-stagger" data-astro-cid-riiul46j> <div class="am-tile" data-kind="spam"${addAttribute(`${dt("Spam")} ${dt("Discord detects spam and floods of messages on its own.")}`.toLowerCase(), "data-am-search")} data-astro-cid-riiul46j> <div class="am-tile-head" data-astro-cid-riiul46j><span class="am-tile-icon" data-astro-cid-riiul46j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:siren-fill", "width": "17", "height": "17", "data-astro-cid-riiul46j": true })}</span><b data-astro-cid-riiul46j>${dt("Spam")}</b></div> <p data-astro-cid-riiul46j>${dt("Discord detects spam and floods of messages on its own.")}</p> <div class="am-btns" data-astro-cid-riiul46j><button type="button" class="btn btn-accent btn-sm" data-add-kind="spam" data-astro-cid-riiul46j>${dt("Add to Discord")}</button></div> </div> <div class="am-tile" data-kind="mentions"${addAttribute(`${dt("Mention limit")} ${dt("Blocks messages that mention too many people or roles, and mention raids.")}`.toLowerCase(), "data-am-search")} data-astro-cid-riiul46j> <div class="am-tile-head" data-astro-cid-riiul46j><span class="am-tile-icon" data-astro-cid-riiul46j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "17", "height": "17", "data-astro-cid-riiul46j": true })}</span><b data-astro-cid-riiul46j>${dt("Mention limit")}</b></div> <p data-astro-cid-riiul46j>${dt("Blocks messages that mention too many people or roles, and mention raids.")}</p> <div class="am-opts" data-astro-cid-riiul46j><div class="am-opt am-opt-num" data-astro-cid-riiul46j><span data-astro-cid-riiul46j>${dt("Most mentions allowed")}</span>${renderComponent($$result2, "SxNumber", $$SxNumber, { "data-limit": true, "value": "5", "min": "1", "max": "50", "data-astro-cid-riiul46j": true })}</div></div> <div class="am-btns" data-astro-cid-riiul46j><button type="button" class="btn btn-accent btn-sm" data-add-kind="mentions" data-astro-cid-riiul46j>${dt("Add to Discord")}</button></div> </div> <div class="am-tile" data-kind="presets"${addAttribute(`${dt("Word lists")} ${dt("The lists of words Discord keeps up to date.")}`.toLowerCase(), "data-am-search")} data-astro-cid-riiul46j> <div class="am-tile-head" data-astro-cid-riiul46j><span class="am-tile-icon" data-astro-cid-riiul46j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:funnel-fill", "width": "17", "height": "17", "data-astro-cid-riiul46j": true })}</span><b data-astro-cid-riiul46j>${dt("Word lists")}</b></div> <p data-astro-cid-riiul46j>${dt("The lists of words Discord keeps up to date.")}</p> <div class="am-opts" data-astro-cid-riiul46j> <label class="sx-switch am-opt" data-astro-cid-riiul46j><input type="checkbox" data-preset="profanity" checked data-astro-cid-riiul46j><span class="sx-switch-text" data-astro-cid-riiul46j><b data-astro-cid-riiul46j>${dt("Profanity")}</b></span><i class="sx-toggle" data-astro-cid-riiul46j></i></label> <label class="sx-switch am-opt" data-astro-cid-riiul46j><input type="checkbox" data-preset="sexual" checked data-astro-cid-riiul46j><span class="sx-switch-text" data-astro-cid-riiul46j><b data-astro-cid-riiul46j>${dt("Sexual content")}</b></span><i class="sx-toggle" data-astro-cid-riiul46j></i></label> <label class="sx-switch am-opt" data-astro-cid-riiul46j><input type="checkbox" data-preset="slurs" checked data-astro-cid-riiul46j><span class="sx-switch-text" data-astro-cid-riiul46j><b data-astro-cid-riiul46j>${dt("Slurs")}</b></span><i class="sx-toggle" data-astro-cid-riiul46j></i></label> </div> <div class="am-btns" data-astro-cid-riiul46j><button type="button" class="btn btn-accent btn-sm" data-add-kind="presets" data-astro-cid-riiul46j>${dt("Add to Discord")}</button></div> </div> </div> <h2 class="am-h" id="am-active-discord" data-am-heading data-astro-cid-riiul46j>${dt("Active in Discord")}</h2> <div class="am-list" data-native-list aria-busy="true" data-astro-cid-riiul46j><div class="sk-rows" aria-hidden="true" data-astro-cid-riiul46j><span class="sk" data-astro-cid-riiul46j></span><span class="sk" data-astro-cid-riiul46j></span><span class="sk" data-astro-cid-riiul46j></span></div></div> <p class="sx-empty" data-native-empty hidden data-astro-cid-riiul46j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-check", "width": "16", "height": "16", "data-astro-cid-riiul46j": true })}${dt("No AutoMod rules in Discord yet.")}</p> <h2 class="am-h" id="am-active-petto" data-am-heading data-astro-cid-riiul46j>${dt("Active in Petto")}<span class="am-h-n" data-astro-cid-riiul46j>${filters.length}</span></h2> ${filters.length === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-riiul46j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sparkle", "width": "16", "height": "16", "data-astro-cid-riiul46j": true })}${dt("No Petto filters yet.")}</p>` : renderTemplate`<div class="am-list" data-astro-cid-riiul46j> ${filters.map((f) => renderTemplate`<div class="am-item" data-astro-cid-riiul46j> <div class="am-item-main" data-astro-cid-riiul46j><b data-astro-cid-riiul46j>${ruleName(f)}</b><em data-astro-cid-riiul46j>${actionNames[f.action] ?? f.action}${f.action === "mute" ? ` \xB7 ${formatDuration(f.mute_minutes * 60)}` : ""} · ${dt("{n} hit(s)", { n: f.hits })}</em></div> <label class="am-switch" data-astro-cid-riiul46j><input type="checkbox"${addAttribute(f.enabled, "checked")}${addAttribute(f.id, "data-filter-toggle")} data-astro-cid-riiul46j><span data-astro-cid-riiul46j></span></label> <button type="button" class="am-del"${addAttribute(f.id, "data-filter-delete")}${addAttribute(dt("Remove"), "title")} data-astro-cid-riiul46j>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "14", "height": "14", "data-astro-cid-riiul46j": true })}</button> </div>`)} </div>`} </div> ` }));
}, "/home/runner/work/petto-web/petto-web/src/components/DashAutomodTemplates.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Automod = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Automod;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const [guildInfo, filtersRes, rolesRes, channelsRes, domainsRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    () => fetch(`${apiUrl}/rest/v1/automod_rules?guild_id=eq.${id}&select=id,name,template,options,action,mute_minutes,enabled,hits&order=id.asc`, { headers: apiHeaders }),
    () => getGuildList(Astro2, id, botToken, "roles"),
    () => getGuildList(Astro2, id, botToken, "channels"),
    // A database that does not have the column yet (the bot that adds it is not deployed) answers with an error: the list is then shown off.
    () => fetch(`${apiUrl}/rest/v1/automod_config?guild_id=eq.${id}&select=allowed_link_domains`, { headers: apiHeaders })
  ], 5);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const filters = filtersRes?.ok ? await filtersRes.json() : [];
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone").map((r) => ({ id: r.id, name: r.name }));
  const linkDomainsSupported = Boolean(domainsRes?.ok);
  const linkDomains = linkDomainsSupported ? (await domainsRes.json())[0]?.allowed_link_domains ?? [] : [];
  const channels = (channelsRes?.ok ? await channelsRes.json() : []).filter((c) => c.type === 0 || c.type === 5 || c.type === 4).map((c) => ({ id: c.id, name: c.name, category: c.type === 4 }));
  return renderTemplate`${renderComponent($$result, "DashAutomodTemplates", $$DashAutomodTemplates, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "filters": filters, "roles": roles, "channels": channels, "linkDomains": linkDomains, "linkDomainsSupported": linkDomainsSupported })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/automod.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/automod.astro";
const $$url = "/dash/guild/[id]/automod";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Automod,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
