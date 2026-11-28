import { Pool } from 'pg';

const IDENTIFIER = /^[a-z_][a-z0-9_]*$/i;
const OPERATORS = { eq: "=", neq: "<>", gt: ">", gte: ">=", lt: "<", lte: "<=", like: "LIKE", ilike: "ILIKE" };
const RESERVED = /* @__PURE__ */ new Set(["select", "order", "limit", "offset"]);
class Unsupported extends Error {
}
const quote = (name) => {
  if (!IDENTIFIER.test(name)) throw new Unsupported("identifier");
  return `"${name}"`;
};
function orCondition(part, values) {
  const [column, operator, ...rest] = part.split(".");
  if (!column || !operator || !OPERATORS[operator.toLowerCase()] && operator.toLowerCase() !== "is") throw new Unsupported("or");
  return condition(column, `${operator}.${rest.join(".")}`, values);
}
function condition(column, raw, values) {
  let text = raw;
  const negated = /^not\./i.test(text);
  if (negated) text = text.slice(4);
  const match = /^([a-z]+)\.(.*)$/i.exec(text);
  if (!match) throw new Unsupported("filter");
  const operator = match[1].toLowerCase();
  const operand = match[2];
  const name = quote(column);
  let sql;
  if (operator === "in") {
    if (!operand.startsWith("(") || !operand.endsWith(")")) throw new Unsupported("in");
    const list = operand.slice(1, -1).split(",").map((entry) => entry.trim()).filter(Boolean).map((entry) => entry.replace(/^"(.*)"$/, "$1"));
    if (!list.length) sql = "FALSE";
    else sql = `${name} IN (${list.map((entry) => {
      values.push(entry);
      return `$${values.length}`;
    }).join(", ")})`;
  } else if (operator === "is") {
    const word = operand.toLowerCase();
    if (word === "null") sql = `${name} IS NULL`;
    else if (word === "true") sql = `${name} IS TRUE`;
    else if (word === "false") sql = `${name} IS FALSE`;
    else throw new Unsupported("is");
  } else if (OPERATORS[operator]) {
    if (operand === "null" && operator === "eq") sql = `${name} IS NULL`;
    else if (operand === "null" && operator === "neq") sql = `${name} IS NOT NULL`;
    else {
      values.push(operand);
      sql = `${name} ${OPERATORS[operator]} $${values.length}`;
    }
  } else {
    throw new Unsupported("operator");
  }
  return negated ? `NOT (${sql})` : sql;
}
function whereFrom(params, values, ignore = RESERVED) {
  const where = [];
  for (const [column, raw] of params) {
    if (ignore.has(column)) continue;
    if (column === "or") {
      const alternatives = raw.replace(/^\((.*)\)$/, "$1").split(",").map((part) => part.trim()).filter(Boolean).map((part) => orCondition(part, values));
      where.push(alternatives.length ? `(${alternatives.join(" OR ")})` : "FALSE");
      continue;
    }
    if (column === "and" || column.startsWith("not.")) throw new Unsupported("logic");
    where.push(condition(column, raw, values));
  }
  return where.length ? ` WHERE ${where.join(" AND ")}` : "";
}
function build(table, params, options = { countExact: false, head: false, range: null }) {
  const values = [];
  const seen = /* @__PURE__ */ new Set();
  for (const key of params.keys()) {
    if (seen.has(key)) throw new Unsupported("duplicate");
    seen.add(key);
  }
  const select = (params.get("select") ?? "*").trim();
  let columns = "*";
  let ticketLabels = null;
  if (select !== "*") {
    const parts = select.split(",").map((part) => part.trim());
    const embed = parts.filter((part) => part === "ticket_categories(label)");
    if (embed.length > 1 || embed.length === 1 && table !== "tickets") throw new Unsupported("embed");
    const list = parts.filter((part) => part !== "ticket_categories(label)");
    if (list.some((part) => part === "*" || !IDENTIFIER.test(part))) throw new Unsupported("select");
    if (embed.length === 1) {
      ticketLabels = { dropCategoryId: !list.includes("category_id") };
      if (ticketLabels.dropCategoryId) list.push("category_id");
    }
    if (!list.length) throw new Unsupported("select");
    columns = list.map(quote).join(", ");
  }
  const whereSql = whereFrom(params, values);
  let order = "";
  const orders = (params.get("order") ?? "").split(",").map((part) => part.trim()).filter(Boolean);
  if (orders.length) {
    order = ` ORDER BY ${orders.map((entry) => {
      const [column, direction = "asc"] = entry.split(".");
      if (!["asc", "desc"].includes(direction.toLowerCase())) throw new Unsupported("order");
      return `${quote(column)} ${direction.toLowerCase() === "desc" ? "DESC" : "ASC"}`;
    }).join(", ")}`;
  }
  let range = options.range;
  const limitRaw = params.get("limit");
  const offsetRaw = params.get("offset");
  const limit = Number(limitRaw);
  const offset = Number(offsetRaw);
  if (!range && offsetRaw !== null) {
    if (!(Number.isInteger(offset) && offset >= 0 && Number.isInteger(limit) && limit > 0)) throw new Unsupported("offset");
    range = { from: offset, to: offset + limit - 1 };
  }
  let paging = "";
  if (range) paging = ` LIMIT ${Math.max(0, range.to - range.from + 1)} OFFSET ${range.from}`;
  else if (limitRaw !== null) paging = ` LIMIT ${Math.min(1e3, Math.max(0, limit || 0))}`;
  const table_ = `"public".${quote(table)}`;
  if (options.countExact && options.head) {
    return { text: `SELECT COUNT(*)::int AS count FROM ${table_}${whereSql}`, values, countOnly: true, windowCount: false, start: range?.from ?? 0, ticketLabels };
  }
  const selected = options.countExact ? `${columns}, COUNT(*) OVER()::int AS "__petto_total_count"` : columns;
  return { text: `SELECT ${selected} FROM ${table_}${whereSql}${order}${paging}`, values, countOnly: false, windowCount: options.countExact, start: range?.from ?? 0, ticketLabels };
}
function headerOf(init, input, name) {
  const source = init?.headers ?? (typeof input === "object" && input && "headers" in input ? input.headers : void 0);
  if (!source) return null;
  return new Headers(source).get(name);
}
let pool = null;
function getPool() {
  if (pool) return pool;
  const url = (process.env.PETTO_DATABASE_URL || process.env.DISCLOUD_DATABASE_URL || "").trim();
  if (!url) return null;
  const ssl = /^(1|true|yes|on)$/i.test(process.env.PETTO_DATABASE_SSL ?? "");
  let connectionString = url;
  if (!ssl) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.delete("sslmode");
      connectionString = parsed.toString();
    } catch {
    }
  }
  const max = Math.max(1, Math.min(100, Number(process.env.PETTO_DATABASE_POOL_MAX) || 15));
  pool = new Pool({
    connectionString,
    ssl: ssl ? { rejectUnauthorized: false } : false,
    max,
    min: Math.min(2, max),
    connectionTimeoutMillis: 3e3,
    idleTimeoutMillis: 6e5,
    keepAlive: true,
    statement_timeout: 8e3,
    allowExitOnIdle: true
  });
  pool.on("error", () => {
  });
  return pool;
}
function warmPool(db) {
  const ready = Math.min(2, Number(db.options.max) || 2);
  Promise.all(Array.from({ length: ready }, () => db.query("select 1"))).catch((error) => {
    if (isConnectionError(error)) markUnreachable(error);
  });
}
async function queryDirect(text, values) {
  const db = getPool();
  if (!db || blocked()) return null;
  try {
    return (await db.query(text, values)).rows;
  } catch (error) {
    if (isConnectionError(error)) markUnreachable(error);
    else console.warn("[direct-db] aggregate read failed, using the bot API:", error?.message);
    return null;
  }
}
async function probeDirect() {
  const db = getPool();
  if (!db) return { configured: false, ok: false, ms: 0 };
  const started = Date.now();
  try {
    await db.query("select updated_at from bot_host limit 1");
    return { configured: true, ok: true, ms: Date.now() - started };
  } catch (error) {
    if (isConnectionError(error)) markUnreachable(error);
    return { configured: true, ok: false, ms: Date.now() - started, detail: String(error?.code ?? error?.message ?? "error").slice(0, 40) };
  }
}
async function announceWrite(table, body, target) {
  const fromBody = Array.isArray(body) ? body[0] : body;
  const fromFilter = /^eq\.(\d{5,25})$/.exec(target.searchParams.get("guild_id") ?? "")?.[1];
  const guildId = String(fromBody?.guild_id ?? fromFilter ?? "");
  if (!/^\d{5,25}$/.test(guildId)) return;
  const { sharedPublish } = await import('./sharedCache_DFk4ml3Q.mjs');
  const { deferGuildChange } = await import('./serverTiming_CTuT9h6x.mjs');
  if (!deferGuildChange(guildId)) void import('./guildVersion_C-xSL97y.mjs').then((module) => module.bumpGuildVersion(guildId)).catch(() => {
  });
  await sharedPublish("petto:invalidate", JSON.stringify({ table, guildId }));
}
function isConnectionError(error) {
  const code = String(error?.code ?? "");
  const message = String(error?.message ?? "");
  return ["ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "EAI_AGAIN", "ECONNRESET", "EHOSTUNREACH", "EPIPE"].includes(code) || /timeout|terminated|ECONN|ENOTFOUND/i.test(message);
}
const BREAKER_MS = 3e4;
let blockedUntil = 0;
const blocked = () => Date.now() < blockedUntil;
const markUnreachable = (error) => {
  blockedUntil = Date.now() + BREAKER_MS;
  console.warn("[direct-db] not reachable, using the bot API for the next", BREAKER_MS / 1e3, "seconds:", error?.message);
};
const jsonColumnCache = /* @__PURE__ */ new Map();
async function jsonColumnsOf(db, table) {
  const hit = jsonColumnCache.get(table);
  if (hit && hit.expiresAt > Date.now()) return hit.columns;
  const result = await db.query("SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND data_type IN ('json', 'jsonb')", [table]);
  const columns = new Set(result.rows.map((row) => row.column_name));
  jsonColumnCache.set(table, { columns, expiresAt: Date.now() + 10 * 6e4 });
  return columns;
}
function buildWrite(table, method, params, body, preferences, jsonColumns) {
  const allowed = method === "POST" ? /* @__PURE__ */ new Set(["on_conflict"]) : /* @__PURE__ */ new Set();
  for (const key of params.keys()) {
    if (key === "select" && (params.get("select") ?? "*").trim() === "*") continue;
    if (allowed.has(key) || key === "or") continue;
    if (RESERVED.has(key) || key === "columns" || key === "on_conflict") throw new Unsupported("write parameter");
  }
  const merge = preferences.includes("resolution=merge-duplicates");
  const representation = preferences.includes("return=representation");
  if (!preferences.every((part) => part === "return=representation" || part === "return=minimal" || part === "resolution=merge-duplicates")) throw new Unsupported("prefer");
  if (merge && method !== "POST") throw new Unsupported("prefer");
  const values = [];
  const add = (value) => {
    values.push(value);
    return `$${values.length}`;
  };
  const jsonSafe = (row) => {
    const copy = {};
    for (const [key, value] of Object.entries(row)) {
      if (value === void 0) continue;
      copy[key] = Array.isArray(value) && jsonColumns.has(key) ? JSON.stringify(value) : value;
    }
    return copy;
  };
  const target = `"public".${quote(table)}`;
  const returning = " RETURNING *";
  if (method === "POST") {
    const rows = Array.isArray(body) ? body : [body];
    if (!rows.length || rows.some((row) => !row || typeof row !== "object" || Array.isArray(row))) throw new Unsupported("rows");
    const prepared = rows.map((row) => jsonSafe(row));
    const columns = [...new Set(prepared.flatMap((row) => Object.keys(row)))];
    if (!columns.length) throw new Unsupported("empty");
    const tuples = prepared.map((row) => `(${columns.map((column) => add(row[column] === void 0 ? null : row[column])).join(", ")})`).join(", ");
    let text = `INSERT INTO ${target} (${columns.map(quote).join(", ")}) VALUES ${tuples}`;
    if (merge) {
      const conflict = (params.get("on_conflict") ?? "").split(",").map((column) => column.trim()).filter(Boolean);
      const updates = columns.filter((column) => !conflict.includes(column));
      const on = conflict.length ? ` (${conflict.map(quote).join(", ")})` : "";
      text += on ? updates.length ? ` ON CONFLICT${on} DO UPDATE SET ${updates.map((column) => `${quote(column)} = EXCLUDED.${quote(column)}`).join(", ")}` : ` ON CONFLICT${on} DO NOTHING` : " ON CONFLICT DO NOTHING";
    }
    return { text: text + returning, values, table, method, representation };
  }
  const where = whereFrom(params, values, /* @__PURE__ */ new Set(["select"]));
  if (!where) throw new Unsupported("no filter");
  if (method === "PATCH") {
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Unsupported("rows");
    const prepared = jsonSafe(body);
    const keys = Object.keys(prepared);
    if (!keys.length) throw new Unsupported("empty");
    const assignments = keys.map((key) => `${quote(key)} = ${add(prepared[key])}`);
    return { text: `UPDATE ${target} SET ${assignments.join(", ")}${where}${returning}`, values, table, method, representation };
  }
  return { text: `DELETE FROM ${target}${where}${returning}`, values, table, method, representation };
}
let installed = false;
async function writeDirect(target, method, init, input) {
  const url = new URL(target);
  const table = url.pathname.slice("/rest/v1/".length);
  if (!IDENTIFIER.test(table) || method !== "DELETE" && typeof init?.body !== "string") return null;
  let body;
  try {
    body = typeof init?.body === "string" && init.body.length ? JSON.parse(init.body) : void 0;
  } catch {
    return null;
  }
  const preferences = (headerOf(init, input, "prefer") ?? "").split(",").map((part) => part.trim()).filter(Boolean);
  const db = getPool();
  let client;
  try {
    client = await db.connect();
  } catch (error) {
    markUnreachable(error);
    return null;
  }
  try {
    let write;
    try {
      write = buildWrite(table, method, url.searchParams, body, preferences, await jsonColumnsOf(client, table));
    } catch (error) {
      if (error instanceof Unsupported) return null;
      if (isConnectionError(error)) {
        markUnreachable(error);
        return null;
      }
      return null;
    }
    const headers = { "content-type": "application/json", "x-petto-source": "database" };
    try {
      const result = await client.query(write.text, write.values);
      void announceWrite(table, body, url).catch(() => {
      });
      if (!write.representation) return new Response(null, { status: method === "POST" ? 201 : 204, headers });
      return new Response(JSON.stringify(result.rows), { status: method === "POST" ? 201 : 200, headers });
    } catch (error) {
      const code = String(error?.code ?? "");
      console.warn(`[direct-db] ${method} ${table} refused:`, code || error?.message);
      return new Response(JSON.stringify({ code: code || "dashboard_database_error", message: "Database request could not be completed." }), { status: code === "23505" ? 409 : 400, headers });
    }
  } finally {
    client.release();
  }
}
function installDirectDatabase() {
  if (installed) return;
  const apiBase = (process.env.PETTO_BOT_API_URL || "").replace(/\/+$/, "");
  if (!apiBase || !getPool()) return;
  installed = true;
  warmPool(getPool());
  const prefix = `${apiBase}/rest/v1/`;
  const original = globalThis.fetch.bind(globalThis);
  globalThis.fetch = async (input, init) => {
    try {
      if (blocked()) return original(input, init);
      const target = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      const method = (init?.method ?? (typeof input === "object" && "method" in input ? input.method : "GET")).toUpperCase();
      if ((method === "POST" || method === "PATCH" || method === "DELETE") && target.startsWith(prefix)) {
        const written = await writeDirect(target, method, init, input);
        if (written) return written;
      }
      if ((method === "GET" || method === "HEAD") && target.startsWith(prefix) && !init?.body) {
        const preferences = (headerOf(init, input, "prefer") ?? "").split(",").map((part) => part.trim()).filter(Boolean);
        const accept = headerOf(init, input, "accept") ?? "";
        const countExact = preferences.includes("count=exact");
        const rangeHeader = headerOf(init, input, "range");
        const rangeMatch = rangeHeader ? /^(\d+)-(\d+)$/.exec(rangeHeader.trim()) : null;
        if (preferences.every((part) => part === "count=exact") && !accept.includes("pgrst") && (!rangeHeader || rangeMatch)) {
          const url = new URL(target);
          const table = url.pathname.slice("/rest/v1/".length);
          if (IDENTIFIER.test(table)) {
            const range = rangeMatch ? { from: Number(rangeMatch[1]), to: Number(rangeMatch[2]) } : null;
            const head = method === "HEAD";
            const built = build(table, url.searchParams, { countExact, head, range });
            const result = await getPool().query(built.text, built.values);
            let rows = result.rows;
            let total = null;
            if (built.countOnly) {
              total = Number(result.rows[0]?.count || 0);
              rows = [];
            } else if (built.windowCount) {
              total = Number(rows[0]?.__petto_total_count || 0);
              rows = rows.map(({ __petto_total_count: _count, ...row }) => row);
            }
            if (built.ticketLabels && !head) {
              const ids = [...new Set(rows.map((row) => Number(row.category_id)).filter((id) => Number.isSafeInteger(id) && id > 0))];
              const labels = /* @__PURE__ */ new Map();
              if (ids.length) {
                const found = await getPool().query(`SELECT "id", "label" FROM "public"."ticket_categories" WHERE "id" = ANY($1::bigint[])`, [ids]);
                for (const category of found.rows) labels.set(String(category.id), { label: category.label });
              }
              rows = rows.map((row) => {
                const { category_id: categoryId, ...rest } = row;
                return { ...built.ticketLabels.dropCategoryId ? rest : row, ticket_categories: labels.get(String(categoryId)) ?? null };
              });
            }
            const hasRange = Boolean(range) || url.searchParams.get("offset") !== null;
            const returned = head ? 0 : rows.length;
            const end = returned ? built.start + returned - 1 : built.start;
            const headers = { "content-type": "application/json", "x-petto-source": "database", "content-range": `${built.start}-${end}/${total === null ? "*" : total}` };
            const status = hasRange || countExact ? 206 : 200;
            return new Response(head ? null : JSON.stringify(rows), { status, headers });
          }
        }
      }
    } catch (error) {
      if (!(error instanceof Unsupported)) {
        if (isConnectionError(error)) markUnreachable(error);
        else console.warn("[direct-db] falling back to the bot API:", error?.message);
      }
    }
    return original(input, init);
  };
}
async function checkDirectDatabase() {
  const db = getPool();
  if (!db) return { configured: false, note: "PETTO_DATABASE_URL is not set, every read goes through the bot API." };
  const started = Date.now();
  try {
    await db.query("select 1");
    const pingMs = Date.now() - started;
    const copyStarted = Date.now();
    const rows = await db.query("select count(*)::int as n from discord_guild_snapshots");
    const copyMs = Date.now() - copyStarted;
    let columns = "ok";
    try {
      await db.query("select banner, emoji_count, premium_tier, boost_count, bot_nick, bot_avatar from discord_guild_snapshots limit 1");
    } catch (error) {
      columns = `missing: ${String(error.message).slice(0, 120)}`;
    }
    return { configured: true, installed, ok: true, pingMs, savedServers: rows.rows[0]?.n ?? 0, savedServersMs: copyMs, columns };
  } catch (error) {
    return { configured: true, installed, ok: false, error: String(error.message).slice(0, 200) };
  }
}
const __test = { build };

export { __test, checkDirectDatabase, installDirectDatabase, probeDirect, queryDirect };
