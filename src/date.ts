import type { DateData, DateLike, DateXParams, DST, LocaleData, Parser, PeriodType } from './types';
import { locales } from './locales';
import { DEFAULT_DATEX_PARAMS } from './constants';
import {
  createDateData,
  populateDateData,
  YEAR,
  MONTH,
  DAY,
  HOURS,
  dateDataToEpoch,
  MINUTES,
  IS_DST,
  SECONDS,
  MILLISECONDS,
} from './utils/date-data';
import { getLocalTimezoneOffset, getLocalDST } from './utils/get-local';
import { Stringifyer } from './types/Stringifyer';
import { stringifyersByType, stringifyersByTypeAmPm } from './stringifyers';
import { FormatVariable } from './types/FormatVariable';
import { parsersRegexChunksByType } from './parser-regex-chunks';
import { parsersByType, parsersByTypeAmPm } from './parsers';
import { now, today, yesterday, tomorrow, toDate, days, hours, minutes, seconds } from './utils/date-helpers';
import { dateRange, getLastPeriod, getLastPeriods } from './utils/date-period-helpers';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { prettyPrintDateData } from './utils/pretty-print-date-data';

const formatRegex =
  /(YYYY)|(YY)|(QQ)|(Q)|(MMMM)|(MMM)|(MM)|(AM)|(M)|(DDD)|(DD)|(D)|(WWWW)|(WWW)|(HH)|(H)|(mm)|(m)|(SS)|(S)|(sss)|(s)|[^YQMDWHmASs]+/g;

function delimiterFactory(string: string): Stringifyer {
  return (_dateData, _locale) => string;
}

const noOpParser: Parser = (_d, _s, _l) => undefined;

function isVariable(string: string | FormatVariable): string is FormatVariable {
  return Object.keys(stringifyersByType).includes(string);
}

export class DateX {
  public static toDate = toDate;
  public static days = days;
  public static hours = hours;
  public static minutes = minutes;
  public static seconds = seconds;
  protected dateData: DateData = createDateData();
  private lastDateDataDate: number | null = null;
  protected updateDateData(date: number) {
    if (this.lastDateDataDate !== date) {
      populateDateData(this.dateData, this.timezoneOffsetMs, this.dst, date);
      this.lastDateDataDate = date;
    }
  }

  private format: string;
  private locale: LocaleData;
  private timezoneOffsetMs: number;
  private timezoneOffset: number;
  private dst: DST;
  private stringifyers: Stringifyer[];
  private parseRegex: RegExp;
  private parsers: Parser[];
  constructor(options: DateXParams = DEFAULT_DATEX_PARAMS, private dateClass: DateLike = Date) {
    this.format = options.format || 'YYYY-MM-DDTHH:mm:SS.sssZ';
    this.locale = options.locale ? locales[options.locale] || locales.en : locales.en;
    this.timezoneOffset =
      options.timezoneOffset !== undefined ? (options.timezoneOffset === 'local' ? getLocalTimezoneOffset(dateClass) : options.timezoneOffset) : 0;
    this.timezoneOffsetMs = this.timezoneOffset * 3600000;
    this.dst = options.dst !== undefined ? (options.dst === 'local' ? getLocalDST(dateClass) : options.dst) : 'none';
    const isAmPm = this.format.includes('AM');
    const stringifyersMap = isAmPm ? stringifyersByTypeAmPm : stringifyersByType;
    const parsersMap = isAmPm ? parsersByTypeAmPm : parsersByType;
    this.stringifyers = [];
    this.parsers = [];
    const regexChunks: string[] = [];
    this.format.replace(formatRegex, (str: string) => {
      const isDelimiter = !isVariable(str);
      this.stringifyers.push(isDelimiter ? delimiterFactory(str) : stringifyersMap[str]);
      regexChunks.push(isDelimiter ? str : parsersRegexChunksByType[str](this.locale));
      this.parsers.push(isDelimiter ? noOpParser : parsersMap[str]);
      return '';
    });
    this.parseRegex = new RegExp(regexChunks.map((chunk) => '(' + chunk + ')').join(''), 'i');
  }
  public now(): number {
    return now(this.dateClass);
  }
  public today(): number {
    return today(this.dateClass);
  }
  public yesterday(): number {
    return yesterday(this.dateClass);
  }
  public tomorrow(): number {
    return tomorrow(this.dateClass);
  }
  public getLastPeriod(type: PeriodType, previous?: boolean, preserveUTC = false): number {
    const output = getLastPeriod(this.dateClass, type, previous);
    return preserveUTC ? output : this.fromUTC(output);
  }
  public getLastPeriods(type: PeriodType, count: number, includeThis = false, preserveUTC = false): number[] {
    const output = getLastPeriods(this.dateClass, type, count, includeThis);
    return preserveUTC ? output : output.map((date) => this.fromUTC(date));
  }
  public range(type: PeriodType, from: number, to: number, before = false, after = false, preserveUTC = false): number[] {
    const output = dateRange(this.dateClass, type, from, to, before, after);
    return preserveUTC ? output : output.map((date) => this.fromUTC(date));
  }
  public stringify(date: number): string {
    if (typeof date !== 'number' || isNaN(date)) return '';
    this.updateDateData(date);
    // console.log(prettyPrintDateData(this.dateData));
    return this.stringifyers.map((stringifyer) => stringifyer(this.dateData, this.locale)).join('');
  }

  public parse(dateStr: string): number {
    if (typeof dateStr !== 'string' || dateStr.length === 0) return NaN;
    const match = dateStr.match(this.parseRegex);
    if (!match) return NaN;
    const matches: string[] = Array.prototype.slice.call(match, 1);
    for (let i = 0, l = matches.length; i < l; i++) {
      this.parsers[i](this.dateData, matches[i], this.locale);
    }
    // console.log(prettyPrintDateData(this.dateData));
    return dateDataToEpoch(this.dateData, this.timezoneOffsetMs, this.dst);
  }

  public getYear(date: number): number {
    this.updateDateData(date);
    return this.dateData[YEAR];
  }

  public getMonth(date: number): number {
    this.updateDateData(date);
    return this.dateData[MONTH];
  }

  public getDay(date: number): number {
    this.updateDateData(date);
    return this.dateData[DAY];
  }

  public getHours(date: number): number {
    this.updateDateData(date);
    return this.dateData[HOURS];
  }

  public getMinutes(date: number): number {
    this.updateDateData(date);
    return this.dateData[MINUTES];
  }

  public getSeconds(date: number): number {
    let n = date;
    const milliseconds = n % 1000;
    n = (n - milliseconds) / 1000;
    const seconds = n % 60;
    return seconds;
  }

  public getMilliseconds(num: number): number {
    const n = num;
    const milliseconds = n % 1000;
    return milliseconds;
  }
  public toUTC(date: number): number {
    this.updateDateData(date);
    return date - this.timezoneOffsetMs + (this.dateData[IS_DST] ? 3600000 : 0);
  }

  public fromUTC(date: number): number {
    this.updateDateData(date);
    return date + this.timezoneOffsetMs - (this.dateData[IS_DST] ? 3600000 : 0);
  }

  public toDate(date: number): number {
    this.updateDateData(date);
    this.dateData[HOURS] = 0;
    this.dateData[MINUTES] = 0;
    this.dateData[SECONDS] = 0;
    this.dateData[MILLISECONDS] = 0;
    return dateDataToEpoch(this.dateData, this.timezoneOffsetMs, this.dst);
  }
}
