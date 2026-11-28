import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, b as addAttribute, F as Fragment, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                             */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
import { a as accessCommands, i as isSensitive } from '../../../../chunks/commandAccess_BkOHtTxp.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashSecurity = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashSecurity;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, roleFindings, coverage, roleNames, securityScore, protection, recommendations, section } = Astro2.props;
  const sectionMeta = { score: dt("Security overview"), elevated: dt("Elevated roles"), unrestricted: dt("Command coverage") };
  const selectedSection = sectionMeta[section ?? ""] ? section ?? "" : "score";
  const selectedTitle = sectionMeta[selectedSection];
  const base = `/dash/guild/${guildId}`;
  const gateOf = (c) => c.disabledServer ? "disabled" : c.restrictRoles.length ? "roles" : c.level > 0 ? "level" : c.permissionNames.length ? "discord" : "open";
  const gateCount = (g) => coverage.filter((c) => gateOf(c) === g).length;
  const gates = [
    { id: "roles", label: dt("Restricted to roles"), hint: dt("!restrictcommand: only the roles you chose.") },
    { id: "level", label: dt("Petto level"), hint: dt("A level set on the Permissions page.") },
    { id: "discord", label: dt("Discord permission only"), hint: dt("Anyone with the Discord permission of the action can use it.") },
    { id: "open", label: dt("No gate"), hint: dt("Nothing extra: any member can use it.") },
    { id: "disabled", label: dt("Disabled"), hint: dt("Turned off in the server.") }
  ];
  const gated = gateCount("roles") + gateCount("level") + gateCount("disabled");
  const covered = coverage.length ? Math.round(gated / coverage.length * 100) : 100;
  const coverageCats = [...new Map(coverage.map((c) => [c.category, c.categoryTitle])).entries()];
  const protections = [
    { on: protection.antinuke, label: dt("Anti-nuke"), hint: dt("Answers destructive attacks, like mass bans and deleted channels."), href: `${base}/antinuke`, icon: "ph:siren-fill" },
    { on: protection.antiSpam, label: dt("Anti-spam"), hint: dt("Blocks flooding and mass mentions."), href: `${base}/moderation?section=protection`, icon: "ph:funnel-fill" },
    { on: protection.antiRaid, label: dt("Anti-raid"), hint: dt("Detects waves of joins."), href: `${base}/moderation?section=protection`, icon: "ph:users-three-fill" },
    { on: protection.verification, label: dt("Verification"), hint: dt("Checks newcomers before they get in."), href: `${base}/onboarding`, icon: "ph:seal-check-fill" },
    { on: protection.logs, label: dt("Audit logs"), hint: dt("Writes what happens in the server to a channel."), href: `${base}/logging`, icon: "ph:notebook-fill" }
  ];
  const protectionsOn = protections.filter((p) => p.on).length;
  const scoreTone = securityScore >= 80 ? "joins" : securityScore >= 55 ? "reactions" : "leaves";
  const scoreColor = securityScore >= 80 ? "var(--green)" : securityScore >= 55 ? "var(--yellow)" : "var(--red)";
  const roleLabel = (r) => r.isEveryone ? "@everyone" : r.name;
  const checked = [
    { key: "Administrator", holders: roleFindings.filter((r) => r.isAdmin) },
    ...["Manage Server", "Manage Roles", "Manage Channels", "Ban Members", "Kick Members", "Timeout Members", "Manage Webhooks", "Manage Messages", "Mention @everyone", "Manage Nicknames"].map((key) => ({ key, holders: roleFindings.filter((r) => r.matched.includes(key)) }))
  ];
  const adminRoles = roleFindings.filter((r) => r.isAdmin && !r.isEveryone).length;
  const elevatedOnly = roleFindings.filter((r) => r.severity === "medium").length;
  const everyoneRisk = roleFindings.filter((r) => r.isEveryone).length;
  const serverRoles = Object.values(roleNames).filter((name) => name !== "@everyone").length;
  const SEVERITY_LABEL = { critical: dt("Critical"), high: dt("Admin role"), medium: dt("Elevated") };
  const tabs = [
    { id: "score", icon: "ph:shield-check-fill", count: null },
    { id: "elevated", icon: "ph:shield-warning-fill", count: roleFindings.length },
    { id: "unrestricted", icon: "ph:keyhole-fill", count: null }
  ];
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": selectedSection === "unrestricted" ? "security-unrestricted" : "security", "pageTitle": selectedTitle, "data-astro-cid-4phsd5fe": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", " ", '<div class="sc-page" data-astro-cid-4phsd5fe> <h1 data-astro-cid-4phsd5fe>', '</h1> <nav class="sc-tabs"', " data-astro-cid-4phsd5fe> ", " </nav> ", " ", " ", ` </div> <script>
    // Command coverage: the search, the gate chips and the open/close of the groups. Works again when the dashboard swaps the page in.
    (function bind() {
      var root = document.querySelector('[data-coverage]:not([data-bound])');
      if (!root) return;
      root.setAttribute('data-bound', '1');
      var input = root.querySelector('[data-cv-search]');
      var cats = Array.prototype.slice.call(root.querySelectorAll('[data-cv-cat]'));
      var before = new Map();
      var filtering = false;
      var gate = function () { var on = root.querySelector('input[name="cv-gate"]:checked'); return on ? on.value : ''; };
      var apply = function () {
        var q = (input && input.value || '').trim().toLowerCase().replace(/^[!\\/]/, '');
        var active = gate();
        var now = Boolean(q || active);
        // While something is searched or filtered the groups with a match are open; when it is cleared they go back as they were.
        if (now && !filtering) cats.forEach(function (cat) { before.set(cat, cat.open); });
        var any = false;
        cats.forEach(function (cat) {
          var shown = 0;
          cat.querySelectorAll('.cv-row').forEach(function (row) {
            var ok = (!active || row.getAttribute('data-gate') === active) && (!q || row.getAttribute('data-name').indexOf(q) !== -1 || row.textContent.toLowerCase().indexOf(q) !== -1);
            row.hidden = !ok; if (ok) shown++;
          });
          cat.hidden = shown === 0; if (shown) any = true;
          var n = cat.querySelector('[data-cv-n]');
          if (n) n.textContent = now ? shown + ' / ' + cat.getAttribute('data-total') : cat.getAttribute('data-total');
          if (now) cat.open = shown > 0; else if (filtering) cat.open = Boolean(before.get(cat));
        });
        filtering = now;
        var none = root.querySelector('.cv-none'); if (none) none.hidden = any;
      };
      if (input) input.addEventListener('input', apply);
      root.querySelectorAll('input[name="cv-gate"]').forEach(function (radio) { radio.addEventListener('change', apply); });
      root.querySelectorAll('[data-cv-bulk]').forEach(function (button) {
        button.addEventListener('click', function () {
          var open = button.getAttribute('data-cv-bulk') === 'open';
          cats.forEach(function (cat) { if (!cat.hidden) cat.open = open; if (!filtering) before.set(cat, open); });
        });
      });
    })();
  <\/script> `], [" ", " ", " ", '<div class="sc-page" data-astro-cid-4phsd5fe> <h1 data-astro-cid-4phsd5fe>', '</h1> <nav class="sc-tabs"', " data-astro-cid-4phsd5fe> ", " </nav> ", " ", " ", ` </div> <script>
    // Command coverage: the search, the gate chips and the open/close of the groups. Works again when the dashboard swaps the page in.
    (function bind() {
      var root = document.querySelector('[data-coverage]:not([data-bound])');
      if (!root) return;
      root.setAttribute('data-bound', '1');
      var input = root.querySelector('[data-cv-search]');
      var cats = Array.prototype.slice.call(root.querySelectorAll('[data-cv-cat]'));
      var before = new Map();
      var filtering = false;
      var gate = function () { var on = root.querySelector('input[name="cv-gate"]:checked'); return on ? on.value : ''; };
      var apply = function () {
        var q = (input && input.value || '').trim().toLowerCase().replace(/^[!\\\\/]/, '');
        var active = gate();
        var now = Boolean(q || active);
        // While something is searched or filtered the groups with a match are open; when it is cleared they go back as they were.
        if (now && !filtering) cats.forEach(function (cat) { before.set(cat, cat.open); });
        var any = false;
        cats.forEach(function (cat) {
          var shown = 0;
          cat.querySelectorAll('.cv-row').forEach(function (row) {
            var ok = (!active || row.getAttribute('data-gate') === active) && (!q || row.getAttribute('data-name').indexOf(q) !== -1 || row.textContent.toLowerCase().indexOf(q) !== -1);
            row.hidden = !ok; if (ok) shown++;
          });
          cat.hidden = shown === 0; if (shown) any = true;
          var n = cat.querySelector('[data-cv-n]');
          if (n) n.textContent = now ? shown + ' / ' + cat.getAttribute('data-total') : cat.getAttribute('data-total');
          if (now) cat.open = shown > 0; else if (filtering) cat.open = Boolean(before.get(cat));
        });
        filtering = now;
        var none = root.querySelector('.cv-none'); if (none) none.hidden = any;
      };
      if (input) input.addEventListener('input', apply);
      root.querySelectorAll('input[name="cv-gate"]').forEach(function (radio) { radio.addEventListener('change', apply); });
      root.querySelectorAll('[data-cv-bulk]').forEach(function (button) {
        button.addEventListener('click', function () {
          var open = button.getAttribute('data-cv-bulk') === 'open';
          cats.forEach(function (cat) { if (!cat.hidden) cat.open = open; if (!filtering) before.set(cat, open); });
        });
      });
    })();
  <\/script> `])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-4phsd5fe": true }), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-4phsd5fe": true }), maybeRenderHead(), selectedTitle, addAttribute(dt("Security"), "aria-label"), tabs.map((tab) => renderTemplate`<a${addAttribute(`?section=${tab.id}`, "href")}${addAttribute(["sc-tab", { on: selectedSection === tab.id }], "class:list")}${addAttribute(selectedSection === tab.id ? "page" : void 0, "aria-current")} data-astro-cid-4phsd5fe> ${renderComponent($$result2, "Icon", $$Icon, { "name": tab.icon, "width": "14", "height": "14", "data-astro-cid-4phsd5fe": true })}${sectionMeta[tab.id]}${tab.count ? renderTemplate`<em data-astro-cid-4phsd5fe>${tab.count}</em>` : null} </a>`), selectedSection === "score" && renderTemplate`<div class="sc-body" data-astro-cid-4phsd5fe> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Security score"), value: securityScore, tone: scoreTone },
    { label: dt("Protections on"), value: protectionsOn, text: `${protectionsOn} / ${protections.length}`, tone: "voice" },
    { label: dt("Elevated roles"), value: roleFindings.length, tone: "leaves" },
    { label: dt("Extra protection"), value: gated, tone: "invites" }
  ], "data-astro-cid-4phsd5fe": true })} <div class="sc-duo" data-astro-cid-4phsd5fe> <div class="sc-col" data-astro-cid-4phsd5fe> <section class="sx-panel sc-score"${addAttribute(`--sc:${scoreColor}`, "style")} data-astro-cid-4phsd5fe> <div class="sc-score-ring"${addAttribute(`--score: ${securityScore * 3.6}deg`, "style")} data-astro-cid-4phsd5fe><span data-astro-cid-4phsd5fe>${securityScore}</span></div> <div class="sc-score-text" data-astro-cid-4phsd5fe> <h2 data-astro-cid-4phsd5fe>${dt("Petto Security Score")}</h2> <p data-astro-cid-4phsd5fe>${securityScore >= 80 ? dt("Good baseline. Keep reviewing it as the server grows.") : securityScore >= 55 ? dt("A few protections deserve attention.") : dt("Several high-impact protections are missing.")}</p> <span class="sc-score-scale" data-astro-cid-4phsd5fe>${dt("Out of 100: every missing protection and every risky role takes points off.")}</span> </div> </section> <section class="sx-panel sc-recs" data-astro-cid-4phsd5fe> <div class="sx-panel-head" data-astro-cid-4phsd5fe> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lightbulb-fill", "width": "17", "height": "17", "data-astro-cid-4phsd5fe": true })}</span> <h2 data-astro-cid-4phsd5fe>${dt("Recommended next steps")}</h2> ${recommendations.length > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-4phsd5fe>${Math.min(recommendations.length, 6)}</span>`} </div> ${recommendations.length ? renderTemplate`<ul class="sc-steps dgl-stagger" data-astro-cid-4phsd5fe> ${recommendations.slice(0, 6).map((recommendation, i) => renderTemplate`<li data-astro-cid-4phsd5fe><b data-astro-cid-4phsd5fe>${i + 1}</b><span data-astro-cid-4phsd5fe>${recommendation}</span></li>`)} </ul>` : renderTemplate`<p class="sx-empty sc-ok" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "18", "height": "18", "data-astro-cid-4phsd5fe": true })}${dt("No high-impact gaps were found.")}</p>`} </section> </div> <section class="sx-panel sc-prot" data-astro-cid-4phsd5fe> <div class="sx-panel-head" data-astro-cid-4phsd5fe> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "17", "height": "17", "data-astro-cid-4phsd5fe": true })}</span> <h2 data-astro-cid-4phsd5fe>${dt("Protection status")}</h2> <span class="sx-tag sx-tag-accent" data-astro-cid-4phsd5fe>${protectionsOn} / ${protections.length}</span> </div> <p class="sx-lead" data-astro-cid-4phsd5fe>${dt("Open one to turn it on or change it.")}</p> <div class="sc-prot-list dgl-stagger" data-astro-cid-4phsd5fe> ${protections.map((p) => renderTemplate`<a${addAttribute(["sc-prot-row", { on: p.on }], "class:list")}${addAttribute(p.href, "href")} data-astro-cid-4phsd5fe> <span class="sc-prot-icon" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": p.icon, "width": "17", "height": "17", "data-astro-cid-4phsd5fe": true })}</span> <span class="sc-prot-main" data-astro-cid-4phsd5fe><b data-astro-cid-4phsd5fe>${p.label}</b><em data-astro-cid-4phsd5fe>${p.hint}</em></span> <span class="sc-prot-state" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": p.on ? "ph:check-circle-fill" : "ph:warning-fill", "width": "13", "height": "13", "data-astro-cid-4phsd5fe": true })}${p.on ? dt("Enabled") : dt("Needs setup")}</span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "class": "sc-go", "width": "13", "height": "13", "data-astro-cid-4phsd5fe": true })} </a>`)} </div> </section> </div> <div class="sc-duo sc-duo-start" data-astro-cid-4phsd5fe> <section class="sx-panel" data-astro-cid-4phsd5fe> <div class="sx-panel-head" data-astro-cid-4phsd5fe> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-warning-fill", "width": "17", "height": "17", "data-astro-cid-4phsd5fe": true })}</span> <h2 data-astro-cid-4phsd5fe>${dt("Elevated roles")}</h2> <span class="sx-tag" data-astro-cid-4phsd5fe>${roleFindings.length}</span> </div> <p class="sx-lead" data-astro-cid-4phsd5fe>${dt("Roles that can moderate, manage the server, or reach @everyone.")}</p> ${roleFindings.length === 0 ? renderTemplate`<p class="sx-empty sc-ok" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "18", "height": "18", "data-astro-cid-4phsd5fe": true })}${dt("No roles outside the obvious admin ones carry elevated permissions.")}</p>` : renderTemplate`<ul class="sc-mini" data-astro-cid-4phsd5fe> ${roleFindings.slice(0, 4).map((r) => renderTemplate`<li data-astro-cid-4phsd5fe><span${addAttribute(`sc-sev sc-sev-${r.severity}`, "class")} data-astro-cid-4phsd5fe>${SEVERITY_LABEL[r.severity]}</span><b data-astro-cid-4phsd5fe>${roleLabel(r)}</b></li>`)} ${roleFindings.length > 4 && renderTemplate`<li class="sc-more" data-astro-cid-4phsd5fe>${dt("and {n} more", { n: roleFindings.length - 4 })}</li>`} </ul>`} <a class="sc-link" href="?section=elevated" data-astro-cid-4phsd5fe>${dt("Review the roles")}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "width": "12", "height": "12", "data-astro-cid-4phsd5fe": true })}</a> </section> <section class="sx-panel" data-astro-cid-4phsd5fe> <div class="sx-panel-head" data-astro-cid-4phsd5fe> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:keyhole-fill", "width": "17", "height": "17", "data-astro-cid-4phsd5fe": true })}</span> <h2 data-astro-cid-4phsd5fe>${dt("Command coverage")}</h2> <span class="sx-tag sx-tag-accent" data-astro-cid-4phsd5fe>${covered}%</span> </div> <p class="sx-lead" data-astro-cid-4phsd5fe>${dt("{a} of {b} staff commands have a Petto level, a role restriction or are disabled.", { a: gated, b: coverage.length })}</p> <div class="cv-bar" role="img"${addAttribute(dt("How the staff commands are protected"), "aria-label")} data-astro-cid-4phsd5fe> ${gates.map((g) => gateCount(g.id) > 0 && renderTemplate`<i${addAttribute(`cv-${g.id}`, "class")}${addAttribute(`flex:${gateCount(g.id)}`, "style")}${addAttribute(`${g.label}: ${gateCount(g.id)}`, "title")} data-astro-cid-4phsd5fe></i>`)} </div> <ul class="sc-legend" data-astro-cid-4phsd5fe> ${gates.map((g) => renderTemplate`<li${addAttribute(`cv-${g.id}`, "class")} data-astro-cid-4phsd5fe><i data-astro-cid-4phsd5fe></i><span data-astro-cid-4phsd5fe>${g.label}</span><b data-astro-cid-4phsd5fe>${gateCount(g.id)}</b></li>`)} </ul> <a class="sc-link" href="?section=unrestricted" data-astro-cid-4phsd5fe>${dt("Review the commands")}${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "width": "12", "height": "12", "data-astro-cid-4phsd5fe": true })}</a> </section> </div> </div>`, selectedSection === "elevated" && renderTemplate`<div class="sc-body" data-astro-cid-4phsd5fe> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Elevated roles"), value: roleFindings.length, tone: "leaves" },
    { label: dt("Administrator roles"), value: adminRoles, tone: "reactions" },
    { label: dt("Elevated only"), value: elevatedOnly, tone: "messages" },
    { label: dt("Roles in the server"), value: serverRoles, tone: "voice" }
  ], "data-astro-cid-4phsd5fe": true })} ${everyoneRisk > 0 && renderTemplate`<div class="sx-flash sx-flash-bad" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-4phsd5fe": true })}${dt("@everyone has elevated permissions.")}</div>`} <section class="sx-panel" data-astro-cid-4phsd5fe> <div class="sx-panel-head" data-astro-cid-4phsd5fe> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-warning-fill", "width": "17", "height": "17", "data-astro-cid-4phsd5fe": true })}</span> <h2 data-astro-cid-4phsd5fe>${dt("Roles with elevated permissions")}</h2> <span class="sx-tag" data-astro-cid-4phsd5fe>${roleFindings.length}</span> </div> <p class="sx-lead" data-astro-cid-4phsd5fe>${dt("Roles that can moderate, manage the server, or reach @everyone. Not necessarily wrong, review who's actually in each one.")}</p> ${roleFindings.length === 0 ? renderTemplate`<p class="sx-empty sc-ok" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "18", "height": "18", "data-astro-cid-4phsd5fe": true })}${dt("No roles outside the obvious admin ones carry elevated permissions.")}</p>` : renderTemplate`<ul class="sc-roles dgl-stagger" data-astro-cid-4phsd5fe> ${roleFindings.map((r) => renderTemplate`<li${addAttribute(`sc-role sc-role-${r.severity}`, "class")} data-astro-cid-4phsd5fe> <span${addAttribute(`sc-sev sc-sev-${r.severity}`, "class")} data-astro-cid-4phsd5fe>${SEVERITY_LABEL[r.severity]}</span> <b class="sc-role-name" data-astro-cid-4phsd5fe>${roleLabel(r)}</b> <span class="sc-perms" data-astro-cid-4phsd5fe> ${r.isAdmin ? renderTemplate`<span class="sc-perm sc-perm-admin" data-astro-cid-4phsd5fe>${dt("Administrator")}</span>` : r.matched.map((m) => renderTemplate`<span class="sc-perm" data-astro-cid-4phsd5fe>${dt(m)}</span>`)} </span> </li>`)} </ul>`} </section> <section class="sx-panel" data-astro-cid-4phsd5fe> <div class="sx-panel-head" data-astro-cid-4phsd5fe> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-4phsd5fe": true })}</span> <h2 data-astro-cid-4phsd5fe>${dt("Permissions that are checked")}</h2> </div> <p class="sx-lead" data-astro-cid-4phsd5fe>${dt("How many of the roles above hold each one. Administrator already includes all the others.")}</p> <div class="sc-checks" data-astro-cid-4phsd5fe> ${checked.map((item) => renderTemplate`<div${addAttribute(["sc-check", { none: item.holders.length === 0 }], "class:list")} data-astro-cid-4phsd5fe> <div class="sc-check-top" data-astro-cid-4phsd5fe><b data-astro-cid-4phsd5fe>${dt(item.key)}</b><span class="sx-tag" data-astro-cid-4phsd5fe>${item.holders.length}</span></div> <div class="sc-check-bar" data-astro-cid-4phsd5fe><i${addAttribute(`width:${roleFindings.length ? Math.round(item.holders.length / roleFindings.length * 100) : 0}%`, "style")} data-astro-cid-4phsd5fe></i></div> <p data-astro-cid-4phsd5fe>${item.holders.length === 0 ? dt("No role has it.") : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-4phsd5fe": true }, { "default": ($$result3) => renderTemplate`${item.holders.slice(0, 3).map(roleLabel).join(", ")}${item.holders.length > 3 ? ` +${item.holders.length - 3}` : ""}` })}`}</p> </div>`)} </div> </section> </div>`, selectedSection === "unrestricted" && renderTemplate`<div class="sc-body" data-coverage data-astro-cid-4phsd5fe> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Staff commands"), value: coverage.length, tone: "voice" },
    { label: dt("Extra protection"), value: gated, tone: "joins" },
    { label: dt("Discord only"), value: gateCount("discord"), tone: "reactions" },
    { label: dt("No gate"), value: gateCount("open"), tone: "leaves" }
  ], "data-astro-cid-4phsd5fe": true })} <section class="sx-panel cv-sum" data-astro-cid-4phsd5fe> <div class="sx-panel-head" data-astro-cid-4phsd5fe> <span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:keyhole-fill", "width": "17", "height": "17", "data-astro-cid-4phsd5fe": true })}</span> <h2 data-astro-cid-4phsd5fe>${dt("Extra protection")}</h2> <span class="sx-tag sx-tag-accent" data-astro-cid-4phsd5fe>${covered}%</span> </div> <p class="sx-lead" data-astro-cid-4phsd5fe>${dt("{a} of {b} staff commands have a Petto level, a role restriction or are disabled. The rest rely on the Discord permission of the action.", { a: gated, b: coverage.length })}</p> <div class="cv-bar" role="img"${addAttribute(dt("How the staff commands are protected"), "aria-label")} data-astro-cid-4phsd5fe> ${gates.map((g) => gateCount(g.id) > 0 && renderTemplate`<i${addAttribute(`cv-${g.id}`, "class")}${addAttribute(`flex:${gateCount(g.id)}`, "style")}${addAttribute(`${g.label}: ${gateCount(g.id)}`, "title")} data-astro-cid-4phsd5fe></i>`)} </div> <div class="dfx-chips cv-chips" role="radiogroup"${addAttribute(dt("Filter"), "aria-label")} data-astro-cid-4phsd5fe> <label class="dfx-chip cv-chip" data-astro-cid-4phsd5fe><input type="radio" name="cv-gate" value="" checked data-astro-cid-4phsd5fe>${dt("All")}<b data-astro-cid-4phsd5fe>${coverage.length}</b></label> ${gates.map((g) => renderTemplate`<label${addAttribute(`dfx-chip cv-chip cv-${g.id}`, "class")}${addAttribute(g.hint, "title")} data-astro-cid-4phsd5fe><input type="radio" name="cv-gate"${addAttribute(g.id, "value")}${addAttribute(gateCount(g.id) === 0, "disabled")} data-astro-cid-4phsd5fe><i class="cv-dot" data-astro-cid-4phsd5fe></i>${g.label}<b data-astro-cid-4phsd5fe>${gateCount(g.id)}</b></label>`)} </div> </section> <div class="cv-tools" data-astro-cid-4phsd5fe> <label class="cv-search" data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "14", "height": "14", "data-astro-cid-4phsd5fe": true })}<input type="search"${addAttribute(dt("Search a command"), "placeholder")}${addAttribute(dt("Search a command"), "aria-label")} data-cv-search data-astro-cid-4phsd5fe></label> <span class="cv-bulk" data-astro-cid-4phsd5fe><button type="button" class="btn btn-ghost btn-sm" data-cv-bulk="open" data-astro-cid-4phsd5fe>${dt("Expand all")}</button><button type="button" class="btn btn-ghost btn-sm" data-cv-bulk="close" data-astro-cid-4phsd5fe>${dt("Collapse all")}</button></span> <a class="btn btn-ghost btn-sm"${addAttribute(`${base}/permissions`, "href")} data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:key-fill", "width": "13", "height": "13", "data-astro-cid-4phsd5fe": true })}${dt("Set levels and roles")}</a> </div> <div class="cv-cats" data-astro-cid-4phsd5fe> ${coverageCats.map(([cat, title]) => {
    const list = coverage.filter((c) => c.category === cat);
    return renderTemplate`<details class="dfx-acc cv-cat" data-cv-cat${addAttribute(list.length, "data-total")} data-astro-cid-4phsd5fe> <summary data-astro-cid-4phsd5fe> <span class="dfx-acc-title" data-astro-cid-4phsd5fe><b data-astro-cid-4phsd5fe>${title}</b></span> <span class="cv-cat-bar" aria-hidden="true" data-astro-cid-4phsd5fe>${gates.map((g) => {
      const n = list.filter((c) => gateOf(c) === g.id).length;
      return n > 0 && renderTemplate`<i${addAttribute(`cv-${g.id}`, "class")}${addAttribute(`flex:${n}`, "style")} data-astro-cid-4phsd5fe></i>`;
    })}</span> <span class="sx-tag cv-cat-n" data-cv-n data-astro-cid-4phsd5fe>${list.length}</span> <svg class="dfx-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-4phsd5fe><path d="m6 9 6 6 6-6" data-astro-cid-4phsd5fe></path></svg> </summary> <ul class="cv-list" data-astro-cid-4phsd5fe> ${list.map((c) => {
      const gate = gateOf(c);
      return renderTemplate`<li${addAttribute(`cv-row cv-${gate}`, "class")}${addAttribute(gate, "data-gate")}${addAttribute(`${c.name} ${c.aliases.join(" ")}`, "data-name")} data-astro-cid-4phsd5fe> <div class="cv-main" data-astro-cid-4phsd5fe><code data-astro-cid-4phsd5fe>${c.slash ? "/" : "!"}${c.name}</code><span data-astro-cid-4phsd5fe>${c.desc}</span></div> <div class="cv-tags" data-astro-cid-4phsd5fe> ${c.disabledServer && renderTemplate`<span class="cv-tag cv-t-off" data-astro-cid-4phsd5fe>${dt("Disabled")}</span>`} ${c.restrictRoles.map((id) => renderTemplate`<span class="cv-tag cv-t-role" data-astro-cid-4phsd5fe>@${roleNames[id] ?? id}</span>`)} ${c.level > 0 && renderTemplate`<span class="cv-tag cv-t-level" data-astro-cid-4phsd5fe>${dt("Level {a}", { a: c.level })}</span>`} ${c.permissionNames.map((p) => renderTemplate`<span class="cv-tag cv-t-perm" data-astro-cid-4phsd5fe>${dt(p)}</span>`)} ${gate === "open" && renderTemplate`<span class="cv-tag cv-t-open" data-astro-cid-4phsd5fe>${dt("No gate")}</span>`} ${!c.disabledServer && c.disabledChannels.length > 0 && renderTemplate`<span class="cv-tag cv-t-off" data-astro-cid-4phsd5fe>${dt("Off in {a} channels", { a: c.disabledChannels.length })}</span>`} </div> </li>`;
    })} </ul> </details>`;
  })} </div> <p class="sx-empty cv-none" hidden data-astro-cid-4phsd5fe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "16", "height": "16", "data-astro-cid-4phsd5fe": true })}${dt("No command matches.")}</p> </div>`) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashSecurity.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Security = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Security;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { id } = Astro2.params;
  const section = Astro2.url.searchParams.get("section") ?? "score";
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const [guildInfo, rolesRes, levelsRes, automodRes, antinukeRes, verificationRes, logsRes, restrictRes, disabledRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    () => getGuildList(Astro2, id, botToken, "roles"),
    () => fetch(`${apiUrl}/rest/v1/command_permission_levels?guild_id=eq.${id}&select=command_name,required_level`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/automod_config?guild_id=eq.${id}&select=anti_spam_enabled,anti_raid_enabled`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/antinuke_config?guild_id=eq.${id}&select=enabled`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/verification_config?guild_id=eq.${id}&select=enabled`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/log_entries?guild_id=eq.${id}&select=event&limit=1`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/command_restrictions?guild_id=eq.${id}&select=command,role_id`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/disabled_commands?guild_id=eq.${id}&select=command,channel_id`, { headers: apiHeaders })
  ], 9);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const DANGEROUS_PERMS = [
    { flag: 1n << 5n, label: "Manage Server" },
    { flag: 1n << 28n, label: "Manage Roles" },
    { flag: 1n << 4n, label: "Manage Channels" },
    { flag: 1n << 2n, label: "Ban Members" },
    { flag: 1n << 1n, label: "Kick Members" },
    { flag: 1n << 40n, label: "Timeout Members" },
    { flag: 1n << 29n, label: "Manage Webhooks" },
    { flag: 1n << 13n, label: "Manage Messages" },
    { flag: 1n << 17n, label: "Mention @everyone" },
    { flag: 1n << 27n, label: "Manage Nicknames" }
  ];
  const ADMINISTRATOR = 1n << 3n;
  const allRoles = rolesRes.ok ? await rolesRes.json() : [];
  const roleFindings = allRoles.map((r) => {
    const bits = BigInt(r.permissions ?? "0");
    const isAdmin = (bits & ADMINISTRATOR) === ADMINISTRATOR;
    const matched = isAdmin ? [] : DANGEROUS_PERMS.filter((p) => (bits & p.flag) === p.flag).map((p) => p.label);
    const isEveryone = r.name === "@everyone";
    let severity = null;
    if (isEveryone && (isAdmin || matched.length > 0)) severity = "critical";
    else if (isAdmin) severity = "high";
    else if (matched.length > 0) severity = "medium";
    return { id: r.id, name: r.name, isEveryone, isAdmin, matched, severity, position: r.position };
  }).filter((r) => r.severity).sort((a, b) => (b.severity === "critical" ? 1 : 0) - (a.severity === "critical" ? 1 : 0) || b.position - a.position);
  const levelRows = levelsRes.ok ? await levelsRes.json() : [];
  const rowsOf = async (res) => res.ok ? res.json().catch(() => []) : [];
  const coverage = accessCommands(dashLang, { levels: levelRows, restrictions: await rowsOf(restrictRes), disabled: await rowsOf(disabledRes) }).filter(isSensitive);
  const roleNames = Object.fromEntries(allRoles.map((r) => [String(r.id), String(r.name)]));
  const automodRows = automodRes.ok ? await automodRes.json() : [];
  const antinukeRows = antinukeRes.ok ? await antinukeRes.json() : [];
  const verificationRows = verificationRes.ok ? await verificationRes.json() : [];
  const logRows = logsRes.ok ? await logsRes.json() : [];
  const automod = automodRows[0] ?? {};
  const protection = {
    antinuke: Boolean(antinukeRows[0]?.enabled),
    antiSpam: Boolean(automod.anti_spam_enabled),
    antiRaid: Boolean(automod.anti_raid_enabled),
    verification: Boolean(verificationRows[0]?.enabled),
    logs: logRows.length > 0
  };
  let securityScore = 100;
  const recommendations = [];
  const everyoneFinding = roleFindings.find((role) => role.isEveryone);
  const adminCount = roleFindings.filter((role) => role.isAdmin && !role.isEveryone).length;
  if (everyoneFinding) {
    securityScore -= 30;
    recommendations.push(dt("@everyone has elevated permissions."));
  }
  if (adminCount > 0) {
    securityScore -= Math.min(30, adminCount * 10);
    recommendations.push(dt("{n} role(s) have Administrator.", { n: adminCount }));
  }
  if (!protection.antinuke) {
    securityScore -= 15;
    recommendations.push(dt("Enable anti-nuke to respond to destructive attacks."));
  }
  if (!protection.antiSpam) {
    securityScore -= 10;
    recommendations.push(dt("Enable anti-spam to block flooding and mass mentions."));
  }
  if (!protection.antiRaid) {
    securityScore -= 10;
    recommendations.push(dt("Enable anti-raid to detect waves of joins."));
  }
  if (!protection.verification) {
    securityScore -= 5;
    recommendations.push(dt("Enable entry verification."));
  }
  if (!protection.logs) {
    securityScore -= 10;
    recommendations.push(dt("Set up at least one audit log channel."));
  }
  securityScore = Math.max(0, securityScore);
  return renderTemplate`${renderComponent($$result, "DashSecurity", $$DashSecurity, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "roleFindings": roleFindings, "coverage": coverage, "roleNames": roleNames, "securityScore": securityScore, "protection": protection, "recommendations": recommendations, "section": section })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/security.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/security.astro";
const $$url = "/dash/guild/[id]/security";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Security,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
