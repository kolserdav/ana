// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const puppeteer = require('puppeteer');
const { TEST_HEADLESS } = require('./constants.json');
// @ts-ignore
const { spawn, ChildProcessWithoutNullStreams } = require('child_process');
const { log } = require('../packages/server/dist/utils/lib');

/**
 * @type {any}
 */
const { env } = process;

/**
 *
 * @param {{url: string}} param0
 */
async function getPage({ url }) {
  let executablePath;
  if (env.CI === 'true') {
    executablePath = await new Promise((resolve) => {
      const chrome = spawn('npm', ['run', 'migrate'], {
        env: process.env,
      });
      chrome.stdout.on('data', (d) => {
        resolve(d.toString());
      });
      chrome.stderr.on('data', (d) => {
        const data = d.toString();
        console.log(data);
      });
    });
    log('info', 'Chrome executable path:', executablePath, true);
  }

  const browser = await puppeteer.launch({
    headless: TEST_HEADLESS,
    executablePath,
  });
  const [page] = await browser.pages();
  await page.goto(url);
  return { page, browser };
}

/**
 *
 * @returns {Promise<{close: () => void}>}
 */
const startServer = async () => {
  log('info', 'Starting application', '...', true);
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, 3000);
  });

  log('log', 'Run command:', '"npm run start:server"', true);
  let server = spawn('npm', ['run', 'start:server'], {
    env,
  });
  server.stdout.on('data', (d) => {
    console.log(d.toString());
  });
  server.stderr.on('data', (d) => {
    const data = d.toString();
    console.log(data);
  });
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, 4000);
  });

  let client;

  if (env.CI === 'true') {
    log('log', 'Run command:', '"npm run build:app"', true);
    client = spawn('npm', ['run', 'build:app'], {
      env,
    });
    client.stdout.on('data', (d) => {
      console.log(d.toString());
    });
    client.stderr.on('data', (d) => {
      const data = d.toString();
      console.log(data);
    });
    await new Promise((resolve) => {
      client.on('exit', () => {
        resolve(0);
      });
    });
  } else {
    log('log', 'Command npm run build:app skipped', { BUILD_SKIP: env.BUILD_SKIP }, true);
  }

  env.PORT = 3000;
  log('log', 'Run command:', '"npm run start:app"', true);
  client = spawn('npm', ['run', 'start:app'], {
    env,
  });
  client.stdout.on('data', (d) => {
    console.log(d.toString());
  });
  client.stderr.on('data', (d) => {
    const data = d.toString();
    console.log(data);
  });
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, 4000);
  });

  const close = () => {
    server.kill();
    client.kill();
  };

  return {
    close,
  };
};

module.exports = { getPage, startServer };
