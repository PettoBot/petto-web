# Connecting the Embed Generator, the bot, and the dashboard

This is a proposal only. Nothing here is built yet.

**Where things stand**

- The bot owns the data. Templates live in the `embed_templates` table as `{ content, embeds, buttons }`, and the bot resolves the `{variables}` when it sends a message.
- The dashboard edits those rows through `embeds-api` with its own React builder, and lets modules pick a template by name (welcome, leveling, giveaways, tickets).
- The Embed Generator is a separate, stateless tool. It builds the same kind of message but has no idea a server, a bot, or a saved template exists.
- The variable list in the dashboard (`src/react/embeds/variables.ts`) is a hand-kept copy of what the bot resolves, and the previews used to show raw tokens because only the bot knows the real values.

**Goal**

One message format, one variable list, and one renderer, so a message looks and behaves the same in the generator, in the dashboard, and in the channel.

**1. A shared schema**

Move the template shape, its limits (10 embeds, 25 fields, 5 button rows, character caps), `normalizeTemplateData`, and a validator into one small package that the bot, the dashboard, and the generator all import. Add a `version` number to stored templates so old rows keep working when the shape grows. Validation then happens once, in the same way, before anything is saved or sent.

**2. A shared renderer**

`src/utils/discordPreview.ts` already draws a message from that shape. Publish it next to the schema and have the generator and the Embeds page use it instead of their own copies. Previews are then identical everywhere, and a fix lands in all three.

**3. One variable list, owned by the bot**

The bot exposes its variable registry as JSON (name, description, sample value, which events provide it). The dashboard and the generator read it instead of keeping a copy. The sample values also feed the previews, so a welcome preview can show the tokens that really exist for a welcome message and mark the others as unavailable there.

**4. Generator to dashboard**

- A "Send to Petto" button in the generator encodes the message into a short import code (or a compressed URL fragment for small messages) and opens `/dash/guild/:id/embeds?import=...`.
- The dashboard asks which server, shows the message in the builder, and saves it as a normal template after the user names it.
- No account is needed in the generator. The login and the permission check happen in the dashboard, which already does both.

**5. Dashboard to generator**

An "Open in generator" button on a template for people who want the standalone editor. It is read-only handoff: the result comes back through the import path above, so there is a single way in.

**6. Real previews and test sends**

Add one bot endpoint, `POST /api/dashboard/guild/:id/embeds/test-send`, that resolves the variables for the logged-in user and posts the template to a chosen channel or to the user's DMs. The dashboard gets a "Send test" button next to every message field. This closes the gap between the sample preview and the real message without the dashboard having to know how variables resolve.

**7. Where a template is used**

Track usage (welcome, leveling, giveaways, tickets, custom commands) in one view on the Embeds page. Deleting or renaming a template then warns about the modules that point at it instead of failing silently when the bot cannot find it.

**Suggested order**

1. Shared schema and validator (removes duplicated rules, no user-facing change).
2. Variable registry endpoint in the bot, consumed by the dashboard.
3. Test send from the dashboard.
4. Import code between the generator and the dashboard.
5. Move the generator and the Embeds page onto the shared renderer.

**Open questions**

- Where the shared package lives (a new repository or a folder in the bot repository published privately).
- How long import codes stay valid, and whether they carry the message or point to a stored draft.
- Whether the generator should offer a free "Save to server" once the user is logged in, or keep the import flow as the only path.
