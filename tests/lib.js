// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require('puppeteer');
const { TEST_HEADLESS } = require('./constants.json');

/**
 *
 * @param {{url: string}} param0
 */
async function getPage({ url }) {
  const browser = await puppeteer.launch({
    headless: TEST_HEADLESS,
  });
  const [page] = await browser.pages();
  await page.goto(url);
  return { page, browser };
}

module.exports = { getPage };
