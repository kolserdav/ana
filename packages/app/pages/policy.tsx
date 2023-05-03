import type { GetStaticPropsContext } from 'next';
import { DocumentProps } from '../types';
import { getStaticPropsDocument } from '../utils/getStaticProps';
import DocumentPage from '../components/DocumentPage';

function PolicyPage(props: DocumentProps) {
  return <DocumentPage {...props} />;
}

export async function getStaticProps(
  args: GetStaticPropsContext
): Promise<{ props: Omit<DocumentProps, 'app'> }> {
  return getStaticPropsDocument('policy')(args);
}

export default PolicyPage;
