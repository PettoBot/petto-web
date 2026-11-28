import { c as createAstro, a as createComponent, d as renderComponent, r as renderTemplate, u as unescapeHTML, b as addAttribute, m as maybeRenderHead } from '../../../../chunks/astro/server_Dl3UQKOP.mjs';
import 'kleur/colors';
import { $ as $$SilentMentionHint } from '../../../../chunks/SilentMentionHint_7n-ZqLfo.mjs';
import { $ as $$Icon } from '../../../../chunks/Icon_CDiFdbJV.mjs';
import { $ as $$DashGuildLayout } from '../../../../chunks/DashGuildLayout_gu0JSEU9.mjs';
import { $ as $$ColorPicker } from '../../../../chunks/ColorPicker_DwzcbTkv.mjs';
import { $ as $$DashAcData } from '../../../../chunks/DashAcData_BviQOYRU.mjs';
import { $ as $$DashSettingsKit } from '../../../../chunks/DashSettingsKit_Dcmo80le.mjs';
import { $ as $$DashStatTiles } from '../../../../chunks/DashStatTiles_C8IRuvbo.mjs';
import { U as UNICODE_EMOJIS } from '../../../../chunks/unicodeEmojis_Bo31Me0D.mjs';
import { m as makeT, g as getDashLang } from '../../../../chunks/dash_CORIPvM-.mjs';
/* empty css                                                  */
import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { j as getGuildInfo, e as getGuildList } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { v as validateTemplate } from '../../../../chunks/embedSchema_Bj4vwR3q.mjs';
import { g as getGuildEmojis } from '../../../../chunks/guildEmojis_CIHVnrpZ.mjs';
import { p as placeInRows, N as NO_EMOJI, a as buttonStyleOf, M as MAX_ROWS, P as PER_ROW, c as MAX_BUTTONS, b as buildRoleButtonComponents } from '../../../../chunks/reactionRoleButtons_C990GI6m.mjs';
export { renderers } from '../../../../renderers.mjs';

const clientCode = "// The builder of reaction roles (page: dash/guild/[id]/reaction-role). It keeps the whole message in one object, draws the rows of buttons and\n// the preview from it, and writes it as JSON into a hidden field before the form is sent. The dashboard swaps pages without a reload and runs\n// this script again each time, so everything is tied to the elements that are on the page now.\n(function () {\n  var root = document.getElementById('rb');\n  var dataEl = document.getElementById('rb-data');\n  if (!root || !dataEl || root.getAttribute('data-bound')) return;\n  root.setAttribute('data-bound', '1');\n\n  var data = JSON.parse(dataEl.textContent || '{}');\n  var W = data.words || {};\n  var MAX_ROWS = 5, PER_ROW = 5;\n  var form = document.getElementById('rb-form');\n  var payloadField = document.getElementById('rb-payload');\n  var errorBox = document.getElementById('rb-client-error');\n\n  var el = function (id) { return document.getElementById(id); };\n  var clone = function (value) { return JSON.parse(JSON.stringify(value)); };\n  var esc = function (text) { return String(text == null ? '' : text).replace(/[&<>\"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', \"'\": '&#39;' }[c]; }); };\n\n  function blankButton() { return { id: null, key: '', label: '', empty: false, style: 1, roleId: '', mode: 'toggle', emoji: '' }; }\n  function normalize(source) {\n    var s = source || {};\n    var embed = s.embed || {};\n    var rows = (s.rows || []).map(function (row) { return (row || []).map(function (b) { return Object.assign(blankButton(), b); }); }).filter(function (row) { return row.length; });\n    return {\n      messageId: s.messageId || '',\n      channelId: s.channelId || '',\n      content: s.content || '',\n      embed: { enabled: embed.enabled !== false && (embed.enabled || embed.title || embed.description || !s.messageId), title: embed.title || '', description: embed.description || '', color: embed.color || '#f9d3e0', footer: embed.footer || '', image: embed.image || '', thumbnail: embed.thumbnail || '' },\n      rows: rows.length ? rows : [[blankButton()]],\n    };\n  }\n  var initial = normalize(data.initial);\n  var state = clone(initial);\n\n  // ---- Fields of the message\n  var fields = {\n    channel: el('rb-channel'), content: el('rb-content'), on: el('rb-embed-on'), embedBox: el('rb-embed'),\n    title: el('rb-title'), desc: el('rb-desc'), color: el('rb-color'), footer: el('rb-footer'), thumb: el('rb-thumb'), image: el('rb-image'),\n    template: el('rb-template'),\n  };\n  // The color field is the picker of the dashboard: its value is set directly and the picker is told to redraw.\n  function setColor(hex) {\n    fields.color.value = hex;\n    var box = fields.color.closest('[data-colorpicker]');\n    if (box) box.dispatchEvent(new CustomEvent('cp-set', { detail: hex }));\n  }\n  function writeFields() {\n    fields.channel.value = state.channelId;\n    fields.content.value = state.content;\n    fields.on.checked = state.embed.enabled;\n    fields.embedBox.hidden = !state.embed.enabled;\n    fields.title.value = state.embed.title;\n    fields.desc.value = state.embed.description;\n    setColor(state.embed.color);\n    fields.footer.value = state.embed.footer;\n    fields.thumb.value = state.embed.thumbnail;\n    fields.image.value = state.embed.image;\n  }\n  function readFields() {\n    state.channelId = fields.channel.value;\n    state.content = fields.content.value;\n    state.embed.enabled = fields.on.checked;\n    fields.embedBox.hidden = !state.embed.enabled;\n    state.embed.title = fields.title.value;\n    state.embed.description = fields.desc.value;\n    state.embed.footer = fields.footer.value;\n    state.embed.thumbnail = fields.thumb.value.trim();\n    state.embed.image = fields.image.value.trim();\n  }\n  ['channel', 'content', 'on', 'title', 'desc', 'footer', 'thumb', 'image'].forEach(function (name) {\n    var node = fields[name];\n    node.addEventListener('input', function () { readFields(); sync(); });\n    node.addEventListener('change', function () { readFields(); sync(); });\n  });\n  fields.color.addEventListener('input', function () { state.embed.color = fields.color.value; sync(); });\n  if (fields.template) {\n    fields.template.addEventListener('change', function () {\n      var chosen = data.templates[Number(fields.template.value)];\n      if (!chosen) return;\n      state.content = chosen.content || '';\n      if (chosen.embed) {\n        state.embed = { enabled: true, title: chosen.embed.title || '', description: chosen.embed.description || '', color: chosen.embed.color || '#f9d3e0', footer: chosen.embed.footer || '', image: chosen.embed.image || '', thumbnail: chosen.embed.thumbnail || '' };\n      } else state.embed.enabled = false;\n      writeFields();\n      sync(true);\n    });\n  }\n\n  // ---- Rows of buttons\n  var rowsEl = el('rb-rows');\n  function roleOptions(selected) {\n    return '<option value=\"\">' + esc(W.selectRole) + '</option>' + (data.roles || []).map(function (r) { return '<option value=\"' + esc(r.id) + '\"' + (r.id === selected ? ' selected' : '') + '>' + esc(r.name) + '</option>'; }).join('');\n  }\n  function styleOptions(selected) {\n    return (data.styles || []).map(function (st) { return '<option value=\"' + st.value + '\"' + (Number(selected) === st.value ? ' selected' : '') + '>' + esc(st.label) + '</option>'; }).join('');\n  }\n  function modeOptions(selected) {\n    return [['toggle', W.toggle], ['add', W.addOnly], ['remove', W.removeOnly]].map(function (m) { return '<option value=\"' + m[0] + '\"' + (selected === m[0] ? ' selected' : '') + '>' + esc(m[1]) + '</option>'; }).join('');\n  }\n  function emojiHtml(value, size) {\n    if (!value) return '';\n    var custom = /^<(a?):(\\w+):(\\d+)>$/.exec(value);\n    if (custom) return '<img src=\"https://cdn.discordapp.com/emojis/' + custom[3] + '.' + (custom[1] ? 'gif' : 'png') + '?size=' + (size || 48) + '\" alt=\"' + esc(custom[2]) + '\">';\n    return '<span>' + esc(value) + '</span>';\n  }\n  function renderRows() {\n    rowsEl.innerHTML = state.rows.map(function (row, r) {\n      var buttons = row.map(function (b, i) {\n        return '<div class=\"rb-btn-card\" data-r=\"' + r + '\" data-i=\"' + i + '\">' +\n          '<div class=\"rb-tools\">' +\n            (i > 0 ? '<button type=\"button\" class=\"rb-tool\" data-act=\"left\" title=\"' + esc(W.moveLeft) + '\" aria-label=\"' + esc(W.moveLeft) + '\">←</button>' : '') +\n            (i < row.length - 1 ? '<button type=\"button\" class=\"rb-tool\" data-act=\"right\" title=\"' + esc(W.moveRight) + '\" aria-label=\"' + esc(W.moveRight) + '\">→</button>' : '') +\n            (row.length < PER_ROW || state.rows.length < MAX_ROWS ? '<button type=\"button\" class=\"rb-tool\" data-act=\"copy\" title=\"' + esc(W.duplicate) + '\" aria-label=\"' + esc(W.duplicate) + '\">⧉</button>' : '') +\n            '<button type=\"button\" class=\"rb-del\" data-act=\"del-button\" title=\"' + esc(W.removeButton) + '\" aria-label=\"' + esc(W.removeButton) + '\">×</button></div>' +\n          '<div class=\"rb-btn-grid\">' +\n            '<div class=\"full\"><label class=\"rb-lbl\">' + esc(W.button) + '</label><input type=\"text\" data-f=\"label\" maxlength=\"80\" value=\"' + esc(b.label) + '\"' + (b.empty ? ' disabled' : '') + ' placeholder=\"' + esc(W.button) + '\">' +\n              '<label class=\"rb-empty-check\"><input type=\"checkbox\" data-f=\"empty\"' + (b.empty ? ' checked' : '') + '>' + esc(W.noName) + '</label></div>' +\n            '<div><label class=\"rb-lbl\">' + esc(W.color) + '</label><select data-f=\"style\">' + styleOptions(b.style) + '</select></div>' +\n            '<div><label class=\"rb-lbl\">' + esc(W.role) + '</label><select data-f=\"roleId\">' + roleOptions(b.roleId) + '</select></div>' +\n            '<div><label class=\"rb-lbl\">' + esc(W.behavior) + '</label><select data-f=\"mode\">' + modeOptions(b.mode) + '</select></div>' +\n            '<div><label class=\"rb-lbl\">' + esc(W.emojiOptional) + '</label><button type=\"button\" class=\"rb-emoji-btn\" data-act=\"pick-emoji\">' + (b.emoji ? emojiHtml(b.emoji, 32) + '<span>' + esc(b.emoji.replace(/^<a?:(\\w+):\\d+>$/, ':$1:')) + '</span>' : '<span>😀 ' + esc(W.selectEmoji) + '</span>') + '</button></div>' +\n          '</div></div>';\n      }).join('');\n      return '<div class=\"rb-row\" data-r=\"' + r + '\"><div class=\"rb-row-head\"><span>' + esc(String(W.row || 'Row {a}').replace('{a}', r + 1)) + '</span>' +\n        '<span class=\"rb-tools\">' + (r > 0 ? '<button type=\"button\" class=\"rb-tool\" data-act=\"row-up\" title=\"' + esc(W.moveUp) + '\" aria-label=\"' + esc(W.moveUp) + '\">↑</button>' : '') + (r < state.rows.length - 1 ? '<button type=\"button\" class=\"rb-tool\" data-act=\"row-down\" title=\"' + esc(W.moveDown) + '\" aria-label=\"' + esc(W.moveDown) + '\">↓</button>' : '') + '</span>' +\n        (state.rows.length > 1 ? '<button type=\"button\" class=\"rb-del\" data-act=\"del-row\" title=\"' + esc(W.removeRow) + '\" aria-label=\"' + esc(W.removeRow) + '\">×</button>' : '') + '</div>' +\n        buttons + (row.length < PER_ROW ? '<button type=\"button\" class=\"rb-add-btn\" data-act=\"add-button\">+ ' + esc(W.addButton) + '</button>' : '') + '</div>';\n    }).join('');\n    el('rb-add-row').hidden = state.rows.length >= MAX_ROWS;\n  }\n  rowsEl.addEventListener('input', onRowEdit);\n  rowsEl.addEventListener('change', onRowEdit);\n  function onRowEdit(event) {\n    var target = event.target;\n    var card = target.closest && target.closest('.rb-btn-card');\n    if (!card || !target.getAttribute('data-f')) return;\n    var b = state.rows[Number(card.getAttribute('data-r'))][Number(card.getAttribute('data-i'))];\n    var field = target.getAttribute('data-f');\n    if (field === 'empty') {\n      b.empty = target.checked;\n      var input = card.querySelector('[data-f=\"label\"]');\n      if (input) input.disabled = b.empty;\n    } else if (field === 'style') b.style = Number(target.value);\n    else b[field] = target.value;\n    sync();\n  }\n  rowsEl.addEventListener('click', function (event) {\n    var button = event.target.closest && event.target.closest('[data-act]');\n    if (!button) return;\n    var rowEl = button.closest('.rb-row');\n    var r = rowEl ? Number(rowEl.getAttribute('data-r')) : -1;\n    var card = button.closest('.rb-btn-card');\n    var act = button.getAttribute('data-act');\n    if (act === 'add-button') state.rows[r].push(blankButton());\n    else if (act === 'del-button') { state.rows[r].splice(Number(card.getAttribute('data-i')), 1); if (!state.rows[r].length) state.rows.splice(r, 1); if (!state.rows.length) state.rows = [[blankButton()]]; }\n    else if (act === 'del-row') state.rows.splice(r, 1);\n    else if (act === 'left' || act === 'right') {\n      var at = Number(card.getAttribute('data-i'));\n      var to = act === 'left' ? at - 1 : at + 1;\n      var moved = state.rows[r].splice(at, 1)[0];\n      state.rows[r].splice(to, 0, moved);\n    } else if (act === 'row-up' || act === 'row-down') {\n      var other = act === 'row-up' ? r - 1 : r + 1;\n      var tmp = state.rows[r]; state.rows[r] = state.rows[other]; state.rows[other] = tmp;\n    } else if (act === 'copy') {\n      // The copy has no emoji of its own (each button of a message needs a different one) and is saved as a new button.\n      var src = state.rows[r][Number(card.getAttribute('data-i'))];\n      var twin = Object.assign({}, src, { id: null, key: '', emoji: '' });\n      if (twin.empty) { twin.empty = false; twin.label = twin.label || ''; }\n      if (state.rows[r].length < PER_ROW) state.rows[r].splice(Number(card.getAttribute('data-i')) + 1, 0, twin);\n      else if (state.rows.length < MAX_ROWS) state.rows.splice(r + 1, 0, [twin]);\n    }\n    else if (act === 'pick-emoji') { openPicker(r, Number(card.getAttribute('data-i'))); return; }\n    renderRows();\n    sync(true);\n  });\n  el('rb-add-row').addEventListener('click', function () {\n    if (state.rows.length >= MAX_ROWS) return;\n    state.rows.push([blankButton()]);\n    renderRows();\n    sync(true);\n  });\n\n  // ---- Emoji picker\n  var modal = el('rb-modal');\n  var grid = el('rb-emoji-grid');\n  var search = el('rb-emoji-search');\n  var tab = (data.customEmojis || []).length ? 'server' : 'unicode';\n  var target = null;\n  function openPicker(r, i) {\n    target = { r: r, i: i };\n    if (window.dglMotion) window.dglMotion.stay(modal);\n    modal.hidden = false;\n    setTab(tab);\n    search.focus({ preventScroll: true });\n  }\n  // It fades out (window.dglMotion, the dashboard's motion helper) and is hidden after.\n  function closePicker() { if (window.dglMotion) window.dglMotion.hide(modal); else modal.hidden = true; target = null; }\n  function setTab(name) {\n    tab = name;\n    search.value = '';\n    modal.querySelectorAll('.rb-tab').forEach(function (node) { node.classList.toggle('active', node.getAttribute('data-tab') === name); });\n    search.placeholder = name === 'server' ? W.searchServer : W.searchUnicode;\n    drawEmojis();\n  }\n  function drawEmojis() {\n    var q = search.value.trim().toLowerCase();\n    var html = '';\n    if (tab === 'server') {\n      var list = (data.customEmojis || []).filter(function (e) { return !q || e.name.toLowerCase().indexOf(q) !== -1; });\n      html = list.map(function (e) {\n        var value = '<' + (e.animated ? 'a' : '') + ':' + e.name + ':' + e.id + '>';\n        return '<button type=\"button\" class=\"rb-emoji\" data-emoji=\"' + esc(value) + '\" title=\":' + esc(e.name) + ':\"><img loading=\"lazy\" src=\"https://cdn.discordapp.com/emojis/' + esc(e.id) + '.' + (e.animated ? 'gif' : 'png') + '?size=48\" alt=\"\"></button>';\n      }).join('');\n      if (!html) html = '<div class=\"rb-none\">' + esc((data.customEmojis || []).length ? W.noMatches : W.noServerEmojis) + '</div>';\n    } else {\n      (data.unicode || []).forEach(function (group) {\n        var items = group.emojis.filter(function (e) { return !q || e[1].toLowerCase().indexOf(q) !== -1 || e[0] === q; });\n        if (!items.length) return;\n        html += '<div class=\"rb-group\">' + esc(group.name) + '</div>' + items.map(function (e) { return '<button type=\"button\" class=\"rb-emoji\" data-emoji=\"' + esc(e[0]) + '\" title=\"' + esc(e[1]) + '\">' + esc(e[0]) + '</button>'; }).join('');\n      });\n      if (!html) html = '<div class=\"rb-none\">' + esc(W.noMatches) + '</div>';\n    }\n    grid.innerHTML = html;\n  }\n  modal.querySelectorAll('.rb-tab').forEach(function (node) { node.addEventListener('click', function () { setTab(node.getAttribute('data-tab')); }); });\n  search.addEventListener('input', drawEmojis);\n  grid.addEventListener('click', function (event) {\n    var pick = event.target.closest && event.target.closest('[data-emoji]');\n    if (!pick || !target) return;\n    state.rows[target.r][target.i].emoji = pick.getAttribute('data-emoji');\n    closePicker();\n    renderRows();\n    sync(true);\n  });\n  el('rb-emoji-clear').addEventListener('click', function () {\n    if (!target) return;\n    state.rows[target.r][target.i].emoji = '';\n    closePicker();\n    renderRows();\n    sync(true);\n  });\n  el('rb-modal-close').addEventListener('click', closePicker);\n  modal.addEventListener('click', function (event) { if (event.target === modal) closePicker(); });\n  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !modal.hidden) closePicker(); });\n\n  // ---- Preview (what the message looks like in Discord, with the colors of the buttons)\n  var previewEl = el('rb-preview');\n  function drawPreview() {\n    var html = '<div class=\"rb-pv-head\"><span>Petto</span><span class=\"rb-pv-app\">' + esc(W.app) + '</span><span class=\"rb-pv-time\">' + esc(W.today) + '</span></div>';\n    if (state.content.trim()) html += '<div class=\"rb-pv-content\">' + esc(state.content) + '</div>';\n    var e = state.embed;\n    if (e.enabled && (e.title || e.description || e.footer || e.image || e.thumbnail)) {\n      html += '<div class=\"rb-pv-embed\" style=\"--c:' + esc(e.color) + '\">' +\n        (/^https?:\\/\\//.test(e.thumbnail) ? '<img class=\"rb-pv-thumb\" src=\"' + esc(e.thumbnail) + '\" alt=\"\">' : '') +\n        (e.title ? '<div class=\"rb-pv-title\">' + esc(e.title) + '</div>' : '') +\n        (e.description ? '<div class=\"rb-pv-desc\">' + esc(e.description) + '</div>' : '') +\n        (/^https?:\\/\\//.test(e.image) ? '<img class=\"rb-pv-image\" src=\"' + esc(e.image) + '\" alt=\"\">' : '') +\n        (e.footer ? '<div class=\"rb-pv-footer\">' + esc(e.footer) + '</div>' : '') + '</div>';\n    }\n    var colors = {}; (data.styles || []).forEach(function (st) { colors[st.value] = st.color; });\n    var roleName = {}; (data.roles || []).forEach(function (r) { roleName[r.id] = r.name; });\n    html += '<div class=\"rb-pv-rows\">' + state.rows.map(function (row) {\n      return '<div class=\"rb-pv-row\">' + row.map(function (b) {\n        var text = b.empty ? '' : (b.label.trim() || roleName[b.roleId] || W.button);\n        return '<span class=\"rb-pv-button\" style=\"background:' + (colors[b.style] || '#5865f2') + '\">' + emojiHtml(b.emoji, 32) + (text ? '<span>' + esc(text) + '</span>' : '') + '</span>';\n      }).join('') + '</div>';\n    }).join('') + '</div>';\n    previewEl.innerHTML = html;\n  }\n\n  // ---- Checks and the hidden field\n  function check() {\n    if (!state.channelId) return W.needChannel;\n    if (!state.content.trim() && !(state.embed.enabled && (state.embed.title.trim() || state.embed.description.trim()))) return W.needContent;\n    var count = 0;\n    for (var r = 0; r < state.rows.length; r++) {\n      for (var i = 0; i < state.rows[r].length; i++) {\n        var b = state.rows[r][i]; count += 1;\n        if (!b.roleId) return W.needRole;\n        if (b.empty && !b.emoji) return W.needEmojiForEmpty;\n        if (!b.empty && !b.label.trim() && !b.emoji) return W.needLook;\n      }\n    }\n    return count ? '' : W.needButton;\n  }\n  function showError(text) {\n    errorBox.hidden = !text;\n    errorBox.querySelector('span').textContent = text || '';\n    if (text) errorBox.scrollIntoView({ block: 'center', behavior: 'smooth' });\n  }\n  function serialize() { payloadField.value = JSON.stringify(state); }\n  function sync(structural) {\n    serialize();\n    drawPreview();\n    if (structural) form.dispatchEvent(new Event('input', { bubbles: true }));\n  }\n\n  // The dashboard sends forms by itself; a message that is not valid is stopped here, before that.\n  form.addEventListener('submit', function (event) {\n    readFields();\n    serialize();\n    var problem = check();\n    showError(problem);\n    if (problem) { event.preventDefault(); event.stopImmediatePropagation(); }\n  }, true);\n  // \"Discard\" of the save bar of the dashboard resets the form: the message goes back to how it was.\n  form.addEventListener('reset', function () {\n    window.setTimeout(function () { state = clone(initial); writeFields(); renderRows(); sync(); showError(''); }, 0);\n  });\n\n  writeFields();\n  renderRows();\n  sync();\n  // Once the message exists, the address says which one it is, so a reload opens it instead of a blank builder.\n  if (state.messageId && window.history && window.history.replaceState && !/[?&]message=/.test(window.location.search)) {\n    window.history.replaceState(null, '', window.location.pathname + '?message=' + state.messageId);\n  }\n})();\n";

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro("https://petto.sbs");
const $$DashReactionRoleBuilder = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DashReactionRoleBuilder;
  const dt = makeT(getDashLang(Astro2));
  const { user, guildId, guildName, guildIcon, channels, roles, customEmojis, templates, initial, editing, error, saved, counts = null } = Astro2.props;
  const buttonsHere = Array.isArray(initial.rows) ? initial.rows.reduce((sum, row) => sum + (Array.isArray(row) ? row.length : 0), 0) : 0;
  const words = {
    button: dt("Button"),
    noName: dt("Empty (only the emoji)"),
    color: dt("Button color"),
    role: dt("Role"),
    behavior: dt("What it does"),
    emojiOptional: dt("Emoji (optional)"),
    addButton: dt("Add button"),
    row: dt("Row {a}", { a: "{a}" }),
    rowN: dt("Row"),
    removeButton: dt("Remove button"),
    removeRow: dt("Remove row"),
    moveLeft: dt("Move left"),
    moveRight: dt("Move right"),
    moveUp: dt("Move row up"),
    moveDown: dt("Move row down"),
    duplicate: dt("Duplicate button"),
    selectRole: dt("Select role..."),
    selectEmoji: dt("Select emoji..."),
    noEmoji: dt("No emoji"),
    searchServer: dt("Search server emojis..."),
    searchUnicode: dt("Search emojis..."),
    noMatches: dt("No emojis match."),
    noServerEmojis: dt("This server has no custom emojis."),
    blurple: dt("Blurple"),
    gray: dt("Gray"),
    green: dt("Green"),
    red: dt("Red"),
    toggle: dt("Toggle (gives it, takes it on the next click)"),
    addOnly: dt("Add only"),
    removeOnly: dt("Remove only"),
    needChannel: dt("Pick a channel."),
    needContent: dt("Write some text or turn the embed on."),
    needButton: dt("Add at least one button."),
    needRole: dt("Every button needs a role."),
    needLook: dt("Every button needs a name or an emoji."),
    needEmojiForEmpty: dt("A button with no name needs an emoji."),
    today: dt("Today at 12:00 PM"),
    app: dt("APP"),
    previewEmpty: dt("Nothing to show yet.")
  };
  const styleOptions = [
    { value: 1, label: words.blurple, color: "#5865f2" },
    { value: 2, label: words.gray, color: "#4e5058" },
    { value: 3, label: words.green, color: "#248046" },
    { value: 4, label: words.red, color: "#da373c" }
  ];
  const textChannels = channels.filter((c) => c.type === 0 || c.type === 5);
  const data = { initial, editing, words, styles: styleOptions, roles, customEmojis, templates, unicode: UNICODE_EMOJIS };
  const dataJson = JSON.stringify(data).replace(/</g, "\\u003c");
  return renderTemplate`${renderComponent($$result, "DashGuildLayout", $$DashGuildLayout, { "guildId": guildId, "guildName": guildName, "guildIcon": guildIcon, "user": user, "active": "reaction-roles", "pageTitle": editing ? dt("Edit reaction role") : dt("Create reaction role"), "data-astro-cid-iuq5bkoe": true }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", '<div class="rb" id="rb" data-astro-cid-iuq5bkoe> <div class="rb-top" data-astro-cid-iuq5bkoe> <a class="rb-back"', " data-astro-cid-iuq5bkoe>", "", "</a> <h1 data-astro-cid-iuq5bkoe>", "</h1> </div> ", " ", " ", ' <div class="rb-error" id="rb-client-error" role="alert" hidden data-astro-cid-iuq5bkoe>', "<span data-astro-cid-iuq5bkoe></span></div> ", ' <form method="POST" id="rb-form" autocomplete="off" data-astro-cid-iuq5bkoe> <input type="hidden" name="payload" id="rb-payload" data-astro-cid-iuq5bkoe> <section class="rb-card rb-channel" data-astro-cid-iuq5bkoe> <div class="sx-panel-head" data-astro-cid-iuq5bkoe> <span class="sx-panel-icon" style="--c:var(--blue)" data-astro-cid-iuq5bkoe>', "</span> <h2 data-astro-cid-iuq5bkoe>", '</h2> </div> <select id="rb-channel"', "", ' data-astro-cid-iuq5bkoe> <option value="" data-astro-cid-iuq5bkoe>', "</option> ", ' </select> <p class="rb-hint" data-astro-cid-iuq5bkoe>', '</p> </section> <section class="rb-card rb-builder" data-astro-cid-iuq5bkoe> <div class="sx-panel-head" data-astro-cid-iuq5bkoe> <span class="sx-panel-icon" style="--c:var(--red)" data-astro-cid-iuq5bkoe>', "</span> <h2 data-astro-cid-iuq5bkoe>", '</h2> </div> <div class="rb-panel" data-astro-cid-iuq5bkoe> <h3 data-astro-cid-iuq5bkoe>', "", "</h3> ", " ", ' <div class="rb-field" data-astro-cid-iuq5bkoe> <label for="rb-content" data-astro-cid-iuq5bkoe>', '</label> <textarea id="rb-content" rows="3" maxlength="2000" data-ac="roles,channels,commands,emojis"', " data-astro-cid-iuq5bkoe></textarea>", ' </div> <label class="rb-check" data-astro-cid-iuq5bkoe><input type="checkbox" id="rb-embed-on" data-astro-cid-iuq5bkoe><span data-astro-cid-iuq5bkoe>', '</span></label> <div id="rb-embed" class="rb-embed" data-astro-cid-iuq5bkoe> <div class="rb-field" data-astro-cid-iuq5bkoe><label for="rb-title" data-astro-cid-iuq5bkoe>', '</label><input type="text" id="rb-title" maxlength="256"', ' data-astro-cid-iuq5bkoe></div> <div class="rb-field" data-astro-cid-iuq5bkoe><label for="rb-desc" data-astro-cid-iuq5bkoe>', '</label><textarea id="rb-desc" rows="4" maxlength="4096" data-ac="roles,channels,commands,emojis"', ' data-astro-cid-iuq5bkoe></textarea></div> <div class="rb-grid" data-astro-cid-iuq5bkoe> <div class="rb-field" data-astro-cid-iuq5bkoe><label data-astro-cid-iuq5bkoe>', "</label> ", ' </div> <div class="rb-field" data-astro-cid-iuq5bkoe><label for="rb-footer" data-astro-cid-iuq5bkoe>', '</label><input type="text" id="rb-footer" maxlength="2048"', ' data-astro-cid-iuq5bkoe></div> <div class="rb-field" data-astro-cid-iuq5bkoe><label for="rb-thumb" data-astro-cid-iuq5bkoe>', '</label><input type="url" id="rb-thumb" maxlength="500" placeholder="https://" data-astro-cid-iuq5bkoe></div> <div class="rb-field" data-astro-cid-iuq5bkoe><label for="rb-image" data-astro-cid-iuq5bkoe>', '</label><input type="url" id="rb-image" maxlength="500" placeholder="https://" data-astro-cid-iuq5bkoe></div> </div> </div> </div> <div class="rb-panel" data-astro-cid-iuq5bkoe> <h3 data-astro-cid-iuq5bkoe>', "", '</h3> <div id="rb-rows" data-astro-cid-iuq5bkoe></div> <button type="button" class="rb-add rb-add-row" id="rb-add-row" data-astro-cid-iuq5bkoe>', "", '</button> <p class="rb-hint" data-astro-cid-iuq5bkoe>', '</p> </div> <div class="rb-panel" data-astro-cid-iuq5bkoe> <h3 data-astro-cid-iuq5bkoe>', "", '</h3> <div class="rb-preview" id="rb-preview" data-astro-cid-iuq5bkoe></div> </div> </section> <div class="rb-actions" data-astro-cid-iuq5bkoe> <p class="rb-hint" data-astro-cid-iuq5bkoe>', '</p> <button type="submit" class="rb-btn rb-primary" id="rb-save" data-astro-cid-iuq5bkoe>', "", '</button> </div> </form> <div class="rb-modal" id="rb-modal" hidden data-astro-cid-iuq5bkoe> <div class="rb-modal-box" role="dialog" aria-modal="true"', ' data-astro-cid-iuq5bkoe> <div class="rb-modal-head" data-astro-cid-iuq5bkoe>', "<strong data-astro-cid-iuq5bkoe>", '</strong><button type="button" class="rb-x" id="rb-modal-close"', " data-astro-cid-iuq5bkoe>", '</button></div> <div class="rb-tabs" data-astro-cid-iuq5bkoe><button type="button" class="rb-tab" data-tab="server" data-astro-cid-iuq5bkoe>', "", '</button><button type="button" class="rb-tab" data-tab="unicode" data-astro-cid-iuq5bkoe>', "", '</button></div> <input type="search" id="rb-emoji-search" class="rb-search" data-astro-cid-iuq5bkoe> <div class="rb-emoji-grid" id="rb-emoji-grid" data-astro-cid-iuq5bkoe></div> <button type="button" class="rb-btn rb-clear" id="rb-emoji-clear" data-astro-cid-iuq5bkoe>', '</button> </div> </div> </div> <script type="application/json" id="rb-data">', "<\/script> <script>", "<\/script> "])), renderComponent($$result2, "DashSettingsKit", $$DashSettingsKit, { "data-astro-cid-iuq5bkoe": true }), maybeRenderHead(), addAttribute(`/dash/guild/${guildId}/automation?section=reaction-roles`, "href"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-left-bold", "width": "13", "height": "13", "data-astro-cid-iuq5bkoe": true }), dt("Back to reaction roles"), editing ? dt("Edit reaction role") : dt("Create reaction role"), renderComponent($$result2, "DashAcData", $$DashAcData, { "roles": roles, "channels": textChannels, "emojis": customEmojis, "data-astro-cid-iuq5bkoe": true }), saved && !error && renderTemplate`<div class="sx-flash" data-astro-cid-iuq5bkoe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:check-circle-fill", "width": "15", "height": "15", "data-astro-cid-iuq5bkoe": true })}${dt("Saved. The message is up to date in Discord.")}</div>`, error && renderTemplate`<div class="sx-flash sx-flash-bad" role="alert" data-astro-cid-iuq5bkoe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "15", "height": "15", "data-astro-cid-iuq5bkoe": true })}${error}</div>`, renderComponent($$result2, "Icon", $$Icon, { "name": "ph:warning-fill", "width": "14", "height": "14", "data-astro-cid-iuq5bkoe": true }), renderComponent($$result2, "DashStatTiles", $$DashStatTiles, { "tiles": [
    ...counts ? [{ label: dt("Button messages"), value: counts.messages, tone: "messages" }, { label: dt("Role buttons"), value: counts.buttons, tone: "voice" }] : [],
    { label: dt("Roles to pick from"), value: roles.length, tone: "joins" },
    ...editing ? [{ label: dt("In this message"), value: buttonsHere, tone: "invites" }] : []
  ], "data-astro-cid-iuq5bkoe": true }), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hash-fill", "width": "17", "height": "17", "data-astro-cid-iuq5bkoe": true }), dt("Channel"), addAttribute(dt("Channel"), "aria-label"), addAttribute(editing, "disabled"), dt("Select a channel..."), textChannels.map((c) => renderTemplate`<option${addAttribute(c.id, "value")} data-astro-cid-iuq5bkoe>#${c.name}${c.type === 5 ? " \xB7 " + dt("Announcement channel") : ""}</option>`), editing ? dt("The message stays in its channel.") : dt("The message is posted in this channel. Announcement channels say so next to their name."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:cursor-click-fill", "width": "17", "height": "17", "data-astro-cid-iuq5bkoe": true }), dt("Message and role buttons"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:chat-text-fill", "width": "14", "height": "14", "data-astro-cid-iuq5bkoe": true }), dt("Message"), templates.length > 0 && renderTemplate`<div class="rb-field" data-astro-cid-iuq5bkoe> <label for="rb-template" data-astro-cid-iuq5bkoe>${dt("Start from a saved embed")}</label> <div class="rb-inline" data-astro-cid-iuq5bkoe> <select id="rb-template" data-astro-cid-iuq5bkoe><option value="" data-astro-cid-iuq5bkoe>${dt("Write it here")}</option>${templates.map((tpl, index) => renderTemplate`<option${addAttribute(index, "value")} data-astro-cid-iuq5bkoe>${tpl.name}</option>`)}</select> <a class="rb-link"${addAttribute(`/dash/guild/${guildId}/embeds`, "href")} target="_blank" rel="noopener" data-astro-cid-iuq5bkoe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-square-out-bold", "width": "12", "height": "12", "data-astro-cid-iuq5bkoe": true })}${dt("Open the embed generator")}</a> </div> <p class="rb-hint" data-astro-cid-iuq5bkoe>${dt("It copies the text and the first embed of the saved design here; you can change them. Variables such as {user} are not filled in this message.")}</p> </div>`, templates.length === 0 && renderTemplate`<p class="rb-hint" data-astro-cid-iuq5bkoe><a class="rb-link"${addAttribute(`/dash/guild/${guildId}/embeds`, "href")} target="_blank" rel="noopener" data-astro-cid-iuq5bkoe>${renderComponent($$result2, "Icon", $$Icon, { "name": "ph:arrow-square-out-bold", "width": "12", "height": "12", "data-astro-cid-iuq5bkoe": true })}${dt("Design an embed in the embed generator")}</a> ${dt("and use it here as a starting point.")}</p>`, dt("Content"), addAttribute(dt("Message content (optional)"), "placeholder"), renderComponent($$result2, "SilentMentionHint", $$SilentMentionHint, { "data-astro-cid-iuq5bkoe": true }), dt("Use an embed"), dt("Title"), addAttribute(dt("Embed title"), "placeholder"), dt("Description"), addAttribute(dt("Embed description"), "placeholder"), dt("Color"), renderComponent($$result2, "ColorPicker", $$ColorPicker, { "id": "rb-color", "name": "rb_color", "value": "#f9d3e0", "label": dt("Color"), "data-astro-cid-iuq5bkoe": true }), dt("Footer"), addAttribute(dt("Footer text (optional)"), "placeholder"), dt("Thumbnail link"), dt("Image link"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:cursor-fill", "width": "14", "height": "14", "data-astro-cid-iuq5bkoe": true }), dt("Role buttons"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:plus-bold", "width": "12", "height": "12", "data-astro-cid-iuq5bkoe": true }), dt("Add button row"), dt("Up to 5 rows of 5 buttons. Petto can only give roles that are below its own role, and it needs Manage Roles."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:eye-fill", "width": "14", "height": "14", "data-astro-cid-iuq5bkoe": true }), dt("Preview"), editing ? dt("Saving changes the message in Discord.") : dt("Saving posts the message in the channel."), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:floppy-disk-fill", "width": "13", "height": "13", "data-astro-cid-iuq5bkoe": true }), editing ? dt("Save changes") : dt("Create reaction role"), addAttribute(dt("Select emoji"), "aria-label"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:smiley-fill", "width": "18", "height": "18", "data-astro-cid-iuq5bkoe": true }), dt("Select emoji"), addAttribute(dt("Close"), "aria-label"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:x-bold", "width": "14", "height": "14", "data-astro-cid-iuq5bkoe": true }), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:hard-drives-fill", "width": "13", "height": "13", "data-astro-cid-iuq5bkoe": true }), dt("Server"), renderComponent($$result2, "Icon", $$Icon, { "name": "ph:smiley-fill", "width": "13", "height": "13", "data-astro-cid-iuq5bkoe": true }), dt("Unicode"), dt("Remove the emoji"), unescapeHTML(dataJson), unescapeHTML(clientCode)) })} `;
}, "/home/runner/work/petto-web/petto-web/src/components/DashReactionRoleBuilder.astro", void 0);

const $$Astro = createAstro("https://petto.sbs");
const prerender = false;
const $$ReactionRole = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ReactionRole;
  const dt = makeT(getDashLang(Astro2));
  const { id } = Astro2.params;
  const botToken = getEnv(Astro2, "DISCORD_TOKEN");
  const apiUrl = getEnv(Astro2, "PETTO_BOT_API_URL");
  const apiKey = getEnv(Astro2, "PETTO_BOT_API_SECRET");
  const auth = await getGuildSession(Astro2, id);
  if ("redirect" in auth) return Astro2.redirect(auth.redirect);
  if (!botToken || !apiUrl || !apiKey) return Astro2.redirect("/dash/manage?error=server_not_configured");
  const apiHeaders = { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
  const DISCORD = "https://discord.com/api/v10";
  const discordHeaders = { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" };
  const [guildInfo, rolesRes, channelsRes] = await Promise.all([getGuildInfo(id, botToken), getGuildList(Astro2, id, botToken, "roles"), getGuildList(Astro2, id, botToken, "channels")]);
  if (!guildInfo) return Astro2.redirect("/dash/manage?error=bot_not_in_guild");
  const allRoles = rolesRes.ok ? await rolesRes.json() : [];
  const roles = allRoles.filter((r) => r.id !== id && !r.managed).sort((a, b) => b.position - a.position).map((r) => ({ id: String(r.id), name: String(r.name), color: Number(r.color ?? 0) }));
  const roleName = (roleId) => roles.find((r) => r.id === roleId)?.name;
  const allChannels = channelsRes.ok ? await channelsRes.json() : [];
  const channels = allChannels.filter((c) => c.type === 0 || c.type === 5).sort((a, b) => a.position - b.position).map((c) => ({ id: String(c.id), name: String(c.name), type: Number(c.type) }));
  const hexOf = (value) => typeof value === "number" ? `#${value.toString(16).padStart(6, "0")}` : "#f9d3e0";
  const isLink = (value) => /^https?:\/\/\S+$/i.test(value) && value.length <= 500;
  const CUSTOM_EMOJI = /^<a?:\w{2,32}:\d{15,25}>$/;
  const UNICODE_EMOJI = /^(?:\p{Extended_Pictographic}|\p{Regional_Indicator}|[0-9#*]️?⃣)/u;
  function readPayload(raw) {
    let source;
    try {
      source = JSON.parse(raw);
    } catch {
      return { ok: false, error: dt("The form could not be read, try again.") };
    }
    const text = (value, max) => String(value ?? "").slice(0, max);
    const embed = source?.embed ?? {};
    const payload = {
      messageId: /^\d{15,25}$/.test(String(source?.messageId ?? "")) ? String(source.messageId) : "",
      channelId: String(source?.channelId ?? ""),
      content: text(source?.content, 2e3),
      embed: {
        enabled: Boolean(embed.enabled),
        title: text(embed.title, 256),
        description: text(embed.description, 4096),
        color: /^#[0-9a-f]{6}$/i.test(String(embed.color)) ? String(embed.color) : "#f9d3e0",
        footer: text(embed.footer, 2048),
        image: isLink(String(embed.image ?? "")) ? String(embed.image) : "",
        thumbnail: isLink(String(embed.thumbnail ?? "")) ? String(embed.thumbnail) : ""
      },
      rows: []
    };
    if (!channels.some((c) => c.id === payload.channelId)) return { ok: false, error: dt("That channel is not in this server.") };
    if (!payload.content.trim() && !(payload.embed.enabled && (payload.embed.title.trim() || payload.embed.description.trim()))) return { ok: false, error: dt("Write some text or turn the embed on.") };
    const rows = Array.isArray(source?.rows) ? source.rows : [];
    if (!rows.length || rows.length > MAX_ROWS) return { ok: false, error: dt("A message can have from 1 to 5 rows of buttons.") };
    let total = 0;
    for (const rawRow of rows) {
      if (!Array.isArray(rawRow) || !rawRow.length || rawRow.length > PER_ROW) return { ok: false, error: dt("A row has from 1 to 5 buttons.") };
      const row = [];
      for (const b of rawRow) {
        total += 1;
        const emoji = String(b?.emoji ?? "").trim();
        const empty = Boolean(b?.empty);
        const label = empty ? "" : text(b?.label, 80).trim();
        if (!roleName(String(b?.roleId ?? ""))) return { ok: false, error: dt("Every button needs a role of this server.") };
        if (emoji && !CUSTOM_EMOJI.test(emoji) && !(UNICODE_EMOJI.test(emoji) && emoji.length <= 32)) return { ok: false, error: dt("One of the emojis is not valid.") };
        if (empty && !emoji) return { ok: false, error: dt("A button with no name needs an emoji.") };
        if (!empty && !label && !emoji) return { ok: false, error: dt("Every button needs a name or an emoji.") };
        const key = /^label:[0-9a-f]{8}$/.test(String(b?.key ?? "")) ? String(b.key) : "";
        row.push({ id: Number.isInteger(b?.id) ? Number(b.id) : null, key, label, empty, style: [1, 2, 3, 4].includes(Number(b?.style)) ? Number(b.style) : 1, roleId: String(b.roleId), mode: ["toggle", "add", "remove"].includes(String(b?.mode)) ? String(b.mode) : "toggle", emoji });
      }
      payload.rows.push(row);
    }
    if (total > MAX_BUTTONS) return { ok: false, error: dt("A message can have at most 25 button roles.") };
    const seen = /* @__PURE__ */ new Set();
    for (const b of payload.rows.flat()) {
      if (!b.emoji) continue;
      if (seen.has(b.emoji)) return { ok: false, error: dt("The same emoji is on two buttons of this message. Use a different emoji for each.") };
      seen.add(b.emoji);
    }
    return { ok: true, payload };
  }
  async function discord(method, path, body) {
    return fetch(`${DISCORD}${path}`, { method, headers: discordHeaders, ...body === void 0 ? {} : { body: JSON.stringify(body) } });
  }
  async function rowsOfMessage(messageId) {
    const res = await fetch(`${apiUrl}/rest/v1/reaction_roles?guild_id=eq.${id}&message_id=eq.${encodeURIComponent(messageId)}&select=*&order=id.asc`, { headers: apiHeaders });
    return res.ok ? await res.json() : [];
  }
  const newKey = () => `label:${Array.from(crypto.getRandomValues(new Uint8Array(4))).map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  const embedBody = (payload) => payload.embed.enabled && (payload.embed.title.trim() || payload.embed.description.trim() || payload.embed.footer.trim() || payload.embed.image || payload.embed.thumbnail) ? [{ ...payload.embed.title.trim() ? { title: payload.embed.title } : {}, ...payload.embed.description.trim() ? { description: payload.embed.description } : {}, color: parseInt(payload.embed.color.slice(1), 16), ...payload.embed.footer.trim() ? { footer: { text: payload.embed.footer } } : {}, ...payload.embed.image ? { image: { url: payload.embed.image } } : {}, ...payload.embed.thumbnail ? { thumbnail: { url: payload.embed.thumbnail } } : {} }] : [];
  async function save(payload) {
    const editing = Boolean(payload.messageId);
    let existing = [];
    if (editing) {
      existing = await rowsOfMessage(payload.messageId);
      if (!existing.length || existing.some((row) => row.channel_id !== payload.channelId)) return { ok: false, error: dt("That message has no role buttons made here, so it cannot be edited.") };
      const me = await discord("GET", "/users/@me");
      const message = await discord("GET", `/channels/${payload.channelId}/messages/${payload.messageId}`);
      if (!message.ok) return { ok: false, error: dt("Couldn't fetch that message.") };
      if (me.ok && (await message.json()).author?.id !== (await me.json()).id) return { ok: false, error: dt("Petto did not send that message, so it cannot change it.") };
    }
    let messageId = payload.messageId;
    let created = false;
    if (!editing) {
      const posted = await discord("POST", `/channels/${payload.channelId}/messages`, { content: payload.content || void 0, embeds: embedBody(payload), allowed_mentions: { parse: [] } });
      if (!posted.ok) return { ok: false, error: dt("Petto couldn't post the message there. Check the channel and its permissions.") };
      messageId = String((await posted.json()).id);
      created = true;
    }
    const insertedIds = [];
    const undo = async () => {
      for (const rowId of insertedIds) await fetch(`${apiUrl}/rest/v1/reaction_roles?id=eq.${rowId}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
      if (created) await discord("DELETE", `/channels/${payload.channelId}/messages/${messageId}`);
    };
    const fail = async (error2) => {
      await undo();
      return { ok: false, error: error2 };
    };
    const keptIds = new Set(payload.rows.flat().map((b) => b.id).filter((value) => value !== null));
    for (const row of existing) if (!keptIds.has(Number(row.id))) await fetch(`${apiUrl}/rest/v1/reaction_roles?id=eq.${row.id}&guild_id=eq.${id}`, { method: "DELETE", headers: apiHeaders });
    const existingById = new Map(existing.map((row) => [Number(row.id), row]));
    for (const [r, row] of payload.rows.entries()) {
      for (const [p, b] of row.entries()) {
        const previous = b.id !== null ? existingById.get(b.id) : void 0;
        const emojiKey = b.emoji || (previous && NO_EMOJI.test(previous.emoji) ? previous.emoji : b.key || newKey());
        const body = { guild_id: id, channel_id: payload.channelId, message_id: messageId, emoji: emojiKey, role_id: b.roleId, mode: b.mode, interaction_type: "button", button_label: b.empty ? "" : b.label || null, button_style: b.style, button_row: r, button_position: p };
        if (previous) {
          const res = await fetch(`${apiUrl}/rest/v1/reaction_roles?id=eq.${previous.id}&guild_id=eq.${id}`, { method: "PATCH", headers: { ...apiHeaders, Prefer: "return=minimal" }, body: JSON.stringify(body) });
          if (!res.ok) return fail(dt("Couldn't save that role binding."));
        } else {
          const res = await fetch(`${apiUrl}/rest/v1/reaction_roles`, { method: "POST", headers: { ...apiHeaders, Prefer: "return=representation" }, body: JSON.stringify(body) });
          if (!res.ok) return fail(dt("Couldn't save that role binding. The database may need the latest schema.sql (button_style, button_row and button_position)."));
          const inserted = (await res.json())?.[0];
          if (inserted?.id) insertedIds.push(Number(inserted.id));
        }
      }
    }
    const finalRows = await rowsOfMessage(messageId);
    const built = buildRoleButtonComponents(finalRows, roleName);
    if ("reason" in built) return fail(built.reason === "too_many_rows" ? dt("A message can have from 1 to 5 rows of buttons.") : dt("A message can have at most 25 button roles."));
    const edit = await discord("PATCH", `/channels/${payload.channelId}/messages/${messageId}`, { content: payload.content || "", embeds: embedBody(payload), components: built.components, allowed_mentions: { parse: [] } });
    if (!edit.ok) return fail(dt("Couldn't update the message components."));
    return { ok: true, messageId };
  }
  let error = null;
  let saved = false;
  let savedMessageId = "";
  let initial = { channelId: "", content: "", embed: { enabled: true }, rows: [[{}]] };
  const messageParam = Astro2.url.searchParams.get("message") ?? "";
  if (Astro2.request.method === "POST") {
    const form = await Astro2.request.formData();
    const raw = String(form.get("payload") ?? "");
    const read = readPayload(raw);
    if ("error" in read) {
      error = read.error;
      try {
        initial = JSON.parse(raw);
      } catch {
      }
    } else {
      const result = await save(read.payload);
      if ("error" in result) {
        error = result.error;
        initial = read.payload;
      } else {
        saved = true;
        savedMessageId = result.messageId;
      }
    }
  }
  let editingId = savedMessageId || String(initial.messageId ?? "") || (/^\d{15,25}$/.test(messageParam) ? messageParam : "");
  if (editingId && (savedMessageId || !initial.messageId)) {
    const rows = await rowsOfMessage(editingId);
    if (!rows.length) return Astro2.redirect(`/dash/guild/${id}/automation?section=reaction-roles`);
    const channelId = String(rows[0].channel_id);
    const message = await discord("GET", `/channels/${channelId}/messages/${editingId}`);
    const body = message.ok ? await message.json() : null;
    const first = body?.embeds?.[0];
    initial = {
      messageId: editingId,
      channelId,
      content: body?.content ?? "",
      embed: { enabled: Boolean(first), title: first?.title ?? "", description: first?.description ?? "", color: hexOf(first?.color), footer: first?.footer?.text ?? "", image: first?.image?.url ?? "", thumbnail: first?.thumbnail?.url ?? "" },
      rows: placeInRows(rows).map((row) => row.map((b) => ({ id: Number(b.id), key: NO_EMOJI.test(b.emoji) ? b.emoji : "", label: b.button_label ?? "", empty: b.button_label === "", style: buttonStyleOf(b), roleId: String(b.role_id), mode: b.mode, emoji: NO_EMOJI.test(b.emoji) ? "" : b.emoji })))
    };
  }
  const [customEmojis, templatesRes, buttonsRes] = await Promise.all([
    getGuildEmojis(id, botToken),
    fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name,data&order=name.asc`, { headers: apiHeaders }).catch(() => null),
    // For the number tiles: how many messages have role buttons made here, and how many buttons in all.
    fetch(`${apiUrl}/rest/v1/reaction_roles?guild_id=eq.${id}&interaction_type=eq.button&select=message_id&limit=2000`, { headers: apiHeaders }).catch(() => null)
  ]);
  const buttonRows = buttonsRes?.ok ? await buttonsRes.json().catch(() => null) : null;
  const counts = Array.isArray(buttonRows) ? { messages: new Set(buttonRows.map((row) => String(row.message_id))).size, buttons: buttonRows.length } : null;
  const templates = (templatesRes?.ok ? await templatesRes.json() : []).flatMap((row) => {
    const checked = validateTemplate(row.data);
    if (!checked.ok || checked.data.v2) return [];
    const first = checked.data.embeds[0];
    return [{ name: String(row.name), content: checked.data.content ?? "", embed: first ? { title: first.title ?? "", description: first.description ?? "", color: typeof first.color === "number" ? hexOf(first.color) : "#f9d3e0", footer: first.footer?.text ?? "", image: first.image ?? "", thumbnail: first.thumbnail ?? "" } : null }];
  });
  return renderTemplate`${renderComponent($$result, "DashReactionRoleBuilder", $$DashReactionRoleBuilder, { "user": auth.session, "guildId": id, "guildName": guildInfo.name, "guildIcon": guildInfo.icon ?? "/assets/mascot-icon.webp", "channels": channels, "roles": roles, "customEmojis": customEmojis, "templates": templates, "initial": initial, "editing": Boolean(initial.messageId), "error": error, "saved": saved, "counts": counts })}`;
}, "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/reaction-role.astro", void 0);

const $$file = "/home/runner/work/petto-web/petto-web/src/pages/dash/guild/[id]/reaction-role.astro";
const $$url = "/dash/guild/[id]/reaction-role";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ReactionRole,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
