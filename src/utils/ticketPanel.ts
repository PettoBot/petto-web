// Mirrors the bot's ticketCards.js buildPanelRows()/buildPanelFallbackCard() closely enough that
// buttons/selects created here still carry the exact custom_id shape the bot's
// interactionCreate.js dispatcher expects (tk_open::<key> / tk_open_select), so a panel posted
// from the dashboard opens tickets exactly like one posted with /ticket panel create.
// NOTE: unlike the bot, this can't render a saved /embed template (that pipeline — variable
// resolution, Components V2 building — only exists in the bot repo). Panels created/edited here
// always use a plain classic embed (title + description), same as the bot's own template-less
// fallback card.

const BUTTON_STYLE = { primary: 1, secondary: 2, success: 3, danger: 4 } as const;

function parseEmoji(raw: string | null | undefined): { name: string; id?: string; animated?: boolean } | undefined {
  if (!raw) return undefined;
  const custom = raw.match(/^<(a?):(\w+):(\d+)>$/);
  if (custom) return { name: custom[2], id: custom[3], animated: custom[1] === 'a' };
  return { name: raw };
}

interface PanelCategory {
  key: string;
  label: string;
  emoji: string | null;
  description: string | null;
  buttonStyle: string;
}

function buildComponents(style: string, categories: PanelCategory[]) {
  if (categories.length === 0) return [];
  if (style === 'select') {
    return [
      {
        type: 1,
        components: [
          {
            type: 3,
            custom_id: 'tk_open_select',
            placeholder: 'Select a ticket category...',
            options: categories.slice(0, 25).map((c) => ({
              label: c.label.slice(0, 100),
              value: c.key,
              description: c.description ? c.description.slice(0, 100) : undefined,
              emoji: parseEmoji(c.emoji),
            })),
          },
        ],
      },
    ];
  }
  return [
    {
      type: 1,
      components: categories.slice(0, 5).map((c) => ({
        type: 2,
        style: BUTTON_STYLE[c.buttonStyle as keyof typeof BUTTON_STYLE] ?? 1,
        label: c.label.slice(0, 80),
        custom_id: `tk_open::${c.key}`,
        emoji: parseEmoji(c.emoji),
      })),
    },
  ];
}

export function buildPanelPayload(panel: { title: string | null; description: string | null }, style: string, categories: PanelCategory[]) {
  return {
    embeds: [
      {
        title: panel.title || undefined,
        description: panel.description || (categories.length ? 'Click a button below to open a ticket.' : 'No ticket types configured yet.'),
        color: 0x8399ff,
      },
    ],
    components: buildComponents(style, categories),
  };
}

/** Posts a fresh message (or edits the existing one in place if still there), returns the live message id. */
export async function postOrRefreshPanelMessage(
  botToken: string,
  channelId: string,
  existingMessageId: string | null,
  payload: ReturnType<typeof buildPanelPayload>,
): Promise<string | null> {
  const headers = { Authorization: `Bot ${botToken}`, 'Content-Type': 'application/json' };

  if (existingMessageId) {
    const editRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${existingMessageId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload),
    });
    if (editRes.ok) return existingMessageId;
    // Message was deleted out from under us, or the panel moved channels — fall through to posting fresh.
  }

  const createRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!createRes.ok) return null;
  const message = await createRes.json();
  return message.id ?? null;
}

export async function deletePanelMessage(botToken: string, channelId: string, messageId: string | null): Promise<void> {
  if (!messageId) return;
  await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bot ${botToken}` },
  }).catch(() => {});
}
