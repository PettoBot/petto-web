import { m as memoPerRequest, g as getBotIdentity, c as canManageGuild } from './discord_CxeBz2tv.mjs';
import { b as getCachedUserGuilds, g as getCachedBotGuildIds, a as getBotGuildList } from './discordCache_CnRINZ-g.mjs';
import { g as getEnv } from './env_WnBvzCjc.mjs';
import { g as getPremiumGuildIds, i as isPettoOwner } from './premiumAdmin_C4HUbWtx.mjs';
import { markTiming } from './serverTiming_CTuT9h6x.mjs';
import { m as makeT, g as getDashLang } from './dash_CORIPvM-.mjs';

const SESSION_VERSION = 1;
function toBase64Url(bytes) {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromBase64Url(b64url) {
  const pad = (4 - b64url.length % 4) % 4;
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  const str = atob(b64);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}
async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toBase64Url(new Uint8Array(sig));
}
async function encryptionKey(secret) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}
function isSession(value) {
  if (!value || typeof value !== "object") return false;
  const session = value;
  return typeof session.userId === "string" && (session.v === void 0 || typeof session.v === "number") && typeof session.username === "string" && (session.avatar === null || typeof session.avatar === "string") && (session.decoration === void 0 || session.decoration === null || typeof session.decoration === "string") && (session.nameplate === void 0 || session.nameplate === null || typeof session.nameplate === "object" && typeof session.nameplate.asset === "string" && typeof session.nameplate.palette === "string") && (session.handle === void 0 || session.handle === null || typeof session.handle === "string") && (session.banner === void 0 || session.banner === null || typeof session.banner === "string") && (session.accentColor === void 0 || session.accentColor === null || typeof session.accentColor === "number") && typeof session.accessToken === "string" && typeof session.refreshToken === "string" && typeof session.expiresAt === "number";
}
async function encodeSession(session, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await encryptionKey(secret);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(JSON.stringify({ ...session, v: SESSION_VERSION }))
  );
  return `v1.${toBase64Url(iv)}.${toBase64Url(new Uint8Array(ciphertext))}`;
}
function isCurrentSession(session) {
  return typeof session.v === "number" && session.v >= SESSION_VERSION;
}
async function decodeAnySession(value, secret) {
  if (value.startsWith("v1.")) {
    const [, encodedIv, encodedCiphertext] = value.split(".");
    if (!encodedIv || !encodedCiphertext) return null;
    try {
      const plaintext = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: fromBase64Url(encodedIv) },
        await encryptionKey(secret),
        fromBase64Url(encodedCiphertext)
      );
      const session = JSON.parse(new TextDecoder().decode(plaintext));
      return isSession(session) ? session : null;
    } catch {
      return null;
    }
  }
  const dot = value.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expected = await hmac(secret, payload);
  if (expected !== sig) return null;
  try {
    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    return isSession(session) ? session : null;
  } catch {
    return null;
  }
}

const ACCESS_SECTIONS = [
  { id: "dashboard", label: "Dashboard", pages: ["modules", "stats", "general", "customize", "backups"] },
  { id: "design", label: "Design", pages: ["embeds", "cards"] },
  { id: "moderation", label: "Moderation", pages: ["moderation", "antinuke", "antiscam", "honeypot", "role-triggers", "role-quotas", "automod", "rules", "lockdown"] },
  { id: "appeals", label: "Appeals", pages: ["appeals"] },
  { id: "security", label: "Security", pages: ["onboarding", "verification", "security", "permissions", "audit", "logging"] },
  { id: "welcome", label: "Welcome", pages: ["welcome"] },
  { id: "roles", label: "Roles", pages: ["join-roles", "aged-roles", "message-roles"] },
  { id: "leveling", label: "Leveling", pages: ["leveling", "streaks"] },
  { id: "automation", label: "Automation", pages: ["automation", "code", "bulk-role", "reaction-role", "counters", "boards"] },
  { id: "tickets", label: "Tickets", pages: ["tickets", "forums"] },
  { id: "community", label: "Community", pages: ["giveaways", "community", "birthdays", "confessions", "counting", "media", "partners", "responders", "senders", "suggestions", "tools", "forms", "feeds", "activity-boards", "voice-247", "bump"] },
  { id: "quests", label: "Quests", pages: ["quests"] },
  { id: "economy", label: "Economy", pages: ["economy"] },
  { id: "rollouts", label: "Rollouts", pages: ["rollouts"] },
  { id: "vanity", label: "Vanity roles", pages: ["vanity"] }
];
const SECTION_IDS = new Set(ACCESS_SECTIONS.map((section) => section.id));
const ALSO_OPENED_BY = { community: ["tickets"], security: ["welcome", "roles"] };
const OPEN_PAGES = /* @__PURE__ */ new Set(["overview", "live", "role-blocks"]);
function pageOf(pathname, guildId) {
  const prefix = `/dash/guild/${guildId}/`;
  if (!pathname.startsWith(prefix)) return "";
  return pathname.slice(prefix.length).split("/")[0].replace(/\.[a-z]+$/, "");
}
function sectionOfPage(page) {
  for (const section of ACCESS_SECTIONS) {
    if (section.pages.some((name) => page === name || page.startsWith(`${name}-`))) return section.id;
  }
  return null;
}
function accessFromRules(rules, roleIds) {
  const mine = rules.filter((rule) => roleIds.includes(rule.role_id));
  if (!mine.length) return null;
  const access = { all: false, sections: {}, canEditAll: false };
  for (const rule of mine) {
    if (rule.sections.includes("*")) {
      access.all = true;
      if (rule.can_edit) access.canEditAll = true;
    }
    for (const id of rule.sections) {
      if (!SECTION_IDS.has(id)) continue;
      access.sections[id] = access.sections[id] || rule.can_edit;
      for (const also of ALSO_OPENED_BY[id] ?? []) access.sections[also] = access.sections[also] || rule.can_edit;
    }
  }
  return access;
}
function pageDecision(access, page) {
  if (page === "access" || page === "staff-roles") return { allowed: false, canEdit: false };
  if (OPEN_PAGES.has(page)) return { allowed: true, canEdit: false };
  const section = sectionOfPage(page);
  if (!section) return { allowed: access.all, canEdit: access.all && access.canEditAll };
  if (access.all) return { allowed: true, canEdit: access.canEditAll || Boolean(access.sections[section]) };
  return { allowed: section in access.sections, canEdit: Boolean(access.sections[section]) };
}
const RULES_TTL_MS = 1e4;
const ROLES_TTL_MS = 2e4;
const rulesCache = /* @__PURE__ */ new Map();
const rolesCache = /* @__PURE__ */ new Map();
function database(astro) {
  const url = getEnv(astro, "PETTO_BOT_API_URL");
  const key = getEnv(astro, "PETTO_BOT_API_SECRET");
  if (!url || !key) return null;
  return { url, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" } };
}
const cleanRule = (row) => ({
  role_id: String(row.role_id),
  sections: Array.isArray(row.sections) ? row.sections.map(String) : [],
  can_edit: Boolean(row.can_edit)
});
async function loadRules(astro, guildId) {
  const hit = rulesCache.get(guildId);
  if (hit && hit.expiresAt > Date.now()) return hit.rules;
  const db = database(astro);
  if (!db) return [];
  try {
    const response = await fetch(`${db.url}/rest/v1/dash_access?guild_id=eq.${encodeURIComponent(guildId)}&select=role_id,sections,can_edit&order=created_at.asc`, { headers: db.headers });
    if (!response.ok) return [];
    const rules = (await response.json()).map(cleanRule);
    rulesCache.set(guildId, { rules, expiresAt: Date.now() + RULES_TTL_MS });
    return rules;
  } catch {
    return [];
  }
}
function forgetRules(guildId) {
  rulesCache.delete(guildId);
}
async function memberRoleIds(astro, guildId, userId) {
  const key = `${guildId}:${userId}`;
  const hit = rolesCache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.roles;
  const token = getEnv(astro, "DISCORD_TOKEN");
  if (!token) return null;
  try {
    const response = await fetch(`https://discord.com/api/guilds/${guildId}/members/${userId}`, { headers: { Authorization: `Bot ${token}` } });
    if (!response.ok) {
      if (response.status === 404) rolesCache.set(key, { roles: null, expiresAt: Date.now() + ROLES_TTL_MS });
      return null;
    }
    const member = await response.json();
    const roles = Array.isArray(member.roles) ? member.roles.map(String) : [];
    rolesCache.set(key, { roles, expiresAt: Date.now() + ROLES_TTL_MS });
    return roles;
  } catch {
    return null;
  }
}
function getRoleAccess(astro, guildId, userId) {
  return memoPerRequest(astro.request, `role-access:${guildId}:${userId}`, async () => {
    const rules = await loadRules(astro, guildId);
    if (!rules.length) return null;
    const roles = await memberRoleIds(astro, guildId, userId);
    return roles ? accessFromRules(rules, roles) : null;
  });
}
async function guildsWithRoleAccess(astro, userId, guildIds) {
  const db = database(astro);
  if (!db || !guildIds.length) return [];
  const ids = guildIds.slice(0, 100);
  let rows = [];
  try {
    const response = await fetch(`${db.url}/rest/v1/dash_access?guild_id=in.(${ids.map(encodeURIComponent).join(",")})&select=guild_id,role_id,sections,can_edit`, { headers: db.headers });
    if (response.ok) rows = await response.json();
  } catch {
  }
  const byGuild = /* @__PURE__ */ new Map();
  for (const row of rows) byGuild.set(String(row.guild_id), [...byGuild.get(String(row.guild_id)) ?? [], cleanRule(row)]);
  const found = await Promise.all([...byGuild].slice(0, 25).map(async ([guildId, rules]) => {
    const roles = await memberRoleIds(astro, guildId, userId);
    return roles && accessFromRules(rules, roles) ? guildId : null;
  }));
  return found.filter((id) => Boolean(id));
}

function loadDashLayoutData(astro, guildId, user) {
  const request = astro.request;
  return memoPerRequest(request, `dash-layout:${guildId}`, async () => {
    const started = performance.now();
    const botToken = getEnv(astro, "DISCORD_TOKEN");
    const [discordGuilds, botGuildIds, botIdentity, botGuildList] = await Promise.all([
      user.accessToken ? getCachedUserGuilds(user.accessToken, request).catch(() => null) : Promise.resolve(null),
      user.accessToken && botToken ? getCachedBotGuildIds(botToken, request).catch(() => null) : Promise.resolve(null),
      botToken ? getBotIdentity(guildId, botToken, request).catch(() => null) : Promise.resolve(null),
      // Kept in the shared cache (and read from the same saved copies as the ids above), so this is not a request per page.
      user.accessToken && botToken ? getBotGuildList(botToken).catch(() => []) : Promise.resolve([])
    ]);
    const memberCounts = new Map(botGuildList.map((guild) => [guild.id, guild.memberCount]));
    const switchable = discordGuilds && botGuildIds ? discordGuilds.filter(canManageGuild).filter((g) => botGuildIds.has(g.id)).map((g) => g.id) : [];
    const guildEntry = discordGuilds?.find((g) => g.id === guildId);
    const isManager = Boolean(guildEntry && canManageGuild(guildEntry));
    const [premiumGuildIds, roleAccess] = await Promise.all([
      user.userId ? getPremiumGuildIds(astro, user.userId, [guildId, ...switchable]).catch(() => /* @__PURE__ */ new Set()) : Promise.resolve(/* @__PURE__ */ new Set()),
      guildEntry && !isManager && user.userId ? getRoleAccess(astro, guildId, user.userId).catch(() => null) : Promise.resolve(null)
    ]);
    markTiming("layout", started);
    return { discordGuilds, botGuildIds, botIdentity, switchable, premiumGuildIds, memberCounts, isManager, roleAccess };
  });
}

const SUPPORT_GROUPS = [
  // ---- Onboarding: welcome, leave and boost messages and channels, the join DM, ping on join and the bump reminder.
  // NOT here: the verification (page `onboarding`) and the join roles (page `join-roles`): who gets in and which roles they get.
  { label: "Welcome", page: "welcome", edit: ["events", "dm_join", "ping_on_join"] },
  { label: "Bump", page: "bump", edit: ["bump"] },
  // ---- Logging: which channel each kind of log goes to (the "ignored" list hides things from the logs, so it stays closed).
  { label: "Logging", page: "logging", edit: ["", "routing"] },
  // ---- Feeds (the page sends everything through feeds-api): change a feed and send a test notice. Following a new account and stopping
  // a feed are the owner's of the server.
  { label: "Feeds", page: "feeds-api", edit: ["update", "test"], look: ["resolve", "search", "preview"] },
  // ---- Automation: only the tabs whose settings are a channel, a message or a delay. Everything else of the page (custom commands, auto
  // responders, reaction roles and triggers, webhooks, disabled commands, sticky roles, VoiceMaster...) stays closed, and so does every delete.
  { label: "Timers", page: "automation", sections: ["timers"], edit: ["edit_timer", "run_timer"] },
  { label: "Sticky messages", page: "automation", sections: ["sticky-messages"], edit: ["add_sticky"] },
  { label: "Starboard", page: "automation", sections: ["starboard"], edit: ["save_starboard"] },
  { label: "Monkeyboard", page: "automation", sections: ["monkeyboard"], edit: ["save_monkeyboard"] },
  // ---- Counters: change one, its announcements, its name, the order, and refresh. Not `create`, `setup` and `delete` (they make or remove channels).
  { label: "Counters", page: "counters", edit: ["save", "template", "reorder", "refresh", "announce", "announce_test"] },
  // ---- Boards (starboard-like pages): the settings save. Not `disable` (it deletes the board and its entries).
  { label: "Boards", page: "boards", edit: ["save"] },
  // ---- Pages with one settings form: channel, role, message, emojis, delays. Not the blocked members of Suggestions and Confessions
  // (`block_member`, `unblock_member`: that is moderation), so only the form without an action is open.
  { label: "Suggestions", page: "suggestions", edit: [""] },
  { label: "Confessions", page: "confessions", edit: [""] },
  { label: "Counting", page: "counting", edit: [""] },
  { label: "Birthdays", page: "birthdays", edit: [""] },
  // The button that posts the confession panel in the chosen channel (it sends no action).
  { label: "Confessions", page: "confessions-api", edit: [""] },
  // Votes of a suggestion are only read. Answering one (approve, deny) sends no action and stays closed.
  { label: "Suggestions", page: "suggestions-api", edit: [], look: ["votes"] },
  // ---- Community: only the channel of the reports. Not Booster roles, Reputation or polls (they give roles, change points or post as a person).
  { label: "Reports", page: "community", edit: ["report"] },
  // ---- Tools: the channels of uploads, requests and reviews. Not `delete_review` (it deletes data).
  { label: "Uploads", page: "tools", edit: ["save_uploads"] },
  { label: "Requests", page: "tools", edit: ["save_requests"] },
  { label: "Reviews", page: "tools", edit: ["save_reviews"] },
  // ---- "Sync server data": the bot saves its copy of the server again (roles and channels). It only reads.
  { label: "Sync server data", page: "resync-api", edit: [], look: [""] }
];
function supportPageOf(pathname, guildId) {
  const match = new RegExp(`^/(?:(?:es|pt-br)/)?dash/guild/${guildId}/([\\w-]+)/?$`, "i").exec(pathname);
  return match ? match[1].toLowerCase() : "";
}
function supportGroupsOf(page) {
  return SUPPORT_GROUPS.filter((group) => group.page === page || group.page.startsWith(`${page}-`));
}
function supportDecision(method, page, section, actions) {
  const action = (actions ?? []).join(",");
  const refuse = { allowed: false, page, action };
  if (method.toUpperCase() !== "POST" || !page || !actions || !actions.length) return refuse;
  const groups = SUPPORT_GROUPS.filter((group) => group.page === page && (!group.sections || group.sections.includes(section)));
  let edit = false;
  for (const value of actions) {
    if (groups.some((group) => group.edit.includes(value))) edit = true;
    else if (!groups.some((group) => group.look?.includes(value))) return refuse;
  }
  return { allowed: true, edit, page, action };
}
async function readActions(request) {
  const type = request.headers.get("content-type") ?? "";
  try {
    if (/json/i.test(type)) {
      const body = await request.clone().json();
      const action = body && typeof body === "object" ? body.action : void 0;
      return [action === void 0 || action === null ? "" : String(action)];
    }
    if (/multipart\/form-data|application\/x-www-form-urlencoded/i.test(type)) {
      const values = (await request.clone().formData()).getAll("action").map((value) => typeof value === "string" ? value : "\0file");
      return values.length ? values : [""];
    }
  } catch {
    return null;
  }
  try {
    return (await request.clone().text()).trim() === "" ? [""] : null;
  } catch {
    return null;
  }
}
function supportGate(astro, guildId, userId) {
  const locals = astro.locals;
  if (locals?.supportGate) return locals.supportGate;
  const run = (async () => {
    const method = String(astro.request?.method ?? "GET");
    const page = supportPageOf(String(astro.url?.pathname ?? ""), guildId);
    const section = String(astro.url?.searchParams?.get("section") ?? "");
    const actions = SUPPORT_GROUPS.some((group) => group.page === page) ? await readActions(astro.request) : null;
    const decision = supportDecision(method, page, section, actions);
    if (locals) {
      if (!decision.allowed) locals.supportRefused = true;
      else if (decision.edit) locals.supportEdit = { guildId, userId, page: decision.page, action: decision.action };
    }
    return decision;
  })();
  if (locals) locals.supportGate = run;
  return run;
}
function supportRefusal(context) {
  const message = makeT(getDashLang(context))("Support mode: this setting is not editable on other servers");
  return new Response(JSON.stringify({ ok: false, code: "view_only", error: "view_only", message }), { status: 403, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
}
function supportPolicyFor(page) {
  const groups = supportGroupsOf(page).filter((group) => group.edit.length);
  return { page, groups: groups.map((group) => ({ actions: group.edit, sections: group.sections ?? null })) };
}
function supportLabels() {
  return [...new Set(SUPPORT_GROUPS.filter((group) => group.edit.length).map((group) => group.label))];
}
const LOG_CHANNEL_EVENT = "server";
async function recordSupportEdit(context, note, status) {
  console.warn(`[web] support edit: Petto owner ${note.userId} changed server ${note.guildId} (page ${note.page}, action ${note.action || "save"}, answer ${status})`);
  try {
    const apiUrl = getEnv(context, "PETTO_BOT_API_URL");
    const apiKey = getEnv(context, "PETTO_BOT_API_SECRET");
    if (!apiUrl || !apiKey) return;
    const headers = { apikey: apiKey, Authorization: `Bearer ${apiKey}` };
    const read = async (path) => {
      const response = await fetch(`${apiUrl}/rest/v1/${path}`, { headers, signal: AbortSignal.timeout(3e3) }).catch(() => null);
      return response?.ok ? await response.json().catch(() => []) : [];
    };
    const guild = encodeURIComponent(note.guildId);
    const [entries, guilds] = await Promise.all([
      read(`log_entries?guild_id=eq.${guild}&event=eq.${LOG_CHANNEL_EVENT}&select=channel_id`),
      read(`guilds?guild_id=eq.${guild}&select=language`)
    ]);
    const channels = [...new Set(entries.map((entry) => String(entry.channel_id)))].slice(0, 5);
    if (!channels.length) return;
    const webhooks = await read(`log_webhooks?guild_id=eq.${guild}&channel_id=in.(${channels.map(encodeURIComponent).join(",")})&select=webhook_id,webhook_token`);
    const language = guilds[0]?.language === "es" ? "es" : guilds[0]?.language === "pt-BR" ? "pt-BR" : "en";
    const dt = makeT(language);
    const embed = {
      title: dt("Support change on this server"),
      description: dt("The owner of Petto changed a setting of this server from the dashboard (Support mode)."),
      color: 15774761,
      fields: [
        { name: dt("Page"), value: `\`${note.page}\``, inline: true },
        { name: dt("Action"), value: `\`${note.action || "save"}\``, inline: true },
        { name: dt("Who"), value: `<@${note.userId}>`, inline: true }
      ],
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    await Promise.all(webhooks.slice(0, 5).map((hook) => fetch(`https://discord.com/api/webhooks/${encodeURIComponent(String(hook.webhook_id))}/${encodeURIComponent(String(hook.webhook_token))}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "Petto", embeds: [embed], allowed_mentions: { parse: [] } }),
      signal: AbortSignal.timeout(4e3)
    }).catch(() => null)));
  } catch {
  }
}

// The Discord cosmetics of the user card in the dashboard menu: the avatar decoration (the ring around the picture) and the nameplate
// (the picture behind the name). Plain JavaScript so scripts/check-dash-cosmetics.mjs runs it with node alone.
//
// Discord's `GET /users/@me` (scope identify) answers `avatar_decoration_data` ({ asset, sku_id, expires_at }) and
// `collectibles.nameplate` ({ asset, label, palette, sku_id }) when the user has them. The session keeps only the two asset strings and
// the palette name, and the page only gets addresses built here from strings that pass the checks below.

const CDN$1 = 'https://cdn.discordapp.com';
/** Hash of an avatar decoration preset (for example `a_1f2e...`). */
const DECORATION_ASSET = /^[a-z0-9_-]{1,80}$/;
/** A folder of the nameplate files, like `nameplates/nameplates/twilight/` (a-z, 0-9, `_`, `-`, one to four parts). */
const NAMEPLATE_ASSET = /^(?:[a-z0-9_-]{1,40}\/){1,4}$/;

/** The colors of the nameplate palettes: [start, end] of the gradient behind the still picture and while it loads. */
const NAMEPLATE_PALETTES = {
  crimson: ['#4d0a14', '#b3263f'],
  berry: ['#431240', '#a02f8c'],
  sky: ['#0e3558', '#3f94d6'],
  teal: ['#0a4343', '#2aa89b'],
  forest: ['#12351c', '#3d8c4f'],
  bubble_gum: ['#63203f', '#e57aa6'],
  violet: ['#2b1a58', '#7d5bd9'],
  cobalt: ['#102563', '#3a5bdc'],
  clover: ['#1d4419', '#72b847'],
  lemon: ['#5f510a', '#dcc22e'],
  white: ['#34373e', '#dcdee3'],
};
/** The gradient of a palette that is not in the list (a new one Discord adds later): a calm grey. */
const DEFAULT_PALETTE = 'white';

/** The asset of an avatar decoration, or null when it is missing or not a plain asset string. @param {unknown} value */
function cleanDecorationAsset(value) {
  return typeof value === 'string' && DECORATION_ASSET.test(value) ? value : null;
}

/** The folder of a nameplate (always ending in a slash), or null. @param {unknown} value */
function cleanNameplateAsset(value) {
  if (typeof value !== 'string') return null;
  const text = value.endsWith('/') ? value : `${value}/`;
  return NAMEPLATE_ASSET.test(text) ? text : null;
}

/** The palette name, or the default one when it is unknown. @param {unknown} value */
function cleanPalette(value) {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(NAMEPLATE_PALETTES, value) ? value : DEFAULT_PALETTE;
}

/**
 * What the session keeps of Discord's user object: two assets and a palette name. `null` means "checked, the user has none".
 * @param {any} user the answer of `GET /users/@me`
 * @returns {{ decoration: string | null, nameplate: { asset: string, palette: string } | null }}
 */
function cosmeticsFromUser(user) {
  const decoration = cleanDecorationAsset(user?.avatar_decoration_data?.asset);
  const plate = user?.collectibles?.nameplate;
  const asset = cleanNameplateAsset(plate?.asset);
  return { decoration, nameplate: asset ? { asset, palette: cleanPalette(plate?.palette) } : null };
}

/** The address of an avatar decoration: the animated one (`passthrough=true`) or its still frame. @param {string} asset @param {boolean} animated */
function decorationUrl(asset, animated) {
  const clean = cleanDecorationAsset(asset);
  return clean ? `${CDN$1}/avatar-decoration-presets/${clean}.png?size=96&passthrough=${animated ? 'true' : 'false'}` : null;
}

/** The addresses of a nameplate: the video and the still picture. @param {string} asset */
function nameplateUrls(asset) {
  const clean = cleanNameplateAsset(asset);
  return clean ? { video: `${CDN$1}/assets/collectibles/${clean}asset.webm`, still: `${CDN$1}/assets/collectibles/${clean}static.png` } : null;
}

/**
 * Everything the user card draws from a session: a name, a picture and, only when the user has them, the decoration and the nameplate.
 * Never an id, a token or a time. Every address is built here from validated strings.
 * @param {{ username?: unknown, avatar?: unknown, decoration?: unknown, nameplate?: { asset?: unknown, palette?: unknown } | null } | null | undefined} session
 */
function userCardData(session) {
  const s = session && typeof session === 'object' ? session : {};
  const name = typeof s.username === 'string' ? s.username.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 80) : '';
  const avatar = typeof s.avatar === 'string' && /^https:\/\/cdn\.discordapp\.com\/(?:avatars|embed\/avatars)\/[\w./-]+(?:\?[\w=&]*)?$/.test(s.avatar) ? s.avatar : null;
  const asset = cleanDecorationAsset(s.decoration);
  const plate = s.nameplate && typeof s.nameplate === 'object' ? nameplateUrls(/** @type {any} */ (s.nameplate).asset) : null;
  const [from, to] = NAMEPLATE_PALETTES[cleanPalette(s.nameplate && /** @type {any} */ (s.nameplate).palette)];
  return {
    name,
    avatar,
    decoration: asset ? { animated: decorationUrl(asset, true), still: decorationUrl(asset, false) } : null,
    nameplate: plate ? { video: plate.video, still: plate.still, from, to } : null,
  };
}

// What the dashboard draws about a Discord account and a server: the banner of the menu header, the account facts of the profile
// overview (/dash/me) and the checks behind them. Plain JavaScript so scripts/check-dash-profile.mjs runs it with node alone.
//
// Discord's `GET /users/@me` (scope identify) answers `banner` (a hash, `a_` first when animated), `accent_color` (an integer) and the
// user name. The session keeps only those, validated here, and every address is built here from a validated hash and a numeric id on
// cdn.discordapp.com, never from text the account holder wrote.

const CDN = 'https://cdn.discordapp.com';
/** A banner hash: 32 hex digits, with `a_` in front when the picture is animated. */
const BANNER_HASH = /^(?:a_)?[0-9a-f]{32}$/;
const SNOWFLAKE = /^\d{15,25}$/;
const HANDLE = /^[A-Za-z0-9_.]{2,32}$/;
const DISCORD_EPOCH = 1420070400000n;

/** The hash of a banner, or null when it is missing or not a plain hash. @param {unknown} value */
function cleanBannerHash(value) {
  return typeof value === 'string' && BANNER_HASH.test(value) ? value : null;
}

/** An id of Discord (digits only), or null. @param {unknown} value */
function cleanSnowflake(value) {
  return typeof value === 'string' && SNOWFLAKE.test(value) ? value : null;
}

/** The accent color of an account: an integer from 0 to 0xFFFFFF, or null. @param {unknown} value */
function cleanAccentColor(value) {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 0xffffff ? value : null;
}

/** `#rrggbb` of an accent color. @param {number} value */
function accentHex(value) {
  return `#${value.toString(16).padStart(6, '0')}`;
}

/**
 * What the session keeps of Discord's user object besides the cosmetics: the @username, the banner hash and the accent color.
 * `null` means "checked, the account has none".
 * @param {any} user the answer of `GET /users/@me`
 * @returns {{ handle: string | null, banner: string | null, accentColor: number | null }}
 */
function profileFromUser(user) {
  const handle = typeof user?.username === 'string' && HANDLE.test(user.username) ? user.username : null;
  return { handle, banner: cleanBannerHash(user?.banner), accentColor: cleanAccentColor(user?.accent_color) };
}

/** The picture of a server banner (a still frame even when it is animated), or null. @param {unknown} guildId @param {unknown} hash */
function guildBannerUrl(guildId, hash) {
  const id = cleanSnowflake(guildId);
  const clean = cleanBannerHash(hash);
  return id && clean ? `${CDN}/banners/${id}/${clean}.webp?size=600` : null;
}

/**
 * The pictures of an account banner: the still one and, only for an animated banner (`a_`), the animated GIF. The page uses the GIF only
 * when the visitor does not ask for reduced motion.
 * @param {unknown} userId @param {unknown} hash
 * @returns {{ still: string, animated: string | null } | null}
 */
function userBannerUrls(userId, hash) {
  const id = cleanSnowflake(userId);
  const clean = cleanBannerHash(hash);
  if (!id || !clean) return null;
  const base = `${CDN}/banners/${id}/${clean}`;
  return clean.startsWith('a_') ? { still: `${base}.png?size=600`, animated: `${base}.gif?size=600` } : { still: `${base}.webp?size=600`, animated: null };
}

/**
 * What fills the banner of a menu header: the picture when there is one, otherwise the account color as a gradient, otherwise the Petto art.
 * @typedef {{ kind: 'image', still: string, animated: string | null } | { kind: 'color', color: string } | { kind: 'art' }} HeaderArt
 */

/** The header art of a server: its banner, or the Petto art. @param {{ id?: unknown, banner?: unknown } | null | undefined} guild @returns {HeaderArt} */
function guildHeaderArt(guild) {
  const still = guildBannerUrl(guild?.id, guild?.banner);
  return still ? { kind: 'image', still, animated: null } : { kind: 'art' };
}

/** The header art of an account: its banner, else its accent color, else the Petto art. @param {{ userId?: unknown, banner?: unknown, accentColor?: unknown } | null | undefined} session @returns {HeaderArt} */
function userHeaderArt(session) {
  const pictures = userBannerUrls(session?.userId, session?.banner);
  if (pictures) return { kind: 'image', ...pictures };
  const color = cleanAccentColor(session?.accentColor);
  return color === null ? { kind: 'art' } : { kind: 'color', color: accentHex(color) };
}

/** The moment an account (or any Discord id) was created, read from its snowflake, or null. @param {unknown} id @returns {Date | null} */
function snowflakeDate(id) {
  const clean = cleanSnowflake(id);
  if (!clean) return null;
  const date = new Date(Number((BigInt(clean) >> 22n) + DISCORD_EPOCH));
  return Number.isNaN(date.getTime()) ? null : date;
}

const PREMIUM_STATES = ['free', 'pending', 'active', 'past_due', 'canceled', 'expired'];

/**
 * The facts of the profile overview, from what the dashboard already has: the session, the servers Discord lists for the account, the
 * servers Petto is in, the Premium snapshot and the few personal rows the bot keeps. Nothing is invented: what is missing is null.
 * @param {{
 *   session: { userId?: unknown, username?: unknown, handle?: unknown },
 *   servers: { mine: unknown[], invite: unknown[], total: { mine: number, invite: number } },
 *   premium?: { status?: unknown, slotsUsed?: unknown, slotsTotal?: unknown, periodEnd?: unknown } | null,
 *   prefix?: unknown,
 *   reputation?: { points?: unknown, servers?: unknown } | null,
 *   top?: number,
 *   inviteTop?: number,
 * }} input
 */
function profileOverview({ session, servers, premium = null, prefix = null, reputation = null, top = 5, inviteTop = 4 }) {
  const name = typeof session.username === 'string' ? session.username.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 80) : '';
  const handle = typeof session.handle === 'string' && HANDLE.test(session.handle) ? session.handle : null;
  const created = snowflakeDate(session.userId);
  const status = typeof premium?.status === 'string' && PREMIUM_STATES.includes(premium.status) ? premium.status : 'free';
  const count = (value) => (typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0);
  const end = typeof premium?.periodEnd === 'string' ? new Date(premium.periodEnd) : null;
  const points = count(reputation?.points);
  const cleanPrefix = typeof prefix === 'string' ? prefix.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 8) : '';
  return {
    name,
    // The @username is shown only when it says something the display name does not.
    handle: handle && handle !== name ? handle : null,
    created: created ? created.toISOString() : null,
    servers: { withPetto: servers.total.mine, toInvite: servers.total.invite, managed: servers.total.mine + servers.total.invite, top: servers.mine.slice(0, top), invite: servers.invite.slice(0, inviteTop), premium: servers.mine.filter((guild) => /** @type {any} */ (guild)?.premium === true).length },
    premium: { status, slotsUsed: count(premium?.slotsUsed), slotsTotal: count(premium?.slotsTotal), endsAt: end && !Number.isNaN(end.getTime()) && status === 'active' ? end.toISOString() : null },
    settings: { prefix: cleanPrefix || null, reputation: points > 0 ? { points, servers: Math.max(1, count(reputation?.servers)) } : null },
  };
}

/**
 * How long an account has existed, as whole years or, under a year, whole months (at least 1), from its creation date.
 * @param {string | null | undefined} created ISO date  @param {number} [now] milliseconds
 * @returns {{ unit: 'year' | 'month', n: number } | null}
 */
function accountAge(created, now = Date.now()) {
  const from = typeof created === 'string' ? new Date(created) : null;
  if (!from || Number.isNaN(from.getTime()) || from.getTime() > now) return null;
  const months = Math.max(0, (new Date(now).getUTCFullYear() - from.getUTCFullYear()) * 12 + new Date(now).getUTCMonth() - from.getUTCMonth() - (new Date(now).getUTCDate() < from.getUTCDate() ? 1 : 0));
  return months >= 12 ? { unit: 'year', n: Math.floor(months / 12) } : { unit: 'month', n: Math.max(1, months) };
}

const REFRESH_SHARE_MS = 2 * 6e4;
const sharedRefreshes = /* @__PURE__ */ new Map();
async function refreshSession(session, clientId, clientSecret) {
  if (!session.refreshToken) return null;
  const now = Date.now();
  for (const [key, entry] of sharedRefreshes) if (now - entry.at > REFRESH_SHARE_MS) sharedRefreshes.delete(key);
  const shared = sharedRefreshes.get(session.refreshToken);
  if (shared) return shared.result.then((done) => done ? { ...session, accessToken: done.accessToken, refreshToken: done.refreshToken, expiresAt: done.expiresAt } : null);
  const result = refreshSessionNow(session, clientId, clientSecret);
  sharedRefreshes.set(session.refreshToken, { at: now, result });
  void result.then((done) => {
    if (!done) sharedRefreshes.delete(session.refreshToken);
  });
  return result;
}
async function refreshSessionNow(session, clientId, clientSecret) {
  try {
    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: session.refreshToken
      })
    });
    if (!response.ok) return null;
    const token = await response.json();
    if (!token.access_token) return null;
    return {
      ...session,
      accessToken: token.access_token,
      refreshToken: token.refresh_token ?? session.refreshToken,
      expiresAt: Date.now() + Number(token.expires_in ?? 3600) * 1e3
    };
  } catch {
    return null;
  }
}
async function persistSessionCookie(astro, session, clientSecret) {
  const encoded = await encodeSession(session, clientSecret);
  astro.cookies.set("petto_session", encoded, {
    httpOnly: true,
    secure: astro.url.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}
async function withCosmetics(astro, session, clientSecret) {
  if (session.decoration !== void 0 && session.nameplate !== void 0 && session.handle !== void 0 && session.banner !== void 0 && session.accentColor !== void 0) return session;
  const request = astro.request;
  const method = String(request?.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD" || !/text\/html/i.test(request?.headers.get("accept") ?? "")) return session;
  const next = await memoPerRequest(request, `dash-cosmetics:${session.userId}`, async () => {
    try {
      const res = await fetch("https://discord.com/api/v10/users/@me", { headers: { Authorization: `Bearer ${session.accessToken}` }, signal: AbortSignal.timeout(2e3) });
      if (!res.ok) return null;
      const user = await res.json();
      const updated = { ...session, ...cosmeticsFromUser(user), ...profileFromUser(user) };
      await persistSessionCookie(astro, updated, clientSecret);
      return updated;
    } catch {
      return null;
    }
  });
  return next ?? session;
}
async function getDashboardSession(astro) {
  const clientId = getEnv(astro, "DISCORD_CLIENT_ID");
  const clientSecret = getEnv(astro, "DISCORD_CLIENT_SECRET");
  const cookie = astro.cookies.get("petto_session")?.value;
  const session = cookie && clientSecret ? await decodeAnySession(cookie, clientSecret) : null;
  if (!session) return null;
  if (!isCurrentSession(session)) {
    try {
      astro.cookies.delete("petto_session", { path: "/" });
    } catch {
    }
    if (astro.locals) astro.locals.sessionStale = true;
    return null;
  }
  const needsRefresh = session.expiresAt <= Date.now() + 6e4;
  if (!needsRefresh || !clientId || !clientSecret) {
    if (session.expiresAt <= Date.now()) return null;
    if (cookie && !cookie.startsWith("v1.") && clientSecret) await persistSessionCookie(astro, session, clientSecret);
    return clientSecret ? withCosmetics(astro, session, clientSecret) : session;
  }
  const refreshed = await refreshSession(session, clientId, clientSecret);
  if (!refreshed) return null;
  await persistSessionCookie(astro, refreshed, clientSecret);
  return refreshed;
}
async function getGuildSession(astro, guildId) {
  const started = performance.now();
  try {
    return await memoPerRequest(astro.request, `guild-session:${guildId}`, () => checkGuildSession(astro, guildId));
  } finally {
    markTiming("auth", started);
  }
}
async function checkGuildSession(astro, guildId) {
  const session = await getDashboardSession(astro);
  if (!session) return { redirect: "/dash" };
  const request = astro.request;
  const isRead = ["GET", "HEAD"].includes(String(request?.method ?? "GET").toUpperCase());
  const wantsPage = /text\/html/i.test(request?.headers.get("accept") ?? "") || Boolean(request?.headers.get("x-dash-partial"));
  if (isRead && wantsPage) void loadDashLayoutData(astro, guildId, session).catch(() => {
  });
  let discordGuilds;
  try {
    discordGuilds = await getCachedUserGuilds(session.accessToken, request, { forAccess: true });
  } catch {
    return { redirect: "/dash?error=discord_unavailable" };
  }
  const target = discordGuilds.find((g) => g.id === guildId);
  if (target && !canManageGuild(target)) {
    const access = await getRoleAccess(astro, guildId, session.userId);
    if (access) {
      const decision = pageDecision(access, pageOf(String(astro.url?.pathname ?? ""), guildId));
      if (!decision.allowed) return { redirect: `/dash/guild/${guildId}/overview?error=no_section` };
      const method = String(request?.method ?? "GET").toUpperCase();
      if (method !== "GET" && method !== "HEAD" && !decision.canEdit) return { redirect: `/dash/guild/${guildId}/overview?error=view_only` };
      return { session, access };
    }
  }
  if (!target || !canManageGuild(target)) {
    if (isPettoOwner(astro, session.userId)) {
      const method = String(astro.request?.method ?? "GET").toUpperCase();
      if (method !== "GET" && method !== "HEAD") {
        const decision = await supportGate(astro, guildId, String(session.userId));
        if (!decision.allowed) return { redirect: `/dash/guild/${guildId}/overview?error=dev_readonly` };
      }
      return { session, devView: true };
    }
    return { redirect: "/dash/manage?error=no_access" };
  }
  return { session };
}

export { ACCESS_SECTIONS as A, getGuildSession as a, userHeaderArt as b, profileFromUser as c, cosmeticsFromUser as d, encodeSession as e, forgetRules as f, getDashboardSession as g, loadDashLayoutData as h, pageOf as i, guildHeaderArt as j, supportPageOf as k, loadRules as l, supportLabels as m, guildsWithRoleAccess as n, accountAge as o, pageDecision as p, profileOverview as q, recordSupportEdit as r, supportPolicyFor as s, supportRefusal as t, userCardData as u };
