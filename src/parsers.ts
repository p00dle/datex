import type { FormatVariable, Parser } from './types';
import { YEAR, MONTH, DAY, HOURS, MINUTES, SECONDS, MILLISECONDS } from './utils/date-data';

const noOp: Parser = (_d, _s, _l) => undefined;

export const parsersByType: Record<FormatVariable, Parser> = {
  YYYY: (d, s, _l) => (d[YEAR] = s * 1),
  YY: (d, s, _l) => (d[YEAR] = 2000 + s * 1),
  QQ: noOp,
  Q: noOp,
  MMMM: (d, s, l) => (d[MONTH] = l.monthNumbers[s.toLowerCase()]),
  MMM: (d, s, l) => (d[MONTH] = l.monthNumbersShort[s.toLowerCase()]),
  MM: (d, s, _l) => (d[MONTH] = s * 1),
  M: (d, s, _l) => (d[MONTH] = s * 1),
  DDD: (d, s, _l) => (d[DAY] = parseInt(s, 10)),
  DD: (d, s, _l) => (d[DAY] = s * 1),
  D: (d, s, _l) => (d[DAY] = s * 1),
  WWWW: noOp,
  WWW: noOp,
  AM: (d, s, _l) => (d[HOURS] += s.toLowerCase() === 'pm' ? 12 : 0),
  HH: (d, s, _l) => (d[HOURS] = s * 1),
  H: (d, s, _l) => (d[HOURS] = s * 1),
  mm: (d, s, _l) => (d[MINUTES] = s * 1),
  m: (d, s, _l) => (d[MINUTES] = s * 1),
  SS: (d, s, _l) => (d[SECONDS] = s * 1),
  S: (d, s, _l) => (d[SECONDS] = s * 1),
  sss: (d, s, _l) => (d[MILLISECONDS] = s * 1),
  s: (d, s, _l) => (d[MILLISECONDS] = s * 1),
};

export const parsersByTypeAmPm = { ...parsersByType };
parsersByTypeAmPm.HH = (d, s, _l) => (d[HOURS] = s === '12' ? 0 : s * 1);
parsersByTypeAmPm.H = (d, s, _l) => (d[HOURS] = s === '12' ? 0 : s * 1);
