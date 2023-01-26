// eslint-disable-next-line import/prefer-default-export
export function checkSignUp(asPath: string) {
  return /\/account\/sign-up/.test(asPath);
}
