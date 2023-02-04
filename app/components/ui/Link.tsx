import { Theme } from '@/Theme';
import clsx from 'clsx';
import NextLink from 'next/link';
import React from 'react';
import s from './Link.module.scss';

interface LinkProps {
  href: string;
  children: string | React.ReactNode;
  theme: Theme;
  disabled?: boolean;
  withoutHover?: boolean;
  className?: string;
  fullWidth?: boolean;
}

function Link({ children, theme, disabled, withoutHover, className, href, fullWidth }: LinkProps) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    disabled ? (
      <span style={{ color: theme.blue }} className={clsx(s.wrapper, s.disabled)}>
        {children}
      </span>
    ) : (
      <NextLink
        href={href}
        className={clsx(
          s.wrapper,
          withoutHover ? s.without__hover : '',
          className,
          fullWidth ? s.full__width : ''
        )}
      >
        <span style={{ color: theme.blue }}>{children}</span>
      </NextLink>
    )
  );
}

Link.defaultProps = {
  disabled: false,
  withoutHover: false,
  className: '',
  fullWidth: false,
};

export default Link;
