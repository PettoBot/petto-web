import { c as createAstro, a as createComponent, m as maybeRenderHead, b as addAttribute, d as renderComponent, r as renderTemplate } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { m as makeT, g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                          */
import { $ as $$Modal } from '../../../../chunks/Modal_-nOZLo0Z.mjs';
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
export { renderers } from '../../../../renderers.mjs';

const MEDIA_NETWORKS = [
  { id: "youtube", name: "YouTube", icon: "simple-icons:youtube" },
  { id: "twitter", name: "X (Twitter)", icon: "simple-icons:x" },
  { id: "instagram", name: "Instagram", icon: "simple-icons:instagram" },
  { id: "tiktok", name: "TikTok", icon: "simple-icons:tiktok" },
  { id: "pinterest", name: "Pinterest", icon: "simple-icons:pinterest" },
  { id: "spotify", name: "Spotify", icon: "simple-icons:spotify" },
  { id: "twitch", name: "Twitch", icon: "simple-icons:twitch" },
  { id: "kick", name: "Kick", icon: "simple-icons:kick" },
  { id: "soundcloud", name: "SoundCloud", icon: "simple-icons:soundcloud" },
  { id: "reddit", name: "Reddit", icon: "simple-icons:reddit" },
  { id: "facebook", name: "Facebook", icon: "simple-icons:facebook" },
  { id: "github", name: "GitHub", icon: "simple-icons:github" },
  { id: "gif", name: "GIFs (Tenor, Giphy)", icon: "ph:image-fill" },
  { id: "discord", name: "Discord", icon: "simple-icons:discord" }
];
const MEDIA_NETWORK_IDS = MEDIA_NETWORKS.map((n) => n.id);
const MAX_BYPASS_ROLES = 25;
function ruleFromRow(row) {
  return {
    channelId: String(row.channel_id),
    attachments: row.attachments_enabled === true,
    links: row.links_enabled === true,
    images: row.allow_images !== false,
    videos: row.allow_videos !== false,
    audio: row.allow_audio === true,
    files: row.allow_files === true,
    networks: Array.isArray(row.networks) ? row.networks.map(String).filter((id) => MEDIA_NETWORK_IDS.includes(id)) : [],
    caption: row.allow_caption !== false,
    notice: row.notice !== false,
    bypassRoleIds: Array.isArray(row.bypass_role_ids) ? row.bypass_role_ids.map(String) : []
  };
}
function rowFromForm(guildId, channelId, form) {
  const all = form.get("any_site") === "on";
  const picked = form.getAll("networks").map(String).filter((id) => MEDIA_NETWORK_IDS.includes(id));
  return {
    guild_id: guildId,
    channel_id: channelId,
    attachments_enabled: form.get("attachments_enabled") === "on",
    links_enabled: form.get("links_enabled") === "on",
    allow_images: form.get("allow_images") === "on",
    allow_videos: form.get("allow_videos") === "on",
    allow_audio: form.get("allow_audio") === "on",
    allow_files: form.get("allow_files") === "on",
    networks: all ? [] : [...new Set(picked)],
    allow_caption: form.get("allow_caption") === "on",
    notice: form.get("notice") === "on",
    bypass_role_ids: [...new Set(form.getAll("bypass_role_ids").map(String).filter((id) => /^\d{15,25}$/.test(id)))].slice(0, MAX_BYPASS_ROLES),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}
function presetRow(guildId, channelId, preset) {
  return {
    guild_id: guildId,
    channel_id: channelId,
    attachments_enabled: preset === "media" || preset === "both",
    links_enabled: preset === "links" || preset === "both",
    allow_images: true,
    allow_videos: true,
    allow_audio: false,
    allow_files: false,
    networks: [],
    allow_caption: true,
    notice: true,
    bypass_role_ids: [],
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
}

const $$Astro$2 = createAstro("https://petto.sbs");
const $$MediaFields = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$MediaFields;
  const dt = makeT(getDashLang(Astro2));
  const { rule: r, roles } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="mf-block" data-astro-cid-emn3rihh> <label class="sx-switch" data-astro-cid-emn3rihh><input type="checkbox" name="attachments_enabled"${addAttribute(r.attachments, "checked")} data-astro-cid-emn3rihh><span class="sx-switch-text" data-astro-cid-emn3rihh><b data-astro-cid-emn3rihh>${dt("Attachments")}</b><em data-astro-cid-emn3rihh>${dt("Files uploaded to Discord, the ones from the phone or the computer.")}</em></span><i class="sx-toggle" data-astro-cid-emn3rihh></i></label> <div class="mf-sub" data-sx-needs="attachments_enabled" data-astro-cid-emn3rihh> <label class="mf-chip" data-astro-cid-emn3rihh><input type="checkbox" name="allow_images"${addAttribute(r.images, "checked")} data-astro-cid-emn3rihh><span data-astro-cid-emn3rihh>${renderComponent($$result, "Icon", $$Icon, { "name": "ph:image-fill", "width": "14", "height": "14", "data-astro-cid-emn3rihh": true })}${dt("Pictures")}</span></label> <label class="mf-chip" data-astro-cid-emn3rihh><input type="checkbox" name="allow_videos"${addAttribute(r.videos, "checked")} data-astro-cid-emn3rihh><span data-astro-cid-emn3rihh>${dt("Videos")}</span></label> <label class="mf-chip" data-astro-cid-emn3rihh><input type="checkbox" name="allow_audio"${addAttribute(r.audio, "checked")} data-astro-cid-emn3rihh><span data-astro-cid-emn3rihh>${dt("Audio")}</span></label> <label class="mf-chip" data-astro-cid-emn3rihh><input type="checkbox" name="allow_files"${addAttribute(r.files, "checked")} data-astro-cid-emn3rihh><span data-astro-cid-emn3rihh>${dt("Other files")}</span></label> </div> </div> <div class="mf-block" data-astro-cid-emn3rihh> <label class="sx-switch" data-astro-cid-emn3rihh><input type="checkbox" name="links_enabled"${addAttribute(r.links, "checked")} data-astro-cid-emn3rihh><span class="sx-switch-text" data-astro-cid-emn3rihh><b data-astro-cid-emn3rihh>${dt("Links")}</b><em data-astro-cid-emn3rihh>${dt("A link to a site, like a video, a post or a song.")}</em></span><i class="sx-toggle" data-astro-cid-emn3rihh></i></label> <div class="mf-sub" data-sx-needs="links_enabled" data-astro-cid-emn3rihh> <label class="mf-chip" data-astro-cid-emn3rihh><input type="checkbox" name="any_site"${addAttribute(r.networks.length === 0, "checked")} data-astro-cid-emn3rihh><span data-astro-cid-emn3rihh>${dt("Any site")}</span></label> <div class="mf-sites" data-astro-cid-emn3rihh> ${MEDIA_NETWORKS.map((n) => renderTemplate`<label class="mf-chip" data-astro-cid-emn3rihh><input type="checkbox" name="networks"${addAttribute(n.id, "value")}${addAttribute(r.networks.includes(n.id), "checked")} data-astro-cid-emn3rihh><span data-astro-cid-emn3rihh>${renderComponent($$result, "Icon", $$Icon, { "name": n.icon, "width": "14", "height": "14", "data-astro-cid-emn3rihh": true })}${n.name}</span></label>`)} </div> </div> </div> <div class="sx-switches" data-astro-cid-emn3rihh> <label class="sx-switch" data-astro-cid-emn3rihh><input type="checkbox" name="allow_caption"${addAttribute(r.caption, "checked")} data-astro-cid-emn3rihh><span class="sx-switch-text" data-astro-cid-emn3rihh><b data-astro-cid-emn3rihh>${dt("Text next to it is fine")}</b><em data-astro-cid-emn3rihh>${dt("A message with a picture or a link and a few words.")}</em></span><i class="sx-toggle" data-astro-cid-emn3rihh></i></label> <label class="sx-switch" data-astro-cid-emn3rihh><input type="checkbox" name="notice"${addAttribute(r.notice, "checked")} data-astro-cid-emn3rihh><span class="sx-switch-text" data-astro-cid-emn3rihh><b data-astro-cid-emn3rihh>${dt("Say why it was deleted")}</b><em data-astro-cid-emn3rihh>${dt("A short notice that deletes itself.")}</em></span><i class="sx-toggle" data-astro-cid-emn3rihh></i></label> </div> <div class="mf-field" data-astro-cid-emn3rihh> <label data-astro-cid-emn3rihh>${dt("Roles that can write anything")}</label> ${renderComponent($$result, "MultiSelect", $$MultiSelect, { "lazy": true, "name": "bypass_role_ids", "options": roles, "selected": r.bypassRoleIds, "placeholder": dt("Search roles..."), "data-astro-cid-emn3rihh": true })} <span class="mf-hint" data-astro-cid-emn3rihh>${dt("Members with Manage Messages are never touched.")}</span> </div> `;
}, "/home/runner/work/petto-web/petto-web/src/components/MediaFields.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashMedia = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashMedia;
  const dt = makeT(getDashLang(Astro2));
  const { user, guildId, guildName, guildIcon, rules, channels, roles, ready, saved, failed } = Astro2.props;
  const names = new Map(channels.map((c) => [c.id, c.name]));
  const taken = new Set(rules.map((r) => r.channelId));
  const free = channels.filter((c) => !taken.has(c.id));
  const savedText = { added: dt("Channel added."), saved: dt("Saved."), removed: dt("Channel removed.") };
  const errors = {
    channel: dt("Choose a channel from the list."),
    empty: dt("Turn on attachments, links or both. To stop checking a channel, remove it."),
    save: dt("It could not be saved. Try again in a moment.")
  };
  const siteName = (id) => MEDIA_NETWORKS.find((n) => n.id === id)?.name ?? id;
  const siteOf = (id) => MEDIA_NETWORKS.find((n) => n.id === id);
  const withAttachments = rules.filter((r) => r.attachments).length;
  const withLinks = rules.filter((r) => r.links).length;
  const skipRoles = new Set(rules.flatMap((r) => r.bypassRoleIds)).size;
  const blank = { channelId: "", attachments: true, links: false, images: true, videos: true, audio: false, files: false, networks: [], caption: true, notice: true, bypassRoleIds: [] };
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "media", "pageTitle": dt("Media channels"), "data-astro-cid-zxsfpszl": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", '<div class="sx-page md" data-astro-cid-zxsfpszl> <div class="md-top" data-astro-cid-zxsfpszl> <div data-astro-cid-zxsfpszl> <h1 data-astro-cid-zxsfpszl>', '</h1> <p class="md-lead" data-astro-cid-zxsfpszl>', '</p> </div> <button type="button" class="btn btn-accent btn-sm" data-modal-open="md-d-new"', " data-astro-cid-zxsfpszl>", "", "</button> </div> ", " ", " ", " ", " ", " ", ' <div class="sx-duo md-help" data-astro-cid-zxsfpszl> <section class="sx-panel" data-astro-cid-zxsfpszl> <div class="sx-panel-head" data-astro-cid-zxsfpszl><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-zxsfpszl>', "</span><h2 data-astro-cid-zxsfpszl>", '</h2></div> <p class="sx-lead" data-astro-cid-zxsfpszl>', '</p> <p class="sx-hint" data-astro-cid-zxsfpszl>', '</p> </section> <section class="sx-panel" data-astro-cid-zxsfpszl> <div class="sx-panel-head" data-astro-cid-zxsfpszl><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-zxsfpszl>', "</span><h2 data-astro-cid-zxsfpszl>", '</h2></div> <p class="sx-lead" data-astro-cid-zxsfpszl>', `</p> </section> </div> </div> <script>
    // A channel chip of "Not checked yet" opens the New window with that channel already chosen.
    if (!window.__mdPick) {
      window.__mdPick = true;
      document.addEventListener('click', function (event) {
        var chip = event.target.closest && event.target.closest('[data-media-pick]'); if (!chip) return;
        var select = document.getElementById('md-ch-new'); if (select) select.value = chip.getAttribute('data-media-pick');
      });
    }
  <\/script> `, " ", ""])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-zxsfpszl": true }), maybeRenderHead(), dt("Media channels"), dt("Channels where only pictures and videos, or only links, can be posted. Petto deletes the rest."), addAttribute(!ready || !free.length, "disabled"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "14", "height": "14", "data-astro-cid-zxsfpszl": true }), dt("Add channel"), saved && renderTemplate`<div class="sx-flash" data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-zxsfpszl": true })}${savedText[saved] ?? savedText.saved}</div>`, failed && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-zxsfpszl": true })}${errors[failed] ?? errors.save}</div>`, !ready && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-zxsfpszl": true })}${dt("This arrives with the next Petto update.")}</div>`, renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Channels"), value: rules.length, tone: "voice" },
    { label: dt("With attachments"), value: withAttachments, tone: "messages" },
    { label: dt("With links"), value: withLinks, tone: "invites" },
    { label: dt("Roles that skip"), value: skipRoles, tone: "joins" }
  ], "data-astro-cid-zxsfpszl": true }), rules.length === 0 ? renderTemplate`<section class="sx-panel md-empty" data-astro-cid-zxsfpszl> <span class="md-empty-ico" data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:image-fill", "width": "26", "height": "26", "data-astro-cid-zxsfpszl": true })}</span> <h2 data-astro-cid-zxsfpszl>${dt("No channel is checked yet")}</h2> <p data-astro-cid-zxsfpszl>${dt("Keep a channel for pictures, videos or links only.")}</p> <button type="button" class="btn btn-accent btn-sm" data-modal-open="md-d-new"${addAttribute(!ready || !free.length, "disabled")} data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "14", "height": "14", "data-astro-cid-zxsfpszl": true })}${dt("Add channel")}</button> </section>` : renderTemplate`<div class="md-grid dgl-stagger" data-astro-cid-zxsfpszl> ${rules.map((r) => {
    const linkOnly = r.links && !r.attachments;
    const kinds = [r.images && dt("Pictures"), r.videos && dt("Videos"), r.audio && dt("Audio"), r.files && dt("Other files")].filter(Boolean);
    return renderTemplate`<article class="sx-panel md-rule" data-astro-cid-zxsfpszl> <header class="md-head" data-astro-cid-zxsfpszl> <span class="md-ico" data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": linkOnly ? "ph:link-fill" : "ph:image-fill", "width": "18", "height": "18", "data-astro-cid-zxsfpszl": true })}</span> <div class="md-main" data-astro-cid-zxsfpszl><b data-astro-cid-zxsfpszl>#${names.get(r.channelId) ?? r.channelId}</b><span data-astro-cid-zxsfpszl>${linkOnly ? dt("Links only") : r.links ? dt("Attachments and links") : dt("Attachments only")}</span></div> </header> <div class="md-allow" data-astro-cid-zxsfpszl> ${r.attachments && renderTemplate`<div class="md-line" data-astro-cid-zxsfpszl><span class="md-line-label" data-astro-cid-zxsfpszl>${dt("Attachments")}</span><span class="md-chips" data-astro-cid-zxsfpszl>${kinds.length ? kinds.map((k) => renderTemplate`<span class="sx-tag sx-tag-accent" data-astro-cid-zxsfpszl>${k}</span>`) : renderTemplate`<span class="sx-tag" data-astro-cid-zxsfpszl>${dt("Attachments")}</span>`}</span></div>`} ${r.links && renderTemplate`<div class="md-line" data-astro-cid-zxsfpszl><span class="md-line-label" data-astro-cid-zxsfpszl>${dt("Links")}</span><span class="md-chips" data-astro-cid-zxsfpszl> ${r.networks.length ? r.networks.map((id) => renderTemplate`<span class="md-site"${addAttribute(siteOf(id)?.name ?? id, "title")} data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": siteOf(id)?.icon ?? "ph:link-fill", "width": "13", "height": "13", "data-astro-cid-zxsfpszl": true })}${siteOf(id)?.name ?? id}</span>`) : renderTemplate`<span class="sx-tag sx-tag-accent" data-astro-cid-zxsfpszl>${dt("Any site")}</span>`} </span></div>`} </div> <div class="md-preview"${addAttribute(dt("Preview"), "aria-label")} data-astro-cid-zxsfpszl> <div class="md-pv-msg md-pv-ok" data-astro-cid-zxsfpszl> <span class="md-pv-av" data-astro-cid-zxsfpszl>L</span> <div data-astro-cid-zxsfpszl> <b data-astro-cid-zxsfpszl>Liam</b> ${r.attachments && !linkOnly && renderTemplate`<img class="md-pv-img" src="/assets/memes/star.jpg" alt="" width="320" height="180" loading="lazy" decoding="async" data-astro-cid-zxsfpszl>`} ${r.links && renderTemplate`<p class="md-pv-link" data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:link-simple-bold", "width": "12", "height": "12", "data-astro-cid-zxsfpszl": true })}${r.networks.length ? siteName(r.networks[0]) : dt("Any site")}</p>`} </div> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "16", "height": "16", "class": "md-pv-mark", "data-astro-cid-zxsfpszl": true })} </div> <div class="md-pv-msg md-pv-no" data-astro-cid-zxsfpszl> <span class="md-pv-av" data-astro-cid-zxsfpszl>M</span> <div data-astro-cid-zxsfpszl><b data-astro-cid-zxsfpszl>Mia</b><p data-astro-cid-zxsfpszl>${dt("hello everyone!")}</p></div> ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "16", "height": "16", "class": "md-pv-mark", "data-astro-cid-zxsfpszl": true })} </div> </div> <div class="md-foot" data-astro-cid-zxsfpszl> <span class="md-tags" data-astro-cid-zxsfpszl> <span class="sx-tag" data-astro-cid-zxsfpszl>${r.caption ? dt("Text next to it is fine") : dt("Nothing but the file or link")}</span> <span class="sx-tag" data-astro-cid-zxsfpszl>${r.notice ? dt("Says why it was deleted") : dt("Deletes without a notice")}</span> ${r.bypassRoleIds.length > 0 && renderTemplate`<span class="sx-tag sx-tag-accent" data-astro-cid-zxsfpszl>${r.bypassRoleIds.length === 1 ? dt("1 role skips it") : dt("{n} roles skip it", { n: r.bypassRoleIds.length })}</span>`} </span> <div class="md-acts" data-astro-cid-zxsfpszl> <button type="button" class="md-act"${addAttribute(`md-d-${r.channelId}`, "data-modal-open")}${addAttribute(dt("Edit"), "aria-label")}${addAttribute(dt("Edit"), "title")} data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-fill", "width": "15", "height": "15", "data-astro-cid-zxsfpszl": true })}</button> <form method="POST" data-no-dirty data-astro-cid-zxsfpszl> <input type="hidden" name="action" value="remove" data-astro-cid-zxsfpszl><input type="hidden" name="channel_id"${addAttribute(r.channelId, "value")} data-astro-cid-zxsfpszl> <button type="submit" class="md-act md-del"${addAttribute(dt("Remove channel"), "aria-label")}${addAttribute(dt("Remove channel"), "title")}${addAttribute(dt("Remove this channel? Messages there will not be checked any more."), "data-confirm")} data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:trash-fill", "width": "15", "height": "15", "data-astro-cid-zxsfpszl": true })}</button> </form> </div> </div> </article>`;
  })} <button type="button" class="md-rule md-add" data-modal-open="md-d-new"${addAttribute(!ready || !free.length, "disabled")} data-astro-cid-zxsfpszl> <span class="md-ico" data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "18", "height": "18", "data-astro-cid-zxsfpszl": true })}</span> <b data-astro-cid-zxsfpszl>${dt("Add channel")}</b> </button> </div>`, free.length > 0 && ready && renderTemplate`<section class="sx-panel md-free" data-astro-cid-zxsfpszl> <div class="sx-panel-head" data-astro-cid-zxsfpszl><span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hash-fill", "width": "17", "height": "17", "data-astro-cid-zxsfpszl": true })}</span><h2 data-astro-cid-zxsfpszl>${dt("Not checked yet")}</h2><span class="sx-tag" data-astro-cid-zxsfpszl>${free.length}</span></div> <p class="sx-lead" data-astro-cid-zxsfpszl>${dt("Click a channel to start checking it.")}</p> <div class="md-freelist" data-astro-cid-zxsfpszl> ${free.slice(0, 18).map((c) => renderTemplate`<button type="button" class="md-freechip" data-modal-open="md-d-new"${addAttribute(c.id, "data-media-pick")} data-astro-cid-zxsfpszl>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hash-bold", "width": "12", "height": "12", "data-astro-cid-zxsfpszl": true })}${c.name}</button>`)} ${free.length > 18 && renderTemplate`<span class="md-more" data-astro-cid-zxsfpszl>${dt("+{n} more", { n: free.length - 18 })}</span>`} </div> </section>`, renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "17", "height": "17", "data-astro-cid-zxsfpszl": true }), dt("What happens to the rest"), dt("Everything else sent there is deleted, and the person is told why in a notice that deletes itself."), dt("Members with Manage Messages are never touched."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:terminal-window-fill", "width": "17", "height": "17", "data-astro-cid-zxsfpszl": true }), dt("Commands"), dt("With the prefix: !imgonly add #channel, !urlonly add #channel youtube x, !imgonly list."), renderComponent($$result2, "Modal", $$Modal, { "id": "md-d-new", "title": dt("New media channel"), "icon": "ph:image-fill", "data-astro-cid-zxsfpszl": true }, { "default": ($$result3) => renderTemplate` <form method="POST" class="md-form" data-no-dirty data-astro-cid-zxsfpszl> <input type="hidden" name="action" value="save" data-astro-cid-zxsfpszl> <p class="md-lede" data-astro-cid-zxsfpszl>${dt("Everything else sent there is deleted, and the person is told why in a notice that deletes itself.")}</p> <div class="md-field" data-astro-cid-zxsfpszl> <label for="md-ch-new" data-astro-cid-zxsfpszl>${dt("Channel")}</label> <select id="md-ch-new" name="channel_id" required data-astro-cid-zxsfpszl> <option value="" data-astro-cid-zxsfpszl>${dt("Choose a channel")}</option> ${free.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-zxsfpszl>#${c.name}</option>`)} </select> </div> ${renderComponent($$result3, "MediaFields", $$MediaFields, { "rule": blank, "roles": roles, "data-astro-cid-zxsfpszl": true })} <footer data-astro-cid-zxsfpszl><button type="button" class="btn btn-ghost btn-sm" data-modal-close data-astro-cid-zxsfpszl>${dt("Cancel")}</button><button type="submit" class="btn btn-accent btn-sm" data-keep data-astro-cid-zxsfpszl>${dt("Create")}</button></footer> </form> ` }), rules.map((r) => renderTemplate`${renderComponent($$result2, "Modal", $$Modal, { "id": `md-d-${r.channelId}`, "title": `#${names.get(r.channelId) ?? r.channelId}`, "icon": r.links && !r.attachments ? "ph:link-fill" : "ph:image-fill", "data-astro-cid-zxsfpszl": true }, { "default": ($$result3) => renderTemplate` <form method="POST" class="md-form" data-no-dirty data-astro-cid-zxsfpszl> <input type="hidden" name="action" value="save" data-astro-cid-zxsfpszl><input type="hidden" name="channel_id"${addAttribute(r.channelId, "value")} data-astro-cid-zxsfpszl> ${renderComponent($$result3, "MediaFields", $$MediaFields, { "rule": r, "roles": roles, "data-astro-cid-zxsfpszl": true })} <footer data-astro-cid-zxsfpszl><button type="button" class="btn btn-ghost btn-sm" data-modal-close data-astro-cid-zxsfpszl>${dt("Cancel")}</button><button type="submit" class="btn btn-accent btn-sm" data-keep data-astro-cid-zxsfpszl>${dt("Save")}</button></footer> </form> ` })}`)) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashMedia.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Media = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Media;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const SNOWFLAKE = /^\d{15,25}$/;
  const TEXT_TYPES = /* @__PURE__ */ new Set([0, 5, 15]);
  const [guildInfo, channelsRes, rolesRes] = await Promise.all([
    getGuildInfo(id, botToken),
    getGuildList(Astro2, id, botToken, "channels"),
    getGuildList(Astro2, id, botToken, "roles")
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const channels = (channelsRes?.ok ? await channelsRes.json() : []).filter((c) => TEXT_TYPES.has(c.type)).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone" && !r.managed).sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  let saved = "";
  let failed = "";
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const action = String(form.get("action") ?? "");
    const channelId = String(form.get("channel_id") ?? "").trim();
    if (!SNOWFLAKE.test(channelId) || !channels.some((c) => c.id === channelId)) failed = "channel";
    else if (action === "remove") {
      const res = await fetch(`${apiUrl}/rest/v1/media_only_channels?guild_id=eq.${id}&channel_id=eq.${channelId}`, { method: "DELETE", headers: { ...apiHeaders, Prefer: "return=minimal" } }).catch(() => null);
      if (res?.ok) saved = "removed";
      else failed = "save";
    } else if (action === "add" || action === "save") {
      const row = action === "add" ? presetRow(id, channelId, String(form.get("preset") ?? "media")) : rowFromForm(id, channelId, form);
      if (action === "save" && !row.attachments_enabled && !row.links_enabled) failed = "empty";
      else {
        await ensureGuildRow(apiUrl, apiHeaders, id);
        const res = await fetch(`${apiUrl}/rest/v1/media_only_channels?on_conflict=guild_id,channel_id`, {
          method: "POST",
          headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify(row)
        }).catch(() => null);
        if (res?.ok) saved = action === "add" ? "added" : "saved";
        else failed = "save";
      }
    } else failed = "save";
  }
  const listRes = await fetch(`${apiUrl}/rest/v1/media_only_channels?guild_id=eq.${id}&select=*&order=channel_id`, { headers: apiHeaders }).catch(() => null);
  const ready = Boolean(listRes?.ok);
  const rules = ready ? (await listRes.json()).map(ruleFromRow) : [];
  return renderTemplate`${renderComponent($$result, "DashMedia", $$DashMedia, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "rules": rules, "channels": channels, "roles": roles, "ready": ready, "saved": saved, "failed": failed })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/media.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/media.astro";
const $$url = "/dash/guild/[id]/media";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Media,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
