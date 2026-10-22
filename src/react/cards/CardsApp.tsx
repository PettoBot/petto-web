import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../embeds/embeds.css';
import './cards.css';
import { t } from '../embeds/t';
import { toast } from '../embeds/toast';
import { drawCard } from './cardCanvas';
import {
  type AssetInfo, type Background, type Basic, type CardData, type Fit, type Layer, type Overview, type Shadow, type Stroke,
  RANK_VARIABLE_CHOICES, VARIABLE_CHOICES, layerBox, newCard, newLayer, type Kind,
} from './cardTypes';

interface Props { guildId: string; premiumUrl: string; initialSelected: string; userId: string; userName: string; userAvatarUrl: string; serverName: string; serverIconUrl: string }

const ERRORS: Record<string, string> = {
  premium_required: 'This card uses the advanced editor or a Premium font, which needs Premium.',
  card_limit: 'You reached the card limit of this server.',
  asset_limit: 'You reached the uploaded picture limit of this server.',
  storage_full: 'The picture storage of this server is full.',
  unsupported_type: 'Only PNG, JPEG, WebP and GIF pictures can be uploaded.',
  not_an_image: "That file isn't a picture Petto can read.",
  file_too_big: 'That picture is too big.',
  name_required: 'Give the card a name.',
  not_configured: 'The bot is not configured.',
};
const errorText = (code?: string) => (code && ERRORS[code] ? t(ERRORS[code]) : t("Couldn't do that, try again."));

const PRESET_LABELS: Record<string, string> = { classic: 'Classic', side: 'Side', bars: 'Bars', panel: 'Panel', rank: 'Side', rankBottom: 'Bottom bar' };

async function call(guildId: string, path: string, init?: RequestInit) {
  return fetch(`/dash/guild/${guildId}/cards-api${path}`, init);
}
async function post(guildId: string, body: unknown, path = '') {
  return call(guildId, path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

function Num({ value, onChange, min, max, step = 1 }: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return <input type="number" value={Number.isFinite(value) ? value : 0} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))} />;
}

function Color({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <span className="crd-color">
      <input type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'} onChange={(e) => onChange(e.target.value)} />
      <input type="text" value={value} maxLength={7} onChange={(e) => onChange(e.target.value)} />
    </span>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return <div className={`ebr-field${wide ? ' crd-wide' : ''}`}><label>{label}</label>{children}</div>;
}

function StrokeEditor({ value, onChange, label }: { value: Stroke | null; onChange: (v: Stroke | null) => void; label: string }) {
  return (
    <div className="crd-group">
      <label className="ebr-check"><input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked ? { color: '#000000', width: 4 } : null)} />{label}</label>
      {value && <div className="ebr-row-pair"><Field label={t('Color')}><Color value={value.color} onChange={(color) => onChange({ ...value, color })} /></Field><Field label={t('Width')}><Num value={value.width} min={0} max={40} onChange={(width) => onChange({ ...value, width })} /></Field></div>}
    </div>
  );
}

function ShadowEditor({ value, onChange }: { value: Shadow | null; onChange: (v: Shadow | null) => void }) {
  return (
    <div className="crd-group">
      <label className="ebr-check"><input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked ? { color: '#000000', blur: 12, x: 0, y: 4 } : null)} />{t('Shadow')}</label>
      {value && (
        <div className="crd-grid4">
          <Field label={t('Color')}><Color value={value.color} onChange={(color) => onChange({ ...value, color })} /></Field>
          <Field label={t('Blur')}><Num value={value.blur} min={0} max={60} onChange={(blur) => onChange({ ...value, blur })} /></Field>
          <Field label="X"><Num value={value.x} min={-60} max={60} onChange={(x) => onChange({ ...value, x })} /></Field>
          <Field label="Y"><Num value={value.y} min={-60} max={60} onChange={(y) => onChange({ ...value, y })} /></Field>
        </div>
      )}
    </div>
  );
}

/** A picture source: a link, a variable such as {user.avatar}, or one of the pictures uploaded for the server. */
function SourceField({ value, onChange, assets, onUpload, uploading }: { value: string; onChange: (v: string) => void; assets: AssetInfo[]; onUpload: (file: File) => Promise<string | null>; uploading: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="crd-source">
      <input type="text" placeholder={t('https://... or {user.avatar}')} value={value} onChange={(e) => onChange(e.target.value)} />
      <div className="crd-source-row">
        <select value={value.startsWith('asset:') ? value : ''} onChange={(e) => e.target.value && onChange(e.target.value)}>
          <option value="">{t('Uploaded pictures')}</option>
          {assets.map((a) => <option key={a.id} value={`asset:${a.id}`}>{a.name}</option>)}
        </select>
        <button type="button" className="btn btn-ghost btn-sm" disabled={uploading} onClick={() => fileRef.current?.click()}>{uploading ? t('Uploading...') : t('Upload')}</button>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (!file) return;
          const src = await onUpload(file);
          if (src) onChange(src);
        }} />
        <select value="" onChange={(e) => e.target.value && onChange(e.target.value)}>
          <option value="">{t('Variable')}</option>
          <option value="{user.avatar}">{t('Member avatar')}</option>
          <option value="{server_icon}">{t('Server icon')}</option>
        </select>
      </div>
    </div>
  );
}

export default function CardsApp({ guildId, premiumUrl, initialSelected, userId, userName, userAvatarUrl, serverName, serverIconUrl }: Props) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState(initialSelected);
  const [draft, setDraft] = useState<CardData>(newCard());
  const [dirty, setDirty] = useState(false);
  const [newName, setNewName] = useState('');
  const [newKind, setNewKind] = useState<Kind>('welcome');
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewBusy, setPreviewBusy] = useState(false);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [lockedNote, setLockedNote] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exact, setExact] = useState(false);
  // The layers of the advanced editor while the basic tab is open, so switching tabs does not lose them.
  const stash = useRef<Layer[] | null>(null);

  const premium = overview?.premium ?? false;
  const assets = overview?.assets ?? [];

  const refresh = useCallback(async () => {
    const res = await call(guildId, '');
    if (!res.ok) { setLoadError(true); return null; }
    const body: Overview = await res.json();
    setOverview(body);
    return body;
  }, [guildId]);

  useEffect(() => {
    refresh().then((body) => {
      if (!body) return;
      const first = body.cards.find((c) => c.name === initialSelected) ?? body.cards[0];
      if (first) { setSelected(first.name); setDraft({ ...newCard(first.data.kind ?? 'welcome'), ...first.data }); }
    });
  }, [refresh, initialSelected]);

  // Feedback goes to the dashboard's toast; the app's own corner message is only for a page without it.
  const notify = (text: string, kind: 'ok' | 'error' = 'ok') => { if (!toast(text, kind)) setFlash(text); };

  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(() => setFlash(null), 2800);
    return () => clearTimeout(timer);
  }, [flash]);

  // The preview is the real picture: the bot draws it with the same code that draws the messages.
  // Requests go out one at a time, newest wins, and an old answer never replaces a newer one, so dragging
  // a layer shows the picture catching up in order instead of jumping back and forth.
  const previewSeq = useRef(0);
  const previewBusyRef = useRef(false);
  const previewQueued = useRef<CardData | null>(null);
  const dragging = useRef(false);
  const requestPreview = useCallback(async (data: CardData) => {
    if (previewBusyRef.current) { previewQueued.current = data; return; }
    previewBusyRef.current = true;
    setPreviewBusy(true);
    const seq = ++previewSeq.current;
    try {
      const res = await post(guildId, { action: 'preview', data }, '');
      if (res.ok && seq === previewSeq.current) {
        const url = URL.createObjectURL(await res.blob());
        setPreviewUrl((old) => { if (old) URL.revokeObjectURL(old); return url; });
      }
    } catch { /* The next edit asks again. */ } finally {
      previewBusyRef.current = false;
      setPreviewBusy(false);
      const next = previewQueued.current;
      previewQueued.current = null;
      if (next) void requestPreview(next);
    }
  }, [guildId]);

  // The basic editor has no layers to drag, so the bot draws it. The advanced editor is drawn right here while it is
  // edited, and the bot's own drawing is only asked for when "Exact preview" is on.
  const live = draft.mode === 'advanced' && !exact;
  useEffect(() => {
    if (!selected || live) return;
    const timer = setTimeout(() => { void requestPreview(draft); }, 300);
    return () => clearTimeout(timer);
  }, [draft, selected, requestPreview, live]);

  const drawSeq = useRef(0);
  useEffect(() => {
    if (!live || !canvasRef.current) return;
    const seq = ++drawSeq.current;
    void drawCard(canvasRef.current, draft, {
      context: { userId, userName, serverName, memberCount: 1204 },
      avatarUrl: userAvatarUrl,
      serverIconUrl,
      assetUrl: (id) => `/dash/guild/${guildId}/cards-api?asset=${id}`,
    }, () => seq === drawSeq.current);
  }, [draft, live, selected, userId, userName, serverName, userAvatarUrl, serverIconUrl, guildId]);

  function edit(patch: Partial<CardData>) { setDraft((d) => ({ ...d, ...patch })); setDirty(true); }
  function editBasic(patch: Partial<Basic>) { setDraft((d) => ({ ...d, basic: { ...(d.basic as Basic), ...patch } })); setDirty(true); }
  function editBackground(patch: Partial<Background>) { setDraft((d) => ({ ...d, background: { ...d.background, ...patch } })); setDirty(true); }
  function editLayer(id: string, patch: Partial<Layer>) {
    setDraft((d) => ({ ...d, layers: d.layers.map((l) => (l.id === id ? ({ ...l, ...patch } as Layer) : l)) }));
    setDirty(true);
  }

  async function pick(name: string) {
    if (dirty && !window.confirm(t('You have unsaved changes. Leave without saving?'))) return;
    const row = overview?.cards.find((c) => c.name === name);
    setSelected(name);
    stash.current = null;
    setDraft({ ...newCard(row?.data?.kind ?? 'welcome'), ...(row?.data ?? {}) });
    setDirty(false);
    setActiveLayer(null);
    setPreviewUrl('');
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    const data = newCard(newKind);
    const res = await post(guildId, { action: 'save', name, data });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) { notify(errorText(body.error), 'error'); return; }
    await refresh();
    setSelected(body.name);
    setDraft({ ...newCard(body.card?.kind ?? 'welcome'), ...body.card });
    setDirty(false);
    setNewName('');
  }

  async function handleSave() {
    setSaving(true);
    // A request that fails on the way (no network, a timeout) must not leave the button on "Saving...".
    const res = await post(guildId, { action: 'save', name: selected, data: draft }).catch(() => null);
    if (!res) { setSaving(false); notify(errorText(), 'error'); return false; }
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { notify(errorText(body.error), 'error'); if (body.error === 'premium_required') setLockedNote(true); return false; }
    notify(t('Saved.'));
    setDirty(false);
    setLockedNote(false);
    await refresh();
    return true;
  }

  // The dashboard's bar of unsaved changes (DashGuildLayout) saves the card like the Save button here, or puts back the saved one.
  const saveRef = useRef(handleSave);
  saveRef.current = handleSave;
  const discardRef = useRef(() => {});
  discardRef.current = () => {
    const row = overview?.cards.find((c) => c.name === selected);
    if (row) setDraft({ ...newCard(row.data?.kind ?? 'welcome'), ...row.data });
    stash.current = null;
    setActiveLayer(null);
    setDirty(false);
  };
  useEffect(() => {
    const w = window as unknown as { dglDirty?: (key: string, opts: object) => void; dglClean?: (key: string) => void };
    if (!dirty || !w.dglDirty || !w.dglClean) return;
    w.dglDirty('cards-editor', { save: () => saveRef.current(), discard: () => discardRef.current() });
    return () => w.dglClean?.('cards-editor');
  }, [dirty]);

  async function handleDelete() {
    if (!window.confirm(t('Delete the "{name}" card? Messages that use it are sent without the picture.', { name: selected }))) return;
    const res = await post(guildId, { action: 'delete', name: selected });
    if (!res.ok) { notify(errorText(), 'error'); return; }
    const body = await refresh();
    const next = body?.cards[0];
    setSelected(next?.name ?? '');
    setDraft(next ? { ...newCard(next.data.kind ?? 'welcome'), ...next.data } : newCard());
    setDirty(false);
  }

  async function startAdvanced() {
    if (!premium) { setLockedNote(true); return; }
    if (stash.current?.length) { setDraft({ ...draft, mode: 'advanced', layers: stash.current }); setDirty(true); return; }
    const res = await post(guildId, { action: 'normalize', data: draft });
    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.card) { notify(errorText(), 'error'); return; }
    setDraft({ ...draft, mode: 'advanced', layers: body.card.layers, width: body.card.width, height: body.card.height });
    setDirty(true);
    setActiveLayer(null);
  }

  async function upload(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const res = await call(guildId, `?upload&name=${encodeURIComponent(file.name)}`, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) { notify(errorText(body.error), 'error'); return null; }
      await refresh();
      notify(t('Picture uploaded.'));
      return `asset:${body.asset.id}`;
    } finally { setUploading(false); }
  }

  async function removeAsset(id: string) {
    if (!window.confirm(t('Delete this picture? Cards that use it will draw without it.'))) return;
    const res = await post(guildId, { action: 'delete_asset', id });
    if (res.ok) await refresh();
    else notify(errorText(), 'error');
  }

  const fontOptions = useMemo(() => (overview?.fonts ?? []).map((f) => (
    <option key={f.family} value={f.family} disabled={f.premium && !premium}>{f.family}{f.premium ? (premium ? '' : ' (Premium)') : ''}</option>
  )), [overview, premium]);

  // Dragging a layer on the preview moves it; the numbers on the card are in card pixels, the stage is scaled.
  function startDrag(e: React.PointerEvent, layer: Layer) {
    const stage = stageRef.current;
    if (!stage) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    dragging.current = true;
    setActiveLayer(layer.id);
    const scale = draft.width / stage.getBoundingClientRect().width;
    const origin = { x: e.clientX, y: e.clientY, lx: layer.x, ly: layer.y };
    const move = (ev: PointerEvent) => {
      editLayer(layer.id, { x: Math.round(origin.lx + (ev.clientX - origin.x) * scale), y: Math.round(origin.ly + (ev.clientY - origin.y) * scale) });
    };
    const up = () => { dragging.current = false; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  function moveLayer(id: string, direction: -1 | 1) {
    setDraft((d) => {
      const i = d.layers.findIndex((l) => l.id === id);
      const j = i + direction;
      if (i < 0 || j < 0 || j >= d.layers.length) return d;
      const layers = [...d.layers];
      [layers[i], layers[j]] = [layers[j], layers[i]];
      return { ...d, layers };
    });
    setDirty(true);
  }

  if (loadError) return <p className="ebr-empty-note">{t('Image cards are not available right now.')}</p>;
  if (!overview) return <p className="ebr-empty-note">{t('Loading...')}</p>;

  const isRank = draft.kind === 'rank';
  const basic = draft.basic ?? newCard(draft.kind ?? 'welcome').basic!;
  const presetList = (isRank ? overview.rankPresets : overview.presets) ?? [];
  const variableList = isRank ? RANK_VARIABLE_CHOICES : VARIABLE_CHOICES;
  const layer = draft.layers.find((l) => l.id === activeLayer) ?? null;
  const usedFontPremium = draft.mode === 'basic' && (overview.fonts.find((f) => f.family === basic.font)?.premium ?? false);
  const storageMb = (overview.usage.storageBytes / 1048576).toFixed(1);
  const storageMax = Math.round(overview.limits.storageBytes / 1048576);

  return (
    <div className="ebr-app crd-app">
      {flash && <div className="ebr-flash">{flash}</div>}
      <div className="ebr-layout">
        <aside className="ebr-list">
          {overview.cards.length === 0 && <p className="ebr-empty-note">{t('No cards yet.')}</p>}
          {overview.cards.map((c) => (
            <button key={c.name} type="button" className={`ebr-list-item${c.name === selected ? ' active' : ''}`} onClick={() => pick(c.name)}>{c.name}{c.data.kind === 'rank' ? ' · rank' : ''}{c.data.mode === 'advanced' ? ' ★' : ''}</button>
          ))}
          <div className="ebr-limit-note">{overview.usage.cards}/{overview.limits.cards} {t('cards')}</div>
          {!premium && (
            <div className="ebr-premium-limit">
              <strong>{t('Petto Premium')}</strong>
              <span>{t('Unlock the advanced layer editor, every font and up to {n} cards.', { n: 30 })}</span>
              <a href={premiumUrl}>{t('See Premium')}</a>
            </div>
          )}
          <form className="ebr-create" onSubmit={handleCreate}>
            <select value={newKind} onChange={(e) => setNewKind(e.target.value as Kind)} aria-label={t('Kind of card')}>
              <option value="welcome">{t('Welcome style')}</option>
              <option value="rank">{t('Rank card')}</option>
            </select>
            <input type="text" placeholder={newKind === 'rank' ? 'rank-card' : 'welcome-card'} maxLength={40} value={newName} onChange={(e) => setNewName(e.target.value)} />
            <button type="submit" className="btn btn-ghost btn-sm" disabled={overview.usage.cards >= overview.limits.cards}>{t('+ New')}</button>
          </form>
        </aside>

        {!selected ? (
          <p className="ebr-empty-note">{t('Create a card on the left to get started.')}</p>
        ) : (
          <div className="ebr-editor">
            <div className="ebr-preview-col">
              <div className="ebr-preview-label">{t('Preview')}{previewBusy ? ' ...' : ''}</div>
              <div className="crd-stage" ref={stageRef} style={{ aspectRatio: `${draft.width} / ${draft.height}` }}>
                {live ? <canvas ref={canvasRef} className="crd-canvas" width={draft.width} height={draft.height} /> : previewUrl ? <img src={previewUrl} alt="" draggable={false} /> : <div className="crd-stage-empty">{t('Loading...')}</div>}
                {live && draft.layers.map((l) => {
                  const box = layerBox(l);
                  return (
                    <div key={l.id} className={`crd-handle${l.id === activeLayer ? ' active' : ''}`}
                      style={{ left: `${(box.x / draft.width) * 100}%`, top: `${(box.y / draft.height) * 100}%`, width: `${(box.w / draft.width) * 100}%`, height: `${(box.h / draft.height) * 100}%` }}
                      onPointerDown={(e) => startDrag(e, l)} title={l.id} />
                  );
                })}
              </div>
              {draft.mode === 'advanced' && (
                <label className="ebr-check"><input type="checkbox" checked={exact} onChange={(e) => setExact(e.target.checked)} />{t('Exact preview, drawn by Petto')}</label>
              )}
              <p className="ebr-preview-note">{t('The preview is drawn by Petto with your name and avatar. Variables fill in when the message is sent.')}</p>
              <div className="crd-assets">
                <div className="ebr-preview-label">{t('Uploaded pictures')} <span className="ebr-count">{overview.usage.assets}/{overview.limits.assets} · {storageMb}/{storageMax} MB</span></div>
                {assets.length === 0 && <p className="ebr-empty-note">{t('No pictures uploaded yet. Use Upload next to any picture field.')}</p>}
                <div className="crd-asset-grid">
                  {assets.map((a) => (
                    <div key={a.id} className="crd-asset">
                      <img src={`/dash/guild/${guildId}/cards-api?asset=${a.id}`} alt={a.name} loading="lazy" />
                      <span title={a.name}>{a.name}</span>
                      <button type="button" className="ebr-del" onClick={() => removeAsset(a.id)} aria-label={t('Delete')}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ebr-form-col">
              <div className="crd-mode">
                <button type="button" className={`ebr-tab${draft.mode === 'basic' ? ' active' : ''}`} onClick={() => { if (draft.mode === 'advanced') stash.current = draft.layers; edit({ mode: 'basic' }); }}>{t('Basic')}</button>
                <button type="button" className={`ebr-tab${draft.mode === 'advanced' ? ' active' : ''}`} onClick={() => { if (draft.mode !== 'advanced') void startAdvanced(); }}>{t('Advanced')} {!premium && <span className="crd-badge">Premium</span>}</button>
              </div>
              {lockedNote && !premium && (
                <div className="ebr-premium-limit">
                  <strong>{t('This needs Premium')}</strong>
                  <span>{t('The advanced layer editor and the extra fonts are part of Petto Premium. The basic editor stays free.')}</span>
                  <a href={premiumUrl}>{t('See Premium')}</a>
                </div>
              )}

              <div className="crd-section">
                <h3>{t('Size and background')}</h3>
                <div className="ebr-row-pair">
                  <Field label={t('Width')}><Num value={draft.width} min={400} max={1600} onChange={(width) => edit({ width })} /></Field>
                  <Field label={t('Height')}><Num value={draft.height} min={160} max={900} onChange={(height) => edit({ height })} /></Field>
                </div>
                <Field label={t('Background color')}><Color value={draft.background.color} onChange={(color) => editBackground({ color })} /></Field>
                <label className="ebr-check"><input type="checkbox" checked={Boolean(draft.background.gradient)} onChange={(e) => editBackground({ gradient: e.target.checked ? { from: '#5865f2', to: '#eb459e', angle: 135 } : null })} />{t('Gradient')}</label>
                {draft.background.gradient && (
                  <div className="crd-grid3">
                    <Field label={t('From')}><Color value={draft.background.gradient.from} onChange={(from) => editBackground({ gradient: { ...draft.background.gradient!, from } })} /></Field>
                    <Field label={t('To')}><Color value={draft.background.gradient.to} onChange={(to) => editBackground({ gradient: { ...draft.background.gradient!, to } })} /></Field>
                    <Field label={t('Angle')}><Num value={draft.background.gradient.angle} min={0} max={360} onChange={(angle) => editBackground({ gradient: { ...draft.background.gradient!, angle } })} /></Field>
                  </div>
                )}
                <label className="ebr-check"><input type="checkbox" checked={Boolean(draft.background.image)} onChange={(e) => editBackground({ image: e.target.checked ? { src: '', fit: 'cover', blur: 0 } : null })} />{t('Background picture')}</label>
                {draft.background.image && (
                  <div className="crd-group">
                    <SourceField value={draft.background.image.src} assets={assets} uploading={uploading} onUpload={upload} onChange={(src) => editBackground({ image: { ...draft.background.image!, src } })} />
                    <div className="ebr-row-pair">
                      <Field label={t('Fit')}>
                        <select value={draft.background.image.fit} onChange={(e) => editBackground({ image: { ...draft.background.image!, fit: e.target.value as Fit } })}>
                          <option value="cover">{t('Cover')}</option><option value="contain">{t('Contain')}</option><option value="stretch">{t('Stretch')}</option>
                        </select>
                      </Field>
                      <Field label={t('Blur')}><Num value={draft.background.image.blur} min={0} max={24} onChange={(blur) => editBackground({ image: { ...draft.background.image!, blur } })} /></Field>
                    </div>
                  </div>
                )}
                <label className="ebr-check"><input type="checkbox" checked={Boolean(draft.background.overlay)} onChange={(e) => editBackground({ overlay: e.target.checked ? { color: '#000000', opacity: 0.35 } : null })} />{t('Dark layer over the background')}</label>
                {draft.background.overlay && (
                  <div className="ebr-row-pair">
                    <Field label={t('Color')}><Color value={draft.background.overlay.color} onChange={(color) => editBackground({ overlay: { ...draft.background.overlay!, color } })} /></Field>
                    <Field label={t('Strength')}><Num value={draft.background.overlay.opacity} min={0} max={1} step={0.05} onChange={(opacity) => editBackground({ overlay: { ...draft.background.overlay!, opacity } })} /></Field>
                  </div>
                )}
              </div>

              {draft.mode === 'basic' ? (
                <div className="crd-section">
                  <h3>{t('Layout and text')}</h3>
                  <div className="crd-presets">
                    {presetList.map((p) => (
                      <button key={p} type="button" className={`crd-preset${basic.preset === p ? ' active' : ''}`} onClick={() => editBasic({ preset: p })}>{t(PRESET_LABELS[p] ?? p)}</button>
                    ))}
                  </div>
                  <div className="ebr-field">
                    <div className="ebr-field-head"><label>{t('Variables')}</label></div>
                    <div className="crd-vars">{variableList.map((v) => <code key={v}>{v}</code>)}</div>
                  </div>
                  <label className="ebr-check"><input type="checkbox" checked={basic.showTitle} onChange={(e) => editBasic({ showTitle: e.target.checked })} />{t('Title')}</label>
                  <input type="text" data-ac="vars" maxLength={60} value={basic.title} onChange={(e) => editBasic({ title: e.target.value })} />
                  <label className="ebr-check"><input type="checkbox" checked={basic.showName} onChange={(e) => editBasic({ showName: e.target.checked })} />{t('Name')}</label>
                  <input type="text" data-ac="vars" maxLength={80} value={basic.name} onChange={(e) => editBasic({ name: e.target.value })} />
                  <label className="ebr-check"><input type="checkbox" checked={basic.showSubtitle} onChange={(e) => editBasic({ showSubtitle: e.target.checked })} />{t('Subtitle')}</label>
                  <input type="text" data-ac="vars" maxLength={120} value={basic.subtitle} onChange={(e) => editBasic({ subtitle: e.target.value })} />
                  {isRank && (<>
                    <label className="ebr-check"><input type="checkbox" checked={basic.showExtra !== false} onChange={(e) => editBasic({ showExtra: e.target.checked })} />{t('Rank text')}</label>
                    <input type="text" data-ac="vars" maxLength={40} value={basic.extra ?? ''} onChange={(e) => editBasic({ extra: e.target.value })} />
                  </>)}
                  <div className="ebr-row-pair">
                    <Field label={t('Text color')}><Color value={basic.textColor} onChange={(textColor) => editBasic({ textColor })} /></Field>
                    <Field label={t('Accent color')}><Color value={basic.accent} onChange={(accent) => editBasic({ accent })} /></Field>
                  </div>
                  <div className="ebr-row-pair">
                    <Field label={t('Font')}><select value={basic.font} onChange={(e) => editBasic({ font: e.target.value })}>{fontOptions}</select></Field>
                    <Field label={t('Avatar')}>
                      <select value={basic.showAvatar ? basic.avatarShape : 'none'} onChange={(e) => (e.target.value === 'none' ? editBasic({ showAvatar: false }) : editBasic({ showAvatar: true, avatarShape: e.target.value as Basic['avatarShape'] }))}>
                        <option value="circle">{t('Circle')}</option><option value="rounded">{t('Rounded')}</option><option value="square">{t('Square')}</option><option value="none">{t('Hidden')}</option>
                      </select>
                    </Field>
                  </div>
                  {usedFontPremium && !premium && <p className="ebr-tools-note">{t('This font needs Premium.')}</p>}
                  <div className="crd-upsell">
                    <span>{t('Want full control? The advanced editor lets you place every text, picture and shape.')}</span>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={startAdvanced}>{t('Open the advanced editor')}{!premium ? ' · Premium' : ''}</button>
                  </div>
                </div>
              ) : (
                <div className="crd-section">
                  <h3>{t('Layers')} <span className="ebr-count">{draft.layers.length}/40</span></h3>
                  <div className="crd-add">
                    {(['text', 'image', 'avatar', 'shape', 'bar'] as const).map((type) => (
                      <button key={type} type="button" className="btn btn-ghost btn-sm" disabled={draft.layers.length >= 40} onClick={() => { const next = newLayer(type, draft.width, draft.height); edit({ layers: [...draft.layers, next] }); setActiveLayer(next.id); }}>
                        + {t(type === 'text' ? 'Text' : type === 'image' ? 'Picture' : type === 'avatar' ? 'Avatar' : type === 'bar' ? 'Progress bar' : 'Shape')}
                      </button>
                    ))}
                  </div>
                  <div className="crd-layers">
                    {[...draft.layers].reverse().map((l) => (
                      <div key={l.id} className={`crd-layer${l.id === activeLayer ? ' active' : ''}`} onClick={() => setActiveLayer(l.id)}>
                        <span className="crd-layer-kind">{l.type}</span>
                        <span className="crd-layer-name">{l.type === 'text' ? l.text.slice(0, 28) || '…' : l.type === 'image' ? l.src.slice(0, 28) || '…' : l.id}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); moveLayer(l.id, 1); }} aria-label={t('Bring forward')}>↑</button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); moveLayer(l.id, -1); }} aria-label={t('Send back')}>↓</button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); const copy = { ...l, id: `${l.id}-copy${draft.layers.length}`, x: l.x + 20, y: l.y + 20 } as Layer; edit({ layers: [...draft.layers, copy] }); setActiveLayer(copy.id); }} aria-label={t('Duplicate')}>⧉</button>
                        <button type="button" className="ebr-del" onClick={(e) => { e.stopPropagation(); edit({ layers: draft.layers.filter((x) => x.id !== l.id) }); if (activeLayer === l.id) setActiveLayer(null); }} aria-label={t('Delete')}>×</button>
                      </div>
                    ))}
                  </div>

                  {layer && (
                    <div className="crd-props">
                      <h4>{t('Selected layer')}</h4>
                      <div className="crd-grid3">
                        <Field label="X"><Num value={layer.x} min={-4000} max={4000} onChange={(x) => editLayer(layer.id, { x })} /></Field>
                        <Field label="Y"><Num value={layer.y} min={-4000} max={4000} onChange={(y) => editLayer(layer.id, { y })} /></Field>
                        <Field label={t('Rotation')}><Num value={layer.rotation} min={-360} max={360} onChange={(rotation) => editLayer(layer.id, { rotation })} /></Field>
                      </div>
                      <Field label={t('Opacity')}><input type="range" min={0} max={1} step={0.05} value={layer.opacity} onChange={(e) => editLayer(layer.id, { opacity: Number(e.target.value) })} /></Field>

                      {layer.type === 'text' && (<>
                        <Field label={t('Text')} wide><textarea data-ac="vars" rows={2} maxLength={300} value={layer.text} onChange={(e) => editLayer(layer.id, { text: e.target.value })} /></Field>
                        <div className="crd-vars">{variableList.map((v) => <button key={v} type="button" className="crd-var" onClick={() => editLayer(layer.id, { text: layer.text + v })}>{v}</button>)}</div>
                        <div className="ebr-row-pair">
                          <Field label={t('Font')}><select value={layer.font} onChange={(e) => editLayer(layer.id, { font: e.target.value })}>{fontOptions}</select></Field>
                          <Field label={t('Weight')}>
                            <select value={layer.weight} onChange={(e) => editLayer(layer.id, { weight: Number(e.target.value) })}>
                              <option value={400}>{t('Regular')}</option><option value={700}>{t('Bold')}</option><option value={800}>{t('Extra bold')}</option>
                            </select>
                          </Field>
                        </div>
                        <div className="crd-grid3">
                          <Field label={t('Size')}><Num value={layer.size} min={8} max={400} onChange={(size) => editLayer(layer.id, { size })} /></Field>
                          <Field label={t('Max width')}><Num value={layer.w} min={0} max={4000} onChange={(w) => editLayer(layer.id, { w })} /></Field>
                          <Field label={t('Letter spacing')}><Num value={layer.spacing} min={-5} max={40} onChange={(spacing) => editLayer(layer.id, { spacing })} /></Field>
                        </div>
                        <div className="ebr-row-pair">
                          <Field label={t('Color')}><Color value={layer.color} onChange={(color) => editLayer(layer.id, { color })} /></Field>
                          <Field label={t('Align')}>
                            <select value={layer.align} onChange={(e) => editLayer(layer.id, { align: e.target.value as 'left' | 'center' | 'right' })}>
                              <option value="left">{t('Left')}</option><option value="center">{t('Center')}</option><option value="right">{t('Right')}</option>
                            </select>
                          </Field>
                        </div>
                        <Field label={t('Line height')}><Num value={layer.lineHeight} min={0.8} max={2.5} step={0.05} onChange={(lineHeight) => editLayer(layer.id, { lineHeight })} /></Field>
                        <label className="ebr-check"><input type="checkbox" checked={layer.upper} onChange={(e) => editLayer(layer.id, { upper: e.target.checked })} />{t('Uppercase')}</label>
                        <StrokeEditor label={t('Outline')} value={layer.stroke} onChange={(stroke) => editLayer(layer.id, { stroke })} />
                        <ShadowEditor value={layer.shadow} onChange={(shadow) => editLayer(layer.id, { shadow })} />
                      </>)}

                      {layer.type === 'image' && (<>
                        <SourceField value={layer.src} assets={assets} uploading={uploading} onUpload={upload} onChange={(src) => editLayer(layer.id, { src })} />
                        <div className="crd-grid3">
                          <Field label={t('Width')}><Num value={layer.w} min={4} max={4000} onChange={(w) => editLayer(layer.id, { w })} /></Field>
                          <Field label={t('Height')}><Num value={layer.h} min={4} max={4000} onChange={(h) => editLayer(layer.id, { h })} /></Field>
                          <Field label={t('Corner radius')}><Num value={layer.radius} min={0} max={2000} onChange={(radius) => editLayer(layer.id, { radius })} /></Field>
                        </div>
                        <Field label={t('Fit')}>
                          <select value={layer.fit} onChange={(e) => editLayer(layer.id, { fit: e.target.value as Fit })}>
                            <option value="cover">{t('Cover')}</option><option value="contain">{t('Contain')}</option><option value="stretch">{t('Stretch')}</option>
                          </select>
                        </Field>
                        <ShadowEditor value={layer.shadow} onChange={(shadow) => editLayer(layer.id, { shadow })} />
                      </>)}

                      {layer.type === 'avatar' && (<>
                        <div className="ebr-row-pair">
                          <Field label={t('Picture of')}>
                            <select value={layer.source} onChange={(e) => editLayer(layer.id, { source: e.target.value as 'user' | 'server' })}>
                              <option value="user">{t('The member')}</option><option value="server">{t('The server')}</option>
                            </select>
                          </Field>
                          <Field label={t('Shape')}>
                            <select value={layer.shape} onChange={(e) => editLayer(layer.id, { shape: e.target.value as 'circle' | 'rounded' | 'square' })}>
                              <option value="circle">{t('Circle')}</option><option value="rounded">{t('Rounded')}</option><option value="square">{t('Square')}</option>
                            </select>
                          </Field>
                        </div>
                        <Field label={t('Size')}><Num value={layer.size} min={16} max={1200} onChange={(size) => editLayer(layer.id, { size })} /></Field>
                        <StrokeEditor label={t('Border')} value={layer.border} onChange={(border) => editLayer(layer.id, { border })} />
                        <ShadowEditor value={layer.shadow} onChange={(shadow) => editLayer(layer.id, { shadow })} />
                      </>)}

                      {layer.type === 'bar' && (<>
                        <Field label={t('Value, 0 to 100')}><input type="text" maxLength={40} value={layer.value} onChange={(e) => editLayer(layer.id, { value: e.target.value })} /></Field>
                        <div className="crd-vars">{['{level_progress}', '50', '100'].map((v) => <button key={v} type="button" className="crd-var" onClick={() => editLayer(layer.id, { value: v })}>{v}</button>)}</div>
                        <div className="crd-grid3">
                          <Field label={t('Width')}><Num value={layer.w} min={4} max={4000} onChange={(w) => editLayer(layer.id, { w })} /></Field>
                          <Field label={t('Height')}><Num value={layer.h} min={2} max={500} onChange={(h) => editLayer(layer.id, { h })} /></Field>
                          <Field label={t('Corner radius')}><Num value={layer.radius} min={0} max={2000} onChange={(radius) => editLayer(layer.id, { radius })} /></Field>
                        </div>
                        <div className="ebr-row-pair">
                          <Field label={t('Bar color')}><Color value={layer.fill} onChange={(fill) => editLayer(layer.id, { fill })} /></Field>
                          <Field label={t('Track color')}><Color value={layer.track} onChange={(track) => editLayer(layer.id, { track })} /></Field>
                        </div>
                        <label className="ebr-check"><input type="checkbox" checked={Boolean(layer.fill2)} onChange={(e) => editLayer(layer.id, { fill2: e.target.checked ? '#eb459e' : '' })} />{t('Gradient bar')}</label>
                        {layer.fill2 && <Field label={t('Second color')}><Color value={layer.fill2} onChange={(fill2) => editLayer(layer.id, { fill2 })} /></Field>}
                        <Field label={t('Track opacity')}><input type="range" min={0} max={1} step={0.05} value={layer.trackOpacity} onChange={(e) => editLayer(layer.id, { trackOpacity: Number(e.target.value) })} /></Field>
                        <ShadowEditor value={layer.shadow} onChange={(shadow) => editLayer(layer.id, { shadow })} />
                      </>)}

                      {layer.type === 'shape' && (<>
                        <div className="ebr-row-pair">
                          <Field label={t('Shape')}>
                            <select value={layer.shape} onChange={(e) => editLayer(layer.id, { shape: e.target.value as 'rect' | 'circle' })}>
                              <option value="rect">{t('Rectangle')}</option><option value="circle">{t('Circle')}</option>
                            </select>
                          </Field>
                          <Field label={t('Fill')}><Color value={layer.fill} onChange={(fill) => editLayer(layer.id, { fill })} /></Field>
                        </div>
                        <div className="crd-grid3">
                          <Field label={t('Width')}><Num value={layer.w} min={1} max={4000} onChange={(w) => editLayer(layer.id, { w })} /></Field>
                          <Field label={t('Height')}><Num value={layer.h} min={1} max={4000} onChange={(h) => editLayer(layer.id, { h })} /></Field>
                          <Field label={t('Corner radius')}><Num value={layer.radius} min={0} max={2000} onChange={(radius) => editLayer(layer.id, { radius })} /></Field>
                        </div>
                        <StrokeEditor label={t('Outline')} value={layer.stroke} onChange={(stroke) => editLayer(layer.id, { stroke })} />
                        <ShadowEditor value={layer.shadow} onChange={(shadow) => editLayer(layer.id, { shadow })} />
                      </>)}
                    </div>
                  )}
                </div>
              )}

              <div className="ebr-actions">
                <button type="button" className="btn btn-accent btn-sm" onClick={(ev) => { ev.currentTarget.style.minWidth = `${ev.currentTarget.offsetWidth}px`; handleSave(); }} disabled={saving || !dirty}>{saving ? t('Saving...') : t('Save changes')}</button>
                <button type="button" className="btn btn-ghost btn-sm ebr-delete-btn" onClick={handleDelete}>{t('Delete this card')}</button>
              </div>
              <p className="ebr-tools-note">{t('To use this card, open an embed template and pick it under Image card. Welcome, tickets, giveaways and the other messages use their template.')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
