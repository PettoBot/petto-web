const QUESTION_TYPES = ["short", "paragraph", "number", "yesno", "choice", "multi"];
const CHOICE_TYPES = ["choice", "multi"];
const STATUSES = ["pending", "accepted", "denied", "cancelled"];
const BUTTON_STYLES = ["primary", "secondary", "success", "danger"];
const PAGE_BACKGROUNDS = ["default", "solid", "gradient", "aurora", "waves"];
const PREMIUM_PAGE_BACKGROUNDS = ["aurora", "waves"];
const usesPremiumLook = (form) => PREMIUM_PAGE_BACKGROUNDS.includes(String(form?.page_background ?? "")) || form?.page_hide_branding === true;
const LIMITS = {
  title: 45,
  label: 45,
  help: 100,
  placeholder: 100,
  option: 100,
  options: 25,
  description: 1e3,
  questionDescription: 1e3,
  image: 500,
  short: 1e3,
  paragraph: 4e3,
  pageSize: 5,
  questions: 25,
  reason: 1e3,
  message: 2e3,
  buttonLabel: 80,
  roles: 25,
  embedTitle: 90,
  embedDescription: 240
};
const FORM_PLAN = { forms: 25, questions: 25, submissions: 2e3 };
const DEFAULT_MAX = { short: 200, paragraph: 1e3 };
const SNOWFLAKE = /^\d{15,25}$/;
const NAME = /^[a-z0-9][a-z0-9_-]{0,31}$/;
const PUBLIC_ID = /^[0-9A-Za-z]{12}$/;
const PUBLIC_ID_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function newPublicId() {
  let id = "";
  while (id.length < 12) {
    for (const byte of crypto.getRandomValues(new Uint8Array(16))) {
      if (byte < 248 && id.length < 12) id += PUBLIC_ID_ALPHABET[byte % 62];
    }
  }
  return id;
}
const FORM_LANG_PATH = { es: "/es", "pt-BR": "/pt-br", pt: "/pt-br" };
const formPagePath = (lang = "en") => `${FORM_LANG_PATH[lang] ?? ""}/form`;
const formIdPath = (id, lang = "en") => `${formPagePath(lang)}/${id}`;
const formWebPath = (form, lang = "en") => PUBLIC_ID.test(String(form?.public_id ?? "")) ? formIdPath(String(form.public_id), lang) : null;
const EMBED_COLUMNS = ["embed_title", "embed_description", "embed_image", "embed_color", "embed_thumbnail"];
const NEWER_PAGE_COLUMNS = ["page_hide_branding"];
const clip = (value, max) => String(value ?? "").replace(/\u0000/g, "").trim().slice(0, max);
const whole = (value, min, max, fallback) => {
  if (value === null || value === void 0 || value === "") return fallback;
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};
const finite = (value) => {
  if (value === null || value === void 0 || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};
const ids = (list, max = LIMITS.roles) => [...new Set((Array.isArray(list) ? list : []).map(String).filter((id) => SNOWFLAKE.test(id)))].slice(0, max);
const clipText = (value, max) => String(value ?? "").replace(/\u0000/g, "").replace(/\r\n?/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, max);
function imageUrl(value) {
  const text = String(value ?? "").trim();
  if (!text || text.length > LIMITS.image) return null;
  let url;
  try {
    url = new URL(text);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port && url.port !== "443") return null;
  const host = url.hostname.toLowerCase();
  if (!host.includes(".") || host.startsWith("[") || /^[\d.]+$/.test(host) || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return null;
  return /\.(?:png|jpe?g|gif|webp)$/i.test(url.pathname) && url.toString().length <= LIMITS.image ? url.toString() : null;
}
const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
function descriptionHtml(text) {
  const links = [];
  const link = (href, label) => {
    links.push(`<a href="${href}" target="_blank" rel="noopener noreferrer nofollow ugc">${label}</a>`);
    return `${links.length - 1}`;
  };
  let html = escapeHtml(String(text ?? "").replace(/[\u0001\u0002]/g, ""));
  html = html.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s()<>"]+)\)/g, (_m, label, href) => link(href, label));
  html = html.replace(/\bhttps?:\/\/[^\s<>"\u0001]+[^\s<>"\u0001.,;:!?)'\]]/g, (href) => link(href, href));
  html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>").replace(/\*\*(?=\S)([^\n]*?\S)\*\*/g, "<strong>$1</strong>").replace(/__(?=\S)([^\n]*?\S)__/g, "<u>$1</u>").replace(/~~(?=\S)([^\n]*?\S)~~/g, "<s>$1</s>").replace(/(^|[^\w*])\*(?=\S)([^*\n]*?\S)\*(?!\w)/g, "$1<em>$2</em>").replace(/(^|[^\w])_(?=\S)([^_\n]*?\S)_(?!\w)/g, "$1<em>$2</em>");
  return html.replace(/\u0001(\d+)\u0002/g, (_m, i) => links[Number(i)]).replace(/\n/g, "<br>");
}
function slugName(value) {
  return String(value ?? "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9_-]+/g, "-").replace(/^[-_]+|-+$/g, "").slice(0, 32);
}
function normalizeQuestion(input, index = 0, seen = /* @__PURE__ */ new Set()) {
  const type = QUESTION_TYPES.includes(input?.type) ? input.type : "short";
  const label = clip(input?.label, LIMITS.label);
  if (!label) return null;
  let id = /^[a-z0-9_-]{1,20}$/i.test(String(input?.id ?? "")) ? String(input.id) : `q${index + 1}`;
  while (seen.has(id)) id = `${id.slice(0, 18)}${seen.size}`;
  seen.add(id);
  const question = { id, type, label, help: clip(input?.help, LIMITS.help) || null, description: clipText(input?.description, LIMITS.questionDescription) || null, image: imageUrl(input?.image), placeholder: clip(input?.placeholder, LIMITS.placeholder) || null, required: input?.required !== false };
  if (type === "short" || type === "paragraph") {
    const cap = LIMITS[type];
    const max = whole(input?.max_length, 1, cap, DEFAULT_MAX[type]);
    question.max_length = max;
    question.min_length = Math.min(whole(input?.min_length, 0, cap, 0), max);
  }
  if (type === "number") {
    let min = finite(input?.min_value);
    let max = finite(input?.max_value);
    if (min !== null && max !== null && min > max) [min, max] = [max, min];
    question.min_value = min;
    question.max_value = max;
  }
  if (CHOICE_TYPES.includes(type)) {
    const raw = Array.isArray(input?.options) ? input.options : String(input?.options ?? "").split(/\r?\n|\|/);
    const options = [...new Set(raw.map((o) => clip(o, LIMITS.option)).filter(Boolean))].slice(0, LIMITS.options);
    if (options.length < 2) return null;
    question.options = options;
    if (type === "multi") question.max_choices = whole(input?.max_choices, 1, options.length, options.length);
  }
  return question;
}
function normalizeQuestions(list, max = LIMITS.questions) {
  const seen = /* @__PURE__ */ new Set();
  return (Array.isArray(list) ? list : []).map((q, i) => normalizeQuestion(q, i, seen)).filter((q) => Boolean(q)).slice(0, max);
}
const cleanMessage = (input) => {
  const out = {};
  const text = clip(input?.text, LIMITS.message);
  const template = clip(input?.template, 100);
  if (text) out.text = text;
  if (template) out.template = template;
  return out;
};
function normalizeForm(input, { maxQuestions = LIMITS.questions } = {}) {
  const color = finite(input?.color);
  const closes = input?.closes_at ? new Date(input.closes_at) : null;
  return {
    name: slugName(input?.name) || "form",
    title: clip(input?.title, LIMITS.title) || clip(input?.name, LIMITS.title) || "Form",
    description: clip(input?.description, LIMITS.description) || null,
    color: color !== null && color >= 0 && color <= 16777215 ? Math.trunc(color) : null,
    status: input?.status === "open" ? "open" : "closed",
    questions: normalizeQuestions(input?.questions, maxQuestions),
    review_channel_id: SNOWFLAKE.test(String(input?.review_channel_id ?? "")) ? String(input.review_channel_id) : null,
    reviewer_role_ids: ids(input?.reviewer_role_ids),
    ping_role_ids: ids(input?.ping_role_ids, 5),
    auto_thread: input?.auto_thread === true,
    required_role_ids: ids(input?.required_role_ids),
    blocked_role_ids: ids(input?.blocked_role_ids),
    min_account_days: whole(input?.min_account_days, 0, 3650, 0),
    min_member_days: whole(input?.min_member_days, 0, 3650, 0),
    one_pending: input?.one_pending !== false,
    deny_cooldown_hours: whole(input?.deny_cooldown_hours, 0, 8760, 0),
    max_per_user: whole(input?.max_per_user, 0, 1e3, 0),
    max_total: whole(input?.max_total, 0, 1e5, 0),
    closes_at: closes && !Number.isNaN(closes.getTime()) ? closes.toISOString() : null,
    accept_add_role_ids: ids(input?.accept_add_role_ids),
    accept_remove_role_ids: ids(input?.accept_remove_role_ids),
    deny_add_role_ids: ids(input?.deny_add_role_ids),
    deny_remove_role_ids: ids(input?.deny_remove_role_ids),
    dm_results: input?.dm_results !== false,
    messages: { submitted: cleanMessage(input?.messages?.submitted), accepted: cleanMessage(input?.messages?.accepted), denied: cleanMessage(input?.messages?.denied) },
    button_label: clip(input?.button_label, LIMITS.buttonLabel) || null,
    button_emoji: clip(input?.button_emoji, 64) || null,
    button_style: BUTTON_STYLES.includes(input?.button_style) ? input.button_style : "primary",
    web_enabled: input?.web_enabled !== false,
    page_banner: imageUrl(input?.page_banner),
    page_background: PAGE_BACKGROUNDS.includes(input?.page_background) ? input.page_background : "default",
    page_show_icon: input?.page_show_icon !== false,
    page_show_name: input?.page_show_name !== false,
    page_hide_branding: input?.page_hide_branding === true,
    embed_title: clip(input?.embed_title, LIMITS.embedTitle) || null,
    embed_description: clipText(input?.embed_description, LIMITS.embedDescription) || null,
    embed_image: imageUrl(input?.embed_image),
    embed_color: embedColor(input?.embed_color),
    embed_thumbnail: input?.embed_thumbnail === true
  };
}
function embedColor(value) {
  if (value === null || value === void 0 || value === "") return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 16777215 ? n : null;
}
function linkEmbed(input) {
  const stored = input && ("embed_title" in input || "embed_color" in input || "embed_image" in input);
  const pick = (key) => stored ? input?.[`embed_${key}`] : input?.[key];
  return {
    title: clip(pick("title"), LIMITS.embedTitle) || null,
    description: clipText(pick("description"), LIMITS.embedDescription) || null,
    image: imageUrl(pick("image")),
    color: embedColor(pick("color")),
    thumbnail: pick("thumbnail") === true
  };
}
function pageLook(input) {
  const background = input?.background ?? input?.page_background;
  return {
    banner: imageUrl(input?.banner ?? input?.page_banner),
    background: PAGE_BACKGROUNDS.includes(background) ? background : "default",
    show_icon: (input?.show_icon ?? input?.page_show_icon) !== false,
    show_name: (input?.show_name ?? input?.page_show_name) !== false,
    hide_branding: (input?.hide_branding ?? input?.page_hide_branding) === true
  };
}
function answerText(answer, yes, no) {
  const value = answer?.value;
  if (Array.isArray(value)) return value.map((v) => `• ${v}`).join("\n");
  if (answer?.type === "yesno") return value === "yes" ? yes : value === "no" ? no : "";
  return String(value ?? "");
}
const hexColor = (n) => typeof n === "number" ? `#${n.toString(16).padStart(6, "0")}` : "";

export { BUTTON_STYLES as B, EMBED_COLUMNS as E, FORM_PLAN as F, LIMITS as L, NAME as N, PUBLIC_ID as P, QUESTION_TYPES as Q, STATUSES as S, PAGE_BACKGROUNDS as a, PREMIUM_PAGE_BACKGROUNDS as b, answerText as c, descriptionHtml as d, normalizeForm as e, formWebPath as f, newPublicId as g, hexColor as h, imageUrl as i, NEWER_PAGE_COLUMNS as j, formIdPath as k, linkEmbed as l, formPagePath as m, normalizeQuestions as n, pageLook as p, slugName as s, usesPremiumLook as u };
