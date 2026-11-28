import { c as createAstro, a as createComponent, r as renderTemplate, e as defineScriptVars, b as addAttribute, d as renderComponent, g as renderHead, u as unescapeHTML } from './astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$Icon } from './Icon_CDiFdbJV.mjs';
import { m as makeT } from './dash_CORIPvM-.mjs';
import { a as formPreview } from './formPreview_CE8NaVcg.mjs';
import { m as formPagePath, k as formIdPath } from './forms_B4RRKoSS.mjs';
/* empty css                        */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://petto.sbs");
const $$WebFormPage = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$WebFormPage;
  const { lang, id = null, look = null, status = 200 } = Astro2.props;
  const dt = makeT(lang);
  const SITE = "https://petto.sbs";
  const LANGS = [
    { code: "en", label: "EN", hreflang: "en", locale: "en_US" },
    { code: "es", label: "ES", hreflang: "es", locale: "es_ES" },
    { code: "pt-BR", label: "PT", hreflang: "pt-BR", locale: "pt_BR" }
  ];
  const pathIn = (l) => id ? formIdPath(id, l) : formPagePath(l);
  const canonical = `${SITE}${pathIn(lang)}`;
  const notFound = status === 404;
  const preview = look ? formPreview(look, lang === "pt-BR" ? "pt-BR" : lang === "es" ? "es" : "en") : null;
  const title = preview?.title ?? (notFound ? `${dt("This form does not exist")} \xB7 Petto` : `${dt("Form")} \xB7 Petto`);
  const description = preview?.description ?? dt("Fill in this form with your Discord account.");
  const color = look?.color != null ? `#${look.color.toString(16).padStart(6, "0")}` : null;
  const ink = look?.color != null ? (0.2126 * (look.color >> 16 & 255) + 0.7152 * (look.color >> 8 & 255) + 0.0722 * (look.color & 255)) / 255 > 0.6 ? "#16171a" : "#ffffff" : null;
  const page = look?.page ?? { banner: null, background: "default", show_icon: true, show_name: true, hide_branding: false };
  const server = look?.server ?? null;
  const showIcon = page.show_icon !== false;
  const showName = page.show_name !== false && Boolean(server?.name);
  const ogImage = preview?.image ?? `${SITE}/assets/petto-link-banner-min.png`;
  const large = preview ? preview.large : true;
  const texts = {
    required: dt("Answer this question."),
    number: dt("Write a number."),
    range: dt("Write a number from {min} to {max}."),
    short: dt("Write at least {count} characters."),
    many: dt("Pick up to {count}."),
    yes: dt("Yes"),
    no: dt("No"),
    optional: dt("optional"),
    requiredLabel: dt("Required"),
    pickUpTo: dt("Pick up to {a}."),
    pickAll: dt("Pick all that apply."),
    answeringAs: dt("Answering as {a}"),
    staffReads: dt("The staff of {a} reads your answers in Discord."),
    sent: dt("Sent (#{a})"),
    fix: dt("Some answers need a fix."),
    failed: dt("It could not be sent. Try again in a moment."),
    notFound: dt("This form does not exist"),
    notFoundHelp: dt("It may have been deleted, or the link is wrong."),
    noLoad: dt("The form could not be loaded"),
    noLoadHelp: dt("Petto did not answer. Try again in a moment."),
    noId: dt("This link has no form"),
    noIdHelp: dt("Open the link of the form again, it ends with the id of the form."),
    form: dt("Form"),
    step: dt("Step {a} of {b}"),
    answered: dt("{a} of {b} answered"),
    pendingTitle: dt("You already sent this form")
  };
  const style = [color && `--wf:${color}`, ink && `--wf-ink:${ink}`].filter(Boolean).join(";");
  return renderTemplate(_a || (_a = __template(["<html", `> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><script>
    // The site's saved theme (the switch of petto.sbs), before the page paints; otherwise the one of the device.
    try { var savedTheme = localStorage.getItem('petto-theme'); if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.setAttribute('data-theme', savedTheme); } catch (e) { /* private window */ }
  <\/script><title>`, '</title><meta name="description"', '><meta name="theme-color"', '><link rel="canonical"', ">", '<link rel="alternate" hreflang="x-default"', '><link rel="icon"', '><meta property="og:type" content="website"><meta property="og:site_name"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:locale"', ">", '<meta property="og:image"', '><meta name="twitter:card"', '><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><meta name="robots" content="noindex"><style is:global>', "</style>", "</head> <body", "", " data-wf-root", "", "", "", '> <div class="wf-shell"> <header class="wf-top"> <span class="wf-brand"> ', " <span data-wf-server>", '</span> </span> <nav class="wf-langs" aria-label="Language"> ', ' <button class="wf-theme" type="button" data-wf-theme', "", ">", '</button> </nav> </header> <main class="wf-screen"> ', ' <div class="wf-inner"> <div class="wf-head" data-wf-head', '> <div class="wf-eyebrow"> <span class="wf-chip">', "", "</span> ", " </div> <h1 data-wf-title>", "</h1> ", ' </div> <div class="wf-loading" data-wf-state="loading" role="status" aria-label="\u2026"', '><span class="wf-spin"></span></div> <div class="wf-card wf-center" data-wf-state="login" hidden> <span class="wf-badge">', "</span> <h2>", '</h2> <p class="wf-muted">', '</p> <a class="wf-btn"', " data-wf-login>", "", '</a> </div> <div class="wf-card wf-center" data-wf-state="error"', '> <span class="wf-badge warn">', "</span> <h2 data-wf-error-title>", '</h2> <p class="wf-muted" data-wf-error-help>', '</p> <a class="wf-btn sec"', " data-wf-home", ">", '</a> <button class="wf-btn sec" type="button" data-wf-retry hidden>', '</button> </div> <div class="wf-who" data-wf-state="who" hidden> ', '<span data-wf-who></span><a href="/dash/logout">', '</a> </div> <div class="wf-card wf-status" role="status" data-wf-state="sent" hidden> <div class="wf-status-top"> <span class="wf-done-icon">', '</span> <div><h2 data-wf-sent-title></h2><p class="wf-muted" data-wf-sent-text></p></div> </div> <ol class="wf-steps"> <li class="done"><span class="wf-dot">', "</span><div><b>", '</b><span class="wf-muted">', '</span></div></li> <li class="now"><span class="wf-dot">', "</span><div><b>", '</b><span class="wf-muted" data-wf-staff></span></div></li> <li><span class="wf-dot">', "</span><div><b>", '</b><span class="wf-muted">', '</span></div></li> </ol> </div> <div class="wf-card wf-refused" role="status" data-wf-state="refused" hidden> <span class="wf-badge warn">', "", '</span> <div><h2 data-wf-refused-title hidden></h2><p data-wf-reason></p></div> </div> <form class="wf-form" novalidate data-wf-form data-wf-state="fill" hidden> <div class="wf-progress" data-wf-progress> <div class="wf-progress-row"><span data-wf-step-label></span><span data-wf-answered></span></div> <div class="wf-bar"><i data-wf-bar></i></div> </div> <div class="wf-alert" role="alert" data-wf-alert hidden>', '<span></span></div> <div class="wf-qs" data-wf-questions></div> <div class="wf-foot"> <button class="wf-btn sec" type="button" data-wf-back hidden>', "", '</button> <button class="wf-btn" type="button" data-wf-next hidden>', "", '</button> <button class="wf-btn" type="submit" data-wf-send>', "", '</button> </div> </form> </div> </main> <footer class="wf-foot-site" data-wf-foot', "><a", '><img src="/assets/mascot-icon.webp" alt="" width="18" height="18">', "</a></footer> </div> <script>(function(){", `
    (function () {
      var root = document.querySelector('[data-wf-root]');
      if (!root) return;
      var $ = function (sel) { return root.querySelector(sel); };
      var fill = function (text, vars) { return text.replace(/\\{(\\w+)\\}/g, function (w, k) { return k in vars ? vars[k] : w; }); };
      var VALID = /^[0-9A-Za-z]{12}$/;
      var lang = root.getAttribute('data-wf-lang') || 'en';
      var base = root.getAttribute('data-wf-base') || '/form';
      var id = root.getAttribute('data-wf-id') || '';

      // The switch of the theme: the same saved choice as the rest of petto.sbs.
      $('[data-wf-theme]').addEventListener('click', function () {
        var html = document.documentElement;
        var now = html.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        var next = now === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        try { localStorage.setItem('petto-theme', next); } catch (e) { /* private window */ }
      });

      var show = function (names) {
        root.querySelectorAll('[data-wf-state]').forEach(function (el) { el.hidden = names.indexOf(el.getAttribute('data-wf-state')) === -1; });
      };
      var error = function (title, help, retry) {
        $('[data-wf-error-title]').textContent = title;
        $('[data-wf-error-help]').textContent = help;
        $('[data-wf-retry]').hidden = !retry;
        $('[data-wf-home]').hidden = Boolean(retry);
        show(['error']);
      };

      // The older address (/form#<id>, or back from the login without it): the page of the form is /form/<id> now.
      if (!id) {
        var KEY = 'petto-form-id';
        var fromHash = (location.hash || '').slice(1);
        var kept = '';
        try { kept = sessionStorage.getItem(KEY) || ''; sessionStorage.removeItem(KEY); } catch (e) { kept = ''; }
        var target = VALID.test(fromHash) ? fromHash : VALID.test(kept) ? kept : '';
        if (target) { location.replace(base + '/' + target + location.search); return; }
        error(texts.noId, texts.noIdHelp, false);
        return;
      }
      if (root.getAttribute('data-wf-status') === '404') return;

      var api = '/api/form/' + id + '?lang=' + encodeURIComponent(lang);
      var form = $('[data-wf-form]');
      var list = $('[data-wf-questions]');
      var PAGE = 5;
      var step = 0;
      var steps = 1;

      var el = function (tag, attrs, text) {
        var node = document.createElement(tag);
        if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) node.setAttribute(k, attrs[k] === true ? '' : attrs[k]); });
        if (text !== undefined && text !== null) node.textContent = text;
        return node;
      };
      var choice = function (type, name, value, label) {
        var wrap = el('label', { class: 'wf-choice' + (type === 'checkbox' ? ' wf-check' : '') });
        wrap.appendChild(el('input', { type: type, name: name, value: value }));
        wrap.appendChild(el('span', null, label));
        return wrap;
      };
      var question = function (q, index) {
        var box = el('fieldset', { class: 'wf-q', style: '--i:' + (index % PAGE), 'data-q': q.id, 'data-step': String(Math.floor(index / PAGE)), 'data-type': q.type, 'data-required': q.required ? '1' : '0', 'data-min': q.min_length == null ? '' : q.min_length, 'data-minv': q.min_value == null ? '' : q.min_value, 'data-maxv': q.max_value == null ? '' : q.max_value, 'data-maxc': q.max_choices == null ? '' : q.max_choices });
        var legend = el('legend');
        legend.appendChild(el('span', { class: 'wf-n' }, String(index + 1)));
        legend.appendChild(el('span', { class: 'wf-label' }, q.label));
        legend.appendChild(q.required ? el('em', { class: 'wf-req', 'aria-label': texts.requiredLabel }, '*') : el('span', { class: 'wf-opt' }, texts.optional));
        box.appendChild(legend);
        if (q.image) box.appendChild(el('img', { class: 'wf-img', src: q.image, alt: q.label, loading: 'lazy', decoding: 'async', referrerpolicy: 'no-referrer' }));
        if (q.help) box.appendChild(el('p', { class: 'wf-help' }, q.help));
        // Made safe by the site (utils/forms.ts descriptionHtml): everything is escaped, then only bold, italics, code and links are made.
        if (q.description_html) { var d = el('div', { class: 'wf-qdesc' }); d.innerHTML = q.description_html; box.appendChild(d); }
        var name = 'q_' + q.id;
        if (q.type === 'short') box.appendChild(el('input', { type: 'text', name: name, maxlength: q.max_length || 1000, placeholder: q.placeholder || '', required: q.required, 'aria-label': q.label }));
        else if (q.type === 'paragraph') box.appendChild(el('textarea', { name: name, maxlength: q.max_length || 4000, placeholder: q.placeholder || '', required: q.required, rows: '5', 'aria-label': q.label }));
        else if (q.type === 'number') box.appendChild(el('input', { type: 'text', inputmode: 'decimal', name: name, maxlength: '30', placeholder: q.placeholder || (q.min_value != null && q.max_value != null ? q.min_value + ' \u2013 ' + q.max_value : ''), required: q.required, 'aria-label': q.label }));
        else if (q.type === 'yesno') { var row = el('div', { class: 'wf-choices wf-row' }); row.appendChild(choice('radio', name, 'yes', texts.yes)); row.appendChild(choice('radio', name, 'no', texts.no)); box.appendChild(row); }
        else if (q.type === 'choice' || q.type === 'multi') {
          var grid = el('div', { class: 'wf-choices' });
          (q.options || []).forEach(function (option, i) { grid.appendChild(choice(q.type === 'multi' ? 'checkbox' : 'radio', name, 'o' + i, option)); });
          box.appendChild(grid);
          if (q.type === 'multi') box.appendChild(el('p', { class: 'wf-help' }, q.max_choices ? fill(texts.pickUpTo, { a: q.max_choices }) : texts.pickAll));
        }
        box.appendChild(el('p', { class: 'wf-err', 'data-err': true, 'aria-live': 'polite' }));
        return box;
      };
      var alertBox = function (text) {
        var box = $('[data-wf-alert]');
        box.hidden = !text;
        box.querySelector('span').textContent = text || '';
      };
      var boxes = function () { return Array.prototype.slice.call(list.querySelectorAll('[data-q]')); };
      var answered = function (box) {
        var type = box.dataset.type;
        if (type === 'short' || type === 'paragraph' || type === 'number') return Boolean((box.querySelector('input[name^="q_"], textarea').value || '').trim());
        return Boolean(box.querySelector('input[name^="q_"]:checked'));
      };
      // The bar over the questions: how many are answered, and the step when the form has more than five questions.
      var progress = function () {
        var all = boxes();
        var done = all.filter(answered).length;
        $('[data-wf-bar]').style.width = (all.length ? Math.round((done / all.length) * 100) : 0) + '%';
        $('[data-wf-answered]').textContent = fill(texts.answered, { a: done, b: all.length });
        $('[data-wf-step-label]').textContent = steps > 1 ? fill(texts.step, { a: step + 1, b: steps }) : '';
      };
      var goTo = function (n, scroll) {
        step = Math.max(0, Math.min(steps - 1, n));
        boxes().forEach(function (box) { box.hidden = Number(box.dataset.step) !== step; });
        $('[data-wf-back]').hidden = step === 0;
        $('[data-wf-next]').hidden = step >= steps - 1;
        $('[data-wf-send]').hidden = step < steps - 1;
        progress();
        if (scroll) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      // The same checks as the bot, before sending, so a mistake is shown at once. The bot checks everything again.
      var check = function (box) {
        var type = box.dataset.type;
        var required = box.dataset.required === '1';
        var msg = '';
        if (type === 'short' || type === 'paragraph' || type === 'number') {
          var input = box.querySelector('input[name^="q_"], textarea');
          var text = (input.value || '').trim();
          if (!text) { if (required) msg = texts.required; }
          else if (type === 'number') {
            var normal = text.replace(/\\s/g, '').replace(',', '.');
            if (!/^-?\\d{1,15}(\\.\\d{1,6})?$/.test(normal)) msg = texts.number;
            else {
              var n = Number(normal), min = box.dataset.minv, max = box.dataset.maxv;
              if ((min !== '' && n < Number(min)) || (max !== '' && n > Number(max))) msg = fill(texts.range, { min: min || '\u2026', max: max || '\u2026' });
            }
          } else if (box.dataset.min && text.length < Number(box.dataset.min)) msg = fill(texts.short, { count: box.dataset.min });
        } else {
          var picked = box.querySelectorAll('input[name^="q_"]:checked').length;
          if (!picked && required) msg = texts.required;
          else if (type === 'multi' && box.dataset.maxc && picked > Number(box.dataset.maxc)) msg = fill(texts.many, { count: box.dataset.maxc });
        }
        mark(box, msg);
        return !msg;
      };
      var mark = function (box, msg) { box.classList.toggle('wf-q-bad', Boolean(msg)); box.querySelector('[data-err]').textContent = msg || ''; };
      form.addEventListener('change', function (event) { var box = event.target.closest('[data-q]'); if (box && box.classList.contains('wf-q-bad')) check(box); progress(); });
      form.addEventListener('input', progress);
      form.addEventListener('focusout', function (event) { var box = event.target.closest('[data-q]'); if (box && event.target.matches('input[type=text], textarea') && event.target.value) check(box); });
      var collect = function () {
        var values = {};
        boxes().forEach(function (box) {
          var qid = box.dataset.q, type = box.dataset.type;
          if (type === 'multi') values[qid] = Array.prototype.map.call(box.querySelectorAll('input:checked'), function (i) { return i.value; });
          else if (type === 'choice' || type === 'yesno') { var c = box.querySelector('input:checked'); if (c) values[qid] = c.value; }
          else values[qid] = box.querySelector('input, textarea').value;
        });
        return values;
      };
      var focusFirst = function (bad) {
        if (!bad.length) return;
        var target = Number(bad[0].dataset.step);
        if (target !== step) goTo(target, false);
        bad[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        var first = bad[0].querySelector('input, textarea'); if (first) first.focus({ preventScroll: true });
      };
      $('[data-wf-next]').addEventListener('click', function () {
        var bad = boxes().filter(function (box) { return Number(box.dataset.step) === step && !check(box); });
        if (bad.length) { focusFirst(bad); return; }
        alertBox('');
        goTo(step + 1, true);
      });
      $('[data-wf-back]').addEventListener('click', function () { goTo(step - 1, true); });
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        // Enter in a field of an earlier step goes to the next step instead of sending.
        if (step < steps - 1) { $('[data-wf-next]').click(); return; }
        var bad = boxes().filter(function (box) { return !check(box); });
        if (bad.length) { focusFirst(bad); return; }
        var button = $('[data-wf-send]');
        button.disabled = true; button.classList.add('is-sending');
        alertBox('');
        fetch(api, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ values: collect() }) })
          .then(function (res) { return res.json().catch(function () { return null; }).then(function (data) { return { status: res.status, data: data }; }); })
          .then(function (r) {
            var data = r.data || {};
            if (r.status === 401) { show(['login']); return; }
            if (data.ok) {
              $('[data-wf-sent-title]').textContent = fill(texts.sent, { a: data.number });
              $('[data-wf-sent-text]').textContent = data.message || '';
              show(['who', 'sent']);
              root.scrollIntoView({ behavior: 'smooth', block: 'start' });
              return;
            }
            if (Array.isArray(data.errors) && data.errors.length) {
              var marked = [];
              data.errors.forEach(function (e) { var box = list.querySelector('[data-q="' + (window.CSS && CSS.escape ? CSS.escape(e.id) : e.id) + '"]'); if (box) { mark(box, e.message); marked.push(box); } });
              alertBox(texts.fix);
              focusFirst(marked);
              return;
            }
            alertBox(data.message || texts.failed);
          })
          .catch(function () { alertBox(texts.failed); })
          .then(function () { button.disabled = false; button.classList.remove('is-sending'); });
      });

      // When the server could not draw the look (the bot was slow), it arrives with the answer and fills the head of the page.
      var dress = function (f, server) {
        if (!$('[data-wf-head]').hidden) return;
        if (typeof f.color === 'number') root.style.setProperty('--wf', '#' + f.color.toString(16).padStart(6, '0'));
        var page = f.page || {};
        root.classList.toggle('wf-bg-solid', page.background === 'solid');
        root.classList.toggle('wf-bg-gradient', page.background === 'gradient');
        root.classList.toggle('wf-bg-aurora', page.background === 'aurora');
        root.classList.toggle('wf-bg-waves', page.background === 'waves');
        var foot = $('[data-wf-foot]'); if (foot) foot.hidden = page.hide_branding === true;
        document.title = (f.title || texts.form) + (server.name ? ' \xB7 ' + server.name : '');
        if (server.icon) document.querySelectorAll('link[rel~="icon"]').forEach(function (link) { link.setAttribute('href', server.icon); });
        var name = $('[data-wf-server]'); if (name) name.textContent = page.show_name === false ? '' : server.name || '';
        var icon = $('[data-wf-icon]'); if (icon && server.icon && page.show_icon !== false) icon.src = server.icon;
        $('[data-wf-title]').textContent = f.title || texts.form;
        var desc = $('[data-wf-desc]'); desc.textContent = f.description || ''; desc.hidden = !f.description;
        $('[data-wf-head]').hidden = false;
      };

      var load = function () {
        show(['loading']);
        fetch(api, { credentials: 'same-origin', headers: { Accept: 'application/json' } })
          .then(function (res) { return res.json().catch(function () { return null; }).then(function (data) { return { status: res.status, data: data }; }); })
          .then(function (r) {
            var data = r.data || {};
            if (r.status === 401 || data.logged === false) {
              if (data.look && data.look.form) dress(data.look.form, data.look.server || {});
              show(['login']);
              return;
            }
            if (!data.ok) { if (r.status === 404) error(texts.notFound, texts.notFoundHelp, false); else error(texts.noLoad, texts.noLoadHelp, true); return; }
            var f = data.form, server = data.server || {};
            dress(f, server);
            $('[data-wf-who]').textContent = fill(texts.answeringAs, { a: (data.user && data.user.username) || '' });
            $('[data-wf-staff]').textContent = fill(texts.staffReads, { a: server.name || '' });
            if (!data.can) {
              // One submission already waiting is shown as where it is, not as a lock.
              var pending = data.code === 'pending';
              $('[data-wf-refused-title]').hidden = !pending;
              $('[data-wf-refused-title]').textContent = pending ? texts.pendingTitle : '';
              $('[data-wf-state="refused"]').classList.toggle('is-pending', pending);
              $('[data-wf-reason]').textContent = data.reason || '';
              show(['who', 'refused']);
              return;
            }
            list.textContent = '';
            (f.questions || []).forEach(function (q, i) { list.appendChild(question(q, i)); });
            steps = Math.max(1, Math.ceil((f.questions || []).length / PAGE));
            $('[data-wf-progress]').hidden = !(f.questions || []).length;
            show(['who', 'fill']);
            goTo(0, false);
          })
          .catch(function () { error(texts.noLoad, texts.noLoadHelp, true); });
      };
      $('[data-wf-retry]').addEventListener('click', load);
      load();
    })();
  })();<\/script> </body> </html> `], ["<html", `> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><script>
    // The site's saved theme (the switch of petto.sbs), before the page paints; otherwise the one of the device.
    try { var savedTheme = localStorage.getItem('petto-theme'); if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.setAttribute('data-theme', savedTheme); } catch (e) { /* private window */ }
  <\/script><title>`, '</title><meta name="description"', '><meta name="theme-color"', '><link rel="canonical"', ">", '<link rel="alternate" hreflang="x-default"', '><link rel="icon"', '><meta property="og:type" content="website"><meta property="og:site_name"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:url"', '><meta property="og:locale"', ">", '<meta property="og:image"', '><meta name="twitter:card"', '><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><meta name="robots" content="noindex"><style is:global>', "</style>", "</head> <body", "", " data-wf-root", "", "", "", '> <div class="wf-shell"> <header class="wf-top"> <span class="wf-brand"> ', " <span data-wf-server>", '</span> </span> <nav class="wf-langs" aria-label="Language"> ', ' <button class="wf-theme" type="button" data-wf-theme', "", ">", '</button> </nav> </header> <main class="wf-screen"> ', ' <div class="wf-inner"> <div class="wf-head" data-wf-head', '> <div class="wf-eyebrow"> <span class="wf-chip">', "", "</span> ", " </div> <h1 data-wf-title>", "</h1> ", ' </div> <div class="wf-loading" data-wf-state="loading" role="status" aria-label="\u2026"', '><span class="wf-spin"></span></div> <div class="wf-card wf-center" data-wf-state="login" hidden> <span class="wf-badge">', "</span> <h2>", '</h2> <p class="wf-muted">', '</p> <a class="wf-btn"', " data-wf-login>", "", '</a> </div> <div class="wf-card wf-center" data-wf-state="error"', '> <span class="wf-badge warn">', "</span> <h2 data-wf-error-title>", '</h2> <p class="wf-muted" data-wf-error-help>', '</p> <a class="wf-btn sec"', " data-wf-home", ">", '</a> <button class="wf-btn sec" type="button" data-wf-retry hidden>', '</button> </div> <div class="wf-who" data-wf-state="who" hidden> ', '<span data-wf-who></span><a href="/dash/logout">', '</a> </div> <div class="wf-card wf-status" role="status" data-wf-state="sent" hidden> <div class="wf-status-top"> <span class="wf-done-icon">', '</span> <div><h2 data-wf-sent-title></h2><p class="wf-muted" data-wf-sent-text></p></div> </div> <ol class="wf-steps"> <li class="done"><span class="wf-dot">', "</span><div><b>", '</b><span class="wf-muted">', '</span></div></li> <li class="now"><span class="wf-dot">', "</span><div><b>", '</b><span class="wf-muted" data-wf-staff></span></div></li> <li><span class="wf-dot">', "</span><div><b>", '</b><span class="wf-muted">', '</span></div></li> </ol> </div> <div class="wf-card wf-refused" role="status" data-wf-state="refused" hidden> <span class="wf-badge warn">', "", '</span> <div><h2 data-wf-refused-title hidden></h2><p data-wf-reason></p></div> </div> <form class="wf-form" novalidate data-wf-form data-wf-state="fill" hidden> <div class="wf-progress" data-wf-progress> <div class="wf-progress-row"><span data-wf-step-label></span><span data-wf-answered></span></div> <div class="wf-bar"><i data-wf-bar></i></div> </div> <div class="wf-alert" role="alert" data-wf-alert hidden>', '<span></span></div> <div class="wf-qs" data-wf-questions></div> <div class="wf-foot"> <button class="wf-btn sec" type="button" data-wf-back hidden>', "", '</button> <button class="wf-btn" type="button" data-wf-next hidden>', "", '</button> <button class="wf-btn" type="submit" data-wf-send>', "", '</button> </div> </form> </div> </main> <footer class="wf-foot-site" data-wf-foot', "><a", '><img src="/assets/mascot-icon.webp" alt="" width="18" height="18">', "</a></footer> </div> <script>(function(){", `
    (function () {
      var root = document.querySelector('[data-wf-root]');
      if (!root) return;
      var $ = function (sel) { return root.querySelector(sel); };
      var fill = function (text, vars) { return text.replace(/\\\\{(\\\\w+)\\\\}/g, function (w, k) { return k in vars ? vars[k] : w; }); };
      var VALID = /^[0-9A-Za-z]{12}$/;
      var lang = root.getAttribute('data-wf-lang') || 'en';
      var base = root.getAttribute('data-wf-base') || '/form';
      var id = root.getAttribute('data-wf-id') || '';

      // The switch of the theme: the same saved choice as the rest of petto.sbs.
      $('[data-wf-theme]').addEventListener('click', function () {
        var html = document.documentElement;
        var now = html.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        var next = now === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        try { localStorage.setItem('petto-theme', next); } catch (e) { /* private window */ }
      });

      var show = function (names) {
        root.querySelectorAll('[data-wf-state]').forEach(function (el) { el.hidden = names.indexOf(el.getAttribute('data-wf-state')) === -1; });
      };
      var error = function (title, help, retry) {
        $('[data-wf-error-title]').textContent = title;
        $('[data-wf-error-help]').textContent = help;
        $('[data-wf-retry]').hidden = !retry;
        $('[data-wf-home]').hidden = Boolean(retry);
        show(['error']);
      };

      // The older address (/form#<id>, or back from the login without it): the page of the form is /form/<id> now.
      if (!id) {
        var KEY = 'petto-form-id';
        var fromHash = (location.hash || '').slice(1);
        var kept = '';
        try { kept = sessionStorage.getItem(KEY) || ''; sessionStorage.removeItem(KEY); } catch (e) { kept = ''; }
        var target = VALID.test(fromHash) ? fromHash : VALID.test(kept) ? kept : '';
        if (target) { location.replace(base + '/' + target + location.search); return; }
        error(texts.noId, texts.noIdHelp, false);
        return;
      }
      if (root.getAttribute('data-wf-status') === '404') return;

      var api = '/api/form/' + id + '?lang=' + encodeURIComponent(lang);
      var form = $('[data-wf-form]');
      var list = $('[data-wf-questions]');
      var PAGE = 5;
      var step = 0;
      var steps = 1;

      var el = function (tag, attrs, text) {
        var node = document.createElement(tag);
        if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] !== null && attrs[k] !== undefined && attrs[k] !== false) node.setAttribute(k, attrs[k] === true ? '' : attrs[k]); });
        if (text !== undefined && text !== null) node.textContent = text;
        return node;
      };
      var choice = function (type, name, value, label) {
        var wrap = el('label', { class: 'wf-choice' + (type === 'checkbox' ? ' wf-check' : '') });
        wrap.appendChild(el('input', { type: type, name: name, value: value }));
        wrap.appendChild(el('span', null, label));
        return wrap;
      };
      var question = function (q, index) {
        var box = el('fieldset', { class: 'wf-q', style: '--i:' + (index % PAGE), 'data-q': q.id, 'data-step': String(Math.floor(index / PAGE)), 'data-type': q.type, 'data-required': q.required ? '1' : '0', 'data-min': q.min_length == null ? '' : q.min_length, 'data-minv': q.min_value == null ? '' : q.min_value, 'data-maxv': q.max_value == null ? '' : q.max_value, 'data-maxc': q.max_choices == null ? '' : q.max_choices });
        var legend = el('legend');
        legend.appendChild(el('span', { class: 'wf-n' }, String(index + 1)));
        legend.appendChild(el('span', { class: 'wf-label' }, q.label));
        legend.appendChild(q.required ? el('em', { class: 'wf-req', 'aria-label': texts.requiredLabel }, '*') : el('span', { class: 'wf-opt' }, texts.optional));
        box.appendChild(legend);
        if (q.image) box.appendChild(el('img', { class: 'wf-img', src: q.image, alt: q.label, loading: 'lazy', decoding: 'async', referrerpolicy: 'no-referrer' }));
        if (q.help) box.appendChild(el('p', { class: 'wf-help' }, q.help));
        // Made safe by the site (utils/forms.ts descriptionHtml): everything is escaped, then only bold, italics, code and links are made.
        if (q.description_html) { var d = el('div', { class: 'wf-qdesc' }); d.innerHTML = q.description_html; box.appendChild(d); }
        var name = 'q_' + q.id;
        if (q.type === 'short') box.appendChild(el('input', { type: 'text', name: name, maxlength: q.max_length || 1000, placeholder: q.placeholder || '', required: q.required, 'aria-label': q.label }));
        else if (q.type === 'paragraph') box.appendChild(el('textarea', { name: name, maxlength: q.max_length || 4000, placeholder: q.placeholder || '', required: q.required, rows: '5', 'aria-label': q.label }));
        else if (q.type === 'number') box.appendChild(el('input', { type: 'text', inputmode: 'decimal', name: name, maxlength: '30', placeholder: q.placeholder || (q.min_value != null && q.max_value != null ? q.min_value + ' \u2013 ' + q.max_value : ''), required: q.required, 'aria-label': q.label }));
        else if (q.type === 'yesno') { var row = el('div', { class: 'wf-choices wf-row' }); row.appendChild(choice('radio', name, 'yes', texts.yes)); row.appendChild(choice('radio', name, 'no', texts.no)); box.appendChild(row); }
        else if (q.type === 'choice' || q.type === 'multi') {
          var grid = el('div', { class: 'wf-choices' });
          (q.options || []).forEach(function (option, i) { grid.appendChild(choice(q.type === 'multi' ? 'checkbox' : 'radio', name, 'o' + i, option)); });
          box.appendChild(grid);
          if (q.type === 'multi') box.appendChild(el('p', { class: 'wf-help' }, q.max_choices ? fill(texts.pickUpTo, { a: q.max_choices }) : texts.pickAll));
        }
        box.appendChild(el('p', { class: 'wf-err', 'data-err': true, 'aria-live': 'polite' }));
        return box;
      };
      var alertBox = function (text) {
        var box = $('[data-wf-alert]');
        box.hidden = !text;
        box.querySelector('span').textContent = text || '';
      };
      var boxes = function () { return Array.prototype.slice.call(list.querySelectorAll('[data-q]')); };
      var answered = function (box) {
        var type = box.dataset.type;
        if (type === 'short' || type === 'paragraph' || type === 'number') return Boolean((box.querySelector('input[name^="q_"], textarea').value || '').trim());
        return Boolean(box.querySelector('input[name^="q_"]:checked'));
      };
      // The bar over the questions: how many are answered, and the step when the form has more than five questions.
      var progress = function () {
        var all = boxes();
        var done = all.filter(answered).length;
        $('[data-wf-bar]').style.width = (all.length ? Math.round((done / all.length) * 100) : 0) + '%';
        $('[data-wf-answered]').textContent = fill(texts.answered, { a: done, b: all.length });
        $('[data-wf-step-label]').textContent = steps > 1 ? fill(texts.step, { a: step + 1, b: steps }) : '';
      };
      var goTo = function (n, scroll) {
        step = Math.max(0, Math.min(steps - 1, n));
        boxes().forEach(function (box) { box.hidden = Number(box.dataset.step) !== step; });
        $('[data-wf-back]').hidden = step === 0;
        $('[data-wf-next]').hidden = step >= steps - 1;
        $('[data-wf-send]').hidden = step < steps - 1;
        progress();
        if (scroll) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      // The same checks as the bot, before sending, so a mistake is shown at once. The bot checks everything again.
      var check = function (box) {
        var type = box.dataset.type;
        var required = box.dataset.required === '1';
        var msg = '';
        if (type === 'short' || type === 'paragraph' || type === 'number') {
          var input = box.querySelector('input[name^="q_"], textarea');
          var text = (input.value || '').trim();
          if (!text) { if (required) msg = texts.required; }
          else if (type === 'number') {
            var normal = text.replace(/\\\\s/g, '').replace(',', '.');
            if (!/^-?\\\\d{1,15}(\\\\.\\\\d{1,6})?$/.test(normal)) msg = texts.number;
            else {
              var n = Number(normal), min = box.dataset.minv, max = box.dataset.maxv;
              if ((min !== '' && n < Number(min)) || (max !== '' && n > Number(max))) msg = fill(texts.range, { min: min || '\u2026', max: max || '\u2026' });
            }
          } else if (box.dataset.min && text.length < Number(box.dataset.min)) msg = fill(texts.short, { count: box.dataset.min });
        } else {
          var picked = box.querySelectorAll('input[name^="q_"]:checked').length;
          if (!picked && required) msg = texts.required;
          else if (type === 'multi' && box.dataset.maxc && picked > Number(box.dataset.maxc)) msg = fill(texts.many, { count: box.dataset.maxc });
        }
        mark(box, msg);
        return !msg;
      };
      var mark = function (box, msg) { box.classList.toggle('wf-q-bad', Boolean(msg)); box.querySelector('[data-err]').textContent = msg || ''; };
      form.addEventListener('change', function (event) { var box = event.target.closest('[data-q]'); if (box && box.classList.contains('wf-q-bad')) check(box); progress(); });
      form.addEventListener('input', progress);
      form.addEventListener('focusout', function (event) { var box = event.target.closest('[data-q]'); if (box && event.target.matches('input[type=text], textarea') && event.target.value) check(box); });
      var collect = function () {
        var values = {};
        boxes().forEach(function (box) {
          var qid = box.dataset.q, type = box.dataset.type;
          if (type === 'multi') values[qid] = Array.prototype.map.call(box.querySelectorAll('input:checked'), function (i) { return i.value; });
          else if (type === 'choice' || type === 'yesno') { var c = box.querySelector('input:checked'); if (c) values[qid] = c.value; }
          else values[qid] = box.querySelector('input, textarea').value;
        });
        return values;
      };
      var focusFirst = function (bad) {
        if (!bad.length) return;
        var target = Number(bad[0].dataset.step);
        if (target !== step) goTo(target, false);
        bad[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        var first = bad[0].querySelector('input, textarea'); if (first) first.focus({ preventScroll: true });
      };
      $('[data-wf-next]').addEventListener('click', function () {
        var bad = boxes().filter(function (box) { return Number(box.dataset.step) === step && !check(box); });
        if (bad.length) { focusFirst(bad); return; }
        alertBox('');
        goTo(step + 1, true);
      });
      $('[data-wf-back]').addEventListener('click', function () { goTo(step - 1, true); });
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        // Enter in a field of an earlier step goes to the next step instead of sending.
        if (step < steps - 1) { $('[data-wf-next]').click(); return; }
        var bad = boxes().filter(function (box) { return !check(box); });
        if (bad.length) { focusFirst(bad); return; }
        var button = $('[data-wf-send]');
        button.disabled = true; button.classList.add('is-sending');
        alertBox('');
        fetch(api, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ values: collect() }) })
          .then(function (res) { return res.json().catch(function () { return null; }).then(function (data) { return { status: res.status, data: data }; }); })
          .then(function (r) {
            var data = r.data || {};
            if (r.status === 401) { show(['login']); return; }
            if (data.ok) {
              $('[data-wf-sent-title]').textContent = fill(texts.sent, { a: data.number });
              $('[data-wf-sent-text]').textContent = data.message || '';
              show(['who', 'sent']);
              root.scrollIntoView({ behavior: 'smooth', block: 'start' });
              return;
            }
            if (Array.isArray(data.errors) && data.errors.length) {
              var marked = [];
              data.errors.forEach(function (e) { var box = list.querySelector('[data-q="' + (window.CSS && CSS.escape ? CSS.escape(e.id) : e.id) + '"]'); if (box) { mark(box, e.message); marked.push(box); } });
              alertBox(texts.fix);
              focusFirst(marked);
              return;
            }
            alertBox(data.message || texts.failed);
          })
          .catch(function () { alertBox(texts.failed); })
          .then(function () { button.disabled = false; button.classList.remove('is-sending'); });
      });

      // When the server could not draw the look (the bot was slow), it arrives with the answer and fills the head of the page.
      var dress = function (f, server) {
        if (!$('[data-wf-head]').hidden) return;
        if (typeof f.color === 'number') root.style.setProperty('--wf', '#' + f.color.toString(16).padStart(6, '0'));
        var page = f.page || {};
        root.classList.toggle('wf-bg-solid', page.background === 'solid');
        root.classList.toggle('wf-bg-gradient', page.background === 'gradient');
        root.classList.toggle('wf-bg-aurora', page.background === 'aurora');
        root.classList.toggle('wf-bg-waves', page.background === 'waves');
        var foot = $('[data-wf-foot]'); if (foot) foot.hidden = page.hide_branding === true;
        document.title = (f.title || texts.form) + (server.name ? ' \xB7 ' + server.name : '');
        if (server.icon) document.querySelectorAll('link[rel~="icon"]').forEach(function (link) { link.setAttribute('href', server.icon); });
        var name = $('[data-wf-server]'); if (name) name.textContent = page.show_name === false ? '' : server.name || '';
        var icon = $('[data-wf-icon]'); if (icon && server.icon && page.show_icon !== false) icon.src = server.icon;
        $('[data-wf-title]').textContent = f.title || texts.form;
        var desc = $('[data-wf-desc]'); desc.textContent = f.description || ''; desc.hidden = !f.description;
        $('[data-wf-head]').hidden = false;
      };

      var load = function () {
        show(['loading']);
        fetch(api, { credentials: 'same-origin', headers: { Accept: 'application/json' } })
          .then(function (res) { return res.json().catch(function () { return null; }).then(function (data) { return { status: res.status, data: data }; }); })
          .then(function (r) {
            var data = r.data || {};
            if (r.status === 401 || data.logged === false) {
              if (data.look && data.look.form) dress(data.look.form, data.look.server || {});
              show(['login']);
              return;
            }
            if (!data.ok) { if (r.status === 404) error(texts.notFound, texts.notFoundHelp, false); else error(texts.noLoad, texts.noLoadHelp, true); return; }
            var f = data.form, server = data.server || {};
            dress(f, server);
            $('[data-wf-who]').textContent = fill(texts.answeringAs, { a: (data.user && data.user.username) || '' });
            $('[data-wf-staff]').textContent = fill(texts.staffReads, { a: server.name || '' });
            if (!data.can) {
              // One submission already waiting is shown as where it is, not as a lock.
              var pending = data.code === 'pending';
              $('[data-wf-refused-title]').hidden = !pending;
              $('[data-wf-refused-title]').textContent = pending ? texts.pendingTitle : '';
              $('[data-wf-state="refused"]').classList.toggle('is-pending', pending);
              $('[data-wf-reason]').textContent = data.reason || '';
              show(['who', 'refused']);
              return;
            }
            list.textContent = '';
            (f.questions || []).forEach(function (q, i) { list.appendChild(question(q, i)); });
            steps = Math.max(1, Math.ceil((f.questions || []).length / PAGE));
            $('[data-wf-progress]').hidden = !(f.questions || []).length;
            show(['who', 'fill']);
            goTo(0, false);
          })
          .catch(function () { error(texts.noLoad, texts.noLoadHelp, true); });
      };
      $('[data-wf-retry]').addEventListener('click', load);
      load();
    })();
  })();<\/script> </body> </html> `])), addAttribute(lang, "lang"), title, addAttribute(description, "content"), addAttribute(preview?.color ?? "#f0a88f", "content"), addAttribute(canonical, "href"), LANGS.map((l) => renderTemplate`<link rel="alternate"${addAttribute(l.hreflang, "hreflang")}${addAttribute(`${SITE}${pathIn(l.code)}`, "href")}>`), addAttribute(`${SITE}${pathIn("en")}`, "href"), addAttribute(server?.icon ?? "/assets/mascot-icon.png", "href"), addAttribute(preview?.siteName ?? "Petto", "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(canonical, "content"), addAttribute(LANGS.find((l) => l.code === lang).locale, "content"), LANGS.filter((l) => l.code !== lang).map((l) => renderTemplate`<meta property="og:locale:alternate"${addAttribute(l.locale, "content")}>`), addAttribute(ogImage, "content"), addAttribute(large ? "summary_large_image" : "summary", "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(ogImage, "content"), unescapeHTML(`
    @font-face { font-family: 'Jakarta Variable'; src: url('/fonts/dash/plus-jakarta-sans-latin-wght-normal.woff2') format('woff2-variations'); font-weight: 200 800; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122; }
    @font-face { font-family: 'Jakarta Variable'; src: url('/fonts/dash/plus-jakarta-sans-latin-ext-wght-normal.woff2') format('woff2-variations'); font-weight: 200 800; font-display: swap; unicode-range: U+0100-02BA, U+1E00-1EFF, U+2C60-2C7F, U+A720-A7FF; }
    @font-face { font-family: 'Fraunces Variable'; src: url('/fonts/dash/fraunces-latin-wght-normal.woff2') format('woff2-variations'); font-weight: 100 900; font-display: swap; unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122; }
    @font-face { font-family: 'Fraunces Variable'; src: url('/fonts/dash/fraunces-latin-ext-wght-normal.woff2') format('woff2-variations'); font-weight: 100 900; font-display: swap; unicode-range: U+0100-02BA, U+1E00-1EFF, U+2C60-2C7F, U+A720-A7FF; }
  `), renderHead(), addAttribute(["wf", { "wf-bg-solid": page.background === "solid", "wf-bg-gradient": page.background === "gradient", "wf-bg-aurora": page.background === "aurora", "wf-bg-waves": page.background === "waves" }], "class:list"), addAttribute(style || void 0, "style"), addAttribute(id ?? "", "data-wf-id"), addAttribute(String(status), "data-wf-status"), addAttribute(lang, "data-wf-lang"), addAttribute(formPagePath(lang), "data-wf-base"), showIcon && (server?.icon ? renderTemplate`<img${addAttribute(server.icon, "src")} alt="" width="34" height="34" data-wf-icon>` : server ? renderTemplate`<span class="wf-letter" data-wf-letter>${server.name.slice(0, 1) || "?"}</span>` : renderTemplate`<img src="/assets/mascot-icon.webp" alt="" width="34" height="34" data-wf-icon>`), showName ? server.name : server ? "" : "Petto", LANGS.map((l) => renderTemplate`<a${addAttribute(pathIn(l.code), "href")}${addAttribute(["wf-lang", { on: l.code === lang }], "class:list")}${addAttribute(l.hreflang, "hreflang")}${addAttribute(l.hreflang, "lang")}${addAttribute(l.code === lang ? "page" : void 0, "aria-current")}${addAttribute(l.code, "data-wf-lang-link")}>${l.label}</a>`), addAttribute(dt("Change theme"), "aria-label"), addAttribute(dt("Change theme"), "title"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:sun-fill", "width": "15", "height": "15" }), page.banner && renderTemplate`<div class="wf-banner" data-wf-banner><img${addAttribute(page.banner, "src")} alt="" decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.hidden=true"></div>`, addAttribute(!look, "hidden"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:list-checks-fill", "width": "13", "height": "13" }), dt("Form"), id && renderTemplate`<span class="wf-id"${addAttribute(dt("Link of the form:"), "title")} translate="no"><span class="wf-id-p">~/form/</span><span>${id}</span><i class="wf-caret" aria-hidden="true"></i></span>`, look?.title ?? "", look?.description ? renderTemplate`<p class="wf-desc" data-wf-desc>${look.description}</p>` : renderTemplate`<p class="wf-desc" data-wf-desc hidden></p>`, addAttribute(notFound, "hidden"), renderComponent($$result, "Icon", $$Icon, { "name": "simple-icons:discord", "width": "22", "height": "22" }), dt("Log in to fill in this form"), dt("Petto only asks Discord who you are, to send your answers as you and check that you are in the server."), addAttribute(id ? `/f/login?form=${id}&lang=${encodeURIComponent(lang)}` : "/f/login", "href"), renderComponent($$result, "Icon", $$Icon, { "name": "simple-icons:discord", "width": "16", "height": "16" }), dt("Log in with Discord"), addAttribute(!notFound, "hidden"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "22", "height": "22" }), notFound ? texts.notFound : "", notFound ? texts.notFoundHelp : "", addAttribute(lang === "en" ? "/" : lang === "es" ? "/es/" : "/pt-br/", "href"), addAttribute(!notFound, "hidden"), dt("Go to Petto"), dt("Try again"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:user-circle-fill", "width": "16", "height": "16" }), dt("Not you?"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "34", "height": "34" }), renderComponent($$result, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "13", "height": "13" }), dt("Sent"), dt("Your answers reached the staff."), renderComponent($$result, "Icon", $$Icon, { "name": "ph:hourglass-medium-fill", "width": "13", "height": "13" }), dt("In review"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:envelope-simple-fill", "width": "13", "height": "13" }), dt("Result"), dt("The staff accepts or denies it in Discord."), renderComponent($$result, "Icon", $$Icon, { "name": "ph:lock-fill", "width": "18", "height": "18", "class": "wf-ic-lock" }), renderComponent($$result, "Icon", $$Icon, { "name": "ph:hourglass-medium-fill", "width": "18", "height": "18", "class": "wf-ic-wait" }), renderComponent($$result, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15" }), renderComponent($$result, "Icon", $$Icon, { "name": "ph:arrow-left-bold", "width": "14", "height": "14" }), dt("Back"), dt("Next"), renderComponent($$result, "Icon", $$Icon, { "name": "ph:arrow-right-bold", "width": "14", "height": "14" }), renderComponent($$result, "Icon", $$Icon, { "name": "ph:paper-plane-tilt-fill", "width": "15", "height": "15" }), dt("Send"), addAttribute(page.hide_branding === true, "hidden"), addAttribute(lang === "en" ? "/" : lang === "es" ? "/es/" : "/pt-br/", "href"), dt("Forms by Petto"), defineScriptVars({ texts }));
}, "/home/runner/work/petto-web/petto-web/src/components/WebFormPage.astro", void 0);

export { $$WebFormPage as $ };
