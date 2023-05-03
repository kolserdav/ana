// @ts-check
const { existsSync, copyFile } = require('fs');
const { resolve } = require('path');

const srcPath = resolve(__dirname, '../.env.example');
const destPath = resolve(__dirname, '../.env');

const srcPathC = resolve(__dirname, '../packages/app/.env.example');
const destPathC = resolve(__dirname, '../packages/app/.env');

const srcPathT = resolve(__dirname, '../packages/bottle/.env.example');
const destPathT = resolve(__dirname, '../packages/bottle/.env');

if (existsSync(destPath)) {
  console.info('Env copied:', destPath);
} else {
  copyFile(srcPath, destPath, (err) => {
    if (err) {
      console.error('Error copy env', err);
      return;
    }
    console.info('Env copied:', destPath);
  });
}

if (existsSync(destPathC)) {
  console.info('Env app copied:', destPathC);
} else {
  copyFile(srcPathC, destPathC, (err) => {
    if (err) {
      console.error('Error copy env app', err);
      return;
    }
    console.info('Env app copied:', destPathC);
  });
}

if (existsSync(destPathT)) {
  console.info('Env app copied:', destPathT);
} else {
  copyFile(srcPathT, destPathT, (err) => {
    if (err) {
      console.error('Error copy env app', err);
      return;
    }
    console.info('Env app copied:', destPathT);
  });
}
