// Checks the settings of the extra verification checks of the dashboard (src/utils/verifyChecks.ts): a bad value is "off" (it never blocks anybody), the form of the
// Verification card becomes the object the bot reads, the lists of domains are cleaned, and the card has every field (and the translations of its texts).
// Run: node scripts/check-verify-checks.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const bundled = await build({ entryPoints: [`${root}src/utils/verifyChecks.ts`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
const { normalizeChecks, checksFromForm, domainList } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);

assert.deepEqual(normalizeChecks(undefined), { tor: 'off', alt: 'off', account: { mode: 'off', min_age_days: 0, no_avatar: false, flagged: true }, email: { required: false, common_only: true, block_disposable: true, allowed_domains: [], blocked_domains: [] } });
assert.equal(normalizeChecks({ tor: 'nonsense', alt: 3 }).tor, 'off');
assert.equal(normalizeChecks({ account: { min_age_days: 9999 } }).account.min_age_days, 365, 'the age is capped');
assert.equal(normalizeChecks({ account: { min_age_days: -4 } }).account.min_age_days, 0);
assert.deepEqual(domainList('A.com, b.org\nhttps://c.net/x @d.io nonsense a.com'), ['a.com', 'b.org', 'c.net', 'd.io']);
assert.equal(domainList(Array.from({ length: 80 }, (_, i) => `d${i}.com`)).length, 50);

const form = (fields) => { const data = new FormData(); for (const [key, value] of Object.entries(fields)) data.append(key, value); return data; };
assert.deepEqual(checksFromForm(form({ chk_tor: 'block', chk_alt: 'warn', chk_account: 'warn', chk_account_age: '7', chk_account_avatar: 'on', chk_email: 'on', chk_email_common: 'on', chk_email_disposable: 'on', chk_email_allow: 'school.edu, company.com', chk_email_deny: '' })),
  { tor: 'block', alt: 'warn', account: { mode: 'warn', min_age_days: 7, no_avatar: true, flagged: false }, email: { required: true, common_only: true, block_disposable: true, allowed_domains: ['school.edu', 'company.com'], blocked_domains: [] } },
  'a box that is not ticked is false: the form only sends the ones that are');
assert.equal(checksFromForm(form({})).email.common_only, false, 'an empty form turns the options off too');
assert.equal(normalizeChecks({ email: { common_only: false } }).email.common_only, false);
assert.equal(checksFromForm(form({})).email.block_disposable, false, 'an empty form turns the options off (the page always sends its fields)');
assert.equal(checksFromForm(form({ chk_tor: 'hack' })).tor, 'off');

// The card has every field, and the save sends them only when the bot has the column.
const card = readFileSync(`${root}src/components/DashOnboarding.astro`, 'utf8');
assert.ok(card.includes('name={`chk_${key}`}') && card.includes("['tor', ") && card.includes("['alt', "), 'the card has the Tor and alt rows (chk_tor, chk_alt)');
for (const name of ['chk_account', 'chk_account_age', 'chk_account_avatar', 'chk_account_flagged', 'chk_email', 'chk_email_common', 'chk_email_disposable', 'chk_email_allow', 'chk_email_deny', 'checks_ready']) assert.ok(card.includes(name), `the card has ${name}`);
const page = readFileSync(`${root}src/pages/dash/guild/[id]/onboarding.astro`, 'utf8');
assert.ok(page.includes("form.get('checks_ready') ? { checks: checksFromForm(form) }"), 'the checks are saved only when the bot has them');
// A save that fails says so (the page and the log), "post the panel again" asks the bot at once, and a name of the server that cannot be read after a save does not send the person away.
assert.ok(page.includes('saveResponse.ok') && page.includes('console.error(`[onboarding] saving the verification'), 'a refused save is logged and shown');
assert.ok(page.includes("callPettoVerification(Astro, id, String(session.userId), 'panel')") && page.includes("form.get('panel_repost') === 'on'"), 'the panel is posted again at once when asked');
assert.ok(page.includes('fallbackInfo') && page.includes("Astro.request.method === 'POST' && !guildInfo"), 'after a save the page comes back even if the name of the server cannot be read');
assert.ok(card.includes('problem && <div class="sx-flash sx-flash-bad" role="alert">'), 'the problem is shown in a red line');
assert.ok(readFileSync(`${root}src/utils/discord.ts`, 'utf8').includes('could not be read:'), 'a server Discord does not give is in the log');
// The method "Email code" and the switch for the DM when someone joins.
assert.ok(card.includes("['email', dt('Email code (no captcha)')") && page.includes("'discord', 'email'].includes(String(form.get('method')))"), 'the email code is a method that can be chosen and saved');
assert.ok(page.includes("dm_on_join: form.get('dm_on_join') === 'on' || !String(form.get('panel_channel_id') ?? '').trim()"), 'the DM can be off only with a channel for the panel');
assert.ok(card.includes('name="dm_on_join"') && card.includes('name="dm_ready"') && card.includes('data-vf-dm'), 'the card has the switch of the DM');
console.log('verify checks: ok');
