import { useEffect, useMemo, useState } from 'react';
import { DashSkeleton, useWait } from '../DashSkeleton';
import { t } from '../embeds/t';

type Names = Record<string, string>;
export interface DesignInfo {
  id: string; family: string; names: Names; color: string; textColor: string; accent: string; panel: string; panelOpacity?: number;
}
interface Family { id: string; names: Names }
interface Catalog { families: Family[]; designs: DesignInfo[] }

// The list is the same for everyone and small, so it is asked once for the page.
let pending: Promise<Catalog | null> | null = null;
function loadCatalog(guildId: string): Promise<Catalog | null> {
  if (!pending) {
    pending = fetch(`/dash/guild/${guildId}/cards-api?designs`)
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => (body?.ok ? ({ families: body.families, designs: body.designs } as Catalog) : null))
      .catch(() => null);
    pending.then((value) => { if (!value) pending = null; });
  }
  return pending;
}

const pageLanguage = () => (typeof document !== 'undefined' ? document.documentElement.lang : 'en');
const nameOf = (names: Names) => names[pageLanguage()] ?? names[pageLanguage().split('-')[0]] ?? names.en;
const fold = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

interface Props { guildId: string; currentSrc: string; onPick: (design: DesignInfo) => void }

/** The designs that come with Petto: a search box, one button per family and a thumbnail for each. Picking one fills the background and the colors of the text. */
export default function DesignGallery({ guildId, currentSrc, onPick }: Props) {
  const [catalog, setCatalog] = useState<Catalog | null | undefined>(undefined);
  const [family, setFamily] = useState('all');
  const [query, setQuery] = useState('');
  useEffect(() => { let alive = true; loadCatalog(guildId).then((value) => { if (alive) setCatalog(value); }); return () => { alive = false; }; }, [guildId]);

  const wait = useWait(catalog === undefined);
  const shown = useMemo(() => {
    if (!catalog) return [];
    const needle = fold(query.trim());
    return catalog.designs.filter((design) => (family === 'all' || design.family === family)
      && (!needle || Object.values(design.names).some((name) => fold(name).includes(needle)) || design.id.includes(needle)));
  }, [catalog, family, query]);

  if (catalog === undefined || wait.skeleton) return wait.skeleton ? <DashSkeleton shape="cards" count={6} /> : null;
  if (!catalog) return <p className="ebr-empty-note">{t('The designs are not available right now.')}</p>;
  const current = currentSrc.startsWith('petto:') ? currentSrc.slice(6) : '';

  return (
    <div className="crd-gallery">
      <div className="crd-gallery-tools">
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Search designs')} aria-label={t('Search designs')} />
        <div className="crd-chips" role="group" aria-label={t('Design families')}>
          <button type="button" className={`crd-chip${family === 'all' ? ' active' : ''}`} aria-pressed={family === 'all'} onClick={() => setFamily('all')}>{t('All')}</button>
          {catalog.families.map((one) => (
            <button key={one.id} type="button" className={`crd-chip${family === one.id ? ' active' : ''}`} aria-pressed={family === one.id} onClick={() => setFamily(one.id)}>{nameOf(one.names)}</button>
          ))}
        </div>
      </div>
      {shown.length === 0 ? <p className="ebr-empty-note">{t('No design matches.')}</p> : (
        <div className="crd-design-grid">
          {shown.map((design) => (
            <button key={design.id} type="button" className={`crd-design${design.id === current ? ' active' : ''}`} aria-pressed={design.id === current} title={nameOf(design.names)} onClick={() => onPick(design)}>
              <img src={`/dash/guild/${guildId}/cards-api?design=${design.id}&size=thumb`} alt="" width={320} height={156} loading="lazy" decoding="async" style={{ background: design.color }} />
              <span>{nameOf(design.names)}</span>
            </button>
          ))}
        </div>
      )}
      <p className="ebr-tools-note">{t('A design sets the background picture and the colors of the text; you can change them afterwards.')}</p>
    </div>
  );
}
