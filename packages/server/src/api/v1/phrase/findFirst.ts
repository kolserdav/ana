import { ORM } from '../../../services/orm';
import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  PhraseFindFirstQuery,
  PhraseFindFirstResult,
  Result,
} from '../../../types/interfaces';
import getLocale from '../../../utils/getLocale';
import { getHttpCode, parseHeaders } from '../../../utils/lib';

const orm = new ORM();

const phraseFindFirst: RequestHandler<
  { Querystring: PhraseFindFirstQuery },
  Result<PhraseFindFirstResult>
> = async ({ headers, query }, reply) => {
  const { lang } = parseHeaders(headers);
  const { phraseId } = query;
  const locale = getLocale(lang).server;

  const res = await orm.phraseFindFirst({
    where: {
      id: phraseId,
    },
    include: {
      PhraseTag: {
        include: {
          Tag: {
            include: {
              PhraseTag: {
                select: {
                  phraseId: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (res.status !== 'info') {
    reply.type(APPLICATION_JSON).code(getHttpCode(res.status));
    return {
      status: res.status,
      message: res.status === 'error' ? locale.error : locale.notFound,
      data: null,
    };
  }

  reply.type(APPLICATION_JSON).code(200);

  return { status: 'info', message: locale.phraseLoad, data: res.data };
};

export default phraseFindFirst;
