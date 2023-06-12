import { DateFilter } from '../types';
import { firstCapitalize } from '../types/interfaces';
import {
  FIXED_TOOLS_HIGHT,
  PLAY_ALL_SCROLL_BY_TOP_SHIFT,
  DATA_TYPE_PLAY_BUTTON,
  DATA_TYPE_PHRASE,
} from '../utils/constants';
import { LocalStorageName, getLocalStorage } from '../utils/localStorage';

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

export function getPlayButtonFromContainer({
  current,
  currentPlay,
}: {
  current: HTMLDivElement;
  currentPlay: number;
}): HTMLButtonElement | null | undefined {
  if (!current.children[currentPlay]) {
    return undefined;
  }
  return current.children[currentPlay].querySelector(
    `button[datatype="${DATA_TYPE_PLAY_BUTTON}"]`
  ) as HTMLButtonElement;
}

export function getPlayText({
  current,
  currentPlay,
}: {
  current: HTMLDivElement;
  currentPlay: number;
}): string | null | undefined {
  if (!current.children[currentPlay]) {
    return undefined;
  }
  const elem = current.children[currentPlay].querySelector(`div[datatype="${DATA_TYPE_PHRASE}"]`);
  if (!elem) {
    return null;
  }
  return elem.firstElementChild?.innerHTML;
}

export const scrollTo = ({ element }: { element: HTMLElement }) => {
  const { y } = element.getBoundingClientRect();
  window.scrollTo({
    top:
      y +
      (window.scrollY > y ? window.scrollY : 0) -
      FIXED_TOOLS_HIGHT -
      PLAY_ALL_SCROLL_BY_TOP_SHIFT,
    behavior: 'smooth',
  });
};

export const getAnimationDuration = (textLenght: number) => {
  const _speechSpeed = getLocalStorage(LocalStorageName.SPEECH_SPEED);
  const speechSpeed = _speechSpeed || 1;
  return textLenght * speechSpeed * 0.04;
};

export function changeLinks(inputText: string) {
  let replacedText = inputText;

  // URLs starting with http://, https://, or ftp://
  // eslint-disable-next-line no-useless-escape
  const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

  // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  // eslint-disable-next-line no-useless-escape
  const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(
    replacePattern2,
    '$1<a href="http://$2" target="_blank">$2</a>'
  );

  // Change email addresses to mailto:: links.
  // eslint-disable-next-line no-useless-escape
  const replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

  return replacedText;
}
