// @ts-check
const { existsSync, copyFile } = require('fs');
const { resolve } = require('path');

const srcPath = resolve(__dirname, '../.env.example');
const destPath = resolve(__dirname, '../.env');

const srcPathC = resolve(__dirname, '../packages/app/.env.example');
const destPathC = resolve(__dirname, '../packages/app/.env');

const srcPathT = resolve(__dirname, '../packages/translate2/.env.example');
const destPathT = resolve(__dirname, '../packages/translate2/.env');

const ARGS = ['renew'];
const { argv } = process;
const RENEW_ARG = argv[2];

let renew = false;
if (RENEW_ARG === ARGS[0]) {
  renew = true;
  console.info('Renew .env files');
} else if (argv[2] !== undefined) {
  console.warn(`Argument "${RENEW_ARG}" is not in:`, ARGS, '\n');
}

if (existsSync(destPath) && !renew) {
  console.info('Env exists:', destPath);
} else {
  copyFile(srcPath, destPath, (err) => {
    if (err) {
      console.error('Error copy env', err);
      return;
    }
    console.info('Env copied:', destPath);
  });
}

if (existsSync(destPathC) && !renew) {
  console.info('Env app exists:', destPathC);
} else {
  copyFile(srcPathC, destPathC, (err) => {
    if (err) {
      console.error('Error copy env app', err);
      return;
    }
    console.info('Env app copied:', destPathC);
  });
}

if (existsSync(destPathT) && !renew) {
  console.info('Env app exists:', destPathT);
} else {
  copyFile(srcPathT, destPathT, (err) => {
    if (err) {
      console.error('Error copy env app', err);
      return;
    }
    console.info('Env translate copied:', destPathT);
  });
}
