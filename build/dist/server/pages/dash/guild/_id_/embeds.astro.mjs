import { c as createAstro, a as createComponent, r as renderTemplate, d as renderComponent, F as Fragment, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
import { u as userCardData, a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { $ as $$SkeletonBlocks } from '../../../../chunks/SkeletonBlocks_COw0_LxU.mjs';
import { $ as $$DashReactWords } from '../../../../chunks/DashReactWords_BE3DKW1v.mjs';
import { h as hiddenChannelSet, g as goneChannelLabel } from '../../../../chunks/channelLabel_899ww5-9.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { F as FREE_LIMITS } from '../../../../chunks/planLimits_BFQNR8Tb.mjs';
/* empty css                                           */
import { $ as $$DashAcData, g as getVariableGroups } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, g as getBotIdentity, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { y as callPettoPagination } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$2 = createAstro("https://petto.sbs");
const $$DashPaginations = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$DashPaginations;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { paginations, ready, message, templateNames, channels } = Astro2.props;
  const hiddenChannels = await hiddenChannelSet(String(Astro2.params.id ?? ""));
  const goneChannel = (id, goneKey) => goneChannelLabel(dt, hiddenChannels, id, goneKey);
  const MAX_PAGES = 25;
  const pageName = (page) => page.type === "embed" ? page.name || dt("Saved embed") : page.type === "message" ? dt("Original message") : dt("Embed code");
  const startRows = templateNames.length ? 1 : 0;
  return renderTemplate(_a || (_a = __template(["", '<section class="pg" id="paginated-messages" data-pagination-section data-astro-cid-qajx2ezx> <header class="pg-head" data-astro-cid-qajx2ezx> <h2 data-astro-cid-qajx2ezx>', "", '</h2> <p class="pg-sub" data-astro-cid-qajx2ezx>', "</p> </header> ", " ", " <div", ' data-astro-cid-qajx2ezx> <div class="pg-list dgl-stagger" data-astro-cid-qajx2ezx> ', " ", ' </div> <form method="POST" class="pg-builder" data-no-dirty data-pg-builder data-astro-cid-qajx2ezx> <input type="hidden" name="action" value="pagination_create" data-astro-cid-qajx2ezx> <h3 data-astro-cid-qajx2ezx>', "</h3> ", ' <p class="pg-hint pg-cmd" data-astro-cid-qajx2ezx>', "</p> </form> ", ` </div> <script>
    (function () {
      function dockFooter() {
        var slot = document.getElementById('pg-aside-slot');
        var footer = document.querySelector('#dgl-content > aside.dgf');
        if (slot && footer) slot.appendChild(footer);
      }
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dockFooter);
      else requestAnimationFrame(dockFooter);
    })();
  <\/script> <script>
    // The builder's page rows: add (a copy of the last row), move up or down, remove (one row always stays). One listener for the
    // whole document, bound once, so it keeps working after the dashboard swaps the page content in. Once touched, the builder holds
    // the live updates of the page (data-dash-hold) so the pages picked are not redrawn away before they are posted.
    (function () {
      if (window.__pgBound) return;
      window.__pgBound = true;
      document.addEventListener('change', function (event) {
        var builder = event.target && event.target.closest ? event.target.closest('[data-pg-builder]') : null;
        if (builder) builder.setAttribute('data-dash-hold', '');
      });
      document.addEventListener('click', function (event) {
        var target = event.target && event.target.closest ? event.target.closest('[data-pg-builder] button[type="button"]') : null;
        if (!target) return;
        var builder = target.closest('[data-pg-builder]');
        // Being built: a live update of the page waits until it is posted (the layout's data-dash-hold).
        builder.setAttribute('data-dash-hold', '');
        var rows = builder.querySelector('[data-pg-rows]');
        var row = target.closest('[data-pg-row]');
        if (target.hasAttribute('data-pg-add')) {
          var all = rows.querySelectorAll('[data-pg-row]');
          if (all.length >= Number(target.getAttribute('data-max') || 25)) return;
          var last = all[all.length - 1];
          var copy = last.cloneNode(true);
          // A copy keeps the markup, not what was chosen: the new page is the saved embed after the last one.
          var from = last.querySelector('select');
          var select = copy.querySelector('select');
          if (from && select) select.selectedIndex = Math.min(from.selectedIndex + 1, select.options.length - 1);
          rows.appendChild(copy);
        } else if (row && target.hasAttribute('data-pg-up') && row.previousElementSibling) {
          rows.insertBefore(row, row.previousElementSibling);
        } else if (row && target.hasAttribute('data-pg-down') && row.nextElementSibling) {
          rows.insertBefore(row.nextElementSibling, row);
        } else if (row && target.hasAttribute('data-pg-remove') && rows.querySelectorAll('[data-pg-row]').length > 1 && !row.hasAttribute('data-pg-leaving')) {
          // The row fades out, then goes; it stops counting at once so a quick second click cannot remove the last one.
          row.setAttribute('data-pg-leaving', '');
          row.removeAttribute('data-pg-row');
          row.querySelectorAll('select').forEach(function (select) { select.disabled = true; });
          if (window.dglMotion && window.dglMotion.leave) window.dglMotion.leave(row, function () { window.dglMotion.flip(row, function () { row.remove(); }); });
          else row.remove();
        }
      });
    })();
  <\/script> </section> `])), maybeRenderHead(), renderComponent($$result, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "18", "height": "18", "data-astro-cid-qajx2ezx": true }), dt("Paginated messages"), dt("One message with several pages and buttons to turn them (\u25C0 page \u25B6, and a menu to jump when there are more than 5). Anyone can turn the pages; private ones show each member their own copy."), message && renderTemplate`<div${addAttribute(["pg-flash", { "pg-flash-err": message.kind === "err" }], "class:list")} role="status" data-astro-cid-qajx2ezx>${renderComponent($$result, "Icon", $$Icon, { "name": message.kind === "ok" ? "ph:check-circle-fill" : "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-qajx2ezx": true })}${message.text}</div>`, !ready && renderTemplate`<div class="pg-flash pg-flash-warn" data-astro-cid-qajx2ezx>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15", "data-astro-cid-qajx2ezx": true })}${dt("The paginated messages could not be read. Try again in a moment.")}</div>`, addAttribute(["pg-grid", { "is-empty": paginations.length === 0 }], "class:list"), paginations.length === 0 && ready && renderTemplate`<div class="pg-empty" data-astro-cid-qajx2ezx> ${renderComponent($$result, "Icon", $$Icon, { "name": "ph:stack-fill", "width": "22", "height": "22", "data-astro-cid-qajx2ezx": true })} <p data-astro-cid-qajx2ezx>${dt("No paginated messages yet. Post one with the builder, or turn a message Petto sent into one with !pagination set <link>.")}</p> </div>`, paginations.map((p) => renderTemplate`<article class="pg-card" data-astro-cid-qajx2ezx> <div class="pg-card-top" data-astro-cid-qajx2ezx> <div class="pg-card-title" data-astro-cid-qajx2ezx> ${renderComponent($$result, "Icon", $$Icon, { "name": "ph:hash-bold", "width": "15", "height": "15", "data-astro-cid-qajx2ezx": true })} <b data-astro-cid-qajx2ezx>${p.channelName ?? goneChannel(p.channelId, "Deleted channel")}</b> <span class="pg-tag" data-astro-cid-qajx2ezx>${p.pages.length === 1 ? dt("1 page") : dt("{n} pages", { n: p.pages.length })}</span> ${p.private && renderTemplate`<span class="pg-tag pg-tag-private" data-astro-cid-qajx2ezx>${dt("Private")}</span>`} ${p.kind === "v2" && renderTemplate`<span class="pg-tag pg-tag-v2" data-astro-cid-qajx2ezx>V2</span>`} </div> <a class="pg-open"${addAttribute(p.url, "href")} target="_blank" rel="noopener" data-astro-cid-qajx2ezx>${dt("Open in Discord")}${renderComponent($$result, "Icon", $$Icon, { "name": "ph:arrow-square-out-bold", "width": "11", "height": "11", "data-astro-cid-qajx2ezx": true })}</a> </div> <ol class="pg-pages" data-astro-cid-qajx2ezx> ${p.pages.map((page) => renderTemplate`<li${addAttribute({ "pg-page-code": page.type !== "embed" }, "class:list")} data-astro-cid-qajx2ezx>${pageName(page)}</li>`)} </ol> <div class="pg-actions" data-astro-cid-qajx2ezx> <form method="POST" data-no-dirty data-astro-cid-qajx2ezx> <input type="hidden" name="action" value="pagination_restore" data-astro-cid-qajx2ezx> <input type="hidden" name="pagination_id"${addAttribute(p.id, "value")} data-astro-cid-qajx2ezx> <button class="btn btn-ghost btn-sm" type="submit" data-astro-cid-qajx2ezx>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:arrow-counter-clockwise-bold", "width": "12", "height": "12", "data-astro-cid-qajx2ezx": true })}${dt("Put the buttons back")}</button> </form> <form method="POST" data-no-dirty data-astro-cid-qajx2ezx> <input type="hidden" name="action" value="pagination_delete" data-astro-cid-qajx2ezx> <input type="hidden" name="pagination_id"${addAttribute(p.id, "value")} data-astro-cid-qajx2ezx> <button class="btn btn-ghost btn-sm" type="submit"${addAttribute(dt("Stop this pagination? The message stays with the page it shows, without buttons."), "data-confirm")} data-astro-cid-qajx2ezx>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:stop-circle-fill", "width": "12", "height": "12", "data-astro-cid-qajx2ezx": true })}${dt("Stop")}</button> </form> <form method="POST" data-no-dirty data-astro-cid-qajx2ezx> <input type="hidden" name="action" value="pagination_delete" data-astro-cid-qajx2ezx> <input type="hidden" name="pagination_id"${addAttribute(p.id, "value")} data-astro-cid-qajx2ezx> <input type="hidden" name="purge" value="1" data-astro-cid-qajx2ezx> <button class="btn btn-ghost btn-sm pg-danger" type="submit"${addAttribute(dt("Delete this message from Discord? Its pages are removed too."), "data-confirm")} data-astro-cid-qajx2ezx>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:trash-bold", "width": "12", "height": "12", "data-astro-cid-qajx2ezx": true })}${dt("Delete message")}</button> </form> </div> </article>`), dt("New paginated message"), templateNames.length === 0 ? renderTemplate`<p class="pg-hint" data-astro-cid-qajx2ezx>${dt("Save an embed above first: each page is a saved embed.")}</p>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "data-astro-cid-qajx2ezx": true }, { "default": async ($$result2) => renderTemplate` <label class="pg-field" data-astro-cid-qajx2ezx><span data-astro-cid-qajx2ezx>${dt("Channel")}</span> <select name="channel_id" required data-astro-cid-qajx2ezx> <option value="" data-astro-cid-qajx2ezx>${dt("Choose a channel")}</option> ${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-qajx2ezx>#${c.name}</option>`)} </select> </label> <div class="pg-field" data-astro-cid-qajx2ezx> <span data-astro-cid-qajx2ezx>${dt("Pages, in order")}</span> <ol class="pg-rows" data-pg-rows data-astro-cid-qajx2ezx> ${Array.from({ length: startRows }, (_, index) => renderTemplate`<li class="pg-row" data-pg-row data-astro-cid-qajx2ezx> <select name="embed"${addAttribute(dt("Saved embed"), "aria-label")} data-astro-cid-qajx2ezx>${templateNames.map((name, at) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(at === index, "selected")} data-astro-cid-qajx2ezx>${name}</option>`)}</select> <button type="button" class="pg-icon" data-pg-up${addAttribute(dt("Move up"), "aria-label")} data-astro-cid-qajx2ezx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-up-bold", "width": "12", "height": "12", "data-astro-cid-qajx2ezx": true })}</button> <button type="button" class="pg-icon" data-pg-down${addAttribute(dt("Move down"), "aria-label")} data-astro-cid-qajx2ezx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "width": "12", "height": "12", "data-astro-cid-qajx2ezx": true })}</button> <button type="button" class="pg-icon" data-pg-remove${addAttribute(dt("Remove page"), "aria-label")} data-astro-cid-qajx2ezx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x-bold", "width": "12", "height": "12", "data-astro-cid-qajx2ezx": true })}</button> </li>`)} </ol> <button type="button" class="btn btn-ghost btn-sm pg-add" data-pg-add${addAttribute(MAX_PAGES, "data-max")} data-astro-cid-qajx2ezx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-qajx2ezx": true })}${dt("Add a page")}</button> </div> <label class="pg-check" data-astro-cid-qajx2ezx><input type="checkbox" name="private" value="1" data-astro-cid-qajx2ezx><span data-astro-cid-qajx2ezx><b data-astro-cid-qajx2ezx>${dt("Private pages")}</b><em data-astro-cid-qajx2ezx>${dt("A click shows the page only to who clicked, instead of turning it for everyone.")}</em></span></label> <button class="btn btn-accent btn-sm" type="submit"${addAttribute(!ready, "disabled")} data-astro-cid-qajx2ezx>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "13", "height": "13", "data-astro-cid-qajx2ezx": true })}${dt("Post")}</button> <p class="pg-hint" data-astro-cid-qajx2ezx>${dt("Up to 25 pages. All pages must be classic embeds or all Components V2 designs. Free servers can have {n} paginated messages.", { n: FREE_LIMITS.paginationMessages })}</p> ` })}`, dt("With the prefix: !pagination create, set, add, update, remove, move, list, view, mode, restore, delete and reset (alias !pn)."), paginations.length === 0 && renderTemplate`<div class="pg-aside-slot" id="pg-aside-slot" data-astro-cid-qajx2ezx></div>`);
}, "/home/runner/work/petto-web/petto-web/src/components/DashPaginations.astro", void 0);

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashEmbeds = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashEmbeds;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, botName, botIcon, templateNames, selected, channels, variableGroups, paginations = [], paginationsReady = true, paginationMessage = null } = Astro2.props;
  const userAvatarUrl = user.avatar ?? "/assets/mascot-icon.webp";
  const look = userCardData(user);
  const decorationUrl = look.decoration?.still?.replace("size=96", "size=256") ?? "";
  const nameplateUrl = look.nameplate?.still ?? "";
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "embeds", "pageTitle": "Embeds", "data-astro-cid-g6x7nuu4": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 data-astro-cid-g6x7nuu4>${dt("Embeds")}</h1> ${renderComponent($$result2, "DashAcData", $$DashAcData, { "channels": channels, "data-astro-cid-g6x7nuu4": true })} ${renderComponent($$result2, "DashReactWords", $$DashReactWords, { "data-astro-cid-g6x7nuu4": true })} ${renderComponent($$result2, "EmbedBuilderApp", null, { "client:only": "react", "guildId": guildId, "botName": botName, "botIcon": botIcon, "userAvatarUrl": userAvatarUrl, "decorationUrl": decorationUrl, "nameplateUrl": nameplateUrl, "guildIconUrl": guildIcon, "initialTemplateNames": templateNames, "initialSelected": selected, "channels": channels, "serverName": guildName, "variableGroups": variableGroups, "generatorUrl": "https://embed-generator.petto.sbs", "client:component-hydration": "only", "data-astro-cid-g6x7nuu4": true, "client:component-path": "/home/runner/work/petto-web/petto-web/src/react/embeds/EmbedBuilderApp", "client:component-export": "default" }, { "fallback": ($$result3) => renderTemplate`${renderComponent($$result3, "SkeletonBlocks", $$SkeletonBlocks, { "slot": "fallback", "variant": "editor", "data-astro-cid-g6x7nuu4": true })}` })} ${renderComponent($$result2, "DashPaginations", $$DashPaginations, { "paginations": paginations, "ready": paginationsReady, "message": paginationMessage, "templateNames": templateNames, "channels": channels, "data-astro-cid-g6x7nuu4": true })} ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashEmbeds.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Embeds = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Embeds;
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
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const SNOWFLAKE = /^\d{15,25}$/;
  let paginationMessage = null;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const answer = (result) => {
      if (result.ok) return { kind: "ok", text: result.message || dt("Saved.") };
      if (result.code === "unknown_action" || !result.message && result.code === "not_found") return { kind: "err", text: dt("Petto is being updated: paginated messages can be used in a few minutes.") };
      return { kind: "err", text: result.message || dt("Petto did not answer. Try again in a moment.") };
    };
    if (action === "pagination_create") {
      const channelId = String(form.get("channel_id") ?? "");
      const embeds = form.getAll("embed").map((value) => String(value).trim().slice(0, 100)).filter(Boolean).slice(0, 25);
      if (!SNOWFLAKE.test(channelId)) paginationMessage = { kind: "err", text: dt("Pick a channel where Petto can post.") };
      else if (!embeds.length) paginationMessage = { kind: "err", text: dt("Pick at least one saved embed for the pages.") };
      else paginationMessage = answer(await callPettoPagination(Astro2, id, session.userId, "create", { channel_id: channelId, embeds, private: form.get("private") === "1" }, dashLang));
    } else if (action === "pagination_delete" || action === "pagination_restore") {
      const paginationId = String(form.get("pagination_id") ?? "");
      if (!/^\d{1,19}$/.test(paginationId)) paginationMessage = { kind: "err", text: dt("That paginated message no longer exists.") };
      else if (action === "pagination_restore") paginationMessage = answer(await callPettoPagination(Astro2, id, session.userId, "restore", { id: paginationId }, dashLang));
      else paginationMessage = answer(await callPettoPagination(Astro2, id, session.userId, "delete", { id: paginationId, purge: form.get("purge") === "1" }, dashLang));
    }
  }
  const [guildInfo, identity, templatesRes, channelsRes, variableGroups, paginationsRes, identityNotifyRes, identityLogsRes] = await Promise.all([
    getGuildInfo(id, botToken),
    // The same read the layout starts (shared per request and kept for a while): the bot's server nickname and avatar, or its own name and avatar.
    getBotIdentity(id, botToken, Astro2.request).catch(() => null),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders }),
    getGuildList(Astro2, id, botToken, "channels"),
    getVariableGroups(Astro2),
    fetch(`${apiUrl}/rest/v1/pagination_messages?guild_id=eq.${id}&select=*&order=created_at.asc`, { headers: apiHeaders }).catch(() => null),
    // What the Vanity and Server Tag pages use for their thank-you messages and log entries (read to keep it out of the list below).
    fetch(`${apiUrl}/rest/v1/identity_notifications?guild_id=eq.${id}&select=embed_name`, { headers: apiHeaders }).catch(() => null),
    fetch(`${apiUrl}/rest/v1/identity_logs?guild_id=eq.${id}&select=embeds`, { headers: apiHeaders }).catch(() => null)
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const botName = identity?.name || "Petto";
  const botIcon = identity?.icon || "/assets/mascot-icon.webp";
  const IDENTITY_NAMES = /^(?:notify_(?:vanity_add|vanity_remove|tag_add|tag_remove|error)|vanity_notify|guildtag_notify)$/;
  const identityUsed = /* @__PURE__ */ new Set();
  for (const row of identityNotifyRes?.ok ? await identityNotifyRes.json().catch(() => []) : []) if (row?.embed_name) identityUsed.add(String(row.embed_name));
  for (const row of identityLogsRes?.ok ? await identityLogsRes.json().catch(() => []) : []) for (const name of Object.values(row?.embeds ?? {})) if (name) identityUsed.add(String(name));
  const templateNames = templatesRes.ok ? (await templatesRes.json()).map((t) => t.name).filter((name) => !IDENTITY_NAMES.test(name) && !(identityUsed.has(name) && /^(?:vanity|tag|guildtag)$/.test(name))) : [];
  const rawChannels = channelsRes.ok ? await channelsRes.json() : [];
  const channels = (Array.isArray(rawChannels) ? rawChannels : []).filter((c) => c.type === 0 || c.type === 5).map((c) => ({ id: c.id, name: c.name }));
  const selected = new URL(Astro2.request.url).searchParams.get("name") ?? templateNames[0] ?? "";
  const channelName = new Map((Array.isArray(rawChannels) ? rawChannels : []).map((c) => [String(c.id), String(c.name)]));
  const paginationsReady = Boolean(paginationsRes?.ok);
  const rawPaginations = paginationsReady ? await paginationsRes.json().catch(() => []) : [];
  const paginations = rawPaginations.map((row) => ({
    id: String(row.id),
    channelId: String(row.channel_id),
    channelName: channelName.get(String(row.channel_id)) ?? null,
    messageId: String(row.message_id),
    url: `https://discord.com/channels/${id}/${row.channel_id}/${row.message_id}`,
    kind: row.kind === "v2" ? "v2" : "embed",
    private: row.private === true,
    pages: (Array.isArray(row.pages) ? row.pages : []).map((page) => page?.type === "embed" ? { type: "embed", name: String(page.name ?? "") } : { type: page?.type === "message" ? "message" : "code" })
  }));
  return renderTemplate`${renderComponent($$result, "DashEmbeds", $$DashEmbeds, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "botName": botName, "botIcon": botIcon, "templateNames": templateNames, "selected": selected, "channels": channels, "variableGroups": variableGroups, "paginations": paginations, "paginationsReady": paginationsReady, "paginationMessage": paginationMessage })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/embeds.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/embeds.astro";
const $$url = "/dash/guild/[id]/embeds";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Embeds,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
