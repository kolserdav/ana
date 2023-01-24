// @ts-check

/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { test } = require('node:test');
const { checkCors, wait } = require('../../dist/utils/lib');
const { APP_URL } = require('../constants.json');

test('Check CORS', () => {
  assert.equal(checkCors({ origin: APP_URL }), true);
});

const time = 1;
test('Check Wait', { timeout: time + 2 }, async (t) => {
  await t.test('waiting...', async () => {
    await wait(time);
    return assert.ok('wait end');
  });
});
