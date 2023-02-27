import fs from 'fs';
import sharp from 'sharp';
import AMQP from '../protocols/amqp';
import { ORM } from '../services/orm';
import {
  IMAGE_EXT,
  IMAGE_PREV_POSTFIX,
  isImage,
  MessageType,
  PREVIEW_IMAGE_WIDTH,
  SendMessageArgs,
} from '../types/interfaces';
import { changeImgExt, getCloudPath, getFilePath, getLocale, log } from '../utils/lib';

const orm = new ORM();

class File {
  public async fileChangeExt(
    {
      data: { filePath, file },
      id,
      lang,
      timeout,
      connId,
    }: SendMessageArgs<MessageType.GET_FILE_UPLOAD>,
    amqp: AMQP
  ) {
    if (!connId) {
      log('warn', 'Conn id not provided in fileChangeExt', { filePath });
      return;
    }
    const locale = getLocale(lang).server;

    const stats = fs.statSync(filePath);
    const buffer = await sharp(filePath).avif().toBuffer();
    const bufferPreview = await sharp(filePath).avif().resize(PREVIEW_IMAGE_WIDTH).toBuffer();
    const { width, height } = await sharp(buffer).metadata();
    fs.unlinkSync(filePath);

    if (!width || !height || !stats || !buffer) {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'error',
          type: MessageType.GET_FILE_UPLOAD,
          message: locale.someFilesNotSaved,
          httpCode: 502,
        },
      });
      await orm.fileDelete({
        where: {
          id: file.id,
        },
      });
      return;
    }

    fs.writeFileSync(
      changeImgExt({
        name: filePath,
        ext: file.ext,
      }),
      buffer
    );
    if (width > PREVIEW_IMAGE_WIDTH) {
      fs.writeFileSync(
        changeImgExt({ name: filePath, ext: file.ext, postfix: IMAGE_PREV_POSTFIX }),
        bufferPreview
      );
    } else {
      fs.writeFileSync(
        changeImgExt({
          name: filePath,
          ext: file.ext,
          postfix: IMAGE_PREV_POSTFIX,
        }),
        buffer
      );
    }

    const update = await orm.fileUpdate({
      where: {
        id: file.id,
      },
      data: {
        size: stats.size,
        coeff: width / height,
        width,
        height,
        ext: IMAGE_EXT,
        filename: changeImgExt({ name: file.filename, ext: file.ext }),
      },
    });

    amqp.sendToQueue({
      id,
      lang,
      timeout,
      connId,
      type: MessageType.SET_FILE_UPLOAD,
      data: update.data,
    });
  }

  public async fileDelete(
    { data, id, lang, timeout, connId }: SendMessageArgs<MessageType.GET_FILE_DELETE>,
    amqp: AMQP
  ) {
    if (!connId) {
      log('warn', 'Conn id not provided in fileDelete', { data });
      return;
    }
    const locale = getLocale(lang).server;

    const deleteR = await orm.fileDelete(data);
    if (deleteR.status !== 'info' || !deleteR.data) {
      amqp.sendToQueue({
        type: MessageType.SET_ERROR,
        id,
        lang,
        timeout,
        connId,
        data: {
          status: 'error',
          type: MessageType.GET_FILE_DELETE,
          message: locale.error,
          httpCode: 502,
        },
      });
      return;
    }

    const { id: fId, userId, ext, mimetype } = deleteR.data;
    const userCloud = getCloudPath(userId);
    const filePath = getFilePath({ userCloud, id: fId, ext });
    const filePreviewPath = getFilePath({ userCloud, id: fId, ext, postfix: IMAGE_PREV_POSTFIX });
    fs.unlinkSync(filePath);
    if (isImage(mimetype)) {
      fs.unlinkSync(filePreviewPath);
    }
    const dir = fs.readdirSync(userCloud);
    if (dir.length === 0) {
      fs.rmdirSync(userCloud);
    }

    amqp.sendToQueue({
      id,
      lang,
      timeout,
      connId,
      type: MessageType.SET_FILE_DELETE,
      data: null,
    });
  }
}

export default File;
