# Status history (90 days)

The status page (`/status`, `/es/status`, `/pt-br/status`) shows three services, each with 90 slim bars, one for each UTC day:

| Service | Who checks it | How |
| --- | --- | --- |
| Petto's connection to Discord | the website, and the bot itself | The website reads the heartbeat the bot writes every 10 seconds (`bot_status`): fresh (under 90 seconds) and `Ready` on every shard. The bot also writes its own check (every shard ready, gateway latency). |
| Dashboard and website | the bot, and the website itself | The bot asks the public address (`/` and `/api/health`, through Cloudflare, one retry after 3 seconds). The website asks its own `/api/health` and `/` on the machine it runs on. |
| Database | the bot, and the website where it has its own connection | A real read (`select ... from bot_host`) with the time it took. Slower than 4 seconds counts as a failure. The website only judges the database itself when `PETTO_DATABASE_URL` is set (Discloud); elsewhere the bot's check is the one. |

## Where the checks run and why

Two places write checks, with a different `source` each (`bot`, `web`), into `status_checks`. If one side is down, the other still records what happened:

- Website down: the bot keeps writing the checks of the site (failed), the database and itself.
- Bot down: the website keeps writing the checks of the bot (stale heartbeat), itself and the database.
- Database down: nobody can write. Each side keeps its checks in memory (up to a day of them) and saves them, with their own window, when the database is back. If a process restarts meanwhile, those windows stay empty and the day shows the silence.
- Both sides down: nothing is written, so the day turns amber (a gap of 6 minutes or more without checks) or grey (most of the day without checks). It is never green because nobody looked.

The bot checks at the start of each 2 minute window plus 20 seconds, the website plus 50 seconds (`server.mjs` asks `/api/status-check`, with the secret the site already shares with the bot). Two checks in the same window and source are one row (`slot, service, source` is the key), so a repeat never counts twice.

## How a day gets its color

A window is 2 minutes. For one service, one window is: no row (missing), every row failed (failed), some failed and some fine (mixed, the places disagree) or every row fine.

- Red: a confirmed failure. Two failed windows in a row, or one window that both places saw fail.
- Amber: a failed or mixed window that nobody confirmed, or 6 minutes or more in a row with no check at all.
- Grey: fewer than a quarter of the windows have a check (nothing was watching).
- Green: otherwise.

The rules are pure functions in `src/utils/statusDays.mjs` and are tested by `scripts/check-status-days.mjs`.

## Days before the first check

The bars should not start empty, so the days before the first real check are shown green. They are not claimed as measured: their tooltip says "Not measured yet. Monitoring started on <date>", and a note under the bars gives the date. The date is the first check ever, kept in `bot_settings` (`status_monitoring_started_at`), so the 100 day retention never moves it. From the first check on, every day is judged from real checks.

## What is stored

All additive (`create table if not exists`, in the bot's `schema.sql`):

- `status_checks(slot, service, source, ok, latency_ms, detail)`: every check, kept about 100 days (the website prunes it every 6 hours).
- `status_days(day, service, state, checks, failed, unconfirmed, down_minutes, gap_minutes, avg_ms, max_ms)`: one small row per day and service. The website recomputes today every round, yesterday during the first half hour of a day, and every day since the last one it judged after a restart.

The public page reads only `status_days` (about 270 rows) and the last few windows of `status_checks`, once a minute at most (the answer is kept 60 seconds in memory and by the CDN), so a visitor never makes the database work.

## Cloudflare Worker build

The Worker build has no timer. To get history there too, call `POST /api/status-check` every 2 minutes with the header `x-petto-status-key` set to `PETTO_BOT_API_SECRET` (for example from a cron trigger). On Discloud, `server.mjs` does it.
