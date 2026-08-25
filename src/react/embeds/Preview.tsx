import type { TemplateData } from './types';
import { renderDiscordMarkdown } from './markdown';

interface Props { data: TemplateData; botName: string; botIcon: string; userAvatarUrl: string; guildIconUrl: string }

export default function Preview({ data, botName, botIcon, userAvatarUrl, guildIconUrl }: Props) {
  const hasAnything = data.content || data.embeds.length > 0 || data.buttons.some((r) => r.some((b) => b.label));

  const ICON_TOKENS: Record<string, string> = {
    '{user.avatar}': userAvatarUrl,
    '{user_avatar}': userAvatarUrl,
    '{user.display_avatar}': userAvatarUrl,
    '{guild.icon}': guildIconUrl,
    '{server_icon}': guildIconUrl,
  };
  const resolveIcon = (value: string) => ICON_TOKENS[value.trim()] ?? value;

  return (
    <div className="ebr-preview">
      <div className="ebr-preview-msg">
        <img className="ebr-preview-avatar" src={botIcon} alt="" />
        <div className="ebr-preview-body">
          <div className="ebr-preview-author-row">
            <span className="ebr-preview-botname">{botName}</span>
            <span className="ebr-preview-botTag">APP</span>
          </div>

          {!hasAnything && <div className="ebr-preview-empty">Nothing set yet, fill in the fields to see it here.</div>}

          {data.content && <div className="ebr-preview-content">{renderDiscordMarkdown(data.content)}</div>}

          {data.embeds.map((e, i) => {
            const color = e.color != null ? `#${e.color.toString(16).padStart(6, '0')}` : '#4f545c';
            return (
              <div key={i} className="ebr-embed" style={{ ['--ebr-c' as any]: color }}>
                {e.author.name && (
                  <div className="ebr-embed-author">
                    {e.author.icon && <img src={resolveIcon(e.author.icon)} alt="" />}
                    {e.author.url ? <a href={e.author.url} target="_blank" rel="noopener noreferrer">{e.author.name}</a> : <span>{e.author.name}</span>}
                  </div>
                )}
                <div className="ebr-embed-body">
                  <div className="ebr-embed-main">
                    {e.title && (e.url ? <a className="ebr-embed-title" href={e.url} target="_blank" rel="noopener noreferrer">{e.title}</a> : <div className="ebr-embed-title">{e.title}</div>)}
                    {e.description && <div className="ebr-embed-desc">{renderDiscordMarkdown(e.description)}</div>}
                    {e.fields.length > 0 && (
                      <div className="ebr-embed-fields">
                        {e.fields.map((f, fi) => (
                          <div key={fi} className={`ebr-embed-field${f.inline ? ' inline' : ''}`}>
                            <div className="ebr-embed-field-name">{renderDiscordMarkdown(f.name)}</div>
                            <div className="ebr-embed-field-value">{renderDiscordMarkdown(f.value)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {e.thumbnail && <img className="ebr-embed-thumb" src={resolveIcon(e.thumbnail)} alt="" />}
                </div>
                {e.image && <img className="ebr-embed-image" src={resolveIcon(e.image)} alt="" />}
                {(e.footer.text || e.timestamp) && (
                  <div className="ebr-embed-footer">
                    {e.footer.icon && <img src={resolveIcon(e.footer.icon)} alt="" />}
                    <span>{e.footer.text}{e.footer.text && e.timestamp ? ' • Today at 12:00 PM' : e.timestamp ? 'Today at 12:00 PM' : ''}</span>
                  </div>
                )}
              </div>
            );
          })}

          {data.buttons.map((row, ri) => {
            const btns = row.filter((b) => b.label);
            if (!btns.length) return null;
            return (
              <div key={ri} className="ebr-btn-row">
                {btns.map((b, bi) => (
                  <button key={bi} type="button" className="ebr-btn" disabled={b.disabled}>
                    {b.emoji && <span>{b.emoji}</span>} {b.label}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" /></svg>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <p className="ebr-preview-note">Raw preview, variable tokens (highlighted) aren't resolved here, that only happens when the bot actually sends it.</p>
    </div>
  );
}
