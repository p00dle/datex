type NumberOrFn = number | ((...args: any[]) => number);
interface Returns {
  now: NumberOrFn;
  utc: NumberOrFn;
  year: NumberOrFn;
  month: NumberOrFn;
  date: NumberOrFn;
  day: NumberOrFn;
  timezoneOffset: NumberOrFn;
  value: NumberOrFn;
}

function valOrFn(val: NumberOrFn, args: any[] = []): number {
  return typeof val === 'function' ? val(...args) : val;
}

export class MockDate {
  static returns: Returns = {
    now: 0,
    utc: 0,
    year: 0,
    month: 0,
    date: 0,
    day: 0,
    timezoneOffset: 0,
    value: 0,
  };
  static onSetMonth: ((month: number) => void) | null = null;
  static onSetDate: ((month: number) => void) | null = null;
  static now(): number {
    return valOrFn(MockDate.returns.now);
  }
  static UTC(...args: number[]): number {
    return valOrFn(MockDate.returns.utc, args);
  }
  public getUTCFullYear(): number {
    return valOrFn(MockDate.returns.year);
  }
  public getUTCMonth(): number {
    return valOrFn(MockDate.returns.month);
  }
  public getUTCDay(): number {
    return valOrFn(MockDate.returns.day);
  }
  public getFullYear(): number {
    return valOrFn(MockDate.returns.year);
  }
  public getDate(): number {
    return valOrFn(MockDate.returns.date);
  }
  public getDay(): number {
    return valOrFn(MockDate.returns.day);
  }
  public getTimezoneOffset(): number {
    return valOrFn(MockDate.returns.timezoneOffset);
  }
  public valueOf(): number {
    return valOrFn(MockDate.returns.value);
  }
  public setMonth(month: number, _date?: number | undefined): number {
    MockDate.onSetMonth(month);
    return 0;
  }
  public setDate(date: number): number {
    MockDate.onSetDate(date);
    return 0;
  }
}
