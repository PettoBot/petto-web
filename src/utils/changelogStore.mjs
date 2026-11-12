// The rules of the changelog that the team edits in the dashboard (table `site_changelog` of the bot's database, see src/utils/changelogDb.ts): what a version, a notice and a
// change may be, how a saved version becomes the entry the public changelog draws, and how those entries join the ones written in src/i18n/ui.ts. Plain JavaScript so
// scripts/check-changelog-store.mjs runs it with node alone; nothing here reads or writes anything.

export const LANGS = Object.freeze(['en', 'es', 'pt']);
export const NOTICE_KINDS = Object.freeze(['security', 'warning', 'breaking', 'info']);
export const LIMITS = Object.freeze({ name: 40, noticeTitle: 120, noticeText: 3000, item: 1500, notices: 5, items: 60 });
export const VERSION = /^\d{1,3}\.\d{1,3}\.\d{1,3}(-\d{1,3})?$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
};

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const clean = (value, max) => String(value ?? '').replace(/\r\n/g, '\n').replace(CONTROL, '').trim().slice(0, max);

/** A date as `YYYY-MM-DD`, only when it is a real day. */
export function validDate(value) {
  const text = String(value ?? '');
  if (!DATE.test(text)) return null;
  const date = new Date(`${text}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === text ? text : null;
}

/** The date the way each language writes it in the changelog: "November 12, 2026", "12 de noviembre de 2026", "12 de novembro de 2026". */
export function formatDate(iso, lang) {
  const day = validDate(iso);
  if (!day) return String(iso ?? '');
  const [year, month, number] = day.split('-').map(Number);
  const months = MONTHS[lang] ?? MONTHS.en;
  return lang === 'es' || lang === 'pt' ? `${number} de ${months[month - 1]} de ${year}` : `${months[month - 1]} ${number}, ${year}`;
}

/** `0.7.9-3` is shown `0.7.9~3`, as in the changelog of the bot. */
export const displayVersion = (version) => String(version).replace('-', '~');

/** The notices and the changes of one language, cleaned: only real kinds, nothing empty, within the limits. */
export function cleanLang(value) {
  const notices = (Array.isArray(value?.notices) ? value.notices : [])
    .map((notice) => ({
      kind: NOTICE_KINDS.includes(String(notice?.kind)) ? String(notice.kind) : 'info',
      title: clean(notice?.title, LIMITS.noticeTitle),
      text: clean(notice?.text, LIMITS.noticeText),
    }))
    .filter((notice) => notice.title || notice.text)
    .slice(0, LIMITS.notices);
  const items = (Array.isArray(value?.items) ? value.items : []).map((item) => clean(item, LIMITS.item)).filter(Boolean).slice(0, LIMITS.items);
  return { notices, items };
}

/**
 * What the editor sent, checked. Returns `{ ok: true, row }` (ready for the table) or `{ ok: false, error }` with `version`, `date`, `empty` (the English text is missing, which
 * is what the other languages fall back to) or `invalid`.
 * @param {unknown} raw
 */
export function validateDraft(raw) {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'invalid' };
  const draft = /** @type {any} */ (raw);
  const version = String(draft.version ?? '').trim();
  if (!VERSION.test(version)) return { ok: false, error: 'version' };
  const date = validDate(draft.date);
  if (!date) return { ok: false, error: 'date' };
  const content = {};
  for (const lang of LANGS) content[lang] = cleanLang(draft.langs?.[lang]);
  if (!content.en.items.length && !content.en.notices.length) return { ok: false, error: 'empty' };
  return { ok: true, row: { version, name: clean(draft.name, LIMITS.name), release_date: date, published: draft.published === true, content } };
}

/**
 * A saved version as the entry the public changelog draws, in a language. A language with nothing written shows the English one (what is missing is never an empty page).
 * @returns {{ version: string, display: string, name: string, date: string, items: string[], notices: { kind: string, title: string, text: string }[] }}
 */
export function toEntry(row, lang) {
  const own = cleanLang(row?.content?.[lang]);
  const text = own.items.length || own.notices.length ? own : cleanLang(row?.content?.en);
  return {
    version: String(row.version),
    display: displayVersion(row.version),
    name: String(row.name ?? ''),
    date: formatDate(String(row.release_date ?? '').slice(0, 10), lang),
    items: text.items,
    notices: text.notices,
  };
}

/** `0.7.9` < `0.7.9-1` < `0.7.10`: a patch comes after the version it patches. */
export function compareVersions(a, b) {
  const parse = (version) => {
    const [main, patch] = String(version).split('-');
    return { parts: main.split('.').map((part) => Number.parseInt(part, 10) || 0), patch: patch === undefined ? -1 : Number.parseInt(patch, 10) || 0 };
  };
  const x = parse(a);
  const y = parse(b);
  for (let i = 0; i < Math.max(x.parts.length, y.parts.length); i += 1) {
    const diff = (x.parts[i] ?? 0) - (y.parts[i] ?? 0);
    if (diff) return diff;
  }
  return x.patch - y.patch;
}

/** The entries written in the code and the published ones of the table, newest first; a version in the table replaces the one of the same number in the code. */
export function mergeEntries(inCode, published) {
  const byVersion = new Map(inCode.map((entry) => [entry.version, entry]));
  for (const entry of published) byVersion.set(entry.version, entry);
  return [...byVersion.values()].sort((a, b) => compareVersions(b.version, a.version));
}

/** An entry written in the code (`notices` and `items`, the date as text) as the draft the editor opens, in the three languages given. */
export function draftFromCode(isoDate, name, version, byLang) {
  const langs = {};
  for (const lang of LANGS) langs[lang] = cleanLang(byLang[lang]);
  return { version, name: name ?? '', date: validDate(isoDate) ?? '', published: true, langs };
}

const ENGLISH_DATE = /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/;
/** The `YYYY-MM-DD` of an English date written in the code ("November 5, 2026"), or null. */
export function isoFromEnglish(text) {
  const match = ENGLISH_DATE.exec(String(text ?? '').trim());
  const month = match ? MONTHS.en.findIndex((name) => name.toLowerCase() === match[1].toLowerCase()) : -1;
  if (!match || month < 0) return null;
  return validDate(`${match[3]}-${String(month + 1).padStart(2, '0')}-${String(Number(match[2])).padStart(2, '0')}`);
}
