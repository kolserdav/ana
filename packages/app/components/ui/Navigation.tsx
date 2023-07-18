import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Theme } from '../../Theme';
import Link from './Link';
import s from './Navigation.module.scss';
import { Locale } from '../../types/interfaces';

interface NavigationPath {
  name: string;
  value: string;
}

// TODO implement
function Navigation({ theme, locale }: { theme: Theme; locale: Locale['app']['appBar'] }) {
  const router = useRouter();

  const paths = useMemo(() => {
    const splits = router.asPath.split('/');
    const res: NavigationPath[] = [];
    splits.forEach((item, index) => {
      if (index === 0) {
        res.push({
          name: locale.homePage,
          value: '/',
        });
        return;
      }
      let value = '/';
      splits.every((_item, _index) => {
        value += `/${_item}`;
        if (index === _index) {
          return false;
        }
        return true;
      });
      res.push({
        name: item,
        value,
      });
    });
    return res;
  }, [router.asPath, locale.homePage]);

  return (
    <div
      className={s.wrapper}
      style={{
        color: theme.text,
        backgroundColor: theme.paper,
        boxShadow: `0px 1px 5px ${theme.active}`,
      }}
    >
      <div className={s.navigation__container}>
        {paths.map((item) => (
          <>
            <Link key={item.value} theme={theme} href={item.value}>
              {item.name}
            </Link>
            {' > '}
          </>
        ))}
      </div>
    </div>
  );
}

export default Navigation;
