// The file of the Currently log (src/data/currentlyLog.json) is read by the bot, which posts in Discord what it holds: a mistake here is a wrong post or a broken
// picture in the channel. The same rules as the bot's (src/utils/currentlyLog.ts), and every picture it names has to be a file of public/assets/log/.
//
// How to add a change: a new entry at the end of "entries", with an id never used before. When a new version of the log starts, change "version". To post
// the whole log again (it deletes the old cards), raise "revision".
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = JSON.parse(readFileSync(path.join(root, 'src/data/currentlyLog.json'), 'utf8'));
const CATEGORIES = ['security', 'feature', 'addition', 'improvement', 'fix', 'web', 'removal', 'removed-feature'];
const LIMITS = { title: 100, area: 80, summary: 700, images: 3, id: 80 };
const problems = [];

if (!Number.isInteger(file.revision) || file.revision < 1) problems.push('revision must be a whole number from 1');
if (!/^\d+\.\d+\.\d+$/.test(String(file.version))) problems.push('version must look like 0.7.12');
if (!Array.isArray(file.entries) || !file.entries.length) problems.push('entries must be a list with something in it');

const seen = new Set();
for (const [index, entry] of (Array.isArray(file.entries) ? file.entries : []).entries()) {
  const name = `entry ${index + 1} (${entry?.id})`;
  const bad = (why) => problems.push(`${name}: ${why}`);
  if (!entry || typeof entry !== 'object') { bad('not an object'); continue; }
  if (typeof entry.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(entry.id) || entry.id.length > LIMITS.id) bad('the id must be lowercase letters, numbers and dashes');
  if (seen.has(entry.id)) bad('the id is used twice');
  seen.add(entry.id);
  if (!CATEGORIES.includes(entry.category)) bad(`the category must be one of ${CATEGORIES.join(', ')}`);
  for (const field of ['title', 'area', 'summary']) {
    if (typeof entry[field] !== 'string' || !entry[field].trim()) bad(`${field} is empty`);
    else if (entry[field].length > LIMITS[field]) bad(`${field} is longer than ${LIMITS[field]} characters`);
  }
  if (entry.images !== undefined) {
    if (!Array.isArray(entry.images) || entry.images.length > LIMITS.images) bad(`images must be a list of ${LIMITS.images} at most`);
    else for (const url of entry.images) {
      if (typeof url !== 'string' || !/^https:\/\/\S+$/.test(url)) { bad(`the picture "${url}" is not an https link`); continue; }
      const own = /^https:\/\/petto\.sbs\/assets\/log\/([\w.-]+\.(?:png|jpe?g|webp|gif))$/.exec(url);
      if (!own) bad(`the picture ${url} is not a file of https://petto.sbs/assets/log/`);
      else if (!existsSync(path.join(root, 'public/assets/log', own[1]))) bad(`the picture ${own[1]} is not in public/assets/log/`);
    }
  }
  if (entry.docs !== undefined && !/^https:\/\/\S+$/.test(String(entry.docs))) bad('docs must be an https link');
  // The log is for the community: no code stats and nothing internal.
  if (/\b\d+\s+lines?\s+of\s+code\b/i.test(`${entry.title} ${entry.summary}`)) bad('no technical details (lines of code)');
}
assert.deepEqual(problems, [], `The Currently log file:\n${problems.join('\n')}`);
console.log(`Checked the Currently log file: ${file.entries.length} entries, version ${file.version}, revision ${file.revision}, every picture is in the site.`);
