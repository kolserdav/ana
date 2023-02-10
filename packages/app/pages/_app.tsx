import Alert from '@/components/ui/Alert';
import LoaderLine from '@/components/ui/LoaderLine';
import useApp from '@/hooks/useApp';
import useUser from '@/hooks/useUser';
import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  const { load, theme } = useApp();

  const { user, userLoad } = useUser();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoaderLine open={load} />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} app={{ theme, user, userLoad }} />
      <Alert theme={theme} />
    </>
  );
}
