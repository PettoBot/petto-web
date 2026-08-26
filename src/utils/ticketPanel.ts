// Mirrors the bot's ticketCards.js buildPanelRows() closely enough that buttons/selects created
// here still carry the exact custom_id shape the bot's interactionCreate.js dispatcher expects
// (tk_open::<key> / tk_open_select), so a panel posted from the dashboard opens tickets exactly
// like one posted with /ticket panel create.
//
// Embed templates: a panel can point at a saved /embed template's `data` (same shape
// embedBuilder.js's normalize()/buildOneEmbed() render in the bot). A panel has guild and
// target-channel context, but no member, message, leveling or giveaway context.

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

function buildCategoryRow(style: string, categories: PanelCategory[]) {
  if (categories.length === 0) return null;
  if (style === 'select') {
    return {
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
    };
  }
  return {
    type: 1,
    components: categories.slice(0, 5).map((c) => ({
      type: 2,
      style: BUTTON_STYLE[c.buttonStyle as keyof typeof BUTTON_STYLE] ?? 1,
      label: c.label.slice(0, 80),
      custom_id: `tk_open::${c.key}`,
      emoji: parseEmoji(c.emoji),
    })),
  };
}

export interface GuildVars {
  id: string;
  name: string;
  iconUrl: string | null;
  bannerUrl: string | null;
  ownerId: string;
  createdTimestamp: number;
  memberCount: number;
  roleCount: number;
  channelCount: number;
  emojiCount: number;
  boostTier: number;
  boostCount: number;
  vanityCode: string | null;
  preferredLocale: string;
  maxMembers: number;
  prefix: string;
  channels: Record<string, ChannelVars>;
}

export interface ChannelVars {
  id: string;
  name: string;
  topic: string | null;
  createdTimestamp: number;
}

/** Resolves every guild and target-channel token that the bot can resolve for a ticket panel. */
export function resolveGuildVariables(text: string, g: GuildVars, channelId?: string): string {
  if (!text) return text;
  const created = new Date(g.createdTimestamp);
  const channel = channelId ? g.channels[channelId] : undefined;
  const channelCreated = channel ? new Date(channel.createdTimestamp) : null;
  const boostRequired = [0, 2, 7, 14][Math.min(Math.max(g.boostTier + 1, 0), 3)] ?? 14;
  const nextBoostLevel = Math.min(g.boostTier + 1, 3);
  const boostUntil = Math.max(0, boostRequired - g.boostCount);
  const unavailable = 'N/A';
  const map: Record<string, string> = {
    '{server_name}': g.name,
    '{server_id}': g.id,
    '{server_prefix}': g.prefix,
    '{server_membercount}': String(g.memberCount),
    '{server_membercount_ordinal}': ordinal(g.memberCount),
    '{server_membercount_nobots}': unavailable,
    '{server_membercount_nobots_ordinal}': unavailable,
    '{server_botcount}': unavailable,
    '{server_botcount_ordinal}': unavailable,
    '{server_icon}': g.iconUrl ?? '',
    '{server_rolecount}': String(g.roleCount),
    '{server_channelcount}': String(g.channelCount),
    '{server_randommember}': unavailable,
    '{server_randommember_tag}': unavailable,
    '{server_randommember_nobots}': unavailable,
    '{server_owner}': `<@${g.ownerId}>`,
    '{server_owner_id}': g.ownerId,
    '{server_createdate}': created.toLocaleDateString('en-US'),
    '{server_boostlevel}': String(g.boostTier),
    '{server_boostcount}': String(g.boostCount),
    '{server_nextboostlevel}': String(nextBoostLevel),
    '{server_nextboostlevel_required}': String(boostRequired),
    '{server_nextboostlevel_until_required}': String(boostUntil),
    '{guild.name}': g.name,
    '{guild.id}': g.id,
    '{guild.count}': String(g.memberCount),
    '{guild.icon}': g.iconUrl ?? 'N/A',
    '{guild.banner}': g.bannerUrl ?? 'N/A',
    '{guild.owner_id}': g.ownerId,
    '{guild.created_at}': created.toLocaleDateString('en-US'),
    '{guild.created_at_timestamp}': String(Math.floor(g.createdTimestamp / 1000)),
    '{guild.emoji_count}': String(g.emojiCount),
    '{guild.role_count}': String(g.roleCount),
    '{guild.boost_count}': String(g.boostCount),
    '{guild.boost_tier}': g.boostTier > 0 ? `Level ${g.boostTier}` : 'No Level',
    '{guild.channels_count}': String(g.channelCount),
    '{guild.vanity}': g.vanityCode ? `discord.gg/${g.vanityCode}` : 'N/A',
    '{guild.region}': g.preferredLocale,
    '{guild.max_members}': String(g.maxMembers),
    '{channel}': channel ? `<#${channel.id}>` : unavailable,
    '{channel.mention}': channel ? `<#${channel.id}>` : unavailable,
    '{channel.name}': channel?.name ?? unavailable,
    '{channel.id}': channel?.id ?? unavailable,
    '{channel.topic}': channel?.topic ?? unavailable,
    '{channel_name}': channel?.name ?? unavailable,
    '{channel_createdate}': channelCreated ? channelCreated.toLocaleDateString('en-US') : unavailable,
    '{newline}': '\n',
    '{separator}': '──────────────────────',
  };
  let out = text;
  for (const [token, value] of Object.entries(map)) out = out.split(token).join(value);
  return out;
}

function ordinal(n: number): string {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0]}`;
}

/** Same `data` shape embedBuilder.js's normalize() reads: either a dashboard multi-embed doc ({content, embeds, buttons}) or an older single-embed doc with fields at the top level. */
function normalizeTemplateData(data: any): { content: string; embeds: any[]; buttons: any[][] } {
  if (Array.isArray(data?.embeds)) return { content: data.content ?? '', embeds: data.embeds, buttons: data.buttons ?? [] };
  const looksLikeEmbed = data?.title || data?.description || data?.author?.name || data?.footer?.text || data?.fields?.length || data?.image || data?.thumbnail || data?.color != null;
  return { content: '', embeds: looksLikeEmbed ? [data] : [], buttons: [] };
}

function buildEmbedFromData(e: any, g: GuildVars, channelId: string) {
  const r = (s: string | undefined | null) => (s ? resolveGuildVariables(s, g, channelId) : undefined);
  const embed: Record<string, unknown> = {};
  if (e.title) embed.title = r(e.title);
  if (e.description) embed.description = r(e.description);
  if (e.color != null) embed.color = e.color;
  if (e.url) embed.url = r(e.url);
  if (e.thumbnail) embed.thumbnail = { url: r(e.thumbnail) };
  if (e.image) embed.image = { url: r(e.image) };
  if (e.timestamp) embed.timestamp = new Date().toISOString();
  if (e.author?.name) embed.author = { name: r(e.author.name), icon_url: e.author.icon ? r(e.author.icon) : undefined, url: e.author.url ?? undefined };
  if (e.footer?.text) embed.footer = { text: r(e.footer.text), icon_url: e.footer.icon ? r(e.footer.icon) : undefined };
  if (e.fields?.length) embed.fields = e.fields.map((f: any) => ({ name: r(f.name), value: r(f.value), inline: f.inline ?? false }));
  return embed;
}

function buildLinkButtonRows(buttons: any[][]) {
  return (buttons ?? [])
    .map((row) => {
      const btns = (row ?? []).filter((b) => b?.label?.trim() && b?.url);
      if (!btns.length) return null;
      return { type: 1, components: btns.map((b) => ({ type: 2, style: 5, label: b.label, url: b.url, disabled: Boolean(b.disabled) })) };
    })
    .filter(Boolean);
}

export function buildPanelPayload(
  panel: { title: string | null; description: string | null; channel_id?: string },
  style: string,
  categories: PanelCategory[],
  templateData: any | null,
  guildVars: GuildVars | null,
) {
  const categoryRow = buildCategoryRow(style, categories);

  if (templateData && guildVars) {
    const { content, embeds, buttons } = normalizeTemplateData(templateData);
    const templateRows = buildLinkButtonRows(buttons);
    const rows = [...templateRows, ...(categoryRow ? [categoryRow] : [])].slice(0, 5);
    return {
      content: content ? resolveGuildVariables(content, guildVars, panel.channel_id) : undefined,
      embeds: embeds.slice(0, 10).map((e) => buildEmbedFromData(e, guildVars, panel.channel_id ?? '')),
      components: rows,
    };
  }

  return {
    embeds: [
      {
        title: panel.title || undefined,
        description: panel.description || (categories.length ? 'Click a button below to open a ticket.' : 'No ticket types configured yet.'),
        color: 0x8399ff,
      },
    ],
    components: categoryRow ? [categoryRow] : [],
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
    console.warn('[ticket-panel] Discord message edit failed', { channelId, messageId: existingMessageId, status: editRes.status });
    // Message was deleted out from under us, or the panel moved channels, fall through to posting fresh.
  }

  const createRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  if (!createRes.ok) {
    console.error('[ticket-panel] Discord message create failed', { channelId, status: createRes.status });
    return null;
  }
  const message = await createRes.json();
  return message.id ?? null;
}

export async function deletePanelMessage(botToken: string, channelId: string, messageId: string | null): Promise<boolean> {
  if (!messageId) return true;
  const res = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bot ${botToken}` },
  }).catch(() => null);
  // A missing Discord message is already in the desired state.
  const ok = Boolean(res && (res.ok || res.status === 404));
  if (!ok) console.error('[ticket-panel] Discord message delete failed', { channelId, messageId, status: res?.status ?? 'network-error' });
  return ok;
}
