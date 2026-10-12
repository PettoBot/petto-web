import { Pool } from 'pg';

/**
 * Shortcut to the database for the Node (Discloud) build.
 *
 * The dashboard asks the bot API for table rows with PostgREST-style requests. When the site runs next to the database, this answers
 * them straight from PostgreSQL: reads (the simple ones) and writes (insert, upsert, update and delete with a filter). Everything it
 * does not understand goes to the API exactly as before: counts of other kinds, nested selects, `and` filters, an update or delete with
 * no filter. If the database cannot be reached, the request goes to the API too, and for a short while the API is used straight away.
 * A write is only sent to the API when the database could not be reached before the statement was sent, so it is never done twice.
 * The SQL mirrors the bot's own translation (src/web/dashboardDatabase.js and src/db/postgres.js).
 */

const IDENTIFIER = /^[a-z_][a-z0-9_]*$/i;
const OPERATORS: Record<string, string> = { eq: '=', neq: '<>', gt: '>', gte: '>=', lt: '<', lte: '<=', like: 'LIKE', ilike: 'ILIKE' };
const RESERVED = new Set(['select', 'order', 'limit', 'offset']);

class Unsupported extends Error {}

const quote = (name: string) => {
  if (!IDENTIFIER.test(name)) throw new Unsupported('identifier');
  return `"${name}"`;
};

type Parsed = { text: string; values: unknown[]; countOnly: boolean; windowCount: boolean; start: number; ticketLabels: { dropCategoryId: boolean } | null };
type Options = { countExact: boolean; head: boolean; range: { from: number; to: number } | null };

/** One alternative of an `or=(a.eq.1,b.eq.2)` filter, read the way the bot's API reads it. */
function orCondition(part: string, values: unknown[]): string {
  const [column, operator, ...rest] = part.split('.');
  if (!column || !operator || !OPERATORS[operator.toLowerCase()] && operator.toLowerCase() !== 'is') throw new Unsupported('or');
  return condition(column, `${operator}.${rest.join('.')}`, values);
}

function condition(column: string, raw: string, values: unknown[]): string {
  let text = raw;
  const negated = /^not\./i.test(text);
  if (negated) text = text.slice(4);
  const match = /^([a-z]+)\.(.*)$/i.exec(text);
  if (!match) throw new Unsupported('filter');
  const operator = match[1].toLowerCase();
  const operand = match[2];
  const name = quote(column);
  let sql: string;

  if (operator === 'in') {
    if (!operand.startsWith('(') || !operand.endsWith(')')) throw new Unsupported('in');
    const list = operand.slice(1, -1).split(',').map((entry) => entry.trim()).filter(Boolean).map((entry) => entry.replace(/^"(.*)"$/, '$1'));
    if (!list.length) sql = 'FALSE';
    else sql = `${name} IN (${list.map((entry) => { values.push(entry); return `$${values.length}`; }).join(', ')})`;
  } else if (operator === 'is') {
    const word = operand.toLowerCase();
    if (word === 'null') sql = `${name} IS NULL`;
    else if (word === 'true') sql = `${name} IS TRUE`;
    else if (word === 'false') sql = `${name} IS FALSE`;
    else throw new Unsupported('is');
  } else if (OPERATORS[operator]) {
    if (operand === 'null' && operator === 'eq') sql = `${name} IS NULL`;
    else if (operand === 'null' && operator === 'neq') sql = `${name} IS NOT NULL`;
    else {
      values.push(operand);
      sql = `${name} ${OPERATORS[operator]} $${values.length}`;
    }
  } else {
    throw new Unsupported('operator');
  }
  return negated ? `NOT (${sql})` : sql;
}

/** The filters of a request as a WHERE clause (or nothing), read the way the bot's API reads them. */
function whereFrom(params: URLSearchParams, values: unknown[], ignore: Set<string> = RESERVED): string {
  const where: string[] = [];
  for (const [column, raw] of params) {
    if (ignore.has(column)) continue;
    if (column === 'or') {
      const alternatives = raw.replace(/^\((.*)\)$/, '$1').split(',').map((part) => part.trim()).filter(Boolean).map((part) => orCondition(part, values));
      where.push(alternatives.length ? `(${alternatives.join(' OR ')})` : 'FALSE');
      continue;
    }
    if (column === 'and' || column.startsWith('not.')) throw new Unsupported('logic');
    where.push(condition(column, raw, values));
  }
  return where.length ? ` WHERE ${where.join(' AND ')}` : '';
}

function build(table: string, params: URLSearchParams, options: Options = { countExact: false, head: false, range: null }): Parsed {
  const values: unknown[] = [];
  const seen = new Set<string>();
  for (const key of params.keys()) {
    if (seen.has(key)) throw new Unsupported('duplicate');
    seen.add(key);
  }

  const select = (params.get('select') ?? '*').trim();
  let columns = '*';
  let ticketLabels: Parsed['ticketLabels'] = null;
  if (select !== '*') {
    // The one nested read the bot's API supports, `ticket_categories(label)` on tickets, is answered the way it does:
    // the ticket rows first, then the labels of their categories.
    const parts = select.split(',').map((part) => part.trim());
    const embed = parts.filter((part) => part === 'ticket_categories(label)');
    if (embed.length > 1 || (embed.length === 1 && table !== 'tickets')) throw new Unsupported('embed');
    const list = parts.filter((part) => part !== 'ticket_categories(label)');
    if (list.some((part) => part === '*' || !IDENTIFIER.test(part))) throw new Unsupported('select');
    if (embed.length === 1) {
      ticketLabels = { dropCategoryId: !list.includes('category_id') };
      if (ticketLabels.dropCategoryId) list.push('category_id');
    }
    if (!list.length) throw new Unsupported('select');
    columns = list.map(quote).join(', ');
  }

  const whereSql = whereFrom(params, values);

  let order = '';
  const orders = (params.get('order') ?? '').split(',').map((part) => part.trim()).filter(Boolean);
  if (orders.length) {
    order = ` ORDER BY ${orders.map((entry) => {
      const [column, direction = 'asc'] = entry.split('.');
      if (!['asc', 'desc'].includes(direction.toLowerCase())) throw new Unsupported('order');
      return `${quote(column)} ${direction.toLowerCase() === 'desc' ? 'DESC' : 'ASC'}`;
    }).join(', ')}`;
  }

  // A range comes from the Range header, or from offset and limit together (the API reads both the same way, without a cap).
  let range = options.range;
  const limitRaw = params.get('limit');
  const offsetRaw = params.get('offset');
  const limit = Number(limitRaw);
  const offset = Number(offsetRaw);
  if (!range && offsetRaw !== null) {
    if (!(Number.isInteger(offset) && offset >= 0 && Number.isInteger(limit) && limit > 0)) throw new Unsupported('offset');
    range = { from: offset, to: offset + limit - 1 };
  }
  let paging = '';
  if (range) paging = ` LIMIT ${Math.max(0, range.to - range.from + 1)} OFFSET ${range.from}`;
  else if (limitRaw !== null) paging = ` LIMIT ${Math.min(1000, Math.max(0, limit || 0))}`;

  const table_ = `"public".${quote(table)}`;
  if (options.countExact && options.head) {
    return { text: `SELECT COUNT(*)::int AS count FROM ${table_}${whereSql}`, values, countOnly: true, windowCount: false, start: range?.from ?? 0, ticketLabels };
  }
  const selected = options.countExact ? `${columns}, COUNT(*) OVER()::int AS "__petto_total_count"` : columns;
  return { text: `SELECT ${selected} FROM ${table_}${whereSql}${order}${paging}`, values, countOnly: false, windowCount: options.countExact, start: range?.from ?? 0, ticketLabels };
}

function headerOf(init: RequestInit | undefined, input: unknown, name: string): string | null {
  const source = init?.headers ?? (typeof input === 'object' && input && 'headers' in input ? (input as Request).headers : undefined);
  if (!source) return null;
  return new Headers(source as HeadersInit).get(name);
}

let pool: Pool | null = null;

function getPool(): Pool | null {
  if (pool) return pool;
  const url = (process.env.PETTO_DATABASE_URL || process.env.DISCLOUD_DATABASE_URL || '').trim();
  if (!url) return null;
  const ssl = /^(1|true|yes|on)$/i.test(process.env.PETTO_DATABASE_SSL ?? '');
  let connectionString = url;
  if (!ssl) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.delete('sslmode');
      connectionString = parsed.toString();
    } catch { /* pg reports a malformed URL itself */ }
  }
  // A dashboard page reads up to twenty tables at once, so the pool is large enough for a few pages together, and a couple of
  // connections stay open (and alive) so the first page after a quiet while does not pay for opening them.
  const max = Math.max(1, Math.min(100, Number(process.env.PETTO_DATABASE_POOL_MAX) || 15));
  pool = new Pool({
    connectionString,
    ssl: ssl ? { rejectUnauthorized: false } : false,
    max,
    min: Math.min(2, max),
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 600_000,
    keepAlive: true,
    statement_timeout: 8000,
    allowExitOnIdle: true,
  });
  pool.on('error', () => { /* a dropped idle connection must not crash the site */ });
  return pool;
}

/** Opens the connections kept ready, at boot, so the first page does not wait for them. */
function warmPool(db: Pool): void {
  const ready = Math.min(2, Number(db.options.max) || 2);
  Promise.all(Array.from({ length: ready }, () => db.query('select 1'))).catch((error) => {
    if (isConnectionError(error)) markUnreachable(error);
  });
}

/**
 * A read the bot's API cannot express (an aggregate), straight from the database. Null when there is no database or it fails,
 * and the caller then reads the rows through the API as before.
 */
export async function queryDirect<T = Record<string, unknown>>(text: string, values: unknown[]): Promise<T[] | null> {
  const db = getPool();
  if (!db || blocked()) return null;
  try {
    return (await db.query(text, values)).rows as T[];
  } catch (error) {
    if (isConnectionError(error)) markUnreachable(error);
    else console.warn('[direct-db] aggregate read failed, using the bot API:', (error as Error)?.message);
    return null;
  }
}

// After a dashboard write, the bot drops its own short-lived copy of that table's settings for the server (petto:invalidate).
async function announceWrite(table: string, body: unknown, target: URL): Promise<void> {
  const fromBody = (Array.isArray(body) ? body[0] : body) as Record<string, unknown> | undefined;
  const fromFilter = /^eq\.(\d{5,25})$/.exec(target.searchParams.get('guild_id') ?? '')?.[1];
  const guildId = String(fromBody?.guild_id ?? fromFilter ?? '');
  if (!/^\d{5,25}$/.test(guildId)) return;
  const { sharedPublish } = await import('./sharedCache');
  await sharedPublish('petto:invalidate', JSON.stringify({ table, guildId }));
}

/** A failure to reach the database (as opposed to the database refusing a statement). */
function isConnectionError(error: unknown): boolean {
  const code = String((error as { code?: unknown })?.code ?? '');
  const message = String((error as Error)?.message ?? '');
  return ['ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT', 'EAI_AGAIN', 'ECONNRESET', 'EHOSTUNREACH', 'EPIPE'].includes(code) || /timeout|terminated|ECONN|ENOTFOUND/i.test(message);
}

// While the database cannot be reached, requests go straight to the bot API for a short while instead of each one waiting for the
// connection to fail first.
const BREAKER_MS = 30_000;
let blockedUntil = 0;
const blocked = () => Date.now() < blockedUntil;
const markUnreachable = (error: unknown) => {
  blockedUntil = Date.now() + BREAKER_MS;
  console.warn('[direct-db] not reachable, using the bot API for the next', BREAKER_MS / 1000, 'seconds:', (error as Error)?.message);
};

// The driver sends a JavaScript array as a PostgreSQL array, which a json or jsonb column refuses, so arrays for those columns go as JSON
// (the bot's API does the same). The column types are read once per table.
const jsonColumnCache = new Map<string, { columns: Set<string>; expiresAt: number }>();
async function jsonColumnsOf(db: { query: (text: string, values?: unknown[]) => Promise<{ rows: any[] }> }, table: string): Promise<Set<string>> {
  const hit = jsonColumnCache.get(table);
  if (hit && hit.expiresAt > Date.now()) return hit.columns;
  const result = await db.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND data_type IN ('json', 'jsonb')", [table]);
  const columns = new Set<string>(result.rows.map((row) => row.column_name));
  jsonColumnCache.set(table, { columns, expiresAt: Date.now() + 10 * 60_000 });
  return columns;
}

type Write = { text: string; values: unknown[]; table: string; method: 'POST' | 'PATCH' | 'DELETE'; representation: boolean };

/** A write of the dashboard (insert, upsert, update, delete) as SQL, the way the bot's API builds it. Anything it does not know is left to the API. */
function buildWrite(table: string, method: 'POST' | 'PATCH' | 'DELETE', params: URLSearchParams, body: unknown, preferences: string[], jsonColumns: Set<string>): Write {
  const allowed = method === 'POST' ? new Set(['on_conflict']) : new Set<string>();
  for (const key of params.keys()) {
    if (key === 'select' && (params.get('select') ?? '*').trim() === '*') continue;
    if (allowed.has(key) || key === 'or') continue;
    if (RESERVED.has(key) || key === 'columns' || key === 'on_conflict') throw new Unsupported('write parameter');
  }
  const merge = preferences.includes('resolution=merge-duplicates');
  const representation = preferences.includes('return=representation');
  if (!preferences.every((part) => part === 'return=representation' || part === 'return=minimal' || part === 'resolution=merge-duplicates')) throw new Unsupported('prefer');
  if (merge && method !== 'POST') throw new Unsupported('prefer');

  const values: unknown[] = [];
  const add = (value: unknown) => { values.push(value); return `$${values.length}`; };
  const jsonSafe = (row: Record<string, unknown>) => {
    const copy: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      if (value === undefined) continue;
      copy[key] = Array.isArray(value) && jsonColumns.has(key) ? JSON.stringify(value) : value;
    }
    return copy;
  };
  const target = `"public".${quote(table)}`;
  const returning = ' RETURNING *';

  if (method === 'POST') {
    const rows = Array.isArray(body) ? body : [body];
    if (!rows.length || rows.some((row) => !row || typeof row !== 'object' || Array.isArray(row))) throw new Unsupported('rows');
    const prepared = rows.map((row) => jsonSafe(row as Record<string, unknown>));
    const columns = [...new Set(prepared.flatMap((row) => Object.keys(row)))];
    if (!columns.length) throw new Unsupported('empty');
    const tuples = prepared.map((row) => `(${columns.map((column) => add(row[column] === undefined ? null : row[column])).join(', ')})`).join(', ');
    let text = `INSERT INTO ${target} (${columns.map(quote).join(', ')}) VALUES ${tuples}`;
    if (merge) {
      const conflict = (params.get('on_conflict') ?? '').split(',').map((column) => column.trim()).filter(Boolean);
      const updates = columns.filter((column) => !conflict.includes(column));
      const on = conflict.length ? ` (${conflict.map(quote).join(', ')})` : '';
      text += on ? (updates.length ? ` ON CONFLICT${on} DO UPDATE SET ${updates.map((column) => `${quote(column)} = EXCLUDED.${quote(column)}`).join(', ')}` : ` ON CONFLICT${on} DO NOTHING`) : ' ON CONFLICT DO NOTHING';
    }
    return { text: text + returning, values, table, method, representation };
  }

  // An update or a delete without a filter would touch every row; that is left to the API.
  const where = whereFrom(params, values, new Set(['select']));
  if (!where) throw new Unsupported('no filter');
  if (method === 'PATCH') {
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Unsupported('rows');
    const prepared = jsonSafe(body as Record<string, unknown>);
    const keys = Object.keys(prepared);
    if (!keys.length) throw new Unsupported('empty');
    // The filters were read first, so their numbers come first; the new values are numbered after them.
    const assignments = keys.map((key) => `${quote(key)} = ${add(prepared[key])}`);
    return { text: `UPDATE ${target} SET ${assignments.join(', ')}${where}${returning}`, values, table, method, representation };
  }
  return { text: `DELETE FROM ${target}${where}${returning}`, values, table, method, representation };
}

let installed = false;

/**
 * A write of the dashboard answered straight from the database, with the answers of the bot's API (201 for an insert, 204 or the rows for an
 * update or delete, 409 for a value that is already taken, 400 for any other refusal). Returns null when the API has to answer: something it
 * does not understand, or the database could not be reached before the statement was sent. Once the statement has been sent it is never sent
 * again through the API, so a write cannot be done twice.
 */
async function writeDirect(target: string, method: 'POST' | 'PATCH' | 'DELETE', init: RequestInit | undefined, input: unknown): Promise<Response | null> {
  const url = new URL(target);
  const table = url.pathname.slice('/rest/v1/'.length);
  if (!IDENTIFIER.test(table) || (method !== 'DELETE' && typeof init?.body !== 'string')) return null;
  let body: unknown;
  try { body = typeof init?.body === 'string' && init.body.length ? JSON.parse(init.body) : undefined; } catch { return null; }
  const preferences = (headerOf(init, input, 'prefer') ?? '').split(',').map((part) => part.trim()).filter(Boolean);

  const db = getPool()!;
  let client;
  try {
    client = await db.connect();
  } catch (error) {
    markUnreachable(error);
    return null;
  }
  try {
    let write: Write;
    try {
      write = buildWrite(table, method, url.searchParams, body, preferences, await jsonColumnsOf(client, table));
    } catch (error) {
      if (error instanceof Unsupported) return null;
      if (isConnectionError(error)) { markUnreachable(error); return null; }
      return null;
    }
    const headers: Record<string, string> = { 'content-type': 'application/json', 'x-petto-source': 'database' };
    try {
      const result = await client.query(write.text, write.values);
      void announceWrite(table, body, url).catch(() => {});
      if (!write.representation) return new Response(null, { status: method === 'POST' ? 201 : 204, headers });
      return new Response(JSON.stringify(result.rows), { status: method === 'POST' ? 201 : 200, headers });
    } catch (error) {
      const code = String((error as { code?: unknown })?.code ?? '');
      // The statement was sent: the database's answer is the answer, with the same codes as the API.
      console.warn(`[direct-db] ${method} ${table} refused:`, code || (error as Error)?.message);
      return new Response(JSON.stringify({ code: code || 'dashboard_database_error', message: 'Database request could not be completed.' }), { status: code === '23505' ? 409 : 400, headers });
    }
  } finally {
    client.release();
  }
}

/** Wraps fetch once; does nothing unless a database URL and the bot API address are both configured. */
export function installDirectDatabase(): void {
  if (installed) return;
  const apiBase = (process.env.PETTO_BOT_API_URL || '').replace(/\/+$/, '');
  if (!apiBase || !getPool()) return;
  installed = true;
  warmPool(getPool()!);

  const prefix = `${apiBase}/rest/v1/`;
  const original = globalThis.fetch.bind(globalThis);

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      if (blocked()) return original(input, init);
      const target = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const method = (init?.method ?? (typeof input === 'object' && 'method' in input ? input.method : 'GET')).toUpperCase();
      if ((method === 'POST' || method === 'PATCH' || method === 'DELETE') && target.startsWith(prefix)) {
        const written = await writeDirect(target, method, init, input);
        if (written) return written;
      }
      if ((method === 'GET' || method === 'HEAD') && target.startsWith(prefix) && !init?.body) {
        const preferences = (headerOf(init, input, 'prefer') ?? '').split(',').map((part) => part.trim()).filter(Boolean);
        const accept = headerOf(init, input, 'accept') ?? '';
        const countExact = preferences.includes('count=exact');
        const rangeHeader = headerOf(init, input, 'range');
        const rangeMatch = rangeHeader ? /^(\d+)-(\d+)$/.exec(rangeHeader.trim()) : null;
        // Anything else asked of the API (other counts, a Range that is not plain, an object answer) is left to the API.
        if (preferences.every((part) => part === 'count=exact') && !accept.includes('pgrst') && (!rangeHeader || rangeMatch)) {
          const url = new URL(target);
          const table = url.pathname.slice('/rest/v1/'.length);
          if (IDENTIFIER.test(table)) {
            const range = rangeMatch ? { from: Number(rangeMatch[1]), to: Number(rangeMatch[2]) } : null;
            const head = method === 'HEAD';
            const built = build(table, url.searchParams, { countExact, head, range });
            const result = await getPool()!.query(built.text, built.values);
            let rows: any[] = result.rows;
            let total: number | null = null;
            if (built.countOnly) { total = Number(result.rows[0]?.count || 0); rows = []; }
            else if (built.windowCount) {
              total = Number(rows[0]?.__petto_total_count || 0);
              rows = rows.map(({ __petto_total_count: _count, ...row }) => row);
            }
            if (built.ticketLabels && !head) {
              const ids = [...new Set(rows.map((row) => Number(row.category_id)).filter((id) => Number.isSafeInteger(id) && id > 0))];
              const labels = new Map<string, { label: unknown }>();
              if (ids.length) {
                const found = await getPool()!.query(`SELECT "id", "label" FROM "public"."ticket_categories" WHERE "id" = ANY($1::bigint[])`, [ids]);
                for (const category of found.rows) labels.set(String(category.id), { label: category.label });
              }
              rows = rows.map((row) => {
                const { category_id: categoryId, ...rest } = row;
                return { ...(built.ticketLabels!.dropCategoryId ? rest : row), ticket_categories: labels.get(String(categoryId)) ?? null };
              });
            }
            // The same answer the bot's API gives: 206 with a Content-Range when a range or a count was asked for.
            const hasRange = Boolean(range) || (url.searchParams.get('offset') !== null);
            const returned = head ? 0 : rows.length;
            const end = returned ? built.start + returned - 1 : built.start;
            const headers: Record<string, string> = { 'content-type': 'application/json', 'x-petto-source': 'database', 'content-range': `${built.start}-${end}/${total === null ? '*' : total}` };
            const status = hasRange || countExact ? 206 : 200;
            return new Response(head ? null : JSON.stringify(rows), { status, headers });
          }
        }
      }
    } catch (error) {
      if (!(error instanceof Unsupported)) {
        if (isConnectionError(error)) markUnreachable(error);
        else console.warn('[direct-db] falling back to the bot API:', (error as Error)?.message);
      }
    }
    return original(input, init);
  }) as typeof fetch;
}

/** For the owner's health page: is the database reachable from here, how fast, and does the bot's saved copy of the servers have its columns. */
export async function checkDirectDatabase(): Promise<Record<string, unknown>> {
  const db = getPool();
  if (!db) return { configured: false, note: 'PETTO_DATABASE_URL is not set, every read goes through the bot API.' };
  const started = Date.now();
  try {
    await db.query('select 1');
    const pingMs = Date.now() - started;
    const copyStarted = Date.now();
    const rows = await db.query('select count(*)::int as n from discord_guild_snapshots');
    const copyMs = Date.now() - copyStarted;
    let columns = 'ok';
    try { await db.query('select banner, emoji_count, premium_tier, boost_count, bot_nick, bot_avatar from discord_guild_snapshots limit 1'); } catch (error) { columns = `missing: ${String((error as Error).message).slice(0, 120)}`; }
    return { configured: true, installed, ok: true, pingMs, savedServers: rows.rows[0]?.n ?? 0, savedServersMs: copyMs, columns };
  } catch (error) {
    return { configured: true, installed, ok: false, error: String((error as Error).message).slice(0, 200) };
  }
}

export const __test = { build };
