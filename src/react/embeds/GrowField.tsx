import { forwardRef, useEffect, useRef } from 'react';

interface Props extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  /** A one-line value (a title, a link, a name): Enter does nothing and a long one wraps instead of scrolling sideways. */
  single?: boolean;
  /** Shows how much of the limit is used, under the field. */
  counter?: boolean;
}

/**
 * A text box that is as tall as the text in it: it grows while you type, when a template loads,
 * or when its section expands, and shrinks when you delete.
 */
const GrowField = forwardRef<HTMLTextAreaElement, Props>(function GrowField({ value, onChange, single = false, counter = false, className = '', onKeyDown, rows, maxLength, ...rest }, ref) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);
  const assignRef = (node: HTMLTextAreaElement | null) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const fit = () => {
      if (el.offsetWidth === 0) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight + 2}px`;
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    let lastW = el.offsetWidth;
    const ro = new ResizeObserver(() => {
      if (el.offsetWidth !== lastW) {
        lastW = el.offsetWidth;
        fit();
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [value, single]);

  return (
    <div className="ebr-grow-wrap">
      <textarea
        ref={assignRef}
        rows={single ? 1 : rows ?? 3}
        maxLength={maxLength}
        {...rest}
        className={`dgl-autogrow ebr-grow${single ? ' ebr-grow-1' : ''}${className ? ` ${className}` : ''}`}
        value={value}
        onChange={(ev) => onChange(single ? ev.target.value.replace(/[\r\n]+/g, ' ') : ev.target.value)}
        onKeyDown={(ev) => { if (single && ev.key === 'Enter') ev.preventDefault(); onKeyDown?.(ev); }}
      />
      {counter && maxLength ? <span className={`ebr-counter${value.length > maxLength * 0.9 ? ' near' : ''}`}>{value.length} / {maxLength}</span> : null}
    </div>
  );
});

export default GrowField;
