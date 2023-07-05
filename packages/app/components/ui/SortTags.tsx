import { useCallback } from 'react';
import { Theme } from '../../Theme';
import { SortName } from '../../types';
import { Locale } from '../../types/interfaces';
import SortAlphaAscIcon from '../icons/SortAlphaAsc';
import SortAlphaDescIcon from '../icons/SortAlphaDesc';
import SortNumericAscIcon from '../icons/SortNumericAsc';
import SortNumericDescIcon from '../icons/SortNumericDesc';
import IconButton from './IconButton';
import s from './SortTags.module.scss';

function SortTags({
  sort,
  alphaDesc,
  numericDesc,
  theme,
  setCurrentSort,
}: {
  sort: Locale['app']['common']['sort'];
  alphaDesc: boolean;
  numericDesc: boolean;
  theme: Theme;
  setCurrentSort: React.Dispatch<React.SetStateAction<SortName>>;
}) {
  const onClickSort = useCallback(
    // eslint-disable-next-line no-unused-vars
    (name: SortName) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setCurrentSort(name);
    },
    [setCurrentSort]
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
