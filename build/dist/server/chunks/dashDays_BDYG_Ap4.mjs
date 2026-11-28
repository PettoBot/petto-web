import { r as rangeDays, c as BOT_OFFSET_MS, b as botDay } from './activityStats_DxqJGP6E.mjs';

const OVERVIEW_RANGE_DAYS = { day: 1, week: 7, month: 30, year: 365 };
const DAY_MS = 864e5;
const atNoon = (day) => /* @__PURE__ */ new Date(`${day}T12:00:00Z`);
function parseOverviewRange(value) {
  return value === "day" || value === "week" || value === "month" || value === "year" ? value : "week";
}
function addDays(day, delta) {
  return new Date(atNoon(day).getTime() + delta * DAY_MS).toISOString().slice(0, 10);
}
function weekStartDay(day) {
  return addDays(day, -atNoon(day).getUTCDay());
}
function bucketKey(day, range) {
  return range === "year" ? weekStartDay(day) : day;
}
function dayStartInstant(day) {
  return new Date(Date.parse(`${day}T00:00:00Z`) - BOT_OFFSET_MS).toISOString();
}
function overviewDays(now, range) {
  const days = OVERVIEW_RANGE_DAYS[range];
  const list = rangeDays(now, days);
  return {
    days,
    today: list[list.length - 1],
    currentCutoff: list[0],
    previousCutoff: rangeDays(now, days * 2)[0],
    keys: [...new Set(list.map((day) => bucketKey(day, range)))]
  };
}
function bucketSums(rows, range, fields) {
  const sums = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const key = bucketKey(row.day, range);
    const sum = sums.get(key) ?? Object.fromEntries(fields.map((field) => [field, 0]));
    for (const field of fields) sum[field] += row[field];
    sums.set(key, sum);
  }
  return sums;
}
function fillAxis(keys, sums, fields) {
  return keys.map((label) => ({ label, ...sums.get(label) ?? Object.fromEntries(fields.map((field) => [field, 0])) }));
}
function rowDay(row) {
  if (row.day) return String(row.day).slice(0, 10);
  return row.created_at ? botDay(String(row.created_at)) : "";
}
function periodStartInstant(period, now = /* @__PURE__ */ new Date()) {
  const today = botDay(now);
  const first = period === "day" ? today : addDays(today, -((atNoon(today).getUTCDay() + 6) % 7));
  return Date.parse(dayStartInstant(first));
}

export { bucketKey as a, bucketSums as b, periodStartInstant as c, dayStartInstant as d, fillAxis as f, overviewDays as o, parseOverviewRange as p, rowDay as r };
