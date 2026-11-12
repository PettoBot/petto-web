// The RSS 2.0 feed of the changelog (/changelog/rss.xml, /es/changelog/rss.xml, /pt-br/changelog/rss.xml), built from the same entries as
// the changelog pages (src/i18n/ui.ts, changelogPage.entries), so Discord bots and feed readers can follow the releases of Petto.
import { useTranslations, localePath, type Locale } from '../i18n/ui';

const SITE = 'https://petto.sbs';
const RSS_LANGUAGE: Record<Locale, string> = { en: 'en', es: 'es', 'pt-BR': 'pt-BR' };
const MONTHS: Record<string, number> = { january: 0, february: 1, march: 2, april: 3, may: 4, june: 5, july: 6, august: 7, september: 8, october: 9, november: 10, december: 11 };

/** A block that stands out above the list of a version: a security notice (red), a warning (yellow), a change that breaks something (orange) or plain information. */
export type Notice = { kind: 'security' | 'warning' | 'breaking' | 'info' | string; title: string; text: string };
type Entry = { version: string; display?: string; name?: string; date: string; items: readonly string[]; notices?: readonly Notice[] };

/**
 * Compares two versions of the changelog: `0.7.9` < `0.7.9-1` < `0.7.10`. A patch (`-1`, shown `~1`) comes after the version it patches, and a
 * version without a patch number before any of its patches.
 */
export function compareVersions(a: string, b: string): number {
  const parse = (version: string) => {
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

/** The entries of a language, newest first. */
export function changelogEntries(lang: Locale): Entry[] {
  return [...(useTranslations(lang).changelogPage.entries as readonly Entry[])].sort((a, b) => compareVersions(b.version, a.version));
}

/** The day of an English changelog date ("October 29, 2026"), at midnight UTC (never a time still to come); null when it cannot be read. */
function englishDate(text: string): Date | null {
  const match = /^([a-z]+)\s+(\d{1,2}),\s+(\d{4})$/i.exec(String(text).trim());
  const month = match ? MONTHS[match[1].toLowerCase()] : undefined;
  return match && month !== undefined ? new Date(Date.UTC(Number(match[3]), month, Number(match[2]))) : null;
}

/** Plain text of a changelog line: no backticks, links as their words, no characters XML does not allow. */
function plainText(text: string): string {
  return String(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '$1')
    .replace(/`/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f￾￿]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…` : text);
/** Text inside CDATA: a `]]>` in it is split so it cannot end the section. */
const cdata = (text: string) => `<![CDATA[${text.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
const escapeXml = (text: string) => plainText(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** A short summary of a version: its first changes, as plain text. */
function summary(entry: Entry): string {
  // A notice comes first: someone who only reads the feed should not miss a security notice.
  const notices = (entry.notices ?? []).map((notice) => clip(plainText(`${notice.title}: ${notice.text}`), 320));
  const lines = [...notices, ...entry.items.slice(0, 3).map((item) => clip(plainText(item), 220))];
  const more = entry.items.length - Math.min(entry.items.length, 3);
  return clip(lines.join(' · '), 1000) + (more > 0 ? ` (+${more})` : '');
}

export function changelogFeedUrl(lang: Locale): string {
  return `${SITE}${localePath[lang]}/changelog/rss.xml`;
}

/** The RSS 2.0 document of the changelog in a language. */
export function changelogRss(lang: Locale): string {
  const page = useTranslations(lang).changelogPage;
  const base = `${SITE}${localePath[lang]}`;
  // The dates are read from the English entries (one format), by version; a version with no readable date takes the time of the build.
  const englishDates = new Map(changelogEntries('en').map((entry) => [entry.version, englishDate(entry.date)]));
  const entries = changelogEntries(lang);
  const fallback = new Date(__BUILD_TIME__);
  // Versions of the same day get a minute each, the newest last, so a reader that sorts by date keeps them in order.
  const sameDay = new Map<number, number>();
  const dated = [...entries].reverse().map((entry) => {
    const day = englishDates.get(entry.version) ?? null;
    if (!day) return { entry, at: fallback };
    const seen = sameDay.get(day.getTime()) ?? 0;
    sameDay.set(day.getTime(), seen + 1);
    return { entry, at: new Date(day.getTime() + seen * 60_000) };
  }).reverse();
  const newest = dated[0]?.at ?? fallback;

  const items = dated.map(({ entry, at }) => {
    const link = `${base}/changelog/${encodeURIComponent(entry.version)}`;
    const title = `Petto ${entry.display ?? entry.version}${entry.name ? ` · ${entry.name}` : ''}`;
    return [
      '    <item>',
      `      <title>${escapeXml(title)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="false">${escapeXml(entry.version)}</guid>`,
      `      <pubDate>${at.toUTCString()}</pubDate>`,
      `      <description>${cdata(summary(entry))}</description>`,
      '    </item>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(page.rssTitle)}</title>`,
    `    <link>${escapeXml(`${base}/changelog`)}</link>`,
    `    <description>${escapeXml(page.rssDescription)}</description>`,
    `    <language>${RSS_LANGUAGE[lang]}</language>`,
    `    <lastBuildDate>${newest.toUTCString()}</lastBuildDate>`,
    '    <ttl>60</ttl>',
    `    <atom:link href="${escapeXml(changelogFeedUrl(lang))}" rel="self" type="application/rss+xml" />`,
    '    <image>',
    `      <url>${SITE}/assets/mascot-icon.png</url>`,
    `      <title>${escapeXml(page.rssTitle)}</title>`,
    `      <link>${escapeXml(`${base}/changelog`)}</link>`,
    '    </image>',
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}

// Cloudflare keeps it an hour and serves the old copy while it asks again; readers check it every 15 minutes at most.
export const CHANGELOG_RSS_CACHE = 'public, max-age=900, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400';

/** The answer of a feed route. */
export function changelogRssResponse(lang: Locale, method = 'GET'): Response {
  const body = changelogRss(lang);
  return new Response(method === 'HEAD' ? null : body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': CHANGELOG_RSS_CACHE, 'X-Content-Type-Options': 'nosniff' },
  });
}
