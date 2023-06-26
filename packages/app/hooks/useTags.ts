import { useEffect, useState } from 'react';
import { TagFindManyResult } from '../types/interfaces';
import Request from '../utils/request';
import { log } from '../utils/lib';

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

  return { tags, setTags, onClickTagCheepWrapper, allTags, tagsIsSet };
}
