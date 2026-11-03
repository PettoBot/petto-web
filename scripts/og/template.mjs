// The look of a preview card (1200x630): the dark warm background with soft glows, the glowing 3D mascot, a big headline, a tagline, chips, and on the
// right a small dark-glass screen that matches the page. Pure functions from data to HTML; scripts/og/render.mjs draws it with a browser at build time.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ph = require('@iconify-json/ph/icons.json');

export const WIDTH = 1200;
export const HEIGHT = 630;

const esc = (text) => String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** An inline Phosphor icon (the same set the site uses), colored by the text color of its parent. */
export function icon(name, size = 32) {
  const key = String(name).replace(/^ph:/, '');
  const found = ph.icons[key];
  if (!found) throw new Error(`The icon ph:${key} does not exist`);
  return `<svg width="${size}" height="${size}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">${found.body}</svg>`;
}

const HUES = {
  peach: ['#ffd0bf', '#f08a6c'], gold: ['#ffe3a6', '#f3b24d'], pink: ['#ffb3dc', '#e445b6'], green: ['#c9f0b2', '#5fc27e'],
  blue: ['#c3dcff', '#5b8def'], red: ['#ffc0bd', '#ef5350'], purple: ['#dccbff', '#8f6bf0'],
};
const hueOf = (name) => HUES[name] ?? HUES.gold;
/** A rounded tile with an icon in a soft gradient, like the icons of the dashboard. */
const tile = (name, hue, size = 60) => {
  const [a, b] = hueOf(hue);
  return `<div class="tile" style="width:${size}px;height:${size}px;border-radius:${Math.round(size * 0.3)}px"><span style="color:${b};filter:drop-shadow(0 0 10px ${b}66)">${icon(name, Math.round(size * 0.55))}</span><i style="background:linear-gradient(135deg,${a},${b})"></i></div>`;
};

/** Text that is a name or number (a string) or written in the three languages (an object). */
const say = (value, lang) => (value && typeof value === 'object' ? value[lang] ?? value.en : value ?? '');

// What the panels say, once per language (the labels that come back in several cards).
const WORDS = {
  en: { case: 'Case', ban: 'Ban', member: 'Member', moderator: 'Moderator', reason: 'Reason', duration: 'Duration', spam: 'Repeated spam after two warnings', days: '7 days', open: 'Open', ticket: 'Open a ticket', support: 'Support', report: 'Report a member', apply: 'Apply', hello: 'Hi! How can we help?', claimed: 'Claimed by the team', level: 'Level', rank: 'Rank', xp: 'XP', toNext: 'to level 13', giveaway: 'Giveaway', prize: 'Nitro for 1 month', endsIn: 'Ends in 2 days', entries: 'entries', winners: 'winner', enter: 'Enter', servers: 'Servers', members: 'Members', overview: 'Overview', commands: 'Commands', today: 'Today', week: 'This week', messages: 'Messages', voice: 'Voice', reactions: 'Reactions', bot: 'Petto and Discord', dashboard: 'Dashboard & website', database: 'Database', ok: 'Operational', checks: 'Checks every 2 min', days90: '90 days', plan: 'Premium', month: 'month', perks: ['About twice the room', 'A few small touches', 'Everything else stays free'], pick: 'Choose a plan', leaderboard: 'Leaderboard', top: 'Top members', title: 'Title', description: 'Description', color: 'Color', send: 'Send', preview: 'Preview', section: 'Section', note: 'Plain words, no surprises', partner: 'Partner of Petto', read: 'Read' },
  es: { case: 'Caso', ban: 'Ban', member: 'Miembro', moderator: 'Moderador', reason: 'Motivo', duration: 'Duración', spam: 'Spam repetido tras dos warns', days: '7 días', open: 'Abierto', ticket: 'Abre un ticket', support: 'Soporte', report: 'Reportar a un miembro', apply: 'Postular', hello: '¡Hola! ¿En qué te ayudamos?', claimed: 'Reclamado por el equipo', level: 'Nivel', rank: 'Rango', xp: 'XP', toNext: 'para el nivel 13', giveaway: 'Sorteo', prize: 'Nitro por 1 mes', endsIn: 'Termina en 2 días', entries: 'participantes', winners: 'ganador', enter: 'Participar', servers: 'Servidores', members: 'Miembros', overview: 'Resumen', commands: 'Comandos', today: 'Hoy', week: 'Esta semana', messages: 'Mensajes', voice: 'Voz', reactions: 'Reacciones', bot: 'Petto y Discord', dashboard: 'Dashboard y web', database: 'Base de datos', ok: 'Operativo', checks: 'Comprueba cada 2 min', days90: '90 días', plan: 'Premium', month: 'mes', perks: ['Casi el doble de espacio', 'Unos pequeños detalles', 'Todo lo demás sigue gratis'], pick: 'Elige un plan', leaderboard: 'Ranking', top: 'Mejores miembros', title: 'Título', description: 'Descripción', color: 'Color', send: 'Enviar', preview: 'Vista previa', section: 'Sección', note: 'Palabras simples, sin sorpresas', partner: 'Partner de Petto', read: 'Leer' },
  'pt-BR': { case: 'Caso', ban: 'Ban', member: 'Membro', moderator: 'Moderador', reason: 'Motivo', duration: 'Duração', spam: 'Spam repetido após dois avisos', days: '7 dias', open: 'Aberto', ticket: 'Abra um ticket', support: 'Suporte', report: 'Denunciar um membro', apply: 'Candidatar-se', hello: 'Oi! Como podemos ajudar?', claimed: 'Assumido pela equipe', level: 'Nível', rank: 'Rank', xp: 'XP', toNext: 'para o nível 13', giveaway: 'Sorteio', prize: 'Nitro por 1 mês', endsIn: 'Termina em 2 dias', entries: 'participantes', winners: 'vencedor', enter: 'Participar', servers: 'Servidores', members: 'Membros', overview: 'Resumo', commands: 'Comandos', today: 'Hoje', week: 'Esta semana', messages: 'Mensagens', voice: 'Voz', reactions: 'Reações', bot: 'Petto e Discord', dashboard: 'Dashboard e site', database: 'Banco de dados', ok: 'Operacional', checks: 'Verifica a cada 2 min', days90: '90 dias', plan: 'Premium', month: 'mês', perks: ['Quase o dobro de espaço', 'Alguns pequenos detalhes', 'Todo o resto continua grátis'], pick: 'Escolha um plano', leaderboard: 'Ranking', top: 'Melhores membros', title: 'Título', description: 'Descrição', color: 'Cor', send: 'Enviar', preview: 'Prévia', section: 'Seção', note: 'Palavras simples, sem surpresas', partner: 'Parceiro do Petto', read: 'Ler' },
};

const head = (title, sub, ic = 'ph:paw-print-fill') => `<div class="phead"><div><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</div><div class="x">${icon(ic, 26)}</div></div>`;
const row = ({ icon: ic, hue, t, s, tag, on }, lang) => `<div class="prow">${tile(ic, hue)}<div class="pt"><b>${esc(say(t, lang))}</b>${s ? `<span>${esc(say(s, lang))}</span>` : ''}</div>${on !== undefined ? `<div class="sw${on ? ' on' : ''}"><i></i></div>` : tag ? `<em class="pill">${esc(say(tag, lang))}</em>` : ''}</div>`;
const kv = (k, v, extra = '') => `<div class="kv"><span>${esc(k)}</span><b${extra}>${esc(v)}</b></div>`;

const PANELS = {
  toggles: (card, lang) => head('Petto', '', card.icon) + (card.rows ?? []).slice(0, 4).map((r) => row(r, lang)).join(''),
  list: (card, lang) => head('Petto', '', card.icon) + (card.rows ?? []).slice(0, 4).map((r) => row(r, lang)).join(''),
  case: (card, lang) => {
    const w = WORDS[lang];
    return `${head(`${w.case} #1042`, 'Petto', 'ph:gavel-fill')}<div class="badge red">${icon('ph:gavel-fill', 26)}${w.ban}</div>${kv(w.member, 'Mika')}${kv(w.moderator, 'Nova')}${kv(w.reason, w.spam)}${kv(w.duration, w.days)}<div class="btns"><span>${w.case}s</span><span>${w.preview}</span></div>`;
  },
  ticket: (card, lang) => {
    const w = WORDS[lang];
    return `${head(w.support, 'ticket-0042 · ' + w.open, 'ph:ticket-fill')}<div class="bubble"><div class="av">M</div><div><b>Mika</b><p>${esc(w.hello)}</p></div></div><div class="bubble team"><div class="av t">${icon('ph:paw-print-fill', 24)}</div><div><b>Petto</b><p>${esc(w.claimed)}</p></div></div><div class="btns"><span class="hot">${icon('ph:ticket-fill', 22)}${w.ticket}</span><span>${w.report}</span></div>`;
  },
  rank: (card, lang) => {
    const w = WORDS[lang];
    return `<div class="rankcard"><div class="rtop"><div class="rav">M</div><div><b>Mika</b><span>${w.rank} #3</span></div><div class="lvl"><small>${w.level}</small><strong>12</strong></div></div><div class="xpbar"><i style="width:68%"></i></div><div class="xpline"><span>2,480 ${w.xp}</span><span>520 ${w.xp} ${w.toNext}</span></div></div>${[['Nova', 14, 'ph:medal-fill'], ['Kai', 13, 'ph:medal-fill']].map(([n, lv, ic], i) => `<div class="prow slim"><div class="rk">${i + 1}</div><div class="pt"><b>${n}</b><span>${w.level} ${lv}</span></div><span class="gold">${icon(ic, 30)}</span></div>`).join('')}`;
  },
  giveaway: (card, lang) => {
    const w = WORDS[lang];
    return `${head(w.giveaway, w.endsIn, 'ph:gift-fill')}<div class="prize">${tile('ph:gift-fill', 'pink', 92)}<div><b>${esc(w.prize)}</b><span>1 ${esc(w.winners)} · 128 ${esc(w.entries)}</span></div></div><div class="kv"><span>${w.endsIn}</span><b>Level 5+</b></div><div class="btns"><span class="hot">${icon('ph:gift-fill', 22)}${w.enter}</span></div>`;
  },
  dash: (card, lang) => {
    const w = WORDS[lang];
    return `${head(w.overview, 'Petto', 'ph:squares-four-fill')}<div class="tiles"><div><small>${w.servers}</small><b>1</b></div><div><small>${w.members}</small><b>2,480</b></div><div><small>${w.commands}</small><b>312</b></div></div><div class="chart">${[30, 44, 38, 60, 52, 74, 66, 88, 70, 94].map((h) => `<i style="height:${h}%"></i>`).join('')}</div>${row({ icon: 'ph:shield-check-fill', hue: 'peach', t: card.chips ? say(card.chips, lang)[0] : '', s: '', on: true }, lang)}`;
  },
  status: (card, lang) => {
    const w = WORDS[lang];
    const bars = (seed) => `<div class="mbars">${Array.from({ length: 36 }, (_, i) => `<i${(i * 7 + seed) % 31 === 0 ? ' class="amber"' : ''}></i>`).join('')}</div>`;
    const svc = (name, seed) => `<div class="svc"><div class="svct"><b>${esc(name)}</b><span class="okdot"><i></i></span></div>${bars(seed)}</div>`;
    return `${head(w.days90, w.checks, 'ph:pulse-fill')}${svc(w.bot, 5)}${svc(w.dashboard, 11)}${svc(w.database, 17)}`;
  },
  article: (card, lang, extra) => {
    const post = extra?.post;
    return `<div class="art2">${post?.banner ? `<div class="artimg" style="background-image:url('${esc(post.banner)}')"></div>` : `<div class="artimg plain">${tile(card.icon, card.hue, 96)}</div>`}<div class="artbody"><em class="pill">${esc(post?.category ?? say(card.data?.category, lang))}</em>${post?.date ? `<b>${esc(post.date)}</b>` : ''}</div></div>`;
  },
  code: (card, lang) => {
    const lines = card.data?.lines ?? ['{embed}', '$title: Welcome', '{/embed}'];
    return `${head(say(card.title, lang), '', card.icon)}<div class="codebox">${lines.map((l, i) => `<div><u>${i + 1}</u><code>${esc(l)}</code></div>`).join('')}</div><div class="btns"><span class="hot">${icon('ph:copy-bold', 22)}Copy</span></div>`;
  },
  embed: (card, lang) => {
    const w = WORDS[lang];
    return `${head('Embed Builder', w.preview, 'ph:paint-brush-broad-fill')}<div class="dembed"><i></i><div><b>${esc(w.title)}</b><p>${esc(w.description)}</p><div class="chipline"><span>${w.color}</span><span>${w.send}</span></div></div></div>${kv(w.title, 'Welcome')}${kv(w.color, '#ffd45e')}`;
  },
  doc: (card, lang) => {
    const w = WORDS[lang];
    return `${head(say(card.title, lang), w.note, card.icon)}<div class="doc">${[78, 92, 64, 86, 58].map((x) => `<i style="width:${x}%"></i>`).join('')}</div>${row({ icon: 'ph:seal-check-fill', hue: card.hue, t: say(card.chips, lang)[0], s: w.note }, lang)}`;
  },
  plan: (card, lang) => {
    const w = WORDS[lang];
    return `<div class="plan"><div class="crown">${icon('ph:crown-fill', 54)}</div><b>${w.plan}</b><span>${w.pick}</span></div>${w.perks.map((p) => `<div class="perk">${icon('ph:check-circle-fill', 30)}<span>${esc(p)}</span></div>`).join('')}`;
  },
  server: (card, lang, extra) => {
    const w = WORDS[lang];
    const name = extra?.name ?? card.data?.name ?? 'Petto server';
    const iconHtml = extra?.iconData ? `<img class="sicon" src="${extra.iconData}">` : `<div class="sicon letter">${esc(String(name).slice(0, 1).toUpperCase())}</div>`;
    return `<div class="shead">${iconHtml}<div><b>${esc(name)}</b><span>${esc(extra?.line ?? w.leaderboard)}</span></div></div>${[['Mika', 'ph:crown-fill'], ['Nova', 'ph:medal-fill'], ['Kai', 'ph:medal-fill']].map(([n, ic], i) => `<div class="prow slim"><div class="rk">${i + 1}</div><div class="pt"><b>${n}</b><span>${w.level} ${14 - i * 2}</span></div><span class="gold">${icon(ic, 30)}</span></div>`).join('')}`;
  },
  stats: (card, lang) => {
    const w = WORDS[lang];
    return `${head(w.overview, w.week, 'ph:chart-bar-fill')}<div class="tiles"><div><small>${w.messages}</small><b>48k</b></div><div><small>${w.voice}</small><b>312h</b></div><div><small>${w.reactions}</small><b>9k</b></div></div><div class="chart">${[40, 55, 35, 70, 62, 48, 90, 76, 58, 84, 66, 96].map((h) => `<i style="height:${h}%"></i>`).join('')}</div>`;
  },
};

const CSS = (fontDir, publicFonts) => `
@font-face { font-family: 'BS'; src: url('file://${fontDir}/BalsamiqSans-Regular.ttf'); font-weight: 400; }
@font-face { font-family: 'BS'; src: url('file://${fontDir}/BalsamiqSans-Bold.ttf'); font-weight: 700; }
@font-face { font-family: 'PettoRound'; src: url('file://${publicFonts}/petto-round.woff2') format('woff2'); }
* { box-sizing: border-box; margin: 0; }
html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: #2a2b30; font-family: BS, sans-serif; color: #f4ece8; }
.art { position: relative; width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background:
  radial-gradient(560px 460px at 22% 92%, rgba(255,214,10,.50), transparent 70%),
  radial-gradient(680px 340px at 48% -8%, rgba(255,206,0,.30), transparent 70%),
  radial-gradient(520px 520px at 100% 100%, rgba(0,0,0,.50), transparent 70%),
  radial-gradient(420px 360px at 96% 8%, rgba(240,168,143,.22), transparent 70%),
  linear-gradient(120deg, #4b4b53, #35363c 55%, #2a2b30); }
.art::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 50%, rgba(0,0,0,.28)); pointer-events: none; }
.dots { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,.05) 1.2px, transparent 1.4px); background-size: 22px 22px; }
.brand { position: absolute; left: 64px; top: 46px; display: flex; align-items: center; gap: 12px; font: 400 27px 'PettoRound', BS, sans-serif; letter-spacing: .5px; color: #fff1c8; text-shadow: 0 2px 10px rgba(0,0,0,.4); z-index: 3; }
.brand i { display: inline-flex; width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,.1); border: 1.5px solid rgba(255,255,255,.14); align-items: center; justify-content: center; color: #ffd45e; }
.brand em { font-style: normal; opacity: .55; font-size: 22px; }
.duck { position: absolute; width: 320px; height: 320px; left: 352px; top: 366px; z-index: 1; filter: drop-shadow(0 22px 34px rgba(0,0,0,.5)); }
.halo { position: absolute; left: 290px; top: 280px; width: 460px; height: 460px; border-radius: 50%; background: radial-gradient(closest-side, rgba(255,214,10,.34), transparent); z-index: 0; }
.copy { position: absolute; left: 64px; top: 112px; width: 560px; z-index: 3; }
.copy h1 { font-weight: 700; font-size: 80px; line-height: 1.02; letter-spacing: .5px; color: #fff; text-shadow: 0 6px 24px rgba(0,0,0,.35); text-wrap: balance; }
.copy h1.m { font-size: 68px; } .copy h1.s { font-size: 54px; }
.copy p { margin-top: 20px; font-weight: 700; font-size: 29px; line-height: 1.22; color: rgba(255,255,255,.9); text-shadow: 0 3px 14px rgba(0,0,0,.4); width: 520px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.chips { position: absolute; left: 64px; bottom: 52px; width: 330px; display: flex; flex-wrap: wrap; gap: 10px; z-index: 3; }
.chips span { padding: 7px 17px; border-radius: 999px; background: rgba(255,255,255,.1); border: 1.5px solid rgba(255,255,255,.16); font-weight: 700; font-size: 21px; color: #fff1c8; backdrop-filter: blur(4px); }
.panelwrap { position: absolute; left: 672px; top: 36px; width: 488px; height: 558px; display: flex; align-items: center; z-index: 2; }
.panel { position: relative; width: 488px; padding: 28px 30px 24px; border-radius: 40px; z-index: 2; background: linear-gradient(150deg, rgba(66,60,64,.96), rgba(37,38,43,.97) 55%, rgba(30,31,36,.98)); border: 1.5px solid rgba(255,255,255,.13); box-shadow: 0 36px 70px rgba(0,0,0,.55), 0 8px 24px rgba(0,0,0,.35), inset 0 1.5px 0 rgba(255,255,255,.14), inset 0 -40px 80px rgba(0,0,0,.18); overflow: hidden; }
.panel::before { content: ''; position: absolute; left: -110px; top: -110px; width: 380px; height: 380px; border-radius: 50%; background: radial-gradient(circle, rgba(255,214,10,.26), transparent 65%); }
.panel > * { position: relative; }
.phead { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
.phead b { display: block; font-size: 38px; line-height: 1.1; color: #fff1c8; }
.phead span { display: block; font-size: 20px; color: rgba(244,236,232,.55); margin-top: 4px; }
.x { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,.1); border: 1.5px solid rgba(255,255,255,.12); display: grid; place-items: center; color: rgba(244,236,232,.8); flex: none; }
.prow { display: flex; align-items: center; gap: 16px; padding: 11px 0; }
.prow + .prow { border-top: 1.5px solid rgba(255,255,255,.05); }
.prow.slim { padding: 9px 0; }
.tile { position: relative; display: grid; place-items: center; flex: none; background: linear-gradient(160deg, rgba(255,255,255,.12), rgba(255,255,255,.04)); border: 1.5px solid rgba(255,255,255,.1); box-shadow: 0 8px 20px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.15); }
.tile i { display: none; }
.tile span { display: grid; place-items: center; }
.pt { flex: 1; min-width: 0; }
.pt b { display: block; font-size: 26px; line-height: 1.2; color: #fbf3ef; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pt span { display: block; font-size: 18px; color: rgba(244,236,232,.55); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sw { width: 70px; height: 40px; border-radius: 20px; flex: none; position: relative; background: rgba(255,255,255,.13); box-shadow: inset 0 2px 6px rgba(0,0,0,.35); }
.sw i { position: absolute; top: 5px; left: 5px; width: 30px; height: 30px; border-radius: 50%; background: #fff; box-shadow: 0 3px 8px rgba(0,0,0,.4); }
.sw.on { background: linear-gradient(135deg, #ffd45e, #f59a2f); box-shadow: 0 0 22px rgba(245,154,47,.5), inset 0 2px 6px rgba(0,0,0,.2); }
.sw.on i { left: 35px; }
.pill { font-style: normal; font-weight: 700; font-size: 18px; padding: 5px 13px; border-radius: 999px; background: rgba(255,212,94,.16); color: #ffd45e; border: 1.5px solid rgba(255,212,94,.25); flex: none; }
.kv { display: flex; justify-content: space-between; gap: 14px; padding: 12px 0; border-top: 1.5px solid rgba(255,255,255,.06); font-size: 22px; }
.kv span { color: rgba(244,236,232,.55); } .kv b { color: #fbf3ef; text-align: right; }
.badge { display: inline-flex; align-items: center; gap: 10px; padding: 8px 18px; border-radius: 999px; font-size: 24px; font-weight: 700; margin: 4px 0 8px; }
.badge.red { background: rgba(239,83,80,.18); color: #ff8f8b; border: 1.5px solid rgba(239,83,80,.35); }
.btns { display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; }
.btns span { display: inline-flex; align-items: center; gap: 9px; padding: 11px 20px; border-radius: 14px; background: rgba(255,255,255,.1); border: 1.5px solid rgba(255,255,255,.14); font-weight: 700; font-size: 21px; }
.btns .hot { background: linear-gradient(135deg, #ffd45e, #f59a2f); color: #3a2400; border: none; box-shadow: 0 0 22px rgba(245,154,47,.4); }
.bubble { display: flex; gap: 14px; align-items: flex-start; padding: 12px 0; }
.bubble b { font-size: 22px; color: #fff1c8; } .bubble p { font-size: 21px; color: rgba(244,236,232,.8); margin-top: 2px; line-height: 1.25; }
.av { width: 48px; height: 48px; flex: none; border-radius: 50%; background: linear-gradient(135deg, #c3dcff, #5b8def); display: grid; place-items: center; font-weight: 700; color: #123; font-size: 24px; }
.av.t { background: linear-gradient(135deg, #ffe3a6, #f3b24d); color: #3a2400; }
.rankcard { padding: 8px 0 16px; }
.rtop { display: flex; align-items: center; gap: 18px; }
.rav { width: 84px; height: 84px; border-radius: 50%; background: linear-gradient(135deg, #c9f0b2, #5fc27e); display: grid; place-items: center; font-size: 42px; font-weight: 700; color: #0e2a14; box-shadow: 0 0 0 4px rgba(165,234,122,.25); }
.rtop b { display: block; font-size: 36px; color: #fff1c8; } .rtop span { font-size: 22px; color: rgba(244,236,232,.55); }
.lvl { margin-left: auto; text-align: right; } .lvl small { display: block; font-size: 18px; letter-spacing: 1px; text-transform: uppercase; color: rgba(244,236,232,.55); } .lvl strong { font-size: 58px; line-height: 1; color: #a5ea7a; }
.xpbar { height: 22px; border-radius: 12px; background: rgba(255,255,255,.12); margin: 18px 0 8px; box-shadow: inset 0 2px 6px rgba(0,0,0,.35); overflow: hidden; }
.xpbar i { display: block; height: 100%; border-radius: 12px; background: linear-gradient(90deg, #a5ea7a, #5fc27e); box-shadow: 0 0 18px rgba(95,194,126,.6); }
.xpline { display: flex; justify-content: space-between; font-size: 19px; color: rgba(244,236,232,.6); }
.rk { width: 46px; height: 46px; border-radius: 14px; background: rgba(255,255,255,.1); display: grid; place-items: center; font-weight: 700; font-size: 24px; color: #ffd45e; flex: none; }
.gold { color: #ffd45e; display: grid; }
.prize { display: flex; gap: 18px; align-items: center; padding: 8px 0 14px; } .prize b { display: block; font-size: 30px; color: #fbf3ef; line-height: 1.15; } .prize span { font-size: 20px; color: rgba(244,236,232,.55); }
.tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 8px 0 14px; }
.tiles div { background: rgba(255,255,255,.07); border: 1.5px solid rgba(255,255,255,.08); border-radius: 18px; padding: 12px 14px; } .tiles small { display: block; font-size: 17px; color: rgba(244,236,232,.55); } .tiles b { font-size: 34px; color: #fff1c8; }
.chart { display: flex; align-items: flex-end; gap: 9px; height: 124px; padding: 6px 4px 0; margin-bottom: 10px; }
.chart i { flex: 1; border-radius: 7px 7px 3px 3px; background: linear-gradient(180deg, #ffd45e, #f59a2f); opacity: .9; }
.svc { padding: 10px 0 8px; } .svc + .svc { border-top: 1.5px solid rgba(255,255,255,.05); }
.svct { display: flex; justify-content: space-between; align-items: center; margin-bottom: 9px; } .svct b { font-size: 24px; color: #fbf3ef; }
.okdot { display: inline-block; } .okdot i { display: block; width: 14px; height: 14px; border-radius: 50%; background: #a5ea7a; box-shadow: 0 0 0 5px rgba(165,234,122,.22); }
.mbars { display: flex; gap: 3px; height: 34px; } .mbars i { flex: 1; border-radius: 2px; background: #a5ea7a; } .mbars i.amber { background: #fed53c; }
.art-wrap { }
.art .artcard, .artbody { }
.artimg { height: 210px; margin: -28px -30px 18px; background-size: cover; background-position: center; border-bottom: 1.5px solid rgba(255,255,255,.1); }
.artimg.plain { display: grid; place-items: center; background: linear-gradient(135deg, rgba(255,212,94,.18), rgba(240,138,108,.12)); }
.artbody { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; } .artbody b { font-size: 34px; line-height: 1.12; color: #fff1c8; } .artbody span { font-size: 21px; color: rgba(244,236,232,.55); }
.codebox { background: rgba(0,0,0,.35); border-radius: 18px; padding: 14px 16px; border: 1.5px solid rgba(255,255,255,.08); } .codebox div { display: flex; gap: 14px; font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 20px; line-height: 1.55; } .codebox u { text-decoration: none; color: rgba(244,236,232,.3); width: 22px; } .codebox code { color: #ffe3a6; white-space: pre; overflow: hidden; }
.dembed { display: flex; gap: 14px; background: rgba(0,0,0,.28); border-radius: 14px; padding: 16px; margin-bottom: 8px; } .dembed > i { width: 6px; border-radius: 4px; background: #ffd45e; flex: none; } .dembed b { font-size: 26px; color: #fff1c8; } .dembed p { font-size: 20px; color: rgba(244,236,232,.65); margin: 4px 0 10px; } .chipline { display: flex; gap: 8px; } .chipline span { font-size: 17px; padding: 4px 12px; border-radius: 8px; background: rgba(255,255,255,.1); }
.doc { padding: 10px 0 16px; display: grid; gap: 14px; } .doc i { display: block; height: 14px; border-radius: 8px; background: rgba(255,255,255,.14); }
.plan { text-align: center; padding: 4px 0 14px; } .crown { color: #ffd45e; filter: drop-shadow(0 0 20px rgba(255,212,94,.6)); } .plan b { display: block; font-size: 46px; color: #fff1c8; } .plan span { font-size: 22px; color: rgba(244,236,232,.55); }
.perk { display: flex; align-items: center; gap: 14px; padding: 11px 0; border-top: 1.5px solid rgba(255,255,255,.06); font-size: 24px; color: #fbf3ef; } .perk svg { color: #a5ea7a; flex: none; }
.shead { display: flex; align-items: center; gap: 18px; padding-bottom: 12px; } .shead b { display: block; font-size: 33px; color: #fff1c8; line-height: 1.1; } .shead span { font-size: 21px; color: rgba(244,236,232,.55); }
.sicon { width: 92px; height: 92px; border-radius: 50%; flex: none; object-fit: cover; box-shadow: 0 0 0 4px rgba(255,212,94,.3), 0 10px 24px rgba(0,0,0,.4); } .sicon.letter { display: grid; place-items: center; font-size: 46px; font-weight: 700; color: #3a2400; background: linear-gradient(135deg, #ffe3a6, #f3b24d); }
`;

/**
 * The HTML of one card.
 * @param {{ card: any, lang: 'en'|'es'|'pt-BR', title?: string, tagline?: string, chips?: string[], extra?: any, assetsDir: string, publicDir: string }} job
 */
export function cardHtml(job) {
  const { card, lang, assetsDir, publicDir } = job;
  const title = job.title ?? say(card.title, lang);
  const tagline = job.tagline ?? say(card.tagline, lang);
  const chips = (job.chips ?? card.chips?.[lang] ?? []).slice(0, 4);
  const sizeClass = title.length > 30 ? 's' : title.length > 18 ? 'm' : '';
  const panel = PANELS[card.panel];
  if (!panel) throw new Error(`There is no panel "${card.panel}"`);
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${CSS(`${assetsDir}/fonts`, `${publicDir}/fonts`)}</style></head><body>
<div class="art"><div class="dots"></div><div class="halo"></div>
<div class="brand"><i>${icon('ph:paw-print-fill', 22)}</i>Petto<em>petto.sbs</em></div>
<div class="copy"><h1 class="${sizeClass}">${esc(title)}</h1><p>${esc(tagline)}</p></div>
<img class="duck" src="file://${assetsDir}/duck3d.png">
<div class="chips">${chips.map((chip) => `<span>${esc(chip)}</span>`).join('')}</div>
<div class="panelwrap"><div class="panel">${panel(card, lang, job.extra)}</div></div>
</div></body></html>`;
}
