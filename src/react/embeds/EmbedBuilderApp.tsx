import { useEffect, useRef, useState } from 'react';
import './embeds.css';
import FormatToolbar from './FormatToolbar';
import Preview from './Preview';
import VariablesPanel from './VariablesPanel';
import { type EmbedData, type LinkButton, type TemplateData, emptyEmbed, emptyButton, emptyTemplate, normalizeTemplateData } from './types';

interface Props {
  guildId: string;
  botName: string;
  botIcon: string;
  initialTemplateNames: string[];
  initialSelected: string;
}

async function api(guildId: string, path: string, init?: RequestInit) {
  const res = await fetch(`/dash/guild/${guildId}/embeds-api${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  return res;
}

export default function EmbedBuilderApp({ guildId, botName, botIcon, initialTemplateNames, initialSelected }: Props) {
  const [names, setNames] = useState(initialTemplateNames);
  const [selected, setSelected] = useState(initialSelected);
  const [data, setData] = useState<TemplateData>(emptyTemplate());
  const [activeEmbed, setActiveEmbed] = useState(0);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!selected) { setData(emptyTemplate()); return; }
    setLoading(true);
    api(guildId, `?name=${encodeURIComponent(selected)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((row) => { if (row) setData(normalizeTemplateData(row.data)); setDirty(false); })
      .finally(() => setLoading(false));
  }, [selected, guildId]);

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
    const res = await api(guildId, '', { method: 'POST', body: JSON.stringify({ action: 'create', name: newName.trim() }) });
    const body = await res.json();
    if (!res.ok) { setFlash(body.error ?? "Couldn't create that template."); return; }
    setNames((n) => [...n, body.name].sort());
    setSelected(body.name);
    setNewName('');
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    const res = await api(guildId, '', { method: 'POST', body: JSON.stringify({ action: 'save', name: selected, data }) });
    setSaving(false);
    setFlash(res.ok ? 'Saved.' : "Couldn't save, try again.");
    if (res.ok) setDirty(false);
  }

  async function handleDelete() {
    if (!selected) return;
    if (!window.confirm(`Delete the "${selected}" template? This can't be undone.`)) return;
    const res = await api(guildId, '', { method: 'POST', body: JSON.stringify({ action: 'delete', name: selected }) });
    if (!res.ok) { setFlash("Couldn't delete that template."); return; }
    setNames((n) => n.filter((x) => x !== selected));
    setSelected('');
  }

  function addEmbed() {
    if (data.embeds.length >= 10) return;
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

      <div className="ebr-layout">
        <aside className="ebr-list">
          {names.length === 0 && <p className="ebr-empty-note">No templates yet.</p>}
          {names.map((n) => (
            <button key={n} type="button" className={`ebr-list-item${n === selected ? ' active' : ''}`} onClick={() => setSelected(n)}>
              {n}
            </button>
          ))}
          <form className="ebr-create" onSubmit={handleCreate}>
            <input type="text" placeholder="new-template-name" maxLength={40} value={newName} onChange={(e) => setNewName(e.target.value)} />
            <button type="submit" className="btn btn-ghost btn-sm">+ New</button>
          </form>
        </aside>

        {!selected ? (
          <p className="ebr-empty-note">Create a template on the left to get started.</p>
        ) : loading ? (
          <p className="ebr-empty-note">Loading...</p>
        ) : (
          <div className="ebr-editor">
            <div className="ebr-preview-col">
              <div className="ebr-preview-label">Preview</div>
              <Preview data={data} botName={botName} botIcon={botIcon} />
            </div>

            <div className="ebr-form-col">
              <VariablesPanel />
              <div className="ebr-field">
                <div className="ebr-field-head"><label>Message content</label></div>
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
                {data.embeds.length < 10 && <button type="button" className="ebr-tab-add" onClick={addEmbed}>+ Add embed</button>}
              </div>

              {e && (
                <div className="ebr-embed-form">
                  <div className="ebr-field">
                    <label>Title</label>
                    <input ref={titleRef} type="text" maxLength={256} value={e.title} onChange={(ev) => updateEmbed(activeEmbed, { title: ev.target.value })} />
                    <FormatToolbar targetRef={titleRef} onChange={(v) => updateEmbed(activeEmbed, { title: v })} />
                  </div>
                  <div className="ebr-field">
                    <label>Description</label>
                    <textarea ref={descRef} rows={4} maxLength={4096} value={e.description} onChange={(ev) => updateEmbed(activeEmbed, { description: ev.target.value })} />
                    <FormatToolbar targetRef={descRef} onChange={(v) => updateEmbed(activeEmbed, { description: v })} />
                  </div>
                  <div className="ebr-row-pair">
                    <div className="ebr-field">
                      <label>Color</label>
                      <input type="color" value={e.color != null ? `#${e.color.toString(16).padStart(6, '0')}` : '#8399ff'} onChange={(ev) => updateEmbed(activeEmbed, { color: parseInt(ev.target.value.slice(1), 16) })} />
                    </div>
                    <div className="ebr-field">
                      <label>Title link URL</label>
                      <input type="text" value={e.url} onChange={(ev) => updateEmbed(activeEmbed, { url: ev.target.value })} placeholder="https://..." />
                    </div>
                  </div>
                  <div className="ebr-row-pair">
                    <div className="ebr-field"><label>Thumbnail URL</label><input type="text" value={e.thumbnail} onChange={(ev) => updateEmbed(activeEmbed, { thumbnail: ev.target.value })} placeholder="https://..." /></div>
                    <div className="ebr-field"><label>Image URL</label><input type="text" value={e.image} onChange={(ev) => updateEmbed(activeEmbed, { image: ev.target.value })} placeholder="https://..." /></div>
                  </div>
                  <div className="ebr-row-pair">
                    <div className="ebr-field"><label>Author name</label><input type="text" value={e.author.name} onChange={(ev) => updateEmbed(activeEmbed, { author: { ...e.author, name: ev.target.value } })} /></div>
                    <div className="ebr-field"><label>Author icon URL</label><input type="text" value={e.author.icon ?? ''} onChange={(ev) => updateEmbed(activeEmbed, { author: { ...e.author, icon: ev.target.value } })} placeholder="https://..." /></div>
                  </div>
                  <div className="ebr-row-pair">
                    <div className="ebr-field"><label>Footer text</label><input type="text" value={e.footer.text} onChange={(ev) => updateEmbed(activeEmbed, { footer: { ...e.footer, text: ev.target.value } })} /></div>
                    <div className="ebr-field"><label>Footer icon URL</label><input type="text" value={e.footer.icon ?? ''} onChange={(ev) => updateEmbed(activeEmbed, { footer: { ...e.footer, icon: ev.target.value } })} placeholder="https://..." /></div>
                  </div>
                  <label className="ebr-check"><input type="checkbox" checked={e.timestamp} onChange={(ev) => updateEmbed(activeEmbed, { timestamp: ev.target.checked })} />Show current time in the footer</label>

                  <div className="ebr-fields-section">
                    <h3>Fields <span className="ebr-count">{e.fields.length}/25</span></h3>
                    {e.fields.map((f, fi) => (
                      <div key={fi} className="ebr-field-row-edit">
                        <input type="text" placeholder="Name" maxLength={256} value={f.name} onChange={(ev) => updateEmbed(activeEmbed, { fields: e.fields.map((x, i) => (i === fi ? { ...x, name: ev.target.value } : x)) })} />
                        <input type="text" placeholder="Value" maxLength={1024} value={f.value} onChange={(ev) => updateEmbed(activeEmbed, { fields: e.fields.map((x, i) => (i === fi ? { ...x, value: ev.target.value } : x)) })} />
                        <label className="ebr-check"><input type="checkbox" checked={f.inline} onChange={(ev) => updateEmbed(activeEmbed, { fields: e.fields.map((x, i) => (i === fi ? { ...x, inline: ev.target.checked } : x)) })} />Inline</label>
                        <button type="button" className="ebr-del" onClick={() => updateEmbed(activeEmbed, { fields: e.fields.filter((_, i) => i !== fi) })}>×</button>
                      </div>
                    ))}
                    {e.fields.length < 25 && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => updateEmbed(activeEmbed, { fields: [...e.fields, { name: '', value: '', inline: false }] })}>+ Add field</button>
                    )}
                  </div>
                </div>
              )}

              <div className="ebr-fields-section">
                <h3>Link buttons</h3>
                {data.buttons.map((row, ri) => (
                  <div key={ri} className="ebr-btn-row-edit">
                    {row.map((b, bi) => (
                      <div key={bi} className="ebr-btn-edit">
                        <input type="text" placeholder="Label" maxLength={80} value={b.label} onChange={(ev) => updateButton(ri, bi, { label: ev.target.value })} />
                        <input type="text" placeholder="https://..." value={b.url} onChange={(ev) => updateButton(ri, bi, { url: ev.target.value })} />
                        <input type="text" placeholder="Emoji" maxLength={4} className="ebr-btn-emoji" value={b.emoji} onChange={(ev) => updateButton(ri, bi, { emoji: ev.target.value })} />
                        <button type="button" className="ebr-del" onClick={() => removeButton(ri, bi)}>×</button>
                      </div>
                    ))}
                    {row.length < 5 && <button type="button" className="btn btn-ghost btn-sm" onClick={() => addButton(ri)}>+ Button</button>}
                  </div>
                ))}
                {data.buttons.length < 5 && <button type="button" className="btn btn-ghost btn-sm" onClick={addButtonRow}>+ Add button row</button>}
              </div>

              <div className="ebr-actions">
                <button type="button" className="btn btn-accent btn-sm" onClick={handleSave} disabled={saving || !dirty}>{saving ? 'Saving...' : 'Save changes'}</button>
                <button type="button" className="btn btn-ghost btn-sm ebr-delete-btn" onClick={handleDelete}>Delete this template</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
