// @ts-check
const { existsSync, copyFile } = require('fs');
const { resolve } = require('path');

const srcPath = resolve(__dirname, '../tests/constants.example.json');
const destPath = resolve(__dirname, '../tests/constants.json');

if (existsSync(destPath)) {
  console.info('Test constants copied:', destPath);
} else {
  copyFile(srcPath, destPath, (err) => {
    if (err) {
      console.error('Error create symlink', err);
      return;
    }
    console.info('Test constants copied:', destPath);
  });
}
