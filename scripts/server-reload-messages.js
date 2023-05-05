// @ts-check
const { PrismaClient } = require('@prisma/client');
const next = require('../packages/app/next.config.js');

const en = require('../packages/server/dist/locales/en/lang.js').default;
const ru = require('../packages/server/dist/locales/ru/lang.js').default;
const langs = {
  en,
  ru,
};

const {
  LOCALE_DEFAULT,
  WS_MESSAGE_COMMENT_SERVER_RELOAD,
} = require('../packages/server/dist/types/interfaces.js');

const prisma = new PrismaClient();

const arg = process.argv[2];

const ARGS = ['create', 'delete'];

const _arg = arg;

switch (_arg) {
  case ARGS[0]:
    createNotifications();
    break;
  case ARGS[1]:
    console.log('DEPRECATED', 'Server reboot messages are cleared on server startup');
    deleteNotifications();
    break;
  default:
    console.log('Second argument must be one of:', ARGS);
}

function createNotifications() {
  /**
   * @type {any[]}
   */
  const _locales = next.i18n?.locales || [];

  /**
   * @type {(keyof typeof langs)[]}
   */
  const locales = _locales;

  locales.forEach(async (item) => {
    /**
     * @type {typeof en}
     */
    const lang = langs[item] || langs[LOCALE_DEFAULT];

    const res = await prisma.serverMessage.create({
      data: {
        type: 'warn',
        text: lang.server.serverReload,
        lang: item,
        comment: WS_MESSAGE_COMMENT_SERVER_RELOAD,
      },
    });
    if (res !== null) {
      console.info('Notification to reload created:', res);
    }
  });
}

/**
 * @deprecated
 * Server reboot messages are cleared on server startup
 */
async function deleteNotifications() {
  const sm = await prisma.serverMessage.findMany({
    where: {
      comment: WS_MESSAGE_COMMENT_SERVER_RELOAD,
    },
  });

  const res = await prisma.serverMessage.deleteMany({
    where: {
      OR: sm.map((item) => ({
        id: item.id,
      })),
    },
  });
  if (res !== null) {
    console.info('Notifications to reload deleted:', res);
  }
}
