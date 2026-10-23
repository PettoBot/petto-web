// The modules of a server in one list: what each one does, where it is set up, and the step of the setup guide it belongs to.
export type ModuleStatus = 'on' | 'todo' | 'info';

export interface ModuleDef {
  id: string;
  title: string;
  desc: string;
  icon: string;
  color: string;
  category: 'join' | 'moderation' | 'community' | 'automation' | 'messages' | 'server';
  href: (guildId: string) => string;
  isNew?: boolean;
}

export const CATEGORIES: { id: ModuleDef['category']; label: string }[] = [
  { id: 'join', label: 'Join and security' },
  { id: 'moderation', label: 'Moderation' },
  { id: 'community', label: 'Community' },
  { id: 'automation', label: 'Automation' },
  { id: 'messages', label: 'Messages and design' },
  { id: 'server', label: 'Server' },
];

export const MODULES: ModuleDef[] = [
  { id: 'welcome', title: 'Welcome and goodbye', desc: 'Greet new members, say goodbye and thank boosters, in a channel or by DM.', icon: 'ph:hand-waving-fill', color: '#a5ea7a', category: 'join', href: (g) => `/dash/guild/${g}/onboarding#messages` },
  { id: 'verification', title: 'Verification', desc: 'A captcha, letters in a picture or both. Also inside Discord and in a channel.', icon: 'ph:seal-check-fill', color: '#8399ff', category: 'join', href: (g) => `/dash/guild/${g}/onboarding#verification` },
  { id: 'joinroles', title: 'Join roles and ping', desc: 'Roles for whoever joins, a DM and a ping that cleans itself up.', icon: 'ph:user-plus-fill', color: '#7ac45a', category: 'join', href: (g) => `/dash/guild/${g}/onboarding#arrival` },
  { id: 'security', title: 'Security', desc: 'Anti-nuke, who can use what and a record of every change.', icon: 'ph:shield-warning-fill', color: '#fe6465', category: 'join', href: (g) => `/dash/guild/${g}/security` },
  { id: 'automod', title: 'Automod', desc: 'Word filter, anti-spam, anti-raid and anti-alt, with warns that escalate.', icon: 'ph:shield-check-fill', color: '#ffb86c', category: 'moderation', href: (g) => `/dash/guild/${g}/moderation` },
  { id: 'honeypot', title: 'Honeypot', desc: 'A bait channel nobody should write in: spam bots that post there are caught at once.', icon: 'ph:bug-fill', color: '#d99a3d', category: 'moderation', href: (g) => `/dash/guild/${g}/honeypot`, isNew: true },
  { id: 'logging', title: 'Logging', desc: 'Each kind of event in its own channel, with the webhook made for you.', icon: 'ph:clipboard-text-fill', color: '#b4bcd0', category: 'moderation', href: (g) => `/dash/guild/${g}/logging` },
  { id: 'tickets', title: 'Tickets', desc: 'Panels, support types, forms and staff tools for private help channels.', icon: 'ph:ticket', color: '#ffb86c', category: 'community', href: (g) => `/dash/guild/${g}/tickets` },
  { id: 'leveling', title: 'Leveling', desc: 'XP for messages and voice, rewards, multipliers and a rank card.', icon: 'ph:chart-line-up-fill', color: '#5eead4', category: 'community', href: (g) => `/dash/guild/${g}/leveling?section=settings` },
  { id: 'giveaways', title: 'Giveaways', desc: 'Start and manage giveaways, with bonus entries and level requirements.', icon: 'ph:gift-fill', color: '#f78fb3', category: 'community', href: (g) => `/dash/guild/${g}/giveaways` },
  { id: 'birthdays', title: 'Birthdays', desc: 'Celebrate birthdays with a message and a role for the day.', icon: 'ph:cake-fill', color: '#f78fb3', category: 'community', href: (g) => `/dash/guild/${g}/birthdays` },
  { id: 'forms', title: 'Forms', desc: 'Applications and sign-ups answered in Discord, with rules, a review card, roles and a DM with the result.', icon: 'ph:clipboard-text-fill', color: '#8399ff', category: 'community', href: (g) => `/dash/guild/${g}/forms`, isNew: true },
  { id: 'suggestions', title: 'Suggestions', desc: 'Members suggest, everyone votes once and the staff answers with a reason.', icon: 'ph:lightbulb-fill', color: '#ffd863', category: 'community', href: (g) => `/dash/guild/${g}/suggestions` },
  { id: 'confessions', title: 'Confessions', desc: 'Members confess without a name, with a look you choose, a check by the staff and anonymous replies.', icon: 'ph:chat-circle-text-fill', color: '#a5ea7a', category: 'community', href: (g) => `/dash/guild/${g}/confessions` },
  { id: 'counting', title: 'Counting', desc: 'A channel where members count one number after the other, with records, saves and a leaderboard.', icon: 'ph:hash-fill', color: '#5eead4', category: 'community', href: (g) => `/dash/guild/${g}/counting` },
  { id: 'media', title: 'Media channels', desc: 'Channels where only pictures, videos or links of the sites you choose can be posted.', icon: 'ph:image-fill', color: '#f78fb3', category: 'community', href: (g) => `/dash/guild/${g}/media` },
  { id: 'starboard', title: 'Boards', desc: 'Repost the messages the server loves (⭐), loves to hate (🐒) or laughs at (🤡), with as many emojis as you like.', icon: 'ph:star-fill', color: '#fed53c', category: 'community', href: (g) => `/dash/guild/${g}/boards` },
  { id: 'reactionroles', title: 'Reaction roles', desc: 'Roles from a reaction or a button, on a message you pick or a saved design.', icon: 'ph:smiley-fill', color: '#c792ea', category: 'automation', href: (g) => `/dash/guild/${g}/automation?section=reaction-roles` },
  { id: 'autoresponders', title: 'Autoresponders', desc: 'Answer a word or phrase with a message, an embed or a button.', icon: 'ph:robot-fill', color: '#c792ea', category: 'automation', href: (g) => `/dash/guild/${g}/automation?section=autoresponders` },
  { id: 'commands', title: 'Custom commands', desc: 'Your own commands, with a form or in code. This is how Petto becomes your own bot.', icon: 'ph:terminal-window-fill', color: '#8399ff', category: 'automation', href: (g) => `/dash/guild/${g}/automation?section=custom-commands` },
  { id: 'counters', title: 'Counters', desc: 'Channels whose names show live numbers: members, online, boosts, a goal or the time, updated safely.', icon: 'ph:chart-line-up-fill', color: '#38bdf8', category: 'automation', href: (g) => `/dash/guild/${g}/counters`, isNew: true },
  { id: 'webhooks', title: 'Webhooks', desc: 'Send text, embeds or saved designs as any name, edit them later and post in threads.', icon: 'ph:webhooks-logo-fill', color: '#a78bfa', category: 'automation', href: (g) => `/dash/guild/${g}/automation?section=webhooks` },
  { id: 'embeds', title: 'Embeds and designs', desc: 'Build messages, embeds and Components V2 designs and use them everywhere.', icon: 'ph:chat-circle-dots-fill', color: '#7dd3fc', category: 'messages', href: (g) => `/dash/guild/${g}/embeds` },
  { id: 'cards', title: 'Image cards', desc: 'Pictures for welcomes, level-ups and more, with your own layers.', icon: 'ph:image-fill', color: '#7dd3fc', category: 'messages', href: (g) => `/dash/guild/${g}/cards` },
  { id: 'customize', title: 'Customize', desc: 'The name, picture and banner of Petto in this server.', icon: 'ph:sparkle-fill', color: '#f0a88f', category: 'server', href: (g) => `/dash/guild/${g}/customize` },
  { id: 'backups', title: 'Backups', desc: 'Save the settings of the server and bring them back.', icon: 'ph:archive-fill', color: '#94a3b8', category: 'server', href: (g) => `/dash/guild/${g}/backups` },
];

export interface GuideStep { id: string; label: string; hint: string; module: string }

// The short list that leaves a server ready, in the order that makes sense.
export const GUIDE: GuideStep[] = [
  { id: 'welcome', label: 'Greet new members', hint: 'Pick a welcome channel and write the message.', module: 'welcome' },
  { id: 'verification', label: 'Verify who joins', hint: 'Turn on the captcha or the letters.', module: 'verification' },
  { id: 'automod', label: 'Protect the server', hint: 'Turn on the filters that fit your community.', module: 'automod' },
  { id: 'logging', label: 'Keep a record', hint: 'Send the events you care about to a channel.', module: 'logging' },
  { id: 'leveling', label: 'Reward activity', hint: 'Turn on levels and pick the rewards.', module: 'leveling' },
  { id: 'tickets', label: 'Offer support', hint: 'Make a ticket panel with a support type.', module: 'tickets' },
  { id: 'reactionroles', label: 'Let members pick roles', hint: 'Add a role to a reaction or a button.', module: 'reactionroles' },
];
