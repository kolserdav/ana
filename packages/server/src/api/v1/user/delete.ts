import { RequestHandler } from '../../../types';
import {
  APPLICATION_JSON,
  Result,
  UserCleanResult,
  UserDeleteBody,
} from '../../../types/interfaces';
import { getHttpCode, log, parseHeaders } from '../../../utils/lib';
import { ORM } from '../../../services/orm';
import { cleanUserFields } from '../../../components/lib';
import getLocale from '../../../utils/getLocale';
import { sendEmail } from '../../../utils/email';

const orm = new ORM();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const userDelete: RequestHandler<{ Body: UserDeleteBody }, Result<UserCleanResult | null>> = async (
  { headers, body },
  reply
) => {
  const { lang, id } = parseHeaders(headers);
  const { userId } = body;

  const locale = getLocale(lang).server;

  if (userId !== id) {
    reply.type(APPLICATION_JSON).code(400);
    return {
      status: 'warn',
      message: locale.badRequest,
      data: null,
    };
  }

  const user = await orm.userFindFirst({
    where: {
      id,
    },
    include: {
      RestoreLink: true,
      Phrase: true,
      Tag: {
        include: {
          PhraseTag: true,
        },
      },
      ConfirmLink: true,
    },
  });
  if (user.status !== 'info' || !user.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(user.status));
    return {
      status: user.status,
      data: null,
      message: user.status === 'error' ? locale.error : locale.notFound,
    };
  }

  const updatePhraseTag = await orm.phraseTagDeleteMany({
    where: {
      id: { in: user.data.Tag.map((item) => item.PhraseTag.map((_item) => _item.id)).flat() },
    },
  });
  if (updatePhraseTag.status !== 'info' || !updatePhraseTag.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(updatePhraseTag.status));
    return {
      status: updatePhraseTag.status,
      data: null,
      message: updatePhraseTag.status === 'error' ? locale.error : locale.notFound,
    };
  }

  const updateRes = await orm.userUpdate({
    where: {
      id: user.data.id,
    },
    data: {
      RestoreLink: {
        deleteMany: {
          id: {
            in: user.data.RestoreLink.map((item) => item.id),
          },
        },
      },
      Phrase: {
        deleteMany: {
          id: {
            in: user.data.Phrase.map((item) => item.id),
          },
        },
      },
      Tag: {
        deleteMany: {
          id: {
            in: user.data.Tag.map((item) => item.id),
          },
        },
      },
      ConfirmLink: {
        deleteMany: {
          id: {
            in: user.data.ConfirmLink.map((item) => item.id),
          },
        },
      },
    },
  });

  if (updateRes.status !== 'info' || !updateRes.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(updateRes.status));
    return {
      status: updateRes.status,
      data: null,
      message: updateRes.status === 'error' ? locale.error : locale.notFound,
    };
  }

  const result = await orm.userDelete({ where: { id: updateRes.data.id } });
  if (result.status !== 'info' || !result.data) {
    reply.type(APPLICATION_JSON).code(getHttpCode(result.status));
    return {
      status: result.status,
      data: null,
      message: result.status === 'error' ? locale.error : locale.notFound,
    };
  }

  const sendRes = await sendEmail<'account-deleted'>({
    email: result.data.email,
    type: 'account-deleted',
    locale: lang,
    subject: locale.mailSubjects.deletedAccount,
    data: {
      name: user.data.name || '',
    },
  });

  if (sendRes === 1) {
    log('warn', 'Not send email to user', { user: result.data });
  }

  const cleanData = cleanUserFields(result.data);

  reply.type(APPLICATION_JSON).code(201);
  return {
    status: 'info',
    message: locale.success,
    data: cleanData,
  };
};

export default userDelete;
