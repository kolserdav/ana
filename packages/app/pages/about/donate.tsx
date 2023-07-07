import type { GetStaticPropsContext } from 'next';
import { DocumentProps, AppProps } from '../../types';
import { getStaticPropsDocument } from '../../utils/getStaticProps';
import DocumentPage from '../../components/DocumentPage';
import p from '../../styles/Page.module.scss';

interface MyAppProps extends AppProps {
  donationLink: string;
}

function DonatePage(props: DocumentProps & MyAppProps) {
  return (
    <div className={p.wrapper}>
      <DocumentPage {...props} />
    </div>
  );
}

export async function getStaticProps(
  args: GetStaticPropsContext
): Promise<{ props: Omit<DocumentProps, 'app'> }> {
  return getStaticPropsDocument('donate')(args);
}

export default DonatePage;
