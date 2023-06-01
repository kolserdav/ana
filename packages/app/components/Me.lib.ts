import { DateFilter } from '../types';
import { firstCapitalize } from '../types/interfaces';

// eslint-disable-next-line import/prefer-default-export
export const setMatchesBold = ({ text, matches }: { text: string; matches: string[] }) => {
  let res = text;

  const createBoldItem = (item: string) => `<b>${item}</b>`;

  matches.forEach((item) => {
    if (item === '') {
      return;
    }
    const words = text.match(new RegExp(`${item}`, 'g'));
    if (words) {
      words.forEach((_item) => {
        res = res.replace(_item, createBoldItem(_item));
      });
    }

    const wordsFC = text.match(new RegExp(`${firstCapitalize(item)}`, 'g'));
    if (wordsFC) {
      wordsFC.forEach((_item) => {
        res = res.replace(_item, createBoldItem(_item));
      });
    }

    const wordsUC = text.match(new RegExp(`${item.toUpperCase()}`, 'g'));
    if (wordsUC) {
      wordsUC.forEach((_item) => {
        res = res.replace(_item, createBoldItem(_item));
      });
    }

    const wordsLC = text.match(new RegExp(`${item.toLowerCase()}`, 'g'));
    if (wordsLC) {
      wordsLC.forEach((_item) => {
        res = res.replace(_item, createBoldItem(_item));
      });
    }
  });
  return res;
};

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
