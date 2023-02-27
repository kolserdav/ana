// @ts-check
const { existsSync, symlink } = require('fs');
const { resolve } = require('path');

const destPath = resolve(__dirname, '../packages/server/src/data/files.json');
const srcPath = resolve(__dirname, '../packages/app/data/files.json');

if (existsSync(destPath)) {
  console.info('Symlink files.json created:', destPath);
} else {
  symlink(srcPath, destPath, 'file', (err) => {
    if (err) {
      console.error('Error create files.json symlink', err);
      return;
    }
    console.info('Symlink files.json created:', destPath);
  });
}
