import { Theme } from '@/Theme';
import { Tab } from '@/types/interfaces';
import { TAB_INDEX_DEFAULT } from '@/utils/constants';
import { Ubuntu } from '@next/font/google';
import clsx from 'clsx';
import { useMemo } from 'react';
import s from './Tabs.module.scss';
import Typography from './Typography';

const ubuntu = Ubuntu({ subsets: ['cyrillic', 'latin'], weight: '400', preload: true });
const ubuntuBold = Ubuntu({ subsets: ['cyrillic', 'latin'], weight: '700', preload: true });

function Tabs({
  theme,
  tabs,
  active,
  tabDefault,
  label,
  onClick,
}: {
  theme: Theme;
  tabs: Tab[];
  active: number;
  label: string;
  tabDefault?: string;
  // eslint-disable-next-line no-unused-vars
  onClick: (id: number) => void;
}) {
  const activeTab = useMemo(
    () => tabs.find((item) => item.id === active) || tabs[0],
    [tabs, active]
  );

  const isDefault = tabs[active] === undefined && tabDefault !== undefined;

  const titleStyle = {
    transition: 'background-color 0.2s ease-in, opacity 0.2s ease-in, border-color 0.2s ease-in',
  };

  const onKeyDownListener = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const { code } = e;
    let index = 0;
    switch (code) {
      case 'ArrowRight':
        index = tabs[active + 1] !== undefined ? active + 1 : 0;
        break;
      case 'ArrowLeft':
        index = tabs[active - 1] !== undefined ? active - 1 : tabs.length - 1;
        break;
      default:
    }
    onClick(index);
  };

  return (
    <div className={clsx(s.wrapper, ubuntu.className)}>
      <Typography theme={theme} variant="label">
        {label}
      </Typography>
      <div
        className={s.container}
        style={{ borderColor: active !== TAB_INDEX_DEFAULT ? theme.green : theme.active }}
      >
        <div className={s.head}>
          {tabs.map((item) => (
            <div
              role="button"
              tabIndex={item.id}
              onKeyDown={onKeyDownListener}
              onClick={() => {
                onClick(item.id);
              }}
              style={
                active === item.id
                  ? {
                      backgroundColor: theme.paper,
                      color: theme.text,
                      borderColor: 'transparent',
                      ...titleStyle,
                    }
                  : {
                      backgroundColor: theme.text,
                      borderColor: theme.active,
                      color: theme.paper,
                      ...titleStyle,
                    }
              }
              className={clsx(s.title, active === item.id ? s.active : '')}
              key={item.id}
            >
              {item.title}
            </div>
          ))}
        </div>
        <div
          style={{ color: theme.text }}
          className={clsx(s.content, isDefault ? ubuntuBold.className : ubuntu.className)}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: !isDefault ? activeTab.content : tabDefault }}
        />
      </div>
    </div>
  );
}

Tabs.defaultProps = {
  tabDefault: undefined,
};

export default Tabs;
