// @ts-check
const dotenv = require('dotenv');
dotenv.config();
const { PrismaClient } = require('@prisma/client');
const categs = require('../data/categs.json');
const tags = require('../data/tags.json');

const prisma = new PrismaClient();

(async () => {
  for (let i = 0; categs[i]; i++) {
    const { id: _id, name } = categs[i];
    const id = parseInt(_id, 10);
    const check = await prisma.category.findFirst({
      where: {
        id,
      },
    });
    if (check) {
      continue;
    }
    await prisma.category.create({
      data: {
        id,
        name,
      },
    });
  }

  for (let i = 0; tags[i]; i++) {
    const { groupId, childs } = tags[i];
    for (let n = 0; childs[n]; n++) {
      const { id: _id, name } = childs[n];
      const id = parseInt(_id, 10);
      const check = await prisma.tag.findFirst({
        where: {
          id,
        },
      });
      if (check) {
        continue;
      }
      await prisma.tag.create({
        data: {
          id,
          categoryId: parseInt(groupId, 10),
          name,
        },
      });
    }
  }
  console.log('Data from', __filename, 'are insert');
})();
