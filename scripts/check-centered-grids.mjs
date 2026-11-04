// A card grid that is capped with a pixel max-width must be centered, or the cards sit against the left edge of the page container with a
// wide empty strip on their right (the home page's "In Discord" section did this between 700 and 980 px: a one-column grid with
// `max-width: 560px` and no `margin-inline: auto`). Neither the build nor the type check can see it, and it only shows at some widths.
//
// This is a static check of the CSS of the public components (the dashboard is left aligned on purpose): a rule that sets
// `grid-template-columns` and a pixel `max-width` must also center itself with `margin-inline: auto` (or `margin: ... auto`).
// A grid that really is meant to stay on the left says so with `/* left-aligned */` inside the rule.
// It cannot measure anything: after changing a layout, also look at the page at 412, 820, 980 and 1180 px.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) { if (!/^(dash|react)$/i.test(name)) walk(path); continue; }
    if (name.endsWith('.astro') && !name.startsWith('Dash')) files.push(path);
  }
}
walk(join(root, 'src'));

const problems = [];
let grids = 0;
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  for (const style of source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    const css = style[1];
    // The innermost `selector { declarations }` pairs, so a rule inside an @media block is found as well.
    for (const rule of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const body = rule[2];
      if (!/grid-template-columns\s*:/.test(body) || !/(^|[;\s])max-width\s*:\s*\d+(\.\d+)?px/.test(body)) continue;
      grids += 1;
      if (/left-aligned/.test(body)) continue;
      if (/margin(-inline(-start)?)?\s*:[^;]*\bauto\b/.test(body)) continue;
      const start = style.index + style[0].indexOf(css) + rule.index + (rule[0].length - rule[0].trimStart().length);
      const line = source.slice(0, start).split('\n').length;
      problems.push(`  ${file.slice(root.length + 1)}:${line}  ${rule[1].trim().replace(/\s+/g, ' ')} { ${body.trim().replace(/\s+/g, ' ').slice(0, 110)} }`);
    }
  }
}

if (problems.length) {
  console.error(`These grids have a pixel max-width but are not centered (they would sit against the left edge). Add \`margin-inline: auto\`, or \`/* left-aligned */\` if that is intended:\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(`Checked the capped grids: ${grids} found, all centered.`);
