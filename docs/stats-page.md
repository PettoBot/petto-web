# Stats page (`/stats`, `/es/stats`, `/pt-br/stats`)

The public page of Petto in numbers (`src/components/GlobalStats.astro`). Nothing on it names a person. A server is named only in the ranking, and only if it did not hide itself in its dashboard (the bot already leaves those out).

## What each block reads

| Block | Reads | If it is missing |
| --- | --- | --- |
| Five cards (servers, members, messages, hours in voice, reactions) | `global_stats` row `main`: `servers`, `members` and `totals.all`. The "today" and "this week" chips are `totals.today` and `totals.week` moved by `rates`. The 7 and 30 day chips of servers and members come from the history. | The servers and members cards stay hidden until the bot sends them. A chip with no history is not drawn. |
| History chart (7d, 30d, 90d) | The daily history, see below. The vertical axis is zoomed to the data (`zoomScale` in `src/utils/globalStatsMath.mjs`). Per-day numbers leave out the day in progress. | A message says the history is not available yet, or that there are not enough days for the range. |
| Day by day table | The same history: each value with its change from the day before. The first row is today so far, from the live numbers. | The block is left out. |
| Top 10 servers | `global_stats` `main`: `ranking.{all,week}.{messages,voiceSeconds,reactions}`, first 10 entries (`name`, `icon`, `value`, and `members` when the bot sends it). | A message says no server is ranked yet. The page shows as many as the bot sends. |

The page keeps working when the numbers cannot be read: the first paint falls back to "not available right now", and the browser keeps trying every 30 seconds (history every 10 minutes).

## The daily history

`src/utils/globalStatsHistory.ts` (served to the browser by `/api/stats-history`, kept 5 minutes in memory) looks, in this order:

1. `global_stats` row `history`: `{ "days": [{ "day": "2026-11-03", "servers": 181, "members": 56812, "messages": 60954, "reactions": 7457, "voiceSeconds": 129000 }] }`, one entry per day in GMT-5, oldest first, up to 120. Every number is optional per day. This is the only place the servers and members of past days can come from.
2. Without it, where the site has its own database connection (Discloud, `PETTO_DATABASE_URL`), the messages, reactions and voice time per day are added up from `activity_stats`. The Cloudflare build leaves that code out (`directQuery` is `null` there).
3. Without either there is no history.

## What the bot would need to store

All additive, no schema change: the bot job that rewrites `global_stats` `main` every minute (`src/jobs/globalStatsJob.js`) would also

- raise `SERVER_RANK_SIZE` from 5 to 10 in `src/db/globalStats.js`, and add `members: guild.memberCount` to each ranking entry;
- upsert `global_stats` row `history` once a minute with the days above: the last 120 days of `activity_stats` added up by `day` (read at most every 10 minutes, like the users ranking) and the `servers` and `members` of today, kept for the days already written.
