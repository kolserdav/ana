import clsx from 'clsx';
import NextLink from 'next/link';
import React from 'react';
import { Theme } from '../../Theme';
import s from './Link.module.scss';

interface LinkProps {
  href: string;
  children: string | React.ReactNode;
  theme: Theme;
  disabled?: boolean;
  withoutHover?: boolean;
  className?: string;
  fullWidth?: boolean;
  noWrap?: boolean;
}

function Link({
  children,
  theme,
  disabled,
  withoutHover,
  className,
  href,
  fullWidth,
  noWrap,
}: LinkProps) {
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
          fullWidth ? s.full__width : '',
          noWrap ? s.no__wrap : ''
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
  noWrap: false,
};

export default Link;
