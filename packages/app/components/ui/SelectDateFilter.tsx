import { Theme } from '../../Theme';
import { DateFilter } from '../../types';
import { Locale } from '../../types/interfaces';
import Select from './Select';

function SelectDateFilter({
  locale,
  theme,
  onChange,
  date,
}: {
  locale: Locale['app']['common']['dateFilter'];
  theme: Theme;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  date: DateFilter | undefined;
}) {
  return (
    <Select onChange={onChange} value={date} theme={theme}>
      <option value="all-time">{locale.forAllTime}</option>
      <option value="day">{locale.forDay}</option>
      <option value="week">{locale.forWeek}</option>
      <option value="month">{locale.forMonth}</option>
      <option value="three-months">{locale.forThreeMoths}</option>
      <option value="six-months">{locale.forSixMonths}</option>
      <option value="year">{locale.forYear}</option>
    </Select>
  );
}

export default SelectDateFilter;
