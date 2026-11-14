// The reactions of a feed (up to 5 emojis that Petto adds to each notice), as the Feeds page of the dashboard reads and shows them. The bot keeps the list clean again
// (src/feeds/reactions.ts in petto-bot), so this only has to find the emojis a person wrote and tell them when there are too many. Pure: the page and the check use it.

export const MAX_REACTIONS = 5;
/** `<:name:123>` or `<a:name:123>`: a custom emoji of a server. */
const CUSTOM = /<a?:[A-Za-z0-9_]{2,32}:\d{15,25}>/g;
/** One written emoji: a picture (with skin tone, joiners and variation), a flag (two regional letters) or a keycap. */
const UNICODE_ONE = /^(?:\p{Extended_Pictographic}|\p{Regional_Indicator}{2}|[0-9#*]️?⃣)/u;

const graphemes = (text) => (typeof Intl.Segmenter === 'function' ? [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text)].map((part) => part.segment) : [...text]);

/**
 * The emojis in a text, in order, without repeats: `{ emojis, tooMany, ignored }`. `emojis` has at most 5; `tooMany` says more were written;
 * `ignored` says there was something between them that is not an emoji (it is left out).
 * @param {unknown} text
 */
export function parseReactions(text) {
  const source = String(text ?? '');
  const found = [];
  let ignored = false;
  const take = (chunk) => {
    for (const segment of graphemes(chunk)) {
      if (/^[\s,;]+$/.test(segment) || segment === '️') continue;
      if (UNICODE_ONE.test(segment)) found.push(segment); else ignored = true;
    }
  };
  let last = 0;
  for (const match of source.matchAll(CUSTOM)) {
    take(source.slice(last, match.index));
    found.push(match[0]);
    last = match.index + match[0].length;
  }
  take(source.slice(last));
  const unique = [...new Set(found)];
  return { emojis: unique.slice(0, MAX_REACTIONS), tooMany: unique.length > MAX_REACTIONS, ignored };
}

/** The list of a feed as the text of its field: `👍 🔥`. */
export const reactionsText = (list) => (Array.isArray(list) ? list.filter((entry) => typeof entry === 'string').join(' ') : '');
