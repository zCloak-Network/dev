#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { execSync } from './execute.mjs';

console.log('$ zcloak-ci-ghact-publish', process.argv.slice(2).join(' '));

function runClean() {
  execSync('yarn zcloak-dev-clean-build');
}

function runCheck() {
  execSync('yarn lint');
}

function runTest() {
  execSync('yarn test');
}

function runBuild() {
  execSync('yarn build');
}

function runPublish() {
  execSync('yarn zcloak-exec-changeset publish');
}

// perform the actual CI ops
runClean();
runCheck();
runTest();
runBuild();
runPublish();
