import type { DST } from '../types';

import { MAR_1WD_CACHE } from '../constants';

export function isDST(dst: DST, yearsSince1970: number, month: number, day: number, hour: number): boolean {
  if (dst === 'us') {
    if (month > 3 && month < 11) {
      return false;
    }
    if (month === 3) {
      return day * 24 + hour >= (15 - MAR_1WD_CACHE[yearsSince1970]) * 24 + 2;
    } else if (month === 11) {
      return day * 24 + hour < (8 - MAR_1WD_CACHE[yearsSince1970]) * 24 + 2;
    } else {
      return true;
    }
  } else if (dst === 'eu') {
    if (month > 3 && month < 10) {
      return false;
    }
    if (month === 3) {
      return day * 24 + hour >= (31 - ((MAR_1WD_CACHE[yearsSince1970] + 2) % 7)) * 24 + 1;
    } else if (month === 10) {
      return day * 24 + hour < (32 - MAR_1WD_CACHE[yearsSince1970]) * 24 + 1;
    } else {
      return true;
    }
  }
  return false;
}
