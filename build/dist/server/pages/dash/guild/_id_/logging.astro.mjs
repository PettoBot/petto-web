import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { h as hiddenChannelSet, g as goneChannelLabel } from '../../../../chunks/channelLabel_899ww5-9.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashTabs } from '../../../../chunks/DashTabs_BMsdMY_t.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$MultiSelectOptions } from '../../../../chunks/MultiSelectOptions_D6F-04X6.mjs';
import { $ as $$SelectSource } from '../../../../chunks/SelectSource_Dp8aydFk.mjs';
import { $ as $$SelectChosen } from '../../../../chunks/SelectChosen_B0lELVHS.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
/* empty css                                            */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { e as getGuildList, n as noteGuildWrite, j as getGuildInfo } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { g as getMemberProfiles } from '../../../../chunks/memberNames_skiCoAs8.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashLogging = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashLogging;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const EVENTS = [
    { id: "sanctions", label: dt("Sanctions"), desc: dt("Bans, kicks, mutes, warns, every case Petto logs, and cases or notes the staff changes"), icon: "ph:gavel-fill", color: "#fe6465" },
    { id: "automod", label: dt("Automod"), desc: dt("Messages blocked or flagged by the filter, and AutoMod rule changes"), icon: "ph:shield-warning-fill", color: "#ff9f5a" },
    { id: "verification", label: dt("Verification"), desc: dt("Members passing or failing verification"), icon: "ph:seal-check-fill", color: "#a5ea7a" },
    { id: "members", label: dt("Members"), desc: dt("Joins, leaves, kicks, timeouts and boosts as they happen"), icon: "ph:door-open-fill", color: "#6ec6ff" },
    { id: "messages", label: dt("Messages"), desc: dt("Edits, deletes, pinned or published messages, and poll votes"), icon: "ph:chat-text-fill", color: "#8399ff" },
    { id: "voice", label: dt("Voice"), desc: dt("Joining, leaving, and switching voice channels, and stages"), icon: "ph:speaker-high-fill", color: "#c792ea" },
    { id: "roles", label: dt("Roles"), desc: dt("Role created, deleted, or changed (with its permissions), and member role changes"), icon: "ph:tag-fill", color: "#f78fb3" },
    { id: "channels", label: dt("Channels"), desc: dt("Channel created, deleted, or changed (permissions, voice settings, forum tags)"), icon: "ph:hash-fill", color: "#5eead4" },
    { id: "invites", label: dt("Invites"), desc: dt("Invite links created, deleted or posted in a message"), icon: "ph:link-fill", color: "#7dd3fc" },
    { id: "emojis", label: dt("Emojis"), desc: dt("Server emoji (and the roles that can use them), sticker and soundboard changes"), icon: "ph:smiley-fill", color: "#fed53c" },
    { id: "webhooks", label: dt("Webhooks"), desc: dt("Webhooks created, changed, or deleted"), icon: "ph:webhooks-logo-fill", color: "#ff7ab6" },
    { id: "threads", label: dt("Threads"), desc: dt("Threads created, changed, or deleted"), icon: "ph:chats-fill", color: "#9ad1ff" },
    { id: "integrations", label: dt("Integrations"), desc: dt("Bots added or removed, apps, and the permissions of their commands"), icon: "ph:plugs-connected-fill", color: "#7ee0a8" },
    { id: "commands", label: dt("Commands"), desc: dt("Which Petto command was used, by whom (only its name)"), icon: "ph:terminal-window-fill", color: "#b4bcd0" },
    { id: "tickets", label: dt("Tickets"), desc: dt("Tickets opened, claimed, and closed"), icon: "ph:ticket", color: "#ffb86c" },
    { id: "forms", label: dt("Forms"), desc: dt("Forms sent by members, and who accepted or denied them"), icon: "ph:clipboard-text-fill", color: "#8399ff" },
    { id: "forums", label: dt("Forums"), desc: dt("Forum posts opened, locked, closed and solved"), icon: "ph:chats-circle-fill", color: "#7cc4ff" },
    { id: "server", label: dt("Server"), desc: dt("Name, icon, vanity URL, security settings, onboarding, and scheduled events"), icon: "ph:gear-fill", color: "#94a3b8" }
  ];
  const GROUPS = [
    { id: "people", label: dt("Members and moderation"), icon: "ph:shield-check-fill", events: ["sanctions", "automod", "verification", "members", "messages"] },
    { id: "server", label: dt("Server changes"), icon: "ph:gear-fill", events: ["roles", "channels", "invites", "emojis", "webhooks", "threads", "integrations", "server"] },
    { id: "activity", label: dt("Activity"), icon: "ph:speaker-high-fill", events: ["voice", "commands", "tickets", "forms", "forums"] }
  ];
  const { user, guildId, guildName, guildIcon, channels, roles, routing, ignoredIds, saved, problems = [] } = Astro2.props;
  const hiddenChannels = await hiddenChannelSet(guildId);
  const goneChannel = (id, goneKey) => goneChannelLabel(dt, hiddenChannels, id, goneKey);
  const routed = EVENTS.filter((ev) => routing[ev.id]);
  const notLogged = EVENTS.filter((ev) => !routing[ev.id]);
  const channelNames = new Map(channels.map((c) => [c.id, c.name]));
  const byChannel = /* @__PURE__ */ new Map();
  for (const ev of routed) byChannel.set(routing[ev.id], [...byChannel.get(routing[ev.id]) ?? [], ev]);
  const destinations = [...byChannel.entries()].sort((a, b) => b[1].length - a[1].length);
  const kindIcon = { channel: "ph:hash-bold", role: "ph:tag-fill", user: "ph:user-fill" };
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "logging", "pageTitle": "Logging", "data-astro-cid-lfbk3ebs": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", '<div class="dl-page" data-astro-cid-lfbk3ebs> <h1 data-astro-cid-lfbk3ebs>', '</h1> <p class="dl-lead" data-astro-cid-lfbk3ebs>', "</p> ", " ", " ", ' <div data-tabs="logging" data-astro-cid-lfbk3ebs> <div class="dgl-tabs" role="tablist"', " data-astro-cid-lfbk3ebs> ", ' <button type="button" class="dgl-tab" role="tab" data-tab="ignored" data-astro-cid-lfbk3ebs>', "<span data-astro-cid-lfbk3ebs>", "</span><em data-astro-cid-lfbk3ebs>", '</em></button> </div> <section class="sx-panel dl-quick" data-astro-cid-lfbk3ebs> <div class="dl-quick-row" data-astro-cid-lfbk3ebs> <div class="sx-panel-head" data-astro-cid-lfbk3ebs> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-lfbk3ebs>', '</span> <h2 id="dlAllTitle" data-astro-cid-lfbk3ebs>', '</h2> </div> <div class="dl-bulk" data-astro-cid-lfbk3ebs> <select id="dlAll" data-dl-all data-fill="dl-ch" aria-labelledby="dlAllTitle" data-astro-cid-lfbk3ebs> <option value="" data-astro-cid-lfbk3ebs>', '</option> <option value="__new__" data-astro-cid-lfbk3ebs>', '</option> </select> <button type="button" class="btn btn-ghost btn-sm" data-dl-all-apply data-astro-cid-lfbk3ebs>', '</button> <button type="button" class="btn btn-ghost btn-sm" data-dl-all-clear data-astro-cid-lfbk3ebs>', '</button> </div> </div> <span class="dl-bulk-note" data-dl-note hidden data-astro-cid-lfbk3ebs>', "", '</span> <p class="sx-hint" data-astro-cid-lfbk3ebs>', '</p> </section> <form method="POST" class="dl-routing-form" data-astro-cid-lfbk3ebs> ', ' <div class="sx-foot dl-save-btn" data-astro-cid-lfbk3ebs><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-lfbk3ebs>', "", '</button></div> </form> <section class="sx-panel dl-ignore-panel" data-panel="ignored" hidden data-astro-cid-lfbk3ebs> <div class="sx-panel-head" data-astro-cid-lfbk3ebs> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-lfbk3ebs>', "</span> <h2 data-astro-cid-lfbk3ebs>", '</h2> <span class="sx-tag" data-astro-cid-lfbk3ebs>', '</span> </div> <p class="sx-lead" data-astro-cid-lfbk3ebs>', "</p> ", " ", ' <form method="POST" class="dl-add-form sx-sub" data-no-dirty data-ignore-add', ' data-astro-cid-lfbk3ebs> <input type="hidden" name="action" value="add_ignored" data-astro-cid-lfbk3ebs> <h3 data-astro-cid-lfbk3ebs>', '</h3> <div class="sx-grid sx-grid-3" data-astro-cid-lfbk3ebs> <div class="sx-field" data-astro-cid-lfbk3ebs> <span class="sx-label" data-astro-cid-lfbk3ebs>', "</span> ", ' </div> <div class="sx-field" data-astro-cid-lfbk3ebs> <span class="sx-label" data-astro-cid-lfbk3ebs>', "</span> ", ' </div> <div class="sx-field" data-astro-cid-lfbk3ebs> <span class="sx-label" data-astro-cid-lfbk3ebs>', '</span> <div class="dl-people" data-people data-astro-cid-lfbk3ebs> <div class="dl-people-chips" data-people-chips data-astro-cid-lfbk3ebs></div> <input type="text" class="dl-people-input" data-people-input', ' autocomplete="off" maxlength="32" data-astro-cid-lfbk3ebs> <div class="dl-people-results" data-people-results hidden data-astro-cid-lfbk3ebs></div> </div> </div> </div> <div class="sx-foot" data-astro-cid-lfbk3ebs><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-lfbk3ebs>', "", '</button></div> </form> </section> <section class="sx-panel dl-summary" data-astro-cid-lfbk3ebs> <div class="sx-panel-head" data-astro-cid-lfbk3ebs> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-lfbk3ebs>', "</span> <h2 data-astro-cid-lfbk3ebs>", "</h2> ", " </div> ", " ", " </section> </div> </div> ", " ", " ", " ", ` <script>
    if (!window.__dlPeopleBound) {
      window.__dlPeopleBound = true;
      var dlTimer = 0;
      var dlSeq = 0;
      var dlText = function (node, text) { node.textContent = text; return node; };
      document.addEventListener('input', function (event) {
        var input = event.target && event.target.closest ? event.target.closest('[data-people-input]') : null;
        if (!input) return;
        var wrap = input.closest('[data-people]');
        var results = wrap.querySelector('[data-people-results]');
        var form = input.closest('[data-ignore-add]');
        clearTimeout(dlTimer);
        var query = input.value.trim();
        if (query.length < 2) { results.hidden = true; results.innerHTML = ''; return; }
        var dlHide = function () { if (window.dglMotion) window.dglMotion.hide(results); else results.hidden = true; };
        dlTimer = setTimeout(function () {
          var mine = ++dlSeq;
          // If the search takes more than a moment the list waits with grey rows (shared placeholder) and the people are uncovered from the top down.
          var dlWait = setTimeout(function () {
            if (mine !== dlSeq || !window.dglLoad) return;
            results.innerHTML = ''; results.appendChild(window.dglLoad.shape('rows', 3)); results.hidden = false;
          }, 150);
          fetch(form.getAttribute('data-search-url') + '?q=' + encodeURIComponent(query), { credentials: 'same-origin', headers: { Accept: 'application/json' } })
            .then(function (res) { return res.ok ? res.json() : { members: [] }; })
            .then(function (data) {
              clearTimeout(dlWait);
              if (mine !== dlSeq) return;
              var dlHadWait = !!results.querySelector('.dgl-wait');
              results.innerHTML = '';
              var members = data.members || [];
              if (!members.length) results.appendChild(dlText(Object.assign(document.createElement('div'), { className: 'dl-people-note' }), cdt('Nobody found')));
              members.forEach(function (member) {
                var row = document.createElement('button');
                row.type = 'button';
                row.className = 'dl-person';
                row.setAttribute('data-id', member.id);
                if (member.avatar) { var img = document.createElement('img'); img.src = member.avatar; img.alt = ''; row.appendChild(img); }
                row.appendChild(dlText(document.createElement('span'), member.displayName || member.username || member.id));
                results.appendChild(row);
              });
              if (window.dglMotion) window.dglMotion.stay(results);
              results.hidden = false;
              if (dlHadWait && window.dglLoad) window.dglLoad.reveal(results);
            })
            .catch(function () { clearTimeout(dlWait); dlHide(); });
        }, 300);
      });
      document.addEventListener('click', function (event) {
        var target = event.target && event.target.closest ? event.target : null;
        if (!target) return;
        // A click outside the search closes its list of results.
        document.querySelectorAll('[data-people-results]:not([hidden])').forEach(function (list) {
          if (!list.closest('[data-people]').contains(target)) { if (window.dglMotion) window.dglMotion.hide(list); else list.hidden = true; }
        });
        var pick = target.closest('.dl-person');
        if (pick) {
          var wrap = pick.closest('[data-people]');
          var id = pick.getAttribute('data-id');
          var chips = wrap.querySelector('[data-people-chips]');
          if (!chips.querySelector('[data-id="' + id + '"]')) {
            var chip = document.createElement('span');
            chip.className = 'dl-person-chip';
            chip.setAttribute('data-id', id);
            var hidden = document.createElement('input');
            hidden.type = 'hidden'; hidden.name = 'user_id'; hidden.value = id;
            var remove = document.createElement('button');
            remove.type = 'button'; remove.setAttribute('data-person-remove', ''); remove.textContent = '\\u00d7';
            chip.appendChild(dlText(document.createElement('span'), pick.textContent));
            chip.appendChild(hidden);
            chip.appendChild(remove);
            chips.appendChild(chip);
          }
          var box = wrap.querySelector('[data-people-input]');
          box.value = '';
          var list = wrap.querySelector('[data-people-results]');
          if (window.dglMotion) window.dglMotion.hide(list); else list.hidden = true;
          return;
        }
        var gone = target.closest('[data-person-remove]');
        if (gone) gone.closest('.dl-person-chip').remove();
      });
    }
  <\/script> <script>
    if (!window.__dlAllBound) {
      window.__dlAllBound = true;
      // Picking a channel in the "everything" box fills every event right away (and raises the unsaved changes bar); the button does the same again.
      var applyAll = function () {
        var picker = document.querySelector('[data-dl-all]');
        if (!picker || !picker.value) return;
        document.querySelectorAll('.dl-routing-form select[name^="event_"]').forEach(function (select) {
          select.value = picker.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          select.dispatchEvent(new Event('input', { bubbles: true }));
        });
        var note = document.querySelector('[data-dl-note]');
        if (note) note.hidden = false;
      };
      // The same for the events of one group (a tab), and the buttons that turn events off.
      var setSelects = function (selects, value) {
        selects.forEach(function (select) {
          select.value = value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          select.dispatchEvent(new Event('input', { bubbles: true }));
        });
      };
      document.addEventListener('change', function (event) {
        var target = event.target;
        if (!target || !target.matches) return;
        if (target.matches('[data-dl-all]')) applyAll();
        if (target.matches('[data-dl-group]') && target.value) {
          var panel = target.closest('.dl-panel');
          if (panel) setSelects(Array.prototype.slice.call(panel.querySelectorAll('select[name^="event_"]')), target.value);
        }
      });
      document.addEventListener('click', function (event) {
        var closest = function (selector) { return event.target && event.target.closest ? event.target.closest(selector) : null; };
        if (closest('[data-dl-all-apply]')) applyAll();
        if (closest('[data-dl-all-clear]')) setSelects(Array.prototype.slice.call(document.querySelectorAll('.dl-routing-form select[name^="event_"]')), '');
        var groupClear = closest('[data-dl-group-clear]');
        if (groupClear) {
          var panel = groupClear.closest('.dl-panel');
          if (panel) setSelects(Array.prototype.slice.call(panel.querySelectorAll('select[name^="event_"]')), '');
        }
      });
    }
  <\/script> `], [" ", " ", '<div class="dl-page" data-astro-cid-lfbk3ebs> <h1 data-astro-cid-lfbk3ebs>', '</h1> <p class="dl-lead" data-astro-cid-lfbk3ebs>', "</p> ", " ", " ", ' <div data-tabs="logging" data-astro-cid-lfbk3ebs> <div class="dgl-tabs" role="tablist"', " data-astro-cid-lfbk3ebs> ", ' <button type="button" class="dgl-tab" role="tab" data-tab="ignored" data-astro-cid-lfbk3ebs>', "<span data-astro-cid-lfbk3ebs>", "</span><em data-astro-cid-lfbk3ebs>", '</em></button> </div> <section class="sx-panel dl-quick" data-astro-cid-lfbk3ebs> <div class="dl-quick-row" data-astro-cid-lfbk3ebs> <div class="sx-panel-head" data-astro-cid-lfbk3ebs> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-lfbk3ebs>', '</span> <h2 id="dlAllTitle" data-astro-cid-lfbk3ebs>', '</h2> </div> <div class="dl-bulk" data-astro-cid-lfbk3ebs> <select id="dlAll" data-dl-all data-fill="dl-ch" aria-labelledby="dlAllTitle" data-astro-cid-lfbk3ebs> <option value="" data-astro-cid-lfbk3ebs>', '</option> <option value="__new__" data-astro-cid-lfbk3ebs>', '</option> </select> <button type="button" class="btn btn-ghost btn-sm" data-dl-all-apply data-astro-cid-lfbk3ebs>', '</button> <button type="button" class="btn btn-ghost btn-sm" data-dl-all-clear data-astro-cid-lfbk3ebs>', '</button> </div> </div> <span class="dl-bulk-note" data-dl-note hidden data-astro-cid-lfbk3ebs>', "", '</span> <p class="sx-hint" data-astro-cid-lfbk3ebs>', '</p> </section> <form method="POST" class="dl-routing-form" data-astro-cid-lfbk3ebs> ', ' <div class="sx-foot dl-save-btn" data-astro-cid-lfbk3ebs><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-lfbk3ebs>', "", '</button></div> </form> <section class="sx-panel dl-ignore-panel" data-panel="ignored" hidden data-astro-cid-lfbk3ebs> <div class="sx-panel-head" data-astro-cid-lfbk3ebs> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-lfbk3ebs>', "</span> <h2 data-astro-cid-lfbk3ebs>", '</h2> <span class="sx-tag" data-astro-cid-lfbk3ebs>', '</span> </div> <p class="sx-lead" data-astro-cid-lfbk3ebs>', "</p> ", " ", ' <form method="POST" class="dl-add-form sx-sub" data-no-dirty data-ignore-add', ' data-astro-cid-lfbk3ebs> <input type="hidden" name="action" value="add_ignored" data-astro-cid-lfbk3ebs> <h3 data-astro-cid-lfbk3ebs>', '</h3> <div class="sx-grid sx-grid-3" data-astro-cid-lfbk3ebs> <div class="sx-field" data-astro-cid-lfbk3ebs> <span class="sx-label" data-astro-cid-lfbk3ebs>', "</span> ", ' </div> <div class="sx-field" data-astro-cid-lfbk3ebs> <span class="sx-label" data-astro-cid-lfbk3ebs>', "</span> ", ' </div> <div class="sx-field" data-astro-cid-lfbk3ebs> <span class="sx-label" data-astro-cid-lfbk3ebs>', '</span> <div class="dl-people" data-people data-astro-cid-lfbk3ebs> <div class="dl-people-chips" data-people-chips data-astro-cid-lfbk3ebs></div> <input type="text" class="dl-people-input" data-people-input', ' autocomplete="off" maxlength="32" data-astro-cid-lfbk3ebs> <div class="dl-people-results" data-people-results hidden data-astro-cid-lfbk3ebs></div> </div> </div> </div> <div class="sx-foot" data-astro-cid-lfbk3ebs><button type="submit" class="btn btn-ghost btn-sm" data-astro-cid-lfbk3ebs>', "", '</button></div> </form> </section> <section class="sx-panel dl-summary" data-astro-cid-lfbk3ebs> <div class="sx-panel-head" data-astro-cid-lfbk3ebs> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-lfbk3ebs>', "</span> <h2 data-astro-cid-lfbk3ebs>", "</h2> ", " </div> ", " ", " </section> </div> </div> ", " ", " ", " ", ` <script>
    if (!window.__dlPeopleBound) {
      window.__dlPeopleBound = true;
      var dlTimer = 0;
      var dlSeq = 0;
      var dlText = function (node, text) { node.textContent = text; return node; };
      document.addEventListener('input', function (event) {
        var input = event.target && event.target.closest ? event.target.closest('[data-people-input]') : null;
        if (!input) return;
        var wrap = input.closest('[data-people]');
        var results = wrap.querySelector('[data-people-results]');
        var form = input.closest('[data-ignore-add]');
        clearTimeout(dlTimer);
        var query = input.value.trim();
        if (query.length < 2) { results.hidden = true; results.innerHTML = ''; return; }
        var dlHide = function () { if (window.dglMotion) window.dglMotion.hide(results); else results.hidden = true; };
        dlTimer = setTimeout(function () {
          var mine = ++dlSeq;
          // If the search takes more than a moment the list waits with grey rows (shared placeholder) and the people are uncovered from the top down.
          var dlWait = setTimeout(function () {
            if (mine !== dlSeq || !window.dglLoad) return;
            results.innerHTML = ''; results.appendChild(window.dglLoad.shape('rows', 3)); results.hidden = false;
          }, 150);
          fetch(form.getAttribute('data-search-url') + '?q=' + encodeURIComponent(query), { credentials: 'same-origin', headers: { Accept: 'application/json' } })
            .then(function (res) { return res.ok ? res.json() : { members: [] }; })
            .then(function (data) {
              clearTimeout(dlWait);
              if (mine !== dlSeq) return;
              var dlHadWait = !!results.querySelector('.dgl-wait');
              results.innerHTML = '';
              var members = data.members || [];
              if (!members.length) results.appendChild(dlText(Object.assign(document.createElement('div'), { className: 'dl-people-note' }), cdt('Nobody found')));
              members.forEach(function (member) {
                var row = document.createElement('button');
                row.type = 'button';
                row.className = 'dl-person';
                row.setAttribute('data-id', member.id);
                if (member.avatar) { var img = document.createElement('img'); img.src = member.avatar; img.alt = ''; row.appendChild(img); }
                row.appendChild(dlText(document.createElement('span'), member.displayName || member.username || member.id));
                results.appendChild(row);
              });
              if (window.dglMotion) window.dglMotion.stay(results);
              results.hidden = false;
              if (dlHadWait && window.dglLoad) window.dglLoad.reveal(results);
            })
            .catch(function () { clearTimeout(dlWait); dlHide(); });
        }, 300);
      });
      document.addEventListener('click', function (event) {
        var target = event.target && event.target.closest ? event.target : null;
        if (!target) return;
        // A click outside the search closes its list of results.
        document.querySelectorAll('[data-people-results]:not([hidden])').forEach(function (list) {
          if (!list.closest('[data-people]').contains(target)) { if (window.dglMotion) window.dglMotion.hide(list); else list.hidden = true; }
        });
        var pick = target.closest('.dl-person');
        if (pick) {
          var wrap = pick.closest('[data-people]');
          var id = pick.getAttribute('data-id');
          var chips = wrap.querySelector('[data-people-chips]');
          if (!chips.querySelector('[data-id="' + id + '"]')) {
            var chip = document.createElement('span');
            chip.className = 'dl-person-chip';
            chip.setAttribute('data-id', id);
            var hidden = document.createElement('input');
            hidden.type = 'hidden'; hidden.name = 'user_id'; hidden.value = id;
            var remove = document.createElement('button');
            remove.type = 'button'; remove.setAttribute('data-person-remove', ''); remove.textContent = '\\\\u00d7';
            chip.appendChild(dlText(document.createElement('span'), pick.textContent));
            chip.appendChild(hidden);
            chip.appendChild(remove);
            chips.appendChild(chip);
          }
          var box = wrap.querySelector('[data-people-input]');
          box.value = '';
          var list = wrap.querySelector('[data-people-results]');
          if (window.dglMotion) window.dglMotion.hide(list); else list.hidden = true;
          return;
        }
        var gone = target.closest('[data-person-remove]');
        if (gone) gone.closest('.dl-person-chip').remove();
      });
    }
  <\/script> <script>
    if (!window.__dlAllBound) {
      window.__dlAllBound = true;
      // Picking a channel in the "everything" box fills every event right away (and raises the unsaved changes bar); the button does the same again.
      var applyAll = function () {
        var picker = document.querySelector('[data-dl-all]');
        if (!picker || !picker.value) return;
        document.querySelectorAll('.dl-routing-form select[name^="event_"]').forEach(function (select) {
          select.value = picker.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          select.dispatchEvent(new Event('input', { bubbles: true }));
        });
        var note = document.querySelector('[data-dl-note]');
        if (note) note.hidden = false;
      };
      // The same for the events of one group (a tab), and the buttons that turn events off.
      var setSelects = function (selects, value) {
        selects.forEach(function (select) {
          select.value = value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          select.dispatchEvent(new Event('input', { bubbles: true }));
        });
      };
      document.addEventListener('change', function (event) {
        var target = event.target;
        if (!target || !target.matches) return;
        if (target.matches('[data-dl-all]')) applyAll();
        if (target.matches('[data-dl-group]') && target.value) {
          var panel = target.closest('.dl-panel');
          if (panel) setSelects(Array.prototype.slice.call(panel.querySelectorAll('select[name^="event_"]')), target.value);
        }
      });
      document.addEventListener('click', function (event) {
        var closest = function (selector) { return event.target && event.target.closest ? event.target.closest(selector) : null; };
        if (closest('[data-dl-all-apply]')) applyAll();
        if (closest('[data-dl-all-clear]')) setSelects(Array.prototype.slice.call(document.querySelectorAll('.dl-routing-form select[name^="event_"]')), '');
        var groupClear = closest('[data-dl-group-clear]');
        if (groupClear) {
          var panel = groupClear.closest('.dl-panel');
          if (panel) setSelects(Array.prototype.slice.call(panel.querySelectorAll('select[name^="event_"]')), '');
        }
      });
    }
  <\/script> `])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-lfbk3ebs": true }), maybeRenderHead(), dt("Logging"), dt("Choose the channel where each kind of event is written. Petto sets up the webhooks for you."), saved && renderTemplate`<div class="sx-flash" data-astro-cid-lfbk3ebs> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-lfbk3ebs": true })} ${dt("Saved, routing is live.")} </div>`, problems.map((problem) => renderTemplate`<div class="sx-flash sx-flash-bad" data-astro-cid-lfbk3ebs>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-lfbk3ebs": true })}${problem}</div>`), renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Events logged"), value: routed.length, tone: "joins" },
    { label: dt("Events off"), value: notLogged.length, tone: "leaves" },
    { label: dt("Log channels"), value: byChannel.size, tone: "voice" },
    { label: dt("Ignored"), value: ignoredIds.length, tone: "invites" }
  ], "data-astro-cid-lfbk3ebs": true }), addAttribute(dt("Logging"), "aria-label"), GROUPS.map((g) => renderTemplate`<button type="button" class="dgl-tab" role="tab"${addAttribute(g.id, "data-tab")} data-astro-cid-lfbk3ebs>${renderComponent($$result2, "Icon", $$Icon, { "name": g.icon, "width": "15", "height": "15", "data-astro-cid-lfbk3ebs": true })}<span data-astro-cid-lfbk3ebs>${g.label}</span><em data-astro-cid-lfbk3ebs>${g.events.filter((id) => routing[id]).length}/${g.events.length}</em><i class="dgl-tab-dot" data-astro-cid-lfbk3ebs></i></button>`), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-slash-fill", "width": "15", "height": "15", "data-astro-cid-lfbk3ebs": true }), dt("Ignored"), ignoredIds.length, renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lightning-fill", "width": "17", "height": "17", "data-astro-cid-lfbk3ebs": true }), dt("Send everything to one channel"), dt("Pick a channel"), dt("Create a new channel"), dt("Use it for every event"), dt("Turn every event off"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "13", "height": "13", "data-astro-cid-lfbk3ebs": true }), dt("Set on every event. Press Save changes to keep it."), dt('"Create a new channel" makes a private channel called #petto-logs that only the staff can see, when you save.'), GROUPS.map((g) => renderTemplate`<div class="dl-panel dgl-stagger"${addAttribute(g.id, "data-panel")} hidden data-astro-cid-lfbk3ebs> <div class="dl-group-bar" data-astro-cid-lfbk3ebs> <label data-astro-cid-lfbk3ebs>${dt("Send this whole group to")}</label> <select data-dl-group data-fill="dl-ch" data-astro-cid-lfbk3ebs> <option value="" data-astro-cid-lfbk3ebs>${dt("Pick a channel")}</option> <option value="__new__" data-astro-cid-lfbk3ebs>${dt("Create a new channel")}</option> </select> <button type="button" class="btn btn-ghost btn-sm" data-dl-group-clear data-astro-cid-lfbk3ebs>${dt("Turn this group off")}</button> </div> ${EVENTS.filter((ev) => g.events.includes(ev.id)).map((ev) => renderTemplate`<div class="dl-row"${addAttribute(`--row-c:${ev.color}`, "style")} data-astro-cid-lfbk3ebs> <span class="dl-row-icon" data-astro-cid-lfbk3ebs>${renderComponent($$result2, "Icon", $$Icon, { "name": ev.icon, "width": "17", "height": "17", "data-astro-cid-lfbk3ebs": true })}</span> <div class="dl-row-text" data-astro-cid-lfbk3ebs> <b data-astro-cid-lfbk3ebs>${ev.label}</b> <em data-astro-cid-lfbk3ebs>${ev.desc}</em> </div> <select${addAttribute(`event_${ev.id}`, "name")} data-fill="dl-ch"${addAttribute(ev.label, "aria-label")} data-astro-cid-lfbk3ebs> <option value="" data-astro-cid-lfbk3ebs>${dt("Off, don't log this")}</option> <option value="__new__" data-astro-cid-lfbk3ebs>${dt("Create a new channel")}</option> ${renderComponent($$result2, "SelectChosen", $$SelectChosen, { "items": channels, "selected": routing[ev.id], "prefix": "#", "data-astro-cid-lfbk3ebs": true })} </select> </div>`)} </div>`), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-lfbk3ebs": true }), dt("Save changes"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-slash-fill", "width": "17", "height": "17", "data-astro-cid-lfbk3ebs": true }), dt("Ignored"), ignoredIds.length, dt("These channels, roles or people are skipped entirely, across every event."), ignoredIds.length === 0 && renderTemplate`<p class="sx-empty" data-astro-cid-lfbk3ebs>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "16", "height": "16", "data-astro-cid-lfbk3ebs": true })}${dt("Nothing is ignored yet: every channel, role and person is logged.")}</p>`, ignoredIds.length > 0 && renderTemplate`<div class="dl-list-grid dgl-stagger" data-astro-cid-lfbk3ebs> ${ignoredIds.map((i) => renderTemplate`<form method="POST" class="dl-list-row" data-no-dirty data-astro-cid-lfbk3ebs> <input type="hidden" name="action" value="delete_ignored" data-astro-cid-lfbk3ebs> <input type="hidden" name="target_id"${addAttribute(i.targetId, "value")} data-astro-cid-lfbk3ebs> ${renderComponent($$result2, "Icon", $$Icon, { "name": kindIcon[i.kind], "width": "13", "height": "13", "data-astro-cid-lfbk3ebs": true })} <span class="dl-list-name" data-astro-cid-lfbk3ebs>${i.label}</span> <button type="submit" class="dl-list-del"${addAttribute(dt("Remove"), "aria-label")}${addAttribute(dt("Remove"), "title")} data-astro-cid-lfbk3ebs>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-lfbk3ebs": true })}</button> </form>`)} </div>`, addAttribute(`/dash/guild/${guildId}/members-search`, "data-search-url"), dt("Add to the list"), dt("Channels"), renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "channel_id", "options": [], "source": "dl-ms-channels", "selected": [], "placeholder": dt("Pick channels"), "data-astro-cid-lfbk3ebs": true }), dt("Roles"), renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "role_id", "options": [], "source": "dl-ms-roles", "selected": [], "placeholder": dt("Pick roles"), "data-astro-cid-lfbk3ebs": true }), dt("People"), addAttribute(dt("Type a name to search"), "placeholder"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-lfbk3ebs": true }), dt("Add"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-lfbk3ebs": true }), dt("Where your logs go"), destinations.length > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-lfbk3ebs>${destinations.length}</span>`, destinations.length === 0 ? renderTemplate`<div class="dl-summary-empty" data-astro-cid-lfbk3ebs>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-slash-fill", "width": "26", "height": "26", "data-astro-cid-lfbk3ebs": true })}<b data-astro-cid-lfbk3ebs>${dt("Nothing is logged yet")}</b><p data-astro-cid-lfbk3ebs>${dt("Pick a channel for an event, or send everything to one channel.")}</p></div>` : renderTemplate`<ul class="dl-dest dgl-stagger" data-astro-cid-lfbk3ebs> ${destinations.map(([channelId, evs]) => renderTemplate`<li class="dl-dest-item" data-astro-cid-lfbk3ebs> <div class="dl-dest-top" data-astro-cid-lfbk3ebs> <b${addAttribute({ "dl-dest-gone": !channelNames.has(channelId) }, "class:list")} data-astro-cid-lfbk3ebs>${channelNames.has(channelId) ? `#${channelNames.get(channelId)}` : goneChannel(channelId, "A channel that is gone")}</b> <span class="sx-tag" data-astro-cid-lfbk3ebs>${evs.length}</span> </div> <div class="dl-evchips" data-astro-cid-lfbk3ebs> ${evs.map((ev) => renderTemplate`<span class="dl-evchip"${addAttribute(`--row-c:${ev.color}`, "style")} data-astro-cid-lfbk3ebs>${renderComponent($$result2, "Icon", $$Icon, { "name": ev.icon, "width": "12", "height": "12", "data-astro-cid-lfbk3ebs": true })}${ev.label}</span>`)} </div> </li>`)} </ul>`, notLogged.length > 0 && renderTemplate`<div class="sx-sub" data-astro-cid-lfbk3ebs> <h3 data-astro-cid-lfbk3ebs>${destinations.length > 0 ? dt("Not logged") : dt("Events you can log")}</h3> <div class="dl-evchips dl-evchips-off" data-astro-cid-lfbk3ebs> ${notLogged.map((ev) => renderTemplate`<span class="dl-evchip" data-astro-cid-lfbk3ebs>${renderComponent($$result2, "Icon", $$Icon, { "name": ev.icon, "width": "12", "height": "12", "data-astro-cid-lfbk3ebs": true })}${ev.label}</span>`)} </div> </div>`, renderComponent($$result2, "MultiSelectOptions", $$MultiSelectOptions, { "name": "dl-ms-channels", "options": channels.map((c) => ({ id: c.id, name: `#${c.name}` })), "data-astro-cid-lfbk3ebs": true }), renderComponent($$result2, "MultiSelectOptions", $$MultiSelectOptions, { "name": "dl-ms-roles", "options": roles, "data-astro-cid-lfbk3ebs": true }), renderComponent($$result2, "SelectSource", $$SelectSource, { "name": "dl-ch", "items": channels, "prefix": "#", "data-astro-cid-lfbk3ebs": true }), renderComponent($$result2, "DashTabs", $$DashTabs, { "data-astro-cid-lfbk3ebs": true })) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashLogging.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Logging = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Logging;
  const EVENTS = ["sanctions", "automod", "verification", "members", "messages", "voice", "roles", "channels", "invites", "emojis", "webhooks", "threads", "integrations", "commands", "tickets", "forms", "server"];
  const NEW_CHANNEL = "__new__";
  const { id } = Astro2.params;
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
  const dt = makeT(getDashLang(Astro2));
  const problems = [];
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "routing");
    if (action === "add_ignored") {
      const picked = [...form.getAll("channel_id"), ...form.getAll("role_id"), ...form.getAll("user_id"), form.get("target_id") ?? ""].map(String).join(" ");
      const targetIds = [...new Set([...picked.matchAll(/\d{15,25}/g)].map((match) => match[0]))].slice(0, 50);
      if (targetIds.length) {
        const ignoredRes2 = await fetch(`${apiUrl}/rest/v1/log_ignored?on_conflict=guild_id,target_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify(targetIds.map((targetId) => ({ guild_id: id, target_id: targetId })))
        });
        if (ignoredRes2.ok) saved = true;
        else problems.push(dt("The ignored list could not be saved. Try again."));
      } else {
        problems.push(dt("Pick at least one channel, role or person."));
      }
    } else if (action === "delete_ignored") {
      const targetId = encodeURIComponent(String(form.get("target_id") ?? ""));
      await fetch(`${apiUrl}/rest/v1/log_ignored?guild_id=eq.${id}&target_id=eq.${targetId}`, { method: "DELETE", headers: apiHeaders });
      saved = true;
    } else {
      const [entriesRes2, webhooksRes, channelList] = await Promise.all([
        fetch(`${apiUrl}/rest/v1/log_entries?guild_id=eq.${id}&select=event,channel_id`, { headers: apiHeaders }),
        fetch(`${apiUrl}/rest/v1/log_webhooks?guild_id=eq.${id}&select=channel_id`, { headers: apiHeaders }),
        getGuildList(Astro2, id, botToken, "channels").then((r) => r.ok ? r.json() : []).catch(() => [])
      ]);
      const currentEntries = entriesRes2.ok ? await entriesRes2.json() : [];
      const currentRouting = {};
      for (const e of currentEntries) currentRouting[e.event] = e.channel_id;
      const existingWebhookChannels = new Set((webhooksRes.ok ? await webhooksRes.json() : []).map((w) => w.channel_id));
      const channelNames = new Map(channelList.map((c) => [c.id, c.name]));
      const changes = [];
      for (const eventId of EVENTS) {
        const selected = String(form.get(`event_${eventId}`) ?? "").trim();
        const previous = currentRouting[eventId];
        if (selected !== (previous ?? "")) changes.push({ eventId, selected, previous });
      }
      if (changes.some((c) => c.selected === NEW_CHANNEL)) {
        let botId = "";
        try {
          botId = atob(botToken.split(".")[0]);
        } catch {
          botId = "";
        }
        const created = await fetch(`https://discord.com/api/guilds/${id}/channels`, {
          method: "POST",
          headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "petto-logs",
            type: 0,
            topic: "Server logs sent by Petto.",
            // Only the staff (and Petto) can see it: everyone else is denied View Channel.
            permission_overwrites: [
              { id, type: 0, deny: "1024" },
              ...botId ? [{ id: botId, type: 1, allow: String(1024 + 2048 + 16384 + 536870912) }] : []
            ]
          })
        }).catch(() => null);
        const detail = created ? await created.json().catch(() => null) : null;
        if (created?.ok && detail?.id) {
          noteGuildWrite(id);
          for (const c of changes) if (c.selected === NEW_CHANNEL) c.selected = String(detail.id);
          channelNames.set(String(detail.id), "petto-logs");
        } else {
          problems.push(detail?.code === 50013 || created?.status === 403 ? dt("I need the Manage Channels permission to create a channel.") : dt("The channel could not be created."));
          for (let i = changes.length - 1; i >= 0; i -= 1) if (changes[i].selected === NEW_CHANNEL) changes.splice(i, 1);
        }
      }
      const needWebhook = [...new Set(changes.map((c) => c.selected).filter((c) => c && !existingWebhookChannels.has(c)))];
      const failedChannels = /* @__PURE__ */ new Map();
      await Promise.all(needWebhook.map(async (channelId) => {
        const whRes = await fetch(`https://discord.com/api/channels/${channelId}/webhooks`, {
          method: "POST",
          headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({ name: "Petto Logs" })
        }).catch(() => null);
        if (whRes?.ok) {
          noteGuildWrite(id);
          const webhook = await whRes.json();
          const stored = await fetch(`${apiUrl}/rest/v1/log_webhooks?on_conflict=guild_id,channel_id`, {
            method: "POST",
            headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify({ guild_id: id, channel_id: channelId, webhook_id: webhook.id, webhook_token: webhook.token })
          });
          if (stored.ok) existingWebhookChannels.add(channelId);
          else failedChannels.set(channelId, dt("Something went wrong, try again."));
          return;
        }
        const detail = whRes ? await whRes.json().catch(() => null) : null;
        failedChannels.set(channelId, detail?.code === 50013 || whRes?.status === 403 ? dt("I need the Manage Webhooks permission in that channel.") : detail?.code === 30007 ? dt("That channel already has the maximum of 15 webhooks.") : detail?.code === 10003 ? dt("That channel no longer exists.") : dt("Discord did not accept it."));
      }));
      const applicable = changes.filter((c) => !c.selected || existingWebhookChannels.has(c.selected));
      for (const c of changes) {
        if (c.selected && failedChannels.has(c.selected)) {
          problems.push(`${dt("Could not set up #{channel} for {event}.", { channel: channelNames.get(c.selected) ?? c.selected, event: c.eventId })} ${failedChannels.get(c.selected)}`);
        }
      }
      const toClear = applicable.filter((c) => c.previous).map((c) => c.eventId);
      if (toClear.length) {
        const del = await fetch(`${apiUrl}/rest/v1/log_entries?guild_id=eq.${id}&event=in.(${toClear.join(",")})`, { method: "DELETE", headers: apiHeaders });
        if (!del.ok) problems.push(dt("Something went wrong, try again."));
      }
      const toAdd = applicable.filter((c) => c.selected).map((c) => ({ guild_id: id, channel_id: c.selected, event: c.eventId }));
      if (toAdd.length) {
        const add = await fetch(`${apiUrl}/rest/v1/log_entries?on_conflict=guild_id,channel_id,event`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify(toAdd)
        });
        if (!add.ok) problems.push(dt("Something went wrong, try again."));
      }
      saved = problems.length === 0;
    }
  }
  const [guildInfo, entriesRes, ignoredRes, channelsRes, rolesRes] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/log_entries?guild_id=eq.${id}&select=event,channel_id`, { headers: apiHeaders }),
    fetch(`${apiUrl}/rest/v1/log_ignored?guild_id=eq.${id}&select=target_id`, { headers: apiHeaders }),
    getGuildList(Astro2, id, botToken, "channels"),
    getGuildList(Astro2, id, botToken, "roles")
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const entries = entriesRes.ok ? await entriesRes.json() : [];
  const routing = {};
  for (const e of entries) routing[e.event] = e.channel_id;
  const allChannels = channelsRes.ok ? await channelsRes.json() : [];
  const categoryNames = new Map(allChannels.filter((c) => c.type === 4).map((c) => [String(c.id), String(c.name)]));
  const categoryOrder = new Map(allChannels.filter((c) => c.type === 4).map((c) => [String(c.id), Number(c.position ?? 0)]));
  const channels = allChannels.filter((c) => c.type === 0 || c.type === 5).sort((a, b) => (categoryOrder.get(String(a.parent_id)) ?? -1) - (categoryOrder.get(String(b.parent_id)) ?? -1) || a.position - b.position).map((c) => ({ id: c.id, name: c.name, category: categoryNames.get(String(c.parent_id)) ?? "" }));
  const allRoles = rolesRes.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((r) => r.name !== "@everyone" && !r.managed).sort((a, b) => b.position - a.position).map((r) => ({ id: String(r.id), name: String(r.name) }));
  const rawIgnored = ignoredRes.ok ? await ignoredRes.json() : [];
  const channelById = new Map(allChannels.map((c) => [String(c.id), c]));
  const roleById = new Map(allRoles.map((r) => [String(r.id), r]));
  const peopleIds = rawIgnored.map((r) => String(r.target_id)).filter((targetId) => !channelById.has(targetId) && !roleById.has(targetId));
  const people = peopleIds.length ? await getMemberProfiles(Astro2, id, peopleIds, botToken).catch(() => /* @__PURE__ */ new Map()) : /* @__PURE__ */ new Map();
  const ignoredIds = rawIgnored.map((r) => {
    const targetId = String(r.target_id);
    if (channelById.has(targetId)) return { targetId, kind: "channel", label: `#${channelById.get(targetId).name}` };
    if (roleById.has(targetId)) return { targetId, kind: "role", label: `@${roleById.get(targetId).name}` };
    const person = people.get(targetId);
    return { targetId, kind: "user", label: person ? person.displayName || person.username : targetId };
  });
  return renderTemplate`${renderComponent($$result, "DashLogging", $$DashLogging, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "channels": channels, "roles": roles, "routing": routing, "ignoredIds": ignoredIds, "saved": saved, "problems": problems })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/logging.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/logging.astro";
const $$url = "/dash/guild/[id]/logging";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Logging,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
