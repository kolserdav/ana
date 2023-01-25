import { RequestHandler } from '../../../types';
import { APPLICATION_JSON } from '../../../utils/constants';
import { Result } from '../../../types/interfaces';
import { ORM } from '../../../services/orm';
import { Page, Prisma } from '@prisma/client';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postPageFindManyHandler: RequestHandler<
  { Body: Prisma.PageFindManyArgs },
  Result<Page[]>
> = async ({ headers, body }, reply) => {
  const page = await orm.pageFindManyW(body, { headers });
  reply.type(APPLICATION_JSON).code(page.code);
  return page;
};

export default postPageFindManyHandler;
