import { useMemo, useState } from 'react';
import './permissions.css';

// Same Phosphor icon set the rest of the dashboard uses (astro-icon), inlined here since this
// island is plain React and can't reach for the .astro <Icon> component.
const ICON_PATHS: Record<string, string> = {
  user: 'M230.93 220a8 8 0 0 1-6.93 4H32a8 8 0 0 1-6.92-12c15.23-26.33 38.7-45.21 66.09-54.16a72 72 0 1 1 73.66 0c27.39 8.95 50.86 27.83 66.09 54.16a8 8 0 0 1 .01 8',
  users: 'M64.12 147.8a4 4 0 0 1-4 4.2H16a8 8 0 0 1-7.8-6.17a8.35 8.35 0 0 1 1.62-6.93A67.8 67.8 0 0 1 37 117.51a40 40 0 1 1 66.46-35.8a3.94 3.94 0 0 1-2.27 4.18A64.08 64.08 0 0 0 64 144c0 1.28 0 2.54.12 3.8m182-8.91A67.76 67.76 0 0 0 219 117.51a40 40 0 1 0-66.46-35.8a3.94 3.94 0 0 0 2.27 4.18A64.08 64.08 0 0 1 192 144c0 1.28 0 2.54-.12 3.8a4 4 0 0 0 4 4.2H240a8 8 0 0 0 7.8-6.17a8.33 8.33 0 0 0-1.63-6.94Zm-89 43.18a48 48 0 1 0-58.37 0A72.13 72.13 0 0 0 65.07 212A8 8 0 0 0 72 224h112a8 8 0 0 0 6.93-12a72.15 72.15 0 0 0-33.74-29.93Z',
  gear: 'M216 130.16q.06-2.16 0-4.32l14.92-18.64a8 8 0 0 0 1.48-7.06a107.6 107.6 0 0 0-10.88-26.25a8 8 0 0 0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186 40.54a8 8 0 0 0-3.94-6a107.3 107.3 0 0 0-26.25-10.86a8 8 0 0 0-7.06 1.48L130.16 40h-4.32L107.2 25.11a8 8 0 0 0-7.06-1.48a107.6 107.6 0 0 0-26.25 10.88a8 8 0 0 0-3.93 6l-2.64 23.76q-1.56 1.49-3 3L40.54 70a8 8 0 0 0-6 3.94a107.7 107.7 0 0 0-10.87 26.25a8 8 0 0 0 1.49 7.06L40 125.84v4.32L25.11 148.8a8 8 0 0 0-1.48 7.06a107.6 107.6 0 0 0 10.88 26.25a8 8 0 0 0 6 3.93l23.72 2.64q1.49 1.56 3 3L70 215.46a8 8 0 0 0 3.94 6a107.7 107.7 0 0 0 26.25 10.87a8 8 0 0 0 7.06-1.49L125.84 216q2.16.06 4.32 0l18.64 14.92a8 8 0 0 0 7.06 1.48a107.2 107.2 0 0 0 26.25-10.88a8 8 0 0 0 3.93-6l2.64-23.72q1.56-1.48 3-3l23.78-2.8a8 8 0 0 0 6-3.94a107.7 107.7 0 0 0 10.87-26.25a8 8 0 0 0-1.49-7.06ZM128 168a40 40 0 1 1 40-40a40 40 0 0 1-40 40',
  warning: 'M236.8 188.09L149.35 36.22a24.76 24.76 0 0 0-42.7 0L19.2 188.09a23.51 23.51 0 0 0 0 23.72A24.35 24.35 0 0 0 40.55 224h174.9a24.35 24.35 0 0 0 21.33-12.19a23.51 23.51 0 0 0 .02-23.72M120 104a8 8 0 0 1 16 0v40a8 8 0 0 1-16 0Zm8 88a12 12 0 1 1 12-12a12 12 0 0 1-12 12',
  flask: 'M221.69 199.77L160 96.92V40h8a8 8 0 0 0 0-16H88a8 8 0 0 0 0 16h8v56.92L34.31 199.77A16 16 0 0 0 48 224h160a16 16 0 0 0 13.72-24.23Zm-90.08-42.91c-15.91-8.05-31.05-12.32-45.22-12.81l24.47-40.8a7.93 7.93 0 0 0 1.14-4.11V40h32v59.14a7.93 7.93 0 0 0 1.14 4.11L183.36 167c-11.96 2.34-29.07 1.34-51.75-10.14',
  globe: 'M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24m78.36 64h-35.65a135.3 135.3 0 0 0-22.3-45.6A88.29 88.29 0 0 1 206.37 88Zm9.64 40a87.6 87.6 0 0 1-3.33 24h-38.51a157.4 157.4 0 0 0 0-48h38.51a87.6 87.6 0 0 1 3.33 24m-88-85a115.3 115.3 0 0 1 26 45h-52a115.1 115.1 0 0 1 26-45m-26 125h52a115.1 115.1 0 0 1-26 45a115.3 115.3 0 0 1-26-45m-3.9-16a140.8 140.8 0 0 1 0-48h59.88a140.8 140.8 0 0 1 0 48Zm50.35 61.6a135.3 135.3 0 0 0 22.3-45.6h35.66a88.29 88.29 0 0 1-58 45.6Z',
  plus: 'M228 128a12 12 0 0 1-12 12h-76v76a12 12 0 0 1-24 0v-76H40a12 12 0 0 1 0-24h76V40a12 12 0 0 1 24 0v76h76a12 12 0 0 1 12 12',
  x: 'M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z',
  trash: 'M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16M112 168a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm0-120H96v-8a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8Z',
};
function Ico({ name, size = 14, className }: { name: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" className={className} fill="currentColor" style={{ flexShrink: 0 }}>
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

interface Member { subjectType: 'user' | 'role'; subjectId: string; }
interface Group { id: number; name: string; level: number; isBase: boolean; members: Member[]; }
interface CommandInfo { name: string; category: string; categoryTitle: string; desc: string; }
interface RoleOpt { id: string; name: string; isAdmin: boolean; isManageGuild: boolean; }
interface CurrentUser { id: string; name: string; avatarUrl: string; }

interface Props {
  guildId: string;
  roles: RoleOpt[];
  initialGroups: Group[];
  initialCommandLevels: Record<string, number>;
  commands: CommandInfo[];
  currentUser: CurrentUser;
}

const CATEGORY_COLORS: Record<string, string> = {
  moderation: '#fe6465',
  tickets: '#8399ff',
  leveling: '#a5ea7a',
  giveaways: '#fed53c',
  automation: '#c792ea',
  community: '#5eead4',
  onboarding: '#f78fb3',
  logging: '#60a5fa',
  info: '#94a3b8',
  setup: '#fb923c',
};
const GROUP_COLOR = '#8399ff';
const HEIGHT = 680;

// Rings, inner radius -> outer radius, from the center out.
const R_YOU = 34;
const R_GROUP = [46, 74];
const R_CAT = [82, 102];
const R_CMD = [110, 110]; // command outer end is computed per-command from its level

function polar(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}
function annularPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p1 = polar(cx, cy, r1, a0);
  const p2 = polar(cx, cy, r1, a1);
  const p3 = polar(cx, cy, r0, a1);
  const p4 = polar(cx, cy, r0, a0);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${r1} ${r1} 0 ${large} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${r0} ${r0} 0 ${large} 0 ${p4.x} ${p4.y} Z`;
}

function levelColor(level: number) {
  if (level >= 80) return '#fe6465';
  if (level >= 50) return '#fed53c';
  if (level >= 20) return '#8399ff';
  return '#94a3b8';
}

export default function PermissionGraphApp({ guildId, roles, initialGroups, initialCommandLevels, commands, currentUser }: Props) {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [commandLevels, setCommandLevels] = useState<Record<string, number>>(initialCommandLevels);
  const [selected, setSelected] = useState<{ kind: 'group' | 'command'; refId: number | string } | null>(null);
  const [search, setSearch] = useState('');
  const [addingGroup, setAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; level: number } | null>(null);
  const [simSubject, setSimSubject] = useState<{ type: 'role' | 'user'; id: string; label: string } | null>(null);
  const [simUserId, setSimUserId] = useState('');

  const apiUrl = `/dash/guild/${guildId}/permissions-api`;
  const roleById = (roleId: string) => roles.find((r) => r.id === roleId);
  const roleName = (roleId: string) => roleById(roleId)?.name ?? roleId;

  // What's the highest group level a role/user qualifies for — same rule the bot itself uses:
  // highest level across every group they belong to, directly or through a role, base included.
  function effectiveLevel(subject: { type: 'role' | 'user'; id: string } | null): number | null {
    if (!subject) return null;
    let level = 0;
    for (const g of groups) {
      if (g.isBase) { level = Math.max(level, g.level); continue; }
      const matches = g.members.some((m) => m.subjectType === subject.type && m.subjectId === subject.id);
      if (matches) level = Math.max(level, g.level);
    }
    return level;
  }
  const simLevel = effectiveLevel(simSubject);
  const simAllowed = simSubject ? commands.filter((c) => (commandLevels[c.name] ?? 0) <= (simLevel ?? 0)) : [];
  const simBlocked = simSubject ? commands.filter((c) => (commandLevels[c.name] ?? 0) > (simLevel ?? 0)).sort((a, b) => (commandLevels[b.name] ?? 0) - (commandLevels[a.name] ?? 0)) : [];

  function showTooltip(e: React.MouseEvent, label: string, level: number) {
    const host = (e.target as Element).closest('.ps-chart-col') as HTMLElement | null;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, label, level });
  }

  async function callApi(action: string, extra: Record<string, any>) {
    setBusy(true);
    setApiError(null);
    try {
      const res = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...extra }) });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setApiError(data?.error ?? `Request failed (${res.status})`);
        return false;
      }
      if (data?.groups) setGroups(data.groups);
      if (data?.levels) {
        const map: Record<string, number> = {};
        for (const row of data.levels) map[row.command_name] = row.required_level;
        setCommandLevels(map);
      }
      return true;
    } catch (err: any) {
      setApiError(err?.message ?? 'Network error');
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function createGroup() {
    const name = newGroupName.trim();
    if (!name) return;
    const ok = await callApi('create_group', { name, level: 0 });
    if (ok) { setNewGroupName(''); setAddingGroup(false); }
  }

  const searchLower = search.trim().toLowerCase();
  const matches = (s: string) => !searchLower || s.toLowerCase().includes(searchLower);

  const categories = useMemo(() => {
    const map = new Map<string, { title: string; cmds: CommandInfo[] }>();
    for (const c of commands) {
      if (!map.has(c.category)) map.set(c.category, { title: c.categoryTitle, cmds: [] });
      map.get(c.category)!.cmds.push(c);
    }
    return Array.from(map.entries()).map(([id, v]) => ({ id, ...v }));
  }, [commands]);

  const maxCmdOuter = Math.min(340, HEIGHT / 2 - 30);

  const selectedGroup = selected?.kind === 'group' ? groups.find((g) => g.id === selected.refId) ?? null : null;
  const selectedCommand = selected?.kind === 'command' ? commands.find((c) => c.name === selected.refId) ?? null : null;
  const selectedCommandLevel = selectedCommand ? (commandLevels[selectedCommand.name] ?? 0) : 0;
  const qualifyingGroups = useMemo(() => {
    if (!selectedCommand) return [];
    return groups.filter((g) => g.level >= selectedCommandLevel).sort((a, b) => b.level - a.level);
  }, [selectedCommand, selectedCommandLevel, groups]);

  const usedCategories = categories.map((c) => c.id).filter((id) => CATEGORY_COLORS[id]);

  return (
    <div className="ps-app">
      <div className="ps-toolbar">
        <input type="text" className="ps-search" placeholder="Search a group or command..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="ps-legend">
          {usedCategories.map((cat) => (
            <span className="ps-legend-item" key={cat} style={{ '--c': CATEGORY_COLORS[cat] } as any}>
              <span className="ps-legend-dot" />{categories.find((c) => c.id === cat)?.title}
            </span>
          ))}
        </div>
        <span className="ps-stats">{groups.length} groups · {commands.length} commands</span>
        <button type="button" className="btn btn-accent btn-sm" onClick={() => setAddingGroup(true)}>+ Add Group</button>
      </div>

      {apiError && (
        <div className="ps-error">
          <Ico name="warning" size={13} /> {apiError}
        </div>
      )}

      <div className="ps-sim-row">
        <span className="ps-sim-label"><Ico name="flask" size={13} /> Test as:</span>
        <select
          value={simSubject?.type === 'role' ? simSubject.id : ''}
          onChange={(e) => {
            const id = e.target.value;
            setSimUserId('');
            setSimSubject(id ? { type: 'role', id, label: roleName(id) } : null);
          }}
        >
          <option value="">Pick a role...</option>
          {roles.map((r) => <option value={r.id} key={r.id}>{r.name}</option>)}
        </select>
        <span className="ps-sim-or">or</span>
        <input
          type="text" placeholder="User ID" value={simUserId}
          onChange={(e) => {
            const id = e.target.value.trim();
            setSimUserId(id);
            setSimSubject(id ? { type: 'user', id, label: id } : null);
          }}
        />
        {simSubject && (
          <>
            <span className="ps-sim-result">{simSubject.label} → level <b style={{ '--c': levelColor(simLevel ?? 0) } as any}>{simLevel}</b></span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setSimSubject(null); setSimUserId(''); }}>Clear</button>
          </>
        )}
      </div>

      <div className="ps-wrap">
        <div className="ps-chart-col">
          <svg viewBox={`0 0 ${HEIGHT} ${HEIGHT}`} className="ps-svg">
            {(() => {
              const cx = HEIGHT / 2;
              const cy = HEIGHT / 2;
              const elements: React.ReactNode[] = [];

              // --- Group ring: @everyone + custom groups share the ring equally ---
              const groupSlices = groups.length || 1;
              const gap = 0.02;
              groups.forEach((g, i) => {
                const a0 = (i / groupSlices) * Math.PI * 2 + gap;
                const a1 = ((i + 1) / groupSlices) * Math.PI * 2 - gap;
                const key = `group:${g.id}`;
                const isSel = selected?.kind === 'group' && selected.refId === g.id;
                const dim = searchLower && !matches(g.name) && !(g.isBase && matches('@everyone'));
                const mid = (a0 + a1) / 2;
                const labelPos = polar(cx, cy, (R_GROUP[0] + R_GROUP[1]) / 2, mid);
                const gLabel = g.isBase ? '@everyone' : g.name;
                elements.push(
                  <g key={key} className={`ps-arc ps-arc-group${isSel ? ' selected' : ''}${dim ? ' dim' : ''}${hoverKey === key ? ' hover' : ''}`}
                    onClick={() => setSelected({ kind: 'group', refId: g.id })}
                    onMouseEnter={(e) => { setHoverKey(key); showTooltip(e, gLabel, g.level); }}
                    onMouseMove={(e) => showTooltip(e, gLabel, g.level)}
                    onMouseLeave={() => { setHoverKey(null); setTooltip(null); }}
                  >
                    <path d={annularPath(cx, cy, R_GROUP[0], R_GROUP[1], a0, a1)} style={{ '--c': GROUP_COLOR } as any} />
                    {a1 - a0 > 0.28 && (
                      <text x={labelPos.x} y={labelPos.y} className="ps-arc-label">{gLabel.slice(0, 10)}</text>
                    )}
                  </g>,
                );
              });

              // --- Category ring: always full circle, one color band per category ---
              const catSlices = categories.length || 1;
              categories.forEach((cat, i) => {
                const a0 = (i / catSlices) * Math.PI * 2 + gap;
                const a1 = ((i + 1) / catSlices) * Math.PI * 2 - gap;
                const mid = (a0 + a1) / 2;
                const labelPos = polar(cx, cy, (R_CAT[0] + R_CAT[1]) / 2, mid);
                elements.push(
                  <g key={`cat:${cat.id}`} className="ps-arc ps-arc-cat">
                    <path d={annularPath(cx, cy, R_CAT[0], R_CAT[1], a0, a1)} style={{ '--c': CATEGORY_COLORS[cat.id] ?? '#94a3b8' } as any} />
                    {a1 - a0 > 0.2 && <text x={labelPos.x} y={labelPos.y} className="ps-cat-label">{cat.title}</text>}
                  </g>,
                );

                // --- Command bars within this category's sector, height = level ---
                const n = cat.cmds.length;
                cat.cmds.forEach((c, j) => {
                  const ca0 = a0 + ((a1 - a0) * j) / n;
                  const ca1 = a0 + ((a1 - a0) * (j + 1)) / n;
                  const level = commandLevels[c.name] ?? 0;
                  const outer = R_CMD[0] + (level / 100) * (maxCmdOuter - R_CMD[0]);
                  const key = `cmd:${c.name}`;
                  const isSel = selected?.kind === 'command' && selected.refId === c.name;
                  const simBlocked = simSubject && level > (simLevel ?? 0);
                  const simAllowed = simSubject && !simBlocked;
                  const dim = (searchLower && !matches(c.name) && !matches(c.desc)) || simBlocked;
                  elements.push(
                    <g key={key} className={`ps-arc ps-arc-cmd${isSel ? ' selected' : ''}${dim ? ' dim' : ''}${hoverKey === key ? ' hover' : ''}${simAllowed ? ' sim-allowed' : ''}`}
                      onClick={() => setSelected({ kind: 'command', refId: c.name })}
                      onMouseEnter={(e) => { setHoverKey(key); showTooltip(e, `/${c.name}`, level); }}
                      onMouseMove={(e) => showTooltip(e, `/${c.name}`, level)}
                      onMouseLeave={() => { setHoverKey(null); setTooltip(null); }}
                    >
                      <path d={annularPath(cx, cy, R_CMD[0] - 2, Math.max(outer, R_CMD[0] + 4), ca0 + 0.004, ca1 - 0.004)} style={{ '--c': CATEGORY_COLORS[cat.id] ?? '#94a3b8' } as any} />
                    </g>,
                  );
                });
              });

              return elements;
            })()}
            <defs>
              <clipPath id="ps-you-clip">
                <circle cx={HEIGHT / 2} cy={HEIGHT / 2} r={R_YOU - 2} />
              </clipPath>
            </defs>
            <circle className="ps-you" cx={HEIGHT / 2} cy={HEIGHT / 2} r={R_YOU} />
            <image
              href={currentUser.avatarUrl} x={HEIGHT / 2 - (R_YOU - 2)} y={HEIGHT / 2 - (R_YOU - 2)}
              width={(R_YOU - 2) * 2} height={(R_YOU - 2) * 2} clipPath="url(#ps-you-clip)" preserveAspectRatio="xMidYMid slice"
            />
            <text className="ps-you-label" x={HEIGHT / 2} y={HEIGHT / 2 + R_YOU + 13}>{currentUser.name}</text>
          </svg>
          {tooltip && (
            <div className="ps-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
              <span className="ps-tooltip-name">{tooltip.label}</span>
              <span className="ps-tooltip-level" style={{ '--c': levelColor(tooltip.level) } as any}>{tooltip.level}</span>
            </div>
          )}
        </div>

        <div className="ps-panel-col">
          {addingGroup && (
            <div className="ps-panel">
              <div className="ps-panel-head"><Ico name="plus" /><h3>New group</h3></div>
              <input type="text" className="ps-text-input" placeholder="e.g. Staff, Trial Mods..." value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} maxLength={60} autoFocus />
              <div className="ps-panel-actions">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setAddingGroup(false); setNewGroupName(''); }}>Cancel</button>
                <button type="button" className="btn btn-accent btn-sm" disabled={busy || !newGroupName.trim()} onClick={createGroup}>Create</button>
              </div>
            </div>
          )}

          {selectedGroup && (
            <div className="ps-panel">
              <div className="ps-panel-head">
                <Ico name={selectedGroup.isBase ? 'globe' : 'users'} /><h3>{selectedGroup.isBase ? '@everyone' : selectedGroup.name}</h3>
                {selectedGroup.isBase && <span className="ps-badge">Base</span>}
              </div>
              <label className="ps-label">Permission Level</label>
              <p className="ps-hint-small">There's no "give this group a command" button, it works the other way: a command has a required level, and any group at or above it can run it. Use "Grant access" below to lower a command's requirement down to this group's level.</p>
              <div className="ps-slider-row">
                <input type="range" min="0" max="100" value={selectedGroup.level}
                  onChange={(e) => setGroups((gs) => gs.map((x) => (x.id === selectedGroup.id ? { ...x, level: Number(e.target.value) } : x)))} />
                <span className="ps-slider-val" style={{ '--c': levelColor(selectedGroup.level) } as any}>{selectedGroup.level}</span>
                <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => callApi('update_group_level', { groupId: selectedGroup.id, level: selectedGroup.level })}>Update</button>
              </div>

              <label className="ps-label" style={{ marginTop: '14px' }}>Grant access to a command</label>
              <GrantCommandRow
                commands={commands}
                commandLevels={commandLevels}
                groupLevel={selectedGroup.level}
                busy={busy}
                onGrant={(name) => callApi('set_command_level', { commandName: name, level: selectedGroup.level })}
              />

              {(() => {
                const gated = commands.filter((c) => (commandLevels[c.name] ?? 0) > 0);
                const unlocked = gated.filter((c) => (commandLevels[c.name] ?? 0) <= selectedGroup.level);
                const openCount = commands.length - gated.length;
                return (
                  <>
                    <label className="ps-label" style={{ marginTop: '14px' }}>Gated commands this unlocks ({unlocked.length}/{gated.length})</label>
                    <p className="ps-hint-small">Commands with no level set ({openCount}) are already open to everyone and aren't listed here.</p>
                    <div className="ps-member-list">
                      {gated.length === 0 && <p className="ps-empty">No command has a required level set yet — everything's still open to everyone.</p>}
                      {gated.length > 0 && unlocked.length === 0 && <p className="ps-empty">Level {selectedGroup.level} doesn't meet any gated command's level yet.</p>}
                      {unlocked
                        .sort((a, b) => (commandLevels[b.name] ?? 0) - (commandLevels[a.name] ?? 0))
                        .map((c) => (
                          <div className="ps-chip ps-qualifying" key={c.name}>
                            <span>/{c.name}</span>
                            <span className="ps-qualifying-level">{commandLevels[c.name] ?? 0}</span>
                          </div>
                        ))}
                    </div>
                  </>
                );
              })()}

              {!selectedGroup.isBase && (
                <>
                  <label className="ps-label" style={{ marginTop: '14px' }}>Members</label>
                  <div className="ps-member-list">
                    {selectedGroup.members.length === 0 && <p className="ps-empty">No members yet.</p>}
                    {selectedGroup.members.map((m) => {
                      const role = m.subjectType === 'role' ? roleById(m.subjectId) : null;
                      const risky = role && (role.isAdmin || role.isManageGuild);
                      return (
                        <div className={`ps-chip${risky ? ' risky' : ''}`} key={`${m.subjectType}:${m.subjectId}`}>
                          <Ico name={m.subjectType === 'role' ? 'users' : 'user'} size={12} />
                          <span>{m.subjectType === 'role' ? roleName(m.subjectId) : m.subjectId}</span>
                          {risky && <span className="ps-risk"><Ico name="warning" size={10} /> {role?.isAdmin ? 'Admin' : 'Manage Server'}</span>}
                          <button type="button" onClick={() => callApi('remove_member', { groupId: selectedGroup.id, subjectType: m.subjectType, subjectId: m.subjectId })}><Ico name="x" size={11} /></button>
                        </div>
                      );
                    })}
                  </div>
                  <AddMemberRow roles={roles} onAdd={(subjectType, subjectId) => callApi('add_member', { groupId: selectedGroup.id, subjectType, subjectId })} />
                  <button type="button" className="btn btn-ghost btn-sm ps-delete" disabled={busy} onClick={() => { setSelected(null); callApi('delete_group', { groupId: selectedGroup.id }); }}><Ico name="trash" size={12} /> Delete group</button>
                </>
              )}
              <button type="button" className="ps-close" onClick={() => setSelected(null)}>Close</button>
            </div>
          )}

          {selectedCommand && (
            <div className="ps-panel">
              <div className="ps-panel-head"><Ico name="gear" /><h3>/{selectedCommand.name}</h3></div>
              <p className="ps-desc">{selectedCommand.desc}</p>
              <label className="ps-label">Required Level</label>
              <div className="ps-slider-row">
                <input type="range" min="0" max="100" value={selectedCommandLevel}
                  onChange={(e) => setCommandLevels((lv) => ({ ...lv, [selectedCommand.name]: Number(e.target.value) }))} />
                <span className="ps-slider-val" style={{ '--c': levelColor(selectedCommandLevel) } as any}>{selectedCommandLevel}</span>
                <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => callApi('set_command_level', { commandName: selectedCommand.name, level: selectedCommandLevel })}>Update</button>
              </div>
              <label className="ps-label" style={{ marginTop: '14px' }}>Groups that can run this</label>
              <div className="ps-member-list">
                {qualifyingGroups.length === 0 && <p className="ps-empty">No group meets this level yet.</p>}
                {qualifyingGroups.map((g) => (
                  <div className="ps-chip ps-qualifying" key={g.id}>
                    <Ico name={g.isBase ? 'globe' : 'users'} size={12} />
                    <span>{g.isBase ? '@everyone' : g.name}</span>
                    <span className="ps-qualifying-level">{g.level}</span>
                  </div>
                ))}
              </div>
              <button type="button" className="ps-close" onClick={() => setSelected(null)}>Close</button>
            </div>
          )}

          {simSubject && !selectedGroup && !selectedCommand && !addingGroup && (
            <div className="ps-panel">
              <div className="ps-panel-head">
                <Ico name={simSubject.type === 'role' ? 'users' : 'user'} />
                <h3>{simSubject.label}</h3>
                <span className="ps-level-pill" style={{ '--c': levelColor(simLevel ?? 0) } as any}>Lv {simLevel}</span>
              </div>
              <p className="ps-desc">{simAllowed.length} of {commands.length} commands unlocked at this level.</p>

              <label className="ps-label">By category</label>
              <div className="ps-cat-breakdown">
                {categories.map((cat) => {
                  const total = cat.cmds.length;
                  const allowed = cat.cmds.filter((c) => (commandLevels[c.name] ?? 0) <= (simLevel ?? 0)).length;
                  const pct = total ? Math.round((allowed / total) * 100) : 0;
                  return (
                    <div className="ps-cat-bar-row" key={cat.id}>
                      <span className="ps-cat-bar-label">{cat.title}</span>
                      <div className="ps-cat-bar-track">
                        <div className="ps-cat-bar-fill" style={{ width: `${pct}%`, '--c': CATEGORY_COLORS[cat.id] ?? '#94a3b8' } as any} />
                      </div>
                      <span className="ps-cat-bar-count">{allowed}/{total}</span>
                    </div>
                  );
                })}
              </div>

              <label className="ps-label" style={{ marginTop: '14px' }}>Still locked ({simBlocked.length})</label>
              <div className="ps-member-list">
                {simBlocked.length === 0 && <p className="ps-empty">Nothing, this level unlocks every command.</p>}
                {simBlocked.slice(0, 30).map((c) => (
                  <div className="ps-chip" key={c.name}>
                    <span>/{c.name}</span>
                    <span className="ps-qualifying-level">{commandLevels[c.name] ?? 0}</span>
                  </div>
                ))}
                {simBlocked.length > 30 && <p className="ps-empty">+{simBlocked.length - 30} more</p>}
              </div>
            </div>
          )}

          {!simSubject && !selectedGroup && !selectedCommand && !addingGroup && (
            <div className="ps-panel ps-panel-empty">
              <p>Click a ring segment on the chart to view or edit it.</p>
              <ul>
                <li><span className="ps-swatch" style={{ '--c': GROUP_COLOR } as any} /> Inner ring — groups</li>
                <li><span className="ps-swatch ps-swatch-band" /> Middle band — categories</li>
                <li><span className="ps-swatch ps-swatch-bar" /> Outer bars — commands, taller = higher level required</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GrantCommandRow({ commands, commandLevels, groupLevel, busy, onGrant }: { commands: CommandInfo[]; commandLevels: Record<string, number>; groupLevel: number; busy: boolean; onGrant: (name: string) => void }) {
  const [cmdName, setCmdName] = useState('');
  const notYetGranted = commands.filter((c) => (commandLevels[c.name] ?? 0) > groupLevel);
  return (
    <div className="ps-add-member-row" style={{ marginBottom: '10px' }}>
      <select value={cmdName} onChange={(e) => setCmdName(e.target.value)}>
        <option value="">Choose a command...</option>
        {notYetGranted.map((c) => <option value={c.name} key={c.name}>/{c.name} (currently level {commandLevels[c.name] ?? 0})</option>)}
      </select>
      <button type="button" className="btn btn-ghost btn-sm" disabled={!cmdName || busy} onClick={() => { onGrant(cmdName); setCmdName(''); }}>Grant</button>
    </div>
  );
}

function AddMemberRow({ roles, onAdd }: { roles: RoleOpt[]; onAdd: (subjectType: 'role' | 'user', subjectId: string) => void }) {
  const [roleId, setRoleId] = useState('');
  const [userId, setUserId] = useState('');
  return (
    <div className="ps-add-member">
      <div className="ps-add-member-row">
        <select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
          <option value="">Add a role...</option>
          {roles.map((r) => <option value={r.id} key={r.id}>{r.name}{r.isAdmin ? ' ⚠ Admin' : r.isManageGuild ? ' ⚠ Manage Server' : ''}</option>)}
        </select>
        <button type="button" className="btn btn-ghost btn-sm" disabled={!roleId} onClick={() => { onAdd('role', roleId); setRoleId(''); }}>Add</button>
      </div>
      <div className="ps-add-member-row">
        <input type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value.trim())} />
        <button type="button" className="btn btn-ghost btn-sm" disabled={!userId} onClick={() => { onAdd('user', userId); setUserId(''); }}>Add</button>
      </div>
    </div>
  );
}
