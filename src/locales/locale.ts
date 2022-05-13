import type { Locale, LocaleData } from '../types';

import { range } from '../utils/range';
import { mapStringIndex } from '../utils/map-string-index';
import { removeDuplicates } from '../utils/removeDuplicates';

export function makeLocaleData(locale: Locale): LocaleData {
  const monthNames = [''].concat(locale.monthNames);
  const weekDays = [''].concat(locale.weekDays);
  const ordinals = range(0, 31, 1, true).map(locale.getOrdinal);
  const monthNamesShort = monthNames.map((str) => str.slice(0, 3));
  return {
    monthNames,
    weekDays,
    ordinals,
    monthNamesShort,
    weekDaysShort: weekDays.map((str) => str.slice(0, 3)),
    ordinalSuffixes: removeDuplicates(ordinals.slice(1)),
    monthNumbers: mapStringIndex(monthNames.map((s) => s.toLowerCase())),
    monthNumbersShort: mapStringIndex(monthNamesShort.map((s) => s.toLowerCase())),
  };
}
