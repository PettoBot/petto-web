// Gives every input marked data-emoji-input a button that opens an emoji picker (server and unicode emojis).
(function () {
  var dataNode = document.getElementById('ep-data');
  var modal = document.getElementById('ep-modal');
  if (!dataNode || !modal || modal.getAttribute('data-ready')) return;
  modal.setAttribute('data-ready', '1');
  var data = JSON.parse(dataNode.textContent || '{}');
  var W = data.words || {};
  var custom = data.customEmojis || [];
  var grid = document.getElementById('ep-grid');
  var search = document.getElementById('ep-search');
  var target = null;
  var tab = custom.length ? 'server' : 'unicode';

  function esc(text) { return String(text).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function emojiHtml(value) {
    var m = /^<(a?):(\w+):(\d+)>$/.exec(value || '');
    if (m) return '<img src="https://cdn.discordapp.com/emojis/' + m[3] + '.' + (m[1] ? 'gif' : 'png') + '?size=32" alt="">';
    return value ? esc(value) : '';
  }
  function paint(input) {
    var btn = input.parentNode.querySelector('.ep-btn');
    if (!btn) return;
    btn.innerHTML = input.value.trim() ? emojiHtml(input.value.trim()) : '<svg viewBox="0 0 256 256" width="16" height="16" fill="currentColor"><path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Zm-36-96a12 12 0 1 1 12-12 12 12 0 0 1-12 12Zm72 0a12 12 0 1 1 12-12 12 12 0 0 1-12 12Zm4.5 28.5a8 8 0 0 1 .5 11.3 56 56 0 0 1-82 0 8 8 0 0 1 11.8-10.8 40 40 0 0 0 58.4 0 8 8 0 0 1 11.3-.5Z"/></svg>';
  }
  function decorate(input) {
    if (input.getAttribute('data-ep')) return;
    input.setAttribute('data-ep', '1');
    var wrap = document.createElement('span');
    wrap.className = 'ep-wrap';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ep-btn';
    btn.title = W.pick || 'Emoji';
    btn.addEventListener('click', function () { openPicker(input); });
    wrap.appendChild(btn);
    input.addEventListener('input', function () { paint(input); });
    paint(input);
  }
  document.querySelectorAll('input[data-emoji-input]').forEach(decorate);

  function openPicker(input) {
    target = input;
    if (window.dglMotion) window.dglMotion.stay(modal);
    modal.hidden = false;
    setTab(tab);
    search.focus({ preventScroll: true });
  }
  // It fades out (window.dglMotion, the dashboard's motion helper) and is hidden after.
  function closePicker() { if (window.dglMotion) window.dglMotion.hide(modal); else modal.hidden = true; target = null; }
  function setTab(name) {
    tab = name;
    search.value = '';
    modal.querySelectorAll('.ep-tab').forEach(function (node) { node.classList.toggle('active', node.getAttribute('data-tab') === name); });
    draw();
  }
  function draw() {
    var q = search.value.trim().toLowerCase();
    var html = '';
    if (tab === 'server') {
      var list = custom.filter(function (e) { return !q || e.name.toLowerCase().indexOf(q) !== -1; });
      html = list.map(function (e) {
        var value = '<' + (e.animated ? 'a' : '') + ':' + e.name + ':' + e.id + '>';
        return '<button type="button" class="ep-emoji" data-emoji="' + esc(value) + '" title=":' + esc(e.name) + ':"><img loading="lazy" src="https://cdn.discordapp.com/emojis/' + esc(e.id) + '.' + (e.animated ? 'gif' : 'png') + '?size=48" alt=""></button>';
      }).join('');
      if (!html) html = '<div class="ep-none">' + esc(custom.length ? W.noMatches : W.noServerEmojis) + '</div>';
    } else {
      (data.unicode || []).forEach(function (group) {
        var items = group.emojis.filter(function (e) { return !q || e[1].toLowerCase().indexOf(q) !== -1 || e[0] === q; });
        if (!items.length) return;
        html += '<div class="ep-group">' + esc(group.name) + '</div>' + items.map(function (e) { return '<button type="button" class="ep-emoji" data-emoji="' + esc(e[0]) + '" title="' + esc(e[1]) + '">' + esc(e[0]) + '</button>'; }).join('');
      });
      if (!html) html = '<div class="ep-none">' + esc(W.noMatches) + '</div>';
    }
    grid.innerHTML = html;
  }
  function choose(value) {
    if (!target) return;
    target.value = value;
    paint(target);
    target.dispatchEvent(new Event('input', { bubbles: true }));
    target.dispatchEvent(new Event('change', { bubbles: true }));
    closePicker();
  }
  modal.querySelectorAll('.ep-tab').forEach(function (node) { node.addEventListener('click', function () { setTab(node.getAttribute('data-tab')); }); });
  search.addEventListener('input', draw);
  grid.addEventListener('click', function (event) {
    var pick = event.target.closest && event.target.closest('[data-emoji]');
    if (pick) choose(pick.getAttribute('data-emoji'));
  });
  document.getElementById('ep-clear').addEventListener('click', function () { choose(''); });
  document.getElementById('ep-close').addEventListener('click', closePicker);
  modal.addEventListener('click', function (event) { if (event.target === modal) closePicker(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !modal.hidden) closePicker(); });
})();
