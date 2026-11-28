import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$EmojiPicker } from '../../../../chunks/EmojiPicker_0tfnRmiq.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                             */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { g as getGuildEmojis } from '../../../../chunks/guildEmojis_CIHVnrpZ.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashCounting = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashCounting;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, config, channels, roles, customEmojis = [], top, ready, saved, failed } = Astro2.props;
  const errors = { channel: dt("Choose a channel from the list."), role: dt("Choose a role from the list."), save: dt("It could not be saved. Try again in a moment.") };
  const switches = [
    { name: "math", on: config.math, label: dt("Sums count as a number"), hint: dt("2*3+1 is 7. Only whole numbers.") },
    { name: "reset_on_wrong", on: config.resetOnWrong, label: dt("A mistake sends the count back to the start"), hint: dt("If it is off, the count goes on from where it was.") },
    { name: "allow_double", on: config.allowDouble, label: dt("The same person can count twice in a row"), hint: dt("Off by default: someone else has to count in between.") },
    { name: "delete_wrong", on: config.deleteWrong, label: dt("Delete the wrong numbers"), hint: "" },
    { name: "announce_edits", on: config.announceEdits, label: dt("Say when the last number is edited or deleted"), hint: dt("So nobody counts from a number that is not there.") }
  ];
  const rate = config.totalCorrect + config.totalWrong ? Math.round(config.totalCorrect / (config.totalCorrect + config.totalWrong) * 100) : 0;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "counting", "pageTitle": dt("Counting"), "data-astro-cid-shmbxqz4": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-shmbxqz4": true })} ${maybeRenderHead()}<h1 data-astro-cid-shmbxqz4>${dt("Counting")}</h1> ${saved && renderTemplate`<div class="dfx-flash" data-astro-cid-shmbxqz4>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-shmbxqz4": true })}${dt("Saved.")}</div>`}${failed && renderTemplate`<div class="dfx-flash dfx-warn" data-astro-cid-shmbxqz4>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-shmbxqz4": true })}${errors[failed] ?? errors.save}</div>`}${!ready && renderTemplate`<div class="dfx-flash dfx-warn" data-astro-cid-shmbxqz4>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-shmbxqz4": true })}${dt("This arrives with the next Petto update.")}</div>`}<div class="ct-page" data-astro-cid-shmbxqz4> ${renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Now at"), value: config.current, tone: "messages" },
    { label: dt("Record"), value: config.highScore, tone: "reactions" },
    { label: dt("Right numbers"), value: config.totalCorrect, tone: "joins" },
    { label: dt("Mistakes"), value: config.totalWrong, tone: "leaves" },
    { label: dt("Accuracy (%)"), value: rate, tone: "voice" }
  ], "data-astro-cid-shmbxqz4": true })} <form method="POST" class="dfx-form" data-astro-cid-shmbxqz4> <label class="dfx-master" data-astro-cid-shmbxqz4><span data-astro-cid-shmbxqz4><b data-astro-cid-shmbxqz4>${dt("The counting game is on")}</b><em data-astro-cid-shmbxqz4>${dt("Members count one number at a time in the channel.")}</em></span><input type="checkbox" class="dfx-t" name="enabled"${addAttribute(config.enabled, "checked")} data-astro-cid-shmbxqz4></label> <section class="dfx-sec" data-astro-cid-shmbxqz4> <div class="dfx-sec-head" data-astro-cid-shmbxqz4><h2 data-astro-cid-shmbxqz4>${dt("The game")}</h2><p data-astro-cid-shmbxqz4>${dt("Where members count and from which number.")}</p></div> <div class="dfx-grid" data-astro-cid-shmbxqz4> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("Channel")}</label> <select name="channel_id" data-astro-cid-shmbxqz4> <option value="" data-astro-cid-shmbxqz4>${dt("Choose a channel")}</option> ${channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === config.channelId, "selected")} data-astro-cid-shmbxqz4>#${c.name}</option>`)} </select> <span class="dfx-hint" data-astro-cid-shmbxqz4>${dt("Members count here. Messages that are not numbers are left alone.")}</span> </div> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("The count starts after")}</label><input type="number" name="start_number" min="0" max="1000000"${addAttribute(config.startNumber, "value")} data-astro-cid-shmbxqz4><span class="dfx-hint" data-astro-cid-shmbxqz4>${dt("0 means the first number is 1.")}</span></div> </div> <div class="dfx-switches" data-astro-cid-shmbxqz4> ${switches.map((s) => renderTemplate`<label class="dfx-switch" data-astro-cid-shmbxqz4><span data-astro-cid-shmbxqz4><b data-astro-cid-shmbxqz4>${s.label}</b>${s.hint && renderTemplate`<em data-astro-cid-shmbxqz4>${s.hint}</em>`}</span><input type="checkbox" class="dfx-t"${addAttribute(s.name, "name")}${addAttribute(s.on, "checked")} data-astro-cid-shmbxqz4></label>`)} </div> </section> <section class="dfx-sec" data-astro-cid-shmbxqz4> <div class="dfx-sec-head" data-astro-cid-shmbxqz4><h2 data-astro-cid-shmbxqz4>${dt("Reactions and milestones")}</h2><p data-astro-cid-shmbxqz4>${dt("How Petto answers a number, and when it celebrates.")}</p></div> <div class="dfx-emoji-row" data-astro-cid-shmbxqz4> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("Right number")}</label><input type="text" name="react_ok" data-emoji-input${addAttribute(config.reactOk, "value")} maxlength="64" data-astro-cid-shmbxqz4></div> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("Wrong number")}</label><input type="text" name="react_bad" data-emoji-input${addAttribute(config.reactBad, "value")} maxlength="64" data-astro-cid-shmbxqz4></div> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("New record")}</label><input type="text" name="react_record" data-emoji-input${addAttribute(config.reactRecord, "value")} maxlength="64" data-astro-cid-shmbxqz4></div> </div> <div class="dfx-grid" data-astro-cid-shmbxqz4> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("Record reaction every this many numbers")}</label><input type="number" name="record_every" min="0" max="100000"${addAttribute(config.recordEvery, "value")} data-astro-cid-shmbxqz4><span class="dfx-hint" data-astro-cid-shmbxqz4>${dt("0 for never.")}</span></div> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("A message every this many numbers")}</label><input type="number" name="milestone_every" min="0" max="100000"${addAttribute(config.milestoneEvery, "value")} data-astro-cid-shmbxqz4><span class="dfx-hint" data-astro-cid-shmbxqz4>${dt("0 for none.")}</span></div> </div> </section> <section class="dfx-sec" data-astro-cid-shmbxqz4> <div class="dfx-sec-head" data-astro-cid-shmbxqz4><h2 data-astro-cid-shmbxqz4>${dt("Saves and mistakes")}</h2><p data-astro-cid-shmbxqz4>${dt("A save forgives a mistake; alerts and roles follow the people who get a number wrong.")}</p></div> <div class="dfx-grid" data-astro-cid-shmbxqz4> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("Saves the server can keep")}</label><input type="number" name="saves_max" min="0" max="5"${addAttribute(config.savesMax, "value")} data-astro-cid-shmbxqz4><span class="dfx-hint" data-astro-cid-shmbxqz4>${dt("A save forgives one mistake. 0 turns them off.")}</span></div> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("A save is earned every this many numbers")}</label><input type="number" name="save_every" min="10" max="10000"${addAttribute(config.saveEvery, "value")} data-astro-cid-shmbxqz4></div> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("Seconds until the alerts delete themselves")}</label><input type="number" name="alert_seconds" min="0" max="3600"${addAttribute(config.alertSeconds, "value")} data-astro-cid-shmbxqz4><span class="dfx-hint" data-astro-cid-shmbxqz4>${dt("The messages about a mistake. 0 keeps them.")}</span></div> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("Minutes the mistake role lasts")}</label><input type="number" name="wrong_role_minutes" min="0" max="10080"${addAttribute(config.wrongRoleMinutes, "value")} data-astro-cid-shmbxqz4><span class="dfx-hint" data-astro-cid-shmbxqz4>${dt("0 keeps it until their next right number.")}</span></div> </div> </section> <section class="dfx-sec" data-astro-cid-shmbxqz4> <div class="dfx-sec-head" data-astro-cid-shmbxqz4><h2 data-astro-cid-shmbxqz4>${dt("Roles")}</h2><p data-astro-cid-shmbxqz4>${dt("A role for the best counter and one for whoever slips.")}</p></div> <div class="dfx-grid" data-astro-cid-shmbxqz4> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("Role of the best counter")}</label> <select name="top_role_id" data-give-role data-astro-cid-shmbxqz4><option value="" data-astro-cid-shmbxqz4>${dt("None")}</option>${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.id === config.topRoleId, "selected")} data-astro-cid-shmbxqz4>${r.name}</option>`)}</select> <span class="dfx-hint" data-astro-cid-shmbxqz4>${dt("It moves to whoever has the most right numbers.")}</span> </div> <div class="dfx-field" data-astro-cid-shmbxqz4><label data-astro-cid-shmbxqz4>${dt("Role for who gets a number wrong")}</label> <select name="wrong_role_id" data-give-role data-astro-cid-shmbxqz4><option value="" data-astro-cid-shmbxqz4>${dt("None")}</option>${roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.id === config.wrongRoleId, "selected")} data-astro-cid-shmbxqz4>${r.name}</option>`)}</select> <span class="dfx-hint" data-astro-cid-shmbxqz4>${dt("Petto has to be above it.")}</span> </div> </div> </section> <div class="dfx-foot" data-astro-cid-shmbxqz4> <button class="btn btn-accent btn-sm" type="submit"${addAttribute(!ready, "disabled")} data-astro-cid-shmbxqz4>${dt("Save")}</button> <span class="dfx-hint" data-astro-cid-shmbxqz4>${dt("With the prefix: !counting setup, next, stats, leaderboard.")}</span> </div> </form> <section class="dfx-card ct-list" data-astro-cid-shmbxqz4> <h2 data-astro-cid-shmbxqz4>${dt("Who counts the most")}</h2> ${top.length === 0 && renderTemplate`<p class="dfx-empty" data-astro-cid-shmbxqz4>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hash-bold", "width": "16", "height": "16", "data-astro-cid-shmbxqz4": true })}${dt("Nobody has counted yet.")}</p>`} ${top.length > 0 && renderTemplate`<div class="ct-rows dgl-stagger" data-astro-cid-shmbxqz4> ${top.map((t, i) => renderTemplate`<div class="ct-row"${addAttribute(`--share:${Math.max(4, Math.round(t.correct / (top[0].correct || 1) * 100))}%`, "style")} data-astro-cid-shmbxqz4> <span${addAttribute(`ct-rank ct-rank-${i + 1}`, "class")} data-astro-cid-shmbxqz4>${i + 1}</span> <div class="ct-who" data-astro-cid-shmbxqz4><p data-astro-cid-shmbxqz4>${t.name ?? t.userId}</p><small data-astro-cid-shmbxqz4>${dt("{a} right \xB7 {b} mistakes \xB7 highest {c}", { a: t.correct, b: t.wrong, c: t.best })}</small><i class="ct-bar" aria-hidden="true" data-astro-cid-shmbxqz4></i></div> </div>`)} </div>`} </section> </div> ${renderComponent($$result2, "EmojiPicker", $$EmojiPicker, { "customEmojis": customEmojis, "data-astro-cid-shmbxqz4": true })} ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashCounting.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Counting = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Counting;
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
  let saved = false;
  let failed = "";
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const channelId = String(form.get("channel_id") ?? "").trim();
    const wrongRole = String(form.get("wrong_role_id") ?? "").trim();
    const topRole = String(form.get("top_role_id") ?? "").trim();
    const emoji = (key, fallback) => String(form.get(key) ?? "").trim().slice(0, 64) || fallback;
    if (channelId && !SNOWFLAKE.test(channelId)) failed = "channel";
    else if (wrongRole && !SNOWFLAKE.test(wrongRole) || topRole && !SNOWFLAKE.test(topRole)) failed = "role";
    else {
      await ensureGuildRow(apiUrl, apiHeaders, id);
      const res = await fetch(`${apiUrl}/rest/v1/counting_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          enabled: form.get("enabled") === "on",
          channel_id: channelId || null,
          allow_double: form.get("allow_double") === "on",
          math: form.get("math") === "on",
          reset_on_wrong: form.get("reset_on_wrong") === "on",
          delete_wrong: form.get("delete_wrong") === "on",
          announce_edits: form.get("announce_edits") === "on",
          react_ok: emoji("react_ok", "\u2705"),
          react_bad: emoji("react_bad", "\u274C"),
          react_record: emoji("react_record", "\u{1F3C6}"),
          saves_max: whole(form.get("saves_max"), 0, 5, 0),
          save_every: whole(form.get("save_every"), 10, 1e4, 100),
          milestone_every: whole(form.get("milestone_every"), 0, 1e5, 100),
          record_every: whole(form.get("record_every"), 0, 1e5, 100),
          start_number: whole(form.get("start_number"), 0, 1e6, 0),
          wrong_role_id: wrongRole || null,
          wrong_role_minutes: whole(form.get("wrong_role_minutes"), 0, 10080, 60),
          top_role_id: topRole || null,
          alert_seconds: whole(form.get("alert_seconds"), 0, 3600, 30),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      saved = res.ok;
      if (!res.ok) failed = "save";
    }
  }
  const [guildInfo, configRes, topRes, channelsRes, rolesRes, customEmojis] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/counting_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }).catch(() => null),
    fetch(`${apiUrl}/rest/v1/counting_users?guild_id=eq.${id}&select=user_id,correct,wrong,best&order=correct.desc&limit=10`, { headers: apiHeaders }).catch(() => null),
    getGuildList(Astro2, id, botToken, "channels"),
    getGuildList(Astro2, id, botToken, "roles"),
    getGuildEmojis(id, botToken)
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = Boolean(configRes?.ok);
  const row = ready ? (await configRes.json())[0] ?? {} : {};
  const channels = (channelsRes?.ok ? await channelsRes.json() : []).filter((c) => c.type === 0).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone" && !r.managed).sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const topRows = topRes?.ok ? await topRes.json() : [];
  const names = await Promise.all(topRows.map((r) => fetch(`https://discord.com/api/v10/users/${r.user_id}`, { headers: { Authorization: `Bot ${botToken}` }, signal: AbortSignal.timeout(3e3) }).then((res) => res.ok ? res.json() : null).then((u) => u?.global_name ?? u?.username ?? null).catch(() => null)));
  const top = topRows.map((r, i) => ({ userId: r.user_id, name: names[i], correct: r.correct, wrong: r.wrong, best: r.best }));
  const config = {
    enabled: row.enabled ?? false,
    channelId: row.channel_id ?? "",
    allowDouble: row.allow_double ?? false,
    math: row.math ?? true,
    resetOnWrong: row.reset_on_wrong ?? true,
    deleteWrong: row.delete_wrong ?? false,
    announceEdits: row.announce_edits ?? true,
    reactOk: row.react_ok ?? "\u2705",
    reactBad: row.react_bad ?? "\u274C",
    reactRecord: row.react_record ?? "\u{1F3C6}",
    savesMax: row.saves_max ?? 0,
    saveEvery: row.save_every ?? 100,
    milestoneEvery: row.milestone_every ?? 100,
    recordEvery: row.record_every ?? 100,
    startNumber: row.start_number ?? 0,
    wrongRoleId: row.wrong_role_id ?? "",
    wrongRoleMinutes: row.wrong_role_minutes ?? 60,
    topRoleId: row.top_role_id ?? "",
    alertSeconds: row.alert_seconds ?? 30,
    current: row.current_number ?? 0,
    highScore: row.high_score ?? 0,
    totalCorrect: row.total_correct ?? 0,
    totalWrong: row.total_wrong ?? 0
  };
  return renderTemplate`${renderComponent($$result, "DashCounting", $$DashCounting, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "config": config, "channels": channels, "roles": roles, "customEmojis": customEmojis, "top": top, "ready": ready, "saved": saved, "failed": failed })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/counting.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/counting.astro";
const $$url = "/dash/guild/[id]/counting";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Counting,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
