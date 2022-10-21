// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs-extra';
import glob from 'glob';
import glob2base from 'glob2base';
import minimatch from 'minimatch';
import path from 'path';

function normalizePath(originalPath) {
  const normalizedPath = path
    .relative(process.cwd(), path.resolve(originalPath))
    .replace(/\\/g, '/');

  return /\/$/.test(normalizedPath) ? normalizedPath.slice(0, -1) : normalizedPath || '.';
}

export default function copySync(src, dst) {
  const normalizedSource = normalizePath(src);
  const normalizedOutputDir = normalizePath(dst);
  const baseDir = normalizePath(
    glob2base({ minimatch: new minimatch.Minimatch(normalizedSource) })
  );

  glob
    .sync(normalizedSource, {
      follow: false,
      nodir: true,
      silent: true
    })
    .forEach((src) => {
      const dst =
        baseDir === '.'
          ? path.join(normalizedOutputDir, src)
          : src.replace(baseDir, normalizedOutputDir);

      if (dst !== src) {
        const stat = fs.statSync(src);

        if (stat.isDirectory()) {
          fs.ensureDirSync(dst);
        } else {
          fs.ensureDirSync(path.dirname(dst));
          fs.copySync(src, dst);
        }

        fs.chmodSync(dst, stat.mode);
      }
    });
}
