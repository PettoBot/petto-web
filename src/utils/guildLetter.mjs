// The icon of a server that has none: its first letter on a color taken from its name, so the same server always looks the same.
// Plain JavaScript so scripts/check-dash-profile.mjs can run it with node alone.

/** The first letter (or digit) of a server name, upper case, or "?" when there is none. @param {unknown} name */
export function guildLetter(name) {
  const text = typeof name === 'string' ? name.trim() : '';
  const match = /[\p{L}\p{N}]/u.exec(text);
  return match ? match[0].toLocaleUpperCase() : '?';
}

/** The same color for the same name: a hue from 0 to 359. @param {unknown} name */
export function guildHue(name) {
  const text = typeof name === 'string' ? name : '';
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return hash % 360;
}

/** The inline style of the letter tile (calm, readable white text on it). @param {unknown} name */
export function guildLetterStyle(name) {
  const hue = guildHue(name);
  return `background:linear-gradient(135deg,hsl(${hue} 46% 44%),hsl(${(hue + 28) % 360} 46% 34%));color:#fff;`;
}
