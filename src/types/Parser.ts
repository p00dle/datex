import { DateData } from './DateData';
import { LocaleData } from './LocaleData';

export type Parser = (dateData: DateData, string: any, locale: LocaleData) => void;
