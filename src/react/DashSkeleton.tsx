import { useEffect, useRef, useState, type RefObject } from 'react';

// The waiting of the React apps of the dashboard, with the same rules and the same look as the rest of the pages (DashLoading.astro):
// a placeholder shows only if the first read takes more than 150 ms, stays at least 350 ms once shown, and what arrives is uncovered from the top down.
//
//   const wait = useWait(!data);          // { skeleton: boolean } true while the placeholder must be on screen
//   if (wait.skeleton) return <DashSkeleton shape="editor" />;
//   if (!data) return null;               // still inside the first 150 ms: nothing yet (no flash)
//   const root = useRef(null); useRevealWhen(root, Boolean(data), wait.waited);  // on the app's root, to uncover it when the data comes

type Shape = 'lines' | 'rows' | 'cards' | 'tiles' | 'editor';
const WIDTHS = [62, 38, 74, 50, 30, 66, 44, 58];

export function DashSkeleton({ shape = 'lines', count }: { shape?: Shape; count?: number }) {
  const n = count || (shape === 'cards' ? 6 : shape === 'tiles' ? 4 : shape === 'editor' ? 2 : shape === 'rows' ? 5 : 8);
  return (
    <div className={`dgl-wait sk-wrap dgl-wait-${shape}`} aria-hidden="true" role="presentation">
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className={shape === 'lines' ? 'sk dgl-wait-line' : 'sk'} style={shape === 'lines' ? { width: `${WIDTHS[i % WIDTHS.length]}%` } : undefined} />
      ))}
    </div>
  );
}

/** `loading`: the read is still on its way. `skeleton` is true when the placeholder must show (after `delay`, kept for `min` once shown). */
export function useWait(loading: boolean, delay = 150, min = 350) {
  const [skeleton, setSkeleton] = useState(false);
  const shownAt = useRef(0);
  const waited = useRef(false);
  useEffect(() => {
    if (loading) {
      if (skeleton) return;
      const timer = setTimeout(() => { shownAt.current = Date.now(); waited.current = true; setSkeleton(true); }, delay);
      return () => clearTimeout(timer);
    }
    if (!skeleton) return;
    const left = Math.max(0, min - (Date.now() - shownAt.current));
    const timer = setTimeout(() => setSkeleton(false), left);
    return () => clearTimeout(timer);
  }, [loading, skeleton, delay, min]);
  return { skeleton: skeleton, waited: waited.current };
}

/** Uncovers `ref` from the top down the first time `ready` turns true, when the page had to wait for it (or always, if `always`). */
export function useRevealWhen(ref: RefObject<HTMLElement | null>, ready: boolean, always = true) {
  const done = useRef(false);
  useEffect(() => {
    if (!ready || done.current) return;
    done.current = true;
    if (!always) return;
    (window as unknown as { dglLoad?: { reveal: (el: Element) => void } }).dglLoad?.reveal(ref.current as Element);
  }, [ready, always, ref]);
}
