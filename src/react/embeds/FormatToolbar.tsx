interface Props {
  targetRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement>;
  onChange: (value: string) => void;
}

const WRAPS: { label: string; before: string; after: string; title: string }[] = [
  { label: 'B', before: '**', after: '**', title: 'Bold' },
  { label: 'I', before: '*', after: '*', title: 'Italic' },
  { label: 'U', before: '__', after: '__', title: 'Underline' },
  { label: 'S', before: '~~', after: '~~', title: 'Strikethrough' },
  { label: '</>', before: '`', after: '`', title: 'Inline code' },
  { label: '{}', before: '```\n', after: '\n```', title: 'Code block' },
  { label: '||', before: '||', after: '||', title: 'Spoiler' },
  { label: '"', before: '> ', after: '', title: 'Quote' },
];

/** Wraps (or, with no selection, inserts a placeholder wrapped in) the current textarea/input
 * selection with markdown syntax. The {variable} reference lives in its own static
 * VariablesPanel now, not a per-field popup, one less place for positioning bugs to hide. */
export default function FormatToolbar({ targetRef, onChange }: Props) {
  function applyWrap(before: string, after: string) {
    const el = targetRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const value = el.value;
    const selected = value.slice(start, end) || 'text';
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  return (
    <div className="ebr-toolbar">
      {WRAPS.map((w) => (
        <button key={w.label} type="button" title={w.title} onClick={() => applyWrap(w.before, w.after)}>{w.label}</button>
      ))}
    </div>
  );
}
