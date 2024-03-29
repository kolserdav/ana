import clsx from 'clsx';
import { useMemo } from 'react';
import { ubuntu400, ubuntu500, ubuntu700 } from '../../fonts/ubuntu';
import { Theme } from '../../Theme';
import { Tab } from '../../types/interfaces';
import { TAB_INDEX_DEFAULT } from '../../utils/constants';
import s from './Tabs.module.scss';
import Typography from './Typography';

function Tabs({
  theme,
  tabs,
  active,
  tabDefault,
  error,
  label,
  onClick,
  disabled,
}: {
  theme: Theme;
  tabs: Tab[];
  active: number;
  label: string;
  tabDefault?: string;
  error?: string;
  disabled?: boolean;
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
    <div className={clsx(s.wrapper, ubuntu400.className, error ? s.error : '')}>
      <Typography className={clsx(s.label, ubuntu500.className)} theme={theme} variant="label">
        {label}
      </Typography>
      <div
        className={s.container}
        style={{
          borderColor:
            active !== TAB_INDEX_DEFAULT ? theme.green : error ? theme.red : theme.active,
        }}
      >
        <div className={s.head}>
          {tabs.map((item) => (
            <div
              role="button"
              tabIndex={item.id}
              onKeyDown={onKeyDownListener}
              onClick={() => {
                if (!disabled) {
                  onClick(item.id);
                }
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
              className={clsx(
                s.title,
                disabled ? s.disabled : '',
                active === item.id ? s.active : ''
              )}
              key={item.id}
            >
              {item.title}
            </div>
          ))}
        </div>
        <div
          style={{ color: theme.text }}
          className={clsx(isDefault ? ubuntu700.className : ubuntu400.className, s.content)}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: !isDefault ? activeTab.content : tabDefault }}
        />
      </div>
      <span className={s.error} style={{ color: theme.yellow }}>
        {error}
      </span>
    </div>
  );
}

Tabs.defaultProps = {
  tabDefault: undefined,
  error: '',
  disabled: false,
};

export default Tabs;
