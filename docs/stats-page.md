# Stats page (`/stats`, `/es/stats`, `/pt-br/stats`)

The public page of Petto in numbers (`src/components/GlobalStats.astro`). Nothing on it names a person. A server is named only in the ranking, and only if it did not hide itself in its dashboard (the bot already leaves those out).

## What each block reads

| Block | Reads | If it is missing |
| --- | --- | --- |
| Five cards (servers, members, messages, hours in voice, reactions) | `global_stats` row `main`: `servers`, `members` and `totals.all`. The "today" and "this week" chips are `totals.today` and `totals.week` moved by `rates`. The 7 and 30 day chips of servers and members come from the history. | The servers and members cards stay hidden until the bot sends them. A chip with no history is not drawn. |
| History chart (7d, 30d, 90d) | The daily history, see below, with today as the last point of every series. The vertical axis is zoomed to the data (`zoomScale` in `src/utils/globalStatsMath.mjs`). Servers and members at today are the live count the cards show (a full point). Messages, hours in voice and reactions at today are the day so far: the last stretch is dashed, the end is an open dot, the axis and the tooltip say "Today, so far", and it is not compared with the day before. | A message says the history is not available yet, or that there are not enough days for the range. Servers and Members stay among the tabs even without history: they show today's count as one point and "History starts today". |
| Day by day table | The same days as the chart, from the same live numbers. Each value with its change from the day before; a day without the number shows a dash, never a zero. The first row is today so far. Servers and members have their columns as soon as today's count is known. | The block is left out. |
| Top 10 servers | `global_stats` `main`: `ranking.{all,week}.{messages,voiceSeconds,reactions}`, first 10 entries (`name`, `icon`, `value`, and `members` when the bot sends it). | A message says no server is ranked yet. The page shows as many as the bot sends. |

The page keeps working when the numbers cannot be read: the first paint falls back to "not available right now", and the browser keeps trying every 30 seconds (history every 10 minutes).

## The daily history

`src/utils/globalStatsHistory.ts` (served to the browser by `/api/stats-history`, kept 5 minutes in memory) looks, in this order:

1. `global_stats` row `history`: `{ "days": [{ "day": "2026-11-03", "servers": 181, "members": 56812, "messages": 60954, "reactions": 7457, "voiceSeconds": 129000 }, ...], "updatedAt": "..." }`, one entry per day in GMT-5, oldest first, up to 120, ending with today (still in progress). Every number is optional per day, and `null` means "not known": it is a gap in the line and a dash in the table, never a zero (a servers or members value of 0 is read as not known too). This is the only place the servers and members of past days can come from.
   - `estimated: true` on a day marks servers and members that were rebuilt afterwards (from the join and leave counters) and not stored that day. The chart draws those stretches dashed, the table puts a `~` before them, and a note says "Before <first stored day> the values are reconstructed ... and are approximate". The flag is about servers and members only.
   - Today's row may have the day so far, but the page does not need it to be exact: for today it uses the live numbers of `global_stats` `main` (the same ones as the cards), so the card and the last point of the chart always show the same servers and members.
2. Without it, where the site has its own database connection (Discloud, `PETTO_DATABASE_URL`), the messages, reactions and voice time per day are added up from `activity_stats`. The Cloudflare build leaves that code out (`directQuery` is `null` there).
3. Without either there is no history.

## What the bot would need to store

All additive, no schema change: the bot job that rewrites `global_stats` `main` every minute (`src/jobs/globalStatsJob.js`) would also

- raise `SERVER_RANK_SIZE` from 5 to 10 in `src/db/globalStats.js`, and add `members: guild.memberCount` to each ranking entry;
- upsert `global_stats` row `history` once a minute with the days above: the last 120 days of `activity_stats` added up by `day` (read at most every 10 minutes, like the users ranking) and the `servers` and `members` of today, kept for the days already written (`null` where a day was never stored; `estimated: true` where it was rebuilt).

## How the day in progress is handled

The day is the GMT-5 one (`botDay`): a new day begins at 05:00 UTC, not at UTC midnight (at 04:00 UTC on Nov 5 it is still Nov 4). Today is always the last point. For messages, hours in voice and reactions it is only part of a day, so:

- the numbers above the chart: the **total includes** today so far, the **average per day, highest and lowest count full days only** (`summarize` in `src/utils/globalStatsMath.mjs`); the day shown for the highest and lowest is never today;
- the tooltip of today has no "vs the day before" line, so it does not read as a drop;
- servers and members are counts at a moment, not sums, so today's point is a full one and counts in the change, the highest and the lowest.
