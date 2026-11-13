// The reactions field of the Feeds page (src/utils/feedReactions.mjs): finding the emojis a person wrote, the limit of 5, and the text of a saved list.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MAX_REACTIONS, parseReactions, reactionsText } from '../src/utils/feedReactions.mjs';

const CUSTOM = '<:pe_ok:123456789012345678>';
assert.equal(MAX_REACTIONS, 5);
assert.deepEqual(parseReactions('👍 🔥').emojis, ['👍', '🔥']);
assert.deepEqual(parseReactions('👍🔥❤️').emojis, ['👍', '🔥', '❤️'], 'no spaces needed');
assert.deepEqual(parseReactions(`👍, ${CUSTOM}; <a:dance:223456789012345678>`).emojis, ['👍', CUSTOM, '<a:dance:223456789012345678>'], 'commas, semicolons and custom emojis');
assert.deepEqual(parseReactions('🇨🇴 1️⃣ 👍🏽 👨‍👩‍👧').emojis, ['🇨🇴', '1️⃣', '👍🏽', '👨‍👩‍👧'], 'flags, keycaps, skin tones and joined emojis count as one each');
assert.deepEqual(parseReactions('👍 👍 🔥').emojis, ['👍', '🔥'], 'no repeats');
assert.equal(parseReactions('👍 words 🔥').ignored, true);
assert.equal(parseReactions('👍 🔥').ignored, false);
assert.deepEqual(parseReactions('hello 12').emojis, [], 'letters and digits are not emojis');
assert.deepEqual(parseReactions('').emojis, []);
assert.deepEqual(parseReactions(undefined).emojis, []);
const six = parseReactions('1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣');
assert.equal(six.emojis.length, 5); assert.equal(six.tooMany, true);
assert.equal(parseReactions('1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣').tooMany, false);
assert.equal(reactionsText(['👍', CUSTOM]), `👍 ${CUSTOM}`);
assert.equal(reactionsText(undefined), '');
assert.equal(reactionsText([1, null, '🔥']), '🔥');
// The page reads the reactions (and the player) of a feed from its row: they were dropped there, so editing a feed lost them. And the form has the field and sends it.
const feeds = fs.readFileSync(new URL('../src/utils/feeds.ts', import.meta.url), 'utf8');
assert.match(feeds, /reactions: Array\.isArray\(row\.options\.reactions\)/, 'feedFromRow keeps the reactions of a feed');
assert.match(feeds, /player: typeof row\.options\.player === 'boolean'/, 'feedFromRow keeps the player option too');
const page = fs.readFileSync(new URL('../src/components/DashFeeds.astro', import.meta.url), 'utf8');
assert.match(page, /data-reactions/, 'the Feeds form has the reactions field');
assert.match(page, /reactions: reactions\.emojis/, 'and saves the list it read');
assert.match(page, /parseReactions\(field<HTMLInputElement>\('\[data-reactions\]'\)\.value\)/);
console.log('Checked the reactions of a feed in the dashboard: emojis found, at most 5, and the text of a saved list.');
