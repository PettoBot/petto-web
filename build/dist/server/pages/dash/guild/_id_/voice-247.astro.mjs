import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead, b as addAttribute } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$ChannelOptions } from '../../../../chunks/ChannelOptions_DK_gXtFz.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                              */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as runBatched } from '../../../../chunks/concurrency_PoJGtmqS.mjs';
export { renderers } from '../../../../renderers.mjs';

const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashVoice247 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashVoice247;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, row, channels, ready, saved, problem, maxStatus } = Astro2.props;
  const defaultStatus = dashLang === "es" ? "Viendo el servidor 24/7" : dashLang === "pt-BR" ? "Vendo o servidor 24/7" : "Watching the server 24/7";
  const chosen = row ? channels.find((channel) => channel.id === row.channelId) : null;
  const docsUrl = `https://wiki.petto.sbs${dashLang === "es" ? "/es" : dashLang === "pt-BR" ? "/pt-br" : ""}/utility/247`;
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "voice-247", "pageTitle": "Stay in voice", "data-astro-cid-zaot5kxo": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-zaot5kxo": true })} ${maybeRenderHead()}<div class="sx-page sv" data-astro-cid-zaot5kxo> <div class="sv-head" data-astro-cid-zaot5kxo> <h1 data-astro-cid-zaot5kxo>${dt("Stay in voice")}</h1> <a class="btn btn-sm"${addAttribute(docsUrl, "href")} target="_blank" rel="noopener" data-astro-cid-zaot5kxo>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:book-open-fill", "width": "13", "height": "13", "data-astro-cid-zaot5kxo": true })}${dt("Read the docs")}</a> </div> <p class="sx-lead" data-astro-cid-zaot5kxo>${dt("Petto joins a voice channel and stays there for good, also after it restarts, with a status written on the channel. It joins muted. If music is playing in the server, it waits and comes back when the music is over.")}</p> ${saved && renderTemplate`<div class="sx-flash" data-astro-cid-zaot5kxo>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-zaot5kxo": true })}${dt("Saved. Petto does it within a minute.")}</div>`} ${problem && renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-zaot5kxo>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-zaot5kxo": true })}${problem}</div>`} ${!ready && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-zaot5kxo>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plug-fill", "width": "15", "height": "15", "data-astro-cid-zaot5kxo": true })}${dt("Stay in voice is not available yet. Petto is being updated: try again in a few minutes.")}</div>`} <form method="POST" class="sx-panel sv-box" data-astro-cid-zaot5kxo> <div class="sx-panel-head" data-astro-cid-zaot5kxo><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-zaot5kxo>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:microphone-fill", "width": "17", "height": "17", "data-astro-cid-zaot5kxo": true })}</span><h2 data-astro-cid-zaot5kxo>${dt("Voice channel")}</h2>${row && renderTemplate`<span${addAttribute(["sx-tag", "sv-state", { "sv-on": row.enabled }], "class:list")} data-astro-cid-zaot5kxo>${row.enabled ? dt("On") : dt("Off")}</span>`}</div> <label class="sx-switch sv-switch" data-astro-cid-zaot5kxo><input type="checkbox" name="enabled" role="switch"${addAttribute(row ? row.enabled : true, "checked")}${addAttribute(!ready, "disabled")} data-astro-cid-zaot5kxo><span class="sx-toggle" data-astro-cid-zaot5kxo></span><span data-astro-cid-zaot5kxo>${dt("Stay in the channel")}</span></label> <div class="sx-field" data-astro-cid-zaot5kxo><label for="sv-channel" data-astro-cid-zaot5kxo>${dt("Channel")}</label> <select id="sv-channel" name="channel_id" required${addAttribute(!ready, "disabled")} data-astro-cid-zaot5kxo> <option value="" disabled${addAttribute(!chosen, "selected")} data-astro-cid-zaot5kxo>${dt("Pick a voice channel")}</option> ${renderComponent($$result2, "ChannelOptions", $$ChannelOptions, { "channels": channels, "selected": row?.channelId ?? "", "data-astro-cid-zaot5kxo": true })} </select> ${channels.length === 0 && renderTemplate`<p class="sx-hint" data-astro-cid-zaot5kxo>${dt("This server has no voice channels yet.")}</p>`} </div> <div class="sx-field" data-astro-cid-zaot5kxo><label for="sv-status" data-astro-cid-zaot5kxo>${dt("Status of the channel")}</label> <input id="sv-status" type="text" name="status"${addAttribute(maxStatus, "maxlength")}${addAttribute(row?.status ?? "", "value")}${addAttribute(defaultStatus, "placeholder")}${addAttribute(!ready, "disabled")} data-astro-cid-zaot5kxo> <p class="sx-hint" data-astro-cid-zaot5kxo>${dt('Shown under the name of the channel. Leave it empty for "{text}".', { text: defaultStatus })}</p> </div> <label class="sx-switch sv-switch" data-astro-cid-zaot5kxo><input type="checkbox" name="deaf" role="switch"${addAttribute(row ? row.deaf : true, "checked")}${addAttribute(!ready, "disabled")} data-astro-cid-zaot5kxo><span class="sx-toggle" data-astro-cid-zaot5kxo></span><span data-astro-cid-zaot5kxo>${dt("Join with the sound off")}</span></label> <p class="sx-hint sv-perm" data-astro-cid-zaot5kxo>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "14", "height": "14", "data-astro-cid-zaot5kxo": true })}${dt("Petto needs View Channel and Connect in the channel, and Set Voice Channel Status to write the status. Without that last one it stays in and leaves the status empty.")}</p> <div class="sx-foot" data-astro-cid-zaot5kxo><button type="submit" class="btn btn-accent btn-sm"${addAttribute(!ready, "disabled")} data-astro-cid-zaot5kxo>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:floppy-disk-fill", "width": "13", "height": "13", "data-astro-cid-zaot5kxo": true })}${dt("Save")}</button></div> </form> </div> ${renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-zaot5kxo": true })} ` })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashVoice247.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Voice247 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Voice247;
  const dt = makeT(getDashLang(Astro2));
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const SNOWFLAKE = /^\d{15,25}$/;
  const MAX_STATUS = 120;
  let saved = false;
  let problem = null;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    try {
      const channelId = String(form.get("channel_id") ?? "").trim();
      const status = String(form.get("status") ?? "").replace(/\s+/g, " ").trim();
      if (!SNOWFLAKE.test(channelId)) problem = dt("Pick the voice channel.");
      else if (status.length > MAX_STATUS) problem = dt("The status can have {n} characters at most.", { n: MAX_STATUS });
      else {
        const res = await fetch(`${apiUrl}/rest/v1/stay_voice?on_conflict=guild_id`, {
          method: "POST",
          headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ guild_id: id, channel_id: channelId, status: status && status.toLowerCase() !== "default" ? status : null, deaf: form.get("deaf") === "on", enabled: form.get("enabled") === "on", updated_by: session.userId ?? null, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
        });
        if (res.ok) saved = true;
        else problem = dt("It could not be saved. Try again in a moment.");
      }
    } catch (error) {
      console.error(`[voice-247] saving for ${id}:`, error?.message);
      problem = dt("It could not be saved. Try again in a moment.");
    }
  }
  const [guildInfo, rowRes, channelsRes] = await runBatched([
    () => getGuildInfo(id, botToken),
    () => fetch(`${apiUrl}/rest/v1/stay_voice?guild_id=eq.${id}&select=channel_id,status,deaf,enabled`, { headers }),
    () => getGuildList(Astro2, id, botToken, "channels")
  ], 3);
  const fallbackInfo = Astro2.request.method === "POST" && !guildInfo ? { name: dt("Server"), icon: null } : null;
  if (!guildInfo && !fallbackInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const serverInfo = guildInfo ?? fallbackInfo;
  const ready = rowRes.ok;
  const rows = ready ? await rowRes.json().catch(() => []) : [];
  const row = rows[0] ? { channelId: String(rows[0].channel_id), status: rows[0].status ? String(rows[0].status) : "", deaf: rows[0].deaf !== false, enabled: rows[0].enabled !== false } : null;
  const all = channelsRes.ok ? await channelsRes.json().catch(() => []) : [];
  const categories = new Map(all.filter((c) => c.type === 4).map((c) => [String(c.id), String(c.name)]));
  const channels = all.filter((c) => c.type === 2).sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0)).map((c) => ({ id: String(c.id), name: String(c.name), category: c.parent_id ? categories.get(String(c.parent_id)) : void 0 }));
  return renderTemplate`${renderComponent($$result, "DashVoice247", $$DashVoice247, { "user": session, "guildId": id, "guildName": serverInfo.name, "guildIcon": serverInfo.icon ?? "/assets/mascot-icon.webp", "row": row, "channels": channels, "ready": ready, "saved": saved, "problem": problem, "maxStatus": MAX_STATUS })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/voice-247.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/voice-247.astro";
const $$url = "/dash/guild/[id]/voice-247";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Voice247,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
