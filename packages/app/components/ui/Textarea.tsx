import { useMemo } from 'react';
import { Theme } from '../../Theme';
import s from './Textarea.module.scss';

function Textarea(
  _props: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > & { theme: Theme }
) {
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
        style={{ background: theme.paper, color: theme.text, borderColor: theme.text }}
        {...props}
      />
    </div>
  );
}

export default Textarea;
