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

type Parsed = { text: string; values: unknown[] };

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

function build(table: string, params: URLSearchParams): Parsed {
  const values: unknown[] = [];
  const seen = new Set<string>();
  for (const key of params.keys()) {
    if (seen.has(key)) throw new Unsupported('duplicate');
    seen.add(key);
  }

  const select = (params.get('select') ?? '*').trim();
  let columns = '*';
  if (select !== '*') {
    const list = select.split(',').map((part) => part.trim());
    if (list.some((part) => part === '*' || !IDENTIFIER.test(part))) throw new Unsupported('select');
    columns = list.map(quote).join(', ');
  }

  const where: string[] = [];
  for (const [column, raw] of params) {
    if (RESERVED.has(column)) continue;
    if (column === 'or' || column === 'and' || column.startsWith('not.')) throw new Unsupported('logic');
    where.push(condition(column, raw, values));
  }

  let order = '';
  const orders = (params.get('order') ?? '').split(',').map((part) => part.trim()).filter(Boolean);
  if (orders.length) {
    order = ` ORDER BY ${orders.map((entry) => {
      const [column, direction = 'asc'] = entry.split('.');
      if (!['asc', 'desc'].includes(direction.toLowerCase())) throw new Unsupported('order');
      return `${quote(column)} ${direction.toLowerCase() === 'desc' ? 'DESC' : 'ASC'}`;
    }).join(', ')}`;
  }

  let paging = '';
  const limitRaw = params.get('limit');
  const offsetRaw = params.get('offset');
  const limit = Number(limitRaw);
  const offset = Number(offsetRaw);
  if (offsetRaw !== null && Number.isInteger(offset) && offset >= 0 && Number.isInteger(limit) && limit > 0) {
    // The API treats offset and limit together as a range, without its own cap.
    paging = ` LIMIT ${limit} OFFSET ${offset}`;
  } else if (offsetRaw !== null) {
    throw new Unsupported('offset');
  } else if (limitRaw !== null) {
    paging = ` LIMIT ${Math.min(1000, Math.max(0, limit || 0))}`;
  }

  const text = `SELECT ${columns} FROM "public".${quote(table)}${where.length ? ` WHERE ${where.join(' AND ')}` : ''}${order}${paging}`;
  return { text, values };
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
      if (method === 'GET' && target.startsWith(prefix) && !init?.body) {
        const prefer = headerOf(init, input, 'prefer') ?? '';
        const accept = headerOf(init, input, 'accept') ?? '';
        if (!/count=/i.test(prefer) && !accept.includes('pgrst') && !headerOf(init, input, 'range')) {
          const url = new URL(target);
          const table = url.pathname.slice('/rest/v1/'.length);
          if (IDENTIFIER.test(table)) {
            const { text, values } = build(table, url.searchParams);
            const result = await getPool()!.query(text, values);
            return new Response(JSON.stringify(result.rows), { status: 200, headers: { 'content-type': 'application/json', 'x-petto-source': 'database' } });
          }
        }
      }
    } catch (error) {
      if (!(error instanceof Unsupported)) console.warn('[direct-db] falling back to the bot API:', (error as Error)?.message);
    }
    return original(input, init);
  }) as typeof fetch;
}

export const __test = { build };
