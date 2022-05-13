import type { FormatVariable, Stringifyer } from './types';
import { HOURS_STRING, HOURS_STRING_PAD, NUMBER_STRING, NUMBER_STRING_PAD2, NUMBER_STRING_PAD3 } from './constants';
import { YEAR, QUARTER, MONTH, DAY, HOURS, MINUTES, SECONDS, MILLISECONDS, WEEKDAY } from './utils/date-data';

export const stringifyersByType: Record<FormatVariable, Stringifyer> = {
  YYYY: (d, _l) => NUMBER_STRING[d[YEAR]],
  YY: (d, _l) => NUMBER_STRING_PAD2[d[YEAR] % 100],
  QQ: (d, _l) => NUMBER_STRING_PAD2[d[QUARTER]],
  Q: (d, _l) => NUMBER_STRING[d[QUARTER]],
  MMMM: (d, l) => l.monthNames[d[MONTH]],
  MMM: (d, l) => l.monthNamesShort[d[MONTH]],
  MM: (d, _l) => NUMBER_STRING_PAD2[d[MONTH]],
  M: (d, _l) => NUMBER_STRING[d[MONTH]],
  AM: (d, _l) => (d[HOURS] < 12 ? 'AM' : 'PM'),
  DDD: (d, l) => d[DAY] + l.ordinals[d[DAY]],
  DD: (d, _l) => NUMBER_STRING_PAD2[d[DAY]],
  D: (d, _l) => NUMBER_STRING[d[DAY]],
  WWWW: (d, l) => l.weekDays[d[WEEKDAY]],
  WWW: (d, l) => l.weekDaysShort[d[WEEKDAY]],
  HH: (d, _l) => NUMBER_STRING_PAD2[d[HOURS]],
  H: (d, _l) => NUMBER_STRING[d[HOURS]],
  mm: (d, _l) => NUMBER_STRING_PAD2[d[MINUTES]],
  m: (d, _l) => NUMBER_STRING[d[MINUTES]],
  SS: (d, _l) => NUMBER_STRING_PAD2[d[SECONDS]],
  S: (d, _l) => NUMBER_STRING[d[SECONDS]],
  sss: (d, _l) => NUMBER_STRING_PAD3[d[MILLISECONDS]],
  s: (d, _l) => NUMBER_STRING[d[MILLISECONDS]],
};

export const stringifyersByTypeAmPm = { ...stringifyersByType };
stringifyersByTypeAmPm.HH = (d, _l) => HOURS_STRING_PAD[d[HOURS]];
stringifyersByTypeAmPm.H = (d, _l) => HOURS_STRING[d[HOURS]];
