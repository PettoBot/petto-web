import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../embeds/embeds.css';
import './cards.css';
import { t } from '../embeds/t';
import { toast } from '../embeds/toast';
import { drawCard, withDefaults } from './cardCanvas';
import { buildBasicLayers } from './basicLayers';
import { DashSkeleton, useWait, useRevealWhen } from '../DashSkeleton';
import EmbedColorPicker from '../embeds/EmbedColorPicker';
import DesignGallery, { type DesignInfo } from './DesignGallery';
import { unknownVariables } from '../../utils/variableCheck';
import { findSample, tokenValues, sampleContext } from '../../utils/variableSamples';
import { ask } from '../dglAsk';
import {
  type AssetInfo, type Background, type Basic, type CardData, type Fit, type Layer, type Overview, type Shadow, type Stroke,
  LEVELUP_HEIGHT, LEVELUP_TEXTS, RANK_DEFAULTS, RANK_VARIABLE_CHOICES, VARIABLE_CHOICES, layerBox, newCard, newLayer, type Kind,
} from './cardTypes';

interface Props { guildId: string; premiumUrl: string; initialSelected: string; userId: string; userName: string; userAvatarUrl: string; serverName: string; serverIconUrl: string; decorationUrl?: string; nameplateUrl?: string }

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
  rate_limited: 'Too many changes at once, wait a moment and try again.',
  card_unavailable: 'Petto could not save the card right now, try again in a moment.',
  unauthorized: 'Your session ended. Reload the page to sign in again.',
  bad_request: 'The card could not be read, reload the page and try again.',
};
const errorText = (code?: string) => (code && ERRORS[code] ? t(ERRORS[code]) : t("Couldn't do that, try again."));

const IMAGE_ICON = 'M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16m-60 48a12 12 0 1 1-12 12a12 12 0 0 1 12-12m60 112H40v-39.31l46.34-46.35a8 8 0 0 1 11.32 0L165 181.66a8 8 0 0 0 11.32-11.32l-17.66-17.65L173 138.34a8 8 0 0 1 11.31 0L216 170.07z';
const PLUG_ICON = 'M237.66 77.66L203.31 112l26.35 26.34a8 8 0 0 1-11.32 11.32l-6.34-6.35l-53 53a40 40 0 0 1-56.57 0l-15.68-15.74l-49.09 49.09a8 8 0 0 1-11.32-11.32l49.09-49.09l-15.71-15.71a40 40 0 0 1 0-56.57l53-53l-6.35-6.34a8 8 0 0 1 11.32-11.32L144 52.69l34.34-34.35a8 8 0 1 1 11.32 11.32L155.31 64L192 100.69l34.34-34.35a8 8 0 0 1 11.32 11.32';

const TROPHY_ICON = 'M232 64h-24V48a8 8 0 0 0-8-8H56a8 8 0 0 0-8 8v16H24A16 16 0 0 0 8 80v16a40 40 0 0 0 40 40h3.65A80.13 80.13 0 0 0 120 191.61V216H96a8 8 0 0 0 0 16h64a8 8 0 0 0 0-16h-24v-24.42c31.94-3.23 58.44-25.64 68.08-55.58H208a40 40 0 0 0 40-40V80a16 16 0 0 0-16-16M48 120a24 24 0 0 1-24-24V80h24v32q0 4 .39 8Zm184-24a24 24 0 0 1-24 24h-.5a82 82 0 0 0 .5-8.9V80h24Z';

function Ico({ d, size = 14 }: { d: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d={d} /></svg>;
}

/** A number that counts up the first time it shows, like the tiles of the other pages (and stays still when the person asked for less motion). */
function CountUp({ value }: { value: number }) {
  const [shown, setShown] = useState(0);
  const first = useRef(true);
  useEffect(() => {
    if (!first.current || !(value > 0) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { first.current = false; setShown(value); return; }
    first.current = false;
    let frame = 0;
    let started: number | null = null;
    const step = (time: number) => {
      if (started === null) started = time;
      const progress = Math.min(1, (time - started) / 700);
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{shown.toLocaleString()}</>;
}

/** The numbers of this server's use: cards, pictures and storage against the limits, and the plan. All of it comes from the same overview the page already loads. */
function UsageTiles({ overview, premium, premiumUrl }: { overview: Overview; premium: boolean; premiumUrl: string }) {
  const { usage, limits } = overview;
  const storageUsed = usage.storageBytes / 1048576;
  const storageMax = Math.round(limits.storageBytes / 1048576);
  const tiles: { tone: string; label: string; value: React.ReactNode; of?: string; sub: React.ReactNode }[] = [
    { tone: 'voice', label: t('Image cards'), value: <CountUp value={usage.cards} />, of: `/ ${limits.cards}`, sub: t('{n} left', { n: Math.max(0, limits.cards - usage.cards) }) },
    { tone: 'invites', label: t('Pictures'), value: <CountUp value={usage.assets} />, of: `/ ${limits.assets}`, sub: t('{n} left', { n: Math.max(0, limits.assets - usage.assets) }) },
    { tone: 'reactions', label: t('Storage'), value: storageUsed.toFixed(1), of: `/ ${storageMax} MB`, sub: t('{n} left', { n: `${Math.max(0, storageMax - storageUsed).toFixed(1)} MB` }) },
    { tone: 'messages', label: t('Plan'), value: premium ? t('Premium') : t('Free'), sub: premium ? t('Advanced editor and every font') : <a href={premiumUrl}>{t('See Premium')}</a> },
  ];
  return (
    <div className="crd-tiles">
      {tiles.map((tile, i) => (
        <div key={tile.label} className="crd-tile" style={{ ['--m' as string]: `var(--crd-m-${tile.tone})`, ['--i' as string]: i }}>
          <span className="crd-tile-label"><i />{tile.label}</span>
          <b>{tile.value}{tile.of && <em>{tile.of}</em>}</b>
          <span className="crd-tile-sub">{tile.sub}</span>
        </div>
      ))}
    </div>
  );
}

/** A small box with an icon and a line or two: it takes only the room it needs. */
function EmptyState({ icon, title, hint }: { icon: string; title: string; hint?: string }) {
  return (
    <div className="crd-empty">
      <svg width="26" height="26" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d={icon} /></svg>
      <strong>{title}</strong>
      {hint && <p>{hint}</p>}
    </div>
  );
}

const PRESET_LABELS: Record<string, string> = { classic: 'Classic', side: 'Side', bars: 'Bars', panel: 'Panel', rank: 'Side', rankBottom: 'Bottom bar', levelup: 'Level-up' };

async function call(guildId: string, path: string, init?: RequestInit) {
  const url = `/dash/guild/${guildId}/cards-api${path}`;
  const res = await fetch(url, init);
  // A 401 right when the login is renewed (another request of the page renewed it at the same moment) is not a real logout: try once more.
  if (res.status !== 401 || (typeof ReadableStream !== 'undefined' && init?.body instanceof ReadableStream)) return res;
  await new Promise((resolve) => setTimeout(resolve, 600));
  return fetch(url, init);
}
async function post(guildId: string, body: unknown, path = '') {
  return call(guildId, path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}

/** Says which variables of a text the bot does not know (and the one that was probably meant), instead of leaving a typo to show up in the message. */
function VariableHint({ text }: { text: string }) {
  const unknown = unknownVariables(text);
  if (!unknown.length) return null;
  return (
    <p className="ebr-tools-note crd-var-hint" role="status">
      {unknown.map((item) => (item.suggestion ? t('Unknown variable {x}. Did you mean {y}?', { x: item.token, y: item.suggestion }) : t('Unknown variable {x}.', { x: item.token }))).join(' ')}
    </p>
  );
}

/** The variables a text can use: press one to copy it, and the tooltip shows what it gives in the preview. */
function VariableChips({ list }: { list: string[] }) {
  const values = useMemo(() => tokenValues(sampleContext), []);
  const copy = async (token: string) => {
    try { await navigator.clipboard.writeText(token); toast(t('Copied {x}', { x: token })); } catch { toast(t('Select it and copy it with Ctrl+C.'), 'info'); }
  };
  return (
    <div className="crd-vars">
      {list.map((token) => {
        const sample = findSample(values, token.slice(1, -1))?.text;
        return <button key={token} type="button" className="crd-var" title={sample ? `${token} → ${sample}` : token} onClick={() => void copy(token)}>{token}</button>;
      })}
    </div>
  );
}

function Num({ value, onChange, min, max, step = 1 }: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return <input type="number" value={Number.isFinite(value) ? value : 0} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))} />;
}

/** The site's own color picker (the one of the embed editor) in place of the browser's native color dialog. */
function Color({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const number = /^#[0-9a-f]{6}$/i.test(value) ? parseInt(value.slice(1), 16) : null;
  return (
    <span className="crd-color">
      <EmbedColorPicker value={number} onChange={(next) => onChange(`#${next.toString(16).padStart(6, '0')}`)} />
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

export default function CardsApp({ guildId, premiumUrl, initialSelected, userId, userName, userAvatarUrl, serverName, serverIconUrl, decorationUrl, nameplateUrl }: Props) {
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
  const [previewFailed, setPreviewFailed] = useState(false);
  // What the person previewing has around their profile (decoration, nameplate, tag), as the bot reports it with the preview.
  const [look, setLook] = useState<string[] | null>(null);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [lockedNote, setLockedNote] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  // The canvas is kept in state (not only in a ref): the card is drawn when the canvas appears, whenever that happens (the editor can show up after the data is in).
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
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
        setPreviewFailed(false);
        const seen = res.headers.get('x-card-look');
        setLook(seen ? seen.split(',').filter((word) => word !== 'none') : null);
      } else if (!res.ok && seq === previewSeq.current) {
        setPreviewFailed(true);
      }
    } catch { setPreviewFailed(true); /* The next edit asks again. */ } finally {
      previewBusyRef.current = false;
      setPreviewBusy(false);
      const next = previewQueued.current;
      previewQueued.current = null;
      if (next) void requestPreview(next);
    }
  }, [guildId]);

  // Both editors are drawn right here, in the browser, while they are edited (a basic card with the layers of its layout, src/react/cards/basicLayers.ts), so the
  // picture is there at once. The bot's own drawing, which also shows the decoration of the avatar and the nameplate, is only asked for when "Exact preview" is on.
  const live = !exact;
  const drawn = useMemo<CardData>(() => (draft.mode === 'basic' ? { ...draft, layers: withDefaults(buildBasicLayers(draft.basic ?? {}, draft.width, draft.height, draft.kind === 'rank' ? 'rank' : 'welcome')) } : draft), [draft]);
  useEffect(() => {
    if (!selected || live) return;
    const timer = setTimeout(() => { void requestPreview(draft); }, 300);
    return () => clearTimeout(timer);
  }, [draft, selected, requestPreview, live]);

  const drawSeq = useRef(0);
  // True while a picture or font of the card is still coming, so the preview says so instead of looking empty.
  const [loadingPicture, setLoadingPicture] = useState(false);
  // True once the card of the editor has been drawn the first time: until then the preview shows a soft shimmer, and the picture fades in.
  const [painted, setPainted] = useState(false);
  useEffect(() => { setPainted(false); }, [selected]);
  useEffect(() => {
    if (!live || !canvasEl) return;
    const seq = ++drawSeq.current;
    setLoadingPicture(true);
    void drawCard(canvasEl, drawn, {
      context: { userId, userName, serverName, memberCount: 1204 },
      avatarUrl: userAvatarUrl,
      serverIconUrl,
      decorationUrl,
      nameplateUrl,
      assetUrl: (id) => `/dash/guild/${guildId}/cards-api?asset=${id}`,
      designUrl: (id) => `/dash/guild/${guildId}/cards-api?design=${id}&size=full`,
    }, () => seq === drawSeq.current, (waiting) => { if (seq === drawSeq.current) { setLoadingPicture(waiting); setPainted(true); } });
  }, [drawn, live, canvasEl, selected, userId, userName, serverName, userAvatarUrl, serverIconUrl, decorationUrl, nameplateUrl, guildId]);

  function edit(patch: Partial<CardData>) { setDraft((d) => ({ ...d, ...patch })); setDirty(true); }
  function editBasic(patch: Partial<Basic>) { setDraft((d) => ({ ...d, basic: { ...(d.basic as Basic), ...patch } })); setDirty(true); }
  // The level-up layout is wider than tall and has texts of its own; a card that still has the rank texts and height gets these,
  // and going back to the rank layouts gives the rank ones back, so the fields show what is drawn.
  function pickPreset(preset: string) {
    setDraft((d) => {
      const b = { ...(d.basic as Basic), preset };
      let height = d.height;
      if (d.kind === 'rank') {
        if (preset === 'levelup') {
          if (b.extra === RANK_DEFAULTS.extra) b.extra = LEVELUP_TEXTS.extra;
          if (b.subtitle === RANK_DEFAULTS.subtitle) b.subtitle = LEVELUP_TEXTS.subtitle;
          if (height === 320) height = LEVELUP_HEIGHT;
        } else if ((d.basic as Basic).preset === 'levelup') {
          if (b.extra === LEVELUP_TEXTS.extra) b.extra = RANK_DEFAULTS.extra;
          if (b.subtitle === LEVELUP_TEXTS.subtitle) b.subtitle = RANK_DEFAULTS.subtitle;
          if (height === LEVELUP_HEIGHT) height = 320;
        }
      }
      return { ...d, height, basic: b };
    });
    setDirty(true);
  }
  // A design sets the background picture and, in the basic editor, the colors of the text and the tint of the panel behind it.
  function pickDesign(design: DesignInfo) {
    setDraft((d) => ({
      ...d,
      background: { color: design.color, gradient: null, image: { src: `petto:${design.id}`, fit: 'cover', blur: 0 }, overlay: null },
      ...(d.basic ? { basic: { ...d.basic, textColor: design.textColor, accent: design.accent, panelColor: design.panel, ...(design.panelOpacity ? { panelOpacity: design.panelOpacity } : { panelOpacity: undefined }) } } : {}),
    }));
    setDirty(true);
  }
  function editBackground(patch: Partial<Background>) { setDraft((d) => ({ ...d, background: { ...d.background, ...patch } })); setDirty(true); }
  function editLayer(id: string, patch: Partial<Layer>) {
    setDraft((d) => ({ ...d, layers: d.layers.map((l) => (l.id === id ? ({ ...l, ...patch } as Layer) : l)) }));
    setDirty(true);
  }

  async function pick(name: string) {
    if (dirty && !(await ask(t('You have unsaved changes. Leave without saving?'), { tone: 'neutral', confirm: t('Leave anyway') }))) return;
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
    if (!(await ask(t('Delete the "{name}" card? Messages that use it are sent without the picture.', { name: selected }), { confirm: t('Delete') }))) return;
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
    if (!(await ask(t('Delete this picture? Cards that use it will draw without it.'), { confirm: t('Delete') }))) return;
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

  // The first read waits with grey blocks (only if it takes more than 150 ms) and the app is uncovered from the top down when it arrives.
  const wait = useWait(!overview && !loadError);
  const appRef = useRef<HTMLDivElement>(null);
  useRevealWhen(appRef, Boolean(overview), wait.waited);
  if (loadError) return <div className="ebr-app crd-app"><EmptyState icon={PLUG_ICON} title={t('Image cards are not available right now.')} /></div>;
  if (!overview || wait.skeleton) return wait.skeleton ? <div className="ebr-app crd-app"><DashSkeleton shape="editor" /></div> : null;

  const isRank = draft.kind === 'rank';
  const basic = draft.basic ?? newCard(draft.kind ?? 'welcome').basic!;
  const presetList = (isRank ? overview.rankPresets : overview.presets) ?? [];
  const variableList = isRank ? RANK_VARIABLE_CHOICES : VARIABLE_CHOICES;
  const layer = draft.layers.find((l) => l.id === activeLayer) ?? null;
  const usedFontPremium = draft.mode === 'basic' && (overview.fonts.find((f) => f.family === basic.font)?.premium ?? false);
  const storageMb = (overview.usage.storageBytes / 1048576).toFixed(1);
  const storageMax = Math.round(overview.limits.storageBytes / 1048576);

  return (
    <div className="ebr-app crd-app" ref={appRef}>
      {flash && <div className="ebr-flash">{flash}</div>}
      <UsageTiles overview={overview} premium={premium} premiumUrl={premiumUrl} />
      <div className="ebr-layout">
        <aside className="ebr-list">
          <div className="crd-list-head">
            <h2>{t('Your cards')}</h2>
            <span className="ebr-limit-note">{overview.usage.cards}/{overview.limits.cards} {t('cards')}</span>
          </div>
          {overview.cards.length > 0 && (
            <div className="crd-items">
              {overview.cards.map((c) => (
                <button key={c.name} type="button" className={`ebr-list-item${c.name === selected ? ' active' : ''}`} title={c.name} aria-current={c.name === selected ? 'true' : undefined} onClick={() => pick(c.name)}>
                  <Ico d={c.data.kind === 'rank' ? TROPHY_ICON : IMAGE_ICON} />
                  <span className="crd-item-name">{c.name}</span>
                  {c.data.kind === 'rank' && <span className="crd-item-tag">{t('Rank')}</span>}
                  {c.data.mode === 'advanced' && <span className="crd-item-tag crd-item-adv" title={t('Advanced')}>★</span>}
                </button>
              ))}
            </div>
          )}
          <form className="ebr-create" onSubmit={handleCreate}>
            <h3>{t('New card')}</h3>
            <div className="crd-kinds" role="group" aria-label={t('Kind of card')}>
              <button type="button" aria-pressed={newKind === 'welcome'} className={`crd-kind${newKind === 'welcome' ? ' active' : ''}`} onClick={() => setNewKind('welcome')}>{t('Welcome style')}</button>
              <button type="button" aria-pressed={newKind === 'rank'} className={`crd-kind${newKind === 'rank' ? ' active' : ''}`} onClick={() => setNewKind('rank')}>{t('Rank card')}</button>
            </div>
            <div className="crd-create-row">
              <input type="text" placeholder={newKind === 'rank' ? 'rank-card' : 'welcome-card'} maxLength={40} value={newName} onChange={(e) => setNewName(e.target.value)} aria-label={t('Name')} />
              <button type="submit" className="btn btn-accent btn-sm" disabled={overview.usage.cards >= overview.limits.cards}>{t('+ New')}</button>
            </div>
          </form>
          {!premium && (
            <div className="ebr-premium-limit">
              <strong>{t('Petto Premium')}</strong>
              <span>{t('Unlock the advanced layer editor, every font and up to {n} cards.', { n: 30 })}</span>
              <a href={premiumUrl}>{t('See Premium')}</a>
            </div>
          )}
        </aside>

        {!selected ? (
          <EmptyState icon={IMAGE_ICON} title={t('No cards yet.')} hint={t('Name a card and press + New to make the first one.')} />
        ) : (
          <div className="ebr-editor ebr-fade" key={selected}>
            <div className="ebr-preview-col">
              <div className="ebr-preview-label">{t('Preview')}{previewBusy ? ' ...' : ''}</div>
              <div className="crd-stage" ref={stageRef} style={{ aspectRatio: `${draft.width} / ${draft.height}`, ['--crd-ar' as string]: draft.width / draft.height }}>
                {live ? <canvas ref={setCanvasEl} className={`crd-canvas${painted ? ' is-ready' : ''}`} width={draft.width} height={draft.height} /> : previewUrl ? <img src={previewUrl} alt="" draggable={false} /> : previewFailed ? null : <div className="crd-stage-empty">{t('Loading...')}</div>}
                {live && !painted && <div className="crd-stage-shimmer" aria-hidden="true" />}
                {live && loadingPicture && <div className="crd-stage-loading" role="status"><span className="crd-wheel" aria-hidden="true" />{t('Loading image...')}</div>}
                {!live && previewFailed && (
                  <div className="crd-stage-empty crd-stage-failed">
                    <span>{t('The preview could not be drawn.')}</span>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => void requestPreview(draft)}>{t('Try again')}</button>
                  </div>
                )}
                {live && draft.mode === 'advanced' && draft.layers.map((l) => {
                  const box = layerBox(l);
                  return (
                    <div key={l.id} className={`crd-handle${l.id === activeLayer ? ' active' : ''}`}
                      style={{ left: `${(box.x / draft.width) * 100}%`, top: `${(box.y / draft.height) * 100}%`, width: `${(box.w / draft.width) * 100}%`, height: `${(box.h / draft.height) * 100}%` }}
                      onPointerDown={(e) => startDrag(e, l)} title={l.id} />
                  );
                })}
              </div>
              <label className="ebr-check"><input type="checkbox" checked={exact} onChange={(e) => setExact(e.target.checked)} />{t('Exact preview, drawn by Petto')}</label>
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
                <h3>{t('Designs')}</h3>
                <DesignGallery guildId={guildId} currentSrc={draft.background.image?.src ?? ''} onPick={pickDesign} />
              </div>

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
                      <button key={p} type="button" className={`crd-preset${basic.preset === p ? ' active' : ''}`} onClick={() => pickPreset(p)}>{t(PRESET_LABELS[p] ?? p)}</button>
                    ))}
                  </div>
                  <div className="ebr-field">
                    <div className="ebr-field-head"><label>{t('Variables')}</label></div>
                    <VariableChips list={variableList} />
                  </div>
                  <label className="ebr-check"><input type="checkbox" checked={basic.showTitle} onChange={(e) => editBasic({ showTitle: e.target.checked })} />{t('Title')}</label>
                  <input type="text" data-ac="vars" maxLength={60} value={basic.title} onChange={(e) => editBasic({ title: e.target.value })} />
                  <VariableHint text={basic.title} />
                  <label className="ebr-check"><input type="checkbox" checked={basic.showName} onChange={(e) => editBasic({ showName: e.target.checked })} />{t('Name')}</label>
                  <input type="text" data-ac="vars" maxLength={80} value={basic.name} onChange={(e) => editBasic({ name: e.target.value })} />
                  <VariableHint text={basic.name} />
                  <label className="ebr-check"><input type="checkbox" checked={basic.showSubtitle} onChange={(e) => editBasic({ showSubtitle: e.target.checked })} />{t('Subtitle')}</label>
                  <input type="text" data-ac="vars" maxLength={120} value={basic.subtitle} onChange={(e) => editBasic({ subtitle: e.target.value })} />
                  <VariableHint text={basic.subtitle} />
                  {isRank && (<>
                    <label className="ebr-check"><input type="checkbox" checked={basic.showExtra !== false} onChange={(e) => editBasic({ showExtra: e.target.checked })} />{t('Rank text')}</label>
                    <input type="text" data-ac="vars" maxLength={40} value={basic.extra ?? ''} onChange={(e) => editBasic({ extra: e.target.value })} />
                    <VariableHint text={basic.extra ?? ''} />
                  </>)}
                  {basic.showAvatar !== false && (
                    <div className="crd-group">
                      <label className="ebr-check"><input type="checkbox" checked={basic.showDecoration !== false} onChange={(e) => editBasic({ showDecoration: e.target.checked })} />{t('Avatar decoration')}</label>
                      {basic.showDecoration !== false && (
                        <label className="ebr-check"><input type="checkbox" checked={basic.animateDecoration === true} onChange={(e) => editBasic({ animateDecoration: e.target.checked })} />{t('Moving decoration')}{!premium ? ' · Premium' : ''}</label>
                      )}
                      {isRank && basic.preset === 'levelup' && <label className="ebr-check"><input type="checkbox" checked={basic.showNameplate === true} onChange={(e) => editBasic({ showNameplate: e.target.checked })} />{t('Nameplate')}</label>}
                      <p className="ebr-tools-note">{t('Each one only shows when the member has it on Discord. The preview uses yours. A moving decoration is sent as an animated picture and the preview shows it still.')}</p>
                      {look && (
                        <p className="ebr-tools-note">
                          {t('In the preview you have')}: {t('Avatar decoration')} {look.includes('decoration') ? '✓' : '✗'}{look.includes('moving') ? ` (${t('moving')})` : ''} · {t('Nameplate')} {look.includes('nameplate') ? '✓' : '✗'}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="ebr-row-pair">
                    <Field label={t('Text color')}><Color value={basic.textColor} onChange={(textColor) => editBasic({ textColor })} /></Field>
                    <Field label={t('Accent color')}><Color value={basic.accent} onChange={(accent) => editBasic({ accent })} /></Field>
                  </div>
                  {basic.panelColor && (
                    <div className="ebr-row-pair">
                      <Field label={t('Panel color')}><Color value={basic.panelColor} onChange={(panelColor) => editBasic({ panelColor })} /></Field>
                      <Field label={t('Panel strength')}><Num value={basic.panelOpacity ?? 0.5} min={0} max={0.9} step={0.05} onChange={(panelOpacity) => editBasic({ panelOpacity })} /></Field>
                    </div>
                  )}
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
