import { format, intervalToDuration } from 'date-fns';
import { DateTruncateArgument, Locale } from '../types/interfaces';
import { DATE_LOCALE } from '../utils/lib';

export const isoToDate = ({
  date,
  trunkArg,
  locale,
}: {
  date: string;
  trunkArg: DateTruncateArgument;
  locale: keyof typeof DATE_LOCALE;
}) => {
  let _format = 'MM.dd';
  switch (trunkArg) {
    case 'week':
      _format = 'dd LLLL';
      break;
    case 'hour':
      _format = 'hh';
      break;
    case 'day':
      _format = 'EEEE';
      break;
    case 'year':
      _format = 'yyyy';
      break;
    case 'month':
      _format = 'LLLL';
      break;
    default:
  }
  return format(new Date(date), _format, { locale: DATE_LOCALE[locale] });
};

export const timestampToTime = ({
  date,
  locale: l,
}: {
  date: number;
  trunkArg: DateTruncateArgument;
  locale: Locale['app']['statistics']['dateDuration'];
}) => {
  const d1 = new Date();
  d1.setFullYear(0);
  d1.setMonth(0);
  d1.setHours(0);
  d1.setMinutes(0);
  d1.setSeconds(0);
  d1.setMilliseconds(0);

  const d2 = new Date();
  d2.setFullYear(0);
  d2.setMonth(0);
  d2.setHours(0);
  d2.setMinutes(0);
  d2.setSeconds(date);
  d2.setMilliseconds(0);

  const d = intervalToDuration({
    start: d1,
    end: d2,
  });
  let res = `${d.years} ${l.years} ${d.months} ${l.months} ${d.days} ${l.days} ${d.hours} ${l.hours} ${d.minutes} ${l.minutes} ${d.seconds} ${l.seconds}`;
  if (d.years === 0) {
    res = `${d.months} ${l.months} ${d.days} ${l.days} ${d.hours} ${l.hours} ${d.minutes} ${l.minutes} ${d.seconds} ${l.seconds}`;
  }
  if (d.months === 0) {
    res = `${d.days} ${l.days} ${d.hours} ${l.hours} ${d.minutes} ${l.minutes} ${d.seconds} ${l.seconds}`;
  }
  if (d.days === 0) {
    res = `${d.hours} ${l.hours} ${d.minutes} ${l.minutes} ${d.seconds} ${l.seconds}`;
  }
  if (d.hours === 0) {
    res = `${d.minutes} ${l.minutes} ${d.seconds} ${l.seconds}`;
  }
  if (d.minutes === 0) {
    res = `${d.seconds} ${l.seconds}`;
  }

  return res;
};
