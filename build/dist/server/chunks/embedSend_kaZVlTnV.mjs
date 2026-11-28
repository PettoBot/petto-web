import { t as tokenValues, f as findSample } from './variableSamples_Dw-K9yym.mjs';

const API = "https://discord.com/api/v10";
function normalizeDiscordEmoji(raw) {
  if (!raw) return void 0;
  if (typeof raw === "object") {
    if (raw.id) return { id: raw.id, name: raw.name, ...raw.animated ? { animated: true } : {} };
    if (!raw.name) return void 0;
    raw = raw.name;
  }
  const trimmed = String(raw).trim();
  if (!trimmed) return void 0;
  const custom = /^<(a?):(\w+):(\d{15,25})>$/.exec(trimmed);
  if (custom) return { id: custom[3], name: custom[2], ...custom[1] ? { animated: true } : {} };
  const fixed = trimmed.replace(/\u200D([\u2640\u2642\u2695\u2696\u2708\u2764])(?!\uFE0F)/g, "‍$1️");
  return { name: fixed };
}
function formatDiscordApiError(body) {
  if (!body || typeof body !== "object") return "";
  const parts = [];
  if (typeof body.message === "string" && body.message.trim()) parts.push(body.message.trim());
  const walk = (node, path) => {
    if (!node || typeof node !== "object" || parts.length >= 4) return;
    if (Array.isArray(node._errors)) {
      for (const err of node._errors) {
        if (err && typeof err.message === "string") parts.push(path ? `${path}: ${err.message}` : err.message);
      }
      return;
    }
    for (const [key, val] of Object.entries(node)) {
      if (key === "_errors") continue;
      walk(val, path ? `${path}.${key}` : key);
    }
  };
  if (body.errors) walk(body.errors, "");
  return parts.join(" — ");
}
function fillTokens(text, ctx) {
  const values = tokenValues(ctx);
  return text.replace(/\{\s*([a-zA-Z0-9_.:|-]+)\s*\}/g, (match, token) => {
    if (/^imgcard:/i.test(token)) return "";
    const value = findSample(values, token);
    if (!value) return match;
    return value.mention ? `<@${ctx.userId}>` : value.text;
  });
}
const AVATAR_TOKENS = /* @__PURE__ */ new Set(["{user.avatar}", "{user_avatar}", "{user.display_avatar}", "{guild.icon}", "{server_icon}"]);
const ACTION_STYLE = { blurple: 1, primary: 1, green: 3, success: 3, grey: 2, gray: 2, secondary: 2, red: 4, danger: 4 };
const ROLE_LETTER = { role: "t", addrole: "a", removerole: "r" };
const MODE_LETTER = { ephemeral: "e", public: "p", dm: "d" };
function actionCustomId(actions, roles, index) {
  if (!roles || !Array.isArray(actions)) return null;
  const segments = [];
  let hasEmbed = false;
  for (const action of actions.slice(0, 4)) {
    if (!action || typeof action !== "object") continue;
    if (action.type === "embed") {
      const name = String(action.ref ?? "").toLowerCase();
      if (hasEmbed || !/^[a-z0-9_-]{1,32}$/.test(name)) continue;
      hasEmbed = true;
      segments.push(`e${MODE_LETTER[String(action.mode ?? "ephemeral").toLowerCase()] ?? "e"}${name}`);
    } else if (ROLE_LETTER[action.type]) {
      const text = String(action.ref ?? "").trim();
      const id = /^<@&(\d{15,25})>$/.exec(text)?.[1] ?? (/^\d{15,25}$/.test(text) ? text : null);
      const name = text.replace(/^@/, "").toLowerCase();
      const role = id ? roles.find((r) => r.id === id) : roles.find((r) => r.name.toLowerCase() === name);
      if (role) segments.push(`${ROLE_LETTER[action.type]}${role.id}`);
    }
  }
  if (!segments.length) return null;
  const customId = `eb:${segments.join(";")}#${index.toString(36)}`;
  return customId.length <= 100 ? customId : null;
}
function buildDiscordMessage(data, ctx, images, roles = null) {
  const fill = (text) => fillTokens(text, ctx);
  if (data.v2) return buildV2Message(data.v2.components, fill, images, ctx.userId, roles);
  const url = (value) => {
    if (!value) return void 0;
    if (AVATAR_TOKENS.has(value.trim())) return (value.includes("guild") || value.includes("server") ? images.serverIcon : images.userAvatar) ?? void 0;
    return value;
  };
  const embeds = data.embeds.map((e) => ({
    title: e.title ? fill(e.title) : void 0,
    description: e.description ? fill(e.description) : void 0,
    url: url(e.url),
    color: e.color ?? void 0,
    timestamp: e.timestamp ? (/* @__PURE__ */ new Date()).toISOString() : void 0,
    thumbnail: url(e.thumbnail) ? { url: url(e.thumbnail) } : void 0,
    image: url(e.image) ? { url: url(e.image) } : void 0,
    author: e.author.name ? { name: fill(e.author.name), icon_url: url(e.author.icon), url: url(e.author.url) } : void 0,
    footer: e.footer.text ? { text: fill(e.footer.text), icon_url: url(e.footer.icon) } : void 0,
    fields: e.fields.filter((f) => f.name && f.value).map((f) => ({ name: fill(f.name), value: fill(f.value), inline: f.inline }))
  }));
  let actionIndex = 0;
  const components = data.buttons.map((row) => row.map((b) => {
    if (!b.label) return null;
    const parsedEmoji = normalizeDiscordEmoji(b.emoji);
    const emoji = parsedEmoji ? { emoji: parsedEmoji } : {};
    if (Array.isArray(b.actions) && b.actions.length) {
      const customId = actionCustomId(b.actions, roles, actionIndex);
      if (!customId) return null;
      actionIndex += 1;
      return { type: 2, style: ACTION_STYLE[String(b.style ?? "").toLowerCase()] ?? 2, label: fill(b.label), custom_id: customId, disabled: b.disabled, ...emoji };
    }
    return /^https?:\/\//i.test(b.url) ? { type: 2, style: 5, label: fill(b.label), url: b.url, disabled: b.disabled, ...emoji } : null;
  }).filter(Boolean).slice(0, 5)).filter((row) => row.length > 0).map((row) => ({ type: 1, components: row }));
  return {
    content: data.content ? fill(data.content) : void 0,
    embeds,
    components,
    // A test message may mention the person who sent it, and nobody else.
    allowed_mentions: { parse: [], users: [ctx.userId] }
  };
}
const V2_FLAG = 32768;
function buildV2Message(nodes, fill, images, userId, roles) {
  let actionIndex = 0;
  let displayIndex = 0;
  const picture = (value) => {
    const raw = (value ?? "").trim();
    if (AVATAR_TOKENS.has(raw)) return (raw.includes("guild") || raw.includes("server") ? images.serverIcon : images.userAvatar) ?? "";
    const filled = fill(raw);
    return /^https?:\/\/\S+$/i.test(filled) ? filled : "";
  };
  const text = (value) => fill(value).trim();
  const walk = (node) => {
    switch (node.type) {
      case 10: {
        const content = text(node.content ?? "");
        return content ? { type: 10, content } : null;
      }
      case 14:
        return { type: 14, divider: node.divider !== false, spacing: node.spacing === 2 ? 2 : 1 };
      case 12: {
        const items = (node.items ?? []).map((item) => ({ url: picture(item.media?.url), item })).filter((x) => x.url).map(({ url, item }) => ({ media: { url }, ...item.description ? { description: text(item.description) } : {}, spoiler: Boolean(item.spoiler) }));
        return items.length ? { type: 12, items } : null;
      }
      case 9: {
        const texts = (node.components ?? []).map(walk).filter(Boolean);
        if (!texts.length) return null;
        let accessory = null;
        if (node.accessory?.type === 11) {
          const url = picture(node.accessory.media?.url);
          if (url) accessory = { type: 11, media: { url }, spoiler: Boolean(node.accessory.spoiler) };
        } else if (node.accessory?.type === 2) accessory = walk(node.accessory);
        return accessory ? { type: 9, components: texts, accessory } : texts;
      }
      case 2: {
        const parsedEmoji = normalizeDiscordEmoji(node.emoji);
        const emoji = parsedEmoji ? { emoji: parsedEmoji } : {};
        if (Array.isArray(node.actions) && node.actions.length) {
          const label2 = text(node.label ?? "").replace(/\*\*/g, "").slice(0, 80);
          const customId = actionCustomId(node.actions, roles, actionIndex);
          if (!customId || !label2 && !parsedEmoji) return null;
          actionIndex += 1;
          const style = [1, 2, 3, 4].includes(Number(node.style)) ? Number(node.style) : ACTION_STYLE[String(node.style ?? "").toLowerCase()] ?? 2;
          return { type: 2, style, custom_id: customId, ...label2 ? { label: label2 } : {}, ...emoji, ...node.disabled ? { disabled: true } : {} };
        }
        if ([1, 2, 3, 4].includes(Number(node.style))) {
          const label2 = text(node.label ?? "").replace(/\*\*/g, "").slice(0, 80);
          if (!label2 && !parsedEmoji) return null;
          displayIndex += 1;
          return { type: 2, style: Number(node.style), custom_id: `petto_display:${displayIndex}`, ...label2 ? { label: label2 } : {}, ...emoji };
        }
        const label = text(node.label ?? "");
        const url = picture(node.url);
        return url && (label || parsedEmoji) ? { type: 2, style: 5, ...label ? { label: label.slice(0, 80) } : {}, url, ...emoji, ...node.disabled ? { disabled: true } : {} } : null;
      }
      case 1: {
        const buttons = (node.components ?? []).map(walk).filter(Boolean);
        return buttons.length ? { type: 1, components: buttons } : null;
      }
      case 17: {
        const children = (node.components ?? []).flatMap((child) => {
          const built = walk(child);
          return Array.isArray(built) ? built : built ? [built] : [];
        });
        return children.length ? { type: 17, ...typeof node.accent_color === "number" ? { accent_color: node.accent_color } : {}, ...node.spoiler ? { spoiler: true } : {}, components: children } : null;
      }
      default:
        return null;
    }
  };
  const components = nodes.flatMap((node) => {
    const built = walk(node);
    return Array.isArray(built) ? built : built ? [built] : [];
  });
  return { content: void 0, embeds: [], components, flags: V2_FLAG, allowed_mentions: { parse: [], users: [userId] } };
}
async function sendTestMessage(botToken, message, target, file) {
  const headers = { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" };
  let channelId;
  if ("channelId" in target) {
    channelId = target.channelId;
  } else {
    const dm = await fetch(`${API}/users/@me/channels`, { method: "POST", headers, body: JSON.stringify({ recipient_id: target.dmUserId }) });
    if (!dm.ok) return { ok: false, error: "Petto could not open a direct message with you. Check that your DMs allow messages from server members." };
    channelId = (await dm.json()).id;
  }
  if (!message.content && message.embeds.length === 0 && !file && !message.flags) return { ok: false, error: "This template is empty, add some text or an embed first." };
  let res;
  if (file) {
    const form = new FormData();
    form.append("payload_json", JSON.stringify({ ...message, attachments: [{ id: 0, filename: file.name }] }));
    form.append("files[0]", new Blob([file.bytes], { type: "image/png" }), file.name);
    res = await fetch(`${API}/channels/${encodeURIComponent(channelId)}/messages`, { method: "POST", headers: { Authorization: headers.Authorization }, body: form });
  } else {
    res = await fetch(`${API}/channels/${encodeURIComponent(channelId)}/messages`, { method: "POST", headers, body: JSON.stringify(message) });
  }
  if (res.ok) return { ok: true };
  if (res.status === 403) return { ok: false, error: "Petto cannot send messages in that channel. Check its permissions there." };
  if (res.status === 404) return { ok: false, error: "That channel does not exist anymore." };
  const errBody = await res.json().catch(() => null);
  const detail = formatDiscordApiError(errBody);
  return { ok: false, error: detail ? `Discord: ${detail}` : "Discord rejected the message. Check the links and image addresses in the template." };
}

export { buildDiscordMessage as b, sendTestMessage as s };
