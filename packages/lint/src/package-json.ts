// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { resolve } from 'path';

import { readFileAsync } from './fs';

export interface PackageJson {
  dependencies: string[];
  devDependencies: string[];
  peerDependencies: string[];
}

export async function readPackageJson(): Promise<PackageJson> {
  const code = await readFileAsync(resolve(process.cwd(), 'package.json'));
  const pkg = JSON.parse(code);
  const dependencies = pkg.dependencies ? Object.keys(pkg.dependencies) : [];
  const devDependencies = pkg.devDependencies ? Object.keys(pkg.devDependencies) : [];
  const peerDependencies = pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : [];

  return { dependencies, devDependencies, peerDependencies };
}
