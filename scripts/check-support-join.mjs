// Checks the question "do you want Petto to add you to the support server?" before the dashboard login: it is asked once per browser, Discord is
// asked for the permission (`guilds.join`) only after a yes, and a later login never joins without asking.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { loginScope, supportChoice } from '../src/utils/dashLogin.mjs';

assert.equal(loginScope(false), 'identify guilds email', 'the normal login asks who you are, your servers and your email (to offer it as the contact email)');
assert.equal(loginScope(true), 'identify guilds email guilds.join', 'a yes adds the permission to join');

assert.deepEqual(supportChoice(), { ask: true, join: false, remember: false }, 'the first time: ask');
assert.deepEqual(supportChoice({ answer: 'yes' }), { ask: false, join: true, remember: true });
assert.deepEqual(supportChoice({ answer: 'no' }), { ask: false, join: false, remember: true });
assert.deepEqual(supportChoice({ answer: 'yes', asked: '1' }), { ask: false, join: true, remember: true }, 'a yes is a yes even after it was asked');
assert.deepEqual(supportChoice({ asked: '1' }), { ask: false, join: false, remember: false }, 'asked before: log in, never join without a new yes');
assert.deepEqual(supportChoice({ answer: 'maybe', asked: null }), { ask: true, join: false, remember: false }, 'any other word is no answer');
assert.deepEqual(supportChoice({ answer: '<script>', asked: '0' }), { ask: true, join: false, remember: false });

const read = (file) => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const login = read('src/pages/dash/login.ts');
assert.match(login, /joinSupport: choice\.join/, 'the login asks Discord for the permission only on a yes');
assert.match(login, /petto_join_support/, 'a short cookie carries the yes to the callback');
const callback = read('src/pages/dash/callback.ts');
assert.match(callback, /petto_join_support[\s\S]*guilds\.join[\s\S]*callPettoSupportJoin/, 'the callback joins only with the cookie and the permission Discord gave');
assert.match(callback, /callPettoSupportJoin\([^)]*\)\.catch/, 'a failed join never fails the login');
for (const file of ['src/i18n/dash-es.ts', 'src/i18n/dash-pt.ts']) {
  const text = read(file);
  for (const key of ['Join the support server?', 'Yes, add me', 'No, thanks']) assert.ok(text.includes(`"${key}":`), `${file} translates "${key}"`);
}
console.log('check-support-join: the question, the permission only after a yes, and the callback.');
