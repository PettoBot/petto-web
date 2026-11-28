import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute, F as Fragment } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$SxNumber } from '../../../../chunks/SxNumber_YL4vNksH.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { P as PREMIUM_LIMITS, F as FREE_LIMITS, p as planLimits } from '../../../../chunks/planLimits_BFQNR8Tb.mjs';
import { r as rangeDays, b as botDay } from '../../../../chunks/activityStats_DxqJGP6E.mjs';
import { f as formatDuration } from '../../../../chunks/formatDuration_w2_MFD16.mjs';
/* empty css                                          */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { i as isV2Data } from '../../../../chunks/embedSchema_Bj4vwR3q.mjs';
import { g as guildHasPremium } from '../../../../chunks/guildPremium_CRr06_t0.mjs';
import { g as getMemberProfiles, m as memberAvatarUrl } from '../../../../chunks/memberNames_skiCoAs8.mjs';
import { w as withinBudget } from '../../../../chunks/liveCall_BSZ7MViH.mjs';
import { c as periodStartInstant } from '../../../../chunks/dashDays_BDYG_Ap4.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashTools = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashTools;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, section, uploads, requests, reviews, openRequests, uploadStats, channels, roles, embedTemplates, uploadChannelLimit, premium, ready, saved, notice, people = {}, reviewStats = { total: 0, average: 0, members: 0 }, reviewList = [], requestCounts = { open: 0, claimed: 0, total: 0, capped: false } } = Astro2.props;
  const who = (userId) => people[userId] ?? { id: userId, name: null, avatar: `https://cdn.discordapp.com/embed/avatars/${Number(userId || 0) % 6}.png` };
  const stars = (count) => "\u2605".repeat(count) + "\u2606".repeat(5 - count);
  const textChannels = channels.filter((ch) => ch.text);
  const titles = { uploads: "Uploads", requests: "Requests", reviews: "Reviews and profiles" };
  const nowMs = Date.now();
  const ago = (iso) => {
    const diff = nowMs - Date.parse(iso);
    if (!Number.isFinite(diff)) return "";
    return dt("{a} ago", { a: formatDuration(Math.max(0, diff) / 1e3, { locale: dashLang }) });
  };
  const dayKeys = rangeDays(/* @__PURE__ */ new Date(), 14);
  const bars = (values = []) => {
    const top = Math.max(1, ...values);
    return dayKeys.map((key, i) => ({
      n: values[i] ?? 0,
      height: values[i] ? Math.max(6, Math.round(values[i] / top * 100)) : 3,
      day: Number(key.slice(8)),
      name: (/* @__PURE__ */ new Date(`${key}T12:00:00Z`)).toLocaleDateString(dashLang, { day: "numeric", month: "short", timeZone: "UTC" })
    }));
  };
  const sumOf = (values = []) => values.reduce((a, b) => a + b, 0);
  const uploadBars = bars(uploadStats.days);
  const uploads14 = sumOf(uploadStats.days);
  const boardTop = Math.max(1, ...uploadStats.board.map((entry) => entry.count));
  const reviewBars = bars(reviewStats.days);
  const reviews14 = sumOf(reviewStats.days);
  const starRows = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviewStats.stars?.[n - 1] ?? 0 }));
  const starsTop = Math.max(1, ...starRows.map((row) => row.count));
  const openNow = Math.max(requestCounts.open, openRequests.filter((req) => req.status === "open").length);
  const claimedNow = Math.max(requestCounts.claimed, openRequests.filter((req) => req.status === "claimed").length);
  const requestsAll = Math.max(requestCounts.total, openNow + claimedNow);
  const weekChange = reviewStats.weekBefore === void 0 || reviewStats.weekBefore === null ? void 0 : reviewStats.weekBefore > 0 ? Math.round(((reviewStats.week ?? 0) - reviewStats.weekBefore) / reviewStats.weekBefore * 100) : (reviewStats.week ?? 0) > 0 ? null : void 0;
  const moduleOn = section === "uploads" ? uploads.enabled : section === "requests" ? requests.enabled : reviews.enabled;
  const moreOpen = openNow + claimedNow > openRequests.length;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": section, "pageTitle": titles[section], "data-astro-cid-b4gbmzoh": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-b4gbmzoh": true })} ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-b4gbmzoh": true })} ${maybeRenderHead()}<div class="sx-page tl" data-astro-cid-b4gbmzoh> <h1 class="sx-title" data-astro-cid-b4gbmzoh>${dt(titles[section])}<span${addAttribute(["sx-pill-state", { on: moduleOn }], "class:list")} data-astro-cid-b4gbmzoh>${moduleOn ? dt("On") : dt("Off")}</span></h1> ${section !== "reviews" && renderTemplate`${renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": textChannels, "vars": section === "requests" ? [{ tok: "{request.number}", desc: dt("Number of the request") }, { tok: "{request.text}", desc: dt("Text of the request") }, { tok: "{request.link}", desc: dt("Link of the request") }, { tok: "{request.channel}", desc: dt("Channel of the request") }] : [], "data-astro-cid-b4gbmzoh": true })}`} ${saved && renderTemplate`<div class="sx-flash" data-astro-cid-b4gbmzoh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-b4gbmzoh": true })}${dt("Saved.")}</div>`} ${notice === "channel_limit" && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-b4gbmzoh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-b4gbmzoh": true })}${dt("Only the first {a} channels were kept. Premium raises the limit.", { a: uploadChannelLimit })}</div>`} ${notice === "premium_timeout" && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-b4gbmzoh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-b4gbmzoh": true })}${dt("Sending a claimed request back to open by itself is a Premium feature.")}</div>`} ${notice === "review_deleted" && renderTemplate`<div class="sx-flash" data-astro-cid-b4gbmzoh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-b4gbmzoh": true })}${dt("The review was deleted. The profile of the member counts only the ones left.")}</div>`} ${notice === "review_failed" && renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-b4gbmzoh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-b4gbmzoh": true })}${dt("The review could not be deleted. Try again in a moment.")}</div>`} ${!ready && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-b4gbmzoh>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-b4gbmzoh": true })}${dt("This arrives with the next Petto update.")}</div>`} ${section === "uploads" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-b4gbmzoh": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Today"), value: uploadStats.today ?? 0, tone: "messages" },
    { label: dt("This week"), value: uploadStats.week, tone: "joins" },
    uploadStats.capped ? { label: dt("All time"), value: uploadStats.total, text: `${uploadStats.total.toLocaleString(dashLang)}+`, tone: "invites" } : { label: dt("All time"), value: uploadStats.total, tone: "invites" },
    { label: dt("Upload channels"), value: uploads.channelIds.length, tone: "voice" }
  ], "data-astro-cid-b4gbmzoh": true })} <div class="tl-cols" data-astro-cid-b4gbmzoh> <form method="POST" class="sx-stack tl-form" data-astro-cid-b4gbmzoh> <input type="hidden" name="action" value="save_uploads" data-astro-cid-b4gbmzoh> <label class="sx-switch sx-master" data-astro-cid-b4gbmzoh><input type="checkbox" name="enabled"${addAttribute(uploads.enabled, "checked")} data-astro-cid-b4gbmzoh><span class="sx-switch-text" data-astro-cid-b4gbmzoh><b data-astro-cid-b4gbmzoh>${dt("Count uploads")}</b><em data-astro-cid-b4gbmzoh>${dt("Petto counts the messages with files in the channels below.")}</em></span><i class="sx-toggle" data-astro-cid-b4gbmzoh></i></label> <section class="sx-panel" data-sx-needs="enabled" data-astro-cid-b4gbmzoh> <div class="sx-panel-head" data-astro-cid-b4gbmzoh><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:hash-fill", "width": "17", "height": "17", "data-astro-cid-b4gbmzoh": true })}</span><h2 data-astro-cid-b4gbmzoh>${dt("Channels and role")}</h2></div> <div class="sx-field" data-astro-cid-b4gbmzoh><span class="sx-label" data-astro-cid-b4gbmzoh>${dt("Upload channels")}</span> ${renderComponent($$result3, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "channel_ids", "options": channels.map((ch) => ({ id: ch.id, name: `#${ch.name}` })), "selected": uploads.channelIds, "placeholder": dt("Search channels..."), "data-astro-cid-b4gbmzoh": true })} <span class="sx-hint" data-astro-cid-b4gbmzoh>${dt("Free servers can have {a}, Premium {b}.", { a: FREE_LIMITS.uploadChannels, b: PREMIUM_LIMITS.uploadChannels })}</span></div> <div class="sx-field" data-astro-cid-b4gbmzoh><label for="tl-uploader" data-astro-cid-b4gbmzoh>${dt("Uploader role")}</label><select id="tl-uploader" name="uploader_role_id" data-astro-cid-b4gbmzoh><option value="" data-astro-cid-b4gbmzoh>${dt("None")}</option>${roles.map((role) => renderTemplate`<option${addAttribute(role.id, "value")}${addAttribute(role.id === uploads.uploaderRoleId, "selected")} data-astro-cid-b4gbmzoh>${role.name}</option>`)}</select><span class="sx-hint" data-astro-cid-b4gbmzoh>${dt("The first upload of a member gives them this role and sends the welcome.")}</span></div> </section> <section class="sx-panel" data-sx-needs="enabled" data-astro-cid-b4gbmzoh> <div class="sx-panel-head" data-astro-cid-b4gbmzoh><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:hand-waving-fill", "width": "17", "height": "17", "data-astro-cid-b4gbmzoh": true })}</span><h2 data-astro-cid-b4gbmzoh>${dt("Welcome at the first upload")}</h2></div> <div class="sx-field" data-astro-cid-b4gbmzoh> <textarea id="tl-welcome" name="welcome_text" class="dgl-autogrow" data-ac data-count rows="3" maxlength="2000"${addAttribute(dt("Welcome at the first upload"), "aria-label")} placeholder="Thanks for your first upload, {user.mention}! You are an uploader now." data-astro-cid-b4gbmzoh>${uploads.welcome.text}</textarea>${renderComponent($$result3, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-b4gbmzoh": true })} </div> <div class="sx-field" data-astro-cid-b4gbmzoh><label for="tl-welcome-embed" data-astro-cid-b4gbmzoh>${dt("Saved embed")}</label> <select id="tl-welcome-embed" name="welcome_template" data-tpl-locks="welcome_text" data-astro-cid-b4gbmzoh><option value="" data-astro-cid-b4gbmzoh>${dt("No saved embed")}</option>${embedTemplates.map((tpl) => renderTemplate`<option${addAttribute(tpl.name, "value")}${addAttribute(tpl.name === uploads.welcome.template, "selected")} data-astro-cid-b4gbmzoh>${tpl.name}${tpl.v2 ? " (V2)" : ""}</option>`)}</select></div> </section> <div class="sx-foot tl-foot" data-astro-cid-b4gbmzoh><button type="submit" class="btn btn-accent btn-sm"${addAttribute(!ready, "disabled")} data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-b4gbmzoh": true })}${dt("Save changes")}</button><p class="tl-cmds" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "14", "height": "14", "data-astro-cid-b4gbmzoh": true })}${dt("Commands: !uploads stats, !uploads leaderboard and !uploadconfig.")}</p></div> </form> <aside class="tl-side" data-astro-cid-b4gbmzoh> <section class="sx-panel tl-block" data-astro-cid-b4gbmzoh> <div class="sx-panel-head" data-astro-cid-b4gbmzoh><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:trophy-fill", "width": "17", "height": "17", "data-astro-cid-b4gbmzoh": true })}</span><h2 data-astro-cid-b4gbmzoh>${dt("This week")}</h2>${uploadStats.board.length > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-b4gbmzoh>${uploadStats.week}</span>`}</div> ${uploadStats.board.length ? renderTemplate`<ol class="tl-ranks dgl-stagger" data-astro-cid-b4gbmzoh>${uploadStats.board.map((entry, i) => renderTemplate`<li class="tl-rank" data-astro-cid-b4gbmzoh> <span${addAttribute(["tl-rank-n", { "tl-rank-top": i === 0 }], "class:list")} data-astro-cid-b4gbmzoh>${i + 1}</span> <img${addAttribute(who(entry.userId).avatar, "src")} alt="" width="28" height="28" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-b4gbmzoh> <span class="tl-rank-main" data-astro-cid-b4gbmzoh><b data-astro-cid-b4gbmzoh>${who(entry.userId).name ?? entry.userId}</b><i${addAttribute(`width:${Math.max(4, Math.round(entry.count / boardTop * 100))}%`, "style")} data-astro-cid-b4gbmzoh></i></span> <b class="tl-rank-count" data-astro-cid-b4gbmzoh>${entry.count}</b> </li>`)}</ol>` : renderTemplate`<div class="tl-empty" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:image-fill", "width": "24", "height": "24", "data-astro-cid-b4gbmzoh": true })}<p data-astro-cid-b4gbmzoh>${dt("Nobody has uploaded in this period.")}</p></div>`} </section> <section class="sx-panel tl-block" data-astro-cid-b4gbmzoh> <div class="sx-panel-head" data-astro-cid-b4gbmzoh><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:chart-bar-fill", "width": "17", "height": "17", "data-astro-cid-b4gbmzoh": true })}</span><h2 data-astro-cid-b4gbmzoh>${dt("Uploads in the last 14 days")}</h2>${uploads14 > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-b4gbmzoh>${uploads14}</span>`}</div> ${uploads14 === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:chart-bar-fill", "width": "16", "height": "16", "data-astro-cid-b4gbmzoh": true })}${dt("No uploads in the last 14 days.")}</p>` : renderTemplate`<div class="tl-bars" role="img"${addAttribute(dt("Uploads in the last 14 days"), "aria-label")} data-astro-cid-b4gbmzoh> ${uploadBars.map((d, i) => renderTemplate`<div${addAttribute(["tl-bar", { "tl-bar-today": i === 13 }], "class:list")}${addAttribute(`--i:${i}`, "style")}${addAttribute(`${d.name}: ${d.n}`, "title")} data-astro-cid-b4gbmzoh><em data-astro-cid-b4gbmzoh>${d.n || ""}</em><i${addAttribute(`height:${d.height}%`, "style")} data-astro-cid-b4gbmzoh></i><span data-astro-cid-b4gbmzoh>${d.day}</span></div>`)} </div>`} </section> </aside> </div> ` })}`} ${section === "requests" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-b4gbmzoh": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Open"), value: openNow, tone: "reactions" },
    { label: dt("Claimed"), value: claimedNow, tone: "voice" },
    requestCounts.capped ? { label: dt("Closed"), value: requestsAll - openNow - claimedNow, text: `${(requestsAll - openNow - claimedNow).toLocaleString(dashLang)}+`, tone: "joins" } : { label: dt("Closed"), value: requestsAll - openNow - claimedNow, tone: "joins" },
    requestCounts.capped ? { label: dt("All time"), value: requestsAll, text: `${requestsAll.toLocaleString(dashLang)}+`, tone: "invites" } : { label: dt("All time"), value: requestsAll, tone: "invites" }
  ], "data-astro-cid-b4gbmzoh": true })} <div class="tl-cols" data-astro-cid-b4gbmzoh> <form method="POST" class="sx-stack tl-form" data-astro-cid-b4gbmzoh> <input type="hidden" name="action" value="save_requests" data-astro-cid-b4gbmzoh> <label class="sx-switch sx-master" data-astro-cid-b4gbmzoh><input type="checkbox" name="enabled"${addAttribute(requests.enabled, "checked")} data-astro-cid-b4gbmzoh><span class="sx-switch-text" data-astro-cid-b4gbmzoh><b data-astro-cid-b4gbmzoh>${dt("Accept requests")}</b><em data-astro-cid-b4gbmzoh>${dt("Members ask the staff for something with !request make.")}</em></span><i class="sx-toggle" data-astro-cid-b4gbmzoh></i></label> <section class="sx-panel" data-sx-needs="enabled" data-astro-cid-b4gbmzoh> <div class="sx-panel-head" data-astro-cid-b4gbmzoh><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:hash-fill", "width": "17", "height": "17", "data-astro-cid-b4gbmzoh": true })}</span><h2 data-astro-cid-b4gbmzoh>${dt("Where and who")}</h2></div> <div class="sx-field" data-astro-cid-b4gbmzoh><label for="tl-channel" data-astro-cid-b4gbmzoh>${dt("Channel for the cards")}</label><select id="tl-channel" name="channel_id" data-astro-cid-b4gbmzoh><option value="" data-astro-cid-b4gbmzoh>${dt("None")}</option>${textChannels.map((ch) => renderTemplate`<option${addAttribute(ch.id, "value")}${addAttribute(ch.id === requests.channelId, "selected")} data-astro-cid-b4gbmzoh>#${ch.name}</option>`)}</select></div> <div class="sx-grid" data-astro-cid-b4gbmzoh> <div class="sx-field" data-astro-cid-b4gbmzoh><label for="tl-staff" data-astro-cid-b4gbmzoh>${dt("Staff role")}</label><select id="tl-staff" name="staff_role_id" data-astro-cid-b4gbmzoh><option value="" data-astro-cid-b4gbmzoh>${dt("Who can manage messages")}</option>${roles.map((role) => renderTemplate`<option${addAttribute(role.id, "value")}${addAttribute(role.id === requests.staffRoleId, "selected")} data-astro-cid-b4gbmzoh>${role.name}</option>`)}</select></div> <div class="sx-field" data-astro-cid-b4gbmzoh><label for="tl-ping" data-astro-cid-b4gbmzoh>${dt("Role to ping")}</label><select id="tl-ping" name="ping_role_id" data-astro-cid-b4gbmzoh><option value="" data-astro-cid-b4gbmzoh>${dt("None")}</option>${roles.map((role) => renderTemplate`<option${addAttribute(role.id, "value")}${addAttribute(role.id === requests.pingRoleId, "selected")} data-astro-cid-b4gbmzoh>${role.name}</option>`)}</select></div> </div> </section> <section class="sx-panel" data-sx-needs="enabled" data-astro-cid-b4gbmzoh> <div class="sx-panel-head" data-astro-cid-b4gbmzoh><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:hourglass-medium-fill", "width": "17", "height": "17", "data-astro-cid-b4gbmzoh": true })}</span><h2 data-astro-cid-b4gbmzoh>${dt("Limits")}</h2></div> <div class="sx-grid" data-astro-cid-b4gbmzoh> <div class="sx-field" data-astro-cid-b4gbmzoh><label for="tl-max" data-astro-cid-b4gbmzoh>${dt("Open requests per member")}</label>${renderComponent($$result3, "SxNumber", $$SxNumber, { "id": "tl-max", "name": "max_open", "value": requests.maxOpen, "min": "1", "max": "25", "data-astro-cid-b4gbmzoh": true })}</div> <div class="sx-field" data-astro-cid-b4gbmzoh><label for="tl-hours" data-astro-cid-b4gbmzoh>${dt("Hours to finish a claimed request")}${!premium && renderTemplate`<span class="sx-tag tl-premium" data-astro-cid-b4gbmzoh>Premium</span>`}</label>${renderComponent($$result3, "SxNumber", $$SxNumber, { "id": "tl-hours", "name": "completion_hours", "value": requests.completionHours, "min": "0", "max": "720", "disabled": !premium, "data-astro-cid-b4gbmzoh": true })}</div> </div> <span class="sx-hint" data-astro-cid-b4gbmzoh>${dt("0 hours means no limit. After the time, a claimed request goes back to open by itself.")}</span> </section> <section class="sx-panel" data-sx-needs="enabled" data-astro-cid-b4gbmzoh> <div class="sx-panel-head" data-astro-cid-b4gbmzoh><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:chat-teardrop-text-fill", "width": "17", "height": "17", "data-astro-cid-b4gbmzoh": true })}</span><h2 data-astro-cid-b4gbmzoh>${dt("Answer to who makes a request")}</h2></div> <div class="sx-field" data-astro-cid-b4gbmzoh> <textarea id="tl-created" name="created_text" class="dgl-autogrow" data-ac data-count rows="3" maxlength="2000"${addAttribute(dt("Answer to who makes a request"), "aria-label")} placeholder="{user.mention} your request #{request.number} is in. The staff will look at it: {request.link}" data-astro-cid-b4gbmzoh>${requests.created.text}</textarea>${renderComponent($$result3, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-b4gbmzoh": true })} <span class="sx-hint" data-astro-cid-b4gbmzoh>${dt("Variables: {request.number}, {request.text}, {request.link}, {request.channel}.")}</span> </div> <div class="sx-field" data-astro-cid-b4gbmzoh><label for="tl-created-embed" data-astro-cid-b4gbmzoh>${dt("Saved embed")}</label> <select id="tl-created-embed" name="created_template" data-tpl-locks="created_text" data-astro-cid-b4gbmzoh><option value="" data-astro-cid-b4gbmzoh>${dt("No saved embed")}</option>${embedTemplates.map((tpl) => renderTemplate`<option${addAttribute(tpl.name, "value")}${addAttribute(tpl.name === requests.created.template, "selected")} data-astro-cid-b4gbmzoh>${tpl.name}${tpl.v2 ? " (V2)" : ""}</option>`)}</select></div> </section> <div class="sx-foot tl-foot" data-astro-cid-b4gbmzoh><button type="submit" class="btn btn-accent btn-sm"${addAttribute(!ready, "disabled")} data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-b4gbmzoh": true })}${dt("Save changes")}</button><p class="tl-cmds" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "14", "height": "14", "data-astro-cid-b4gbmzoh": true })}${dt("Commands: !request make, !request list and !requestconfig.")}</p></div> </form> <aside class="tl-side" data-astro-cid-b4gbmzoh> <section class="sx-panel tl-block" data-astro-cid-b4gbmzoh> <div class="sx-panel-head" data-astro-cid-b4gbmzoh><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:tray-fill", "width": "17", "height": "17", "data-astro-cid-b4gbmzoh": true })}</span><h2 data-astro-cid-b4gbmzoh>${dt("Open requests")}</h2>${openRequests.length > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-b4gbmzoh>${moreOpen ? `${openRequests.length}/${openNow + claimedNow}` : openRequests.length}</span>`}</div> ${openRequests.length ? renderTemplate`<ul class="sx-list tl-reqs dgl-stagger" data-astro-cid-b4gbmzoh>${openRequests.map((req) => renderTemplate`<li class="sx-row tl-req" data-astro-cid-b4gbmzoh> <img${addAttribute(who(req.userId).avatar, "src")} alt="" width="30" height="30" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-b4gbmzoh> <span class="tl-req-text" data-astro-cid-b4gbmzoh> <b data-astro-cid-b4gbmzoh><span class="tl-req-n" data-astro-cid-b4gbmzoh>#${req.number}</span> ${who(req.userId).name ?? req.userId}${req.claimedBy && renderTemplate`<small data-astro-cid-b4gbmzoh>${dt("by {a}", { a: who(req.claimedBy).name ?? req.claimedBy })}</small>`}</b> <em data-astro-cid-b4gbmzoh>${req.content.slice(0, 80)}</em> </span> <span${addAttribute(["sx-tag", req.status === "claimed" ? "tl-claimed" : "sx-tag-accent"], "class:list")} data-astro-cid-b4gbmzoh>${req.status === "claimed" ? dt("Claimed") : dt("Open")}</span> </li>`)}</ul>` : renderTemplate`<div class="tl-empty" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:tray-fill", "width": "24", "height": "24", "data-astro-cid-b4gbmzoh": true })}<p data-astro-cid-b4gbmzoh>${dt("There are no open requests.")}</p></div>`} </section> </aside> </div> ` })}`} ${section === "reviews" && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-b4gbmzoh": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "DashStatTiles", $$DashStatTiles, { "against": dt("vs the week before"), "tiles": [
    { label: dt("Reviews"), value: reviewStats.total, tone: "messages" },
    { label: dt("Average stars"), value: 0, text: reviewStats.total ? reviewStats.average.toFixed(1) : "\u2013", tone: "reactions" },
    { label: dt("Members rated"), value: reviewStats.members, tone: "joins" },
    { label: dt("Last 7 days"), value: reviewStats.week ?? 0, tone: "voice", change: weekChange }
  ], "data-astro-cid-b4gbmzoh": true })} <div class="tl-cols tl-cols-reviews" data-astro-cid-b4gbmzoh> <div class="tl-main" data-astro-cid-b4gbmzoh> <form method="POST" class="sx-panel tl-set" data-astro-cid-b4gbmzoh> <input type="hidden" name="action" value="save_reviews" data-astro-cid-b4gbmzoh> <label class="sx-switch sx-master" data-astro-cid-b4gbmzoh><input type="checkbox" name="reviews_enabled"${addAttribute(reviews.enabled, "checked")} data-astro-cid-b4gbmzoh><span class="sx-switch-text" data-astro-cid-b4gbmzoh><b data-astro-cid-b4gbmzoh>${dt("Allow reviews")}</b><em data-astro-cid-b4gbmzoh>${dt("Members rate each other from 1 to 5 stars.")}</em></span><i class="sx-toggle" data-astro-cid-b4gbmzoh></i></label> <div class="sx-field" data-sx-needs="reviews_enabled" data-astro-cid-b4gbmzoh><label for="tl-review-channel" data-astro-cid-b4gbmzoh>${dt("Channel for new reviews")}</label><select id="tl-review-channel" name="review_channel_id" data-astro-cid-b4gbmzoh><option value="" data-astro-cid-b4gbmzoh>${dt("None")}</option>${textChannels.map((ch) => renderTemplate`<option${addAttribute(ch.id, "value")}${addAttribute(ch.id === reviews.channelId, "selected")} data-astro-cid-b4gbmzoh>#${ch.name}</option>`)}</select> <span class="sx-hint" data-astro-cid-b4gbmzoh>${dt("Every new review is shown there. Empty shows them nowhere.")}</span></div> <div class="sx-foot" data-astro-cid-b4gbmzoh><button type="submit" class="btn btn-accent btn-sm"${addAttribute(!ready, "disabled")} data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-b4gbmzoh": true })}${dt("Save changes")}</button></div> </form> <section class="sx-panel tl-block tl-reviews" data-astro-cid-b4gbmzoh> <div class="sx-panel-head" data-astro-cid-b4gbmzoh><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:star-fill", "width": "17", "height": "17", "data-astro-cid-b4gbmzoh": true })}</span><h2 data-astro-cid-b4gbmzoh>${dt("Latest reviews")}</h2>${reviewList.length > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-b4gbmzoh>${reviewList.length}</span>`}</div> ${reviewList.length ? renderTemplate`<ul class="sx-list tl-review-list dgl-stagger" data-astro-cid-b4gbmzoh> ${reviewList.map((review) => renderTemplate`<li class="sx-row tl-review" data-astro-cid-b4gbmzoh> <img${addAttribute(who(review.targetId).avatar, "src")} alt="" width="34" height="34" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-b4gbmzoh> <div class="tl-review-body" data-astro-cid-b4gbmzoh> <div class="tl-review-top" data-astro-cid-b4gbmzoh> <b class="tl-review-name" data-astro-cid-b4gbmzoh>${who(review.targetId).name ?? review.targetId}</b> <span class="tl-stars"${addAttribute(dt("{a} of 5 stars", { a: review.stars }), "aria-label")} data-astro-cid-b4gbmzoh>${stars(review.stars)}</span> </div> ${review.comment && renderTemplate`<p class="tl-review-text" data-astro-cid-b4gbmzoh>${review.comment}</p>`} <p class="tl-review-by" data-astro-cid-b4gbmzoh>${dt("by {a}", { a: who(review.reviewerId).name ?? review.reviewerId })} · <time${addAttribute(review.at, "datetime")}${addAttribute(review.at.slice(0, 16).replace("T", " "), "title")} data-astro-cid-b4gbmzoh>${ago(review.at)}</time></p> </div> <form method="POST" data-no-dirty class="tl-review-del" data-astro-cid-b4gbmzoh> <input type="hidden" name="review_id"${addAttribute(review.id, "value")} data-astro-cid-b4gbmzoh> <button type="submit" name="action" value="delete_review" class="sx-iconbtn"${addAttribute(dt("Delete review"), "aria-label")}${addAttribute(dt("Delete review"), "title")}${addAttribute(dt("Delete this review? It is taken out of the rating of the member."), "data-confirm")} data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-b4gbmzoh": true })}</button> </form> </li>`)} </ul>` : renderTemplate`<div class="tl-empty" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:star-fill", "width": "24", "height": "24", "data-astro-cid-b4gbmzoh": true })}<p data-astro-cid-b4gbmzoh>${dt("No reviews yet.")}</p></div>`} </section> </div> <aside class="tl-side tl-side-sticky" data-astro-cid-b4gbmzoh> <section class="sx-panel tl-block" data-astro-cid-b4gbmzoh> <div class="sx-panel-head" data-astro-cid-b4gbmzoh><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:star-fill", "width": "17", "height": "17", "data-astro-cid-b4gbmzoh": true })}</span><h2 data-astro-cid-b4gbmzoh>${dt("Stars given")}</h2></div> ${reviewStats.total === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:star-fill", "width": "16", "height": "16", "data-astro-cid-b4gbmzoh": true })}${dt("No reviews yet.")}</p>` : renderTemplate`<ul class="tl-stars-list" data-astro-cid-b4gbmzoh> ${starRows.map((row) => renderTemplate`<li data-astro-cid-b4gbmzoh><span class="tl-stars-n" data-astro-cid-b4gbmzoh>${row.n}${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:star-fill", "width": "12", "height": "12", "data-astro-cid-b4gbmzoh": true })}</span><span class="tl-stars-bar" data-astro-cid-b4gbmzoh><i${addAttribute(`width:${row.count ? Math.max(3, Math.round(row.count / starsTop * 100)) : 0}%`, "style")} data-astro-cid-b4gbmzoh></i></span><b data-astro-cid-b4gbmzoh>${row.count}</b></li>`)} </ul>`} </section> <section class="sx-panel tl-block" data-astro-cid-b4gbmzoh> <div class="sx-panel-head" data-astro-cid-b4gbmzoh><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:chart-bar-fill", "width": "17", "height": "17", "data-astro-cid-b4gbmzoh": true })}</span><h2 data-astro-cid-b4gbmzoh>${dt("Reviews in the last 14 days")}</h2>${reviews14 > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-b4gbmzoh>${reviews14}</span>`}</div> ${reviews14 === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:chart-bar-fill", "width": "16", "height": "16", "data-astro-cid-b4gbmzoh": true })}${dt("No reviews in the last 14 days.")}</p>` : renderTemplate`<div class="tl-bars" role="img"${addAttribute(dt("Reviews in the last 14 days"), "aria-label")} data-astro-cid-b4gbmzoh> ${reviewBars.map((d, i) => renderTemplate`<div${addAttribute(["tl-bar", { "tl-bar-today": i === 13 }], "class:list")}${addAttribute(`--i:${i}`, "style")}${addAttribute(`${d.name}: ${d.n}`, "title")} data-astro-cid-b4gbmzoh><em data-astro-cid-b4gbmzoh>${d.n || ""}</em><i${addAttribute(`height:${d.height}%`, "style")} data-astro-cid-b4gbmzoh></i><span data-astro-cid-b4gbmzoh>${d.day}</span></div>`)} </div>`} </section> <section class="sx-panel tl-block" data-astro-cid-b4gbmzoh> <div class="sx-panel-head" data-astro-cid-b4gbmzoh><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:medal-fill", "width": "17", "height": "17", "data-astro-cid-b4gbmzoh": true })}</span><h2 data-astro-cid-b4gbmzoh>${dt("Most reviewed members")}</h2></div> ${reviewStats.top && reviewStats.top.length > 0 ? renderTemplate`<ol class="tl-ranks" data-astro-cid-b4gbmzoh>${reviewStats.top.map((entry, i) => renderTemplate`<li class="tl-rank" data-astro-cid-b4gbmzoh> <span${addAttribute(["tl-rank-n", { "tl-rank-top": i === 0 }], "class:list")} data-astro-cid-b4gbmzoh>${i + 1}</span> <img${addAttribute(who(entry.userId).avatar, "src")} alt="" width="28" height="28" loading="lazy" referrerpolicy="no-referrer" data-astro-cid-b4gbmzoh> <span class="tl-rank-main" data-astro-cid-b4gbmzoh><b data-astro-cid-b4gbmzoh>${who(entry.userId).name ?? entry.userId}</b><em data-astro-cid-b4gbmzoh>${entry.average.toFixed(1)} ★</em></span> <b class="tl-rank-count" data-astro-cid-b4gbmzoh>${entry.count}</b> </li>`)}</ol>` : renderTemplate`<p class="sx-empty" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:medal-fill", "width": "16", "height": "16", "data-astro-cid-b4gbmzoh": true })}${dt("Nobody has been reviewed yet.")}</p>`} </section> <p class="tl-cmds" data-astro-cid-b4gbmzoh>${renderComponent($$result3, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "14", "height": "14", "data-astro-cid-b4gbmzoh": true })}${dt("Commands: !review give, !review show, !review remove, !profile and !profileconfig.")}</p> </aside> </div> ` })}`} </div> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashTools.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Tools = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Tools;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const section = ["uploads", "requests", "reviews"].includes(Astro2.url.searchParams.get("section") ?? "") ? Astro2.url.searchParams.get("section") : "uploads";
  const premium = await guildHasPremium(apiUrl, apiHeaders, id);
  const uploadChannelLimit = planLimits(premium).uploadChannels;
  const snowflake = /^\d{15,25}$/;
  const text = (form, name, max) => String(form.get(name) ?? "").replace(/\r\n?/g, "\n").trim().slice(0, max);
  const idOrNull = (form, name) => snowflake.test(String(form.get(name) ?? "")) ? String(form.get(name)) : null;
  const reply = (form, prefix) => {
    const textValue = text(form, `${prefix}_text`, 2e3);
    const template = text(form, `${prefix}_template`, 100);
    return { ...textValue ? { text: textValue } : {}, ...template ? { template } : {} };
  };
  const save = (table, body) => fetch(`${apiUrl}/rest/v1/${table}?on_conflict=guild_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ ...body, guild_id: id, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
  let saved = false;
  let notice = "";
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    await ensureGuildRow(apiUrl, apiHeaders, id);
    if (action === "save_uploads") {
      const wanted = [...new Set(form.getAll("channel_ids").map(String).filter((value) => snowflake.test(value)))];
      if (wanted.length > uploadChannelLimit) notice = "channel_limit";
      saved = (await save("upload_config", { enabled: form.get("enabled") === "on", channel_ids: wanted.slice(0, uploadChannelLimit), uploader_role_id: idOrNull(form, "uploader_role_id"), welcome: reply(form, "welcome") })).ok;
    } else if (action === "save_requests") {
      let hours = Math.max(0, Math.min(720, Math.floor(Number(form.get("completion_hours") ?? 0)) || 0));
      if (hours > 0 && !premium) {
        hours = 0;
        notice = "premium_timeout";
      }
      saved = (await save("request_config", {
        enabled: form.get("enabled") === "on",
        channel_id: idOrNull(form, "channel_id"),
        staff_role_id: idOrNull(form, "staff_role_id"),
        ping_role_id: idOrNull(form, "ping_role_id"),
        max_open: Math.max(1, Math.min(25, Math.floor(Number(form.get("max_open") ?? 3)) || 3)),
        completion_hours: hours,
        messages: { created: reply(form, "created") }
      })).ok;
    } else if (action === "save_reviews") {
      saved = (await save("profile_config", { reviews_enabled: form.get("reviews_enabled") === "on", review_channel_id: idOrNull(form, "review_channel_id") })).ok;
    } else if (action === "delete_review") {
      const reviewId = Math.trunc(Number(form.get("review_id") ?? 0));
      if (reviewId > 0) {
        const res = await fetch(`${apiUrl}/rest/v1/member_reviews?guild_id=eq.${id}&id=eq.${reviewId}`, { method: "DELETE", headers: { ...apiHeaders, Prefer: "return=minimal" } }).catch(() => null);
        if (res?.ok) notice = "review_deleted";
        else notice = "review_failed";
      }
    }
  }
  const get = (table, query = "") => fetch(`${apiUrl}/rest/v1/${table}?guild_id=eq.${id}${query}`, { headers: apiHeaders });
  const [guildInfo, uploadRes, requestRes, profileRes, openRes, uploadLogRes, channelsRes, rolesRes, templatesRes, reviewsRes, statusRes] = await Promise.all([
    getGuildInfo(id, botToken),
    get("upload_config", "&select=*"),
    get("request_config", "&select=*"),
    get("profile_config", "&select=*"),
    get("requests", "&status=in.(open,claimed)&select=number,user_id,content,status,claimed_by&order=number.desc&limit=15"),
    get("upload_log", "&select=user_id,created_at&order=created_at.desc&limit=5000"),
    getGuildList(Astro2, id, botToken, "channels"),
    getGuildList(Astro2, id, botToken, "roles"),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name,data&order=name.asc`, { headers: apiHeaders }),
    // Every review of the server (they are small: stars, a short comment and who): the numbers count all of them, the list shows the newest.
    section === "reviews" ? get("member_reviews", "&select=id,target_id,reviewer_id,stars,comment,updated_at&order=updated_at.desc&limit=2000").catch(() => null) : Promise.resolve(null),
    // Only the status of every request (a short column), to count the open, claimed and closed ones: the list above is just the newest 15.
    section === "requests" ? get("requests", "&select=status&limit=5000").catch(() => null) : Promise.resolve(null)
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = uploadRes.ok && requestRes.ok && profileRes.ok;
  const first = async (res) => (res.ok ? (await res.json())[0] : null) ?? {};
  const u = await first(uploadRes);
  const r = await first(requestRes);
  const p = await first(profileRes);
  const asReply = (value) => ({ text: value?.text ?? "", template: value?.template ?? "" });
  const uploads = { enabled: u.enabled ?? false, channelIds: u.channel_ids ?? [], uploaderRoleId: u.uploader_role_id ?? "", welcome: asReply(u.welcome) };
  const requests = { enabled: r.enabled ?? false, channelId: r.channel_id ?? "", staffRoleId: r.staff_role_id ?? "", pingRoleId: r.ping_role_id ?? "", maxOpen: r.max_open ?? 3, completionHours: r.completion_hours ?? 0, created: asReply(r.messages?.created) };
  const reviews = { enabled: p.reviews_enabled ?? true, channelId: p.review_channel_id ?? "" };
  const openRequests = (openRes.ok ? await openRes.json() : []).map((row) => ({ number: row.number, userId: row.user_id, content: row.content, status: row.status, claimedBy: row.claimed_by ?? "" }));
  const logRows = uploadLogRes.ok ? await uploadLogRes.json() : [];
  const weekStart = periodStartInstant("week");
  const byUser = /* @__PURE__ */ new Map();
  for (const row of logRows) if (new Date(row.created_at).getTime() >= weekStart) byUser.set(row.user_id, (byUser.get(row.user_id) ?? 0) + 1);
  const days14 = rangeDays(/* @__PURE__ */ new Date(), 14);
  const perDay = (stamps) => {
    const counts = Array(14).fill(0);
    for (const stamp of stamps) {
      const at = days14.indexOf(botDay(stamp));
      if (at >= 0) counts[at] += 1;
    }
    return counts;
  };
  const reachesBack = (rows, cap) => rows.length < cap || Date.parse(String(rows[rows.length - 1]?.created_at ?? rows[rows.length - 1]?.updated_at)) <= Date.now() - 14 * 864e5;
  const uploadDays = perDay(logRows.map((row) => row.created_at));
  const uploadStats = {
    total: logRows.length,
    capped: logRows.length >= 5e3,
    week: [...byUser.values()].reduce((a, b) => a + b, 0),
    today: uploadDays[13],
    days: uploadDays,
    board: [...byUser.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([userId, count]) => ({ userId, count }))
  };
  const reviewRows = reviewsRes?.ok ? await reviewsRes.json().catch(() => []) : [];
  const reviewDays = perDay(reviewRows.map((row) => String(row.updated_at)));
  const byTarget = /* @__PURE__ */ new Map();
  const starCounts = [0, 0, 0, 0, 0];
  for (const row of reviewRows) {
    const stars = Math.max(1, Math.min(5, Number(row.stars) || 1));
    starCounts[stars - 1] += 1;
    const entry = byTarget.get(String(row.target_id)) ?? { count: 0, stars: 0 };
    entry.count += 1;
    entry.stars += stars;
    byTarget.set(String(row.target_id), entry);
  }
  const addUp = (list) => list.reduce((a, b) => a + b, 0);
  const reviewStats = {
    total: reviewRows.length,
    average: reviewRows.length ? reviewRows.reduce((sum, row) => sum + (Number(row.stars) || 0), 0) / reviewRows.length : 0,
    members: byTarget.size,
    stars: starCounts,
    days: reviewDays,
    week: addUp(reviewDays.slice(7)),
    // The change against the 7 days before only counts when the 2000 reviews read reach back that far.
    weekBefore: reachesBack(reviewRows, 2e3) ? addUp(reviewDays.slice(0, 7)) : null,
    top: [...byTarget.entries()].map(([userId, entry]) => ({ userId, count: entry.count, average: entry.stars / entry.count })).sort((a, b) => b.count - a.count || b.average - a.average).slice(0, 5)
  };
  const recentReviews = reviewRows.slice(0, 30);
  const statusRows = statusRes?.ok ? await statusRes.json().catch(() => []) : [];
  const requestCounts = {
    open: statusRows.filter((row) => row.status === "open").length,
    claimed: statusRows.filter((row) => row.status === "claimed").length,
    total: statusRows.length,
    capped: statusRows.length >= 5e3
  };
  const named = section === "uploads" ? uploadStats.board.map((entry) => entry.userId) : section === "requests" ? openRequests.flatMap((req) => [String(req.userId), String(req.claimedBy ?? "")]) : [...recentReviews.flatMap((row) => [String(row.target_id), String(row.reviewer_id)]), ...reviewStats.top.map((entry) => entry.userId)];
  const profiles = named.length ? (await withinBudget(getMemberProfiles(Astro2, id, named, botToken, { fallback: "user", userId: session.userId }), 1500))?.value ?? /* @__PURE__ */ new Map() : /* @__PURE__ */ new Map();
  const person = (userId) => {
    const profile = profiles.get(userId) ?? null;
    return { id: userId, name: profile ? profile.displayName || profile.username : null, avatar: memberAvatarUrl(userId, profile, 64) };
  };
  const people = Object.fromEntries([...new Set(named.filter(Boolean))].map((userId) => [userId, person(userId)]));
  const reviewList = recentReviews.map((row) => ({ id: Number(row.id), targetId: String(row.target_id), reviewerId: String(row.reviewer_id), stars: Math.max(1, Math.min(5, Number(row.stars) || 1)), comment: String(row.comment ?? ""), at: String(row.updated_at) }));
  const channels = (channelsRes.ok ? await channelsRes.json() : []).filter((ch) => [0, 5, 11, 15].includes(ch.type)).sort((a, b) => a.position - b.position).map((ch) => ({ id: ch.id, name: ch.name, text: ch.type === 0 || ch.type === 5 }));
  const roles = (rolesRes.ok ? await rolesRes.json() : []).filter((role) => role.name !== "@everyone").sort((a, b) => b.position - a.position).map((role) => ({ id: role.id, name: role.name }));
  const embedTemplates = (templatesRes.ok ? await templatesRes.json() : []).map((row) => ({ name: row.name, v2: isV2Data(row.data) }));
  return renderTemplate`${renderComponent($$result, "DashTools", $$DashTools, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "section": section, "uploads": uploads, "requests": requests, "reviews": reviews, "openRequests": openRequests, "uploadStats": uploadStats, "channels": channels, "roles": roles, "embedTemplates": embedTemplates, "uploadChannelLimit": uploadChannelLimit, "premium": premium, "ready": ready, "saved": saved, "notice": notice, "people": people, "reviewStats": reviewStats, "reviewList": reviewList, "requestCounts": requestCounts })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/tools.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/tools.astro";
const $$url = "/dash/guild/[id]/tools";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tools,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
