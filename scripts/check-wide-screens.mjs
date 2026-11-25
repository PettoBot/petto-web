// A wide window (a 1920 or 2560 px screen): the public pages and the top bar grow with it (--site-w), the title and the picture of the home are drawn bigger (--wide), and every page of both
// dashboards takes the same width (--dash-page-w), instead of each one stopping at 1000-1240px and leaving half of the area empty.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const base = readFileSync('src/layouts/Base.astro', 'utf8');
const home = readFileSync('src/components/Home.astro', 'utf8');

for (const width of [1600, 1900, 2300]) assert.match(base, new RegExp(`@media \\(min-width: ${width}px\\) \\{ :root \\{ --site-w: \\d+px; --dash-page-w: \\d+px; --wide: [\\d.]+; \\} \\}`), `the sizes change from ${width}px`);
assert.match(base, /:root \{ --site-w: 1120px; --dash-page-w: 1240px; --wide: 1; \}/, 'a normal window keeps the size it was designed for');
assert.match(base, /\.wrap \{ max-width: var\(--site-w\)/, 'the container of the public pages follows --site-w');
assert.match(base, /\.nav-inner \{[^}]*max-width: var\(--site-w\)/, 'the top bar follows --site-w');
assert.match(base, /:is\(\.dgl-content, \.dme-content\) > :not\([^)]*\) \{ max-width: min\(100%, var\(--dash-page-w\)\) !important; \}/, 'the pages of both dashboards take one width');
assert.match(base, /@media \(min-width: 2100px\) \{\s*:is\(\.dgl-content, \.dme-content\) > :not\([^)]*\) \{ margin-inline: auto !important; \}/, 'on a very wide window the page stays in the middle of the area');
for (const piece of ['h1.headline', '.hero-laptop', '.sec-head h2']) assert.ok(home.split('\n').some((line) => line.includes(piece) && line.includes('var(--wide, 1)')), `${piece} grows with --wide`);
// The top bar: three columns (logo, links, buttons) so the links sit in the middle, every button the same size, bigger with --wide, and a point of light that is measured on the bar itself.
assert.match(base, /header\.nav \.nav-inner \{ display: grid; grid-template-columns: minmax\(max-content, 1fr\) auto minmax\(max-content, 1fr\)/, 'the links of the bar are in the middle');
assert.match(base, /header\.nav \.nav-actions \.theme-toggle \{ width: 38px; height: 38px; border-radius: 11px; \}/, 'the language and theme buttons are as big as the others of the bar');
assert.match(base, /body header\.nav \.nav-actions \.specular-button--sm \{ min-height: calc\(38px \* var\(--wide\)\)/, 'the buttons of the bar grow with --wide');
const glass = readFileSync('src/components/LiquidGlass.astro', 'utf8');
assert.match(glass, /getBoundingClientRect\(\)[\s\S]{0,200}clientX - box\.left/, 'the light is placed from the left edge of each bar');
assert.doesNotMatch(glass, /event\.clientX \/ window\.innerWidth/, 'the light is not a share of the window');
console.log('wide screens: ok');
