// @ts-check
const dotenv = require('dotenv');
dotenv.config();
const { PrismaClient } = require('@prisma/client');
const categs = require('../data/categs.json');
const tags = require('../data/tags.json');

const prisma = new PrismaClient();

(async () => {
  for (let i = 0; categs[i]; i++) {
    const { name } = categs[i];
    let category = await prisma.category.findFirst({
      where: {
        name,
      },
    });
    if (!category) {
      category = await prisma.category.create({
        data: {
          name,
        },
      });
    }

    const { childs } = tags[i];
    for (let n = 0; childs[n]; n++) {
      const { name } = childs[n];
      const check = await prisma.subcategory.findFirst({
        where: {
          name,
        },
      });
      if (check) {
        continue;
      }
      await prisma.subcategory.create({
        data: {
          categoryId: category.id,
          name,
        },
      });
    }
  }

  console.log('Data from', __filename, 'are insert');
})();
