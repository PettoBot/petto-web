import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead, d as renderComponent, F as Fragment, u as unescapeHTML } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$UserChip } from '../../../../chunks/UserChip_Bm_uT4Mw.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$ColorPicker } from '../../../../chunks/ColorPicker_DwzcbTkv.mjs';
import 'clsx';
import { m as makeT, g as getDashLang, a as dashLocale } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                              */
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$SxNumber } from '../../../../chunks/SxNumber_YL4vNksH.mjs';
import { f as formatDuration } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { u as callPettoBoosterRoles, v as renderPollMessage } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { g as getMemberProfiles, m as memberAvatarUrl } from '../../../../chunks/memberNames_skiCoAs8.mjs';
import { i as isV2Data } from '../../../../chunks/embedSchema_Bj4vwR3q.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$2 = createAstro("https://petto.sbs");
const $$MemberPick = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$MemberPick;
  const { guildId, name = "member_id", value = "", label = "" } = Astro2.props;
  const dt = makeT(getDashLang(Astro2));
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="mp" data-pick', ' data-astro-cid-azpex5pp> <input type="text" class="mp-input" data-pick-input', "", ' autocomplete="off" maxlength="40" data-astro-cid-azpex5pp> <input type="hidden"', "", ` data-pick-value data-astro-cid-azpex5pp> <span class="mp-ok" data-pick-ok hidden data-astro-cid-azpex5pp>\u2713</span> <div class="mp-results" data-pick-results hidden data-astro-cid-azpex5pp></div> </div> <script>
  if (!window.__memberPickBound) {
    window.__memberPickBound = true;
    var mpTimer = 0;
    var mpSeq = 0;
    var mpSet = function (wrap, id, name) {
      wrap.querySelector('[data-pick-value]').value = id || '';
      if (name != null) wrap.querySelector('[data-pick-input]').value = name;
      wrap.querySelector('[data-pick-ok]').hidden = !id;
      var list = wrap.querySelector('[data-pick-results]');
      list.hidden = true;
      list.textContent = '';
    };
    document.addEventListener('input', function (event) {
      var input = event.target && event.target.closest ? event.target.closest('[data-pick-input]') : null;
      if (!input) return;
      var wrap = input.closest('[data-pick]');
      var text = input.value.trim();
      var mention = /^<@!?(\\d{15,25})>$/.exec(text);
      if (/^\\d{15,25}$/.test(text) || mention) { mpSet(wrap, mention ? mention[1] : text, null); return; }
      mpSet(wrap, '', null);
      clearTimeout(mpTimer);
      if (text.length < 2) return;
      var seq = ++mpSeq;
      mpTimer = setTimeout(function () {
        fetch(wrap.getAttribute('data-search-url') + '?q=' + encodeURIComponent(text), { headers: { Accept: 'application/json' } })
          .then(function (res) { return res.ok ? res.json() : { members: [] }; })
          .then(function (data) {
            if (seq !== mpSeq) return;
            var list = wrap.querySelector('[data-pick-results]');
            list.textContent = '';
            (data.members || []).forEach(function (member) {
              var button = document.createElement('button');
              button.type = 'button';
              button.className = 'mp-result';
              button.setAttribute('data-pick-id', member.id);
              var img = document.createElement('img');
              img.src = member.avatar || '';
              img.alt = '';
              img.width = 20; img.height = 20;
              var name = document.createElement('b');
              name.textContent = member.displayName || member.username || member.id;
              var small = document.createElement('small');
              small.textContent = member.username ? '@' + member.username : member.id;
              button.appendChild(img); button.appendChild(name); button.appendChild(small);
              list.appendChild(button);
            });
            list.hidden = !list.children.length;
          })
          .catch(function () {});
      }, 250);
    });
    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target : null;
      if (!target) return;
      var result = target.closest('[data-pick-id]');
      if (result) {
        event.preventDefault();
        mpSet(result.closest('[data-pick]'), result.getAttribute('data-pick-id'), result.querySelector('b').textContent);
        return;
      }
      // A quick choice next to a picker (e.g. a booster without a role) fills the picker of its form.
      var quick = target.closest('[data-pick-quick]');
      if (quick) {
        var form = quick.closest('form');
        var wrap = form && form.querySelector('[data-pick]');
        if (wrap) mpSet(wrap, quick.getAttribute('data-pick-quick'), quick.getAttribute('data-pick-name'));
        return;
      }
      document.querySelectorAll('[data-pick-results]:not([hidden])').forEach(function (list) { if (!list.parentNode.contains(target)) list.hidden = true; });
    });
  }
<\/script> `], ["", '<div class="mp" data-pick', ' data-astro-cid-azpex5pp> <input type="text" class="mp-input" data-pick-input', "", ' autocomplete="off" maxlength="40" data-astro-cid-azpex5pp> <input type="hidden"', "", ` data-pick-value data-astro-cid-azpex5pp> <span class="mp-ok" data-pick-ok hidden data-astro-cid-azpex5pp>\u2713</span> <div class="mp-results" data-pick-results hidden data-astro-cid-azpex5pp></div> </div> <script>
  if (!window.__memberPickBound) {
    window.__memberPickBound = true;
    var mpTimer = 0;
    var mpSeq = 0;
    var mpSet = function (wrap, id, name) {
      wrap.querySelector('[data-pick-value]').value = id || '';
      if (name != null) wrap.querySelector('[data-pick-input]').value = name;
      wrap.querySelector('[data-pick-ok]').hidden = !id;
      var list = wrap.querySelector('[data-pick-results]');
      list.hidden = true;
      list.textContent = '';
    };
    document.addEventListener('input', function (event) {
      var input = event.target && event.target.closest ? event.target.closest('[data-pick-input]') : null;
      if (!input) return;
      var wrap = input.closest('[data-pick]');
      var text = input.value.trim();
      var mention = /^<@!?(\\\\d{15,25})>$/.exec(text);
      if (/^\\\\d{15,25}$/.test(text) || mention) { mpSet(wrap, mention ? mention[1] : text, null); return; }
      mpSet(wrap, '', null);
      clearTimeout(mpTimer);
      if (text.length < 2) return;
      var seq = ++mpSeq;
      mpTimer = setTimeout(function () {
        fetch(wrap.getAttribute('data-search-url') + '?q=' + encodeURIComponent(text), { headers: { Accept: 'application/json' } })
          .then(function (res) { return res.ok ? res.json() : { members: [] }; })
          .then(function (data) {
            if (seq !== mpSeq) return;
            var list = wrap.querySelector('[data-pick-results]');
            list.textContent = '';
            (data.members || []).forEach(function (member) {
              var button = document.createElement('button');
              button.type = 'button';
              button.className = 'mp-result';
              button.setAttribute('data-pick-id', member.id);
              var img = document.createElement('img');
              img.src = member.avatar || '';
              img.alt = '';
              img.width = 20; img.height = 20;
              var name = document.createElement('b');
              name.textContent = member.displayName || member.username || member.id;
              var small = document.createElement('small');
              small.textContent = member.username ? '@' + member.username : member.id;
              button.appendChild(img); button.appendChild(name); button.appendChild(small);
              list.appendChild(button);
            });
            list.hidden = !list.children.length;
          })
          .catch(function () {});
      }, 250);
    });
    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target : null;
      if (!target) return;
      var result = target.closest('[data-pick-id]');
      if (result) {
        event.preventDefault();
        mpSet(result.closest('[data-pick]'), result.getAttribute('data-pick-id'), result.querySelector('b').textContent);
        return;
      }
      // A quick choice next to a picker (e.g. a booster without a role) fills the picker of its form.
      var quick = target.closest('[data-pick-quick]');
      if (quick) {
        var form = quick.closest('form');
        var wrap = form && form.querySelector('[data-pick]');
        if (wrap) mpSet(wrap, quick.getAttribute('data-pick-quick'), quick.getAttribute('data-pick-name'));
        return;
      }
      document.querySelectorAll('[data-pick-results]:not([hidden])').forEach(function (list) { if (!list.parentNode.contains(target)) list.hidden = true; });
    });
  }
<\/script> `])), maybeRenderHead(), addAttribute(`/dash/guild/${guildId}/members-search`, "data-search-url"), addAttribute(label, "value"), addAttribute(dt("Type a name or paste an ID"), "placeholder"), addAttribute(name, "name"), addAttribute(value, "value"));
}, "/home/runner/work/petto-web/petto-web/src/components/MemberPick.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashCommunity = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashCommunity;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const dth = makeT(dashLang, true);
  const { user, guildId, guildName, guildIcon, report, messageLinks = { enabled: false, ignoredChannels: [] }, booster, boosterRoles, boosterStatus, roleDetails, prefix, notice = null, reputationTotal = 0, repLog = [], roles, channels, saved, reputation, reputationTop, polls, community = { boosterRoles: 0, reputationMembers: 0, openPolls: 0, polls: 0, feed: [] }, pollError, people = {}, pollDesigns = [], section } = Astro2.props;
  const sectionMeta = { settings: dt("Community settings"), reputation: dt("Reputation"), boosters: dt("Booster roles"), polls: dt("Polls") };
  const selectedSection = sectionMeta[section ?? ""] ? section ?? "" : "settings";
  const selectedTitle = sectionMeta[selectedSection];
  const locale = dashLocale(dashLang);
  const num = (value) => value.toLocaleString(locale);
  function roleName(id) {
    return roles.find((r) => r.id === id)?.name ?? id;
  }
  function roleHex(id) {
    const color = roleDetails.find((r) => r.id === id)?.color ?? 0;
    return color ? `#${color.toString(16).padStart(6, "0")}` : null;
  }
  const channelName = (id) => id ? channels.find((c) => c.id === id)?.name ?? id : null;
  const nameOf = (id) => people[id]?.name ?? id;
  const avatarOf = (id) => people[id]?.avatar ?? `https://cdn.discordapp.com/embed/avatars/${Number(id.slice(-3)) % 6}.png`;
  const ago = (iso) => {
    const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1e3);
    return seconds >= 30 * 86400 ? new Date(iso).toLocaleDateString(locale) : dt("{a} ago", { a: formatDuration(seconds, { locale }) });
  };
  const until = (iso) => formatDuration(Math.max(0, (new Date(iso).getTime() - Date.now()) / 1e3), { locale });
  const lapsed = boosterRoles.filter((row) => row.boosting === false || row.in_server === false);
  const eventIcon = { rep: "ph:medal-fill", poll: "ph:chart-bar-fill", booster: "ph:sparkle-fill" };
  const eventColor = { rep: "#fed53c", poll: "#6fb4ea", booster: "#f78fb3" };
  const eventLabel = { rep: dt("Reputation"), poll: dt("Polls"), booster: dt("Booster roles") };
  const unboostChoices = [
    ["keep", "ph:lock-simple-fill", dt("Keep the role"), dt("Nothing happens. Use Clean up below when you want to remove old roles.")],
    ["remove", "ph:user-minus-fill", dt("Take it off"), dt("The role is taken off the member and the people it is shared with, and given back if they boost again.")],
    ["delete", "ph:trash-fill", dt("Delete it"), dt("The role is deleted, also when the member leaves the server.")]
  ];
  const maxPoints = Math.max(1, reputationTop[0]?.points ?? 1);
  const pollVotes = polls.reduce((sum, poll) => sum + poll.voters, 0);
  const pollsOpen = polls.filter((poll) => !poll.closed).length;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": selectedSection === "settings" ? "community" : `community-${selectedSection}`, "pageTitle": selectedTitle, "data-astro-cid-awpqqtwg": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", " ", "<h1 data-astro-cid-awpqqtwg>", "</h1> ", "", "", "", "", "", `<script>
    (function () {
      var letters = ['\\u{1F1E6}','\\u{1F1E7}','\\u{1F1E8}','\\u{1F1E9}','\\u{1F1EA}','\\u{1F1EB}','\\u{1F1EC}','\\u{1F1ED}','\\u{1F1EE}','\\u{1F1EF}'];
      function renderPollPreview(form) {
        var box = form.querySelector('[data-poll-preview]');
        if (!box) return;
        var q = form.querySelector('[name="question"]').value.trim();
        var lines = form.querySelector('[name="options"]').value.split(/\\r?\\n/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 10);
        var multi = form.querySelector('[name="multi"]').checked;
        var qEl = box.querySelector('[data-pv-q]');
        if (qEl) { if (!qEl.getAttribute('data-sample')) qEl.setAttribute('data-sample', qEl.textContent); qEl.textContent = q || qEl.getAttribute('data-sample'); }
        var typeEl = box.querySelector('[data-pv-type]');
        if (typeEl) { if (!typeEl.getAttribute('data-single')) typeEl.setAttribute('data-single', typeEl.textContent); typeEl.textContent = multi ? typeEl.getAttribute('data-multi') || typeEl.getAttribute('data-single') : typeEl.getAttribute('data-single'); }
        var opts = box.querySelector('[data-pv-opts]');
        if (!opts) return;
        // Nothing written yet: two sample options show how the poll will look.
        var sample = false;
        if (!lines.length) { try { lines = JSON.parse(box.getAttribute('data-sample-opts') || '[]'); sample = true; } catch (e) { lines = []; } }
        opts.classList.toggle('is-sample', sample);
        opts.textContent = '';
        lines.forEach(function (line, i) {
          var row = document.createElement('div');
          row.className = 'cm-pv-opt';
          var name = document.createElement('span');
          name.textContent = letters[i] + ' ' + line;
          var bar = document.createElement('i');
          row.appendChild(name); row.appendChild(bar);
          opts.appendChild(row);
        });
      }
      function init() {
        var f = document.querySelector('.cm-poll-create');
        if (f) renderPollPreview(f);
      }
      if (!window.__pollPreviewBound) {
        window.__pollPreviewBound = true;
        document.addEventListener('input', function (event) {
          var form = event.target && event.target.closest ? event.target.closest('.cm-poll-create') : null;
          if (form) renderPollPreview(form);
        });
        document.addEventListener('change', function (event) {
          var form = event.target && event.target.closest ? event.target.closest('.cm-poll-create') : null;
          if (form) renderPollPreview(form);
        });
      }
      init();

      // The votes of the open polls follow the votes as they come in, every 4 seconds while the page is in view.
      if (!window.__pollLive) {
        window.__pollLive = true;
        var pollTimer = null;
        var pollTick = function () {
          var box = document.querySelector('.cm-polls-existing[data-live-url]');
          var openPolls = box ? box.querySelectorAll('.cm-poll[data-open="1"]') : [];
          if (!box || !openPolls.length || document.hidden) { pollTimer = setTimeout(pollTick, 4000); return; }
          fetch(box.getAttribute('data-live-url'), { cache: 'no-store', headers: { Accept: 'application/json' } })
            .then(function (res) { return res.ok ? res.json() : null; })
            .then(function (data) {
              if (!data || !Array.isArray(data.polls)) return;
              data.polls.forEach(function (poll) {
                var card = box.querySelector('.cm-poll[data-poll-id="' + poll.id + '"]');
                if (!card) return;
                var voters = card.querySelector('[data-poll-voters]');
                if (voters) voters.textContent = String(poll.voters);
                var run = document.querySelector('.cm-run [data-run="' + poll.id + '"]');
                if (run) {
                  if (poll.closed) run.remove();
                  else { var runVoters = run.querySelector('[data-run-voters]'); if (runVoters) runVoters.textContent = String(poll.voters); }
                }
                card.querySelectorAll('[data-poll-option]').forEach(function (row) {
                  var index = Number(row.getAttribute('data-poll-option'));
                  var count = poll.counts[index] || 0;
                  var pct = poll.voters > 0 ? Math.round((count / poll.voters) * 100) : 0;
                  var label = row.querySelector('[data-poll-count]');
                  if (label) label.textContent = count + ' \xB7 ' + pct + '%';
                  var bar = row.querySelector('[data-poll-bar]');
                  if (bar) bar.style.width = pct + '%';
                });
                if (poll.closed && card.getAttribute('data-open') === '1') {
                  card.setAttribute('data-open', '');
                  card.classList.add('closed');
                  var status = card.querySelector('[data-poll-status]');
                  if (status) status.textContent = status.getAttribute('data-label-closed') || 'Closed';
                  var end = card.querySelector('form [value="close_poll"]');
                  if (end && end.closest('form')) end.closest('form').hidden = true;
                }
              });
            })
            .catch(function () {})
            .then(function () { pollTimer = setTimeout(pollTick, 4000); });
        };
        document.addEventListener('visibilitychange', function () { if (!document.hidden) { clearTimeout(pollTimer); pollTimer = setTimeout(pollTick, 300); } });
        pollTimer = setTimeout(pollTick, 4000);
      }
    })();
  <\/script> `], [" ", " ", " ", "<h1 data-astro-cid-awpqqtwg>", "</h1> ", "", "", "", "", "", `<script>
    (function () {
      var letters = ['\\\\u{1F1E6}','\\\\u{1F1E7}','\\\\u{1F1E8}','\\\\u{1F1E9}','\\\\u{1F1EA}','\\\\u{1F1EB}','\\\\u{1F1EC}','\\\\u{1F1ED}','\\\\u{1F1EE}','\\\\u{1F1EF}'];
      function renderPollPreview(form) {
        var box = form.querySelector('[data-poll-preview]');
        if (!box) return;
        var q = form.querySelector('[name="question"]').value.trim();
        var lines = form.querySelector('[name="options"]').value.split(/\\\\r?\\\\n/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 10);
        var multi = form.querySelector('[name="multi"]').checked;
        var qEl = box.querySelector('[data-pv-q]');
        if (qEl) { if (!qEl.getAttribute('data-sample')) qEl.setAttribute('data-sample', qEl.textContent); qEl.textContent = q || qEl.getAttribute('data-sample'); }
        var typeEl = box.querySelector('[data-pv-type]');
        if (typeEl) { if (!typeEl.getAttribute('data-single')) typeEl.setAttribute('data-single', typeEl.textContent); typeEl.textContent = multi ? typeEl.getAttribute('data-multi') || typeEl.getAttribute('data-single') : typeEl.getAttribute('data-single'); }
        var opts = box.querySelector('[data-pv-opts]');
        if (!opts) return;
        // Nothing written yet: two sample options show how the poll will look.
        var sample = false;
        if (!lines.length) { try { lines = JSON.parse(box.getAttribute('data-sample-opts') || '[]'); sample = true; } catch (e) { lines = []; } }
        opts.classList.toggle('is-sample', sample);
        opts.textContent = '';
        lines.forEach(function (line, i) {
          var row = document.createElement('div');
          row.className = 'cm-pv-opt';
          var name = document.createElement('span');
          name.textContent = letters[i] + ' ' + line;
          var bar = document.createElement('i');
          row.appendChild(name); row.appendChild(bar);
          opts.appendChild(row);
        });
      }
      function init() {
        var f = document.querySelector('.cm-poll-create');
        if (f) renderPollPreview(f);
      }
      if (!window.__pollPreviewBound) {
        window.__pollPreviewBound = true;
        document.addEventListener('input', function (event) {
          var form = event.target && event.target.closest ? event.target.closest('.cm-poll-create') : null;
          if (form) renderPollPreview(form);
        });
        document.addEventListener('change', function (event) {
          var form = event.target && event.target.closest ? event.target.closest('.cm-poll-create') : null;
          if (form) renderPollPreview(form);
        });
      }
      init();

      // The votes of the open polls follow the votes as they come in, every 4 seconds while the page is in view.
      if (!window.__pollLive) {
        window.__pollLive = true;
        var pollTimer = null;
        var pollTick = function () {
          var box = document.querySelector('.cm-polls-existing[data-live-url]');
          var openPolls = box ? box.querySelectorAll('.cm-poll[data-open="1"]') : [];
          if (!box || !openPolls.length || document.hidden) { pollTimer = setTimeout(pollTick, 4000); return; }
          fetch(box.getAttribute('data-live-url'), { cache: 'no-store', headers: { Accept: 'application/json' } })
            .then(function (res) { return res.ok ? res.json() : null; })
            .then(function (data) {
              if (!data || !Array.isArray(data.polls)) return;
              data.polls.forEach(function (poll) {
                var card = box.querySelector('.cm-poll[data-poll-id="' + poll.id + '"]');
                if (!card) return;
                var voters = card.querySelector('[data-poll-voters]');
                if (voters) voters.textContent = String(poll.voters);
                var run = document.querySelector('.cm-run [data-run="' + poll.id + '"]');
                if (run) {
                  if (poll.closed) run.remove();
                  else { var runVoters = run.querySelector('[data-run-voters]'); if (runVoters) runVoters.textContent = String(poll.voters); }
                }
                card.querySelectorAll('[data-poll-option]').forEach(function (row) {
                  var index = Number(row.getAttribute('data-poll-option'));
                  var count = poll.counts[index] || 0;
                  var pct = poll.voters > 0 ? Math.round((count / poll.voters) * 100) : 0;
                  var label = row.querySelector('[data-poll-count]');
                  if (label) label.textContent = count + ' \xB7 ' + pct + '%';
                  var bar = row.querySelector('[data-poll-bar]');
                  if (bar) bar.style.width = pct + '%';
                });
                if (poll.closed && card.getAttribute('data-open') === '1') {
                  card.setAttribute('data-open', '');
                  card.classList.add('closed');
                  var status = card.querySelector('[data-poll-status]');
                  if (status) status.textContent = status.getAttribute('data-label-closed') || 'Closed';
                  var end = card.querySelector('form [value="close_poll"]');
                  if (end && end.closest('form')) end.closest('form').hidden = true;
                }
              });
            })
            .catch(function () {})
            .then(function () { pollTimer = setTimeout(pollTick, 4000); });
        };
        document.addEventListener('visibilitychange', function () { if (!document.hidden) { clearTimeout(pollTimer); pollTimer = setTimeout(pollTick, 300); } });
        pollTimer = setTimeout(pollTick, 4000);
      }
    })();
  <\/script> `])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-awpqqtwg": true }), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-awpqqtwg": true }), maybeRenderHead(), selectedTitle, saved && !notice && renderTemplate`<div class="sx-flash" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-awpqqtwg": true })}${dt("Saved.")}</div>`, notice && (notice.ok ? renderTemplate`<div class="sx-flash" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-awpqqtwg": true })}${notice.text}</div>` : renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-awpqqtwg": true })}${notice.text}</div>`), selectedSection === "settings" && renderTemplate`<div class="sx-page cm-page" data-astro-cid-awpqqtwg> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Reports"), value: 0, text: report.enabled ? dt("On") : dt("Off"), tone: "messages" },
    { label: dt("Message links"), value: 0, text: messageLinks.enabled ? dt("On") : dt("Off"), tone: "voice" },
    { label: dt("Booster roles"), value: community.boosterRoles, tone: "invites" },
    { label: dt("Members with points"), value: community.reputationMembers, tone: "reactions" },
    { label: dt("Open polls"), value: community.openPolls, tone: "joins" }
  ], "data-astro-cid-awpqqtwg": true })} <div class="sx-duo cm-duo" data-astro-cid-awpqqtwg> <form method="POST" class="sx-panel cm-form" data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="report" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:flag-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Reports")}</h2> <label class="sx-toggle-only" data-astro-cid-awpqqtwg><input type="checkbox" name="enabled"${addAttribute(report.enabled, "checked")}${addAttribute(dt("Reports"), "aria-label")} data-astro-cid-awpqqtwg><i class="sx-toggle" data-astro-cid-awpqqtwg></i></label> </div> <p class="sx-lead cm-lead" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth('Where <code>/report</code> and the "Report Message" action send reports to staff.'))}` })}</p> <div class="cm-body" data-sx-needs="enabled" data-astro-cid-awpqqtwg> <div class="sx-field" data-astro-cid-awpqqtwg> <label for="cm-report-channel" data-astro-cid-awpqqtwg>${dt("Destination channel")}</label> <select id="cm-report-channel" name="channel_id" data-astro-cid-awpqqtwg> <option value="" data-astro-cid-awpqqtwg>${dt("None")}</option> ${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === report.channelId, "selected")} data-astro-cid-awpqqtwg>#${c.name}</option>`)} </select> </div> <div class="sx-field" data-astro-cid-awpqqtwg> <label for="cm-report-role" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth('Urgent moderator role <span class="cm-label-muted">optional</span>'))}` })}</label> <select id="cm-report-role" name="urgent_role_id" data-astro-cid-awpqqtwg> <option value="" data-astro-cid-awpqqtwg>${dt("No role mention")}</option> ${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.id === report.urgentRoleId, "selected")} data-astro-cid-awpqqtwg>@${r.name}</option>`)} </select> <span class="sx-hint" data-astro-cid-awpqqtwg>${dt("Members can choose \u201CPing Moderators\u201D in the report form. This role is mentioned only for those urgent reports.")}</span> </div> <label class="sx-switch" data-astro-cid-awpqqtwg><input type="checkbox" name="anonymous_reporting_enabled"${addAttribute(report.anonymousReportingEnabled, "checked")} data-astro-cid-awpqqtwg><span class="sx-switch-text" data-astro-cid-awpqqtwg><b data-astro-cid-awpqqtwg>${dt("Allow anonymous reports")}</b></span><i class="sx-toggle" data-astro-cid-awpqqtwg></i></label> </div> <div class="sx-foot cm-foot" data-astro-cid-awpqqtwg><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-awpqqtwg>${dt("Save")}</button></div> </form> <form method="POST" class="sx-panel cm-form" data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="message_links" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:link-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Message link embeds")}</h2> <label class="sx-toggle-only" data-astro-cid-awpqqtwg><input type="checkbox" name="enabled"${addAttribute(messageLinks.enabled, "checked")}${addAttribute(dt("Message link embeds"), "aria-label")} data-astro-cid-awpqqtwg><i class="sx-toggle" data-astro-cid-awpqqtwg></i></label> </div> <p class="sx-lead cm-lead" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("When a member posts the link of a message of this server, Petto shows it in an embed. Also <code>{p}messagelinks</code>. Off until you turn it on.", { p: prefix }))}` })}</p> <div class="cm-body" data-sx-needs="enabled" data-astro-cid-awpqqtwg> <div class="sx-field" data-astro-cid-awpqqtwg> <span class="sx-label" data-astro-cid-awpqqtwg>${dt("Ignored channels")}</span> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "ignored_channels", "options": channels.map((c) => ({ id: c.id, name: `#${c.name}` })), "selected": messageLinks.ignoredChannels, "placeholder": dt("None"), "data-astro-cid-awpqqtwg": true })} <span class="sx-hint" data-astro-cid-awpqqtwg>${dt("Links posted in these channels, and messages that live in them, are never shown in embeds.")}</span> </div> <p class="cm-note" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-slash-fill", "width": "15", "height": "15", "data-astro-cid-awpqqtwg": true })}${dt("It only shows messages the member who posted the link can already see: links to other servers, and to NSFW channels from a channel that is not NSFW, are left alone.")}</p> </div> <div class="sx-foot cm-foot" data-astro-cid-awpqqtwg><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-awpqqtwg>${dt("Save")}</button></div> </form> </div> <div class="cm-links dgl-stagger" data-astro-cid-awpqqtwg> <a class="cm-link"${addAttribute(`/dash/guild/${guildId}/community?section=reputation`, "href")} data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:medal-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <span class="cm-link-text" data-astro-cid-awpqqtwg> <span class="cm-link-title" data-astro-cid-awpqqtwg><b data-astro-cid-awpqqtwg>${dt("Reputation")}</b><span${addAttribute(["cm-pill", reputation.enabled ? "on" : "off"], "class:list")} data-astro-cid-awpqqtwg>${reputation.enabled ? dt("On") : dt("Off")}</span></span> <em data-astro-cid-awpqqtwg>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("A point members give each other with <code>{p}rep give</code>: who can give and where, reward roles, the leaderboard and the recent points.", { p: prefix }))}` })}</em> <small data-astro-cid-awpqqtwg>${dt("{a} members with points \xB7 {b} reward roles", { a: num(community.reputationMembers), b: num(reputation.rewards.length) })}</small> </span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "class": "cm-link-go", "width": "14", "height": "14", "data-astro-cid-awpqqtwg": true })} </a> <a class="cm-link"${addAttribute(`/dash/guild/${guildId}/community?section=boosters`, "href")} data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sparkle-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <span class="cm-link-text" data-astro-cid-awpqqtwg> <span class="cm-link-title" data-astro-cid-awpqqtwg><b data-astro-cid-awpqqtwg>${dt("Booster roles")}</b><span${addAttribute(["cm-pill", booster.enabled ? "on" : "off"], "class:list")} data-astro-cid-awpqqtwg>${booster.enabled ? dt("On") : dt("Off")}</span></span> <em data-astro-cid-awpqqtwg>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("Custom colored roles boosters create for themselves with <code>{p}boosterrole</code>: what they may change, limits, the name filter and every booster role.", { p: prefix }))}` })}</em> <small data-astro-cid-awpqqtwg>${dt("{a} booster roles", { a: num(community.boosterRoles) })}</small> </span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "class": "cm-link-go", "width": "14", "height": "14", "data-astro-cid-awpqqtwg": true })} </a> <a class="cm-link"${addAttribute(`/dash/guild/${guildId}/community?section=polls`, "href")} data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chart-bar-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <span class="cm-link-text" data-astro-cid-awpqqtwg> <span class="cm-link-title" data-astro-cid-awpqqtwg><b data-astro-cid-awpqqtwg>${dt("Polls")}</b></span> <em data-astro-cid-awpqqtwg>${dt("Publish a button-voted poll directly to a channel. Members can change their vote until you close it.")}</em> <small data-astro-cid-awpqqtwg>${dt("{a} open polls \xB7 {b} recent", { a: num(community.openPolls), b: num(community.polls) })}</small> </span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "class": "cm-link-go", "width": "14", "height": "14", "data-astro-cid-awpqqtwg": true })} </a> </div> <section class="sx-panel cm-feed" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Latest in the community")}</h2> </div> ${community.feed.length === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise", "width": "20", "height": "20", "data-astro-cid-awpqqtwg": true })}${dt("Points given, polls and booster roles show up here as they happen.")}</p>` : renderTemplate`<ul class="cm-events"${addAttribute(`--rows:${Math.ceil(community.feed.length / 2)}`, "style")} data-astro-cid-awpqqtwg> ${community.feed.map((event) => renderTemplate`<li class="cm-event"${addAttribute(`--c:${eventColor[event.kind]}`, "style")} data-astro-cid-awpqqtwg> <span class="cm-event-icon" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": eventIcon[event.kind], "width": "15", "height": "15", "data-astro-cid-awpqqtwg": true })}</span> <span class="cm-event-text" data-astro-cid-awpqqtwg> <span data-astro-cid-awpqqtwg> ${event.kind === "rep" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("<b>{a}</b> gave a point to <b>{b}</b>", { a: nameOf(event.userId), b: nameOf(event.otherId ?? "") }))}` })}`} ${event.kind === "poll" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("<b>{a}</b> started the poll \u201C{b}\u201D", { a: nameOf(event.userId), b: event.text.length > 70 ? `${event.text.slice(0, 69)}\u2026` : event.text }))}` })}`} ${event.kind === "booster" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("<b>{a}</b> got a booster role", { a: nameOf(event.userId) }))}` })}`} </span> <small data-astro-cid-awpqqtwg>${eventLabel[event.kind]}${event.channelId ? ` \xB7 #${channelName(event.channelId)}` : ""}</small> </span> <time class="cm-event-when"${addAttribute(event.at, "datetime")} data-astro-cid-awpqqtwg>${ago(event.at)}</time> </li>`)} </ul>`} </section> </div>`, selectedSection === "reputation" && renderTemplate`<div class="sx-page cm-page" data-astro-cid-awpqqtwg> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Reputation"), value: 0, text: reputation.enabled ? dt("On") : dt("Off"), tone: "joins" },
    { label: dt("Members with points"), value: reputationTotal, tone: "messages" },
    { label: dt("Most points"), value: reputationTop[0]?.points ?? 0, tone: "reactions" },
    { label: dt("Reward roles"), value: reputation.rewards.length, tone: "invites" },
    { label: dt("Wait between gives"), value: 0, text: reputation.cooldownHours ? formatDuration(reputation.cooldownHours * 3600, { locale }) : dt("None"), tone: "voice" }
  ], "data-astro-cid-awpqqtwg": true })} <form method="POST" class="sx-panel cm-form" data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="reputation" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:medal-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Reputation")}</h2> <label class="sx-toggle-only" data-astro-cid-awpqqtwg><input type="checkbox" name="enabled"${addAttribute(reputation.enabled, "checked")}${addAttribute(dt("Reputation"), "aria-label")} data-astro-cid-awpqqtwg><i class="sx-toggle" data-astro-cid-awpqqtwg></i></label> </div> <p class="sx-lead cm-lead" data-astro-cid-awpqqtwg>${dt("When off, nobody can give points. The points and the leaderboard stay.")}</p> <div class="cm-cols" data-sx-needs="enabled" data-astro-cid-awpqqtwg> <div class="cm-body" data-astro-cid-awpqqtwg> <div class="sx-field" data-astro-cid-awpqqtwg> <label for="cm-rep-wait" data-astro-cid-awpqqtwg>${dt("Wait between gives (hours)")}</label> ${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "cm-rep-wait", "name": "cooldown_hours", "value": reputation.cooldownHours, "min": "0", "max": "720", "data-astro-cid-awpqqtwg": true })} <span class="sx-hint" data-astro-cid-awpqqtwg>${dt("How long a member waits before giving another point. 0 = no wait.")}</span> </div> <div class="sx-sub" data-astro-cid-awpqqtwg> <h3 data-astro-cid-awpqqtwg>${dt("Where")}</h3> <div class="sx-field" data-astro-cid-awpqqtwg> <span class="sx-label" data-astro-cid-awpqqtwg>${dt("Only in these channels")}</span> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "channel_ids", "options": channels.map((c) => ({ id: c.id, name: `#${c.name}` })), "selected": reputation.channelIds, "placeholder": dt("Every channel"), "data-astro-cid-awpqqtwg": true })} <span class="sx-hint" data-astro-cid-awpqqtwg>${dt("Empty: every channel. Threads count as their channel.")}</span> </div> </div> </div> <div class="cm-body" data-astro-cid-awpqqtwg> <h3 class="cm-h3" data-astro-cid-awpqqtwg>${dt("Who can give")}</h3> <div class="sx-field" data-astro-cid-awpqqtwg> <span class="sx-label" data-astro-cid-awpqqtwg>${dt("Only members with these roles")}</span> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "giver_role_ids", "options": roles, "selected": reputation.giverRoleIds, "placeholder": dt("Everyone"), "data-astro-cid-awpqqtwg": true })} <span class="sx-hint" data-astro-cid-awpqqtwg>${dt("Empty: everyone can give.")}</span> </div> <div class="sx-field" data-astro-cid-awpqqtwg> <span class="sx-label" data-astro-cid-awpqqtwg>${dt("Blocked roles")}</span> ${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "blocked_role_ids", "options": roles, "selected": reputation.blockedRoleIds, "placeholder": dt("None"), "data-astro-cid-awpqqtwg": true })} <span class="sx-hint" data-astro-cid-awpqqtwg>${dt("Members with one of these roles can neither give nor receive points.")}</span> </div> </div> </div> <div class="sx-foot cm-foot" data-astro-cid-awpqqtwg><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-awpqqtwg>${dt("Save")}</button></div> </form> <div class="sx-duo cm-duo" data-astro-cid-awpqqtwg> <section class="sx-panel" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:gift-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Reward roles")}</h2> </div> <p class="sx-lead cm-lead" data-astro-cid-awpqqtwg>${dt("A member gets the role when they reach the points. Roles already given stay when points are reset.")}</p> ${reputation.rewards.length > 0 ? renderTemplate`<div class="sx-list" data-astro-cid-awpqqtwg> ${reputation.rewards.map((reward) => renderTemplate`<form method="POST" class="sx-row cm-reward" data-no-dirty data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="rep_reward_remove" data-astro-cid-awpqqtwg> <input type="hidden" name="points"${addAttribute(reward.points, "value")} data-astro-cid-awpqqtwg> <b class="cm-pts-badge" data-astro-cid-awpqqtwg>${dt("{a} pts", { a: num(reward.points) })}</b> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right", "width": "12", "height": "12", "class": "cm-arrow", "data-astro-cid-awpqqtwg": true })} <span class="cm-role" data-astro-cid-awpqqtwg><i class="cm-dot"${addAttribute(`--c:${roleHex(reward.roleId) ?? "var(--text-dim)"}`, "style")} data-astro-cid-awpqqtwg></i>@${roleName(reward.roleId)}</span> <button type="submit" class="sx-iconbtn"${addAttribute(dt("Remove"), "title")}${addAttribute(dt("Remove"), "aria-label")} data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x-bold", "width": "13", "height": "13", "data-astro-cid-awpqqtwg": true })}</button> </form>`)} </div>` : renderTemplate`<p class="sx-empty" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:gift-fill", "width": "20", "height": "20", "data-astro-cid-awpqqtwg": true })}${dt("No reward roles yet. Add the first one below.")}</p>`} <form method="POST" class="sx-sub cm-add" data-no-dirty data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="rep_reward_add" data-astro-cid-awpqqtwg> <h3 data-astro-cid-awpqqtwg>${dt("Add")}</h3> <div class="cm-add-row" data-astro-cid-awpqqtwg> <div class="sx-field" data-astro-cid-awpqqtwg><label for="cm-reward-points" data-astro-cid-awpqqtwg>${dt("Points")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "cm-reward-points", "name": "points", "value": "", "min": "1", "max": "1000000", "placeholder": "10", "required": true, "data-astro-cid-awpqqtwg": true })}</div> <div class="sx-field" data-astro-cid-awpqqtwg> <label for="cm-reward-role" data-astro-cid-awpqqtwg>${dt("Role")}</label> <select id="cm-reward-role" name="role_id" required data-give-role data-astro-cid-awpqqtwg> <option value="" disabled selected data-astro-cid-awpqqtwg>${dt("Choose a role")}</option> ${roleDetails.filter((r) => !r.managed).map((r) => renderTemplate`<option${addAttribute(r.id, "value")} data-astro-cid-awpqqtwg>@${r.name}</option>`)} </select> </div> </div> <div class="sx-foot" data-astro-cid-awpqqtwg><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-awpqqtwg": true })}${dt("Add")}</button></div> </form> </section> <form method="POST" class="sx-panel cm-form" data-no-dirty data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="rep_set" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sliders-horizontal-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Change a member's points")}</h2> </div> <p class="sx-lead cm-lead" data-astro-cid-awpqqtwg>${dt("Sets the points of any member. 0 resets them.")}</p> <div class="cm-body" data-astro-cid-awpqqtwg> <div class="sx-field" data-astro-cid-awpqqtwg><span class="sx-label" data-astro-cid-awpqqtwg>${dt("Member")}</span>${renderComponent($$result2, "MemberPick", $$MemberPick, { "guildId": guildId, "data-astro-cid-awpqqtwg": true })}</div> ${reputationTop.length > 0 && renderTemplate`<div class="sx-field" data-astro-cid-awpqqtwg> <span class="sx-label" data-astro-cid-awpqqtwg>${dt("Pick from the top")}</span> <div class="cm-picks" data-astro-cid-awpqqtwg> ${reputationTop.slice(0, 5).map((r) => renderTemplate`<button type="button"${addAttribute(r.userId, "data-pick-quick")}${addAttribute(people[r.userId]?.name ?? r.userId, "data-pick-name")} data-astro-cid-awpqqtwg><img${addAttribute(avatarOf(r.userId), "src")} alt="" width="22" height="22" loading="lazy" data-astro-cid-awpqqtwg><span data-astro-cid-awpqqtwg>${people[r.userId]?.name ?? r.userId}</span><b data-astro-cid-awpqqtwg>${dt(r.points === 1 ? "{a} pt" : "{a} pts", { a: num(r.points) })}</b></button>`)} </div> </div>`} <div class="sx-field" data-astro-cid-awpqqtwg><label for="cm-rep-points" data-astro-cid-awpqqtwg>${dt("Points")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "cm-rep-points", "name": "points", "value": "0", "min": "0", "max": "1000000", "required": true, "data-astro-cid-awpqqtwg": true })}</div> </div> <div class="sx-foot cm-foot" data-astro-cid-awpqqtwg><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-awpqqtwg>${dt("Save")}</button></div> </form> </div> <section class="sx-panel cm-lb-panel" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trophy-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Leaderboard")} <span class="cm-count" data-astro-cid-awpqqtwg>${num(reputationTotal)}</span></h2> ${reputationTop.length > 0 && renderTemplate`<form method="POST" data-no-dirty class="cm-inline" data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="reset_all_reputation" data-astro-cid-awpqqtwg> <button type="submit" class="cm-danger"${addAttribute(dt("Reset the points of every member to 0? This cannot be undone."), "data-confirm")} data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-counter-clockwise-bold", "width": "12", "height": "12", "data-astro-cid-awpqqtwg": true })}${dt("Reset everyone")}</button> </form>`} </div> ${reputationTop.length === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:medal", "width": "20", "height": "20", "data-astro-cid-awpqqtwg": true })}<span data-astro-cid-awpqqtwg>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("Nobody has points yet. They appear here after the first <code>{p}rep give</code>.", { p: prefix }))}` })}</span></p>` : renderTemplate`<ol class="cm-lb"${addAttribute(`--rows:${Math.ceil(reputationTop.length / 2)}`, "style")} data-astro-cid-awpqqtwg> ${reputationTop.map((r, index) => renderTemplate`<li class="cm-lb-row" data-astro-cid-awpqqtwg> <span${addAttribute(["cm-rank", index < 3 && `top-${index + 1}`], "class:list")} data-astro-cid-awpqqtwg>${index + 1}</span> ${renderComponent($$result2, "UserChip", $$UserChip, { "id": r.userId, "person": people[r.userId], "data-astro-cid-awpqqtwg": true })} <span class="cm-lb-points" data-astro-cid-awpqqtwg> <b data-astro-cid-awpqqtwg>${dt(r.points === 1 ? "{a} pt" : "{a} pts", { a: num(r.points) })}</b> <span class="cm-meter" data-astro-cid-awpqqtwg><i${addAttribute(`width:${Math.max(3, Math.round(r.points / maxPoints * 100))}%`, "style")} data-astro-cid-awpqqtwg></i></span> </span> <form method="POST" data-no-dirty class="cm-inline" data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="reset_reputation" data-astro-cid-awpqqtwg> <input type="hidden" name="user_id"${addAttribute(r.userId, "value")} data-astro-cid-awpqqtwg> <button type="submit" class="sx-iconbtn"${addAttribute(dt("Reset to 0"), "title")}${addAttribute(dt("Reset to 0"), "aria-label")}${addAttribute(dt("Reset the points of {a} to 0?", { a: people[r.userId]?.name ?? r.userId }), "data-confirm")} data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-counter-clockwise-fill", "width": "14", "height": "14", "data-astro-cid-awpqqtwg": true })}</button> </form> </li>`)} </ol>`} </section> <section class="sx-panel" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Recent points")}</h2> </div> ${repLog.length === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise", "width": "20", "height": "20", "data-astro-cid-awpqqtwg": true })}${dt("The points given from now on are listed here.")}</p>` : renderTemplate`<ul class="cm-log" data-astro-cid-awpqqtwg> ${repLog.map((row) => renderTemplate`<li class="cm-log-row" data-astro-cid-awpqqtwg> ${renderComponent($$result2, "UserChip", $$UserChip, { "id": row.giverId, "person": people[row.giverId], "data-astro-cid-awpqqtwg": true })} ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "width": "12", "height": "12", "class": "cm-arrow", "data-astro-cid-awpqqtwg": true })} ${renderComponent($$result2, "UserChip", $$UserChip, { "id": row.receiverId, "person": people[row.receiverId], "data-astro-cid-awpqqtwg": true })} <span class="cm-log-meta" data-astro-cid-awpqqtwg>${row.channelId && renderTemplate`<span data-astro-cid-awpqqtwg>#${channelName(row.channelId)}</span>`}<time${addAttribute(row.at, "datetime")} data-astro-cid-awpqqtwg>${ago(row.at)}</time></span> </li>`)} </ul>`} </section> <section class="sx-panel" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--text-muted)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Commands")}</h2> </div> <ul class="cm-cmds" data-astro-cid-awpqqtwg> <li data-astro-cid-awpqqtwg><code data-astro-cid-awpqqtwg>${prefix}rep give @member</code><span data-astro-cid-awpqqtwg>${dt("Give a point")}</span></li> <li data-astro-cid-awpqqtwg><code data-astro-cid-awpqqtwg>${prefix}rep view @member</code><span data-astro-cid-awpqqtwg>${dt("See the points of a member")}</span></li> <li data-astro-cid-awpqqtwg><code data-astro-cid-awpqqtwg>${prefix}rep leaderboard</code><span data-astro-cid-awpqqtwg>${dt("The top 10")}</span></li> <li data-astro-cid-awpqqtwg><code data-astro-cid-awpqqtwg>${prefix}rep reset @member</code><span data-astro-cid-awpqqtwg>${dt("Reset a member (Manage Server)")}</span></li> </ul> </section> </div>`, selectedSection === "boosters" && renderTemplate`<div class="sx-page cm-page" data-astro-cid-awpqqtwg> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Booster roles"), value: boosterRoles.length, tone: "invites" },
    { label: dt("Boosts"), value: boosterStatus.boostCount, tone: "messages" },
    { label: dt("Server boost level"), value: 0, text: dt("Level {a}", { a: boosterStatus.premiumTier }), tone: "voice" },
    { label: dt("No longer boosting"), value: lapsed.length, tone: "leaves" },
    { label: dt("Without a role"), value: boosterStatus.withoutRole.length, tone: "reactions" }
  ], "data-astro-cid-awpqqtwg": true })} ${!boosterStatus.live && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-awpqqtwg": true })}${dt("Petto did not answer, so the list shows the saved roles without their Discord details. Changes may not work right now.")}</div>`} ${boosterStatus.live && !boosterStatus.canManageRoles && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-awpqqtwg": true })}${dt("Petto needs the Manage Roles permission to create and change booster roles.")}</div>`} <form method="POST" class="sx-stack cm-settings" data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="booster" data-astro-cid-awpqqtwg> <div class="sx-duo cm-duo" data-astro-cid-awpqqtwg> <section class="sx-panel" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sparkle-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Booster roles")}</h2> <label class="sx-toggle-only" data-astro-cid-awpqqtwg><input type="checkbox" name="enabled"${addAttribute(booster.enabled, "checked")}${addAttribute(dt("Booster roles"), "aria-label")} data-astro-cid-awpqqtwg><i class="sx-toggle" data-astro-cid-awpqqtwg></i></label> </div> <p class="sx-lead cm-lead" data-astro-cid-awpqqtwg>${dt("When off, boosters cannot create or change a role. They can still remove theirs, and staff can still manage them here.")}</p> <div class="sx-field" data-sx-needs="enabled" data-astro-cid-awpqqtwg> <label for="cm-base-role" data-astro-cid-awpqqtwg>${dt("Place new roles above")}</label> <select id="cm-base-role" name="base_role_id" data-give-role data-astro-cid-awpqqtwg> <option value="" data-astro-cid-awpqqtwg>${dt("The Server Booster role (default)")}</option> ${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.id === booster.baseRoleId, "selected")} data-astro-cid-awpqqtwg>@${r.name}</option>`)} </select> <span class="sx-hint" data-astro-cid-awpqqtwg>${dt("New booster roles go right above this role, newest on top, so their color shows. Petto's own role must be higher.")}</span> </div> </section> <section class="sx-panel" data-sx-needs="enabled" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Limits")}</h2> </div> <div class="sx-grid" data-astro-cid-awpqqtwg> <div class="sx-field" data-astro-cid-awpqqtwg><label for="cm-role-limit" data-astro-cid-awpqqtwg>${dt("Roles per booster")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "cm-role-limit", "name": "role_limit", "value": booster.roleLimit, "min": "0", "max": "25", "data-astro-cid-awpqqtwg": true })}</div> <div class="sx-field" data-astro-cid-awpqqtwg><label for="cm-share-max" data-astro-cid-awpqqtwg>${dt("Share with up to")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "cm-share-max", "name": "share_max", "value": booster.shareMax, "min": "0", "max": "25", "data-astro-cid-awpqqtwg": true })}</div> </div> <span class="sx-hint" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("0 = no limit. Boosters share their role with friends with <code>{p}boosterrole share @member</code>.", { p: prefix }))}` })}</span> </section> </div> <section class="sx-panel" data-sx-needs="enabled" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:palette-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("What boosters can change")}</h2> </div> <div class="sx-switches" data-astro-cid-awpqqtwg> <label class="sx-switch" data-astro-cid-awpqqtwg><input type="checkbox" name="allow_gradient"${addAttribute(booster.allowGradient, "checked")} data-astro-cid-awpqqtwg><span class="sx-switch-text" data-astro-cid-awpqqtwg><b data-astro-cid-awpqqtwg>${dt("Gradients (a second color)")}</b></span><i class="sx-toggle" data-astro-cid-awpqqtwg></i></label> <label class="sx-switch" data-astro-cid-awpqqtwg><input type="checkbox" name="allow_icon"${addAttribute(booster.allowIcon, "checked")} data-astro-cid-awpqqtwg><span class="sx-switch-text" data-astro-cid-awpqqtwg><b data-astro-cid-awpqqtwg>${dt("Role icons")}</b>${boosterStatus.live && boosterStatus.premiumTier < 2 && renderTemplate`<em data-astro-cid-awpqqtwg>${dt("(needs boost level 2)")}</em>`}</span><i class="sx-toggle" data-astro-cid-awpqqtwg></i></label> </div> <div class="sx-sub" data-astro-cid-awpqqtwg> <h3 data-astro-cid-awpqqtwg>${dt("Wait between changes")}</h3> <div class="sx-grid sx-grid-3" data-astro-cid-awpqqtwg> <div class="sx-field" data-astro-cid-awpqqtwg><label for="cm-wait-color" data-astro-cid-awpqqtwg>${dt("Color wait (h)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "cm-wait-color", "name": "color_cooldown_hours", "value": booster.colorCooldownHours, "min": "0", "max": "720", "data-astro-cid-awpqqtwg": true })}</div> <div class="sx-field" data-astro-cid-awpqqtwg><label for="cm-wait-rename" data-astro-cid-awpqqtwg>${dt("Rename wait (h)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "cm-wait-rename", "name": "rename_cooldown_hours", "value": booster.renameCooldownHours, "min": "0", "max": "720", "data-astro-cid-awpqqtwg": true })}</div> <div class="sx-field" data-astro-cid-awpqqtwg><label for="cm-wait-icon" data-astro-cid-awpqqtwg>${dt("Icon wait (h)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "cm-wait-icon", "name": "icon_cooldown_hours", "value": booster.iconCooldownHours, "min": "0", "max": "720", "data-astro-cid-awpqqtwg": true })}</div> </div> <span class="sx-hint" data-astro-cid-awpqqtwg>${dt("Hours a booster waits between two changes of the same kind. 0 = no wait.")}</span> </div> </section> <div class="sx-duo cm-duo" data-astro-cid-awpqqtwg> <section class="sx-panel" data-sx-needs="enabled" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:prohibit-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Name filter")}</h2> </div> <div class="sx-field" data-astro-cid-awpqqtwg> <textarea id="cm-filter" name="filtered_words" class="dgl-autogrow sx-mono" rows="4" maxlength="6000" data-count${addAttribute(dt("Name filter"), "aria-label")}${addAttribute(dt("One word or phrase per line"), "placeholder")} data-astro-cid-awpqqtwg>${booster.filteredWords.join("\n")}</textarea> <span class="sx-hint" data-astro-cid-awpqqtwg>${dt("A role name that contains any of these is refused. Capital letters do not matter.")}</span> </div> </section> <section class="sx-panel" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 id="cm-unboost-h" data-astro-cid-awpqqtwg>${dt("When a member stops boosting")}</h2> </div> <div class="cm-choices" role="radiogroup" aria-labelledby="cm-unboost-h" data-astro-cid-awpqqtwg> ${unboostChoices.map(([value, icon, title, hint]) => renderTemplate`<label class="sx-choice" data-astro-cid-awpqqtwg><input type="radio" name="on_unboost"${addAttribute(value, "value")}${addAttribute(booster.onUnboost === value, "checked")} data-astro-cid-awpqqtwg><span class="sx-choice-body" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": icon, "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}<b data-astro-cid-awpqqtwg>${title}</b><em data-astro-cid-awpqqtwg>${hint}</em></span></label>`)} </div> </section> </div> <div class="sx-foot" data-astro-cid-awpqqtwg><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-awpqqtwg>${dt("Save changes")}</button></div> </form> <div class="cm-sec-head" data-astro-cid-awpqqtwg> <h2 data-astro-cid-awpqqtwg>${dt("Booster roles in this server")} <span class="cm-count" data-astro-cid-awpqqtwg>${num(boosterRoles.length)}</span></h2> ${boosterRoles.length > 0 && renderTemplate`<form method="POST" data-no-dirty class="cm-inline" data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="br_cleanup" data-astro-cid-awpqqtwg> <button type="submit" class="btn btn-ghost btn-sm cm-btn"${addAttribute(dt("Delete the booster roles of every member who no longer boosts?"), "data-confirm")} data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:broom-fill", "width": "13", "height": "13", "data-astro-cid-awpqqtwg": true })}${dt("Clean up ({a})", { a: lapsed.length })}</button> </form>`} </div> ${boosterRoles.length === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sparkle", "width": "20", "height": "20", "data-astro-cid-awpqqtwg": true })}<span data-astro-cid-awpqqtwg>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth("No booster roles yet. Boosters create theirs with <code>{p}boosterrole create</code>, or give one to a member below.", { p: prefix }))}` })}</span></p>` : renderTemplate`<div class="cm-br-list dgl-stagger" data-astro-cid-awpqqtwg> ${boosterRoles.map((row) => {
    const state = row.boosting === true ? "on" : row.in_server === false ? "left" : row.boosting === false ? "off" : "unknown";
    const label = state === "on" ? dt("Boosting") : state === "left" ? dt("Left the server") : state === "off" ? dt("Not boosting") : dt("Unknown");
    const roleTitle = row.exists ? row.name ?? roleName(row.role_id) : dt("Deleted role");
    return renderTemplate`<article${addAttribute(["cm-br", { gone: !row.exists }], "class:list")} data-astro-cid-awpqqtwg> <div class="cm-br-top" data-astro-cid-awpqqtwg> <span class="cm-br-swatch"${addAttribute(`--a:${row.color ?? "#7c8a94"};--b:${row.color2 ?? row.color ?? "#7c8a94"}`, "style")} data-astro-cid-awpqqtwg>${row.icon && renderTemplate`<img${addAttribute(row.icon, "src")} alt="" width="18" height="18" loading="lazy" data-astro-cid-awpqqtwg>`}</span> <div class="cm-br-name" data-astro-cid-awpqqtwg> <b${addAttribute(row.color ? `color:${row.color}` : void 0, "style")} data-astro-cid-awpqqtwg>${roleTitle}</b> <code data-astro-cid-awpqqtwg>${row.color ?? dt("No color")}${row.color2 ? ` \u2192 ${row.color2}` : ""}</code> </div> <span${addAttribute(["cm-pill", state], "class:list")} data-astro-cid-awpqqtwg>${label}</span> <form method="POST" data-no-dirty class="cm-inline" data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="br_remove" data-astro-cid-awpqqtwg> <input type="hidden" name="member_id"${addAttribute(row.user_id, "value")} data-astro-cid-awpqqtwg> <button type="submit" class="sx-iconbtn"${addAttribute(dt("Delete"), "title")}${addAttribute(dt("Delete"), "aria-label")}${addAttribute(dt("Delete this booster role? The role is deleted in Discord."), "data-confirm")} data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "14", "height": "14", "data-astro-cid-awpqqtwg": true })}</button> </form> </div> <div class="cm-br-meta" data-astro-cid-awpqqtwg> ${renderComponent($$result2, "UserChip", $$UserChip, { "id": row.user_id, "person": people[row.user_id], "data-astro-cid-awpqqtwg": true })} ${row.shared_with.length > 0 && renderTemplate`<span class="cm-br-shared"${addAttribute(row.shared_with.map((userId) => people[userId]?.name ?? userId).join(", "), "title")} data-astro-cid-awpqqtwg> ${row.shared_with.slice(0, 4).map((userId) => renderTemplate`<img${addAttribute(avatarOf(userId), "src")} alt="" width="20" height="20" loading="lazy" data-astro-cid-awpqqtwg>`)} <span data-astro-cid-awpqqtwg>${dt("+{a} shared", { a: row.shared_with.length })}</span> </span>`} ${row.created_at && renderTemplate`<time class="cm-br-since"${addAttribute(row.created_at, "datetime")}${addAttribute(dt("Created"), "title")} data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-fill", "width": "11", "height": "11", "data-astro-cid-awpqqtwg": true })}${ago(row.created_at)}</time>`} </div> ${row.exists && renderTemplate`<details class="cm-br-edit" data-astro-cid-awpqqtwg> <summary data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "12", "height": "12", "data-astro-cid-awpqqtwg": true })}${dt("Edit")}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "cm-caret", "width": "12", "height": "12", "data-astro-cid-awpqqtwg": true })}</summary> <form method="POST" class="cm-br-form" data-no-dirty data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="br_edit" data-astro-cid-awpqqtwg> <input type="hidden" name="member_id"${addAttribute(row.user_id, "value")} data-astro-cid-awpqqtwg> <div class="sx-field" data-astro-cid-awpqqtwg><label data-astro-cid-awpqqtwg>${dt("Name")}</label><textarea name="name" class="dgl-autogrow sx-one" rows="1" data-one-line data-count maxlength="100" data-astro-cid-awpqqtwg>${roleTitle}</textarea></div> <div class="cm-colors" data-astro-cid-awpqqtwg> ${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "hex", "value": row.color ?? "#f78fb3", "label": dt("Color"), "data-astro-cid-awpqqtwg": true })} ${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "hex2", "value": row.color2 ?? "", "allowNone": true, "label": dt("Second color"), "data-astro-cid-awpqqtwg": true })} </div> <div class="sx-field" data-astro-cid-awpqqtwg><label data-astro-cid-awpqqtwg>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth('Icon <span class="cm-label-muted">a picture link or a custom emoji; leave empty to keep it</span>'))}` })}</label><textarea name="icon" class="dgl-autogrow sx-one" rows="1" data-one-line data-count maxlength="500" inputmode="url" placeholder="https://… / <:emoji:123>" data-astro-cid-awpqqtwg></textarea></div> ${row.icon && renderTemplate`<label class="sx-switch" data-astro-cid-awpqqtwg><input type="checkbox" name="icon_remove" data-astro-cid-awpqqtwg><span class="sx-switch-text" data-astro-cid-awpqqtwg><b data-astro-cid-awpqqtwg>${dt("Remove the icon")}</b></span><i class="sx-toggle" data-astro-cid-awpqqtwg></i></label>`} <div class="sx-foot" data-astro-cid-awpqqtwg><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-awpqqtwg>${dt("Save role")}</button></div> </form> </details>`} </article>`;
  })} </div>`} <div class="sx-duo cm-duo" data-astro-cid-awpqqtwg> <form method="POST" class="sx-panel cm-form" data-no-dirty data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="br_set" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:gift-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Give a booster role")}</h2> </div> <p class="sx-lead cm-lead" data-astro-cid-awpqqtwg>${dt("Creates a role for a member, or changes the one they have. No limit or wait applies, like the staff command.")}</p> <div class="cm-body" data-astro-cid-awpqqtwg> <div class="sx-field" data-astro-cid-awpqqtwg><span class="sx-label" data-astro-cid-awpqqtwg>${dt("Member")}</span>${renderComponent($$result2, "MemberPick", $$MemberPick, { "guildId": guildId, "data-astro-cid-awpqqtwg": true })}</div> ${boosterStatus.withoutRole.length > 0 && renderTemplate`<div class="sx-field" data-astro-cid-awpqqtwg> <span class="sx-label" data-astro-cid-awpqqtwg>${dt("Boosting without a role")}</span> <div class="cm-quick" data-astro-cid-awpqqtwg> ${boosterStatus.withoutRole.slice(0, 12).map((userId) => renderTemplate`<button type="button"${addAttribute(userId, "data-pick-quick")}${addAttribute(people[userId]?.name ?? userId, "data-pick-name")} data-astro-cid-awpqqtwg><img${addAttribute(avatarOf(userId), "src")} alt="" width="20" height="20" loading="lazy" data-astro-cid-awpqqtwg>${people[userId]?.name ?? userId}</button>`)} </div> </div>`} <div class="sx-field" data-astro-cid-awpqqtwg><label for="cm-give-name" data-astro-cid-awpqqtwg>${dt("Role name")}</label><textarea id="cm-give-name" name="name" class="dgl-autogrow sx-one" rows="1" data-one-line data-count maxlength="100"${addAttribute(dt("Leave empty to use their name"), "placeholder")} data-astro-cid-awpqqtwg></textarea></div> <div class="cm-colors" data-astro-cid-awpqqtwg> ${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "hex", "value": "#f78fb3", "label": dt("Color"), "data-astro-cid-awpqqtwg": true })} ${renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "hex2", "value": "#5b8def", "label": dt("Second color"), "data-astro-cid-awpqqtwg": true })} </div> <label class="sx-switch" data-astro-cid-awpqqtwg><input type="checkbox" name="gradient" data-astro-cid-awpqqtwg><span class="sx-switch-text" data-astro-cid-awpqqtwg><b data-astro-cid-awpqqtwg>${dt("Use the second color (gradient)")}</b></span><i class="sx-toggle" data-astro-cid-awpqqtwg></i></label> </div> <div class="sx-foot cm-foot" data-astro-cid-awpqqtwg><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "12", "height": "12", "data-astro-cid-awpqqtwg": true })}${dt("Create or update")}</button></div> </form> <form method="POST" class="sx-panel cm-form" data-no-dirty data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="br_link" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:link-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Link an existing role")}</h2> </div> <p class="sx-lead cm-lead" data-astro-cid-awpqqtwg>${dt("Makes a role the server already has the booster role of a member, so they can change it with the commands. The member gets the role.")}</p> <div class="cm-body" data-astro-cid-awpqqtwg> <div class="sx-field" data-astro-cid-awpqqtwg><span class="sx-label" data-astro-cid-awpqqtwg>${dt("Member")}</span>${renderComponent($$result2, "MemberPick", $$MemberPick, { "guildId": guildId, "data-astro-cid-awpqqtwg": true })}</div> ${boosterStatus.withoutRole.length > 0 && renderTemplate`<div class="sx-field" data-astro-cid-awpqqtwg> <span class="sx-label" data-astro-cid-awpqqtwg>${dt("Boosting without a role")}</span> <div class="cm-quick" data-astro-cid-awpqqtwg> ${boosterStatus.withoutRole.slice(0, 12).map((userId) => renderTemplate`<button type="button"${addAttribute(userId, "data-pick-quick")}${addAttribute(people[userId]?.name ?? userId, "data-pick-name")} data-astro-cid-awpqqtwg><img${addAttribute(avatarOf(userId), "src")} alt="" width="20" height="20" loading="lazy" data-astro-cid-awpqqtwg>${people[userId]?.name ?? userId}</button>`)} </div> </div>`} <div class="sx-field" data-astro-cid-awpqqtwg> <label for="cm-link-role" data-astro-cid-awpqqtwg>${dt("Role")}</label> <select id="cm-link-role" name="role_id" required data-give-role data-astro-cid-awpqqtwg> <option value="" disabled selected data-astro-cid-awpqqtwg>${dt("Choose a role")}</option> ${roleDetails.filter((r) => !r.managed).map((r) => renderTemplate`<option${addAttribute(r.id, "value")} data-astro-cid-awpqqtwg>@${r.name}</option>`)} </select> <span class="sx-hint" data-astro-cid-awpqqtwg>${dt("Roles made by a bot or an integration are not listed.")}</span> </div> </div> <div class="sx-foot cm-foot" data-astro-cid-awpqqtwg><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:link-fill", "width": "12", "height": "12", "data-astro-cid-awpqqtwg": true })}${dt("Link")}</button></div> </form> </div> <section class="sx-panel" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--text-muted)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Commands for boosters")}</h2> </div> <ul class="cm-cmds" data-astro-cid-awpqqtwg> <li data-astro-cid-awpqqtwg><code data-astro-cid-awpqqtwg>${prefix}boosterrole create ${dt("name")} #hex</code><span data-astro-cid-awpqqtwg>${dt("Create the role")}</span></li> <li data-astro-cid-awpqqtwg><code data-astro-cid-awpqqtwg>${prefix}boosterrole color #hex #hex2</code><span data-astro-cid-awpqqtwg>${dt("Change the color")}</span></li> <li data-astro-cid-awpqqtwg><code data-astro-cid-awpqqtwg>${prefix}boosterrole rename ${dt("name")}</code><span data-astro-cid-awpqqtwg>${dt("Rename it")}</span></li> <li data-astro-cid-awpqqtwg><code data-astro-cid-awpqqtwg>${prefix}boosterrole icon</code><span data-astro-cid-awpqqtwg>${dt("Set an icon (link, emoji or attached image)")}</span></li> <li data-astro-cid-awpqqtwg><code data-astro-cid-awpqqtwg>${prefix}boosterrole random</code><span data-astro-cid-awpqqtwg>${dt("A random color")}</span></li> <li data-astro-cid-awpqqtwg><code data-astro-cid-awpqqtwg>${prefix}boosterrole share @member</code><span data-astro-cid-awpqqtwg>${dt("Share it")}</span></li> <li data-astro-cid-awpqqtwg><code data-astro-cid-awpqqtwg>${prefix}boosterrole remove</code><span data-astro-cid-awpqqtwg>${dt("Delete it")}</span></li> </ul> </section> </div>`, selectedSection === "polls" && renderTemplate`<div class="sx-page cm-page" data-astro-cid-awpqqtwg> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Recent polls"), value: polls.length, tone: "invites" },
    { label: dt("Open polls"), value: pollsOpen, tone: "joins" },
    { label: dt("Closed polls"), value: polls.length - pollsOpen, tone: "leaves" },
    { label: dt("Votes cast"), value: pollVotes, tone: "reactions" }
  ], "data-astro-cid-awpqqtwg": true })} ${pollError && renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-awpqqtwg": true })}${pollError}</div>`} <form method="POST" class="cm-create cm-poll-create" data-no-dirty data-astro-cid-awpqqtwg> <input type="hidden" name="action" value="create_poll" data-astro-cid-awpqqtwg> <section class="sx-panel cm-form" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chart-bar-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Create a poll")}</h2> </div> <p class="sx-lead cm-lead" data-astro-cid-awpqqtwg>${dt("Publish a button-voted poll directly to a channel. Members can change their vote until you close it.")}</p> <div class="cm-body" data-astro-cid-awpqqtwg> <div class="sx-field" data-astro-cid-awpqqtwg><label for="cm-poll-q" data-astro-cid-awpqqtwg>${dt("Question")}</label><textarea id="cm-poll-q" name="question" class="dgl-autogrow sx-one" rows="1" data-one-line data-count maxlength="200"${addAttribute(dt("What should we build next?"), "placeholder")} required data-astro-cid-awpqqtwg></textarea></div> <div class="sx-field" data-astro-cid-awpqqtwg> <label for="cm-poll-opts" data-astro-cid-awpqqtwg>${dt("Options")}</label> <textarea id="cm-poll-opts" name="options" class="dgl-autogrow" rows="4" maxlength="800" data-count${addAttribute(dt("One option per line\nA new command\nA dashboard module"), "placeholder")} required data-astro-cid-awpqqtwg></textarea> <span class="sx-hint" data-astro-cid-awpqqtwg>${dt("Use 2 to 10 options. Each option can be up to 80 characters.")}</span> </div> <div class="sx-grid" data-astro-cid-awpqqtwg> <div class="sx-field" data-astro-cid-awpqqtwg> <label for="cm-poll-channel" data-astro-cid-awpqqtwg>${dt("Channel")}</label> <select id="cm-poll-channel" name="channel_id" required data-astro-cid-awpqqtwg> <option value="" disabled selected data-astro-cid-awpqqtwg>${dt("Choose a channel")}</option> ${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-awpqqtwg>#${c.name}</option>`)} </select> </div> <div class="sx-field" data-astro-cid-awpqqtwg><label for="cm-poll-close" data-astro-cid-awpqqtwg>${dt("Auto-close in minutes")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "cm-poll-close", "name": "duration_minutes", "value": "", "min": "0", "max": "525600", "placeholder": dt("0 = never"), "data-astro-cid-awpqqtwg": true })}</div> <div class="sx-field" data-astro-cid-awpqqtwg><label for="cm-poll-image" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth('Image URL <span class="cm-label-muted">optional</span>'))}` })}</label><textarea id="cm-poll-image" name="image" class="dgl-autogrow sx-one" rows="1" data-one-line data-count maxlength="1000" inputmode="url" placeholder="https://..." data-astro-cid-awpqqtwg></textarea></div> <div class="sx-field" data-astro-cid-awpqqtwg> <label for="cm-poll-design" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(dth('Design <span class="cm-label-muted">optional</span>'))}` })}</label> <select id="cm-poll-design" name="embed_template" data-astro-cid-awpqqtwg> <option value="" data-astro-cid-awpqqtwg>${dt("Petto card (default)")}</option> ${pollDesigns.map((name) => renderTemplate`<option${addAttribute(name, "value")} data-astro-cid-awpqqtwg>${name}</option>`)} </select> </div> </div> <span class="sx-hint cm-design-hint" data-astro-cid-awpqqtwg>${dt("Pick a saved V2 embed to design the poll with the poll variables. The vote buttons stay under it.")}</span> <label class="sx-switch" data-astro-cid-awpqqtwg><input type="checkbox" name="multi" data-astro-cid-awpqqtwg><span class="sx-switch-text" data-astro-cid-awpqqtwg><b data-astro-cid-awpqqtwg>${dt("Allow members to choose more than one option")}</b></span><i class="sx-toggle" data-astro-cid-awpqqtwg></i></label> </div> <div class="sx-foot cm-foot" data-astro-cid-awpqqtwg><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "13", "height": "13", "data-astro-cid-awpqqtwg": true })}${dt("Publish poll")}</button></div> </section> <div class="cm-create-side" data-astro-cid-awpqqtwg> <aside class="sx-panel cm-pv-panel"${addAttribute(dt("Preview"), "aria-label")} data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Preview")}</h2> </div> <p class="sx-lead cm-lead" data-astro-cid-awpqqtwg>${dt("The poll as Petto posts it. It changes while you write.")}</p> <div class="cm-pv" data-poll-preview aria-live="polite"${addAttribute(JSON.stringify([dt("A new command"), dt("A dashboard module")]), "data-sample-opts")} data-astro-cid-awpqqtwg> <div class="cm-pv-q" data-pv-q data-astro-cid-awpqqtwg>${dt("What should we build next?")}</div> <div class="cm-pv-type" data-pv-type${addAttribute(dt("Multiple choice"), "data-multi")} data-astro-cid-awpqqtwg>${dt("Single choice")}</div> <div class="cm-pv-opts" data-pv-opts data-astro-cid-awpqqtwg></div> <div class="cm-pv-foot" data-astro-cid-awpqqtwg>${dt("0 votes \xB7 open")}</div> </div> </aside> <section class="sx-panel cm-running" data-astro-cid-awpqqtwg> <div class="sx-panel-head" data-astro-cid-awpqqtwg> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:timer-fill", "width": "17", "height": "17", "data-astro-cid-awpqqtwg": true })}</span> <h2 data-astro-cid-awpqqtwg>${dt("Running now")}</h2> </div> ${pollsOpen === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chart-bar", "width": "20", "height": "20", "data-astro-cid-awpqqtwg": true })}${dt("No poll is running right now.")}</p>` : renderTemplate`<ul class="cm-run" data-astro-cid-awpqqtwg> ${polls.filter((poll) => !poll.closed).slice(0, 4).map((poll) => renderTemplate`<li${addAttribute(poll.id, "data-run")} data-astro-cid-awpqqtwg> <b data-astro-cid-awpqqtwg>${poll.question}</b> <small data-astro-cid-awpqqtwg>#${channelName(poll.channel_id)} · <span data-run-voters data-astro-cid-awpqqtwg>${poll.voters}</span> ${dt("Voters")} · ${poll.ends_at ? dt("Closes in {a}", { a: until(poll.ends_at) }) : dt("No end")}</small> </li>`)} </ul>`} </section> </div> </form> <div class="cm-polls-existing"${addAttribute(`/dash/guild/${guildId}/live?kind=polls`, "data-live-url")} data-astro-cid-awpqqtwg> <div class="cm-sec-head" data-astro-cid-awpqqtwg> <h2 data-astro-cid-awpqqtwg>${dt("Recent polls")} <span class="cm-count" data-astro-cid-awpqqtwg>${num(polls.length)}</span></h2> ${pollsOpen > 0 && renderTemplate`<p class="sx-hint cm-live-hint" data-astro-cid-awpqqtwg><i class="cm-live-dot" data-astro-cid-awpqqtwg></i>${dt("The votes of open polls update by themselves.")}</p>`} </div> ${polls.length === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chart-bar", "width": "20", "height": "20", "data-astro-cid-awpqqtwg": true })}${dt("No polls have been published in this server yet.")}</p>` : renderTemplate`<div class="cm-poll-list dgl-stagger" data-astro-cid-awpqqtwg> ${polls.map((poll) => {
    const total = poll.voters;
    const best = poll.closed ? Math.max(0, ...poll.counts) : 0;
    return renderTemplate`<article${addAttribute(["cm-poll", { closed: poll.closed }], "class:list")}${addAttribute(poll.id, "data-poll-id")}${addAttribute(poll.closed ? "" : "1", "data-open")} data-astro-cid-awpqqtwg> <div class="cm-poll-head" data-astro-cid-awpqqtwg> <div class="cm-poll-title" data-astro-cid-awpqqtwg> <h3 data-astro-cid-awpqqtwg>${poll.question}</h3> <p data-astro-cid-awpqqtwg>#${channelName(poll.channel_id)} · ${ago(poll.created_at)}</p> </div> <span class="cm-poll-status" data-poll-status${addAttribute(dt("Live"), "data-label-live")}${addAttribute(dt("Closed"), "data-label-closed")} data-astro-cid-awpqqtwg>${poll.closed ? dt("Closed") : dt("Live")}</span> </div> <p class="cm-poll-meta" data-astro-cid-awpqqtwg> <span data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "12", "height": "12", "data-astro-cid-awpqqtwg": true })}<b data-poll-voters data-astro-cid-awpqqtwg>${total}</b> ${dt("Voters")}</span> ${poll.ends_at && !poll.closed && renderTemplate`<span data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-fill", "width": "12", "height": "12", "data-astro-cid-awpqqtwg": true })}${dt("Closes in {a}", { a: until(poll.ends_at) })}</span>`} ${poll.multi && renderTemplate`<span data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "12", "height": "12", "data-astro-cid-awpqqtwg": true })}${dt("Multiple choice")}</span>`} ${poll.image && renderTemplate`<span data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:image-fill", "width": "12", "height": "12", "data-astro-cid-awpqqtwg": true })}${dt("Image")}</span>`} ${poll.embed_template && renderTemplate`<span data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:palette-fill", "width": "12", "height": "12", "data-astro-cid-awpqqtwg": true })}${poll.embed_template}</span>`} </p> <div class="cm-poll-options" data-astro-cid-awpqqtwg> ${poll.options.map((option, index) => {
      const count = poll.counts[index] ?? 0;
      const pct = total > 0 ? Math.round(count / total * 100) : 0;
      return renderTemplate`<div${addAttribute(["cm-opt", { win: poll.closed && best > 0 && count === best }], "class:list")}${addAttribute(index, "data-poll-option")} data-astro-cid-awpqqtwg> <div class="cm-opt-line" data-astro-cid-awpqqtwg><span class="cm-opt-n" data-astro-cid-awpqqtwg>${index + 1}</span><span class="cm-opt-text" data-astro-cid-awpqqtwg>${option}</span><b data-poll-count data-astro-cid-awpqqtwg>${count} · ${pct}%</b></div> <div class="cm-meter" data-astro-cid-awpqqtwg><i data-poll-bar${addAttribute(`width:${pct}%`, "style")} data-astro-cid-awpqqtwg></i></div> </div>`;
    })} </div> <div class="cm-poll-actions" data-astro-cid-awpqqtwg> <a class="cm-act"${addAttribute(`https://discord.com/channels/${guildId}/${poll.channel_id}/${poll.message_id}`, "href")} target="_blank" rel="noopener" data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-square-out", "width": "13", "height": "13", "data-astro-cid-awpqqtwg": true })}${dt("Open in Discord")}</a> <span class="cm-poll-spacer" data-astro-cid-awpqqtwg></span> ${!poll.closed && renderTemplate`<form method="POST" data-no-dirty class="cm-inline" data-astro-cid-awpqqtwg><input type="hidden" name="action" value="close_poll" data-astro-cid-awpqqtwg><input type="hidden" name="poll_id"${addAttribute(poll.id, "value")} data-astro-cid-awpqqtwg><button type="submit" class="cm-danger"${addAttribute(dt("End this poll now? Nobody can vote after that."), "data-confirm")} data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:stop-circle-fill", "width": "13", "height": "13", "data-astro-cid-awpqqtwg": true })}${dt("End poll")}</button></form>`} <form method="POST" data-no-dirty class="cm-inline" data-astro-cid-awpqqtwg><input type="hidden" name="action" value="delete_poll" data-astro-cid-awpqqtwg><input type="hidden" name="poll_id"${addAttribute(poll.id, "value")} data-astro-cid-awpqqtwg><button type="submit" class="cm-danger"${addAttribute(dt("Delete this poll? Its message in Discord and its votes are removed."), "data-confirm")} data-astro-cid-awpqqtwg>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-awpqqtwg": true })}${dt("Delete")}</button></form> </div> </article>`;
  })} </div>`} </div> </div>`) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashCommunity.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Community = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Community;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
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
  let pollError = null;
  let notice = null;
  const SNOWFLAKE = /^\d{15,25}$/;
  const clampInt = (value, min, max, fallback) => {
    const number = Math.round(Number(value));
    return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
  };
  const idsOf = (values) => [...new Set(values.map((value) => String(value).trim()).filter((value) => SNOWFLAKE.test(value)))].slice(0, 25);
  const botAnswer = (result, fallback) => {
    notice = { ok: result.ok, text: result.message || (result.ok ? dt("Saved.") : fallback) };
  };
  const botDown = () => dt("Petto did not answer. Try again in a moment.");
  const discordHeaders = { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" };
  const pollLetters = Array.from({ length: 10 }, (_, i) => String.fromCodePoint(127462 + i));
  function pollPayload(poll, counts, voters) {
    const best = poll.closed ? Math.max(0, ...counts) : 0;
    const container = [{ type: 10, content: `### \u{1F4CA} ${poll.question}
-# ${poll.multi ? "Multiple choice" : "Single choice"}` }, { type: 14, divider: true, spacing: 1 }];
    poll.options.forEach((option, index) => {
      const count = counts[index] ?? 0;
      const pct = voters > 0 ? Math.round(count / voters * 100) : 0;
      const filled = Math.round(pct / 100 * 12);
      const winner = poll.closed && best > 0 && count === best ? " \u{1F3C6}" : "";
      container.push({ type: 10, content: `${pollLetters[index]} **${option}**${winner}
${"\u2588".repeat(filled)}${"\u2591".repeat(12 - filled)}  ${pct}% (${count})` });
    });
    if (poll.image) container.push({ type: 12, items: [{ media: { url: poll.image } }] });
    container.push({ type: 14, divider: true, spacing: 1 }, { type: 10, content: `-# ${voters} vote${voters === 1 ? "" : "s"} \xB7 ${poll.closed ? "closed" : "open"}` });
    const components = [{ type: 17, accent_color: poll.closed ? 9146275 : 15771791, components: container }];
    if (!poll.closed) {
      for (let start = 0; start < poll.options.length; start += 5) {
        components.push({
          type: 1,
          components: poll.options.slice(start, start + 5).map((_, offset) => {
            const index = start + offset;
            return { type: 2, custom_id: `plv_vote::${poll.id}::${index}`, style: 2, label: String(index + 1), emoji: { name: pollLetters[index] } };
          })
        });
      }
      components.push({ type: 1, components: [{ type: 2, custom_id: `plv_close::${poll.id}`, style: 4, label: "End poll" }] });
    }
    return { flags: 1 << 15, components };
  }
  async function pollMessage(poll, counts, voters) {
    return await renderPollMessage(Astro2, id, poll, counts, voters) ?? pollPayload(poll, counts, voters);
  }
  async function editPollMessage(poll, counts, voters) {
    const url = `https://discord.com/api/v10/channels/${poll.channel_id}/messages/${poll.message_id}`;
    const response = await fetch(url, { method: "PATCH", headers: discordHeaders, body: JSON.stringify(await pollMessage(poll, counts, voters)) });
    if (response.ok) return true;
    if (poll.closed) return (await fetch(url, { method: "PATCH", headers: discordHeaders, body: JSON.stringify({ components: [] }) })).ok;
    return false;
  }
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    if (action === "report") {
      await fetch(`${apiUrl}/rest/v1/report_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          enabled: form.get("enabled") === "on",
          channel_id: String(form.get("channel_id") ?? "").trim() || null,
          urgent_role_id: String(form.get("urgent_role_id") ?? "").trim() || null,
          anonymous_reporting_enabled: form.get("anonymous_reporting_enabled") === "on",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      saved = true;
    } else if (action === "message_links") {
      await ensureGuildRow(apiUrl, apiHeaders, id);
      const ignored = [...new Set(form.getAll("ignored_channels").map((value) => String(value).trim()).filter((value) => SNOWFLAKE.test(value)))].slice(0, 50);
      const res = await fetch(`${apiUrl}/rest/v1/message_link_settings?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ guild_id: id, enabled: form.get("enabled") === "on", ignored_channels: ignored, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
      }).catch(() => null);
      if (res?.ok) saved = true;
      else notice = { ok: false, text: dt("The settings could not be saved. Try again.") };
    } else if (action === "booster") {
      const filteredWords = [...new Set(String(form.get("filtered_words") ?? "").split(/[\n,]/).map((w) => w.trim().toLowerCase().slice(0, 50)).filter(Boolean))].slice(0, 200);
      const onUnboost = String(form.get("on_unboost") ?? "keep");
      await ensureGuildRow(apiUrl, apiHeaders, id);
      const res = await fetch(`${apiUrl}/rest/v1/booster_role_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          enabled: form.get("enabled") === "on",
          base_role_id: SNOWFLAKE.test(String(form.get("base_role_id") ?? "")) ? String(form.get("base_role_id")) : null,
          role_limit: clampInt(form.get("role_limit"), 0, 25, 1),
          share_max: clampInt(form.get("share_max"), 0, 25, 0),
          allow_gradient: form.get("allow_gradient") === "on",
          allow_icon: form.get("allow_icon") === "on",
          on_unboost: ["keep", "remove", "delete"].includes(onUnboost) ? onUnboost : "keep",
          filtered_words: filteredWords,
          color_cooldown_ms: clampInt(form.get("color_cooldown_hours"), 0, 720, 0) * 36e5,
          icon_cooldown_ms: clampInt(form.get("icon_cooldown_hours"), 0, 720, 0) * 36e5,
          rename_cooldown_ms: clampInt(form.get("rename_cooldown_hours"), 0, 720, 0) * 36e5,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      }).catch(() => null);
      if (res?.ok) saved = true;
      else notice = { ok: false, text: dt("The settings could not be saved. Try again.") };
    } else if (action.startsWith("br_")) {
      const memberId = String(form.get("member_id") ?? "").trim();
      if (action === "br_cleanup") {
        botAnswer(await callPettoBoosterRoles(Astro2, id, session.userId, "cleanup", {}, dashLang), botDown());
      } else if (!SNOWFLAKE.test(memberId)) {
        notice = { ok: false, text: dt("Pick a member first.") };
      } else if (action === "br_set" || action === "br_edit") {
        const hex = String(form.get("hex") ?? "").trim();
        const useSecond = action === "br_set" ? form.get("gradient") === "on" : true;
        const hex2 = useSecond ? String(form.get("hex2") ?? "").trim() : "";
        const name = String(form.get("name") ?? "").trim().slice(0, 100);
        let result = await callPettoBoosterRoles(Astro2, id, session.userId, "set", { member_id: memberId, name, hex, hex2 }, dashLang);
        const icon = String(form.get("icon") ?? "").trim().slice(0, 500);
        const removeIcon = form.get("icon_remove") === "on";
        if (result.ok && action === "br_edit" && (icon || removeIcon)) {
          result = await callPettoBoosterRoles(Astro2, id, session.userId, "icon", { member_id: memberId, icon: removeIcon ? "" : icon }, dashLang);
        }
        botAnswer(result, botDown());
      } else if (action === "br_remove") {
        botAnswer(await callPettoBoosterRoles(Astro2, id, session.userId, "remove", { member_id: memberId }, dashLang), botDown());
      } else if (action === "br_link") {
        botAnswer(await callPettoBoosterRoles(Astro2, id, session.userId, "link", { member_id: memberId, role_id: String(form.get("role_id") ?? "") }, dashLang), botDown());
      }
    } else if (action === "reputation") {
      await ensureGuildRow(apiUrl, apiHeaders, id);
      const res = await fetch(`${apiUrl}/rest/v1/reputation_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          enabled: form.get("enabled") === "on",
          cooldown_hours: clampInt(form.get("cooldown_hours"), 0, 720, 24),
          giver_role_ids: idsOf(form.getAll("giver_role_ids")),
          blocked_role_ids: idsOf(form.getAll("blocked_role_ids")),
          channel_ids: idsOf(form.getAll("channel_ids"))
        })
      }).catch(() => null);
      if (res?.ok) saved = true;
      else notice = { ok: false, text: dt("The settings could not be saved. Try again.") };
    } else if (action === "rep_reward_add" || action === "rep_reward_remove") {
      const configRes = await fetch(`${apiUrl}/rest/v1/reputation_config?guild_id=eq.${id}&select=rewards`, { headers: apiHeaders }).catch(() => null);
      const current = configRes?.ok ? (await configRes.json())[0]?.rewards ?? [] : [];
      const points = clampInt(form.get("points"), 1, 1e6, 0);
      const roleId = String(form.get("role_id") ?? "");
      let rewards = (Array.isArray(current) ? current : []).filter((reward) => Number(reward?.points) !== points);
      if (action === "rep_reward_add") {
        if (!points || !SNOWFLAKE.test(roleId)) notice = { ok: false, text: dt("Pick a role and a number of points.") };
        else rewards = [...rewards, { points, role_id: roleId }];
      }
      rewards = rewards.sort((a, b2) => Number(a.points) - Number(b2.points)).slice(0, 25);
      if (!notice) {
        await ensureGuildRow(apiUrl, apiHeaders, id);
        const res = await fetch(`${apiUrl}/rest/v1/reputation_config?on_conflict=guild_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, rewards })
        }).catch(() => null);
        if (res?.ok) saved = true;
        else notice = { ok: false, text: dt("The settings could not be saved. Try again.") };
      }
    } else if (action === "reset_reputation" || action === "rep_set") {
      const userId = String(form.get("user_id") ?? form.get("member_id") ?? "").trim();
      if (!SNOWFLAKE.test(userId)) {
        notice = { ok: false, text: dt("Pick a member first.") };
      } else {
        await ensureGuildRow(apiUrl, apiHeaders, id);
        const points = action === "rep_set" ? clampInt(form.get("points"), 0, 1e6, 0) : 0;
        const res = await fetch(`${apiUrl}/rest/v1/reputation?on_conflict=guild_id,user_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, user_id: userId, points })
        }).catch(() => null);
        if (res?.ok) saved = true;
        else notice = { ok: false, text: dt("The points could not be changed. Try again.") };
      }
    } else if (action === "reset_all_reputation") {
      const res = await fetch(`${apiUrl}/rest/v1/reputation?guild_id=eq.${id}&points=neq.0`, {
        method: "PATCH",
        headers: { ...apiHeaders, Prefer: "return=minimal" },
        body: JSON.stringify({ points: 0 })
      }).catch(() => null);
      if (res?.ok) saved = true;
      else notice = { ok: false, text: dt("The points could not be changed. Try again.") };
    } else if (action === "create_poll") {
      const question = String(form.get("question") ?? "").trim().slice(0, 200);
      const options = String(form.get("options") ?? "").split(/\r?\n/).map((option) => option.trim().slice(0, 80)).filter(Boolean).slice(0, 10);
      const channelId = String(form.get("channel_id") ?? "").trim();
      const rawImage = String(form.get("image") ?? "").trim();
      const image = /^https?:\/\//i.test(rawImage) ? rawImage.slice(0, 1e3) : null;
      const rawTemplate = String(form.get("embed_template") ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 60);
      const durationMinutes = Math.max(0, Math.min(60 * 24 * 365, Number(form.get("duration_minutes") ?? 0) || 0));
      if (!question || options.length < 2 || !channelId) {
        pollError = dt("Add a question, a channel, and at least two options.");
      } else {
        const endsAt = durationMinutes > 0 ? new Date(Date.now() + durationMinutes * 6e4).toISOString() : null;
        const insertRes = await fetch(`${apiUrl}/rest/v1/polls`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "return=representation" },
          body: JSON.stringify({ guild_id: id, channel_id: channelId, message_id: "pending", creator_id: session.userId, question, options, image, multi: form.get("multi") === "on", ends_at: endsAt, embed_template: rawTemplate || null })
        });
        const poll = insertRes.ok ? (await insertRes.json())[0] : void 0;
        if (!poll) {
          pollError = dt("The poll could not be saved.");
        } else {
          const messageRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
            method: "POST",
            headers: discordHeaders,
            body: JSON.stringify(await pollMessage(poll, new Array(options.length).fill(0), 0))
          });
          if (!messageRes.ok) {
            await fetch(`${apiUrl}/rest/v1/polls?id=eq.${poll.id}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
            pollError = dt("Discord could not publish the poll. Check the channel and the bot permissions.");
          } else {
            const message = await messageRes.json();
            const finalizeRes = await fetch(`${apiUrl}/rest/v1/polls?id=eq.${poll.id}&guild_id=eq.${id}`, {
              method: "PATCH",
              headers: { ...apiHeaders, Prefer: "return=minimal" },
              body: JSON.stringify({ message_id: message.id })
            });
            if (!finalizeRes.ok) {
              await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${message.id}`, { method: "DELETE", headers: { Authorization: discordHeaders.Authorization } });
              await fetch(`${apiUrl}/rest/v1/polls?id=eq.${poll.id}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
              pollError = dt("The poll was published but could not be linked to the dashboard.");
            } else {
              saved = true;
            }
          }
        }
      }
    } else if (action === "delete_poll") {
      const pollId = Number(form.get("poll_id") ?? 0);
      if (Number.isInteger(pollId) && pollId > 0) {
        const pollRes = await fetch(`${apiUrl}/rest/v1/polls?id=eq.${pollId}&guild_id=eq.${id}&select=id,channel_id,message_id`, { headers: apiHeaders });
        const poll = pollRes.ok ? (await pollRes.json())[0] : void 0;
        if (poll) {
          const gone = await fetch(`https://discord.com/api/v10/channels/${poll.channel_id}/messages/${poll.message_id}`, { method: "DELETE", headers: { Authorization: discordHeaders.Authorization } }).catch(() => null);
          if (gone && !gone.ok && gone.status !== 404 && gone.status !== 403) {
            pollError = dt("Discord did not let me delete the poll message. Try again.");
          } else {
            await fetch(`${apiUrl}/rest/v1/poll_votes?poll_id=eq.${poll.id}`, { method: "DELETE", headers: apiHeaders });
            const removed = await fetch(`${apiUrl}/rest/v1/polls?id=eq.${poll.id}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
            if (removed.ok) saved = true;
            else pollError = dt("The poll message was removed but the poll could not be deleted.");
          }
        }
      }
    } else if (action === "close_poll") {
      const pollId = Number(form.get("poll_id") ?? 0);
      if (Number.isInteger(pollId) && pollId > 0) {
        const pollRes = await fetch(`${apiUrl}/rest/v1/polls?id=eq.${pollId}&guild_id=eq.${id}&select=*`, { headers: apiHeaders });
        const poll = pollRes.ok ? (await pollRes.json())[0] : void 0;
        if (poll && !poll.closed) {
          const voteRes = await fetch(`${apiUrl}/rest/v1/poll_votes?poll_id=eq.${poll.id}&select=choices`, { headers: apiHeaders });
          const votes = voteRes.ok ? await voteRes.json() : [];
          const counts = new Array(poll.options.length).fill(0);
          for (const vote of votes) for (const choice of vote.choices ?? []) if (choice >= 0 && choice < counts.length) counts[choice] += 1;
          await fetch(`${apiUrl}/rest/v1/polls?id=eq.${poll.id}&guild_id=eq.${id}`, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ closed: true }) });
          poll.closed = true;
          await editPollMessage(poll, counts, votes.length);
          saved = true;
        }
      }
    }
  }
  const COMMUNITY_SECTIONS = ["settings", "reputation", "boosters", "polls"];
  const shown = COMMUNITY_SECTIONS.includes(section) ? section : "settings";
  const needs = (...sections) => sections.includes(shown);
  const [guildInfo, reportRes, boosterRes, boosterListRes, rolesRes, channelsRes, reputationConfigRes, reputationRes, repLogRes, pollsRes, templatesRes, prefixRes, messageLinksRes, boosterCountRes, repCountRes, recentPollsRes] = await Promise.all([
    getGuildInfo(id, botToken),
    needs("settings") ? fetch(`${apiUrl}/rest/v1/report_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }) : null,
    needs("settings", "boosters") ? fetch(`${apiUrl}/rest/v1/booster_role_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }) : null,
    needs("boosters") ? callPettoBoosterRoles(Astro2, id, session.userId, "list", {}, dashLang) : null,
    needs("settings", "boosters", "reputation") ? getGuildList(Astro2, id, botToken, "roles") : null,
    needs("settings", "polls", "reputation") ? getGuildList(Astro2, id, botToken, "channels") : null,
    needs("settings", "reputation") ? fetch(`${apiUrl}/rest/v1/reputation_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }) : null,
    needs("reputation") ? fetch(`${apiUrl}/rest/v1/reputation?guild_id=eq.${id}&points=gt.0&select=user_id,points&order=points.desc&limit=25`, { headers: { ...apiHeaders, Prefer: "count=exact" } }) : null,
    needs("reputation", "settings") ? fetch(`${apiUrl}/rest/v1/reputation_log?guild_id=eq.${id}&select=giver_id,receiver_id,channel_id,created_at&order=created_at.desc&limit=${shown === "settings" ? 5 : 20}`, { headers: apiHeaders }).catch(() => null) : null,
    needs("polls") ? fetch(`${apiUrl}/rest/v1/polls?guild_id=eq.${id}&message_id=neq.pending&select=id,channel_id,message_id,creator_id,question,options,image,multi,ends_at,closed,embed_template,created_at&order=created_at.desc&limit=20`, { headers: apiHeaders }) : null,
    needs("polls") ? fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name,data&order=name.asc`, { headers: apiHeaders }) : null,
    needs("boosters", "reputation", "settings") ? fetch(`${apiUrl}/rest/v1/guilds?guild_id=eq.${id}&select=prefix`, { headers: apiHeaders }).catch(() => null) : null,
    needs("settings") ? fetch(`${apiUrl}/rest/v1/message_link_settings?guild_id=eq.${id}&select=enabled,ignored_channels`, { headers: apiHeaders }).catch(() => null) : null,
    // Community Settings also shows how much the other three parts hold (a count and the latest rows of each).
    needs("settings") ? fetch(`${apiUrl}/rest/v1/booster_roles?guild_id=eq.${id}&select=user_id,created_at&order=created_at.desc&limit=50`, { headers: { ...apiHeaders, Prefer: "count=exact" } }).catch(() => null) : null,
    needs("settings") ? fetch(`${apiUrl}/rest/v1/reputation?guild_id=eq.${id}&points=gt.0&select=user_id&limit=100`, { headers: { ...apiHeaders, Prefer: "count=exact" } }).catch(() => null) : null,
    needs("settings") ? fetch(`${apiUrl}/rest/v1/polls?guild_id=eq.${id}&message_id=neq.pending&select=id,channel_id,creator_id,question,closed,created_at&order=created_at.desc&limit=20`, { headers: apiHeaders }).catch(() => null) : null
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const reportRows = reportRes?.ok ? await reportRes.json() : [];
  const r = reportRows[0] ?? {};
  const report = {
    enabled: r.enabled ?? false,
    channelId: r.channel_id ?? null,
    urgentRoleId: r.urgent_role_id ?? null,
    anonymousReportingEnabled: r.anonymous_reporting_enabled ?? false
  };
  const messageLinkRow = (messageLinksRes?.ok ? await messageLinksRes.json().catch(() => []) : [])?.[0] ?? {};
  const messageLinks = {
    enabled: messageLinkRow.enabled === true,
    ignoredChannels: (Array.isArray(messageLinkRow.ignored_channels) ? messageLinkRow.ignored_channels : []).map(String)
  };
  const boosterRows = boosterRes?.ok ? await boosterRes.json() : [];
  const b = boosterRows[0] ?? {};
  const booster = {
    enabled: b.enabled ?? true,
    baseRoleId: b.base_role_id ?? null,
    roleLimit: b.role_limit ?? 1,
    shareMax: b.share_max ?? 0,
    allowGradient: b.allow_gradient ?? true,
    allowIcon: b.allow_icon ?? true,
    onUnboost: ["keep", "remove", "delete"].includes(b.on_unboost) ? b.on_unboost : "keep",
    filteredWords: b.filtered_words ?? [],
    colorCooldownHours: Math.round((b.color_cooldown_ms ?? 0) / 36e5),
    iconCooldownHours: Math.round((b.icon_cooldown_ms ?? 0) / 36e5),
    renameCooldownHours: Math.round((b.rename_cooldown_ms ?? 0) / 36e5)
  };
  const prefixRows = prefixRes?.ok ? await prefixRes.json().catch(() => []) : [];
  const prefix = String(prefixRows?.[0]?.prefix || "!");
  const boosterList = boosterListRes?.ok ? boosterListRes.data : null;
  let boosterRoles = Array.isArray(boosterList?.roles) ? boosterList.roles : [];
  if (needs("boosters") && !boosterList) {
    const rowsRes = await fetch(`${apiUrl}/rest/v1/booster_roles?guild_id=eq.${id}&select=user_id,role_id,color,color2,shared_with,created_at`, { headers: apiHeaders }).catch(() => null);
    const rows = rowsRes?.ok ? await rowsRes.json() : [];
    boosterRoles = (Array.isArray(rows) ? rows : []).map((row) => ({ user_id: String(row.user_id), role_id: String(row.role_id), exists: true, name: null, color: row.color ?? null, color2: row.color2 ?? null, icon: null, editable: true, shared_with: row.shared_with ?? [], in_server: null, boosting: null, created_at: row.created_at ?? null }));
  }
  const boosterStatus = {
    live: Boolean(boosterList),
    canManageRoles: boosterList ? Boolean(boosterList.can_manage_roles) : true,
    boostCount: Number(boosterList?.boost_count ?? 0),
    premiumTier: Number(boosterList?.premium_tier ?? 0),
    withoutRole: Array.isArray(boosterList?.boosters_without_role) ? boosterList.boosters_without_role : []
  };
  const allRoles = rolesRes?.ok ? await rolesRes.json() : [];
  const roleList = (Array.isArray(allRoles) ? allRoles : []).filter((r2) => r2.name !== "@everyone").sort((a, b2) => b2.position - a.position);
  const roles = roleList.map((r2) => ({ id: r2.id, name: r2.name }));
  const roleDetails = roleList.map((r2) => ({ id: String(r2.id), name: String(r2.name), color: Number(r2.colors?.primary_color ?? r2.color ?? 0), managed: Boolean(r2.managed) }));
  const allChannels = channelsRes?.ok ? await channelsRes.json() : [];
  const channels = (Array.isArray(allChannels) ? allChannels : []).filter((c) => Number(c.type) === 0 || Number(c.type) === 5).sort((a, b2) => a.position - b2.position).map((c) => ({ id: c.id, name: c.name }));
  const repConfigRows = reputationConfigRes?.ok ? await reputationConfigRes.json() : [];
  const rc = repConfigRows[0] ?? {};
  const reputation = {
    enabled: rc.enabled ?? true,
    cooldownHours: rc.cooldown_hours ?? 24,
    giverRoleIds: rc.giver_role_ids ?? [],
    blockedRoleIds: rc.blocked_role_ids ?? [],
    channelIds: rc.channel_ids ?? [],
    rewards: (Array.isArray(rc.rewards) ? rc.rewards : []).map((reward) => ({ points: Number(reward.points), roleId: String(reward.role_id) })).filter((reward) => reward.points > 0)
  };
  const reputationRows = reputationRes?.ok ? await reputationRes.json() : [];
  const reputationTotal = Number(String(reputationRes?.headers.get("content-range") ?? "").split("/")[1]) || reputationRows.length;
  const repLogRows = repLogRes?.ok ? await repLogRes.json().catch(() => []) : [];
  const repLog = (Array.isArray(repLogRows) ? repLogRows : []).map((row) => ({ giverId: String(row.giver_id), receiverId: String(row.receiver_id), channelId: row.channel_id ? String(row.channel_id) : null, at: String(row.created_at) }));
  const pollDesigns = (templatesRes?.ok ? await templatesRes.json() : []).filter((row) => isV2Data(row.data)).map((row) => String(row.name));
  const countOf = (res, rows) => Number(String(res?.headers.get("content-range") ?? "").split("/")[1]) || rows.length;
  const boosterCountRows = boosterCountRes?.ok ? await boosterCountRes.json().catch(() => []) : [];
  const repCountRows = repCountRes?.ok ? await repCountRes.json().catch(() => []) : [];
  const recentPollRows = recentPollsRes?.ok ? await recentPollsRes.json().catch(() => []) : [];
  const recentPolls = (Array.isArray(recentPollRows) ? recentPollRows : []).map((row) => ({ id: Number(row.id), channelId: String(row.channel_id), creatorId: String(row.creator_id), question: String(row.question ?? ""), closed: Boolean(row.closed), at: String(row.created_at) }));
  const community = {
    boosterRoles: countOf(boosterCountRes, boosterCountRows),
    reputationMembers: countOf(repCountRes, repCountRows),
    openPolls: recentPolls.filter((poll) => !poll.closed).length,
    polls: recentPolls.length,
    feed: [
      ...repLog.map((row) => ({ kind: "rep", at: row.at, userId: row.giverId, otherId: row.receiverId, channelId: row.channelId, text: "", closed: false })),
      ...recentPolls.slice(0, 4).map((poll) => ({ kind: "poll", at: poll.at, userId: poll.creatorId, otherId: null, channelId: poll.channelId, text: poll.question, closed: poll.closed })),
      ...(Array.isArray(boosterCountRows) ? boosterCountRows : []).slice(0, 4).map((row) => ({ kind: "booster", at: String(row.created_at ?? ""), userId: String(row.user_id), otherId: null, channelId: null, text: "", closed: false }))
    ].filter((event) => event.at && !Number.isNaN(Date.parse(event.at)) && SNOWFLAKE.test(event.userId)).sort((a, b2) => Date.parse(b2.at) - Date.parse(a.at)).slice(0, 8)
  };
  const peopleIds = [.../* @__PURE__ */ new Set([
    ...reputationRows.map((row) => String(row.user_id)),
    ...repLog.flatMap((row) => [row.giverId, row.receiverId]),
    ...boosterRoles.flatMap((row) => [row.user_id, ...(row.shared_with ?? []).slice(0, 5)]),
    ...boosterStatus.withoutRole.slice(0, 12),
    ...community.feed.flatMap((event) => [event.userId, event.otherId ?? ""])
  ])].filter((value) => SNOWFLAKE.test(value)).slice(0, 150);
  const profiles = peopleIds.length ? await getMemberProfiles(Astro2, id, peopleIds, botToken, { userId: session.userId }) : /* @__PURE__ */ new Map();
  const people = Object.fromEntries(peopleIds.map((userId) => {
    const profile = profiles.get(userId) ?? null;
    return [userId, { name: profile?.displayName || profile?.globalName || profile?.username || `Member ${userId.slice(-4)}`, avatar: memberAvatarUrl(userId, profile) }];
  }));
  const reputationTop = reputationRows.map((row) => ({ userId: String(row.user_id), points: Number(row.points) }));
  const rawPolls = pollsRes?.ok ? await pollsRes.json() : [];
  const pollIds = rawPolls.map((poll) => poll.id).filter((pollId) => Number.isInteger(pollId));
  const pollVotesRes = pollIds.length > 0 ? await fetch(`${apiUrl}/rest/v1/poll_votes?poll_id=in.(${pollIds.join(",")})&select=poll_id,choices`, { headers: apiHeaders }) : null;
  const pollVotes = pollVotesRes?.ok ? await pollVotesRes.json() : [];
  const polls = rawPolls.map((poll) => {
    const votes = pollVotes.filter((vote) => String(vote.poll_id) === String(poll.id));
    const counts = new Array(poll.options.length).fill(0);
    for (const vote of votes) for (const choice of vote.choices ?? []) if (choice >= 0 && choice < counts.length) counts[choice] += 1;
    return { ...poll, voters: votes.length, counts };
  });
  return renderTemplate`${renderComponent($$result, "DashCommunity", $$DashCommunity, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "report": report, "messageLinks": messageLinks, "booster": booster, "boosterRoles": boosterRoles, "boosterStatus": boosterStatus, "roleDetails": roleDetails, "prefix": prefix, "notice": notice, "reputationTotal": reputationTotal, "repLog": repLog, "roles": roles, "channels": channels, "saved": saved, "reputation": reputation, "reputationTop": reputationTop, "polls": polls, "community": community, "pollError": pollError, "people": people, "pollDesigns": pollDesigns, "section": section })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/community.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/community.astro";
const $$url = "/dash/guild/[id]/community";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Community,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
