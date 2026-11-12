// Checks the Activity leaderboards page: the rules of src/utils/activityBoards.mjs (the same as the bot's), who may change them (Manage Server, Administrator or the owner),
// what a row looks like on the page, and that the page is in the menu, the modules list, the module statuses and the role access sections, and closed to Support mode.
// Run: node scripts/check-dash-activity-boards.mjs
import { readFileSync } from 'node:fs';
import { KINDS, REASONS, ROLE_REASONS, canEditActivityBoards, cleanBoard, cleanRole, messageIds, statsProblem, validateBoard, validateRole } from '../src/utils/activityBoards.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
let failed = 0;
const check = (name, ok, detail = '') => {
  if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); }
};
const same = (name, got, expected) => check(name, JSON.stringify(got) === JSON.stringify(expected), `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`);

const CH = '1290000000000000200';
const OTHER = '1290000000000000201';

// --- the same kinds and reasons as the bot ---
same('kinds', [...KINDS], ['chat', 'voice']);
same('reasons the bot saves', [...REASONS], ['statsOff', 'membersOff', 'channel', 'permissions', 'error']);

// --- what the form sends ---
same('a good board', validateBoard({ kind: 'chat', channelId: CH, channelIds: [CH, OTHER] }), { ok: true, board: { kind: 'chat', channel_id: CH } });
same('voice too', validateBoard({ kind: 'voice', channelId: OTHER, channelIds: [CH, OTHER] }).ok, true);
same('a kind that does not exist', validateBoard({ kind: 'text', channelId: CH, channelIds: [CH] }).error, 'badKind');
same('no kind', validateBoard({ kind: undefined, channelId: CH, channelIds: [CH] }).error, 'badKind');
same('a channel that is not an id', validateBoard({ kind: 'chat', channelId: 'general', channelIds: ['general'] }).error, 'badChannel');
same('a channel that is not in the server', validateBoard({ kind: 'chat', channelId: OTHER, channelIds: [CH] }).error, 'badChannel');
same('no channel', validateBoard({ kind: 'chat', channelId: '', channelIds: [CH] }).error, 'badChannel');

// --- what a row looks like ---
const clean = cleanBoard({ kind: 'voice', channel_id: CH, last_refreshed_at: '2026-11-12T02:00:00Z', last_error: null, daily_message_id: '1290000000000000301', weekly_message_id: '1290000000000000302', monthly_message_id: null });
same('a clean row', [clean.kind, clean.channelId, clean.refreshedAt, clean.error, clean.messages], ['voice', CH, '2026-11-12T02:00:00.000Z', null, 2]);
same('waiting to be written', cleanBoard({ kind: 'chat', channel_id: CH, last_refreshed_at: null }).refreshedAt, null);
same('a reason the bot saved is kept', cleanBoard({ kind: 'chat', channel_id: CH, last_error: 'permissions' }).error, 'permissions');
same('a reason that is not one of them is dropped', cleanBoard({ kind: 'chat', channel_id: CH, last_error: 'SELECT * FROM x' }).error, null);
same('a channel that is not an id is dropped', cleanBoard({ kind: 'chat', channel_id: 'x' }).channelId, '');
same('a date that cannot be read', cleanBoard({ kind: 'chat', channel_id: CH, last_refreshed_at: 'nope' }).refreshedAt, null);
same('the messages to delete, the month first', messageIds({ daily_message_id: '1290000000000000301', weekly_message_id: null, monthly_message_id: '1290000000000000303' }), ['1290000000000000303', '1290000000000000301']);
same('no messages', messageIds({}), []);

// --- statistics off, or kept without members: no board can show anything ---
same('no row is the defaults', statsProblem(null), null);
same('statistics on', statsProblem({ enabled: true, members_enabled: true }), null);
same('statistics off', statsProblem({ enabled: false, members_enabled: true }), 'statsOff');
same('without members', statsProblem({ enabled: true, members_enabled: false }), 'membersOff');
same('off wins over without members', statsProblem({ enabled: false, members_enabled: false }), 'statsOff');

// --- the role of the most active member ---
const GUILD = '1290000000000000100';
const ROLE = '1290000000000000400';
const ROLES = [{ id: ROLE, managed: false }, { id: '1290000000000000401', managed: true }, { id: GUILD, managed: false }];
same('the reasons the bot saves for a role', [...ROLE_REASONS], ['statsOff', 'membersOff', 'role', 'permissions', 'error']);
same('a good role', validateRole({ kind: 'chat', roleId: ROLE, roles: ROLES, guildId: GUILD }), { ok: true, role: { kind: 'chat', role_id: ROLE } });
same('voice too', validateRole({ kind: 'voice', roleId: ROLE, roles: ROLES, guildId: GUILD }).ok, true);
same('a kind that does not exist (role)', validateRole({ kind: 'text', roleId: ROLE, roles: ROLES, guildId: GUILD }).error, 'badKind');
same('the role of a bot or of boosters', validateRole({ kind: 'chat', roleId: '1290000000000000401', roles: ROLES, guildId: GUILD }).error, 'badRole');
same('@everyone', validateRole({ kind: 'chat', roleId: GUILD, roles: ROLES, guildId: GUILD }).error, 'badRole');
same('a role that is not in the server', validateRole({ kind: 'chat', roleId: '1290000000000000999', roles: ROLES, guildId: GUILD }).error, 'badRole');
same('a role that is not an id', validateRole({ kind: 'chat', roleId: 'admin', roles: [{ id: 'admin' }], guildId: GUILD }).error, 'badRole');
same('no role', validateRole({ kind: 'chat', roleId: '', roles: ROLES, guildId: GUILD }).error, 'badRole');
const cleanedRole = cleanRole({ kind: 'voice', role_id: ROLE, holder_id: '1290000000000000500', last_error: 'permissions', awarded_week: '2026-11-02' });
same('a clean role row', [cleanedRole.kind, cleanedRole.roleId, cleanedRole.holderId, cleanedRole.error], ['voice', ROLE, '1290000000000000500', 'permissions']);
same('nobody has the role yet', cleanRole({ kind: 'chat', role_id: ROLE, holder_id: null }).holderId, null);
same('a holder that is not an id is dropped', cleanRole({ kind: 'chat', role_id: ROLE, holder_id: 'x' }).holderId, null);
same('a reason that is not one of them is dropped (role)', cleanRole({ kind: 'chat', role_id: ROLE, last_error: 'channel' }).error, null);

// --- who may change them ---
check('the owner', canEditActivityBoards({ owner: true, permissions: '0' }));
check('an administrator', canEditActivityBoards({ owner: false, permissions: '8' }));
check('Manage Server', canEditActivityBoards({ owner: false, permissions: String(0x20) }));
check('not Manage Roles', !canEditActivityBoards({ owner: false, permissions: String(0x10000000) }));
check('nothing', !canEditActivityBoards({ owner: false, permissions: '0' }));
check('no guild', !canEditActivityBoards(null) && !canEditActivityBoards({ permissions: 'x' }));

// --- the page is in place ---
const page = read('src/pages/dash/guild/[id]/activity-boards.astro');
check('the page asks for the permissions of Discord, not the cookie', /canEditActivityBoards\(guilds\.find/.test(page) && /getCachedUserGuilds/.test(page));
check('the page does not write when it cannot edit', /if \(!canEdit\) message = \{ kind: 'err'/.test(page));
check('the same validation as the bot', /validateBoard\(\{/.test(page));
check('only channels of the server are kept', /channelIds: \[\.\.\.channelById\.keys\(\)\]/.test(page));
check('a server with statistics off cannot save', /else if \(problem\) message/.test(page));
check('the old messages go when the channel changes or the board is removed', (page.match(/await deleteMessages\(/g) ?? []).length === 2);
check('saving makes the board due at once', /last_refreshed_at: null/.test(page));
check('the role is written only by who can edit and with the same validation', /action === 'role-set' \|\| action === 'role-remove'/.test(page) && /validateRole\(\{/.test(page));
check('only roles that can be handed out are kept', /usableRoles\.map/.test(page) && /!r\.managed/.test(page));
check('a role that changes or goes away is taken from who has it', (page.match(/await takeRole\(/g) ?? []).length === 2);
check('choosing a role makes it due at once', /awarded_week: null, last_checked_at: null, last_error: null/.test(page));
check('the menu', /id: 'activity-boards'/.test(read('src/components/DashGuildLayout.astro')));
check('the modules list', /id: 'activity-boards'/.test(read('src/utils/dashModules.ts')));
check('the module statuses', /set\('activity-boards'/.test(read('src/utils/moduleStatuses.ts')));
check('the role access sections', /'activity-boards'/.test(read('src/utils/dashAccess.ts')));
check('Support mode stays closed', !/activity-boards/.test(read('src/utils/supportEdit.ts')));

if (failed) { console.log(`${failed} check(s) failed`); process.exit(1); }
console.log('Activity leaderboard page checks passed (rules, permissions, rows, statistics off, the page in the menu and the lists).');
