import util from 'util';
import { pipeline } from 'stream';
import fs from 'fs';
import path from 'path';
import { RequestHandler } from '../../../types';
import { MessageType, SendMessageArgs, APPLICATION_JSON } from '../../../types/interfaces';
import {
  createDir,
  getCloudPath,
  getFileExt,
  getFilePath,
  getLocale,
  parseHeaders,
} from '../../../utils/lib';
import { CLOUD_PATH } from '../../../utils/constants';
import { ORM } from '../../../services/orm';
import HandleRequests from '../../../services/handleRequests';

const orm = new ORM();
const handleRequests = new HandleRequests({});

const pump = util.promisify(pipeline);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fileUpload: RequestHandler<
  never,
  SendMessageArgs<MessageType.SET_FILE_UPLOAD | MessageType.SET_ERROR>
> = async (req, reply) => {
  const { headers } = req;
  const { lang, id, timeout } = parseHeaders(headers);
  const locale = getLocale(lang).server;

  const files = req.files();
  const res = [];
  for await (const data of files) {
    if (!data) {
      reply.type(APPLICATION_JSON).code(400);
      return {
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout: parseInt(timeout, 10),
        data: {
          type: MessageType.GET_FILE_UPLOAD,
          message: locale.badRequest,
          httpCode: 400,
          status: 'error',
        },
      };
    }
    const { fieldname, filename, encoding, mimetype, file } = data;

    const create = await orm.fileCreateW({
      data: {
        fieldname,
        filename,
        encoding,
        mimetype,
        userId: id,
        ext: getFileExt(filename),
      },
    });
    if (create.status !== 'info' || !create.data) {
      reply.type(APPLICATION_JSON).code(400);
      return {
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout: parseInt(timeout, 10),
        data: {
          type: MessageType.GET_FILE_UPLOAD,
          message: locale.error,
          httpCode: 500,
          status: 'error',
        },
      };
    }

    const userCloud = getCloudPath(id);
    createDir(userCloud);
    const fileName = getFilePath({ userCloud, id: create.data.id, ext: create.data.ext });
    const filePath = path.resolve(userCloud, fileName);
    await pump(file, fs.createWriteStream(filePath));

    const update = handleRequests.sendToQueue<
      SendMessageArgs<MessageType.GET_FILE_UPLOAD>,
      SendMessageArgs<MessageType.SET_FILE_UPLOAD> | SendMessageArgs<MessageType.SET_ERROR>
    >({
      id,
      type: MessageType.GET_FILE_UPLOAD,
      lang,
      timeout: parseInt(timeout, 10),
      data: {
        file: create.data,
        filePath,
      },
    });

    res.push(update);
  }

  let withError = false;
  (await Promise.all(res)).forEach((item) => {
    if (item.type === MessageType.SET_ERROR) {
      withError = true;
    }
  });
  if (withError) {
    reply.type(APPLICATION_JSON).code(400);
    return {
      type: MessageType.SET_ERROR,
      id,
      lang,
      timeout: parseInt(timeout, 10),
      data: {
        type: MessageType.GET_FILE_UPLOAD,
        message: locale.someFilesNotSaved,
        httpCode: 400,
        status: 'warn',
      },
    };
  }

  reply.type(APPLICATION_JSON).code(201);
  return {
    type: MessageType.SET_FILE_UPLOAD,
    id,
    lang,
    timeout: parseInt(timeout, 10),
    data: null,
  };
};

export default fileUpload;
