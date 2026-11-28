import { g as getEnv } from './env_WnBvzCjc.mjs';
import { r as resetGuildPremiumCustomization } from './premiumAdmin_C4HUbWtx.mjs';
import { e as callPettoCeramos } from './pettoBotApi_B4wpoZhN.mjs';

const SUBSCRIPTION_EVENTS = /* @__PURE__ */ new Set([
  "subscription.created",
  "subscription.active",
  "subscription.updated",
  "subscription.uncanceled",
  "subscription.past_due",
  "subscription.paused",
  "subscription.resumed",
  "subscription.canceled",
  "subscription.revoked"
]);
const PRODUCT_SLOT_LIMITS = {
  "15621107-ba45-4f62-a648-636f23c0f9e3": 1,
  "da48d960-a600-461a-b251-8cb684b1cb5f": 1,
  "b7636ff3-c73a-4274-9850-3d4446e3df11": 3,
  "1dc59fa1-f358-4172-9327-a61069882366": 3,
  "1ec97d11-63af-4573-af09-3075567c4cc7": 5,
  "5361b1ef-97e2-470d-8fe3-25da2b49aeeb": 5
};
function userPlanOf(astro, subscription, metadata) {
  const productId = String(subscription.product_id ?? subscription.product?.id ?? "");
  for (const plan of ["bronze", "silver", "gold"]) {
    if (productId && productId === getEnv(astro, `POLAR_PRODUCT_PLAN_${plan.toUpperCase()}`)) return plan;
  }
  const named = String(metadata.plan ?? "").toLowerCase();
  return metadata.kind === "user_plan" && (named === "bronze" || named === "silver" || named === "gold") ? named : null;
}
function settings(astro) {
  const url = getEnv(astro, "PETTO_BOT_API_URL");
  const key = getEnv(astro, "PETTO_BOT_API_SECRET");
  return url && key ? { url, key } : null;
}
function apiHeaders(key, extra = {}) {
  return { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json", ...extra };
}
function decodeBase64(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
function sameBytes(left, right) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) result |= left[index] ^ right[index];
  return result === 0;
}
async function verifyPolarWebhook(body, headers, secret) {
  const webhookId = headers.get("webhook-id");
  const timestampHeader = headers.get("webhook-timestamp");
  const signatureHeader = headers.get("webhook-signature");
  if (!webhookId || !timestampHeader || !signatureHeader || !secret) return false;
  const timestamp = Number(timestampHeader);
  const now = Math.floor(Date.now() / 1e3);
  if (!Number.isInteger(timestamp) || Math.abs(now - timestamp) > 300) return false;
  try {
    const encodedSecret = secret.startsWith("whsec_") ? secret.slice(6) : secret;
    const key = await crypto.subtle.importKey(
      "raw",
      decodeBase64(encodedSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signed = new TextEncoder().encode(`${webhookId}.${timestamp}.${body}`);
    const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, signed));
    return signatureHeader.split(" ").some((candidate) => {
      const [version, value] = candidate.split(",", 2);
      if (version !== "v1" || !value) return false;
      try {
        return sameBytes(expected, decodeBase64(value));
      } catch {
        return false;
      }
    });
  } catch {
    return false;
  }
}
function iso(value) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
function userIdFrom(subscription, metadata) {
  const value = metadata.discord_user_id ?? subscription.customer?.external_id ?? metadata.discordUserId ?? metadata.user_id;
  const id = String(value ?? "").trim();
  return /^\d{15,22}$/.test(id) ? id : null;
}
function statusFor(type, status, periodEnd, cancelAtPeriodEnd) {
  if (type === "subscription.revoked") return "expired";
  if ((type === "subscription.canceled" || status === "canceled") && cancelAtPeriodEnd && periodEnd && new Date(periodEnd).getTime() > Date.now()) return "active";
  if (type === "subscription.canceled" || type === "subscription.paused" || status === "canceled") return "canceled";
  if (type === "subscription.past_due") return "past_due";
  if (type === "subscription.active" || type === "subscription.uncanceled" || type === "subscription.resumed") return "active";
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due") return "past_due";
  if (status === "canceled" || status === "unpaid" || status === "paused") return "canceled";
  if (status === "incomplete_expired") return "expired";
  return "pending";
}
async function trimExcessAssignments(astro, entitlementId, slotLimit) {
  const config = settings(astro);
  if (!config) return;
  const response = await fetch(`${config.url}/rest/v1/premium_slot_assignments?entitlement_id=eq.${entitlementId}&status=eq.active&select=id,guild_id,assigned_at&order=assigned_at.asc`, {
    headers: apiHeaders(config.key)
  });
  if (!response.ok) return;
  const assignments = await response.json();
  const excess = assignments.slice(Math.max(0, slotLimit));
  if (!excess.length) return;
  await Promise.all(excess.map(async (assignment) => {
    await resetGuildPremiumCustomization(astro, assignment.guild_id);
    await fetch(`${config.url}/rest/v1/premium_slot_assignments?id=eq.${assignment.id}&status=eq.active`, {
      method: "PATCH",
      headers: apiHeaders(config.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify({ status: "released", released_at: (/* @__PURE__ */ new Date()).toISOString() })
    });
  }));
}
async function fulfillPending(astro, entitlementId, userId, slotLimit) {
  const config = settings(astro);
  if (!config) return;
  const activeUrl = `${config.url}/rest/v1/premium_slot_assignments?entitlement_id=eq.${entitlementId}&status=eq.active&select=guild_id`;
  const pendingUrl = `${config.url}/rest/v1/premium_slot_requests?user_id=eq.${encodeURIComponent(userId)}&status=eq.pending&select=id,guild_id&order=created_at.asc`;
  const [activeResponse, pendingResponse] = await Promise.all([
    fetch(activeUrl, { headers: apiHeaders(config.key) }),
    fetch(pendingUrl, { headers: apiHeaders(config.key) })
  ]);
  if (!activeResponse.ok || !pendingResponse.ok) return;
  const active = await activeResponse.json();
  const pending = await pendingResponse.json();
  let remaining = Math.max(0, slotLimit - active.length);
  for (const request of pending) {
    if (!remaining) break;
    const assignmentResponse = await fetch(`${config.url}/rest/v1/premium_slot_assignments?on_conflict=entitlement_id,guild_id`, {
      method: "POST",
      headers: apiHeaders(config.key, { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify({ entitlement_id: entitlementId, user_id: userId, guild_id: request.guild_id, status: "active", released_at: null })
    });
    if (!assignmentResponse.ok) continue;
    await fetch(`${config.url}/rest/v1/premium_slot_requests?id=eq.${request.id}`, {
      method: "PATCH",
      headers: apiHeaders(config.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify({ status: "approved", updated_at: (/* @__PURE__ */ new Date()).toISOString() })
    });
    remaining -= 1;
  }
}
async function syncUserPlan(astro, config, input) {
  const status = statusFor(input.type, input.status, input.periodEnd, input.cancelAtPeriodEnd);
  const periodValid = !input.periodEnd || new Date(input.periodEnd).getTime() > Date.now();
  const active = status === "active" && periodValid;
  if (!active) {
    const current = await fetch(`${config.url}/rest/v1/user_plans?user_id=eq.${encodeURIComponent(input.userId)}&select=plan,ends_at`, { headers: apiHeaders(config.key) }).then((reply) => reply.ok ? reply.json() : []).catch(() => []);
    const held = Array.isArray(current) ? current[0] : null;
    if (held && held.plan !== input.plan && (!held.ends_at || new Date(held.ends_at).getTime() > Date.now())) return true;
  }
  const row = {
    user_id: input.userId,
    plan: input.plan,
    source: "payment",
    granted_by: null,
    note: null,
    ends_at: active ? input.periodEnd : (/* @__PURE__ */ new Date()).toISOString(),
    renews: active && !input.cancelAtPeriodEnd,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const response = await fetch(`${config.url}/rest/v1/user_plans?on_conflict=user_id`, {
    method: "POST",
    headers: apiHeaders(config.key, { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(row)
  });
  if (!response.ok) throw new Error(`Plan API upsert failed with HTTP ${response.status}.`);
  return true;
}
async function syncPolarSubscription(astro, event) {
  if (!event || !SUBSCRIPTION_EVENTS.has(event.type)) return false;
  const config = settings(astro);
  if (!config) throw new Error("Premium API configuration is missing.");
  const subscription = event.data ?? {};
  const metadata = { ...subscription.product?.metadata ?? {}, ...subscription.metadata ?? {} };
  const userId = userIdFrom(subscription, metadata);
  if (!userId || !subscription.id) return true;
  const productId = String(subscription.product_id ?? subscription.product?.id ?? "");
  const plan = userPlanOf(astro, subscription, metadata);
  if (plan) return syncUserPlan(astro, config, { userId, plan, type: event.type, status: subscription.status, periodEnd: iso(subscription.current_period_end ?? subscription.ends_at), cancelAtPeriodEnd: Boolean(subscription.cancel_at_period_end ?? subscription.cancelAtPeriodEnd) });
  const slotValue = Number(metadata.slot_limit ?? metadata.slotLimit ?? PRODUCT_SLOT_LIMITS[productId] ?? 1);
  const slotLimit = Number.isInteger(slotValue) && slotValue > 0 ? slotValue : 1;
  const periodEnd = iso(subscription.current_period_end ?? subscription.ends_at);
  const cancelAtPeriodEnd = Boolean(subscription.cancel_at_period_end ?? subscription.cancelAtPeriodEnd);
  const status = statusFor(event.type, subscription.status, periodEnd, cancelAtPeriodEnd);
  const periodValid = !periodEnd || new Date(periodEnd).getTime() > Date.now();
  const row = {
    user_id: userId,
    provider: "polar",
    provider_subscription_id: String(subscription.id),
    plan_key: String(metadata.plan_key ?? metadata.planKey ?? `premium-${slotLimit}`),
    status,
    slot_limit: slotLimit,
    current_period_end: periodEnd,
    metadata: { polar_event: event.type, product_id: productId || null, checkout_id: subscription.checkout_id ?? null, cancel_at_period_end: cancelAtPeriodEnd, polar: event.data },
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  };
  const upsertResponse = await fetch(`${config.url}/rest/v1/premium_entitlements?on_conflict=provider_subscription_id`, {
    method: "POST",
    headers: apiHeaders(config.key, { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=representation" }),
    body: JSON.stringify(row)
  });
  if (!upsertResponse.ok) throw new Error(`Premium API upsert failed with HTTP ${upsertResponse.status}.`);
  const saved = await upsertResponse.json();
  const entitlementId = saved[0]?.id;
  if (!entitlementId) throw new Error("Premium API upsert returned no entitlement ID.");
  if (status !== "active" || !periodValid) {
    const activeAssignmentsResponse = await fetch(`${config.url}/rest/v1/premium_slot_assignments?entitlement_id=eq.${entitlementId}&status=eq.active&select=guild_id`, {
      headers: apiHeaders(config.key)
    });
    const activeAssignments = activeAssignmentsResponse.ok ? await activeAssignmentsResponse.json() : [];
    await Promise.all(activeAssignments.map(({ guild_id }) => resetGuildPremiumCustomization(astro, guild_id)));
    await fetch(`${config.url}/rest/v1/premium_slot_assignments?entitlement_id=eq.${entitlementId}&status=eq.active`, {
      method: "PATCH",
      headers: apiHeaders(config.key, { "Content-Type": "application/json", Prefer: "return=minimal" }),
      body: JSON.stringify({ status: "released", released_at: (/* @__PURE__ */ new Date()).toISOString() })
    });
  } else if (status === "active") {
    await trimExcessAssignments(astro, entitlementId, slotLimit);
    await fulfillPending(astro, entitlementId, userId, slotLimit);
  }
  return true;
}
const PREMIUM_NOTICES = {
  "subscription.active": { title: "Premium active", color: 10873466 },
  "subscription.uncanceled": { title: "Premium kept", color: 10873466 },
  "subscription.canceled": { title: "Premium cancelled", color: 16700732 },
  "subscription.past_due": { title: "Premium payment failed", color: 16671845 },
  "subscription.revoked": { title: "Premium ended", color: 16671845 }
};
async function notifyPremiumEvent(astro, event) {
  const notice = PREMIUM_NOTICES[String(event?.type ?? "")];
  const hook = getEnv(astro, "PREMIUM_LOGS_WEBHOOK_URL");
  if (!notice || !hook || !/^https:\/\/(?:(?:canary|ptb)\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+/.test(hook)) return;
  const subscription = event.data ?? {};
  const metadata = { ...subscription.product?.metadata ?? {}, ...subscription.metadata ?? {} };
  const userId = userIdFrom(subscription, metadata);
  const plan = userPlanOf(astro, subscription, metadata);
  const slotValue = Number(metadata.slot_limit ?? metadata.slotLimit ?? PRODUCT_SLOT_LIMITS[String(subscription.product_id ?? "")] ?? 1);
  const periodEnd = iso(subscription.current_period_end ?? subscription.ends_at);
  const stamp = (value) => value ? `<t:${Math.floor(Date.parse(value) / 1e3)}:f>` : "not set";
  const lines = [
    `**User:** ${userId ? `<@${userId}> (\`${userId}\`)` : "unknown"}`,
    plan ? `**Plan of a person:** ${plan}` : `**Plan:** ${String(metadata.plan_key ?? metadata.planKey ?? subscription.product?.name ?? "Premium").slice(0, 80)} · ${Number.isInteger(slotValue) && slotValue > 0 ? slotValue : 1} server slot(s)`,
    `**${event.type === "subscription.canceled" ? "Access until" : "Renews or ends"}:** ${stamp(periodEnd)}`,
    ...subscription.id ? [`-# Subscription ${String(subscription.id).slice(0, 36)}`] : []
  ];
  try {
    await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5e3),
      body: JSON.stringify({ username: "Petto Premium", allowed_mentions: { parse: [] }, embeds: [{ title: plan ? notice.title.replace("Premium", `Plan ${plan}`) : notice.title, color: notice.color, description: lines.join("\n"), timestamp: (/* @__PURE__ */ new Date()).toISOString() }] })
    });
  } catch {
  }
}
async function postActivePremium(astro) {
  const hook = getEnv(astro, "PREMIUM_LOGS_WEBHOOK_URL");
  if (!hook || !/^https:\/\/(?:(?:canary|ptb)\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+/.test(hook)) return { ok: false, error: "not_configured" };
  const config = settings(astro);
  if (!config) return { ok: false, error: "database" };
  let rows = [];
  try {
    const response = await fetch(`${config.url}/rest/v1/premium_entitlements?status=eq.active&select=user_id,provider,plan_key,slot_limit,current_period_end&order=created_at.asc&limit=500`, { headers: apiHeaders(config.key), signal: AbortSignal.timeout(8e3) });
    if (!response.ok) return { ok: false, error: "database" };
    rows = await response.json();
  } catch {
    return { ok: false, error: "database" };
  }
  const active = rows.filter((row) => !row.current_period_end || Date.parse(row.current_period_end) > Date.now());
  const lines = active.map((row) => {
    const until = row.current_period_end ? ` · until <t:${Math.floor(Date.parse(row.current_period_end) / 1e3)}:d>` : " · no end date";
    return `<@${row.user_id}> · ${String(row.plan_key ?? "premium").slice(0, 40)} · ${row.slot_limit ?? 1} slot(s)${until} · ${row.provider === "polar" ? "Polar" : row.provider ?? "manual"}`;
  });
  const parts = [];
  let current = [];
  let size = 0;
  for (const line of lines) {
    if (size + line.length > 3500 && current.length) {
      parts.push(current);
      current = [];
      size = 0;
    }
    current.push(line);
    size += line.length + 1;
  }
  if (current.length || !parts.length) parts.push(current);
  try {
    for (const [index, part] of parts.entries()) {
      const head = index === 0 ? `**${active.length}** active subscription${active.length === 1 ? "" : "s"}.
` : "";
      const response = await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(6e3),
        body: JSON.stringify({ username: "Petto Premium", allowed_mentions: { parse: [] }, embeds: [{ title: index === 0 ? "Premium active now" : "Premium active now (cont.)", color: 15771791, description: `${head}${part.join("\n") || "None right now."}` }] })
      });
      if (!response.ok) return { ok: false, error: "discord" };
    }
  } catch {
    return { ok: false, error: "discord" };
  }
  return { ok: true, count: active.length };
}
function coinPackOf(astro, order, metadata) {
  const productId = String(order.product_id ?? order.product?.id ?? "");
  for (const id of ["pile", "small-bag", "big-bag", "chest"]) {
    if (productId && productId === getEnv(astro, `POLAR_PRODUCT_COINS_${id.toUpperCase().replace(/-/g, "_")}`)) return id;
  }
  const named = String(metadata.pack ?? "");
  return metadata.kind === "ceramos_pack" && /^[a-z0-9][a-z0-9-]{2,30}$/.test(named) ? named : null;
}
async function creditCoinPack(astro, event) {
  if (!event || event.type !== "order.paid") return false;
  const order = event.data ?? {};
  const metadata = { ...order.product?.metadata ?? {}, ...order.metadata ?? {} };
  const pack = coinPackOf(astro, order, metadata);
  if (!pack) {
    console.info(`[polar] order.paid ${String(order.id ?? "")} is not a pack of ceramos: product ${String(order.product_id ?? order.product?.id ?? "none")}, kind ${String(metadata.kind ?? "none")}`);
    return false;
  }
  const userId = String(metadata.discord_user_id ?? order.customer?.external_id ?? order.customer_external_id ?? "");
  const orderId = String(order.id ?? "");
  if (!/^\d{15,22}$/.test(userId) || !orderId) {
    console.warn(`[polar] order.paid ${orderId} for the pack ${pack} has no valid Discord id (${userId || "none"})`);
    return true;
  }
  const done = await callPettoCeramos(astro, userId, "credit-pack", { pack, order: orderId });
  if (!done.ok) throw new Error(`The ceramos of order ${orderId} could not be given.`);
  console.info(`[polar] order.paid ${orderId}: pack ${pack} for ${userId}, ${done.data?.applied ? "given" : "already given"}, balance ${done.data?.balance ?? "?"}`);
  return true;
}
async function refundCoinPack(astro, event) {
  if (!event || event.type !== "order.refunded") return false;
  const order = event.data ?? {};
  const metadata = { ...order.product?.metadata ?? {}, ...order.metadata ?? {} };
  if (!coinPackOf(astro, order, metadata)) return false;
  const userId = String(metadata.discord_user_id ?? order.customer?.external_id ?? order.customer_external_id ?? "");
  const orderId = String(order.id ?? "");
  if (!/^\d{15,22}$/.test(userId) || !orderId) return true;
  const done = await callPettoCeramos(astro, userId, "credit-refund", { order: orderId });
  if (!done.ok) throw new Error(`The ceramos of the refunded order ${orderId} could not be taken back.`);
  return true;
}

export { creditCoinPack as c, notifyPremiumEvent as n, postActivePremium as p, refundCoinPack as r, syncPolarSubscription as s, verifyPolarWebhook as v };
