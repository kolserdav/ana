import { forwardRef, useMemo } from 'react';
import clsx from 'clsx';
import { Theme } from '../../Theme';
import s from './Textarea.module.scss';
import { ubuntu300, ubuntu500 } from '../../fonts/ubuntu';

interface TextareaProps {
  theme: Theme;
  maxLength?: number;
  error?: string;
}

type TextAreaDefaultProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

const Textarea = forwardRef<HTMLTextAreaElement, TextAreaDefaultProps & TextareaProps>(
  (_props, ref) => {
    const { theme, maxLength, value, error } = _props;

    const props = useMemo(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const propsC: TextAreaDefaultProps & Partial<TextareaProps> = { ..._props } as any;
      delete propsC.theme;
      delete propsC.maxLength;
      delete propsC.error;
      return propsC;
    }, [_props]);

    const length = (value as string | undefined)?.length || 0;

    return (
      <div className={s.wrapper}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <textarea
          ref={ref}
          style={{
            background: theme.paper,
            color: theme.text,
            borderColor: error ? theme.red : theme.active,
          }}
          {...props}
        />
        {maxLength && (
          <div className={s.info}>
            {error && (
              <div style={{ color: theme.yellow }} className={clsx(s.error, ubuntu500.className)}>
                {error}
              </div>
            )}
            <div
              className={clsx(s.count_symbols, ubuntu300.className)}
              style={{
                color: length === maxLength ? theme.yellow : theme.text,
                opacity: length === 0 ? 0.5 : 1,
              }}
            >
              {length}/{maxLength}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

Textarea.defaultProps = {
  maxLength: undefined,
  error: undefined,
};

export default Textarea;
