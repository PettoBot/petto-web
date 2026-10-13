import type { V2Doc } from '../embeds/types';
import { renderV2Message, defaultContext } from '../../utils/discordPreview';
import { t } from '../embeds/t';

interface Props { doc: V2Doc; cardImage?: string; cardPlacement?: string; botName: string; botIcon: string; userAvatarUrl: string; guildIconUrl: string; serverName: string }

// The same renderer as the classic preview, so variables are filled with sample values, custom emojis, mentions and
// links look as they will in the channel, and the containers, pictures and sections are drawn as Discord draws them.
export default function V2Preview({ doc, cardImage, cardPlacement, botName, botIcon, userAvatarUrl, guildIconUrl, serverName }: Props) {
  // An image card sits at the top of the first container (or above everything), as the bot sends it.
  let shown: any = doc;
  if (cardImage) {
    const gallery = { type: 12, items: [{ media: { url: cardImage } }] };
    const components = [...(doc.components as any[])];
    const first = components[0];
    if (cardPlacement !== 'attachment' && first?.type === 17) components[0] = { ...first, components: [gallery, ...(first.components ?? [])] };
    else components.unshift(gallery);
    shown = { ...doc, components };
  }
  const html = renderV2Message(shown, { ...defaultContext, botName, botIcon, userAvatar: userAvatarUrl, serverIcon: guildIconUrl, serverName, t });
  return (
    <div className="ebr-preview">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <p className="ebr-preview-note">{t('Sample values fill the variables here, the bot uses the real ones when it sends the message. Unknown variables stay highlighted.')}</p>
    </div>
  );
}
