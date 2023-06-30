// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require('puppeteer');
const { TEST_HEADLESS } = require('../tests/constants.json');
// @ts-ignore
const { spawn } = require('child_process');
const { log } = require('../packages/server/dist/utils/lib');
const path = require('path');
const { CI } = require('./constants');

/**
 * @type {any}
 */
const { env } = process;
//
/**
 *
 * @param {string} _data
 * @param {RegExp} _match
 * @returns
 */
const changeMatch = (_data, _match) => {
  let data = _data;
  const match = data.match(_match);
  if (!match) {
    log('warn', 'Check regexp is not match', { match, _match, _data });
  }
  return match ? match[0] : data;
};

/**
 *
 * @param {string} executable
 * @param  {string[]} args
 * @param {{
 *  head?: boolean;
 *  match?: RegExp;
 *  env?: typeof process.env;
 *  noWait?: boolean;
 *  prepareData?: RegExp;
 * } | undefined} options
 * @returns {Promise<{code: number | null, commandDesc: string; data: string }>}
 */
const spawnCommand = async (executable, args, options) => {
  const commandDesc = `${executable} ${args.join(' ')}`;
  log('log', 'Run command:', commandDesc, true);
  let data = '';
  const command = spawn(executable, args, {
    env: options?.env,
  });
  command.stdout.on('data', (d) => {
    const dStr = d.toString();
    data += dStr;
    log('log', dStr, undefined, true);
  });
  command.stderr.on('data', (d) => {
    const dStr = d.toString();
    data += dStr;
    log('error', dStr, undefined, true);
  });

  /**
   * @type {number | null}
   */
  let code = null;

  if (options) {
    if (options.noWait) {
      if (options.prepareData) {
        data = changeMatch(data, options.prepareData);
      }
      if (options.match) {
        data = changeMatch(data, options.match);
      }
      return {
        data,
        code,
        commandDesc,
      };
    }
  }

  code = await new Promise((resolve) => {
    command.on('exit', (_code) => {
      resolve(_code);
    });
  });

  if (options) {
    if (options.prepareData) {
      data = changeMatch(data, options.prepareData);
    }
    if (options.match) {
      data = changeMatch(data, options.match);
    }
  }
  return {
    data,
    code,
    commandDesc,
  };
};

/**
 *
 * @param {{url: string}} param0
 */
async function getPage({ url }) {
  let executablePath;
  if (CI) {
    const { data } = await spawnCommand('which', ['chrome'], {});
    executablePath = path.normalize(data.trim().replace(/[\s\r\n]+/g, ''));
    log('info', 'Chrome executable path:', executablePath, true);
  }

  const browser = await puppeteer.launch({
    headless: TEST_HEADLESS,
    executablePath,
  });
  const [page] = await browser.pages();
  if (page) {
    page.on('console', (message) => {
      const text = message.text();
      if (!/DevTools/.test(text) && !/webpack-dev-server/.test(text)) {
        log('info', 'Browser console', text, true);
      }
    });
    await page.goto(url);
  }
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

  await spawnCommand('npm', ['run', 'start:server'], { env, noWait: true });
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, 4000);
  });

  if (env.CI === 'true') {
    await spawnCommand('npm', ['run', 'build:app'], { env });
  } else {
    log('log', 'Command npm run build:app skipped', { BUILD_SKIP: env.BUILD_SKIP }, true);
  }

  env.PORT = 3000;
  await spawnCommand('npm', ['run', 'start:app'], { env, noWait: true });
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, 4000);
  });
};

/**
 *
 * @param {{argv: typeof process.argv; index: number}} param0
 * @param {string} symbol
 * @returns {number}
 */
const needSplitNext = ({ argv, index }, symbol = '=') => {
  let shift = 1;
  if (argv[index + shift] === symbol) {
    shift = 2;
  }
  return shift;
};

/**
 * result of
 * ```
 * git ls-remote [repository]
 * ```
 * @param {string} branch
 */
const gitHeadRemote = (branch) => new RegExp(`[a-zA-Z0-9]+\\t+refs\/heads\/${branch}\n`);

module.exports = { getPage, startServer, spawnCommand, needSplitNext, gitHeadRemote };
