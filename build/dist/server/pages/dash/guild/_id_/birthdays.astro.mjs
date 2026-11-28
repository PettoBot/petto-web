import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                              */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashBirthdays = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashBirthdays;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, config, channels, roles, templates, total, today, ready, saved, failed } = Astro2.props;
  const errors = {
    channel: dt("Choose a channel from the list."),
    role: dt("Choose a role from the list."),
    hour: dt("The hour has to be from 0 to 23."),
    timezone: dt("Choose a time zone from the list."),
    save: dt("It could not be saved. Try again in a moment.")
  };
  const offsets = Array.from({ length: 53 }, (_, i) => -720 + i * 30).filter((m) => m <= 840);
  const offsetLabel = (minutes) => {
    const sign = minutes < 0 ? "-" : "+";
    const abs = Math.abs(minutes);
    return `UTC${sign}${Math.floor(abs / 60)}${abs % 60 ? `:${String(abs % 60).padStart(2, "0")}` : ""}`;
  };
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "birthdays", "pageTitle": dt("Birthdays"), "data-astro-cid-okyjzpvp": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", "<h1 data-astro-cid-okyjzpvp>", "</h1> ", " ", "", "", '<div class="bd-page" data-astro-cid-okyjzpvp> ', ' <form method="POST" class="dfx-form" data-astro-cid-okyjzpvp> <label class="dfx-master" data-astro-cid-okyjzpvp><span data-astro-cid-okyjzpvp><b data-astro-cid-okyjzpvp>', "</b><em data-astro-cid-okyjzpvp>", '</em></span><input type="checkbox" class="dfx-t" name="enabled"', ' data-astro-cid-okyjzpvp></label> <section class="dfx-sec" data-astro-cid-okyjzpvp> <div class="dfx-sec-head" data-astro-cid-okyjzpvp><h2 data-astro-cid-okyjzpvp>', "</h2><p data-astro-cid-okyjzpvp>", '</p></div> <div class="dfx-grid" data-astro-cid-okyjzpvp> <div class="dfx-field" data-astro-cid-okyjzpvp><label data-astro-cid-okyjzpvp>', '</label> <select name="channel_id" data-astro-cid-okyjzpvp> <option value="" data-astro-cid-okyjzpvp>', "</option> ", ' </select> </div> <div class="dfx-field" data-astro-cid-okyjzpvp><label data-astro-cid-okyjzpvp>', '</label> <select name="role_id" data-give-role data-astro-cid-okyjzpvp> <option value="" data-astro-cid-okyjzpvp>', "</option> ", ' </select> <span class="dfx-hint" data-astro-cid-okyjzpvp>', '</span> </div> <div class="dfx-field" data-astro-cid-okyjzpvp><label data-astro-cid-okyjzpvp>', '</label><input type="number" name="hour" min="0" max="23"', ' data-astro-cid-okyjzpvp></div> <div class="dfx-field" data-astro-cid-okyjzpvp><label data-astro-cid-okyjzpvp>', '</label> <select name="utc_offset_minutes" data-astro-cid-okyjzpvp> ', ' </select> </div> </div> <p class="bd-when" data-bd-when', ' data-astro-cid-okyjzpvp></p> </section> <section class="dfx-sec" data-astro-cid-okyjzpvp> <div class="dfx-sec-head" data-astro-cid-okyjzpvp><h2 data-astro-cid-okyjzpvp>', "</h2><p data-astro-cid-okyjzpvp>", '</p></div> <div class="dfx-grid" data-astro-cid-okyjzpvp> <div class="dfx-field dfx-wide" data-astro-cid-okyjzpvp><label data-astro-cid-okyjzpvp>', '</label> <textarea name="message" class="dgl-autogrow" rows="4" maxlength="1500" data-count data-ac data-dp data-dp-template="embed_template" data-astro-cid-okyjzpvp>', "</textarea>", ' <span class="dfx-hint" data-astro-cid-okyjzpvp>', '</span> </div> <div class="dfx-field dfx-wide" data-astro-cid-okyjzpvp><label data-astro-cid-okyjzpvp>', '</label> <select name="embed_template" data-tpl-locks="message" data-astro-cid-okyjzpvp> <option value="" data-astro-cid-okyjzpvp>', "</option> ", ' </select> <span class="dfx-hint" data-astro-cid-okyjzpvp>', '</span> </div> </div> </section> <div class="dfx-foot" data-astro-cid-okyjzpvp> <button class="btn btn-accent btn-sm" type="submit"', " data-astro-cid-okyjzpvp>", '</button> <a class="dfx-link"', " data-astro-cid-okyjzpvp>", `</a> </div> </form> </div> <script>
    (function () {
      var note = document.querySelector('[data-bd-when]');
      var hour = document.querySelector('input[name="hour"]');
      var zone = document.querySelector('select[name="utc_offset_minutes"]');
      if (!note || !hour || !zone) return;
      function paint() {
        var h = Math.max(0, Math.min(23, parseInt(hour.value, 10) || 0));
        var label = zone.options[zone.selectedIndex] ? zone.options[zone.selectedIndex].textContent : '';
        note.textContent = note.getAttribute('data-text').replace('{time}', String(h).padStart(2, '0') + ':00').replace('{zone}', label);
      }
      hour.addEventListener('input', paint); zone.addEventListener('input', paint); zone.addEventListener('change', paint);
      paint();
    })();
  <\/script> `])), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-okyjzpvp": true }), maybeRenderHead(), dt("Birthdays"), renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "vars": [{ tok: "{age}", desc: dt("The age they turn") }, { tok: "{server}", desc: dt("Name of the server") }], "data-astro-cid-okyjzpvp": true }), saved && renderTemplate`<div class="dfx-flash" data-astro-cid-okyjzpvp>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-okyjzpvp": true })}${dt("Saved.")}</div>`, failed && renderTemplate`<div class="dfx-flash dfx-warn" data-astro-cid-okyjzpvp>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-okyjzpvp": true })}${errors[failed] ?? errors.save}</div>`, !ready && renderTemplate`<div class="dfx-flash dfx-warn" data-astro-cid-okyjzpvp>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-okyjzpvp": true })}${dt("This arrives with the next Petto update.")}</div>`, renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Birthdays saved"), value: total, tone: "invites" },
    { label: dt("Celebrating today"), value: today, tone: "reactions" }
  ], "data-astro-cid-okyjzpvp": true }), dt("Celebrate birthdays in this server"), dt("Petto writes to the channel and gives the role on the day."), addAttribute(config.enabled, "checked"), dt("Where and when"), dt("The channel, the role of the day and the hour it all happens."), dt("Channel"), dt("No message"), channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === config.channelId, "selected")} data-astro-cid-okyjzpvp>#${c.name}</option>`), dt("Role for the day"), dt("No role"), roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.id === config.roleId, "selected")} data-astro-cid-okyjzpvp>${r.name}</option>`), dt("Given in the morning and taken back a day later. Petto has to be above it."), dt("Hour of the day"), addAttribute(config.hour, "value"), dt("Time zone"), offsets.map((m) => renderTemplate`<option${addAttribute(m, "value")}${addAttribute(m === config.offset, "selected")} data-astro-cid-okyjzpvp>${offsetLabel(m)}</option>`), addAttribute(dt("Wishes go out every day at {time} ({zone})."), "data-text"), dt("The message"), dt("What Petto says. Write it here or choose a design from the Embeds page."), dt("Message"), config.message, renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-okyjzpvp": true }), dt("Variables: {user}, {user.mention}, {server} and {age} (the age they turn, empty if they did not say the year)."), dt("Saved embed (optional)"), dt("Use the message above"), templates.map((name) => renderTemplate`<option${addAttribute(name, "value")}${addAttribute(name === config.embedTemplate, "selected")} data-astro-cid-okyjzpvp>${name}</option>`), dt("A design from Embeds is sent instead of the message. Its variables work, but not {age}."), addAttribute(!ready, "disabled"), dt("Save"), addAttribute(`/dash/guild/${guildId}/senders`, "href"), dt("Give these messages their own name and picture")) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashBirthdays.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Birthdays = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Birthdays;
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
  const DEFAULT_MESSAGE = "{EMOJI} Happy birthday {user}! Have a great day!";
  let saved = false;
  let failed = "";
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const channelId = String(form.get("channel_id") ?? "");
    const roleId = String(form.get("role_id") ?? "");
    const hour = Math.floor(Number(form.get("hour") ?? 9));
    const offset = Math.floor(Number(form.get("utc_offset_minutes") ?? -300));
    const embed = String(form.get("embed_template") ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 60);
    if (channelId && !SNOWFLAKE.test(channelId)) failed = "channel";
    else if (roleId && !SNOWFLAKE.test(roleId)) failed = "role";
    else if (!(hour >= 0 && hour <= 23)) failed = "hour";
    else if (!(offset >= -720 && offset <= 840)) failed = "timezone";
    else {
      await ensureGuildRow(apiUrl, apiHeaders, id);
      const res = await fetch(`${apiUrl}/rest/v1/birthday_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          enabled: form.get("enabled") === "on",
          channel_id: channelId || null,
          role_id: roleId || null,
          message: String(form.get("message") ?? "").replace(/\r\n?/g, "\n").trim().slice(0, 1500) || DEFAULT_MESSAGE,
          embed_template: embed || null,
          hour,
          utc_offset_minutes: offset,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      saved = res.ok;
      if (!res.ok) failed = "save";
    }
  }
  const [guildInfo, configRes, listRes, rolesRes, channelsRes, templatesRes] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/birthday_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }).catch(() => null),
    fetch(`${apiUrl}/rest/v1/birthdays?guild_id=eq.${id}&select=user_id,month,day&limit=5000`, { headers: apiHeaders }).catch(() => null),
    getGuildList(Astro2, id, botToken, "roles"),
    getGuildList(Astro2, id, botToken, "channels"),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders }).catch(() => null)
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = Boolean(configRes?.ok);
  const row = ready ? (await configRes.json())[0] ?? {} : {};
  const list = listRes?.ok ? await listRes.json() : [];
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone" && !r.managed).sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const channels = (channelsRes?.ok ? await channelsRes.json() : []).filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  const templates = (templatesRes?.ok ? await templatesRes.json() : []).map((t) => t.name).filter(Boolean);
  const now = new Date(Date.now() + (row.utc_offset_minutes ?? -300) * 6e4);
  const today = list.filter((entry) => entry.month === now.getUTCMonth() + 1 && entry.day === now.getUTCDate()).length;
  const config = {
    enabled: row.enabled ?? false,
    channelId: row.channel_id ?? "",
    roleId: row.role_id ?? "",
    message: row.message ?? DEFAULT_MESSAGE,
    embedTemplate: row.embed_template ?? "",
    hour: row.hour ?? 9,
    offset: row.utc_offset_minutes ?? -300
  };
  return renderTemplate`${renderComponent($$result, "DashBirthdays", $$DashBirthdays, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "config": config, "channels": channels, "roles": roles, "templates": templates, "total": list.length, "today": today, "ready": ready, "saved": saved, "failed": failed })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/birthdays.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/birthdays.astro";
const $$url = "/dash/guild/[id]/birthdays";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Birthdays,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
