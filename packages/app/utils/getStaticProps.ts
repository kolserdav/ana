import { GetStaticPropsContext } from 'next';
import { PageName } from '@prisma/client';
import { CreateProjectPageProps, LoginProps, MePageProps } from '../types';
import { LocaleValue } from '../types/interfaces';
import { prepagePage } from './lib';
import Request from './request';

const request = new Request();

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

export function getStaticPropsMe(name: PageName) {
  return async ({
    locale,
  }: GetStaticPropsContext): Promise<{ props: Omit<MePageProps, 'app'> }> => {
    const localeAppBar = await request.getLocale({ field: 'appBar', locale });
    const localeMe = await request.getLocale({ field: 'me', locale });
    const localeProjectStatus = await request.getLocale({ field: 'projectStatus', locale });
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
        page: prepagePage(page.data),
        localeAppBar: localeAppBar.data,
        localeMe: localeMe.data,
        localeProjectStatus: localeProjectStatus.data,
      },
    };
  };
}

export function getStaticPropsCreateProject(name: PageName) {
  return async ({
    locale,
  }: GetStaticPropsContext): Promise<{ props: Omit<CreateProjectPageProps, 'app'> }> => {
    const localeAppBar = await request.getLocale({ field: 'appBar', locale });
    const localeCommon = await request.getLocale({ field: 'common', locale });
    const localeCreateProject = await request.getLocale({ field: 'createProject', locale });
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
        page: prepagePage(page.data),
        localeAppBar: localeAppBar.data,
        localeCreateProject: localeCreateProject.data,
        localeCommon: localeCommon.data,
      },
    };
  };
}
