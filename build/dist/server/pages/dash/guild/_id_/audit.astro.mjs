import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from '../../../../chunks/dash_CORIPvM-.mjs';
import { a as agoText } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
/* empty css                                          */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { cached } from '../../../../chunks/sharedCache_DFk4ml3Q.mjs';
import { u as userAvatar } from '../../../../chunks/premiumAdmin_C4HUbWtx.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashAuditLog = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashAuditLog;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, entries, error } = Astro2.props;
  const ACTION_ICON = {
    create_group: "ph:plus-circle-fill",
    delete_group: "ph:trash-fill",
    update_group_level: "ph:gauge-fill",
    set_command_level: "ph:gauge-fill",
    add_member: "ph:user-plus-fill",
    remove_member: "ph:user-minus-fill"
  };
  const ACTION_COLOR = {
    create_group: "#a5ea7a",
    delete_group: "#fe6465",
    update_group_level: "#fed53c",
    set_command_level: "#8399ff",
    add_member: "#a5ea7a",
    remove_member: "#fe6465"
  };
  function timeAgo(iso) {
    if (Date.now() - new Date(iso).getTime() >= 30 * 864e5) return new Date(iso).toLocaleDateString(dashLang);
    return agoText(dt, iso, { locale: dashLocale(dashLang) });
  }
  const now = Date.now();
  const ageOf = (e) => Math.max(0, now - new Date(e.createdAt).getTime());
  const HOUR = 36e5;
  const DAY = 24 * HOUR;
  const people = new Set(entries.map((e) => e.actorId ?? e.actorName)).size;
  const latest = entries.length ? timeAgo(entries[0].createdAt) : "\u2013";
  const lastDay = entries.filter((e) => ageOf(e) < DAY).length;
  const tally = (keyOf, labelOf) => {
    const map = /* @__PURE__ */ new Map();
    for (const e of entries) {
      const key = keyOf(e);
      const row = map.get(key);
      if (row) row.n += 1;
      else map.set(key, { label: labelOf(e), n: 1 });
    }
    return [...map.entries()].map(([key, row]) => ({ key, label: row.label, n: row.n })).sort((a, b) => b.n - a.n);
  };
  const topPeople = tally((e) => e.actorId ?? e.actorName, (e) => e.actorName).slice(0, 5).map((p) => ({ ...p, avatar: entries.find((e) => (e.actorId ?? e.actorName) === p.key)?.actorAvatar ?? null }));
  const topActions = tally((e) => e.action, (e) => e.action).slice(0, 5);
  const maxPerson = topPeople[0]?.n ?? 1;
  const maxAction = topActions[0]?.n ?? 1;
  const days = Array.from({ length: 14 }, (_, back) => entries.filter((e) => Math.floor(ageOf(e) / DAY) === 13 - back).length);
  const maxDay = Math.max(1, ...days);
  const bucketOf = (e) => {
    const age = ageOf(e);
    return age < HOUR ? "hour" : age < DAY ? "day" : age < 7 * DAY ? "week" : "old";
  };
  const bucketLabel = { hour: dt("Last hour"), day: dt("Last 24 hours"), week: dt("Last 7 days"), old: dt("Earlier") };
  const groups = ["hour", "day", "week", "old"].map((id) => ({ id, label: bucketLabel[id], rows: entries.filter((e) => bucketOf(e) === id) })).filter((g) => g.rows.length);
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "audit", "pageTitle": "Audit Log", "data-astro-cid-lsrjotyt": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", " ", '<span hidden data-dash-live="60" data-astro-cid-lsrjotyt></span> <div class="al" data-astro-cid-lsrjotyt> <h1 data-astro-cid-lsrjotyt>', "</h1> ", " ", " ", ` </div> <script>
    // The search and the chips of people filter the events already on the page. Works again when the dashboard swaps the page in.
    (function bind() {
      var root = document.querySelector('[data-audit]:not([data-bound])');
      if (!root) return;
      root.setAttribute('data-bound', '1');
      var input = root.querySelector('[data-al-search]');
      var rows = Array.prototype.slice.call(root.querySelectorAll('.al-row'));
      var groups = Array.prototype.slice.call(root.querySelectorAll('[data-al-group]'));
      var count = root.querySelector('[data-al-count]');
      var none = root.querySelector('.al-none');
      var apply = function () {
        var q = (input && input.value || '').trim().toLowerCase();
        var checked = root.querySelector('input[name="al-who"]:checked');
        var who = checked ? checked.value : '';
        var shown = 0;
        rows.forEach(function (row) {
          var ok = (!who || row.getAttribute('data-actor') === who) && (!q || row.getAttribute('data-search').indexOf(q) !== -1);
          row.hidden = !ok; if (ok) shown++;
        });
        groups.forEach(function (group) { group.hidden = !group.querySelector('.al-row:not([hidden])'); });
        if (count) count.textContent = String(shown);
        if (none) none.hidden = shown > 0;
      };
      if (input) input.addEventListener('input', apply);
      root.querySelectorAll('input[name="al-who"]').forEach(function (radio) { radio.addEventListener('change', apply); });
    })();
  <\/script> `])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-lsrjotyt": true }), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-lsrjotyt": true }), maybeRenderHead(), dt("Audit Log"), error && renderTemplate`<div class="al-error" data-astro-cid-lsrjotyt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-lsrjotyt": true })}${error}</div>`, renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Events"), value: entries.length, tone: "messages" },
    { label: dt("People"), value: people, tone: "voice" },
    { label: dt("Last 24 hours"), value: lastDay, tone: "joins" },
    { label: dt("Latest"), value: 0, text: latest, tone: "invites" }
  ], "data-astro-cid-lsrjotyt": true }), entries.length === 0 ? renderTemplate`<div class="al-empty" data-astro-cid-lsrjotyt> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clipboard-text-fill", "width": "26", "height": "26", "data-astro-cid-lsrjotyt": true })} <b data-astro-cid-lsrjotyt>${dt("No Discord audit events were returned for this server.")}</b> <p data-astro-cid-lsrjotyt>${dt("What moderators and Petto do in the server, like bans, kicks, roles and channels, shows up here as Discord records it.")}</p> </div>` : renderTemplate`<div class="al-grid" data-audit data-astro-cid-lsrjotyt> <aside class="al-side" data-astro-cid-lsrjotyt> <section class="sx-panel al-box" data-astro-cid-lsrjotyt> <div class="sx-panel-head" data-astro-cid-lsrjotyt> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-lsrjotyt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "17", "height": "17", "data-astro-cid-lsrjotyt": true })}</span> <h2 data-astro-cid-lsrjotyt>${dt("Most active")}</h2> </div> <ol class="al-top" data-astro-cid-lsrjotyt> ${topPeople.map((p, i) => renderTemplate`<li${addAttribute(`--i:${i}`, "style")} data-astro-cid-lsrjotyt><span class="al-who" data-astro-cid-lsrjotyt>${p.avatar ? renderTemplate`<img class="al-av"${addAttribute(p.avatar, "src")} alt="" width="24" height="24" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-astro-cid-lsrjotyt>` : renderTemplate`<i data-astro-cid-lsrjotyt>${String(p.label).slice(0, 1).toUpperCase()}</i>`}<b data-astro-cid-lsrjotyt>${p.label}</b></span><em data-astro-cid-lsrjotyt>${p.n}</em><span class="al-track" data-astro-cid-lsrjotyt><i${addAttribute(`width:${Math.max(6, Math.round(p.n / maxPerson * 100))}%`, "style")} data-astro-cid-lsrjotyt></i></span></li>`)} </ol> </section> <section class="sx-panel al-box" data-astro-cid-lsrjotyt> <div class="sx-panel-head" data-astro-cid-lsrjotyt> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-lsrjotyt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chart-bar-fill", "width": "17", "height": "17", "data-astro-cid-lsrjotyt": true })}</span> <h2 data-astro-cid-lsrjotyt>${dt("Events per day")}</h2> </div> <div class="al-bars" role="img"${addAttribute(dt("Events per day in the last 14 days"), "aria-label")} data-astro-cid-lsrjotyt> ${days.map((n, i) => renderTemplate`<i${addAttribute(`--h:${n ? Math.max(8, Math.round(n / maxDay * 100)) : 0}%;--i:${i}`, "style")}${addAttribute({ zero: n === 0 }, "class:list")}${addAttribute(`${n} \xB7 ${13 - i === 0 ? dt("Today") : dt("{a} ago", { a: `${13 - i}d` })}`, "title")} data-astro-cid-lsrjotyt></i>`)} </div> <div class="al-bars-axis" data-astro-cid-lsrjotyt><span data-astro-cid-lsrjotyt>${dt("{a} ago", { a: "13d" })}</span><span data-astro-cid-lsrjotyt>${dt("Today")}</span></div> </section> <section class="sx-panel al-box" data-astro-cid-lsrjotyt> <div class="sx-panel-head" data-astro-cid-lsrjotyt> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-lsrjotyt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-lsrjotyt": true })}</span> <h2 data-astro-cid-lsrjotyt>${dt("What happens the most")}</h2> </div> <ol class="al-top al-top-actions" data-astro-cid-lsrjotyt> ${topActions.map((a, i) => renderTemplate`<li${addAttribute(`--i:${i}`, "style")} data-astro-cid-lsrjotyt><span class="al-who" data-astro-cid-lsrjotyt><b data-astro-cid-lsrjotyt>${a.label}</b></span><em data-astro-cid-lsrjotyt>${a.n}</em><span class="al-track" data-astro-cid-lsrjotyt><i${addAttribute(`width:${Math.max(6, Math.round(a.n / maxAction * 100))}%`, "style")} data-astro-cid-lsrjotyt></i></span></li>`)} </ol> </section> </aside> <section class="sx-panel al-main" data-astro-cid-lsrjotyt> <div class="sx-panel-head" data-astro-cid-lsrjotyt> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-lsrjotyt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise-fill", "width": "17", "height": "17", "data-astro-cid-lsrjotyt": true })}</span> <h2 data-astro-cid-lsrjotyt>${dt("Recent events")}</h2> <span class="sx-tag" data-al-count data-astro-cid-lsrjotyt>${entries.length}</span> </div> <div class="al-tools" data-astro-cid-lsrjotyt> <label class="al-search" data-astro-cid-lsrjotyt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "14", "height": "14", "data-astro-cid-lsrjotyt": true })}<input type="search"${addAttribute(dt("Search by person, action or reason"), "placeholder")}${addAttribute(dt("Search the audit log"), "aria-label")} autocomplete="off" data-al-search data-dash-hold data-astro-cid-lsrjotyt></label> <div class="dfx-chips al-chips" role="radiogroup"${addAttribute(dt("Filter by person"), "aria-label")} data-astro-cid-lsrjotyt> <label class="dfx-chip al-chip" data-astro-cid-lsrjotyt><input type="radio" name="al-who" value="" checked data-astro-cid-lsrjotyt>${dt("All")}</label> ${topPeople.map((p) => renderTemplate`<label class="dfx-chip al-chip" data-astro-cid-lsrjotyt><input type="radio" name="al-who"${addAttribute(p.key, "value")} data-astro-cid-lsrjotyt>${p.avatar && renderTemplate`<img class="al-av al-av-sm"${addAttribute(p.avatar, "src")} alt="" width="18" height="18" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-astro-cid-lsrjotyt>`}${p.label}<b data-astro-cid-lsrjotyt>${p.n}</b></label>`)} </div> </div> <div class="al-timeline" data-astro-cid-lsrjotyt> ${groups.map((g) => renderTemplate`<div class="al-group" data-al-group data-astro-cid-lsrjotyt> <h3 data-astro-cid-lsrjotyt>${g.label}</h3> <div class="al-rows dgl-stagger" data-astro-cid-lsrjotyt> ${g.rows.map((e) => renderTemplate`<div class="al-row"${addAttribute(e.actorId ?? e.actorName, "data-actor")}${addAttribute(`${e.actorName} ${e.action} ${e.target} ${e.reason ?? ""}`.toLowerCase(), "data-search")} data-astro-cid-lsrjotyt> <div class="al-icon"${addAttribute(`--c:${ACTION_COLOR[e.actionKey] ?? "#94a3b8"}`, "style")} data-astro-cid-lsrjotyt> ${e.actorAvatar ? renderTemplate`<img class="al-av al-av-row"${addAttribute(e.actorAvatar, "src")} alt="" width="36" height="36" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-astro-cid-lsrjotyt>` : renderTemplate`<span class="al-noav" data-astro-cid-lsrjotyt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:robot-fill", "width": "18", "height": "18", "data-astro-cid-lsrjotyt": true })}</span>`} <span class="al-badge" data-astro-cid-lsrjotyt>${renderComponent($$result2, "Icon", $$Icon, { "name": ACTION_ICON[e.actionKey] ?? "ph:pencil-fill", "width": "10", "height": "10", "data-astro-cid-lsrjotyt": true })}</span> </div> <div class="al-body" data-astro-cid-lsrjotyt> <p class="al-summary" data-astro-cid-lsrjotyt><b data-astro-cid-lsrjotyt>${e.actorName}</b> ${e.action}</p> ${(e.target || e.reason) && renderTemplate`<div class="al-tags" data-astro-cid-lsrjotyt> ${e.target && renderTemplate`<span class="al-target" data-astro-cid-lsrjotyt>${e.target}</span>`} ${e.reason && renderTemplate`<span class="al-reason" data-astro-cid-lsrjotyt>${dt("Reason")}: ${e.reason}</span>`} </div>`} </div> <span class="al-time"${addAttribute(new Date(e.createdAt).toLocaleString(dashLang), "title")} data-astro-cid-lsrjotyt>${timeAgo(e.createdAt)}</span> </div>`)} </div> </div>`)} </div> <p class="sx-empty al-none" hidden data-astro-cid-lsrjotyt>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "16", "height": "16", "data-astro-cid-lsrjotyt": true })}${dt("No event matches that.")}</p> </section> </div>`) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashAuditLog.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Audit = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Audit;
  const dt = makeT(getDashLang(Astro2));
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const guildInfo = await getGuildInfo(id, botToken);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ACTION_LABELS = {
    1: dt("Created a channel"),
    2: dt("Updated a channel"),
    3: dt("Deleted a channel"),
    10: dt("Created a permission overwrite"),
    11: dt("Updated a permission overwrite"),
    12: dt("Deleted a permission overwrite"),
    20: "Kicked a member",
    21: "Pruned members",
    22: "Banned a member",
    23: "Unbanned a member",
    24: dt("Updated a member"),
    25: dt("Updated a member role"),
    26: "Moved a member",
    27: "Disconnected a member",
    28: dt("Added a bot"),
    30: dt("Created a role"),
    31: dt("Updated a role"),
    32: dt("Deleted a role"),
    40: dt("Created an invite"),
    41: dt("Updated an invite"),
    42: dt("Deleted an invite"),
    50: dt("Created a webhook"),
    51: dt("Updated a webhook"),
    52: dt("Deleted a webhook"),
    60: dt("Created an emoji"),
    61: dt("Updated an emoji"),
    62: dt("Deleted an emoji"),
    72: dt("Updated the server"),
    73: dt("Updated the server MFA level"),
    74: dt("Updated the server integrations"),
    80: dt("Created an integration"),
    81: dt("Updated an integration"),
    82: dt("Deleted an integration"),
    83: dt("Created a stage instance"),
    84: dt("Updated a stage instance"),
    85: dt("Deleted a stage instance"),
    90: dt("Created a sticker"),
    91: dt("Updated a sticker"),
    92: dt("Deleted a sticker"),
    100: dt("Created an event"),
    101: dt("Updated an event"),
    102: dt("Deleted an event"),
    110: dt("Created a thread"),
    111: dt("Updated a thread"),
    112: dt("Deleted a thread"),
    120: dt("Created an application command"),
    121: dt("Updated an application command"),
    122: dt("Deleted an application command"),
    140: dt("Created an AutoMod rule"),
    141: dt("Updated an AutoMod rule"),
    142: dt("Deleted an AutoMod rule"),
    143: "AutoMod blocked a message",
    144: "AutoMod flagged a message",
    145: "AutoMod timed out a member",
    150: dt("Created a creator monetization request"),
    151: "Accepted creator monetization terms",
    163: dt("Created an onboarding prompt"),
    164: dt("Updated an onboarding prompt"),
    165: dt("Deleted an onboarding prompt"),
    166: dt("Created onboarding"),
    167: dt("Updated onboarding")
  };
  const ACTION_KEYS = {
    1: "create_group",
    2: "update_group_level",
    20: "remove_member",
    21: "remove_member",
    22: "delete_group",
    23: "add_member",
    24: "update_group_level",
    25: "update_group_level",
    30: "create_group",
    31: "update_group_level",
    32: "delete_group",
    50: "create_group",
    51: "update_group_level",
    52: "delete_group",
    72: "update_group_level"
  };
  function snowflakeDate(id2) {
    try {
      return new Date(Number((BigInt(id2) >> 22n) + 1420070400000n)).toISOString();
    } catch {
      return (/* @__PURE__ */ new Date()).toISOString();
    }
  }
  const AUDIT_FRESH_MS = 45e3;
  const audit = await cached(`audit:${id}`, async () => {
    const res = await fetch(`https://discord.com/api/v10/guilds/${id}/audit-logs?limit=100`, { headers: { Authorization: `Bot ${botToken}` } });
    if (!res.ok) return { status: res.status, users: [], entries: [] };
    const payload = await res.json();
    return {
      status: res.status,
      users: (payload.users ?? []).map((u) => ({ id: u.id, name: u.global_name ?? u.username ?? u.id, avatar: u.avatar ?? null })),
      entries: (payload.audit_log_entries ?? []).map((e) => {
        const nameChange = (Array.isArray(e.changes) ? e.changes : []).find((c) => c.key === "name");
        return { id: e.id, user_id: e.user_id ?? null, target_id: e.target_id ?? null, action_type: e.action_type, reason: e.reason ?? null, name: nameChange ? { new_value: nameChange.new_value, old_value: nameChange.old_value } : null };
      })
    };
  }, { freshMs: AUDIT_FRESH_MS, shared: true, keep: (answer) => answer.status === 200 || answer.status === 403 }).catch(() => ({ status: 0, users: [], entries: [] }));
  const auditRes = { ok: audit.status === 200, status: audit.status };
  let auditError = null;
  let entries = [];
  if (auditRes.ok) {
    const users = new Map(audit.users.map((u) => [u.id, u.name]));
    const avatars = new Map(audit.users.map((u) => [u.id, userAvatar(u.id, u.avatar)]));
    entries = audit.entries.map((e) => {
      const nameChange = e.name;
      const targetUser = e.target_id ? users.get(e.target_id) : null;
      const target = targetUser ? String(targetUser) : nameChange?.new_value ?? nameChange?.old_value ?? e.target_id ?? "";
      return {
        id: e.id,
        actorId: e.user_id ?? null,
        actorName: users.get(e.user_id ?? "") ?? (e.user_id ? `User ${e.user_id}` : "Discord"),
        actorAvatar: e.user_id ? avatars.get(e.user_id) ?? userAvatar(e.user_id, null) : null,
        actionKey: ACTION_KEYS[e.action_type] ?? "",
        action: ACTION_LABELS[e.action_type] ?? `Administrative action (${e.action_type})`,
        target: target ? String(target) : "",
        reason: e.reason ?? null,
        createdAt: snowflakeDate(e.id)
      };
    });
  } else if (auditRes.status === 403) {
    auditError = dt("Petto needs the View Audit Log permission in this server.");
  } else {
    auditError = dt("Discord could not return the audit log (HTTP {n}).", { n: auditRes.status });
  }
  return renderTemplate`${renderComponent($$result, "DashAuditLog", $$DashAuditLog, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "entries": entries, "error": auditError })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/audit.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/audit.astro";
const $$url = "/dash/guild/[id]/audit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Audit,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
