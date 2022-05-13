export interface Locale {
  getOrdinal: (n: number) => string;
  monthNames: string[];
  weekDays: string[];
}
