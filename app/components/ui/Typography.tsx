import { Theme } from '@/Theme';
import { Ubuntu } from '@next/font/google';
import clsx from 'clsx';
import s from './Typography.module.scss';

const ubuntu = Ubuntu({ subsets: ['cyrillic', 'latin'], weight: '400', preload: true });

function Typography({
  variant,
  children,
  theme,
  className,
  small,
  align,
}: {
  variant: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
  children: string | string[];
  theme: Theme;
  className?: string;
  small?: boolean;
  align?: 'center' | 'right' | 'justify';
}) {
  return (
    <div
      className={clsx(
        s.wrapper,
        ubuntu.className,
        className,
        small ? s.small : '',
        align
          ? align === 'center'
            ? s.center
            : align === 'right'
            ? s.right
            : align === 'justify'
            ? s.justify
            : ''
          : ''
      )}
      style={{ color: theme.text }}
    >
      {variant === 'p' ? (
        <p>{children}</p>
      ) : variant === 'h1' ? (
        <h1>{children}</h1>
      ) : variant === 'h2' ? (
        <h2>{children}</h2>
      ) : variant === 'h3' ? (
        <h3>{children}</h3>
      ) : variant === 'h4' ? (
        <h4>{children}</h4>
      ) : variant === 'h5' ? (
        <h5>{children}</h5>
      ) : variant === 'h6' ? (
        <h6>{children}</h6>
      ) : variant === 'label' ? (
        <label htmlFor="te">{children}</label>
      ) : (
        <span>{children}</span>
      )}
    </div>
  );
}

Typography.defaultProps = {
  className: '',
  small: false,
  align: 'left',
};

export default Typography;
