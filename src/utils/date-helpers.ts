import { DateLike } from '../types';

export function now(DateD: DateLike): number {
  return DateD.now();
}

export function today(DateD: DateLike): number {
  const now = DateD.now();
  const time = now % 86400000;
  return now - time;
}

export function toDate(date: number): number {
  return date - (date % 86400000);
}

export function yesterday(DateD: DateLike): number {
  const now = DateD.now();
  const time = now % 86400000;
  return now - time - 86400000;
}

export function tomorrow(DateD: DateLike): number {
  const now = DateD.now();
  const time = now % 86400000;
  return now - time + 86400000;
}

export function days(n: number) {
  return n * 86400000;
}

export function hours(n: number) {
  return n * 3600000;
}

export function minutes(n: number) {
  return n * 60000;
}

export function seconds(n: number) {
  return n * 1000;
}
