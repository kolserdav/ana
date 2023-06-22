// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const { wait } = require('../../packages/server/dist/utils/lib');
const { APP_URL, TIMEOUT } = require('../constants.json');
const { getPage, startServer, spawnCommand } = require('../lib');
const { log } = require('../../packages/server/dist/utils/lib');

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
  };

  const { page, browser } = await getPage({ url: `${APP_URL}` });
  await page.waitForSelector('main');
  await wait(TIMEOUT);
  const textarea = await page.$('textarea[spellcheck="false"]').catch((e) => {
    log('error', 'Error get textarea', e, true);
  });
  if (!textarea) {
    return exit(1);
  }
  textarea.type('Tests').catch((e) => {
    log('error', 'Error type to textarea', e, true);
  });
  await page.waitForTimeout(15000);
  const paragraphs = await page.$$('p');
  let error = false;
  const pars = [];
  for (let i = 0; paragraphs[i]; i++) {
    let value = await page.evaluate((el) => el.innerText, paragraphs[i]);
    pars.push(value);
  }
  if (pars.indexOf('Испытания') === -1 || pars.indexOf('Tests') === -1) {
    log('error', 'Translate test failed', { pars }, true);
    await spawnCommand('docker', ['logs', 'translate']);
    error = true;
  }
  if (error) {
    return exit(1);
  }
  return exit(0);
};

test1();
