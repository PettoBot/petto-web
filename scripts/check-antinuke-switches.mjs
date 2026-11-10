// The switches of the anti-raid and nuke page save by themselves, in the background (a ring turns on the knob, nothing is redrawn, no "unsaved changes" bar),
// one after the other; and the settings of the automod that were hard to find (spam, capitals, the mute of the strikes) can be reached from the AutoMod templates page.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');
const nuke = read('src/components/DashAntiNuke.astro');

// Every switch that saves by itself is kept out of the unsaved changes.
const autos = [...nuke.matchAll(/<input type="checkbox"[^>]*data-an-auto[^>]*>/g)].map((match) => match[0]);
assert.ok(autos.length >= 2, 'the page has switches that save by themselves');
for (const input of autos) assert.ok(input.includes('data-no-dirty'), `a switch that saves by itself is not an unsaved change: ${input.slice(0, 80)}`);

// They no longer submit the form (which redraws the page); they are saved in a chain, one at a time, and go back if it fails.
assert.ok(!nuke.includes('auto.form.requestSubmit()'), 'the switch does not submit the form of the page any more');
assert.ok(nuke.includes('anRun(form, function ()') && nuke.includes('anActive < 3') && nuke.includes("headers: { 'X-Dash-Partial': '1' }") && nuke.includes('input.checked = !want'), 'saved one after the other, and it goes back when it fails');
assert.ok(nuke.includes("data-anx-busy") && nuke.includes('@keyframes anx-ring') && nuke.includes('.anx-sw[data-anx-busy=\'1\'] .sx-toggle::before'), 'a ring turns on the knob while it saves');
assert.ok(nuke.includes('anRecount()') && nuke.includes('.an-count'), 'the count of active protections follows the switches');

// The AutoMod templates page points to the settings of Petto that it does not have, and those blocks can be reached by address.
const templates = read('src/components/DashAutomodTemplates.astro');
const moderation = read('src/components/DashModeration.astro');
assert.ok(templates.includes('moderation#anti-spam') && templates.includes('class="am-where"'), 'the AutoMod templates page links to Anti-spam and Strikes');
assert.ok(moderation.includes('id="anti-spam"') && moderation.includes('id="strikes"'), 'the blocks of Anti-spam and Strikes have an address');
assert.ok(moderation.includes('several messages in a row') && moderation.includes('too many capital letters'), 'the blocks say what they do (spam, capitals, the mute)');
console.log('antinuke switches: ok');
