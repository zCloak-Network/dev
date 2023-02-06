#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';

import { execSync } from './execute.mjs';

const TYPES = ['major', 'minor', 'patch', 'pre'];

const [type] = yargs(process.argv.slice(2)).demandCommand(1).argv._;

if (!TYPES.includes(type)) {
  throw new Error(`Invalid version bump "${type}", expected one of ${TYPES.join(', ')}`);
}

function readRootPkgJson() {
  const rootPath = path.join(process.cwd(), 'package.json');
  const rootJson = JSON.parse(fs.readFileSync(rootPath, 'utf8'));

  return [rootPath, rootJson];
}

function writePkgJson(path, json) {
  fs.writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`);
}

function updatePackage(version, pkgPath, json) {
  const updated = Object.keys(json).reduce((result, key) => {
    if (key === 'version') {
      result[key] = version;
    } else if (key !== 'stableVersion') {
      result[key] = json[key];
    }

    return result;
  }, {});

  writePkgJson(pkgPath, updated);
}

console.log('$ zcloak-dev-version', process.argv.slice(2).join(' '));

execSync(`yarn version ${type === 'pre' ? 'prerelease' : type}`);

const [rootPath, rootJson] = readRootPkgJson();

updatePackage(rootJson.version, rootPath, rootJson);

// yarn workspaces does an OOM, manual looping takes ages
if (fs.existsSync('packages')) {
  const packages = fs
    .readdirSync('packages')
    .map((dir) => path.join(process.cwd(), 'packages', dir, 'package.json'))
    .filter((pkgPath) => fs.existsSync(pkgPath))
    .map((pkgPath) => [pkgPath, JSON.parse(fs.readFileSync(pkgPath, 'utf8'))]);

  packages.forEach(([pkgPath, json]) => {
    updatePackage(rootJson.version, pkgPath, json);
  });
}

execSync('yarn');
