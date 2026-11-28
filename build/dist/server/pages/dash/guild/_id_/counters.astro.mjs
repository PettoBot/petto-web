import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment, u as unescapeHTML } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashChartTip } from '../../../../chunks/DashChartTip_Ddh1J1_O.mjs';
import { c as chartTipJson } from '../../../../chunks/chartTip_6MOPUAs2.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$DurationScript } from '../../../../chunks/DurationScript_BO_8qKfV.mjs';
import { $ as $$SxNumber } from '../../../../chunks/SxNumber_YL4vNksH.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                             */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList, o as readGuildSnapshot } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { x as callPettoCounters } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
import { f as forgetCalls, s as sharedCall, w as withinBudget, m as markPending } from '../../../../chunks/liveCall_BSZ7MViH.mjs';
export { renderers } from '../../../../renderers.mjs';

const COUNTER_TYPES = [
  "members",
  "users_only",
  "bots_only",
  "online",
  "status_online",
  "status_idle",
  "status_dnd",
  "in_voice",
  "pending_members",
  "boosts",
  "booster_count",
  "boost_level",
  "role_members",
  "goal",
  "roles",
  "all_channels",
  "text_channels",
  "voice_channels",
  "categories",
  "announcement_channels",
  "staging_channels",
  "emojis",
  "stickers",
  "clock",
  "date",
  "role_online",
  "tag_users",
  "vanity_users",
  "messages_today"
];
const ROLE_TYPES = ["role_members", "role_online"];
const COUNTER_FORMATS = ["plain", "grouped", "compact"];
const PRESENCE_TYPES = ["online", "status_online", "status_idle", "status_dnd", "role_online"];
const SEPARATORS = { en: { group: ",", decimal: "." }, es: { group: ".", decimal: "," }, "pt-BR": { group: ".", decimal: "," } };
function formatCount(value, format = "plain", lang = "en") {
  if (typeof value !== "number" || !Number.isFinite(value)) return String(value ?? "");
  const n = Math.trunc(value);
  const marks = SEPARATORS[lang] ?? SEPARATORS.en;
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (format === "grouped") return sign + String(abs).replace(/\B(?=(\d{3})+(?!\d))/g, marks.group);
  if (format === "compact" && abs >= 1e3) {
    for (const [size, unit] of [[1e9, "B"], [1e6, "M"], [1e3, "k"]]) {
      if (abs < size) continue;
      const scaled = abs / size;
      const digits = scaled < 100 ? Math.floor(scaled * 10) / 10 : Math.floor(scaled);
      return `${sign}${String(digits).replace(".", marks.decimal)}${unit}`;
    }
  }
  return sign + String(abs);
}
const NICE_STEPS = [10, 25, 50, 100, 250, 500, 1e3, 2500, 5e3, 1e4, 25e3, 5e4, 1e5, 25e4, 5e5, 1e6];
function nextGoal(count, setGoal = null) {
  const n = Math.max(0, Math.trunc(Number(count) || 0));
  const fixed = Math.trunc(Number(setGoal) || 0);
  if (fixed > n) return fixed;
  let step = NICE_STEPS[0];
  for (const candidate of NICE_STEPS) if (candidate <= n / 4) step = candidate;
  return (Math.floor(n / step) + 1) * step;
}
function validTimeZone(zone) {
  if (!zone || zone.length > 64) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone: zone });
    return true;
  } catch {
    return false;
  }
}
function timeValue(type, timeZone = "UTC", lang = "en", now = Date.now()) {
  const zone = validTimeZone(timeZone) ? timeZone : "UTC";
  const locale = lang === "pt-BR" ? "pt-BR" : lang === "es" ? "es" : "en-GB";
  if (type === "date") return new Intl.DateTimeFormat(locale, { timeZone: zone, day: "numeric", month: "short", year: "numeric" }).format(new Date(now)).replace(/\./g, "");
  const stepped = Math.floor(now / 3e5) * 3e5;
  return new Intl.DateTimeFormat("en-GB", { timeZone: zone, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(stepped));
}
function zoneLabel(timeZone, now = Date.now()) {
  const zone = timeZone && validTimeZone(timeZone) ? timeZone : "UTC";
  if (zone === "UTC" || zone === "Etc/UTC") return "UTC";
  return new Intl.DateTimeFormat("en", { timeZone: zone, timeZoneName: "short" }).formatToParts(new Date(now)).find((p) => p.type === "timeZoneName")?.value ?? zone;
}
function renderCounterName(c, value, lang = "en", now = Date.now()) {
  const format = COUNTER_FORMATS.includes(c.format) ? c.format : "plain";
  const count = formatCount(value, format, lang);
  const goal = typeof value === "number" ? nextGoal(value, c.goal) : null;
  const vars = {
    "{count}": count,
    "{value}": count,
    "{remaining}": count,
    "{option}": c.optionWord ?? c.type,
    "{goal}": goal == null ? "" : formatCount(goal, format, lang),
    "{left}": goal == null || typeof value !== "number" ? "" : formatCount(Math.max(0, goal - value), format, lang),
    "{percent}": goal && typeof value === "number" ? `${Math.min(100, Math.floor(value / goal * 100))}%` : "",
    "{role}": c.role ?? "",
    "{tz}": c.template.includes("{tz}") ? zoneLabel(c.timezone, now) : ""
  };
  const text = (c.template || "{option}: {value}").replace(/\{(count|value|remaining|option|goal|left|percent|role|tz)\}/g, (whole) => vars[whole]);
  const name = `${c.prefix ?? ""}${text}${c.suffix ?? ""}`.replace(/\s+/g, " ").trim();
  const max = c.target === "topic" ? 1024 : 100;
  return Array.from(name).reduce((out, ch) => out.length + ch.length <= max ? out + ch : out, "") || count;
}
function shownName(name, kind) {
  return kind === "text" || kind === "announce" ? name.toLowerCase().replace(/\s+/g, "-") : name;
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashCounters = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashCounters;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, counters, categories, roles, freeChannels, values, roleCounts, roleOnlineCounts, presences, limits, approxMembers, message, announce, textChannels, embedNames, defaultAnnounce, memberDays, livePending = false } = Astro2.props;
  const labels = {
    members: dt("Members"),
    users_only: dt("Humans"),
    bots_only: dt("Bots"),
    online: dt("Online (any status)"),
    status_online: dt("Online"),
    status_idle: dt("Idle"),
    status_dnd: dt("Do not disturb"),
    in_voice: dt("In voice"),
    pending_members: dt("Pending members"),
    boosts: dt("Boosts"),
    booster_count: dt("Boosters"),
    boost_level: dt("Boost level"),
    role_members: dt("Members in a role"),
    goal: dt("Member goal"),
    roles: dt("Roles"),
    all_channels: dt("Channels"),
    text_channels: dt("Text channels"),
    voice_channels: dt("Voice channels"),
    categories: dt("Categories"),
    announcement_channels: dt("Announcement channels"),
    staging_channels: dt("Stage channels"),
    emojis: dt("Emojis"),
    stickers: dt("Stickers"),
    clock: dt("Clock"),
    date: dt("Date"),
    role_online: dt("Online in a role"),
    tag_users: dt("Wearing the server tag"),
    vanity_users: dt("Vanity supporters"),
    messages_today: dt("Messages today")
  };
  const defaults = {
    members: dt("\u{1F465} Members: {count}"),
    users_only: dt("\u{1F464} Humans: {count}"),
    bots_only: dt("\u{1F916} Bots: {count}"),
    online: dt("\u{1F7E2} Online: {count}"),
    status_online: dt("\u{1F7E2} Online: {count}"),
    status_idle: dt("\u{1F319} Idle: {count}"),
    status_dnd: dt("\u26D4 Do not disturb: {count}"),
    in_voice: dt("\u{1F3A7} In voice: {count}"),
    pending_members: dt("\u23F3 Pending: {count}"),
    boosts: dt("\u{1F48E} Boosts: {count}"),
    booster_count: dt("\u{1F680} Boosters: {count}"),
    boost_level: dt("\u{1F48E} Boost level: {count}"),
    role_members: "\u{1F3F7}\uFE0F {role}: {count}",
    goal: dt("\u{1F3AF} Goal: {count}/{goal}"),
    roles: dt("\u{1F3F7}\uFE0F Roles: {count}"),
    all_channels: dt("\u{1F4C1} Channels: {count}"),
    text_channels: dt("\u{1F4AC} Text channels: {count}"),
    voice_channels: dt("\u{1F50A} Voice channels: {count}"),
    categories: dt("\u{1F5C2}\uFE0F Categories: {count}"),
    announcement_channels: dt("\u{1F4E2} Announcements: {count}"),
    staging_channels: dt("\u{1F399}\uFE0F Stages: {count}"),
    emojis: dt("\u{1F600} Emojis: {count}"),
    stickers: dt("\u{1F5BC}\uFE0F Stickers: {count}"),
    clock: "\u{1F552} {count} {tz}",
    date: "\u{1F4C5} {count}",
    role_online: dt("\u{1F7E2} {role} online: {count}"),
    tag_users: dt("\u{1F3F7}\uFE0F Tag wearers: {count}"),
    vanity_users: dt("\u{1F49C} Supporters: {count}"),
    messages_today: dt("\u{1F4AC} Messages today: {count}")
  };
  const groups = [
    { label: dt("Members"), types: ["members", "users_only", "bots_only", "pending_members", "role_members", "goal", "tag_users", "vanity_users"] },
    { label: dt("Activity"), types: ["online", "status_online", "status_idle", "status_dnd", "role_online", "in_voice", "messages_today"] },
    { label: dt("Boosts"), types: ["boosts", "booster_count", "boost_level"] },
    { label: dt("Server"), types: ["roles", "all_channels", "text_channels", "voice_channels", "categories", "announcement_channels", "staging_channels", "emojis", "stickers"] },
    { label: dt("Time"), types: ["clock", "date"] }
  ];
  const membersNow = Number(values?.members ?? approxMembers ?? 0) || 0;
  const nextGoal = (n) => {
    const step = n < 100 ? 10 : n < 1e3 ? 100 : n < 1e4 ? 1e3 : n < 1e5 ? 5e3 : 10 ** (String(Math.trunc(n)).length - 2);
    return Math.floor(n / step) * step + step;
  };
  const counted = new Set(counters.map((c) => c.type));
  const packs = [
    { id: "basic", title: dt("Basic stats"), icon: "ph:users-three-fill", types: ["members", "users_only", "bots_only"] },
    { id: "boosts", title: dt("Boosts"), icon: "ph:rocket-launch-fill", types: ["boosts", "booster_count", "boost_level"] },
    { id: "online", title: dt("Who is online"), icon: "ph:circle-fill", types: ["online", "status_online", "in_voice"] },
    { id: "goal", title: dt("Goal to {a}", { a: nextGoal(membersNow).toLocaleString(dashLang) }), icon: "ph:flag-fill", types: ["goal"] },
    { id: "clock", title: dt("Clock"), icon: "ph:clock-fill", types: ["clock", "date"] }
  ];
  const formatLabels = { plain: "1234", grouped: dashLang === "en" ? "1,234" : "1.234", compact: dashLang === "en" ? "1.2k" : "1,2k" };
  const kindLabels = { voice: dt("Voice channel (locked)"), text: dt("Text channel name"), topic: dt("Text channel topic"), category: dt("Category name"), stage: dt("Stage channel"), announce: dt("Announcement channel") };
  const kindIcon = { voice: "ph:speaker-high-fill", text: "ph:hash-bold", category: "ph:folder-simple-fill", stage: "ph:broadcast-fill", announce: "ph:megaphone-fill", topic: "ph:text-align-left-bold" };
  const kindShort = { voice: labels.voice_channels, text: labels.text_channels, category: labels.categories, stage: labels.staging_channels, announce: labels.announcement_channels, topic: kindLabels.topic };
  const shownKind = (c) => c.target === "topic" ? "topic" : c.kind;
  const roleName = new Map(roles.map((r) => [r.id, r.name]));
  const kindCounts = Object.entries(counters.reduce((acc, c) => {
    const k = shownKind(c);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {})).map(([k, n]) => [kindShort[k] ?? k, n]);
  const sample = values ?? { members: approxMembers || 1234, goal: approxMembers || 1234 };
  const valueOf = (type, roleId) => type === "role_online" ? roleId ? roleOnlineCounts[roleId] ?? 0 : 0 : type === "role_members" ? roleId ? roleCounts[roleId] ?? 0 : 0 : type === "clock" || type === "date" ? timeValue(type, "UTC", dashLang) : sample[type] ?? 0;
  const nameOf = (c) => renderCounterName({ ...c, role: c.roleId ? roleName.get(c.roleId) ?? "" : "" }, c.type === "clock" || c.type === "date" ? timeValue(c.type, c.timezone ?? "UTC", dashLang) : valueOf(c.type, c.roleId), dashLang);
  const full = limits ? counters.length >= limits.max : false;
  const problems = {
    missing_channel: dt("The channel was deleted, so the counter is off."),
    missing_permission: dt("Petto cannot rename this channel. Give it Manage Channels and View Channel there."),
    bad_target: dt("This channel has no topic. Show the value in its name.")
  };
  const announceDefault = defaultAnnounce || dt("\u{1F389} **{server}** just reached **{goal}** members! Thank you all.");
  const sampleMilestone = announce?.next ?? (announce?.every ? (Math.floor(membersNow / announce.every) + 1) * announce.every : nextGoal(membersNow));
  const config = {
    values: sample,
    roleCounts,
    roleOnlineCounts,
    roles: Object.fromEntries(roleName),
    labels,
    defaults,
    lang: dashLang,
    server: guildName,
    announceDefault,
    milestone: sampleMilestone,
    text: {
      ago: dt("Updated {a} ago"),
      justNow: dt("Updated just now"),
      nextIn: dt("Next update in {a}"),
      checkIn: dt("Next check in {a}"),
      soon: dt("Next update: now"),
      saving: dt("Saving the order..."),
      saved: dt("Order saved."),
      failed: dt("It could not be saved, try again."),
      nameSaved: dt("Counter saved. Its name changes as soon as Discord allows.")
    }
  };
  const waitingText = dt("Next rename in {a}");
  const spark = (() => {
    if (memberDays.length < 2) return null;
    const W = 300;
    const H = 56;
    const pad = 4;
    const nums = memberDays.map((d) => d.members);
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const span = max - min || 1;
    const points = memberDays.map((d, i) => ({ x: pad + i * (W - 2 * pad) / (memberDays.length - 1), y: pad + (H - 2 * pad) * (1 - (d.members - min) / span), ...d }));
    const line = points.map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");
    const area = `${pad},${H - pad} ${line} ${W - pad},${H - pad}`;
    const change = nums[nums.length - 1] - nums[0];
    return { W, H, points, line, area, change, min, max, first: memberDays[0], last: memberDays[memberDays.length - 1] };
  })();
  const dayLabel = (day) => (/* @__PURE__ */ new Date(`${day}T12:00:00Z`)).toLocaleDateString(dashLang, { day: "numeric", month: "short", timeZone: "UTC" });
  const badgeText = {
    no_presences: dt("No presences: online counts show 0"),
    members_partial: dt("Too many members to count them all"),
    rate_limited: dt("Discord asked to wait")
  };
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "counters", "pageTitle": dt("Counters"), "data-astro-cid-facc5juy": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-facc5juy": true })} ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-facc5juy": true })} ${renderComponent($$result2, "DurationScript", $$DurationScript, { "data-astro-cid-facc5juy": true })} ${maybeRenderHead()}<div class="sx-page cn" data-counters${addAttribute(JSON.stringify(config), "data-config")}${addAttribute(waitingText, "data-waiting")} data-astro-cid-facc5juy> <header class="cn-head" data-astro-cid-facc5juy> <div data-astro-cid-facc5juy> <h1 data-astro-cid-facc5juy>${dt("Counters")}</h1> <p class="cn-lead" data-astro-cid-facc5juy>${dt("Channels whose name shows a number, like the members of the server. Petto keeps them up to date.")}</p> </div> <div class="cn-head-actions" data-astro-cid-facc5juy> ${counters.length > 0 && renderTemplate`<form method="POST" data-no-dirty data-bot-wait data-astro-cid-facc5juy><input type="hidden" name="action" value="refresh" data-astro-cid-facc5juy><button class="btn btn-ghost btn-sm" type="submit" data-no-dirty data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrows-clockwise-bold", "width": "13", "height": "13", "data-astro-cid-facc5juy": true })}${dt("Refresh all now")}</button></form>`} </div> </header> ${renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": textChannels, "data-astro-cid-facc5juy": true })} ${message && renderTemplate`<div${addAttribute(["sx-flash", { "sx-flash-bad": message.kind === "err" }], "class:list")} role="status" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": message.kind === "ok" ? "ph:check-circle-fill" : "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-facc5juy": true })}${message.text}</div>`} ${!values && livePending && renderTemplate`<div class="sx-flash cn-flash-wait" role="status" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hourglass-medium-fill", "width": "15", "height": "15", "data-astro-cid-facc5juy": true })}${dt("Loading the live numbers from Petto...")}</div>`} ${!values && !livePending && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15", "data-astro-cid-facc5juy": true })}${dt("Petto did not answer, so the previews use sample numbers. Creating counters needs Petto online.")}</div>`} ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Counters"), value: counters.length, text: limits ? `${counters.length} / ${limits.max}` : void 0, tone: "voice" },
    { label: dt("Working"), value: counters.filter((c) => c.enabled && !c.problem).length, tone: "joins" },
    values ? { label: dt("Members now"), value: Number(values.members ?? 0) || 0, tone: "messages" } : { label: dt("Members now"), value: 0, text: approxMembers ? `~${approxMembers.toLocaleString(dashLang)}` : "\u2014", tone: "messages" },
    values && presences ? { label: dt("Online now"), value: Number(values.online ?? 0) || 0, tone: "invites" } : { label: dt("Online now"), value: 0, text: "\u2014", tone: "invites" }
  ], "data-astro-cid-facc5juy": true })} <figure class="sx-panel cn-spark" data-spark${addAttribute(dt("Members, last 30 days"), "aria-label")} data-astro-cid-facc5juy> <div class="sx-panel-head" data-astro-cid-facc5juy> <span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chart-line-up-fill", "width": "17", "height": "17", "data-astro-cid-facc5juy": true })}</span> <h2 data-astro-cid-facc5juy>${dt("Members, last 30 days")}</h2> ${spark && renderTemplate`<b${addAttribute(["cn-spark-change", { up: spark.change > 0, down: spark.change < 0 }], "class:list")} data-astro-cid-facc5juy>${spark.change > 0 ? "+" : ""}${spark.change.toLocaleString(dashLang)}</b>`} </div> ${spark ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-facc5juy": true }, { "default": async ($$result3) => renderTemplate(_a || (_a = __template([' <div class="cn-spark-plot" data-ct data-ct-place="above" tabindex="0" role="group"', " data-astro-cid-facc5juy> <svg", ' preserveAspectRatio="none" role="img"', " data-astro-cid-facc5juy> <polygon", ' class="cn-spark-area" data-astro-cid-facc5juy></polygon> <polyline', ' class="cn-spark-line" vector-effect="non-scaling-stroke" data-astro-cid-facc5juy></polyline> </svg> <i class="ct-guide" data-ct-guide data-astro-cid-facc5juy></i> <i class="ct-dot" data-ct-dot style="--ct-c:var(--accent)" data-astro-cid-facc5juy></i> <div class="ct-tip cn-spark-tip" data-ct-box data-astro-cid-facc5juy><span data-ct-f="label" data-astro-cid-facc5juy></span></div> <script type="application/json" data-ct-data>', "<\/script> ", ' </div> <div class="cn-spark-axis" aria-hidden="true" data-astro-cid-facc5juy><span data-astro-cid-facc5juy>', " \xB7 ", "</span><span data-astro-cid-facc5juy>", " \xB7 ", '</span></div> <table class="cn-sr" data-astro-cid-facc5juy> <caption data-astro-cid-facc5juy>', "</caption> <tbody data-astro-cid-facc5juy>", "</tbody> </table> "])), addAttribute(dt("Members, last 30 days"), "aria-label"), addAttribute(`0 0 ${spark.W} ${spark.H}`, "viewBox"), addAttribute(dt("From {a} on {b} to {c} on {d}", { a: spark.first.members.toLocaleString(dashLang), b: dayLabel(spark.first.day), c: spark.last.members.toLocaleString(dashLang), d: dayLabel(spark.last.day) }), "aria-label"), addAttribute(spark.area, "points"), addAttribute(spark.line, "points"), unescapeHTML(chartTipJson(spark.points.map((pt) => ({ x: pt.x / spark.W, y: [pt.y / spark.H], f: { label: `${dayLabel(pt.day)}: ${pt.members.toLocaleString(dashLang)}` } })))), renderComponent($$result3, "DashChartTip", $$DashChartTip, { "data-astro-cid-facc5juy": true }), dayLabel(spark.first.day), spark.first.members.toLocaleString(dashLang), dayLabel(spark.last.day), spark.last.members.toLocaleString(dashLang), dt("Members, last 30 days"), memberDays.map((d) => renderTemplate`<tr data-astro-cid-facc5juy><th scope="row" data-astro-cid-facc5juy>${dayLabel(d.day)}</th><td data-astro-cid-facc5juy>${d.members.toLocaleString(dashLang)}</td></tr>`)) })}` : renderTemplate`<p class="sx-empty" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chart-line-up-fill", "width": "16", "height": "16", "data-astro-cid-facc5juy": true })}${dt("Petto saves the members once a day; the line shows up after the second day.")}</p>`} </figure> ${counters.length === 0 && renderTemplate`<section class="sx-panel cn-empty" data-astro-cid-facc5juy> <div class="cn-empty-art" aria-hidden="true" data-astro-cid-facc5juy> <div class="cn-fake" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:folder-simple-fill", "width": "13", "height": "13", "data-astro-cid-facc5juy": true })}<span data-astro-cid-facc5juy>${dt("\u{1F4CA} Server stats")}</span></div> ${["members", "users_only", "bots_only"].map((type, i) => renderTemplate`<div class="cn-fake cn-fake-ch"${addAttribute(`--i:${i}`, "style")} data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:speaker-high-fill", "width": "13", "height": "13", "data-astro-cid-facc5juy": true })}<span data-astro-cid-facc5juy>${nameOf({ type, template: defaults[type], format: "grouped", goal: null, timezone: null, roleId: null })}</span></div>`)} </div> <div class="cn-empty-text" data-astro-cid-facc5juy> <h2 data-astro-cid-facc5juy>${dt("Start with the server stats")}</h2> <p data-astro-cid-facc5juy>${dt('One click makes a "Server stats" category with Members, Humans and Bots, in voice channels everyone can see and nobody can join.')}</p> <form method="POST" data-no-dirty data-astro-cid-facc5juy><input type="hidden" name="action" value="setup" data-astro-cid-facc5juy><button class="btn btn-accent btn-sm" type="submit" data-no-dirty${addAttribute(!values, "disabled")} data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lightning-fill", "width": "13", "height": "13", "data-astro-cid-facc5juy": true })}${dt("Quick setup")}</button></form> </div> </section>`} ${counters.length > 0 && renderTemplate`<section class="cn-listbox" aria-labelledby="cn-list-title" data-astro-cid-facc5juy> <div class="cn-sec-head" data-astro-cid-facc5juy> <h2 id="cn-list-title" data-astro-cid-facc5juy>${dt("Your counters")}</h2> ${kindCounts.map(([label, n]) => renderTemplate`<span class="sx-tag" data-astro-cid-facc5juy>${label} ${n}</span>`)} </div> <p class="sx-hint cn-list-hint" id="cn-order-hint" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:dots-six-vertical-bold", "width": "12", "height": "12", "data-astro-cid-facc5juy": true })}${dt("Drag the handle (or use the arrows) to change the order; Petto moves the channels in Discord to match. Click a name to edit it in place.")}</p> <div class="cn-order-status" role="status" aria-live="polite" data-order-status data-astro-cid-facc5juy></div> <div class="cn-list dgl-stagger"${addAttribute(dt("Counters"), "aria-label")} data-counter-list data-astro-cid-facc5juy> ${counters.map((c, index) => {
    const name = nameOf(c).trim() || (labels[c.type] ?? c.type);
    const kind = shownKind(c);
    const status = c.problem ? "problem" : !c.enabled ? "off" : c.currentName !== null && shownName(name, kind) !== c.currentName ? "waiting" : "ok";
    return renderTemplate`<article${addAttribute(["cn-item", `cn-${status}`], "class:list")}${addAttribute(`--i:${index}`, "style")} data-counter-card${addAttribute(kind, "data-kind")}${addAttribute(c.kind, "data-base-kind")}${addAttribute(c.channelId, "data-channel")}${addAttribute(c.template, "data-template-now")}${addAttribute(c.type, "data-type-now")}${addAttribute(c.format, "data-format-now")}${addAttribute(c.goal ?? "", "data-goal-now")}${addAttribute(c.timezone ?? "", "data-zone-now")}${addAttribute(c.roleId ?? "", "data-role-now")}${addAttribute(c.target, "data-target")} data-astro-cid-facc5juy> <div class="cn-top" data-astro-cid-facc5juy> <div class="cn-order" data-astro-cid-facc5juy> <button type="button" class="cn-handle" data-drag-handle${addAttribute(dt("Drag to reorder"), "aria-label")} aria-describedby="cn-order-hint" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:dots-six-vertical-bold", "width": "14", "height": "14", "data-astro-cid-facc5juy": true })}</button> <span class="cn-arrows" data-astro-cid-facc5juy> <button type="button" data-move="-1"${addAttribute(dt("Move up"), "aria-label")}${addAttribute(index === 0, "disabled")} data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-up-bold", "width": "11", "height": "11", "data-astro-cid-facc5juy": true })}</button> <button type="button" data-move="1"${addAttribute(dt("Move down"), "aria-label")}${addAttribute(index === counters.length - 1, "disabled")} data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "width": "11", "height": "11", "data-astro-cid-facc5juy": true })}</button> </span> </div> <div class="cn-channel" data-astro-cid-facc5juy> ${renderComponent($$result2, "Icon", $$Icon, { "name": kindIcon[kind] ?? kindIcon.voice, "width": "15", "height": "15", "data-astro-cid-facc5juy": true })} <span class="cn-name-wrap"${addAttribute(labels[c.type] ?? c.type, "data-label")} data-astro-cid-facc5juy> ${c.target === "topic" && c.channelName && renderTemplate`<small class="cn-topic-of" data-astro-cid-facc5juy># ${c.channelName}</small>`} <button type="button" class="cn-name" data-preview-out data-inline-edit${addAttribute(dt("Click to edit the name"), "title")} data-astro-cid-facc5juy>${shownName(name, kind)}</button> <span class="cn-inline" data-inline-box hidden data-astro-cid-facc5juy> <input type="text"${addAttribute(c.target === "topic" ? 500 : 100, "maxlength")}${addAttribute(c.template, "value")}${addAttribute(c.target === "topic" ? dt("Topic") : dt("Name"), "aria-label")} data-inline-input data-astro-cid-facc5juy> <small data-inline-preview data-astro-cid-facc5juy></small> <small class="cn-inline-help" data-astro-cid-facc5juy>${dt("Enter saves, Esc cancels")}</small> </span> </span> </div> </div> <div class="cn-meta" data-astro-cid-facc5juy> <span class="cn-type" data-astro-cid-facc5juy>${labels[c.type] ?? c.type}</span> ${status === "ok" && renderTemplate`<span class="cn-pill cn-pill-ok" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "12", "height": "12", "data-astro-cid-facc5juy": true })}${dt("Up to date")}</span>`} ${status === "waiting" && renderTemplate`<span class="cn-pill cn-pill-wait" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hourglass-medium-fill", "width": "12", "height": "12", "data-astro-cid-facc5juy": true })}${c.nextRenameAt ? renderTemplate`<span${addAttribute(c.nextRenameAt, "data-countdown")} data-astro-cid-facc5juy>${dt("Waiting for Discord")}</span>` : dt("Updating")}</span>`} ${status === "off" && renderTemplate`<span class="cn-pill" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pause-fill", "width": "12", "height": "12", "data-astro-cid-facc5juy": true })}${dt("Off")}</span>`} ${status === "problem" && renderTemplate`<span class="cn-pill cn-pill-err" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "12", "height": "12", "data-astro-cid-facc5juy": true })}${problems[c.problem ?? ""] ?? dt("The last rename failed.")}</span>`} ${c.currentName && status === "waiting" && renderTemplate`<span class="cn-now" data-astro-cid-facc5juy>${dt("Now: {a}", { a: c.currentName })}</span>`} </div> <div class="cn-times" data-astro-cid-facc5juy> <span data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-counter-clockwise-fill", "width": "12", "height": "12", "data-astro-cid-facc5juy": true })}${c.lastUpdatedAt ? renderTemplate`<span${addAttribute(c.lastUpdatedAt, "data-ago")} data-astro-cid-facc5juy>${dt("Updated")}</span>` : dt("Not renamed yet")}</span> ${c.enabled && !c.problem && renderTemplate`<span data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-countdown-fill", "width": "12", "height": "12", "data-astro-cid-facc5juy": true })}${c.queued ? dt("Next update: now") : c.nextRenameAt ? renderTemplate`<span${addAttribute(c.nextRenameAt, "data-next")} data-astro-cid-facc5juy>${dt("Next update")}</span>` : c.nextCheckAt ? renderTemplate`<span${addAttribute(c.nextCheckAt, "data-next")} data-next-check data-astro-cid-facc5juy>${dt("Next check")}</span>` : dt("Updates when the number changes")}</span>`} ${c.badges.filter((b) => badgeText[b]).map((b) => renderTemplate`<span${addAttribute(["cn-pill", b === "rate_limited" ? "cn-pill-wait" : "cn-pill-warn"], "class:list")} data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "12", "height": "12", "data-astro-cid-facc5juy": true })}${badgeText[b]}</span>`)} ${c.renamesLeft !== null && c.enabled && renderTemplate`<span class="cn-budget"${addAttribute(dt("Renames left in the current 10 minutes"), "title")} data-astro-cid-facc5juy>${[0, 1].map((n) => renderTemplate`<i${addAttribute({ used: n >= (c.renamesLeft ?? 2) }, "class:list")} data-astro-cid-facc5juy></i>`)}</span>`} </div> <div class="cn-row-actions" data-astro-cid-facc5juy> <button type="button" class="btn btn-ghost btn-sm" data-edit-toggle aria-expanded="false" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-bold", "width": "13", "height": "13", "data-astro-cid-facc5juy": true })}${dt("Edit")}</button> <form method="POST" data-no-dirty data-bot-wait data-astro-cid-facc5juy><input type="hidden" name="action" value="refresh" data-astro-cid-facc5juy><input type="hidden" name="channel_id"${addAttribute(c.channelId, "value")} data-astro-cid-facc5juy><button class="btn btn-ghost btn-sm" type="submit" data-no-dirty${addAttribute(!c.exists, "disabled")} data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrows-clockwise-bold", "width": "13", "height": "13", "data-astro-cid-facc5juy": true })}${dt("Refresh now")}</button></form> </div> <details class="cn-edit" data-dash-hold data-astro-cid-facc5juy> <summary hidden data-astro-cid-facc5juy>${dt("Edit")}</summary> <form method="POST" class="cn-form" data-counter-form data-astro-cid-facc5juy> <input type="hidden" name="action" value="save" data-astro-cid-facc5juy><input type="hidden" name="channel_id"${addAttribute(c.channelId, "value")} data-astro-cid-facc5juy> <input type="hidden" name="category_changed" value="0" data-category-changed data-astro-cid-facc5juy> <div class="sx-grid" data-astro-cid-facc5juy> <div class="sx-field" data-astro-cid-facc5juy><label${addAttribute(`cn-type-${c.id}`, "for")} data-astro-cid-facc5juy>${dt("Shows")}</label> <select${addAttribute(`cn-type-${c.id}`, "id")} name="type" data-type data-astro-cid-facc5juy>${groups.map((g) => renderTemplate`<optgroup${addAttribute(g.label, "label")} data-astro-cid-facc5juy>${g.types.map((type) => renderTemplate`<option${addAttribute(type, "value")}${addAttribute(type === c.type, "selected")} data-astro-cid-facc5juy>${labels[type]}</option>`)}</optgroup>`)}</select> </div> <div class="sx-field" data-astro-cid-facc5juy><label${addAttribute(`cn-cat-${c.id}`, "for")} data-astro-cid-facc5juy>${dt("Category")}</label> <select${addAttribute(`cn-cat-${c.id}`, "id")} name="category_id" data-category data-astro-cid-facc5juy><option value="" data-astro-cid-facc5juy>${dt("No category")}</option>${categories.map((cat) => renderTemplate`<option${addAttribute(cat.id, "value")}${addAttribute(cat.id === c.parentId, "selected")} data-astro-cid-facc5juy>${cat.name}</option>`)}</select> </div> <div class="sx-field sx-wide" data-astro-cid-facc5juy><label${addAttribute(`cn-tpl-${c.id}`, "for")} data-astro-cid-facc5juy>${c.target === "topic" ? dt("Topic") : dt("Name")}</label> <textarea${addAttribute(`cn-tpl-${c.id}`, "id")} name="template" class="dgl-autogrow sx-one" rows="1" data-one-line data-count${addAttribute(c.target === "topic" ? 500 : 100, "maxlength")} data-template${addAttribute(defaults[c.type], "data-default")} data-astro-cid-facc5juy>${c.template}</textarea> </div> <div class="cn-chips sx-wide" data-chips data-astro-cid-facc5juy>${["{count}", "{goal}", "{left}", "{percent}", "{role}", "{tz}"].map((v) => renderTemplate`<button type="button" class="cn-chip"${addAttribute(v, "data-insert")} data-astro-cid-facc5juy>${v}</button>`)}</div> ${(c.kind === "text" || c.kind === "announce") && renderTemplate`<div class="sx-field sx-wide" data-astro-cid-facc5juy><span class="sx-label" data-astro-cid-facc5juy>${dt("Shows the value in")}</span> <div class="sx-chips" role="radiogroup"${addAttribute(dt("Shows the value in"), "aria-label")} data-astro-cid-facc5juy> <label class="sx-chip" data-astro-cid-facc5juy><input type="radio" name="target" value="name" data-target${addAttribute(c.target !== "topic", "checked")} data-astro-cid-facc5juy><span data-astro-cid-facc5juy>${dt("The channel name")}</span></label> <label class="sx-chip" data-astro-cid-facc5juy><input type="radio" name="target" value="topic" data-target${addAttribute(c.target === "topic", "checked")} data-astro-cid-facc5juy><span data-astro-cid-facc5juy>${dt("The channel topic")}</span></label> </div> </div>`} <div class="sx-field sx-wide" data-astro-cid-facc5juy><span class="sx-label" data-astro-cid-facc5juy>${dt("Number format")}</span> <div class="sx-chips" role="radiogroup"${addAttribute(dt("Number format"), "aria-label")} data-astro-cid-facc5juy>${COUNTER_FORMATS.map((f) => renderTemplate`<label class="sx-chip" data-astro-cid-facc5juy><input type="radio" name="format"${addAttribute(f, "value")}${addAttribute(c.format === f, "checked")} data-astro-cid-facc5juy><span data-astro-cid-facc5juy>${formatLabels[f]}</span></label>`)}</div> </div> <div class="sx-field" data-when="role_members role_online" data-astro-cid-facc5juy><label${addAttribute(`cn-role-${c.id}`, "for")} data-astro-cid-facc5juy>${dt("Role")}</label> <select${addAttribute(`cn-role-${c.id}`, "id")} name="role_id" data-astro-cid-facc5juy><option value="" data-astro-cid-facc5juy>${dt("Pick a role")}</option>${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.id === c.roleId, "selected")} data-astro-cid-facc5juy>${r.name}</option>`)}</select> </div> <div class="sx-field" data-when="goal" data-astro-cid-facc5juy><label${addAttribute(`cn-goal-${c.id}`, "for")} data-astro-cid-facc5juy>${dt("Goal (empty: the next round number)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": `cn-goal-${c.id}`, "name": "goal", "min": "1", "value": c.goal ?? "", "placeholder": "500", "data-astro-cid-facc5juy": true })}</div> <div class="sx-field" data-when="clock date" data-astro-cid-facc5juy><label${addAttribute(`cn-zone-${c.id}`, "for")} data-astro-cid-facc5juy>${dt("Time zone")}</label><input${addAttribute(`cn-zone-${c.id}`, "id")} type="text" name="timezone"${addAttribute(c.timezone ?? "", "value")} placeholder="Europe/Madrid" list="cn-zones" data-astro-cid-facc5juy></div> </div> <div class="sx-switches cn-one" data-astro-cid-facc5juy><label class="sx-switch" data-astro-cid-facc5juy><input type="checkbox" name="enabled"${addAttribute(c.enabled, "checked")} data-astro-cid-facc5juy><span class="sx-switch-text" data-astro-cid-facc5juy><b data-astro-cid-facc5juy>${dt("Keep it updated")}</b></span><i class="sx-toggle" data-astro-cid-facc5juy></i></label></div> <div class="cn-preview" aria-live="polite" data-astro-cid-facc5juy><span data-astro-cid-facc5juy>${dt("Preview")}</span><b data-preview data-astro-cid-facc5juy>${shownName(name, kind)}</b></div> <div class="cn-actions" data-astro-cid-facc5juy><button class="btn btn-accent btn-sm" type="submit" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-facc5juy": true })}${dt("Save counter")}</button></div> </form> <form method="POST" class="cn-delete" data-no-dirty data-astro-cid-facc5juy><input type="hidden" name="action" value="delete" data-astro-cid-facc5juy><input type="hidden" name="channel_id"${addAttribute(c.channelId, "value")} data-astro-cid-facc5juy> <label class="sx-chip cn-delchip" data-astro-cid-facc5juy><input type="checkbox" name="delete_channel"${addAttribute(c.exists, "checked")}${addAttribute(!c.exists, "disabled")} data-astro-cid-facc5juy><span data-astro-cid-facc5juy>${dt("Also delete the channel")}</span></label> <button class="cn-del" type="submit" data-no-dirty${addAttribute(dt("Delete this counter?"), "data-confirm")} data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-facc5juy": true })}${dt("Delete")}</button> </form> </details> </article>`;
  })} </div> </section>`} <details class="dfx-acc cn-packs"${addAttribute(counters.length === 0, "open")} data-astro-cid-facc5juy> <summary data-astro-cid-facc5juy> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sparkle-fill", "width": "17", "height": "17", "data-astro-cid-facc5juy": true })}</span> <span class="dfx-acc-title" data-astro-cid-facc5juy><b data-astro-cid-facc5juy>${dt("Packs")}</b><em data-astro-cid-facc5juy>${dt("One click adds a category with ready counters. What the server already counts is skipped.")}</em></span> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down", "class": "dfx-caret", "width": "16", "height": "16", "data-astro-cid-facc5juy": true })} </summary> <div class="cn-pack-grid" data-astro-cid-facc5juy> ${packs.map((pack, i) => {
    const missing = pack.types.filter((type) => type === "goal" || !counted.has(type));
    return renderTemplate`<form method="POST" class="cn-pack"${addAttribute(`--i:${i}`, "style")} data-no-dirty data-astro-cid-facc5juy> <input type="hidden" name="action" value="setup" data-astro-cid-facc5juy><input type="hidden" name="preset"${addAttribute(pack.id, "value")} data-astro-cid-facc5juy> <div class="cn-pack-head" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": pack.icon, "width": "14", "height": "14", "data-astro-cid-facc5juy": true })}<strong data-astro-cid-facc5juy>${pack.title}</strong></div> <ul data-astro-cid-facc5juy>${pack.types.map((type) => renderTemplate`<li${addAttribute({ "cn-pack-have": type !== "goal" && counted.has(type) }, "class:list")} data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:speaker-high-fill", "width": "11", "height": "11", "data-astro-cid-facc5juy": true })}<span data-astro-cid-facc5juy>${nameOf({ type, template: defaults[type], format: "grouped", goal: type === "goal" ? nextGoal(membersNow) : null, timezone: null, roleId: null })}</span></li>`)}</ul> <button class="btn btn-ghost btn-sm" type="submit" data-no-dirty${addAttribute(!values || full || !missing.length, "disabled")} data-astro-cid-facc5juy>${missing.length ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-facc5juy": true }, { "default": async ($$result3) => renderTemplate`${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-facc5juy": true })}${dt("Add pack")}` })}` : dt("Already added")}</button> </form>`;
  })} </div> </details> <section class="sx-panel cn-announce" id="announce" aria-labelledby="cn-announce-title" data-astro-cid-facc5juy> <div class="sx-panel-head" data-astro-cid-facc5juy><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:megaphone-fill", "width": "17", "height": "17", "data-astro-cid-facc5juy": true })}</span><h2 id="cn-announce-title" data-astro-cid-facc5juy>${dt("Milestone announcements")}</h2></div> <p class="sx-lead" data-astro-cid-facc5juy>${dt("A message when the server reaches the goal of a goal counter, and if you want every N members. The same number is never announced twice.")}</p> <form method="POST" class="cn-form" data-announce-form data-astro-cid-facc5juy> <input type="hidden" name="action" value="announce" data-astro-cid-facc5juy> <div class="sx-switches" data-astro-cid-facc5juy> <label class="sx-switch" data-astro-cid-facc5juy><input type="checkbox" name="enabled"${addAttribute(announce ? announce.enabled : true, "checked")} data-astro-cid-facc5juy><span class="sx-switch-text" data-astro-cid-facc5juy><b data-astro-cid-facc5juy>${dt("Announce milestones")}</b></span><i class="sx-toggle" data-astro-cid-facc5juy></i></label> <label class="sx-switch" data-astro-cid-facc5juy><input type="checkbox" name="use_goals"${addAttribute(announce ? announce.useGoals : true, "checked")} data-astro-cid-facc5juy><span class="sx-switch-text" data-astro-cid-facc5juy><b data-astro-cid-facc5juy>${dt("When a goal counter reaches its goal")}</b></span><i class="sx-toggle" data-astro-cid-facc5juy></i></label> </div> <div class="sx-grid" data-astro-cid-facc5juy> <div class="sx-field" data-astro-cid-facc5juy><label for="cn-an-channel" data-astro-cid-facc5juy>${dt("Channel")}</label> <select id="cn-an-channel" name="channel_id" data-astro-cid-facc5juy><option value="" data-astro-cid-facc5juy>${dt("Pick a channel")}</option>${textChannels.map((ch) => renderTemplate`<option${addAttribute(ch.id, "value")}${addAttribute(ch.id === announce?.channelId, "selected")} data-astro-cid-facc5juy># ${ch.name}</option>`)}</select> </div> <div class="sx-field" data-astro-cid-facc5juy><label for="cn-an-every" data-astro-cid-facc5juy>${dt("Every N members (empty: only goals)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "cn-an-every", "name": "every", "min": "1", "step": "1", "value": announce?.every ?? "", "placeholder": "100", "data-every": true, "data-astro-cid-facc5juy": true })}</div> <div class="sx-field sx-wide" data-astro-cid-facc5juy><label for="cn-an-embed" data-astro-cid-facc5juy>${dt("Saved embed (optional)")}</label> <select id="cn-an-embed" name="embed_name" data-embed data-astro-cid-facc5juy><option value="" data-astro-cid-facc5juy>${dt("No embed: send the text")}</option>${embedNames.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === announce?.embedName, "selected")} data-astro-cid-facc5juy>${name}</option>`)}</select> </div> <div class="sx-field sx-wide" data-text-only data-astro-cid-facc5juy><label for="cn-an-message" data-astro-cid-facc5juy>${dt("Message")}</label> <textarea id="cn-an-message" class="dgl-autogrow" name="message" rows="3" maxlength="2000" data-count${addAttribute(announceDefault, "placeholder")} data-announce-text data-ac="roles,channels,emojis" data-astro-cid-facc5juy>${announce?.message ?? ""}</textarea>${renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-facc5juy": true })} </div> <div class="cn-chips sx-wide" data-text-only data-astro-cid-facc5juy>${["{count}", "{goal}", "{server}"].map((v) => renderTemplate`<button type="button" class="cn-chip"${addAttribute(v, "data-insert-announce")} data-astro-cid-facc5juy>${v}</button>`)}</div> <p class="sx-hint sx-wide" data-embed-only hidden data-astro-cid-facc5juy>${dt("The saved embed can use {counter.count}, {counter.goal} and {counter.server}.")}</p> </div> <div class="cn-preview cn-announce-preview" aria-live="polite" data-text-only data-astro-cid-facc5juy><span data-astro-cid-facc5juy>${dt("Preview")}</span><b data-announce-preview data-astro-cid-facc5juy></b></div> <div class="cn-actions" data-astro-cid-facc5juy> <button class="btn btn-accent btn-sm" type="submit" data-no-dirty data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-facc5juy": true })}${dt("Save announcements")}</button> <button class="btn btn-ghost btn-sm" type="submit" name="action" value="announce_test" data-no-dirty${addAttribute(!values, "disabled")} data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:megaphone-fill", "width": "13", "height": "13", "data-astro-cid-facc5juy": true })}${dt("Save and send a test")}</button> ${announce && renderTemplate`<span class="sx-hint" data-astro-cid-facc5juy>${dt("Last announced: {a} \xB7 next: {b}", { a: announce.lastAnnounced == null ? "\u2014" : announce.lastAnnounced.toLocaleString(dashLang), b: announce.next == null ? "\u2014" : announce.next.toLocaleString(dashLang) })}</span>`} </div> </form> </section> <section class="sx-panel cn-create" id="new" aria-labelledby="cn-new-title" data-astro-cid-facc5juy> <div class="sx-panel-head" data-astro-cid-facc5juy><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-circle-fill", "width": "17", "height": "17", "data-astro-cid-facc5juy": true })}</span><h2 id="cn-new-title" data-astro-cid-facc5juy>${dt("New counter")}</h2></div> ${full && limits && renderTemplate`<p class="sx-hint cn-limit" data-astro-cid-facc5juy>${limits.premium ? dt("This server has the most counters it can have ({a}).", { a: limits.max }) : dt("Free servers have {a} counters; Premium has {b}.", { a: limits.max, b: limits.premiumMax })}</p>`} <form method="POST" class="cn-form" data-counter-form data-create data-no-dirty data-astro-cid-facc5juy> <input type="hidden" name="action" value="create" data-astro-cid-facc5juy> <div class="cn-types" role="radiogroup"${addAttribute(dt("Shows"), "aria-label")} data-astro-cid-facc5juy> ${groups.map((g) => renderTemplate`<div class="cn-type-group" data-astro-cid-facc5juy><span class="cn-type-label" data-astro-cid-facc5juy>${g.label}</span> <div class="cn-type-row" data-astro-cid-facc5juy>${g.types.map((type) => renderTemplate`<label class="cn-type-pick" data-astro-cid-facc5juy><input type="radio" name="type"${addAttribute(type, "value")}${addAttribute(type === "members", "checked")} data-type data-astro-cid-facc5juy><span data-astro-cid-facc5juy><b data-astro-cid-facc5juy>${labels[type]}</b><em data-astro-cid-facc5juy>${type === "role_members" || type === "role_online" ? "" : type === "clock" || type === "date" ? timeValue(type, "UTC", dashLang) : PRESENCE_TYPES.includes(type) && !presences ? "\u2014" : typeof sample[type] === "number" ? Number(sample[type]).toLocaleString(dashLang) : sample[type] ?? ""}</em></span></label>`)}</div> </div>`)} </div> <div class="sx-grid" data-astro-cid-facc5juy> <div class="sx-field sx-wide" data-astro-cid-facc5juy><label for="cn-new-template" data-astro-cid-facc5juy>${dt("Name")}</label><textarea id="cn-new-template" name="template" class="dgl-autogrow sx-one" rows="1" data-one-line data-count maxlength="100" data-template${addAttribute(defaults.members, "data-default")} data-astro-cid-facc5juy>${defaults.members}</textarea></div> <div class="cn-chips sx-wide" data-chips data-astro-cid-facc5juy>${["{count}", "{goal}", "{left}", "{percent}", "{role}", "{tz}"].map((v) => renderTemplate`<button type="button" class="cn-chip"${addAttribute(v, "data-insert")} data-astro-cid-facc5juy>${v}</button>`)}</div> <div class="sx-field sx-wide" data-astro-cid-facc5juy><span class="sx-label" data-astro-cid-facc5juy>${dt("Number format")}</span> <div class="sx-chips" role="radiogroup"${addAttribute(dt("Number format"), "aria-label")} data-astro-cid-facc5juy>${COUNTER_FORMATS.map((f) => renderTemplate`<label class="sx-chip" data-astro-cid-facc5juy><input type="radio" name="format"${addAttribute(f, "value")}${addAttribute(f === "grouped", "checked")} data-astro-cid-facc5juy><span data-astro-cid-facc5juy>${formatLabels[f]}</span></label>`)}</div> </div> <div class="sx-field" data-when="role_members role_online" data-astro-cid-facc5juy><label for="cn-new-role" data-astro-cid-facc5juy>${dt("Role")}</label><select id="cn-new-role" name="role_id" data-astro-cid-facc5juy><option value="" data-astro-cid-facc5juy>${dt("Pick a role")}</option>${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")} data-astro-cid-facc5juy>${r.name}</option>`)}</select></div> <div class="sx-field" data-when="goal" data-astro-cid-facc5juy><label for="cn-new-goal" data-astro-cid-facc5juy>${dt("Goal (empty: the next round number)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "cn-new-goal", "name": "goal", "min": "1", "value": "", "placeholder": "500", "data-astro-cid-facc5juy": true })}</div> <div class="sx-field" data-when="clock date" data-astro-cid-facc5juy><label for="cn-new-zone" data-astro-cid-facc5juy>${dt("Time zone")}</label><input id="cn-new-zone" type="text" name="timezone" placeholder="Europe/Madrid" list="cn-zones" data-astro-cid-facc5juy></div> <div class="sx-field sx-wide" data-astro-cid-facc5juy><span class="sx-label" data-astro-cid-facc5juy>${dt("Channel")}</span> <div class="sx-chips" role="radiogroup"${addAttribute(dt("Channel"), "aria-label")} data-astro-cid-facc5juy> <label class="sx-chip" data-astro-cid-facc5juy><input type="radio" name="use" value="new" checked data-use data-astro-cid-facc5juy><span data-astro-cid-facc5juy>${dt("Make a new one")}</span></label> <label class="sx-chip" data-astro-cid-facc5juy><input type="radio" name="use" value="existing" data-use${addAttribute(freeChannels.length === 0, "disabled")} data-astro-cid-facc5juy><span data-astro-cid-facc5juy>${dt("Use one I have")}</span></label> </div> </div> <div class="sx-field" data-use-when="new" data-astro-cid-facc5juy><label for="cn-new-kind" data-astro-cid-facc5juy>${dt("Kind")}</label><select id="cn-new-kind" name="kind" data-kind data-astro-cid-facc5juy>${Object.entries(kindLabels).map(([k, label]) => renderTemplate`<option${addAttribute(k, "value")} data-astro-cid-facc5juy>${label}</option>`)}</select></div> <div class="sx-field" data-use-when="new" data-astro-cid-facc5juy><label for="cn-new-cat" data-astro-cid-facc5juy>${dt("Category")}</label><select id="cn-new-cat" name="category_id" data-astro-cid-facc5juy><option value="" data-astro-cid-facc5juy>${dt("No category")}</option>${categories.map((cat) => renderTemplate`<option${addAttribute(cat.id, "value")} data-astro-cid-facc5juy>${cat.name}</option>`)}</select></div> <div class="sx-field sx-wide" data-use-when="existing" hidden data-astro-cid-facc5juy><label for="cn-new-existing" data-astro-cid-facc5juy>${dt("Channel")}</label><select id="cn-new-existing" name="channel_id" data-existing data-astro-cid-facc5juy>${freeChannels.map((ch) => renderTemplate`<option${addAttribute(ch.id, "value")}${addAttribute(ch.kind, "data-kind")} data-astro-cid-facc5juy>${ch.kind === "voice" || ch.kind === "stage" ? "\u{1F50A} " : "# "}${ch.name}</option>`)}</select></div> <div class="sx-switches cn-one sx-wide" data-use-when="existing" data-topic-switch hidden data-astro-cid-facc5juy><label class="sx-switch" data-astro-cid-facc5juy><input type="checkbox" name="target" value="topic" data-astro-cid-facc5juy><span class="sx-switch-text" data-astro-cid-facc5juy><b data-astro-cid-facc5juy>${dt("Show the value in the topic (the name stays as it is)")}</b></span><i class="sx-toggle" data-astro-cid-facc5juy></i></label></div> </div> <div class="cn-preview" aria-live="polite" data-astro-cid-facc5juy><span data-astro-cid-facc5juy>${dt("Preview")}</span><b data-preview data-astro-cid-facc5juy>${shownName(nameOf({ type: "members", template: defaults.members, format: "grouped", goal: null, timezone: null, roleId: null }), "voice")}</b></div> ${!presences && values && renderTemplate`<p class="sx-hint" data-astro-cid-facc5juy>${dt("The online counts need the Presence intent of Petto; until Discord sends presences they show 0.")}</p>`} <div class="cn-actions" data-astro-cid-facc5juy> <button class="btn btn-accent btn-sm" type="submit"${addAttribute(full || !values, "disabled")} data-astro-cid-facc5juy>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "13", "height": "13", "data-astro-cid-facc5juy": true })}${dt("Create counter")}</button> <span class="sx-hint" data-astro-cid-facc5juy>${dt("Prefix: !counter create members, !counter setup, !counter list.")}</span> </div> </form> <datalist id="cn-zones" data-astro-cid-facc5juy>${["UTC", "Europe/London", "Europe/Madrid", "Europe/Lisbon", "America/New_York", "America/Chicago", "America/Los_Angeles", "America/Mexico_City", "America/Bogota", "America/Lima", "America/Argentina/Buenos_Aires", "America/Santiago", "America/Sao_Paulo", "Asia/Tokyo", "Asia/Kolkata", "Australia/Sydney"].map((z) => renderTemplate`<option${addAttribute(z, "value")} data-astro-cid-facc5juy></option>`)}</datalist> </section> </div> ` })}  `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashCounters.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Counters = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Counters;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const SNOWFLAKE = /^\d{15,25}$/;
  const text = (value, max) => String(value ?? "").replace(/\u0000/g, "").replace(/\r\n/g, "\n").trim().slice(0, max);
  const snowflake = (value) => SNOWFLAKE.test(String(value ?? "")) ? String(value) : null;
  let message = null;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    if (action === "reorder" || action === "template") {
      const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
      if (action === "reorder") {
        let order = [];
        try {
          order = JSON.parse(String(form.get("order") ?? "[]")).map(String).filter((v) => SNOWFLAKE.test(v)).slice(0, 100);
        } catch {
          order = [];
        }
        if (!order.length) return json({ ok: false, message: dt("Nothing to reorder.") }, 400);
        const result = await callPettoCounters(Astro2, id, session.userId, "reorder", { channel_ids: order }, dashLang);
        forgetCalls(`counters:${id}:`);
        return json({ ok: result.ok, message: result.message || dt("Petto did not answer. Try again in a moment.") }, result.ok ? 200 : 502);
      }
      const channelId = snowflake(form.get("channel_id"));
      const template = text(form.get("template"), form.get("target") === "topic" ? 500 : 100);
      if (!channelId || !template) return json({ ok: false, message: dt("Write a name.") }, 400);
      const res = await fetch(`${apiUrl}/rest/v1/server_counters?guild_id=eq.${id}&channel_id=eq.${channelId}`, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ name_template: template }) }).catch(() => null);
      if (!res?.ok) return json({ ok: false, message: dt("It could not be saved, try again.") }, 502);
      await callPettoCounters(Astro2, id, session.userId, "refresh", { channel_id: channelId }, dashLang);
      forgetCalls(`counters:${id}:`);
      return json({ ok: true, message: dt("Counter saved. Its name changes as soon as Discord allows.") });
    }
    await ensureGuildRow(apiUrl, apiHeaders, id);
    const botFailed = (result) => result?.down ? dt("Petto is not answering. It may be restarting after an update. Try again in a few seconds.") : dt("Petto did not answer. Try again in a moment.");
    const goalOf = (value) => {
      const n = Math.trunc(Number(String(value ?? "").replace(/[.,\s]/g, "")));
      return Number.isFinite(n) && n > 0 ? Math.min(2e9, n) : null;
    };
    if (action === "create") {
      const type = String(form.get("type") ?? "");
      const zone = text(form.get("timezone"), 64);
      if (!COUNTER_TYPES.includes(type)) message = { kind: "err", text: dt("Pick what the counter shows.") };
      else if (ROLE_TYPES.includes(type) && !snowflake(form.get("role_id"))) message = { kind: "err", text: dt("Pick the role to count.") };
      else if (zone && !validTimeZone(zone)) message = { kind: "err", text: dt("That time zone is not known. Use a name like Europe/Madrid.") };
      else {
        const result = await callPettoCounters(Astro2, id, session.userId, "create", {
          type,
          template: text(form.get("template"), String(form.get("kind")) === "topic" || form.get("target") === "topic" ? 500 : 100),
          format: String(form.get("format") ?? "plain"),
          kind: form.get("use") === "existing" ? null : String(form.get("kind") ?? "voice"),
          target: form.get("use") === "existing" && form.get("target") === "topic" ? "topic" : "name",
          category_id: snowflake(form.get("category_id")),
          channel_id: form.get("use") === "existing" ? snowflake(form.get("channel_id")) : null,
          role_id: snowflake(form.get("role_id")),
          goal: goalOf(form.get("goal")),
          timezone: zone || null
        }, dashLang);
        message = result.ok ? { kind: "ok", text: result.message || dt("Counter created.") } : { kind: "err", text: result.message || botFailed(result) };
      }
    } else if (action === "setup") {
      const preset = String(form.get("preset") ?? "");
      const result = await callPettoCounters(Astro2, id, session.userId, "setup", ["basic", "boosts", "online", "goal", "clock"].includes(preset) ? { preset } : {}, dashLang);
      message = result.ok ? { kind: "ok", text: result.message || dt("Server stats are ready.") } : { kind: "err", text: result.message || botFailed(result) };
    } else if (action === "refresh") {
      const result = await callPettoCounters(Astro2, id, session.userId, "refresh", { channel_id: snowflake(form.get("channel_id")) }, dashLang);
      message = result.ok ? { kind: "ok", text: result.message } : { kind: "err", text: result.message || botFailed(result) };
    } else if (action === "delete") {
      const channelId = snowflake(form.get("channel_id"));
      const result = channelId ? await callPettoCounters(Astro2, id, session.userId, "delete", { channel_id: channelId, delete_channel: form.get("delete_channel") === "on" }, dashLang) : { ok: false, message: "" };
      if (!result.ok && channelId && !result.message) {
        const res = await fetch(`${apiUrl}/rest/v1/server_counters?guild_id=eq.${id}&channel_id=eq.${channelId}`, { method: "DELETE", headers: apiHeaders });
        message = res.ok ? { kind: "ok", text: dt("Counter stopped. The channel was kept.") } : { kind: "err", text: dt("It could not be saved, try again.") };
      } else message = result.ok ? { kind: "ok", text: result.message } : { kind: "err", text: result.message || botFailed(result) };
    } else if (action === "announce" || action === "announce_test") {
      const every = text(form.get("every"), 12).replace(/[.,\s]/g, "");
      const body = {
        enabled: form.get("enabled") === "on",
        channel_id: snowflake(form.get("channel_id")),
        message: text(form.get("message"), 2e3),
        embed_name: text(form.get("embed_name"), 100) || null,
        every: every || null,
        use_goals: form.get("use_goals") === "on"
      };
      if (body.enabled && !body.channel_id) message = { kind: "err", text: dt("Pick the channel for the announcements.") };
      else if (every && !(Number(every) >= 1 && Number(every) <= 1e8 && Number.isInteger(Number(every)))) message = { kind: "err", text: dt("Every N members takes a whole number, like 100.") };
      else {
        const saved = await callPettoCounters(Astro2, id, session.userId, "announce", body, dashLang);
        if (!saved.ok && !saved.message) {
          const res = await fetch(`${apiUrl}/rest/v1/counter_announce_config?on_conflict=guild_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, ...body, every: body.every ? Number(body.every) : null, last_announced: null, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
          message = res.ok ? { kind: "ok", text: dt("Announcements saved.") } : { kind: "err", text: dt("It could not be saved, try again.") };
        } else if (saved.ok && action === "announce_test") {
          const test = await callPettoCounters(Astro2, id, session.userId, "announce", { test: true }, dashLang);
          message = { kind: test.ok ? "ok" : "err", text: test.message || botFailed(test) };
        } else message = saved.ok ? { kind: "ok", text: saved.message || dt("Announcements saved.") } : { kind: "err", text: saved.message };
      }
    } else if (action === "save") {
      const channelId = snowflake(form.get("channel_id"));
      const type = String(form.get("type") ?? "");
      const zone = text(form.get("timezone"), 64);
      const format = String(form.get("format") ?? "plain");
      const parentId = snowflake(form.get("category_id"));
      if (!channelId || !COUNTER_TYPES.includes(type)) message = { kind: "err", text: dt("Pick what the counter shows.") };
      else if (ROLE_TYPES.includes(type) && !snowflake(form.get("role_id"))) message = { kind: "err", text: dt("Pick the role to count.") };
      else if (zone && !validTimeZone(zone)) message = { kind: "err", text: dt("That time zone is not known. Use a name like Europe/Madrid.") };
      else {
        const enabled = form.get("enabled") === "on";
        const target = form.get("target") === "topic" ? "topic" : "name";
        const patch = {
          counter_option: type,
          name_template: text(form.get("template"), target === "topic" ? 500 : 100) || "{count}",
          ...form.has("target") ? { target } : {},
          number_format: COUNTER_FORMATS.includes(format) ? format : "plain",
          target_id: ROLE_TYPES.includes(type) ? snowflake(form.get("role_id")) : null,
          goal: goalOf(form.get("goal")),
          timezone: zone || null,
          parent_id: parentId,
          enabled,
          ...enabled ? { problem: null, problem_at: null } : {}
        };
        const res = await fetch(`${apiUrl}/rest/v1/server_counters?guild_id=eq.${id}&channel_id=eq.${channelId}`, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify(patch) });
        if (res.ok && form.get("category_changed") === "1") {
          await fetch(`https://discord.com/api/v10/channels/${channelId}`, { method: "PATCH", headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ parent_id: parentId }) }).catch(() => null);
        }
        if (res.ok) await callPettoCounters(Astro2, id, session.userId, "refresh", { channel_id: channelId }, dashLang);
        message = res.ok ? { kind: "ok", text: dt("Counter saved. Its name changes as soon as Discord allows.") } : { kind: "err", text: dt("It could not be saved, try again.") };
      }
    }
  }
  const LIVE_BUDGET_MS = Astro2.request.method === "POST" ? 25e3 : 300;
  if (Astro2.request.method === "POST") forgetCalls(`counters:${id}:`);
  const previewCall = sharedCall(`counters:${id}:${session.userId}:${dashLang}`, () => callPettoCounters(Astro2, id, session.userId, "preview", {}, dashLang), (result) => result.ok ? 15e3 : 3e3);
  const [guildInfo, rowsRes, channelsRes, rolesRes, previewReady, embedsRes, announceRes, daysRes, snapshot] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/server_counters?guild_id=eq.${id}&select=*&order=id.asc`, { headers: apiHeaders }).catch(() => null),
    getGuildList(Astro2, id, botToken, "channels"),
    getGuildList(Astro2, id, botToken, "roles"),
    withinBudget(previewCall, LIVE_BUDGET_MS),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders }).catch(() => null),
    fetch(`${apiUrl}/rest/v1/counter_announce_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }).catch(() => null),
    fetch(`${apiUrl}/rest/v1/guild_member_days?guild_id=eq.${id}&select=day,members&order=day.desc&limit=30`, { headers: apiHeaders }).catch(() => null),
    // The members of the bot's saved copy, shown while the live number is on its way (the same read as the lists above).
    readGuildSnapshot(id).catch(() => null)
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const livePending = !previewReady;
  if (livePending) markPending(Astro2);
  const preview = previewReady?.value ?? { ok: false, data: null };
  const allChannels = channelsRes?.ok ? await channelsRes.json() : [];
  const channelName = new Map(allChannels.map((c) => [String(c.id), String(c.name)]));
  const kindOf = { 0: "text", 2: "voice", 4: "category", 5: "announce", 13: "stage" };
  const categories = allChannels.filter((c) => c.type === 4).sort((a, b) => a.position - b.position).map((c) => ({ id: String(c.id), name: String(c.name) }));
  const rawRows = (rowsRes?.ok ? await rowsRes.json() : []).sort((a, b) => (a.position ?? 1e9) - (b.position ?? 1e9) || Number(a.id) - Number(b.id));
  const memberDays = daysRes?.ok ? (await daysRes.json().catch(() => [])).map((row) => ({ day: String(row.day).slice(0, 10), members: Number(row.members) || 0 })).reverse() : [];
  const counterChannels = new Set(rawRows.map((r) => String(r.channel_id)));
  const freeChannels = allChannels.filter((c) => kindOf[c.type] && c.type !== 4 && !counterChannels.has(String(c.id))).sort((a, b) => a.position - b.position).map((c) => ({ id: String(c.id), name: String(c.name), kind: kindOf[c.type] }));
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone").sort((a, b) => b.position - a.position).map((r) => ({ id: String(r.id), name: String(r.name), color: Number(r.color) || 0 }));
  const live = preview.ok ? preview.data : null;
  const liveByChannel = new Map((live?.counters ?? []).map((c) => [String(c.channel_id), c]));
  const counters = rawRows.map((r) => {
    const state = liveByChannel.get(String(r.channel_id));
    return {
      id: Number(r.id),
      channelId: String(r.channel_id),
      type: String(r.counter_option),
      kind: String(r.channel_type ?? "voice"),
      template: String(r.name_template ?? ""),
      format: String(r.number_format ?? "plain"),
      goal: r.goal == null ? null : Number(r.goal),
      timezone: r.timezone ?? null,
      roleId: r.target_id ?? null,
      prefix: String(r.prefix ?? ""),
      suffix: String(r.suffix ?? ""),
      parentId: r.parent_id ?? null,
      enabled: r.enabled !== false,
      target: r.target === "topic" ? "topic" : "name",
      channelName: state?.channel_name ?? channelName.get(String(r.channel_id)) ?? null,
      problem: r.problem ?? null,
      currentName: state?.current_name ?? (r.target === "topic" ? null : channelName.get(String(r.channel_id))) ?? null,
      exists: state ? Boolean(state.exists) : channelName.has(String(r.channel_id)),
      nextRenameAt: state?.next_rename_at ?? null,
      renamesLeft: state?.renames_left ?? null,
      lastUpdatedAt: state?.last_updated_at ?? (r.last_updated_at ? Date.parse(r.last_updated_at) || null : null),
      nextCheckAt: state?.next_check_at ?? null,
      queued: Boolean(state?.queued),
      badges: Array.isArray(state?.badges) ? state.badges.map(String) : []
    };
  });
  const limits = live?.limits ?? null;
  const embedNames = embedsRes?.ok ? (await embedsRes.json().catch(() => [])).map((row) => String(row.name)) : [];
  const textChannels = allChannels.filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map((c) => ({ id: String(c.id), name: String(c.name) }));
  const savedAnnounce = announceRes?.ok ? (await announceRes.json().catch(() => []))[0] ?? null : null;
  const announceRow = live?.announce ?? savedAnnounce;
  const announce = announceRow ? {
    enabled: announceRow.enabled !== false,
    channelId: announceRow.channel_id ?? null,
    message: String(announceRow.message ?? ""),
    embedName: announceRow.embed_name ?? null,
    every: announceRow.every == null ? null : Number(announceRow.every),
    useGoals: announceRow.use_goals !== false,
    lastAnnounced: announceRow.last_announced == null ? null : Number(announceRow.last_announced),
    next: live?.announce?.next ?? null
  } : null;
  return renderTemplate`${renderComponent($$result, "DashCounters", $$DashCounters, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "counters": counters, "categories": categories, "roles": roles, "freeChannels": freeChannels, "values": live?.values ?? null, "roleCounts": live?.roles ?? {}, "roleOnlineCounts": live?.roles_online ?? {}, "presences": Boolean(live?.presences), "limits": limits, "approxMembers": Number(guildInfo.approximate_member_count ?? snapshot?.memberCount ?? 0) || 0, "message": message, "announce": announce, "textChannels": textChannels, "embedNames": embedNames, "defaultAnnounce": String(live?.default_announce ?? ""), "memberDays": memberDays, "livePending": livePending })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/counters.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/counters.astro";
const $$url = "/dash/guild/[id]/counters";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Counters,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
