import { Theme } from '@/Theme';
import clsx from 'clsx';
import NextLink from 'next/link';
import React, { useMemo } from 'react';
import s from './Link.module.scss';

interface LinkProps {
  href: string;
  children: string | React.ReactNode;
  theme: Theme;
  disabled?: boolean;
}

function Link(props: LinkProps) {
  const { children, theme, disabled } = props;

  const _props = useMemo(() => {
    const p = { ...props } as Partial<LinkProps>;
    delete p.children;
    delete p.theme;
    delete p.disabled;
    return p as LinkProps;
  }, [props]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    disabled ? (
      <span style={{ color: theme.blue }} className={clsx(s.wrapper, s.disabled)}>
        {children}
      </span>
    ) : (
      <NextLink {..._props}>
        <span style={{ color: theme.blue }} className={s.wrapper}>
          {children}
        </span>
      </NextLink>
    )
  );
}

Link.defaultProps = {
  disabled: false,
};

export default Link;
