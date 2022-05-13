import { Locale } from '../../types';

export const locale: Locale = {
  monthNames: ['Styczeń', 'Luty', 'Marzec', 'Kwiecien', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
  weekDays: ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'],
  getOrdinal: (day: number): string => {
    if (day >= 10 && day <= 20) {
      return 'y';
    }
    const ones = day % 10;
    if (ones === 2 || ones === 3) {
      return 'i';
    } else {
      return 'y';
    }
  },
};
