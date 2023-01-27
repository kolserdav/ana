import storeClick, { changeClick } from '@/store/click';
import storeScroll, { changeScroll } from '@/store/scroll';
import '@/styles/globals.scss';
import { setBodyScroll } from '@/utils/lib';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  /**
   * Scroll handler
   */
  useEffect(() => {
    const scrollHandler = () => {
      const { scroll } = storeScroll.getState();
      storeScroll.dispatch(changeScroll({ scroll: !scroll }));
    };
    window.addEventListener('scroll', scrollHandler);
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  /**
   * Click handler
   */
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      storeClick.dispatch(changeClick({ clientX, clientY }));
    };
    document.addEventListener('click', clickHandler);
    return () => {
      document.removeEventListener('click', clickHandler);
    };
  }, []);

  /**
   * Set body scroll
   */
  useEffect(() => {
    setBodyScroll(true);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
