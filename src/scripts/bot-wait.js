// Waiting for Petto: one place for every dashboard action that goes through the bot (window.__dglBotWait, bound once to the document, so the
// pages that the dashboard's navigation swaps in can use it without any binding). Included by DashBotWait.astro, which also gives the look.
//
//   __dglBotWait.request(url, payload, options)  -> a promise of { ok, status, data, message, unreachable } (it never rejects), with .cancel()
//   __dglBotWait.ui(host, { skeleton })          -> the waiting state alone: skeleton + ONE line of status, { status(text), clear(), fail(again) }
//   __dglBotWait.watch()                         -> a progress line for a page the browser posts itself (a form): { stop() }
//   __dglBotWait.text('notAnswering')            -> the words of the final error, in the dashboard's language
//
// While a request is out, `host` shows a skeleton (shape: 'rows', 'card' or 'lines') and one line that says what is really happening. Every
// line comes from something that happened: the request was sent, a retry started, a number of seconds went by with no answer:
//   "Asking Petto…"                                    at the start
//   "Petto is asking Reddit…"                          the request is a look-up or a follow (`service`) and the connection is not refused 0.7 s later
//   "Petto is taking longer than usual, trying again…" a retry really started
//   "Reddit is slow to answer…"                        3 s with no answer
//   "Still waiting…"                                   6 s with no answer
// A bot that is away (no answer, a refused connection, 502 or 503 `bot_unavailable`) is asked again by itself at about 1 s, 2.5 s and 4.2 s,
// but only when the server says asking again cannot do it twice (`retry`), and the wait ends by 6 s with the error and a Try again button
// (`again`). A bot that answers but slowly is not given up on: after 4.3 s with no answer the page asks the server whether the bot is there at
// all (bot-ping). If it is, the wait goes on until the action's own limit (`limit`); if it is not, the wait ends. An answer of the bot with a
// message (a 4xx, "Reddit is refusing Petto's requests") is handed back as it is, at once.
//
// options: host (the element that shows the wait), skeleton, ui (a state made with __dglBotWait.ui, shared by several requests of one action),
// onStatus (a function that gets each line instead of host showing it), hold (the element that gets data-dash-hold while waiting, host by default),
// method ('GET' for a read, POST by default), service (the name of the platform that Petto is asking), idempotent (asking again is harmless: a look-up), limit (ms), again (the Try again action).
(function () {
  if (window.__dglBotWait) return;

  var RETRY_AT = [1000, 2500, 4200]; // ms after the start at which each automatic retry begins
  var BUDGET = 6000; // the most the page waits when the bot is not answering
  var SERVICE_AFTER = 700; // a connection that is still open this long was not refused: the bot is asking the platform
  var SLOW_AFTER = 3000;
  var PING_AT = 4300;
  var PING_MAX = 2000;

  var KEYS = {
    asking: 'Asking Petto…',
    service: 'Petto is asking {name}…',
    retrying: 'Petto is taking longer than usual, trying again…',
    slowService: '{name} is slow to answer…',
    slow: 'Petto is slow to answer…',
    waiting: 'Still waiting for the answer. This can take a little longer…',
    notAnswering: 'Petto is not answering. It may be restarting after an update. Try again in a few seconds.',
    again: 'Try again',
  };
  function text(key, vars) {
    var k = KEYS[key] || key;
    if (window.cdt) return window.cdt(k, vars);
    var s = k;
    if (vars) for (var n in vars) s = s.split('{' + n + '}').join(String(vars[n]));
    return s;
  }

  function el(tag, cls, content) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (content !== undefined) node.textContent = content;
    return node;
  }
  function bars(n) { var out = []; for (var i = 0; i < n; i++) out.push(el('i', 'bw-bar')); return out; }

  // The placeholders: the shape of what is coming.
  var SHAPES = {
    rows: function () {
      var box = el('div', 'bw-skel bw-rows');
      for (var i = 0; i < 3; i++) { var row = el('div', 'bw-row'); var t = el('div', 'bw-txt'); t.append.apply(t, bars(2)); row.append(el('i', 'bw-pic'), t); box.append(row); }
      return box;
    },
    card: function () {
      var box = el('div', 'bw-skel bw-card');
      var t = el('div', 'bw-txt'); t.append.apply(t, bars(2));
      box.append(el('i', 'bw-pic bw-pic-big'), t);
      return box;
    },
    lines: function () { var box = el('div', 'bw-skel bw-lines'); box.append.apply(box, bars(2)); return box; },
  };

  // data-dash-hold keeps the dashboard's live redraw from replacing the page under a request that is out (it counts, since several can overlap).
  function hold(target) {
    if (!target) return function () {};
    target.__bwHold = (target.__bwHold || 0) + 1;
    target.setAttribute('data-dash-hold', '');
    var released = false;
    return function () {
      if (released) return;
      released = true;
      target.__bwHold -= 1;
      if (target.__bwHold <= 0) target.removeAttribute('data-dash-hold');
    };
  }

  function ui(host, o) {
    o = o || {};
    var release = hold(o.hold === undefined ? host : o.hold);
    var root = el('div', 'bw' + (o.skeleton === 'none' ? ' bw-flat' : ''));
    root.setAttribute('aria-busy', 'true');
    var line = el('p', 'bw-line');
    line.setAttribute('role', 'status');
    var dots = el('span', 'bw-dots');
    dots.setAttribute('aria-hidden', 'true');
    dots.append.apply(dots, bars(3).map(function (b) { b.className = ''; return b; }));
    var label = el('span', 'bw-text', text('asking'));
    line.append(dots, label);
    root.append(line);
    var shape = SHAPES[o.skeleton === undefined ? 'lines' : o.skeleton];
    if (shape) root.append(shape());
    host.replaceChildren(root);
    var shown = root; // what is in the host now (the wait, or its error)
    return {
      status: function (words) { if (words && label.textContent !== words) label.textContent = words; },
      clear: function () { release(); if (shown.parentNode === host) shown.remove(); },
      // The wait is over and the bot did not answer: the error, and the button that does the same action again.
      fail: function (again) {
        release();
        var box = el('div', 'bw-err');
        box.setAttribute('role', 'alert');
        box.append(el('p', 'bw-err-text', text('notAnswering')));
        if (again) {
          var button = el('button', 'btn btn-ghost btn-sm', text('again'));
          button.type = 'button';
          button.addEventListener('click', function (event) {
            event.preventDefault();
            button.disabled = true;
            if (shown === box && box.parentNode === host) box.remove();
            again();
          });
          box.append(button);
        }
        if (shown.parentNode === host) { host.replaceChildren(box); shown = box; }
      },
    };
  }

  function pingUrl(url) { return String(url).replace(/\/[^\/?#]*(?:[?#].*)?$/, '/bot-ping'); }

  function request(url, payload, o) {
    o = o || {};
    var own = !o.ui;
    var view = o.ui || (o.onStatus ? { status: o.onStatus, clear: function () {}, fail: function () {} } : o.host ? ui(o.host, o) : null);
    var start = Date.now();
    var attempt = 0;
    var current = null; // the attempt that is out now (null between attempts)
    var settled = false;
    var timers = [];
    var done;
    var limit = o.limit || 14000;

    var promise = new Promise(function (resolve) { done = resolve; });
    function later(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function say(key, vars) { if (view && !settled) view.status(text(key, vars)); }
    function end(result) {
      if (settled) return;
      settled = true;
      timers.forEach(clearTimeout);
      if (current) { try { current.abort(); } catch (e) { /* already over */ } current = null; }
      if (view) { if (result.unreachable) view.fail(o.again); else if (own) view.clear(); }
      done(result);
    }
    var gone = function (status, data) { return { ok: false, status: status || 0, data: data || null, message: '', unreachable: true }; };

    function retryOrEnd(canRetry, status, data) {
      var at = RETRY_AT[attempt - 1];
      var elapsed = Date.now() - start;
      if (!canRetry || at === undefined || elapsed > BUDGET - 900) { end(gone(status, data)); return; }
      later(Math.max(0, at - elapsed), function () { if (settled) return; say('retrying'); send(); });
    }
    function answered(status, data) {
      // 502 and 503 are "the bot is not there" only when they carry no message of the bot's own.
      var away = (status === 502 || status === 503 || status === 504) && (!data || data.error === 'bot_unavailable');
      if (!away) {
        end({ ok: Boolean(status >= 200 && status < 300 && !(data && data.ok === false)), status: status, data: data, message: data && typeof data.message === 'string' ? data.message : '', unreachable: false });
        return;
      }
      retryOrEnd(data && typeof data.retry === 'boolean' ? data.retry : Boolean(o.idempotent), status, data);
    }
    function send() {
      attempt += 1;
      var mine = new AbortController();
      current = mine;
      var number = attempt;
      if (o.service) later(SERVICE_AFTER, function () { if (!settled && current === mine && number === attempt) say('service', { name: o.service }); });
      var get = o.method === 'GET';
      fetch(url, {
        method: get ? 'GET' : 'POST', credentials: 'same-origin', signal: mine.signal, cache: 'no-store',
        headers: get ? { Accept: 'application/json' } : { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: get ? undefined : JSON.stringify(payload || {}),
      })
        .then(function (res) { return res.json().catch(function () { return null; }).then(function (data) { return { status: res.status, data: data }; }); })
        .then(function (r) { if (settled || current !== mine) return; current = null; answered(r.status, r.data); })
        .catch(function () { if (settled || current !== mine) return; current = null; retryOrEnd(Boolean(o.idempotent), 0, null); });
    }

    // Elapsed time, only while an attempt is out.
    later(SLOW_AFTER, function () { if (current) say(o.service ? 'slowService' : 'slow', { name: o.service }); });
    later(BUDGET, function () { if (current) say('waiting'); });
    later(PING_AT, function () {
      if (settled || !current) return;
      var control = new AbortController();
      later(PING_MAX, function () { control.abort(); });
      fetch(o.pingUrl || pingUrl(url), { credentials: 'same-origin', cache: 'no-store', signal: control.signal, headers: { Accept: 'application/json' } })
        .then(function (res) { return res.json(); })
        // Only a clear "the bot is not there" ends the wait; a ping that fails or is late tells nothing, so the wait goes on.
        .then(function (data) { if (data && data.up === false) end(gone(0, null)); })
        .catch(function () {});
    });
    later(limit, function () { end(gone(0, null)); });

    send();
    promise.cancel = function () {
      if (settled) return;
      settled = true;
      timers.forEach(clearTimeout);
      if (current) { try { current.abort(); } catch (e) { /* already over */ } current = null; }
      if (view && own) view.clear();
      done({ ok: false, status: 0, data: null, message: '', unreachable: false, cancelled: true });
    };
    return promise;
  }

  // A page that the browser posts itself (a form of the dashboard whose answer is the page again): there is nothing to retry from here (the server
  // waits for a restarting bot, pettoBotApi.ts), so this only says what is going on, in a small line over the page, until the answer comes.
  function watch() {
    var host = el('div', 'bw-pill');
    document.body.append(host);
    var view = ui(host, { skeleton: 'none', hold: null });
    var timers = [setTimeout(function () { view.status(text('slow')); }, SLOW_AFTER), setTimeout(function () { view.status(text('waiting')); }, BUDGET)];
    return { stop: function () { timers.forEach(clearTimeout); view.clear(); host.remove(); } };
  }

  window.__dglBotWait = { request: request, ui: ui, watch: watch, text: text };
})();
