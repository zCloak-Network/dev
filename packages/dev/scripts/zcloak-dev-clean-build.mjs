#!/usr/bin/env node
// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

const PKGS = path.join(process.cwd(), 'packages');
const DIRS = [
  'build',
  ...['cjs', 'esm'].map((d) => `build-${d}`),
  ...['tsbuildinfo', 'build.tsbuildinfo'].map((d) => `tsconfig.${d}`)
];

console.log('$ zcloak-dev-clean-build', process.argv.slice(2).join(' '));

function getPaths(dir) {
  return DIRS.map((p) => path.join(dir, p));
}

function cleanDirs(dirs) {
  dirs.forEach((d) => rimraf.sync(d));
}

cleanDirs(getPaths(process.cwd()));

if (fs.existsSync(PKGS)) {
  cleanDirs(getPaths(PKGS));
  cleanDirs(
    fs
      .readdirSync(PKGS)
      .map((f) => path.join(PKGS, f))
      .filter((f) => fs.statSync(f).isDirectory())
      .reduce((res, d) => res.concat(getPaths(d)), [])
  );
}
