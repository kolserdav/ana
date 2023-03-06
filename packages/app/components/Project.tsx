import useLoad from '../hooks/useLoad';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import s from './Project.module.scss';

function Project({
  project,
}: {
  project: SendMessageArgs<MessageType.SET_PROJECT_FIND_FIRST>['data'];
}) {
  const { load } = useLoad();
  console.log(project);
  return <div className={s.wrapper}>Project</div>;
}

export default Project;
