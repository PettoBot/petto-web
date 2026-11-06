// The questions of the dashboard for the React apps: the card of DashConfirm.astro (window.dglConfirm / window.dglPrompt), never the browser's
// own window. Without the card (it is part of every dashboard page) nothing destructive goes on: the answer is "no".
export interface AskOptions { title?: string; confirm?: string; cancel?: string; tone?: 'danger' | 'neutral' }
interface AskWindow {
  dglConfirm?: (text: string, opts?: AskOptions) => Promise<boolean>;
  dglPrompt?: (text: string, opts?: AskOptions & { field?: { placeholder?: string; value?: string; maxLength?: number; inputMode?: string } }) => Promise<string | null>;
}
const win = (): AskWindow => (typeof window === 'undefined' ? {} : (window as unknown as AskWindow));

export const ask = (text: string, opts?: AskOptions): Promise<boolean> => { const w = win(); return w.dglConfirm ? w.dglConfirm(text, opts) : Promise.resolve(false); };
export const askText = (text: string, opts?: AskOptions & { field?: { placeholder?: string; value?: string; maxLength?: number; inputMode?: string } }): Promise<string | null> => {
  const w = win();
  return w.dglPrompt ? w.dglPrompt(text, opts) : Promise.resolve(null);
};
