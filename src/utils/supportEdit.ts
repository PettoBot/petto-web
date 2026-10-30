// SUPPORT MODE: what the Petto owner may change on a server he does not manage.
//
// The owner can open any server the bot is in (dashAuth.ts, `devView`). That view is read-only, except for the few settings listed in
// this file: the ones that break by a wrong value (a channel Petto cannot post in, a message, a delay) and show errors, so a person
// who helps a server can fix them. Nothing else can be changed there, ever: security, identity, money, data and access stay closed.
//
// THIS FILE IS THE ONLY PLACE TO CHANGE THE LISTS. Everything else reads it:
//  - dashAuth.ts asks `supportDecision` for every write (any method but GET and HEAD) of a server the owner does not manage, so a page, a
//    JSON route (`*-api.ts`) or a forged form is refused here whatever the page does. The refusal is the old `?error=dev_readonly`.
//  - DashGuildLayout.astro draws the Support mode banner and turns the forms that cannot be saved into read-only ones from `supportPolicyFor`.
//  - middleware.ts leaves the trace of every allowed change (`recordSupportEdit`, below).
//
// HOW TO READ THE LIST
//  - DEFAULT IS DENY: a page, a route or an action that is not in `SUPPORT_GROUPS` cannot be written. A new page starts closed.
//  - A group names a `page` (the first part of the address after the server: `/dash/guild/<id>/<page>`; a route that serves a page has its
//    own name, like `feeds-api`) and the `action`s of that page that may be sent. The action is the `action` field of the form (or of the
//    JSON the page sends). `''` is a save that has no `action` field (the settings form of a page that only has one).
//  - `edit` actions change something and leave a trace. `look` actions are POSTs that only read (a search, a preview): allowed, no trace.
//  - `sections` (optional) limits the group to some tabs of the page (`?section=`); without it every tab may send the action.
//  - Only POST is ever allowed. PUT, PATCH and DELETE are refused for every page.
//
// A SETTING BELONGS HERE ONLY IF a wrong value just makes a feature not work, or work in the wrong place. Never add: Premium and billing,
// Customize (the bot's identity), moderation and security (automod, anti-nuke, anti-scam, honeypot, lockdown, jail, sanctions, cases,
// appeals), verification, join roles and reaction roles (they give roles), backups, imports and exports, deleting or resetting data, who
// can open the dashboard, tickets, forms, Petto Code, the general settings (prefix, language), or anything that removes data.
import { getEnv } from './env';
import { getDashLang, makeT } from '../i18n/dash';

export interface SupportGroup {
  /** What the banner of Support mode calls it (a key of the dashboard dictionary, English). */
  label: string;
  /** The page, or the route that serves a page (`feeds-api`). */
  page: string;
  /** Tabs of the page (`?section=`) where the actions are allowed; none means every tab. */
  sections?: string[];
  /** Actions that change something. They are recorded for the admins of the server. */
  edit: string[];
  /** Actions that only read (sent as POST by the page). Not recorded. */
  look?: string[];
}

export const SUPPORT_GROUPS: SupportGroup[] = [
  // ---- Onboarding: welcome, leave and boost messages and channels, the join DM, ping on join and the bump reminder.
  // NOT here: `verification`, `add_join_role` and `remove_join_role` (who gets in and which roles they get).
  { label: 'Onboarding', page: 'onboarding', edit: ['events', 'dm_join', 'ping_on_join', 'bump'] },

  // ---- Logging: which channel each kind of log goes to (the "ignored" list hides things from the logs, so it stays closed).
  { label: 'Logging', page: 'logging', edit: ['', 'routing'] },

  // ---- Feeds (the page sends everything through feeds-api): change a feed and send a test notice. Following a new account and stopping
  // a feed are the owner's of the server.
  { label: 'Feeds', page: 'feeds-api', edit: ['update', 'test'], look: ['resolve', 'search', 'preview'] },

  // ---- Automation: only the tabs whose settings are a channel, a message or a delay. Everything else of the page (custom commands, auto
  // responders, reaction roles and triggers, webhooks, disabled commands, sticky roles, VoiceMaster...) stays closed, and so does every delete.
  { label: 'Timers', page: 'automation', sections: ['timers'], edit: ['edit_timer', 'run_timer'] },
  { label: 'Sticky messages', page: 'automation', sections: ['sticky-messages'], edit: ['add_sticky'] },
  { label: 'Starboard', page: 'automation', sections: ['starboard'], edit: ['save_starboard'] },
  { label: 'Monkeyboard', page: 'automation', sections: ['monkeyboard'], edit: ['save_monkeyboard'] },

  // ---- Counters: change one, its announcements, its name, the order, and refresh. Not `create`, `setup` and `delete` (they make or remove channels).
  { label: 'Counters', page: 'counters', edit: ['save', 'template', 'reorder', 'refresh', 'announce', 'announce_test'] },

  // ---- Boards (starboard-like pages): the settings save. Not `disable` (it deletes the board and its entries).
  { label: 'Boards', page: 'boards', edit: ['save'] },

  // ---- Pages with one settings form: channel, role, message, emojis, delays. Not the blocked members of Suggestions and Confessions
  // (`block_member`, `unblock_member`: that is moderation), so only the form without an action is open.
  { label: 'Suggestions', page: 'suggestions', edit: [''] },
  { label: 'Confessions', page: 'confessions', edit: [''] },
  { label: 'Counting', page: 'counting', edit: [''] },
  { label: 'Birthdays', page: 'birthdays', edit: [''] },
  // The button that posts the confession panel in the chosen channel (it sends no action).
  { label: 'Confessions', page: 'confessions-api', edit: [''] },
  // Votes of a suggestion are only read. Answering one (approve, deny) sends no action and stays closed.
  { label: 'Suggestions', page: 'suggestions-api', edit: [], look: ['votes'] },

  // ---- Community: only the channel of the reports. Not Booster roles, Reputation or polls (they give roles, change points or post as a person).
  { label: 'Reports', page: 'community', edit: ['report'] },

  // ---- Tools: the channels of uploads, requests and reviews. Not `delete_review` (it deletes data).
  { label: 'Uploads', page: 'tools', edit: ['save_uploads'] },
  { label: 'Requests', page: 'tools', edit: ['save_requests'] },
  { label: 'Reviews', page: 'tools', edit: ['save_reviews'] },

  // ---- "Sync server data": the bot saves its copy of the server again (roles and channels). It only reads.
  { label: 'Sync server data', page: 'resync-api', edit: [], look: [''] },
];

// ---- The decision

export type SupportDecision =
  | { allowed: true; edit: boolean; page: string; action: string }
  | { allowed: false; page: string; action: string };

/** The page of a dashboard address (`/dash/guild/<id>/<page>`, also with the language prefix); '' when it is not a page of this server. */
export function supportPageOf(pathname: string, guildId: string): string {
  const match = new RegExp(`^/(?:(?:es|pt-br)/)?dash/guild/${guildId}/([\\w-]+)/?$`, 'i').exec(pathname);
  return match ? match[1].toLowerCase() : '';
}

/** The groups of a page, and of the routes that serve it (`feeds` has the group of `feeds-api`). Used to draw the page, never to allow a write. */
export function supportGroupsOf(page: string): SupportGroup[] {
  return SUPPORT_GROUPS.filter((group) => group.page === page || group.page.startsWith(`${page}-`));
}

/**
 * Whether a write is allowed. `actions` are the values of the `action` field of the request (`['']` when it has none; null when the body
 * could not be read, which is a refusal). Every value must be allowed, so a request that repeats the field cannot hide one behind another.
 */
export function supportDecision(method: string, page: string, section: string, actions: string[] | null): SupportDecision {
  const action = (actions ?? []).join(',');
  const refuse: SupportDecision = { allowed: false, page, action };
  if (method.toUpperCase() !== 'POST' || !page || !actions || !actions.length) return refuse;
  const groups = SUPPORT_GROUPS.filter((group) => group.page === page && (!group.sections || group.sections.includes(section)));
  let edit = false;
  for (const value of actions) {
    if (groups.some((group) => group.edit.includes(value))) edit = true;
    else if (!groups.some((group) => group.look?.includes(value))) return refuse;
  }
  return { allowed: true, edit, page, action };
}

/** The `action` field(s) of a write, from a form or from JSON (`['']` when there is none). null when the body cannot be read. Reads a copy: the page still gets its body. */
export async function readActions(request: Request): Promise<string[] | null> {
  const type = request.headers.get('content-type') ?? '';
  try {
    if (/json/i.test(type)) {
      const body: any = await request.clone().json();
      const action = body && typeof body === 'object' ? body.action : undefined;
      return [action === undefined || action === null ? '' : String(action)];
    }
    if (/multipart\/form-data|application\/x-www-form-urlencoded/i.test(type)) {
      const values = (await request.clone().formData()).getAll('action').map((value) => (typeof value === 'string' ? value : '\u0000file'));
      return values.length ? values : [''];
    }
  } catch {
    return null;
  }
  // No body at all (a button that only POSTs) has no action; any other body of a type this does not read is refused, because a route
  // that reads JSON whatever the type says could be given an action this gate never saw.
  try {
    return (await request.clone().text()).trim() === '' ? [''] : null;
  } catch {
    return null;
  }
}

/**
 * The gate for one write of the owner on a server he does not manage: reads the request once and keeps the answer on `locals`, because the
 * body can be read only once and a page asks the session again (to call the bot) after it has read its form. A refusal is remembered too
 * (`locals.supportRefused`), so the middleware can answer a JSON route with the clear message; an allowed change that edits something is
 * left as `locals.supportEdit` for `recordSupportEdit`.
 */
export function supportGate(astro: any, guildId: string, userId: string): Promise<SupportDecision> {
  const locals: Record<string, any> | undefined = astro.locals;
  if (locals?.supportGate) return locals.supportGate;
  const run = (async (): Promise<SupportDecision> => {
    const method = String(astro.request?.method ?? 'GET');
    const page = supportPageOf(String(astro.url?.pathname ?? ''), guildId);
    const section = String(astro.url?.searchParams?.get('section') ?? '');
    // A page without any group is refused before its body is read (a file upload is never copied for nothing).
    const actions = SUPPORT_GROUPS.some((group) => group.page === page) ? await readActions(astro.request) : null;
    const decision = supportDecision(method, page, section, actions);
    if (locals) {
      if (!decision.allowed) locals.supportRefused = true;
      else if (decision.edit) locals.supportEdit = { guildId, userId, page: decision.page, action: decision.action } satisfies SupportEditNote;
    }
    return decision;
  })();
  if (locals) locals.supportGate = run;
  return run;
}

/** The answer of a JSON route to a write that Support mode refused (a page is answered with the redirect and its notice instead). */
export function supportRefusal(context: unknown): Response {
  const message = makeT(getDashLang(context))('Support mode: this setting is not editable on other servers');
  return new Response(JSON.stringify({ ok: false, code: 'view_only', error: 'view_only', message }), { status: 403, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}

/** What the layout needs to draw Support mode for a page: the actions its forms may send (per tab), for the banner and the read-only look. */
export function supportPolicyFor(page: string) {
  const groups = supportGroupsOf(page).filter((group) => group.edit.length);
  return { page, groups: groups.map((group) => ({ actions: group.edit, sections: group.sections ?? null })) };
}

/** The parts of the dashboard Support mode can change, for the banner (English keys; the layout translates them). */
export function supportLabels(): string[] {
  return [...new Set(SUPPORT_GROUPS.filter((group) => group.edit.length).map((group) => group.label))];
}

// ---- The trace

/** What the gate (dashAuth.ts) leaves on `locals` for a change it allowed; the middleware records it once the answer is known. */
export interface SupportEditNote { guildId: string; userId: string; page: string; action: string }

const LOG_CHANNEL_EVENT = 'server';

/**
 * The trace of a change the owner made on a server that is not his. Two places, both without any value of the settings (only who, when,
 * which page and which action):
 *  1. a line in the log of the site, in the style of the `[web]` lines of server.mjs;
 *  2. a message in the channel(s) where the server sends its "server" log (Logging page, the log webhook the bot already keeps), in the
 *     language of the server, so the admins see it where they read every other change. A server without that log only has line 1.
 * It never fails the request.
 */
export async function recordSupportEdit(context: unknown, note: SupportEditNote, status: number): Promise<void> {
  console.warn(`[web] support edit: Petto owner ${note.userId} changed server ${note.guildId} (page ${note.page}, action ${note.action || 'save'}, answer ${status})`);
  try {
    const apiUrl = getEnv(context, 'PETTO_BOT_API_URL');
    const apiKey = getEnv(context, 'PETTO_BOT_API_SECRET');
    if (!apiUrl || !apiKey) return;
    const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}` };
    const read = async (path: string) => {
      const response = await fetch(`${apiUrl}/rest/v1/${path}`, { headers, signal: AbortSignal.timeout(3000) }).catch(() => null);
      return response?.ok ? ((await response.json().catch(() => [])) as any[]) : [];
    };
    const guild = encodeURIComponent(note.guildId);
    const [entries, guilds] = await Promise.all([
      read(`log_entries?guild_id=eq.${guild}&event=eq.${LOG_CHANNEL_EVENT}&select=channel_id`),
      read(`guilds?guild_id=eq.${guild}&select=language`),
    ]);
    const channels = [...new Set(entries.map((entry) => String(entry.channel_id)))].slice(0, 5);
    if (!channels.length) return;
    const webhooks = await read(`log_webhooks?guild_id=eq.${guild}&channel_id=in.(${channels.map(encodeURIComponent).join(',')})&select=webhook_id,webhook_token`);
    const language = guilds[0]?.language === 'es' ? 'es' : guilds[0]?.language === 'pt-BR' ? 'pt-BR' : 'en';
    const dt = makeT(language);
    const embed = {
      title: dt('Support change on this server'),
      description: dt('The owner of Petto changed a setting of this server from the dashboard (Support mode).'),
      color: 0xf0b429,
      fields: [
        { name: dt('Page'), value: `\`${note.page}\``, inline: true },
        { name: dt('Action'), value: `\`${note.action || 'save'}\``, inline: true },
        { name: dt('Who'), value: `<@${note.userId}>`, inline: true },
      ],
      timestamp: new Date().toISOString(),
    };
    await Promise.all(webhooks.slice(0, 5).map((hook) => fetch(`https://discord.com/api/webhooks/${encodeURIComponent(String(hook.webhook_id))}/${encodeURIComponent(String(hook.webhook_token))}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'Petto', embeds: [embed], allowed_mentions: { parse: [] } }),
      signal: AbortSignal.timeout(4000),
    }).catch(() => null)));
  } catch { /* the line in the log is the trace that always stays */ }
}
