// Shared bits of the feedback board pages: how a post is shown (kind, state, time) and the small styles every page uses.
import type { Post } from '../../utils/feedback';

export const KIND_ICON: Record<string, string> = { idea: 'ph:lightbulb-fill', feedback: 'ph:chat-circle-dots-fill', bug: 'ph:bug-fill' };
export const KIND_LABEL: Record<string, string> = { idea: 'Idea', feedback: 'Feedback', bug: 'Bug' };
export const STATUS_LABEL: Record<string, string> = { open: 'Open', planned: 'Planned', in_progress: 'In progress', done: 'Done', declined: 'Declined' };
export const TAG_LABEL: Record<string, string> = { commands: 'Commands', moderation: 'Moderation', logging: 'Logging', dashboard: 'Dashboard', website: 'Website', quests: 'Quests', embeds: 'Embeds', premium: 'Premium', other: 'Other' };

export function ago(date: string, lang: string): string {
  const seconds = Math.round((new Date(date).getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(lang === 'pt-BR' ? 'pt-BR' : lang, { numeric: 'auto' });
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [['year', 31_536_000], ['month', 2_592_000], ['day', 86_400], ['hour', 3_600], ['minute', 60]];
  for (const [unit, size] of steps) if (Math.abs(seconds) >= size) return formatter.format(Math.round(seconds / size), unit);
  return formatter.format(0, 'second');
}

export const score = (post: Pick<Post, 'votes_up' | 'votes_down'>) => post.votes_up - post.votes_down;
export const avatarOf = (id: string, avatar: string | null) => avatar ?? `https://cdn.discordapp.com/embed/avatars/${Number((BigInt(id) >> 22n) % 6n)}.png`;
