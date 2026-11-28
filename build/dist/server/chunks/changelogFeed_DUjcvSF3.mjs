import { u as useTranslations, l as localePath } from './ui_C1MR3LHJ.mjs';
import { g as getEnv } from './env_WnBvzCjc.mjs';
import { c as canEditPartners } from './partners_BiJzadVG.mjs';

// The rules of the changelog that the team edits in the dashboard (table `site_changelog` of the bot's database, see src/utils/changelogDb.ts): what a version, a notice and a
// change may be, how a saved version becomes the entry the public changelog draws, and how those entries join the ones written in src/i18n/ui.ts. Plain JavaScript so
// scripts/check-changelog-store.mjs runs it with node alone; nothing here reads or writes anything.

const LANGS = Object.freeze(['en', 'es', 'pt']);
const NOTICE_KINDS = Object.freeze(['security', 'warning', 'breaking', 'info']);
const LIMITS = Object.freeze({ name: 40, noticeTitle: 120, noticeText: 3000, item: 1500, notices: 5, items: 60 });
const VERSION = /^\d{1,3}\.\d{1,3}\.\d{1,3}(-\d{1,3})?$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const MONTHS$1 = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
};

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const clean = (value, max) => String(value ?? '').replace(/\r\n/g, '\n').replace(CONTROL, '').trim().slice(0, max);

/** A date as `YYYY-MM-DD`, only when it is a real day. */
function validDate(value) {
  const text = String(value ?? '');
  if (!DATE.test(text)) return null;
  const date = new Date(`${text}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === text ? text : null;
}

/** The date the way each language writes it in the changelog: "November 12, 2026", "12 de noviembre de 2026", "12 de novembro de 2026". */
function formatDate(iso, lang) {
  const day = validDate(iso);
  if (!day) return String(iso ?? '');
  const [year, month, number] = day.split('-').map(Number);
  const months = MONTHS$1[lang] ?? MONTHS$1.en;
  return lang === 'es' || lang === 'pt' ? `${number} de ${months[month - 1]} de ${year}` : `${months[month - 1]} ${number}, ${year}`;
}

/** `0.7.9-3` is shown `0.7.9~3`, as in the changelog of the bot. */
const displayVersion = (version) => String(version).replace('-', '~');

/** The notices and the changes of one language, cleaned: only real kinds, nothing empty, within the limits. */
function cleanLang(value) {
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
function validateDraft(raw) {
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
function toEntry(row, lang) {
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
function compareVersions$1(a, b) {
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
function mergeEntries(inCode, published) {
  const byVersion = new Map(inCode.map((entry) => [entry.version, entry]));
  for (const entry of published) byVersion.set(entry.version, entry);
  return [...byVersion.values()].sort((a, b) => compareVersions$1(b.version, a.version));
}

/** An entry written in the code (`notices` and `items`, the date as text) as the draft the editor opens, in the three languages given. */
function draftFromCode(isoDate, name, version, byLang) {
  const langs = {};
  for (const lang of LANGS) langs[lang] = cleanLang(byLang[lang]);
  return { version, name: name ?? '', date: validDate(isoDate) ?? '', published: true, langs };
}

const ENGLISH_DATE = /^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/;
/** The `YYYY-MM-DD` of an English date written in the code ("November 5, 2026"), or null. */
function isoFromEnglish(text) {
  const match = ENGLISH_DATE.exec(String(text ?? '').trim());
  const month = match ? MONTHS$1.en.findIndex((name) => name.toLowerCase() === match[1].toLowerCase()) : -1;
  if (!match || month < 0) return null;
  return validDate(`${match[3]}-${String(month + 1).padStart(2, '0')}-${String(Number(match[2])).padStart(2, '0')}`);
}

const canEditChangelog = canEditPartners;
function api(astro) {
  const url = getEnv(astro, "PETTO_BOT_API_URL")?.replace(/\/+$/, "");
  const key = getEnv(astro, "PETTO_BOT_API_SECRET");
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}`, "X-Petto-Dashboard-Key": key, Accept: "application/json", "Content-Type": "application/json" } } : null;
}
async function readRows(astro, onlyPublished = false) {
  const config = api(astro);
  if (!config) return null;
  try {
    const res = await fetch(`${config.url}/rest/v1/site_changelog?select=*&order=release_date.desc,version.desc&limit=500${onlyPublished ? "&published=eq.true" : ""}`, { headers: config.headers });
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? rows : null;
  } catch {
    return null;
  }
}
let cache = null;
const FRESH_MS = 6e4;
async function publishedEntries(astro, lang) {
  if (!cache || Date.now() - cache.at > FRESH_MS) {
    const rows = await readRows(astro, true);
    if (rows) cache = { at: Date.now(), rows };
    else if (cache) cache = { at: Date.now() - FRESH_MS + 1e4, rows: cache.rows };
  }
  return (cache?.rows ?? []).map((row) => toEntry(row, lang));
}
async function saveRow(astro, row, userId) {
  const config = api(astro);
  if (!config) return { ok: false, error: "not_configured" };
  try {
    const res = await fetch(`${config.url}/rest/v1/site_changelog?on_conflict=version`, {
      method: "POST",
      headers: { ...config.headers, Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ ...row, updated_by: userId, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
    });
    cache = null;
    return res.ok ? { ok: true } : { ok: false, error: "database" };
  } catch {
    return { ok: false, error: "database" };
  }
}
async function deleteRow(astro, version) {
  const config = api(astro);
  if (!config) return { ok: false, error: "not_configured" };
  try {
    const res = await fetch(`${config.url}/rest/v1/site_changelog?version=eq.${encodeURIComponent(version)}`, { method: "DELETE", headers: { ...config.headers, Prefer: "return=minimal" } });
    cache = null;
    return res.ok ? { ok: true } : { ok: false, error: "database" };
  } catch {
    return { ok: false, error: "database" };
  }
}

const SITE = "https://petto.sbs";
const RSS_LANGUAGE = { en: "en", es: "es", "pt-BR": "pt-BR" };
const MONTHS = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };
const compareVersions = compareVersions$1;
const DB_LANG = { en: "en", es: "es", "pt-BR": "pt" };
function codeEntries(lang) {
  return [...useTranslations(lang).changelogPage.entries].sort((a, b) => compareVersions(b.version, a.version));
}
async function changelogEntries(lang, astro) {
  const inCode = codeEntries(lang);
  if (!astro) return inCode;
  return mergeEntries(inCode, await publishedEntries(astro, DB_LANG[lang]));
}
function englishDate(text) {
  const match = /^([a-z]+)\s+(\d{1,2}),\s+(\d{4})$/i.exec(String(text).trim());
  const month = match ? MONTHS[match[1].toLowerCase()] : void 0;
  return match && month !== void 0 ? new Date(Date.UTC(Number(match[3]), month, Number(match[2]))) : null;
}
function plainText(text) {
  return String(text).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "$1").replace(/`/g, "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f￾￿]/g, "").replace(/\s+/g, " ").trim();
}
const clip = (text, max) => text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : text;
const cdata = (text) => `<![CDATA[${text.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
const escapeXml = (text) => plainText(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
function summary(entry) {
  const notices = (entry.notices ?? []).map((notice) => clip(plainText(`${notice.title}: ${notice.text}`), 320));
  const lines = [...notices, ...entry.items.slice(0, 3).map((item) => clip(plainText(item), 220))];
  const more = entry.items.length - Math.min(entry.items.length, 3);
  return clip(lines.join(" · "), 1e3) + (more > 0 ? ` (+${more})` : "");
}
function changelogFeedUrl(lang) {
  return `${SITE}${localePath[lang]}/changelog/rss.xml`;
}
async function changelogRss(lang, astro) {
  const page = useTranslations(lang).changelogPage;
  const base = `${SITE}${localePath[lang]}`;
  const englishDates = new Map((await changelogEntries("en", astro)).map((entry) => [entry.version, englishDate(entry.date)]));
  const entries = await changelogEntries(lang, astro);
  const fallback = /* @__PURE__ */ new Date("2026-11-28T06:46:00.632Z");
  const sameDay = /* @__PURE__ */ new Map();
  const dated = [...entries].reverse().map((entry) => {
    const day = englishDates.get(entry.version) ?? null;
    if (!day) return { entry, at: fallback };
    const seen = sameDay.get(day.getTime()) ?? 0;
    sameDay.set(day.getTime(), seen + 1);
    return { entry, at: new Date(day.getTime() + seen * 6e4) };
  }).reverse();
  const newest = dated[0]?.at ?? fallback;
  const items = dated.map(({ entry, at }) => {
    const link = `${base}/changelog/${encodeURIComponent(entry.version)}`;
    const title = `Petto ${entry.display ?? entry.version}${entry.name ? ` · ${entry.name}` : ""}`;
    return [
      "    <item>",
      `      <title>${escapeXml(title)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="false">${escapeXml(entry.version)}</guid>`,
      `      <pubDate>${at.toUTCString()}</pubDate>`,
      `      <description>${cdata(summary(entry))}</description>`,
      "    </item>"
    ].join("\n");
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(page.rssTitle)}</title>`,
    `    <link>${escapeXml(`${base}/changelog`)}</link>`,
    `    <description>${escapeXml(page.rssDescription)}</description>`,
    `    <language>${RSS_LANGUAGE[lang]}</language>`,
    `    <lastBuildDate>${newest.toUTCString()}</lastBuildDate>`,
    "    <ttl>60</ttl>",
    `    <atom:link href="${escapeXml(changelogFeedUrl(lang))}" rel="self" type="application/rss+xml" />`,
    "    <image>",
    `      <url>${SITE}/assets/mascot-icon.png</url>`,
    `      <title>${escapeXml(page.rssTitle)}</title>`,
    `      <link>${escapeXml(`${base}/changelog`)}</link>`,
    "    </image>",
    ...items,
    "  </channel>",
    "</rss>",
    ""
  ].join("\n");
}
const CHANGELOG_RSS_CACHE = "public, max-age=900, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400";
async function changelogRssResponse(lang, method = "GET", astro) {
  const body = await changelogRss(lang, astro);
  return new Response(method === "HEAD" ? null : body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": CHANGELOG_RSS_CACHE, "X-Content-Type-Options": "nosniff" }
  });
}

export { VERSION as V, changelogFeedUrl as a, changelogRssResponse as b, changelogEntries as c, canEditChangelog as d, deleteRow as e, codeEntries as f, cleanLang as g, compareVersions$1 as h, isoFromEnglish as i, validDate as j, draftFromCode as k, readRows as r, saveRow as s, validateDraft as v };
