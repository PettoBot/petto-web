import { g as getEnv } from './env_WnBvzCjc.mjs';
import { g as getTeamIds } from './team_C2OWrCGw.mjs';

const KINDS = ["idea", "feedback", "bug"];
const STATUSES = ["open", "planned", "in_progress", "done", "declined"];
const TAGS = ["commands", "moderation", "logging", "dashboard", "website", "quests", "embeds", "premium", "other"];
const SORTS = ["top", "new", "discussed"];
const LIMITS = { title: 120, body: 4e3, comment: 1e3, note: 500, tags: 3, perDay: 10, commentsPerHour: 30 };
const EMOJI = {
  like: { id: "1464274175110942740"},
  dislike: { id: "1464274177996357653"},
  suggest: { id: "1464283727386640585"}
};
const emojiUrl = (emoji) => `https://cdn.discordapp.com/emojis/${emoji.id}.png?size=64&quality=lossless`;
function api(astro) {
  const baseUrl = getEnv(astro, "PETTO_BOT_API_URL");
  const key = getEnv(astro, "PETTO_BOT_API_SECRET");
  if (!baseUrl || !key) return null;
  return { baseUrl, headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" } };
}
async function read(astro, path) {
  const config = api(astro);
  if (!config) return null;
  try {
    const response = await fetch(`${config.baseUrl}/rest/v1/${path}`, { headers: config.headers, signal: AbortSignal.timeout(6e3) });
    return response.ok ? await response.json() : null;
  } catch {
    return null;
  }
}
async function write(astro, method, path, body, prefer = "return=representation") {
  const config = api(astro);
  if (!config) return null;
  try {
    const response = await fetch(`${config.baseUrl}/rest/v1/${path}`, { method, headers: { ...config.headers, Prefer: prefer }, body: body === void 0 ? void 0 : JSON.stringify(body), signal: AbortSignal.timeout(8e3) });
    if (!response.ok) return null;
    return prefer.includes("return=minimal") ? [] : await response.json().catch(() => []);
  } catch {
    return null;
  }
}
const clean = (value, max) => String(value ?? "").replace(/\r\n/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max);
const oneLine = (value, max) => clean(value, max).replace(/\s+/g, " ");
const isKind = (value) => KINDS.includes(String(value));
const isStatus = (value) => STATUSES.includes(String(value));
const isSort = (value) => SORTS.includes(String(value));
function readPost(form) {
  const errors = {};
  const kind = String(form.get("kind") ?? "idea");
  const title = oneLine(form.get("title"), LIMITS.title);
  const body = clean(form.get("body"), LIMITS.body);
  const tags = [...new Set(form.getAll("tags").map(String).filter((tag) => TAGS.includes(tag)))].slice(0, LIMITS.tags);
  if (!isKind(kind)) errors.kind = "invalid";
  if (title.length < 3) errors.title = "short";
  if (body.length < 10) errors.body = "short";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, post: { kind, title, body, tags } };
}
const readComment = (value) => clean(value, LIMITS.comment);
const buckets = /* @__PURE__ */ new Map();
function tooMany(userId, action, now = Date.now()) {
  const [limit, window] = action === "post" ? [LIMITS.perDay, 864e5] : action === "comment" ? [LIMITS.commentsPerHour, 36e5] : [120, 36e5];
  const key = `${action}:${userId}`;
  const recent = (buckets.get(key) ?? []).filter((time) => now - time < window);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return true;
  }
  recent.push(now);
  buckets.set(key, recent);
  return false;
}
const PAGE_SIZE = 15;
async function listPosts(astro, options) {
  const filters = [];
  if (isKind(options.kind)) filters.push(`kind=eq.${options.kind}`);
  if (isStatus(options.status)) filters.push(`status=eq.${options.status}`);
  const q = String(options.q ?? "").replace(/[^\p{L}\p{N} _-]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 60);
  if (q) filters.push(`title=ilike.*${encodeURIComponent(q)}*`);
  const sort = isSort(options.sort) ? options.sort : "top";
  const order = sort === "new" ? "created_at.desc" : sort === "discussed" ? "comments_count.desc,created_at.desc" : "votes_up.desc,created_at.asc";
  const rows = await read(astro, `feedback_posts?select=*&${filters.join("&")}${filters.length ? "&" : ""}order=${order}&limit=300`);
  if (!rows) return null;
  const tag = TAGS.includes(String(options.tag)) ? String(options.tag) : "";
  const matching = tag ? rows.filter((row) => row.tags?.includes(tag)) : rows;
  let ranked = matching;
  if (sort === "top") {
    const authors = [...new Set(matching.map((row) => row.user_id))];
    const own = matching.length && authors.length ? await read(astro, `feedback_votes?select=post_id,user_id,value&post_id=in.(${matching.map((row) => row.id).join(",")})&user_id=in.(${authors.join(",")})&limit=5000`) : [];
    if (own === null) return null;
    const ownVote = new Map(own.filter((vote) => matching.some((row) => row.id === vote.post_id && row.user_id === vote.user_id)).map((vote) => [vote.post_id, vote.value]));
    const others = (row) => {
      const mine = ownVote.get(row.id) ?? 0;
      return { count: row.votes_up + row.votes_down - (mine ? 1 : 0), score: row.votes_up - row.votes_down - mine };
    };
    ranked = matching.filter((row) => others(row).count > 0).sort((a, b) => others(b).score - others(a).score || +new Date(a.created_at) - +new Date(b.created_at));
  }
  const pages = Math.max(1, Math.ceil(ranked.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Math.floor(Number(options.page) || 1)));
  return { posts: ranked.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total: ranked.length, pages };
}
async function getPost(astro, id) {
  if (!Number.isSafeInteger(id) || id < 1) return null;
  return (await read(astro, `feedback_posts?id=eq.${id}&select=*`))?.[0] ?? null;
}
async function listComments(astro, id) {
  return await read(astro, `feedback_comments?post_id=eq.${id}&select=*&order=created_at.asc&limit=200`) ?? [];
}
async function votesOf(astro, userId, ids) {
  if (!ids.length) return /* @__PURE__ */ new Map();
  const rows = await read(astro, `feedback_votes?user_id=eq.${userId}&post_id=in.(${ids.join(",")})&select=post_id,value`);
  return new Map((rows ?? []).map((row) => [row.post_id, row.value]));
}
async function createPost(astro, author, post) {
  const rows = await write(astro, "POST", "feedback_posts", { user_id: author.userId, username: author.username.slice(0, 80), avatar: author.avatar, ...post });
  const created = rows?.[0] ?? null;
  if (created) {
    await write(astro, "POST", "feedback_votes?on_conflict=post_id,user_id", { post_id: created.id, user_id: author.userId, value: 1 }, "resolution=merge-duplicates,return=minimal");
  }
  return created;
}
async function setVote(astro, postId, userId, value) {
  if (value === 0) return await write(astro, "DELETE", `feedback_votes?post_id=eq.${postId}&user_id=eq.${userId}`, void 0, "return=minimal") !== null;
  return await write(astro, "POST", "feedback_votes?on_conflict=post_id,user_id", { post_id: postId, user_id: userId, value }, "resolution=merge-duplicates,return=minimal") !== null;
}
async function currentVote(astro, postId, userId) {
  return (await votesOf(astro, userId, [postId])).get(postId) ?? 0;
}
async function addComment(astro, postId, author, body, staff) {
  const rows = await write(astro, "POST", "feedback_comments", { post_id: postId, user_id: author.userId, username: author.username.slice(0, 80), avatar: author.avatar, body, staff });
  return rows?.[0] ?? null;
}
async function setStatus(astro, postId, status, note) {
  const rows = await write(astro, "PATCH", `feedback_posts?id=eq.${postId}`, { status, status_note: clean(note, LIMITS.note), updated_at: (/* @__PURE__ */ new Date()).toISOString() });
  return rows?.[0] ?? null;
}
async function saveDiscordMessage(astro, postId, channelId, messageId) {
  await write(astro, "PATCH", `feedback_posts?id=eq.${postId}`, { discord_channel_id: channelId, discord_message_id: messageId }, "return=minimal");
}
async function deleteComment(astro, postId, commentId) {
  if (!Number.isSafeInteger(postId) || postId < 1 || !Number.isSafeInteger(commentId) || commentId < 1) return false;
  const rows = await write(astro, "DELETE", `feedback_comments?id=eq.${commentId}&post_id=eq.${postId}`);
  return Array.isArray(rows) && rows.length > 0;
}
async function deletePost(astro, postId) {
  return await write(astro, "DELETE", `feedback_posts?id=eq.${postId}`, void 0, "return=minimal") !== null;
}
async function isStaff(astro, userId) {
  const { ids } = await getTeamIds(astro);
  return [...ids.owners, ...ids.programming, ...ids.support].includes(userId);
}
async function callFeedbackCard(astro, call) {
  const config = api(astro);
  if (!config) return null;
  try {
    const { id, discord_channel_id, discord_message_id } = call.post;
    const response = await fetch(`${config.baseUrl}/api/feedback/card/${call.action}`, {
      method: "POST",
      signal: AbortSignal.timeout(8e3),
      // The bot's /api routes read the key from this header (the database route, /rest/v1, reads apikey and Authorization).
      headers: { ...config.headers, "X-Petto-Dashboard-Key": config.headers.apikey },
      body: JSON.stringify({ post: { id, discord_channel_id, discord_message_id } })
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      console.warn(`Asking the bot to ${call.action} the Discord card of feedback post ${id} failed: it answered ${response.status} ${error?.error ?? ""}`.trim());
      return null;
    }
    const payload = await response.json().catch(() => null);
    return payload?.messageId ? { channelId: String(payload.channelId), messageId: String(payload.messageId) } : null;
  } catch (error) {
    console.warn(`Asking the bot to ${call.action} the Discord card of feedback post ${call.post.id} failed: it could not be reached (${error?.message ?? "error"})`);
    return null;
  }
}

export { EMOJI as E, KINDS as K, LIMITS as L, STATUSES as S, TAGS as T, addComment as a, deletePost as b, callFeedbackCard as c, deleteComment as d, isStatus as e, currentVote as f, getPost as g, setVote as h, isStaff as i, readPost as j, createPost as k, saveDiscordMessage as l, listComments as m, emojiUrl as n, SORTS as o, listPosts as p, readComment as r, setStatus as s, tooMany as t, votesOf as v };
