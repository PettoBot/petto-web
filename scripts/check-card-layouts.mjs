// The basic image cards are drawn in the browser (src/react/cards/basicLayers.ts, a copy of the layouts of petto-bot) so the editor and the embed builder show them
// at once. This compares that copy, preset by preset, with the layouts the bot pins (scripts/fixtures/card-presets.json is a copy of the bot's file: copy it again when
// the bot's layouts change, and this fails until basicLayers.ts has the same change).
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

const root = new URL('../', import.meta.url).pathname;
const out = await build({ entryPoints: [`${root}src/react/cards/basicLayers.ts`], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
const layouts = await import(`data:text/javascript;base64,${Buffer.from(out.outputFiles[0].text).toString('base64')}`);
const { PRESETS, RANK_PRESETS, BASIC_DEFAULTS, RANK_DEFAULTS, buildBasicLayers } = layouts;

const pinned = {};
for (const preset of PRESETS) pinned[preset] = buildBasicLayers({ ...BASIC_DEFAULTS, preset, font: 'Poppins' }, 1024, 500);
for (const preset of RANK_PRESETS) pinned[preset] = buildBasicLayers({ ...RANK_DEFAULTS, preset, font: 'Poppins' }, 1024, 320, 'rank');
const fixture = JSON.parse(readFileSync(`${root}scripts/fixtures/card-presets.json`, 'utf8'));
assert.deepEqual(Object.keys(pinned).sort(), Object.keys(fixture).sort(), 'the same layouts');
for (const preset of Object.keys(fixture)) assert.deepEqual(JSON.parse(JSON.stringify(pinned[preset])), fixture[preset], `${preset}: the layers are the ones of the bot`);
// The decoration is on every layout that has an avatar, right after it.
for (const [preset, layers] of Object.entries(pinned)) {
  const at = layers.findIndex((layer) => layer.id === 'decoration');
  assert.ok(at > 0 && layers[at - 1].type === 'avatar', `${preset}: the decoration is right after the avatar`);
}
// And the editor draws basic cards with them, not through the bot.
const app = readFileSync(`${root}src/react/cards/CardsApp.tsx`, 'utf8');
assert.ok(/buildBasicLayers\(/.test(app) && /const live = !exact;/.test(app), 'the editor draws basic cards in the browser unless the exact preview is on');
const embeds = readFileSync(`${root}src/react/embeds/EmbedBuilderApp.tsx`, 'utf8');
assert.ok(/drawCard\(/.test(embeds) && !/action: 'preview'/.test(embeds), 'the embed builder draws the card in the browser, not through the bot');

console.log('card layouts: ok');
