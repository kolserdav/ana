// @ts-check
const { existsSync, symlink } = require('fs');
const { resolve } = require('path');

const destPath = resolve(__dirname, '../server/src/types/interfaces.ts');
const srcPath = resolve(__dirname, '../app/types/interfaces.ts');

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
