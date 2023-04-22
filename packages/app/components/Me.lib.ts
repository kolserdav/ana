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
