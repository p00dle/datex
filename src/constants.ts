import type { DateXParams } from './types';
import { isLeapYear } from './utils/is-leap-year';
import { mar1wd } from './utils/mar-1wd';
import { range } from './utils/range';
import { sumArray } from './utils/sum-array';

const numberStringRange = range(0, 3000, 1, true);
const yearRange = range(1970, 3000, 1, true);

export const MONTH_DAY_COUNT = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const MONTH_DAY_COUNT_LEAP = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const MONTH_WEEKDAY = [0, 0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
export const MONTH_QUARTER_MAP = [0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4];
export const NUMBER_STRING = numberStringRange.map((n) => '' + n);
export const NUMBER_STRING_PAD2 = numberStringRange.map((n) => ('' + n).padStart(2, '0'));
export const NUMBER_STRING_PAD3 = numberStringRange.map((n) => ('' + n).padStart(3, '0'));
export const MAR_1WD_CACHE = yearRange.map(mar1wd);
export const DAYS_SINCE_1970 = sumArray(yearRange.map((year) => (year === 1970 ? 0 : isLeapYear(year - 1) ? 366 : 365)));
export const DAYS_TO_MONTH = sumArray([0].concat(MONTH_DAY_COUNT));
export const DAYS_TO_MONTH_LEAP = sumArray([0].concat(MONTH_DAY_COUNT_LEAP));

export const DEFAULT_DATEX_PARAMS: DateXParams = {
  format: 'YYYY-MM-DDTHH:mm:SS.sssZ',
  locale: 'en',
  timezoneOffset: 0,
  dst: 'none',
};

export const HOURS_STRING = [
  '12',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
];
export const HOURS_STRING_PAD = [
  '12',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
];
