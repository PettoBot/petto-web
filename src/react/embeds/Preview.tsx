import type { TemplateData } from './types';
import { renderMessage, defaultContext } from '../../utils/discordPreview';
import { t } from './t';

interface Props { data: TemplateData; botName: string; botIcon: string; userAvatarUrl: string; guildIconUrl: string; serverName: string }

// The same renderer the rest of the dashboard uses, so the builder shows variables filled in with
// sample values, custom emojis, mentions and links the way the message will look in the channel.
export default function Preview({ data, botName, botIcon, userAvatarUrl, guildIconUrl, serverName }: Props) {
  const html = renderMessage(
    {
      content: data.content,
      embeds: data.embeds.map((e) => ({ ...e, footer: e.footer })),
      buttons: data.buttons,
    },
    { ...defaultContext, botName, botIcon, userAvatar: userAvatarUrl, serverIcon: guildIconUrl, serverName, t },
  );

  return (
    <div className="ebr-preview">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <p className="ebr-preview-note">{t('Sample values fill the variables here, the bot uses the real ones when it sends the message. Unknown variables stay highlighted.')}</p>
    </div>
  );
}
