import { d as dayKey, l as lastDays, a as rest, S as STARTED_KEY, b as dayTime, c as SERVICES, e as applyNotes, f as dayMarkers, g as currentState, D as DAYS_SHOWN } from './statusMonitor_eg7DWmfk.mjs';

const notes = [
	{
		day: "2026-11-13",
		services: [
			"bot",
			"site",
			"database"
		],
		minutes: 35,
		note: {
			en: "The hosting was in maintenance: the apps were off for about 35 minutes.",
			es: "El alojamiento estuvo en mantenimiento: las aplicaciones estuvieron apagadas unos 35 minutos.",
			"pt-BR": "A hospedagem esteve em manutenção: os aplicativos ficaram desligados por cerca de 35 minutos."
		}
	}
];

const KEEP_MS = 6e4;
const KEEP_FAILURE_MS = 15e3;
let kept = null;
let running = null;
function empty(now, available) {
  const days = lastDays(now, DAYS_SHOWN);
  return { available, generatedAt: new Date(now).toISOString(), startedAt: null, days, services: SERVICES.map((id) => ({ id, now: "unknown", ms: null, lastAt: null, marks: dayMarkers(days, /* @__PURE__ */ new Map(), null, now).map((mark) => ({ d: mark.d, s: "nodata" })) })), incidents: [] };
}
async function load(context) {
  const now = Date.now();
  const days = lastDays(now, DAYS_SHOWN);
  try {
    const [startRows, dayRows, recentRows] = await Promise.all([
      rest(context, "GET", `bot_settings?key=eq.${STARTED_KEY}&select=value`),
      rest(context, "GET", `status_days?day=gte.${days[0]}&select=day,service,state,checks,unconfirmed,down_minutes,gap_minutes&order=day.asc&limit=1000`),
      rest(context, "GET", `status_checks?slot=gte.${encodeURIComponent(new Date(now - 20 * 6e4).toISOString())}&select=slot,service,source,ok,latency_ms&order=slot.desc&limit=240`)
    ]);
    if (!Array.isArray(startRows) || !Array.isArray(dayRows) || !Array.isArray(recentRows)) throw new Error("unreadable");
    let started = startRows[0]?.value ? Date.parse(String(startRows[0].value)) : NaN;
    if (!Number.isFinite(started) && dayRows.length) started = dayTime(String(dayRows[0].day));
    const startedAt = Number.isFinite(started) ? started : null;
    const incidents = [];
    const services = SERVICES.map((id) => {
      const rows = /* @__PURE__ */ new Map();
      for (const row of dayRows) if (row.service === id) rows.set(String(row.day).slice(0, 10), { state: row.state, checks: row.checks, downMinutes: row.down_minutes, unconfirmed: row.unconfirmed, gapMinutes: row.gap_minutes });
      const marks = applyNotes(dayMarkers(days, rows, startedAt, now), id, notes);
      for (const mark of marks) {
        if (mark.s === "down") {
          const note = notes.find((entry) => entry.day === mark.d && entry.services.includes(id))?.note;
          incidents.push({ day: mark.d, service: id, kind: "down", minutes: mark.dm ?? 0, unconfirmed: mark.um ?? 0, ...note ? { note } : {} });
        } else if (mark.s === "warn") incidents.push({ day: mark.d, service: id, kind: "warn", minutes: mark.gm ?? 0, unconfirmed: mark.um ?? 0 });
        else if (mark.s === "nodata") incidents.push({ day: mark.d, service: id, kind: "nodata", minutes: 0, unconfirmed: 0 });
      }
      const recent = recentRows.filter((row) => row.service === id).map((row) => ({ slot: Date.parse(row.slot), source: row.source, ok: row.ok, ms: row.latency_ms }));
      const current = currentState(recent, now);
      return { id, now: current.state, ms: current.ms, lastAt: current.lastSlot === null ? null : new Date(current.lastSlot).toISOString(), marks };
    });
    incidents.sort((a, b) => a.day < b.day ? 1 : a.day > b.day ? -1 : 0);
    return { available: true, generatedAt: new Date(now).toISOString(), startedAt: startedAt === null ? null : new Date(startedAt).toISOString(), days, services, incidents: incidents.slice(0, 120) };
  } catch {
    return empty(now, false);
  }
}
function getStatusHistory(context) {
  if (kept && Date.now() - kept.at < (kept.value.available ? KEEP_MS : KEEP_FAILURE_MS)) return Promise.resolve(kept.value);
  if (!running) running = load(context).then((value) => {
    kept = { at: Date.now(), value };
    return value;
  }).finally(() => {
    running = null;
  });
  return running;
}
const startedDay = (history) => history.startedAt ? dayKey(Date.parse(history.startedAt)) : null;

export { getStatusHistory as g, startedDay as s };
