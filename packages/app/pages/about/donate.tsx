import type { GetStaticPropsContext } from 'next';
import { DocumentProps, AppProps } from '../../types';
import { getStaticPropsDocument } from '../../utils/getStaticProps';
import DocumentPage from '../../components/DocumentPage';
import Link from '../../components/ui/Link';
import { DONATE_LINK } from '../../utils/constants';
import p from '../../styles/Page.module.scss';

interface MyAppProps extends AppProps {
  donationLink: string;
}

function RulesPage(props: DocumentProps & MyAppProps) {
  const {
    donationLink,
    app: { theme },
  } = props;
  return (
    <div className={p.wrapper}>
      <DocumentPage {...props} />
      <div className={p.link_container}>
        <Link theme={theme} href={DONATE_LINK}>
          {donationLink}
        </Link>
      </div>
    </div>
  );
}

export async function getStaticProps(
  args: GetStaticPropsContext
): Promise<{ props: Omit<DocumentProps, 'app'> }> {
  return getStaticPropsDocument('donate')(args);
}

export default RulesPage;
