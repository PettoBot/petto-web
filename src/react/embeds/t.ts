import { makeT } from '../../i18n/dash';
import type { Locale } from '../../i18n/ui';

const lang = (typeof document !== 'undefined' ? document.documentElement.lang : 'en') as Locale;

export const t = makeT(lang === 'es' || lang === 'pt-BR' ? lang : 'en');
