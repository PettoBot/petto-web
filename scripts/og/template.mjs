// The look of a preview card (1200x630): a flat pastel background with a faint pattern of tiny doodles, the logo top-left, a huge headline, a small tagline and,
// on the right, a cluster of flat stickers with thick dark outlines that mean what the page is about. All of it is drawn here, as SVG, from the data of the card
// (src/data/ogCards.mjs); scripts/og/render.mjs draws the page with a browser at build time and keeps the picture as a small WebP.
import { TONES } from '../../src/data/ogCards.mjs';

export const WIDTH = 1200;
export const HEIGHT = 630;
const INK = '#26231f';
const SOFT = '#4a4238';
const FILL = { yellow: '#FFD84D', peach: '#FFB59A', mint: '#9FE0B8', sky: '#9CCBF3', pink: '#FF9EC3', cream: '#FFF4DC', white: '#FFFFFF' };

const esc = (text) => String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---- Stickers: each one is drawn around (0, 0) in about 200 units, with thick dark outlines and flat fills ----
const line = (d, w = 6, extra = '') => `<path d="${d}" fill="none" stroke-width="${w}" ${extra}/>`;
/** A line with a dark outline and a colored core, so a thin shape still reads as a sticker. */
const outlined = (d, color, w = 12) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 8}"/><path d="${d}" fill="none" stroke="${color}" stroke-width="${w}"/>`;
const starPoints = (outer, inner, n = 5) => Array.from({ length: n * 2 }, (_, i) => { const r = i % 2 ? inner : outer; const a = (Math.PI * i) / n - Math.PI / 2; return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`; }).join(' ');

const S = {
  shield: (f = FILL.peach) => `<path d="M0-92 L78-62 V6 C78 58 42 88 0 104 C-42 88 -78 58 -78 6 V-62 Z" fill="${f}"/>${line('M-34 6 L-8 32 L36 -22', 13)}${line('M-56-46 V-6', 7, 'stroke="#fff" opacity=".85"')}`,
  gavel: () => `<rect x="-96" y="96" width="150" height="30" rx="11" fill="${FILL.cream}"/><g transform="rotate(34)"><rect x="-11" y="-40" width="22" height="146" rx="11" fill="${FILL.peach}"/><rect x="-66" y="-104" width="132" height="70" rx="20" fill="${FILL.yellow}"/>${line('M-34-98 V-40', 6)}${line('M34-98 V-40', 6)}</g>`,
  ticket: (f = FILL.yellow) => `<path d="M-104-64 H104 V-20 a20 20 0 0 0 0 40 V64 H-104 V20 a20 20 0 0 0 0-40 Z" fill="${f}"/>${line('M52-48 V48', 5, 'stroke-dasharray="2 12"')}${line('M-76-14 H8', 9)}${line('M-76 18 H-22', 9)}<path d="M78-14 l5 11 12 2 -9 8 3 12 -11-6 -11 6 3-12 -9-8 12-2Z" fill="#fff" stroke-width="4"/>`,
  bubble: (f = FILL.white, dots = true) => `<path d="M-92-50 a24 24 0 0 1 24-24 H68 a24 24 0 0 1 24 24 V22 a24 24 0 0 1-24 24 H-22 L-60 84 L-54 46 H-68 a24 24 0 0 1-24-24 Z" fill="${f}"/>${dots ? `<circle cx="-36" cy="-14" r="8" fill="${INK}"/><circle cx="0" cy="-14" r="8" fill="${INK}"/><circle cx="36" cy="-14" r="8" fill="${INK}"/>` : ''}`,
  star: (f = FILL.yellow) => `<polygon points="${starPoints(100, 46)}" fill="${f}"/>${line('M-38-34 L-18-66', 7, 'stroke="#fff" opacity=".85"')}`,
  sparkle: (f = FILL.white) => `<path d="M0-34 Q5-5 34 0 Q5 5 0 34 Q-5 5-34 0 Q-5-5 0-34Z" fill="${f}" stroke-width="5"/>`,
  rankbar: () => `<rect x="-110" y="-26" width="220" height="52" rx="26" fill="${FILL.white}"/><rect x="-104" y="-20" width="140" height="40" rx="20" fill="${FILL.mint}" stroke-width="5"/>${line('M-80-6 H0', 6, 'stroke="#fff" opacity=".8"')}`,
  trophy: () => `${line('M-58-62 H-100 V-38 C-100-6 -80 4 -54 6', 12)}${line('M58-62 H100 V-38 C100-6 80 4 54 6', 12)}<path d="M-64-84 H64 V-14 a64 64 0 0 1-128 0 Z" fill="${FILL.yellow}"/><rect x="-16" y="50" width="32" height="34" fill="${FILL.yellow}"/><rect x="-54" y="82" width="108" height="28" rx="10" fill="${FILL.peach}"/>${line('M-36-60 V-24', 7, 'stroke="#fff" opacity=".85"')}`,
  gift: (f = FILL.pink) => `<rect x="-84" y="-14" width="168" height="108" rx="12" fill="${f}"/><rect x="-96" y="-50" width="192" height="42" rx="12" fill="${FILL.cream}"/><rect x="-15" y="-50" width="30" height="144" fill="${FILL.yellow}"/><path d="M0-50 C-56-112 -98-70 -42-50Z" fill="${FILL.yellow}"/><path d="M0-50 C56-112 98-70 42-50Z" fill="${FILL.yellow}"/>${line('M-66 20 V62', 6, 'stroke="#fff" opacity=".7"')}`,
  confetti: () => `<rect x="-14" y="-8" width="26" height="12" rx="3" transform="rotate(30)" fill="${FILL.mint}" stroke-width="4"/><circle cx="46" cy="22" r="9" fill="${FILL.yellow}" stroke-width="4"/><path d="M-50 40 l16-6 -4 16Z" fill="${FILL.sky}" stroke-width="4"/><rect x="24" y="-44" width="22" height="10" rx="3" transform="rotate(-25 24 -44)" fill="${FILL.pink}" stroke-width="4"/><circle cx="-40" cy="-40" r="7" fill="${FILL.white}" stroke-width="4"/>`,
  bell: (f = FILL.yellow) => `<circle cx="0" cy="-98" r="12" fill="${f}"/><path d="M0-90 C-52-90 -64-40 -64 4 C-64 34 -82 52 -88 66 H88 C82 52 64 34 64 4 C64-40 52-90 0-90Z" fill="${f}"/><circle cx="0" cy="82" r="18" fill="${FILL.peach}"/>${line('M-40-48 C-48-30 -48-14 -48 2', 7, 'stroke="#fff" opacity=".85"')}`,
  antenna: () => `<path d="M-34 96 L0-34 L34 96Z" fill="${FILL.cream}"/>${line('M-18 50 H18', 6)}<circle cx="0" cy="-52" r="16" fill="${FILL.pink}"/>${line('M-46-84 A64 64 0 0 0 -46-20', 9)}${line('M46-84 A64 64 0 0 1 46-20', 9)}${line('M-76-104 A96 96 0 0 0 -76 0', 9)}${line('M76-104 A96 96 0 0 1 76 0', 9)}`,
  browser: () => `<rect x="-112" y="-84" width="224" height="168" rx="20" fill="${FILL.white}"/>${line('M-112-46 H112', 6)}<circle cx="-86" cy="-65" r="7" fill="${FILL.pink}" stroke-width="4"/><circle cx="-64" cy="-65" r="7" fill="${FILL.yellow}" stroke-width="4"/><circle cx="-42" cy="-65" r="7" fill="${FILL.mint}" stroke-width="4"/>${[0, 1, 2].map((i) => `<rect x="-88" y="${-26 + i * 36}" width="58" height="24" rx="12" fill="${i === 1 ? FILL.white : FILL.yellow}" stroke-width="5"/><circle cx="${i === 1 ? -76 : -42}" cy="${-14 + i * 36}" r="8" fill="${i === 1 ? FILL.cream : FILL.white}" stroke-width="4"/>${line(`M-6 ${-14 + i * 36} H${60 - i * 14}`, 7)}`).join('')}`,
  slash: (f = FILL.yellow) => `<path d="M-84-52 a24 24 0 0 1 24-24 H60 a24 24 0 0 1 24 24 V28 a24 24 0 0 1-24 24 H-12 L-46 84 L-42 52 H-60 a24 24 0 0 1-24-24 Z" fill="${f}"/>${line('M16-46 L-14 22', 17)}`,
  terminal: () => `<rect x="-106" y="-62" width="212" height="124" rx="18" fill="#3b362f"/>${line('M-106-28 H106', 5)}<circle cx="-82" cy="-45" r="6" fill="${FILL.pink}" stroke-width="3"/><circle cx="-62" cy="-45" r="6" fill="${FILL.yellow}" stroke-width="3"/><circle cx="-42" cy="-45" r="6" fill="${FILL.mint}" stroke-width="3"/>${line('M-84 0 L-62 16 L-84 32', 8, `stroke="${FILL.yellow}"`)}${line('M-44 34 H20', 8, 'stroke="#fff"')}`,
  pulse: () => `<rect x="-124" y="-70" width="248" height="140" rx="26" fill="${FILL.white}"/>${line('M-96 6 H-58 L-40-34 L-16 38 L6-46 L26 6 H96', 9)}`,
  dot: (f = FILL.mint) => `<circle r="22" fill="${f}"/><path d="M-9 0 L-3 7 L10-7" fill="none" stroke-width="5"/>`,
  rings: () => `${outlined('M-14 0 m-54 0 a54 54 0 1 0 108 0 a54 54 0 1 0 -108 0', FILL.pink, 14)}${outlined('M14 0 m-54 0 a54 54 0 1 0 108 0 a54 54 0 1 0 -108 0', FILL.yellow, 14)}`,
  crown: () => `<path d="M-92 60 L-104-46 L-48 8 L0-76 L48 8 L104-46 L92 60Z" fill="${FILL.yellow}"/><rect x="-94" y="58" width="188" height="28" rx="10" fill="${FILL.peach}"/><circle cx="-104" cy="-52" r="10" fill="${FILL.pink}" stroke-width="5"/><circle cx="0" cy="-84" r="11" fill="${FILL.pink}" stroke-width="5"/><circle cx="104" cy="-52" r="10" fill="${FILL.pink}" stroke-width="5"/>${line('M-52 22 L-30-22', 7, 'stroke="#fff" opacity=".85"')}`,
  chart: () => `<rect x="-110" y="-84" width="220" height="168" rx="20" fill="${FILL.white}"/>${[[-76, 34, FILL.yellow], [-34, 62, FILL.peach], [8, 92, FILL.mint], [50, 118, FILL.sky]].map(([x, h, c]) => `<rect x="${x}" y="${64 - h}" width="30" height="${h}" rx="6" fill="${c}" stroke-width="5"/>`).join('')}${line('M-92 70 H92', 6)}`,
  braces: (text = '{ }', f = FILL.yellow) => `<rect x="-84" y="-84" width="168" height="168" rx="34" fill="${f}"/><text x="0" y="26" text-anchor="middle" font-family="BS" font-weight="700" font-size="92" fill="${INK}" stroke="none">${esc(text)}</text>`,
  doc: (f = FILL.white, seal = true) => `<path d="M-72-96 H30 L74-52 V96 H-72Z" fill="${f}"/>${line('M30-96 V-52 H74', 6)}${line('M-46-30 H34', 8)}${line('M-46 2 H44', 8)}${line('M-46 34 H14', 8)}${seal ? `<circle cx="42" cy="74" r="28" fill="${FILL.yellow}"/>${line('M30 74 L40 84 L56 64', 7)}` : ''}`,
  clock: () => `<circle r="86" fill="${FILL.white}"/>${[0, 90, 180, 270].map((a) => `<path d="M0-72 V-60" stroke-width="7" transform="rotate(${a})"/>`).join('')}${line('M0 0 V-48', 9)}${line('M0 0 L34 20', 9)}<circle r="9" fill="${INK}"/>`,
  cookie: () => `<circle r="86" fill="${FILL.peach}"/><ellipse cx="-28" cy="-30" rx="13" ry="10" fill="#7a4a35" stroke-width="4"/><ellipse cx="30" cy="-12" rx="13" ry="10" fill="#7a4a35" stroke-width="4"/><ellipse cx="-8" cy="30" rx="13" ry="10" fill="#7a4a35" stroke-width="4"/><ellipse cx="44" cy="44" rx="10" ry="8" fill="#7a4a35" stroke-width="4"/><ellipse cx="-50" cy="24" rx="10" ry="8" fill="#7a4a35" stroke-width="4"/>${line('M-60-56 Q-40-72 -14-76', 7, 'stroke="#fff" opacity=".85"')}`,
  heart: (f = FILL.pink) => `<path d="M0 84 C-112 12 -84-72 -32-64 C-10-60 0-44 0-34 C0-44 10-60 32-64 C84-72 112 12 0 84Z" fill="${f}"/>${line('M-62-30 Q-60-46 -44-48', 7, 'stroke="#fff" opacity=".85"')}`,
  pin: () => `<path d="M0 100 C-58 34 -70 12 -70-22 A70 70 0 0 1 70-22 C70 12 58 34 0 100Z" fill="${FILL.pink}"/><circle cy="-24" r="26" fill="${FILL.white}"/>`,
  flag: () => `${line('M-50 100 V-96', 11)}<path d="M-46-92 H86 L56-52 L86-12 H-46Z" fill="${FILL.yellow}"/>${line('M-18-70 H34', 7, 'stroke="#fff" opacity=".85"')}`,
  podium: () => `<rect x="-120" y="10" width="76" height="84" rx="10" fill="${FILL.peach}"/><rect x="-38" y="-30" width="76" height="124" rx="10" fill="${FILL.yellow}"/><rect x="44" y="30" width="76" height="64" rx="10" fill="${FILL.mint}"/><text x="-82" y="66" text-anchor="middle" font-family="BS" font-weight="700" font-size="44" fill="${INK}" stroke="none">2</text><text x="0" y="40" text-anchor="middle" font-family="BS" font-weight="700" font-size="54" fill="${INK}" stroke="none">1</text><text x="82" y="78" text-anchor="middle" font-family="BS" font-weight="700" font-size="40" fill="${INK}" stroke="none">3</text>`,
  snowflake: () => `<circle r="86" fill="${FILL.white}"/>${[0, 60, 120].map((a) => `<g transform="rotate(${a})">${line('M0-64 V64', 8, `stroke="${FILL.sky}"`)}${line('M-18-44 L0-26 L18-44', 7, `stroke="${FILL.sky}"`)}${line('M-18 44 L0 26 L18 44', 7, `stroke="${FILL.sky}"`)}</g>`).join('')}<circle r="10" fill="${FILL.sky}" stroke-width="5"/>`,
  palette: () => `<path d="M0-84 C58-84 100-48 100 4 C100 38 74 44 56 38 C36 32 28 52 44 66 C60 80 40 92 0 92 C-60 92 -100 48 -100 0 C-100-48 -56-84 0-84Z" fill="${FILL.white}"/><circle cx="-48" cy="-16" r="15" fill="${FILL.pink}" stroke-width="5"/><circle cx="-14" cy="-50" r="15" fill="${FILL.yellow}" stroke-width="5"/><circle cx="30" cy="-44" r="15" fill="${FILL.mint}" stroke-width="5"/><circle cx="-40" cy="36" r="15" fill="${FILL.sky}" stroke-width="5"/>`,
  question: (text = '?', f = FILL.white) => `<path d="M-84-52 a24 24 0 0 1 24-24 H60 a24 24 0 0 1 24 24 V28 a24 24 0 0 1-24 24 H-12 L-46 84 L-42 52 H-60 a24 24 0 0 1-24-24 Z" fill="${f}"/><text x="0" y="22" text-anchor="middle" font-family="BS" font-weight="700" font-size="88" fill="${INK}" stroke="none">${esc(text)}</text>`,
  lock: () => `${line('M-38-8 V-40 a38 38 0 0 1 76 0 V-8', 16)}<rect x="-64" y="-10" width="128" height="96" rx="20" fill="${FILL.yellow}"/><circle cy="30" r="13" fill="${INK}"/>${line('M0 36 V58', 9)}`,
  plug: () => `<rect x="-72" y="-40" width="26" height="54" rx="8" fill="${FILL.cream}"/><rect x="-6" y="-40" width="26" height="54" rx="8" fill="${FILL.cream}"/><rect x="-92" y="6" width="130" height="74" rx="26" fill="${FILL.sky}"/>${line('M-26 80 C-26 130 40 100 60 130', 14)}${line('M-70 28 H-22', 7, 'stroke="#fff" opacity=".8"')}`,
  newspaper: () => `<rect x="-104" y="-80" width="208" height="160" rx="14" fill="${FILL.white}"/><rect x="-82" y="-58" width="164" height="30" rx="6" fill="${FILL.yellow}"/><rect x="-82" y="-10" width="70" height="56" rx="6" fill="${FILL.sky}"/>${line('M0-4 H80', 8)}${line('M0 20 H80', 8)}${line('M0 44 H52', 8)}${line('M-82 66 H82', 7)}`,
  pencil: () => `<g transform="rotate(35)"><rect x="-17" y="-100" width="34" height="150" rx="8" fill="${FILL.yellow}"/><rect x="-17" y="-100" width="34" height="30" rx="8" fill="${FILL.pink}"/><path d="M-17 50 L0 100 L17 50Z" fill="${FILL.cream}"/><path d="M-6 82 L0 100 L6 82Z" fill="${INK}"/></g>`,
  chain: () => `<g transform="rotate(-35)">${outlined('M-58-22 H-6 a22 22 0 0 1 0 44 H-58 a22 22 0 0 1 0-44Z', FILL.mint, 14)}${outlined('M6-22 H58 a22 22 0 0 1 0 44 H6 a22 22 0 0 1 0-44Z', FILL.yellow, 14)}</g>`,
  receipt: () => `<path d="M-64-96 H64 V92 L43 76 L21 92 L0 76 L-21 92 L-43 76 L-64 92Z" fill="${FILL.white}"/>${line('M-38-58 H38', 8)}${line('M-38-26 H38', 8)}${line('M-38 6 H8', 8)}<circle cx="30" cy="40" r="17" fill="${FILL.mint}" stroke-width="5"/>${line('M22 40 L28 46 L38 34', 5)}`,
  list: () => `<rect x="-90" y="-100" width="180" height="200" rx="18" fill="${FILL.white}"/>${[0, 1, 2].map((i) => `<circle cx="-56" cy="${-56 + i * 52}" r="12" fill="${[FILL.mint, FILL.yellow, FILL.pink][i]}" stroke-width="5"/>${line(`M-30 ${-56 + i * 52} H58`, 8)}`).join('')}`,
  avatar: (f = FILL.sky) => `<circle r="50" fill="${f}"/><circle cy="-10" r="18" fill="${FILL.white}" stroke-width="5"/><path d="M-30 40 C-30 14 30 14 30 40" fill="${FILL.white}" stroke-width="5"/>`,
  arrowup: () => `<rect x="-60" y="-60" width="120" height="120" rx="30" fill="${FILL.yellow}"/>${line('M0 34 V-30 M-28 -4 L0-34 L28-4', 12)}`,
  trail: (d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 16"/>`,
};

/** The duck as a sticker: the flat mascot with a white cut-out border and a soft flat shadow. */
const duck = (href) => `<image href="${href}" x="-110" y="-110" width="220" height="220" style="filter: drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(4px 4px 0 #fff) drop-shadow(-4px -4px 0 #fff) drop-shadow(4px -4px 0 #fff) drop-shadow(-4px 4px 0 #fff) drop-shadow(0 7px 0 rgba(38,35,31,.18))"/>`;

/** Puts a sticker at (x, y) with a scale and a tilt. */
const put = (svg, x, y, scale = 1, rotate = 0) => `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${scale})" stroke="${INK}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">${svg}</g>`;
const spark = (x, y, scale = 1, fill = FILL.white) => put(S.sparkle(fill), x, y, scale);

// ---- Scenes: what each kind of page shows, in an area of 560 x 570 (the right of the card) ----
const SCENES = {
  home: (c) => [S.trail('M110 120 C190 40 330 60 380 150'), S.trail('M250 470 C330 540 470 520 500 430'),
    put(duck(c.duck), 290, 300, 1.75), put(S.shield(FILL.peach), 100, 130, 0.62, -8), put(S.ticket(FILL.sky), 450, 118, 0.62, 8), put(S.star(), 470, 480, 0.55, 10), put(S.bubble(FILL.white), 90, 470, 0.5, -6), spark(520, 270, 0.9, FILL.yellow), spark(60, 300, 0.7), spark(330, 40, 0.6, FILL.pink)],
  moderation: (c) => [S.trail('M90 420 C150 500 300 520 380 460'), put(S.shield(FILL.peach), 250, 250, 1.75, -4), put(S.gavel(), 430, 420, 0.9, 6), put(duck(c.duck), 110, 450, 0.7), spark(460, 100, 1, FILL.yellow), spark(90, 110, 0.8), spark(520, 260, 0.6, FILL.pink)],
  protection: (c) => [S.trail('M80 130 C130 40 260 30 330 80'), put(S.shield(FILL.mint), 270, 260, 1.7, 4), put(S.lock(), 440, 440, 0.8, -8), put(duck(c.duck), 110, 430, 0.7), spark(470, 120, 0.9, FILL.yellow), spark(60, 260, 0.7), spark(520, 300, 0.6, FILL.pink)],
  tickets: (c) => [S.trail('M80 400 C150 520 330 540 430 470'), put(S.ticket(FILL.yellow), 270, 220, 1.75, -7), put(S.bubble(FILL.white), 400, 420, 1.0, 6), put(duck(c.duck), 110, 440, 0.7), spark(480, 90, 0.9, FILL.pink), spark(80, 100, 0.7), spark(30, 300, 0.6, FILL.yellow)],
  levels: (c) => [S.trail('M90 500 C170 560 330 560 410 500'), put(S.star(FILL.yellow), 270, 200, 1.45, -6), put(S.rankbar(), 280, 400, 1.2), put(S.trophy(), 450, 470, 0.7, 6), put(duck(c.duck), 100, 440, 0.65), spark(70, 100, 0.8, FILL.pink), spark(490, 90, 0.8), spark(520, 300, 0.6, FILL.yellow)],
  giveaways: (c) => [S.trail('M60 300 C100 120 230 60 330 100'), put(S.gift(FILL.pink), 280, 300, 1.6, -4), put(S.confetti(), 160, 130, 1.4), put(S.confetti(), 440, 160, 1.4, 90), put(duck(c.duck), 450, 470, 0.7, 6), put(S.star(FILL.yellow), 90, 450, 0.4, -8), spark(500, 300, 0.8, FILL.yellow)],
  plug: (c) => [S.trail('M100 120 C160 40 330 40 400 110'), put(S.plug(), 250, 290, 1.5, -12), put(S.bubble(FILL.white), 440, 150, 0.7, 8), put(S.slash(FILL.yellow), 440, 440, 0.7, -6), put(duck(c.duck), 100, 450, 0.6), spark(70, 250, 0.8, FILL.pink), spark(510, 300, 0.7)],
  feeds: (c) => [S.trail('M80 450 C150 540 330 540 400 470'), put(S.bell(), 210, 270, 1.5, -10), put(S.antenna(), 430, 250, 1.1, 6), put(duck(c.duck), 440, 470, 0.65), spark(90, 110, 0.9, FILL.yellow), spark(340, 70, 0.7), spark(70, 480, 0.6, FILL.pink)],
  community: (c) => [S.trail('M100 120 C200 40 330 60 390 140'), put(S.bubble(FILL.white), 190, 200, 1.1, -6), put(S.bubble(FILL.mint, false), 390, 300, 1.1, 6), put(S.heart(), 330, 120, 0.55, 10), put(duck(c.duck), 150, 440, 0.8), put(S.star(), 460, 470, 0.4, 8), spark(500, 80, 0.8, FILL.yellow)],
  stats: (c) => [S.trail('M80 120 C150 50 300 60 360 130'), put(S.chart(), 270, 280, 1.7, -3), put(S.star(), 460, 110, 0.5, 10), put(duck(c.duck), 120, 470, 0.7), spark(70, 250, 0.8, FILL.yellow), spark(510, 400, 0.8, FILL.pink)],
  code: (c) => [S.trail('M90 470 C170 540 340 530 410 470'), put(S.braces('{ }', FILL.yellow), 230, 220, 1.45, -6), put(S.terminal(), 380, 430, 1.05, 5), put(S.braces('< >', FILL.sky), 470, 110, 0.6, 8), put(duck(c.duck), 100, 440, 0.6), spark(60, 100, 0.8, FILL.pink), spark(520, 270, 0.7)],
  commands: (c) => [S.trail('M80 130 C130 40 300 40 370 100'), put(S.slash(FILL.yellow), 250, 230, 1.6, -5), put(S.terminal(), 380, 440, 1.0, 5), put(duck(c.duck), 100, 440, 0.6), spark(470, 90, 0.9, FILL.pink), spark(70, 280, 0.7)],
  premium: (c) => [S.trail('M80 130 C130 40 270 40 340 100'), put(S.crown(), 270, 250, 1.8, -4), put(duck(c.duck), 130, 450, 0.75, -4), put(S.star(FILL.pink), 450, 440, 0.5, 8), spark(480, 90, 1, FILL.yellow), spark(70, 250, 0.8), spark(520, 300, 0.7, FILL.pink)],
  dashboard: (c) => [S.trail('M80 440 C150 540 330 540 410 470'), put(S.browser(), 270, 250, 1.7, -3), put(S.shield(FILL.peach), 460, 450, 0.5, 8), put(duck(c.duck), 110, 450, 0.65), spark(480, 90, 0.9, FILL.yellow), spark(60, 120, 0.7, FILL.pink)],
  status: (c) => [S.trail('M80 140 C140 40 300 40 360 110'), put(S.pulse(), 280, 230, 1.7, -3), put(S.dot(FILL.mint), 190, 420, 1.6), put(S.dot(FILL.mint), 290, 420, 1.6), put(S.dot(FILL.mint), 390, 420, 1.6), put(duck(c.duck), 460, 480, 0.55), spark(70, 300, 0.7, FILL.yellow), spark(510, 110, 0.8)],
  podium: (c) => [S.trail('M80 140 C140 40 300 40 360 110'), put(S.podium(), 270, 340, 1.6), put(S.star(), 280, 110, 0.55, -6), put(duck(c.duck), 450, 130, 0.6, 6), spark(80, 230, 0.8, FILL.pink), spark(510, 300, 0.7)],
  partners: (c) => [S.trail('M100 120 C180 40 340 60 400 130'), put(S.rings(), 280, 260, 1.9, -8), put(duck(c.duck), 120, 450, 0.75, -4), put(S.heart(), 450, 440, 0.45, 8), spark(490, 100, 0.9, FILL.yellow), spark(60, 250, 0.7)],
  team: (c) => [S.trail('M90 130 C180 50 330 60 400 130'), put(S.avatar(FILL.sky), 150, 230, 1.0), put(S.avatar(FILL.mint), 400, 230, 1.0), put(duck(c.duck), 275, 330, 1.2), put(S.heart(), 275, 130, 0.45, 0), put(S.star(), 450, 460, 0.4, 8), spark(80, 420, 0.8, FILL.yellow), spark(500, 360, 0.7, FILL.pink)],
  roadmap: (c) => [S.trail('M110 460 C150 360 260 400 300 300 C330 220 400 240 420 150'), put(S.pin(), 130, 440, 0.8, -6), put(S.flag(), 440, 190, 1.1, 4), put(duck(c.duck), 300, 440, 0.6), spark(70, 150, 0.9, FILL.yellow), spark(510, 400, 0.7, FILL.pink)],
  changelog: (c) => [S.trail('M80 140 C140 50 300 50 360 120'), put(S.list(), 260, 280, 1.5, -4), put(S.star(FILL.pink), 450, 130, 0.55, 8), put(duck(c.duck), 440, 470, 0.65), spark(70, 400, 0.8, FILL.yellow)],
  faq: (c) => [S.trail('M90 470 C170 540 330 530 410 470'), put(S.question('?', FILL.white), 230, 220, 1.5, -6), put(S.question('!', FILL.yellow), 420, 360, 1.0, 6), put(duck(c.duck), 110, 450, 0.65), spark(470, 90, 0.9, FILL.pink), spark(70, 100, 0.7)],
  feedback: (c) => [S.trail('M90 460 C170 540 330 530 400 470'), put(S.bubble(FILL.white, false), 240, 220, 1.5, -6), put(S.heart(), 240, 200, 0.55, -6), put(S.arrowup(), 440, 400, 0.9, 6), put(duck(c.duck), 110, 450, 0.65), spark(480, 100, 0.9, FILL.yellow)],
  news: (c) => [S.trail('M90 140 C160 50 300 50 370 120'), put(S.newspaper(), 270, 250, 1.7, -5), put(S.pencil(), 470, 440, 0.85, 8), put(duck(c.duck), 120, 450, 0.65), spark(480, 90, 0.9, FILL.yellow), spark(60, 270, 0.7, FILL.pink)],
  credits: (c) => [S.trail('M90 140 C160 50 300 50 370 120'), put(S.heart(), 270, 250, 1.9, -6), put(duck(c.duck), 440, 450, 0.75, 6), put(S.star(), 110, 450, 0.45, -8), spark(480, 100, 0.9, FILL.yellow), spark(60, 260, 0.8, FILL.pink)],
  brand: (c) => [S.trail('M90 140 C160 50 300 50 370 120'), put(S.palette(), 250, 250, 1.6, -6), put(duck(c.duck), 440, 400, 1.0, 6), put(S.star(), 450, 110, 0.45, 8), spark(80, 440, 0.8, FILL.yellow)],
  clock: (c) => [S.trail('M80 450 C150 540 330 540 410 470'), put(S.clock(), 270, 250, 1.8, -4), put(S.bubble(FILL.yellow, false), 450, 450, 0.55, 8), put(duck(c.duck), 110, 450, 0.65), spark(480, 90, 0.9, FILL.pink), spark(60, 130, 0.7)],
  snowflake: (c) => [S.trail('M80 450 C150 540 330 540 410 470'), put(S.snowflake(), 270, 250, 1.8, 0), put(S.braces('#', FILL.yellow), 450, 450, 0.55, 8), put(duck(c.duck), 110, 450, 0.65), spark(480, 90, 0.9, FILL.pink), spark(60, 130, 0.7)],
  chain: (c) => [S.trail('M90 140 C160 50 300 50 370 120'), put(S.chain(), 270, 250, 1.8), put(S.star(FILL.yellow), 450, 450, 0.45, 8), put(duck(c.duck), 110, 450, 0.65), spark(480, 100, 0.9, FILL.pink), spark(60, 270, 0.7)],
  doc: (c) => [S.trail('M90 140 C160 50 300 50 370 120'), put(S.doc(FILL.white, true), 260, 260, 1.8, -5), put(S.shield(FILL.mint), 450, 450, 0.5, 8), put(duck(c.duck), 110, 450, 0.65), spark(480, 100, 0.9, FILL.yellow), spark(60, 270, 0.7, FILL.pink)],
  lock: (c) => [S.trail('M90 140 C160 50 300 50 370 120'), put(S.lock(), 270, 260, 1.9, -4), put(S.shield(FILL.mint), 450, 450, 0.5, 8), put(duck(c.duck), 110, 450, 0.65), spark(480, 100, 0.9, FILL.pink), spark(60, 270, 0.7, FILL.yellow)],
  cookie: (c) => [S.trail('M90 140 C160 50 300 50 370 120'), put(S.cookie(), 270, 260, 1.9, -6), put(duck(c.duck), 440, 450, 0.7, 6), spark(480, 100, 0.9, FILL.yellow), spark(60, 270, 0.7, FILL.pink)],
  receipt: (c) => [S.trail('M90 140 C160 50 300 50 370 120'), put(S.receipt(), 260, 260, 1.8, -5), put(S.heart(), 450, 450, 0.45, 8), put(duck(c.duck), 110, 450, 0.65), spark(480, 100, 0.9, FILL.yellow), spark(60, 270, 0.7, FILL.pink)],
  /** A post of the news: a newspaper and a pencil, and the duck, around its own banner (a framed card drawn in the page, under these stickers). */
  post: (c) => [S.trail('M80 470 C160 550 330 540 400 480'),
    put(S.pencil(), 486, 66, 0.6, 12), put(S.newspaper(), 400, 440, 1.05, -6), put(duck(c.duck), 110, 450, 0.75, -4), spark(60, 130, 0.8, FILL.yellow), spark(520, 330, 0.7, FILL.pink)],
};
/** The proposal for a page of one server (a leaderboard or a partner): its own icon (the Discord one when it has one, else its first letter) and the podium. Not used by the build. */
SCENES.server = (c) => [S.trail('M90 140 C160 50 300 50 370 120'),
  `<g transform="translate(280 230)" stroke="${INK}" stroke-width="8">${c.iconHref ? `<clipPath id="sv"><circle r="112"/></clipPath><circle r="124" fill="#fff"/><image href="${esc(c.iconHref)}" x="-112" y="-112" width="224" height="224" clip-path="url(#sv)" stroke="none"/><circle r="112" fill="none" stroke-width="7"/>` : `<circle r="124" fill="#fff"/><circle r="112" fill="${FILL.sky}"/><text x="0" y="40" text-anchor="middle" font-family="BS" font-weight="700" font-size="128" fill="${INK}" stroke="none">${esc(c.initial ?? 'S')}</text>`}</g>`,
  put(S.podium(), 440, 450, 0.7, 6), put(duck(c.duck), 110, 450, 0.7, -4), put(S.crown(), 400, 100, 0.5, 14), spark(70, 250, 0.8, FILL.yellow), spark(520, 270, 0.8)];
export const ART_NAMES = Object.keys(SCENES).filter((name) => name !== 'server');

/** The faint pattern of our own doodles (sparkles, chat bubbles, stars, hearts, dotted trails) in a slightly darker tone of the background. */
const pattern = (color) => `<pattern id="pat" width="190" height="190" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><g fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
<path d="M28 34 Q31 22 43 20 Q31 18 28 6 Q25 18 13 20 Q25 22 28 34Z" transform="translate(6 18)"/>
<path d="M104 34 h34 a8 8 0 0 1 8 8 v14 a8 8 0 0 1-8 8 h-18 l-10 9 v-9 h-6 a8 8 0 0 1-8-8 v-14 a8 8 0 0 1 8-8z" transform="translate(-6 -4)"/>
<polygon points="${starPoints(13, 6)}" transform="translate(152 118)"/>
<path d="M18 138 C34 112 62 118 76 140" stroke-dasharray="1 9"/>
<path d="M104 160 m-8 0 h16 m-8 -8 v16" transform="translate(66 -88)"/>
<path d="M150 40 c-8-9-20-1-14 8 l14 12 14-12 c6-9-6-17-14-8z" transform="translate(-38 100)"/>
<circle cx="86" cy="96" r="5"/>
</g></pattern>`;

/**
 * The HTML of one card.
 * @param {{ card: { tone: string, art: string }, lang: string, title: string, tagline: string, extra?: { post?: { banner: string, date: string } }, assetsDir: string, publicDir: string }} job
 */
export function cardHtml(job) {
  const { card, assetsDir, publicDir } = job;
  const tone = TONES[card.tone] ?? TONES.butter;
  const scene = SCENES[card.art] ?? SCENES.home;
  const post = job.extra?.post ?? (job.extra?.server ? { date: job.extra.server.line, banner: '' } : undefined);
  const server = job.extra?.server;
  const art = (server ? SCENES.server : post ? SCENES.post : scene)({ duck: `file://${publicDir}/assets/duck-plain.png`, banner: post?.banner ?? '', iconHref: server?.iconHref, initial: server?.name?.[0]?.toUpperCase() }).join('');
  return `<!doctype html><html lang="${job.lang}"><head><meta charset="utf-8"><style>
@font-face { font-family: 'BS'; src: url('file://${assetsDir}/fonts/BalsamiqSans-Regular.ttf'); font-weight: 400; }
@font-face { font-family: 'BS'; src: url('file://${assetsDir}/fonts/BalsamiqSans-Bold.ttf'); font-weight: 700; }
* { box-sizing: border-box; margin: 0; }
html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; font-family: BS, sans-serif; color: ${INK}; background: ${tone.bg}; }
.card { position: relative; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: ${tone.bg}; }
.pat { position: absolute; inset: 0; }
.logo { position: absolute; left: 56px; top: 40px; display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 38px; letter-spacing: .3px; }
.logo img { width: 56px; height: 56px; }
.copy { position: absolute; left: 56px; top: 118px; width: 566px; height: 470px; display: flex; flex-direction: column; }
h1 { font-weight: 700; font-size: 124px; line-height: .98; letter-spacing: -1px; text-wrap: balance; overflow-wrap: normal; }
.tag { margin-top: 26px; font-weight: 400; font-size: 31px; line-height: 1.22; color: ${SOFT}; width: 520px; }
.chip { align-self: flex-start; margin-top: 20px; padding: 8px 22px; border-radius: 999px; border: 4px solid ${INK}; background: #fff; font-weight: 700; font-size: 28px; }
.frame { position: absolute; left: 662px; top: 120px; width: 490px; height: 222px; border: 8px solid ${INK}; border-radius: 30px; background: #fff center / cover no-repeat; transform: rotate(3deg); box-shadow: 8px 10px 0 rgba(38,35,31,.16); }
.art { position: absolute; left: 620px; top: 30px; width: 560px; height: 570px; }
</style></head><body><div class="card">
<svg class="pat" width="${WIDTH}" height="${HEIGHT}"><defs>${pattern(tone.doodle)}</defs><rect width="100%" height="100%" fill="url(#pat)"/></svg>
<div class="logo"><img src="file://${publicDir}/assets/duck-plain.png">Petto</div>
<div class="copy"><h1 id="h">${esc(job.title)}</h1><div class="tag" id="t">${esc(job.tagline)}</div>${post?.date ? `<div class="chip">${esc(post.date)}</div>` : ''}</div>
${job.extra?.post ? `<div class="frame" style="background-image:url('${esc(post.banner)}')"></div>` : ''}
<svg class="art" viewBox="0 0 560 570" width="560" height="570">${art}</svg>
</div>
<script>
// The headline is as big as it can be in its box: it shrinks until no word is cut and everything fits above the tagline. It waits for the fonts.
const h = document.getElementById('h'); const tag = document.getElementById('t');
const maxH = ${post ? 290 : 330};
document.fonts.load('700 40px BS').then(() => document.fonts.load('400 30px BS')).then(() => document.fonts.ready).then(() => {
  let size = ${post ? 96 : 128};
  const fits = () => h.scrollWidth <= h.clientWidth + 1 && h.offsetHeight <= maxH;
  h.style.fontSize = size + 'px';
  while (!fits() && size > 40) { size -= 2; h.style.fontSize = size + 'px'; }
  // The tagline stays on two lines.
  let tsize = 31; tag.style.fontSize = tsize + 'px';
  while (tag.offsetHeight > tsize * 1.22 * 2 + 2 && tsize > 22) { tsize -= 1; tag.style.fontSize = tsize + 'px'; }
  document.body.dataset.ready = '1';
});
</script></body></html>`;
}
