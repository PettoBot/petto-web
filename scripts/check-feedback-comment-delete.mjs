// Checks that the team can delete a comment of the feedback board: the call to the database only deletes a comment of that post, a bad id never reaches
// the database, the route is for the team only (and refuses another origin), and the button asks first and is only drawn for the team.
// Run: node scripts/check-feedback-comment-delete.mjs
import { readFileSync } from 'node:fs';
import { loadTs } from './og/load-copy.mjs';

process.env.PETTO_BOT_API_URL = 'http://bot.test';
process.env.PETTO_BOT_API_SECRET = 'secret';
const { deleteComment } = await loadTs('src/utils/feedback.ts');
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
let failed = 0;
const check = (name, ok, detail = '') => { if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); } };

const calls = [];
let rows = [{ id: 34 }];
globalThis.fetch = async (url, init) => { calls.push({ url: String(url), method: init?.method }); return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } }); };
const astro = { locals: {} };

check('deletes the comment of that post', (await deleteComment(astro, 12, 34)) === true && calls.length === 1);
check('the call is a DELETE scoped by comment and post', calls[0].method === 'DELETE' && calls[0].url === 'http://bot.test/rest/v1/feedback_comments?id=eq.34&post_id=eq.12', calls[0].url);
rows = [];
check('a comment that is not of that post (nothing deleted) is false', (await deleteComment(astro, 99, 34)) === false);
const before = calls.length;
for (const [post, comment] of [[0, 5], [5, 0], [-1, 5], [5, -3], [1.5, 5], [5, NaN], [Number.MAX_SAFE_INTEGER + 2, 5]]) check(`bad ids never reach the database (${post}, ${comment})`, (await deleteComment(astro, post, comment)) === false);
check('no request for bad ids', calls.length === before);

const route = read('src/pages/api/feedback/[id]/comment-delete.ts');
check('route: another origin is refused', /origin !== url\.origin\) return new Response\('Forbidden', \{ status: 403 \}\)/.test(route));
check('route: a visitor goes to log in', /if \(!session\) return redirect\(/.test(route));
check('route: the team only, before anything is deleted', route.indexOf('isStaff(context, session.userId)') > -1 && route.indexOf('isStaff(context, session.userId)') < route.indexOf('deleteComment(context'));
check('route: deletes in the post of the address', /deleteComment\(context, id, Number\(form\.get\('comment_id'\)\)\)/.test(route));
check('route: the card of Discord is drawn again', /callFeedbackCard\(context, \{ action: 'update'/.test(route));

const page = read('src/pages/feedback/[id].astro');
check('page: the button is only for the team', /\{staff && \(\s*<form class="fb-comment-del"/.test(page));
check('page: it asks before deleting', /fb-comment-del[^>]*data-confirm=\{dt\('Delete this comment\? This cannot be undone\.'\)\}/.test(page));
check('page: it says the comment was deleted', /commentDeleted/.test(page));

if (failed) { console.log(`${failed} check(s) failed`); process.exit(1); }
console.log('feedback comment delete: ok');
