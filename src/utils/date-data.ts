import type { DST, DateData } from '../types';

import {
  MONTH_WEEKDAY,
  MONTH_DAY_COUNT_LEAP,
  MONTH_DAY_COUNT,
  MAR_1WD_CACHE,
  DAYS_SINCE_1970,
  DAYS_TO_MONTH_LEAP,
  DAYS_TO_MONTH,
} from '../constants';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { prettyPrintDateData } from '../utils/pretty-print-date-data';

export const YEAR = 0;
export const MONTH = 1;
export const DAY = 2;
export const HOURS = 3;
export const MINUTES = 4;
export const SECONDS = 5;
export const MILLISECONDS = 6;
export const QUARTER = 7;
export const IS_DST = 8;
export const WEEKDAY = 9;
export const YEARS_SINCE_1970 = 10;
export const N = 11;
export const IS_LEAP_YEAR = 12;

export function populateLeapYear(d: DateData): void {
  if (d[YEAR] % 4 !== 0) {
    d[IS_LEAP_YEAR] = 0;
    return;
  }
  if (d[YEAR] % 100 !== 0) {
    d[IS_LEAP_YEAR] = 1;
    return;
  }
  d[IS_LEAP_YEAR] = d[YEAR] % 400 === 0 ? 1 : 0;
}

export function populateWeekday(d: DateData): void {
  if (d[MONTH] < 3) {
    const y = d[YEAR] - 1;
    const r = (y + ((y / 4) | 0) - ((y / 100) | 0) + ((y / 400) | 0) + MONTH_WEEKDAY[d[MONTH]] + d[DAY]) % 7;
    d[WEEKDAY] = r === 0 ? 7 : r;
  } else {
    const r = (d[YEAR] + ((d[YEAR] / 4) | 0) - ((d[YEAR] / 100) | 0) + ((d[YEAR] / 400) | 0) + MONTH_WEEKDAY[d[MONTH]] + d[DAY]) % 7;
    d[WEEKDAY] = r === 0 ? 7 : r;
  }
}

export function populateDST(dst: DST, d: DateData): void {
  if (dst === 'none') {
    d[IS_DST] = 0;
  } else if (dst === 'us') {
    if (d[MONTH] > 3 && d[MONTH] < 11) {
      d[IS_DST] = 0;
    } else if (d[MONTH] === 3) {
      if (d[DAY] * 24 + d[HOURS] >= (15 - MAR_1WD_CACHE[d[YEARS_SINCE_1970]]) * 24 + 2) {
        d[IS_DST] = 1;
      } else {
        d[IS_DST] = 0;
      }
    } else if (d[MONTH] === 11) {
      if (d[DAY] * 24 + d[HOURS] < (8 - MAR_1WD_CACHE[d[YEARS_SINCE_1970]]) * 24 + 2) {
        d[IS_DST] = 1;
      } else {
        d[IS_DST] = 0;
      }
    } else {
      d[IS_DST] = 1;
    }
  } else if (dst === 'eu') {
    if (d[MONTH] > 3 && d[MONTH] < 10) {
      d[IS_DST] = 0;
    } else if (d[MONTH] === 3) {
      if (d[DAY] * 24 + d[HOURS] >= (31 - ((MAR_1WD_CACHE[d[YEARS_SINCE_1970]] + 2) % 7)) * 24 + 1) {
        d[IS_DST] = 1;
      } else {
        d[IS_DST] = 0;
      }
    } else if (d[MONTH] === 10) {
      if (d[DAY] * 24 + d[HOURS] < (32 - MAR_1WD_CACHE[d[YEARS_SINCE_1970]]) * 24 + 1) {
        d[IS_DST] = 1;
      } else {
        d[IS_DST] = 0;
      }
    } else {
      d[IS_DST] = 1;
    }
  }
}

export function populateDateData(d: DateData, timezoneOffsetMs: number, dst: DST, date: number): void {
  d[N] = date + timezoneOffsetMs;
  d[MILLISECONDS] = d[N] % 1000;
  d[N] = (d[N] - d[MILLISECONDS]) / 1000;
  d[SECONDS] = d[N] % 60;
  d[N] = (d[N] - d[SECONDS]) / 60;
  d[MINUTES] = d[N] % 60;
  d[N] = (d[N] - d[MINUTES]) / 60;
  d[HOURS] = d[N] % 24;
  d[N] = (d[N] - d[HOURS]) / 24;
  // console.log('N', d[N]);
  d[YEARS_SINCE_1970] = (d[N] / 366) | 0;
  // console.log('YEARS_SINCE_1970', d[YEARS_SINCE_1970]);
  // console.log(DAYS_SINCE_1970.slice(d[YEARS_SINCE_1970], d[YEARS_SINCE_1970] + 5));
  d[YEAR] = d[YEARS_SINCE_1970] + 1970;
  while (d[N] >= DAYS_SINCE_1970[d[YEARS_SINCE_1970] + 1]) {
    d[YEARS_SINCE_1970]++;
    d[YEAR]++;
    // console.log('[BUMP YEAR]');
  }
  // console.log('YEARS_SINCE_1970', d[YEARS_SINCE_1970]);
  populateLeapYear(d);
  const daysSinceBeginningOfYear = d[N] - DAYS_SINCE_1970[d[YEARS_SINCE_1970]];

  d[MONTH] = ((daysSinceBeginningOfYear / 32) | 0) + 1;
  // console.log('MONTH', d[MONTH]);
  const daysToBegginingOfMonth = d[IS_LEAP_YEAR] === 1 ? DAYS_TO_MONTH_LEAP : DAYS_TO_MONTH;
  // console.log({ daysSinceBeginningOfYear, daysToBegginingOfMonth });
  while (daysSinceBeginningOfYear > daysToBegginingOfMonth[d[MONTH] + 1]) {
    d[MONTH]++;
  }
  d[DAY] = daysSinceBeginningOfYear - daysToBegginingOfMonth[d[MONTH]] + 1;
  // console.log('DAY', d[DAY]);
  // */

  populateDST(dst, d);
  if (d[IS_DST] === 1) {
    d[HOURS]--;
    if (d[HOURS] === -1) {
      d[HOURS] = 23;
      d[DAY]--;
      if (d[DAY] === 0) {
        d[MONTH]--;
        if (d[MONTH] === 0) {
          d[MONTH] = 12;
          d[YEAR]--;
          populateLeapYear(d);
        }
        d[DAY] = (d[IS_LEAP_YEAR] === 1 ? MONTH_DAY_COUNT_LEAP : MONTH_DAY_COUNT)[d[MONTH]];
      }
    }
  }
  d[QUARTER] = Math.floor((d[MONTH] - 1) / 3) + 1;
  populateWeekday(d);
}

export function createDateData(): DateData {
  return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

export function dateDataToEpoch(d: DateData, timezoneOffsetMs: number, dst: DST): number {
  d[YEARS_SINCE_1970] = d[YEAR] - 1970;
  populateLeapYear(d);
  populateDST(dst, d);
  // console.log(prettyPrintDateData(d));
  return (
    (DAYS_SINCE_1970[d[YEARS_SINCE_1970]] + (d[IS_LEAP_YEAR] === 1 ? DAYS_TO_MONTH_LEAP : DAYS_TO_MONTH)[d[MONTH]] + d[DAY] - 1) * 86400000 +
    d[HOURS] * 3600000 +
    d[MINUTES] * 60000 +
    d[SECONDS] * 1000 +
    d[MILLISECONDS] -
    timezoneOffsetMs +
    (d[IS_DST] === 1 ? 3600000 : 0)
  );
}
