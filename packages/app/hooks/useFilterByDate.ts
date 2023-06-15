import { useEffect, useState } from 'react';
import { DateFilter } from '../types';
import { LocalStorageName, getLocalStorage, setLocalStorage } from '../utils/localStorage';
import { DATE_FILTER_ALL } from '../utils/constants';

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

const useFilterByDate = ({ withSave }: { withSave?: boolean }) => {
  const [date, setDate] = useState<DateFilter>();
  const [gt, setGT] = useState<string>();

  const onChangeDateFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      target: { value },
    } = e;
    setDate(value as DateFilter);
    if (withSave) {
      setLocalStorage(LocalStorageName.FILTER_BY_DATE, value as DateFilter);
    }
  };

  /**
   * Set date
   */
  useEffect(() => {
    if (!withSave) {
      setDate(DATE_FILTER_ALL);
      return;
    }

    const savedDate = getLocalStorage(LocalStorageName.FILTER_BY_DATE);
    setDate(savedDate || DATE_FILTER_ALL);
  }, [withSave]);

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

    if (withSave) {
      setLocalStorage(LocalStorageName.FILTER_BY_DATE, DATE_FILTER_ALL);
    }
  };

  return { gt, onChangeDateFilter, date, resetFilterByDate };
};

export default useFilterByDate;
