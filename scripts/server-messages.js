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
  TRANSLATE_SERVICE_UNAVAILABLE_COMMENT,
} = require('../packages/server/dist/types/interfaces.js');

const prisma = new PrismaClient();

const arg = process.argv[2];

/**
 * Deps with packages/server/src/types/index.ts ScriptServerMessagesArgName
 * @typedef {'reboot-create' | 'reboot-delete' | 'unavailable-create'} ArgName
 */

/**
 * @type {ArgName[]}
 */
const ARGS = ['reboot-create', 'reboot-delete', 'unavailable-create'];

const _arg = arg;

switch (_arg) {
  case ARGS[0]:
    createRebootNotifications();
    break;
  case ARGS[1]:
    console.log('DEPRECATED', 'Server reboot messages are cleared on server startup');
    deleteRebootNotifications();
    break;
  case ARGS[2]:
    createTranslateUnavailableNotifications();
    break;
  default:
    console.log('Second argument must be one of:', ARGS);
}

function createRebootNotifications() {
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

function createTranslateUnavailableNotifications() {
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
        type: 'error',
        text: lang.server.translateServiceNotWorking,
        lang: item,
        comment: TRANSLATE_SERVICE_UNAVAILABLE_COMMENT,
      },
    });
    if (res !== null) {
      console.info('Notification to service is not working created:', res);
    }
  });
}

/**
 * @deprecated
 * Server reboot messages are cleared on server startup
 */
async function deleteRebootNotifications() {
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
