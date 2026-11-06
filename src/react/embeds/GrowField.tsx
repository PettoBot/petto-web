import { forwardRef } from 'react';

interface Props extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  /** A one-line value (a title, a link, a name): Enter does nothing and a long one wraps instead of scrolling sideways. */
  single?: boolean;
  /** Shows how much of the limit is used, under the field. */
  counter?: boolean;
}

/**
 * A text box that is as tall as the text in it: it grows while you type and shrinks when you delete (CSS field-sizing; the dashboard's
 * script does the same in browsers without it, see DashMotion). A one-line value uses it too, so a long title or link is never cut off.
 */
const GrowField = forwardRef<HTMLTextAreaElement, Props>(function GrowField({ value, onChange, single = false, counter = false, className = '', onKeyDown, rows, maxLength, ...rest }, ref) {
  return (
    <div className="ebr-grow-wrap">
      <textarea
        ref={ref}
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
