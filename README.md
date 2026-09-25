# petto-web

The website and dashboard for [Petto](https://petto.sbs), a Discord bot. Built with Astro 4,
deployed on Cloudflare.

The public site is static. The dashboard (`/dash/**`) runs server-side per request, because it
needs a live Discord session to know which servers you can manage.

---

## Running it locally

This project reads its credentials from the bot's `.env`, so both repos need to sit next to each
other:

```
some-folder/
  petto bot 1/     <- github.com/liamt8d/petto-bot
  petto-web/       <- this repo
```

`astro.config.mjs` loads `../petto bot 1/.env`. If the bot's folder is named differently, update
that path or the dashboard will have no Discord or bot API credentials in dev.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # always run this before calling a change done
```

There is no test suite. `npm run build` is the real check that nothing is broken.

### Environment variables

| Variable | Used for |
| --- | --- |
| `DISCORD_TOKEN` | Bot token. Reads guild/role/channel data, and the team profiles on `/team` at build time. |
| `DISCORD_CLIENT_ID` | OAuth2 login, and the "Add Bot" invite links. |
| `DISCORD_CLIENT_SECRET` | OAuth2 code exchange, and signing the session cookie. Server-side only. |
| `PETTO_BOT_API_URL` | Private bot API used by the dashboard for all database-backed data. |
| `PETTO_BOT_API_SECRET` | Server-side key matching the bot's `PETTO_DASHBOARD_API_SECRET`; never expose it to the browser. |
| `POLAR_ACCESS_TOKEN` | Secret used server-side to create a checkout tied to the logged-in Discord user. |
| `POLAR_WEBHOOK_SECRET` | Secret used by `petto.sbs/api/billing/polar/webhook` to verify Polar events. |
| `PETTO_OWNER_ID` | Discord ID allowed to use `/dash/admin` for permanent Premium grants. Defaults to the owner ID in the code. |

---

## Deploying

The Cloudflare adapter is already configured (`output: 'hybrid'`), so it deploys as-is. Two things
that are easy to miss:

- **Workers don't read `.env` files.** Every variable above has to be set in the Cloudflare
  dashboard, not just locally.
- **`/team` needs `DISCORD_TOKEN` at build time**, not only at runtime, since it fetches each team
  member's live Discord profile while the site is being built.
- **Premium secrets belong in Cloudflare Pages/Workers**, not in the bot's public `.env.example`:
  add `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET`, `PETTO_BOT_API_SECRET`, and the existing
  Discord OAuth secrets as encrypted variables. The public product IDs and checkout link are kept
  in `wrangler.toml`.
- **Owner grants** are available at `/dash/admin` only for the configured Discord owner ID. A
  user grant gives an account permanent slots; a server grant activates that server immediately.

For Discloud, register the web subdomain first, replace the `ID` in `discloud.config` with that
subdomain, and upload the project with the included Node standalone build. Discloud needs the
site to listen on `0.0.0.0:8080`; `start:discloud` sets that default while still honoring an
explicit `HOST` or `PORT`. Configure `PETTO_BOT_API_URL` and `PETTO_BOT_API_SECRET` as runtime
variables there, with the secret matching the bot's `PETTO_DASHBOARD_API_SECRET` exactly.

---

## Layout

```
src/
  pages/           One file per route. Locale copies live in es/ and pt-br/.
    dash/          Everything behind Discord login (prerender = false).
  components/      Page-level components. Dash*.astro are the dashboard modules.
  layouts/Base.astro   Nav, footer, theme toggle, cookie banner, global CSS.
  react/embeds/    The embed builder. The only React island on the site.
  i18n/ui.ts       Every string, for all three locales.
  utils/           Session, Discord API, dashboard auth.
```

### Adding a page

1. Build the component in `src/components/`.
2. Add the strings to all three locales in `src/i18n/ui.ts`.
3. Create the route in `src/pages/`, `src/pages/es/`, and `src/pages/pt-br/`.

Blog posts follow the same pattern, plus an entry in `releases.items` (with an `iso` date, that's
what the newest-first ordering sorts on) and a `postKey` added to `NewsPost.astro`.

### Adding a dashboard module

Pages under `src/pages/dash/guild/[id]/` all follow one shape:

```astro
const auth = await getGuildSession(Astro, id);   // verifies the user really manages this guild
if ('redirect' in auth) return Astro.redirect(auth.redirect);
```

Then a single `Promise.all` for every Discord and bot API call the page needs. Fetching them one
after another is what made these pages slow before, so keep them batched.

Anything interpolated into a database API filter has to be escaped:

```js
`...?id=eq.${encodeURIComponent(String(form.get('id') ?? ''))}`
```

---

## Notes

- **Docs are a separate site.** `/docs` redirects to [wiki.petto.sbs](https://wiki.petto.sbs),
  built from its own repo with Mintlify.
- **Dashboard navigation is AJAX.** `DashGuildLayout.astro` swaps `#dgl-content` instead of doing a
  full page load, and syncs the incoming page's `<head>` styles and scripts so module CSS and the
  React island still work.
- **Unsaved changes are guarded.** Touching any dashboard form raises a save bar that blocks
  navigation until you save or discard.
- **UI conventions:** never use a native `<select multiple>`, use the checkbox-list-in-a-bordered-div
  pattern (see `DashModeration.astro`). Module cards follow the `.md-card` / `.md-card-head` /
  `.md-card-icon` shape.
