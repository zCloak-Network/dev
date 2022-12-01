#!/usr/bin/env node
// Copyright 2021-2022 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { execSync } from './execute.mjs';

console.log('$ zcloak-ci-ghact-release-pr', process.argv.slice(2).join(' '));

execSync(
  `yarn zcloak-exec-release-please release-pr --repo-url=${process.env.GITHUB_REPOSITORY} --token=${process.env.GH_PAT} --release-type=node`
);
