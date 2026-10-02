import type { V2Doc } from '../embeds/types';
import { renderV2Message, defaultContext } from '../../utils/discordPreview';
import { t } from '../embeds/t';

interface Props { doc: V2Doc; botName: string; botIcon: string; userAvatarUrl: string; guildIconUrl: string; serverName: string }

// The same renderer as the classic preview, so variables are filled with sample values, custom emojis, mentions and
// links look as they will in the channel, and the containers, pictures and sections are drawn as Discord draws them.
export default function V2Preview({ doc, botName, botIcon, userAvatarUrl, guildIconUrl, serverName }: Props) {
  const html = renderV2Message(doc as any, { ...defaultContext, botName, botIcon, userAvatar: userAvatarUrl, serverIcon: guildIconUrl, serverName, t });
  return (
    <div className="ebr-preview">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <p className="ebr-preview-note">{t('Sample values fill the variables here, the bot uses the real ones when it sends the message. Unknown variables stay highlighted.')}</p>
    </div>
  );
}
