import { useState } from 'react';
import { VARIABLE_GROUPS } from './variables';
import { t } from './t';

/** Static, always-in-flow reference of every {variable} token, one per builder (not one per
 * field) so there's nothing to position, click a row to copy it, then paste it into whichever
 * field needs it. */
interface Props { groups?: { label: string; vars: { tok: string; desc: string }[] }[] | null }

export default function VariablesPanel({ groups }: Props) {
  const shown = groups && groups.length > 0 ? groups : VARIABLE_GROUPS;
  const [copied, setCopied] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  function copy(tok: string) {
    navigator.clipboard?.writeText(tok).then(() => {
      setCopied(tok);
      setTimeout(() => setCopied((c) => (c === tok ? null : c)), 1200);
    }).catch(() => {});
  }

  return (
    <div className="ebr-varpanel">
      <button type="button" className="ebr-varpanel-toggle" onClick={() => setOpen((v) => !v)}>
        Variables
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: open ? 'rotate(180deg)' : undefined }}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="ebr-varpanel-body">
          <p className="ebr-varpanel-hint">{t('Click one to copy it, then paste it into whichever field needs it.')}</p>
          {shown.map((g) => (
            <div key={g.label}>
              <div className="ebr-varpanel-group">{g.label}</div>
              {g.vars.map((v) => (
                <button key={v.tok} type="button" className={`ebr-varpanel-row${copied === v.tok ? ' copied' : ''}`} onClick={() => copy(v.tok)}>
                  <code>{v.tok}</code>
                  <span>{v.desc}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
