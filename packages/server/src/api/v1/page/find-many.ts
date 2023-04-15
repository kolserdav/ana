import { RequestHandler } from '../../../types';
import { Result, APPLICATION_JSON } from '../../../types/interfaces';
import { ORM } from '../../../services/orm';
import { Page, Prisma } from '@prisma/client';
import { getHttpCode } from '../../../utils/lib';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pageFindManyHandler: RequestHandler<
  { Body: Prisma.PageFindManyArgs },
  Result<Page[]>
> = async ({ body }, reply) => {
  const page = await orm.pageFindManyW(body);
  reply.type(APPLICATION_JSON).code(getHttpCode(page.status));
  return page;
};

export default pageFindManyHandler;
