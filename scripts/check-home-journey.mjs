// Checks the drawing that winds down the home page (src/components/HomeJourney.astro): which drawing is shown at each point of the journey, that the route
// never goes inside the content of a section at any width, and that the component stays a decoration (no text, nothing to focus, out of the layout, still
// when the visitor asks for less motion). The pure parts are in src/utils/homeJourney.mjs.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BLEND, BUTTERFLY_FROM, CHRYSALIS_FROM, STATIC_SCENE, buildRoute, dotsFor, journeyState } from '../src/utils/homeJourney.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const problems = [];
const expect = (ok, message) => { if (!ok) problems.push(message); };

// ---- Which drawing at which point ----
expect(CHRYSALIS_FROM === 0.4 && BUTTERFLY_FROM === 0.6, 'the journey must change at about 40 and 60 percent');
for (const [p, name] of [[0, 'caterpillar'], [0.2, 'caterpillar'], [0.35, 'caterpillar'], [0.45, 'chrysalis'], [0.5, 'chrysalis'], [0.55, 'chrysalis'], [0.65, 'butterfly'], [0.8, 'butterfly'], [1, 'butterfly']]) {
  const state = journeyState(p);
  expect(state.name === name, `progress ${p}: the drawing is ${state.name}, it must be the ${name}`);
  expect(state[name] === 1, `progress ${p}: the ${name} must be fully shown (it is at ${state[name]})`);
}
expect(journeyState(-1).name === 'caterpillar' && journeyState(7).name === 'butterfly' && journeyState(NaN).name === 'caterpillar', 'a progress out of 0..1 or not a number must stay in range');
let seen = { caterpillar: 0, chrysalis: 0, butterfly: 0 };
for (let i = 0; i <= 1000; i += 1) {
  const s = journeyState(i / 1000);
  for (const k of Object.keys(seen)) {
    expect(s[k] >= 0 && s[k] <= 1, `progress ${i / 1000}: the opacity of the ${k} is out of 0..1`);
    expect(s.scale[k] >= 0.6 && s.scale[k] <= 1, `progress ${i / 1000}: the scale of the ${k} is out of 0.6..1`);
    if (s[k] > 0.01) seen[k] += 1;
  }
  expect(s.caterpillar + s.chrysalis + s.butterfly <= 1.0001, `progress ${i / 1000}: the drawings add up to more than one (they cross-fade)`);
  const inside = Math.abs(i / 1000 - CHRYSALIS_FROM) < BLEND / 2 - 0.002;
  expect(!inside || (s.caterpillar > 0 && s.chrysalis > 0), `progress ${i / 1000}: the caterpillar and the chrysalis must cross-fade, not cut`);
}
expect(Object.values(seen).every((n) => n > 0), 'every drawing must be shown somewhere in the journey');
// Reduced motion: only the finished picture, and a still scene with the whole story that ends in the butterfly.
for (const p of [0, 0.5, 1]) { const s = journeyState(p, true); expect(s.name === 'butterfly' && s.butterfly === 1 && s.caterpillar === 0 && s.chrysalis === 0, `reduced motion at ${p}: it must show the butterfly only`); }
expect(STATIC_SCENE.map((x) => x.name).join() === 'caterpillar,chrysalis,butterfly' && STATIC_SCENE.at(-1).at === 1, 'the still scene must tell the story and end with the butterfly at the end of the path');
expect(dotsFor(0) === 1 && dotsFor(140) === 11, 'the dots of the trail must follow the length walked');

// ---- The route, at three widths, over a page made like the home page ----
function pageLike(width) {
  const wide = width >= 880;
  const wrap = Math.min(1120, width);
  const left = (width - wrap) / 2 + 28;
  const right = (width + wrap) / 2 - 28;
  // [height, padTop, padBottom] of each section of the home page (about as measured; the narrow page is taller).
  const k = wide ? 1 : 1.7;
  const rows = [[520 * k, 80, 72], [587, 0, 44], [410 * k, 88, 88], [2498 * k, 88, 88], [810 * k, 88, 88], [858 * k, 88, 88], [641 * k, 88, 56], [463 * k, 56, 88], [244, 56, 64], [419, 88, 88]];
  let top = 74;
  return { width, sections: rows.map(([h, padTop, padBottom]) => { const s = { top, bottom: top + h, padTop, padBottom, left, right }; top += h; return s; }), height: top };
}
for (const width of [1920, 1440, 1280, 1024, 768, 412, 360]) {
  const layout = pageLike(width);
  const route = buildRoute(layout);
  if (!route) { problems.push(`${width}px: no route`); continue; }
  const { points } = route;
  expect(points.length > 100 && points.length < 6000, `${width}px: the route has ${points.length} points`);
  expect(route.start.y < route.bottom && route.start.y > layout.sections[0].top && route.bottom < layout.height, `${width}px: the route must start near the first section and end inside the page`);
  let farthest = -Infinity;
  let hits = 0;
  for (const p of points) {
    expect(p.x >= 0 && p.x <= width && p.y >= 0 && p.y <= layout.height, `${width}px: a point of the route is outside the page (${p.x.toFixed(0)}, ${p.y.toFixed(0)})`);
    expect(p.k >= 0.2 && p.k <= 1.0001, `${width}px: the scale ${p.k} is out of range`);
    for (const s of layout.sections) {
      if (p.x > s.left && p.x < s.right && p.y > s.top + s.padTop && p.y < s.bottom - s.padBottom) hits += 1;
    }
    farthest = Math.max(farthest, p.y);
  }
  expect(hits === 0, `${width}px: ${hits} points of the route are inside the content of a section`);
  expect(farthest >= route.bottom - 0.01, `${width}px: the route does not reach its end`);
  // Each side of the page is used, and the route crosses between them.
  const xs = points.map((p) => p.x);
  const end = layout.sections.at(-1);
  expect(Math.abs(route.end.x - width / 2) < width * 0.3 && route.end.y > end.bottom - end.padBottom, `${width}px: the route must end in the band under the last section, near the middle`);
  expect(Math.min(...xs) < width * 0.2 && Math.max(...xs) > width * 0.8, `${width}px: the route must use both margins`);
  // The drawing fits in its lane: its half width at the scale of the lane never reaches the content.
  if (route.margin >= 80) expect(points.some((p) => p.k > 0.95), `${width}px: with margins this wide the drawing should be at full size`);
}
expect(buildRoute({ width: 80, sections: [] }) === null && buildRoute({ width: 1000, sections: [] }) === null, 'a page with no sections has no route');

// ---- The component stays a decoration ----
const component = read('src/components/HomeJourney.astro');
const markup = component.replace(/^---[\s\S]*?---/, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '');
const style = (/<style[^>]*>([\s\S]*?)<\/style>/.exec(component) ?? [])[1] ?? '';
const script = (/<script[^>]*>([\s\S]*?)<\/script>/.exec(component) ?? [])[1] ?? '';
expect(/\baria-hidden="true"/.test(markup.split('<svg')[0]), 'the wrapper must have aria-hidden="true"');
const textNodes = [...markup.matchAll(/>([^<]*)</g)].map((m) => m[1].trim()).filter(Boolean);
expect(textNodes.length === 0, `the component must have no text, found: ${textNodes.slice(0, 3).join(' | ')}`);
expect(!/<(text|tspan|title|desc|a|button|input|select|textarea|img|image|foreignObject|iframe)\b/i.test(markup), 'the component must have no text, links, buttons, images or inputs');
expect(!/\b(tabindex|contenteditable|alt|aria-label|aria-labelledby|role|onclick|data-astro-reload)\s*=/i.test(markup), 'the component must have nothing to focus or announce');
expect([...markup.matchAll(/\bhref="([^"]*)"/g)].every((m) => m[1].startsWith('#')), 'the only href allowed is a reference inside the drawing');
expect(/pointer-events:\s*none/.test(style) && /position:\s*absolute/.test(style) && /inset:\s*0/.test(style), 'the drawing must be absolute, over the whole wrapper, and ignore the pointer');
expect(/prefers-reduced-motion:\s*reduce/.test(style) && /prefers-reduced-motion:\s*reduce/.test(script), 'reduced motion must be handled in the style and in the script');
expect(/addEventListener\('scroll',\s*onScroll,\s*\{\s*passive:\s*true\s*\}\)/.test(script), 'the scroll listener must be passive');
expect(/ResizeObserver/.test(script) && /requestAnimationFrame/.test(script) && /getPointAtLength/.test(script), 'the script must follow the size of the page and draw on the path');
expect(!/\bnode:|require\(|process\./.test(script) && !/https?:\/\//.test(component.replace(/xmlns="[^"]*"/g, '').replace(/'http:\/\/www\.w3\.org\/2000\/svg'/g, '')), 'no Node built-ins and no outside address in the component');
expect(!/color-scheme|prefers-color-scheme:\s*dark/.test(style) || /data-theme/.test(style), 'the drawing must follow the theme of the page');
expect(/data-theme='light'|data-theme="light"/.test(style) && /prefers-color-scheme:\s*light/.test(style), 'the drawing must have its colors for the light theme');

// ---- Used once on the home page, which the three languages share ----
const home = read('src/components/Home.astro');
expect((home.match(/<HomeJourney\b/g) ?? []).length === 1 && /import HomeJourney from '\.\/HomeJourney\.astro'/.test(home), 'Home.astro must use HomeJourney exactly once');
expect(home.lastIndexOf('<HomeJourney') < home.indexOf('</main>') && home.lastIndexOf('<HomeJourney') > home.indexOf('<main'), 'HomeJourney must be inside <main>');
for (const page of ['src/pages/index.astro', 'src/pages/es/index.astro', 'src/pages/pt-br/index.astro']) expect(/<Home\b/.test(read(page)), `${page} must use the shared Home component`);
for (const file of ['src/pages/index.astro', 'src/pages/es/index.astro', 'src/pages/pt-br/index.astro']) expect(!/HomeJourney/.test(read(file)), `${file} must not use the drawing on its own`);

if (problems.length) { console.error([...new Set(problems)].slice(0, 40).join('\n')); process.exit(1); }
console.log('Checked the home journey: the states, the route at 7 widths, and the component.');
