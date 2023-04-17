// @ts-check
const { existsSync, readFileSync, writeFileSync, readlinkSync, symlink } = require('fs');
const { resolve } = require('path');
const os = require('os');

const isWin = os.platform() === 'win32';

const destPath = resolve(__dirname, '../packages/server/src/types/interfaces.ts');
const srcPath = resolve(__dirname, '../packages/app/types/interfaces.ts');

if (isWin) {
  const data = readFileSync(srcPath);
  writeFileSync(destPath, data);
  console.info('Interface copied', destPath);
} else {
  if (existsSync(destPath)) {
    console.info('Symlink created:', destPath);
  } else {
    symlink(srcPath, destPath, 'file', (err) => {
      if (err) {
        console.error('Error create symlink', err);
        return;
      }
      console.info('Symlink created:', destPath);
    });
  }
}
