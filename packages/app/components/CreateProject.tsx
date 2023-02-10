import dynamic from 'next/dynamic';
import useLoad from '../hooks/useLoad';

const HtmlEditor = dynamic(() => import('./ui/HtmlEditor'), { ssr: false });

function CreateProject() {
  const { load } = useLoad();

  return <HtmlEditor />;
}

export default CreateProject;
