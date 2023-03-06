import { Theme } from '../../Theme';
import s from './Hr.module.scss';

function Hr({ theme }: { theme: Theme }) {
  return <hr className={s.wrapper} style={{ color: theme.text }} />;
}

export default Hr;
