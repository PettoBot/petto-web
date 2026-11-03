# Link previews

When a page of the site is shared (Discord, X, Telegram, Slack), the preview shows a title, a description, a picture and, in Discord, two buttons (Add to Discord, Dashboard). Discord reads the `discord:component-embed` tag (see `src/data/discordEmbed.ts`); everything else reads the usual Open Graph tags (`src/layouts/Base.astro`).

## The picture

Every page has a picture of 1200x630 (the 1.91:1 shape that X, Telegram and Slack ask for; Discord's card shows any shape), a WebP of about 40 to 50 KB, drawn for the page and its language. It is a card in Petto's look: the glowing mascot, a headline, a tagline, chips with the topics and, on the right, a small screen that matches the page (a ban case for moderation, a ticket panel, a rank card, the services of the status page, a blog post with its banner and date).

- The data is `src/data/ogCards.mjs`: one entry per card (panel, icon, headline, tagline, chips in three languages) and `CARD_PATHS` (which page uses which card). A page nobody listed uses the card of the page it is under (`/changelog/0.7.7` uses the changelog card), and in the end the home card.
- The news posts (`releases.items` in `src/i18n/ui.ts`) get a card made from the post: its headline, its date, its category and its own banner. The pages `/nelu`, `/am` and `/embed-builder` are listed in `NEWS_PAGES`.
- The look is `scripts/og/template.mjs`. `npm run make:og` draws everything with a browser (Playwright) into `public/assets/og` and writes `src/data/ogManifest.json`. The files are committed: the build and the server never need a browser, and a preview never waits for a picture to be drawn (Discord gives the whole preview 10 seconds).
- `npm run check` (`scripts/check-og-images.mjs`) fails when a card is missing, is the wrong size or over 150 KB, or was drawn from other data or another look than the current ones. Run `npm run make:og` and commit the result.
- To add a card: add the entry, add its path to `CARD_PATHS`, run `npm run make:og`.

`/features/<id>` (`moderation`, `tickets`, `levels`...) are addresses to share one feature: their preview is drawn for that feature, and the page sends the visitor to that part of `/features`.

## The title of the home page

The home page is drawn on request (kept a minute by the CDN) so its preview title can carry Petto's numbers: "Petto · Looking after 620 servers and 56,468 members". The numbers come from the row the bot rewrites every minute for the stats page (`global_stats`: `servers` and `members`), kept 5 minutes in memory. If they cannot be read in 1.5 seconds, the title has no numbers ("Petto, a Discord bot"); without the members it says only the servers.
