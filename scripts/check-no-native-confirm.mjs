// The dashboard asks its questions with the card of DashConfirm.astro (window.dglConfirm / window.dglPrompt, or data-confirm on a button
// or a form), never with the browser's own windows ("petto.sbs says..."). This fails if confirm(, alert( or prompt( is called anywhere in the
// components, pages and React apps of the dashboard. The places that must stay native are listed here, each with the reason.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ALLOWED = {
  // The public site of appeals has its own look and language (the colors the server picked): its "withdraw" question stays the browser's.
  'src/components/AppealStatus.astro': 'public appeal site, outside the dashboard',
};

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) { if (name !== 'i18n') yield* files(path); continue; }
    if (/\.(astro|tsx?|jsx?)$/.test(name)) yield path;
  }
}

const bad = [];
for (const path of files('src')) {
  if (ALLOWED[path]) continue;
  if (path.endsWith('DashConfirm.astro')) continue;
  readFileSync(path, 'utf8').split('\n').forEach((line, index) => {
    // The words of a text ("Claim prompt (when...)") are not calls: strings are taken out first. The handlers written in the markup
    // (onsubmit="return confirm(...)") are looked at before that.
    const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '').replace(/'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g, '""');
    const inMarkup = /\bon[a-z]+=("[^"]*|\{`[^`]*)(^|[^\w.$])(window\.)?(confirm|alert|prompt)\s*\(/.test(line);
    // A call of the browser's window: confirm( alert( prompt( on their own or on window; not dglConfirm(, not a method called like that.
    if (inMarkup || /(^|[^\w.$])(window\.)?(confirm|alert|prompt)\s*\(/.test(code)) bad.push(`${path}:${index + 1}: ${line.trim().slice(0, 110)}`);
  });
}
if (bad.length) {
  console.error('The browser\'s own windows are not used in the dashboard (use window.dglConfirm, window.dglPrompt or data-confirm):\n' + bad.join('\n'));
  process.exit(1);
}
console.log('Checked that the dashboard asks with its own card: no confirm(), alert() or prompt() of the browser.');
