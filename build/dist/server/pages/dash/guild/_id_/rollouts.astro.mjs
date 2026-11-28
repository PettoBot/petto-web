import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, b as addAttribute, F as Fragment, u as unescapeHTML, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout, b as canUseRollouts } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { $ as $$SxNumber } from '../../../../chunks/SxNumber_YL4vNksH.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                             */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { v as validateTemplate, i as isV2Data } from '../../../../chunks/embedSchema_Bj4vwR3q.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashRollouts = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashRollouts;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, config, channels, roles, embedTemplates, ready, saved } = Astro2.props;
  const kinds = [["user", "Users experiments"], ["guild", "Servers experiments"], ["apex_user", "Users experiments (A/B)"], ["installation", "Installations experiments"]];
  const events = [["new", "A new experiment"], ["increase", "The rollout grows"], ["decrease", "The rollout shrinks"], ["status", "The status changes"]];
  const sections = [["variants", "Variants and their change"], ["ranges", "Ranges"], ["status", "Status"], ["platforms", "Platforms"], ["filters", "Filters"]];
  const EMOJIS = { rexperiment: "1558964304277938266", rup: "1558964315627720786", rstatus: "1558964324414783568", rplataform: "1558964325450911746", reload: "1533575051947802764", rranges: "1558964320770072627", rfilters: "1558964328617611324" };
  const e = (name) => `<img class="ro-emoji" src="https://cdn.discordapp.com/emojis/${EMOJIS[name]}.png?size=32" alt="" />`;
  const sample = { name: "Android media viewer full resolution", id: "2026-10-android-media-viewer-full-resolution", variants: ["Variant 0 (control): 50%", "Variant 1: 37.5% \u2192 50% (+12.5%)"], ranges: "Variant 1: (5000 - 10000)" };
  const kindsFollowed = config.kinds.length || kinds.length;
  const eventsFollowed = config.events.length || events.length;
  const ownDesigns = kinds.filter(([value]) => config.typeTemplates[value]).length;
  const useTemplate = config.style === "template";
  const stateText = { on: dt("On"), off: dt("Off") };
  const channelName = channels.find((ch) => ch.id === config.channelId)?.name;
  const roleName = roles.find((r) => r.id === config.roleId)?.name;
  const pickedNames = (list, picked) => list.filter(([value]) => picked.includes(value)).map(([, label]) => dt(label)).join(", ");
  const summary = [
    [dt("Alerts"), config.enabled ? stateText.on : stateText.off],
    [dt("Channel"), channelName ? `#${channelName}` : dt("None")],
    [dt("Role to ping"), roleName ?? dt("None")],
    [dt("Experiments"), config.kinds.length ? pickedNames(kinds, config.kinds) : dt("Every kind")],
    [dt("Events"), config.events.length ? pickedNames(events, config.events) : dt("Every event")],
    [dt("Message style"), useTemplate ? `${dt("A saved embed")}${config.embedTemplate ? `: ${config.embedTemplate}` : ""}` : dt("Petto card")]
  ];
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "rollouts", "pageTitle": "Rollout alerts", "data-astro-cid-mjkz6z2e": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", '<div class="sx-page ro-page" data-astro-cid-mjkz6z2e> <div class="sx-title" data-astro-cid-mjkz6z2e> <h1 data-astro-cid-mjkz6z2e>', "</h1> <span", " data-ro-state", "", " data-astro-cid-mjkz6z2e>", '</span> </div> <p class="ro-lead" data-astro-cid-mjkz6z2e>', "</p> ", " ", " ", ' <div class="ro-grid" data-astro-cid-mjkz6z2e> <form method="POST" class="sx-stack ro-form" data-astro-cid-mjkz6z2e> <section class="sx-panel" data-astro-cid-mjkz6z2e> <div class="sx-panel-head" data-astro-cid-mjkz6z2e><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-mjkz6z2e>', "</span><h2 data-astro-cid-mjkz6z2e>", '</h2></div> <label class="sx-switch sx-master" data-astro-cid-mjkz6z2e><input type="checkbox" name="enabled"', ' data-ro-enabled data-astro-cid-mjkz6z2e><span class="sx-switch-text" data-astro-cid-mjkz6z2e><b data-astro-cid-mjkz6z2e>', "</b><em data-astro-cid-mjkz6z2e>", '</em></span><i class="sx-toggle" data-astro-cid-mjkz6z2e></i></label> <div class="sx-grid" data-astro-cid-mjkz6z2e> <div class="sx-field" data-astro-cid-mjkz6z2e><label for="ro-channel" data-astro-cid-mjkz6z2e>', '</label> <select id="ro-channel" name="channel_id" data-astro-cid-mjkz6z2e><option value="" data-astro-cid-mjkz6z2e>', "</option>", '</select> </div> <div class="sx-field" data-astro-cid-mjkz6z2e><label for="ro-role" data-astro-cid-mjkz6z2e>', '</label> <select id="ro-role" name="role_id" data-astro-cid-mjkz6z2e><option value="" data-astro-cid-mjkz6z2e>', "</option>", '</select> </div> </div> </section> <section class="sx-panel" data-astro-cid-mjkz6z2e> <div class="sx-panel-head" data-astro-cid-mjkz6z2e><span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-mjkz6z2e>', "</span><h2 data-astro-cid-mjkz6z2e>", '</h2></div> <p class="sx-lead" data-astro-cid-mjkz6z2e>', '</p> <div class="sx-field" data-astro-cid-mjkz6z2e> <span class="sx-label" data-astro-cid-mjkz6z2e>', '</span> <div class="sx-chips" data-astro-cid-mjkz6z2e>', '</div> <span class="sx-hint" data-astro-cid-mjkz6z2e>', '</span> </div> <div class="sx-field" data-astro-cid-mjkz6z2e> <span class="sx-label" data-astro-cid-mjkz6z2e>', '</span> <div class="sx-chips" data-astro-cid-mjkz6z2e>', '</div> <span class="sx-hint" data-astro-cid-mjkz6z2e>', '</span> </div> <div class="sx-sub" data-astro-cid-mjkz6z2e> <div class="sx-field" data-astro-cid-mjkz6z2e><label for="ro-min" data-astro-cid-mjkz6z2e>', "</label>", '</div> <div class="sx-switches ro-one" data-astro-cid-mjkz6z2e><label class="sx-switch" data-astro-cid-mjkz6z2e><input type="checkbox" name="include_unrolled"', ' data-astro-cid-mjkz6z2e><span class="sx-switch-text" data-astro-cid-mjkz6z2e><b data-astro-cid-mjkz6z2e>', '</b></span><i class="sx-toggle" data-astro-cid-mjkz6z2e></i></label></div> </div> </section> <section class="sx-panel" data-astro-cid-mjkz6z2e> <div class="sx-panel-head" data-astro-cid-mjkz6z2e><span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-mjkz6z2e>', "</span><h2 data-astro-cid-mjkz6z2e>", '</h2></div> <div class="sx-chips" role="radiogroup"', ' data-astro-cid-mjkz6z2e> <label class="sx-chip" data-astro-cid-mjkz6z2e><input type="radio" name="style" value="card"', " data-astro-cid-mjkz6z2e><span data-astro-cid-mjkz6z2e>", '</span></label> <label class="sx-chip" data-astro-cid-mjkz6z2e><input type="radio" name="style" value="template"', " data-astro-cid-mjkz6z2e><span data-astro-cid-mjkz6z2e>", '</span></label> </div> <div class="sx-sub" id="ro-template-field" data-sx-needs="style=template" data-astro-cid-mjkz6z2e> <div class="sx-field" data-astro-cid-mjkz6z2e><label for="ro-embed" data-astro-cid-mjkz6z2e>', '</label> <select id="ro-embed" name="embed_template" data-astro-cid-mjkz6z2e><option value="" data-astro-cid-mjkz6z2e>', "</option>", '</select> <span class="sx-hint" data-astro-cid-mjkz6z2e>', '</span> </div> <div class="ro-actions" data-astro-cid-mjkz6z2e> ', ' <button type="submit" form="ro-design-form" class="btn btn-ghost btn-sm"', " data-astro-cid-mjkz6z2e>", "", '</button> </div> </div> <div class="sx-sub" id="ro-card-options" data-sx-needs="style=card" data-astro-cid-mjkz6z2e> <div class="sx-field" data-astro-cid-mjkz6z2e> <span class="sx-label" data-astro-cid-mjkz6z2e>', '</span> <div class="sx-chips" data-astro-cid-mjkz6z2e>', '</div> </div> <div class="sx-field ro-color" data-astro-cid-mjkz6z2e><label for="ro-color" data-astro-cid-mjkz6z2e>', '</label> <div class="ro-color-row" data-astro-cid-mjkz6z2e><i class="ro-swatch" data-ro-swatch', ' data-astro-cid-mjkz6z2e></i><input type="text" name="accent_color" id="ro-color"', ' placeholder="#ff91c2" maxlength="7" autocomplete="off" data-astro-cid-mjkz6z2e></div> <span class="sx-hint" data-astro-cid-mjkz6z2e>', '</span> </div> </div> </section> <section class="sx-panel" data-astro-cid-mjkz6z2e> <div class="sx-panel-head" data-astro-cid-mjkz6z2e><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-mjkz6z2e>', "</span><h2 data-astro-cid-mjkz6z2e>", '</h2></div> <p class="sx-lead" data-astro-cid-mjkz6z2e>', '</p> <div class="sx-grid" data-astro-cid-mjkz6z2e> ', ' </div> </section> <div class="sx-foot" data-astro-cid-mjkz6z2e> <button type="submit" class="btn btn-accent btn-sm"', " data-astro-cid-mjkz6z2e>", '</button> <p class="sx-hint ro-batch" data-astro-cid-mjkz6z2e>', "", '</p> </div> </form> <aside class="ro-side" data-astro-cid-mjkz6z2e> <section class="sx-panel" data-astro-cid-mjkz6z2e> <div class="sx-panel-head" data-astro-cid-mjkz6z2e><span class="sx-panel-icon" style="--c:var(--accent)" data-astro-cid-mjkz6z2e>', "</span><h2 data-astro-cid-mjkz6z2e>", '</h2></div> <dl class="ro-sum" data-astro-cid-mjkz6z2e> ', ' </dl> </section> <section class="sx-panel ro-preview"', ' data-astro-cid-mjkz6z2e> <div class="sx-panel-head" data-astro-cid-mjkz6z2e><span class="sx-panel-icon" style="--c:var(--green)" data-astro-cid-mjkz6z2e>', "</span><h2 data-astro-cid-mjkz6z2e>", '</h2></div> <div class="ro-msg" id="ro-card"', "", ' data-astro-cid-mjkz6z2e> <div class="ro-head" data-astro-cid-mjkz6z2e> <div class="ro-title" data-astro-cid-mjkz6z2e>', " <b data-astro-cid-mjkz6z2e>", '</b></div> <span class="ro-chip" data-astro-cid-mjkz6z2e>+12.5% (50%)</span> </div> <hr data-astro-cid-mjkz6z2e> <div class="ro-lines" data-astro-cid-mjkz6z2e> <div data-astro-cid-mjkz6z2e>', " <b data-astro-cid-mjkz6z2e>", ":</b> ", '</div> <div data-part="status" data-astro-cid-mjkz6z2e>', " <b data-astro-cid-mjkz6z2e>", ":</b> ", '</div> <div data-part="platforms" data-astro-cid-mjkz6z2e>', " <b data-astro-cid-mjkz6z2e>", ':</b> android, desktop</div> <div data-astro-cid-mjkz6z2e><a class="ro-id" data-astro-cid-mjkz6z2e><code data-astro-cid-mjkz6z2e>', '</code></a></div> </div> <div data-part="variants" data-astro-cid-mjkz6z2e><hr data-astro-cid-mjkz6z2e><div class="ro-h2" data-astro-cid-mjkz6z2e>', " <b data-astro-cid-mjkz6z2e>", '</b></div><pre class="ro-code" data-astro-cid-mjkz6z2e>', '</pre></div> <div data-part="ranges" data-astro-cid-mjkz6z2e><div class="ro-h2" data-astro-cid-mjkz6z2e>', " ", '</div><pre class="ro-code" data-astro-cid-mjkz6z2e>', '</pre></div> <div data-part="filters" data-astro-cid-mjkz6z2e><hr data-astro-cid-mjkz6z2e><div class="ro-h2" data-astro-cid-mjkz6z2e>', " ", '</div><div class="ro-lines" data-astro-cid-mjkz6z2e><div data-astro-cid-mjkz6z2e>\u2022 ', '</div></div></div> </div> <div class="ro-design" id="ro-design"', " data-astro-cid-mjkz6z2e> ", " <p data-astro-cid-mjkz6z2e>", " <b data-ro-design-name data-astro-cid-mjkz6z2e>", '</b></p> <span class="sx-hint" data-astro-cid-mjkz6z2e>', '</span> </div> <p class="sx-hint" data-astro-cid-mjkz6z2e>', `</p> </section> </aside> </div> <form method="POST" id="ro-design-form" data-no-dirty data-astro-cid-mjkz6z2e><input type="hidden" name="action" value="create_design" data-astro-cid-mjkz6z2e></form> </div> <script>
    (function () {
      // The preview follows the form: the parts the card hides, its color, and which of the two looks is on. It reads the page each time, so it
      // also works when the page is opened from the side menu.
      function update() {
        var card = document.getElementById('ro-card'); if (!card) return;
        document.querySelectorAll('[data-hide]').forEach(function (box) {
          card.querySelectorAll('[data-part="' + box.dataset.hide + '"]').forEach(function (el) { el.hidden = box.checked; });
        });
        var color = document.getElementById('ro-color'); var swatch = document.querySelector('[data-ro-swatch]');
        var valid = color && /^#?[0-9a-f]{6}$/i.test(color.value.trim()); var hex = valid ? '#' + color.value.trim().replace('#', '') : '';
        if (hex) { card.style.setProperty('--ro-accent', hex); if (swatch) swatch.style.setProperty('--sw', hex); }
        else { card.style.removeProperty('--ro-accent'); if (swatch) swatch.style.removeProperty('--sw'); }
        var style = document.querySelector('input[name="style"]:checked'); var template = style && style.value === 'template';
        card.hidden = Boolean(template);
        var design = document.getElementById('ro-design'); if (design) design.hidden = !template;
        var pick = document.getElementById('ro-embed'); var name = document.querySelector('[data-ro-design-name]');
        if (pick && name && pick.value) name.textContent = pick.value;
        var on = document.querySelector('[data-ro-enabled]'); var pill = document.querySelector('[data-ro-state]');
        if (on && pill) { pill.classList.toggle('on', on.checked); pill.textContent = on.checked ? pill.getAttribute('data-on') : pill.getAttribute('data-off'); }
      }
      if (!window.__roWatch) { window.__roWatch = true; document.addEventListener('input', update); document.addEventListener('change', update); }
      update();
    })();
  <\/script> `])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-mjkz6z2e": true }), maybeRenderHead(), dt("Rollout alerts"), addAttribute(["sx-pill-state", { on: config.enabled }], "class:list"), addAttribute(stateText.on, "data-on"), addAttribute(stateText.off, "data-off"), config.enabled ? stateText.on : stateText.off, dt("Petto posts a message when Discord starts an experiment or changes how many people get it."), saved && renderTemplate`<div class="sx-flash" data-astro-cid-mjkz6z2e>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-mjkz6z2e": true })}${dt("Saved.")}</div>`, !ready && renderTemplate`<div class="sx-flash sx-flash-warn" data-astro-cid-mjkz6z2e>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-mjkz6z2e": true })}${dt("This arrives with the next Petto update.")}</div>`, renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Kinds followed"), value: kindsFollowed, tone: "voice" },
    { label: dt("Events followed"), value: eventsFollowed, tone: "invites" },
    { label: dt("Smallest change"), value: 0, text: dt("{n} pts", { n: config.minChange.toLocaleString(dashLang) }), tone: "reactions" },
    { label: dt("Own designs"), value: ownDesigns, tone: "messages" }
  ], "data-astro-cid-mjkz6z2e": true }), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:bell-ringing-fill", "width": "17", "height": "17", "data-astro-cid-mjkz6z2e": true }), dt("Where it goes"), addAttribute(config.enabled, "checked"), dt("Send alerts"), dt("While this is off, nothing is posted."), dt("Channel"), dt("None"), channels.map((ch) => renderTemplate`<option${addAttribute(ch.id, "value")}${addAttribute(ch.id === config.channelId, "selected")} data-astro-cid-mjkz6z2e>#${ch.name}</option>`), dt("Role to ping"), dt("None"), roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.id === config.roleId, "selected")} data-astro-cid-mjkz6z2e>${r.name}</option>`), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:funnel-fill", "width": "17", "height": "17", "data-astro-cid-mjkz6z2e": true }), dt("What to announce"), dt("Pick only what you care about. Leaving a group empty means all of it."), dt("Only these experiments"), kinds.map(([value, label]) => renderTemplate`<label class="sx-chip" data-astro-cid-mjkz6z2e><input type="checkbox" name="kinds"${addAttribute(value, "value")}${addAttribute(config.kinds.includes(value), "checked")} data-astro-cid-mjkz6z2e><span data-astro-cid-mjkz6z2e>${dt(label)}</span></label>`), dt("Leave all empty for every kind."), dt("Only these events"), events.map(([value, label]) => renderTemplate`<label class="sx-chip" data-astro-cid-mjkz6z2e><input type="checkbox" name="events"${addAttribute(value, "value")}${addAttribute(config.events.includes(value), "checked")} data-astro-cid-mjkz6z2e><span data-astro-cid-mjkz6z2e>${dt(label)}</span></label>`), dt("Leave all empty for every event."), dt("Ignore changes smaller than (percentage points)"), renderComponent($$result2, "SxNumber", $$SxNumber, { "id": "ro-min", "name": "min_change", "min": "0", "max": "100", "step": "0.5", "value": config.minChange, "data-astro-cid-mjkz6z2e": true }), addAttribute(config.includeUnrolled, "checked"), dt("Also announce new experiments that have no rollout yet"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paint-brush-fill", "width": "17", "height": "17", "data-astro-cid-mjkz6z2e": true }), dt("How the message looks"), addAttribute(dt("Message style"), "aria-label"), addAttribute(!useTemplate, "checked"), dt("Petto card"), addAttribute(useTemplate, "checked"), dt("A saved embed"), dt("Saved embed"), dt("None"), embedTemplates.map((tpl) => renderTemplate`<option${addAttribute(tpl.name, "value")}${addAttribute(tpl.name === config.embedTemplate, "selected")} data-astro-cid-mjkz6z2e>${tpl.name}${tpl.v2 ? " (V2)" : ""}</option>`), dt("It can use the rollout variables, such as {rollout.name}, {rollout.change} and {rollout.variants}. If it is missing, the card is sent."), config.embedTemplate && renderTemplate`<a class="btn btn-ghost btn-sm"${addAttribute(`/dash/guild/${guildId}/embeds?name=${encodeURIComponent(config.embedTemplate)}`, "href")} data-astro-cid-mjkz6z2e>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:pencil-simple-bold", "width": "13", "height": "13", "data-astro-cid-mjkz6z2e": true })}${dt("Edit this design")}</a>`, addAttribute(!ready, "disabled"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:magic-wand-fill", "width": "13", "height": "13", "data-astro-cid-mjkz6z2e": true }), dt("Make a V2 design from the Petto card"), dt("What the card hides"), sections.map(([value, label]) => renderTemplate`<label class="sx-chip" data-astro-cid-mjkz6z2e><input type="checkbox"${addAttribute(`hide_${value}`, "name")}${addAttribute(value, "data-hide")}${addAttribute(config.hideSections.includes(value), "checked")} data-astro-cid-mjkz6z2e><span data-astro-cid-mjkz6z2e>${dt(label)}</span></label>`), dt("Card color"), addAttribute(config.accentColor ? `--sw:${config.accentColor}` : "", "style"), addAttribute(config.accentColor, "value"), dt("Empty sends the card with no color."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:palette-fill", "width": "17", "height": "17", "data-astro-cid-mjkz6z2e": true }), dt("A different design for each kind"), dt("Choose a saved embed (normal or V2) for the kinds of experiment you want to look different. An experiment uses the one of its kind; if there is none, the general design above."), kinds.map(([value, label]) => renderTemplate`<div class="sx-field" data-astro-cid-mjkz6z2e> <label${addAttribute(`ro-type-${value}`, "for")} data-astro-cid-mjkz6z2e>${dt(label)}</label> <select${addAttribute(`ro-type-${value}`, "id")}${addAttribute(`type_template_${value}`, "name")} data-astro-cid-mjkz6z2e><option value="" data-astro-cid-mjkz6z2e>${dt("The general design")}</option>${embedTemplates.map((tpl) => renderTemplate`<option${addAttribute(tpl.name, "value")}${addAttribute(tpl.name === config.typeTemplates[value], "selected")} data-astro-cid-mjkz6z2e>${tpl.name}${tpl.v2 ? " (V2)" : ""}</option>`)}</select> </div>`), addAttribute(!ready, "disabled"), dt("Save changes"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:stack-fill", "width": "14", "height": "14", "data-astro-cid-mjkz6z2e": true }), dt("When many changes arrive at once, Petto sends them in order, a message every few seconds, grouped in cards of up to 10 changes, so a big day never floods the channel."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "17", "height": "17", "data-astro-cid-mjkz6z2e": true }), dt("Saved now"), summary.map(([label, value]) => renderTemplate`<div data-astro-cid-mjkz6z2e><dt data-astro-cid-mjkz6z2e>${label}</dt><dd data-astro-cid-mjkz6z2e>${value}</dd></div>`), addAttribute(dt("Preview"), "aria-label"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "17", "height": "17", "data-astro-cid-mjkz6z2e": true }), dt("Preview"), addAttribute(config.accentColor ? `--ro-accent:${config.accentColor}` : "", "style"), addAttribute(useTemplate, "hidden"), renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(e("rexperiment"))}` }), sample.name, renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(e("rexperiment"))}` }), dt("Kind"), dt("Users experiment (A/B)"), renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(e("rstatus"))}` }), dt("Status"), dt("A/B test"), renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(e("rplataform"))}` }), dt("Platforms"), sample.id, renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(e("reload"))}` }), dt("Rollouts"), sample.variants.join("\n"), renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(e("rranges"))}` }), dt("Ranges"), sample.ranges, renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(e("rfilters"))}` }), dt("Filters"), dt("Servers of 3 to 50 members"), addAttribute(!useTemplate, "hidden"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paint-brush-fill", "width": "22", "height": "22", "data-astro-cid-mjkz6z2e": true }), dt("The alert is your saved embed:"), config.embedTemplate || dt("None"), dt("If it is missing, the Petto card is sent."), dt("A rough preview. Discord draws the real message.")) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashRollouts.astro", void 0);

function rolloutStarterV2() {
  return {
    components: [{
      type: 17,
      accent_color: null,
      components: [
        { type: 9, components: [{ type: 10, content: "**{rollout.kind_icon} {rollout.name}**" }, { type: 10, content: "- {rollout.kind_icon} **Kind:** {rollout.kind}\n- <:pe_rstatus:1558964324414783568> **Status:** {rollout.status}\n- <:pe_rplataform:1558964325450911746> **Platforms:** {rollout.platforms}\n- [`{rollout.id}`](https://gist.github.com/agnonotdev/fb2b6a7ba1301733aa5c2050b3e59a18)" }], accessory: { type: 2, style: 3, label: "{rollout.badge}", custom_id: "display" } },
        { type: 14, divider: true, spacing: 1 },
        { type: 10, content: "### <:pe_reload:1533575051947802764> Rollouts\n```py\n{rollout.variants}\n```\n### <:pe_rranges:1558964320770072627> Ranges\n```py\n{rollout.ranges}\n```" }
      ]
    }]
  };
}

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Rollouts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Rollouts;
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  const { session } = auth;
  if (!canUseRollouts(Astro2, session.userId)) return Astro2.redirect(`/dash/guild/${id}/overview`);
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const KINDS = ["user", "guild", "apex_user", "installation"];
  const EVENTS = ["new", "increase", "decrease", "status"];
  const SECTIONS = ["variants", "ranges", "status", "platforms", "filters"];
  let saved = false;
  let tableMissing = false;
  const snowflake = (value) => /^\d{15,25}$/.test(String(value ?? "").trim()) ? String(value).trim() : null;
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    if (String(form.get("action") ?? "") === "create_design") {
      const taken = new Set((await (await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name`, { headers: apiHeaders })).json().catch(() => [])).map((row) => row.name));
      let name = "rollout-alert";
      for (let n = 2; taken.has(name) && n < 50; n += 1) name = `rollout-alert-${n}`;
      const checked = validateTemplate({ v2: rolloutStarterV2() });
      if (checked.ok) {
        const created = await fetch(`${apiUrl}/rest/v1/embed_templates`, { method: "POST", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify({ guild_id: id, name, data: checked.data }) });
        if (created.ok) {
          await fetch(`${apiUrl}/rest/v1/rollout_config?on_conflict=guild_id`, { method: "POST", headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: id, style: "template", embed_template: name, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
          return Astro2.redirect(`/dash/guild/${id}/embeds?name=${encodeURIComponent(name)}`);
        }
      }
      return Astro2.redirect(`/dash/guild/${id}/rollouts`);
    }
    const typeMap = Object.fromEntries(KINDS.map((kind) => [kind, String(form.get(`type_template_${kind}`) ?? "").trim().slice(0, 40)]).filter(([, name]) => name));
    const pick = (name, allowed) => form.getAll(name).map(String).filter((value) => allowed.includes(value));
    const hex = String(form.get("accent_color") ?? "").trim().replace(/^#/, "");
    const res = await fetch(`${apiUrl}/rest/v1/rollout_config?on_conflict=guild_id`, {
      method: "POST",
      headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        guild_id: id,
        enabled: form.get("enabled") === "on",
        channel_id: snowflake(form.get("channel_id")),
        role_id: snowflake(form.get("role_id")),
        style: String(form.get("style") ?? "card") === "template" ? "template" : "card",
        embed_template: String(form.get("embed_template") ?? "").trim().slice(0, 40) || null,
        kinds: pick("kinds", KINDS),
        events: pick("events", EVENTS),
        min_change: Math.max(0, Math.min(100, Number(form.get("min_change") ?? 0) || 0)),
        include_unrolled: form.get("include_unrolled") === "on",
        hide_sections: SECTIONS.filter((section) => form.get(`hide_${section}`) === "on"),
        accent_color: /^[0-9a-f]{6}$/i.test(hex) ? parseInt(hex, 16) : null,
        type_templates: typeMap,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      })
    });
    saved = res.ok;
    tableMissing = !res.ok;
  }
  const [guildInfo, configRes, channelsRes, rolesRes, templatesRes] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/rollout_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }),
    getGuildList(Astro2, id, botToken, "channels"),
    getGuildList(Astro2, id, botToken, "roles"),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name,data&order=name.asc`, { headers: apiHeaders })
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = configRes.ok && !tableMissing;
  const c = (ready ? (await configRes.json())[0] : null) ?? {};
  const config = {
    enabled: c.enabled ?? false,
    channelId: c.channel_id ?? "",
    roleId: c.role_id ?? "",
    style: c.style ?? "card",
    embedTemplate: c.embed_template ?? "",
    kinds: c.kinds ?? [],
    events: c.events ?? [],
    minChange: Number(c.min_change ?? 0) || 0,
    includeUnrolled: c.include_unrolled ?? false,
    hideSections: c.hide_sections ?? [],
    accentColor: Number.isInteger(c.accent_color) ? `#${c.accent_color.toString(16).padStart(6, "0")}` : "",
    typeTemplates: c.type_templates && typeof c.type_templates === "object" ? c.type_templates : {}
  };
  const channels = (channelsRes.ok ? await channelsRes.json() : []).filter((ch) => ch.type === 0 || ch.type === 5).sort((a, b) => a.position - b.position).map((ch) => ({ id: ch.id, name: ch.name }));
  const roles = (rolesRes.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone").sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const embedTemplates = (templatesRes.ok ? await templatesRes.json() : []).map((row) => ({ name: row.name, v2: isV2Data(row.data) }));
  return renderTemplate`${renderComponent($$result, "DashRollouts", $$DashRollouts, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "config": config, "channels": channels, "roles": roles, "embedTemplates": embedTemplates, "ready": ready, "saved": saved })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/rollouts.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/rollouts.astro";
const $$url = "/dash/guild/[id]/rollouts";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Rollouts,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
