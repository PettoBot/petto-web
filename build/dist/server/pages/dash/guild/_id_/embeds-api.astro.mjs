import { a as getGuildSession } from '../../../../chunks/dashAuth_uqFK7-ED.mjs';
import { g as getEnv } from '../../../../chunks/env_WnBvzCjc.mjs';
import { v as validateTemplate } from '../../../../chunks/embedSchema_Bj4vwR3q.mjs';
import { b as buildDiscordMessage, s as sendTestMessage } from '../../../../chunks/embedSend_kaZVlTnV.mjs';
import { e as getGuildList, k as getGuildDetails } from '../../../../chunks/discord_CxeBz2tv.mjs';
import { r as callPettoCards } from '../../../../chunks/pettoBotApi_B4wpoZhN.mjs';
export { renderers } from '../../../../renderers.mjs';

const prerender = false;
const recentSends = /* @__PURE__ */ new Map();
function tooManySends(userId) {
  const now = Date.now();
  const recent = (recentSends.get(userId) ?? []).filter((at) => now - at < 6e4);
  if (recent.length >= 6) {
    recentSends.set(userId, recent);
    return true;
  }
  recent.push(now);
  recentSends.set(userId, recent);
  return false;
}
function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, "_");
}
function headers(apiKey) {
  return { apikey: apiKey, Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
}
async function auth(astro, id) {
  const result = await getGuildSession(astro, id);
  return "redirect" in result ? null : result.session;
}
const GET = async (astro) => {
  const { id } = astro.params;
  const session = await auth(astro, id);
  if (!session) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  const apiUrl = getEnv(astro, "PETTO_BOT_API_URL");
  const apiKey = getEnv(astro, "PETTO_BOT_API_SECRET");
  const url = new URL(astro.request.url);
  if (url.searchParams.has("list")) {
    const res2 = await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&select=name&order=name.asc`, { headers: headers(apiKey) });
    const rows2 = res2.ok ? await res2.json() : [];
    return new Response(JSON.stringify(rows2.map((r) => r.name)), { headers: { "Content-Type": "application/json" } });
  }
  const name = url.searchParams.get("name");
  if (!name) return new Response(JSON.stringify({ error: "missing name" }), { status: 400 });
  const res = await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}&select=name,data`, { headers: headers(apiKey) });
  const rows = res.ok ? await res.json() : [];
  if (!rows[0]) return new Response(JSON.stringify({ error: "not found" }), { status: 404 });
  return new Response(JSON.stringify(rows[0]), { headers: { "Content-Type": "application/json" } });
};
const POST = async (astro) => {
  const { id } = astro.params;
  const session = await auth(astro, id);
  if (!session) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 });
  const apiUrl = getEnv(astro, "PETTO_BOT_API_URL");
  const apiKey = getEnv(astro, "PETTO_BOT_API_SECRET");
  const body = await astro.request.json().catch(() => ({}));
  const action = String(body.action ?? "");
  if (action === "create") {
    const name = normalizeName(String(body.name ?? "").trim().slice(0, 40));
    if (!name) return new Response(JSON.stringify({ error: "name required" }), { status: 400 });
    let imported = null;
    if (body.data !== void 0) {
      const checked = validateTemplate(body.data);
      if (!checked.ok) return new Response(JSON.stringify({ error: checked.error }), { status: 400 });
      imported = checked.data;
    }
    const res = await fetch(`${apiUrl}/rest/v1/embed_templates`, {
      method: "POST",
      headers: { ...headers(apiKey), Prefer: "return=minimal" },
      body: JSON.stringify({ guild_id: id, name, data: imported ?? { content: "", embeds: [], buttons: [] } })
    });
    if (!res.ok) return new Response(JSON.stringify({ error: "A template with that name already exists." }), { status: 409 });
    return new Response(JSON.stringify({ ok: true, name }), { headers: { "Content-Type": "application/json" } });
  }
  if (action === "save") {
    const name = String(body.name ?? "");
    if (!name) return new Response(JSON.stringify({ error: "missing name" }), { status: 400 });
    const checked = validateTemplate(body.data);
    if (!checked.ok) return new Response(JSON.stringify({ error: checked.error }), { status: 400 });
    const res = await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}`, {
      method: "PATCH",
      headers: { ...headers(apiKey), Prefer: "return=minimal" },
      body: JSON.stringify({ data: checked.data, updated_at: (/* @__PURE__ */ new Date()).toISOString() })
    });
    return new Response(JSON.stringify({ ok: res.ok }), { status: res.ok ? 200 : 500 });
  }
  if (action === "delete") {
    const name = String(body.name ?? "");
    if (!name) return new Response(JSON.stringify({ error: "missing name" }), { status: 400 });
    const res = await fetch(`${apiUrl}/rest/v1/embed_templates?guild_id=eq.${id}&name=eq.${encodeURIComponent(name)}`, {
      method: "DELETE",
      headers: { ...headers(apiKey), Prefer: "return=representation" }
    });
    if (res.ok) {
      const deleted = await res.json().catch(() => []);
      if (!Array.isArray(deleted) || deleted.length === 0) {
        return new Response(JSON.stringify({ error: "template not found" }), { status: 404 });
      }
    }
    return new Response(JSON.stringify({ ok: res.ok }), { status: res.ok ? 200 : 500 });
  }
  if (action === "test_send") {
    const botToken = getEnv(astro, "DISCORD_TOKEN");
    if (!botToken) return new Response(JSON.stringify({ error: "The bot is not configured." }), { status: 503 });
    if (tooManySends(String(session.userId))) return new Response(JSON.stringify({ error: "Too many test messages, wait a minute and try again." }), { status: 429 });
    const checked = validateTemplate(body.data);
    if (!checked.ok) return new Response(JSON.stringify({ error: checked.error }), { status: 400 });
    const channelId = String(body.channel_id ?? "");
    const toDm = channelId === "" || channelId === "dm";
    if (!toDm) {
      const channelsRes = await getGuildList(astro, id, botToken, "channels");
      const channels = channelsRes.ok ? await channelsRes.json() : [];
      if (!Array.isArray(channels) || !channels.some((c) => c.id === channelId)) {
        return new Response(JSON.stringify({ error: "That channel is not in this server." }), { status: 400 });
      }
    }
    const guild = await getGuildDetails(id, botToken);
    const userId = String(session.userId);
    const rolesRes = toDm ? null : await getGuildList(astro, id, botToken, "roles");
    const rolesJson = rolesRes?.ok ? await rolesRes.json() : null;
    const roles = Array.isArray(rolesJson) ? rolesJson.map((r) => ({ id: String(r.id), name: String(r.name ?? "") })) : null;
    const message = buildDiscordMessage(checked.data, {
      userId,
      userName: String(session.username ?? "you"),
      serverName: guild?.name ?? "this server",
      memberCount: guild?.approximate_member_count ?? null
    }, {
      userAvatar: session.avatar ?? null,
      serverIcon: guild?.icon ? `https://cdn.discordapp.com/icons/${id}/${guild.icon}.png?size=256` : null
    }, roles);
    let file;
    const card = checked.data.card;
    if (card) {
      const rowRes = await fetch(`${apiUrl}/rest/v1/image_cards?guild_id=eq.${id}&name=eq.${encodeURIComponent(card.name)}&select=data`, { headers: headers(apiKey) });
      const row = rowRes.ok ? (await rowRes.json())[0] : null;
      const picture = row ? await callPettoCards(astro, id, userId, "/preview", { method: "POST", body: JSON.stringify({ data: row.data }) }) : null;
      if (picture?.ok) {
        file = { name: "card.png", bytes: await picture.arrayBuffer() };
        if (card.placement !== "attachment" && message.embeds.length > 0) message.embeds[0].image = { url: "attachment://card.png" };
      }
    }
    const result = await sendTestMessage(botToken, message, toDm ? { dmUserId: userId } : { channelId }, file);
    return new Response(JSON.stringify(result.ok ? { ok: true } : { error: result.error }), { status: result.ok ? 200 : 502, headers: { "Content-Type": "application/json" } });
  }
  if (action === "fetch_message") {
    const botToken = getEnv(astro, "DISCORD_TOKEN");
    if (!botToken) return new Response(JSON.stringify({ error: "The bot is not configured." }), { status: 503 });
    const rawRef = String(body.message_ref ?? "").trim();
    let channelId = String(body.channel_id ?? "").trim();
    let messageId = "";
    const linkMatch = /discord(?:app)?\.com\/channels\/(\d{15,25})\/(\d{15,25})\/(\d{15,25})/i.exec(rawRef);
    if (linkMatch) {
      if (linkMatch[1] !== id) return new Response(JSON.stringify({ error: "That message link belongs to a different server." }), { status: 400 });
      channelId = linkMatch[2];
      messageId = linkMatch[3];
    } else if (/^\d{15,25}$/.test(rawRef)) {
      messageId = rawRef;
    } else {
      return new Response(JSON.stringify({ error: "Paste a valid Discord message ID or message link." }), { status: 400 });
    }
    if (!/^\d{15,25}$/.test(channelId)) {
      return new Response(JSON.stringify({ error: "Select the channel where that message is, or paste the full message link." }), { status: 400 });
    }
    const channelsRes = await getGuildList(astro, id, botToken, "channels");
    const guildChannels = channelsRes.ok ? await channelsRes.json() : [];
    if (!Array.isArray(guildChannels) || !guildChannels.some((c) => String(c.id) === channelId)) {
      return new Response(JSON.stringify({ error: "That channel is not in this server." }), { status: 400 });
    }
    const msgRes = await fetch(`https://discord.com/api/v10/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}`, {
      headers: { Authorization: `Bot ${botToken}` }
    });
    if (msgRes.status === 403) return new Response(JSON.stringify({ error: "Petto cannot read messages in that channel. Check its permissions." }), { status: 403 });
    if (msgRes.status === 404) return new Response(JSON.stringify({ error: "Message not found in that channel." }), { status: 404 });
    if (!msgRes.ok) return new Response(JSON.stringify({ error: "Could not fetch that message from Discord." }), { status: 502 });
    const rawMsg = await msgRes.json().catch(() => null);
    if (!rawMsg) return new Response(JSON.stringify({ error: "Invalid response from Discord." }), { status: 502 });
    const src = Array.isArray(rawMsg.message_snapshots) && rawMsg.message_snapshots[0]?.message ? rawMsg.message_snapshots[0].message : rawMsg;
    const isV2 = (Number(src.flags ?? rawMsg.flags ?? 0) & 32768) !== 0;
    if (isV2 && Array.isArray(src.components) && src.components.length > 0) {
      return new Response(JSON.stringify({ ok: true, data: { v2: { components: src.components } } }), { headers: { "Content-Type": "application/json" } });
    }
    const attachments = Array.isArray(src.attachments) ? src.attachments.filter((a) => a?.url && /^image\//i.test(String(a.content_type ?? ""))).map((a) => String(a.url)) : [];
    let content = String(src.content ?? "");
    const embeds = (Array.isArray(src.embeds) ? src.embeds : []).filter((e) => e && (e.type === "rich" || !e.type || e.title || e.description || e.fields?.length || e.image?.url)).slice(0, 10).map((e) => ({
      title: String(e.title ?? ""),
      description: String(e.description ?? ""),
      url: String(e.url ?? ""),
      color: typeof e.color === "number" ? e.color : null,
      timestamp: Boolean(e.timestamp),
      thumbnail: String(e.thumbnail?.url ?? ""),
      image: String(e.image?.url ?? ""),
      author: { name: String(e.author?.name ?? ""), icon: String(e.author?.icon_url ?? ""), url: String(e.author?.url ?? "") },
      footer: { text: String(e.footer?.text ?? ""), icon: String(e.footer?.icon_url ?? "") },
      fields: Array.isArray(e.fields) ? e.fields.slice(0, 25).map((f) => ({ name: String(f.name ?? ""), value: String(f.value ?? ""), inline: Boolean(f.inline) })) : []
    }));
    if (attachments.length) {
      if (embeds.length === 1 && !embeds[0].image) {
        embeds[0].image = attachments[0];
        if (attachments.length > 1) content = [content, ...attachments.slice(1)].filter(Boolean).join("\n");
      } else {
        content = [content, ...attachments].filter(Boolean).join("\n");
      }
    }
    const buttons = (Array.isArray(src.components) ? src.components : []).filter((row) => row?.type === 1 && Array.isArray(row.components)).slice(0, 5).map((row) => row.components.filter((c) => c?.type === 2 && c.style === 5 && c.url).slice(0, 5).map((c) => ({
      label: String(c.label ?? ""),
      url: String(c.url ?? ""),
      emoji: c.emoji?.id ? `<${c.emoji.animated ? "a" : ""}:${c.emoji.name}:${c.emoji.id}>` : String(c.emoji?.name ?? ""),
      disabled: Boolean(c.disabled)
    }))).filter((row) => row.length > 0);
    return new Response(JSON.stringify({ ok: true, data: { content, embeds, buttons } }), { headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ error: "unknown action" }), { status: 400 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
