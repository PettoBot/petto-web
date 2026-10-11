import type { V2Doc } from './embedSchema';

// The default rollout alert as a V2 design, with the rollout variables. It is laid out exactly like the card Petto sends by itself, so a server
// can start from it and change it: the title, the line with the event, the details, the rollouts and the ranges, and the link to the list. The
// credit line is added by the bot after any design; it has no color, like a design made by hand.
export function rolloutStarterV2(): V2Doc {
  return {
    components: [{
      type: 17,
      accent_color: null,
      components: [
        { type: 9, components: [{ type: 10, content: '**{rollout.kind_icon} {rollout.name}**' }], accessory: { type: 2, style: 3, label: '{rollout.badge}', custom_id: 'display', emoji: { name: '{rollout.event_icon}' }, disabled: true } },
        { type: 10, content: '- {rollout.kind_icon} **Kind:** {rollout.kind}\n- <:pe_cl:1542054021416751174> **Status:** {rollout.status}\n- <:pe_pc:1542053996028633108> **Platforms:** {rollout.platforms}\n- `{rollout.id}`' },
        { type: 14, divider: true, spacing: 1 },
        { type: 14, divider: true, spacing: 1 },
        { type: 10, content: '**<:pe_reload:1542053990282567752> Rollouts**\n```py\n{rollout.variants}\n```\n**<:pe_note:1542048566657155153> Ranges**\n```py\n{rollout.ranges}\n```' },
      ],
    }],
  };
}
