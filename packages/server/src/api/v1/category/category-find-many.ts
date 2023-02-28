import { RequestHandler } from '../../../types';
import { MessageType, SendMessageArgs, APPLICATION_JSON } from '../../../types/interfaces';
import { getLocale, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';

const orm = new ORM();

const categoryFindMany: RequestHandler<
  never,
  SendMessageArgs<MessageType.SET_CATEGORY_FIND_MANY> | SendMessageArgs<MessageType.SET_ERROR>
> = async ({ headers }, reply) => {
  const { lang, id, timeout } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const categories = await orm.categoryFindManyW({
    include: {
      Subcategory: true,
    },
  });
  if (categories.status !== 'info') {
    reply.type(APPLICATION_JSON).code(500);
    return {
      type: MessageType.SET_ERROR,
      id,
      lang,
      timeout: parseInt(timeout, 10),
      data: {
        httpCode: 500,
        message: locale.error,
        type: MessageType.SET_ERROR,
        status: 'error',
      },
    };
  }
  reply.type(APPLICATION_JSON).code(200);
  return {
    type: MessageType.SET_CATEGORY_FIND_MANY,
    id,
    lang,
    timeout: parseInt(timeout, 10),
    data: categories.data,
  };
};

export default categoryFindMany;
