import dynamic from 'next/dynamic';
import useLoad from '../hooks/useLoad';
import { Theme } from '../Theme';
import { Locale } from '../types/interfaces';
import { useDescriptionInput, useTitleInput } from './CreateProject.hooks';
import s from './CreateProject.module.scss';
import Input from './ui/Input';
import Typography from './ui/Typography';

const HtmlEditor = dynamic(() => import('./ui/HtmlEditor'), { ssr: false });

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
      <form className={s.container}>
        <Typography theme={theme} variant="h1">
          {locale.createProject}
        </Typography>
        <Typography theme={theme} variant="p">
          {formDesc}
        </Typography>
        <Input
          type="text"
          fullWidth
          id="project-title"
          value={title}
          onChange={onChangeTitle}
          name={`${locale.projectTitle}*`}
          theme={theme}
        />
        <HtmlEditor
          placeholder={locale.projectDesPlaceholder}
          id="description"
          label={`${locale.projectDescription}*`}
          onChange={onChangeDescription}
          theme={theme}
        />
      </form>
    </div>
  );
}

export default CreateProject;
