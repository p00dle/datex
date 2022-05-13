export interface DateLikeInstance {
  getFullYear(): number;
  getDate(): number;
  getDay(): number;
  getUTCFullYear(): number;
  getUTCMonth(): number;
  getUTCDay(): number;
  getTimezoneOffset(): number;
  setMonth(month: number, date?: number | undefined): number;
  setDate(date: number): number;
}

export interface DateLike {
  new (): DateLikeInstance;
  new (value: number | string): DateLikeInstance;
  new (year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): DateLikeInstance;
  now(): number;
  UTC(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number;
}
