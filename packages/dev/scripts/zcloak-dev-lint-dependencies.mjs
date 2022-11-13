#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';

import { error } from './feedback.js';
import { lintDependencies } from './index.js';

console.log('$ zcloak-dev-lint-dependencies', process.argv.slice(2).join(' '));

(async () => {
  process.chdir('packages');
  const dirs = fs
    .readdirSync('.')
    .filter(
      (dir) => fs.statSync(dir).isDirectory() && fs.existsSync(path.join(process.cwd(), dir, 'src'))
    );

  const errors = [];

  const locals = [];

  // get all package names
  for (const dir of dirs) {
    const { name } = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), dir, './package.json'), 'utf-8')
    );

    locals.push([dir, name]);
  }

  for (const dir of dirs) {
    process.chdir(dir);

    const { errors: _errors } = await lintDependencies(`packages/${dir}`, locals);

    errors.push(..._errors);

    process.chdir('..');
  }

  errors.forEach((e) => error(e));

  if (errors.length > 0) {
    process.exit(1);
  }
})();
