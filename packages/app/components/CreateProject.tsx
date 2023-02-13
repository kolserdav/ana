import dynamic from 'next/dynamic';
import useLoad from '../hooks/useLoad';
import { Theme } from '../Theme';

const HtmlEditor = dynamic(() => import('./ui/HtmlEditor'), { ssr: false });

function CreateProject({ theme }: { theme: Theme }) {
  const { load } = useLoad();

  return <HtmlEditor theme={theme} />;
}

export default CreateProject;
