import { firstCapitalize } from '../types/interfaces';
import {
  FIXED_TOOLS_HIGHT,
  PLAY_ALL_SCROLL_BY_TOP_SHIFT,
  DATA_TYPE_PLAY_BUTTON,
  DATA_TYPE_PHRASE,
  TICKER_DURATION_COEFFICIENT,
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
  return current.children[currentPlay]
    .querySelector(`div[datatype="${DATA_TYPE_PLAY_BUTTON}"]`)
    ?.querySelector('button') as HTMLButtonElement;
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

export const scrollTo = ({
  element,
  selectedFixed,
}: {
  element: HTMLElement;
  selectedFixed: boolean;
}) => {
  const { y } = element.getBoundingClientRect();
  window.scrollTo({
    top:
      y +
      (window.scrollY > y ? window.scrollY : 0) -
      FIXED_TOOLS_HIGHT * (selectedFixed ? 2 : 1) -
      PLAY_ALL_SCROLL_BY_TOP_SHIFT,
    behavior: 'smooth',
  });
};

export const getAnimationDuration = (textLenght: number) => {
  const _speechSpeed = getLocalStorage(LocalStorageName.SPEECH_SPEED);
  const speechSpeed = _speechSpeed || 1;
  return textLenght * speechSpeed * TICKER_DURATION_COEFFICIENT;
};

// eslint-disable-next-line no-useless-escape
const HTTP_LINKS_REGEX = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
// eslint-disable-next-line no-useless-escape
const WWW_LINKS_REGEX = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
// eslint-disable-next-line no-useless-escape
const EMAIL_LINK_REGEX = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;

/**
 * From here https://stackoverflow.com/a/3890175/8111346
 */
export function changeLinks(inputText: string) {
  let replacedText = inputText;

  replacedText = inputText.replace(HTTP_LINKS_REGEX, '<a href="$1" target="_blank">$1</a>');

  replacedText = replacedText.replace(
    WWW_LINKS_REGEX,
    '$1<a href="http://$2" target="_blank">$2</a>'
  );

  replacedText = replacedText.replace(EMAIL_LINK_REGEX, '<a href="mailto:$1">$1</a>');

  return replacedText;
}

export function cleanLinks(inputText: string, changeTo = '') {
  let replacedText = inputText;

  replacedText = inputText.replace(/<a.+<\/a>/g, changeTo);

  return replacedText;
}
