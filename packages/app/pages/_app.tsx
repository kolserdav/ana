import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import Alert from '../components/ui/Alert';
import LoaderLine from '../components/ui/LoaderLine';
import useApp from '../hooks/useApp';
import useUser from '../hooks/useUser';
import '../styles/globals.scss';
import { ERUDA } from '../utils/constants';

export default function App({ Component, pageProps }: AppProps) {
  const { load, theme, touchpad } = useApp();

  const { user, userLoad } = useUser();

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
      <LoaderLine open={load} />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} app={{ theme, user, userLoad, touchpad }} />
      <Alert theme={theme} />
    </>
  );
}
