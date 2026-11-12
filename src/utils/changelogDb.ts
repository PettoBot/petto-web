// The changelog that the team writes in the dashboard: reads and writes the `site_changelog` table of the bot's database (see petto-bot src/db/schema.sql), the same way the credits
// and the partners do. What the public changelog shows is the entries written in src/i18n/ui.ts with the published ones of this table on top (src/utils/changelogStore.mjs).
import { getEnv } from './env';
import { canEditPartners } from './partners';
import { toEntry } from './changelogStore.mjs';

export interface ChangelogRow {
  version: string;
  name: string;
  release_date: string;
  published: boolean;
  content: Record<string, { notices?: { kind: string; title: string; text: string }[]; items?: string[] }>;
  updated_by?: string | null;
  updated_at?: string;
}

/** The owner and anybody on the team (any position), like the credits and the partners. */
export const canEditChangelog = canEditPartners;

function api(astro: any) {
  const url = getEnv(astro, 'PETTO_BOT_API_URL')?.replace(/\/+$/, '');
  const key = getEnv(astro, 'PETTO_BOT_API_SECRET');
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}`, 'X-Petto-Dashboard-Key': key, Accept: 'application/json', 'Content-Type': 'application/json' } } : null;
}

/** Every saved version (drafts too), newest first, or null when the table cannot be read. */
export async function readRows(astro: any, onlyPublished = false): Promise<ChangelogRow[] | null> {
  const config = api(astro);
  if (!config) return null;
  try {
    const res = await fetch(`${config.url}/rest/v1/site_changelog?select=*&order=release_date.desc,version.desc&limit=500${onlyPublished ? '&published=eq.true' : ''}`, { headers: config.headers });
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) ? (rows as ChangelogRow[]) : null;
  } catch {
    return null;
  }
}

// The public pages ask on every request, so the answer is kept for a minute (and kept longer when the table cannot be read, so a hiccup never empties the page).
let cache: { at: number; rows: ChangelogRow[] } | null = null;
const FRESH_MS = 60_000;

/** The published versions of the table, in a language, as entries of the changelog. Never throws: when the table cannot be read it is the last answer, or nothing. */
export async function publishedEntries(astro: any, lang: 'en' | 'es' | 'pt') {
  if (!cache || Date.now() - cache.at > FRESH_MS) {
    const rows = await readRows(astro, true);
    if (rows) cache = { at: Date.now(), rows };
    else if (cache) cache = { at: Date.now() - FRESH_MS + 10_000, rows: cache.rows }; // try again in 10 seconds, show the old ones meanwhile
  }
  return (cache?.rows ?? []).map((row) => toEntry(row, lang));
}

export type SaveResult = { ok: true } | { ok: false; error: 'not_configured' | 'database' };

/** Saves (inserts or replaces) a version. */
export async function saveRow(astro: any, row: Omit<ChangelogRow, 'updated_by' | 'updated_at'>, userId: string): Promise<SaveResult> {
  const config = api(astro);
  if (!config) return { ok: false, error: 'not_configured' };
  try {
    const res = await fetch(`${config.url}/rest/v1/site_changelog?on_conflict=version`, {
      method: 'POST',
      headers: { ...config.headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ ...row, updated_by: userId, updated_at: new Date().toISOString() }),
    });
    cache = null;
    return res.ok ? { ok: true } : { ok: false, error: 'database' };
  } catch {
    return { ok: false, error: 'database' };
  }
}

/** Takes a version out of the table (the one written in the code, if there is one, shows again). */
export async function deleteRow(astro: any, version: string): Promise<SaveResult> {
  const config = api(astro);
  if (!config) return { ok: false, error: 'not_configured' };
  try {
    const res = await fetch(`${config.url}/rest/v1/site_changelog?version=eq.${encodeURIComponent(version)}`, { method: 'DELETE', headers: { ...config.headers, Prefer: 'return=minimal' } });
    cache = null;
    return res.ok ? { ok: true } : { ok: false, error: 'database' };
  } catch {
    return { ok: false, error: 'database' };
  }
}
