// The dashboard's shared toast (DashToast.astro: window.dglToast) for the React apps. Returns false when the page has none,
// so the app can show the message its own way.
export function toast(text: string, kind: 'ok' | 'error' | 'info' = 'ok'): boolean {
  const show = (window as unknown as { dglToast?: (text: string, opts: { kind: string }) => void }).dglToast;
  if (typeof show !== 'function') return false;
  show(text, { kind });
  return true;
}
