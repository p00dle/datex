import { MockDate } from '../mocks/MockDate';
import {
  MONTH_DAY_COUNT,
  MONTH_DAY_COUNT_LEAP,
  MONTH_WEEKDAY,
  MAR_1WD_CACHE,
  MONTH_QUARTER_MAP,
  DAYS_TO_MONTH,
  DAYS_TO_MONTH_LEAP,
  createDateData,
  populateWeekday,
  populateLeapYear,
  YEAR,
  MONTH,
  DAY,
  HOURS,
  MINUTES,
  SECONDS,
  MILLISECONDS,
  QUARTER,
  IS_DST,
  WEEKDAY,
  YEARS_SINCE_1970,
  N,
  IS_LEAP_YEAR,
  DateX,
} from '../src';
import { isLeapYear } from '../src/utils/is-leap-year';
import { range } from '../src/utils/range';

describe('exports', () => {
  it('main class', () => expect(new DateX() instanceof DateX).toBe(true));
  it('dateData accessors', () =>
    expect(
      [YEAR, MONTH, DAY, HOURS, MINUTES, SECONDS, MILLISECONDS, QUARTER, IS_DST, WEEKDAY, YEARS_SINCE_1970, N, IS_LEAP_YEAR].every(
        (x) => typeof x === 'number'
      )
    ).toBe(true));
  it('helper functions', () => expect([createDateData, populateWeekday, populateLeapYear].every((x) => typeof x === 'function')).toBe(true));
  it('constants', () =>
    expect(
      [MONTH_DAY_COUNT, MONTH_DAY_COUNT_LEAP, MONTH_WEEKDAY, MAR_1WD_CACHE, MONTH_QUARTER_MAP, DAYS_TO_MONTH, DAYS_TO_MONTH_LEAP].every(
        (arr) => Array.isArray(arr) && arr.length > 0
      )
    ).toBe(true));
});

describe('stringify-parse works with defaults', () => {
  it('stringify-parse is consistent', () => {
    const datex = new DateX();
    const dateEpochs: number[] = [];
    let errorMessage: string | null = null;
    for (const year of range(1970, 2102, 1, true)) {
      for (const month of range(0, 12, 1, true)) {
        for (const day of range(1, (isLeapYear(year) ? MONTH_DAY_COUNT_LEAP : MONTH_DAY_COUNT)[month + 1], 1, true)) {
          dateEpochs.push(Date.UTC(year, month, day));
        }
      }
    }
    for (let i = 0; i < dateEpochs.length; i++) {
      const input = dateEpochs[i];
      const dateString = datex.stringify(input);
      const output = datex.parse(dateString);
      if (input !== output) {
        errorMessage = `
[DATE STRING]   ${dateString}
[INPUT EPOCH]   ${input}
[OUTPUT EPOCH]  ${output}
[INPUT DATE]    ${new Date(input)}
[OUTPUT DATE]   ${new Date(output)}
`;
        break;
      }
    }
    expect(errorMessage).toBe(null);
  });
});

describe('local timezone offset detection', () => {
  it('detects local timezone offset', () => {
    MockDate.returns.timezoneOffset = -540;
    MockDate.returns.year = 2000;
    const datex = new DateX({ timezoneOffset: 'local' }, MockDate);
    expect(datex.parse('2000-01-01T09:00:00.000Z')).toBe(Date.UTC(2000, 0, 1));
  });
});

describe('local timezone dst detection', () => {
  it('detects dst: none', () => {
    MockDate.returns.year = 2000;
    MockDate.onSetDate = () => null;
    MockDate.onSetMonth = () => null;
    MockDate.returns.timezoneOffset = 0;
    const datex = new DateX({ dst: 'local' }, MockDate);
    expect(datex.parse('2000-01-01T00:00:00.000Z')).toBe(Date.UTC(2000, 0, 1));
  });
  it('detects dst: us', () => {
    MockDate.returns.year = 2000;
    MockDate.returns.timezoneOffset = 0;
    MockDate.onSetMonth = () => {
      MockDate.returns.timezoneOffset = -60;
    };
    MockDate.returns.day = 6;
    MockDate.onSetDate = () => {
      MockDate.returns.timezoneOffset = 0;
    };
    const datex = new DateX({ dst: 'local' }, MockDate);
    expect(datex.parse('2000-07-01T01:00:00.000Z')).toBe(Date.UTC(2000, 6, 1));
  });
  it('detects dst: eu', () => {
    MockDate.returns.year = 2000;
    MockDate.returns.timezoneOffset = 0;
    MockDate.onSetMonth = () => {
      MockDate.returns.timezoneOffset = -60;
    };
    MockDate.returns.day = 6;
    MockDate.onSetDate = () => null;
    const datex = new DateX({ dst: 'local' }, MockDate);
    expect(datex.parse('2000-07-01T01:00:00.000Z')).toBe(Date.UTC(2000, 6, 1));
  });
});

describe('locale', () => {
  it('en', () => expect(new DateX({ locale: 'en' }) instanceof DateX).toBe(true));
  it('pl', () => expect(new DateX({ locale: 'pl' }) instanceof DateX).toBe(true));
  // @ts-expect-error fallback in case locale is not in the known list
  it('default', () => expect(new DateX({ locale: 'invalid' }) instanceof DateX).toBe(true));
});

describe('AM /PM', () => {
  const datex = new DateX({ format: 'YYYY-MM-DD HH:mm AM' });
  it('parses AM/PM', () => {
    expect(datex.parse('2000-01-01 12:00 AM')).toEqual(Date.UTC(2000, 0, 1));
    expect(datex.parse('2000-01-01 12:00 PM')).toEqual(Date.UTC(2000, 0, 1, 12));
    expect(datex.parse('2000-01-01 07:00 AM')).toEqual(Date.UTC(2000, 0, 1, 7));
    expect(datex.parse('2000-01-01 07:00 PM')).toEqual(Date.UTC(2000, 0, 1, 19));
  });
  it('stringifies AM/PM', () => {
    expect(datex.stringify(Date.UTC(2000, 0, 1))).toEqual('2000-01-01 12:00 AM');
    expect(datex.stringify(Date.UTC(2000, 0, 1, 12))).toEqual('2000-01-01 12:00 PM');
    expect(datex.stringify(Date.UTC(2000, 0, 1, 7))).toEqual('2000-01-01 07:00 AM');
    expect(datex.stringify(Date.UTC(2000, 0, 1, 19))).toEqual('2000-01-01 07:00 PM');
  });
});

describe('DateX static helper methods', () => {
  it('toDate', () => expect(DateX.toDate(Date.UTC(2000, 0, 1, 2, 3, 4, 5))).toBe(Date.UTC(2000, 0, 1)));
  it('days', () => expect(DateX.days(5)).toBe(5 * 24 * 60 * 60 * 1000));
  it('hours', () => expect(DateX.hours(4)).toBe(4 * 60 * 60 * 1000));
  it('minutes', () => expect(DateX.minutes(57)).toBe(57 * 60 * 1000));
  it('seconds', () => expect(DateX.seconds(12)).toBe(12 * 1000));
});

describe('DateX instance helper methods', () => {
  const now = Date.UTC(2000, 0, 2, 3, 4, 5, 6);
  MockDate.returns.now = now;
  const datex = new DateX(undefined, MockDate);
  it('now', () => expect(datex.now()).toBe(now));
  it('yesterday', () => expect(datex.yesterday()).toBe(Date.UTC(2000, 0, 1)));
  it('today', () => expect(datex.today()).toBe(Date.UTC(2000, 0, 2)));
  it('tomorrow', () => expect(datex.tomorrow()).toBe(Date.UTC(2000, 0, 3)));
});

describe('getLastPeriod', () => {
  it('years', () => {
    const datex = new DateX(undefined, MockDate);
    MockDate.returns.value = Date.UTC(2000, 7, 2, 3, 4, 5, 6);
    MockDate.returns.year = 2000;
    let current = false;
    let previous = false;
    MockDate.returns.utc = (Y, M, D) => {
      if (Y === 2000 && M === 0 && D === 1) current = true;
      else if (Y === 1999 && M === 0 && D === 1) previous = true;
      return 0;
    };
    datex.getLastPeriod('years');
    expect(current).toBe(true);
    datex.getLastPeriod('years', true);
    expect(previous).toBe(true);
  });
  it('quarters', () => {
    const datex = new DateX(undefined, MockDate);
    MockDate.returns.value = Date.UTC(2000, 7, 2, 3, 4, 5, 6);
    MockDate.returns.year = 2000;
    MockDate.returns.month = 7;
    let current = false;
    let previous = false;
    MockDate.returns.utc = (Y, M, D) => {
      if (Y === 2000 && M === 5 && D === 1) current = true;
      else if (Y === 2000 && M === 2 && D === 1) previous = true;
      return 0;
    };
    datex.getLastPeriod('quarters');
    expect(current).toBe(true);
    datex.getLastPeriod('quarters', true);
    expect(previous).toBe(true);
  });
  it('months', () => {
    const datex = new DateX(undefined, MockDate);
    MockDate.returns.value = Date.UTC(2000, 7, 2, 3, 4, 5, 6);
    MockDate.returns.year = 2000;
    MockDate.returns.month = 7;
    let current = false;
    let previous = false;
    MockDate.returns.utc = (Y, M, D) => {
      if (Y === 2000 && M === 7 && D === 1) current = true;
      else if (Y === 2000 && M === 6 && D === 1) previous = true;
      return 0;
    };
    datex.getLastPeriod('months');
    expect(current).toBe(true);
    datex.getLastPeriod('months', true);
    expect(previous).toBe(true);
  });
  it('weeks', () => {
    const datex = new DateX(undefined, MockDate);
    MockDate.returns.value = Date.UTC(2000, 7, 2, 3, 4, 5, 6);
    MockDate.returns.day = 3;
    expect(datex.getLastPeriod('weeks')).toBe(Date.UTC(2000, 6, 31));
    expect(datex.getLastPeriod('weeks', true)).toBe(Date.UTC(2000, 6, 24));
    MockDate.returns.value = Date.UTC(2000, 7, 6, 3, 4, 5, 6);
    MockDate.returns.day = 0;
    expect(datex.getLastPeriod('weeks')).toBe(Date.UTC(2000, 6, 31));
    expect(datex.getLastPeriod('weeks', true)).toBe(Date.UTC(2000, 6, 24));
  });
  it('days, hours, minutes, seconds', () => {
    const datex = new DateX(undefined, MockDate);
    MockDate.returns.value = 0;
    MockDate.returns.now = 0;
    expect(datex.getLastPeriod('days')).toBe(0);
    expect(datex.getLastPeriod('days', true, true)).toBe(-86_400_000);
    expect(datex.getLastPeriod('hours')).toBe(0);
    expect(datex.getLastPeriod('hours', true)).toBe(-3_600_000);
    expect(datex.getLastPeriod('minutes')).toBe(0);
    expect(datex.getLastPeriod('minutes', true, true)).toBe(-60_000);
    expect(datex.getLastPeriod('seconds')).toBe(0);
    expect(datex.getLastPeriod('seconds', true)).toBe(-1000);
  });
});

describe('getLastPeriods', () => {
  it('returns the right count', () => {
    const datex = new DateX(undefined, MockDate);
    MockDate.returns.value = 0;
    expect(datex.getLastPeriods('seconds', 5)).toHaveLength(5);
    expect(datex.getLastPeriods('seconds', 5, true, true)).toHaveLength(5);
    expect(datex.getLastPeriods('years', 5)).toHaveLength(5);
    expect(datex.getLastPeriods('years', 5, true, true)).toHaveLength(5);
  });
});

describe('dateRange', () => {
  it('returns the right count', () => {
    let datex = new DateX({ dst: 'eu' }, MockDate);
    let value = 0;
    MockDate.returns.value = () => value++;
    MockDate.returns.now = 0;
    expect(datex.range('years', 0, 1)).toHaveLength(1);
    value = 0;
    expect(datex.range('years', 0, 0, true, true, true)).toHaveLength(1);
    expect(datex.range('seconds', 0, 0)).toHaveLength(1);
    expect(datex.range('seconds', -1000, 0)).toHaveLength(2);
    expect(datex.range('seconds', -1000, 1000)).toHaveLength(3);
    datex = new DateX(undefined, MockDate);
    expect(datex.range('seconds', -1000, 1000, true)).toHaveLength(4);
    expect(datex.range('seconds', -1000, 1000, true, true, true)).toHaveLength(5);
  });
});

describe('parse returns NaN on invalid input', () => {
  const datex = new DateX();

  it('invalid format', () => expect(datex.parse('12-03-2001')).toBeNaN());
  it('empty string', () => expect(datex.parse('')).toBeNaN());
  // @ts-expect-error null not a valid input
  it('null', () => expect(datex.parse(null)).toBeNaN());
  // @ts-expect-error number not a valid input
  it('number', () => expect(datex.parse(0)).toBeNaN());
});

describe('stringify returns empty string on invalid input', () => {
  const datex = new DateX();
  it('NaN', () => expect(datex.stringify(NaN)).toBe(''));
  // @ts-expect-error string not a valid input
  it('string', () => expect(datex.stringify('')).toBe(''));
});

describe('dst', () => {
  it('eu', () => {
    const datex = new DateX({ dst: 'eu' });
    const dateEpochs: number[] = [];
    let errorMessage: string | null = null;
    for (const year of range(1999, 2005, 1, true)) {
      for (const month of range(0, 12, 1, true)) {
        for (const day of range(1, (isLeapYear(year) ? MONTH_DAY_COUNT_LEAP : MONTH_DAY_COUNT)[month + 1], 1, true)) {
          dateEpochs.push(Date.UTC(year, month, day));
        }
      }
    }
    for (let i = 0; i < dateEpochs.length; i++) {
      const input = dateEpochs[i];
      const dateString = datex.stringify(input);
      const output = datex.parse(dateString);
      if (input !== output) {
        errorMessage = `
  [DATE STRING]   ${dateString}
  [INPUT EPOCH]   ${input}
  [OUTPUT EPOCH]  ${output}
  [INPUT DATE]    ${new Date(input)}
  [OUTPUT DATE]   ${new Date(output)}
  `;
        break;
      }
    }
    expect(errorMessage).toBe(null);
  });
  it('us', () => {
    const datex = new DateX({ dst: 'us' });
    const dateEpochs: number[] = [];
    let errorMessage: string | null = null;
    for (const year of range(1999, 2005, 1, true)) {
      for (const month of range(0, 12, 1, true)) {
        for (const day of range(1, (isLeapYear(year) ? MONTH_DAY_COUNT_LEAP : MONTH_DAY_COUNT)[month + 1], 1, true)) {
          dateEpochs.push(Date.UTC(year, month, day));
        }
      }
    }
    for (let i = 0; i < dateEpochs.length; i++) {
      const input = dateEpochs[i];
      const dateString = datex.stringify(input);
      const output = datex.parse(dateString);
      if (input !== output) {
        errorMessage = `
  [DATE STRING]   ${dateString}
  [INPUT EPOCH]   ${input}
  [OUTPUT EPOCH]  ${output}
  [INPUT DATE]    ${new Date(input)}
  [OUTPUT DATE]   ${new Date(output)}
  `;
        break;
      }
    }
    expect(errorMessage).toBe(null);
  });
});

describe('get helper methods', () => {
  const datex = new DateX();
  const date = Date.UTC(2000, 0, 2, 3, 4, 5, 6);
  it('getYear', () => expect(datex.getYear(date)).toBe(2000));
  it('getMonth', () => expect(datex.getMonth(date)).toBe(1));
  it('getDay', () => expect(datex.getDay(date)).toBe(2));
  it('getHours', () => expect(datex.getHours(date)).toBe(3));
  it('getMinutes', () => expect(datex.getMinutes(date)).toBe(4));
  it('getSeconds', () => expect(datex.getSeconds(date)).toBe(5));
  it('getMilliseconds', () => expect(datex.getMilliseconds(date)).toBe(6));
});

describe('toUTC', () => {
  const date = Date.UTC(2000, 8, 2, 12);
  it('timezoneOffset', () => {
    expect(new DateX({ timezoneOffset: -6 }).toUTC(date)).toBe(Date.UTC(2000, 8, 2, 18));
  });
  it('dst', () => {
    expect(new DateX({ dst: 'eu' }).toUTC(date)).toBe(Date.UTC(2000, 8, 2, 13));
  });
  it('timezoneOffset and dst', () => {
    expect(new DateX({ dst: 'eu', timezoneOffset: -6 }).toUTC(date)).toBe(Date.UTC(2000, 8, 2, 19));
  });
});

describe('toDate', () => {
  const datetime = Date.UTC(2000, 0, 2, 3, 23, 13, 123);
  it('without tz offset', () => {
    expect(new DateX().toDate(datetime)).toBe(Date.UTC(2000, 0, 2));
  });
  it('with positive tz offset', () => {
    expect(new DateX({ timezoneOffset: 6 }).toDate(datetime)).toBe(Date.UTC(2000, 0, 1, 18));
  });
  it('with negative tz offset', () => {
    expect(new DateX({ timezoneOffset: -6 }).toDate(datetime)).toBe(Date.UTC(2000, 0, 1, 6));
  });
});

describe('parsing and stringifying non-standard formats', () => {
  it('', () => {
    const inputs = [
      Date.UTC(2000, 0, 2, 18, 4, 5, 6),
      Date.UTC(2000, 0, 2, 5, 4, 5, 6),
      Date.UTC(2000, 5, 6, 13, 40, 51, 656),
      Date.UTC(2000, 0, 11, 9, 34, 31, 6),
    ];
    const formats = ['YY-QQ-MMMM WWWW DDD H:m:S.s', 'YYYY-Q-MMM-D WWW HH:mm:SS.sss', 'YY-M-D H:m:S.s AM'];
    let errorMessage: string | null = null;
    mainLoop: for (const input of inputs) {
      for (const format of formats) {
        const datexObj = {
          standard: new DateX({ format }),
          'dst:us': new DateX({ format, dst: 'us' }),
          'dst:eu': new DateX({ format, dst: 'eu' }),
          'ts+5.5': new DateX({ format, timezoneOffset: 5.5 }),
          'ts-5': new DateX({ format, timezoneOffset: -5 }),
          'dst:us, ts-7': new DateX({ format, dst: 'us', timezoneOffset: -7 }),
        };
        for (const [name, datex] of Object.entries(datexObj)) {
          const dateString = datex.stringify(input);
          const output = datex.parse(dateString);
          if (input !== output) {
            errorMessage = `
[FORMAT]        ${format}
[DATEX]         ${name}
[DATE STRING]   ${dateString}
[INPUT EPOCH]   ${input}
[OUTPUT EPOCH]  ${output}
[INPUT DATE]    ${new Date(input)}
[OUTPUT DATE]   ${new Date(output)}`;
            break mainLoop;
          }
        }
      }
    }
    expect(errorMessage).toBeNull();
  });
});

describe('utils', () => {
  it('range', () => {
    expect(range(0, 3)).toEqual([0, 1, 2]);
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
    expect(range(0, 10, 2, true)).toEqual([0, 2, 4, 6, 8, 10]);
  });
});

describe('misc', () => {
  it('test for invalid 31st of June date', () => {
    const datex = new DateX({ format: 'DD/MM/YYYY', timezoneOffset: -7, dst: 'us' });
    expect(datex.stringify(1656660706225)).toBe('01/07/2022');
  });
});

/*
TODO
 - populateDst: DST: 'us', 'eu'
 - getLastPeriod, getLastPeriods, range: preserveUTC: true
 - getYear, getMonth, getDay, getHours, getMinutes, getSeconds, getMs, toUTC, 
 - fromUTC when DST is true
 - non standard formats parse and stringify
*/
