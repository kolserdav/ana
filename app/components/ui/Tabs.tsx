import { Theme } from '@/Theme';
import { Tab } from '@/types/interfaces';
import { Ubuntu } from '@next/font/google';
import clsx from 'clsx';
import { useMemo } from 'react';
import s from './Tabs.module.scss';

const ubuntu = Ubuntu({ subsets: ['cyrillic', 'latin'], weight: '400' });

function Tabs({
  theme,
  tabs,
  active,
  onClick,
}: {
  theme: Theme;
  tabs: Tab[];
  active: number;
  onClick: (id: number) => void;
}) {
  const activeTab = useMemo(() => tabs.find((item) => item.id === active), [tabs, active]);

  const titleStyle = { borderColor: theme.active };

  return (
    <div className={clsx(s.wrapper, ubuntu.className)} style={{ borderColor: theme.active }}>
      <div className={s.head}>
        {tabs.map((item, i) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events
          <div
            role="button"
            tabIndex={i}
            onClick={() => {
              onClick(item.id);
            }}
            style={
              active === item.id
                ? { backgroundColor: theme.paper, color: theme.text, ...titleStyle }
                : {
                    backgroundColor: theme.text,
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
      <div className={s.content}>
        <div className={s.content}>{activeTab?.content}</div>
      </div>
    </div>
  );
}

export default Tabs;
