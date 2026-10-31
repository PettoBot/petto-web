// Checks the Leveling pages of the dashboard: a Save with no change gives back exactly what is saved (the round trip of every form), a
// switch turned off keeps what depends on it, the dependency rules say what the bot really does, and every control the page draws is
// read by its handler (a control the handler does not read is lost, a field it reads that the page does not post is reset to its default).
// Run: node scripts/check-leveling-ux.mjs
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const load = async (file) => {
  const bundled = await build({ entryPoints: [`${root}${file}`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
  return import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
};
const F = await load('src/utils/levelingForm.ts');
const D = await load('src/utils/levelingDeps.ts');
const component = fs.readFileSync(`${root}src/components/DashLeveling.astro`, 'utf8');
const page = fs.readFileSync(`${root}src/pages/dash/guild/[id]/leveling.astro`, 'utf8');

let failed = 0;
const check = (name, fn) => {
  try { fn(); console.log(`ok   ${name}`); } catch (error) { failed += 1; console.error(`FAIL ${name}\n     ${String(error.message).split('\n').join('\n     ')}`); }
};

// ---- A saved row as the bot's database holds it (every column the forms touch) --------------------------------------------------
const base = () => ({
  enabled: true, xp_min: 15, xp_max: 25, xp_per_vc_minute: 5, cooldown_seconds: 60, curve_a: 1, curve_b: 50, curve_c: 100, difficulty: 2.5, rounding: 50, max_level: 1000,
  notify_mode: 'reply', notify_channel_id: null, notify_message: '{user} just leveled up to **{level}**!', notify_embed: false, notify_embed_template: null, notify_every: 1,
  role_mode: 'highest', ignored_channel_ids: [], ignored_category_ids: [], join_xp: 0, join_level: 0, notify_reply: true, notify_ping: true, notify_delete_after: 0, notify_milestones: [],
  voice_enabled: true, voice_curve_a: 1, voice_curve_b: 50, voice_curve_c: 100, voice_difficulty: 2.5, voice_rounding: 50, voice_max_level: 1000,
  voice_notify_mode: 'off', voice_notify_channel_id: null, voice_notify_message: '{user} reached voice level **{level}**!', voice_notify_embed: false, voice_notify_embed_template: null,
  voice_notify_every: 1, voice_role_mode: 'highest', voice_ignored_channel_ids: [], voice_ignored_category_ids: [], voice_notify_ping: true, voice_notify_delete_after: 0, voice_notify_milestones: [],
  rank_style: 'card', rank_card: null, notify_card: null, voice_notify_card: null,
  min_message_chars: 3, anti_repeat: true, daily_xp_cap: 0, voice_alone_percent: 100, voice_min_members: 1, voice_ignore_muted: false, daily_bonus_xp: 0, streak_bonus_xp: 0, streak_max_days: 7,
  xp_multiplier: 1, multiplier_mode: 'highest', multiplier_cap: 20, reset_on_leave: false, restore_roles: true, no_xp_role_ids: [], only_xp_role_ids: [],
  leaderboard_public: false, leaderboard_slug: null, leaderboard_join_url: null,
});
const ch = ['111111111111111111', '222222222222222222', '333333333333333333'];
const scenarios = {
  'defaults': {},
  'everything set': {
    xp_min: 1, xp_max: 1000, cooldown_seconds: 600, xp_per_vc_minute: 1000, curve_a: 0, curve_b: 0.5, curve_c: 12.25, difficulty: 0.1, rounding: 1, max_level: 10000,
    notify_mode: 'channel', notify_channel_id: ch[0], notify_message: 'GG {user}, level {level}!\nNext line', notify_embed: true, notify_embed_template: 'level_up', notify_every: 50, role_mode: 'all',
    ignored_channel_ids: [ch[0], ch[1]], ignored_category_ids: [ch[2]], join_xp: 1000000, join_level: 1000, notify_reply: false, notify_ping: false, notify_delete_after: 86400,
    notify_milestones: [{ level: 5, message: 'Five!' }, { level: 10, message: '{user} is level {level}: {level_role}' }, { level: 10000, message: 'max' }],
  },
  'announcement off but everything else still saved': {
    notify_mode: 'off', notify_channel_id: ch[0], notify_embed: true, notify_embed_template: 'welcome_tpl', notify_every: 7, notify_reply: false, notify_ping: false, notify_delete_after: 30,
    notify_milestones: [{ level: 3, message: 'Three' }], notify_card: 'level-card', voice_notify_card: 'voice-card',
  },
  'dm with a channel and reply still saved': { notify_mode: 'dm', notify_channel_id: ch[1], notify_reply: true, notify_delete_after: 120 },
  'channel mode with no channel (an old combination)': { notify_mode: 'channel', notify_channel_id: null },
  'a template and the simple embed both saved': { notify_embed: true, notify_embed_template: 'level_up', voice_notify_embed: true, voice_notify_embed_template: 'voice_up' },
  'level on join and xp on join both saved': { join_xp: 500, join_level: 5 },
  'leveling off': { enabled: false, notify_mode: 'channel', notify_channel_id: ch[2], ignored_channel_ids: [ch[0]] },
  'voice off with its whole configuration': {
    voice_enabled: false, xp_per_vc_minute: 9, voice_curve_a: 2, voice_curve_b: 33.5, voice_curve_c: 77, voice_difficulty: 1.8, voice_rounding: 25, voice_max_level: 300,
    voice_notify_mode: 'channel', voice_notify_channel_id: ch[1], voice_notify_embed: true, voice_notify_embed_template: 'voice_up', voice_notify_every: 5, voice_role_mode: 'all',
    voice_ignored_channel_ids: [ch[0], ch[2]], voice_ignored_category_ids: [ch[1]], voice_notify_ping: false, voice_notify_delete_after: 45,
    voice_notify_milestones: [{ level: 2, message: 'Two' }], voice_min_members: 20, voice_alone_percent: 40, voice_ignore_muted: true,
  },
  'voice announcement dm': { voice_notify_mode: 'dm', voice_notify_channel_id: ch[0] },
  'values only the bot commands can save (outside the usual ranges of the page)': {
    xp_min: 0, xp_max: 0, cooldown_seconds: 900, xp_per_vc_minute: 2500, rounding: 0, voice_rounding: 0, max_level: 20000, voice_max_level: 50000, notify_every: 80, voice_notify_every: 99,
    join_level: 5000, join_xp: 8000000, notify_message: 'x'.repeat(300), voice_notify_message: 'y'.repeat(250),
  },
  'rules at their limits': {
    min_message_chars: 200, anti_repeat: false, daily_xp_cap: 1000000, voice_min_members: 20, voice_alone_percent: 0, voice_ignore_muted: true, daily_bonus_xp: 100000, streak_bonus_xp: 0, streak_max_days: 365,
    xp_multiplier: 0.05, multiplier_mode: 'sum', multiplier_cap: 1.5, reset_on_leave: true, restore_roles: false, no_xp_role_ids: [ch[0]], only_xp_role_ids: [ch[0], ch[1]],
  },
  'rules: a streak limit with no streak bonus, alone percent with company needed': { streak_bonus_xp: 0, streak_max_days: 30, voice_min_members: 3, voice_alone_percent: 25 },
  'rank: an embed answer with a card still chosen, and cards that were deleted': { rank_style: 'embed', rank_card: 'old-rank', notify_card: 'gone', voice_notify_card: 'gone_too' },
  'rank: card and embed': { rank_style: 'both', rank_card: 'fancy' },
  'public page': { leaderboard_public: true, leaderboard_slug: 'my-server', leaderboard_join_url: 'https://discord.gg/abc' },
  'public page off with its name and link still saved': { leaderboard_public: false, leaderboard_slug: 'old-name', leaderboard_join_url: 'https://discord.gg/xyz' },
};

const toForm = (entries) => { const form = new FormData(); for (const [name, value] of entries) form.append(name, value); return form; };
const pick = (row, keys) => Object.fromEntries(keys.map((key) => [key, row[key]]));
const forms = {
  settings: { stored: (c) => F.storedConfig(c), entries: (c) => F.configFormEntries(F.storedConfig(c)), read: F.readConfigForm },
  voice: { stored: (c) => F.storedVoice(c, F.storedConfig(c)), entries: (c) => F.voiceFormEntries(F.storedVoice(c, F.storedConfig(c))), read: F.readVoiceForm },
  rank: { entries: (c) => F.rankFormEntries(F.storedRank(c)), read: F.readRankForm },
  rules: { entries: (c) => F.rulesFormEntries(F.storedRules(c)), read: (form) => { const { row, newest } = F.readRulesForm(form); return { ...row, ...newest }; } },
  board: { entries: (c) => F.boardFormEntries(F.storedBoard(c)), read: (form) => { const r = F.readBoardForm(form); assert.ok(!('error' in r), `the saved page settings were refused: ${JSON.stringify(r)}`); return r.row; } },
};

// 1. Round trip: the form the page draws from a saved row, sent with no change, saves the same values.
for (const [formName, form] of Object.entries(forms)) {
  for (const [scenario, patch] of Object.entries(scenarios)) {
    check(`round trip: ${formName} form, ${scenario}`, () => {
      const row = { ...base(), ...patch };
      const result = form.read(toForm(form.entries(row)));
      assert.deepEqual(result, pick(row, Object.keys(result)));
    });
  }
}

// 2. Turning a switch off keeps what depends on it: the page posts the greyed fields as they are, so only the switch itself changes.
const without = (entries, ...names) => entries.filter(([name]) => !names.includes(name));
const withValue = (entries, name, value) => [...without(entries, name), [name, value]];
check('voice leveling turned off: the whole voice configuration is saved as it was', () => {
  const row = { ...base(), ...scenarios['voice off with its whole configuration'], voice_enabled: true };
  const result = F.readVoiceForm(toForm(without(F.voiceFormEntries(F.storedVoice(row, F.storedConfig(row))), 'voice_enabled')));
  assert.equal(result.voice_enabled, false);
  assert.deepEqual({ ...result, voice_enabled: true }, pick(row, Object.keys(result)));
});
check('leveling turned off: the whole configuration is saved as it was', () => {
  const row = { ...base(), ...scenarios['everything set'] };
  const result = F.readConfigForm(toForm(without(F.configFormEntries(F.storedConfig(row)), 'enabled')));
  assert.equal(result.enabled, false);
  assert.deepEqual({ ...result, enabled: true }, pick(row, Object.keys(result)));
});
check('announcement switched to off: channel, template, reply, ping, delete, every and milestones are saved as they were', () => {
  const row = { ...base(), ...scenarios['everything set'] };
  const result = F.readConfigForm(toForm(withValue(F.configFormEntries(F.storedConfig(row)), 'notify_mode', 'off')));
  assert.equal(result.notify_mode, 'off');
  assert.deepEqual({ ...result, notify_mode: 'channel' }, pick(row, Object.keys(result)));
});
check('public page turned off: the name and the join link are saved as they were', () => {
  const row = { ...base(), ...scenarios['public page'] };
  const r = F.readBoardForm(toForm(without(F.boardFormEntries(F.storedBoard(row)), 'leaderboard_public')));
  assert.deepEqual(r.row, { leaderboard_public: false, leaderboard_slug: 'my-server', leaderboard_join_url: 'https://discord.gg/abc' });
});

// 3. Every control a form draws is read by its handler, and every field the handler reads is drawn (or it would be reset to its default).
const readNames = (read) => {
  const names = new Set();
  const spy = new FormData();
  const proxy = new Proxy(spy, { get(target, key) { const value = target[key]; if (['get', 'getAll', 'has'].includes(key)) return (name) => { names.add(name); return target[key](name); }; return typeof value === 'function' ? value.bind(target) : value; } });
  read(proxy);
  return names;
};
const formBlock = (kind) => {
  const start = component.indexOf(`data-lv-form="${kind}"`);
  assert.ok(start > 0, `the page has no form data-lv-form="${kind}"`);
  const open = component.lastIndexOf('<form', start);
  return component.slice(open, component.indexOf('</form>', start));
};
const drawn = (block) => new Set([...block.matchAll(/\bname="([a-z_]+)"/g)].map((m) => m[1]).filter((name) => !['action', 'events_payload'].includes(name)));
for (const [kind, form] of Object.entries(forms)) {
  check(`the ${kind} form draws exactly the fields its handler reads`, () => {
    const handlerReads = readNames(form.read);
    const read = new Set(handlerReads);
    const names = drawn(formBlock(kind));
    assert.deepEqual([...names].filter((name) => !read.has(name)).sort(), [], 'drawn but not read (lost on save)');
    assert.deepEqual([...read].filter((name) => !names.has(name)).sort(), [], 'read but not drawn (reset to its default on save)');
  });
}
check('the profiles of the Rules page only set fields of that form', () => {
  const names = readNames(forms.rules.read);
  const profiles = [...component.matchAll(/values: \{([^}]*)\}/g)].flatMap((m) => [...m[1].matchAll(/([a-z_]+):/g)].map((k) => k[1]));
  assert.ok(profiles.length > 0);
  for (const name of profiles) assert.ok(names.has(name), `${name} is not a field of the Rules form`);
});
check('the form entries cover every field the page draws', () => {
  for (const [kind, form] of Object.entries(forms)) {
    const row = { ...base(), notify_embed: true, notify_embed_template: 'a', notify_channel_id: ch[0], ignored_channel_ids: [ch[0]], ignored_category_ids: [ch[1]], voice_ignored_channel_ids: [ch[0]], voice_ignored_category_ids: [ch[1]], notify_milestones: [{ level: 1, message: 'a' }], voice_notify_milestones: [{ level: 1, message: 'a' }], voice_notify_embed: true, notify_card: 'a', rank_card: 'b', voice_notify_card: 'c', leaderboard_public: true, no_xp_role_ids: [ch[0]], only_xp_role_ids: [ch[1]], notify_ping: true, voice_ignore_muted: true, reset_on_leave: true, notify_reply: true, voice_notify_ping: true };
    const entries = new Set(form.entries(row).map(([name]) => name));
    for (const name of drawn(formBlock(kind))) assert.ok(entries.has(name), `${kind}: ${name} is drawn but the round trip does not post it`);
  }
});
check('no control is switched off by the server: only the page script greys fields (without it, every field is live and posted)', () => {
  assert.ok(!/<(input|select|textarea)[^>]*\sdisabled[=\s>]/.test(formBlock('settings') + formBlock('voice') + formBlock('rank') + formBlock('rules') + formBlock('board')), 'a control of a Leveling form has the disabled attribute');
});
check('the script puts what greyed controls hold back into the form data (formdata)', () => {
  assert.ok(component.includes("addEventListener('formdata'"), 'no formdata listener');
  assert.ok(component.includes('data-lv-dis') || component.includes('dataset.lvDis'), 'greyed controls are not marked');
  assert.ok(/event\.formData\.append\(el\.name, el\.value\)/.test(component), 'the value of a greyed control is not appended');
});

// 4. The dependency rules (what the bot really does).
const ctx = (patch, flags = {}) => {
  const row = { ...base(), ...patch };
  const entries = [...F.configFormEntries(F.storedConfig(row)), ...F.voiceFormEntries(F.storedVoice(row, F.storedConfig(row))), ...F.rankFormEntries(F.storedRank(row)), ...F.rulesFormEntries(F.storedRules(row)), ...F.boardFormEntries(F.storedBoard(row))];
  return D.ctxFromEntries(entries, { textOn: row.enabled, voiceOn: row.voice_enabled, textNotify: row.notify_mode !== 'off', voiceNotify: row.voice_notify_mode !== 'off', ...flags });
};
const why = (rule, patch, flags) => D.reasonFor(rule, ctx(patch, flags));
check('announcement off: channel, reply and the rest say why', () => {
  for (const rule of ['channel_used', 'reply_used']) assert.equal(why(rule, { notify_mode: 'off' }), 'announceOff');
  assert.equal(why('announce_on', { notify_mode: 'off' }), 'announceOff');
  assert.equal(why('announce_on', { notify_mode: 'reply' }), null);
  assert.equal(why('v_announce_on', { voice_notify_mode: 'off' }), 'announceOff');
});
check('reply answers in the same channel: the channel is not used, the reply switch is', () => {
  assert.equal(why('channel_used', { notify_mode: 'reply' }), 'channelReply');
  assert.equal(why('reply_used', { notify_mode: 'reply' }), null);
});
check('fixed channel uses the channel and the reply switch', () => {
  assert.equal(why('channel_used', { notify_mode: 'channel' }), null);
  assert.equal(why('reply_used', { notify_mode: 'channel' }), null);
});
check('a direct message has no channel and cannot answer a message', () => {
  assert.equal(why('channel_used', { notify_mode: 'dm' }), 'channelDm');
  assert.equal(why('reply_used', { notify_mode: 'dm' }), 'replyDm');
  assert.equal(why('v_channel_used', { voice_notify_mode: 'dm' }), 'channelDm');
});
check('a saved embed template replaces the simple embed (text and voice)', () => {
  assert.equal(why('no_template', { notify_embed_template: 'x' }), 'template');
  assert.equal(why('no_template', { notify_embed_template: null }), null);
  assert.equal(why('v_no_template', { voice_notify_embed_template: 'x' }), 'template');
});
check('level on join wins over xp on join', () => {
  assert.equal(why('join_xp_used', { join_level: 3, join_xp: 50 }), 'joinLevel');
  assert.equal(why('join_xp_used', { join_level: 0, join_xp: 50 }), null);
});
check('the rank card is used only when the answer includes it', () => {
  assert.equal(why('rank_card_used', { rank_style: 'embed' }), 'rankEmbed');
  assert.equal(why('rank_card_used', { rank_style: 'card' }), null);
  assert.equal(why('rank_card_used', { rank_style: 'both' }), null);
});
check('level-up cards need leveling and an announcement', () => {
  assert.equal(why('notify_card_used', { enabled: false }), 'textOff');
  assert.equal(why('notify_card_used', { notify_mode: 'off' }), 'noTextNotify');
  assert.equal(why('notify_card_used', {}), null);
  assert.equal(why('voice_card_used', { voice_enabled: false }), 'voiceOff');
  assert.equal(why('voice_card_used', { voice_enabled: true, voice_notify_mode: 'off' }), 'noVoiceNotify');
  assert.equal(why('voice_card_used', { voice_enabled: true, voice_notify_mode: 'dm' }), null);
});
check('voice rules: alone percent needs 1 person to be enough; streak limit needs a streak bonus; the page needs to be public', () => {
  assert.equal(why('alone_used', { voice_min_members: 2 }), 'aloneNeedsOne');
  assert.equal(why('alone_used', { voice_min_members: 1 }), null);
  assert.equal(why('streak_used', { streak_bonus_xp: 0 }), 'noStreak');
  assert.equal(why('streak_used', { streak_bonus_xp: 10 }), null);
  assert.equal(why('board_on', { leaderboard_public: false }), 'boardOff');
  assert.equal(why('board_on', { leaderboard_public: true }), null);
  assert.equal(why('text_on', { enabled: false }), 'textOff');
  assert.equal(why('voice_on', { voice_enabled: false }), 'voiceOff');
});
check('the first rule that applies gives the reason', () => {
  assert.equal(D.firstReason(['announce_on', 'channel_used'], ctx({ notify_mode: 'off' })), 'announceOff');
  assert.equal(D.firstReason(['announce_on', 'channel_used'], ctx({ notify_mode: 'dm' })), 'channelDm');
  assert.equal(D.firstReason(['announce_on', 'channel_used'], ctx({ notify_mode: 'channel' })), null);
});
check('every rule the page names exists, and every reason has its text', () => {
  const used = new Set([...component.matchAll(/data-lv-dep="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)));
  assert.ok(used.size >= 10);
  for (const rule of used) assert.ok(D.RULES.includes(rule), `unknown rule ${rule}`);
  const reasons = new Set();
  const variants = [{}, { notify_mode: 'off' }, { notify_mode: 'dm' }, { notify_mode: 'channel' }, { voice_notify_mode: 'dm' }, { notify_embed_template: 'x', voice_notify_embed_template: 'x' }, { join_level: 2 }, { rank_style: 'embed' }, { enabled: false }, { voice_enabled: false }, { voice_notify_mode: 'off' }, { voice_min_members: 3 }, { streak_bonus_xp: 0 }, { leaderboard_public: false }];
  for (const patch of variants) for (const rule of D.RULES) { const reason = why(rule, patch); if (reason) reasons.add(reason); }
  assert.ok(reasons.size >= 12, `only ${reasons.size} reasons found`);
  for (const reason of reasons) assert.ok(component.includes(`why_${reason}:`), `no text for the reason ${reason}`);
});
check('the master switch of a card is never inside the part it switches off', () => {
  for (const [kind, name] of [['settings', 'enabled'], ['voice', 'voice_enabled']]) {
    const block = formBlock(kind);
    const gate = block.indexOf('data-lv-gate=');
    assert.ok(gate > 0, `${kind} has no gate`);
    assert.ok(block.indexOf(`name="${name}"`) < gate, `${name} is inside its own gate`);
  }
});

// 5. Messages under the fields: a problem only blocks the form when the person changed what it is about.
const problems = (kind, patch, initialPatch = patch) => D.problemsFor(kind, ctx(patch), ctx(initialPatch));
check('minimum above maximum blocks only when changed', () => {
  assert.deepEqual(problems('settings', { xp_min: 30, xp_max: 20 }, { xp_min: 15, xp_max: 25 }).map((p) => [p.key, p.blocks]), [['xpRange', true]]);
  assert.deepEqual(problems('settings', { xp_min: 30, xp_max: 20 }).map((p) => [p.key, p.blocks]), [['xpRange', false]]);
  assert.deepEqual(problems('settings', { xp_min: 10, xp_max: 20 }), []);
});
check('a fixed channel with no channel blocks only when chosen now; an old combination only warns', () => {
  assert.deepEqual(problems('settings', { notify_mode: 'channel' }, { notify_mode: 'reply' }).map((p) => [p.key, p.blocks]), [['needChannel', true]]);
  assert.deepEqual(problems('settings', { notify_mode: 'channel' }).map((p) => [p.key, p.blocks]), [['needChannel', false]]);
  assert.deepEqual(problems('voice', { voice_notify_mode: 'channel' }, { voice_notify_mode: 'off' }).map((p) => [p.field, p.blocks]), [['voice_notify_channel_id', true]]);
  assert.deepEqual(problems('settings', { notify_mode: 'channel', notify_channel_id: ch[0] }), []);
});
check('milestone lines the bot would ignore are counted (a warning, never a block)', () => {
  assert.equal(D.ignoredMilestoneLines('10: ten\n20: twenty'), 0);
  assert.equal(D.ignoredMilestoneLines('10: ten\nnonsense\n10: again\n0: zero\n\n'), 3);
  assert.equal(D.ignoredMilestoneLines(Array.from({ length: 27 }, (_, i) => `${i + 1}: m`).join('\n')), 2);
  assert.equal(problems('settings', { notify_milestones: [] }).length, 0);
  assert.ok(D.problemsFor('settings', D.ctxFromEntries([['notify_mode', 'reply'], ['notify_milestones', 'oops']]), D.ctxFromEntries([])).every((p) => !p.blocks));
});
check('a role in both role lists is a warning', () => {
  const entries = [['no_xp_role_ids', 'a'], ['no_xp_role_ids', 'b']];
  const joined = D.ctxFromEntries([['no_xp_role_ids', D.joinIds(['a', 'b'])], ['only_xp_role_ids', D.joinIds(['b', 'c'])]]);
  assert.deepEqual(D.problemsFor('rules', joined, joined).map((p) => [p.key, p.blocks]), [['roleBoth', false]]);
  assert.ok(entries.length);
});
check('the line at the top of a card', () => {
  const L = Object.fromEntries([...component.matchAll(/^\s+(status[A-Za-z]+): dt\('((?:[^'\\]|\\.)*)'\)/gm)].map((m) => [m[1], m[2]]));
  assert.ok(Object.keys(L).length >= 20, 'the status texts are not in the page');
  const s = (kind, patch, names) => D.statusParts(kind, ctx({ ...patch }, {}), L).join(' · ');
  assert.equal(s('settings', { notify_mode: 'channel', notify_channel_id: ch[0], notify_every: 5 }), 'On · 15-25 XP per message · level-ups in ' + ch[0] + ' · every 5 levels');
  assert.equal(s('settings', { enabled: false }), 'Off');
  assert.equal(s('settings', { notify_mode: 'off' }), 'On · 15-25 XP per message · level-ups are not announced');
  assert.equal(s('voice', { voice_enabled: true, voice_notify_mode: 'dm', voice_notify_embed_template: 't' }), 'On · 5 XP per voice minute · level-ups by direct message · template t');
  assert.equal(s('rank', { rank_style: 'both', notify_card: 'fancy' }), '/rank answers with a card and an embed · level-up card fancy');
  assert.equal(s('board', { leaderboard_public: true }), 'Public page on');
});

// 6. The handlers of the page use the util, and nothing reads a form field by hand any more.
check('the Leveling page reads its forms through levelingForm.ts', () => {
  for (const name of ['readConfigForm', 'readVoiceForm', 'readRankForm', 'readRulesForm', 'readBoardForm']) assert.ok(page.includes(`${name}(form)`), `the page does not call ${name}`);
  assert.ok(!/form\.get\('(xp_min|notify_mode|voice_notify_mode|rank_style|min_message_chars)'\)/.test(page), 'a handler reads a Leveling field by hand');
});
check('a saved choice that is gone stays as an option (channel, template, card, role)', () => {
  assert.deepEqual(F.keepChosen([{ id: '1', name: '#a' }], ['1', '9'], (id) => `Missing: ${id}`), [{ id: '1', name: '#a' }, { id: '9', name: 'Missing: 9' }]);
  for (const needle of ['missingLabel(config.notifyChannelId)', 'missingLabel(rank.notifyCard)', 'missingLabel(rank.voiceNotifyCard)', 'missingLabel(config.notifyEmbedTemplate)', 'withMissing(roles.map']) assert.ok(component.includes(needle), `${needle} is missing`);
});

if (failed) { console.error(`\n${failed} check(s) failed.`); process.exit(1); }
console.log('\nLeveling checks passed.');
