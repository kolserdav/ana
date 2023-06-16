import { Theme } from '../Theme';
import useFilterByDate from '../hooks/useFilterByDate';
import useLoad from '../hooks/useLoad';
import { Locale, UserCleanResult } from '../types/interfaces';
import { useStatistics } from './Statistics.hooks';
import s from './Statistics.module.scss';
import SelectDateFilter from './ui/SelectDateFilter';
import Typography from './ui/Typography';

function Statistics({
  theme,
  user,
  locale,
  dateFilter,
}: {
  theme: Theme;
  user: UserCleanResult | null;
  locale: Locale['app']['statistics'];
  dateFilter: Locale['app']['common']['dateFilter'];
}) {
  const { setLoad } = useLoad();

  const { onChangeDateFilter, gt, date, resetFilterByDate } = useFilterByDate({ withSave: false });

  const { statistics } = useStatistics({ user, setLoad, gt, dateFilter: date });

  <SelectDateFilter onChange={onChangeDateFilter} locale={dateFilter} date={date} theme={theme} />;

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography variant="h1" theme={theme} align="center" fullWidth>
          {locale.title}
        </Typography>
        <div className={s.global_filters__item}>
          <SelectDateFilter
            onChange={onChangeDateFilter}
            locale={dateFilter}
            date={date}
            theme={theme}
          />
        </div>
        <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 10 L20,20 Z" fill="transparent" stroke={theme.text} strokeWidth={4} />
        </svg>
      </div>
    </div>
  );
}

export default Statistics;
