import { LoginProps } from '@/types';
import { LocaleValue } from '@/types/interfaces';
import { prepagePage } from '@/utils/lib';
import Request from '@/utils/request';
import { PageName } from '@prisma/client';
import { GetStaticPropsContext } from 'next';

const request = new Request();

// eslint-disable-next-line import/prefer-default-export
export function getStaticPropsLogin(name: PageName): (
  // eslint-disable-next-line no-unused-vars
  contenxt: GetStaticPropsContext
) => Promise<{ props: Omit<LoginProps, 'app'> }> {
  return async ({ locale }: GetStaticPropsContext) => {
    const localeLogin = await request.getLocale({ field: 'login', locale });
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
      },
    };
  };
}
