// eslint-disable-next-line import/prefer-default-export
export const gettextAreaRows = (value: string) => {
  let c = 1;
  for (let i = 0; value[i]; i++) {
    if (value[i] === '\n') {
      c++;
    }
  }
  return c;
};
