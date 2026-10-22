// The builder of reaction roles (page: dash/guild/[id]/reaction-role). It keeps the whole message in one object, draws the rows of buttons and
// the preview from it, and writes it as JSON into a hidden field before the form is sent. The dashboard swaps pages without a reload and runs
// this script again each time, so everything is tied to the elements that are on the page now.
(function () {
  var root = document.getElementById('rb');
  var dataEl = document.getElementById('rb-data');
  if (!root || !dataEl || root.getAttribute('data-bound')) return;
  root.setAttribute('data-bound', '1');

  var data = JSON.parse(dataEl.textContent || '{}');
  var W = data.words || {};
  var MAX_ROWS = 5, PER_ROW = 5;
  var form = document.getElementById('rb-form');
  var payloadField = document.getElementById('rb-payload');
  var errorBox = document.getElementById('rb-client-error');

  var el = function (id) { return document.getElementById(id); };
  var clone = function (value) { return JSON.parse(JSON.stringify(value)); };
  var esc = function (text) { return String(text == null ? '' : text).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  function blankButton() { return { id: null, key: '', label: '', empty: false, style: 1, roleId: '', mode: 'toggle', emoji: '' }; }
  function normalize(source) {
    var s = source || {};
    var embed = s.embed || {};
    var rows = (s.rows || []).map(function (row) { return (row || []).map(function (b) { return Object.assign(blankButton(), b); }); }).filter(function (row) { return row.length; });
    return {
      messageId: s.messageId || '',
      channelId: s.channelId || '',
      content: s.content || '',
      embed: { enabled: embed.enabled !== false && (embed.enabled || embed.title || embed.description || !s.messageId), title: embed.title || '', description: embed.description || '', color: embed.color || '#f9d3e0', footer: embed.footer || '', image: embed.image || '', thumbnail: embed.thumbnail || '' },
      rows: rows.length ? rows : [[blankButton()]],
    };
  }
  var initial = normalize(data.initial);
  var state = clone(initial);

  // ---- Fields of the message
  var fields = {
    channel: el('rb-channel'), content: el('rb-content'), on: el('rb-embed-on'), embedBox: el('rb-embed'),
    title: el('rb-title'), desc: el('rb-desc'), color: el('rb-color'), footer: el('rb-footer'), thumb: el('rb-thumb'), image: el('rb-image'),
    template: el('rb-template'),
  };
  // The color field is the picker of the dashboard: its value is set directly and the picker is told to redraw.
  function setColor(hex) {
    fields.color.value = hex;
    var box = fields.color.closest('[data-colorpicker]');
    if (box) box.dispatchEvent(new CustomEvent('cp-set', { detail: hex }));
  }
  function writeFields() {
    fields.channel.value = state.channelId;
    fields.content.value = state.content;
    fields.on.checked = state.embed.enabled;
    fields.embedBox.hidden = !state.embed.enabled;
    fields.title.value = state.embed.title;
    fields.desc.value = state.embed.description;
    setColor(state.embed.color);
    fields.footer.value = state.embed.footer;
    fields.thumb.value = state.embed.thumbnail;
    fields.image.value = state.embed.image;
  }
  function readFields() {
    state.channelId = fields.channel.value;
    state.content = fields.content.value;
    state.embed.enabled = fields.on.checked;
    fields.embedBox.hidden = !state.embed.enabled;
    state.embed.title = fields.title.value;
    state.embed.description = fields.desc.value;
    state.embed.footer = fields.footer.value;
    state.embed.thumbnail = fields.thumb.value.trim();
    state.embed.image = fields.image.value.trim();
  }
  ['channel', 'content', 'on', 'title', 'desc', 'footer', 'thumb', 'image'].forEach(function (name) {
    var node = fields[name];
    node.addEventListener('input', function () { readFields(); sync(); });
    node.addEventListener('change', function () { readFields(); sync(); });
  });
  fields.color.addEventListener('input', function () { state.embed.color = fields.color.value; sync(); });
  if (fields.template) {
    fields.template.addEventListener('change', function () {
      var chosen = data.templates[Number(fields.template.value)];
      if (!chosen) return;
      state.content = chosen.content || '';
      if (chosen.embed) {
        state.embed = { enabled: true, title: chosen.embed.title || '', description: chosen.embed.description || '', color: chosen.embed.color || '#f9d3e0', footer: chosen.embed.footer || '', image: chosen.embed.image || '', thumbnail: chosen.embed.thumbnail || '' };
      } else state.embed.enabled = false;
      writeFields();
      sync(true);
    });
  }

  // ---- Rows of buttons
  var rowsEl = el('rb-rows');
  function roleOptions(selected) {
    return '<option value="">' + esc(W.selectRole) + '</option>' + (data.roles || []).map(function (r) { return '<option value="' + esc(r.id) + '"' + (r.id === selected ? ' selected' : '') + '>' + esc(r.name) + '</option>'; }).join('');
  }
  function styleOptions(selected) {
    return (data.styles || []).map(function (st) { return '<option value="' + st.value + '"' + (Number(selected) === st.value ? ' selected' : '') + '>' + esc(st.label) + '</option>'; }).join('');
  }
  function modeOptions(selected) {
    return [['toggle', W.toggle], ['add', W.addOnly], ['remove', W.removeOnly]].map(function (m) { return '<option value="' + m[0] + '"' + (selected === m[0] ? ' selected' : '') + '>' + esc(m[1]) + '</option>'; }).join('');
  }
  function emojiHtml(value, size) {
    if (!value) return '';
    var custom = /^<(a?):(\w+):(\d+)>$/.exec(value);
    if (custom) return '<img src="https://cdn.discordapp.com/emojis/' + custom[3] + '.' + (custom[1] ? 'gif' : 'png') + '?size=' + (size || 48) + '" alt="' + esc(custom[2]) + '">';
    return '<span>' + esc(value) + '</span>';
  }
  function renderRows() {
    rowsEl.innerHTML = state.rows.map(function (row, r) {
      var buttons = row.map(function (b, i) {
        return '<div class="rb-btn-card" data-r="' + r + '" data-i="' + i + '">' +
          '<div class="rb-tools">' +
            (i > 0 ? '<button type="button" class="rb-tool" data-act="left" title="' + esc(W.moveLeft) + '" aria-label="' + esc(W.moveLeft) + '">←</button>' : '') +
            (i < row.length - 1 ? '<button type="button" class="rb-tool" data-act="right" title="' + esc(W.moveRight) + '" aria-label="' + esc(W.moveRight) + '">→</button>' : '') +
            (row.length < PER_ROW || state.rows.length < MAX_ROWS ? '<button type="button" class="rb-tool" data-act="copy" title="' + esc(W.duplicate) + '" aria-label="' + esc(W.duplicate) + '">⧉</button>' : '') +
            '<button type="button" class="rb-del" data-act="del-button" title="' + esc(W.removeButton) + '" aria-label="' + esc(W.removeButton) + '">×</button></div>' +
          '<div class="rb-btn-grid">' +
            '<div class="full"><label class="rb-lbl">' + esc(W.button) + '</label><input type="text" data-f="label" maxlength="80" value="' + esc(b.label) + '"' + (b.empty ? ' disabled' : '') + ' placeholder="' + esc(W.button) + '">' +
              '<label class="rb-empty-check"><input type="checkbox" data-f="empty"' + (b.empty ? ' checked' : '') + '>' + esc(W.noName) + '</label></div>' +
            '<div><label class="rb-lbl">' + esc(W.color) + '</label><select data-f="style">' + styleOptions(b.style) + '</select></div>' +
            '<div><label class="rb-lbl">' + esc(W.role) + '</label><select data-f="roleId">' + roleOptions(b.roleId) + '</select></div>' +
            '<div><label class="rb-lbl">' + esc(W.behavior) + '</label><select data-f="mode">' + modeOptions(b.mode) + '</select></div>' +
            '<div><label class="rb-lbl">' + esc(W.emojiOptional) + '</label><button type="button" class="rb-emoji-btn" data-act="pick-emoji">' + (b.emoji ? emojiHtml(b.emoji, 32) + '<span>' + esc(b.emoji.replace(/^<a?:(\w+):\d+>$/, ':$1:')) + '</span>' : '<span>😀 ' + esc(W.selectEmoji) + '</span>') + '</button></div>' +
          '</div></div>';
      }).join('');
      return '<div class="rb-row" data-r="' + r + '"><div class="rb-row-head"><span>' + esc(String(W.row || 'Row {a}').replace('{a}', r + 1)) + '</span>' +
        '<span class="rb-tools">' + (r > 0 ? '<button type="button" class="rb-tool" data-act="row-up" title="' + esc(W.moveUp) + '" aria-label="' + esc(W.moveUp) + '">↑</button>' : '') + (r < state.rows.length - 1 ? '<button type="button" class="rb-tool" data-act="row-down" title="' + esc(W.moveDown) + '" aria-label="' + esc(W.moveDown) + '">↓</button>' : '') + '</span>' +
        (state.rows.length > 1 ? '<button type="button" class="rb-del" data-act="del-row" title="' + esc(W.removeRow) + '" aria-label="' + esc(W.removeRow) + '">×</button>' : '') + '</div>' +
        buttons + (row.length < PER_ROW ? '<button type="button" class="rb-add-btn" data-act="add-button">+ ' + esc(W.addButton) + '</button>' : '') + '</div>';
    }).join('');
    el('rb-add-row').hidden = state.rows.length >= MAX_ROWS;
  }
  rowsEl.addEventListener('input', onRowEdit);
  rowsEl.addEventListener('change', onRowEdit);
  function onRowEdit(event) {
    var target = event.target;
    var card = target.closest && target.closest('.rb-btn-card');
    if (!card || !target.getAttribute('data-f')) return;
    var b = state.rows[Number(card.getAttribute('data-r'))][Number(card.getAttribute('data-i'))];
    var field = target.getAttribute('data-f');
    if (field === 'empty') {
      b.empty = target.checked;
      var input = card.querySelector('[data-f="label"]');
      if (input) input.disabled = b.empty;
    } else if (field === 'style') b.style = Number(target.value);
    else b[field] = target.value;
    sync();
  }
  rowsEl.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('[data-act]');
    if (!button) return;
    var rowEl = button.closest('.rb-row');
    var r = rowEl ? Number(rowEl.getAttribute('data-r')) : -1;
    var card = button.closest('.rb-btn-card');
    var act = button.getAttribute('data-act');
    if (act === 'add-button') state.rows[r].push(blankButton());
    else if (act === 'del-button') { state.rows[r].splice(Number(card.getAttribute('data-i')), 1); if (!state.rows[r].length) state.rows.splice(r, 1); if (!state.rows.length) state.rows = [[blankButton()]]; }
    else if (act === 'del-row') state.rows.splice(r, 1);
    else if (act === 'left' || act === 'right') {
      var at = Number(card.getAttribute('data-i'));
      var to = act === 'left' ? at - 1 : at + 1;
      var moved = state.rows[r].splice(at, 1)[0];
      state.rows[r].splice(to, 0, moved);
    } else if (act === 'row-up' || act === 'row-down') {
      var other = act === 'row-up' ? r - 1 : r + 1;
      var tmp = state.rows[r]; state.rows[r] = state.rows[other]; state.rows[other] = tmp;
    } else if (act === 'copy') {
      // The copy has no emoji of its own (each button of a message needs a different one) and is saved as a new button.
      var src = state.rows[r][Number(card.getAttribute('data-i'))];
      var twin = Object.assign({}, src, { id: null, key: '', emoji: '' });
      if (twin.empty) { twin.empty = false; twin.label = twin.label || ''; }
      if (state.rows[r].length < PER_ROW) state.rows[r].splice(Number(card.getAttribute('data-i')) + 1, 0, twin);
      else if (state.rows.length < MAX_ROWS) state.rows.splice(r + 1, 0, [twin]);
    }
    else if (act === 'pick-emoji') { openPicker(r, Number(card.getAttribute('data-i'))); return; }
    renderRows();
    sync(true);
  });
  el('rb-add-row').addEventListener('click', function () {
    if (state.rows.length >= MAX_ROWS) return;
    state.rows.push([blankButton()]);
    renderRows();
    sync(true);
  });

  // ---- Emoji picker
  var modal = el('rb-modal');
  var grid = el('rb-emoji-grid');
  var search = el('rb-emoji-search');
  var tab = (data.customEmojis || []).length ? 'server' : 'unicode';
  var target = null;
  function openPicker(r, i) {
    target = { r: r, i: i };
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
    modal.querySelectorAll('.rb-tab').forEach(function (node) { node.classList.toggle('active', node.getAttribute('data-tab') === name); });
    search.placeholder = name === 'server' ? W.searchServer : W.searchUnicode;
    drawEmojis();
  }
  function drawEmojis() {
    var q = search.value.trim().toLowerCase();
    var html = '';
    if (tab === 'server') {
      var list = (data.customEmojis || []).filter(function (e) { return !q || e.name.toLowerCase().indexOf(q) !== -1; });
      html = list.map(function (e) {
        var value = '<' + (e.animated ? 'a' : '') + ':' + e.name + ':' + e.id + '>';
        return '<button type="button" class="rb-emoji" data-emoji="' + esc(value) + '" title=":' + esc(e.name) + ':"><img loading="lazy" src="https://cdn.discordapp.com/emojis/' + esc(e.id) + '.' + (e.animated ? 'gif' : 'png') + '?size=48" alt=""></button>';
      }).join('');
      if (!html) html = '<div class="rb-none">' + esc((data.customEmojis || []).length ? W.noMatches : W.noServerEmojis) + '</div>';
    } else {
      (data.unicode || []).forEach(function (group) {
        var items = group.emojis.filter(function (e) { return !q || e[1].toLowerCase().indexOf(q) !== -1 || e[0] === q; });
        if (!items.length) return;
        html += '<div class="rb-group">' + esc(group.name) + '</div>' + items.map(function (e) { return '<button type="button" class="rb-emoji" data-emoji="' + esc(e[0]) + '" title="' + esc(e[1]) + '">' + esc(e[0]) + '</button>'; }).join('');
      });
      if (!html) html = '<div class="rb-none">' + esc(W.noMatches) + '</div>';
    }
    grid.innerHTML = html;
  }
  modal.querySelectorAll('.rb-tab').forEach(function (node) { node.addEventListener('click', function () { setTab(node.getAttribute('data-tab')); }); });
  search.addEventListener('input', drawEmojis);
  grid.addEventListener('click', function (event) {
    var pick = event.target.closest && event.target.closest('[data-emoji]');
    if (!pick || !target) return;
    state.rows[target.r][target.i].emoji = pick.getAttribute('data-emoji');
    closePicker();
    renderRows();
    sync(true);
  });
  el('rb-emoji-clear').addEventListener('click', function () {
    if (!target) return;
    state.rows[target.r][target.i].emoji = '';
    closePicker();
    renderRows();
    sync(true);
  });
  el('rb-modal-close').addEventListener('click', closePicker);
  modal.addEventListener('click', function (event) { if (event.target === modal) closePicker(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !modal.hidden) closePicker(); });

  // ---- Preview (what the message looks like in Discord, with the colors of the buttons)
  var previewEl = el('rb-preview');
  function drawPreview() {
    var html = '<div class="rb-pv-head"><span>Petto</span><span class="rb-pv-app">' + esc(W.app) + '</span><span class="rb-pv-time">' + esc(W.today) + '</span></div>';
    if (state.content.trim()) html += '<div class="rb-pv-content">' + esc(state.content) + '</div>';
    var e = state.embed;
    if (e.enabled && (e.title || e.description || e.footer || e.image || e.thumbnail)) {
      html += '<div class="rb-pv-embed" style="--c:' + esc(e.color) + '">' +
        (/^https?:\/\//.test(e.thumbnail) ? '<img class="rb-pv-thumb" src="' + esc(e.thumbnail) + '" alt="">' : '') +
        (e.title ? '<div class="rb-pv-title">' + esc(e.title) + '</div>' : '') +
        (e.description ? '<div class="rb-pv-desc">' + esc(e.description) + '</div>' : '') +
        (/^https?:\/\//.test(e.image) ? '<img class="rb-pv-image" src="' + esc(e.image) + '" alt="">' : '') +
        (e.footer ? '<div class="rb-pv-footer">' + esc(e.footer) + '</div>' : '') + '</div>';
    }
    var colors = {}; (data.styles || []).forEach(function (st) { colors[st.value] = st.color; });
    var roleName = {}; (data.roles || []).forEach(function (r) { roleName[r.id] = r.name; });
    html += '<div class="rb-pv-rows">' + state.rows.map(function (row) {
      return '<div class="rb-pv-row">' + row.map(function (b) {
        var text = b.empty ? '' : (b.label.trim() || roleName[b.roleId] || W.button);
        return '<span class="rb-pv-button" style="background:' + (colors[b.style] || '#5865f2') + '">' + emojiHtml(b.emoji, 32) + (text ? '<span>' + esc(text) + '</span>' : '') + '</span>';
      }).join('') + '</div>';
    }).join('') + '</div>';
    previewEl.innerHTML = html;
  }

  // ---- Checks and the hidden field
  function check() {
    if (!state.channelId) return W.needChannel;
    if (!state.content.trim() && !(state.embed.enabled && (state.embed.title.trim() || state.embed.description.trim()))) return W.needContent;
    var count = 0;
    for (var r = 0; r < state.rows.length; r++) {
      for (var i = 0; i < state.rows[r].length; i++) {
        var b = state.rows[r][i]; count += 1;
        if (!b.roleId) return W.needRole;
        if (b.empty && !b.emoji) return W.needEmojiForEmpty;
        if (!b.empty && !b.label.trim() && !b.emoji) return W.needLook;
      }
    }
    return count ? '' : W.needButton;
  }
  function showError(text) {
    errorBox.hidden = !text;
    errorBox.querySelector('span').textContent = text || '';
    if (text) errorBox.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  function serialize() { payloadField.value = JSON.stringify(state); }
  function sync(structural) {
    serialize();
    drawPreview();
    if (structural) form.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // The dashboard sends forms by itself; a message that is not valid is stopped here, before that.
  form.addEventListener('submit', function (event) {
    readFields();
    serialize();
    var problem = check();
    showError(problem);
    if (problem) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  // "Discard" of the save bar of the dashboard resets the form: the message goes back to how it was.
  form.addEventListener('reset', function () {
    window.setTimeout(function () { state = clone(initial); writeFields(); renderRows(); sync(); showError(''); }, 0);
  });

  writeFields();
  renderRows();
  sync();
  // Once the message exists, the address says which one it is, so a reload opens it instead of a blank builder.
  if (state.messageId && window.history && window.history.replaceState && !/[?&]message=/.test(window.location.search)) {
    window.history.replaceState(null, '', window.location.pathname + '?message=' + state.messageId);
  }
})();
