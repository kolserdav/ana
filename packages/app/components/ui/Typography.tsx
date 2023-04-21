import clsx from 'clsx';
import { ubuntu400 } from '../../fonts/ubuntu';
import { Theme } from '../../Theme';
import { Status } from '../../types/interfaces';
import s from './Typography.module.scss';

function Typography({
  variant,
  children,
  theme,
  className,
  small,
  htmlFor,
  align,
  styleName,
  disabled,
}: {
  variant: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
  children: string | string[] | React.ReactNode;
  theme: Theme;
  htmlFor?: string;
  className?: string;
  small?: boolean;
  align?: 'center' | 'right' | 'justify';
  styleName?: Status;
  disabled?: boolean;
}) {
  return (
    <div
      className={clsx(
        s.wrapper,
        ubuntu400.className,
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
          : '',
        disabled ? s.disabled : ''
      )}
      style={{
        color:
          styleName === 'warn'
            ? theme.yellow
            : styleName === 'error'
            ? theme.red
            : styleName === 'info'
            ? theme.green
            : theme.text,
      }}
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
        <label htmlFor={htmlFor}>{children}</label>
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
  styleName: undefined,
  htmlFor: undefined,
  disabled: false,
};

export default Typography;
