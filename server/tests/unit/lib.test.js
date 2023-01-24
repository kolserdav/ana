// @ts-check

/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { test } = require('node:test');
const { checkCors, wait } = require('../../dist/utils/lib');

test('Check CORS', () => {
  /**
   * @type {any}
   */
  const CORS = process.env.CORS;
  const cors = CORS.split(',');
  assert.equal(checkCors({ origin: cors[0] }), true);
});

const time = 1;
test('Check Wait', { timeout: time + 2 }, async (t) => {
  await t.test('waiting...', async () => {
    await wait(time);
    return assert.equal(1, 1);
  });
});
