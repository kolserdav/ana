// @ts-check

/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { test } = require('node:test');
const { wait } = require('../../server/dist/utils/lib');
const { TIMEOUT } = require('../constants.json');

test('Check Wait', { timeout: TIMEOUT + 200 }, async (t) => {
  await t.test('waiting...', async () => {
    await wait(TIMEOUT);
    return assert.ok('wait end');
  });
});
