import type { PeriodType, DateLike, DateLikeInstance } from '../types';

type GetPeriodDate = (Date: DateLike, date: DateLikeInstance, adjust: -1 | 0 | 1) => number;
type GetPeriodEpoch = (date: number, adjust: -1 | 0 | 1) => number;

function floorAndAdjust(factor: number): GetPeriodEpoch {
  return (date, adjust) => {
    return date - (date % factor) + adjust * factor;
  };
}

const getPeriodByTypeDate: Record<'years' | 'quarters' | 'months' | 'weeks', GetPeriodDate> = {
  years: (Date, date, adjust) => {
    return Date.UTC(date.getUTCFullYear() + adjust, 0, 1);
  },
  quarters: (Date, date, adjust) => {
    return Date.UTC(date.getUTCFullYear(), (Math.floor((date.getUTCMonth() + 1) / 3) + adjust) * 3 - 1, 1);
  },
  months: (Date, date, adjust) => {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + adjust, 1);
  },
  weeks: (_Date, date, adjust) => {
    const n = +date;
    const day = date.getUTCDay();
    return n - (n % 86_400_000) - (day === 0 ? 6 : day - 1) * 86_400_000 + adjust * 604_800_000;
  },
};
const getPeriodByTypeEpoch: Record<'days' | 'hours' | 'minutes' | 'seconds', GetPeriodEpoch> = {
  days: floorAndAdjust(86_400_000),
  hours: floorAndAdjust(3_600_000),
  minutes: floorAndAdjust(60_000),
  seconds: floorAndAdjust(1000),
};

export function getLastPeriod(Date: DateLike, type: PeriodType, previous = false): number {
  if (type === 'years' || type === 'quarters' || type === 'months' || type === 'weeks') {
    return getPeriodByTypeDate[type](Date, new Date(), previous ? -1 : 0);
  } else {
    return getPeriodByTypeEpoch[type](Date.now(), previous ? -1 : 0);
  }
}

export function getLastPeriods(Date: DateLike, type: PeriodType, count: number, includeThis: boolean): number[] {
  let i = count;
  const output: number[] = [];
  if (type === 'years' || type === 'quarters' || type === 'months' || type === 'weeks') {
    const getPeriod = getPeriodByTypeDate[type];
    let date = new Date(getPeriod(Date, new Date(), includeThis ? 1 : 0));
    while (i--) {
      output.unshift(+date);
      date = new Date(getPeriod(Date, date, -1));
    }
  } else {
    const getPeriod = getPeriodByTypeEpoch[type];
    let date = getPeriod(Date.now(), includeThis ? 1 : 0);
    while (i--) {
      output.unshift(date);
      date = getPeriod(date, -1);
    }
  }
  return output;
}

export function dateRange(Date: DateLike, type: PeriodType, from: number, to: number, before: boolean, after: boolean): number[] {
  const output: number[] = [];
  if (type === 'years' || type === 'quarters' || type === 'months' || type === 'weeks') {
    const getPeriod = getPeriodByTypeDate[type];
    const endAt = getPeriod(Date, new Date(to), after ? 1 : 0);
    let date = new Date(getPeriod(Date, new Date(from), before ? -1 : 0));
    let dateN = +date;
    while (dateN <= endAt) {
      output.push(dateN);
      date = new Date(getPeriod(Date, date, 1));
      dateN = +date;
    }
  } else {
    const getPeriod = getPeriodByTypeEpoch[type];
    const endAt = getPeriod(to, after ? 1 : 0);
    let date = getPeriod(from, before ? -1 : 0);
    while (date <= endAt) {
      output.push(date);
      date = getPeriod(date, 1);
    }
  }
  return output;
}
