import { useEffect, useState } from 'react';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';
import { DATE_FILTER_ALL, DATE_FILTER_STATISTICS_DEFAULT } from '../utils/constants';
import { DateFilter } from '../types/interfaces';

export const getGTDate = (filter: DateFilter) => {
  const date = new Date();
  switch (filter) {
    case 'day':
      date.setDate(date.getDate() - 1);
      break;
    case 'week':
      date.setDate(date.getDate() - 7);
      break;
    case 'month':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'three-months':
      date.setMonth(date.getMonth() - 3);
      break;
    case 'six-months':
      date.setMonth(date.getMonth() - 6);
      break;
    case 'year':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setFullYear(date.getFullYear() - 100);
  }
  return date.toISOString();
};

const useFilterByDate = ({
  localStorageName,
  def,
}: {
  localStorageName: LocalStorageName;
  def: DateFilter;
}) => {
  const [date, setDate] = useState<DateFilter>();
  const [gt, setGT] = useState<string>();

  const onChangeDateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = e;
    setDate(value as DateFilter);

    setLocalStorage(localStorageName, value as DateFilter);
  };

  /**
   * Set date
   */
  useEffect(() => {
    const savedDate = getLocalStorage(localStorageName);
    setDate((savedDate as DateFilter | null) || def || DATE_FILTER_ALL);
  }, [localStorageName, def]);

  /**
   * Set gt
   */
  useEffect(() => {
    if (!date) {
      return;
    }
    setGT(getGTDate(date));
  }, [date]);

  const resetFilterByDate = () => {
    setDate(DATE_FILTER_ALL);

    setLocalStorage(localStorageName, DATE_FILTER_ALL);
  };

  return { gt, onChangeDateFilter, date, resetFilterByDate };
};

export default useFilterByDate;
