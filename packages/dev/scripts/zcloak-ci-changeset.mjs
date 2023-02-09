#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import readChangesetState from './readChangesetStatus.mjs';

console.log('$ zcloak-ci-changeset', process.argv.slice(2).join(' '));

async function main() {
  console.log(await readChangesetState());
}

main();
