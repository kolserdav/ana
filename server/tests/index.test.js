// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const { run } = require('node:test');
const path = require('path');

const dirUnitPath = path.resolve(__dirname, 'unit');
const dirE2ePath = path.resolve(__dirname, 'e2e');

const dirUnit = fs.readdirSync(dirUnitPath);
const dirE2e = fs.readdirSync(dirE2ePath);

const pathsUnit = dirUnit.map((item) => path.resolve(dirUnitPath, item));
const pathsE2e = dirE2e.map((item) => path.resolve(dirE2ePath, item));

const paths = pathsUnit.concat(pathsE2e);
run({ files: paths }).pipe(process.stdout);
