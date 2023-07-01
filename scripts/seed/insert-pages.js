// @ts-check

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

const SQL_PATH = path.resolve(__dirname, '../../data/pages.sql');

const data = fs.readFileSync(SQL_PATH).toString();

const inserts = data.split(';').filter((item) => item);

(async () => {
  for (let i = 0; inserts[i]; i++) {
    const item = inserts[i];
    if (item) {
      console.log('Running sql', item);
      await prisma.$queryRawUnsafe(item);
    }
  }
})();
