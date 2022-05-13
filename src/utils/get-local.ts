import type { DST, DateLike } from '../types';

export const getLocalTimezoneOffset = (DateD: DateLike): number => {
  const date = new DateD();
  const julyDate = new DateD(date.getFullYear(), 6, 1);
  return -(julyDate.getTimezoneOffset() / 60);
};

export const getLocalDST = (DateD: DateLike): DST => {
  const nowDate = new DateD();
  const date = new DateD(nowDate.getFullYear(), 6, 1);
  const summerTimezoneOffset = date.getTimezoneOffset();
  date.setMonth(11);
  if (date.getTimezoneOffset() === summerTimezoneOffset) {
    return 'none';
  }
  date.setMonth(10);
  if (date.getDay() === 6) {
    date.setDate(date.getDate() - 1);
  }
  if (date.getTimezoneOffset() === summerTimezoneOffset) {
    return 'us';
  } else {
    return 'eu';
  }
};
