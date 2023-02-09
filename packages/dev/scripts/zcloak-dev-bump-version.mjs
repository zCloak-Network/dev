#!/usr/bin/env node
// Copyright 2021-2023 zcloak authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { execSync } from './execute.mjs';

console.log('$ zcloak-dev-bump-version', process.argv.slice(2).join(' '));

execSync('zcloak-exec-changeset version');

execSync('yarn');
