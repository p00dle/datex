import type { DateData } from './DateData';
import type { LocaleData } from './LocaleData';

export type Stringifyer = (dateData: DateData, locale: LocaleData) => string;
