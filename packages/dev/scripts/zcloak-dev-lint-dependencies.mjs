#!/usr/bin/env node
// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';

import { lintDependencies } from '@zcloak/lint';
import { error, warn } from '@zcloak/lint/feedback';

console.log('$ zcloak-dev-lint-dependencies', process.argv.slice(2).join(' '));

const argv = yargs(process.argv.slice(2))
  .options({
    fix: {
      description: 'Auto fix errors',
      type: 'boolean'
    }
  })
  .strict().argv;

(async () => {
  process.chdir('packages');
  const dirs = fs
    .readdirSync('.')
    .filter(
      (dir) => fs.statSync(dir).isDirectory() && fs.existsSync(path.join(process.cwd(), dir, 'src'))
    );

  const errors = [];
  const warns = [];

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

    if (
      !fs.existsSync(path.join(process.cwd(), 'public')) &&
      !fs.existsSync(path.join(process.cwd(), '.skip-build'))
    ) {
      const { errors: _errors, warns: _warns } = await lintDependencies(
        `packages/${dir}`,
        argv.fix
      );

      errors.push(..._errors);
      warns.push(..._warns);
    }

    process.chdir('..');
  }

  errors.forEach((e) => error(e));
  warns.forEach((w) => warn(w));

  if (errors.length > 0) {
    process.exit(1);
  }
})();
