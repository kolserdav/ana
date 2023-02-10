import { Locale } from '../types/interfaces';

export const checkName = (name: string) => /^[a-zA-Zа-яА-Я]+$/.test(name);

export const checkOnlyNumbers = (str: string) => /^\d+$/.test(str);

export const checkOnlyLetters = (str: string) => /^[a-zA-Zа-яА-Я]+$/.test(str);

export const checkPasswordError = ({
  password,
  locale,
}: {
  password: string;
  locale: Locale['app']['login'];
}) => {
  const onlyNumbers = checkOnlyNumbers(password);
  const onlyLetters = checkOnlyLetters(password);
  let error = '';
  if (onlyLetters || onlyNumbers) {
    error = `${locale.passwordMustContain}${onlyNumbers ? locale.letter : locale.number}`;
  }
  return error;
};
