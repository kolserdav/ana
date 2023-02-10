import { Theme } from '../../Theme';
import s from './Card.module.scss';

function Card({ children, theme }: { children: string | React.ReactElement; theme: Theme }) {
  return (
    <div
      className={s.wrapper}
      style={{ boxShadow: `1px 1px 5px ${theme.text}, -1px -1px 5px ${theme.text}` }}
    >
      {children}
    </div>
  );
}

export default Card;
