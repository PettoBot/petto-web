// A dashboard page that is slow or that arrives with no style (the Feeds page did both): a page drawn by the dashboard's own navigation is only drawn once its
// stylesheet is there (otherwise the page is opened the normal way, which holds it back until its styles arrive), waits on the database and on Discord are
// bounded, and a slow page says where its time went in the log of the host.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url).pathname;
const layout = readFileSync(`${root}src/components/DashGuildLayout.astro`, 'utf8');
assert.ok(/results\.every\(Boolean\)/.test(layout), 'the stylesheets of a page are all counted: one that failed or is late makes the whole answer "not ready"');
assert.ok(/function \(stylesReady\) \{\s*if \(!stylesReady\) return false;/.test(layout), 'a page whose styles are not ready is not drawn bare: swapContent says no, and the callers open the page the normal way');
assert.ok(/window\.setTimeout\(function \(\) \{ done\(false\); \}, 6000\)/.test(layout), 'a stylesheet is waited for six seconds, not under two');

const feeds = readFileSync(`${root}src/pages/dash/guild/[id]/feeds.astro`, 'utf8');
assert.ok(/feeds\?guild_id=[^`]*`, \{ headers: apiHeaders, signal: AbortSignal\.timeout\(10_000\) \}/.test(feeds), 'the feeds of the server are asked with a time limit');
const discord = readFileSync(`${root}src/utils/discord.ts`, 'utf8');
assert.ok(/signal: AbortSignal\.timeout\(DISCORD_LIST_TIMEOUT_MS\)/.test(discord) && /return new Response\('\[\]', \{ status: 504 \}\)/.test(discord), 'the channels and roles of Discord have a time limit and a failed list is a 504, not a failed page');

const server = readFileSync(`${root}server.mjs`, 'utf8');
assert.ok(/\[web\] slow \$\{req\.method\} \$\{entry\.u\}/.test(server) && /entry\.t >= SLOW_REQUEST_MS/.test(server), 'a slow page is written in the log with its timing');
assert.ok(/slowSeen\.get\(entry\.p\) > Date\.now\(\) - 20_000/.test(server), 'at most one line for each path every twenty seconds');

// The Feeds page: removing a feed waits in its own row, does not scroll the page to the box at the top, and does not read the whole list again before it answers.
const feedsPage = readFileSync(`${root}src/components/DashFeeds.astro`, 'utf8');
const del = feedsPage.slice(feedsPage.indexOf('if (button.dataset.feedDelete)'));
assert.ok(/working\(button, text\.removing\)/.test(del), 'the row says it is removing (spinner and word on its own button)');
assert.ok(!/waitInFlash/.test(feedsPage), 'no action of a row waits in the box at the top any more (it scrolled the page up to it)');
assert.ok(/await refresh\('', true\)/.test(del) && /row\.remove\(\)/.test(del), 'the row goes away at once and the list is read again quietly, after');
assert.ok(/cache: 'no-store'/.test(feedsPage.slice(feedsPage.indexOf('const refresh'), feedsPage.indexOf('const toast'))), 'the list read again never comes from a copy kept by the browser');

// Tickets: a type with history cannot be deleted, so it can be turned off (taken off its panel, the panel is drawn again, nothing is erased); and a type that
// moves to another panel (or to none) draws the panel it left again, or its button would stay on it.
const tickets = readFileSync(`${root}src/pages/dash/guild/[id]/tickets.astro`, 'utf8');
assert.ok(/action === 'disable'/.test(tickets) && /body: JSON\.stringify\(\{ panel_id: null \}\)/.test(tickets), 'a ticket type can be turned off without deleting anything');
assert.ok(/String\(before\.panel_id\) !== String\(panelId \?\? ''\)\) await refreshPanelById\(String\(before\.panel_id\)\)/.test(tickets), 'the panel a type left is drawn again');
assert.ok(/Use Turn off instead/.test(tickets), 'the refusal to delete says what to do instead');
assert.ok(/value="disable"/.test(readFileSync(`${root}src/components/DashTickets.astro`, 'utf8')), 'the types have a Turn off button');
const quick = readFileSync(`${root}src/components/DashQuickAccess.astro`, 'utf8');
assert.ok(/words\.channelNeeded/.test(quick) && /hint\.setAttribute\('role', 'alert'\)/.test(quick), 'a switch that needs a channel answers with a warning that says so');

console.log('slow pages: ok');
