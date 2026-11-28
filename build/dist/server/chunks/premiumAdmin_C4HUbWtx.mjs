import { g as getEnv } from './env_WnBvzCjc.mjs';
import { a as getGuildLookOverrides, s as setBotGuildProfile, b as setBotNameStyle } from './discord_CxeBz2tv.mjs';
import { cached, invalidatePrefix } from './sharedCache_DFk4ml3Q.mjs';

const DEFAULT_POLAR_PRODUCTS = {
  "premium-1-month": "15621107-ba45-4f62-a648-636f23c0f9e3",
  "premium-1-year": "da48d960-a600-461a-b251-8cb684b1cb5f",
  "premium-3-month": "b7636ff3-c73a-4274-9850-3d4446e3df11",
  "premium-3-year": "1dc59fa1-f358-4172-9327-a61069882366",
  "premium-5-month": "1ec97d11-63af-4573-af09-3075567c4cc7",
  "premium-5-year": "5361b1ef-97e2-470d-8fe3-25da2b49aeeb"
};
function config(astro) {
  const url = getEnv(astro, "PETTO_BOT_API_URL");
  const key = getEnv(astro, "PETTO_BOT_API_SECRET");
  return url && key ? { url, key } : null;
}
function headers$1(key, extra = {}) {
  return { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json", ...extra };
}
function polarApiBase(astro) {
  return (getEnv(astro, "POLAR_SERVER") || "production").toLowerCase() === "sandbox" ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";
}
async function read$1(astro, table, query) {
  const settings = config(astro);
  if (!settings) return [];
  try {
    const response = await fetch(`${settings.url}/rest/v1/${table}?${query}`, { headers: headers$1(settings.key) });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
async function releaseExpiredEntitlement(astro, entitlementId, assignments) {
  const settings = config(astro);
  if (!settings || !assignments.length) return;
  await Promise.all(assignments.map(async (assignment) => {
    await resetGuildPremiumCustomization(astro, assignment.guild_id);
    await fetch(`${settings.url}/rest/v1/premium_slot_assignments?id=eq.${assignment.id}&status=eq.active`, {
      method: "PATCH",
      headers: headers$1(settings.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify({ status: "released", released_at: (/* @__PURE__ */ new Date()).toISOString() })
    }).catch(() => null);
  }));
}
function isActiveEntitlement(entitlement) {
  if (entitlement.status !== "active") return false;
  if (!entitlement.current_period_end) return true;
  const periodEnd = new Date(entitlement.current_period_end).getTime();
  return Number.isFinite(periodEnd) && periodEnd > Date.now();
}
const PREMIUM_TTL_MS = 6e4;
const requestSnapshots = /* @__PURE__ */ new WeakMap();
function forgetPremiumSnapshots(userId) {
  invalidatePrefix(userId ? `premium:${userId}` : "premium:");
  if (userId) invalidatePrefix("premium:guild:");
}
function getPremiumSnapshot(astro, userId) {
  const request = astro?.request;
  const method = String(request?.method ?? "GET").toUpperCase();
  const key = `premium:${userId}`;
  const keepIt = () => cached(key, () => loadPremiumSnapshot(astro, userId), { freshMs: PREMIUM_TTL_MS });
  if (!request || method !== "GET" && method !== "HEAD") {
    forgetPremiumSnapshots(userId);
    return keepIt();
  }
  let byUser = requestSnapshots.get(request);
  if (!byUser) requestSnapshots.set(request, byUser = /* @__PURE__ */ new Map());
  let pending = byUser.get(userId);
  if (!pending) {
    pending = keepIt();
    byUser.set(userId, pending);
    pending.catch(() => byUser?.delete(userId));
  }
  return pending;
}
async function loadPremiumSnapshot(astro, userId) {
  const encodedUser = encodeURIComponent(userId);
  const [entitlements, assignments, requests] = await Promise.all([
    read$1(astro, "premium_entitlements", `user_id=eq.${encodedUser}&status=in.(active,pending,past_due,canceled,expired)&select=id,user_id,provider,plan_key,status,slot_limit,current_period_end,created_at,updated_at,metadata&order=created_at.desc&limit=25`),
    read$1(astro, "premium_slot_assignments", `user_id=eq.${encodedUser}&select=id,entitlement_id,user_id,guild_id,status,assigned_at,released_at&order=assigned_at.desc`),
    read$1(astro, "premium_slot_requests", `user_id=eq.${encodedUser}&status=eq.pending&select=id,user_id,guild_id,status&order=created_at.desc`)
  ]);
  const activeEntitlements = entitlements.filter(isActiveEntitlement);
  const activeEntitlementIds = new Set(activeEntitlements.map((candidate) => candidate.id));
  const latest = entitlements[0] ?? null;
  const entitlement = activeEntitlements.find((candidate) => assignments.some((assignment) => assignment.status === "active" && assignment.entitlement_id === candidate.id)) ?? activeEntitlements[0] ?? null;
  const activeAssignments = assignments.filter((assignment) => assignment.status === "active" && activeEntitlementIds.has(assignment.entitlement_id));
  const status = entitlement ? "active" : latest?.status === "active" && latest.current_period_end && !isActiveEntitlement(latest) ? "expired" : latest?.status ?? "free";
  const slotsTotal = activeEntitlements.reduce((total, candidate) => total + Math.max(0, candidate.slot_limit), 0);
  const staleEntitlements = entitlements.filter((candidate) => candidate.status === "active" && !activeEntitlementIds.has(candidate.id));
  await Promise.all(staleEntitlements.map((candidate) => releaseExpiredEntitlement(
    astro,
    candidate.id,
    assignments.filter((assignment) => assignment.status === "active" && assignment.entitlement_id === candidate.id)
  )));
  return {
    status,
    entitlement,
    assignments: activeAssignments,
    requests,
    slotsUsed: activeAssignments.length,
    slotsTotal,
    history: entitlements
  };
}
function getPremiumGuildIds(astro, userId, guildIds) {
  const ids = [...new Set(guildIds.filter((id) => /^\d{15,25}$/.test(id)))].sort();
  if (!ids.length) return Promise.resolve(/* @__PURE__ */ new Set());
  const key = `premium:${userId}:guilds:${ids.join(",")}`.slice(0, 480);
  const method = String(astro?.request?.method ?? "GET").toUpperCase();
  return cached(key, () => loadPremiumGuildIds(astro, ids), { freshMs: 3e4, staleMs: 36e5, allowStale: method === "GET" || method === "HEAD", keep: () => true });
}
async function loadPremiumGuildIds(astro, ids) {
  const found = /* @__PURE__ */ new Set();
  const slots = await read$1(astro, "premium_slot_assignments", `guild_id=in.(${ids.join(",")})&status=eq.active&select=guild_id,entitlement_id`);
  if (!slots.length) return found;
  const entitlementIds = [...new Set(slots.map((slot) => slot.entitlement_id))];
  const entitlements = await read$1(astro, "premium_entitlements", `id=in.(${entitlementIds.join(",")})&select=id,user_id,provider,plan_key,status,slot_limit,current_period_end`);
  const valid = new Set(entitlements.filter(isActiveEntitlement).map((entitlement) => entitlement.id));
  for (const slot of slots) if (valid.has(slot.entitlement_id)) found.add(slot.guild_id);
  return found;
}
async function hasPremiumForGuild(astro, userId, guildId) {
  return (await getPremiumGuildIds(astro, userId, [guildId])).has(guildId);
}
async function createPremiumCheckout(astro, userId, plan, termsAcceptedAt) {
  const token = getEnv(astro, "POLAR_ACCESS_TOKEN");
  if (!token || !/^\d{15,22}$/.test(userId)) return null;
  const [slots, interval] = String(plan).split("-").slice(1);
  const planKey = `premium-${slots}-${interval}`;
  const productId = getEnv(astro, `POLAR_PRODUCT_PREMIUM_${slots}_${interval.toUpperCase()}`) || DEFAULT_POLAR_PRODUCTS[planKey];
  if (!productId || !["1", "3", "5"].includes(slots) || !["month", "year"].includes(interval)) return null;
  const origin = astro.url?.origin || getEnv(astro, "PUBLIC_SITE_URL") || "https://petto.sbs";
  const apiBase = polarApiBase(astro);
  try {
    const response = await fetch(`${apiBase}/v1/checkouts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        products: [productId],
        external_customer_id: userId,
        metadata: { plan_key: `premium-${slots}`, slot_limit: Number(slots), discord_user_id: userId, ...termsAcceptedAt ? { terms_accepted_at: termsAcceptedAt } : {} },
        success_url: `${origin}/dash/premium?checkout_id={CHECKOUT_ID}`,
        return_url: `${origin}/dash/premium`
      })
    });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.url === "string" ? data.url : null;
  } catch {
    return null;
  }
}
async function askPolarCheckout(astro, token, body) {
  try {
    const response = await fetch(`${polarApiBase(astro)}/v1/checkouts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      let detail = "";
      try {
        const data2 = await response.json();
        detail = typeof data2?.detail === "string" ? data2.detail : Array.isArray(data2?.detail) ? data2.detail.map((item) => `${(item?.loc ?? []).slice(1).join(".")} ${item?.msg ?? ""}`.trim()).join("; ") : String(data2?.error_description ?? data2?.error ?? "");
      } catch {
      }
      const why = `Polar ${response.status}${detail ? `: ${detail}` : ""}`.slice(0, 220);
      console.error("[polar-checkout]", why);
      return { url: null, why };
    }
    const data = await response.json();
    return typeof data?.url === "string" ? { url: data.url, why: null } : { url: null, why: "Polar answered without an address" };
  } catch (error) {
    console.error("[polar-checkout]", error);
    return { url: null, why: "Polar could not be reached" };
  }
}
function planProductId(astro, plan) {
  if (!["bronze", "silver", "gold"].includes(plan)) return null;
  return getEnv(astro, `POLAR_PRODUCT_PLAN_${plan.toUpperCase()}`)?.trim() || null;
}
async function activeUserPlan(astro, userId) {
  const rows = await read$1(astro, "user_plans", `user_id=eq.${encodeURIComponent(userId)}&select=plan,ends_at`);
  const row = rows[0];
  if (!row || row.ends_at && new Date(row.ends_at).getTime() <= Date.now()) return null;
  return { plan: row.plan, endsAt: row.ends_at };
}
function planCheckoutReady(astro) {
  const token = Boolean(getEnv(astro, "POLAR_ACCESS_TOKEN"));
  return { bronze: token && Boolean(planProductId(astro, "bronze")), silver: token && Boolean(planProductId(astro, "silver")), gold: token && Boolean(planProductId(astro, "gold")) };
}
async function createPlanCheckout(astro, userId, plan, termsAcceptedAt) {
  const token = getEnv(astro, "POLAR_ACCESS_TOKEN")?.trim();
  const productId = planProductId(astro, plan);
  if (!token || !productId || !/^\d{15,22}$/.test(userId)) return { url: null, why: !token ? "POLAR_ACCESS_TOKEN is not set" : !productId ? `POLAR_PRODUCT_PLAN_${plan.toUpperCase()} is not set` : "The user id is not valid" };
  const origin = astro.url?.origin || getEnv(astro, "PUBLIC_SITE_URL") || "https://petto.sbs";
  return askPolarCheckout(astro, token, {
    products: [productId],
    external_customer_id: userId,
    metadata: { kind: "user_plan", plan, discord_user_id: userId, ...termsAcceptedAt ? { terms_accepted_at: termsAcceptedAt } : {} },
    success_url: `${origin}/dash/plan?checkout_id={CHECKOUT_ID}`,
    return_url: `${origin}/dash/plans`
  });
}
async function createPremiumCustomerPortalSession(astro, userId) {
  const token = getEnv(astro, "POLAR_ACCESS_TOKEN");
  if (!token || !/^\d{15,22}$/.test(userId)) return null;
  const origin = astro.url?.origin || getEnv(astro, "PUBLIC_SITE_URL") || "https://petto.sbs";
  try {
    const customerResponse = await fetch(`${polarApiBase(astro)}/v1/customers/external/${encodeURIComponent(userId)}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    });
    if (!customerResponse.ok) return null;
    const customer = await customerResponse.json();
    if (typeof customer?.id !== "string") return null;
    const response = await fetch(`${polarApiBase(astro)}/v1/customer-sessions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customer.id, return_url: `${origin}/dash/premium` })
    });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.customer_portal_url === "string" ? data.customer_portal_url : null;
  } catch {
    return null;
  }
}
async function requestPremiumServer(astro, userId, guildId) {
  const settings = config(astro);
  if (!settings || !/^\d{15,22}$/.test(userId) || !/^\d{15,22}$/.test(guildId)) return false;
  try {
    const owned = await read$1(
      astro,
      "premium_entitlements",
      `user_id=eq.${encodeURIComponent(userId)}&status=eq.active&select=id,provider,slot_limit,current_period_end&order=updated_at.desc`
    );
    const live = owned.filter((candidate) => !candidate.current_period_end || new Date(candidate.current_period_end).getTime() > Date.now());
    live.sort((left, right) => (left.current_period_end ? new Date(left.current_period_end).getTime() : Infinity) < (right.current_period_end ? new Date(right.current_period_end).getTime() : Infinity) ? 1 : -1);
    if (live.length) {
      const assignmentsOf = /* @__PURE__ */ new Map();
      for (const candidate of live) {
        assignmentsOf.set(candidate.id, await read$1(
          astro,
          "premium_slot_assignments",
          `entitlement_id=eq.${candidate.id}&status=eq.active&select=id,user_id,guild_id`
        ));
      }
      if ([...assignmentsOf.values()].some((rows) => rows.some((assignment) => assignment.guild_id === guildId))) return true;
      const serverAssignments = await read$1(
        astro,
        "premium_slot_assignments",
        `guild_id=eq.${encodeURIComponent(guildId)}&status=eq.active&select=id,user_id`
      );
      if (serverAssignments.some((assignment) => assignment.user_id !== userId)) return false;
      const entitlement = live.find((candidate) => (assignmentsOf.get(candidate.id)?.length ?? 0) < Math.max(0, candidate.slot_limit));
      if (!entitlement) return false;
      const previousAssignmentResponse = await fetch(`${settings.url}/rest/v1/premium_slot_assignments?user_id=eq.${encodeURIComponent(userId)}&guild_id=eq.${encodeURIComponent(guildId)}&status=eq.active`, {
        method: "PATCH",
        headers: headers$1(settings.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
        body: JSON.stringify({ status: "released", released_at: (/* @__PURE__ */ new Date()).toISOString() })
      });
      if (!previousAssignmentResponse.ok) return false;
      const assignmentResponse = await fetch(`${settings.url}/rest/v1/premium_slot_assignments?on_conflict=entitlement_id,guild_id`, {
        method: "POST",
        headers: headers$1(settings.key, { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }),
        body: JSON.stringify({ entitlement_id: entitlement.id, user_id: userId, guild_id: guildId, status: "active", released_at: null })
      });
      if (assignmentResponse.ok) {
        await fetch(`${settings.url}/rest/v1/premium_slot_requests?user_id=eq.${encodeURIComponent(userId)}&guild_id=eq.${encodeURIComponent(guildId)}&status=eq.pending`, {
          method: "PATCH",
          headers: headers$1(settings.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
          body: JSON.stringify({ status: "approved", updated_at: (/* @__PURE__ */ new Date()).toISOString() })
        }).catch(() => null);
      }
      return assignmentResponse.ok;
    }
    const response = await fetch(`${settings.url}/rest/v1/premium_slot_requests?on_conflict=user_id,guild_id`, {
      method: "POST",
      headers: headers$1(settings.key, { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify({ user_id: userId, guild_id: guildId, status: "pending", updated_at: (/* @__PURE__ */ new Date()).toISOString() })
    });
    return response.ok;
  } catch {
    return false;
  }
}
async function cancelPremiumServerRequest(astro, userId, guildId) {
  const settings = config(astro);
  if (!settings) return false;
  try {
    const response = await fetch(`${settings.url}/rest/v1/premium_slot_requests?user_id=eq.${encodeURIComponent(userId)}&guild_id=eq.${encodeURIComponent(guildId)}&status=eq.pending`, {
      method: "PATCH",
      headers: headers$1(settings.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify({ status: "canceled", updated_at: (/* @__PURE__ */ new Date()).toISOString() })
    });
    return response.ok;
  } catch {
    return false;
  }
}
async function releasePremiumServer(astro, userId, guildId) {
  const settings = config(astro);
  if (!settings) return false;
  try {
    const response = await fetch(`${settings.url}/rest/v1/premium_slot_assignments?user_id=eq.${encodeURIComponent(userId)}&guild_id=eq.${encodeURIComponent(guildId)}&status=eq.active`, {
      method: "PATCH",
      headers: headers$1(settings.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify({ status: "released", released_at: (/* @__PURE__ */ new Date()).toISOString() })
    });
    if (!response.ok) return false;
    await resetGuildPremiumCustomization(astro, guildId);
    return true;
  } catch {
    return false;
  }
}
const CLEAN_CHECK_MS = 10 * 6e4;
const checkedClean = /* @__PURE__ */ new Map();
async function resetGuildPremiumCustomizationIfStale(astro, guildId) {
  const until = checkedClean.get(guildId);
  if (until && until > Date.now()) return;
  const settings = config(astro);
  const guildResponse = settings ? await fetch(`${settings.url}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(guildId)}&select=bot_avatar_url,bot_banner_url,bot_description,bot_name_style`, { headers: headers$1(settings.key) }).catch(() => null) : null;
  const rows = guildResponse?.ok ? await guildResponse.json().catch(() => null) : null;
  const row = Array.isArray(rows) ? rows[0] ?? {} : null;
  if (row && !row.bot_avatar_url && !row.bot_banner_url && !row.bot_description && !row.bot_name_style) {
    const botToken = getEnv(astro, "DISCORD_TOKEN");
    const overrides = botToken ? await getGuildLookOverrides(guildId, botToken) : null;
    if (!overrides?.avatar && !overrides?.banner) {
      if (checkedClean.size > 5e3) checkedClean.clear();
      checkedClean.set(guildId, Date.now() + CLEAN_CHECK_MS);
      return;
    }
  }
  await resetGuildPremiumCustomization(astro, guildId);
}
async function resetGuildPremiumCustomization(astro, guildId) {
  const settings = config(astro);
  if (!settings || !/^\d{15,22}$/.test(String(guildId))) return false;
  const botToken = getEnv(astro, "DISCORD_TOKEN");
  const [guildResponse, overrides] = await Promise.all([
    fetch(`${settings.url}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(guildId)}&select=bot_nickname,bot_avatar_url,bot_banner_url,bot_description`, {
      headers: headers$1(settings.key)
    }).catch(() => null),
    botToken ? getGuildLookOverrides(guildId, botToken) : Promise.resolve(null)
  ]);
  if (!guildResponse?.ok) return false;
  const guildRows = await guildResponse.json();
  const hasPremiumCustomization = Boolean(guildRows[0]?.bot_avatar_url || guildRows[0]?.bot_banner_url || guildRows[0]?.bot_description);
  const discordHasLook = Boolean(overrides?.avatar || overrides?.banner);
  const databaseReset = !hasPremiumCustomization || await fetch(`${settings.url}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(guildId)}`, {
    method: "PATCH",
    headers: headers$1(settings.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify({ bot_avatar_url: null, bot_banner_url: null, bot_description: null, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
  }).then((response) => response.ok).catch(() => false);
  await resetNameStyle(settings, botToken, guildId);
  if (!botToken) return databaseReset;
  if (!hasPremiumCustomization && !discordHasLook) return databaseReset;
  const discordReset = await setBotGuildProfile(guildId, botToken, { avatarDataUri: null, bannerDataUri: null, bio: null });
  return databaseReset && discordReset;
}
async function resetNameStyle(settings, botToken, guildId) {
  try {
    const response = await fetch(`${settings.url}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(guildId)}&select=bot_name_style`, { headers: headers$1(settings.key) });
    if (!response.ok) return;
    const rows = await response.json();
    if (!rows[0]?.bot_name_style) return;
    await fetch(`${settings.url}/rest/v1/guilds?guild_id=eq.${encodeURIComponent(guildId)}`, {
      method: "PATCH",
      headers: headers$1(settings.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify({ bot_name_style: null, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
    });
    if (botToken) await setBotNameStyle(guildId, botToken, null);
  } catch {
  }
}
function coinPackProductId(astro, packId) {
  if (!/^[a-z0-9][a-z0-9-]{2,30}$/.test(packId)) return null;
  return getEnv(astro, `POLAR_PRODUCT_COINS_${packId.toUpperCase().replace(/-/g, "_")}`)?.trim() || null;
}
function coinCheckoutReady(astro, packIds) {
  const token = Boolean(getEnv(astro, "POLAR_ACCESS_TOKEN"));
  return Object.fromEntries(packIds.map((id) => [id, token && Boolean(coinPackProductId(astro, id))]));
}
async function createCoinCheckout(astro, userId, packId, termsAcceptedAt) {
  const token = getEnv(astro, "POLAR_ACCESS_TOKEN")?.trim();
  const productId = coinPackProductId(astro, packId);
  if (!token || !productId || !/^\d{15,22}$/.test(userId)) return { url: null, why: !token ? "POLAR_ACCESS_TOKEN is not set" : !productId ? `POLAR_PRODUCT_COINS_${packId.toUpperCase().replace(/-/g, "_")} is not set` : "The user id is not valid" };
  const origin = astro.url?.origin || getEnv(astro, "PUBLIC_SITE_URL") || "https://petto.sbs";
  return askPolarCheckout(astro, token, {
    products: [productId],
    external_customer_id: userId,
    metadata: { kind: "ceramos_pack", pack: packId, discord_user_id: userId, ...termsAcceptedAt ? { terms_accepted_at: termsAcceptedAt } : {} },
    success_url: `${origin}/dash/buy-ceramos?paid=1`,
    return_url: `${origin}/dash/buy-ceramos`
  });
}

const PETTO_OWNER_ID = "293504726505357312";
function settings(astro) {
  const url = getEnv(astro, "PETTO_BOT_API_URL");
  const key = getEnv(astro, "PETTO_BOT_API_SECRET");
  return url && key ? { url, key } : null;
}
function headers(key, extra = {}) {
  return { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json", ...extra };
}
function validDiscordId(value) {
  return /^\d{15,22}$/.test(value);
}
function ownerIds(astro) {
  const listed = String(getEnv(astro, "PETTO_OWNER_ID") ?? "").split(/[\s,;]+/).map((part) => part.replace(/\D/g, "")).filter(validDiscordId);
  return listed.length ? [...new Set(listed)] : [PETTO_OWNER_ID];
}
function ownerId(astro) {
  return ownerIds(astro)[0];
}
function isPettoOwner(astro, userId) {
  return validDiscordId(userId) && ownerIds(astro).includes(userId);
}
async function read(astro, table, query) {
  const config = settings(astro);
  if (!config) return [];
  try {
    const response = await fetch(`${config.url}/rest/v1/${table}?${query}`, { headers: headers(config.key) });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
const DURATIONS = ["permanent", "1m", "3m", "6m", "1y", "date"];
const DURATION_MONTHS = { "1m": 1, "3m": 3, "6m": 6, "1y": 12 };
const MAX_DATE_YEARS = 10;
function addMonthsUtc(from, months) {
  const total = from.getUTCMonth() + months;
  const year = from.getUTCFullYear() + Math.floor(total / 12);
  const month = (total % 12 + 12) % 12;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(from.getUTCDate(), lastDay), from.getUTCHours(), from.getUTCMinutes(), from.getUTCSeconds(), from.getUTCMilliseconds()));
}
function endOfDayUtc(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
}
function parseUntilDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}
function isLiveEntitlement(entitlement, now = Date.now()) {
  if (!entitlement || entitlement.status !== "active") return false;
  if (!entitlement.current_period_end) return true;
  const periodEnd = new Date(entitlement.current_period_end).getTime();
  return Number.isFinite(periodEnd) && periodEnd > now;
}
function grantState(grant, now = Date.now()) {
  if (isLiveEntitlement(grant, now)) return grant.current_period_end ? "timed" : "permanent";
  if (grant.status !== "active" && grant.metadata?.revoked_at) return "revoked";
  return "expired";
}
function grantTarget(grant) {
  const match = /^manual:(user|server):(\d+)$/.exec(grant.provider_subscription_id ?? "");
  if (match) return { type: match[1], id: match[2] };
  if (grant.metadata?.target_type === "server") return { type: "server", id: String(grant.metadata.target_guild_id ?? "") };
  return { type: "user", id: grant.user_id };
}
function daysLeft(end, now = Date.now()) {
  return Math.max(0, Math.ceil((new Date(end).getTime() - now) / 864e5));
}
const LOOKUP_TTL_MS = 10 * 6e4;
const lookupCache = /* @__PURE__ */ new Map();
function remember(key, value) {
  if (lookupCache.size > 500) lookupCache.clear();
  if (!value.unsure) lookupCache.set(key, { value, expires: Date.now() + LOOKUP_TTL_MS });
  return value;
}
const NOT_FOUND = { found: false, name: null, image: null, memberCount: null };
function guildIcon(id, icon) {
  if (!icon) return null;
  return /^https?:\/\//.test(icon) ? icon : `https://cdn.discordapp.com/icons/${id}/${icon}.png?size=64`;
}
function userAvatar(id, avatar) {
  if (avatar) return /^https?:\/\//.test(avatar) ? avatar : `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=64`;
  const index = validDiscordId(id) ? Number((BigInt(id) >> BigInt(22)) % BigInt(6)) : 0;
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}
async function discordGet(path, token) {
  try {
    const response = await fetch(`https://discord.com/api/v10${path}`, { headers: { Authorization: `Bot ${token}` } });
    const body = response.ok ? await response.json().catch(() => null) : null;
    return { status: response.status, body };
  } catch {
    return null;
  }
}
async function lookupGuild(astro, id) {
  const cached = lookupCache.get(`g:${id}`);
  if (cached && cached.expires > Date.now()) return cached.value;
  const [known, snapshots] = await Promise.all([
    read(astro, "guilds", `guild_id=eq.${encodeURIComponent(id)}&select=guild_id&limit=1`),
    read(astro, "discord_guild_snapshots", `guild_id=eq.${encodeURIComponent(id)}&select=name,icon,member_count&limit=1`)
  ]);
  const snapshot = snapshots[0];
  if (snapshot?.name) {
    const count = Number(snapshot.member_count);
    return remember(`g:${id}`, { found: true, name: String(snapshot.name), image: guildIcon(id, snapshot.icon), memberCount: Number.isFinite(count) && count > 0 ? count : null });
  }
  const token = getEnv(astro, "DISCORD_TOKEN");
  const live = token ? await discordGet(`/guilds/${id}?with_counts=true`, token) : null;
  if (live?.body?.name) {
    const count = Number(live.body.approximate_member_count);
    return remember(`g:${id}`, { found: true, name: String(live.body.name), image: guildIcon(id, live.body.icon), memberCount: Number.isFinite(count) && count > 0 ? count : null });
  }
  if (known.length) return remember(`g:${id}`, { found: true, name: null, image: null, memberCount: null });
  return live && live.status === 404 || live?.status === 403 || !token && !snapshots.length ? remember(`g:${id}`, NOT_FOUND) : { ...NOT_FOUND, unsure: true };
}
async function lookupUser(astro, id) {
  const cached = lookupCache.get(`u:${id}`);
  if (cached && cached.expires > Date.now()) return cached.value;
  const token = getEnv(astro, "DISCORD_TOKEN");
  const live = token ? await discordGet(`/users/${id}`, token) : null;
  if (live?.body?.id) {
    return remember(`u:${id}`, { found: true, name: String(live.body.global_name || live.body.username || ""), image: userAvatar(id, live.body.avatar), memberCount: null });
  }
  const [entitlements, assignments] = await Promise.all([
    read(astro, "premium_entitlements", `user_id=eq.${encodeURIComponent(id)}&select=user_id&limit=1`),
    read(astro, "premium_slot_assignments", `user_id=eq.${encodeURIComponent(id)}&select=user_id&limit=1`)
  ]);
  if (entitlements.length || assignments.length) return remember(`u:${id}`, { found: true, name: null, image: null, memberCount: null });
  return live && live.status === 404 || !token ? remember(`u:${id}`, NOT_FOUND) : { ...NOT_FOUND, unsure: true };
}
async function resolveGrantNames(astro, targets) {
  const result = /* @__PURE__ */ new Map();
  const servers = [...new Set(targets.filter((t) => t.type === "server" && validDiscordId(t.id)).map((t) => t.id))];
  const users = [...new Set(targets.filter((t) => t.type === "user" && validDiscordId(t.id)).map((t) => t.id))];
  if (servers.length) {
    const rows = await read(astro, "discord_guild_snapshots", `guild_id=in.(${servers.join(",")})&select=guild_id,name,icon`);
    for (const row of rows) if (row.name) result.set(`server:${row.guild_id}`, { name: String(row.name), image: guildIcon(String(row.guild_id), row.icon) });
  }
  const queue = [
    ...servers.filter((id) => !result.has(`server:${id}`)).slice(0, 12).map((id) => ({ type: "server", id })),
    ...users.slice(0, 25).map((id) => ({ type: "user", id }))
  ];
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(5, queue.length) }, async () => {
    while (next < queue.length) {
      const item = queue[next++];
      const looked = item.type === "server" ? await lookupGuild(astro, item.id) : await lookupUser(astro, item.id);
      if (looked.found && looked.name) result.set(`${item.type}:${item.id}`, { name: looked.name, image: looked.image });
    }
  }));
  return result;
}
function grantKey(targetType, targetId) {
  return `manual:${targetType}:${targetId}`;
}
async function listManualPremium(astro) {
  const entitlements = await read(
    astro,
    "premium_entitlements",
    "provider=eq.manual&select=id,user_id,provider_subscription_id,plan_key,status,slot_limit,current_period_end,metadata,created_at&order=updated_at.desc"
  );
  if (!entitlements.length) return [];
  const assignments = await read(
    astro,
    "premium_slot_assignments",
    "select=entitlement_id,guild_id,status&order=assigned_at.desc"
  );
  const byEntitlement = /* @__PURE__ */ new Map();
  for (const assignment of assignments) {
    const list = byEntitlement.get(assignment.entitlement_id) ?? [];
    list.push({ guild_id: assignment.guild_id, status: assignment.status });
    byEntitlement.set(assignment.entitlement_id, list);
  }
  return entitlements.map((grant) => ({ ...grant, assignments: byEntitlement.get(grant.id) ?? [] }));
}
const EXISTING_COLUMNS = "id,user_id,provider_subscription_id,status,slot_limit,current_period_end,metadata";
const PLAN_TTL_MS = 15 * 6e4;
function chooseEnd(existing, duration, dateEnd, now) {
  const months = DURATION_MONTHS[duration];
  const fromNow = () => duration === "permanent" ? null : duration === "date" ? dateEnd : endOfDayUtc(addMonthsUtc(now, months));
  if (duration === "permanent") return { end: null, note: existing && isLiveEntitlement(existing, now.getTime()) && !existing.current_period_end ? "kept_permanent" : "set" };
  if (existing && isLiveEntitlement(existing, now.getTime())) {
    if (!existing.current_period_end) return { end: null, note: "kept_permanent" };
    const current = new Date(existing.current_period_end);
    if (duration === "date") return dateEnd && dateEnd.getTime() > current.getTime() ? { end: dateEnd, note: "extended" } : { end: current, note: "kept_later" };
    return { end: addMonthsUtc(current, months), note: "extended" };
  }
  return { end: fromNow(), note: existing ? "restarted" : "new" };
}
async function planManualPremium(astro, actorId, input, now = /* @__PURE__ */ new Date()) {
  if (!isPettoOwner(astro, actorId)) return { ok: false, code: "invalid" };
  if (!settings(astro)) return { ok: false, code: "database" };
  const duration = DURATIONS.find((d) => d === input.duration);
  if (!duration) return { ok: false, code: "invalid" };
  const date = String(input.date ?? "").trim();
  let dateEnd = null;
  if (duration === "date") {
    dateEnd = parseUntilDate(date);
    if (!dateEnd) return { ok: false, code: "invalid" };
    if (dateEnd.getTime() <= now.getTime()) return { ok: false, code: "past_date" };
    if (dateEnd.getTime() > addMonthsUtc(now, MAX_DATE_YEARS * 12).getTime()) return { ok: false, code: "invalid" };
  }
  let targetType;
  let targetId;
  let existing = null;
  let target;
  let needsAck = false;
  if (input.mode === "grant") {
    const type = input.targetType === "server" ? "server" : input.targetType === "user" ? "user" : null;
    const id = String(input.targetId ?? "").trim();
    if (!type || !validDiscordId(id)) return { ok: false, code: "invalid" };
    targetType = type;
    targetId = id;
    const [guild, user] = await Promise.all([lookupGuild(astro, id), lookupUser(astro, id)]);
    const asGuild = { type: "server", id, known: guild.found, name: guild.name, image: guild.image, memberCount: guild.memberCount };
    const asUser = { type: "user", id, known: user.found, name: user.name, image: user.image, memberCount: null };
    if (type === "user" && guild.found) return { ok: false, code: "wrong_type_server", flip: "server", target: asGuild };
    if (type === "server" && (id === ownerId(astro) || id === actorId || user.found && !guild.found)) return { ok: false, code: "wrong_type_user", flip: "user", target: asUser };
    target = type === "server" ? asGuild : asUser;
    needsAck = type === "server" && !guild.found;
    existing = (await read(astro, "premium_entitlements", `provider_subscription_id=eq.${encodeURIComponent(grantKey(type, id))}&select=${EXISTING_COLUMNS}&limit=1`))[0] ?? null;
  } else {
    const entitlementId = Number(input.entitlementId);
    if (!Number.isInteger(entitlementId) || entitlementId < 1) return { ok: false, code: "invalid" };
    existing = (await read(astro, "premium_entitlements", `id=eq.${entitlementId}&provider=eq.manual&select=${EXISTING_COLUMNS}&limit=1`))[0] ?? null;
    if (!existing) return { ok: false, code: "not_found" };
    const parsed = grantTarget({ user_id: existing.user_id, provider_subscription_id: existing.provider_subscription_id, metadata: existing.metadata });
    if (!validDiscordId(parsed.id)) return { ok: false, code: "invalid" };
    targetType = parsed.type;
    targetId = parsed.id;
    const looked = targetType === "server" ? await lookupGuild(astro, targetId) : await lookupUser(astro, targetId);
    target = { type: targetType, id: targetId, known: looked.found, name: looked.name, image: looked.image, memberCount: looked.memberCount };
  }
  let slots = 1;
  if (targetType === "user") {
    slots = input.slotLimit === void 0 || input.slotLimit === null || Number.isNaN(Number(input.slotLimit)) ? existing?.slot_limit ?? 0 : Number(input.slotLimit);
    if (input.mode === "extend") slots = existing?.slot_limit ?? slots;
    if (!Number.isInteger(slots) || slots < 1 || slots > 1e3) return { ok: false, code: "invalid" };
  }
  if (existing && targetType === "user") {
    const assigned = await read(astro, "premium_slot_assignments", `entitlement_id=eq.${existing.id}&status=eq.active&select=id`);
    if (assigned.length > slots) return { ok: false, code: "slot_conflict" };
  }
  if (targetType === "server") {
    const taken = await serverTaken(astro, targetId, existing?.id ?? null, now.getTime());
    if (taken.code) return { ok: false, code: taken.code };
  }
  const { end, note } = input.mode === "edit" ? { end: duration === "permanent" ? null : duration === "date" ? dateEnd : endOfDayUtc(addMonthsUtc(now, DURATION_MONTHS[duration])), note: "set" } : chooseEnd(existing, duration, dateEnd, now);
  const plan = {
    v: 1,
    mode: input.mode,
    actor: actorId,
    targetType,
    targetId,
    entitlementId: existing?.id ?? null,
    slots,
    duration,
    date,
    end: end ? end.toISOString() : null,
    prevEnd: existing?.current_period_end ?? null,
    prevStatus: existing?.status ?? null,
    prevSlots: existing?.slot_limit ?? null,
    prevLive: isLiveEntitlement(existing, now.getTime()),
    note,
    // A Premium for a person belongs to that person (the bot finds it by `user_id`: their role, their slots, `!premium`). Only a Premium for a server is held by the owner.
    internalUserId: targetType === "user" ? targetId : existing?.user_id ?? ownerId(astro),
    needsAck,
    exp: now.getTime() + PLAN_TTL_MS
  };
  return { ok: true, plan, target };
}
async function serverTaken(astro, guildId, entitlementId, now) {
  const active = await read(astro, "premium_slot_assignments", `guild_id=eq.${encodeURIComponent(guildId)}&status=eq.active&select=id,entitlement_id&limit=1`);
  if (!active[0] || active[0].entitlement_id === entitlementId) return {};
  const other = await read(astro, "premium_entitlements", `id=eq.${active[0].entitlement_id}&select=status,current_period_end&limit=1`);
  if (isLiveEntitlement(other[0], now)) return { code: "server_taken" };
  return { staleAssignmentId: active[0].id };
}
const encoder = new TextEncoder();
const toB64 = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64 = (text) => Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
async function hmac(astro, data) {
  const secret = getEnv(astro, "PETTO_BOT_API_SECRET");
  if (!secret) return null;
  const key = await crypto.subtle.importKey("raw", encoder.encode(`petto-premium-admin:${secret}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toB64(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(data))));
}
async function signPlan(astro, plan) {
  const body = toB64(encoder.encode(JSON.stringify(plan)));
  const signature = await hmac(astro, body);
  return signature ? `${body}.${signature}` : null;
}
async function verifyPlan(astro, token, now = Date.now()) {
  const [body, signature] = String(token).split(".");
  if (!body || !signature) return null;
  const expected = await hmac(astro, body);
  if (!expected || expected.length !== signature.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    const plan = JSON.parse(new TextDecoder().decode(fromB64(body)));
    return plan && plan.v === 1 && Number.isFinite(plan.exp) && plan.exp > now ? plan : null;
  } catch {
    return null;
  }
}
async function previewManualPremium(astro, actorId, input, now = /* @__PURE__ */ new Date()) {
  const planned = await planManualPremium(astro, actorId, input, now);
  if (!planned.ok) return planned;
  const token = await signPlan(astro, planned.plan);
  return token ? { ...planned, token } : { ok: false, code: "database" };
}
async function confirmManualPremium(astro, actorId, token, acknowledged, now = /* @__PURE__ */ new Date()) {
  if (!isPettoOwner(astro, actorId)) return { ok: false, code: "invalid" };
  const plan = await verifyPlan(astro, token, now.getTime());
  if (!plan || plan.actor !== actorId) return { ok: false, code: "stale" };
  if (plan.needsAck && !acknowledged) return { ok: false, code: "unconfirmed" };
  if (plan.end && new Date(plan.end).getTime() <= now.getTime()) return { ok: false, code: "past_date" };
  const fresh = await planManualPremium(astro, actorId, {
    mode: plan.mode,
    targetType: plan.targetType,
    targetId: plan.targetId,
    entitlementId: plan.entitlementId ?? void 0,
    duration: plan.duration,
    date: plan.date,
    slotLimit: plan.slots
  }, now);
  if (!fresh.ok) return fresh;
  if (fresh.plan.entitlementId !== plan.entitlementId || fresh.plan.prevEnd !== plan.prevEnd || fresh.plan.prevStatus !== plan.prevStatus || fresh.plan.prevSlots !== plan.prevSlots) {
    return { ok: false, code: "stale" };
  }
  return applyPlan(astro, actorId, plan, now);
}
async function extendManualPremium(astro, actorId, entitlementId, by, now = /* @__PURE__ */ new Date()) {
  if (!["1m", "1y", "permanent"].includes(by)) return { ok: false, code: "invalid" };
  const planned = await planManualPremium(astro, actorId, { mode: "extend", entitlementId, duration: by }, now);
  if (!planned.ok) return planned;
  return applyPlan(astro, actorId, planned.plan, now);
}
async function applyPlan(astro, actorId, plan, now) {
  const config = settings(astro);
  if (!config) return { ok: false, code: "database" };
  const { targetType, targetId } = plan;
  const key = grantKey(targetType, targetId);
  const existing = (await read(astro, "premium_entitlements", `provider_subscription_id=eq.${encodeURIComponent(key)}&provider=eq.manual&select=${EXISTING_COLUMNS}&limit=1`))[0] ?? null;
  if ((existing?.id ?? null) !== plan.entitlementId) return { ok: false, code: "stale" };
  if (existing && targetType === "user") {
    const assigned = await read(astro, "premium_slot_assignments", `entitlement_id=eq.${existing.id}&status=eq.active&select=id`);
    if (assigned.length > plan.slots) return { ok: false, code: "slot_conflict" };
  }
  if (targetType === "server") {
    const taken = await serverTaken(astro, targetId, existing?.id ?? null, now.getTime());
    if (taken.code) return { ok: false, code: taken.code };
    if (taken.staleAssignmentId) {
      const released = await fetch(`${config.url}/rest/v1/premium_slot_assignments?id=eq.${taken.staleAssignmentId}&status=eq.active`, {
        method: "PATCH",
        headers: headers(config.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
        body: JSON.stringify({ status: "released", released_at: now.toISOString() })
      });
      if (!released.ok) return { ok: false, code: "database" };
    }
  }
  const stamp = now.toISOString();
  const { revoked_by: _a, revoked_at: _b, ...kept } = existing?.metadata ?? {};
  const metadata = {
    ...kept,
    permanent: plan.end === null,
    duration: plan.duration,
    granted_by: kept.granted_by ?? actorId,
    granted_at: kept.granted_at ?? stamp,
    target_type: targetType,
    target_user_id: targetType === "user" ? targetId : null,
    target_guild_id: targetType === "server" ? targetId : null,
    updated_at: stamp,
    ...existing ? { edited_by: actorId, edited_at: stamp } : {}
  };
  const fields = {
    // Also when an older grant is edited: the ones saved with the owner as holder (before this) are fixed with the first change.
    ...targetType === "user" ? { user_id: plan.internalUserId } : {},
    plan_key: `premium-manual-${plan.slots}`,
    status: "active",
    slot_limit: plan.slots,
    current_period_end: plan.end,
    metadata,
    updated_at: stamp
  };
  let entitlementId = existing?.id ?? null;
  if (existing) {
    const response = await fetch(`${config.url}/rest/v1/premium_entitlements?id=eq.${existing.id}&provider=eq.manual`, {
      method: "PATCH",
      headers: headers(config.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify(fields)
    });
    if (!response.ok) return { ok: false, code: "database" };
  } else {
    const response = await fetch(`${config.url}/rest/v1/premium_entitlements?on_conflict=provider_subscription_id`, {
      method: "POST",
      headers: headers(config.key, { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation" }),
      body: JSON.stringify({ user_id: plan.internalUserId, provider: "manual", provider_subscription_id: key, ...fields })
    });
    if (!response.ok) return { ok: false, code: "database" };
    if (targetType !== "server") return { ok: true };
    const row = await response.json().catch(() => null);
    entitlementId = Array.isArray(row) ? row[0]?.id ?? null : null;
    entitlementId = entitlementId ?? (await read(astro, "premium_entitlements", `provider_subscription_id=eq.${encodeURIComponent(key)}&select=id&limit=1`))[0]?.id ?? null;
  }
  if (targetType !== "server") return { ok: true };
  if (!entitlementId) return { ok: false, code: "database" };
  const assignment = await read(astro, "premium_slot_assignments", `entitlement_id=eq.${entitlementId}&guild_id=eq.${encodeURIComponent(targetId)}&select=id&limit=1`);
  const assignmentResponse = assignment[0] ? await fetch(`${config.url}/rest/v1/premium_slot_assignments?id=eq.${assignment[0].id}`, {
    method: "PATCH",
    headers: headers(config.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify({ user_id: plan.internalUserId, status: "active", released_at: null })
  }) : await fetch(`${config.url}/rest/v1/premium_slot_assignments`, {
    method: "POST",
    headers: headers(config.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify({ entitlement_id: entitlementId, user_id: plan.internalUserId, guild_id: targetId, status: "active" })
  });
  return assignmentResponse.ok ? { ok: true } : { ok: false, code: "database" };
}
async function revokeManualPremium(astro, actorId, entitlementId) {
  if (!isPettoOwner(astro, actorId) || !Number.isInteger(entitlementId)) return false;
  const config = settings(astro);
  if (!config) return false;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const row = (await read(astro, "premium_entitlements", `id=eq.${entitlementId}&provider=eq.manual&select=metadata&limit=1`))[0];
  if (!row) return false;
  const assignments = await read(astro, "premium_slot_assignments", `entitlement_id=eq.${entitlementId}&status=eq.active&select=guild_id`);
  await Promise.all(assignments.map((assignment) => resetGuildPremiumCustomization(astro, assignment.guild_id)));
  const entitlementResponse = await fetch(`${config.url}/rest/v1/premium_entitlements?id=eq.${entitlementId}&provider=eq.manual`, {
    method: "PATCH",
    headers: headers(config.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
    // The metadata is kept (who and what the grant was for); only the revoke marks are added.
    body: JSON.stringify({ status: "expired", current_period_end: now, updated_at: now, metadata: { ...row.metadata ?? {}, permanent: false, revoked_by: actorId, revoked_at: now } })
  });
  if (!entitlementResponse.ok) return false;
  const assignmentResponse = await fetch(`${config.url}/rest/v1/premium_slot_assignments?entitlement_id=eq.${entitlementId}&status=eq.active`, {
    method: "PATCH",
    headers: headers(config.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify({ status: "released", released_at: now })
  });
  return assignmentResponse.ok;
}

export { releasePremiumServer as A, activeUserPlan as B, createPlanCheckout as C, confirmManualPremium as a, revokeManualPremium as b, createCoinCheckout as c, daysLeft as d, extendManualPremium as e, forgetPremiumSnapshots as f, getPremiumGuildIds as g, isLiveEntitlement as h, isPettoOwner as i, grantTarget as j, resolveGrantNames as k, listManualPremium as l, grantState as m, coinCheckoutReady as n, hasPremiumForGuild as o, previewManualPremium as p, resetGuildPremiumCustomizationIfStale as q, resetGuildPremiumCustomization as r, getPremiumSnapshot as s, read$1 as t, userAvatar as u, planCheckoutReady as v, createPremiumCheckout as w, createPremiumCustomerPortalSession as x, requestPremiumServer as y, cancelPremiumServerRequest as z };
