// Checks the converter of src/utils/botMigration.ts (moving from MEE6, Carl-bot or Dyno): every variable of the official docs, the nested ones of Carl-bot,
// the ones that have no equivalent, the text that is already Petto's, and that ProBot and Welcomer (docs not read yet) are never guessed.
// Run: node scripts/check-bot-migration.mjs
import { loadTs } from './og/load-copy.mjs';

const { BOTS, CHECKLISTS, FEATURE_PAGES, convertMessage, previewText, isBotId } = await loadTs('src/utils/botMigration.ts');
const { tokenValues, sampleContext } = await loadTs('src/utils/variableSamples.ts');
const variables = (await import('../src/data/variables.generated.json', { with: { type: 'json' } })).default;

let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); }
};
const same = (name, got, expected) => check(name, JSON.stringify(got) === JSON.stringify(expected), `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);
const text = (bot, input) => convertMessage(bot, input).text;

// --- the bots ---
same('bots', BOTS.map((bot) => [bot.id, bot.verified]), [['mee6', true], ['carl', true], ['dyno', true], ['probot', true], ['nekotina', true], ['welcomer', false]]);
check('isBotId', isBotId('mee6') && !isBotId('mee7') && !isBotId(undefined));

// --- every token that comes out is a variable Petto has ---
const petto = new Set(variables.en.flatMap((group) => group.vars.map((entry) => entry.tok)));
const known = (token) => petto.has(token) || ['{choose', '@everyone', '@here'].some((start) => token.startsWith(start));
const samples = {
  mee6: ['{user}', '{user.mention}', '{user.id}', '{user.name}', '{user.discriminator}', '{user.idname}', '{user.avatar_url}', '{user.bot}', '{server}', '{server.name}', '{server.id}', '{server.icon_url}', '{server.owner_id}', '{server.owner}', '{server.region}', '{server.member_count}', '{server.verification_level}'],
  carl: ['{mention}', '{user}', '{server}', '{user(id)}', '{user(proper)}', '{server(members)}', '{ord:{server(members)}}', '{random: a ~ b}'],
  dyno: ['{user}', '{avatar}', '{username}', '{server}', '{channel}', '{everyone}', '{here}', '{name}', '{date}'],
  probot: ['[user]', '[inviter]', '[server]', '[userName]', '[inviterName]', '[memberCount]', '[level]', '[user.username]', '[user.tag]', '[oldLevel]'],
  nekotina: ['{{user}}', '{{username}}', '{{server}}', '{{members}}', '{{date}}', '{{user.mention}}', '{{user.name}}'],
};
for (const [bot, list] of Object.entries(samples)) {
  for (const token of list) {
    const result = convertMessage(bot, token);
    check(`${bot} ${token} converts`, result.unsupported.length === 0, JSON.stringify(result));
    check(`${bot} ${token} becomes a variable Petto has`, known(result.text), result.text);
  }
}

// --- MEE6 ---
same('mee6 welcome', text('mee6', 'Hi {user.mention}, welcome to {server.name}! You are member {server.member_count}.'), 'Hi {user.mention}, welcome to {server_name}! You are member {server_membercount}.');
same('mee6 tag becomes the name', text('mee6', '{user.idname}'), '{user.name}');
same('mee6 icon url', text('mee6', '{server.icon_url}'), '{server_icon}');
same('mee6 hashes have no equivalent', convertMessage('mee6', '{user.avatar} {server.icon}').unsupported.map((item) => [item.token, item.hint]), [['{user.avatar}', 'hash'], ['{server.icon}', 'hash']]);
same('mee6 joined_at has no equivalent', convertMessage('mee6', '{server.joined_at}').unsupported.map((item) => item.hint), ['bot-joined']);
same('same names are not listed as changes', convertMessage('mee6', '{user.id} {user}').changes, []);
same('mee6 is case blind', text('mee6', '{SERVER.NAME}'), '{server_name}');

// --- Carl-bot ---
same('carl welcome', text('carl', '{mention} welcome to {server}! You are the {ord:{server(members)}} member.'), '{user.mention} welcome to {server_name}! You are the {server_membercount_ordinal} member.');
same('carl user is the name', text('carl', 'Bye {user}'), 'Bye {user.name}');
same('carl random with tildes', text('carl', '{random: hi ~ hello ~ hey}'), '{choose:hi|hello|hey}');
same('carl random with commas', text('carl', '{random: hi, hello}'), '{choose:hi|hello}');
same('carl random keeps tildes before commas', text('carl', '{random: hi, you ~ hello}'), '{choose:hi, you|hello}');
same('carl math has no equivalent', convertMessage('carl', '{math: 1 + 1}').unsupported.map((item) => [item.token, item.hint]), [['{math: 1 + 1}', 'math']]);
same('carl members counted once', convertMessage('carl', '{server(members)} {server(members)}').changes, [{ from: '{server(members)}', to: '{server_membercount}', count: 2 }]);

// --- Dyno ---
same('dyno welcome', text('dyno', 'Hello {user}, welcome to {server}! Read {channel}.'), 'Hello {user.mention}, welcome to {server_name}! Read {channel.name}.');
same('dyno image text', text('dyno', '{name} {username} {date}'), '{user.name} {user.name} {date}');
same('dyno everyone and here', text('dyno', '{everyone} {here}'), '@everyone @here');
same('dyno names to mention have no equivalent', convertMessage('dyno', '{@Nooblance} {&Gamers} {#testing}').unsupported.map((item) => item.hint), ['mention-name', 'role-name', 'channel-name']);
same('dyno names stay in the text', text('dyno', 'Join {&Gamers} in {#testing}'), 'Join {&Gamers} in {#testing}');

// --- what is not a variable, and what is already Petto's ---
same('plain text', text('mee6', 'No variables here: 100% {} done'), 'No variables here: 100% {} done');
same('discord mentions are left', text('dyno', 'Hi <@123456789012345678> in <#123456789012345678> {user}'), 'Hi <@123456789012345678> in <#123456789012345678> {user.mention}');
same('petto text is left alone', convertMessage('mee6', '{user.display_name} {server_membercount} {choose:a|b} {newline}'), { text: '{user.display_name} {server_membercount} {choose:a|b} {newline}', changes: [], unsupported: [], verified: true });
same('an unknown variable is reported', convertMessage('carl', '{nothing_like_this}').unsupported.map((item) => [item.token, item.hint]), [['{nothing_like_this}', 'unknown']]);
same('empty text', convertMessage('mee6', ''), { text: '', changes: [], unsupported: [], verified: true });
same('a second run changes nothing', text('mee6', text('mee6', '{server.name} {user}')), '{server_name} {user}');

// --- ProBot: square brackets ---
same('probot welcome', text('probot', 'Welcome [user] to [server]! You are member [memberCount], invited by [inviterName] ([inviter]).'), 'Welcome {user.mention} to {server_name}! You are member {server_membercount}, invited by {inviter.name} ({inviter}).');
same('probot leveling', text('probot', '[user] reached level [level] (it was [oldLevel]), [user.username] [user.tag]'), '{user.mention} reached level {level} (it was {level_previous}), {user.name} {user.name}');
same('probot is case blind', text('probot', '[USERNAME] [Server]'), '{user.name} {server_name}');
same('probot links are not variables', text('probot', '[Read the rules](https://example.com) [user]'), '[Read the rules](https://example.com) {user.mention}');
same('probot plain words in brackets are left, and not reported', convertMessage('probot', '[Staff] [Welcome] <@123456789012345678> <#123456789012345678>'), { text: '[Staff] [Welcome] <@123456789012345678> <#123456789012345678>', changes: [], unsupported: [], verified: true });
same('probot invites of a member has no equivalent', convertMessage('probot', '[invites]').unsupported.map((item) => [item.token, item.hint]), [['[invites]', 'no-equivalent']]);
same('probot does not read curly braces', text('probot', '{user} [user]'), '{user} {user.mention}');
same('probot counts', convertMessage('probot', '[user] [user]').changes, [{ from: '[user]', to: '{user.mention}', count: 2 }]);

// --- Nekotina: double braces ---
same('nekotina welcome', text('nekotina', "Welcome {{user}} to **{{server}}**! You're member #{{members}}. {{date}}"), "Welcome {user.mention} to **{server_name}**! You're member #{server_membercount}. {date}");
same('nekotina username', text('nekotina', '{{ username }}'), '{user.name}');
same('nekotina command text', text('nekotina', '{{user.mention}} wishes {{user.name}} a happy day'), '{user.mention} wishes {user.name} a happy day');
same('nekotina arguments have no equivalent', convertMessage('nekotina', '{{arg.target}} {{arg.target.avatar}}').unsupported.map((item) => [item.token, item.hint]), [['{{arg.target}}', 'command-argument'], ['{{arg.target.avatar}}', 'command-argument']]);
same('nekotina unknown is reported', convertMessage('nekotina', '{{nothing}}').unsupported.map((item) => [item.token, item.hint]), [['{{nothing}}', 'unknown']]);
same('nekotina leaves single braces', text('nekotina', '{user.name} {{user}}'), '{user.name} {user.mention}');

// --- Welcomer: its docs can not be read, so nothing is guessed ---
same('welcomer comes back as it went', convertMessage('welcomer', '{user} [user] %user% {server.name} {{user}}'), { text: '{user} [user] %user% {server.name} {{user}}', changes: [], unsupported: [], verified: false });
same('checklists: every feature has a page', Object.entries(CHECKLISTS).flatMap(([bot, list]) => list.filter((feature) => !FEATURE_PAGES[feature]).map((feature) => `${bot}:${feature}`)), []);
same('checklists: the bots that are read have one, Welcomer none', Object.entries(CHECKLISTS).map(([bot, list]) => [bot, list.length > 0]), [['mee6', true], ['carl', true], ['dyno', true], ['probot', true], ['nekotina', true], ['welcomer', false]]);

// --- the preview ---
const values = tokenValues(sampleContext);
same('preview', previewText('Hi {user.name} in {server_name}: {server_membercount}{newline}{choose:a|b}', values), 'Hi Liam in Petto Support: 1,204\na');
same('preview leaves what it does not know', previewText('{no_such_thing}', values), '{no_such_thing}');


// --- the AI helper: the page, its endpoint and the call to the bot ---
import { readFileSync } from 'node:fs';
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const endpoint = read('src/pages/dash/guild/[id]/migrate-ai.ts');
check('ai endpoint: Manage Server only (no role access, no support mode)', /auth\.devView \|\| auth\.access/.test(endpoint) && /canManageGuild/.test(endpoint));
check('ai endpoint: the three modes only', /MODES = \['rewrite', 'plan', 'ask'\]/.test(endpoint) && /MODES\.includes\(mode\)/.test(endpoint));
check('ai endpoint: the text is limited to 1500', /MAX_TEXT = 1500/.test(endpoint) && /text\.length > MAX_TEXT/.test(endpoint));
check('ai endpoint: an unknown bot is "other"', /isBotId\(body\?\.bot\) \? body\.bot : 'other'/.test(endpoint));
check('ai call: goes to the migrate-ai route of the bot, with the language and the key', /\/migrate-ai`/.test(read('src/utils/pettoBotApi.ts')) && /callPettoMigrateAi/.test(endpoint));
const page = read('src/components/DashMigrate.astro');
check('ai page: the answer is shown as text, never as markup', !/innerHTML\s*=\s*[^;]*answer/i.test(page) && /textContent = text/.test(page));
check('ai page: only people with Manage Server can send', /canRun/.test(page) && /data-ai-send disabled=\{!canRun\}/.test(page));
check('ai page: says it only proposes and that the text goes to Groq', /never changes your server/.test(page) && /Groq/.test(page));


// --- the answer of the AI is read as markdown, safely (nothing becomes markup) ---
const { parseMarkdown, parseInline } = await loadTs('src/utils/miniMarkdown.ts');
same('md: bold, italic and code', parseInline('a **b** and *c* and `{user.name}` z'), [{ t: 'text', v: 'a ' }, { t: 'bold', v: 'b' }, { t: 'text', v: ' and ' }, { t: 'italic', v: 'c' }, { t: 'text', v: ' and ' }, { t: 'code', v: '{user.name}' }, { t: 'text', v: ' z' }]);
same('md: stars inside code are not read', parseInline('`**x**`'), [{ t: 'code', v: '**x**' }]);
same('md: a lone star is text', parseInline('2 * 3 * 4'), [{ t: 'text', v: '2 * 3 * 4' }]);
same('md: underscores are never formatting', parseInline('{server_name} and __x__ and _y_'), [{ t: 'text', v: '{server_name} and __x__ and _y_' }]);
same('md: html stays text', parseInline('<b>x</b> **<i>y</i>**'), [{ t: 'text', v: '<b>x</b> ' }, { t: 'bold', v: '<i>y</i>' }]);
const answer = 'Para migrar:\n\n1. **Desactiva MEE6**\n  - Ve a la página y `!welcome`.\n  - Anota los roles.\n\n2. **Crea** todo\n\n## Título\n```\nHola {user.mention}\n```\nFin';
same('md: blocks', parseMarkdown(answer).map((b) => b.t === 'list' ? `list${b.ordered ? 'o' : 'u'}${b.level}:${b.start}:${b.items.length}` : b.t), ['p', 'listo0:1:1', 'listu1:1:2', 'listo0:2:1', 'h', 'code', 'p']);
same('md: a code block keeps its text exactly', parseMarkdown('```\nHola {user.mention}\n  ok\n```').map((b) => b.t === 'code' ? b.v : ''), ['Hola {user.mention}\n  ok']);
same('md: an unclosed fence runs to the end', parseMarkdown('a\n```\nx {y}').map((b) => b.t === 'code' ? b.v : b.t), ['p', 'x {y}']);
same('md: star bullets', parseMarkdown('* a\n* b').map((b) => b.t === 'list' ? b.items.length : 0), [2]);
same('md: empty', parseMarkdown('  \n '), []);
const pageSource = read('src/components/DashMigrate.astro');
check('ai page: draws the answer from the blocks, with no innerHTML of it', /parseMarkdown\(answer\)/.test(pageSource) && !/\.innerHTML\s*=\s*(?!idle)[^;]*(answer|block)/.test(pageSource));

// A beta, not a new thing: the menu says Beta (and stays), and every button of the page has the look of the dashboard (btn-ghost), not the grey of the public site.
const layoutSource = read('src/components/DashGuildLayout.astro');
check('beta: the menu item is a beta, not new', /id: 'migrate'[^\n]*beta: true/.test(layoutSource) && !/id: 'migrate'[^\n]*isNew/.test(layoutSource) && /item\.beta && <(?:em class="dgl-new dgl-soon"|span class="vx-duck-pill vx-duck-beta")/.test(layoutSource));
check('beta: the page says it is a beta', /class="mg-beta-tag"/.test(pageSource) && /class="mg-beta-note"/.test(pageSource));
check('buttons: the copy and docs buttons are btn-ghost', !/class="btn btn-sm/.test(pageSource) && !/className = 'btn btn-sm/.test(pageSource) && /btn btn-ghost btn-sm mg-copy/.test(pageSource) && /btn\.className = 'btn btn-ghost btn-sm'/.test(pageSource));

if (failed) { console.log(`${failed} check(s) failed`); process.exit(1); }
console.log('bot-migration: ok');
