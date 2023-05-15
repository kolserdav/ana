import clsx from 'clsx';
import { Theme } from '../Theme';
import s from './AcceptCookies.module.scss';
import { Pages } from '../utils/constants';
import Link from './ui/Link';
import Button from './ui/Button';

function AcceptCookies({
  theme,
  text,
  button,
  policyTitle,
  open,
  onClick,
}: {
  theme: Theme;
  text: string;
  button: string;
  policyTitle: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={clsx(s.wrapper, open ? '' : s.hide)}
      style={{ backgroundColor: theme.text, color: theme.paper }}
    >
      <div className={s.container}>
        <div className={s.text}>
          <p>{text}</p>
          <div className={s.row}>
            <Link href={Pages.policy} theme={theme}>
              {policyTitle}
            </Link>
            <Button colorReverse onClick={onClick} theme={theme}>
              {button}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcceptCookies;
