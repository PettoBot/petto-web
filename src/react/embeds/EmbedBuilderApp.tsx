import { useEffect, useRef, useState } from 'react';
import './embeds.css';
import FormatToolbar from './FormatToolbar';
import SilentHint from './SilentHint';
import Preview from './Preview';
import V2Editor from '../v2/V2Editor';
import ButtonActions from './ButtonActions';
import V2Preview from '../v2/V2Preview';
import VariablesPanel from './VariablesPanel';
import EmbedColorPicker from './EmbedColorPicker';
import { type EmbedData, type LinkButton, type TemplateData, BUTTON_STYLES, emptyEmbed, emptyButton, emptyAction, emptyTemplate, emptyV2, normalizeTemplateData, encodeShareCode, decodeShareCode, readReactions } from './types';
import { questStarterV2 } from '../../utils/questTemplate';
import { t } from './t';
import { toast } from './toast';

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
  /** How many embeds one message can hold. Petto allows 10. */
  maxEmbeds?: number;
  /** Whether the test message can be sent from here. */
  allowTestSend?: boolean;
  /** Whether link buttons can carry an emoji. */
  allowButtonEmoji?: boolean;
  /** How many messages a server can save, when there is a limit. */
  maxTemplates?: number;
  /** Shown instead of the test controls when they are off. */
  testSendNote?: string;
}

async function api(guildId: string, apiPath: string, path: string, init?: RequestInit) {
  const res = await fetch(`/dash/guild/${guildId}/${apiPath}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  return res;
}

const STYLE_LABELS: Record<string, string> = { blurple: 'Blurple', green: 'Green', grey: 'Grey', red: 'Red' };

export default function EmbedBuilderApp({ guildId, botName, botIcon, userAvatarUrl, guildIconUrl, initialTemplateNames, initialSelected, channels, generatorUrl, serverName, variableGroups, apiPath = 'embeds-api', maxEmbeds = 10, allowTestSend = true, allowButtonEmoji = true, maxTemplates, testSendNote }: Props) {
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
  const cardsEnabled = apiPath === 'embeds-api';
  const [cardNames, setCardNames] = useState<{ name: string; data: unknown }[]>([]);
  const [cardImage, setCardImage] = useState('');

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  // The template as it was loaded or last saved: what "discard" on the dashboard's bar of unsaved changes goes back to.
  const savedData = useRef<TemplateData | null>(null);

  useEffect(() => {
    if (!selected) { setData(emptyTemplate()); savedData.current = null; return; }
    setLoading(true);
    api(guildId, apiPath, `?name=${encodeURIComponent(selected)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((row) => { if (row) { const loaded = normalizeTemplateData(row.data); setData(loaded); savedData.current = loaded; } setDirty(false); })
      .finally(() => setLoading(false));
  }, [selected, guildId, apiPath]);

  // A message sent from the Embed Generator arrives in the URL fragment (#import=CODE).
  useEffect(() => {
    const match = window.location.hash.match(/^#import=(.+)$/);
    if (!match) return;
    const imported = decodeShareCode(decodeURIComponent(match[1]));
    if (imported) setPendingImport({ data: imported, name: 'imported' });
    else notify(t("That import code isn't valid."), 'error');
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    if (!cardsEnabled) return;
    fetch(`/dash/guild/${guildId}/cards-api`).then((r) => (r.ok ? r.json() : null)).then((body) => { if (body?.cards) setCardNames(body.cards); }).catch(() => {});
  }, [guildId, cardsEnabled]);

  // The picture of the chosen card, drawn by the bot, so the preview shows what members will see.
  useEffect(() => {
    const row = data.card ? cardNames.find((c) => c.name === data.card!.name) : null;
    if (!row) { setCardImage(''); return; }
    let cancelled = false;
    fetch(`/dash/guild/${guildId}/cards-api`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'preview', data: row.data }) })
      .then((r) => (r.ok ? r.blob() : null))
      .then((blob) => { if (blob && !cancelled) setCardImage((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(blob); }); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [data.card?.name, cardNames, guildId]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2500);
    return () => clearTimeout(t);
  }, [flash]);

  // Feedback goes to the dashboard's toast; the app's own corner message is only for a page without it.
  function notify(text: string, kind: 'ok' | 'error' = 'ok') {
    if (!toast(text, kind)) setFlash(text);
  }

  // A button that says "Saving..." or "Sending..." keeps the width it had, so the row does not jump.
  const keepWidth = (ev: React.MouseEvent<HTMLButtonElement>) => { ev.currentTarget.style.minWidth = `${ev.currentTarget.offsetWidth}px`; };

  function update(patch: Partial<TemplateData>) {
    setData((d) => ({ ...d, ...patch }));
    setDirty(true);
  }
  function updateEmbed(i: number, patch: Partial<EmbedData>) {
    setData((d) => ({ ...d, embeds: d.embeds.map((e, ei) => (ei === i ? { ...e, ...patch } : e)) }));
    setDirty(true);
  }

  // A double click or a second press while the first request is still running would send the same name twice.
  const creating = useRef(false);

  async function handleCreate(e: React.FormEvent | null, v2 = false) {
    e?.preventDefault();
    if (!newName.trim() || creating.current) return;
    creating.current = true;
    try {
      const res = await api(guildId, apiPath, '', { method: 'POST', body: JSON.stringify({ action: 'create', name: newName.trim(), ...(v2 ? { data: { v2: emptyV2() } } : {}) }) });
      const body = await res.json();
      if (!res.ok) { notify(body.error ? t(body.error) : t("Couldn't create that template."), 'error'); return; }
      setNames((n) => [...n, body.name].sort());
      setSelected(body.name);
      setNewName('');
    } finally {
      creating.current = false;
    }
  }

  async function handleSave() {
    if (!selected) return false;
    setSaving(true);
    // A request that fails on the way (no network, a timeout) must not leave the button on "Saving...".
    const res = await api(guildId, apiPath, '', { method: 'POST', body: JSON.stringify({ action: 'save', name: selected, data }) }).catch(() => null);
    setSaving(false);
    if (!res) { notify(t("Couldn't save, try again."), 'error'); return false; }
    const failure = res.ok ? null : await res.json().catch(() => null);
    notify(res.ok ? t('Saved.') : failure?.error ? t(failure.error) : t("Couldn't save, try again."), res.ok ? 'ok' : 'error');
    if (res.ok) { setDirty(false); savedData.current = data; }
    return res.ok;
  }

  // The dashboard's bar of unsaved changes (DashGuildLayout) saves or discards the template like the Save button here.
  const saveRef = useRef(handleSave);
  saveRef.current = handleSave;
  useEffect(() => {
    const w = window as unknown as { dglDirty?: (key: string, opts: object) => void; dglClean?: (key: string) => void };
    if (!dirty || !w.dglDirty || !w.dglClean) return;
    w.dglDirty('embeds-editor', {
      save: () => saveRef.current(),
      discard: () => { if (savedData.current) setData(savedData.current); setDirty(false); },
    });
    return () => w.dglClean?.('embeds-editor');
  }, [dirty]);

  async function handleDelete() {
    if (!selected) return;
    if (!window.confirm(t('Delete the "{name}" template? This can\'t be undone.', { name: selected }))) return;
    const res = await api(guildId, apiPath, '', { method: 'POST', body: JSON.stringify({ action: 'delete', name: selected }) });
    if (!res.ok) { notify(t("Couldn't delete that template."), 'error'); return; }
    setNames((n) => n.filter((x) => x !== selected));
    setSelected('');
  }

  async function handleImport(imported: TemplateData, name: string) {
    if (creating.current) return false;
    creating.current = true;
    try {
      const res = await api(guildId, apiPath, '', { method: 'POST', body: JSON.stringify({ action: 'create', name: name.trim(), data: imported }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { notify(body.error ? t(body.error) : t("Couldn't create that template."), 'error'); return false; }
      setNames((n) => [...n, body.name].sort());
      setSelected(body.name);
      setPendingImport(null);
      setImportText('');
      notify(t('Imported.'));
      return true;
    } finally {
      creating.current = false;
    }
  }

  function handleImportText() {
    const text = importText.trim();
    let imported: TemplateData | null = decodeShareCode(text);
    if (!imported) {
      try { imported = normalizeTemplateData(JSON.parse(text)); } catch { imported = null; }
      if (imported && !imported.v2 && imported.embeds.length === 0 && !imported.content) imported = null;
    }
    if (!imported) { notify(t("That import code isn't valid."), 'error'); return; }
    setPendingImport({ data: imported, name: 'imported' });
  }

  async function handleCopy(kind: 'code' | 'json') {
    const text = kind === 'code' ? encodeShareCode(data) : data.v2 ? JSON.stringify({ flags: 32768, components: data.v2.components }, null, 2) : JSON.stringify(data, null, 2);
    try { await navigator.clipboard.writeText(text); notify(t('Copied.')); } catch { notify(t("Couldn't copy, try again."), 'error'); }
  }

  function openInGenerator() {
    window.open(`${generatorUrl}/#import=${encodeURIComponent(encodeShareCode(data))}`, '_blank', 'noopener');
  }

  async function handleSendTest() {
    setSending(true);
    const res = await api(guildId, apiPath, '', { method: 'POST', body: JSON.stringify({ action: 'test_send', data, channel_id: sendTarget }) }).catch(() => null);
    setSending(false);
    if (!res) { notify(t("Couldn't send the test message."), 'error'); return; }
    const body = await res.json().catch(() => ({}));
    notify(res.ok ? t('Test message sent.') : (body.error ? t(body.error) : t("Couldn't send the test message.")), res.ok ? 'ok' : 'error');
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
  // A button is a link (it has a URL) or has actions (it gives roles or shows a saved embed): `actions` empty means a link.
  function setButtonKind(ri: number, bi: number, kind: 'link' | 'action') {
    updateButton(ri, bi, kind === 'link' ? { actions: undefined, style: undefined } : { url: '', style: 'grey', actions: [emptyAction()] });
  }
  function removeButton(ri: number, bi: number) {
    update({ buttons: data.buttons.map((row, i) => (i !== ri ? row : row.filter((_, j) => j !== bi))).filter((row) => row.length > 0) });
  }

  const e = data.embeds[activeEmbed];

  const cardField = cardsEnabled ? (
                <div className="ebr-field">
                  <div className="ebr-field-head"><label>{t('Image card')}</label></div>
                  <div className="ebr-card-pick">
                    <select value={data.card?.name ?? ''} onChange={(ev) => { const name = ev.target.value; const next = { ...data }; if (name) next.card = { name, placement: data.card?.placement ?? 'default' }; else delete next.card; setData(next); setDirty(true); }}>
                      <option value="">{t('No image card')}</option>
                      {cardNames.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                      {data.card && !cardNames.some((c) => c.name === data.card!.name) && <option value={data.card.name}>{data.card.name}</option>}
                    </select>
                    <select value={data.card?.placement ?? 'default'} disabled={!data.card} onChange={(ev) => update({ card: { name: data.card!.name, placement: ev.target.value as 'default' | 'embed' | 'attachment' } })}>
                      <option value="default">{data.v2 ? t('At the top of the first container') : t('Inside the first embed')}</option>
                      <option value="attachment">{t('Above the message, as a file')}</option>
                    </select>
                  </div>
                  <a className="ebr-card-link" href={`/dash/guild/${guildId}/cards`}>{t('Make or edit cards')}</a>
                </div>
  ) : null;

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
          <div className="ebr-limit-note">{maxTemplates ? t('{n}/{max} saved', { n: names.length, max: maxTemplates }) : t('{n} saved themes · unlimited', { n: names.length })}</div>
          <div className="ebr-import">
            <textarea rows={2} placeholder={t('Paste an import code or JSON')} value={importText} onChange={(ev) => setImportText(ev.target.value)} />
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleImportText} disabled={!importText.trim()}>{t('Import')}</button>
          </div>
          <form className="ebr-create" onSubmit={handleCreate}>
            <input type="text" placeholder="new-template-name" maxLength={40} value={newName} onChange={(e) => setNewName(e.target.value)} />
            <button type="submit" className="btn btn-ghost btn-sm">{t('+ New')}</button>
            {apiPath === 'embeds-api' && <button type="button" className="btn btn-ghost btn-sm" title={t('A message made of containers, pictures and sections (Components V2)')} onClick={() => handleCreate(null, true)} disabled={!newName.trim()}>{t('+ New V2')}</button>}
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
              {data.v2 ? <V2Preview doc={data.v2} cardImage={cardImage} cardPlacement={data.card?.placement} botName={botName} botIcon={botIcon} userAvatarUrl={userAvatarUrl} guildIconUrl={guildIconUrl} serverName={serverName} /> : <Preview data={data} cardImage={cardImage} botName={botName} botIcon={botIcon} userAvatarUrl={userAvatarUrl} guildIconUrl={guildIconUrl} serverName={serverName} />}
            </div>

            <div className="ebr-form-col">
              <VariablesPanel groups={variableGroups} />
              <div className="ebr-field">
                <div className="ebr-field-head"><label>{t('Reactions')}</label></div>
                <input type="text" className="ebr-reactions-input" value={(data.reactions ?? []).join(' ')} maxLength={400} placeholder="🌸 🎀 <:name:123456789>"
                  onChange={(ev) => { const list = readReactions(ev.target.value.split(/\s+/)); const next = { ...data }; if (list.length) next.reactions = list; else delete next.reactions; setData(next); setDirty(true); }} />
                <span className="ebr-hint">{t('Up to 5 emojis, separated by spaces. Petto adds them to the message when it sends it. It is the same as writing {reactreply:emoji} for each one.')}</span>
              </div>
              {data.v2 ? (
                <>
                  <p className="v2e-intro">{t('A Components V2 message: containers with text, pictures, sections and link buttons. It has no message text and no embeds.')}</p>
                  <div className="v2e-starters">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => { if (window.confirm(t('Replace this design with the Petto quest alert design?'))) update({ v2: questStarterV2() }); }}>{t('Use the quest alert design')}</button>
                  </div>
                  {cardField}
                  <V2Editor doc={data.v2} names={names} onChange={(v2) => update({ v2 })} />
                </>
              ) : (
              <>
              <div className="ebr-field">
                <div className="ebr-field-head"><label>{t('Message content')}</label></div>
                <textarea ref={contentRef} data-ac="" rows={2} maxLength={2000} value={data.content} onChange={(ev) => update({ content: ev.target.value })} />
                <FormatToolbar targetRef={contentRef} onChange={(v) => update({ content: v })} />
                <SilentHint />
              </div>

              {cardField}

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
                    <input ref={titleRef} type="text" data-ac="vars,emojis" maxLength={256} value={e.title} onChange={(ev) => updateEmbed(activeEmbed, { title: ev.target.value })} />
                    <FormatToolbar targetRef={titleRef} onChange={(v) => updateEmbed(activeEmbed, { title: v })} />
                  </div>
                  <div className="ebr-field">
                    <label>{t('Description')}</label>
                    <textarea ref={descRef} data-ac="" rows={4} maxLength={4096} value={e.description} onChange={(ev) => updateEmbed(activeEmbed, { description: ev.target.value })} />
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
                    <div className="ebr-field"><label>{t('Author name')}</label><input type="text" data-ac="vars" value={e.author.name} onChange={(ev) => updateEmbed(activeEmbed, { author: { ...e.author, name: ev.target.value } })} /></div>
                    <div className="ebr-field"><label>{t('Author icon URL')}</label><input type="text" value={e.author.icon ?? ''} onChange={(ev) => updateEmbed(activeEmbed, { author: { ...e.author, icon: ev.target.value } })} placeholder="https://..." /></div>
                  </div>
                  <div className="ebr-field">
                    <label>{t('Author link URL')}</label>
                    <input type="text" value={e.author.url ?? ''} onChange={(ev) => updateEmbed(activeEmbed, { author: { ...e.author, url: ev.target.value } })} placeholder="https://..." />
                  </div>
                  <div className="ebr-row-pair">
                    <div className="ebr-field"><label>{t('Footer text')}</label><input type="text" data-ac="vars" value={e.footer.text} onChange={(ev) => updateEmbed(activeEmbed, { footer: { ...e.footer, text: ev.target.value } })} /></div>
                    <div className="ebr-field"><label>{t('Footer icon URL')}</label><input type="text" value={e.footer.icon ?? ''} onChange={(ev) => updateEmbed(activeEmbed, { footer: { ...e.footer, icon: ev.target.value } })} placeholder="https://..." /></div>
                  </div>
                  <label className="ebr-check"><input type="checkbox" checked={e.timestamp} onChange={(ev) => updateEmbed(activeEmbed, { timestamp: ev.target.checked })} />{t('Show current time in the footer')}</label>

                  <div className="ebr-fields-section">
                    <h3>{t('Fields')} <span className="ebr-count">{e.fields.length}/25</span></h3>
                    {e.fields.map((f, fi) => (
                      <div key={fi} className="ebr-field-row-edit">
                        <input type="text" data-ac="vars,emojis" placeholder={t('Name')} maxLength={256} value={f.name} onChange={(ev) => updateEmbed(activeEmbed, { fields: e.fields.map((x, i) => (i === fi ? { ...x, name: ev.target.value } : x)) })} />
                        <textarea className="dgl-autogrow" data-ac="" rows={2} placeholder={t('Value')} maxLength={1024} value={f.value} onChange={(ev) => updateEmbed(activeEmbed, { fields: e.fields.map((x, i) => (i === fi ? { ...x, value: ev.target.value } : x)) })} />
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
                <h3>{t('Buttons')}</h3>
                {data.buttons.map((row, ri) => (
                  <div key={ri} className="ebr-btn-row-edit">
                    {row.map((b, bi) => {
                      const isAction = Boolean(b.actions?.length);
                      return (
                        <div key={bi} className="ebr-btn-box">
                          <div className="ebr-btn-edit">
                            <select value={isAction ? 'action' : 'link'} onChange={(ev) => setButtonKind(ri, bi, ev.target.value as 'link' | 'action')} aria-label={t('Button type')}>
                              <option value="link">{t('Link')}</option>
                              <option value="action">{t('Action')}</option>
                            </select>
                            <input type="text" placeholder={t('Label')} maxLength={80} value={b.label} onChange={(ev) => updateButton(ri, bi, { label: ev.target.value })} />
                            {!isAction && <input type="text" placeholder="https://..." value={b.url} onChange={(ev) => updateButton(ri, bi, { url: ev.target.value })} />}
                            {isAction && (
                              <select value={b.style ?? 'grey'} onChange={(ev) => updateButton(ri, bi, { style: ev.target.value as LinkButton['style'] })} aria-label={t('Color')}>
                                {BUTTON_STYLES.map((style) => <option key={style} value={style}>{t(STYLE_LABELS[style])}</option>)}
                              </select>
                            )}
                            {allowButtonEmoji && <input type="text" placeholder={t('Emoji')} maxLength={4} className="ebr-btn-emoji" value={b.emoji} onChange={(ev) => updateButton(ri, bi, { emoji: ev.target.value })} />}
                            <button type="button" className="ebr-del" onClick={() => removeButton(ri, bi)}>×</button>
                          </div>
                          {isAction && <ButtonActions actions={b.actions ?? []} names={names} onChange={(actions) => (actions.length ? updateButton(ri, bi, { actions }) : updateButton(ri, bi, { actions: undefined, style: undefined }))} />}
                        </div>
                      );
                    })}
                    {row.length < 5 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => addButton(ri)}>{t('+ Button')}</button>}
                  </div>
                ))}
                {data.buttons.length < 5 && <button type="button" className="btn btn-ghost btn-sm" onClick={addButtonRow}>{t('+ Add button row')}</button>}
              </div>

              </>
              )}

              <div className="ebr-actions">
                <button type="button" className="btn btn-accent btn-sm" onClick={(ev) => { keepWidth(ev); handleSave(); }} disabled={saving || !dirty}>{saving ? t('Saving...') : t('Save changes')}</button>
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
                  <button type="button" className="btn btn-ghost btn-sm" onClick={(ev) => { keepWidth(ev); handleSendTest(); }} disabled={sending || dirty}>{sending ? t('Sending...') : t('Send test')}</button>
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
