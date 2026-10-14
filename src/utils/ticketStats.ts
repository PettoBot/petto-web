// The numbers of the tickets of a server for the dashboard (the same ones `ticket stats` gives in Discord).
export interface TicketRow { status: string; claimed_by: string | null; created_at: string; closed_at: string | null }

export interface TicketStats {
  total: number; open: number; unclaimed: number; opened7: number; closed7: number; opened30: number; closed30: number;
  averageMinutesOpen: number | null; averageRating: number | null; ratingCount: number;
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
  };
}

/** A length of time in minutes as text (`45 min`, `3 h 20 min`, `2 d 4 h`). */
export function minutesText(minutes: number | null): string {
  if (minutes === null) return '-';
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
  return `${Math.floor(minutes / 1440)} d ${Math.floor((minutes % 1440) / 60)} h`;
}
