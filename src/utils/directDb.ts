import { Pool } from 'pg';

/**
 * Read-only shortcut to the database for the Node (Discloud) build.
 *
 * The dashboard asks the bot API for table rows with PostgREST-style GET requests. When the site runs next to
 * the database, this answers the simple ones straight from PostgreSQL and lets everything else go to the API
 * exactly as before: writes, counts, nested selects, `or` filters, ranges and anything it does not understand.
 * If the database fails for any reason, the request falls back to the API too, so this can only make reads faster.
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

  const where: string[] = [];
  for (const [column, raw] of params) {
    if (RESERVED.has(column)) continue;
    if (column === 'or') {
      const alternatives = raw.replace(/^\((.*)\)$/, '$1').split(',').map((part) => part.trim()).filter(Boolean).map((part) => orCondition(part, values));
      where.push(alternatives.length ? `(${alternatives.join(' OR ')})` : 'FALSE');
      continue;
    }
    if (column === 'and' || column.startsWith('not.')) throw new Unsupported('logic');
    where.push(condition(column, raw, values));
  }
  const whereSql = where.length ? ` WHERE ${where.join(' AND ')}` : '';

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
  pool = new Pool({
    connectionString,
    ssl: ssl ? { rejectUnauthorized: false } : false,
    max: 5,
    connectionTimeoutMillis: 3000,
    idleTimeoutMillis: 30_000,
    statement_timeout: 8000,
    allowExitOnIdle: true,
  });
  pool.on('error', () => { /* a dropped idle connection must not crash the site */ });
  return pool;
}

let installed = false;

/** Wraps fetch once; does nothing unless a database URL and the bot API address are both configured. */
export function installDirectDatabase(): void {
  if (installed) return;
  const apiBase = (process.env.PETTO_BOT_API_URL || '').replace(/\/+$/, '');
  if (!apiBase || !getPool()) return;
  installed = true;

  const prefix = `${apiBase}/rest/v1/`;
  const original = globalThis.fetch.bind(globalThis);

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const target = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const method = (init?.method ?? (typeof input === 'object' && 'method' in input ? input.method : 'GET')).toUpperCase();
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
      if (!(error instanceof Unsupported)) console.warn('[direct-db] falling back to the bot API:', (error as Error)?.message);
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
