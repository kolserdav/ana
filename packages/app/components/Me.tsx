import clsx from 'clsx';
import { useRouter } from 'next/router';
import useLoad from '../hooks/useLoad';
import { Theme } from '../Theme';
import { Locale, MessageType, SendMessageArgs } from '../types/interfaces';
import { Pages } from '../utils/constants';
import { cleanPath } from '../utils/lib';
import { useLoadProjects } from './Me.hooks';
import s from './Me.module.scss';
import Link from './ui/Link';

function Me({
  locale,
  theme,
  user,
  userLoad,
  isEmployer,
}: {
  locale: Locale['app']['me'];
  theme: Theme;
  user: SendMessageArgs<MessageType.SET_USER_FIND_FIRST>['data'];
  userLoad: boolean;
  isEmployer: boolean;
}) {
  const router = useRouter();
  const { load } = useLoad();

  const linkStyle: React.CSSProperties = {
    color: theme.text,
    width: '100%',
    textDecoration: 'underline',
    textDecorationColor: theme.text,
  };

  const isProjects = router.asPath.indexOf(Pages.projects) !== -1;

  useLoadProjects({ isProjects });

  return (
    <div className={s.wrapper}>
      <div className={s.panel} style={{ border: `1px solid ${theme.active}` }}>
        <Link
          style={linkStyle}
          className={clsx(s.link, isProjects ? s.active : '')}
          theme={theme}
          href={`${isEmployer ? Pages.meEmployer : Pages.meWorker}${Pages.projects}`}
        >
          {locale.myProjects}
        </Link>
      </div>
      <div className={s.container} style={{ border: `1px solid ${theme.active}` }}>
        Me
      </div>
    </div>
  );
}

export default Me;
