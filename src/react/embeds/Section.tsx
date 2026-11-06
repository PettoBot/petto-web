import { useEffect, useState, type ReactNode } from 'react';

interface Props {
  title: string;
  /** A small note beside the title (a count, a state). */
  meta?: ReactNode;
  /** Controls at the right of the title (buttons that must not fold the section). */
  actions?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  /** `sub` is a section inside another one (the parts of an embed): lighter. */
  level?: 'main' | 'sub';
}

/**
 * A part of the editor that folds: its body grows and shrinks in height with a soft curve instead of jumping. While it is closed its fields cannot
 * be reached with the keyboard (inert); once it has opened it lets a menu (the color panel) reach outside its box.
 */
export default function Section({ title, meta, actions, defaultOpen = true, children, level = 'main' }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [settled, setSettled] = useState(defaultOpen);
  useEffect(() => {
    if (!open) { setSettled(false); return; }
    const id = window.setTimeout(() => setSettled(true), 480);
    return () => window.clearTimeout(id);
  }, [open]);
  const inert = open ? {} : { inert: '' };
  return (
    <section className={`ebr-sec ebr-sec-${level}`} data-open={open} data-settled={settled}>
      <div className="ebr-sec-head">
        <button type="button" className="ebr-sec-toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className="ebr-sec-title">{title}</span>
          {meta !== undefined && meta !== null && <span className="ebr-sec-meta">{meta}</span>}
          <svg className="ebr-sec-caret" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
        {actions && <div className="ebr-sec-actions">{actions}</div>}
      </div>
      <div className="ebr-sec-body" {...inert}>
        <div className="ebr-sec-inner">{children}</div>
      </div>
    </section>
  );
}
