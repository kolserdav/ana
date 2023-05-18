import { forwardRef, useMemo } from 'react';
import { Theme } from '../../Theme';
import s from './Textarea.module.scss';

const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > & { theme: Theme }
>((_props, ref) => {
  const { theme } = _props;

  const props = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const propsC: any = { ..._props };
    delete propsC.theme;
    return propsC;
  }, [_props]);

  return (
    <div className={s.wrapper}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <textarea
        ref={ref}
        style={{ background: theme.paper, color: theme.text, borderColor: theme.text }}
        {...props}
      />
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
