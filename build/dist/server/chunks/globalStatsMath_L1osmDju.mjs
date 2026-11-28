// The rules behind the public stats page (/stats): how the daily history is cleaned, which days count, the change between two
// days and the scale of a chart whose vertical axis is zoomed to the data. Pure functions, so scripts/check-stats-page.mjs can test
// them and the page script can use the very same code.


/** Every number of a day the bot may store. A day can lack some (servers and members were stored later than the activity). */
const DAY_FIELDS = ['servers', 'members', 'messages', 'reactions', 'voiceSeconds'];
/** The series the page can draw: `level` ones are a count at the end of the day (they are not added up), the others are per day. */
const METRICS = [
  // `flag` is the mark of a day whose value was not measured. Servers, members and the per-day numbers each have their own, they never share one.
  { key: 'servers', field: 'servers', kind: 'level', flag: 'estimatedServers' },
  { key: 'members', field: 'members', kind: 'level', flag: 'estimated' },
  // The three per-day numbers share one mark: the days whose activity includes an approximate average, counted before an outage.
  { key: 'messages', field: 'messages', kind: 'flow', flag: 'estimatedActivity' },
  { key: 'voice', field: 'voiceSeconds', kind: 'flow', flag: 'estimatedActivity' },
  { key: 'reactions', field: 'reactions', kind: 'flow', flag: 'estimatedActivity' },
];
const MAX_HISTORY_DAYS = 400;

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const isDay = (value) => typeof value === 'string' && DAY_RE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const count = (value) => {
  if (value === null || value === undefined || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
};
/** A count at the end of the day (servers, members) is never zero: a zero there is a gap in what the bot knew, not a number. */
const LEVEL_FIELDS = METRICS.filter((info) => info.kind === 'level').map((info) => info.field);

/**
 * What the bot saved (`{ days: [...] }`, or the list itself) as a clean list: oldest first, one row per day, only real numbers,
 * the last 400 days. Anything that is not a day or a number is dropped (`null` means "not known", never zero); a day with no number
 * at all is dropped too. `estimated: true` marks a day whose MEMBERS were rebuilt afterwards instead of stored, and `estimatedServers: true`
 * one whose SERVERS were interpolated between two days with a measured count, and `estimatedActivity: true` one whose messages,
 * reactions and voice time include an approximate average; each flag is only about its own numbers.
 */
function normalizeHistory(raw) {
  const list = Array.isArray(raw) ? raw : Array.isArray(raw?.days) ? raw.days : [];
  const byDay = new Map();
  for (const entry of list) {
    const day = entry?.day ?? entry?.d;
    if (!isDay(day)) continue;
    const row = { day };
    for (const field of DAY_FIELDS) {
      const value = count(entry[field]);
      if (value !== undefined && !(value === 0 && LEVEL_FIELDS.includes(field))) row[field] = value;
    }
    for (const info of METRICS) if (info.flag && entry[info.flag] === true) row[info.flag] = true;
    if (DAY_FIELDS.some((field) => row[field] !== undefined)) byDay.set(day, { ...byDay.get(day), ...row });
  }
  return [...byDay.values()].sort((a, b) => (a.day < b.day ? -1 : 1)).slice(-MAX_HISTORY_DAYS);
}

export { MAX_HISTORY_DAYS as M, normalizeHistory as n };
