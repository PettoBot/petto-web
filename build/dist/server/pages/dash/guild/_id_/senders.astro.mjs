import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                            */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo } from '../../../../chunks/discord_CxeBz2tv.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashSenders = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashSenders;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, looks, features, ready, saved, failed } = Astro2.props;
  const labels = {
    quests: ["Quest alerts", "The alerts of new Quests and the quest method."],
    welcome: ["Welcome messages", "What is sent when someone joins."],
    leave: ["Leave messages", "What is sent when someone leaves."],
    boost: ["Boost messages", "What is sent when someone boosts the server."],
    sanctions: ["Sanction messages", "The public messages of bans, kicks, timeouts and warns."],
    levelup: ["Level-up messages", "What is sent when someone reaches a new level."],
    vanity: ["Vanity and Server Tag messages", "The thank-you when someone gets a role from a Vanity or Server Tag rule."],
    giveaways: ["Giveaway messages", "Winner announcements, claim messages and other giveaway replies."],
    bump: ["Bump messages", "The thank-you after a bump and the reminder for the next one."],
    tickets: ["Ticket messages", "The welcome, the claim notice and the closing card inside tickets."],
    automod: ["Automod notices", "The short notice when Petto removes a malicious link."],
    partners: ["Partner welcomes", "The welcome sent to a new partner manager."],
    votes: ["Vote thank-yous", "The thank-you when someone votes for the bot."],
    reminders: ["Reminders", "The reminders people ask Petto to send."],
    automessages: ["Auto messages", "The messages Petto sends by itself on a schedule."],
    rollouts: ["Rollout alerts", "The alerts of Discord rollouts in the channel you chose."],
    birthdays: ["Birthday messages", "The messages that celebrate a member's birthday."]
  };
  const errors = {
    name: 'Discord does not accept a webhook name with "discord" or "clyde" in it.',
    avatar: "The picture has to be a link that starts with https://.",
    empty: "Write a name, a picture link, or both.",
    save: "It could not be saved. Try again in a moment."
  };
  const own = features.filter((feature) => looks[feature].name || looks[feature].avatarUrl);
  const withName = features.filter((feature) => looks[feature].name).length;
  const withPicture = features.filter((feature) => looks[feature].avatarUrl).length;
  const PETTO_PICTURE = "/assets/mascot-icon.webp";
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "senders", "pageTitle": "Message look", "data-astro-cid-d2rxha5d": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", " ", '<div class="sx-page sd-page" data-astro-cid-d2rxha5d> <h1 data-astro-cid-d2rxha5d>', '</h1> <p class="sd-lead" data-astro-cid-d2rxha5d>', "</p> ", " ", " ", " ", ' <div class="sd-bar" data-astro-cid-d2rxha5d> <div class="sx-chips" role="radiogroup"', ' data-astro-cid-d2rxha5d> <label class="sx-chip" data-astro-cid-d2rxha5d><input type="radio" name="sd-filter" value="all" checked data-astro-cid-d2rxha5d><span data-astro-cid-d2rxha5d>', " \xB7 ", '</span></label> <label class="sx-chip" data-astro-cid-d2rxha5d><input type="radio" name="sd-filter" value="own" data-astro-cid-d2rxha5d><span data-astro-cid-d2rxha5d>', " \xB7 ", '</span></label> <label class="sx-chip" data-astro-cid-d2rxha5d><input type="radio" name="sd-filter" value="default" data-astro-cid-d2rxha5d><span data-astro-cid-d2rxha5d>', " \xB7 ", '</span></label> </div> </div> <div class="sd-list dgl-stagger" data-astro-cid-d2rxha5d> ', " </div> ", ' <p class="sd-note" data-astro-cid-d2rxha5d>', "", `</p> </div> <script>
    (function () {
      // After a save the page is drawn again with every row folded: the row that was saved opens again, so its message is seen in place.
      // The listeners are on the document and set once; the page is checked every time it is shown.
      function openSaved() {
        var flash = document.querySelector('[data-sd-flash]'); var stamp = 0; var feature = '';
        try { var raw = (sessionStorage.getItem('sdOpen') || '').split('|'); feature = raw[0]; stamp = Number(raw[1]) || 0; sessionStorage.removeItem('sdOpen'); } catch (e) { /* no storage */ }
        if (!flash || !feature || Date.now() - stamp > 20000) return;
        var row = document.querySelector('.sd-item[data-feature="' + feature.replace(/"/g, '') + '"]');
        if (row) { row.open = true; if (row.scrollIntoView) row.scrollIntoView({ block: 'nearest' }); }
      }
      if (!window.__sdBound) {
        window.__sdBound = true;
        document.addEventListener('submit', function (event) {
          var form = event.target;
          if (!form || !form.classList || !form.classList.contains('sd-form')) return;
          var feature = form.querySelector('input[name="feature"]');
          try { if (feature) sessionStorage.setItem('sdOpen', feature.value + '|' + Date.now()); } catch (e) { /* no storage */ }
        }, true);
        // The little preview follows what is typed: the name at once, the picture once its link is set.
        document.addEventListener('input', function (event) {
          var field = event.target;
          if (!field || !field.matches || !field.matches('.sd-form textarea[name="name"]')) return;
          var name = field.closest('.sd-body').querySelector('[data-sd-name]');
          if (name) name.textContent = field.value.trim() || name.getAttribute('data-default');
        });
        document.addEventListener('change', function (event) {
          var field = event.target;
          if (!field || !field.matches || !field.matches('.sd-form textarea[name="avatar_url"]')) return;
          var img = field.closest('.sd-body').querySelector('[data-sd-img]');
          if (!img) return;
          var link = field.value.trim();
          img.src = /^https:\\/\\//i.test(link) ? link : img.getAttribute('data-default');
        });
        // A picture that does not load shows Petto's.
        document.addEventListener('error', function (event) {
          var img = event.target;
          if (!img || !img.classList || !img.classList.contains('sd-av') || img.dataset.fallback) return;
          img.dataset.fallback = '1';
          img.src = '/assets/mascot-icon.webp';
        }, true);
      }
      openSaved();
    })();
  <\/script> `], [" ", " ", " ", '<div class="sx-page sd-page" data-astro-cid-d2rxha5d> <h1 data-astro-cid-d2rxha5d>', '</h1> <p class="sd-lead" data-astro-cid-d2rxha5d>', "</p> ", " ", " ", " ", ' <div class="sd-bar" data-astro-cid-d2rxha5d> <div class="sx-chips" role="radiogroup"', ' data-astro-cid-d2rxha5d> <label class="sx-chip" data-astro-cid-d2rxha5d><input type="radio" name="sd-filter" value="all" checked data-astro-cid-d2rxha5d><span data-astro-cid-d2rxha5d>', " \xB7 ", '</span></label> <label class="sx-chip" data-astro-cid-d2rxha5d><input type="radio" name="sd-filter" value="own" data-astro-cid-d2rxha5d><span data-astro-cid-d2rxha5d>', " \xB7 ", '</span></label> <label class="sx-chip" data-astro-cid-d2rxha5d><input type="radio" name="sd-filter" value="default" data-astro-cid-d2rxha5d><span data-astro-cid-d2rxha5d>', " \xB7 ", '</span></label> </div> </div> <div class="sd-list dgl-stagger" data-astro-cid-d2rxha5d> ', " </div> ", ' <p class="sd-note" data-astro-cid-d2rxha5d>', "", `</p> </div> <script>
    (function () {
      // After a save the page is drawn again with every row folded: the row that was saved opens again, so its message is seen in place.
      // The listeners are on the document and set once; the page is checked every time it is shown.
      function openSaved() {
        var flash = document.querySelector('[data-sd-flash]'); var stamp = 0; var feature = '';
        try { var raw = (sessionStorage.getItem('sdOpen') || '').split('|'); feature = raw[0]; stamp = Number(raw[1]) || 0; sessionStorage.removeItem('sdOpen'); } catch (e) { /* no storage */ }
        if (!flash || !feature || Date.now() - stamp > 20000) return;
        var row = document.querySelector('.sd-item[data-feature="' + feature.replace(/"/g, '') + '"]');
        if (row) { row.open = true; if (row.scrollIntoView) row.scrollIntoView({ block: 'nearest' }); }
      }
      if (!window.__sdBound) {
        window.__sdBound = true;
        document.addEventListener('submit', function (event) {
          var form = event.target;
          if (!form || !form.classList || !form.classList.contains('sd-form')) return;
          var feature = form.querySelector('input[name="feature"]');
          try { if (feature) sessionStorage.setItem('sdOpen', feature.value + '|' + Date.now()); } catch (e) { /* no storage */ }
        }, true);
        // The little preview follows what is typed: the name at once, the picture once its link is set.
        document.addEventListener('input', function (event) {
          var field = event.target;
          if (!field || !field.matches || !field.matches('.sd-form textarea[name="name"]')) return;
          var name = field.closest('.sd-body').querySelector('[data-sd-name]');
          if (name) name.textContent = field.value.trim() || name.getAttribute('data-default');
        });
        document.addEventListener('change', function (event) {
          var field = event.target;
          if (!field || !field.matches || !field.matches('.sd-form textarea[name="avatar_url"]')) return;
          var img = field.closest('.sd-body').querySelector('[data-sd-img]');
          if (!img) return;
          var link = field.value.trim();
          img.src = /^https:\\\\/\\\\//i.test(link) ? link : img.getAttribute('data-default');
        });
        // A picture that does not load shows Petto's.
        document.addEventListener('error', function (event) {
          var img = event.target;
          if (!img || !img.classList || !img.classList.contains('sd-av') || img.dataset.fallback) return;
          img.dataset.fallback = '1';
          img.src = '/assets/mascot-icon.webp';
        }, true);
      }
      openSaved();
    })();
  <\/script> `])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-d2rxha5d": true }), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-d2rxha5d": true }), maybeRenderHead(), dt("Message look"), dt("Choose the name and picture Petto uses when it sends each kind of message."), saved && renderTemplate`<div class="sx-flash" data-sd-flash data-astro-cid-d2rxha5d>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-d2rxha5d": true })}${dt("Saved.")}</div>`, failed && renderTemplate`<div class="sx-flash sx-flash-warn" data-sd-flash data-astro-cid-d2rxha5d>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-d2rxha5d": true })}${dt(errors[failed] ?? errors.save)}</div>`, !ready && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-d2rxha5d>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-d2rxha5d": true })}${dt("This arrives with the next Petto update.")}</div>`, renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("With your look"), value: own.length, tone: "messages" },
    { label: dt("With Petto's look"), value: features.length - own.length, tone: "voice" },
    { label: dt("Own names"), value: withName, tone: "invites" },
    { label: dt("Own pictures"), value: withPicture, tone: "joins" }
  ], "data-astro-cid-d2rxha5d": true }), addAttribute(dt("Show"), "aria-label"), dt("All"), features.length, dt("With your look"), own.length, dt("With Petto's look"), features.length - own.length, features.map((feature) => {
    const look = looks[feature];
    const custom = Boolean(look.name || look.avatarUrl);
    return renderTemplate`<details class="dfx-acc sd-item"${addAttribute(feature, "data-feature")}${addAttribute(custom ? "" : void 0, "data-own")} data-astro-cid-d2rxha5d> <summary data-astro-cid-d2rxha5d> <img class="sd-av"${addAttribute(look.avatarUrl || PETTO_PICTURE, "src")} alt="" width="38" height="38" loading="lazy" data-astro-cid-d2rxha5d> <span class="dfx-acc-title" data-astro-cid-d2rxha5d><b data-astro-cid-d2rxha5d>${dt(labels[feature][0])}</b><em data-astro-cid-d2rxha5d>${look.name ? look.name : dt(labels[feature][1])}</em></span> ${custom && renderTemplate`<span class="sx-tag sx-tag-accent sd-tag" data-astro-cid-d2rxha5d>${dt("Your look")}</span>`} ${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:caret-down-bold", "class": "dfx-caret", "width": "14", "height": "14", "data-astro-cid-d2rxha5d": true })} </summary> <div class="dfx-acc-body sd-body" data-astro-cid-d2rxha5d> <div class="sd-side" data-astro-cid-d2rxha5d> <p class="sx-hint" data-astro-cid-d2rxha5d>${dt(labels[feature][1])}</p> <div class="sd-prev" aria-hidden="true" data-astro-cid-d2rxha5d> <img class="sd-av"${addAttribute(look.avatarUrl || PETTO_PICTURE, "src")} alt="" width="38" height="38" loading="lazy" data-sd-img${addAttribute(PETTO_PICTURE, "data-default")} data-astro-cid-d2rxha5d> <div class="sd-prev-main" data-astro-cid-d2rxha5d> <div class="sd-prev-head" data-astro-cid-d2rxha5d><b data-sd-name data-default="Petto" data-astro-cid-d2rxha5d>${look.name || "Petto"}</b><span class="sd-app" data-astro-cid-d2rxha5d>APP</span></div> <span class="sd-line" style="width:82%" data-astro-cid-d2rxha5d></span> <span class="sd-line" style="width:54%" data-astro-cid-d2rxha5d></span> </div> </div> </div> <form method="POST" class="sd-form" data-astro-cid-d2rxha5d> <input type="hidden" name="feature"${addAttribute(feature, "value")} data-astro-cid-d2rxha5d> <div class="sx-field" data-astro-cid-d2rxha5d> <label${addAttribute(`sd-name-${feature}`, "for")} data-astro-cid-d2rxha5d>${dt("Name")}</label> <textarea${addAttribute(`sd-name-${feature}`, "id")} name="name" class="dgl-autogrow sx-one" rows="1" data-one-line data-count maxlength="80"${addAttribute(dt("Name (empty keeps Petto's)"), "placeholder")} data-astro-cid-d2rxha5d>${look.name}</textarea> </div> <div class="sx-field" data-astro-cid-d2rxha5d> <label${addAttribute(`sd-link-${feature}`, "for")} data-astro-cid-d2rxha5d>${dt("Picture link")}</label> <textarea${addAttribute(`sd-link-${feature}`, "id")} name="avatar_url" class="dgl-autogrow sx-one" rows="1" data-one-line maxlength="500" inputmode="url" autocomplete="off" spellcheck="false" placeholder="https://…" data-astro-cid-d2rxha5d>${look.avatarUrl}</textarea> </div> <div class="sx-foot" data-astro-cid-d2rxha5d> <button class="btn btn-accent btn-sm" type="submit"${addAttribute(!ready, "disabled")} data-astro-cid-d2rxha5d>${dt("Save")}</button> ${custom && renderTemplate`<button class="btn btn-ghost btn-sm" type="submit" name="action" value="reset" formnovalidate data-astro-cid-d2rxha5d>${dt("Use Petto's look")}</button>`} </div> </form> </div> </details>`;
  }), own.length === 0 && renderTemplate`<p class="sx-empty sd-none sd-none-own" data-astro-cid-d2rxha5d>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:user-circle-fill", "width": "18", "height": "18", "data-astro-cid-d2rxha5d": true })}${dt("No kind of message has a look of its own yet.")}</p>`, renderComponent($$result2, "Icon", $$Icon, { "name": "ph:info-fill", "width": "14", "height": "14", "data-astro-cid-d2rxha5d": true }), dt("Petto needs Manage Webhooks in the channel; without it the message is sent the normal way.")) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashSenders.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Senders = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Senders;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const FEATURES = ["quests", "welcome", "leave", "boost", "sanctions", "levelup", "vanity", "giveaways", "bump", "tickets", "automod", "partners", "votes", "reminders", "automessages", "rollouts", "birthdays"];
  const isHttps = (value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  };
  let saved = false;
  let failed = "";
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const feature = String(form.get("feature") ?? "");
    if (FEATURES.includes(feature)) {
      if (String(form.get("action") ?? "") === "reset") {
        saved = (await fetch(`${apiUrl}/rest/v1/sender_identities?guild_id=eq.${id}&feature=eq.${feature}`, { method: "DELETE", headers: { ...apiHeaders, Prefer: "return=minimal" } })).ok;
      } else {
        const name = String(form.get("name") ?? "").trim().slice(0, 80);
        const avatar = String(form.get("avatar_url") ?? "").trim().slice(0, 500);
        if (/discord|^clyde$/i.test(name)) failed = "name";
        else if (avatar && !isHttps(avatar)) failed = "avatar";
        else if (!name && !avatar) failed = "empty";
        else {
          const res = await fetch(`${apiUrl}/rest/v1/sender_identities?on_conflict=guild_id,feature`, {
            method: "POST",
            headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
            body: JSON.stringify({ guild_id: id, feature, name: name || null, avatar_url: avatar || null, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
          });
          saved = res.ok;
          if (!res.ok) failed = "save";
        }
      }
    }
  }
  const [guildInfo, rowsRes] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/sender_identities?guild_id=eq.${id}&select=*`, { headers: apiHeaders })
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = rowsRes.ok;
  const rows = ready ? await rowsRes.json() : [];
  const looks = Object.fromEntries(FEATURES.map((feature) => {
    const row = rows.find((entry) => entry.feature === feature);
    return [feature, { name: row?.name ?? "", avatarUrl: row?.avatar_url ?? "" }];
  }));
  return renderTemplate`${renderComponent($$result, "DashSenders", $$DashSenders, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "looks": looks, "features": FEATURES, "ready": ready, "saved": saved, "failed": failed })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/senders.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/senders.astro";
const $$url = "/dash/guild/[id]/senders";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Senders,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
