import type { GetStaticPropsContext } from 'next';
import { DocumentProps } from '../types';
import { getStaticPropsDocument } from '../utils/getStaticProps';
import DocumentPage from '../components/DocumentPage';

function RulesPage(props: DocumentProps) {
  return <DocumentPage {...props} />;
}

export async function getStaticProps(
  args: GetStaticPropsContext
): Promise<{ props: Omit<DocumentProps, 'app'> }> {
  return getStaticPropsDocument('rules')(args);
}

export default RulesPage;
