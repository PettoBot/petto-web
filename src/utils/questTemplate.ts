import type { V2Doc } from './embedSchema';

// The default quest alert as a V2 design, with the quest variables, so a server can start from the card Petto sends
// and change it. The ping of the role and the credit are added by the bot around it.
export function questStarterV2(): V2Doc {
  return {
    components: [{
      type: 17,
      accent_color: 0x5865f2,
      components: [
        { type: 10, content: '-# {quest.status}\n# <:pe_Quest_Badge1:1555687372430123018> [{quest.name}]({quest.url})' },
        { type: 12, items: [{ media: { url: '{quest.image}' } }] },
        { type: 14, divider: true, spacing: 1 },
        { type: 10, content: '- `⏰` **Starts:** {quest.starts} | **Ends:** {quest.expires}\n- `💿` **Platforms:** {quest.platforms}\n- `🧫` **Task:** {quest.tasks}' },
        { type: 14, divider: true, spacing: 1 },
        { type: 9, components: [{ type: 10, content: '## 🎁 Rewards\n* `🥇` **Type:** {quest.reward_type}\n* `💸` **Reward:** {quest.reward}' }], accessory: { type: 11, media: { url: '{quest.reward_image}' } } },
        { type: 14, divider: true, spacing: 1 },
        { type: 10, content: '## <:pe_Alert:1555688656876867726> Limitations\n* {quest.limits}' },
      ],
    }, {
      type: 1,
      components: [
        { type: 2, style: 5, label: 'Accept Quest', url: '{quest.url}' },
        { type: 2, style: 5, label: 'Game page', url: '{quest.link}' },
      ],
    }],
  };
}
