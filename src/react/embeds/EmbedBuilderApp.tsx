import { useEffect, useRef, useState } from 'react';
import './embeds.css';
import FormatToolbar from './FormatToolbar';
import Preview from './Preview';
import VariablesPanel from './VariablesPanel';
import EmbedColorPicker from './EmbedColorPicker';
import { type EmbedData, type LinkButton, type TemplateData, emptyEmbed, emptyButton, emptyTemplate, normalizeTemplateData, encodeShareCode, decodeShareCode } from './types';
import { t } from './t';

interface Props {
  guildId: string;
  botName: string;
  botIcon: string;
  userAvatarUrl: string;
  guildIconUrl: string;
  initialTemplateNames: string[];
  initialSelected: string;
  channels: { id: string; name: string }[];
  generatorUrl: string;
  serverName: string;
  variableGroups?: { label: string; vars: { tok: string; desc: string }[] }[] | null;
  /** The route that stores the messages, relative to the server. The default is the Petto bot's own. */
  apiPath?: string;
  /** How many embeds one message can hold. Petto allows 10, the Vanity bot sends one. */
  maxEmbeds?: number;
  /** Whether the test message can be sent from here. */
  allowTestSend?: boolean;
  /** Whether link buttons can carry an emoji. */
  allowButtonEmoji?: boolean;
  /** Which bot's variables the preview fills in. */
  sampleSet?: 'vanity';
  /** How many messages a server can save, when there is a limit. */
  maxTemplates?: number;
  /** Shown instead of the test controls when they are off. */
  testSendNote?: string;
}

async function api(guildId: string, apiPath: string, path: string, init?: RequestInit) {
  const res = await fetch(`/dash/guild/${guildId}/${apiPath}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  return res;
}

export default function EmbedBuilderApp({ guildId, botName, botIcon, userAvatarUrl, guildIconUrl, initialTemplateNames, initialSelected, channels, generatorUrl, serverName, variableGroups, apiPath = 'embeds-api', maxEmbeds = 10, allowTestSend = true, allowButtonEmoji = true, maxTemplates, sampleSet, testSendNote }: Props) {
  const [names, setNames] = useState(initialTemplateNames);
  const [selected, setSelected] = useState(initialSelected);
  const [data, setData] = useState<TemplateData>(emptyTemplate());
  const [activeEmbed, setActiveEmbed] = useState(0);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendTarget, setSendTarget] = useState('dm');
  const [sending, setSending] = useState(false);
  const [pendingImport, setPendingImport] = useState<{ data: TemplateData; name: string } | null>(null);
  const [importText, setImportText] = useState('');

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!selected) { setData(emptyTemplate()); return; }
    setLoading(true);
    api(guildId, apiPath, `?name=${encodeURIComponent(selected)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((row) => { if (row) setData(normalizeTemplateData(row.data)); setDirty(false); })
      .finally(() => setLoading(false));
  }, [selected, guildId, apiPath]);

  // A message sent from the Embed Generator arrives in the URL fragment (#import=CODE).
  useEffect(() => {
    const match = window.location.hash.match(/^#import=(.+)$/);
    if (!match) return;
    const imported = decodeShareCode(decodeURIComponent(match[1]));
    if (imported) setPendingImport({ data: imported, name: 'imported' });
    else setFlash(t("That import code isn't valid."));
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2500);
    return () => clearTimeout(t);
  }, [flash]);

  function update(patch: Partial<TemplateData>) {
    setData((d) => ({ ...d, ...patch }));
    setDirty(true);
  }
  function updateEmbed(i: number, patch: Partial<EmbedData>) {
    setData((d) => ({ ...d, embeds: d.embeds.map((e, ei) => (ei === i ? { ...e, ...patch } : e)) }));
    setDirty(true);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const res = await api(guildId, apiPath, '', { method: 'POST', body: JSON.stringify({ action: 'create', name: newName.trim() }) });
    const body = await res.json();
    if (!res.ok) { setFlash(body.error ? t(body.error) : t("Couldn't create that template.")); return; }
    setNames((n) => [...n, body.name].sort());
    setSelected(body.name);
    setNewName('');
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    const res = await api(guildId, apiPath, '', { method: 'POST', body: JSON.stringify({ action: 'save', name: selected, data }) });
    setSaving(false);
    const failure = res.ok ? null : await res.json().catch(() => null);
    setFlash(res.ok ? t('Saved.') : failure?.error ? t(failure.error) : t("Couldn't save, try again."));
    if (res.ok) setDirty(false);
  }

  async function handleDelete() {
    if (!selected) return;
    if (!window.confirm(t('Delete the "{name}" template? This can\'t be undone.', { name: selected }))) return;
    const res = await api(guildId, apiPath, '', { method: 'POST', body: JSON.stringify({ action: 'delete', name: selected }) });
    if (!res.ok) { setFlash("Couldn't delete that template."); return; }
    setNames((n) => n.filter((x) => x !== selected));
    setSelected('');
  }

  async function handleImport(imported: TemplateData, name: string) {
    const res = await api(guildId, apiPath, '', { method: 'POST', body: JSON.stringify({ action: 'create', name: name.trim(), data: imported }) });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) { setFlash(body.error ? t(body.error) : t("Couldn't create that template.")); return false; }
    setNames((n) => [...n, body.name].sort());
    setSelected(body.name);
    setPendingImport(null);
    setImportText('');
    setFlash(t('Imported.'));
    return true;
  }

  function handleImportText() {
    const text = importText.trim();
    let imported: TemplateData | null = decodeShareCode(text);
    if (!imported) {
      try { imported = normalizeTemplateData(JSON.parse(text)); } catch { imported = null; }
      if (imported && imported.embeds.length === 0 && !imported.content) imported = null;
    }
    if (!imported) { setFlash(t("That import code isn't valid.")); return; }
    setPendingImport({ data: imported, name: 'imported' });
  }

  async function handleCopy(kind: 'code' | 'json') {
    const text = kind === 'code' ? encodeShareCode(data) : JSON.stringify(data, null, 2);
    try { await navigator.clipboard.writeText(text); setFlash(t('Copied.')); } catch { setFlash(t("Couldn't copy, try again.")); }
  }

  function openInGenerator() {
    window.open(`${generatorUrl}/#import=${encodeURIComponent(encodeShareCode(data))}`, '_blank', 'noopener');
  }

  async function handleSendTest() {
    setSending(true);
    const res = await api(guildId, apiPath, '', { method: 'POST', body: JSON.stringify({ action: 'test_send', data, channel_id: sendTarget }) });
    const body = await res.json().catch(() => ({}));
    setSending(false);
    setFlash(res.ok ? t('Test message sent.') : (body.error ? t(body.error) : t("Couldn't send the test message.")));
  }

  function addEmbed() {
    if (data.embeds.length >= maxEmbeds) return;
    update({ embeds: [...data.embeds, emptyEmbed()] });
    setActiveEmbed(data.embeds.length);
  }
  function removeEmbed(i: number) {
    update({ embeds: data.embeds.filter((_, ei) => ei !== i) });
    setActiveEmbed((a) => Math.max(0, a - (i <= a ? 1 : 0)));
  }
  function addButtonRow() {
    if (data.buttons.length >= 5) return;
    update({ buttons: [...data.buttons, [emptyButton()]] });
  }
  function updateButton(ri: number, bi: number, patch: Partial<LinkButton>) {
    update({ buttons: data.buttons.map((row, i) => (i !== ri ? row : row.map((b, j) => (j !== bi ? b : { ...b, ...patch })))) });
  }
  function addButton(ri: number) {
    update({ buttons: data.buttons.map((row, i) => (i !== ri ? row : row.length >= 5 ? row : [...row, emptyButton()])) });
  }
  function removeButton(ri: number, bi: number) {
    update({ buttons: data.buttons.map((row, i) => (i !== ri ? row : row.filter((_, j) => j !== bi))).filter((row) => row.length > 0) });
  }

  const e = data.embeds[activeEmbed];

  return (
    <div className="ebr-app">
      {flash && <div className="ebr-flash">{flash}</div>}

      {pendingImport && (
        <div className="ebr-import-banner">
          <div>
            <strong>{t('Import this message as a new template?')}</strong>
            <span>{t('Name it, then it appears in the list and can be used by any module.')}</span>
          </div>
          <input type="text" maxLength={40} value={pendingImport.name} onChange={(ev) => setPendingImport({ ...pendingImport, name: ev.target.value })} />
          <button type="button" className="btn btn-accent btn-sm" onClick={() => handleImport(pendingImport.data, pendingImport.name)} disabled={!pendingImport.name.trim()}>{t('Import')}</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPendingImport(null)}>{t('Dismiss')}</button>
        </div>
      )}

      <div className="ebr-layout">
        <aside className="ebr-list">
          {names.length === 0 && <p className="ebr-empty-note">{t('No templates yet.')}</p>}
          {names.map((n) => (
            <button key={n} type="button" className={`ebr-list-item${n === selected ? ' active' : ''}`} onClick={() => setSelected(n)}>
              {n}
            </button>
          ))}
          <div className="ebr-limit-note">{maxTemplates ? `${names.length}/${maxTemplates} saved` : `${names.length} saved themes · unlimited`}</div>
          <div className="ebr-import">
            <textarea rows={2} placeholder={t('Paste an import code or JSON')} value={importText} onChange={(ev) => setImportText(ev.target.value)} />
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleImportText} disabled={!importText.trim()}>{t('Import')}</button>
          </div>
          <form className="ebr-create" onSubmit={handleCreate}>
            <input type="text" placeholder="new-template-name" maxLength={40} value={newName} onChange={(e) => setNewName(e.target.value)} />
            <button type="submit" className="btn btn-ghost btn-sm">{t('+ New')}</button>
          </form>
        </aside>

        {!selected ? (
          <p className="ebr-empty-note">{t('Create a template on the left to get started.')}</p>
        ) : loading ? (
          <p className="ebr-empty-note">{t('Loading...')}</p>
        ) : (
          <div className="ebr-editor">
            <div className="ebr-preview-col">
              <div className="ebr-preview-label">{t('Preview')}</div>
              <Preview data={data} botName={botName} botIcon={botIcon} userAvatarUrl={userAvatarUrl} guildIconUrl={guildIconUrl} serverName={serverName} sampleSet={sampleSet} />
            </div>

            <div className="ebr-form-col">
              <VariablesPanel groups={variableGroups} />
              <div className="ebr-field">
                <div className="ebr-field-head"><label>{t('Message content')}</label></div>
                <textarea ref={contentRef} rows={2} maxLength={2000} value={data.content} onChange={(ev) => update({ content: ev.target.value })} />
                <FormatToolbar targetRef={contentRef} onChange={(v) => update({ content: v })} />
              </div>

              <div className="ebr-embed-tabs">
                {data.embeds.map((_, i) => (
                  <button key={i} type="button" className={`ebr-tab${i === activeEmbed ? ' active' : ''}`} onClick={() => setActiveEmbed(i)}>
                    Embed {i + 1}
                    <span className="ebr-tab-x" onClick={(ev) => { ev.stopPropagation(); removeEmbed(i); }}>×</span>
                  </button>
                ))}
                {data.embeds.length < maxEmbeds && <button type="button" className="ebr-tab-add" onClick={addEmbed}>{t('+ Add embed')}</button>}
              </div>

              {e && (
                <div className="ebr-embed-form">
                  <div className="ebr-field">
                    <label>{t('Title')}</label>
                    <input ref={titleRef} type="text" maxLength={256} value={e.title} onChange={(ev) => updateEmbed(activeEmbed, { title: ev.target.value })} />
                    <FormatToolbar targetRef={titleRef} onChange={(v) => updateEmbed(activeEmbed, { title: v })} />
                  </div>
                  <div className="ebr-field">
                    <label>{t('Description')}</label>
                    <textarea ref={descRef} rows={4} maxLength={4096} value={e.description} onChange={(ev) => updateEmbed(activeEmbed, { description: ev.target.value })} />
                    <FormatToolbar targetRef={descRef} onChange={(v) => updateEmbed(activeEmbed, { description: v })} />
                  </div>
                  <div className="ebr-row-pair">
                    <div className="ebr-field">
                      <label>{t('Color')}</label>
                      <EmbedColorPicker value={e.color} onChange={(color) => updateEmbed(activeEmbed, { color })} />
                    </div>
                    <div className="ebr-field">
                      <label>{t('Title link URL')}</label>
                      <input type="text" value={e.url} onChange={(ev) => updateEmbed(activeEmbed, { url: ev.target.value })} placeholder="https://..." />
                    </div>
                  </div>
                  <div className="ebr-row-pair">
                    <div className="ebr-field"><label>{t('Thumbnail URL')}</label><input type="text" value={e.thumbnail} onChange={(ev) => updateEmbed(activeEmbed, { thumbnail: ev.target.value })} placeholder="https://..." /></div>
                    <div className="ebr-field"><label>{t('Image URL')}</label><input type="text" value={e.image} onChange={(ev) => updateEmbed(activeEmbed, { image: ev.target.value })} placeholder="https://..." /></div>
                  </div>
                  <div className="ebr-row-pair">
                    <div className="ebr-field"><label>{t('Author name')}</label><input type="text" value={e.author.name} onChange={(ev) => updateEmbed(activeEmbed, { author: { ...e.author, name: ev.target.value } })} /></div>
                    <div className="ebr-field"><label>{t('Author icon URL')}</label><input type="text" value={e.author.icon ?? ''} onChange={(ev) => updateEmbed(activeEmbed, { author: { ...e.author, icon: ev.target.value } })} placeholder="https://..." /></div>
                  </div>
                  <div className="ebr-field">
                    <label>{t('Author link URL')}</label>
                    <input type="text" value={e.author.url ?? ''} onChange={(ev) => updateEmbed(activeEmbed, { author: { ...e.author, url: ev.target.value } })} placeholder="https://..." />
                  </div>
                  <div className="ebr-row-pair">
                    <div className="ebr-field"><label>{t('Footer text')}</label><input type="text" value={e.footer.text} onChange={(ev) => updateEmbed(activeEmbed, { footer: { ...e.footer, text: ev.target.value } })} /></div>
                    <div className="ebr-field"><label>{t('Footer icon URL')}</label><input type="text" value={e.footer.icon ?? ''} onChange={(ev) => updateEmbed(activeEmbed, { footer: { ...e.footer, icon: ev.target.value } })} placeholder="https://..." /></div>
                  </div>
                  <label className="ebr-check"><input type="checkbox" checked={e.timestamp} onChange={(ev) => updateEmbed(activeEmbed, { timestamp: ev.target.checked })} />{t('Show current time in the footer')}</label>

                  <div className="ebr-fields-section">
                    <h3>{t('Fields')} <span className="ebr-count">{e.fields.length}/25</span></h3>
                    {e.fields.map((f, fi) => (
                      <div key={fi} className="ebr-field-row-edit">
                        <input type="text" placeholder={t('Name')} maxLength={256} value={f.name} onChange={(ev) => updateEmbed(activeEmbed, { fields: e.fields.map((x, i) => (i === fi ? { ...x, name: ev.target.value } : x)) })} />
                        <input type="text" placeholder={t('Value')} maxLength={1024} value={f.value} onChange={(ev) => updateEmbed(activeEmbed, { fields: e.fields.map((x, i) => (i === fi ? { ...x, value: ev.target.value } : x)) })} />
                        <label className="ebr-check"><input type="checkbox" checked={f.inline} onChange={(ev) => updateEmbed(activeEmbed, { fields: e.fields.map((x, i) => (i === fi ? { ...x, inline: ev.target.checked } : x)) })} />{t('Inline')}</label>
                        <button type="button" className="ebr-del" onClick={() => updateEmbed(activeEmbed, { fields: e.fields.filter((_, i) => i !== fi) })}>×</button>
                      </div>
                    ))}
                    {e.fields.length < 25 && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => updateEmbed(activeEmbed, { fields: [...e.fields, { name: '', value: '', inline: false }] })}>{t('+ Add field')}</button>
                    )}
                  </div>
                </div>
              )}

              <div className="ebr-fields-section">
                <h3>{t('Link buttons')}</h3>
                {data.buttons.map((row, ri) => (
                  <div key={ri} className="ebr-btn-row-edit">
                    {row.map((b, bi) => (
                      <div key={bi} className="ebr-btn-edit">
                        <input type="text" placeholder={t('Label')} maxLength={80} value={b.label} onChange={(ev) => updateButton(ri, bi, { label: ev.target.value })} />
                        <input type="text" placeholder="https://..." value={b.url} onChange={(ev) => updateButton(ri, bi, { url: ev.target.value })} />
                        {allowButtonEmoji && <input type="text" placeholder={t('Emoji')} maxLength={4} className="ebr-btn-emoji" value={b.emoji} onChange={(ev) => updateButton(ri, bi, { emoji: ev.target.value })} />}
                        <button type="button" className="ebr-del" onClick={() => removeButton(ri, bi)}>×</button>
                      </div>
                    ))}
                    {row.length < 5 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => addButton(ri)}>{t('+ Button')}</button>}
                  </div>
                ))}
                {data.buttons.length < 5 && <button type="button" className="btn btn-ghost btn-sm" onClick={addButtonRow}>{t('+ Add button row')}</button>}
              </div>

              <div className="ebr-actions">
                <button type="button" className="btn btn-accent btn-sm" onClick={handleSave} disabled={saving || !dirty}>{saving ? t('Saving...') : t('Save changes')}</button>
                <button type="button" className="btn btn-ghost btn-sm ebr-delete-btn" onClick={handleDelete}>{t('Delete this template')}</button>
              </div>

              <div className="ebr-tools">
                <h3>{t('Test and share')}</h3>
                {allowTestSend ? (<>
                <div className="ebr-tools-row">
                  <select value={sendTarget} onChange={(ev) => setSendTarget(ev.target.value)}>
                    <option value="dm">{t('My direct messages')}</option>
                    {channels.map((c) => <option key={c.id} value={c.id}>#{c.name}</option>)}
                  </select>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={handleSendTest} disabled={sending || dirty}>{sending ? t('Sending...') : t('Send test')}</button>
                </div>
                {dirty && <p className="ebr-tools-note">{t('Save your changes first, the test sends the saved template.')}</p>}
                </>) : (testSendNote ? <p className="ebr-tools-note">{testSendNote}</p> : null)}
                <div className="ebr-tools-row">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleCopy('code')}>{t('Copy share code')}</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => handleCopy('json')}>{t('Copy JSON')}</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={openInGenerator}>{t('Open in Embed Generator')}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
