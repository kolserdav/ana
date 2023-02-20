import fs from 'fs';
import sharp from 'sharp';
import AMQP from '../protocols/amqp';
import { ORM } from '../services/orm';
import { MessageType, SendMessageArgs } from '../types/interfaces';
import { changeImgExt, getLocale, log } from '../utils/lib';

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

    fs.writeFileSync(changeImgExt({ name: filePath, ext: file.ext }), buffer);

    const update = await orm.fileUpdate({
      where: {
        id: file.id,
      },
      data: {
        size: stats.size,
        coeff: width / height,
        width,
        height,
        filename: changeImgExt({ name: file.filename, ext: file.ext }),
      },
    });

    amqp.sendToQueue({
      id,
      lang,
      timeout,
      type: MessageType.SET_FILE_UPLOAD,
      data: update.data,
    });
  }
}

export default File;
