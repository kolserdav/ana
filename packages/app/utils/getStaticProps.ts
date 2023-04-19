import { GetStaticPropsContext } from 'next';
import { PageName } from '@prisma/client';
import { LoginProps } from '../types';
import { LocaleValue } from '../types/interfaces';
import { prepagePage } from './lib';
import Request from './request';

const request = new Request();

// eslint-disable-next-line import/prefer-default-export
export function getStaticPropsLogin(
  name: PageName
  // eslint-disable-next-line no-unused-vars
): (context: GetStaticPropsContext) => Promise<{ props: Omit<LoginProps, 'app'> }> {
  return async ({ locale }: GetStaticPropsContext) => {
    const localeLogin = await request.getLocale({ field: 'login', locale });
    const localeCommon = await request.getLocale({ field: 'common', locale });
    const localeAppBar = await request.getLocale({ field: 'appBar', locale });
    const page = await request.pageFindMany({
      where: {
        AND: [
          {
            name,
          },
          {
            lang: locale as LocaleValue,
          },
        ],
      },
    });
    return {
      props: {
        localeAppBar: localeAppBar.data,
        localeLogin: localeLogin.data,
        page: prepagePage(page.data),
        localeCommon: localeCommon.data,
      },
    };
  };
}
