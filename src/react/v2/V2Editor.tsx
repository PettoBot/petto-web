import { useRef } from 'react';
import FormatToolbar from '../embeds/FormatToolbar';
import EmbedColorPicker from '../embeds/EmbedColorPicker';
import { countV2, V2_LIMITS } from '../embeds/types';
import type { V2Doc, V2Node, V2Child, V2Button, V2Section, V2Gallery, V2Row, V2Text, V2Container } from '../embeds/types';
import { t } from '../embeds/t';

interface DocProps { doc: V2Doc; onChange: (doc: V2Doc) => void }

const newText = (): V2Text => ({ type: 10, content: '' });
const newSeparator = (): V2Child => ({ type: 14, divider: true, spacing: 1 });
const newGallery = (): V2Gallery => ({ type: 12, items: [{ media: { url: '' } }] });
const newButton = (): V2Button => ({ type: 2, style: 5, label: '', url: '' });
const newRow = (): V2Row => ({ type: 1, components: [newButton()] });
const newSection = (): V2Section => ({ type: 9, components: [newText()] });
const newContainer = (): V2Container => ({ type: 17, accent_color: 0x8399ff, components: [newText()] });

const KIND_LABEL: Record<number, string> = { 17: 'Container', 10: 'Text', 14: 'Divider', 12: 'Pictures', 9: 'Section', 1: 'Buttons' };

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function TextBox({ value, onChange, rows = 4, max = V2_LIMITS.text }: { value: string; onChange: (value: string) => void; rows?: number; max?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="v2e-textbox">
      <textarea ref={ref} rows={rows} maxLength={max} value={value} onChange={(ev) => onChange(ev.target.value)} />
      <FormatToolbar targetRef={ref} onChange={onChange} />
    </div>
  );
}

function ButtonEditor({ button, onChange, onRemove }: { button: V2Button; onChange: (button: V2Button) => void; onRemove?: () => void }) {
  return (
    <div className="ebr-btn-edit">
      <input type="text" placeholder={t('Label')} maxLength={V2_LIMITS.buttonLabel} value={button.label} onChange={(ev) => onChange({ ...button, label: ev.target.value })} />
      <input type="text" placeholder="https://..." value={button.url} onChange={(ev) => onChange({ ...button, url: ev.target.value })} />
      <input type="text" placeholder={t('Emoji')} maxLength={4} className="ebr-btn-emoji" value={button.emoji?.id ? '' : (button.emoji?.name ?? '')} onChange={(ev) => onChange({ ...button, emoji: ev.target.value ? { name: ev.target.value } : undefined })} />
      {onRemove && <button type="button" className="ebr-del" onClick={onRemove}>×</button>}
    </div>
  );
}

function NodeBody({ node, onChange }: { node: V2Node; onChange: (node: V2Node) => void }) {
  switch (node.type) {
    case 10:
      return <TextBox value={node.content} onChange={(content) => onChange({ ...node, content })} />;
    case 14:
      return (
        <div className="v2e-inline">
          <label className="ebr-check"><input type="checkbox" checked={node.divider} onChange={(ev) => onChange({ ...node, divider: ev.target.checked })} />{t('Show a line')}</label>
          <select value={node.spacing} onChange={(ev) => onChange({ ...node, spacing: Number(ev.target.value) === 2 ? 2 : 1 })}>
            <option value={1}>{t('Small space')}</option>
            <option value={2}>{t('Large space')}</option>
          </select>
        </div>
      );
    case 12:
      return (
        <div className="v2e-stack">
          {node.items.map((item, i) => (
            <div key={i} className="ebr-btn-edit">
              <input type="text" placeholder="https://... or {quest.image}" value={item.media.url} onChange={(ev) => onChange({ ...node, items: node.items.map((x, j) => (j === i ? { ...x, media: { url: ev.target.value } } : x)) })} />
              <input type="text" placeholder={t('Description')} maxLength={V2_LIMITS.description} value={item.description ?? ''} onChange={(ev) => onChange({ ...node, items: node.items.map((x, j) => (j === i ? { ...x, description: ev.target.value } : x)) })} />
              <button type="button" className="ebr-del" onClick={() => onChange({ ...node, items: node.items.filter((_, j) => j !== i) })}>×</button>
            </div>
          ))}
          {node.items.length < V2_LIMITS.galleryItems && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange({ ...node, items: [...node.items, { media: { url: '' } }] })}>{t('+ Picture')}</button>}
        </div>
      );
    case 1:
      return (
        <div className="v2e-stack">
          {node.components.map((button, i) => <ButtonEditor key={i} button={button} onChange={(next) => onChange({ ...node, components: node.components.map((x, j) => (j === i ? next : x)) })} onRemove={() => onChange({ ...node, components: node.components.filter((_, j) => j !== i) })} />)}
          {node.components.length < V2_LIMITS.rowButtons && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange({ ...node, components: [...node.components, newButton()] })}>{t('+ Button')}</button>}
          <p className="v2e-note">{t('Buttons are links. A button with no label or no link is left out.')}</p>
        </div>
      );
    case 9: {
      const accessoryKind = node.accessory?.type === 11 ? 'thumbnail' : node.accessory?.type === 2 ? 'button' : 'none';
      return (
        <div className="v2e-stack">
          {node.components.map((text, i) => (
            <div key={i} className="v2e-section-text">
              <TextBox value={text.content} rows={3} onChange={(content) => onChange({ ...node, components: node.components.map((x, j) => (j === i ? { ...x, content } : x)) })} />
              {node.components.length > 1 && <button type="button" className="ebr-del" onClick={() => onChange({ ...node, components: node.components.filter((_, j) => j !== i) })}>×</button>}
            </div>
          ))}
          {node.components.length < V2_LIMITS.sectionTexts && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange({ ...node, components: [...node.components, newText()] })}>{t('+ Text')}</button>}
          <div className="v2e-inline">
            <label>{t('Next to the text')}</label>
            <select value={accessoryKind} onChange={(ev) => {
              const next = { ...node };
              if (ev.target.value === 'thumbnail') next.accessory = { type: 11, media: { url: '' } };
              else if (ev.target.value === 'button') next.accessory = newButton();
              else delete next.accessory;
              onChange(next);
            }}>
              <option value="none">{t('Nothing')}</option>
              <option value="thumbnail">{t('A small picture')}</option>
              <option value="button">{t('A link button')}</option>
            </select>
          </div>
          {node.accessory?.type === 11 && <input type="text" placeholder="https://... or {quest.reward_image}" value={node.accessory.media.url} onChange={(ev) => onChange({ ...node, accessory: { type: 11, media: { url: ev.target.value } } })} />}
          {node.accessory?.type === 2 && <ButtonEditor button={node.accessory} onChange={(button) => onChange({ ...node, accessory: button })} />}
          <p className="v2e-note">{t('A section without its picture or button is sent as plain text.')}</p>
        </div>
      );
    }
    default:
      return null;
  }
}

function AddBar({ allowContainer, onAdd }: { allowContainer: boolean; onAdd: (node: V2Node) => void }) {
  return (
    <div className="v2e-add">
      {allowContainer && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onAdd(newContainer())}>{t('+ Container')}</button>}
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => onAdd(newText())}>{t('+ Text')}</button>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => onAdd(newGallery())}>{t('+ Pictures')}</button>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => onAdd(newSection())}>{t('+ Section')}</button>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => onAdd(newSeparator() as V2Node)}>{t('+ Divider')}</button>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => onAdd(newRow())}>{t('+ Buttons')}</button>
    </div>
  );
}

function NodeList({ nodes, onChange, allowContainer }: { nodes: V2Node[]; onChange: (nodes: V2Node[]) => void; allowContainer: boolean }) {
  return (
    <div className="v2e-list">
      {nodes.map((node, i) => (
        <div key={i} className={`v2e-node kind-${node.type}`}>
          <div className="v2e-node-head">
            <strong>{t(KIND_LABEL[node.type] ?? 'Component')}</strong>
            <span className="v2e-node-tools">
              <button type="button" title={t('Move up')} disabled={i === 0} onClick={() => onChange(move(nodes, i, i - 1))}>↑</button>
              <button type="button" title={t('Move down')} disabled={i === nodes.length - 1} onClick={() => onChange(move(nodes, i, i + 1))}>↓</button>
              <button type="button" title={t('Remove')} className="ebr-del" onClick={() => onChange(nodes.filter((_, j) => j !== i))}>×</button>
            </span>
          </div>
          {node.type === 17 ? (
            <div className="v2e-container">
              <div className="v2e-inline">
                <label>{t('Color')}</label>
                <EmbedColorPicker value={node.accent_color} onChange={(color) => onChange(nodes.map((x, j) => (j === i ? { ...node, accent_color: color } : x)))} />
                <label className="ebr-check"><input type="checkbox" checked={Boolean(node.spoiler)} onChange={(ev) => onChange(nodes.map((x, j) => (j === i ? { ...node, spoiler: ev.target.checked } : x)))} />{t('Spoiler')}</label>
              </div>
              <NodeList nodes={node.components} allowContainer={false} onChange={(children) => onChange(nodes.map((x, j) => (j === i ? { ...node, components: children as V2Child[] } : x)))} />
            </div>
          ) : (
            <NodeBody node={node} onChange={(next) => onChange(nodes.map((x, j) => (j === i ? next : x)))} />
          )}
        </div>
      ))}
      <AddBar allowContainer={allowContainer} onAdd={(node) => onChange([...nodes, node])} />
    </div>
  );
}

/** The editor of a Components V2 message: containers with text, pictures, sections, dividers and rows of link buttons. */
export default function V2Editor({ doc, onChange }: DocProps) {
  const counts = countV2(doc);
  const over = counts.components > V2_LIMITS.components || counts.chars > V2_LIMITS.text;
  return (
    <div className="v2e">
      <div className={`v2e-counter${over ? ' over' : ''}`}>
        {t('{a} of {b} components', { a: counts.components, b: V2_LIMITS.components })} · {t('{a} of {b} characters', { a: counts.chars, b: V2_LIMITS.text })}
        {over && <span> · {t('Over the limit: the last parts are cut when it is saved.')}</span>}
      </div>
      <NodeList nodes={doc.components} allowContainer onChange={(components) => onChange({ components })} />
    </div>
  );
}
