import React from 'react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import AppBar from '../../components/AppBar';
import { AppProps, PageFull } from '../../types';
import { Locale, LocaleValue } from '../../types/interfaces';
import { prepagePage } from '../../utils/lib';
import Request from '../../utils/request';
import s from '../../styles/Page.module.scss';
import About from '../../components/About';

const request = new Request();

interface AboutPageProps extends AppProps {
  localeAppBar: Locale['app']['appBar'];
  localeAbout: Locale['app']['about'];
  localeCommon: Locale['app']['common'];
  page: PageFull;
}

export default function AboutPage({
  app: { user, theme },
  localeAppBar,
  page,
  localeAbout,
  localeCommon,
}: AboutPageProps) {
  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
      </Head>
      <AppBar user={user} theme={theme} locale={localeAppBar} full />
      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        <About
          policyTitle={localeCommon.policyTitle}
          rulesTitle={localeCommon.rulesTitle}
          locale={localeAbout}
          title={page.title}
          theme={theme}
          description={page.description}
          user={user}
        />
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<AboutPageProps, 'app'> }> {
  const localeAppBar = await request.getLocale({ field: 'appBar', locale });
  const localeAbout = await request.getLocale({ field: 'about', locale });
  const localeCommon = await request.getLocale({ field: 'common', locale });
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'about',
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
      localeAbout: localeAbout.data,
      localeCommon: localeCommon.data,
    },
  };
}
