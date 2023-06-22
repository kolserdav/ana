// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require('puppeteer');
const { TEST_HEADLESS } = require('./constants.json');
// @ts-ignore
const { spawn, ChildProcessWithoutNullStreams } = require('child_process');
const { log } = require('../packages/server/dist/utils/lib');
const path = require('path');

/**
 * @type {any}
 */
const { env } = process;

/**
 *
 * @param {string} executable
 * @param  {string[]} args
 * @param {NodeJS.ProcessEnv} _env
 * @returns
 */
const spawnCommand = async (executable, args, _env = env) => {
  let data = '';
  const command = spawn(executable, args, {
    env: _env,
  });
  command.stdout.on('data', (d) => {
    data += d.toString();
    log('log', d.toString(), {}, true);
  });
  command.stderr.on('data', (d) => {
    log('error', d.toString(), {}, true);
  });
  /**
   * @type {number | null}
   */
  const code = await new Promise((resolve) => {
    command.on('exit', (code) => {
      resolve(code);
    });
  });

  return {
    data,
    code,
  };
};

/**
 *
 * @param {{url: string}} param0
 */
async function getPage({ url }) {
  let executablePath;
  if (env.CI === 'true') {
    const { data } = await spawnCommand('which', ['chrome']);
    executablePath = path.normalize(data.trim().replace(/[\s\r\n]+/g, ''));
    log('info', 'Chrome executable path:', executablePath, true);
  }

  const browser = await puppeteer.launch({
    headless: TEST_HEADLESS,
    executablePath,
  });
  const [page] = await browser.pages();
  page.on('console', (message) => {
    const text = message.text();
    if (!/DevTools/.test(text) && !/webpack-dev-server/.test(text)) {
      log('info', 'Browser console', text, true);
    }
  });
  await page.goto(url);
  return { page, browser };
}

/**
 *
 * @returns {Promise<void>}
 */
const startServer = async () => {
  log('info', 'Starting application', '...', true);
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, 3000);
  });

  log('log', 'Run command:', '"npm run start:server"', true);
  await spawnCommand('npm', ['run', 'start:server']);
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, 4000);
  });

  if (env.CI === 'true') {
    log('log', 'Run command:', '"npm run build:app"', true);
    await spawnCommand('npm', ['run', 'build:app']);
  } else {
    log('log', 'Command npm run build:app skipped', { BUILD_SKIP: env.BUILD_SKIP }, true);
  }

  env.PORT = 3000;
  log('log', 'Run command:', '"npm run start:app"', true);
  await spawnCommand('npm', ['run', 'start:app'], env);
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, 4000);
  });
};

module.exports = { getPage, startServer, spawnCommand };
