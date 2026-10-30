import { t } from './t';

/** The one-line tip under a text that becomes message content or Components V2 text (the Astro twin is src/components/SilentMentionHint.astro). */
export default function SilentHint() {
  const parts = t('Tip: put `!` before a mention (`!@everyone`, `!@Role`) to show it without notifying anyone.').split('`');
  return <span className="ebr-silent-hint">{parts.map((part, index) => (index % 2 ? <code key={index}>{part}</code> : part))}</span>;
}
