import { useEffect, useRef, useState } from 'react';
import './embeds.css';
import FormatToolbar from './FormatToolbar';
import SilentHint from './SilentHint';
import GrowField from './GrowField';
import Section from './Section';
import Preview from './Preview';
import V2Editor from '../v2/V2Editor';
import ButtonActions from './ButtonActions';
import V2Preview from '../v2/V2Preview';
import VariablesPanel from './VariablesPanel';
import EmbedColorPicker from './EmbedColorPicker';
import { type EmbedData, type LinkButton, type TemplateData, BUTTON_STYLES, emptyEmbed, emptyButton, emptyAction, emptyTemplate, emptyV2, normalizeTemplateData, encodeShareCode, decodeShareCode, readReactions } from './types';
import { questStarterV2 } from '../../utils/questTemplate';
import { drawCard, withDefaults } from '../cards/cardCanvas';
import { buildBasicLayers } from '../cards/basicLayers';
import { t } from './t';
import { toast } from './toast';
import { ask } from '../dglAsk';

interface Props {
  guildId: string;
  botName: string;
  botIcon: string;
  userAvatarUrl: string;
  decorationUrl?: string;
  nameplateUrl?: string;
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

export default function EmbedBuilderApp({ guildId, botName, botIcon, userAvatarUrl, decorationUrl, nameplateUrl, guildIconUrl, initialTemplateNames, initialSelected, channels, generatorUrl, serverName, variableGroups, apiPath = 'embeds-api', maxEmbeds = 10, allowTestSend = true, allowButtonEmoji = true, maxTemplates, testSendNote }: Props) {
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
  const [newOpen, setNewOpen] = useState(initialTemplateNames.length === 0);
  const [view, setView] = useState<'edit' | 'preview'>('edit');

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  // The template as it was loaded or last saved: what "discard" on the dashboard's bar of unsaved changes goes back to.
  const savedData = useRef<TemplateData | null>(null);
  // The templates already read: going back to one shows it at once and refreshes it behind (never over what is being edited).
  const cache = useRef<Record<string, TemplateData>>({});
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;
  // Which template and which embed the person was on, kept for this tab, so a reload or a save does not send them back to the first.
  const storeKey = `ebr:${guildId}:${apiPath}`;
  const remember = (key: string, value: string) => { try { sessionStorage.setItem(`${storeKey}:${key}`, value); } catch { /* the tab keeps no memory: nothing is lost */ } };
  const recall = (key: string) => { try { return sessionStorage.getItem(`${storeKey}:${key}`); } catch { return null; } };
  function pick(name: string) {
    setSelected(name);
    remember('selected', name);
    if (apiPath === 'embeds-api') { try { const url = new URL(window.location.href); url.searchParams.set('name', name); window.history.replaceState(window.history.state, '', url); } catch { /* the address is a convenience */ } }
  }
  function chooseEmbed(i: number) { setActiveEmbed(i); if (selected) remember(`embed:${selected}`, String(i)); }

  useEffect(() => {
    if (!selected) { setData(emptyTemplate()); savedData.current = null; return; }
    const cached = cache.current[selected];
    const wanted = Number(recall(`embed:${selected}`) ?? 0) || 0;
    if (cached) { setData(cached); savedData.current = cached; setDirty(false); setActiveEmbed(Math.max(0, Math.min(wanted, cached.embeds.length - 1))); } else { setLoading(true); setActiveEmbed(0); }
    let current = true;
    api(guildId, apiPath, `?name=${encodeURIComponent(selected)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((row) => {
        if (!row || !current) return;
        const loaded = normalizeTemplateData(row.data);
        cache.current[selected] = loaded;
        // Edits made while it was refreshing win over what came back.
        if (cached && dirtyRef.current) return;
        setData(loaded); savedData.current = loaded; setDirty(false);
        setActiveEmbed(Math.max(0, Math.min(wanted, loaded.embeds.length - 1)));
      })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [selected, guildId, apiPath]);

  // Back on the page (a reload, a visit from another page): the template the person had open, unless the address names one.
  useEffect(() => {
    try {
      if (new URL(window.location.href).searchParams.has('name')) return;
      const stored = recall('selected');
      if (stored && stored !== selected && initialTemplateNames.includes(stored)) setSelected(stored);
    } catch { /* nothing to restore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // The picture of the chosen card is drawn right here, in the browser (a basic card with the layers of its layout), so it is there as soon as the card is chosen:
  // asking the bot to draw it took seconds, and sometimes never came. The decoration of the avatar and the nameplate only show in the real message.
  useEffect(() => {
    const row = data.card ? cardNames.find((c) => c.name === data.card!.name) : null;
    if (!row) { setCardImage(''); return; }
    let cancelled = false;
    const card = row.data.mode === 'basic'
      ? { ...row.data, layers: withDefaults(buildBasicLayers(row.data.basic ?? {}, row.data.width, row.data.height, row.data.kind === 'rank' ? 'rank' : 'welcome')) }
      : row.data;
    const canvas = document.createElement('canvas');
    canvas.width = card.width; canvas.height = card.height;
    void drawCard(canvas, card as typeof row.data, {
      context: { userId: '', userName: 'Petto', serverName, memberCount: 1204 },
      avatarUrl: userAvatarUrl,
      serverIconUrl: guildIconUrl,
      decorationUrl,
      nameplateUrl,
      assetUrl: (id) => `/dash/guild/${guildId}/cards-api?asset=${id}`,
      designUrl: (id) => `/dash/guild/${guildId}/cards-api?design=${id}&size=full`,
    }, () => !cancelled, () => {
      // Every pass is shown: a picture that is slow to come joins the card later instead of keeping the whole card away.
      // A picture of a host that does not allow CORS makes the canvas impossible to save; the card then stays as the last pass left it.
      try { canvas.toBlob((blob) => { if (blob && !cancelled) setCardImage((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(blob); }); }); } catch { /* tainted canvas */ }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [data.card?.name, cardNames, guildId, userAvatarUrl, decorationUrl, nameplateUrl, guildIconUrl, serverName]);

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
      pick(body.name);
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
    if (res.ok) { setDirty(false); savedData.current = data; cache.current[selected] = data; }
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
    if (!(await ask(t('Delete the "{name}" template? This can\'t be undone.', { name: selected }), { confirm: t('Delete') }))) return;
    const res = await api(guildId, apiPath, '', { method: 'POST', body: JSON.stringify({ action: 'delete', name: selected }) });
    if (!res.ok) { notify(t("Couldn't delete that template."), 'error'); return; }
    setNames((n) => n.filter((x) => x !== selected));
    delete cache.current[selected];
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
      pick(body.name);
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
  const mv = (list: unknown[], from: number, to: number) => { const copy = [...list]; const [item] = copy.splice(from, 1); copy.splice(to, 0, item); return copy; };

  const cardField = cardsEnabled ? (
    <Section title={t('Image card')} defaultOpen={Boolean(data.card)}>
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
        <a className="ebr-card-link" href={`/dash/guild/${guildId}/cards`}>{t('Make or edit cards')}</a>
      </div>
    </Section>
  ) : null;

  const reactionsField = (
    <Section title={t('Reactions')} defaultOpen={Boolean(data.reactions?.length)}>
      <div className="ebr-field">
        <input type="text" className="ebr-reactions-input" value={(data.reactions ?? []).join(' ')} maxLength={400} placeholder="🌸 🎀 <:name:123456789>" aria-label={t('Reactions')}
          onChange={(ev) => { const list = readReactions(ev.target.value.split(/\s+/)); const next = { ...data }; if (list.length) next.reactions = list; else delete next.reactions; setData(next); setDirty(true); }} />
        <span className="ebr-hint">{t('Up to 5 emojis, separated by spaces. Petto adds them to the message when it sends it. It is the same as writing {reactreply:emoji} for each one.')}</span>
      </div>
    </Section>
  );

  const previewNode = data.v2
    ? <V2Preview doc={data.v2} cardImage={cardImage} cardPlacement={data.card?.placement} botName={botName} botIcon={botIcon} userAvatarUrl={userAvatarUrl} guildIconUrl={guildIconUrl} serverName={serverName} />
    : <Preview data={data} cardImage={cardImage} botName={botName} botIcon={botIcon} userAvatarUrl={userAvatarUrl} guildIconUrl={guildIconUrl} serverName={serverName} />;

  const trash = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" /></svg>;
  const upIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 15 6-6 6 6" /></svg>;
  const downIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;

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

      <div className="ebr-top">
        <div className="ebr-chips" role="tablist" aria-label={t('Templates')}>
          {names.map((n) => (
            <button key={n} type="button" role="tab" aria-selected={n === selected} className={`ebr-chip${n === selected ? ' active' : ''}`} onClick={() => pick(n)}>{n}</button>
          ))}
          <button type="button" className={`ebr-chip-new${newOpen ? ' open' : ''}`} aria-expanded={newOpen} onClick={() => setNewOpen((o) => !o)}>{t('+ New')}</button>
        </div>
        <span className="ebr-limit-note">{maxTemplates ? t('{n}/{max} saved', { n: names.length, max: maxTemplates }) : t('{n} saved themes · unlimited', { n: names.length })}</span>
      </div>

      <div className="ebr-new" data-open={newOpen}>
        <div className="ebr-new-inner" {...(newOpen ? {} : { inert: '' })}>
          <form className="ebr-new-card" onSubmit={handleCreate}>
            <strong>{t('New template')}</strong>
            <input type="text" placeholder="new-template-name" aria-label={t('New template')} maxLength={40} value={newName} onChange={(ev) => setNewName(ev.target.value)} />
            <div className="ebr-new-actions">
              <button type="submit" className="btn btn-accent btn-sm" disabled={!newName.trim()}>{t('+ New')}</button>
              {apiPath === 'embeds-api' && <button type="button" className="btn btn-ghost btn-sm" title={t('A message made of containers, pictures and sections (Components V2)')} onClick={() => handleCreate(null, true)} disabled={!newName.trim()}>{t('+ New V2')}</button>}
            </div>
          </form>
          <div className="ebr-new-card">
            <strong>{t('Import')}</strong>
            <GrowField value={importText} onChange={setImportText} rows={2} placeholder={t('Paste an import code or JSON')} aria-label={t('Paste an import code or JSON')} className="ebr-mono" />
            <div className="ebr-new-actions"><button type="button" className="btn btn-ghost btn-sm" onClick={handleImportText} disabled={!importText.trim()}>{t('Import')}</button></div>
          </div>
        </div>
      </div>

      {!selected ? (
        <div className="ebr-empty">
          <p className="ebr-empty-note">{names.length === 0 ? t('No templates yet.') : ''}</p>
          <p className="ebr-empty-note">{t('Pick one of your templates above, or make a new one to start.')}</p>
        </div>
      ) : loading ? (
        <div className="ebr-skeleton" aria-hidden="true"><i /><i /><i /></div>
      ) : (
        <div className="ebr-editor ebr-fade" data-view={view} key={selected}>
          <div className="ebr-head">
            <div className="ebr-head-title">
              <h2>{selected}</h2>
              <span className={`ebr-state${dirty ? ' dirty' : ''}`}><i />{dirty ? t('Unsaved changes') : t('All changes saved')}</span>
            </div>
            <div className="ebr-head-actions">
              <button type="button" className="btn btn-accent btn-sm" onClick={(ev) => { keepWidth(ev); handleSave(); }} disabled={saving || !dirty}>{saving ? t('Saving...') : t('Save changes')}</button>
              <button type="button" className="btn btn-ghost btn-sm ebr-delete-btn" onClick={handleDelete} aria-label={t('Delete this template')} title={t('Delete this template')}>{trash}<span>{t('Delete this template')}</span></button>
            </div>
          </div>

          <div className="ebr-switch" role="tablist" aria-label={t('View')}>
            <button type="button" role="tab" aria-selected={view === 'edit'} onClick={() => setView('edit')}>{t('Edit')}</button>
            <button type="button" role="tab" aria-selected={view === 'preview'} onClick={() => setView('preview')}>{t('Preview')}</button>
          </div>

          <div className="ebr-form-col">
            {data.v2 ? (
              <>
                <Section title={t('Message')}>
                  <p className="v2e-intro">{t('A Components V2 message: containers with text, pictures, sections and link buttons. It has no message text and no embeds.')}</p>
                  <div className="v2e-starters">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => { void ask(t('Replace this design with the Petto quest alert design?'), { tone: 'neutral', confirm: t('Replace') }).then((ok) => { if (ok) update({ v2: questStarterV2() }); }); }}>{t('Use the quest alert design')}</button>
                  </div>
                  <V2Editor doc={data.v2} names={names} onChange={(v2) => update({ v2 })} />
                </Section>
                {cardField}
                {reactionsField}
              </>
            ) : (
              <>
                <Section title={t('Message')}>
                  <div className="ebr-field">
                    <label>{t('Message content')}</label>
                    <GrowField ref={contentRef} data-ac="" rows={3} maxLength={2000} counter value={data.content} onChange={(v) => update({ content: v })} />
                    <FormatToolbar targetRef={contentRef} onChange={(v) => update({ content: v })} />
                    <SilentHint />
                  </div>
                </Section>

                <Section title={t('Embeds')} meta={`${data.embeds.length}/${maxEmbeds}`}>
                  <div className="ebr-embed-tabs">
                    {data.embeds.map((_, i) => (
                      <div key={i} className={`ebr-tab${i === activeEmbed ? ' active' : ''}`}>
                        <button type="button" className="ebr-tab-main" onClick={() => chooseEmbed(i)}>Embed {i + 1}</button>
                        <button type="button" className="ebr-tab-x" onClick={() => removeEmbed(i)} aria-label={t('Remove')} title={t('Remove')}>×</button>
                      </div>
                    ))}
                    {data.embeds.length < maxEmbeds && <button type="button" className="ebr-tab-add" onClick={addEmbed}>{t('+ Add embed')}</button>}
                  </div>

                  {e ? (
                    <div className="ebr-embed-form" key={activeEmbed}>
                      <Section level="sub" title={t('Text')}>
                        <div className="ebr-field">
                          <label>{t('Title')}</label>
                          <GrowField ref={titleRef} single data-ac="vars,emojis" maxLength={256} counter value={e.title} onChange={(v) => updateEmbed(activeEmbed, { title: v })} />
                          <FormatToolbar targetRef={titleRef} onChange={(v) => updateEmbed(activeEmbed, { title: v })} />
                        </div>
                        <div className="ebr-field">
                          <label>{t('Description')}</label>
                          <GrowField ref={descRef} data-ac="" rows={4} maxLength={4096} counter value={e.description} onChange={(v) => updateEmbed(activeEmbed, { description: v })} />
                          <FormatToolbar targetRef={descRef} onChange={(v) => updateEmbed(activeEmbed, { description: v })} />
                        </div>
                      </Section>

                      <Section level="sub" title={t('Look')}>
                        <div className="ebr-row-pair">
                          <div className="ebr-field"><label>{t('Color')}</label><EmbedColorPicker value={e.color} onChange={(color) => updateEmbed(activeEmbed, { color })} /></div>
                          <div className="ebr-field"><label>{t('Title link URL')}</label><GrowField single value={e.url} placeholder="https://..." onChange={(v) => updateEmbed(activeEmbed, { url: v })} /></div>
                        </div>
                        <div className="ebr-row-pair">
                          <div className="ebr-field"><label>{t('Thumbnail URL')}</label><GrowField single value={e.thumbnail} placeholder="https://..." onChange={(v) => updateEmbed(activeEmbed, { thumbnail: v })} /></div>
                          <div className="ebr-field"><label>{t('Image URL')}</label><GrowField single value={e.image} placeholder="https://..." onChange={(v) => updateEmbed(activeEmbed, { image: v })} /></div>
                        </div>
                      </Section>

                      <Section level="sub" title={t('Author')} defaultOpen={Boolean(e.author.name || e.author.icon || e.author.url)}>
                        <div className="ebr-row-pair">
                          <div className="ebr-field"><label>{t('Author name')}</label><GrowField single data-ac="vars" value={e.author.name} onChange={(v) => updateEmbed(activeEmbed, { author: { ...e.author, name: v } })} /></div>
                          <div className="ebr-field"><label>{t('Author icon URL')}</label><GrowField single value={e.author.icon ?? ''} placeholder="https://..." onChange={(v) => updateEmbed(activeEmbed, { author: { ...e.author, icon: v } })} /></div>
                        </div>
                        <div className="ebr-field"><label>{t('Author link URL')}</label><GrowField single value={e.author.url ?? ''} placeholder="https://..." onChange={(v) => updateEmbed(activeEmbed, { author: { ...e.author, url: v } })} /></div>
                      </Section>

                      <Section level="sub" title={t('Footer')} defaultOpen={Boolean(e.footer.text || e.footer.icon || e.timestamp)}>
                        <div className="ebr-row-pair">
                          <div className="ebr-field"><label>{t('Footer text')}</label><GrowField single data-ac="vars" value={e.footer.text} onChange={(v) => updateEmbed(activeEmbed, { footer: { ...e.footer, text: v } })} /></div>
                          <div className="ebr-field"><label>{t('Footer icon URL')}</label><GrowField single value={e.footer.icon ?? ''} placeholder="https://..." onChange={(v) => updateEmbed(activeEmbed, { footer: { ...e.footer, icon: v } })} /></div>
                        </div>
                        <label className="ebr-switchrow"><input type="checkbox" checked={e.timestamp} onChange={(ev) => updateEmbed(activeEmbed, { timestamp: ev.target.checked })} /><span>{t('Show current time in the footer')}</span></label>
                      </Section>

                      <Section level="sub" title={t('Fields')} meta={`${e.fields.length}/25`} defaultOpen={e.fields.length > 0}>
                        <div className="ebr-items">
                          {e.fields.map((f, fi) => (
                            <div key={fi} className="ebr-item ebr-rise">
                              <div className="ebr-item-main">
                                <GrowField single data-ac="vars,emojis" placeholder={t('Name')} aria-label={t('Name')} maxLength={256} value={f.name} onChange={(v) => updateEmbed(activeEmbed, { fields: e.fields.map((x, i) => (i === fi ? { ...x, name: v } : x)) })} />
                                <GrowField data-ac="" rows={2} placeholder={t('Value')} aria-label={t('Value')} maxLength={1024} value={f.value} onChange={(v) => updateEmbed(activeEmbed, { fields: e.fields.map((x, i) => (i === fi ? { ...x, value: v } : x)) })} />
                                <label className="ebr-switchrow ebr-switchrow-sm"><input type="checkbox" checked={f.inline} onChange={(ev) => updateEmbed(activeEmbed, { fields: e.fields.map((x, i) => (i === fi ? { ...x, inline: ev.target.checked } : x)) })} /><span>{t('Inline')}</span></label>
                              </div>
                              <div className="ebr-item-tools">
                                <button type="button" className="ebr-icon" disabled={fi === 0} onClick={() => updateEmbed(activeEmbed, { fields: mv(e.fields, fi, fi - 1) as typeof e.fields })} aria-label={t('Move up')} title={t('Move up')}>{upIcon}</button>
                                <button type="button" className="ebr-icon" disabled={fi === e.fields.length - 1} onClick={() => updateEmbed(activeEmbed, { fields: mv(e.fields, fi, fi + 1) as typeof e.fields })} aria-label={t('Move down')} title={t('Move down')}>{downIcon}</button>
                                <button type="button" className="ebr-icon ebr-icon-del" onClick={() => updateEmbed(activeEmbed, { fields: e.fields.filter((_, i) => i !== fi) })} aria-label={t('Remove')} title={t('Remove')}>{trash}</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        {e.fields.length < 25 && (
                          <button type="button" className="btn btn-ghost btn-sm" onClick={() => updateEmbed(activeEmbed, { fields: [...e.fields, { name: '', value: '', inline: false }] })}>{t('+ Add field')}</button>
                        )}
                      </Section>
                    </div>
                  ) : (
                    <p className="ebr-empty-note">{t('This message has no embeds. Add one to get a title, a description and a color.')}</p>
                  )}
                </Section>

                {cardField}
                {reactionsField}

                <Section title={t('Buttons')} meta={data.buttons.length ? `${data.buttons.length}/5` : undefined} defaultOpen={data.buttons.length > 0}>
                  <div className="ebr-items">
                    {data.buttons.map((row, ri) => (
                      <div key={ri} className="ebr-btn-row-edit ebr-rise">
                        <div className="ebr-btn-row-title">{t('Row {n}', { n: ri + 1 })}</div>
                        {row.map((b, bi) => {
                          const isAction = Boolean(b.actions?.length);
                          return (
                            <div key={bi} className="ebr-btn-box">
                              <div className="ebr-btn-edit">
                                <div className="ebr-seg" role="group" aria-label={t('Button type')}>
                                  <button type="button" aria-pressed={!isAction} onClick={() => isAction && setButtonKind(ri, bi, 'link')}>{t('Link')}</button>
                                  <button type="button" aria-pressed={isAction} onClick={() => !isAction && setButtonKind(ri, bi, 'action')}>{t('Action')}</button>
                                </div>
                                <GrowField single placeholder={t('Label')} aria-label={t('Label')} maxLength={80} value={b.label} onChange={(v) => updateButton(ri, bi, { label: v })} />
                                {!isAction && <GrowField single placeholder="https://..." aria-label="URL" value={b.url} onChange={(v) => updateButton(ri, bi, { url: v })} />}
                                {isAction && (
                                  <select value={b.style ?? 'grey'} onChange={(ev) => updateButton(ri, bi, { style: ev.target.value as LinkButton['style'] })} aria-label={t('Color')}>
                                    {BUTTON_STYLES.map((style) => <option key={style} value={style}>{t(STYLE_LABELS[style])}</option>)}
                                  </select>
                                )}
                                {allowButtonEmoji && <input type="text" placeholder={t('Emoji')} aria-label={t('Emoji')} maxLength={4} className="ebr-btn-emoji" value={b.emoji} onChange={(ev) => updateButton(ri, bi, { emoji: ev.target.value })} />}
                                <button type="button" className="ebr-icon ebr-icon-del" onClick={() => removeButton(ri, bi)} aria-label={t('Remove')} title={t('Remove')}>{trash}</button>
                              </div>
                              {isAction && <ButtonActions actions={b.actions ?? []} names={names} onChange={(actions) => (actions.length ? updateButton(ri, bi, { actions }) : updateButton(ri, bi, { actions: undefined, style: undefined }))} />}
                            </div>
                          );
                        })}
                        {row.length < 5 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => addButton(ri)}>{t('+ Button')}</button>}
                      </div>
                    ))}
                  </div>
                  {data.buttons.length < 5 && <button type="button" className="btn btn-ghost btn-sm" onClick={addButtonRow}>{t('+ Add button row')}</button>}
                </Section>
              </>
            )}

            <Section title={t('Variables')} defaultOpen={false}>
              <VariablesPanel groups={variableGroups} />
            </Section>
          </div>

          <aside className="ebr-preview-col">
            <div className="ebr-preview-card">
              <div className="ebr-preview-label">{t('Preview')}</div>
              {previewNode}
            </div>
            <div className="ebr-tools">
              <h3>{t('Test and share')}</h3>
              {allowTestSend ? (<>
                <div className="ebr-tools-row">
                  <select value={sendTarget} onChange={(ev) => setSendTarget(ev.target.value)} aria-label={t('Test and share')}>
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
          </aside>
        </div>
      )}
    </div>
  );
}
