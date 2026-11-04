// The numbers of the tickets of a server for the dashboard (the same ones `ticket stats` gives in Discord).
// The days of the chart are the days of Petto (GMT-5, Colombia), like the rest of the statistics.
import { botDay, rangeDays } from './activityStats';

export interface TicketRow { status: string; claimed_by: string | null; created_at: string; closed_at: string | null }

export interface TicketStats {
  total: number; open: number; unclaimed: number; opened7: number; closed7: number; opened30: number; closed30: number;
  averageMinutesOpen: number | null; averageRating: number | null; ratingCount: number;
  days: { label: string; opened: number; closed: number }[];
}

const DAY = 86_400_000;

export function summarizeTickets(tickets: TicketRow[], ratings: { rating: number }[], now = Date.now()): TicketStats {
  const open = tickets.filter((t) => t.status === 'open');
  const within = (iso: string | null, days: number) => Boolean(iso) && new Date(iso as string).getTime() >= now - days * DAY;
  const closedWaits = tickets.filter((t) => t.status === 'closed' && t.closed_at).map((t) => new Date(t.closed_at as string).getTime() - new Date(t.created_at).getTime()).filter((ms) => ms > 0);
  const stars = ratings.map((r) => Number(r.rating)).filter((n) => n >= 1 && n <= 5);
  return {
    total: tickets.length,
    open: open.length,
    unclaimed: open.filter((t) => !t.claimed_by).length,
    opened7: tickets.filter((t) => within(t.created_at, 7)).length,
    closed7: tickets.filter((t) => t.status === 'closed' && within(t.closed_at, 7)).length,
    opened30: tickets.filter((t) => within(t.created_at, 30)).length,
    closed30: tickets.filter((t) => t.status === 'closed' && within(t.closed_at, 30)).length,
    averageMinutesOpen: closedWaits.length ? Math.round(closedWaits.reduce((a, b) => a + b, 0) / closedWaits.length / 60_000) : null,
    averageRating: stars.length ? Math.round((stars.reduce((a, b) => a + b, 0) / stars.length) * 10) / 10 : null,
    ratingCount: stars.length,
    days: lastDays(tickets, now, 14),
  };
}

/** What was opened and closed on each of the last `count` days (GMT-5), oldest first. */
function lastDays(tickets: TicketRow[], now: number, count: number) {
  const day = (ms: number) => botDay(ms);
  const out = rangeDays(new Date(now), count).map((key) => ({ key, label: key.slice(5), opened: 0, closed: 0 }));
  const byKey = new Map(out.map((d) => [d.key, d]));
  for (const t of tickets) {
    const a = byKey.get(day(new Date(t.created_at).getTime()));
    if (a) a.opened += 1;
    if (t.status === 'closed' && t.closed_at) {
      const b = byKey.get(day(new Date(t.closed_at).getTime()));
      if (b) b.closed += 1;
    }
  }
  return out.map(({ label, opened, closed }) => ({ label, opened, closed }));
}

/** A length of time in minutes as text (`45 min`, `3 h 20 min`, `2 d 4 h`). */
export function minutesText(minutes: number | null): string {
  if (minutes === null) return '-';
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
  return `${Math.floor(minutes / 1440)} d ${Math.floor((minutes % 1440) / 60)} h`;
}
