import { useCallback } from 'react';
import { Theme } from '../../Theme';
import { SortName } from '../../types';
import { Locale } from '../../types/interfaces';
import SortAlphaAscIcon from '../icons/SortAlphaAsc';
import SortAlphaDescIcon from '../icons/SortAlphaDesc';
import SortNumericAscIcon from '../icons/SortNumericAsc';
import SortNumericDescIcon from '../icons/SortNumericDesc';
import IconButton from './IconButton';
import { log } from '../../utils/lib';
import s from './SortTags.module.scss';

function SortTags({
  sort,
  alphaDesc,
  numericDesc,
  theme,
  setAlphaDesc,
  setNumericDesc,
}: {
  sort: Locale['app']['common']['sort'];
  alphaDesc: boolean;
  numericDesc: boolean;
  theme: Theme;
  setAlphaDesc: React.Dispatch<React.SetStateAction<boolean>>;
  setNumericDesc: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const onClickSort = useCallback(
    // eslint-disable-next-line no-unused-vars
    (name: SortName) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      switch (name) {
        case SortName.ALPHA_DESC:
          setAlphaDesc(false);
          break;
        case SortName.ALPHA_ASC:
          setAlphaDesc(true);
          break;
        case SortName.NUMERIC_DESC:
          setNumericDesc(false);
          break;
        case SortName.NUMERIC_ASC:
          setNumericDesc(true);
          break;
        default:
          log('warn', 'Default click sort tags', name);
      }
    },
    [setAlphaDesc, setNumericDesc]
  );

  return (
    <div className={s.wrapper}>
      <IconButton
        titleHide
        title={sort.byAlpha}
        onClick={onClickSort(alphaDesc ? SortName.ALPHA_DESC : SortName.ALPHA_ASC)}
        theme={theme}
      >
        {alphaDesc ? (
          <SortAlphaDescIcon color={theme.text} />
        ) : (
          <SortAlphaAscIcon color={theme.text} />
        )}
      </IconButton>
      <IconButton
        titleHide
        title={sort.byNumeric}
        onClick={onClickSort(numericDesc ? SortName.NUMERIC_DESC : SortName.NUMERIC_ASC)}
        theme={theme}
      >
        {numericDesc ? (
          <SortNumericDescIcon color={theme.text} />
        ) : (
          <SortNumericAscIcon color={theme.text} />
        )}
      </IconButton>
    </div>
  );
}

export default SortTags;
