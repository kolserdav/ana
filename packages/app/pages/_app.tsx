import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { GetStaticPropsContext } from 'next';
import Alert from '../components/ui/Alert';
import LoaderLine from '../components/ui/LoaderLine';
import useApp from '../hooks/useApp';
import useUser from '../hooks/useUser';
import '../styles/globals.scss';
import { ERUDA } from '../utils/constants';
import useLocale from '../hooks/useLocale';
import AcceptCookies from '../components/AcceptCookies';
import Request from '../utils/request';

const request = new Request();

interface MyAppProps {
  noInternet: boolean;
}

export default function App({ Component, pageProps, noInternet }: MyAppProps & AppProps) {
  const { user, userLoad } = useUser();

  const { locale } = useLocale();

  console.log(noInternet);

  const {
    load,
    theme,
    touchpad,
    connId,
    acceptCookies,
    onClickAcceptCookies,
    showAcceptCookies,
    url,
    urlDefault,
    isAndroid,
  } = useApp({
    user,
    connectionRefused: locale?.connectionRefused || 'Connection refused',
    connectionReOpened: locale?.connectionReOpened || 'Connection re-established',
    userLoad,
  });

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {ERUDA && (
        <Script
          strategy="afterInteractive"
          src="//cdn.jsdelivr.net/npm/eruda"
          onLoad={() => {
            // @ts-ignore
            if (typeof eruda !== 'undefined') {
              // @ts-ignore
              eruda.init();
            }
          }}
        />
      )}
      <LoaderLine open={load} color={theme.cyan} />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component
        {...pageProps}
        app={{
          theme,
          user,
          userLoad,
          touchpad,
          connId,
          url: url === 'null' ? null : url,
          urlDefault,
          isAndroid,
        }}
      />
      {showAcceptCookies && (
        <AcceptCookies
          open={!acceptCookies}
          theme={theme}
          policyTitle={locale?.withPolicy || ''}
          text={locale?.acceptCookies || ''}
          button={locale?.ok || ''}
          onClick={onClickAcceptCookies}
        />
      )}
      <Alert theme={theme} />
    </>
  );
}

export async function getStaticProps({
  locale,
}: GetStaticPropsContext): Promise<{ props: Omit<MyAppProps, 'app'> }> {
  const localeCommon = await request.getLocale({ field: 'common', locale });
  let noInternet = false;
  if (!localeCommon) {
    noInternet = true;
  }
  return {
    props: {
      noInternet,
    },
  };
}
