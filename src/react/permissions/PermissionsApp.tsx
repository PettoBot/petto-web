import { useMemo, useState } from 'react';
import './permissions-app.css';

// The Permissions page: Petto's levels (groups of roles or members with a level from 0 to 100, and the level each command needs),
// every command grouped by category with what gates it, and a live preview of what a role can use. The groups and levels are saved
// through the same route as before (permissions-api); restrictions and disabled commands are shown as the bot reads them.

interface Member { subjectType: 'user' | 'role'; subjectId: string; }
interface Group { id: number; name: string; level: number; isBase: boolean; members: Member[]; }
interface RoleOpt { id: string; name: string; color: number; permissions: string; isAdmin: boolean; }
interface Cmd {
  name: string; category: string; categoryTitle: string; desc: string; aliases: string[]; slash: boolean;
  permissions: string | null; permissionNames: string[]; level: number; restrictRoles: string[]; disabledServer: boolean; disabledChannels: string[];
}
interface Props {
  guildId: string;
  roles: RoleOpt[];
  everyonePermissions: string;
  initialGroups: Group[];
  commands: Cmd[];
  text: Record<string, string>;
  permissionText: Record<string, string>;
  canEdit: boolean;
}

const ICONS: Record<string, string> = {
  search: 'M232.49 215.51L185 168a92.12 92.12 0 1 0-17 17l47.53 47.54a12 12 0 0 0 17-17ZM44 112a68 68 0 1 1 68 68a68.07 68.07 0 0 1-68-68',
  check: 'M232.49 80.49l-128 128a12 12 0 0 1-17 0l-56-56a12 12 0 1 1 17-17L96 183L215.51 63.51a12 12 0 0 1 17 17Z',
  x: 'M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z',
  plus: 'M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12',
  trash: 'M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M112 168a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm0-120H96v-8a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8Z',
  caret: 'M216.49 104.49l-80 80a12 12 0 0 1-17 0l-80-80a12 12 0 0 1 17-17L128 159l71.51-71.52a12 12 0 0 1 17 17Z',
};
function Ico({ name, size = 14 }: { name: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}><path d={ICONS[name]} /></svg>;
}

const ADMIN = 1n << 3n;
const big = (value: string | null | undefined) => { try { return BigInt(value || '0'); } catch { return 0n; } };
const hex = (color: number) => (color ? `#${color.toString(16).padStart(6, '0')}` : 'var(--text-dim)');

type Verdict = { ok: boolean; reason: string };

export default function PermissionsApp({ guildId, roles, everyonePermissions, initialGroups, commands, text, permissionText, canEdit }: Props) {
  const t = (key: string, vars: Record<string, string | number> = {}) => (text[key] ?? key).replace(/\{(\w+)\}/g, (w, k) => (k in vars ? String(vars[k]) : w));
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [levels, setLevels] = useState<Record<string, number>>(() => Object.fromEntries(commands.map((c) => [c.name, c.level])));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [filter, setFilter] = useState('all');
  const [previewRole, setPreviewRole] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [newGroup, setNewGroup] = useState({ name: '', level: 50 });
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const roleById = useMemo(() => new Map(roles.map((r) => [r.id, r])), [roles]);
  const base = groups.find((g) => g.isBase);
  const levelOptions = useMemo(() => [...new Set([0, ...groups.map((g) => g.level)])].sort((a, b) => a - b), [groups]);

  async function call(action: string, extra: Record<string, unknown>, done?: string) {
    if (!canEdit) return false;
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch(`/dash/guild/${guildId}/permissions-api`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...extra }) });
      const data = await res.json().catch(() => null);
      if (!res.ok) { setNotice({ ok: false, text: t('It could not be saved, try again.') }); return false; }
      if (data?.groups) setGroups(data.groups.map((g: any) => ({ id: g.id, name: g.name, level: g.level, isBase: g.is_base ?? g.isBase, members: (g.members ?? []).map((m: any) => ({ subjectType: m.subject_type ?? m.subjectType, subjectId: m.subject_id ?? m.subjectId })) })));
      if (data?.levels) { const map: Record<string, number> = {}; for (const row of data.levels) map[row.command_name] = row.required_level; setLevels((old) => Object.fromEntries(Object.keys(old).map((k) => [k, map[k] ?? 0]))); }
      if (done) setNotice({ ok: true, text: done });
      return true;
    } catch {
      setNotice({ ok: false, text: t('It could not be saved, try again.') });
      return false;
    } finally {
      setBusy(false);
    }
  }

  // The preview: what the members of one role can use (with @everyone's permissions and level, as Discord and Petto add them up).
  const preview = useMemo(() => {
    if (!previewRole) return null;
    const role = previewRole === 'everyone' ? null : roleById.get(previewRole);
    const bits = big(everyonePermissions) | big(role?.permissions);
    const admin = (bits & ADMIN) === ADMIN;
    let level = base?.level ?? 0;
    for (const g of groups) if (!g.isBase && role && g.members.some((m) => m.subjectType === 'role' && m.subjectId === role.id)) level = Math.max(level, g.level);
    const verdict = (c: Cmd): Verdict => {
      if (c.disabledServer) return { ok: false, reason: t('Disabled in the server') };
      if (admin) return { ok: true, reason: c.disabledChannels.length ? t('Yes, except in {a} channels', { a: c.disabledChannels.length }) : t('Administrator: always') };
      const need = big(c.permissions);
      if (need && (bits & need) !== need) return { ok: false, reason: t('Needs {a} in Discord', { a: c.permissionNames.map((p) => permissionText[p] ?? p).join(', ') }) };
      const required = levels[c.name] ?? 0;
      if (required > level) return { ok: false, reason: t('Needs level {a} (has {b})', { a: required, b: level }) };
      if (c.restrictRoles.length && !(role && c.restrictRoles.includes(role.id))) return { ok: false, reason: t('Only for {a}', { a: c.restrictRoles.map((id) => `@${roleById.get(id)?.name ?? id}`).join(', ') }) };
      return { ok: true, reason: c.disabledChannels.length ? t('Yes, except in {a} channels', { a: c.disabledChannels.length }) : t('Can use it') };
    };
    return { admin, level, verdict };
  }, [previewRole, groups, levels, everyonePermissions, roleById, base]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^[!/]/, '');
    return commands.filter((c) => {
      if (category !== 'all' && c.category !== category) return false;
      if (filter === 'level' && !(levels[c.name] > 0)) return false;
      if (filter === 'restricted' && !c.restrictRoles.length) return false;
      if (filter === 'disabled' && !c.disabledServer && !c.disabledChannels.length) return false;
      if (filter === 'open' && (c.permissionNames.length || levels[c.name] > 0 || c.restrictRoles.length)) return false;
      if (preview && filter === 'can' && !preview.verdict(c).ok) return false;
      if (preview && filter === 'cannot' && preview.verdict(c).ok) return false;
      if (!q) return true;
      return c.name.includes(q) || c.aliases.some((a) => a.includes(q)) || c.desc.toLowerCase().includes(q);
    });
  }, [commands, query, category, filter, levels, preview]);
  const categories = useMemo(() => {
    const map = new Map<string, { title: string; cmds: Cmd[] }>();
    for (const c of commands) if (!map.has(c.category)) map.set(c.category, { title: c.categoryTitle, cmds: [] });
    for (const c of shown) map.get(c.category)!.cmds.push(c);
    return [...map.entries()];
  }, [commands, shown]);
  const allowedCount = preview ? commands.filter((c) => preview.verdict(c).ok).length : 0;

  return (
    <div className="pmx">
      <div className="pmx-steps" aria-label={t('How Petto decides')}>
        {[['1', t('Not disabled'), t('!disablecommand turns a command off in the server or in some channels. Nobody skips it.')],
          ['2', t('Discord permission'), t('Commands that change the server ask for the Discord permission of the action, like Ban Members.')],
          ['3', t('Petto level'), t('A command can need a level from 0 to 100. Members get the level of their groups; everyone has the @everyone level.')],
          ['4', t('Role restriction'), t('!restrictcommand lets only some roles use a command.')]].map(([n, title, body]) => (
          <div className="pmx-step" key={n}><b>{n}</b><div><strong>{title}</strong><span>{body}</span></div></div>
        ))}
        <p className="pmx-bypass">{t('The owner and Administrators skip steps 2 to 4.')}</p>
      </div>

      {notice && <div className={`pmx-notice ${notice.ok ? 'ok' : 'err'}`} role="status">{notice.text}</div>}

      <div className="pmx-card">
        <header className="pmx-card-head"><h2>{t('Level groups')}</h2><span className="pmx-muted">{t('Each group gives its level to its roles and members. The highest one counts.')}</span></header>
        <div className="pmx-groups">
          {[...groups].sort((a, b) => Number(b.isBase) - Number(a.isBase) || b.level - a.level).map((g) => (
            <article className="pmx-group" key={g.id}>
              <div className="pmx-group-top">
                <strong>{g.isBase ? '@everyone' : g.name}</strong>
                <label className="pmx-level">
                  <span>{t('Level')}</span>
                  <input type="number" min={0} max={100} defaultValue={g.level} disabled={!canEdit || busy}
                    onBlur={(e) => { const v = Math.max(0, Math.min(100, Number(e.currentTarget.value) || 0)); if (v !== g.level) call('update_group_level', { groupId: g.id, level: v }, t('Saved.')); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur(); }} />
                </label>
                {!g.isBase && canEdit && <button type="button" className="pmx-icon-btn" aria-label={t('Delete group')} disabled={busy} onClick={() => { if (confirm(t('Delete this group?'))) call('delete_group', { groupId: g.id }, t('Group deleted.')); }}><Ico name="trash" /></button>}
              </div>
              <div className="pmx-bar"><i style={{ width: `${g.level}%` }} /></div>
              {g.isBase ? <p className="pmx-muted">{t('Everybody in the server has this level.')}</p> : (
                <div className="pmx-members">
                  {g.members.length === 0 && <span className="pmx-muted">{t('No roles or members yet.')}</span>}
                  {g.members.map((m) => {
                    const role = m.subjectType === 'role' ? roleById.get(m.subjectId) : null;
                    return (
                      <span className="pmx-chip" key={`${m.subjectType}${m.subjectId}`} style={{ ['--c' as any]: role ? hex(role.color) : 'var(--accent)' }}>
                        <i />{role ? `@${role.name}` : m.subjectType === 'role' ? `@${m.subjectId}` : `${t('Member')} ${m.subjectId}`}
                        {canEdit && <button type="button" aria-label={t('Remove')} disabled={busy} onClick={() => call('remove_member', { groupId: g.id, subjectType: m.subjectType, subjectId: m.subjectId })}><Ico name="x" size={10} /></button>}
                      </span>
                    );
                  })}
                  {canEdit && (
                    <select className="pmx-add" value="" disabled={busy} aria-label={t('Add a role')} onChange={(e) => { const v = e.currentTarget.value; if (!v) return; if (v === '__user') { const id = prompt(t('The ID of the member')) ?? ''; if (/^\d{15,25}$/.test(id.trim())) call('add_member', { groupId: g.id, subjectType: 'user', subjectId: id.trim() }); return; } call('add_member', { groupId: g.id, subjectType: 'role', subjectId: v }); }}>
                      <option value="">{t('+ Add a role')}</option>
                      {roles.filter((r) => !g.members.some((m) => m.subjectId === r.id)).map((r) => <option key={r.id} value={r.id}>@{r.name}</option>)}
                      <option value="__user">{t('A member by ID…')}</option>
                    </select>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
        {canEdit && (
          <form className="pmx-new" onSubmit={(e) => { e.preventDefault(); if (!newGroup.name.trim()) return; call('create_group', { name: newGroup.name.trim(), level: newGroup.level }, t('Group created.')).then((ok) => ok && setNewGroup({ name: '', level: 50 })); }}>
            <input type="text" maxLength={60} placeholder={t('New group, like Moderators')} value={newGroup.name} onChange={(e) => setNewGroup({ ...newGroup, name: e.currentTarget.value })} />
            <input type="number" min={0} max={100} value={newGroup.level} aria-label={t('Level')} onChange={(e) => setNewGroup({ ...newGroup, level: Math.max(0, Math.min(100, Number(e.currentTarget.value) || 0)) })} />
            <button type="submit" className="btn btn-ghost btn-sm" disabled={busy || !newGroup.name.trim()}><Ico name="plus" size={12} />{t('Create group')}</button>
          </form>
        )}
      </div>

      <div className="pmx-card pmx-preview">
        <header className="pmx-card-head"><h2>{t('Who can use what')}</h2><span className="pmx-muted">{t('Pick a role to see, command by command, whether its members can use it and why.')}</span></header>
        <div className="pmx-preview-row">
          <select value={previewRole} onChange={(e) => { setPreviewRole(e.currentTarget.value); if (!e.currentTarget.value && (filter === 'can' || filter === 'cannot')) setFilter('all'); }} aria-label={t('Preview a role')}>
            <option value="">{t('No preview')}</option>
            <option value="everyone">@everyone</option>
            {roles.map((r) => <option key={r.id} value={r.id}>@{r.name}</option>)}
          </select>
          {preview && <span className="pmx-preview-sum"><b>{allowedCount}</b>/{commands.length} {t('commands')} · {preview.admin ? t('Administrator') : t('Level {a}', { a: preview.level })}</span>}
        </div>
      </div>

      <div className="pmx-card">
        <header className="pmx-card-head"><h2>{t('Commands')}</h2><span className="pmx-muted">{t('{a} shown', { a: shown.length })}</span></header>
        <div className="pmx-tools">
          <label className="pmx-search"><Ico name="search" /><input type="search" placeholder={t('Search a command or alias')} value={query} onChange={(e) => setQuery(e.currentTarget.value)} /></label>
          <select value={filter} onChange={(e) => setFilter(e.currentTarget.value)} aria-label={t('Filter')}>
            <option value="all">{t('All commands')}</option>
            <option value="level">{t('With a level')}</option>
            <option value="restricted">{t('Restricted to roles')}</option>
            <option value="disabled">{t('Disabled')}</option>
            <option value="open">{t('Open to everyone')}</option>
            {preview && <option value="can">{t('The role can use')}</option>}
            {preview && <option value="cannot">{t('The role cannot use')}</option>}
          </select>
        </div>
        <div className="pmx-cats" role="tablist">
          <button type="button" className={category === 'all' ? 'on' : ''} onClick={() => setCategory('all')}>{t('All')}</button>
          {categories.map(([id, cat]) => <button type="button" key={id} className={category === id ? 'on' : ''} onClick={() => setCategory(id)}>{cat.title}</button>)}
        </div>
        {shown.length === 0 && <p className="pmx-muted pmx-empty">{t('No command matches.')}</p>}
        {categories.filter(([, cat]) => cat.cmds.length).map(([id, cat]) => {
          // Folded until opened, a search is typed, a category or a filter is picked: the whole list is long.
          const folded = open[id] === undefined ? !(query.trim() || category !== 'all' || filter !== 'all') : !open[id];
          return (
            <div className="pmx-cat" key={id}>
              <button type="button" className="pmx-cat-head" aria-expanded={!folded} onClick={() => setOpen({ ...open, [id]: folded })}><span>{cat.title}</span><em>{cat.cmds.length}</em><span className={`pmx-caret ${folded ? 'closed' : ''}`}><Ico name="caret" size={12} /></span></button>
              {!folded && (
                <ul className="pmx-cmds">
                  {cat.cmds.map((c) => {
                    const v = preview?.verdict(c);
                    return (
                      <li key={c.name} className={v ? (v.ok ? 'can' : 'cannot') : ''}>
                        <div className="pmx-cmd-main">
                          <code>{c.slash ? '/' : '!'}{c.name}</code>
                          <span className="pmx-desc">{c.desc}</span>
                          <div className="pmx-tags">
                            {c.permissionNames.map((p) => <span className="pmx-tag perm" key={p}>{permissionText[p] ?? p}</span>)}
                            {c.restrictRoles.map((id) => <span className="pmx-tag role" key={id}>@{roleById.get(id)?.name ?? id}</span>)}
                            {c.disabledServer && <span className="pmx-tag off">{t('Disabled')}</span>}
                            {!c.disabledServer && c.disabledChannels.length > 0 && <span className="pmx-tag off">{t('Off in {a} channels', { a: c.disabledChannels.length })}</span>}
                          </div>
                        </div>
                        <div className="pmx-cmd-side">
                          {v && <span className={`pmx-verdict ${v.ok ? 'ok' : 'no'}`}><Ico name={v.ok ? 'check' : 'x'} size={11} />{v.reason}</span>}
                          <label className="pmx-cmd-level"><span>{t('Level')}</span>
                            <select value={String(levels[c.name] ?? 0)} disabled={!canEdit || busy} onChange={(e) => { const level = Number(e.currentTarget.value); setLevels({ ...levels, [c.name]: level }); call('set_command_level', { commandName: c.name, level }); }}>
                              {[...new Set([...levelOptions, levels[c.name] ?? 0])].sort((a, b) => a - b).map((n) => <option key={n} value={n}>{n === 0 ? t('0 · anyone') : `${n}${groups.filter((g) => g.level === n).map((g) => ` · ${g.isBase ? '@everyone' : g.name}`).join('')}`}</option>)}
                            </select>
                          </label>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
