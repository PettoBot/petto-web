// Checks that the burger and the language of the top bar do not depend on the big script of the page (src/layouts/Base.astro): they are wired by a small inline
// script written in plain old JavaScript (no `?.`, no `=>`), placed right after the menu, and the big script does not wire them a second time (two handlers on the
// same button would open and close the menu in the same tap, so it would look like it does nothing).
// Run: node scripts/check-nav-menu.mjs
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/layouts/Base.astro', import.meta.url), 'utf8');
let failed = 0;
const check = (name, ok, detail = '') => { if (!ok) { failed += 1; console.log(`FAIL ${name}${detail ? `: ${detail}` : ''}`); } };

const inlineStart = source.indexOf('<script is:inline>\n    // The burger and the language of the top bar.');
const inlineEnd = inlineStart === -1 ? -1 : source.indexOf('</script>', inlineStart);
check('the small script of the menu exists', inlineStart > -1 && inlineEnd > inlineStart);
const menu = inlineStart > -1 ? source.slice(inlineStart, inlineEnd) : '';
const code = menu.replace(/^\s*\/\/.*$/gm, '');

check('it is plain old JavaScript: no ?., no =>, no let/const/class, no template strings', !/\?\./.test(code) && !/=>/.test(code) && !/\b(let|const|class)\b/.test(code) && !/`/.test(code), (code.match(/\?\.|=>|\blet\b|\bconst\b|\bclass\b|`/) ?? [''])[0]);
new Function(code.replace(/^\s*<script[^>]*>/, '')); // it must at least parse as a script
check('it wires the burger and the language', /getElementById\('navBurger'\)/.test(code) && /getElementById\('langToggle'\)/.test(code) && /addEventListener\('click'/.test(code));
check('it opens by a tap, closes by a second tap, by Escape, by a tap outside, on a link and on resize', ['navBurger.classList.toggle', "event.key !== 'Escape'", 'setLangOpen(false)', "querySelectorAll('a')", "addEventListener('resize'", "addEventListener('pageshow'"].every((part) => code.includes(part)));
check('it blocks the scroll while the menu is open', /document\.body\.style\.overflow = !isOpen \? 'hidden' : ''/.test(code));

const menuMarkup = source.indexOf('<div class="mobile-nav" id="mobileNav">');
const slot = source.indexOf('<slot />');
check('it comes after the menu and before the page', menuMarkup > -1 && inlineStart > menuMarkup && inlineStart < slot);

const rest = source.slice(0, inlineStart) + source.slice(inlineEnd);
check('the big script does not wire the burger a second time', !/getElementById\('navBurger'\)/.test(rest.replace(/id="navBurger"/g, '')), 'navBurger is wired twice');
check('the big script does not wire the language a second time', !/getElementById\('langToggle'\)/.test(rest), 'langToggle is wired twice');
check('the big script does not call what was moved', !/\bsetLangOpen\b|\bcloseMobileNav\b|\bmnavPops\b/.test(rest));

if (failed) { console.log(`${failed} check(s) failed`); process.exit(1); }
console.log('nav menu: ok');
