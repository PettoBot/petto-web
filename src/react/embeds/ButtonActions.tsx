import { MAX_BUTTON_ACTIONS, emptyAction } from './types';
import type { ButtonAction } from './types';
import { t } from './t';

const ACTION_TYPES: [ButtonAction['type'], string][] = [['role', 'Toggle a role'], ['addrole', 'Give a role'], ['removerole', 'Take a role'], ['embed', 'Show a saved embed']];

/**
 * The actions of a button, one row each: what it does (toggle, give or take a role, show a saved embed), the role or the embed and, for an
 * embed, where it is shown. Both editors use it (the classic one and the Components V2 one). Without actions the button is a link again.
 */
export default function ButtonActions({ actions, names, onChange }: { actions: ButtonAction[]; names: string[]; onChange: (actions: ButtonAction[]) => void }) {
  const update = (index: number, patch: Partial<ButtonAction>) => onChange(actions.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  return (
    <div className="ebr-btn-actions">
      {actions.map((action, ai) => (
        <div key={ai} className="ebr-btn-edit">
          <select value={action.type} onChange={(ev) => update(ai, { type: ev.target.value as ButtonAction['type'], ref: '', mode: ev.target.value === 'embed' ? 'ephemeral' : undefined })} aria-label={t('Action')}>
            {ACTION_TYPES.map(([type, label]) => <option key={type} value={type}>{t(label)}</option>)}
          </select>
          {action.type === 'embed' ? (
            <>
              <select value={action.ref} onChange={(ev) => update(ai, { ref: ev.target.value })} aria-label={t('Saved embed')}>
                <option value="">{t('Choose a saved embed')}</option>
                {names.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <select value={action.mode ?? 'ephemeral'} onChange={(ev) => update(ai, { mode: ev.target.value as ButtonAction['mode'] })} aria-label={t('Where it is shown')}>
                <option value="ephemeral">{t('Only to who clicked')}</option>
                <option value="public">{t('In the channel')}</option>
                <option value="dm">{t('In their DMs')}</option>
              </select>
            </>
          ) : (
            <input type="text" placeholder={t('Role name or ID')} maxLength={100} value={action.ref} onChange={(ev) => update(ai, { ref: ev.target.value })} />
          )}
          <button type="button" className="ebr-del" onClick={() => onChange(actions.filter((_, i) => i !== ai))}>×</button>
        </div>
      ))}
      {actions.length < MAX_BUTTON_ACTIONS && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange([...actions, emptyAction()])}>{t('+ Action')}</button>}
    </div>
  );
}
