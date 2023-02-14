import dynamic from 'next/dynamic';
import { v4 } from 'uuid';
import useLoad from '../hooks/useLoad';
import { Theme } from '../Theme';
import { Locale } from '../types/interfaces';
import { useDescriptionInput, useTitleInput } from './CreateProject.hooks';
import s from './CreateProject.module.scss';
import Input from './ui/Input';
import Typography from './ui/Typography';

const HtmlEditor = dynamic(() => import('./ui/HtmlEditor'), { ssr: false });

const id = v4();

function CreateProject({
  theme,
  locale,
  formDesc,
}: {
  theme: Theme;
  locale: Locale['app']['me'];
  formDesc: string;
}) {
  const { load } = useLoad();

  const { description, onChangeDescription } = useDescriptionInput();

  const { onChangeTitle, title } = useTitleInput();

  return (
    <div className={s.wrapper}>
      <div className={s.container}>
        <Typography theme={theme} variant="h1">
          {locale.createProject}
        </Typography>
        <Typography theme={theme} variant="p">
          {formDesc}
        </Typography>
        <Input
          type="text"
          fullWidth
          id={id}
          value={title}
          onChange={onChangeTitle}
          name={`${locale.projectName}*`}
          theme={theme}
        />
        <HtmlEditor onChange={onChangeDescription} theme={theme} />
      </div>
    </div>
  );
}

export default CreateProject;
