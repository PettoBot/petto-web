import type { V2Doc } from './embedSchema';

// The default rollout alert as a V2 design, with the rollout variables, so a server can start from the card Petto sends and
// change it. The ping of the role and the credit are added by the bot around it.
export function rolloutStarterV2(): V2Doc {
  return {
    components: [{
      type: 17,
      accent_color: 0x6df08e,
      components: [
        { type: 10, content: '# <:pe_exp:1542054001363648532> {rollout.name}\n-# {rollout.type} · **{rollout.badge}**' },
        { type: 14, divider: true, spacing: 1 },
        { type: 10, content: '- **Kind:** {rollout.kind}\n- **Status:** {rollout.status}\n- **Platforms:** {rollout.platforms}\n-# `{rollout.id}`' },
        { type: 14, divider: true, spacing: 1 },
        { type: 10, content: '## <:pe_reload:1542053990282567752> Rollouts\n```py\n{rollout.variants}\n```' },
        { type: 14, divider: true, spacing: 1 },
        { type: 10, content: '## <:pe_eyes:1542053991981121556> Filters\n* {rollout.filters}' },
      ],
    }],
  };
}
