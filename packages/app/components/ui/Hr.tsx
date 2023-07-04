import { Theme } from '../../Theme';
import s from './Hr.module.scss';

function Hr({ theme, viceVersa }: { theme: Theme; viceVersa?: boolean }) {
  return <hr className={s.wrapper} style={{ color: viceVersa ? theme.paper : theme.text }} />;
}

Hr.defaultProps = {
  viceVersa: undefined,
};

export default Hr;
