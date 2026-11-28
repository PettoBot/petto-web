import { g as getEnv } from './env_WnBvzCjc.mjs';

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])$/;
function cleanSlug(value) {
  return String(value ?? "").trim().toLowerCase().replace(/^https?:\/\/[^/]+\/appeal\//, "").replace(/[\s_]+/g, "-").replace(/-{2,}/g, "-").replace(/^-+|-+$/g, "");
}
const RESERVED = /* @__PURE__ */ new Set([
  "login",
  "logout",
  "form",
  "forms",
  "status",
  "api",
  "dash",
  "dashboard",
  "admin",
  "administrator",
  "root",
  "system",
  "support",
  "soporte",
  "help",
  "ayuda",
  "staff",
  "team",
  "equipo",
  "mod",
  "mods",
  "moderator",
  "owner",
  "ceo",
  "official",
  "oficial",
  "verified",
  "verificado",
  "bot",
  "bots",
  "www",
  "mail",
  "blog",
  "docs",
  "wiki",
  "status",
  "premium",
  "brand",
  "credits",
  "apply",
  "partners",
  "terms",
  "privacy",
  "cookies",
  "refunds",
  "faq",
  "feedback",
  "changelog",
  "roadmap",
  "stats",
  "commands",
  "new",
  "null",
  "undefined",
  "everyone",
  "here",
  "me",
  "you",
  "discord",
  "petto",
  "pettobot",
  "valorant",
  "riot",
  "riotgames",
  "leagueoflegends",
  "lol",
  "minecraft",
  "mojang",
  "fortnite",
  "epicgames",
  "roblox",
  "steam",
  "valve",
  "blizzard",
  "overwatch",
  "youtube",
  "twitch",
  "tiktok",
  "instagram",
  "whatsapp",
  "telegram",
  "twitter",
  "facebook",
  "meta",
  "google",
  "apple",
  "microsoft",
  "xbox",
  "playstation",
  "nintendo",
  "netflix",
  "spotify",
  "paypal",
  "binance",
  "nitro",
  "amongus",
  "genshin",
  "hoyoverse",
  "ea",
  "ubisoft",
  "rockstar",
  "gta",
  "cod",
  "warzone"
]);
const RESERVED_INSIDE = ["discord", "petto", "valorant", "minecraft", "fortnite", "roblox", "youtube", "twitch", "tiktok", "instagram", "whatsapp", "telegram", "netflix", "spotify", "paypal", "binance", "official", "oficial", "support", "soporte", "moderator"];
const OFFENSIVE_INSIDE = [
  "fuck",
  "shit",
  "bitch",
  "cunt",
  "nigg",
  "faggot",
  "whore",
  "slut",
  "rape",
  "rapist",
  "nazi",
  "hitler",
  "porn",
  "pedo",
  "molest",
  "blowjob",
  "cocksuck",
  "dick",
  "pussy",
  "penis",
  "vagina",
  "cum",
  "anal",
  "sex",
  "xxx",
  "incest",
  "puta",
  "puto",
  "mierda",
  "pendej",
  "cabron",
  "cabrona",
  "chingad",
  "verga",
  "culo",
  "coger",
  "follar",
  "violador",
  "violar",
  "marica",
  "maricon",
  "zorra",
  "perra",
  "gilipoll",
  "hijueputa",
  "hdp",
  "malparid",
  "gonorrea",
  "sidoso",
  "negrata",
  "sudaca",
  "mamaguevo",
  "pene",
  "vaina",
  "caralho",
  "buceta",
  "porra",
  "foda",
  "foder",
  "viado",
  "cuzao",
  "arrombad",
  "desgraca",
  "estupro",
  "pornografia",
  "pornô",
  "kkk",
  "isis",
  "suicid",
  "cp"
];
const OFFENSIVE_WHOLE = /* @__PURE__ */ new Set(["cum", "anal", "sex", "xxx", "cp", "hdp", "kkk", "isis", "pene", "vaina", "dick", "rape", "puta", "puto", "culo", "foda", "foder", "porra", "perra", "zorra"]);
const LEET = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", $: "s" };
const normalize = (slug) => slug.replace(/[013457@$]/g, (c) => LEET[c] ?? c).replace(/-/g, "");
function slugProblem(slug, isTeam = false) {
  if (!SLUG_PATTERN.test(slug)) return "format";
  if (/^\d+$/.test(slug)) return "numeric";
  const flat = normalize(slug);
  const parts = slug.split("-").map(normalize);
  if (OFFENSIVE_INSIDE.some((word) => OFFENSIVE_WHOLE.has(word) ? parts.includes(word) || flat === word : flat.includes(word))) return "offensive";
  if (!isTeam && (RESERVED.has(slug) || RESERVED.has(flat) || RESERVED_INSIDE.some((word) => flat.includes(word)))) return "reserved";
  return null;
}

const RESERVE_DAYS = 30;
async function reservationOf(ctx, slug) {
  const now = encodeURIComponent((/* @__PURE__ */ new Date()).toISOString());
  return (await rows(ctx, `appeal_name_reservations?slug=eq.${encodeURIComponent(slug)}&reserved_until=gt.${now}&select=guild_id&limit=1`))?.[0]?.guild_id ?? null;
}
async function reserveName(ctx, slug, guildId) {
  const until = new Date(Date.now() + RESERVE_DAYS * 864e5).toISOString();
  const res = await rest(ctx, "appeal_name_reservations?on_conflict=slug", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ slug, guild_id: guildId, reserved_until: until }) });
  return Boolean(res?.ok);
}
async function dropReservation(ctx, slug) {
  await rest(ctx, `appeal_name_reservations?slug=eq.${encodeURIComponent(slug)}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
}
const CLAIM_LIMITS = { reasonMin: 20, reasonMax: 1e3, url: 300, perMonth: 5 };
function conn(ctx) {
  const url = getEnv(ctx, "PETTO_BOT_API_URL")?.replace(/\/+$/, "");
  const key = getEnv(ctx, "PETTO_BOT_API_SECRET");
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" } } : null;
}
async function rest(ctx, path, init = {}) {
  const c = conn(ctx);
  if (!c) return null;
  try {
    return await fetch(`${c.url}/rest/v1/${path}`, { ...init, headers: { ...c.headers, ...init.headers }, signal: AbortSignal.timeout(8e3) });
  } catch {
    return null;
  }
}
async function rows(ctx, path) {
  const res = await rest(ctx, path);
  return res?.ok ? await res.json() : null;
}
const https = (value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};
const clean = (value, max) => String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);
async function openClaim(ctx, guildId) {
  return (await rows(ctx, `appeal_name_claims?guild_id=eq.${guildId}&status=eq.pending&select=*&limit=1`))?.[0] ?? null;
}
async function lastDecidedClaim(ctx, guildId) {
  return (await rows(ctx, `appeal_name_claims?guild_id=eq.${guildId}&status=in.(approved,denied)&select=*&order=decided_at.desc&limit=1`))?.[0] ?? null;
}
async function createClaim(ctx, input) {
  if (!conn(ctx)) return { ok: false, error: "not_configured" };
  if (slugProblem(input.slug, false)) return { ok: false, error: "slug" };
  const reason = clean(input.reason, CLAIM_LIMITS.reasonMax);
  if (reason.length < CLAIM_LIMITS.reasonMin) return { ok: false, error: "reason" };
  const serverUrl = clean(input.serverUrl, CLAIM_LIMITS.url);
  if (!https(serverUrl)) return { ok: false, error: "url" };
  const extra = clean(input.extraUrl, CLAIM_LIMITS.url);
  if (extra && !https(extra)) return { ok: false, error: "extra_url" };
  if (await openClaim(ctx, input.guildId)) return { ok: false, error: "pending" };
  const since = new Date(Date.now() - 30 * 864e5).toISOString();
  const recent = await rows(ctx, `appeal_name_claims?guild_id=eq.${input.guildId}&created_at=gte.${encodeURIComponent(since)}&select=id`);
  if ((recent?.length ?? 0) >= CLAIM_LIMITS.perMonth) return { ok: false, error: "limit" };
  const holder = await rows(ctx, `appeal_config?slug=eq.${encodeURIComponent(input.slug)}&select=guild_id&limit=1`);
  if (holder && !holder.length && !await reservationOf(ctx, input.slug)) return { ok: false, error: "taken_gone" };
  const res = await rest(ctx, "appeal_name_claims", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ guild_id: input.guildId, slug: input.slug, user_id: input.userId, username: clean(input.username, 80), reason, server_url: serverUrl, extra_url: extra || null }) });
  if (!res) return { ok: false, error: "database" };
  if (res.status === 409) return { ok: false, error: "pending" };
  if (!res.ok) return { ok: false, error: "database" };
  const claim = (await res.json())[0];
  void notifyTeam(ctx, claim);
  return { ok: true, claim };
}
async function cancelClaim(ctx, guildId) {
  const res = await rest(ctx, `appeal_name_claims?guild_id=eq.${guildId}&status=eq.pending`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "cancelled", decided_at: (/* @__PURE__ */ new Date()).toISOString() }) });
  return Boolean(res?.ok);
}
async function listClaims(ctx, filter) {
  const query = filter === "pending" ? "status=eq.pending&order=created_at.asc&limit=100" : "status=in.(approved,denied)&order=decided_at.desc&limit=30";
  return await rows(ctx, `appeal_name_claims?${query}&select=*`) ?? [];
}
async function holderOf(ctx, slug) {
  return (await rows(ctx, `appeal_config?slug=eq.${encodeURIComponent(slug)}&select=guild_id&limit=1`))?.[0]?.guild_id ?? null;
}
async function approveClaim(ctx, claimId, by, note) {
  const claim = (await rows(ctx, `appeal_name_claims?id=eq.${claimId}&status=eq.pending&select=*`))?.[0];
  if (!claim) return { ok: false, error: "gone" };
  const holder = await holderOf(ctx, claim.slug);
  if (holder && holder !== claim.guild_id) {
    const freed = await rest(ctx, `appeal_config?guild_id=eq.${holder}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ slug: null }) });
    if (!freed?.ok) return { ok: false, error: "database" };
  }
  const set = await rest(ctx, "appeal_config?on_conflict=guild_id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ guild_id: claim.guild_id, slug: claim.slug, updated_at: (/* @__PURE__ */ new Date()).toISOString() }) });
  if (!set?.ok) return { ok: false, error: "database" };
  await dropReservation(ctx, claim.slug);
  const done = await rest(ctx, `appeal_name_claims?id=eq.${claimId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "approved", note: clean(note, 500) || null, decided_by: by.id, decided_by_name: clean(by.name, 80), decided_at: (/* @__PURE__ */ new Date()).toISOString() }) });
  return done?.ok ? { ok: true } : { ok: false, error: "database" };
}
async function denyClaim(ctx, claimId, by, note) {
  const res = await rest(ctx, `appeal_name_claims?id=eq.${claimId}&status=eq.pending`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "denied", note: clean(note, 500) || null, decided_by: by.id, decided_by_name: clean(by.name, 80), decided_at: (/* @__PURE__ */ new Date()).toISOString() }) });
  return Boolean(res?.ok);
}
async function listNames(ctx, query) {
  const q = query.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 32);
  const filter = q ? `&slug=ilike.*${q}*` : "";
  return await rows(ctx, `appeal_config?slug=not.is.null${filter}&select=guild_id,slug,enabled,updated_at&order=slug.asc&limit=100`) ?? [];
}
async function releaseName(ctx, guildId) {
  const res = await rest(ctx, `appeal_config?guild_id=eq.${guildId}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ slug: null }) });
  return Boolean(res?.ok);
}
async function notifyTeam(ctx, claim) {
  const hook = getEnv(ctx, "APPEAL_CLAIMS_WEBHOOK_URL");
  if (!hook || !https(hook)) return;
  const site = getEnv(ctx, "PUBLIC_SITE_URL") ?? "https://petto.sbs";
  try {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(6e3),
      body: JSON.stringify({ username: "Petto", allowed_mentions: { parse: [] }, embeds: [{ title: `Name request: ${claim.slug}`, color: 15771791, description: `${claim.username} (\`${claim.user_id}\`) asks for **${claim.slug}**.

${claim.reason.slice(0, 600)}

[Server](${claim.server_url}) · [Review it](${site}/dash/appeal-names)` }] })
    });
  } catch {
  }
}

export { approveClaim as a, listNames as b, cleanSlug as c, denyClaim as d, reservationOf as e, reserveName as f, dropReservation as g, holderOf as h, createClaim as i, cancelClaim as j, lastDecidedClaim as k, listClaims as l, openClaim as o, releaseName as r, slugProblem as s };
