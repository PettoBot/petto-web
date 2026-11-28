import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$MultiSelect } from '../../../../chunks/MultiSelect_DC3PJCql.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$SxNumber } from '../../../../chunks/SxNumber_YL4vNksH.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                             */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashAntiScam = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashAntiScam;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, config, events, roles, channels, saved, failed } = Astro2.props;
  const textChannels = channels.filter((c) => !c.category);
  const actionNames = { alert: dt("Only alert the staff"), timeout: dt("Mute the account"), kick: dt("Kick the account"), ban: dt("Ban the account") };
  const signalNames = { "multi-channel": dt("Same message in several channels"), wording: dt("Scam wording"), "new-account": dt("New account with scam wording") };
  const actionIcons = { alert: "ph:bell-ringing-fill", timeout: "ph:speaker-slash-fill", kick: "ph:sign-out-fill", ban: "ph:prohibit-fill" };
  const actionHints = { alert: dt("Nothing happens to the account"), timeout: dt("It cannot write for a while"), kick: dt("It leaves the server"), ban: dt("It is banned for good") };
  const takenDown = events.reduce((sum, e) => sum + e.deleted, 0);
  const when = (iso) => new Date(iso).toLocaleString(dashLang, { dateStyle: "medium", timeStyle: "short" });
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "antiscam", "pageTitle": dt("Anti scam"), "data-astro-cid-tqjbl5qc": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-tqjbl5qc": true })} ${maybeRenderHead()}<div class="sx-page" data-astro-cid-tqjbl5qc> <h1 class="sx-title" data-astro-cid-tqjbl5qc>${dt("Anti scam")} <span${addAttribute(["sx-pill-state", { on: config.enabled }], "class:list")} data-astro-cid-tqjbl5qc>${config.enabled ? dt("Active") : dt("Inactive")}</span></h1> ${saved && renderTemplate`<div class="sx-flash" data-astro-cid-tqjbl5qc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-tqjbl5qc": true })}${dt("Saved.")}</div>`} ${failed && renderTemplate`<div class="sx-flash sx-flash-bad" data-astro-cid-tqjbl5qc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-tqjbl5qc": true })}${dt("It could not be saved, try again.")}</div>`} ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Scams caught"), value: config.caught, tone: "leaves" },
    { label: dt("Messages taken down (last 20)"), value: takenDown, tone: "voice" }
  ], "data-astro-cid-tqjbl5qc": true })} <form method="POST" class="sx-stack" data-astro-cid-tqjbl5qc> <label class="sx-switch sx-master" data-astro-cid-tqjbl5qc><input type="checkbox" name="enabled"${addAttribute(config.enabled, "checked")} data-astro-cid-tqjbl5qc><span class="sx-switch-text" data-astro-cid-tqjbl5qc><b data-astro-cid-tqjbl5qc>${dt("Turn the anti scam on")}</b><em data-astro-cid-tqjbl5qc>${dt("It never touches the server owner or the roles and channels you exempt below.")}</em></span><i class="sx-toggle" data-astro-cid-tqjbl5qc></i></label> <section class="sx-panel sc-block" data-astro-cid-tqjbl5qc> <div class="sx-panel-head" data-astro-cid-tqjbl5qc><span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-tqjbl5qc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:gavel-fill", "width": "17", "height": "17", "data-astro-cid-tqjbl5qc": true })}</span><h2 data-astro-cid-tqjbl5qc>${dt("What it does when it catches one")}</h2></div> <div class="sx-field" data-astro-cid-tqjbl5qc> <span class="sx-label" data-astro-cid-tqjbl5qc>${dt("Action on the account")}</span> <div class="sx-choices" data-astro-cid-tqjbl5qc> ${Object.entries(actionNames).map(([k, v]) => renderTemplate`<label class="sx-choice" data-astro-cid-tqjbl5qc><input type="radio" name="action"${addAttribute(k, "value")}${addAttribute(config.action === k, "checked")} data-astro-cid-tqjbl5qc><span class="sx-choice-body" data-astro-cid-tqjbl5qc>${renderComponent($$result2, "Icon", $$Icon, { "name": actionIcons[k], "width": "18", "height": "18", "data-astro-cid-tqjbl5qc": true })}<b data-astro-cid-tqjbl5qc>${v}</b><em data-astro-cid-tqjbl5qc>${actionHints[k]}</em></span></label>`)} </div> </div> <div class="sx-grid" data-astro-cid-tqjbl5qc> <div class="sx-field" data-sx-needs="action=timeout" data-astro-cid-tqjbl5qc><label for="sc-timeout" data-astro-cid-tqjbl5qc>${dt("Minutes of mute")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "name": "timeout_minutes", "id": "sc-timeout", "value": config.timeoutMinutes, "min": "1", "max": "40320", "data-astro-cid-tqjbl5qc": true })}<span class="sx-hint" data-astro-cid-tqjbl5qc>${dt("Only when the action is to mute the account.")}</span></div> </div> <div class="sx-switches" data-astro-cid-tqjbl5qc> <label class="sx-switch" data-astro-cid-tqjbl5qc><input type="checkbox" name="delete_messages"${addAttribute(config.deleteMessages, "checked")} data-astro-cid-tqjbl5qc><span class="sx-switch-text" data-astro-cid-tqjbl5qc><b data-astro-cid-tqjbl5qc>${dt("Take down what the account sent lately, in every channel")}</b></span><i class="sx-toggle" data-astro-cid-tqjbl5qc></i></label> <label class="sx-switch" data-astro-cid-tqjbl5qc><input type="checkbox" name="dm_user"${addAttribute(config.dmUser, "checked")} data-astro-cid-tqjbl5qc><span class="sx-switch-text" data-astro-cid-tqjbl5qc><b data-astro-cid-tqjbl5qc>${dt("Send the account a DM that it may be hacked, with what to do")}</b></span><i class="sx-toggle" data-astro-cid-tqjbl5qc></i></label> </div> <div class="sx-grid" data-astro-cid-tqjbl5qc> <div class="sx-field" data-sx-needs="delete_messages" data-astro-cid-tqjbl5qc><label for="sc-back" data-astro-cid-tqjbl5qc>${dt("How far back (minutes)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "name": "delete_minutes", "id": "sc-back", "value": config.deleteMinutes, "min": "1", "max": "120", "data-astro-cid-tqjbl5qc": true })}</div> </div> </section> <section class="sx-panel sc-block" data-astro-cid-tqjbl5qc> <div class="sx-panel-head" data-astro-cid-tqjbl5qc><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-tqjbl5qc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magnifying-glass-bold", "width": "17", "height": "17", "data-astro-cid-tqjbl5qc": true })}</span><h2 data-astro-cid-tqjbl5qc>${dt("How it spots them")}</h2></div> <div class="sx-grid" data-astro-cid-tqjbl5qc> <div class="sx-field" data-astro-cid-tqjbl5qc><label for="sc-channels" data-astro-cid-tqjbl5qc>${dt("Same message in this many channels")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "name": "channels_threshold", "id": "sc-channels", "value": config.channelsThreshold, "min": "2", "max": "10", "data-astro-cid-tqjbl5qc": true })}</div> <div class="sx-field" data-astro-cid-tqjbl5qc><label for="sc-window" data-astro-cid-tqjbl5qc>${dt("In how many seconds")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "name": "window_seconds", "id": "sc-window", "value": config.windowSeconds, "min": "5", "max": "300", "data-astro-cid-tqjbl5qc": true })}</div> </div> <div class="sx-switches" data-astro-cid-tqjbl5qc> <label class="sx-switch" data-astro-cid-tqjbl5qc><input type="checkbox" name="scan_text"${addAttribute(config.scanText, "checked")} data-astro-cid-tqjbl5qc><span class="sx-switch-text" data-astro-cid-tqjbl5qc><b data-astro-cid-tqjbl5qc>${dt("Also look for the scam wording")}</b><em data-astro-cid-tqjbl5qc>${dt("MrBeast, claim your reward, USDT, withdrawal, casino...")}</em></span><i class="sx-toggle" data-astro-cid-tqjbl5qc></i></label> <label class="sx-switch" data-astro-cid-tqjbl5qc><input type="checkbox" name="scan_new_accounts"${addAttribute(config.scanNewAccounts, "checked")} data-astro-cid-tqjbl5qc><span class="sx-switch-text" data-astro-cid-tqjbl5qc><b data-astro-cid-tqjbl5qc>${dt("Be stricter with new accounts that send a picture or link")}</b></span><i class="sx-toggle" data-astro-cid-tqjbl5qc></i></label> </div> <div class="sx-grid" data-astro-cid-tqjbl5qc> <div class="sx-field" data-sx-needs="scan_new_accounts" data-astro-cid-tqjbl5qc><label for="sc-new" data-astro-cid-tqjbl5qc>${dt("A new account is younger than (hours)")}</label>${renderComponent($$result2, "SxNumber", $$SxNumber, { "name": "new_account_hours", "id": "sc-new", "value": config.newAccountHours, "min": "1", "max": "720", "data-astro-cid-tqjbl5qc": true })}</div> </div> </section> <section class="sx-panel sc-block" data-astro-cid-tqjbl5qc> <div class="sx-panel-head" data-astro-cid-tqjbl5qc><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-tqjbl5qc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:bell-ringing-fill", "width": "17", "height": "17", "data-astro-cid-tqjbl5qc": true })}</span><h2 data-astro-cid-tqjbl5qc>${dt("Alerts and exceptions")}</h2></div> <div class="sx-grid" data-astro-cid-tqjbl5qc> <div class="sx-field" data-astro-cid-tqjbl5qc><label for="sc-alert" data-astro-cid-tqjbl5qc>${dt("Alert channel (with Undo, Ban and Not a scam buttons)")}</label> <select name="alert_channel_id" id="sc-alert" data-astro-cid-tqjbl5qc><option value="" data-astro-cid-tqjbl5qc>${dt("The automod log")}</option>${textChannels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === config.alertChannelId, "selected")} data-astro-cid-tqjbl5qc>#${c.name}</option>`)}</select> </div> <div class="sx-field" data-astro-cid-tqjbl5qc><label for="sc-ping" data-astro-cid-tqjbl5qc>${dt("Role to ping")}</label> <select name="ping_role_id" id="sc-ping" data-astro-cid-tqjbl5qc><option value="" data-astro-cid-tqjbl5qc>${dt("Nobody")}</option>${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.id === config.pingRoleId, "selected")} data-astro-cid-tqjbl5qc>${r.name}</option>`)}</select> </div> <div class="sx-field sx-wide" data-astro-cid-tqjbl5qc><span class="sx-label" data-astro-cid-tqjbl5qc>${dt("Roles that are never checked")}</span>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "exempt_role_ids", "options": roles, "selected": config.exemptRoleIds, "placeholder": dt("Search roles..."), "data-astro-cid-tqjbl5qc": true })}</div> <div class="sx-field sx-wide" data-astro-cid-tqjbl5qc><span class="sx-label" data-astro-cid-tqjbl5qc>${dt("Channels that are never checked")}</span>${renderComponent($$result2, "MultiSelect", $$MultiSelect, { "name": "exempt_channel_ids", "options": channels, "selected": config.exemptChannelIds, "placeholder": dt("Search channels..."), "data-astro-cid-tqjbl5qc": true })}</div> </div> <p class="sx-hint sc-tip" data-astro-cid-tqjbl5qc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:lightbulb-fill", "width": "14", "height": "14", "data-astro-cid-tqjbl5qc": true })}${dt("Tip: leave it on Only alert for a few days, watch what it catches, then let it mute or ban on its own.")}</p> </section> <div class="sx-foot sc-foot" data-astro-cid-tqjbl5qc><button type="submit" class="btn btn-accent btn-sm" data-astro-cid-tqjbl5qc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-bold", "width": "13", "height": "13", "data-astro-cid-tqjbl5qc": true })}${dt("Save")}</button></div> </form> <section class="sx-panel sc-events-panel" data-astro-cid-tqjbl5qc> <div class="sx-panel-head" data-astro-cid-tqjbl5qc><span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-tqjbl5qc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-warning-fill", "width": "17", "height": "17", "data-astro-cid-tqjbl5qc": true })}</span><h2 data-astro-cid-tqjbl5qc>${dt("Latest scams caught")}</h2>${events.length > 0 && renderTemplate`<span class="sx-tag" data-astro-cid-tqjbl5qc>${events.length}</span>`}</div> ${events.length === 0 ? renderTemplate`<p class="sx-empty" data-astro-cid-tqjbl5qc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:shield-check-fill", "width": "16", "height": "16", "data-astro-cid-tqjbl5qc": true })}${dt("It has not caught anything yet.")}</p>` : renderTemplate`<div class="sx-list dgl-stagger" data-astro-cid-tqjbl5qc> ${events.map((e) => renderTemplate`<div class="sx-row sc-event" data-astro-cid-tqjbl5qc> <span class="sc-avatar" aria-hidden="true" data-astro-cid-tqjbl5qc>${(e.user_name ?? e.user_id).slice(0, 1).toUpperCase()}</span> <div class="sc-event-main" data-astro-cid-tqjbl5qc> <div class="sc-event-who" data-astro-cid-tqjbl5qc><b data-astro-cid-tqjbl5qc>${e.user_name ?? e.user_id}</b> <code data-astro-cid-tqjbl5qc>${e.user_id}</code></div> <span class="sc-event-what" data-astro-cid-tqjbl5qc>${signalNames[e.signal] ?? e.signal}${e.detail ? ` \xB7 ${e.detail}` : ""}</span> <span class="sc-event-tags" data-astro-cid-tqjbl5qc><span class="sx-tag sx-tag-red" data-astro-cid-tqjbl5qc>${actionNames[e.action] ?? e.action}</span><span class="sx-tag" data-astro-cid-tqjbl5qc>${e.deleted} ${dt("messages taken down")}</span><time class="sc-when" data-astro-cid-tqjbl5qc>${when(e.created_at)}</time></span> </div> </div>`)} </div>`} </section> </div> ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashAntiScam.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Antiscam = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Antiscam;
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
  const whole = (value, min, max, fallback) => {
    const n = Math.floor(Number(value));
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };
  const snowflake = (value) => {
    const v = String(value ?? "").trim();
    return SNOWFLAKE.test(v) ? v : null;
  };
  const ids = (name, form) => form.getAll(name).map(String).filter((v) => SNOWFLAKE.test(v)).slice(0, 50);
  let saved = false;
  let failed = false;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    await ensureGuildRow(apiUrl, apiHeaders, id);
    const action = String(form.get("action") ?? "alert");
    const res = await fetch(`${apiUrl}/rest/v1/scam_config?on_conflict=guild_id`, {
      method: "POST",
      headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        guild_id: id,
        enabled: form.get("enabled") === "on",
        action: ["alert", "timeout", "kick", "ban"].includes(action) ? action : "alert",
        timeout_minutes: whole(form.get("timeout_minutes"), 1, 40320, 120),
        delete_messages: form.get("delete_messages") === "on",
        delete_minutes: whole(form.get("delete_minutes"), 1, 120, 15),
        channels_threshold: whole(form.get("channels_threshold"), 2, 10, 3),
        window_seconds: whole(form.get("window_seconds"), 5, 300, 30),
        scan_text: form.get("scan_text") === "on",
        scan_new_accounts: form.get("scan_new_accounts") === "on",
        new_account_hours: whole(form.get("new_account_hours"), 1, 720, 72),
        dm_user: form.get("dm_user") === "on",
        alert_channel_id: snowflake(form.get("alert_channel_id")),
        ping_role_id: snowflake(form.get("ping_role_id")),
        exempt_role_ids: ids("exempt_role_ids", form),
        exempt_channel_ids: ids("exempt_channel_ids", form),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      })
    });
    saved = res.ok;
    failed = !res.ok;
  }
  const [guildInfo, configRes, eventsRes, rolesRes, channelsRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    () => fetch(`${apiUrl}/rest/v1/scam_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    () => fetch(`${apiUrl}/rest/v1/scam_events?guild_id=eq.${id}&select=*&order=created_at.desc&limit=20`, { headers: apiHeaders }),
    () => getGuildList(Astro2, id, botToken, "roles"),
    () => getGuildList(Astro2, id, botToken, "channels")
  ], 5);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const c = (configRes?.ok ? (await configRes.json())[0] : null) ?? {};
  const config = {
    enabled: c.enabled ?? false,
    action: c.action ?? "alert",
    timeoutMinutes: c.timeout_minutes ?? 120,
    deleteMessages: c.delete_messages ?? true,
    deleteMinutes: c.delete_minutes ?? 15,
    channelsThreshold: c.channels_threshold ?? 3,
    windowSeconds: c.window_seconds ?? 30,
    scanText: c.scan_text ?? true,
    scanNewAccounts: c.scan_new_accounts ?? true,
    newAccountHours: c.new_account_hours ?? 72,
    dmUser: c.dm_user ?? true,
    alertChannelId: c.alert_channel_id ?? "",
    pingRoleId: c.ping_role_id ?? "",
    exemptRoleIds: c.exempt_role_ids ?? [],
    exemptChannelIds: c.exempt_channel_ids ?? [],
    caught: c.caught ?? 0
  };
  const events = eventsRes?.ok ? await eventsRes.json() : [];
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone").map((r) => ({ id: r.id, name: r.name }));
  const channels = (channelsRes?.ok ? await channelsRes.json() : []).filter((x) => x.type === 0 || x.type === 5 || x.type === 4).map((x) => ({ id: x.id, name: x.name, category: x.type === 4 }));
  return renderTemplate`${renderComponent($$result, "DashAntiScam", $$DashAntiScam, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "config": config, "events": events, "roles": roles, "channels": channels, "saved": saved, "failed": failed })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/antiscam.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/antiscam.astro";
const $$url = "/dash/guild/[id]/antiscam";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Antiscam,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
