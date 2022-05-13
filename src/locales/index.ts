import type { LocaleData } from '../types';
import { makeLocaleData } from './locale';

import { locale as en } from './locales/en';
import { locale as pl } from './locales/pl';

export type LocaleName = 'en' | 'pl';

export const locales: Record<LocaleName, LocaleData> = {
  en: makeLocaleData(en),
  pl: makeLocaleData(pl),
};
