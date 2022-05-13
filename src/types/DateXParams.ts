import type { LocaleName } from '../locales';
import type { DST } from './DST';

export interface DateXParams {
  format?: string;
  locale?: LocaleName;
  timezoneOffset?: number | 'local';
  dst?: DST;
}
