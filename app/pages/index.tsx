import Head from 'next/head';
import s from '@/styles/Home.module.scss';
import { GetStaticPropsContext } from 'next';
import Request from '@/utils/request';
import { LocaleValue, Locale } from '@/types/interfaces';
import { AppProps, PageFull } from '@/types';
import { prepagePage } from '@/utils/lib';

const request = new Request();

interface LoginProps extends AppProps {
  page: PageFull;
}

export default function HomePage({ page, app: { theme } }: LoginProps) {
  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <meta name="keywords" content={page.keywords} />
      </Head>

      <main className={s.wrapper} style={{ backgroundColor: theme.paper }}>
        Home
      </main>
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<LoginProps, 'app'> }> {
  const page = await request.pageFindMany({
    where: {
      AND: [
        {
          name: 'index',
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
    },
  };
}
