import { Theme } from '@/Theme';
import NextLink from 'next/link';
import React, { useMemo } from 'react';
import s from './Link.module.scss';

interface LinkProps {
  href: string;
  children: string | React.ReactNode;
  theme: Theme;
}

function Link(props: LinkProps) {
  const { children, theme } = props;

  const _props = useMemo(() => {
    const p = { ...props } as Partial<LinkProps>;
    delete p.children;
    delete p.theme;
    return p as LinkProps;
  }, [props]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <NextLink {..._props}>
      <span style={{ color: theme.blue }} className={s.wrapper}>
        {children}
      </span>
    </NextLink>
  );
}

export default Link;
