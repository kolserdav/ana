// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const { wait } = require('../../packages/server/dist/utils/lib');
const { APP_URL, TIMEOUT } = require('../constants.json');
const { getPage, startServer, spawnCommand } = require('../lib');
const { log } = require('../../packages/server/dist/utils/lib');
const { PrismaClient } = require('@prisma/client');
const { CI } = require('../constants');

const prisma = new PrismaClient();

const test1 = async () => {
  await startServer();

  /**
   * @param {number} code
   */
  const exit = async (code) => {
    await page.close();
    await browser.close();
    log(code === 0 ? 'info' : 'error', 'Translate test exit with code', code, true);
    process.exit(code);
    return code;
  };

  const { page, browser } = await getPage({ url: `${APP_URL}` });
  await page.waitForSelector('main');
  await wait(TIMEOUT);
  let sels = await prisma.selector.findFirst({
    where: {
      type: 'textarea',
    },
  });
  if (!sels) {
    log('error', 'Selector textarea not found in database', sels);
    return exit(1);
  }
  const textarea = await page.$(`textarea[id="${sels.value}"]`).catch((e) => {
    log('error', 'Error get textarea', e, true);
  });
  if (!textarea) {
    return exit(1);
  }
  textarea.type('Tests').catch((e) => {
    log('error', 'Error type to textarea', e, true);
  });
  await page.waitForTimeout(15000);
  let error = false;

  sels = await prisma.selector.findFirst({
    where: {
      type: 'translate',
    },
  });
  if (!sels) {
    log('error', 'Selector translate not found in database', sels);
    return exit(1);
  }
  const translateT = await page.$(`div[id="${sels.value}"]`);
  if (!translateT) {
    log('error', 'Selector translate not found in page', translateT);
    return exit(1);
  }
  let translate = await page.evaluate((el) => el.querySelector('p')?.innerText, translateT);
  if (translate !== 'Испытания') {
    log('error', 'Translate test failed', { translate }, true);
    error = true;
  }

  sels = await prisma.selector.findFirst({
    where: {
      type: 'reTranslate',
    },
  });
  if (!sels) {
    log('error', 'Selector reTranslate not found in database', sels);
    return exit(1);
  }
  const reTranslateT = await page.$(`div[id="${sels.value}"]`);
  if (!reTranslateT) {
    log('error', 'Selector reTranslate not found in page', reTranslateT);
    return exit(1);
  }
  let reTranslate = await page.evaluate((el) => el.querySelector('p')?.innerText, reTranslateT);
  if (reTranslate !== 'Tests') {
    log('error', 'Re translate test failed', { reTranslate }, true);
    error = true;
  }

  if (error) {
    if (CI) {
      await spawnCommand('docker', ['logs', 'translate']);
    }
    return exit(1);
  }
  return exit(0);
};

test1();
