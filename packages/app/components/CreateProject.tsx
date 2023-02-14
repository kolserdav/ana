import dynamic from 'next/dynamic';
import useLoad from '../hooks/useLoad';
import { Theme } from '../Theme';
import { useDescriptionInput } from './CreateProject.hooks';
import s from './CreateProject.module.scss';

const HtmlEditor = dynamic(() => import('./ui/HtmlEditor'), { ssr: false });

function CreateProject({ theme }: { theme: Theme }) {
  const { load } = useLoad();

  const { description, onChangeDescription } = useDescriptionInput();

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <HtmlEditor onChange={onChangeDescription} theme={theme} />
      </div>
    </div>
  );
}

export default CreateProject;
