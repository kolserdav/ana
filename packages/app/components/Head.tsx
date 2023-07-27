import NextHead from 'next/head';

function Head({
  title,
  description,
  keywords,
  noIndex,
}: {
  title: string;
  description?: string;
  keywords?: string;
  noIndex?: boolean;
}) {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:title" content={title} />
      <meta property="og:type" content="website" />
      <meta name="og:description" content={description} />
      <meta name="og:title" content={title} />
      <link rel="icon" href="/favicon.ico" />
    </NextHead>
  );
}

Head.defaultProps = {
  noIndex: false,
  description: undefined,
  keywords: undefined,
};

export default Head;
