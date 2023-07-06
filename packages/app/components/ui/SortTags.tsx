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
import SearchIcon from '../icons/Search';
import Input from './Input';

function SortTags({
  sort,
  alphaDesc,
  numericDesc,
  theme,
  setCurrentSort,
  filterText,
  setFilterText,
}: {
  sort: Locale['app']['common']['sort'];
  alphaDesc: boolean;
  numericDesc: boolean;
  theme: Theme;
  setCurrentSort: React.Dispatch<React.SetStateAction<SortName>>;
  filterText: string;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
}) {
  const onClickSort = useCallback(
    // eslint-disable-next-line no-unused-vars
    (name: SortName) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setCurrentSort(name);
    },
    [setCurrentSort]
  );

  const onChangeFilterText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setFilterText(value);
  };

  return (
    <div className={s.wrapper}>
      <SearchIcon withoutScale color={theme.text} />
      <Input
        type="text"
        id="tags-filter"
        theme={theme}
        value={filterText}
        onChange={onChangeFilterText}
      />
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
