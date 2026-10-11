import type { V2Doc } from './embedSchema';

// The default rollout alert as a V2 design, with the rollout variables, so a server can start from the card Petto sends and
// change it. The ping of the role and the credit are added by the bot around it.
export function rolloutStarterV2(): V2Doc {
  return {
    components: [{
      type: 17,
      accent_color: 0x6df08e,
      components: [
        { type: 10, content: '**{rollout.kind}** · {rollout.type}\n# {rollout.name}\n-# `{rollout.id}` · **{rollout.badge}**' },
        { type: 14, divider: true, spacing: 1 },
        { type: 10, content: '**🔁 Rollouts:**\n```py\n{rollout.variants}\n```' },
        { type: 14, divider: true, spacing: 1 },
        { type: 10, content: '- **Status:** {rollout.status}\n- **Platforms:** {rollout.platforms}\n- **Filters:** {rollout.filters}' },
      ],
    }],
  };
}
