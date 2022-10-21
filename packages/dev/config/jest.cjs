// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const { defaults } = require('jest-config');

module.exports = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  modulePathIgnorePatterns: ['<rootDir>/build'].concat(
    fs
      .readdirSync('packages')
      .filter((p) => fs.statSync(`packages/${p}`).isDirectory())
      .map((p) => `<rootDir>/packages/${p}/build`)
  ),
  // See https://jestjs.io/docs/configuration#extraglobals-arraystring
  sandboxInjectedGlobals: ['Math'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': require.resolve('babel-jest')
  }
};
