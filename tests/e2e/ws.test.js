// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { test } = require('node:test');
const { APP_URL } = require('../constants.json');
const { getPage } = require('../lib');

test('Test WS', async () => {
  const page = await getPage({ url: `${APP_URL}/test` });
  await page.evaluate(() => {
    const main = document.querySelector('main');
  });
  assert.equal(1, 1);
});
