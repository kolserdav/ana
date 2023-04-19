// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { test } = require('node:test');
const { wait } = require('../../packages/server/dist/utils/lib');
const { APP_URL, TIMEOUT } = require('../constants.json');
const { getPage } = require('../lib');

const test1 = async () => {
  let tests = '';
  const { page, browser } = await getPage({ url: `${APP_URL}/test` });
  await page.waitForSelector('main');
  await wait(TIMEOUT);
  tests = await page.evaluate(async () => {
    const main = document.querySelector('main');
    let res = '';
    if (main) {
      const { innerText } = main;
      res = innerText;
    }
    return res;
  });
  await page.close();
  await browser.close();
  await test('Check WS', () => {
    return assert.equal('1', tests);
  });
};

test1();
