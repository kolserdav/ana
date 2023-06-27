import { SelectorNames } from '@prisma/client';
import Request from '../utils/request';
import { log } from '../utils/lib';

const request = new Request();

const createSelector = async ({ type, value }: { type: SelectorNames; value: string }) => {
  const sels = await request.selectorCreate({ type, value });
  log(sels.status, sels.message, sels);
};

export default createSelector;
