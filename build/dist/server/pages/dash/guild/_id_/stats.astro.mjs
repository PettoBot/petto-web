import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, r as renderTemplate, d as renderComponent, F as Fragment, u as unescapeHTML } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { h as hiddenChannelSet, g as goneChannelLabel } from '../../../../chunks/channelLabel_899ww5-9.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashChartTip } from '../../../../chunks/DashChartTip_Ddh1J1_O.mjs';
import { $ as $$DashChartRange, a as $$StatsChartStyle } from '../../../../chunks/DashChartRange_BG3UPTdS.mjs';
import { t as tickLabels, l as lineChart, b as barChart } from '../../../../chunks/statsChart_BucDeRWw.mjs';
import { c as changeChip, b as buildSeries, d as dayRows, s as seriesSummary } from '../../../../chunks/dashStatsView_Crz8BTRt.mjs';
import { g as getDashLang, m as makeT, a as dashLocale } from '../../../../chunks/dash_CORIPvM-.mjs';
import { B as BOT_TIME_LABEL, S as STAT_TABS, a as BOT_TIME_ZONE, r as rangeDays, c as BOT_OFFSET_MS, b as botDay, d as buildStats } from '../../../../chunks/activityStats_DxqJGP6E.mjs';
import { a as PREMIUM_STAT_DAYS, b as FREE_STAT_DAYS } from '../../../../chunks/planLimits_BFQNR8Tb.mjs';
import { $ as $$DashMemberPick } from '../../../../chunks/DashMemberPick_uPHct-_4.mjs';
import { l as localePath } from '../../../../chunks/ui_C1MR3LHJ.mjs';
import { f as formatDuration } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
/* empty css                                          */
import { a as getGuildSession, h as loadDashLayoutData } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { g as getMemberProfiles } from '../../../../chunks/memberNames_skiCoAs8.mjs';
import { d as directQuery } from '../../../../chunks/directQuery_DHNRMYtJ.mjs';
import { o as hasPremiumForGuild } from '../../../../chunks/premiumAdmin_C4HUbWtx.mjs';
import { P as callPettoInvites } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$2 = createAstro("https://petto.sbs");
const $$DashStatsAnalysis = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$DashStatsAnalysis;
  const { id, analysis, rules, flash = null } = Astro2.props;
  const lang = getDashLang(Astro2);
  const dt = makeT(lang);
  const numLocale = dashLocale(lang);
  const n = (value) => Math.round(value).toLocaleString(numLocale);
  const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const FULL_WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hoursText = (seconds) => formatDuration(seconds, { locale: numLocale });
  const percent = (share) => `${Math.round(share * 100)}%`;
  const max = Math.max(1, ...analysis.heatmap.flat());
  const weekdayMax = Math.max(1, ...analysis.byWeekday);
  const weekdayTotal = Math.max(1, analysis.byWeekday.reduce((a, b) => a + b, 0));
  const peak = analysis.peak;
  const policyUrl = `${localePath[lang]}/privacy#statistics`;
  const chip = (value, inverse = false) => {
    const c = changeChip(value, inverse, numLocale, dt("new"));
    return { text: c.arrow ? `${c.arrow} ${c.text}` : c.text, tone: c.tone };
  };
  const compareRows = [
    { key: "messages", label: "Messages", now: analysis.now.messages, before: analysis.before.messages, change: analysis.change.messages, color: "#f0a88f", format: n, inverse: false },
    { key: "reactions", label: "Reactions", now: analysis.now.reactions, before: analysis.before.reactions, change: analysis.change.reactions, color: "#f5c26b", format: n, inverse: false },
    { key: "voiceSeconds", label: "Voice", now: analysis.now.voiceSeconds, before: analysis.before.voiceSeconds, change: analysis.change.voiceSeconds, color: "#9bd0f5", format: hoursText, inverse: false },
    { key: "joins", label: "Joined", now: analysis.now.joins, before: analysis.before.joins, change: analysis.change.joins, color: "#8fdca8", format: n, inverse: false },
    { key: "leaves", label: "Left", now: analysis.now.leaves, before: analysis.before.leaves, change: analysis.change.leaves, color: "#f08fa0", format: n, inverse: true }
  ];
  const shapes = [
    { key: "links", label: "With a link", color: "#c6a8f5" },
    { key: "attachments", label: "With a file or picture", color: "#9bd0f5" },
    { key: "replies", label: "Replies", color: "#8fdca8" },
    { key: "mentions", label: "With a mention", color: "#f5c26b" }
  ];
  const toggles = [
    { field: "enabled", title: "Count the activity of this server", text: "Messages, reactions and voice time per channel, hour and day, and the members who join and leave. Turned off, nothing is counted from now on.", icon: "ph:chart-line-up-fill" },
    { field: "members", title: "Keep counts per member", text: "How many messages and how much voice time each member has. It makes the rankings of members and the page of one member. Turned off, there are no member rankings.", icon: "ph:users-three-fill" },
    { field: "content", title: "Count how messages are written", text: "How many messages carry a link, a file, a reply or a mention. Only the number, never the text.", icon: "ph:chat-circle-text-fill" }
  ];
  return renderTemplate`${id === "heatmap" && renderTemplate`${maybeRenderHead()}<div class="sa-grid" data-astro-cid-lo3snfu4><article class="sa-card sa-wide" data-astro-cid-lo3snfu4><h2 data-astro-cid-lo3snfu4>${dt("Messages by day and hour")}</h2><p${addAttribute(["sa-sub", { "sa-lit": Boolean(peak) }], "class:list")} data-astro-cid-lo3snfu4>${peak ? dt("Busiest: {a} at {b} ({c} messages)", { a: dt(FULL_WEEKDAYS[peak.weekday]), b: `${String(peak.hour).padStart(2, "0")}:00 ${BOT_TIME_LABEL}`, c: n(peak.value) }) : dt("Not enough data yet")}</p><div class="sa-heat" role="img"${addAttribute(dt("Messages by day and hour"), "aria-label")} data-astro-cid-lo3snfu4><div class="sa-heat-hours" data-astro-cid-lo3snfu4><span data-astro-cid-lo3snfu4></span>${Array.from({ length: 24 }, (_, h) => renderTemplate`<span data-astro-cid-lo3snfu4>${h % 3 === 0 ? String(h).padStart(2, "0") : ""}</span>`)}</div>${analysis.heatmap.map((hours, weekday) => renderTemplate`<div class="sa-heat-row" data-astro-cid-lo3snfu4><span class="sa-heat-day" data-astro-cid-lo3snfu4>${dt(WEEKDAYS[weekday])}</span>${hours.map((value, hour) => renderTemplate`<i${addAttribute(["sa-cell", { "sa-peak": peak && peak.weekday === weekday && peak.hour === hour }], "class:list")}${addAttribute(`--a:${value ? (0.14 + 0.86 * Math.sqrt(value / max)).toFixed(3) : 0}`, "style")}${addAttribute(`${dt(WEEKDAYS[weekday])} ${String(hour).padStart(2, "0")}:00 \xB7 ${n(value)}`, "title")} data-astro-cid-lo3snfu4></i>`)}</div>`)}</div><div class="sa-scale" data-astro-cid-lo3snfu4><span data-astro-cid-lo3snfu4>${dt("Quiet")}</span>${[0, 1, 2, 3, 4, 5].map((i) => renderTemplate`<i${addAttribute(`--a:${(0.14 + 0.86 * (i / 5)).toFixed(2)}`, "style")} data-astro-cid-lo3snfu4></i>`)}<span data-astro-cid-lo3snfu4>${dt("Busy")}</span></div></article><article class="sa-card" data-astro-cid-lo3snfu4><h2 data-astro-cid-lo3snfu4>${dt("Part of the day")}</h2><ul class="sa-bars" data-astro-cid-lo3snfu4>${["Night 00-05", "Morning 06-11", "Afternoon 12-17", "Evening 18-23"].map((label, i) => renderTemplate`<li data-astro-cid-lo3snfu4><span data-astro-cid-lo3snfu4>${dt(label)}</span><b data-astro-cid-lo3snfu4>${percent(analysis.dayparts[i])}</b><s data-astro-cid-lo3snfu4><i${addAttribute(`--w:${Math.max(analysis.dayparts[i] ? 3 : 0, analysis.dayparts[i] * 100)}%`, "style")} data-astro-cid-lo3snfu4></i></s></li>`)}</ul></article><article class="sa-card" data-astro-cid-lo3snfu4><h2 data-astro-cid-lo3snfu4>${dt("Share by weekday")}</h2><ul class="sa-bars" data-astro-cid-lo3snfu4>${analysis.byWeekday.map((value, i) => renderTemplate`<li${addAttribute({ "sa-top": value === weekdayMax && value > 0 }, "class:list")} data-astro-cid-lo3snfu4><span data-astro-cid-lo3snfu4>${dt(FULL_WEEKDAYS[i])}</span><b data-astro-cid-lo3snfu4>${percent(value / weekdayTotal)}</b><s data-astro-cid-lo3snfu4><i${addAttribute(`--w:${Math.max(value ? 3 : 0, value / weekdayMax * 100)}%`, "style")} data-astro-cid-lo3snfu4></i></s></li>`)}</ul></article></div>`}${id === "compare" && renderTemplate`<div class="sa-grid sa-grid-compare" data-astro-cid-lo3snfu4><article class="sa-card sa-wide" data-astro-cid-lo3snfu4><h2 data-astro-cid-lo3snfu4>${dt("Each number against the period before")}</h2><p class="sa-sub" data-astro-cid-lo3snfu4>${analysis.hasPrevious ? dt("The same number of days, right before this period.") : dt("Not enough data from the period before yet.")}</p><div class="sa-legend" data-astro-cid-lo3snfu4><span data-astro-cid-lo3snfu4><i class="sa-before" data-astro-cid-lo3snfu4></i>${dt("Before")}</span><span data-astro-cid-lo3snfu4><i class="sa-now" data-astro-cid-lo3snfu4></i>${dt("This period")}</span></div><ul class="sa-compare" data-astro-cid-lo3snfu4>${compareRows.map((row) => {
    const top = Math.max(1, row.now, row.before);
    const c = chip(row.change, row.inverse);
    return renderTemplate`<li${addAttribute(`--c:${row.color}`, "style")} data-astro-cid-lo3snfu4><div class="sa-compare-head" data-astro-cid-lo3snfu4><span data-astro-cid-lo3snfu4>${dt(row.label)}</span><em${addAttribute(["sa-chip", `sa-chip-${c.tone}`], "class:list")} data-astro-cid-lo3snfu4>${c.text}</em></div><div class="sa-pair" data-astro-cid-lo3snfu4><s data-astro-cid-lo3snfu4><i class="sa-before"${addAttribute(`--w:${Math.max(row.before ? 2 : 0, row.before / top * 100)}%`, "style")} data-astro-cid-lo3snfu4></i></s><b data-astro-cid-lo3snfu4>${row.format(row.before)}</b></div><div class="sa-pair" data-astro-cid-lo3snfu4><s data-astro-cid-lo3snfu4><i class="sa-now"${addAttribute(`--w:${Math.max(row.now ? 2 : 0, row.now / top * 100)}%`, "style")} data-astro-cid-lo3snfu4></i></s><b data-astro-cid-lo3snfu4>${row.format(row.now)}</b></div></li>`;
  })}</ul></article><article class="sa-card" data-astro-cid-lo3snfu4><h2 data-astro-cid-lo3snfu4>${dt("How messages are written")}</h2><p class="sa-sub" data-astro-cid-lo3snfu4>${dt("Out of every 100 messages (only counted, never read)")}</p><ul class="sa-bars sa-shape" data-astro-cid-lo3snfu4>${shapes.map((shape) => renderTemplate`<li${addAttribute(`--c:${shape.color}`, "style")} data-astro-cid-lo3snfu4><span data-astro-cid-lo3snfu4>${dt(shape.label)}</span><b data-astro-cid-lo3snfu4>${analysis.content.per100[shape.key]}</b><s data-astro-cid-lo3snfu4><i${addAttribute(`--w:${Math.max(analysis.content.per100[shape.key] ? 3 : 0, Math.min(100, analysis.content.per100[shape.key]))}%`, "style")} data-astro-cid-lo3snfu4></i></s><small data-astro-cid-lo3snfu4>${dt("{a} in the period", { a: n(analysis.content.totals[shape.key]) })}</small></li>`)}</ul>${!rules.content && renderTemplate`<p class="sa-note" data-astro-cid-lo3snfu4>${dt("This server does not count how messages are written, so this stays empty.")}</p>`}</article></div>`}${id === "data" && renderTemplate`<div class="sa-data" data-astro-cid-lo3snfu4>${flash && renderTemplate`<div${addAttribute(["sa-flash", { "sa-flash-err": flash.kind === "err" }], "class:list")}${addAttribute(flash.kind === "err" ? "alert" : "status", "role")} data-astro-cid-lo3snfu4>${flash.text}</div>`}<article class="sa-card sa-intro" data-astro-cid-lo3snfu4><h2 data-astro-cid-lo3snfu4>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "17", "height": "17", "data-astro-cid-lo3snfu4": true })}${dt("Data and privacy")}</h2><p data-astro-cid-lo3snfu4>${dt("Petto counts activity to draw these statistics. It keeps numbers only, never what was written. Here you choose what this server counts.")}</p><ul class="sa-facts" data-astro-cid-lo3snfu4><li data-astro-cid-lo3snfu4>${dt("Kept: messages, reactions and voice time per channel, hour and day; per member and day; members who join and leave; and how long the ones who left had stayed.")}</li><li data-astro-cid-lo3snfu4>${dt("Never kept: the text of messages, files, links, or who replied to whom. Bots are not counted.")}</li><li data-astro-cid-lo3snfu4>${dt("Counts per member are deleted after 13 months and the rest after two years.")}</li></ul><a class="sa-policy"${addAttribute(policyUrl, "href")} target="_blank" rel="noopener" data-astro-cid-lo3snfu4>${dt("Read the privacy policy")}${renderComponent($$result, "Icon", $$Icon, { "name": "ph:arrow-square-out-bold", "width": "13", "height": "13", "data-astro-cid-lo3snfu4": true })}</a></article><div class="sa-toggles" data-astro-cid-lo3snfu4>${toggles.map((toggle) => {
    const on = rules[toggle.field];
    const locked = toggle.field !== "enabled" && !rules.enabled;
    return renderTemplate`<article${addAttribute(["sa-card", "sa-toggle", { "sa-off": !on }], "class:list")} data-astro-cid-lo3snfu4><div class="sa-toggle-head" data-astro-cid-lo3snfu4>${renderComponent($$result, "Icon", $$Icon, { "name": toggle.icon, "width": "16", "height": "16", "data-astro-cid-lo3snfu4": true })}<h3 data-astro-cid-lo3snfu4>${dt(toggle.title)}</h3><em${addAttribute(["sa-state", { on }], "class:list")} data-astro-cid-lo3snfu4>${on ? dt("On") : dt("Off")}</em></div><p data-astro-cid-lo3snfu4>${dt(toggle.text)}</p>${locked && renderTemplate`<p class="sa-note" data-astro-cid-lo3snfu4>${dt("Nothing is counted while the first switch is off.")}</p>`}<form method="POST" data-no-dirty data-astro-cid-lo3snfu4><input type="hidden" name="field"${addAttribute(toggle.field, "value")} data-astro-cid-lo3snfu4><input type="hidden" name="value"${addAttribute(on ? "off" : "on", "value")} data-astro-cid-lo3snfu4><button type="submit" name="action" value="stats_rule"${addAttribute(["btn", "btn-sm", on ? "btn-ghost" : "btn-accent"], "class:list")} data-astro-cid-lo3snfu4>${on ? dt("Turn off") : dt("Turn on")}</button></form></article>`;
  })}</div><article class="sa-card sa-people" data-astro-cid-lo3snfu4><h3 data-astro-cid-lo3snfu4>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "16", "height": "16", "data-astro-cid-lo3snfu4": true })}${dt("Members can choose too")}</h3><p data-astro-cid-lo3snfu4>${dt("Any member can write {a} to stop being counted in every server. Their counts per member are deleted at that moment, and they can be counted again whenever they want.", { a: "!stats privacy" })}</p></article><article class="sa-card sa-danger" data-astro-cid-lo3snfu4><h3 data-astro-cid-lo3snfu4>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "16", "height": "16", "data-astro-cid-lo3snfu4": true })}${dt("Delete every counter of this server")}</h3><p data-astro-cid-lo3snfu4>${dt("Messages, voice time, hours, members, joins and leaves counted so far. It cannot be undone, and Petto starts counting again from zero if counting is on.")}</p><form method="POST" data-no-dirty data-astro-cid-lo3snfu4><button type="submit" name="action" value="stats_delete" class="btn btn-sm sa-delete"${addAttribute(dt("Delete every counter of this server? This cannot be undone."), "data-confirm")} data-astro-cid-lo3snfu4>${dt("Delete counters")}</button></form></article></div>`}`;
}, "/home/runner/work/petto-web/petto-web/src/components/DashStatsAnalysis.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashStats = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashStats;
  const statsLang = getDashLang(Astro2);
  const dt = makeT(statsLang);
  const numLocale = dashLocale(statsLang);
  const { user, guildId, guildName, guildIcon, stats, days, tab, channelNames, memberNames, inviters, hasFlow, premium = false, inviteRoles = [], inviteSettings = { fakeDays: 3, rewards: [] }, invitePeriod = "all", inviteMember = null, inviteMessage = null, analysis, rules, dataMessage = null, memberTotal = null } = Astro2.props;
  const hiddenChannels = await hiddenChannelSet(guildId);
  const goneChannel = (id, goneKey) => goneChannelLabel(dt, hiddenChannels, id, goneKey);
  const roleColor = (color) => color ? `#${color.toString(16).padStart(6, "0")}` : "var(--text-dim)";
  const rewardIds = new Set(inviteSettings.rewards.map((reward) => reward.roleId));
  const extended = Boolean(inviteSettings.extended);
  const periodLinks = [{ value: "all", label: dt("All time") }, { value: "week", label: dt("This week") }, { value: "month", label: dt("This month") }];
  const sourceText = (source) => source === "vanity" ? dt("the server link") : source === "bot" ? dt("a bot account") : source === "unknown" ? dt("a link Petto could not identify") : dt("an invite");
  const whenText = (iso) => iso ? new Date(iso).toLocaleDateString(numLocale, { year: "numeric", month: "short", day: "numeric", timeZone: BOT_TIME_ZONE }) : "";
  const inviterLine = (row) => row.bonus ? dt("{a} joined, {b} left, {c} bonus", { a: n(row.joins), b: n(row.leaves), c: (row.bonus > 0 ? "+" : "") + n(row.bonus) }) : dt("{a} joined, {b} left", { a: n(row.joins), b: n(row.leaves) });
  const tabs = {
    overview: { label: "Overview", icon: "ph:squares-four-fill", color: "#c9d0db" },
    messages: { label: "Messages", icon: "ph:chat-circle-text-fill", color: "#c9d0db" },
    voice: { label: "Voice", icon: "ph:microphone-fill", color: "#9bd0f5" },
    joins: { label: "Joins", icon: "ph:user-plus-fill", color: "#8fdca8" },
    leaves: { label: "Leaves", icon: "ph:user-minus-fill", color: "#f08fa0" },
    invites: { label: "Invites", icon: "ph:link-fill", color: "#c6a8f5" },
    sanctions: { label: "Sanctions", icon: "ph:gavel-fill", color: "#f5c26b" },
    heatmap: { label: "Heat map", icon: "ph:fire-fill", color: "#c9d0db" },
    growth: { label: "Growth", icon: "ph:chart-line-up-fill", color: "#8fdca8" },
    compare: { label: "Compare", icon: "ph:scales-fill", color: "#c6a8f5" },
    data: { label: "Data and privacy", icon: "ph:shield-check-fill", color: "#9aa3b2" }
  };
  const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const FULL_WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const n = (value) => Math.round(value).toLocaleString(numLocale);
  const hoursText = (seconds) => formatDuration(seconds, { locale: numLocale, max: "h" });
  const inARow = (seconds) => Math.abs(seconds) >= 86400 ? dt("Equal to {a} of voice in a row", { a: formatDuration(seconds, { locale: numLocale }) }) : "";
  const dayLabel = (day) => (/* @__PURE__ */ new Date(`${day}T00:00:00Z`)).toLocaleDateString(numLocale, { month: "short", day: "numeric", timeZone: "UTC" });
  const dayText = (day, opts) => (/* @__PURE__ */ new Date(`${day}T00:00:00Z`)).toLocaleDateString(numLocale, { ...opts, timeZone: "UTC" });
  const hourLabel = (hour) => `${String(hour).padStart(2, "0")}:00`;
  const growth = stats.totals.joins - stats.totals.leaves;
  const num0 = new Intl.NumberFormat(numLocale, { maximumFractionDigits: 0 });
  const num1 = new Intl.NumberFormat(numLocale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const signedOf = (format) => (v) => `${v > 0 ? "+" : v < 0 ? "\u2212" : ""}${format(Math.abs(v))}`;
  const colorOf = (name) => `var(--m-${name})`;
  const SIZES = { s: { W: 340, H: 230 }, m: { W: 520, H: 250 }, l: { W: 760, H: 270 } };
  const chartText = { todaySoFar: dt("Today, so far"), estimatedTag: "", changeVsPrev: dt("vs the day before") };
  const brushText = { label: dt("Period shown: drag to move, pull the edges to stretch"), total: dt("Total"), avg: dt("Per day"), versus: dt("Vs. before"), end: dt("At the end"), change: dt("Change"), high: dt("Highest"), all: dt("Whole range") };
  const both = (make) => ({ s: make(SIZES.s), m: make(SIZES.m), l: make(SIZES.l) });
  const series = buildSeries(stats, analysis, memberTotal);
  const VOICE = { format: (v) => formatDuration(v * 3600, { locale: numLocale, max: "h" }), ticks: (t) => t.map((v) => v === 0 ? "0" : formatDuration(v * 3600, { locale: numLocale, max: "h" })) };
  const COUNT = { format: (v) => n(v), ticks: (t) => tickLabels(t, { locale: numLocale, num: num0, num1, fractional: false }) };
  function seriesChart(key, o) {
    const source = series[key];
    const unit = o.hours ? VOICE : COUNT;
    const scaleBy = o.hours ? 1 / 3600 : 1;
    const points = source.points.map((point) => ({ ...point, value: point.value * scaleBy }));
    const flat = points.every((point) => point.value === 0);
    const def = { title: o.title, sub: o.sub, chip: o.chip, html: null, span: o.span };
    if (!points.length || flat) {
      def.message = dt("Nothing counted yet for this period.");
      return def;
    }
    const single = points.length === 1;
    const brush = { kind: source.level ? "level" : "flow", locale: numLocale, fmt: o.hours ? { type: "duration" } : { type: "count" }, text: brushText };
    const shared = { brush, color: o.color, format: unit.format, tickLabels: unit.ticks, dayText, signed: signedOf(unit.format), text: chartText, fluid: true, animate: true, aria: o.title, svgLabel: o.title };
    def.html = both((size) => o.shape === "line" ? lineChart({ ...shared, ...size, H: single ? 170 : size.H, points, single, floorZero: o.floorZero ?? true }).html : barChart({ ...shared, ...size, items: points.map((point) => ({ day: point.day, value: point.value, partial: point.partial })) }).html);
    if (o.summary && !source.level) {
      const sum = seriesSummary({ ...source, points });
      if (sum.fullDays > 1 && sum.average !== null) {
        const withDay = (point) => ({ value: point ? unit.format(point.value) : "\u2013", sub: point ? dayLabel(point.day) : "" });
        def.summary = [{ label: dt("Average per day"), value: unit.format(sum.average) }, { label: dt("Highest"), ...withDay(sum.high) }, { label: dt("Lowest"), ...withDay(sum.low) }];
      }
    }
    if (single) def.message = dt("Only today is counted so far. The chart fills in as days pass.");
    else if (points.length < stats.days.length) def.message = dt("Showing the {a} days counted so far.", { a: points.length });
    return def;
  }
  function categoryChart(o) {
    const unit = o.hours ? VOICE : COUNT;
    const top = peakIndex(o.values);
    const def = { title: o.title, sub: o.sub, html: null };
    if (o.values.every((value) => value === 0)) {
      def.message = dt("Nothing counted yet for this period.");
      return def;
    }
    def.html = both((size) => barChart({
      ...size,
      color: o.color,
      format: unit.format,
      tickLabels: unit.ticks,
      dayText,
      text: chartText,
      fluid: true,
      animate: true,
      aria: o.title,
      svgLabel: o.title,
      items: o.values.map((value, i) => ({ label: o.labels[i], title: o.titles?.[i] ?? o.labels[i], value, lit: o.lit !== false && i === top, dim: o.lit !== false && top !== -1 && i !== top }))
    }).html);
    return def;
  }
  const peakIndex = (values) => {
    let b = -1;
    values.forEach((v, i) => {
      if (v > 0 && (b === -1 || v > values[b])) b = i;
    });
    return b;
  };
  const hourLabels = Array.from({ length: 24 }, (_, h) => h % 3 === 0 ? String(h).padStart(2, "0") : "");
  const hourTitles = Array.from({ length: 24 }, (_, h) => hourLabel(h));
  const voiceHours = (seconds) => seconds.map((s) => s / 3600);
  const bestDayOf = (values) => {
    const b = peakIndex(values);
    return b === -1 ? null : { day: stats.days[b], value: values[b] };
  };
  const weekdayShort = WEEKDAYS.map((d) => dt(d));
  const weekdayFull = FULL_WEEKDAYS.map((d) => dt(d));
  const busiestOn = (values) => peakIndex(values) === -1 ? dt("Not enough data yet") : `${dt("Busiest on")} ${dt(FULL_WEEKDAYS[peakIndex(values)])}`;
  const busiestAt = (peak) => peak ? `${dt("Busiest at")} ${hourLabel(peak.hour)} ${BOT_TIME_LABEL}` : dt("Not enough data yet");
  const change = (key, inverse = false) => analysis.hasPrevious ? { change: analysis.change[key], inverse } : null;
  const stayed = (days2) => formatDuration(days2 * 86400, { locale: numLocale, max: "mo" });
  const lifespanLabels = [`<${stayed(1)}`, `<${stayed(7)}`, `<${stayed(30)}`, `${stayed(30)}\u2013${stayed(90)}`, `>${stayed(90)}`];
  const kindNames = ["Bans", "Mutes", "Warns", "Kicks", "Jails"];
  const kindValues = [stats.sanctions.byGroup.bans, stats.sanctions.byGroup.mutes, stats.sanctions.byGroup.warns, stats.sanctions.byGroup.kicks, stats.sanctions.byGroup.jails];
  const kindPeak = peakIndex(kindValues);
  const sourceNames = { moderator: "Moderators", automod: "Automod", honeypot: "Honeypot", escalation: "Warn escalation", expiry: "Automatic expiry", antinuke: "Anti-nuke" };
  const sourceRows = Object.entries(stats.sanctions.bySource).filter(([, count]) => count > 0);
  const messagesChart = () => seriesChart("messages", { title: dt("Messages per day"), sub: `${n(stats.totals.messages)} ${dt("in total")}`, color: colorOf("messages"), shape: "line", chip: change("messages"), summary: true });
  const voiceChart = () => seriesChart("voice", { title: dt("Voice hours per day"), sub: `${hoursText(stats.totals.voiceSeconds)} ${dt("in total")}${inARow(stats.totals.voiceSeconds) ? ` \xB7 ${inARow(stats.totals.voiceSeconds)}` : ""}`, color: colorOf("voice"), shape: "line", hours: true, chip: change("voiceSeconds"), summary: true });
  const hoursChart = (voice) => categoryChart({
    title: dt("Most active hours"),
    sub: busiestAt(voice ? stats.peakHour.voice : stats.peakHour.messages),
    color: colorOf(voice ? "voice" : "messages"),
    values: voice ? voiceHours(stats.hours.voice) : stats.hours.messages,
    labels: hourLabels,
    titles: hourTitles,
    hours: voice
  });
  const weekdayChart = (values, color) => categoryChart({ title: dt("Best days of the week"), sub: busiestOn(values), color, values, labels: weekdayShort, titles: weekdayFull });
  const membersChart = () => seriesChart("members", { title: dt("Members"), sub: dt("Counted back from the members today"), color: colorOf("growth"), shape: "line" });
  const panels = {
    // Messages and voice side by side (a day of each, and the busiest hours of each): the overview shows both, not only the messages.
    overview: { charts: [messagesChart(), voiceChart(), hoursChart(false), hoursChart(true)], columns: ["messages", "voice", "joins", "leaves"] },
    messages: { charts: [
      messagesChart(),
      hoursChart(false),
      seriesChart("reactions", { title: dt("Reactions per day"), sub: `${n(stats.totals.reactions)} ${dt("in total")}`, color: colorOf("reactions"), shape: "line", chip: change("reactions"), summary: true, span: true })
    ], columns: ["messages", "reactions"] },
    voice: { charts: [
      voiceChart(),
      hoursChart(true)
    ], columns: ["voice"] },
    joins: { charts: [
      seriesChart("joins", { title: dt("Members who joined per day"), sub: `${n(stats.totals.joins)} ${dt("in total")}`, color: colorOf("joins"), shape: "bars", chip: change("joins"), summary: true }),
      weekdayChart(stats.weekdays.joins, colorOf("joins"))
    ], columns: ["joins"] },
    leaves: { charts: [
      seriesChart("leaves", { title: dt("Members who left per day"), sub: `${n(stats.totals.leaves)} ${dt("in total")}`, color: colorOf("leaves"), shape: "bars", chip: change("leaves", true), summary: true }),
      weekdayChart(stats.weekdays.leaves, colorOf("leaves"))
    ], columns: ["leaves"] },
    sanctions: { charts: [
      seriesChart("sanctions", { title: dt("Sanctions per day"), sub: `${n(stats.sanctions.total)} ${dt("in total")}`, color: colorOf("sanctions"), shape: "bars", summary: true }),
      categoryChart({ title: dt("Sanctions by kind"), sub: kindPeak === -1 ? dt("Not enough data yet") : `${dt("Most")}: ${dt(kindNames[kindPeak])}`, color: colorOf("sanctions"), values: kindValues, labels: kindNames.map((k) => dt(k)) })
    ], columns: ["sanctions"] },
    heatmap: { charts: [] },
    compare: { charts: [] },
    data: { charts: [] },
    growth: { charts: [
      ...series.members.points.length ? [membersChart()] : [],
      categoryChart({ title: dt("How long members stayed before leaving"), sub: analysis.lifespanTotal ? dt("{a}% left within a week", { a: Math.round((analysis.earlyLeaveShare ?? 0) * 100) }) : dt("Nobody left in this period, or it was not counted yet."), color: colorOf("growth"), values: analysis.lifespan, labels: lifespanLabels }),
      seriesChart("net", { title: dt("Net members gained per day"), sub: `${growth >= 0 ? "+" : ""}${n(growth)} ${dt("in total")}`, color: colorOf("growth"), shape: "bars", span: Boolean(series.members.points.length) })
    ], columns: ["joins", "leaves", "net", "members"] },
    invites: { charts: [
      seriesChart("invited", { title: dt("Joins through invites per day"), sub: `${n(stats.totals.invited)} ${dt("in total")}`, color: colorOf("invites"), shape: "bars", chip: change("invited"), summary: true }),
      weekdayChart(stats.weekdays.invited, colorOf("invites"))
    ], columns: ["invited", "joins"] }
  };
  const COLUMN_LABEL = { messages: "Messages", reactions: "Reactions", voice: "Voice", joins: "Joined", leaves: "Left", invited: "Through invites", sanctions: "Sanctions", net: "Net", members: "Members" };
  const COLUMN_COLOR = { messages: "messages", reactions: "reactions", voice: "voice", joins: "joins", leaves: "leaves", invited: "invites", sanctions: "sanctions", net: "growth", members: "growth" };
  const COLUMN_TONE = { messages: "up", reactions: "up", voice: "up", joins: "up", leaves: "inverse", invited: "up", sanctions: "neutral", net: "up", members: "up" };
  const cellText = (key, value) => key === "voice" ? formatDuration(value, { locale: numLocale, max: "h" }) : n(value);
  const changeText = (key, value) => `${value > 0 ? "+" : value < 0 ? "\u2212" : ""}${cellText(key, Math.abs(value))}`;
  const toneOf = (key, value) => value === 0 || COLUMN_TONE[key] === "neutral" ? "flat" : value > 0 === (COLUMN_TONE[key] === "up") ? "good" : "bad";
  const TABLE_ROWS = 14;
  const tables = Object.fromEntries(Object.entries(panels).map(([id, panel]) => {
    const columns = (panel.columns ?? []).filter((key) => series[key].points.length > 0);
    const rows = columns.length ? dayRows(series, columns) : [];
    return [id, { columns, rows }];
  }));
  const tiles = [
    { label: "Messages", value: n(stats.totals.messages), count: stats.totals.messages, color: "messages", change: { value: analysis.change.messages, inverse: false } },
    { label: "Active members", value: n(stats.totals.activeMembers), count: stats.totals.activeMembers, color: "messages" },
    { label: "Voice", value: hoursText(stats.totals.voiceSeconds), hint: inARow(stats.totals.voiceSeconds), count: null, color: "voice", change: { value: analysis.change.voiceSeconds, inverse: false } },
    { label: "Joined", value: n(stats.totals.joins), count: stats.totals.joins, color: "joins", change: { value: analysis.change.joins, inverse: false } },
    { label: "Left", value: n(stats.totals.leaves), count: stats.totals.leaves, color: "leaves", change: { value: analysis.change.leaves, inverse: true } },
    { label: "Through invites", value: n(stats.totals.invited), count: stats.totals.invited, color: "invites", change: { value: analysis.change.invited, inverse: false } }
  ];
  const chipOf = (value, inverse) => changeChip(value, inverse, numLocale, dt("new"));
  const channelName = (id) => channelNames[id] ? `#${channelNames[id]}` : goneChannel(id, "Deleted or temporary channel");
  const memberName = (id) => memberNames[id] ?? id;
  const bestJoin = bestDayOf(stats.daily.joins);
  const bestLeave = bestDayOf(stats.daily.leaves);
  const bestInvite = bestDayOf(stats.daily.invited);
  const bestMessage = bestDayOf(stats.daily.messages);
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "stats", "pageTitle": "Statistics", "data-astro-cid-4ve76sp7": true }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<span hidden data-dash-live="30" data-astro-cid-4ve76sp7></span> <div class="st-root" id="st-root" data-astro-cid-4ve76sp7> <div class="st-head" data-astro-cid-4ve76sp7> <div class="st-title" data-astro-cid-4ve76sp7> <h1 data-astro-cid-4ve76sp7>', '</h1> <span class="st-tz"', " data-astro-cid-4ve76sp7>", "", '</span> </div> <nav class="st-range"', " data-astro-cid-4ve76sp7> ", " ", ' </nav> </div> <div class="st-tabs" role="tablist"', " data-astro-cid-4ve76sp7> ", ' </div> <div class="st-tiles" data-astro-cid-4ve76sp7> ', " </div> ", " ", " ", " ", " <script>\n    // Switching section: the new one slides in and the address keeps the section. This is an inline script inside the page\n    // content, so it also runs when the dashboard opens this page without reloading it. The links of the period load like any\n    // dashboard page: the shared placeholders (utils/dashSkeleton.mjs) show while the new numbers come in.\n    (function () {\n      var root = document.getElementById('st-root');\n      if (!root || root.dataset.ready) return;\n      root.dataset.ready = '1';\n      var tabs = Array.prototype.slice.call(root.querySelectorAll('.st-tab'));\n      var panels = Array.prototype.slice.call(root.querySelectorAll('.st-panel'));\n      function show(id) {\n        tabs.forEach(function (tab) {\n          var on = tab.dataset.tab === id;\n          tab.classList.toggle('current', on);\n          tab.setAttribute('aria-selected', on ? 'true' : 'false');\n        });\n        panels.forEach(function (panel) {\n          if (panel.dataset.panel === id) {\n            panel.classList.remove('st-panel-hidden');\n          } else panel.classList.add('st-panel-hidden');\n        });\n        try {\n          var url = new URL(location.href);\n          url.searchParams.set('tab', id);\n          history.replaceState(history.state, '', url);\n          root.querySelectorAll('a[data-keep-tab]').forEach(function (a) {\n            var u = new URL(a.href, location.origin);\n            u.searchParams.set('tab', id);\n            a.href = u.pathname + u.search;\n          });\n        } catch (e) { /* the address is just a convenience */ }\n      }\n      // The day by day table shows the latest days; the button opens or closes the rest.\n      root.querySelectorAll('[data-st-more]').forEach(function (button) {\n        button.addEventListener('click', function () {\n          var card = button.closest('[data-st-daily]');\n          if (!card) return;\n          var open = card.classList.toggle('st-open');\n          button.textContent = open ? button.dataset.less : button.dataset.more;\n        });\n      });\n      tabs.forEach(function (tab) { tab.addEventListener('click', function () { show(tab.dataset.tab || 'overview'); }); });\n    })();\n  <\/script> </div> "])), maybeRenderHead(), dt("Statistics"), addAttribute(dt("All times are {a}.", { a: "GMT-5 (Colombia)" }), "title"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-fill", "width": "12", "height": "12", "data-astro-cid-4ve76sp7": true }), BOT_TIME_LABEL, addAttribute(dt("Period"), "aria-label"), FREE_STAT_DAYS.map((value) => renderTemplate`<a${addAttribute(`/dash/guild/${guildId}/stats?days=${value}&tab=${tab}`, "href")}${addAttribute(["st-range-link", { current: value === days }], "class:list")} data-keep-tab${addAttribute(`${value} ${dt("days")}`, "aria-label")}${addAttribute(value === days ? "true" : void 0, "aria-current")} data-astro-cid-4ve76sp7>${value}d</a>`), PREMIUM_STAT_DAYS.map((value) => premium ? renderTemplate`<a${addAttribute(`/dash/guild/${guildId}/stats?days=${value}&tab=${tab}`, "href")}${addAttribute(["st-range-link", { current: value === days }], "class:list")} data-keep-tab${addAttribute(`${value} ${dt("days")}`, "aria-label")}${addAttribute(value === days ? "true" : void 0, "aria-current")} data-astro-cid-4ve76sp7>${value}d</a>` : renderTemplate`<a${addAttribute(`/dash/premium?guild_id=${guildId}`, "href")} class="st-range-link st-range-locked"${addAttribute(dt("Longer history is a Premium touch"), "title")}${addAttribute(`${value} ${dt("days")}`, "aria-label")} data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:crown-fill", "width": "11", "height": "11", "data-astro-cid-4ve76sp7": true })}${value}d</a>`), addAttribute(dt("Statistics"), "aria-label"), STAT_TABS.map((id) => renderTemplate`<button type="button" role="tab"${addAttribute(["st-tab", { current: id === tab }], "class:list")}${addAttribute(id, "data-tab")}${addAttribute(id === tab ? "true" : "false", "aria-selected")}${addAttribute(`--tab:${tabs[id].color}`, "style")} data-astro-cid-4ve76sp7> ${renderComponent($$result2, "Icon", $$Icon, { "name": tabs[id].icon, "width": "15", "height": "15", "data-astro-cid-4ve76sp7": true })}${dt(tabs[id].label)} </button>`), tiles.map((tile, i) => {
    const chip = analysis.hasPrevious && tile.change ? chipOf(tile.change.value, tile.change.inverse) : null;
    return renderTemplate`<div class="st-tile"${addAttribute(`--m:var(--m-${tile.color});--i:${i}`, "style")} data-astro-cid-4ve76sp7> <span class="st-tile-label" data-astro-cid-4ve76sp7><i class="st-swatch" data-astro-cid-4ve76sp7></i>${dt(tile.label)}</span> <b data-astro-cid-4ve76sp7><span class="petto-num-clip" data-astro-cid-4ve76sp7><span class="petto-num" data-astro-cid-4ve76sp7>${tile.value}</span></span></b> ${tile.hint && renderTemplate`<small class="st-tile-hint" data-astro-cid-4ve76sp7>${tile.hint}</small>`} <span class="st-chips" data-astro-cid-4ve76sp7>${chip && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`<span${addAttribute(`st-chip st-chip-${chip.tone}`, "class")} data-astro-cid-4ve76sp7><b data-astro-cid-4ve76sp7>${chip.arrow ? `${chip.arrow} ` : ""}${chip.text}</b></span><small data-astro-cid-4ve76sp7>${dt("vs before")}</small>` })}`}</span> </div>`;
  }), STAT_TABS.map((id) => renderTemplate`<section${addAttribute(["st-panel", { "st-panel-hidden": id !== tab }], "class:list")}${addAttribute(id, "data-panel")} role="tabpanel"${addAttribute(`--tab:${tabs[id].color}`, "style")} data-astro-cid-4ve76sp7> ${panels[id].charts.length > 0 && renderTemplate`<div class="st-charts" data-astro-cid-4ve76sp7> ${panels[id].charts.map((c, ci) => {
    const chip = c.chip ? chipOf(c.chip.change, c.chip.inverse) : null;
    return renderTemplate`<article${addAttribute(["st-card", "st-chart", { "st-span": c.span }], "class:list")}${addAttribute(`--i:${ci}`, "style")} data-astro-cid-4ve76sp7> <div class="st-card-head" data-astro-cid-4ve76sp7> <div data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${c.title}</h2> <p${addAttribute(["st-card-sub", { "st-lit": c.sub.includes(BOT_TIME_LABEL) || c.sub.includes(dt("Busiest on")) }], "class:list")} data-astro-cid-4ve76sp7>${c.sub}</p> </div> ${chip && renderTemplate`<span${addAttribute(`st-chip st-chip-${chip.tone}`, "class")} data-astro-cid-4ve76sp7><b data-astro-cid-4ve76sp7>${chip.arrow ? `${chip.arrow} ` : ""}${chip.text}</b><em data-astro-cid-4ve76sp7>${dt("vs previous period")}</em></span>`} </div> ${c.summary && renderTemplate`<dl class="st-summary" data-astro-cid-4ve76sp7>${c.summary.map((cell) => renderTemplate`<div data-astro-cid-4ve76sp7><dt data-astro-cid-4ve76sp7>${cell.label}</dt><dd data-astro-cid-4ve76sp7>${cell.value}${cell.sub && renderTemplate`<small data-astro-cid-4ve76sp7>${cell.sub}</small>`}</dd></div>`)}</dl>`} ${c.html && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`<div class="st-var st-var-s" data-astro-cid-4ve76sp7>${unescapeHTML(c.html.s)}</div><div class="st-var st-var-m" data-astro-cid-4ve76sp7>${unescapeHTML(c.html.m)}</div><div class="st-var st-var-l" data-astro-cid-4ve76sp7>${unescapeHTML(c.html.l)}</div>` })}`} ${c.message && renderTemplate`<p${addAttribute(["st-empty", { "st-empty-box": !c.html }], "class:list")} data-astro-cid-4ve76sp7>${c.message}</p>`} </article>`;
  })} </div>`} ${tables[id].rows.length > 0 && renderTemplate`<article class="st-card st-daily" data-st-daily data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Day by day")}</h2> <div class="st-table-scroll" tabindex="0" role="region"${addAttribute(dt("Day by day"), "aria-label")} data-astro-cid-4ve76sp7> <table class="st-table" data-astro-cid-4ve76sp7> <thead data-astro-cid-4ve76sp7> <tr data-astro-cid-4ve76sp7> <th scope="col" data-astro-cid-4ve76sp7>${dt("Day")}</th> ${tables[id].columns.map((key) => renderTemplate`<th scope="col"${addAttribute(`--m:var(--m-${COLUMN_COLOR[key]})`, "style")} data-astro-cid-4ve76sp7><i class="st-swatch" data-astro-cid-4ve76sp7></i>${dt(COLUMN_LABEL[key])}</th>`)} </tr> </thead> <tbody data-astro-cid-4ve76sp7> ${tables[id].rows.map((row, i) => renderTemplate`<tr${addAttribute({ "st-today": row.today, "st-extra": i >= TABLE_ROWS }, "class:list")} data-astro-cid-4ve76sp7> ${row.today ? renderTemplate`<th scope="row" data-astro-cid-4ve76sp7>${dt("Today")}<small data-astro-cid-4ve76sp7>${dt("so far")}</small></th>` : renderTemplate`<th scope="row" data-astro-cid-4ve76sp7>${dayText(row.day, { weekday: "short", month: "short", day: "numeric" })}</th>`} ${tables[id].columns.map((key) => {
    const cell = row.cells[key];
    return cell ? renderTemplate`<td data-astro-cid-4ve76sp7><span class="st-v"${addAttribute(key === "voice" ? inARow(cell.value) || void 0 : void 0, "title")} data-astro-cid-4ve76sp7>${cellText(key, cell.value)}</span>${cell.change !== null && renderTemplate`<span${addAttribute(`st-d st-d-${toneOf(key, cell.change)}`, "class")} data-astro-cid-4ve76sp7> (${changeText(key, cell.change)})</span>`}</td>` : renderTemplate`<td class="st-none" data-astro-cid-4ve76sp7>–</td>`;
  })} </tr>`)} </tbody> </table> </div> ${tables[id].columns.includes("voice") && renderTemplate`<p class="st-voice-note" data-astro-cid-4ve76sp7>${dt("Voice hours add up the time of every member: 5 people for 1 hour count as 5 hours.")}</p>`} ${tables[id].rows.length > TABLE_ROWS && renderTemplate`<button type="button" class="st-more" data-st-more${addAttribute(dt("Show all {a} days", { a: tables[id].rows.length }), "data-more")}${addAttribute(dt("Show fewer days"), "data-less")} data-astro-cid-4ve76sp7>${dt("Show all {a} days", { a: tables[id].rows.length })}</button>`} </article>`} ${(id === "heatmap" || id === "compare" || id === "data") && renderTemplate`${renderComponent($$result2, "DashStatsAnalysis", $$DashStatsAnalysis, { "id": id, "analysis": analysis, "rules": rules, "flash": dataMessage, "data-astro-cid-4ve76sp7": true })}`} <div class="st-lists" data-astro-cid-4ve76sp7> ${(id === "overview" || id === "messages") && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <article class="st-card st-list" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Top channels")}</h2> ${stats.topChannels.messages.length ? renderTemplate`<ol data-astro-cid-4ve76sp7>${stats.topChannels.messages.map((row, i) => renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${i + 1}</span><b data-astro-cid-4ve76sp7><span class="st-ch-pill" data-astro-cid-4ve76sp7>${channelName(row.id)}</span></b><em data-astro-cid-4ve76sp7>${n(row.messages)}</em></li>`)}</ol>` : renderTemplate`<p class="st-empty" data-astro-cid-4ve76sp7>${dt("Nothing counted yet for this period.")}</p>`} </article> <article class="st-card st-list" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Top members")}</h2> ${stats.topMembers.messages.length ? renderTemplate`<ol data-astro-cid-4ve76sp7>${stats.topMembers.messages.map((row, i) => renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${i + 1}</span><b data-astro-cid-4ve76sp7>${memberName(row.id)}</b><em data-astro-cid-4ve76sp7>${n(row.messages)}</em></li>`)}</ol>` : renderTemplate`<p class="st-empty" data-astro-cid-4ve76sp7>${dt("Nothing counted yet for this period.")}</p>`} </article> ` })}`} ${id === "voice" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <article class="st-card st-list" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Top voice channels")}</h2> ${stats.topChannels.voice.length ? renderTemplate`<ol data-astro-cid-4ve76sp7>${stats.topChannels.voice.map((row, i) => renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${i + 1}</span><b data-astro-cid-4ve76sp7><span class="st-ch-pill" data-astro-cid-4ve76sp7>${channelName(row.id)}</span></b><em data-astro-cid-4ve76sp7>${hoursText(row.voiceSeconds)}</em></li>`)}</ol>` : renderTemplate`<p class="st-empty" data-astro-cid-4ve76sp7>${dt("Nothing counted yet for this period.")}</p>`} </article> <article class="st-card st-list" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Top in voice")}</h2> ${stats.topMembers.voice.length ? renderTemplate`<ol data-astro-cid-4ve76sp7>${stats.topMembers.voice.map((row, i) => renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${i + 1}</span><b data-astro-cid-4ve76sp7>${memberName(row.id)}</b><em data-astro-cid-4ve76sp7>${hoursText(row.voiceSeconds)}</em></li>`)}</ol>` : renderTemplate`<p class="st-empty" data-astro-cid-4ve76sp7>${dt("Nothing counted yet for this period.")}</p>`} </article> ` })}`} ${(id === "joins" || id === "leaves" || id === "invites" || id === "growth") && renderTemplate`<article class="st-card st-list" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Growth")}</h2> <ol data-astro-cid-4ve76sp7> <li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt("Net members")}</b><em data-astro-cid-4ve76sp7>${growth >= 0 ? "+" : ""}${n(growth)}</em></li> <li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-plus-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt("Joined")}</b><em data-astro-cid-4ve76sp7>${n(stats.totals.joins)}</em></li> <li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-minus-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt("Left")}</b><em data-astro-cid-4ve76sp7>${n(stats.totals.leaves)}</em></li> <li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:link-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt("Through invites")}</b><em data-astro-cid-4ve76sp7>${n(stats.totals.invited)}${stats.totals.joins ? ` (${Math.round(stats.totals.invited / stats.totals.joins * 100)}%)` : ""}</em></li> ${id === "joins" && bestJoin && renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:calendar-check-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt("Best day")}</b><em data-astro-cid-4ve76sp7>${dayLabel(bestJoin.day)} · ${n(bestJoin.value)}</em></li>`} ${id === "leaves" && bestLeave && renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:calendar-check-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt("Best day")}</b><em data-astro-cid-4ve76sp7>${dayLabel(bestLeave.day)} · ${n(bestLeave.value)}</em></li>`} ${id === "invites" && bestInvite && renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:calendar-check-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt("Best day")}</b><em data-astro-cid-4ve76sp7>${dayLabel(bestInvite.day)} · ${n(bestInvite.value)}</em></li>`} </ol> ${!hasFlow && renderTemplate`<p class="st-empty" data-astro-cid-4ve76sp7>${dt("Joins and leaves are counted from the moment this was added.")}</p>`} </article>`} ${id === "invites" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <article class="st-card st-list st-inv-top" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Top inviters")}</h2> <div class="st-inv-periods" role="group"${addAttribute(dt("Period"), "aria-label")} data-astro-cid-4ve76sp7> ${periodLinks.map((link) => renderTemplate`<a${addAttribute(`/dash/guild/${guildId}/stats?days=${days}&tab=invites&ip=${link.value}`, "href")}${addAttribute(["st-range-link", { current: link.value === invitePeriod }], "class:list")} data-keep-tab${addAttribute(link.value === invitePeriod ? "true" : void 0, "aria-current")} data-astro-cid-4ve76sp7>${link.label}</a>`)} </div> ${inviters.length ? renderTemplate`<ol data-astro-cid-4ve76sp7>${inviters.map((row, i) => renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${i + 1}</span><b data-astro-cid-4ve76sp7><a${addAttribute(`/dash/guild/${guildId}/stats?days=${days}&tab=invites&ip=${invitePeriod}&member=${row.id}`, "href")} data-keep-tab${addAttribute(dt("Look up a member"), "title")} data-astro-cid-4ve76sp7>${memberName(row.id)}</a><small data-astro-cid-4ve76sp7>${inviterLine(row)}</small></b><em data-astro-cid-4ve76sp7>${n(row.net)}</em></li>`)}</ol>` : renderTemplate`<p class="st-empty" data-astro-cid-4ve76sp7>${dt("No tracked invites yet.")}</p>`} ${invitePeriod !== "all" && renderTemplate`<p class="st-inv-note" data-astro-cid-4ve76sp7>${dt("A week or a month counts the members brought in during it. Fake joins and bonus invites are left out.")}</p>`} </article> <article class="st-card st-inv-member" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Look up a member")}</h2> <form method="GET" class="st-inv-form st-inv-find" data-no-dirty role="search" data-astro-cid-4ve76sp7> <input type="hidden" name="days"${addAttribute(days, "value")} data-astro-cid-4ve76sp7><input type="hidden" name="tab" value="invites" data-astro-cid-4ve76sp7><input type="hidden" name="ip"${addAttribute(invitePeriod, "value")} data-astro-cid-4ve76sp7> <div class="st-inv-field st-inv-grow" data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${dt("Member")}</span>${renderComponent($$result3, "DashMemberPick", $$DashMemberPick, { "guildId": guildId, "name": "member", "data-astro-cid-4ve76sp7": true })}</div> <button type="submit" class="btn btn-accent btn-sm" data-astro-cid-4ve76sp7>${dt("Look up")}</button> </form> ${inviteMember ? renderTemplate`<div class="st-inv-found" data-astro-cid-4ve76sp7> <p class="st-inv-who" data-astro-cid-4ve76sp7><b data-astro-cid-4ve76sp7>${memberName(inviteMember.id)}</b><a${addAttribute(`/dash/guild/${guildId}/stats?days=${days}&tab=invites&ip=${invitePeriod}`, "href")} data-keep-tab data-astro-cid-4ve76sp7>${dt("Clear")}</a></p> <dl class="st-inv-numbers" data-astro-cid-4ve76sp7> <div data-astro-cid-4ve76sp7><dt data-astro-cid-4ve76sp7>${dt("Joined")}</dt><dd data-astro-cid-4ve76sp7>${n(inviteMember.joins)}</dd></div> <div data-astro-cid-4ve76sp7><dt data-astro-cid-4ve76sp7>${dt("Left")}</dt><dd data-astro-cid-4ve76sp7>${n(inviteMember.leaves)}</dd></div> <div data-astro-cid-4ve76sp7><dt data-astro-cid-4ve76sp7>${dt("Fake")}</dt><dd data-astro-cid-4ve76sp7>${n(inviteMember.fake)}</dd></div> <div data-astro-cid-4ve76sp7><dt data-astro-cid-4ve76sp7>${dt("Bonus")}</dt><dd data-astro-cid-4ve76sp7>${n(inviteMember.bonus)}</dd></div> <div class="st-inv-total" data-astro-cid-4ve76sp7><dt data-astro-cid-4ve76sp7>${dt("Total")}</dt><dd data-astro-cid-4ve76sp7>${n(inviteMember.total)}</dd></div> </dl> <h3 data-astro-cid-4ve76sp7>${dt("Invited by")}</h3> ${inviteMember.invitedBy ? renderTemplate`<p class="st-inv-note st-inv-by" data-astro-cid-4ve76sp7> <b data-astro-cid-4ve76sp7>${inviteMember.invitedBy.id ? memberName(inviteMember.invitedBy.id) : dt("Unknown")}</b> ${" "}${dt("through {a}", { a: sourceText(inviteMember.invitedBy.source) })}${inviteMember.invitedBy.code ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-4ve76sp7": true }, { "default": async ($$result4) => renderTemplate` · <code data-astro-cid-4ve76sp7>${inviteMember.invitedBy.code}</code>` })}` : null} ${inviteMember.invitedBy.joinedAt ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-4ve76sp7": true }, { "default": async ($$result4) => renderTemplate` · ${whenText(inviteMember.invitedBy.joinedAt)}` })}` : null} ${inviteMember.invitedBy.fake ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "data-astro-cid-4ve76sp7": true }, { "default": async ($$result4) => renderTemplate` · ${dt("counted as a fake join")}` })}` : null} </p>` : renderTemplate`<p class="st-inv-note" data-astro-cid-4ve76sp7>${dt("Petto has no record of who invited this member.")}</p>`} <h3 data-astro-cid-4ve76sp7>${dt("Codes used to bring people in")}</h3> ${inviteMember.codes.length ? renderTemplate`<ul class="st-inv-codes" data-astro-cid-4ve76sp7>${inviteMember.codes.map((row) => renderTemplate`<li data-astro-cid-4ve76sp7><code data-astro-cid-4ve76sp7>${row.code}</code><em data-astro-cid-4ve76sp7>${dt("{a} joined, {b} left, {c} fake", { a: n(row.joins), b: n(row.left), c: n(row.fake) })}</em></li>`)}</ul>` : renderTemplate`<p class="st-inv-note" data-astro-cid-4ve76sp7>${dt("This member has not brought anybody in with a link.")}</p>`} </div>` : renderTemplate`<p class="st-inv-note" data-astro-cid-4ve76sp7>${dt("Search a member to see their invites, who invited them and the codes they used.")}</p>`} </article> ` })}`} ${id === "sanctions" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <article class="st-card st-list" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Sanctions")}</h2> <ol data-astro-cid-4ve76sp7> <li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:gavel-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt("Total")}</b><em data-astro-cid-4ve76sp7>${n(stats.sanctions.total)}</em></li> ${kindNames.map((name, i) => renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${i + 1}</span><b data-astro-cid-4ve76sp7>${dt(name)}</b><em data-astro-cid-4ve76sp7>${n(kindValues[i])}</em></li>`)} <li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:arrow-counter-clockwise-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt("Undone")}</b><em data-astro-cid-4ve76sp7>${n(stats.sanctions.byGroup.undone)}</em></li> </ol> </article> <article class="st-card st-list" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Applied by")}</h2> ${sourceRows.length ? renderTemplate`<ol data-astro-cid-4ve76sp7>${sourceRows.map(([key, count]) => renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:robot-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt(sourceNames[key] ?? key)}</b><em data-astro-cid-4ve76sp7>${n(count)}</em></li>`)}</ol>` : renderTemplate`<p class="st-empty" data-astro-cid-4ve76sp7>${dt("Nothing counted yet for this period.")}</p>`} </article> <article class="st-card st-list" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Most active moderators")}</h2> ${stats.sanctions.topModerators.length ? renderTemplate`<ol data-astro-cid-4ve76sp7>${stats.sanctions.topModerators.map((row, i) => renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${i + 1}</span><b data-astro-cid-4ve76sp7>${memberName(row.id)}</b><em data-astro-cid-4ve76sp7>${n(row.count)}</em></li>`)}</ol>` : renderTemplate`<p class="st-empty" data-astro-cid-4ve76sp7>${dt("Nothing counted yet for this period.")}</p>`} </article> <article class="st-card st-list" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Most sanctioned")}</h2> ${stats.sanctions.topUsers.length ? renderTemplate`<ol data-astro-cid-4ve76sp7>${stats.sanctions.topUsers.map((row, i) => renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${i + 1}</span><b data-astro-cid-4ve76sp7>${memberName(row.id)}</b><em data-astro-cid-4ve76sp7>${n(row.count)}</em></li>`)}</ol>` : renderTemplate`<p class="st-empty" data-astro-cid-4ve76sp7>${dt("Nothing counted yet for this period.")}</p>`} </article> ` })}`} ${id === "overview" && stats.peakHour.messages && renderTemplate`<article class="st-card st-list" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Highlights")}</h2> <ol data-astro-cid-4ve76sp7> <li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:clock-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt("Most active hour")}</b><em data-astro-cid-4ve76sp7>${hourLabel(stats.peakHour.messages.hour)} ${BOT_TIME_LABEL}</em></li> ${bestMessage && renderTemplate`<li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:calendar-check-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt("Best day")}</b><em data-astro-cid-4ve76sp7>${dayLabel(bestMessage.day)} · ${n(bestMessage.value)}</em></li>`} <li data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:users-three-fill", "width": "14", "height": "14", "data-astro-cid-4ve76sp7": true })}</span><b data-astro-cid-4ve76sp7>${dt("Net members")}</b><em data-astro-cid-4ve76sp7>${growth >= 0 ? "+" : ""}${n(growth)}</em></li> </ol> </article>`} </div> ${id === "invites" && renderTemplate`<div class="st-inv" data-invite-settings data-astro-cid-4ve76sp7> <div class="st-inv-head" data-astro-cid-4ve76sp7> <h2 data-astro-cid-4ve76sp7>${dt("Invite settings")}</h2> <p data-astro-cid-4ve76sp7>${dt("Petto counts who brought each member in. Choose what an invite is worth: roles for reaching a number, which joins do not count, and corrections for one member. The same as /invites in Discord.")}</p> </div> ${inviteMessage && renderTemplate`<div${addAttribute(["st-flash", { "st-flash-err": inviteMessage.kind === "err" }], "class:list")}${addAttribute(inviteMessage.kind === "err" ? "alert" : "status", "role")} data-astro-cid-4ve76sp7>${inviteMessage.text}</div>`} <div class="st-inv-grid" data-astro-cid-4ve76sp7> <article class="st-card st-inv-card" data-astro-cid-4ve76sp7> <h3 data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:medal-fill", "width": "15", "height": "15", "data-astro-cid-4ve76sp7": true })}${dt("Roles for invites")} <span class="st-inv-count" data-astro-cid-4ve76sp7>${inviteSettings.rewards.length}</span></h3> ${inviteSettings.rewards.length ? renderTemplate`<ul class="st-inv-list" data-astro-cid-4ve76sp7> ${inviteSettings.rewards.map((reward) => renderTemplate`<li data-astro-cid-4ve76sp7> <span class="st-inv-role"${addAttribute(`--rc:${roleColor(reward.color)}`, "style")} data-astro-cid-4ve76sp7><i data-astro-cid-4ve76sp7></i>${reward.name ? `@${reward.name}` : dt("Deleted role")}</span> <em data-astro-cid-4ve76sp7>${dt("{a} invites", { a: n(reward.invites) })}</em> <form method="POST" data-no-dirty data-astro-cid-4ve76sp7> <input type="hidden" name="role_id"${addAttribute(reward.roleId, "value")} data-astro-cid-4ve76sp7> <button type="submit" name="action" value="invite_unreward" class="st-inv-del"${addAttribute(dt("Remove"), "aria-label")}${addAttribute(dt("Remove"), "title")}${addAttribute(dt("Stop giving this role for invites? Members who have it keep it."), "data-confirm")} data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "13", "height": "13", "data-astro-cid-4ve76sp7": true })}</button> </form> </li>`)} </ul>` : renderTemplate`<p class="st-inv-empty" data-astro-cid-4ve76sp7>${dt("No roles for invites yet. Pick a role and how many invites earn it: Petto gives it when someone reaches the number and takes it back if they fall below.")}</p>`} <form method="POST" class="st-inv-form" data-no-dirty data-astro-cid-4ve76sp7> <label class="st-inv-field st-inv-grow" data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${dt("Role")}</span> <select name="role_id" required data-astro-cid-4ve76sp7> <option value="" data-astro-cid-4ve76sp7>${dt("Choose a role")}</option> ${inviteRoles.map((role) => renderTemplate`<option${addAttribute(role.id, "value")} data-astro-cid-4ve76sp7>${role.name}${rewardIds.has(role.id) ? ` \xB7 ${dt("change its number")}` : ""}</option>`)} </select> </label> <label class="st-inv-field st-inv-num" data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${dt("Invites")}</span><input type="number" name="invites" min="1" max="100000" value="5" required data-astro-cid-4ve76sp7></label> <button type="submit" name="action" value="invite_reward" class="btn btn-accent btn-sm" data-astro-cid-4ve76sp7>${dt("Add role")}</button> </form> <p class="st-inv-note" data-astro-cid-4ve76sp7>${dt("The role must be below the highest role of Petto. Members who already have enough invites get it right away.")}</p> </article> <article class="st-card st-inv-card st-inv-settings" data-astro-cid-4ve76sp7> <h3 data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:gear-six-fill", "width": "15", "height": "15", "data-astro-cid-4ve76sp7": true })}${dt("Settings")}</h3> <p class="st-inv-note" data-astro-cid-4ve76sp7>${dt("A join from a very new account, or from someone who had already been in the server, does not count as an invite.")}</p> <form method="POST" class="st-inv-stack" data-no-dirty data-astro-cid-4ve76sp7> ${extended && renderTemplate`<input type="hidden" name="extended" value="1" data-astro-cid-4ve76sp7>`} <label class="st-inv-field" data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${dt("Accounts younger than (days)")}</span><input type="number" name="days" min="0" max="365" step="1" inputmode="numeric"${addAttribute(inviteSettings.fakeDays, "value")} required data-astro-cid-4ve76sp7></label> <p class="st-inv-note" data-astro-cid-4ve76sp7>${inviteSettings.fakeDays ? dt("Now: accounts younger than {a} are fake joins.", { a: formatDuration(inviteSettings.fakeDays * 86400, { locale: numLocale }) }) : dt("Now: only members who come back are fake joins.")} ${dt("With 0, a new account counts like any other.")}</p> ${extended && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <label class="st-inv-field" data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${dt("Leaves quickly (minutes)")}</span><input type="number" name="quick_leave_minutes" min="0" max="1440" step="1" inputmode="numeric"${addAttribute(inviteSettings.quickLeaveMinutes ?? 0, "value")} required data-astro-cid-4ve76sp7></label> <p class="st-inv-note" data-astro-cid-4ve76sp7>${dt("A member who leaves within this many minutes of joining counts as a fake join, so the invite is not credited. 0 turns it off.")}</p> <label class="st-inv-check" data-astro-cid-4ve76sp7><input type="checkbox" name="ignore_bots"${addAttribute(Boolean(inviteSettings.ignoreBots), "checked")} data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${dt("Ignore bot accounts")}</span></label> <p class="st-inv-note" data-astro-cid-4ve76sp7>${dt("Bot accounts are written down but never credited to anybody.")}</p> <label class="st-inv-check" data-astro-cid-4ve76sp7><input type="checkbox" name="subtract_leaves"${addAttribute(inviteSettings.subtractLeaves !== false, "checked")} data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${dt("Take away members who left")}</span></label> <p class="st-inv-note" data-astro-cid-4ve76sp7>${dt("The total is the members who joined, minus those who left, plus the bonus. Turn it off to keep them in the total.")}</p> ` })}`} <div class="st-inv-actions" data-astro-cid-4ve76sp7><button type="submit" name="action" value="invite_settings" class="btn btn-accent btn-sm" data-astro-cid-4ve76sp7>${dt("Save settings")}</button></div> </form> </article> <article class="st-card st-inv-card" data-astro-cid-4ve76sp7> <h3 data-astro-cid-4ve76sp7>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:sliders-horizontal-fill", "width": "15", "height": "15", "data-astro-cid-4ve76sp7": true })}${dt("Adjust the invites of a member")}</h3> <p class="st-inv-note" data-astro-cid-4ve76sp7>${dt("Bonus invites add to (or, negative, take from) what Petto counted, for events or invites it could not see. Reward roles follow the new number.")}</p> <form method="POST" class="st-inv-form st-inv-adjust" data-no-dirty data-astro-cid-4ve76sp7> <div class="st-inv-field st-inv-grow" data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${dt("Member")}</span>${renderComponent($$result2, "DashMemberPick", $$DashMemberPick, { "guildId": guildId, "name": "member_id", "data-astro-cid-4ve76sp7": true })}</div> <label class="st-inv-field st-inv-num" data-astro-cid-4ve76sp7><span data-astro-cid-4ve76sp7>${dt("Bonus")}</span><input type="number" name="amount" min="-100000" max="100000" step="1" value="1" data-astro-cid-4ve76sp7></label> <div class="st-inv-actions" data-astro-cid-4ve76sp7> <button type="submit" name="action" value="invite_bonus" class="btn btn-accent btn-sm" data-astro-cid-4ve76sp7>${dt("Add bonus")}</button> <button type="submit" name="action" value="invite_reset" class="btn btn-ghost btn-sm"${addAttribute(dt("Put every invite of this member back to zero? Who they invited stays on record."), "data-confirm")} data-astro-cid-4ve76sp7>${dt("Reset to zero")}</button> </div> </form> <p class="st-inv-note" data-astro-cid-4ve76sp7>${dt("Resetting needs Administrator, like the command.")}</p> </article> </div> </div>`} </section>`), renderComponent($$result2, "DashChartTip", $$DashChartTip, { "data-astro-cid-4ve76sp7": true }), renderComponent($$result2, "StatsChartStyle", $$StatsChartStyle, { "data-astro-cid-4ve76sp7": true }), renderComponent($$result2, "DashChartRange", $$DashChartRange, { "data-astro-cid-4ve76sp7": true })) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashStats.astro", void 0);

const DAY_MS = 864e5;
const dayKey = (value) => String(value).slice(0, 10);
const num$1 = (value) => Number(value ?? 0) || 0;
const sum = (values) => values.reduce((a, b) => a + b, 0);
const weekdayOf = (day) => ((/* @__PURE__ */ new Date(`${day}T00:00:00Z`)).getUTCDay() + 6) % 7;
function percentChange(now, before) {
  if (!before) return now ? null : 0;
  return Math.round((now - before) / before * 1e3) / 10;
}
const firstDayOf = (rows) => rows.reduce((first, row) => {
  const day = dayKey(row.day);
  return first === null || day < first ? day : first;
}, null);
function buildAnalysis({ days, now = /* @__PURE__ */ new Date(), channelRows, hourlyRows, flowRows, contentRows, lifespanRows }) {
  const current = rangeDays(now, days);
  const previous = rangeDays(new Date(now.getTime() - days * DAY_MS), days);
  const inCurrent = new Set(current);
  const inPrevious = new Set(previous);
  const only = (rows, set) => rows.filter((row) => set.has(dayKey(row.day)));
  const totals = (set) => {
    const channels = only(channelRows, set);
    const flows = only(flowRows, set);
    const content = only(contentRows, set);
    return {
      messages: sum(channels.map((row) => num$1(row.messages))),
      reactions: sum(channels.map((row) => num$1(row.reactions))),
      voiceSeconds: sum(channels.map((row) => num$1(row.voice_seconds))),
      joins: sum(flows.map((row) => num$1(row.joins))),
      leaves: sum(flows.map((row) => num$1(row.leaves))),
      invited: sum(flows.map((row) => num$1(row.invited))),
      links: sum(content.map((row) => num$1(row.links))),
      attachments: sum(content.map((row) => num$1(row.attachments))),
      replies: sum(content.map((row) => num$1(row.replies))),
      mentions: sum(content.map((row) => num$1(row.mentions)))
    };
  };
  const now_ = totals(inCurrent);
  const before = totals(inPrevious);
  const change = Object.fromEntries(Object.keys(now_).map((key) => [key, percentChange(now_[key], before[key])]));
  const heatmap = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const row of only(hourlyRows, inCurrent)) heatmap[weekdayOf(dayKey(row.day))][Math.max(0, Math.min(23, num$1(row.hour)))] += num$1(row.messages);
  let peak = null;
  heatmap.forEach((hours, weekday) => hours.forEach((value, hour) => {
    if (value > 0 && (!peak || value > peak.value)) peak = { weekday, hour, value };
  }));
  const byHour = Array(24).fill(0);
  const byWeekday = Array(7).fill(0);
  heatmap.forEach((hours, weekday) => hours.forEach((value, hour) => {
    byHour[hour] += value;
    byWeekday[weekday] += value;
  }));
  const hoursTotal = sum(byHour);
  const dayparts = [0, 6, 12, 18].map((from) => hoursTotal ? sum(byHour.slice(from, from + 6)) / hoursTotal : 0);
  const lifespan = Array(5).fill(0);
  for (const row of only(lifespanRows, inCurrent)) lifespan[Math.max(0, Math.min(4, num$1(row.bucket)))] += num$1(row.members);
  const lifespanTotal = sum(lifespan);
  const per100 = (key) => now_.messages ? Math.round(now_[key] / now_.messages * 1e3) / 10 : 0;
  const edge = totals(/* @__PURE__ */ new Set([previous[previous.length - 1]]));
  const counted = { activity: firstDayOf(channelRows), flow: firstDayOf(flowRows) };
  const netByDay = current.map((day) => sum(only(flowRows, /* @__PURE__ */ new Set([day])).map((row) => num$1(row.joins) - num$1(row.leaves))));
  return {
    days: current,
    now: now_,
    before,
    change,
    edge,
    counted,
    heatmap,
    peak,
    byHour,
    byWeekday,
    dayparts,
    lifespan,
    lifespanTotal,
    earlyLeaveShare: lifespanTotal ? (lifespan[0] + lifespan[1]) / lifespanTotal : null,
    content: { per100: { links: per100("links"), attachments: per100("attachments"), replies: per100("replies"), mentions: per100("mentions") }, totals: { links: now_.links, attachments: now_.attachments, replies: now_.replies, mentions: now_.mentions } },
    netByDay,
    hasPrevious: sum(Object.values(before)) > 0
  };
}
const DEFAULT_RULES = { enabled: true, members: true, content: true };
const rulesFromRow = (row) => row ? { enabled: row.enabled !== false, members: row.members_enabled !== false, content: row.content_enabled !== false } : { ...DEFAULT_RULES };
const COUNTER_TABLES = ["activity_stats", "activity_hourly", "activity_members", "member_flow", "activity_content", "member_lifespan"];

const INVITE_PERIODS = ["all", "week", "month"];
const DEFAULT_INVITE_SETTINGS = { fakeDays: 3, quickLeaveMinutes: 0, ignoreBots: false, subtractLeaves: true };
const num = (value) => Math.trunc(Number(value)) || 0;
const parseInvitePeriod = (value) => INVITE_PERIODS.includes(String(value)) ? String(value) : "all";
function inviteTotal(counts, subtractLeaves = true) {
  return num(counts.joins) - (subtractLeaves ? num(counts.leaves) : 0) + num(counts.bonus);
}
function readInviteSettings(row) {
  if (!row) return { ...DEFAULT_INVITE_SETTINGS };
  return {
    fakeDays: row.fake_days === void 0 || row.fake_days === null ? DEFAULT_INVITE_SETTINGS.fakeDays : Math.max(0, num(row.fake_days)),
    quickLeaveMinutes: Math.max(0, num(row.quick_leave_minutes)),
    ignoreBots: row.ignore_bots === true,
    subtractLeaves: row.subtract_leaves === void 0 || row.subtract_leaves === null ? true : row.subtract_leaves !== false
  };
}
function periodStart(period, now = /* @__PURE__ */ new Date()) {
  const local = new Date(now.getTime() + BOT_OFFSET_MS);
  const day = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  const start = period === "month" ? Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), 1) : day - (local.getUTCDay() + 6) % 7 * 864e5;
  return new Date(start - BOT_OFFSET_MS).toISOString();
}
const byRank = (a, b) => b.net - a.net || b.joins - a.joins;
function rankInviters(rows, subtractLeaves, limit = 10) {
  return rows.map((row) => ({ id: String(row.inviter_id), joins: num(row.joins), leaves: num(row.leaves), fake: num(row.fake), bonus: num(row.bonus) })).filter((row) => row.joins || row.leaves || row.bonus).map((row) => ({ ...row, net: inviteTotal(row, subtractLeaves) })).sort(byRank).slice(0, limit);
}
function groupPeriod(rows) {
  const byInviter = /* @__PURE__ */ new Map();
  for (const row of rows) {
    if (!row.inviter_id) continue;
    const id = String(row.inviter_id);
    const entry = byInviter.get(id) ?? { inviter_id: id, joins: 0, leaves: 0 };
    entry.joins += 1;
    if (row.left_at) entry.leaves += 1;
    byInviter.set(id, entry);
  }
  return [...byInviter.values()];
}
function rankPeriod(grouped, subtractLeaves, limit = 10) {
  return grouped.map((row) => ({ id: String(row.inviter_id), joins: num(row.joins), leaves: num(row.leaves), fake: 0, bonus: 0 })).map((row) => ({ ...row, net: inviteTotal(row, subtractLeaves) })).sort(byRank).slice(0, limit);
}
function groupCodes(rows) {
  const byCode = /* @__PURE__ */ new Map();
  for (const row of rows) {
    if (!row.invite_code) continue;
    const code = String(row.invite_code);
    const entry = byCode.get(code) ?? { code, joins: 0, left: 0, fake: 0 };
    if (row.fake) entry.fake += 1;
    else {
      entry.joins += 1;
      if (row.left_at) entry.left += 1;
    }
    byCode.set(code, entry);
  }
  return [...byCode.values()];
}
function codeStats(grouped, limit = 8) {
  return grouped.map((row) => ({ code: String(row.code), joins: num(row.joins), left: num(row.left), fake: num(row.fake) })).sort((a, b) => b.joins + b.fake - (a.joins + a.fake) || a.code.localeCompare(b.code)).slice(0, limit);
}

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Stats = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Stats;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const premium = await hasPremiumForGuild(Astro2, session.userId, id);
  const askedDays = Number(Astro2.url.searchParams.get("days"));
  const days = FREE_STAT_DAYS.includes(askedDays) || premium && PREMIUM_STAT_DAYS.includes(askedDays) ? askedDays : 7;
  const requestedTab = Astro2.url.searchParams.get("tab") ?? "overview";
  const invitePeriod = parseInvitePeriod(Astro2.url.searchParams.get("ip"));
  const searchedMember = /^\d{15,25}$/.test(String(Astro2.url.searchParams.get("member") ?? "")) ? String(Astro2.url.searchParams.get("member")) : "";
  let tab = STAT_TABS.includes(requestedTab) ? requestedTab : searchedMember || Astro2.url.searchParams.has("ip") ? "invites" : "overview";
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}` };
  let inviteMessage = null;
  let dataMessage = null;
  if (Astro2.request.method === "POST") {
    const dashLang = getDashLang(Astro2);
    const dt = makeT(dashLang);
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const snowflake = (name) => /^\d{15,25}$/.test(String(form.get(name) ?? "")) ? String(form.get(name)) : "";
    const whole = (name) => Math.trunc(Number(form.get(name) ?? NaN));
    const whole2 = (name) => {
      const value = Math.trunc(Number(form.get(name) ?? NaN));
      return Number.isFinite(value) ? value : "invalid";
    };
    let result = null;
    if (action === "invite_reward") result = await callPettoInvites(Astro2, id, session.userId, "reward", { role_id: snowflake("role_id"), invites: whole("invites") }, dashLang);
    else if (action === "invite_unreward") result = await callPettoInvites(Astro2, id, session.userId, "unreward", { role_id: snowflake("role_id") }, dashLang);
    else if (action === "invite_fake_days") result = await callPettoInvites(Astro2, id, session.userId, "fake_days", { days: whole("days") }, dashLang);
    else if (action === "invite_settings") {
      const extended = String(form.get("extended") ?? "") === "1";
      result = await callPettoInvites(Astro2, id, session.userId, "settings", {
        fake_days: whole2("days"),
        ...extended ? { quick_leave_minutes: whole2("quick_leave_minutes"), ignore_bots: form.get("ignore_bots") === "on", subtract_leaves: form.get("subtract_leaves") === "on" } : {}
      }, dashLang);
    } else if (action === "invite_bonus") result = await callPettoInvites(Astro2, id, session.userId, "bonus", { member_id: snowflake("member_id"), amount: whole("amount") }, dashLang);
    else if (action === "invite_reset") result = await callPettoInvites(Astro2, id, session.userId, "reset", { member_id: snowflake("member_id") }, dashLang);
    if (result) tab = "invites";
    if (result) inviteMessage = { kind: result.ok ? "ok" : "err", text: result.message || (result.ok ? dt("Saved.") : dt("Petto did not answer. Try again in a moment.")) };
    if (action === "stats_rule" || action === "stats_delete") {
      tab = "data";
      const write = { ...headers, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" };
      try {
        if (action === "stats_rule") {
          const field = String(form.get("field") ?? "");
          const value = String(form.get("value") ?? "") === "on";
          const current = rulesFromRow((await rows("stats_config", "enabled,members_enabled,content_enabled"))[0]);
          if (!(field in current)) throw new Error("field");
          const next = { ...current, [field]: value };
          const res = await fetch(`${apiUrl}/rest/v1/stats_config?on_conflict=guild_id`, { method: "POST", headers: write, body: JSON.stringify({ guild_id: id, enabled: next.enabled, members_enabled: next.members, content_enabled: next.content, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
          if (!res.ok) throw new Error(String(res.status));
          dataMessage = { kind: "ok", text: dt("Saved.") };
        } else {
          for (const table of COUNTER_TABLES) {
            const res = await fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}`, { method: "DELETE", headers: { ...headers, Prefer: "return=minimal" } });
            if (!res.ok) throw new Error(`${table} ${res.status}`);
          }
          dataMessage = { kind: "ok", text: dt("Every counter of this server was deleted.") };
        }
      } catch {
        dataMessage = { kind: "err", text: dt("Petto did not answer. Try again in a moment.") };
      }
    }
  }
  const since = botDay(new Date(Date.now() - (days - 1) * 864e5));
  const sincePrevious = botDay(new Date(Date.now() - (days * 2 - 1) * 864e5));
  const sinceInstant = (/* @__PURE__ */ new Date(`${since}T00:00:00-05:00`)).toISOString();
  async function rows(table, select, extra = "") {
    try {
      const res = await fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}${extra}&select=${select}`, { headers });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }
  async function inviteConfig() {
    try {
      const res = await fetch(`${apiUrl}/rest/v1/invite_config?guild_id=eq.${id}&select=fake_days,quick_leave_minutes,ignore_bots,subtract_leaves`, { headers });
      if (res.ok) {
        const data = await res.json();
        return { row: Array.isArray(data) ? data[0] : void 0, extended: true };
      }
    } catch {
    }
    return { row: (await rows("invite_config", "fake_days"))[0], extended: false };
  }
  const [guildInfo, memberTotal, channelsRes, channelRowsAll, hourlyRows, flowRowsAll, memberRows, caseRows, inviterRows, rolesRes, inviteConfigResult, rewardRows, contentRows, lifespanRows, ruleRows] = await Promise.all([
    getGuildInfo(id, botToken),
    // The members now, for the members line of the Growth tab (counted back from it). The layout reads the same number for its server menu, once per
    // request and from the bot's saved copies, so this is not another call; when it cannot be read the line is left out.
    loadDashLayoutData(Astro2, id, session).then((layout) => {
      const count = Number(layout.memberCounts.get(id));
      return Number.isFinite(count) && count > 0 ? count : null;
    }).catch(() => null),
    getGuildList(Astro2, id, botToken, "channels").catch(() => null),
    rows("activity_stats", "channel_id,day,messages,reactions,voice_seconds", `&day=gte.${sincePrevious}`),
    rows("activity_hourly", "day,hour,messages,voice_seconds", `&day=gte.${since}`),
    rows("member_flow", "day,joins,leaves,invited", `&day=gte.${sincePrevious}`),
    // Per member and day, these rows are the largest read of the page; the database adds them up per member when the site can
    // reach it (one row per member, dated on the first day of the range, which is all the page needs). Members are listed in the
    // order they first show up, as the rows were, so members with the same count keep a stable place.
    (directQuery ? directQuery(`SELECT "user_id", SUM("messages") AS "messages", SUM("voice_seconds") AS "voice_seconds", $3::text AS "day" FROM "public"."activity_members" WHERE "guild_id" = $1 AND "day" >= $2 GROUP BY "user_id" ORDER BY MIN("day"), "user_id"`, [id, since, since]) : Promise.resolve(null)).then((summed) => summed ?? rows("activity_members", "day,user_id,messages,voice_seconds", `&day=gte.${since}`)),
    rows("mod_actions", "type,source,moderator_id,user_id,created_at", `&created_at=gte.${sinceInstant}&limit=20000`),
    rows("invite_uses", "inviter_id,joins,leaves,fake,bonus", "&order=joins.desc&limit=200"),
    getGuildList(Astro2, id, botToken, "roles").catch(() => null),
    inviteConfig(),
    rows("invite_rewards", "role_id,invites", "&order=invites.asc"),
    rows("activity_content", "day,links,attachments,replies,mentions", `&day=gte.${sincePrevious}`),
    rows("member_lifespan", "day,bucket,members", `&day=gte.${since}`),
    rows("stats_config", "enabled,members_enabled,content_enabled")
  ]);
  const channelRows = channelRowsAll.filter((row) => String(row.day).slice(0, 10) >= since);
  const flowRows = flowRowsAll.filter((row) => String(row.day).slice(0, 10) >= since);
  const analysis = buildAnalysis({ days, channelRows: channelRowsAll, hourlyRows, flowRows: flowRowsAll, contentRows, lifespanRows });
  const rules = rulesFromRow(ruleRows[0]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const botId = getEnv(Astro2, "DISCORD_CLIENT_ID") || null;
  const stats = buildStats({ days, channelRows, hourlyRows, flowRows, memberRows, caseRows, botId });
  const channels = channelsRes && channelsRes.ok ? await channelsRes.json().catch(() => []) : [];
  const channelNames = Object.fromEntries(channels.map((c) => [c.id, c.name]));
  const inviteValues = readInviteSettings(inviteConfigResult.row);
  const periodRows = invitePeriod === "all" ? [] : (directQuery ? await directQuery(`SELECT "inviter_id", COUNT(*)::int AS "joins", (COUNT(*) FILTER (WHERE "left_at" IS NOT NULL))::int AS "leaves" FROM "public"."member_invites" WHERE "guild_id" = $1 AND "inviter_id" IS NOT NULL AND NOT "fake" AND "joined_at" >= $2 GROUP BY "inviter_id" ORDER BY COUNT(*) DESC LIMIT 200`, [id, periodStart(invitePeriod)]).catch(() => null) : null) ?? groupPeriod(await rows("member_invites", "inviter_id,left_at", `&fake=eq.false&inviter_id=not.is.null&joined_at=gte.${periodStart(invitePeriod)}&limit=1000`));
  const inviters = invitePeriod === "all" ? rankInviters(inviterRows, inviteValues.subtractLeaves, 10) : rankPeriod(periodRows, inviteValues.subtractLeaves, 10);
  const [memberCountRows, memberJoinRows, memberCodeRows] = searchedMember ? await Promise.all([
    rows("invite_uses", "joins,leaves,fake,bonus", `&inviter_id=eq.${searchedMember}`),
    rows("member_invites", "inviter_id,invite_code,source,fake,joined_at,left_at", `&user_id=eq.${searchedMember}`),
    (directQuery ? directQuery(`SELECT "invite_code" AS "code", (COUNT(*) FILTER (WHERE NOT "fake"))::int AS "joins", (COUNT(*) FILTER (WHERE NOT "fake" AND "left_at" IS NOT NULL))::int AS "left", (COUNT(*) FILTER (WHERE "fake"))::int AS "fake" FROM "public"."member_invites" WHERE "guild_id" = $1 AND "inviter_id" = $2 AND "invite_code" IS NOT NULL GROUP BY "invite_code" ORDER BY COUNT(*) DESC LIMIT 8`, [id, searchedMember]).catch(() => null) : Promise.resolve(null)).then(async (grouped) => grouped ?? groupCodes(await rows("member_invites", "invite_code,fake,left_at", `&inviter_id=eq.${searchedMember}&limit=1000`)))
  ]) : [[], [], []];
  const memberCounts = { joins: Number(memberCountRows[0]?.joins) || 0, leaves: Number(memberCountRows[0]?.leaves) || 0, fake: Number(memberCountRows[0]?.fake) || 0, bonus: Number(memberCountRows[0]?.bonus) || 0 };
  const invitedBy = memberJoinRows[0] ?? null;
  const inviteMember = searchedMember ? {
    id: searchedMember,
    ...memberCounts,
    total: inviteTotal(memberCounts, inviteValues.subtractLeaves),
    invitedBy: invitedBy ? { id: invitedBy.inviter_id ? String(invitedBy.inviter_id) : null, code: invitedBy.invite_code ? String(invitedBy.invite_code) : null, source: String(invitedBy.source ?? "invite"), fake: Boolean(invitedBy.fake), joinedAt: invitedBy.joined_at ? String(invitedBy.joined_at) : null } : null,
    codes: codeStats(memberCodeRows, 8)
  } : null;
  const wanted = [...new Set([...stats.topMembers.messages, ...stats.topMembers.voice, ...stats.sanctions.topModerators, ...stats.sanctions.topUsers].map((m) => m.id).concat(inviters.map((i) => i.id), inviteMember ? [inviteMember.id, ...inviteMember.invitedBy?.id ? [inviteMember.invitedBy.id] : []] : []))].slice(0, 30);
  const memberNames = {};
  const profiles = await getMemberProfiles(Astro2, id, wanted, botToken, { fallback: "user", userId: session.userId });
  for (const [userId, profile] of profiles) if (profile) memberNames[userId] = profile.globalName || profile.username || userId;
  const hasFlow = flowRows.length > 0;
  const allRoles = rolesRes && rolesRes.ok ? await rolesRes.json().catch(() => []) : [];
  const roleById = new Map(allRoles.map((role) => [String(role.id), role]));
  const inviteRoles = allRoles.filter((role) => role.name !== "@everyone" && !role.managed).sort((a, b) => b.position - a.position).map((role) => ({ id: String(role.id), name: String(role.name), color: Number(role.color) || 0 }));
  const inviteSettings = {
    ...inviteValues,
    extended: inviteConfigResult.extended,
    rewards: rewardRows.map((row) => {
      const role = roleById.get(String(row.role_id));
      return { roleId: String(row.role_id), invites: Number(row.invites) || 0, name: role ? String(role.name) : null, color: role ? Number(role.color) || 0 : 0 };
    })
  };
  return renderTemplate`${renderComponent($$result, "DashStats", $$DashStats, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "stats": stats, "days": days, "tab": tab, "channelNames": channelNames, "memberNames": memberNames, "inviters": inviters, "hasFlow": hasFlow, "premium": premium, "inviteRoles": inviteRoles, "inviteSettings": inviteSettings, "invitePeriod": invitePeriod, "inviteMember": inviteMember, "inviteMessage": inviteMessage, "analysis": analysis, "rules": rules, "dataMessage": dataMessage, "memberTotal": memberTotal })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/stats.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/stats.astro";
const $$url = "/dash/guild/[id]/stats";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Stats,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
