# Link previews

When a page of the site is shared (Discord, X, Telegram, Slack), the preview shows a title, a description, a picture and, in Discord, two buttons (Add to Discord, Dashboard). Discord reads the `discord:component-embed` tag (see `src/data/discordEmbed.ts`); everything else reads the usual Open Graph tags (`src/layouts/Base.astro`).

## The picture

Every page has a picture of 1200x630 (the 1.91:1 shape that X, Telegram and Slack ask for; Discord's card shows any shape), a WebP of about 40 to 65 KB, drawn for the page and its language. It is a flat pastel illustration: a soft background with a faint pattern of tiny doodles, the logo (the flat duck and the word Petto) top-left, a huge headline in Balsamiq Sans that ends in a period, a small tagline, and on the right a cluster of stickers with thick dark outlines that mean what the page is about (a shield with a check and a gavel for moderation, a ticket and a chat bubble for tickets, a star, a rank bar and a trophy for levels, a gift for giveaways, a bell and an antenna for feeds, a browser window with toggles for the dashboard, a slash in a bubble and a terminal line for commands, a heartbeat line with three dots for the status, two rings for partners, a crown for Premium, brackets for the code tools...). A page type with no object of its own uses the home set (the duck with a small shield, a ticket and a star).

- The color of each family of pages: butter yellow (home, features, stats, Premium, roadmap), peach (moderation, protection, blog, team), mint (levels, community, status, linked roles), sky (tickets, dashboard, commands, tools), pink (giveaways, feeds, feedback, partners, credits) and cream (legal pages, FAQ, brand, code). The pastels are in `TONES` (`src/data/ogCards.mjs`).
- The data is `src/data/ogCards.mjs`: one entry per card (tone, artwork, headline and tagline in three languages) and `CARD_PATHS` (which page uses which card). A page nobody listed uses the card of the page it is under (`/changelog/0.7.7` uses the changelog card), and in the end the home card.
- The news posts (`releases.items` in `src/i18n/ui.ts`) get a card made from the post: its own title is the headline (smaller, up to 4 lines), its date is in a chip and its own banner is in a framed card. The pages `/nelu`, `/am` and `/embed-builder` are listed in `NEWS_PAGES`.
- The look and the artwork (SVG, drawn in code) are `scripts/og/template.mjs`. `npm run make:og` draws everything with a browser (Playwright) into `public/assets/og` and writes `src/data/ogManifest.json`. The files are committed: the build and the server never need a browser, and a preview never waits for a picture to be drawn (Discord gives the whole preview 10 seconds).
- `npm run check` (`scripts/check-og-images.mjs`) fails when a card is missing, is the wrong size or over 80 KB, has no headline ending in a period, or was drawn from other data or another look than the current ones. Run `npm run make:og` and commit the result.
- To add a card: add the entry (a tone, an `art` that exists in `scripts/og/template.mjs`, a headline and a tagline in three languages), add its path to `CARD_PATHS`, run `npm run make:og`. To add artwork: add a sticker to `S` and a scene to `SCENES` in the template.

## The Discord card

The card Discord draws (the component embed, see `src/data/discordEmbed.ts`) has a colored bar on its left side (`accent_color`) in the darker tone of the pastel of the picture, so the bar and the picture match. Under it come the title, the description, the address and the two buttons.

`/features/<id>` (`moderation`, `tickets`, `levels`...) are addresses to share one feature: their preview is drawn for that feature, and the page sends the visitor to that part of `/features`.

## The title of the home page

The home page is drawn on request (kept a minute by the CDN) so its preview title can carry Petto's numbers: "Petto · Looking after 620 servers and 56,468 members". The numbers come from the row the bot rewrites every minute for the stats page (`global_stats`: `servers` and `members`), kept 5 minutes in memory. If they cannot be read in 1.5 seconds, the title has no numbers ("Petto, a Discord bot"); without the members it says only the servers.
