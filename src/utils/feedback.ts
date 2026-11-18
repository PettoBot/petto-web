// The feedback board (petto.sbs/feedback): ideas, feedback and bugs that people write and vote on. The posts live in the bot's
// database (tables `feedback_posts`, `feedback_votes`, `feedback_comments`). Each new post is also published in the Petto server by Petto itself,
// as a card with like and dislike buttons; a press there is saved by Petto straight in the same tables.
import { getEnv } from './env';
import { getTeamIds } from './team';

export const KINDS = ['idea', 'feedback', 'bug'] as const;
export type Kind = (typeof KINDS)[number];
export const STATUSES = ['open', 'planned', 'in_progress', 'done', 'declined'] as const;
export type Status = (typeof STATUSES)[number];
export const TAGS = ['commands', 'moderation', 'logging', 'dashboard', 'website', 'quests', 'embeds', 'premium', 'other'] as const;
export const SORTS = ['top', 'new', 'discussed'] as const;
export type Sort = (typeof SORTS)[number];

export const LIMITS = { title: 120, body: 4000, comment: 1000, note: 500, tags: 3, perDay: 10, commentsPerHour: 30 };

/** The emojis of the board, the ones of the Petto server (they are drawn from Discord's CDN). */
export const EMOJI = {
  like: { id: '1464274175110942740', name: 'like' },
  dislike: { id: '1464274177996357653', name: 'dislike' },
  suggest: { id: '1464283727386640585', name: 'suggeuser' },
};
export const emojiUrl = (emoji: { id: string }) => `https://cdn.discordapp.com/emojis/${emoji.id}.png?size=64&quality=lossless`;

export interface Post {
  id: number;
  user_id: string;
  username: string;
  avatar: string | null;
  kind: Kind;
  title: string;
  body: string;
  tags: string[];
  status: Status;
  status_note: string;
  votes_up: number;
  votes_down: number;
  comments_count: number;
  discord_channel_id: string | null;
  discord_message_id: string | null;
  created_at: string;
  updated_at: string;
}
export interface Comment { id: number; post_id: number; user_id: string; username: string; avatar: string | null; body: string; staff: boolean; created_at: string }

function api(astro: any) {
  const baseUrl = getEnv(astro, 'PETTO_BOT_API_URL');
  const key = getEnv(astro, 'PETTO_BOT_API_SECRET');
  if (!baseUrl || !key) return null;
  return { baseUrl, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' } };
}

async function read<T>(astro: any, path: string): Promise<T[] | null> {
  const config = api(astro);
  if (!config) return null;
  try {
    const response = await fetch(`${config.baseUrl}/rest/v1/${path}`, { headers: config.headers, signal: AbortSignal.timeout(6_000) });
    return response.ok ? ((await response.json()) as T[]) : null;
  } catch {
    return null;
  }
}

async function write(astro: any, method: 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown, prefer = 'return=representation'): Promise<any[] | null> {
  const config = api(astro);
  if (!config) return null;
  try {
    const response = await fetch(`${config.baseUrl}/rest/v1/${path}`, { method, headers: { ...config.headers, Prefer: prefer }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(8_000) });
    if (!response.ok) return null;
    return prefer.includes('return=minimal') ? [] : ((await response.json().catch(() => [])) as any[]);
  } catch {
    return null;
  }
}

/** Whether the board can read and write (the bot's API is set and the tables exist). */
export async function boardReady(astro: any): Promise<boolean> {
  return (await read<Post>(astro, 'feedback_posts?select=id&limit=1')) !== null;
}

const clean = (value: unknown, max: number) => String(value ?? '').replace(/\r\n/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
const oneLine = (value: unknown, max: number) => clean(value, max).replace(/\s+/g, ' ');
export const isKind = (value: unknown): value is Kind => (KINDS as readonly string[]).includes(String(value));
export const isStatus = (value: unknown): value is Status => (STATUSES as readonly string[]).includes(String(value));
export const isSort = (value: unknown): value is Sort => (SORTS as readonly string[]).includes(String(value));

export function readPost(form: FormData): { ok: true; post: { kind: Kind; title: string; body: string; tags: string[] } } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const kind = String(form.get('kind') ?? 'idea');
  const title = oneLine(form.get('title'), LIMITS.title);
  const body = clean(form.get('body'), LIMITS.body);
  const tags = [...new Set(form.getAll('tags').map(String).filter((tag) => (TAGS as readonly string[]).includes(tag)))].slice(0, LIMITS.tags);
  if (!isKind(kind)) errors.kind = 'invalid';
  if (title.length < 3) errors.title = 'short';
  if (body.length < 10) errors.body = 'short';
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, post: { kind: kind as Kind, title, body, tags } };
}
export const readComment = (value: unknown) => clean(value, LIMITS.comment);

// A person can write a limited number of posts a day and comments an hour. It is kept in memory, which is enough to slow a flood down.
const buckets = new Map<string, number[]>();
export function tooMany(userId: string, action: 'post' | 'comment' | 'vote', now = Date.now()): boolean {
  const [limit, window] = action === 'post' ? [LIMITS.perDay, 86_400_000] : action === 'comment' ? [LIMITS.commentsPerHour, 3_600_000] : [120, 3_600_000];
  const key = `${action}:${userId}`;
  const recent = (buckets.get(key) ?? []).filter((time) => now - time < window);
  if (recent.length >= limit) { buckets.set(key, recent); return true; }
  recent.push(now);
  buckets.set(key, recent);
  return false;
}

export interface ListOptions { kind?: string; tag?: string; status?: string; sort?: string; q?: string; page?: number }
export const PAGE_SIZE = 15;

/** The posts of a page of the board, with the filters the person chose. `total` is how many posts match. */
export async function listPosts(astro: any, options: ListOptions): Promise<{ posts: Post[]; total: number; pages: number } | null> {
  const filters: string[] = [];
  if (isKind(options.kind)) filters.push(`kind=eq.${options.kind}`);
  if (isStatus(options.status)) filters.push(`status=eq.${options.status}`);
  const q = String(options.q ?? '').replace(/[^\p{L}\p{N} _-]/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (q) filters.push(`title=ilike.*${encodeURIComponent(q)}*`);
  const sort = isSort(options.sort) ? options.sort : 'top';
  const order = sort === 'new' ? 'created_at.desc' : sort === 'discussed' ? 'comments_count.desc,created_at.desc' : 'votes_up.desc,created_at.asc';
  const rows = await read<Post>(astro, `feedback_posts?select=*&${filters.join('&')}${filters.length ? '&' : ''}order=${order}&limit=300`);
  if (!rows) return null;
  const tag = (TAGS as readonly string[]).includes(String(options.tag)) ? String(options.tag) : '';
  const matching = tag ? rows.filter((row) => row.tags?.includes(tag)) : rows;
  // "Top" is ranked by what other people think: the author's own like (the one every post starts with) does not count, and a post
  // nobody else has voted on does not appear in it. On a tie the older post goes first, so a new post does not rise only for being new.
  let ranked = matching;
  if (sort === 'top') {
    const authors = [...new Set(matching.map((row) => row.user_id))];
    const own = matching.length && authors.length
      ? await read<{ post_id: number; user_id: string; value: number }>(astro, `feedback_votes?select=post_id,user_id,value&post_id=in.(${matching.map((row) => row.id).join(',')})&user_id=in.(${authors.join(',')})&limit=5000`)
      : [];
    if (own === null) return null;
    const ownVote = new Map(own.filter((vote) => matching.some((row) => row.id === vote.post_id && row.user_id === vote.user_id)).map((vote) => [vote.post_id, vote.value]));
    const others = (row: Post) => {
      const mine = ownVote.get(row.id) ?? 0;
      return { count: row.votes_up + row.votes_down - (mine ? 1 : 0), score: row.votes_up - row.votes_down - mine };
    };
    ranked = matching.filter((row) => others(row).count > 0).sort((a, b) => others(b).score - others(a).score || +new Date(a.created_at) - +new Date(b.created_at));
  }
  const pages = Math.max(1, Math.ceil(ranked.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Math.floor(Number(options.page) || 1)));
  return { posts: ranked.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), total: ranked.length, pages };
}

export async function getPost(astro: any, id: number): Promise<Post | null> {
  if (!Number.isSafeInteger(id) || id < 1) return null;
  return (await read<Post>(astro, `feedback_posts?id=eq.${id}&select=*`))?.[0] ?? null;
}
export async function listComments(astro: any, id: number): Promise<Comment[]> {
  return (await read<Comment>(astro, `feedback_comments?post_id=eq.${id}&select=*&order=created_at.asc&limit=200`)) ?? [];
}
/** The vote (1, -1 or 0) a person gave to each of some posts. */
export async function votesOf(astro: any, userId: string, ids: number[]): Promise<Map<number, number>> {
  if (!ids.length) return new Map();
  const rows = await read<{ post_id: number; value: number }>(astro, `feedback_votes?user_id=eq.${userId}&post_id=in.(${ids.join(',')})&select=post_id,value`);
  return new Map((rows ?? []).map((row) => [row.post_id, row.value]));
}

export async function createPost(astro: any, author: { userId: string; username: string; avatar: string | null }, post: { kind: Kind; title: string; body: string; tags: string[] }): Promise<Post | null> {
  const rows = await write(astro, 'POST', 'feedback_posts', { user_id: author.userId, username: author.username.slice(0, 80), avatar: author.avatar, ...post });
  const created = (rows?.[0] as Post | undefined) ?? null;
  if (created) {
    // The author's own vote starts the post at one like.
    await write(astro, 'POST', 'feedback_votes?on_conflict=post_id,user_id', { post_id: created.id, user_id: author.userId, value: 1 }, 'resolution=merge-duplicates,return=minimal');
  }
  return created;
}

/** Sets the vote of a person on a post: 1, -1, or 0 to take it back. Voting the same way twice takes it back. */
export async function setVote(astro: any, postId: number, userId: string, value: number): Promise<boolean> {
  if (value === 0) return (await write(astro, 'DELETE', `feedback_votes?post_id=eq.${postId}&user_id=eq.${userId}`, undefined, 'return=minimal')) !== null;
  return (await write(astro, 'POST', 'feedback_votes?on_conflict=post_id,user_id', { post_id: postId, user_id: userId, value }, 'resolution=merge-duplicates,return=minimal')) !== null;
}
export async function currentVote(astro: any, postId: number, userId: string): Promise<number> {
  return (await votesOf(astro, userId, [postId])).get(postId) ?? 0;
}

export async function addComment(astro: any, postId: number, author: { userId: string; username: string; avatar: string | null }, body: string, staff: boolean): Promise<Comment | null> {
  const rows = await write(astro, 'POST', 'feedback_comments', { post_id: postId, user_id: author.userId, username: author.username.slice(0, 80), avatar: author.avatar, body, staff });
  return (rows?.[0] as Comment | undefined) ?? null;
}

export async function setStatus(astro: any, postId: number, status: Status, note: string): Promise<Post | null> {
  const rows = await write(astro, 'PATCH', `feedback_posts?id=eq.${postId}`, { status, status_note: clean(note, LIMITS.note), updated_at: new Date().toISOString() });
  return (rows?.[0] as Post | undefined) ?? null;
}
export async function saveDiscordMessage(astro: any, postId: number, channelId: string, messageId: string): Promise<void> {
  await write(astro, 'PATCH', `feedback_posts?id=eq.${postId}`, { discord_channel_id: channelId, discord_message_id: messageId }, 'return=minimal');
}
/** Deletes one comment of a post (the database counts the comments again by itself). It is only deleted if it belongs to that post. */
export async function deleteComment(astro: any, postId: number, commentId: number): Promise<boolean> {
  if (!Number.isSafeInteger(postId) || postId < 1 || !Number.isSafeInteger(commentId) || commentId < 1) return false;
  const rows = await write(astro, 'DELETE', `feedback_comments?id=eq.${commentId}&post_id=eq.${postId}`);
  return Array.isArray(rows) && rows.length > 0;
}
export async function deletePost(astro: any, postId: number): Promise<boolean> {
  return (await write(astro, 'DELETE', `feedback_posts?id=eq.${postId}`, undefined, 'return=minimal')) !== null;
}

/** The team members who can change the state of a post and delete: the owners, the programmers and the support. */
export async function isStaff(astro: any, userId: string): Promise<boolean> {
  const { ids } = await getTeamIds(astro);
  return [...ids.owners, ...ids.programming, ...ids.support].includes(userId);
}

// The card of a post in the Petto server is Petto's: the bot publishes it, keeps it up to date and deletes it when the website asks (its
// route `/api/feedback/card/<action>`, with the same key as the database). Nothing here is needed for the board to work: without it the
// posts are only on the website.
type CardCall = { action: 'publish' | 'update' | 'remove'; post: Post };
export async function callFeedbackCard(astro: any, call: CardCall): Promise<{ channelId: string; messageId: string } | null> {
  const config = api(astro);
  if (!config) return null;
  try {
    const { id, discord_channel_id, discord_message_id } = call.post;
    const response = await fetch(`${config.baseUrl}/api/feedback/card/${call.action}`, {
      method: 'POST',
      signal: AbortSignal.timeout(8_000),
      // The bot's /api routes read the key from this header (the database route, /rest/v1, reads apikey and Authorization).
      headers: { ...config.headers, 'X-Petto-Dashboard-Key': config.headers.apikey },
      body: JSON.stringify({ post: { id, discord_channel_id, discord_message_id } }),
    });
    if (!response.ok) {
      // Said in the log (never the key): without it a refusal looks like a board that works and a card that never comes.
      const error: any = await response.json().catch(() => null);
      console.warn(`Asking the bot to ${call.action} the Discord card of feedback post ${id} failed: it answered ${response.status} ${error?.error ?? ''}`.trim());
      return null;
    }
    const payload: any = await response.json().catch(() => null);
    return payload?.messageId ? { channelId: String(payload.channelId), messageId: String(payload.messageId) } : null;
  } catch (error) {
    console.warn(`Asking the bot to ${call.action} the Discord card of feedback post ${call.post.id} failed: it could not be reached (${(error as Error)?.message ?? 'error'})`);
    return null;
  }
}
