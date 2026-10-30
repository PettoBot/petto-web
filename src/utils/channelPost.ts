// Whether Petto can post in a channel, and why not, for the channel lists of the dashboard (Onboarding, Feeds...).
//
// The bot writes `bot_can_send` on every text channel of the saved copy of a server (petto-bot src/utils/guildSnapshots.js): true when it can
// View the channel and Send Messages there. It is only a yes or a no, so the reason can only be told when the bot also says whether it can
// see the channel (`bot_can_view`, not sent yet; see the report of the change that added this). Until then a "no" says what the bot needs.
//
// The mark is never glued into the name of the channel: the name stays as it is and the lists show `note` under it, in red.

/** What stops Petto: it cannot see the channel, it can see it but not write, or the bot only said "no" (the reason is unknown). */
export type PostProblem = 'view' | 'send' | 'unknown';

export interface PostableChannel { id: string; name: string; canPost: boolean; problem: PostProblem | null }

/** A channel of the saved copy of a server (or Discord's own answer, which has neither field: then nothing is marked). */
export function postableChannel(channel: { id: unknown; name: unknown; bot_can_send?: unknown; bot_can_view?: unknown }): PostableChannel {
  const canPost = channel.bot_can_send !== false;
  const problem: PostProblem | null = canPost ? null : channel.bot_can_view === false ? 'view' : channel.bot_can_view === true ? 'send' : 'unknown';
  return { id: String(channel.id), name: String(channel.name), canPost, problem };
}

/** The words under a channel Petto cannot post in (empty when it can). `dt` is the dashboard translator. */
export function postProblemText(dt: (key: string) => string, problem: PostProblem | null): string {
  if (!problem) return '';
  if (problem === 'view') return dt('Petto cannot see this channel');
  if (problem === 'send') return dt('Petto cannot send messages here');
  return dt('Petto needs View Channel and Send Messages here');
}

/** The channels of a list as the pickers take them (`SelectSource`, `SelectChosen`): the name as it is and, when Petto cannot post, the note. */
export function withPostNotes<T extends PostableChannel>(dt: (key: string) => string, channels: T[]): (T & { note?: string })[] {
  return channels.map((channel) => (channel.problem ? { ...channel, note: postProblemText(dt, channel.problem) } : channel));
}
