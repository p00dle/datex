import { DateData } from '../types';
import { YEAR, MONTH, DAY, HOURS, MINUTES, SECONDS, MILLISECONDS, QUARTER, IS_DST, WEEKDAY, YEARS_SINCE_1970, N, IS_LEAP_YEAR } from './date-data';

export function prettyPrintDateData(d: DateData): string {
  return `
YEAR:             ${d[YEAR]}
MONTH:            ${d[MONTH]}
DAY:              ${d[DAY]}
HOURS:            ${d[HOURS]}
MINUTES:          ${d[MINUTES]}
SECONDS:          ${d[SECONDS]}
MILLISECONDS:     ${d[MILLISECONDS]}
QUARTER:          ${d[QUARTER]}
IS_DST:           ${d[IS_DST]}
WEEKDAY:          ${d[WEEKDAY]}
YEARS_SINCE_1970: ${d[YEARS_SINCE_1970]}
N:                ${d[N]}
IS_LEAP_YEAR:     ${d[IS_LEAP_YEAR]}`;
}
