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

// What Discord needs of a picture to show it: a real image file (it starts like one), not empty and not over 8 MB, and for a PNG a size that makes sense
// (not tiny, not huge). A file that is something else with the name of a picture, or a cut one, shows broken in the channel for good.
function pictureProblems(file) {
  const bytes = readFileSync(file);
  const problems = [];
  const starts = (...head) => head.every((byte, index) => bytes[index] === byte);
  const png = starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  const jpeg = starts(0xff, 0xd8, 0xff);
  const gif = starts(0x47, 0x49, 0x46, 0x38);
  const webp = starts(0x52, 0x49, 0x46, 0x46) && bytes.subarray(8, 12).toString('latin1') === 'WEBP';
  if (!bytes.length) return ['is empty'];
  if (!png && !jpeg && !gif && !webp) problems.push('is not a PNG, JPEG, GIF or WebP file');
  if (bytes.length > 8 * 1024 * 1024) problems.push('is over 8 MB, the most Discord takes');
  if (png) {
    const width = bytes.readUInt32BE(16);
    const height = bytes.readUInt32BE(20);
    if (width < 200 || height < 100) problems.push(`is too small (${width}x${height}) to be seen`);
    if (width > 4096 || height > 4096) problems.push(`is too big (${width}x${height}); Discord needs at most 4096 in each side`);
    // a PNG ends with its IEND chunk: a file that was cut does not
    if (bytes.subarray(bytes.length - 8, bytes.length - 4).toString('latin1') !== 'IEND') problems.push('is cut (it does not end like a PNG)');
  }
  return problems;
}

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
  if (Array.isArray(entry.images) && new Set(entry.images).size !== entry.images.length) bad('a picture is listed twice (Discord shows it once and the change looks as if one failed)');
  if (entry.images !== undefined) {
    if (!Array.isArray(entry.images) || entry.images.length > LIMITS.images) bad(`images must be a list of ${LIMITS.images} at most`);
    else for (const url of entry.images) {
      if (typeof url !== 'string' || !/^https:\/\/\S+$/.test(url)) { bad(`the picture "${url}" is not an https link`); continue; }
      const own = /^https:\/\/petto\.sbs\/assets\/log\/([\w.-]+\.(?:png|jpe?g|webp|gif))$/.exec(url);
      if (!own) bad(`the picture ${url} is not a file of https://petto.sbs/assets/log/`);
      else if (!existsSync(path.join(root, 'public/assets/log', own[1]))) bad(`the picture ${own[1]} is not in public/assets/log/`);
      else for (const why of pictureProblems(path.join(root, 'public/assets/log', own[1]))) bad(`the picture ${own[1]} ${why}`);
    }
  }
  if (entry.docs !== undefined && !/^https:\/\/\S+$/.test(String(entry.docs))) bad('docs must be an https link');
  // The log is for the community: no code stats and nothing internal.
  if (/\b\d+\s+lines?\s+of\s+code\b/i.test(`${entry.title} ${entry.summary}`)) bad('no technical details (lines of code)');
}
assert.deepEqual(problems, [], `The Currently log file:\n${problems.join('\n')}`);
console.log(`Checked the Currently log file: ${file.entries.length} entries, version ${file.version}, revision ${file.revision}, every picture is in the site and is a real image Discord can show.`);
