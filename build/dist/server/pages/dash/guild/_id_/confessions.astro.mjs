import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$ColorPicker } from '../../../../chunks/ColorPicker_DwzcbTkv.mjs';
import { $ as $$DashFormKit } from '../../../../chunks/DashFormKit_dtd58Beh.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { g as getDashLang, m as makeT } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                                */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { e as ensureGuildRow } from '../../../../chunks/ensureGuild_03NKe5VM.mjs';
export { renderers } from '../../../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashConfessions = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashConfessions;
  const dashLang = getDashLang(Astro2);
  const dt = makeT(dashLang);
  const { user, guildId, guildName, guildIcon, config, channels, roles, templates, counts, ready, saved, failed } = Astro2.props;
  const errors = { channel: dt("Choose a channel from the list."), role: dt("Choose a role from the list."), avatar: dt("The picture has to be a link that starts with https."), save: dt("It could not be saved. Try again in a moment.") };
  const switches = [
    { name: "require_review", on: config.requireReview, label: dt("The staff checks each confession first"), hint: dt("It waits in the review channel until someone approves it.") },
    { name: "use_webhook", on: config.useWebhook, label: dt("Send it with its own name and picture"), hint: dt("A webhook, so nothing shows the bot.") },
    { name: "allow_replies", on: config.allowReplies, label: dt("Anonymous replies"), hint: dt("A button under each confession opens a thread.") },
    { name: "allow_images", on: config.allowImages, label: dt("Confessions can have a picture"), hint: "" },
    { name: "allow_command", on: config.allowCommand, label: dt("The confess command works"), hint: dt("If it is off, only the panel button works.") },
    { name: "keep_author", on: config.keepAuthor, label: dt("Keep who confessed, only for the staff"), hint: dt("Lets the staff see who it was or block them. Off keeps nothing.") }
  ];
  const sample = config.title.replace("{confession.number}", "12").replace("{confession.id}", "si2tr-foytm");
  const foot = config.footer.replace("{confession.id}", "si2tr-foytm").replace("{confession.number}", "12");
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "confessions", "pageTitle": dt("Confessions"), "data-astro-cid-suqjrmtc": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", "<h1 data-astro-cid-suqjrmtc>", "</h1> ", " ", "", "", '<div class="cf-page" data-astro-cid-suqjrmtc> ', ' <form method="POST" class="dfx-form" data-astro-cid-suqjrmtc> <label class="dfx-master" data-astro-cid-suqjrmtc><span data-astro-cid-suqjrmtc><b data-astro-cid-suqjrmtc>', "</b><em data-astro-cid-suqjrmtc>", '</em></span><input type="checkbox" class="dfx-t" name="enabled"', ' data-astro-cid-suqjrmtc></label> <section class="dfx-sec" data-astro-cid-suqjrmtc> <div class="dfx-sec-head" data-astro-cid-suqjrmtc><h2 data-astro-cid-suqjrmtc>', "</h2><p data-astro-cid-suqjrmtc>", '</p></div> <div class="dfx-grid" data-astro-cid-suqjrmtc> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label> <select name="channel_id" data-cf-channel data-astro-cid-suqjrmtc><option value="" data-astro-cid-suqjrmtc>', "</option>", '</select> <span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span> </div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label> <select name="review_channel_id" data-astro-cid-suqjrmtc><option value="" data-astro-cid-suqjrmtc>', "</option>", '</select> <span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span> </div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label> <select name="log_channel_id" data-astro-cid-suqjrmtc><option value="" data-astro-cid-suqjrmtc>', "</option>", '</select> <span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span> </div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label> <select name="staff_role_id" data-astro-cid-suqjrmtc><option value="" data-astro-cid-suqjrmtc>', "</option>", '</select> </div> </div> </section> <section class="dfx-sec" data-astro-cid-suqjrmtc> <div class="dfx-sec-head" data-astro-cid-suqjrmtc><h2 data-astro-cid-suqjrmtc>', "</h2><p data-astro-cid-suqjrmtc>", '</p></div> <aside class="cf-preview"', ' data-astro-cid-suqjrmtc> <div class="cf-msgbox" data-astro-cid-suqjrmtc> <div class="cf-who" data-astro-cid-suqjrmtc><span class="cf-ava" data-cf-ava data-astro-cid-suqjrmtc>', "</span><b data-cf-name data-astro-cid-suqjrmtc>", '</b><span class="cf-app" data-astro-cid-suqjrmtc>APP</span></div> <div class="cf-card" data-cf-card', ' data-astro-cid-suqjrmtc> <p class="cf-card-title" data-cf-title', " data-astro-cid-suqjrmtc>", "</p> <p data-astro-cid-suqjrmtc>", '</p> <p class="cf-card-foot" data-cf-foot', "", " data-astro-cid-suqjrmtc>", '</p> </div> <span class="cf-btn" data-cf-reply', " data-astro-cid-suqjrmtc>", '</span> </div> </aside> <div class="dfx-grid" data-astro-cid-suqjrmtc> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><input type="text" name="webhook_name" data-cf-in="name"', ' maxlength="80" data-astro-cid-suqjrmtc></div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><input type="url" name="webhook_avatar"', ' maxlength="400" placeholder="https://..." data-astro-cid-suqjrmtc><span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span></div> <div class="dfx-field dfx-wide" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><textarea name="title" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-cf-in="title" data-ac="vars,emojis" maxlength="200" data-astro-cid-suqjrmtc>', '</textarea><span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span></div> <div class="dfx-field dfx-wide" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><textarea name="footer" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-cf-in="footer" data-ac="vars,emojis" maxlength="200" data-astro-cid-suqjrmtc>', '</textarea><span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span></div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', "</label>", '</div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label> <select name="embed_template" data-tpl-locks="title footer" data-astro-cid-suqjrmtc><option value="" data-astro-cid-suqjrmtc>', "</option>", '</select> <span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span> </div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><input type="text" name="button_label" data-ac="vars,emojis"', ' maxlength="80" data-astro-cid-suqjrmtc></div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><input type="text" name="reply_label" data-cf-in="reply" data-ac="vars,emojis"', ' maxlength="80" data-astro-cid-suqjrmtc></div> <div class="dfx-field dfx-wide" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><textarea name="panel_text" class="dgl-autogrow" rows="3" data-count data-ac maxlength="400" data-astro-cid-suqjrmtc>', '</textarea></div> </div> </section> <section class="dfx-sec" data-astro-cid-suqjrmtc> <div class="dfx-sec-head" data-astro-cid-suqjrmtc><h2 data-astro-cid-suqjrmtc>', "</h2><p data-astro-cid-suqjrmtc>", '</p></div> <div class="dfx-grid" data-astro-cid-suqjrmtc> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><input type="number" name="cooldown_seconds" min="0" max="86400"', ' data-astro-cid-suqjrmtc><span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span></div> </div> <div class="dfx-switches" data-astro-cid-suqjrmtc> ', ' </div> </section> <div class="dfx-foot" data-astro-cid-suqjrmtc> <button class="btn btn-accent btn-sm" type="submit"', " data-astro-cid-suqjrmtc>", '</button> <button class="btn btn-ghost btn-sm" type="button" data-cf-panel', "", "", " data-astro-cid-suqjrmtc>", "", '</button> <span class="cf-msg" data-cf-msg hidden data-astro-cid-suqjrmtc></span> </div> <span class="dfx-hint" data-astro-cid-suqjrmtc>', `</span> </form> </div> <script>
    (function () {
      var button = document.querySelector('[data-cf-panel]');
      var msg = document.querySelector('[data-cf-msg]');
      if (!button || !msg) return;
      var guild = location.pathname.replace(/^\\/(es|pt-br)(?=\\/)/i, '').split('/')[3];
      var label = button.innerHTML;
      button.addEventListener('click', function () {
        var select = document.querySelector('[data-cf-channel]');
        // The button says it is posting (same width, its icon back after); the answer is a toast at the bottom (inline only without it).
        button.style.minWidth = button.offsetWidth + 'px';
        button.disabled = true; button.textContent = button.getAttribute('data-working'); msg.hidden = true;
        fetch('/dash/guild/' + guild + '/confessions-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ channel_id: select ? select.value : '' }), signal: window.AbortSignal && AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined })
          .then(function (r) { return r.json().catch(function () { return { ok: false, message: button.getAttribute('data-failed') }; }); })
          .catch(function () { return { ok: false, message: button.getAttribute('data-failed') }; })
          .then(function (result) {
            button.disabled = false; button.innerHTML = label; button.style.minWidth = '';
            var text = result.message || button.getAttribute('data-failed');
            if (window.dglToast) window.dglToast(text, { kind: result.ok ? 'ok' : 'error' });
            else { msg.hidden = false; msg.className = 'cf-msg ' + (result.ok ? 'ok' : 'bad'); msg.textContent = text; }
          });
      });
    })();
    // The preview follows what is written.
    (function () {
      var q = function (s) { return document.querySelector(s); };
      var card = q('[data-cf-card]'), title = q('[data-cf-title]'), foot = q('[data-cf-foot]'), name = q('[data-cf-name]'), reply = q('[data-cf-reply]');
      var avatar = q('[data-cf-ava]'), color = q('input[name="color"]');
      var inTitle = q('[data-cf-in="title"]'), inFoot = q('[data-cf-in="footer"]'), inName = q('[data-cf-in="name"]'), inReply = q('[data-cf-in="reply"]'), inReplies = q('[data-cf-in="replies"]');
      var picture = q('input[name="webhook_avatar"]');
      if (!card || !title) return;
      var fill = function (text) { return String(text || '').split('{confession.number}').join('12').split('{confession.id}').join('si2tr-foytm'); };
      function paint() {
        if (inTitle) title.textContent = fill(inTitle.value);
        if (inFoot) { var f = fill(inFoot.value); foot.textContent = f; foot.hidden = !f; }
        if (inName) name.textContent = inName.value;
        if (inReply && reply) reply.textContent = inReply.value;
        if (reply && inReplies) reply.hidden = !inReplies.checked;
        if (color && /^#[0-9a-f]{6}$/i.test(color.value)) card.style.borderLeftColor = color.value;
        if (picture && avatar) {
          var url = picture.value.trim(); var img = avatar.querySelector('img');
          if (/^https:\\/\\//i.test(url)) {
            if (!img) { img = document.createElement('img'); img.alt = ''; img.referrerPolicy = 'no-referrer'; avatar.textContent = ''; avatar.appendChild(img); }
            if (img.getAttribute('src') !== url) img.src = url;
          }
        }
      }
      document.addEventListener('input', paint); document.addEventListener('change', paint);
      // The color picker writes its value without an event the page can hear: it is looked at while the page is open.
      var last = color ? color.value : '';
      setInterval(function () { if (color && color.value !== last) { last = color.value; paint(); } }, 250);
      paint();
    })();
  <\/script> `], [" ", " ", "<h1 data-astro-cid-suqjrmtc>", "</h1> ", " ", "", "", '<div class="cf-page" data-astro-cid-suqjrmtc> ', ' <form method="POST" class="dfx-form" data-astro-cid-suqjrmtc> <label class="dfx-master" data-astro-cid-suqjrmtc><span data-astro-cid-suqjrmtc><b data-astro-cid-suqjrmtc>', "</b><em data-astro-cid-suqjrmtc>", '</em></span><input type="checkbox" class="dfx-t" name="enabled"', ' data-astro-cid-suqjrmtc></label> <section class="dfx-sec" data-astro-cid-suqjrmtc> <div class="dfx-sec-head" data-astro-cid-suqjrmtc><h2 data-astro-cid-suqjrmtc>', "</h2><p data-astro-cid-suqjrmtc>", '</p></div> <div class="dfx-grid" data-astro-cid-suqjrmtc> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label> <select name="channel_id" data-cf-channel data-astro-cid-suqjrmtc><option value="" data-astro-cid-suqjrmtc>', "</option>", '</select> <span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span> </div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label> <select name="review_channel_id" data-astro-cid-suqjrmtc><option value="" data-astro-cid-suqjrmtc>', "</option>", '</select> <span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span> </div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label> <select name="log_channel_id" data-astro-cid-suqjrmtc><option value="" data-astro-cid-suqjrmtc>', "</option>", '</select> <span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span> </div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label> <select name="staff_role_id" data-astro-cid-suqjrmtc><option value="" data-astro-cid-suqjrmtc>', "</option>", '</select> </div> </div> </section> <section class="dfx-sec" data-astro-cid-suqjrmtc> <div class="dfx-sec-head" data-astro-cid-suqjrmtc><h2 data-astro-cid-suqjrmtc>', "</h2><p data-astro-cid-suqjrmtc>", '</p></div> <aside class="cf-preview"', ' data-astro-cid-suqjrmtc> <div class="cf-msgbox" data-astro-cid-suqjrmtc> <div class="cf-who" data-astro-cid-suqjrmtc><span class="cf-ava" data-cf-ava data-astro-cid-suqjrmtc>', "</span><b data-cf-name data-astro-cid-suqjrmtc>", '</b><span class="cf-app" data-astro-cid-suqjrmtc>APP</span></div> <div class="cf-card" data-cf-card', ' data-astro-cid-suqjrmtc> <p class="cf-card-title" data-cf-title', " data-astro-cid-suqjrmtc>", "</p> <p data-astro-cid-suqjrmtc>", '</p> <p class="cf-card-foot" data-cf-foot', "", " data-astro-cid-suqjrmtc>", '</p> </div> <span class="cf-btn" data-cf-reply', " data-astro-cid-suqjrmtc>", '</span> </div> </aside> <div class="dfx-grid" data-astro-cid-suqjrmtc> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><input type="text" name="webhook_name" data-cf-in="name"', ' maxlength="80" data-astro-cid-suqjrmtc></div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><input type="url" name="webhook_avatar"', ' maxlength="400" placeholder="https://..." data-astro-cid-suqjrmtc><span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span></div> <div class="dfx-field dfx-wide" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><textarea name="title" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-cf-in="title" data-ac="vars,emojis" maxlength="200" data-astro-cid-suqjrmtc>', '</textarea><span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span></div> <div class="dfx-field dfx-wide" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><textarea name="footer" class="dgl-autogrow dfx-one" rows="1" data-one-line data-count data-cf-in="footer" data-ac="vars,emojis" maxlength="200" data-astro-cid-suqjrmtc>', '</textarea><span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span></div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', "</label>", '</div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label> <select name="embed_template" data-tpl-locks="title footer" data-astro-cid-suqjrmtc><option value="" data-astro-cid-suqjrmtc>', "</option>", '</select> <span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span> </div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><input type="text" name="button_label" data-ac="vars,emojis"', ' maxlength="80" data-astro-cid-suqjrmtc></div> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><input type="text" name="reply_label" data-cf-in="reply" data-ac="vars,emojis"', ' maxlength="80" data-astro-cid-suqjrmtc></div> <div class="dfx-field dfx-wide" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><textarea name="panel_text" class="dgl-autogrow" rows="3" data-count data-ac maxlength="400" data-astro-cid-suqjrmtc>', '</textarea></div> </div> </section> <section class="dfx-sec" data-astro-cid-suqjrmtc> <div class="dfx-sec-head" data-astro-cid-suqjrmtc><h2 data-astro-cid-suqjrmtc>', "</h2><p data-astro-cid-suqjrmtc>", '</p></div> <div class="dfx-grid" data-astro-cid-suqjrmtc> <div class="dfx-field" data-astro-cid-suqjrmtc><label data-astro-cid-suqjrmtc>', '</label><input type="number" name="cooldown_seconds" min="0" max="86400"', ' data-astro-cid-suqjrmtc><span class="dfx-hint" data-astro-cid-suqjrmtc>', '</span></div> </div> <div class="dfx-switches" data-astro-cid-suqjrmtc> ', ' </div> </section> <div class="dfx-foot" data-astro-cid-suqjrmtc> <button class="btn btn-accent btn-sm" type="submit"', " data-astro-cid-suqjrmtc>", '</button> <button class="btn btn-ghost btn-sm" type="button" data-cf-panel', "", "", " data-astro-cid-suqjrmtc>", "", '</button> <span class="cf-msg" data-cf-msg hidden data-astro-cid-suqjrmtc></span> </div> <span class="dfx-hint" data-astro-cid-suqjrmtc>', `</span> </form> </div> <script>
    (function () {
      var button = document.querySelector('[data-cf-panel]');
      var msg = document.querySelector('[data-cf-msg]');
      if (!button || !msg) return;
      var guild = location.pathname.replace(/^\\\\/(es|pt-br)(?=\\\\/)/i, '').split('/')[3];
      var label = button.innerHTML;
      button.addEventListener('click', function () {
        var select = document.querySelector('[data-cf-channel]');
        // The button says it is posting (same width, its icon back after); the answer is a toast at the bottom (inline only without it).
        button.style.minWidth = button.offsetWidth + 'px';
        button.disabled = true; button.textContent = button.getAttribute('data-working'); msg.hidden = true;
        fetch('/dash/guild/' + guild + '/confessions-api', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ channel_id: select ? select.value : '' }), signal: window.AbortSignal && AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined })
          .then(function (r) { return r.json().catch(function () { return { ok: false, message: button.getAttribute('data-failed') }; }); })
          .catch(function () { return { ok: false, message: button.getAttribute('data-failed') }; })
          .then(function (result) {
            button.disabled = false; button.innerHTML = label; button.style.minWidth = '';
            var text = result.message || button.getAttribute('data-failed');
            if (window.dglToast) window.dglToast(text, { kind: result.ok ? 'ok' : 'error' });
            else { msg.hidden = false; msg.className = 'cf-msg ' + (result.ok ? 'ok' : 'bad'); msg.textContent = text; }
          });
      });
    })();
    // The preview follows what is written.
    (function () {
      var q = function (s) { return document.querySelector(s); };
      var card = q('[data-cf-card]'), title = q('[data-cf-title]'), foot = q('[data-cf-foot]'), name = q('[data-cf-name]'), reply = q('[data-cf-reply]');
      var avatar = q('[data-cf-ava]'), color = q('input[name="color"]');
      var inTitle = q('[data-cf-in="title"]'), inFoot = q('[data-cf-in="footer"]'), inName = q('[data-cf-in="name"]'), inReply = q('[data-cf-in="reply"]'), inReplies = q('[data-cf-in="replies"]');
      var picture = q('input[name="webhook_avatar"]');
      if (!card || !title) return;
      var fill = function (text) { return String(text || '').split('{confession.number}').join('12').split('{confession.id}').join('si2tr-foytm'); };
      function paint() {
        if (inTitle) title.textContent = fill(inTitle.value);
        if (inFoot) { var f = fill(inFoot.value); foot.textContent = f; foot.hidden = !f; }
        if (inName) name.textContent = inName.value;
        if (inReply && reply) reply.textContent = inReply.value;
        if (reply && inReplies) reply.hidden = !inReplies.checked;
        if (color && /^#[0-9a-f]{6}$/i.test(color.value)) card.style.borderLeftColor = color.value;
        if (picture && avatar) {
          var url = picture.value.trim(); var img = avatar.querySelector('img');
          if (/^https:\\\\/\\\\//i.test(url)) {
            if (!img) { img = document.createElement('img'); img.alt = ''; img.referrerPolicy = 'no-referrer'; avatar.textContent = ''; avatar.appendChild(img); }
            if (img.getAttribute('src') !== url) img.src = url;
          }
        }
      }
      document.addEventListener('input', paint); document.addEventListener('change', paint);
      // The color picker writes its value without an event the page can hear: it is looked at while the page is open.
      var last = color ? color.value : '';
      setInterval(function () { if (color && color.value !== last) { last = color.value; paint(); } }, 250);
      paint();
    })();
  <\/script> `])), renderComponent($$result2, "DashFormKit", $$DashFormKit, { "data-astro-cid-suqjrmtc": true }), maybeRenderHead(), dt("Confessions"), renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": channels, "vars": [{ tok: "{confession.number}", desc: dt("Number of the confession") }, { tok: "{confession.id}", desc: dt("ID of the confession") }], "data-astro-cid-suqjrmtc": true }), saved && renderTemplate`<div class="dfx-flash" data-astro-cid-suqjrmtc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-suqjrmtc": true })}${dt("Saved.")}</div>`, failed && renderTemplate`<div class="dfx-flash dfx-warn" data-astro-cid-suqjrmtc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-suqjrmtc": true })}${errors[failed] ?? errors.save}</div>`, !ready && renderTemplate`<div class="dfx-flash dfx-warn" data-astro-cid-suqjrmtc>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-suqjrmtc": true })}${dt("This arrives with the next Petto update.")}</div>`, renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    { label: dt("Posted"), value: counts.posted, tone: "joins" },
    { label: dt("Waiting for the staff"), value: counts.pending, tone: "reactions" },
    { label: dt("Rejected"), value: counts.rejected, tone: "leaves" }
  ], "data-astro-cid-suqjrmtc": true }), dt("Confessions are on"), dt("Members confess in secret and Petto posts it without their name."), addAttribute(config.enabled, "checked"), dt("Channels and staff"), dt("Where confessions appear, where the staff checks them and who can answer."), dt("Channel"), dt("Choose a channel"), channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === config.channelId, "selected")} data-astro-cid-suqjrmtc>#${c.name}</option>`), dt("The confessions appear here."), dt("Review channel"), dt("None"), channels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")}${addAttribute(c.id === config.reviewChannelId, "selected")} data-astro-cid-suqjrmtc>#${c.name}</option>`), dt("Only the staff should see it. Needed if the staff checks first."), dt("Log channel"), dt("None"), channels.map((ch) => renderTemplate`<option${addAttribute(ch.id, "value")}${addAttribute(ch.id === config.logChannelId, "selected")} data-astro-cid-suqjrmtc>#${ch.name}</option>`), dt("What the staff does (approve, reject, look at who made one, block, delete) is written here."), dt("Role of the staff"), dt("Only who manages the server"), roles.map((r) => renderTemplate`<option${addAttribute(r.id, "value")}${addAttribute(r.id === config.staffRoleId, "selected")} data-astro-cid-suqjrmtc>${r.name}</option>`), dt("How it looks"), dt("The preview changes while you write."), addAttribute(dt("Preview"), "aria-label"), config.webhookAvatar ? renderTemplate`<img${addAttribute(config.webhookAvatar, "src")} alt="" referrerpolicy="no-referrer" data-astro-cid-suqjrmtc>` : renderTemplate`${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:mask-happy-fill", "width": "18", "height": "18", "data-astro-cid-suqjrmtc": true })}`, config.webhookName, addAttribute(`border-left-color:${config.color}`, "style"), addAttribute(config.title, "data-raw"), sample, dt("I still sleep with the light on."), addAttribute(config.footer, "data-raw"), addAttribute(!foot, "hidden"), foot, addAttribute(!config.allowReplies, "hidden"), config.replyLabel, dt("Name it shows"), addAttribute(config.webhookName, "value"), dt("Picture it shows"), addAttribute(config.webhookAvatar, "value"), dt("A link. Empty uses the picture Petto has in this server, or the usual one of Petto."), dt("Title of each confession"), config.title, dt("You can use {confession.number} and {confession.id}."), dt("Small text under each confession"), config.footer, dt("Empty for none."), dt("Color"), renderComponent($$result2, "ColorPicker", $$ColorPicker, { "name": "color", "value": config.color, "label": dt("Color"), "data-astro-cid-suqjrmtc": true }), dt("Saved design"), dt("The usual one"), templates.map((n) => renderTemplate`<option${addAttribute(n, "value")}${addAttribute(n === config.embedTemplate, "selected")} data-astro-cid-suqjrmtc>${n}</option>`), dt("A design of the Embeds page. It can use the {confession.*} variables."), dt("Text of the panel button"), addAttribute(config.buttonLabel, "value"), dt("Text of the reply button"), addAttribute(config.replyLabel, "value"), dt("Text of the panel"), config.panelText, dt("Rules"), dt("Who can confess and what happens to each confession."), dt("Seconds to wait between confessions"), addAttribute(config.cooldownSeconds, "value"), dt("0 for no wait."), switches.map((s) => renderTemplate`<label class="dfx-switch" data-astro-cid-suqjrmtc><span data-astro-cid-suqjrmtc><b data-astro-cid-suqjrmtc>${s.label}</b>${s.hint && renderTemplate`<em data-astro-cid-suqjrmtc>${s.hint}</em>`}</span><input type="checkbox" class="dfx-t"${addAttribute(s.name, "name")}${addAttribute(s.name === "allow_replies" ? "replies" : void 0, "data-cf-in")}${addAttribute(s.on, "checked")} data-astro-cid-suqjrmtc></label>`), addAttribute(!ready, "disabled"), dt("Save"), addAttribute(dt("Posting..."), "data-working"), addAttribute(dt("The panel could not be posted."), "data-failed"), addAttribute(!ready, "disabled"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "13", "height": "13", "data-astro-cid-suqjrmtc": true }), dt("Post the panel"), dt("Save first, then post the panel in the channel. With the prefix: !confession setup, panel, reveal, block.")) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashConfessions.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$Confessions = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Confessions;
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
  const hex = (n, fallback) => typeof n === "number" ? `#${n.toString(16).padStart(6, "0")}` : fallback;
  let saved = false;
  let failed = "";
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const text = (key, max) => String(form.get(key) ?? "").replace(/\r\n?/g, "\n").trim().slice(0, max);
    const channelId = text("channel_id", 30);
    const reviewId = text("review_channel_id", 30);
    const logId = text("log_channel_id", 30);
    const roleId = text("staff_role_id", 30);
    const avatar = text("webhook_avatar", 400);
    const color = /^#?([0-9a-f]{6})$/i.exec(text("color", 7));
    const design = text("embed_template", 60).toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    if (channelId && !SNOWFLAKE.test(channelId) || reviewId && !SNOWFLAKE.test(reviewId) || logId && !SNOWFLAKE.test(logId)) failed = "channel";
    else if (roleId && !SNOWFLAKE.test(roleId)) failed = "role";
    else if (avatar && !/^https:\/\//i.test(avatar)) failed = "avatar";
    else {
      await ensureGuildRow(apiUrl, apiHeaders, id);
      const res = await fetch(`${apiUrl}/rest/v1/confession_config?on_conflict=guild_id`, {
        method: "POST",
        headers: { ...apiHeaders, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          guild_id: id,
          enabled: form.get("enabled") === "on",
          channel_id: channelId || null,
          review_channel_id: reviewId || null,
          log_channel_id: logId || null,
          require_review: form.get("require_review") === "on",
          allow_command: form.get("allow_command") === "on",
          allow_images: form.get("allow_images") === "on",
          allow_replies: form.get("allow_replies") === "on",
          keep_author: form.get("keep_author") === "on",
          use_webhook: form.get("use_webhook") === "on",
          webhook_name: text("webhook_name", 80) || "Anonymous",
          webhook_avatar: avatar || null,
          title: text("title", 200) || "Anonymous confession #{confession.number}",
          footer: text("footer", 200),
          color: color ? parseInt(color[1], 16) : 16772761,
          button_label: text("button_label", 80) || "Confess",
          reply_label: text("reply_label", 80) || "Reply anonymously",
          panel_text: text("panel_text", 400) || "Press the button and write it. Nobody will know it was you.",
          cooldown_seconds: whole(form.get("cooldown_seconds"), 0, 86400, 60),
          staff_role_id: roleId || null,
          embed_template: design || null,
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        })
      });
      saved = res.ok;
      if (!res.ok) failed = "save";
    }
  }
  const [guildInfo, configRes, rolesRes, channelsRes, templatesRes, countRes] = await Promise.all([
    getGuildInfo(id, botToken),
    fetch(`${apiUrl}/rest/v1/confession_config?guild_id=eq.${id}&select=*`, { headers: apiHeaders }).catch(() => null),
    getGuildList(Astro2, id, botToken, "roles"),
    getGuildList(Astro2, id, botToken, "channels"),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: apiHeaders }).catch(() => null),
    fetch(`${apiUrl}/rest/v1/confessions?guild_id=eq.${id}&reply_to=is.null&select=status&limit=1000`, { headers: apiHeaders }).catch(() => null)
  ]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const ready = Boolean(configRes?.ok);
  const row = ready ? (await configRes.json())[0] ?? {} : {};
  const roles = (rolesRes?.ok ? await rolesRes.json() : []).filter((r) => r.name !== "@everyone" && !r.managed).sort((a, b) => b.position - a.position).map((r) => ({ id: r.id, name: r.name }));
  const channels = (channelsRes?.ok ? await channelsRes.json() : []).filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map((c) => ({ id: c.id, name: c.name }));
  const templates = (templatesRes?.ok ? await templatesRes.json() : []).map((t) => t.name).filter(Boolean);
  const list = countRes?.ok ? await countRes.json() : [];
  const counts = { posted: list.filter((r) => r.status === "posted").length, pending: list.filter((r) => r.status === "pending").length, rejected: list.filter((r) => r.status === "rejected").length };
  const config = {
    enabled: row.enabled ?? false,
    channelId: row.channel_id ?? "",
    reviewChannelId: row.review_channel_id ?? "",
    logChannelId: row.log_channel_id ?? "",
    requireReview: row.require_review ?? false,
    allowCommand: row.allow_command ?? true,
    allowImages: row.allow_images ?? true,
    allowReplies: row.allow_replies ?? true,
    keepAuthor: row.keep_author ?? true,
    useWebhook: row.use_webhook ?? true,
    webhookName: row.webhook_name ?? "Anonymous",
    webhookAvatar: row.webhook_avatar ?? "",
    title: row.title ?? "Anonymous confession #{confession.number}",
    footer: row.footer ?? "Confession ID: {confession.id}",
    // The old green default that servers have saved is shown as the new default (the bot does the same), a soft yellow.
    color: hex(row.color === 10873466 ? 16772761 : row.color, "#ffee99"),
    buttonLabel: row.button_label ?? "Confess",
    replyLabel: row.reply_label ?? "Reply anonymously",
    panelText: row.panel_text ?? "Press the button and write it. Nobody will know it was you.",
    cooldownSeconds: row.cooldown_seconds ?? 60,
    staffRoleId: row.staff_role_id ?? "",
    embedTemplate: row.embed_template ?? "",
    panelChannelId: row.panel_channel_id ?? ""
  };
  return renderTemplate`${renderComponent($$result, "DashConfessions", $$DashConfessions, { "user": session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "config": config, "channels": channels, "roles": roles, "templates": templates, "counts": counts, "ready": ready, "saved": saved, "failed": failed })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/confessions.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/confessions.astro";
const $$url = "/dash/guild/[id]/confessions";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Confessions,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
