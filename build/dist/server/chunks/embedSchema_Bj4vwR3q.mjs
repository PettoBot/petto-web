const BUTTON_ACTION_TYPES = ["role", "addrole", "removerole", "embed"];
const BUTTON_STYLES = ["blurple", "green", "grey", "red"];
const BUTTON_EMBED_MODES = ["ephemeral", "public", "dm"];
const MAX_BUTTON_ACTIONS = 4;
const V2_LIMITS = { components: 40, text: 4e3, buttonLabel: 80, url: 512, galleryItems: 10, rowButtons: 5, sectionTexts: 3, description: 1024 };
function emptyEmbed() {
  return { title: "", description: "", color: 8624639, url: "", thumbnail: "", image: "", timestamp: false, author: { name: "" }, footer: { text: "" }, fields: [] };
}
function emptyTemplate() {
  return { content: "", embeds: [], buttons: [] };
}
const isV2Data = (data) => Boolean(data && Array.isArray(data.v2?.components));
function readCard(raw) {
  if (!raw || typeof raw !== "object" || typeof raw.name !== "string") return void 0;
  const name = raw.name.toLowerCase().replace(/[^a-z0-9_-]/g, "_").slice(0, 40);
  if (!name) return void 0;
  return { name, placement: raw.placement === "embed" || raw.placement === "attachment" ? raw.placement : "default" };
}
const MAX_REACTIONS = 5;
function readReactions(raw) {
  if (!Array.isArray(raw)) return [];
  const clean = raw.map((item) => String(item ?? "").trim()).filter((item) => item && item.length <= 64 && !/\s/.test(item));
  return [...new Set(clean)].slice(0, MAX_REACTIONS);
}
function normalizeTemplateData(raw) {
  const reactions = readReactions(raw?.reactions);
  const withReactions = (data) => reactions.length ? { ...data, reactions } : data;
  const card = readCard(raw?.card);
  if (raw && typeof raw === "object" && Array.isArray(raw.v2?.components)) return withReactions({ content: "", embeds: [], buttons: [], v2: cleanV2(raw.v2), ...card ? { card } : {} });
  const withCard = (data) => withReactions(card ? { ...data, card } : data);
  if (raw && Array.isArray(raw.embeds)) {
    return withCard({
      content: raw.content ?? "",
      embeds: raw.embeds.map((e) => ({ ...emptyEmbed(), ...e, author: { ...emptyEmbed().author, ...e.author ?? {} }, footer: { ...emptyEmbed().footer, ...e.footer ?? {} }, fields: e.fields ?? [] })),
      buttons: raw.buttons ?? []
    });
  }
  const looksLikeEmbed = raw && (raw.title || raw.description || raw.author?.name || raw.footer?.text || raw.fields?.length || raw.image || raw.thumbnail || raw.color != null);
  if (looksLikeEmbed) {
    return withCard({ content: "", embeds: [{ ...emptyEmbed(), ...raw, author: { ...emptyEmbed().author, ...raw.author ?? {} }, footer: { ...emptyEmbed().footer, ...raw.footer ?? {} }, fields: raw.fields ?? [] }], buttons: [] });
  }
  return withCard(emptyTemplate());
}
const EMBED_LIMITS = {
  content: 2e3,
  embeds: 10,
  title: 256,
  description: 4096,
  fields: 25,
  fieldName: 256,
  fieldValue: 1024,
  footer: 2048,
  authorName: 256,
  url: 512,
  buttonRows: 5,
  buttonsPerRow: 5,
  buttonLabel: 80,
  totalChars: 6e3
};
const trim = (value, max) => String(value ?? "").slice(0, max);
const TOKEN_URLS = /* @__PURE__ */ new Set(["{user.avatar}", "{user_avatar}", "{user.display_avatar}", "{guild.icon}", "{server_icon}"]);
function cleanActions(button) {
  const actions = [];
  for (const raw of Array.isArray(button.actions) ? button.actions : []) {
    if (actions.length >= MAX_BUTTON_ACTIONS || !raw || !BUTTON_ACTION_TYPES.includes(raw.type)) continue;
    if (raw.type === "embed") {
      const ref = String(raw.ref ?? "").trim().toLowerCase().replace(/\s+/g, "-");
      if (/^[a-z0-9_-]{1,32}$/.test(ref) && !actions.some((a) => a.type === "embed")) actions.push({ type: "embed", ref, mode: BUTTON_EMBED_MODES.includes(raw.mode) ? raw.mode : "ephemeral" });
    } else {
      const ref = trim(raw.ref, 100).trim();
      if (ref) actions.push({ type: raw.type, ref });
    }
  }
  if (!actions.length) return {};
  return { style: BUTTON_STYLES.includes(button.style) ? button.style : "grey", actions };
}
const cleanUrl = (value) => {
  const text = trim(value, EMBED_LIMITS.url).trim();
  return text === "" || TOKEN_URLS.has(text) || /^https?:\/\/\S+$/i.test(text) ? text : "";
};
function validateTemplate(raw) {
  const source = normalizeTemplateData(raw);
  const reactions = readReactions(source.reactions);
  if (source.v2) return { ok: true, data: { content: "", embeds: [], buttons: [], v2: source.v2, ...source.card ? { card: source.card } : {}, ...reactions.length ? { reactions } : {} } };
  const data = {
    content: trim(source.content, EMBED_LIMITS.content),
    embeds: source.embeds.slice(0, EMBED_LIMITS.embeds).map((e) => ({
      title: trim(e.title, EMBED_LIMITS.title),
      description: trim(e.description, EMBED_LIMITS.description),
      color: typeof e.color === "number" && e.color >= 0 && e.color <= 16777215 ? Math.floor(e.color) : null,
      url: cleanUrl(e.url),
      thumbnail: cleanUrl(e.thumbnail),
      image: cleanUrl(e.image),
      timestamp: Boolean(e.timestamp),
      author: { name: trim(e.author?.name, EMBED_LIMITS.authorName), icon: cleanUrl(e.author?.icon), url: cleanUrl(e.author?.url) },
      footer: { text: trim(e.footer?.text, EMBED_LIMITS.footer), icon: cleanUrl(e.footer?.icon) },
      fields: (e.fields ?? []).slice(0, EMBED_LIMITS.fields).map((f) => ({ name: trim(f.name, EMBED_LIMITS.fieldName), value: trim(f.value, EMBED_LIMITS.fieldValue), inline: Boolean(f.inline) }))
    })),
    buttons: (source.buttons ?? []).slice(0, EMBED_LIMITS.buttonRows).map((row) => row.slice(0, EMBED_LIMITS.buttonsPerRow).map((b) => ({
      label: trim(b.label, EMBED_LIMITS.buttonLabel),
      url: cleanUrl(b.url),
      emoji: trim(b.emoji, 64),
      disabled: Boolean(b.disabled),
      ...cleanActions(b)
    }))).filter((row) => row.length > 0),
    ...source.card ? { card: source.card } : {},
    ...reactions.length ? { reactions } : {}
  };
  const total = data.content.length + data.embeds.reduce((sum, e) => sum + e.title.length + e.description.length + e.author.name.length + e.footer.text.length + e.fields.reduce((s, f) => s + f.name.length + f.value.length, 0), 0);
  if (total > EMBED_LIMITS.totalChars) return { ok: false, error: `This message is ${total} characters long, Discord accepts at most ${EMBED_LIMITS.totalChars} across the text and embeds.` };
  return { ok: true, data };
}
const clip = (value, max) => String(value ?? "").slice(0, max);
const cleanV2Url = (value) => {
  const text = clip(value, V2_LIMITS.url).trim();
  return text === "" || /^\{[a-z_.]+\}$/i.test(text) || /^https?:\/\/\S+$/i.test(text) ? text : "";
};
const cleanEmoji = (raw) => {
  const name = clip(raw?.name, 64);
  if (!name) return void 0;
  return /^\d{15,25}$/.test(String(raw?.id ?? "")) ? { name, id: String(raw.id), animated: Boolean(raw.animated) } : { name };
};
function cleanButton(raw) {
  if (!raw || raw.type !== 2) return null;
  const emoji = cleanEmoji(raw.emoji);
  const style = Number(raw.style);
  const { actions } = cleanActions({ actions: raw.actions });
  if (actions) return { type: 2, style: [1, 2, 3, 4].includes(style) ? style : 2, label: clip(raw.label, V2_LIMITS.buttonLabel), actions, ...emoji ? { emoji } : {} };
  if ([1, 2, 3, 4].includes(style)) return { type: 2, style, label: clip(raw.label, V2_LIMITS.buttonLabel), custom_id: clip(raw.custom_id, 100) || "display", ...emoji ? { emoji } : {} };
  return { type: 2, style: 5, label: clip(raw.label, V2_LIMITS.buttonLabel), url: cleanV2Url(raw.url), ...emoji ? { emoji } : {}, ...raw.disabled ? { disabled: true } : {} };
}
function cleanThumbnail(raw) {
  if (!raw || raw.type !== 11) return null;
  return { type: 11, media: { url: cleanV2Url(raw.media?.url) }, ...raw.description ? { description: clip(raw.description, V2_LIMITS.description) } : {}, ...raw.spoiler ? { spoiler: true } : {} };
}
function countV2(doc) {
  let components = 0;
  let chars = 0;
  const visit = (node) => {
    components += 1;
    if (typeof node.content === "string") chars += node.content.length;
    for (const child of node.components ?? []) visit(child);
    if (node.accessory) visit(node.accessory);
  };
  for (const node of doc.components) visit(node);
  return { components, chars };
}
function cleanChild(raw) {
  switch (raw?.type) {
    case 10:
      return { type: 10, content: clip(raw.content, V2_LIMITS.text) };
    case 14:
      return { type: 14, divider: raw.divider !== false, spacing: raw.spacing === 2 ? 2 : 1 };
    case 12:
      return { type: 12, items: (Array.isArray(raw.items) ? raw.items : []).slice(0, V2_LIMITS.galleryItems).map((item) => ({ media: { url: cleanV2Url(item?.media?.url) }, ...item?.description ? { description: clip(item.description, V2_LIMITS.description) } : {}, ...item?.spoiler ? { spoiler: true } : {} })) };
    case 9: {
      const texts = (Array.isArray(raw.components) ? raw.components : []).filter((t) => t?.type === 10).slice(0, V2_LIMITS.sectionTexts).map((t) => ({ type: 10, content: clip(t.content, V2_LIMITS.text) }));
      const accessory = raw.accessory?.type === 11 ? cleanThumbnail(raw.accessory) : raw.accessory?.type === 2 ? cleanButton(raw.accessory) : null;
      return { type: 9, components: texts.length ? texts : [{ type: 10, content: "" }], ...accessory ? { accessory } : {} };
    }
    case 1:
      return { type: 1, components: (Array.isArray(raw.components) ? raw.components : []).slice(0, V2_LIMITS.rowButtons).map(cleanButton).filter(Boolean) };
    default:
      return null;
  }
}
function cleanV2(raw) {
  const doc = { components: [] };
  for (const node of Array.isArray(raw?.components) ? raw.components : []) {
    if (node?.type === 17) {
      const accent = Number.isInteger(node.accent_color) && node.accent_color >= 0 && node.accent_color <= 16777215 ? node.accent_color : null;
      const children = (Array.isArray(node.components) ? node.components : []).map(cleanChild).filter(Boolean);
      doc.components.push({ type: 17, accent_color: accent, ...node.spoiler ? { spoiler: true } : {}, components: children });
    } else {
      const child = cleanChild(node);
      if (child) doc.components.push(child);
    }
  }
  while (doc.components.length > 1 && (countV2(doc).components > V2_LIMITS.components || countV2(doc).chars > V2_LIMITS.text)) doc.components.pop();
  return doc;
}

export { isV2Data as i, validateTemplate as v };
