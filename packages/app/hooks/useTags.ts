import { useEffect, useMemo, useState } from 'react';
import { TagFindManyResult } from '../types/interfaces';
import Request from '../utils/request';
import { log } from '../utils/lib';
import { SortName } from '../types';

const request = new Request();

export default function useTags({
  gt,
  restart,
  onChangeTags,
  deleted,
}: {
  gt: string | undefined;
  restart?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChangeTags?: (tags: TagFindManyResult) => void;
  deleted?: boolean;
}) {
  const [tags, setTags] = useState<TagFindManyResult>([]);
  const [allTags, setAllTags] = useState<TagFindManyResult>([]);
  const [tagsIsSet, setTagsIsSet] = useState<boolean>(false);
  const [alphaDesc, setAlphaDesc] = useState<boolean>(false);
  const [numericDesc, setNumericDesc] = useState<boolean>(false);
  const [currentSort, setCurrentSort] = useState<SortName>(SortName.ALPHA_DESC);
  const [filterTagsText, setFilterTagsText] = useState<string>('');

  /**
   * Set all tags
   */
  useEffect(() => {
    if (!gt) {
      return;
    }
    (async () => {
      const _allTags = await request.tagFindMany({
        deleted: deleted === undefined ? undefined : deleted ? '1' : '0',
        gt,
      });
      setAllTags(_allTags.data);
      setTagsIsSet(true);
    })();
  }, [restart, deleted, gt]);

  /**
   * Set sort icons
   */
  useEffect(() => {
    switch (currentSort) {
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
        log('warn', 'Default click sort tags', currentSort);
        break;
    }
  }, [currentSort]);

  const onClickTagCheepWrapper = (tag: TagFindManyResult[0], command: 'add' | 'del') => () => {
    const _tags = tags.slice();
    const index = _tags.findIndex((item) => item.id === tag.id);

    switch (command) {
      case 'add':
        if (index !== -1) {
          log('warn', 'Duplicate cheep', { _tags, tag });
          return;
        }
        _tags.push(tag);
        break;
      case 'del':
        if (index === -1) {
          log('warn', 'Missing cheep', { _tags, tag });
          return;
        }
        _tags.splice(index, 1);
        break;
      default:
    }
    if (onChangeTags) {
      onChangeTags(_tags);
    }
    setTags(_tags);
  };

  const _tags = useMemo(
    () =>
      allTags?.sort((a, b) => {
        switch (currentSort) {
          case SortName.ALPHA_DESC:
            if (a.text[0] < b.text[0]) {
              return -1;
            }
            break;
          case SortName.ALPHA_ASC:
            if (a.text[0] > b.text[0]) {
              return -1;
            }
            break;
          case SortName.NUMERIC_DESC:
            if (a.PhraseTag.length < b.PhraseTag.length) {
              return -1;
            }
            break;
          case SortName.NUMERIC_ASC:
            if (a.PhraseTag.length > b.PhraseTag.length) {
              return -1;
            }
            break;
          default:
            log('warn', 'Default click sort tags', currentSort);
            break;
        }
        return 1;
      }) || [],
    [allTags, currentSort]
  );

  const __tags = useMemo(() => {
    if (!filterTagsText) {
      return _tags;
    }
    return _tags.filter((item) =>
      new RegExp(filterTagsText.toUpperCase()).test(item.text.toUpperCase())
    );
  }, [_tags, filterTagsText]);

  return {
    tags,
    setTags,
    onClickTagCheepWrapper,
    allTags: __tags,
    tagsIsSet,
    alphaDesc,
    numericDesc,
    setCurrentSort,
    filterTagsText,
    setFilterTagsText,
  };
}
