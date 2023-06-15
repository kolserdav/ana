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

  const { statistics } = useStatistics({ user, setLoad, gt });

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
      </div>
    </div>
  );
}

export default Statistics;
